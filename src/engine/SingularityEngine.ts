import { Mesh, Program, Renderer, Triangle, Vec3, Color } from "ogl";
import { vertexShader, fragmentShader } from "./index";
import { SingularityProps } from "../types";
import { meta } from "../meta";
import { defu } from "defu";

function hexToVec3(hex: string): Vec3 {
  const color = new Color(hex);
  return new Vec3(color.r, color.g, color.b);
}

export class SingularityRenderer {
  private renderer: Renderer;
  private gl: any;
  private geometry: Triangle;
  private program: Program;
  private mesh: Mesh;
  private container: HTMLElement;

  private animationId: number = 0;
  private timeStart: number = 0;
  public isPaused: boolean = false;
  private config: SingularityProps;
  private mouseX: number = 0;
  private mouseY: number = 0;
  private targetMouseX: number = 0;
  private targetMouseY: number = 0;

  constructor(container: HTMLElement, config: SingularityProps) {
    this.container = container;
    this.config = defu(config, meta.defaultConfig);

    this.renderer = new Renderer({ dpr: 2, alpha: true });
    this.gl = this.renderer.gl;
    this.container.appendChild(this.gl.canvas as HTMLCanvasElement);

    this.geometry = new Triangle(this.gl);

    this.program = new Program(this.gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new Vec3(
            this.gl.canvas.width,
            this.gl.canvas.height,
            this.gl.canvas.width / this.gl.canvas.height,
          ),
        },
        iMouse: { value: new Vec3(0, 0, 0) },
        hue: { value: this.config.hue },
        speed: { value: this.config.speed },
        brightness: { value: this.config.brightness },
        positionX: { value: this.config.positionX },
        positionY: { value: this.config.positionY },
        distortion: { value: this.config.distortion },
        accretionSize: { value: this.config.accretionSize },
        blackHoleMass: { value: this.config.blackHoleMass ?? 1.0 },
        vortexDetail: { value: this.config.vortexDetail },
        glowIntensity: { value: this.config.glowIntensity },
        pulseFrequency: { value: this.config.pulseFrequency },
        rotationSpeed: { value: this.config.rotationSpeed },
        rotationX: { value: this.config.rotationX ?? 0 },
        rotationY: { value: this.config.rotationY ?? 0 },
        mouseResponse: { value: this.config.mouseResponse },
        quantumParticles: { value: this.config.quantumParticles },
        secondaryColor: {
          value: this.config.secondaryColor
            ? hexToVec3(this.config.secondaryColor)
            : new Vec3(0.0, 0.5, 1.0),
        },
        colorMixStrength: {
          value: this.config.colorScheme === "classic" ? 0.0 : 0.3,
        },
        colorMode: { value: this.getColorModeInt(this.config.colorScheme) },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });

    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });

    this.resize();
    window.addEventListener("resize", this.resize);
    window.addEventListener("mousemove", this.onMouseMove);
    this.animationId = requestAnimationFrame(this.update);
  }

  private onMouseMove = (e: MouseEvent) => {
    const rect = this.container.getBoundingClientRect();
    this.targetMouseX = (e.clientX - rect.left) / rect.width;
    this.targetMouseY = (e.clientY - rect.top) / rect.height;
  };

  public updateConfig(newConfig: Partial<SingularityProps>) {
    this.config = { ...this.config, ...newConfig };

    // Update uniforms
    const uniforms = this.program.uniforms;
    uniforms.hue.value = this.config.hue;
    uniforms.speed.value = this.config.speed;
    uniforms.brightness.value = this.config.brightness;
    uniforms.positionX.value = this.config.positionX;
    uniforms.positionY.value = this.config.positionY;
    uniforms.distortion.value = this.config.distortion;
    uniforms.blackHoleMass.value = this.config.blackHoleMass ?? 1.0;
    uniforms.accretionSize.value = this.config.accretionSize;
    uniforms.vortexDetail.value = this.config.vortexDetail;
    uniforms.glowIntensity.value = this.config.glowIntensity;
    uniforms.pulseFrequency.value = this.config.pulseFrequency;
    uniforms.rotationSpeed.value = this.config.rotationSpeed;
    uniforms.rotationX.value = this.config.rotationX ?? 0;
    uniforms.rotationY.value = this.config.rotationY ?? 0;
    uniforms.mouseResponse.value = this.config.mouseResponse;
    uniforms.quantumParticles.value = this.config.quantumParticles;

    // Update color mix strength based on scheme
    uniforms.colorMixStrength.value =
      this.config.colorScheme === "classic" ? 0.0 : 0.3;
    uniforms.colorMode.value = this.getColorModeInt(this.config.colorScheme);

    if (this.config.secondaryColor) {
      uniforms.secondaryColor.value = hexToVec3(this.config.secondaryColor);
    }
  }

  private getColorModeInt(scheme: string | undefined): number {
    switch (scheme) {
      case "mono":
        return 1;
      case "duo":
        return 2;
      case "rainbow":
        return 3;
      case "classic":
      default:
        return 0;
    }
  }

  public resize = () => {
    if (!this.container) return;
    const dpr = window.devicePixelRatio || 1;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.renderer.setSize(width * dpr, height * dpr);
    this.gl.canvas.style.width = `${width}px`;
    this.gl.canvas.style.height = `${height}px`;
    this.program.uniforms.iResolution.value.set(
      this.gl.canvas.width,
      this.gl.canvas.height,
      this.gl.canvas.width / this.gl.canvas.height,
    );
  };

  private update = (time: number) => {
    if (this.isPaused) return;
    if (!this.timeStart) this.timeStart = time;
    this.animationId = requestAnimationFrame(this.update);

    // Smooth mouse movement
    const lerp = 0.05;
    this.mouseX += (this.targetMouseX - this.mouseX) * lerp;
    this.mouseY += (this.targetMouseY - this.mouseY) * lerp;
    this.program.uniforms.iMouse.value.set(this.mouseX, this.mouseY, 0);

    this.program.uniforms.iTime.value = (time - this.timeStart) * 0.001;
    this.renderer.render({ scene: this.mesh });
  };

  public pause() {
    this.isPaused = true;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = 0;
    }
  }

  public resume() {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.animationId = requestAnimationFrame(this.update);
  }

  public restart() {
    this.timeStart = 0;
    if (this.isPaused) {
      this.resume();
    }
  }

  public destroy() {
    this.pause();
    window.removeEventListener("resize", this.resize);
    window.removeEventListener("mousemove", this.onMouseMove);
    if (this.container.contains(this.gl.canvas as HTMLCanvasElement)) {
      this.container.removeChild(this.gl.canvas as HTMLCanvasElement);
    }
    this.gl.getExtension("WEBGL_lose_context")?.loseContext();
  }
}

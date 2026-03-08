import { generateRandomPalette, rand } from "@bg-effects/shared";
import type { EffectMeta } from "@bg-effects/core";
import type { SingularityProps } from "./types";

export const meta: EffectMeta<SingularityProps> = {
  id: "singularity",
  name: {
    en: "Singularity",
    "zh-CN": "奇点",
  },
  category: "space",
  version: "1.0.0",

  defaultConfig: {
    debug: false,
    lang: "zh-CN",

    // Basic
    hue: 0,
    speed: 1.0,
    brightness: 1.0,
    positionX: 0.5,
    positionY: 0.5,

    // Visual enhancement
    distortion: 0.0,
    accretionSize: 1.2,
    blackHoleMass: 1.0,
    vortexDetail: 9.0,
    glowIntensity: 0.0,

    // Interactive dynamics
    pulseFrequency: 1.0,
    rotationSpeed: 0.0,
    mouseResponse: 0.5,

    // Artistic creativity
    colorScheme: "classic",
    secondaryColor: "#00ffff",
    quantumParticles: 0,
  },

  randomize: (current, tab?) => {
    const result = { ...current };

    if (!tab) {
      // Randomize all properties
      const colors = generateRandomPalette(3);
      result.hue = rand(0, 360);
      result.speed = rand(0.5, 2.5);
      result.brightness = rand(0.8, 1.5);
      result.positionX = rand(0.1, 0.9);
      result.positionY = rand(0.1, 0.9);
      result.distortion = rand(0.5, 1.5);
      result.accretionSize = rand(0.8, 2.2);
      result.blackHoleMass = rand(0.5, 1.5);
      result.vortexDetail = rand(2, 8);
      result.pulseFrequency = rand(0.2, 2.0);
      result.rotationSpeed = rand(0.5, 2.0);
      result.rotationX = rand(-1.0, 1.0);
      result.rotationY = rand(-1.0, 1.0);
      result.colorScheme = ["classic", "mono", "duo", "rainbow"][
        Math.floor(Math.random() * 4)
      ] as any;
      result.secondaryColor = colors[1];
      result.quantumParticles = Math.floor(rand(0, 10)) * 10;
      return result;
    }

    // Tab-specific randomization
    if (tab === "basic") {
      result.hue = rand(0, 360);
      result.speed = rand(0.5, 2.5);
      result.brightness = rand(0.8, 1.5);
      result.positionX = rand(0.1, 0.9);
      result.positionY = rand(0.1, 0.9);
      return result;
    }

    if (tab === "visual") {
      result.distortion = rand(0.5, 1.5);
      result.blackHoleMass = rand(0.5, 1.5);
      result.accretionSize = rand(0.8, 2.2);
      result.vortexDetail = rand(2, 8);
      return result;
    }

    if (tab === "dynamics") {
      result.pulseFrequency = rand(0.2, 2.0);
      result.rotationSpeed = rand(0.5, 2.0);
      result.rotationX = rand(-1.0, 1.0);
      result.rotationY = rand(-1.0, 1.0);
      return result;
    }

    if (tab === "artistic") {
      const colors = generateRandomPalette(3);
      result.colorScheme = ["classic", "mono", "duo", "rainbow"][
        Math.floor(Math.random() * 4)
      ] as any;
      result.secondaryColor = colors[1];
      result.quantumParticles = Math.floor(rand(0, 10)) * 10;
      return result;
    }

    return result;
  },

  presets: [
    {
      id: "singularity_classic",
      name: { en: "Classic Singularity", "zh-CN": "经典奇点" },
      config: {
        hue: 0,
        speed: 1.0,
        brightness: 1.0,
        positionX: 0.5,
        positionY: 0.5,
        distortion: 1.0,
        blackHoleMass: 1.0,
        vortexDetail: 9,
        glowIntensity: 0.0,
        pulseFrequency: 0.0,
        rotationSpeed: 0.0,
        mouseResponse: 0,
        colorScheme: "classic",
        secondaryColor: "#ff6b6b",
        hueShift: 0,
        quantumParticles: 0,
      },
    },
    {
      id: "singularity_vortex",
      name: { en: "Vortex Storm", "zh-CN": "涡旋风暴" },
      config: {
        hue: 200,
        speed: 2.5,
        brightness: 1.2,
        positionX: 0.5,
        positionY: 0.5,
        distortion: 1.8,
        vortexDetail: 8,
        pulseFrequency: 2.5,
        rotationSpeed: 2.0,
        mouseResponse: 0.8,
        colorScheme: "duo",
        secondaryColor: "#00ffff",
        hueShift: 120,
        quantumParticles: 0,
      },
    },
    {
      id: "singularity_quantum",
      name: { en: "Quantum Foam", "zh-CN": "量子泡沫" },
      config: {
        hue: 320,
        speed: 0.7,
        brightness: 0.9,
        positionX: 0.5,
        positionY: 0.5,
        distortion: 0.6,
        accretionSize: 0.9,
        vortexDetail: 10,
        pulseFrequency: 0.5,
        rotationSpeed: 0.3,
        colorScheme: "rainbow",
        secondaryColor: "#ff00ff",
        quantumParticles: 0,
      },
    },
  ],
};

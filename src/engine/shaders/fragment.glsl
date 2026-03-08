#version 300 es
precision highp float;

uniform float iTime;
uniform vec3 iResolution;
uniform vec3 iMouse;
uniform float hue;
uniform float speed;
uniform float brightness;
uniform float positionX;
uniform float positionY;
uniform float distortion;
uniform float accretionSize;
uniform float blackHoleMass;
uniform float vortexDetail;
uniform float glowIntensity;
uniform float pulseFrequency;
uniform float rotationSpeed;
uniform float mouseResponse;
uniform int colorMode; // 0=Classic, 1=Mono, 2=Duo, 3=Rainbow
uniform vec3 secondaryColor;
uniform float colorMixStrength;
uniform float rotationX; // Pitch
uniform float rotationY; // Yaw
uniform float quantumParticles;

in vec2 vUv;
out vec4 fragColor;

vec3 rgb2yiq(vec3 c) {
    float y = dot(c, vec3(0.299, 0.587, 0.114));
    float i = dot(c, vec3(0.596, -0.274, -0.322));
    float q = dot(c, vec3(0.211, -0.523, 0.312));
    return vec3(y, i, q);
}

vec3 yiq2rgb(vec3 c) {
    float r = c.x + 0.956 * c.y + 0.621 * c.z;
    float g = c.x - 0.272 * c.y - 0.647 * c.z;
    float b = c.x - 1.106 * c.y + 1.703 * c.z;
    return vec3(r, g, b);
}

vec3 adjustHue(vec3 color, float hueDeg) {
    float hueRad = hueDeg * 3.14159265 / 180.0;
    vec3 yiq = rgb2yiq(color);
    float cosA = cos(hueRad);
    float sinA = sin(hueRad);
    float i = yiq.y * cosA - yiq.z * sinA;
    float q = yiq.y * sinA + yiq.z * cosA;
    yiq.y = i;
    yiq.z = q;
    return yiq2rgb(yiq);
}

float hash(vec2 p) {
    p = fract(p * vec2(123.34, 345.45));
    p += dot(p, p + 34.345);
    return fract(p.x * p.y);
}

void main() {
    vec2 F = vUv * iResolution.xy;
    float t = iTime * speed;
    
    // Apply pulse effect
    float pulse = 1.0 + 0.1 * pulseFrequency * sin(t * pulseFrequency);
    
    // Apply rotation
    vec2 center = vec2(positionX, 1.0 - positionY) * iResolution.xy;
    
    // Mouse influence
    vec2 mouseOffset = (iMouse.xy - vec2(0.5)) * mouseResponse * 0.5;
    center += mouseOffset;

    vec2 dir = F - center;
    float angle = rotationSpeed * t * 0.1;
    float ca = cos(angle), sa = sin(angle);
    dir = vec2(ca * dir.x - sa * dir.y, sa * dir.x + ca * dir.y);
    F = center + dir;
    
    // Distortion factor
    float distort = 1.0 + (distortion - 1.0) * 0.5;
    
    //Iterator and attenuation (distance-squared)
    float i = .2, a;
    //Resolution for scaling and centering
    vec2 r = iResolution.xy;
    
    //Centered ratio-corrected coordinates with scale correction for black hole mass
    // accretionSize input: smaller value -> larger disk.
    float sizeFactor = max(0.1, accretionSize); 
    
    vec2 p = (F + F - r * vec2(positionX * 2.0, (1.0 - positionY) * 2.0)) / r.y / (.7 * sizeFactor);
    
    // Apply Distortion (Space Warping)
    float dist = length(p);
    p *= 1.0 + distortion * 0.5 * sin(dist * 5.0 - t * 2.0);
    
    // Apply 3D Tilt (Simulated)
    // Rotate around X axis (Pitch) -> Scale Y
    p.y /= cos(rotationX * 1.57); // 90 degrees max
    // Rotate around Y axis (Yaw) -> Scale X
    p.x /= cos(rotationY * 1.57);

    vec2 d = vec2(-1, 1),
      //Blackhole center
      b = p - i * d,
      //Rotate and apply perspective
      c = p * mat2(1, 1, d / (.1 + i / dot(b, b))),
      //Rotate into spiraling coordinates
      v = c * mat2(cos(.5 * log(a = dot(c, c)) + t * i + vec4(0, 33, 11, 0))) / i,
      //Waves cumulative total for coloring
      w = vec2(0.0);
    
    //Loop through waves with vortex detail control
    int detail = int(vortexDetail);
    for (int j = 0; j < detail; j++) {
        i++;
        w += 1. + sin(v);
        //Distort coordinates
        v += .7 * sin(v.yx * i + t) / i + .5;
    }
    
    //Acretion disk radius with size control
    // We already scaled 'p', so 'c' and 'v' are scaled. 
    // The original logic multiplied by accretionSize here.
    // If we scaled space down (to make object big), v is small. 
    // We don't need double application.
    float len_i = length(sin(v / .3) * .4 + c * (3. + d));
    
    //Red/blue gradient
    vec4 O = 1. - exp(-exp(c.x * vec4(.6, -.4, -1, 0))
      //Wave coloring
      / vec4(w.xy, w.yx)
      //Acretion disk brightness
      / (2. + len_i * len_i / 4. - len_i)
      //Center darkness
      / (.5 + 1. / a)
      //Rim highlight
      / (.03 + abs(length(p) - (0.7 * blackHoleMass)))
    );
    
    // Color Mode Logic
    vec3 baseCol = O.rgb;
    vec3 outCol = baseCol;

    if (colorMode == 0) { // Classic
        outCol = adjustHue(baseCol, hue);
    } else if (colorMode == 1) { // Mono (Tinted)
        // Use luminance of O for intensity, apply secondaryColor
        float lum = dot(baseCol, vec3(0.299, 0.587, 0.114));
        outCol = mix(vec3(lum), secondaryColor * lum * 2.0, 0.8);
        outCol = adjustHue(outCol, hue); // Allow hue rotation of the mono color
    } else if (colorMode == 2) { // Duo
        outCol = adjustHue(baseCol, hue);
        outCol = mix(outCol, secondaryColor, colorMixStrength * (1.0 - O.r));
    } else if (colorMode == 3) { // Rainbow
        // Hue varies with radius and angle
        float rainbowHue = hue + length(p) * 100.0 + atan(p.y, p.x) * 20.0 + iTime;
        outCol = adjustHue(baseCol, rainbowHue);
        outCol = mix(outCol, secondaryColor, 0.2); // Slight tint
    } else {
        outCol = adjustHue(baseCol, hue);
    }
    
    // Brightness adjustment
    outCol *= brightness * pulse;
    
    // Quantum particles (simple noise)
    if (quantumParticles > 0.0) {
        float noise = hash(vUv * 10.0 + t);
        if (noise < (quantumParticles / 1000.0)) {
            outCol += vec3(1.0, 1.0, 1.0) * 0.5; // Constant brightness for particles
        }
    }
    
    // Clamp
    outCol = clamp(outCol, 0.0, 1.0);
    
    fragColor = vec4(outCol, 1.0);
}
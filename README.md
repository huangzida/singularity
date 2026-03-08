# @bg-effects/singularity

[English](./README.md) | [简体中文](./README_CN.md)

Singularity Effect - A high-performance singularity background effect built with OGL and Vue.

[Live Demo](https://huangzida.github.io/singularity/)

---

### **Features**

- 🚀 **High Performance**: Built on OGL (a lightweight WebGL library), ensuring a smooth visual experience.
- 🎨 **Highly Customizable**: Supports various parameters like hue, speed, brightness, position, distortion, accretion size, black hole mass, and vortex detail.
- 🛠️ **Built-in Debug Panel**: Intuitive debugging interface for real-time parameter adjustment and configuration randomization.
- 📦 **Easy Integration**: Simple Vue components with support for on-demand imports.

### **Installation**

```bash
pnpm add @bg-effects/singularity ogl
```

> **Note**: `ogl` is a peer dependency and needs to be installed manually.

### **API**

#### **Props**

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `hue` | `number` | `0` | Hue adjustment (0-360) |
| `speed` | `number` | `1.0` | Animation speed |
| `brightness` | `number` | `1.0` | Brightness level |
| `positionX` | `number` | `0.5` | Center X coordinate (0-1) |
| `positionY` | `number` | `0.5` | Center Y coordinate (0-1) |
| `distortion` | `number` | `0.0` | Spatial distortion level |
| `accretionSize` | `number` | `1.2` | Accretion disk size |
| `blackHoleMass` | `number` | `1.0` | Black hole mass / Gravity strength |
| `vortexDetail` | `number` | `5` | Vortex detail complexity |
| `pulseFrequency` | `number` | `1.0` | Pulse frequency |
| `rotationSpeed` | `number` | `1.0` | Rotation speed |
| `colorScheme` | `'classic' \| 'mono' \| 'duo' \| 'rainbow'` | `'classic'` | Color scheme selection |
| `secondaryColor` | `string` | `'#00ffff'` | Secondary color (HEX) |
| `quantumParticles` | `number` | `0` | Number of quantum particles |
| `debug` | `boolean` | `false` | Enable/disable debug panel |
| `lang` | `'zh-CN' \| 'en'` | `'zh-CN'` | UI language |

### **Usage**

```vue
<script setup>
import { Singularity } from "@bg-effects/singularity";
</script>

<template>
  <div style="width: 100vw; height: 100vh; background: #000;">
    <Singularity :speed="1.2" :black-hole-mass="1.5" color-scheme="duo" />
  </div>
</template>
```

### **Local Development**

```bash
# Install dependencies
pnpm install

# Start development server (Playground)
pnpm dev

# Build project
pnpm build
```

### **License**

MIT

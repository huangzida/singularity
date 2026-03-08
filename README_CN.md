# @bg-effects/singularity

[English](./README.md) | [简体中文](./README_CN.md)

基于 OGL 和 Vue 构建的高性能奇点 (Singularity) 背景特效。

[在线演示](https://huangzida.github.io/singularity/)

---

### **功能模块**

- 🚀 **高性能渲染**: 基于 OGL (轻量级 WebGL 库) 构建，确保流畅的视觉体验。
- 🎨 **高度可定制**: 支持调整色相、速度、亮度、位置、畸变、积聚盘大小、黑洞质量、漩涡细节等多种参数。
- 🛠️ **内置调试面板**: 提供直观的调试界面，支持实时参数调整与随机化配置。
- 📦 **易于集成**: 简单易用的 Vue 组件，支持按需引入。

### **安装方式**

```bash
pnpm add @bg-effects/singularity ogl
```

> **注意**: `ogl` 是 peer dependency，需要手动安装。

### **主要 API**

#### **属性 (Props)**

| 属性名 | 类型 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `hue` | `number` | `0` | 色相 (0-360) |
| `speed` | `number` | `1.0` | 动画速度 |
| `brightness` | `number` | `1.0` | 亮度 |
| `positionX` | `number` | `0.5` | 中心 X 坐标 (0-1) |
| `positionY` | `number` | `0.5` | 中心 Y 坐标 (0-1) |
| `distortion` | `number` | `0.0` | 空间畸变程度 |
| `accretionSize` | `number` | `1.2` | 积聚盘大小 |
| `blackHoleMass` | `number` | `1.0` | 黑洞质量/引力强度 |
| `vortexDetail` | `number` | `5` | 漩涡细节等级 |
| `pulseFrequency` | `number` | `1.0` | 脉冲频率 |
| `rotationSpeed` | `number` | `1.0` | 旋转速度 |
| `colorScheme` | `'classic' \| 'mono' \| 'duo' \| 'rainbow'` | `'classic'` | 色彩方案 |
| `secondaryColor` | `string` | `'#00ffff'` | 辅助颜色 (HEX) |
| `quantumParticles` | `number` | `0` | 量子粒子数量 |
| `debug` | `boolean` | `false` | 是否开启调试面板 |
| `lang` | `'zh-CN' \| 'en'` | `'zh-CN'` | UI 语言 |

### **使用示例**

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

### **本地开发**

```bash
# 安装依赖
pnpm install

# 启动开发服务器 (Playground)
pnpm dev

# 构建项目
pnpm build
```

### **许可**

MIT

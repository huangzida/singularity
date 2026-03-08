export interface SingularityProps {
  className?: string;
  debug?: boolean;
  lang?: "zh-CN" | "en";

  // Basic properties (from existing)
  hue?: number;
  speed?: number;
  brightness?: number;
  positionX?: number;
  positionY?: number;

  // Visual enhancement
  distortion?: number; // 扭曲强度 0-2
  accretionSize?: number; // 吸积盘大小 0.1-3
  blackHoleMass?: number; // 黑洞质量(大小) 0.1-2
  vortexDetail?: number; // 涡流细节 1-10
  glowIntensity?: number; // 辉光强度 0-1

  // Interactive dynamics
  pulseFrequency?: number; // 脉动频率 0-5
  rotationSpeed?: number; // 旋转速度 0-5
  rotationX?: number; // X轴旋转(Pitch) -1 to 1
  rotationY?: number; // Y轴旋转(Yaw) -1 to 1
  mouseResponse?: number; // 鼠标响应 0-1

  // Artistic creativity
  colorScheme?: "classic" | "mono" | "duo" | "rainbow"; // 颜色方案
  secondaryColor?: string; // 次要颜色 hex
  quantumParticles?: number; // 量子粒子数量 0-1000
}

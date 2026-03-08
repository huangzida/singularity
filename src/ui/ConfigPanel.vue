<script setup lang="ts">
import { ref, computed } from "vue";
import zhCN from "../locales/zh-CN.json";
import en from "../locales/en.json";
import { SubTabs } from "@bg-effects/shared";
import type { SingularityProps } from "../types";

const props = defineProps<{
  config: SingularityProps;
  lang?: "zh-CN" | "en";
}>();

const emit = defineEmits<{
  "update:config": [value: SingularityProps];
}>();

const activeTab = ref("basic");

const updateConfig = (key: keyof SingularityProps, value: any) => {
  emit("update:config", {
    ...props.config,
    [key]: value,
  });
};

// 暴露activeTab供父组件使用
defineExpose({
  activeTab,
});

const i18n = {
  "zh-CN": zhCN,
  en: en,
};

const t = (path: string) => {
  const dict = i18n[props.lang || "zh-CN"];
  return path.split(".").reduce((obj: any, key) => obj?.[key], dict) || path;
};

const subTabs = computed(() => [
  { id: "basic", label: t("tabs.basic") },
  { id: "visual", label: t("tabs.visual") },
  { id: "dynamics", label: t("tabs.dynamics") },
  { id: "artistic", label: t("tabs.artistic") },
]);

const colorSchemes: {
  id: "classic" | "mono" | "duo" | "rainbow";
  label: string;
}[] = [
    { id: "classic", label: t("colorSchemes.classic") },
    { id: "mono", label: t("colorSchemes.mono") },
    { id: "duo", label: t("colorSchemes.duo") },
    { id: "rainbow", label: t("colorSchemes.rainbow") },
  ];
</script>

<template>
  <div class="flex flex-col gap-6 text-white/90">
    <!-- Sub Tabs (Segmented Control Style) -->
    <SubTabs v-model="activeTab" :tabs="subTabs" />

    <!-- Controls Container -->
    <div class="flex flex-col gap-6 px-1 pointer-events-auto overflow-y-auto max-h-[400px] custom-scrollbar pr-2">
      <!-- Basic Tab -->
      <div v-if="activeTab === 'basic'" class="flex flex-col gap-6">
        <div v-for="prop in [
          { id: 'hue', min: 0, max: 360, step: 1, label: 'hue', suffix: '°' },
          { id: 'speed', min: 0.1, max: 5, step: 0.1, label: 'speed' },
          {
            id: 'brightness',
            min: 0.1,
            max: 2,
            step: 0.1,
            label: 'brightness',
          },
          { id: 'positionX', min: 0, max: 1, step: 0.01, label: 'positionX' },
          { id: 'positionY', min: 0, max: 1, step: 0.01, label: 'positionY' },
        ]" :key="prop.id" class="flex flex-col gap-3 group/item">
          <div class="flex justify-between items-center px-1">
            <label
              class="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 group-hover/item:text-white/40 transition-colors">
              {{ t(`labels.${prop.label}`) }}
            </label>
            <span
              class="text-[11px] font-black font-mono text-white/40 group-hover/item:text-blue-400 transition-colors">
              {{ (config[prop.id] ?? 0).toFixed(prop.step < 1 ? 2 : 0) }}{{ prop.suffix || "" }} </span>
          </div>
          <input :value="config[prop.id as keyof SingularityProps]" @input="
            (e: any) =>
              updateConfig(
                prop.id as keyof SingularityProps,
                Number(e.target.value),
              )
          " type="range" :min="prop.min" :max="prop.max" :step="prop.step"
            class="w-full accent-blue-500 bg-white/5 hover:bg-white/10 h-1.5 rounded-full appearance-none cursor-pointer transition-all border border-white/5" />
        </div>
      </div>

      <!-- Visual Tab -->
      <div v-if="activeTab === 'visual'" class="flex flex-col gap-6">
        <div v-for="prop in [
          {
            id: 'distortion',
            min: 0,
            max: 2,
            step: 0.1,
            label: 'distortion',
          },
          {
            id: 'accretionSize',
            min: 0.1,
            max: 3,
            step: 0.1,
            label: 'accretionSize',
          },
          {
            id: 'blackHoleMass',
            min: 0.1,
            max: 2.5,
            step: 0.1,
            label: 'blackHoleMass',
          },
          {
            id: 'vortexDetail',
            min: 1,
            max: 10,
            step: 1,
            label: 'vortexDetail',
          },
        ]" :key="prop.id" class="flex flex-col gap-3 group/item">
          <div class="flex justify-between items-center px-1">
            <label
              class="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 group-hover/item:text-white/40 transition-colors">
              {{ t(`labels.${prop.label}`) }}
            </label>
            <span
              class="text-[11px] font-black font-mono text-white/40 group-hover/item:text-blue-400 transition-colors">
              {{
                (
                  (config[prop.id as keyof SingularityProps] as number) ?? 0
                ).toFixed(prop.step < 1 ? 2 : 0) }} </span>
          </div>
          <input :value="config[prop.id as keyof SingularityProps]" @input="
            (e: any) =>
              updateConfig(
                prop.id as keyof SingularityProps,
                Number(e.target.value),
              )
          " type="range" :min="prop.min" :max="prop.max" :step="prop.step"
            class="w-full accent-blue-500 bg-white/5 hover:bg-white/10 h-1.5 rounded-full appearance-none cursor-pointer transition-all border border-white/5" />
        </div>
      </div>

      <!-- Dynamics Tab -->
      <div v-if="activeTab === 'dynamics'" class="flex flex-col gap-6">
        <div v-for="prop in [
          {
            id: 'pulseFrequency',
            min: 0,
            max: 5,
            step: 0.1,
            label: 'pulseFrequency',
            suffix: ' Hz',
          },
          {
            id: 'rotationSpeed',
            min: 0,
            max: 5,
            step: 0.1,
            label: 'rotationSpeed',
          },
          {
            id: 'rotationX',
            min: -1.0,
            max: 1.0,
            step: 0.05,
            label: 'rotationX',
            suffix: ' rad',
          },
          {
            id: 'rotationY',
            min: -1.0,
            max: 1.0,
            step: 0.05,
            label: 'rotationY',
            suffix: ' rad',
          },
        ]" :key="prop.id" class="flex flex-col gap-3 group/item">
          <div class="flex justify-between items-center px-1">
            <label
              class="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 group-hover/item:text-white/40 transition-colors">
              {{ t(`labels.${prop.label}`) }}
            </label>
            <span
              class="text-[11px] font-black font-mono text-white/40 group-hover/item:text-blue-400 transition-colors">
              {{
                (
                  (config[prop.id as keyof SingularityProps] as number) ?? 0
                ).toFixed(prop.step < 1 ? 2 : 1) }}{{ prop.suffix || "" }} </span>
          </div>
          <input :value="config[prop.id as keyof SingularityProps]" @input="
            (e: any) =>
              updateConfig(
                prop.id as keyof SingularityProps,
                Number(e.target.value),
              )
          " type="range" :min="prop.min" :max="prop.max" :step="prop.step"
            class="w-full accent-blue-500 bg-white/5 hover:bg-white/10 h-1.5 rounded-full appearance-none cursor-pointer transition-all border border-white/5" />
        </div>
      </div>

      <!-- Artistic Tab -->
      <div v-if="activeTab === 'artistic'" class="flex flex-col gap-6">
        <div class="flex flex-col gap-3">
          <label class="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
            {{ t("labels.colorScheme") }}
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button v-for="scheme in colorSchemes" :key="scheme.id"
              class="py-2.5 text-[9px] font-bold border rounded-lg transition-all shadow-sm cursor-pointer" :class="config.colorScheme === scheme.id
                ? 'bg-blue-600 text-white border-blue-400/50 ring-1 ring-blue-400/30'
                : 'bg-white/[0.03] text-white/25 border-white/5 hover:bg-white/10'
                " @click="updateConfig('colorScheme', scheme.id)">
              {{ scheme.label }}
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-3 group/item">
          <label class="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
            {{ t("labels.secondaryColor") }}
          </label>
          <div class="flex gap-4 items-center">
            <div class="relative w-10 h-10 rounded-lg overflow-hidden border border-white/10 shadow-lg">
              <input :value="config.secondaryColor" @input="
                (e: any) => updateConfig('secondaryColor', e.target.value)
              " type="color"
                class="absolute inset-0 w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer scale-125" />
            </div>
            <span
              class="text-xs font-mono font-bold text-white/40 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
              {{ config.secondaryColor }}
            </span>
          </div>
        </div>

        <div v-for="prop in [
          {
            id: 'quantumParticles',
            min: 0,
            max: 100,
            step: 10,
            label: 'quantumParticles',
          },
        ]" :key="prop.id" class="flex flex-col gap-3 group/item">
          <div class="flex justify-between items-center px-1">
            <label
              class="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 group-hover/item:text-white/40 transition-colors">
              {{ t(`labels.${prop.label}`) }}
            </label>
            <span
              class="text-[11px] font-black font-mono text-white/40 group-hover/item:text-blue-400 transition-colors">
              {{
                (
                  (config[prop.id as keyof SingularityProps] as number) ?? 0
                ).toFixed(0)
              }}
            </span>
          </div>
          <input :value="config[prop.id as keyof SingularityProps]" @input="
            (e: any) =>
              updateConfig(
                prop.id as keyof SingularityProps,
                Number(e.target.value),
              )
          " type="range" :min="prop.min" :max="prop.max" :step="prop.step"
            class="w-full accent-blue-500 bg-white/5 hover:bg-white/10 h-1.5 rounded-full appearance-none cursor-pointer transition-all border border-white/5" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>

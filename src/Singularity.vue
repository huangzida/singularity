<script setup lang="ts">
import {
  ref,
  onMounted,
  onUnmounted,
  watch,
  defineAsyncComponent,
  computed,
} from "vue";
import type { SingularityProps } from "./types";
import { SingularityRenderer } from "./engine/SingularityEngine";
import { meta } from "./meta";
import { DebugShell } from "@bg-effects/debug-ui";
import { defu } from "defu";

const props = defineProps<
  SingularityProps & {
    debug?: boolean;
    lang?: "zh-CN" | "en";
  }
>();

defineEmits([
  "update:hue",
  "update:speed",
  "update:brightness",
  "update:positionX",
  "update:positionY",
]);

// 动态调试配置面板内部组件
const ConfigContent = defineAsyncComponent(
  () => import("./ui/ConfigPanel.vue"),
);
const configContentRef = ref<any>(null);

// 合并 meta.defaultConfig 和 props
const resolveInitialConfig = () => {
  return defu(props, meta.defaultConfig) as SingularityProps;
};

// 内部代理 props 以便支持调试面板的双向绑定 (如果开启 debug)
const config = ref<SingularityProps>(resolveInitialConfig());
// Internal lang state for debug panel
const internalLang = ref<"zh-CN" | "en">(config.value.lang || "zh-CN");

watch(
  () => props,
  (newProps) => {
    // 仅在非 debug 模式下同步 props 或合并
    if (!props.debug) {
      config.value = defu(newProps, meta.defaultConfig) as SingularityProps;
    }
  },
  { deep: true },
);

const handleRandomize = () => {
  if (meta.randomize) {
    // 获取当前配置面板的activeTab（defineExpose暴露的ref可以直接访问）
    const currentTab = configContentRef.value?.activeTab as any;
    const tabValue =
      typeof currentTab === "object" && currentTab?.value
        ? currentTab.value
        : currentTab;
    // @ts-ignore - meta.randomize now supports optional tab parameter
    const newConfig = meta.randomize(config.value, tabValue);
    // 保持 debug 和 lang 状态
    config.value = {
      ...newConfig,
      debug: config.value.debug,
      lang: config.value.lang,
    };
  }
};

const containerRef = ref<HTMLElement | null>(null);
let engine: SingularityRenderer | null = null;

// 过渡状态（可选，但保留以保持一致性）
const canvasOpacity = ref(1);

const engineInterface = computed(() => ({
  pause: () => engine?.pause(),
  resume: () => engine?.resume(),
  restart: () => engine?.restart(),
}));

// 监听config变化并更新引擎（所有参数都可直接更新，无需重建引擎）
watch(
  config,
  (newConfig) => {
    if (!engine || !containerRef.value) return;

    // Singularity 引擎支持所有配置的动态更新，无需重建
    engine.updateConfig(newConfig);
  },
  { deep: true },
);

onMounted(() => {
  if (!containerRef.value) return;
  engine = new SingularityRenderer(containerRef.value, config.value as any);

  // 为canvas添加过渡样式并监听透明度变化
  const canvas = containerRef.value.querySelector("canvas");
  if (canvas) {
    canvas.style.transition = "opacity 0.3s ease-in-out";

    // 实时同步透明度
    watch(canvasOpacity, (opacity) => {
      canvas.style.opacity = opacity.toString();
    });
  }
});

onUnmounted(() => {
  engine?.destroy();
  engine = null;
});
</script>

<template>
  <div
    ref="containerRef"
    class="singularity-container absolute inset-0 z-0"
    :class="props.className"
  >
    <DebugShell
      v-if="debug"
      v-model:config="config"
      v-model:lang="internalLang"
      :meta="meta"
      :engine="engineInterface"
      @randomize="handleRandomize"
    >
      <template #settings>
        <ConfigContent
          ref="configContentRef"
          v-model:config="config"
          :lang="internalLang"
        />
      </template>
    </DebugShell>
  </div>
</template>

<style scoped>
.singularity-container canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>

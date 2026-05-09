<script setup lang="ts">
import { useData } from "vitepress";
import { computed } from "vue";

import type { PerformanceProgressStage } from "./performance-audit-constants";

const props = defineProps<{
  isLoading: boolean;
  progress: number;
  stage: PerformanceProgressStage;
  labels: Record<PerformanceProgressStage, string>;
  label: string;
}>();

const { isDark } = useData();

const stageName = computed(() => props.labels[props.stage] ?? "");
const textColor = computed(() => (isDark.value ? "#cbd5e0" : "#4a5568"));
const backgroundColor = computed(() => (isDark.value ? "#374151" : "#e5e7eb"));
const progressGradient = computed(() =>
  isDark.value
    ? "linear-gradient(90deg, #60a5fa 0%, #a78bfa 100%)"
    : "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)",
);
</script>

<template>
  <div
    v-if="isLoading"
    :style="{
      textAlign: 'center',
      padding: '1.5rem',
      color: textColor,
    }"
  >
    <div
      :style="{
        fontSize: '1rem',
        fontWeight: '600',
        marginBottom: '0.5rem',
        color: textColor,
      }"
    >
      {{ `${stageName}...` }}
    </div>
    <div
      :style="{
        width: '100%',
        height: '4px',
        background: backgroundColor,
        borderRadius: '2px',
        overflow: 'hidden',
        marginTop: '0.75rem',
      }"
    >
      <div
        :style="{
          width: `${progress}%`,
          height: '100%',
          background: progressGradient,
          transition: 'width 0.3s ease',
        }"
      />
    </div>
    <div
      :style="{
        fontSize: '0.875rem',
        marginTop: '0.5rem',
        color: textColor,
      }"
    >
      {{ `${label}: ${progress}%` }}
    </div>
  </div>
</template>

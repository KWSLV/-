<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  title: string;
  value: number;
  unit: string;
  change: string;
  trend: 'up' | 'down';
}>();

const shown = ref(0);
let frame = 0;

const decimals = computed(() => (Number.isInteger(props.value) ? 0 : 1));
const shownText = computed(() =>
  shown.value.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals.value,
    maximumFractionDigits: decimals.value
  })
);

function animateNumber(target: number) {
  window.cancelAnimationFrame(frame);
  const start = shown.value;
  const startedAt = performance.now();
  const duration = 900;

  const tick = (now: number) => {
    const progress = Math.min((now - startedAt) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    shown.value = start + (target - start) * eased;
    if (progress < 1) frame = window.requestAnimationFrame(tick);
  };

  frame = window.requestAnimationFrame(tick);
}

watch(() => props.value, animateNumber, { immediate: true });

onMounted(() => animateNumber(props.value));
onBeforeUnmount(() => window.cancelAnimationFrame(frame));
</script>

<template>
  <article class="metric-card panel-glow">
    <div class="metric-title">{{ title }}</div>
    <div class="metric-main">
      <strong>{{ shownText }}</strong>
      <span>{{ unit }}</span>
    </div>
    <div class="metric-change" :class="trend">{{ change }}</div>
  </article>
</template>


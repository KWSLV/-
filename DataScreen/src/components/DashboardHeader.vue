<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { formatDateTime } from '../utils/format';

const currentTime = ref(formatDateTime());
const headerKicker = '\u6570\u5b57\u4e16\u754c\u63a7\u5236\u53f0';
const mainTitle = '\u5982\u610f\u6570\u636e\u5927\u5c4f RuyiBigScreen';
const subTitle = 'Vue 3 \u00b7 TypeScript \u00b7 ECharts\u53ef\u89c6\u5316\u5927\u5c4f';
let timer: number | undefined;

onMounted(() => {
  timer = window.setInterval(() => {
    currentTime.value = formatDateTime();
  }, 1000);
});

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer);
});
</script>

<template>
  <header class="dashboard-header">
    <div class="header-side">
      <span class="header-kicker">{{ headerKicker }}</span>
    </div>
    <div class="header-center">
      <h1>{{ mainTitle }}</h1>
      <p>{{ subTitle }}</p>
    </div>
    <div class="header-side header-time">{{ currentTime }}</div>
  </header>
</template>

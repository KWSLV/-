<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { labels, trendData } from '../data/mockData';
import { echarts, type EChartsCoreOption, useChart } from '../utils/echarts';

const tick = ref(0);
let timer: number | undefined;

const visits = computed(() =>
  trendData.visits.map((value, index) => Math.round(value * (1 + Math.sin(tick.value + index) * 0.018)))
);
const orders = computed(() =>
  trendData.orders.map((value, index) => Math.round(value * (1 + Math.cos(tick.value + index) * 0.022)))
);

const chartEl = ref<HTMLElement | null>(null);

function option(): EChartsCoreOption {
  return {
    color: ['#20d8ff', '#55f09b'],
    tooltip: { trigger: 'axis', backgroundColor: 'rgba(7, 20, 42, .92)', borderColor: '#1de4ff', textStyle: { color: '#dff8ff' } },
    legend: { right: 8, top: 0, textStyle: { color: '#8fb2c7' } },
    grid: { left: 42, right: 18, top: 42, bottom: 30 },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: trendData.times,
      axisLine: { lineStyle: { color: 'rgba(85, 152, 184, .42)' } },
      axisTick: { show: false },
      axisLabel: { color: '#89a8ba' }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(61, 126, 160, .18)' } },
      axisLabel: { color: '#89a8ba' }
    },
    series: [
      {
        name: labels.visits,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 7,
        data: visits.value,
        lineStyle: { width: 3, shadowBlur: 12, shadowColor: '#20d8ff' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(32, 216, 255, .34)' },
            { offset: 1, color: 'rgba(32, 216, 255, .02)' }
          ])
        }
      },
      {
        name: labels.orders,
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 7,
        data: orders.value,
        lineStyle: { width: 3, shadowBlur: 10, shadowColor: '#55f09b' }
      }
    ]
  };
}

const { render } = useChart(chartEl, option);

timer = window.setInterval(() => {
  tick.value += 1;
}, 5000);

watch(tick, render);

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer);
});
</script>

<template>
  <div ref="chartEl" class="chart"></div>
</template>

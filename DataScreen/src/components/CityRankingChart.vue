<script setup lang="ts">
import { ref } from 'vue';
import { cityRanking, labels } from '../data/mockData';
import { echarts, type EChartsCoreOption, useChart } from '../utils/echarts';

const chartEl = ref<HTMLElement | null>(null);

function option(): EChartsCoreOption {
  return {
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, backgroundColor: 'rgba(7, 20, 42, .92)', borderColor: '#1de4ff', textStyle: { color: '#dff8ff' } },
    grid: { left: 48, right: 14, top: 28, bottom: 34 },
    xAxis: {
      type: 'category',
      data: cityRanking.map((item) => item.city),
      axisTick: { show: false },
      axisLine: { lineStyle: { color: 'rgba(85, 152, 184, .4)' } },
      axisLabel: { color: '#9db9c8' }
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#89a8ba' },
      splitLine: { lineStyle: { color: 'rgba(61, 126, 160, .18)' } }
    },
    series: [
      {
        name: labels.visits,
        type: 'bar',
        data: cityRanking.map((item) => item.value),
        barWidth: 20,
        showBackground: false,
        itemStyle: {
          borderRadius: [10, 10, 2, 2],
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            { offset: 0, color: '#1580ff' },
            { offset: 1, color: '#6bf2a2' }
          ]),
          shadowBlur: 12,
          shadowColor: 'rgba(31, 216, 255, .35)'
        },
        animationDuration: 1200,
        animationEasing: 'cubicOut'
      }
    ]
  };
}

useChart(chartEl, option);
</script>

<template>
  <div ref="chartEl" class="chart"></div>
</template>

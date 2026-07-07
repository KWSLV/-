<script setup lang="ts">
import { ref } from 'vue';
import { abilityRadar } from '../data/mockData';
import { type EChartsCoreOption, useChart } from '../utils/echarts';

const chartEl = ref<HTMLElement | null>(null);

function option(): EChartsCoreOption {
  return {
    tooltip: { backgroundColor: 'rgba(7, 20, 42, .92)', borderColor: '#1de4ff', textStyle: { color: '#dff8ff' } },
    radar: {
      center: ['50%', '55%'],
      radius: '68%',
      indicator: abilityRadar.indicators.map((name) => ({ name, max: 100 })),
      axisName: { color: '#b9cbd4', fontSize: 12 },
      splitArea: { areaStyle: { color: ['rgba(14, 53, 80, .2)', 'rgba(12, 41, 67, .08)'] } },
      axisLine: { lineStyle: { color: 'rgba(91, 211, 255, .24)' } },
      splitLine: { lineStyle: { color: 'rgba(91, 211, 255, .22)' } }
    },
    series: [
      {
        type: 'radar',
        symbol: 'circle',
        symbolSize: 7,
        data: [
          {
            value: abilityRadar.values,
            name: '\u80fd\u529b\u6307\u6570',
            lineStyle: { color: '#63f5a5', width: 3 },
            areaStyle: { color: 'rgba(64, 241, 158, .25)' },
            itemStyle: { color: '#63f5a5', shadowBlur: 10, shadowColor: '#63f5a5' }
          }
        ]
      }
    ]
  };
}

useChart(chartEl, option);
</script>

<template>
  <div ref="chartEl" class="chart"></div>
</template>

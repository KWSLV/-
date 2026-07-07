<script setup lang="ts">
import { ref } from 'vue';
import { developmentData } from '../data/mockData';
import { type EChartsCoreOption, useChart } from '../utils/echarts';

const chartEl = ref<HTMLElement | null>(null);

function option(): EChartsCoreOption {
  return {
    color: ['#2fceff', '#21ebb7', '#7df57c', '#ffd166', '#ff9d4d'],
    tooltip: { trigger: 'item', backgroundColor: 'rgba(7, 20, 42, .92)', borderColor: '#1de4ff', textStyle: { color: '#dff8ff' } },
    legend: { orient: 'vertical', right: 0, top: 'center', itemWidth: 10, itemHeight: 10, textStyle: { color: '#9db9c8' } },
    series: [
      {
        name: '\u5f00\u53d1\u5360\u6bd4',
        type: 'pie',
        radius: ['48%', '70%'],
        center: ['38%', '52%'],
        avoidLabelOverlap: true,
        itemStyle: { borderColor: '#07182b', borderWidth: 2, shadowBlur: 14, shadowColor: 'rgba(32, 216, 255, .35)' },
        emphasis: { scale: true, scaleSize: 8 },
        label: { color: '#d9f7ff', formatter: '{b}\n{d}%' },
        labelLine: { lineStyle: { color: 'rgba(188, 238, 255, .45)' } },
        data: developmentData
      }
    ]
  };
}

useChart(chartEl, option);
</script>

<template>
  <div ref="chartEl" class="chart"></div>
</template>

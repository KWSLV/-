<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import { businessNodes, labels, type BusinessNode } from '../data/mockData';
import { type EChartsCoreOption, useChart } from '../utils/echarts';
import { formatNumber } from '../utils/format';

const chartEl = ref<HTMLElement | null>(null);
const selected = ref<BusinessNode>(businessNodes[0]);

const centerNode = businessNodes.find((node) => node.center) ?? businessNodes[0];
const around = businessNodes.filter((node) => !node.center);
const radius = 255;

function option(): EChartsCoreOption {
  const data = businessNodes.map((node, index) => {
    const angle = ((index - 1) / around.length) * Math.PI * 2 - Math.PI / 2;
    return {
      name: node.name,
      value: node.visits,
      x: node.center ? 0 : Math.cos(angle) * radius,
      y: node.center ? 0 : Math.sin(angle) * radius,
      symbolSize: node.center ? 92 : 62,
      fixed: false,
      itemStyle: {
        color: node.center ? '#57f79a' : '#23cfff',
        shadowBlur: node.center ? 34 : 24,
        shadowColor: node.center ? 'rgba(87, 247, 154, .9)' : 'rgba(35, 207, 255, .78)',
        borderColor: 'rgba(220, 252, 255, .8)',
        borderWidth: 2
      },
      label: {
        color: node.center ? '#052111' : '#dffaff',
        fontWeight: node.center ? 700 : 500,
        fontSize: node.center ? 16 : 13
      }
    };
  });

  return {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(7, 20, 42, .94)',
      borderColor: '#1de4ff',
      textStyle: { color: '#dff8ff' },
      formatter: (params: unknown) => {
        const item = params as { data?: { name?: string; value?: number } };
        const found = businessNodes.find((node) => node.name === item.data?.name);
        if (!found) return '';
        return `${found.name}<br/>\u72b6\u6001\uff1a${found.status}<br/>${labels.visits}\uff1a${formatNumber(found.visits)}`;
      }
    },
    series: [
      {
        type: 'graph',
        layout: 'none',
        roam: false,
        draggable: true,
        focusNodeAdjacency: true,
        symbol: 'circle',
        edgeSymbol: ['none', 'arrow'],
        edgeSymbolSize: [0, 7],
        label: { show: true },
        lineStyle: {
          color: 'rgba(83, 221, 255, .48)',
          width: 1.4,
          curveness: 0.08,
          shadowBlur: 8,
          shadowColor: 'rgba(83, 221, 255, .6)'
        },
        emphasis: {
          scale: true,
          label: { color: '#ffffff' },
          lineStyle: { color: '#6bf2a2', width: 2.4 }
        },
        data,
        links: around.map((node) => ({ source: centerNode.name, target: node.name })),
        animationDurationUpdate: 1800,
        animationEasingUpdate: 'cubicInOut'
      }
    ]
  };
}

const { chart } = useChart(chartEl, option);
let bindTimer: number | undefined;

function bindClick() {
  chart.value?.off('click');
  chart.value?.on('click', (params) => {
    const node = businessNodes.find((item) => item.name === params.name);
    if (node) selected.value = node;
  });
}

bindTimer = window.setTimeout(bindClick, 100);

onBeforeUnmount(() => {
  if (bindTimer) window.clearTimeout(bindTimer);
  chart.value?.off('click');
});
</script>

<template>
  <div class="graph-wrap">
    <div class="graph-rings" aria-hidden="true"></div>
    <div ref="chartEl" class="chart"></div>
    <aside class="node-card">
      <span class="node-status"></span>
      <strong>{{ selected.name }}</strong>
      <small>{{ selected.status }} · {{ formatNumber(selected.visits) }} {{ labels.visits }}</small>
    </aside>
  </div>
</template>

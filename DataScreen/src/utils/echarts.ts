import * as echarts from 'echarts/core';
import { BarChart, GraphChart, LineChart, PieChart, RadarChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  RadarComponent,
  TitleComponent,
  TooltipComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { ECharts, EChartsCoreOption } from 'echarts/core';
import { nextTick, onBeforeUnmount, onMounted, shallowRef, type Ref } from 'vue';

echarts.use([
  BarChart,
  GraphChart,
  GridComponent,
  LegendComponent,
  LineChart,
  PieChart,
  RadarChart,
  RadarComponent,
  TitleComponent,
  TooltipComponent,
  CanvasRenderer
]);

export { echarts };
export type { EChartsCoreOption };

export function useChart(elRef: Ref<HTMLElement | null>, getOption: () => EChartsCoreOption) {
  const chart = shallowRef<ECharts>();

  const resize = () => chart.value?.resize();

  const render = () => {
    if (!elRef.value) return;
    if (!chart.value) {
      chart.value = echarts.init(elRef.value);
    }
    chart.value.setOption(getOption(), true);
  };

  onMounted(async () => {
    await nextTick();
    render();
    window.addEventListener('resize', resize);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resize);
    chart.value?.dispose();
    chart.value = undefined;
  });

  return { chart, render, resize };
}

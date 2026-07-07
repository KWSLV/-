<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import ScreenAdapter from '../components/ScreenAdapter.vue';
import DashboardHeader from '../components/DashboardHeader.vue';
import MetricCard from '../components/MetricCard.vue';
import PanelContainer from '../components/PanelContainer.vue';
import TrendLineChart from '../components/TrendLineChart.vue';
import DevelopmentPieChart from '../components/DevelopmentPieChart.vue';
import BusinessGraphChart from '../components/BusinessGraphChart.vue';
import CityRankingChart from '../components/CityRankingChart.vue';
import AbilityRadarChart from '../components/AbilityRadarChart.vue';
import RealtimeMessages from '../components/RealtimeMessages.vue';
import { labels, metrics, type MetricItem } from '../data/mockData';

const metricList = ref<MetricItem[]>(metrics.map((item) => ({ ...item })));
const panelTitles = {
  trend: '\u8bbf\u95ee\u8d8b\u52bf',
  pie: '\u5f00\u53d1\u5360\u6bd4',
  graph: '\u4e2d\u5fc3\u4e1a\u52a1\u62d3\u6251',
  city: '\u57ce\u5e02\u8bbf\u95ee\u6392\u540d',
  radar: '\u80fd\u529b\u96f7\u8fbe\u56fe',
  realtime: '\u5b9e\u65f6\u52a8\u6001\u4e0e\u544a\u8b66'
};
let timer: number | undefined;

function updateMetrics() {
  metricList.value = metricList.value.map((item) => {
    const ratio = item.title === labels.health ? 0.002 : 0.018;
    const direction = item.trend === 'down' ? -1 : 1;
    const nextValue = item.value * (1 + direction * (Math.random() * ratio));
    return {
      ...item,
      value: item.title === labels.health ? Math.min(99.9, Number(nextValue.toFixed(1))) : Math.round(nextValue)
    };
  });
}

onMounted(() => {
  timer = window.setInterval(updateMetrics, 5000);
});

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer);
});
</script>

<template>
  <ScreenAdapter>
    <div class="dashboard-page">
      <DashboardHeader />

      <section class="metric-grid">
        <MetricCard
          v-for="item in metricList"
          :key="item.title"
          :title="item.title"
          :value="item.value"
          :unit="item.unit"
          :change="item.change"
          :trend="item.trend"
        />
      </section>

      <section class="main-grid">
        <PanelContainer :title="panelTitles.trend" class-name="area-trend">
          <TrendLineChart />
        </PanelContainer>

        <PanelContainer :title="panelTitles.pie" class-name="area-pie">
          <DevelopmentPieChart />
        </PanelContainer>

        <PanelContainer :title="panelTitles.graph" class-name="area-graph">
          <BusinessGraphChart />
        </PanelContainer>

        <PanelContainer :title="panelTitles.city" class-name="area-city">
          <CityRankingChart />
        </PanelContainer>

        <PanelContainer :title="panelTitles.radar" class-name="area-radar">
          <AbilityRadarChart />
        </PanelContainer>
      </section>

      <PanelContainer :title="panelTitles.realtime" class-name="realtime-panel">
        <RealtimeMessages />
      </PanelContainer>
    </div>
  </ScreenAdapter>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const DESIGN_WIDTH = 1920;
const DESIGN_HEIGHT = 1080;

const scale = ref(1);
const offsetLeft = ref(0);
const offsetTop = ref(0);

function updateScale() {
  const widthScale = window.innerWidth / DESIGN_WIDTH;
  const heightScale = window.innerHeight / DESIGN_HEIGHT;
  scale.value = Math.min(widthScale, heightScale);
  offsetLeft.value = (window.innerWidth - DESIGN_WIDTH * scale.value) / 2;
  offsetTop.value = (window.innerHeight - DESIGN_HEIGHT * scale.value) / 2;

  // 缩放结束后通知图表重新计算画布尺寸。
  window.setTimeout(() => window.dispatchEvent(new Event('resize')), 80);
}

onMounted(() => {
  updateScale();
  window.addEventListener('resize', updateScale);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScale);
});
</script>

<template>
  <main class="screen-shell">
    <section
      class="screen-canvas"
      :style="{
        transform: `translate(${offsetLeft}px, ${offsetTop}px) scale(${scale})`
      }"
    >
      <slot />
    </section>
  </main>
</template>


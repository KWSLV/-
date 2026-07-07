<script setup lang="ts">
defineProps<{ title: string; className?: string }>();
</script>

<template>
  <section class="panel-container panel-glow" :class="className">
    <div class="panel-title">
      <span>{{ title }}</span>
    </div>
    <div class="panel-body">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { initialMessages, messageTemplates, type RealtimeMessage } from '../data/mockData';
import { formatTime } from '../utils/format';

const messages = ref<RealtimeMessage[]>([...initialMessages]);
let timer: number | undefined;
let nextId = 10;
let templateIndex = 0;

function addMessage() {
  const template = messageTemplates[templateIndex % messageTemplates.length];
  templateIndex += 1;
  messages.value = [
    {
      id: nextId++,
      time: formatTime(),
      level: template.level,
      text: template.text
    },
    ...messages.value
  ].slice(0, 5);
}

onMounted(() => {
  timer = window.setInterval(addMessage, 5000);
});

onBeforeUnmount(() => {
  if (timer) window.clearInterval(timer);
});
</script>

<template>
  <div class="message-list">
    <article v-for="message in messages" :key="message.id" class="message-card">
      <i class="message-dot" :class="message.level"></i>
      <time>{{ message.time }}</time>
      <span>{{ message.text }}</span>
    </article>
  </div>
</template>

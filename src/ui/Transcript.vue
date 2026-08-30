<script setup lang="ts">
import type { Line } from './lines';
defineProps<{ lines: Line[] }>();
</script>

<template>
  <div class="transcript" role="log" aria-live="polite" aria-relevant="additions">
    <p v-for="(line, i) in lines" :key="i" :class="line.kind">{{ line.text }}</p>
  </div>
</template>

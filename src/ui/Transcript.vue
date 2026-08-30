<script setup lang="ts">
// Every `Line.kind` (`./lines.ts`) gets its own CSS class (`styles.css`) —
// memories, clues, and questions render distinctly from ordinary prose, per
// §8 task 22's own requirement.
import type { Line } from './lines';
defineProps<{ lines: Line[] }>();
</script>

<template>
  <div class="transcript" role="log" aria-live="polite" aria-relevant="additions">
    <p v-for="(line, i) in lines" :key="i" :class="line.kind">{{ line.text }}</p>
  </div>
</template>

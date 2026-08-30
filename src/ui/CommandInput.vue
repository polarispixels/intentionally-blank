<script setup lang="ts">
import { onMounted, ref } from 'vue';

const emit = defineEmits<{ submit: [text: string] }>();
const text = ref('');
const input = ref<HTMLInputElement | null>(null);

function focus(): void { input.value?.focus(); }
function onSubmit(): void {
  const t = text.value;
  text.value = '';
  emit('submit', t);
}
onMounted(focus);
defineExpose({ focus });
</script>

<template>
  <div class="input-row">
    <form @submit.prevent="onSubmit">
      <span class="prompt" aria-hidden="true">&gt;</span>
      <input
        ref="input"
        v-model="text"
        type="text"
        aria-label="Command"
        autocomplete="off"
        autocapitalize="off"
        spellcheck="false"
        enterkeyhint="send"
      />
    </form>
  </div>
</template>

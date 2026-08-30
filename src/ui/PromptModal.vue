<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import type { PromptField } from './controller';

const props = defineProps<{
  open: boolean;
  title: string;
  body: string;
  fields: PromptField[];
  error?: string | undefined;
}>();
const emit = defineEmits<{ submit: [values: Record<string, string>] }>();

const dialog = ref<HTMLDialogElement | null>(null);
const values = ref<Record<string, string>>({});

watch(
  () => props.open,
  async (open) => {
    await nextTick();
    const d = dialog.value;
    if (!d) return;
    if (open && !d.open) {
      values.value = {};
      d.showModal();
      await nextTick();
      d.querySelector('input')?.focus();
    } else if (!open && d.open) {
      d.close();
    }
  },
  { immediate: true },
);

function onSubmit(): void {
  emit('submit', { ...values.value });
}
</script>

<template>
  <dialog ref="dialog" aria-labelledby="prompt-title" @cancel.prevent>
    <form method="dialog" @submit.prevent="onSubmit">
      <h2 id="prompt-title">{{ title }}</h2>
      <p>{{ body }}</p>
      <template v-for="field in fields" :key="field.name">
        <label :for="`prompt-field-${field.name}`">{{ field.name }}</label>
        <input
          :id="`prompt-field-${field.name}`"
          v-model="values[field.name]"
          :type="field.secret ? 'password' : 'text'"
          :placeholder="field.placeholder"
          autocomplete="off"
          autocapitalize="off"
        />
      </template>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <div class="actions">
        <button type="submit">Submit</button>
      </div>
    </form>
  </dialog>
</template>

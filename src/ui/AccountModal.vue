<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';

const props = defineProps<{
  open: boolean;
  title: string;
  body: string;
  usernamePlaceholder: string;
  hint: string;
  forgotLabel: string;
  error: string;
  revealHint: boolean;
}>();
const emit = defineEmits<{ submit: [username: string, password: string] }>();

const dialog = ref<HTMLDialogElement | null>(null);
const username = ref('');
const password = ref('');
const showHint = ref(false);
const usernameInput = ref<HTMLInputElement | null>(null);

watch(() => props.open, async (open) => {
  await nextTick();
  const d = dialog.value;
  if (!d) return;
  if (open && !d.open) {
    username.value = '';
    password.value = '';
    showHint.value = false;
    d.showModal();
    usernameInput.value?.focus();
  } else if (!open && d.open) {
    d.close();
  }
}, { immediate: true });

watch(() => props.revealHint, (r) => { if (r) showHint.value = true; });

function onSubmit(): void {
  emit('submit', username.value, password.value);
  password.value = '';
}
</script>

<template>
  <dialog ref="dialog" aria-labelledby="account-title" @cancel.prevent>
    <form method="dialog" @submit.prevent="onSubmit">
      <h2 id="account-title">{{ title }}</h2>
      <p>{{ body }}</p>
      <label for="username">Username</label>
      <input id="username" ref="usernameInput" v-model="username" :placeholder="usernamePlaceholder" autocomplete="off" autocapitalize="off" />
      <label for="password">Password</label>
      <input id="password" v-model="password" type="password" autocomplete="off" />
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <p v-if="showHint" class="hint">{{ hint }}</p>
      <div class="actions">
        <button type="submit">Create account</button>
        <button type="button" class="forgot" @click="showHint = true">{{ forgotLabel }}</button>
      </div>
    </form>
  </dialog>
</template>

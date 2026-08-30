<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { parse, start, step } from '../engine';
import type { GameEvent, GameState } from '../engine';
import { PROMPT } from '../content';
import { GAME_VERSION } from '../version';
import Transcript from './Transcript.vue';
import type { Line } from './lines';
import CommandInput from './CommandInput.vue';
import AccountModal from './AccountModal.vue';

const BEAT_MS = 900;

const state = ref<GameState>(start().state);
const lines = ref<Line[]>([]);
const pending = ref<Line[]>([]);
let timer: ReturnType<typeof setTimeout> | null = null;

const modalOpen = ref(false);
const modal = ref<{ title: string; body: string; usernamePlaceholder: string; hint: string }>({ title: PROMPT.title, body: PROMPT.body, usernamePlaceholder: PROMPT.usernamePlaceholder, hint: PROMPT.hint });
const modalError = ref('');
const modalReveal = ref(false);
const gameOver = ref(false);
const input = ref<InstanceType<typeof CommandInput> | null>(null);

function scrollToEnd(): void {
  requestAnimationFrame(() => window.scrollTo({ top: document.body.scrollHeight }));
}

function push(line: Line): void {
  lines.value.push(line);
  scrollToEnd();
}

/** Reveal queued beats one at a time; `flush` shows the rest at once. */
function pump(flush = false): void {
  if (timer) { clearTimeout(timer); timer = null; }
  if (pending.value.length === 0) return;
  if (flush) {
    while (pending.value.length) push(pending.value.shift()!);
    return;
  }
  push(pending.value.shift()!);
  if (pending.value.length) timer = setTimeout(() => pump(), BEAT_MS);
}

function apply(events: readonly GameEvent[]): void {
  for (const e of events) {
    switch (e.type) {
      case 'echo': push({ kind: 'player', text: e.text }); break;
      case 'say': push({ kind: 'game', text: e.text }); break;
      case 'openPrompt':
        modal.value = { title: e.title, body: e.body, usernamePlaceholder: e.usernamePlaceholder, hint: e.hint };
        modalError.value = '';
        modalReveal.value = false;
        modalOpen.value = true;
        break;
      case 'promptFailed':
        modalError.value = e.text;
        modalReveal.value = e.revealHint;
        break;
      case 'closePrompt':
        modalOpen.value = false;
        break;
      case 'beat':
        pending.value.push({ kind: 'game', text: e.text });
        break;
      case 'gameOver':
        pending.value.push({ kind: 'game', text: e.aside });
        pending.value.push({ kind: 'system', text: 'GAME OVER' });
        gameOver.value = true;
        break;
      case 'restarted':
        pending.value = [];
        lines.value = [];
        gameOver.value = false;
        modalOpen.value = false;
        break;
    }
  }
  if (pending.value.length && !timer) pump();
}

function submit(text: string): void {
  // A command typed during a paced beat sequence used to be swallowed: this
  // flushed and returned, but CommandInput had already cleared the field. Now
  // the beats flush and the command still runs. A bare Enter only flushes.
  if (pending.value.length) pump(true);
  if (text.trim() === '') return;
  const r = step(state.value, parse(text));
  state.value = r.state;
  apply(r.events);
}

function submitCredentials(username: string, password: string): void {
  const r = step(state.value, { type: 'submitCredentials', username, password });
  state.value = r.state;
  apply(r.events);
  if (!modalOpen.value) input.value?.focus();
}

function restart(): void { submit('restart'); input.value?.focus(); }

function onPageClick(e: MouseEvent): void {
  const t = e.target as HTMLElement | null;
  if (t?.closest('dialog, button, a, input')) return;
  if (pending.value.length) pump(true);
  input.value?.focus();
}

onMounted(() => { apply(start().events); });
onBeforeUnmount(() => { if (timer) clearTimeout(timer); });
</script>

<template>
  <div class="page" @click="onPageClick">
    <header>
      <h1>INTENTIONALLY BLANK</h1>
      <hr />
    </header>
    <main>
      <Transcript :lines="lines" />
      <button v-if="gameOver && pending.length === 0" class="restart" type="button" @click="restart">RESTART</button>
      <!-- `pending` is a ref; templates auto-unwrap it, so `.length` here is reactive. -->
    </main>
    <footer>
      <hr />
      v{{ GAME_VERSION }} &middot; <a href="docs/">docs</a>
    </footer>
    <CommandInput ref="input" @submit="submit" />
    <AccountModal
      :open="modalOpen"
      :title="modal.title"
      :body="modal.body"
      :username-placeholder="modal.usernamePlaceholder"
      :hint="modal.hint"
      :forgot-label="PROMPT.forgotLabel"
      :error="modalError"
      :reveal-hint="modalReveal"
      @submit="submitCredentials"
    />
  </div>
</template>

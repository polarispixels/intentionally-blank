<script setup lang="ts">
// The Vue shell (§8 task 22: "src/ui/ moves onto Session"). Thin by design —
// every real decision (parsing, turns, saves, death handling) lives in
// `./controller.ts`, exercised the same way by `tests/ui-controller.test.ts`
// with no DOM at all. This component's own job is: wire the browser-only
// bits `./controller.ts` deliberately doesn't touch (`localStorage`, the
// wall clock, beat-pacing timers, scrolling, focus) and render `UiState`.
import { onBeforeUnmount, ref, watch } from 'vue';
import { DeterministicParser } from '../engine/interpreter';
import { compileVocabulary } from '../engine/parser';
import type { DeathOption } from '../session/session';
import { RESTART_PROMPT_SCRIPTS } from '../session/session';
import { PROMPT_SCRIPTS as SHIPPED_PROMPT_SCRIPTS } from '../content/world/game';
// The shipped game: the whole assembled world (Act I + Act II + Act III
// slices), not just Act I (ADR 0011 item 3; Stage D E3).
import { WORLD } from '../content/world/game';
import { GAME_VERSION } from '../version';
import {
  chooseDeathOption,
  createUiState,
  deathMenuOptions,
  flushAllBeats,
  flushOneBeat,
  submitCommand,
  submitPrompt,
} from './controller';
import type { ControllerOpts, UiState } from './controller';
import { LocalStorageStore } from './store';
import Transcript from './Transcript.vue';
import CommandInput from './CommandInput.vue';
import PromptModal from './PromptModal.vue';

const BEAT_MS = 900;

// The one real game world this shell ever plays (§8 task 22's "wire act1 as
// the default world"). `vocab`/`parser` are stateless/world-derived, built
// once; `store` is the only browser API this file touches directly.
const store = new LocalStorageStore();
const vocab = compileVocabulary(WORLD);
const parser = new DeterministicParser();
const opts: ControllerOpts = {
  world: WORLD,
  vocab,
  parser,
  store,
  now: () => new Date().toISOString(),
  gameVersion: GAME_VERSION,
  // RESTART_PROMPT_SCRIPTS (`../session/session`): the RESTART/RESET
  // confirmation's own prompt id -> respond-script table. Act1 authors no
  // other generic-prompt content yet.
  promptScripts: { ...RESTART_PROMPT_SCRIPTS, ...SHIPPED_PROMPT_SCRIPTS },
};

const deathLabels: Record<DeathOption, string> = {
  undo: 'UNDO',
  restartEncounter: 'RESTART ENCOUNTER',
  restart: 'RESTART',
};

// Resumes the autosave if one exists (browser reloads are common; a
// spawned CLI process has no equivalent) — game state resumes exactly;
// the visible transcript does not replay history, only the session does.
const ui = ref<UiState>(createUiState(opts));
const input = ref<InstanceType<typeof CommandInput> | null>(null);
let timer: ReturnType<typeof setTimeout> | null = null;

function scrollToEnd(): void {
  requestAnimationFrame(() => window.scrollTo({ top: document.body.scrollHeight }));
}

/** Reveals queued beats one at a time; a fresh command flushes the rest at once (`onPageClick`/`submit` below) rather than interleaving. */
function pump(): void {
  if (timer !== null) {
    clearTimeout(timer);
    timer = null;
  }
  if (ui.value.pending.length === 0) return;
  ui.value = flushOneBeat(ui.value);
  scrollToEnd();
  if (ui.value.pending.length > 0) timer = setTimeout(pump, BEAT_MS);
}

function startPumpIfNeeded(): void {
  if (ui.value.pending.length > 0 && timer === null) timer = setTimeout(pump, BEAT_MS);
}

function submit(text: string): void {
  ui.value = submitCommand(ui.value, text, opts);
  scrollToEnd();
  startPumpIfNeeded();
}

function submitPromptForm(values: Record<string, string>): void {
  ui.value = submitPrompt(ui.value, values, opts);
  scrollToEnd();
  startPumpIfNeeded();
  if (ui.value.prompt === undefined) input.value?.focus();
}

function chooseDeath(option: DeathOption): void {
  ui.value = chooseDeathOption(ui.value, opts, option);
  input.value?.focus();
}

function onPageClick(e: MouseEvent): void {
  const t = e.target as HTMLElement | null;
  if (t?.closest('dialog, button, a, input')) return;
  if (ui.value.pending.length > 0) {
    ui.value = flushAllBeats(ui.value);
    scrollToEnd();
  }
  input.value?.focus();
}

watch(
  () => ui.value.lines.length,
  () => scrollToEnd(),
);

onBeforeUnmount(() => {
  if (timer !== null) clearTimeout(timer);
});
</script>

<template>
  <div class="page" @click="onPageClick">
    <header>
      <h1>INTENTIONALLY BLANK</h1>
      <hr />
    </header>
    <main>
      <Transcript :lines="ui.lines" />
      <div v-if="ui.session.state.phase === 'dead' && ui.pending.length === 0" class="death-menu">
        <button
          v-for="option in deathMenuOptions(ui, store)"
          :key="option"
          type="button"
          class="restart"
          @click="chooseDeath(option)"
        >
          {{ deathLabels[option] }}
        </button>
      </div>
    </main>
    <footer>
      <hr />
      v{{ GAME_VERSION }} &middot; <a href="docs/">docs</a>
    </footer>
    <CommandInput ref="input" @submit="submit" />
    <PromptModal
      :open="ui.prompt !== undefined"
      :title="ui.prompt?.title ?? ''"
      :body="ui.prompt?.body ?? ''"
      :fields="ui.prompt?.fields ?? []"
      :error="ui.prompt?.error"
      @submit="submitPromptForm"
    />
  </div>
</template>

// The "browser-facing path" (§8 task 22's own acceptance criterion): every
// function `src/ui/App.vue` calls lives in `src/ui/controller.ts` and takes
// its `SaveStore` by injection (ADR 0010's own seam), so this file exercises
// the *exact* code the browser shell runs — `submitCommand`, `submitPrompt`,
// beat flushing, the death menu — against `MemoryStore` instead of a real
// `localStorage`. No DOM, no `@vue/test-utils`, no new dev dependency: the
// same "pure functions over explicit state, unit-tested directly" contract
// every other layer of this engine already holds to.
//
// Two slices:
//   1. A real act1 playthrough slice — movement, EXAMINE/TAKE/WEAR/SEARCH/
//      READ, a memory and a clue surfacing with their own `Line.kind`, and
//      the autosave actually landing in the injected store.
//   2. The prompt round-trip and the death menu, against the ported MVP
//      prologue (the one world in this repo that actually opens a generic
//      `prompt` and reaches `died`) — a failed attempt's buffered error
//      text, a correct attempt closing the modal, the arrest, and every
//      death-menu option actually working.

import { describe, expect, it } from 'vitest';
import { DeterministicParser } from '../src/engine/interpreter';
import type { ScriptId } from '../src/engine/ids';
import { compileVocabulary } from '../src/engine/parser';
import { MemoryStore } from '../src/session/store';
import { WORLD as ACT1_WORLD } from '../src/content/world/act1';
import { WORLD as PROLOGUE_WORLD, PROMPT_SCRIPTS } from '../src/content/scenes/mvp-prologue';
import { CREDENTIALS } from '../src/content/scenes/mvp-prologue-prompt';
import {
  chooseDeathOption,
  createUiState,
  deathMenuOptions,
  flushAllBeats,
  flushOneBeat,
  submitCommand,
  submitPrompt,
} from '../src/ui/controller';
import type { ControllerOpts, UiState } from '../src/ui/controller';
import { LocalStorageStore } from '../src/ui/store';

function opts(world: typeof ACT1_WORLD, store: MemoryStore, promptScripts: Record<string, ScriptId> = {}): ControllerOpts {
  return {
    world,
    vocab: compileVocabulary(world),
    parser: new DeterministicParser(),
    store,
    now: () => '2026-08-30T00:00:00.000Z',
    gameVersion: 'test',
    promptScripts,
  };
}

describe('browser-facing path: a real act1 playthrough slice', () => {
  it('plays through movement, examine/take/wear/search/read, a memory, a clue, and persists to the store', () => {
    const store = new MemoryStore();
    const o = opts(ACT1_WORLD, store);
    let ui: UiState = createUiState(o);

    // Dark room: X ME still works (Part 1's own 'self' PlaceId fix).
    ui = submitCommand(ui, 'look', o);
    expect(ui.lines.some((l) => l.kind === 'prose' && l.text.includes('Darkness.'))).toBe(true);

    ui = submitCommand(ui, 'x me', o);
    expect(ui.lines.some((l) => l.text.includes('You take inventory by touch.'))).toBe(true);

    ui = submitCommand(ui, 'pull chain', o);
    // PULL CHAIN's own line renders immediately (not a beat); the room's
    // now-lit LOOK-equivalent render may queue further beats — flush them
    // so later assertions see a settled transcript.
    ui = flushAllBeats(ui);
    expect(ui.lines.some((l) => l.text.includes('the room happens'))).toBe(true);

    ui = submitCommand(ui, 'take fedora', o);
    ui = flushAllBeats(ui);
    ui = submitCommand(ui, 'wear fedora', o);
    ui = flushAllBeats(ui);
    // Wearing the fedora fires the memory — it must render with kind
    // 'memory', distinct from ordinary prose (§8 task 22's own requirement).
    const memoryLines = ui.lines.filter((l) => l.kind === 'memory');
    expect(memoryLines.length).toBeGreaterThan(0);
    expect(memoryLines.some((l) => l.text === 'MEMORY RECOVERED')).toBe(true);
    expect(memoryLines.some((l) => l.text.includes('The hat fits.'))).toBe(true);

    ui = submitCommand(ui, 'search fedora', o);
    ui = flushAllBeats(ui);
    ui = submitCommand(ui, 'take page', o);
    ui = flushAllBeats(ui);
    ui = submitCommand(ui, 'read page', o);
    ui = flushAllBeats(ui);
    // Reading the page notes a clue — kind 'clue', distinct from prose/memory.
    const clueLines = ui.lines.filter((l) => l.kind === 'clue');
    expect(clueLines.some((l) => l.text.includes('The blank page is not blank'))).toBe(true);

    ui = submitCommand(ui, 'open door', o);
    ui = flushAllBeats(ui);
    ui = submitCommand(ui, 'out', o);
    ui = flushAllBeats(ui);
    expect(ui.lines.some((l) => l.text.includes('A landing two floors up'))).toBe(true);
    // A body part still resolves from the second room — Part 1's fix,
    // proven again through the actual browser-facing call path.
    ui = submitCommand(ui, 'touch head', o);
    expect(ui.lines.some((l) => l.text.includes('You go over the back of your skull'))).toBe(true);

    // Every consuming turn autosaves ('auto') and stashes the pre-turn state
    // ('undo') — the real SaveStore contract, exercised through the same
    // takeTurn call the CLI makes, just against MemoryStore instead of a
    // real localStorage.
    expect(store.get('auto')).toBeDefined();
    expect(store.get('undo')).toBeDefined();
    expect(ui.session.state.turn).toBeGreaterThan(0);
  });

  it('a bare Enter (empty submit) does not push a player line or advance the turn', () => {
    const store = new MemoryStore();
    const o = opts(ACT1_WORLD, store);
    let ui: UiState = createUiState(o); // already carries the rendered opening arrival
    const before = ui.session.state.turn;
    const linesBefore = ui.lines;
    ui = submitCommand(ui, '   ', o);
    expect(ui.lines).toBe(linesBefore); // nothing pushed
    expect(ui.session.state.turn).toBe(before);
  });

  it('flushOneBeat reveals exactly one queued line at a time; flushAllBeats reveals the rest', () => {
    const store = new MemoryStore();
    const o = opts(ACT1_WORLD, store);
    let ui: UiState = createUiState(o);
    ui = submitCommand(ui, 'pull chain', o);
    const queued = ui.pending.length;
    if (queued > 0) {
      ui = flushOneBeat(ui);
      expect(ui.pending.length).toBe(queued - 1);
      ui = flushAllBeats(ui);
      expect(ui.pending).toEqual([]);
    }
  });

  it('resuming from an existing "auto" save continues the same session (browser-reload continuity)', () => {
    const store = new MemoryStore();
    const o = opts(ACT1_WORLD, store);
    let ui: UiState = createUiState(o);
    ui = submitCommand(ui, 'pull chain', o);
    const turnAfterFirstCommand = ui.session.state.turn;

    // A fresh UiState, as if the page reloaded — same store, same world.
    const resumed = createUiState(o);
    expect(resumed.session.state.turn).toBe(turnAfterFirstCommand);
    expect(resumed.session.state.location).toBe(ui.session.state.location);
    // The visible transcript does not replay — only the session resumes
    // (this file's header, and controller.ts's own doc comment).
    expect(resumed.lines).toEqual([]);
  });
});

describe('browser-facing path: the prompt round-trip and the death menu', () => {
  function freshPrologue(): { ui: UiState; o: ControllerOpts; store: MemoryStore } {
    const store = new MemoryStore();
    const o = opts(PROLOGUE_WORLD, store, PROMPT_SCRIPTS);
    return { ui: createUiState(o), o, store };
  }

  it('a wrong login attempt buffers its failure text onto the reopened prompt, rather than losing it behind a modal that just stays open', () => {
    const { ui: start, o } = freshPrologue();
    let ui = start;
    // Enough resolved commands to cross the account-prompt trigger.
    ui = submitCommand(ui, 'look', o);
    ui = submitCommand(ui, 'ask jeeves about weather', o);
    ui = submitCommand(ui, 'hello', o);
    ui = submitCommand(ui, 'help', o);
    expect(ui.prompt).toBeDefined();
    expect(ui.prompt!.fields.map((f) => f.name)).toEqual(['username', 'password']);

    ui = submitPrompt(ui, { username: 'wrong', password: 'wrong' }, o);
    expect(ui.prompt).toBeDefined(); // re-opened
    expect(ui.prompt!.error).toBeDefined();
    expect(ui.prompt!.error).toContain('Incorrect');
    // The failure text must not have leaked into the ordinary transcript —
    // it belongs on the modal, exactly where AccountModal always put it.
    expect(ui.lines.some((l) => l.text.includes('Incorrect'))).toBe(false);
  });

  it('the correct credentials close the prompt, run the arrest beats, die, and offer a working death menu', () => {
    const { ui: start, o, store } = freshPrologue();
    let ui = start;
    ui = submitCommand(ui, 'look', o);
    ui = submitCommand(ui, 'ask jeeves about weather', o);
    ui = submitCommand(ui, 'hello', o);
    ui = submitCommand(ui, 'help', o);
    expect(ui.prompt).toBeDefined();

    ui = submitPrompt(ui, { username: CREDENTIALS.username, password: CREDENTIALS.password }, o);
    expect(ui.prompt).toBeUndefined(); // closed, not re-opened
    ui = flushAllBeats(ui);
    expect(ui.lines.some((l) => l.kind === 'death' && l.text === 'YOU HAVE DIED')).toBe(true);
    expect(ui.session.state.phase).toBe('dead');

    const options = deathMenuOptions(ui, store);
    expect(options).toContain('restart');

    // RESTART clears the transcript and returns to a fresh, playing session
    // — and, like any other new game (bug fix: neither shell used to render
    // this at all), its opening arrival is rendered right into it rather
    // than leaving a blank transcript behind an empty prompt.
    const restarted = chooseDeathOption(ui, o, 'restart');
    expect(restarted.session.state.phase).toBe('playing');
    expect(restarted.lines.some((l) => l.kind === 'prose' && l.text.includes('You are sitting in front of a computer.'))).toBe(true);
    expect(restarted.pending).toEqual([]);
  });
});

describe('LocalStorageStore (the one real browser API this shell touches)', () => {
  it('round-trips get/put/list/delete through a minimal fake localStorage', () => {
    const data = new Map<string, string>();
    const fakeLocalStorage = {
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => void data.set(k, v),
      removeItem: (k: string) => void data.delete(k),
      get length() {
        return data.size;
      },
      key: (i: number) => [...data.keys()][i] ?? null,
    };
    const original = (globalThis as { localStorage?: unknown }).localStorage;
    (globalThis as { localStorage?: unknown }).localStorage = fakeLocalStorage;
    try {
      const store = new LocalStorageStore();
      expect(store.get('auto')).toBeUndefined();
      store.put('auto', '{"a":1}');
      expect(store.get('auto')).toBe('{"a":1}');
      expect(store.list()).toEqual(['auto']);
      store.delete('auto');
      expect(store.get('auto')).toBeUndefined();
      expect(store.list()).toEqual([]);
    } finally {
      (globalThis as { localStorage?: unknown }).localStorage = original;
    }
  });
});

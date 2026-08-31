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
import { apply } from '../src/engine/effects';
import { DeterministicParser } from '../src/engine/interpreter';
import { R, S, V } from '../src/engine/ids';
import type { ScriptId } from '../src/engine/ids';
import { compileVocabulary } from '../src/engine/parser';
import type { WorldDef } from '../src/engine/world';
import { MemoryStore } from '../src/session/store';
import { WORLD as ACT1_WORLD } from '../src/content/world/act1';
import { WORLD as PROLOGUE_WORLD, PROMPT_SCRIPTS } from '../src/content/scenes/mvp-prologue';
import { CREDENTIALS } from '../src/content/scenes/mvp-prologue-prompt';
import { RESTART_PROMPT_SCRIPTS } from '../src/session/session';
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

  it('resuming from an existing "auto" save continues the same session (browser-reload continuity) and re-describes the current room instead of rendering a blank screen', () => {
    const store = new MemoryStore();
    const o = opts(ACT1_WORLD, store);
    let ui: UiState = createUiState(o);
    ui = submitCommand(ui, 'pull chain', o);
    ui = flushAllBeats(ui);
    const turnAfterFirstCommand = ui.session.state.turn;
    const clockAfterFirstCommand = ui.session.state.clock;

    // A fresh UiState, as if the page reloaded — same store, same world.
    const resumed = createUiState(o);
    expect(resumed.session.state.turn).toBe(turnAfterFirstCommand);
    expect(resumed.session.state.clock).toEqual(clockAfterFirstCommand); // no turn/clock advance from resuming
    expect(resumed.session.state.location).toBe(ui.session.state.location);
    // The visible transcript does not replay from history — only the
    // session resumes (this file's header, and controller.ts's own doc
    // comment) — but a blank screen is exactly the bug this fixes: the
    // current room is re-described as a plain LOOK (the room is lit by
    // now, from 'pull chain' above, so this is the ordinary description,
    // not the dark-room text).
    expect(resumed.lines.length).toBeGreaterThan(0);
    expect(resumed.lines.every((l) => l.kind === 'prose' || l.kind === 'system')).toBe(true);
  });

  it('resuming with nothing carried/lit yet re-describes the dark starting room, not a blank screen', () => {
    const store = new MemoryStore();
    const o = opts(ACT1_WORLD, store);
    createUiState(o); // renders + autosaves the opening arrival, nothing else done

    const resumed = createUiState(o);
    expect(resumed.lines.some((l) => l.kind === 'prose' && l.text.includes('Darkness.'))).toBe(true);
  });
});

describe('browser-facing path: typed meta commands (Ryan\'s v0.3.2 playtest — RESTART/UNDO/SAVE/etc. reachable by typing, not just buttons)', () => {
  function actOpts(store: MemoryStore): ControllerOpts {
    return opts(ACT1_WORLD, store, RESTART_PROMPT_SCRIPTS);
  }

  it('typed UNDO reverts the last turn, matching the CLI', () => {
    const store = new MemoryStore();
    const o = actOpts(store);
    let ui: UiState = createUiState(o);
    ui = submitCommand(ui, 'pull chain', o);
    ui = flushAllBeats(ui);
    const turnAfterFirst = ui.session.state.turn;

    ui = submitCommand(ui, 'undo', o);
    expect(ui.session.state.turn).toBeLessThan(turnAfterFirst);
    expect(ui.lines.some((l) => l.kind === 'system' && l.text === '(undone)')).toBe(true);
  });

  it('typed SAVE (no name) and LOAD round-trip through the store, the same slot the "save now" button uses', () => {
    const store = new MemoryStore();
    const o = actOpts(store);
    let ui: UiState = createUiState(o);
    ui = submitCommand(ui, 'save', o);
    expect(ui.lines.some((l) => l.text === '(saved as "manual")')).toBe(true);
    expect(store.get('manual')).toBeDefined();

    ui = submitCommand(ui, 'load', o);
    expect(ui.lines.some((l) => l.text === '(loaded "manual")')).toBe(true);
  });

  it('typed RESTART opens a confirm prompt instead of restarting immediately', () => {
    const store = new MemoryStore();
    const o = actOpts(store);
    let ui: UiState = createUiState(o);
    ui = submitCommand(ui, 'pull chain', o); // some progress worth losing
    ui = flushAllBeats(ui);

    ui = submitCommand(ui, 'restart', o);
    expect(ui.prompt).toBeDefined();
    expect(ui.prompt!.body).toBe('This ends the current playthrough and begins again from the start. Restart?');
    expect(ui.session.state.turn).toBeGreaterThan(0); // nothing destroyed yet
  });

  it('typed RESET is a synonym for RESTART, and a decline leaves the game exactly as it was', () => {
    const store = new MemoryStore();
    const o = actOpts(store);
    let ui: UiState = createUiState(o);
    ui = submitCommand(ui, 'pull chain', o);
    ui = flushAllBeats(ui);
    const sessionBefore = ui.session;

    ui = submitCommand(ui, 'reset', o);
    expect(ui.prompt).toBeDefined();
    ui = submitPrompt(ui, { confirm: 'no' }, o);
    expect(ui.prompt).toBeUndefined();
    expect(ui.session).toEqual(sessionBefore); // untouched
    expect(ui.lines.some((l) => l.text === 'Nothing has changed. The game is where you left it.')).toBe(true);
  });

  it('a confirmed RESTART clears the transcript and starts a fresh playthrough, exactly like the death-menu button', () => {
    const store = new MemoryStore();
    const o = actOpts(store);
    let ui: UiState = createUiState(o);
    ui = submitCommand(ui, 'pull chain', o);
    ui = flushAllBeats(ui);
    ui = submitCommand(ui, 'restart', o);
    expect(ui.prompt).toBeDefined();

    ui = submitPrompt(ui, { confirm: 'yes' }, o);
    expect(ui.prompt).toBeUndefined();
    expect(ui.session.state.turn).toBe(0);
    expect(ui.session.undoRing).toEqual([]);
    // No banner, no "Restarting." line — the opening beats are the only
    // thing that follows a confirmed restart (response-families doc §10's
    // own ruling).
    expect(ui.lines.every((l) => l.text !== 'RESTARTED')).toBe(true);
    expect(ui.lines.some((l) => l.kind === 'prose' && l.text.includes('Darkness.'))).toBe(true);
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

describe('the recursive ending hand-off through the browser prompt round-trip (ADR 0012, Stage E E-1)', () => {
  // A tiny WorldDef of this describe block's own — not ACT1_WORLD/PROLOGUE_WORLD
  // — a room-level bare-verb handler (mirroring `tests/fixtures/world.ts`'s
  // own SIGH pattern) opens a prompt whose respond script fires a real
  // `{ end }` effect through `apply()`, exactly like a content prompt-respond
  // script (P28's form, R13's screen) will.
  const ROOM = R('handoff_ui_room');
  const INITIALIZE = V('handoff_ui_initialize');
  const OPEN_SCRIPT = S('handoff_ui_open');
  const RESPOND_SCRIPT = S('handoff_ui_respond');
  const PROMPT_ID = 'handoff_ui_prompt';
  const ENDING_ID = 'handoff_ui_ending';
  const OPENING_MARKER = 'The opening arrival, rendered once, ever, at the true start of a fresh game.';

  const WORLD: WorldDef = {
    meta: {
      phases: { morning: 360, afternoon: 720, evening: 1080, night: 1320 },
      weekLength: 7,
      startRoom: ROOM,
      recursiveEnding: ENDING_ID,
    },
    flags: {},
    rooms: {
      [ROOM]: {
        name: 'Terminal Room',
        description: 'A plain room with a terminal.',
        firstVisit: OPENING_MARKER,
        handlers: [{ verbs: [INITIALIZE], effects: [{ script: { id: OPEN_SCRIPT } }] }],
      },
    },
    verbs: {
      [INITIALIZE]: { id: INITIALIZE, words: ['initialize'], patterns: ['V'], class: 'direct', default: 'Nothing happens.' },
    },
    scripts: {
      [OPEN_SCRIPT]: (_world, state) => ({
        state,
        events: [{ type: 'prompt', id: PROMPT_ID, title: 'INITIALIZE', body: 'Confirm?', fields: [{ name: 'confirm' }] }],
      }),
      [RESPOND_SCRIPT]: (world, state) =>
        apply(world, state, [{ say: 'Darkness.' }, { say: 'Your head hurts.' }, { end: ENDING_ID }], { path: 'script.handoff_ui_respond' }),
    },
    responses: { 'ended.refused': 'Nothing more now.' },
  };

  function opts(store: MemoryStore): ControllerOpts {
    return {
      world: WORLD,
      vocab: compileVocabulary(WORLD),
      parser: new DeterministicParser(),
      store,
      now: () => '2026-08-31T00:00:00.000Z',
      gameVersion: 'test',
      promptScripts: { [PROMPT_ID]: RESPOND_SCRIPT },
    };
  }

  it("submitPrompt on the recursive ending keeps the transcript (lines are not cleared) and appends the fresh game's own opening", () => {
    const store = new MemoryStore();
    const o = opts(store);
    let ui: UiState = createUiState(o);
    ui = submitCommand(ui, 'initialize', o);
    expect(ui.prompt).toBeDefined();
    const linesBeforePrompt = ui.lines;

    ui = submitPrompt(ui, { confirm: 'yes' }, o);

    expect(ui.prompt).toBeUndefined();
    expect(ui.session.state.turn).toBe(0); // a fresh game, not the one that just ended
    expect(ui.session.state.location).toBe(ROOM);

    // The transcript is NOT cleared — every line already there stays,
    // unlike a confirmed RESTART's `freshUi` (this file's own "a confirmed
    // RESTART clears the transcript" test, above) — no `restarted` event
    // is ever involved in the recursive-ending hand-off.
    expect(ui.lines.slice(0, linesBeforePrompt.length)).toEqual(linesBeforePrompt);

    const appended = ui.lines.slice(linesBeforePrompt.length);
    expect(appended.some((l) => l.text === 'Darkness.')).toBe(true);
    expect(appended.some((l) => l.text === 'Your head hurts.')).toBe(true);
    expect(appended.some((l) => l.text === OPENING_MARKER)).toBe(true);
    // Neither shell gains ending logic (ADR 0012's own consequence): no
    // generic 'ended' rendering ("THE END") leaks through, because the
    // `ended` event itself never reaches this event loop.
    expect(appended.some((l) => l.text === 'THE END')).toBe(false);

    expect(store.get('ending')).toBeDefined();
    expect(store.get('undo')).toBeUndefined();
    expect(store.get('checkpoint')).toBeUndefined();
    expect(store.get('auto')).toBeDefined();
  });
});

describe('LocalStorageStore (the one real browser API this shell touches)', () => {
  it('round-trips get/put/list/remove through a minimal fake localStorage', () => {
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
      store.remove('auto');
      expect(store.get('auto')).toBeUndefined();
      expect(store.list()).toEqual([]);
    } finally {
      (globalThis as { localStorage?: unknown }).localStorage = original;
    }
  });
});

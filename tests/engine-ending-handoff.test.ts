// Stage E, E-1: the ending's hand-off (session contract, ADR 0012 items
// 1-5). A tiny two-room `WorldDef` of this file's own — not
// `tests/fixtures/world.ts` — kept out of both the shared engine fixture
// and the concurrent E-2/E-3/E-5 builder's files, the way
// `tests/parser-compound-nouns.test.ts` builds its own `WorldDef` rather
// than reaching for the shared one. ROOM_START (the game's start room)
// leads north to ROOM_END, whose room-level INITIALIZE handler fires the
// world's declared `meta.recursiveEnding`; a second, differently-idd
// ending (COLLAPSE) proves the hand-off fires only for the one id
// `meta.recursiveEnding` names. A prompt-closing script (`ENDING_SCRIPT`)
// exercises the same hand-off through `respondToPrompt` (ADR 0012 item 2 —
// a script-built `{ end }` effect, exactly like P28's form/R13's screen
// will be).

import { describe, expect, it } from 'vitest';
import { apply } from '../src/engine/effects';
import { F, O, R, S, V } from '../src/engine/ids';
import type { InterpretOutcome, StructuredAction } from '../src/engine/interpreter';
import { DIRECTION_VERB_IDS } from '../src/engine/move';
import { compileVocabulary } from '../src/engine/parser/vocabulary';
import { validate } from '../src/engine/validate';
import { initialState } from '../src/engine/world';
import type { WorldDef } from '../src/engine/world';
import { MemoryStore } from '../src/session/store';
import { createSession, load, respondToPrompt, startSession, takeTurn, undo } from '../src/session/session';
import type { PersistOptions } from '../src/session/session';

const ROOM_START = R('handoff_start');
const ROOM_END = R('handoff_end');
const TERMINAL = O('handoff_terminal'); // an object, not a room-level handler — `validate.ts`'s `collectAllEffectLists` (shared by the death/ending-refused-family rule) only walks object/npc/event/puzzle effect lists, not room-level ones
const INITIALIZE = V('handoff_initialize');
const COLLAPSE = V('handoff_collapse'); // a second, non-recursive ending verb
const ENDING_SCRIPT = S('handoff_ending_script'); // fires the recursive ending from a prompt, not a turn
const FLAG_UNUSED = F('handoff_flag_unused'); // never touched by any effect — just here to prove flags stay untouched

const RECURSIVE_ENDING_ID = 'handoff_recursive_ending';
const OTHER_ENDING_ID = 'handoff_other_ending';

function buildWorld(): WorldDef {
  return {
    meta: {
      phases: { morning: 360, afternoon: 720, evening: 1080, night: 1320 },
      weekLength: 7,
      startRoom: ROOM_START,
      recursiveEnding: RECURSIVE_ENDING_ID,
    },
    flags: {
      [FLAG_UNUSED]: { default: false, doc: 'never set by any effect in this fixture' },
    },
    rooms: {
      [ROOM_START]: {
        name: 'Start Room',
        description: 'A plain room where a fresh game always begins.',
        firstVisit: 'You wake here, and nothing about it has happened before.',
        exits: [{ dir: 'n', to: ROOM_END }],
      },
      [ROOM_END]: {
        name: 'Terminal Room',
        description: 'A quiet console room.',
        firstVisit: 'A console glows at the far wall.',
      },
    },
    objects: {
      [TERMINAL]: {
        location: ROOM_END,
        name: 'terminal',
        nouns: ['terminal'],
        handlers: [
          { verbs: [INITIALIZE], effects: [{ say: 'Darkness.' }, { say: 'Your head hurts.' }, { end: RECURSIVE_ENDING_ID }] },
          { verbs: [COLLAPSE], effects: [{ say: 'A different silence.' }, { end: OTHER_ENDING_ID }] },
        ],
      },
    },
    verbs: {
      [INITIALIZE]: { id: INITIALIZE, words: ['initialize'], patterns: ['V dobj'], class: 'direct', default: 'Nothing happens.' },
      [COLLAPSE]: { id: COLLAPSE, words: ['collapse'], patterns: ['V dobj'], class: 'direct', default: 'Nothing happens.' },
    },
    scripts: {
      // Mirrors what a content prompt-respond script (P28's form, R13's
      // screen) will actually do: apply a real `{ end }` effect through
      // `apply()`, not hand-fake the resulting state.
      [ENDING_SCRIPT]: (world, state) =>
        apply(world, state, [{ say: 'Darkness.' }, { say: 'Your head hurts.' }, { end: RECURSIVE_ENDING_ID }], { path: 'script.handoff_ending_script' }),
    },
    responses: {
      'ended.refused': 'There is nothing more to do.',
    },
  };
}

const WORLD = buildWorld();
const vocab = compileVocabulary(WORLD);
const NOW = '2026-08-31T00:00:00.000Z';

function opts(store: MemoryStore): PersistOptions {
  return { store, now: NOW, gameVersion: 'test-0.0.0' };
}

function action(verb: typeof INITIALIZE | typeof COLLAPSE, raw: string): InterpretOutcome {
  const a: StructuredAction = { verb, dobj: TERMINAL, raw };
  return { kind: 'actions', actions: [a] };
}

function north(): InterpretOutcome {
  const a: StructuredAction = { verb: DIRECTION_VERB_IDS.n, raw: 'north' };
  return { kind: 'actions', actions: [a] };
}

/** Every existing test's own store, moved to ROOM_END (one turn: north). */
function atTerminal(store: MemoryStore) {
  let session = createSession(WORLD);
  session = takeTurn(WORLD, session, vocab, north(), opts(store)).session;
  return session;
}

describe('validate: meta-recursive-ending-unreferenced (ADR 0012 item 1)', () => {
  it('does not fire when the declared id is carried by a declared {end} effect', () => {
    const findings = validate(WORLD);
    expect(findings.some((f) => f.code === 'meta-recursive-ending-unreferenced')).toBe(false);
  });

  it('fires when the declared id names no {end} effect anywhere in the world', () => {
    const ghostWorld: WorldDef = { ...WORLD, meta: { ...WORLD.meta, recursiveEnding: 'ghost_ending_nobody_fires' } };
    const findings = validate(ghostWorld);
    expect(findings.some((f) => f.code === 'meta-recursive-ending-unreferenced' && f.severity === 'warning')).toBe(true);
  });

  it('is silent when meta.recursiveEnding is not declared at all', () => {
    const { recursiveEnding: _unused, ...metaWithout } = WORLD.meta;
    const noRecursiveWorld: WorldDef = { ...WORLD, meta: metaWithout };
    const findings = validate(noRecursiveWorld);
    expect(findings.some((f) => f.code === 'meta-recursive-ending-unreferenced')).toBe(false);
  });
});

describe('the recursive ending hand-off, via takeTurn (ADR 0012 items 2-5)', () => {
  it('returns a fresh session equal to startSession\'s, with the turn\'s events minus "ended" then the opening arrival\'s, and no "restarted" event', () => {
    const store = new MemoryStore();
    const session = atTerminal(store);
    const result = takeTurn(WORLD, session, vocab, action(INITIALIZE, 'initialize'), opts(store));
    const fresh = startSession(WORLD);

    expect(result.handedOff).toBe(true);
    expect(result.events.some((e) => e.type === 'ended')).toBe(false);
    expect(result.events.some((e) => e.type === 'restarted')).toBe(false);
    // The ending's own beats lead...
    expect(result.events.slice(0, 2)).toEqual([
      { type: 'line', kind: 'prose', text: 'Darkness.' },
      { type: 'line', kind: 'prose', text: 'Your head hurts.' },
    ]);
    // ...immediately followed by the fresh game's own opening arrival, with
    // nothing in between (no banner, no system line) — one transcript.
    expect(result.events.slice(2)).toEqual(fresh.events);
  });

  it('the returned session is a fresh game at its start room, turn 0, with state.profile/flags/clues/memories all initial — nothing crosses (register 99)', () => {
    const store = new MemoryStore();
    const session = atTerminal(store);
    const result = takeTurn(WORLD, session, vocab, action(INITIALIZE, 'initialize'), opts(store));

    expect(result.session.state).toEqual(initialState(WORLD));
    expect(result.session.state.turn).toBe(0);
    expect(result.session.undoRing).toEqual([]);
    expect(result.session.history).toEqual([]);
    expect(result.session.historyTruncated).toBe(false);
  });

  it('slot "ending" holds the pre-hand-off ended state, loadable with phase "ended"', () => {
    const store = new MemoryStore();
    const session = atTerminal(store);
    takeTurn(WORLD, session, vocab, action(INITIALIZE, 'initialize'), opts(store));

    const loaded = load(store, 'ending');
    expect(loaded).toBeDefined();
    expect(loaded!.state.phase).toBe('ended');
    expect(loaded!.state.ending).toEqual({ id: RECURSIVE_ENDING_ID });
    expect(loaded!.state.location).toBe(ROOM_END);
  });

  it('slots "undo" and "checkpoint" are removed, and "auto" holds the fresh game\'s state', () => {
    const store = new MemoryStore();
    const session = atTerminal(store);
    // Seed a stale checkpoint by hand — this fixture never fires one itself
    // — to prove the hand-off actually removes it, not merely never wrote one.
    store.put('checkpoint', 'seed-should-be-removed');
    expect(store.get('undo')).toBeDefined(); // autosaved by the earlier "north" turn

    takeTurn(WORLD, session, vocab, action(INITIALIZE, 'initialize'), opts(store));

    expect(store.get('undo')).toBeUndefined();
    expect(store.get('checkpoint')).toBeUndefined();
    expect(store.get('auto')).toBeDefined();
    const autoLoaded = load(store, 'auto')!;
    expect(autoLoaded.state).toEqual(initialState(WORLD));
  });

  it('UNDO after the hand-off is a no-op (the ring is reseeded empty and slot "undo" is gone)', () => {
    const store = new MemoryStore();
    const session = atTerminal(store);
    const result = takeTurn(WORLD, session, vocab, action(INITIALIZE, 'initialize'), opts(store));

    const undone = undo(result.session, store);
    expect(undone).toEqual(result.session);
  });

  it('a non-recursive ending (a different {end} id) still sets phase "ended" but hands off nothing', () => {
    const store = new MemoryStore();
    const session = atTerminal(store);
    const result = takeTurn(WORLD, session, vocab, action(COLLAPSE, 'collapse'), opts(store));

    expect(result.handedOff).toBeUndefined();
    expect(result.session.state.phase).toBe('ended');
    expect(result.session.state.ending).toEqual({ id: OTHER_ENDING_ID });
    expect(result.events.some((e) => e.type === 'ended' && e.endingId === OTHER_ENDING_ID)).toBe(true);
    expect(store.get('ending')).toBeUndefined();
  });
});

describe('the recursive ending hand-off, via respondToPrompt (ADR 0012 item 2 — a script-built {end} effect)', () => {
  it('hands off exactly like takeTurn: a fresh session, the turn\'s events minus "ended" then the opening arrival, "ending"/"auto" written, "undo"/"checkpoint" removed', () => {
    const store = new MemoryStore();
    let session = createSession(WORLD);
    session = takeTurn(WORLD, session, vocab, north(), opts(store)).session; // some progress worth losing, and an 'undo' slot to prove removed
    store.put('checkpoint', 'seed-should-be-removed');

    const result = respondToPrompt(WORLD, session, ENDING_SCRIPT, {}, opts(store));
    const fresh = startSession(WORLD);

    expect(result.handedOff).toBe(true);
    expect(result.events.some((e) => e.type === 'ended')).toBe(false);
    expect(result.events.slice(0, 2)).toEqual([
      { type: 'line', kind: 'prose', text: 'Darkness.' },
      { type: 'line', kind: 'prose', text: 'Your head hurts.' },
    ]);
    expect(result.events.slice(2)).toEqual(fresh.events);
    expect(result.session.state).toEqual(initialState(WORLD));

    expect(load(store, 'ending')!.state.phase).toBe('ended');
    expect(store.get('undo')).toBeUndefined();
    expect(store.get('checkpoint')).toBeUndefined();
    expect(load(store, 'auto')!.state).toEqual(initialState(WORLD));
  });

  it('without opts, the hand-off still happens in memory but nothing is written to any store (fixtures)', () => {
    const session = createSession(WORLD);
    const result = respondToPrompt(WORLD, session, ENDING_SCRIPT, {});

    expect(result.handedOff).toBe(true);
    expect(result.session.state).toEqual(initialState(WORLD));
    expect(result.events.some((e) => e.type === 'ended')).toBe(false);
  });
});

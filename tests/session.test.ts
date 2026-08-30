// tests/session.test.ts — spec §5 (save/undo/autosave/checkpoints), ADR
// 0009/0010, §8 task 18.
//
// Scope: `src/session/` end to end against `MemoryStore` — save/load
// round-trip, autosave cadence, the undo ring plus its post-reload
// single-undo fallback, checkpoints/RESTART ENCOUNTER, export/import, the
// history ceiling, the prompt round-trip, death menu options, the ALL/AND
// one-turn-one-tally decision (`turn.ts`'s header), and — the durability
// contract itself (§5.2) — a save taken against one world played correctly
// once rooms/objects/flags are added to it, with no migration step.
//
// Turns are driven by hand-built `InterpretOutcome`s (the same pattern
// `tests/respond.test.ts` and `tests/parser-multi.test.ts` already use),
// not `DeterministicParser.interpret()` against a real `ScopeView` —
// building a production `ScopeView` from `WorldDef`/`GameState` is still
// unbuilt (see `src/engine/turn.ts`'s header); wiring the real parser end
// to end is CLI v2's job (task 20).

import { describe, expect, it } from 'vitest';
import { BUILTIN_VERB_IDS } from '../src/engine/actions';
import { flag } from '../src/engine/cond';
import { F, O, R } from '../src/engine/ids';
import type { ObjectId } from '../src/engine/ids';
import type { InterpretOutcome, StructuredAction } from '../src/engine/interpreter';
import { compileVocabulary } from '../src/engine/parser/vocabulary';
import { objectLocation } from '../src/engine/resolve';
import { DEAD_REFUSED_FAMILY, ENDED_REFUSED_FAMILY } from '../src/engine/turn';
import { validate } from '../src/engine/validate';
import { scope } from '../src/engine/world';
import type { WorldDef } from '../src/engine/world';
import { RESPONSES } from '../src/content/response-families';
import { MemoryStore } from '../src/session/store';
import { HISTORY_CEILING, appendHistory } from '../src/session/savefile';
import type { HistoryEntry } from '../src/session/savefile';
import {
  createSession,
  deathOptions,
  exportSave,
  importSave,
  listSaves,
  load,
  respondToPrompt,
  restart,
  restartEncounter,
  save,
  takeTurn,
  undo,
} from '../src/session/session';
import type { PersistOptions, SessionState } from '../src/session/session';
import {
  FIXTURE_CHECKPOINT_ID,
  FIXTURE_PROMPT_ID,
  FIXTURE_PROMPT_PASSWORD,
  FIXTURE_PROMPT_USERNAME,
  FIXTURE_WORLD,
  FLAG_PROMPT_ATTEMPTS,
  FLAG_PROMPT_SOLVED,
  HAT,
  KEY,
  LAMP,
  LETTER,
  PROMPT_RESPOND_SCRIPT,
  ROOM_A,
  SIGIL,
  TERMINAL,
  WAVE,
} from './fixtures/world';

const NOW = '2026-08-30T00:00:00.000Z';
// The fixture's own `responses` only covers the built-in verbs' own
// families (§8 task 8's rule); the §3.6 ladder's global families
// ('unknown', 'nounMiss.*', …) live in real approved prose
// (`src/content/response-families.ts`) — merged in the same way
// `tests/respond.test.ts` does, so a miss outcome (the autosave-cadence
// test's "nothing consumed a turn" case) renders instead of throwing.
const WORLD: WorldDef = { ...FIXTURE_WORLD, responses: { ...FIXTURE_WORLD.responses, ...RESPONSES } };
const vocab = compileVocabulary(WORLD);

function opts(store: MemoryStore, gameVersion = 'test-0.0.0'): PersistOptions {
  return { store, now: NOW, gameVersion };
}

function takeAction(dobj: ObjectId, raw: string): StructuredAction {
  return { verb: BUILTIN_VERB_IDS.take, dobj, raw };
}

function actionsOutcome(actions: StructuredAction[]): InterpretOutcome {
  return { kind: 'actions', actions };
}

// ---------------------------------------------------------------------------
// Save / load round-trip (§5.1, §5.3)
// ---------------------------------------------------------------------------

describe('save/load round-trip', () => {
  it('a manual SAVE and LOAD reproduce the exact session state', () => {
    const store = new MemoryStore();
    const o = opts(store);
    let session = createSession(WORLD);
    session = takeTurn(WORLD, session, vocab, actionsOutcome([takeAction(KEY, 'take key')]), o).session;
    session = takeTurn(WORLD, session, vocab, actionsOutcome([takeAction(HAT, 'take hat')]), o).session;

    save(session, { ...o, slot: 'slot1', label: 'before the door' });
    const loaded = load(store, 'slot1');

    expect(loaded).toBeDefined();
    expect(loaded!.state).toEqual(session.state);
    expect(loaded!.history).toEqual(session.history);
    expect(loaded!.undoRing).toEqual([]); // §5.5: LOAD reseeds the ring, not the live one
  });

  it('LOAD of a slot that was never written returns undefined, not a throw', () => {
    const store = new MemoryStore();
    expect(load(store, 'nope')).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Autosave cadence (§5.5)
// ---------------------------------------------------------------------------

describe('autosave cadence', () => {
  it('writes slot "auto" after every turn-consuming action, and leaves it alone otherwise', () => {
    const store = new MemoryStore();
    const o = opts(store);
    let session = createSession(WORLD);
    expect(store.get('auto')).toBeUndefined();

    session = takeTurn(WORLD, session, vocab, actionsOutcome([takeAction(KEY, 'take key')]), o).session;
    const afterFirst = store.get('auto');
    expect(afterFirst).toBeDefined();
    expect((JSON.parse(afterFirst!) as { state: { turn: number } }).state.turn).toBe(1);

    // A parser miss resolves nothing (§3.6 rungs 3-5) — no turn, no autosave rewrite.
    const missed = takeTurn(WORLD, session, vocab, { kind: 'miss', raw: 'xyzzy', knownNouns: [] }, o);
    expect(store.get('auto')).toBe(afterFirst);
    expect(missed.session.state.turn).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// Undo ring + post-reload single undo (§5.5)
// ---------------------------------------------------------------------------

describe('undo ring + post-reload single undo', () => {
  it('UNDO from the in-memory ring walks back one turn at a time', () => {
    const store = new MemoryStore();
    const o = opts(store);
    let session = createSession(WORLD);
    session = takeTurn(WORLD, session, vocab, actionsOutcome([takeAction(KEY, 'take key')]), o).session;
    session = takeTurn(WORLD, session, vocab, actionsOutcome([takeAction(HAT, 'take hat')]), o).session;
    expect(session.state.turn).toBe(2);

    const back1 = undo(session, store);
    expect(back1.state.turn).toBe(1);
    expect(objectLocation(WORLD, back1.state, KEY)).toBe('inventory');
    expect(objectLocation(WORLD, back1.state, HAT)).toBe(ROOM_A);

    const back2 = undo(back1, store);
    expect(back2.state.turn).toBe(0);
    expect(objectLocation(WORLD, back2.state, KEY)).toBe(ROOM_A);
  });

  it('exactly one UNDO works after a simulated browser reload, and a second is a no-op', () => {
    const store = new MemoryStore();
    const o = opts(store);
    let session = createSession(WORLD);
    session = takeTurn(WORLD, session, vocab, actionsOutcome([takeAction(KEY, 'take key')]), o).session;
    session = takeTurn(WORLD, session, vocab, actionsOutcome([takeAction(HAT, 'take hat')]), o).session;

    // Simulate a reload: a fresh session built only from the autosave, ring empty.
    const reloaded = load(store, 'auto')!;
    expect(reloaded.undoRing).toEqual([]);

    const undone = undo(reloaded, store);
    expect(undone.state.turn).toBe(1);
    expect(objectLocation(WORLD, undone.state, HAT)).toBe(ROOM_A);
    expect(objectLocation(WORLD, undone.state, KEY)).toBe('inventory');

    const undoneAgain = undo(undone, store);
    expect(undoneAgain.state).toEqual(undone.state); // nothing further recorded to fall back to
  });
});

// ---------------------------------------------------------------------------
// Checkpoints / RESTART ENCOUNTER (§5.6)
// ---------------------------------------------------------------------------

describe('checkpoints / RESTART ENCOUNTER', () => {
  it('persists slot "checkpoint" when a {checkpoint} effect fires, and RESTART ENCOUNTER reloads it', () => {
    const store = new MemoryStore();
    const o = opts(store);
    let session = createSession(WORLD);
    expect(store.get('checkpoint')).toBeUndefined();

    const checkpointed = takeTurn(WORLD, session, vocab, actionsOutcome([takeAction(SIGIL, 'take sigil')]), o);
    session = checkpointed.session;
    expect(checkpointed.events.some((e) => e.type === 'checkpoint' && e.id === FIXTURE_CHECKPOINT_ID)).toBe(true);
    expect(store.get('checkpoint')).toBeDefined();

    session = takeTurn(WORLD, session, vocab, actionsOutcome([takeAction(HAT, 'take hat')]), o).session;
    expect(session.state.turn).toBe(2);

    const restored = restartEncounter(store);
    expect(restored).toBeDefined();
    expect(restored!.state.turn).toBe(1);
    expect(objectLocation(WORLD, restored!.state, SIGIL)).toBe('inventory');
    expect(objectLocation(WORLD, restored!.state, HAT)).toBe(ROOM_A); // reverted
  });

  it('RESTART ENCOUNTER with no checkpoint yet returns undefined', () => {
    expect(restartEncounter(new MemoryStore())).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Export / import (§5.3)
// ---------------------------------------------------------------------------

describe('export / import', () => {
  it('EXPORT produces JSON that IMPORT reproduces exactly', () => {
    const o = opts(new MemoryStore());
    let session = createSession(WORLD);
    session = takeTurn(WORLD, session, vocab, actionsOutcome([takeAction(KEY, 'take key')]), o).session;

    const json = exportSave(session, o);
    const imported = importSave(json);
    expect(imported.state).toEqual(session.state);
    expect(imported.history).toEqual(session.history);
  });
});

describe('SAVES listing', () => {
  it('lists only player-named slots, never the reserved bookkeeping ones', () => {
    const store = new MemoryStore();
    const o = opts(store);
    let session = createSession(WORLD);
    session = takeTurn(WORLD, session, vocab, actionsOutcome([takeAction(KEY, 'take key')]), o).session; // writes auto/undo
    save(session, { ...o, slot: 'my-save' });
    expect(listSaves(store).sort()).toEqual(['my-save']);
  });
});

describe('RESTART', () => {
  it('produces a fresh session, independent of anything already persisted', () => {
    const fresh = restart(WORLD);
    expect(fresh.state.turn).toBe(0);
    expect(fresh.history).toEqual([]);
    expect(fresh.undoRing).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// History ceiling + historyTruncated (§5.1)
// ---------------------------------------------------------------------------

describe('history ceiling (appendHistory)', () => {
  it('drops the oldest entry past HISTORY_CEILING and sets historyTruncated', () => {
    const seed: HistoryEntry[] = Array.from({ length: HISTORY_CEILING }, (_, i) => ({ turn: i, input: `turn ${i}` }));
    const result = appendHistory(seed, { turn: HISTORY_CEILING, input: 'one more' }, false);
    expect(result.history).toHaveLength(HISTORY_CEILING);
    expect(result.historyTruncated).toBe(true);
    expect(result.history[0]).toEqual({ turn: 1, input: 'turn 1' }); // turn 0 dropped
    expect(result.history.at(-1)).toEqual({ turn: HISTORY_CEILING, input: 'one more' });
  });

  it('does not truncate at or under the ceiling', () => {
    const seed: HistoryEntry[] = Array.from({ length: HISTORY_CEILING - 1 }, (_, i) => ({ turn: i, input: `turn ${i}` }));
    const result = appendHistory(seed, { turn: HISTORY_CEILING - 1, input: 'last' }, false);
    expect(result.history).toHaveLength(HISTORY_CEILING);
    expect(result.historyTruncated).toBe(false);
  });

  it('once truncated, stays truncated regardless of what a later append reports', () => {
    const seed: HistoryEntry[] = Array.from({ length: HISTORY_CEILING }, (_, i) => ({ turn: i, input: `turn ${i}` }));
    const result = appendHistory(seed, { turn: HISTORY_CEILING, input: 'x' }, true);
    expect(result.historyTruncated).toBe(true);
  });
});

describe('history ceiling threaded through takeTurn/save', () => {
  it('sets historyTruncated once a real turn crosses the ceiling, and the save reflects it', () => {
    const store = new MemoryStore();
    const o = opts(store);
    const seededHistory: HistoryEntry[] = Array.from({ length: HISTORY_CEILING }, (_, i) => ({ turn: i + 1, input: 'wait' }));
    const session: SessionState = {
      state: { ...createSession(WORLD).state, turn: HISTORY_CEILING },
      undoRing: [],
      history: seededHistory,
      historyTruncated: false,
    };

    const result = takeTurn(WORLD, session, vocab, actionsOutcome([takeAction(KEY, 'take key')]), o);
    expect(result.session.history).toHaveLength(HISTORY_CEILING);
    expect(result.session.historyTruncated).toBe(true);

    const savedAuto = JSON.parse(store.get('auto')!) as { historyTruncated?: true };
    expect(savedAuto.historyTruncated).toBe(true);
  });

  it('a fresh save has no historyTruncated key at all (§5.1: only set when it ever truncates)', () => {
    const store = new MemoryStore();
    const o = opts(store);
    const session = createSession(WORLD);
    takeTurn(WORLD, session, vocab, actionsOutcome([takeAction(KEY, 'take key')]), o);

    const savedAuto = JSON.parse(store.get('auto')!) as Record<string, unknown>;
    expect('historyTruncated' in savedAuto).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Prompt round-trip (§5.7): prompt event -> respondToPrompt -> script
// ---------------------------------------------------------------------------

describe('prompt round-trip', () => {
  it('opens via a handler script, and a correct respondToPrompt closes it', () => {
    const store = new MemoryStore();
    const o = opts(store);
    let session = createSession(WORLD);

    const opened = takeTurn(
      WORLD,
      session,
      vocab,
      actionsOutcome([{ verb: BUILTIN_VERB_IDS.turnOn, dobj: TERMINAL, raw: 'turn on terminal' }]),
      o,
    );
    session = opened.session;
    const promptEvent = opened.events.find((e) => e.type === 'prompt');
    expect(promptEvent).toBeDefined();
    expect(promptEvent).toMatchObject({ id: FIXTURE_PROMPT_ID, title: 'Terminal Login' });
    const turnAfterOpen = session.state.turn;

    const failed = respondToPrompt(WORLD, session, PROMPT_RESPOND_SCRIPT, { username: 'nobody', password: 'wrong' });
    expect(flag(WORLD, failed.session.state, FLAG_PROMPT_ATTEMPTS)).toBe(1);
    expect(failed.session.state.turn).toBe(turnAfterOpen); // answering a prompt is never a world turn

    const solved = respondToPrompt(WORLD, failed.session, PROMPT_RESPOND_SCRIPT, {
      username: FIXTURE_PROMPT_USERNAME,
      password: FIXTURE_PROMPT_PASSWORD,
    });
    expect(solved.events.some((e) => e.type === 'promptClosed' && e.id === FIXTURE_PROMPT_ID)).toBe(true);
    expect(flag(WORLD, solved.session.state, FLAG_PROMPT_SOLVED)).toBe(true);
  });

  it('a save taken mid-prompt preserves the exchange across load', () => {
    const store = new MemoryStore();
    const o = opts(store);
    let session = createSession(WORLD);
    session = takeTurn(
      WORLD,
      session,
      vocab,
      actionsOutcome([{ verb: BUILTIN_VERB_IDS.turnOn, dobj: TERMINAL, raw: 'turn on terminal' }]),
      o,
    ).session;
    session = respondToPrompt(WORLD, session, PROMPT_RESPOND_SCRIPT, { username: 'x', password: 'y' }).session;
    expect(flag(WORLD, session.state, FLAG_PROMPT_ATTEMPTS)).toBe(1);

    save(session, { ...o, slot: 'mid-prompt' });
    const reloaded = load(store, 'mid-prompt')!;
    expect(flag(WORLD, reloaded.state, FLAG_PROMPT_ATTEMPTS)).toBe(1);

    const solved = respondToPrompt(WORLD, reloaded, PROMPT_RESPOND_SCRIPT, {
      username: FIXTURE_PROMPT_USERNAME,
      password: FIXTURE_PROMPT_PASSWORD,
    });
    expect(flag(WORLD, solved.session.state, FLAG_PROMPT_SOLVED)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Phase gate (`turn.ts`, coordinator follow-up to task 18) + death menu
// flow (constitution §11, §5.5)
//
// `PHASE_GATE_WORLD` layers a real `{die}`/`{end}` effect (TRAP/BEACON) and
// the two refusal families the phase gate reads (`DEAD_REFUSED_FAMILY`/
// `ENDED_REFUSED_FAMILY`) on top of `WORLD`, local to this file — see
// `tests/fixtures/world.ts`'s note at `SIGIL` for why these don't live in
// the shared fixture (`validate.ts`'s new death/ending-family rule would
// otherwise force every `tests/validate.test.ts` case that substitutes a
// narrower `responses` map over `FIXTURE_WORLD` to also carry them).
// ---------------------------------------------------------------------------

const TRAP = O('fixture_trap');
const BEACON = O('fixture_beacon');
const FIXTURE_DEATH_ID = 'fixture_death_trap';
const FIXTURE_ENDING_ID = 'fixture_ending_beacon';
const DEAD_REFUSED_TEXT = "You are dead. There's nothing more you can do here.";
const ENDED_REFUSED_TEXT = 'The story is already over.';

const PHASE_GATE_WORLD: WorldDef = {
  ...WORLD,
  objects: {
    ...WORLD.objects,
    [TRAP]: {
      location: ROOM_A,
      name: 'rusted trap',
      nouns: ['trap'],
      adjectives: ['rusted'],
      portable: true,
      handlers: [
        {
          verbs: [BUILTIN_VERB_IDS.take],
          class: 'direct',
          effects: [{ say: 'The trap snaps shut around your wrist.' }, { die: FIXTURE_DEATH_ID }],
        },
      ],
    },
    [BEACON]: {
      location: ROOM_A,
      name: 'signal beacon',
      nouns: ['beacon'],
      handlers: [
        {
          verbs: [BUILTIN_VERB_IDS.turnOff],
          class: 'direct',
          effects: [{ say: 'The beacon powers down.' }, { end: FIXTURE_ENDING_ID }],
        },
      ],
    },
  },
  responses: { ...WORLD.responses, [DEAD_REFUSED_FAMILY]: DEAD_REFUSED_TEXT, [ENDED_REFUSED_FAMILY]: ENDED_REFUSED_TEXT },
};
const phaseGateVocab = compileVocabulary(PHASE_GATE_WORLD);

describe('PHASE_GATE_WORLD is itself a valid world', () => {
  it('satisfies validate.ts\'s death/ending-family rule', () => {
    expect(validate(PHASE_GATE_WORLD)).toEqual([]);
  });
});

describe('phase gate: no world turn survives death or an ending', () => {
  it('a movement/physical command after death changes nothing — no clock, no turn, no profile tally', () => {
    const store = new MemoryStore();
    const o = opts(store);
    let session = createSession(PHASE_GATE_WORLD);
    session = takeTurn(PHASE_GATE_WORLD, session, phaseGateVocab, actionsOutcome([takeAction(TRAP, 'take trap')]), o).session;
    expect(session.state.phase).toBe('dead');
    const turnAtDeath = session.state.turn;
    const profileAtDeath = session.state.profile;

    const refused = takeTurn(PHASE_GATE_WORLD, session, phaseGateVocab, actionsOutcome([takeAction(HAT, 'take hat')]), o);
    expect(refused.session.state.turn).toBe(turnAtDeath); // no tick ran at all
    expect(refused.session.state.profile).toEqual(profileAtDeath); // nothing tallied
    expect(objectLocation(PHASE_GATE_WORLD, refused.session.state, HAT)).toBe(ROOM_A); // the take never actually ran
    expect(refused.class).toBeNull();
  });

  it('renders the authored dead.refused family, with no diag (a real family exists)', () => {
    const store = new MemoryStore();
    const o = opts(store);
    let session = createSession(PHASE_GATE_WORLD);
    session = takeTurn(PHASE_GATE_WORLD, session, phaseGateVocab, actionsOutcome([takeAction(TRAP, 'take trap')]), o).session;

    const refused = takeTurn(PHASE_GATE_WORLD, session, phaseGateVocab, actionsOutcome([takeAction(HAT, 'take hat')]), o);
    expect(refused.events).toEqual([{ type: 'line', kind: 'system', text: DEAD_REFUSED_TEXT }]);
  });

  it('an ending gates the same way: no tick, and the ended.refused family renders', () => {
    const store = new MemoryStore();
    const o = opts(store);
    let session = createSession(PHASE_GATE_WORLD);
    session = takeTurn(PHASE_GATE_WORLD, session, phaseGateVocab, actionsOutcome([{ verb: BUILTIN_VERB_IDS.turnOff, dobj: BEACON, raw: 'turn off beacon' }]), o).session;
    expect(session.state.phase).toBe('ended');
    const turnAtEnd = session.state.turn;

    const refused = takeTurn(PHASE_GATE_WORLD, session, phaseGateVocab, actionsOutcome([takeAction(HAT, 'take hat')]), o);
    expect(refused.session.state.turn).toBe(turnAtEnd);
    expect(refused.events).toEqual([{ type: 'line', kind: 'system', text: ENDED_REFUSED_TEXT }]);
  });

  it('falls back to a diag (no line) when no refusal family is authored', () => {
    const worldWithNoFamily: WorldDef = { ...PHASE_GATE_WORLD, responses: { ...WORLD.responses } };
    const store = new MemoryStore();
    const o = opts(store);
    let session = createSession(worldWithNoFamily);
    session = takeTurn(worldWithNoFamily, session, phaseGateVocab, actionsOutcome([takeAction(TRAP, 'take trap')]), o).session;

    const refused = takeTurn(worldWithNoFamily, session, phaseGateVocab, actionsOutcome([takeAction(HAT, 'take hat')]), o);
    expect(refused.events).toEqual([
      { type: 'diag', code: 'phaseRefused', detail: expect.stringContaining('phase "dead" refused') },
    ]);
  });

  it('a meta verb still works after death (only non-meta actions are gated)', () => {
    const store = new MemoryStore();
    const o = opts(store);
    let session = createSession(PHASE_GATE_WORLD);
    session = takeTurn(PHASE_GATE_WORLD, session, phaseGateVocab, actionsOutcome([takeAction(TRAP, 'take trap')]), o).session;
    const turnAtDeath = session.state.turn;

    const waved = takeTurn(PHASE_GATE_WORLD, session, phaseGateVocab, actionsOutcome([{ verb: WAVE, raw: 'wave' }]), o);
    expect(waved.session.state.turn).toBe(turnAtDeath); // WAVE is meta:true — still costs nothing
    expect(waved.events.some((e) => e.type === 'line')).toBe(true); // and still renders its own default family
  });
});

describe('death menu flow', () => {
  it('offers UNDO and RESTART, but not RESTART ENCOUNTER, with no checkpoint yet', () => {
    const store = new MemoryStore();
    const o = opts(store);
    let session = createSession(PHASE_GATE_WORLD);
    const result = takeTurn(PHASE_GATE_WORLD, session, phaseGateVocab, actionsOutcome([takeAction(TRAP, 'take trap')]), o);
    session = result.session;

    expect(session.state.phase).toBe('dead');
    expect(result.events.some((e) => e.type === 'died' && e.deathId === FIXTURE_DEATH_ID)).toBe(true);
    expect(deathOptions(session, store)).toEqual(['undo', 'restart']);
  });

  it('offers all three once a checkpoint has fired', () => {
    const store = new MemoryStore();
    const o = opts(store);
    let session = createSession(PHASE_GATE_WORLD);
    session = takeTurn(PHASE_GATE_WORLD, session, phaseGateVocab, actionsOutcome([takeAction(SIGIL, 'take sigil')]), o).session;
    session = takeTurn(PHASE_GATE_WORLD, session, phaseGateVocab, actionsOutcome([takeAction(TRAP, 'take trap')]), o).session;

    expect(session.state.phase).toBe('dead');
    expect(deathOptions(session, store)).toEqual(['undo', 'restartEncounter', 'restart']);
  });

  it('UNDO from death is cheap: it revives the player at the pre-death state', () => {
    const store = new MemoryStore();
    const o = opts(store);
    let session = createSession(PHASE_GATE_WORLD);
    session = takeTurn(PHASE_GATE_WORLD, session, phaseGateVocab, actionsOutcome([takeAction(TRAP, 'take trap')]), o).session;
    expect(session.state.phase).toBe('dead');

    const revived = undo(session, store);
    expect(revived.state.phase).toBe('playing');
    expect(objectLocation(PHASE_GATE_WORLD, revived.state, TRAP)).toBe(ROOM_A); // never taken
  });

  it('RESTART ENCOUNTER still works after death: reloads the pre-death checkpoint', () => {
    const store = new MemoryStore();
    const o = opts(store);
    let session = createSession(PHASE_GATE_WORLD);
    session = takeTurn(PHASE_GATE_WORLD, session, phaseGateVocab, actionsOutcome([takeAction(SIGIL, 'take sigil')]), o).session;
    session = takeTurn(PHASE_GATE_WORLD, session, phaseGateVocab, actionsOutcome([takeAction(TRAP, 'take trap')]), o).session;
    expect(session.state.phase).toBe('dead');

    const restored = restartEncounter(store);
    expect(restored).toBeDefined();
    expect(restored!.state.phase).toBe('playing');
    expect(objectLocation(PHASE_GATE_WORLD, restored!.state, SIGIL)).toBe('inventory');
    expect(objectLocation(PHASE_GATE_WORLD, restored!.state, TRAP)).toBe(ROOM_A); // never taken
  });
});

// ---------------------------------------------------------------------------
// ALL/AND turn consumption (task 18's owed decision — see turn.ts's header)
// ---------------------------------------------------------------------------

describe('ALL/AND turn consumption: one command, one turn, one tally', () => {
  it('a multi-action command consumes exactly one turn and tallies exactly one profile entry (the last sub-action wins)', () => {
    const store = new MemoryStore();
    const o = opts(store);
    const session = createSession(WORLD);
    const outcome: InterpretOutcome = actionsOutcome([
      { verb: BUILTIN_VERB_IDS.take, dobj: HAT, raw: 'take hat and read letter' }, // class 'direct'
      { verb: BUILTIN_VERB_IDS.read, dobj: LETTER, raw: 'take hat and read letter' }, // class 'analytical'
    ]);

    const result = takeTurn(WORLD, session, vocab, outcome, o);

    expect(result.session.state.turn).toBe(1); // one typed command, one turn — not two
    expect(result.class).toBe('analytical'); // the last resolved sub-action's class
    expect(result.session.state.profile).toEqual({ analytical: 1, social: 0, direct: 0 }); // HAT's take isn't separately tallied
    expect(objectLocation(WORLD, result.session.state, HAT)).toBe('inventory'); // but it still genuinely happened
  });
});

// ---------------------------------------------------------------------------
// The durability contract (§5.2): content growth needs no migration
// ---------------------------------------------------------------------------

describe('durability contract: a save taken today plays correctly once content grows', () => {
  const NEW_ROOM = R('fixture_room_grown');
  const NEW_OBJECT = O('fixture_object_grown');
  const NEW_FLAG = F('fixture_flag_grown');

  const EXTENDED_WORLD: WorldDef = {
    ...WORLD,
    rooms: { ...WORLD.rooms, [NEW_ROOM]: { name: 'Grown Room', aliases: ['grown room'], exits: [{ to: ROOM_A }] } },
    objects: {
      ...WORLD.objects,
      [NEW_OBJECT]: { location: ROOM_A, name: 'shiny widget', nouns: ['widget'], adjectives: ['shiny'], portable: true },
    },
    flags: { ...WORLD.flags, [NEW_FLAG]: { default: true, doc: 'did not exist when the save was taken' } },
  };

  it('is itself a valid world', () => {
    expect(validate(EXTENDED_WORLD)).toEqual([]);
  });

  it('an old save reads new flags at their authored default and new objects at their authored location, and plays on with zero migration', () => {
    const store = new MemoryStore();
    const o = opts(store);
    let session = createSession(WORLD);
    session = takeTurn(WORLD, session, vocab, actionsOutcome([takeAction(KEY, 'take key')]), o).session;
    save(session, { ...o, slot: 'pre-growth' });

    // Loaded with no knowledge of EXTENDED_WORLD at all — this is the whole point.
    const loaded = load(store, 'pre-growth')!;

    expect(flag(EXTENDED_WORLD, loaded.state, NEW_FLAG)).toBe(true); // reads the content default; no overlay exists
    expect(objectLocation(EXTENDED_WORLD, loaded.state, NEW_OBJECT)).toBe(ROOM_A); // authored default location
    // ROOM_A is baseline-dark in the fixture (unrelated to this task); light
    // it the same way `tests/world.test.ts` does, to prove *scope* — not
    // just the location resolver — sees the new content too.
    const lit = { ...loaded.state, objects: { ...loaded.state.objects, [LAMP]: { location: 'inventory' as const, on: true } } };
    expect(scope(EXTENDED_WORLD, lit)).toContain(NEW_OBJECT); // genuinely visible/reachable, not just resolvable

    // Not just readable — playable: a real turn against the new content, off the old save, with no migration step.
    const extendedVocab = compileVocabulary(EXTENDED_WORLD);
    const result = takeTurn(
      EXTENDED_WORLD,
      loaded,
      extendedVocab,
      actionsOutcome([takeAction(NEW_OBJECT, 'take widget')]),
      o,
    );
    expect(objectLocation(EXTENDED_WORLD, result.session.state, NEW_OBJECT)).toBe('inventory');
    expect(result.session.state.turn).toBe(loaded.state.turn + 1);
  });
});

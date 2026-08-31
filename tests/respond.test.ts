// tests/respond.test.ts — spec §3.6, §8 task 12.
//
// Scope: `src/engine/respond.ts`'s five-rung ladder (one test per rung),
// the rung-3 seen-vs-unseen spoiler boundary, `diag` codes, and the
// rotation-path fix in `actions.ts` (successive refusals across different
// objects must walk the family's variants, per-family counters
// independent). Reuses `tests/fixtures/world.ts`'s `FIXTURE_WORLD` for
// objects/rooms/handlers, merging in the real approved prose
// (`src/content/responses.ts`) so these tests exercise genuine
// wiring, not placeholder text.

import { describe, expect, it } from 'vitest';
import { N, V } from '../src/engine/ids';
import type { GameState, WorldDef } from '../src/engine/world';
import { scope } from '../src/engine/world';
import { BUILTIN_VERB_IDS, performAction } from '../src/engine/actions';
import { EXAMINE_VERB_ID, INVENTORY_VERB_ID, respond } from '../src/engine/respond';
import { NPC_VERB_IDS } from '../src/engine/npc';
import { DeterministicParser } from '../src/engine/interpreter';
import type { InterpretOutcome, ScopeView } from '../src/engine/interpreter';
import { compileVocabulary } from '../src/engine/parser/vocabulary';
import { RESPONSES, VERB_DEFAULTS } from '../src/content/responses';
import { BOX, CHEST, FIXTURE_WORLD, FLAG_BOOL, HAT, JACK, KEY, LAMP, ROOM_A, ROOM_B, SHELF } from './fixtures/world';
import type { ObjectId } from '../src/engine/ids';

/** A non-built-in verb with a *real* approved default family (rung 2's `{name}`-templated branch), distinct from every fixture verb's words so it can't collide with `LOOK`'s "examine" synonym. */
const EXAMINE = V('fixture_examine_real');

const WORLD: WorldDef = {
  ...FIXTURE_WORLD,
  // 'inventory.empty'/'inventory.carrying' are real approved families
  // (responses.ts, response-families doc §8) — reused here (not
  // duplicated as fixture placeholders) so these tests exercise the real
  // wiring, matching this file's own stated convention (see header).
  responses: { ...FIXTURE_WORLD.responses, ...RESPONSES },
  verbs: {
    ...FIXTURE_WORLD.verbs,
    // Real bare-verb prompt (§5), overriding the fixture's placeholder — TAKE's
    // built-in semantics claim every resolved-`dobj` case, so this `default`
    // is only ever reached bare (§0 note 5), safely `{name}`-free.
    [BUILTIN_VERB_IDS.take]: { ...FIXTURE_WORLD.verbs![BUILTIN_VERB_IDS.take]!, default: VERB_DEFAULTS['take'] },
    [EXAMINE]: { id: EXAMINE, words: ['snurf'], patterns: ['V dobj'], class: 'analytical', default: VERB_DEFAULTS['examine'] },
    // `default` is a `ProseRef` to the global family — see `INVENTORY_VERB_ID`'s own doc comment for why.
    [INVENTORY_VERB_ID]: { id: INVENTORY_VERB_ID, words: ['inventory', 'i'], patterns: ['V'], class: null, default: { ref: 'inventory.empty' } },
  },
};

const vocab = compileVocabulary(WORLD);

/** Minimal `ScopeView` for a plain `interpret()` call — no ALL/GO TO exercised here, so `portable`/`location`/`travel` just need to satisfy the type. */
function buildView(state: GameState): ScopeView {
  return {
    vocabulary: vocab,
    visible: scope(WORLD, state),
    parser: state.parser,
    portable: new Set<ObjectId>(),
    location: new Map(),
    travel: { current: state.location, passable: new Map() },
  };
}

function baseState(overrides: Partial<GameState> = {}): GameState {
  return {
    phase: 'playing',
    turn: 0,
    clock: { day: 1, minute: 600 },
    location: ROOM_A,
    objects: {},
    npcs: {},
    flags: {},
    counters: {},
    visited: { [ROOM_A]: 0 },
    memories: [],
    clues: [],
    questions: {},
    hintsUsed: {},
    profile: { analytical: 0, social: 0, direct: 0 },
    firedEvents: [],
    parser: {},
    ...overrides,
  };
}

function lineText(events: { type: string; text?: string }[]): string {
  const line = events.find((e) => e.type === 'line');
  if (line === undefined) throw new Error('no line event in result');
  return line.text!;
}

function diagCodes(events: { type: string; code?: string }[]): string[] {
  return events.filter((e) => e.type === 'diag').map((e) => e.code!);
}

describe('respond — rung 1: resolved + authored handler', () => {
  it('renders the handler and emits no diag', () => {
    const outcome: InterpretOutcome = { kind: 'actions', actions: [{ verb: BUILTIN_VERB_IDS.take, dobj: KEY, raw: 'take key' }] };
    const result = respond(WORLD, baseState(), vocab, outcome);
    expect(lineText(result.events)).toBe('You palm the brass key with practiced care.');
    expect(result.state.objects[KEY]?.location).toBe('inventory');
    expect(diagCodes(result.events)).toEqual([]);
  });
});

describe('respond — rung 2: resolved, no handler', () => {
  it('built-in semantics (a refusal) render with no diag', () => {
    const outcome: InterpretOutcome = { kind: 'actions', actions: [{ verb: BUILTIN_VERB_IDS.take, dobj: SHELF, raw: 'take shelf' }] };
    const result = respond(WORLD, baseState(), vocab, outcome);
    expect(lineText(result.events)).toBe(RESPONSES['take.notPortable'][0]!.replace(/\{name\}/g, 'wooden shelf'));
    expect(diagCodes(result.events)).toEqual([]);
  });

  it("no built-in semantics: the verb's own default family renders, {name}-templated, with a defaultResponse diag", () => {
    const outcome: InterpretOutcome = { kind: 'actions', actions: [{ verb: EXAMINE, dobj: HAT, raw: 'snurf hat' }] };
    const result = respond(WORLD, baseState(), vocab, outcome);
    expect(lineText(result.events)).toBe(VERB_DEFAULTS['examine'][0]!.replace(/\{name\}/g, 'wool hat'));
    expect(diagCodes(result.events)).toEqual(['defaultResponse']);
  });

  it('an NPC target with neither a handler nor (for this verb) a description renders the default family too', () => {
    const outcome: InterpretOutcome = { kind: 'actions', actions: [{ verb: EXAMINE, dobj: JACK, raw: 'snurf jack' }] };
    const result = respond(WORLD, baseState(), vocab, outcome);
    expect(lineText(result.events)).toBe(VERB_DEFAULTS['examine'][0]!.replace(/\{name\}/g, 'jack'));
    expect(diagCodes(result.events)).toEqual(['defaultResponse']);
  });
});

// ---------------------------------------------------------------------------
// Task-1 fix (Ryan's playtest bug report — `X MARLOW`): `NpcDefSlice.
// description` routed for the reserved `EXAMINE_VERB_ID`, `NpcDefSlice.
// handlers` for rung-1 parity with `ObjectDefSlice.handlers`, and the
// `{name}`/`{dobj}` display-name fix (`NpcDefSlice.name`/`npcDisplayName`)
// — "the night marlow" was `candidateName`'s vocab-derived adjective+noun
// guess standing in for a display name no NPC could actually author.
// `NAMED_NPC` deliberately has both a noun ("clerk") a vocab-glued name
// would pick up and an adjective ("old") it would prepend — the exact shape
// of Marlow's own `nouns`/`adjectives` (`marlow`/`night`) that produced the
// bug report.
// ---------------------------------------------------------------------------

const NAMED_NPC = N('fixture_named_npc');
const GREET_VERB = V('fixture_greet_npc'); // a generic (non-EXAMINE) npc-targeted verb, for the handlers-parity tests

const WORLD_WITH_NAMED_NPC: WorldDef = {
  ...WORLD,
  npcs: {
    ...WORLD.npcs,
    [NAMED_NPC]: {
      nouns: ['clerk', 'man'],
      adjectives: ['old', 'narrow'],
      name: 'Corwin',
      description: 'Corwin, described up close.',
    },
  },
  verbs: {
    ...WORLD.verbs,
    [EXAMINE_VERB_ID]: { id: EXAMINE_VERB_ID, words: ['examine', 'x'], patterns: ['V dobj'], class: 'analytical', default: VERB_DEFAULTS['examine'] },
    [GREET_VERB]: { id: GREET_VERB, words: ['greet'], patterns: ['V dobj'], class: 'social', default: 'You gesture at {name}, to no effect.' },
  },
};
const vocabWithNamedNpc = compileVocabulary(WORLD_WITH_NAMED_NPC);

describe('respond — NPC target: description (EXAMINE), handlers (rung 1), and the display-name fix', () => {
  it('EXAMINE on an NPC with an authored description renders it, with no defaultResponse diag', () => {
    const outcome: InterpretOutcome = { kind: 'actions', actions: [{ verb: EXAMINE_VERB_ID, dobj: NAMED_NPC, raw: 'examine clerk' }] };
    const result = respond(WORLD_WITH_NAMED_NPC, baseState(), vocabWithNamedNpc, outcome);
    expect(lineText(result.events)).toBe('Corwin, described up close.');
    expect(diagCodes(result.events)).toEqual([]);
  });

  it('EXAMINE on an NPC with no description still falls to the generic {name}-templated default (regression)', () => {
    const outcome: InterpretOutcome = { kind: 'actions', actions: [{ verb: EXAMINE_VERB_ID, dobj: JACK, raw: 'examine jack' }] };
    const result = respond(WORLD_WITH_NAMED_NPC, baseState(), vocabWithNamedNpc, outcome);
    expect(lineText(result.events)).toBe(VERB_DEFAULTS['examine'][0]!.replace(/\{name\}/g, 'jack'));
    expect(diagCodes(result.events)).toEqual(['defaultResponse']);
  });

  it('a matched handler wins outright over an authored description (rung 1 before rung 2)', () => {
    const worldWithExamineHandler: WorldDef = {
      ...WORLD_WITH_NAMED_NPC,
      npcs: {
        ...WORLD_WITH_NAMED_NPC.npcs,
        [NAMED_NPC]: {
          ...WORLD_WITH_NAMED_NPC.npcs![NAMED_NPC]!,
          handlers: [{ verbs: [EXAMINE_VERB_ID], effects: [{ say: 'A handler, overriding the description entirely.' }] }],
        },
      },
    };
    const outcome: InterpretOutcome = { kind: 'actions', actions: [{ verb: EXAMINE_VERB_ID, dobj: NAMED_NPC, raw: 'examine clerk' }] };
    const result = respond(worldWithExamineHandler, baseState(), vocabWithNamedNpc, outcome);
    expect(lineText(result.events)).toBe('A handler, overriding the description entirely.');
    expect(diagCodes(result.events)).toEqual([]);
  });

  it('a generic npc-targeted verb handler runs at all (parity with ObjectDefSlice.handlers — ATTACK/FOLLOW-shaped)', () => {
    const worldWithGreetHandler: WorldDef = {
      ...WORLD_WITH_NAMED_NPC,
      npcs: {
        ...WORLD_WITH_NAMED_NPC.npcs,
        [NAMED_NPC]: { ...WORLD_WITH_NAMED_NPC.npcs![NAMED_NPC]!, handlers: [{ verbs: [GREET_VERB], effects: [{ say: '{name} handles it personally.' }] }] },
      },
    };
    const outcome: InterpretOutcome = { kind: 'actions', actions: [{ verb: GREET_VERB, dobj: NAMED_NPC, raw: 'greet clerk' }] };
    const result = respond(worldWithGreetHandler, baseState(), vocabWithNamedNpc, outcome);
    expect(lineText(result.events)).toBe('Corwin handles it personally.');
    expect(diagCodes(result.events)).toEqual([]);
  });

  it('an npc handler gated by "when" is skipped until its condition holds, falling to the ordinary default meanwhile', () => {
    const worldWithGatedHandler: WorldDef = {
      ...WORLD_WITH_NAMED_NPC,
      npcs: {
        ...WORLD_WITH_NAMED_NPC.npcs,
        [NAMED_NPC]: { ...WORLD_WITH_NAMED_NPC.npcs![NAMED_NPC]!, handlers: [{ verbs: [GREET_VERB], when: { flag: FLAG_BOOL }, effects: [{ say: 'Gated greeting.' }] }] },
      },
    };
    const outcome: InterpretOutcome = { kind: 'actions', actions: [{ verb: GREET_VERB, dobj: NAMED_NPC, raw: 'greet clerk' }] };
    const before = respond(worldWithGatedHandler, baseState(), vocabWithNamedNpc, outcome);
    expect(lineText(before.events)).toBe('You gesture at Corwin, to no effect.');
    expect(diagCodes(before.events)).toEqual(['defaultResponse']);
    const after = respond(worldWithGatedHandler, baseState({ flags: { [FLAG_BOOL]: true } }), vocabWithNamedNpc, outcome);
    expect(lineText(after.events)).toBe('Gated greeting.');
    expect(diagCodes(after.events)).toEqual([]);
  });

  it('the default family\'s {name} comes from the authored "name" field, not the vocab-glued adjective+noun ("the night marlow" bug)', () => {
    // This NPC's own nouns/adjectives (['clerk','man']/['old','narrow']) would
    // glue to something like "old clerk" via the old candidateName-only path;
    // the authored "name" now wins.
    const outcome: InterpretOutcome = { kind: 'actions', actions: [{ verb: EXAMINE, dobj: NAMED_NPC, raw: 'snurf clerk' }] };
    const result = respond(WORLD_WITH_NAMED_NPC, baseState(), vocabWithNamedNpc, outcome);
    // v0.8.0: a capitalized proper name also drops the article in front of its placeholder (`ProseContext.proper`).
    expect(lineText(result.events)).toBe(VERB_DEFAULTS['examine'][0]!.replace(/\b(?:[Tt]he|[Aa]n?) \{name\}/g, 'Corwin').replace(/\{name\}/g, 'Corwin'));
    expect(lineText(result.events)).not.toContain('old clerk');
  });

  it('SHOW\'s own default also uses the authored "name" for {iobj}, not the vocab-glued guess', () => {
    const worldWithShow: WorldDef = {
      ...WORLD_WITH_NAMED_NPC,
      verbs: {
        ...WORLD_WITH_NAMED_NPC.verbs,
        [NPC_VERB_IDS.show]: {
          id: NPC_VERB_IDS.show,
          words: ['show'],
          patterns: ['V dobj prep iobj'],
          preps: ['to'],
          class: 'social',
          default: 'Showing the {name} to {iobj} accomplishes nothing.',
        },
      },
    };
    const outcome: InterpretOutcome = { kind: 'actions', actions: [{ verb: NPC_VERB_IDS.show, dobj: KEY, prep: 'to', iobj: NAMED_NPC, raw: 'show key to clerk' }] };
    const result = respond(worldWithShow, baseState(), vocabWithNamedNpc, outcome);
    expect(lineText(result.events)).toBe('Showing the brass key to Corwin accomplishes nothing.');
    expect(diagCodes(result.events)).toEqual(['defaultResponse']);
  });

  it('an NPC without an authored "name" keeps the prior vocab-derived fallback unchanged', () => {
    const outcome: InterpretOutcome = { kind: 'actions', actions: [{ verb: EXAMINE, dobj: JACK, raw: 'snurf jack' }] };
    const result = respond(WORLD_WITH_NAMED_NPC, baseState(), vocabWithNamedNpc, outcome);
    expect(lineText(result.events)).toBe(VERB_DEFAULTS['examine'][0]!.replace(/\{name\}/g, 'jack'));
  });
});

describe('respond — rung 3: verb known, noun matches nothing in scope', () => {
  it('nounMiss.seen when the player has seen the named thing elsewhere (its room is visited)', () => {
    // LAMP's authored default location is ROOM_A; the player is currently in
    // ROOM_B but has visited ROOM_A already.
    const state = baseState({ location: ROOM_B, visited: { [ROOM_A]: 0, [ROOM_B]: 1 } });
    const outcome: InterpretOutcome = { kind: 'miss', raw: 'take lamp', verb: BUILTIN_VERB_IDS.take, knownNouns: ['lamp'], reason: 'nounUnresolved' };
    const result = respond(WORLD, state, vocab, outcome);
    expect(lineText(result.events)).toBe(RESPONSES['nounMiss.seen'][0]!.replace(/\{name\}/g, 'floor lamp'));
    expect(diagCodes(result.events)).toEqual(['nounMiss']);
  });

  it('nounMiss.unseen (no spoiler) when the named thing has never been seen — its room is unvisited', () => {
    const state = baseState({ location: ROOM_B, visited: { [ROOM_B]: 0 } }); // ROOM_A (LAMP's room) never visited
    const outcome: InterpretOutcome = { kind: 'miss', raw: 'take lamp', verb: BUILTIN_VERB_IDS.take, knownNouns: ['lamp'], reason: 'nounUnresolved' };
    const result = respond(WORLD, state, vocab, outcome);
    expect(lineText(result.events)).toBe(RESPONSES['nounMiss.unseen'][0]);
    expect(lineText(result.events)).not.toContain('lamp'); // the unseen family never names anything
    expect(diagCodes(result.events)).toEqual(['nounMiss']);
  });

  it('nounMiss.unseen for a genuinely unknown word too (never confirms or denies existence)', () => {
    const state = baseState();
    const outcome: InterpretOutcome = { kind: 'miss', raw: 'take xyzzy', verb: BUILTIN_VERB_IDS.take, knownNouns: [], reason: 'nounUnresolved' };
    const result = respond(WORLD, state, vocab, outcome);
    expect(lineText(result.events)).toBe(RESPONSES['nounMiss.unseen'][0]);
    expect(diagCodes(result.events)).toEqual(['nounMiss']);
  });
});

describe('respond — bare-verb miss (reason discriminator, coordinator fix-2)', () => {
  it('a bare built-in verb ("take" alone) renders its bare-verb prompt, not a noun miss', () => {
    const outcome: InterpretOutcome = { kind: 'miss', raw: 'take', verb: BUILTIN_VERB_IDS.take, knownNouns: [], reason: 'noPattern' };
    const result = respond(WORLD, baseState(), vocab, outcome);
    expect(lineText(result.events)).toBe(VERB_DEFAULTS['take'][0]);
    expect(diagCodes(result.events)).toEqual(['defaultResponse']); // rung 2, never 'nounMiss'
  });

  it('a bare non-built-in verb renders the bareVerb family, {verb}-templated on its own canonical word (§8 gap 5) — never its {name}-templated default, and never nounMiss', () => {
    const outcome: InterpretOutcome = { kind: 'miss', raw: 'snurf', verb: EXAMINE, knownNouns: [], reason: 'noPattern' };
    const result = respond(WORLD, baseState(), vocab, outcome);
    expect(lineText(result.events)).toBe(RESPONSES['bareVerb'][0]!.replace(/\{verb\}/g, 'snurf'));
    expect(lineText(result.events)).not.toContain('{name}');
    expect(lineText(result.events)).not.toContain('{verb}');
    expect(diagCodes(result.events)).toEqual(['defaultResponse']); // rung 2's bare-safe family, same code as the built-in bare case above
  });

  it('the bareVerb family echoes the surface form the player typed (verbWord) over the canonical word (Stage F)', () => {
    const outcome: InterpretOutcome = { kind: 'miss', raw: 'perambulate', verb: EXAMINE, knownNouns: [], reason: 'noPattern', verbWord: 'perambulate' };
    const result = respond(WORLD, baseState(), vocab, outcome);
    expect(lineText(result.events)).toBe(RESPONSES['bareVerb'][0]!.replace(/\{verb\}/g, 'perambulate'));
  });

  it("interpreter.ts itself sets reason: 'noPattern' for a genuinely bare known verb", () => {
    const state = baseState();
    const outcome = new DeterministicParser().interpret('take', buildView(state));
    expect(outcome).toMatchObject({ kind: 'miss', verb: BUILTIN_VERB_IDS.take, reason: 'noPattern' });
  });

  it("interpreter.ts itself sets reason: 'nounUnresolved' for a real, failed noun phrase", () => {
    const state = baseState();
    const outcome = new DeterministicParser().interpret('take xyzzy', buildView(state));
    expect(outcome).toMatchObject({ kind: 'miss', verb: BUILTIN_VERB_IDS.take, reason: 'nounUnresolved' });
  });

  it('end to end: a bare TAKE through the real parser never produces a noun-miss diag', () => {
    const state = baseState();
    const outcome = new DeterministicParser().interpret('take', buildView(state));
    const result = respond(WORLD, state, vocab, outcome);
    expect(diagCodes(result.events)).not.toContain('nounMiss');
    expect(diagCodes(result.events)).toEqual(['defaultResponse']);
    expect(lineText(result.events)).toBe(VERB_DEFAULTS['take'][0]);
  });
});

describe('respond — rung 4: verb unknown, a noun resolves', () => {
  it('unknownVerbKnownNoun, {name}-templated, with a parserMiss diag', () => {
    const outcome: InterpretOutcome = { kind: 'miss', raw: 'zorp lamp', knownNouns: ['lamp'] };
    const result = respond(WORLD, baseState(), vocab, outcome);
    expect(lineText(result.events)).toBe(RESPONSES['unknownVerbKnownNoun'][0]!.replace(/\{name\}/g, 'floor lamp'));
    expect(diagCodes(result.events)).toEqual(['parserMiss']);
  });
});

describe('respond — rung 5: nothing recognized', () => {
  it('the unknown family renders, exact approved text, with a parserMiss diag', () => {
    const outcome: InterpretOutcome = { kind: 'miss', raw: 'zorp fleeb', knownNouns: [] };
    const result = respond(WORLD, baseState(), vocab, outcome);
    expect(lineText(result.events)).toBe(
      'The intention is there. The shape of it is not. Try again with a verb, and something to aim it at.',
    );
    expect(diagCodes(result.events)).toEqual(['parserMiss']);
  });
});

describe('respond — the other InterpretOutcome kinds pass through', () => {
  it('clarify becomes a clarify event with no state change', () => {
    const state = baseState();
    const outcome: InterpretOutcome = { kind: 'clarify', question: 'Which do you mean?', options: ['a', 'b'], pending: undefined };
    const result = respond(WORLD, state, vocab, outcome);
    expect(result.events).toEqual([{ type: 'clarify', question: 'Which do you mean?', options: ['a', 'b'] }]);
    expect(result.state).toBe(state);
  });

  it('unreachable renders its fixed message as a system line', () => {
    const outcome: InterpretOutcome = { kind: 'unreachable', raw: 'go to nowhere', message: "You don't know the way there yet." };
    const result = respond(WORLD, baseState(), vocab, outcome);
    expect(result.events).toEqual([{ type: 'line', kind: 'system', text: "You don't know the way there yet." }]);
  });

  it('allEmpty renders the verb-specific empty-expansion family', () => {
    const outcome: InterpretOutcome = { kind: 'allEmpty', verb: BUILTIN_VERB_IDS.take, raw: 'take all' };
    const result = respond(WORLD, baseState(), vocab, outcome);
    expect(lineText(result.events)).toBe(RESPONSES['take.allEmpty'][0]);
  });
});

describe('rotation: global families key on the family, not the object (actions.ts, §8 task 12)', () => {
  it('refusing TAKE on three different immovable objects walks the family variants', () => {
    let state = baseState();
    const seen: string[] = [];
    const names = { [SHELF]: 'wooden shelf', [BOX]: 'wooden box', [CHEST]: 'iron chest' } as Record<string, string>;
    for (const dobj of [SHELF, BOX, CHEST]) {
      const result = performAction(WORLD, state, { verb: BUILTIN_VERB_IDS.take, dobj });
      state = result.state;
      seen.push(lineText(result.events));
    }
    // Exactly variants 1, 2, 3 in order, each templated for its own object —
    // proof the counter walked the family (not stuck replaying variant 1).
    expect(seen).toEqual(RESPONSES['take.notPortable'].map((v, i) => v.replace(/\{name\}/g, names[[SHELF, BOX, CHEST][i]!]!)));
    expect(new Set(seen).size).toBe(3); // never repeats a variant
  });

  it('per-family counters advance independently', () => {
    let state = baseState({ objects: { [HAT]: { location: 'inventory' } } });

    // take.alreadyHeld variant 1
    let result = performAction(WORLD, state, { verb: BUILTIN_VERB_IDS.take, dobj: HAT });
    state = result.state;
    expect(lineText(result.events)).toBe(RESPONSES['take.alreadyHeld'][0]!.replace(/\{name\}/g, 'wool hat'));

    // take.notPortable variant 1 — unaffected by the alreadyHeld call above
    result = performAction(WORLD, state, { verb: BUILTIN_VERB_IDS.take, dobj: SHELF });
    state = result.state;
    expect(lineText(result.events)).toBe(RESPONSES['take.notPortable'][0]!.replace(/\{name\}/g, 'wooden shelf'));

    // take.alreadyHeld variant 2 — its own counter, still just at 1
    result = performAction(WORLD, state, { verb: BUILTIN_VERB_IDS.take, dobj: HAT });
    state = result.state;
    expect(lineText(result.events)).toBe(RESPONSES['take.alreadyHeld'][1]!.replace(/\{name\}/g, 'wool hat'));
  });
});

// ---------------------------------------------------------------------------
// INVENTORY (§8 gap 2): dispatched before `performAction`, like LOOK/GO TO —
// dynamic, unlike task 22a's static stopgap, and unaffected by darkness
// (see `inventoryView`'s own doc comment: what you carry needs no light).
// ---------------------------------------------------------------------------

describe('respond — INVENTORY (gap 2)', () => {
  it('lists carried and worn items behind a header line, worn ones marked, and emits no diag', () => {
    const state = baseState({ objects: { [KEY]: { location: 'inventory' }, [HAT]: { location: 'worn' } } });
    const outcome: InterpretOutcome = { kind: 'actions', actions: [{ verb: INVENTORY_VERB_ID, raw: 'inventory' }] };
    const result = respond(WORLD, state, vocab, outcome);
    const lines = result.events.filter((e) => e.type === 'line').map((e) => (e as { text: string }).text);
    expect(lines[0]).toBe(RESPONSES['inventory.carrying'][0]);
    expect(lines).toContain('brass key');
    expect(lines.some((l) => l.includes('wool hat') && l.includes('worn'))).toBe(true);
    expect(diagCodes(result.events)).toEqual([]);
  });

  it('renders the authored inventory.empty family when nothing is carried or worn', () => {
    const outcome: InterpretOutcome = { kind: 'actions', actions: [{ verb: INVENTORY_VERB_ID, raw: 'inventory' }] };
    const result = respond(WORLD, baseState(), vocab, outcome);
    expect(lineText(result.events)).toBe(RESPONSES['inventory.empty'][0]);
    expect(diagCodes(result.events)).toEqual([]);
  });

  it('a room can override the empty-inventory line via its own handlers (design doc §8.9/§14.4) — takes precedence over the global family', () => {
    const worldWithOverride: WorldDef = {
      ...WORLD,
      rooms: {
        ...WORLD.rooms,
        [ROOM_A]: { ...WORLD.rooms![ROOM_A]!, handlers: [{ verbs: [INVENTORY_VERB_ID], effects: [{ say: 'fixture: your room-scoped empty-hands clue.' }] }] },
      },
    };
    const result = respond(worldWithOverride, baseState({ location: ROOM_A }), vocab, {
      kind: 'actions',
      actions: [{ verb: INVENTORY_VERB_ID, raw: 'inventory' }],
    });
    expect(lineText(result.events)).toBe('fixture: your room-scoped empty-hands clue.');
    expect(diagCodes(result.events)).toEqual([]); // rung 1 (a room handler match), not the global default
  });

  it('works in a dark room — carrying something needs no light', () => {
    // ROOM_A is baseline-dark in the fixture.
    const state = baseState({ location: ROOM_A, objects: { [KEY]: { location: 'inventory' } } });
    const outcome: InterpretOutcome = { kind: 'actions', actions: [{ verb: INVENTORY_VERB_ID, raw: 'inventory' }] };
    const result = respond(WORLD, state, vocab, outcome);
    expect(result.events.some((e) => e.type === 'line' && (e as { text: string }).text === 'brass key')).toBe(true);
  });

  it('end to end: the real parser resolves bare "inventory" and dispatches to it', () => {
    const state = baseState({ objects: { [KEY]: { location: 'inventory' } } });
    const outcome = new DeterministicParser().interpret('inventory', buildView(state));
    const result = respond(WORLD, state, vocab, outcome);
    expect(result.events.some((e) => e.type === 'line' && (e as { text: string }).text === 'brass key')).toBe(true);
  });
});

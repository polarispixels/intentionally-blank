// Tiny 3-room fixture world, shared by engine tests (spec §8 preamble).
// Story-free on purpose — it exists to exercise engine mechanics, not to
// carry content. Task 3 only needs `flags` off `WorldDef` (see
// src/engine/world.ts for why); later tasks add rooms/objects/npcs data as
// those content-schema types land.
//
// Task 5 (`effects.ts`) additions: `NOTEBOOK` (a `plotCritical` object, for
// the runtime move guard — §2.5's own example object, kept story-free
// here), `SCRIPT_1` (a registered `ScriptFn`, for script-dispatch tests),
// and minimal `objects`/`memories`/`clues`/`questions` entries so every
// grant/open/answer/setProp/move effect has real data to read.
//
// Task 6 (`world.ts`) additions: `meta.startRoom` (for `initialState`);
// `rooms` with one of each `dark` baseline (`true`, a `Cond`, and absent —
// ROOM_A/ROOM_C/ROOM_B respectively) for the `isDark` matrix; `LAMP` (a
// `lightSource`), `CHEST` (an opaque container) and `GLASS_CASE` (a
// transparent one) so tests can relocate them via a state overlay to cover
// "in the room / carried / inside a closed opaque container / inside a
// closed transparent container" without needing more fixture objects;
// `HIDDEN_COIN` for scope's hidden-object exclusion; `supporter: true` on
// `SHELF` (already used as a supporter target in `tests/cond.test.ts`); and
// a `schedule` on `GUIDE` for `npcRoom`'s schedule-fallback case.
//
// Task 8 (`actions.ts`) additions: `name` on every existing object (rung-2
// `{name}` templating); `portable: true` on `KEY`, `switchable: true` on
// `LAMP`, and `key: KEY` on `CHEST`'s container (so the existing objects
// double as built-in-verb test fixtures instead of multiplying near-
// duplicates); `HAT` (portable + wearable) and `LETTER` (portable, with
// both `text` and `description`, and a conditional TAKE handler gating on
// `FLAG_BOOL` — the handler-overrides-builtin and handler-`when`-unmet-
// falls-through-to-builtin cases) as the two genuinely new objects;
// `description` on `BOX` (no `text`) for READ's fallback case. `verbs`:
// every `BUILTIN_VERB_IDS` verb (non-meta, `default` authored) plus
// `SMELL` (a non-meta verb with no built-in semantics, for the rung-2b
// verb-default path) and `WAVE` (`meta: true`, exercising `consumesTurn`
// for a meta verb reaching rung 2b). `responses`: one authored family per
// built-in outcome (`take.success`, `take.notPortable`, …) — see
// `tests/actions.test.ts` for the full list this task's `validate` rule
// depends on staying non-null.

import { C, F, M, N, O, Q, R, S, V } from '../../src/engine/ids';
import { BUILTIN_VERB_IDS } from '../../src/engine/actions';
import type { GameEvent, ScriptFn, WorldDef } from '../../src/engine/world';

export const ROOM_A = R('fixture_room_a');
export const ROOM_B = R('fixture_room_b');
export const ROOM_C = R('fixture_room_c');

export const KEY = O('fixture_key');
export const BOX = O('fixture_box');
export const SHELF = O('fixture_shelf');
/** plotCritical: true — exercises the runtime move guard (spec §2.5). */
export const NOTEBOOK = O('fixture_notebook');
/** lightSource: true — exercises `isDark`'s light-source-in-scope check. */
export const LAMP = O('fixture_lamp');
/** An opaque container (closed and locked by default). */
export const CHEST = O('fixture_chest');
/** A transparent container (closed by default) — sight passes through even closed. */
export const GLASS_CASE = O('fixture_glass_case');
/** hidden: true — exercises `scope`'s hidden-object exclusion. */
export const HIDDEN_COIN = O('fixture_hidden_coin');
/** portable + wearable — WEAR/REMOVE success (task 8). */
export const HAT = O('fixture_hat');
/** portable, `text` distinct from `description` — READ's text-over-description case, plus a conditional TAKE handler gated on `FLAG_BOOL`. */
export const LETTER = O('fixture_letter');

export const GUIDE = N('fixture_guide');

/** Verb ids used across `tests/actions.test.ts` beyond `BUILTIN_VERB_IDS`. */
export const SMELL = V('fixture_smell'); // no built-in semantics: rung-2b verb-default path
export const WAVE = V('fixture_wave'); // meta: true — consumesTurn:false at rung 2b

/** Verb ids used across `tests/parser-grammar.test.ts` (task 9) beyond the above. */
export const BREAK = V('fixture_break'); // 'V dobj prep iobj', preps: ['with'] — the instrument case
export const THROW = V('fixture_throw'); // 'V dobj prep iobj', preps: ['at'] — "at" as a real preposition, not noise
export const LOOK = V('fixture_look'); // 'V'/'V dobj', no preps — "look at lamp": "at" must be dropped as noise
export const ASK = V('fixture_ask'); // 'V npc about topic' — the only pattern needing the literal "about" separator

export const MEMORY_1 = M('fixture_memory_1');
export const CLUE_1 = C('fixture_clue_1');
export const QUESTION_1 = Q('fixture_question_1');

export const FLAG_BOOL = F('fixture_flag_bool');
export const FLAG_NUM = F('fixture_flag_num');

export const SCRIPT_1 = S('fixture_script_1');

/**
 * A minimal, pure `ScriptFn` (spec §2.3): sets `FLAG_BOOL` and reports the
 * args it was called with, purely to prove `apply()`'s `script` effect
 * dispatches to it and threads its `{state, events}` back out.
 */
export const fixtureScript: ScriptFn = (_world, state, args) => {
  const events: GameEvent[] = [
    { type: 'line', kind: 'system', text: `fixture_script_1 ran with ${JSON.stringify(args ?? {})}` },
  ];
  return { state: { ...state, flags: { ...state.flags, [FLAG_BOOL]: true } }, events };
};

export const FIXTURE_WORLD: WorldDef = {
  meta: {
    // morning 06:00, afternoon 12:00, evening 18:00, night 22:00 — night
    // wraps past midnight and covers 22:00..05:59.
    phases: { morning: 360, afternoon: 720, evening: 1080, night: 1320 },
    weekLength: 7,
    startRoom: ROOM_A,
  },
  flags: {
    [FLAG_BOOL]: { default: false, doc: 'fixture boolean flag, defaults off' },
    [FLAG_NUM]: { default: 2, doc: 'fixture numeric flag, defaults to 2' },
  },
  // Task 9 (`parser/vocabulary.ts`) additions below: `name`/`aliases` on
  // every room, `nouns`/`adjectives` on every object and on `GUIDE` — the
  // vocabulary compiler's data source. Chosen so no noun/adjective word
  // collides with any fixture verb word (`checkVocabularyCollisions`
  // would flag it if one did).
  rooms: {
    [ROOM_A]: { name: 'Fixture Room A', aliases: ['room a'], dark: true }, // baseline dark
    [ROOM_B]: { name: 'Fixture Room B', aliases: ['room b'] }, // baseline lit (no `dark` entry)
    [ROOM_C]: { name: 'Fixture Room C', aliases: ['room c'], dark: { flag: FLAG_BOOL } }, // baseline dark only while FLAG_BOOL holds
  },
  objects: {
    [KEY]: {
      location: ROOM_A,
      name: 'brass key',
      nouns: ['key'],
      adjectives: ['brass'],
      portable: true,
      // Unconditional handler-overrides-builtin case (§8 task 8): TAKE KEY
      // always runs this instead of the take.* built-in, even though KEY
      // is portable and the built-in would otherwise apply.
      handlers: [
        {
          verbs: [BUILTIN_VERB_IDS.take],
          class: 'direct',
          effects: [{ say: 'You palm the brass key with practiced care.' }, { move: [KEY, 'inventory'] }],
        },
      ],
    },
    [BOX]: { location: ROOM_A, name: 'wooden box', nouns: ['box'], adjectives: ['wooden'], description: 'A plain wooden box.' },
    [SHELF]: { location: ROOM_A, name: 'wooden shelf', nouns: ['shelf'], adjectives: ['wooden'], supporter: true },
    [NOTEBOOK]: {
      location: ROOM_A,
      name: 'leather notebook',
      nouns: ['notebook'],
      adjectives: ['leather'],
      portable: true,
      plotCritical: true,
    },
    [LAMP]: {
      location: ROOM_A,
      name: 'floor lamp',
      nouns: ['lamp', 'light'],
      adjectives: ['floor'],
      lightSource: true,
      switchable: true,
    },
    [CHEST]: {
      location: ROOM_A,
      name: 'iron chest',
      nouns: ['chest'],
      adjectives: ['iron'],
      container: { open: false, locked: false, transparent: false, key: KEY },
    },
    [GLASS_CASE]: {
      location: ROOM_A,
      name: 'glass case',
      nouns: ['case'],
      adjectives: ['glass'],
      container: { open: false, transparent: true },
    },
    [HIDDEN_COIN]: { location: ROOM_A, name: 'hidden coin', nouns: ['coin'], adjectives: ['hidden'], hidden: true },
    [HAT]: { location: ROOM_A, name: 'wool hat', nouns: ['hat'], adjectives: ['wool'], portable: true, wearable: true },
    [LETTER]: {
      location: ROOM_A,
      name: 'folded letter',
      nouns: ['letter'],
      adjectives: ['folded'],
      portable: true,
      description: 'A folded letter, sealed shut.',
      text: 'Meet me at noon. -M',
      // Handler-overrides-builtin AND handler-when-unmet-falls-through-to-builtin,
      // both in one fixture object (§8 task 8): while FLAG_BOOL is unset, TAKE
      // LETTER falls through to the built-in (LETTER is portable); once
      // FLAG_BOOL is set, this handler wins outright over the built-in.
      handlers: [
        {
          verbs: [BUILTIN_VERB_IDS.take],
          when: { flag: FLAG_BOOL },
          class: 'analytical',
          effects: [{ say: 'A hidden compartment clicks — the letter was waiting for you to notice.' }, { move: [LETTER, 'inventory'] }],
        },
      ],
    },
  },
  npcs: {
    [GUIDE]: {
      nouns: ['guide'],
      schedule: [
        { when: { clockPhase: 'morning' }, room: ROOM_B },
        { when: { clockPhase: 'night' }, room: 'offstage' },
        { room: ROOM_C }, // unconditional fallback: afternoon/evening
      ],
    },
  },
  verbs: {
    [BUILTIN_VERB_IDS.take]: { id: BUILTIN_VERB_IDS.take, words: ['take', 'get'], patterns: ['V dobj'], class: 'direct', default: "You can't do that." },
    [BUILTIN_VERB_IDS.drop]: { id: BUILTIN_VERB_IDS.drop, words: ['drop'], patterns: ['V dobj'], class: 'direct', default: "You can't do that." },
    [BUILTIN_VERB_IDS.open]: { id: BUILTIN_VERB_IDS.open, words: ['open'], patterns: ['V dobj'], class: 'direct', default: "You can't do that." },
    [BUILTIN_VERB_IDS.close]: { id: BUILTIN_VERB_IDS.close, words: ['close'], patterns: ['V dobj'], class: 'direct', default: "You can't do that." },
    [BUILTIN_VERB_IDS.lock]: {
      id: BUILTIN_VERB_IDS.lock,
      words: ['lock'],
      patterns: ['V dobj', 'V dobj prep iobj'],
      preps: ['with'],
      class: 'direct',
      default: "You can't do that.",
    },
    [BUILTIN_VERB_IDS.unlock]: {
      id: BUILTIN_VERB_IDS.unlock,
      words: ['unlock'],
      patterns: ['V dobj', 'V dobj prep iobj'],
      preps: ['with'],
      class: 'direct',
      default: "You can't do that.",
    },
    [BUILTIN_VERB_IDS.putIn]: {
      id: BUILTIN_VERB_IDS.putIn,
      words: ['put'],
      patterns: ['V dobj prep iobj'],
      preps: ['in'],
      class: 'direct',
      default: "You can't do that.",
    },
    [BUILTIN_VERB_IDS.putOn]: {
      id: BUILTIN_VERB_IDS.putOn,
      words: ['put'],
      patterns: ['V dobj prep iobj'],
      preps: ['on'],
      class: 'direct',
      default: "You can't do that.",
    },
    [BUILTIN_VERB_IDS.wear]: { id: BUILTIN_VERB_IDS.wear, words: ['wear'], patterns: ['V dobj'], class: 'direct', default: "You can't do that." },
    [BUILTIN_VERB_IDS.remove]: { id: BUILTIN_VERB_IDS.remove, words: ['remove'], patterns: ['V dobj'], class: 'direct', default: "You can't do that." },
    [BUILTIN_VERB_IDS.read]: { id: BUILTIN_VERB_IDS.read, words: ['read'], patterns: ['V dobj'], class: 'analytical', default: "You can't do that." },
    [BUILTIN_VERB_IDS.turnOn]: {
      id: BUILTIN_VERB_IDS.turnOn,
      words: ['turn on'],
      patterns: ['V dobj'],
      class: 'direct',
      default: "You can't do that.",
    },
    [BUILTIN_VERB_IDS.turnOff]: {
      id: BUILTIN_VERB_IDS.turnOff,
      words: ['turn off'],
      patterns: ['V dobj'],
      class: 'direct',
      default: "You can't do that.",
    },
    // No built-in semantics: exercises rung 2b, the verb's own `default` family.
    [SMELL]: { id: SMELL, words: ['smell'], patterns: ['V dobj'], class: 'analytical', default: 'You smell nothing special about the {name}.' },
    // meta: true — exercises rung 2b's consumesTurn:false path.
    [WAVE]: { id: WAVE, words: ['wave'], patterns: ['V'], class: null, meta: true, default: 'You wave at nothing in particular.' },
    // Task 9 (`tests/parser-grammar.test.ts`) additions: verbs exercising
    // grammar shapes `actions.ts`'s built-ins don't need. `THROW` and
    // `BREAK` both declare `preps: ['at'|'with']` — the instrument/`V dobj
    // prep iobj` case (§3.7's "throw chair at window"/"break window with
    // chair" convergence; the synonym-table half of that convergence is
    // content's job, not this fixture's). `LOOK` has no `preps` at all —
    // the "look at lamp" case, where "at" must be dropped as noise rather
    // than sought as a preposition. `ASK` is the only `'V npc about
    // topic'` verb in the fixture.
    [BREAK]: {
      id: BREAK,
      words: ['break', 'smash'],
      patterns: ['V dobj', 'V dobj prep iobj'],
      preps: ['with'],
      class: 'direct',
      default: 'Nothing worth breaking there.',
    },
    [THROW]: {
      id: THROW,
      words: ['throw'],
      patterns: ['V dobj prep iobj'],
      preps: ['at'],
      class: 'direct',
      default: "You'd rather not throw that.",
    },
    [LOOK]: { id: LOOK, words: ['look', 'examine', 'x'], patterns: ['V', 'V dobj'], class: null, default: 'You see nothing special.' },
    [ASK]: { id: ASK, words: ['ask'], patterns: ['V npc about topic'], class: 'social', default: "They don't know anything about that." },
  },
  responses: {
    'take.success': 'You take the {name}.',
    'take.notPortable': "You can't take the {name}.",
    'take.alreadyHeld': "You're already carrying the {name}.",
    'take.containerClosed': "You can't reach the {name}; it's shut away.",
    'drop.success': 'You drop the {name}.',
    'drop.notHeld': "You aren't holding the {name}.",
    'open.success': 'You open the {name}.',
    'open.notContainer': "The {name} doesn't open.",
    'open.alreadyOpen': 'The {name} is already open.',
    'open.locked': 'The {name} is locked.',
    'close.success': 'You close the {name}.',
    'close.notContainer': "The {name} doesn't close.",
    'close.alreadyClosed': 'The {name} is already closed.',
    'lock.success': 'You lock the {name}.',
    'lock.notLockable': "The {name} doesn't lock.",
    'lock.mustCloseFirst': 'Close the {name} first.',
    'lock.alreadyLocked': 'The {name} is already locked.',
    'lock.wrongKey': "That doesn't fit the {name}.",
    'lock.noKey': "You don't have the key to the {name}.",
    'unlock.success': 'You unlock the {name}.',
    'unlock.notLockable': "The {name} doesn't lock.",
    'unlock.alreadyUnlocked': 'The {name} is already unlocked.',
    'unlock.wrongKey': "That doesn't fit the {name}.",
    'unlock.noKey': "You don't have the key to the {name}.",
    'putIn.success': 'You put the {name} in the {iobj}.',
    'putIn.notContainer': "The {iobj} isn't something you can put things in.",
    'putIn.closedContainer': 'The {iobj} is closed.',
    'putIn.loop': "That would trap the {iobj} inside itself.",
    'putOn.success': 'You put the {name} on the {iobj}.',
    'putOn.notSupporter': "You can't put things on the {iobj}.",
    'putOn.loop': "That would trap the {iobj} inside itself.",
    'wear.success': 'You put on the {name}.',
    'wear.notWearable': "You can't wear the {name}.",
    'wear.alreadyWorn': "You're already wearing the {name}.",
    'remove.success': 'You take off the {name}.',
    'remove.notWorn': "You aren't wearing the {name}.",
    'turnOn.success': 'The {name} comes on.',
    'turnOn.notSwitchable': "The {name} doesn't switch on.",
    'turnOn.alreadyOn': 'The {name} is already on.',
    'turnOff.success': 'The {name} goes off.',
    'turnOff.notSwitchable': "The {name} doesn't switch on.",
    'turnOff.alreadyOff': 'The {name} is already off.',
  },
  memories: {
    [MEMORY_1]: { lines: ['You remember the fixture.', 'It was, in fact, a fixture.'] },
  },
  clues: {
    [CLUE_1]: { title: 'fixture clue title' },
  },
  questions: {
    [QUESTION_1]: { text: 'Is this a fixture question?' },
  },
  scripts: {
    [SCRIPT_1]: fixtureScript,
  },
};

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
//
// Task 10 (`tests/parser-resolve.test.ts`) additions: `DOOR_KEY` and
// `SPARE_KEY`, two more objects sharing `KEY`'s bare noun `key`; `METAL_BOX`,
// a second `box` for simultaneous dobj+iobj ambiguity; `JACK`/`MARA`/`RIVER`,
// NPCs with a declared `pronoun` (§2.6/§3.4) for real gender-aware `him`/
// `her`/`them` resolution — see their own doc comments below for why.
//
// Task 11 (`tests/parser-multi.test.ts`) additions: `exits` on every room
// (§3.5's `GO TO` BFS graph) — ROOM_A <-> ROOM_B always passable, ROOM_B <->
// ROOM_C gated by `DOOR` (closed by default, so blocked until a test opens
// it via a state overlay) — exercising both the plain-edge and
// door-gated-edge cases `ExitDefSlice` supports. `DOOR` itself: a
// non-portable object whose `container.open` field `objectState` reads for
// the exit gate (doors reuse the same open/closed state model as
// containers; nothing about `ExitDefSlice.door` requires the object to
// actually BE a container). `AGAIN_VERB_ID` (imported from
// `interpreter.ts`, not redeclared here — task 11's own reserved id) and
// `WAIT`: two more `'V'`-pattern, non-meta verbs with authored `default`
// families, for AGAIN's fallback-with-nothing-to-repeat case and WAIT's
// ordinary-turn-pass case (§3.5).

// Task 13 (`tests/tick.test.ts`) additions: `FLAG_EVENT_TRIGGER`/
// `FLAG_EVENT_FIRED` and `FLAG_WITNESS_TRIGGER`/`FLAG_WITNESSED_FIRED` (two
// trigger/fired flag pairs, doc'd at their declarations below) and
// `world.events`: `fixture_event_once` (a plain once-only `EventDef`) and
// `fixture_event_witnessed` (`onlyIfWitnessed: true`, `witnessedWhen: {
// at: ROOM_B }`) — real data for `tick.ts`'s `EventDef` evaluation.

// Task 15 (`tests/knowledge.test.ts`) additions: `MEMORY_2` (an ambient
// `trigger` keyed on task 13's `FLAG_EVENT_FIRED`, deliberately reusing that
// flag rather than adding a new one, so a test can chain event → memory
// trigger → question recompute in one `tick()` call), `QUESTION_2` (ambient
// open/answer, both flag-gated) and `QUESTION_3` (ambient open by flag,
// ambient answer by `{ memory: MEMORY_2 }` — the memory-satisfies-a-
// question case). `FLAG_QUESTION_OPEN`/`FLAG_QUESTION_ANSWER` gate those.
// `CLUE_1` gains `questions: [QUESTION_1]` (§2.7's "which questions it
// bears on") for the referential-integrity rule this task adds to
// `validate.ts`. `MEMORY_1`/`QUESTION_1` stay untouched — the existing
// explicit-effect-only fixtures other tasks' tests already depend on.

import { C, F, M, N, O, Q, R, S, V } from '../../src/engine/ids';
import { BUILTIN_VERB_IDS } from '../../src/engine/actions';
import { AGAIN_VERB_ID } from '../../src/engine/interpreter';
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

/**
 * Task 10 (`tests/parser-resolve.test.ts`) additions: two more objects
 * sharing KEY's bare noun `key` so `take key` alone is genuinely ambiguous
 * among three, `take brass key` still resolves to `KEY` uniquely (§3.2's
 * "full adjective+noun match outranks a bare noun match"), and
 * `SPARE_KEY` — with no adjectives at all — proves that ranking excludes
 * bare-noun-only candidates from the pool once a full match exists,
 * without needing a shared adjective to set up the contrast.
 */
export const DOOR_KEY = O('fixture_door_key'); // nouns: ['key'], adjectives: ['door']
export const SPARE_KEY = O('fixture_spare_key'); // nouns: ['key'], no adjectives
/** A second "box" (nouns: ['box'], adjectives: ['metal']) — with BOX, exercises simultaneous dobj+iobj ambiguity ("put key in box": both slots have >1 candidate). */
export const METAL_BOX = O('fixture_metal_box');

/** Task 11 addition: gates the ROOM_B <-> ROOM_C exit (closed by default — that edge starts blocked). Not portable; not a real "container", just reusing `objectState`'s `container.open` field for door state. */
export const DOOR = O('fixture_door');

export const GUIDE = N('fixture_guide');
/**
 * Task 10 fix-2 additions (coordinator review): NPCs with a declared
 * `pronoun` (§2.6/§3.4), so `him`/`her`/`them` resolution can be tested
 * against real per-NPC gender data instead of `GUIDE`'s ungendered
 * fallback. `JACK`/`MARA` mirror the coordinator's own example
 * ("ask her about the notebook" must never resolve to Jack).
 */
export const JACK = N('fixture_jack'); // pronoun: 'he'
export const MARA = N('fixture_mara'); // pronoun: 'she'
export const RIVER = N('fixture_river'); // pronoun: 'they'

/** Verb ids used across `tests/actions.test.ts` beyond `BUILTIN_VERB_IDS`. */
export const SMELL = V('fixture_smell'); // no built-in semantics: rung-2b verb-default path
export const WAVE = V('fixture_wave'); // meta: true — consumesTurn:false at rung 2b

/** Verb ids used across `tests/parser-grammar.test.ts` (task 9) beyond the above. */
export const BREAK = V('fixture_break'); // 'V dobj prep iobj', preps: ['with'] — the instrument case
export const THROW = V('fixture_throw'); // 'V dobj prep iobj', preps: ['at'] — "at" as a real preposition, not noise
export const LOOK = V('fixture_look'); // 'V'/'V dobj', no preps — "look at lamp": "at" must be dropped as noise
export const ASK = V('fixture_ask'); // 'V npc about topic' — the only pattern needing the literal "about" separator

/** Task 11 (`tests/parser-multi.test.ts`) addition: WAIT/Z, an ordinary 'V'-pattern, non-meta verb with an authored default family — needs no parser code of its own (§3.5). */
export const WAIT = V('fixture_wait');

export const MEMORY_1 = M('fixture_memory_1');
export const CLUE_1 = C('fixture_clue_1');
export const QUESTION_1 = Q('fixture_question_1');

/**
 * Task 15 (`tests/knowledge.test.ts`) additions: a second memory with an
 * ambient `trigger` — reuses task 13's `FLAG_EVENT_FIRED` (set by
 * `fixture_event_once`) as its condition rather than adding a third
 * trigger/fired flag pair, so a test can chain event → memory-trigger →
 * question-recompute across all of §4.2's stages inside one `tick()` call.
 * `MEMORY_1` stays untouched (no `trigger`) — it's the existing
 * explicit-`grantMemory`-only fixture other tasks' tests already depend on.
 */
export const MEMORY_2 = M('fixture_memory_2');
/** Ambient open/answer via flags — QUESTION_1 stays explicit-effect-only. */
export const QUESTION_2 = Q('fixture_question_2');
/** Ambient open via flag, ambient answer via MEMORY_2 — the cross-stage chaining case. */
export const QUESTION_3 = Q('fixture_question_3');

export const FLAG_BOOL = F('fixture_flag_bool');
export const FLAG_NUM = F('fixture_flag_num');

/**
 * Task 13 (`tests/tick.test.ts`) additions: two trigger/fired flag pairs so
 * `world.events` below has real conditions to gate on and real state to
 * assert against, without repurposing `FLAG_BOOL` (which already carries
 * unrelated meaning for `ROOM_C`'s darkness and `LETTER`'s handler).
 * `EVENT_TRIGGER`/`EVENT_FIRED` back a plain once-only event;
 * `WITNESS_TRIGGER`/`WITNESSED_FIRED` back an `onlyIfWitnessed` one whose
 * `witnessedWhen` requires the player in `ROOM_B`.
 */
export const FLAG_EVENT_TRIGGER = F('fixture_flag_event_trigger');
export const FLAG_EVENT_FIRED = F('fixture_flag_event_fired');
export const FLAG_WITNESS_TRIGGER = F('fixture_flag_witness_trigger');
export const FLAG_WITNESSED_FIRED = F('fixture_flag_witnessed_fired');

/** Task 15 additions: gate QUESTION_2/QUESTION_3's ambient openWhen/answerWhen. */
export const FLAG_QUESTION_OPEN = F('fixture_flag_question_open');
export const FLAG_QUESTION_ANSWER = F('fixture_flag_question_answer');

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
    [FLAG_EVENT_TRIGGER]: { default: false, doc: 'task 13: gates fixture_event_once' },
    [FLAG_EVENT_FIRED]: { default: false, doc: 'task 13: set by fixture_event_once when it fires' },
    [FLAG_WITNESS_TRIGGER]: { default: false, doc: 'task 13: gates fixture_event_witnessed' },
    [FLAG_WITNESSED_FIRED]: { default: false, doc: 'task 13: set by fixture_event_witnessed when it fires' },
    [FLAG_QUESTION_OPEN]: { default: false, doc: 'task 15: gates QUESTION_2/QUESTION_3 openWhen' },
    [FLAG_QUESTION_ANSWER]: { default: false, doc: 'task 15: gates QUESTION_2 answerWhen' },
  },
  // Task 9 (`parser/vocabulary.ts`) additions below: `name`/`aliases` on
  // every room, `nouns`/`adjectives` on every object and on `GUIDE` — the
  // vocabulary compiler's data source. Chosen so no noun/adjective word
  // collides with any fixture verb word (`checkVocabularyCollisions`
  // would flag it if one did).
  rooms: {
    // Task 11 `exits`: A <-> B always passable; B <-> C gated by DOOR
    // (closed by default, so that edge starts blocked — GO TO's BFS only
    // ever uses currently-passable edges).
    [ROOM_A]: { name: 'Fixture Room Alpha', aliases: ['room alpha'], dark: true, exits: [{ to: ROOM_B }] }, // baseline dark
    [ROOM_B]: { name: 'Fixture Room B', aliases: ['room b'], exits: [{ to: ROOM_A }, { to: ROOM_C, door: DOOR }] }, // baseline lit (no `dark` entry)
    [ROOM_C]: { name: 'Fixture Room C', aliases: ['room c'], dark: { flag: FLAG_BOOL }, exits: [{ to: ROOM_B, door: DOOR }] }, // baseline dark only while FLAG_BOOL holds
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
    [DOOR_KEY]: { location: ROOM_A, name: 'door key', nouns: ['key'], adjectives: ['door'], portable: true },
    [SPARE_KEY]: { location: ROOM_A, name: 'spare key', nouns: ['key'], portable: true },
    [METAL_BOX]: { location: ROOM_A, name: 'metal box', nouns: ['box'], adjectives: ['metal'] },
    [DOOR]: { location: ROOM_B, name: 'oak door', nouns: ['door'], adjectives: ['oak'], container: { open: false } },
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
    [JACK]: { nouns: ['jack'], pronoun: 'he' },
    [MARA]: { nouns: ['mara'], pronoun: 'she' },
    [RIVER]: { nouns: ['river'], pronoun: 'they' },
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
    // Task 11 additions: AGAIN_VERB_ID (imported from interpreter.ts — the
    // reserved id `DeterministicParser` special-cases) and WAIT both need
    // an ordinary 'V'-pattern, non-meta world.verbs entry with their own
    // authored default family (§3.5) — AGAIN's for "nothing to repeat yet",
    // WAIT's for the ordinary turn-pass case.
    [AGAIN_VERB_ID]: { id: AGAIN_VERB_ID, words: ['again', 'g'], patterns: ['V'], class: null, default: "There's nothing to repeat." },
    [WAIT]: { id: WAIT, words: ['wait', 'z'], patterns: ['V'], class: null, default: 'Time passes.' },
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
    [MEMORY_2]: {
      lines: ['You remember a second fixture, ambiently.'],
      trigger: { when: { flag: FLAG_EVENT_FIRED } },
    },
  },
  clues: {
    [CLUE_1]: { title: 'fixture clue title', questions: [QUESTION_1] },
  },
  questions: {
    [QUESTION_1]: { text: 'Is this a fixture question?' },
    [QUESTION_2]: { text: 'Does this fixture open and answer ambiently?', openWhen: { flag: FLAG_QUESTION_OPEN }, answerWhen: { flag: FLAG_QUESTION_ANSWER } },
    [QUESTION_3]: { text: 'Does a granted memory answer this fixture question?', openWhen: { flag: FLAG_QUESTION_OPEN }, answerWhen: { memory: MEMORY_2 } },
  },
  scripts: {
    [SCRIPT_1]: fixtureScript,
  },
  // Task 13 (`tests/tick.test.ts`) additions: one plain once-only event and
  // one `onlyIfWitnessed` event, exercising §2.8/§4.2/§4.3.3.
  events: {
    fixture_event_once: {
      id: 'fixture_event_once',
      when: { flag: FLAG_EVENT_TRIGGER },
      effects: [{ set: [FLAG_EVENT_FIRED, true] }],
    },
    fixture_event_witnessed: {
      id: 'fixture_event_witnessed',
      when: { flag: FLAG_WITNESS_TRIGGER },
      onlyIfWitnessed: true,
      witnessedWhen: { at: ROOM_B },
      effects: [{ set: [FLAG_WITNESSED_FIRED, true] }],
    },
  },
};

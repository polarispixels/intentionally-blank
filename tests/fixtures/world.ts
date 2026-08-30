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

import { C, F, M, N, O, Q, R, S } from '../../src/engine/ids';
import type { GameEvent, ScriptFn, WorldDef } from '../../src/engine/world';

export const ROOM_A = R('fixture_room_a');
export const ROOM_B = R('fixture_room_b');
export const ROOM_C = R('fixture_room_c');

export const KEY = O('fixture_key');
export const BOX = O('fixture_box');
export const SHELF = O('fixture_shelf');
/** plotCritical: true — exercises the runtime move guard (spec §2.5). */
export const NOTEBOOK = O('fixture_notebook');

export const GUIDE = N('fixture_guide');

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
  },
  flags: {
    [FLAG_BOOL]: { default: false, doc: 'fixture boolean flag, defaults off' },
    [FLAG_NUM]: { default: 2, doc: 'fixture numeric flag, defaults to 2' },
  },
  objects: {
    [KEY]: {},
    [BOX]: {},
    [SHELF]: {},
    [NOTEBOOK]: { plotCritical: true },
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

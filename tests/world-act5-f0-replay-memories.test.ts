// Stage F wave F0 — M21-M24, the replay fragments (`docs/superpowers/specs/
// 2026-09-21-stage-f0-prose.md` §2-§6, register 148). Each fires exactly
// once under its own `trigger.when` and never under the guard's complement
// (`evaluateMemoryTriggers`, `engine/knowledge.ts` — exercised directly,
// unit-level, the same idiom `tests/knowledge.test.ts` uses).

import { describe, expect, it } from 'vitest';
import { evaluateMemoryTriggers } from '../src/engine/knowledge';
import { validate } from '../src/engine/validate';
import { WORLD } from '../src/content/world/game';
import { createSession } from '../src/session/session';
import type { GameState } from '../src/engine/world';
import { ACT2_CLUE_CREDENTIALS, ACT2_CLUE_INDENTED_CREDENTIALS, ACT2_STARTED } from '../src/content/world/act2/ids';
import { ACT3_CLUE_JULES_DEPRECATED, ACT3_HUB_LOGGED_IN } from '../src/content/world/act3/ids';
import { ACT4_STARTED } from '../src/content/world/act4/ids';
import {
  ACT5_BRANCH_UNLOCKED,
  ACT5_MEM_M21,
  ACT5_MEM_M22,
  ACT5_MEM_M23,
  ACT5_MEM_M24,
  ACT5_OPENING_LOGIN_SEEN,
  ACT5_ROOT_ACCEPTED,
} from '../src/content/world/act5/ids';

const TEST_WORLD = WORLD;

function baseState(overrides: Partial<GameState> = {}): GameState {
  const fresh = createSession(TEST_WORLD).state;
  return { ...fresh, ...overrides };
}

describe('validate — Stage F wave F0 (M21-M24)', () => {
  it('produces no NEW errors', () => {
    expect(validate(TEST_WORLD).filter((f) => f.severity === 'error')).toEqual([]);
  });
});

describe('M21 (act5_mem_m21) — the seeded stratum leaking, the room', () => {
  it('fires once opening login has printed and Act II has not begun', () => {
    const state = baseState({ flags: { [ACT5_OPENING_LOGIN_SEEN]: true } });
    const result = evaluateMemoryTriggers(TEST_WORLD, state);
    expect(result.state.memories).toContain(ACT5_MEM_M21);
  });

  it('does not fire before the opening login has printed', () => {
    const state = baseState({});
    const result = evaluateMemoryTriggers(TEST_WORLD, state);
    expect(result.state.memories).not.toContain(ACT5_MEM_M21);
  });

  it('does not fire once Act II has begun (the guard complement)', () => {
    const state = baseState({ flags: { [ACT5_OPENING_LOGIN_SEEN]: true, [ACT2_STARTED]: true } });
    const result = evaluateMemoryTriggers(TEST_WORLD, state);
    expect(result.state.memories).not.toContain(ACT5_MEM_M21);
  });

  it('never re-fires once already held', () => {
    const state = baseState({ flags: { [ACT5_OPENING_LOGIN_SEEN]: true }, memories: [ACT5_MEM_M21] });
    const result = evaluateMemoryTriggers(TEST_WORLD, state);
    expect(result.events).toEqual([]);
  });
});

describe('M22 (act5_mem_m22) — the credentials never learned', () => {
  it('fires logged in at the hub, holding neither credentials clue', () => {
    const state = baseState({ flags: { [ACT3_HUB_LOGGED_IN]: true } });
    const result = evaluateMemoryTriggers(TEST_WORLD, state);
    expect(result.state.memories).toContain(ACT5_MEM_M22);
  });

  it('does not fire before logging in at the hub', () => {
    const state = baseState({});
    const result = evaluateMemoryTriggers(TEST_WORLD, state);
    expect(result.state.memories).not.toContain(ACT5_MEM_M22);
  });

  it('does not fire holding the credentials clue (the guard complement)', () => {
    const state = baseState({ flags: { [ACT3_HUB_LOGGED_IN]: true }, clues: [ACT2_CLUE_CREDENTIALS] });
    const result = evaluateMemoryTriggers(TEST_WORLD, state);
    expect(result.state.memories).not.toContain(ACT5_MEM_M22);
  });

  it('does not fire holding the indented-credentials clue (the other guard complement)', () => {
    const state = baseState({ flags: { [ACT3_HUB_LOGGED_IN]: true }, clues: [ACT2_CLUE_INDENTED_CREDENTIALS] });
    const result = evaluateMemoryTriggers(TEST_WORLD, state);
    expect(result.state.memories).not.toContain(ACT5_MEM_M22);
  });

  it('never re-fires once already held', () => {
    const state = baseState({ flags: { [ACT3_HUB_LOGGED_IN]: true }, memories: [ACT5_MEM_M22] });
    const result = evaluateMemoryTriggers(TEST_WORLD, state);
    expect(result.events).toEqual([]);
  });
});

describe('M23 (act5_mem_m23) — the hatch on nothing', () => {
  it('fires once the branch hatch is open and Act IV has not started', () => {
    const state = baseState({ flags: { [ACT5_BRANCH_UNLOCKED]: true } });
    const result = evaluateMemoryTriggers(TEST_WORLD, state);
    expect(result.state.memories).toContain(ACT5_MEM_M23);
  });

  it('does not fire before the branch hatch is open', () => {
    const state = baseState({});
    const result = evaluateMemoryTriggers(TEST_WORLD, state);
    expect(result.state.memories).not.toContain(ACT5_MEM_M23);
  });

  it('does not fire once Act IV has started (the guard complement)', () => {
    const state = baseState({ flags: { [ACT5_BRANCH_UNLOCKED]: true, [ACT4_STARTED]: true } });
    const result = evaluateMemoryTriggers(TEST_WORLD, state);
    expect(result.state.memories).not.toContain(ACT5_MEM_M23);
  });

  it('never re-fires once already held', () => {
    const state = baseState({ flags: { [ACT5_BRANCH_UNLOCKED]: true }, memories: [ACT5_MEM_M23] });
    const result = evaluateMemoryTriggers(TEST_WORLD, state);
    expect(result.events).toEqual([]);
  });
});

describe('M24 (act5_mem_m24) — the acceptance was never the difficult part', () => {
  it('fires on acceptance at the root console, never having learned who Jules was', () => {
    const state = baseState({ flags: { [ACT5_ROOT_ACCEPTED]: true } });
    const result = evaluateMemoryTriggers(TEST_WORLD, state);
    expect(result.state.memories).toContain(ACT5_MEM_M24);
  });

  it('does not fire before acceptance', () => {
    const state = baseState({});
    const result = evaluateMemoryTriggers(TEST_WORLD, state);
    expect(result.state.memories).not.toContain(ACT5_MEM_M24);
  });

  it('does not fire holding the Jules-deprecated clue (the guard complement)', () => {
    const state = baseState({ flags: { [ACT5_ROOT_ACCEPTED]: true }, clues: [ACT3_CLUE_JULES_DEPRECATED] });
    const result = evaluateMemoryTriggers(TEST_WORLD, state);
    expect(result.state.memories).not.toContain(ACT5_MEM_M24);
  });

  it('never re-fires once already held', () => {
    const state = baseState({ flags: { [ACT5_ROOT_ACCEPTED]: true }, memories: [ACT5_MEM_M24] });
    const result = evaluateMemoryTriggers(TEST_WORLD, state);
    expect(result.events).toEqual([]);
  });
});

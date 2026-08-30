// tests/validate.test.ts — spec §2.1 (validate rule list), §4.3.4
// (clock-free-solution rule), §1.1/cond.ts (npcAt-in-schedule cycle
// warning), §6.2 (question phrasing), §8 task 7.
//
// SCOPE NOTE: `WorldDef` (src/engine/world.ts) is still task 6's narrow
// slice — no `exits`, `handlers`, `verbs`, `puzzles`, `events`, `topics`,
// `deaths`, or `endings` exist yet (those land in tasks 8, 9-11, 13-17).
// So several §2.1 rules (verb `default` prose, puzzle clock-free-solution,
// plot-critical-strand-via-authored-effect) have no data surface to
// validate against yet and are not covered here — see the task report for
// the full list and why. This file covers every rule that *is* checkable
// against the current schema.

import { describe, expect, it } from 'vitest';
import { C, F, M, N, O, Q, R } from '../src/engine/ids';
import type { WorldDef } from '../src/engine/world';
import type { Prose } from '../src/engine/prose';
import { validate } from '../src/engine/validate';
import { CLUE_1, FIXTURE_WORLD, GUIDE, LAMP, MEMORY_1, QUESTION_1, ROOM_A, ROOM_B, ROOM_C } from './fixtures/world';

function findingsOf(world: WorldDef, code: string) {
  return validate(world).filter((f) => f.code === code);
}

describe('validate — the fixture world is clean', () => {
  it('produces zero errors and zero warnings against the shared fixture', () => {
    expect(validate(FIXTURE_WORLD)).toEqual([]);
  });
});

describe('validate — referential integrity', () => {
  it('flags an object whose location targets an undeclared room', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      objects: { ...FIXTURE_WORLD.objects, [O('ghost_object')]: { location: R('ghost_room') } },
    };
    const findings = findingsOf(world, 'unknown-room-ref');
    expect(findings.length).toBeGreaterThan(0);
    expect(findings[0]!.severity).toBe('error');
    expect(findings[0]!.message).toContain('ghost_room');
  });

  it('flags an object whose location targets an undeclared container object', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      objects: { ...FIXTURE_WORLD.objects, [O('ghost_object')]: { location: { in: O('no_such_box') } } },
    };
    const findings = findingsOf(world, 'unknown-object-ref');
    expect(findings.length).toBeGreaterThan(0);
    expect(findings[0]!.message).toContain('no_such_box');
  });

  it('accepts location forms that need no referential check: inventory/worn/nowhere', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      objects: {
        ...FIXTURE_WORLD.objects,
        [O('inv_object')]: { location: 'inventory' },
        [O('worn_object')]: { location: 'worn' },
        [O('nowhere_object')]: { location: 'nowhere' },
      },
    };
    expect(validate(world)).toEqual([]);
  });

  it('flags a room.dark Cond referencing an undeclared flag', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      rooms: { ...FIXTURE_WORLD.rooms, [ROOM_C]: { dark: { flag: F('nonexistent_flag') } } },
    };
    const findings = findingsOf(world, 'unknown-flag-ref');
    expect(findings.length).toBeGreaterThan(0);
    expect(findings[0]!.message).toContain('nonexistent_flag');
  });

  it('flags a schedule rule targeting an undeclared room', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      npcs: { ...FIXTURE_WORLD.npcs, [GUIDE]: { schedule: [{ room: R('ghost_room') }] } },
    };
    const findings = findingsOf(world, 'unknown-room-ref');
    expect(findings.length).toBeGreaterThan(0);
  });

  it('flags a schedule when-Cond referencing an undeclared NPC via npcAt (also caught by the npcAt ban below, but the ref itself is unknown too)', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      npcs: {
        ...FIXTURE_WORLD.npcs,
        [GUIDE]: { schedule: [{ when: { npcAt: [N('ghost_npc'), ROOM_A] }, room: ROOM_B }] },
      },
    };
    const findings = findingsOf(world, 'unknown-npc-ref');
    expect(findings.length).toBeGreaterThan(0);
  });

  it('flags a Cond referencing an undeclared memory/clue/question', () => {
    const memWorld: WorldDef = { ...FIXTURE_WORLD, rooms: { ...FIXTURE_WORLD.rooms, [ROOM_A]: { dark: { memory: M('ghost_memory') } } } };
    expect(findingsOf(memWorld, 'unknown-memory-ref').length).toBeGreaterThan(0);

    const clueWorld: WorldDef = { ...FIXTURE_WORLD, rooms: { ...FIXTURE_WORLD.rooms, [ROOM_A]: { dark: { clue: C('ghost_clue') } } } };
    expect(findingsOf(clueWorld, 'unknown-clue-ref').length).toBeGreaterThan(0);

    const qWorld: WorldDef = {
      ...FIXTURE_WORLD,
      rooms: { ...FIXTURE_WORLD.rooms, [ROOM_A]: { dark: { question: [Q('ghost_question'), 'open'] } } },
    };
    expect(findingsOf(qWorld, 'unknown-question-ref').length).toBeGreaterThan(0);
  });

  it('does not flag Conds that reference real memory/clue/question ids', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      rooms: { ...FIXTURE_WORLD.rooms, [ROOM_A]: { dark: { any: [{ memory: MEMORY_1 }, { clue: CLUE_1 }, { question: [QUESTION_1, 'open'] }] } } },
    };
    expect(validate(world)).toEqual([]);
  });
});

describe('validate — ProseRef families', () => {
  it('flags a ProseRef naming an unknown family', () => {
    const world: WorldDef = { ...FIXTURE_WORLD, responses: { greeting: { ref: 'nope' } } };
    const findings = findingsOf(world, 'prose-ref-unknown-family');
    expect(findings.length).toBeGreaterThan(0);
    expect(findings[0]!.message).toContain('nope');
  });

  it('flags a ref chain that cycles', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      responses: { a: { ref: 'b' } as Prose, b: { ref: 'a' } as Prose },
    };
    const findings = findingsOf(world, 'prose-ref-cycle');
    expect(findings.length).toBeGreaterThan(0);
  });

  it('does not flag a valid one-hop ref chain', () => {
    const world: WorldDef = { ...FIXTURE_WORLD, responses: { unknown: 'Huh?', nounMiss: { ref: 'unknown' } } };
    expect(validate(world)).toEqual([]);
  });
});

describe('validate — authoring completeness (prose)', () => {
  it('flags an empty rotation array at the top level', () => {
    const world: WorldDef = { ...FIXTURE_WORLD, responses: { foo: [] as unknown as Prose } };
    const findings = findingsOf(world, 'prose-empty-rotation');
    expect(findings.length).toBeGreaterThan(0);
  });

  it('flags an empty rotation array nested in a ProseRule', () => {
    const world: WorldDef = { ...FIXTURE_WORLD, responses: { foo: [{ text: [] as unknown as string[] }] } };
    const findings = findingsOf(world, 'prose-empty-rotation');
    expect(findings.length).toBeGreaterThan(0);
  });

  it('flags a ProseRule[] whose last rule has a `when` (no unconditional fallback)', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      responses: { foo: [{ when: { flag: F('fixture_flag_bool') }, text: 'only sometimes' }] },
    };
    const findings = findingsOf(world, 'prose-missing-fallback');
    expect(findings.length).toBeGreaterThan(0);
  });

  it('does not flag a ProseRule[] whose last rule is unconditional', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      responses: { foo: [{ when: { flag: F('fixture_flag_bool') }, text: 'sometimes' }, { text: 'always' }] },
    };
    expect(validate(world)).toEqual([]);
  });
});

describe('validate — schedule cycles (§1.1)', () => {
  it('rejects a ScheduleRule.when that references npcAt at all', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      npcs: {
        ...FIXTURE_WORLD.npcs,
        [GUIDE]: { schedule: [{ when: { npcAt: [GUIDE, ROOM_A] }, room: ROOM_B }, { room: ROOM_C }] },
      },
    };
    const findings = findingsOf(world, 'schedule-references-npcAt');
    expect(findings.length).toBeGreaterThan(0);
    expect(findings[0]!.severity).toBe('error');
  });

  it('rejects npcAt nested inside all/any/not in a schedule when', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      npcs: {
        ...FIXTURE_WORLD.npcs,
        [GUIDE]: { schedule: [{ when: { not: { any: [{ npcAt: [GUIDE, ROOM_A] }] } }, room: ROOM_B }, { room: ROOM_C }] },
      },
    };
    expect(findingsOf(world, 'schedule-references-npcAt').length).toBeGreaterThan(0);
  });
});

describe('validate — dark-cond-vs-light-source warning (§2.4)', () => {
  it('warns when a dark Cond references a lightSource object', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      rooms: { ...FIXTURE_WORLD.rooms, [ROOM_A]: { dark: { objectState: [LAMP, 'on', false] } } },
    };
    const findings = findingsOf(world, 'dark-cond-references-light-source');
    expect(findings.length).toBeGreaterThan(0);
    expect(findings[0]!.severity).toBe('warning');
  });

  it('does not warn when a dark Cond references a non-light object', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      rooms: { ...FIXTURE_WORLD.rooms, [ROOM_A]: { dark: { objectAt: [O('fixture_key'), ROOM_A] } } },
    };
    expect(findingsOf(world, 'dark-cond-references-light-source')).toEqual([]);
  });
});

describe('validate — question phrasing (§6.2)', () => {
  it('rejects a question authored as an imperative quest marker', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      questions: { ...FIXTURE_WORLD.questions, [Q('find_it')]: { text: 'Find the notebook.' } },
    };
    const findings = findingsOf(world, 'question-not-phrased-as-question');
    expect(findings.length).toBeGreaterThan(0);
    expect(findings[0]!.severity).toBe('error');
  });

  it('accepts a question phrased as a question', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      questions: { ...FIXTURE_WORLD.questions, [Q('why')]: { text: 'Why does the client remember a sibling nobody else does?' } },
    };
    expect(findingsOf(world, 'question-not-phrased-as-question')).toEqual([]);
  });

  it('accepts a question mark followed by a trailing quote', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      questions: { ...FIXTURE_WORLD.questions, [Q('quoted')]: { text: 'He asked, "who am I?"' } },
    };
    expect(findingsOf(world, 'question-not-phrased-as-question')).toEqual([]);
  });
});

describe('validate — meta.phases duplicate start minute', () => {
  it('rejects two phases sharing the same start minute (clock.ts phase() would throw at runtime otherwise)', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      meta: { ...FIXTURE_WORLD.meta, phases: { morning: 360, afternoon: 360, evening: 1080, night: 1320 } },
    };
    const findings = findingsOf(world, 'meta-duplicate-phase-start');
    expect(findings.length).toBeGreaterThan(0);
    expect(findings[0]!.severity).toBe('error');
  });
});

describe('validate — returns every finding, not just the first', () => {
  it('reports both a broken object location and a broken flag ref in one call', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      objects: { ...FIXTURE_WORLD.objects, [O('ghost_object')]: { location: R('ghost_room') } },
      rooms: { ...FIXTURE_WORLD.rooms, [ROOM_C]: { dark: { flag: F('nonexistent_flag') } } },
    };
    const findings = validate(world);
    expect(findings.some((f) => f.code === 'unknown-room-ref')).toBe(true);
    expect(findings.some((f) => f.code === 'unknown-flag-ref')).toBe(true);
  });
});

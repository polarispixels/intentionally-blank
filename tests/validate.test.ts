// tests/validate.test.ts — spec §2.1 (validate rule list), §4.3.4
// (clock-free-solution rule), §1.1/cond.ts (npcAt-in-schedule cycle
// warning), §6.2 (question phrasing), §8 task 7.
//
// Task 8 additions: `verb.default` non-null for non-meta verbs, and the
// plot-critical-strand-via-authored-effect rule (§2.5) — both land here
// once `WorldDef.verbs`/`ObjectDefSlice.handlers` exist (task 8's own job
// to add), per this file's own note below about what task 7 could not yet
// cover.
//
// SCOPE NOTE: `WorldDef` (src/engine/world.ts) is still a growing slice —
// no `exits`, `puzzles`, `events`, `topics`, `deaths`, or `endings` exist
// yet (those land in tasks 9-11, 13-17). So several §2.1 rules (puzzle
// clock-free-solution) have no data surface to validate against yet and
// are not covered here.

import { describe, expect, it } from 'vitest';
import { C, F, M, N, O, Q, R, V } from '../src/engine/ids';
import type { WorldDef } from '../src/engine/world';
import type { Prose } from '../src/engine/prose';
import { BUILTIN_VERB_IDS } from '../src/engine/actions';
import { validate } from '../src/engine/validate';
import { BOX, CLUE_1, DOOR, DOOR_KEY, FIXTURE_WORLD, GUIDE, KEY, LAMP, LETTER, MEMORY_1, METAL_BOX, NOTEBOOK, QUESTION_1, QUESTION_2, ROOM_A, ROOM_B, ROOM_C, SHELF, SPARE_KEY } from './fixtures/world';

function findingsOf(world: WorldDef, code: string) {
  return validate(world).filter((f) => f.code === code);
}

/**
 * `FIXTURE_WORLD`'s own known, deliberate `object-noun-collision` warnings
 * (new rule, `validate.ts`'s `checkObjectNounCollisions`, added after
 * Ryan's "which do you mean, the rack or the key?" loop): `KEY`/`DOOR_KEY`/
 * `SPARE_KEY` share bare noun "key" and `BOX`/`METAL_BOX` share "box" ON
 * PURPOSE — `fixtures/world.ts`'s own header comment names this as the
 * exact ambiguity `tests/parser-resolve.test.ts` needs to exercise real
 * disambiguation. Every "does not flag X" test below that reuses
 * `FIXTURE_WORLD` unmodified (or extends it with objects that declare no
 * `nouns`, so the set can't change) subtracts this constant instead of
 * asserting a bare `[]` — the fixture is deliberately not silent on this
 * one rule, and that's the accepted false positive the rule's own header
 * says to expect, not a regression in whatever each test actually checks.
 */
const KNOWN_FIXTURE_WARNINGS = validate(FIXTURE_WORLD).filter((f) => f.severity === 'warning');

describe('validate — the fixture world is clean', () => {
  it('produces zero errors, and only the deliberate noun-collision warnings its own fixtures document', () => {
    expect(validate(FIXTURE_WORLD)).toEqual(KNOWN_FIXTURE_WARNINGS);
    expect(KNOWN_FIXTURE_WARNINGS.every((f) => f.code === 'object-noun-collision')).toBe(true);
    expect(KNOWN_FIXTURE_WARNINGS.length).toBe(4); // KEY×DOOR_KEY, KEY×SPARE_KEY, DOOR_KEY×SPARE_KEY, BOX×METAL_BOX
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

  it('accepts location forms that need no referential check: inventory/worn/self/nowhere', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      objects: {
        ...FIXTURE_WORLD.objects,
        [O('inv_object')]: { location: 'inventory' },
        [O('worn_object')]: { location: 'worn' },
        [O('self_object')]: { location: 'self' },
        [O('nowhere_object')]: { location: 'nowhere' },
      },
    };
    expect(validate(world)).toEqual(KNOWN_FIXTURE_WARNINGS);
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

  it('flags an onOrAfterDay Cond referencing an undeclared flag (ADR 0011, Stage D E2)', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      rooms: { ...FIXTURE_WORLD.rooms, [ROOM_A]: { dark: { onOrAfterDay: F('nonexistent_due_day_flag') } } },
    };
    const findings = findingsOf(world, 'unknown-flag-ref');
    expect(findings.length).toBeGreaterThan(0);
    expect(findings[0]!.message).toContain('nonexistent_due_day_flag');
  });

  it('does not flag Conds that reference real memory/clue/question ids', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      rooms: { ...FIXTURE_WORLD.rooms, [ROOM_A]: { dark: { any: [{ memory: MEMORY_1 }, { clue: CLUE_1 }, { question: [QUESTION_1, 'open'] }] } } },
    };
    expect(validate(world)).toEqual(KNOWN_FIXTURE_WARNINGS);
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
    expect(validate(world)).toEqual(KNOWN_FIXTURE_WARNINGS);
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
    expect(validate(world)).toEqual(KNOWN_FIXTURE_WARNINGS);
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

describe('validate — meta.startClock (ADR 0011, Stage D E1)', () => {
  it('accepts a world with no startClock declared', () => {
    expect(FIXTURE_WORLD.meta.startClock).toBeUndefined();
    expect(findingsOf(FIXTURE_WORLD, 'meta-start-clock-invalid')).toEqual([]);
  });

  it('accepts a valid startClock', () => {
    const world: WorldDef = { ...FIXTURE_WORLD, meta: { ...FIXTURE_WORLD.meta, startClock: { day: 1, minute: 260 } } };
    expect(findingsOf(world, 'meta-start-clock-invalid')).toEqual([]);
  });

  it('rejects minute 1440 (out of range)', () => {
    const world: WorldDef = { ...FIXTURE_WORLD, meta: { ...FIXTURE_WORLD.meta, startClock: { day: 1, minute: 1440 } } };
    const findings = findingsOf(world, 'meta-start-clock-invalid');
    expect(findings).toHaveLength(1);
    expect(findings[0]!.severity).toBe('error');
  });

  it('rejects day 0', () => {
    const world: WorldDef = { ...FIXTURE_WORLD, meta: { ...FIXTURE_WORLD.meta, startClock: { day: 0, minute: 0 } } };
    const findings = findingsOf(world, 'meta-start-clock-invalid');
    expect(findings).toHaveLength(1);
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

// ---------------------------------------------------------------------------
// §8 task 8's first owed rule: every non-meta verb needs a non-null
// `default` prose family.
// ---------------------------------------------------------------------------

describe('validate — every non-meta verb has a non-null default family (§2.9)', () => {
  it('rejects a non-meta verb with default: null', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      verbs: {
        ...FIXTURE_WORLD.verbs,
        [V('fixture_broken_verb')]: { id: V('fixture_broken_verb'), words: ['kick'], patterns: ['V dobj'], class: 'direct', default: null },
      },
    };
    const findings = findingsOf(world, 'verb-missing-default-family');
    expect(findings.length).toBeGreaterThan(0);
    expect(findings[0]!.severity).toBe('error');
    expect(findings[0]!.message).toContain('fixture_broken_verb');
  });

  it('accepts a meta verb with default: null — meta verbs never reach the response ladder', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      verbs: {
        ...FIXTURE_WORLD.verbs,
        [V('fixture_meta_ok')]: { id: V('fixture_meta_ok'), words: ['save'], patterns: ['V'], class: null, meta: true, default: null },
      },
    };
    expect(findingsOf(world, 'verb-missing-default-family')).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// §8 task 8's second owed rule: no authored effect strands a plotCritical
// object (§2.5) — the data-side counterpart of `effects.ts`'s runtime
// `move()` guard (task 5).
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Stage B task 11 follow-up: no room name/alias, object noun/adjective, or
// NPC noun may contain a noise word anywhere — `dropBaseNoise` strips a
// noise-word token from any position in the input, not just the end (the
// real `ROOM_A` bug: name "Fixture Room A" / alias "room a" both end in the
// noise word "a"). The rule is deliberately broadened past "ends with" to
// "any whole word" — a leading noise word ("the lobby") breaks the same
// way; see this task's report.
// ---------------------------------------------------------------------------

describe('validate — no room/object/NPC vocabulary word is a noise word (Stage B task 11 follow-up)', () => {
  it('rejects a room alias ending with a noise word (the real "room a" bug)', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      rooms: { ...FIXTURE_WORLD.rooms, [ROOM_C]: { ...FIXTURE_WORLD.rooms![ROOM_C]!, aliases: ['room a'] } },
    };
    const findings = findingsOf(world, 'noise-word-vocabulary');
    expect(findings.length).toBeGreaterThan(0);
    expect(findings.every((f) => f.severity === 'error')).toBe(true);
    expect(findings.some((f) => f.message.includes('room a'))).toBe(true);
  });

  it('rejects a room name starting with a noise word (proves the broadened "any word" rule, not just "ends with")', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      rooms: { ...FIXTURE_WORLD.rooms, [ROOM_C]: { ...FIXTURE_WORLD.rooms![ROOM_C]!, name: 'The Lobby' } },
    };
    const findings = findingsOf(world, 'noise-word-vocabulary');
    expect(findings.some((f) => f.message.includes('The Lobby'))).toBe(true);
  });

  it('rejects an object noun and adjective that are noise words, and an NPC noun', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      objects: { ...FIXTURE_WORLD.objects, [O('fixture_noisy')]: { location: ROOM_A, nouns: ['a'], adjectives: ['the'] } },
      npcs: { ...FIXTURE_WORLD.npcs, [N('fixture_noisy_npc')]: { nouns: ['just'] } },
    };
    const findings = findingsOf(world, 'noise-word-vocabulary');
    expect(findings.some((f) => f.message.includes('object.fixture_noisy.nouns'))).toBe(true);
    expect(findings.some((f) => f.message.includes('object.fixture_noisy.adjectives'))).toBe(true);
    expect(findings.some((f) => f.message.includes('npc.fixture_noisy_npc.nouns'))).toBe(true);
  });

  it('accepts a clean world (no false positive on ordinary content — the fixture itself)', () => {
    expect(findingsOf(FIXTURE_WORLD, 'noise-word-vocabulary')).toEqual([]);
  });
});

describe('validate — no authored effect strands a plotCritical object (§2.5)', () => {
  it('rejects a handler effect that moves a plotCritical object to "nowhere"', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      objects: {
        ...FIXTURE_WORLD.objects,
        [KEY]: {
          ...FIXTURE_WORLD.objects![KEY]!,
          handlers: [{ verbs: [BUILTIN_VERB_IDS.drop], effects: [{ move: [NOTEBOOK, 'nowhere'] }] }],
        },
      },
    };
    const findings = findingsOf(world, 'effect-strands-plot-critical');
    expect(findings.length).toBeGreaterThan(0);
    expect(findings[0]!.severity).toBe('error');
    expect(findings[0]!.message).toContain('fixture_notebook');
  });

  it('rejects a handler effect that moves a plotCritical object into npc possession, even nested inside an "if"', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      objects: {
        ...FIXTURE_WORLD.objects,
        [KEY]: {
          ...FIXTURE_WORLD.objects![KEY]!,
          handlers: [
            {
              verbs: [BUILTIN_VERB_IDS.drop],
              effects: [{ if: { when: { flag: F('fixture_flag_bool') }, then: [{ move: [NOTEBOOK, { npc: GUIDE }] }] } }],
            },
          ],
        },
      },
    };
    const findings = findingsOf(world, 'effect-strands-plot-critical');
    expect(findings.length).toBeGreaterThan(0);
  });

  it('accepts a handler effect that moves a plotCritical object between ordinary places', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      objects: {
        ...FIXTURE_WORLD.objects,
        [KEY]: {
          ...FIXTURE_WORLD.objects![KEY]!,
          handlers: [{ verbs: [BUILTIN_VERB_IDS.drop], effects: [{ move: [NOTEBOOK, 'inventory'] }] }],
        },
      },
    };
    expect(findingsOf(world, 'effect-strands-plot-critical')).toEqual([]);
  });

  it('does not flag a non-plotCritical object moved to "nowhere"', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      objects: {
        ...FIXTURE_WORLD.objects,
        [KEY]: {
          ...FIXTURE_WORLD.objects![KEY]!,
          handlers: [{ verbs: [BUILTIN_VERB_IDS.drop], effects: [{ move: [KEY, 'nowhere'] }] }],
        },
      },
    };
    expect(findingsOf(world, 'effect-strands-plot-critical')).toEqual([]);
  });
});

describe('noise-word-vocabulary: NPC adjectives', () => {
  it('rejects an NPC adjective that the tokenizer would strip', () => {
    const world = {
      ...FIXTURE_WORLD,
      npcs: {
        ...FIXTURE_WORLD.npcs,
        [N('noisy_npc')]: {
          id: N('noisy_npc'),
          nouns: ['clerk'],
          adjectives: ['the'],
        },
      },
    } as unknown as WorldDef;
    const findings = validate(world);
    expect(
      findings.some((f) => f.code === 'noise-word-vocabulary' && f.message.includes('npc.noisy_npc.adjectives')),
    ).toBe(true);
  });
});

describe('validate — witnessed events (§4.3.3)', () => {
  it('flags onlyIfWitnessed with no witnessedWhen', () => {
    const world = {
      ...FIXTURE_WORLD,
      events: {
        ...FIXTURE_WORLD.events,
        blind_beat: { when: { flag: F('fixture_flag_bool') }, onlyIfWitnessed: true, effects: [] },
      },
    } as unknown as WorldDef;
    const findings = validate(world).filter((f) => f.code === 'event-witnessed-without-condition');
    expect(findings.length).toBe(1);
    expect(findings[0]!.message).toContain('blind_beat');
  });

  it('accepts onlyIfWitnessed when witnessedWhen is present', () => {
    const world = {
      ...FIXTURE_WORLD,
      events: {
        ...FIXTURE_WORLD.events,
        seen_beat: {
          when: { flag: F('fixture_flag_bool') },
          onlyIfWitnessed: true,
          witnessedWhen: { at: ROOM_A },
          effects: [],
        },
      },
    } as unknown as WorldDef;
    expect(validate(world).some((f) => f.code === 'event-witnessed-without-condition')).toBe(false);
  });
});

describe('validate — knowledge referential integrity (§2.7, §8 task 15)', () => {
  it('flags a memory trigger.when referencing an undeclared flag', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      memories: {
        ...FIXTURE_WORLD.memories,
        [M('ghost_trigger_memory')]: { lines: ['n/a'], trigger: { when: { flag: F('nonexistent_flag') } } },
      },
    };
    const findings = findingsOf(world, 'unknown-flag-ref');
    expect(findings.length).toBeGreaterThan(0);
    expect(findings[0]!.message).toContain('ghost_trigger_memory');
    expect(findings[0]!.message).toContain('nonexistent_flag');
  });

  it('flags a question openWhen/answerWhen referencing an undeclared flag', () => {
    const openWorld: WorldDef = {
      ...FIXTURE_WORLD,
      questions: { ...FIXTURE_WORLD.questions, [Q('ghost_open_question')]: { text: 'Is this open?', openWhen: { flag: F('nonexistent_flag') } } },
    };
    const openFindings = findingsOf(openWorld, 'unknown-flag-ref');
    expect(openFindings.length).toBeGreaterThan(0);
    expect(openFindings[0]!.message).toContain('ghost_open_question');

    const answerWorld: WorldDef = {
      ...FIXTURE_WORLD,
      questions: { ...FIXTURE_WORLD.questions, [Q('ghost_answer_question')]: { text: 'Is this answered?', answerWhen: { flag: F('nonexistent_flag') } } },
    };
    const answerFindings = findingsOf(answerWorld, 'unknown-flag-ref');
    expect(answerFindings.length).toBeGreaterThan(0);
    expect(answerFindings[0]!.message).toContain('ghost_answer_question');
  });

  it('flags a clue naming an undeclared question in questions[]', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      clues: { ...FIXTURE_WORLD.clues, [CLUE_1]: { ...FIXTURE_WORLD.clues![CLUE_1]!, questions: [Q('ghost_question_for_clue')] } },
    };
    const findings = findingsOf(world, 'unknown-question-ref');
    expect(findings.length).toBeGreaterThan(0);
    expect(findings[0]!.message).toContain(CLUE_1);
    expect(findings[0]!.message).toContain('ghost_question_for_clue');
  });

  it('accepts real refs: fixture clue.questions -> QUESTION_1 (also covered by the whole-fixture-is-clean test, asserted directly here too)', () => {
    expect(FIXTURE_WORLD.clues![CLUE_1]!.questions).toContain(QUESTION_1);
    expect(FIXTURE_WORLD.questions![QUESTION_2]!.openWhen).toBeDefined();
    expect(validate(FIXTURE_WORLD)).toEqual(KNOWN_FIXTURE_WARNINGS);
  });
});

describe('validate — answerable questions carry their recap (§6.2)', () => {
  it('flags a question with answerWhen and no answer', () => {
    const world = {
      ...FIXTURE_WORLD,
      questions: {
        ...FIXTURE_WORLD.questions,
        blank_settle: { text: 'Why is the room like this?', answerWhen: { flag: F('fixture_flag_bool') } },
      },
    } as unknown as WorldDef;
    const findings = validate(world).filter((f) => f.code === 'question-answerable-without-recap');
    expect(findings.length).toBe(1);
    expect(findings[0]!.message).toContain('blank_settle');
  });

  it('accepts a question that opens but is never answerable', () => {
    const world = {
      ...FIXTURE_WORLD,
      questions: { ...FIXTURE_WORLD.questions, hanging: { text: 'Who am I?' } },
    } as unknown as WorldDef;
    expect(validate(world).some((f) => f.code === 'question-answerable-without-recap')).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Room description vs. portable-object staleness (§2.5 `listedAs` task) —
// the fedora-bug tripwire.
// ---------------------------------------------------------------------------

describe('validate — room description mentions a portable object it is authored at (§2.5)', () => {
  // LETTER, not KEY: the fixture also places DOOR_KEY/SPARE_KEY at ROOM_A
  // sharing KEY's bare noun "key" (task 10's own deliberate ambiguity
  // fixture) — real, multi-object collisions, but noisy for isolating one
  // rule's behavior. LETTER's noun ("letter") and adjective ("folded") are
  // each authored on exactly one fixture object.
  it('warns when a room\'s description contains a portable object\'s own noun, whole-word', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      rooms: { ...FIXTURE_WORLD.rooms, [ROOM_A]: { ...FIXTURE_WORLD.rooms![ROOM_A]!, description: 'A dusty room. On the floor lies a letter.' } },
    };
    const findings = findingsOf(world, 'room-description-mentions-portable');
    expect(findings.length).toBe(1);
    expect(findings[0]!.severity).toBe('warning');
    expect(findings[0]!.message).toContain('letter');
    expect(findings[0]!.message).toContain(LETTER);
  });

  it('warns on a portable object\'s adjective too, not just its noun', () => {
    // LETTER: adjectives ['folded'].
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      rooms: { ...FIXTURE_WORLD.rooms, [ROOM_A]: { ...FIXTURE_WORLD.rooms![ROOM_A]!, description: 'Everything in here is folded twice over.' } },
    };
    expect(findingsOf(world, 'room-description-mentions-portable').length).toBe(1);
  });

  it('matches whole words only — an inflected form does not trigger (a stated, accepted gap, not a bug)', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      rooms: { ...FIXTURE_WORLD.rooms, [ROOM_A]: { ...FIXTURE_WORLD.rooms![ROOM_A]!, description: 'A stack of letters sits by the window.' } },
    };
    expect(findingsOf(world, 'room-description-mentions-portable')).toEqual([]);
  });

  it('does not warn for a non-portable (scenery) object, even when its noun appears in the room\'s description', () => {
    // SHELF: location ROOM_A, nouns ['shelf'], NOT portable.
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      rooms: { ...FIXTURE_WORLD.rooms, [ROOM_A]: { ...FIXTURE_WORLD.rooms![ROOM_A]!, description: 'A wooden shelf runs along one wall.' } },
    };
    expect(findingsOf(world, 'room-description-mentions-portable')).toEqual([]);
  });

  it('does not warn for a portable object authored in a DIFFERENT room, even if this room\'s text happens to use the same word', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      objects: { ...FIXTURE_WORLD.objects, [LETTER]: { ...FIXTURE_WORLD.objects![LETTER]!, location: ROOM_B } }, // LETTER moved off ROOM_A
      rooms: { ...FIXTURE_WORLD.rooms, [ROOM_A]: { ...FIXTURE_WORLD.rooms![ROOM_A]!, description: 'On the floor lies a letter.' } },
    };
    expect(findingsOf(world, 'room-description-mentions-portable')).toEqual([]);
  });

  it('the shared fixture world itself is clean of this warning', () => {
    expect(findingsOf(FIXTURE_WORLD, 'room-description-mentions-portable')).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Exit doors: can a player-closed door always be reopened? (priority
// insert, Ryan's playtest — `your_door_outside` could be closed by a
// custom handler but had no `container` and no OPEN handler, so
// `builtinOpen` refused every reopen attempt and the exit stayed
// permanently blocked). `DOOR` (fixture: `ROOM_C`'s own `w` exit) already
// has a `container`, so the shared fixture is clean of this rule by
// default — these tests swap `DOOR`'s own definition to exercise the rule
// directly, same pattern the noun-collision tests below use.
// ---------------------------------------------------------------------------

describe('validate — exit doors can always be reopened once closed (walking-dead check)', () => {
  it('flags a door a custom handler can CLOSE that has no "container" and no OPEN handler — the exact your_door_outside shape', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      objects: {
        ...FIXTURE_WORLD.objects,
        [DOOR]: {
          location: ROOM_B,
          name: 'stuck door',
          nouns: ['stuck door'],
          handlers: [{ verbs: [BUILTIN_VERB_IDS.close], effects: [{ say: 'It shuts.' }] }],
        },
      },
    };
    const findings = findingsOf(world, 'door-exit-cannot-reopen');
    expect(findings.length).toBe(1);
    expect(findings[0]!.severity).toBe('error');
    expect(findings[0]!.message).toContain(DOOR);
  });

  it('does not flag a door with a "container" — the built-in OPEN always works regardless of any custom CLOSE handler', () => {
    // The shared fixture's own `DOOR` (ROOM_C's `w` exit) already has
    // `container: { open: false }` and no custom handlers at all.
    expect(findingsOf(FIXTURE_WORLD, 'door-exit-cannot-reopen')).toEqual([]);
  });

  it('does not flag a door with no "container" but a custom OPEN handler alongside its CLOSE handler', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      objects: {
        ...FIXTURE_WORLD.objects,
        [DOOR]: {
          location: ROOM_B,
          name: 'clever door',
          nouns: ['clever door'],
          handlers: [
            { verbs: [BUILTIN_VERB_IDS.close], effects: [{ say: 'It shuts.' }] },
            { verbs: [BUILTIN_VERB_IDS.open], effects: [{ say: 'It opens.' }] },
          ],
        },
      },
    };
    expect(findingsOf(world, 'door-exit-cannot-reopen')).toEqual([]);
  });

  it('does not flag a door that can never be closed at all — the always-shut build-boundary-gate shape (permanently sealed by design, not a player-inflicted lockout)', () => {
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      objects: { ...FIXTURE_WORLD.objects, [DOOR]: { location: ROOM_B } }, // no container, no handlers: can be neither opened nor closed
    };
    expect(findingsOf(world, 'door-exit-cannot-reopen')).toEqual([]);
  });

  it('does not flag a door object nothing exits through — checkRoomExits already reports the world for referencing it wrong, not this rule', () => {
    // A stuck door authored but never named by any exit is out of this
    // rule's scope by design (see `checkDoorExitsCanReopen`'s own header):
    // nothing traverses through it, so nobody can be locked out by it.
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      objects: {
        ...FIXTURE_WORLD.objects,
        [O('fixture_decorative_door')]: {
          location: ROOM_A,
          name: 'decorative door',
          nouns: ['decorative door'],
          handlers: [{ verbs: [BUILTIN_VERB_IDS.close], effects: [{ say: 'It shuts, for show.' }] }],
        },
      },
    };
    expect(findingsOf(world, 'door-exit-cannot-reopen')).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Object/object noun collisions (Ryan's playtest, "which do you mean, the
// rack or the key?" loop) — `checkObjectNounCollisions`'s own header names
// the fixture's KEY/DOOR_KEY/SPARE_KEY and BOX/METAL_BOX as its own
// deliberate baseline (`KNOWN_FIXTURE_WARNINGS`, top of this file). These
// tests exercise the scope rules directly, on top of that baseline.
// ---------------------------------------------------------------------------

describe('validate — object/object noun collisions (§3.2/§3.3, after Ryan\'s "rack or the key" loop)', () => {
  it('the fixture already demonstrates same-room collisions: KEY×DOOR_KEY, KEY×SPARE_KEY, DOOR_KEY×SPARE_KEY (all ROOM_A), and BOX×METAL_BOX (both ROOM_A)', () => {
    const findings = findingsOf(FIXTURE_WORLD, 'object-noun-collision');
    expect(findings.length).toBe(4);
    expect(findings.every((f) => f.severity === 'warning')).toBe(true);
    expect(findings.some((f) => f.message.includes(KEY) && f.message.includes(DOOR_KEY))).toBe(true);
    expect(findings.some((f) => f.message.includes(KEY) && f.message.includes(SPARE_KEY))).toBe(true);
    expect(findings.some((f) => f.message.includes(DOOR_KEY) && f.message.includes(SPARE_KEY))).toBe(true);
    expect(findings.some((f) => f.message.includes(BOX) && f.message.includes(METAL_BOX))).toBe(true);
  });

  it('does not flag two objects in DIFFERENT rooms that happen to share a noun, neither one portable', () => {
    // SHELF (ROOM_A, scenery, nouns ['shelf']) vs. a new non-portable
    // "shelf" scenery object authored at ROOM_B: never in scope together,
    // and neither travels — no warning.
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      objects: {
        ...FIXTURE_WORLD.objects,
        [O('fixture_other_shelf')]: { location: ROOM_B, name: 'other shelf', nouns: ['shelf'] },
      },
    };
    const findings = findingsOf(world, 'object-noun-collision');
    expect(findings.some((f) => f.message.includes('fixture_other_shelf'))).toBe(false);
  });

  it('flags a portable object against a DIFFERENT room\'s own directly-placed object — "commonly carried," this task\'s own worked example', () => {
    // HAT (ROOM_A, portable) given a noun that collides with SHELF (ROOM_A)
    // is already same-room and uninteresting; instead prove the
    // cross-room "commonly carried" half by giving a NEW portable object
    // at ROOM_A the exact noun DOOR (ROOM_B) uses.
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      objects: {
        ...FIXTURE_WORLD.objects,
        [O('fixture_carried_door_stop')]: { location: ROOM_A, name: 'door stop', nouns: ['door'], portable: true },
      },
    };
    const findings = findingsOf(world, 'object-noun-collision');
    expect(findings.some((f) => f.message.includes('fixture_carried_door_stop') && f.message.includes(DOOR) && f.message.includes('"door"'))).toBe(true);
  });

  it('does not flag two objects sharing only a DIFFERENT word each also has, when the shared word itself differs', () => {
    // LAMP (ROOM_A, nouns ['lamp', 'light']) vs. NOTEBOOK (ROOM_A, nouns
    // ['notebook']) share nothing — sanity check that unrelated same-room
    // objects produce no finding for each other.
    const findings = findingsOf(FIXTURE_WORLD, 'object-noun-collision');
    expect(findings.some((f) => f.message.includes(LAMP) && f.message.includes(NOTEBOOK))).toBe(false);
  });
});

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
import { CLUE_1, FIXTURE_WORLD, GUIDE, KEY, LAMP, MEMORY_1, NOTEBOOK, QUESTION_1, QUESTION_2, ROOM_A, ROOM_B, ROOM_C } from './fixtures/world';

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
    expect(validate(FIXTURE_WORLD)).toEqual([]);
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

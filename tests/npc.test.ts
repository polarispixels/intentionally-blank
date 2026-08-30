// tests/npc.test.ts — spec §2.6, §8 task 14.
//
// Scope: `src/engine/npc.ts` — ASK/TELL topic matching by words, knowledge
// gating (a topic whose `when` doesn't hold falls to `unknownTopic`
// indistinguishably from a topic that was never authored), `unknownTopic`
// firing with a `topicMiss` diag, SHOW via `showResponses`, TALK TO/HELLO
// greeting — plus `respond.ts`'s routing of these verbs and
// `compileVocabulary`'s `topicWords` seam.
//
// Reuses `tests/fixtures/world.ts`'s `FIXTURE_WORLD` for rooms/objects, but
// builds a local `WORLD` overlay (same pattern as `tests/respond.test.ts`)
// with NPC topic/showResponses/greeting data and the reserved ASK/TELL/
// SHOW/TALK verbs — the shared fixture itself is untouched, so
// `tests/parser-grammar.test.ts`'s "topicWords is empty" assertion (no
// TopicDef data exists on the shared `FIXTURE_WORLD`) stays true.

import { describe, expect, it } from 'vitest';
import { T, V } from '../src/engine/ids';
import type { GameState, WorldDef } from '../src/engine/world';
import { respond } from '../src/engine/respond';
import type { InterpretOutcome } from '../src/engine/interpreter';
import { compileVocabulary } from '../src/engine/parser/vocabulary';
import { validate } from '../src/engine/validate';
import {
  respondToAsk,
  respondToGreeting,
  respondToShow,
  respondToTell,
  NPC_VERB_IDS,
} from '../src/engine/npc';
import { BOX, CLUE_1, FIXTURE_WORLD, GUIDE, JACK, KEY, MARA, NOTEBOOK, ROOM_A } from './fixtures/world';
import { FLAG_BOOL } from './fixtures/world';

const TOPIC_BROTHER = T('fixture_topic_brother');
const TOPIC_SIBLING_DUPLICATE = T('fixture_topic_sibling_duplicate'); // shares a word with TOPIC_BROTHER, for the ambiguous-match test
const TOPIC_GATED = T('fixture_topic_gated');
const TOPIC_TELL_ONLY = T('fixture_topic_tell_only');

const WORLD: WorldDef = {
  ...FIXTURE_WORLD,
  npcs: {
    ...FIXTURE_WORLD.npcs,
    [GUIDE]: {
      ...FIXTURE_WORLD.npcs![GUIDE]!,
      topics: [
        {
          id: TOPIC_BROTHER,
          words: ['brother', 'sibling'],
          response: ['He looks away. "My brother is not a subject."', 'He sighs. "Not this again."'],
          effects: [{ grantClue: CLUE_1 }],
        },
        {
          id: TOPIC_SIBLING_DUPLICATE,
          words: ['sibling'], // shares "sibling" with TOPIC_BROTHER, declared second — first-declared wins
          response: 'This topic should never be reached; TOPIC_BROTHER is declared first.',
        },
        {
          id: TOPIC_GATED,
          words: ['case'],
          when: { flag: FLAG_BOOL },
          response: 'He tells you about the glass case.',
        },
      ],
      unknownTopic: ["He shrugs. \"Can't help you there.\"", 'He says nothing.'],
      greeting: 'The guide nods at you.',
      showResponses: [
        { objects: [KEY], response: 'He recognizes the brass key immediately.', effects: [{ set: [FLAG_BOOL, true] }] },
        { objects: 'any', when: { flag: FLAG_BOOL }, response: 'He glances at it without much interest.' },
      ],
    },
    [JACK]: {
      ...FIXTURE_WORLD.npcs![JACK]!,
      // No `topics` at all: ASK JACK ABOUT anything should always fall to unknownTopic.
      unknownTopic: 'Jack has nothing to say.',
    },
    [MARA]: {
      ...FIXTURE_WORLD.npcs![MARA]!,
      topics: [{ id: TOPIC_BROTHER, words: ['brother'], response: 'Mara: ASK response.' }],
      tellTopics: [{ id: TOPIC_TELL_ONLY, words: ['brother'], response: 'Mara: TELL response (tellTopics overrides topics).' }],
      unknownTopic: 'Mara has nothing to add.',
    },
  },
  verbs: {
    ...FIXTURE_WORLD.verbs,
    [NPC_VERB_IDS.ask]: { id: NPC_VERB_IDS.ask, words: ['ask'], patterns: ['V npc about topic'], class: 'social', default: "There's no one here to ask." },
    [NPC_VERB_IDS.tell]: { id: NPC_VERB_IDS.tell, words: ['tell'], patterns: ['V npc about topic'], class: 'social', default: "There's no one here to tell." },
    [NPC_VERB_IDS.show]: {
      id: NPC_VERB_IDS.show,
      words: ['show'],
      patterns: ['V dobj prep iobj'],
      preps: ['to'],
      class: 'social',
      default: 'Showing the {name} to {iobj} accomplishes nothing.',
    },
    [NPC_VERB_IDS.talk]: {
      id: NPC_VERB_IDS.talk,
      words: ['talk to', 'hello'],
      patterns: ['V dobj'],
      class: 'social',
      default: '{name} has nothing to say to you right now.',
    },
  },
  responses: {
    ...FIXTURE_WORLD.responses,
    'nounMiss.seen': "The {name} isn't here.",
    'nounMiss.unseen': "You don't see that here.",
  },
};

const vocab = compileVocabulary(WORLD);

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

// ---------------------------------------------------------------------------
// ASK — topic matching by words
// ---------------------------------------------------------------------------

describe('respondToAsk — topic matching by words', () => {
  it('matches a topic whose words include the raw topic text', () => {
    const result = respondToAsk(WORLD, baseState(), vocab, GUIDE, 'brother');
    expect(lineText(result.events)).toBe('He looks away. "My brother is not a subject."');
    expect(diagCodes(result.events)).toEqual([]);
  });

  it('matches on any declared word, not just the first', () => {
    const result = respondToAsk(WORLD, baseState(), vocab, GUIDE, 'sibling');
    // TOPIC_BROTHER also declares "sibling" and is declared first — see ambiguous-match test below.
    expect(lineText(result.events)).toBe('He looks away. "My brother is not a subject."');
  });

  it('matches inside a multi-word raw topic phrase ("her brother")', () => {
    const result = respondToAsk(WORLD, baseState(), vocab, GUIDE, 'her brother');
    expect(lineText(result.events)).toBe('He looks away. "My brother is not a subject."');
  });

  it('runs the topic\'s effects (grantClue) alongside its response', () => {
    const result = respondToAsk(WORLD, baseState(), vocab, GUIDE, 'brother');
    expect(result.state.clues).toContain(CLUE_1);
  });

  it('ambiguous match: the first declared topic wins', () => {
    // Both TOPIC_BROTHER and TOPIC_SIBLING_DUPLICATE declare "sibling";
    // TOPIC_BROTHER is declared first in GUIDE.topics.
    const result = respondToAsk(WORLD, baseState(), vocab, GUIDE, 'sibling');
    expect(lineText(result.events)).not.toBe('This topic should never be reached; TOPIC_BROTHER is declared first.');
  });
});

// ---------------------------------------------------------------------------
// Knowledge gating — must not leak a gated topic's existence
// ---------------------------------------------------------------------------

describe('respondToAsk — knowledge gating', () => {
  it('a topic whose "when" is unmet falls to unknownTopic, with a topicMiss diag', () => {
    const result = respondToAsk(WORLD, baseState(), vocab, GUIDE, 'case');
    expect(lineText(result.events)).toBe("He shrugs. \"Can't help you there.\"");
    expect(diagCodes(result.events)).toEqual(['topicMiss']);
  });

  it('once the gate opens, the same topic word reaches its real response', () => {
    const state = baseState({ flags: { [FLAG_BOOL]: true } });
    const result = respondToAsk(WORLD, state, vocab, GUIDE, 'case');
    expect(lineText(result.events)).toBe('He tells you about the glass case.');
    expect(diagCodes(result.events)).toEqual([]);
  });

  it('a gated-off topic and a genuinely unauthored topic render identically', () => {
    const gated = respondToAsk(WORLD, baseState(), vocab, GUIDE, 'case');
    const unauthored = respondToAsk(WORLD, baseState(), vocab, GUIDE, 'weather');
    expect(lineText(gated.events)).toBe(lineText(unauthored.events));
    expect(diagCodes(gated.events)).toEqual(diagCodes(unauthored.events));
  });
});

// ---------------------------------------------------------------------------
// unknownTopic — authored per NPC, topicMiss diag
// ---------------------------------------------------------------------------

describe('respondToAsk — unknownTopic', () => {
  it('is authored per NPC: two NPCs with no matching topic say different things', () => {
    const jack = respondToAsk(WORLD, baseState(), vocab, JACK, 'anything');
    const mara = respondToAsk(WORLD, baseState(), vocab, MARA, 'anything');
    expect(lineText(jack.events)).toBe('Jack has nothing to say.');
    expect(lineText(mara.events)).toBe('Mara has nothing to add.');
  });

  it('an NPC with no topics at all always falls to unknownTopic', () => {
    const result = respondToAsk(WORLD, baseState(), vocab, JACK, 'brother');
    expect(lineText(result.events)).toBe('Jack has nothing to say.');
    expect(diagCodes(result.events)).toEqual(['topicMiss']);
  });

  it('rotates per-NPC, independent of other prose nodes (unknownTopic is a string[] rotation family)', () => {
    let state = baseState();
    const first = respondToAsk(WORLD, state, vocab, GUIDE, 'weather');
    state = first.state;
    const second = respondToAsk(WORLD, state, vocab, GUIDE, 'weather');
    expect(lineText(first.events)).toBe("He shrugs. \"Can't help you there.\"");
    expect(lineText(second.events)).toBe('He says nothing.');
  });
});

// ---------------------------------------------------------------------------
// TELL — same word matching, tellTopics vs. fallback to topics
// ---------------------------------------------------------------------------

describe('respondToTell', () => {
  it('falls back to "topics" when the NPC declares no "tellTopics"', () => {
    const result = respondToTell(WORLD, baseState(), vocab, GUIDE, 'brother');
    expect(lineText(result.events)).toBe('He looks away. "My brother is not a subject."');
  });

  it('uses "tellTopics" instead of "topics" when the NPC declares both', () => {
    const ask = respondToAsk(WORLD, baseState(), vocab, MARA, 'brother');
    const tell = respondToTell(WORLD, baseState(), vocab, MARA, 'brother');
    expect(lineText(ask.events)).toBe('Mara: ASK response.');
    expect(lineText(tell.events)).toBe('Mara: TELL response (tellTopics overrides topics).');
  });
});

// ---------------------------------------------------------------------------
// SHOW — object/'any' matching, gating, effects
// ---------------------------------------------------------------------------

describe('respondToShow', () => {
  it('matches a specific object and runs its effects', () => {
    const result = respondToShow(WORLD, baseState(), vocab, KEY, GUIDE);
    expect(result).not.toBeUndefined();
    expect(lineText(result!.events)).toBe('He recognizes the brass key immediately.');
    expect(result!.state.flags[FLAG_BOOL]).toBe(true);
  });

  it("'any' entry only matches when its own \"when\" holds", () => {
    // BOX isn't named in any specific-object entry — only the 'any' entry
    // (gated on FLAG_BOOL) could match it.
    const ungated = respondToShow(WORLD, baseState(), vocab, BOX, GUIDE);
    expect(ungated).toBeUndefined();

    const state = baseState({ flags: { [FLAG_BOOL]: true } });
    const gated = respondToShow(WORLD, state, vocab, BOX, GUIDE);
    expect(gated).not.toBeUndefined();
    expect(lineText(gated!.events)).toBe('He glances at it without much interest.');
  });

  it("a specific-object entry matches regardless of the 'any' entry's gate", () => {
    const result = respondToShow(WORLD, baseState(), vocab, KEY, GUIDE);
    expect(result).not.toBeUndefined();
    expect(lineText(result!.events)).toBe('He recognizes the brass key immediately.');
  });

  it('returns undefined when the NPC has no showResponses at all', () => {
    const result = respondToShow(WORLD, baseState(), vocab, KEY, JACK);
    expect(result).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// TALK TO / HELLO — greeting
// ---------------------------------------------------------------------------

describe('respondToGreeting', () => {
  it('renders the authored greeting', () => {
    const result = respondToGreeting(WORLD, baseState(), vocab, GUIDE);
    expect(result).not.toBeUndefined();
    expect(lineText(result!.events)).toBe('The guide nods at you.');
  });

  it('returns undefined when the NPC has no greeting authored', () => {
    const result = respondToGreeting(WORLD, baseState(), vocab, JACK);
    expect(result).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// respond.ts routing — end-to-end through the ladder
// ---------------------------------------------------------------------------

describe('respond() routes ASK/TELL/SHOW/TALK to npc.ts', () => {
  it('ASK <npc> ABOUT <topic> reaches respondToAsk', () => {
    const outcome: InterpretOutcome = { kind: 'actions', actions: [{ verb: NPC_VERB_IDS.ask, dobj: GUIDE, topic: 'brother', raw: 'ask guide about brother' }] };
    const result = respond(WORLD, baseState(), vocab, outcome);
    expect(lineText(result.events)).toBe('He looks away. "My brother is not a subject."');
  });

  it('TELL <npc> ABOUT <topic> reaches respondToTell', () => {
    const outcome: InterpretOutcome = { kind: 'actions', actions: [{ verb: NPC_VERB_IDS.tell, dobj: MARA, topic: 'brother', raw: 'tell mara about brother' }] };
    const result = respond(WORLD, baseState(), vocab, outcome);
    expect(lineText(result.events)).toBe('Mara: TELL response (tellTopics overrides topics).');
  });

  it('SHOW <object> TO <npc> reaches respondToShow', () => {
    const outcome: InterpretOutcome = { kind: 'actions', actions: [{ verb: NPC_VERB_IDS.show, dobj: KEY, prep: 'to', iobj: GUIDE, raw: 'show key to guide' }] };
    const result = respond(WORLD, baseState(), vocab, outcome);
    expect(lineText(result.events)).toBe('He recognizes the brass key immediately.');
  });

  it('SHOW with no showResponses match falls to a SHOW-specific rung-2 default, {name}=object, {iobj}=npc', () => {
    const outcome: InterpretOutcome = { kind: 'actions', actions: [{ verb: NPC_VERB_IDS.show, dobj: KEY, prep: 'to', iobj: JACK, raw: 'show key to jack' }] };
    const result = respond(WORLD, baseState(), vocab, outcome);
    expect(lineText(result.events)).toBe('Showing the brass key to jack accomplishes nothing.');
    expect(diagCodes(result.events)).toEqual(['defaultResponse']);
  });

  it('TALK TO <npc> with a greeting authored reaches respondToGreeting', () => {
    const outcome: InterpretOutcome = { kind: 'actions', actions: [{ verb: NPC_VERB_IDS.talk, dobj: GUIDE, raw: 'talk to guide' }] };
    const result = respond(WORLD, baseState(), vocab, outcome);
    expect(lineText(result.events)).toBe('The guide nods at you.');
    expect(diagCodes(result.events)).toEqual([]);
  });

  it('HELLO <npc> (same verb, "hello" surface form) also reaches the greeting', () => {
    const outcome: InterpretOutcome = { kind: 'actions', actions: [{ verb: NPC_VERB_IDS.talk, dobj: GUIDE, raw: 'hello guide' }] };
    const result = respond(WORLD, baseState(), vocab, outcome);
    expect(lineText(result.events)).toBe('The guide nods at you.');
  });

  it('TALK TO <npc> with no greeting authored falls through to the ordinary rung-2 default', () => {
    const outcome: InterpretOutcome = { kind: 'actions', actions: [{ verb: NPC_VERB_IDS.talk, dobj: JACK, raw: 'talk to jack' }] };
    const result = respond(WORLD, baseState(), vocab, outcome);
    expect(lineText(result.events)).toBe('jack has nothing to say to you right now.');
    expect(diagCodes(result.events)).toEqual(['defaultResponse']);
  });

  it('an ASK verb authored under a different id than NPC_VERB_IDS.ask gets no special routing (falls to ordinary rung 2)', () => {
    // FIXTURE_WORLD's own ASK verb (`fixture_ask`, imported indirectly via WORLD.verbs spread)
    // uses a different id than npc.ts's reserved NPC_VERB_IDS.ask.
    const outcome: InterpretOutcome = { kind: 'actions', actions: [{ verb: V('fixture_ask'), dobj: GUIDE, topic: 'brother', raw: 'ask guide about brother' }] };
    const result = respond(WORLD, baseState(), vocab, outcome);
    expect(diagCodes(result.events)).toEqual(['defaultResponse']);
    expect(lineText(result.events)).not.toContain('My brother is not a subject');
  });
});

// ---------------------------------------------------------------------------
// An NPC not present is a rung-3 noun miss, not a conversation
// ---------------------------------------------------------------------------

describe('an absent NPC never reaches npc.ts at all', () => {
  it('a "miss" outcome (npc not resolved because not in scope) never produces a topicMiss diag', () => {
    // Simulates what the interpreter itself would produce had GUIDE not been
    // in ScopeView.visible: no dobj resolved at all.
    const outcome: InterpretOutcome = { kind: 'miss', raw: 'ask guide about brother', verb: NPC_VERB_IDS.ask, knownNouns: [], reason: 'nounUnresolved' };
    const result = respond(WORLD, baseState(), vocab, outcome);
    expect(diagCodes(result.events)).not.toContain('topicMiss');
    expect(diagCodes(result.events)).toEqual(['nounMiss']);
  });
});

// ---------------------------------------------------------------------------
// compileVocabulary — the topicWords seam
// ---------------------------------------------------------------------------

describe('compileVocabulary — topicWords', () => {
  it('indexes every word of every topic (ASK + TELL) to its TopicId', () => {
    expect(vocab.topicWords.get('brother')).toContain(TOPIC_BROTHER);
    expect(vocab.topicWords.get('sibling')).toEqual(expect.arrayContaining([TOPIC_BROTHER, TOPIC_SIBLING_DUPLICATE]));
    expect(vocab.topicWords.get('case')).toEqual([TOPIC_GATED]);
    // TOPIC_TELL_ONLY only appears in MARA.tellTopics, not topics — still indexed.
    expect(vocab.topicWords.get('brother')).toContain(TOPIC_TELL_ONLY);
  });

  it('stays empty for a world with no NPC topics at all (the shared fixture)', () => {
    const fixtureVocab = compileVocabulary(FIXTURE_WORLD);
    expect(fixtureVocab.topicWords.size).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// validate.ts — the §8 task 14 rules
// ---------------------------------------------------------------------------

/** Task-14 conversation-related finding codes only — `WORLD` above deliberately keeps `fixture_ask` (a different verb id also claiming "ask") to exercise the "different id, no special routing" respond.ts test, which trips the *pre-existing* `verb-word-collision` rule unrelated to this task's own additions. */
const CONVERSATION_CODES = new Set(['npc-missing-unknown-topic', 'unknown-object-ref', 'effect-strands-plot-critical', 'prose-empty-rotation', 'prose-missing-fallback']);
function conversationFindings(world: WorldDef) {
  return validate(world).filter((f) => CONVERSATION_CODES.has(f.code));
}

describe('validate — npc conversation (§2.6, §8 task 14)', () => {
  it('the local fixture WORLD above has no conversation-related findings', () => {
    expect(conversationFindings(WORLD)).toEqual([]);
  });

  it('an NPC with topics but no unknownTopic is flagged', () => {
    const world: WorldDef = {
      ...WORLD,
      npcs: {
        ...WORLD.npcs,
        [JACK]: { ...WORLD.npcs![JACK]!, unknownTopic: undefined, topics: [{ id: T('fixture_topic_x'), words: ['x'], response: 'x' }] },
      },
    };
    const findings = validate(world);
    expect(findings.some((f) => f.code === 'npc-missing-unknown-topic')).toBe(true);
  });

  it('a showResponses entry naming an unknown object is flagged', () => {
    const world: WorldDef = {
      ...WORLD,
      npcs: {
        ...WORLD.npcs,
        [JACK]: {
          ...WORLD.npcs![JACK]!,
          showResponses: [{ objects: [V('fixture_no_such_object') as unknown as typeof KEY], response: 'never rendered' }],
        },
      },
    };
    const findings = validate(world);
    expect(findings.some((f) => f.code === 'unknown-object-ref')).toBe(true);
  });

  it("a topic effect that strands a plotCritical object ('nowhere') is flagged", () => {
    const world: WorldDef = {
      ...WORLD,
      npcs: {
        ...WORLD.npcs,
        [JACK]: {
          ...WORLD.npcs![JACK]!,
          topics: [{ id: T('fixture_topic_strand'), words: ['notebook'], response: 'Gone.', effects: [{ move: [NOTEBOOK, 'nowhere'] }] }],
        },
      },
    };
    const findings = validate(world);
    expect(findings.some((f) => f.code === 'effect-strands-plot-critical')).toBe(true);
  });

  it('a topic response with an empty rotation array is flagged', () => {
    const world: WorldDef = {
      ...WORLD,
      npcs: {
        ...WORLD.npcs,
        [JACK]: { ...WORLD.npcs![JACK]!, topics: [{ id: T('fixture_topic_empty'), words: ['x'], response: [] }] },
      },
    };
    const findings = validate(world);
    expect(findings.some((f) => f.code === 'prose-empty-rotation')).toBe(true);
  });
});

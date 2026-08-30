// tests/parser-grammar.test.ts — spec §3.1 (the seam), §3.2 (pipeline),
// §3.7 (forgiving-language checklist), §2.9 (`VerbDef`), §8 task 9.
//
// Scope: tokenizing, verb/pattern matching against `VerbDef.patterns`, and
// vocabulary compilation. Noun-phrase RESOLUTION against scope,
// disambiguation, and pronouns are task 10's — every `UnresolvedAction`
// assertion below checks the raw word span/adjective/noun split, never a
// resolved id. `ALL`/`AND`/`BUT`/`GO TO`/`AGAIN` are task 11's.

import { describe, expect, it } from 'vitest';
import { BUILTIN_VERB_IDS } from '../src/engine/actions';
import { N, O, V } from '../src/engine/ids';
import { DeterministicParser } from '../src/engine/interpreter';
import type { ScopeView } from '../src/engine/interpreter';
import { compileVocabulary } from '../src/engine/parser/vocabulary';
import { dropBaseNoise, normalizeInput, tokenize } from '../src/engine/parser/tokenize';
import { knownNounsIn, matchGrammar } from '../src/engine/parser/grammar';
import { validate } from '../src/engine/validate';
import type { WorldDef } from '../src/engine/world';
import {
  ASK,
  BREAK,
  CHEST,
  DOOR_KEY,
  FIXTURE_WORLD,
  GUIDE,
  HAT,
  KEY,
  LAMP,
  LOOK,
  ROOM_A,
  SMELL,
  SPARE_KEY,
  THROW,
} from './fixtures/world';

const vocab = compileVocabulary(FIXTURE_WORLD);

// ---------------------------------------------------------------------------
// Tokenizer / normalization
// ---------------------------------------------------------------------------

describe('tokenize — normalization (case, punctuation, articles, noise)', () => {
  it('lowercases, collapses whitespace, and strips trailing punctuation', () => {
    expect(normalizeInput('  Take   the KEY!!  ')).toBe('take the key');
  });

  it('straightens curly apostrophes', () => {
    expect(normalizeInput('don’t')).toBe("don't");
  });

  it('unwraps a fully-quoted line', () => {
    expect(normalizeInput('"take the key"')).toBe('take the key');
  });

  it('splits into word tokens', () => {
    expect(tokenize('take the brass key')).toEqual(['take', 'the', 'brass', 'key']);
  });

  it('returns an empty array for blank input', () => {
    expect(tokenize('   ')).toEqual([]);
  });

  it('dropBaseNoise removes articles and please/just, unconditionally', () => {
    expect(dropBaseNoise(['please', 'just', 'take', 'the', 'a', 'an', 'brass', 'key'])).toEqual([
      'take',
      'brass',
      'key',
    ]);
  });

  it('dropBaseNoise does NOT drop "at" — that is context-dependent, decided in grammar.ts', () => {
    expect(dropBaseNoise(['look', 'at', 'lamp'])).toEqual(['look', 'at', 'lamp']);
    expect(dropBaseNoise(['throw', 'chair', 'at', 'window'])).toEqual(['throw', 'chair', 'at', 'window']);
  });
});

// ---------------------------------------------------------------------------
// Vocabulary compiler
// ---------------------------------------------------------------------------

describe('compileVocabulary', () => {
  it('indexes object nouns and adjectives', () => {
    // 'key' is shared by KEY/DOOR_KEY/SPARE_KEY as of task 10's fixture
    // additions (disambiguation fixtures) — 'brass' still names only KEY.
    expect(vocab.objectNouns.get('key')).toEqual([KEY, DOOR_KEY, SPARE_KEY]);
    expect(vocab.objectAdjectives.get('brass')).toEqual([KEY]);
  });

  it('indexes NPC nouns', () => {
    expect(vocab.npcNouns.get('guide')).toEqual([GUIDE]);
  });

  it('indexes room names and aliases (lowercased)', () => {
    expect(vocab.roomAliases.get('room alpha')).toBe(ROOM_A);
    expect(vocab.roomAliases.get('fixture room alpha')).toBe(ROOM_A);
  });

  it('a noun shared by two objects lists both ids (not a collision — task 10 disambiguates)', () => {
    expect(vocab.objectAdjectives.get('wooden')).toEqual(expect.arrayContaining([expect.any(String)]));
    expect(vocab.objectAdjectives.get('wooden')!.length).toBe(2); // BOX and SHELF
  });

  it('compiles multi-word verb words as tokenized surface forms', () => {
    const turnOn = vocab.verbForms.filter((f) => f.id === BUILTIN_VERB_IDS.turnOn);
    expect(turnOn).toHaveLength(1);
    expect(turnOn[0]!.words).toEqual(['turn', 'on']);
  });

  it('sorts verb forms longest-word-count first (the longest-match invariant)', () => {
    for (let i = 1; i < vocab.verbForms.length; i++) {
      expect(vocab.verbForms[i - 1]!.words.length).toBeGreaterThanOrEqual(vocab.verbForms[i]!.words.length);
    }
  });

  it('topicWords is present but empty — no TopicDef data exists on WorldDef yet (tasks 13-14)', () => {
    expect(vocab.topicWords.size).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Pattern matching: multi-word verbs
// ---------------------------------------------------------------------------

describe('matchGrammar — multi-word verbs', () => {
  it('"turn on lamp" matches TURN_ON with dobj "lamp", not TURN with a stray "on"', () => {
    const result = matchGrammar(vocab, ['turn', 'on', 'lamp'], 'turn on lamp');
    expect(result).toEqual({
      kind: 'matched',
      action: {
        verb: BUILTIN_VERB_IDS.turnOn,
        pattern: 'V dobj',
        dobj: { words: ['lamp'], adjectives: [], noun: 'lamp' },
        raw: 'turn on lamp',
      },
    });
  });

  it('"turn off lamp" matches TURN_OFF, distinct from TURN_ON', () => {
    const result = matchGrammar(vocab, ['turn', 'off', 'lamp'], 'turn off lamp');
    expect(result.kind).toBe('matched');
    expect(result.kind === 'matched' && result.action.verb).toBe(BUILTIN_VERB_IDS.turnOff);
  });
});

// ---------------------------------------------------------------------------
// Pattern matching: V / V dobj / V dobj prep iobj / V npc about topic
// ---------------------------------------------------------------------------

describe('matchGrammar — patterns', () => {
  it('"wave" matches the bare V pattern with no noun phrases', () => {
    const result = matchGrammar(vocab, ['wave'], 'wave');
    expect(result).toEqual({ kind: 'matched', action: { verb: V('fixture_wave'), pattern: 'V', raw: 'wave' } });
  });

  it('"take key" matches V dobj, with dobj left unresolved (words/adjectives/noun split)', () => {
    const result = matchGrammar(vocab, ['take', 'brass', 'key'], 'take brass key');
    expect(result).toEqual({
      kind: 'matched',
      action: {
        verb: BUILTIN_VERB_IDS.take,
        pattern: 'V dobj',
        dobj: { words: ['brass', 'key'], adjectives: ['brass'], noun: 'key' },
        raw: 'take brass key',
      },
    });
  });

  it('"put key in chest" matches V dobj prep iobj with prep "in"', () => {
    const result = matchGrammar(vocab, ['put', 'key', 'in', 'chest'], 'put key in chest');
    expect(result).toEqual({
      kind: 'matched',
      action: {
        verb: BUILTIN_VERB_IDS.putIn,
        pattern: 'V dobj prep iobj',
        dobj: { words: ['key'], adjectives: [], noun: 'key' },
        prep: 'in',
        iobj: { words: ['chest'], adjectives: [], noun: 'chest' },
        raw: 'put key in chest',
      },
    });
  });

  it('"put hat on shelf" resolves to PUT_ON via the "on" preposition, even though PUT_IN also claims "put"', () => {
    const result = matchGrammar(vocab, ['put', 'hat', 'on', 'shelf'], 'put hat on shelf');
    expect(result.kind).toBe('matched');
    expect(result.kind === 'matched' && result.action.verb).toBe(BUILTIN_VERB_IDS.putOn);
    expect(result.kind === 'matched' && result.action.prep).toBe('on');
  });

  it('"ask guide about brother" matches V npc about topic, with npc unresolved and topic raw', () => {
    const result = matchGrammar(vocab, ['ask', 'guide', 'about', 'brother'], 'ask guide about brother');
    expect(result).toEqual({
      kind: 'matched',
      action: {
        verb: ASK,
        pattern: 'V npc about topic',
        npc: { words: ['guide'], adjectives: [], noun: 'guide' },
        topic: 'brother',
        raw: 'ask guide about brother',
      },
    });
  });

  it('multi-word topics stay joined as raw text, never resolved', () => {
    const result = matchGrammar(vocab, ['ask', 'guide', 'about', 'the', 'missing', 'page'], 'ask guide about the missing page');
    expect(result.kind === 'matched' && result.action.topic).toBe('the missing page');
  });

  it('a verb known but no pattern fits reports noPattern with the recognized verb', () => {
    // ASK requires "about"; without it, no pattern matches.
    const result = matchGrammar(vocab, ['ask', 'guide'], 'ask guide');
    expect(result).toEqual({ kind: 'noPattern', verb: ASK });
  });

  it('an entirely unknown verb word reports noVerb', () => {
    const result = matchGrammar(vocab, ['xyzzy', 'key'], 'xyzzy key');
    expect(result).toEqual({ kind: 'noVerb' });
  });
});

// ---------------------------------------------------------------------------
// Instruments / prepositions (§3.7)
// ---------------------------------------------------------------------------

describe('matchGrammar — instruments and prepositions (§3.7)', () => {
  it('"break window with chair" yields verb break, dobj window, prep with, iobj chair', () => {
    const result = matchGrammar(vocab, ['break', 'window', 'with', 'chair'], 'break window with chair');
    expect(result).toEqual({
      kind: 'matched',
      action: {
        verb: BREAK,
        pattern: 'V dobj prep iobj',
        dobj: { words: ['window'], adjectives: [], noun: 'window' },
        prep: 'with',
        iobj: { words: ['chair'], adjectives: [], noun: 'chair' },
        raw: 'break window with chair',
      },
    });
  });

  it('"throw chair at window" yields verb throw, dobj chair, prep at, iobj window', () => {
    const result = matchGrammar(vocab, ['throw', 'chair', 'at', 'window'], 'throw chair at window');
    expect(result).toEqual({
      kind: 'matched',
      action: {
        verb: THROW,
        pattern: 'V dobj prep iobj',
        dobj: { words: ['chair'], adjectives: [], noun: 'chair' },
        prep: 'at',
        iobj: { words: ['window'], adjectives: [], noun: 'window' },
        raw: 'throw chair at window',
      },
    });
  });

  it('"break window" alone (no instrument) still matches V dobj', () => {
    const result = matchGrammar(vocab, ['break', 'window'], 'break window');
    expect(result).toEqual({
      kind: 'matched',
      action: { verb: BREAK, pattern: 'V dobj', dobj: { words: ['window'], adjectives: [], noun: 'window' }, raw: 'break window' },
    });
  });
});

// ---------------------------------------------------------------------------
// Noise words: "at" is contextual, not universal
// ---------------------------------------------------------------------------

describe('matchGrammar — "at" as contextual noise vs. real preposition', () => {
  it('"look at lamp" drops "at" as noise for LOOK (no declared preps) and matches V dobj', () => {
    const tokens = dropBaseNoise(tokenize('look at lamp'));
    const result = matchGrammar(vocab, tokens, 'look at lamp');
    expect(result).toEqual({
      kind: 'matched',
      action: { verb: LOOK, pattern: 'V dobj', dobj: { words: ['lamp'], adjectives: [], noun: 'lamp' }, raw: 'look at lamp' },
    });
  });

  it('"throw chair at window" keeps "at" as THROW\'s declared preposition', () => {
    const tokens = dropBaseNoise(tokenize('throw chair at window'));
    expect(tokens).toEqual(['throw', 'chair', 'at', 'window']);
    const result = matchGrammar(vocab, tokens, 'throw chair at window');
    expect(result.kind === 'matched' && result.action.prep).toBe('at');
  });

  it('please/just/articles are dropped end to end through tokenize + dropBaseNoise', () => {
    const tokens = dropBaseNoise(tokenize('Please just take the brass key.'));
    expect(tokens).toEqual(['take', 'brass', 'key']);
    const result = matchGrammar(vocab, tokens, 'Please just take the brass key.');
    expect(result.kind === 'matched' && result.action.dobj).toEqual({
      words: ['brass', 'key'],
      adjectives: ['brass'],
      noun: 'key',
    });
  });
});

// ---------------------------------------------------------------------------
// knownNounsIn — the §3.6 rung 3/4 diagnostic signal
// ---------------------------------------------------------------------------

describe('knownNounsIn', () => {
  it('reports words that are known object/npc nouns or adjectives', () => {
    expect(knownNounsIn(vocab, ['smell', 'brass', 'gremlin'])).toEqual(['brass']);
  });

  it('returns an empty array when nothing is recognized', () => {
    expect(knownNounsIn(vocab, ['xyzzy', 'plugh'])).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Collision report (validate)
// ---------------------------------------------------------------------------

describe('validate — vocabulary collision report', () => {
  it('the fixture world (PUT_IN/PUT_ON sharing "put", safely disjoint by preposition) reports no collision finding', () => {
    const findings = validate(FIXTURE_WORLD).filter((f) => f.code.startsWith('verb-'));
    expect(findings).toEqual([]);
  });

  it('two verbs sharing a word with no distinguishing preposition is an ERROR', () => {
    const dup = V('fixture_dup_watch');
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      verbs: {
        ...FIXTURE_WORLD.verbs,
        [dup]: { id: dup, words: ['smell'], patterns: ['V dobj'], class: 'analytical', default: 'Nothing to report.' },
      },
    };
    const findings = validate(world).filter((f) => f.code === 'verb-word-collision');
    expect(findings).toHaveLength(1);
    expect(findings[0]!.severity).toBe('error');
    expect(findings[0]!.message).toContain('smell');
    expect(findings[0]!.message).toContain(SMELL);
    expect(findings[0]!.message).toContain(dup);
  });

  it('two verbs sharing a word, both requiring disjoint prepositions, produce no finding', () => {
    const other = V('fixture_stash');
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      verbs: {
        ...FIXTURE_WORLD.verbs,
        [other]: {
          id: other,
          words: ['throw'],
          patterns: ['V dobj prep iobj'],
          preps: ['into'],
          class: 'direct',
          default: 'Nowhere to throw that into.',
        },
      },
    };
    const findings = validate(world).filter((f) => f.code === 'verb-word-collision');
    expect(findings).toEqual([]);
  });

  it('a verb word colliding with an object noun/adjective is a WARNING, not an error', () => {
    const watchVerb = V('fixture_watch_verb');
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      objects: {
        ...FIXTURE_WORLD.objects,
        [O('fixture_watch')]: { location: ROOM_A, name: 'wristwatch', nouns: ['watch'] },
      },
      verbs: {
        ...FIXTURE_WORLD.verbs,
        [watchVerb]: { id: watchVerb, words: ['watch'], patterns: ['V dobj'], class: 'analytical', default: 'Nothing happens.' },
      },
    };
    const findings = validate(world).filter((f) => f.code === 'verb-noun-collision');
    expect(findings).toHaveLength(1);
    expect(findings[0]!.severity).toBe('warning');
    expect(findings[0]!.message).toContain('watch');
  });

  it('two objects sharing a noun with no distinguishing adjective is not reported at all', () => {
    // BOX and SHELF already both declare adjective "wooden" in the shared
    // fixture (zero findings there); this adds a second object sharing
    // KEY's bare noun "key" with no adjective at all — still not this
    // validator's concern (task 10's disambiguation handles it at
    // resolve-time, per the task brief).
    const world: WorldDef = {
      ...FIXTURE_WORLD,
      objects: {
        ...FIXTURE_WORLD.objects,
        [O('fixture_second_key')]: { location: ROOM_A, name: 'iron key', nouns: ['key'] },
      },
    };
    const findings = validate(world).filter((f) => f.code === 'verb-word-collision' || f.code === 'verb-noun-collision');
    expect(findings).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// DeterministicParser — the seam (§3.1). 'V'-pattern verbs resolve fully
// with no noun phrase to touch; a pattern with an unrecognized verb, or one
// whose noun phrase matches nothing in `view.visible`, reports a miss.
// Noun-phrase RESOLUTION itself (ranking, disambiguation, pronouns) is task
// 10's and is exercised in depth in `tests/parser-resolve.test.ts` — this
// file stays at the grammar/vocabulary layer.
// ---------------------------------------------------------------------------

describe('DeterministicParser — seam skeleton', () => {
  const parser = new DeterministicParser();

  // task 11 added `portable`/`location`/`travel` to `ScopeView` (ALL/GO TO,
  // §3.5) — unused by this file's grammar/vocabulary-layer tests, so empty
  // defaults keep this helper compiling without pulling multi-object/GO TO
  // concerns into a file that deliberately doesn't exercise them (see
  // `tests/parser-multi.test.ts` for those).
  function view(): ScopeView {
    return {
      vocabulary: vocab,
      visible: [KEY, LAMP, HAT, CHEST],
      parser: {},
      portable: new Set(),
      location: new Map(),
      travel: { current: ROOM_A, passable: new Map() },
    };
  }

  it('implements IntentInterpreter and fully resolves a no-object verb ("wave")', () => {
    const outcome = parser.interpret('wave', view());
    expect(outcome).toEqual({ kind: 'actions', actions: [{ verb: V('fixture_wave'), raw: 'wave' }] });
  });

  it('resolves a dobj-bearing pattern against `view.visible` (task 10; full disambiguation/pronoun coverage lives in tests/parser-resolve.test.ts)', () => {
    const outcome = parser.interpret('take the brass key', view());
    expect(outcome).toEqual({ kind: 'actions', actions: [{ verb: BUILTIN_VERB_IDS.take, dobj: KEY, raw: 'take the brass key' }] });
  });

  it('reports a miss with no verb for a totally unrecognized command, but still surfaces known nouns', () => {
    const outcome = parser.interpret('xyzzy the brass key', view());
    expect(outcome).toEqual({ kind: 'miss', raw: 'xyzzy the brass key', knownNouns: expect.arrayContaining(['brass', 'key']) });
    expect(outcome.kind === 'miss' && outcome.verb).toBeUndefined();
  });

  it('reports an empty-input miss with no known nouns', () => {
    expect(parser.interpret('   ', view())).toEqual({ kind: 'miss', raw: '   ', knownNouns: [] });
  });
});

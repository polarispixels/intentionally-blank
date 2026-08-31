// tests/parser-resolve.test.ts — spec §3.2 (noun-phrase resolution),
// §3.3 (disambiguation), §3.4 (pronouns), §1.2 (`ParserContext` in
// `GameState`), §8 task 10.
//
// Scope: resolving `UnresolvedNounPhrase` (task 9's seam) against
// `ScopeView.visible`, the disambiguation clarify/answer flow, and pronoun
// substitution. `ALL`/`AND`/`BUT`/`GO TO`/`AGAIN`/implicit-take are task
// 11's — nothing here exercises multi-object expansion.

import { describe, expect, it } from 'vitest';
import { BUILTIN_VERB_IDS } from '../src/engine/actions';
import { DeterministicParser, nextParserContext } from '../src/engine/interpreter';
import type { ScopeView } from '../src/engine/interpreter';
// Task 22 deleted the MVP's sibling `src/engine/parser.ts`, so the bare
// '../src/engine/parser' specifier now resolves to `parser/index.ts` (the
// barrel) instead of colliding with that file — no more need for the
// per-submodule imports task 9/10 used to work around it.
import { compileVocabulary, introduceIt, resolveNounPhrase } from '../src/engine/parser';
import type { UnresolvedNounPhrase } from '../src/engine/parser';
import { initialState } from '../src/engine/world';
import type { GameState } from '../src/engine/world';
import type { ObjectId, PlaceId } from '../src/engine/ids';
import {
  ASK,
  BOX,
  CHEST,
  DOOR_KEY,
  FIXTURE_WORLD,
  GUIDE,
  HAT,
  JACK,
  KEY,
  LOOK,
  MARA,
  METAL_BOX,
  RIVER,
  ROOM_A,
  SHELF,
  SPARE_KEY,
} from './fixtures/world';

const vocab = compileVocabulary(FIXTURE_WORLD);
const parser = new DeterministicParser();

/** Everything a real `scope()`-built `visible` list for ROOM_A would contain, plus every fixture NPC. */
const ALL_VISIBLE = [KEY, DOOR_KEY, SPARE_KEY, BOX, METAL_BOX, SHELF, CHEST, HAT, GUIDE, JACK, MARA, RIVER];

function phrase(words: string[]): UnresolvedNounPhrase {
  return { words, adjectives: words.slice(0, -1), noun: words[words.length - 1]! };
}

// task 11 added `portable`/`location`/`travel` to `ScopeView` (ALL/GO TO,
// §3.5) — unused by this file's resolution/disambiguation/pronoun tests, so
// empty defaults keep this helper compiling without pulling multi-object/GO
// TO concerns into a file that deliberately doesn't exercise them (see
// `tests/parser-multi.test.ts` for those).
function view(overrides: Partial<ScopeView> = {}): ScopeView {
  return {
    vocabulary: vocab,
    visible: ALL_VISIBLE,
    parser: {},
    portable: new Set(),
    location: new Map(),
    travel: { current: ROOM_A, passable: new Map() },
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// resolveNounPhrase — adjective ranking (§3.2)
// ---------------------------------------------------------------------------

describe('resolveNounPhrase — adjective ranking (§3.2)', () => {
  const visible = [KEY, DOOR_KEY, SPARE_KEY];

  it('a bare noun with several candidates is ambiguous', () => {
    expect(resolveNounPhrase(vocab, visible, phrase(['key']), 'either')).toEqual({
      kind: 'ambiguous',
      candidates: [KEY, DOOR_KEY, SPARE_KEY],
    });
  });

  it('a full adjective+noun match outranks the other bare-noun-only candidates', () => {
    expect(resolveNounPhrase(vocab, visible, phrase(['brass', 'key']), 'either')).toEqual({ kind: 'resolved', id: KEY });
    expect(resolveNounPhrase(vocab, visible, phrase(['door', 'key']), 'either')).toEqual({ kind: 'resolved', id: DOOR_KEY });
  });

  it('an adjective matching no candidate degrades gracefully back to the full bare-noun pool, not a hard failure', () => {
    expect(resolveNounPhrase(vocab, visible, phrase(['red', 'key']), 'either')).toEqual({
      kind: 'ambiguous',
      candidates: [KEY, DOOR_KEY, SPARE_KEY],
    });
  });

  it('zero noun matches at all is none', () => {
    expect(resolveNounPhrase(vocab, visible, phrase(['gremlin']), 'either')).toEqual({ kind: 'none' });
  });

  it('candidates outside `visible` never enter the pool, even when they would otherwise be the best adjective match', () => {
    // DOOR_KEY (the actual "door key") is out of scope here; only KEY and
    // SPARE_KEY are — neither matches adjective 'door', so this degrades to
    // the ambiguous bare-noun pool over exactly the in-scope candidates,
    // never reaching for the out-of-scope DOOR_KEY.
    expect(resolveNounPhrase(vocab, [KEY, SPARE_KEY], phrase(['door', 'key']), 'either')).toEqual({
      kind: 'ambiguous',
      candidates: [KEY, SPARE_KEY],
    });
  });
});

// ---------------------------------------------------------------------------
// resolveNounPhrase — held objects win bare-noun ties (§3.2, wave 3)
// ---------------------------------------------------------------------------

describe('resolveNounPhrase — a held object wins a bare-noun tie against room objects (§3.2)', () => {
  const visible = [KEY, DOOR_KEY, SPARE_KEY];
  const holdingKey = new Map<ObjectId, PlaceId>([
    [KEY, 'inventory'],
    [DOOR_KEY, ROOM_A],
    [SPARE_KEY, ROOM_A],
  ]);

  it('a bare noun tying between one held object and room objects resolves to the held one', () => {
    // Wave 3's mug: once the diner's mug is in hand, "show mug to pearl"
    // must reach the carried mug, not ask "the shelf or the mug?". Same
    // shape as the store's string/twine and Ryan's original key/key-rack bug.
    expect(resolveNounPhrase(vocab, visible, phrase(['key']), 'either', holdingKey)).toEqual({ kind: 'resolved', id: KEY });
  });

  it('a worn object counts as held', () => {
    const wearingKey = new Map(holdingKey);
    wearingKey.set(KEY, 'worn');
    expect(resolveNounPhrase(vocab, visible, phrase(['key']), 'either', wearingKey)).toEqual({ kind: 'resolved', id: KEY });
  });

  it('adjectives still rank first: a full adjective+noun match on a room object beats a held bare-noun match', () => {
    expect(resolveNounPhrase(vocab, visible, phrase(['door', 'key']), 'either', holdingKey)).toEqual({ kind: 'resolved', id: DOOR_KEY });
  });

  it('several held candidates stay ambiguous, narrowed to the held ones', () => {
    const holdingTwo = new Map(holdingKey);
    holdingTwo.set(SPARE_KEY, 'inventory');
    expect(resolveNounPhrase(vocab, visible, phrase(['key']), 'either', holdingTwo)).toEqual({
      kind: 'ambiguous',
      candidates: [KEY, SPARE_KEY],
    });
  });

  it('with nothing held (or no location map at all) the bare-noun pool is unchanged', () => {
    const nothingHeld = new Map<ObjectId, PlaceId>([[KEY, ROOM_A], [DOOR_KEY, ROOM_A], [SPARE_KEY, ROOM_A]]);
    expect(resolveNounPhrase(vocab, visible, phrase(['key']), 'either', nothingHeld)).toEqual({
      kind: 'ambiguous',
      candidates: [KEY, DOOR_KEY, SPARE_KEY],
    });
    expect(resolveNounPhrase(vocab, visible, phrase(['key']), 'either')).toEqual({
      kind: 'ambiguous',
      candidates: [KEY, DOOR_KEY, SPARE_KEY],
    });
  });

  it('end to end: the parser passes the scope view\'s locations through, so "take key" while holding the brass key resolves without a clarify', () => {
    expect(parser.interpret('take key', view({ location: holdingKey }))).toEqual({
      kind: 'actions',
      actions: [{ verb: BUILTIN_VERB_IDS.take, dobj: KEY, raw: 'take key' }],
    });
  });
});

// ---------------------------------------------------------------------------
// DeterministicParser.interpret — resolution end to end
// ---------------------------------------------------------------------------

describe('DeterministicParser — noun-phrase resolution', () => {
  it('a unique noun match resolves to a single StructuredAction', () => {
    expect(parser.interpret('take door key', view())).toEqual({
      kind: 'actions',
      actions: [{ verb: BUILTIN_VERB_IDS.take, dobj: DOOR_KEY, raw: 'take door key' }],
    });
  });

  it('zero matches in scope is a miss carrying the recognized verb', () => {
    const outcome = parser.interpret('take gremlin', view());
    expect(outcome.kind).toBe('miss');
    expect(outcome.kind === 'miss' && outcome.verb).toBe(BUILTIN_VERB_IDS.take);
  });

  it('several matches is a clarify, with a synthesized question and options', () => {
    const outcome = parser.interpret('take key', view());
    expect(outcome.kind).toBe('clarify');
    if (outcome.kind !== 'clarify') throw new Error('expected clarify');
    expect(outcome.options).toEqual(['brass key', 'door key', 'spare key']);
    expect(outcome.question).toBe('Which do you mean, the brass key, the door key, or the spare key?');
    expect(outcome.pending).toEqual({
      verb: BUILTIN_VERB_IDS.take,
      slot: 'dobj',
      candidates: [KEY, DOOR_KEY, SPARE_KEY],
      partial: { verb: BUILTIN_VERB_IDS.take, raw: 'take key' },
    });
  });

  it('"V dobj prep iobj": an ambiguous iobj clarifies on the iobj slot, with dobj already resolved into partial', () => {
    const outcome = parser.interpret('lock chest with key', view());
    expect(outcome.kind).toBe('clarify');
    if (outcome.kind !== 'clarify') throw new Error('expected clarify');
    expect(outcome.pending).toEqual({
      verb: BUILTIN_VERB_IDS.lock,
      slot: 'iobj',
      candidates: [KEY, DOOR_KEY, SPARE_KEY],
      partial: { verb: BUILTIN_VERB_IDS.lock, dobj: CHEST, prep: 'with', raw: 'lock chest with key' },
    });
  });

  it('"V npc about topic": the npc phrase resolves into the final dobj field (StructuredAction has no separate npc field)', () => {
    expect(parser.interpret('ask guide about brother', view())).toEqual({
      kind: 'actions',
      actions: [{ verb: ASK, dobj: GUIDE, topic: 'brother', raw: 'ask guide about brother' }],
    });
  });
});

// ---------------------------------------------------------------------------
// Disambiguation — the three-way next-input flow (§3.3)
// ---------------------------------------------------------------------------

describe('disambiguation — answer / fresh-command / re-ask-once (§3.3)', () => {
  it('answer path: an unambiguous adjective answer completes the original action, preserving its raw text', () => {
    const clarify = parser.interpret('take key', view());
    if (clarify.kind !== 'clarify') throw new Error('expected clarify');

    const answered = parser.interpret('brass', view({ parser: { pending: clarify.pending! } }));
    expect(answered).toEqual({
      kind: 'actions',
      actions: [{ verb: BUILTIN_VERB_IDS.take, dobj: KEY, raw: 'take key' }],
    });
  });

  it('answer path: an ordinal answer ("the first one") selects by position', () => {
    const clarify = parser.interpret('take key', view());
    if (clarify.kind !== 'clarify') throw new Error('expected clarify');

    const first = parser.interpret('the first one', view({ parser: { pending: clarify.pending! } }));
    expect(first).toEqual({ kind: 'actions', actions: [{ verb: BUILTIN_VERB_IDS.take, dobj: KEY, raw: 'take key' }] });

    const second = parser.interpret('second', view({ parser: { pending: clarify.pending! } }));
    expect(second).toEqual({ kind: 'actions', actions: [{ verb: BUILTIN_VERB_IDS.take, dobj: DOOR_KEY, raw: 'take key' }] });
  });

  it('fresh-command path: an input matching none of the candidates is parsed as a new command, silently dropping the question', () => {
    const clarify = parser.interpret('take key', view());
    if (clarify.kind !== 'clarify') throw new Error('expected clarify');

    const pendingView = view({ parser: { pending: clarify.pending! } });
    const outcome = parser.interpret('look', pendingView);
    expect(outcome).toEqual({ kind: 'actions', actions: [{ verb: LOOK, raw: 'look' }] });

    // Confirmed dropped, not merely ignored: the next parser context carries no pending forward.
    const next = nextParserContext(pendingView.parser, outcome, vocab);
    expect(next.pending).toBeUndefined();
  });

  it('re-ask-once: an ambiguous answer re-asks with the narrowed pool, marked so a second ambiguous answer gives up rather than asking again', () => {
    const clarify = parser.interpret('take key', view());
    if (clarify.kind !== 'clarify') throw new Error('expected clarify');
    expect(clarify.pending?.reask).toBeUndefined();

    // "key" alone matches all three candidates again — an ambiguous answer.
    const reasked = parser.interpret('key', view({ parser: { pending: clarify.pending! } }));
    expect(reasked.kind).toBe('clarify');
    if (reasked.kind !== 'clarify') throw new Error('expected clarify');
    expect(reasked.pending?.reask).toBe(true);
    expect(reasked.pending?.candidates).toEqual([KEY, DOOR_KEY, SPARE_KEY]);
    // The re-ask's own wording differs from the first ask (numbered, not a
    // repeat) — a plain word answer already failed to distinguish these
    // once, so it asks for a number instead.
    expect(reasked.question).toBe('Which do you mean — 1) the brass key, 2) the door key, 3) the spare key? Say the number.');

    // A second ambiguous answer in a row never nests into a third question:
    // there is no word that could ever disambiguate these three (a content
    // bug — `validate`'s noun-collision rule flags it), so the parser gives
    // up and resolves to the first candidate rather than asking again.
    const gaveUp = parser.interpret('key', view({ parser: { pending: reasked.pending! } }));
    expect(gaveUp).toEqual({ kind: 'actions', actions: [{ verb: BUILTIN_VERB_IDS.take, dobj: KEY, raw: 'take key' }] });
  });

  it('the never-nests give-up also applies when the repeat arrives as a retyped command, not a bare answer (Ryan\'s playtest: "pick up spare key" / "the key" / "pick up the key" looped forever because a full reformulation reset the re-ask counter to a fresh first ask every time)', () => {
    const clarify = parser.interpret('take key', view());
    if (clarify.kind !== 'clarify') throw new Error('expected clarify');

    // A bare bad word ("with") isn't recognized as an answer at all, so it
    // is dropped and reparsed fresh — but "take key" is retyped in full,
    // landing on the exact same ambiguity, which must still count as the
    // re-ask, not a brand-new first ask.
    const retried = parser.interpret('take key', view({ parser: { pending: clarify.pending! } }));
    expect(retried.kind).toBe('clarify');
    if (retried.kind !== 'clarify') throw new Error('expected clarify');
    expect(retried.pending?.reask).toBe(true);

    // Retyped a third time: no further exit through asking — give up.
    const gaveUp = parser.interpret('take key', view({ parser: { pending: retried.pending! } }));
    expect(gaveUp).toEqual({ kind: 'actions', actions: [{ verb: BUILTIN_VERB_IDS.take, dobj: KEY, raw: 'take key' }] });
  });

  it('re-ask-once: a unique answer to the re-ask still resolves normally', () => {
    const clarify = parser.interpret('take key', view());
    if (clarify.kind !== 'clarify') throw new Error('expected clarify');
    const reasked = parser.interpret('key', view({ parser: { pending: clarify.pending! } }));
    if (reasked.kind !== 'clarify') throw new Error('expected clarify');

    const answered = parser.interpret('door', view({ parser: { pending: reasked.pending! } }));
    expect(answered).toEqual({ kind: 'actions', actions: [{ verb: BUILTIN_VERB_IDS.take, dobj: DOOR_KEY, raw: 'take key' }] });
  });
});

// ---------------------------------------------------------------------------
// Simultaneous dobj+iobj ambiguity — sequential clarification, never a
// silent best guess on the second slot (fixed in review: constitution §9).
// "put key in box" has three ambiguous keys AND two ambiguous boxes.
// ---------------------------------------------------------------------------

describe('disambiguation — simultaneous dobj+iobj ambiguity clarifies sequentially', () => {
  it('clarifies dobj first, without ever resolving or guessing at iobj', () => {
    const outcome = parser.interpret('put key in box', view());
    expect(outcome.kind).toBe('clarify');
    if (outcome.kind !== 'clarify') throw new Error('expected clarify');
    expect(outcome.pending).toEqual({
      verb: BUILTIN_VERB_IDS.putIn,
      slot: 'dobj',
      candidates: [KEY, DOOR_KEY, SPARE_KEY],
      partial: { verb: BUILTIN_VERB_IDS.putIn, prep: 'in', raw: 'put key in box' },
      deferredIobj: { words: ['box'], adjectives: [], noun: 'box' },
    });
  });

  it('answering dobj raises a second, independent clarify for the still-ambiguous iobj', () => {
    const first = parser.interpret('put key in box', view());
    if (first.kind !== 'clarify') throw new Error('expected clarify');

    const second = parser.interpret('brass', view({ parser: { pending: first.pending! } }));
    expect(second.kind).toBe('clarify');
    if (second.kind !== 'clarify') throw new Error('expected a second clarify, not a guess');
    expect(second.pending).toEqual({
      verb: BUILTIN_VERB_IDS.putIn,
      slot: 'iobj',
      candidates: [BOX, METAL_BOX],
      partial: { verb: BUILTIN_VERB_IDS.putIn, prep: 'in', raw: 'put key in box', dobj: KEY },
    });
  });

  it('answering both in turn completes the action, with the dobj the player actually meant', () => {
    const first = parser.interpret('put key in box', view());
    if (first.kind !== 'clarify') throw new Error('expected clarify');
    const second = parser.interpret('brass', view({ parser: { pending: first.pending! } }));
    if (second.kind !== 'clarify') throw new Error('expected a second clarify');

    const third = parser.interpret('metal', view({ parser: { pending: second.pending! } }));
    expect(third).toEqual({
      kind: 'actions',
      actions: [{ verb: BUILTIN_VERB_IDS.putIn, dobj: KEY, prep: 'in', iobj: METAL_BOX, raw: 'put key in box' }],
    });
  });

  it('a fresh command mid-sequence (answering dobj) drops the whole pending chain, including the deferred iobj — no stranded half-action', () => {
    const first = parser.interpret('put key in box', view());
    if (first.kind !== 'clarify') throw new Error('expected clarify');

    const pendingView = view({ parser: { pending: first.pending! } });
    const outcome = parser.interpret('look', pendingView);
    expect(outcome).toEqual({ kind: 'actions', actions: [{ verb: LOOK, raw: 'look' }] });

    const next = nextParserContext(pendingView.parser, outcome, vocab);
    expect(next.pending).toBeUndefined();
  });

  it('a fresh command mid-sequence (answering iobj, the second clarify) also drops cleanly', () => {
    const first = parser.interpret('put key in box', view());
    if (first.kind !== 'clarify') throw new Error('expected clarify');
    const second = parser.interpret('brass', view({ parser: { pending: first.pending! } }));
    if (second.kind !== 'clarify') throw new Error('expected a second clarify');

    const pendingView = view({ parser: { pending: second.pending! } });
    const outcome = parser.interpret('look', pendingView);
    expect(outcome).toEqual({ kind: 'actions', actions: [{ verb: LOOK, raw: 'look' }] });

    const next = nextParserContext(pendingView.parser, outcome, vocab);
    expect(next.pending).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Pronouns (§3.4)
// ---------------------------------------------------------------------------

describe('pronouns — it', () => {
  it('has no antecedent and no scope fallback: an unset "it" is a miss', () => {
    const outcome = parser.interpret('take it', view());
    expect(outcome.kind).toBe('miss');
  });

  it('resolves to the last single object referred to, via nextParserContext', () => {
    const outcome = parser.interpret('take brass key', view());
    const next = nextParserContext({}, outcome, vocab);
    expect(next.it).toBe(KEY);

    const followUp = parser.interpret('take it', view({ visible: [], parser: next }));
    expect(followUp).toEqual({ kind: 'actions', actions: [{ verb: BUILTIN_VERB_IDS.take, dobj: KEY, raw: 'take it' }] });
  });

  it('resolves a stored antecedent with no scope check at all — proven with an empty `visible`', () => {
    const outcome = parser.interpret('take it', view({ visible: [], parser: { it: DOOR_KEY } }));
    expect(outcome).toEqual({ kind: 'actions', actions: [{ verb: BUILTIN_VERB_IDS.take, dobj: DOOR_KEY, raw: 'take it' }] });
  });
});

describe('pronouns — him/her, gender-aware via NpcDefSlice.pronoun (§2.6/§3.4)', () => {
  it('falls back to the sole he-pronoun NPC in the room, even with a she-pronoun NPC also present', () => {
    const outcome = parser.interpret('ask him about brother', view({ visible: [JACK, MARA] }));
    expect(outcome).toEqual({ kind: 'actions', actions: [{ verb: ASK, dobj: JACK, topic: 'brother', raw: 'ask him about brother' }] });
  });

  it('falls back to the sole she-pronoun NPC in the room, even with a he-pronoun NPC also present', () => {
    const outcome = parser.interpret('ask her about brother', view({ visible: [JACK, MARA] }));
    expect(outcome).toEqual({ kind: 'actions', actions: [{ verb: ASK, dobj: MARA, topic: 'brother', raw: 'ask her about brother' }] });
  });

  it('an NPC with no declared pronoun never satisfies the fallback', () => {
    expect(parser.interpret('ask him about brother', view({ visible: [GUIDE] })).kind).toBe('miss');
    expect(parser.interpret('ask her about brother', view({ visible: [GUIDE] })).kind).toBe('miss');
  });

  it('has no fallback when zero, or more than one, matching-pronoun NPC is in scope', () => {
    expect(parser.interpret('ask him about brother', view({ visible: [] })).kind).toBe('miss');
    // two he-pronoun NPCs would also be ambiguous for a real fallback, but
    // the fixture only has one of each — covered instead by construction
    // above (the *other* pronoun's presence doesn't interfere).
  });

  it("referring to Jack (he) updates only `him`, never `her` — the concrete bug this fix closes", () => {
    const outcome = parser.interpret('ask jack about the notebook', view());
    const next = nextParserContext({}, outcome, vocab);
    expect(next.him).toBe(JACK);
    expect(next.her).toBeUndefined();
  });

  it('referring to Mara (she) afterward updates only `her`, leaving `him` (Jack) untouched', () => {
    const afterJack = nextParserContext({}, parser.interpret('ask jack about the notebook', view()), vocab);
    const afterMara = nextParserContext(afterJack, parser.interpret('ask mara about the notebook', view()), vocab);
    expect(afterMara.him).toBe(JACK);
    expect(afterMara.her).toBe(MARA);

    // "ask her about the notebook" must resolve to Mara, never Jack.
    const askHer = parser.interpret('ask her about the notebook', view({ parser: afterMara }));
    expect(askHer).toEqual({ kind: 'actions', actions: [{ verb: ASK, dobj: MARA, topic: 'notebook', raw: 'ask her about the notebook' }] });
  });

  it('a stored antecedent resolves without re-checking scope, same as "it"', () => {
    const outcome = parser.interpret('ask her about brother', view({ visible: [], parser: { her: MARA } }));
    expect(outcome).toEqual({ kind: 'actions', actions: [{ verb: ASK, dobj: MARA, topic: 'brother', raw: 'ask her about brother' }] });
  });
});

describe('pronouns — them (§3.4)', () => {
  it('falls back to the sole they-pronoun NPC in the room', () => {
    const outcome = parser.interpret('ask them about brother', view({ visible: [RIVER, JACK, MARA] }));
    expect(outcome).toEqual({ kind: 'actions', actions: [{ verb: ASK, dobj: RIVER, topic: 'brother', raw: 'ask them about brother' }] });
  });

  it('resolves a stored they-pronoun NPC antecedent, with no scope check', () => {
    const outcome = parser.interpret('ask them about brother', view({ visible: [], parser: { them: RIVER } }));
    expect(outcome).toEqual({ kind: 'actions', actions: [{ verb: ASK, dobj: RIVER, topic: 'brother', raw: 'ask them about brother' }] });
  });

  it('referring to River (they) updates `them`, not `him`/`her`', () => {
    const outcome = parser.interpret('ask river about the notebook', view());
    const next = nextParserContext({}, outcome, vocab);
    expect(next.them).toBe(RIVER);
    expect(next.him).toBeUndefined();
    expect(next.her).toBeUndefined();
  });

  it('a stored plural object set cannot fill a singular slot — multi-object expansion is task 11 territory, not this one', () => {
    expect(parser.interpret('ask them about brother', view({ visible: [], parser: { them: [KEY, DOOR_KEY] } })).kind).toBe('miss');
  });

  it('with no antecedent and no they-pronoun NPC in scope, "them" resolves to nothing', () => {
    expect(parser.interpret('ask them about brother', view({ visible: [] })).kind).toBe('miss');
    expect(parser.interpret('ask them about brother', view({ visible: [JACK, MARA] })).kind).toBe('miss');
  });
});

describe('introduceIt — the conspicuous-introduction hook (§3.4), for a future handler to call', () => {
  it('sets `it` directly, independent of any resolved dobj/iobj this turn', () => {
    expect(introduceIt({ it: KEY }, DOOR_KEY)).toEqual({ it: DOOR_KEY });
  });
});

// ---------------------------------------------------------------------------
// ParserContext in GameState (§1.2) — save/load exactness
// ---------------------------------------------------------------------------

describe('ParserContext wired into GameState (§1.2)', () => {
  it('initialState seeds an empty ParserContext', () => {
    expect(initialState(FIXTURE_WORLD).parser).toEqual({});
  });

  it('a pronoun antecedent survives a JSON save/load round trip and still resolves to the same object (named acceptance criterion)', () => {
    const state = initialState(FIXTURE_WORLD);

    const outcome = parser.interpret('take brass key', view({ parser: state.parser }));
    const parserAfterTurn = nextParserContext(state.parser, outcome, vocab);
    const stateAfterTurn: GameState = { ...state, parser: parserAfterTurn };

    const roundTripped = JSON.parse(JSON.stringify(stateAfterTurn)) as GameState;
    expect(roundTripped.parser.it).toBe(KEY);

    const followUp = parser.interpret('take it', view({ visible: [], parser: roundTripped.parser }));
    expect(followUp).toEqual({ kind: 'actions', actions: [{ verb: BUILTIN_VERB_IDS.take, dobj: KEY, raw: 'take it' }] });
  });
});

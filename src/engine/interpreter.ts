// The `IntentInterpreter` seam (spec §3.1, ADR 0004). Player input goes in,
// `InterpretOutcome` comes out; the engine downstream of `step()` never
// sees raw text again — only `StructuredAction`s. `DeterministicParser` is
// v1's only implementation. A future AI adapter (`LocalLLMAdapter` /
// `RemoteLLMAdapter`, named in spec §3.1 as future slots) would implement
// this same interface and could therefore only ever change *which*
// `InterpretOutcome` it produces for a given input — never engine
// semantics, since the engine only ever consumes the outcome shape.
//
// SCOPE:
//   task 9  — tokenizing, verb/pattern matching, vocabulary compilation
//             (`./parser/`). Left every dobj/iobj/npc-bearing pattern as a
//             `miss`, since resolving a noun phrase against scope wasn't
//             its job.
//   task 10 (this one) — noun-phrase resolution against `ScopeView.visible`
//             (`./parser/resolver.ts`), disambiguation and its three-way
//             next-input flow (§3.3), and pronouns (§3.4, `./parser/
//             pronouns.ts`). `parser: ParserContext` is wired onto
//             `GameState` (`gamestate.ts`) here too — task 9's header named
//             this as the first task that needs `pending`/`last` to
//             persist turn-to-turn.
//   task 11 — `ALL`/`AND`/`BUT`/`GO TO`/`AGAIN` and implicit-take
//             (§3.5) — still not this module's job; every pattern below
//             resolves exactly one dobj/iobj/npc, never a multi-object
//             expansion.

import type { NpcId, ObjectId, VerbId } from './ids';
import type { CompiledVocabulary } from './parser/vocabulary';
import { dropBaseNoise, tokenize } from './parser/tokenize';
import { knownNounsIn, matchGrammar } from './parser/grammar';
import type { UnresolvedAction, UnresolvedNounPhrase } from './parser/grammar';
import type { ResolveResult } from './parser/resolver';
import { candidateName, isNpcId, joinWithOr, knownWordsFor, resolveNounPhrase } from './parser/resolver';
import { resolvePronoun } from './parser/pronouns';

/** §3.1's `StructuredAction` — the only shape the engine sees past this seam. */
export interface StructuredAction {
  verb: VerbId;
  dobj?: ObjectId | NpcId;
  prep?: string;
  iobj?: ObjectId | NpcId;
  /** ASK/TELL, raw topic words — never resolved (§3.1). */
  topic?: string;
  /** SAY …, single-field free text. */
  text?: string;
  /** respondToPrompt: all prompt-field values by name. */
  values?: Record<string, string>;
  /** The input line, for echo and history. */
  raw: string;
}

/** §3.3/§3.4's pronoun antecedents and outstanding disambiguation question. */
export interface ParserContext {
  it?: ObjectId;
  him?: NpcId;
  her?: NpcId;
  them?: ObjectId[] | NpcId;
  /**
   * Outstanding "Which do you mean…?" question (§3.3). `reask` is a task-10
   * addition beyond §1.2's literal shape (an optional field, so every
   * existing/serialized `pending` without it still satisfies the type): it
   * marks a `pending` that is *itself* already a re-ask, so a second
   * ambiguous answer in a row gives up gracefully instead of asking a
   * third time ("never nests").
   */
  pending?: {
    verb: VerbId;
    slot: 'dobj' | 'iobj';
    candidates: (ObjectId | NpcId)[];
    partial: Partial<StructuredAction>;
    reask?: boolean;
    /**
     * A `'V dobj prep iobj'` pattern's iobj phrase, deferred whenever `dobj`
     * itself was ambiguous — fixed in review: resolving iobj eagerly and
     * best-guessing its first candidate if it too turned out ambiguous
     * risked silently acting on an object the player didn't mean
     * (constitution §9). `dobj` always clarifies first; once it's answered,
     * `finalizePending` resolves this phrase for real, which can itself
     * raise a second, independent clarify for `iobj` rather than guessing.
     */
    deferredIobj?: UnresolvedNounPhrase;
  };
  /** For AGAIN / G (task 11). */
  last?: StructuredAction;
}

/** Read-only view of the world the interpreter needs to resolve input — built by the engine, never mutated here. */
export interface ScopeView {
  vocabulary: CompiledVocabulary;
  visible: (ObjectId | NpcId)[];
  parser: ParserContext;
}

export type InterpretOutcome =
  | { kind: 'actions'; actions: StructuredAction[] } // TAKE ALL → many (task 11)
  | { kind: 'clarify'; question: string; options: string[]; pending: ParserContext['pending'] }
  | { kind: 'miss'; raw: string; verb?: VerbId; knownNouns: string[] };

export interface IntentInterpreter {
  /**
   * Future adapters (`LocalLLMAdapter`, `RemoteLLMAdapter` — spec §3.1)
   * would implement this same interface. v1 ships `DeterministicParser`
   * only (ADR 0004).
   */
  interpret(input: string, view: ScopeView): InterpretOutcome;
}

/**
 * Pure derivation of the *next* `ParserContext` from the previous one and
 * the `InterpretOutcome` `interpret()` just produced (see `./parser/
 * pronouns.ts`'s header for why this lives outside `interpret()` itself).
 * The caller — whichever future task wires the new parser into `step()` —
 * stores the result into `state.parser`.
 *
 * - `clarify` → `pending` becomes the new question; every antecedent
 *   (`it`/`him`/`her`/`them`) and `last` carry forward unchanged (no action
 *   ran this turn).
 * - `miss` → nothing changes. In particular `pending` is *not* preserved
 *   from `prev` here — but that's fine: whenever a fresh command silently
 *   drops a pending question (§3.3), the resulting outcome is itself either
 *   a fresh `clarify` (new `pending,` handled above) or `actions`/`miss`
 *   (both of which correctly want `pending` gone). A `miss` while no
 *   `pending` was ever active is the same no-op.
 * - `actions` → `last` becomes the (first, for a multi-action outcome —
 *   task 11's `ALL`/`AND` territory) action; each resolved `dobj`/`iobj`
 *   updates `it` (an `ObjectId`) or, for an `NpcId`, whichever of
 *   `him`/`her`/`them` matches that NPC's declared `NpcDefSlice.pronoun`
 *   (`vocab.npcPronouns`) — an NPC with no declared pronoun updates none of
 *   them, rather than guessing. Referring to one NPC therefore never
 *   clobbers a differently-pronouned NPC's antecedent. `pending` clears.
 */
export function nextParserContext(prev: ParserContext, outcome: InterpretOutcome, vocab: CompiledVocabulary): ParserContext {
  // `delete`, not `pending: undefined`, throughout — `exactOptionalPropertyTypes`
  // treats those differently, and "absent" is what "no outstanding question" means.
  if (outcome.kind === 'clarify') {
    const next: ParserContext = { ...prev };
    if (outcome.pending !== undefined) next.pending = outcome.pending;
    else delete next.pending;
    return next;
  }
  if (outcome.kind === 'miss') {
    const next: ParserContext = { ...prev };
    delete next.pending;
    return next;
  }

  const next: ParserContext = { ...prev };
  delete next.pending;
  for (const action of outcome.actions) {
    for (const ref of [action.dobj, action.iobj]) {
      if (ref === undefined) continue;
      if (isNpcId(vocab, ref)) {
        const pronoun = vocab.npcPronouns.get(ref);
        if (pronoun === 'he') next.him = ref;
        else if (pronoun === 'she') next.her = ref;
        else if (pronoun === 'they') next.them = ref;
        // No declared pronoun: no antecedent update — see doc comment above.
      } else {
        next.it = ref;
      }
    }
  }
  if (outcome.actions[0] !== undefined) next.last = outcome.actions[0];
  return next;
}

// ---------------------------------------------------------------------------
// Disambiguation-answer matching (§3.3's three-way next-input flow)
// ---------------------------------------------------------------------------

type AnswerResult =
  | { kind: 'resolved'; id: ObjectId | NpcId }
  | { kind: 'ambiguous'; candidates: (ObjectId | NpcId)[] }
  | { kind: 'none' };

/** "first"/"1st"/"1" → 0, etc. Deliberately excludes word-numbers ("one","two"…) — "the first one" would otherwise collide "one" (filler) with "one" (ordinal 1). */
const ORDINALS: Record<string, number> = {
  first: 0, second: 1, third: 2, fourth: 3, fifth: 4,
  '1st': 0, '2nd': 1, '3rd': 2, '4th': 3, '5th': 4,
  '1': 0, '2': 1, '3': 2, '4': 3, '5': 4,
};

/** Tries `words` as an ordinal reference ("the first one", "second", "2") into `candidates`. */
function tryOrdinalAnswer(words: string[], candidates: (ObjectId | NpcId)[]): AnswerResult | undefined {
  const ordinalWord = words.find((w) => w in ORDINALS);
  if (ordinalWord === undefined) return undefined;
  if (!words.every((w) => w === ordinalWord || w === 'one')) return undefined;
  const index = ORDINALS[ordinalWord]!;
  return index < candidates.length ? { kind: 'resolved', id: candidates[index]! } : { kind: 'none' };
}

/**
 * The first half of §3.3's flow: is `tokens` an answer to `pending`? Tries
 * an ordinal first, then treats every token as a noun-or-adjective word
 * that must be known to a candidate (forgiving about which word class it
 * is — "brass" alone is enough, same as "brass key").
 */
function tryAnswer(vocab: CompiledVocabulary, candidates: (ObjectId | NpcId)[], tokens: string[]): AnswerResult {
  const ordinal = tryOrdinalAnswer(tokens, candidates);
  if (ordinal !== undefined) return ordinal;

  const matches = candidates.filter((id) => {
    const known = knownWordsFor(vocab, id);
    return tokens.every((w) => known.has(w));
  });
  if (matches.length === 0) return { kind: 'none' };
  if (matches.length === 1) return { kind: 'resolved', id: matches[0]! };
  return { kind: 'ambiguous', candidates: matches };
}

function buildClarify(
  vocab: CompiledVocabulary,
  verb: VerbId,
  slot: 'dobj' | 'iobj',
  candidates: (ObjectId | NpcId)[],
  partial: Partial<StructuredAction>,
  reask: boolean,
  deferredIobj?: UnresolvedNounPhrase,
): InterpretOutcome & { kind: 'clarify' } {
  const names = candidates.map((id) => candidateName(vocab, id));
  return {
    kind: 'clarify',
    question: `Which do you mean, ${joinWithOr(names.map((n) => `the ${n}`))}?`,
    options: names,
    pending: {
      verb,
      slot,
      candidates,
      partial,
      ...(reask ? { reask: true } : {}),
      ...(deferredIobj !== undefined ? { deferredIobj } : {}),
    },
  };
}

// ---------------------------------------------------------------------------
// DeterministicParser
// ---------------------------------------------------------------------------

export class DeterministicParser implements IntentInterpreter {
  interpret(input: string, view: ScopeView): InterpretOutcome {
    const tokens = dropBaseNoise(tokenize(input));
    if (tokens.length === 0) return { kind: 'miss', raw: input, knownNouns: [] };

    const pending = view.parser.pending;
    if (pending !== undefined) {
      const answer = tryAnswer(view.vocabulary, pending.candidates, tokens);
      if (answer.kind === 'resolved') {
        return this.finalizePending(view, pending, answer.id);
      }
      if (answer.kind === 'ambiguous') {
        if (pending.reask === true) {
          // Never nests: a second ambiguous answer in a row gives up
          // gracefully — drop the question and parse this input fresh.
          return this.parseFresh(input, view, tokens);
        }
        return buildClarify(view.vocabulary, pending.verb, pending.slot, answer.candidates, pending.partial, true);
      }
      // Not an answer at all: the pending question is silently dropped and
      // this input is parsed as a fresh command (§3.3).
      return this.parseFresh(input, view, tokens);
    }

    return this.parseFresh(input, view, tokens);
  }

  /**
   * Plugs a resolved disambiguation answer into `pending.slot`. When
   * `pending.deferredIobj` is set (the dobj-was-ambiguous case, §3.3 fixed
   * in review), the action isn't complete yet — the iobj phrase still has
   * to be resolved for real, which can raise its *own* clarify rather than
   * ever guessing.
   */
  private finalizePending(view: ScopeView, pending: NonNullable<ParserContext['pending']>, answerId: ObjectId | NpcId): InterpretOutcome {
    const filled = { ...pending.partial, verb: pending.verb, [pending.slot]: answerId } as Partial<StructuredAction>;
    if (pending.deferredIobj === undefined) {
      return { kind: 'actions', actions: [filled as StructuredAction] };
    }
    return this.resolveIobj(view, pending.verb, pending.deferredIobj, filled);
  }

  private parseFresh(input: string, view: ScopeView, tokens: string[]): InterpretOutcome {
    const result = matchGrammar(view.vocabulary, tokens, input);

    if (result.kind === 'noVerb') {
      return { kind: 'miss', raw: input, knownNouns: knownNounsIn(view.vocabulary, tokens) };
    }
    if (result.kind === 'noPattern') {
      return { kind: 'miss', raw: input, verb: result.verb, knownNouns: knownNounsIn(view.vocabulary, tokens) };
    }

    const { action } = result;
    if (action.dobj === undefined && action.iobj === undefined && action.npc === undefined) {
      // No noun phrase to resolve ('V' pattern verbs — LOOK, WAIT, meta
      // verbs…): the action is already complete.
      return { kind: 'actions', actions: [{ verb: action.verb, raw: input }] };
    }

    return this.resolveAction(view, action, tokens);
  }

  /** Resolves whichever of `dobj`/`iobj`/`npc` the matched pattern declared, in that order, against `view` (§3.2 noun resolution + pronouns). `npc` (the `V npc about topic` slot) resolves into the final `dobj` field — `StructuredAction` has no separate `npc` field (§3.1). */
  private resolveAction(view: ScopeView, action: UnresolvedAction, allTokens: string[]): InterpretOutcome {
    const miss = (verb: VerbId): InterpretOutcome => ({
      kind: 'miss',
      raw: action.raw,
      verb,
      knownNouns: knownNounsIn(view.vocabulary, allTokens),
    });

    if (action.npc !== undefined) {
      const result = this.resolvePhrase(view, action.npc, 'npc');
      if (result.kind === 'none') return miss(action.verb);
      const topic = action.topic !== undefined ? { topic: action.topic } : {};
      if (result.kind === 'ambiguous') {
        return buildClarify(view.vocabulary, action.verb, 'dobj', result.candidates, { verb: action.verb, ...topic, raw: action.raw }, false);
      }
      return { kind: 'actions', actions: [{ verb: action.verb, dobj: result.id, ...topic, raw: action.raw }] };
    }

    if (action.dobj === undefined) {
      // Shouldn't happen for the patterns this module knows about (only
      // 'V dobj' and 'V dobj prep iobj' reach here without an npc phrase),
      // but keep the branch total rather than asserting.
      return miss(action.verb);
    }

    const dobjResult = this.resolvePhrase(view, action.dobj, 'either');
    if (dobjResult.kind === 'none') return miss(action.verb);

    if (action.iobj === undefined) {
      if (dobjResult.kind === 'ambiguous') {
        return buildClarify(view.vocabulary, action.verb, 'dobj', dobjResult.candidates, { verb: action.verb, raw: action.raw }, false);
      }
      return { kind: 'actions', actions: [{ verb: action.verb, dobj: dobjResult.id, raw: action.raw }] };
    }

    // 'V dobj prep iobj': dobj resolves first, unconditionally — fixed in
    // review (constitution §9: a silent best guess on one slot while asking
    // about the other risks acting on an object the player didn't mean).
    // If dobj is ambiguous, iobj is never even touched this turn: the
    // question is about dobj alone, and `deferredIobj` carries the raw
    // phrase for `finalizePending` to resolve for real once dobj is
    // answered — which can itself raise a second, independent clarify for
    // iobj rather than guessing.
    const prep = action.prep !== undefined ? { prep: action.prep } : {};
    if (dobjResult.kind === 'ambiguous') {
      return buildClarify(
        view.vocabulary,
        action.verb,
        'dobj',
        dobjResult.candidates,
        { verb: action.verb, ...prep, raw: action.raw },
        false,
        action.iobj,
      );
    }

    return this.resolveIobj(view, action.verb, action.iobj, { verb: action.verb, dobj: dobjResult.id, ...prep, raw: action.raw });
  }

  /** Resolves the (now-known-relevant) iobj phrase against `view`, given everything else about the action already settled in `settled`. Shared by the immediate dobj-resolved path and `finalizePending`'s post-dobj-answer path. */
  private resolveIobj(view: ScopeView, verb: VerbId, iobjPhrase: UnresolvedNounPhrase, settled: Partial<StructuredAction>): InterpretOutcome {
    const iobjResult = this.resolvePhrase(view, iobjPhrase, 'either');
    if (iobjResult.kind === 'none') {
      return { kind: 'miss', raw: settled.raw ?? '', verb, knownNouns: knownNounsIn(view.vocabulary, iobjPhrase.words) };
    }
    if (iobjResult.kind === 'ambiguous') {
      return buildClarify(view.vocabulary, verb, 'iobj', iobjResult.candidates, settled, false);
    }
    return { kind: 'actions', actions: [{ ...settled, iobj: iobjResult.id } as StructuredAction] };
  }

  /** Pronouns take priority over vocabulary resolution — a bare "it"/"him"/"her"/"them" is never itself a declared object/npc noun. */
  private resolvePhrase(view: ScopeView, phrase: UnresolvedNounPhrase, role: 'npc' | 'either'): ResolveResult {
    if (phrase.words.length === 1) {
      const pronoun = resolvePronoun(view.vocabulary, view.visible, view.parser, phrase.words[0]!);
      if (pronoun !== undefined) return pronoun;
    }
    return resolveNounPhrase(view.vocabulary, view.visible, phrase, role);
  }
}

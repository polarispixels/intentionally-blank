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
//   task 11 (this one) — `ALL`/`AND`/`BUT` (`./parser/multi.ts`), `GO TO`
//             (BFS over `ScopeView.travel`, this module's `tryGoTo`), and
//             `AGAIN` (this module's `resolveAgain`) — §3.5. Implicit take
//             is a narrowly-authorized `actions.ts` change (see that
//             module), not this one's.

import type { NpcId, ObjectId, PlaceId, RoomId, VerbId } from './ids';
import { V } from './ids';
import type { CompiledVocabulary, ResolveResult, UnresolvedAction, UnresolvedNounPhrase } from './parser';
import {
  candidateName,
  dropBaseNoise,
  isNpcId,
  joinWithOr,
  knownNounsIn,
  knownWordsFor,
  matchGrammar,
  resolveNounPhrase,
  resolvePronoun,
  tokenize,
  tryMultiObject,
} from './parser';

/**
 * Reserved verb id for `GO TO` (task 11, §3.5). Never added to `world.verbs`
 * — `GO TO`'s recognition happens in `DeterministicParser.tryGoTo`, entirely
 * before `matchGrammar`'s normal per-verb dispatch (neither "go" nor a bare
 * room alias is ever a declared verb word), so there is no grammar-table
 * entry for content to author.
 */
export const GO_TO_VERB_ID = V('go_to');

/**
 * Reserved verb id for `AGAIN`/`G` (task 11, §3.5). Unlike `GO_TO_VERB_ID`,
 * this one DOES need a normal `world.verbs` entry — a plain `'V'`-pattern
 * verb (words `['again', 'g']`) with its own authored `default` family, so
 * ordinary `matchGrammar` recognizes it and rung-2b renders that family
 * whenever `AGAIN` has nothing to repeat. `DeterministicParser.resolveAgain`
 * special-cases the *resolved* match (see that method) to replay
 * `parser.last` when one exists, rather than ever reaching rung 2b itself.
 */
export const AGAIN_VERB_ID = V('again');

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
  /**
   * `GO TO`'s BFS output (task 11, §3.5): ordered rooms from (not
   * including) the player's current room to the target, each reachable via
   * a currently-passable exit from the previous. This is a *movement plan*
   * only — walking it one room per world turn, narrating each hop, and
   * handling a mid-route interruption (blocked exit revealed, a scheduled
   * event, an NPC intercept) is the turn loop's job (a later task), not
   * this one's; see `DeterministicParser.resolveGoTo`'s doc comment.
   */
  route?: RoomId[];
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
  /**
   * `TAKE ALL`/`DROP ALL` eligibility (§3.5, task 11): which of `visible`'s
   * ids are portable objects, and each visible object's current `PlaceId` —
   * lets the parser compute "portable and not held" (TAKE), "held" (DROP),
   * and "in `<container>`" (`TAKE ALL FROM DESK`) without reading
   * `WorldDef`/`GameState` directly. Built by the engine (currently, before
   * `step()` exists, hand-built by test helpers — see
   * `tests/parser-multi.test.ts`).
   */
  portable: Set<ObjectId>;
  location: Map<ObjectId, PlaceId>;
  /**
   * `GO TO`'s BFS graph (§3.5, task 11). Keys are exactly the visited rooms
   * (`state.visited`); values are the rooms one currently-passable exit
   * away, restricted to other visited rooms — `GO TO` only ever routes
   * through rooms the player has seen, and never reveals an unvisited one.
   * Built by the engine from `world.rooms[*].exits` + door/cond state.
   */
  travel: { current: RoomId; passable: Map<RoomId, RoomId[]> };
}

export type InterpretOutcome =
  | { kind: 'actions'; actions: StructuredAction[] } // TAKE ALL → many (task 11)
  | { kind: 'clarify'; question: string; options: string[]; pending: ParserContext['pending'] }
  /**
   * `reason` distinguishes the two genuinely different situations that both
   * produce this shape (task 12 fix-2, coordinator review): `'noPattern'` —
   * `matchGrammar` recognized the verb but the remaining tokens (often zero
   * of them — a bare `TAKE`) fit none of its declared patterns, so no noun
   * phrase was even attempted; `'nounUnresolved'` — a pattern DID match and
   * a real noun phrase was given (`resolveAction`/`resolveIobj`), but it
   * resolved to nothing in scope. Only set when `verb` is (both miss sites
   * that leave `verb` undefined — `tokens.length === 0` and `noVerb` — have
   * no verb-known distinction to make). `respond.ts`'s rung 3/4/5 ladder
   * reads this to tell "Take what?" apart from "The brass key isn't here" —
   * before this field existed the two were indistinguishable from the
   * outcome shape alone, and every bare verb rendered as a noun miss.
   */
  | {
      kind: 'miss';
      raw: string;
      verb?: VerbId;
      knownNouns: string[];
      reason?: 'noPattern' | 'nounUnresolved';
      /**
       * The verb surface form the player actually typed ("sweep"), when the
       * grammar knows it (`noPattern` carries the matched form) — so the
       * `bareVerb` family can echo the player's own word instead of the
       * verb's canonical `words[0]` ("feel around"). Optional and additive:
       * absent on the older miss shapes, and `respond.ts` falls back to the
       * canonical word without it (Stage F sweep).
       */
      verbWord?: string;
    }
  /**
   * `GO TO` a room that isn't currently reachable through the visited
   * graph — either it was never visited at all, or it was visited but no
   * currently-passable exit chain reaches it from here (task 11, §3.5).
   * Both cases render the same fixed line ("You don't know the way there
   * yet."). This is parser-mechanical UI text, not narrative prose — the
   * same precedent `buildClarify`'s hardcoded question text sets — so it's
   * carried as a literal `message` here rather than routed through
   * `world.responses` (the parser has no `world`/`state` to render against
   * anyway). A dedicated outcome kind, rather than overloading `miss`,
   * keeps "GO TO recognized a real room but can't route there" distinct
   * from "nothing was recognized at all" for whichever future task renders
   * outcomes.
   */
  | { kind: 'unreachable'; raw: string; message: string }
  /**
   * `TAKE ALL`/`DROP ALL`/etc. expanded to zero eligible objects (§3.5).
   * The "There is nothing here worth carrying." family is real authored
   * prose the parser cannot render (no `world`/`state`, and rendering has
   * counter-rotation side effects the parser must not trigger on the
   * engine's behalf) — so this outcome only carries what a renderer needs
   * to look up the right family; see `./parser/multi.ts`'s
   * `allEmptyFamilyKey` for the exact reserved key convention
   * (`take.allEmpty`, `drop.allEmpty`, …). Not authored anywhere yet — a
   * `narrative-writer` need, flagged in this task's report.
   */
  | { kind: 'allEmpty'; verb: VerbId; raw: string };

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
 * - `miss` / `unreachable` / `allEmpty` (task 11) → nothing changes except
 *   `pending` clearing. In particular `pending` is *not* preserved from
 *   `prev` here — but that's fine: whenever a fresh command silently drops
 *   a pending question (§3.3), the resulting outcome is itself either a
 *   fresh `clarify` (new `pending,` handled above) or one of these
 *   no-action kinds (which correctly want `pending` gone). Any of these
 *   three while no `pending` was ever active is the same no-op. `unreachable`
 *   and `allEmpty` join `miss` here for the same reason: no `StructuredAction`
 *   ran, so there is nothing to update `it`/`them`/`last` from.
 * - `actions`, single action → `last` becomes that action; its resolved
 *   `dobj`/`iobj` updates `it` (an `ObjectId`) or, for an `NpcId`, whichever
 *   of `him`/`her`/`them` matches that NPC's declared `NpcDefSlice.pronoun`
 *   (`vocab.npcPronouns`) — an NPC with no declared pronoun updates none of
 *   them, rather than guessing. Referring to one NPC therefore never
 *   clobbers a differently-pronouned NPC's antecedent.
 * - `actions`, multiple actions (task 11's `ALL`/`AND` territory) → `last`
 *   becomes the *first* action (§3.5). Every resolved `dobj`/`iobj` across
 *   every expanded action instead becomes the new `them` (§3.4: "`them` →
 *   last plural object set") — NOT `it`, repeatedly overwritten, which is
 *   what the single-action loop above would do if reused unchanged (and
 *   would silently lose the set down to whichever object happened to
 *   resolve last). Any `NpcId` refs (rare in this shape — `ALL`/`AND` are
 *   object-oriented per spec) still update `him`/`her`/`them`-singular by
 *   declared pronoun, exactly as the single-action path does. `pending`
 *   clears in every `actions` case.
 */
function applyNpcPronoun(next: ParserContext, vocab: CompiledVocabulary, ref: NpcId): void {
  const pronoun = vocab.npcPronouns.get(ref);
  if (pronoun === 'he') next.him = ref;
  else if (pronoun === 'she') next.her = ref;
  else if (pronoun === 'they') next.them = ref;
  // No declared pronoun: no antecedent update — see doc comment above.
}

export function nextParserContext(prev: ParserContext, outcome: InterpretOutcome, vocab: CompiledVocabulary): ParserContext {
  // `delete`, not `pending: undefined`, throughout — `exactOptionalPropertyTypes`
  // treats those differently, and "absent" is what "no outstanding question" means.
  if (outcome.kind === 'clarify') {
    const next: ParserContext = { ...prev };
    if (outcome.pending !== undefined) next.pending = outcome.pending;
    else delete next.pending;
    return next;
  }
  if (outcome.kind === 'miss' || outcome.kind === 'unreachable' || outcome.kind === 'allEmpty') {
    const next: ParserContext = { ...prev };
    delete next.pending;
    return next;
  }

  const next: ParserContext = { ...prev };
  delete next.pending;

  if (outcome.actions.length > 1) {
    const objectRefs: ObjectId[] = [];
    for (const action of outcome.actions) {
      for (const ref of [action.dobj, action.iobj]) {
        if (ref === undefined) continue;
        if (isNpcId(vocab, ref)) applyNpcPronoun(next, vocab, ref);
        else objectRefs.push(ref);
      }
    }
    if (objectRefs.length > 0) next.them = objectRefs;
  } else {
    for (const action of outcome.actions) {
      for (const ref of [action.dobj, action.iobj]) {
        if (ref === undefined) continue;
        if (isNpcId(vocab, ref)) applyNpcPronoun(next, vocab, ref);
        else next.it = ref;
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

/**
 * `reask`'s question text is deliberately NOT the same sentence as the
 * first ask (review fix, after Ryan's "which do you mean, the rack or the
 * key?" loop): a plain word answer already failed to distinguish these
 * candidates once, so repeating the identical phrasing offers no new way
 * to answer. The re-ask instead numbers the options and asks for a number
 * — `tryOrdinalAnswer` already accepts "1"/"first"/etc. — which is always
 * answerable even when every candidate shares every word a player might
 * type (the key-rack/room-key case: both are bare-noun "key").
 */
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
  const question = reask
    ? `Which do you mean — ${names.map((n, i) => `${i + 1}) the ${n}`).join(', ')}? Say the number.`
    : `Which do you mean, ${joinWithOr(names.map((n) => `the ${n}`))}?`;
  return {
    kind: 'clarify',
    question,
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

/**
 * True when `pending` was already asking about exactly this ambiguity —
 * same verb, same slot, same candidate set (order-independent) — so a
 * repeat is a continuation of the same unresolved question, not a new one.
 * Deliberately blind to *how* the repeat arrived: whether the player typed
 * a bare answer again or retyped the whole command (`pick up the key`
 * after `take key`), both land here the same way — the fresh-reformulation
 * path was the actual gap in Ryan's report (a literal repeated answer
 * already escalated `reask`; a retyped command reset it to a fresh
 * first-ask every time, so the loop had no exit as long as the player kept
 * rephrasing instead of answering bare).
 */
function sameAmbiguity(
  pending: ParserContext['pending'],
  verb: VerbId,
  slot: 'dobj' | 'iobj',
  candidates: (ObjectId | NpcId)[],
): boolean {
  if (pending === undefined || pending.verb !== verb || pending.slot !== slot) return false;
  if (pending.candidates.length !== candidates.length) return false;
  const priorSet = new Set(pending.candidates);
  return candidates.every((id) => priorSet.has(id));
}

// ---------------------------------------------------------------------------
// GO TO — breadth-first search over the visited-room graph (§3.5, task 11)
// ---------------------------------------------------------------------------

/**
 * Shortest route from `from` to `to` over `passable` (an adjacency map,
 * `RoomId → RoomId[]`), or `undefined` when no route exists — including
 * when either endpoint isn't even a key (an unvisited, or otherwise
 * unrouteable, room). `from === to` returns `[]` (already there; zero hops).
 */
function bfsRoute(passable: Map<RoomId, RoomId[]>, from: RoomId, to: RoomId): RoomId[] | undefined {
  if (!passable.has(from) || !passable.has(to)) return undefined;
  if (from === to) return [];

  const cameFrom = new Map<RoomId, RoomId>();
  const visited = new Set<RoomId>([from]);
  const queue: RoomId[] = [from];

  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const next of passable.get(current) ?? []) {
      if (visited.has(next)) continue;
      visited.add(next);
      cameFrom.set(next, current);
      if (next === to) {
        const route: RoomId[] = [next];
        let node = current;
        while (node !== from) {
          route.unshift(node);
          node = cameFrom.get(node)!;
        }
        return route;
      }
      queue.push(next);
    }
  }
  return undefined;
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
        return this.disambiguate(view, pending.verb, pending.slot, answer.candidates, pending.partial, pending.deferredIobj);
      }
      // Not an answer at all: the pending question is silently dropped and
      // this input is parsed as a fresh command (§3.3).
      return this.parseFresh(input, view, tokens);
    }

    return this.parseFresh(input, view, tokens);
  }

  /**
   * Turns a freshly-ranked ambiguous candidate pool into this turn's
   * outcome, checking it against whatever question `view.parser.pending`
   * left outstanding from the previous turn (§3.3, generalized in review
   * after Ryan's "which do you mean, the rack or the key?" loop — the key
   * rack and the room key both carried the bare noun "key," so no word
   * the player typed could ever tell them apart, and asking again and
   * again never got anywhere). `sameAmbiguity` recognizes a repeat
   * regardless of whether this turn's input was a literal answer to
   * `pending` or a completely retyped command that happened to resolve to
   * the identical ambiguity — both are the same unresolved question:
   *  - not the same ambiguity (or nothing was pending) → first ask,
   *    ordinary wording.
   *  - the same ambiguity, asked once before (`pending.reask` not yet
   *    set) → re-ask, but numbered (`buildClarify`'s `reask` wording) so
   *    an ordinal answer is always a way out even when no word
   *    distinguishes the candidates.
   *  - the same ambiguity a third time → there is no further exit through
   *    asking. This is a content bug (two objects sharing a bare noun
   *    with no distinguishing adjective — `validate`'s new noun-collision
   *    warning flags exactly this), and the player must not be the one
   *    trapped by it: give up and resolve to the first candidate, via the
   *    same `finalizePending` continuation an ordinary answer would use
   *    (so a deferred iobj still gets resolved for real, never guessed).
   */
  private disambiguate(
    view: ScopeView,
    verb: VerbId,
    slot: 'dobj' | 'iobj',
    candidates: (ObjectId | NpcId)[],
    partial: Partial<StructuredAction>,
    deferredIobj?: UnresolvedNounPhrase,
  ): InterpretOutcome {
    const priorPending = view.parser.pending;
    const repeat = sameAmbiguity(priorPending, verb, slot, candidates);
    if (repeat && priorPending!.reask === true) {
      return this.finalizePending(
        view,
        { verb, slot, candidates, partial, ...(deferredIobj !== undefined ? { deferredIobj } : {}) },
        candidates[0]!,
      );
    }
    return buildClarify(view.vocabulary, verb, slot, candidates, partial, repeat, deferredIobj);
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
    // `GO TO` (task 11, §3.5) is recognized before grammar matching at all —
    // neither "go"/"to" nor a bare room alias is ever a declared verb word,
    // so `matchGrammar` would just report `noVerb` for them otherwise.
    //
    // FALL-THROUGH (v0.7.0): a `GO TO` that the route-finder cannot satisfy
    // (an unvisited or currently-cut-off room) is offered to the grammar
    // before it is refused. "go to diner" from Main Street on a first visit
    // is not a route request the player can't make yet — it is the street's
    // own `diner` scenery object, whose `V_APPROACH` handler walks them in;
    // every storefront on the street is wired that way, and the room alias
    // sharing the scenery noun was hiding all of them. Only a grammar
    // `miss` hands the original "You don't know the way there yet." back.
    const goTo = this.tryGoTo(tokens, input, view);
    if (goTo !== undefined && goTo.kind !== 'unreachable') return goTo;
    const outcome = this.parseByGrammar(input, view, tokens);
    if (goTo !== undefined && outcome.kind === 'miss') return goTo;
    return outcome;
  }

  private parseByGrammar(input: string, view: ScopeView, tokens: string[]): InterpretOutcome {
    const result = matchGrammar(view.vocabulary, tokens, input);

    if (result.kind === 'noVerb') {
      return { kind: 'miss', raw: input, knownNouns: knownNounsIn(view.vocabulary, tokens) };
    }
    if (result.kind === 'noPattern') {
      return { kind: 'miss', raw: input, verb: result.verb, verbWord: result.word, knownNouns: knownNounsIn(view.vocabulary, tokens), reason: 'noPattern' };
    }

    const { action } = result;

    // `AGAIN`/`G` (task 11, §3.5): a resolved zero-arg match for the
    // reserved verb id — content declares it as an ordinary `'V'`-pattern
    // verb (see `AGAIN_VERB_ID`'s doc comment) so it reaches here through
    // normal grammar matching, same as LOOK or WAIT.
    if (action.verb === AGAIN_VERB_ID && action.pattern === 'V') {
      return this.resolveAgain(view, input);
    }

    // `ALL`/`AND`/`BUT` (task 11, §3.5): only ever shaped as a `'V dobj'`
    // match (GO TO is handled above; `'V dobj prep iobj'` never carries
    // multi-object syntax per the spec's own examples). `undefined` means
    // the remaining tokens aren't an ALL/AND/BUT shape at all — fall
    // through to ordinary single-phrase resolution unchanged.
    if (action.pattern === 'V dobj' && action.dobj !== undefined) {
      const multi = tryMultiObject(view, action.verb, input, action.dobj.words);
      if (multi !== undefined) return multi;
    }

    if (action.dobj === undefined && action.iobj === undefined && action.npc === undefined) {
      // No noun phrase to resolve ('V' pattern verbs — LOOK, WAIT, meta
      // verbs…): the action is already complete.
      return { kind: 'actions', actions: [{ verb: action.verb, raw: input }] };
    }

    return this.resolveAction(view, action, tokens);
  }

  /**
   * `GO TO <room>` / a bare room alias (task 11, §3.5). Returns `undefined`
   * when the input isn't this shape at all — either it doesn't start with
   * "go to", or (as a whole) it doesn't match any `vocab.roomAliases` key —
   * so the caller falls through to ordinary grammar matching (an ordinary
   * ultimate `miss` for genuinely unrecognized input).
   */
  private tryGoTo(tokens: string[], raw: string, view: ScopeView): InterpretOutcome | undefined {
    let phraseWords: string[] | undefined;
    if (tokens.length >= 3 && tokens[0] === 'go' && tokens[1] === 'to') {
      phraseWords = tokens.slice(2);
    } else if (view.vocabulary.roomAliases.has(tokens.join(' '))) {
      phraseWords = tokens;
    }
    if (phraseWords === undefined || phraseWords.length === 0) return undefined;

    const target = view.vocabulary.roomAliases.get(phraseWords.join(' '));
    if (target === undefined) return undefined; // no alias matches at all — not GO TO syntax

    return this.resolveGoTo(view, target, raw);
  }

  /**
   * BFS's `view.travel.passable` from `view.travel.current` to `target`
   * (§3.5). Both endpoints must already be visited rooms (keys of
   * `passable`) — `GO TO` never routes through, or reveals, an unvisited
   * room. A route, once found, is only ever built from edges that are
   * passable *right now* (at plan time) — that is the full extent of "stops
   * early… if an exit is blocked" this method can deliver: live mid-route
   * interruption (a blocked exit revealed mid-walk, a scheduled event, an
   * NPC intercept) needs the turn loop actually walking the route one hop
   * per world turn, which doesn't exist yet (a later task). `route` here is
   * exactly the *movement plan* the architecture doc's own module-boundary
   * note asks task 11 to produce, not execute.
   */
  private resolveGoTo(view: ScopeView, target: RoomId, raw: string): InterpretOutcome {
    const route = bfsRoute(view.travel.passable, view.travel.current, target);
    if (route === undefined) {
      return { kind: 'unreachable', raw, message: "You don't know the way there yet." };
    }
    return { kind: 'actions', actions: [{ verb: GO_TO_VERB_ID, route, raw }] };
  }

  /** `AGAIN`/`G` (task 11, §3.5): replays `parser.last` verbatim when one exists; otherwise falls through as an ordinary zero-arg `AGAIN_VERB_ID` action, which rung 2b renders via its own authored `default` family (no handler, no built-in — existing machinery, untouched). */
  private resolveAgain(view: ScopeView, raw: string): InterpretOutcome {
    if (view.parser.last !== undefined) {
      return { kind: 'actions', actions: [view.parser.last] };
    }
    return { kind: 'actions', actions: [{ verb: AGAIN_VERB_ID, raw }] };
  }

  /** Resolves whichever of `dobj`/`iobj`/`npc` the matched pattern declared, in that order, against `view` (§3.2 noun resolution + pronouns). `npc` (the `V npc about topic` slot) resolves into the final `dobj` field — `StructuredAction` has no separate `npc` field (§3.1). */
  private resolveAction(view: ScopeView, action: UnresolvedAction, allTokens: string[]): InterpretOutcome {
    // `knownNouns` is scoped to the slot that failed (v0.9.0): the rung-3
    // "you have seen that somewhere" text names a candidate for one of
    // these words, and naming a candidate for the *other* slot's words is
    // how "show ticket to jack" once answered "The motel is not here" — the
    // npc word "jack" matched Main Street's motel-sign scenery.
    const miss = (verb: VerbId, words: readonly string[] = allTokens): InterpretOutcome => ({
      kind: 'miss',
      raw: action.raw,
      verb,
      knownNouns: knownNounsIn(view.vocabulary, [...words]),
      reason: 'nounUnresolved',
    });

    if (action.npc !== undefined) {
      const result = this.resolvePhrase(view, action.npc, 'npc');
      if (result.kind === 'none') return miss(action.verb, action.npc.words);
      const topic = action.topic !== undefined ? { topic: action.topic } : {};
      if (result.kind === 'ambiguous') {
        return this.disambiguate(view, action.verb, 'dobj', result.candidates, { verb: action.verb, ...topic, raw: action.raw });
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
    if (dobjResult.kind === 'none') return miss(action.verb, action.dobj.words);

    if (action.iobj === undefined) {
      if (dobjResult.kind === 'ambiguous') {
        return this.disambiguate(view, action.verb, 'dobj', dobjResult.candidates, { verb: action.verb, raw: action.raw });
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
      return this.disambiguate(view, action.verb, 'dobj', dobjResult.candidates, { verb: action.verb, ...prep, raw: action.raw }, action.iobj);
    }

    return this.resolveIobj(view, action.verb, action.iobj, { verb: action.verb, dobj: dobjResult.id, ...prep, raw: action.raw });
  }

  /** Resolves the (now-known-relevant) iobj phrase against `view`, given everything else about the action already settled in `settled`. Shared by the immediate dobj-resolved path and `finalizePending`'s post-dobj-answer path. */
  private resolveIobj(view: ScopeView, verb: VerbId, iobjPhrase: UnresolvedNounPhrase, settled: Partial<StructuredAction>): InterpretOutcome {
    const iobjResult = this.resolvePhrase(view, iobjPhrase, 'either');
    if (iobjResult.kind === 'none') {
      return { kind: 'miss', raw: settled.raw ?? '', verb, knownNouns: knownNounsIn(view.vocabulary, iobjPhrase.words), reason: 'nounUnresolved' };
    }
    if (iobjResult.kind === 'ambiguous') {
      return this.disambiguate(view, verb, 'iobj', iobjResult.candidates, settled);
    }
    return { kind: 'actions', actions: [{ ...settled, iobj: iobjResult.id } as StructuredAction] };
  }

  /** Pronouns take priority over vocabulary resolution — a bare "it"/"him"/"her"/"them" is never itself a declared object/npc noun. */
  private resolvePhrase(view: ScopeView, phrase: UnresolvedNounPhrase, role: 'npc' | 'either'): ResolveResult {
    if (phrase.words.length === 1) {
      const pronoun = resolvePronoun(view.vocabulary, view.visible, view.parser, phrase.words[0]!);
      if (pronoun !== undefined) return pronoun;
    }
    return resolveNounPhrase(view.vocabulary, view.visible, phrase, role, view.location);
  }
}

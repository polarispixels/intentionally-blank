// Pronoun substitution and `ParserContext` update (spec §3.4) — task 10.
//
// Resolution (reading a pronoun word against the current antecedents) is
// pure and lives in `resolvePronoun`, called from `interpreter.ts` before
// vocabulary-based noun resolution is even attempted (a bare "it"/"him"/
// "her"/"them" is never a real object/npc noun, so pronouns always take
// priority over `resolver.ts`'s `resolveNounPhrase`).
//
// WRITING antecedents back is deliberately NOT done inside
// `DeterministicParser.interpret()` — `ScopeView.parser` is documented as
// read-only ("built by the engine, never mutated here"), and
// `IntentInterpreter.interpret()`'s return type is fixed by §3.1 to
// `InterpretOutcome`, which has no slot for a returned `ParserContext`
// outside `clarify.pending`. Instead `interpreter.ts` exports
// `nextParserContext` (kept there, not here, since it needs the full
// `ParserContext`/`StructuredAction`/`InterpretOutcome` shapes that module
// owns) — a pure function of the *previous* context and the
// `InterpretOutcome` just produced. The caller (whichever future task
// wires the new parser into `step()`) is expected to compute the next
// `state.parser` with it and store the result, the same way `apply()`
// already threads `state` through effects. `ParserContext` living inside
// `GameState` (§1.2) is what makes this pure-function shape work at all:
// undo/save/load just carry the plain data forward, no special-casing.
//
// PRONOUN GENDER (fixed in review — was a guess, is now real data):
// `NpcDefSlice.pronoun` (`world.ts`) declares each NPC's `'he'|'she'|'they'`
// — `him`/`her`/`them` resolve (both the "alone in scope" fallback and, in
// `interpreter.ts`'s `nextParserContext`, antecedent-tracking) only against
// NPCs whose declared pronoun matches. An NPC with no `pronoun` declared
// never participates in pronoun resolution at all — no guessing a gender
// the content never stated, and referring to one NPC never touches a
// differently-pronouned NPC's antecedent.

import type { NpcId, ObjectId } from './../ids';
import type { CompiledVocabulary } from './vocabulary';
import type { ResolveResult } from './resolver';
import { isNpcId } from './resolver';

/** NPCs in `visible` whose declared pronoun is `target` (§3.4's "alone in the room" fallback, now gender-aware). */
function npcsWithPronoun(vocab: CompiledVocabulary, visible: readonly (ObjectId | NpcId)[], target: 'he' | 'she' | 'they'): NpcId[] {
  return visible.filter((id) => isNpcId(vocab, id) && vocab.npcPronouns.get(id) === target) as NpcId[];
}

/** The subset of `ParserContext` this module reads/writes — re-declared structurally here so this file has no runtime dependency on `interpreter.ts` (avoids a needless import cycle risk); `interpreter.ts`'s `ParserContext` satisfies this shape. */
export interface PronounState {
  it?: ObjectId;
  him?: NpcId;
  her?: NpcId;
  them?: ObjectId[] | NpcId;
}

/**
 * Resolves a bare pronoun word against `parser`'s stored antecedents (and,
 * for `him`/`her` with no antecedent yet, the "alone in the room" fallback
 * over `visible`). Returns `undefined` when `word` isn't a pronoun at all,
 * so the caller falls through to ordinary vocabulary resolution.
 *
 * `it` has no scope fallback (§3.4 gives it none) and, notably, no scope
 * *check* either: a stored antecedent resolves directly, even if the
 * object named is no longer in `visible` — that is what lets a handler's
 * "conspicuous introduction" hook (`introduceIt`) work for things the
 * scope resolver would never surface (an object revealed only in prose),
 * and what makes the save/load antecedent survive a round trip regardless
 * of exactly what's in scope when `it` is next used.
 */
export function resolvePronoun(
  vocab: CompiledVocabulary,
  visible: readonly (ObjectId | NpcId)[],
  parser: PronounState,
  word: string,
): ResolveResult | undefined {
  if (word === 'it') {
    return parser.it !== undefined ? { kind: 'resolved', id: parser.it } : { kind: 'none' };
  }
  if (word === 'him' || word === 'her') {
    const stored = word === 'him' ? parser.him : parser.her;
    if (stored !== undefined) return { kind: 'resolved', id: stored };
    const candidates = npcsWithPronoun(vocab, visible, word === 'him' ? 'he' : 'she');
    return candidates.length === 1 ? { kind: 'resolved', id: candidates[0]! } : { kind: 'none' };
  }
  if (word === 'them') {
    if (parser.them !== undefined) {
      // A stored plural object set (from TAKE ALL etc.) can't resolve into
      // a single dobj/iobj slot — expanding "them" back into one action
      // per member is multi-object machinery, task 11's (§3.5), not this
      // task's.
      if (Array.isArray(parser.them)) return { kind: 'none' };
      return { kind: 'resolved', id: parser.them };
    }
    const candidates = npcsWithPronoun(vocab, visible, 'they');
    return candidates.length === 1 ? { kind: 'resolved', id: candidates[0]! } : { kind: 'none' };
  }
  return undefined;
}

/**
 * The hook §3.4 asks task 10 to expose for handlers that "conspicuously
 * introduce" an object (a response revealing something new, not the turn's
 * own resolved dobj/iobj) — e.g. "A loose page slips out." should make `it`
 * mean the page next turn, even though the page was never a resolved
 * argument this turn. Task 8's `effects.ts`/handler authoring can call this
 * once it has a place to (not this task's to wire in).
 */
export function introduceIt<T extends PronounState>(context: T, id: ObjectId): T {
  return { ...context, it: id };
}

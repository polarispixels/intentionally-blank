// ALL / AND / BUT expansion (spec §3.5, §8 task 11). Runs on the raw word
// span left after a `'V dobj'`-pattern verb match, BEFORE that span is
// handed to `resolveNounPhrase` as a single flat noun phrase — that flat
// parsing is wrong for "page and fedora" (it would treat "and" as an
// adjective) and has no concept of "all" at all. `interpreter.ts` calls
// `tryMultiObject` right after `matchGrammar` returns a `'V dobj'` match,
// before falling through to its own single-phrase `resolveAction` path;
// `undefined` means "not a multi-object shape", i.e. fall through unchanged.
//
// Only the `'V dobj'` pattern is handled here (per the task brief: GO TO is
// its own pre-check, and multi-object expansion never appears with `'V dobj
// prep iobj'` in the spec's own examples).
//
// JUDGMENT CALLS (task 11, documented per the plan's own instruction to do
// so — the spec worked through TAKE/DROP only):
//   - "ALL FROM <container>": an unresolvable container phrase is a normal
//     miss (explicit in the plan: "if it doesn't resolve, that's a normal
//     miss — don't special-case").
//   - "ALL BUT <phrase>[ and <phrase>]*": an unresolvable EXCLUSION phrase
//     excludes nothing, rather than failing the whole ALL command —
//     exclusions are subtractive, so a phrase naming nothing in scope just
//     narrows nothing; failing the entire (otherwise valid) ALL command
//     over one bad exclusion word would be the less forgiving reading
//     (constitution §12).
//   - "X AND Y [AND Z...]": an AND member that doesn't resolve to exactly
//     one candidate (none OR ambiguous) fails the WHOLE AND command as an
//     ordinary miss. True per-member clarify (asking about just the
//     ambiguous member, mid-AND-expansion) would need `ParserContext.pending`
//     to track "which of N phrases is still outstanding", a stateful
//     redesign of the disambiguation flow that's out of this task's scope —
//     flagged in the task report, not attempted here.
//   - ALL's eligibility for any verb other than TAKE/DROP: the spec only
//     defines TAKE-shaped ("portable, not held") and DROP-shaped ("held").
//     For any other verb, this module defaults to "every visible object,
//     undifferentiated by portable/held state" — there's no held/portable
//     gate that makes sense generically for e.g. "smell all" the way there
//     is for pick-up/put-down verbs.

import type { NpcId, ObjectId, VerbId } from './../ids';
import { BUILTIN_VERB_IDS } from './../actions';
import { knownNounsIn } from './grammar';
import { resolveNounPhrase } from './resolver';
import type { ResolveResult } from './resolver';
import { resolvePronoun } from './pronouns';
import type { InterpretOutcome, ScopeView, StructuredAction } from './../interpreter';

/**
 * The reserved `world.responses` family key for a verb's "ALL expanded to
 * nothing" outcome (§3.5's "There is nothing here worth carrying." example)
 * — `take.allEmpty` / `drop.allEmpty` for the two builtins, `${verb}.allEmpty`
 * otherwise. Exported so a future renderer (task 12's `respond.ts`) can
 * derive the same key deterministically from an `allEmpty` outcome's `verb`
 * without re-deriving this convention. **Not authored yet** — this task
 * does not add these keys to `world.responses` or any fixture; that's real
 * prose, a `narrative-writer` need flagged in the task report.
 */
export function allEmptyFamilyKey(verb: VerbId): string {
  if (verb === BUILTIN_VERB_IDS.take) return 'take.allEmpty';
  if (verb === BUILTIN_VERB_IDS.drop) return 'drop.allEmpty';
  return `${verb}.allEmpty`;
}

/** Mirrors `interpreter.ts`'s private `resolvePhrase`: pronouns take priority over vocabulary resolution. Duplicated rather than threaded in as a callback so this module stays a pure function of `ScopeView` alone. */
function resolvePhraseAgainstScope(view: ScopeView, words: string[]): ResolveResult {
  if (words.length === 1) {
    const pronoun = resolvePronoun(view.vocabulary, view.visible, view.parser, words[0]!);
    if (pronoun !== undefined) return pronoun;
  }
  return resolveNounPhrase(
    view.vocabulary,
    view.visible,
    { words, adjectives: words.slice(0, -1), noun: words[words.length - 1]! },
    'either',
  );
}

function missOutcome(view: ScopeView, verb: VerbId, raw: string, words: string[]): InterpretOutcome {
  return { kind: 'miss', raw, verb, knownNouns: knownNounsIn(view.vocabulary, words) };
}

/** Splits a word list on literal "and" tokens — "page and fedora and hat" → [["page"], ["fedora"], ["hat"]]. */
function splitByAnd(words: string[]): string[][] {
  const phrases: string[][] = [];
  let current: string[] = [];
  for (const w of words) {
    if (w === 'and') {
      phrases.push(current);
      current = [];
    } else {
      current.push(w);
    }
  }
  phrases.push(current);
  return phrases;
}

/** Every `ObjectId` in `view.visible` — i.e. everything `view.location` (built by the caller from real objects only) has an entry for. Excludes NPCs, which `ScopeView.portable`/`.location` never index. */
function allObjectIds(view: ScopeView): ObjectId[] {
  return view.visible.filter((id): id is ObjectId => view.location.has(id as ObjectId));
}

function isHeld(view: ScopeView, id: ObjectId): boolean {
  const loc = view.location.get(id);
  return loc === 'inventory' || loc === 'worn';
}

function isInContainer(view: ScopeView, id: ObjectId, container: ObjectId): boolean {
  const loc = view.location.get(id);
  return typeof loc === 'object' && loc !== null && 'in' in loc && loc.in === container;
}

/** §3.5's "eligible scope" for `ALL`, restricted to `container` (the `FROM <container>` case) when given. */
function eligibleForAll(view: ScopeView, verb: VerbId, container: ObjectId | undefined): ObjectId[] {
  const ids = allObjectIds(view);
  const inContainer = (id: ObjectId): boolean => container === undefined || isInContainer(view, id, container);

  if (verb === BUILTIN_VERB_IDS.take) {
    return ids.filter((id) => view.portable.has(id) && !isHeld(view, id) && inContainer(id));
  }
  if (verb === BUILTIN_VERB_IDS.drop) {
    return ids.filter((id) => isHeld(view, id) && inContainer(id));
  }
  // Any other verb + ALL — see file header's judgment-call note.
  return ids.filter(inContainer);
}

function resolveAllExpansion(view: ScopeView, verb: VerbId, raw: string, rest: string[]): InterpretOutcome | undefined {
  let container: ObjectId | undefined;
  const exclude = new Set<ObjectId>();

  if (rest.length === 0) {
    // plain ALL
  } else if (rest[0] === 'from' && rest.length > 1) {
    const containerWords = rest.slice(1);
    const result = resolvePhraseAgainstScope(view, containerWords);
    if (result.kind !== 'resolved') return missOutcome(view, verb, raw, containerWords);
    container = result.id as ObjectId;
  } else if (rest[0] === 'but' && rest.length > 1) {
    for (const phraseWords of splitByAnd(rest.slice(1))) {
      if (phraseWords.length === 0) continue;
      const result = resolvePhraseAgainstScope(view, phraseWords);
      // Unresolvable exclusion excludes nothing — see file header.
      if (result.kind === 'resolved') exclude.add(result.id as ObjectId);
    }
  } else {
    // "all <something else>" isn't a recognized shape (§3.5 only defines
    // plain / FROM / BUT) — not multi-object syntax; let the caller fall
    // through to ordinary noun-phrase resolution.
    return undefined;
  }

  const eligible = eligibleForAll(view, verb, container).filter((id) => !exclude.has(id));
  if (eligible.length === 0) return { kind: 'allEmpty', verb, raw };

  const actions: StructuredAction[] = eligible.map((id) => ({ verb, dobj: id, raw }));
  return { kind: 'actions', actions };
}

function resolveAndExpansion(view: ScopeView, verb: VerbId, raw: string, words: string[]): InterpretOutcome {
  const phrases = splitByAnd(words);
  const resolvedIds: (ObjectId | NpcId)[] = [];
  for (const phraseWords of phrases) {
    if (phraseWords.length === 0) return missOutcome(view, verb, raw, phraseWords);
    const result = resolvePhraseAgainstScope(view, phraseWords);
    // An AND member that isn't a unique resolution (none OR ambiguous)
    // fails the whole AND command — see file header for why true
    // per-member clarify is out of scope.
    if (result.kind !== 'resolved') return missOutcome(view, verb, raw, phraseWords);
    resolvedIds.push(result.id);
  }
  const actions: StructuredAction[] = resolvedIds.map((id) => ({ verb, dobj: id, raw }));
  return { kind: 'actions', actions };
}

/**
 * Entry point (§3.5). `dobjWords` is the raw token span a `'V dobj'`
 * grammar match left for its `dobj` phrase — i.e. `UnresolvedAction.dobj!.words`.
 * Returns `undefined` when `dobjWords` isn't an ALL/AND/BUT shape at all, so
 * the caller falls through to ordinary single-phrase resolution unchanged.
 */
export function tryMultiObject(view: ScopeView, verb: VerbId, raw: string, dobjWords: string[]): InterpretOutcome | undefined {
  if (dobjWords.length === 0) return undefined;

  if (dobjWords[0] === 'all') {
    return resolveAllExpansion(view, verb, raw, dobjWords.slice(1));
  }

  if (dobjWords.includes('and')) {
    return resolveAndExpansion(view, verb, raw, dobjWords);
  }

  return undefined;
}

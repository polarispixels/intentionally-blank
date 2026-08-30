// Noun-phrase resolution against scope (spec §3.2) and disambiguation
// candidate naming (§3.3) — task 10. Pronoun substitution lives in
// `./pronouns.ts`; this module only resolves an already-tokenized
// `UnresolvedNounPhrase` (task 9's seam) against a candidate id list.
//
// RANKING (§3.2): "candidates = things in scope whose nouns match the head
// noun; adjectives filter; a full adjective+noun match outranks a bare noun
// match." Concretely: every candidate whose noun matches is a "noun match";
// if the phrase gave adjectives, the subset of noun matches satisfying
// *every* given adjective (a "full match") replaces the whole candidate
// pool whenever that subset is non-empty — a bare noun match is only ever
// considered when no full match exists at all (adjectives that match
// nothing degrade gracefully rather than hard-failing, per the
// forgiving-language constitution §12).

import type { NpcId, ObjectId } from './../ids';
import type { CompiledVocabulary } from './vocabulary';
import type { UnresolvedNounPhrase } from './grammar';

export type ResolveResult =
  | { kind: 'resolved'; id: ObjectId | NpcId }
  | { kind: 'ambiguous'; candidates: (ObjectId | NpcId)[] }
  | { kind: 'none' };

/** Which vocabulary a phrase resolves against — `'npc'` for `V npc about topic`'s npc slot; `'either'` for `dobj`/`iobj` (either kind of thing can fill those slots). */
export type ResolveRole = 'npc' | 'either';

/** True when `id` is indexed anywhere in the vocabulary's npc noun/adjective tables — the only way to tell `ObjectId` and `NpcId` apart once they're both erased to plain strings in `ScopeView.visible`. */
export function isNpcId(vocab: CompiledVocabulary, id: ObjectId | NpcId): id is NpcId {
  for (const ids of vocab.npcNouns.values()) if (ids.includes(id as NpcId)) return true;
  for (const ids of vocab.npcAdjectives.values()) if (ids.includes(id as NpcId)) return true;
  return false;
}

function idsForNoun(vocab: CompiledVocabulary, noun: string, role: ResolveRole): (ObjectId | NpcId)[] {
  const ids: (ObjectId | NpcId)[] = [];
  if (role === 'either') ids.push(...(vocab.objectNouns.get(noun) ?? []));
  ids.push(...(vocab.npcNouns.get(noun) ?? []));
  return ids;
}

function hasAdjective(vocab: CompiledVocabulary, id: ObjectId | NpcId, adjective: string): boolean {
  return (vocab.objectAdjectives.get(adjective) ?? []).includes(id as ObjectId) ||
    (vocab.npcAdjectives.get(adjective) ?? []).includes(id as NpcId);
}

/** Every word (noun or adjective) the vocabulary indexes `id` under, object or npc — used by disambiguation-answer matching (`interpreter.ts`), which is forgiving about which word class an answer word belongs to. */
export function knownWordsFor(vocab: CompiledVocabulary, id: ObjectId | NpcId): Set<string> {
  const words = new Set<string>();
  for (const [word, ids] of vocab.objectNouns) if (ids.includes(id as ObjectId)) words.add(word);
  for (const [word, ids] of vocab.objectAdjectives) if (ids.includes(id as ObjectId)) words.add(word);
  for (const [word, ids] of vocab.npcNouns) if (ids.includes(id as NpcId)) words.add(word);
  for (const [word, ids] of vocab.npcAdjectives) if (ids.includes(id as NpcId)) words.add(word);
  return words;
}

/**
 * Resolves an `UnresolvedNounPhrase` (task 9) against `visible` (§3.2's
 * scope). Zero noun matches → `'none'` (§3.6 rung 3/4 territory, handled by
 * the caller). One candidate after ranking → `'resolved'`. More than one →
 * `'ambiguous'`, carrying the ranked pool (§3.3's disambiguation).
 */
export function resolveNounPhrase(
  vocab: CompiledVocabulary,
  visible: readonly (ObjectId | NpcId)[],
  phrase: UnresolvedNounPhrase,
  role: ResolveRole,
): ResolveResult {
  const nounIds = [...new Set(idsForNoun(vocab, phrase.noun, role))].filter((id) => visible.includes(id));
  if (nounIds.length === 0) return { kind: 'none' };
  if (phrase.adjectives.length === 0) {
    return nounIds.length === 1 ? { kind: 'resolved', id: nounIds[0]! } : { kind: 'ambiguous', candidates: nounIds };
  }
  const fullMatches = nounIds.filter((id) => phrase.adjectives.every((adj) => hasAdjective(vocab, id, adj)));
  const pool = fullMatches.length > 0 ? fullMatches : nounIds;
  return pool.length === 1 ? { kind: 'resolved', id: pool[0]! } : { kind: 'ambiguous', candidates: pool };
}

/**
 * A display name for one candidate, synthesized from the vocabulary alone
 * (`ScopeView` carries no `WorldDef`/`name`, only compiled word tables) —
 * its first indexed noun, prefixed by its first indexed adjective if it has
 * one. Used both for the `question` text and the `options` list of a
 * `clarify` outcome (§3.3).
 */
export function candidateName(vocab: CompiledVocabulary, id: ObjectId | NpcId): string {
  const npc = isNpcId(vocab, id);
  const nounMap = npc ? vocab.npcNouns : vocab.objectNouns;
  const adjMap = npc ? vocab.npcAdjectives : vocab.objectAdjectives;
  let noun: string | undefined;
  for (const [word, ids] of nounMap) {
    if ((ids as (ObjectId | NpcId)[]).includes(id)) {
      noun = word;
      break;
    }
  }
  let adjective: string | undefined;
  for (const [word, ids] of adjMap) {
    if ((ids as (ObjectId | NpcId)[]).includes(id)) {
      adjective = word;
      break;
    }
  }
  const parts = [adjective, noun].filter((w): w is string => w !== undefined);
  return parts.length > 0 ? parts.join(' ') : id;
}

/** "a, b, or c" / "a or b" / "a" — the join `question`/prose lists use throughout §3.3. */
export function joinWithOr(items: readonly string[]): string {
  if (items.length <= 1) return items[0] ?? '';
  if (items.length === 2) return `${items[0]} or ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, or ${items[items.length - 1]}`;
}

// Vocabulary compiler (spec §3.2: "Vocabulary is compiled from content at
// load"). Every object/NPC contributes nouns and adjectives, rooms
// contribute names/aliases, verbs contribute surface-form words. Pure
// function of `WorldDef` — no state, no scope; noun-phrase RESOLUTION
// against what's actually visible right now is task 10's (`grammar.ts`
// only needs this to find candidate *words*, not candidate objects).

import type { NpcId, ObjectId, RoomId, TopicId, VerbId } from './../ids';
import type { VerbDef, WorldDef } from './../world';

export type VerbPattern = VerbDef['patterns'][number];

/** One verb surface form (`VerbDef.words[i]`), pre-tokenized for longest-match. */
export interface CompiledVerb {
  id: VerbId;
  /** The words of exactly one surface form, e.g. `['turn', 'on']` for the 'turn on' entry. */
  words: string[];
  patterns: VerbPattern[];
  preps: string[];
}

export interface CompiledVocabulary {
  /**
   * Every verb surface form, longest word-count first — this is what makes
   * longest-match work: trying `['turn', 'on']` before `['turn']` is what
   * stops "turn on lamp" parsing as verb TURN with a stray "on" left in
   * the noun phrase.
   */
  verbForms: CompiledVerb[];
  objectNouns: Map<string, ObjectId[]>;
  objectAdjectives: Map<string, ObjectId[]>;
  /**
   * Compound nouns (v0.14.0): a declared noun with a space in it ("button
   * panel", "far door", "shield door") is indexed here by its HEAD word, and
   * its leading words are indexed as the object's adjectives. The grammar
   * splits a phrase into adjectives + head word, so a whole-string key in
   * `objectNouns` was never consulted; before this map, "x far door" in
   * Corridor B4 reached whichever object listed a bare "door". A compound
   * claim ranks BELOW a bare-noun claim (`resolver.ts`): "panel" alone in B4
   * is the wall panel, which lists it, not the lift's "button panel".
   */
  objectCompoundHeads: Map<string, ObjectId[]>;
  /** The leading words of compound nouns, by object — an adjective only for the compound path (`resolver.ts`), never upgrading a bare-noun claim. */
  objectCompoundAdjectives: Map<string, ObjectId[]>;
  /**
   * `ObjectDefSlice.name` by id (v0.7.0) — what a disambiguation question
   * calls an object ("the billboard or the town limits sign?") instead of
   * the first indexed noun the vocabulary happens to hold for it, which
   * produced "the boards or the town number?" at Town Edge. Objects with no
   * `name` fall back to the vocab-derived guess (`candidateName`).
   */
  objectNames: Map<ObjectId, string>;
  npcNouns: Map<string, NpcId[]>;
  npcAdjectives: Map<string, NpcId[]>;
  /** As `objectCompoundHeads`, for NPC nouns ("front desk clerk"). */
  npcCompoundHeads: Map<string, NpcId[]>;
  npcCompoundAdjectives: Map<string, NpcId[]>;
  /**
   * `NpcDefSlice.pronoun` (§2.6/§3.4), reindexed by id for the parser's
   * `him`/`her`/`them` resolution (task 10) — the fallback-in-scope and
   * antecedent-tracking both need "which pronoun bucket does this NPC
   * belong to", not just "is this id an NPC at all" (`npcNouns`/
   * `npcAdjectives` alone can't answer that). Absent entry ⇒ the NPC
   * declared no `pronoun`, so it never participates in pronoun resolution.
   */
  npcPronouns: Map<NpcId, 'he' | 'she' | 'they'>;
  /** Full normalized alias phrase (e.g. "hotel room") → room id. Consumed by task 11's GO TO. */
  roomAliases: Map<string, RoomId>;
  /**
   * Every word any NPC's `topics` or `tellTopics` declares (§2.6, §8 task
   * 14), indexed to the `TopicId`(s) it reaches — mirrors `objectNouns`'s
   * shape (`addTo`, many-to-many). Not consulted by grammar/resolution:
   * `StructuredAction.topic` stays raw, unresolved text all the way through
   * `interpret()` (§3.1) — `npc.ts` is what actually matches a topic's
   * words against that raw string. This map exists for the same reason
   * `roomAliases`/the noun maps do beyond grammar matching itself: a
   * compiled, queryable index of authored vocabulary for validation
   * (`validate.ts`'s collision checks) and any future "what can I ask
   * about" affordance, built once at load rather than re-derived ad hoc.
   */
  topicWords: Map<string, TopicId[]>;
}

function addTo<K extends string, V>(map: Map<K, V[]>, key: K, value: V): void {
  const existing = map.get(key);
  if (existing === undefined) map.set(key, [value]);
  else existing.push(value);
}

function compileVerbForms(world: WorldDef): CompiledVerb[] {
  const forms: CompiledVerb[] = [];
  for (const def of Object.values(world.verbs ?? {})) {
    const verbDef = def!;
    for (const word of verbDef.words) {
      forms.push({
        id: verbDef.id,
        words: word.split(' ').filter((w) => w.length > 0),
        patterns: verbDef.patterns,
        preps: verbDef.preps ?? [],
      });
    }
  }
  // Longest surface form first (word count descending); stable otherwise
  // (Array#sort is stable per spec, so table order breaks ties).
  return forms.sort((a, b) => b.words.length - a.words.length);
}

function compileObjectVocabulary(
  world: WorldDef,
): Pick<CompiledVocabulary, 'objectNouns' | 'objectAdjectives' | 'objectCompoundHeads' | 'objectCompoundAdjectives' | 'objectNames'> {
  const objectNouns = new Map<string, ObjectId[]>();
  const objectAdjectives = new Map<string, ObjectId[]>();
  const objectCompoundHeads = new Map<string, ObjectId[]>();
  const objectCompoundAdjectives = new Map<string, ObjectId[]>();
  const objectNames = new Map<ObjectId, string>();
  for (const [id, def] of Object.entries(world.objects ?? {})) {
    const objId = id as ObjectId;
    for (const noun of def!.nouns ?? []) indexNoun(noun, objId, objectNouns, objectCompoundAdjectives, objectCompoundHeads);
    for (const adj of def!.adjectives ?? []) addTo(objectAdjectives, adj, objId);
    const name = def!.name?.toLowerCase().trim();
    if (name) objectNames.set(objId, name);
  }
  return { objectNouns, objectAdjectives, objectCompoundHeads, objectCompoundAdjectives, objectNames };
}

/**
 * One declared noun into the three maps: a single word is a bare noun; a
 * compound ("button panel") keeps its whole-string key in `nouns` (other
 * consumers still see it), indexes its head word under `compoundHeads`, and
 * its leading words under `compoundAdjectives` — see `CompiledVocabulary.objectCompoundHeads`.
 */
function indexNoun<Id>(noun: string, id: Id, nouns: Map<string, Id[]>, adjectives: Map<string, Id[]>, compoundHeads: Map<string, Id[]>): void {
  const words = noun.split(' ').filter((w) => w.length > 0);
  addTo(nouns, noun, id);
  if (words.length < 2) return;
  const head = words[words.length - 1]!;
  if (!(compoundHeads.get(head) ?? []).includes(id)) addTo(compoundHeads, head, id);
  for (const adj of words.slice(0, -1)) if (!(adjectives.get(adj) ?? []).includes(id)) addTo(adjectives, adj, id);
}

function compileNpcVocabulary(world: WorldDef): Pick<CompiledVocabulary, 'npcNouns' | 'npcAdjectives' | 'npcCompoundHeads' | 'npcCompoundAdjectives' | 'npcPronouns'> {
  const npcNouns = new Map<string, NpcId[]>();
  const npcAdjectives = new Map<string, NpcId[]>();
  const npcCompoundHeads = new Map<string, NpcId[]>();
  const npcCompoundAdjectives = new Map<string, NpcId[]>();
  const npcPronouns = new Map<NpcId, 'he' | 'she' | 'they'>();
  for (const [id, def] of Object.entries(world.npcs ?? {})) {
    const npcId = id as NpcId;
    for (const noun of def!.nouns ?? []) indexNoun(noun, npcId, npcNouns, npcCompoundAdjectives, npcCompoundHeads);
    for (const adj of def!.adjectives ?? []) addTo(npcAdjectives, adj, npcId);
    if (def!.pronoun !== undefined) npcPronouns.set(npcId, def!.pronoun);
  }
  return { npcNouns, npcAdjectives, npcCompoundHeads, npcCompoundAdjectives, npcPronouns };
}

/** §8 task 14: indexes every `topics`/`tellTopics` word, across every NPC, to the `TopicId`(s) it reaches. */
function compileTopicVocabulary(world: WorldDef): Map<string, TopicId[]> {
  const topicWords = new Map<string, TopicId[]>();
  for (const def of Object.values(world.npcs ?? {})) {
    for (const topic of [...(def!.topics ?? []), ...(def!.tellTopics ?? [])]) {
      for (const word of topic.words) addTo(topicWords, word, topic.id);
    }
  }
  return topicWords;
}

function compileRoomAliases(world: WorldDef): Map<string, RoomId> {
  const roomAliases = new Map<string, RoomId>();
  for (const [id, def] of Object.entries(world.rooms ?? {})) {
    const roomId = id as RoomId;
    for (const alias of def!.aliases ?? []) roomAliases.set(alias.toLowerCase().trim(), roomId);
    if (def!.name !== undefined) roomAliases.set(def!.name.toLowerCase().trim(), roomId);
  }
  return roomAliases;
}

/** Compiles a `WorldDef`'s parser-facing vocabulary (spec §3.2). Pure; safe to call once per load. */
export function compileVocabulary(world: WorldDef): CompiledVocabulary {
  return {
    verbForms: compileVerbForms(world),
    ...compileObjectVocabulary(world),
    ...compileNpcVocabulary(world),
    roomAliases: compileRoomAliases(world),
    topicWords: compileTopicVocabulary(world),
  };
}

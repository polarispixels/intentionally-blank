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
  npcNouns: Map<string, NpcId[]>;
  npcAdjectives: Map<string, NpcId[]>;
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
   * Reserved seam: `WorldDef` has no `NpcDef.topics`/`TopicDef` yet (spec
   * §2.6 lands them in tasks 13-14 — see `world.ts`'s `NpcDefSlice` doc
   * comment). Always empty until that data exists; `compileVocabulary`
   * has nothing to read topic words from today.
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
): Pick<CompiledVocabulary, 'objectNouns' | 'objectAdjectives'> {
  const objectNouns = new Map<string, ObjectId[]>();
  const objectAdjectives = new Map<string, ObjectId[]>();
  for (const [id, def] of Object.entries(world.objects ?? {})) {
    const objId = id as ObjectId;
    for (const noun of def!.nouns ?? []) addTo(objectNouns, noun, objId);
    for (const adj of def!.adjectives ?? []) addTo(objectAdjectives, adj, objId);
  }
  return { objectNouns, objectAdjectives };
}

function compileNpcVocabulary(world: WorldDef): Pick<CompiledVocabulary, 'npcNouns' | 'npcAdjectives' | 'npcPronouns'> {
  const npcNouns = new Map<string, NpcId[]>();
  const npcAdjectives = new Map<string, NpcId[]>();
  const npcPronouns = new Map<NpcId, 'he' | 'she' | 'they'>();
  for (const [id, def] of Object.entries(world.npcs ?? {})) {
    const npcId = id as NpcId;
    for (const noun of def!.nouns ?? []) addTo(npcNouns, noun, npcId);
    for (const adj of def!.adjectives ?? []) addTo(npcAdjectives, adj, npcId);
    if (def!.pronoun !== undefined) npcPronouns.set(npcId, def!.pronoun);
  }
  return { npcNouns, npcAdjectives, npcPronouns };
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
    topicWords: new Map(),
  };
}

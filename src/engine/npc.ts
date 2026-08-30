// NPC conversation (spec §2.6, §8 task 14): ASK/TELL topic matching by
// words, knowledge gating, `unknownTopic`, SHOW via `showResponses`, TALK
// TO/HELLO greeting.
//
// ROUTING: ASK/TELL/SHOW/TALK-greeting are ordinary verbs — content authors
// them in `world.verbs` using the reserved ids below, exactly the
// convention `actions.ts`'s `BUILTIN_VERB_IDS` sets for TAKE/DROP/etc.
// `respond.ts` special-cases these ids in its rung-1/2 dispatch
// (`respondToAction`) the same way `hasBuiltinSemantics` lets it tell a
// built-in physical verb apart from an ordinary one; this module never
// touches `InterpretOutcome`/grammar itself.
//
// TOPIC MATCHING — words, not ids (§2.6: "words: the phrasings that reach
// it"). `StructuredAction.topic` is the parser's raw, never-resolved topic
// string (§3.1); `topicMatches` below splits it into whitespace tokens and
// matches a `TopicDef` when any single-word entry of its `words` appears as
// one of those tokens, or (for a rare multi-word entry) when the phrase
// appears as a substring of the raw topic. "ask about her brother" and
// "ask about brother" both reach a topic declaring `words: ['brother']`.
//
// AMBIGUOUS MATCH (a raw topic whose words satisfy more than one `TopicDef`
// at once — e.g. two topics both listing "family"): **first declared topic
// wins**, `Array.find`'s natural order — the same "first match, author
// orders it deliberately" convention `prose.ts`'s `ProseRule` selection and
// `world.ts`'s `ScheduleRule` resolution already use throughout this
// codebase. Not configurable; an author who wants topic B to win over topic
// A for a shared word puts B first.
//
// KNOWLEDGE GATING / NOT LEAKING (§14 task brief): `findTopic` below walks
// `topics` in order and, for each, requires BOTH a word match AND (if
// declared) `when` to hold before returning it — a topic whose words match
// but whose `when` doesn't hold is skipped exactly like a topic whose words
// never matched at all. The caller (`respondToTopic`) cannot tell those two
// cases apart, because there is nothing to tell apart: `findTopic` returns
// `undefined` either way, and both fall to the same `unknownTopic`. This is
// what makes "a character who genuinely doesn't know" and "a character
// who's not telling yet" indistinguishable to the player, structurally
// rather than by a special case an author could get wrong.
//
// PRESENCE: an NPC must already be in `ScopeView.visible` to ever reach a
// resolved `StructuredAction` with that NPC as its target (§3.2 noun
// resolution) — a not-here NPC never resolves, and the interpreter reports
// a `miss` instead, which `respond.ts`'s existing rung-3 `nounMiss.seen` /
// `nounMiss.unseen` split (via `hasSeenNpc`/`npcRoom`) already answers
// correctly. This module is therefore never reached for an absent NPC and
// has no presence check of its own to write.

import type { ActionClass, NpcId, ObjectId, VerbId } from './ids';
import { V } from './ids';
import { evaluate } from './cond';
import { apply } from './effects';
import { render } from './prose';
import type { GameEvent, GameState, NpcDefSlice, ShowResponseDef, TopicDef, WorldDef } from './world';
import { candidateName } from './parser';
import type { CompiledVocabulary } from './parser';

/**
 * Reserved verb ids content must use (in `world.verbs`) for the
 * corresponding conversation behavior — the same convention
 * `actions.ts`'s `BUILTIN_VERB_IDS` sets. A verb defined under a
 * *different* id, even with an identical `'V npc about topic'`/`'V dobj
 * prep iobj'` pattern, gets no special routing here and simply falls to
 * the ordinary rung-2 NPC-target default (`respond.ts`'s
 * `respondToNpcTarget`) — see that module's own dispatch.
 */
export const NPC_VERB_IDS = {
  ask: V('ask'),
  tell: V('tell'),
  show: V('show'),
  talk: V('talk'),
} as const;

export interface NpcResult {
  state: GameState;
  events: GameEvent[];
  /**
   * The behavioral-profile class this interaction tallies as (§8 task 16's
   * owed action-class plumbing, spec 04 §3). Topic responses (ASK/TELL,
   * matched or falling to `unknownTopic`) are `'social'` — §2.6's declared
   * default for `TopicDef.class`, applied uniformly here since attempting a
   * topic is itself a social move regardless of whether it landed. SHOW and
   * TALK TO/HELLO have no per-entry override field (`ShowResponseDef`/
   * `greeting` carry none), so they fall to the verb's own declared
   * `class` in `world.verbs` — the same "verb default, overridable per
   * handler" convention `actions.ts`'s `ActionResult.class` already uses.
   */
  class: ActionClass | null;
}

function requireNpc(world: WorldDef, npc: NpcId): NpcDefSlice {
  const def = world.npcs?.[npc];
  if (def === undefined) throw new Error(`npc: "${npc}" is not declared in world.npcs`);
  return def;
}

/**
 * The display name for `{name}`/`{dobj}` prose templating on an NPC —
 * `NpcDefSlice.name` (the task-1 fix, see that field's own doc comment on
 * why `candidateName` alone was the root cause of "the night marlow")
 * first, falling back to `candidateName`'s vocab-derived guess only when an
 * NPC authors no `name` of its own. `respond.ts` uses this same helper for
 * its own two NPC-naming call sites (`respondToNpcTarget`/
 * `respondToShowDefault`) so the fix is one function, not four call sites
 * independently patched.
 */
export function npcDisplayName(world: WorldDef, vocab: CompiledVocabulary, npc: NpcId): string {
  return world.npcs?.[npc]?.name ?? candidateName(vocab, npc);
}

// ---------------------------------------------------------------------------
// ASK / TELL — topic matching, knowledge gating, unknownTopic
// ---------------------------------------------------------------------------

function topicTokens(raw: string): string[] {
  return raw.split(/\s+/).filter((w) => w.length > 0);
}

/** Whether `topic`'s declared `words` reach the player's raw `rawTopic` phrase — see file header. */
function topicWordsMatch(topic: TopicDef, rawTopic: string): boolean {
  const tokens = topicTokens(rawTopic);
  return topic.words.some((word) => {
    const wordTokens = topicTokens(word);
    if (wordTokens.length <= 1) return tokens.includes(word);
    return tokens.join(' ').includes(word);
  });
}

/**
 * First topic (declaration order) whose words match `rawTopic` AND whose
 * `when` (if any) currently holds. Returns `undefined` for both "nothing
 * matched" and "something matched but isn't known yet" — see file header's
 * KNOWLEDGE GATING note for why that collapse is deliberate.
 */
function findTopic(world: WorldDef, state: GameState, topics: TopicDef[], rawTopic: string): TopicDef | undefined {
  return topics.find((t) => topicWordsMatch(t, rawTopic) && (t.when === undefined || evaluate(world, state, t.when)));
}

/** TELL falls back to `topics` when `tellTopics` isn't authored separately (task 14 assumption — see this task's report). */
function topicsFor(def: NpcDefSlice, tell: boolean): TopicDef[] {
  if (tell) return def.tellTopics ?? def.topics ?? [];
  return def.topics ?? [];
}

function respondToTopic(world: WorldDef, state: GameState, vocab: CompiledVocabulary, npc: NpcId, rawTopic: string, tell: boolean): NpcResult {
  const def = requireNpc(world, npc);
  const topic = findTopic(world, state, topicsFor(def, tell), rawTopic);
  if (topic === undefined) return respondToUnknownTopic(world, state, vocab, npc, def, rawTopic);

  const name = npcDisplayName(world, vocab, npc);
  const path = `npc.${npc}.topic.${topic.id}`;
  const { state: newState, events } = apply(world, state, [{ say: topic.response }, ...(topic.effects ?? [])], {
    name,
    dobj: name,
    topic: rawTopic,
    path,
  });
  return { state: newState, events, class: topic.class ?? 'social' };
}

/** `unknownTopic` — authored per NPC (§2.6: "the personality lives here"). Fires with a `topicMiss` diag (§8 task 14) — the playtester's signal for a conversation the player reasonably tried and the author never anticipated. */
function respondToUnknownTopic(world: WorldDef, state: GameState, vocab: CompiledVocabulary, npc: NpcId, def: NpcDefSlice, rawTopic: string): NpcResult {
  if (def.unknownTopic === undefined) {
    throw new Error(`npc: "${npc}" has topics/tellTopics but no unknownTopic authored`);
  }
  const name = npcDisplayName(world, vocab, npc);
  const rendered = render(world, state, `npc.${npc}.unknownTopic`, def.unknownTopic, { name, dobj: name, topic: rawTopic });
  return {
    state: rendered.state,
    events: [
      { type: 'line', kind: 'prose', text: rendered.text },
      { type: 'diag', code: 'topicMiss', detail: `npc "${npc}" — topic "${rawTopic}" not matched or not yet known` },
    ],
    class: 'social', // still an ASK/TELL attempt — §2.6's topic default applies whether or not it landed
  };
}

/** ASK <npc> ABOUT <topic>. */
export function respondToAsk(world: WorldDef, state: GameState, vocab: CompiledVocabulary, npc: NpcId, rawTopic: string): NpcResult {
  return respondToTopic(world, state, vocab, npc, rawTopic, false);
}

/** TELL <npc> ABOUT <topic>. */
export function respondToTell(world: WorldDef, state: GameState, vocab: CompiledVocabulary, npc: NpcId, rawTopic: string): NpcResult {
  return respondToTopic(world, state, vocab, npc, rawTopic, true);
}

// ---------------------------------------------------------------------------
// SHOW <object> TO <npc>
// ---------------------------------------------------------------------------

function matchesShow(entry: ShowResponseDef, object: ObjectId): boolean {
  return entry.objects === 'any' || entry.objects.includes(object);
}

/**
 * `showResponses` — matches on specific objects or `'any'`, gated by
 * `when`, first match wins (same convention as `findTopic`). Returns
 * `undefined` when nothing matches, rather than rendering anything itself:
 * `respond.ts` falls through to the SHOW verb's own ordinary rung-2
 * NPC-target default in that case — SHOW's `showResponses` is this verb's
 * rung 1, not a second ladder of its own.
 */
export function respondToShow(world: WorldDef, state: GameState, vocab: CompiledVocabulary, object: ObjectId, npc: NpcId): NpcResult | undefined {
  const def = requireNpc(world, npc);
  const entry = (def.showResponses ?? []).find((e) => matchesShow(e, object) && (e.when === undefined || evaluate(world, state, e.when)));
  if (entry === undefined) return undefined;

  const objectName = world.objects?.[object]?.name ?? object;
  const npcName = npcDisplayName(world, vocab, npc);
  const path = `npc.${npc}.show.${object}`;
  const { state: newState, events } = apply(world, state, [{ say: entry.response }, ...(entry.effects ?? [])], {
    name: objectName,
    dobj: objectName,
    iobj: npcName,
    path,
  });
  return { state: newState, events, class: world.verbs?.[NPC_VERB_IDS.show]?.class ?? null };
}

// ---------------------------------------------------------------------------
// TALK TO / HELLO — greeting
// ---------------------------------------------------------------------------

/**
 * TALK TO <npc> / HELLO <npc>. Returns `undefined` when the NPC has no
 * `greeting` authored, so `respond.ts` falls through to the verb's own
 * rung-2 NPC-target default (which the response-families doc already
 * leans person-facing for TALK TO, §0 note 3) rather than this module
 * inventing a second fallback family.
 */
export function respondToGreeting(world: WorldDef, state: GameState, vocab: CompiledVocabulary, npc: NpcId): NpcResult | undefined {
  const def = requireNpc(world, npc);
  if (def.greeting === undefined) return undefined;

  const name = npcDisplayName(world, vocab, npc);
  const rendered = render(world, state, `npc.${npc}.greeting`, def.greeting, { name, dobj: name });
  return {
    state: rendered.state,
    events: [{ type: 'line', kind: 'prose', text: rendered.text }],
    class: world.verbs?.[NPC_VERB_IDS.talk]?.class ?? null,
  };
}

/** Verb ids `hasNpcSemantics` recognizes — `respond.ts` uses this the same way it uses `actions.ts`'s `hasBuiltinSemantics`. */
export function hasNpcSemantics(verb: VerbId): boolean {
  return verb === NPC_VERB_IDS.ask || verb === NPC_VERB_IDS.tell || verb === NPC_VERB_IDS.show || verb === NPC_VERB_IDS.talk;
}

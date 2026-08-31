// `validate(world)` (spec §2.1, §8 task 7) — every cross-reference and
// authoring-completeness rule checkable against the current `WorldDef`
// slice (task 6's), run from a content test so a bad authoring choice fails
// `npm test`, not a play session hours in (§2.1's own framing).
//
// SCOPE NOTE: `WorldDef` does not yet declare `deaths` or `endings` —
// those land in a later task. `exits` (task 11), `events`/`topics` (tasks
// 13-14), and `puzzles` (task 16, including §4.3.4's clock-free-solution
// rule) are now declared and checked below (`checkRoomExits`/
// `checkWitnessedEvents`+`checkNpcConversation`/`checkPuzzles`). When a
// later task adds `deaths`/`endings` to `WorldDef`, it must extend this
// file with the matching rule at the same time, the same way this file's
// own rules were added alongside each earlier task's schema slice.
//
// Every rule below returns findings rather than throwing, and `validate`
// collects ALL of them in one pass (§8 task 7's own instruction: "return
// ALL findings, not just the first" — an author fixing content wants the
// whole list, not one error at a time).

import { BUILTIN_VERB_IDS } from './actions';
import type { Cond } from './cond';
import type { Effect } from './effects';
import type { ClueId, DayPhase, FlagId, MemoryId, NpcId, ObjectId, PlaceId, PuzzleId, QuestionId, RoomId, VerbId } from './ids';
import { compileVocabulary, NOISE_WORDS } from './parser';
import type { Prose, ProseRef, ProseRule } from './prose';
import { DEAD_REFUSED_FAMILY, ENDED_REFUSED_FAMILY } from './turn';
import type { ObjectDefSlice, TopicDef, VerbDef, WorldDef } from './world';

export interface Finding {
  /** Stable short id, e.g. `'unknown-room-ref'` — never renamed once shipped (content tests key off it). */
  code: string;
  severity: 'error' | 'warning';
  /** Names the offending id and the authored path it was found at. */
  message: string;
}

/** Runs every implemented rule against `world` and returns every finding (errors and warnings alike). */
export function validate(world: WorldDef): Finding[] {
  const findings: Finding[] = [];

  checkObjects(world, findings);
  checkRoomDarkConds(world, findings);
  checkSchedules(world, findings);
  checkNpcConversation(world, findings);
  checkResponseFamilies(world, findings);
  checkQuestionPhrasing(world, findings);
  checkPhaseTable(world, findings);
  checkVerbDefaults(world, findings);
  checkPlotCriticalStrandEffects(world, findings);
  checkVocabularyCollisions(world, findings);
  checkRoomExits(world, findings);
  checkRoomDescriptionMentionsPortable(world, findings);
  checkNoiseWordVocabulary(world, findings);
  checkWitnessedEvents(world, findings);
  checkQuestionAnswers(world, findings);
  checkKnowledgeConds(world, findings);
  checkClueQuestionRefs(world, findings);
  checkPuzzles(world, findings);
  checkDeathEndingResponseFamilies(world, findings);
  checkDoorExitsCanReopen(world, findings);
  checkObjectNounCollisions(world, findings);

  return findings;
}

// ---------------------------------------------------------------------------
// Small finding constructors
// ---------------------------------------------------------------------------

function error(code: string, message: string): Finding {
  return { code, severity: 'error', message };
}

function warning(code: string, message: string): Finding {
  return { code, severity: 'warning', message };
}

// ---------------------------------------------------------------------------
// Referential-integrity leaf checks, shared by every site below
// ---------------------------------------------------------------------------

function checkRoomRef(world: WorldDef, id: RoomId, path: string, findings: Finding[]): void {
  if (world.rooms?.[id] === undefined) {
    findings.push(error('unknown-room-ref', `${path} targets undeclared room "${id}"`));
  }
}

function checkObjectRef(world: WorldDef, id: ObjectId, path: string, findings: Finding[]): void {
  if (world.objects?.[id] === undefined) {
    findings.push(error('unknown-object-ref', `${path} references undeclared object "${id}"`));
  }
}

function checkNpcRef(world: WorldDef, id: NpcId, path: string, findings: Finding[]): void {
  if (world.npcs?.[id] === undefined) {
    findings.push(error('unknown-npc-ref', `${path} references undeclared npc "${id}"`));
  }
}

function checkFlagRef(world: WorldDef, id: FlagId, path: string, findings: Finding[]): void {
  if (world.flags[id] === undefined) {
    findings.push(error('unknown-flag-ref', `${path} references undeclared flag "${id}"`));
  }
}

function checkMemoryRef(world: WorldDef, id: MemoryId, path: string, findings: Finding[]): void {
  if (world.memories?.[id] === undefined) {
    findings.push(error('unknown-memory-ref', `${path} references undeclared memory "${id}"`));
  }
}

function checkClueRef(world: WorldDef, id: ClueId, path: string, findings: Finding[]): void {
  if (world.clues?.[id] === undefined) {
    findings.push(error('unknown-clue-ref', `${path} references undeclared clue "${id}"`));
  }
}

function checkQuestionRef(world: WorldDef, id: QuestionId, path: string, findings: Finding[]): void {
  if (world.questions?.[id] === undefined) {
    findings.push(error('unknown-question-ref', `${path} references undeclared question "${id}"`));
  }
}

/** `prop`'s target is `ObjectId | NpcId` (same disambiguation `effects.ts`'s `setProp` uses: object membership first). */
function checkPropTargetRef(world: WorldDef, id: ObjectId | NpcId, path: string, findings: Finding[]): void {
  if (world.objects?.[id as ObjectId] !== undefined) return;
  if (world.npcs?.[id as NpcId] !== undefined) return;
  findings.push(error('unknown-prop-target', `${path} references undeclared object/npc "${id}"`));
}

/** Checks a `PlaceId`'s referential target — shared by `ObjectDefSlice.location` and `Cond`'s `objectAt` place. */
function checkPlaceRef(world: WorldDef, place: PlaceId, path: string, findings: Finding[]): void {
  if (typeof place === 'string') {
    if (place === 'inventory' || place === 'worn' || place === 'self' || place === 'nowhere') return;
    checkRoomRef(world, place, path, findings);
    return;
  }
  if ('in' in place) {
    checkObjectRef(world, place.in, path, findings);
    return;
  }
  if ('on' in place) {
    checkObjectRef(world, place.on, path, findings);
    return;
  }
  if ('npc' in place) {
    checkNpcRef(world, place.npc, path, findings);
  }
}

// ---------------------------------------------------------------------------
// Cond tree walking
// ---------------------------------------------------------------------------

/** Visits every leaf `Cond` (i.e. not `all`/`any`/`not`) reachable from `cond`. */
function walkCond(cond: Cond, visit: (leaf: Exclude<Cond, { all: Cond[] } | { any: Cond[] } | { not: Cond }>) => void): void {
  if ('all' in cond) {
    cond.all.forEach((c) => walkCond(c, visit));
    return;
  }
  if ('any' in cond) {
    cond.any.forEach((c) => walkCond(c, visit));
    return;
  }
  if ('not' in cond) {
    walkCond(cond.not, visit);
    return;
  }
  visit(cond);
}

/** Referential-integrity checks for every leaf of `cond` (flags, objects, npcs, rooms, memories, clues, questions). */
function checkCondRefs(world: WorldDef, cond: Cond, path: string, findings: Finding[]): void {
  walkCond(cond, (leaf) => {
    if ('flag' in leaf) checkFlagRef(world, leaf.flag, path, findings);
    else if ('has' in leaf) checkObjectRef(world, leaf.has, path, findings);
    else if ('at' in leaf) checkRoomRef(world, leaf.at, path, findings);
    else if ('objectAt' in leaf) {
      checkObjectRef(world, leaf.objectAt[0], path, findings);
      checkPlaceRef(world, leaf.objectAt[1], path, findings);
    } else if ('objectState' in leaf) checkObjectRef(world, leaf.objectState[0], path, findings);
    else if ('prop' in leaf) checkPropTargetRef(world, leaf.prop[0], path, findings);
    else if ('visited' in leaf) checkRoomRef(world, leaf.visited, path, findings);
    else if ('memory' in leaf) checkMemoryRef(world, leaf.memory, path, findings);
    else if ('clue' in leaf) checkClueRef(world, leaf.clue, path, findings);
    else if ('question' in leaf) checkQuestionRef(world, leaf.question[0], path, findings);
    else if ('npcAt' in leaf) {
      checkNpcRef(world, leaf.npcAt[0], path, findings);
      checkRoomRef(world, leaf.npcAt[1], path, findings);
    } else if ('met' in leaf) checkNpcRef(world, leaf.met, path, findings);
    // clock / clockPhase / weekday / profileLeader: no id reference to check.
  });
}

// ---------------------------------------------------------------------------
// Objects: location referential integrity
// ---------------------------------------------------------------------------

function checkObjects(world: WorldDef, findings: Finding[]): void {
  for (const [id, def] of Object.entries(world.objects ?? {})) {
    checkPlaceRef(world, def!.location, `object.${id}.location`, findings);
  }
}

// ---------------------------------------------------------------------------
// Rooms: dark Cond referential integrity + the light-source smell (§2.4)
// ---------------------------------------------------------------------------

function checkRoomDarkConds(world: WorldDef, findings: Finding[]): void {
  for (const [id, def] of Object.entries(world.rooms ?? {})) {
    const dark = def!.dark;
    if (dark === undefined || dark === true) continue;
    const path = `room.${id}.dark`;
    checkCondRefs(world, dark, path, findings);
    checkDarkNoLightSource(world, dark, path, findings);
  }
}

/**
 * §2.4: the baseline `dark` cond must never itself mention a light source —
 * that's what makes a lit lamp defeat darkness through `isDark`'s own
 * light-source-in-scope check, not through the room's cond. A smell, not
 * necessarily wrong (a room could reference a lightSource object for some
 * other reason without meaning to gate darkness on it), so this is a
 * warning, per the task's own design note.
 */
function checkDarkNoLightSource(world: WorldDef, cond: Cond, path: string, findings: Finding[]): void {
  walkCond(cond, (leaf) => {
    let objectId: ObjectId | undefined;
    if ('objectAt' in leaf) objectId = leaf.objectAt[0];
    else if ('objectState' in leaf) objectId = leaf.objectState[0];
    else if ('has' in leaf) objectId = leaf.has;
    else if ('prop' in leaf && world.objects?.[leaf.prop[0] as ObjectId] !== undefined) objectId = leaf.prop[0] as ObjectId;

    if (objectId !== undefined && world.objects?.[objectId]?.lightSource === true) {
      findings.push(
        warning(
          'dark-cond-references-light-source',
          `${path} references light source object "${objectId}" — isDark()'s own light-source-in-scope check already defeats baseline darkness; the baseline cond shouldn't also gate on it`,
        ),
      );
    }
  });
}

// ---------------------------------------------------------------------------
// NPC schedules: referential integrity + the npcAt recursion ban (§1.1)
// ---------------------------------------------------------------------------

function checkSchedules(world: WorldDef, findings: Finding[]): void {
  for (const [id, def] of Object.entries(world.npcs ?? {})) {
    const rules = def!.schedule ?? [];
    rules.forEach((rule, i) => {
      const roomPath = `npc.${id}.schedule[${i}].room`;
      if (rule.room !== 'offstage') checkRoomRef(world, rule.room, roomPath, findings);

      if (rule.when === undefined) return;
      const whenPath = `npc.${id}.schedule[${i}].when`;
      checkCondRefs(world, rule.when, whenPath, findings);
      checkNoNpcAt(rule.when, whenPath, findings);
    });
  }
}

/**
 * §1.1 / cond.ts's own comment: `npcRoom`'s schedule fallback (`cond.ts`,
 * `scheduledRoom`) has no cycle guard, so a `ScheduleRule.when` that
 * (transitively) needs `npcAt` to resolve can recurse `npcRoom` forever.
 * Cycle-safe would mean detecting only *self*-reference cycles (or
 * multi-npc mutual cycles); this rule takes the stricter, simpler reading —
 * ANY `npcAt` anywhere in a schedule `when`, for any npc — because (a) that
 * is what the comment literally says ("a schedule rule's `when` may
 * therefore not reference `npcAt`"), (b) it is a hard superset of the
 * guaranteed-recursion self-reference case, and (c) real cross-npc mutual-
 * cycle detection is a graph-analysis feature, not a builder-level
 * improvisation. See the task report for this decision.
 */
function checkNoNpcAt(cond: Cond, path: string, findings: Finding[]): void {
  walkCond(cond, (leaf) => {
    if ('npcAt' in leaf) {
      findings.push(
        error(
          'schedule-references-npcAt',
          `${path} references npcAt — a schedule rule's "when" must not depend on npcAt, or npcRoom's schedule fallback can recurse forever`,
        ),
      );
    }
  });
}

// ---------------------------------------------------------------------------
// NPC conversation (§2.6, §8 task 14): `when` referential integrity for
// every topic/tellTopic/showResponses entry, `showResponses.objects`
// referential integrity, prose rotation/fallback completeness for every
// topic/unknownTopic/greeting node, the plot-critical strand guard
// extended to topic/show effects (§2.5, alongside the same rule for
// handler effects above — this file's own SCOPE NOTE asks a later task to
// extend it exactly this way when it adds a new authored-effects field),
// and the completeness rule §14's task brief calls out as load-bearing:
// `unknownTopic` is required by any NPC that declares `topics`/
// `tellTopics`/`showResponses` at all — `npc.ts` throws at runtime
// otherwise; this turns that into a build-time finding.
// ---------------------------------------------------------------------------

function checkTopicList(world: WorldDef, npcId: string, topics: TopicDef[] | undefined, label: string, findings: Finding[]): void {
  (topics ?? []).forEach((topic, i) => {
    const path = `npc.${npcId}.${label}[${i}]`;
    checkRotationsAndFallback(topic.response, `${path}.response`, findings);
    if (topic.when !== undefined) checkCondRefs(world, topic.when, `${path}.when`, findings);
    checkPlotCriticalStrand(world, topic.effects ?? [], `${path}.effects`, findings);
  });
}

function checkNpcConversation(world: WorldDef, findings: Finding[]): void {
  for (const [id, def] of Object.entries(world.npcs ?? {})) {
    const hasConversation = (def!.topics?.length ?? 0) > 0 || (def!.tellTopics?.length ?? 0) > 0 || (def!.showResponses?.length ?? 0) > 0;
    if (hasConversation && def!.unknownTopic === undefined) {
      findings.push(
        error(
          'npc-missing-unknown-topic',
          `npc.${id} declares topics/tellTopics/showResponses but no unknownTopic — a topic that doesn't match falls through to it at runtime, and there is nothing authored to fall to (§2.6)`,
        ),
      );
    }
    if (def!.unknownTopic !== undefined) checkRotationsAndFallback(def!.unknownTopic, `npc.${id}.unknownTopic`, findings);
    if (def!.greeting !== undefined) checkRotationsAndFallback(def!.greeting, `npc.${id}.greeting`, findings);

    checkTopicList(world, id, def!.topics, 'topics', findings);
    checkTopicList(world, id, def!.tellTopics, 'tellTopics', findings);

    (def!.showResponses ?? []).forEach((entry, i) => {
      const path = `npc.${id}.showResponses[${i}]`;
      checkRotationsAndFallback(entry.response, `${path}.response`, findings);
      if (entry.when !== undefined) checkCondRefs(world, entry.when, `${path}.when`, findings);
      checkPlotCriticalStrand(world, entry.effects ?? [], `${path}.effects`, findings);
      if (entry.objects !== 'any') {
        entry.objects.forEach((objId, oi) => checkObjectRef(world, objId, `${path}.objects[${oi}]`, findings));
      }
    });
  }
}

// ---------------------------------------------------------------------------
// Response families: ProseRef existence/cycles + rotation/fallback completeness
// ---------------------------------------------------------------------------

function isProseRef(value: unknown): value is ProseRef {
  return typeof value === 'object' && value !== null && !Array.isArray(value) && 'ref' in value;
}

/** The `ProseRef`s directly reachable from `prose` in one hop (top-level, or one per `ProseRule.text`). */
function directRefs(prose: Prose): string[] {
  if (isProseRef(prose)) return [prose.ref];
  if (typeof prose === 'string') return [];
  if (prose.length === 0) return [];
  if (typeof prose[0] === 'string') return [];
  return (prose as ProseRule[]).filter((rule) => isProseRef(rule.text)).map((rule) => (rule.text as ProseRef).ref);
}

/** §2.2's rotation/fallback authoring-completeness rules for one `Prose` node. */
function checkRotationsAndFallback(prose: Prose, path: string, findings: Finding[]): void {
  if (isProseRef(prose)) return;
  if (typeof prose === 'string') return;
  if (prose.length === 0) {
    findings.push(error('prose-empty-rotation', `${path} is an empty array (no rotation variants / rules)`));
    return;
  }
  if (typeof prose[0] === 'string') return; // non-empty string[] rotation: fine

  const rules = prose as ProseRule[];
  const last = rules[rules.length - 1]!;
  if (last.when !== undefined) {
    findings.push(
      error(
        'prose-missing-fallback',
        `${path}: the last rule has a "when" — some state could match no rule and render nothing`,
      ),
    );
  }
  rules.forEach((rule, i) => {
    if (Array.isArray(rule.text) && rule.text.length === 0) {
      findings.push(error('prose-empty-rotation', `${path}[${i}].text is an empty rotation array`));
    }
  });
}

function checkResponseFamilies(world: WorldDef, findings: Finding[]): void {
  const responses = world.responses ?? {};
  const keys = Object.keys(responses);

  for (const key of keys) {
    const prose = responses[key]!;
    checkRotationsAndFallback(prose, `responses.${key}`, findings);
    for (const ref of directRefs(prose)) {
      if (!(ref in responses)) {
        findings.push(error('prose-ref-unknown-family', `responses.${key} refs unknown family "${ref}"`));
      }
    }
  }

  const state = new Map<string, 'visiting' | 'done'>();
  const detectCycle = (key: string, path: string[]): void => {
    const mark = state.get(key);
    if (mark === 'done') return;
    if (mark === 'visiting') {
      findings.push(error('prose-ref-cycle', `responses.${path[0]} has a cyclic ref chain: ${[...path, key].join(' -> ')}`));
      return;
    }
    state.set(key, 'visiting');
    const prose = responses[key];
    if (prose !== undefined) {
      for (const ref of directRefs(prose)) {
        if (ref in responses) detectCycle(ref, [...path, key]);
      }
    }
    state.set(key, 'done');
  };
  for (const key of keys) detectCycle(key, []);
}

// ---------------------------------------------------------------------------
// Room description vs. portable-object staleness (§2.5, `listedAs` task) —
// the bug class that shipped `your_room`'s original "beside it, crown
// down, a fedora" line: prose that names an object's noun/adjective as
// part of the room's own authored text goes stale the instant the object
// moves, because nothing re-renders that text when state changes.
// `ObjectDefSlice.listedAs` (this task) is the fix — a portable object's
// room-presence is rendered from state, after the description, instead of
// baked into it; this rule is the tripwire that stops the next room from
// shipping the same mistake.
// ---------------------------------------------------------------------------

function escapeRegExp(word: string): string {
  return word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Every literal string leaf reachable from `prose` without resolving a `ProseRef` (a ref's own family is a different node's text, not this one's). */
function collectLiteralStrings(prose: Prose, out: string[]): void {
  if (isProseRef(prose)) return;
  if (typeof prose === 'string') {
    out.push(prose);
    return;
  }
  if (prose.length === 0) return;
  if (typeof prose[0] === 'string') {
    out.push(...(prose as string[]));
    return;
  }
  for (const rule of prose as ProseRule[]) {
    if (typeof rule.text === 'string') out.push(rule.text);
    else if (Array.isArray(rule.text)) out.push(...rule.text);
    // rule.text as ProseRef: skip — that family's text belongs to its own node.
  }
}

/**
 * Warns when a room's `description` text contains a whole word matching a
 * noun or adjective belonging to a `portable` object *authored* at that
 * room (`ObjectDefSlice.location === roomId` — a static, authoring-time
 * check against the declared default, not a runtime/overlay one; §1.1
 * state is never available to `validate`). This is exactly the shape of
 * bug that shipped: `your_room`'s description said "...a fedora" in prose
 * while `FEDORA` itself is portable and placed there, so the sentence went
 * stale the moment a player took the hat off the floor.
 *
 * A WARNING, not an error, because it has real false positives by design
 * (this task's brief): a description can legitimately use a common word
 * that also happens to be a *different* object's adjective — nothing
 * static can tell "this sentence is staging the object" from "this
 * sentence uses the same word for something else" without understanding
 * English. (`your_room` itself trips this: the dark variant's "a grey
 * rectangle" — the window — shares the word "grey" with `FEDORA`'s own
 * adjective; a real, accepted false positive, not a bug in this rule.)
 *
 * KNOWN GAPS, stated rather than silently accepted:
 *   - Only objects placed *directly* in the room (`location === roomId`)
 *     are checked — one placed `{ on }`/`{ in }` something that is itself
 *     in the room is not, so the same bug one level of nesting down ships
 *     uncaught.
 *   - Only `description` is scanned, not `firstVisit` or handler prose,
 *     which can go equally stale.
 *   - Whole-word matching only (`\b`) — an inflected form ("fedoras",
 *     "felted") is missed in the false-negative direction.
 *   - This rule is blind to movement by design: it runs once against
 *     authored data, not per-state, so it can never know whether a mention
 *     describes the object's *current* position — that judgment is exactly
 *     what `listedAs` exists to take over from prose.
 */
function checkRoomDescriptionMentionsPortable(world: WorldDef, findings: Finding[]): void {
  for (const [roomId, roomDef] of Object.entries(world.rooms ?? {})) {
    if (roomDef!.description === undefined) continue;
    const texts: string[] = [];
    collectLiteralStrings(roomDef!.description, texts);
    if (texts.length === 0) continue;
    const combined = texts.join('\n').toLowerCase();

    for (const [objId, objDef] of Object.entries(world.objects ?? {})) {
      if (objDef!.portable !== true) continue;
      if (objDef!.location !== roomId) continue;

      const words = [...(objDef!.nouns ?? []), ...(objDef!.adjectives ?? [])];
      for (const word of words) {
        const re = new RegExp(`\\b${escapeRegExp(word.toLowerCase())}\\b`);
        if (re.test(combined)) {
          findings.push(
            warning(
              'room-description-mentions-portable',
              `room.${roomId}.description mentions "${word}", also a noun/adjective of portable object "${objId}" (authored at this room) — if this word describes ${objId}'s position, the sentence will go stale the moment a player moves it; consider a "listedAs" line instead (or ignore if this is a genuine unrelated use of the word)`,
            ),
          );
          break; // one warning per object per room is enough
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Question phrasing (§6.2)
// ---------------------------------------------------------------------------

/**
 * §6.2: questions must read as questions, not quest markers ("Find the
 * notebook"). Heuristic floor: the authored text, trimmed, ends with a
 * literal `?` (optionally followed by a closing quote/paren, so `He asked,
 * "who am I?"` still passes). Known limits, stated for the report rather
 * than hidden: false positive on a legitimately-phrased question that ends
 * in something other than `?` by a typo or stylistic choice (none expected
 * in practice — §6.2's own examples all end in `?`); false negative on an
 * imperative sentence dressed up with a trailing `?` ("Find the notebook,
 * would you?") — the heuristic cannot detect *grammatical* mood, only
 * punctuation, so that case ships un-caught and stays a review-time call.
 */
const QUESTION_MARK_TAIL = /\?["')]*$/;

function checkQuestionPhrasing(world: WorldDef, findings: Finding[]): void {
  for (const [id, def] of Object.entries(world.questions ?? {})) {
    const text = def!.text;
    if (!QUESTION_MARK_TAIL.test(text.trim())) {
      findings.push(
        error(
          'question-not-phrased-as-question',
          `question.${id}.text is not phrased as a question ("${text}") — questions read as questions, never as quest markers`,
        ),
      );
    }
  }
}

// ---------------------------------------------------------------------------
// meta.phases: duplicate start minute (clock.ts's own comment flags this
// as validate's job — `phase()` throws at runtime on the ambiguity, which
// this rule turns into a content-test failure instead).
// ---------------------------------------------------------------------------

function checkPhaseTable(world: WorldDef, findings: Finding[]): void {
  const entries = Object.entries(world.meta.phases) as [DayPhase, number][];
  const seen = new Map<number, DayPhase>();
  for (const [name, start] of entries) {
    const prior = seen.get(start);
    if (prior !== undefined) {
      findings.push(
        error(
          'meta-duplicate-phase-start',
          `meta.phases: "${prior}" and "${name}" both start at minute ${start} — ambiguous, and clock.ts's phase() throws on it at runtime`,
        ),
      );
      continue;
    }
    seen.set(start, name);
  }
}

// ---------------------------------------------------------------------------
// Verbs: every non-meta verb needs a non-null `default` family (§2.9, §8
// task 8's first owed rule). Without this, response-ladder rung 2 (§3.6)
// has nothing to fall back to for any verb–object pair nobody hand-
// authored a handler for, and the game says nothing instead of something
// in-voice. Meta verbs (SAVE/LOAD/UNDO/HINT/MAP…) are exempt — they never
// reach the ladder, being intercepted by the session layer.
// ---------------------------------------------------------------------------

function checkVerbDefaults(world: WorldDef, findings: Finding[]): void {
  for (const [id, def] of Object.entries(world.verbs ?? {})) {
    if (def!.meta === true) continue;
    if (def!.default === null) {
      findings.push(
        error(
          'verb-missing-default-family',
          `verb.${id}.default is null — every non-meta verb needs a non-null default prose family for response-ladder rung 2 (§3.6)`,
        ),
      );
    }
  }
}

// ---------------------------------------------------------------------------
// No authored effect strands a plotCritical object (§2.5, §8 task 8's
// second owed rule). Walks every object's `handlers[*].effects`, recursing
// into `if.then`/`if.else`, looking for a literal `{ move: [id, place] }`
// that sends a `plotCritical` object to `'nowhere'` or `{ npc: … }`.
// `{ script }` effects are opaque here by construction — a script can only
// be caught by the runtime guard in `effects.ts`'s `move()` (task 5),
// which this rule sits beside, not on top of.
// ---------------------------------------------------------------------------

function walkEffects(effects: readonly Effect[], visit: (effect: Effect) => void): void {
  for (const effect of effects) {
    visit(effect);
    if ('if' in effect) {
      walkEffects(effect.if.then, visit);
      if (effect.if.else !== undefined) walkEffects(effect.if.else, visit);
    }
  }
}

/** Shared by every authored-`Effect[]` site (rung-1 handlers, §8 task 14's npc topics/showResponses) — §2.5's runtime guard, made a build-time finding. */
function checkPlotCriticalStrand(world: WorldDef, effects: readonly Effect[], path: string, findings: Finding[]): void {
  walkEffects(effects, (effect) => {
    if (!('move' in effect)) return;
    const [targetId, place] = effect.move;
    if (world.objects?.[targetId]?.plotCritical !== true) return;
    const strandsToNowhere = place === 'nowhere';
    const strandsToNpc = typeof place === 'object' && place !== null && 'npc' in place;
    if (strandsToNowhere || strandsToNpc) {
      findings.push(
        error(
          'effect-strands-plot-critical',
          `${path} moves plot-critical object "${targetId}" to ${JSON.stringify(place)} — plot-critical objects may never leave the reachable world (§2.5)`,
        ),
      );
    }
  });
}

function checkPlotCriticalStrandEffects(world: WorldDef, findings: Finding[]): void {
  for (const [objId, def] of Object.entries(world.objects ?? {})) {
    const handlers = def!.handlers ?? [];
    handlers.forEach((handler, hi) => {
      checkPlotCriticalStrand(world, handler.effects, `object.${objId}.handlers[${hi}].effects`, findings);
    });
  }
}

// ---------------------------------------------------------------------------
// Death/ending refusal families (`turn.ts`'s §5 phase gate, task 18 follow-
// up). A world that can kill or end the player and has nothing to say
// afterward is a content bug, not a runtime surprise: once a `{ die }`/
// `{ end }` effect exists anywhere in the world, the matching
// `DEAD_REFUSED_FAMILY`/`ENDED_REFUSED_FAMILY` global family must be
// authored, or the phase gate has nothing to render for every subsequent
// non-meta action.
//
// `WorldDef` has no `deaths`/`endings` registry (this file's own SCOPE
// NOTE, above) — "declares a death/ending" therefore means "authors a
// `{die}`/`{end}` effect somewhere," found by walking every `Effect[]`
// site this file already knows about (object handlers, npc topics/
// tellTopics/showResponses, events, puzzle `onSolved`), recursing into
// `if.then`/`if.else` via the same `walkEffects` the plot-critical-strand
// rule above uses. `{ script }` effects are opaque here for the same
// reason they're opaque to that rule — a script could theoretically call
// `apply()` with a `{die}`/`{end}` effect of its own construction, which
// this build-time walk can't see; that stays a runtime concern, not this
// rule's to catch.
// ---------------------------------------------------------------------------

function collectAllEffectLists(world: WorldDef): { effects: readonly Effect[] }[] {
  const lists: { effects: readonly Effect[] }[] = [];
  for (const def of Object.values(world.objects ?? {})) {
    for (const handler of def!.handlers ?? []) lists.push({ effects: handler.effects });
  }
  for (const def of Object.values(world.npcs ?? {})) {
    for (const topic of def!.topics ?? []) lists.push({ effects: topic.effects ?? [] });
    for (const topic of def!.tellTopics ?? []) lists.push({ effects: topic.effects ?? [] });
    for (const show of def!.showResponses ?? []) lists.push({ effects: show.effects ?? [] });
  }
  for (const def of Object.values(world.events ?? {})) lists.push({ effects: def!.effects });
  for (const def of Object.values(world.puzzles ?? {})) {
    if (def!.onSolved !== undefined) lists.push({ effects: def!.onSolved });
  }
  return lists;
}

function checkDeathEndingResponseFamilies(world: WorldDef, findings: Finding[]): void {
  let hasDeath = false;
  let hasEnding = false;
  for (const { effects } of collectAllEffectLists(world)) {
    walkEffects(effects, (effect) => {
      if ('die' in effect) hasDeath = true;
      if ('end' in effect) hasEnding = true;
    });
  }

  if (hasDeath && world.responses?.[DEAD_REFUSED_FAMILY] === undefined) {
    findings.push(
      error(
        'missing-dead-refused-family',
        `world authors a {die} effect somewhere but responses["${DEAD_REFUSED_FAMILY}"] is not declared — the phase gate (turn.ts) has nothing to say once the player is dead`,
      ),
    );
  }
  if (hasEnding && world.responses?.[ENDED_REFUSED_FAMILY] === undefined) {
    findings.push(
      error(
        'missing-ended-refused-family',
        `world authors an {end} effect somewhere but responses["${ENDED_REFUSED_FAMILY}"] is not declared — the phase gate (turn.ts) has nothing to say once the story has ended`,
      ),
    );
  }
}

// ---------------------------------------------------------------------------
// Room exits: referential integrity (§2.4, §8 task 11's `GO TO`). Every
// `exits[].to` must name a declared room; `door` (if any) a declared
// object; `when` (if any) walks the same `Cond`-referential-integrity check
// every other `Cond`-bearing field in this file uses.
// ---------------------------------------------------------------------------

function checkRoomExits(world: WorldDef, findings: Finding[]): void {
  for (const [id, def] of Object.entries(world.rooms ?? {})) {
    const exits = def!.exits ?? [];
    exits.forEach((exit, i) => {
      checkRoomRef(world, exit.to, `room.${id}.exits[${i}].to`, findings);
      if (exit.door !== undefined) checkObjectRef(world, exit.door, `room.${id}.exits[${i}].door`, findings);
      if (exit.when !== undefined) checkCondRefs(world, exit.when, `room.${id}.exits[${i}].when`, findings);
    });
  }
}

// ---------------------------------------------------------------------------
// Vocabulary collision report (§3.2, §8 task 9). Two kinds of collision,
// deliberately treated differently:
//
//   - Two different verbs claiming the exact same surface-form word/phrase
//     is an ERROR — UNLESS the collision is provably safe, in which case
//     it is not reported at all (see below). `grammar.ts` tries every
//     same-word candidate in table order and keeps the first whose own
//     pattern/preposition actually fits the remaining tokens (real
//     fixture content needs this: PUT_IN and PUT_ON both declare the word
//     "put", told apart only by "in" vs. "on"). That trial only reliably
//     disambiguates when every colliding verb requires `'V dobj prep
//     iobj'` (so a preposition is always present in the input) AND no two
//     colliding verbs share a preposition (so whichever one appears
//     always picks exactly one verb) — `isSafelyDisjointByPreposition`
//     below. When that holds, the collision produces no finding at all:
//     PUT_IN/PUT_ON is exactly this case, and it is correct, intentional
//     content, not something to flag on every `npm test`. Any other shape
//     (either verb accepts `'V'`/`'V dobj'` with no prep to go on, or the
//     two share a preposition) is a genuine, silent ambiguity — grammar's
//     table-order tie-break permanently hides whichever candidate loses —
//     and is reported as an ERROR.
//   - A verb word colliding with an object/NPC noun or adjective (e.g. a
//     verb WATCH and a wristwatch noun "watch") is only a WARNING. Verb
//     words are matched at the start of input against `VerbDef.words`;
//     noun/adjective words are matched inside a noun-phrase span the
//     grammar has already carved out. Sentence position disambiguates the
//     two in the overwhelming majority of real inputs, so this is a smell
//     worth an author's second look, not a guaranteed misparse.
//
// UPDATED (Ryan's playtest, "which do you mean, the rack or the key?"
// loop): two objects sharing a noun with no distinguishing adjective used
// to be deliberately NOT reported here — task 10's own disambiguation was
// assumed to always handle it at resolve-time. It doesn't, reliably:
// `resolveNounPhrase` only narrows an ambiguous bare-noun pool when the
// player's phrase supplies an adjective, and a bare query never does, so
// two objects sharing an exact bare noun (the key rack and the room key
// both indexed under plain "key") makes that word permanently ambiguous —
// no phrasing resolves it. `checkObjectNounCollisions`, right below, is
// the noun/noun sibling of this section's own verb/noun check.
// ---------------------------------------------------------------------------

/**
 * Whether `grammar.ts`'s same-word trial-by-pattern can always tell `defs`
 * apart: every one of them must require a preposition (`'V dobj prep
 * iobj'` only, no bare `'V'`/`'V dobj'` pattern), and no two of them may
 * declare an overlapping `preps` word — see the block comment above.
 */
function isSafelyDisjointByPreposition(defs: VerbDef[]): boolean {
  if (defs.some((d) => d.patterns.some((p) => p !== 'V dobj prep iobj'))) return false;
  for (let a = 0; a < defs.length; a++) {
    const prepsA = new Set(defs[a]!.preps ?? []);
    for (let b = a + 1; b < defs.length; b++) {
      if ((defs[b]!.preps ?? []).some((p) => prepsA.has(p))) return false;
    }
  }
  return true;
}

function checkVocabularyCollisions(world: WorldDef, findings: Finding[]): void {
  const vocab = compileVocabulary(world);
  const verbs = world.verbs ?? {};

  // Verb/verb: group by the exact phrase (not per-word) so "turn on" vs.
  // "turn" never collide with each other, only an exact duplicate phrase
  // claimed by two different verb ids does.
  const phraseOwners = new Map<string, Set<VerbId>>();
  for (const form of vocab.verbForms) {
    const phrase = form.words.join(' ');
    const owners = phraseOwners.get(phrase) ?? new Set<VerbId>();
    owners.add(form.id);
    phraseOwners.set(phrase, owners);
  }
  for (const [phrase, owners] of phraseOwners) {
    if (owners.size <= 1) continue;
    const ownerIds = [...owners];
    const defs = ownerIds.map((id) => world.verbs![id]!);
    if (isSafelyDisjointByPreposition(defs)) continue; // provably safe (e.g. PUT_IN/PUT_ON) — not worth flagging
    findings.push(
      error(
        'verb-word-collision',
        `verb word "${phrase}" is claimed by more than one verb (${ownerIds.join(', ')}) — the parser's table-order tie-break permanently hides whichever candidate loses, and no preposition reliably separates them`,
      ),
    );
  }

  // Verb/noun: check each individual word of every verb surface form
  // (so "turn"/"on" are each checked, not just the phrase "turn on")
  // against the object/NPC noun and adjective vocabulary.
  const nounLikeWords = new Set<string>([
    ...vocab.objectNouns.keys(),
    ...vocab.objectAdjectives.keys(),
    ...vocab.npcNouns.keys(),
    ...vocab.npcAdjectives.keys(),
  ]);
  const reported = new Set<string>();
  for (const form of vocab.verbForms) {
    // Only the genuinely ambiguous case is worth a warning: a verb that can
    // be typed BARE, whose word is also a noun. Then the single word
    // `KEY` might be a command or a thing, and only guessing tells them
    // apart. When the verb always takes an object, sentence position
    // settles it and there is nothing to look at.
    //
    // The rule used to fire on every verb word that was also a noun, and
    // said so in its own message ("usually fine"). That produced 17
    // findings against three rooms — and a warning list nobody finishes
    // reading is worth less than no warning list, because the real ones
    // are in it somewhere.
    const canBeTypedBare = (verbs[form.id]?.patterns ?? []).includes('V');
    if (!canBeTypedBare) continue;
    for (const word of form.words) {
      if (!nounLikeWords.has(word)) continue;
      const key = `${form.id}:${word}`;
      if (reported.has(key)) continue;
      reported.add(key);
      findings.push(
        warning(
          'verb-noun-collision',
          `verb "${form.id}" can be typed bare and its word "${word}" is also an object/NPC noun — the single word is ambiguous between a command and a thing`,
        ),
      );
    }
  }
}

/**
 * Object/object noun collision — the noun/noun sibling of
 * `checkVocabularyCollisions`'s own verb/noun half (its header, above,
 * explains why that one never covered this). Two DIFFERENT objects that
 * can be in scope together, both answering to the identical bare noun
 * string, make a bare query for that word permanently ambiguous:
 * `resolveNounPhrase` (`parser/resolver.ts`) only narrows an ambiguous
 * bare-noun pool when the player's phrase supplies an adjective — a plain
 * "TAKE KEY" gets no such help no matter what adjectives either object
 * separately has. This is exactly the shape of bug Ryan's playtest hit:
 * the key rack and the room key both carried the bare noun "key," and no
 * phrasing existed that told them apart (`interpreter.ts`'s `disambiguate`
 * now stops that loop from trapping the player forever, but the content
 * bug that causes it belongs in `validate`, not just survived at runtime).
 *
 * A WARNING, not an error (this task's brief) — same reasoning as
 * `verb-noun-collision`/`room-description-mentions-portable`: two objects
 * genuinely sharing a word and expecting the player to disambiguate (two
 * shut doors, both plainly "door") is sometimes exactly the right content
 * choice. Nothing static can tell "this is a content bug" from "this is
 * intended," so every hit here is a prompt for a human read, not an
 * automatic failure — and it must stay rare enough to keep reading as one,
 * or it becomes noise nobody opens `validate`'s output to look at again.
 *
 * SCOPE, stated precisely (this task's own instruction: "say precisely
 * what it catches and misses"):
 *   CATCHES — two objects each authored `location` as the exact same
 *   `RoomId` (direct placement, the static default — never a runtime
 *   overlay; `validate` has no state to read) sharing one exact noun
 *   string; and, separately, any `portable` object's nouns checked against
 *   every OTHER room's own directly-placed objects, since a takeable
 *   object travels — once carried, it sits in scope alongside whatever
 *   room the player is standing in, wherever that ends up being (the
 *   "commonly carried" half of this task's brief). A portable object is
 *   checked this way regardless of its OWN authored `location`, including
 *   `'nowhere'` (not yet revealed) — `room_key` itself, this task's own
 *   worked example, is authored exactly that way.
 *   MISSES — nesting: an object placed `{ in }`/`{ on }` another object
 *   (one level below a room) never resolves to that room here, the same
 *   gap `checkRoomDescriptionMentionsPortable` already accepts, for the
 *   same reason stated there. A non-portable, scenery object authored
 *   `location: 'nowhere'` is invisible to this check entirely (nothing
 *   ever carries it into view, so there is no static room to compare it
 *   against). Two portable objects are never compared against EACH OTHER
 *   (only against a room's direct placements) — two carried objects
 *   sharing a bare noun while both sit in inventory ships uncaught. NPCs
 *   are not compared at all — an `NpcDefSlice`'s location is a conditional
 *   `schedule`, not one static place, and collapsing that into "which
 *   rooms" is a real static-analysis job this rule does not attempt. And
 *   it only catches an EXACT shared noun string; two different words that
 *   merely sound alike or overlap partially ship uncaught too.
 */
function checkObjectNounCollisions(world: WorldDef, findings: Finding[]): void {
  const objects = Object.entries(world.objects ?? {}) as [ObjectId, ObjectDefSlice][];
  const roomIds = new Set(Object.keys(world.rooms ?? {}));
  const directRoomOf = (def: ObjectDefSlice): RoomId | undefined =>
    typeof def.location === 'string' && roomIds.has(def.location) ? (def.location as RoomId) : undefined;

  const byRoom = new Map<RoomId, [ObjectId, ObjectDefSlice][]>();
  for (const [id, def] of objects) {
    const room = directRoomOf(def);
    if (room === undefined) continue;
    const list = byRoom.get(room) ?? [];
    list.push([id, def]);
    byRoom.set(room, list);
  }

  const reported = new Set<string>();
  const objectsById = world.objects ?? {};
  const flag = (aId: ObjectId, bId: ObjectId, word: string): void => {
    // A shared noun only traps the player when there is no way out of it.
    // Two objects sharing "sign" is fine if one also answers to "billboard"
    // and the other to "poster" — the player has a unique word for each and
    // the disambiguation has an answer. Warn only when at least one side
    // has NO noun of its own that the other doesn't also claim, because
    // then nothing the player can type will ever single it out. That is the
    // unanswerable question Ryan hit with the key and the key rack.
    //
    // Tested against adjectives first, which was the wrong discriminator:
    // it removed one finding of fifteen, because the real escape hatch in
    // this content is a distinct noun, not a qualifier.
    const aNouns = new Set(objectsById[aId]?.nouns ?? []);
    const bNouns = new Set(objectsById[bId]?.nouns ?? []);
    const aHasOwn = [...aNouns].some((n) => !bNouns.has(n));
    const bHasOwn = [...bNouns].some((n) => !aNouns.has(n));
    if (aHasOwn && bHasOwn) return;

    const [x, y] = [aId, bId].sort();
    const key = `${x}:${y}:${word}`;
    if (reported.has(key)) return;
    reported.add(key);
    findings.push(
      warning(
        'object-noun-collision',
        `"${x}" and "${y}" can be in scope together and both answer to bare noun "${word}" — a plain "${word}" alone can never tell them apart (only a full adjective+noun phrase can); verify this is deliberate disambiguation, not an accidental shared word`,
      ),
    );
  };

  const shareNoun = (a: ObjectDefSlice, b: ObjectDefSlice): string | undefined => (a.nouns ?? []).find((n) => (b.nouns ?? []).includes(n));

  // Same room, direct placement.
  for (const list of byRoom.values()) {
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const [aId, aDef] = list[i]!;
        const [bId, bDef] = list[j]!;
        const word = shareNoun(aDef, bDef);
        if (word !== undefined) flag(aId, bId, word);
      }
    }
  }

  // Commonly carried: a portable object's nouns against every OTHER room's
  // own directly-placed objects (it could be carried there) — its own home
  // room, if it has one, is already covered by the loop above.
  for (const [portableId, portableDef] of objects) {
    if (portableDef.portable !== true) continue;
    const home = directRoomOf(portableDef);
    for (const [room, list] of byRoom) {
      if (room === home) continue;
      for (const [otherId, otherDef] of list) {
        if (otherId === portableId) continue;
        const word = shareNoun(portableDef, otherDef);
        if (word !== undefined) flag(portableId, otherId, word);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Noise-word vocabulary (§3.2, Stage B task 11 follow-up). `dropBaseNoise`
// (`parser/tokenize.ts`) strips any token matching `NOISE_WORDS` from
// *every* position in the input line, not just the end — before any
// grammar or GO TO logic ever sees the tokens (`interpreter.ts`'s
// `interpret()` runs it on the whole line up front). Room aliases/names,
// object nouns/adjectives, and NPC nouns are matched against the
// *unstripped* compiled vocabulary keys (`vocabulary.ts`'s
// `compileRoomAliases`/`compileObjectVocabulary`/`compileNpcVocabulary`
// lowercase and store the authored strings verbatim, no noise-stripping).
// So an authored phrase containing a noise word anywhere — not only at the
// end — can never be typed back in and matched: e.g. a room named "Fixture
// Room A" or aliased "room a" is stripped to "room" by `dropBaseNoise`
// before lookup against the stored key "fixture room a" / "room a", which
// never matches. This is a strict superset of "the phrase ends with a
// noise word" — the mechanism strips a leading noise word ("the lobby" ->
// "lobby") exactly the same way it strips a trailing one ("room a" ->
// "room"), so this rule checks every whitespace-delimited word of the
// phrase, not just the first/last. See this task's report for the
// deliberate broadening beyond the literal ask.
//
// Deliberately NOT covering NPC `adjectives` — same-shaped gap, left for a
// human call rather than expanded here without being asked.
// ---------------------------------------------------------------------------

function checkPhraseForNoiseWords(path: string, phrase: string, findings: Finding[]): void {
  for (const word of phrase.split(/\s+/).filter((w) => w.length > 0)) {
    if (NOISE_WORDS.has(word.toLowerCase())) {
      findings.push(
        error(
          'noise-word-vocabulary',
          `${path} "${phrase}" contains noise word "${word}" — dropBaseNoise strips it from any position in the input before lookup, so this phrase can never be typed back in and matched`,
        ),
      );
    }
  }
}

function checkNoiseWordVocabulary(world: WorldDef, findings: Finding[]): void {
  for (const [id, def] of Object.entries(world.rooms ?? {})) {
    if (def!.name !== undefined) checkPhraseForNoiseWords(`room.${id}.name`, def!.name, findings);
    for (const alias of def!.aliases ?? []) checkPhraseForNoiseWords(`room.${id}.aliases`, alias, findings);
  }
  for (const [id, def] of Object.entries(world.objects ?? {})) {
    for (const noun of def!.nouns ?? []) checkPhraseForNoiseWords(`object.${id}.nouns`, noun, findings);
    for (const adj of def!.adjectives ?? []) checkPhraseForNoiseWords(`object.${id}.adjectives`, adj, findings);
  }
  for (const [id, def] of Object.entries(world.npcs ?? {})) {
    for (const noun of def!.nouns ?? []) checkPhraseForNoiseWords(`npc.${id}.nouns`, noun, findings);
    // NPC adjectives are checked for the same reason object adjectives are:
    // an adjective the tokenizer strips can never narrow a disambiguation.
    for (const adj of def!.adjectives ?? []) checkPhraseForNoiseWords(`npc.${id}.adjectives`, adj, findings);
  }
}

/**
 * An event declaring `onlyIfWitnessed` must say how witnessing is decided
 * (§4.3.3). `tick` throws on a malformed one at runtime, but a content
 * mistake belongs in the build, not in a play session — an authored beat
 * the player was meant to overhear should not be discovered as a crash
 * three acts in.
 */
function checkWitnessedEvents(world: WorldDef, findings: Finding[]): void {
  for (const [id, def] of Object.entries(world.events ?? {})) {
    if (def!.onlyIfWitnessed === true && def!.witnessedWhen === undefined) {
      findings.push(
        error(
          'event-witnessed-without-condition',
          `event.${id} sets onlyIfWitnessed but declares no witnessedWhen — there is no way to decide whether the player can perceive it`,
        ),
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Knowledge (§2.7, §8 task 15): referential integrity for the Cond-bearing
// fields `knowledge.ts`'s tick step reads (`MemoryDef.trigger.when`,
// `QuestionDef.openWhen`/`answerWhen`) plus `ClueDef.questions` — the same
// "walk every Cond leaf" convention `checkRoomDarkConds`/`checkSchedules`
// already use for their own Cond-bearing fields above.
// ---------------------------------------------------------------------------

function checkKnowledgeConds(world: WorldDef, findings: Finding[]): void {
  for (const [id, def] of Object.entries(world.memories ?? {})) {
    if (def!.trigger === undefined) continue;
    checkCondRefs(world, def!.trigger.when, `memory.${id}.trigger.when`, findings);
  }

  for (const [id, def] of Object.entries(world.questions ?? {})) {
    if (def!.openWhen !== undefined) checkCondRefs(world, def!.openWhen, `question.${id}.openWhen`, findings);
    if (def!.answerWhen !== undefined) checkCondRefs(world, def!.answerWhen, `question.${id}.answerWhen`, findings);
  }
}

/** `ClueDef.questions` — "which open questions it bears on" (§2.7) — must name real questions. */
function checkClueQuestionRefs(world: WorldDef, findings: Finding[]): void {
  for (const [id, def] of Object.entries(world.clues ?? {})) {
    (def!.questions ?? []).forEach((qid, i) => {
      checkQuestionRef(world, qid, `clue.${id}.questions[${i}]`, findings);
    });
  }
}

// ---------------------------------------------------------------------------
// Puzzles (§2.7, §8 task 16): referential integrity for `solvedWhen`/
// `question`/`onSolved`/`solutions[*].route`, plus §4.3.4's clock-free-
// solution rule — "the single most important rule in the validator"
// (task 16's own brief). Constitution §10 ("never secretly doom the
// player") made mechanical: every `PuzzleDef` must have at least one
// `solutions` entry whose `route` (task 16's chosen shape — see
// `PuzzleSolution` in `world.ts`) carries no `clock`/`clockPhase`/
// `weekday` term, or an explicit `missedRecovery` naming the recovery
// path. A `solutions` entry with no `route` at all reads as trivially
// clock-free (nothing in it to flag) — see `world.ts`'s doc comment on
// `PuzzleSolution.route` for why that's the deliberate, safe default.
// ---------------------------------------------------------------------------

/** Whether `route` (or any nested leaf of it) mentions the clock — §4.3.4's disqualifying terms. */
function routeMentionsClock(route: Cond): boolean {
  let found = false;
  walkCond(route, (leaf) => {
    if ('clock' in leaf || 'clockPhase' in leaf || 'weekday' in leaf) found = true;
  });
  return found;
}

function checkPuzzles(world: WorldDef, findings: Finding[]): void {
  for (const [rawId, def] of Object.entries(world.puzzles ?? {})) {
    const id = rawId as PuzzleId;
    const path = `puzzle.${id}`;

    checkCondRefs(world, def!.solvedWhen, `${path}.solvedWhen`, findings);
    if (def!.question !== undefined) checkQuestionRef(world, def!.question, `${path}.question`, findings);
    if (def!.onSolved !== undefined) checkPlotCriticalStrand(world, def!.onSolved, `${path}.onSolved`, findings);

    def!.solutions.forEach((solution, i) => {
      if (solution.route !== undefined) checkCondRefs(world, solution.route, `${path}.solutions[${i}].route`, findings);
    });

    if (def!.missedRecovery !== undefined) continue; // recovery path named — the rule is satisfied regardless of routes
    const hasClockFreeRoute = def!.solutions.some((s) => s.route === undefined || !routeMentionsClock(s.route));
    if (!hasClockFreeRoute) {
      findings.push(
        error(
          'puzzle-no-clock-free-solution',
          `${path} has no "solutions" entry whose route is free of clock/clockPhase/weekday terms, and declares no missedRecovery — a missed timed window would silently doom the player (§4.3.4/constitution §10)`,
        ),
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Exit doors: can a player-closed door always be reopened? (priority
// insert, Ryan's playtest — `your_door_outside` on the Landing could be
// closed via a custom CLOSE handler but had no `container` and no OPEN
// handler of its own, so `builtinOpen` refused every `OPEN DOOR` with
// `open.notContainer` and the exit stayed permanently blocked: a real
// walking-dead state (constitution §10), the same family
// `puzzle-no-clock-free-solution` (above) exists to catch, just for doors
// instead of puzzle routes.
//
// The check: `canClose(door)` (a `container`, so the built-in works, OR a
// handler on the CLOSE verb) `&& !canOpen(door)` (no `container` AND no
// handler on OPEN). A door nobody can ever close in the first place (e.g.
// the always-shut build-boundary gates, `LANDING_BOUNDARY_GATE`/
// `MAIN_STREET_BOUNDARY_GATE` — no `container`, no handlers at all, by
// design) is `canClose === false` and never flagged: permanently shut is
// the intended state there, not a player-inflicted lockout.
//
// KNOWN GAPS, stated rather than silently accepted (same convention as
// this file's other static rules):
//   - `container` alone is treated as "openable," even though a `key`ed,
//     locked container with no reachable key is its own, deeper
//     walking-dead shape (a puzzle-solvability question, not a "does an
//     OPEN handler exist" one) — not attempted here.
//   - A handler is "an OPEN/CLOSE handler exists," not "it actually
//     succeeds" — a handler gated by an unreachable `when` condition would
//     still count as `canOpen`/`canClose` here. Modelling reachability
//     needs simulating state, which this file (static-only, §2.1) never
//     does.
//   - Only exits with a `door` reference are checked; a door object never
//     named by any exit (a decorative interior door, say) is out of scope
//     by design — nothing traverses through it, so there is nothing to be
//     locked out of.
// ---------------------------------------------------------------------------

function canOpenDoor(def: ObjectDefSlice): boolean {
  if (def.container !== undefined) return true;
  return (def.handlers ?? []).some((h) => h.verbs.includes(BUILTIN_VERB_IDS.open));
}

function canCloseDoor(def: ObjectDefSlice): boolean {
  if (def.container !== undefined) return true;
  return (def.handlers ?? []).some((h) => h.verbs.includes(BUILTIN_VERB_IDS.close));
}

function checkDoorExitsCanReopen(world: WorldDef, findings: Finding[]): void {
  const checked = new Set<ObjectId>();
  for (const [roomId, roomDef] of Object.entries(world.rooms ?? {})) {
    for (const exit of roomDef!.exits ?? []) {
      if (exit.door === undefined) continue;
      if (checked.has(exit.door)) continue; // one finding per door object, not per exit that names it
      checked.add(exit.door);

      const doorDef = world.objects?.[exit.door];
      if (doorDef === undefined) continue; // unknown ref — checkRoomExits already reports this

      if (canCloseDoor(doorDef) && !canOpenDoor(doorDef)) {
        findings.push(
          error(
            'door-exit-cannot-reopen',
            `object "${exit.door}" (an exit door, first named at room.${roomId}) can be closed but has no "container" and no OPEN handler — nothing can ever reopen it once shut, a permanent lockout through that exit (constitution §10)`,
          ),
        );
      }
    }
  }
}

/**
 * A question that can reach `'answered'` needs its authored recap (§6.2).
 * Without one the settled list shows a question with a blank answer, which
 * is worse than not listing it — the player remembers asking and is told
 * nothing. Only questions that can actually be answered are required to
 * carry it; a question opened and left hanging is legitimate.
 */
function checkQuestionAnswers(world: WorldDef, findings: Finding[]): void {
  for (const [id, def] of Object.entries(world.questions ?? {})) {
    if (def!.answerWhen !== undefined && def!.answer === undefined) {
      findings.push(
        error(
          'question-answerable-without-recap',
          `question.${id} declares answerWhen but no answer recap — it would settle into the notebook blank`,
        ),
      );
    }
  }
}

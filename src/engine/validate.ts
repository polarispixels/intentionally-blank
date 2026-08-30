// `validate(world)` (spec §2.1, §8 task 7) — every cross-reference and
// authoring-completeness rule checkable against the current `WorldDef`
// slice (task 6's), run from a content test so a bad authoring choice fails
// `npm test`, not a play session hours in (§2.1's own framing).
//
// SCOPE NOTE: `WorldDef` does not yet declare `exits`, `handlers`,
// `verbs`, `puzzles`, `events`, `topics`, `deaths`, or `endings` — those
// land in tasks 8, 9-11, and 13-17. Rules that need those fields (every
// non-meta verb has a `default` family; every `PuzzleDef` has a
// clock-free solution or `missedRecovery`; no authored `Effect` strands a
// plot-critical object) have no data surface to check yet and are not
// implemented here. See this task's report for the full list — when a
// later task adds one of those fields to `WorldDef`, it must extend this
// file with the matching rule at the same time, the same way this file's
// own rules were added alongside task 6's schema slice.
//
// Every rule below returns findings rather than throwing, and `validate`
// collects ALL of them in one pass (§8 task 7's own instruction: "return
// ALL findings, not just the first" — an author fixing content wants the
// whole list, not one error at a time).

import type { Cond } from './cond';
import type { Effect } from './effects';
import type { ClueId, DayPhase, FlagId, MemoryId, NpcId, ObjectId, PlaceId, QuestionId, RoomId } from './ids';
import type { Prose, ProseRef, ProseRule } from './prose';
import type { WorldDef } from './world';

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
  checkResponseFamilies(world, findings);
  checkQuestionPhrasing(world, findings);
  checkPhaseTable(world, findings);
  checkVerbDefaults(world, findings);
  checkPlotCriticalStrandEffects(world, findings);

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
    if (place === 'inventory' || place === 'worn' || place === 'nowhere') return;
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

function checkPlotCriticalStrandEffects(world: WorldDef, findings: Finding[]): void {
  for (const [objId, def] of Object.entries(world.objects ?? {})) {
    const handlers = def!.handlers ?? [];
    handlers.forEach((handler, hi) => {
      walkEffects(handler.effects, (effect) => {
        if (!('move' in effect)) return;
        const [targetId, place] = effect.move;
        if (world.objects?.[targetId]?.plotCritical !== true) return;
        const strandsToNowhere = place === 'nowhere';
        const strandsToNpc = typeof place === 'object' && place !== null && 'npc' in place;
        if (strandsToNowhere || strandsToNpc) {
          findings.push(
            error(
              'effect-strands-plot-critical',
              `object.${objId}.handlers[${hi}].effects moves plot-critical object "${targetId}" to ${JSON.stringify(place)} — plot-critical objects may never leave the reachable world (§2.5)`,
            ),
          );
        }
      });
    });
  }
}

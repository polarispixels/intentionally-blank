// `WorldDef` (spec §2.1) and the overlay-resolution helpers (§0's directory
// map: "scope, visibility, light, movement, resolution helpers") — §8 task 6.
//
// SPLIT NOTE (task 3 → task 6): task 3 parked a narrow slice of the v2
// `GameState`/`Clock`/overlay types here alongside `WorldDef`, documented in
// this file's previous header, because `src/engine/state.ts` was (and still
// is) the live MVP file. Task 6 finishes that split: the full `GameState`
// and `initialState(world)` now live in `gamestate.ts` (see that file's
// header for why not `state.ts`). This file re-exports every type that
// moved so `cond.ts`, `clock.ts`, `prose.ts`, `effects.ts`, and their tests
// — all of which import `GameState`/`Clock`/etc. from `'./world'` — keep
// compiling with zero changes to their own source.
//
// SEAM NOTE (task 6 follow-up, found in review): `objectLocation` and
// `objectState` — the overlay-with-authored-fallback resolvers — now live
// in `resolve.ts`, not here, because `cond.ts`'s `objectAt`/`objectState`/
// `has` arms need them too and a plain `world.ts` → `cond.ts` → `world.ts`
// wiring would cycle (`cond.ts` needs `WorldDef`; `world.ts`'s `isDark`
// needs `cond.ts`'s `evaluate`). `resolve.ts` is a types-only leaf both
// modules import from at runtime with no cycle. Likewise `npcRoom` now
// lives in `cond.ts` (its schedule fallback needs `evaluate`, and the two
// are mutually recursive), re-exported from here so existing callers of
// `world.ts`'s `npcRoom` keep working unchanged. This file re-exports both
// kinds of import for that reason — see `resolve.ts` and `cond.ts` for the
// full explanation.
//
// This file's own job now is: `WorldDef` (still a growing narrow slice —
// later tasks add the rest of §2.1's rooms/objects/npcs authoring surface),
// `isDark` (§2.4's sole darkness authority), and `scope` (what the player
// can currently see) — the two resolvers that *do* need `Cond` evaluation
// (a room's `dark` baseline can be a `Cond`) but don't need to live beside
// `evaluate` itself the way `npcRoom` does.

import type { Cond } from './cond';
import { evaluate } from './cond';
import type { DayPhase, FlagId, FlagValue, MemoryId, ClueId, NpcId, ObjectId, PlaceId, QuestionId, RoomId, ScriptId } from './ids';
import type { Prose } from './prose';
import { objectLocation, objectState } from './resolve';
import type { GameEvent, GameState } from './gamestate';

export type { Clock, GameEvent, GameState, NpcOverlay, ObjectOverlay, Phase } from './gamestate';
export { initialState } from './gamestate';
export { objectLocation, objectState } from './resolve';
export { npcRoom } from './cond';

/**
 * The day/week scheduling surface (canon A9). `phases` gives the start
 * minute of each of the four `DayPhase`s; `weekLength` is the number of
 * days in a week (`weekday = (day - 1) % weekLength`, 0-based). Consumed by
 * `clock.ts`'s `phase()`/`weekday()` — see that module for the resolution
 * rules (wraparound, duplicate-boundary rejection).
 */
export interface WorldMeta {
  phases: Record<DayPhase, number>;
  weekLength: number;
  /**
   * Where `initialState()` places the player. Optional only because the
   * task 3–5 fixture/test `WorldDef` literals (not this task's to touch)
   * predate it and don't declare one; `initialState()` throws if it's
   * missing rather than guessing a room.
   */
  startRoom?: RoomId;
}

/**
 * Minimal container-authoring slice of §2.5's `ObjectDef.container` — just
 * the fields `objectState`/`isDark`/`scope` below read.
 */
export interface ContainerDef {
  open?: boolean;
  locked?: boolean;
  transparent?: boolean;
}

/**
 * Minimal object-authoring slice of §2.5's `ObjectDef` — `location` (the
 * authored fallback the §1.1 prime rule resolves to when state has no
 * overlay entry), plus the fields darkness/scope/the plot-critical guard
 * need. Not yet `name`/`nouns`/`adjectives`/`handlers`/etc. — those are
 * later tasks' (8: actions, 9–11: parser) to add.
 */
export interface ObjectDefSlice {
  location: PlaceId;
  hidden?: boolean;
  container?: ContainerDef;
  supporter?: boolean;
  lightSource?: boolean; // while `on` and in scope, defeats baseline darkness (isDark, §2.4)
  plotCritical?: boolean;
}

/**
 * Minimal room-authoring slice of §2.4's `RoomDef` — just `dark`, the
 * baseline `isDark` reads. Not yet `name`/`exits`/`description`/etc. —
 * those are later tasks' to add.
 */
export interface RoomDefSlice {
  dark?: true | Cond;
}

/**
 * Minimal schedule-authoring slice of §2.6. `ScheduleRule.room` is where an
 * NPC is when `when` holds (or unconditionally, if `when` is omitted);
 * rules are tried in order, first match wins — the same convention
 * `prose.ts`'s `ProseRule` selection uses. This is deliberately not full
 * derivation (no `activity` text, no interaction with `tick`'s per-turn
 * recompute, no witnessed-event awareness) — task 13 owns that; see
 * `cond.ts`'s `npcRoom` doc comment for the precise boundary, and its file
 * header for why a rule's `when` must not depend on `npcAt` for its own npc.
 */
export interface ScheduleRule {
  when?: Cond;
  room: RoomId | 'offstage';
}

/**
 * Minimal npc-authoring slice of §2.6 — just `schedule`, which `npcRoom`'s
 * fallback reads. Not yet `topics`/`handlers`/etc. — those are tasks 13–14's.
 */
export interface NpcDefSlice {
  schedule?: ScheduleRule[];
}

/** Narrow, still-growing slice of §2.1's `WorldDef`. */
export interface WorldDef {
  meta: WorldMeta;
  flags: Record<FlagId, { default: FlagValue; doc: string }>;
  rooms?: Record<RoomId, RoomDefSlice>;
  objects?: Record<ObjectId, ObjectDefSlice>;
  npcs?: Record<NpcId, NpcDefSlice>;
  /** Minimal slice of §2.7's `MemoryDef` — just what a `grantMemory` event needs. */
  memories?: Record<MemoryId, { lines: string[] }>;
  /** Minimal slice of §2.7's `ClueDef` — just what a `grantClue` event needs. */
  clues?: Record<ClueId, { title: string }>;
  /** Minimal slice of §2.7's `QuestionDef` — just what an open/answer event needs. */
  questions?: Record<QuestionId, { text: string }>;
  /** The `script` effect's escape hatch (ADR 0008): pure functions registered by id. */
  scripts?: Record<ScriptId, ScriptFn>;
  /**
   * Global response families the §3.6 ladder falls back to (`unknown`,
   * `nounMiss`, `unknownVerbKnownNoun`, …). A handler reaches one via
   * `{ say: { ref: 'familyName' } }` (§2.2) rather than duplicating a
   * shared family inline; `prose.ts`'s `render` resolves the ref.
   */
  responses?: Record<string, Prose>;
}

/**
 * The DSL escape hatch (spec §2.3, ADR 0008): pure, registered by id in
 * `world.scripts`, invoked by the `{ script: { id, args } }` effect. Takes
 * and returns the same shape `apply()` does, so a script's result threads
 * into the surrounding effect sequence exactly like any other effect.
 */
export type ScriptFn = (
  world: WorldDef,
  state: GameState,
  args?: Record<string, FlagValue>,
) => { state: GameState; events: GameEvent[] };

// ---------------------------------------------------------------------------
// Darkness and scope (§2.4, §0) — the two resolvers that need `Cond`
// evaluation (a room's `dark` baseline can be a `Cond`) but aren't part of
// `cond.ts`'s own mutually-recursive `npcRoom`/`evaluate` pair.
// ---------------------------------------------------------------------------

function isTransparent(world: WorldDef, id: ObjectId): boolean {
  return world.objects?.[id]?.container?.transparent === true;
}

/**
 * Whether `id` is somewhere the player could presently reach/perceive *if*
 * they were standing in `room` — directly in `room`, on a supporter in
 * `room`, inside an open-or-transparent container that is itself in scope
 * of `room` (recursively), or (only when `room` is where the player
 * actually is) carried in `inventory`/`worn`. Shared by `scope()` (always
 * called with `state.location`) and `isDark()`'s light-source check (called
 * with the room being tested for darkness, which in real play is always
 * `state.location` too — the parameter exists so both can be unit-tested
 * against an arbitrary room without moving the player there).
 */
function inScopeAt(world: WorldDef, state: GameState, room: RoomId, id: ObjectId): boolean {
  const loc = objectLocation(world, state, id);
  if (loc === 'inventory' || loc === 'worn') return room === state.location;
  if (typeof loc === 'string') return loc === room;
  if ('in' in loc) {
    if (!inScopeAt(world, state, room, loc.in)) return false;
    return objectState(world, state, loc.in, 'open') || isTransparent(world, loc.in);
  }
  if ('on' in loc) return inScopeAt(world, state, room, loc.on);
  return false; // { npc } or 'nowhere'
}

/**
 * §2.4's sole darkness authority. `RoomDef.dark` is baseline only ("this
 * room has no ambient light of its own"); a room is actually dark when the
 * baseline holds **and** no `lightSource` object that is `on` is in scope
 * (in the room, held, or worn — containers must be open or transparent).
 * The baseline cond must never itself mention a light source — that's what
 * makes a lit lamp defeat darkness through this function, not through the
 * room's own cond.
 */
export function isDark(world: WorldDef, state: GameState, room: RoomId): boolean {
  if (!baselineDark(world, state, room)) return false;
  return !hasActiveLightSourceInScope(world, state, room);
}

function baselineDark(world: WorldDef, state: GameState, room: RoomId): boolean {
  const dark = world.rooms?.[room]?.dark;
  if (dark === undefined) return false;
  if (dark === true) return true;
  return evaluate(world, state, dark);
}

function hasActiveLightSourceInScope(world: WorldDef, state: GameState, room: RoomId): boolean {
  const ids = Object.keys(world.objects ?? {}) as ObjectId[];
  return ids.some((id) => {
    if (world.objects![id]!.lightSource !== true) return false;
    if (!objectState(world, state, id, 'on')) return false;
    return inScopeAt(world, state, room, id);
  });
}

/**
 * Everything the player can currently see and reach: room contents,
 * supporters, open-or-transparent containers (recursively), inventory, and
 * worn items — excluding `hidden` objects and, when the room is dark,
 * excluding everything except what's carried (`inventory`/`worn`), which
 * stays reachable by touch (the classic IF convention: `INVENTORY` and
 * dropping/taking your own gear still work in the dark; you just can't see
 * the room around you).
 */
export function scope(world: WorldDef, state: GameState): ObjectId[] {
  const ids = Object.keys(world.objects ?? {}) as ObjectId[];
  const dark = isDark(world, state, state.location);
  return ids.filter((id) => {
    if (objectState(world, state, id, 'hidden')) return false;
    if (dark) {
      const loc = objectLocation(world, state, id);
      return loc === 'inventory' || loc === 'worn';
    }
    return inScopeAt(world, state, state.location, id);
  });
}

// Pure overlay-with-authored-default readers (§1.1's prime rule) that need
// no `Cond` evaluation — the leaf both `cond.ts` and `world.ts` import from
// (§8 task 6 follow-up: the seam between them, found in review).
//
// `cond.ts`'s `objectAt`/`objectState`/`prop` arms, and the pinned/following
// half of NPC position resolution, all read through here instead of
// indexing `state.objects`/`state.npcs` directly — mirroring the rule
// `cond.ts` already follows for `flag`/`questionStatus` (§1.2.1). Before
// this file existed, those three `Cond` arms read overlays with no fallback
// at all: `evaluate({ objectAt: [key, room] })` was `false` for a key
// sitting exactly where content placed it, simply because nothing had moved
// it yet and no overlay entry existed. Since conditions are how nearly all
// game logic is expressed (every handler `when`, every `solvedWhen`, every
// prose rule), that bug would have failed silently everywhere content
// authors work.
//
// `npcRoom`'s schedule fallback is deliberately **not** here: resolving a
// schedule needs `Cond` evaluation, and schedule resolution and `evaluate`
// are genuinely mutually recursive (a schedule rule's `when` can itself be
// an `npcAt` cond) — see `cond.ts` for that half and why it has to live
// there. This file imports **only types**, so both `cond.ts` and `world.ts`
// can import real functions from it without ever creating a runtime cycle:
// `resolve.ts` itself depends on nothing at runtime.

import type { FlagValue, NpcId, ObjectId, PlaceId, RoomId } from './ids';
import type { GameState } from './gamestate';
import type { WorldDef } from './world';

/** The object's current place: its overlay, or its authored default (§1.1). */
export function objectLocation(world: WorldDef, state: GameState, id: ObjectId): PlaceId {
  const overlay = state.objects[id]?.location;
  if (overlay !== undefined) return overlay;
  const declared = world.objects?.[id];
  if (declared === undefined) throw new Error(`objectLocation: "${id}" is not declared in world.objects`);
  return declared.location;
}

/**
 * One boolean facet of an object's overlay (`open`/`locked`/`on`/`hidden`),
 * falling back to the authored default (§1.1) when state has no overlay
 * entry for that facet. `open`/`locked` fall back to `ObjectDef.container`;
 * `hidden` falls back to `ObjectDef.hidden`; `on` has no authored default —
 * a switchable object always starts off, so an absent overlay is `false`.
 */
export function objectState(world: WorldDef, state: GameState, id: ObjectId, key: 'open' | 'locked' | 'on' | 'hidden'): boolean {
  const overlay = state.objects[id]?.[key];
  if (overlay !== undefined) return overlay;
  const declared = world.objects?.[id];
  if (key === 'hidden') return declared?.hidden ?? false;
  if (key === 'open') return declared?.container?.open ?? false;
  if (key === 'locked') return declared?.container?.locked ?? false;
  return false;
}

/**
 * A custom object- or NPC-scoped prop (`ObjectOverlay.props`/`NpcOverlay.props`).
 * Disambiguates `ObjectId | NpcId` by `world.objects` membership, the same
 * rule `effects.ts`'s `setProp` uses — not by which overlay table happens
 * to have a value, which is what `cond.ts`'s `prop` arm did before this
 * file existed (`state.objects[id]?.props?.[key] ?? state.npcs[id]?.props?.[key]`):
 * a declared object could fall through to an incidentally-matching npc
 * overlay if its own prop value happened to be unset. Props have no
 * authored default (unlike `location`/`open`/`locked`/`hidden` — they're
 * pure runtime state), so an unset prop reads as `undefined`.
 */
export function prop(world: WorldDef, state: GameState, id: ObjectId | NpcId, key: string): FlagValue | undefined {
  if (world.objects?.[id as ObjectId] !== undefined) {
    return state.objects[id as ObjectId]?.props?.[key];
  }
  return state.npcs[id as NpcId]?.props?.[key];
}

/**
 * The overlay-only half of NPC position resolution (§2.6): following (the
 * player's own room) or a pin (`moveNpc`'s `room` overlay), in that
 * precedence. Returns `undefined` when neither applies, meaning position
 * must derive from the schedule instead — which needs `Cond` evaluation and
 * so lives in `cond.ts`'s `npcRoom`, not here (see that module).
 */
export function npcOverlayPosition(state: GameState, id: NpcId): RoomId | 'offstage' | undefined {
  const overlay = state.npcs[id];
  if (overlay?.following === true) return state.location;
  if (overlay?.room !== undefined) return overlay.room;
  return undefined;
}

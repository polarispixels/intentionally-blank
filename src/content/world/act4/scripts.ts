// Act IV, wave E0, task I — the town before the visit
// (`docs/superpowers/specs/2026-09-17-stage-e0-prose.md` §3-§9, §31; Stage E
// plan §2 E0). Two scripts:
//
// `act4SetVisitDay` — `act4_set_visit_day` (already declared,
// `ACT4_SET_VISIT_DAY_SCRIPT`, `ids.ts`). Writes the two numeric due-day
// flags `act4_ev_start` needs: the visit is the day after the announcement
// (plan §5 Q3: "`act4_visit_day = day + 1` at `act4_started`"), and the
// crews stay two days past that ("the crews stay two days" — same ruling;
// the prose doc's own dressing table: "Two days after `act4_visit_day` the
// crews are gone... `act4_visit_over_day = act4_visit_day + 2`"). No
// player-visible text (§31.3's own "a builder will look for one and not
// find it").
//
// `act4CrewsVisibility` — `act4_crews_visibility` (`ACT4_CREWS_VISIBILITY_
// SCRIPT`, `ids.ts`, this task's own). See that id's own doc comment: the
// engine's `hidden` overlay only ever clears via the one-way `{ reveal }`
// effect, so making the crews go hidden again (over_day; night, before the
// day's work starts) needs this script, ticked every turn the player is on
// Main Street by `EVENT_ACT4_EV_CREWS_VISIBLE` (`events.ts`) — the same
// `{ script }` escape hatch `act3/events.ts`'s own header documents for a
// Cond the declarative DSL can't express as a static `hidden` value.

import { evaluate } from '../../../engine/cond';
import type { Cond } from '../../../engine/cond';
import { apply } from '../../../engine/effects';
import type { GameState, ObjectOverlay, ScriptFn, WorldDef } from '../../../engine/world';
import { ACT4_CREWS, ACT4_VISIT_ANNOUNCED, ACT4_VISIT_DAY, ACT4_VISIT_OVER_DAY } from './ids';

export const act4SetVisitDay: ScriptFn = (world: WorldDef, state: GameState) => {
  const visitDay = state.clock.day + 1;
  const overDay = visitDay + 2;
  return apply(world, state, [{ set: [ACT4_VISIT_DAY, visitDay] }, { set: [ACT4_VISIT_OVER_DAY, overDay] }], { path: 'script.act4_set_visit_day' });
};

/**
 * The crews are on the street only once the visit is announced, only
 * before the crews' own departure day, and only while the day's work is
 * actually under way (morning/afternoon — §3.3's evening/night dressing
 * is parked equipment and no working men, §4/§31.2's own "MEN must not
 * resolve when the crews are hidden" ruling).
 */
const CREWS_VISIBLE_WHEN: Cond = {
  all: [{ flag: ACT4_VISIT_ANNOUNCED }, { not: { onOrAfterDay: ACT4_VISIT_OVER_DAY } }, { any: [{ clockPhase: 'morning' }, { clockPhase: 'afternoon' }] }],
};

export const act4CrewsVisibility: ScriptFn = (world: WorldDef, state: GameState) => {
  const hidden = !evaluate(world, state, CREWS_VISIBLE_WHEN);
  const overlay: ObjectOverlay = { ...(state.objects[ACT4_CREWS] ?? {}), hidden };
  const nextState: GameState = { ...state, objects: { ...state.objects, [ACT4_CREWS]: overlay } };
  return { state: nextState, events: [] };
};

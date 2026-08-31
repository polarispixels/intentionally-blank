// Act IV, wave E0, task I — the town before the visit
// (`docs/superpowers/specs/2026-09-17-stage-e0-prose.md` §3-§9, §31; Stage E
// plan §2 E0). Two `EventDef`s:
//
// `act4_ev_start` (§2's own flag table, plan §2 E0's own row) — the wave's
// hinge. `once`, fires the turn `act3_clue_reacquire` is granted (D5's own
// last link). Sets `act4_started`/`act4_visit_announced`, reveals the post
// office's second notice (§5 — see this file's own note below on why
// `reveal` alone is enough there but not for the crews), and runs
// `act4_set_visit_day` (`scripts.ts`) to compute the two numeric due-day
// flags. Does NOT open `act4_q_record_about_you` explicitly — its own
// `openWhen: { flag: act4_started }` (already declared, `knowledge.ts`)
// reaches it ambiently the same tick (§31.3's own note).
//
// `act4_ev_crews_visible` (this task's own supporting mechanism, not named
// in the prose doc) — `once: false`, ticked every turn the player is on
// Main Street, recomputing the crews' `hidden` overlay via
// `act4CrewsVisibility` (`scripts.ts`). See that script's own doc comment
// for why a one-way `{ reveal }` isn't enough here (the crews must go
// hidden again after `act4_visit_over_day`, and at night before the day's
// work starts).

import type { EventDef } from '../../../engine/world';
import { MAIN_STREET } from '../act1/ids';
import { ACT3_CLUE_REACQUIRE } from '../act3/ids';
import { ACT4_CREWS_VISIBILITY_SCRIPT, ACT4_SET_VISIT_DAY_SCRIPT, ACT4_STARTED, ACT4_VISIT_ANNOUNCED, ACT4_VISIT_NOTICE, EVENT_ACT4_EV_CREWS_VISIBLE, EVENT_ACT4_EV_START } from './ids';

export const ACT4_EV_START_EVENT: EventDef = {
  id: EVENT_ACT4_EV_START,
  when: { clue: ACT3_CLUE_REACQUIRE },
  once: true,
  effects: [{ set: [ACT4_STARTED, true] }, { set: [ACT4_VISIT_ANNOUNCED, true] }, { reveal: ACT4_VISIT_NOTICE }, { script: { id: ACT4_SET_VISIT_DAY_SCRIPT } }],
};

export const ACT4_EV_CREWS_VISIBLE_EVENT: EventDef = {
  id: EVENT_ACT4_EV_CREWS_VISIBLE,
  when: { at: MAIN_STREET },
  once: false,
  effects: [{ script: { id: ACT4_CREWS_VISIBILITY_SCRIPT } }],
};

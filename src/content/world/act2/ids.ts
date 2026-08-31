// Act II ("The Notebook") — id constants.
//
// Filled wave by wave as D1–D2 land (Stage D plan §2); D0 (this task) adds
// the calendar/passage plumbing's own ids. Every id declared here — and
// only here — must be namespaced `act2_*` (Stage D plan §0.3): `R('act2_...')`,
// `O('act2_...')`, `N('act2_...')`, and so on, via `src/engine/ids.ts`'s
// constructors. This file may import only `engine/ids` and other `ids.ts`
// files (`act2/ids.ts` may import `act1/ids.ts`; never the reverse) — see
// the plan's own rule for why (keeps `ids.ts` files free of the cycle risk
// everything else in a room or NPC file can't avoid).

import { F, S, V } from '../../../engine/ids';

// ---------------------------------------------------------------------------
// D0 — flags (main-session ruling 1/2/4; ADR 0011 rule 5).
// ---------------------------------------------------------------------------

/** Set by D1's ride north (the first `act2_travel`). Nothing in D0 sets it — every schedule/presence rule below is gated on it, and it stays false through the whole of Act I. */
export const ACT2_STARTED = F('act2_started');
/** Set while Jack is pinned away from his schedule (D1's travel script); read by his own schedule rule so a `when` never needs to read `npcAt` for the npc it belongs to (`cond.ts`'s own warning). */
export const ACT2_JACK_AWAY = F('act2_jack_away');
/** Set by either sleep route (`act2/time.ts`'s `act2_sleep` script) — a flag D2 reads. */
export const ACT2_SLEPT_SINCE_BOOT = F('act2_slept_since_boot');
/** Main-session ruling 1 (§5.3 q1 of the presence-and-passage doc): the front desk's own onEnter sets this the first time the desk is found empty, gating the long empty-desk variant to fire once. */
export const ACT2_SEEN_DESK_EMPTY = F('act2_seen_desk_empty');
/** As above, for the sheriff's office. */
export const ACT2_SEEN_OFFICE_EMPTY = F('act2_seen_office_empty');

// ---------------------------------------------------------------------------
// D0 — the pass-time/sleep scripts (`act2/time.ts`).
// ---------------------------------------------------------------------------

export const ACT2_PASS_TIME_SCRIPT = S('act2_pass_time');
export const ACT2_SLEEP_SCRIPT = S('act2_sleep');

// ---------------------------------------------------------------------------
// D0 — the four pass-time verbs (`act2/verbs.ts`).
// ---------------------------------------------------------------------------

export const V_ACT2_WAIT_UNTIL_MORNING = V('act2_wait_until_morning');
export const V_ACT2_WAIT_UNTIL_AFTERNOON = V('act2_wait_until_afternoon');
export const V_ACT2_WAIT_UNTIL_EVENING = V('act2_wait_until_evening');
export const V_ACT2_WAIT_UNTIL_NIGHT = V('act2_wait_until_night');

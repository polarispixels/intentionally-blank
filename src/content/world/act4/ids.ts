// Act IV ("the record about you") — id constants.
//
// Every id declared here — and only here — is namespaced `act4_*` (Stage E
// plan §0.3, the same convention `act1`–`act3` follow). This file may import
// only `engine/ids` and other `ids.ts` files.
//
// Wave E0 shared — written by the main session before the E0 builders ran
// (`docs/superpowers/specs/2026-09-17-stage-e0-prose.md` §2, §31). Builders
// ADD their own object/verb/topic/event/script ids below the anchor at the
// end of this file, with the Edit tool, never Write.

import { C, F, O, P, Q, S, V } from '../../../engine/ids';

// Flags (§2)
export const ACT4_STARTED = F('act4_started');
export const ACT4_VISIT_ANNOUNCED = F('act4_visit_announced');
/** Numeric — the day of the visit (`act4_set_visit_day`). */
export const ACT4_VISIT_DAY = F('act4_visit_day');
/** Numeric — the first day the crews are gone. */
export const ACT4_VISIT_OVER_DAY = F('act4_visit_over_day');
export const ACT4_WHITLOCK_READER_TOLD = F('act4_whitlock_reader_told');
export const ACT4_WHITLOCK_CONVINCED = F('act4_whitlock_convinced');
export const ACT4_CAGE_OPEN = F('act4_cage_open');
export const ACT4_HANDWRITING_MATCHED = F('act4_handwriting_matched');
export const ACT4_NUMERAL_SEARCHED = F('act4_numeral_searched');
export const ACT4_PROFILE_SEEN = F('act4_profile_seen');

// Clues (§2)
export const ACT4_CLUE_VISIT_COMING = C('act4_clue_visit_coming');
export const ACT4_CLUE_SAME_HAND = C('act4_clue_same_hand');
export const ACT4_CLUE_FILED_UNDER_ONE = C('act4_clue_filed_under_one');
export const ACT4_CLUE_PROFILED = C('act4_clue_profiled');
export const ACT4_CLUE_ELIS_REASON = C('act4_clue_elis_reason');

// Questions (§2)
export const ACT4_Q_RECORD_ABOUT_YOU = Q('act4_q_record_about_you');
export const ACT4_Q_WHO_OUTRANKS_IT = Q('act4_q_who_outranks_it');

// Puzzle (§2) — P21
export const ACT4_P21_SELF_EVIDENCE = P('act4_p21_self_evidence');

// Scripts named by §2/§31 (their ScriptFns are the builders')
export const ACT4_SET_VISIT_DAY_SCRIPT = S('act4_set_visit_day');

// --- E0 task I ---
// The town before the visit (`docs/superpowers/specs/2026-09-17-stage-e0-
// prose.md` §3-§9, §31, §32) — Main Street's three description rules, the
// crews, the post office's second notice, one prepended rule each on Pearl
// and Marlow, the diner's window, the Lobby's staging doors, and
// `act4_ev_start`/`act4_set_visit_day`'s own event/script ids. The crews'
// and notice's `ObjectDefSlice`s live on `act1/objects/mainStreet.ts` and
// `act1/objects/postOffice.ts` respectively — only the ids are namespaced
// `act4_*` here (this file's own header rule).

// Objects (§4, §5)
export const ACT4_CREWS = O('act4_crews');
export const ACT4_VISIT_NOTICE = O('act4_visit_notice');

// Events (§2, §31) — `act4_ev_start` is the wave's own one-time hinge;
// `act4_ev_crews_visible` is this task's own supporting mechanism (not
// named in the prose doc): the engine's `hidden` overlay only ever goes
// `false` via the one-way `{ reveal }` effect (`effects.ts`), so making the
// crews go hidden again (after `act4_visit_over_day`, and at night before
// the day's work starts, §4/§31.2 `MEN`) needs a `once: false` event tied
// to a script that recomputes the overlay directly every turn the player
// is on Main Street — the same `{ script }` escape hatch `act3/events.ts`'s
// own header already documents for a Cond the declarative DSL can't express.
export const EVENT_ACT4_EV_START = 'act4_ev_start';
export const EVENT_ACT4_EV_CREWS_VISIBLE = 'act4_ev_crews_visible';

// Scripts (§2, §31, §31.3)
export const ACT4_CREWS_VISIBILITY_SCRIPT = S('act4_crews_visibility');

// --- E0 task K ---
// The machine: the numeral search, the fourth heading, R13, the Act IV
// boundary (`docs/superpowers/specs/2026-09-17-stage-e0-prose.md` §16-§18,
// §22, §27, §31). `act4_clue_filed_under_one`/`act4_clue_profiled`
// (declared above, §2) are granted by this task's own scripts; their
// `ClueDef`s live in `./knowledge.ts`, this task's own labelled block.
// `act4_profile` is a Sublevel 6 object, per this file's own header rule
// (only its id lives here) — its `ObjectDefSlice` is in
// `act3/objects/s6ArchiveHub.ts`. The two ledger-numeral fixed phrases and
// `SELECT PROFILE` are new verbs (`act3/verbs.ts`, merged in
// `act3/index.ts` — the same file `V_ACT3_LEDGER_JULES` etc. already live
// in, D5 task G's own idiom).

// Objects (§18)
export const ACT4_PROFILE = O('act4_profile');

// Scripts (§18, §31)
export const ACT4_PROFILE_SCREEN_SCRIPT = S('act4_profile_screen');

// Verbs (§16, §18, §31.2) — `act3/verbs.ts`'s own `ACT4_E0_TASK_K_VERBS`.
export const V_ACT4_LEDGER_ONE = V('act4_ledger_one');
export const V_ACT4_LEDGER_FOUR = V('act4_ledger_four');
export const V_ACT4_SELECT = V('act4_select');

// --- E0 task J ---
// Whitlock (topics local to act1/whitlock.ts, sidecar style — not declared
// here), the cage/bag/notes (act1/objects/sheriffOffice.ts), Jack's
// `act4_jack_topic_weeks` (local to act1/jack.ts), Dad's breath event
// (defined in act2/dad.ts, registered in act4/index.ts), the numerals
// reply (act2/objects/censor.ts). Object ids only — topic ids follow each
// file's own established local-declaration idiom (jack.ts/whitlock.ts
// already declare their own `act1_*` topic ids inline, not centrally; the
// same style is used here for these new `act4_*` topic ids).
export const ACT4_EVIDENCE_BAG = O('act4_evidence_bag');
export const ACT4_CASE_NOTES = O('act4_case_notes');
export const ACT4_REPLY_ELI_NUMERALS = O('act4_reply_eli_numerals');
/** Plain string id (matches `act2/ids.ts`'s own `EVENT_ACT2_*` convention) — the `EventDef` itself lives in `act2/dad.ts`. */
export const ACT4_EV_DAD_BREATH = 'act4_ev_dad_breath';

// --- E0 builders append below this line (Edit tool only; one block per task, labelled) ---

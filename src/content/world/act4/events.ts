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
import { JACK, MAIN_STREET, SUNDOWN_DINER } from '../act1/ids';
import { ACT3_CLUE_REACQUIRE, ACT3_S6_MAINTENANCE_BAY, ACT3_UV_LAMP_ON } from '../act3/ids';
import {
  ACT4_CLUE_JACK_SAW,
  ACT4_CREWS_VISIBILITY_SCRIPT,
  ACT4_JACK_SAW_MARK,
  ACT4_SET_VISIT_DAY_SCRIPT,
  ACT4_STARTED,
  ACT4_VISIT_ANNOUNCED,
  ACT4_VISIT_NOTICE,
  EVENT_ACT4_EV_CREWS_VISIBLE,
  EVENT_ACT4_EV_JACK_MORNING_SCENE,
  EVENT_ACT4_EV_JACK_RETURNS,
  EVENT_ACT4_EV_JACK_SEES,
  EVENT_ACT4_EV_START,
} from './ids';

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

// --- E1 task N ---
// R14's completion — §25/§26 (`docs/superpowers/specs/2026-09-18-stage-e1-
// prose.md`). `act4_ev_jack_sees` (§25): once, fires the turn the player is
// in the Bay with the lamp on and Jack (following since the tunnel mouth,
// `act1/jack.ts`'s own `ACT4_EV_JACK_TUNNEL_EVENT`) present — the block is
// the event's own, not the lamp's (§37.3's own order note; the shipped
// forearm reveal on `SELF_FOREARM`, gated the same `{ at, flag:
// act3_uv_lamp_on }`, is unaffected and cannot double-fire this same event:
// this event, being `once` and checked every tick, always fires on the
// earliest turn all three conds hold, which structurally precedes any
// later `EXAMINE FOREARM` turn). Sets `act4_jack_saw_mark`, grants
// `act4_clue_jack_saw`, then un-follows and offstages him.
//
// `act4_ev_jack_returns` (§26): once, the first morning after. Only
// restores him to schedule — his actual "Sit down" greeting text is a
// prepended `ProseRule` on `act1_jack`'s own `greeting` array (a `ProseRule`
// cannot carry `moveNpc`, this file's own established split).
export const ACT4_EV_JACK_SEES_EVENT: EventDef = {
  id: EVENT_ACT4_EV_JACK_SEES,
  when: { all: [{ at: ACT3_S6_MAINTENANCE_BAY }, { flag: ACT3_UV_LAMP_ON }, { npcAt: [JACK, ACT3_S6_MAINTENANCE_BAY] }] },
  once: true,
  effects: [
    {
      say: 'He has been behind you since the ladder and has not made a sound on that tile,\nwhich for a man his size is an effort you can hear him making.\n\nThen he is not behind you. He is at your left, and he has your wrist.\n\nHe turns the arm over. He gets the lamp round on its joint with his other hand\nand holds the inside of the forearm under the shade, close, the way you hold a\npart up to a light to find the crack in it.\n\nThe skin goes flat white. The stroke does not.\n\nIt is a numeral. It has been a numeral since the first morning, and nobody has\nsaid so out loud, and nobody says so now.\n\nHe does not let go of the wrist for a while.\n\nWhen he does, he sits down. There is a chair behind him and he sits down in it\nbecause his legs have gone, and he is in it about a second before he is out of\nit again and standing well clear of it with both hands off it.\n\nHe reaches past you and turns the lamp off.\n\nThen he goes and stands at the foot of the ladder with his back to the room\nuntil you come.',
    },
    { set: [ACT4_JACK_SAW_MARK, true] },
    { grantClue: ACT4_CLUE_JACK_SAW },
    { setFollowing: [JACK, false] },
    { moveNpc: [JACK, 'offstage'] },
  ],
};

export const ACT4_EV_JACK_RETURNS_EVENT: EventDef = {
  id: EVENT_ACT4_EV_JACK_RETURNS,
  when: { all: [{ flag: ACT4_JACK_SAW_MARK }, { clockPhase: 'morning' }] },
  once: true,
  effects: [{ moveNpc: [JACK, 'schedule'] }],
};

// E1 integration builder — §26's block, moved off `act1/jack.ts`'s own
// greeting array (main-session ruling, addendum status line): task N wired
// it there as a PERMANENT rule gated `{ flag: act4_jack_saw_mark, at:
// sundown_diner }`, since a `ProseRule` has no effect slot — but a greeting
// rule also has no `once` ceiling, so the scene repeated every morning
// Jack was at the counter. An `EventDef` DOES carry `once` (§2.8): this
// renders exactly once, the first time the player finds him at the counter
// after that night, and Jack's shipped greeting (`act1/jack.ts`) resumes
// from then on. `EVENT_ACT4_EV_JACK_RETURNS` (above) is unchanged — it
// only restores Jack to his ordinary schedule; this event fires the scene
// itself, independently, whenever the player is actually there to see it.
export const ACT4_EV_JACK_MORNING_SCENE_EVENT: EventDef = {
  id: EVENT_ACT4_EV_JACK_MORNING_SCENE,
  when: { all: [{ at: SUNDOWN_DINER }, { npcAt: [JACK, SUNDOWN_DINER] }, { flag: ACT4_JACK_SAW_MARK }] },
  once: true,
  effects: [
    {
      say: 'He is on his stool. There is a second plate down beside him, cooling, with\nnobody sitting at it, and Pearl has not asked him about it.\n\n"Sit down," he says.\n\nThat is the whole of it. He eats, and lets you eat, and does not ask you one\nthing about last night, and twice he starts to say something and finds\nsomething to do with his cup instead.\n\nOn the way out he holds the door, which he has never once done, and does not\nmake anything of it.',
    },
  ],
};

// --- E1 task M ---
// Luke, the escort, R16, and the boundary (`docs/superpowers/specs/2026-09-
// 18-stage-e1-prose.md` §2's own flag-table note — "missing a window costs a
// cycle, never the game", canon 11). If the player never brings Luke to the
// door before the crews' own last day, he still leaves once that day comes,
// exactly as §23 leaves him — offstage, `act4_luke_gone` set — just without
// the scene. Gated on `act4_luke_met` (not `act4_started`) so a player who
// never once walked into the Staging Area never trips this at all.
import { ACT4_LUKE, ACT4_LUKE_GONE, ACT4_LUKE_MET, EVENT_ACT4_LUKE_GONE_MISSED } from './ids';
import { ACT4_VISIT_OVER_DAY } from './ids';

export const ACT4_EV_LUKE_GONE_MISSED_EVENT: EventDef = {
  id: EVENT_ACT4_LUKE_GONE_MISSED,
  // + not-in-the-room (v0.17.0 playtest): he slips away UNOBSERVED — firing
  // while the player stands in front of him vanished him mid-conversation.
  when: { all: [{ onOrAfterDay: ACT4_VISIT_OVER_DAY }, { flag: ACT4_LUKE_MET }, { not: { flag: ACT4_LUKE_GONE } }, { not: { at: ACT4_STAGING_AREA } }] },
  once: true,
  effects: [{ setFollowing: [ACT4_LUKE, false] }, { moveNpc: [ACT4_LUKE, 'offstage'] }, { set: [ACT4_LUKE_GONE, true] }],
};

// --- E1 task L ---
// The Staging Area, the hand-offs, and the visit's machinery
// (`docs/superpowers/specs/2026-09-18-stage-e1-prose.md` §17, §19, §37.2).
//
// `act4_ev_staging_opens` (§17): once, the day of the visit, once the
// message got through — opens the exit AND moves the detail's own scenery
// object from the Lobby (where it has stood in as the antecedent of
// `STAGING_DOOR_BLOCKED_TEXT`'s own rule 1/2 since `act4_ev_detail_
// arrives`, below) into the room itself, where §9's handlers live.
//
// `act4_ev_office_reply` (§19): `once: false` (matches `ACT2_ELI_REPLY_
// EVENT`'s own idiom, `act2/objects/censor.ts` — a due-day flag compared
// every tick, not a one-shot), delivers the office's form letter into
// box 141 once the verdict is `'plain'` OR `'rewritten'` (§16's own
// table: both get "identical" treatment) and the due day has come.
//
// `act4_ev_detail_arrives` (§37.2's own "MEN/DETAIL... in the Lobby on and
// after `act4_visit_day`" ruling, not named in §2's own event list): a
// one-time reveal, the detail's authored home being the Lobby (`hidden:
// true` there until this fires).
import {
  ACT4_DETAIL,
  ACT4_MESSAGE_DELIVERED,
  ACT4_MESSAGE_VERDICT,
  ACT4_OFFICE_REPLY_DUE,
  ACT4_REPLY_OFFICE,
  ACT4_STAGING_AREA,
  ACT4_STAGING_OPEN,
  ACT4_VISIT_DAY,
  EVENT_ACT4_EV_DETAIL_ARRIVES,
  EVENT_ACT4_EV_OFFICE_REPLY,
  EVENT_ACT4_EV_STAGING_OPENS,
} from './ids';
import { PO_BOXES } from '../act1/ids';

export const ACT4_EV_STAGING_OPENS_EVENT: EventDef = {
  id: EVENT_ACT4_EV_STAGING_OPENS,
  when: { all: [{ flag: ACT4_MESSAGE_DELIVERED }, { onOrAfterDay: ACT4_VISIT_DAY }] },
  once: true,
  effects: [{ set: [ACT4_STAGING_OPEN, true] }, { move: [ACT4_DETAIL, ACT4_STAGING_AREA] }],
};

export const ACT4_EV_OFFICE_REPLY_EVENT: EventDef = {
  id: EVENT_ACT4_EV_OFFICE_REPLY,
  when: {
    all: [
      { any: [{ flag: ACT4_MESSAGE_VERDICT, is: 'plain' }, { flag: ACT4_MESSAGE_VERDICT, is: 'rewritten' }] },
      { onOrAfterDay: ACT4_OFFICE_REPLY_DUE },
    ],
  },
  once: false,
  effects: [{ move: [ACT4_REPLY_OFFICE, { in: PO_BOXES }] }],
};

export const ACT4_EV_DETAIL_ARRIVES_EVENT: EventDef = {
  id: EVENT_ACT4_EV_DETAIL_ARRIVES,
  // `{ flag: ACT4_VISIT_ANNOUNCED }` guards `onOrAfterDay` against its own
  // unset default — same fix, same reason, as `STAGING_DOOR_BLOCKED_TEXT`'s
  // own rule (`act3/objects/lobby.ts`): `act4_visit_day` defaults to `0`,
  // which `onOrAfterDay` would otherwise read as "already due" from turn one.
  when: { all: [{ flag: ACT4_VISIT_ANNOUNCED }, { onOrAfterDay: ACT4_VISIT_DAY }] },
  once: true,
  effects: [{ reveal: ACT4_DETAIL }],
};

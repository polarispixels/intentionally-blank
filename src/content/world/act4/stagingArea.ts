// Stage E1, task L — the Staging Area, the room the visit is kept in
// (`docs/superpowers/specs/2026-09-18-stage-e1-prose.md` §3, §34 q8, §37.4).
// Prose transcribed exactly (hard rule 5). West of the Lobby, per the
// doc's own status line ruling: "q8: west, matching the shipped Lobby" —
// the shipped Lobby text and the shipped exit comment both already say
// west; register 119-125 covers other rulings, not this one directly, but
// the doc's own accepted-whole status line settles it.
//
// `area: 'act4'`. The exit exists only once `act4_staging_open` holds;
// before that the doors are the shipped `act3_staging_door` scenery object
// with its own (now four-rule) blocked text — see `act3/objects/lobby.ts`'s
// own amendment, this task's.

import type { HandlerDef, OnEnterRule, RoomDefSlice } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { LISTEN, SHOW, SMELL } from '../act1/verbs';
import { V_FOLLOW } from '../act1/ids';
import { ACT3_LOBBY } from '../act3/ids';
import { ACT4_DETAIL, ACT4_LUKE, ACT4_LUKE_GONE, ACT4_LUKE_MET, ACT4_STAGING_AREA } from './ids';
import { FOLLOW_LUKE_GONE_TEXT, SHOW_TO_DETAIL_EFFECTS } from './objects/stagingArea';
// E1 task M (`docs/superpowers/specs/2026-09-18-stage-e1-prose.md` §23's own
// alternate arm — explicitly this task's own, per its own instructions,
// even though the room it renders in is task L's). One rule, prepended
// above this file's own rule 3 (§3.3): the visit ran its course and the
// player never brought him to the S6 door at all — a genuinely different
// case from §3.3's rule 3, which (given `act4_luke_gone` is otherwise only
// ever set by §23's own full escort-and-reader scene, itself gated on the
// door already being open) in practice only ever renders once that door has
// been opened. Text transcribed exactly (hard rule 5).
import { ACT4_S6_DOOR_OPEN, ACT4_VISIT_OVER_DAY } from './ids';

// ---------------------------------------------------------------------------
// §3.1-§3.3 — description, three rules
// ---------------------------------------------------------------------------

const FIRST_SIGHT_TEXT =
  'A long room off the lobby with one window in it, lit by the same downlights as\nthe lobby and colder than the lobby by enough to notice.\n\nThe folding tables are not stacked against the wall any more. They are down the\nmiddle of the room, end to end, under a roll of white paper off a dispenser,\nwhich is what a building does with an hour\'s notice and no linen. There are\nchairs down both sides of them and nobody in any of them but one, and over the\nback of that one there is a coat.\n\nAt the far end, the county\'s whiteboard, with the grid still ruled on it in\npermanent marker and, this week, something written in the grid.\n\nOn a card table by the door, an urn, with a lead running from it along the\nskirting to a socket somebody had to go and find.\n\nThere is a man at the door you came in by and a man at the door you did not,\nand neither has looked at you since, and both know exactly where you are.';

const LUKE_PRESENT_TEXT =
  'Trestles under white paper, chairs down both sides, a whiteboard at the far\nend with somebody else\'s handwriting in the county\'s grid, and an urn on a card\ntable with a lead running to the skirting.\n\nHe is in the chair with the coat over the back of it. The two men are where the\ntwo doors are.';

const LUKE_GONE_TEXT =
  'The paper has been rolled off the trestles and put in a bin that was not in\nhere before. The chairs are back along the wall in a row. The tables are folded\nand stacked where they were the first time you looked at them through wired\nglass.\n\nThe urn is still on the card table with its lead still along the skirting.\nThere is about an inch left in it and it is cold.\n\nNobody has touched the whiteboard.';

// E1 task M, §23's alternate arm — the visit ended without the player ever
// bringing him to the door.
const LUKE_GONE_WITHOUT_DOOR_TEXT =
  'The tables are folded and stacked against the wall. The chairs are in a row.\nThe urn is cold.\n\nHe was here for two days, and then the two days were over, which is what a\nvisit is.';

const description: ProseRule[] = [
  { when: { not: { visited: ACT4_STAGING_AREA } }, text: FIRST_SIGHT_TEXT },
  { when: { not: { flag: ACT4_LUKE_GONE } }, text: LUKE_PRESENT_TEXT },
  {
    when: { all: [{ onOrAfterDay: ACT4_VISIT_OVER_DAY }, { flag: ACT4_LUKE_MET }, { not: { flag: ACT4_S6_DOOR_OPEN } }] },
    text: LUKE_GONE_WITHOUT_DOOR_TEXT,
  },
  { text: LUKE_GONE_TEXT },
];

// ---------------------------------------------------------------------------
// E1 addendum §5 — `FOLLOW LUKE`, after §23: he is `'offstage'` by then and
// the resolver cannot reach him (`resolve.ts`/`interpreter.ts` restrict npc
// noun resolution to `ScopeView.visible`, i.e. the current room), so this is
// room-scoped rather than NPC-scoped, per the addendum's own wiring note.
// `act3/lobby.ts` reuses this exact string (hard rule 5 — one text, owned
// once), the other room the addendum names. `FOLLOW_LUKE_GONE_TEXT` itself
// now lives in `./objects/stagingArea.ts` (Stage F1 — moved there, imported
// above, so that file's own `lukeGoneMarker` object, added to close the
// "`FOLLOW LUKE` by name" gap, could reuse it without a circular import
// back into this room file, which already imports FROM
// `./objects/stagingArea`); re-exported here too so `act3/lobby.ts`'s
// existing import path keeps working unchanged.
// ---------------------------------------------------------------------------

export { FOLLOW_LUKE_GONE_TEXT };

// ---------------------------------------------------------------------------
// §3.4 — room-level senses
// ---------------------------------------------------------------------------

const SMELL_TEXT =
  'Coffee that has been standing, marker pen, and the particular smell of a room\nthat has had its carpet shampooed inside the last day.';

const LISTEN_TEXT =
  'The downlights. The urn, ticking as it cools and then deciding not to. A radio\nbeing listened to by somebody wearing an earpiece, which sounds like nothing at\nall until you know what you are listening for.';

// ---------------------------------------------------------------------------
// §9.2 — SHOW <anything> TO DETAIL (room-level instrument handler; see
// `objects/stagingArea.ts`'s own header comment on why this can't be an
// object handler — register 91, `performAction`'s room-instrument rung).
// ---------------------------------------------------------------------------

const roomHandlers: HandlerDef[] = [
  { verbs: [SMELL], effects: [{ say: SMELL_TEXT }] },
  { verbs: [LISTEN], effects: [{ say: LISTEN_TEXT }] },
  { verbs: [SHOW], withInstrument: [ACT4_DETAIL], effects: SHOW_TO_DETAIL_EFFECTS },
  // E1 addendum §5 — reachable today for a bare `FOLLOW` (no object; the
  // existing room-handler-for-a-bare-verb rung, `respond.ts`'s
  // `roomAnswersBare`). `FOLLOW LUKE` by name does NOT reach this handler —
  // see this file's report: an offstage npc noun fails resolution before
  // any room handler is consulted, and fixing that is an engine change
  // beyond this task's named files. Flagged for the main session rather
  // than silently worked around.
  { verbs: [V_FOLLOW], when: { flag: ACT4_LUKE_GONE }, effects: [{ say: FOLLOW_LUKE_GONE_TEXT }] },
];

// ---------------------------------------------------------------------------
// onEnter — marks `act4_luke_met` the first time the player is in here with
// Luke actually present (same "the room's own onEnter sets the met flag"
// idiom `sundownDiner.ts`/`sheriffOffice.ts` already use for Pearl/
// Whitlock; gated on `npcAt`, unlike theirs, because Luke — unlike them —
// is not always at this post).
// ---------------------------------------------------------------------------

const onEnter: OnEnterRule[] = [{ when: { npcAt: [ACT4_LUKE, ACT4_STAGING_AREA] }, effects: [{ set: [ACT4_LUKE_MET, true] }] }];

// ---------------------------------------------------------------------------
// Exits (§37.4) — `e`/`out` back to the Lobby, unconditional.
// ---------------------------------------------------------------------------

export const stagingAreaRoom: RoomDefSlice = {
  name: 'Staging Area',
  area: 'act4',
  description,
  onEnter,
  handlers: roomHandlers,
  exits: [
    { dir: 'e', to: ACT3_LOBBY },
    { dir: 'out', to: ACT3_LOBBY },
  ],
};

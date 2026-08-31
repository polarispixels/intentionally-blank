// Act III, Stage D3, task B — the Lobby / Visitor Center room
// (`docs/superpowers/specs/2026-09-11-stage-d3-prose.md` §7). Prose
// transcribed verbatim (hard rule 5).
//
// DESCRIPTION ORDER (this task's ruling 1) — §8.1's Nolan-present rule is
// inserted ABOVE §7.1's own three rules (per the task brief: "+ §8.1's
// Nolan-present rule above them when npcAt"), so Nolan being here wins over
// even the first-sight text — the only room in this wave where presence
// outranks "have I ever been here before".
//
// §5.6's THREE ARRIVAL PREFIXES (badge/tailgate/vendor) are NOT wired here.
// They are one-time lines that must print BEFORE this room's own
// description on the turn a P16 route first delivers the player here —
// `move.ts`'s `renderArrival` always runs a room's own `onEnter` rules
// AFTER its `description` (confirmed by reading that function), so the
// only place they can actually render first is inside the arriving
// route's own effects list (`{ say: prefix }` before `{ goto: act3_lobby
// }`) — task A's own P16 route handlers (routes a/a′/d, `act3/
// perimeterRoad.ts`), not this file. Left to task A; the three texts are
// in the prose doc's own §5.6 for reference.
//
// THE INNER TURNSTILE GATE (§7.5, ruling 1) — see `act3/objects/lobby.ts`'s
// own header for why `door: ACT3_LOBBY_READER` plus an `EventDef` (not
// `exit.when`) is the mechanism that gets this room's own `blockedText`
// instead of the engine's generic no-exit refusal.

import type { ExitDefSlice, HandlerDef, RoomDefSlice } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { LISTEN, SLEEP, SMELL } from '../act1/verbs';
import { V_LOOK_UP } from '../act1/ids';
import { ACT2_NOLAN } from '../act2/ids';
import { ACT3_ALERTNESS, ACT3_DATA_HALL_A, ACT3_LOBBY, ACT3_LOBBY_READER, ACT3_PERIMETER_ROAD } from './ids';
import { PUSH_TURNSTILE_WITHOUT_BADGE_TEXT } from './objects/lobby';

// ---------------------------------------------------------------------------
// §8.1 — the lobby with Nolan in it (inserted above §7.1's own rules)
// ---------------------------------------------------------------------------

const nolanPresentText =
  'Nolan is crossing the terrazzo with a folder under his arm and a set of keys\ngoing round one finger, at the pace of a man between two things.';

// ---------------------------------------------------------------------------
// §7.1 — description
// ---------------------------------------------------------------------------

const firstSightText =
  'Somebody built a room to be walked into by people who were going to be\nimpressed, and then the people stopped coming.\n\nTwo storeys of glass on the road side. Terrazzo underfoot with brass strips in\nit. It is warm in here in a way the outside of this county has not been warm\nin weeks, and it is very clean, and the air has been standing still in it long\nenough to have gone soft.\n\nThere is a reception desk with nobody behind it and a bell on the counter.\nThere is a case in the middle of the floor with a model of the building inside\nit, lit from within. On the wall by the inner doors there is a bronze plaque,\nand beside the plaque a rack of brochures with a curl in them.\n\nThe inner doors have a turnstile and a reader. Off to the left a pair of doors\nsays CONTRACTORS — STAGING and means it.\n\nNothing anywhere in it is out of place. It is the tidiest room you have been\nin since you woke up on a floor, and there is nobody in it.';

/** §14.2's own alertness sentence, verbatim — "the second of the wave's two alertness sentences" (the first is the perimeter's own, task A). */
const alertnessText =
  'The desk, the bell, the case, the plaque, the rack. Over the inner doors there\nis a second camera on a bracket that is newer than the doors are.';

const otherwiseText =
  'Glass, terrazzo, warm still air. The desk with the bell on it, the model in\nits case, the plaque, the brochures going curly in their rack.\n\nThe inner doors and their turnstile. The staging doors on the left. Behind\nyou, the way out.';

const description: ProseRule[] = [
  { when: { npcAt: [ACT2_NOLAN, ACT3_LOBBY] }, text: nolanPresentText },
  { when: { not: { visited: ACT3_LOBBY } }, text: firstSightText },
  { when: { flag: ACT3_ALERTNESS, atLeast: 1 }, text: alertnessText },
  { text: otherwiseText },
];

// ---------------------------------------------------------------------------
// §7.8 — room-level senses and responses
// ---------------------------------------------------------------------------

const smellText = 'Floor polish, warm carpet tile that has never had anybody walk on it, and,\nfrom somewhere a long way off through a door, coffee.';

const listenText =
  'Air moving in a ceiling, doing it properly.\n\nAnd that is all, until you have been standing here a while, at which point\nyou can hear the fluorescent in the model case, and after that you cannot stop\nhearing that either.';

const lookUpText =
  'Two storeys of glass on a mullion grid, and above the terrazzo a soffit with\ndownlights in it set out on a spacing that somebody argued about.';

const sleepText =
  'Not in here. You could sit down — the lobby has a bench and the plant has a\nwarm step — but there is no version of the next few hours that you are\nprepared to spend unconscious inside this fence.';

const roomHandlers: HandlerDef[] = [
  { verbs: [SMELL], effects: [{ say: smellText }] },
  { verbs: [LISTEN], effects: [{ say: listenText }] },
  { verbs: [V_LOOK_UP], effects: [{ say: lookUpText }] },
  // §14.3's `SLEEP`/`WAIT UNTIL <phase>` refusal inside the fence is task
  // C's shared handler (ruling 4 — "you gate nothing"); bare `SLEEP` is
  // wired here only as this room's own version of that same refusal so it
  // renders even before task C's shared handler lands (identical text,
  // §14.3) — a duplicate declaration is fine (`HandlerDef` arrays take the
  // first match; task C's own, if it also targets this room, simply never
  // gets reached, causing no error).
  { verbs: [SLEEP], effects: [{ say: sleepText }] },
];

// ---------------------------------------------------------------------------
// Exits (§21.4) — `south`/`out` is free (the turnstile's leaf swings both
// ways for anybody going out); `north`/`in` is gated on the reader's own
// `open` state (see `objects/lobby.ts`); `west`/staging has no destination
// at all — the staging doors are scenery, handled entirely by their own
// object (`OPEN`/`PUSH` → `STAGING_DOOR_BLOCKED_TEXT`), not an exit.
// ---------------------------------------------------------------------------

const exits: ExitDefSlice[] = [
  { dir: 's', to: ACT3_PERIMETER_ROAD },
  { dir: 'out', to: ACT3_PERIMETER_ROAD },
  { dir: 'n', to: ACT3_DATA_HALL_A, door: ACT3_LOBBY_READER, blockedText: PUSH_TURNSTILE_WITHOUT_BADGE_TEXT },
  { dir: 'in', to: ACT3_DATA_HALL_A, door: ACT3_LOBBY_READER, blockedText: PUSH_TURNSTILE_WITHOUT_BADGE_TEXT },
];

export const lobbyRoom: RoomDefSlice = {
  name: 'Lobby',
  area: 'act3',
  description,
  exits,
  handlers: roomHandlers,
};

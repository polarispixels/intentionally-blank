// Act V, wave E3, task U — the Root Shaft (`docs/superpowers/specs/
// 2026-09-20-stage-e3-prose.md` §4-§9, §19, §42.4). Room, ladder, stencil,
// Return B, the lift landing ("it never opens"), and the stair door (the
// far side of `act3_s6_door`'s stair, E1 §21.1) — plus the exit into
// `act3_s5_reactor_interface` (this file) and the mirror exit on that room
// (`../act3/s5ReactorInterface.ts`, amended in place). Every string below is
// transcribed verbatim (hard rule 5).

import type { EventDef, HandlerDef, ObjectDefSlice, OnEnterRule, RoomDefSlice } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { EXAMINE, LISTEN, OPEN, PRY, PUSH, READ, RUB, SLEEP, SMELL, TOUCH, YELL } from '../act1/verbs';
import { V_KNOCK } from '../act1/ids';
import {
  V_ACT2_WAIT_UNTIL_AFTERNOON,
  V_ACT2_WAIT_UNTIL_EVENING,
  V_ACT2_WAIT_UNTIL_MORNING,
  V_ACT2_WAIT_UNTIL_NIGHT,
} from '../act2/ids';
import { ACT3_S5_REACTOR_INTERFACE } from '../act3/ids';
import { ACT4_S6_DOOR_OPEN } from '../act4/ids';
import {
  ACT5_CHECKPOINT_SHAFT,
  ACT5_CLUE_REVISION,
  ACT5_LADDER,
  ACT5_RECONCILIATION_RUNNING,
  ACT5_RETURN_B,
  ACT5_REVISION_STENCIL,
  ACT5_ROOT_ANTECHAMBER,
  ACT5_ROOT_SHAFT,
  ACT5_S6_BLANK_DOOR,
  ACT5_STAIR_DOOR,
  ACT5_STARTED,
  EVENT_ACT5_EV_START,
} from './ids';
import { ACT3_SERVICE_TUNNEL } from '../act3/ids';

// ---------------------------------------------------------------------------
// §4 — the room.
// ---------------------------------------------------------------------------

const firstSightText =
  'The ladder takes you down out of the tunnel wall into a shaft that is not the\nsame age as the tunnel is.\n\nThe top of it is the concrete of a building put up quickly by people who were\nbeing paid by the week: the grain of the shuttering still in it, board by\nboard, with a tide line of whitewash about a third of the way down where\nsomebody stopped and did not come back.\n\nBelow the tide line the wall is not poured and it is not block. It is smooth\nall the way round, and it is warm, and it goes down past the edge of your light\nwithout a joint in it anywhere. The ladder is bolted to it in the ordinary way,\nwith ordinary bolts, through ordinary plates, and that is the strangest thing\nin the shaft.\n\nReturn B comes down the corner behind the ladder, turns once a little below the\nlevel of your boots, and goes into the wall, and does not come out.\n\nAcross from you at about that height there is a lift landing: two steel leaves\nmeeting on a rubber seal, with the ordinary chamfer round them, and no call\nbutton on this side of them at all.\n\nThe ladder goes on down.';

const unconditionalText =
  'The shaft. Boarded concrete above the whitewash line and something with no\njoints in it below, and a ladder bolted to both as if there were no difference.\n\nUp is the tunnel. Down is where the ladder is going. There is a stencil on the\nsmooth part of the wall, a lift landing with nothing to press, and a warm pipe\ngoing into a wall it does not come out of.';

const description: ProseRule[] = [
  { when: { not: { visited: ACT5_ROOT_SHAFT } }, text: firstSightText },
  { text: unconditionalText },
];

const onEnter: OnEnterRule[] = [{ effects: [{ checkpoint: ACT5_CHECKPOINT_SHAFT }] }];

// ---------------------------------------------------------------------------
// §4.3 — room-level senses.
// ---------------------------------------------------------------------------

const listenText =
  'Water, a long way off and directly below, going through something at a steady\nrate and not varying by the width of a hair, and behind that a sound like a\nroom being large, which is already there before you start listening for it and\nstops the moment you notice you have.';

const smellText =
  'Warm dust off the concrete for the top third of it, and then nothing at all.\nNot cold, not clean, not damp. The smooth part of this shaft smells of nothing\nwhatsoever, which is a thing surfaces do not generally manage.';

const yellText = 'It goes up and comes back off the boarding, and it goes down and does not come\nback off anything.';

const sleepWaitText = 'Halfway down a ladder in a hole under a county, with the light you brought and\nthe batteries you have got. No.';

const roomHandlers: HandlerDef[] = [
  { verbs: [LISTEN], effects: [{ say: listenText }] },
  { verbs: [SMELL], effects: [{ say: smellText }] },
  { verbs: [YELL], effects: [{ say: yellText }] },
  {
    verbs: [SLEEP, V_ACT2_WAIT_UNTIL_MORNING, V_ACT2_WAIT_UNTIL_AFTERNOON, V_ACT2_WAIT_UNTIL_EVENING, V_ACT2_WAIT_UNTIL_NIGHT],
    effects: [{ say: sleepWaitText }],
  },
];

// ---------------------------------------------------------------------------
// §5 — the ladder.
// ---------------------------------------------------------------------------

const ladderExamineText =
  'Steel, bolted through the wall in fours, with the rungs worn bright on top and\nuntouched underneath.\n\nThe bolts through the boarded concrete are rusted at the heads and painted\nover. The bolts through the smooth part are not rusted, not painted, and not\nnewer. They are the same bolts, and they have been in that wall for exactly as\nlong, and one half of the wall has aged and the other has not.';

/** §5 — "CLIMB DOWN"/bare `DOWN`, this room's own `down` exit's `travelText`. */
export const LADDER_CLIMB_DOWN_TEXT =
  'The rungs go on being rungs for longer than you were expecting, and the light\nyou have got throws your own shadow down the wall ahead of you the whole way,\nwhich is company of a sort.';

/** §5 — "CLIMB UP"/bare `UP`, the shaft's own `up` exit's default `travelText` arm (below §19's reconciliation arm). */
export const LADDER_CLIMB_UP_TEXT =
  'Up past the lift landing, up past the stencil, up past the tide line, and out\nthrough a hatch into a mile of poured tube with rails in the floor of it.';

/** §19 — the reconciliation-arm `travelText`, prepended above `LADDER_CLIMB_UP_TEXT` on the shaft's own `up` exit (`ProseRule[]`, `Prose`'s own state-dependent shape — see this room's own `exits` below). */
const climbUpReconciliationText =
  'Up the ladder, past the lift landing with nothing to press, past the stencil,\npast the tide line, and out into a mile of poured tube with the air on your\nback.\n\nIt takes a while. Nothing at all happens while it is taking it.';

const climbUpTravelText: ProseRule[] = [
  { when: { flag: ACT5_RECONCILIATION_RUNNING }, text: climbUpReconciliationText },
  { text: LADDER_CLIMB_UP_TEXT },
];

const ladder: ObjectDefSlice = {
  location: ACT5_ROOT_SHAFT,
  name: 'ladder',
  portable: false,
  reachableInDark: true,
  nouns: ['ladder', 'rungs', 'rung', 'bolts', 'plates', 'string'],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: ladderExamineText }] }],
};

// ---------------------------------------------------------------------------
// §6 — the stencil. Grants `act5_clue_revision`.
// ---------------------------------------------------------------------------

const stencilExamineText =
  'On the smooth part of the wall at head height, in white, sprayed through a\nstencil that somebody held a little crooked:\n\n    SYSTEM REVISION\n    2089.4\n\nThe overspray has feathered where the stencil lifted at one corner. The paint\nhas not aged.\n\nNeither has the wall it is on, so there is nothing here to compare it to.';

const stencilTouchText = 'It is in the surface rather than on it. Your thumb comes away white and the\nletters do not change.';

const revisionStencil: ObjectDefSlice = {
  location: ACT5_ROOT_SHAFT,
  name: 'stencil',
  portable: false,
  nouns: ['stencil', 'paint', 'spray', 'revision', 'marking', 'writing', 'letters', 'sign'],
  handlers: [
    { verbs: [EXAMINE, READ], effects: [{ say: stencilExamineText }, { grantClue: ACT5_CLUE_REVISION }] },
    { verbs: [TOUCH, RUB], effects: [{ say: stencilTouchText }] },
  ],
};

// ---------------------------------------------------------------------------
// §7 — Return B. Nouns reused verbatim from `act3/objects/pipeChase.ts`'s
// own lower Return B instance (§42.2's own ruling: "same pipe, fourth room").
// ---------------------------------------------------------------------------

const pipeExamineText =
  "Twelve inches, bare steel from a yard below the Sublevel 5 floor and bare all\nthe way down here, coming past the ladder in the corner and turning once into\nthe smooth wall a little below the level of your boots.\n\nIt arrives, and it goes in, and there is no flange, no seal, no collar and no\nmade-good where it goes in. The wall is closed round it the way skin is closed\nround a splinter.";

const pipeTouchText =
  "Warm. Blood warm, or a shade under it, the same as it was five floors up in a\nplant room with a drawing on the wall that does not have this pipe on it.";

const returnB: ObjectDefSlice = {
  location: ACT5_ROOT_SHAFT,
  name: 'pipe',
  portable: false,
  nouns: ['return b', 'b', 'return', 'pipe', 'warm pipe', 'bare pipe', 'steel', 'lagging'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: pipeExamineText }] },
    { verbs: [TOUCH], effects: [{ say: pipeTouchText }] },
  ],
};

// ---------------------------------------------------------------------------
// §8 — the lift landing. It never opens, in any state, for any tool.
// §42.2's own noun ruling: `doors`/`lift`/`leaves`, NOT bare `door` (that
// word is the stair door's, below, so bare `DOOR` clarifies between them).
// ---------------------------------------------------------------------------

const liftExamineText =
  'Two steel leaves meeting on a rubber seal, in a frame with the same chamfer as\nevery lift landing in the building above you.\n\nThere is no call button on this side, and no place a call button was taken out\nof. There is no floor number over the frame, and no place one was.\n\nThere is a slot the width of a screwdriver where the leaves meet, at the\nheight a man\'s hands go, and the paint round it is unmarked.';

const liftOpenText =
  'The leaf you get the leg behind moves about the width of a card and then meets\nwhatever holds a lift landing shut when the car is not there, which is designed\nto hold and does.\n\nThrough the gap: a shaft, and a rail, and a great deal of air, and no car in\neither direction as far as your light will go.\n\nYou take the leg out and the gap closes itself, unhurried, the way it was\nbuilt to.';

const liftKnockText =
  'The knock goes into the lift shaft and comes back off four walls at four\ndifferent times, which is more information about the shaft than you wanted and\nnone at all about the floor.';

const s6BlankDoor: ObjectDefSlice = {
  location: ACT5_ROOT_SHAFT,
  name: 'lift landing',
  portable: false,
  nouns: ['doors', 'lift', 'landing', 'leaves', 'steel doors', 'seal', 'blank door'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: liftExamineText }] },
    { verbs: [OPEN, PRY, PUSH], effects: [{ say: liftOpenText }] },
    { verbs: [V_KNOCK, LISTEN], effects: [{ say: liftKnockText }] },
  ],
};

// ---------------------------------------------------------------------------
// §9 — the stair door. The far side of `act3_s6_door`'s stair (E1 §21.1).
// `open: true` iff `{ flag: act4_s6_door_open }` — a plain `container`
// (no `key`), synced from that already-permanent flag by its own one-time
// event below, so the shaft's own `e` exit (this room's `exits`) gets a
// real `blockedText`/travel distinction rather than falling to the generic
// families. `act4_s6_door_open` is set exactly once (E1's `s6DoorLukeEffects`,
// `act3/objects/s5ReactorInterface.ts`, untouched) and never reverts, so
// `once: true` is sufficient — no per-tick re-sync needed.
// ---------------------------------------------------------------------------

const stairDoorExamineOpenText =
  'A steel fire door standing open on a hook, at the bottom of a flight of poured\nsteps that come down out of a light you can see from here and have walked in.\n\nIt has been open since a man in a suit went back up it and got into a lift with\nsomebody holding his elbow.';

/** §9.2 — also this room's own `e` exit's `blockedText`, below. */
export const STAIR_DOOR_EXAMINE_SHUT_TEXT =
  'A steel fire door in the shaft wall, shut, with a closer on it and no handle on\nthis side.\n\nSomewhere behind it there is a stair, and at the top of the stair a door that\nwants two things, and you have got neither of them and never had.';

const stairDoorExamine: ProseRule[] = [
  { when: { flag: ACT4_S6_DOOR_OPEN }, text: stairDoorExamineOpenText },
  { text: STAIR_DOOR_EXAMINE_SHUT_TEXT },
];

const stairDoor: ObjectDefSlice = {
  location: ACT5_ROOT_SHAFT,
  name: 'stair door',
  portable: false,
  container: { open: false },
  nouns: ['door', 'stair door', 'fire door', 'steps'],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: stairDoorExamine }] }],
};

/** Keeps `act5_stair_door`'s own `container.open` state true from the tick `act4_s6_door_open` first holds — see this object's own header note. */
export const ACT5_STAIR_DOOR_SYNC_EVENT: EventDef = {
  id: 'act5_ev_stair_door_sync',
  when: { flag: ACT4_S6_DOOR_OPEN },
  once: true,
  effects: [{ setState: [ACT5_STAIR_DOOR, 'open', true] }],
};

// ---------------------------------------------------------------------------
// `act5_ev_start` — once, on the shaft's own first visit, no text.
// ---------------------------------------------------------------------------

export const ACT5_EV_START_EVENT: EventDef = {
  id: EVENT_ACT5_EV_START,
  when: { visited: ACT5_ROOT_SHAFT },
  once: true,
  effects: [{ set: [ACT5_STARTED, true] }],
};

// ---------------------------------------------------------------------------
// The room.
// ---------------------------------------------------------------------------

export const rootShaftRoom: RoomDefSlice = {
  name: 'Root Shaft',
  area: 'act5',
  description,
  onEnter,
  handlers: roomHandlers,
  exits: [
    { dir: 'up', to: ACT3_SERVICE_TUNNEL, travelText: climbUpTravelText },
    { dir: 'down', to: ACT5_ROOT_ANTECHAMBER, travelText: LADDER_CLIMB_DOWN_TEXT },
    { dir: 'e', to: ACT3_S5_REACTOR_INTERFACE, door: ACT5_STAIR_DOOR, blockedText: STAIR_DOOR_EXAMINE_SHUT_TEXT },
  ],
};

export const ACT5_ROOT_SHAFT_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT5_LADDER]: ladder,
  [ACT5_REVISION_STENCIL]: revisionStencil,
  [ACT5_RETURN_B]: returnB,
  [ACT5_S6_BLANK_DOOR]: s6BlankDoor,
  [ACT5_STAIR_DOOR]: stairDoor,
};

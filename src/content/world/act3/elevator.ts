// The freight elevator (D3 prose doc §13) — "a door that moves," one
// physical object per the spec, shared between the Cooling Plant and
// Corridor B4. `ObjectDefSlice.location` is a single `PlaceId`
// (`engine/world.ts`), so one object cannot sit in two rooms; every object
// below is declared twice (`_PLANT`/`_B4`, `ids.ts`'s own note), sharing one
// set of handler arrays built once and placed twice by `buildElevator`
// below, so the two rooms can never render two different strings for the
// same button. Sub-parts (`panel`, `certificate`, the three buttons, the
// blank) are placed `{ on: <parent> }`, not `{ in: <parent> }` — `on` needs
// no open/transparent gate (`engine/world.ts`'s `inScopeAt`), and none of
// these are literal containers a player could shut.
//
// "ENTER LIFT"/"IN" (§13.3) is answered by an object-level handler on the
// door itself for `DIRECTION_VERB_IDS.in` — object handlers are checked
// before the verb's own built-in door-traversal dispatch (`actions.ts`'s
// response ladder, rung 1 before rung 2; `move.ts`'s own header on "ENTER
// DOOR" reaching `traverseDoor` only once no object handler already
// claimed it), so this overrides `traverseDoor` entirely rather than
// trying to make the door a real, currently-nonexistent room. Bare "in"/
// "down" (no dobj) is the exits' own job (`move.ts`'s header) and is
// deliberately NOT wired here — going down without naming the lift reaches
// the ordinary "no exit that way" family, which is correct: the lift is
// reached by naming it, never by a bare direction.

import type { Effect } from '../../../engine/effects';
import type { ObjectDefSlice, HandlerDef } from '../../../engine/world';
import type { ObjectId, RoomId } from '../../../engine/ids';
import { DIRECTION_VERB_IDS } from '../../../engine/move';
import { EXAMINE, LOOK_BEHIND, OPEN, PULL, READ } from '../act1/verbs';
import { V_CALL, V_RING } from '../act1/ids';
import {
  ACT3_ELEVATOR_BLANK_B4,
  ACT3_ELEVATOR_BLANK_PLANT,
  ACT3_ELEVATOR_BUTTON_L_B4,
  ACT3_ELEVATOR_BUTTON_L_PLANT,
  ACT3_ELEVATOR_BUTTON_S1_B4,
  ACT3_ELEVATOR_BUTTON_S1_PLANT,
  ACT3_ELEVATOR_BUTTON_S5_B4,
  ACT3_ELEVATOR_BUTTON_S5_PLANT,
  ACT3_ELEVATOR_CERTIFICATE_B4,
  ACT3_ELEVATOR_CERTIFICATE_PLANT,
  ACT3_ELEVATOR_DOOR_B4,
  ACT3_ELEVATOR_DOOR_PLANT,
  ACT3_ELEVATOR_PANEL_B4,
  ACT3_ELEVATOR_PANEL_PLANT,
  ACT3_ELEVATOR_RIDE_SCRIPT,
  ACT3_ELEVATOR_CALLED,
  ACT3_PRESSED_BLANK,
  V_UNBOLT,
} from './ids';

// ---------------------------------------------------------------------------
// §13.1 — the door.
// ---------------------------------------------------------------------------

const doorExamine =
  'A freight lift: two leaves, centre-opening, in a frame with a scarred steel\nthreshold that has had pallets over it for a lot of years.\n\nA call button on a plate beside it, a black disc that has been pressed by\ngloves. Above the door, a position indicator with a short row of little\nwindows in it, and the lit one is L.';

// §13.2
const callText =
  'The button lights. Something a long way below starts, and takes its time about\nit, and arrives, and the leaves go back on a car big enough to put a pallet\nin and turn round.';

// §13.3
const enterText =
  'Steel walls with quilted pads hung on hooks over them, one of the pads folded\nback and left that way. A bulb behind a wire cage in the ceiling. A floor of\nchequer plate with the pattern worn smooth down the middle and still sharp at\nthe edges.\n\nAn inspection certificate in a small brass frame with a hinged glass front.\n\nThe panel is on the right, beside the door.';

// §13.9 — "OPEN DOORS between floors / STOP LIFT."
const interlockText =
  'There is no stop switch on this panel — a stop switch on a freight car is a\nthing that gets leaned on — and the leaves are interlocked with the car, and\nthe interlock is the reason that people who ride lifts arrive at floors.';

// §13.9 — "PULL PADS / LOOK BEHIND PADS."
const padsText =
  'Quilted movers’ blankets on hooks, hung to keep freight off the walls. Behind\nthem: steel, and the marks of about twenty years of freight that arrived\nbefore somebody bought the blankets.';

const callEffects: Effect[] = [{ say: callText }, { set: [ACT3_ELEVATOR_CALLED, true] }];

const doorHandlers: HandlerDef[] = [
  { verbs: [EXAMINE], effects: [{ say: doorExamine }] },
  { verbs: [V_CALL, V_RING], effects: callEffects },
  { verbs: [DIRECTION_VERB_IDS.in], effects: [{ say: enterText }] },
  { verbs: [OPEN], effects: [{ say: interlockText }] },
  { verbs: [PULL, LOOK_BEHIND], effects: [{ say: padsText }] },
];

// ---------------------------------------------------------------------------
// §13.4 — the panel (minus the blank and the three buttons, sub-parts below).
// ---------------------------------------------------------------------------

const panelExamine =
  'A brushed plate with the buttons in a column and a printed legend strip beside\nthem:\n\n    L\n    S1\n    S5\n\nThere is no S2, S3 or S4, because a freight lift stops where there is\nsomething to unload.\n\nUnder S5 there is a fourth position in the column, and in that position there\nis a blank: a plain disc of the same brushed steel, flush with the plate, with\na screw hole on either side of it.\n\nThe legend strip beside the blank has nothing printed on it. It is not\nscratched out and it is not covered over. It was printed that way, and cut\nthat way, and fitted.';

const panelHandlers: HandlerDef[] = [{ verbs: [EXAMINE], effects: [{ say: panelExamine }] }];

// §13.5 — "PRESS BLANK."
const pressBlankText =
  'It is not a button. There is nothing behind it to move and nothing under it to\nbe pressed.\n\nYour fingertip comes away with a very small amount of the polish that has\nbuilt up on it over the years, from exactly this.';

// §13.6 — "UNSCREW BLANK / PRY BLANK / REMOVE BLANK."
const unscrewBlankText =
  'The two screw holes have no screws in them, and they are the wrong size and\nthe wrong spacing for anything on this plate, which means that whatever those\ntwo screws once held was held on some other plate, in some other version of\nthis car.\n\nThe blank itself is not held on by anything. It is a plug. It is a tight one,\nand it is not coming out for a coin, a chair leg, or a man in a hat.';

const blankExamine =
  'A plain disc of brushed steel, flush with the plate, with a screw hole on\neither side of it. The legend strip beside it has nothing printed on it.';

const blankHandlers: HandlerDef[] = [
  { verbs: [EXAMINE], effects: [{ say: blankExamine }] },
  { verbs: [V_RING], effects: [{ say: pressBlankText }, { set: [ACT3_PRESSED_BLANK, true] }] },
  { verbs: [V_UNBOLT], effects: [{ say: unscrewBlankText }] },
];

// §13.8 — "PRESS S1 / PRESS S5," via the shared ride script.
const rideEffects: Effect[] = [{ script: { id: ACT3_ELEVATOR_RIDE_SCRIPT } }];
const s1Handlers: HandlerDef[] = [
  { verbs: [EXAMINE], effects: [{ say: 'One of the three buttons in the column: S1.' }] },
  { verbs: [V_RING], effects: rideEffects },
];
const s5Handlers: HandlerDef[] = [
  { verbs: [EXAMINE], effects: [{ say: 'One of the three buttons in the column: S5.' }] },
  { verbs: [V_RING], effects: rideEffects },
];

// §13.9 — "PRESS L while already at L."
const pressLText =
  'The L lights, the car does not move, and the leaves open again on the room you\nare standing in, which is the lift being polite about it.';
const lHandlers: HandlerDef[] = [
  { verbs: [EXAMINE], effects: [{ say: 'One of the three buttons in the column: L, lit.' }] },
  { verbs: [V_RING], effects: [{ say: pressLText }] },
];

// ---------------------------------------------------------------------------
// §13.7 — "READ CERTIFICATE."
// ---------------------------------------------------------------------------

const certificateText =
  'A card in a hinged brass frame, ruled into boxes, filled in by hand.\n\nRated load in pounds. Number of persons. Date of last examination, which was\nthis year. Date of the next, which is not far off. A signature in the last box\nthat is nobody you have heard of, in a hand you have not seen before.';

const certificateHandlers: HandlerDef[] = [{ verbs: [EXAMINE, READ], effects: [{ say: certificateText }] }];

// ---------------------------------------------------------------------------
// One physical elevator, placed twice.
// ---------------------------------------------------------------------------

interface ElevatorIds {
  room: RoomId;
  door: ObjectId;
  panel: ObjectId;
  blank: ObjectId;
  l: ObjectId;
  s1: ObjectId;
  s5: ObjectId;
  certificate: ObjectId;
  /** "FAR DOOR" in B4 must resolve to the lift (D3 prose doc §21.2) — the B4 instance's own extra noun. */
  extraDoorNouns?: string[];
}

function buildElevator(ids: ElevatorIds): Record<string, ObjectDefSlice> {
  const door: ObjectDefSlice = {
    location: ids.room,
    name: 'lift',
    nouns: [
      'lift', 'elevator', 'lift door', 'doors', 'freight lift', 'freight elevator',
      'call button', 'button', 'indicator', 'threshold', 'pads', 'pad',
      ...(ids.extraDoorNouns ?? []),
    ],
    handlers: doorHandlers,
  };
  const panel: ObjectDefSlice = {
    location: { on: ids.door },
    name: 'button panel',
    // §21.2: "give the elevator panel the adjective button" — distinguishes
    // it from the corridor's own wall panel (`objects/corridorB4.ts`,
    // adjective "access"/"wall") once both are in scope in Corridor B4.
    // v0.13.0 playtest: this panel hangs on the lift door, so it is in
    // scope the whole time the player is in B4, and B4's own description
    // ends "The panel on the right." A bare "panel" there must be the wall
    // panel, not a clarify — so the B4 instance (the one with
    // `extraDoorNouns`) drops the bare word and keeps "button panel".
    nouns: [...(ids.extraDoorNouns ? [] : ['panel']), 'buttons', 'button panel', 'plate', 'escutcheon', 'legend', 'strip'],
    adjectives: ['button'],
    handlers: panelHandlers,
  };
  const blank: ObjectDefSlice = { location: { on: ids.panel }, name: 'blank', nouns: ['blank', 'blanks', 'screw holes', 'holes'], handlers: blankHandlers };
  const l: ObjectDefSlice = { location: { on: ids.panel }, name: 'L', nouns: ['l'], handlers: lHandlers };
  const s1: ObjectDefSlice = { location: { on: ids.panel }, name: 'S1', nouns: ['s1', 'sublevel 1'], handlers: s1Handlers };
  const s5: ObjectDefSlice = { location: { on: ids.panel }, name: 'S5', nouns: ['s5', 'sublevel 5'], handlers: s5Handlers };
  const certificate: ObjectDefSlice = {
    location: { on: ids.door },
    name: 'certificate',
    nouns: ['certificate', 'card', 'inspection certificate', 'frame'],
    handlers: certificateHandlers,
  };
  return {
    [ids.door]: door,
    [ids.panel]: panel,
    [ids.blank]: blank,
    [ids.l]: l,
    [ids.s1]: s1,
    [ids.s5]: s5,
    [ids.certificate]: certificate,
  };
}

export function elevatorObjects(coolingPlant: RoomId, corridorB4: RoomId): Record<string, ObjectDefSlice> {
  return {
    ...buildElevator({
      room: coolingPlant,
      door: ACT3_ELEVATOR_DOOR_PLANT,
      panel: ACT3_ELEVATOR_PANEL_PLANT,
      blank: ACT3_ELEVATOR_BLANK_PLANT,
      l: ACT3_ELEVATOR_BUTTON_L_PLANT,
      s1: ACT3_ELEVATOR_BUTTON_S1_PLANT,
      s5: ACT3_ELEVATOR_BUTTON_S5_PLANT,
      certificate: ACT3_ELEVATOR_CERTIFICATE_PLANT,
    }),
    ...buildElevator({
      room: corridorB4,
      door: ACT3_ELEVATOR_DOOR_B4,
      panel: ACT3_ELEVATOR_PANEL_B4,
      blank: ACT3_ELEVATOR_BLANK_B4,
      l: ACT3_ELEVATOR_BUTTON_L_B4,
      s1: ACT3_ELEVATOR_BUTTON_S1_B4,
      s5: ACT3_ELEVATOR_BUTTON_S5_B4,
      certificate: ACT3_ELEVATOR_CERTIFICATE_B4,
      extraDoorNouns: ['far door'],
    }),
  };
}

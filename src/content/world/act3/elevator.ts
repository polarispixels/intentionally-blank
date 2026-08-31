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
  // D4 task B (§12.1) — the lift's two new physical instances, in S1
  // ("_GALLERY") and S5 ("_REACTOR"), plus the rooms/clue the ride script
  // and the blank's added line now read.
  ACT3_ELEVATOR_DOOR_GALLERY,
  ACT3_ELEVATOR_PANEL_GALLERY,
  ACT3_ELEVATOR_BLANK_GALLERY,
  ACT3_ELEVATOR_BUTTON_L_GALLERY,
  ACT3_ELEVATOR_BUTTON_S1_GALLERY,
  ACT3_ELEVATOR_BUTTON_S5_GALLERY,
  ACT3_ELEVATOR_CERTIFICATE_GALLERY,
  ACT3_ELEVATOR_DOOR_REACTOR,
  ACT3_ELEVATOR_PANEL_REACTOR,
  ACT3_ELEVATOR_BLANK_REACTOR,
  ACT3_ELEVATOR_BUTTON_L_REACTOR,
  ACT3_ELEVATOR_BUTTON_S1_REACTOR,
  ACT3_ELEVATOR_BUTTON_S5_REACTOR,
  ACT3_ELEVATOR_CERTIFICATE_REACTOR,
  ACT3_S1_MECHANICAL_GALLERY,
  ACT3_S5_REACTOR_INTERFACE,
  ACT3_COOLING_PLANT,
  ACT3_CLUE_NO_LOWER,
} from './ids';

// ---------------------------------------------------------------------------
// §13.1 — the door.
// ---------------------------------------------------------------------------

const doorExamine =
  'A freight lift: two leaves, centre-opening, in a frame with a scarred steel threshold that has had pallets over it for a lot of years.\n\nA call button on a plate beside it, a black disc that has been pressed by gloves. Above the door, a position indicator with a short row of little windows in it, and the lit one is L.';

// §13.2
const callText =
  'The button lights. Something a long way below starts, and takes its time about it, and arrives, and the leaves go back on a car big enough to put a pallet in and turn round.';

// §13.3
const enterText =
  'Steel walls with quilted pads hung on hooks over them, one of the pads folded back and left that way. A bulb behind a wire cage in the ceiling. A floor of chequer plate with the pattern worn smooth down the middle and still sharp at the edges.\n\nAn inspection certificate in a small brass frame with a hinged glass front.\n\nThe panel is on the right, beside the door.';

// §13.9 — "OPEN DOORS between floors / STOP LIFT."
const interlockText =
  'There is no stop switch on this panel — a stop switch on a freight car is a thing that gets leaned on — and the leaves are interlocked with the car, and the interlock is the reason that people who ride lifts arrive at floors.';

// §13.9 — "PULL PADS / LOOK BEHIND PADS."
const padsText =
  'Quilted movers’ blankets on hooks, hung to keep freight off the walls. Behind them: steel, and the marks of about twenty years of freight that arrived before somebody bought the blankets.';

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
  'A brushed plate with the buttons in a column and a printed legend strip beside them:\n\n    L S1 S5\n\nThere is no S2, S3 or S4, because a freight lift stops where there is something to unload.\n\nUnder S5 there is a fourth position in the column, and in that position there is a blank: a plain disc of the same brushed steel, flush with the plate, with a screw hole on either side of it.\n\nThe legend strip beside the blank has nothing printed on it. It is not scratched out and it is not covered over. It was printed that way, and cut that way, and fitted.';

const panelHandlers: HandlerDef[] = [{ verbs: [EXAMINE], effects: [{ say: panelExamine }] }];

// §13.5 — "PRESS BLANK."
const pressBlankText =
  'It is not a button. There is nothing behind it to move and nothing under it to be pressed.\n\nYour fingertip comes away with a very small amount of the polish that has built up on it over the years, from exactly this.';

// D4 §12.2 — appended once S5 has been visited, read against
// `act3_pressed_blank` exactly as the doc's own `when` states (§21.1: "read
// here"): evaluated against state as it stands *before* this same press
// sets the flag below, so — on the doc's own literal condition — the added
// line first shows on the press after the one that first sets the flag.
// Flagged in this task's report as the doc's own reading, not rounded.
// Grants `act3_clue_no_lower`, which nothing in D3 already granted (grepped
// clean, per this task's brief).
const pressBlankAddedLine =
  'The polish on it is deeper than the polish on S5, and S5 is the button that takes a man to the bottom of his own building.';

const pressBlankEffects: Effect[] = [
  { say: pressBlankText },
  {
    if: {
      // §12.2 "now that S5 has been stood on": the main session reads the doc's
      // extra `act3_pressed_blank` arm as a slip — with it the line only appeared
      // on the SECOND press after S5, which is not what the section says.
      when: { visited: ACT3_S5_REACTOR_INTERFACE },
      then: [{ say: pressBlankAddedLine }, { grantClue: ACT3_CLUE_NO_LOWER }],
    },
  },
  { set: [ACT3_PRESSED_BLANK, true] },
];

// §13.6 — "UNSCREW BLANK / PRY BLANK / REMOVE BLANK."
const unscrewBlankText =
  'The two screw holes have no screws in them, and they are the wrong size and the wrong spacing for anything on this plate, which means that whatever those two screws once held was held on some other plate, in some other version of this car.\n\nThe blank itself is not held on by anything. It is a plug. It is a tight one, and it is not coming out for a coin, a chair leg, or a man in a hat.';

const blankExamine =
  'A plain disc of brushed steel, flush with the plate, with a screw hole on either side of it. The legend strip beside it has nothing printed on it.';

const blankHandlers: HandlerDef[] = [
  { verbs: [EXAMINE], effects: [{ say: blankExamine }] },
  { verbs: [V_RING], effects: pressBlankEffects },
  { verbs: [V_UNBOLT], effects: [{ say: unscrewBlankText }] },
];

// ---------------------------------------------------------------------------
// D4 §12.1 — the lift's real S1/S5 stops. Each button's own behaviour now
// depends on which floor its OWN instance stands on: pressing the button
// for the floor you are already standing on is the "polite about it"
// refusal (D3's own text for L, §12.1's own new "a second time" text for
// S1/S5); pressing any OTHER floor's button rides there for real, via the
// one shared ride script (`act3/scripts.ts`), passed the destination room
// as `args.dest` — replacing D3's boundary (§21.1).
// ---------------------------------------------------------------------------

type Floor = 'l' | 's1' | 's5';

/**
 * D4 task B assumption, flagged in this task's report: pressing "L" from S1
 * or S5 always returns the car to the Cooling Plant instance. Nothing in
 * this build tracks which physical "L" room (Cooling Plant or Corridor B4)
 * the car was actually called from — the doc's own §12.1/§21.4 name only
 * S1's/S5's own two stops ("L / S5" from S1, "L / S1" from S5) and never
 * say which "L" room "L" resolves to from below.
 */
const FLOOR_ROOM: Record<Floor, RoomId> = {
  l: ACT3_COOLING_PLANT,
  s1: ACT3_S1_MECHANICAL_GALLERY,
  s5: ACT3_S5_REACTOR_INTERFACE,
};

const FLOOR_EXAMINE: Record<Floor, string> = {
  l: 'One of the three buttons in the column: L, lit.',
  s1: 'One of the three buttons in the column: S1.',
  s5: 'One of the three buttons in the column: S5.',
};

// §13.9 — "PRESS L while already at L" (D3, unchanged).
const pressLText =
  'The L lights, the car does not move, and the leaves open again on the room you are standing in, which is the lift being polite about it.';

// §12.1 — "PRESS S1 / PRESS S5 while already at that floor": the same joke,
// its own second telling, in its own words.
const alreadyAtFloorText =
  'The button lights, the car does not move, and the leaves open again on the floor you are standing on, which is the lift being polite about it a second time.';

function floorButtonHandlers(button: Floor, instanceFloor: Floor): HandlerDef[] {
  const ringEffects: Effect[] =
    button === instanceFloor
      ? [{ say: button === 'l' ? pressLText : alreadyAtFloorText }]
      : [{ script: { id: ACT3_ELEVATOR_RIDE_SCRIPT, args: { dest: FLOOR_ROOM[button] } } }];
  return [
    { verbs: [EXAMINE], effects: [{ say: FLOOR_EXAMINE[button] }] },
    { verbs: [V_RING], effects: ringEffects },
  ];
}

// ---------------------------------------------------------------------------
// §13.7 — "READ CERTIFICATE."
// ---------------------------------------------------------------------------

const certificateText =
  'A card in a hinged brass frame, ruled into boxes, filled in by hand.\n\nRated load in pounds. Number of persons. Date of last examination, which was this year. Date of the next, which is not far off. A signature in the last box that is nobody you have heard of, in a hand you have not seen before.';

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
  /** D4 task B addition (§12.1) — which floor THIS instance stands on, so its own three buttons know which one is "already here" versus a real ride. */
  floor: Floor;
}

function buildElevator(ids: ElevatorIds): Record<string, ObjectDefSlice> {
  const door: ObjectDefSlice = {
    location: ids.room,
    name: 'lift',
    nouns: [
      'lift', 'elevator', 'lift door', 'doors', 'freight lift', 'freight elevator',
      'call button', 'button', 'indicator', 'threshold', 'door pads', 'door pad',
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
    // v0.14.0: no bare "panel" — the compound "button panel" makes this a
    // candidate for "panel" only where nothing lists the bare word
    // (`vocabulary.ts` compound heads), so in B4 the wall panel wins the bare
    // word and "button panel" still reaches this one.
    nouns: ['buttons', 'button panel', 'plate', 'escutcheon', 'legend', 'strip'],
    adjectives: ['button'],
    handlers: panelHandlers,
  };
  const blank: ObjectDefSlice = { location: { on: ids.panel }, name: 'blank', nouns: ['blank', 'blanks', 'screw holes', 'holes'], handlers: blankHandlers };
  const l: ObjectDefSlice = { location: { on: ids.panel }, name: 'L', nouns: ['l'], handlers: floorButtonHandlers('l', ids.floor) };
  const s1: ObjectDefSlice = { location: { on: ids.panel }, name: 'S1', nouns: ['s1', 'sublevel 1'], handlers: floorButtonHandlers('s1', ids.floor) };
  const s5: ObjectDefSlice = { location: { on: ids.panel }, name: 'S5', nouns: ['s5', 'sublevel 5'], handlers: floorButtonHandlers('s5', ids.floor) };
  const certificate: ObjectDefSlice = {
    location: { on: ids.door },
    name: 'certificate',
    nouns: ['certificate', 'inspection card', 'inspection certificate', 'frame'],
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

/**
 * D4 task B (§12.1, §21.4): the lift now really reaches four rooms, not
 * two — `s1Room`/`s5Room` are new params (`s1Room` is this task's own
 * room; `s5Room` is task C's — passed through by id only, per this task's
 * brief). Same `buildElevator` for all four; only `floor` differs.
 */
export function elevatorObjects(coolingPlant: RoomId, corridorB4: RoomId, s1Room: RoomId, s5Room: RoomId): Record<string, ObjectDefSlice> {
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
      floor: 'l',
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
      floor: 'l',
    }),
    ...buildElevator({
      room: s1Room,
      door: ACT3_ELEVATOR_DOOR_GALLERY,
      panel: ACT3_ELEVATOR_PANEL_GALLERY,
      blank: ACT3_ELEVATOR_BLANK_GALLERY,
      l: ACT3_ELEVATOR_BUTTON_L_GALLERY,
      s1: ACT3_ELEVATOR_BUTTON_S1_GALLERY,
      s5: ACT3_ELEVATOR_BUTTON_S5_GALLERY,
      certificate: ACT3_ELEVATOR_CERTIFICATE_GALLERY,
      floor: 's1',
    }),
    ...buildElevator({
      room: s5Room,
      door: ACT3_ELEVATOR_DOOR_REACTOR,
      panel: ACT3_ELEVATOR_PANEL_REACTOR,
      blank: ACT3_ELEVATOR_BLANK_REACTOR,
      l: ACT3_ELEVATOR_BUTTON_L_REACTOR,
      s1: ACT3_ELEVATOR_BUTTON_S1_REACTOR,
      s5: ACT3_ELEVATOR_BUTTON_S5_REACTOR,
      certificate: ACT3_ELEVATOR_CERTIFICATE_REACTOR,
      floor: 's5',
    }),
  };
}

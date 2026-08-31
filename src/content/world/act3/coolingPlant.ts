// Act III, Stage D3 task C — the Cooling Plant room (D3 prose doc §10).
//
// D4 task D amendment (D4 prose doc §12.3, §21.1): the hatch's `down` exit
// is a real exit now, to the Pipe Chase — D3's own boundary wiring on this
// exit (a self-loop through `ACT3_BOUNDARY_GATE`, D3's system line
// concatenated onto the in-world ladder text) is retired for this route.
// The wave's one surviving `system.buildBoundary` moved one floor down, to
// the Pipe Chase's own `down` (`pipeChase.ts`, this task's own file) —
// §21.1's "the one-gate invariant holds; the gate moves one floor."

import type { ExitDefSlice, RoomDefSlice } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { LISTEN, READ, SIT, SMELL, TOUCH } from '../act1/verbs';
import { ACT3_COOLING_PLANT, ACT3_DATA_HALL_A, ACT3_HATCH_OPEN, ACT3_PERIMETER_ROAD, ACT3_PIPE_CHASE, ACT3_RODE_FENCE } from './ids';
import { HATCH_DOWN_TEXT, YARD_DOOR_OUT_TEXT } from './objects/coolingPlant';

// ---------------------------------------------------------------------------
// §10.1 — description.
// ---------------------------------------------------------------------------

const firstSightHallDoor =
  'Through the plant door and down four steps into a room that is entirely pipe.\n\nIt is hot in here, after the hall, and it is loud in another key: pumps at the far end on their inertia bases, and water going through everything, which you feel in the floor a moment before you hear it.\n\nTwo chillers the size of buses down the left, in grey, with their access panels on and their gauges reading. Above them, on the wall, the manifolds: a rank of headers on saddles with the flow and the return of the entire building gathered into them and sorted out again, every branch tagged, every collar painted.\n\nThere is a framed drawing on the wall by the door with the whole arrangement on it. There is a hatch in the floor at the back under a bolted plate. There is a lift door in the far wall, and beside the lift door a steel door out to the yard.';

// Rule 2 (§10.1) — first sight by the yard door (route (c)'s arrival). Kept
// as its own rule, checked BEFORE the generic first-sight rule below (both
// conditions can hold together on a first visit via the fence), so the
// fence-arrival variant wins when it applies rather than array order
// silently deciding it — this task's own implementation choice, since the
// doc's own "Rule 1"/"Rule 2" numbering reads as sequential without saying
// so explicitly.
const firstSightYardDoor =
  'The yard door lets you into heat, and noise, and a room that is entirely pipe.\n\nBehind you the door shuts itself on its closer and the outside stops existing. Nobody has followed you across the apron. Nobody, as far as this room is concerned, has come in at all.\n\nTwo chillers down the left. The manifolds above them on the wall, tagged and painted. A framed drawing by the far door. A hatch in the floor at the back under a bolted plate, and a lift door beside you.';

const returnVisit =
  'Pipe, heat, and the pumps at the far end. The manifolds on the wall with their tags hanging off the valve handles.\n\nThe drawing by the hall door, the hatch at the back, the lift, and the yard door.';

const description: ProseRule[] = [
  { when: { all: [{ not: { visited: ACT3_COOLING_PLANT } }, { flag: ACT3_RODE_FENCE }] }, text: firstSightYardDoor },
  { when: { not: { visited: ACT3_COOLING_PLANT } }, text: firstSightHallDoor },
  { text: returnVisit },
];

// ---------------------------------------------------------------------------
// §10.9 — room-level senses and responses.
// ---------------------------------------------------------------------------

const listenText =
  'The pumps, at the far end, on their bases, all four of them running.\n\nAnd the water, everywhere, in everything, which you get in the soles of your feet as much as anywhere: a very large quantity of it going round a circuit and coming back to be sent round again.';

const smellText =
  'Hot metal, warm paint, and glycol, which smells faintly sweet and faintly wrong and is the smell of every plant room in the world.\n\nAt the back, where the hatch is, there is wet concrete under it.';

// ---------------------------------------------------------------------------
// D4 §12.3/§21.1/§21.4 — the hatch's `down` exit, gated on `act3_hatch_open`,
// now a real exit to the Pipe Chase (10 minutes). Bare "down" (no dobj) is
// this exit's job; "ENTER HATCH" (dobj = hatch) is the hatch object's own
// handler (`objects/coolingPlant.ts`'s own D4 amendment, this task's).
// ---------------------------------------------------------------------------

const hatchDownExit: ExitDefSlice = {
  dir: 'down',
  to: ACT3_PIPE_CHASE,
  when: { flag: ACT3_HATCH_OPEN },
  travelText: HATCH_DOWN_TEXT,
  minutes: 10,
};

export const coolingPlantRoom: RoomDefSlice = {
  name: 'Cooling Plant',
  aliases: ['plant', 'cooling plant'],
  description,
  exits: [
    // Plan §21.4's own north/south pairing with Data Hall A's own `north` →
    // plant exit (`objects/dataHallA.ts`, task B) — this task's own reading
    // of the ruling's "w/back → Data Hall A," reconciled toward the
    // direction Data Hall A's own exit actually reciprocates. Flagged in
    // this task's report.
    { dir: 's', to: ACT3_DATA_HALL_A, travelText: 'Back through the plant door and up the four steps.' },
    { dir: 'out', to: ACT3_PERIMETER_ROAD, travelText: YARD_DOOR_OUT_TEXT },
    hatchDownExit,
    // The lift is reached by naming it (`CALL ELEVATOR`, `ENTER LIFT`), not
    // by a direction — see `elevator.ts`'s own header.
  ],
  handlers: [
    { verbs: [LISTEN], when: { at: ACT3_COOLING_PLANT }, effects: [{ say: listenText }] },
    { verbs: [SMELL], when: { at: ACT3_COOLING_PLANT }, effects: [{ say: smellText }] },
  ],
};

// Re-exported for `index.ts`'s own wiring and for the `§21.4` exit note above.
export { TOUCH, READ, SIT };

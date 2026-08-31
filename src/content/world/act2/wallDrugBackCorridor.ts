// Wall Drug — the Back Corridor (D1 prose doc §10). Prose transcribed
// verbatim (hard rule 5). One AND THEN step from the Emporium (§1's own
// beat-test note) — no travel beat carries this doorway.

import type { ExitDefSlice, HandlerDef, RoomDefSlice } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { LISTEN, SMELL } from '../act1/verbs';
import { V_LOOK_UP } from '../act1/ids';
import { ACT2_VISITED_CORRIDOR, ACT2_WALL_DRUG_BACK_CORRIDOR, ACT2_WALL_DRUG_EMPORIUM } from './ids';

// ---------------------------------------------------------------------------
// §10.1 — description (2 rules)
// ---------------------------------------------------------------------------

const FIRST_SIGHT =
  'The corridor is about the width of a wheelbarrow and about as long as a bowling alley, and it was not built. It accumulated: the near end is plastered, the middle is board, and the far end is the outside wall of something the building later went round.\n\nShelving both sides, floor to ceiling, made in place by four different people over a long stretch of time, and every foot of it full.\n\nBoxes. Everything on these shelves is a box or was one — shoe boxes, shirt boxes, a hat box, a wooden crate with a rope handle, a thing that was a suitcase before it stopped being able to be one. Each has a paper tag on a string with a number on it. The numbers are not in any order that survives two shelves of looking.\n\nAlong the top of each bay, stencilled, there is a letter, and the stencils have been painted over at least twice.\n\nAt the far end, on a desk that used to be a door, there is a terminal. The bulb hangs on a cord above the middle of all this and lights about eleven feet of it well and the rest of it approximately.';

const RETURN_VISIT =
  'Shelving, boxes, tags, and the bays lettered along the top. The bulb on its cord. The terminal at the far end on its door.\n\nThe store is back the way you came, and it is still open, because it is always open.';

const description: ProseRule[] = [
  { when: { not: { flag: ACT2_VISITED_CORRIDOR } }, text: FIRST_SIGHT },
  { text: RETURN_VISIT },
];

// ---------------------------------------------------------------------------
// §10.2 — room-level senses
// ---------------------------------------------------------------------------

const smell = 'Cardboard, dust, and old sugar — a great deal of what is stored back here was sweets at some point, and some of it may still be.';

const listen =
  'Through two walls, at its interval, the dinosaur. Nearer than that, nothing at all: this corridor is packed floor to ceiling with paper and it has no echo in it whatsoever.';

const lookUp = 'The bulb, the cord, and a run of conduit that goes the length of the ceiling and ends, neatly, in a blank plate over nothing.';

const roomHandlers: HandlerDef[] = [
  { verbs: [SMELL], effects: [{ say: smell }] },
  { verbs: [LISTEN], effects: [{ say: listen }] },
  { verbs: [V_LOOK_UP], effects: [{ say: lookUp }] },
];

const onEnter: RoomDefSlice['onEnter'] = [{ effects: [{ set: [ACT2_VISITED_CORRIDOR, true] }] }];

const travelTextToEmporium = 'Back past the shelving, the terminal receding behind you, and out through the doorway that has no door.';

// "back" is a word of the `in` direction verb (act1/verbs.ts) — declaring
// `dir: 'in'` here (rather than a fourth compass entry) is what makes
// "back" resolve to the Emporium, per this room's own §10 exits table
// ("s"/"out"/"back").
const exits: ExitDefSlice[] = [
  { dir: 's', to: ACT2_WALL_DRUG_EMPORIUM, travelText: travelTextToEmporium },
  { dir: 'out', to: ACT2_WALL_DRUG_EMPORIUM, travelText: travelTextToEmporium },
  { dir: 'in', to: ACT2_WALL_DRUG_EMPORIUM, travelText: travelTextToEmporium },
];

export const wallDrugBackCorridorRoom: RoomDefSlice = {
  name: 'Back Corridor',
  area: 'act2',
  map: { x: 1, y: 5 },
  description,
  onEnter,
  exits,
  handlers: roomHandlers,
};

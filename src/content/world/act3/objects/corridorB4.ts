// Act III, Stage D3 task C — Corridor B4's six objects (D3 prose doc §11):
// the life-safety plan, the corridor itself (PACE, the P route), reader B4
// (intermittent by rotation, not chance), the panel and its stencil
// (§11.7, L9 — counted as one "object" per the plan's tier table, a parent
// plus one sub-part), and the far door (`../elevator.ts`'s B4 instance —
// not built here, §21.2's own collision ruling: "FAR DOOR in B4 must
// resolve to the lift").

import type { Effect } from '../../../../engine/effects';
import type { ObjectDefSlice } from '../../../../engine/world';
import { USE_VERB_ID } from '../../../../engine/move';
import { EXAMINE, LOOK_BEHIND, OPEN, READ, REMOVE, SHOW, TAKE, TOUCH } from '../../act1/verbs';
import { STRING_ITEM, V_MEASURE } from '../../act1/ids';
import { ACT2_NOLAN_BADGE, ACT2_ORIGAMI_RULER, ACT2_NOTEBOOK, V_FIT } from '../../act2/ids';
import { nolanBadge } from '../../act2/nolan';
import {
  ACT3_B4_MEASURED,
  ACT3_B4_PASSES,
  ACT3_CLUE_41_FEET,
  ACT3_CLUE_NOV_1983,
  ACT3_CORRIDOR,
  ACT3_CORRIDOR_B4,
  ACT3_LIFE_SAFETY_PLAN,
  ACT3_PANEL,
  ACT3_PANEL_OPEN,
  ACT3_READER_B4,
  ACT3_STENCIL_1983,
  V_PACE,
  V_UNBOLT,
} from '../ids';
import { ACT3_READER_B4_SCRIPT } from '../scripts';

// ---------------------------------------------------------------------------
// §11.2 — the life-safety plan.
// ---------------------------------------------------------------------------

const planExamine =
  "Behind glass in the same frame stock as the drawing in the plant: a floor plan of this part of the building with a red YOU ARE HERE dot, the exits picked out in green, the extinguishers as little numbered squares, and a scale bar along the bottom.\n\nThis corridor is drawn as a long rectangle, and because a life-safety drawing has to tell a fire crew how far it is to a door, the rectangle is dimensioned:\n\n    180'-0\"\n\nThe frame is screwed to the wall through four brass cups. The glass has been cleaned, recently, in circles.";

const planOpenText =
  'Four screws, four brass cups, and a sheet of glass you would then be holding in a corridor. The drawing is more use to you where it is: on the wall, at one end of the thing it is a drawing of.';

const compareNotebookText =
  'The notebook says what it has said since Wall Drug, in a hand going faster than it can and staying legible.\n\nThe drawing says a hundred and eighty feet, in a title block, over a scale bar, screwed to a wall through brass cups.\n\nOne of them is wrong and neither of them is going to move.';

const lifeSafetyPlan: ObjectDefSlice = {
  location: ACT3_CORRIDOR_B4,
  name: 'life-safety plan',
  nouns: ['plan', 'life safety plan', 'drawing', 'framed plan', 'fire plan', 'map', 'scale', 'scale bar', 'glass', 'frame'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: planExamine }] },
    { verbs: [OPEN, TAKE], effects: [{ say: planOpenText }] },
    { verbs: [V_FIT], withInstrument: [ACT2_NOTEBOOK], when: { has: ACT2_NOTEBOOK }, effects: [{ say: compareNotebookText }] },
  ],
};

// ---------------------------------------------------------------------------
// §11.3 — the corridor, PACE (the P route), plus §11.4/§11.5's string/ruler
// routes (K/C).
// ---------------------------------------------------------------------------

const corridorExamine =
  'One-foot tiles in a running bond, with the joints running across your way, and the seams of the sheet vinyl in the same direction, and a skirting coved up the block so the floor cleaner does not have to think about corners.\n\nA corridor tiled like this is a ruler that somebody has already put down.';

const paceFirstText =
  'You start with your back against the wall the plan is on, and you walk it heel to toe on the joints. One tile, one step, the way you would if you had ever had a reason to.\n\nTile. Tile. Tile.\n\nThe boxes go over you one after another and their note changes as you come under each one and changes back. Tile. Tile. Tile. The far door does not get any nearer for a very long time, and then it is right in front of you.\n\nTwo hundred and twenty-one.\n\nYou stand at the far end with the number in your mouth and no confidence in it at all, because a man who has counted to two hundred and twenty-one on his own feet has lost it somewhere.';

const paceSecondText =
  'So you do it again, the other way, from the far door back to the plan, slower, counting in tens on the fingers of one hand and starting that hand again at every hundred.\n\nTile. Tile. Tile.\n\nTwo hundred and twenty-one.\n\nThe drawing on the wall says a hundred and eighty feet. The drawing on the wall is the drawing they would send a fire crew into this corridor with. And you have now walked two hundred and twenty-one one-foot tiles between its two ends, twice, in both directions, in a building where every other thing you have touched today has been exactly what it said it was.';

const paceThereafterText = 'Two hundred and twenty-one. It is going to be two hundred and twenty-one.';

/** Shared by every route that lands on R8's clue (pace's second pass, the string, the ruler) — granted once each, `grantClue`/`set` are idempotent under a repeat call. */
const measuredEffects: Effect[] = [{ set: [ACT3_B4_MEASURED, true] }, { grantClue: ACT3_CLUE_41_FEET }];

const stringMeasureText =
  "The twine off the general store's spool is longer than you thought and a good deal shorter than the corridor.\n\nYou lay it out along a joint line from the wall the plan is on, put your heel on the end of it, and lay it again from there, and again, and pinch the third run where it stops short. Three runs and a bit.\n\nThen you take it up off the floor and hold it against the scale bar under the glass, and walk it along the bar, and count what the bar gives you for each run.\n\nThree runs and a bit is not a hundred and eighty feet. It is not near a hundred and eighty feet.";

const rulerMeasureText =
  "Eli's letter, folded the way Eli folds, opens out into a strip creased at intervals that are exactly each other, which is the only thing origami has ever actually been for.\n\nYou use it on the scale bar first, to find out what one crease is worth on this drawing. Then you use it on the floor, where the creases and the tile joints agree with each other about a foot, because a foot is a foot and has been for some time.\n\nThen you do the sum a man does standing up at the end of a corridor.\n\nThe answer is not a hundred and eighty.";

const corridor: ObjectDefSlice = {
  location: ACT3_CORRIDOR_B4,
  name: 'corridor',
  nouns: ['corridor', 'hall', 'hallway', 'floor', 'tiles', 'tile', 'joints', 'length', 'b4'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: corridorExamine }] },
    // §11.3 — bare PACE/WALK IT OFF/COUNT TILES, and bare MEASURE CORRIDOR
    // ("pace" and "measure" are two different verb ids — `V_PACE`, this
    // file's own new verb, and the shipped `V_MEASURE`, act1/verbs.ts,
    // amended in place by `act3/verbs.ts` — both listed on every rule below
    // so either wording reaches the same text). No instrument, per §21.2:
    // "MEASURE with an instrument in hand must prefer §11.4/§11.5 over
    // §11.3" — the string/ruler handlers below are listed first, so
    // `withInstrument` gates them out of this bare match.
    {
      verbs: [V_PACE, V_MEASURE],
      withInstrument: 'none',
      when: { flag: ACT3_B4_MEASURED },
      effects: [{ say: paceThereafterText }],
    },
    {
      verbs: [V_PACE, V_MEASURE],
      withInstrument: 'none',
      when: { flag: ACT3_B4_PASSES, atLeast: 1 },
      effects: [{ say: paceSecondText }, ...measuredEffects],
    },
    {
      verbs: [V_PACE, V_MEASURE],
      withInstrument: 'none',
      effects: [{ say: paceFirstText }, { inc: ACT3_B4_PASSES }],
    },
    { verbs: [V_PACE, V_MEASURE], withInstrument: [STRING_ITEM], effects: [{ say: stringMeasureText }, ...measuredEffects] },
    { verbs: [V_PACE, V_MEASURE], withInstrument: [ACT2_ORIGAMI_RULER], effects: [{ say: rulerMeasureText }, ...measuredEffects] },
  ],
};

// ---------------------------------------------------------------------------
// §11.6 — reader B4, intermittent by rotation.
// ---------------------------------------------------------------------------

const readerExamine =
  'The same pedestal, the same black pad, the same green diode, mounted beside the far door at exactly the height a badge hangs on a lanyard.\n\nThere is a smear on the pad about the size of a thumb, and under the smear the plastic has gone matt, and it has gone matt in two separate places, because people who are not let in the first time try again slightly differently.';

const readerNoBadgeText = 'The pad wants a badge. You have hands, a hat, and a notebook belonging to a man this reader has almost certainly let through several hundred times.';
const readerKickText = 'It is a pedestal bolted to a slab. Your foot learns this immediately and you learn it about a second later, and the diode does not so much as flicker, which is somehow the insulting part.';

const readerB4: ObjectDefSlice = {
  location: ACT3_CORRIDOR_B4,
  name: 'reader',
  nouns: ['reader', 'badge reader', 'b4 reader', 'pad', 'scanner', 'diode', 'door'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: readerExamine }] },
    { verbs: [OPEN], effects: [{ say: readerKickText }] },
    // "USE BADGE" with no badge held, standing at reader B4 — dobj resolves
    // to the reader itself (there is no badge to resolve `USE BADGE`'s own
    // dobj against), so this is wired here rather than on the badge object.
    { verbs: [USE_VERB_ID], when: { not: { has: ACT2_NOLAN_BADGE } }, effects: [{ say: readerNoBadgeText }] },
  ],
};

// "USE BADGE"/"SHOW BADGE TO READER" (§11.6, §21.2's own collision note:
// "badge held resolves to the object; SHOW BADGE TO READER / USE BADGE are
// the handlers") resolve dobj = the badge, an `act2/nolan.ts` object this
// task does not otherwise own. Mutated in place here — act3 already depends
// on act2 one-way (never the reverse, `game.ts`'s own header), the same
// idiom `act3/verbs.ts` uses to extend the shipped `V_MEASURE`/`V_CALL` —
// rather than editing that shared file directly, which risks colliding with
// task A's/B's own gate/lobby/plant-door readers on the same object.
// Flagged in this task's report as outside its named module list.
nolanBadge.handlers = [
  ...(nolanBadge.handlers ?? []),
  { verbs: [USE_VERB_ID], when: { at: ACT3_CORRIDOR_B4 }, effects: [{ script: { id: ACT3_READER_B4_SCRIPT } }] },
  { verbs: [SHOW], withInstrument: [ACT3_READER_B4], when: { at: ACT3_CORRIDOR_B4 }, effects: [{ script: { id: ACT3_READER_B4_SCRIPT } }] },
];

// ---------------------------------------------------------------------------
// §11.7 — the panel and the stencil (L9).
// ---------------------------------------------------------------------------

const panelExamine =
  'Two feet by three, in the same block wall, in the same paint, with four countersunk screws in it and a hairline of shadow all round.\n\nIt is an access panel. There is a chase behind every corridor in every building of this kind and somebody has to be able to get at it.\n\nThe paint around it has been cut through with a blade so that the panel comes off cleanly, which is a thing you do to a panel that comes off often.';

const panelRemoveText =
  'The screws come out with the edge of a coin. The panel comes away in one piece.\n\nBehind it: conduit, a junction box with its lid on, a bundle of low-voltage in a cable tie, and block wall.\n\nOn the block wall, in white stencil, six inches high, put there before anything was ever screwed over it:\n\n    INSPECTED\n    NOV 1983\n\nThe panel goes back on the way it came off.';

// §11.7: the stencil is "visible when act3_panel_open" — it starts hidden,
// so the flag alone is not enough (v0.13.0 playtest: `x stencil` missed).
const panelRemoveEffects: Effect[] = [{ say: panelRemoveText }, { set: [ACT3_PANEL_OPEN, true] }, { reveal: ACT3_STENCIL_1983 }, { grantClue: ACT3_CLUE_NOV_1983 }];

const panel: ObjectDefSlice = {
  location: ACT3_CORRIDOR_B4,
  // "access" adjective per this task's §21.2 collision note (the elevator's
  // panel takes "button"; the drawing's own title block is never called
  // "panel").
  name: 'access panel',
  nouns: ['panel', 'access panel', 'cover', 'plate', 'screws', 'wall panel'],
  // §21.2: "give the wall panel access/wall" — distinguishes it from the
  // elevator's own panel (`elevator.ts`, adjective "button"), which shares
  // the room once the door/panel/blank/buttons chain is in scope.
  adjectives: ['access', 'wall'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: panelExamine }] },
    // §11.7 authors "remove panel / unscrew panel / look behind panel / open
    // panel" — REMOVE is otherwise the clothing verb ("You are not wearing
    // the access panel", v0.13.0 playtest), so it is claimed here explicitly.
    { verbs: [OPEN, TAKE, REMOVE, LOOK_BEHIND, V_UNBOLT], effects: panelRemoveEffects },
  ],
};

const stencilExamine =
  'Stencilled, not printed: the letters have the little bridges in them where the stencil held. White on grey block, thin enough that the block\'s texture comes through the paint.\n\nBuildings of this kind are marked like this all over — in every chase, behind every panel, by whoever signed the work off. It is the most ordinary mark a wall can carry.';

const stencilTouchText = 'Under the paint the block is block. Nothing comes off on your fingers.';

const stencil: ObjectDefSlice = {
  location: { on: ACT3_PANEL },
  name: 'stencil',
  nouns: ['stencil', 'stencilling', 'lettering', 'inspected', 'mark', '1983', 'date'],
  hidden: true,
  handlers: [
    { verbs: [EXAMINE, READ], effects: [{ say: stencilExamine }] },
    { verbs: [TOUCH], effects: [{ say: stencilTouchText }] },
  ],
};

export const ACT3_CORRIDOR_B4_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT3_LIFE_SAFETY_PLAN]: lifeSafetyPlan,
  [ACT3_CORRIDOR]: corridor,
  [ACT3_READER_B4]: readerB4,
  [ACT3_PANEL]: panel,
  [ACT3_STENCIL_1983]: stencil,
};

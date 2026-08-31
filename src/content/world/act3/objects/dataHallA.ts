// Act III, Stage D3, task B — Data Hall A's five objects
// (`docs/superpowers/specs/2026-09-11-stage-d3-prose.md` §9). Prose
// transcribed verbatim (hard rule 5).
//
// THE NOISE'S `LISTEN` (§9.3) — three rules, shared verbatim between this
// object's own handlers and the room's own bare-`LISTEN` handlers
// (`act3/dataHallA.ts`), since a player who types bare "listen" with
// nothing named and a player who types "listen to noise" must hear the
// same thing. `LISTEN` ships (act1/verbs.ts) with both `'V'` and `'V
// dobj'` patterns, so both paths are real; `noiseListenHandlers` (exported)
// is the single source both sides spread in, rather than two copies.
//
// THE PLANT DOOR (§9.5) — "passes anyone" (ruling 3): `container: { open:
// true }` permanently, no gate. `USE READER`/`OPEN PLANT DOOR` both `say`
// the pass text and `goto` the Cooling Plant directly; the room's own `e`
// exit (`act3/dataHallA.ts`) declares the same object as its `door` and
// carries the same text as `travelText`, so plain "E"/"GO EAST" reads the
// same as naming the door.

import type { HandlerDef, ObjectDefSlice } from '../../../../engine/world';
import { BREAK, EXAMINE, LISTEN, OPEN, READ, TOUCH, TURN_OFF } from '../../act1/verbs';
import { DIRECTION_VERB_IDS, USE_VERB_ID } from '../../../../engine/move';
import { V_COUNT, V_UNPLUG } from '../../act1/ids';
import { ACT3_AISLE_SIGN, ACT3_CLUE_PULSE, ACT3_COLD_AISLE_CURTAIN, ACT3_COOLING_PLANT, ACT3_DATA_HALL_A, ACT3_NOISE, ACT3_PLANT_DOOR, ACT3_RACKS } from '../ids';

// ---------------------------------------------------------------------------
// §9.2 — the racks
// ---------------------------------------------------------------------------

const racksExamine =
  'Black steel, forty-eight units high, every one of them filled and every gap in every one of them closed off with a blanking plate, because air that goes the wrong way round is air you have paid to move twice.\n\nBehind the perforated fronts there are the small green and amber lights of a very great deal of equipment agreeing with itself. The cabling comes down out of the trays in bundles combed flat and dressed square and tied at intervals, and somebody did that by hand, and has done it by hand every time anything has changed.\n\nOn the end of the row there is a laminated card with the row number on it and a telephone extension underneath, and the extension has been crossed out and rewritten twice, in two hands.';

const racksOpen =
  'The doors are latched and not locked, because a lock on this door would only be a thing to lose the key to.\n\nYou get one open and a wedge of hot air comes out of it into a room that has been designed at some expense against exactly that, and within about four seconds something in the ceiling changes note and begins to deal with you.\n\nYou shut it.';

const racksTouch =
  'Cold at the front, where the air is going in. Warm at the back, where it has finished. That is the entire business of this building written on one box in a temperature you can feel with a hand, and there are several thousand boxes.';

const racksReadCard = '    ROW A-12\n    x2240 (24hr)\n\nThe number has been crossed out and rewritten twice. The last hand is the hand that writes the tags in the plant.';

const racksLeaveAlone =
  'There is nothing here that you have any argument with. There is not even anything here you could be said to have found: it is a room of boxes doing arithmetic for somebody, which is what these buildings are for and what this one has always said it was.\n\nYou leave it alone, and you notice yourself deciding to.';

export const COUNT_RACKS_TEXT =
  'You get to a number you are not confident about and then the perspective takes the rest of them, and it becomes obvious that this is the sort of thing a building tells you in a filing rather than a thing you find out by looking.';

const racks: ObjectDefSlice = {
  location: ACT3_DATA_HALL_A,
  name: 'racks',
  nouns: ['rack', 'racks', 'cabinet', 'cabinets', 'machines', 'servers', 'equipment', 'row', 'rows', 'aisle', 'aisles', 'cable', 'cables', 'tray', 'busbar'],
  portable: false,
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: racksExamine }] },
    { verbs: [OPEN], effects: [{ say: racksOpen }] },
    { verbs: [TOUCH], effects: [{ say: racksTouch }] },
    { verbs: [READ], effects: [{ say: racksReadCard }] },
    { verbs: [V_UNPLUG, TURN_OFF, BREAK], effects: [{ say: racksLeaveAlone }] },
    // §9.7's "COUNT RACKS"/"COUNT ROWS" — filed under the doc's own
    // "room-specific responses", but `V_COUNT` (`'V dobj'`) always resolves
    // a dobj to an object, and "racks"/"rows" are this object's own nouns,
    // so the refusal is wired here rather than as a room-level handler
    // (which `RoodDefSlice.handlers` only ever reaches for a verb with NO
    // resolved dobj at all).
    { verbs: [V_COUNT], effects: [{ say: COUNT_RACKS_TEXT }] },
  ],
};

// ---------------------------------------------------------------------------
// §9.3 — the noise
// ---------------------------------------------------------------------------

const noiseRule1Text =
  'You stand still and give it a minute, which is what it takes.\n\nThere is a slow variation in it. Not a beat — nothing as regular as that — but the broad flat noise comes up a little and settles a little on something longer than your own breathing, over and over, and once you have heard it you are not going to be able to stop.';

const noiseRule2Text =
  'You stand still and give it a minute, which is what it takes.\n\nThere is a slow variation in it, and it is slower than that. The broad flat noise comes up, and settles, and the settling goes on long enough that you find yourself waiting through it with your head turned.\n\nThen it comes up again.';

const noiseRule3Text =
  'It is not a hum and it is not a roar. It is what a very large volume of moving air does when it has been made to do it politely: broad, flat, everywhere, and with no direction in it at all.\n\nAnd the slow thing, underneath, going up and settling.';

/** Shared between the object's own `LISTEN` and Data Hall A's own bare-`LISTEN` room handler — see this file's header. */
export const noiseListenHandlers: HandlerDef[] = [
  { verbs: [LISTEN], when: { all: [{ not: { clue: ACT3_CLUE_PULSE } }, { not: { clockPhase: 'night' } }] }, effects: [{ say: noiseRule1Text }, { grantClue: ACT3_CLUE_PULSE }] },
  { verbs: [LISTEN], when: { clockPhase: 'night' }, effects: [{ say: noiseRule2Text }, { grantClue: ACT3_CLUE_PULSE }] },
  { verbs: [LISTEN], effects: [{ say: noiseRule3Text }] },
];

const noise: ObjectDefSlice = {
  location: ACT3_DATA_HALL_A,
  name: 'noise',
  nouns: ['noise', 'sound', 'hum', 'roar', 'air', 'whitenoise', 'white noise', 'ventilation', 'fans'],
  portable: false,
  handlers: [{ verbs: [EXAMINE], effects: [{ say: noiseRule3Text }] }, ...noiseListenHandlers],
};

// ---------------------------------------------------------------------------
// §9.4 — the signpost
// ---------------------------------------------------------------------------

const signExamine =
  'A post at the aisle head with three vanes screwed to it in the order somebody needed them:\n\n    ← LOBBY B4 → PLANT →\n\nThe LOBBY vane and the PLANT vane are the same white and the same age. The B4 vane is a slightly different white, and its screws are a different white again.';

const aisleSign: ObjectDefSlice = {
  location: ACT3_DATA_HALL_A,
  name: 'signpost',
  nouns: ['sign', 'signpost', 'vanes', 'vane', 'aisle sign', 'arrow', 'arrows', 'b4', 'wayfinding'],
  portable: false,
  handlers: [{ verbs: [EXAMINE], effects: [{ say: signExamine }] }],
};

// ---------------------------------------------------------------------------
// §9.5 — the plant door
// ---------------------------------------------------------------------------

const plantDoorExamine =
  'Steel, with an overhead closer, a reader beside it on the wall rather than a pedestal, and PLANT in the same stencil as everything else.\n\nIt is the same model of reader as the one on the gate, which is the same model as the one at the far end of B4, which is the one the notebook has a complaint about.';

export const PLANT_DOOR_PASS_TEXT =
  'Green, first ask, without the badge and without anything else, because it is not that kind of reader.\n\nInside the fence this building has almost no opinions about where you go in it. Everything it had to say, it said at the gate.';

const plantDoor: ObjectDefSlice = {
  location: ACT3_DATA_HALL_A,
  name: 'plant door',
  nouns: ['plant door', 'door', 'steel door', 'reader', 'badge reader', 'plant'],
  portable: false,
  container: { open: true },
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: plantDoorExamine }] },
    { verbs: [OPEN, USE_VERB_ID, DIRECTION_VERB_IDS.in], effects: [{ say: PLANT_DOOR_PASS_TEXT }, { goto: ACT3_COOLING_PLANT }] },
  ],
};

// ---------------------------------------------------------------------------
// §9.6 — the curtain
// ---------------------------------------------------------------------------

const curtainExamine =
  'Heavy clear PVC in overlapping strips, hung from a rail across the mouth of the aisle and reaching down to about shoulder height.\n\nThey keep the cold in the aisle and the hot out of it, which is the whole of the idea, and they have gone slightly milky along the edges where several years of shoulders have gone through them.';

const curtainThrough =
  'Going through them is like going through the door of a butcher\'s, and on the other side of them the cold gets serious and the note of the room goes up.\n\nThe aisle is four feet wide and it is racks on both sides and nothing else, all the way down, and there is a floor grille every third rack blowing cold straight up your trouser leg.';

const curtain: ObjectDefSlice = {
  location: ACT3_DATA_HALL_A,
  name: 'curtain',
  // "aisle" added beyond the doc's own noun list (§9.6 gives "curtain,
  // curtains, strips, strip curtain, pvc, plastic, aisle curtain,
  // containment") so "ENTER AISLE" (§9.6's own invocation) has a noun to
  // resolve against — flagged in this task's report as an assumption.
  nouns: ['curtain', 'curtains', 'strips', 'strip curtain', 'pvc', 'plastic', 'aisle curtain', 'containment', 'aisle'],
  portable: false,
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: curtainExamine }] },
    { verbs: [OPEN, DIRECTION_VERB_IDS.in], effects: [{ say: curtainThrough }] },
  ],
};

export const ACT3_DATA_HALL_A_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT3_RACKS]: racks,
  [ACT3_NOISE]: noise,
  [ACT3_AISLE_SIGN]: aisleSign,
  [ACT3_PLANT_DOOR]: plantDoor,
  [ACT3_COLD_AISLE_CURTAIN]: curtain,
};

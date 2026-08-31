// Wall Drug — the Back Corridor's six objects (D1 prose doc §11): the
// shelving (+ its stencils sub-part), the cache box, the stacked boxes, the
// terminal, and the bulb. Prose transcribed verbatim (hard rule 5).
//
// §27 wiring item 1 — `act2_stacked_boxes` must not claim bare "box" (only
// "boxes"): the cache box, once found, is the room's own bare "box".

import type { Effect } from '../../../../engine/effects';
import type { ObjectDefSlice } from '../../../../engine/world';
import { CLAIM_TICKET } from '../../act1/ids';
import { EXAMINE, OPEN, PULL, PUSH, READ, SEARCH, TURN_OFF, TURN_ON } from '../../act1/verbs';
import {
  ACT2_CACHE_BOX,
  ACT2_CACHE_FOUND,
  ACT2_CACHE_POLAROID,
  ACT2_CLAIM_SHELVING,
  ACT2_CLUE_CACHE_CONTENTS,
  ACT2_CORRIDOR_BULB,
  ACT2_FILM_CANISTER,
  ACT2_NOTEBOOK,
  ACT2_PENCIL,
  ACT2_READ_NUMBERING_KEY,
  ACT2_RETURNED_LETTER,
  ACT2_SHELVING_STENCILS,
  ACT2_STACKED_BOXES,
  ACT2_USB,
  ACT2_WALL_DRUG_BACK_CORRIDOR,
  ACT2_WD_TERMINAL,
} from '../ids';

// ---------------------------------------------------------------------------
// §11.1-11.2 — the shelving, its stencils, and `SEARCH SHELVING` (the E/K
// route into P10, plus the always-unattended night route — "the same
// handler," §11.2's own note, so no clock gate at all).
// ---------------------------------------------------------------------------

const shelvingExamine =
  'Softwood, unplaned, on uprights that are in some places uprights and in one place a length of pipe. The lowest shelf has been cut away in the middle of the run to get round a floor that rises there.\n\nEvery box has a tag and every tag has a number, and holding the ticket in one hand while looking at them is like being handed one word of a language.';

const searchFoundText =
  'Four thousands is E, and E is two bays down on the left, third shelf, once you have got your head at the angle the bulb wants.\n\nThe tags in that bay run in no order at all and there are about sixty of them, so you do it the only way it can be done, which is one at a time, out loud, with a thumb.\n\nThen here is a shoe box with a paper tag on a string, and the number on the tag is the number on your card, and there is a great deal of dust on the lid and none at all on the string.';

const searchNoKeyText =
  'You have a number and there are perhaps two thousand numbers back here in no order, and the letters along the top of the bays plainly mean something to somebody.\n\nYou could do this shelf by shelf, all night, and you might. Or you could find out what the letters are for.';

const searchNoTicketText = 'Boxes with numbers on. Sixty to a bay, twenty bays, and not one of them is yours, because you have not got a number.';

const shelving: ObjectDefSlice = {
  location: ACT2_WALL_DRUG_BACK_CORRIDOR,
  name: 'shelving',
  nouns: ['shelving', 'shelves', 'shelf', 'bay', 'bays', 'rack', 'racks', 'tags', 'tag', 'numbers'],
  portable: false,
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: shelvingExamine }] },
    {
      verbs: [SEARCH],
      when: { all: [{ has: CLAIM_TICKET }, { flag: ACT2_READ_NUMBERING_KEY }] },
      effects: [{ say: searchFoundText }, { set: [ACT2_CACHE_FOUND, true] }, { reveal: ACT2_CACHE_BOX }],
    },
    { verbs: [SEARCH], when: { has: CLAIM_TICKET }, effects: [{ say: searchNoKeyText }] },
    { verbs: [SEARCH], effects: [{ say: searchNoTicketText }] },
  ],
};

const stencilsExamine =
  'Six inches high, stencilled at the top of each bay, and painted over twice by people who did not consider that anybody would need them again.\n\nWhere the paint has chipped you get part of a letter. Where it has not, you get the ghost of one under the surface, which is worse and also readable if you put your head at the angle the bulb wants.';

const shelvingStencils: ObjectDefSlice = {
  location: { on: ACT2_CLAIM_SHELVING },
  name: 'stencils',
  nouns: ['stencils', 'letters'],
  portable: false,
  handlers: [{ verbs: [EXAMINE, READ], effects: [{ say: stencilsExamine }] }],
};

// ---------------------------------------------------------------------------
// §11.3 — the cache box. `hidden: true` until found (shelving reveal, or
// Dot's `topic_ticket` reveal+relocate — `dot.ts`); `OPEN BOX` rule 1 (has
// the ticket) both opens it and moves its six contents in, so `TAKE ALL`/
// `TAKE NOTEBOOK` work without a second step (main-session ruling 3).
// ---------------------------------------------------------------------------

const cacheBoxExamine =
  'A shoe box, the kind that used to come with a shoe shop\'s name on it, and this one still does, faintly, under the dust. The lid is on. The tag is on a string through a hole punched in the end.\n\nIt weighs about what a shoe box weighs, which tells you either that it is nearly empty or that whatever is in it is paper.';

const openBoxFoundText =
  'The lid comes off in a way that lids only do when they have not been off for a long time — all at once, with the whole box coming with it, and then not.\n\nThere is no note on top. That is the first thing, and it goes on being the first thing for some while.\n\nA hard-backed notebook, the size of a hand, with a perished rubber band round it and a pencil under the band.\n\nA memory stick in a small plastic bag, folded over twice.\n\nA film canister, the grey kind with a grey lid, taped shut.\n\nA Polaroid, face down.\n\nAnd an envelope, stamped and addressed and sealed, with a machine\'s red mark across the front of it.';

const openBoxRefusalText =
  'It is a shoe box with a lid on it and no lock anywhere on it, and the number on the tag is not a number you can account for.\n\nYou could take the lid off. You have been in this county for three weeks because a man\'s brother is missing and nobody will say his name, and the way you have got as far as this corridor is by being the kind of person who does not take lids off other people\'s boxes at random.';

const CACHE_CONTENTS = [ACT2_NOTEBOOK, ACT2_USB, ACT2_FILM_CANISTER, ACT2_PENCIL, ACT2_RETURNED_LETTER, ACT2_CACHE_POLAROID] as const;

const openBoxEffects: Effect[] = [
  { say: openBoxFoundText },
  { set: [ACT2_CACHE_FOUND, true] },
  { grantClue: ACT2_CLUE_CACHE_CONTENTS },
  { setState: [ACT2_CACHE_BOX, 'open', true] },
  ...CACHE_CONTENTS.map((id): Effect => ({ move: [id, { in: ACT2_CACHE_BOX }] })),
];

const cacheBox: ObjectDefSlice = {
  location: ACT2_WALL_DRUG_BACK_CORRIDOR,
  name: 'shoe box',
  hidden: true,
  container: { open: false },
  nouns: ['box', 'shoe box', 'shoebox', 'carton', 'lid', 'cache', 'parcel', 'tag', 'string'],
  portable: false,
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: cacheBoxExamine }] },
    // Two ordinary handler entries, most specific (has the ticket) first —
    // the same "handler array as branch ladder" idiom the shelving's own
    // `SEARCH` uses above.
    { verbs: [OPEN], when: { has: CLAIM_TICKET }, effects: openBoxEffects },
    { verbs: [OPEN], effects: [{ say: openBoxRefusalText }] },
  ],
};

// ---------------------------------------------------------------------------
// §11.4 — the stacked boxes (not the cache box; bare "box" excluded).
// ---------------------------------------------------------------------------

const stackedBoxesExamine =
  'The other two thousand.\n\nA crate of ledgers from a shop that is not this shop. A hat box with a hat in it and a tag on it, unclaimed, and no way of knowing which of those two facts came first. Three cartons of unsold postcards of a view that has a road in it now.\n\nNobody is coming back for any of this and nobody has thrown any of it away, and between those two positions is a corridor.';

const stackedBoxes: ObjectDefSlice = {
  location: ACT2_WALL_DRUG_BACK_CORRIDOR,
  name: 'stacked boxes',
  article: 'the',
  nouns: ['boxes', 'other boxes', 'stack', 'stacked boxes', 'cartons', 'crate', 'suitcase', 'hat box'],
  portable: false,
  handlers: [{ verbs: [EXAMINE, SEARCH], effects: [{ say: stackedBoxesExamine }] }],
};

// ---------------------------------------------------------------------------
// §11.5 — the terminal (L3, station two — deliberately no callback to the
// opening room's own terminal). "plug in"/"follow cord" are not separately
// wired (no such verbs exist; `TURN_ON`/`PUSH` cover the given commands —
// flagged in this task's report).
// ---------------------------------------------------------------------------

const wdTerminalExamine =
  'The same machine. Not the same kind of machine — the same machine: beige gone the colour of weak tea, a screen with real depth to it, and the keys worn blank in exactly the places a person\'s fingers live.\n\nIt is sitting on a desk that used to be a door and still has the hinge screw holes in it.\n\nThe cord comes out of the back, runs along the skirting under two staples, and ends in a plug that fits nothing here.';

const wdTerminalTurnOnText =
  'Nothing. Not a click, not a tick from the tube, not the noise a screen makes before it has decided to be a screen.\n\nThe plug on the end of that cord has three flat pins in a triangle and there is nothing in this building it goes into. Somebody carried this in, put it on a door, ran the cord neatly along the skirting under two staples, and stopped.';

const wdTerminal: ObjectDefSlice = {
  location: ACT2_WALL_DRUG_BACK_CORRIDOR,
  name: 'terminal',
  nouns: ['terminal', 'computer', 'machine', 'screen', 'monitor', 'keyboard', 'keys', 'cable', 'plug', 'lead', 'desk', 'door'],
  portable: false,
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: wdTerminalExamine }] },
    { verbs: [TURN_ON, PUSH], effects: [{ say: wdTerminalTurnOnText }] },
  ],
};

// ---------------------------------------------------------------------------
// §11.6 — the bulb (the room's one gag; `PULL CORD` twice is the same
// response, no state toggle).
// ---------------------------------------------------------------------------

const bulbExamine =
  'A bulb in a porcelain fitting on a twisted cord, with a pull chain, hanging at about the height of the tallest person who has ever worked back here.\n\nThe chain has a length of string tied to it so that it can be reached by everybody else.';

const bulbPullText =
  'The corridor goes off. Down at the near end the store is still there, entirely lit, being open.\n\nYou pull it again, because the alternative was doing all of this by the light of a shop.';

const corridorBulb: ObjectDefSlice = {
  location: ACT2_WALL_DRUG_BACK_CORRIDOR,
  name: 'bulb',
  nouns: ['bulb', 'light', 'lamp', 'cord', 'pull cord', 'chain', 'fitting', 'socket'],
  portable: false,
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: bulbExamine }] },
    { verbs: [PULL, TURN_OFF], effects: [{ say: bulbPullText }] },
  ],
};

export const ACT2_BACK_CORRIDOR_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT2_CLAIM_SHELVING]: shelving,
  [ACT2_SHELVING_STENCILS]: shelvingStencils,
  [ACT2_CACHE_BOX]: cacheBox,
  [ACT2_STACKED_BOXES]: stackedBoxes,
  [ACT2_WD_TERMINAL]: wdTerminal,
  [ACT2_CORRIDOR_BULB]: corridorBulb,
};

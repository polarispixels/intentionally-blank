// Act III, Wave D4 task B — S1 Mechanical Gallery's own objects (D4 prose
// doc §7.3, §8.2-§8.5, §8.7). The lift door (one of the room's "6 objects,"
// §8) is built by `../elevator.ts`'s own `elevatorObjects` (a fourth
// physical instance, `_GALLERY`) and is not repeated here.
//
// The construction door (§7) is "one object, two rooms" (the D3 §10.8/
// elevator idiom): task A owns the tunnel-side instance and its `OPEN
// DOOR` that actually sets `act3_construction_door_open`
// (`objects/serviceTunnel.ts`, not landed as of this file). This file
// builds only the S1-side instance (`ACT3_CONSTRUCTION_DOOR_S1`), with
// only §7.3's own rule ("OPEN DOOR" before it's open) — §7.1's rules 2/3
// (the S1-side EXAMINE, "before"/"after") are task A's own to add to this
// same object id, by appending to its `handlers`, once their file exists.
// Flagged in this task's report.

import type { Effect } from '../../../../engine/effects';
import type { ObjectDefSlice } from '../../../../engine/world';
import { EXAMINE, LISTEN, LOOK_BEHIND, OPEN, READ, SEARCH, SMELL, TAKE, TOUCH } from '../../act1/verbs';
import { ACT2_NOTEBOOK, V_FIT } from '../../act2/ids';
import {
  ACT3_CHECKOUT_CARD,
  ACT3_CLUE_J_HAND,
  ACT3_CONSTRUCTION_DOOR_GATE,
  ACT3_CONSTRUCTION_DOOR_OPEN,
  ACT3_CONSTRUCTION_DOOR_S1,
  ACT3_CRIB_BOARD,
  ACT3_CRIB_CUP,
  ACT3_PUMPS,
  ACT3_S1_FLOOR,
  ACT3_S1_MECHANICAL_GALLERY,
  ACT3_STAIRS_DOWN,
  ACT3_TAPE_RACK,
  ACT3_TOOL_CRIB,
} from '../ids';

// ---------------------------------------------------------------------------
// §7.3 — "OPEN DOOR" from the S1 side, before it's open.
// ---------------------------------------------------------------------------

export const S1_DOOR_OPEN_BEFORE_TEXT =
  'There is nothing to pull. The handle turned into wall a long time ago and the\njoint is full of paint.\n\nYou could put the chair leg into it and make a mess and a noise and a\nrectangle of bare steel, and you would still be pulling on a door that opens\naway from you, with nothing on this side to pull it by.';

// §7.1 rules 2 and 3 — the S1 side of the door, before and after (wired by
// the main session at integration; task A parked the text, task B's object
// had only §7.3).
const S1_DOOR_EXAMINE_BEFORE_TEXT =
  'From this side it is not a door.\n\nIt is a rectangle in the block wall, filled with steel, painted the wall\'s\ncolour so many times that the paint has closed the joint all the way round and\nturned the whole thing into a shape you would walk past. People have. There is\na scuff line across the bottom of it at about the height of a trolley.\n\nThere is a handle. The handle is painted too, into the wall, in one piece with\nit.';

const S1_DOOR_EXAMINE_AFTER_TEXT =
  'Standing open against the block, with a lip of paint hanging off the frame in\none piece where the joint gave, and a mile of tunnel behind it going away\nunder the grazing.';

const constructionDoorS1: ObjectDefSlice = {
  location: ACT3_S1_MECHANICAL_GALLERY,
  name: 'construction door',
  nouns: ['door', 'construction door', 'steel door', 'leaf', 'frame', 'lever', 'handle', 'dogs', 'plate'],
  handlers: [
    {
      verbs: [EXAMINE],
      effects: [{ say: [
        { when: { not: { flag: ACT3_CONSTRUCTION_DOOR_OPEN } }, text: S1_DOOR_EXAMINE_BEFORE_TEXT },
        { text: S1_DOOR_EXAMINE_AFTER_TEXT },
      ] }],
    },
    { verbs: [OPEN], when: { not: { flag: ACT3_CONSTRUCTION_DOOR_OPEN } }, effects: [{ say: S1_DOOR_OPEN_BEFORE_TEXT }] },
  ],
};

/**
 * Mechanism-only, never named — the `south` exit's own `door` reference
 * (`s1MechanicalGallery.ts`, the room file), synced to
 * `act3_construction_door_open` on every entry to S1. See `ids.ts`'s own
 * doc comment on `ACT3_CONSTRUCTION_DOOR_GATE` for why this is safe without
 * task A's own tunnel-side effects knowing about it.
 */
const constructionDoorGate: ObjectDefSlice = { location: ACT3_S1_MECHANICAL_GALLERY, name: 'construction door gate' };

// ---------------------------------------------------------------------------
// §8.2 — the pumps.
// ---------------------------------------------------------------------------

const pumpsExamine =
  'Four of them in a row, each one a motor and a volute bolted to a common frame,\nand each frame standing on rubber pads the size of hockey pucks so that what\nthe pumps do stays in the pumps and out of the building.\n\nThree are running. The fourth is dry and cold and is the standby, and its\nbrass tag hangs off its isolating valve on the same gauge of wire as every\nother tag in this building, stamped by the same hand.\n\nPut a palm on a running one and the water inside it arrives and leaves,\narrives and leaves.';

const readTagsText =
  '    CWR-1\n    CWR-2\n    CWR-3\n    CWR-4 (S)\n\nChilled water return, and the S is the standby, and nothing on any of them\nsays where the water is coming back from.';

const listenPumpsText =
  'A hum with a shove in it, four times a second, and under that the sound of the\npipework accepting the shove and passing it on.\n\nYou feel it in the floor before you hear it, which by now is how you expect\nwater to introduce itself.';

const stopPumpText =
  'There is a hasp on the isolating valve, an interlock behind the hasp, and a\nlaminated card in a bracket beside both of them explaining, in the tone of a\nman who has had to explain it before, what happens to a building when its\nreturns stop.\n\nAlso, three floors up there is a wall of gauges that would know inside a\nminute.';

// Exported: §8.8's "SEARCH ROOM" is bare (no dobj, the room's own handler,
// `s1MechanicalGallery.ts`) and needs this same string, not a duplicate.
export const S1_SEARCH_BEHIND_PUMPS_TEXT =
  'Behind the pumps: the wall the construction door is in, a floor drain with a\ngrating over it, and about forty years less dust than you were expecting in a\nbuilding that has not had forty years.';

const pumps: ObjectDefSlice = {
  location: ACT3_S1_MECHANICAL_GALLERY,
  name: 'pumps',
  nouns: ['pumps', 'pump', 'motors', 'motor', 'volute', 'volutes', 'bases', 'inertia base', 'standby', 'tags', 'tag', 'valves'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: pumpsExamine }] },
    { verbs: [READ], effects: [{ say: readTagsText }] },
    { verbs: [LISTEN], effects: [{ say: listenPumpsText }] },
    { verbs: [TOUCH, OPEN], effects: [{ say: stopPumpText }] },
    { verbs: [LOOK_BEHIND, SEARCH], effects: [{ say: S1_SEARCH_BEHIND_PUMPS_TEXT }] },
  ],
};

// ---------------------------------------------------------------------------
// §8.3 — the tool crib.
// ---------------------------------------------------------------------------

const cribExamine =
  'A mesh cage about the size of a bedroom, with the door standing open and the\npadlock hanging on the hasp through its own shackle, unlocked, the way a\npadlock hangs when nobody has ever needed it shut.\n\nA bench along one side with a vice on it. Over the bench, a board with an\noutline painted for every tool, and every tool in its outline, and nothing on\nthe board that is not in an outline.\n\nOn the bench: a coffee tin of split pins, a rag folded in four, and a paper\ncup with about a half inch of something in the bottom of it that has gone to\nskin.';

const cribTakeText =
  'Spanners, a mallet, three sizes of grip, a pot of the same grey paint as the\nwalls with the lid on properly.\n\nYou take nothing, because there is nothing here you do not already have a\nworse version of in your coat, and because a board like this notices.';

const crib: ObjectDefSlice = {
  location: ACT3_S1_MECHANICAL_GALLERY,
  name: 'tool crib',
  nouns: ['crib', 'tool crib', 'cage', 'mesh', 'store', 'bench', 'vice', 'tin', 'rag'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: cribExamine }] },
    { verbs: [TAKE, OPEN, SEARCH], effects: [{ say: cribTakeText }] },
  ],
};

const cribCupExamine =
  'Paper, waxed, with a bead of dried coffee down one side and a skin across the\ntop gone the colour and thickness of a thing that has been left considerably\nlonger than the length of a break.\n\nWhoever set it down was coming back.';

const cribCup: ObjectDefSlice = {
  location: { on: ACT3_TOOL_CRIB },
  name: 'paper cup',
  nouns: ['cup', 'paper cup'],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: cribCupExamine }] }],
};

const cribBoardExamine =
  'Painted outlines, done freehand and done well, one to a tool, with the tool\nin it.\n\nThere is not a gap on this board anywhere.';

const cribBoard: ObjectDefSlice = {
  location: { on: ACT3_TOOL_CRIB },
  name: 'shadow board',
  nouns: ['board', 'shadow board', 'outlines', 'outline'],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: cribBoardExamine }] }],
};

// ---------------------------------------------------------------------------
// §8.4/§8.5 — the tape rack and the checkout card.
// ---------------------------------------------------------------------------

const rackExamine =
  'Against the back wall of the crib, a rack of tape cartridges standing on edge\nin plastic shells, five shelves of them, each shell with a printed spine label\nand each spine label with a card in a slot on the shelf edge in front of it.\n\nThe cards are the old kind: three ruled columns, headed OUT, BY and BACK,\nfilled in by hand, the way a library did it before libraries stopped.\n\nMost of the cards have nothing on them. A few have one line, written and then\nstruck through.\n\nOn the third shelf there is a slot with a card in it and no tape behind it.';

const readSpineLabelsText =
  'A run of letters and a run of numbers, printed, sequential, going along the\nshelf and down to the next one without a break in them anywhere.\n\nThey are not titles. Nobody labelled these expecting to want one back for a\nreason he could describe.';

const takeTapeText =
  'They come off the shelf and go back on it and there is nothing in this\nbuilding to put one into; a machine that reads these would be the size of the\ncrib and there is no crib-sized hole in this room.\n\nWhatever these are for, they are for somewhere else, and they have been\nwaiting there a while.';

// §21.2's own collision note: "the checkout card is the only portable one;
// once taken it wins everywhere." The rack's own noun list keeps to the
// plural ("cards"/"slots") rather than doubling up on the bare singular
// "card"/"slot" the checkout card itself needs exclusively.
const tapeRack: ObjectDefSlice = {
  location: ACT3_S1_MECHANICAL_GALLERY,
  name: 'tape rack',
  nouns: ['rack', 'tape rack', 'tapes', 'tape', 'cartridges', 'cartridge', 'shelves', 'shelf', 'cards', 'slots', 'labels', 'spine'],
  container: { open: true, transparent: true },
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: rackExamine }] },
    { verbs: [READ], effects: [{ say: readSpineLabelsText }] },
    { verbs: [TAKE, SEARCH], effects: [{ say: takeTapeText }] },
  ],
};

const checkoutCardExamine =
  'Ruled in three columns — OUT, BY, BACK — and filled in once, in pencil, small\nand fast.\n\nUnder OUT, a day and a month and no year.\n\nUnder BY, one letter and a full stop:\n\n    J.\n\nUnder BACK, nothing, and the line has not been struck through, which on a card\nlike this is the whole of the filing system saying that the tape is still out.';

// §8.6 — COMPARE CARD WITH NOTEBOOK / COMPARE HANDWRITING / COMPARE CARD
// WITH BACK COVER (`V_FIT`, act2/ids.ts — words compare/match/fit, same
// idiom as `objects/corridorB4.ts`'s own life-safety-plan/notebook compare
// and `objects/coolingPlant.ts`'s own drawing/returns compare).
const compareCardText =
  "You hold the card against the inside of the notebook's back cover, where the\npencil is heaviest.\n\nThe same pressure. The same small fast letters leaning the same way. The full\nstop after the J is put down hard enough to be a decision, and there is one\nexactly like it after every abbreviation in the book.\n\nHe took a tape out of this rack and did not bring it back.";

const compareCardEffects: Effect[] = [{ say: compareCardText }, { grantClue: ACT3_CLUE_J_HAND }];

const checkoutCard: ObjectDefSlice = {
  location: { in: ACT3_TAPE_RACK },
  portable: true,
  name: 'checkout card',
  nouns: ['card', 'checkout card', 'slot card', 'ticket'],
  // `parser/grammar.ts`'s `toPhrase` always splits a multi-word dobj into
  // adjectives (every word but the last) + head noun (the last word) —
  // there is no "try the whole phrase as one compound noun" path. Bare
  // "card" collides with the lift's own certificate (`elevator.ts`, D3-
  // shipped, shares this room via the `_GALLERY` instance) until this card
  // is held (`preferHeld`); "checkout card"/"slot card" need these
  // adjectives declared so `resolveNounPhrase`'s adjective-narrowing can
  // actually pick this object out of that ambiguity before it's taken.
  adjectives: ['checkout', 'slot'],
  handlers: [
    { verbs: [EXAMINE, READ], effects: [{ say: checkoutCardExamine }] },
    { verbs: [V_FIT], withInstrument: [ACT2_NOTEBOOK], when: { has: ACT2_NOTEBOOK }, effects: compareCardEffects },
  ],
};

// ---------------------------------------------------------------------------
// §8.7 — the stair down. Bare "DOWN" is the room's own exit
// (`s1MechanicalGallery.ts`); this is only the object's own EXAMINE.
// ---------------------------------------------------------------------------

const stairsExamine =
  'A steel stair in a half-turn, galvanised, with a scaffold handrail and a\nkick-plate, going down out of the light into more of the same light.\n\nScrewed to the wall at the head of it, a small sign with an arrow and one line\non it:\n\n    S5\n\nThere is nothing between here and there, and the sign does not pretend\notherwise.';

const stairsDown: ObjectDefSlice = {
  location: ACT3_S1_MECHANICAL_GALLERY,
  name: 'stair',
  nouns: ['stair', 'stairs', 'staircase', 'steps', 'flight', 'handrail', 'landing', 'sign', 'arrow'],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: stairsExamine }] }],
};

// ---------------------------------------------------------------------------
// §8.8 — room-level senses that need a noun (the floor).
// ---------------------------------------------------------------------------

const floorTouchText =
  'Sealed screed, swept, with the pumps\' pulse in it and a mop line round the\nbase of the crib where somebody goes to the wall and stops.';

const s1Floor: ObjectDefSlice = {
  location: ACT3_S1_MECHANICAL_GALLERY,
  name: 'floor',
  // §21.2: "the mop line — never bare `line`" — this object's own noun
  // list deliberately excludes "line."
  nouns: ['floor', 'screed'],
  handlers: [{ verbs: [EXAMINE, TOUCH], effects: [{ say: floorTouchText }] }],
};

export const ACT3_S1_MECHANICAL_GALLERY_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT3_CONSTRUCTION_DOOR_S1]: constructionDoorS1,
  [ACT3_CONSTRUCTION_DOOR_GATE]: constructionDoorGate,
  [ACT3_PUMPS]: pumps,
  [ACT3_TOOL_CRIB]: crib,
  [ACT3_CRIB_CUP]: cribCup,
  [ACT3_CRIB_BOARD]: cribBoard,
  [ACT3_TAPE_RACK]: tapeRack,
  [ACT3_CHECKOUT_CARD]: checkoutCard,
  [ACT3_STAIRS_DOWN]: stairsDown,
  [ACT3_S1_FLOOR]: s1Floor,
};

// The Post Office — the room's five objects
// (`docs/superpowers/specs/2026-09-03-act1-wave2-prose.md` §4). Prose
// transcribed exactly (hard rule 5); the object/sub-part split and verb
// wiring are this builder's own calls, following the established
// "which noun word resolved" idiom (`ids.ts`'s own header, `objects/
// mainStreet.ts`'s `BRICK_ROW_SIGN`/`BRICK_ROW_WINDOW`).

import type { Effect } from '../../../../engine/effects';
import type { ObjectDefSlice } from '../../../../engine/world';
import { BREAK, EXAMINE, LOOK_UNDER, OPEN, postLetterText, PRY, PULL, READ, SEARCH, SHAKE, SIT, TAKE, TOUCH, TURN, UNLOCK } from '../verbs';
import {
  CLUE_BLANK_RECTANGLE,
  CLUE_BOX_141,
  FLAG_RANG_BELL,
  FLAG_SAT_IN_POST_OFFICE,
  FLAG_SAW_BLANK_RECTANGLE,
  MAIL_DROP,
  MAIL_DROP_FORMS,
  NOTICE_BOARD,
  NOTICE_BOARD_CORNER,
  PO_BOXES,
  PO_BOXES_WINDOW,
  POST_OFFICE,
  POST_OFFICE_NO_EXIT_GATE,
  SERVICE_COUNTER,
  LOBBY_BENCH,
  V_COUNT,
  V_REACH_UNDER,
  V_RIGHT,
  V_RING,
} from '../ids';

// ---------------------------------------------------------------------------
// §4.1 — The boxes
// ---------------------------------------------------------------------------

const boxesExamine =
  'Four ranks high, the bottom rank down where you would have to kneel to it. Each door has a number stamped into it, a dial with the alphabet round it in place of figures, and a window of glass gone the colour of weak tea.\n\nAbove most of the numbers a slot holds a card with a name written on it. Above some of them the slot is empty, which is what happens when somebody stops paying.';

const boxesWindowText = 'You go along the wall reading the empty slots. There are nine of them, and eight are dark behind the glass.\n\nThe ninth is 141. Behind its window there is the pale edge of something standing on end, the way mail stands when a box has enough in it to hold it up.';
const boxesWindowEffects: Effect[] = [{ say: boxesWindowText }, { grantClue: CLUE_BOX_141 }];

const boxesOpen = 'The dial turns freely both ways and means nothing without the three letters that go with it. You try the door. It is a small brass door and it is doing its job.';

const boxesForce = "Brass over an oak carcass, set into a wall, with a federal offence attached to it. You could get one open. You would then be a man with no name who has opened a stranger's mail.";

const boxesCount = 'You get to a hundred and fifty-one, and then start again from the other end and get a hundred and forty-nine. Somewhere in there is a door you counted twice and a door you did not count at all.';

const poBoxes: ObjectDefSlice = {
  location: POST_OFFICE,
  name: 'boxes',
  portable: false,
  // "window"/"windows"/"glass"/"141"/"one forty one" moved to the sub-part below.
  nouns: ['box', 'boxes', 'po box', 'pobox', 'brass', 'door', 'doors', 'dial', 'dials', 'mailbox', 'mailboxes', 'pigeonhole', 'pigeonholes', 'number', 'numbers', 'card', 'cards', 'name card', 'slot'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: boxesExamine }] },
    // "look in box" (SEARCH's own word "look in") reaches the clue text via the base object, since "box" stays a base noun.
    { verbs: [SEARCH], effects: boxesWindowEffects },
    { verbs: [OPEN, TURN, UNLOCK], effects: [{ say: boxesOpen }] },
    { verbs: [PRY, BREAK, SHAKE], effects: [{ say: boxesForce }] },
    { verbs: [V_COUNT], effects: [{ say: boxesCount }] },
  ],
};

const poBoxesWindow: ObjectDefSlice = {
  location: { on: PO_BOXES },
  name: 'window',
  portable: false,
  nouns: ['window', 'windows', 'glass', '141', 'one forty one'],
  handlers: [{ verbs: [EXAMINE, SEARCH], effects: boxesWindowEffects }],
};

// ---------------------------------------------------------------------------
// §4.2 — The notice board
// ---------------------------------------------------------------------------

const boardExamine =
  'The heading is painted straight onto the wall above it, in a serif with serifs on the serifs: NOTICES AND PERSONS SOUGHT.\n\nUnder it, cork, gone the colour of weak coffee everywhere the sun has been able to reach it — which is everywhere except one rectangle about the size of a sheet of paper, up and to the left, where the cork is still the colour cork starts out.\n\nFour pins hold nothing. There is a fifth pinhole in the middle of the top edge, from something wider. Under the top left pin there is a corner of paper about the size of a thumbnail, with a printed border on it and no words.';
const boardExamineEffects: Effect[] = [{ say: boardExamine }, { grantClue: CLUE_BLANK_RECTANGLE }, { set: [FLAG_SAW_BLANK_RECTANGLE, true] }];

const notesText =
  'A burn ban. A livestock sale with the date filled in by hand. A card offering fence work, with a row of tear-off tabs along the bottom and every tab still on it. A county form about culvert permits that has been up long enough to curl.\n\nAnd a photograph of a dog, printed at home, above the word FOUND and a telephone number. Not lost. Found.';

const cornerText = 'It comes away from the pin without any trouble at all. Paper, one pinhole, and a fifth of an inch of printed rule along two edges.\n\nYou put it back under the pin.';

const noticeBoard: ObjectDefSlice = {
  location: POST_OFFICE,
  name: 'notice board',
  portable: false,
  // "corner"/"paper" moved to the sub-part below.
  nouns: ['board', 'cork board', 'corkboard', 'notice', 'notices', 'poster', 'posters', 'wanted', 'wanted poster', 'bulletin', 'pins', 'pin', 'pinhole', 'gap', 'rectangle', 'space', 'blank', 'heading'],
  handlers: [
    { verbs: [EXAMINE], effects: boardExamineEffects },
    { verbs: [READ, SEARCH], effects: [{ say: notesText }] },
  ],
};

const noticeBoardCorner: ObjectDefSlice = {
  location: { on: NOTICE_BOARD },
  name: 'corner',
  portable: false,
  nouns: ['corner', 'paper', 'fragment'],
  handlers: [{ verbs: [EXAMINE, TOUCH, TAKE, PULL], effects: [{ say: cornerText }] }],
};

// ---------------------------------------------------------------------------
// §4.3 — The counter
// ---------------------------------------------------------------------------

const counterExamine =
  'A wooden counter with a brass grille above it, and behind the grille a roller shutter down to the sill. Through the last inch of gap under the shutter: floor, the leg of a stool, and a set of scales with a brass pan.\n\nA card hangs on the grille on a loop of string. It gives the hours the window is open, which are not these ones. The closing time has been crossed out and written lower twice, in two different pens. The opening time has not moved at all.';

const ringBellRule1 = 'The bell is louder than a room this size has any use for. It goes on being loud for about a second and a half after you take your hand off it.\n\nNothing behind the shutter takes an interest.';
const ringBellRule2 = 'You ring it again, in case the building has changed its mind.';
const ringBellEffects: Effect[] = [
  { if: { when: { flag: FLAG_RANG_BELL }, then: [{ say: ringBellRule2 }], else: [{ say: ringBellRule1 }] } },
  { set: [FLAG_RANG_BELL, true] },
];

const shutterText = 'An inch of gap, and your hand is more than an inch. The shutter is locked into the sill at both ends by somebody who does it every night without thinking about it.';

const serviceCounter: ObjectDefSlice = {
  location: POST_OFFICE,
  name: 'counter',
  portable: false,
  nouns: ['counter', 'grille', 'grate', 'shutter', 'window', 'service window', 'wicket', 'hours', 'card', 'sign', 'bell', 'scales', 'scale', 'postmaster', 'stool'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: counterExamine }] },
    { verbs: [V_RING], effects: ringBellEffects },
    { verbs: [OPEN, V_RIGHT, V_REACH_UNDER, LOOK_UNDER], effects: [{ say: shutterText }] },
  ],
};

// ---------------------------------------------------------------------------
// §4.4 — The mail drop
// ---------------------------------------------------------------------------

const dropExamine =
  'Two brass mouths in the wall beside the counter, each with a flap and a word over it: OUT OF TOWN and LOCAL. Under them a sloped ledge at writing height, with a pen on a chain and a rack of forms.\n\nSomebody has cut a square of felt into each flap by hand so the brass does not bang. It has been there long enough to go bald in the middle.';

const formsText =
  'A wooden rack of them, four deep. Change of address. Hold mail. Redirect to a temporary address. Application for a post-office box, with a line for two forms of identification and a line under that for a witness.\n\nAnd one at the back, thinner than the others and grubby at the corner from being reached for: report of mail received opened or damaged in handling.\n\nThey come out of the rack easily enough. Every one of them has a line at the top for a name.';

const mailDrop: ObjectDefSlice = {
  location: POST_OFFICE,
  name: 'mail drop',
  portable: false,
  // "form"/"forms"/"rack" moved to the sub-part below.
  nouns: ['slot', 'slots', 'mail slot', 'drop', 'chute', 'flap', 'flaps', 'outgoing', 'mail', 'letterbox', 'letter box', 'out of town', 'local', 'ledge', 'desk', 'pen', 'chain'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: dropExamine }] },
    { verbs: [OPEN, PULL], effects: [{ say: postLetterText }] },
  ],
};

const mailDropForms: ObjectDefSlice = {
  location: { on: MAIL_DROP },
  name: 'forms',
  portable: false,
  nouns: ['form', 'forms', 'rack'],
  handlers: [{ verbs: [EXAMINE, READ, TAKE], effects: [{ say: formsText }] }],
};

// ---------------------------------------------------------------------------
// §4.5 — The bench
// ---------------------------------------------------------------------------

const benchExamine =
  'A bench of the sort built by whoever built the counter, set against the front window, with a cast-iron radiator under it giving off about as much heat as a cat.\n\nFrom this end of it you can see the whole brass wall and the street door at the same time.';

const benchSit = 'You sit. The radiator gets at the backs of your legs and does what it can, and the brass wall goes on being a hundred and fifty locked doors.';

const lobbyBench: ObjectDefSlice = {
  location: POST_OFFICE,
  name: 'bench',
  portable: false,
  nouns: ['bench', 'seat', 'radiator', 'heater', 'pipes', 'window', 'front window', 'sill', 'glass'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: benchExamine }] },
    { verbs: [SIT], effects: [{ say: benchSit }, { set: [FLAG_SAT_IN_POST_OFFICE, true] }] },
  ],
};

// §6's always-closed "every other direction" gate — mirrors `MAIN_STREET_BOUNDARY_GATE`: no nouns, never resolvable, never described.
const postOfficeNoExitGate: ObjectDefSlice = { location: POST_OFFICE };

export const POST_OFFICE_OBJECTS: Record<string, ObjectDefSlice> = {
  [PO_BOXES]: poBoxes,
  [PO_BOXES_WINDOW]: poBoxesWindow,
  [NOTICE_BOARD]: noticeBoard,
  [NOTICE_BOARD_CORNER]: noticeBoardCorner,
  [SERVICE_COUNTER]: serviceCounter,
  [MAIL_DROP]: mailDrop,
  [MAIL_DROP_FORMS]: mailDropForms,
  [LOBBY_BENCH]: lobbyBench,
  [POST_OFFICE_NO_EXIT_GATE]: postOfficeNoExitGate,
} satisfies Record<string, ObjectDefSlice>;

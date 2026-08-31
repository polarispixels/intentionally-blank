// The Post Office — the room's five objects
// (`docs/superpowers/specs/2026-09-03-act1-wave2-prose.md` §4). Prose
// transcribed exactly (hard rule 5); the object/sub-part split and verb
// wiring are this builder's own calls, following the established
// "which noun word resolved" idiom (`ids.ts`'s own header, `objects/
// mainStreet.ts`'s `BRICK_ROW_SIGN`/`BRICK_ROW_WINDOW`).

import type { Effect } from '../../../../engine/effects';
import type { Cond } from '../../../../engine/cond';
import type { ObjectDefSlice } from '../../../../engine/world';
import type { ProseRule } from '../../../../engine/prose';
import { BREAK, EXAMINE, LOOK_UNDER, OPEN, postLetterText, PRY, PULL, READ, SEARCH, SHAKE, SIT, TAKE, TOUCH, TURN, UNLOCK } from '../verbs';
import {
  CLAIM_TICKET,
  CLUE_BLANK_RECTANGLE,
  CLUE_BOX_141,
  FLAG_OPENED_BOX_141,
  FLAG_RANG_BELL,
  FLAG_SAT_IN_POST_OFFICE,
  FLAG_SAW_BLANK_RECTANGLE,
  INTACT_POLAROIDS,
  KEYRING,
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
// D2-B — box 141 grows a state machine of its own (Stage D plan §2 D2; prose
// doc 2026-09-10-stage-d2-prose.md §12.2–§12.4): waiting/arrived, on top of
// Act I's own always-there text, plus a reply/ruler pickup on OPEN.
import { ACT4_REPLY_ELI_NUMERALS } from '../../act4/ids';
import { ACT2_CACHE_FOUND, ACT2_ORIGAMI_RULER, ACT2_REPLY_AUDIT, ACT2_REPLY_BLANK, ACT2_REPLY_REWRITTEN, ACT2_SAW_REPAVING_NOTICE, ACT2_STARTED } from '../../act2/ids';
// E0 task I (`docs/superpowers/specs/2026-09-17-stage-e0-prose.md` §5) —
// the second, closure notice, once the visit is announced.
import { ACT4_VISIT_ANNOUNCED, ACT4_VISIT_NOTICE } from '../../act4/ids';
// E1 task L (`docs/superpowers/specs/2026-09-18-stage-e1-prose.md` §19) —
// the office's form letter arrives the same way, same precedent
// `ACT4_REPLY_ELI_NUMERALS` set (E0 task J's own comment above, "added at
// integration").
import { ACT4_REPLY_OFFICE } from '../../act4/ids';

// ---------------------------------------------------------------------------
// §4.1 — The boxes
// ---------------------------------------------------------------------------

const boxesExamine =
  'Four ranks high, the bottom rank down where you would have to kneel to it. Each door has a number stamped into it, a dial with the alphabet round it in place of figures, and a window of glass gone the colour of weak tea.\n\nAbove most of the numbers a slot holds a card with a name written on it. Above some of them the slot is empty, which is what happens when somebody stops paying.';

const boxesWindowText = 'You go along the wall reading the empty slots. There are nine of them, and eight are dark behind the glass.\n\nThe ninth is 141. Behind its window there is the pale edge of something standing on end, the way mail stands when a box has enough in it to hold it up.';

// D2-B — §12.2/§12.4. Once Act II is under way, box 141's own description
// widens past Act I's single unconditional line: a reply (or the origami
// ruler alongside it) sitting in the box reads as "just arrived"; nothing
// there yet (box already emptied once, per Act I) reads as "still waiting."
// Prepended above the shipped `boxesWindowText`, same "gate on act2_started,
// else fall through" idiom `act2/index.ts`'s own SLEEP-override loop uses.
const box141HasSomethingWaiting: Cond = {
  any: [
    { objectAt: [ACT2_REPLY_REWRITTEN, { in: PO_BOXES }] },
    { objectAt: [ACT2_REPLY_BLANK, { in: PO_BOXES }] },
    { objectAt: [ACT2_REPLY_AUDIT, { in: PO_BOXES }] },
    { objectAt: [ACT4_REPLY_ELI_NUMERALS, { in: PO_BOXES }] },
    { objectAt: [ACT4_REPLY_OFFICE, { in: PO_BOXES }] },
    { objectAt: [ACT2_ORIGAMI_RULER, { in: PO_BOXES }] },
  ],
};

const box141ArrivalText = 'Behind the yellowed glass of 141 there is the pale edge of something standing\non end.';

const box141WaitingText = 'Nine dark windows and one that has had something in it. Nothing has changed\nabout 141 since the last time you looked, and looking is free.';

const boxesWindowEffects: Effect[] = [
  {
    say: [
      { when: box141HasSomethingWaiting, text: box141ArrivalText },
      { when: { flag: ACT2_STARTED }, text: box141WaitingText },
      { text: boxesWindowText },
    ],
  },
  { grantClue: CLUE_BOX_141 },
];

/** Wave 5's own rule 2 — unedited, byte for byte (§9.3's own instruction: "the shipped string turns out to have been the instructions"). */
const boxesOpen = 'The dial turns freely both ways and means nothing without the three letters that go with it. You try the door. It is a small brass door and it is doing its job.';

/**
 * Wave 5, §9.3 — rule 1, `{ has: KEYRING }`. The tag's three letters are
 * never printed (§9.2's own discipline, transcribed here too) — this
 * response pays back `boxesWindowText`'s own "standing on end, the way
 * mail stands" clause on purpose (that file's own comment, unchanged), the
 * one deliberate repeated phrase in the wave.
 */
const boxesOpenWithKeyText =
  'You take the tag between finger and thumb, hold it where the lamp can get at it, and turn the dial to the three letters somebody scratched into brass because he did not trust himself to remember them.\n\nThere is no click. The dial does not do anything you can feel. The door simply stops being a door that is shut, and comes a quarter of an inch out of its frame under its own weight.\n\nInside, standing on end the way mail stands: two photographs and a card.';

// D2-B — §12.3 (`OPEN BOX 141` with a reply in it). Same box, same key;
// prepended above wave 5's own two-line family so a reply's arrival takes
// precedence over both the with-key and without-key shipped text.
const box141OpenWithReplyText =
  'The dial goes round to the three letters and the door comes a quarter of an\ninch out of its frame under its own weight.\n\nInside: one sheet, folded small enough that the post office has stamped the\noutside of it rather than an envelope, because there is no envelope.';

const box141ReplyPickupWithKey: Cond = { all: [box141HasSomethingWaiting, { has: KEYRING }] };

const boxesOpenEffects: Effect[] = [
  {
    say: [
      { when: box141ReplyPickupWithKey, text: box141OpenWithReplyText },
      { when: { has: KEYRING }, text: boxesOpenWithKeyText },
      { text: boxesOpen },
    ],
  },
  {
    if: {
      when: { has: KEYRING },
      then: [{ set: [FLAG_OPENED_BOX_141, true] }, { move: [INTACT_POLAROIDS, 'inventory'] }, { move: [CLAIM_TICKET, 'inventory'] }],
    },
  },
  // D2-B — moves whichever reply (and the ruler, if present) is currently
  // sitting in the box into inventory. Each `if` is independently gated by
  // `objectAt`, which is naturally self-clearing: once moved, the object is
  // no longer `{ in: PO_BOXES }`, so re-opening the (now empty) box renders
  // the shipped with-key text again with no extra bookkeeping flag needed.
  { if: { when: { all: [{ objectAt: [ACT2_REPLY_REWRITTEN, { in: PO_BOXES }] }, { has: KEYRING }] }, then: [{ move: [ACT2_REPLY_REWRITTEN, 'inventory'] }] } },
  { if: { when: { all: [{ objectAt: [ACT2_REPLY_BLANK, { in: PO_BOXES }] }, { has: KEYRING }] }, then: [{ move: [ACT2_REPLY_BLANK, 'inventory'] }] } },
  { if: { when: { all: [{ objectAt: [ACT2_REPLY_AUDIT, { in: PO_BOXES }] }, { has: KEYRING }] }, then: [{ move: [ACT2_REPLY_AUDIT, 'inventory'] }] } },
  // E0 (v0.16.0): the numerals reply arrives the same way — added at integration (task J flagged it; this is task I's file).
  { if: { when: { all: [{ objectAt: [ACT4_REPLY_ELI_NUMERALS, { in: PO_BOXES }] }, { has: KEYRING }] }, then: [{ move: [ACT4_REPLY_ELI_NUMERALS, 'inventory'] }] } },
  // E1 task L (v0.17.0): the office's form letter arrives the same way.
  { if: { when: { all: [{ objectAt: [ACT4_REPLY_OFFICE, { in: PO_BOXES }] }, { has: KEYRING }] }, then: [{ move: [ACT4_REPLY_OFFICE, 'inventory'] }] } },
  { if: { when: { all: [{ objectAt: [ACT2_ORIGAMI_RULER, { in: PO_BOXES }] }, { has: KEYRING }] }, then: [{ move: [ACT2_ORIGAMI_RULER, 'inventory'] }] } },
];

const boxesForce = "Brass over an oak carcass, set into a wall, with a federal offence attached to it. You could get one open. You would then be a man with no name who has opened a stranger's mail.";

const boxesCount = 'You get to a hundred and fifty-one, and then start again from the other end and get a hundred and forty-nine. Somewhere in there is a door you counted twice and a door you did not count at all.';

const poBoxes: ObjectDefSlice = {
  location: POST_OFFICE,
  name: 'boxes',
  portable: false,
  // "window"/"windows"/"glass"/"141"/"one forty one" moved to the sub-part
  // below. "letters" added (wave 5, §9.3: "DIAL LETTERS" — TURN's own word
  // list gains "dial", `verbs.ts`; this noun is what "LETTERS" resolves the
  // dobj to).
  nouns: ['box', 'boxes', 'po box', 'pobox', 'brass', 'door', 'doors', 'dial', 'dials', 'mailbox', 'mailboxes', 'pigeonhole', 'pigeonholes', 'number', 'numbers', 'card', 'cards', 'name card', 'slot', 'letters'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: boxesExamine }] },
    // "look in box" (SEARCH's own word "look in") reaches the clue text via the base object, since "box" stays a base noun.
    { verbs: [SEARCH], effects: boxesWindowEffects },
    // "OPEN BOX 141"/"OPEN BOX"/"DIAL LETTERS"/"UNLOCK BOX"/"TURN DIAL" (§9.3).
    { verbs: [OPEN, TURN, UNLOCK], effects: boxesOpenEffects },
    { verbs: [PRY, BREAK, SHAKE], effects: [{ say: boxesForce }] },
    { verbs: [V_COUNT], effects: [{ say: boxesCount }] },
  ],
};

const poBoxesWindow: ObjectDefSlice = {
  location: { on: PO_BOXES },
  name: 'window',
  portable: false,
  nouns: ['window', 'windows', 'glass', '141', 'one forty one'],
  handlers: [
    { verbs: [EXAMINE, SEARCH], effects: boxesWindowEffects },
    // "OPEN BOX 141" resolves here ("141" is this sub-part's noun, "box" a
    // phantom adjective), so the box's own open handler is mirrored — the
    // v0.9.0 Act I playthrough found it hitting the generic can't-open.
    { verbs: [OPEN, TURN, UNLOCK], effects: boxesOpenEffects },
  ],
};

// ---------------------------------------------------------------------------
// §4.2 — The notice board
// ---------------------------------------------------------------------------

const boardExamine =
  'The heading is painted straight onto the wall above it, in a serif with serifs on the serifs: NOTICES AND PERSONS SOUGHT.\n\nUnder it, cork, gone the colour of weak coffee everywhere the sun has been able to reach it — which is everywhere except one rectangle about the size of a sheet of paper, up and to the left, where the cork is still the colour cork starts out.\n\nFour pins hold nothing. There is a fifth pinhole in the middle of the top edge, from something wider. Under the top left pin there is a corner of paper about the size of a thumbnail, with a printed border on it and no words.';
const boardExamineEffects: Effect[] = [{ say: boardExamine }, { grantClue: CLUE_BLANK_RECTANGLE }, { set: [FLAG_SAW_BLANK_RECTANGLE, true] }];

const notesText =
  'A burn ban. A livestock sale with the date filled in by hand. A card offering fence work, with a row of tear-off tabs along the bottom and every tab still on it. A county form about culvert permits that has been up long enough to curl.\n\nAnd a photograph of a dog, printed at home, above the word FOUND and a telephone number. Not lost. Found.';

// D2-C amendment (D2 prose doc §21.2, L20 — "the buzz") — the county
// notice, gated on the cache being found. Appended to the shipped
// `notesText` as a rule above it (the plan's own "not in the blank
// rectangle" instruction, §26 q4/§21.2's own note — the pinned-through
// notice is a NEW pin, separate from `noticeBoardCorner`'s own blank
// rectangle, so this is one rule, not a sub-part).
const notesWithNoticeText =
  `${notesText}\n\nAnd one that has gone up since you were last in here, on county stock, pinned\nthrough all four corners by somebody who does that:\n\n    NOTICE OF ROAD WORK\n    COUNTY HIGHWAY - MAIN STREET, FULL LENGTH\n    MILLING AND RESURFACING\n    SCHEDULE TO FOLLOW\n\nIt is pinned over the corner of the culvert-permit form, which has been up long\nenough to curl.\n\nAbove and to the left of it, the rectangle where the cork has never gone brown\nis still the colour cork starts out. Four pins hold nothing. Whatever a town\nputs on a board, it has not put anything there.`;

// E0 task I (§5.1) — rule 1, above the D2 cache rule: the second, closure
// notice pinned beside the road-work one, once the visit is announced.
const visitNoticeText =
  'A burn ban. A livestock sale with the date filled in by hand. A card offering\nfence work, with a row of tear-off tabs along the bottom and every tab still on\nit. A county form about culvert permits that has been up long enough to curl.\n\nAnd a photograph of a dog, printed at home, above the word FOUND and a\ntelephone number. Not lost. Found.\n\nBeside the road-work notice, on the same county stock, pinned through all four\ncorners by the same somebody, a second one:\n\n    NOTICE OF ROAD CLOSURE\n    COUNTY HIGHWAY - MAIN STREET, FULL LENGTH\n    NO STANDING, BOTH SIDES\n    FROM FIRST LIGHT UNTIL RELEASED\n\n    BY ORDER OF THE COUNTY\n\nAbove the two of them and to the left, the rectangle where the cork has never\ngone brown is still the colour cork starts out. Four pins hold nothing.';

const notesRule: ProseRule[] = [
  { when: { flag: ACT4_VISIT_ANNOUNCED }, text: visitNoticeText },
  { when: { flag: ACT2_CACHE_FOUND }, text: notesWithNoticeText },
  { text: notesText },
];

// E0 task I (§5) — `act4_visit_notice`, a sub-part on the notice board (not
// a new object in the blank rectangle, §5's own note) so "EXAMINE CLOSURE
// NOTICE" resolves. `hidden: true` by default; revealed by `act4_ev_start`
// (`act4/events.ts`) alongside `act4_visit_announced` — a one-way reveal is
// enough here (unlike the crews, §4) because a posted notice never comes
// back down. Nouns are three compound phrases so the resolver indexes
// "notice"/"closure" as head words with "closure"/"second"/"road" as their
// compound adjectives (§31.2's own "CLOSURE NOTICE, SECOND NOTICE, ROAD
// CLOSURE via adjectives: ['closure', 'second', 'road']") — no bare noun of
// its own, so it never competes with the board's own bare "notice".
const noticeBoardVisitNotice: ObjectDefSlice = {
  location: { on: NOTICE_BOARD },
  name: 'closure notice',
  portable: false,
  hidden: true,
  nouns: ['closure notice', 'second notice', 'road closure'],
  handlers: [{ verbs: [EXAMINE, READ], effects: [{ say: visitNoticeText }] }],
};

const cornerText = 'It comes away from the pin without any trouble at all. Paper, one pinhole, and a fifth of an inch of printed rule along two edges.\n\nYou put it back under the pin.';

const noticeBoard: ObjectDefSlice = {
  location: POST_OFFICE,
  name: 'notice board',
  portable: false,
  // "corner"/"paper" moved to the sub-part below.
  nouns: ['board', 'cork board', 'corkboard', 'notice', 'notices', 'poster', 'posters', 'wanted', 'wanted poster', 'bulletin', 'pins', 'pin', 'pinhole', 'gap', 'rectangle', 'space', 'blank', 'heading'],
  handlers: [
    { verbs: [EXAMINE], effects: boardExamineEffects },
    { verbs: [READ, SEARCH], effects: [{ say: notesRule }, { if: { when: { flag: ACT2_CACHE_FOUND }, then: [{ set: [ACT2_SAW_REPAVING_NOTICE, true] }] } }] },
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

// D2-B — §10.1. A second `ProseRule`, above the shipped `formsText`, gated
// `{ flag: ACT2_STARTED }` (plan §2 D2's own table entry for this file).
const act2FormsText =
  'A wooden rack of them, four deep. Change of address. Hold mail. Redirect to a\ntemporary address. Application for a post-office box, with a line for two\nforms of identification and a line under that for a witness.\n\nAnd, folded in behind all of it where the rack meets the wall, a short stack of\nthe plainest thing the government makes: a sheet of paper with a printed rule\ndown one side, an aerogramme fold marked in dots, and no line at the top for\nanything.\n\nThey are for people with something to say and no letterhead to say it on.\nThere is a pen on a chain nine inches away.';

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
  handlers: [
    {
      verbs: [EXAMINE, READ, TAKE],
      effects: [{ say: [{ when: { flag: ACT2_STARTED }, text: act2FormsText }, { text: formsText }] }],
    },
  ],
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
  [ACT4_VISIT_NOTICE]: noticeBoardVisitNotice,
  [SERVICE_COUNTER]: serviceCounter,
  [MAIL_DROP]: mailDrop,
  [MAIL_DROP_FORMS]: mailDropForms,
  [LOBBY_BENCH]: lobbyBench,
  [POST_OFFICE_NO_EXIT_GATE]: postOfficeNoExitGate,
} satisfies Record<string, ObjectDefSlice>;

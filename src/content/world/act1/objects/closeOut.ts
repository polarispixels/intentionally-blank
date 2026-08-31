// Act I Wave 5 — the Close-out
// (`docs/superpowers/specs/2026-09-06-act1-wave5-close-out-prose.md`
// §8-§10). Prose transcribed exactly (hard rule 5). One file for all seven
// close-out objects (§10's Your Room objects plus §8/§9's P7/P8 items) —
// not split by room, since none of the seven needs enough of its own
// apparatus to earn a separate module, and keeping them together keeps the
// chain (chair → leg → drawer → envelope/matchbook; strips → work order →
// keys → box → polaroids/ticket) readable as one sequence. Say-so per this
// task's own brief.
//
// TABLE-IN-SCOPE (§8.1's ruling): the `Cond` DSL (`engine/cond.ts`) has no
// "any object with noun X in scope" primitive — only room/flag/clue/etc.
// checks. The doc's own check ("any visible object with noun `table`") is
// true of exactly four rooms (`your_room`'s desk, `jacks_motel`'s table,
// `sundown_diner`'s counter, `county_library`'s table) and false everywhere
// else in this build, so `TABLE_IN_SCOPE` below is authored as the room
// whitelist that is, in this content, extensionally identical to the real
// check — flagged for the architect if a genuine scope-query `Cond` is ever
// wanted. `motel_unit`, `diner_counter` and `catalogue_terminal` each gain
// a "table" noun (see `objects/jacksMotel.ts`, `objects/sundownDiner.ts`,
// `objects/countyLibrary.ts`) so the noun is real in the world even though
// this `Cond` doesn't actually query it.
//
// ASSEMBLE STRIPS / READ STRIPS (§8's whole P7 flow): `SHREDDED_STRIPS`
// (the object `ASSEMBLE`/`READ` need a dobj to resolve to) belongs to the
// concurrent Nolan's Yard task's own module (`objects/nolansYard.ts`) — not
// in this task's file list. `TABLE_IN_SCOPE`, `ASSEMBLE_REFUSAL_TEXT`,
// `ASSEMBLE_SUCCESS_TEXT` and `ASSEMBLE_SUCCESS_EFFECTS` are exported here
// and imported directly by that object's own handler (`objects/
// nolansYard.ts`'s `shreddedStrips`, whose own comment explicitly left this
// wiring for this task to add) — a small, targeted addition to that
// object's `handlers` array, not a redesign of the yard; see this task's
// report.

import type { Cond } from '../../../../engine/cond';
import type { Effect } from '../../../../engine/effects';
import type { ProseRule } from '../../../../engine/prose';
import type { ObjectDefSlice } from '../../../../engine/world';
import { BREAK, EXAMINE, OPEN, PULL, READ, SEARCH, TAKE } from '../verbs';
import {
  CASH_ENVELOPE,
  CHAIR_LEG,
  CLAIM_TICKET,
  CLUE_CLAIM_TICKET,
  CLUE_INTACT_POLAROIDS,
  CLUE_PAID_IN_CASH,
  CLUE_S6_REVOKED,
  COUNTY_LIBRARY,
  DRAWER,
  FLAG_ASSEMBLED_STRIPS,
  FLAG_MET_JACK,
  INTACT_POLAROIDS,
  JACKS_MOTEL,
  MATCHBOOK,
  QUESTION_WALL_DRUG,
  ROOM_CHAIR,
  SUNDOWN_DINER,
  V_COUNT,
  WORK_ORDER,
  YOUR_ROOM,
} from '../ids';

// ---------------------------------------------------------------------------
// §8 — ASSEMBLE STRIPS' table-in-scope check, and its two responses. See
// this file's header for why the object-level wiring itself is not here.
// ---------------------------------------------------------------------------

export const TABLE_IN_SCOPE: Cond = { any: [{ at: YOUR_ROOM }, { at: JACKS_MOTEL }, { at: SUNDOWN_DINER }, { at: COUNTY_LIBRARY }] };

export const ASSEMBLE_REFUSAL_TEXT =
  'Not out here. Cross-cut strips go back together on a flat surface, in still air, with the light coming from one side, and this county has wind in it in every direction you can face.\n\nSomewhere with a table.';

export const ASSEMBLE_SUCCESS_TEXT =
  'It takes a while, and the while is the point. The strips come out of the bundle in near enough the order they went into the machine, and a cross-cut shredder turns out to be a promise about how long you are prepared to sit there.\n\nWhat comes back is most of a form.';

export const ASSEMBLE_SUCCESS_EFFECTS: Effect[] = [
  { say: ASSEMBLE_SUCCESS_TEXT },
  { set: [FLAG_ASSEMBLED_STRIPS, true] },
  { move: [WORK_ORDER, 'inventory'] },
];

// ---------------------------------------------------------------------------
// §8.3 — the work order
// ---------------------------------------------------------------------------

const workOrderExamine =
  'A facility form, reassembled and held down by whatever is to hand. Preprinted in two colours on paper chosen to survive being filed. There is a department block, a routing line, a box for an authorising signature, and a diagonal band across the middle where the strips went somewhere else.\n\nWhoever signed it signed it in the part that is missing.';

const workOrderReadText =
  'The header is a form number and a revision date and nothing you can use.\n\nThree lines of the body survive:\n\n    S6      ACCESS REVOKED - J.\n    EFFECTIVE IMMEDIATELY. BADGE RETAINED AT GATE.\n    ROUTING: BOX 141\n\nUnder those, where somebody has to say why, there is a printed word and a blank after it, and the blank was never filled in.';

const workOrder: ObjectDefSlice = {
  location: 'nowhere', // granted by ASSEMBLE STRIPS' success effects
  name: 'work order',
  portable: true,
  nouns: ['work order', 'order', 'form', 'document', 'paper', 'sheet', 'facility form', 's6', 'routing'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: workOrderExamine }] },
    { verbs: [READ], effects: [{ say: workOrderReadText }, { grantClue: CLUE_S6_REVOKED }] },
  ],
};

// ---------------------------------------------------------------------------
// §9.4 — the Polaroids
// ---------------------------------------------------------------------------

const intactPolaroidsText =
  "Two Polaroids, the borders yellowed the same as the one on Jack's table, and neither of them light-struck.\n\nThe first is the porch. The same afternoon: the old man on the top step with his mouth open mid-sentence, the young man behind him with his chin on the old man's head, the girl on the step below with her heels in the grass, and two more at the right-hand edge, one laughing and one determinedly not.\n\nAnd on the left, where the white was, there is a man in his forties in a short-sleeved shirt, no hat, with one arm along the shoulders of the young man in front of him and a watch with a square face on the wrist of it. He has a wide face and a heavy jaw and grey coming in at one temple, and he is looking straight at whoever is holding the camera, and he is in the middle of finding something funny.\n\nThe second is a night sky over the same porch roof: the gutter line black across the bottom of the frame and everything above it out of focus, so that the stars come out as small soft discs of different sizes. Somebody held a camera up in the dark and pressed the button.\n\nNothing is written on either back.";

const intactPolaroids: ObjectDefSlice = {
  location: 'nowhere', // granted by the boxes' own OPEN/TURN/UNLOCK rule 1
  name: 'Polaroids',
  portable: true,
  nouns: ['polaroids', 'polaroid', 'photos', 'photographs', 'photo', 'photograph', 'pictures', 'picture', 'prints', 'print', 'sky', 'stars', 'porch'],
  handlers: [{ verbs: [EXAMINE, READ], effects: [{ say: intactPolaroidsText }, { grantClue: CLUE_INTACT_POLAROIDS }] }],
};

// ---------------------------------------------------------------------------
// §9.5 — the claim ticket
// ---------------------------------------------------------------------------

const claimTicketText =
  'A stub of card, perforated down one edge where its twin was torn off, printed in the same red and yellow as the cup.\n\n    WALL DRUG\n    HOLD FOR PICKUP\n    No. 4417\n\nNo date on it anywhere. No name. On the back there is a printed line where a depositor writes what he has left, and the line is empty.';

const claimTicket: ObjectDefSlice = {
  location: 'nowhere', // granted by the boxes' own OPEN/TURN/UNLOCK rule 1
  name: 'claim ticket',
  portable: true,
  nouns: ['ticket', 'claim ticket', 'stub', 'receipt', 'docket', 'wall drug', 'walldrug'],
  handlers: [
    {
      verbs: [EXAMINE, READ],
      effects: [{ say: claimTicketText }, { grantClue: CLUE_CLAIM_TICKET }, { openQuestion: QUESTION_WALL_DRUG }],
    },
  ],
};

// ---------------------------------------------------------------------------
// §10.1 — the chair (P2), Your Room
// ---------------------------------------------------------------------------

const chairExamine =
  'A plain wooden chair, the kind that comes with a desk in a rented room, on its side by the wall where it went when the desk did.\n\nIt has been sat on by strangers for forty years and it is coming apart the way they do — glue gone, joints working. One of the back legs is out of its socket altogether and lying along the seat, held on by nothing but the stretcher.\n\nIt is a yard of hard maple with a taper on it.';

const takeLegText =
  'The stretcher comes out of its hole with a noise like a knuckle, and the leg is yours.\n\nIt is heavier at one end. You turn it round once to find out which end, the way anybody would.';

const takeLegEffects: Effect[] = [{ say: takeLegText }, { move: [CHAIR_LEG, 'inventory'] }];

const roomChair: ObjectDefSlice = {
  location: YOUR_ROOM,
  name: 'chair',
  portable: false, // see the leg
  nouns: ['chair', 'seat', 'stool', 'legs', 'leg', 'rung', 'stretcher', 'dowel', 'joint', 'back', 'spindle'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: chairExamine }] },
    // "take leg"/"pull leg"/"break chair"/"take chair" (§10.1) all share one response.
    { verbs: [TAKE, PULL, BREAK], effects: takeLegEffects },
  ],
};

// The leg itself — no examine authored (§18's wiring table: "it is a chair
// leg and the taking response describes it"). Starts `location: 'nowhere'`,
// granted by `roomChair`'s own TAKE/PULL/BREAK handler above.
const chairLeg: ObjectDefSlice = {
  location: 'nowhere',
  name: 'chair leg',
  portable: true,
  nouns: ['leg', 'chair leg'],
};

// ---------------------------------------------------------------------------
// §10.3 — the envelope
// ---------------------------------------------------------------------------

const cashEnvelopeExamine =
  'A brown pay envelope with the flap tucked in rather than gummed, soft at the corners from having been carried in a pocket.\n\nIt is thick. Not a wallet\'s thickness — the thickness paper gets to when nobody counted it out for a machine.';

const cashEnvelopeOpenText: ProseRule[] = [
  {
    when: { flag: FLAG_MET_JACK },
    text:
      'Used notes, more than one denomination, all stacked the same face up, the way a man sorts money that came out of a tin rather than out of a wall.\n\nNothing is written on the envelope. No name, no hand, no mark of any kind.\n\nCash, weekly, and whatever it costs you. He said that four hours ago across a table, and here is the rest of the sentence, in a drawer, under a splinter.',
  },
  {
    text:
      'Used notes, more than one denomination, all stacked the same face up, the way a man sorts money that came out of a tin rather than out of a wall.\n\nNothing is written on the envelope. No name, no hand, no mark of any kind.\n\nSomebody paid you in a currency that does not keep records, and did not put themselves anywhere near it.',
  },
];

const cashEnvelope: ObjectDefSlice = {
  location: { in: DRAWER },
  name: 'envelope',
  portable: true,
  nouns: ['envelope', 'packet', 'pay envelope', 'cash', 'money', 'notes', 'bills', 'wad', 'wages'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: cashEnvelopeExamine }] },
    // "open envelope"/"read envelope"/"count money"/"look in envelope" (§10.3) share one response.
    { verbs: [OPEN, READ, V_COUNT, SEARCH], effects: [{ say: cashEnvelopeOpenText }, { grantClue: CLUE_PAID_IN_CASH }] },
  ],
};

// ---------------------------------------------------------------------------
// §10.4 — the matchbook
// ---------------------------------------------------------------------------

const matchbookText =
  'A book of matches, the cover folded back and creased flat the way people do when they are thinking about something else.\n\n    THE ARROWHEAD\n    MOTEL\n    VACANCY\n\nThe matches are all still in it. The striker on the back has been used exactly once, at one corner, by somebody who then did not light anything.';

const matchbook: ObjectDefSlice = {
  location: { in: DRAWER },
  name: 'matchbook',
  portable: true,
  nouns: ['matchbook', 'matches', 'match', 'book of matches', 'matchbox', 'striker', 'cover'],
  handlers: [{ verbs: [EXAMINE, READ], effects: [{ say: matchbookText }] }],
};

export const CLOSE_OUT_OBJECTS: Record<string, ObjectDefSlice> = {
  [WORK_ORDER]: workOrder,
  [INTACT_POLAROIDS]: intactPolaroids,
  [CLAIM_TICKET]: claimTicket,
  [ROOM_CHAIR]: roomChair,
  [CHAIR_LEG]: chairLeg,
  [CASH_ENVELOPE]: cashEnvelope,
  [MATCHBOOK]: matchbook,
} satisfies Record<string, ObjectDefSlice>;

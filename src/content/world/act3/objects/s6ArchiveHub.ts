// Act III, Stage D5, task G — the S6 Archive Hub's six objects (plus one
// sub-part), the terminal/ledger/graph/queue text, the gate frames and the
// root door, and the boundary's two in-world entry points
// (`docs/superpowers/specs/2026-09-13-stage-d5-prose.md` §21-§31, §39,
// §40). Every string below is transcribed exactly (hard rule 5); the two
// composed clue title/detail pairs (`act3_clue_gates`,
// `act3_clue_root_refuses`) live in `../knowledge.ts`, not here.
//
// The ledger, load graph and queue are `hidden: true` until
// `act3_hub_logged_in` (§21, §39.3) — `READ LEDGER` before login must reach
// the parser's ordinary unknown-noun response, not a teasing refusal.
//
// This file also amends four objects it does not own, in place, the same
// idiom `act2/objects/usb.ts` (D2 task A) used on D1's own `usb`
// (`cache.ts`): the badge's own reader refusal at this root door (§28.2),
// the USB's own dock refusal at this terminal (§29), and the audit/
// notebook's own `COMPARE ... WITH GRAPH` handlers (§24.3/§24.4). Nothing
// in `act2/nolan.ts`, `act2/objects/cache.ts`, `act2/objects/censor.ts` or
// `act2/objects/notebook.ts` is edited — this file imports the shared
// mutable objects and pushes its own handlers onto their existing arrays.

import type { Effect } from '../../../../engine/effects';
import type { HandlerDef, ObjectDefSlice } from '../../../../engine/world';
import type { ProseRule } from '../../../../engine/prose';
import type { Cond } from '../../../../engine/cond';
import { DIRECTION_VERB_IDS, USE_VERB_ID } from '../../../../engine/move';
import {
  BREAK,
  EXAMINE,
  LISTEN,
  LOOK_UNDER,
  OPEN,
  PRY,
  PULL,
  PUSH,
  PUT_IN,
  PUT_ON,
  READ,
  SEARCH,
  SHOW,
  TOUCH,
  TURN_OFF,
  UNLOCK,
} from '../../act1/verbs';
import { CHAIR_LEG, V_KNOCK, V_UNPLUG } from '../../act1/ids';
import { ACT2_DAD_BOOTED, ACT2_NOTEBOOK, ACT2_REPLY_AUDIT, ACT2_USB, V_FIT } from '../../act2/ids';
import { nolanBadge } from '../../act2/nolan';
import { usb } from '../../act2/objects/cache';
import { ACT2_CENSOR_OBJECTS } from '../../act2/objects/censor';
import { ACT2_NOTEBOOK_OBJECTS } from '../../act2/objects/notebook';
import {
  ACT3_CLUE_GATES,
  ACT3_CLUE_JULES_DEPRECATED,
  ACT3_CLUE_REACQUIRE,
  ACT3_CLUE_ROOT_REFUSES,
  ACT3_CLUE_TOWN_RUNS_HERE,
  ACT3_GATE_FRAMES,
  ACT3_HUB_LOGGED_IN,
  ACT3_HUB_LOGIN_OPEN_SCRIPT,
  ACT3_HUB_TERMINAL,
  ACT3_HUB_TERMINAL_SCREEN,
  ACT3_KNOWS_WHO_HIT_YOU,
  ACT3_LEDGER,
  ACT3_LEDGER_SEARCH_OPEN_SCRIPT,
  ACT3_LOAD_GRAPH,
  ACT3_Q_WHAT_ARE_THESE_PEOPLE,
  ACT3_Q_WHO_HIT_YOU,
  ACT3_QUEUE,
  ACT3_ROOT_DOOR,
  ACT3_S6_ARCHIVE_HUB,
  ACT3_S6_BOUNDARY_GATE,
} from '../ids';
// E0 task K (§16-§18, §22, §31) — the numeral search, R13's own object, and
// the Act IV boundary variant. `act4_profile` is namespaced `act4_*` per
// `act4/ids.ts`'s own header rule even though its `ObjectDefSlice` lives
// here (the plan's own note on the evidence bag applies identically).
import { ACT4_CLUE_FILED_UNDER_ONE, ACT4_NUMERAL_SEARCHED, ACT4_PROFILE, ACT4_PROFILE_SCREEN_SCRIPT, ACT4_STARTED, V_ACT4_SELECT } from '../../act4/ids';
// E1 task M (`docs/superpowers/specs/2026-09-18-stage-e1-prose.md` §22,
// §29, §37.1) — R16, the reader at the bottom of the well, and the
// boundary's third arm.
import { ACT4_LUKE, ACT4_LUKE_AT_ROOT, ACT4_LUKE_MET } from '../../act4/ids';
import { ACT4_LUKE_AT_ROOT_EFFECTS } from '../../act4/luke';

// ---------------------------------------------------------------------------
// §22 — the terminal. `portable: false`.
// ---------------------------------------------------------------------------

const TERMINAL_EXAMINE_NOT_LOGGED_IN =
  "The same machine. Beige gone the colour of weak tea, a screen with real depth\nto it, keys worn blank in exactly the places a person's fingers live.\n\nThis one is on, and has been for a long time. There is warmth coming off the\ntop of the case and the smell of hot dust off the vents, and if you put a hand\nnear the glass the hairs on the back of it stand up.\n\nOn the screen, in the middle of nothing:\n\n    USER:\n\nand a cursor, blinking at about the rate of a resting heart.";

const TERMINAL_EXAMINE_LOGGED_IN =
  'The same tea-coloured machine, awake, warm, and no longer asking.\n\nThe cord goes out of the back of it into a trunking on the wall, and the\ntrunking goes along and down and into the floor, and there is a great deal of\nit.';

const TERMINAL_EXAMINE: ProseRule[] = [
  { when: { flag: ACT3_HUB_LOGGED_IN }, text: TERMINAL_EXAMINE_LOGGED_IN },
  { text: TERMINAL_EXAMINE_NOT_LOGGED_IN },
];

const TERMINAL_TURN_OFF_TEXT =
  'There is a switch on the case, in the family of switch you have already thrown\nonce this week, and it is the same quarter of an inch of honest travel.\n\nYou leave it. Whatever this thing is doing for the building, it has been doing\nit without interruption for longer than the paint in here has been on the\nwalls, and finding out what stops is not a thing you can find out twice.';

// §30.5 — "SEARCH BENCH"/"LOOK UNDER BENCH." `bench` is one of the
// terminal's own nouns (§22's own list), so this is the plain SEARCH verb
// on this object, same idiom as `s5ReactorInterface.ts`'s own bench.
const HUB_BENCH_TEXT =
  'A steel bench, bolted down, with nothing on it but the machine and nothing\nunder it but the trunking and a strip of the carpet that has never had a foot\non it.\n\nWhoever works at this bench does not put anything down and does not take\nanything out.';

// A short builder-authored connective (not in the doc) for a second LOG
// IN/TYPE/USE TERMINAL attempt once already logged in — flagged in this
// task's report. Exported so the room's own bare `V_TYPE_TERMINAL` handler
// (`../s6ArchiveHub.ts`) reuses the identical string rather than a second
// copy.
export const TERMINAL_ALREADY_LOGGED_IN_TEXT = 'The session is already open. ACCESS LEVEL: MAINTENANCE.';

const terminalHandlers: HandlerDef[] = [
  {
    verbs: [EXAMINE],
    effects: [
      { say: TERMINAL_EXAMINE },
      // E0 task K — §31.3's reveal timing: if the session was already open
      // when Act IV began, `act4_profile` is revealed on the next EXAMINE
      // TERMINAL (the login script, `../scripts.ts`, covers the other
      // case). Invisible — `reveal` prints nothing — so this is a no-op
      // before `act4_started`, and a no-op again once already revealed.
      { if: { when: { all: [{ flag: ACT4_STARTED }, { flag: ACT3_HUB_LOGGED_IN }] }, then: [{ reveal: ACT4_PROFILE }] } },
    ],
  },
  {
    verbs: [USE_VERB_ID],
    when: { not: { flag: ACT3_HUB_LOGGED_IN } },
    effects: [{ script: { id: ACT3_HUB_LOGIN_OPEN_SCRIPT } }],
  },
  { verbs: [USE_VERB_ID], effects: [{ say: TERMINAL_ALREADY_LOGGED_IN_TEXT }] },
  // §22.5 — "TURN OFF TERMINAL"/"UNPLUG TERMINAL." "unplug" is already
  // exclusively `V_UNPLUG`'s own word (act1/ids.ts, act1/verbs.ts) — no
  // mutation needed, just a second verb on this same handler.
  { verbs: [TURN_OFF, V_UNPLUG], effects: [{ say: TERMINAL_TURN_OFF_TEXT }] },
  { verbs: [SEARCH, LOOK_UNDER], effects: [{ say: HUB_BENCH_TEXT }] },
];

export const hubTerminal: ObjectDefSlice = {
  location: ACT3_S6_ARCHIVE_HUB,
  name: 'terminal',
  portable: false,
  nouns: ['terminal', 'computer', 'machine', 'monitor', 'keyboard', 'keys', 'cursor', 'bench', 'case'],
  handlers: terminalHandlers,
};

// §22.6 — "EXAMINE SCREEN"/"EXAMINE BURN," a sub-part (see `ids.ts`'s own
// header note on why this needs a second object: the engine can't tell
// which of an object's several nouns resolved a given verb, so two
// genuinely different EXAMINE answers need two objects).
const TERMINAL_SCREEN_TEXT =
  'No burn. The phosphor is even all the way across, and nothing has sat on this\nscreen long enough to leave a shape in it.\n\nThe machine in your room has USER: burned into it. This one has been busy.';

export const hubTerminalScreen: ObjectDefSlice = {
  location: ACT3_S6_ARCHIVE_HUB,
  name: 'screen',
  portable: false,
  nouns: ['screen', 'burn'],
  // READ too (v0.16.0 playtest): bare READ TERMINAL raised an engine [error]
  // (no text/description fallback).
  handlers: [{ verbs: [EXAMINE, READ], effects: [{ say: TERMINAL_SCREEN_TEXT }] }],
};

// ---------------------------------------------------------------------------
// §23 — the ledger. `portable: false`, revealed by login.
// ---------------------------------------------------------------------------

const LEDGER_READ_TEXT =
  '    SUBJECT LEDGER\n    ENTER SURNAME OR NUMERAL\n\nUnder the prompt, the ledger itself, because it is showing you the top of it\nwhile it waits.\n\nIt is a list. Surnames, sorted the way lists have been sorted since long before\nanybody had a machine to do the sorting, and a field after each one that holds\na single word. For line after line after line the single word is the same word,\nand the word is CURRENT.\n\nYou hold the key down and the names go up the screen. They are the names off\nthe hooks in the other room, and then they are names that were not on the\nhooks, and it does not stop, and you take your finger off it.';

export const LEDGER_JULES_TEXT =
  "    SEARCH: JULES\n\n    1 RESULT\n\n    SUBJECT JULES I ..................... DEPRECATED\n\nYou read that twice, which does not change it, and then you open it, which\ndoes.\n\n    SUBJECT JULES I\n\n    STATUS ............................ DEPRECATED\n    RECORDS ........................... RECONCILED\n    ASSOCIATIONS ...................... RECONCILED\n    SNAPSHOT .......................... ARCHIVED / ROOT\n\n    NO FURTHER ACTION\n\nThree weeks of somebody else's work, and a claim ticket, and a bin, and a\nbrother who could not get anybody to take him seriously, and a mile of tunnel\nin the dark.\n\nHe is here. He has been here the whole time, in a field, with a word in it.\n\nNobody took him anywhere.";

export const LEDGER_NOLAN_TEXT =
  '    SEARCH: NOLAN\n\n    1 RESULT\n\n    SUBJECT NOLAN R ....................... CURRENT\n\nYou do not open it. There is a man four rows into the next room with his boots\nset side by side under the footrest and you find you would rather not know what\nthe fields say about him.';

export const LEDGER_SELF_TEXT =
  'The cursor waits.\n\nYou get as far as the first letter of a word that is not a name, and stop, and\nthe cursor goes on waiting, because that is the one thing this machine has\nalways been good at.';

export const LEDGER_OTHER_TEXT =
  '    1 RESULT\n\nand after the name, in the field where a word goes, the word that is in that\nfield on every line but one.';

const LEDGER_PRINT_TEXT =
  'There is no printer on this bench and no port on this machine that a person\nbrought a cable for.\n\nYou write the one line down instead, in your own hand, on paper, which is the\nonly technology in this building that has been reliable all week.';

/** §23.2 — R10: grants the clue (which also answers the Jules question and P20/the archive-terminal question, all keyed off this same clue in `../knowledge.ts`). */
export const LEDGER_JULES_EFFECTS: Effect[] = [{ say: LEDGER_JULES_TEXT }, { grantClue: ACT3_CLUE_JULES_DEPRECATED }];
/** §23.3 — declines to open Nolan's file. Costs no state. */
export const LEDGER_NOLAN_EFFECTS: Effect[] = [{ say: LEDGER_NOLAN_TEXT }];
/** §23.4 — SEARCH LEDGER FOR ME/MYSELF/THE INVESTIGATOR (also the search-prompt's blank answer, §23.4's own "or nothing at all" reading of L4). */
export const LEDGER_SELF_EFFECTS: Effect[] = [{ say: LEDGER_SELF_TEXT }];
/** §23.5 — any other name the player knows. */
export const LEDGER_OTHER_EFFECTS: Effect[] = [{ say: LEDGER_OTHER_TEXT }];

// ---------------------------------------------------------------------------
// E0 task K — §16, the ledger's numeral branch. Gated `{ flag: act4_started
// }` in the script that reads these (`act3LedgerSearchRespond`,
// `../scripts.ts`); before Act IV a numeral falls to `LEDGER_OTHER_EFFECTS`
// above, exactly as shipped.
// ---------------------------------------------------------------------------

/** §16.1 — `I`/`1`/`ONE`. */
export const LEDGER_NUMERAL_ONE_TEXT =
  '    SEARCH: I\n\n    2 RESULTS\n\n    SUBJECT JULES I ..................... DEPRECATED\n    SUBJECT [UNRESOLVED] ................ MAINTENANCE\n\nThe first line you have read before and it has not improved.\n\nThe second is filed under the same numeral, at the level you are logged in at,\nand in the field where a name goes the machine has put what it puts when there\nis not one.';

/** §16.2 — `IV`/`4`/`FOUR`. The Nolan idiom reused (*you do not open it*), a different reason underneath: with Nolan it was not wanting to know, with Jack it is already knowing. */
export const LEDGER_NUMERAL_FOUR_TEXT =
  '    SEARCH: IV\n\n    1 RESULT\n\n    SUBJECT JACK IV ....................... CURRENT\n\nYou do not open it. You have already read what is queued against it in the\nother room, and opening the file would only be reading that again with his name\non the top of it.';

/** §16.1 — sets `act4_numeral_searched`, grants `act4_clue_filed_under_one`. The screen block and the two paragraphs are one response; nothing else fires this turn. */
export const LEDGER_NUMERAL_ONE_EFFECTS: Effect[] = [
  { say: LEDGER_NUMERAL_ONE_TEXT },
  { set: [ACT4_NUMERAL_SEARCHED, true] },
  { grantClue: ACT4_CLUE_FILED_UNDER_ONE },
];

/** §16.2 — no flag, no clue: Jack's row is read, not investigated. */
export const LEDGER_NUMERAL_FOUR_EFFECTS: Effect[] = [{ say: LEDGER_NUMERAL_FOUR_TEXT }];

const ledgerHandlers: HandlerDef[] = [
  { verbs: [READ, EXAMINE], effects: [{ say: LEDGER_READ_TEXT }] },
  { verbs: [SEARCH], effects: [{ script: { id: ACT3_LEDGER_SEARCH_OPEN_SCRIPT } }] },
];

export const ledger: ObjectDefSlice = {
  location: ACT3_S6_ARCHIVE_HUB,
  hidden: true,
  name: 'ledger',
  portable: false,
  nouns: ['ledger', 'archive', 'subjects', 'subject ledger', 'list', 'names', 'records', 'record'],
  handlers: ledgerHandlers,
};

export { LEDGER_PRINT_TEXT };

// ---------------------------------------------------------------------------
// §24 — the load graph. `portable: false`, revealed by login.
// ---------------------------------------------------------------------------

const GRAPH_READ_ALONE_TEXT =
  '    ALLOCATION, ROLLING\n\n    #######  #######  #######  #######  ######\n    #######  #######  #######  #######  ######\n    #######  #######  #######  #######  ######\n    ##########################################\n    ##########################################\n    ##########################################\n\nThere is a scale up the left-hand side with figures on it and no unit anywhere,\nwhich you have met before this week, on a sheet of paper, in a good upright\nhand.\n\nIt is a block with notches taken out of the top of it. The notches are evenly\nspaced and there is one for every day the screen is prepared to show you.\n\nWhatever this is a picture of, it goes down a little at the same time every\nnight, and comes back up.';

const GRAPH_AXIS_TEXT =
  'The figures up the side go from nothing at the bottom to a number at the top\nthat you have also met this week, in the same hand, at the head of a column\nsomebody had sat with for four days.\n\nThere is no key, no title beyond the two words at the top, and nothing on the\nscreen that says what is being allocated or to whom.';

export const GRAPH_COMPARE_AUDIT_TEXT =
  "You hold Eli's second sheet flat against the glass, which is not how anybody\nintended either of these things to be used, and slide it until his FILED column\nsits on the scale.\n\nFour hundred and sixty. It comes out about a third of the way up.\n\n    ALLOCATION, ROLLING\n\n    #######  #######  #######  #######  ######\n    #######  #######  #######  #######  ######\n    #######  #######  #######  #######  ######\n    ----------------------------------------- 460\n    ##########################################\n    ##########################################\n\nEverything under that line is the building upstairs. A data hall of that\nfootprint, doing what a data hall of that footprint does, which it does at the\nsame rate at four in the morning as it does at noon, because that is what\nmachines are.\n\nEverything over the line is the part nobody filed for.\n\nAnd every notch is above the line.\n\nThe part of this that goes to sleep at night is not the part with the machines\nin it.";

const GRAPH_COMPARE_NOTEBOOK_TEXT =
  '*Why is there a second chilled-water return?*\n\nBecause of the top half of this picture. You could not prove that to anybody\nand you are not going to be asked to.';

const GRAPH_READ_AGAIN_TEXT =
  '    ALLOCATION, ROLLING\n\nThe notches are where they were. They are going to be there tomorrow night,\nand the night after, and the trace runs off the right-hand edge of the screen\nbecause the screen is only as wide as it is.';

const GRAPH_READ_PROSE: ProseRule[] = [
  { when: { clue: ACT3_CLUE_TOWN_RUNS_HERE }, text: GRAPH_READ_AGAIN_TEXT },
  { text: GRAPH_READ_ALONE_TEXT },
];

/** §24.3 — R11: grants the clue and opens the Act IV question. */
export const GRAPH_COMPARE_AUDIT_EFFECTS: Effect[] = [
  { say: GRAPH_COMPARE_AUDIT_TEXT },
  { grantClue: ACT3_CLUE_TOWN_RUNS_HERE },
  { openQuestion: ACT3_Q_WHAT_ARE_THESE_PEOPLE },
];

const graphHandlers: HandlerDef[] = [
  { verbs: [READ, EXAMINE], effects: [{ say: GRAPH_READ_PROSE }] },
  { verbs: [SEARCH], effects: [{ say: GRAPH_AXIS_TEXT }] },
];

// §24.2's "CHANGE SCALE"/"LOOK AT AXIS" is `V_ACT3_GRAPH_AXIS`, a bare `'V'`
// fixed phrase (no addressable noun of its own) — bare verbs never reach an
// OBJECT's own `handlers` (`actions.ts`'s `performAction`: a bare verb with
// no `dobj` only ever consults the room's own `handlers`), so its real
// handler lives on the Hub room, not here (`../s6ArchiveHub.ts`). Exported
// so that file can reuse this exact text rather than a second copy.
export { GRAPH_AXIS_TEXT };

export const loadGraph: ObjectDefSlice = {
  location: ACT3_S6_ARCHIVE_HUB,
  hidden: true,
  name: 'load graph',
  portable: false,
  nouns: ['graph', 'load', 'curve', 'chart', 'trace', 'allocation', 'plot', 'screen'],
  handlers: graphHandlers,
};

// ---------------------------------------------------------------------------
// §25 — the queue. `portable: false`, revealed by login.
// ---------------------------------------------------------------------------

export const QUEUE_READ_TEXT =
  "    RECONCILIATION - PENDING\n\n    NOLAN, R ................ MAINTENANCE, ROUTINE\n    JACK IV ................. MEMORY RECONCILIATION\n    SUBJECT [UNRESOLVED] .... RE-ACQUIRE\n                              LAST KNOWN: MAIN ST / TOP FLOOR REAR\n\nThe first line is a man asleep in a chair in the next room, and it is the least\nof the three.\n\nThe second one is your client. Somebody has put a job in for him. It is the\nsame job that has already been done to a file that says RECONCILED in two\nplaces, and it has not been done yet.\n\nThe third line is the one with the address on it.\n\n*Top floor, back. Three weeks, you've had it.*";

const QUEUE_READ_AGAIN_TEXT =
  '    RECONCILIATION - PENDING\n\nThree lines, in the same order, and the order is not urgency, because the\nroutine one is at the top.\n\nIt is a list of jobs, on a board, in a workshop, and somebody comes and takes\nthe top one.';

export const QUEUE_EDIT_REFUSED_TEXT =
  'The cursor does not move off the line it is on. There is nothing on this screen\nthat takes an instruction; it is a list somebody else writes and you are logged\nin at the level of a man who is allowed to look at it.\n\nMaintenance, it said. That is the whole of what you are.';

export const QUEUE_SEARCH_JULES_TEXT =
  'He is not on it. There is nothing pending for him and there is nothing pending\nabout him, and that is not a mercy, that is what a finished job looks like.';

const QUEUE_READ_PROSE: ProseRule[] = [
  { when: { flag: ACT3_KNOWS_WHO_HIT_YOU }, text: QUEUE_READ_AGAIN_TEXT },
  { text: QUEUE_READ_TEXT },
];

/**
 * §25.1 — R12: the screen block and the narrator's paragraphs are one
 * response; grants the clue, sets the flag, answers *who hit you*. M16
 * fires ambiently as the next event (§39.3's own ordering note) — nothing
 * here calls it explicitly.
 */
export const QUEUE_READ_EFFECTS: Effect[] = [
  { say: QUEUE_READ_PROSE },
  { grantClue: ACT3_CLUE_REACQUIRE },
  { set: [ACT3_KNOWS_WHO_HIT_YOU, true] },
  { answerQuestion: ACT3_Q_WHO_HIT_YOU },
];

const queueHandlers: HandlerDef[] = [{ verbs: [READ, EXAMINE], effects: QUEUE_READ_EFFECTS }];

export const queue: ObjectDefSlice = {
  location: ACT3_S6_ARCHIVE_HUB,
  hidden: true,
  name: 'queue',
  portable: false,
  nouns: ['queue', 'reconciliation', 'pending', 'list', 'jobs', 'work', 'actions', 'next'],
  handlers: queueHandlers,
};

// ---------------------------------------------------------------------------
// §27 — the gate frames. `portable: false`, examine only, plus the
// boundary's first entry point (§31.1).
// ---------------------------------------------------------------------------

const GATE_EXAMINE_TEXT =
  'Openings in the left-hand wall, formed in the concrete, door height and a\nlittle wider than a door, and there is nothing hung in any of them: no leaf, no\nframe within the frame, no hinge, no keep, no threshold strip.\n\nOver the first, a strip of engraved plastic on two screws:\n\n    ESCAPE RM\n\nBehind that one there is light. Not much — the amount of light a room has when\nsomething in it is on standby — and no shape you can resolve in it, and no\ndepth. You are not looking into a room. You are looking at the place a room\nwould start.\n\nOver the second:\n\n    HAB\n\nBehind it, nothing. Not dark the way a dark room is dark. Dark the way a screen\nis dark.\n\nThe rest have the slot for a strip and no strip in the slot, and behind them it\nis the same nothing.';

const GATE_TOUCH_TEXT =
  'You put a hand into the opening, which takes more than you were expecting it\nto.\n\nNothing. Air, at the temperature of the room. Your arm goes in to the elbow and\ncomes out again with your hand still on the end of it.';

const GATE_LOOK_BEHIND_TEXT =
  'The wall is a wall on both sides of them and above them, and there is no\nthickness to any of it that a doorway could go through. You put a palm flat\nbetween the first and the second and it is block, painted, cold, and solid.\n\nThe frames are not holes in this wall. They are in it.';

const GATE_READ_LEGENDS_TEXT =
  "Engraved plastic, white on black, two screws each, in the same lettering as\nevery legend strip in this building — the S6 door's, the aisle signs upstairs,\nthe tag on a bypass switch on the reactor floor.\n\nSomebody in a workshop made these on the same machine as those, and screwed\nthem up over these, and thought no more about it.";

const GATE_ENTER_TEXT =
  'You put a hand on the edge of the frame, and then a foot over the sill, and the\nfloor on the other side of it is a floor.';

/** §31.3 — the one system line, both entry points (§36 q10). Concatenated onto the in-world text below, same "content-only approximation" idiom `pipeChase.ts`'s own `CHASE_BOUNDARY_TEXT` uses (a `blockedText`/`say` always renders `kind: 'prose'`, never `kind: 'system'` — `effects.ts`). */
const SYSTEM_BOUNDARY_TEXT =
  'END OF BUILD\n\nAct III ends here. What is through the frames, and what is under the door at\nthe end of this room, are the next version.';

// E0 task K — §22, the Act IV boundary line, confirmed at §28 q7: names no
// act, replaces canon 88's line for `act4_started` saves only.
const SYSTEM_BOUNDARY_TEXT_ACT4 =
  'END OF BUILD\n\nThe frames, and the door at the bottom of the well, are later versions. The\nstreet, the sheriff, the ledger and the man who is coming are this one.';

// E1 task M — §29, the E1 line: a THIRD arm, above E0's, gated
// `act4_luke_met`. Deleted with its gate in E3 (§29's own note).
const SYSTEM_BOUNDARY_TEXT_ACT4_E1 =
  'END OF BUILD\n\nThe frames, and the door at the bottom of the well, are later versions. The\nstair behind the door on Sublevel 5 is this one.';

/**
 * Both entry points share this selection — the in-world sentence is
 * unchanged; only the system line following it is gated. Three arms, in
 * order (§29, §37.1): `act4_luke_met` (E1), then `act4_started` (E0, still
 * rendering for a player who has started Act IV and not yet met him), then
 * canon 88's shipped Act III line.
 */
const boundaryRules = (inWorldText: string): ProseRule[] => [
  { when: { flag: ACT4_LUKE_MET }, text: `${inWorldText}\n\n${SYSTEM_BOUNDARY_TEXT_ACT4_E1}` },
  { when: { flag: ACT4_STARTED }, text: `${inWorldText}\n\n${SYSTEM_BOUNDARY_TEXT_ACT4}` },
  { text: `${inWorldText}\n\n${SYSTEM_BOUNDARY_TEXT}` },
];

export const GATE_ENTER_BOUNDARY_TEXT: ProseRule[] = boundaryRules(GATE_ENTER_TEXT);

const gateFramesHandlers: HandlerDef[] = [
  { verbs: [EXAMINE], effects: [{ say: GATE_EXAMINE_TEXT }, { grantClue: ACT3_CLUE_GATES }] },
  { verbs: [TOUCH], effects: [{ say: GATE_TOUCH_TEXT }, { grantClue: ACT3_CLUE_GATES }] },
  { verbs: [LOOK_UNDER], effects: [{ say: GATE_LOOK_BEHIND_TEXT }] },
  { verbs: [READ], effects: [{ say: GATE_READ_LEGENDS_TEXT }] },
  // §27.5/§31.1 — "ENTER GATE"/"GO THROUGH FRAME"/"ENTER ESCAPE ROOM"/"ENTER
  // HAB": `IN` already carries "enter"/"go through" as words (`act1/
  // verbs.ts`), and this object's own handler wins outright over
  // `traverseDoor`'s door-by-name check (`respond.ts`), since this object is
  // never any exit's `door` — the boundary lives entirely in this handler,
  // no `goto`, so the player stays in the Hub.
  { verbs: [DIRECTION_VERB_IDS.in], effects: [{ say: GATE_ENTER_BOUNDARY_TEXT }, { grantClue: ACT3_CLUE_GATES }] },
];

export const gateFrames: ObjectDefSlice = {
  location: ACT3_S6_ARCHIVE_HUB,
  portable: false,
  name: 'gate frames',
  nouns: ['gate', 'gates', 'frame', 'frames', 'opening', 'openings', 'doorway', 'doorways', 'legend', 'legends', 'strip', 'strips', 'escape', 'hab', 'escape room'],
  handlers: gateFramesHandlers,
};

// ---------------------------------------------------------------------------
// §28 — the root door, and the boundary's second entry point (§31.2).
// ---------------------------------------------------------------------------

const ROOT_DOOR_EXAMINE_TEXT =
  'Three steps down into a well at the end of the room, tiled on all four sides,\nwith a drain in the bottom of it and the carpet stopping in a metal edging at\nthe top step.\n\nAt the bottom of the well there is a door.\n\nIt is not the family of door fitted anywhere else in this building. It is\nthicker than the frame it stands in has any business carrying, hung on four\nhinges instead of three, and there is no handle on it, no window, no legend, no\nkick plate, no keyway, and no gap around the leaf that you could get a card\ninto.\n\nThere is a reader beside it, and there is no light in the reader at all.';

const ROOT_DOOR_BADGE_TEXT =
  'You put the badge on the reader.\n\nNothing. No diode, no beat while something somewhere agrees with something\nelse, no amber line, no NOLAN.\n\nAfter a moment you understand that it has not refused you. There is nothing in\nit. Whatever this reader is for, it has never been switched on, and every other\nreader in this building went green for a man asleep in the next room.';

const ROOT_DOOR_TERMINAL_ANSWERS_TEXT =
  'There is no pad on the door and no keyway in it, so you go back up the room and\nput it to the machine, which is the only thing down here that has ever\nanswered anything.\n\n    ACCESS LEVEL: MAINTENANCE\n    DENIED\n\nThe same two lines that were on a rubber keypad five floors up, at the same\nspeed, in a room where the same two words have already opened everything else\nthere is.\n\nThere is a level under this one. You are standing on the floor of the building,\nbelow the bottom of the building, and there is a level under this one.';

const ROOT_DOOR_KNOCK_TEXT = 'Your knuckles do not make a noise on it.\n\nThey make a smaller noise than they make on your own hand.';

const ROOT_DOOR_FORCE_TEXT =
  'There is nothing on this side to get hold of.\n\nThe chair leg has opened a drawer, a plate and a cam lock in a kerb, was the\nwrong shape once already this week at a steel door on Sublevel 5, and is the\nwrong shape again, in a way that is beginning to feel like a running joke\nsomebody else is telling.';

const ROOT_DOOR_LISTEN_TEXT =
  'Warm. Not hot — warm, on the face, at the height of your cheek, which is not\nwhat a door does.\n\nUnder the warmth, past it, a long way past it, water going through something at\na steady rate, and it is the only thing there is to hear, and it is the sound\nyou went to sleep to the first night you spent in this county with the window\nopen.';

const ROOT_DOOR_WELL_TEXT =
  'A drain in the bottom of a well at the foot of a door, in a room five floors\nunder the ground, in a building that has never once been flooded and does not\nsit on anything that could flood it.\n\nThe tiling in the well is newer than the tiling in the bay, and it is the same\ntile.';

const ROOT_DOOR_DOWN_TEXT =
  "Three steps, and a door that takes your knuckles and gives you nothing back,\nand behind it a level of a building that is not on any drawing anybody has ever\nshown you, with the whole of the county's water going through it.";

export const ROOT_DOOR_DOWN_BOUNDARY_TEXT: ProseRule[] = boundaryRules(ROOT_DOOR_DOWN_TEXT);

// §28's four refusals (badge/terminal/knock/push-pull-pry/listen) each
// grant the clue the first time any one of them is tried — idempotent
// (`grantClue` on an already-held clue is a no-op), so the exact order the
// player tries them in doesn't matter; builder's own reading of "the door
// refuses four ways" (§28's own header), flagged in this task's report.
// E1 task M, §22 — R16, above the shipped OPEN/UNLOCK refusal. Idempotent
// on `act4_luke_at_root` (also guarded by the Hub's own `onEnter`,
// `../s6ArchiveHub.ts`, the room shell — whichever trigger fires first wins;
// the other then finds the flag already set and falls through to the
// shipped refusal below, unchanged).
const lukeAtRootWhen: Cond = { all: [{ npcAt: [ACT4_LUKE, ACT3_S6_ARCHIVE_HUB] }, { not: { flag: ACT4_LUKE_AT_ROOT } }] };

const rootDoorHandlers: HandlerDef[] = [
  { verbs: [EXAMINE], effects: [{ say: ROOT_DOOR_EXAMINE_TEXT }] },
  { verbs: [OPEN, UNLOCK, USE_VERB_ID], when: lukeAtRootWhen, effects: ACT4_LUKE_AT_ROOT_EFFECTS },
  { verbs: [OPEN, UNLOCK], effects: [{ say: ROOT_DOOR_TERMINAL_ANSWERS_TEXT }, { grantClue: ACT3_CLUE_ROOT_REFUSES }] },
  { verbs: [V_KNOCK], effects: [{ say: ROOT_DOOR_KNOCK_TEXT }, { grantClue: ACT3_CLUE_ROOT_REFUSES }] },
  {
    verbs: [BREAK],
    withInstrument: [CHAIR_LEG],
    effects: [{ say: ROOT_DOOR_FORCE_TEXT }, { grantClue: ACT3_CLUE_ROOT_REFUSES }],
  },
  { verbs: [PUSH, PULL, PRY], effects: [{ say: ROOT_DOOR_FORCE_TEXT }, { grantClue: ACT3_CLUE_ROOT_REFUSES }] },
  { verbs: [LISTEN], effects: [{ say: ROOT_DOOR_LISTEN_TEXT }, { grantClue: ACT3_CLUE_ROOT_REFUSES }] },
  { verbs: [SEARCH, LOOK_UNDER], effects: [{ say: ROOT_DOOR_WELL_TEXT }] },
];

export const rootDoor: ObjectDefSlice = {
  location: ACT3_S6_ARCHIVE_HUB,
  portable: false,
  name: 'root door',
  nouns: ['door', 'root door', 'heavy door', 'well', 'steps', 'stair', 'bottom', 'reader', 'well drain'],
  handlers: rootDoorHandlers,
};

// §31 — the boundary's own gate object, referenced only by the well's
// `down` exit (`../s6ArchiveHub.ts`). Never opens (no `container`) — same
// minimal stub idiom `objects/coolingPlant.ts`'s own `boundaryGate` uses.
export const s6BoundaryGate: ObjectDefSlice = { location: ACT3_S6_ARCHIVE_HUB };

// ---------------------------------------------------------------------------
// §28.2 — `USE BADGE`/`SHOW BADGE TO READER` at the root door, amending
// `act2_nolan`'s badge object in place (same idiom as its own D3 route (a)
// handlers, `act2/nolan.ts`).
// ---------------------------------------------------------------------------

const alreadyWiredBadge = nolanBadge.handlers!.some((h) => Array.isArray(h.withInstrument) && h.withInstrument.includes(ACT3_ROOT_DOOR));
if (!alreadyWiredBadge) {
  nolanBadge.handlers!.push(
    { verbs: [USE_VERB_ID], when: { at: ACT3_S6_ARCHIVE_HUB }, effects: [{ say: ROOT_DOOR_BADGE_TEXT }, { grantClue: ACT3_CLUE_ROOT_REFUSES }] },
    { verbs: [SHOW], withInstrument: [ACT3_ROOT_DOOR], effects: [{ say: ROOT_DOOR_BADGE_TEXT }, { grantClue: ACT3_CLUE_ROOT_REFUSES }] },
  );
}

// ---------------------------------------------------------------------------
// §29 — Dad refuses the dock (canon 53), amending the shared `usb` object
// (`act2/objects/cache.ts`) in place, same idiom `act2/objects/usb.ts` uses
// for the opening room's terminal/the rig.
// ---------------------------------------------------------------------------

export const DAD_REFUSES_DOCK_TEXT =
  'You have the stick half out of the rig before he says anything, and then he\nsays it fast.\n\n"No."\n\nThen, in the ordinary voice, and sorry about the first one: "Look at what\nyou\'re stood in front of, kiddo. That machine is talking to something and\nneither of us knows what. The entire point of me being a thing in your pocket\nis that I am not on the end of a wire where somebody can go through me."\n\n"Put me back. I\'ll wait. Waiting is the one thing I\'m actually built for."';

const USB_NO_SOCKET_TEXT =
  'The socket is on the back of the case. The back of the case is two inches off\nthe wall, and the bench it stands on is steel and bolted through the floor at\nfour corners by somebody who never expected it to be moved.\n\nYou could get the stick in there. You would be doing it by feel, in the dark,\nbehind a machine that is running, in a room you are not supposed to be standing\nin.\n\nIt goes back in your pocket.';

const alreadyWiredUsb = usb.handlers!.some((h) => h.verbs.includes(PUT_IN) && Array.isArray(h.withInstrument) && h.withInstrument.includes(ACT3_HUB_TERMINAL));
if (!alreadyWiredUsb) {
  usb.handlers!.push(
    // Rule 1 — Dad running (§29.1). Must precede rule 2 (first match wins).
    { verbs: [PUT_IN], withInstrument: [ACT3_HUB_TERMINAL], when: { flag: ACT2_DAD_BOOTED }, effects: [{ say: DAD_REFUSES_DOCK_TEXT }] },
    // Rule 2 — not yet booted, just the bare stick (§29.2).
    { verbs: [PUT_IN], withInstrument: [ACT3_HUB_TERMINAL], effects: [{ say: USB_NO_SOCKET_TEXT }] },
  );
}
// `ACT2_USB` isn't referenced directly above (the shared `usb` object is
// amended by reference) — imported so `has: ACT2_USB`-style conds stay
// available to any sibling file reading this one; unused import removed if
// `noUnusedLocals` ever flags it (kept for now: `void` marks intent).
void ACT2_USB;

// ---------------------------------------------------------------------------
// §24.3/§24.4 — `COMPARE AUDIT WITH GRAPH`/`PUT AUDIT ON SCREEN`/`HOLD
// LETTER UP TO SCREEN` and `COMPARE NOTEBOOK WITH GRAPH`, amending the
// shared audit/notebook objects in place (`act2/objects/censor.ts`,
// `act2/objects/notebook.ts`).
// ---------------------------------------------------------------------------

const replyAudit = ACT2_CENSOR_OBJECTS[ACT2_REPLY_AUDIT]!;
const alreadyWiredAudit = replyAudit.handlers!.some((h) => Array.isArray(h.withInstrument) && h.withInstrument.includes(ACT3_LOAD_GRAPH));
if (!alreadyWiredAudit) {
  replyAudit.handlers!.push({ verbs: [V_FIT, PUT_ON], withInstrument: [ACT3_LOAD_GRAPH], effects: GRAPH_COMPARE_AUDIT_EFFECTS });
}

const notebook = ACT2_NOTEBOOK_OBJECTS[ACT2_NOTEBOOK]!;
const alreadyWiredNotebook = notebook.handlers!.some((h) => Array.isArray(h.withInstrument) && h.withInstrument.includes(ACT3_LOAD_GRAPH));
if (!alreadyWiredNotebook) {
  notebook.handlers!.push({
    verbs: [V_FIT],
    withInstrument: [ACT3_LOAD_GRAPH],
    when: { not: { has: ACT2_REPLY_AUDIT } },
    effects: [{ say: GRAPH_COMPARE_NOTEBOOK_TEXT }],
  });
}

// ---------------------------------------------------------------------------
// E0 task K — §18, R13's own object. `hidden: true`; revealed on login
// (`act3HubLoginRespond`, `../scripts.ts`) once `act4_started`, or on the
// next EXAMINE TERMINAL if the session was already open (this file's own
// terminal handler, above). Before either reveal, `READ PROFILE` (and every
// other verb below) must be the ordinary unknown-noun miss — nothing here
// does anything special; that is entirely `hidden`'s job. Not registered in
// `ACT3_S6_ARCHIVE_HUB_OBJECTS` below: per `act4/ids.ts`'s own header rule
// this id is namespaced `act4_*`, so it is wired into `WORLD.objects` from
// `act4/index.ts` instead (imported from here), the same "id lives in one
// act's namespace, the `ObjectDefSlice` lives where the room is" split the
// Stage E plan documents for the evidence bag.
// ---------------------------------------------------------------------------

export const act4Profile: ObjectDefSlice = {
  location: ACT3_S6_ARCHIVE_HUB,
  hidden: true,
  name: 'profile',
  portable: false,
  nouns: ['profile', 'heading', 'fourth heading', 'behavioral profile'],
  handlers: [{ verbs: [READ, OPEN, EXAMINE, V_ACT4_SELECT], effects: [{ script: { id: ACT4_PROFILE_SCREEN_SCRIPT } }] }],
};

// ---------------------------------------------------------------------------
// Export map (§21 — the Hub's own six objects, plus the terminal's screen
// sub-part and the boundary's one gate object).
// ---------------------------------------------------------------------------

export const ACT3_S6_ARCHIVE_HUB_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT3_HUB_TERMINAL]: hubTerminal,
  [ACT3_HUB_TERMINAL_SCREEN]: hubTerminalScreen,
  [ACT3_LEDGER]: ledger,
  [ACT3_LOAD_GRAPH]: loadGraph,
  [ACT3_QUEUE]: queue,
  [ACT3_GATE_FRAMES]: gateFrames,
  [ACT3_ROOT_DOOR]: rootDoor,
  [ACT3_S6_BOUNDARY_GATE]: s6BoundaryGate,
};

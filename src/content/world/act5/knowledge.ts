// Act V, wave E3 — shared state (`docs/superpowers/specs/2026-09-20-stage-e3-
// prose.md` §2). Written by the main session before the builders ran. Clue
// definitions (detail text is §2's, verbatim; titles composed from the
// granting section), question definitions, the four puzzles with §2's
// solution notes and §33's hint ladders are task W's — in labelled blocks
// below the anchor, with the Edit tool.

import type { WorldSlice } from '../game';
import {
  ACT5_BRANCH_UNLOCKED,
  ACT5_CACHED_FILM,
  ACT5_CACHED_LETTER,
  ACT5_CACHED_NOTEBOOK,
  ACT5_CACHED_USB,
  ACT5_INITIALIZED,
  ACT5_JULES_WOKEN,
  ACT5_OPENING_LOGIN_SEEN,
  ACT5_RECONCILIATION_RUNNING,
  ACT5_ROOT_ACCEPTED,
  ACT5_ROOT_DOOR_OPEN,
  ACT5_STARTED,
} from './ids';

export const ACT5_FLAGS: WorldSlice['flags'] = {
  [ACT5_BRANCH_UNLOCKED]: { default: false, doc: 'set by §3.2 (key) or §3.3 (leg); the tunnel down exit, P25 physical legs, the hatch open-state EXAMINE' },
  [ACT5_STARTED]: { default: false, doc: 'set by act5_ev_start (once, visited act5_root_shaft); act5_q_what_is_at_the_bottom openWhen' },
  [ACT5_ROOT_ACCEPTED]: { default: false, doc: 'set by act5_ante_login_respond (§12.2); the inner door open gate, P26 solvedWhen, the bottom question answer, Dad §13.1' },
  [ACT5_RECONCILIATION_RUNNING]: { default: false, doc: 'set in the same effects list as act5_root_accepted (§17); Custodian first schedule rule, act5_ev_reacquire, Jack offstage rule, act5_q_what_do_you_owe openWhen, §19 ladder arm, §27.2 second variant' },
  [ACT5_ROOT_DOOR_OPEN]: { default: false, doc: 'set by §16.2 (bolt drawn from the inside); Hub down exit + antechamber e exit through act5_well_door, the root door open-state arm. Permanent, two-way' },
  [ACT5_JULES_WOKEN]: { default: false, doc: 'set by act5_wake_jules (§24.3, once); P27 solvedWhen, §24.4 second read, the letter existing in the tray, §30.9 beat' },
  [ACT5_CACHED_NOTEBOOK]: { default: false, doc: 'set by act5_ev_locker on objectAt act2_notebook in act5_locker; §30.8 cache beat' },
  [ACT5_CACHED_FILM]: { default: false, doc: 'same, either the print or the undeveloped canister; §30.8 cache beat' },
  [ACT5_CACHED_USB]: { default: false, doc: 'same, act2_usb; §30.8 cache beat (§26.5 speaks only while Dad is on the rig in the room)' },
  [ACT5_CACHED_LETTER]: { default: false, doc: 'same, act5_letter_to_jack; §30.8 cache beat' },
  [ACT5_INITIALIZED]: { default: false, doc: 'set by act5_initialize_respond on yes (§31.2); P28 solvedWhen, act5_q_what_do_you_owe answer. Only ever read again from the ending slot (register 137; canon 99)' },
  [ACT5_OPENING_LOGIN_SEEN]: { default: false, doc: 'set by act5_opening_login_respond (§32.1); the §32.2 short variant. Stage F M21–M24 read it and nothing else does' },
};

// --- E3 builders append below this line (Edit tool only; one block per task, labelled) ---

// --- E3 task W — §2's six clues, three questions, four puzzles (P25–P28),
// §33's hint ladders. Clue `detail` text is §2's, verbatim; `title`s are
// composed from an exact clause of that same verbatim text (hard rule 5:
// never invent player-visible prose), sentence-cased, the same "quote the
// section's own line" idiom `act4/knowledge.ts`'s own clue titles use. No
// `missedRecovery`, no clock term on any puzzle (§2's own instruction). ---

import { ACT3_CLUE_JULES_DEPRECATED } from '../act3/ids';
import { ACT4_DEEP_INDEX, ACT4_S6_DOOR_OPEN } from '../act4/ids';
import { ACT2_NOTEBOOK } from '../act2/ids';
import {
  ACT5_BLANK_ROOM,
  ACT5_CLUE_ACCEPTED,
  ACT5_CLUE_JULES_SPOKE,
  ACT5_CLUE_KEY_NUMBER,
  ACT5_CLUE_LOCKER,
  ACT5_CLUE_MADE_BY_JULES,
  ACT5_CLUE_REVISION,
  ACT5_P25_WAY_DOWN,
  ACT5_P26_CONSOLE,
  ACT5_P27_JULES,
  ACT5_P28_CREATE,
  ACT5_Q_WHAT_DO_YOU_OWE,
  ACT5_Q_WHAT_IS_AT_THE_BOTTOM,
  ACT5_Q_WHO_IS_FILED_AT_ROOT,
  ACT5_ROOT_ANTECHAMBER,
} from './ids';

export const ACT5_E3_TASK_W_CLUES: NonNullable<WorldSlice['clues']> = {
  [ACT5_CLUE_KEY_NUMBER]: {
    title: '4471',
    detail:
      'There is a number stamped into the plate of a hatch in the wall of the service tunnel, twenty feet short of the plug.\n\n    4471\n\nThat is all this note is for.',
  },
  [ACT5_CLUE_REVISION]: {
    title: 'SYSTEM REVISION 2089.4',
    detail:
      'Sprayed through a stencil on the wall of the shaft, at head height, below the line where the poured concrete stops:\n\n    SYSTEM REVISION 2089.4\n\nThe paint has not aged and neither has the wall it is on.',
  },
  [ACT5_CLUE_ACCEPTED]: {
    title: 'ACCESS LEVEL: ROOT',
    detail:
      'admin / admin-password, typed into the console at the bottom of the shaft.\n\nRECOGNIZED. ACCESS LEVEL: ROOT. RECONCILIATION — RUNNING.\n\nThe machine in the rented room has been putting one extra word in front of the first of those since the morning I woke up, for a name, for a word, for nothing at all.',
  },
  [ACT5_CLUE_MADE_BY_JULES]: {
    title: 'AUTHOR: JULES I.',
    detail:
      'A creation record at root, and there is no date on it anywhere.\n\nAUTHOR: JULES I. OCCUPATION: INVESTIGATOR. INITIAL MEMORY STATE: INTENTIONALLY BLANK. STARTING ENVIRONMENT: MAIN ST / TOP FLOOR REAR. INITIAL PHYSICAL CONDITION: HEADACHE. PHYSICAL PARAMETERS: RANDOMIZED — 1 EXCEPTION, SUPPRESSED.\n\nThen a list of things placed in the room. A hat, worn. A lamp. A terminal. Page 7/8, in the hatband. A chair with one leg loose.\n\nWhere the designation goes there is a dash.',
  },
  [ACT5_CLUE_JULES_SPOKE]: {
    title: 'He left the name field empty on purpose',
    detail:
      'He is in the archive at root and he can be opened, once, and he answers in text.\n\nHe asked after Jack before he asked anything else. He said he lied to him at the door and would do it again for the same reason and is not asking to be told that was all right. He said he got as far as this room and worked out that there was no way to go through it and still be in the records on the other side. He said he left the name field empty on purpose and that it was not a kindness.\n\nHe dictated a letter and the printer ran.\n\nThen the field said ARCHIVED / ROOT again, and it will go on saying it.',
  },
  [ACT5_CLUE_LOCKER]: {
    title: 'Nothing in it and nothing written on it',
    detail:
      "A grey steel cabinet under the terminal's bench in the Blank Room, waist high, door standing open, nothing in it and nothing written on it.\n\nIt is below the level at which anything in this building is written down.",
  },
};

export const ACT5_E3_TASK_W_QUESTIONS: NonNullable<WorldSlice['questions']> = {
  [ACT5_Q_WHAT_IS_AT_THE_BOTTOM]: {
    text: 'What is at the bottom?',
    openWhen: { flag: ACT5_STARTED },
    answerWhen: { flag: ACT5_ROOT_ACCEPTED },
    answer:
      'One room, one console, and a login prompt of the kind that has been refusing you since the first morning. It does not refuse. It says RECOGNIZED, and then it says ROOT, and then it says that the job that was pending upstairs is no longer pending.',
  },
  [ACT5_Q_WHO_IS_FILED_AT_ROOT]: {
    text: 'SNAPSHOT: ARCHIVED / ROOT. Archived where, and can it be opened?',
    openWhen: { all: [{ clue: ACT3_CLUE_JULES_DEPRECATED }, { at: ACT5_BLANK_ROOM }] },
    answerWhen: { flag: ACT5_JULES_WOKEN },
    answer:
      'Here, on this machine, under his own numeral, in an index nobody has had a reason to open since the job was closed. It opens once. He is not rescued and does not ask to be. He asks after his brother, tells you what he did and why, and dictates a letter he cannot post.',
  },
  [ACT5_Q_WHAT_DO_YOU_OWE]: {
    text: 'What do you owe the next one?',
    openWhen: { flag: ACT5_RECONCILIATION_RUNNING },
    answerWhen: { flag: ACT5_INITIALIZED },
    answer:
      'Whatever is in the cabinet, which is the only thing at this level that is not addressable, plus a room with the same five things in it and a form filled in by somebody who had read it before.\n\nThe last one left a page in a hatband and a login in a back cover and could not get any further than the door. You got through the door.',
  },
};

export const ACT5_E3_TASK_W_PUZZLES: NonNullable<WorldSlice['puzzles']> = {
  [ACT5_P25_WAY_DOWN]: {
    id: ACT5_P25_WAY_DOWN,
    name: 'the way down',
    solvedWhen: { visited: ACT5_ROOT_ANTECHAMBER },
    onSolved: [],
    solutions: [
      {
        id: 'key',
        class: 'analytical',
        route: { flag: ACT5_BRANCH_UNLOCKED },
        note: 'UNLOCK HATCH WITH KEYRING, in the service tunnel, twenty feet short of the plug. The flat brass one with the squared bit — the one that opened the plate in the kerb on the county road.',
      },
      {
        id: 'pry',
        class: 'direct',
        route: { flag: ACT5_BRANCH_UNLOCKED },
        note: 'PRY HATCH WITH CHAIR LEG. There is a lip on the low side of the plate. The bolts are not what is holding it.',
      },
      {
        id: 'stair',
        class: 'social',
        route: { flag: ACT4_S6_DOOR_OPEN },
        note: 'GO DOWN the stair behind the door on Sublevel 5 — the one that wanted two things and got both of them off a man with a paper badge. It has been standing open since he went back up in the lift.',
      },
    ],
    hints: [
      'Every credential in this game has now been offered to that door and the best one in the country was offered to it last. The door is not the way.',
      'There are two ways down that are not a door and neither of them is clever. One of them is a stair that got opened for you and left open. The other is in a wall you have walked past in the dark with a light on your head.',
      'The tunnel: about twenty feet short of the plug, low down on the left, there is a steel hatch with a squared hole in the middle of it. You are carrying something with a squared bit on it and have been since the second week, and if you are not, you have been prying things open all week with something else.',
      'UNLOCK HATCH WITH KEYRING, or PRY HATCH WITH CHAIR LEG. Then DOWN, and go on going down. If you took the visit as far as Sublevel 5, GO DOWN the stair behind the two-thing door instead; it comes out in the same shaft.',
    ],
  },
  [ACT5_P26_CONSOLE]: {
    id: ACT5_P26_CONSOLE,
    name: 'the root console',
    question: ACT5_Q_WHAT_IS_AT_THE_BOTTOM,
    solvedWhen: { flag: ACT5_ROOT_ACCEPTED },
    onSolved: [{ answerQuestion: ACT5_Q_WHAT_IS_AT_THE_BOTTOM }],
    solutions: [
      {
        id: 'login',
        class: 'analytical',
        note: "LOG IN at the console in the antechamber, and give it what is written in pencil inside the back cover of Jules's notebook. It is the same pair that has been refused upstairs all week. It is not refused here.",
      },
    ],
    hints: [
      'There is one machine at the bottom and it is asking the same question the machine in your room asks.',
      'You have answered that question wrongly at every machine in this county and correctly at one of them. Whatever you gave the one on Sublevel 6 is what this one wants.',
      'It is written down. It is written down in pencil, by somebody who did not intend to be told it twice, in the only book you own that has a gap in the pagination.',
      'READ NOTEBOOK, or read the back cover of it directly, and then LOG IN at the console. Two fields. It is the same pair. It has been the same pair since Act II and it has never once been the right depth.',
      'LOG IN. User: admin. Password: admin-password.',
    ],
  },
  // §2's own note: two design classes are named for this puzzle's one route
  // (knowledge — SEARCH INDEX; character — the family room finished) but
  // only one solution note is authored, so this is one `PuzzleSolution`
  // entry (`class: 'analytical'`), not two — flagged as a proposal, not a
  // silent guess (this task's report).
  [ACT5_P27_JULES]: {
    id: ACT5_P27_JULES,
    name: 'waking Jules',
    question: ACT5_Q_WHO_IS_FILED_AT_ROOT,
    solvedWhen: { flag: ACT5_JULES_WOKEN },
    onSolved: [{ answerQuestion: ACT5_Q_WHO_IS_FILED_AT_ROOT }],
    solutions: [
      {
        id: 'search_index',
        class: 'analytical',
        route: { all: [{ flag: ACT4_DEEP_INDEX }, { has: ACT2_NOTEBOOK }] },
        note: 'SEARCH INDEX FOR JULES at the root terminal, then OPEN SNAPSHOT or WAKE JULES. It will not run unless the room the family remembered has been finished — that is where the index came from — and unless his notebook is physically in your hand when you ask.',
      },
    ],
    hints: [
      'Nothing in this room is required. The index is a list of what is filed at this level and one of the things filed at this level is a man.',
      'The ledger on Sublevel 6 told you where he was three weeks ago and you wrote it down: SNAPSHOT — ARCHIVED / ROOT. You are standing in root. SEARCH INDEX FOR JULES.',
      'It will want two things, and it says which two, in two words each. One of them was made by finishing the room the family remembered. The other is in your coat, unless you have put it down somewhere, in which case it is wherever you put it down.',
      'SEARCH INDEX FOR JULES, then WAKE JULES, with his notebook in your hand and the escape-room reconstruction completed. It opens once. There is no way to open it twice and nothing anywhere depends on your having opened it at all.',
    ],
  },
  [ACT5_P28_CREATE]: {
    id: ACT5_P28_CREATE,
    name: 'CREATE SUBJECT',
    question: ACT5_Q_WHAT_DO_YOU_OWE,
    solvedWhen: { flag: ACT5_INITIALIZED },
    onSolved: [{ answerQuestion: ACT5_Q_WHAT_DO_YOU_OWE }],
    solutions: [
      {
        id: 'create',
        class: 'analytical',
        note: 'CREATE SUBJECT at the root terminal. Six fields; every one of them is on a record you have already read. Answer them however you like — it takes what you give it — and then answer INITIALIZE?',
      },
    ],
    hints: [
      'There are three headings on that terminal and you have read two of them.',
      'The third one is a form. It is the same form as the record, with the answers taken out. It takes whatever you put in it, including the things that are already in it.',
      'CREATE SUBJECT. Fill in the fields — any way you like; it accepts all of them — and then answer INITIALIZE with YES. If you have anything you would rather was still here afterwards, put it in the cabinet under the bench first.',
    ],
  },
};

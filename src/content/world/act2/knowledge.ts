// Act II, Wave D1 — flags, clues, questions, memories, puzzles (Stage D
// plan §2 D1; `docs/superpowers/specs/2026-09-09-stage-d1-prose.md` §2,
// §14, and its own status line — nine topics, six shows, credentials print
// twice, §26 NOT wired, `q_wall_drug` stays as shipped).
//
// Every clue's `title`/`detail` and every memory's `lines` are transcribed
// verbatim from the prose doc (hard rule 5). This module covers only this
// task's own ids (the Emporium/Dot/Back Corridor/cache/notebook/M5/M6/M12/
// M14/M18-A); the miles-don't-count clue, the travel puzzle, and the M2
// variants belong to the concurrent travel/horse/deck task and are declared
// in its own files. `act2/index.ts` merges this module's exports alongside
// its own D0 `ACT2_FLAGS` and task A's own knowledge.

import type { WorldSlice } from '../game';
import {
  ACT2_CACHE_FOUND,
  ACT2_CLUE_CACHE_CONTENTS,
  ACT2_CLUE_CREDENTIALS,
  ACT2_CLUE_DEAD_NUMBERING,
  ACT2_CLUE_DOT_HAT,
  ACT2_CLUE_INDENTED_CREDENTIALS,
  ACT2_CLUE_PAGE_FITS,
  ACT2_CLUE_RETURNED_LETTER,
  ACT2_CLUE_STRANGER_IN_HAT,
  ACT2_DOT,
  ACT2_DOT_REMEMBERS_HAT,
  ACT2_LUKE_REFERENCED,
  ACT2_MEM_M5,
  ACT2_MEM_M6,
  ACT2_MEM_M12,
  ACT2_MEM_M14,
  ACT2_MEM_M18A,
  ACT2_NOTEBOOK,
  ACT2_P10_CACHE,
  ACT2_P11_NOTEBOOK,
  ACT2_PAGE_RUBBED,
  ACT2_Q_HOW_WAS_IT_HERE,
  ACT2_Q_WHAT_NOTEBOOK_SAYS,
  ACT2_Q_WHERE_IS_CACHE,
  ACT2_READ_NOTEBOOK,
  ACT2_READ_NOTEBOOK_MARGIN,
  ACT2_READ_NUMBERING_KEY,
  ACT2_RETURNED_LETTER,
  ACT2_SHORTHAND_DECODED,
  ACT2_USB,
  ACT2_VISITED_CORRIDOR,
  ACT2_VISITED_EMPORIUM,
  ACT2_WALL_DRUG_EMPORIUM,
} from './ids';

// ---------------------------------------------------------------------------
// §2's flag table — this task's own nine.
// ---------------------------------------------------------------------------

export const ACT2_D1_FLAGS: WorldSlice['flags'] = {
  [ACT2_VISITED_EMPORIUM]: { default: false, doc: "set by the Emporium's own onEnter (first entry) — gates its description rule 1" },
  [ACT2_VISITED_CORRIDOR]: { default: false, doc: "set by the Back Corridor's own onEnter (first entry) — gates its description rule 1" },
  [ACT2_DOT_REMEMBERS_HAT]: { default: false, doc: "set by Dot's topic_hat / SHOW FEDORA TO DOT — nothing yet reads it (R14, Stage E) besides the agenda line and the porch-Polaroid show" },
  [ACT2_READ_NUMBERING_KEY]: { default: false, doc: 'set by EXAMINE KEY / READ CARD at the claim window — gates the shelving search gate rule 1' },
  [ACT2_CACHE_FOUND]: { default: false, doc: 'set by OPEN BOX or topic_ticket (Dot fetches it) or the shelving search — P10 solvedWhen' },
  [ACT2_READ_NOTEBOOK]: { default: false, doc: 'set by the first READ NOTEBOOK — M5 trigger; P11 anchor' },
  [ACT2_READ_NOTEBOOK_MARGIN]: { default: false, doc: 'set by EXAMINE DOODLE — M12 half-trigger (the other half is act2_luke_referenced, task A)' },
  [ACT2_SHORTHAND_DECODED]: { default: false, doc: "default false; D2's Eli/Dad routes set it — read by the notebook's own text rule 1" },
  [ACT2_PAGE_RUBBED]: { default: false, doc: 'set by RUB PAGE WITH PENCIL — M18-A trigger' },
};

// ---------------------------------------------------------------------------
// §2's clue table.
// ---------------------------------------------------------------------------

/** Shared verbatim between the clue and the question's own answer recap (same "reuse, don't duplicate" idiom `act1/knowledge.ts`'s `REGISTER_IMPRESSION_DETAIL` uses) — the prose doc's §2 table gives this question no `answer` string of its own. */
const CACHE_CONTENTS_DETAIL =
  'A hard-backed notebook with a perished rubber band round it and a pencil under the band. A memory stick in a bag, labelled by hand. A film canister with exposed film in it and nothing written on it. And a letter, stamped, addressed, returned unopened, and kept.';

export const ACT2_D1_CLUES: NonNullable<WorldSlice['clues']> = {
  [ACT2_CLUE_DOT_HAT]: {
    title: 'What Dot kept',
    detail:
      'A man in a grey felt hat with the brim down on one side sat at her counter some months ago and wrote in a small hard-backed book, for a long time, and bought nothing. She cannot say a single thing about his face.',
  },
  [ACT2_CLUE_DEAD_NUMBERING]: {
    title: 'The numbering nobody uses',
    detail:
      'The card in the claim window rules four-figure blocks against lettered bays in a hand that has been gone over in a later ink. It is a scheme the counter stopped using before the present clerk started. A ticket numbered in the four thousands belongs in bay E.',
  },
  [ACT2_CLUE_CACHE_CONTENTS]: {
    title: 'What was in the box',
    detail: CACHE_CONTENTS_DETAIL,
  },
  [ACT2_CLUE_STRANGER_IN_HAT]: {
    title: 'The photograph in the box',
    detail:
      'A Polaroid of a man on a gravel apron in front of a chain-link fence, in a grey felt fedora with the brim down on one side. Wide face, heavy jaw, grey coming in at one temple. Nothing written on the back.',
  },
  [ACT2_CLUE_RETURNED_LETTER]: {
    title: 'The letter that came back',
    detail:
      'An envelope in Jack\'s hand, stamped, addressed to his brother at the plant, marked RETURN TO SENDER by a machine. Still sealed. It was in the box with everything else Jules thought was worth hiding.',
  },
  [ACT2_CLUE_PAGE_FITS]: {
    title: 'The page fits',
    detail:
      "The loose sheet from the hatband is the leaf torn out of Jules's notebook: the same paper, the same faint rule, the same width, and one tear that matches tooth for tooth along its whole length. Page 6, then the sheet, then page 9. The notebook has been in a box at Wall Drug for months.",
  },
  [ACT2_CLUE_CREDENTIALS]: {
    title: 'The login in the back cover',
    detail: 'Written in pencil inside the notebook\'s back cover: `admin` / `admin-password`. Nothing else is written there.',
  },
  [ACT2_CLUE_INDENTED_CREDENTIALS]: {
    title: 'What was pressed through the page',
    detail:
      "The blank sheet lay under the page Jules wrote the login on. Rubbing brings the same two words up out of the paper, and under them a line about a hold at Wall Drug with the ticket's own number in it.",
  },
};

// ---------------------------------------------------------------------------
// §2's question table (this task's own three; the shipped "get to Wall
// Drug" question — `q_wall_drug` at v0.9.0 — stays exactly as shipped,
// task A/P9's own concern, untouched here).
// ---------------------------------------------------------------------------

export const ACT2_D1_QUESTIONS: NonNullable<WorldSlice['questions']> = {
  [ACT2_Q_WHERE_IS_CACHE]: {
    text: 'What did Jules leave at that counter, and under what number?',
    openWhen: { visited: ACT2_WALL_DRUG_EMPORIUM },
    answerWhen: { flag: ACT2_CACHE_FOUND },
    answer: CACHE_CONTENTS_DETAIL,
  },
  [ACT2_Q_WHAT_NOTEBOOK_SAYS]: {
    text: 'The notebook is in a shorthand only its author had to read. What is in it?',
    openWhen: { flag: ACT2_READ_NOTEBOOK },
    // F0 (register 150) — settles when the shorthand is decoded, either route.
    answerWhen: { flag: ACT2_SHORTHAND_DECODED },
    answer: 'A hook is a valve. A doubled stroke is a shift. With that much, two thirds of\nit is a man\'s working week over and over: bearings, a door that sticks, a\ncontractor who does not come.\n\nAnd then, from about the middle, in among the valves, never underlined and\nnever set apart — a corridor longer inside than on the plans, a second\nchilled-water return that nobody drew, a floor with no drawing at all, and the\nmanager saying kindly that there is no such floor.\n\nAnd one line in capitals. The only one in the book, with the pencil through the\npaper on the S.',
  },
  [ACT2_Q_HOW_WAS_IT_HERE]: {
    text: 'The page in your hatband was torn out of this notebook. How did it get from a box in Wall Drug into that room?',
    openWhen: { clue: ACT2_CLUE_PAGE_FITS },
    // No answerWhen in this build — Stage E (§2's own ruling).
  },
};

// ---------------------------------------------------------------------------
// Puzzles (plan §2 D1).
// ---------------------------------------------------------------------------

export const ACT2_D1_PUZZLES: NonNullable<WorldSlice['puzzles']> = {
  [ACT2_P10_CACHE]: {
    id: ACT2_P10_CACHE,
    name: 'The cache',
    question: ACT2_Q_WHERE_IS_CACHE,
    solvedWhen: { flag: ACT2_CACHE_FOUND },
    solutions: [
      { id: 'dot', class: 'social', note: 'Show or mention the claim ticket to Dot (SHOW TICKET TO DOT / ASK DOT ABOUT TICKET); she fetches the box herself.', route: { npcAt: [ACT2_DOT, ACT2_WALL_DRUG_EMPORIUM] } },
      { id: 'shelving_key', class: 'analytical', note: 'Read the numbering key at the claim window, then SEARCH SHELVING with the ticket in hand.', route: { flag: ACT2_READ_NUMBERING_KEY } },
      { id: 'shelving_night', class: 'direct', note: 'SEARCH SHELVING at night, when the corridor is unattended and nobody has to be asked.', route: { clockPhase: 'night' } },
    ],
    hints: [
      'The claim ticket in your pocket is a number, and numbers mean something to somebody in this building — you just have to find who, or find their system.',
      "The woman at the counter runs this store day to day; the corridor behind her runs on an older scheme nobody currently working was taught. Either route gets you to the same box.",
      'The claim window has a card in it, taped up, in two hands of writing. Read it: it maps number ranges to lettered bays.',
      "SHOW TICKET TO DOT, or ASK DOT ABOUT TICKET — she'll go get it herself. Or: EXAMINE KEY / READ CARD at the window, then SEARCH SHELVING. At night the corridor is simply unattended; the search works without asking anybody.",
    ],
  },
  [ACT2_P11_NOTEBOOK]: {
    id: ACT2_P11_NOTEBOOK,
    name: 'The notebook',
    question: ACT2_Q_HOW_WAS_IT_HERE,
    solvedWhen: { all: [{ clue: ACT2_CLUE_PAGE_FITS }, { clue: ACT2_CLUE_CREDENTIALS }] },
    solutions: [
      { id: 'fit', class: 'analytical', note: "Take the loose page from your hatband and fit it against the notebook's own torn gap (FIT PAGE IN NOTEBOOK / COMPARE PAGE WITH NOTEBOOK)." },
      { id: 'back_cover', class: 'analytical', note: "Read the notebook's back cover (READ NOTEBOOK, or EXAMINE/READ the back cover directly)." },
    ],
    hints: [
      'The notebook has more than one thing to give up. Read it properly, and look at what is missing from it as closely as what is written in it.',
      "A leaf has been torn out of the notebook, close to the stitching. You are already carrying a loose page from somewhere unlikely — see whether the two are the same paper.",
      "FIT PAGE IN NOTEBOOK (or COMPARE PAGE WITH NOTEBOOK). Then READ NOTEBOOK and look inside the back cover.",
    ],
    // Eli's audit / Dad's decode routes (K, C) land in D2 — missedRecovery unneeded (both current routes are clock-free).
  },
};

// ---------------------------------------------------------------------------
// Memories (§14.1-14.4, 14.8 — this task's own five of the wave's eight;
// the M2 variants belong to the concurrent glovebox/deck task).
// ---------------------------------------------------------------------------

export const ACT2_D1_MEMORIES: NonNullable<WorldSlice['memories']> = {
  [ACT2_MEM_M5]: {
    title: 'The Shorthand',
    lines: [
      'My own hand, going faster than it can and staying legible anyway, because the trick is that you are not writing words, you are writing the shape of a sentence you already know.',
      'Loop 7B. Third time. Nobody reads this but me, so nobody else has to be able to.',
      'The pen is cold. I am doing it standing up with the book against a pipe lagging that is exactly the wrong temperature to lean on, and I am doing it here instead of at the desk because at the desk people come past and look at what you are writing and there is no polite way to stop them.',
    ],
    trigger: { when: { flag: ACT2_READ_NOTEBOOK } },
  },
  [ACT2_MEM_M6]: {
    title: 'The Garage',
    lines: [
      'Solder. That smell has no other job, so when it comes it brings the whole garage with it — the tube light that took two runs at it before it would come on, the drawers of things that were nearly all the same thing, and Dad at the bench with the iron in one hand and a copy of everything in the other.',
      '"Always keep a copy, kiddo."',
      'He said it about tapes. He said it about drawings, and about the county\'s minutes, and once about a whole filing cabinet that he had no business having. He said it in the voice of a man who thinks he is being funny, and he was not, quite, and none of us worked out which until a good deal later.',
    ],
    trigger: { when: { has: ACT2_USB } },
  },
  [ACT2_MEM_M14]: {
    title: 'Through The Door',
    lines: [
      'His voice came through the door, and the door was mine, and I stood on my side of it with my hand flat against it and let him say all of it.',
      'He asked me one question at the end. I gave him back an answer I had made earlier — a good one, a careful one, the kind you can say twice the same way — and it worked. I heard it work. There is a particular quiet on the other side of a door when a man decides to believe his brother.',
      'Then his boots on the stairs, going down, taking their time about it.',
    ],
    trigger: { when: { has: ACT2_RETURNED_LETTER } },
  },
  [ACT2_MEM_M12]: {
    title: 'Noumena',
    lines: [
      '"Noumena," he said, over a table with four other people\'s dinners on it, and kept eating.',
      'Somebody groaned. Somebody else groaned about a second later, on principle, having no idea. Dad put his fork down and said it back to him with the vowels in the wrong places, twice, until it was funny, and then a third time, when it was not.',
      'Luke ate, and let him, and did not define it for anybody, because he was going to use it again on Sunday and he wanted us all present for that too.',
    ],
    trigger: { when: { all: [{ flag: ACT2_LUKE_REFERENCED }, { flag: ACT2_READ_NOTEBOOK_MARGIN }] } },
  },
  [ACT2_MEM_M18A]: {
    title: 'Nine Symbols',
    lines: [
      'There were nine of them and I made them all up and nobody was ever going to ask.',
      'A circle meant I saw it myself. A circle with a bar through it meant somebody told me and I believed them. A bar on its own meant somebody told me.',
      'And the little square, which I used four times in eleven years, meant: this is true, and the drawing says otherwise.',
    ],
    trigger: { when: { all: [{ flag: ACT2_PAGE_RUBBED }, { has: ACT2_NOTEBOOK }, { profileLeader: 'analytical' }] } },
  },
};

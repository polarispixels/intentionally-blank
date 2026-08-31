// Act IV, wave E0 — shared state (`docs/superpowers/specs/2026-09-17-stage-e0-
// prose.md` §2). Written by the main session before the builders ran. Clue
// definitions (detail text is §2's, verbatim; titles composed from the
// granting section), the P21 puzzle with §23's hint ladder, and any event
// definitions are the builders' — in their own labelled blocks below the
// anchor, with the Edit tool.

import type { WorldSlice } from '../game';
import { ACT3_CLUE_ROOT_REFUSES } from '../act3/ids';
import {
  ACT4_CAGE_OPEN,
  ACT4_CLUE_SAME_HAND,
  ACT4_HANDWRITING_MATCHED,
  ACT4_NUMERAL_SEARCHED,
  ACT4_PROFILE_SEEN,
  ACT4_Q_RECORD_ABOUT_YOU,
  ACT4_Q_WHO_OUTRANKS_IT,
  ACT4_STARTED,
  ACT4_VISIT_ANNOUNCED,
  ACT4_VISIT_DAY,
  ACT4_VISIT_OVER_DAY,
  ACT4_WHITLOCK_CONVINCED,
  ACT4_WHITLOCK_READER_TOLD,
} from './ids';

export const ACT4_E0_FLAGS: WorldSlice['flags'] = {
  [ACT4_STARTED]: { default: false, doc: 'set by act4_ev_start on act3_clue_reacquire; every E0 rule, the numeral branch, the fourth heading, the boundary text' },
  [ACT4_VISIT_ANNOUNCED]: { default: false, doc: 'set by act4_ev_start; Main Street §3, the notice §5, Pearl §6, Marlow §7, the window §8, the Lobby doors §9, Whitlock topic_visit §10.4' },
  [ACT4_VISIT_DAY]: { default: 0, doc: 'numeric — the day of the visit, written by act4_set_visit_day; E1 Luke' },
  [ACT4_VISIT_OVER_DAY]: { default: 0, doc: 'numeric — the first day the crews are gone, written by act4_set_visit_day; Main Street §3 rule 3' },
  [ACT4_WHITLOCK_READER_TOLD]: { default: false, doc: 'set by §10.1; P21 hint rung 2' },
  [ACT4_WHITLOCK_CONVINCED]: { default: false, doc: 'set by §11.1 / §11.2; §12 the cage opens; E1 Whitlock hand-off' },
  [ACT4_CAGE_OPEN]: { default: false, doc: 'set by §12; the bag reveal; the cage examine rule 1' },
  [ACT4_HANDWRITING_MATCHED]: { default: false, doc: 'set by §15; P21; E3 record beat' },
  [ACT4_NUMERAL_SEARCHED]: { default: false, doc: 'set by §16.1; P21; hints' },
  [ACT4_PROFILE_SEEN]: { default: false, doc: 'set by §18; P21; act4_ev_dad_breath; the question hint copy' },
};

export const ACT4_E0_QUESTIONS: NonNullable<WorldSlice['questions']> = {
  [ACT4_Q_RECORD_ABOUT_YOU]: {
    text: 'What does the record say about you?',
    openWhen: { flag: ACT4_STARTED },
    // E0 task J — `answerWhen` mirrors P21's own `solvedWhen` exactly (the
    // puzzle's `onSolved` also fires an explicit `{ answerQuestion }` the
    // same turn; both paths land on the same recap, belt and suspenders,
    // same idiom `act3/knowledge.ts` already uses for `act3_q_who_hit_you`
    // alongside `act3/scripts.ts`'s own explicit `answerQuestion` effect).
    answerWhen: { all: [{ clue: ACT4_CLUE_SAME_HAND }, { flag: ACT4_NUMERAL_SEARCHED }, { flag: ACT4_PROFILE_SEEN }] },
    answer:
      'Three pieces, and none of them is a sentence. Your hand is his hand. The\nledger files you under his numeral with no name in the row. And the machine has\nbeen keeping a fourth page on you since the first morning, and it is up to\ndate.',
  },
  [ACT4_Q_WHO_OUTRANKS_IT]: {
    text: 'Who outranks this building?',
    openWhen: { all: [{ flag: ACT4_STARTED }, { clue: ACT3_CLUE_ROOT_REFUSES }] },
    // Answered in E1.
  },
};

// --- E0 task I ---
// `act4_clue_visit_coming` (§6 — Pearl's `topic_visit` rule 1). Detail text
// is §2's, verbatim. Title composed from §6's own sentences (hard rule 5:
// never invent player-visible prose) — "two governors and a senator" is
// Pearl's own line, and the whole point of the clue: this counter has had
// important men at it before, and she is still not impressed.
import { ACT4_CLUE_VISIT_COMING } from './ids';

export const ACT4_E0_TASK_I_CLUES: NonNullable<WorldSlice['clues']> = {
  [ACT4_CLUE_VISIT_COMING]: {
    title: 'Two governors and a senator',
    detail:
      'The county is milling and resurfacing the full length of Main Street, the\nsheriff has been handed a protection schedule with her own county in it, and\nPearl has been told there will be four minutes at her counter. The President\nis coming to the plant, the day after tomorrow.',
  },
};

// --- E0 task K ---
// `act4_clue_filed_under_one` (§16.1 — the ledger's numeral branch) and
// `act4_clue_profiled` (§18 — R13). Detail text is §2's, verbatim. Titles
// composed from each screen's own row/heading (hard rule 5: never invent
// player-visible prose) — same idiom `act3/knowledge.ts` uses for
// `ACT3_CLUE_JULES_DEPRECATED`/`ACT3_CLUE_REACQUIRE` (the screen's own line,
// dot leaders swapped for an em dash, or the block's own heading verbatim).
import { ACT4_CLUE_FILED_UNDER_ONE, ACT4_CLUE_PROFILED } from './ids';

export const ACT4_E0_TASK_K_CLUES: NonNullable<WorldSlice['clues']> = {
  [ACT4_CLUE_FILED_UNDER_ONE]: {
    title: 'SUBJECT [UNRESOLVED] — MAINTENANCE',
    detail:
      'The archive ledger takes a numeral. Under I there are two results: SUBJECT\nJULES I, DEPRECATED, and SUBJECT [UNRESOLVED], MAINTENANCE. The second row has\nno name in it.',
  },
  [ACT4_CLUE_PROFILED]: {
    title: 'SUBJECT BEHAVIORAL PROFILE',
    detail:
      'The archive terminal has a fourth heading under ARCHIVE, LOAD and QUEUE. It\nprints SUBJECT BEHAVIORAL PROFILE, three percentages — observation, social\ninference, direct action — and a line that says which one of them is the\nprimary strategy. It came up as fast as the other three.',
  },
};

// --- E0 task J ---
// `act4_clue_same_hand` (§15 — R14, the analog leg) and `act4_clue_elis_
// reason` (§21 — Eli's letter). Detail text is §2's, verbatim. Titles
// composed from each section's own sentences (hard rule 5): "Everybody's
// cursive looks alike" is §15's own standalone line; "I could not tell you
// that man's face" is §21.1's own closing clause — the same "quote the
// section's own line, sentence case" idiom `act3/knowledge.ts` uses for its
// clue titles (e.g. "Return B is warm", "The card, in the same hand as the
// notebook"). P21 (`act4_p21_self_evidence`) per §2/§23: `solvedWhen` is the
// `all` of all three legs; `onSolved` answers the question (its own
// `answerWhen` mirrors this, above); three `analytical` solutions, no
// `route` cond on any of them (§2's own puzzle-table note: "No clock term,
// no route flag" — this is an `all`, not alternate routes to converge on,
// so nothing here needs `route` the way `act3_p17_b4`'s three genuinely
// alternate paths do); five hints, §23's own ladder, verbatim.
import { ACT4_CLUE_ELIS_REASON, ACT4_P21_SELF_EVIDENCE } from './ids';

export const ACT4_J_CLUES: NonNullable<WorldSlice['clues']> = {
  [ACT4_CLUE_SAME_HAND]: {
    title: "Everybody's cursive looks alike",
    detail:
      "Three weeks of my own case notes, bagged off the floor of my room by the\ncounty, are written in the same shorthand as Jules's work book: the same\npressure, the same small fast letters leaning the same way, the same full stop\nput down hard after every abbreviation. The hook that means a valve. The\ndoubled stroke that means a shift.",
  },
  [ACT4_CLUE_ELIS_REASON]: {
    title: "I could not tell you that man's face",
    detail:
      'Eli says there was never an I. He says the man in Rapid City would not put a\nsingle upright on skin, because a line becomes a scar or a smudge, and that the\nsheet therefore started at two. He was six. He remembers the card on the wall\nand he does not remember the man\'s face.',
  },
};

export const ACT4_J_PUZZLES: NonNullable<WorldSlice['puzzles']> = {
  [ACT4_P21_SELF_EVIDENCE]: {
    id: ACT4_P21_SELF_EVIDENCE,
    name: 'the evidence about yourself',
    question: ACT4_Q_RECORD_ABOUT_YOU,
    solvedWhen: { all: [{ clue: ACT4_CLUE_SAME_HAND }, { flag: ACT4_NUMERAL_SEARCHED }, { flag: ACT4_PROFILE_SEEN }] },
    onSolved: [{ answerQuestion: ACT4_Q_RECORD_ABOUT_YOU }],
    solutions: [
      {
        id: 'compare',
        class: 'analytical',
        note: 'COMPARE NOTES WITH NOTEBOOK, once the evidence bag is open — the county bagged\nthree weeks of your own work off the floor of your room.',
      },
      {
        id: 'ledger',
        class: 'analytical',
        note: 'SEARCH LEDGER FOR I at the archive terminal. The prompt has said SURNAME OR\nNUMERAL since the first time you read it.',
      },
      {
        id: 'profile',
        class: 'analytical',
        note: 'READ PROFILE at the archive terminal, once Act IV has opened the fourth\nheading.',
      },
    ],
    hints: [
      'Somewhere in this county there are three weeks of your own work, and you are not the one who put it where it is.',
      'Your room was searched and you reported it. Think about what a county does the next morning with what is on the floor of a room somebody has reported — and who fills in the form.',
      'She will not open the cage for a story. She opened a form for a man with no name once already; bring her something she can hold — the work book with the loose page fitted back into it, or the second letter from the energy man.',
      'The archive terminal\'s search prompt has said SURNAME OR NUMERAL every time you have read it, and you have been carrying a numeral since the inspection lamp.',
      'The terminal has four headings now, not three. Read the fourth one.',
    ],
  },
};

// --- E0 builders append below this line (Edit tool only; one block per task, labelled) ---

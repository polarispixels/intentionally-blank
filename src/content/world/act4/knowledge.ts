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
    // E1 task M (§2, §22) — `answer` added here (this entry's own field, not
    // a new one); `answerWhen` is left undefined, matching this file's own
    // established idiom for a question whose only answer route is an
    // explicit `{ answerQuestion }` effect rather than an ambient `Cond`
    // (`act4LukeAtRoot`'s own effects, `./luke.ts`).
    answer:
      'Nobody who is alive. The building took his badge upstairs and opened a door for\nhim on Sublevel 5, and then it did nothing whatever at the bottom of the well,\nbecause the thing at the bottom of the well is not a door that refuses people.\nIt is a door nobody has ever switched the reader on for.',
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

// --- E1 task L ---
// The Staging Area, the hand-offs, and the visit's machinery
// (`docs/superpowers/specs/2026-09-18-stage-e1-prose.md` §2, §9.2, §7.1,
// §14-§16, §28). This task's own three clues (detail text §2's, verbatim),
// the question `act4_q_reach_luke`, and P22 (`act4_p22_luke`) — `solvedWhen`/
// `answerWhen` both key off `act4_luke_met` (task M's flag, imported by id;
// §2's own state table: "read by P22's solvedWhen"). Two `social` solutions,
// each with a `route` cond naming what it actually depends on
// (`validate.ts`'s clock-free-solution rule; §2's own puzzle-table note:
// "Both carry `onOrAfterDay`, so both take `missedRecovery`"); five hints,
// §28's own ladder, verbatim.
// `ACT4_VISIT_DAY`/`ACT4_WHITLOCK_CONVINCED` are already imported at the top
// of this file (E0); `ACT4_LUKE_MET` is task M's own, imported below in that
// task's own block — not re-imported here (module-scope names in one file
// must be unique regardless of which task's block declares them; fixed
// mechanically, no logic touched, per this wave's shared-file protocol).
import {
  ACT4_CLUE_DETAIL_REFUSES,
  ACT4_CLUE_LETTERS_FROM_JACK,
  ACT4_CLUE_MESSAGE_THROUGH,
  ACT4_MESSAGE_DELIVERED,
  ACT4_MESSAGE_VERDICT,
  ACT4_OFFICE_REPLY_DUE,
  ACT4_P22_LUKE,
  ACT4_Q_REACH_LUKE,
  ACT4_STAGING_OPEN,
} from './ids';

export const ACT4_L_FLAGS: WorldSlice['flags'] = {
  [ACT4_STAGING_OPEN]: { default: false, doc: "set by act4_ev_staging_opens (§17); read by the Lobby's west exit and the staging door's blocked text" },
  [ACT4_MESSAGE_DELIVERED]: { default: false, doc: "set by act4_hand_letter on a 'family' verdict (§16); read by act4_ev_staging_opens" },
  [ACT4_MESSAGE_VERDICT]: { default: 'none', doc: "'none' | 'family' | 'plain' | 'rewritten' — set by act4_hand_letter, every verdict (§16); read by act4_ev_office_reply, hints" },
  [ACT4_OFFICE_REPLY_DUE]: { default: 0, doc: 'numeric — set by act4_hand_letter (day + 1) on a non-family verdict; read by act4_ev_office_reply' },
};

export const ACT4_L_CLUES: NonNullable<WorldSlice['clues']> = {
  [ACT4_CLUE_DETAIL_REFUSES]: {
    title: 'Nothing I am carrying was issued to me',
    detail:
      'Two men stand on the doors of the staging area. They took the borrowed badge\nand read both sides of it and handed it back and did not move. Nothing I am\ncarrying was issued to me, because there is nobody for anything to be issued\nto.',
  },
  [ACT4_CLUE_MESSAGE_THROUGH]: {
    title: 'The post office is where the censor lives',
    detail:
      "The letter went in folded the way Eli folds, with one of the family's own words\nin it and a numeral at the end of it where a signature goes, and it was handed\nacross a counter rather than posted. The post office is where the censor lives.",
  },
  [ACT4_CLUE_LETTERS_FROM_JACK]: {
    title: 'Jack wrote none of them',
    detail:
      "There is a folder in that room with years of letters from Jack in it. Cheerful.\nAsking after everybody. Not one of them asking for anything, not one of them\ncrossed out, and every one of them the same length. Jack's hand and Jack's\nsignature. Jack wrote none of them.",
  },
};

export const ACT4_L_QUESTIONS: NonNullable<WorldSlice['questions']> = {
  [ACT4_Q_REACH_LUKE]: {
    text: 'How do you reach the one man who outranks the detail?',
    openWhen: { clue: ACT4_CLUE_DETAIL_REFUSES },
    answerWhen: { flag: ACT4_LUKE_MET },
    answer:
      'Not with anything you own. With a sheet of post-office paper, folded the way a\nsix-year-old folded them at the back of a hearing, with a word in it that only\nfive people ever used and a numeral at the bottom where a name goes — handed\nover a counter to somebody nobody has ever thought to search.',
  },
};

export const ACT4_L_PUZZLES: NonNullable<WorldSlice['puzzles']> = {
  [ACT4_P22_LUKE]: {
    id: ACT4_P22_LUKE,
    name: 'the message',
    question: ACT4_Q_REACH_LUKE,
    solvedWhen: { flag: ACT4_LUKE_MET },
    onSolved: [{ answerQuestion: ACT4_Q_REACH_LUKE }],
    solutions: [
      {
        id: 'pearl',
        class: 'social',
        note: 'GIVE LETTER TO PEARL, at her counter, once the visit is announced. Write it at\nthe post office and fold it before you go — but do not post it. Two of three:\nthe fold, one of the family\'s own words, and a numeral last on the page.',
        route: { onOrAfterDay: ACT4_VISIT_DAY },
      },
      {
        id: 'whitlock',
        class: 'social',
        note: 'GIVE LETTER TO WHITLOCK, once she has been shown paper she can hold. She goes\nin and out of that lobby with a folder and nobody in this county has ever asked\nher what is in it. Two of three: the fold, the word, the numeral.',
        route: { all: [{ flag: ACT4_WHITLOCK_CONVINCED }, { onOrAfterDay: ACT4_VISIT_DAY }] },
      },
    ],
    hints: [
      'There is one man alive who outranks the last door in that building, and the\ncounty has milled a road for him.',
      'Two men stand between you and the room they are keeping him in, and they are\nthe only people in this county who have ever looked properly at what you are\ncarrying.',
      'You cannot go through them and you cannot go round them. Something can, though.\nPaper has been reaching this family all week, and you know which kind reaches\nthem and which kind reaches somebody else first.',
      'A letter that reads like everybody else\'s gets answered like everybody else\'s.\nThink about what is in a letter from his family that is not in a letter from a\nstranger: the way it is folded, a word only the five of them ever used,\nand what goes at the bottom where a name would.',
      'Fold it the way you learned at the reader. Put one of the family\'s words in it.\nSign it with a numeral, last thing on the page. Then give it — do not post it,\nthe post office is where the other thing lives — to somebody nobody has ever\nthought to search: the woman at the counter, or the sheriff, if you have given\nher a reason.',
    ],
    missedRecovery:
      'The visit, once announced, does not leave. He stays in that room until the\nmessage reaches him, and the room is still there the day after.',
  },
};

// --- E1 task M ---
// Luke, the escort, R16, and the boundary (`docs/superpowers/specs/2026-09-
// 18-stage-e1-prose.md` §2, §11, §21, §22). Flags and this task's own four
// clues (detail text is §2's, verbatim; titles composed from each granting
// section's own line, hard rule 5 — the same "quote the section's own line,
// sentence case" idiom `act3/knowledge.ts`/E0's own task K block use).
import { ACT4_LUKE_AT_ROOT, ACT4_LUKE_GONE, ACT4_LUKE_MET, ACT4_LUKE_WILL_ESCORT, ACT4_S6_DOOR_OPEN } from './ids';
import { ACT4_CLUE_LUKES_REASON, ACT4_CLUE_LUKES_WORD, ACT4_CLUE_NOT_THE_USER, ACT4_CLUE_TWO_THING_DOOR } from './ids';

export const ACT4_E1_TASK_M_FLAGS: WorldSlice['flags'] = {
  [ACT4_LUKE_MET]: { default: false, doc: 'set by act4_staging_area\'s onEnter with Luke present (task L); read by P22\'s solvedWhen, act4_luke_gone\'s missed-window event, and the boundary\'s third arm' },
  [ACT4_LUKE_WILL_ESCORT]: { default: false, doc: 'set by ./luke.ts topic_door rule 1; read by the same topic\'s escort rule and Luke\'s own FOLLOW handler' },
  [ACT4_S6_DOOR_OPEN]: { default: false, doc: 'set by §21 (act3/objects/s5ReactorInterface.ts), permanent; read by the S6 door\'s own text, the stair gate object, and E3\'s root leg (i)' },
  [ACT4_LUKE_AT_ROOT]: { default: false, doc: 'set by §22/§23 (./luke.ts ACT4_LUKE_AT_ROOT_EFFECTS); guards that scene against firing twice' },
  [ACT4_LUKE_GONE]: { default: false, doc: 'set by §23, or the missed-window event; read by Luke\'s own schedule, the Staging Area\'s after-visit description (task L), and the boundary' },
};

export const ACT4_E1_TASK_M_CLUES: NonNullable<WorldSlice['clues']> = {
  [ACT4_CLUE_LUKES_WORD]: {
    title: 'You spelled it right',
    detail:
      'Noumena. He used it at a dinner table until it was the family\'s joke, and it is\nin the margin of the work book, and it is one of the three things that got a\nfolded piece of paper read by the President of the United States.',
  },
  [ACT4_CLUE_LUKES_REASON]: {
    title: 'There was never an I',
    detail:
      'He says there was never an I. He says their father was I: he paid for the\ntattoos, he sat in the chair first, and he put himself at the head of the row\nbecause he was the head of the row. He says Eli tells it differently, and that\nEli is wrong.',
  },
  [ACT4_CLUE_TWO_THING_DOOR]: {
    title: 'Behind it there is a stair',
    detail:
      'The door at the end of the Sublevel 5 gallery takes a badge on the reader and\nthen a name on the pad. It took his. Behind it there is a stair, and the stair\ngoes down.',
  },
  [ACT4_CLUE_NOT_THE_USER]: {
    title: 'There is nothing in it to refuse anybody with',
    detail:
      'The reader beside the door at the bottom of the well did nothing at all for the\nPresident of the United States. It did not refuse him. There is nothing in it\nto refuse anybody with.',
  },
};

// --- E1 task N ---
// R14's completion: Jack comes down (`docs/superpowers/specs/2026-09-18-
// stage-e1-prose.md` §2, §24-§27, §33, §37). Detail text is §2's, verbatim.
// Title composed from §25's own sentence (hard rule 5) — canon 33: no arm
// comparison, no `his`/`his own`, matching the sentence the scene itself
// uses to describe the reveal rather than the gesture.
import { ACT4_CLUE_JACK_SAW, ACT4_JACK_SAW_MARK, ACT4_JACK_WILL_COME } from './ids';

export const ACT4_E1_TASK_N_FLAGS: WorldSlice['flags'] = {
  [ACT4_JACK_WILL_COME]: { default: false, doc: 'set by act4_jack_topic_chairs (§24.1, act1/jack.ts); read by the tunnel-mouth event (§24.2)' },
  [ACT4_JACK_SAW_MARK]: {
    default: false,
    doc: "set by act4_ev_jack_sees (§25); read by Jack's greeting rule 1 (§26), topic_nobody/topic_tattoo's gated variants (§27), and SHOW ARM TO JACK's gate (addendum §4.1)",
  },
};

export const ACT4_E1_TASK_N_CLUES: NonNullable<WorldSlice['clues']> = {
  [ACT4_CLUE_JACK_SAW]: {
    title: 'It has been a numeral since the first morning',
    detail:
      'Jack took my wrist under the inspection lamp in the maintenance bay and turned\nthe arm over and looked at what is under the skin there. He did not say\nanything. He has not said anything about it since.',
  },
};

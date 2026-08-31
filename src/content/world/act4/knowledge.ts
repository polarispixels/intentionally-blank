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
      'Three pieces, and none of them is a sentence. Your hand is his hand. The ledger files you under his numeral with no name in the row. And the machine has been keeping a fourth page on you since the first morning, and it is up to date.',
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
      'Nobody who is alive. The building took his badge upstairs and opened a door for him on Sublevel 5, and then it did nothing whatever at the bottom of the well, because the thing at the bottom of the well is not a door that refuses people. It is a door nobody has ever switched the reader on for.',
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
      'The county is milling and resurfacing the full length of Main Street, the sheriff has been handed a protection schedule with her own county in it, and Pearl has been told there will be four minutes at her counter. The President is coming to the plant, the day after tomorrow.',
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
      'The archive ledger takes a numeral. Under I there are two results: SUBJECT JULES I, DEPRECATED, and SUBJECT [UNRESOLVED], MAINTENANCE. The second row has no name in it.',
  },
  [ACT4_CLUE_PROFILED]: {
    title: 'SUBJECT BEHAVIORAL PROFILE',
    detail:
      'The archive terminal has a fourth heading under ARCHIVE, LOAD and QUEUE. It prints SUBJECT BEHAVIORAL PROFILE, three percentages — observation, social inference, direct action — and a line that says which one of them is the primary strategy. It came up as fast as the other three.',
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
      "Three weeks of my own case notes, bagged off the floor of my room by the county, are written in the same shorthand as Jules's work book: the same pressure, the same small fast letters leaning the same way, the same full stop put down hard after every abbreviation. The hook that means a valve. The doubled stroke that means a shift.",
  },
  [ACT4_CLUE_ELIS_REASON]: {
    title: "I could not tell you that man's face",
    detail:
      'Eli says there was never an I. He says the man in Rapid City would not put a single upright on skin, because a line becomes a scar or a smudge, and that the sheet therefore started at two. He was six. He remembers the card on the wall and he does not remember the man\'s face.',
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
        note: 'COMPARE NOTES WITH NOTEBOOK, once the evidence bag is open — the county bagged three weeks of your own work off the floor of your room.',
      },
      {
        id: 'ledger',
        class: 'analytical',
        note: 'SEARCH LEDGER FOR I at the archive terminal. The prompt has said SURNAME OR NUMERAL since the first time you read it.',
      },
      {
        id: 'profile',
        class: 'analytical',
        note: 'READ PROFILE at the archive terminal, once Act IV has opened the fourth heading.',
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

// --- E2 task O ---
// The gate frames, the Escape Chamber, P23, M10, and the boundary
// (`docs/superpowers/specs/2026-09-19-stage-e2-prose.md` §2, §4, §5, §23,
// §47.1). Clue detail text is §2's, verbatim; titles composed from each
// granting section's own sentence (hard rule 5 — same "quote the section's
// own line" idiom this file's other task blocks use). M10's three variants
// share M3's own idiom (`act1/knowledge.ts`), except the tie fires
// `analytical` rather than `social` (§5's own note, §53 q9 — confirmed as
// written, doc status line).
import {
  ACT4_CHAMBER_ADMITTED,
  ACT4_CHAMBER_COMPLETE,
  ACT4_CHAMBER_COPY_FOUND,
  ACT4_CHAMBER_FAILURES,
  ACT4_CHAMBER_FIRST_DONE,
  ACT4_CHAMBER_PANEL_LIVE,
  ACT4_CHAMBER_PHRASE_SAID,
  ACT4_CHAMBER_TIMER_TICKS,
  ACT4_CLUE_ADMITTED,
  ACT4_CLUE_FRAME_WANTS_MORE,
  ACT4_CLUE_HARVEST_WRONG,
  ACT4_CLUE_ROOM_COMPLETED,
  ACT4_DEEP_INDEX,
  ACT4_ESCAPE_CHAMBER,
  ACT4_MEM_M10_ANALYTICAL,
  ACT4_MEM_M10_DIRECT,
  ACT4_MEM_M10_SOCIAL,
  ACT4_P23_CHAMBER,
  ACT4_Q_THE_ROOM,
} from './ids';

export const ACT4_O_FLAGS: WorldSlice['flags'] = {
  [ACT4_CHAMBER_ADMITTED]: { default: false, doc: 'set by act4_enter_escape on the admitting branch (§4.1); read by act4_q_the_room\'s openWhen, the Chamber\'s rule 1' },
  [ACT4_CHAMBER_FIRST_DONE]: { default: false, doc: 'set by §18.1; read by act4_ev_chamber_complete, the voices, the assist' },
  [ACT4_CHAMBER_COPY_FOUND]: { default: false, doc: 'set by §19.3; read by act4_ev_chamber_complete, the voices, the assist' },
  [ACT4_CHAMBER_PHRASE_SAID]: { default: false, doc: 'set by act4_chamber_phrase_respond (§21.2); read by act4_ev_chamber_complete, the door' },
  [ACT4_CHAMBER_FAILURES]: { default: 0, doc: 'numeric — §18.2, §19.4, §21.3 (inc); read by the assist\'s >= 2 arm (§22)' },
  [ACT4_CHAMBER_COMPLETE]: { default: false, doc: 'set by act4_ev_chamber_complete (§23); read by P23\'s solvedWhen, the Chamber\'s rule 3, the back door, the boundary' },
  [ACT4_DEEP_INDEX]: { default: false, doc: 'set by act4_ev_chamber_complete (§23); read by E3\'s P27' },
  [ACT4_CHAMBER_PANEL_LIVE]: { default: false, doc: 'mechanical, not named by the prose doc — flipped by act4_ev_chamber_timer, cleared by either prompt outcome; gates the panel\'s TYPE handler' },
  [ACT4_CHAMBER_TIMER_TICKS]: { default: 0, doc: 'mechanical, numeric, never rendered — turns spent in the Chamber since the last reset; act4_ev_chamber_timer\'s own counter' },
};

export const ACT4_O_CLUES: NonNullable<WorldSlice['clues']> = {
  [ACT4_CLUE_FRAME_WANTS_MORE]: {
    title: 'There is no reader on this thing',
    detail:
      'The first frame is not locked and there is nothing on it to unlock. I walked into it and came out of it eighteen inches further into the same room. It is checking something, and there is no reader, no pad and no slot anywhere near it, so whatever it wants is not a thing I can be carrying.',
  },
  [ACT4_CLUE_ADMITTED]: {
    title: 'The floor on the far side of it was linoleum',
    detail:
      'It let me in. The second time I put a foot over that sill the floor on the far side of it was linoleum. Nothing about me changed between the two attempts except what I had remembered in between.',
  },
  [ACT4_CLUE_ROOM_COMPLETED]: {
    title: 'It completed',
    detail:
      'The kitchen is built out of what four people remember of one afternoon. The parts all four of them looked at are exact. The parts nobody looked at are blank. There is a place in the middle of it, standing height, that the light treats as occupied and that has nothing in it, and the room will not finish until somebody does that person\'s small ordinary business: takes his chair, looks where he kept the spare, says the thing he said on the way out.\n\nIt only completes for the one who knew the part.\n\nIt completed.',
  },
  [ACT4_CLUE_HARVEST_WRONG]: {
    title: 'The good cloth is on the table',
    detail:
      'On the film the good cloth is on the table. In the room the good cloth is off it and folded on the dresser. Four people built that kitchen out of what they had and got that one wrong, and there is no way to be wrong about a thing like that unless it was never looked at by anybody who was in the room.',
  },
};

export const ACT4_O_QUESTIONS: NonNullable<WorldSlice['questions']> = {
  [ACT4_Q_THE_ROOM]: {
    text: 'Why does the room stop where you stand?',
    openWhen: { flag: ACT4_CHAMBER_ADMITTED },
    answerWhen: { flag: ACT4_CHAMBER_COMPLETE },
    answer:
      'Because it was built out of four people and there were five, and the shape of what is missing from it is the shape of a man who took the first chair, kept the spare key in the coffee jar, and said the same thing on his way out of a door for as long as anybody could remember. It stopped where you stood because you were standing in the hole. It started again when you did his afternoon.',
  },
};

export const ACT4_O_PUZZLES: NonNullable<WorldSlice['puzzles']> = {
  [ACT4_P23_CHAMBER]: {
    id: ACT4_P23_CHAMBER,
    name: 'the reconstruction',
    question: ACT4_Q_THE_ROOM,
    solvedWhen: { flag: ACT4_CHAMBER_COMPLETE },
    onSolved: [{ answerQuestion: ACT4_Q_THE_ROOM }],
    // Clock-free, no missedRecovery (§2's own puzzle-table note: "nothing
    // in it carries a clock term, and the frame does not close"). Three
    // `knowledge`-flavored solutions (the doc's own §2 table), each tagged
    // `analytical` — the engine's nearest `ActionClass` for that taxonomy,
    // same mapping P21's own three "knowledge" solutions used.
    solutions: [
      {
        id: 'chair',
        class: 'analytical',
        note: 'SIT IN THE FIRST CHAIR when the voices call the game. Not the chair nearest the door and not the chair you would have chosen. The first one — the one at the end with its back to the window, which is empty and stays empty.',
      },
      {
        id: 'jar',
        class: 'analytical',
        note: 'LOOK IN THE COFFEE JAR on the shelf over the stove. The drawer in the table is locked and there is no key in this room, which is only true of rooms where nobody kept a spare. Somebody in this family always kept a spare, and always kept it in the same place, and said so often enough that it stuck.',
      },
      {
        id: 'phrase',
        class: 'analytical',
        note: 'SAY THE HOUSE RULE at the panel by the back door when the timer runs out. It wants a line, not a code. It is the thing the last one out of that kitchen said every time, and you have heard it twice this week from two different people who have never met.',
      },
    ],
    hints: [
      'There are two openings in that wall with light behind them, and one of them let you in.',
      'Nothing in this kitchen is locked except a drawer, and nothing in this kitchen is asking you a question except a panel by the back door, and neither of those is the first thing that has to happen. Something is being waited for.',
      'Listen to the speaker properly. They call the game, and then somebody says the rule, and then they leave a gap the length of a short answer, and nothing goes in it. There is a chair at that table nobody is in.',
      'Three small ordinary things, in any order, and none of them is clever: take the chair the room is holding for you; find the spare key where that family always kept the spare of everything; and when the timer runs out, put in the thing the last one out of that kitchen said, which you have heard this week from two people who have never met.',
      'SIT IN THE FIRST CHAIR — the end one, back to the window. LOOK IN THE JAR on the shelf over the stove, and use what is down the side of the glass on the drawer. When the panel comes up, type YOUNGEST GOES LAST, or HOUSE RULES; it takes either, because they are the same sentence in that house. If the room gets away from you, keep going: it resets, it never locks, and after two bad turns the voices start helping.',
    ],
  },
};

// M10 — *The Kitchen* (§5). Three mutually-exclusive behavioral variants
// sharing one title, fired on the Chamber threshold. Analytical's own `cond`
// is the plan's rule, verbatim: `{ any: [{ profileLeader: 'analytical' },
// { not: { any: [{ profileLeader: 'social' }, { profileLeader: 'direct' }] } }] }`
// — a tie fires analytical (M10's own default, deliberately NOT M3's
// social default — §53 q9, confirmed).
export const ACT4_O_MEMORIES: NonNullable<WorldSlice['memories']> = {
  [ACT4_MEM_M10_ANALYTICAL]: {
    title: 'The Kitchen',
    lines: [
      'The kitchen timer lived on the sill over the sink and it ran a minute and a half slow across its whole travel, which I had established over a summer and which nobody had asked me to establish.',
      'Dad set it for the potatoes and went out to the yard. I put it back a turn. When it went off, the potatoes were done at the time he thought he had set it for, and he said what he always said, which was that there was nothing wrong with that timer.',
      'There is nothing wrong with that timer. That was never the claim.',
    ],
    trigger: {
      when: {
        all: [
          { visited: ACT4_ESCAPE_CHAMBER },
          { any: [{ profileLeader: 'analytical' }, { not: { any: [{ profileLeader: 'social' }, { profileLeader: 'direct' }] } }] },
          { not: { any: [{ memory: ACT4_MEM_M10_SOCIAL }, { memory: ACT4_MEM_M10_DIRECT }] } },
        ],
      },
    },
  },
  [ACT4_MEM_M10_SOCIAL]: {
    title: 'The Kitchen',
    lines: [
      'The joke was that the youngest still could not say a particular long word, and the joke was old by then, and she had started getting it wrong on purpose because a joke you do on purpose is one you own.',
      'All of us at that table going. Dad not going. Dad going.',
      'I had the end seat with my back to the window, which is the seat you end up in if you are the one who gets up to take the picture.',
    ],
    trigger: {
      when: {
        all: [
          { visited: ACT4_ESCAPE_CHAMBER },
          { profileLeader: 'social' },
          { not: { any: [{ memory: ACT4_MEM_M10_ANALYTICAL }, { memory: ACT4_MEM_M10_DIRECT }] } },
        ],
      },
    },
  },
  [ACT4_MEM_M10_DIRECT]: {
    title: 'The Kitchen',
    lines: [
      'The chair went under me on the back left leg, all at once, the way they do — the dowel coming out of the socket dry and clean with no splinter on it anywhere.',
      'I went down with the plate still level in my hand. I have never managed that since and I did not manage it on purpose then.',
      'The leg lay under the table for the rest of the afternoon and nobody picked it up, and I have thought about that leg more than the day deserves.',
    ],
    trigger: {
      when: {
        all: [
          { visited: ACT4_ESCAPE_CHAMBER },
          { profileLeader: 'direct' },
          { not: { any: [{ memory: ACT4_MEM_M10_ANALYTICAL }, { memory: ACT4_MEM_M10_SOCIAL }] } },
        ],
      },
    },
  },
};

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
      'Two men stand on the doors of the staging area. They took the borrowed badge and read both sides of it and handed it back and did not move. Nothing I am carrying was issued to me, because there is nobody for anything to be issued to.',
  },
  [ACT4_CLUE_MESSAGE_THROUGH]: {
    title: 'The post office is where the censor lives',
    detail:
      "The letter went in folded the way Eli folds, with one of the family's own words in it and a numeral at the end of it where a signature goes, and it was handed across a counter rather than posted. The post office is where the censor lives.",
  },
  [ACT4_CLUE_LETTERS_FROM_JACK]: {
    title: 'Jack wrote none of them',
    detail:
      "There is a folder in that room with years of letters from Jack in it. Cheerful. Asking after everybody. Not one of them asking for anything, not one of them crossed out, and every one of them the same length. Jack's hand and Jack's signature. Jack wrote none of them.",
  },
};

export const ACT4_L_QUESTIONS: NonNullable<WorldSlice['questions']> = {
  [ACT4_Q_REACH_LUKE]: {
    text: 'How do you reach the one man who outranks the detail?',
    openWhen: { clue: ACT4_CLUE_DETAIL_REFUSES },
    answerWhen: { flag: ACT4_LUKE_MET },
    answer:
      'Not with anything you own. With a sheet of post-office paper, folded the way a six-year-old folded them at the back of a hearing, with a word in it that only five people ever used and a numeral at the bottom where a name goes — handed over a counter to somebody nobody has ever thought to search.',
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
        note: 'GIVE LETTER TO PEARL, at her counter, once the visit is announced. Write it at the post office and fold it before you go — but do not post it. Two of three: the fold, one of the family\'s own words, and a numeral last on the page.',
        route: { onOrAfterDay: ACT4_VISIT_DAY },
      },
      {
        id: 'whitlock',
        class: 'social',
        note: 'GIVE LETTER TO WHITLOCK, once she has been shown paper she can hold. She goes in and out of that lobby with a folder and nobody in this county has ever asked her what is in it. Two of three: the fold, the word, the numeral.',
        route: { all: [{ flag: ACT4_WHITLOCK_CONVINCED }, { onOrAfterDay: ACT4_VISIT_DAY }] },
      },
    ],
    hints: [
      'There is one man alive who outranks the last door in that building, and the county has milled a road for him.',
      'Two men stand between you and the room they are keeping him in, and they are the only people in this county who have ever looked properly at what you are carrying.',
      'You cannot go through them and you cannot go round them. Something can, though. Paper has been reaching this family all week, and you know which kind reaches them and which kind reaches somebody else first.',
      'A letter that reads like everybody else\'s gets answered like everybody else\'s. Think about what is in a letter from his family that is not in a letter from a stranger: the way it is folded, a word only the five of them ever used, and what goes at the bottom where a name would.',
      'Fold it the way you learned at the reader. Put one of the family\'s words in it. Sign it with a numeral, last thing on the page. Then give it — do not post it, the post office is where the other thing lives — to somebody nobody has ever thought to search: the woman at the counter, or the sheriff, if you have given her a reason.',
    ],
    missedRecovery:
      'The visit, once announced, does not leave. He stays in that room until the message reaches him, and the room is still there the day after.',
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
      'Noumena. He used it at a dinner table until it was the family\'s joke, and it is in the margin of the work book, and it is one of the three things that got a folded piece of paper read by the President of the United States.',
  },
  [ACT4_CLUE_LUKES_REASON]: {
    title: 'There was never an I',
    detail:
      'He says there was never an I. He says their father was I: he paid for the tattoos, he sat in the chair first, and he put himself at the head of the row because he was the head of the row. He says Eli tells it differently, and that Eli is wrong.',
  },
  [ACT4_CLUE_TWO_THING_DOOR]: {
    title: 'Behind it there is a stair',
    detail:
      'The door at the end of the Sublevel 5 gallery takes a badge on the reader and then a name on the pad. It took his. Behind it there is a stair, and the stair goes down.',
  },
  [ACT4_CLUE_NOT_THE_USER]: {
    title: 'There is nothing in it to refuse anybody with',
    detail:
      'The reader beside the door at the bottom of the well did nothing at all for the President of the United States. It did not refuse him. There is nothing in it to refuse anybody with.',
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
      'Jack took my wrist under the inspection lamp in the maintenance bay and turned the arm over and looked at what is under the skin there. He did not say anything. He has not said anything about it since.',
  },
};

// --- E2 task Q ---
// The library annex, the darkroom, the two prints, and R17
// (`docs/superpowers/specs/2026-09-19-stage-e2-prose.md` §2, §42-§47).
// Flags, this task's own clue (detail text is §2's, verbatim; title
// composed from the clue's own detail text, hard rule 5 — the same "quote
// the section's own line" idiom this file's other task blocks use),
// `act4_q_the_sky` (P's own question — the whole def, since P's block
// hadn't landed at wiring time; see `ids.ts`'s own header note on
// `ACT4_Q_THE_SKY` for the reconciliation this needs), and P24
// (`act4_p24_mars_film`) per §2/§47.2: `solvedWhen`/`onSolved` this task's
// own instruction, verbatim; three solutions (`conversation`→`social`,
// `knowledge`→`analytical`, `stealth`→`direct` — the same class mapping
// `act1/knowledge.ts`'s own "SEARCH SHELVING at night" solution already
// uses for a stealth route); five hints, §47.2's own ladder, verbatim.
import {
  ACT4_CLUE_SKY_IS_CEILING,
  ACT4_DARKROOM_OPEN,
  ACT4_JULES_FILM_DEVELOPED,
  ACT4_P24_MARS_FILM,
  ACT4_Q_THE_SKY,
  ACT4_SISSY_FILM_DEVELOPED,
  ACT4_SKY_MATCHED,
} from './ids';

export const ACT4_E2_TASK_Q_FLAGS: WorldSlice['flags'] = {
  [ACT4_DARKROOM_OPEN]: {
    default: false,
    doc: "set by act1_darkroom_door's PRY-with-leg (§43.1) or UNLOCK-with-key (§43.2), no act gate (register 131); read by the door's own open-state EXAMINE and both DEVELOP/ENTER handlers",
  },
  [ACT4_SISSY_FILM_DEVELOPED]: { default: false, doc: 'set by act4_develop (§44.1); read by act4_p24_mars_film\'s hints' },
  [ACT4_JULES_FILM_DEVELOPED]: { default: false, doc: 'set by act4_develop (§44.2); read by §24 (O\'s own task), hints, E3\'s re-cache' },
  [ACT4_SKY_MATCHED]: { default: false, doc: "set by §46 (R17); read by act4_q_the_sky's answerWhen, E3's ending beats" },
};

export const ACT4_E2_TASK_Q_CLUES: NonNullable<WorldSlice['clues']> = {
  [ACT4_CLUE_SKY_IS_CEILING]: {
    title: 'Same arrangement, confirmed',
    detail:
      'Her film and the Polaroid, side by side under the safelight. Same arrangement, confirmed — the film is sharp and the discs on the Polaroid are the same discs.\n\nAnd on the film only, because it was open on a tripod for a long time and the negative was pushed: straight lines behind the stars. Faint, but straight, and they meet, and they do not meet at any angle that anything in a sky meets at. Where two of them cross the black is a different black and it has an edge, and behind the edge there is structure — the kind a thing has when it was made rather than when it grew.\n\nTwo skies. Eighty million miles. One arrangement, and the seams are in both of them; you can only see them on the one that was photographed properly.',
  },
};

// `act4_q_the_sky`'s own text/openWhen are task P's declaration
// (`ACT4_P_QUESTIONS`, below this file); this task's own `answerWhen`/
// `answer` (§46's instruction) are added to that SAME object in place, in
// this task's own addendum at the end of this file (after `ACT4_P_
// QUESTIONS` exists to mutate — module top-level code runs in file order).
// No competing `ACT4_Q_THE_SKY` question object is declared here.

export const ACT4_E2_TASK_Q_PUZZLES: NonNullable<WorldSlice['puzzles']> = {
  [ACT4_P24_MARS_FILM]: {
    id: ACT4_P24_MARS_FILM,
    name: 'Mars, on film',
    question: ACT4_Q_THE_SKY,
    solvedWhen: { clue: ACT4_CLUE_SKY_IS_CEILING },
    onSolved: [{ answerQuestion: ACT4_Q_THE_SKY }],
    solutions: [
      {
        id: 'ask_sissy',
        class: 'social',
        note: 'ASK SISSY ABOUT THE FILM once she has told you about the launch. She will hand it over. She has been waiting a year for somebody to want it.',
      },
      {
        id: 'show_polaroid',
        class: 'analytical',
        note: 'SHOW HER THE NIGHT-SKY POLAROID. She will look at it for a long time and then go and get the canister without being asked.',
      },
      {
        id: 'take_film',
        class: 'direct',
        note: 'TAKE THE FILM out of the camera on the tripod in the dome while she is down in the galley. It is not locked and it is not hidden and she never asks for it back, which is its own answer about her.',
      },
    ],
    hints: [
      'Everything anybody has told you comes down a wire, and the wire is the one place this world has ever been caught changing its mind. Her sky does not have to.',
      'She was told to stop shooting film and she did not stop. Ask her about it, or show her the one photograph of a sky you already own, or go up the ladder and look at what is on the tripod.',
      'A roll of exposed film is worth nothing at all until somebody puts it through chemistry, and there is exactly one room in this county with the chemistry in it. You have walked past its door and read the plate on it.',
      'The library annex, past the drawer bank. It is locked and it has been locked since before you got here. There is more than one way into a door like that: the thing you have been prying with all week, or the key that whoever used that room last did not take home with them.',
      'Open the darkroom — PRY DOOR WITH CHAIR LEG, or SEARCH THE SHELF the sign-in book stands on and use the key. DEVELOP FILM; develop both canisters while you are in there, they take the same hour. Then put her print and the night-sky Polaroid side by side: COMPARE PRINT WITH POLAROID.',
    ],
  },
};

// --- E2 task P ---
// The hab: the Galley, the Dome, Sissy, and M11
// (`docs/superpowers/specs/2026-09-19-stage-e2-prose.md` §2, §32.4, §32.5,
// §33, §37.3). Clue detail text is §2's, verbatim; titles composed from the
// granting section (this file's own header convention). M11's `lines` are
// §33's own text, one entry per paragraph (`act3/knowledge.ts`'s own
// `ACT3_D5_TASK_G_MEMORIES` precedent).
import { ACT4_HAB_DOME, ACT4_HAB_LEFT_ONCE, ACT4_MEM_M11, ACT4_SISSY, ACT4_SISSY_TOPIC_LAUNCH } from './ids';
// `ACT4_Q_THE_SKY` already imported above by task Q's own block (this file's
// module scope is shared — see that block's own header on the `act4_q_the_
// sky` reconciliation).
import { ACT4_CLUE_SAME_ARRANGEMENT, ACT4_CLUE_SISSY_COUNTS_THREE, ACT4_CLUE_SISSYS_REASON } from './ids';

export const ACT4_P_FLAGS: WorldSlice['flags'] = {
  [ACT4_SISSY_TOPIC_LAUNCH]: { default: false, doc: 'set by topic_launch/topic_brothers (§32.4); M11 (§33)\'s own trigger' },
  [ACT4_HAB_LEFT_ONCE]: { default: false, doc: 'set by act4_leave_hab (§25.3/§25.4) on the first crossing back; read by that same script for the first/later text split' },
};

export const ACT4_P_CLUES: NonNullable<WorldSlice['clues']> = {
  [ACT4_CLUE_SISSY_COUNTS_THREE]: {
    title: 'She has three brothers',
    detail:
      'She has three brothers. She said it the way you say a thing that has never had a reason to be said carefully — counting off what each of them was doing on the day she went up, and stopping when she ran out of them.',
  },
  [ACT4_CLUE_SISSYS_REASON]: {
    title: 'Her account of why the sheet starts at two',
    detail:
      'Her account of why the sheet starts at two: the first one did not take. The man put it on somebody, it healed out to a smear inside a year, and rather than sit that one down again they moved the whole row up. She cannot tell me which of them it was on. Eli says the parlour refused to do a single upright at all. The President says their father was I and there never was another. All three of them are certain and no two of them agree, and not one of them has mentioned birth order, which is the only version I was given by anybody who lives here.',
  },
  [ACT4_CLUE_SAME_ARRANGEMENT]: {
    title: 'The same arrangement, held against the dome',
    detail:
      'Held up against the dome: the bright one, and the long shallow triangle of smaller ones under it, and the close pair below and left of that, all in the same positions and the same proportions as they are on a Polaroid of a porch roof in South Dakota. The Polaroid is out of focus and cannot prove anything on its own. The arrangement is the arrangement.',
  },
};

// `act4_q_the_sky` — `openWhen` is this task's own. `answerWhen`/`answer`
// (R17, `act4_clue_sky_is_ceiling`) are task Q's to add to this SAME def,
// in their own labelled edit below — left uncommented for that task rather
// than guessed at here (this file's own established "mid-flight" idiom,
// `act4/luke.ts`'s header note on `ACT4_STAGING_AREA`).
export const ACT4_P_QUESTIONS: NonNullable<WorldSlice['questions']> = {
  [ACT4_Q_THE_SKY]: {
    text: 'Whose sky is that?',
    openWhen: { visited: ACT4_HAB_DOME },
  },
};

// --- E2 task Q (addendum) ---
// `act4_q_the_sky`'s own `answerWhen`/`answer` (§46's own instruction: "you
// add answerWhen ... and §2's answer text to that question in a labelled
// edit once P's block exists"). Task P's block has now landed
// (`ACT4_P_QUESTIONS`, immediately above) — amended in place rather than
// declared a second time (the `act2/objects/usb.ts` mutate-in-place idiom;
// must run textually after `ACT4_P_QUESTIONS`'s own declaration, since both
// live in this one file and module top-level code runs in file order).
Object.assign(ACT4_P_QUESTIONS[ACT4_Q_THE_SKY]!, {
  answerWhen: { clue: ACT4_CLUE_SKY_IS_CEILING },
  answer:
    'It is the same one. Her camera and a Polaroid of a porch roof in South Dakota took the same arrangement of stars, and the film is good enough to show what the Polaroid never could: the lines behind them, and where the lines cross. Nobody up there is looking at anything the people down here are not looking at.',
});

export const ACT4_P_MEMORIES: NonNullable<WorldSlice['memories']> = {
  [ACT4_MEM_M11]: {
    title: 'One Sky',
    lines: [
      'A field with the truck backed into it and the tailgate down and four of us up on the bed of it with our necks back, and the cold coming up out of the ground into the metal into us.',
      'The one who does energy had worked out to the minute when it would clear the horizon and had told everybody twice. The youngest of the boys had driven all day and would not say so. I had the blanket, because I was the oldest, which is not a privilege, it is a duty about blankets.',
      'And the sky over that field was the sky over that field: the whole enormous ordinary lot of it, going all the way down to the fence line, with nothing of hers in it yet.',
      'We watched a nothing for a long time and then there was a thing in it going up, and one of them said her name, and none of us said anything else at all.',
    ],
    trigger: { when: { all: [{ met: ACT4_SISSY }, { flag: ACT4_SISSY_TOPIC_LAUNCH }] } },
  },
};

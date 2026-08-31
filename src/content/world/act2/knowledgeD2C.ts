// Act II, Stage D2, task C — memories and questions
// (`docs/superpowers/specs/2026-09-10-stage-d2-prose.md` §22.1/§22.2/§22.4/
// §22.5; §2's own state table). Prose transcribed verbatim (hard rule 5),
// including the doc's own literal asterisk-emphasis (kept, not stripped —
// this codebase's shipped memories already use it verbatim: `act1/
// knowledge.ts`'s M10/M11-equivalent clue text, "*It was 32 miles
// yesterday too.*"/"signed **L**").
//
// QUESTION TEXT — `act2_q_nolan_off_duty`/`act2_q_inside_the_plant` have no
// authored `text` anywhere in either the plan or the prose doc (only the
// ids and a one-line description of what each anchors — plan §2 D2's own
// "Questions" row: "Nolan off duty, playing cards like anyone else" /
// "P16's anchor, answered in D3"). An empty or bracket-placeholder string
// was this task's first attempt; `validate.ts`'s own
// `question-not-phrased-as-question` rule makes that a hard error (a
// question must read as a question, never a marker), so the two below are
// composed, minimal, factual questions built directly from the plan's own
// one-line descriptions — not narrative-writer voice, and not invented
// from nothing. Flagged in this task's report as a narrative-writer pass
// candidate regardless. Neither is wired to `openWhen`/an `openQuestion`
// effect anywhere in this task's own modules, so neither is ever actually
// surfaced to a player in this build (`views.ts`'s own question listing
// only ever shows `open`/`answered` ones) — this text is inert, not a
// visible defect, until a later pass wires the real opening condition.

import type { WorldSlice } from '../game';
import { FLAG_SAT_IN_POST_OFFICE, POST_OFFICE } from '../act1/ids';
import {
  ACT2_BADGE_WON,
  ACT2_BEAT_DADS_ADVICE,
  ACT2_CHEATED_ONCE,
  ACT2_CLUE_NIGHT_SCHEDULE,
  ACT2_CLUE_NOLAN_FORGOT_ORDER,
  ACT2_CLUE_NO_SUBLEVEL_KINDLY,
  ACT2_CLUE_REPAVING,
  ACT2_CLUE_SAME_HANDS,
  ACT2_CLUE_TUESDAY_DELIVERIES,
  ACT2_CLUE_VERBATIM,
  ACT2_EXAMINED_CUSTODIAN,
  ACT2_HEARD_GATE_TALK,
  ACT2_MEM_M15,
  ACT2_MEM_M19S,
  ACT2_MEM_M4,
  ACT2_MEM_M8,
  ACT2_MET_NOLAN_HOME,
  ACT2_NOLAN,
  ACT2_NOLAN_SUBLEVEL_COUNT,
  ACT2_POKER_BANNED_UNTIL,
  ACT2_POKER_HAND,
  ACT2_POKER_IN_PROGRESS,
  ACT2_POKER_RESULT,
  ACT2_POKER_SESSION,
  ACT2_POKER_STAKE,
  ACT2_POKER_WINS,
  ACT2_Q_INSIDE_THE_PLANT,
  ACT2_Q_NOLAN_OFF_DUTY,
  ACT2_SAW_REPAVING_NOTICE,
  ACT2_STARTED,
  ACT2_TELL_NOLAN,
  ACT2_TELL_WHITLOCK,
} from './ids';
import { ACT3_INSIDE, ACT3_PERIMETER_ROAD } from '../act3/ids';

export const ACT2_D2C_QUESTIONS: NonNullable<WorldSlice['questions']> = {
  [ACT2_Q_NOLAN_OFF_DUTY]: {
    text: 'Off duty, at a card table, is Nolan just a neighbor — or is there a way to learn what he would never say on the clock?',
    // F0 §14 / register 150 — this row had no openWhen and had never once
    // appeared in any player's ledger; P15's ladder was hanging on it.
    openWhen: { met: ACT2_NOLAN },
    answerWhen: { any: [{ flag: ACT2_BADGE_WON }, { flag: ACT2_HEARD_GATE_TALK }] },
    answer: 'Both, and the second is easier than it looks.\n\nOn a Friday, under the low light, with the chairs down off the tables, he stops dealing between two hands and talks about his week: a convoy that clears the apron of everybody including him, and a building he has run for eleven years and has never once been inside during the hours that belong to maintenance.\n\nHe is not being indiscreet. He is a man off duty, telling a card table about his job. And if you ask him before you stand up, he will hand his badge across the felt, because he does not mind where it says he has been.',
  },
  [ACT2_Q_INSIDE_THE_PLANT]: {
    text: 'Every route into that plant runs through a badge, a truck, or a lie. Which one actually gets you inside?',
    // F0 §13 / register 150 — one pooled, route-agnostic answer for all five
    // doors; act3_inside also catches the service-tunnel route the two
    // answerQuestion effects never covered.
    openWhen: { visited: ACT3_PERIMETER_ROAD },
    answerWhen: { flag: ACT3_INSIDE },
    answer: 'Any of them, which is not the answer I went out there expecting. The gate is the only part of that plant that behaves like a gate.\n\nWhatever I came through — a badge that told the county the man who runs the place had arrived for work, a turnstile that turns for anybody standing close enough behind a man who holds doors, a vendor number in a box on a clipboard, a fence, or a mile of dark under the grazing land — nothing on the far side of it moved, or sounded, or asked me anything at all.\n\nIt is not built to keep a man out. It is built for people who belong there, and it has no way whatever of telling the difference.',
  },
};

// ---------------------------------------------------------------------------
// Flags (§2's table — this task's own seventeen).
// ---------------------------------------------------------------------------

export const ACT2_D2C_FLAGS: WorldSlice['flags'] = {
  [ACT2_POKER_IN_PROGRESS]: { default: false, doc: "set by SIT/JOIN GAME/PLAY POKER succeeding (poker.ts) — gates the diner's own bare poker-verb room handlers" },
  [ACT2_POKER_SESSION]: { default: 0, doc: 'incremented at the end of every session (win, lose, or caught) — the second-Friday same-hands clue reads it at atLeast: 1' },
  [ACT2_POKER_HAND]: { default: 0, doc: '0 before/between sessions, 1–3 during one — which hand the script is currently resolving' },
  [ACT2_POKER_WINS]: { default: 0, doc: 'hands won so far this session (win = 2 of 3) — reset to 0 at the start of each session' },
  [ACT2_POKER_STAKE]: { default: 'none', doc: "'none' | 'jack' | 'own' — who staked the current/most recent session" },
  [ACT2_POKER_RESULT]: { default: 'none', doc: "'none' | 'won' | 'lost' | 'caught' — the most recently completed session's outcome" },
  [ACT2_TELL_NOLAN]: { default: false, doc: 'set by WATCH NOLAN, M8 already granted, or Dad following on hand 1 — read by hand 1\'s CALL' },
  [ACT2_TELL_WHITLOCK]: { default: false, doc: 'declared per the plan\'s own state table; unused this build — see ids.ts\'s own comment' },
  [ACT2_CHEATED_ONCE]: { default: false, doc: 'set by the first SWAP DECK ever — a second swap in ANY session (not reset per-session) is the catch' },
  [ACT2_POKER_BANNED_UNTIL]: { default: false, doc: 'a due-day flag (onOrAfterDay), set to clock.day + 7 when caught' },
  [ACT2_BEAT_DADS_ADVICE]: { default: false, doc: "set by calling hand 3 against Dad's advice and winning, while he is following — M19-S's trigger" },
  [ACT2_HEARD_GATE_TALK]: { default: false, doc: 'set by any completed session that reaches the gate talk (between hands 2 and 3) — P15\'s other route; grants two clues' },
  [ACT2_BADGE_WON]: { default: false, doc: 'set by ASK NOLAN ABOUT BADGE/SUBLEVEL at the table (or on a later win) — moves the badge to inventory' },
  [ACT2_NOLAN_SUBLEVEL_COUNT]: { default: 0, doc: "Nolan's own topic_sublevel, inc'd every hearing — at atLeast: 2, ACT2_CLUE_VERBATIM is granted silently" },
  [ACT2_MET_NOLAN_HOME]: { default: false, doc: 'set by the first evening greeting at the yard (an event, {met: ACT2_NOLAN}) — not strictly read by anything (M8\'s own trigger is the met cond directly)' },
  [ACT2_EXAMINED_CUSTODIAN]: { default: false, doc: 'set by EXAMINE on the Custodian at ANY post — M15\'s trigger' },
  [ACT2_SAW_REPAVING_NOTICE]: { default: false, doc: 'set by reading the county notice on the post office board, once the cache is found — read by nothing yet (L20/Stage E)' },
};

// ---------------------------------------------------------------------------
// Clues. Detail text below is a mechanical recap composed from this task's
// own already-authored scenes (Nolan's topics, the gate talk, Pearl's
// topic_visit) — matching the shorthand "clue codex" register D1's own
// `ACT2_D1_CLUES` uses (e.g. `CACHE_CONTENTS_DETAIL`), not fresh narrative
// prose. Neither the plan nor the prose doc authors clue title/detail text
// separately from the discovery scene itself; declaring these is required
// (`effects.ts`'s `grantClue` throws if `world.clues[id]` is undefined),
// so this is composed rather than invented from nothing — flagged in this
// task's report for a narrative-writer spot-check regardless.
// ---------------------------------------------------------------------------

export const ACT2_D2C_CLUES: NonNullable<WorldSlice['clues']> = {
  [ACT2_CLUE_VERBATIM]: {
    title: 'The same sentence, twice',
    detail:
      "Nolan says the same thing about Sublevel 6 every time he's asked, in exactly the same words — the sentence he says at the poker table and the sentence he says on his own step are the same sentence, word for word.",
  },
  [ACT2_CLUE_SAME_HANDS]: {
    title: 'The same three hands',
    detail:
      'The second Friday session plays out card for card the same as the first — the same three hands, in the same order, with the same money going the same way round the table. Nobody at the table finds this remarkable.',
  },
  [ACT2_CLUE_TUESDAY_DELIVERIES]: {
    title: 'The Tuesday convoy',
    detail:
      "Deliveries to the plant now come in on Tuesdays, six trucks nose to tail with a manifest a yard long, and the yard is cleared of everyone — Nolan included — while they're on the apron.",
  },
  [ACT2_CLUE_NIGHT_SCHEDULE]: {
    title: 'The maintenance window',
    detail:
      "Maintenance has the building to itself every night, from the last office light going off to the first shift coming on — and Nolan, who has run the place eleven years, has never once been inside it during that window.",
  },
  [ACT2_CLUE_NO_SUBLEVEL_KINDLY]: {
    title: 'Said kindly',
    detail:
      "Nolan says there is no Sublevel 6 the same way he'd tell you which day the bins go — no edge on it, entirely ready to say it again. He is not lying. He believes it.",
  },
  [ACT2_CLUE_NOLAN_FORGOT_ORDER]: {
    title: "The order Nolan doesn't remember",
    detail:
      "Nolan recognizes the reassembled work order as his own department's — the right form, the right hand, the gate office — but has no memory of it at all, and says so plainly, without excuse.",
  },
  [ACT2_CLUE_REPAVING]: {
    title: 'The road nobody explains',
    detail:
      "The county has asked the state about crushed stone for milling and resurfacing the full length of Main Street — work that has never once been worth doing before now, and nobody will say why it's worth doing today.",
  },
};

export const ACT2_D2C_MEMORIES: NonNullable<WorldSlice['memories']> = {
  // §22.1 — M4, *The Stakeout* (recent).
  [ACT2_MEM_M4]: {
    title: 'The Stakeout',
    lines: [
      'You have sat on this bench before.',
      'Not in this light. A different day, with a cup of something you had let go cold on the tile beside your foot, and the brass wall in front of you, and one door in it you were watching.',
      'You were not watching for a letter. You were watching to see who came for it, and the whole day was worth it or it was not worth it depending on a thing you would know in about a second and a half, and you sat there from the bulbs coming on to the bulbs being the only light in the room.',
      'Nobody came.',
      'You remember the not-coming with your legs. That is where a wait like that lives afterwards.',
    ],
    trigger: { when: { all: [{ flag: FLAG_SAT_IN_POST_OFFICE }, { at: POST_OFFICE }, { flag: ACT2_STARTED }] } },
  },
  // §22.2 — M8, *Said Kindly* (seeded).
  [ACT2_MEM_M8]: {
    title: 'Said Kindly',
    lines: [
      'An office with a window onto a plant floor, and a man behind a desk with his boots off under it.',
      'He is not being difficult. That is the thing you keep, out of a room you cannot otherwise place: he was not being difficult in any way at all.',
      '*There is no Sublevel 6.* Said kindly. Said the way you would tell somebody which day the bins go.',
      'And a hand — not his, closer than his, your own end of the desk — putting a pencil down flat on a page rather than through it.',
    ],
    trigger: { when: { met: ACT2_NOLAN } },
  },
  // §22.4 — M15, *Three Different Days* (recent).
  [ACT2_MEM_M15]: {
    title: 'Three Different Days',
    lines: [
      'Grey coveralls, at the edge of a day.',
      'At the edge of a different day, on a different street, with a different thing in his hands.',
      'At the edge of a third, and you had already stopped putting it in the book by then, because a man doing maintenance is not an entry.',
      'Three days you can put in order and cannot put a date on. Three streets. One set of coveralls, the clean kind, and no face at the top of them at all — because you never once looked at the face, and you know exactly why: there was never anything about him that was going to be worth the ink.',
    ],
    trigger: { when: { flag: ACT2_EXAMINED_CUSTODIAN } },
  },
  // §22.5 — M19-S, *His Bluff Face* (family; exclusive, social).
  [ACT2_MEM_M19S]: {
    title: 'His Bluff Face',
    lines: [
      'A kitchen table with the good cloth off it, and five of you round it, and a man at the head who has been beaten by a child and is enjoying it more than the child is.',
      'He has a face he does for it. Everybody at that table knows the face. The whole trick of the man is that he knows they know, and does it anyway, and half the time he has got it, and the reason nobody can ever call him is that he does not mind losing.',
      'You are small enough that the chair is wrong. You put your hand out and say the word, and he turns them over, and he has nothing at all, and he laughs until he has to put a hand on the table.',
      "*That's the one,* he says. *That's my boy.*",
      'He said that to all of you. He meant it every time. That is not a flaw in the memory.',
    ],
    trigger: { when: { flag: ACT2_BEAT_DADS_ADVICE } },
  },
};

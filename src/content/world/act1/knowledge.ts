// Act I, room 1 — flags, clues, memory (prose doc §1, §6).
//
// Every clue's `title`/`detail` and the memory's `lines` are transcribed
// verbatim from the prose document (hard rule 5). The memory's `title` is
// the one string the document never supplies (§6 gives the three paragraphs
// but names no title anywhere) — flagged in this task's report; the
// placeholder below is a plain, non-narrative label, not authored prose,
// and must be replaced by the narrative-writer before this ships.

import type { WorldDef } from '../../../engine/world';
import { EXIT_TRAVEL_TEXT_LIT } from './room';
import {
  CLUE_BOLT_THROWN,
  CLUE_CALM_SEARCH,
  CLUE_DRAWER_HELD,
  CLUE_HOUSE_EMPTY,
  CLUE_NO_NAME_RECALLED,
  CLUE_NOTHING_NAMED,
  CLUE_PAGE_INDENTATION,
  CLUE_REGISTER_GAP,
  CLUE_REGISTER_IMPRESSION,
  CLUE_TERMINAL_BURN,
  CLUE_VISITOR_UNREMARKABLE,
  CLUE_WINDOW_EXIT,
  FLAG_DOOR_BOLT_DRAWN,
  FLAG_LAMP_FIRST_OFF_DONE,
  FLAG_LAMP_FIRST_ON_DONE,
  FLAG_LAMP_RIGHTED,
  FLAG_MARLOW_KNOWS_YOU_KNOW,
  FLAG_MARLOW_PRESSED,
  FLAG_MARLOW_TOLD_ABOUT_ROOM,
  FLAG_MET_MARLOW,
  FLAG_POCKETS_CHECKED,
  FLAG_REGISTER_GAP_SEEN,
  FLAG_REGISTER_IMPRESSION_FOUND,
  FLAG_ROOM_SEARCHED,
  FLAG_SPARE_KEY_GIVEN,
  FLAG_STOOD_UP,
  FLAG_TERMINAL_TRIED,
  FLAG_TOWEL_TAKEN,
  FLAG_WINDOW_OPEN,
  FLAG_WOUND_EXAMINED,
  LANDING,
  MEM_HAT,
  PUZZLE_LEAVE_YOUR_ROOM,
  PUZZLE_REGISTER,
  QUESTION_OUT_OF_THIS_ROOM,
  QUESTION_THE_RECORD,
} from './ids';

/**
 * Shared verbatim (hard rule 5) between `CLUE_REGISTER_IMPRESSION`'s
 * `detail` below and `question.act1_q_the_record`'s settled-answer recap
 * (§15.1) — one string, not two copies that could drift, the same
 * "reuse, don't duplicate" convention `room.ts`'s `EXIT_TRAVEL_TEXT_LIT`
 * uses for the other question's own recap.
 */
const REGISTER_IMPRESSION_DETAIL =
  'Under where the page was: a time in the small hours, your room number, and a name column with one begun-and-abandoned pen stroke in it. Somebody called on your room that night and nobody wrote down who.';

export const ACT1_FLAGS: WorldDef['flags'] = {
  [FLAG_STOOD_UP]: { default: false, doc: 'set by the first STAND/GET UP, or implicitly by the first movement action' },
  [FLAG_LAMP_RIGHTED]: { default: false, doc: 'set by RIGHT LAMP; cleared by TIP LAMP — gates the room description and the raking light on page 7/8' },
  [FLAG_ROOM_SEARCHED]: { default: false, doc: 'set by the first successful SEARCH PAPERS' },
  [FLAG_TERMINAL_TRIED]: { default: false, doc: 'set by the first USER NOT RECOGNIZED render' },
  [FLAG_POCKETS_CHECKED]: { default: false, doc: 'set by X POCKETS / SEARCH ME' },
  [FLAG_WOUND_EXAMINED]: { default: false, doc: 'set by X WOUND / TOUCH HEAD' },
  [FLAG_DOOR_BOLT_DRAWN]: { default: false, doc: 'set by the first OPEN DOOR — gates the door description' },
  [FLAG_WINDOW_OPEN]: { default: false, doc: 'set by OPEN WINDOW — gates the room smell' },
  [FLAG_LAMP_FIRST_ON_DONE]: { default: false, doc: 'builder addition — §4.3\'s pull-chain first-light line, see ids.ts' },
  [FLAG_LAMP_FIRST_OFF_DONE]: { default: false, doc: 'builder addition — §4.3\'s pull-chain first-dark-again line, see ids.ts' },

  // -------------------------------------------------------------------
  // Front Desk & Lobby (front-desk-prose §1's table)
  // -------------------------------------------------------------------
  [FLAG_MET_MARLOW]: { default: false, doc: 'set by front_desk\'s own onEnter (first entry) — gates room description rule 2 and marlow\'s greeting rotation' },
  [FLAG_REGISTER_GAP_SEEN]: { default: false, doc: 'set by EXAMINE/READ/SEARCH on the register — gates marlow\'s register topic variant 2' },
  [FLAG_REGISTER_IMPRESSION_FOUND]: { default: false, doc: 'set by the impression discovery (sight or touch) — gates marlow\'s visitor and register topics' },
  [FLAG_MARLOW_PRESSED]: { default: false, doc: 'set by the first visitor topic response while register_impression_found' },
  [FLAG_MARLOW_KNOWS_YOU_KNOW]: { default: false, doc: 'set by the first register topic response while register_impression_found' },
  [FLAG_MARLOW_TOLD_ABOUT_ROOM]: { default: false, doc: 'set by TELL MARLOW ABOUT ROOM' },
  [FLAG_SPARE_KEY_GIVEN]: { default: false, doc: 'set by marlow\'s key topic' },
  [FLAG_TOWEL_TAKEN]: { default: false, doc: 'set by TAKE TOWEL / USE TOWEL' },
};

export const ACT1_CLUES: NonNullable<WorldDef['clues']> = {
  [CLUE_CALM_SEARCH]: {
    title: 'The search took its time',
    detail:
      'Glass under the papers, a dry water ring under the glass, a desk moved rather than knocked over. Whoever went through this room was not in a hurry.',
  },
  [CLUE_DRAWER_HELD]: {
    title: 'One drawer held',
    detail: 'Two drawers pulled and emptied, a third pried at and abandoned. Something is still in it.',
  },
  [CLUE_BOLT_THROWN]: {
    title: 'The bolt was thrown from inside',
    detail: 'The door was bolted from this side, and a bolt on this side can only be thrown from this side.',
  },
  [CLUE_WINDOW_EXIT]: {
    title: 'Somebody left by the window',
    detail: 'Latch open, the paint broken along the sash, two long smears in the sill dust going out.',
  },
  [CLUE_NOTHING_NAMED]: {
    title: 'Nothing here has a name on it',
    detail: 'Not one sheet of paper, not one pocket, carries a name. Less like an accident than like a policy.',
  },
  [CLUE_PAGE_INDENTATION]: {
    title: 'The blank page is not blank',
    detail: 'Held in low sideways light, the page carries the pressed ghost of handwriting from a sheet that rested on top of it.',
  },
  [CLUE_TERMINAL_BURN]: {
    title: 'The terminal has been asking a long time',
    detail: '`USER:` is burned into the phosphor.',
  },

  // -------------------------------------------------------------------
  // Front Desk & Lobby (front-desk-prose §1's table)
  // -------------------------------------------------------------------
  [CLUE_REGISTER_GAP]: {
    title: 'A page is missing from the register',
    detail:
      'The guest book has had a page pulled out along the gutter. The torn edge is still bright, so it came out recently — and the week it covered is the week you were in the house.',
  },
  [CLUE_REGISTER_IMPRESSION]: {
    title: 'The missing page pressed through',
    detail: REGISTER_IMPRESSION_DETAIL,
  },
  [CLUE_NO_NAME_RECALLED]: {
    title: "The clerk can't produce your name",
    detail: 'Marlow wrote it in the book himself and cannot recall it without the book. He is not refusing. He is looking for it.',
  },
  [CLUE_HOUSE_EMPTY]: {
    title: 'The house was nearly empty',
    detail:
      'Most hooks on the key board have a key on them, and a key on a hook is a room with nobody in it. Whatever happened upstairs happened in a mostly empty building.',
  },
  [CLUE_VISITOR_UNREMARKABLE]: {
    title: "He saw the man and can't describe him",
    detail:
      'Pressed, Marlow allows that somebody came in late for the top floor and said he was there to see to something. Asked what the man looked like, he starts three times and stops.',
  },
};

export const ACT1_MEMORIES: NonNullable<WorldDef['memories']> = {
  // MISSING STRING (report): the prose doc's §6 never names a title for
  // this memory. "The Hat" is a plain, non-narrative placeholder — not
  // authored prose — standing in until the narrative-writer supplies one.
  [MEM_HAT]: {
    title: 'The Hat',
    // §6's second and third code fences (the first — "The hat settles, and
    // something settles with it." — is the transition INTO the memory, a
    // plain `say` beat rendered by object.fedora.wear before this fires,
    // not part of the recalled memory text itself; see objects/fedora.ts).
    lines: [
      'Rain — and the sound of rain on a hat is not the sound of rain on your head. It is closer, and drier, and oddly private, like being told something. There is somebody two steps ahead of you on a wet sidewalk, talking, and you are not listening, because you are thinking about how the brim keeps the water off the back of your neck, and about how you have never in your life owned anything that did that.',
      'Then it is gone, in the way a smell is gone, and you are standing in a cold room in a borrowed-feeling hat.\n\nThe hat fits. You have no idea whether that is good news.',
    ],
  },
};

// ---------------------------------------------------------------------------
// Hint ladders — front-desk-prose appendix §15. The first real
// questions/puzzles in this game; `hints` are transcribed verbatim
// (hard rule 5). `answer` recap text is not supplied anywhere in the
// prose document (flagged in this task's report as a narrative-writer
// gap) — `checkQuestionAnswers` (`validate.ts`) requires one once
// `answerWhen` is declared, so each recap below reuses an exact,
// already-approved line from elsewhere in this content rather than
// inventing new prose (hard rule 5): `question.act1_q_the_record`'s recap
// is `CLUE_REGISTER_IMPRESSION`'s own detail (what the player actually
// learned); `question.act1_q_out_of_this_room`'s is the lit exit's own
// travelText (literally how they left). Both are builder decisions, not
// narrative-writer-authored recaps — flagged for confirmation.
// ---------------------------------------------------------------------------

export const ACT1_QUESTIONS: NonNullable<WorldDef['questions']> = {
  [QUESTION_THE_RECORD]: {
    text: 'Who wrote you into this house, and what became of the record of it?',
    openWhen: { flag: FLAG_MET_MARLOW },
    answerWhen: { flag: FLAG_REGISTER_IMPRESSION_FOUND },
    answer: REGISTER_IMPRESSION_DETAIL,
  },
  [QUESTION_OUT_OF_THIS_ROOM]: {
    text: 'How do you get out of this room?',
    openWhen: { flag: FLAG_STOOD_UP },
    answerWhen: { visited: LANDING },
    answer: EXIT_TRAVEL_TEXT_LIT,
  },
};

export const ACT1_PUZZLES: NonNullable<WorldDef['puzzles']> = {
  [PUZZLE_REGISTER]: {
    id: PUZZLE_REGISTER,
    name: 'The register',
    question: QUESTION_THE_RECORD,
    solvedWhen: { flag: FLAG_REGISTER_IMPRESSION_FOUND },
    // Two solution classes, deliberately (§4.2's own note): sight (raking
    // light off the desk lamp) and touch (a fingertip on the ridges) both
    // set the same flag, so neither `solutions` entry needs its own
    // `route` — omitted, which `validate.ts` reads as trivially clock-free
    // (§4.3.4) — and no `missedRecovery` is needed either (neither route
    // is clock-gated; both are open from the first turn in the room).
    solutions: [
      { id: 'light', class: 'analytical', note: "Rake the desk lamp's light across the blank page (TILT REGISTER / EXAMINE BLANK PAGE / HOLD TO LAMP, etc.)." },
      { id: 'touch', class: 'analytical', note: "Feel the blank page's pressed ridges (FEEL PAGE / RUB PAGE / TOUCH PAGE, etc.)." },
    ],
    hints: [
      'The man behind the desk is a source, not scenery, and he has been on shift all night. Ask him things: ASK MARLOW ABOUT KEY, ASK MARLOW ABOUT MY NAME, ASK MARLOW ABOUT MY ROOM. TALK TO MARLOW starts him off on his own, and he will mention most of what he is willing to discuss.',
      'The tall book open on the counter is a record of everyone who has slept in this house, kept in one hand, in pencil. Look at it properly, and then look for the week you would be in.',
      'A page is gone and the sheet under it is blank. Blank is not the same as empty. A pen bearing down on one sheet leaves valleys in the next, and this game has already worked that trick on you once tonight, upstairs, with a page and a lamp lying on its side. Light across paper, or a fingertip on it.',
      'Turn the register until the desk lamp comes across the blank sheet flat, or put a hand on it and read it that way. Then take what you find back to the clerk — he is the person it is about.',
      'EXAMINE REGISTER. Then TILT REGISTER (FEEL PAGE works too, and so does EXAMINE BLANK PAGE). The impression gives you a time in the small hours, your own room number, and a name column with one pen stroke in it that was begun and abandoned. Then ASK MARLOW ABOUT REGISTER, and ASK MARLOW ABOUT VISITOR.',
    ],
  },
  [PUZZLE_LEAVE_YOUR_ROOM]: {
    id: PUZZLE_LEAVE_YOUR_ROOM,
    name: 'Getting out of the room',
    question: QUESTION_OUT_OF_THIS_ROOM,
    solvedWhen: { visited: LANDING },
    solutions: [{ id: 'light_and_leave', class: 'direct', note: 'Pull the chain, take the fedora, search it, draw the bolt, and go out.' }],
    hints: [
      'Nothing in this room is locked against you. The door has a bolt on your side of it and no one else\'s; the room is a place to search, not a cell. If you are stuck, you are stuck on seeing, not on opening.',
      'It is dark, and the light in here is on the floor where it fell. The lamp has a pull chain. Almost nothing else in the room can be examined until it is lit.',
      'Once there is light: LOOK, and then examine the things the description names. This game rewards TAKE and SEARCH on anything a person would pick up — and one thing on this floor is yours, was on your head, and is not empty.',
      'Pull the chain. Stand the lamp up. Take the hat and search its band. Then draw the bolt and open the door.',
      'PULL CHAIN. RIGHT LAMP. LOOK. TAKE FEDORA. SEARCH FEDORA. Then OPEN DOOR and OUT. (The door opens from either side afterwards. You can come back.)',
    ],
  },
};

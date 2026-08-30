// Act I, room 1 — flags, clues, memory (prose doc §1, §6).
//
// Every clue's `title`/`detail` and the memory's `lines` are transcribed
// verbatim from the prose document (hard rule 5). The memory's `title` is
// the one string the document never supplies (§6 gives the three paragraphs
// but names no title anywhere) — flagged in this task's report; the
// placeholder below is a plain, non-narrative label, not authored prose,
// and must be replaced by the narrative-writer before this ships.

import type { WorldDef } from '../../../engine/world';
import {
  CLUE_BOLT_THROWN,
  CLUE_CALM_SEARCH,
  CLUE_DRAWER_HELD,
  CLUE_NOTHING_NAMED,
  CLUE_PAGE_INDENTATION,
  CLUE_TERMINAL_BURN,
  CLUE_WINDOW_EXIT,
  FLAG_DOOR_BOLT_DRAWN,
  FLAG_LAMP_FIRST_OFF_DONE,
  FLAG_LAMP_FIRST_ON_DONE,
  FLAG_LAMP_RIGHTED,
  FLAG_OPENING_SEEN,
  FLAG_POCKETS_CHECKED,
  FLAG_ROOM_SEARCHED,
  FLAG_STOOD_UP,
  FLAG_TERMINAL_TRIED,
  FLAG_WINDOW_OPEN,
  FLAG_WOUND_EXAMINED,
  MEM_HAT,
} from './ids';

export const ACT1_FLAGS: WorldDef['flags'] = {
  [FLAG_STOOD_UP]: { default: false, doc: 'set by the first STAND/GET UP, or implicitly by the first movement action' },
  [FLAG_LAMP_RIGHTED]: { default: false, doc: 'set by RIGHT LAMP; cleared by TIP LAMP — gates the room description and the raking light on page 7/8' },
  [FLAG_ROOM_SEARCHED]: { default: false, doc: 'set by the first successful SEARCH PAPERS' },
  [FLAG_TERMINAL_TRIED]: { default: false, doc: 'set by the first USER NOT RECOGNIZED render' },
  [FLAG_POCKETS_CHECKED]: { default: false, doc: 'set by X POCKETS / SEARCH ME' },
  [FLAG_WOUND_EXAMINED]: { default: false, doc: 'set by X WOUND / TOUCH HEAD' },
  [FLAG_DOOR_BOLT_DRAWN]: { default: false, doc: 'set by the first OPEN DOOR — gates the door description' },
  [FLAG_WINDOW_OPEN]: { default: false, doc: 'set by OPEN WINDOW — gates the room smell' },
  [FLAG_OPENING_SEEN]: { default: false, doc: 'builder addition — gates §2\'s opening beats to a single render at game start; see ids.ts' },
  [FLAG_LAMP_FIRST_ON_DONE]: { default: false, doc: 'builder addition — §4.3\'s pull-chain first-light line, see ids.ts' },
  [FLAG_LAMP_FIRST_OFF_DONE]: { default: false, doc: 'builder addition — §4.3\'s pull-chain first-dark-again line, see ids.ts' },
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

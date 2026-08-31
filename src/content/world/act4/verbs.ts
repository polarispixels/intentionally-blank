// Stage E1, task L — two new bare verbs for the Staging Area
// (`docs/superpowers/specs/2026-09-18-stage-e1-prose.md` §4.2, §9.4). Both
// are fixed-phrase, no-`dobj` verbs (same idiom as `act2/verbs.ts`'s own
// `V_WRITE`/`V_POST_LETTER`): `V_ACT4_WRITE_ON`'s two-word form ("write
// on") stops it colliding with `act2_write`'s bare "write" word
// (`validate.ts`'s verb-word-collision check groups by exact phrase, not
// per-word — see `ids.ts`'s own comment on this id); `V_ACT4_PUSH_PAST`
// covers the detail's escape-attempt phrasings ("push past", "run", …).
//
// `V_ACT4_WRITE_ON`'s own `default` carries §4.2's text directly — no
// object handler needed, since nothing else in the game ever declares this
// word and the whiteboard is the only sensible target; `whiteboard.ts`
// (`objects/stagingArea.ts`) still declares an explicit handler for it too,
// for parity with its RUB/TAKE handlers and so a specific dobj ("write on
// TABLE") that isn't the board falls through correctly (there being no
// other object with a "board"-shaped noun to collide with, this is belt and
// braces, not load-bearing). `V_ACT4_PUSH_PAST` is genuinely bare (no dobj
// at all) — its `default` is the whole answer, §9.4's own text.

import type { VerbDef } from '../../../engine/world';
import { V_ACT4_PUSH_PAST, V_ACT4_WRITE_ON } from './ids';

const WRITE_ON_BOARD_TEXT =
  'There is a man at each end of this room being paid to notice exactly this, and\nyou are going to be in here for a while yet.\n\nYou put your hands where they were.';

export const PUSH_PAST_DETAIL_TEXT =
  'No.\n\nYou have been hit on the head once this month by somebody better at it than you\nare, and these two do it professionally, in pairs, and would be extremely sorry\nabout it afterwards, in writing.';

export const ACT4_L_VERBS: Record<string, VerbDef> = {
  [V_ACT4_WRITE_ON]: {
    id: V_ACT4_WRITE_ON,
    words: ['write on', 'draw on'],
    patterns: ['V dobj'],
    class: 'direct',
    default: WRITE_ON_BOARD_TEXT,
  },
  [V_ACT4_PUSH_PAST]: {
    id: V_ACT4_PUSH_PAST,
    words: ['push past', 'barge past', 'force past', 'shove past', 'run', 'flee'],
    patterns: ['V'],
    class: 'direct',
    default: PUSH_PAST_DETAIL_TEXT,
  },
};

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
// --- E2 task O ---
// "GO FIRST"/"TAKE THE FIRST TURN" (`docs/superpowers/specs/2026-09-19-
// stage-e2-prose.md` §18.1) — a bare fixed-phrase verb, same idiom as this
// file's own `V_ACT4_WRITE_ON`/`V_ACT4_PUSH_PAST` (no natural dobj — the
// Chamber's own chairs already answer "SIT IN FIRST CHAIR" directly). Its
// `default` is never actually reached (the room's own handler on this verb,
// `../escapeChamber.ts`, always matches first — one of `{ not: { flag:
// act4_chamber_first_done } }` or its unconditional fallback), but
// `validate.ts` requires a non-null `default` on every non-meta verb; it
// reuses §18.1's own success text verbatim rather than inventing dead
// placeholder prose (hard rule 5).
import { V_ACT4_GO_FIRST } from './ids';
import { CHAIRS_SIT_FIRST_TEXT } from './objects/escapeChamber';

export const ACT4_O_VERBS: Record<string, VerbDef> = {
  [V_ACT4_GO_FIRST]: {
    id: V_ACT4_GO_FIRST,
    words: ['go first', 'take the first turn'],
    patterns: ['V'],
    class: 'direct',
    default: CHAIRS_SIT_FIRST_TEXT,
  },
};

// --- E2 task P ---
// The comms rig's `SEND MESSAGE`/`TYPE ON RIG` (`docs/superpowers/specs/
// 2026-09-19-stage-e2-prose.md` §28.2) — a bare fixed-phrase verb, same
// idiom as this file's own `V_ACT4_WRITE_ON`/`V_ACT4_PUSH_PAST` above (no
// natural "message" object to hang a dobj handler on). Its `default`
// reuses `RIG_SEND_MESSAGE_TEXT` verbatim from `./objects/hab.ts` (co-
// located with the rig object, whose own `USE_VERB_ID` handler answers the
// identical "USE RIG" phrasing) rather than a second copy of the string.
import { V_ACT4_SEND_MESSAGE } from './ids';
import { RIG_SEND_MESSAGE_TEXT } from './objects/hab';

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

// --- E2 task P ---
export const ACT4_P_VERBS: Record<string, VerbDef> = {
  [V_ACT4_SEND_MESSAGE]: {
    id: V_ACT4_SEND_MESSAGE,
    words: ['send message', 'send a message', 'type on rig', 'transmit message'],
    patterns: ['V'],
    class: 'direct',
    default: RIG_SEND_MESSAGE_TEXT,
  },
};

// --- E2 task Q ---
// "DEVELOP"/"DEVELOP FILM" (`docs/superpowers/specs/2026-09-19-stage-e2-
// prose.md` §44). A plain new word — grepped clean against every verbs.ts
// in the codebase — rather than an act4-prefixed compound phrase, since it
// reads as ordinary vocabulary and nothing else claims it. `default`
// reuses `VERB_DEFAULTS.touch` (the same "borrow an adjacent generic
// family rather than invent placeholder prose" idiom `act2/verbs.ts`'s own
// `V_FIT` uses for COMPARE/MATCH) — this default only ever fires for an
// object nobody expected to be developed (§57's own commissioned "DEVELOP
// FILM with no canister"/"DEVELOP POLAROID", not this task's own scope).
import { VERB_DEFAULTS } from '../../responses';
import { V_DEVELOP } from './ids';

export const ACT4_Q_VERBS: Record<string, VerbDef> = {
  [V_DEVELOP]: {
    id: V_DEVELOP,
    words: ['develop'],
    patterns: ['V dobj'],
    class: 'direct',
    default: VERB_DEFAULTS.touch,
  },
};

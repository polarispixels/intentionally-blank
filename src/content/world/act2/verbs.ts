// Act II — the four pass-time verbs (Stage D plan §3 E4; main-session
// ruling 2). Bare (`'V'`), no direct object, `class: null` (neutral —
// matches the existing WAIT/SLEEP verbs' own convention,
// `act1/verbs.ts`). Every room-level handler that actually answers these
// is wired by `act2/index.ts`'s loop, not here; `default` below is each
// verb's rung-2 fallback for a room the loop hasn't reached (there is none
// in D0 — every Zone 1 room gets a handler — so this default is, in
// practice, unreachable the same way `act1_find_my_name`'s own `default`
// is; see `verbs.ts`'s own comment on that idiom). Reusing the outdoor
// pass-time line itself as the default (rather than inventing new prose)
// follows the same idiom `act1/verbs.ts` already uses for `V_CHECK_DATE`/
// `V_FIND_MY_NAME`: the verb's `default` is the exact text its one real
// handler renders, transcribed once and shared, not a second string.
//
// Words: the plan's own three prepositions plus "sleep until <phase>", plus
// the writer's own synonym note (`docs/superpowers/specs/2026-09-08-stage-
// d0-presence-and-passage.md` §5.4): dawn/daybreak/sunrise → morning,
// noon → afternoon, sunset/dusk → evening, midnight → night.

import type { VerbDef } from '../../../engine/world';
import { OUTDOOR_LINES } from './time';
import {
  V_ACT2_WAIT_UNTIL_AFTERNOON,
  V_ACT2_WAIT_UNTIL_EVENING,
  V_ACT2_WAIT_UNTIL_MORNING,
  V_ACT2_WAIT_UNTIL_NIGHT,
} from './ids';

export const ACT2_VERBS: Record<string, VerbDef> = {
  [V_ACT2_WAIT_UNTIL_MORNING]: {
    id: V_ACT2_WAIT_UNTIL_MORNING,
    words: ['wait until morning', 'wait for morning', 'wait till morning', 'sleep until morning', 'wait until dawn', 'wait until daybreak', 'wait until sunrise'],
    patterns: ['V'],
    class: null,
    default: OUTDOOR_LINES.morning,
  },
  [V_ACT2_WAIT_UNTIL_AFTERNOON]: {
    id: V_ACT2_WAIT_UNTIL_AFTERNOON,
    words: ['wait until afternoon', 'wait for afternoon', 'wait till afternoon', 'sleep until afternoon', 'wait until noon'],
    patterns: ['V'],
    class: null,
    default: OUTDOOR_LINES.afternoon,
  },
  [V_ACT2_WAIT_UNTIL_EVENING]: {
    id: V_ACT2_WAIT_UNTIL_EVENING,
    words: ['wait until evening', 'wait for evening', 'wait till evening', 'sleep until evening', 'wait until sunset', 'wait until dusk'],
    patterns: ['V'],
    class: null,
    default: OUTDOOR_LINES.evening,
  },
  [V_ACT2_WAIT_UNTIL_NIGHT]: {
    id: V_ACT2_WAIT_UNTIL_NIGHT,
    words: ['wait until night', 'wait for night', 'wait till night', 'sleep until night', 'wait until midnight'],
    patterns: ['V'],
    class: null,
    default: OUTDOOR_LINES.night,
  },
};

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
import { VERB_DEFAULTS } from '../../responses';
import { RUB, ACT1_VERBS } from '../act1/verbs';
import { OUTDOOR_LINES } from './time';
import { ACT2_DRIVE_TO_PLANT_TEXT } from './scripts';
import {
  V_ACT2_DRIVE_TO_PLANT,
  V_ACT2_WAIT_UNTIL_AFTERNOON,
  V_ACT2_WAIT_UNTIL_EVENING,
  V_ACT2_WAIT_UNTIL_MORNING,
  V_ACT2_WAIT_UNTIL_NIGHT,
  V_FIT,
} from './ids';

// ---------------------------------------------------------------------------
// D1 — one in-place amendment to an Act I verb, same idiom `act2/index.ts`'s
// own header documents for room `handlers` arrays: `RUB` (act1/verbs.ts)
// ships with only a bare `'V dobj'` pattern, and the wave's rubbing puzzle
// (`RUB PAGE WITH PENCIL`, §13.6) needs the two-object `'V dobj prep iobj'`
// shape on the SAME verb id — a second verb id sharing the word "rub" would
// be a `verb-word-collision` `validate.ts` error (neither side would be
// `isSafelyDisjointByPreposition`-safe, since the existing bare pattern
// isn't exclusively `'V dobj prep iobj'`), and `RUB` can only be declared
// once across the whole merged `world.verbs` table (duplicate ids there are
// a hard `assemble()` error) — so amending act1/verbs.ts directly is out of
// this task's named scope (page78.ts only). Mutating the shared `ACT1_VERBS`
// object in place, at module load, adds the capability without touching
// that file or its own bare-RUB behaviour (`RUB <anything>` with no
// instrument is completely unaffected; only `RUB <x> WITH <y>` newly
// parses). Guarded so this is idempotent if the module is ever imported
// twice under different specifiers.
// ---------------------------------------------------------------------------

if (!ACT1_VERBS[RUB]!.patterns.includes('V dobj prep iobj')) {
  ACT1_VERBS[RUB] = {
    ...ACT1_VERBS[RUB]!,
    patterns: [...ACT1_VERBS[RUB]!.patterns, 'V dobj prep iobj'],
    preps: [...(ACT1_VERBS[RUB]!.preps ?? []), 'with'],
  };
}

export const ACT2_VERBS: Record<string, VerbDef> = {
  // D1 — the notebook/page fitting puzzle (§13.6, R4). "fit"/"compare"/
  // "match" are new words (grepped clean against act1/verbs.ts); "hold" is
  // NOT added here — `V_HUG` (act1/verbs.ts) already claims it (`'hug'`/
  // `'embrace'`/`'hold'`, `'V dobj'`), and neither side would be
  // `isSafelyDisjointByPreposition`-safe, so it would be a
  // `verb-word-collision` error (found by this task's own `validate` run).
  // "HOLD PAGE AGAINST NOTEBOOK" is therefore not reachable; `FIT`/
  // `COMPARE`/`MATCH` are. `PUT_IN` (already `'in'`-prepped, built-in)
  // covers "put ... in ..." on its own and is added directly to the
  // relevant `HandlerDef.verbs` array rather than duplicated here.
  [V_FIT]: {
    id: V_FIT,
    words: ['fit', 'compare', 'match'],
    patterns: ['V dobj prep iobj'],
    preps: ['in', 'with', 'against', 'to'],
    class: 'analytical',
    default: VERB_DEFAULTS.touch,
  },
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
  // D1 — the boundary's second route (§21/§27's wiring summary), a bare,
  // self-contained phrase (same idiom as V_CHECK_DATE/V_FIND_MY_NAME): the
  // room-level handlers at the motel and Town Edge (`act1/jacksMotel.ts`,
  // `act1/townEdge.ts`) are what a player actually reaches; this `default`
  // is the same one authored line, reused rather than duplicated, for a
  // room this verb has no handler in.
  [V_ACT2_DRIVE_TO_PLANT]: {
    id: V_ACT2_DRIVE_TO_PLANT,
    words: ['drive to plant', 'drive to the plant', 'go to plant', 'go to the plant', 'drive north to plant'],
    patterns: ['V'],
    class: 'direct',
    default: ACT2_DRIVE_TO_PLANT_TEXT,
  },
};

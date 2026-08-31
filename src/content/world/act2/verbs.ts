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
import { RUB, SIT, ACT1_VERBS } from '../act1/verbs';
import { V_ASSEMBLE } from '../act1/ids';
import { OUTDOOR_LINES } from './time';
import { ACT2_DRIVE_TO_PLANT_TEXT } from './scripts';
import { ACT2_WRITE_AWAY_TEXT } from './objects/censor';
import {
  V_ACT2_BET,
  V_ACT2_CHECK,
  V_ACT2_DRIVE_TO_PLANT,
  V_ACT2_RAISE,
  V_ACT2_SWAP_DECK,
  V_ACT2_WAIT_UNTIL_AFTERNOON,
  V_ACT2_WAIT_UNTIL_EVENING,
  V_ACT2_WAIT_UNTIL_MORNING,
  V_ACT2_WAIT_UNTIL_NIGHT,
  V_FIT,
  V_PAY,
  V_THREAD,
  V_UNFOLD,
  V_WRITE,
} from './ids';

// ---------------------------------------------------------------------------
// D2-A — one in-place amendment to an Act I verb, same idiom as this file's
// own `RUB` amendment above: `V_ASSEMBLE` (act1/ids.ts, registered in
// act1/verbs.ts) ships with `['assemble', 'piece together', 'reassemble',
// 'sort', 'put together']`; the adapter-parts puzzle (§4.4) wants "COMBINE
// PARTS" too, and "combine" is not claimed by any other verb (grepped
// clean). Mutating the shared `ACT1_VERBS` object in place, at module load,
// same guard idiom (idempotent under a double import).
// ---------------------------------------------------------------------------

if (!ACT1_VERBS[V_ASSEMBLE]!.words.includes('combine')) {
  ACT1_VERBS[V_ASSEMBLE] = { ...ACT1_VERBS[V_ASSEMBLE]!, words: [...ACT1_VERBS[V_ASSEMBLE]!.words, 'combine'] };
}

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

// ---------------------------------------------------------------------------
// D2-C — "JOIN GAME" on the shipped `SIT` (word "join", grepped clean
// against every act1/act2 verb's own word list — same idempotent in-place
// idiom as the two amendments above). `SIT`'s pattern stays `'V dobj'`
// only (see `poker.ts`'s own header on why a bare `'V'` pattern is not
// added here); "join" still needs a following noun phrase ("JOIN GAME"),
// same as "sit"/"sit on"/"sit down" already do. `V_PLAY` (`act1/ids.ts`)
// needs no amendment at all — "play" is already `'V dobj'`, and "PLAY
// POKER" resolves once `poker.ts`'s table object claims the noun "poker".
// ---------------------------------------------------------------------------

if (!ACT1_VERBS[SIT]!.words.includes('join')) {
  // "join" alone (not "join game" as a fixed 2-word phrase — that would
  // consume "game" as part of the verb trigger itself, leaving no dobj for
  // the `'V dobj'` pattern to resolve; found by this task's own test run).
  ACT1_VERBS[SIT] = { ...ACT1_VERBS[SIT]!, words: [...ACT1_VERBS[SIT]!.words, 'join'] };
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
    // D2-B addition: `'V dobj'` (bare — no prep/iobj at all), for "COMPARE
    // REEL" alone. Needed because `HandlerDef.withInstrument` is typed
    // `ObjectId[]` only (`engine/world.ts`) — an NPC (Dad) can never be the
    // matched `iobj` there, so "COMPARE REEL WITH DAD" cannot be gated
    // object-side even though it parses; `objects/countyLibrary.ts`'s own
    // hearing-reel handler answers the bare form instead, gated on
    // `act2_dad_told_hearing` (see that file's own header — the plan's own
    // fallback ruling for exactly this case). D1's page-fitting puzzle
    // keeps using the prepped shape unaffected.
    patterns: ['V dobj prep iobj', 'V dobj'],
    preps: ['in', 'with', 'against', 'to'],
    class: 'analytical',
    default: VERB_DEFAULTS.touch,
  },
  // D2-B — "WRITE LETTER" (§10.2): a bare, fixed-phrase verb, same idiom as
  // `V_POST_LETTER`/`V_ACT2_DRIVE_TO_PLANT` (no "letter" object exists yet
  // to hang a dobj handler on before one is composed). This `default` is
  // §10.3's own text — the Post Office's own room handler
  // (`act1/postOffice.ts`) is the one real place this opens the prompt.
  [V_WRITE]: {
    id: V_WRITE,
    words: ['write', 'write letter', 'compose'],
    patterns: ['V'],
    class: null,
    default: ACT2_WRITE_AWAY_TEXT,
  },
  // D2-B — "UNFOLD LETTER" (§11.3). "FOLD LETTER" is NOT this verb — see
  // `ids.ts`'s own long comment on `V_UNFOLD` for why "fold" itself is
  // wired through `CUT` instead.
  [V_UNFOLD]: {
    id: V_UNFOLD,
    words: ['unfold'],
    patterns: ['V dobj'],
    class: 'direct',
    default: VERB_DEFAULTS.touch,
  },
  // D2-B — "THREAD REEL"/"WIND ON"/"LOAD" (§19). `READ` (built-in) is the
  // other word `objects/countyLibrary.ts`'s two new reels answer to; this
  // is the dedicated word the prose doc's own trigger list also names.
  [V_THREAD]: {
    id: V_THREAD,
    words: ['thread', 'wind on', 'load'],
    patterns: ['V dobj'],
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
  // D2-A — the general store's honor box (§4.2), a bare verb (no dobj to
  // hang it on — the box takes money, not an object handler). "pay" is
  // unclaimed elsewhere (grepped clean; `jack.ts`'s own "pay"/"paid" are
  // topic words, a disjoint vocabulary from verb words).
  [V_PAY]: {
    id: V_PAY,
    words: ['pay', 'pay for', 'leave money'],
    patterns: ['V'],
    class: 'direct',
    // Bare-safe (no `{name}`): the honor box's handler answers by day; at night
    // or elsewhere this is a bare verb with nothing to aim it at.
    default: VERB_DEFAULTS.wait,
  },
  // D2-C — the Friday table (`poker.ts`). `act2_bet`/`act2_check` have no
  // hand-specific text anywhere in the doc (`poker.ts`'s own header); the
  // `default` below is what a player sees outside a session, or for either
  // of these two even inside one — borrowed, non-templated, bare-safe,
  // same "reuse an existing family" idiom `V_FIT`'s own `default` uses.
  [V_ACT2_BET]: { id: V_ACT2_BET, words: ['bet'], patterns: ['V'], class: 'direct', default: VERB_DEFAULTS.wait },
  [V_ACT2_RAISE]: { id: V_ACT2_RAISE, words: ['raise'], patterns: ['V'], class: 'direct', default: VERB_DEFAULTS.wait },
  [V_ACT2_CHECK]: { id: V_ACT2_CHECK, words: ['check'], patterns: ['V'], class: 'direct', default: VERB_DEFAULTS.wait },
  // "SWAP DECK"/"DEAL FROM MY DECK" — `'V dobj'`, dobj `act2_deck`
  // (`objects/truck.ts`). `default` is reached only if the deck is
  // resolved but `poker.ts`'s own handler doesn't match (i.e. no session
  // in progress) — bare-safe by construction since a dobj is always
  // present here (same as `V_FIT`).
  [V_ACT2_SWAP_DECK]: {
    id: V_ACT2_SWAP_DECK,
    words: ['swap', 'deal from'],
    patterns: ['V dobj'],
    class: 'direct',
    default: VERB_DEFAULTS.touch,
  },
};

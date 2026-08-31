// Act III, Stage D3, task B — one new bare-phrase verb: `V_LOOK_DOWN_AISLE`
// (§9.7's "LOOK DOWN AISLE"/"LOOK ALONG ROW"), for Data Hall A's own scale
// moment. Same idiom as `act1/verbs.ts`'s `V_LOOK_UP`/`V_LOOK_OUTSIDE`: a
// literal multi-word phrase, bare (`'V'`, no dobj — "aisle"/"row" here name
// the room's whole shape, not one addressable object), with `default` set
// to the exact text Data Hall A's own room handler renders (transcribed
// once, shared, not a second string — the `V_CHECK_DATE`/`V_FIND_MY_NAME`
// idiom `act2/verbs.ts`'s own header already documents).
//
// `act3/ids.ts` declares `V_LOOK_DOWN_AISLE` itself (this file only builds
// its `VerbDef`); this file, like `act3/ids.ts`, is shared across D3's
// three concurrent tasks — re-read on conflict.

import type { VerbDef } from '../../../engine/world';
import { VERB_DEFAULTS } from '../../responses';
import { ACT1_VERBS } from '../act1/verbs';
import { V_CALL, V_MEASURE } from '../act1/ids';
import { ACT2_DRIVE_TO_PLANT_TEXT } from '../act2/scripts';
import { V_LOOK_DOWN_AISLE, V_PACE, V_UNBOLT } from './ids';
import { V_ACT3_LOOK_WEST, V_ACT3_PHOTOGRAPH, V_ACT3_RAM, V_ACT3_RIDE_TO_PLANT, V_ACT3_WRITE_VENDOR_NUMBER } from './ids';
import { MANIFEST_ABSENT_TEXT, PHOTOGRAPH_TEXT } from './objects/perimeterRoad';

export const LOOK_DOWN_AISLE_TEXT =
  'You put your eye down the aisle and the rows run until they stop being rows.\n\nSomewhere along there the two sides meet. There is no door in that end wall,\nbecause that end wall is a good way past the point at which you stopped being\nable to see one.';

// ---------------------------------------------------------------------------
// D3-C — the corridor's three measuring routes, the hatch/panel/blank's
// unbolting, and "CALL ELEVATOR." Own heading (task B's `V_LOOK_DOWN_AISLE`
// above is untouched).
// ---------------------------------------------------------------------------

// `V_MEASURE` ships (act1/verbs.ts, the Sheriff's map) with only a bare `'V'`
// pattern. §11.3's "MEASURE CORRIDOR" (no instrument — the P route, same
// handler as PACE) and §11.4/§11.5's "MEASURE CORRIDOR WITH STRING/RULER"
// need `'V dobj'` and `'V dobj prep iobj'` on the SAME verb id (a second verb
// claiming the word "measure" would be a `verb-word-collision` error) — same
// idempotent in-place mutation idiom `act2/verbs.ts` uses for `RUB`/`SIT`.
if (!ACT1_VERBS[V_MEASURE]!.patterns.includes('V dobj')) {
  ACT1_VERBS[V_MEASURE] = {
    ...ACT1_VERBS[V_MEASURE]!,
    patterns: [...ACT1_VERBS[V_MEASURE]!.patterns, 'V dobj', 'V dobj prep iobj'],
    preps: [...(ACT1_VERBS[V_MEASURE]!.preps ?? []), 'with'],
  };
}

// `V_CALL` ships (act1/verbs.ts, the telephone) bare-only. "CALL ELEVATOR"
// (§13.2) needs `'V dobj'` on the same id — "call" is already exclusively
// V_CALL's word, so a second verb could never claim it. Same mutation idiom.
if (!ACT1_VERBS[V_CALL]!.patterns.includes('V dobj')) {
  ACT1_VERBS[V_CALL] = { ...ACT1_VERBS[V_CALL]!, patterns: [...ACT1_VERBS[V_CALL]!.patterns, 'V dobj'] };
}

export const ACT3_VERBS: Record<string, VerbDef> = {
  [V_LOOK_DOWN_AISLE]: {
    id: V_LOOK_DOWN_AISLE,
    words: ['look down aisle', 'look along row', 'look down row', 'look along aisle'],
    patterns: ['V'],
    class: 'analytical',
    default: LOOK_DOWN_AISLE_TEXT,
  },
  // §11.3's "PACE CORRIDOR"/"WALK IT OFF"/"COUNT TILES" — a new word, grepped
  // clean against every act1/act2 verb's own word list.
  [V_PACE]: {
    id: V_PACE,
    words: ['pace', 'walk it off', 'walk off', 'count tiles'],
    patterns: ['V dobj'],
    class: 'analytical',
    default: VERB_DEFAULTS.touch,
  },
  // §10.6/§11.7/§13.6's "UNBOLT"/"UNSCREW" — the hatch, the wall panel, and
  // the elevator's blank all answer to this one new verb.
  [V_UNBOLT]: {
    id: V_UNBOLT,
    words: ['unbolt', 'unscrew'],
    patterns: ['V dobj', 'V dobj prep iobj'],
    preps: ['with'],
    class: 'direct',
    default: VERB_DEFAULTS.touch,
  },

  // -------------------------------------------------------------------------
  // D3-A — travel to the perimeter, P16's routes, alertness, the toolbox/
  // wrench (this task's own five verbs). Own heading; the entries above are
  // task B's/C's, untouched.
  // -------------------------------------------------------------------------

  // §5.3 — "RAM FENCE"/"DRIVE THROUGH FENCE"/"DRIVE AT FENCE." New words,
  // grepped clean against every act1/act2/act3 verb's own word list.
  [V_ACT3_RAM]: {
    id: V_ACT3_RAM,
    words: ['ram', 'drive through', 'drive at'],
    patterns: ['V dobj'],
    class: 'direct',
    default: VERB_DEFAULTS.touch,
  },
  // §5.5 — "WRITE VENDOR NUMBER," a bare fixed phrase (same idiom as
  // `V_ACT2_DRIVE_TO_PLANT`); "SIGN MANIFEST" itself reaches the manifest
  // object through the already-shipped `V_SIGN`'s own `'V dobj'` pattern
  // (act1/verbs.ts) — no new verb needed for that phrasing. `default`
  // reuses the manifest's own "wrong day" text rather than inventing a
  // second string — this verb has no meaning anywhere but the perimeter
  // room's own handlers, so the default is effectively unreachable, same
  // class of backstop as `V_ACT2_DRIVE_TO_PLANT`'s own `default`.
  [V_ACT3_WRITE_VENDOR_NUMBER]: {
    id: V_ACT3_WRITE_VENDOR_NUMBER,
    words: ['write vendor number', 'write in vendor number', 'write my vendor number'],
    patterns: ['V'],
    class: 'analytical',
    default: MANIFEST_ABSENT_TEXT,
  },
  // §3, ruling 1 — "RIDE TO PLANT"/"RIDE TO THE PLANT"/"RIDE NORTH TO
  // PLANT," bare fixed phrase, same idiom as `V_ACT2_DRIVE_TO_PLANT`. No
  // lead-in text is authored for the horse (unlike the truck's own §21
  // preamble) — `default` reuses that same preamble rather than inventing
  // one; see this task's report.
  [V_ACT3_RIDE_TO_PLANT]: {
    id: V_ACT3_RIDE_TO_PLANT,
    words: ['ride to plant', 'ride to the plant', 'ride north to plant'],
    patterns: ['V'],
    class: 'direct',
    // Bare-safe default (v0.13.0): typed away from the truck/horse this must not narrate a ride. The rooms with a vehicle answer it.
    default: VERB_DEFAULTS.wait,
  },
  // §4.2 — "LOOK WEST," bare fixed phrase, same idiom as `V_LOOK_OUT`/
  // `V_LOOK_UP` (act1/ids.ts). Bare `LOOK` itself is deliberately NOT
  // overridden anywhere in this wave — see `act3/perimeterRoad.ts`'s own
  // header note and this task's report.
  [V_ACT3_LOOK_WEST]: {
    id: V_ACT3_LOOK_WEST,
    words: ['look west'],
    patterns: ['V'],
    class: null,
    default: VERB_DEFAULTS.touch,
  },
  // §4.10 — "TAKE PHOTOGRAPH"/"PHOTOGRAPH FENCE." `'V'` for the bare form,
  // `'V dobj'` for the fence-targeted form; both render the one line
  // (`PHOTOGRAPH_TEXT`, `objects/perimeterRoad.ts`) — reused here as the
  // `default`, not duplicated, for a target this verb has no handler for.
  [V_ACT3_PHOTOGRAPH]: {
    id: V_ACT3_PHOTOGRAPH,
    words: ['photograph', 'take photograph', 'take a photograph', 'take picture'],
    patterns: ['V', 'V dobj'],
    class: 'analytical',
    default: PHOTOGRAPH_TEXT,
  },
};

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
import { V_ACT3_DOCK_DAD } from './ids';
import { ACT1_VERBS, DROP } from '../act1/verbs';
import { V_CALL, V_MEASURE } from '../act1/ids';
import { ACT2_DRIVE_TO_PLANT_TEXT } from '../act2/scripts';
import { V_LOOK_DOWN_AISLE, V_PACE, V_UNBOLT } from './ids';
import { V_ACT3_LOOK_WEST, V_ACT3_PHOTOGRAPH, V_ACT3_RAM, V_ACT3_RIDE_TO_PLANT, V_ACT3_SIDEWAYS, V_ACT3_WRITE_VENDOR_NUMBER } from './ids';
import { MANIFEST_ABSENT_TEXT, PHOTOGRAPH_TEXT } from './objects/perimeterRoad';
import { USE_VERB_ID } from '../../../engine/move';
import { V_ACT3_LIGHT } from './ids';
import {
  V_ACT3_BADGE,
  V_ACT3_CHECK_TIME,
  V_ACT3_LOOK_DOWN_SHAFT,
  V_ACT3_TURN_TO_NORMAL,
  V_ACT3_TYPE_PAD,
} from './ids';
import { V_THROW } from './ids';

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
  // v0.15.1 hygiene — the bare form of §29 (the Hub's own handler answers it).
  [V_ACT3_DOCK_DAD]: {
    id: V_ACT3_DOCK_DAD,
    // Not "put usb in terminal" itself — as a bare form that would steal the
    // phrase from the opening room and the rig (v0.15.1).
    words: ['plug dad in', 'dock dad', 'put dad in terminal', 'plug in dad', 'connect dad'],
    patterns: ['V'],
    class: 'direct',
    default: VERB_DEFAULTS.wait,
  },
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

  // -------------------------------------------------------------------------
  // D4 task D — the Pipe Chase (§21.4's own "s5 / sideways / out" exit
  // name). This task's own single addition to this file.
  // -------------------------------------------------------------------------

  // "S5"/"SIDEWAYS" — a bare fixed phrase reaching the chase's own opening
  // to S5 (`pipeChase.ts`'s own room-level handler does the actual `goto`);
  // `default` is a bare-safe fallback for use anywhere else in the game
  // (same reasoning as `V_ACT3_RIDE_TO_PLANT`'s own bare-safe default,
  // above): nothing outside the chase gives this verb a handler, so it
  // must never narrate a move.
  [V_ACT3_SIDEWAYS]: {
    id: V_ACT3_SIDEWAYS,
    // v0.14.0: not "s5" — that is the lift button's own noun.
    words: ['sideways'],
    patterns: ['V'],
    class: 'direct',
    default: VERB_DEFAULTS.wait,
  },

  // -------------------------------------------------------------------------
  // D4 task C — S5 Reactor Interface, the interlock death, and the
  // checkpoint (§9.5, §9.6, §9.8, §9.9, §10.1). This task's own four verbs;
  // the entries above are siblings', untouched.
  // -------------------------------------------------------------------------

  // §10.1 — "TURN KEYSWITCH TO NORMAL"/"TURN KEY TO NORMAL"/"TURN SWITCH TO
  // NORMAL." Bare fixed phrase; see `ids.ts`'s own doc comment on why this
  // can't be `'V dobj prep iobj'` (no object anywhere carries a noun
  // "normal" for the iobj to resolve against).
  [V_ACT3_TURN_TO_NORMAL]: {
    id: V_ACT3_TURN_TO_NORMAL,
    words: ['turn keyswitch to normal', 'turn key to normal', 'turn switch to normal'],
    patterns: ['V'],
    class: 'direct',
    default: VERB_DEFAULTS.touch,
  },
  // §9.8 — "TYPE CREDENTIALS"/"ENTER CREDENTIALS"/"TYPE ADMIN"/"TYPE
  // PASSWORD." Bare fixed phrases, grepped clean: bare "type" is already
  // exclusively `V_TYPE_TERMINAL`'s (`act1/ids.ts`) and bare "enter" is
  // already exclusively `DIRECTION_VERB_IDS.in`'s (`engine/move.ts`) — these
  // four multi-word phrases are distinct strings from both, no collision.
  [V_ACT3_TYPE_PAD]: {
    id: V_ACT3_TYPE_PAD,
    words: ['type credentials', 'enter credentials', 'type admin', 'type password'],
    patterns: ['V'],
    class: 'analytical',
    default: VERB_DEFAULTS.touch,
  },
  // §9.8 — "BADGE DOOR." New one-word verb, grepped clean.
  [V_ACT3_BADGE]: {
    id: V_ACT3_BADGE,
    words: ['badge'],
    patterns: ['V dobj'],
    class: 'direct',
    default: VERB_DEFAULTS.touch,
  },
  // §9.9 — "WHAT TIME IS IT"/"WHAT'S THE TIME"/"CHECK TIME." Bare fixed
  // phrases; bare "check" is already exclusively `V_ACT2_CHECK`'s
  // (`act2/ids.ts`, pattern `'V'` only) — these three multi-word phrases
  // are distinct strings, no collision.
  [V_ACT3_CHECK_TIME]: {
    id: V_ACT3_CHECK_TIME,
    words: ['what time is it', "what's the time", 'check time'],
    patterns: ['V'],
    class: 'analytical',
    default: VERB_DEFAULTS.touch,
  },
  // §9.6 — "LOOK DOWN OPENING"/"LOOK DOWN SHAFT." Bare fixed phrases, same
  // idiom as `V_LOOK_DOWN_AISLE` above.
  [V_ACT3_LOOK_DOWN_SHAFT]: {
    id: V_ACT3_LOOK_DOWN_SHAFT,
    words: ['look down opening', 'look down shaft'],
    patterns: ['V'],
    class: 'analytical',
    default: VERB_DEFAULTS.touch,
  },

  // -------------------------------------------------------------------------
  // --- Addenda ---
  // Stage D addenda (`docs/superpowers/specs/2026-09-14-stage-d-addenda-
  // prose.md` §4.1, §9 item 1) — "THROW <thing> DOWN/INTO/IN/AT," a new
  // global verb. Bare-safe default (same reasoning as `V_ACT3_SIDEWAYS`'s
  // own, above): nothing outside the chase bottom's own room-level handler
  // (`../s5ReactorInterface.ts`) gives this verb a handler, so it must never
  // narrate an actual throw.
  // -------------------------------------------------------------------------
  [V_THROW]: {
    id: V_THROW,
    words: ['throw', 'toss', 'chuck'],
    patterns: ['V dobj', 'V dobj prep iobj'],
    preps: ['down', 'into', 'in', 'at'],
    class: 'direct',
    default: VERB_DEFAULTS.wait,
  },
};

// --- Addenda ---
// Stage D addenda §4.1 — `DROP <thing> DOWN THE SHAFT` ships `'V dobj'`-only
// (`act1/verbs.ts`); the chase bottom's own room-level handler needs `'V
// dobj prep iobj'` with preps "down"/"into"/"in" to reach it at all. Same
// idempotent in-place mutation idiom this file already uses above for
// `V_MEASURE`/`V_CALL`/`USE_VERB_ID`/`OPEN`.
if (!ACT1_VERBS[DROP]!.patterns.includes('V dobj prep iobj')) {
  ACT1_VERBS[DROP] = {
    ...ACT1_VERBS[DROP]!,
    patterns: [...ACT1_VERBS[DROP]!.patterns, 'V dobj prep iobj'],
    preps: [...(ACT1_VERBS[DROP]!.preps ?? []), 'down', 'into', 'in'],
  };
}

// §9.8 — "USE NOTEBOOK ON PAD" needs `USE_VERB_ID` (`engine/move.ts`,
// registered bare-`'V dobj'`-only in `act1/verbs.ts`) to also carry `'V dobj
// prep iobj'` with prep "on" — same idempotent in-place mutation idiom this
// file already uses above for `V_MEASURE`/`V_CALL`. Every existing bare
// "USE X" elsewhere in the game is unaffected (that pattern is additive,
// not replaced).
if (!ACT1_VERBS[USE_VERB_ID]!.patterns.includes('V dobj prep iobj')) {
  ACT1_VERBS[USE_VERB_ID] = {
    ...ACT1_VERBS[USE_VERB_ID]!,
    patterns: [...ACT1_VERBS[USE_VERB_ID]!.patterns, 'V dobj prep iobj'],
    preps: [...(ACT1_VERBS[USE_VERB_ID]!.preps ?? []), 'on'],
  };
}

// -----------------------------------------------------------------------------
// D4 task A — the way under (§3-§7). `OPEN` gains `'V dobj prep iobj'` so
// "OPEN HATCH WITH KEY"/"OPEN HATCH WITH CHAIR LEG" (§4.2, §4.3) parse at
// all — it shipped `'V dobj'`-only.
//
// REVERTED (register 90 — the tunnel is now two rooms, the mouth and the
// below): the mouth<->below transition is a real cross-room `goto` now, so
// bare "DOWN"/"UP" work as ordinary exits and no longer need a `dobj` to
// reach an object handler — the `DIRECTION_VERB_IDS.down`/`.up` in-place
// mutation this task's own report originally flagged is removed. "ENTER
// HATCH" (`IN`, already `'V dobj'`) and "CLIMB LADDER" (`CLIMB`, already
// `'V dobj'`) still work unaided, as plain-goto niceties on the hatch's/
// ladder's own objects.
// -----------------------------------------------------------------------------

import { OPEN } from '../act1/verbs';
if (!ACT1_VERBS[OPEN]!.patterns.includes('V dobj prep iobj')) {
  ACT1_VERBS[OPEN] = {
    ...ACT1_VERBS[OPEN]!,
    patterns: [...ACT1_VERBS[OPEN]!.patterns, 'V dobj prep iobj'],
    preps: [...(ACT1_VERBS[OPEN]!.preps ?? []), 'with'],
  };
}

// "LIGHT MATCH"/"LIGHT MATCHBOOK" (§5.2). "STRIKE MATCH" is dropped — see
// `ids.ts`'s own doc comment on `V_ACT3_LIGHT` (collides with `BREAK`'s own
// "strike").
export const ACT3_D4_TASK_A_VERBS: Record<string, VerbDef> = {
  // Bare "light" only — pattern `'V dobj'` already resolves "LIGHT MATCH"/
  // "LIGHT MATCHBOOK" via ordinary noun matching. Multi-word phrases like
  // "light match" in this same verb's own `words` were tried FIRST (longest
  // match) and swallowed the noun entirely, leaving nothing for `'V dobj'`
  // to resolve as a dobj — confirmed by this task's own test run ("You have
  // a verb, light, and nothing to aim it at"); fixed by dropping them.
  [V_ACT3_LIGHT]: {
    id: V_ACT3_LIGHT,
    words: ['light'],
    patterns: ['V dobj'],
    class: 'direct',
    default: VERB_DEFAULTS.touch,
  },
};

// -----------------------------------------------------------------------------
// D5, task H — the chiller alarm (`objects/coolingPlant.ts`, D5 prose doc
// §20). "PULL ALARM"/"BREAK GLASS"/"HIT GLASS WITH HAMMER" reach it through
// already-shipped verbs (`PULL`/`BREAK`, `act1/verbs.ts`) plus that object's
// own nouns and a local `BREAK` pattern mutation (done in that file, not
// here — it's specific to that one object's hammer sub-detail).
//
// PATTERN, corrected from an earlier draft of this file (flagged in this
// task's report): `'V'` (bare, no `dobj`) can NEVER reach an object's own
// `handlers` — `actions.ts`'s `performAction` only consults `dobj`-less
// input against `world.rooms[location].handlers`, never
// `world.objects[dobj].handlers` (there is no `dobj` to look one up by).
// The Cooling Plant's own room file is D3/D4 task C's, not this task's ("add
// only your object," this task's brief) — so a room-level handler isn't an
// option here — and both actions are object-targeted anyway, so `'V dobj'`
// (a real `dobj`, resolved against this object's own nouns) is the correct
// shape, not a bare phrase. "TRIP CHILLER" therefore parses as verb "trip" +
// dobj "chiller" — a bare noun the alarm box itself now answers to (the
// room's two actual chiller units are prose only, D3 §10, never their own
// object; the alarm is the only addressable target that name could mean).
// "PUSH HANDLE UP" is dropped (this task's own call, not the doc's): its
// particle trails the dobj ("push [handle] up"), a shape `'V dobj prep
// iobj'` doesn't cover (no second object) and this DSL has no other pattern
// for — "RESET ALARM"/"RESET THE ALARM" alone carries §20.5.
// -----------------------------------------------------------------------------

import { V_ACT3_RESET_ALARM, V_ACT3_TRIP_CHILLER } from './ids';

export const ACT3_D5_TASK_H_VERBS: Record<string, VerbDef> = {
  // §20.2 — "TRIP CHILLER"/"TRIP THE CHILLER" — verb "trip", dobj "chiller"
  // (the alarm object's own noun, `objects/coolingPlant.ts`).
  [V_ACT3_TRIP_CHILLER]: {
    id: V_ACT3_TRIP_CHILLER,
    words: ['trip'],
    patterns: ['V dobj'],
    class: 'direct',
    default: VERB_DEFAULTS.touch,
  },
  // §20.5 — "RESET ALARM"/"RESET THE ALARM" — verb "reset", dobj "alarm."
  [V_ACT3_RESET_ALARM]: {
    id: V_ACT3_RESET_ALARM,
    words: ['reset'],
    patterns: ['V dobj'],
    class: 'direct',
    default: VERB_DEFAULTS.touch,
  },
};

// -----------------------------------------------------------------------------
// D5 task F — the S6 Maintenance Bay (§5.4). "READ NAMES" needs no new verb
// (READ + the badge hooks' own "names" noun, `objects/s6MaintenanceBay.ts`);
// "SEARCH HOOKS FOR JULES"/"LOOK FOR JULES ON THE RAIL" would resolve as
// SEARCH's own `'V dobj'` pattern swallowing "hooks for jules" as one dobj
// phrase and failing to match any noun — a new bare fixed-phrase verb, same
// idiom as `V_ACT3_CHECK_TIME` above.
// -----------------------------------------------------------------------------

import { V_ACT3_ARM_UNDER_LAMP, V_ACT3_BADGE_UNDER_LAMP, V_ACT3_HANG_BADGE, V_ACT3_NOLAN_UNDER_LAMP, V_ACT3_NOTEBOOK_UNDER_LAMP, V_ACT3_SEARCH_RAIL_FOR_JULES, V_ACT3_UNDO } from './ids';
import { PULL } from '../act1/verbs';

// §7.4 — "TEST STRAP" reaches `PULL`'s own handler (`objects/
// s6MaintenanceBay.ts`) through a new synonym word, added in place — same
// idempotent mutation idiom this file already uses for `V_MEASURE`/
// `V_CALL`/`OPEN`/`USE_VERB_ID` above.
if (!ACT1_VERBS[PULL]!.words.includes('test')) {
  ACT1_VERBS[PULL] = { ...ACT1_VERBS[PULL]!, words: [...ACT1_VERBS[PULL]!.words, 'test'] };
}

export const ACT3_D5_TASK_F_VERBS: Record<string, VerbDef> = {
  [V_ACT3_SEARCH_RAIL_FOR_JULES]: {
    id: V_ACT3_SEARCH_RAIL_FOR_JULES,
    words: ['search hooks for jules', 'look for jules on the rail', 'search rail for jules'],
    patterns: ['V'],
    class: 'analytical',
    default: VERB_DEFAULTS.touch,
  },
  // §6.4 — "EXAMINE NOLAN UNDER LAMP"/"PUT NOLAN'S ARM UNDER LAMP."
  [V_ACT3_NOLAN_UNDER_LAMP]: {
    id: V_ACT3_NOLAN_UNDER_LAMP,
    words: ['examine nolan under lamp', "put nolan's arm under lamp", 'put nolans arm under lamp'],
    patterns: ['V'],
    class: 'analytical',
    default: VERB_DEFAULTS.touch,
  },
  // §8.3 — "EXAMINE ARM UNDER LAMP"/"PUT ARM UNDER LAMP." ("ROLL UP SLEEVE"
  // already parses, `V_ROLL_UP` + the forearm's own bare noun "sleeve"
  // — act1/objects/self.ts, out of this task's module — reaching THIS
  // room's own lamp-lit reveal instead of the shipped forearm text would
  // need a conditional added to that object's own handler; escalated in
  // this task's report rather than guessed.)
  [V_ACT3_ARM_UNDER_LAMP]: {
    id: V_ACT3_ARM_UNDER_LAMP,
    words: ['examine arm under lamp', 'put arm under lamp', 'put my arm under lamp'],
    patterns: ['V'],
    class: 'analytical',
    default: VERB_DEFAULTS.touch,
  },
  // §8.4 — "PUT NOTEBOOK/PAGE/SHEET UNDER LAMP."
  [V_ACT3_NOTEBOOK_UNDER_LAMP]: {
    id: V_ACT3_NOTEBOOK_UNDER_LAMP,
    words: ['put notebook under lamp', 'put page under lamp', 'put sheet under lamp'],
    patterns: ['V'],
    class: 'analytical',
    default: VERB_DEFAULTS.touch,
  },
  // §8.5 — "PUT BADGE/POLAROID UNDER LAMP"/"SHINE LAMP ON CHAIR."
  [V_ACT3_BADGE_UNDER_LAMP]: {
    id: V_ACT3_BADGE_UNDER_LAMP,
    words: ['put badge under lamp', 'put polaroid under lamp', 'shine lamp on chair'],
    patterns: ['V'],
    class: 'analytical',
    default: VERB_DEFAULTS.touch,
  },
  // §6.6 — "PUT BADGE BACK"/"HANG BADGE ON HOOK."
  [V_ACT3_HANG_BADGE]: {
    id: V_ACT3_HANG_BADGE,
    words: ['put badge back', 'hang badge on hook'],
    patterns: ['V'],
    class: 'direct',
    default: VERB_DEFAULTS.touch,
  },
  // §7.3 — "UNDO STRAP"/"UNBUCKLE STRAP."
  [V_ACT3_UNDO]: {
    id: V_ACT3_UNDO,
    words: ['undo', 'unbuckle'],
    patterns: ['V dobj'],
    class: 'direct',
    default: VERB_DEFAULTS.touch,
  },
};

// -----------------------------------------------------------------------------
// D5 task G — the Archive Hub: the ledger's four bare name-searches plus
// PRINT LEDGER, the graph's CHANGE SCALE/LOOK AT AXIS, the queue's two bare
// phrases, and BAY (§21-§31, §39). All bare fixed phrases, same idiom as
// `V_LOOK_DOWN_AISLE`/`V_ACT3_CHECK_TIME` above — the grammar has no
// free-text `iobj` for the ledger/queue searches (§39's own note), and the
// graph's CHANGE SCALE/LOOK AT AXIS/the queue's phrases name no
// addressable noun of their own. Two in-place amendments to shipped verbs,
// same idempotent mutation idiom this file already uses repeatedly above
// (checked-then-mutated, safe under a double import):
//   - `BREAK` gains `'V dobj prep iobj'` with prep "with," so "HIT DOOR
//     WITH CHAIR LEG" (§28.5) parses at all — it shipped `'V dobj'`-only.
//   - `SEARCH` gains bare `'V'`, so bare `SEARCH` (no dobj, §39.2's own
//     "search" row) reaches the Hub room's own handler — it shipped `'V
//     dobj'`-only.
// "UNPLUG TERMINAL" (§22.5) needs no new word or mutation at all: "unplug"
// is already exclusively `V_UNPLUG`'s (act1/ids.ts, `act1/verbs.ts`,
// `patterns: ['V dobj']`) — the terminal's own object handler
// (`objects/s6ArchiveHub.ts`) answers it directly, alongside `TURN_OFF`.
// -----------------------------------------------------------------------------

import { BREAK, SEARCH } from '../act1/verbs';
import {
  V_ACT3_GRAPH_AXIS,
  V_ACT3_LEDGER_JULES,
  V_ACT3_LEDGER_NOLAN,
  V_ACT3_LEDGER_OTHER,
  V_ACT3_LEDGER_PRINT,
  V_ACT3_LEDGER_SELF,
  V_ACT3_QUEUE_EDIT,
  V_ACT3_QUEUE_SEARCH_JULES,
  V_ACT3_TO_BAY,
} from './ids';

if (!ACT1_VERBS[BREAK]!.patterns.includes('V dobj prep iobj')) {
  ACT1_VERBS[BREAK] = {
    ...ACT1_VERBS[BREAK]!,
    patterns: [...ACT1_VERBS[BREAK]!.patterns, 'V dobj prep iobj'],
    preps: [...(ACT1_VERBS[BREAK]!.preps ?? []), 'with'],
  };
}

if (!ACT1_VERBS[SEARCH]!.patterns.includes('V')) {
  ACT1_VERBS[SEARCH] = { ...ACT1_VERBS[SEARCH]!, patterns: [...ACT1_VERBS[SEARCH]!.patterns, 'V'] };
}

export const ACT3_D5_TASK_G_VERBS: Record<string, VerbDef> = {
  // §23.2 — "SEARCH LEDGER FOR JULES"/"LOOK UP JULES"/"TYPE JULES."
  [V_ACT3_LEDGER_JULES]: {
    id: V_ACT3_LEDGER_JULES,
    words: ['search ledger for jules', 'look up jules', 'type jules'],
    patterns: ['V'],
    class: 'analytical',
    default: VERB_DEFAULTS.touch,
  },
  // §23.3 — "SEARCH LEDGER FOR NOLAN."
  [V_ACT3_LEDGER_NOLAN]: {
    id: V_ACT3_LEDGER_NOLAN,
    words: ['search ledger for nolan'],
    patterns: ['V'],
    class: 'analytical',
    default: VERB_DEFAULTS.touch,
  },
  // §23.4 — "SEARCH LEDGER FOR ME"/"FOR MYSELF"/"FOR THE INVESTIGATOR."
  [V_ACT3_LEDGER_SELF]: {
    id: V_ACT3_LEDGER_SELF,
    words: ['search ledger for me', 'search ledger for myself', 'search ledger for the investigator'],
    patterns: ['V'],
    class: 'analytical',
    default: VERB_DEFAULTS.touch,
  },
  // §23.5 — any other name the player knows.
  [V_ACT3_LEDGER_OTHER]: {
    id: V_ACT3_LEDGER_OTHER,
    words: [
      'search ledger for jack',
      'search ledger for whitlock',
      'search ledger for marlow',
      'search ledger for pearl',
      'search ledger for dot',
      'search ledger for eli',
      'search ledger for luke',
      'search ledger for sissy',
    ],
    patterns: ['V'],
    class: 'analytical',
    default: VERB_DEFAULTS.touch,
  },
  // §23.6 — "PRINT LEDGER"/"COPY LEDGER"/"WRITE DOWN LEDGER."
  [V_ACT3_LEDGER_PRINT]: {
    id: V_ACT3_LEDGER_PRINT,
    words: ['print ledger', 'copy ledger', 'write down ledger'],
    patterns: ['V'],
    class: 'analytical',
    default: VERB_DEFAULTS.touch,
  },
  // §24.2 — "CHANGE SCALE"/"LOOK AT AXIS."
  [V_ACT3_GRAPH_AXIS]: {
    id: V_ACT3_GRAPH_AXIS,
    words: ['change scale', 'look at axis'],
    patterns: ['V'],
    class: 'analytical',
    default: VERB_DEFAULTS.touch,
  },
  // §25.3 — "DELETE QUEUE"/"CANCEL JOB"/"EDIT QUEUE"/"REMOVE MY LINE."
  [V_ACT3_QUEUE_EDIT]: {
    id: V_ACT3_QUEUE_EDIT,
    words: ['delete queue', 'cancel job', 'edit queue', 'remove my line'],
    patterns: ['V'],
    class: 'direct',
    default: VERB_DEFAULTS.touch,
  },
  // §25.4 — "SEARCH QUEUE FOR JULES."
  [V_ACT3_QUEUE_SEARCH_JULES]: {
    id: V_ACT3_QUEUE_SEARCH_JULES,
    words: ['search queue for jules'],
    patterns: ['V'],
    class: 'analytical',
    default: VERB_DEFAULTS.touch,
  },
  // §39.4 — "BAY," a bare-phrase synonym for the ordinary `west` exit back
  // to the Maintenance Bay ("back" is deliberately not wired — see
  // `ids.ts`'s own doc comment on this id).
  [V_ACT3_TO_BAY]: {
    id: V_ACT3_TO_BAY,
    words: ['bay'],
    patterns: ['V'],
    class: 'direct',
    default: VERB_DEFAULTS.wait,
  },
};

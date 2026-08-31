// Act II, Wave D1 — the borrowable horse (§16 of the D1 prose doc). Prose
// transcribed verbatim (hard rule 5). A new object at Main Street, separate
// from the shipped `act1_horses` scenery (`objects/mainStreet.ts`, amended
// by this same task — see that file's own D1 amendment note); `portable:
// false` (it is ridden, not carried).
//
// NOUN COLLISION (flagged, not silently smoothed over — same discipline as
// `objects/townEdge.ts`'s own "bare sign clarifies" precedent): the doc's
// own §16 noun list ("horse, mare, animal, mount, reins, rope, knot") shares
// "horse"/"mare"/"animal"/"reins" with the shipped `act1_horses` scenery
// object, which is in the same room. A bare "horse"/"mare"/"animal"/"reins"
// typed while both objects are in scope (i.e. before this one is ridden
// away) clarifies between "the horses" and "the horse" — neither object
// carries an adjective that would narrow it, and neither is held (no
// tie-break). This is a real, minor UX rough edge, reported here rather
// than invented around: authoring an adjective for either object is a
// vocabulary decision the prose doc doesn't make, and this task's own
// module boundary is `act2_horse` — not `objects/mainStreet.ts`'s existing
// noun list beyond the two ProseRule amendments (§15) that file's own
// section of this task actually calls for.
//
// TOUCH/PET (§16.4) — deliberately NOT authored here. The note explains why:
// the shipped `horsesTouch` response is ledger L7/canon 27 (the game's first
// evidence about what the investigator is) and must fire from the scenery
// object, once, in the shipped voice; duplicating it here (even verbatim)
// would be a second copy of a load-bearing line the anti-repetition register
// (§23) explicitly forbids re-authoring. Consequence, reported rather than
// silently accepted: `PET HORSE`/`TOUCH HORSE` resolving specifically to
// `act2_horse` (as opposed to `act1_horses`) falls to `TOUCH`'s own generic
// default family, not `horsesTouch`'s text — there is no engine mechanism to
// share one handler across two distinct objects without repeating the
// string outright.

import type { Effect } from '../../../../engine/effects';
import type { ObjectDefSlice } from '../../../../engine/world';
import { EXAMINE, TAKE } from '../../act1/verbs';
import { MAIN_STREET, V_SLIDE_DOWN } from '../../act1/ids';
import { ACT2_HORSE, ACT2_HORSE_BORROWED, ACT2_TRAVEL_SCRIPT, ACT2_WALL_DRUG_EMPORIUM } from '../ids';
// D3, task A — the horse's own return leg from the perimeter (§3.5). `args`
// uses `from`, not `to` — see `act2/travel.ts`'s own header note on why.
import { ACT3_PERIMETER_ROAD } from '../../act3/ids';

const horseExamine =
  'The near one. Sixteen hands of entirely uninterested brown, standing hipshot\nwith one ear back on the conversation and the rest of it asleep.\n\nSomebody has tied it to the rail with a knot that exists to keep an animal\nstanding where it was put, and not for one moment to stop anybody taking it.';

/** §16.2 — `UNTIE HORSE`/`TAKE HORSE`/`MOUNT HORSE` (all reach the built-in `TAKE`; "untie"/"mount" are already `TAKE`'s own synonyms, `act1/verbs.ts`). Sets `act2_horse_borrowed`; does not depart. */
const untieHorseText =
  'The knot comes undone in one pull, the way it was tied to. The horse steps\nback off the rail and stands in the road with you, waiting to be told what the\ntwo of you are doing.\n\nNo door opens. No blind moves. The sheriff\'s one lit window goes on being lit.\nThe street goes on being a street with a man standing in it holding a horse,\nand it is prepared to go on being that for as long as you need.';

const untieHorseEffects: Effect[] = [{ say: untieHorseText }, { set: [ACT2_HORSE_BORROWED, true] }];

/** §3's own entry line for "RIDE HORSE" at Main Street or Town Edge, before the outbound ride. */
const rideHorseEntryText =
  'Getting up is the whole difficulty and it is over quickly. After that you are\nhigher than you have been all night, and moving, and nobody in the county\nknows about any of it.';

const horse: ObjectDefSlice = {
  location: MAIN_STREET,
  name: 'horse',
  portable: false,
  nouns: ['horse', 'mare', 'animal', 'mount', 'reins', 'rope', 'knot'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: horseExamine }] },
    { verbs: [TAKE], effects: untieHorseEffects },
    // §16.3's return trip — `RIDE HORSE` at Wall Drug, once the horse has
    // carried the player there. No entry line of its own (§3 only gives one
    // for the outbound ride); the script's own return beats (§4.6) frame it.
    {
      verbs: [V_SLIDE_DOWN],
      when: { at: ACT3_PERIMETER_ROAD },
      effects: [{ script: { id: ACT2_TRAVEL_SCRIPT, args: { mode: 'horse', from: 'perimeter' } } }],
    },
    {
      verbs: [V_SLIDE_DOWN],
      when: { at: ACT2_WALL_DRUG_EMPORIUM },
      effects: [{ script: { id: ACT2_TRAVEL_SCRIPT, args: { mode: 'horse', to: 'town' } } }],
    },
    // §16.3's outbound ride — `RIDE HORSE` at Main Street or Town Edge, gated on the flag §16.2 sets.
    {
      verbs: [V_SLIDE_DOWN],
      when: { flag: ACT2_HORSE_BORROWED },
      effects: [{ say: rideHorseEntryText }, { script: { id: ACT2_TRAVEL_SCRIPT, args: { mode: 'horse', to: 'wall_drug' } } }],
    },
  ],
};

export const ACT2_HORSE_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT2_HORSE]: horse,
};

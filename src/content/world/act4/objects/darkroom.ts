// Stage E2, task Q — the darkroom scene, the two prints, and R17
// (`docs/superpowers/specs/2026-09-19-stage-e2-prose.md` §44-§46; canon
// 109, the darkroom is a scene, not a room). Prose transcribed exactly
// (hard rule 5). The shelf/key and the darkroom door's own new handlers
// live in `act1/objects/countyLibrary.ts` (amended in place, that room's
// own file); the develop script itself (`act4Develop`) lives in
// `act4/scripts.ts` (the shared-file protocol's own labelled block there).
//
// DEVELOP (§44) — a new dobj-taking verb (`V_DEVELOP`, `../ids.ts`), one
// handler per canister, both amended onto already-declared objects rather
// than owning either object outright (the `act2/objects/usb.ts`
// mutate-in-place idiom): Sissy's film (`act4_sissy_film`, task P's own
// object, `objects/hab.ts` — that file's own comment already earmarks
// "developing it is task Q's own scene") and Jules's cached canister
// (`act2_film_canister`, `act2/objects/cache.ts` — out of this task's own
// named scope, hard rule 1). Both canisters share the bare noun "film"
// (§56.2's own collision row), so `DEVELOP FILM` with both held is a
// genuine engine-native ambiguity (a ranked pool of two, `resolver.ts`
// §3.2) — no authored "which one" prose is needed or invented; the
// parser's own clarify machinery asks.
//
// R17 (§46) lives on `act4_print_sky` alone (the sky print is the half of
// the comparison that changes state) — `withInstrument: [
// ACT1_INTACT_POLAROIDS]`, never `'any'`, so the handler only ever fires
// once the iobj has actually resolved to the porch/night-sky Polaroids and
// not to `act2_cache_polaroid` (§56.2's own print row: "the instrument
// must not resolve to the cache Polaroid" — both share the bare noun
// "polaroid" with no adjective on either shipped object, so a player
// holding both gets an honest engine clarify; this task's own report
// covers it).

import { COUNTY_LIBRARY } from '../../act1/ids';
import type { Effect } from '../../../../engine/effects';
import type { ObjectDefSlice } from '../../../../engine/world';
import { EXAMINE } from '../../act1/verbs';
import { INTACT_POLAROIDS } from '../../act1/ids';
import { ACT2_FILM_CANISTER, V_FIT } from '../../act2/ids';
import { ACT2_CACHE_OBJECTS } from '../../act2/objects/cache';
import { ACT4_P_HAB_OBJECTS } from './hab';
import {
  ACT4_CLUE_SKY_IS_CEILING,
  ACT4_DARKROOM_OPEN,
  ACT4_DEVELOP_SCRIPT,
  ACT4_JULES_FILM_DEVELOPED,
  ACT4_PRINT_LAST_DAY,
  ACT4_PRINT_SKY,
  ACT4_Q_THE_SKY,
  ACT4_SISSY_FILM,
  ACT4_SISSY_FILM_DEVELOPED,
  ACT4_SKY_MATCHED,
  V_DEVELOP,
} from '../ids';

// ---------------------------------------------------------------------------
// §45.1 — the sky print
// ---------------------------------------------------------------------------

const printSkyExamineText =
  'A ten-by-eight on old paper, fogged round the edges and good in the middle, which is where the sky is.\n\nPoints, on black, sharp all the way to the corners, with the drag on the longest ones that a long exposure puts into anything that moves at all.\n\nThe bright one is over on the left, with the long shallow triangle under it and the close pair below and to the left of that, and a faint one under the pair.\n\nAt the bottom of the frame, a hand\'s width of something dark and out of focus, which is the top of the dome ring, and which she left in because she is not sentimental and it gives the frame a scale.';

// §46 — R17. Transcribed exactly; the note above covers the instrument gate.
const comparePrintWithPolaroidText =
  'You put them down on the bench side by side under the red bulb, and turn the Polaroid until the gutter line is horizontal, and then you do not have to do anything else.\n\nThe bright one. The long shallow triangle under it. The close pair below and left, and the faint one under the pair.\n\nSame positions. Same proportions. Same lean on the triangle. One of them is a badly-held Polaroid of a porch roof in South Dakota and the other is a forty-minute exposure on a tripod under a dome, and the soft discs on the first one are sitting exactly where the hard points on the second one are.\n\nThat is the arrangement, and the arrangement is the thing, and you have known it since the dome.\n\nWhat you did not have in the dome is the second half of it.\n\nThe film was open a long time and the negative got pushed to make anything of the paper, and what that has done is bring up everything in the frame that is fainter than a star. Most of it is grain. Some of it is not grain, because grain does not go in straight lines.\n\nThere are lines behind the stars. Very faint, and straight, and long, and they run behind the points rather than in front of them, and they meet — at angles, in a way that gives you something like a very large panel and then another very large panel next to it.\n\nAnd where two of the lines cross, the black is a different black. It has an edge. Hold the paper to the bulb and the edge stays where it is, which grain does not do.\n\nBehind the edge there is structure. Not a shape, not an object, and not anything you could put a name to: the regular, repeating, carrying kind of detail that a thing has when it was made rather than when it grew.\n\nUnder the same bulb, four inches to the left, a photograph of a porch roof has the same stars in the same places, and is much too soft to show anything behind them, and never will be anything else.';

const comparePrintWithPolaroidEffects: Effect[] = [
  { say: comparePrintWithPolaroidText },
  { grantClue: ACT4_CLUE_SKY_IS_CEILING },
  { set: [ACT4_SKY_MATCHED, true] },
  { answerQuestion: ACT4_Q_THE_SKY },
];

const printSky: ObjectDefSlice = {
  location: 'nowhere',
  name: 'sky print',
  nouns: ['print', 'sky print', 'film', 'negative', 'photograph', 'picture', 'mars print'],
  adjectives: ['sky', 'mars', 'developed', 'wet'],
  portable: true,
  plotCritical: true,
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: printSkyExamineText }] },
    { verbs: [V_FIT], withInstrument: [INTACT_POLAROIDS], when: { not: { flag: ACT4_SKY_MATCHED } }, effects: comparePrintWithPolaroidEffects },
  ],
};

// ---------------------------------------------------------------------------
// §45.2 — the last-day print — canon 96, canon 43 (the stranger, unremarked)
// ---------------------------------------------------------------------------

const printLastDayExamineText =
  'A ten-by-eight of a kitchen, taken from the end of it by the door, on a flash that has bounced off a low ceiling and lit everybody evenly and taken all the shadow out of the room.\n\nThe table with the good cloth on it, squared up, plates on top of it. A jug. The curtain drawn. A table meant for fewer, with everybody round it in the arrangement of people who have not been asked to arrange themselves.\n\nThe old man at the head with his mouth open mid-sentence. A young man with his chin on the old man\'s head. A girl leaning in from the end so as to be in it. Two at the right-hand edge, one laughing and one determinedly not.\n\nAnd at the near end, half out of the chair, with one arm still out towards the camera and the other hand flat on the cloth, a man in his forties in a short-sleeved shirt with a square-faced watch on him. He has come the length of the kitchen at speed and got there and is turning back into the frame and the shutter has caught him doing it, and he is laughing at how close it was.\n\nNothing is written on the back.';

const printLastDay: ObjectDefSlice = {
  location: 'nowhere',
  name: 'last-day print',
  nouns: ['print', 'kitchen print', 'photograph', 'picture', 'family', 'film', 'last day'],
  adjectives: ['kitchen', 'family', 'developed'],
  portable: true,
  plotCritical: true,
  handlers: [{ verbs: [EXAMINE], effects: [{ say: printLastDayExamineText }] }],
};

// ---------------------------------------------------------------------------
// §44.1 — Sissy's canister — `act4_sissy_film`'s own DEVELOP handler,
// amended in place onto task P's already-declared object (`objects/hab.ts`
// `ACT4_P_HAB_OBJECTS`, the `act2/objects/usb.ts` mutate-in-place idiom).
// That object's own comment already earmarks this: "developing it is task
// Q's own scene" — its `handlers` field is absent (undefined), unlike
// `act2_film_canister`'s own array below, so it is initialized here first.
// ---------------------------------------------------------------------------

const sissyFilmObj = ACT4_P_HAB_OBJECTS[ACT4_SISSY_FILM]!;
if (sissyFilmObj.handlers === undefined) sissyFilmObj.handlers = [];
const sissyFilmAlreadyWired = sissyFilmObj.handlers.some((h) => h.verbs.includes(V_DEVELOP));
if (!sissyFilmAlreadyWired) {
  sissyFilmObj.handlers.push({
    verbs: [V_DEVELOP],
    when: { all: [{ at: COUNTY_LIBRARY }, { flag: ACT4_DARKROOM_OPEN }, { not: { flag: ACT4_SISSY_FILM_DEVELOPED } }] },
    effects: [{ script: { id: ACT4_DEVELOP_SCRIPT, args: { which: 'sissy' } } }],
  });
}

// ---------------------------------------------------------------------------
// §44.2 — Jules's canister — `act2_film_canister`'s own DEVELOP handler,
// amended in place (the `act2/objects/usb.ts` mutate-in-place idiom; that
// object's own shipped `EXAMINE`/`OPEN` handlers, and its `plotCritical`,
// are untouched — §56.1's own row: "unchanged as an object").
// ---------------------------------------------------------------------------

const filmCanisterHandlers = ACT2_CACHE_OBJECTS[ACT2_FILM_CANISTER]!.handlers!;
const filmCanisterAlreadyWired = filmCanisterHandlers.some((h) => h.verbs.includes(V_DEVELOP));
if (!filmCanisterAlreadyWired) {
  filmCanisterHandlers.push({
    verbs: [V_DEVELOP],
    when: { all: [{ at: COUNTY_LIBRARY }, { flag: ACT4_DARKROOM_OPEN }, { not: { flag: ACT4_JULES_FILM_DEVELOPED } }] },
    effects: [{ script: { id: ACT4_DEVELOP_SCRIPT, args: { which: 'jules' } } }],
  });
}

export const ACT4_Q_DARKROOM_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT4_PRINT_SKY]: printSky,
  [ACT4_PRINT_LAST_DAY]: printLastDay,
};

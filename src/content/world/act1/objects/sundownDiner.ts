// The Sundown Diner — the room's six objects, plus one sub-part and one
// new portable item (`docs/superpowers/specs/2026-09-04-act1-wave3-prose.md`
// PART ONE, §4). Prose transcribed exactly (hard rule 5); the object/
// sub-part split and verb wiring are this builder's own calls (see
// `objects/sheriffOffice.ts`'s own header for the established idiom this
// follows).

import type { Effect } from '../../../../engine/effects';
import type { ObjectDefSlice } from '../../../../engine/world';
import { USE_VERB_ID } from '../../../../engine/move';
import { EXAMINE, OPEN, READ, SEARCH, SIT, TAKE } from '../verbs';
import { dinerFacesText } from '../verbs';
import {
  CLUE_MUG_SPELLING,
  COFFEE_URN,
  DINER_COUNTER,
  DINER_MUGS,
  DINER_PHOTOS,
  DINER_PHOTOS_FACES,
  DINER_WINDOW,
  FLAG_HANDLED_MUG,
  FLAG_SAT_AT_COUNTER,
  MUG,
  PIE_CASE,
  SUNDOWN_DINER,
  SUNDOWN_DINER_NO_EXIT_GATE,
  V_DRINK,
  V_LOOK_FOR_FACE,
  V_ORDER,
  V_POUR,
} from '../ids';

// ---------------------------------------------------------------------------
// §4.1 — The mugs
// ---------------------------------------------------------------------------

const mugsExamine =
  'Upside down on a shelf behind the counter, three deep, warm from the urn underneath them. The white is not the same white all the way along: one end is heavy old diner china with a green band under the rim, the other is a newer, thinner, brighter set, and there are twice as many of the new as of the old.\n\nEvery one of them is printed round the side in a bar of type:\n\n    THE SUNDOWNER\n\nThe old ones say it in a slab serif. The new ones say it in something rounder that was fashionable more recently.';

const mugsExamineEffects: Effect[] = [{ say: mugsExamine }, { grantClue: CLUE_MUG_SPELLING }];

const mugTakeText =
  'It comes off the shelf warm and heavier than it looks, the way this kind is meant to be, with a foot ring ground flat by ten thousand slides across a counter.\n\nPearl fills it before you have decided whether you wanted it filled.';
const mugTakeEffects: Effect[] = [{ say: mugTakeText }, { set: [FLAG_HANDLED_MUG, true] }, { move: [MUG, 'inventory'] }];

const dinerMugs: ObjectDefSlice = {
  location: SUNDOWN_DINER,
  name: 'mugs',
  portable: false,
  nouns: ['mug', 'mugs', 'cup', 'cups', 'shelf', 'china', 'crockery', 'ware', 'sundowner'],
  handlers: [
    // §4.1's "READ MUG" resolves to EXAMINE — "no second string" (one
    // handler, shared verbs, not a duplicated response).
    { verbs: [EXAMINE, READ], effects: mugsExamineEffects },
    { verbs: [TAKE], effects: mugTakeEffects },
  ],
};

// §4.1's granted portable item.
//
// Once granted, this and `dinerMugs` above (the shelf, which never leaves
// the room) both answer to the bare noun "mug". The resolver's held
// tie-break (`parser/resolver.ts`, §3.2 — added in v0.7.0 for exactly this
// case) prefers the carried mug, so the spec-canonical "SHOW MUG TO PEARL"
// and "EXAMINE MUG" land here directly; "EXAMINE MUGS"/"EXAMINE SHELF"
// still reach the shelf. Its own EXAMINE/READ text is `mugInHandText`
// below.
// The carried mug's own EXAMINE/READ (written by `narrative-writer` for
// v0.7.0 after the wave-3 playtest found READ throwing for want of any
// text; the wave-3 doc supplies only the shelf's). One string for both
// verbs, per §4.1's own "no second string" ruling for the shelf.
const mugInHandText =
  'White, with a band of green just below the lip and the glaze crazed into a net of fine lines a thumbnail can find. It is the kind of china made to keep coffee hot through a long shift. Round the side, printed and worn thin where hands go:\n\n    THE SUNDOWNER\n\nThe handle takes two fingers and no more.';

const mug: ObjectDefSlice = {
  location: 'nowhere',
  name: 'mug',
  portable: true,
  handlers: [{ verbs: [EXAMINE, READ], effects: [{ say: mugInHandText }] }],
  // "sundowner mug" is a second, genuinely distinct compound noun — this
  // object being portable, `validate.ts`'s `object-noun-collision` check
  // (its own "portable object vs. every other room" half) also compared it
  // against `sheriff_office`'s own `whitlock_desk` (which carries a plain
  // "mug" noun of its own, §12.3.4 — an unrelated prop, a school-badge mug
  // on her desk); this noun quiets that warning the same way
  // `objects/frontDesk.ts`'s `room_key` uses "my key" against its own
  // collisions — see this object's own header note just above on why it is
  // not a *functional* disambiguator for the `dinerMugs` collision that
  // note actually documents, only for this incidental cross-room one.
  nouns: ['mug', 'sundowner mug'],
};

// ---------------------------------------------------------------------------
// §4.2 — The counter
// ---------------------------------------------------------------------------

const counterExamine =
  'Formica with a boomerang pattern in it, a chrome edge, and eight stools whose red vinyl has been replaced at different times and never all at once. In front of every third stool: sugar, salt, pepper, napkins, a bottle of red.\n\nA menu propped against the sugar — hand-lettered, laminated, amended in three places with a marker that did not quite match. THE SUNDOWN is across the top in the same gold arc as the window, by the same hand.';

const counterSitText =
  'The stool takes your weight and turns a few degrees under you, the way a stool does when it has been sat on properly for sixty years.\n\nThe counter is at exactly the height counters are, and your elbows find it without being asked.';

const menuReadText =
  "Eggs, done six ways. Hash. Toast. Pie, and under PIE the single word ASK.\n\nCoffee has a price. Under the price, in the different marker: AND AFTER THAT IT'S JUST COFFEE.";

const dinerCounter: ObjectDefSlice = {
  location: SUNDOWN_DINER,
  name: 'counter',
  portable: false,
  // Wiring note (§4.2): bare "register" must NOT resolve to the front
  // desk's guest register — a different room, a different object; in this
  // room "register" is just another word for the till, and it falls
  // through to this object's own EXAMINE, same as "top"/"formica"/etc.
  nouns: ['counter', 'top', 'formica', 'stool', 'stools', 'seat', 'seats', 'menu', 'card', 'napkin', 'dispenser', 'sugar', 'salt', 'pepper', 'ketchup', 'bottle', 'till', 'register'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: counterExamine }] },
    { verbs: [SIT], effects: [{ say: counterSitText }, { set: [FLAG_SAT_AT_COUNTER, true] }] },
    { verbs: [READ], effects: [{ say: menuReadText }] },
  ],
};

// ---------------------------------------------------------------------------
// §4.3 — The urn
// ---------------------------------------------------------------------------

const urnExamine =
  'Two chrome cylinders side by side with a gauge glass down the front of each, one full and one nearly. A machine built to be repaired rather than replaced, and repaired several times by somebody who left the new parts unpolished.\n\nEvery so often it lets a little steam out through a valve at the top, which is the loudest thing in the building.';

const coffeeText =
  '"You don\'t have to ask," says Pearl, already pouring, and the mug is in front of you before the sentence is finished.\n\nIt is very hot, extremely strong, and has been on since before you were awake. It goes through the headache like a light going on in a room further down the house.';

const coffeeUrn: ObjectDefSlice = {
  location: SUNDOWN_DINER,
  name: 'urn',
  portable: false,
  nouns: ['urn', 'coffee', 'pot', 'machine', 'boiler', 'spigot', 'tap', 'gauge', 'steam'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: urnExamine }] },
    { verbs: [V_DRINK, V_ORDER, V_POUR, USE_VERB_ID], effects: [{ say: coffeeText }] },
  ],
};

// ---------------------------------------------------------------------------
// §4.4 — The pie case
// ---------------------------------------------------------------------------

const pieCaseExamine =
  'A lit glass case with three shelves that go round very slowly, carrying two pies, one cake with a slice out of it, and an empty plate with a paper doily on it that is going round as conscientiously as everything else.\n\nThe bulb inside is warmer than the pies want, and nobody has ever mentioned it.';

const pieCaseOpenText =
  'The case opens on Pearl\'s side, which is not an accident. You will get pie the way everybody in this county gets pie, which is by asking.';

const pieOrderText =
  '"Yesterday\'s," she says, cutting it, "and I\'d have it anyway."\n\nIt is rhubarb, and it is better than the coffee, and she does not tell you what it costs.';

const pieCase: ObjectDefSlice = {
  location: SUNDOWN_DINER,
  name: 'pie case',
  portable: false,
  nouns: ['pie case', 'case', 'display', 'glass', 'pie', 'pies', 'cake', 'dessert', 'doily', 'plate', 'shelf'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: pieCaseExamine }] },
    // §4.4's "open case"/"take pie"/"steal pie" — "steal" is already a
    // global TAKE synonym (`verbs.ts`), so it reaches this same text
    // without its own entry.
    { verbs: [OPEN, TAKE], effects: [{ say: pieCaseOpenText }] },
    // §4.4's "ask for pie"/"order pie" — "buy pie" is NOT wired here (a
    // genuine wiring conflict, this task's report): "buy" is already a
    // global TAKE synonym reused elsewhere (General Store's postcards), and
    // the engine has no way to tell which literal synonym of one VerbId a
    // player typed — "buy pie" reaches the OPEN/TAKE handler above instead.
    { verbs: [V_ORDER], effects: [{ say: pieOrderText }] },
  ],
};

// ---------------------------------------------------------------------------
// §4.5 — The photographs
// ---------------------------------------------------------------------------

const photosExamine =
  "Four rows deep and going round the corner. Ball teams. A flood, with men standing in it looking pleased. A parade with a fire engine in it, and the same fire engine, older, two frames along. Somebody's hundredth birthday, twice, two different somebodies.\n\nNear the till, in a black frame, the front of this building photographed from across the street, awning down, four people underneath it squinting. The gold on the window in the photograph is the same arc and the same hand: THE SUNDOWN.";

const dinerPhotos: ObjectDefSlice = {
  location: SUNDOWN_DINER,
  name: 'photographs',
  portable: false,
  // "faces" moved to the sub-part below.
  nouns: ['photograph', 'photographs', 'photo', 'photos', 'picture', 'pictures', 'frame', 'frames', 'wall', 'portrait', 'team', 'parade'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: photosExamine }] },
    // §4.5's "search photographs" shares `dinerFacesText` with "look at
    // faces" (the sub-part below) and the bare `V_LOOK_FOR_FACE` phrasings
    // (`verbs.ts`).
    { verbs: [SEARCH], effects: [{ say: dinerFacesText }] },
  ],
};

const dinerPhotosFaces: ObjectDefSlice = {
  location: { on: DINER_PHOTOS },
  name: 'faces',
  portable: false,
  nouns: ['faces', 'face'],
  handlers: [{ verbs: [EXAMINE, SEARCH, V_LOOK_FOR_FACE], effects: [{ say: dinerFacesText }] }],
};

// ---------------------------------------------------------------------------
// §4.6 — The window
// ---------------------------------------------------------------------------

const windowExamine =
  'Plate glass with the gold arc across it, read backwards from in here: NWODNUS EHT, with all the shadow lines on the wrong side of the letters.\n\nHooked inside the door, a two-sided card. From here it says OPEN. It has been turned to OPEN since before the hour the Sundown opens, because Pearl is in and the door is not locked, and in this building those two facts have always settled it.';

const dinerWindow: ObjectDefSlice = {
  location: SUNDOWN_DINER,
  name: 'window',
  portable: false,
  nouns: ['window', 'glass', 'gold', 'gilt', 'lettering', 'letters', 'sign', 'arc', 'door', 'card', 'open sign', 'closed sign', 'street'],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: windowExamine }] }],
  // §4.6's "look out window"/"look at street" reach `windowStreetText` via
  // the bare `V_LOOK_OUT` verb (`verbs.ts`), not a handler here — see
  // `ids.ts`'s own comment on `V_LOOK_OUT` for why "street" stays a plain
  // noun on this object rather than a sub-part.
};

// §5's always-closed "every other direction" gate — mirrors `SHERIFF_OFFICE_NO_EXIT_GATE`.
const sundownDinerNoExitGate: ObjectDefSlice = { location: SUNDOWN_DINER };

export const SUNDOWN_DINER_OBJECTS: Record<string, ObjectDefSlice> = {
  [DINER_MUGS]: dinerMugs,
  [MUG]: mug,
  [DINER_COUNTER]: dinerCounter,
  [COFFEE_URN]: coffeeUrn,
  [PIE_CASE]: pieCase,
  [DINER_PHOTOS]: dinerPhotos,
  [DINER_PHOTOS_FACES]: dinerPhotosFaces,
  [DINER_WINDOW]: dinerWindow,
  [SUNDOWN_DINER_NO_EXIT_GATE]: sundownDinerNoExitGate,
} satisfies Record<string, ObjectDefSlice>;

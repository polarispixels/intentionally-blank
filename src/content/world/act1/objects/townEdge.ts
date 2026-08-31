// Town Edge — the room's six objects
// (`docs/superpowers/specs/2026-09-04-act1-wave3-prose.md` §13), plus the
// three sub-parts the "which noun word resolved" gap requires (`ids.ts`'s
// own header on `BILLBOARD_SCRATCH`/`BILLBOARD_BACK`/`ROAD_NORTH_CATTLE_
// GUARD`/`PADDOCK_TROUGH`) and the two always-closed gates (the build
// boundary and "every other direction").
//
// KNOWN WIRING CONFLICT (§18, this task's own brief) — bare "sign": the
// billboard and the town-limits sign both carry it in their own doc-given
// noun lists (§13.1/§13.2), and neither carries an adjective that would let
// `resolveNounPhrase` narrow a bare "sign" between them (`parser/
// resolver.ts` only narrows an ambiguous bare-noun pool when the player's
// phrase supplies a matching adjective — see `tests/parser-resolve.test.ts`'s
// own "several matches is a clarify" case). Resolved the same way that test
// file's own KEY/DOOR_KEY/SPARE_KEY fixture is: bare "sign" clarifies
// ("Which do you mean, the billboard, or the town limits sign?"), and the
// qualified forms the doc's own handler sections actually name ("wall
// drug"/"ad" for the billboard; "town sign"/"limits"/"population" for the
// marker) resolve unambiguously, because only one object's noun list claims
// each of those words. "board" (both objects' own noun lists also include
// it) has the identical shape and the identical resolution — see this
// task's report. `tests/world-act1-wave3-town-edge.test.ts` exercises the
// bare "sign" clarify directly.

import type { Effect } from '../../../../engine/effects';
import type { ObjectDefSlice } from '../../../../engine/world';
import { DIRECTION_VERB_IDS } from '../../../../engine/move';
import { BREAK, CLIMB, EXAMINE, LOOK_BEHIND, OPEN, READ, TOUCH } from '../verbs';
import { northBlockedText } from '../townEdge';
import {
  BILLBOARD_BACK,
  BILLBOARD_CLOSE,
  BILLBOARD_SCRATCH,
  CLUE_BILLBOARD_SCRATCH,
  CLUE_LIGHTS_RESOLVED,
  FAR_LIGHTS,
  FLAG_ENTERED_PADDOCK,
  FLAG_READ_BILLBOARD_SCRATCH,
  FLAG_SAW_GRADED_STRIP,
  OPEN_COUNTRY,
  PADDOCK,
  PADDOCK_TROUGH,
  ROAD_NORTH,
  ROAD_NORTH_CATTLE_GUARD,
  TOWN_EDGE,
  TOWN_EDGE_BOUNDARY_GATE,
  TOWN_EDGE_NO_EXIT_GATE,
  TOWN_SIGN,
  V_APPROACH,
  V_CROSS,
  V_FOLLOW,
  V_WATCH,
} from '../ids';

// ---------------------------------------------------------------------------
// §13.1 — The billboard
// ---------------------------------------------------------------------------

const billboardExamine =
  'Up close it is larger than it has any need to be, and old: the boards behind the paint have shrunk apart in three places and been painted over as one surface anyway.\n\n    WALL DRUG - 32 MILES\n    FREE ICE WATER\n    PROBABLY\n\nLow down on the left leg, at about the height of a man with a nail and some time, somebody has scratched through the paint to the wood.\n\n    It was 32 miles yesterday too.\n\nThe scratches have weathered the same brown as the wood around them.';
const billboardExamineEffects: Effect[] = [{ say: billboardExamine }, { grantClue: CLUE_BILLBOARD_SCRATCH }, { set: [FLAG_READ_BILLBOARD_SCRATCH, true] }];

const scratchText =
  'A nail, or a key, drawn through the paint hard enough to raise a burr on both sides of every stroke. Whoever did it pressed the same on the last letter as on the first.';

const billboardBackText =
  'The frame, two legs in concrete, a ladder of cross-braces up one side. Nothing else at all. The back of the boards is grey and has never been painted.';

const billboardClimbText =
  'The cross-braces would take you. From the top you would see the same lights from eight feet higher, in more wind, with a head that has already had a night.\n\nYou put a hand on it and take it off again.';

const billboardClose: ObjectDefSlice = {
  location: TOWN_EDGE,
  name: 'billboard',
  portable: false,
  // "scratch"/"scratches"/"scratched" and "back" move to the sub-parts
  // below. Wiring note (found in play, not in the doc's own header): the
  // noun-phrase grammar resolves only on the PHRASE'S LAST word
  // (`grammar.ts`'s `toPhrase` — same gap `objects/mainStreet.ts`'s own
  // `BRICK_ROW_SIGN` header already names), so "wall drug" as a two-word
  // typed phrase needs bare "drug" registered too, or it never resolves at
  // all — added below. "drug store"/"ice water"/"free ice water" have the
  // identical shape and are NOT fixed the same way (their own last words —
  // "store"/"water" — are also claimed elsewhere in this room's own scope,
  // by objects those words correctly belong to; adding them here would
  // misroute those objects' own phrasings rather than fix this one). This
  // mirrors an already-shipped, unaddressed gap: Main Street's own
  // `billboard` object (`objects/mainStreet.ts`) has the same three
  // compound nouns with no bare "drug"/"store"/"water" either. See this
  // task's report.
  nouns: [
    'billboard',
    'sign',
    'board',
    'boards',
    'hoarding',
    'advertisement',
    'ad',
    'wall drug',
    'walldrug',
    'drug',
    'drug store',
    'ice water',
    'free ice water',
    'probably',
    'writing',
    'message',
    'paint',
    'leg',
    'legs',
    'frame',
    'brace',
    'braces',
  ],
  handlers: [
    { verbs: [EXAMINE, READ], effects: billboardExamineEffects },
    // "look behind billboard"/"go behind billboard" (§13.1) — "examine back" reaches the same text via the sub-part below, sharing this one string.
    { verbs: [LOOK_BEHIND], effects: [{ say: billboardBackText }] },
    { verbs: [CLIMB], effects: [{ say: billboardClimbText }] },
    // "go to wall drug" (§13.3) — routes to the build boundary, north. No separate string.
    { verbs: [V_APPROACH], effects: [{ say: northBlockedText }] },
  ],
};

const billboardScratch: ObjectDefSlice = {
  location: { on: BILLBOARD_CLOSE },
  name: 'scratch',
  portable: false,
  nouns: ['scratch', 'scratches', 'scratched'],
  handlers: [{ verbs: [EXAMINE, TOUCH, READ], effects: [{ say: scratchText }] }],
};

const billboardBack: ObjectDefSlice = {
  location: { on: BILLBOARD_CLOSE },
  name: 'back',
  portable: false,
  nouns: ['back'],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: billboardBackText }] }],
};

// ---------------------------------------------------------------------------
// §13.2 — The town limits sign
// ---------------------------------------------------------------------------

const townSignText =
  'It faces north, for people arriving, so you read the back of it first and then walk round.\n\n    TOWN LIMITS\n    POP. 412\n\nThe number is on a smaller plate bolted over the middle of the board. Above the plate, in the paint, four older bolt holes in two pairs. That is two plates ago.\n\nThe board has been repainted twice. The plate has not been repainted at all.';

const townSign: ObjectDefSlice = {
  location: TOWN_EDGE,
  name: 'town limits sign',
  portable: false,
  nouns: ['sign', 'town sign', 'limits', 'town limits', 'population', 'pop', 'number', 'plate', 'board', 'bolts', 'bolt holes', 'holes'],
  // Resolves §18's known conflict: bare "sign" is a genuine clarify against
  // `billboard_close` (neither object carries an adjective that would
  // narrow it — see this task's report), but "town sign" itself must
  // resolve directly to the marker per §18's own ruling ("the town marker
  // wins on town sign, limits, population"). `adjectives: ['town']` is
  // what makes that one qualified phrase a full match instead of degrading
  // back to the ambiguous bare-noun pool (`resolver.ts`'s own ranking rule).
  adjectives: ['town'],
  handlers: [{ verbs: [EXAMINE, READ], effects: [{ say: townSignText }] }],
};

// ---------------------------------------------------------------------------
// §13.3 — The road north
// ---------------------------------------------------------------------------

const roadNorthText =
  "Twenty yards past the last kerb the asphalt changes: the town's surface stops and the county's starts, a shade paler, with the seam between them run over so many times it has worn up into a ridge you can feel through your shoes.\n\nThere is a cattle guard here, pipes across a pit. Beyond it the centre line begins — dashes, painted recently — and goes north until the dark takes them one at a time.\n\nIt is thirty-two miles of that.";

const cattleGuardText =
  'Pipes across a pit set in concrete, a hundred years of ground-in mud between them, and one dead thistle standing up out of the pit that nothing has disturbed.\n\nIt exists to stop animals crossing. It has no opinion about people.';

const roadNorth: ObjectDefSlice = {
  location: TOWN_EDGE,
  name: 'road',
  portable: false,
  // "cattle guard"/"cattleguard"/"pit"/"grid"/"culvert" move to the sub-part below.
  nouns: [
    'road',
    'highway',
    'county road',
    'pavement',
    'paving',
    'asphalt',
    'tarmac',
    'blacktop',
    'surface',
    'seam',
    'ridge',
    'centre line',
    'center line',
    'line',
    'dashes',
    'shoulder',
    'gravel',
    'north',
  ],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: roadNorthText }] },
    // "follow road" (§13.3) — routes to the build boundary, north. No separate string.
    { verbs: [V_FOLLOW], effects: [{ say: northBlockedText }] },
  ],
};

const roadNorthCattleGuard: ObjectDefSlice = {
  location: { on: ROAD_NORTH },
  name: 'cattle guard',
  portable: false,
  // Bare "guard" added (same "phrase resolves on its last word" gap as
  // `billboard_close`'s own "drug" — see that object's header) so "cattle
  // guard" (a two-word typed phrase) actually resolves; "cattleguard"
  // (one word) already worked without it.
  nouns: ['cattle guard', 'cattleguard', 'guard', 'pit', 'grid', 'culvert'],
  handlers: [{ verbs: [EXAMINE, V_CROSS], effects: [{ say: cattleGuardText }] }],
};

// ---------------------------------------------------------------------------
// §13.4 — The paddock
// ---------------------------------------------------------------------------

const paddockExamine =
  'Four rails on cedar posts around an acre of nothing, with a gate at the town end held shut by a chain and no lock in the chain.\n\nInside: hoofprints in frozen mud, hundreds of them, old and sharp-edged with the cold. A galvanised trough with two inches of ice on it.\n\nNothing is in it tonight. The top rail at the gate end is worn pale the whole length, where reins have been passed across it for a long time.';

const troughText =
  'The ice gives at the edge and lets you get a finger through. Underneath, water, and under the water a float valve doing its job.\n\nWhich means a live line under this frozen ground. Somebody dug that in and somebody has kept it.';

const enterPaddockText =
  'The chain comes off the post one-handed and the gate swings in on a hinge that has been greased this year.\n\nYou stand in an acre of frozen hoofprints for a while. Nothing about it needs you.';
const enterPaddockEffects: Effect[] = [{ say: enterPaddockText }, { set: [FLAG_ENTERED_PADDOCK, true] }];

const paddock: ObjectDefSlice = {
  location: TOWN_EDGE,
  name: 'paddock',
  portable: false,
  // "trough"/"water"/"ice" move to the sub-part below.
  nouns: ['paddock', 'corral', 'pen', 'field', 'fence', 'rail', 'rails', 'post', 'posts', 'gate', 'chain', 'hoofprints', 'prints', 'tracks', 'mud', 'ground'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: paddockExamine }] },
    // "open gate"/"enter paddock"/"climb fence" (§13.4) — sets entered_paddock.
    { verbs: [OPEN, DIRECTION_VERB_IDS.in, CLIMB], effects: enterPaddockEffects },
  ],
};

const paddockTrough: ObjectDefSlice = {
  location: { on: PADDOCK },
  name: 'trough',
  portable: false,
  nouns: ['trough', 'water', 'ice'],
  handlers: [{ verbs: [EXAMINE, BREAK, TOUCH], effects: [{ say: troughText }] }],
};

// ---------------------------------------------------------------------------
// §13.5 — The lights
// ---------------------------------------------------------------------------

const farLightsText =
  'It resolved as you walked out, the way a town does at night from a road: a glow, then a smear, then this.\n\nA great many separate lights, white and low, in rows the same distance apart. One red one higher than the rest, on something you cannot see, going on and off very slowly. And behind all of it, going up, something paler than the sky that keeps being made and keeps going away sideways — steam, at that distance, in this cold, off something warm.\n\nYou cannot see a building. You can see where a building has to be.';
const farLightsEffects: Effect[] = [{ say: farLightsText }, { grantClue: CLUE_LIGHTS_RESOLVED }];

const farLights: ObjectDefSlice = {
  location: TOWN_EDGE,
  name: 'lights',
  portable: false,
  nouns: ['lights', 'light', 'glow', 'plant', 'facility', 'works', 'north', 'horizon', 'red light', 'tower', 'steam', 'plume', 'rows'],
  handlers: [
    { verbs: [EXAMINE, V_WATCH], effects: farLightsEffects },
  ],
};

// ---------------------------------------------------------------------------
// §13.6 — The country
// ---------------------------------------------------------------------------

const openCountryText =
  'Off the road on both sides the ground goes away without any argument: grass, frost, and a shape a long way out that is either a hill or the beginning of the country the Badlands are made of. No fences out there, and no lights in any of it. A line of poles runs north beside the road for a while and then does not.\n\nCloser — thirty yards west of the road — the ground has been graded flat in a strip about the width of a truck, running north, grassed over and still perfectly straight. Somebody made a road there once and stopped needing it.';
const openCountryEffects: Effect[] = [{ say: openCountryText }, { set: [FLAG_SAW_GRADED_STRIP, true] }];

const overlandText =
  'It runs north, straight, into a dark with nothing in it to navigate by — in the cold, on foot, at four in the morning, with a head that has already been hit once tonight.\n\nYou get ten paces and your judgement catches up with you.';

const openCountry: ObjectDefSlice = {
  location: TOWN_EDGE,
  name: 'country',
  portable: false,
  // "overland" added (not in §13.6's own header noun list — a builder
  // addition, same reasoning as `ids.ts`'s own header on similar sub-part
  // additions elsewhere) so "walk overland" (§13.6) resolves at all: `V
  // dobj`'s dobj phrase is one word here, and nothing else in this noun
  // list's own last-word set is "overland".
  nouns: ['country', 'land', 'ground', 'dark', 'prairie', 'grass', 'badlands', 'hills', 'hill', 'draw', 'east', 'west', 'fence line', 'poles', 'pole', 'wire', 'strip', 'grade', 'track', 'old road', 'overland'],
  handlers: [
    { verbs: [EXAMINE], effects: openCountryEffects },
    // "follow strip"/"cross country"/"go west"/"walk overland"/"go east" (§13.6) — in-world, not the build boundary. Say which (§14's own instruction) — this is terrain judgment, a real in-scene refusal, not `system.buildBoundary`'s own voice.
    { verbs: [V_FOLLOW, V_CROSS, V_APPROACH], effects: [{ say: overlandText }] },
  ],
};

// ---------------------------------------------------------------------------
// §14's always-closed gates — mirror `MAIN_STREET_BOUNDARY_GATE`/
// `SHERIFF_OFFICE_NO_EXIT_GATE`: no nouns, never resolvable, never described.
// ---------------------------------------------------------------------------

const townEdgeBoundaryGate: ObjectDefSlice = { location: TOWN_EDGE };
const townEdgeNoExitGate: ObjectDefSlice = { location: TOWN_EDGE };

export const TOWN_EDGE_OBJECTS: Record<string, ObjectDefSlice> = {
  [BILLBOARD_CLOSE]: billboardClose,
  [BILLBOARD_SCRATCH]: billboardScratch,
  [BILLBOARD_BACK]: billboardBack,
  [TOWN_SIGN]: townSign,
  [ROAD_NORTH]: roadNorth,
  [ROAD_NORTH_CATTLE_GUARD]: roadNorthCattleGuard,
  [PADDOCK]: paddock,
  [PADDOCK_TROUGH]: paddockTrough,
  [FAR_LIGHTS]: farLights,
  [OPEN_COUNTRY]: openCountry,
  [TOWN_EDGE_BOUNDARY_GATE]: townEdgeBoundaryGate,
  [TOWN_EDGE_NO_EXIT_GATE]: townEdgeNoExitGate,
} satisfies Record<string, ObjectDefSlice>;

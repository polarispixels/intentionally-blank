// Main Street — the room's 7 objects
// (`docs/superpowers/specs/2026-09-02-main-street-prose.md` §4), plus the
// sub-parts the "which noun word resolved" gap requires (same reasoning as
// `objects/fedora.ts`'s `FEDORA_BAND`/`objects/door.ts`'s `DOOR_BOLT`/
// `objects/frontDesk.ts`'s `GUEST_REGISTER_PAGE`): `main_street_road`'s own
// noun list mixes "street"/"road" (EXAMINE gives the wide/empty text) with
// "ground"/"pavement"/"paving"/etc (EXAMINE gives the crouch text), and
// `brick_row`'s own noun list mixes "buildings" (EXAMINE gives the row
// description) with "painted sign"/"wall sign"/"advertisement" (EXAMINE/READ
// give the sign reading) and "window"/"display"/"price list"/"prices"
// (EXAMINE/READ/SEARCH give the shop-window text) — one handler can't tell
// which noun word resolved, so each group gets its own `ObjectId`. See this
// task's report for the two noun-list deviations this forces (brick_row's
// own wiring note on bare "door", and folding "window"/"windows"/"glass"
// onto `brick_row_window` since "display"/"price list"/"prices" need to
// share EXAMINE/READ text with them and the doc's own header noun list
// never declares those three words anywhere else).
//
// Two cuts per this task's brief (the GIVE engine gap — see this task's
// report): `GIVE FEDORA TO HORSE` and `GIVE <anything> TO HORSE`/`FEED
// HORSE`'s "anything else" branch are not wired — GIVE's dispatch is keyed
// on the *given* item's own handlers (`actions.ts`'s `findHandler` reads
// `world.objects[dobj].handlers`, and `dobj` for GIVE is the item, not the
// recipient), so a generic "whatever is given to the horse" response has no
// object to attach to short of a handler on every possible item in the
// game, and "GIVE FEDORA TO HORSE" specifically needs a handler on
// `FEDORA` (`objects/fedora.ts`, room 1's own file — out of this task's
// module). `FEED HORSE` (a real Main Street verb, dobj always the horses)
// is wired.

import type { ObjectDefSlice } from '../../../../engine/world';
import type { Effect } from '../../../../engine/effects';
import { DIRECTION_VERB_IDS } from '../../../../engine/move';
import { crossStreetText, crouchText, EXAMINE, HELLO, OPEN, READ, SEARCH, SMELL, TAKE, TOUCH } from '../verbs';
import { ACT1_MAIN_STREET_BOUNDARY_NORTH } from '../responses';
import {
  BILLBOARD,
  BOARDING_HOUSE,
  BRICK_ROW,
  BRICK_ROW_SIGN,
  BRICK_ROW_WINDOW,
  CLUE_HORIZON_GLOW,
  CLUE_SAME_DISTANCE,
  FLAG_CROSSED_STREET,
  FLAG_HORSE_TOUCHED,
  FLAG_SEEN_MAINTENANCE_MAN,
  FRONT_DESK,
  HORIZON_GLOW,
  HORSES,
  MAIN_STREET,
  MAIN_STREET_BOUNDARY_GATE,
  MAIN_STREET_PAVING,
  MAIN_STREET_ROAD,
  MAINTENANCE_MAN,
  V_APPROACH,
  V_COUNT,
  V_CROSS,
  V_FEED,
  V_KNOCK,
  V_QUESTION,
  V_SLIDE_DOWN,
  V_WATCH,
} from '../ids';

// ---------------------------------------------------------------------------
// §7's `exit.travelText` (`main_street` → `front_desk`) — exported so
// `boarding_house`'s own OPEN/KNOCK/`V_APPROACH` handlers (below) and the
// room's own `in`/`east` exits (`mainStreet.ts`, the room file) share one
// string rather than two copies drifting apart.
// ---------------------------------------------------------------------------

export const MAIN_STREET_TO_FRONT_DESK_TEXT =
  'The spring bell over the frame announces you a second time, and the warmth gets to you about two seconds after the light does.';

// ---------------------------------------------------------------------------
// 4.1 — The horses
// ---------------------------------------------------------------------------

const horsesExamine =
  'Three, at a rail put there for exactly this and worn pale along the top from it. Two are asleep on their feet, one hind hoof cocked, breathing slow enough to count. The third has its head up, looking down the street past you, and it goes on looking after you have finished looking at it.\n\nThey are saddled. The tack is worn, mended, and looked after.';

const horsesTouch =
  'You put a hand on the near one\'s neck. It is warm through the winter coat, and it lets you, and then leans a little of its weight into the hand, which you had not offered.';

const horsesTalk = 'You say something to a horse on an empty street at this hour. It turns one ear back to take it and does not turn the ear forward again.';

const horsesTake =
  'You have a hand on the reins before the rest of it catches up: that these belong to somebody asleep in one of these buildings, and that you do not currently have a name to be caught under.\n\nYou put the reins back on the rail.';

const horsesSmell = 'Horse, and the leather and cold iron that come with one. The first smell tonight you have not had to think about.';

const horsesCount = 'Three. You count them twice and get three both times.';

const horsesFeed = 'The horse investigates your hand thoroughly, establishes that it is a hand, and goes back to what it was doing.';

const crossStreetEffects: Effect[] = [{ say: crossStreetText }, { set: [FLAG_CROSSED_STREET, true] }];

const horses: ObjectDefSlice = {
  location: MAIN_STREET,
  name: 'horses',
  portable: false,
  nouns: ['horse', 'horses', 'mare', 'gelding', 'animal', 'animals', 'three horses', 'rail', 'hitching rail', 'hitch', 'rein', 'reins', 'tack', 'saddle', 'saddles', 'bridle'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: horsesExamine }] },
    { verbs: [TOUCH], effects: [{ say: horsesTouch }, { set: [FLAG_HORSE_TOUCHED, true] }] },
    { verbs: [HELLO], effects: [{ say: horsesTalk }] },
    // "RIDE HORSE" reaches this via `V_SLIDE_DOWN` (the landing banister's own word — "ride" can't be TAKE's, `validate.ts`'s verb-word-collision rule; see `verbs.ts`'s own comment on `TAKE`), sharing the same text as TAKE/UNTIE/MOUNT.
    { verbs: [TAKE, V_SLIDE_DOWN], effects: [{ say: horsesTake }] },
    { verbs: [SMELL], effects: [{ say: horsesSmell }] },
    { verbs: [V_COUNT], effects: [{ say: horsesCount }] },
    { verbs: [V_FEED], effects: [{ say: horsesFeed }] },
    // "GO TO HORSES"/"APPROACH HORSES"/"GO TO RAIL" (§6) — same beat as `main_street_road`'s own V_CROSS handler.
    { verbs: [V_APPROACH], effects: crossStreetEffects },
  ],
};

// ---------------------------------------------------------------------------
// 4.2 — The billboard
// ---------------------------------------------------------------------------

const billboardText =
  'It stands where the street runs out, north, on two legs in the dirt. It faces the road rather than the horizon, and what light there is off the north sky comes across it at enough of an angle to read by.\n\n    WALL DRUG - 32 MILES\n    FREE ICE WATER\n    PROBABLY\n\nThe paint is old. The board under the paint is older.';

const billboard: ObjectDefSlice = {
  location: MAIN_STREET,
  name: 'billboard',
  portable: false,
  nouns: ['billboard', 'sign', 'board', 'hoarding', 'advertisement', 'ad', 'wall drug', 'drug store', 'free ice water'],
  handlers: [
    { verbs: [EXAMINE, READ], effects: [{ say: billboardText }] },
    // "go to billboard"/"approach billboard"/"walk to sign" (§4.2) — routes to the build boundary, north. No separate string.
    { verbs: [V_APPROACH], effects: [{ say: { ref: ACT1_MAIN_STREET_BOUNDARY_NORTH } }] },
  ],
};

// ---------------------------------------------------------------------------
// 4.3 — The glow
// ---------------------------------------------------------------------------

const glowText =
  'Low along the north horizon, wide, and flat along the bottom. It does not flicker. It has not changed colour or size since you came outside, and the stars go all the way down to the top of it.\n\nThere is nothing else on this street to compare it to.';

const glowEffects: Effect[] = [{ say: glowText }, { grantClue: CLUE_HORIZON_GLOW }];

const horizonGlow: ObjectDefSlice = {
  location: MAIN_STREET,
  name: 'glow',
  portable: false,
  nouns: ['glow', 'light', 'lights', 'horizon', 'sky', 'north', 'north sky', 'brightness'],
  handlers: [
    { verbs: [EXAMINE], effects: glowEffects },
    // "WATCH GLOW" has no response of its own — resolves to the EXAMINE above (§4.3's own note).
    { verbs: [V_WATCH], effects: glowEffects },
    // §8's "any attempt to walk toward the glow" — routes to the build boundary, north.
    { verbs: [V_APPROACH], effects: [{ say: { ref: ACT1_MAIN_STREET_BOUNDARY_NORTH } }] },
  ],
};

// ---------------------------------------------------------------------------
// 4.4 — The brick row, its wall sign, and its shop window
// ---------------------------------------------------------------------------

const brickRowExamine =
  'Two storeys of brick, laid by people who expected the town to want it a long time. At street level, dark glass with the shapes of goods behind it, doors set back in their frames, a bench nobody is on. Above, windows with curtains in about half of them.\n\nOn the flat end wall of the row, painted onto the brick and gone soft with weather, an advertisement.';

const doorsLockedText = 'Locked, and the one past it, and the one past that. Cold glass, no light behind any of it. Whoever owns them went home, which is what people do.';

const brickRow: ObjectDefSlice = {
  location: MAIN_STREET,
  name: 'buildings',
  portable: false,
  // Wiring note (§4.4): bare "door" must NOT resolve here — in this room it
  // resolves to `boarding_house` — so it is dropped from this noun list
  // (kept: "doors" plural, plus the doc's own sanctioned qualified forms).
  // "window"/"windows"/"glass" and the sign words move to the sub-parts
  // below (this file's own header note).
  nouns: ['buildings', 'building', 'brick', 'brickwork', 'storefronts', 'shopfront', 'shops', 'shop', 'store', 'stores', 'doors', 'facade', 'wall', 'bench', 'awning', 'shop door', 'nearest door'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: brickRowExamine }] },
    // "open door"/"try door"/"knock on door"/"enter shop" (§4.4).
    { verbs: [OPEN, V_KNOCK, DIRECTION_VERB_IDS.in], effects: [{ say: doorsLockedText }] },
  ],
};

const wallSignText =
  'The brick has taken two coats of paint about fifty years apart and is giving both back at once — a palimpsest, made by weather rather than on purpose. The top one is still readable from where the light falls:\n\n    W LL D UG        32 MILES\n\nUnder it, in a different hand, the older one, gone past reading.';

const wallSignEffects: Effect[] = [{ say: wallSignText }, { grantClue: CLUE_SAME_DISTANCE }];

const brickRowSign: ObjectDefSlice = {
  location: { on: BRICK_ROW },
  name: 'painted sign',
  portable: false,
  // Wiring note (not in the doc's own header — found in play, see this
  // task's report): the noun-phrase grammar resolves only on the PHRASE'S
  // LAST word (`grammar.ts`'s `toPhrase`), so "painted sign"/"wall sign" as
  // multi-word strings alone are dead — bare "sign" has to be registered
  // too, and since `billboard` and `boarding_house` both also claim bare
  // "sign" (their own doc-specified noun lists), "sign"/"advertisement"
  // with no qualifying word is a genuine three/two-way clarify. Adjectives
  // narrow the qualified forms the doc's own handler section actually
  // names ("read wall sign", "examine painted sign") to this object alone.
  nouns: ['sign', 'painted sign', 'wall sign', 'ghost sign', 'advertisement'],
  adjectives: ['painted', 'wall', 'ghost'],
  handlers: [{ verbs: [EXAMINE, READ], effects: wallSignEffects }],
};

const shopWindowText =
  'Behind the near glass, a display somebody arranged and nobody has changed since: tinned goods in a pyramid, a card of buttons, and a hand-lettered price list propped at the front of it.\n\nBread. Coffee. Lamp oil. Batteries. A number beside each one.\n\nYou have no idea whether any of those numbers is a lot.';

const brickRowWindow: ObjectDefSlice = {
  location: { on: BRICK_ROW },
  name: 'shop window',
  portable: false,
  nouns: ['window', 'windows', 'glass', 'display', 'price list', 'prices'],
  handlers: [{ verbs: [EXAMINE, READ, SEARCH], effects: [{ say: shopWindowText }] }],
};

// ---------------------------------------------------------------------------
// 4.5 — The street, and its paving
// ---------------------------------------------------------------------------

const streetExamine =
  'Wide — wider than the town has needed it for a while — and empty end to end. Between the boarding house and the building next to it there is an alley, as dark as an alley at this hour has every right to be.';

const alleyText =
  'You get four steps in before the dark stops being something you can usefully walk about in. A smell of bins, a gutter running somewhere out of sight, the back of the boarding house going up into nothing.\n\nYou come back out.';

const mainStreetRoad: ObjectDefSlice = {
  location: MAIN_STREET,
  name: 'street',
  portable: false,
  nouns: ['street', 'road', 'main street', 'alley', 'alleyway'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: streetExamine }] },
    { verbs: [TOUCH], effects: [{ say: crouchText }] },
    { verbs: [V_CROSS], effects: crossStreetEffects },
    // "enter alley"/"go up alley"/"search alley" (§4.5) — narrator voice, permanently not a room (scope cut §1); must never reach `system.buildBoundary`.
    { verbs: [DIRECTION_VERB_IDS.in, DIRECTION_VERB_IDS.up, SEARCH], effects: [{ say: alleyText }] },
  ],
};

const mainStreetPaving: ObjectDefSlice = {
  location: { on: MAIN_STREET_ROAD },
  name: 'paving',
  portable: false,
  nouns: ['ground', 'floor', 'surface', 'pavement', 'paving', 'asphalt', 'tarmac', 'kerb', 'curb', 'gutter'],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: crouchText }] }],
};

// ---------------------------------------------------------------------------
// 4.6 — The man on the ladder. An object with handlers, not an NPC — no
// `NpcDefSlice`, no topics, no schedule (§4.6's own wiring note).
// ---------------------------------------------------------------------------

const maintenanceManExamine =
  'Four buildings down, up a stepladder under the one lamp that works, with the glass cover in one hand and the other hand up inside the fitting. Gray coveralls. A bag of tools open on the pavement at the foot of the ladder.\n\nHe is not hurrying and he is not interesting.';

const maintenanceManTalk = '"Evening," he says, downward, to the pavement, without stopping what he is doing.\n\nThat is the whole of it.';

const maintenanceManAsk = 'He answers the way a man answers while his hands are busy — yes, no, not that he knows of — and goes on with the fitting. There is nothing in any of it worth carrying away.';

const maintenanceMan: ObjectDefSlice = {
  location: MAIN_STREET,
  name: 'man',
  portable: false,
  nouns: ['man', 'maintenance man', 'workman', 'worker', 'fella', 'guy', 'repairman', 'electrician', 'coveralls', 'overalls', 'ladder', 'stepladder', 'tools', 'tool bag', 'lamp', 'streetlamp', 'street lamp', 'lamp standard', 'light', 'fitting', 'glass', 'cover'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: maintenanceManExamine }, { set: [FLAG_SEEN_MAINTENANCE_MAN, true] }] },
    { verbs: [HELLO], effects: [{ say: maintenanceManTalk }] },
    // "question man" (§4.6) reaches this. "ask man about <anything>"/"ask man for help" do NOT — see this file's header and this task's report on why the word "ask" can't reach a plain (non-NPC) object.
    { verbs: [V_QUESTION], effects: [{ say: maintenanceManAsk }] },
  ],
};

// ---------------------------------------------------------------------------
// 4.7 — The boarding house, from outside
// ---------------------------------------------------------------------------

const boardingHouseExamine =
  'Three storeys of the same brick as everything else, with a fanlight over the door and ROOMS painted across the glass of it in an arc, from the inside, so it reads properly out here.\n\nOne window is lit, ground floor, front, and it is the green of the desk lamp. Everything above it is dark. Your own is at the back.';

const enterFrontDeskEffects: Effect[] = [{ say: MAIN_STREET_TO_FRONT_DESK_TEXT }, { goto: FRONT_DESK }];

const boardingHouse: ObjectDefSlice = {
  location: MAIN_STREET,
  name: 'boarding house',
  container: { open: false, locked: false },
  nouns: ['boarding house', 'house', 'hotel', 'building', 'my building', 'door', 'front door', 'entrance', 'transom', 'fanlight', 'sign', 'rooms', 'windows'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: boardingHouseExamine }] },
    // "open door"/"enter"/"go in"/"knock" (§4.7) — the exit (§7). No separate string; travelText covers it.
    { verbs: [OPEN, V_KNOCK, DIRECTION_VERB_IDS.in], effects: enterFrontDeskEffects },
  ],
};

// ---------------------------------------------------------------------------
// §8 — the always-closed build-boundary gate. Mirrors `LANDING_BOUNDARY_GATE`
// (`objects/landing.ts`): no `nouns`, never resolvable, never described.
// ---------------------------------------------------------------------------

const mainStreetBoundaryGate: ObjectDefSlice = {
  location: MAIN_STREET,
};

export const MAIN_STREET_OBJECTS: Record<string, ObjectDefSlice> = {
  [HORSES]: horses,
  [BILLBOARD]: billboard,
  [HORIZON_GLOW]: horizonGlow,
  [BRICK_ROW]: brickRow,
  [BRICK_ROW_SIGN]: brickRowSign,
  [BRICK_ROW_WINDOW]: brickRowWindow,
  [MAIN_STREET_ROAD]: mainStreetRoad,
  [MAIN_STREET_PAVING]: mainStreetPaving,
  [MAINTENANCE_MAN]: maintenanceMan,
  [BOARDING_HOUSE]: boardingHouse,
  [MAIN_STREET_BOUNDARY_GATE]: mainStreetBoundaryGate,
} satisfies Record<string, ObjectDefSlice>;

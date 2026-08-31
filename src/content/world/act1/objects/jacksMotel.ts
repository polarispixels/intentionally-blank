// The Arrowhead Motel — the room's six objects
// (`docs/superpowers/specs/2026-09-05-act1-wave4-prose.md` §4), plus two
// sub-parts the same "which noun word resolved" gap `ids.ts`'s own header
// explains (`FEDORA_BAND`/`DOOR_BOLT`/etc.) requires — see that file's own
// comment on `MONSTER_TRUCK_CAB`/`POLAROID_BACK` — plus the always-closed
// "every other direction" gate (same idiom as `TOWN_EDGE_NO_EXIT_GATE`/
// `SHERIFF_OFFICE_NO_EXIT_GATE`: no `nouns`, never resolvable, never
// described).
//
// §4.4 ships exactly as written (main-session decision, this task's own
// brief): the odd key's purpose is left unstated, and §13's quarantined
// "brass tag with three letters" alternative is NOT wired.
//
// KNOWN WIRING ITEMS (§14, this task's own brief — resolved here, reported
// in full in this task's report):
//
// 1. `door` collides: `motel_unit` owns bare "door" (plus "screen door",
//    "number", "four"); `monster_truck` owns "cab"/"glass"/"windscreen"/
//    "windshield"/"window" (moved to its own sub-part, `MONSTER_TRUCK_CAB`,
//    below) and does NOT own bare "door" in the doc's own §4.1 noun list.
//    A builder addition puts bare "door" AND adjective `truck` on the
//    truck's own parent object too, so "TRUCK DOOR" (adjective + noun) gets
//    a full-adjective match onto the truck alone (`resolver.ts`'s ranking:
//    a full match replaces the whole candidate pool). Bare "door" — no
//    adjective supplied — genuinely CLARIFIES between `motel_unit` and
//    `monster_truck` (`resolver.ts`'s `resolveNounPhrase` has exactly two
//    disambiguation mechanisms, adjective-full-match and the held tie-break
//    — neither auto-prefers one *unheld, unqualified* candidate over
//    another; confirmed by reading the function directly), the same shape
//    as Town Edge's own bare "sign" clarify between `billboard_close` and
//    `town_sign`. This is NOT "bare door resolves to the unit" with zero
//    ambiguity, as this task's brief's shorthand put it — see this task's
//    report for the full account and for why no other resolver mechanism
//    could make it so.
//
// 2. `key`/`keys` collides with the front desk's carried `room_key`
//    (`objects/frontDesk.ts`), which the doc's own §4.4 noun list for this
//    object also wants ("keys, key, keyring, ..."). `room_key`'s own noun
//    list is `['key', 'my key', 'room key', 'spare', 'spare key', 'fob']`
//    — bare "key", "spare" and "fob" are ALL already claimed there. Given
//    the resolver's v0.7.0 held tie-break (`resolver.ts`'s own header:
//    "after adjectives have done their work, a pool that still holds more
//    than one candidate is narrowed to the ones the player is carrying"),
//    any of those three bare words, while the room key is carried, resolve
//    straight to the carried key — the keyring never even enters the
//    ambiguity, since the pool narrows to held members before anything is
//    reported ambiguous. This object's own noun list below still includes
//    the doc's full set (transcribed verbatim); "keys" (plural — NOT one of
//    `room_key`'s own words) is therefore the one bare form that reaches
//    this object unambiguously while the room key is carried. See this
//    task's report for the exact resolutions tested.
//
// 3. `chair` — `motel_unit`'s own §4.2 noun list already includes it (no
//    separate object needed; the room has one, and the doc gives it no
//    text of its own beyond what `motel_unit`'s EXAMINE and the Catan
//    box's own OPEN handler already say about it).
//
// 4. "ask for keys"/"borrow keys" (§4.4) reuse existing global verbs
//    rather than new ones: "ask for" is already `V_ORDER`'s own word
//    (wired for the Sundown Diner, wave 3); "borrow" is added as a general
//    TAKE synonym (`verbs.ts`), matching the established "extend an
//    existing verb's synonym list" idiom (e.g. Main Street's own
//    "untie"/"mount"/"buy" added to TAKE).

import type { Effect } from '../../../../engine/effects';
import type { ProseRule } from '../../../../engine/prose';
import type { ObjectDefSlice } from '../../../../engine/world';
import { DIRECTION_VERB_IDS } from '../../../../engine/move';
import { CLIMB, EXAMINE, OPEN, READ, SEARCH, TAKE } from '../verbs';
import {
  CATAN_BOX,
  CLUE_LETTERS_ANSWERED,
  CLUE_ODD_KEY,
  CLUE_POLAROID_FLARE,
  FLAG_JACK_GAVE_KEYS,
  FLAG_NOTICED_ODD_KEY,
  FLAG_OFFERED_THE_RIDE,
  FLAG_READ_JACK_LETTERS,
  JACK_LETTERS,
  JACKS_MOTEL,
  JACKS_MOTEL_NO_EXIT_GATE,
  KEYRING,
  MONSTER_TRUCK,
  MONSTER_TRUCK_CAB,
  MOTEL_UNIT,
  POLAROID,
  POLAROID_BACK,
  V_DRIVE,
  V_KNOCK,
  V_ORDER,
  V_PLAY,
  V_TURN_OVER,
} from '../ids';
import { ACT2_TRAVEL_SCRIPT, ACT2_WALL_DRUG_EMPORIUM } from '../../act2/ids';
// D3, task A — the truck's return leg from the perimeter (§3.2). Same idiom
// as the Wall Drug return leg just below: `{ at: ... }`, checked by the
// player's own location, since the truck object itself carries no stable
// "home" a `when` could read.
import { ACT3_PERIMETER_ROAD } from '../../act3/ids';

// ---------------------------------------------------------------------------
// §4.1 — The truck
// ---------------------------------------------------------------------------

const truckExamine =
  "Somebody took a chassis, put four feet of air under it, hung four tyres on it that would each fill a doorway, and then — because none of that was the point — painted the whole thing by hand and has kept it that way ever since.\n\nIt is backed into four spaces, and there is a welded step under the door because there is otherwise no getting in.\n\nOn the driver's door, in white, a foot high:\n\n    THE BANK\n\nThe paint of the lettering is newer than the paint around it. It has been done twice.";

const cabText =
  'Off the step you can get your eyes to the glass. A bench seat, a cup in the holder with an inch of something cold in it, a rag folded square on the dash.\n\nIt is the tidiest interior of anything you have been inside tonight.';

const truckDoorLockedText =
  'The door is locked, the keys are in the pocket of a man four feet away, and it would take you two attempts to get up there anyway.\n\n"Where," says Jack, "and I\'ll take you." He means it, and he means now, and you have nowhere yet to tell him.';

const truckDoorLockedEffects: Effect[] = [{ say: truckDoorLockedText }];

// ---------------------------------------------------------------------------
// D1 amendment (Stage D1 prose doc §3, §19) — two handlers **prepended**
// above the shipped locked-door handler below: the return trip (the truck
// is now wherever the travel script last parked it — checked by the
// player's own location, `{ at: ACT2_WALL_DRUG_EMPORIUM }`, since the truck
// object itself has no stable "home" `when` could read) and the first/
// repeat outbound ride, gated on `act1_jack_ready_to_drive` — the real flag
// of that name shipped as `FLAG_OFFERED_THE_RIDE` (`ids.ts`; the plan's own
// expected-name caveat, §0.1). Text transcribed verbatim (hard rule 5).
// ---------------------------------------------------------------------------

const driveTruckEntryText =
  'He is in it before you are. The engine comes up out of that lot like\nsomething being woken on purpose, and takes the quiet with it.';

const returnTripEffects: Effect[] = [{ script: { id: ACT2_TRAVEL_SCRIPT, args: { mode: 'truck', to: 'town' } } }];
/** D3, task A — the perimeter's own return leg (§3.2), a distinct `args` shape (`from`, not `to`) from the Wall Drug return above — see `act2/travel.ts`'s own header note on why. */
const perimeterReturnTripEffects: Effect[] = [{ script: { id: ACT2_TRAVEL_SCRIPT, args: { mode: 'truck', from: 'perimeter' } } }];
const outboundRideEffects: Effect[] = [{ say: driveTruckEntryText }, { script: { id: ACT2_TRAVEL_SCRIPT, args: { mode: 'truck', to: 'wall_drug' } } }];

const monsterTruck: ObjectDefSlice = {
  location: JACKS_MOTEL,
  name: 'truck',
  portable: false,
  // "cab"/"glass"/"windscreen"/"windshield"/"window" move to the sub-part
  // below (this file's own header note 1's neighbour — the same "which
  // noun word resolved" gap). "door" + `adjectives: ['truck']` are a
  // builder addition (header note 1) so "TRUCK DOOR" reaches this object.
  // "letters" is dropped from the doc's own §4.1 noun list (a builder
  // deviation, not silently absorbed): this room's `jack_letters` object
  // (§4.5) also declares bare "letters" as ITS primary noun, and with both
  // in scope "EXAMINE LETTERS"/"READ LETTERS" — this room's central
  // clue-delivery command (`clue_letters_answered`) — genuinely clarified
  // against the truck's own painted lettering instead of resolving
  // cleanly. "lettering" (this object's other doc-given word for the same
  // thing) is kept, so nothing the doc named is actually lost.
  nouns: [
    'truck',
    'pickup',
    'monster truck',
    'vehicle',
    'tyres',
    'tires',
    'tyre',
    'tire',
    'wheels',
    'wheel',
    'axle',
    'bed',
    'hood',
    'bonnet',
    'engine',
    'motor',
    'paint',
    'lettering',
    'name',
    'bank',
    'chassis',
    'suspension',
    'step',
    'door',
  ],
  adjectives: ['truck'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: truckExamine }] },
    // "climb truck" (§4.1) shares the cab sub-part's own text.
    { verbs: [CLIMB], effects: [{ say: cabText }] },
    // D1 amendment — prepended above the shipped locked-door handler
    // (§19's own instruction): the return trip first (more specific — the
    // player is standing at the Emporium with the truck), then the
    // outbound ride once Jack has offered it.
    { verbs: [V_DRIVE, DIRECTION_VERB_IDS.in], when: { at: ACT3_PERIMETER_ROAD }, effects: perimeterReturnTripEffects },
    { verbs: [V_DRIVE, DIRECTION_VERB_IDS.in], when: { at: ACT2_WALL_DRUG_EMPORIUM }, effects: returnTripEffects },
    { verbs: [V_DRIVE, DIRECTION_VERB_IDS.in], when: { flag: FLAG_OFFERED_THE_RIDE }, effects: outboundRideEffects },
    // "drive truck"/"start truck"/"get in truck"/"take truck"/"open door"
    // (or "open truck door") (§4.1) all share the locked-door text.
    { verbs: [V_DRIVE, DIRECTION_VERB_IDS.in, TAKE, OPEN], effects: truckDoorLockedEffects },
  ],
};

const monsterTruckCab: ObjectDefSlice = {
  location: { on: MONSTER_TRUCK },
  name: 'cab',
  portable: false,
  nouns: ['cab', 'windscreen', 'windshield', 'glass'], // 'window' dropped v0.11.0: the truck travels, and at Wall Drug it shadowed the claim window
  // "look in cab"/"examine cab"/"look through window" (§4.1) share the
  // truck's own parent CLIMB text.
  handlers: [{ verbs: [EXAMINE, SEARCH], effects: [{ say: cabText }] }],
};

// ---------------------------------------------------------------------------
// §4.2 — The unit
// ---------------------------------------------------------------------------

const unitExamine =
  "Eight doors, painted the same brown, each with a number screwed to it at eye height. Seven have their curtains shut and their chairs stacked against the wall. Number four's chair is not stacked, and the ring of grey on the concrete under it says it has not been in a while.\n\nThe office at the end has its blind down and a card in the glass with an after-hours number on it. Nobody has needed it. Out at the road the VACANCY box has a switch of its own, and it has gone the colour things go when they are never switched off.";

const unitInteriorText =
  'The screen door has a spring that has never been adjusted and a hand-shaped patch worn into the mesh at hand height.\n\nInside: two beds, one made and one being used as a desk, a table under the window, a television on with the sound off, and five weeks of a man living somewhere he did not intend to live.';

const motelUnit: ObjectDefSlice = {
  location: JACKS_MOTEL,
  name: 'unit',
  portable: false,
  // Bare "door" here genuinely clarifies against `monster_truck`'s own
  // (builder-added) noun "door" — see this file's own header, item 1.
  // `adjectives: ['screen']` is a builder addition so "KNOCK ON SCREEN
  // DOOR"/"OPEN SCREEN DOOR" (a two-word phrase; the grammar resolves on
  // the phrase's LAST word, "door") gets a full adjective match onto this
  // object specifically, rather than falling into the same bare-"door"
  // clarify as plain "OPEN DOOR".
  adjectives: ['screen'],
  // "table" added (wave 5, §8.1's ruling: "Jack's motel table" needs a
  // `table` noun in scope for the table-in-scope check `objects/
  // closeOut.ts` exports — see that file's own header). No object in this
  // room named the table under the window until now; it joins the unit's
  // own broad noun list rather than becoming its own sub-part, since no
  // response text is authored about the table specifically (`unitInteriorText`
  // already mentions it in passing).
  nouns: [
    'door',
    'screen door',
    'unit',
    'number',
    'four',
    'room',
    'motel',
    'table',
    'sign',
    'arrowhead',
    'vacancy',
    'office',
    'doors',
    'units',
    'walkway',
    'lot',
    'asphalt',
    'parking',
    'chair',
    'blind',
    'ice machine',
  ],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: unitExamine }] },
    // "go inside"/"enter room"/"knock"/"open screen door" (§4.2). Two of
    // the doc's own four phrasings do NOT reach this handler, both
    // reported: bare "go inside" is swallowed by this room's own `in`
    // exit (`jacksMotel.ts`'s own comment on that exit — the exit's bare
    // dispatch runs before any dobj-less action ever reaches an object
    // handler); bare "knock" is NOT wired — `V_KNOCK`'s own pattern is
    // `V dobj` only (a global verb shared by every room; widening it to a
    // bare `V` pattern would also change what bare KNOCK does everywhere
    // else, out of this task's module). "enter room" and "open screen
    // door"/"knock on screen door" (both dobj-qualified) all still work.
    { verbs: [DIRECTION_VERB_IDS.in, OPEN, V_KNOCK], effects: [{ say: unitInteriorText }] },
  ],
};

// ---------------------------------------------------------------------------
// §4.3 — The Polaroid
// ---------------------------------------------------------------------------

const polaroidExamine =
  'A Polaroid on the table, square, the white border gone yellow at the edges the way they go.\n\nA porch step in summer. An old man on the top of it with his hands on his knees and his mouth open mid-sentence. Behind him a young man with his chin resting on the old man\'s head. On the step below, a girl with her boots off and her heels in the grass. Two more at the right-hand edge, one laughing and one determinedly not.\n\nThe left-hand third of the picture is gone. Not torn — flared: a white bloom where light got at the film before it was through, eating in from the corner.\n\nAn arm comes out of the white and lies across the shoulders of the young man with his chin on the old man\'s head. At the end of it there is a hand, and on the wrist a watch with a square face.';

const polaroidExamineEffects: Effect[] = [{ say: polaroidExamine }, { grantClue: CLUE_POLAROID_FLARE }];

const polaroidBackText =
  'Jack watches you pick it up and says nothing about your picking it up.\n\nThe back is blank except for a thumbprint at one corner, put into the emulsion while it was still developing by somebody who could not wait.';

const polaroidBackEffects: Effect[] = [{ say: polaroidBackText }];

const polaroid: ObjectDefSlice = {
  location: JACKS_MOTEL,
  name: 'polaroid',
  // §14's own wiring summary: TAKE is a response in prose, never an actual
  // pickup — portable stays false and never enters inventory.
  portable: false,
  nouns: ['polaroid', 'photo', 'photograph', 'picture', 'snapshot', 'print', 'photos', 'flare', 'light damage', 'damage', 'family', 'porch'],
  handlers: [
    { verbs: [EXAMINE], effects: polaroidExamineEffects },
    // "take polaroid"/"turn over polaroid"/"look at back" (§4.3) share one response.
    { verbs: [TAKE, V_TURN_OVER], effects: polaroidBackEffects },
  ],
};

// "back" is a builder addition (not in the doc's own §4.3 noun-list
// header) — the handler section's own "look at back" phrasing needs a
// noun to resolve against, and this room has no other claimant of "back"
// (same reasoning as `ids.ts`'s own header on similar sub-part additions
// elsewhere, e.g. Town Edge's `overland`).
const polaroidBack: ObjectDefSlice = {
  location: { on: POLAROID },
  name: 'back',
  portable: false,
  nouns: ['back'],
  handlers: [{ verbs: [EXAMINE], effects: polaroidBackEffects }],
};

// ---------------------------------------------------------------------------
// §4.4 — Jules's keyring
// ---------------------------------------------------------------------------

const keyringExamine =
  "Hanging on a nail by the door, on a split ring, a set of somebody else's keys.\n\nA truck key with the rubber head split. Two house keys cut at different times. A padlock key with a paper tag on it saying SHED, in a hand that is not Jack's.\n\nAnd one more, riding at the back of the ring, that is not shaped like any of them: short, flat, brass, with a number stamped into the bow and a squared bit that has never been near a house door in its life.";

/**
 * Wave 5, §9.2 — wave 4 §13's quarantined brass-tag paragraph, placed. The
 * three letters it names are never printed anywhere in this game (hard
 * rule 5's own discipline, plus this task's source doc's own repeated
 * instruction) — see §9.3's box-141 handler (`objects/postOffice.ts`) for
 * where they matter and are still never spelled out.
 */
const keyringTagParagraph =
  'And, riding at the back of the ring where a fob goes, a flat brass tag worn almost smooth. Three letters have been scratched into one face of it, by hand, hard, by somebody who did not want to be relying on remembering them.';

// Main-session edit at the Act I playthrough: in the player's hand the ring is not hanging on a nail — the opening clause is dropped, nothing added (wave 5 §9.2 says "same text"; a trim, not new prose).
const keyringExamineWithTag = `${keyringExamine.replace(/^Hanging on a nail by the door, on a split ring/, 'On a split ring')}\n\n${keyringTagParagraph}`;

/** Rule 2 is `keyringExamine`, byte for byte, unchanged (§9.2's own instruction). */
const keyringExamineText: ProseRule[] = [
  { when: { has: KEYRING }, text: keyringExamineWithTag },
  { text: keyringExamine },
];

const keyringExamineEffects: Effect[] = [{ say: keyringExamineText }, { grantClue: CLUE_ODD_KEY }, { set: [FLAG_NOTICED_ODD_KEY, true] }];

const keyringTakeText =
  '"Leave those," Jack says, and there is nothing sharp in it. "They\'re his."\n\nHe puts a hand up and does not do anything with it. "He left his spares with me when he took the place on the county road. You give your brother your spares and then he\'s got a reason to come round."';

const keyring: ObjectDefSlice = {
  // Wave 5, §9.1's ruling: `portable: true` now (was trust-gated-not-
  // locked, §14's old wiring summary) — the gate moves onto the TAKE
  // handler's own `when` below. While `FLAG_JACK_GAVE_KEYS` is false the
  // handler matches and the shipped refusal renders, same as before; once
  // Jack hands them over the handler's `when` fails, `findHandler`
  // (`engine/actions.ts`) finds no other TAKE handler on this object, and
  // the built-in TAKE runs for real (`portable: true` lets it succeed) —
  // see this task's report for why this reads `HandlerDef.when`/
  // `findHandler` correctly rather than needing a `Cond`-typed `portable`.
  location: JACKS_MOTEL,
  name: 'keyring',
  portable: true,
  // "hook" removed (Stage F sweep) — this portable object travels with the
  // player into every room, and Act III's Maintenance Bay has a real badge
  // hook rail whose own noun list also claims bare "hook"; the keyring's own
  // EXAMINE text only ever says "nail" (already its own noun), so nothing
  // player-visible depended on "hook" resolving here, and the Bay's rail now
  // wins that word in its own room.
  nouns: ['keys', 'key', 'keyring', 'key ring', 'ring', 'keychain', 'fob', 'spare', 'spares', 'nail', 'shed', 'brass tag'],
  handlers: [
    { verbs: [EXAMINE], effects: keyringExamineEffects },
    // "take keys"/"ask for keys"/"borrow keys" (§4.4) share one refusal —
    // gated (wave 5, §9.1) so it stops matching once Jack has handed them
    // over.
    { verbs: [TAKE, V_ORDER], when: { not: { flag: FLAG_JACK_GAVE_KEYS } }, effects: [{ say: keyringTakeText }] },
  ],
};

// ---------------------------------------------------------------------------
// §4.5 — The letters
// ---------------------------------------------------------------------------

const lettersExamine =
  'On the bed that is being used as a desk, a card folder of printed sheets, done at home on a printer running low. Half are his, sent. Half are what came back.';

const lettersReadText =
  'Jack\'s are long, badly spelled, and ask the same question six different ways.\n\nThe replies are short. They are warm and fluent and they arrive at the end of themselves without having gone anywhere:\n\n    Jack - good to hear from you, brother. Things are relentless here\n    but it\'s good work and I\'m well. Give my love to everyone out\n    there. We\'ll find a weekend. L.\n\nThe greeting changes each time. The rest of it does not change much.\n\n"He signs off L," Jack says, behind you. "Forty-odd years and he has never signed off L in his life."';

const lettersReadEffects: Effect[] = [{ say: lettersReadText }, { grantClue: CLUE_LETTERS_ANSWERED }, { set: [FLAG_READ_JACK_LETTERS, true] }];

const jackLetters: ObjectDefSlice = {
  location: JACKS_MOTEL,
  name: 'letters',
  portable: false,
  nouns: ['letters', 'letter', 'mail', 'printout', 'printouts', 'paper', 'papers', 'pages', 'sheets', 'bundle', 'stack', 'folder', 'replies', 'reply', 'correspondence', 'luke'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: lettersExamine }] },
    // "read letters"/"read replies" (§4.5).
    { verbs: [READ], effects: lettersReadEffects },
  ],
};

// ---------------------------------------------------------------------------
// §4.6 — The travel Catan box
// ---------------------------------------------------------------------------

const catanExamine =
  'A travel edition of a board game — magnetic pieces, a board that folds in four — in a box that has been carried around in a truck for a long time. One corner is taped, and the rubber band round it has gone hard and flat where it sits.\n\nInside the lid, in marker, in block capitals, in a hand that is not Jack\'s:\n\n    HOUSE RULES\n    1. THE BANK IS NOT A CHARITY\n    2. I AM THE BANK\n\nOne of the little wooden roads went missing and was replaced with one somebody whittled, which does not match and never will.';

const catanPlayText = '"Not tonight," Jack says, and moves it off the chair so you can sit down.';

const catanBox: ObjectDefSlice = {
  location: JACKS_MOTEL,
  name: 'Catan box',
  portable: false,
  nouns: ['catan', 'box', 'game', 'board game', 'board', 'travel set', 'set', 'lid', 'tiles', 'pieces', 'hexes', 'cards', 'band', 'rubber band'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: catanExamine }] },
    // "open box"/"play catan"/"play game" (§4.6).
    { verbs: [OPEN, V_PLAY], effects: [{ say: catanPlayText }] },
  ],
};

// §5's "every other direction" gate.
const jacksMotelNoExitGate: ObjectDefSlice = { location: JACKS_MOTEL };

export const JACKS_MOTEL_OBJECTS: Record<string, ObjectDefSlice> = {
  [MONSTER_TRUCK]: monsterTruck,
  [MONSTER_TRUCK_CAB]: monsterTruckCab,
  [MOTEL_UNIT]: motelUnit,
  [POLAROID]: polaroid,
  [POLAROID_BACK]: polaroidBack,
  [KEYRING]: keyring,
  [JACK_LETTERS]: jackLetters,
  [CATAN_BOX]: catanBox,
  [JACKS_MOTEL_NO_EXIT_GATE]: jacksMotelNoExitGate,
} satisfies Record<string, ObjectDefSlice>;

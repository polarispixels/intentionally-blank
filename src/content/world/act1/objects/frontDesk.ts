// Front Desk & Lobby — the room's 7 objects
// (`docs/superpowers/specs/2026-09-01-front-desk-prose.md` §4), plus the
// sub-parts the "which noun word resolved" gap requires (same reasoning as
// `objects/fedora.ts`'s `FEDORA_BAND`/`objects/door.ts`'s `DOOR_BOLT`): the
// front desk counter's own noun list (§4.1) names bell/telephone/coffee pot
// as nouns of ONE object, but EXAMINE/RING/CALL/POUR each need distinct text
// per noun word, which a single `HandlerDef` cannot distinguish — so `bell`,
// `telephone`/`phone`, and `pot`/`coffee pot`/`coffee` are split out here
// into their own `ObjectId`s, same as the guest register's own torn page
// (§4.2). See this task's report.
//
// Two cuts per this task's brief (density budget, §12 of the doc): dropped
// entirely, not transcribed — `topic_marlow` and the `SHOW <any>` fallback
// (both `marlow.ts`'s), and the `room_key` object (below, at §8) is kept
// (the brief's cut list flagged it as cuttable but this task's own
// instructions say to keep it — see world.ts's wiring).

import type { Cond } from '../../../../engine/cond';
import type { Effect } from '../../../../engine/effects';
import type { ObjectDefSlice } from '../../../../engine/world';
import type { ProseRule } from '../../../../engine/prose';
import { USE_VERB_ID } from '../../../../engine/move';
import {
  BREAK,
  checkDateText,
  coffeeText,
  CUT,
  EXAMINE,
  findNameText,
  LISTEN,
  LOOK_BEHIND,
  LOOK_UNDER,
  READ,
  ringBellText,
  RUB,
  SEARCH,
  signRegisterText,
  SIT,
  TAKE,
  telephoneText,
  TOUCH,
} from '../verbs';
import { V_DRINK, V_POUR, V_RING, V_SIGN, V_TILT, V_TURN_OVER } from '../ids';
import {
  CLUE_HOUSE_EMPTY,
  CLUE_PAGE_INDENTATION,
  CLUE_REGISTER_GAP,
  CLUE_REGISTER_IMPRESSION,
  FLAG_REGISTER_GAP_SEEN,
  FLAG_REGISTER_IMPRESSION_FOUND,
  FLAG_TOWEL_TAKEN,
  FRONT_DESK,
  FRONT_DESK_BELL,
  FRONT_DESK_COFFEE_POT,
  FRONT_DESK_COUNTER,
  FRONT_DESK_TELEPHONE,
  FRONT_DESK_TOWEL,
  GUEST_REGISTER,
  GUEST_REGISTER_PAGE,
  KEY_RACK,
  LOBBY_CHAIRS,
  LOBBY_RADIO,
  ROOM_KEY,
  STREET_DOOR,
  FRONT_DESK_STAIRS,
} from '../ids';

// ---------------------------------------------------------------------------
// 4.1 — Front desk counter
// ---------------------------------------------------------------------------

const counterExamine =
  'A varnished counter with a hinged flap at one end, and behind it the working half of the room: a stool, the key board, the pot on its ring, a telephone bolted through the wood. On the counter, a brass bell, an inkstand with one pen, and the register. The blotter under it is clean, and has been for a while.';

const lookBehindDesk =
  'Behind the counter, at the height a clerk’s feet live: a box of light bulbs, a pair of galoshes, and a wastebasket with one paper cup in it and nothing else.';

const frontDeskCounter: ObjectDefSlice = {
  location: FRONT_DESK,
  name: 'desk',
  nouns: ['desk', 'front desk', 'counter', 'flap', 'blotter', 'inkstand', 'stool'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: counterExamine }] },
    { verbs: [LOOK_BEHIND, LOOK_UNDER], effects: [{ say: lookBehindDesk }] },
  ],
};

const bell: ObjectDefSlice = {
  location: { on: FRONT_DESK_COUNTER },
  name: 'bell',
  nouns: ['bell'],
  handlers: [
    // "hit bell" reuses the existing global BREAK verb (its own word "hit") — see verbs.ts's header.
    { verbs: [V_RING, BREAK], effects: [{ say: ringBellText }] },
  ],
};

const telephone: ObjectDefSlice = {
  location: { on: FRONT_DESK_COUNTER },
  name: 'telephone',
  nouns: ['telephone', 'phone'],
  handlers: [{ verbs: [EXAMINE, USE_VERB_ID], effects: [{ say: telephoneText }] }],
};

const coffeePot: ObjectDefSlice = {
  location: { on: FRONT_DESK_COUNTER },
  name: 'coffee pot',
  nouns: ['pot', 'coffee pot', 'coffee'],
  handlers: [
    // TAKE overrides the built-in physical take entirely — pouring a cup, not carrying off the pot.
    { verbs: [TAKE, V_POUR, V_DRINK], effects: [{ say: coffeeText }] },
  ],
};

const towelText = 'He hands it over, cold and heavier than a towel, and goes back to the stool.\n\nIt helps more than it has any business helping.';

const towel: ObjectDefSlice = {
  location: { on: FRONT_DESK_COUNTER },
  name: 'towel',
  nouns: ['towel'],
  portable: true,
  handlers: [
    {
      verbs: [TAKE, USE_VERB_ID],
      effects: [{ say: towelText }, { set: [FLAG_TOWEL_TAKEN, true] }, { move: [FRONT_DESK_TOWEL, 'inventory'] }],
    },
  ],
};

// ---------------------------------------------------------------------------
// 4.2 — Guest register (the room's puzzle) and its torn page
// ---------------------------------------------------------------------------

const registerGapExamine =
  'A tall ruled book, open two-thirds of the way through. Four columns: name, room, in, out. The entries run back weeks in one hand — one man writing down other people’s business in pencil, neatly.\n\nBetween the open page and the next there is a stub. A page has been torn out along the gutter, clean at one end and ragged at the other, the way paper goes when it is pulled rather than cut. The edges of the tear are still bright.\n\nThe page underneath where it was is blank.';

const registerGapEffects: Effect[] = [{ say: registerGapExamine }, { set: [FLAG_REGISTER_GAP_SEEN, true] }, { grantClue: CLUE_REGISTER_GAP }];
const findNameEffects: Effect[] = [{ say: findNameText }, { set: [FLAG_REGISTER_GAP_SEEN, true] }, { grantClue: CLUE_REGISTER_GAP }];

const takeRegisterText = "Marlow's hand arrives on the book at the same time as yours. He does not grip it and he does not say anything. He just has a hand on his book.";
const tearRegisterText = 'Somebody has already had that idea about this book, and you are standing four feet from him.';

/** The builder note (§4.2): if the page-indentation clue is already raised upstairs, the raking-light clause callbacks to it. `Cond` shorthand is cheap here, so both variants are wired rather than shipping only the unconditional one. */
const IMPRESSION_CALLBACK_COND: Cond = { clue: CLUE_PAGE_INDENTATION };

const impressionBody =
  'the blank sheet stops being blank. Under a fingertip the surface is not smooth: it is crossed with faint valleys where a pen pressed through from the sheet that used to lie on top of it.\n\nThree lines of writing, and two of the three are too soft to take.\n\nThe third is not. A time, in the small hours. A room number, which is yours; you came down its stairs. And in the name column, no name — one short stroke of a pen, begun and set down, and nothing after it.';

const impressionText: ProseRule[] = [
  {
    when: IMPRESSION_CALLBACK_COND,
    text: `You turn the book until the desk lamp comes across it flat — the same thing you did to a page in a fallen lamp upstairs — and ${impressionBody}`,
  },
  { text: `You turn the book until the desk lamp comes across it flat, and ${impressionBody}` },
];

const impressionGrantEffects: Effect[] = [{ set: [FLAG_REGISTER_IMPRESSION_FOUND, true] }, { grantClue: CLUE_REGISTER_IMPRESSION }];
const impressionEffects: Effect[] = [{ say: impressionText }, ...impressionGrantEffects];

const register: ObjectDefSlice = {
  location: FRONT_DESK,
  name: 'register',
  nouns: ['register', 'book', 'guest book', 'guestbook', 'ledger'],
  handlers: [
    { verbs: [EXAMINE], effects: registerGapEffects },
    { verbs: [SEARCH, READ], effects: findNameEffects },
    { verbs: [TAKE], effects: [{ say: takeRegisterText }] },
    { verbs: [V_SIGN], effects: [{ say: signRegisterText }] },
    { verbs: [CUT, BREAK], effects: [{ say: tearRegisterText }] },
    // TILT reaches the same impression the page's own sub-part answers, from the whole book.
    { verbs: [V_TILT], effects: impressionEffects },
  ],
};

const registerPage: ObjectDefSlice = {
  location: { on: GUEST_REGISTER },
  name: 'page',
  nouns: ['page', 'pages', 'sheet', 'stub', 'gap', 'tear', 'entries', 'columns', 'blank page', 'impression'],
  handlers: [
    { verbs: [EXAMINE, READ, V_TILT, RUB, TOUCH, SEARCH], effects: impressionEffects },
    { verbs: [TAKE], effects: [{ say: takeRegisterText }] },
    { verbs: [CUT, BREAK], effects: [{ say: tearRegisterText }] },
  ],
};

// ---------------------------------------------------------------------------
// 4.3 — Key board
// ---------------------------------------------------------------------------

const keyRackExamine =
  'A board of numbered hooks behind the desk. Most of them have a key hanging on them, and a key on a hook is a room with nobody in it. There are more of those than there are of the other kind.\n\nThe hook with your number on it holds one key. A board like this holds two per room. The other was in your pocket, in the same way everything else was.';

const takeKeyText = "The board is behind the desk and behind the desk is Marlow's half of the room. Ask him for it.";

const keyRack: ObjectDefSlice = {
  location: FRONT_DESK,
  name: 'key rack',
  // "key" is deliberately NOT one of this object's nouns (bug fix, Ryan's
  // playtest): the actual room key (`roomKey`, below) also answers to bare
  // "key" once it's in scope, and two objects sharing an undistinguishable
  // bare noun made `TAKE KEY` an unwinnable disambiguation loop. "keys"
  // (plural — the rack full of them) stays; it's a different word.
  nouns: ['rack', 'key rack', 'board', 'key board', 'hooks', 'hook', 'keys', 'pigeonholes', 'numbers'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: keyRackExamine }, { grantClue: CLUE_HOUSE_EMPTY }] },
    { verbs: [TAKE], effects: [{ say: takeKeyText }] },
  ],
};

// ---------------------------------------------------------------------------
// 4.4 — Radio
// ---------------------------------------------------------------------------

const radioExamine = 'A brown bakelite set on a shelf under the counter, turned down to where it is company rather than information.';
const radioListen = 'Strings, then a piano, then more strings. Between them there is a gap of about the length a station identification takes, and then more strings.';

const lobbyRadio: ObjectDefSlice = {
  location: FRONT_DESK,
  name: 'radio',
  nouns: ['radio', 'set', 'wireless', 'music', 'station', 'speaker'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: radioExamine }] },
    { verbs: [LISTEN], effects: [{ say: radioListen }] },
  ],
};

// ---------------------------------------------------------------------------
// 4.5 — Chairs and table
// ---------------------------------------------------------------------------

const chairsExamine =
  'Ten or eleven chairs of four vintages around a low table, all turned slightly inward, as though a conversation were expected and had been for some time. The magazine on top of the pile has been on top long enough for the lamp to take the colour out of half its cover.';

const sitText = 'You sit. It is the first thing you have done tonight that does not hurt, and you get up again after about a minute on the grounds that the alternative is not getting up.';

const magazinesText = 'Farm equipment, a hunting quarterly, something with a recipe on the cover. None has a date on the part you can see, and you find you do not turn any of them over to look.';

const lobbyChairs: ObjectDefSlice = {
  location: FRONT_DESK,
  name: 'chairs',
  nouns: ['chairs', 'chair', 'seats', 'seat', 'armchair', 'lobby', 'furniture', 'table', 'magazines', 'magazine'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: chairsExamine }] },
    { verbs: [SIT], effects: [{ say: sitText }] },
    { verbs: [READ], effects: [{ say: magazinesText }] },
    { verbs: [V_TURN_OVER], effects: [{ say: checkDateText }] },
  ],
};

// ---------------------------------------------------------------------------
// 4.6 — Street door
// ---------------------------------------------------------------------------

const streetDoorExamine =
  'A heavy door with a glass panel and a roller blind pulled halfway down over it. Through what is left: brick, a strip of road, no movement in any of it. There is a spring bell over the frame and a boot scraper somebody bolted down when this was a busier house.';

const lookThroughDoor =
  'Brick across the road, unlit. Further along, something tied to a rail shifts its weight from one foot to the other and settles.\n\nNo lights in any window you can see, which at this hour is either ordinary or the town telling you something.';

const streetDoor: ObjectDefSlice = {
  location: FRONT_DESK,
  container: { open: false, locked: false },
  name: 'street door',
  // "bell" is dropped from this object's own noun list (see this task's
  // report) — front_desk_bell already claims "bell" for the counter's own
  // bell, and having both objects answer to the same noun would make "ring
  // bell" ambiguous in this room. Everything else transcribed as authored.
  //
  // Bug fix (Ryan's playtest): the multi-word entries 'street door'/'front
  // door' were unreachable by typing them — `grammar.ts`'s `toPhrase`
  // always takes the LAST word of a noun phrase as the head noun and
  // everything before it as adjectives, so "open street door" resolves as
  // noun "door" + adjective "street," never as the two-word string "street
  // door." Nothing else in this room claims bare "door" (verified against
  // every other Front Desk object's own `nouns`), so it's added here as
  // its own noun, with "street"/"front"/"glass" as real `adjectives` (not
  // just noun-phrase substrings) so "street door"/"front door"/"glass
  // door" all resolve the same way "OPEN DOOR" now does.
  nouns: ['door', 'entrance', 'glass', 'panel', 'blind', 'mat', 'scraper', 'outside', 'street'],
  adjectives: ['street', 'front', 'glass'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: streetDoorExamine }] },
    { verbs: [SEARCH], effects: [{ say: lookThroughDoor }] },
  ],
};

// ---------------------------------------------------------------------------
// 4.7 — The stairs, from below
// ---------------------------------------------------------------------------

const stairsExamine =
  'The stairs go up out of the lamp’s reach after six treads, and the well from down here is a stack of rectangles with nothing in any of them. Under the bottom flight, a triangle of floor with a broom in it and room for a good deal more than a broom.';

const frontDeskStairs: ObjectDefSlice = {
  location: FRONT_DESK,
  name: 'stairs',
  // "under the stairs" dropped from the doc's own noun list (builder's word
  // choice, not doc text) — `validate.ts`'s noise-word rule rejects it
  // outright ("the" is stripped from any position before lookup, so the
  // phrase could never be typed back in and matched); "look under stairs"/
  // "search under stairs" already resolve via LOOK_UNDER/SEARCH + the plain
  // noun "stairs", so nothing is lost.
  nouns: ['stairs', 'stair', 'staircase', 'steps', 'stairway', 'flight', 'well'],
  handlers: [{ verbs: [EXAMINE, LOOK_UNDER, SEARCH], effects: [{ say: stairsExamine }] }],
};

// ---------------------------------------------------------------------------
// §8 — room_key. Granted by marlow.ts's topic_key.
// ---------------------------------------------------------------------------

const roomKey: ObjectDefSlice = {
  location: 'nowhere',
  name: 'room key',
  nouns: ['key', 'my key', 'room key', 'spare', 'spare key', 'fob'],
  portable: true,
  handlers: [
    {
      verbs: [EXAMINE],
      effects: [{ say: 'A brass key on a wooden fob with your room number burned into it. The fob is older than the key. One of them was replaced and the other was not.' }],
    },
  ],
};

export const FRONT_DESK_OBJECTS: Record<string, ObjectDefSlice> = {
  [FRONT_DESK_COUNTER]: frontDeskCounter,
  [FRONT_DESK_BELL]: bell,
  [FRONT_DESK_TELEPHONE]: telephone,
  [FRONT_DESK_COFFEE_POT]: coffeePot,
  [FRONT_DESK_TOWEL]: towel,
  [GUEST_REGISTER]: register,
  [GUEST_REGISTER_PAGE]: registerPage,
  [KEY_RACK]: keyRack,
  [LOBBY_RADIO]: lobbyRadio,
  [LOBBY_CHAIRS]: lobbyChairs,
  [STREET_DOOR]: streetDoor,
  [FRONT_DESK_STAIRS]: frontDeskStairs,
  [ROOM_KEY]: roomKey,
} satisfies Record<string, ObjectDefSlice>;

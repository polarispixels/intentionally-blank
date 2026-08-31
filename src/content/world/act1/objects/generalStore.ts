// The General Store — the room's six objects
// (`docs/superpowers/specs/2026-09-03-act1-wave2-prose.md` §9). Prose
// transcribed exactly (hard rule 5); the object/sub-part split and verb
// wiring are this builder's own calls (see `objects/postOffice.ts`'s own
// header for the established idiom this follows).

import type { Effect } from '../../../../engine/effects';
import type { ObjectDefSlice } from '../../../../engine/world';
import { DIRECTION_VERB_IDS } from '../../../../engine/move';
import { BREAK, EXAMINE, OPEN, PRY, READ, TAKE, TURN } from '../verbs';
import {
  CLUE_FIVE_FACES,
  CROCK_CUP,
  FLAG_DRANK_WATER,
  FLAG_HAS_STRING,
  FLAG_READ_POSTCARDS,
  GENERAL_STORE,
  GENERAL_STORE_NO_EXIT_GATE,
  POSTCARD_PICTURE,
  POSTCARD_RACK,
  STORE_DOOR,
  STORE_RECESS,
  STORE_WINDOW,
  STRING_ITEM,
  TWINE,
  TWINE_SPOOL,
  V_DRINK,
  V_FILL,
  V_KNOCK,
  V_RING,
  V_TURN_OVER,
  WATER_CROCK,
} from '../ids';

// ---------------------------------------------------------------------------
// §9.1 — The postcard rack
// ---------------------------------------------------------------------------

const postcardExamine =
  'A wire spinner stands inside the left-hand window, turned so its face is to the street. The cards are in it thick, and because that is how a rack works, half of them are in backwards. What you get, mostly, is captions.\n\n    GREETINGS FROM THE BADLANDS\n    WALL DRUG - FREE ICE WATER\n    THE MISSOURI AT SUNSET\n    MOUNT RUSHMORE NATIONAL MEMORIAL - HOME OF THE FIVE FACES\n    JACKALOPE (LIVE)\n\nThe glass is cold and the rack is on the other side of it.';
const postcardExamineEffects: Effect[] = [{ say: postcardExamine }, { grantClue: CLUE_FIVE_FACES }, { set: [FLAG_READ_POSTCARDS, true] }];

const turnRackText = "You would have to be on the other side of the window to turn it. From here the Rushmore card gives you an eighth of an inch of its edge and the back of the one standing in front of it.";

const buyPostcardText = 'The shop is shut and the rack is inside the shop. You could come back when somebody is in it.';

const postcardRack: ObjectDefSlice = {
  location: GENERAL_STORE,
  name: 'postcard rack',
  portable: false,
  // "picture"/"photograph" moved to the sub-part below.
  nouns: ['postcard', 'postcards', 'card', 'cards', 'rack', 'spinner', 'stand', 'souvenir', 'souvenirs', 'rushmore', 'mount rushmore', 'jackalope'],
  handlers: [
    { verbs: [EXAMINE, READ], effects: postcardExamineEffects },
    { verbs: [TURN, V_TURN_OVER], effects: [{ say: turnRackText }] },

    { verbs: [TAKE], effects: [{ say: buyPostcardText }] },
  ],
};

const postcardPicture: ObjectDefSlice = {
  location: { on: POSTCARD_RACK },
  name: 'picture',
  portable: false,
  nouns: ['picture', 'photograph'],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: turnRackText }] }],
};

// ---------------------------------------------------------------------------
// §9.2 — The windows
// ---------------------------------------------------------------------------

const windowExamine =
  'Two windows, angled to face you, with a display along the bottom of each that somebody arranged with care a long time ago. Behind the display, the shop itself, under the one bulb over the counter.\n\nShelves to the ceiling on both sides. Tinned goods, sacks, a wall of small drawers with the contents written on the fronts in pen. A card of batteries by the till. A ladder on a rail. On the counter a spike of receipts, a spool of paper, and a jar of something with a lid on it.\n\nUnder the counter on the customer side, a drawer stands an inch open, full of the kind of thing that gets put in a drawer because it is not anything.';

const knockGlassText = 'You knock. The refrigerated cabinet stops, and then starts again, and that is the extent of the conversation.';

const breakWindowText =
  'You put a hand flat on it and think about it properly: the noise, a sheriff\'s office on the same street, and the fact that what you actually want out of this shop is a better look at a postcard.';

const storeWindow: ObjectDefSlice = {
  location: GENERAL_STORE,
  name: 'shop window',
  portable: false,
  nouns: ['window', 'windows', 'display', 'glass', 'shop', 'store', 'stock', 'shelf', 'shelves', 'counter', 'till', 'goods', 'tins', 'sacks', 'batteries', 'drawer', 'junk drawer', 'ladder'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: windowExamine }] },
    { verbs: [V_KNOCK], effects: [{ say: knockGlassText }] },
    { verbs: [BREAK, PRY], effects: [{ say: breakWindowText }] },
  ],
};

// ---------------------------------------------------------------------------
// §9.3 — The crock
// ---------------------------------------------------------------------------

const crockExamine =
  'Stoneware, glazed brown, on a wooden stand, with a brass spigot and a tin cup hung off it on a length of chain. The board over it has been repainted enough times that the letters stand up off the wood a little.\n\n    FREE ICE WATER\n\nThere is no second line.';

const drinkText =
  'The spigot gives without complaint. The water is cold the way water is cold that has spent a December night in stoneware, and it tastes of the crock and faintly of the cup, and you finish it and have another.\n\nSomebody fills this every day for people who are not in the shop.';
const drinkEffects: Effect[] = [{ say: drinkText }, { set: [FLAG_DRANK_WATER, true] }];

const takeCupText = 'The chain is long enough to drink with and about a foot short of anything else, which is what chains on cups are for.';

const waterCrock: ObjectDefSlice = {
  location: GENERAL_STORE,
  name: 'crock',
  portable: false,
  // "cup"/"tin cup" moved to the sub-part below.
  nouns: ['crock', 'jug', 'cooler', 'water', 'ice water', 'free ice water', 'drink', 'chain', 'spigot', 'tap', 'stand', 'board', 'sign'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: crockExamine }] },
    { verbs: [V_DRINK, V_FILL, TAKE], effects: drinkEffects },
  ],
};

const crockCup: ObjectDefSlice = {
  location: { on: WATER_CROCK },
  name: 'cup',
  portable: false,
  nouns: ['cup', 'tin cup'],
  handlers: [
    { verbs: [V_DRINK, V_FILL], effects: drinkEffects },
    { verbs: [TAKE], effects: [{ say: takeCupText }] },
  ],
};

// ---------------------------------------------------------------------------
// §9.4 — The twine
// ---------------------------------------------------------------------------

const twineExamine =
  'A spool of jute twine on an iron spike beside the crock, with a hooked blade set into the spike at cutting height and worn bright. The end hangs down about eight inches, which is where the last person left it.';

const takeStringText = 'You pull an arm\'s length off the spool and put it across the blade, and it parts the way a thing parts when the tool is right for it.\n\nYou now have a piece of string.';
const takeStringEffects: Effect[] = [{ say: takeStringText }, { set: [FLAG_HAS_STRING, true] }, { move: [STRING_ITEM, 'inventory'] }];

const takeSpoolText = 'The spike goes through the middle of it and into the wall behind. The store thought about this.';

const twine: ObjectDefSlice = {
  location: GENERAL_STORE,
  name: 'twine',
  portable: false,
  // "spool" moved to the sub-part below.
  nouns: ['twine', 'string', 'cord', 'ball', 'spike', 'blade', 'knife', 'cutter', 'hook'],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: twineExamine }] }, { verbs: [TAKE], effects: takeStringEffects }],
};

const twineSpool: ObjectDefSlice = {
  location: { on: TWINE },
  name: 'spool',
  portable: false,
  nouns: ['spool'],
  handlers: [{ verbs: [TAKE], effects: [{ say: takeSpoolText }] }],
};

const stringItem: ObjectDefSlice = {
  location: 'nowhere',
  name: 'string',
  portable: true,
  nouns: ['string', 'piece of string'],
  description: 'An arm\'s length of jute twine, cut clean at one end.',
};

// ---------------------------------------------------------------------------
// §9.5 — The shop door
// ---------------------------------------------------------------------------

const doorExamine =
  'Wood and glass, with a bell on a spring bracket on the inside of it. A card hangs against the glass on a rubber sucker, hand-lettered on both sides, with the side facing out reading CLOSED.\n\nAround it, taped to the inside so the tape does not spoil the paint: a card for a feed store, a card for somebody who will haul anything, a notice about a well-drilling rig, and a strip of paper reading NO CHECKS in a hand that had stopped negotiating.';

const doorLockedText = 'Locked in the honest way: a mortice that goes solid through the handle instead of rattling. You knock anyway. The bell over the door does not move, because the bell is on the inside.';

const storeDoor: ObjectDefSlice = {
  location: GENERAL_STORE,
  name: 'shop door',
  container: { open: false, locked: true },
  nouns: ['door', 'shop door', 'front door', 'inner door', 'handle', 'lock', 'glass', 'card', 'closed', 'sign', 'notices', 'bell'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: doorExamine }] },
    { verbs: [OPEN, V_KNOCK, DIRECTION_VERB_IDS.in, V_RING], effects: [{ say: doorLockedText }] },
  ],
};

// ---------------------------------------------------------------------------
// §9.6 — The recess
// ---------------------------------------------------------------------------

const recessExamine =
  'Tile underfoot, hexagons, with a boot scraper set into the step and a coir mat worn through in one place. Two wooden crates stand against the wall, empty and stacked, with a broom leaning on them.\n\nIt is out of the wind in here, which after the street counts for a good deal.';

const storeRecess: ObjectDefSlice = {
  location: GENERAL_STORE,
  name: 'recess',
  portable: false,
  nouns: ['recess', 'doorway', 'porch', 'vestibule', 'tile', 'tiles', 'floor', 'mat', 'scraper', 'boot scraper', 'step', 'crates', 'crate', 'broom'],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: recessExamine }] }],
};

// §10's always-closed "every other direction" gate — mirrors `MAIN_STREET_BOUNDARY_GATE`.
const generalStoreNoExitGate: ObjectDefSlice = { location: GENERAL_STORE };

export const GENERAL_STORE_OBJECTS: Record<string, ObjectDefSlice> = {
  [POSTCARD_RACK]: postcardRack,
  [POSTCARD_PICTURE]: postcardPicture,
  [STORE_WINDOW]: storeWindow,
  [WATER_CROCK]: waterCrock,
  [CROCK_CUP]: crockCup,
  [TWINE]: twine,
  [TWINE_SPOOL]: twineSpool,
  [STRING_ITEM]: stringItem,
  [STORE_DOOR]: storeDoor,
  [STORE_RECESS]: storeRecess,
  [GENERAL_STORE_NO_EXIT_GATE]: generalStoreNoExitGate,
} satisfies Record<string, ObjectDefSlice>;

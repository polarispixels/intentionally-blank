// The General Store — the room's six objects
// (`docs/superpowers/specs/2026-09-03-act1-wave2-prose.md` §9). Prose
// transcribed exactly (hard rule 5); the object/sub-part split and verb
// wiring are this builder's own calls (see `objects/postOffice.ts`'s own
// header for the established idiom this follows).

import type { Effect } from '../../../../engine/effects';
import type { EventDef, ObjectDefSlice } from '../../../../engine/world';
import type { Cond } from '../../../../engine/cond';
import { DIRECTION_VERB_IDS } from '../../../../engine/move';
import { BREAK, EXAMINE, OPEN, PRY, READ, SEARCH, TAKE, TURN } from '../verbs';
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
import { V_ASSEMBLE } from '../ids';
import { ACT2_ADAPTER_CHAIN, ACT2_ADAPTER_PARTS, ACT2_HONOR_BOX, ACT2_JUNK_DRAWER, ACT2_STARTED } from '../../act2/ids';

// ---------------------------------------------------------------------------
// §9.1 — The postcard rack
// ---------------------------------------------------------------------------

const postcardExamine =
  'A wire spinner stands inside the left-hand window, turned so its face is to the street. The cards are in it thick, and because that is how a rack works, half of them are in backwards. What you get, mostly, is captions.\n\n    GREETINGS FROM THE BADLANDS WALL DRUG - FREE ICE WATER THE MISSOURI AT SUNSET MOUNT RUSHMORE NATIONAL MEMORIAL - HOME OF THE FIVE FACES JACKALOPE (LIVE)\n\nThe glass is cold and the rack is on the other side of it.';
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

// ---------------------------------------------------------------------------
// D2 amendment (task A) — the shop by day (prose doc §4.2–§4.4; plan §2 D2
// row 3; this wave's own ruling 4).
//
// IDIOM CHOSEN FOR "REACHABLE ONLY FROM THE SHOP ROOM" (ruling 4's own
// question): no new room (main-session ruling — the shop interior is the
// SAME `GENERAL_STORE` room in a different state) and no `hidden`/`reveal`
// toggle either — `effects.ts`'s `Effect` union has `{ reveal: ObjectId }`
// (one-directional, `hidden: false` forever) but no matching "hide" effect,
// so `hidden` can be permanently UNSET but never re-SET, wrong for
// something that must go dark again every night. Instead: these three
// objects are placed `{ in: STORE_DOOR }` (the shipped shop door, already a
// `container`), and `STORE_DOOR`'s own `open` boolean — which nothing in
// its shipped EXAMINE/OPEN text ever exposes to the player; those handlers
// are untouched and still read "locked," a fiction gap flagged in this
// task's report — is toggled every turn by the two `once: false` events
// below. `open`/`transparent` is exactly the containment test `scope()`/
// `inScopeAt` already runs for every object in the game (`engine/world.ts`),
// so this reuses a mechanism instead of adding one: closed at night, these
// three are out of scope precisely like anything else inside a shut
// container, and `EXAMINE DRAWER` at 4 a.m. resolves solely to
// `storeWindow`'s own shipped "drawer"/"junk drawer" nouns (unchanged, this
// task's report) because `act2_junk_drawer` isn't a candidate at all.
//
// KNOWN GAP, stated rather than silently accepted: by day, `storeWindow`
// STILL claims "drawer"/"junk drawer" too (it is unconditionally in the
// room), so a bare `EXAMINE DRAWER` while the shop is open is genuinely
// ambiguous between the two objects — the parser's own disambiguation
// (`parser/resolver.ts`'s `'ambiguous'` outcome, a clarify prompt) handles
// it; the qualified `EXAMINE JUNK DRAWER` (an adjective+noun full match)
// reaches the interior drawer unambiguously either way. This is the same
// "recommend a `whichOne` clarify rather than a silent pick" idiom the
// prose doc's own §29.2 already accepts for the "chain"/"letter" collisions
// — not attempted to be engineered away here.
// ---------------------------------------------------------------------------

/** Exported for `act1/generalStore.ts`'s own description rule 0 and `PAY` handler, so the two files share one definition of "open." */
export const SHOP_OPEN: Cond = { all: [{ flag: ACT2_STARTED }, { any: [{ clockPhase: 'morning' }, { clockPhase: 'afternoon' }] }] };

const honorBoxExamine =
  'A cigar box, the lid held shut by a screw through the hinge side and a slot cut in the top with a knife by somebody who was not showing off. It does not rattle. It has weight.\n\nA card is propped against it in the same firm hand as everything else in this county that is not typed:\n\n    PLEASE LEAVE WHAT IT\'S WORTH. THE PENCIL IS FOR THE BOOK.\n\nThe book is a school exercise book, open, with a pencil on a string beside it. People have written down what they took. Nobody has written down what they paid.';

const honorBoxOpenText =
  'There is a shop with nobody in it, a box with money in it, and a screw you could get out with the flat of a key. You put the box back exactly where it was standing, which takes a moment, because you had already picked it up.';

/** §4.2's `PAY` — see `act1/generalStore.ts`'s own room-level handler (bare verb; no dobj exists to hang this on). */
export const HONOR_BOX_PAY_TEXT =
  'You take out what the parts are worth and post it through the slot, and it goes down onto the rest of it without much of a sound, so there is a good deal of the rest of it.\n\nThen you take the pencil on its string and write down what you took, in the column where everybody else has written down what they took, and the line above yours is somebody\'s tinned peaches.';

const honorBox: ObjectDefSlice = {
  location: { in: STORE_DOOR },
  name: 'honor box',
  nouns: ['box', 'honor box', 'cigar box', 'till', 'exercise book', 'pencil'],
  portable: false,
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: honorBoxExamine }] },
    { verbs: [OPEN, PRY], effects: [{ say: honorBoxOpenText }] },
  ],
};

const junkDrawerExamine =
  'Under the counter on the customer side, standing an inch open the way it was standing an inch open through the glass at four in the morning.\n\nIt is the drawer every shop has: the drawer for the thing that is not anything. Fuse wire. A bulldog clip with no jaw spring. Two keys on a loop of garden twine. A rubber stamp with the date wheels seized. Batteries of a size that stopped being a size.\n\nAnd, further back, where a drawer keeps what it has been keeping longest, three items that are all the same kind of item.';

const junkDrawer: ObjectDefSlice = {
  location: { in: STORE_DOOR },
  name: 'junk drawer',
  nouns: ['drawer', 'junk drawer'],
  // "junk" as a real adjective (not folded into the compound noun string
  // the way `storeWindow`'s own "junk drawer" entry is) — this is what
  // makes `EXAMINE JUNK DRAWER` a full adjective+noun match against THIS
  // object specifically (`parser/resolver.ts`'s own ranking rule), rather
  // than an ambiguous bare-noun pool of two. Bare `EXAMINE DRAWER` by day
  // stays genuinely ambiguous between the two — see this section's own
  // header note (§29.2's "recommend a whichOne clarify" idiom).
  adjectives: ['junk'],
  portable: false,
  handlers: [{ verbs: [EXAMINE, OPEN, SEARCH], effects: [{ say: junkDrawerExamine }] }],
};

const partsExamine =
  '    a gender changer, in chromed pot metal, with pins on both faces and a\n    thumbscrew missing from one side\n\n    a short ribbon lead with a keyed collar at one end and nothing keyed about the other\n\n    a converter in a die-cast box the size of a bar of soap, with a switch marked DCE / DTE and a label in typewriter capitals reading SERIAL\n\nEvery one of them was made to join a thing to a thing that neither of them was ever going to meet again. Nobody in this county has needed any of them since before the sign over the door was last painted.\n\nThey fit each other. You can see that they fit each other from here.';

const combineSuccessText =
  'The gender changer goes onto the converter. The ribbon lead goes onto the gender changer. Each join takes a shove and then goes home with the small satisfaction of a thing designed by somebody who expected to be shoved.\n\nWhat you are holding is about nine inches long, weighs more than the machine it is going to plug into deserves, and has one end shaped like this decade and one end shaped like an argument that decade lost.\n\nYou put it in your coat. There is now a chain of adapters in your coat, which is either going to work or is going to be a story.';

/** Transcribed for completeness (hard rule 5); unreachable in this build — `act2_adapter_parts` is one collectible bundle, never partially held, so `COMBINE`'s "not held yet" branch below always has all three or none. Flagged in this task's report. */
const combineMissingPartText = 'Two of the three will go together. Two of the three get you to a shape that is still not the shape you need.';

const combineEffects: Effect[] = [{ say: combineSuccessText }, { move: [ACT2_ADAPTER_PARTS, 'nowhere'] }, { move: [ACT2_ADAPTER_CHAIN, 'inventory'] }];

const parts: ObjectDefSlice = {
  location: { in: STORE_DOOR },
  name: 'parts',
  article: 'the',
  nouns: ['parts', 'gender changer', 'ribbon lead', 'converter', 'adapter parts'],
  portable: true,
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: partsExamine }] },
    { verbs: [V_ASSEMBLE], when: { has: ACT2_ADAPTER_PARTS }, effects: combineEffects },
    { verbs: [V_ASSEMBLE], effects: [{ say: combineMissingPartText }] },
  ],
};

const chain: ObjectDefSlice = {
  location: 'nowhere',
  name: 'adapter chain',
  // Deliberately NOT "chain" (§29.2 — the water crock's chained cup already owns it).
  nouns: ['adapter', 'adapters', 'adapter chain', 'lead', 'converter'],
  portable: true,
  description: 'About nine inches of obsolete adapters, shoved home end to end: a gender changer, a ribbon lead, a converter. One end is shaped like this decade. One end is shaped like an argument that decade lost.',
};

export const ACT2_GENERAL_STORE_D2_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT2_HONOR_BOX]: honorBox,
  [ACT2_JUNK_DRAWER]: junkDrawer,
  [ACT2_ADAPTER_PARTS]: parts,
  [ACT2_ADAPTER_CHAIN]: chain,
};

/** The shop opens — `STORE_DOOR`'s `open` toggle (see this section's own header). */
export const ACT2_SHOP_OPEN_EVENT: EventDef = {
  id: 'act2_ev_shop_open',
  when: SHOP_OPEN,
  once: false,
  effects: [{ setState: [STORE_DOOR, 'open', true] }],
};

export const ACT2_SHOP_CLOSED_EVENT: EventDef = {
  id: 'act2_ev_shop_closed',
  when: { not: SHOP_OPEN },
  once: false,
  effects: [{ setState: [STORE_DOOR, 'open', false] }],
};

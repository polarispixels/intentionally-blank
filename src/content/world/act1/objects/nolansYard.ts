// Nolan's Yard — the room's six objects
// (`docs/superpowers/specs/2026-09-06-act1-wave5-close-out-prose.md` §4),
// P6's search gate (§5), the four yield items (§7), and `pie_box` (§5.3).
//
// EXAMINE-VS-GATE RESOLUTION (this task's report, flagged in `ids.ts`'s own
// header on `NOLAN_BIN_LID`): §5's gate table binds SEARCH/EXAMINE/OPEN/
// LOOK IN on the bin to the puzzle (yield or soft fail), but §4.1 also
// authors its own two-rule EXAMINE prose ("Lid on, handles to the road...").
// Both cannot live on the same verb of the same object (no "which noun word
// resolved" signal). Chosen split: `nolan_bin`'s own "bin"/"trash"/
// "garbage"/"rubbish"/"refuse"/"sack(s)"/"bag(s)" nouns are uniformly the
// gate for EXAMINE/SEARCH/OPEN (`EXAMINE TRASH` reaches it, per spec 04
// §7's canon interface); the physical-container nouns ("can"/"trashcan"/
// "dustbin"/"lid"/"kerb"/"curb") move to a sub-part, `nolan_bin_lid`, which
// carries §4.1's own two-rule EXAMINE prose untouched. `EXAMINE LID`/
// `EXAMINE CAN` reach the container reading; `EXAMINE BIN`/`EXAMINE TRASH`
// reach the puzzle.
//
// GIVE PIE reaches the dog via `page78.ts`'s own `withInstrument` precedent:
// GIVE's dispatch is keyed on the *given* item's own handlers (`actions.ts`'s
// `findHandler` reads `dobj`, not `iobj`), so the handler lives on `pie_box`
// (the dobj) with `withInstrument: [NOLAN_DOG]` (the iobj) — not on the dog.
// `PUT PIE THROUGH FENCE` is the identical shape one verb over (`PUT_IN`,
// `withInstrument: [YARD_GATE]`, `preps` widened with "through" in
// `verbs.ts`). `FEED DOG` (no item named in the sentence) is the third
// route to the same effect and lives on `nolan_dog` itself, gated
// `when: { has: PIE_BOX }` — with no pie it falls through to `V_FEED`'s own
// generic default rather than a fabricated refusal.

import type { Effect } from '../../../../engine/effects';
import type { ObjectDefSlice } from '../../../../engine/world';
import type { ProseRule } from '../../../../engine/prose';
import { DIRECTION_VERB_IDS } from '../../../../engine/move';
import { BREAK, CLIMB, EXAMINE, GIVE, HELLO, MOVE, OPEN, pillBottleOpenText, PUT_IN, READ, SEARCH, TAKE, TASTE, TOUCH, TURN_OFF, UNLOCK } from '../verbs';
import { ASSEMBLE_REFUSAL_TEXT, ASSEMBLE_SUCCESS_EFFECTS, TABLE_IN_SCOPE } from './closeOut';
import {
  CLUE_J_BOX_141,
  CLUE_NOLAN_HEADACHES,
  CLUE_NOLAN_TRASH,
  FLAG_ALARM_RAISED,
  FLAG_ALARM_TURNS,
  FLAG_DOG_FED,
  FLAG_DOG_SETTLED,
  FLAG_JACK_COVERING,
  FLAG_PORCH_LIGHT_ON,
  FLAG_SAW_FOOTPRINTS,
  FLAG_SEARCHED_TRASH,
  NOLAN_BIN,
  NOLAN_BIN_LID,
  NOLAN_DOG,
  NOLAN_HOUSE,
  NOLANS_YARD,
  NOLANS_YARD_NO_EXIT_GATE,
  PIE_BOX,
  PILL_BOTTLE,
  PO_BOX_SLIP,
  PORCH_LIGHT,
  SHREDDED_STRIPS,
  V_APPROACH,
  V_ASSEMBLE,
  V_FEED,
  V_FOLLOW,
  V_KNOCK,
  V_RING,
  V_TIP,
  WALL_DRUG_CUP,
  YARD_ALLEY,
  YARD_GATE,
} from '../ids';

// ---------------------------------------------------------------------------
// §4.1 / §5 — the bin, and P6's search gate
// ---------------------------------------------------------------------------

const binLidExamine: ProseRule[] = [
  {
    when: { flag: FLAG_SEARCHED_TRASH },
    text: 'Lid on, handles to the road, square to the kerb. Whatever else it is, it is now also a thing you have put back exactly as you found it.',
  },
  {
    text:
      'A galvanised can with a lid on it, set square to the kerb with the handles facing the road, which is how a bin ends up when a man does everything the same way every time.\n\nThe lid is not locked to it, or tied to it, or weighted. Nobody in this county has ever had to do any of that to a bin.',
  },
];

const takeBinText = 'You could get your arms round it. You could also get it four feet before the noise arrived, and it would be a different sort of night after that.';

// §5.1 — the soft fail.
const softFailText =
  'The lid comes off quietly, which is the last quiet thing that happens.\n\nThe dog leaves the ground. It is less a bark than an announcement, and it goes up and down the fence putting everything it has into it, because at four in the morning something is finally going on.\n\nThen the porch light. It takes the yard in one go and it takes you with it, and behind the near window the curtain moves about a foot and there is a shape in it — not doing anything, not coming out, just being a shape in a window at four in the morning.\n\nYou have the lid back on and a fence post between you and the house before you have decided to do either.';

const waitItOutRefusalText = 'Not with the yard lit and the window occupied.\n\nYou stay where the post is and the dog gradually runs out of things to say about you.';

// §5.5 — the yield.
const yieldText =
  'The lid comes off and stays off.\n\nMost of a bin is a bin. You go through it the way it has to be gone through — by hand, briefly, without enthusiasm — and what you are mostly doing is throwing away everything that is only rubbish, which is nearly all of it: kitchen, packaging, a broken hanger, and one item damp enough that you decline to establish what it was and it declines to help.\n\nFour things are not rubbish.\n\n    a souvenir cup\n    a prescription bottle\n    a bundle of shredded paper\n    a slip of post-office stationery\n\nThe lid goes back on. You set it square to the kerb with the handles facing the road, because that is how it was when you got here.';

const yieldEffects: Effect[] = [
  { say: yieldText },
  { grantClue: CLUE_NOLAN_TRASH },
  { set: [FLAG_SEARCHED_TRASH, true] },
  { move: [WALL_DRUG_CUP, 'inventory'] },
  { move: [PILL_BOTTLE, 'inventory'] },
  { move: [SHREDDED_STRIPS, 'inventory'] },
  { move: [PO_BOX_SLIP, 'inventory'] },
];

const softFailEffects: Effect[] = [
  { say: softFailText },
  { set: [FLAG_ALARM_RAISED, true] },
  { set: [FLAG_PORCH_LIGHT_ON, true] },
  { set: [FLAG_ALARM_TURNS, 0] },
];

const GATE_VERBS = [EXAMINE, SEARCH, OPEN];

const nolanBin: ObjectDefSlice = {
  location: NOLANS_YARD,
  name: 'bin',
  portable: false,
  nouns: ['bin', 'trash', 'garbage', 'rubbish', 'refuse', 'sack', 'sacks', 'bag', 'bags'],
  handlers: [
    // §5's gate table, in order — first match wins (`actions.ts`'s `findHandler`).
    { verbs: GATE_VERBS, when: { any: [{ flag: FLAG_DOG_FED }, { flag: FLAG_JACK_COVERING }, { flag: FLAG_DOG_SETTLED }] }, effects: yieldEffects },
    { verbs: GATE_VERBS, when: { flag: FLAG_PORCH_LIGHT_ON }, effects: [{ say: waitItOutRefusalText }] },
    { verbs: GATE_VERBS, effects: softFailEffects },
    { verbs: [TAKE, MOVE, V_TIP], effects: [{ say: takeBinText }] },
  ],
};

const nolanBinLid: ObjectDefSlice = {
  location: { on: NOLAN_BIN },
  name: 'lid',
  portable: false,
  nouns: ['can', 'trashcan', 'dustbin', 'waste', 'lid', 'kerb', 'curb'],
  handlers: [{ verbs: [EXAMINE, READ], effects: [{ say: binLidExamine }] }],
};

// ---------------------------------------------------------------------------
// §4.2 — the dog
// ---------------------------------------------------------------------------

const dogExamineText =
  'Somewhere between two breeds and honest about neither. Brown, chest-high at the gate, one ear that has never come up, and a collar with a tag on it that turns away every time you get close enough to read it.\n\nIt is not guarding anything. It has been by itself in a yard since whatever hour the house went dark, and you are the first thing that has happened.\n\nIt has not barked yet. It is deciding what kind of evening this is.';

const petDogText = 'Through the wire you can get two fingers to the top of its head, which it takes as a firm commitment on your part. The tail starts. Nothing else about the situation improves.';

const talkToDogText = 'You tell it to be quiet, in the voice people use, and it takes the whole speech as further evidence that the two of you are getting on.';

const dogFedText =
  'The box goes over the wire. The dog receives it the way a customs officer receives a declaration, and then stops taking any further interest in what happens in South Dakota tonight.\n\nYou have as long as a slice of pie lasts. It is not hurrying, because it is good pie.';
const dogFedEffects: Effect[] = [{ say: dogFedText }, { set: [FLAG_DOG_FED, true] }];

const nolanDog: ObjectDefSlice = {
  location: NOLANS_YARD,
  name: 'dog',
  portable: false,
  nouns: ['dog', 'hound', 'mutt', 'animal', 'collar', 'tag', 'chain', 'ear', 'tail'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: dogExamineText }] },
    { verbs: [TOUCH], effects: [{ say: petDogText }] },
    { verbs: [HELLO], effects: [{ say: talkToDogText }] },
    // "FEED DOG" — bare, no item named; requires the pie already in hand. No pie ⇒ falls to V_FEED's own generic default (no fabricated refusal — hard rule 5).
    { verbs: [V_FEED], when: { has: PIE_BOX }, effects: dogFedEffects },
  ],
};

// ---------------------------------------------------------------------------
// §4.3 — the house
// ---------------------------------------------------------------------------

const houseExamineText =
  'One storey, painted a colour that was chosen, with a porch across the front and two steps up to it. The near window\'s curtain is drawn all the way, which is not how a curtain ends up unless somebody walked the room and did it.\n\nA car in the drive has frost on the windscreen and none on the bonnet.\n\nNo light anywhere in it. The dark of a house with somebody asleep in it is a different dark from the dark of an empty one, and this is the first kind.';

const knockText =
  'You could. He would come to the door in whatever he sleeps in, and he would be kind about it. Jack has already had that conversation on that porch and came away with coffee, an apology, and nothing.';

const breakInText =
  'There is a lock in the door, and you have a headache, no warrant and no name.\n\nWhat you came for is in a can at the kerb, which is legally somebody\'s and practically nobody\'s, and that distinction is the entire trade.';

const nolanHouse: ObjectDefSlice = {
  location: NOLANS_YARD,
  name: 'house',
  portable: false,
  // "nolan"/"bell" are builder additions (not in §4.3's own header noun
  // list) so "WAKE NOLAN"/"TALK TO NOLAN"/"RING BELL" resolve at all — see
  // this task's report. No literal bare "BREAK IN" (no object) is wired;
  // "BREAK HOUSE"/"BREAK DOOR" reach the same text via BREAK's own dobj
  // pattern instead (same class of accepted gap this codebase already
  // documents elsewhere, e.g. `mainStreet.ts`'s "ASK MAN" note).
  nouns: ['house', 'home', 'place', 'building', 'window', 'windows', 'curtain', 'curtains', 'porch', 'step', 'steps', 'door', 'front door', 'drive', 'driveway', 'car', 'siding', 'eave', 'nolan', 'bell'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: houseExamineText }] },
    { verbs: [V_KNOCK, V_RING, HELLO], effects: [{ say: knockText }] },
    { verbs: [OPEN, UNLOCK, BREAK, DIRECTION_VERB_IDS.in], effects: [{ say: breakInText }] },
  ],
};

// ---------------------------------------------------------------------------
// §4.4 — the porch light
// ---------------------------------------------------------------------------

const porchLightExamine: ProseRule[] = [
  { when: { flag: FLAG_PORCH_LIGHT_ON }, text: 'On, and taking the steps and the first eight feet of grass, and doing nothing whatever for the rest of the yard. Up in the cage the fitting ticks as it warms.' },
  { text: 'A bulb in a wire cage over the door, with a small grey eye set into the fitting under it. It is off. It is the kind that stays off until something in the yard disagrees.' },
];

const porchLightRefusalText =
  'It is over the door, the door is thirty feet inside a fence with a dog behind it, and the only tool you have brought to the job is a hat.\n\nThere is a better answer and it is already built into the fixture. Things that come on by themselves go off by themselves.';

const porchLight: ObjectDefSlice = {
  location: NOLANS_YARD,
  name: 'porch light',
  portable: false,
  nouns: ['light', 'porch light', 'lamp', 'bulb', 'fixture', 'fitting', 'cage', 'sensor', 'eye', 'motion sensor', 'detector'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: porchLightExamine }] },
    // "cover sensor"/"throw hat at light" are NOT wired — COVER and THROW
    // exist nowhere else in this verb table, and adding either for one
    // flavor line risks more than it delivers here; see this task's report.
    { verbs: [TURN_OFF, BREAK], effects: [{ say: porchLightRefusalText }] },
  ],
};

// ---------------------------------------------------------------------------
// §4.5 — the gate and the fence
// ---------------------------------------------------------------------------

const yardGateExamineText =
  'Chain-link, five feet, with a gate hung slightly out of true so that it rests shut against the post instead of latching. The latch is a loop of wire somebody made themselves, and the loop is not on.\n\nAlong the bottom of the wire, for about eight feet either side of the gate, the grass is worn down to dirt at dog height.';

const yardGateOpenText =
  'You lift the loop off and the gate comes toward you, and the dog comes with it, delighted, and puts its front feet somewhere around your ribs.\n\nGetting the gate shut again with the dog on the correct side of it takes both hands and a decision about your own dignity.\n\nNothing you want is in that yard. The bin is out here.';

const yardGateClimbText = 'Chain-link takes a man\'s weight badly and files a report on him while it does it.';

const yardGate: ObjectDefSlice = {
  location: NOLANS_YARD,
  name: 'gate',
  portable: false,
  nouns: ['gate', 'fence', 'chain link', 'chainlink', 'chain-link', 'wire', 'mesh', 'latch', 'loop', 'post', 'posts'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: yardGateExamineText }] },
    { verbs: [OPEN, DIRECTION_VERB_IDS.in], effects: [{ say: yardGateOpenText }] },
    { verbs: [CLIMB], effects: [{ say: yardGateClimbText }] },
    // "PUT PIE THROUGH FENCE" — dispatches on `pie_box` (the dobj), not here; see this file's own header.
  ],
};

// ---------------------------------------------------------------------------
// §4.6 — the alley and the ground at its mouth
// ---------------------------------------------------------------------------

const alleyExamineText =
  'The alley runs from the side of the yard back between fences toward the rear of the buildings on Main Street, and it is dark the whole way, in the manner alleys have.\n\nAt this end, where a downpipe has kept a patch of ground soft all winter, there are prints. Boots. Two sets, one larger than the other, both going the same way: toward town.\n\nNothing comes back this way.';
const alleyExamineEffects: Effect[] = [{ say: alleyExamineText }, { set: [FLAG_SAW_FOOTPRINTS, true] }];

const alleyFollowText =
  'Twenty feet in it is dark enough that you would be doing the rest of it by hand, along somebody\'s fence, in a town where you have already been hit once tonight.\n\nYou come back out. The alley opens onto Main Street at the far end, and you can walk to that end of it in daylight, like a person.';

const yardAlley: ObjectDefSlice = {
  location: NOLANS_YARD,
  name: 'alley',
  portable: false,
  nouns: ['alley', 'alleyway', 'side', 'lane', 'gap', 'footprint', 'footprints', 'print', 'prints', 'track', 'tracks', 'boot', 'boots', 'mud', 'ground', 'dirt', 'downpipe'],
  handlers: [
    { verbs: [EXAMINE, READ], effects: alleyExamineEffects },
    { verbs: [V_FOLLOW, SEARCH, DIRECTION_VERB_IDS.in, V_APPROACH], effects: [{ say: alleyFollowText }] },
  ],
};

// ---------------------------------------------------------------------------
// §6's "every other direction" gate — mirrors `TOWN_EDGE_NO_EXIT_GATE`.
// ---------------------------------------------------------------------------

const nolansYardNoExitGate: ObjectDefSlice = { location: NOLANS_YARD };

// ---------------------------------------------------------------------------
// §7 — the four yield items. All `portable: true`, all start
// `location: 'nowhere'`, granted into inventory by the yield (§5.5, above).
// ---------------------------------------------------------------------------

// §7.1 — the Wall Drug cup.
const wallDrugCupText =
  'A plastic cup that lost its lid some time ago, printed outside in red and yellow, the print scuffed white down one side where it has ridden in a car door.\n\n    WALL DRUG\n    FREE ICE WATER\n\nThe inside of the bottom is stained a ring\'s worth of brown, which is not what free ice water leaves.';

const wallDrugCup: ObjectDefSlice = {
  location: 'nowhere',
  name: 'souvenir cup',
  portable: true,
  // "mug" deliberately excluded (main-session ruling 6 / §18 item 4 — the diner's `mug` wins in the diner).
  nouns: ['cup', 'souvenir cup', 'souvenir', 'plastic cup', 'wall drug', 'walldrug'],
  handlers: [{ verbs: [EXAMINE, READ], effects: [{ say: wallDrugCupText }] }],
};

// §7.2 — the prescription bottle.
const pillBottleExamineText =
  'An amber plastic bottle with a white cap, the label printed by a machine that was low on one of its colours.\n\n    NOLAN, R.         SUMATRIPTAN 50MG\n    ONE AT ONSET. MAY REPEAT AFTER TWO HOURS.\n    NOT MORE THAN NINE IN ANY SEVEN DAYS.\n\nTwo left. The bottle has been opened and shut enough times to take the shine off the threads, and the pharmacy\'s own sticker on the back has been picked at by somebody with a thumbnail and time.';
const pillBottleExamineEffects: Effect[] = [{ say: pillBottleExamineText }, { grantClue: CLUE_NOLAN_HEADACHES }];

const pillBottle: ObjectDefSlice = {
  location: 'nowhere',
  name: 'prescription bottle',
  portable: true,
  nouns: ['bottle', 'pill bottle', 'pills', 'pill', 'prescription', 'medicine', 'tablets', 'label', 'cap', 'vial'],
  handlers: [
    { verbs: [EXAMINE, READ], effects: pillBottleExamineEffects },
    { verbs: [OPEN, TAKE, TASTE], effects: [{ say: pillBottleOpenText }] },
  ],
};

// §7.3 — the shredded paper. (P7's own `ASSEMBLE STRIPS`/`READ STRIPS`
// handlers, below, were added by the concurrent Close-out task once its own
// `objects/closeOut.ts` had `TABLE_IN_SCOPE`/the refusal/success text ready
// to import — this object's own EXAMINE and noun list are unaffected.)
const shreddedStripsText =
  'A double handful of strips, cross-cut, out of a machine that was not expensive. They have not been in the bin long: they are dry, and they are still roughly in the order they came out in, which is the one favour a shredder ever does anybody.\n\nSomewhere in here there is a document. You are not going to read it standing up.';

const shreddedStrips: ObjectDefSlice = {
  location: 'nowhere',
  name: 'shredded paper',
  portable: true,
  nouns: ['strips', 'shredded paper', 'shreddings', 'shreds', 'paper', 'bundle', 'confetti', 'shredder'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: shreddedStripsText }] },
    // §8's P7 ruling (`objects/closeOut.ts`, the concurrent Close-out
    // task's own module): "ASSEMBLE STRIPS" and "READ STRIPS" both attempt
    // the reassembly — table-in-scope succeeds (grants `work_order`, sets
    // `assembled_strips`), no table refuses. Wired here (not left as a
    // stub) since `TABLE_IN_SCOPE`/the refusal/success texts are already
    // authored and exported for exactly this handler.
    { verbs: [READ, V_ASSEMBLE], when: TABLE_IN_SCOPE, effects: ASSEMBLE_SUCCESS_EFFECTS },
    { verbs: [READ, V_ASSEMBLE], effects: [{ say: ASSEMBLE_REFUSAL_TEXT }] },
  ],
};

// §7.4 — the rent notice.
const poBoxSlipText =
  'A printed card, folded once, on the post office\'s own thin stock.\n\n    BOX RENT - BOX 141\n    THIS BOX IS PAID THROUGH THE END OF THE QUARTER.\n    RENEWALS AT THE COUNTER.\n\nIn a window on the front it is addressed to J., care of this house.\n\nAcross the bottom somebody has written, in a hand that is not the form\'s: returned - not known here. It has not been sent anywhere. It went in the bin.';
const poBoxSlipEffects: Effect[] = [{ say: poBoxSlipText }, { grantClue: CLUE_J_BOX_141 }];

const poBoxSlip: ObjectDefSlice = {
  location: 'nowhere',
  name: 'rent notice',
  portable: true,
  // No bare "141" here: the Act I playthrough found OPEN BOX 141 resolving to this slip in hand (the held tie-break) instead of the box.
  nouns: ['slip', 'notice', 'rent notice', 'post office slip', 'stationery', 'form', 'paper'],
  handlers: [{ verbs: [EXAMINE, READ], effects: poBoxSlipEffects }],
};

// ---------------------------------------------------------------------------
// §5.3 — the pie (Pearl's own `topic_pie_to_go`, `pearl.ts`, grants this).
// ---------------------------------------------------------------------------

const pieBoxExamineText = 'A white card box with one slice of yesterday\'s rhubarb lying on its side in it, and a crease down the lid where a thumb went.';

const pieBox: ObjectDefSlice = {
  location: 'nowhere',
  name: 'pie box',
  portable: true,
  // Deliberately NOT bare "box" (main-session ruling 6 / §18 item 4 — the
  // diner's/post office's/Catan's own "box" nouns already exist elsewhere).
  nouns: ['pie box', 'pie', 'slice', 'carton', 'rhubarb'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: pieBoxExamineText }] },
    { verbs: [GIVE], withInstrument: [NOLAN_DOG], effects: dogFedEffects },
    { verbs: [PUT_IN], withInstrument: [YARD_GATE], effects: dogFedEffects },
  ],
};

export const NOLANS_YARD_OBJECTS: Record<string, ObjectDefSlice> = {
  [NOLAN_BIN]: nolanBin,
  [NOLAN_BIN_LID]: nolanBinLid,
  [NOLAN_DOG]: nolanDog,
  [NOLAN_HOUSE]: nolanHouse,
  [PORCH_LIGHT]: porchLight,
  [YARD_GATE]: yardGate,
  [YARD_ALLEY]: yardAlley,
  [NOLANS_YARD_NO_EXIT_GATE]: nolansYardNoExitGate,
  [WALL_DRUG_CUP]: wallDrugCup,
  [PILL_BOTTLE]: pillBottle,
  [SHREDDED_STRIPS]: shreddedStrips,
  [PO_BOX_SLIP]: poBoxSlip,
  [PIE_BOX]: pieBox,
} satisfies Record<string, ObjectDefSlice>;

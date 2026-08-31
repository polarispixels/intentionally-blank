// Wall Drug — the Emporium's seven objects (D1 prose doc §6). Prose
// transcribed verbatim (hard rule 5).
//
// The `BUY` room response (§7) is authored per the doc as a bare, no-`dobj`
// line — but the engine's room-level `handlers` only ever fire for a verb
// with NO resolved direct object (`world.ts`'s `RoomDefSlice.handlers` doc
// comment; `actions.ts`'s `performAction` never even attempts a room
// handler once a `dobj` resolves). "buy" is already a `TAKE` synonym
// (act1/verbs.ts), whose pattern is `'V dobj'` only — bare "buy" with
// nothing named therefore fails to parse as `TAKE` at all (no `'V'`
// pattern), so it can never reach that room-handler path either. The
// nearest faithful, in-scope rendering is a `TAKE` handler on the objects a
// player would plausibly try to buy — every non-portable scenery object
// here except the water (§6.5's own text is explicit that the water is
// free and unwatched, which would directly contradict this refusal).
// Builder decision, flagged in this task's report.

import type { Effect } from '../../../../engine/effects';
import type { ObjectDefSlice } from '../../../../engine/world';
import type { ProseRule } from '../../../../engine/prose';
import { CLIMB, EXAMINE, OPEN, READ, SIT, TAKE, TURN_OFF } from '../../act1/verbs';
import { V_DRINK, V_KNOCK, V_RING, V_SLIDE_DOWN } from '../../act1/ids';
import {
  ACT2_CLAIM_WINDOW,
  ACT2_CLAIM_WINDOW_CARD,
  ACT2_CLUE_DEAD_NUMBERING,
  ACT2_CUSTODIAN,
  ACT2_DOT,
  ACT2_ICE_WATER,
  ACT2_JACKALOPE,
  ACT2_MERCHANDISE,
  ACT2_PORCH_RAIL,
  ACT2_READ_NUMBERING_KEY,
  ACT2_SIGNS,
  ACT2_TREX,
  ACT2_WALL_DRUG_EMPORIUM,
  ACT2_WALL_DRUG_EMPORIUM_NO_EXIT_GATE,
} from '../ids';

// ---------------------------------------------------------------------------
// §6.1 — the dinosaur
// ---------------------------------------------------------------------------

const trexExamine =
  'Canvas over a frame, painted green a long time ago and touched up since in a green that did not match and has now weathered to something that nearly does.\n\nThe mechanism is underneath and makes no secret of itself: hydraulic rams, one for the head and one for the jaw, and a length of chain, and a motor bolted to a plate bolted to the floor. Somebody has greased it recently. There is a grease gun on the rail beside it with a rag over the nozzle.\n\nIt comes up, and opens, and roars, and the roar is a speaker in the chest with a piece of gauze over it. Then it waits its interval and does it again, for the aisles.';

// Builder note: the doc gives "turn off dinosaur"/"stop dinosaur" the same
// text; there is no generic `STOP` verb anywhere in this engine (grepped
// act1/verbs.ts clean), so only `TURN_OFF` (already existing, "turn off"/
// "switch off") is wired — flagged in this task's report rather than
// inventing a one-off `STOP` verb for a single throwaway response.
const trexTurnOffText =
  'There is no switch on it anywhere you can reach, and no cord you can follow that does not go into the floor. Whatever turns it off is somewhere else, in somebody\'s understanding, and possibly in nobody\'s.';

const trex: ObjectDefSlice = {
  location: ACT2_WALL_DRUG_EMPORIUM,
  name: 'dinosaur',
  nouns: ['dinosaur', 't-rex', 'trex', 'tyrannosaurus', 'rex', 'lizard', 'monster', 'animatronic', 'machine', 'jaw', 'head', 'tail'],
  portable: false,
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: trexExamine }] },
    { verbs: [TURN_OFF], effects: [{ say: trexTurnOffText }] },
  ],
};

// ---------------------------------------------------------------------------
// §6.2 — the signs (class object, four rotations)
// ---------------------------------------------------------------------------

const SIGNS_EXAMINE_ROTATION = [
  'There are more of them than the building has walls. They stand in ranks out along both sides of the road and they are stacked three deep against the porch, retired and not thrown away.\n\nThe nearest one says HAVE YOU DUG WALL DRUG. It has been repainted twice by two different hands and the second hand traced the first.',
  'DINOSAUR. ROCK SHOP. CAFE. FREE ICE WATER. The four of them on one post, arrow-shaped, pointing in four directions, three of which are the same direction.',
  'Older, at the back of the stack, hand-lettered rather than printed, the paint gone chalky: WATER. That is all it says. It is the only sign here that is not selling anything and it is the only one that is true.',
  'A metal one, road-official in shape and not in colour, that has been used at some point to close a gap in the fence behind the building. It still says 32 MILES.',
];

const signs: ObjectDefSlice = {
  location: ACT2_WALL_DRUG_EMPORIUM,
  name: 'signs',
  article: 'the',
  // §27 wiring item 5 — this object takes bare "sign"/"signs" (a different
  // room from Town Edge's billboard/town-limits sign); `act2_merchandise`
  // must not claim (and below, does not claim) either word.
  nouns: ['sign', 'signs', 'hoarding', 'hoardings', 'billboard', 'billboards', 'forest', 'posts', 'lettering'],
  portable: false,
  handlers: [{ verbs: [EXAMINE], effects: [{ say: SIGNS_EXAMINE_ROTATION }] }],
};

// ---------------------------------------------------------------------------
// §6.3 — the merchandise (class object, four rotations)
// ---------------------------------------------------------------------------

const MERCHANDISE_EXAMINE_ROTATION = [
  'A rack of postcards with a wire clip on every pocket, turned so slowly by so many hands that the whole rack has worn a ring into the floorboards.',
  'The rock shop is one room of the twelve and it is entirely serious about itself: labelled trays, a hand lens on a chain, and a card explaining, in the handwriting of somebody who cared, the difference between agate and the thing most people buy thinking it is agate.',
  'A wall of hats. Straw, felt, and a shelf of the sort of hat a man buys because he is on holiday and will never wear again.\n\nNone of them is grey felt with the brim down on one side. You establish this without deciding to.',
  'Every price is on a handwritten tag and no tag is on the thing it belongs to. The system is understood by one person and she is not always here.',
];

const merchandise: ObjectDefSlice = {
  location: ACT2_WALL_DRUG_EMPORIUM,
  name: 'merchandise',
  article: 'the',
  nouns: ['merchandise', 'goods', 'stock', 'souvenirs', 'souvenir', 'stuff', 'junk', 'gifts', 'shelves', 'aisle', 'aisles', 'display', 'cases', 'postcards', 'hats', 'rocks'],
  portable: false,
  handlers: [{ verbs: [EXAMINE], effects: [{ say: MERCHANDISE_EXAMINE_ROTATION }] }],
};

// ---------------------------------------------------------------------------
// §6.4 — the jackalope
// ---------------------------------------------------------------------------

const jackalopeExamine =
  'A jackrabbit with a pair of small antlers set into its skull, mounted on a board, in a case, with a brass plate under it. Whoever did the work was good at it: the join is under the fur and you cannot find it.\n\nBeside the case, for photographs, there is a larger one — waist-high, fibre-glass, saddled, with a step at the side and forty years of hands on the antlers.';

const jackalopeRideText =
  'You get on. The saddle is fibreglass with a pad on it and the antlers are exactly where a person\'s hands go, worn pale and slightly narrower there than they were made.\n\nFor about four seconds the case is not a missing man, and then it is again, and you get down.';

const jackalope: ObjectDefSlice = {
  location: ACT2_WALL_DRUG_EMPORIUM,
  name: 'jackalope',
  nouns: ['jackalope', 'rabbit', 'hare', 'jack rabbit', 'jackrabbit', 'antlers', 'horns', 'taxidermy', 'mount', 'saddle'],
  portable: false,
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: jackalopeExamine }] },
    // "ride"/"sit on"/"climb" (§6.4) — "ride" reaches `V_SLIDE_DOWN` (the
    // landing banister's own word; §27 wiring item 6), same idiom the
    // Main Street horses' own `RIDE HORSE` already uses.
    { verbs: [V_SLIDE_DOWN, SIT, CLIMB], effects: [{ say: jackalopeRideText }] },
    { verbs: [TAKE], effects: [{ say: 'It is bolted through the board and the board is bolted to the floor. You are not the first to check.' }] },
  ],
};
// "ask dot about jackalope" is deliberately unwired here — falls to her own
// `unknownTopic` (§6.4's own note: "she has nothing to say about it and
// that is correct").

// ---------------------------------------------------------------------------
// §6.5 — the water (free; never a `BUY` target — see this file's header)
// ---------------------------------------------------------------------------

const iceWaterExamine =
  'A steel urn on the end of the counter with a tap at the bottom of it and ice going round inside every time it is knocked, which is often. Beside it, a stack of paper cups printed in red and yellow.\n\nThey are the cups. The one in your pocket came off this stack, or one exactly like it, at some point that is not yours.\n\nAbove the urn, screwed to the wall, small, in the same lettering as everything else outside:\n\n    FREE ICE WATER';

const freeWaterText =
  'It is very cold and it tastes of nothing at all, which out here is the expensive kind.\n\nNobody watches you take it. Nobody has ever watched anybody take it. That is the arrangement and it has outlasted every other arrangement in this county.';

const iceWater: ObjectDefSlice = {
  location: ACT2_WALL_DRUG_EMPORIUM,
  name: 'water urn',
  // "cup"/"cups" deliberately NOT claimed here (builder decision, flagged in
  // this task's report): `act1_wall_drug_cup` already carries bare "cup"
  // and is carried by the player from Nolan's Yard onward — claiming it
  // again here would make `FILL CUP`/`TAKE CUP` genuinely ambiguous between
  // the two (the wrong object taking the action), not merely the
  // disambiguate-and-move-on collision "counter" below is fine leaving as
  // is. `DRINK WATER`/`TAKE WATER` still reach this object; `FILL CUP`
  // isn't separately wired (see report).
  nouns: ['water', 'ice water', 'free ice water', 'urn', 'jug', 'cooler', 'dispenser', 'counter', 'ice'],
  portable: false,
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: iceWaterExamine }] },
    { verbs: [V_DRINK, TAKE], effects: [{ say: freeWaterText }] },
  ],
};

// ---------------------------------------------------------------------------
// §6.6 — the claim window (sets `act2_read_numbering_key`). The numbering
// card is a sub-part (`ACT2_CLAIM_WINDOW_CARD`, `location: { on: ... }`) —
// the same "distinct EXAMINE text needs its own object" idiom
// `FEDORA_BAND`/`DOOR_BOLT` already use — because "window"/"card" would
// otherwise both resolve to one object with no way to tell, at dispatch
// time, which noun the player actually typed.
// ---------------------------------------------------------------------------

const claimWindowExamine =
  'A hatch in the wall past the end of the counter, with a roll shutter half down and a shelf worn through its varnish where parcels have been slid across it.\n\nTaped inside the glass beside the hatch, face out, there is a card.';

const numberingCardText =
  'The card is ruled in pencil into two columns and filled in by hand, and then somebody has been over the whole of it in a later, wetter ink, so that most lines carry two versions of the same character and about one line in four carries only the first.\n\n    1 - 999          A\n    1000 - 1999      B\n    2000 - 2999      C\n    3000 - 3999      D\n    4000 - 4999      E\n\nUnder E the ruling continues and the writing stops. Whatever came after four thousand was going to be somebody else\'s problem, and by the look of the card it never became anybody\'s.';

const shutterUnattendedText =
  'The shutter goes up under your hand and stays up. There is no bell, no counter-bell, no button, and nothing behind the glass except a corridor with a light on in it.\n\nWherever the ten minutes on that card are being spent, they are being spent a long way from here.';

const readNumberingEffects: Effect[] = [{ say: numberingCardText }, { set: [ACT2_READ_NUMBERING_KEY, true] }, { grantClue: ACT2_CLUE_DEAD_NUMBERING }];

const claimWindow: ObjectDefSlice = {
  location: ACT2_WALL_DRUG_EMPORIUM,
  name: 'claim window',
  nouns: ['window', 'claim window', 'claim check', 'hatch', 'shutter'],
  portable: false,
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: claimWindowExamine }] },
    { verbs: [OPEN, V_KNOCK, V_RING], when: { not: { npcAt: [ACT2_DOT, ACT2_WALL_DRUG_EMPORIUM] } }, effects: [{ say: shutterUnattendedText }] },
  ],
};

const claimWindowCard: ObjectDefSlice = {
  location: { on: ACT2_CLAIM_WINDOW },
  name: 'numbering key',
  // Bare "key" deliberately dropped (§27 wiring item 3 — it already
  // resolves to the room keyring/room key elsewhere); "card"/"numbering"/
  // "scheme"/"chart"/"list" carry it instead, plus the qualified "numbering
  // key" itself.
  nouns: ['card', 'numbering', 'numbering key', 'scheme', 'list', 'chart'],
  portable: false,
  handlers: [{ verbs: [EXAMINE, READ], effects: readNumberingEffects }],
};

// ---------------------------------------------------------------------------
// §6.7 — the porch rail (2 rules — Custodian present/absent)
// ---------------------------------------------------------------------------

const porchRailExamine: ProseRule[] = [
  {
    when: { npcAt: [ACT2_CUSTODIAN, ACT2_WALL_DRUG_EMPORIUM] },
    text:
      'A hundred and some feet of rail along the front of the building, in white, and about a third of it is wet.\n\nThe finished end is very good. The line where the wet paint stops is a line, not a smear; the brush has been taken back along it to leave it that way. The bucket is on a board so it does not mark the deck and the board is where nobody has to step round it.',
  },
  {
    text:
      'A hundred and some feet of rail along the front of the building, in white, with a third of it whiter than the rest and no bucket anywhere.\n\nWhere the new work stops there is a clean line and no lap mark. You have to get your eye down to the level of the boards to see where it ends at all.',
  },
];

const porchRail: ObjectDefSlice = {
  location: ACT2_WALL_DRUG_EMPORIUM,
  name: 'porch rail',
  nouns: ['rail', 'railing', 'porch', 'veranda', 'verandah', 'paint', 'bucket', 'brush', 'ladder', 'boards'],
  portable: false,
  handlers: [{ verbs: [EXAMINE], effects: [{ say: porchRailExamine }] }],
};

// ---------------------------------------------------------------------------
// §7 — the room's own `BUY` (see this file's header note)
// ---------------------------------------------------------------------------

const buyRotation: ProseRule[] = [
  {
    when: { npcAt: [ACT2_DOT, ACT2_WALL_DRUG_EMPORIUM] },
    text: 'Dot names a figure without stopping what her hands are doing, and you pay it, and the whole transaction is over before you have decided how you feel about owning it.',
  },
  {
    text:
      'The nearest thing to a register is a drawer under the counter with a bell sitting on top of it. Taking something out of this building in the middle of the night, without paying, while looking for a man nobody will admit existed, is available to you and would be the second-stupidest thing you have done tonight.',
  },
];

const buyHandler = { verbs: [TAKE], effects: [{ say: buyRotation }] };

// Appended (never prepended) so each object's own, more specific TAKE
// response (the jackalope's "it's bolted down") is tried first — `.find()`
// in `actions.ts`'s `findHandler` takes the first array match.
for (const obj of [trex, signs, merchandise, jackalope, claimWindow, porchRail]) {
  obj.handlers = [...(obj.handlers ?? []), buyHandler];
}

// Always-closed "out" gate (§7) — never resolvable, never described, same
// idiom as `TOWN_EDGE_NO_EXIT_GATE`.
const noExitGate: ObjectDefSlice = { location: ACT2_WALL_DRUG_EMPORIUM };

export const ACT2_EMPORIUM_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT2_TREX]: trex,
  [ACT2_SIGNS]: signs,
  [ACT2_MERCHANDISE]: merchandise,
  [ACT2_JACKALOPE]: jackalope,
  [ACT2_ICE_WATER]: iceWater,
  [ACT2_CLAIM_WINDOW]: claimWindow,
  [ACT2_CLAIM_WINDOW_CARD]: claimWindowCard,
  [ACT2_PORCH_RAIL]: porchRail,
  [ACT2_WALL_DRUG_EMPORIUM_NO_EXIT_GATE]: noExitGate,
};

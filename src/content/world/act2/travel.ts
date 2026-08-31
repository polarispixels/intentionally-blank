// Act II, Wave D1 — the travel script (`act2_travel`), a `ScriptFn`, not a
// room and not an exit (Stage D plan §2 D1; §4.2; ADR 0011's own "travel is
// a script on an object handler" rule). Beats are hand-built `kind: 'beat'`
// events, one per fenced block of the prose doc's §4 (the MVP prologue's own
// idiom, `src/content/scenes/mvp-prologue.ts` line ~315 — `say` always
// renders `kind: 'prose'`, so pacing a scene like this means constructing
// the events directly).
//
// Every string below is transcribed verbatim from
// `docs/superpowers/specs/2026-09-09-stage-d1-prose.md` §3–§4 (hard rule 5).
// Six variants, 22 beats total (§4.1 ×8, §4.2 ×2, §4.3 ×2, §4.4 ×2, §4.5 ×6,
// §4.6 ×2) — the prose doc's own §28 word-count table says "27 beats"; this
// builder counted the actual fenced blocks under §4 by hand (`awk`/`grep`
// over the doc) and got 22, the same class of documented miscount this
// project's other prose docs already have (e.g. `jack.ts`'s 13/14 topics,
// Dot's 8/9). Not a cut — every fenced block under §4 is here.
//
// VARIANT SELECTION (plan §2 D1 item 1's own order — "first ride north →
// return trips → horse variants → night variants"), reduced to what the
// prose doc actually authors: six variants, chosen by `(mode, to, whether
// this is the first ride, and — truck return only — clockPhase)`. The horse
// has no "riding again" text distinct from its first ride (§4.5's own
// beats render unchanged on a second horse trip out — `act2_rode_north` and
// the clue effect are idempotent) and no day/night split on its return
// (§4.6) — only the truck's two return variants are clock-gated, matching
// the doc's own `when` clauses exactly.

import { apply } from '../../../engine/effects';
import { flag } from '../../../engine/cond';
import { phase } from '../../../engine/clock';
import type { Effect } from '../../../engine/effects';
import type { GameEvent, GameState, ScriptFn, WorldDef } from '../../../engine/world';
import type { WorldSlice } from '../game';
import { JACK, JACKS_MOTEL, MAIN_STREET, MAINTENANCE_MAN, MONSTER_TRUCK } from '../act1/ids';
import {
  ACT2_CLUE_MILES_DONT_COUNT,
  ACT2_HORSE,
  ACT2_JACK_AWAY,
  ACT2_RODE_NORTH,
  ACT2_STARTED,
  ACT2_WALL_DRUG_EMPORIUM,
} from './ids';
import { ACT3_AT_PERIMETER, ACT3_HORSE_TIED, ACT3_PERIMETER_ROAD } from '../act3/ids';

export type TravelMode = 'truck' | 'horse';
export type TravelDestination = 'wall_drug' | 'town' | 'perimeter';

// ---------------------------------------------------------------------------
// §4.1 — first ride north, truck (8 beats). Sets `act2_rode_north` at beat 6.
// ---------------------------------------------------------------------------

const TRUCK_FIRST_BEATS: string[] = [
  'The lot, the kerb, and then the cattle guard, which the truck crosses at a\nspeed nobody would recommend to it. The pipes go off underneath you like a\nstick run along a fence, and then there is no more town.\n\nIn the mirror the billboard passes from behind: grey boards, two legs in\nconcrete, never painted on that side. Going this way it advertises nothing at\nall.',
  "The heater takes a while to come round to your position. Jack drives with both\nhands and no commentary, and the centre line arrives in dashes out of a dark\nwith nothing else in it.\n\nOff both sides the country goes on doing whatever it does out there. The\nheadlights find a fence post, and another fence post, and the eyes of\nsomething that does not stay to be identified.",
  'The first sign comes up on the right, planted at the edge of the grass and\nleaning back from a lifetime of trucks going past it:\n\n    WALL DRUG\n    32 MILES\n\nJack does not look at it. There will, he says, be others.',
  '"There\'s a camera at the county line," he says, some way further on, to the\nwindscreen. "Reads plates. Went in when the plant went in, and it\'s the only\none on this road."\n\nHe lets that stand for a while.\n\n"My plates are mine and my name\'s on them. You haven\'t got a name at all." The\nwheel goes a degree left and a degree back. "Between the two of us we make\nabout one legal person, and I\'d not put much on that lasting."',
  'The signs keep arriving, one every mile or so, put in by somebody with a post\nhole digger and no reason to stop. FREE ICE WATER. HOMEMADE PIE. HAVE YOU DUG\nWALL DRUG. Then, on a post that has been repainted more recently than its\nneighbours:\n\n    WALL DRUG\n    32 MILES\n\n"They go up when they go up," Jack says. "Nobody\'s ever come back out here\nwith a brush and a smaller number."',
  'Under the speedometer there is a little wheel with a thumb screw beside it, the\nkind you zero before a run, and it has been zeroed. He did that in the lot,\nwith the engine going, before he put it in gear, and he did it the way a man\ndoes a thing he has done every time.\n\n"Thirty-two," Jack says, without being asked. "It\'ll say thirty-two when we\nstop. Said it the first time I came out here and it\'s said it every time\nsince." He is not making a point. He is answering a question you had not got\nround to. "Signs are advertising. Truck\'s just a truck."',
  'The lights come up on the right and stop being a glow.\n\nThey become rows. Then rows with distances between them, and a fence with\ndistances between the poles of it, and a great flat thing lit from underneath\nwith the steam going up off it and away sideways. It is a building. It has\nbeen a building for some minutes before you can say what kind.\n\nThen the road does something it has no reason to do. It goes wide and east and\nholds the bend a long way, and the building sits out in the middle of its own\nlight with its back to you the whole way round it.\n\n"They moved the road when they built," Jack says. "Paid the county and moved\nit."',
  'After that the country is country again for a good while.\n\nAnd then it is not. Signs — not one sign, a hundred of them, in ranks on both\nsides of the road, each lit by the truck for about a second and gone: MINERS.\nCOWBOYS. TOURISTS. SORE-FOOTED PEOPLE. And behind the ranks, low and long and\nlit right through, a building that has plainly never once considered closing.\n\nJack noses in beside two other vehicles and shuts the engine off, and the\nquiet comes in and sits down.\n\n"Go on, then," he says. "I\'ll be at the counter with a coffee, being the\nperson nobody looks at."',
];

// ---------------------------------------------------------------------------
// §4.2 — riding north again, truck (2 beats).
// ---------------------------------------------------------------------------

const TRUCK_AGAIN_BEATS: string[] = [
  'Out past the cattle guard, and the billboard from behind, and the dashes.\nJack drives. The signs arrive and say what they say.',
  'The lights come up on the right, and the road goes wide and east around them,\nand after that it is signs again, and then it is Wall Drug.',
];

// ---------------------------------------------------------------------------
// §4.3 — back to town, truck, night (2 beats).
// ---------------------------------------------------------------------------

const TRUCK_RETURN_NIGHT_BEATS: string[] = [
  'South is the same road with the signs on the other side of you, and the ones\nfacing this way are for people going the other way and have nothing to say to\nyou at all.',
  'The lights come round on the left, and go behind you, and stay in the mirror\nlonger than they have any business staying.\n\nThen the paler stripe, then a kerb, then a town.',
];

// ---------------------------------------------------------------------------
// §4.4 — back to town, truck, day (2 beats).
// ---------------------------------------------------------------------------

const TRUCK_RETURN_DAY_BEATS: string[] = [
  'In daylight the road is a grey line laid over a great deal of yellow, and the\nsigns turn out to be worse than they looked in the dark: hand-lettered, most of\nthem, and standing at slightly different angles, like a crowd that has been\nwaiting a long time.',
  'The plant, in daylight, is white and low and entirely reasonable, and there is\nnothing coming off it but a heat shimmer, and you would drive past it without\na thought if you had not been told to have one.\n\nThe road goes wide and east around it anyway.',
];

// ---------------------------------------------------------------------------
// §4.5 — first ride north, horse (6 beats). Sets `act2_rode_north` at beat 3.
// ---------------------------------------------------------------------------

const HORSE_FIRST_BEATS: string[] = [
  'Nobody watches you go. That is most of the argument for doing it this way.\n\nThe pavement stops being pavement, and then the grass starts, and after about\na hundred yards of that the road is a thing off to your right that you are no\nlonger using.',
  'The country takes the horse the way it takes rain. There is no track. There is\nfrozen ground that gives an inch and comes back, and draws that have to be\ngone round, and one long shallow rise that takes the better part of an hour\nand turns out at the top of it to have another one behind it.\n\nThe cold gets in at the wrists first. Then everywhere else, at leisure.',
  'Somewhere in the second hour the ground offers you something.\n\nA line of fence posts. Cedar, grey, split at the tops, no wire on them and\nnone for a long time by the look of the staples. They are not on the line of\nany fence anybody is keeping now — they cross the country at their own angle,\ngoing over the rise and not coming back.\n\nThey run north. So, more or less, do you.',
  'Off to the right, a long way off, the plant stands in its light with the\ncountry black all round it, and from out here you can see what the road does\nabout it: a string of moving headlamps that goes wide, and holds wide, and\ncomes back to the line afterwards.\n\nNothing out here goes wide. The country lets you at it directly, which is the\nwhole difference between a horse and a truck and is going to cost you two more\nhours.',
  'There is nobody to say any of it to. That is a different quiet from the\ntruck\'s, and it is not better.',
  'Then, from a long way out and all at once, the signs — a hundred of them\nstanding in the dark with nothing lit on them but what your own eyes have\nadjusted to — and behind the signs a building with every light in it on.\n\nYou come in at the back of the lot, at a walk, off the road, off the camera,\nand off any list that anybody keeps.',
];

// ---------------------------------------------------------------------------
// §4.6 — back to town, horse (2 beats).
// ---------------------------------------------------------------------------

const HORSE_RETURN_BEATS: string[] = [
  'The horse knows the way back the way any animal knows the way back, which is\nto say it stops asking you about it after the first mile.',
  'Grass, and frost, and the rise, and the posts going off north on their own\nbusiness, and then a rail on a street with a knot in a rope waiting to be put\nback exactly as it was.',
];

// ---------------------------------------------------------------------------
// D3, task A amendment — travel to the perimeter (D3 prose doc §3; plan §2
// D3's own "truck 30 / horse 60 + the walk"). `to: 'perimeter'` is the
// outbound leg (either mode, from wherever the vehicle starts); `from:
// 'perimeter'` is the return leg — a SEPARATE arg key from `to`, because
// unlike the wall_drug/town pair (both keyed by `to`, disambiguated by
// `destinationFor`'s own vehicle-home lookup) the perimeter's return beats
// are wholly distinct text from the wall_drug return's, and `to: 'town'`
// alone carries no way to tell which trip is ending. `act3_at_perimeter`
// gates the TRUCK's own first/again split (§3.1 vs §3.4 — "have you EVER
// been to the perimeter, by any mode"); `act3_horse_tied` gates the
// HORSE's own first/again split independently (§3.3 vs §3.4 — "have you
// tied the horse there before"), exactly as the doc's own two `when`
// clauses state; see this task's report on the resulting asymmetry (a
// truck ride after an earlier horse ride gets the truck's "thereafter"
// beats on what is, for the truck, its own first outing).
// ---------------------------------------------------------------------------

const PERIMETER_TRUCK_FIRST_BEATS: string[] = [
  'Out over the cattle guard and north, and this time nobody is going to Wall\nDrug.\n\nThe fence arrives on the right a long while before anything it is fencing.\nOnce it is there it does not stop being there, and it does not go over a rise\nor round a draw the way the county\'s own fences do — it takes them.',
  'Then the road does its wide thing, east, and holds it, and the building comes\nround on the right in its own light with the steam going up off the plant end\nand away sideways.\n\nHalfway round the bend a road comes off it to the left, made up, with a white\nline painted on it that nobody needed. Jack takes it without slowing and\nwithout being asked.',
  'He stops well short of the gate, on the verge, and turns the truck round to\nface the way out before he touches the handbrake.\n\n"I\'ll be here." He puts the brake on with the heel of his hand. "I\'m no use to\nyou past that wire and my plates are a name on a list. Go on."',
];

const PERIMETER_TRUCK_RETURN_BEATS: string[] = [
  'He has the engine going before you have the door shut. Nothing gets said until\nthe cattle guard, which he takes at a walking pace, the way you take a thing\nyou intend to still be there.\n\nThen: "Well?"',
];

const PERIMETER_HORSE_FIRST_BEATS: string[] = [
  'You go out on the horse because nobody anywhere keeps a list of horses, and\nfor the better part of an hour that is the best idea you have had all week.\n\nThe perimeter road when you meet it is a made road across grazing that never\nasked for one, and you ride the grass beside it rather than the surface, which\nis what the grass is there for.',
  'A mile short of the gate the perimeter road crosses a cattle guard, and the\nhorse stops at it.\n\nIt is not a shy and it is not a refusal. It walks up to the pipes, puts its\nhead down, and stands. You get off and lead it, and it comes as far as the\npipes and no further, and stands again with its ears going and its weight back\noff its front feet.\n\nYou tie it at the corner post where the grass is, and it lets you, and it\nwatches you walk away with its head out over the wire.',
  'The last mile is on your own feet, on somebody else\'s surface, with a fence on\nyour right and no verge worth the name, and it takes exactly as long as a mile\ntakes.',
];

const PERIMETER_TRUCK_AGAIN_BEATS: string[] = ['Out, round, and off on the made road. Jack stops in the same place and turns\nround in it.'];

const PERIMETER_HORSE_AGAIN_BEATS: string[] = ['The grass, the road, the corner post. The horse stops where it stopped before\nand you walk the last of it again.'];

const PERIMETER_HORSE_RETURN_BEATS: string[] = [
  'It is where you left it and it has not settled. It does not settle when you\nuntie it and it does not settle when you are up.\n\nIt settles about a hundred yards south of the pipes, all at once, like\nsomething being put down.',
];

// ---------------------------------------------------------------------------
// Beat selection (plan §2 D1 item 1's own order).
// ---------------------------------------------------------------------------

function beatsFor(mode: TravelMode, to: TravelDestination, rodeNorth: boolean, night: boolean): string[] {
  if (mode === 'truck') {
    if (to === 'wall_drug') return rodeNorth ? TRUCK_AGAIN_BEATS : TRUCK_FIRST_BEATS;
    return night ? TRUCK_RETURN_NIGHT_BEATS : TRUCK_RETURN_DAY_BEATS;
  }
  // horse — one first-ride text (repeats verbatim on a later horse trip out;
  // §4.5's own note: nothing in this wave gives it a second variant) and one
  // return text, no day/night split (§4.6 has none).
  return to === 'wall_drug' ? HORSE_FIRST_BEATS : HORSE_RETURN_BEATS;
}

function perimeterOutboundBeats(mode: TravelMode, atPerimeterAlready: boolean, horseTiedAlready: boolean): string[] {
  if (mode === 'truck') return atPerimeterAlready ? PERIMETER_TRUCK_AGAIN_BEATS : PERIMETER_TRUCK_FIRST_BEATS;
  return horseTiedAlready ? PERIMETER_HORSE_AGAIN_BEATS : PERIMETER_HORSE_FIRST_BEATS;
}

function perimeterReturnBeats(mode: TravelMode): string[] {
  return mode === 'truck' ? PERIMETER_TRUCK_RETURN_BEATS : PERIMETER_HORSE_RETURN_BEATS;
}

/** `'wall_drug'` always lands at the Emporium; `'town'` lands wherever the vehicle's own home is (the motel for the truck, Main Street for the horse) — §4.2's "the map draws the highway as a permanently closed door," not a real multi-stop route. */
function destinationFor(mode: TravelMode, to: TravelDestination) {
  if (to === 'wall_drug') return ACT2_WALL_DRUG_EMPORIUM;
  if (to === 'perimeter') return ACT3_PERIMETER_ROAD;
  return mode === 'truck' ? JACKS_MOTEL : MAIN_STREET;
}

/**
 * `act2_travel` — the whole of §4.2's script contract: beats, `advanceClock`
 * (truck 45 / horse 240 to Wall Drug, both directions; truck 30 / horse 60
 * to the perimeter, both directions — D3 prose doc §3), the vehicle move,
 * Jack's pin (truck only — "Jack rides only in the truck"), the first-ride
 * flags/clue (Wall Drug only — the perimeter is reachable only once
 * `act2_started`, so none of that first-ride bookkeeping applies there),
 * retiring the Act I ladder man, and `goto`.
 */
export const act2Travel: ScriptFn = (world, state, args) => {
  const mode = args?.mode as TravelMode;
  const to = args?.to as TravelDestination | undefined;
  const from = args?.from as TravelDestination | undefined;

  if (to === 'perimeter' || from === 'perimeter') return act2TravelPerimeter(world, state, mode, to);

  const rodeNorth = flag(world, state, ACT2_RODE_NORTH) === true;
  const isFirstRide = to === 'wall_drug' && !rodeNorth;
  const night = phase(world.meta, state.clock) === 'night';

  const beats = beatsFor(mode, to as TravelDestination, rodeNorth, night);
  const beatEvents: GameEvent[] = beats.map((text) => ({ type: 'line', kind: 'beat', text }));

  const dest = destinationFor(mode, to as TravelDestination);
  const minutes = mode === 'truck' ? 45 : 240;
  const vehicle = mode === 'truck' ? MONSTER_TRUCK : ACT2_HORSE;

  const effects: Effect[] = [{ advanceClock: minutes }, { move: [vehicle, dest] }];

  if (mode === 'truck') {
    if (to === 'wall_drug') {
      effects.push({ moveNpc: [JACK, dest] }, { set: [ACT2_JACK_AWAY, true] });
    } else {
      effects.push({ moveNpc: [JACK, 'schedule'] }, { set: [ACT2_JACK_AWAY, false] });
    }
  }

  if (isFirstRide) {
    effects.push(
      { set: [ACT2_RODE_NORTH, true] },
      { grantClue: ACT2_CLUE_MILES_DONT_COUNT },
      { set: [ACT2_STARTED, true] },
      // ADR 0011/plan ruling 2 — "act2_started retires the ladder man,"
      // done here (the first-ride effects) rather than as a puzzle's
      // `onSolved` (P9 is not this task's own declaration — see report).
      { move: [MAINTENANCE_MAN, 'nowhere'] },
    );
  }

  effects.push({ goto: dest });

  const applied = apply(world, state, effects, { path: 'script.act2_travel' });
  return { state: applied.state, events: [...beatEvents, ...applied.events] };
};

/**
 * D3, task A — the perimeter's own leg, split out of `act2Travel` above
 * rather than threaded through its wall_drug/town branches (the two
 * destinations share nothing but the vehicle-move/Jack-pin shape; sharing
 * more than that produced harder-to-read conditionals in review).
 */
function act2TravelPerimeter(world: WorldDef, state: GameState, mode: TravelMode, to: TravelDestination | undefined): { state: GameState; events: GameEvent[] } {
  const outbound = to === 'perimeter';
  const atPerimeterAlready = flag(world, state, ACT3_AT_PERIMETER) === true;
  const horseTiedAlready = flag(world, state, ACT3_HORSE_TIED) === true;

  const beats = outbound ? perimeterOutboundBeats(mode, atPerimeterAlready, horseTiedAlready) : perimeterReturnBeats(mode);
  const beatEvents: GameEvent[] = beats.map((text) => ({ type: 'line', kind: 'beat', text }));

  const minutes = mode === 'truck' ? 30 : 60;
  const vehicle = mode === 'truck' ? MONSTER_TRUCK : ACT2_HORSE;
  const dest = outbound ? ACT3_PERIMETER_ROAD : destinationFor(mode, 'town');

  const effects: Effect[] = [{ advanceClock: minutes }, { move: [vehicle, dest] }];

  if (mode === 'truck') {
    if (outbound) effects.push({ moveNpc: [JACK, ACT3_PERIMETER_ROAD] }, { set: [ACT2_JACK_AWAY, true] });
    else effects.push({ moveNpc: [JACK, 'schedule'] }, { set: [ACT2_JACK_AWAY, false] });
  }

  if (outbound) {
    effects.push({ set: [ACT3_AT_PERIMETER, true] });
    if (mode === 'horse' && !horseTiedAlready) effects.push({ set: [ACT3_HORSE_TIED, true] });
  }

  effects.push({ goto: dest });

  const applied = apply(world, state, effects, { path: 'script.act2_travel' });
  return { state: applied.state, events: [...beatEvents, ...applied.events] };
}

// ---------------------------------------------------------------------------
// L10's payoff clue (§4.1 beat 6 / §4.5 beat 3's own note).
// ---------------------------------------------------------------------------

export const ACT2_TRAVEL_CLUES: NonNullable<WorldSlice['clues']> = {
  [ACT2_CLUE_MILES_DONT_COUNT]: {
    title: 'The signs on the county road',
    detail:
      "Wall Drug's signs stand along the road all the way out from town, and the\nones that carry a distance carry thirty-two. So does the billboard at the town\nedge. Jack's trip wheel reads thirty-two at the far end of it. Nothing on that\nroad ever says a smaller number.",
  },
};

// The Sundown Diner
// (`docs/superpowers/specs/2026-09-04-act1-wave3-prose.md` PART ONE) —
// Zone 1 room 4, and the home of Pearl (`pearl.ts`). Canon (§2): Pearl opens
// at four and the room is *pre-opening* when the player arrives — a
// business plan, not an anomaly, and the cheapest possible place to hang
// morning/Friday-close states later (not built here).

import type { ExitDefSlice, HandlerDef, RoomDefSlice } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { LISTEN, SLEEP, SMELL, WAIT } from './verbs';
import { FLAG_MET_PEARL, FLAG_VISITED_DINER, JACK, MAIN_STREET, SUNDOWN_DINER, SUNDOWN_DINER_NO_EXIT_GATE, V_LOOK_UP } from './ids';

// ---------------------------------------------------------------------------
// §3.1 — description
// ---------------------------------------------------------------------------

const FIRST_SIGHT = [
  'Gold on the window in an arc, each letter with a shadow line under it done by hand: THE SUNDOWN. Behind the glass the lights are on at the counter end and off over the tables, and half the chairs are still upside down on their tops.',
  'Inside it is warm, and it smells of coffee and of a griddle coming up to heat, and both of those are older than the hour.',
  'A counter runs the length of the room with eight stools bolted in front of it and a shelf of white mugs upside down behind it. A pie case at one end, lit from inside, turning. Over the booths, four rows of framed photographs, hung by somebody who ran out of wall and kept going.',
  'Behind the counter a woman in an apron is doing four things, and looks up.',
].join('\n\n');

const RETURN_VISIT =
  'Warm, and the griddle up, and the chairs still stacked over the tables at the dark end. The counter, the mugs, the pie case, the photographs. Pearl, doing four things.';

// D0 (presence-and-passage §2.4, the writer's proposal, accepted by the main
// session): from `act2_started` Jack's morning post is this counter, and the
// engine carries presence in prose — so the return visit says so while he is
// here. `npcAt` is only ever true once his Act II schedule rule fires.
const RETURN_VISIT_WITH_JACK = `${RETURN_VISIT} And at the counter, third stool from the end, Jack, with a plate in front of him and a folder he is not reading.`;

const description: ProseRule[] = [
  { when: { not: { flag: FLAG_VISITED_DINER } }, text: FIRST_SIGHT },
  { when: { npcAt: [JACK, SUNDOWN_DINER] }, text: RETURN_VISIT_WITH_JACK },
  { text: RETURN_VISIT },
];

// ---------------------------------------------------------------------------
// §3.2 — room-level senses
// ---------------------------------------------------------------------------

const smell = 'Coffee, and hot iron, and under both of them bacon, which is not being cooked now and has not left this room in living memory.';

const listen = 'The urn. The griddle ticking as it comes up. A fridge compressor at the far end working to its own schedule. And Pearl, who has not stopped talking and was not waiting for you to arrive before she started.';

const lookUp = 'Acoustic tile, a ceiling fan on a long stem turning too slowly to be moving anything, and a paper streamer over the door left up from a holiday you cannot identify.';

// ---------------------------------------------------------------------------
// §5 — room-specific responses
// ---------------------------------------------------------------------------

const waitText = "You wait. The griddle comes up another few degrees. Pearl tells you something about somebody's roof.";

const sleepText = 'Warm, upholstered, and eight feet from a coffee urn. Pearl would let you, which is the whole trouble with it.';

// §5's own note: no `WHAT YEAR IS IT` response for this room (falls to the
// global — Main Street's own text, unchanged, per that verb's `default`)
// and no `SHOUT`/`HELLO` override either. On the latter: the doc's own
// reasoning is "there is a woman four feet away ... it falls to the global
// greeting family, which routes to her" — but this engine's bare HELLO
// (`verbs.ts`'s `helloDefault`) never routes to a present NPC regardless of
// room (`marlow.ts`'s own header note documents this identical gap at the
// Front Desk, where Marlow is also four feet away); flagged here rather
// than silently wired around, per this task's own escalation instruction.
// No room-level handler is added for either verb.

const roomHandlers: HandlerDef[] = [
  { verbs: [SMELL], effects: [{ say: smell }] },
  { verbs: [LISTEN], effects: [{ say: listen }] },
  { verbs: [V_LOOK_UP], effects: [{ say: lookUp }] },
  { verbs: [WAIT], effects: [{ say: waitText }] },
  { verbs: [SLEEP], effects: [{ say: sleepText }] },
];

// §2's onEnter — both flags set here rather than via Pearl's own greeting
// rule 1 (which the schema can never run an `Effect` from — see `pearl.ts`'s
// own header note, same engine gap `sheriffOffice.ts`/`whitlock.ts` already
// document for `met_whitlock`).
const onEnter: RoomDefSlice['onEnter'] = [{ effects: [{ set: [FLAG_VISITED_DINER, true] }, { set: [FLAG_MET_PEARL, true] }] }];

// §5's "every other direction — in-world, not the build boundary."
const noOtherExitText = "Past the counter is Pearl's kitchen, which is Pearl's. The tables at the dark end go nowhere. The street is behind you.";

const travelTextOut = 'The door has a bell on a leaf spring, and then the cold takes the coffee straight back out of you.';

// Real exits (§5's own exits table, this task's brief): `out`/`east`/
// `leave`/`exit` -> `main_street` — `out` (canonical) plus the reciprocal
// compass `e`/`se` (the diner sits northwest of Main Street — §15.3;
// `se`, kept alongside `e`, is the exact reciprocal of Main Street's own
// `nw`). "leave"/"exit" are already `out`'s own words (`verbs.ts`).
// Every other compass direction is the in-world refusal above, via the
// always-closed gate (same idiom as `SHERIFF_OFFICE_NO_EXIT_GATE`).
const otherDirections: ExitDefSlice[] = (['n', 'ne', 's', 'w', 'nw', 'sw', 'up', 'down'] as const).map((dir) => ({
  dir,
  to: SUNDOWN_DINER,
  door: SUNDOWN_DINER_NO_EXIT_GATE,
  blockedText: noOtherExitText,
}));

export const sundownDinerRoom: RoomDefSlice = {
  name: 'Sundown Diner',
  // "the sundown" is NOT an alias — `dropBaseNoise` (`parser/tokenize.ts`)
  // strips "the" from any position before lookup, so a stored alias
  // containing it can never be typed back in and matched (`validate.ts`'s
  // `noise-word-vocabulary` check, a hard error).
  aliases: ['sundown diner', 'diner', 'sundown'],
  area: 'act1',
  // Main Street sits at {x:1,y:2} (`mainStreet.ts`) — northwest of it,
  // clear of every other declared room's coordinates.
  map: { x: 0, y: 1 },
  description,
  onEnter,
  exits: [
    { dir: 'out', to: MAIN_STREET, travelText: travelTextOut },
    { dir: 'e', to: MAIN_STREET, travelText: travelTextOut },
    { dir: 'se', to: MAIN_STREET, travelText: travelTextOut },
    ...otherDirections,
  ],
  handlers: roomHandlers,
};

// Act III, Stage D4 task D — the Pipe Chase room (D4 prose doc §11-§13).
// Light tier, 3 objects (`objects/pipeChase.ts`). No death in the chase, in
// any wave (§11's own header line).
//
// Three exits (§21.4, amended by D5 §39.1): `up` to the Cooling Plant
// (§11.5 — D3's own hatch `DOWN` now lands here for real, `objects/
// coolingPlant.ts`'s own amendment, this task's); `out`/`s5`/`sideways` to
// S5 (task C's own room — C wires S5's own `down` into here, per this
// task's own briefing); and `down` — RETIRED as a boundary in Stage D5
// (task F's own amendment, this file): it is now a real exit to the S6
// Maintenance Bay. `ACT3_BOUNDARY_GATE` (D3's, `objects/coolingPlant.ts`)
// is no longer referenced from this file at all — the wave's one
// surviving boundary now lives at the Archive Hub (D5 §31).
//
// ENGINE GAP (same one `coolingPlant.ts`'s own header documents): direction
// verbs are intercepted by the engine before any room-level handler ever
// sees them (`respond.ts`: `dir !== undefined && dobj === undefined` routes
// straight to `traverseDirection`) — noted here for the `up`/`out` exits
// below; irrelevant to `down` now that it's a plain, ungated exit.

import type { ExitDefSlice, OnEnterRule, RoomDefSlice } from '../../../engine/world';
import type { Effect } from '../../../engine/effects';
import type { ProseRule } from '../../../engine/prose';
import { HELLO, LISTEN, SLEEP, SMELL, WAIT, YELL } from '../act1/verbs';
import { V_ACT2_WAIT_UNTIL_AFTERNOON, V_ACT2_WAIT_UNTIL_EVENING, V_ACT2_WAIT_UNTIL_MORNING, V_ACT2_WAIT_UNTIL_NIGHT } from '../act2/ids';
import { ACT3_COOLING_PLANT, ACT3_PIPE_CHASE, ACT3_PIPE_CHASE_SEEN, ACT3_S5_REACTOR_INTERFACE, ACT3_S6_MAINTENANCE_BAY, V_ACT3_SIDEWAYS } from './ids';

// ---------------------------------------------------------------------------
// §11.1 — description. Gated on `ACT3_PIPE_CHASE_SEEN`, NOT `{ not: {
// visited: ACT3_PIPE_CHASE } }` — see `ids.ts`'s own doc comment on that
// flag for why the `visited`-cond idiom every other D3 room's own "first
// sight" rule uses is actually unreachable on a genuine arrival
// (`renderArrival` marks `visited` BEFORE rendering `description`, not
// after). `onEnter` (below) sets the flag one step later, so this rule
// still only ever shows once.
// ---------------------------------------------------------------------------

const firstSight =
  'A formed concrete shaft, about four feet by six, with a ladder bolted down one\ncorner and the two big pipes taking up most of what is left.\n\nIt is warm, and it is wet. Not running wet — the walls carry a film, and the\nfilm has been here long enough to have gone the faint grey-green of a surface\nthat gets water and no light, and the rungs are cold and greasy under the\nhand.\n\nEverything in here is a fact about Return B. Its lagging stops a yard below\nthe S5 floor and was never picked up again, so from there down it is bare\nsteel, warm, and dry in a shaft where nothing else is.\n\nAbove you the shaft goes up a long way, past a formed opening with light in\nit, to a square of light with a hatch beside it.\n\nBelow you the shaft goes down.';

const returnVisit = 'The shaft, the ladder, the two pipes, and the film on the walls.\n\nUp is the plant. Sideways is the gallery. Down is down.';

const description: ProseRule[] = [
  { when: { not: { flag: ACT3_PIPE_CHASE_SEEN } }, text: firstSight },
  { text: returnVisit },
];

const onEnter: OnEnterRule[] = [{ effects: [{ set: [ACT3_PIPE_CHASE_SEEN, true] }] }];

// ---------------------------------------------------------------------------
// §11.5 — `UP`, to the Cooling Plant. Gate: none (§21.4's own table) — a
// player who reaches the chase via S5 without ever opening the hatch can
// still climb up; the doc's own exits table draws no distinction.
// ---------------------------------------------------------------------------

const upExitText =
  'Ten minutes of ladder with a warm pipe going the other way past your right\nshoulder, and then a square of light, and then a plant room that is going to\nfeel cold.';

const upExit: ExitDefSlice = { dir: 'up', to: ACT3_COOLING_PLANT, travelText: upExitText, minutes: 10 };

// ---------------------------------------------------------------------------
// §21.4 — `out`/`s5`/`sideways` to S5 (task C's own room; C wires S5's own
// `down` into here). No travelText is authored for this transit anywhere in
// §11/§12 — the arrival is S5's own description. "s5"/"sideways" reach the
// same destination via `V_ACT3_SIDEWAYS` (this file's own handler, below);
// `out` is the one canonical `Direction` this exit can declare.
// ---------------------------------------------------------------------------

const outExit: ExitDefSlice = { dir: 'out', to: ACT3_S5_REACTOR_INTERFACE, minutes: 1 };

const sidewaysEffects: Effect[] = [{ goto: ACT3_S5_REACTOR_INTERFACE }, { advanceClock: 1 }];

// ---------------------------------------------------------------------------
// §13/§39.1 (D5) — the boundary is RETIRED here. `DOWN` is now a real exit
// to the S6 Maintenance Bay, 1 minute, D4's own in-world descent paragraph
// kept VERBATIM as the `travelText` (hard rule 5); the system line that
// followed it ("END OF BUILD... Sublevel 6 is not in this version.") is
// deleted in this same change, along with the never-open
// `ACT3_BOUNDARY_GATE` gate on this exit — the wave's one surviving
// boundary now lives at the Archive Hub instead (D5 prose doc §31, task
// G's own room). `ACT3_BOUNDARY_GATE` itself is untouched (still declared
// in `objects/coolingPlant.ts`, still used by that room's own hatch loop).
// ---------------------------------------------------------------------------

export const CHASE_DESCENT_TEXT =
  'The ladder goes on.\n\nThere is no landing here, no plate across it, no permit stencil and nothing\nbolted over the opening; the shaft simply continues, formed the same, with the\nsame bolts in the same string, and the air coming up it is warmer than the air\nyou are standing in and it is moving.\n\nSomewhere a long way below you, water is going through something at a steady\nrate, and it is the only thing there is to hear.';

// `act3_q_when_unwatched`'s own `openWhen: { visited: act3_pipe_chase }`
// (`knowledge.ts`'s wave-D4-shared block) already opens it the moment the
// player arrives here at all, by any route; its own `answerWhen: {
// visited: act3_s6_maintenance_bay }` (D5 task F's edit, same file) answers
// it the moment this exit is actually taken.
const downExit: ExitDefSlice = { dir: 'down', to: ACT3_S6_MAINTENANCE_BAY, travelText: CHASE_DESCENT_TEXT, minutes: 1 };

// ---------------------------------------------------------------------------
// §11.6 — room-level senses and responses.
// ---------------------------------------------------------------------------

const listenText =
  'Water in a pipe, drips arriving at different intervals from different heights,\nand above all of it the plant, a long way up, being the loudest thing in the\ncounty to anybody standing in a concrete tube.';

const smellText =
  'Wet concrete, warm steel, and the flat mineral smell of treated water, which\nyou last met upstairs coming off a gland that was weeping a drop an hour.';

const shoutText =
  'A shaft this shape does something specific with a shout, which is to send most\nof it straight up and give you back the rest a half-second later sounding\nlike somebody else.';

const waitText = 'Warm, wet, and going nowhere. The drips carry on arriving at their own\nintervals.';

const restText = 'On a ladder, in a shaft, with a hand on a warm pipe. No.';

export const pipeChaseRoom: RoomDefSlice = {
  name: 'Pipe Chase',
  aliases: ['chase', 'pipe chase'],
  description,
  onEnter,
  exits: [upExit, outExit, downExit],
  handlers: [
    { verbs: [LISTEN], effects: [{ say: listenText }] },
    { verbs: [SMELL], effects: [{ say: smellText }] },
    { verbs: [YELL, HELLO], effects: [{ say: shoutText }] },
    { verbs: [WAIT], effects: [{ say: waitText }] },
    { verbs: [SLEEP, V_ACT2_WAIT_UNTIL_MORNING, V_ACT2_WAIT_UNTIL_AFTERNOON, V_ACT2_WAIT_UNTIL_EVENING, V_ACT2_WAIT_UNTIL_NIGHT], effects: [{ say: restText }] },
    { verbs: [V_ACT3_SIDEWAYS], effects: sidewaysEffects },
  ],
};

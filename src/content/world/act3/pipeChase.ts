// Act III, Stage D4 task D — the Pipe Chase room (D4 prose doc §11-§13).
// Light tier, 3 objects (`objects/pipeChase.ts`). No death in the chase, in
// any wave (§11's own header line).
//
// Three exits (§21.4): `up` to the Cooling Plant (§11.5 — D3's own hatch
// `DOWN` now lands here for real, `objects/coolingPlant.ts`'s own amendment,
// this task's); `out`/`s5`/`sideways` to S5 (task C's own room — C wires
// S5's own `down` into here, per this task's own briefing); and `down` —
// the wave's one surviving `system.buildBoundary` (§13, §21.1), self-looped
// through the same never-open `ACT3_BOUNDARY_GATE` D3 declared for the (now
// retired) hatch route (`objects/coolingPlant.ts`).
//
// ENGINE GAP (same one `coolingPlant.ts`'s own header documents): direction
// verbs are intercepted by the engine before any room-level handler ever
// sees them (`respond.ts`: `dir !== undefined && dobj === undefined` routes
// straight to `traverseDirection`), and `ExitDefSlice.blockedText` always
// renders `kind: 'prose'`, never `kind: 'system'` — a content-only
// approximation. The `down` exit below concatenates §13's in-world
// paragraph with its system line into one string for exactly that reason,
// the same idiom D3's own hatch exit used.

import type { ExitDefSlice, OnEnterRule, RoomDefSlice } from '../../../engine/world';
import type { Effect } from '../../../engine/effects';
import type { ProseRule } from '../../../engine/prose';
import { HELLO, LISTEN, SLEEP, SMELL, WAIT, YELL } from '../act1/verbs';
import { V_ACT2_WAIT_UNTIL_AFTERNOON, V_ACT2_WAIT_UNTIL_EVENING, V_ACT2_WAIT_UNTIL_MORNING, V_ACT2_WAIT_UNTIL_NIGHT } from '../act2/ids';
import { ACT3_BOUNDARY_GATE, ACT3_COOLING_PLANT, ACT3_PIPE_CHASE, ACT3_PIPE_CHASE_SEEN, ACT3_S5_REACTOR_INTERFACE, V_ACT3_SIDEWAYS } from './ids';

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
// §13 — the boundary. One door (`ACT3_BOUNDARY_GATE`, declared in D3's own
// `ids.ts`/`objects/coolingPlant.ts` for the now-retired hatch route, reused
// here rather than a second gate object — "one door", per this task's own
// briefing): it has no `container` at all, so `objectState`'s own default
// (`resolve.ts`: `declared?.container?.open ?? false`) keeps it permanently
// closed, and the exit self-loops (`to: ACT3_PIPE_CHASE`) rather than ever
// actually traversing.
// ---------------------------------------------------------------------------

export const CHASE_BOUNDARY_TEXT =
  'The ladder goes on.\n\nThere is no landing here, no plate across it, no permit stencil and nothing\nbolted over the opening; the shaft simply continues, formed the same, with the\nsame bolts in the same string, and the air coming up it is warmer than the air\nyou are standing in and it is moving.\n\nSomewhere a long way below you, water is going through something at a steady\nrate, and it is the only thing there is to hear.\n\nEND OF BUILD\n\nAct III continues below this floor. Sublevel 6 is not in this version.';

// `act3_q_when_unwatched`'s own `openWhen: { visited: act3_pipe_chase }`
// (`knowledge.ts`'s wave-D4-shared block) already opens it the moment the
// player arrives here at all, by any route — so hitting this boundary needs
// no separate effect to guarantee it "opens if §9.6 did not" (§13's own
// note): visiting the room already does.
const downExit: ExitDefSlice = { dir: 'down', to: ACT3_PIPE_CHASE, door: ACT3_BOUNDARY_GATE, blockedText: CHASE_BOUNDARY_TEXT };

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

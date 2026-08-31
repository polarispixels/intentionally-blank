// Town Edge (`docs/superpowers/specs/2026-09-04-act1-wave3-prose.md` PART
// THREE) — Zone 1 room 14, the north end of Main Street. §14's build
// boundary moved here (from Main Street's own `north` — that room's §8/
// wave-2 amendment §13.3). `system.buildBoundary` is now declared exactly
// once, on this room's own `north` exit, via an always-closed gate object
// (`TOWN_EDGE_BOUNDARY_GATE`, `objects/townEdge.ts` — the only
// `system.buildBoundary` gate left in the game since a separate task
// deleted Main Street's own `MAIN_STREET_BOUNDARY_GATE` outright, its
// `north` variant now a real exit down to here — §15.3's own ruling).
// ENGINE GAP (same one already flagged on that former boundary):
// `ExitDefSlice.blockedText` always renders `kind: 'prose'`, never the
// doc's own instructed `kind: 'system'` — a content-only approximation,
// byte-identical in the CLI.
//
// This room is now reachable by walking `north` from Main Street (a
// separate task's own change, `mainStreet.ts`) — `tests/world-act1-wave3-
// town-edge.test.ts` still places the player here directly (via
// `renderArrival` with a synthetic `GameState`) for its own object-level
// coverage, per that file's own header.

import type { ExitDefSlice, HandlerDef, RoomDefSlice } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { HELLO, LISTEN, SMELL, WAIT, YELL } from './verbs';
import { CLAIM_TICKET, FLAG_VISITED_TOWN_EDGE, MAIN_STREET, NOLANS_YARD, TOWN_EDGE, TOWN_EDGE_BOUNDARY_GATE, TOWN_EDGE_NO_EXIT_GATE, V_LOOK_UP } from './ids';

// ---------------------------------------------------------------------------
// §12.1 — description (§13.1/§13.2 amend both rules, wave 5)
// ---------------------------------------------------------------------------

const FIRST_SIGHT = [
  'The street gives up here. The last building on the east side is a shed with a padlock on it, and behind the shed there is a fence, and behind the fence a house with a yard round it and no lights in any of it. There is no last building on the west. After them the kerb stops being a kerb and the road goes on north as a paler stripe in the dark.',
  'There is a rail fence and a paddock with no horses in it, and a trough with ice on the trough. There is a sign facing the other way, for people arriving.',
  'And there is the billboard, on two legs in the dirt, close enough now that you are standing in what it thinks of as its audience.',
  'North of all of it, the glow. From here it is not a glow. It is a great many separate lights, low and far and arranged, with one red one high up on something you cannot see, going on and off very slowly.',
  'The wind has nothing to get around out here and comes straight down the road at you.',
].join('\n\n');

const RETURN_VISIT =
  'The end of the pavement, the paddock rail, the sign facing away, the billboard. East, past the shed, a fence and a dark house. North, the lights. The street behind you goes back to where the buildings are.';

const description: ProseRule[] = [
  { when: { not: { flag: FLAG_VISITED_TOWN_EDGE } }, text: FIRST_SIGHT },
  { text: RETURN_VISIT },
];

// ---------------------------------------------------------------------------
// §12.2 — room-level senses
// ---------------------------------------------------------------------------

const smell = 'Cold, and dust, and the particular nothing that a great deal of open country smells of. Somewhere behind you the town smells of coffee. Out here it does not.';

const listen =
  "Wind on wire, and wind on the billboard's frame, which is a lower note than you expect out of a flat thing. No engine anywhere in the county. Back in town, one of the horses, once.";

const lookUp = 'The stars come all the way down to the ground out here on three sides. On the fourth they stop where the lights start.';

// ---------------------------------------------------------------------------
// §14 — room-specific responses
// ---------------------------------------------------------------------------

const waitText = 'You wait. The wind keeps arriving. The red light goes off and comes back on, twice, in the time it takes you to decide you are cold.';

const shoutText =
  'You shout north. The wind takes it sideways before it has got going, and there is nothing out here shaped to send any of it back.';

const roomHandlers: HandlerDef[] = [
  { verbs: [SMELL], effects: [{ say: smell }] },
  { verbs: [LISTEN], effects: [{ say: listen }] },
  { verbs: [V_LOOK_UP], effects: [{ say: lookUp }] },
  { verbs: [WAIT], effects: [{ say: waitText }] },
  // "SHOUT"/"YELL"/"CALL OUT"/"HELLO" (to the street, no target) — overrides other rooms' own bare HELLO/YELL while in this room (same idiom as Main Street's own shoutText).
  { verbs: [YELL, HELLO], effects: [{ say: shoutText }] },
];

const onEnter: RoomDefSlice['onEnter'] = [{ effects: [{ set: [FLAG_VISITED_TOWN_EDGE, true] }] }];

// §14's build boundary text — this room's own exported constant (hard rule
// 5: transcribed verbatim from §14's "the `north` variant, which now lives
// here"). NOT added to `responses.ts` (out of this task's module — a
// separate task deletes Main Street's old `north` variant there and, if it
// needs a `{ ref }`, can point at this constant instead).
export const TOWN_EDGE_BOUNDARY_NORTH_TEXT =
  'END OF BUILD\n\nNorth is the county road, thirty-two miles of it, and what the lights are. None of it is in this version.';

/**
 * §13.4's rule 1 (wave 5) — the in-world redirect once the player holds the
 * claim ticket (granted by the concurrent Close-out task's own §9.5). Rule
 * 2 is `TOWN_EDGE_BOUNDARY_NORTH_TEXT`, unedited.
 */
const NORTH_REDIRECT_WITH_TICKET_TEXT =
  'Thirty-two miles of it, in the dark, on a county road, with a card in your pocket that says HOLD FOR PICKUP and no hour of the day printed on it anywhere.\n\nThe truck is in the motel lot, and the man who owns it has asked you twice where.';

const northBlockedText: ProseRule[] = [
  { when: { has: CLAIM_TICKET }, text: NORTH_REDIRECT_WITH_TICKET_TEXT },
  { text: TOWN_EDGE_BOUNDARY_NORTH_TEXT },
];

const travelTextOut = 'You walk back in among the buildings and the wind stops being a fact about you.';

/** §13.3 (wave 5) — Town Edge → Nolan's Yard, east of the street. */
const travelTextToYard = 'Past the shed, along a fence with nothing on the other side of it for a while, and then there is a gate and a kerb and somebody\'s frontage.';

// §14's "every other direction — in-world, not the build boundary." 'e' is
// removed (wave 5, §13.3) — it is now a real exit, below.
const noOtherExitText = 'There is no road that way, and no reason to be the first man out there tonight.';

const otherDirections: ExitDefSlice[] = (['w', 'ne', 'nw', 'se', 'sw', 'up', 'down'] as const).map((dir) => ({
  dir,
  to: TOWN_EDGE,
  door: TOWN_EDGE_NO_EXIT_GATE,
  blockedText: noOtherExitText,
}));

export const townEdgeRoom: RoomDefSlice = {
  name: 'Town Edge',
  area: 'act1',
  // Main Street sits at {x:1,y:2} (`mainStreet.ts`); the map's own y axis
  // increases outward along the story's geography (landing {x:1,y:0} ->
  // front desk {x:1,y:1} -> Main Street {x:1,y:2}), so north of Main Street
  // is {x:1,y:3} — same column (this room is the street's own continuation,
  // not a side building), one row further out, not colliding with any other
  // room's own coordinates (grepped `map:` across this directory first;
  // `county_library` also sits at y:3, but at x:2).
  map: { x: 1, y: 3 },
  description,
  onEnter,
  exits: [
    // "south"/"out"/"leave"/"back" (§14's exits table) — `Direction` only
    // has twelve real values (compass + in/out), and "leave"/"exit" are
    // already `out`'s own words while "back"/"enter"/"go through" are
    // already `in`'s (`move.ts`'s `DIRECTION_VERB_IDS`, `verbs.ts`'s own
    // word lists) — so both `out` and `in` are pointed at Main Street here,
    // alongside the real compass `s`, the same "collapse several compass
    // ids onto one destination" idiom `sheriffOffice.ts`'s own `out`/`n`/`ne`
    // trio and `postOffice.ts`'s `out`/`n` pair already use. "back" reaching
    // Main Street (rather than "further in," its usual sense elsewhere)
    // is this room's own reading of §14's table, not a new engine
    // mechanism.
    { dir: 's', to: MAIN_STREET, travelText: travelTextOut },
    { dir: 'out', to: MAIN_STREET, travelText: travelTextOut },
    { dir: 'in', to: MAIN_STREET, travelText: travelTextOut },
    { dir: 'n', to: TOWN_EDGE, door: TOWN_EDGE_BOUNDARY_GATE, blockedText: northBlockedText },
    // §13.3 (wave 5) — the real east exit, Nolan's Yard.
    { dir: 'e', to: NOLANS_YARD, travelText: travelTextToYard },
    ...otherDirections,
  ],
  handlers: roomHandlers,
};

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
import { CLAIM_TICKET, FLAG_VISITED_TOWN_EDGE, MAIN_STREET, MONSTER_TRUCK, NOLANS_YARD, TOWN_EDGE, TOWN_EDGE_BOUNDARY_GATE, TOWN_EDGE_NO_EXIT_GATE, TOWN_EDGE_TUNNEL_BOUNDARY_GATE, V_LOOK_UP } from './ids';
import { ACT2_HORSE_BORROWED, ACT2_KNOWS_TUNNEL_MOUTH, ACT2_MEM_M15, ACT2_STARTED, ACT2_TRAVEL_SCRIPT, ACT2_WALL_DRUG_EMPORIUM, V_ACT2_DRIVE_TO_PLANT } from '../act2/ids';
import { ACT2_DRIVE_TO_PLANT_EFFECTS } from '../act2/scripts';
// D3, task A — "RIDE TO PLANT" (§3, ruling 1), mirroring "DRIVE TO PLANT" just below.
import { V_ACT3_RIDE_TO_PLANT } from '../act3/ids';

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

// D2-C amendment (D2 prose doc §18.4) — retro-visibility, one clause, keyed on M15, appended to the return-visit rule.
const RETURN_VISIT_WITH_M15 = `${RETURN_VISIT}\n\nThere is a stepladder folded flat against the back of the last building, out\nof the weather, in a place somebody chose.`;

const description: ProseRule[] = [
  { when: { not: { flag: FLAG_VISITED_TOWN_EDGE } }, text: FIRST_SIGHT },
  { when: { memory: ACT2_MEM_M15 }, text: RETURN_VISIT_WITH_M15 },
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
  // D1 amendment — the boundary's second route (§21), with the truck present. Never reachable in D1 (the travel script never parks the truck here) — wired per the ruling's own text, forward-compatible with a later wave.
  { verbs: [V_ACT2_DRIVE_TO_PLANT], when: { objectAt: [MONSTER_TRUCK, TOWN_EDGE] }, effects: ACT2_DRIVE_TO_PLANT_EFFECTS },
  // D3, task A — "RIDE TO PLANT," the horse's own boundary door (§3, ruling 1).
  {
    verbs: [V_ACT3_RIDE_TO_PLANT],
    when: { flag: ACT2_HORSE_BORROWED },
    effects: [{ script: { id: ACT2_TRAVEL_SCRIPT, args: { mode: 'horse', to: 'perimeter' } } }],
  },
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
 * 2 (below) is `TOWN_EDGE_BOUNDARY_NORTH_TEXT`, unedited — kept as this
 * exit's final unconditional fallback (see this file's own D1 comment on
 * why, immediately below).
 */
const NORTH_REDIRECT_WITH_TICKET_TEXT =
  'Thirty-two miles of it, in the dark, on a county road, with a card in your pocket that says HOLD FOR PICKUP and no hour of the day printed on it anywhere.\n\nThe truck is in the motel lot, and the man who owns it has asked you twice where.';

/**
 * D1 amendment (Stage D1 prose doc §18, rule 1) — "replaces wave 5 §13.4's
 * redirect entirely" once `act2_started`. Text transcribed verbatim (hard
 * rule 5).
 */
const NORTH_STARTED_TEXT =
  'Thirty-two miles of county road, on foot, at whatever hour this now is.\n\nThere is a truck. Failing the truck there is a rail on Main Street with a knot\nin it that a child could get out of. Failing both of those there is standing\nhere, which you have now done.';

/**
 * D1 amendment — three rules, not the doc's own two. §18's own text says
 * "`TOWN_EDGE_BOUNDARY_NORTH_TEXT` leaves this exit," but the doc only
 * supplies conditional rules for `act2_started` and `has: CLAIM_TICKET` —
 * with neither true (the ordinary start of the game, before the player has
 * ever picked up the ticket or ridden anywhere), no rule would match at all,
 * and `prose.render` throws rather than rendering nothing ("no rule ...
 * matched, and none is unconditional" — confirmed against `prose.ts`;
 * `validate.ts`'s own `checkRoomExits` does not check `blockedText` for a
 * missing fallback, so this would only surface as a runtime crash on `GO
 * NORTH` from a fresh game, not a `validate(WORLD)` finding). Kept as an
 * unconditional third rule instead of deleted outright: it reproduces
 * exactly the shipped v0.9.0 behavior for that one remaining state (neither
 * flag holds), so no player-visible regression, and it genuinely does
 * "leave this exit" for every state D1 actually changes (once `act2_started`
 * or the ticket is held). See this task's report.
 */
/** Exported so `objects/townEdge.ts`'s own `billboardClose`/`roadNorth` handlers can reach the same act2_started-aware text instead of the stale shipped one (this task's own consistency call — see that file's own comment). */
export const northBlockedText: ProseRule[] = [
  { when: { flag: ACT2_STARTED }, text: NORTH_STARTED_TEXT },
  { when: { has: CLAIM_TICKET }, text: NORTH_REDIRECT_WITH_TICKET_TEXT },
  { text: TOWN_EDGE_BOUNDARY_NORTH_TEXT },
];

// D2-C amendment (§23) — the tunnel's town-side country exit. Same
// "ENGINE GAP" approximation this file's own header already documents for
// `TOWN_EDGE_BOUNDARY_NORTH_TEXT` (`blockedText` only ever renders `kind:
// 'prose'`, never the doc's own instructed `kind: 'system'`): the country
// line and the system line are concatenated into one string rather than
// split across two `GameEvent` kinds.
//
// D3 task C amendment (D3 prose doc §15/§21.1) — "D2's boundary text is
// retired in the same change... All three [the fence, the gatehouse, and
// what a borrowed badge opens] are now in this version." The in-world
// cedar-post preamble is kept byte-for-byte; only the system line changes,
// to §15's own (`act3/scripts.ts`'s `ACT3_BOUNDARY_TEXT`, transcribed here
// rather than imported — this file already carries its own copy of this
// exact "ENGINE GAP" concatenation idiom, and importing a cross-act string
// constant into Act I for one shared literal would be the wrong direction
// for very little gain). `act2/scripts.ts`'s own `ACT2_BOUNDARY_SCRIPT`/
// `ACT2_BOUNDARY_TEXT` are deliberately NOT deleted in this change — see
// this task's own report: they are still load-bearing for the shipped
// `DRIVE TO PLANT` handlers (`jacksMotel.ts`, this file's own `north`
// amendment) until task A's own plan-directed retirement of that verb
// lands; deleting them here would break those handlers outside this
// task's module.
const NW_TUNNEL_BLOCKED_TEXT =
  'You go out over the grazing with the last of the town behind you and the line\nof cedar posts on your left, and the posts carry no wire and never have, and\nthey run north as straight as anything in this county.\n\nEND OF BUILD\n\nAct III continues below this floor. Sublevel 1, Sublevel 5, the service tunnel and the pipe chase are not in this version.';

const travelTextOut = 'You walk back in among the buildings and the wind stops being a fact about you.';

/** §13.3 (wave 5) — Town Edge → Nolan's Yard, east of the street. */
const travelTextToYard = 'Past the shed, along a fence with nothing on the other side of it for a while, and then there is a gate and a kerb and somebody\'s frontage.';

// §14's "every other direction — in-world, not the build boundary." 'e' is
// removed (wave 5, §13.3) — it is now a real exit, below.
const noOtherExitText = 'There is no road that way, and no reason to be the first man out there tonight.';

// D2-C amendment — "nw" removed from this list (now its own real,
// flag-gated exit, above).
const otherDirections: ExitDefSlice[] = (['w', 'ne', 'se', 'sw', 'up', 'down'] as const).map((dir) => ({
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
    // D1 amendment — `to` now points at the real Emporium (`ACT2_WALL_DRUG_
    // EMPORIUM`), not a self-loop, so the map draws the highway link (D1
    // prose doc §18's own note). The door never opens (`TOWN_EDGE_BOUNDARY_
    // GATE` has no `container` declared, so its own `open` state defaults
    // false — see that id's own comment), and `cli/scope.ts`'s `travelGraph`
    // only ever routes `GO TO` through already-*visited* rooms with an
    // *open* door — so this change is inert for pathfinding until the doors
    // actually open (never, in this build) and purely cosmetic for the map.
    { dir: 'n', to: ACT2_WALL_DRUG_EMPORIUM, door: TOWN_EDGE_BOUNDARY_GATE, blockedText: northBlockedText },
    // §13.3 (wave 5) — the real east exit, Nolan's Yard.
    { dir: 'e', to: NOLANS_YARD, travelText: travelTextToYard },
    // D2-C amendment (§23) — the tunnel's town-side country exit. Only
    // "exists" once the player has learned the tunnel is there; `to` is a
    // self-loop (same idiom as `TOWN_EDGE_BOUNDARY_GATE`'s own `n` exit
    // before D1 pointed it at a real room) since no tunnel room exists in
    // this build. Removed from `otherDirections` below so the two don't
    // collide (a room's `exits` array may not declare the same `dir` twice
    // — `nw`'s own generic "no exit that way" text no longer applies once
    // `act2_knows_tunnel_mouth` is set).
    { dir: 'nw', to: TOWN_EDGE, when: { flag: ACT2_KNOWS_TUNNEL_MOUTH }, door: TOWN_EDGE_TUNNEL_BOUNDARY_GATE, blockedText: NW_TUNNEL_BLOCKED_TEXT },
    ...otherDirections,
  ],
  handlers: roomHandlers,
};

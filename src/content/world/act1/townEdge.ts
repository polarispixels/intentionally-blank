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
import { CLAIM_TICKET, FLAG_VISITED_TOWN_EDGE, MAIN_STREET, MONSTER_TRUCK, NOLANS_YARD, TOWN_EDGE, TOWN_EDGE_BOUNDARY_GATE, TOWN_EDGE_NO_EXIT_GATE, V_LOOK_UP } from './ids';
import { ACT2_HORSE_BORROWED, ACT2_KNOWS_TUNNEL_MOUTH, ACT2_MEM_M15, ACT2_STARTED, ACT2_TRAVEL_SCRIPT, ACT2_WALL_DRUG_EMPORIUM, V_ACT2_DRIVE_TO_PLANT } from '../act2/ids';
import { ACT2_DRIVE_TO_PLANT_EFFECTS } from '../act2/scripts';
// D3, task A — "RIDE TO PLANT" (§3, ruling 1), mirroring "DRIVE TO PLANT" just below.
import { V_ACT3_RIDE_TO_PLANT } from '../act3/ids';
// D4 task A — the county-road walk's real destination and its two gates.
import { ACT3_TUNNEL_APPROACH_GATE, ACT3_TUNNEL_MOUTH } from '../act3/ids';

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

// D4 task A amendment (D4 prose doc §3, §12.4, §21.1) — D3's boundary on
// this exit "becomes real": `nw` now runs the county-road walk to the
// Service Tunnel's mouth instead of ending in `system.buildBoundary`. §3.1
// beat 1 is D2 §23's shipped preamble, reused verbatim (exported below, not
// duplicated) — it is not rewritten and not quoted twice (§21.1's own
// instruction). D3's system line (`ACT3_BOUNDARY_TEXT`, formerly
// concatenated onto this same constant) is deleted in this same change —
// Sublevel 1, the service tunnel and the pipe chase all exist now.
//
// Exported so nothing else in this wave re-quotes beat 1 — there is nowhere
// else in this build that needs it, so it stays local to this file rather
// than moving to `act2/`; see this task's report on why the doc's own "find
// it in act2/" instruction doesn't match where D3 actually landed this
// string (D3 task C's own amendment inlined it here, not into an act2 file).
export const TUNNEL_COUNTRY_PREAMBLE_TEXT =
  'You go out over the grazing with the last of the town behind you and the line\nof cedar posts on your left, and the posts carry no wire and never have, and\nthey run north as straight as anything in this county.';

const tunnelApproachBeat2 =
  'An hour of it. The ground gives an inch and comes back, and the draws have to\nbe gone round, and the posts do not go round anything at all — they take the\nrises head on, one after another, at an angle that has nothing to do with the\nfences that are still up.\n\nOff to your right the county road keeps you company without ever getting\ncloser. It is doing the same thing the posts are doing, in its own way and for\nits own reasons, and neither of them will admit to the other.';

const tunnelApproachBeat3 = 'Then the road makes its bend, and the posts come down off the last rise, and\nstop.';

/** §3.1 — first time out. */
const TUNNEL_APPROACH_FIRST_TIME_TEXT = `${TUNNEL_COUNTRY_PREAMBLE_TEXT}\n\n${tunnelApproachBeat2}\n\n${tunnelApproachBeat3}`;

/** §3.3 — out again, after the first time, short form. */
const TUNNEL_APPROACH_SHORT_FORM_TEXT = 'The grazing, the posts, the bend. It is an hour whether you are looking\nforward to it or not.';

const tunnelApproachTravelText: ProseRule[] = [
  // register 90: the mouth is its own room now, with real `visited` tracking
  // — no need for this task's own `act3_at_tunnel_mouth` flag to select
  // first-time vs. short-form (the flag is still set, harmlessly, by the
  // mouth's own `onEnter`, `tunnelMouth.ts`, in case anything else wants it).
  { when: { not: { visited: ACT3_TUNNEL_MOUTH } }, text: TUNNEL_APPROACH_FIRST_TIME_TEXT },
  { text: TUNNEL_APPROACH_SHORT_FORM_TEXT },
];

/**
 * §3.4 — going out with nothing that will open it. Blocks the exit outright
 * (`ExitDefSlice.door`, `ACT3_TUNNEL_APPROACH_GATE` — kept in sync every
 * tick by `objects/serviceTunnel.ts`'s own reactive `EventDef`, since
 * nothing that could flip this condition is a dedicated action this
 * content can hook) rather than relocating the player and walking them
 * back, matching the doc's own "the player stays at Town Edge."
 *
 * KNOWN GAP, disclosed in this task's report: `ExitDefSlice.blockedText`
 * has no way to attach its own `advanceClock` — only a passable exit's
 * `minutes` does that (`move.ts`'s `applyExitTraversal`/`renderBlocked`).
 * The doc's own `advanceClock: 120` for this specific block cannot be
 * applied through this mechanism; the turn costs only the ordinary
 * per-turn default instead of the full two hours.
 */
const TUNNEL_APPROACH_GATE_BLOCKED_TEXT =
  'An hour out along the posts, and the bend, and the hardstand, and a steel plate\nlying in a concrete kerb with a keyhole in it and two lifting eyes.\n\nYou put your hands on it, which is what hands are for and is the whole of what\nthey can do here, and then you spend the second hour of the afternoon walking\nback for something that will turn or something that will lever.';

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
    // D4 task A amendment (§3, §21.1, §21.4; register 90) — the tunnel's
    // town-side country exit, now real: `to: ACT3_TUNNEL_MOUTH` (the
    // mouth, its own room — register 90 revises the tunnel into two rooms),
    // gated on `act2_knows_tunnel_mouth` AND `act2_started` (ADR 0011 rule
    // 3), 60 minutes. `TOWN_EDGE_TUNNEL_BOUNDARY_GATE` (D3's own
    // permanently-closed stand-in) is retired in this same change —
    // `ACT3_TUNNEL_APPROACH_GATE` is the real gate now, §3.4's own block.
    {
      dir: 'nw',
      to: ACT3_TUNNEL_MOUTH,
      when: { all: [{ flag: ACT2_KNOWS_TUNNEL_MOUTH }, { flag: ACT2_STARTED }] },
      door: ACT3_TUNNEL_APPROACH_GATE,
      blockedText: TUNNEL_APPROACH_GATE_BLOCKED_TEXT,
      travelText: tunnelApproachTravelText,
      minutes: 60,
    },
    ...otherDirections,
  ],
  handlers: roomHandlers,
};

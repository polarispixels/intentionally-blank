// The Arrowhead Motel
// (`docs/superpowers/specs/2026-09-05-act1-wave4-prose.md` PART ONE, §3, §5)
// — Zone 1 rooms 11-12 merged. Jack himself (`jack.ts`, a separate
// concurrent task's own module) is the NPC who greets the player here; this
// file owns only the room's own description, senses, room-specific
// responses, and exits.

import type { Cond } from '../../../engine/cond';
import type { ExitDefSlice, HandlerDef, RoomDefSlice } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { LISTEN, SLEEP, SMELL, WAIT } from './verbs';
import { CLUE_HIRED, FLAG_MET_JACK, FLAG_VISITED_MOTEL, JACK, JACKS_MOTEL, JACKS_MOTEL_NO_EXIT_GATE, MAIN_STREET, MONSTER_TRUCK, V_LOOK_UP } from './ids';
import { ACT2_STARTED, V_ACT2_DRIVE_TO_PLANT } from '../act2/ids';
import { ACT2_DRIVE_TO_PLANT_EFFECTS } from '../act2/scripts';

// ---------------------------------------------------------------------------
// §3.1 — description
// ---------------------------------------------------------------------------

// R1 (who hired the player) lands here, in the description, not in Jack's
// own greeting — `NpcDefSlice.greeting` is plain `Prose` and cannot run an
// `Effect` (the same engine gap `pearl.ts`/`whitlock.ts`/`marlow.ts` already
// document for their own `met_*` flags), and a greeting rule keyed on
// `not met_jack` is structurally unreachable because the room's own
// `onEnter` has already set it by the time any greeting renders. A room
// description always renders, so `CLUE_HIRED` is granted by `onEnter`
// instead (below), and this text is the one slot no player can route
// around (§3.1's own note in the source doc).
const FIRST_SIGHT = [
  'Main Street stops being Main Street fifty yards past the library. The brick gives out and the kerb gives out, and what is left on this side is a strip of asphalt with a motel on it: eight doors under a walkway, an office with the blind down, and a sign on a post at the road, lit from inside.',
  '    THE ARROWHEAD\n    MOTEL\n    VACANCY',
  'The lot holds one vehicle. It is a pickup truck the way a barn is a shed, the tyres come to your chest, and it is the first vehicle you have seen anywhere in this town.',
  'Number four is open. Light behind the screen door, and a chair pulled round to face the lot, and the chair is empty, because the man who was in it is already halfway across the asphalt in his socks.',
  '"You didn\'t come." He says it well before he is near enough to say it quietly. "Nine o\'clock, twice a week, three weeks running, and last night you didn\'t come." Then he is close enough to see the side of your head, and stops walking. "Ah, hell."',
  'He has the screen door open before you have agreed to anything. "Come in. I paid you to find my brother and somebody\'s opened your head, and I would like those to be two different things."',
].join('\n\n');

const RETURN_VISIT =
  'Asphalt, the sign on its post, eight doors under a walkway, the truck backed in across four spaces. Number four open, light on. The road back into town is behind you.';

// D0 amendment — presence-and-passage prose document §2.3, transcribed
// exactly (hard rule 5). No first-sight variant (the shipped `FIRST_SIGHT`
// above is the scene where the player meets Jack and cannot fire after
// `act2_started`, since the ride north requires him) — `RETURN_VISIT` only.
// The truck is a state, not a schedule, so the two rules are distinguished
// by `objectAt`, not by time of day; both additionally gated on
// `act2_started` (the document's own wiring table).
const JACK_ABSENT: Cond = { not: { npcAt: [JACK, JACKS_MOTEL] } };

const MOTEL_TRUCK_PRESENT =
  'Asphalt, the sign on its post, eight doors under a walkway, the truck backed in across four spaces. Number four is shut, and the light behind the screen is on, because it is always on. The chair faces the lot and has nobody in it. The road back into town is behind you.';

const MOTEL_TRUCK_GONE =
  'Asphalt, the sign on its post, eight doors under a walkway, and a gap in the middle of the lot the width of something that is not there. Number four is shut, and the light behind the screen is on, because it is always on. The chair faces the lot and has nobody in it. The road back into town is behind you.';

const description: ProseRule[] = [
  { when: { all: [{ flag: ACT2_STARTED }, JACK_ABSENT, { objectAt: [MONSTER_TRUCK, JACKS_MOTEL] }] }, text: MOTEL_TRUCK_PRESENT },
  { when: { all: [{ flag: ACT2_STARTED }, JACK_ABSENT] }, text: MOTEL_TRUCK_GONE },
  { when: { not: { flag: FLAG_VISITED_MOTEL } }, text: FIRST_SIGHT },
  { text: RETURN_VISIT },
];

// ---------------------------------------------------------------------------
// §3.2 — room-level senses
// ---------------------------------------------------------------------------

const smell = "Cold asphalt and diesel. From the open door, coffee made in a motel machine, which is a different smell from the diner's and is not trying to be.";

const listen =
  'An ice machine at the far end of the walkway, working through something, stopping, starting again. Nothing on the road. Inside number four, a television turned down to nothing, left on for the light it makes.';

// No stars (§12.2 — Main Street and Town Edge have both spent the sky).
const lookUp =
  'Corrugated roof over the walkway, and a strip light with three summers of insects in the bottom of it. Nobody has been up there to look, which is how you can tell.';

// ---------------------------------------------------------------------------
// §5 — room-specific responses. No `WHAT YEAR IS IT`, no `WHO AM I`, no
// `THINK`/`REMEMBER`, no `SHOUT`/`HELLO` override, no `COUNT` response —
// §12.2's anti-repetition register rules all five out for this room; none
// are added here.
// ---------------------------------------------------------------------------

const waitText = 'You wait. Jack talks. The ice machine gets to the end of whatever it is doing and starts again.';

// The fifth SLEEP in the game and the first one a person answers — no
// refusal clause (§5's own note; a fourth "...and you do not" would be a
// catchphrase per §12.2).
const sleepText =
  '"Four\'s got two beds, and five\'s empty and paid through Sunday." Jack has the answer out before you have finished asking. "Either. Neither. There\'s no wrong one."';

const roomHandlers: HandlerDef[] = [
  { verbs: [SMELL], effects: [{ say: smell }] },
  { verbs: [LISTEN], effects: [{ say: listen }] },
  { verbs: [V_LOOK_UP], effects: [{ say: lookUp }] },
  { verbs: [WAIT], effects: [{ say: waitText }] },
  { verbs: [SLEEP], effects: [{ say: sleepText }] },
  // D1 amendment — the boundary's second route (§21), with the truck present.
  { verbs: [V_ACT2_DRIVE_TO_PLANT], when: { objectAt: [MONSTER_TRUCK, JACKS_MOTEL] }, effects: ACT2_DRIVE_TO_PLANT_EFFECTS },
];

const onEnter: RoomDefSlice['onEnter'] = [
  { effects: [{ set: [FLAG_VISITED_MOTEL, true] }, { set: [FLAG_MET_JACK, true] }, { grantClue: CLUE_HIRED }] },
];

const travelTextOut = 'The asphalt gives out and the kerb starts again, and behind you the light in number four stays on.';

// §5's "every other direction — in-world, not the build boundary."
const noOtherExitText = 'Seven other doors, all shut, and the office shut with them. Past the end of the walkway there is dark and then there is the county. The road back into town is the way you came.';

// "leave"/"exit" are already `out`'s own words; "back" is already `in`'s —
// so both `out` and `in` are pointed at Main Street here (same idiom
// `townEdge.ts`'s own header documents for its own `s`/`out`/`in` trio).
const otherDirections: ExitDefSlice[] = (['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'up', 'down'] as const).map((dir) => ({
  dir,
  to: JACKS_MOTEL,
  door: JACKS_MOTEL_NO_EXIT_GATE,
  blockedText: noOtherExitText,
}));

export const jacksMotelRoom: RoomDefSlice = {
  // The brief's own display name is "The Arrowhead Motel" — the leading
  // "The" is dropped here (matching the established codebase convention:
  // no other room's own `RoomDefSlice.name`/`aliases` carries one either,
  // e.g. `sundownDinerRoom.name` is 'Sundown Diner', not "The Sundown
  // Diner", even though its own window prose reads "THE SUNDOWN"). `name`
  // is compiled as a literal `GO TO`/bare-room-alias vocabulary key
  // (`interpreter.ts`'s `roomAliases`) against noise-stripped input tokens
  // — a stored phrase containing "the"/"a"/etc. can never be typed back in
  // and matched (`validate.ts`'s `noise-word-vocabulary` check, a hard
  // error). The full in-fiction name is unchanged and fully player-visible
  // — it is spelled out verbatim in the room's own arrival sign block
  // (§3.1's "THE ARROWHEAD / MOTEL / VACANCY").
  name: 'Arrowhead Motel',
  aliases: ['arrowhead motel', 'motel', 'arrowhead'],
  area: 'act1',
  // Main Street sits at {x:1,y:2} (`mainStreet.ts`) — this room's own real
  // exit back is `sw`, so it sits northeast of Main Street: {x:2,y:2},
  // clear of every other declared room's own coordinates (grepped `map:`
  // across this directory first).
  map: { x: 2, y: 2 },
  description,
  onEnter,
  exits: [
    { dir: 'sw', to: MAIN_STREET, travelText: travelTextOut },
    { dir: 'out', to: MAIN_STREET, travelText: travelTextOut },
    // KNOWN TRADE-OFF (this task's own report): mapping `in` here is what
    // makes bare "back" reach Main Street (§5's exits table) — but `in`'s
    // own words also include "inside"/"enter"/"go through"/"get in"
    // (`verbs.ts`), and a bare direction (no dobj at all) is dispatched by
    // `move.ts`'s own traversal before any object handler for the same
    // verb id ever runs. The engine has no way to tell which literal
    // synonym of one `VerbId` a player typed once it has collapsed to a
    // dobj-less action (a pervasive, already-documented limitation
    // elsewhere in this codebase — see e.g. `objects/sundownDiner.ts`'s own
    // "buy pie" note). So bare "go inside"/"enter"/"inside" ALSO leave to
    // Main Street here, rather than reaching `motel_unit`'s own interior
    // text (§4.2) — only the doc's other two phrasings for that response,
    // "enter room" and "open screen door" (both dobj-qualified), still
    // reach it. Bare "back" (§5's own exits table) was judged the more
    // load-bearing of the two and kept.
    { dir: 'in', to: MAIN_STREET, travelText: travelTextOut },
    ...otherDirections,
  ],
  handlers: roomHandlers,
};

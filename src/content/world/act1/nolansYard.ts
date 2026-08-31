// Nolan's Yard
// (`docs/superpowers/specs/2026-09-06-act1-wave5-close-out-prose.md` PART
// ONE, §3, §5.2, §6) — Zone 1 room 13, east of Town Edge. P6 (the trash
// puzzle) lives on `nolan_bin` (`objects/nolansYard.ts`); this file owns the
// room shell, its four `world.events`, and the exits.
//
// EVENT ORDER (this task's report — see `ids.ts`'s own comment on
// `FLAG_ALARM_TURNS`): `tick.ts`'s `fireEvents` iterates `world.events` in
// declaration order, threading state so a later event in the SAME tick sees
// an earlier one's effects. `yardLightOff`/`yardDogSettles` are declared
// BEFORE `yardAlarmTurnsInc` so each turn's threshold check runs against
// last turn's count, and the increment (last) only adds for the NEXT tick's
// check — this is what makes the soft fail's own turn end at `alarm_turns
// === 1` rather than jumping straight past the light-off threshold on the
// very turn the alarm is raised. Worked through turn-by-turn against a
// `WAIT` sequence in this task's own test file.
//
// `alarm_turns`'s incrementing `EventDef`'s own `when` is `{ all: [{ flag:
// alarm_raised }, { not: { flag: dog_settled } }] }`, not the main-session
// ruling's literal `{ flag: porch_light_on }`: the literal condition stops
// the counter dead the instant `yardLightOff` clears `porch_light_on` (this
// event's own gate is ALSO `porch_light_on`), so it can never climb from 2
// to the dog-settle threshold of 4 — the puzzle would softlock the S/C
// routes' own "just wait it out" path. The condition used here still
// satisfies the ruling's stated intent ("the light times out even if the
// player walks away", no `onlyIfWitnessed`) and keeps counting until the
// dog actually settles.

import type { Cond } from '../../../engine/cond';
import type { EventDef, ExitDefSlice, HandlerDef, RoomDefSlice } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { HELLO, LISTEN, SMELL, WAIT, YELL } from './verbs';
import {
  EVENT_YARD_ALARM_TURNS_INC,
  EVENT_YARD_DOG_SETTLES,
  EVENT_YARD_JACK_COVERING_CLEARS,
  EVENT_YARD_LIGHT_OFF,
  FLAG_ALARM_RAISED,
  FLAG_ALARM_TURNS,
  FLAG_DOG_SETTLED,
  FLAG_JACK_COVERING,
  FLAG_PORCH_LIGHT_ON,
  FLAG_VISITED_NOLANS_YARD,
  NOLANS_YARD,
  NOLANS_YARD_NO_EXIT_GATE,
  TOWN_EDGE,
  V_LOOK_UP,
} from './ids';

// ---------------------------------------------------------------------------
// §3.1 — description
// ---------------------------------------------------------------------------

const JACK_COVERING_TEXT =
  'The truck is round at the front of the house with its engine up, and every window on this side has gone the colour of headlamps. The porch light is on and nobody is looking at the yard. The dog is down at the far fence, shouting at five tons of noise, entirely happy.\n\nThe bin is at the kerb, and nobody in this county can hear you.';

const FIRST_SIGHT =
  'Past the shed the kerb gives up and the county starts. Nolan\'s house stands back off the road behind a chain-link fence: one storey, dark, a porch with two steps and a light over the door that is not on. Down the side of it an alley runs back toward the rear of the buildings on Main Street.\n\nThe bin is out at the kerb, squared up to the road. Morning is not for hours and it is already waiting.\n\nSomething in the yard stands up when you stop walking. It does not bark. It comes to the inside of the gate at a trot, puts its chest against the wire, and looks at you with its whole body — and out in the grass behind it there is a chain lying with nothing on the end of it.\n\nIt is very quiet out here. The loudest thing in the yard is the dog breathing, and it is going quite fast.';

const RETURN_VISIT = 'The fence, the gate, the dark house, the bin at the kerb. The alley goes back along the side. The road into town is west of you.';

const description: ProseRule[] = [
  { when: { flag: FLAG_JACK_COVERING }, text: JACK_COVERING_TEXT },
  { when: { not: { flag: FLAG_VISITED_NOLANS_YARD } }, text: FIRST_SIGHT },
  { text: RETURN_VISIT },
];

// ---------------------------------------------------------------------------
// §3.2 — room-level senses
// ---------------------------------------------------------------------------

const smell = 'Cold grass and dew on a metal lid, and — only when the wind turns — the inside of the bin, which at this temperature is being discreet about itself.';

const listen = 'The dog, breathing. Inside the house a refrigerator gets to the end of a cycle and stops, and the house is quieter afterwards than it was before it started.';

const lookUp = 'The porch light sits in a wire cage under the eave, and the underside of the eave has been painted in the last year or two by somebody who cut in around the cage rather than take it down.';

// ---------------------------------------------------------------------------
// §6 — room-specific responses
// ---------------------------------------------------------------------------

const waitText: ProseRule[] = [
  { when: { flag: FLAG_PORCH_LIGHT_ON }, text: 'You wait. The light stays on. Somewhere inside the house a floorboard is used once and not used again.' },
  { text: 'You wait. The dog watches you wait and finds it excellent.' },
];

const shoutText = 'There is a dog eight feet away who would love that and a man thirty feet away who would not. You keep it.';

const roomHandlers: HandlerDef[] = [
  { verbs: [SMELL], effects: [{ say: smell }] },
  { verbs: [LISTEN], effects: [{ say: listen }] },
  { verbs: [V_LOOK_UP], effects: [{ say: lookUp }] },
  { verbs: [WAIT], effects: [{ say: waitText }] },
  // "SHOUT"/"YELL"/"HELLO" (no target) — §6's own instruction; overrides
  // other rooms' bare HELLO/YELL while in this room (same idiom as Town
  // Edge's own `shoutText` handler). No `WHAT YEAR IS IT`/`COUNT`/`THINK`/
  // `REMEMBER`/`SLEEP` response is declared here at all — §17.2's register
  // (all five fall to the global families, per this wave's own ruling).
  { verbs: [YELL, HELLO], effects: [{ say: shoutText }] },
];

const onEnter: RoomDefSlice['onEnter'] = [{ effects: [{ set: [FLAG_VISITED_NOLANS_YARD, true] }] }];

// ---------------------------------------------------------------------------
// Exits (§6's table)
// ---------------------------------------------------------------------------

const travelTextOut = 'Past the end of the shed the ground goes hard again, and you are standing at the end of the street with the wind back on you.';

const noOtherExitText = 'North of the house is county and south of it is county. The alley you can look down. The way back is west, past the shed.';

const otherDirections: ExitDefSlice[] = (['n', 's', 'e', 'ne', 'nw', 'se', 'sw', 'up', 'down'] as const).map((dir) => ({
  dir,
  to: NOLANS_YARD,
  door: NOLANS_YARD_NO_EXIT_GATE,
  blockedText: noOtherExitText,
}));

export const nolansYardRoom: RoomDefSlice = {
  name: "Nolan's Yard",
  area: 'act1',
  // East of Town Edge ({x:1,y:3}, `townEdge.ts`) — {x:2,y:3}, matching
  // `TOWN_EDGE_OBJECTS`'s own east-of-the-street idiom (checked for
  // collisions against every other room's own `map:` in this directory).
  map: { x: 2, y: 3 },
  description,
  onEnter,
  exits: [
    // "west"/"out"/"back"/"leave" (§6's exits table) all reach Town Edge —
    // same three-`Direction`-ids-one-destination idiom `townEdge.ts`'s own
    // `s`/`out`/`in` trio uses for its own return leg ("back"/"enter"/"go
    // through"/"get in" are `in`'s own global words; "leave"/"exit" are
    // `out`'s).
    { dir: 'w', to: TOWN_EDGE, travelText: travelTextOut },
    { dir: 'out', to: TOWN_EDGE, travelText: travelTextOut },
    { dir: 'in', to: TOWN_EDGE, travelText: travelTextOut },
    ...otherDirections,
  ],
  handlers: roomHandlers,
};

// ---------------------------------------------------------------------------
// §5.2 — the two witnessed timeout events, plus the two mechanism events
// this room's own wiring needs (§18 items 1-2; main-session rulings 2-3).
// ---------------------------------------------------------------------------

const WITNESSED_IN_YARD: Cond = { at: NOLANS_YARD };

/** Event 1 — the porch light times out. Declared before the increment (see this file's own header). */
const yardLightOff: EventDef = {
  id: EVENT_YARD_LIGHT_OFF,
  once: false,
  when: { all: [{ flag: FLAG_PORCH_LIGHT_ON }, { flag: FLAG_ALARM_TURNS, atLeast: 2 }] },
  onlyIfWitnessed: true,
  witnessedWhen: WITNESSED_IN_YARD,
  effects: [{ say: 'The porch light goes off by itself, the way it came on. The dark comes back in over the steps and the window is a window again.' }, { set: [FLAG_PORCH_LIGHT_ON, false] }],
};

/** Event 2 — the dog settles. Declared before the increment (see this file's own header). */
const yardDogSettles: EventDef = {
  id: EVENT_YARD_DOG_SETTLES,
  once: false,
  when: { all: [{ flag: FLAG_ALARM_RAISED }, { not: { flag: FLAG_DOG_SETTLED } }, { flag: FLAG_ALARM_TURNS, atLeast: 4 }] },
  onlyIfWitnessed: true,
  witnessedWhen: WITNESSED_IN_YARD,
  effects: [
    { say: 'The dog runs out of things to say about you in stages, and then goes back to wherever it sleeps, which turns out to be under the porch, in a hollow it has plainly been maintaining for years.' },
    { set: [FLAG_DOG_SETTLED, true] },
  ],
};

/**
 * Event 3 (§18 item 1 / main-session ruling 2) — `alarm_turns`'s own
 * counter. `onlyIfWitnessed` is deliberately absent ("runs anywhere ...
 * so the light times out even if the player walks away"). See this file's
 * own header for why the `when` differs from the ruling's literal text.
 */
const yardAlarmTurnsInc: EventDef = {
  id: EVENT_YARD_ALARM_TURNS_INC,
  once: false,
  when: { all: [{ flag: FLAG_ALARM_RAISED }, { not: { flag: FLAG_DOG_SETTLED } }] },
  effects: [{ inc: FLAG_ALARM_TURNS }],
};

/** Event 4 (main-session ruling 3) — `jack_covering` clears silently the first turn the player is not in the yard. Jack is never moved (P8 needs him at the motel). */
const yardJackCoveringClears: EventDef = {
  id: EVENT_YARD_JACK_COVERING_CLEARS,
  once: false,
  when: { all: [{ flag: FLAG_JACK_COVERING }, { not: WITNESSED_IN_YARD }] },
  effects: [{ set: [FLAG_JACK_COVERING, false] }],
};

export const NOLANS_YARD_EVENTS: Record<string, EventDef> = {
  [EVENT_YARD_LIGHT_OFF]: yardLightOff,
  [EVENT_YARD_DOG_SETTLES]: yardDogSettles,
  [EVENT_YARD_ALARM_TURNS_INC]: yardAlarmTurnsInc,
  [EVENT_YARD_JACK_COVERING_CLEARS]: yardJackCoveringClears,
};

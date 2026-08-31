// Act III, Wave D3 — task A's route (c) script (below) and task C's own
// boundary/elevator scripts (bottom of file). Not one of the plan's named
// "shared files" (`ids.ts`/`knowledge.ts`/`verbs.ts`/`index.ts`), but both
// tasks independently created `act3/scripts.ts` and raced — re-read on
// conflict, same as the named shared files.
//
// Task A — P16 route (c)'s script: the fence beats, with
// M20-D granted explicitly between beats 3 and 4
// (`docs/superpowers/specs/2026-09-11-stage-d3-prose.md` §5.3, ruling 3).
// Same idiom as `act2/travel.ts`'s `act2Travel`: hand-built `kind: 'beat'`
// events (`say` always renders `kind: 'prose'`), so pacing a scene like
// this means constructing the events directly and interleaving effects
// between them rather than passing one flat `Effect[]` to a single
// `apply()` call.
//
// Every string below is transcribed verbatim from the prose doc's §5.3
// (hard rule 5).

import { apply } from '../../../engine/effects';
import type { Effect } from '../../../engine/effects';
import type { GameEvent, ScriptFn } from '../../../engine/world';
import type { RoomId } from '../../../engine/ids';
import { ACT2_Q_INSIDE_THE_PLANT } from '../act2/ids';
import {
  ACT3_ALERTNESS,
  ACT3_COOLING_PLANT,
  ACT3_GATE_DOOR,
  ACT3_INSIDE,
  ACT3_MEM_M20D,
  ACT3_RODE_FENCE,
  // D4 task B (§12.1) — the ride script's own real destinations.
  ACT3_S1_MECHANICAL_GALLERY,
  ACT3_S5_REACTOR_INTERFACE,
} from './ids';

const BEAT_1 =
  'Jack does not say anything clever. He backs the truck up the perimeter road\nabout two hundred yards, which is further than he needs, and it is the\ndistance of a man who has thought about this in bed.\n\n"Wire\'ll go," he says. "It\'s the posts you feel. Hold the handle above the\ndoor and don\'t hold the dash."';

const BEAT_2 =
  'And then he does not do it fast, which is the part you will keep.\n\nHe comes at the fence at the speed of a man reversing a trailer, in second,\nwith his hands at the top of the wheel, and the front of the truck takes the\nmesh, and the mesh takes two posts out of the ground with a noise like a piano\nbeing carried badly downstairs.\n\nThen the noise is behind you and the truck is on grass and then on concrete\nand Jack is braking gently, the way you brake in a car park.';

const BEAT_3 =
  'He stops in the middle of the apron with the engine running and the pair of\nyou sit there.\n\nThe light on the pole goes round. Down at the plant end the steam goes on\ngoing up and away sideways. A length of mesh is folded back over the near\nwing of the truck and one of the posts is still hooked into it, going along\nfor the ride.\n\nNothing comes. Nothing sounds. Nothing anywhere in the whole lit quarter mile\nalters by one degree.\n\n"Huh," says Jack.';

const BEAT_4 =
  "He drives the last of it at walking pace, past the painted bays, down to the\nplant end, and puts the truck round the corner of the building out of the\nlight, which he does without discussing it.\n\nThe yard door there is steel with a reader beside it and a rubber mat in\nfront of it that has had a great deal of use. It is not locked from this side\nin any way that matters, because the building's opinion about doors is that\nthe fence has already dealt with all this.";

/**
 * `act3_ram_fence` — route (c)'s whole sequence: beats 1-3, then M20-D
 * granted explicitly (ruling 3 — the ambient `trigger` on the memory's own
 * def, `act3/knowledge.ts`, is a documented backstop only),
 * `act3_rode_fence`/`act3_inside` set, alertness set to 1 (permanent, not `inc` — a
 * fixed value regardless of any later D5 increment), the P16 question
 * answered, the gate door left open for a later plain `NORTH`/`IN`, beat 4,
 * then `goto` the Cooling Plant.
 */
export const act3RamFence: ScriptFn = (world, state) => {
  const beat = (text: string): GameEvent => ({ type: 'line', kind: 'beat', text });

  const midEffects: Effect[] = [
    { set: [ACT3_RODE_FENCE, true] },
    { grantMemory: ACT3_MEM_M20D },
    { set: [ACT3_ALERTNESS, 1] },
    { set: [ACT3_INSIDE, true] },
    { answerQuestion: ACT2_Q_INSIDE_THE_PLANT },
    { setState: [ACT3_GATE_DOOR, 'open', true] },
  ];
  const mid = apply(world, state, midEffects, { path: 'script.act3_ram_fence.mid' });

  const tail = apply(world, mid.state, [{ goto: ACT3_COOLING_PLANT }], { path: 'script.act3_ram_fence.tail' });

  return {
    state: tail.state,
    events: [beat(BEAT_1), beat(BEAT_2), beat(BEAT_3), ...mid.events, beat(BEAT_4), ...tail.events],
  };
};

// ---------------------------------------------------------------------------
// Task C — the boundary (§15) and the freight elevator's ride (§13.8). Same
// "`{ script }` effect, not a plain `{ say }`, so the emitted `GameEvent` can
// carry `kind: 'system'`" idiom `act2/scripts.ts` uses for D1/D2's own
// boundary (`{ say }` always renders `kind: 'prose'`, `effects.ts`'s
// `applyOne`).
// ---------------------------------------------------------------------------

import { ACT3_ELEVATOR_RIDE_SCRIPT } from './ids';

// D4 task D note: this D3 system line (naming Sublevel 1, Sublevel 5, the
// service tunnel and the pipe chase as not-yet-built) and the `act3Boundary`
// script below are RETIRED for the chase hatch's own `down`/"ENTER HATCH"
// route (`objects/coolingPlant.ts`'s own D4 amendment no longer calls this
// script — it `goto`s the real Pipe Chase now, per D4 §12.3/§21.1). D4's
// own single surviving boundary lives at the Pipe Chase's own `down` exit
// instead (`pipeChase.ts`'s own `CHASE_BOUNDARY_TEXT`, D4 §13), reached
// through `ExitDefSlice.blockedText` rather than this script (bare "DOWN"
// there can never reach a `{ script }` effect at all — see that file's own
// header). NOT deleted here: the lift's S1/S5 ride (`act3ElevatorRide`,
// below) and Town Edge's country exit may still call this mid-wave, pending
// those builders' own D4 amendments (§21.1: the lift's beats/Town Edge's
// `nw` both need to stop calling this too, once their own destinations are
// real rooms). Flagged in this task's report; the main session removes
// this once nothing references it.
//
// §15's system line — reached from the chase hatch's `down`/"ENTER HATCH"
// (an object handler, `objects/coolingPlant.ts` — a real `{ script }`
// effect there), the lift's S1/S5 (below), and Town Edge's country exit
// (`act1/objects/townEdge.ts`, this task's own amendment — the same "ENGINE
// GAP" approximation this file's own header documents for exits).
// §13.8 — three beats (the MVP prologue's/`act2_travel`'s own idiom: hand-
// built `kind: 'beat'` events, since `say` cannot produce them), `advanceClock:
// 3`, unchanged from D3.
const RIDE_BEATS: string[] = [
  'The leaves take their time about closing. The car takes its time about\nstarting.',
  'It goes down the way freight goes down, without any interest in whether you\nare enjoying it, and the bulb behind its cage shakes very slightly the whole\nway.\n\nThere is time to read the inspection certificate. There is then time to read\nit again.',
  'And then there is time to notice that a building with five floors under it and\na plant deck on top is not a building that ought to take this long to get to\nthe bottom of — and to arrive at *it is only a slow lift*, and to be very\nnearly satisfied with that.\n\nThe car settles. The leaves start.',
];

// D4 task B, §12.1/§21.1: D3's own boundary tail (`act3Boundary`, above) is
// retired for this script — each destination now really moves the player
// (`{ goto }`), and S1/S5 each add their own beat 4 first. `args.dest` is
// the destination room, passed by `elevator.ts`'s own per-floor button
// handlers (`FLOOR_ROOM`); a destination not in `BEAT4_BY_DEST` (the L
// stop) gets no beat 4, matching the doc's own "each destination [S1/S5]
// adds beat 4" — L had no boundary in D3 and gains no new beat here either.
// This task's own report flags that `act3Boundary`/`ACT3_BOUNDARY_TEXT`/
// `ACT3_BOUNDARY_SCRIPT` are deliberately NOT deleted from this file: Town
// Edge's `nw` exit (task A) and the chase hatch's `DOWN` (task D) may still
// reference them — retiring those call sites is those tasks' own work.
const S1_BEAT_4 =
  'The leaves go back on a gallery lit like an office, with pumps down one wall\nand a mesh crib down the other and cool air that smells of nothing.';
const S5_BEAT_4 =
  'The leaves go back on quiet.\n\nNot silence — there is a note in it, low, that you get in the back of the jaw\nbefore the ear — but after the hall and the plant it reads as quiet, and the\ngallery in front of you is lit and long and nobody is standing in it.';

const BEAT4_BY_DEST: Partial<Record<string, string>> = {
  [ACT3_S1_MECHANICAL_GALLERY]: S1_BEAT_4,
  [ACT3_S5_REACTOR_INTERFACE]: S5_BEAT_4,
};

export const act3ElevatorRide: ScriptFn = (world, state, args) => {
  const dest = (args?.dest as RoomId | undefined) ?? ACT3_COOLING_PLANT;
  const beatEvents: GameEvent[] = RIDE_BEATS.map((text) => ({ type: 'line', kind: 'beat', text }));
  const advanced = apply(world, state, [{ advanceClock: 3 }], { path: 'script.act3_elevator_ride' });
  const beat4 = BEAT4_BY_DEST[dest];
  const beat4Events: GameEvent[] = beat4 !== undefined ? [{ type: 'line', kind: 'beat', text: beat4 }] : [];
  const moved = apply(world, advanced.state, [{ goto: dest }], { path: 'script.act3_elevator_ride.goto' });
  return { state: moved.state, events: [...beatEvents, ...advanced.events, ...beat4Events, ...moved.events] };
};

// §11.6 — reader B4's rotation. `Cond` has no modulo primitive (`engine/
// cond.ts`), so parity is resolved here rather than as a declarative `when`:
// increments `act3_reader_b4_rotation`, then renders the odd/even text.
// Starts at 0, so the FIRST ask (rotation becomes 1, odd) fails and the
// second (becomes 2, even) succeeds — deliberate (§18 q10, §21.3).
import { ACT3_READER_B4_ROTATION, ACT3_READER_B4_SCRIPT } from './ids';
import { flag } from '../../../engine/cond';

const READER_B4_SUCCESS_TEXT = 'Green, the lock lets go with a knock you feel in the door leaf, and you are\nthrough.';
const READER_B4_FAIL_TEXT =
  'The diode goes amber, and then goes out, and the lock does not let go.\n\nNo display. No beep. No second light. No reason. It has declined, and there is\nnothing on it anywhere to appeal to.\n\nAsk it again.';

export const act3ReaderB4: ScriptFn = (world, state) => {
  const incremented = apply(world, state, [{ inc: ACT3_READER_B4_ROTATION }], { path: 'script.act3_reader_b4' });
  const rotation = flag(world, incremented.state, ACT3_READER_B4_ROTATION);
  const even = typeof rotation === 'number' && rotation % 2 === 0;
  const said = apply(world, incremented.state, [{ say: even ? READER_B4_SUCCESS_TEXT : READER_B4_FAIL_TEXT }], {
    path: 'script.act3_reader_b4.result',
  });
  return { state: said.state, events: [...incremented.events, ...said.events] };
};

export { ACT3_ELEVATOR_RIDE_SCRIPT, ACT3_READER_B4_SCRIPT };

// ---------------------------------------------------------------------------
// D4 task C — S5 Reactor Interface, the interlock death, and the checkpoint
// (D4 prose doc §9.9, §10.2-§10.3, §21.3). Own heading; every export above
// is a sibling task's, untouched.
// ---------------------------------------------------------------------------

import { INTERLOCK_BEATS, INTERLOCK_DEATH_TEXT } from './objects/s5ReactorInterface';
import { ACT3_DEATH_REACTOR, ACT3_DIED_REACTOR, ACT3_INTERLOCK_DEATH_SCRIPT, ACT3_READ_CLOCK_SCRIPT, ACT3_READ_GAUGES_NIGHT } from './ids';
import { clockInWords } from './time';

/**
 * §10.2/§10.3 — the game's first death. §0's own convention: fenced blocks
 * under a "Beat n" heading are `kind: 'beat'` events (the three beats,
 * `INTERLOCK_BEATS`, `objects/s5ReactorInterface.ts`); the death paragraph
 * itself is not under a "Beat n" heading, so it renders as an ordinary
 * `say`, followed by `{ die }` and `{ set: [act3_died_reactor, true] }` —
 * the prologue's own idiom (`content/scenes/mvp-prologue.ts`'s own THE
 * ARREST: beats, then `apply(..., [{ say }, { die }], ...)`).
 */
export const act3InterlockDeath: ScriptFn = (world, state) => {
  const beat = (text: string): GameEvent => ({ type: 'line', kind: 'beat', text });
  const result = apply(
    world,
    state,
    [{ say: INTERLOCK_DEATH_TEXT }, { die: ACT3_DEATH_REACTOR }, { set: [ACT3_DIED_REACTOR, true] }],
    { path: 'script.act3_interlock_death' },
  );
  return { state: result.state, events: [...INTERLOCK_BEATS.map(beat), ...result.events] };
};

/**
 * §9.9 — `READ CLOCK`/`WHAT TIME IS IT`/`CHECK TIME`: the frame (computed
 * from the live clock — no static `Prose` can hold this), the rotating
 * second line (`say`'s own `string[]` rotation, `state.counters`-backed, so
 * it genuinely rotates "in order" across turns), and the added final line,
 * once, in the window, before the gauges have been read at night.
 */
const CLOCK_ROTATING_LINES: string[] = [
  'The second hand goes round.',
  'It is the same clock as the one in the diner and the one over the sheriff\'s\ndoor, which is to say it is a clock.',
  'Nothing else in the room agrees to have an opinion about that.',
];

const CLOCK_WINDOW_LINE =
  'Which is a time at which a man with a job would be asleep, and a wall of\ngauges would be doing whatever it does when nobody is looking at it.';

export const act3ReadClock: ScriptFn = (world, state) => {
  const frameText = `The hands say ${clockInWords(state.clock.minute)}.`;
  const result = apply(
    world,
    state,
    [
      { say: frameText },
      { say: CLOCK_ROTATING_LINES },
      {
        if: {
          when: { all: [{ clock: { after: 60, before: 240 } }, { not: { flag: ACT3_READ_GAUGES_NIGHT } }] },
          then: [{ say: CLOCK_WINDOW_LINE }],
        },
      },
    ],
    { path: 'script.act3_read_clock' },
  );
  return result;
};

export { ACT3_INTERLOCK_DEATH_SCRIPT, ACT3_READ_CLOCK_SCRIPT };

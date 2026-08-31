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
import { ACT2_Q_INSIDE_THE_PLANT } from '../act2/ids';
import { ACT3_ALERTNESS, ACT3_COOLING_PLANT, ACT3_GATE_DOOR, ACT3_INSIDE, ACT3_MEM_M20D, ACT3_RODE_FENCE } from './ids';

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

import { ACT3_BOUNDARY_SCRIPT, ACT3_ELEVATOR_RIDE_SCRIPT } from './ids';

// §15's system line — reached from the chase hatch's `down`/"ENTER HATCH"
// (an object handler, `objects/coolingPlant.ts` — a real `{ script }`
// effect there), the lift's S1/S5 (below), and Town Edge's country exit
// (`act1/objects/townEdge.ts`, this task's own amendment — the same "ENGINE
// GAP" approximation this file's own header documents for exits).
export const ACT3_BOUNDARY_TEXT =
  'END OF BUILD\n\nAct III continues below this floor. Sublevel 1, Sublevel 5, the service tunnel and the pipe chase are not in this version.';

export const act3Boundary: ScriptFn = (_world, state) => ({
  state,
  events: [{ type: 'line', kind: 'system', text: ACT3_BOUNDARY_TEXT }],
});

// §13.8 — three beats (the MVP prologue's/`act2_travel`'s own idiom: hand-
// built `kind: 'beat'` events, since `say` cannot produce them), `advanceClock:
// 3`, then the boundary. No `goto` (§13.8's own text: "the player is returned
// to the room he called it from; no additional text" — i.e. never actually
// moved in the first place).
const RIDE_BEATS: string[] = [
  'The leaves take their time about closing. The car takes its time about\nstarting.',
  'It goes down the way freight goes down, without any interest in whether you\nare enjoying it, and the bulb behind its cage shakes very slightly the whole\nway.\n\nThere is time to read the inspection certificate. There is then time to read\nit again.',
  'And then there is time to notice that a building with five floors under it and\na plant deck on top is not a building that ought to take this long to get to\nthe bottom of — and to arrive at *it is only a slow lift*, and to be very\nnearly satisfied with that.\n\nThe car settles. The leaves start.',
];

export const act3ElevatorRide: ScriptFn = (world, state) => {
  const beatEvents: GameEvent[] = RIDE_BEATS.map((text) => ({ type: 'line', kind: 'beat', text }));
  const applied = apply(world, state, [{ advanceClock: 3 }], { path: 'script.act3_elevator_ride' });
  const boundary = act3Boundary(world, applied.state);
  return { state: boundary.state, events: [...beatEvents, ...applied.events, ...boundary.events] };
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

export { ACT3_BOUNDARY_SCRIPT, ACT3_ELEVATOR_RIDE_SCRIPT, ACT3_READER_B4_SCRIPT };

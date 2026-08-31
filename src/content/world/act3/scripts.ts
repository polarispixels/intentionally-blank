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
import type { GameEvent, GameState, ScriptFn, WorldDef } from '../../../engine/world';
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
  'Jack does not say anything clever. He backs the truck up the perimeter road about two hundred yards, which is further than he needs, and it is the distance of a man who has thought about this in bed.\n\n"Wire\'ll go," he says. "It\'s the posts you feel. Hold the handle above the door and don\'t hold the dash."';

const BEAT_2 =
  'And then he does not do it fast, which is the part you will keep.\n\nHe comes at the fence at the speed of a man reversing a trailer, in second, with his hands at the top of the wheel, and the front of the truck takes the mesh, and the mesh takes two posts out of the ground with a noise like a piano being carried badly downstairs.\n\nThen the noise is behind you and the truck is on grass and then on concrete and Jack is braking gently, the way you brake in a car park.';

const BEAT_3 =
  'He stops in the middle of the apron with the engine running and the pair of you sit there.\n\nThe light on the pole goes round. Down at the plant end the steam goes on going up and away sideways. A length of mesh is folded back over the near wing of the truck and one of the posts is still hooked into it, going along for the ride.\n\nNothing comes. Nothing sounds. Nothing anywhere in the whole lit quarter mile alters by one degree.\n\n"Huh," says Jack.';

const BEAT_4 =
  "He drives the last of it at walking pace, past the painted bays, down to the plant end, and puts the truck round the corner of the building out of the light, which he does without discussing it.\n\nThe yard door there is steel with a reader beside it and a rubber mat in front of it that has had a great deal of use. It is not locked from this side in any way that matters, because the building's opinion about doors is that the fence has already dealt with all this.";

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
  'The leaves take their time about closing. The car takes its time about starting.',
  'It goes down the way freight goes down, without any interest in whether you are enjoying it, and the bulb behind its cage shakes very slightly the whole way.\n\nThere is time to read the inspection certificate. There is then time to read it again.',
  'And then there is time to notice that a building with five floors under it and a plant deck on top is not a building that ought to take this long to get to the bottom of — and to arrive at *it is only a slow lift*, and to be very nearly satisfied with that.\n\nThe car settles. The leaves start.',
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
  'The leaves go back on a gallery lit like an office, with pumps down one wall and a mesh crib down the other and cool air that smells of nothing.';
const S5_BEAT_4 =
  'The leaves go back on quiet.\n\nNot silence — there is a note in it, low, that you get in the back of the jaw before the ear — but after the hall and the plant it reads as quiet, and the gallery in front of you is lit and long and nobody is standing in it.';

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

const READER_B4_SUCCESS_TEXT = 'Green, the lock lets go with a knock you feel in the door leaf, and you are through.';
const READER_B4_FAIL_TEXT =
  'The diode goes amber, and then goes out, and the lock does not let go.\n\nNo display. No beep. No second light. No reason. It has declined, and there is nothing on it anywhere to appeal to.\n\nAsk it again.';

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
  'It is the same clock as the one in the diner and the one over the sheriff\'s door, which is to say it is a clock.',
  'Nothing else in the room agrees to have an opinion about that.',
];

const CLOCK_WINDOW_LINE =
  'Which is a time at which a man with a job would be asleep, and a wall of gauges would be doing whatever it does when nobody is looking at it.';

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

// ---------------------------------------------------------------------------
// D5 task F — the Bay's own wall clock (§9.2). `clockInWords` is reused
// unchanged from `./time` (§35/§39.3: "do not write a second one"); the
// rotating second line is this room's own three, sharing no phrase with
// `CLOCK_ROTATING_LINES` above (§35's own note that the two rotations share
// nothing). No S5-style "window line" — the Bay's clock is a fact about
// the room, not a descent-timing tool (§9's own header).
// ---------------------------------------------------------------------------

const BAY_CLOCK_ROTATING_LINES: string[] = [
  'Nobody in this room is going to need that.',
  'It agrees with the one on Sublevel 5, which somebody has to have seen to.',
  'It is running, and it is the only thing on this floor that is doing anything you can watch.',
];

export const act3ReadBayClock: ScriptFn = (world, state) => {
  const frameText = `The hands say ${clockInWords(state.clock.minute)}.`;
  return apply(world, state, [{ say: frameText }, { say: BAY_CLOCK_ROTATING_LINES }], { path: 'script.act3_read_bay_clock' });
};

// ---------------------------------------------------------------------------
// D5 task G — the Archive Hub's login prompt (§22.2-§22.4). Two fields, in
// order (`user` then `password`); success/failure text and the field
// labels are transcribed verbatim (hard rule 5). Same "open script builds
// the `prompt` event by hand, respond script checks credentials, a failed
// attempt re-opens the same prompt" idiom as `mvp-prologue.ts`'s
// `openLoginPromptScript`/`respondLoginPromptScript` (`openPrompt` itself
// stays the documented no-op — `effects.ts`). Deliberately NOT the opening
// room's own script/prompt id (§22.2's own instruction) — this is a
// second, independent login, reusing only the credentials, never the
// mechanism's ids.
// ---------------------------------------------------------------------------

import { ACT3_HUB_LOGIN_OPEN_SCRIPT, ACT3_HUB_LOGIN_PROMPT_ID, ACT3_HUB_LOGGED_IN, ACT3_LEDGER, ACT3_LOAD_GRAPH, ACT3_QUEUE } from './ids';
import { ACT3_HUB_LOGIN_SCRIPT } from './ids';
// E0 task K (§17, §31) — the fourth heading, selected on `act4_started`.
import { ACT4_PROFILE, ACT4_STARTED } from '../act4/ids';

function hubLoginFields(): { name: string; placeholder?: string; secret?: boolean }[] {
  return [
    { name: 'user', placeholder: 'USER:' },
    { name: 'password', placeholder: 'PASSWORD:', secret: true },
  ];
}

function hubLoginPromptEvent(): GameEvent {
  return { type: 'prompt', id: ACT3_HUB_LOGIN_PROMPT_ID, title: 'LOG IN', body: '', fields: hubLoginFields() };
}

export const act3HubLoginOpen: ScriptFn = (_world, state) => ({ state, events: [hubLoginPromptEvent()] });

const HUB_LOGIN_SUCCESS_TEXT =
  'The cursor sits still for a moment, which the machine in your room never did.\n\n    ACCESS LEVEL: MAINTENANCE\n\n    ARCHIVE ..... SUBJECT LEDGER LOAD ........ ALLOCATION, ROLLING QUEUE ....... RECONCILIATION, PENDING\n\nUpstairs that was the whole answer. Down here it is a heading.';

// E0 task K — §17, the fourth heading. First and last sentences unchanged;
// `PROFILE ..... BEHAVIORAL, CURRENT` is the new fourth row.
const HUB_LOGIN_SUCCESS_TEXT_ACT4 =
  'The cursor sits still for a moment, which the machine in your room never did.\n\n    ACCESS LEVEL: MAINTENANCE\n\n    ARCHIVE ..... SUBJECT LEDGER LOAD ........ ALLOCATION, ROLLING QUEUE ....... RECONCILIATION, PENDING PROFILE ..... BEHAVIORAL, CURRENT\n\nUpstairs that was the whole answer. Down here it is a heading.';

const HUB_LOGIN_FAIL_TEXT =
  '    ACCESS LEVEL: NONE\n\nThe cursor goes back up to USER: and waits, and it will go on doing that for as long as you want it to.';

export const act3HubLoginRespond: ScriptFn = (world, state, args) => {
  const user = String(args?.['user'] ?? '').trim().toLowerCase();
  const password = String(args?.['password'] ?? '').trim().toLowerCase();

  if (user === 'admin' && password === 'admin-password') {
    // E0 task K — §17/§31.3: `act4_profile` is revealed here too, once Act
    // IV has started (a no-op `reveal` before then — the terminal's own
    // EXAMINE handler, `objects/s6ArchiveHub.ts`, covers the other reveal
    // case, a session already open when Act IV began).
    const act4Started = flag(world, state, ACT4_STARTED) === true;
    const applied = apply(
      world,
      state,
      [
        { set: [ACT3_HUB_LOGGED_IN, true] },
        { reveal: ACT3_LEDGER },
        { reveal: ACT3_LOAD_GRAPH },
        { reveal: ACT3_QUEUE },
        { if: { when: { flag: ACT4_STARTED }, then: [{ reveal: ACT4_PROFILE }] } },
        { say: act4Started ? HUB_LOGIN_SUCCESS_TEXT_ACT4 : HUB_LOGIN_SUCCESS_TEXT },
      ],
      { path: 'script.act3_hub_login.success' },
    );
    return { state: applied.state, events: [{ type: 'promptClosed', id: ACT3_HUB_LOGIN_PROMPT_ID }, ...applied.events] };
  }

  const applied = apply(world, state, [{ say: HUB_LOGIN_FAIL_TEXT }], { path: 'script.act3_hub_login.fail' });
  return {
    state: applied.state,
    // The failure CLOSES the prompt (v0.15.0 playtest): re-opening it here
    // swallowed every following command as prompt input, so one wrong
    // password locked the player into the login forever. "The cursor goes
    // back up to USER: and waits" is the machine's posture; the player types
    // LOG IN again.
    events: [{ type: 'promptClosed', id: ACT3_HUB_LOGIN_PROMPT_ID }, ...applied.events],
  };
};

export { ACT3_HUB_LOGIN_OPEN_SCRIPT, ACT3_HUB_LOGIN_SCRIPT };

// ---------------------------------------------------------------------------
// D5 task G — the ledger's own bare `SEARCH LEDGER`/`SEARCH` prompt (§23,
// §39.2's "search" row; this task's own mechanism, not named by the plan).
// One field (`search`), routed exactly the same way the fixed name-phrases
// on the Hub room (`s6ArchiveHub.ts`) are: jules -> R10, nolan -> §23.3,
// me/myself/the investigator/blank -> §23.4, anything else -> §23.5.
// ---------------------------------------------------------------------------

import { ACT3_LEDGER_SEARCH_OPEN_SCRIPT, ACT3_LEDGER_SEARCH_PROMPT_ID, ACT3_LEDGER_SEARCH_RESPOND_SCRIPT } from './ids';
import {
  LEDGER_JULES_EFFECTS,
  LEDGER_NOLAN_EFFECTS,
  LEDGER_NUMERAL_FOUR_EFFECTS,
  LEDGER_NUMERAL_ONE_EFFECTS,
  LEDGER_OTHER_EFFECTS,
  LEDGER_SELF_EFFECTS,
} from './objects/s6ArchiveHub';

function ledgerSearchPromptEvent(): GameEvent {
  return { type: 'prompt', id: ACT3_LEDGER_SEARCH_PROMPT_ID, title: 'SEARCH', body: '', fields: [{ name: 'search', placeholder: 'SEARCH:' }] };
}

export const act3LedgerSearchOpen: ScriptFn = (_world, state) => ({ state, events: [ledgerSearchPromptEvent()] });

const SELF_WORDS = new Set(['me', 'myself', 'the investigator', 'investigator']);

// E0 task K — §16, the numeral branch. `i`/`1`/`one` and `iv`/`4`/`four`
// are free text typed at this prompt (§31.2's own note — no resolver
// involved here); gated `{ flag: act4_started }` so a numeral before Act IV
// still falls all the way through to `LEDGER_OTHER_EFFECTS`, exactly as
// shipped (§16.3).
const NUMERAL_ONE_WORDS = new Set(['i', '1', 'one']);
const NUMERAL_FOUR_WORDS = new Set(['iv', '4', 'four']);

export const act3LedgerSearchRespond: ScriptFn = (world, state, args) => {
  const input = String(args?.['search'] ?? '').trim().toLowerCase();
  const act4Started = flag(world, state, ACT4_STARTED) === true;
  const effects =
    act4Started && NUMERAL_ONE_WORDS.has(input)
      ? LEDGER_NUMERAL_ONE_EFFECTS
      : act4Started && NUMERAL_FOUR_WORDS.has(input)
        ? LEDGER_NUMERAL_FOUR_EFFECTS
        : input === 'jules'
          ? LEDGER_JULES_EFFECTS
          : input === 'nolan'
            ? LEDGER_NOLAN_EFFECTS
            : input === '' || SELF_WORDS.has(input)
              ? LEDGER_SELF_EFFECTS
              : LEDGER_OTHER_EFFECTS;
  const applied = apply(world, state, effects, { path: 'script.act3_ledger_search_respond' });
  return { state: applied.state, events: [{ type: 'promptClosed', id: ACT3_LEDGER_SEARCH_PROMPT_ID }, ...applied.events] };
};

export { ACT3_LEDGER_SEARCH_OPEN_SCRIPT, ACT3_LEDGER_SEARCH_RESPOND_SCRIPT };

// ---------------------------------------------------------------------------
// E0 task K — §18, R13's own script (`act4_profile_screen`). `nn%` is
// `Math.round(100 * n / total)`, right-aligned to a 4-character field (the
// note's own "fits `100%`" — the placeholder's literal 3-character `nn%`
// only holds for a 2-digit value; a leading space or two makes up the
// difference, and `100%` fills the field with none to spare). `PRIMARY
// STRATEGY` reuses `cond.ts`'s own `profileLeader` (strict max only — a tie
// has no leader, exactly `engine/cond.ts`'s own comment on why: picking one
// by declaration order would silently bias the reveal), so this script's
// notion of "leads" never drifts from D5's own M16-A/S/D selection
// (`objects/s6ArchiveHub.ts`'s `QUEUE_READ_EFFECTS`/`../knowledge.ts`).
// First read: the sentence, then the block, then the flag, then the clue,
// in that order (§31.3) — one `say` (sentence+block are one string), then
// `set`, then `grantClue`. Every read after: the block alone, nothing set
// or granted again.
// ---------------------------------------------------------------------------

import { evaluate } from '../../../engine/cond';
import { ACT4_CLUE_PROFILED, ACT4_PROFILE_SCREEN_SCRIPT, ACT4_PROFILE_SEEN } from '../act4/ids';

const PROFILE_FIRST_READ_SENTENCE =
  'You take the fourth heading. It comes up as fast as the other three, which is to say it was already there.';

function profileStrategyWord(world: WorldDef, state: GameState): string {
  const { analytical, social, direct } = state.profile;
  if (analytical + social + direct === 0) return 'NONE';
  if (evaluate(world, state, { profileLeader: 'analytical' })) return 'ANALYTICAL';
  if (evaluate(world, state, { profileLeader: 'social' })) return 'SOCIAL';
  if (evaluate(world, state, { profileLeader: 'direct' })) return 'DIRECT';
  return 'UNDETERMINED';
}

function profilePercentField(n: number, total: number): string {
  const pct = total === 0 ? 0 : Math.round((100 * n) / total);
  return `${String(pct).padStart(3)}%`;
}

function profileBlock(world: WorldDef, state: GameState): string {
  const { analytical, social, direct } = state.profile;
  const total = analytical + social + direct;
  return (
    `    SUBJECT BEHAVIORAL PROFILE\n\n` +
    `    OBSERVATION:      ${profilePercentField(analytical, total)}\n` +
    `    SOCIAL INFERENCE: ${profilePercentField(social, total)}\n` +
    `    DIRECT ACTION:    ${profilePercentField(direct, total)}\n\n` +
    `    PRIMARY STRATEGY: ${profileStrategyWord(world, state)}`
  );
}

export const act4ProfileScreen: ScriptFn = (world, state) => {
  const block = profileBlock(world, state);
  if (flag(world, state, ACT4_PROFILE_SEEN) === true) {
    return apply(world, state, [{ say: block }], { path: 'script.act4_profile_screen' });
  }
  return apply(
    world,
    state,
    [{ say: `${PROFILE_FIRST_READ_SENTENCE}\n\n${block}` }, { set: [ACT4_PROFILE_SEEN, true] }, { grantClue: ACT4_CLUE_PROFILED }],
    { path: 'script.act4_profile_screen' },
  );
};

export { ACT4_PROFILE_SCREEN_SCRIPT };

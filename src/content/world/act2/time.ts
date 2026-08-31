// Act II — pass-time (`WAIT UNTIL <phase>`) and the two SLEEP routes
// (Stage D plan §3 E4; the presence-and-passage prose document, PART TWO).
// Prose transcribed exactly (hard rule 5) from
// `docs/superpowers/specs/2026-09-08-stage-d0-presence-and-passage.md` §3.
//
// Both `ScriptFn`s here compute a live minute delta and apply it via
// `apply()`'s `advanceClock` effect rather than writing `state.clock`
// directly — this keeps the write going through the one sanctioned
// mutation path (`effects.ts`) and threads events/state the same way any
// other handler does. The delta each script computes is **one
// `minutesPerTurn` short** of the actual gap to the target phase: `turn.ts`'s
// `step()` always runs `tick()` after a handler's own effects, and `tick()`
// unconditionally adds `world.meta.minutesPerTurn` (default 1) on top —
// the "structural" per-turn minute every command costs. Landing exactly on
// the phase's own start minute (`WAIT UNTIL MORNING` from 04:20 lands at
// 07:00, not 07:01) means the script's own `advanceClock` plus that
// structural minute must sum to the full gap, not overshoot it by one.

import { apply } from '../../../engine/effects';
import { phase } from '../../../engine/clock';
import type { DayPhase, RoomId } from '../../../engine/ids';
import type { Clock, ScriptFn, WorldMeta } from '../../../engine/world';
import { JACKS_MOTEL, MAIN_STREET, NOLANS_YARD, TOWN_EDGE } from '../act1/ids';
import { ACT2_SLEPT_SINCE_BOOT } from './ids';

// ---------------------------------------------------------------------------
// §3.1 — the eight pass-time lines. Branch on indoors/outdoors, not on
// room id (the doc's own instruction) — the exterior set below is the one
// place room ids decide which branch applies.
// ---------------------------------------------------------------------------

/** "Main Street, Town Edge, Nolan's Yard, the motel lot" (main-session ruling 2). */
const EXTERIOR_ROOMS: ReadonlySet<RoomId> = new Set<RoomId>([MAIN_STREET, TOWN_EDGE, NOLANS_YARD, JACKS_MOTEL]);

const INDOOR_LINES: Record<DayPhase, string> = {
  morning:
    "The glass goes grey, then the colour of weak tea. Somewhere out on the street a lock turns, and that is the whole of the morning's business.",
  afternoon: 'The light crawls across the floor, gets high and flat, and stops being interesting. Nothing in here has moved but the light.',
  evening: 'The light goes long along one wall, and orange, and then leaves. Outside, a sign comes on and hums for a while before it settles.',
  night: 'The glass turns into a mirror with you in it. The building takes over the noise-making and is not good at it: pipes, a roof joint, the heat coming on.',
};

export const OUTDOOR_LINES: Record<DayPhase, string> = {
  morning: 'The east goes the colour of a struck match and then thinks better of it. The cold sharpens before it lets go, which is the part nobody warns you about.',
  afternoon: 'The sun clears the roofline and takes the shadows in with it. Something goes through on the highway and does not slow. The tar in the road joints goes soft.',
  evening:
    'The light comes in sideways and makes the street briefly worth looking at, which the street does not notice. Windows come on along one side. The wind changes ends.',
  night: 'The last of the colour goes off the west and the cold comes up under it. The street lights, the one lit sign, the road going quiet both ways.',
};

// ---------------------------------------------------------------------------
// §3.2 — the SLEEP refusal, for everywhere that is neither Your Room nor
// unit five. Exported so `act2/index.ts`'s room loop can wire it as a
// plain `{ say }` handler (no clock work beyond the structural minute).
// ---------------------------------------------------------------------------

export const ACT2_SLEEP_REFUSAL_TEXT =
  'Two places in this town have been offered to you, in so many words, and this is not one of them. Anywhere else is how you get a reputation before you get a name.';

// ---------------------------------------------------------------------------
// §3.3/§3.4 — the two places sleep is actually on offer.
// ---------------------------------------------------------------------------

const YOUR_ROOM_FLOOR_TEXT =
  'The floor, then. You did it once already tonight without choosing it, and this time you choose it. Pipes come on and go off twice. Nothing you dream survives the getting up, and it is light when you stop.';

const UNIT_FIVE_TEXT =
  'Five is exactly as advertised: empty, paid through Sunday, and made up tight enough to argue with. You lose that argument early. Down the walkway the ice machine works through the whole night without you.';

export type Act2SleepVariant = 'your_room' | 'unit_five';

// ---------------------------------------------------------------------------
// Minute arithmetic — shared by both scripts. See this file's header for
// why the returned delta is short by `minutesPerTurn`.
// ---------------------------------------------------------------------------

/**
 * Minutes from `clock` to the next start of `target` (§3.1's own wording:
 * "the script computes minutes to the next start of `phase` (if the clock
 * is already in it, the following day's)"). Full gap — the
 * `minutesPerTurn` adjustment happens at each call site, not here, so this
 * function stays a pure "what does the calendar say" helper a test can
 * check on its own.
 */
export function minutesToPhaseStart(meta: WorldMeta, clock: Clock, target: DayPhase): number {
  const current = phase(meta, clock);
  const targetStart = meta.phases[target];
  const currentTotal = (clock.day - 1) * 1440 + clock.minute;
  const targetDay = current === target || targetStart <= clock.minute ? clock.day + 1 : clock.day;
  const targetTotal = (targetDay - 1) * 1440 + targetStart;
  return targetTotal - currentTotal;
}

function structuralMinutes(meta: WorldMeta): number {
  return meta.minutesPerTurn ?? 1;
}

// ---------------------------------------------------------------------------
// The two registered scripts.
// ---------------------------------------------------------------------------

/**
 * `WAIT UNTIL <phase>` (`act2/verbs.ts`'s four bare verbs, wired via
 * `act2/index.ts`'s per-room loop). `args.phase` is one of `DayPhase`'s
 * four literal values.
 */
export const act2PassTime: ScriptFn = (world, state, args) => {
  const target = args?.phase as DayPhase;
  const delta = minutesToPhaseStart(world.meta, state.clock, target) - structuralMinutes(world.meta);
  const exterior = EXTERIOR_ROOMS.has(state.location);
  const line = (exterior ? OUTDOOR_LINES : INDOOR_LINES)[target];
  return apply(world, state, [{ advanceClock: delta }, { say: line }], { path: 'script.act2_pass_time' });
};

/**
 * The two SLEEP routes that actually advance the clock (`args.variant`).
 * Both land on the next start of `'morning'` (§5.3 assumption 4) and mark
 * `act2_slept_since_boot`.
 */
export const act2Sleep: ScriptFn = (world, state, args) => {
  const variant = args?.variant as Act2SleepVariant;
  const delta = minutesToPhaseStart(world.meta, state.clock, 'morning') - structuralMinutes(world.meta);
  const text = variant === 'your_room' ? YOUR_ROOM_FLOOR_TEXT : UNIT_FIVE_TEXT;
  return apply(
    world,
    state,
    [{ advanceClock: delta }, { set: [ACT2_SLEPT_SINCE_BOOT, true] }, { say: text }],
    { path: 'script.act2_sleep' },
  );
};

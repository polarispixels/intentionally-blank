// Pure functions of `(meta, clock)` — no ticking, no events, no schedules,
// no dependency on `evaluate()`. This is a leaf module on purpose: it
// imports only `DayPhase` from `ids.ts` and `Clock`/`WorldMeta` from
// `world.ts`, so both `cond.ts` (the `clockPhase`/`weekday` Cond arms) and
// `tick.ts` (task 13, schedules/events written in phases and weekdays) can
// import from here without a cycle. An earlier spec draft filed these under
// `tick.ts`; that was a filing error, not a real coupling — corrected for
// task 3.

import type { DayPhase } from './ids';
import type { Clock, WorldMeta } from './world';

/**
 * The phase containing `clock.minute`, per `meta.phases`' start minutes.
 * Windows are half-open `[start, nextStart)`, inclusive of their own start
 * minute (an accepted task-3 convention: `after` inclusive / `before`
 * exclusive keeps windows composing without gaps or overlaps once ~10 NPCs
 * have phase-posted schedules). Declaration order in `meta.phases` doesn't
 * matter — this sorts by start minute itself — and the phase with the
 * *latest* start minute is, by construction, the one that wraps past
 * midnight and covers every minute before the earliest start.
 *
 * Two phases sharing a start minute make the table ambiguous — which one
 * "wins" that minute has no principled answer — so this throws rather than
 * picking one silently; that's a content bug `validate.ts` (task 7) should
 * also catch before it reaches a save.
 */
export function phase(meta: WorldMeta, clock: Clock): DayPhase {
  const entries = (Object.entries(meta.phases) as [DayPhase, number][]).sort((a, b) => a[1] - b[1]);

  if (entries.length === 0) {
    throw new Error('phase: meta.phases is empty; a world must declare at least one phase');
  }

  let prevStart: number | undefined;
  for (const [, start] of entries) {
    if (start === prevStart) {
      throw new Error(`phase: two phases both start at minute ${start} (ambiguous meta.phases)`);
    }
    prevStart = start;
  }

  const wrap = entries.reduce((max, entry) => (entry[1] > max[1] ? entry : max));
  let current: DayPhase = wrap[0];
  for (const [name, start] of entries) {
    if (start <= clock.minute) current = name;
  }
  return current;
}

/** 0-based weekday, wrapping every `meta.weekLength` days; `day` is 1-based. */
export function weekday(meta: WorldMeta, clock: Clock): number {
  if (meta.weekLength <= 0) {
    throw new Error(`weekday: meta.weekLength must be positive, got ${meta.weekLength}`);
  }
  return (clock.day - 1) % meta.weekLength;
}

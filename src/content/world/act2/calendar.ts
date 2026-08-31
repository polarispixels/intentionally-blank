// Act II's calendar — the ONLY file in `src/content/world/**` allowed to
// write a `weekday:` literal (ADR 0011 item 4; Stage D plan's D0 table).
// Every recurring window content needs — poker, the Tuesday delivery, trash
// night — is a named `Cond` here, imported everywhere else. A source scan
// (`tests/world-game.test.ts`) fails the suite if a `weekday: <number>`
// literal turns up in any other file under `src/content/world/`.
//
// Day 1 is a Wednesday (Stage D plan §5, register 11's ruling): the Act I
// trash night is the opening night, poker is two nights away, and the
// Tuesday delivery manifest is six days out.

import type { Cond } from '../../../engine/cond';

/** 0-based, matching `clock.ts`'s `weekday()`; day 1 is `wed`. */
export const WEEKDAY = {
  wed: 0,
  thu: 1,
  fri: 2,
  sat: 3,
  sun: 4,
  mon: 5,
  tue: 6,
} as const;

/** Friday evening — the poker game at the Sundown Diner (§4.3). */
export const POKER_NIGHT: Cond = { all: [{ weekday: WEEKDAY.fri }, { clockPhase: 'evening' }] };

/** Tuesday morning — the contractor's manifest at the window (§2, route (d)). */
export const DELIVERY_MORNING: Cond = { all: [{ weekday: WEEKDAY.tue }, { clockPhase: 'morning' }] };

/** Wednesday evening or night — the Act I trash night, opening night. */
export const TRASH_NIGHT: Cond = {
  all: [{ weekday: WEEKDAY.wed }, { any: [{ clockPhase: 'evening' }, { clockPhase: 'night' }] }],
};

/** Any night, any weekday — the Custodian's rounds and similar nightly recurrences. */
export const NIGHT: Cond = { clockPhase: 'night' };

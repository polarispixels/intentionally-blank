// Shared helpers for Act I room 1's object files.

import type { Cond } from '../../../../engine/cond';
import type { ProseRule } from '../../../../engine/prose';
import { ACT1_DARK_REFUSAL_FAMILY } from '../responses';
import { FLOOR_LAMP } from '../ids';

/** The room's baseline "can you see" gate — mirrors `room.your_room.description`'s own dark-rule condition. */
export const ROOM_DARK: Cond = { not: { objectState: [FLOOR_LAMP, 'on', true] } };
export const ROOM_LIT: Cond = { objectState: [FLOOR_LAMP, 'on', true] };

/**
 * Prepends §3.3's dark-refusal rule ahead of `litRules` — for the
 * sight-based verbs (`examine`, `read`, `search`, `look_under`,
 * `look_behind`) on objects whose own doc text does not already handle
 * darkness itself (self, window, pull_chain all author their own dark
 * variant instead — see those files). Touch/smell/taste/listen verbs never
 * use this (§8.11).
 */
export function withDarkRefusal(litRules: ProseRule[]): ProseRule[] {
  return [{ when: ROOM_DARK, text: { ref: ACT1_DARK_REFUSAL_FAMILY } }, ...litRules];
}

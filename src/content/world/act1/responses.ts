// Act I, room 1 — room-scoped response families (§3.3).
//
// `darkRefusal` is genuinely shared prose (§3.3: "used whenever a
// sight-based verb... is attempted while the room is dark"), reused by many
// objects' `examine`/`search`/`read`/`look_under`/`look_behind` responses —
// exactly the case `world.responses` + `ProseRef` exists for, rather than
// repeating the same three strings on every object.

import type { Prose } from '../../../engine/prose';

export const ACT1_DARK_REFUSAL_FAMILY = 'act1.your_room.darkRefusal';

/**
 * Main Street's build boundary (main-street-prose §8) — one family per
 * direction, plus a generic fallback, exactly like the front desk's own
 * (former) `system.buildBoundary`, but keyed here (rather than inlined in
 * `mainStreet.ts`) so `verbs.ts` can reference the generic variant as
 * `V_APPROACH`'s own verb-level `default` — `{ ref }` avoids a
 * `mainStreet.ts` <-> `verbs.ts` import cycle (room files import from
 * `verbs.ts`, never the other way).  Referenced from the room's own
 * `north` exit (`blockedText`) and from `billboard`'s/`horizon_glow`'s own
 * `V_APPROACH` handlers (the north variant — §4.2's "go to billboard...
 * routes to the build boundary, north" and §8's "any attempt to walk
 * toward the glow").
 *
 * UPDATED (wave-2 amendment §13.3): the `south` and `west` direction-keyed
 * variants are DELETED — both directions now travel for real, to the Post
 * Office and the General Store. `north` is unchanged. `ACT1_MAIN_STREET_
 * BOUNDARY_DINER` is new — §13.3's own "destination-keyed variant" so
 * `GO TO DINER` (`diner`, `objects/mainStreet.ts`) stops falling to the
 * fully generic text now that its neighbour, the store, is real.
 */
export const ACT1_MAIN_STREET_BOUNDARY_NORTH = 'act1.main_street.buildBoundary.north';
export const ACT1_MAIN_STREET_BOUNDARY_GENERIC = 'act1.main_street.buildBoundary.generic';
export const ACT1_MAIN_STREET_BOUNDARY_DINER = 'act1.main_street.buildBoundary.diner';

export const ACT1_RESPONSES: Record<string, Prose> = {
  [ACT1_DARK_REFUSAL_FAMILY]: [
    'Not in this light. Not, more accurately, in this absence of it.',
    'Whatever it looks like, it is keeping that to itself until somebody does something about the dark.',
    'You look hard at nothing and nothing looks back, competently.',
  ],
  [ACT1_MAIN_STREET_BOUNDARY_NORTH]:
    'END OF BUILD\n\nNorth is the edge of town, the billboard up close, and whatever is making the light. None of it is in this version.',
  [ACT1_MAIN_STREET_BOUNDARY_GENERIC]:
    'END OF BUILD\n\nThat is somewhere else in this town. This version is the street, and the house behind you.',
  [ACT1_MAIN_STREET_BOUNDARY_DINER]:
    'END OF BUILD\n\nThe diner is the other lit window on this street and it is not in this version. The store next to it is.',
};

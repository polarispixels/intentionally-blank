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
 * `north`/`south`/`west` exits (`blockedText`) and from `billboard`'s/
 * `horizon_glow`'s own `V_APPROACH` handlers (the north variant — §4.2's
 * "go to billboard... routes to the build boundary, north" and §8's "any
 * attempt to walk toward the glow").
 */
export const ACT1_MAIN_STREET_BOUNDARY_NORTH = 'act1.main_street.buildBoundary.north';
export const ACT1_MAIN_STREET_BOUNDARY_SOUTH = 'act1.main_street.buildBoundary.south';
export const ACT1_MAIN_STREET_BOUNDARY_WEST = 'act1.main_street.buildBoundary.west';
export const ACT1_MAIN_STREET_BOUNDARY_GENERIC = 'act1.main_street.buildBoundary.generic';

export const ACT1_RESPONSES: Record<string, Prose> = {
  [ACT1_DARK_REFUSAL_FAMILY]: [
    'Not in this light. Not, more accurately, in this absence of it.',
    'Whatever it looks like, it is keeping that to itself until somebody does something about the dark.',
    'You look hard at nothing and nothing looks back, competently.',
  ],
  [ACT1_MAIN_STREET_BOUNDARY_NORTH]:
    'END OF BUILD\n\nNorth is the edge of town, the billboard up close, and whatever is making the light. None of it is in this version.',
  [ACT1_MAIN_STREET_BOUNDARY_SOUTH]:
    'END OF BUILD\n\nThe street goes on south past the post office and the sheriff\'s office to the library. This version does not go that far.',
  [ACT1_MAIN_STREET_BOUNDARY_WEST]:
    'END OF BUILD\n\nAcross the road are the diner and the general store. Neither is in this version.',
  [ACT1_MAIN_STREET_BOUNDARY_GENERIC]:
    'END OF BUILD\n\nThat is somewhere else in this town. This version is the street, and the house behind you.',
};

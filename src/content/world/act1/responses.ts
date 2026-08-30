// Act I, room 1 — room-scoped response families (§3.3).
//
// `darkRefusal` is genuinely shared prose (§3.3: "used whenever a
// sight-based verb... is attempted while the room is dark"), reused by many
// objects' `examine`/`search`/`read`/`look_under`/`look_behind` responses —
// exactly the case `world.responses` + `ProseRef` exists for, rather than
// repeating the same three strings on every object.

import type { Prose } from '../../../engine/prose';

export const ACT1_DARK_REFUSAL_FAMILY = 'act1.your_room.darkRefusal';

export const ACT1_RESPONSES: Record<string, Prose> = {
  [ACT1_DARK_REFUSAL_FAMILY]: [
    'Not in this light. Not, more accurately, in this absence of it.',
    'Whatever it looks like, it is keeping that to itself until somebody does something about the dark.',
    'You look hard at nothing and nothing looks back, competently.',
  ],
};

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
 * Main Street's build boundary (main-street-prose §8) — a generic
 * fallback, exactly like the front desk's own (former)
 * `system.buildBoundary`, but keyed here (rather than inlined in
 * `mainStreet.ts`) so `verbs.ts` can reference it as `V_APPROACH`'s own
 * verb-level `default` — `{ ref }` avoids a `mainStreet.ts` <-> `verbs.ts`
 * import cycle (room files import from `verbs.ts`, never the other way).
 *
 * UPDATED (wave-2 amendment §13.3): the `south` and `west` direction-keyed
 * variants were deleted — both directions travel for real, to the Post
 * Office and the General Store.
 *
 * UPDATED (wave-3 amendment §15.3): the `north` direction-keyed variant
 * and the destination-keyed `diner` variant are BOTH deleted — north now
 * travels for real, to `town_edge` (whose own `north` exit carries the
 * boundary now, `TOWN_EDGE_BOUNDARY_NORTH_TEXT`, `townEdge.ts`), and the
 * diner is a real room reached via its own scenery object's `goto`
 * effects. The old `buildBoundary.generic` response (the last live boundary
 * string in the game) was retired in E3 — §34's rule made total: V_APPROACH
 * falls to the shipped `VERB_DEFAULTS.move` instead (register 146).
 */

export const ACT1_RESPONSES: Record<string, Prose> = {
  [ACT1_DARK_REFUSAL_FAMILY]: [
    'Not in this light. Not, more accurately, in this absence of it.',
    'Whatever it looks like, it is keeping that to itself until somebody does something about the dark.',
    'You look hard at nothing and nothing looks back, competently.',
  ],
};

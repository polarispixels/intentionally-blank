// Front Desk & Lobby
// (`docs/superpowers/specs/2026-09-01-front-desk-prose.md`) — the room the
// Landing's stairs were pointing at. Replaces the Landing's own §15.2 build
// boundary (removed from `landing.ts`); the boundary now lives on this
// room's own street door (§9 there).

import type { Cond } from '../../../engine/cond';
import type { HandlerDef, OnEnterRule, RoomDefSlice } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { LISTEN, WAIT, checkDateText, findNameText } from './verbs';
import { CLUE_REGISTER_GAP, FLAG_MET_MARLOW, FLAG_REGISTER_GAP_SEEN, FRONT_DESK, LANDING, STREET_DOOR, V_CHECK_DATE, V_FIND_MY_NAME, V_LOOK_OUTSIDE, V_WHOAMI } from './ids';

const FIRST_SIGHT = [
  'The stairs come down into a lobby built for more people than are using it. Ten or eleven chairs stand around a low table with the magazines squared to the corner, and none of them are lit; all the light in this room comes off one green-shaded lamp at the front desk and gives out about four feet from where it starts.',
  'There is a man behind the desk. He is awake, and he was awake before you came down, and he watches you arrive without doing anything about it. Behind him, a board of numbered hooks with keys on most of them. A radio is on under the counter, turned below the point where it carries words. A coffee pot stands on a ring and has been standing on it too long.',
  'On the counter, a brass bell and a tall book, left open and facing out the way a book is left for people who are expected. The street door is at the front, half glass, with the town on the other side of it being dark about it.',
].join('\n\n');

const RETURN_VISIT =
  'The lobby, the lamp, and the chairs nobody is in. Marlow behind the desk with the radio low, the key board behind him, and the register open on the counter facing out. The street door is at the front. The stairs go back up behind you.';

const MET_MARLOW: Cond = { flag: FLAG_MET_MARLOW };

const description: ProseRule[] = [
  { when: { not: MET_MARLOW }, text: FIRST_SIGHT },
  { text: RETURN_VISIT },
];

const smell = 'Coffee that has been standing on heat since about ten, floor wax, and cold coming in under the street door.';

const listen: string[] = [
  'The radio, low. The pot ticking on its ring. Two clocks, one behind the desk and one over the door, running a second or two apart from each other in a way that nobody in thirty years has thought worth correcting.',
];

// §2.3's note: variant 1's second sentence (the two clocks) is optional set
// dressing per the doc's own note — kept, since it's transcribed prose and
// hard rule 5 leaves cutting it to the main session, not this builder.

const whoAmIText =
  'There is a man in this room whose job for thirty years has been to write that down, and a book on the counter that it was written in.\n\nNeither of them currently has it.';

const waitText = 'The radio plays. Marlow does not fill the silence, and it turns out neither do you.';

const lookOutsideText =
  'Brick across the road, unlit. Further along, something tied to a rail shifts its weight from one foot to the other and settles.\n\nNo lights in any window you can see, which at this hour is either ordinary or the town telling you something.';

// §9's build boundary, moved down from the Landing (same voice, same
// system-chrome ruling as the Landing's own §15.2 — see `objects/landing.ts`
// for the one open engine gap this leaves, `kind: 'system'` rendering,
// reported there rather than reworked here).
export const FRONT_DESK_BUILD_BOUNDARY_TEXT: ProseRule[] = [
  {
    text: [
      'END OF BUILD\n\nThis version ends at the street door. The town on the other side of it is not in this build.',
      'END OF BUILD\n\nThe door opens. The town does not. Everything past this lobby belongs to a later version.',
    ],
  },
];

/**
 * §4.2's "find my name" — bare, multi-word verb words (`V_FIND_MY_NAME`,
 * `verbs.ts`), needs a room-level handler to run its effects (the same
 * gap-3/4 shape as room 1's `STAND`/terminal-login handlers) since a bare
 * verb's own `VerbDef.default` can only ever render `Prose`, never an
 * `Effect`.
 */
const roomHandlers: HandlerDef[] = [
  { verbs: [LISTEN], effects: [{ say: listen }] },
  { verbs: [V_WHOAMI], effects: [{ say: whoAmIText }] },
  { verbs: [WAIT], effects: [{ say: waitText }] },
  { verbs: [V_LOOK_OUTSIDE], effects: [{ say: lookOutsideText }] },
  { verbs: [V_CHECK_DATE], effects: [{ say: checkDateText }] },
  {
    verbs: [V_FIND_MY_NAME],
    effects: [{ say: findNameText }, { set: [FLAG_REGISTER_GAP_SEEN, true] }, { grantClue: CLUE_REGISTER_GAP }],
  },
];

const onEnter: OnEnterRule[] = [{ effects: [{ set: [FLAG_MET_MARLOW, true] }] }];

export const frontDeskRoom: RoomDefSlice = {
  name: 'Front Desk',
  area: 'act1',
  map: { x: 1, y: 1 },
  description,
  onEnter,
  exits: [
    {
      dir: 'up',
      to: LANDING,
      travelText:
        "You take the stairs back up. The lamp's light gets six treads with you and then gives up, and the rest you do from memory of a house you have lived in for three weeks.",
    },
    { dir: 'out', to: FRONT_DESK, door: STREET_DOOR, blockedText: FRONT_DESK_BUILD_BOUNDARY_TEXT },
    // §9's fire list explicitly names NORTH alongside OUT/LEAVE/EXIT — a
    // second exit sharing the same (never-open) door and text, since NORTH
    // is `DIRECTION_VERB_IDS.n`, a separate verb id from OUT.
    { dir: 'n', to: FRONT_DESK, door: STREET_DOOR, blockedText: FRONT_DESK_BUILD_BOUNDARY_TEXT },
  ],
  handlers: roomHandlers,
};

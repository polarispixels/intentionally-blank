// Act III, Stage D3 task C — Corridor B4 room (D3 prose doc §11). M7 fires
// on entry (§12); the notebook's own examine gains a rule keyed on
// `act3_b4_measured` (§11.8 — see `act2/objects/notebook.ts`'s own
// amendment, this task's).

import type { OnEnterRule, RoomDefSlice } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { LISTEN, SMELL } from '../act1/verbs';
import { ACT3_B4_MEASURED, ACT3_CORRIDOR_B4, ACT3_DATA_HALL_A, ACT3_MEM_M7 } from './ids';

// ---------------------------------------------------------------------------
// §11.1 — description.
// ---------------------------------------------------------------------------

const firstSight =
  'A corridor. That is the whole of it.\n\nBlock walls painted the colour of a filing cabinet. A vinyl floor in one-foot tiles laid in a running bond, so that the joints run across your way. A line of fluorescent boxes down the middle of the ceiling with every tube in them lit. An extinguisher on a bracket at each end.\n\nThere is a framed plan on the wall beside the door you came in by. There is a badge reader beside a door at the far end. About a third of the way along, on the right, there is a panel of the wall two feet by three that is screwed on rather than built in.\n\nNothing happens here. Things go past here on their way to somewhere else.';

const measuredVisit =
  'The block walls, the tiles, the boxes overhead, the extinguisher at each end.\n\nThe framed plan by the door. The reader at the far end. The panel on the right.\n\nNothing happens here. You have been down it and back on your own feet and you know how long it is, which is more than the drawing on the wall does.';

const returnVisit =
  'Block, tile, and a line of lit boxes going away to a door with a reader beside it. The framed plan at this end. The panel on the right.\n\nIt is a corridor.';

const description: ProseRule[] = [
  { when: { flag: ACT3_B4_MEASURED }, text: measuredVisit },
  { when: { not: { visited: ACT3_CORRIDOR_B4 } }, text: firstSight },
  { text: returnVisit },
];

// ---------------------------------------------------------------------------
// §12 — M7, seeded, fires on entry.
// ---------------------------------------------------------------------------

const onEnter: OnEnterRule[] = [{ effects: [{ grantMemory: ACT3_MEM_M7 }] }];

// ---------------------------------------------------------------------------
// §11.9 — room-level senses.
// ---------------------------------------------------------------------------

const listenText =
  'The fittings overhead, each of them holding a note about a quarter-tone off its neighbours, and the sum of them being the sound of a corridor.\n\nSomewhere behind the block, water.';

const smellText = 'Floor polish and warm dust off the light fittings, and nothing else in either direction for the whole length of it.';

export const corridorB4Room: RoomDefSlice = {
  name: 'Corridor B4',
  aliases: ['b4', 'corridor b4'],
  description,
  onEnter,
  exits: [
    // Data Hall A's own exit into B4 is `n` (`dataHallA.ts`), so `s` and `out`
    // lead home too — v0.13.0 playtest.
    ...(['w', 's', 'out'] as const).map((dir) => ({ dir, to: ACT3_DATA_HALL_A, travelText: 'Back along the corridor to Data Hall A.' })),
    // The far door/lift is reached by naming it (`CALL ELEVATOR`, `USE
    // BADGE`), not by a direction — see `elevator.ts`'s own header and
    // §21.2's own "FAR DOOR in B4 must resolve to the lift" ruling.
  ],
  handlers: [
    { verbs: [LISTEN], effects: [{ say: listenText }] },
    { verbs: [SMELL], effects: [{ say: smellText }] },
  ],
};

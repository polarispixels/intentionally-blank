// The jammed third drawer (prose doc §4.5). Canon decision 19: stays shut
// through M1 — jammed, not locked (its own `unlock` response says so). No
// pry tool exists in this room's object list (register entry 19/§13.2), so
// it never opens here; that is the room's deliberate open thread.
//
// `location: { on: DESK }` — same sub-part placement as the other nested
// parts in this room (no open/transparent gating; travels with the desk,
// which never actually moves).

import type { Effect } from '../../../../engine/effects';
import type { ObjectDefSlice } from '../../../../engine/world';
import { CLUE_DRAWER_HELD, DESK, DRAWER } from '../ids';
import { EXAMINE, KICK, OPEN, PRY, PULL, SEARCH, SHAKE, UNLOCK } from '../verbs';

export const DRAWER_STUCK_TEXT =
  'The drawer moves an eighth of an inch and stops against itself. The front is bowed, the runner behind it is bent, and between them they have arrived at an arrangement that does not include you.';

export const DRAWER_PRY_TEXT = [
  'Somebody has already tried this. The gouges in the drawer’s lip are fresh — pale where the varnish has been lifted, all three of them at the same angle, made by something flat and hard and used with patience rather than force.',
  'They stop just short of working. Whoever it was gave up on this drawer, and gave up on it last, and did not come back for it.',
].join('\n\n');

export const DRAWER_KICK_TEXT =
  'You kick it. The desk shifts an inch across the boards, the drawer does not move at all, and two floors down a board takes somebody’s weight and then very deliberately stops.';

export const DRAWER_SHAKE_TEXT = 'Something inside the drawer slides half an inch and stops. Paper does not make that sound.';

const openHandler: Effect[] = [{ say: DRAWER_STUCK_TEXT }];
const pryHandler: Effect[] = [{ say: DRAWER_PRY_TEXT }, { grantClue: CLUE_DRAWER_HELD }];

const drawer: ObjectDefSlice = {
  location: { on: DESK },
  name: 'drawer',
  nouns: ['drawer'],
  adjectives: ['third', 'bottom', 'jammed'],
  container: { open: false, locked: false },
  handlers: [
    {
      verbs: [EXAMINE],
      effects: [
        {
          say: 'The one drawer that stayed put. The front is bowed outward where somebody worked at it, and the lip is chewed pale in three places by something flat and hard. It stands an eighth of an inch proud of the desk face and it does not stand any prouder.',
        },
        { grantClue: CLUE_DRAWER_HELD },
      ],
    },
    { verbs: [OPEN, PULL], effects: openHandler },
    {
      verbs: [UNLOCK],
      effects: [
        {
          say: 'There is a small brass lock in the drawer front, and it is not the problem. It turns freely under a fingernail. Either it was never locked or it stopped being locked some time before you woke up. Whatever is holding this drawer shut, it is not the lock.',
        },
      ],
    },
    { verbs: [PRY], effects: pryHandler },
    { verbs: [KICK], effects: [{ say: DRAWER_KICK_TEXT }] },
    {
      verbs: [SEARCH],
      effects: [
        {
          say: 'You get a finger into the eighth of an inch on offer and feel paper. More than one sheet, and something stiffer behind the paper. That is the entire harvest.',
        },
      ],
    },
    { verbs: [SHAKE], effects: [{ say: DRAWER_SHAKE_TEXT }] },
  ],
};

export const DRAWER_OBJECTS: Record<string, ObjectDefSlice> = {
  [DRAWER]: drawer,
};

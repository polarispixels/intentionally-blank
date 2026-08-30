// Broken glass (prose doc §4.8). Not portable in M1 (§13 item 7 — the
// supply stays available for a later tool need without contradicting this).

import type { ObjectDefSlice } from '../../../../engine/world';
import { BROKEN_GLASS, YOUR_ROOM } from '../ids';
import { EXAMINE, LOOK_UNDER, SEARCH, TAKE, TOUCH } from '../verbs';
import { V_CLEAN } from '../ids';

const searchOrLookUnder =
  'Under the glass, where the boards are, there is a dry ring the size of a coaster. Water stood there, and then stopped standing there, some hours ago.';

const brokenGlass: ObjectDefSlice = {
  location: YOUR_ROOM,
  name: 'broken glass',
  nouns: ['glass', 'shards', 'pieces', 'tumbler'],
  handlers: [
    {
      verbs: [EXAMINE],
      effects: [
        {
          say: 'A drinking glass, formerly. The pieces have gone where dropped glass goes, which is everywhere; the largest still carries the curve of the rim. There is no blood on any of it.',
        },
      ],
    },
    {
      verbs: [TAKE],
      effects: [
        {
          say: 'You pick up a piece the size of a guitar pick, consider it, consider the state of your pockets and the state of your hands, and put it back down. If this becomes a room that requires a sharp edge, the supply will not have moved.',
        },
      ],
    },
    {
      verbs: [TOUCH],
      effects: [
        {
          say: 'Cold, and sharper than you gave it credit for. You withdraw the finger with the speed of a man who has recently learned that not everything in this room is on his side.',
        },
      ],
    },
    { verbs: [SEARCH, LOOK_UNDER], effects: [{ say: searchOrLookUnder }] },
    {
      verbs: [V_CLEAN],
      effects: [
        {
          say: 'You start collecting the pieces into a pile, get about a third of the way through, and stop when it occurs to you that you are tidying a room somebody else has already gone to a lot of trouble over.',
        },
      ],
    },
  ],
};

export const BROKEN_GLASS_OBJECTS: Record<string, ObjectDefSlice> = {
  [BROKEN_GLASS]: brokenGlass,
};

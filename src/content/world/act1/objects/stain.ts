// The stain (prose doc §4.13 — numbered out of order in the source, but a
// full room object). Constitution §8: the ridiculous action (tasting it) is
// rewarded rather than refused.

import type { ObjectDefSlice } from '../../../../engine/world';
import { STAIN, YOUR_ROOM } from '../ids';
import { EXAMINE, LOOK_UNDER, RUB, SMELL, TASTE, TOUCH } from '../verbs';

const stain: ObjectDefSlice = {
  location: YOUR_ROOM,
  name: 'stain',
  nouns: ['stain', 'blood', 'mark', 'patch', 'spot'],
  handlers: [
    {
      verbs: [EXAMINE],
      effects: [
        {
          say: [
            'Dark, roughly the diameter of a saucer, soaked into the boards rather than sitting on them. At the rim it has gone brown and lifted the grain. At the centre it is still a shade darker than it is going to be tomorrow.',
            'You have some rough sense of how long that takes, and it is not minutes.',
          ].join('\n\n'),
        },
      ],
    },
    {
      verbs: [TOUCH],
      effects: [
        {
          say: 'Dry at the rim, faintly tacky in the middle. You wipe your fingers down your coat and wish, on balance, that you had asked somebody else.',
        },
      ],
    },
    { verbs: [SMELL], effects: [{ say: 'Iron, and floor wax, and cold.' }] },
    {
      verbs: [TASTE],
      effects: [
        {
          say: [
            'You touch a finger to it and then to your tongue, because some part of you has apparently done this before and did not enjoy it then either.',
            'Iron. It is blood. It is almost certainly yours, at which point the enquiry stops being interesting and becomes something else.',
          ].join('\n\n'),
        },
      ],
    },
    {
      verbs: [RUB],
      effects: [
        {
          say: 'You rub at it with a corner of the coat. It has been in the wood for hours and it is planning to stay. All you achieve is a coat with a corner you will notice later.',
        },
      ],
    },
    {
      verbs: [LOOK_UNDER],
      effects: [{ say: 'Under the stain there is board, and under the board, presumably, a ceiling belonging to somebody else’s night.' }],
    },
  ],
};

export const STAIN_OBJECTS: Record<string, ObjectDefSlice> = {
  [STAIN]: stain,
};

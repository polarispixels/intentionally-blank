// §8's "miscellaneous responses the room needs" — small room-scale objects
// with one or two authored responses each.

import type { ObjectDefSlice } from '../../../../engine/world';
import { CEILING, COIN, DUST, FLOOR_BOARDS, PEN, RADIATOR, WALLPAPER, YOUR_ROOM } from '../ids';
import { CEILING_TEXT, EXAMINE, SEARCH } from '../verbs';

const floorBoards: ObjectDefSlice = {
  location: YOUR_ROOM,
  name: 'floor',
  nouns: ['floor', 'boards', 'floorboards', 'room'],
  handlers: [
    {
      // §8.1 — deliberately does NOT set `room_searched` (that's
      // SEARCH PAPERS' own — see `papers.ts`); this is the impatient
      // player's summary line, given the conclusion without the evidence.
      verbs: [SEARCH],
      effects: [
        {
          say: 'You go over the floor systematically, on the grounds that somebody else already went over everything at eye level. It takes a while and it produces dust, a dead pen, one coin, and the growing conviction that whoever was here first was thorough, unhurried, and looking for something specific enough to know when they had not found it.',
        },
      ],
    },
    {
      verbs: [EXAMINE],
      effects: [
        {
          say: 'Wide boards, waxed long ago, running toward the window. Between two of them, about a foot from the stain, there is a dark line that is not shadow.',
        },
      ],
    },
  ],
};

const dust: ObjectDefSlice = {
  location: YOUR_ROOM,
  name: 'dust',
  nouns: ['dust'],
  handlers: [
    {
      verbs: [EXAMINE],
      effects: [
        {
          say: 'The dust in this room falls into two categories: the kind that has been settling for months, and the rectangles and rings where it has not. There are more of the second kind than there ought to be.',
        },
      ],
    },
  ],
};

const pen: ObjectDefSlice = {
  location: YOUR_ROOM,
  name: 'pen',
  nouns: ['pen'],
  portable: true,
  handlers: [
    {
      verbs: [EXAMINE],
      effects: [
        { say: 'A ballpoint that gave up some time ago. It writes a clear dry groove and no ink at all. You put it in a pocket, because you appear to be the sort of person who does that.' },
        { move: [PEN, 'inventory'] },
      ],
    },
  ],
};

const coin: ObjectDefSlice = {
  location: YOUR_ROOM,
  name: 'coin',
  nouns: ['coin'],
  handlers: [
    {
      verbs: [EXAMINE],
      effects: [
        { say: 'A coin. You turn it over twice, learn its denomination and nothing else, and find that you cannot say whether it feels like a lot of money or none.' },
      ],
    },
  ],
};

const radiator: ObjectDefSlice = {
  location: YOUR_ROOM,
  name: 'radiator',
  nouns: ['radiator'],
  handlers: [
    {
      verbs: [EXAMINE],
      effects: [
        {
          say: 'Cast iron, painted the same colour as the walls by somebody who was not going to let a radiator slow them down. Cold, and ticking as it lets go of the last of the evening. It has not been fed since some hours ago.',
        },
      ],
    },
  ],
};

const wallpaper: ObjectDefSlice = {
  location: YOUR_ROOM,
  name: 'wallpaper',
  nouns: ['wallpaper', 'walls'],
  handlers: [
    {
      verbs: [EXAMINE],
      effects: [
        {
          say: 'A pattern that was probably flowers before three tenants and one landlord had opinions about it. There is a rectangle behind where the desk was in the original colour, and a nail at eye height with nothing hanging on it.',
        },
      ],
    },
  ],
};

const ceiling: ObjectDefSlice = {
  location: YOUR_ROOM,
  name: 'ceiling',
  nouns: ['ceiling'],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: CEILING_TEXT }] }],
};

export const MISC_OBJECTS: Record<string, ObjectDefSlice> = {
  [FLOOR_BOARDS]: floorBoards,
  [DUST]: dust,
  [PEN]: pen,
  [COIN]: coin,
  [RADIATOR]: radiator,
  [WALLPAPER]: wallpaper,
  [CEILING]: ceiling,
};

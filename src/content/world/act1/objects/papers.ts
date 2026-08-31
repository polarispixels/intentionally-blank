// Papers (prose doc §4.6) — the meaningful deduction's second and third
// pillars land here (§10.1).

import type { ObjectDefSlice } from '../../../../engine/world';
import { CLUE_CALM_SEARCH, CLUE_NOTHING_NAMED, FLAG_ROOM_SEARCHED, MATCHBOOK, PAPERS, YOUR_ROOM } from '../ids';
import { BURN, EXAMINE, READ, SEARCH, TAKE } from '../verbs';

const searchText = [
  'You go through them properly, sheet by sheet, on your knees, and end up with a heap of your own making, which is at least a different heap. Two things come out of it.',
  'The first is that there is nothing in here with a name on it, which you had already begun to suspect.',
  'The second is that the broken glass is underneath the paper. All of it, down to the pieces you have to find with a fingertip. And under the glass, soaked into the boards, there is a dry ring where water stood.',
  'So: the glass went over first. The paper came down on top of it afterwards, one sheet at a time, by somebody who was not hurrying.',
].join('\n\n');

const papers: ObjectDefSlice = {
  location: YOUR_ROOM,
  name: 'papers',
  nouns: ['papers', 'paper', 'sheets', 'documents', 'mess', 'forms'],
  handlers: [
    {
      verbs: [EXAMINE],
      effects: [
        {
          say: [
            'Loose sheets, dozens of them. Rent receipts. A county road map folded along every line except its own. An appliance manual for something that is not in this room. A page of arithmetic worked four times, arriving at four answers.',
            'Not one of them has a name on it. Not one of them has anything on it that would tell you a single thing about the person who lived in this room, and the more of them you go through the less that looks like an accident and the more it looks like a policy.',
          ].join('\n\n'),
        },
        { grantClue: CLUE_NOTHING_NAMED },
      ],
    },
    {
      verbs: [SEARCH, READ],
      effects: [{ say: searchText }, { set: [FLAG_ROOM_SEARCHED, true] }, { grantClue: CLUE_CALM_SEARCH }],
    },
    {
      verbs: [TAKE],
      effects: [
        {
          say: 'You gather an armful and then think about what you would do with an armful. There is nothing in here worth carrying and, more to the point, nothing in here worth carrying *away* from the place it was found.',
        },
      ],
    },
    {
      verbs: [BURN],
      effects: [
        {
          // Wayfinding §21 — with the matchbook held, the shipped line would be
          // a false statement about the player's own inventory. Rule 2 is the
          // shipped string, untouched, still right for empty hands.
          say: [
            { when: { has: MATCHBOOK }, text: 'You have the matches now, which moves this from impossible to merely stupid.\n\nThese papers are the only thing in this room that has told you anything: the glass underneath them, the dry ring where the water stood, the fact that not one sheet in the heap has a name on it. Burning them would be getting rid of the argument in order to be rid of the paper it is written on. And then, about ninety seconds later, of the only room you own.' },
            { text: 'You have nothing to light them with, and if you had, this room would go up in about ninety seconds, and it is currently the only room you own.' },
          ],
        },
      ],
    },
  ],
};

export const PAPERS_OBJECTS: Record<string, ObjectDefSlice> = {
  [PAPERS]: papers,
};

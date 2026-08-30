// The window (prose doc §5) — the room's designated secret, deliberately
// two steps deep. `WINDOW_SILL` (nouns: sill, latch, ledge) is the second
// step (§5's own noun list conflates it with plain "window"; same distinct
// EXAMINE-text-per-noun-word situation as the door's bolt).
//
// `glass`/`pane` ambiguity: dropped `glass` from this object's own noun
// list (kept on `BROKEN_GLASS` only) — a bare "examine glass" resolving to
// two different objects is real, unhelpful ambiguity this room doesn't
// need; see this task's report.

import type { ObjectDefSlice } from '../../../../engine/world';
import type { ProseRule } from '../../../../engine/prose';
import { CLUE_WINDOW_EXIT, FLAG_WINDOW_OPEN, FLOOR_LAMP, WINDOW, WINDOW_SILL, YOUR_ROOM } from '../ids';
import { BREAK, CLIMB, CLOSE, EXAMINE, OPEN, SEARCH } from '../verbs';

const examine: ProseRule[] = [
  {
    when: { not: { objectState: [FLOOR_LAMP, 'on', true] } },
    text: 'A grey rectangle, and nothing on the far side of it worth calling a view. No streetlight reaches it. Whatever is out there is being dark about it.',
  },
  {
    text: 'Two panes over two in a sash frame, uncurtained. Beyond it: a strip of dark that is an alley, a corrugated shed roof one floor down, and past that the back of another brick building with no lights in any of it.\n\nThe latch is turned to open.',
  },
];

export const WINDOW_SECRET_TEXT = [
  'The latch is not just unfastened; it has been swung right back to its stop. Along the sash there is a clean bright break in the paint, the kind you get the first time a window that was painted shut is not painted shut any more.',
  'And on the sill, in the dust that has been collecting on it since somebody last cared about this room, there are two long smears. They start at the inside edge. They stop at the outside one.',
].join('\n\n');

const windowObject: ObjectDefSlice = {
  location: YOUR_ROOM,
  name: 'window',
  nouns: ['window', 'sash', 'pane'],
  description: examine,
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: examine }] },
    { verbs: [SEARCH], effects: [{ say: WINDOW_SECRET_TEXT }, { grantClue: CLUE_WINDOW_EXIT }] },
    {
      verbs: [OPEN],
      effects: [
        {
          say: 'It goes up four inches with the sound of a house complaining, and then a good deal further, easily, the way a sash goes when it has been worked recently. Cold comes in. So does the smell of dust, cut grass, and the scoured, faintly metallic smell that arrives before rain.',
        },
        { set: [FLAG_WINDOW_OPEN, true] },
        { grantClue: CLUE_WINDOW_EXIT },
      ],
    },
    {
      verbs: [CLOSE],
      effects: [
        { say: 'You bring the sash down. The room warms by nothing at all and gets quieter by a surprising amount.' },
        { set: [FLAG_WINDOW_OPEN, false] },
      ],
    },
    {
      verbs: [CLIMB],
      effects: [
        {
          say: 'You get a knee up on the sill and stop there. It is a short drop to the shed roof and a shorter one to the alley, for somebody with a steadier head than the one you currently own.\n\nYou put the knee back where it came from. The stairs are still an option and the stairs have never thrown anybody off a shed.',
        },
      ],
    },
    { verbs: [BREAK], effects: [{ say: 'It opens. It has demonstrably opened recently. Breaking it would be a way of getting less out of the same window.' }] },
  ],
};

const sill: ObjectDefSlice = {
  location: { on: WINDOW },
  name: 'sill',
  nouns: ['sill', 'latch', 'ledge'],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: WINDOW_SECRET_TEXT }, { grantClue: CLUE_WINDOW_EXIT }] }],
};

export const WINDOW_OBJECTS: Record<string, ObjectDefSlice> = {
  [WINDOW]: windowObject,
  [WINDOW_SILL]: sill,
};

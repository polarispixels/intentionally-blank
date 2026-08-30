// The door (prose doc §4.10) and its bolt sub-part (§4.10: "plus `bolt` as
// a sub-noun" — same distinct-EXAMINE-text-per-noun-word situation as the
// fedora's hatband and the terminal's screen/cursor/keyboard).

import type { ObjectDefSlice } from '../../../../engine/world';
import type { ProseRule } from '../../../../engine/prose';
import { CLUE_BOLT_THROWN, DOOR, DOOR_BOLT, FLAG_DOOR_BOLT_DRAWN, YOUR_DOOR_OUTSIDE, YOUR_ROOM } from '../ids';
import { BREAK, CLOSE, EXAMINE, KICK, LISTEN, LOCK, LOOK_UNDER, OPEN } from '../verbs';

const examine: ProseRule[] = [
  {
    when: { not: { flag: FLAG_DOOR_BOLT_DRAWN } },
    text: 'A panel door painted the colour boarding houses are painted. There is a number on the far side of it, where numbers go for the benefit of people who are not you. On this side there is a keyhole that wants a key you do not have — and a bolt. The bolt is thrown.',
  },
  { text: 'The door, standing to. The bolt is back in its keep, where you put it.' },
];

const boltText =
  'A steel barrel bolt of the kind a lodger throws at night so the world stays outside. It is thrown. It runs in a keep screwed to the frame on this side of the door, and there is no arrangement of hardware, patience, or string by which it could have been thrown from the landing.';

const door: ObjectDefSlice = {
  location: YOUR_ROOM,
  name: 'door',
  nouns: ['door'],
  container: { open: false },
  description: examine,
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: examine }] },
    {
      // Rule 1 of §4.10's OPEN DOOR: the first opening, unbolting it.
      // Subsequent OPEN DOOR calls fall through unhandled to the built-in
      // (ordinary open/close physics from here on — the doc's own "Rule 2:
      // use open.success").
      verbs: [OPEN],
      when: { not: { flag: FLAG_DOOR_BOLT_DRAWN } },
      effects: [
        {
          say: 'You slide the bolt back. It moves without complaint, which not every bolt in a house this old would, and the door opens on a landing, a cold stairwell, and the smell of old carpet and older coffee.\n\nTwo floors down there is a lamp on, and somebody being extremely quiet about being awake.',
        },
        { set: [FLAG_DOOR_BOLT_DRAWN, true] },
        { grantClue: CLUE_BOLT_THROWN },
        { setState: [DOOR, 'open', true] },
        // Landing-bug fix: `your_door_outside` (`objects/landing.ts`) is a
        // second object for the same physical door, seen from the other
        // side (ids.ts's own note on why) — its own `open` overlay has to
        // be kept in sync here, or the Landing's `in` exit (now keyed to
        // THIS object, not `DOOR` — see `landing.ts`) can never register
        // as open, and ENTER DOOR/USE DOOR/GO THROUGH DOOR/ENTER ROOM from
        // the Landing would stay blocked even after the player has drawn
        // the bolt and stepped out.
        { setState: [YOUR_DOOR_OUTSIDE, 'open', true] },
      ],
    },
    {
      verbs: [CLOSE, LOCK],
      effects: [
        { say: 'You throw the bolt. The room is now exactly as secure as it was earlier this evening, which is a thought you decide not to follow any further tonight.' },
        { setState: [DOOR, 'open', false] },
        { setState: [YOUR_DOOR_OUTSIDE, 'open', false] },
      ],
    },
    { verbs: [LISTEN], effects: [{ say: 'A house at night, being a house. A stair tread taking weight and giving it back. A radio somewhere below, turned down to the level where it is company rather than information. Nobody is coming up.' }] },
    { verbs: [LOOK_UNDER], effects: [{ say: 'A quarter inch of gap and a strip of landing light the colour of weak tea. Nothing has been pushed under it. Nothing is standing in front of it.' }] },
    {
      verbs: [BREAK, KICK],
      effects: [
        { say: 'The door is not locked, is not stuck, and is on your side. Kicking it would be the least productive thing that has happened in this room tonight, and there is competition.' },
      ],
    },
  ],
};

const bolt: ObjectDefSlice = {
  location: { on: DOOR },
  name: 'bolt',
  nouns: ['bolt', 'latch'],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: boltText }, { grantClue: CLUE_BOLT_THROWN }] }],
};

export const DOOR_OBJECTS: Record<string, ObjectDefSlice> = {
  [DOOR]: door,
  [DOOR_BOLT]: bolt,
};

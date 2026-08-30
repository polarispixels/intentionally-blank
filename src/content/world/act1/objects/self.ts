// The player's body (prose doc §4.12) — `SELF` plus its sub-parts (§4.12's
// noun list conflates hands/forearm/head/pockets/face/coat into one object;
// same distinct-EXAMINE-text-per-noun-word situation as the fedora's
// hatband, now six times over).
//
// FIXED (was an ENGINE GAP, twice over): `SELF` used to sit at `location:
// 'inventory'` (a body is not an inventory item — and once §8 gap 2 wired a
// real `INVENTORY` command, that placement dutifully listed "yourself" as a
// carried item). The next fix moved it to a fixed `location: YOUR_ROOM` with
// `reachableInDark: true` — honest only as long as there was exactly one
// room; a second room (the Landing) broke `X ME` the moment the player
// stepped through the door, because a room-pinned object is only ever in
// scope of that one room.
//
// The actual gap was that the engine had no way to say "this is part of the
// player" at all — every existing `PlaceId` meant either a fixed spot in the
// world or something carried. `ids.ts` now has a third option, `'self'`
// (see its own doc comment): always in scope wherever the player is, always
// reachable in the dark, and — because `views.ts`'s `inventoryView` only
// ever collects `'inventory'`/`'worn'` — structurally never listed by
// `INVENTORY`. `SELF` lives there now, not at any `RoomId`.
//
// Every sub-part lives at its true place, `{ on: SELF }`, and inherits both
// scope and touch-reachability from `SELF` — `world.ts`'s `inScopeAt`/
// `reachableByTouch` recurse through `{ on }`/`{ in }` — so no sub-part
// needs a `'self'` location or a `reachableInDark` flag of its own (touching
// your own hand needs no separate authoring).

import type { ObjectDefSlice } from '../../../../engine/world';
import type { ProseRule } from '../../../../engine/prose';
import { FLAG_POCKETS_CHECKED, FLAG_WOUND_EXAMINED, FLOOR_LAMP, SELF, SELF_COAT, SELF_FACE, SELF_FOREARM, SELF_HANDS, SELF_HEAD, SELF_POCKETS } from '../ids';
import { EXAMINE, SEARCH, SMELL, TOUCH } from '../verbs';
import { V_ROLL_UP } from '../ids';

const examineSelf: ProseRule[] = [
  {
    when: { not: { objectState: [FLOOR_LAMP, 'on', true] } },
    text: 'You take inventory by touch. Two arms, both attached and both working. A coat, buttoned wrong. A floor, still there. The head is the head.',
  },
  {
    text: [
      'A man of no particular age in a coat that has been rained on and dried on him more than once. Nothing hurts except the head, which is doing enough for everything.',
      'Your clothes have been gone through. Both pockets hang inside out. The coat’s lining has been opened along one seam with something sharp and neat, and left open.',
    ].join('\n\n'),
  },
];

const searchMeText = [
  'Both pockets hang inside out like small flags. The coat’s lining has been opened along the seam and not closed again. There is a coin in the corner of the left one that whoever did this either missed or did not want.',
  'Whatever you were carrying, you are not carrying it.',
].join('\n\n');

const self: ObjectDefSlice = {
  location: 'self',
  name: 'yourself',
  // "i" dropped from the doc's noun list (validate.ts's verb-noun-collision
  // check against the WHOAMI verb's "who am i" word form — see verbs.ts).
  nouns: ['me', 'myself', 'self', 'body'],
  description: examineSelf,
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: examineSelf }] },
    { verbs: [SEARCH], effects: [{ say: searchMeText }, { set: [FLAG_POCKETS_CHECKED, true] }] },
    { verbs: [SMELL], effects: [{ say: 'Rain, cold wool, and blood, in that order of quantity.' }] },
    { verbs: [TOUCH], effects: [{ say: 'Everything is where it should be and cold, and reports in when asked.' }] },
  ],
};

const hands: ObjectDefSlice = {
  location: { on: SELF },
  name: 'hands',
  nouns: ['hands', 'hand'],
  handlers: [
    {
      verbs: [EXAMINE],
      effects: [
        {
          say: [
            'Two of them. Nothing broken, nothing bleeding, no split across any knuckle — whatever happened in this room, you did not get a turn.',
            'There is ink on the outside of the right middle finger, in the place it collects on somebody who writes a great deal by hand. Your nails are clean.',
          ].join('\n\n'),
        },
      ],
    },
  ],
};

const forearm: ObjectDefSlice = {
  location: { on: SELF },
  name: 'forearm',
  nouns: ['forearm', 'arms', 'sleeve'],
  handlers: [
    {
      verbs: [EXAMINE, V_ROLL_UP],
      effects: [
        {
          say: [
            'You push the sleeve back. Inside the left forearm, above the wrist, there is a patch of skin about the size of a postage stamp that is very slightly smoother and very slightly paler than what surrounds it.',
            'It is not a scar. It is the particular blankness skin has when something was there and a professional was paid, at length, to disagree.',
          ].join('\n\n'),
        },
      ],
    },
  ],
};

const head: ObjectDefSlice = {
  location: { on: SELF },
  name: 'head',
  nouns: ['head', 'skull', 'wound'],
  handlers: [
    {
      // Works in the dark (§8.11) — no darkRefusal gate here.
      verbs: [EXAMINE, TOUCH],
      effects: [
        {
          say: [
            'You go over the back of your skull with two fingers and find the place where the hair is stiff and the scalp is not. A short split, an inch at most, already closed and already crusted. Straight-edged.',
            'Something with an edge did that, swung by somebody who did not require a second attempt. You stop pressing on it. The pressing was not helping and the information has been received.',
          ].join('\n\n'),
        },
        { set: [FLAG_WOUND_EXAMINED, true] },
      ],
    },
  ],
};

const pockets: ObjectDefSlice = {
  location: { on: SELF },
  name: 'pockets',
  nouns: ['pockets'],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: searchMeText }, { set: [FLAG_POCKETS_CHECKED, true] }] }],
};

const face: ObjectDefSlice = {
  location: { on: SELF },
  name: 'face',
  nouns: ['face'],
  handlers: [
    {
      verbs: [EXAMINE],
      effects: [{ say: 'You go over it with your fingertips, which is the only method currently available. A few days of beard. A nose that has been somewhere. It is a face. You will take somebody’s word for the rest.' }],
    },
  ],
};

const coat: ObjectDefSlice = {
  location: { on: SELF },
  name: 'coat',
  nouns: ['coat', 'clothes'],
  handlers: [
    {
      verbs: [EXAMINE],
      effects: [
        {
          say: 'A heavy coat, dark, cut for weather rather than for anybody’s opinion. Under it a shirt and no tie. Nothing monogrammed, nothing labelled, nothing with a laundry mark. Somebody has been through all of it and put none of it back.',
        },
      ],
    },
  ],
};

export const SELF_OBJECTS: Record<string, ObjectDefSlice> = {
  [SELF]: self,
  [SELF_HANDS]: hands,
  [SELF_FOREARM]: forearm,
  [SELF_HEAD]: head,
  [SELF_POCKETS]: pockets,
  [SELF_FACE]: face,
  [SELF_COAT]: coat,
};

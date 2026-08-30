// Floor lamp (prose doc §4.2). `switchable`/`lightSource`; the actual
// on/off toggle lives on the pull chain (`pullChain.ts`) — TURN ON/TURN OFF
// typed directly at the lamp just explains that and changes nothing.

import type { ObjectDefSlice } from '../../../../engine/world';
import type { ProseRule } from '../../../../engine/prose';
import { FLAG_LAMP_RIGHTED, FLOOR_LAMP, YOUR_ROOM } from '../ids';
import { BREAK, EXAMINE, LOOK_UNDER, MOVE, PULL, PUSH, STAND, TAKE, TURN, TURN_OFF, TURN_ON } from '../verbs';
import { V_RIGHT, V_TIP } from '../ids';

const examine: ProseRule[] = [
  {
    when: { all: [{ objectState: [FLOOR_LAMP, 'on', true] }, { not: { flag: FLAG_LAMP_RIGHTED } }] },
    text: 'A floor lamp on its side, burning. The shade has come half off and sits at an angle, so the bulb throws its light sideways across the boards and up the walls. Every small thing on this floor has been given a shadow ten times its size and is making the most of it.',
  },
  {
    when: { all: [{ objectState: [FLOOR_LAMP, 'on', true] }, { flag: FLAG_LAMP_RIGHTED }] },
    text: 'Upright and lit: a plain iron standard, a shade the colour of weak tea, a bulb of the old filament kind that takes a second to think about it. It lights the room the way it was designed to, which is adequately and from above.',
  },
  {
    when: { not: { flag: FLAG_LAMP_RIGHTED } },
    text: 'On its side where it fell. Heavier than it looks — most of it is a cast-iron foot pretending to be decorative. The shade is dented. A short chain hangs off the fitting.',
  },
  { text: 'Upright, unlit, and patient about it. A short chain hangs off the fitting.' },
];

const rightTheLamp =
  'You get the lamp upright. It takes both hands and a pause in the middle that you spend with your eyes shut. Standing, it throws its light downward the way light is supposed to go, and the room stops looking like a photograph of itself and starts looking like a room.';

const tipTheLamp =
  'You lay the lamp back down on its side, carefully, which is a strange thing to do to a lamp and an even stranger thing to be careful about. The shadows climb the walls again.';

const floorLamp: ObjectDefSlice = {
  location: YOUR_ROOM,
  name: 'floor lamp',
  nouns: ['lamp', 'floor lamp', 'standard lamp', 'light', 'bulb', 'shade'],
  lightSource: true,
  switchable: true,
  description: examine,
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: examine }] },
    { verbs: [TURN_ON, TURN_OFF], effects: [{ say: 'There is no switch on the body of it. There is a chain.' }] },
    {
      verbs: [TAKE],
      effects: [
        {
          say: 'You get both hands on it and discover that most of a floor lamp is the part that stops it being carried. It stays.',
        },
      ],
    },
    {
      verbs: [MOVE, PUSH, PULL, TURN, STAND, V_RIGHT],
      when: { not: { flag: FLAG_LAMP_RIGHTED } },
      effects: [{ say: rightTheLamp }, { set: [FLAG_LAMP_RIGHTED, true] }],
    },
    {
      verbs: [PUSH, V_TIP],
      when: { flag: FLAG_LAMP_RIGHTED },
      effects: [{ say: tipTheLamp }, { set: [FLAG_LAMP_RIGHTED, false] }],
    },
    {
      verbs: [BREAK],
      effects: [{ say: 'You weigh up breaking the only working light in a dark room. The weighing is where it ends.' }],
    },
    {
      verbs: [LOOK_UNDER],
      effects: [
        {
          say: 'Under the lamp there is the pale ring of floor where its foot has stood without moving for years, and a quantity of dust that has been undisturbed for most of that. The lamp did not walk here. Something put it down.',
        },
      ],
    },
  ],
};

export const FLOOR_LAMP_OBJECTS: Record<string, ObjectDefSlice> = {
  [FLOOR_LAMP]: floorLamp,
};

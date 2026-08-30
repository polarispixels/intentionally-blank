// The old computer terminal (prose doc §4.9) and its screen/cursor/keyboard
// sub-parts (§4.9's own noun list conflates them into one object; distinct
// EXAMINE text per noun word needs distinct `ObjectId`s — see `ids.ts`).

import type { ObjectDefSlice } from '../../../../engine/world';
import type { ProseRule } from '../../../../engine/prose';
import { CLUE_TERMINAL_BURN, TERMINAL, TERMINAL_CURSOR, TERMINAL_KEYBOARD, TERMINAL_SCREEN, YOUR_ROOM } from '../ids';
import { BREAK, EXAMINE, LISTEN, LOOK_BEHIND, TAKE, TURN_OFF, TURN_ON } from '../verbs';
import { V_UNPLUG } from '../ids';

const examine: ProseRule[] = [
  {
    when: { not: { objectState: [TERMINAL, 'on', true] } },
    text: 'A computer of the kind that stopped being manufactured well before it stopped being used. Beige gone the colour of weak tea. A screen with actual depth to it. A keyboard whose keys have been worn blank in exactly the places a person’s fingers live.\n\nIt sits on its own stand, squared up to the corner. It is the only thing in this room that has not been knocked over, tipped out, or gone through.',
  },
  {
    text: 'The same tea-coloured machine, awake now, humming at a pitch you can feel in the fillings you presumably have. Something inside it is spinning and has been since you turned it on, at a steady rate, like it has all night.',
  },
];

const terminal: ObjectDefSlice = {
  location: YOUR_ROOM,
  name: 'terminal',
  nouns: ['terminal', 'computer', 'machine', 'monitor'],
  switchable: true,
  description: examine,
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: examine }] },
    {
      verbs: [TURN_ON],
      effects: [
        {
          say: 'The switch is a real switch: it travels a quarter of an inch and stays where you put it. Something inside spins up to speed and keeps going. The screen warms from black to a black with weather in it, and then, unhurried, prints:\n\n    USER:\n\nand a cursor, blinking at about the rate of a resting heart.',
        },
        { setState: [TERMINAL, 'on', true] },
      ],
    },
    {
      verbs: [TURN_OFF],
      effects: [
        {
          say: 'You cut the power. The image collapses to a bright line and then a bright point, and the point takes its time going out. The spinning inside winds down over the following minute, which is longer than you expected and long enough to notice.',
        },
        { setState: [TERMINAL, 'on', false] },
      ],
    },
    { verbs: [LOOK_BEHIND], effects: [{ say: 'Behind the stand: a power cable going where power cables go, and two ports of a shape that has not been current in your lifetime, both empty. There is nowhere on this machine for a network to connect. It has been sitting in this corner, awake or asleep, talking to absolutely nobody.' }] },
    { verbs: [TAKE], effects: [{ say: 'You get a hand behind it. It has the density of a thing built before the industry discovered that customers would accept less. It stays.' }] },
    { verbs: [BREAK], effects: [{ say: 'You could put a fist through the screen. It would take one swing, it would answer nothing, and you would spend the rest of the night picking glass out of the only room you can currently get into.' }] },
    { verbs: [V_UNPLUG], effects: [{ say: 'You could. There is a great deal in this room you do not understand and exactly one thing in it that is still running.' }] },
    {
      verbs: [LISTEN],
      effects: [
        { say: 'A steady mechanical hum with something turning inside it, and under that, every forty seconds or so, a small click, as if it were checking something and finding it unchanged.' },
      ],
    },
  ],
};

const screen: ObjectDefSlice = {
  location: { on: TERMINAL },
  name: 'screen',
  nouns: ['screen'],
  handlers: [
    {
      verbs: [EXAMINE],
      when: { not: { objectState: [TERMINAL, 'on', true] } },
      effects: [
        {
          say: 'Curved glass with a grey depth to it, and burned faintly into the phosphor — permanently, the way only years will do it — the ghost of a word that has sat in the same place for a very long time.\n\nYou can almost read it. USER, probably. Whatever this machine has been asking, it has been asking it for a while.',
        },
        { grantClue: CLUE_TERMINAL_BURN },
      ],
    },
    {
      verbs: [EXAMINE],
      effects: [
        { say: 'The live text sits directly on top of the burned-in ghost of itself, very slightly offset, so every character has a pale twin standing just behind it.' },
        { grantClue: CLUE_TERMINAL_BURN },
      ],
    },
  ],
};

const cursor: ObjectDefSlice = {
  location: { on: TERMINAL },
  name: 'cursor',
  nouns: ['cursor'],
  handlers: [
    {
      verbs: [EXAMINE],
      effects: [
        {
          say: [
            'The cursor blinks. You watch it do this eleven times. On the twelfth you conclude that whatever you are waiting for is not going to be delivered by a cursor.',
            'It blinks at a steady rate that your headache has decided to match.',
          ],
        },
      ],
    },
  ],
};

const keyboard: ObjectDefSlice = {
  location: { on: TERMINAL },
  name: 'keyboard',
  nouns: ['keyboard'],
  handlers: [
    {
      verbs: [EXAMINE],
      effects: [
        {
          say: 'The letters have worn off the keys a person actually uses and stayed sharp on the ones nobody does. From the pattern of what is missing you could probably reconstruct several years of somebody’s typing, if you knew what you were looking for and had a week.',
        },
      ],
    },
  ],
};

export const TERMINAL_OBJECTS: Record<string, ObjectDefSlice> = {
  [TERMINAL]: terminal,
  [TERMINAL_SCREEN]: screen,
  [TERMINAL_CURSOR]: cursor,
  [TERMINAL_KEYBOARD]: keyboard,
};

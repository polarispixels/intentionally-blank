// Dot — Wall Drug's counter (D1 prose doc §9). Prose transcribed verbatim
// (hard rule 5). Schedule: night -> offstage (a BACK IN 10 MIN card;
// register entry 52 — Dot works days, the store never closes), else the
// Emporium.

import type { Effect } from '../../../engine/effects';
import type { EventDef, NpcDefSlice, ShowResponseDef, TopicDef } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { CLAIM_TICKET, FEDORA, INTACT_POLAROIDS, WALL_DRUG_CUP } from '../act1/ids';
import {
  ACT2_CACHE_BOX,
  ACT2_CACHE_FOUND,
  ACT2_CACHE_POLAROID,
  ACT2_CLUE_DOT_HAT,
  ACT2_DOT,
  ACT2_DOT_REMEMBERS_HAT,
  ACT2_DOT_TOPIC_CORRIDOR,
  ACT2_DOT_TOPIC_DINOSAUR,
  ACT2_DOT_TOPIC_HAT,
  ACT2_DOT_TOPIC_JULES,
  ACT2_DOT_TOPIC_PLANT,
  ACT2_DOT_TOPIC_ROAD,
  ACT2_DOT_TOPIC_TERMINAL,
  ACT2_DOT_TOPIC_TICKET,
  ACT2_DOT_TOPIC_WATER,
  ACT2_NOTEBOOK,
  ACT2_WALL_DRUG_EMPORIUM,
  EVENT_ACT2_DOT_AGENDA,
} from './ids';

// ---------------------------------------------------------------------------
// §9.1 — examine
// ---------------------------------------------------------------------------

const description =
  'Sixty-ish, cardigan over a store apron, reading glasses on a cord that has been knotted where it broke. The name badge has been on so many cardigans that there is a small permanent hole in the same place on this one.\n\nShe is doing four things. One of them is talking to you and it does not appear to be costing her anything.';

// ---------------------------------------------------------------------------
// §9.2 — greeting (3 rules)
// ---------------------------------------------------------------------------

const greeting: ProseRule[] = [
  {
    when: { not: { met: ACT2_DOT } },
    text: '"Free ice water," she says, before you are all the way to the counter, because that is what she says. "End of the counter there, cups are the ones with the red on."\n\nThen she looks at your head. "And there\'s a chair."',
  },
  {
    when: { flag: ACT2_CACHE_FOUND },
    text: '"Get what you were after?" She asks it the way she asks everybody, and she is already halfway into the next thing.',
  },
  { text: '"Still here," she says, approvingly, about you, and keeps moving.' },
];

// ---------------------------------------------------------------------------
// §9.3 — unknownTopic (3, rotating)
// ---------------------------------------------------------------------------

const unknownTopic: string[] = [
  '"Couldn\'t tell you." No apology in it at all. She has said it forty times today and it has never once been a failure.',
  '"You\'d want somebody who\'s been here longer than me." She says this without any suggestion that such a person exists.',
  '"Now that I don\'t know." A tray goes down. "And I\'ll not make something up for you, because people do, and then it\'s in the world."',
];

// ---------------------------------------------------------------------------
// §9.5 — topics (nine) and §9.6 — shows (six). `topic_ticket`/
// `SHOW TICKET TO DOT` and `topic_hat`/`SHOW FEDORA TO DOT` share one
// response each (the doc's own "-> topic_ticket, above" / "-> topic_hat,
// above" instruction) — declared once, reused by both.
// ---------------------------------------------------------------------------

// Topic ids themselves are declared in `./ids` (`ACT2_DOT_TOPIC_*`) — see
// that file's own note on why (unlike `pearl.ts`'s act1 precedent).
const TOPIC_TICKET = ACT2_DOT_TOPIC_TICKET;
const TOPIC_HAT = ACT2_DOT_TOPIC_HAT;
const TOPIC_JULES = ACT2_DOT_TOPIC_JULES;
const TOPIC_WATER = ACT2_DOT_TOPIC_WATER;
const TOPIC_DINOSAUR = ACT2_DOT_TOPIC_DINOSAUR;
const TOPIC_CORRIDOR = ACT2_DOT_TOPIC_CORRIDOR;
const TOPIC_TERMINAL = ACT2_DOT_TOPIC_TERMINAL;
const TOPIC_ROAD = ACT2_DOT_TOPIC_ROAD;
const TOPIC_PLANT = ACT2_DOT_TOPIC_PLANT;

const ticketText =
  'She takes it and holds it out to the length of her arm and then gives up and puts the glasses on.\n\n"Oh, that\'s an old one." Not surprised. Interested. "We stopped writing them like that — that\'s a four-thousand, that\'s back of the corridor, bay E, if anybody\'s kept the bays straight, which they haven\'t."\n\nShe lifts the flap in the counter. "Two minutes."\n\nIt is longer than two minutes. She comes back along the corridor with a shoe box under one arm, blows the top of it off across the floor rather than at you, and sets it down.\n\n"There\'s no date on the tag," she says. "So either he left it Tuesday or he left it before I was born. Have a look and don\'t take anything that isn\'t yours."';

const ticketEffects: Effect[] = [{ set: [ACT2_CACHE_FOUND, true] }, { reveal: ACT2_CACHE_BOX }, { move: [ACT2_CACHE_BOX, ACT2_WALL_DRUG_EMPORIUM] }];

const hatText =
  'She stops the four things.\n\n"There was a fella in a hat like that at this counter. Months back — and don\'t ask me how many, because I\'d guess and you\'d write it down." She puts a knuckle on the counter, on a particular spot, about a third of the way along. "There. Sat there most of an afternoon with a little hard-backed book, and wrote in it, and had the water, and bought nothing, and I\'d have moved anybody else on."\n\nWhy she didn\'t is not something she offers.\n\n"Grey. Brim came down on the one side, like yours has. I could draw you the hat." She looks at you, and something goes out of her face that had been there for the whole conversation. "And I could not tell you one thing about his face. Not one. And I\'m good at faces, mister. It\'s the job."';

const hatEffects: Effect[] = [{ set: [ACT2_DOT_REMEMBERS_HAT, true] }, { grantClue: ACT2_CLUE_DOT_HAT }];

const topics: TopicDef[] = [
  {
    id: TOPIC_TICKET,
    words: ['ticket', 'claim', 'claim ticket', 'stub', 'number', '4417', 'hold', 'pickup', 'parcel'],
    when: { has: CLAIM_TICKET },
    response: ticketText,
    effects: [...ticketEffects],
  },
  {
    id: TOPIC_HAT,
    words: ['hat', 'fedora', 'felt', 'grey hat', 'brim', 'man in a hat'],
    response: hatText,
    effects: [...hatEffects],
  },
  {
    id: TOPIC_JULES,
    words: ['man', 'fella', 'him', 'brother', 'missing', 'missing man', 'supervisor', 'who left it', 'depositor'],
    response:
      '"Names? No. Nothing takes a name here." She is not being unhelpful; she is describing the premises. "There\'s no book. There\'s a tag and there\'s a number, and if the number\'s yours the thing\'s yours."\n\nA bus\'s worth of people come through the far arch. "Four hundred a day through here in July, and half of them ask me where the toilets are, and I have never once needed to know who any of them were."',
  },
  {
    id: TOPIC_WATER,
    words: ['water', 'ice water', 'free', 'urn', 'cup', 'cups'],
    response:
      '"Free." She says it like a fact of geology. "It was free when my mother came in here off a hot road with two children and it\'ll be free after me. That\'s not generosity, that\'s what the place is."',
  },
  {
    id: TOPIC_DINOSAUR,
    words: ['dinosaur', 't-rex', 'trex', 'rex', 'lizard', 'machine', 'animatronic'],
    response:
      '"Going when I started." She says it to the ceiling, roughly in its direction. "Fella comes and greases it. Not that one on the porch — a different fella, with a van."\n\nShe thinks about it for the first time in some years. "Never met anybody who was here before it. You\'d think you would."',
  },
  {
    id: TOPIC_CORRIDOR,
    words: ['corridor', 'back', 'bays', 'shelves', 'shelving', 'claim', 'window', 'hatch', 'storeroom', 'store room'],
    response:
      '"Go on back if you want. Mind the step at the far end, it\'s a step and then it\'s another step and nobody ever believes me."\n\nShe is already looking at somebody else. "It\'s boxes. It\'s been boxes since before boxes."',
  },
  {
    id: TOPIC_TERMINAL,
    words: ['terminal', 'computer', 'screen', 'machine', 'keyboard'],
    response:
      '"Came with the building." A shrug that involves no part of her above the elbows. "It\'s never been on in my time. There\'s a fella says it\'s worth something, and there\'s a fella says that about everything in here."',
  },
  {
    id: TOPIC_ROAD,
    words: ['road', 'highway', 'miles', 'distance', 'thirty-two', '32', 'town', 'county road', 'signs'],
    response:
      '"Thirty-two." Immediate, and slightly amused that anybody would ask. "Always has been. That\'s on every sign between here and there and it\'s the first thing anybody in this building could tell you."',
  },
  {
    id: TOPIC_PLANT,
    words: ['plant', 'facility', 'works', 'lights', 'data centre', 'data center', 'north', 'fence'],
    response:
      '"They come in on their way through, some of them. Nice enough. They buy coffee and they don\'t buy anything else, and they don\'t talk about it, and you\'d not either."\n\nShe wipes the counter where nothing is. "Big lit-up thing on a flat piece of ground. My uncle had cattle on that."',
  },
];

// §9.6 — the porch Polaroid is the shipped intact Polaroid (wave 5 §9.4,
// `INTACT_POLAROIDS`) — see this file's own report for why (the wave-5
// object's own description is the one that names "short-sleeved shirt, no
// hat," which rule 1's "was he wearing his hat?" line depends on).
const showResponses: ShowResponseDef[] = [
  { objects: [CLAIM_TICKET], response: ticketText, effects: [...ticketEffects] },
  {
    objects: [FEDORA],
    response: `She has it out of your hand before you have finished offering it, and turns it over once, and gives it straight back.\n\n${hatText}`,
    effects: [...hatEffects],
  },
  {
    objects: [WALL_DRUG_CUP],
    response: '"That\'s ours." She is pleased in a way that is entirely disproportionate and entirely genuine. "Stack\'s on the end there. Take a fresh one, that\'s been in a bin."',
  },
  {
    objects: [INTACT_POLAROIDS],
    response: [
      {
        when: { flag: ACT2_DOT_REMEMBERS_HAT },
        text:
          'She puts the glasses on for it and takes her time, which is more than the photograph has been given by anybody else tonight.\n\n"No," she says at last, and she is sorry about it. "That\'s a porch and those are people."\n\nShe hands it back, and then stops with it half-returned. "Was he wearing his hat?"',
      },
      {
        text:
          'She puts the glasses on for it, and looks, and hands it back.\n\n"That\'s a porch and those are people. I\'d not know one of them from the next." No apology; it is a professional statement about what she is able to do.',
      },
    ] satisfies ProseRule[],
  },
  {
    objects: [ACT2_CACHE_POLAROID],
    response:
      '"That\'s the hat," she says, instantly, and puts a finger on the brim through the plastic. "That\'s the hat, that\'s the side it comes down, that\'s him."\n\nThen she looks at the rest of the photograph for a while, politely, the way you look at a stranger.',
  },
  {
    objects: [ACT2_NOTEBOOK],
    response:
      '"So that\'s what he was writing in." She does not reach for it. "Little hard back, that\'s it, and the elastic round it."\n\nShe goes back to the tray she was doing. "Well. He got his book back off somebody, then. Good."',
  },
];

// ---------------------------------------------------------------------------
// §9.4 — the agenda line (a `world.events` entry)
// ---------------------------------------------------------------------------

export const ACT2_DOT_AGENDA_EVENT: EventDef = {
  id: EVENT_ACT2_DOT_AGENDA,
  when: { all: [{ flag: ACT2_DOT_REMEMBERS_HAT }, { not: { flag: ACT2_CACHE_FOUND } }] },
  onlyIfWitnessed: true,
  witnessedWhen: { at: ACT2_WALL_DRUG_EMPORIUM },
  effects: [
    {
      say:
        '"That book he had," Dot says, from the other end of the counter, to nobody in particular. "He wasn\'t writing a letter. I\'ve watched a hundred people write a letter."',
    },
  ],
};

// ---------------------------------------------------------------------------
// The NPC.
// ---------------------------------------------------------------------------

export const dot: NpcDefSlice = {
  schedule: [{ when: { clockPhase: 'night' }, room: 'offstage' }, { room: ACT2_WALL_DRUG_EMPORIUM }],
  nouns: ['dot', 'woman', 'clerk', 'cashier', 'her'],
  adjectives: ['store'],
  name: 'Dot',
  pronoun: 'she',
  description,
  topics,
  showResponses,
  unknownTopic,
  greeting,
};

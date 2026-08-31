// Pearl — the game's third NPC
// (`docs/superpowers/specs/2026-09-04-act1-wave3-prose.md` §6). Prose
// transcribed exactly (hard rule 5).
//
// ENGINE GAP (same one `marlow.ts`/`whitlock.ts` already document, not
// re-litigated here): `NpcDefSlice.greeting` is plain `Prose`, rendered via
// `render()` only, never `apply()` — a greeting rule can never run an
// `Effect`. §6.4's rule 1 "sets met_pearl" is therefore handled the same
// way `met_whitlock`/`met_marlow` are: `sundown_diner`'s own `onEnter` sets
// the flag (`sundownDiner.ts`), which fires before any greeting can — rule
// 1 below is transcribed exactly regardless (hard rule 5), and rule 2's
// rotation is what a player actually sees, including on the first greeting.
//
// SCHEDULE: §6's own header — "one post, all phases" (architecture §4 item
// 10: minor engines get one agenda line and no schedule beyond post) — is
// an unconditional `ScheduleRule` with no `when` at all, not a phase table
// like Whitlock's night-post amendment.

import { T } from '../../../engine/ids';
import type { NpcDefSlice, ShowResponseDef, TopicDef } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { FLAG_MET_PEARL, FLAG_PEARL_NOTICED_YOU, FLAG_TOLD_PEARL_ABOUT_ROOM, MUG, PAGE_78, PEARL, PIE_BOX, SUNDOWN_DINER, V_ATTACK, V_FOLLOW, V_HUG, V_KISS } from './ids';
import { ACT2_HORSE_BORROWED } from '../act2/ids';

// ---------------------------------------------------------------------------
// §6.3 — unknownTopic
// ---------------------------------------------------------------------------

const unknownTopic: string[] = [
  '"Oh, that I couldn\'t tell you." She says it cheerfully and does not slow down.',
  "She starts answering before you have finished asking, and what comes out is about her sister's boy and a truck, and it is not about what you asked.",
  '"Somebody knows that," she says, and puts a plate down as though that settled it.',
];

// ---------------------------------------------------------------------------
// §6.2 — description
// ---------------------------------------------------------------------------

const description =
  'Seventy, moving like somebody who worked out the shortest route between every two points in this room a long time ago and stopped thinking about it. Apron over a cardigan. Reading glasses in her hair and a second pair on a chain, and she uses neither.\n\nShe looks at the side of your head, then at the rest of you, and decides you need feeding.';

// ---------------------------------------------------------------------------
// §6.4 — greeting
// ---------------------------------------------------------------------------

const greeting: ProseRule[] = [
  {
    // Reachable as of v0.8.0: the engine now marks an NPC met after the first exchange (`npc.ts`'s `markMet`), so this is exactly the first HELLO.
    when: { not: { met: PEARL } },
    text: '"Well, sit down," she says, as though you had been arguing about it. "You want the coffee, you want the eggs, and you don\'t want to talk about your head, so we won\'t."\n\nShe is pouring before the stool has stopped turning.',
  },
  {
    text: [
      '"Shift comes off at four and the buses take most of them home," she says to the griddle. "The ones who come in here come in about half past."',
      '"My mother had this counter and her mother had the ground under it," she says, wiping a stretch that does not need it. "There\'s been a Sundown on this corner longer than there\'s been a county to put it in."',
      '"Marlow\'s got you, then." She does not make it a question. "He\'ll not have said two words. He\'s been quiet since he was forty."',
    ],
  },
];

// ---------------------------------------------------------------------------
// §6.5 — topics (seven)
// ---------------------------------------------------------------------------

const TOPIC_DINER_NAME = T('act1_pearl_topic_diner_name');
const TOPIC_PEARL = T('act1_pearl_topic_pearl');
const TOPIC_PLANT = T('act1_pearl_topic_plant');
const TOPIC_TOWN = T('act1_pearl_topic_town');
const TOPIC_HEAD = T('act1_pearl_topic_head');
const TOPIC_MARLOW = T('act1_pearl_topic_marlow');
const TOPIC_WHITLOCK = T('act1_pearl_topic_whitlock');
// Jack (wave 4) — §9 of `docs/superpowers/specs/2026-09-05-act1-wave4-
// prose.md`, the eighth and last topic, appended after `topic_whitlock`;
// nothing else in this file changes.
const TOPIC_JACK = T('act1_pearl_topic_jack');
// Wave 5 (§12) — the ninth entry, appended after `topic_jack`.
const TOPIC_PIE_TO_GO = T('act1_pearl_topic_pie_to_go');
// D1 amendment (Stage D1 prose doc §17).
const TOPIC_HORSES = T('act1_pearl_topic_horses');

const topics: TopicDef[] = [
  {
    id: TOPIC_DINER_NAME,
    words: ['sundown', 'sundowner', 'name', 'diner', 'cafe', 'café', 'place', 'sign', 'mug', 'mugs', 'spelling', 'spelt', 'spelled'],
    response:
      '"The Sundown," she says. "My mother\'s, and her mother had the ground under it, and that\'s the original glass."\n\nShe follows your eye to the shelf without stopping what her hands are doing. "Those came back wrong from the pottery, a run of them, years back. I wasn\'t sending the lot to Sioux Falls over an R." A mug goes up beside the others, upside down. "You\'ll turn up a right one if you keep looking."',
  },
  {
    id: TOPIC_PEARL,
    words: ['you', 'yourself', 'pearl', 'job', 'work', 'hours', 'open', 'early', 'time', 'clock'],
    response: '"Pearl. Fifty-one years this side of the counter and I\'ve been late twice." The griddle gets a wipe. "I open at four. Nobody makes me. I\'d not know what else to do at four."',
  },
  {
    id: TOPIC_PLANT,
    words: ['plant', 'bus', 'buses', 'shift', 'north', 'glow', 'light', 'lights', 'works', 'factory', 'job', 'jobs'],
    response:
      '"Shift comes off at four and the buses run them back. Half of them sleep on it. The ones who come in here are the ones with nobody at home."\n\nA glance at the window. "Good wage. Long way to sit."',
  },
  {
    id: TOPIC_TOWN,
    words: ['town', 'people', 'here', 'county', 'everybody', 'who', 'news', 'gossip', 'strangers'],
    response:
      '"Nine hundred and something," she says. "It was more. Everybody\'s somebody\'s, though. You\'ll not meet a stranger in here twice."\n\nShe stops with a plate in each hand and looks at you, for the first time without doing anything else. "And I\'ve not met you once."\n\nThen she is moving. "Eggs."',
    effects: [{ set: [FLAG_PEARL_NOTICED_YOU, true] }],
  },
  {
    id: TOPIC_HEAD,
    words: ['head', 'wound', 'hurt', 'blood', 'injury', 'doctor', 'clinic', 'hospital', 'pain'],
    response:
      '"Clinic\'s at nine and you\'ll not die before it, which I know because you\'d not be sitting up."\n\nA plate arrives. "Eat that and the rest gets easier to think about. That\'s not a theory, it\'s fifty years of men coming in here in a state."',
  },
  {
    id: TOPIC_MARLOW,
    words: ['marlow', 'clerk', 'boarding house', 'house', 'hotel', 'landlord', 'desk'],
    response:
      '"He\'s been on that desk since the Hendricks had the building. He\'ll not tell you a thing, and he\'ll not tell anybody a thing about you either, and there\'s people who\'d call that handsome." The griddle gets scraped. "He was married. She\'s up at the church end now."',
  },
  {
    id: TOPIC_WHITLOCK,
    words: ['sheriff', 'whitlock', 'dana', 'law', 'police', 'cops', 'records', 'database', 'computer'],
    response:
      '"Dana. She was one of mine in that end booth doing her homework and now she carries a gun and won\'t sit down." A cloth goes over her shoulder. "If she tells you a thing it\'s true. But she\'ll not tell you a thing she can\'t get off that computer, and there\'s a deal in this town that never got on it."',
  },
  {
    id: TOPIC_JACK,
    words: ['jack', 'truck', 'monster truck', 'the man with the truck', 'motel', 'arrowhead', 'stranger', 'visitor'],
    response:
      '"Jack? He\'s in at six most mornings, and he has the eggs, and he asks people things." She says it exactly the way she says the weather. "Been doing it since the start of last month. He\'s not sleeping and it\'s got into his talk, and there\'s two or three won\'t sit by him now."\n\nA plate goes down somewhere. "He\'s a good boy carrying a thing. I put food in front of him and he eats it. That\'s not nothing."',
  },
  {
    id: TOPIC_PIE_TO_GO,
    words: ['pie', 'slice', 'box', 'to go', 'takeaway', 'take away', 'wrap', 'for the road', 'rhubarb', 'dessert'],
    response: [
      {
        when: { not: { has: PIE_BOX } },
        text: '"Take it with you, then." She has a box out of the stack under the counter and folded before you have said which one you wanted, and the slice goes in on its side.\n\nShe writes nothing down. "Bring the box back or don\'t. It\'s a box."',
      },
      {
        text: '"You\'ve got one." She does not look up from the griddle. "It\'s not going to get any older than it already is."',
      },
    ] satisfies ProseRule[],
    // Grants once — a second ask while already carrying one just gets rule 2's text (§12's own instruction).
    effects: [{ if: { when: { not: { has: PIE_BOX } }, then: [{ move: [PIE_BOX, 'inventory'] }] } }],
  },
  // D1 amendment (Stage D1 prose doc §17) — sets `act2_horse_borrowed`.
  {
    id: TOPIC_HORSES,
    words: ['horse', 'horses', 'rail', 'hitching rail', 'whose horses', 'owner'],
    response: '"Whose?" She thinks about it while doing three other things. "They\'re at the\nrail. They\'ve been at the rail since I\'ve been looking at that rail." A pan\ncomes off the heat. "Somebody feeds them, because they\'re fed."',
    effects: [{ set: [ACT2_HORSE_BORROWED, true] }],
  },
];

// ---------------------------------------------------------------------------
// §6.6 — tellTopics (one override)
// ---------------------------------------------------------------------------

const TELL_ROOM = T('act1_pearl_tell_room');

const tellTopics: TopicDef[] = [
  {
    id: TELL_ROOM,
    words: ['room', 'attack', 'attacked', 'robbed', 'search', 'searched', 'break in', 'breakin', 'burglary', 'ransacked', 'crime', 'night'],
    response:
      'She stops with the pot in the air. "In your room. While you were in it."\n\nShe asks what time, and whether the door was forced, and what they took — and when you cannot name one thing that has gone, she puts the pot down.\n\n"Then they wanted a thing, not things." Back to the griddle, the rest said with her back to you. "That\'s a different sort of trouble. You\'d best find out what you had."',
    effects: [{ set: [FLAG_TOLD_PEARL_ABOUT_ROOM, true] }],
  },
];

// ---------------------------------------------------------------------------
// §6.7 — showResponses
// ---------------------------------------------------------------------------

const showResponses: ShowResponseDef[] = [
  {
    objects: [MUG],
    response: 'She takes it out of your hand, fills it, and puts it back in the hand. The question you were forming does not survive the coffee.',
  },
  {
    objects: [PAGE_78],
    response: '"That\'s your paper," she says agreeably, and puts it down beside your plate where it will not get wet.',
  },
];

// ---------------------------------------------------------------------------
// §6.8 — handlers
// ---------------------------------------------------------------------------

const attackText = 'The thought gets as far as the plate in front of you and stops there.';
const kissHugText = 'She allows about a second and a half of it and puts you back on the stool with one hand, which is where you were going anyway.';
const followText = '"I\'m behind the counter." She is, in fact, in four places behind it. "You stay in front."';

export const pearl: NpcDefSlice = {
  // §6's own header — "one post, all phases" (architecture §4 item 10).
  schedule: [{ room: SUNDOWN_DINER }],
  nouns: ['pearl', 'woman', 'waitress', 'cook', 'owner', 'apron', 'lady', 'her'],
  adjectives: ['old'],
  name: 'Pearl',
  pronoun: 'she',
  description,
  topics,
  tellTopics,
  showResponses,
  unknownTopic,
  greeting,
  handlers: [
    { verbs: [V_ATTACK], effects: [{ say: attackText }] },
    // `hug` moved from V_KISS to its own V_HUG in wave 4 (Jack answers the two differently); Pearl's one text still covers both.
    { verbs: [V_KISS, V_HUG], effects: [{ say: kissHugText }] },
    { verbs: [V_FOLLOW], effects: [{ say: followText }] },
  ],
};

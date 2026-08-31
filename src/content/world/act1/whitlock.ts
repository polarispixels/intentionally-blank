// Sheriff Dana Whitlock — the game's second NPC
// (`docs/superpowers/specs/2026-09-03-act1-wave2-prose.md` §12.6). Prose
// transcribed exactly (hard rule 5). `topic_evidence` and `topic_town` are
// cut per this task's own brief (§5: "the writer's own trim") — cutting
// means not transcribing them; nothing else changed.
//
// CANON — register entry 28 (settled, per this task's brief): Whitlock has
// a night post. Architecture's own schedule for her (office mornings,
// patrol afternoons, poker Fridays) has no night entry; the schedule below
// adds one, exactly as authored in §12.6's own header.
//
// ENGINE GAP (same one `marlow.ts` already documents, not re-litigated
// here): `NpcDefSlice.greeting` is plain `Prose`, rendered via `render()`
// only, never `apply()` — a greeting rule can never run an `Effect`. Rule
// 1's own "sets met_whitlock" is therefore handled the same way front-
// desk-prose's `met_marlow` is: `sheriff_office`'s own `onEnter` sets the
// flag (`sheriffOffice.ts`), which — per the same timing note `marlow.ts`
// makes — means rule 1 is structurally unreachable in play (the flag is
// already true by the time any greeting can fire) and rule 3's rotation is
// what a player actually sees, including on the first greeting. Transcribed
// exactly regardless (hard rule 5).

import { T } from '../../../engine/ids';
import type { Effect } from '../../../engine/effects';
import type { NpcDefSlice, ShowResponseDef, TopicDef } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import {
  CLUE_NO_COUNTY_RECORD,
  FEDORA,
  FLAG_MET_WHITLOCK,
  FLAG_TOLD_WHITLOCK_ABOUT_ROOM,
  FLAG_WHITLOCK_ASKED_YEAR,
  FLAG_WHITLOCK_RAN_YOU,
  PAGE_78,
  SHERIFF_OFFICE,
  SUNDOWN_DINER,
  V_ATTACK,
  V_FOLLOW,
  WHITLOCK,
} from './ids';
import { ACT2_STARTED } from '../act2/ids';
import { POKER_NIGHT } from '../act2/calendar';

// ---------------------------------------------------------------------------
// §12.6.2 — unknownTopic
// ---------------------------------------------------------------------------

const unknownTopic: string[] = [
  '"Not something the county keeps." She does not look up.',
  'She types it, waits, and reads what comes back. "No," she says, and that is the whole of the answer.',
  '"I\'d be guessing." She turns a page of the form over. "And I\'ve got a machine here for not guessing."',
];

// ---------------------------------------------------------------------------
// §12.6.3 — description
// ---------------------------------------------------------------------------

const description =
  'Fifty, in uniform trousers and a department sweater with the badge sewn on rather than pinned, which is what people do when they intend to be at a desk. Short hair going through grey with no fuss made about it. A wedding ring worn thin on a hand that writes.\n\nShe looks at you the way she would look at a vehicle she was about to walk around: all of you, once, in order, and then your face.';

// ---------------------------------------------------------------------------
// §12.6.4 — greeting
// ---------------------------------------------------------------------------

const greeting: ProseRule[] = [
  {
    // Reachable as of v0.8.0: the engine now marks an NPC met after the first exchange (`npc.ts`'s `markMet`), so this is exactly the first HELLO.
    when: { not: { met: WHITLOCK } },
    text: '"Morning." She says it at four in the morning with no irony available in it, and then she looks at the side of your head and puts the pen down.\n\n"Sit if you want. Clinic\'s at nine and I can\'t do better than that, so let\'s have whatever else it is."',
  },
  {
    when: { flag: FLAG_WHITLOCK_RAN_YOU },
    text: [
      '"Still here." She has the form back in front of her and about half of it left to do.',
      'She looks up, gets the whole of you in, and goes back down. "Ask, if you\'ve got one."',
    ],
  },
  {
    text: [
      '"Coffee\'s behind you. It\'s terrible and it\'s hot." She keeps writing. "Clinic opens at nine, other side of the county, and there\'s a nurse there four days out of seven. Best I\'ve got for a head."',
      '"You\'ll have seen the notice up at the post office," she says, to the form. "Dog. Come in off somewhere, no collar, nobody asking. Been in the back of my truck twice this week." A box ticked. "It\'s a nice dog. That\'s the trouble with it."',
      'She watches you look at the map and goes back to the form. "That\'s the plant, north. It isn\'t the county\'s and never has been, and anything you were about to ask me about it has that same answer." A box ticked. "Pays for most of what\'s in this room, though."',
      '"Marlow\'s got you, hasn\'t he. Top floor." She does not make it a question. "He\'s been on that desk since before I had this. There\'s four people in this county whose word I\'d take without checking, and he\'s two of them."',
      '"Everything I do in this room is somebody else\'s form," she says, and turns one over. "You\'d think the job was arresting people. It\'s about four per cent that. The rest is telling a computer what happened in a way it\'ll take."',
      '"Nine hundred and forty in the county," she says, to the form. "That\'s the count. I don\'t argue with the count."',
    ],
  },
];

// ---------------------------------------------------------------------------
// §12.6.5 — topics (12 in the doc; `topic_evidence`/`topic_town` cut per
// this task's own brief — 10 wired).
// ---------------------------------------------------------------------------

const TOPIC_RECORDS = T('act1_whitlock_topic_records');
const TOPIC_NAME = T('act1_whitlock_topic_name');
const TOPIC_YEAR = T('act1_whitlock_topic_year');
const TOPIC_HEAD = T('act1_whitlock_topic_head');
const TOPIC_MARLOW = T('act1_whitlock_topic_marlow');
const TOPIC_PLANT = T('act1_whitlock_topic_plant');
const TOPIC_WALL_DRUG = T('act1_whitlock_topic_wall_drug');
const TOPIC_HORSES = T('act1_whitlock_topic_horses');
const TOPIC_WHITLOCK = T('act1_whitlock_topic_whitlock');
const TOPIC_DOG = T('act1_whitlock_topic_dog');

const recordsEffects: Effect[] = [{ set: [FLAG_WHITLOCK_RAN_YOU, true] }, { grantClue: CLUE_NO_COUNTY_RECORD }];

const yearRule1 =
  'The pen stops. She looks at the side of your head for about a second and a half, which from her is a long look.\n\n"What\'s the last thing you\'ve got?"\n\nYou tell her, and it is not much, and she writes none of it down. Then: "Sit down. I\'ll write you the clinic and you can call it at nine." She is already reaching for the pad. "And if you want, I\'ll see what the county\'s got on you. Takes forty seconds. Those are the two things I can do."';

const yearRule2: string[] = [
  '"You asked me that." She tears the top sheet off the pad and puts it on the counter where you can reach it: an address, and an hour.\n\n"A number off me isn\'t going to do for you what that will."',
  '"Same answer." She does not look up. "Nine o\'clock."',
];

const yearResponse: ProseRule[] = [
  { when: { not: { flag: FLAG_WHITLOCK_ASKED_YEAR } }, text: yearRule1 },
  { text: yearRule2 },
];

const topics: TopicDef[] = [
  {
    id: TOPIC_RECORDS,
    words: ['me', 'myself', 'who am i', 'am i', 'record', 'records', 'file', 'files', 'database', 'system', 'look me up', 'check', 'search', 'identity', 'identify'],
    response:
      '"Give me a name and I\'ll give you what\'s on it."\n\nYou do not have one. She takes that without any change in her face, and asks where you are staying instead, and you tell her, and she types that.\n\n"Marlow\'s." She reads it off the screen the way you would read out a road number. "Eleven rooms. County\'s got three tenancies in that building." A key, and the screen changes. "No licence, no vehicle, nothing paid and nothing owed, and nobody of any description at all in the third-floor back."\n\nShe turns the screen back to the angle she likes. "Happens more than you\'d think. People come out here on cash and they stay on cash, and the county never hears about them at all."\n\nThe pen comes back up. "Doesn\'t mean anything."',
    effects: recordsEffects,
  },
  {
    id: TOPIC_NAME,
    words: ['name', 'my name', 'names', 'called'],
    response:
      '"You\'d know it before I would," she says. "Nothing in this room starts without one."\n\nShe waits about as long as it takes to be sure you are not going to produce one, and then makes nothing of it.',
  },
  {
    id: TOPIC_YEAR,
    words: ['year', 'what year', 'date', 'time', 'today', 'day', 'clock', 'when', 'month'],
    response: yearResponse,
    effects: [{ set: [FLAG_WHITLOCK_ASKED_YEAR, true] }],
  },
  {
    id: TOPIC_HEAD,
    words: ['head', 'wound', 'blood', 'hurt', 'injury', 'doctor', 'clinic', 'hospital', 'nurse', 'concussion', 'ice'],
    response:
      '"You\'ve been hit, or you\'ve fallen and hit something, and either way what you want is somebody with a light to look in your eyes." She says it like a woman reading out the two things it can be. "Nine o\'clock. I\'d drive you now if there was anybody there to drive you to."',
  },
  {
    id: TOPIC_MARLOW,
    words: ['marlow', 'clerk', 'boarding house', 'house', 'landlord', 'hotel'],
    response:
      '"Thirty years on that desk, and he\'s straight." She says it as something she has checked. "If he told you a thing tonight, it\'s true. If he didn\'t, you\'ll not get it out of him by going back."',
  },
  {
    id: TOPIC_PLANT,
    words: ['plant', 'facility', 'factory', 'works', 'power', 'glow', 'light', 'lights', 'north', 'north of town'],
    response:
      '"The plant. Twenty-odd miles north, and the road to it is theirs from the county line in." She does not look at the map. "Two hundred work out there and about thirty of them live in this county. Runs all night. That\'s what you can see from the street."\n\nA box ticked. "Only thing out here that\'s never once been my business, and I\'d not swap."',
  },
  {
    id: TOPIC_WALL_DRUG,
    words: ['wall drug', 'walldrug', 'billboard', 'sign', 'signs', 'thirty two', '32', 'miles', 'free ice water'],
    response:
      '"Thirty-two miles." She has the number out before you have finished the question. "It\'s been thirty-two miles my whole life, and I\'ve never once been asked how far it is by somebody who didn\'t already know."\n\nA box ticked. "Water\'s free. That part\'s true."',
  },
  {
    id: TOPIC_HORSES,
    words: ['horse', 'horses', 'rail', 'riding', 'stable'],
    response:
      '"Feed\'s cheaper than fuel out here, and there\'s country between here and the county line that no truck is getting across." A box ticked. "Three of them tied up outside the store all night, though. Somebody\'s playing cards somewhere they shouldn\'t be."',
  },
  {
    id: TOPIC_WHITLOCK,
    words: ['you', 'yourself', 'whitlock', 'sheriff', 'dana', 'job', 'work', 'deputy', 'deputies', 'night', 'nights'],
    response:
      '"Whitlock. Eleven years, and eight in Rapid before that." A box ticked. "There\'s me and two deputies and a radio that has to have somebody beside it. I take three nights a week because I\'m the worst of us at sleeping."',
  },
  {
    id: TOPIC_DOG,
    words: ['dog', 'stray', 'found', 'notice', 'poster'],
    response:
      '"Nobody\'s dog." She says it like a breed. "Round the county since about Tuesday. Collar off, if there ever was one. I\'ve put the notice up and I\'ll put it up again next week."\n\nShe goes back to the form. "It\'ll be mine by Christmas."',
  },
];

// ---------------------------------------------------------------------------
// §12.6.6 — tellTopics
// ---------------------------------------------------------------------------

const TELL_ROOM = T('act1_whitlock_tell_room');

const tellTopics: TopicDef[] = [
  {
    id: TELL_ROOM,
    words: ['room', 'attack', 'attacked', 'robbed', 'search', 'searched', 'break in', 'breakin', 'burglary', 'ransacked', 'crime', 'report'],
    response:
      'She has the form out of the drawer before you have finished, and starts at the top of it.\n\n"Time you woke. What\'s gone. Who\'s got a key." She works down the page. Then: "Name of complainant."\n\nThe pen stops there and stays stopped. She looks at the box, and then at you, and something goes across her face that she does not let stay.\n\n"I\'ll put the address," she says, and does. "It\'ll bounce. Then I\'ll put it in again."',
    effects: [{ set: [FLAG_TOLD_WHITLOCK_ABOUT_ROOM, true] }],
  },
];

// ---------------------------------------------------------------------------
// §12.6.7 — showResponses
// ---------------------------------------------------------------------------

const showResponses: ShowResponseDef[] = [
  {
    objects: [FEDORA],
    response: '"That\'s a hat." She looks at it for as long as it takes to establish that. "It\'s a good one."',
  },
  {
    objects: [PAGE_78],
    response: 'She reads it, turns it over, reads the other side, and hands it back. "Where\'d you get it?"',
  },
];

// ---------------------------------------------------------------------------
// §12.6.8 — handlers
// ---------------------------------------------------------------------------

// See ids.ts's own comment on `V_ATTACK`/`V_FOLLOW` for why these are new
// global verbs, wired here rather than left out the way `marlow.ts` left
// them out (that file's own gap — no `NpcDefSlice.handlers` field existed
// yet — has since been fixed).
const attackText = 'She is armed, she is sitting down, and she has been doing this for eleven years. The thought does not get as far as your hands.';
const followText = '"I\'m not going anywhere." She turns a page. "That\'s the job at this hour."';

export const whitlock: NpcDefSlice = {
  // Canon register entry 28 — the night post, transcribed exactly from §12.6's own header.
  // D0 amendment (Stage D plan §2's D0 table; ADR 0011 rule 5): prepended,
  // gated on `act2_started` — the poker game's own night, not Whitlock's
  // ordinary one. Afternoons are already offstage below; unchanged.
  schedule: [
    { when: { all: [{ flag: ACT2_STARTED }, POKER_NIGHT] }, room: SUNDOWN_DINER },
    { when: { clockPhase: 'night' }, room: SHERIFF_OFFICE },
    { when: { clockPhase: 'morning' }, room: SHERIFF_OFFICE },
    { when: { clockPhase: 'afternoon' }, room: 'offstage' },
    { room: SHERIFF_OFFICE },
  ],
  nouns: ['whitlock', 'sheriff', 'dana', 'woman', 'officer', 'law', 'cop', 'police'],
  adjectives: ['county'],
  name: 'Sheriff Whitlock',
  pronoun: 'she',
  description,
  topics,
  tellTopics,
  showResponses,
  unknownTopic,
  greeting,
  handlers: [
    { verbs: [V_ATTACK], effects: [{ say: attackText }] },
    { verbs: [V_FOLLOW], effects: [{ say: followText }] },
  ],
};

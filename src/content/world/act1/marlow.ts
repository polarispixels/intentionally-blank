// Marlow — the game's first NPC
// (`docs/superpowers/specs/2026-09-01-front-desk-prose.md` §5).
//
// FIXED (Ryan's playtest bug report, `X MARLOW`): `NpcDefSlice` now has a
// `description` field, `respond.ts`'s NPC-target rung 2 routes the reserved
// EXAMINE verb id to it ahead of the generic `{name}`-templated default, and
// `npc.marlow.description` (§5.3, below) is wired in — transcribed exactly.
// The report's second half — "the night marlow" — was a separate bug in the
// engine's NPC display-name templating (`candidateName`, a disambiguation
// helper never meant to be a display name, gluing this NPC's first-indexed
// adjective ("night") to its first-indexed noun ("marlow")): fixed with a
// new `NpcDefSlice.name` field (mirroring `ObjectDefSlice.name`), read by a
// shared `npcDisplayName` helper everywhere an NPC's `{name}`/`{dobj}`/
// `{iobj}` is templated, not patched per call site. `marlow.name` below
// supplies it.
//
// `NpcDefSlice` also now has `handlers` — parity with `ObjectDefSlice.
// handlers` for rung 1 (an arbitrary npc-targeted verb, e.g. ATTACK/FOLLOW,
// §5.6). NOT wired here: ATTACK and FOLLOW aren't declared verbs anywhere in
// `verbs.ts` yet (no `words`/`patterns`/`default` family exists for either),
// so authoring §5.6's two handlers would mean adding two brand-new verbs to
// that file — a real scope expansion beyond this task's own file list (task
// report flags this rather than guessing at verb grammar/defaults nobody
// asked for).
//
// STILL OPEN (unrelated to the above, not this task's to fix):
//   - `NpcDefSlice.greeting` is plain `Prose`, rendered via `render()` only
//     — `respondToGreeting` never calls `apply()`, so a greeting can never
//     run an `Effect`. §5.3's flags table says `met_marlow` is "set by
//     first entry to front_desk" (an `onEnter` effect, on the room — see
//     `frontDesk.ts`), which is what actually works: `move.ts`'s
//     `renderArrival` runs `onEnter` *after* the room's own `description`
//     renders, so the room's first-sight/return-visit split is a real,
//     working state machine. But `onEnter` fires as part of the arrival
//     turn itself, strictly before the player's next typed command — so by
//     the time any `HELLO MARLOW`/`TALK TO MARLOW` can possibly execute,
//     `met_marlow` is already true. Rule 1 below (transcribed exactly, hard
//     rule 5) is therefore structurally unreachable in play; Rule 2's
//     rotation is what a player will actually see on every greeting,
//     including the first. Flagged for the architect: this needs either a
//     dedicated "has this NPC been greeted yet" primitive or a deliberate
//     re-reading of which line is the player's real first line.

import { T } from '../../../engine/ids';
import type { Effect } from '../../../engine/effects';
import type { NpcDefSlice, ShowResponseDef, TopicDef } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import {
  CLUE_HOUSE_EMPTY,
  CLUE_NO_NAME_RECALLED,
  CLUE_VISITOR_UNREMARKABLE,
  FEDORA,
  FLAG_MARLOW_KNOWS_YOU_KNOW,
  FLAG_MARLOW_PRESSED,
  FLAG_MARLOW_TOLD_ABOUT_ROOM,
  FLAG_MET_MARLOW,
  FLAG_REGISTER_GAP_SEEN,
  FLAG_REGISTER_IMPRESSION_FOUND,
  FLAG_SPARE_KEY_GIVEN,
  FRONT_DESK,
  FRONT_DESK_COUNTER,
  PAGE_78,
  ROOM_KEY,
  MARLOW,
} from './ids';

// ---------------------------------------------------------------------------
// §5.2 — unknownTopic, most load-bearing string in the room. Order matters
// (plainest first): variant 1's "a second longer than it needs" is
// Marlow's ordinary response time, established here so it can never be read
// as evasion later.
// ---------------------------------------------------------------------------

const unknownTopic: string[] = [
  'Marlow thinks about it a second longer than it needs. "Couldn\'t tell you."',
  '"Not something I\'d have." He lets that be the whole of it.',
  '"I\'d only be guessing." He shakes his head, slowly. "Thirty years here, and I\'ve been wrong about more than you\'d think."',
];

// ---------------------------------------------------------------------------
// §5.3 — description (`EXAMINE MARLOW`), transcribed exactly (hard rule 5).
// ---------------------------------------------------------------------------

const description =
  'Sixty-odd and narrow, in a cardigan with the elbows gone. He has the stillness of a man who has spent thirty years awake while other people sleep, and does not fill silences.\n\nWhen he looks at you he looks at your face and not at the side of your head, and keeping it there costs him something.';

// ---------------------------------------------------------------------------
// §13 (front-desk-prose appendix) — greeting, replacing §5.3's version
// entirely. Rule 1 is §5.3's rule 1, unchanged (see this file's header on
// its reachability). Rule 2 is new — the promise `topic_register` rule 1
// makes ("that is all he says about the book tonight") kept for real; it
// has to precede rule 3's rotation or two of rule 3's six variants (v6's
// hands on the register) would break it within two turns. Rule 3 replaces
// §5.3's old two-variant rule 2 with the volunteering rotation: v1-v4 the
// house and the town, v5 the hour, v6 his hands on the book he tore a page
// out of — order is drift, not decoration, and is preserved as authored.
//
// THE DESIGN RULE THIS ENFORCES: volunteering names a handle; ASK pulls it.
// None of the six variants below answers a topic on its own — v1 names the
// key board and does not hand over the key (still ASK MARLOW ABOUT KEY);
// v6 puts his hands on the register and says nothing about the page.
// ---------------------------------------------------------------------------

const greeting: ProseRule[] = [
  {
    // Reachable as of v0.8.0: the engine now marks an NPC met after the first exchange (`npc.ts`'s `markMet`), so this is exactly the first HELLO.
    when: { not: { met: MARLOW } },
    text: '"Evening." He has been awake for hours and does not pretend otherwise. His eyes go to the side of your head, once, and come back. He does not ask.\n\n"There\'s a towel behind the desk, if you want one."',
  },
  {
    when: { flag: FLAG_MARLOW_KNOWS_YOU_KNOW },
    text: [
      '"Still up," he says, and that is the whole of it tonight.',
      'He is at the desk with both hands flat on the counter and the book squared to the edge of it. He does not start anything, and he does not object to you standing there.',
    ],
  },
  {
    text: [
      '"Still up," he says, which is not a question.\n\nThen, because it is four in the morning and there is nobody else to say it to: "Board behind me\'s got a hook for every room in the house. Most of them have still got their spare on them. It\'s been that kind of year."',
      'He looks up, and waits, and is prepared to wait. When you do not fill it, he does.\n\n"Eleven rooms and four let. It\'s a big quiet house to sit awake in." He turns his cup a quarter turn on the counter and does not drink out of it.',
      '"It\'s hymns this hour, then the stock report, then hymns again." He does not turn the radio up for any of it. "Whitlock came by Tuesday about a dog that wasn\'t anybody\'s. That\'s the week\'s news in this town, near enough."',
      '"Top floor, back. Three weeks you\'ve had it." He has the room off by heart. "No complaint out of you, and none about you. That\'s rarer in a let house than you\'d think."',
      '"Twenty past four is the bad part of it," he says, to the counter more than to you. "Six, I\'m off. Between here and six there\'s nothing to do but be here doing it."\n\nHe checks the clock behind him, and then the one over the door, which does not agree with it, and lets them both alone.',
      'He squares the register with two fingers while he talks, the way another man would straighten a tie.\n\n"People have been signing that book since before my time. There\'s hands in it belonging to people whose shoes I could still describe to you." He stops squaring it. "More empty weeks in it now than full ones."',
    ],
  },
];

// ---------------------------------------------------------------------------
// §5.3 — topics. `topic_marlow` is cut per this task's brief (§12's ranked
// cut list, top entry) — not transcribed.
// ---------------------------------------------------------------------------

const TOPIC_NAME = T('act1_marlow_topic_name');
const TOPIC_ROOM = T('act1_marlow_topic_room');
const TOPIC_VISITOR = T('act1_marlow_topic_visitor');
const TOPIC_REGISTER = T('act1_marlow_topic_register');
const TOPIC_KEY = T('act1_marlow_topic_key');
const TOPIC_HEAD = T('act1_marlow_topic_head');
const TOPIC_SHERIFF = T('act1_marlow_topic_sheriff');
const TOPIC_HOUSE = T('act1_marlow_topic_house');
const TOPIC_TOWN = T('act1_marlow_topic_town');
const TOPIC_TIME = T('act1_marlow_topic_time');

const visitorRule1Effects: Effect[] = [{ grantClue: CLUE_VISITOR_UNREMARKABLE }, { set: [FLAG_MARLOW_PRESSED, true] }];
const registerRule1Effects: Effect[] = [{ set: [FLAG_MARLOW_KNOWS_YOU_KNOW, true] }];

const topics: TopicDef[] = [
  {
    id: TOPIC_NAME,
    words: ['name', 'my name', 'me', 'myself', 'who am i', 'identity', 'am i'],
    response:
      '"You paid a week, in advance, and I put it in the book." He looks at the book.\n\n"I\'d have it in front of me, ordinarily."\n\nHe does not finish that, and does not offer the name from memory. After a moment it becomes clear he is not withholding it. He is looking for it.',
    effects: [{ grantClue: CLUE_NO_NAME_RECALLED }],
  },
  {
    id: TOPIC_ROOM,
    words: ['room', 'my room', 'upstairs', 'top floor', 'noise', 'last night', 'tonight', 'hear'],
    response: '"Top floor, back. Three weeks, you\'ve had it." A gap. "I don\'t hear much from up there. House is mostly empty and I keep the radio low for the door."\n\nWhich is an answer about the door.',
  },
  {
    id: TOPIC_VISITOR,
    words: ['man', 'visitor', 'caller', 'anyone', 'who came up', 'stairs', 'guest', 'stranger', 'last night'],
    response: [
      {
        when: { flag: FLAG_REGISTER_IMPRESSION_FOUND },
        text: 'He looks at the book for longer than he looks at you.\n\n"There was a fella came in for the top floor. Late. Said he was here to see to something." He stops. "That\'s what I\'ve got."\n\nAsk what the man looked like and he starts three times and gets nowhere. The not getting anywhere is plainly worse for him than the question.',
      },
      {
        text: '"Not while I was at the desk." He says it evenly and completely, like a man handing over exact change.\n\nYou wait. He lets you.',
      },
    ] satisfies ProseRule[],
    effects: [{ if: { when: { flag: FLAG_REGISTER_IMPRESSION_FOUND }, then: visitorRule1Effects } }],
  },
  {
    id: TOPIC_REGISTER,
    words: ['register', 'book', 'guest book', 'ledger', 'page', 'gap', 'tear', 'missing page'],
    response: [
      {
        when: { flag: FLAG_REGISTER_IMPRESSION_FOUND },
        text: 'You tell him what is pressed into the page under the one that is missing.\n\nMarlow does not deny it and does not confirm it. He sits with both hands flat on the counter and looks at the middle distance until the radio has changed to something else. Then he says, "You\'ll want that towel," and gets it, and that is all he says about the book tonight.',
      },
      {
        when: { flag: FLAG_REGISTER_GAP_SEEN },
        text: '"Pages come loose." He does not look at it while he says it. "Old book."',
      },
      {
        text: '"Book\'s the book." He squares it with two fingers until it sits parallel to the edge of the counter. "Everybody signs. Been signing since before me."',
      },
    ] satisfies ProseRule[],
    effects: [{ if: { when: { flag: FLAG_REGISTER_IMPRESSION_FOUND }, then: registerRule1Effects } }],
  },
  {
    id: TOPIC_KEY,
    words: ['key', 'keys', 'spare', 'rack', 'board', 'hook', 'lock', 'my key'],
    response:
      '"Spare\'s on the board." He has it off its hook before you have finished asking and puts it on the counter between you. "It comes back when you go. Nobody\'s ever been much good at that rule."',
    // Bug fix (Ryan's playtest): the prose says he "puts it on the counter
    // between you," not into the player's hands — the effect used to move
    // it straight to `'inventory'`, so `LOOK` never mentioned it and the
    // player went hunting for a key they already held. Moving it onto
    // `FRONT_DESK_COUNTER` instead makes the world match the words: it's a
    // real, listed object (`world.ts`'s `objectsListedInRoom` room-listing
    // mechanism, no prose change needed — see hard rule 5) the player then
    // has to `TAKE`.
    effects: [{ set: [FLAG_SPARE_KEY_GIVEN, true] }, { move: [ROOM_KEY, { on: FRONT_DESK_COUNTER }] }],
  },
  {
    id: TOPIC_HEAD,
    words: ['head', 'wound', 'blood', 'hurt', 'doctor', 'hospital', 'clinic', 'injury', 'towel', 'ice'],
    response:
      '"Clinic\'s the other side of the county and it isn\'t open." He gets ice into a towel with the efficiency of a man who has done it for other people. "Sit down for it or don\'t. Hold it on."',
  },
  {
    id: TOPIC_SHERIFF,
    words: ['sheriff', 'police', 'law', 'cops', 'whitlock', 'report', 'deputy'],
    response:
      '"Whitlock. Office opens at eight." He straightens something already straight. "Nothing she\'d do at this hour she wouldn\'t do better at eight."\n\nWhich is true, and is also a man who would rather not have a sheriff in his lobby tonight.',
  },
  {
    id: TOPIC_HOUSE,
    words: ['house', 'hotel', 'boarding house', 'rooms', 'guests', 'lodgers', 'tenants', 'vacancy', 'neighbours', 'neighbors'],
    response: '"Eleven rooms. Four let, counting yours." He does not say it like a complaint. "It fills some summers. Not lately."',
    effects: [{ grantClue: CLUE_HOUSE_EMPTY }],
  },
  {
    id: TOPIC_TOWN,
    words: ['town', 'here', 'place', 'county', 'people', 'badlands'],
    response:
      '"Been here thirty years." He considers that. "Longer, some ways I count it. It\'s quiet. People are decent. There\'s fewer of them than there used to be, or I\'ve got that backwards. I\'ve had that backwards before."',
  },
  {
    id: TOPIC_TIME,
    words: ['time', 'hour', 'clock', 'date', 'day', 'when', 'year', 'today'],
    response:
      '"Twenty past four." He does not check anything to say it.\n\nAsk the date and he looks at the book, which is where a date lives in a house like this. Then he tells you the day of the week and leaves it there.',
  },
];

// ---------------------------------------------------------------------------
// §5.4 — tellTopics. Everything not listed falls back to `topics`.
// ---------------------------------------------------------------------------

const TELL_ROOM = T('act1_marlow_tell_room');
const TELL_NAME = T('act1_marlow_tell_name');

const tellTopics: TopicDef[] = [
  {
    id: TELL_ROOM,
    words: ['room', 'attack', 'attacked', 'robbed', 'search', 'searched', 'break in', 'burglary'],
    response:
      'You tell him the room has been gone through and that you woke up on the floor of it.\n\nMarlow takes it without any noise. "I\'ll come up in the morning and look at the lock." He writes nothing down, and does not ask what was taken, which is the first question anybody asks.',
    effects: [{ set: [FLAG_MARLOW_TOLD_ABOUT_ROOM, true] }],
  },
  {
    id: TELL_NAME,
    words: ['name', 'memory', 'amnesia', 'forgot', 'remember', 'cant remember'],
    response: '"That happens with a knock on the head." He nods at the chairs. "Sit down."\n\nThen: "It\'ll come back or it won\'t. Either way it won\'t tonight."',
  },
];

// ---------------------------------------------------------------------------
// §5.5 — showResponses. The `SHOW <any>` fallback is cut per this task's
// brief (§12's ranked cut list, second entry) — not transcribed.
// ---------------------------------------------------------------------------

const showResponses: ShowResponseDef[] = [
  {
    // FEDORA lives in room 1 (`objects/fedora.ts`'s `FEDORA`); this task
    // does not re-declare it, only reference its id.
    objects: [FEDORA],
    response: '"That\'s yours. You had it on coming in."\n\nHe is certain about the hat in a way he was not certain about the name.',
  },
  {
    objects: [PAGE_78],
    response: 'He reads both sides. "Blank," he says, and hands it back, and does not ask why you are showing him a blank page.\n\nIn this house that is manners.',
  },
];

export const marlow: NpcDefSlice = {
  // §5's own schedule, plus a builder deviation on the unconditional last
  // rule — flagged for the architect, not a silent choice. The doc's
  // comment on this schedule says "Act I opens at night, so the
  // unconditional last rule never fires in this milestone," but
  // `gamestate.ts`'s `initialState()` hardcodes every playthrough's start
  // to `meta.phases.morning` (a task-6 placeholder, chosen before this
  // story's actual nocturnal opening existed) — so the very first turn of
  // the game is always, definitionally, phase `'morning'`, and the doc's
  // assumption doesn't hold against this engine. Rather than contradict
  // "desk evenings and nights, sleeps mornings" as a permanent character
  // fact, or touch `src/engine/gamestate.ts` (out of this content task's
  // scope), the fallback rule below keeps Marlow at the desk instead of
  // sending him offstage — the room does not function without him — until
  // the architect either fixes the start-time hardcode or the game
  // actually derives a real starting clockPhase for Act I.
  schedule: [
    { when: { clockPhase: 'night' }, room: FRONT_DESK },
    { when: { clockPhase: 'evening' }, room: FRONT_DESK },
    { room: FRONT_DESK },
  ],
  nouns: ['marlow', 'clerk', 'night clerk', 'man', 'old man', 'desk clerk'],
  adjectives: ['night', 'old', 'narrow'],
  // Task-1 fix: the display name `{name}`/`{dobj}` templating reads
  // (`npcDisplayName`, `npc.ts`) — without this, the generic default family
  // fell back to gluing this NPC's own first-indexed adjective ("night") to
  // its first-indexed noun ("marlow"), producing "the night marlow".
  name: 'Marlow',
  pronoun: 'he',
  description,
  topics,
  tellTopics,
  showResponses,
  unknownTopic,
  greeting,
};

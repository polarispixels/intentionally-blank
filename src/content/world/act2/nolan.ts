// Act II, Stage D2, task C — Nolan (`docs/superpowers/specs/2026-09-10-
// stage-d2-prose.md` PART FIVE, §17). Prose transcribed verbatim (hard
// rule 5).
//
// SCHEDULE (this task's ruling 1) — poker night takes priority (the
// Sundown Diner, Friday evening), then evenings at home (Nolan's Yard),
// otherwise offstage; the plant-by-day post is D3's to add. All gated on
// `ACT2_STARTED`.
//
// NOUNS — `nolan`, `man`, `manager`, `neighbour` (this task's ruling 1).
//
// GREETING — §17.3's rule 1 (`{ not: { met: ACT2_NOLAN } }`) sets
// `ACT2_MET_NOLAN_HOME` — `ProseRule` carries no `Effect` (the same engine
// gap `dad.ts`'s own header documents for `ACT2_DAD_SAID_MANNERISM`), so
// the flag is set by a `world.events` entry keyed on `{ met: ACT2_NOLAN }`
// instead (`ACT2_NOLAN_MET_EVENT`, below), mirroring `dad.ts`'s own
// `ACT2_DAD_MANNERISM_EVENT` idiom exactly. M8's actual trigger is `{ met:
// ACT2_NOLAN }` (`knowledgeD2C.ts`), so this flag is not strictly read by
// anything — declared anyway, per the ruling.
//
// NOLAN_SUBLEVEL_LINE — the bare sentence, no quotes ("register 58" of the
// prose doc's status line: it is one exported constant). Callers wrap it
// in their own quotation/punctuation: this file's own `topic_sublevel`
// (a standalone quoted line), `poker.ts`'s badge-loan response (§16.7,
// embedded mid-sentence), and `knowledgeD2C.ts`'s M8 fragment (plain,
// no markup — the prose doc's own asterisk-emphasis around this line in
// its M8 block is that document's meta-formatting, not in-game markup;
// dropped here the same way every other doc-level emphasis convention in
// this codebase's shipped content already is).
//
// `topic_sublevel` — the second and every later hearing is
// character-identical to the first and grants `ACT2_CLUE_VERBATIM`
// silently (no `say`, canon 48, register 24) — see this file's own rule 2.
//
// §17.13 — a dedicated topic (`ACT2_NOLAN_TOPIC_UNREACHABLE`) rather than
// leaving this to fall through to `unknownTopic`'s rotation: the doc gives
// it one fixed line, not a rotating one, for "deprecated"/"erased"/
// anything the player has learned but Nolan cannot have. Deliberately
// narrow (those two words plus a few of the same shape) — "anything the
// player has learned but he cannot have" is not a closed word list this
// engine's `TopicDef.words` can express in full; the two words the doc
// names verbatim are wired, and anything else genuinely unknown to Nolan
// still falls to `unknownTopic`'s ordinary rotation. Flagged for the
// architect if a wider net is wanted.

import type { Effect } from '../../../engine/effects';
import type { EventDef, NpcDefSlice, ObjectDefSlice, ShowResponseDef, TopicDef } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { EXAMINE } from '../act1/verbs';
import { NOLANS_YARD, PO_BOX_SLIP, SUNDOWN_DINER, V_WATCH, WORK_ORDER } from '../act1/ids';
import { POKER_NIGHT } from './calendar';
import {
  ACT2_BADGE_WON,
  ACT2_CLUE_NO_SUBLEVEL_KINDLY,
  ACT2_CLUE_NOLAN_FORGOT_ORDER,
  ACT2_CLUE_VERBATIM,
  ACT2_MET_NOLAN_HOME,
  ACT2_NOLAN,
  ACT2_NOLAN_BADGE,
  ACT2_NOLAN_SUBLEVEL_COUNT,
  ACT2_POKER_HAND,
  ACT2_NOLAN_TOPIC_BADGE,
  ACT2_NOLAN_TOPIC_BADGE_LOAN,
  ACT2_NOLAN_TOPIC_HEADACHES,
  ACT2_NOLAN_TOPIC_JULES,
  ACT2_NOLAN_TOPIC_NIGHTS,
  ACT2_NOLAN_TOPIC_POKER,
  ACT2_NOLAN_TOPIC_SUBLEVEL,
  ACT2_NOLAN_TOPIC_TRASH,
  ACT2_NOLAN_TOPIC_UNREACHABLE,
  ACT2_POKER_IN_PROGRESS,
  ACT2_POKER_WINS,
  ACT2_STARTED,
  ACT2_TELL_NOLAN,
  EVENT_ACT2_MET_NOLAN,
} from './ids';

// ---------------------------------------------------------------------------
// The shared sentence (§16.1, §16.7, §17.4, M8) — one exported constant.
// ---------------------------------------------------------------------------

export const NOLAN_SUBLEVEL_LINE = 'There is no Sublevel 6.';

// ---------------------------------------------------------------------------
// §17.1 — the yard with him in it (`nolansYard.ts`'s own amendment reads
// this text; declared here so it lives beside the NPC it describes).
// ---------------------------------------------------------------------------

export const NOLAN_YARD_WITH_HIM_TEXT =
  'The porch light is on and the gate is open, hooked back against the fence with\na bent nail that was put there for the purpose.\n\nNolan is on the step with a mug, in a cardigan, doing nothing at all. The dog\nis lying across his feet with the whole of its weight, the way a dog lies on\nsomebody it has decided about.\n\nThe bin is in against the house with the lid on, squared to the wall.';

// ---------------------------------------------------------------------------
// §17.2 — EXAMINE
// ---------------------------------------------------------------------------

const examineText =
  'Sixty, and tidy about it: shaved this morning, shirt buttoned to the collar\nunder the cardigan, boots off at the step and set side by side facing the\ndoor.\n\nThere is a plant badge on a clip on his shirt pocket that he has not taken off\nand does not appear to know is there.\n\nHe looks like a man having a good evening, and he looks tired in the way that\ndoes not come off with a night\'s sleep.';

// ---------------------------------------------------------------------------
// §17.3 — greeting
// ---------------------------------------------------------------------------

const greeting: ProseRule[] = [
  {
    when: { not: { met: ACT2_NOLAN } },
    text:
      'He is up off the step before you have got the gate all the way open, and the\ndog is up with him, and neither of them treats you as a question.\n\n"Come in the yard, come in the yard. Mind him, he leans." He puts a hand out\nand shakes yours with both of his. "You\'ll be the one that\'s been round the\ntown asking. Somebody said. It\'s a small enough place."\n\nHe looks at the side of your head, and something in his face closes and opens\nagain.\n\n"That\'s healing all right," he says. "Sit down. I\'ll not keep you standing in\nyour own business."',
  },
  {
    text: [
      '"There you are." He moves the mug off the step so there is somewhere to sit.',
      '"I was hoping that was you. The dog\'s no company, he agrees with everything."',
      '"Go on, then," he says, comfortably, as though you had already started.',
    ],
  },
];

// ---------------------------------------------------------------------------
// §17.4 — topic_sublevel
// ---------------------------------------------------------------------------

const sublevelRule1Text = `"${NOLAN_SUBLEVEL_LINE}"\n\nHe says it kindly. He says it the way you would tell somebody which day the\nbins go — no edge on it, no impatience, and entirely ready to say it again if\nyou need it again.\n\n"Five, and the plant floor above them. I've walked every foot of all of it and\nI could draw you the building on this step with a finger and not have to stop\nand think. There's no six. There's nothing under five but the rock they had to\ntake out to get five."`;

const topicSublevel: TopicDef = {
  id: ACT2_NOLAN_TOPIC_SUBLEVEL,
  words: ['sublevel', 'sublevel 6', 'sublevel six', 'basement', 'below', 'underground', 'downstairs', 'level six'],
  response: [
    { when: { not: { flag: ACT2_NOLAN_SUBLEVEL_COUNT, atLeast: 1 } }, text: sublevelRule1Text },
    // Second and every later hearing — character-identical, no `say`
    // change at all (canon 48, register 24): the clue is granted by the
    // effects list below, entirely silently.
    { text: sublevelRule1Text },
  ] satisfies ProseRule[],
  effects: [
    { inc: ACT2_NOLAN_SUBLEVEL_COUNT },
    { if: { when: { flag: ACT2_NOLAN_SUBLEVEL_COUNT, atLeast: 2 }, then: [{ grantClue: ACT2_CLUE_VERBATIM }] } },
  ],
};

// ---------------------------------------------------------------------------
// §17.5 — topic_jules
// ---------------------------------------------------------------------------

const topicJules: TopicDef = {
  id: ACT2_NOLAN_TOPIC_JULES,
  words: ['jules', 'julian', 'supervisor', 'sublevel supervisor', 'him', 'brother'],
  // "nine years" (not "four") — canon decision 72 (`docs/spec/09-canon-
  // decisions.md`): "Nolan's two lines and Jules's M7 corrected to nine."
  response:
    '"Him." He puts the mug down on the step. "Julian — Jules. Jules, sorry. I did\nthat to his face for nine years and he was decent about it every time."\n\n"Best supervisor I ever had and I\'ve had six. He\'d walk a job before he wrote\nit up, which nobody does." The mug gets turned round once. "Then it went bad.\nTheft, of all the things in the world, and I sat in that room while they put it\nto him, and he said he hadn\'t, and I believed him, and I signed the paper\nanyway, because the paper was what I had in front of me."\n\nHe is quiet for a moment.\n\n"I couldn\'t tell you what he looked like. Isn\'t that a thing." He picks the mug\nback up. "Nine years across a desk. Julian. Jules."',
};

// ---------------------------------------------------------------------------
// §17.6 — topic_badge
// ---------------------------------------------------------------------------

const topicBadge: TopicDef = {
  id: ACT2_NOLAN_TOPIC_BADGE,
  words: ['badge', 'clip', 'lanyard', 'id', 'credential', 'card'],
  response:
    'He looks down at his own shirt to check what you mean, and laughs at himself.\n\n"I\'ve worn that to bed. My wife used to take it off me." A beat that goes past\nbefore he does. "It opens the gate, the lobby, the halls and the lift. Not the\nplant floor — that\'s two of us and a key. And it says where I\'ve been all day,\nwhich I\'ve never minded, because where I\'ve been all day is the plant."',
};

// ---------------------------------------------------------------------------
// §16.7 — the badge loan. `ASK NOLAN ABOUT BADGE`/`SUBLEVEL` at the table,
// after a win (`{ flag: ACT2_POKER_WINS, atLeast: 2 }`) — one topic, words
// spanning both `topicBadge` and `topicSublevel`'s own vocabularies,
// placed FIRST in `topics` (below) so it intercepts both words while its
// `when` holds and falls through to the ordinary home-topic responses the
// rest of the time. Kept in this file (not `poker.ts`) so `poker.ts` never
// needs to import `NOLAN_SUBLEVEL_LINE`/the badge object id back from
// here — see `poker.ts`'s own header on the cycle that would create.
// ---------------------------------------------------------------------------

const badgeLoanText = `He unclips it before you have finished the question, and holds it out across\nthe felt with the lanyard hanging.\n\n"Go see for yourself. ${NOLAN_SUBLEVEL_LINE} Bring it back Monday."\n\nWhitlock watches him do it and does not say anything, and Jack watches\nWhitlock not say anything.`;

const topicBadgeLoan: TopicDef = {
  id: ACT2_NOLAN_TOPIC_BADGE_LOAN,
  words: ['badge', 'clip', 'lanyard', 'id', 'credential', 'card', 'sublevel', 'sublevel 6', 'sublevel six', 'basement', 'below', 'underground', 'downstairs', 'level six'],
  when: { all: [{ at: SUNDOWN_DINER }, { flag: ACT2_POKER_WINS, atLeast: 2 }] },
  response: badgeLoanText,
  effects: [{ set: [ACT2_BADGE_WON, true] }, { move: [ACT2_NOLAN_BADGE, 'inventory'] }],
};

// ---------------------------------------------------------------------------
// §17.7 — topic_headaches
// ---------------------------------------------------------------------------

const topicHeadaches: TopicDef = {
  id: ACT2_NOLAN_TOPIC_HEADACHES,
  words: ['headache', 'headaches', 'pills', 'tablets', 'prescription', 'bottle', 'migraine'],
  response:
    '"Ah, you\'ve been in my bin." He is not angry. He is faintly delighted. "Whole\ncounty knows. Pearl asks after them like they\'re a relative."\n\n"They come on of a morning, mostly. Not pain, exactly — a sort of a\n*thickness*, and a day where I can\'t find a word I\'ve had my whole life."\n\nHe drinks. "The tablets work. The doctor says stress and I say I have the least\nstressful job in the state, and we leave it there."',
};

// ---------------------------------------------------------------------------
// §17.8 — topic_trash (ASK) and the matching SHOW handler for the work
// order — one shared response and effects list, the "reuse, don't
// duplicate" idiom this codebase's other NPCs already follow (`pearl.ts`,
// `marlow.ts`).
// ---------------------------------------------------------------------------

const trashResponse =
  'He takes it and holds it out at the distance men his age hold things.\n\n"That\'s ours. That\'s the right form and that\'s the right hand on it, that\'s the\ngate office." He reads it twice. "It\'d have come to me. Everything like that\ncomes to me."\n\nHe hands it back.\n\n"I don\'t remember it," he says, and there is nothing in his voice but a man\nbeing accurate. "I\'ll not pretend I do. I\'d have signed it and it\'d have gone\nin the bin with the rest of the week."';

const trashEffects: Effect[] = [{ say: trashResponse }, { grantClue: ACT2_CLUE_NOLAN_FORGOT_ORDER }];

const topicTrash: TopicDef = {
  id: ACT2_NOLAN_TOPIC_TRASH,
  words: ['trash', 'bin', 'garbage', 'work order', 'order', 'reclamation', 'reassembled', 'shredded'],
  response: trashResponse,
  effects: trashEffects,
};

// ---------------------------------------------------------------------------
// §17.9 — SHOW RENT NOTICE TO NOLAN
// ---------------------------------------------------------------------------

const rentNoticeResponse =
  '"That\'s my hand," he says at once, and turns it over, and turns it back.\n\n"*Returned — not known here.*" He reads his own writing out loud the way you\nread somebody else\'s. "Well, it\'s right. There\'s nobody of that name at this\nhouse and there never has been, and I\'d have put it out for the postman and\nthen I\'d have thought better of it, because you don\'t send a thing back with\nsomebody\'s money in it."\n\nHe gives it to you. "Where did you get this?"';

// ---------------------------------------------------------------------------
// §17.10 — topic_poker
// ---------------------------------------------------------------------------

const topicPoker: TopicDef = {
  id: ACT2_NOLAN_TOPIC_POKER,
  words: ['poker', 'cards', 'friday', 'game', 'table', 'deal'],
  response:
    '"Fridays." He brightens like a lamp. "Pearl puts the chairs down about the\ntime the counter goes quiet and we\'re four, and we\'ve been four for years, and\nif you make it five nobody will say a word about it."\n\n"Bring money you\'re not fond of."',
};

// ---------------------------------------------------------------------------
// §17.11 — topic_nights
// ---------------------------------------------------------------------------

const topicNights: TopicDef = {
  id: ACT2_NOLAN_TOPIC_NIGHTS,
  words: ['nights', 'sleep', 'dreams', 'dream', 'wife'],
  response:
    '"I sleep like a stone." He says it with real satisfaction. "Always have. Down\nat the same time, up at the same time, and nothing in between."\n\n"My wife used to say I was the only man she\'d met who didn\'t dream. I said\neverybody dreams and they forget them, and she said, no, Nolan, you\'re\ndifferent, you go somewhere and you come back tidy."',
};

// ---------------------------------------------------------------------------
// §17.12 — unknownTopic (rotating)
// ---------------------------------------------------------------------------

const unknownTopic: string[] = [
  '"Now, I\'d be guessing at that." He does not guess.',
  '"Ask me a plant question. I\'m good on the plant and I\'m no use on anything\nelse, and I\'ve made my peace with it."',
  'He thinks about it properly, which takes a while, and comes back with nothing,\nand is sorry about it in a way that makes you sorry you asked.',
];

// ---------------------------------------------------------------------------
// §17.13 — the unreachable topic
// ---------------------------------------------------------------------------

const topicUnreachable: TopicDef = {
  id: ACT2_NOLAN_TOPIC_UNREACHABLE,
  words: ['deprecated', 'erased'],
  response: '"You\'ve lost me," he says, cheerfully, and waits to be found.',
};

// ---------------------------------------------------------------------------
// §16.2's `WATCH NOLAN` — sets the tell. Wired here (on Nolan's own NPC
// handlers, `dobj` resolving to the NPC) rather than in `poker.ts`'s
// script, since a plain `V_WATCH` handler is the ordinary mechanism for
// "verb targeting an NPC" (same idiom `custodian.ts`'s own `V_FOLLOW`/
// `V_WATCH` handler uses) and needs no script dispatch at all. Gated to
// hand 1 specifically (§16.2's own placement); watching on a later hand
// still sets the flag (harmless — hand 1 has already resolved by then) but
// renders nothing further, since the doc gives no separate WATCH text for
// hands 2/3.
//
// §16.2 rule 3 / §17.2's own note — ATTACK/FOLLOW are not authored for
// Nolan anywhere in this wave's prose doc; left undeclared (falls to the
// verb's own generic default, same as any NPC with no handler for a given
// verb).
// ---------------------------------------------------------------------------

const watchNolanText =
  'He does it again on the next street. Badge, quarter turn, let go, and the\nwhole time his face is doing the thing his face does, which is nothing.\n\nHe is not hiding it. Nobody has ever told him about it, so there has never\nbeen anything to hide.';

export const nolan: NpcDefSlice = {
  // Poker night takes priority over the evening-at-home rule (both would
  // otherwise match a Friday evening) — this task's ruling 1: "poker night
  // → diner; evening → Nolan's Yard; otherwise offstage." The plant-by-day
  // post (Lobby, D3) is not this wave's to add.
  schedule: [
    { when: { all: [{ flag: ACT2_STARTED }, POKER_NIGHT] }, room: SUNDOWN_DINER },
    { when: { all: [{ flag: ACT2_STARTED }, { clockPhase: 'evening' }] }, room: NOLANS_YARD },
    { room: 'offstage' },
  ],
  nouns: ['nolan', 'man', 'manager', 'neighbour'],
  pronoun: 'he',
  greeting,
  topics: [topicBadgeLoan, topicSublevel, topicJules, topicBadge, topicHeadaches, topicTrash, topicPoker, topicNights, topicUnreachable],
  unknownTopic,
  showResponses: [
    { objects: [WORK_ORDER], response: trashResponse, effects: trashEffects },
    { objects: [PO_BOX_SLIP], response: rentNoticeResponse },
  ] satisfies ShowResponseDef[],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: examineText }] },
    {
      verbs: [V_WATCH],
      when: { all: [{ flag: ACT2_POKER_IN_PROGRESS }, { flag: ACT2_POKER_HAND, is: 1 }] },
      effects: [{ say: watchNolanText }, { set: [ACT2_TELL_NOLAN, true] }],
    },
  ],
};

// Also grants M8's companion clue (`ACT2_CLUE_NO_SUBLEVEL_KINDLY`) on the
// same turn: M8's own `trigger` (`{ met: ACT2_NOLAN }`, `knowledgeD2C.ts`)
// is purely ambient — `MemoryDef` carries no effects of its own for the
// tick step to run — so this event, gated on the identical condition, is
// where the companion clue actually gets granted (both dedupe on their own
// terms: `once: true` here, `state.memories.includes` for the memory).
export const ACT2_NOLAN_MET_EVENT: EventDef = {
  id: EVENT_ACT2_MET_NOLAN,
  when: { met: ACT2_NOLAN },
  once: true,
  effects: [{ set: [ACT2_MET_NOLAN_HOME, true] }, { grantClue: ACT2_CLUE_NO_SUBLEVEL_KINDLY }],
};

export const nolanBadge: ObjectDefSlice = {
  location: 'nowhere',
  name: 'badge',
  portable: true,
  // No examine text is authored (§16.7's own ruling) — the built-in stands.
  nouns: ['badge', "nolan's badge", 'lanyard'],
};

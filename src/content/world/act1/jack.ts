// Jack — the game's fourth NPC
// (`docs/superpowers/specs/2026-09-05-act1-wave4-prose.md` PART TWO §6,
// PART THREE §7-§8 by reference, PART FOUR §9 for pearl.ts's own topic).
// Prose transcribed exactly (hard rule 5).
//
// SCHEDULE — main-session decision, not the document's own §2 phase table:
// `[{ room: JACKS_MOTEL }]`, one post, all phases, exactly like `pearl.ts`.
// The document's own phase-based schedule (night/evening at the motel,
// morning at the diner) is NOT wired: the engine clock starts at 07:00
// (`world.ts`'s `meta.phases`) while the fiction's opening is 4 a.m., so a
// `clockPhase: 'morning'` rule would put Jack in the diner at the game's
// very first tick, before the player has ever met him. One unconditional
// post sidesteps that clock/fiction mismatch entirely, at the cost of the
// document's own "morning at the diner" texture — not reachable in this
// build regardless.
//
// GREETING RULE 1 — reachable, not "structurally unreachable" as §6.4's own
// annotation claims. The document was authored against the same engine gap
// `marlow.ts`/`whitlock.ts` originally documented (a room's own `onEnter`
// used to be the only way to set a "met" flag, firing before any greeting
// could). As of v0.8.0 the engine marks an NPC met via `npc.ts`'s own
// `markMet`, run only after a real ASK/TELL/SHOW/HELLO exchange — so
// `{ not: { met: JACK } }` is exactly the first HELLO JACK, the same fix
// already applied to `pearl.ts`/`whitlock.ts`. Transcribed exactly
// regardless (hard rule 5); rule ORDER is the document's own (§6.4's note:
// rule 2 sits above rule 3 because a man who has just learned his room was
// searched does not go back to being hospitable).
//
// NOUNS — `jack`, `man`, `brother`, `client`, `driver` only; `him`/`he` are
// dropped (main-session decision — pronouns are the parser's own fallback
// machinery, `parser/pronouns.ts`, not NPC nouns).
//
// TOPIC COUNT — the document's own §6.5 header says "thirteen" and its own
// §14 wiring table says "13 topics / 15 responses," but the body actually
// authors FOURTEEN distinct topics (jules, nobody, job, notebook, family,
// tattoo, letters, polaroid, keys, nolan, pearl, name, head, dad), two of
// which (job, tattoo) carry two rules each — 14 topics / 16 responses.
// Flagged as a doc-authoring miscount, not a cut: every topic block in the
// body is transcribed and wired; none dropped to hit the stated thirteen.
//
// WORD-COLLISION CALLS (topics are matched first-declared-wins,
// `npc.ts`'s `findTopic`) — three beyond the two the main session already
// resolved (`topic_job` before `topic_jules` with "job" dropped from
// `topic_jules`; "writing" kept on `topic_notebook` only, dropped from
// `topic_letters`):
//   1. "work" is on both `topic_job`'s and (per the document) `topic_nolan`'s
//      word lists. `topic_job` is declared first (main-session's own
//      ordering requirement), which would make `topic_nolan`'s "work" a
//      dead synonym — dropped from `topic_nolan` rather than left unreachable.
//   2. "counter" is on both `topic_job`'s and `topic_pearl`'s word lists,
//      same shape as #1 — dropped from `topic_pearl`.
//   3. `topic_name`'s own "who am i"/"am i" phrases lose to `topic_jules`'s
//      bare word "who" (a single-token match beats needing the full
//      three-token phrase) whenever `topic_jules` is declared first —
//      exactly the class of collision the main session's own "topic_name
//      before anything else that claims me" instruction is guarding
//      against, just via "who" rather than "me". `topic_name` is declared
//      before `topic_jules` to keep "ASK JACK WHO AM I" reaching the
//      identity topic rather than the missing-brother one.
//
// V_HUG — see `ids.ts`'s own comment on why "hug" moved off `V_KISS` (a
// hard verb-word collision, `validate.ts`) and what that costs `pearl.ts`.

import { T } from '../../../engine/ids';
import type { Effect } from '../../../engine/effects';
import type { NpcDefSlice, ShowResponseDef, TopicDef } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import {
  CLAIM_TICKET,
  CLUE_JULES,
  CLUE_TATTOO_GAP,
  FEDORA,
  FLAG_HEARD_NOLAN_NAME,
  FLAG_JACK_COVERING,
  FLAG_JACK_GAVE_KEYS,
  FLAG_JACK_SAW_PAGE,
  FLAG_OFFERED_THE_RIDE,
  FLAG_SAW_JACK_TATTOO,
  FLAG_TOLD_JACK_ABOUT_ROOM,
  JACK,
  JACKS_MOTEL,
  KEYRING,
  MEM_M1_HIRING,
  MEM_M3_ANALYTICAL,
  MEM_M3_DIRECT,
  MEM_M3_SOCIAL,
  MONSTER_TRUCK,
  MUG,
  PAGE_78,
  ROOM_KEY,
  SUNDOWN_DINER,
  V_ATTACK,
  V_FOLLOW,
  V_HUG,
  V_KISS,
  WORK_ORDER,
} from './ids';
import { ACT2_DAD_BOOTED, ACT2_HAS_AUDIT, ACT2_JACK_AWAY, ACT2_LUKE_REFERENCED, ACT2_NOTEBOOK, ACT2_REPLY_AUDIT, ACT2_RIG, ACT2_SHORTHAND_DECODED, ACT2_STARTED, ACT2_TRAVEL_SCRIPT } from '../act2/ids';
// D3, task A — §4.10's "ASK JACK ABOUT FENCE" and §5.4's persuasion
// (`SHOW NOTEBOOK/AUDIT TO JACK`). `act1/ids.ts` may not import a later
// act's `ids.ts` (that rule governs `ids.ts`-to-`ids.ts` imports only —
// see `act2/nolan.ts`'s own header note on the identical exception); this
// room/NPC file importing an id constant from `act3/ids.ts` creates no
// cycle either way.
import { ACT3_JACK_TOPIC_FENCE, ACT3_JACK_WILL_RAM, ACT3_PERIMETER_ROAD } from '../act3/ids';
import { ACT4_STARTED } from '../act4/ids';

// ---------------------------------------------------------------------------
// §6.3 — unknownTopic
// ---------------------------------------------------------------------------

const unknownTopic: string[] = [
  '"I don\'t know that." He says it fast, to get it out of the way of what he does want to talk about.',
  'He starts on it, and six words in it has turned back into his brother, and he does not appear to notice that it has.',
  '"That\'s not one of mine." He is not being short with you. He has been over what he has so often that he knows exactly where it stops.',
];

// ---------------------------------------------------------------------------
// §6.2 — description
// ---------------------------------------------------------------------------

const description =
  'Forty-odd and built like the job: a wide man in a T-shirt in a cold room, with forearms that have spent years under vehicles. Three days unshaved, and no decision made about it.\n\nOn the inside of his left forearm, above the wrist, there is a small tattoo in ink gone soft and blue. It is two or three strokes long. He is not hiding it and he is not showing it, and from where you are standing it could be anything.';

// ---------------------------------------------------------------------------
// §6.4 — greeting
// ---------------------------------------------------------------------------

const greeting: ProseRule[] = [
  // D0 amendment — the presence-and-passage prose document PART THREE §4,
  // transcribed exactly (hard rule 5). Prepended above every shipped rule
  // so it wins wherever Jack is actually at the counter (only reachable
  // post-`act2_started`, `{ npcAt: [JACK, SUNDOWN_DINER] }`'s own morning
  // schedule rule, above); the four rules below are otherwise unchanged
  // and still answer at the motel.
  {
    when: { at: SUNDOWN_DINER },
    text: [
      'He is on the third stool from the end, plate in front of him, cup filled twice already without his asking. "You came down," he says. "Told you about this counter." He does not ask how you slept, which is new.',
      'He got here before the griddle did — his stool is the warm one, and Pearl has stopped saying anything to him. "Sit," he says, and moves a folder off the stool beside him without looking at it.',
    ],
  },
  {
    // Reachable as of v0.8.0 — see this file's header.
    when: { not: { met: JACK } },
    text:
      'He gets the chair out from under the table with his foot and stands there until you are in it.\n\n"Nine last night," he says. "Then ten. Then I walked down to Marlow\'s at midnight and stood in the street like a fool." He is looking at the side of your head the whole time. "How long have you had that?"\n\nYou do not know. He takes that the way he is going to take everything else tonight, which is straight on.',
  },
  {
    when: { all: [{ flag: FLAG_TOLD_JACK_ABOUT_ROOM }, { at: JACKS_MOTEL }] },
    text: [
      'He does not sit down now. He talks at the window end of the room, with the curtain moved about two inches.',
      '"Truck\'s got gas in it," he says, apropos of nothing at all, which is what he says now instead of asking whether you are all right.',
    ],
  },
  {
    when: { all: [{ memory: MEM_M1_HIRING }, { at: JACKS_MOTEL }] },
    text:
      '"You want the coffee out of that machine, or you want to walk down to Pearl\'s when it\'s light," he says. "I know which I\'d do."\n\nIt is not the first time he has offered you that counter.',
  },
  {
    text: [
      'He is at the table with the folder open and three sheets out of it, which appear to be the three he always has out.',
      '"Five weeks I\'ve been in this room," he says, to nobody in particular. "A man could build something in five weeks."',
      'He has been awake so long that he has come out the far side of it and gone hospitable. "There\'s crackers. There\'s a whole thing of crackers."',
    ],
  },
];

// ---------------------------------------------------------------------------
// §6.5 — topics (fourteen; see this file's header on the document's own
// miscount). Declaration order matters (first-declared-wins) — see this
// file's header for the three word-collision calls this ordering resolves.
// ---------------------------------------------------------------------------

const TOPIC_JOB = T('act1_jack_topic_job');
const TOPIC_NAME = T('act1_jack_topic_name');
const TOPIC_JULES = T('act1_jack_topic_jules');
const TOPIC_NOBODY = T('act1_jack_topic_nobody');
const TOPIC_NOTEBOOK = T('act1_jack_topic_notebook');
const TOPIC_FAMILY = T('act1_jack_topic_family');
const TOPIC_TATTOO = T('act1_jack_topic_tattoo');
const TOPIC_LETTERS = T('act1_jack_topic_letters');
const TOPIC_POLAROID = T('act1_jack_topic_polaroid');
const TOPIC_KEYS = T('act1_jack_topic_keys');
const TOPIC_NOLAN = T('act1_jack_topic_nolan');
const TOPIC_PEARL = T('act1_jack_topic_pearl');
const TOPIC_HEAD = T('act1_jack_topic_head');
const TOPIC_DAD = T('act1_jack_topic_dad');
// Wave 5 — the close-out's own three additions (§9.1, §5.4, §16.1).
const TOPIC_S6 = T('act1_jack_topic_s6');
const TOPIC_TRASH = T('act1_jack_topic_trash');
const TOPIC_WALL_DRUG = T('act1_jack_topic_wall_drug');
// D2 amendment (task A) — five additions (D2 prose doc §9; plan §2 D2 row
// "Jack's Motel — the rig"). Local ids, same convention as this file's own
// act1_jack_topic_* declarations above (not centrally registered — that
// requirement is `act2/ids.ts`'s own, for ids its directory-scan test
// checks; this file's topic ids have never been declared there).
const TOPIC_ELI = T('act1_jack_topic_eli');
const TOPIC_RIG = T('act1_jack_topic_rig');
const TOPIC_HORSE = T('act1_jack_topic_horse');
const TOPIC_PLANT = T('act1_jack_topic_plant');

const jobResponse: ProseRule[] = [
  {
    when: { memory: MEM_M1_HIRING },
    text:
      '"Cash, because that\'s what I had, and because you didn\'t want anything with a name on it, which suited me." He turns his mug round on the table without picking it up. "Nine o\'clock, twice a week, at Pearl\'s counter. You tell me what you\'ve got and I don\'t ask how you came by it."\n\nHe looks up. "I asked you a thing that first morning. Asked it twice, because you didn\'t answer the first time." He waits, and then says it rather than let you not have it. "I asked whether you thought I was lying."\n\nBack to the mug. "You didn\'t answer it the second time either. I\'ve thought about that most days since."',
  },
  {
    text:
      '"Cash. Weekly, and whatever it costs you. Nine o\'clock, twice a week, at Pearl\'s counter." He turns his mug round on the table without picking it up. "You tell me what you\'ve got and I don\'t ask how you came by it."\n\nThen: "What have you got?" — with no weight on it at all, and when nothing comes he lets it go, the way he has been letting it go for three weeks.',
  },
];

const tattooResponse: ProseRule[] = [
  {
    when: { any: [{ memory: MEM_M3_ANALYTICAL }, { memory: MEM_M3_SOCIAL }, { memory: MEM_M3_DIRECT }] },
    text:
      'He turns his arm over on the table without being asked twice.\n\n    IV\n\n"Four. Luke\'s two, Eli\'s three, Sissy\'s five." He says them in order and does not stop at the end of the order, because there is no reason to. "Jules is one."\n\nYou put the paperwork to him: four of them on any piece of paper in this county, and four of them starting at two.\n\nJack looks at his own arm for a while.\n\n"Ask Luke why he\'s two," he says. "Go on. Ask him."',
  },
  {
    text:
      'He turns his arm over on the table so you can see it properly.\n\n    IV\n\n"We all got them the same afternoon. Dad drove us up to Rapid and paid for it and complained about the money the whole way home." He puts the arm back down. "Birth order. That\'s the whole of the joke. I\'m four."',
  },
];

const tattooEffects = [{ set: [FLAG_SAW_JACK_TATTOO, true] as [typeof FLAG_SAW_JACK_TATTOO, true] }, { grantClue: CLUE_TATTOO_GAP }];

// ---------------------------------------------------------------------------
// Wave 5 — the close-out's own three additions (`docs/superpowers/specs/
// 2026-09-06-act1-wave5-close-out-prose.md` §9.1, §5.4, §16.1). Prose
// transcribed exactly (hard rule 5).
// ---------------------------------------------------------------------------

/** §9.1 — SHOW WORK ORDER TO JACK / topic_s6, once the player holds it. Sets `jack_gave_keys`; hands over the keyring. */
const jackHandsOverKeysText =
  'He reads it twice, and then puts a finger on the first line and reads that on its own.\n\n"Six." He looks up. "He said six to me once. On the telephone. I thought he meant a floor — I said, what, upstairs? — and he laughed and let me carry on thinking it." Nothing moves on his face at all. "That\'s the whole of what I have about six, and I\'ve had five weeks to work on it."\n\nThen he gets up, lifts the ring off its nail, and puts it in your hand.\n\n"They\'re his. Take them. If they open something, open it."';

const jackHandsOverKeysEffects: Effect[] = [{ set: [FLAG_JACK_GAVE_KEYS, true] }, { move: [KEYRING, 'inventory'] }];

/** §5.4 — Route C: Jack idles the truck round at Nolan's, covering for the player's search of the trash. */
const jackTrashText =
  '"His bin." Jack gets there a sentence ahead of you and does not look pleased about how fast he got there. "Contractor comes for it in the morning. It\'ll be at the kerb by now."\n\nHe has the keys off the table before he has finished saying it. "I\'ll take the truck round to his front and sit there with it running. Tell him I\'ve come about my brother again. He\'ll come out on that porch and be sorry at me, and he is very good at that, and it takes a while."\n\nAt the door: "Don\'t be anywhere near me when I stop."';

/** §16.1 — ASK JACK ABOUT WALL DRUG / SHOW TICKET TO JACK, once the player holds the claim ticket. Sets `offered_the_ride`; fires the one-time END OF BUILD line. */
const jackWallDrugText =
  'He takes it, holds it out at arm\'s length, and reads all four words of it.\n\n"Wall Drug." He says it the way you say a place you have driven past nine hundred times. "He put something in at Wall Drug, and he kept the stub, and the stub was in a box only he could open."\n\nHe puts it back in your hand and goes and finds his boots.\n\n"Thirty-two miles. An hour, the way I drive it, and tonight I am going to drive it worse than that." The screen door goes off its spring behind him. "Get in."\n\nHe is at the driver\'s door with the keys in his fist, and the engine has not started yet.';

/**
 * §16.2 (wave 5) / D1 prose doc §21's own note — the shipped END OF BUILD
 * call is superseded: the ride now exists, so this no longer ends the
 * build. Sets `offered_the_ride` on the first ask (as before) and then
 * always routes to the travel script (§3's own ruling: "ASK JACK ABOUT WALL
 * DRUG / TELL JACK ABOUT TICKET ... routes to the same script with no
 * additional line" — the script's own variant selection, not this effect
 * list, decides whether that is the first ride's 8 beats or a shorter
 * repeat).
 */
const jackWallDrugEffects: Effect[] = [
  { if: { when: { not: { flag: FLAG_OFFERED_THE_RIDE } }, then: [{ set: [FLAG_OFFERED_THE_RIDE, true] }] } },
  { script: { id: ACT2_TRAVEL_SCRIPT, args: { mode: 'truck', to: 'wall_drug' } } },
];

// Wave 5's own three additions, declared as named `TopicDef`s so the SAME
// object reaches both `topics` (ASK) and `tellTopics` (TELL) without
// duplicating text (jack.ts's `tellTopics` overrides `topics` entirely for
// TELL — `npc.ts`'s `topicsFor` — so a topic meant to answer both verbs has
// to be listed in both arrays explicitly).
const topicS6: TopicDef = {
  id: TOPIC_S6,
  words: ['s6', 'work order', 'six', 'sublevel'],
  when: { has: WORK_ORDER },
  response: jackHandsOverKeysText,
  effects: jackHandsOverKeysEffects,
};

// "nolan" (bare) is deliberately NOT one of this topic's words, unlike the
// doc's own "TELL JACK ABOUT NOLAN" phrasing — `topic_nolan` (below)
// already claims bare "nolan" and is set BY THIS topic's own gate flag
// (`heard_nolan_name`), so adding it here would make every ASK/TELL ABOUT
// NOLAN after the first one resolve here instead, permanently burying the
// shipped `topic_nolan` conversation. Same class of word-collision call
// this file's own header already documents three of (dropped rather than
// silently absorbed) — see this task's report.
const topicTrash: TopicDef = {
  id: TOPIC_TRASH,
  words: ['trash', 'garbage', 'bin', "nolan's house", 'nolan house', 'nolans house', 'help'],
  when: { flag: FLAG_HEARD_NOLAN_NAME },
  response: jackTrashText,
  effects: [{ set: [FLAG_JACK_COVERING, true] }],
};

const topicWallDrug: TopicDef = {
  id: TOPIC_WALL_DRUG,
  words: ['wall drug', 'walldrug', 'ticket', 'claim ticket', 'stub'],
  when: { has: CLAIM_TICKET },
  response: jackWallDrugText,
  effects: jackWallDrugEffects,
};

// ---------------------------------------------------------------------------
// D2 amendment (task A) — five additions (D2 prose doc §9). Prose
// transcribed verbatim (hard rule 5).
// ---------------------------------------------------------------------------

/** §9.1 — words per the doc itself: `eli`, `three`, `energy`, `address`, `write`, `letter`, `post`. Declared ahead of `topic_family` (already claims bare "eli") and `topic_letters` (claims "letter") — first-declared-wins, `npc.ts`'s `findTopic` — so this wave's own writing-to-Eli conversation wins those words from here on; `topic_letters` keeps its remaining words ("letters"/"wrote"/"reply"/"replies"/"answered"/"mail"/"froze"/"signature") unaffected. Flagged in this task's report as a deliberate shadowing, not an oversight. */
const topicEli: TopicDef = {
  id: TOPIC_ELI,
  words: ['eli', 'three', 'energy', 'address', 'write', 'letter', 'post'],
  response:
    '"Eli." He puts his mug down. "You want to write to him. Right."\n\nHe turns a napkin over and writes an address on it with a pen off the counter,\nand he writes it without stopping to think, which tells you how many times he\nhas written it.\n\n"He answers paper. He\'s answered every letter I\'ve ever sent him on paper,\ninside a week, in a hand you could hang on a wall." A pause. "It\'s the other\nsort he answers wrong. The quick sort. Those come back to me chatty."\n\nHe slides the napkin across. "Don\'t put my name on it."',
};

/** §9.2 — v2, gated on `act2_dad_booted`; declared ahead of the shipped `TOPIC_DAD` below so it wins while the flag holds and falls through to the shipped response otherwise. */
const topicDadV2: TopicDef = {
  id: TOPIC_DAD,
  words: ['dad', 'father', 'old man', 'house rules', 'catan', 'game', 'parents'],
  when: { flag: ACT2_DAD_BOOTED },
  response:
    'You tell him.\n\nJack does not say anything for long enough that Pearl comes down the counter,\nlooks at the two of you, and goes away again without filling anything.\n\n"Right," he says.\n\nHe turns his mug round on the table without picking it up.\n\n"Give me a night."',
};

/** §9.3 — after the rig exists (§9.4's own event). */
const topicRig: TopicDef = {
  id: TOPIC_RIG,
  words: ['rig'],
  when: { objectState: [ACT2_RIG, 'hidden', false] },
  response:
    '"It\'s a box, a battery, and a speaker off a thing I don\'t need a speaker off\nany more." He is pleased with it and is not going to say so. "Runs a day.\nDon\'t drop it in water and don\'t ask me what the tape is holding on, because\nthe answer is the tape."',
};

const topicHorse: TopicDef = {
  id: TOPIC_HORSE,
  words: ['horse', 'horses'],
  response:
    '"They\'re not anybody\'s that I know of, and they\'ve been not anybody\'s for\nabout as long as I\'ve been looking at them." He shrugs with one shoulder.\n"Somebody\'s feeding them. It isn\'t me."',
};

const topicPlant: TopicDef = {
  id: TOPIC_PLANT,
  words: ['plant', 'facility', 'fence', 'jobs'],
  response:
    '"Two hundred jobs and a fence." He says it like a line he has said before.\n"Nolan\'s the one you\'d ask. Nolan\'s all right — Nolan\'s better than all right,\nhe came to our mother\'s funeral and he stayed for the washing up."\n\n"He\'ll tell you anything you ask him. That\'s the trouble with asking him."',
};

// ---------------------------------------------------------------------------
// D3, task A — §4.10's "ASK JACK ABOUT FENCE," at the perimeter, truck
// present, before persuasion. Shadows `topicPlant`'s own bare "fence" word
// (declared FIRST below, same idiom this file's own header note on
// `topicEli`/wave 5's three additions already documents) while its `when`
// holds; falls through to `topicPlant`'s ordinary response the rest of the
// time (`ASK JACK ABOUT FENCE` anywhere else, or once persuaded).
// ---------------------------------------------------------------------------

const topicFence: TopicDef = {
  id: ACT3_JACK_TOPIC_FENCE,
  words: ['fence', 'wire', 'mesh'],
  when: { all: [{ at: ACT3_PERIMETER_ROAD }, { objectAt: [MONSTER_TRUCK, ACT3_PERIMETER_ROAD] }, { not: { flag: ACT3_JACK_WILL_RAM } }] },
  response:
    'He looks at it the way a man looks at a job.\n\n"Eight foot. Posts at eight foot, set in about two and a half by the look of\nthe spoil they never took away." He is not boasting; he is estimating. "It\'d\ngo. It\'d cost me a bumper and a headlamp and I\'d not do it for a maybe."',
};

// ---------------------------------------------------------------------------
// E0 task J — §20. `TOPIC_ACT4_WEEKS` is a new topic, declared ABOVE
// `topic_jules` (this file's own header note on `topic_jules`'s existing
// word claims, and the E0 wiring summary's own instruction: "the new weeks
// topic goes above topic_jules"). `topicJulesV2` supersedes the shipped
// `TOPIC_JULES` entry while `act4_started` holds — the same "same id,
// gated, declared first" idiom `topicDadV2` (`act2/dad.ts`) already uses.
// ---------------------------------------------------------------------------

const TOPIC_ACT4_WEEKS = T('act4_jack_topic_weeks');

const topicAct4Weeks: TopicDef = {
  id: TOPIC_ACT4_WEEKS,
  words: ['weeks', 'time', 'how long', 'five weeks', 'how much time'],
  when: { flag: ACT4_STARTED },
  response:
    '"Five weeks he\'s been gone." Jack has this by heart and it costs him nothing to say. "Three weeks you\'ve been looking for him."\n\nTwo numbers, on a table, with nobody putting them together.\n\nHe gets up and does something to the coffee machine that the coffee machine did not need.',
};

const topicJulesV2: TopicDef = {
  id: TOPIC_JULES,
  words: ['jules', 'brother', 'sibling', 'missing', 'disappear', 'disappeared', 'gone', 'case', 'who'],
  when: { flag: ACT4_STARTED },
  response:
    '"Nothing\'s changed here." He says it fast, to get to the next part. "Luke\'s coming out. To the plant. Twenty years, and he\'s coming to this county, and it isn\'t for me."\n\nThe folder has been on the table the whole time you have been in this room and he has not opened it once.\n\n"I\'ll be at that road."',
};

const topics: TopicDef[] = [
  // D3, task A — declared first; shadows `topicPlant`'s own bare "fence"
  // word while its own `when` holds (see `topicFence`'s own comment above).
  topicFence,
  // D2 amendment (task A) — declared first for the same reason wave 5's own
  // three additions are (below): `topicEli`'s words shadow `topic_family`'s
  // bare "eli" and `topic_letters`'s bare "letter" (see `topicEli`'s own
  // comment); `topicDadV2` must precede the shipped `TOPIC_DAD` entry it
  // supersedes while the flag holds.
  topicEli,
  topicDadV2,
  topicRig,
  topicHorse,
  topicPlant,
  // Wave 5's own three additions, declared FIRST (same idiom as this
  // file's own header note on TOPIC_NAME/TOPIC_JULES): `topic_job`'s bare
  // word "work" is a single-token match against the raw topic "work
  // order" (`npc.ts`'s `topicWordsMatch`: a single-token word matches if
  // it is ANY token of the raw topic, not the whole phrase), and
  // `topic_keys`'s bare word "house" would win the same way against
  // "nolan's house" — both would otherwise shadow these three topics
  // entirely regardless of word list. Each is `when`-gated, so declaring
  // them first costs nothing when the gate doesn't hold: `findTopic` just
  // keeps walking to `topic_job`/etc., exactly as before.
  topicS6,
  topicTrash,
  topicWallDrug,
  {
    id: TOPIC_JOB,
    words: ['job', 'work', 'hired', 'hire', 'terms', 'money', 'pay', 'paid', 'cash', 'fee', 'deal', 'arrangement', 'report', 'reports', 'counter'],
    response: jobResponse,
  },
  {
    id: TOPIC_NAME,
    words: ['name', 'my name', 'who am i', 'me', 'myself', 'called', 'identity', 'am i'],
    response:
      '"You never gave me one." He says it like a man reading back an invoice. "First morning. I asked, you didn\'t answer, and I took it that it was part of what I was paying for."\n\n"I\'ve called you nothing at all for three weeks. You\'d be amazed how far you get."',
  },
  topicAct4Weeks,
  topicJulesV2,
  {
    id: TOPIC_JULES,
    words: ['jules', 'brother', 'sibling', 'missing', 'disappear', 'disappeared', 'gone', 'case', 'who'],
    response:
      '"Jules." He spells it. He has got into the habit of spelling it. "My oldest brother. Facilities supervisor out at the plant, and five weeks ago he stopped being anywhere at all."\n\nHe does not use the word missing. He is careful about that word in a way that suggests somebody has used it at him.\n\n"He\'d got strange before it. Six months of strange — not answering, then answering too fast. I put it down to the job." A hand goes flat on the table and comes off again. "It wasn\'t the job."',
    effects: [{ grantClue: CLUE_JULES }],
  },
  {
    id: TOPIC_NOBODY,
    words: ['remember', 'remembers', 'nobody', 'anybody', 'believe', 'crazy', 'delusional', 'proof', 'lying', 'alone', 'mad'],
    response:
      '"Nobody remembers him." He says it like a man who has already been laughed at for it. "Not the sheriff. Not the county. Not the man he worked for. Not Pearl, and Pearl has fed this family for forty years."\n\nHe waits to see what your face does. He has got good at watching that.\n\n"I\'m not asking you to believe me. I asked you to go and look. There\'s a difference and I\'ve got very clear on it."',
  },
  {
    id: TOPIC_NOTEBOOK,
    words: ['notebook', 'book', 'journal', 'diary', 'notes', 'writing', 'handwriting', 'shorthand', 'papers'],
    response:
      '"He kept a book." Jack\'s hands stop moving. "Not a diary — a work book. Figures, readings, things he was checking on. He carried it inside his coat and he wrote in it at the dinner table like it was rude of him."\n\n"I saw it once. He told me it was work."\n\nThen: "It isn\'t at his place. I\'ve been through his place twice and I\'d have known it, because it has a rubber band round it and he\'s had that book since he was twenty-nine."',
  },
  {
    id: TOPIC_FAMILY,
    words: ['family', 'brothers', 'sister', 'siblings', 'luke', 'eli', 'sissy', 'president', 'astronaut', 'mars', 'famous'],
    response:
      '"There\'s four of us that anybody\'s heard of." He says it with no edge on it, which is worse. "Luke\'s the President. Eli does energy, whatever that means, and sleeps eleven hours a day. Sissy\'s on Mars, which I still can\'t say out loud without it sounding like a lie."\n\n"And me. I drive a truck over other trucks." He is not fishing; it is the family\'s own joke and he has told it a thousand times. "Somebody had to stay where he was. I wrote to Luke about Jules. More than once."',
    // D1 amendment (Stage D1 prose doc §20; ids.ts's own ACT2_LUKE_REFERENCED
    // comment) — no prose change. M12's other half-trigger: this is the only
    // place in the shipped game where Luke is mentioned in the player's
    // hearing.
    effects: [{ set: [ACT2_LUKE_REFERENCED, true] }],
  },
  {
    id: TOPIC_TATTOO,
    words: ['tattoo', 'tattoos', 'ink', 'arm', 'forearm', 'wrist', 'numeral', 'numerals', 'number', 'numbers', 'iv', 'four', 'roman', 'mark'],
    response: tattooResponse,
    effects: tattooEffects,
  },
  {
    id: TOPIC_LETTERS,
    words: ['letters', 'letter', 'wrote', 'reply', 'replies', 'answered', 'mail', 'froze', 'signature'],
    response:
      '"I wrote to him about Jules. Proper letters, and then the other kind, when the proper ones didn\'t do anything."\n\n"He writes back. That\'s the part. He writes back every time, nice as you like, asks after everybody, and never once answers the question I asked him."\n\nHe shuts the folder with one hand. "Twenty years I\'ve been the one that stayed. I\'d have taken him not writing back."',
  },
  {
    id: TOPIC_POLAROID,
    words: ['polaroid', 'photo', 'photograph', 'picture', 'snapshot', 'flare', 'porch', 'damage'],
    response:
      '"That\'s the porch at the old place. Dad\'s sixtieth." He does not have to look at it to say what is in it. "Somebody left the camera on the seat of a truck in July and half the pack came out like that."\n\n"He\'s on the left. That\'s his arm."\n\nThen he is talking about the porch, and the old place, and what happened to the old place.',
  },
  {
    id: TOPIC_KEYS,
    words: ['keys', 'key', 'keyring', 'ring', 'spares', 'shed', 'place', 'his place', 'apartment', 'house'],
    response:
      '"His spares. He left them with me when he took the place out on the county road." He does not take them off the nail. "That\'s how I got in. Twice. There\'s nothing in it — there\'s less in it than there ought to be, and I couldn\'t tell you what\'s gone, because I couldn\'t tell you what was ever there."',
  },
  {
    id: TOPIC_NOLAN,
    words: ['nolan', 'manager', 'boss', 'supervisor', 'plant boss', 'foreman'],
    response:
      '"Nolan. Jules\'s manager out there, near enough nine years." Jack\'s face does something small and unfriendly and stops doing it. "I went out to his house. He gave me coffee on the porch and said he was sorry, and he was sorry, and he did not know who I was talking about."\n\n"He said the name back to me wrong. Twice, and corrected himself both times. I still don\'t know what to do with that."',
    effects: [{ set: [FLAG_HEARD_NOLAN_NAME, true] }],
  },
  {
    id: TOPIC_PEARL,
    words: ['pearl', 'diner', 'sundown', 'breakfast', 'mornings', 'coffee', 'eat', 'food'],
    response:
      '"Six every morning, at that counter. It\'s the only hour of the day I know what I\'m doing." He nearly smiles about it. "She feeds me and she lets me talk and she doesn\'t remember him either, and she has known this family since before I could see over that counter."\n\n"That\'s the one that gets me. Not the sheriff. Her."',
  },
  {
    id: TOPIC_HEAD,
    words: ['head', 'wound', 'hurt', 'blood', 'injury', 'doctor', 'clinic', 'hospital', 'attack', 'hit', 'last night', 'tonight'],
    response:
      '"Somebody hit you." He says it as a finding. "Front or behind?"\n\nBehind.\n\n"Then they weren\'t trying to talk to you first." He sits back down harder than he meant to. "Clinic\'s at nine. I\'ll drive you and I\'ll sit in the waiting room, and if they want a name for the form they can have mine."',
  },
  {
    id: TOPIC_DAD,
    words: ['dad', 'father', 'old man', 'house rules', 'catan', 'game', 'parents'],
    response:
      '"That\'s his writing in the lid." Jack does not pick the box up. "Commissioner, then a senator, then a nuisance. Six years gone." He almost laughs. "He\'d have had this sorted by Thursday and been wrong about all of it."',
  },
  {
    id: TOPIC_S6,
    words: ['s6', 'work order', 'six', 'sublevel'],
    when: { has: WORK_ORDER },
    response: jackHandsOverKeysText,
    effects: jackHandsOverKeysEffects,
  },
  {
    id: TOPIC_TRASH,
    words: ['trash', 'garbage', 'bin', "nolan's house", 'nolan house', 'nolans house', 'help'],
    when: { flag: FLAG_HEARD_NOLAN_NAME },
    response: jackTrashText,
    effects: [{ set: [FLAG_JACK_COVERING, true] }],
  },
  {
    id: TOPIC_WALL_DRUG,
    words: ['wall drug', 'walldrug', 'ticket', 'claim ticket', 'stub'],
    when: { has: CLAIM_TICKET },
    response: jackWallDrugText,
    effects: jackWallDrugEffects,
  },
];

// ---------------------------------------------------------------------------
// §6.6 — tellTopics (two overrides)
// ---------------------------------------------------------------------------

const TELL_ROOM = T('act1_jack_tell_room');
const TELL_MEMORY = T('act1_jack_tell_memory');

const tellTopics: TopicDef[] = [
  {
    id: TELL_ROOM,
    words: ['room', 'attack', 'attacked', 'robbed', 'search', 'searched', 'break in', 'breakin', 'burglary', 'ransacked', 'crime', 'night'],
    response:
      'You tell him the room was gone through while you were in it, and that nothing is gone.\n\nJack stops moving entirely, which is the first time tonight.\n\n"Nothing." He wants it again. "You woke on the floor of a room somebody had been through, and there\'s nothing missing out of it."\n\nHe gets up, moves the curtain two inches with one finger, and looks at his own truck in his own lot for a while.\n\n"Then they got what they came for, or they didn\'t and they\'ll be back." He lets the curtain go. "Either way there\'s somebody else looking for the same thing I am, and I\'ve spent five weeks telling this town there\'s nothing to look for."',
    effects: [{ set: [FLAG_TOLD_JACK_ABOUT_ROOM, true] }],
  },
  {
    id: TELL_MEMORY,
    words: ['memory', 'amnesia', 'forgot', 'forget', 'remember', 'name', 'cant remember', 'nothing'],
    response:
      'You tell him you cannot remember your own name.\n\nJack takes a while over it. You can hear the ice machine.\n\n"Doesn\'t change what I\'m paying for," he says. "I never had it anyway." Then, and it is plainly the arithmetic he does not like the shape of: "Does it change what you found?"',
  },
  // Wave 5 — "TELL JACK ABOUT NOLAN" / "TELL JACK ABOUT TICKET" (§5.4, §16.1)
  // reach the same two topics ASK does; see this file's own comment above
  // `topicTrash`/`topicWallDrug` for why they're declared once and shared.
  topicTrash,
  topicWallDrug,
];

// ---------------------------------------------------------------------------
// D3, task A — §5.4's persuasion text, shared by both accepted objects
// (the decoded notebook, the audit reply).
// ---------------------------------------------------------------------------

const persuadeJackText =
  'He reads it with the interior light on and the engine off, and he takes his\ntime, and he goes back up the page twice.\n\nThen he puts it on the seat between you and looks out through the windscreen\nat eight feet of somebody else\'s mesh.\n\n"Five weeks," he says. "Five weeks of being the crank. Sheriff\'s got a file\nwith my name on it and it\'s a file about *me*."\n\nHe turns the key. "Say the word and I\'ll put a hole in it. I\'d like that on\npaper somewhere, that it was me that said it."';

// ---------------------------------------------------------------------------
// §6.7 — showResponses (four)
// ---------------------------------------------------------------------------

const showResponses: ShowResponseDef[] = [
  {
    objects: [FEDORA],
    response: '"Keep it on," he says. "It\'s cold in here and your head\'s open."',
  },
  {
    objects: [MUG],
    response: 'He leans over and reads it without picking it up. "Take that back to her or she\'ll have it off you at breakfast."',
  },
  {
    objects: [PAGE_78],
    response:
      'He goes still. Then he takes it — the only thing he has taken out of your hand all night — and rubs the corner between finger and thumb.\n\n"Where did you get this?"\n\nYou tell him. He gives it back, and sits down, and for a minute or two he is not much use to anybody.',
    effects: [{ set: [FLAG_JACK_SAW_PAGE, true] }],
  },
  {
    objects: [ROOM_KEY],
    response: '"Marlow\'s tag." He turns it over once and gives it back. "Five\'s still paid, next door. I\'m not going to keep saying it."',
  },
  // Wave 5 — SHOW WORK ORDER TO JACK (§9.1) and SHOW TICKET TO JACK (§16.1)
  // share their own topics' exact text/effects.
  {
    objects: [WORK_ORDER],
    response: jackHandsOverKeysText,
    effects: jackHandsOverKeysEffects,
  },
  {
    objects: [CLAIM_TICKET],
    response: jackWallDrugText,
    effects: jackWallDrugEffects,
  },
  // D3, task A — §5.4's persuasion. Both accepted (D2's two channels
  // arriving at the same door); gated `{ at: act3_perimeter_road }` — see
  // this task's report on that location gate (not explicit in the doc's
  // own §5.4 header, a builder decision for narrative consistency with the
  // scene's own "eight feet of somebody else's mesh" framing).
  {
    objects: [ACT2_NOTEBOOK],
    when: { all: [{ at: ACT3_PERIMETER_ROAD }, { flag: ACT2_SHORTHAND_DECODED }] },
    response: persuadeJackText,
    effects: [{ set: [ACT3_JACK_WILL_RAM, true] }],
  },
  {
    objects: [ACT2_REPLY_AUDIT],
    when: { all: [{ at: ACT3_PERIMETER_ROAD }, { flag: ACT2_HAS_AUDIT }] },
    response: persuadeJackText,
    effects: [{ set: [ACT3_JACK_WILL_RAM, true] }],
  },
];

// ---------------------------------------------------------------------------
// §6.8 — handlers (four)
// ---------------------------------------------------------------------------

const attackText = 'You would have to explain it to him afterwards, and he would listen.';
const kissText = 'He takes it the way he has taken everything else tonight, which is as further evidence that somebody hit you in the head.';
const hugText = 'He allows it. He is not good at it and he does not stop it, and afterwards neither of you refers to it again.';
const followText = '"I\'m not going anywhere." He sits back down in the chair by the door, facing the lot. "That\'s been the whole of my week."';

export const jack: NpcDefSlice = {
  // Main-session decision — see this file's header. §6's own header calls
  // for a phase-based schedule the engine's own clock start (07:00) can't
  // support without putting Jack in the wrong place at the game's opening.
  // D0 amendment (Stage D plan §2's D0 table; ADR 0011 rule 5): prepended,
  // gated on `act2_started` — Jack at the diner counter mornings (canon
  // 52), unless the travel script has him pinned away
  // (`act2_jack_away`). Before `act2_started` the single unconditional
  // post below is the whole schedule, unchanged since v0.9.0.
  schedule: [
    { when: { all: [{ flag: ACT2_STARTED }, { clockPhase: 'morning' }, { not: { flag: ACT2_JACK_AWAY } }] }, room: SUNDOWN_DINER },
    { room: JACKS_MOTEL },
  ],
  nouns: ['jack', 'man', 'brother', 'client', 'driver'],
  adjectives: ['big', 'wide'],
  name: 'Jack',
  pronoun: 'he',
  description,
  topics,
  tellTopics,
  showResponses,
  unknownTopic,
  greeting,
  handlers: [
    { verbs: [V_ATTACK], effects: [{ say: attackText }] },
    { verbs: [V_KISS], effects: [{ say: kissText }] },
    { verbs: [V_HUG], effects: [{ say: hugText }] },
    { verbs: [V_FOLLOW], effects: [{ say: followText }] },
  ],
};

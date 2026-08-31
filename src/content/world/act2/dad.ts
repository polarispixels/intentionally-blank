// Act II, Stage D2, task A — Dad (`docs/superpowers/specs/2026-09-10-
// stage-d2-prose.md` §5–§8, §30 item 1). Prose transcribed verbatim (hard
// rule 5). Plan §4.4: "Position is derived from the USB's location and the
// terminal's power ... so a save is always consistent and nothing pins
// him. The rig is the only `following` case, set by the USB's PUT-IN/TAKE
// handlers" (`objects/usb.ts`, this same task).
//
// FIFTEEN TOPICS — the doc's own header (§6) says "fourteen"; §30 item 1's
// own fifteenth (`topic_sublevel`, "the constraint is that he must never
// assert it") is wired per the main session's ruling (status line q4: "the
// fifteenth topic sublevel is wired").
//
// NOUNS — `dad`, `father`, `old man`, `voice`, `speaker`. NOT `stick`/`usb`
// (the USB object owns those, `objects/cache.ts`) and NOT `stick`/`he`
// (pronoun fallback is `parser/pronouns.ts`'s own machinery, not an NPC
// noun — same call `jack.ts`'s own header already makes).
//
// GREETING — three `ProseRule`s (§5.2). Rule 1 (`not
// act2_dad_greeted_once`) is unreachable in play: `act2_dad_boot`'s first
// run sets that flag directly (an `Effect`, which a `ProseRule` cannot
// carry — mirrors `jack.ts`'s own header on the same engine gap), so no
// greeting is ever rendered while it is still false. Transcribed anyway,
// matched to the shipped-greeting idiom (§5.2's own instruction).
//
// RULE 2'S "ONCE" — `ProseRule` has no `Effect` slot at all (`prose.ts`:
// `{ when?, text }`, nothing else), so nothing about rendering rule 2 can
// itself set `act2_dad_said_mannerism`. Per this wave's own ruling: the
// rule's `when` reads `{ not: { flag: ACT2_DAD_SAID_MANNERISM } }`, and the
// flag is set by a `world.events` entry, `once: true, when: { met:
// ACT2_DAD }` (`ACT2_DAD_MANNERISM_EVENT`, below) — the first turn Dad is
// ever "met" (any ASK/TELL/SHOW/HELLO exchange, `npc.ts`'s `markMet`,
// applied after that turn's own text renders). CAVEAT, stated rather than
// silently accepted: if the player's first conversational turn with Dad is
// a topic (ASK DAD ABOUT SELF) rather than HELLO, `met` becomes true that
// same turn and the event fires before any greeting has ever been
// rendered — so a later HELLO finds the flag already set and lands
// straight on rule 3, and rule 2's line is never spoken at all. This is the
// accepted shape of "Q9's working idea" (§5.2's own note: "ASSUMPTION,
// §26"), not a bug this task introduces further mitigation for.
//
// SHOWS — §7.1 (`SHOW NOTEBOOK TO DAD`), §7.2 (`SHOW USB/LABEL TO DAD`),
// §7.3 (`SHOW POLAROID TO DAD`, either intact Polaroid or the cache one).
//
// HANDLERS — §7.5 (`ATTACK DAD`; the doc pairs it with `BREAK TERMINAL`
// while docked, which needs a matching amendment on the terminal object
// itself, `act1/objects/terminal.ts`, this same task) and §7.6 (`HUG`/
// `KISS`/`TOUCH DAD`, one shared text).
//
// CONFABULATIONS — `topic_luke`/`topic_sissy`/`topic_year` grant
// `ACT2_CLUE_DAD_CUTOFF` "only if the player has heard Jack's family
// topic" (this wave's own ruling 1). `jack.ts`'s `topic_family` sets only
// `ACT2_LUKE_REFERENCED` (no generic "heard the family topic" flag exists)
// — per the ruling's own fallback, gated on `{ met: JACK }` instead.
//
// D4 TASK E — three more topics (`docs/superpowers/specs/2026-09-12-
// stage-d4-prose.md` §14, §17, §21.1's `act2_dad` row, §21.3), inserted
// above the shipped fifteen (§21.1: "gains three topics inserted above the
// shipped rules; none deleted"): `topic_seal` (`when: { flag:
// ACT3_SAW_SEAL }`), `topic_rails` (`when: { flag: ACT3_WALKED_TUNNEL }`),
// `topic_interlock` (`when: { flag: ACT3_BYPASS_SEEN }`). All three are
// location-agnostic (canon 53) and none has a repeat/"block" rule — the
// doc writes one response each, no second-asking variant. Hard rule 5:
// the doc's own status line trims Dad's "four hundred thousand dollars"
// to "a great deal" (entry 37) — transcribed verbatim as it now reads.
// `../act3/ids` is imported here (not from `./ids`) for the three flags —
// `act2/nolan.ts` and `act2/travel.ts` already import from `../act3/ids`,
// so this is not a new precedent; `act3/ids.ts` imports `act2/ids.ts`, so
// only the reverse (an `ids.ts` file importing another act's `ids.ts`
// "up" the layer it doesn't already depend on) would cycle, and this is a
// non-ids module importing an `ids.ts` file, which is fine.
//
// D5 TASK H — three more topics (`docs/superpowers/specs/2026-09-13-
// stage-d5-prose.md` §19.2-§19.4), inserted above D4 task E's three (§39.1:
// "gains four topics inserted above D4's three; none deleted" — the fourth
// addition, §19.1's push, is `act3/events.ts`'s `ACT3_DAD_PUSH_S5_EVENT`,
// not a topic): `topic_rounds` (`ProseRule[]` on `npcAt`, five rules —
// Bay/Hub/S5/Chase then an unconditional catch-all for `offstage`/the alarm
// route), `topic_how_do_you_know` (one response, no gate), `topic_chairs`
// (`when: { flag: ACT3_REACHED_S6 }`). Canon 61/47 both hold: no rule
// prints a clock time, only durations in words (§19's own note).

import type { Effect } from '../../../engine/effects';
import { apply } from '../../../engine/effects';
import { flag } from '../../../engine/cond';
import { render } from '../../../engine/prose';
import type { EventDef, GameEvent, NpcDefSlice, PuzzleDef, ScriptFn, ShowResponseDef, TopicDef } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import type { Cond } from '../../../engine/cond';
import { INTACT_POLAROIDS, JACK, TERMINAL, V_ATTACK, V_HUG, V_KISS, YOUR_ROOM } from '../act1/ids';
import { TOUCH } from '../act1/verbs';
import {
  ACT3_BYPASS_SEEN,
  ACT3_PIPE_CHASE,
  ACT3_REACHED_S6,
  ACT3_S5_REACTOR_INTERFACE,
  ACT3_S6_ARCHIVE_HUB,
  ACT3_S6_MAINTENANCE_BAY,
  ACT3_SAW_SEAL,
  ACT3_WALKED_TUNNEL,
} from '../act3/ids';
import { ACT4_EV_DAD_BREATH, ACT4_PROFILE_SEEN } from '../act4/ids';
import {
  ACT2_CACHE_POLAROID,
  ACT2_CLUE_DAD_BOOTS,
  ACT2_CLUE_DAD_CUTOFF,
  ACT2_CLUE_SERVICE_TUNNEL,
  ACT2_CUSTODIAN,
  ACT2_DAD,
  ACT2_DAD_BLOCK_JACK,
  ACT2_DAD_BLOCK_JULES,
  ACT2_DAD_BOOTED,
  ACT2_DAD_GREETED_ONCE,
  ACT2_DAD_SAID_MANNERISM,
  ACT2_DAD_TOLD_HEARING,
  ACT2_DAD_TOLD_TUNNEL,
  ACT2_DAD_TOPIC_CHAIRS as TOPIC_CHAIRS,
  ACT2_DAD_TOPIC_COPY as TOPIC_COPY,
  ACT2_DAD_TOPIC_ELI as TOPIC_ELI,
  ACT2_DAD_TOPIC_FACILITY as TOPIC_FACILITY,
  ACT2_DAD_TOPIC_HEADACHES as TOPIC_HEADACHES,
  ACT2_DAD_TOPIC_HEARING as TOPIC_HEARING,
  ACT2_DAD_TOPIC_HOW_DO_YOU_KNOW as TOPIC_HOW_DO_YOU_KNOW,
  ACT2_DAD_TOPIC_INTERLOCK as TOPIC_INTERLOCK,
  ACT2_DAD_TOPIC_JACK as TOPIC_JACK,
  ACT2_DAD_TOPIC_JULES as TOPIC_JULES,
  ACT2_DAD_TOPIC_LABEL as TOPIC_LABEL,
  ACT2_DAD_TOPIC_LUKE as TOPIC_LUKE,
  ACT2_DAD_TOPIC_POKER as TOPIC_POKER,
  ACT2_DAD_TOPIC_RAILS as TOPIC_RAILS,
  ACT2_DAD_TOPIC_ROUNDS as TOPIC_ROUNDS,
  ACT2_DAD_TOPIC_SEAL as TOPIC_SEAL,
  ACT2_DAD_TOPIC_SELF as TOPIC_SELF,
  ACT2_DAD_TOPIC_SISSY as TOPIC_SISSY,
  ACT2_DAD_TOPIC_SUBLEVEL as TOPIC_SUBLEVEL,
  ACT2_DAD_TOPIC_TERMINAL as TOPIC_TERMINAL,
  ACT2_DAD_TOPIC_YEAR as TOPIC_YEAR,
  ACT2_KNOWS_TUNNEL_MOUTH,
  ACT2_NOTEBOOK,
  ACT2_P12_BOOT_DAD,
  ACT2_Q_BOOT_USB,
  ACT2_SHORTHAND_DECODED,
  ACT2_USB,
  ACT2_WD_TERMINAL,
  EVENT_ACT2_DAD_MANNERISM,
} from './ids';

// ---------------------------------------------------------------------------
// §5.1 — the boot, eight beats, `kind: 'beat'` (`act2/travel.ts`'s idiom).
// ---------------------------------------------------------------------------

const BOOT_BEATS: string[] = [
  'The chain goes on the back of the machine by feel and takes two tries. The\nstick goes on the end of the chain and takes one.',
  'Nothing happens for long enough that you begin composing what you are going to\nsay about this afterwards, and to whom.',
  'Then the screen clears itself without being asked and starts counting things.\nMemory, in a unit that has not impressed anybody in decades. A disk. Two\nports. A keyboard, which it finds, and appears pleased about.',
  '    VOLUME LABEL:  DAD\n\n    88 BAD SECTORS - MARKED, NOT REPAIRED',
  'The counting stops. The cursor sits under the last line for four seconds\ndoing nothing at all, and in those four seconds you notice that you are\nstanding up straight.',
  'Behind the grille on the front of the machine there is a speaker an inch\nacross which has spent its entire working life making one noise.\n\nIt makes several.',
  '"— and the other thing about a hotel," says a man, at ordinary conversational\nvolume, halfway through a sentence he began somewhere else, "is that nobody\nin the history of the world has ever been glad to be in one. Now. Where\'d you\ngo. You went quiet on me."',
  'A pause the length of a man looking up.\n\n"Well," he says. "Hello."',
];

// ---------------------------------------------------------------------------
// §5.2 — greeting (3 rules).
// ---------------------------------------------------------------------------

const greeting: ProseRule[] = [
  { when: { not: { flag: ACT2_DAD_GREETED_ONCE } }, text: '"Hello," he says again, in case it did not take.' },
  {
    when: { not: { flag: ACT2_DAD_SAID_MANNERISM } },
    text:
      '"There you are." Something in the fan changes note and settles. "You take a\nbreath in before you say a name. Every time. Somebody else used to do that\nand it drove me —"\n\nHe stops. It is a very short stop.\n\n"Never mind. What have you got for me."',
  },
  {
    text: ['"Go ahead."', '"Right. Same room, is it? I can hear the same room."', '"I\'m here. I\'m always here. That\'s the deal and I\'d not change it."'],
  },
];

/** The mannerism flag — see this file's own header. */
export const ACT2_DAD_MANNERISM_EVENT: EventDef = {
  id: EVENT_ACT2_DAD_MANNERISM,
  when: { met: ACT2_DAD },
  once: true,
  effects: [{ set: [ACT2_DAD_SAID_MANNERISM, true] }],
};

// E0 task J — §19, canon 59's Act IV instance. `act4_ev_dad_breath` is
// namespaced `act4_*` (declared in `act4/ids.ts`, this task's own labelled
// block) but the `EventDef` itself lives here, per this file's own "events
// export" idiom above, and is registered in `act4/index.ts`'s own `events`
// map (not `act2/index.ts` — this is Act IV content). One beat, no name, no
// camera, no gloss. `{ at: ACT3_S6_ARCHIVE_HUB }` is a builder addition
// beyond the prose doc's own literal `when` (`{ all: [{ flag:
// act4_profile_seen }, { npcAt: [act2_dad, act3_s6_archive_hub] }] }`): the
// doc's Cond alone never checks the *player's* own location, and this
// codebase's other ambient NPC-witnessed events (e.g. the custodian rounds,
// `act3/events.ts`) all gate on player presence explicitly for exactly this
// reason — flagged in this task's report.
export const ACT4_EV_DAD_BREATH_EVENT: EventDef = {
  id: ACT4_EV_DAD_BREATH,
  when: { all: [{ flag: ACT4_PROFILE_SEEN }, { npcAt: [ACT2_DAD, ACT3_S6_ARCHIVE_HUB] }, { at: ACT3_S6_ARCHIVE_HUB }] },
  once: true,
  effects: [{ say: 'The fan on the rig takes a breath in, which is a thing a fan does not need to do and has not done all week.\n\n"Well," says Dad, from a standing start. "Go on, then."' }],
};

// ---------------------------------------------------------------------------
// §6 — fourteen topics (plus §30 item 1's fifteenth, `TOPIC_SUBLEVEL`). Topic
// ids imported from `./ids` (aliased to their shorter local names above) —
// declared centrally rather than locally, unlike `jack.ts`'s own act1_*
// precedent: `tests/world-game.test.ts`'s directory-scan check requires it
// for any `act2_*` id used under this directory (see `./ids.ts`'s own
// comment on the two event ids just above for the same rule).
// ---------------------------------------------------------------------------

/** This wave's own ruling 1 fallback — see this file's header. */
const cutoffIfHeardFamily: Effect = { if: { when: { met: JACK }, then: [{ grantClue: ACT2_CLUE_DAD_CUTOFF }] } };

const topics: TopicDef[] = [
  // D5 task H (§19.2-§19.4) — inserted above D4 task E's own three (D5
  // prose doc §39.1: "gains four topics inserted above D4's three; none
  // deleted" — the fourth addition, §19.1's push, is an `EventDef`, not a
  // topic: `act3/events.ts`'s `ACT3_DAD_PUSH_S5_EVENT`). All three are
  // reachable only while Dad is addressable at all — which, per D2 §4.4's
  // own design (`following` is his only pinned position, set by the rig's
  // PUT-IN/TAKE), means the rig is carried into whatever room the player is
  // asking from — so no extra "rig carried" `when` is authored here beyond
  // what ASK/TELL's own scope resolution already requires.
  {
    id: TOPIC_ROUNDS,
    words: ['rounds', 'custodian', 'the man', 'where is he', 'time'],
    response: [
      { when: { npcAt: [ACT2_CUSTODIAN, ACT3_S6_MAINTENANCE_BAY] }, text: '"He\'s in the room with the chairs. Has been eleven minutes."\n\nNo drama in it at all — the voice he would use about a kettle.\n\n"I can\'t see him, kiddo, I can hear him, and a man doing a job makes a noise\nwith a shape to it. He has done that room twice tonight and both times it took\nhim about the same, and both times he went the same way after."' },
      { when: { npcAt: [ACT2_CUSTODIAN, ACT3_S6_ARCHIVE_HUB] }, text: '"Next room along. The one with the machine in it."\n\n"How do I know which? Because a door on a closer makes one noise and a door on\na latch makes another, and I have had a very quiet week."' },
      { when: { npcAt: [ACT2_CUSTODIAN, ACT3_S5_REACTOR_INTERFACE] }, text: '"He\'s up a floor. The room with the wall of dials — the one where the note\ncomes up through your boots."\n\n"He is not in a hurry. He has not been in a hurry once, and I have been\nlistening to him for hours."' },
      { when: { npcAt: [ACT2_CUSTODIAN, ACT3_PIPE_CHASE] }, text: '"He\'s in the pipe. On the ladder, I\'d say, because there is a thing a boot does\non a rung that it does on nothing else."\n\n"Don\'t go up. That\'s not advice, kiddo, that\'s arithmetic — he is between you\nand the top and he is going the same way you want to go."' },
      { text: '"Nothing. And I mean nothing — no door, no boot, no tin being set down on\nanything."\n\n"Which is either very good, or he has finished for the night, and I have not\nworked out how to tell those apart from in here."' },
    ],
  },
  {
    id: TOPIC_HOW_DO_YOU_KNOW,
    words: ['listening', 'hearing', 'how do you know'],
    response:
      '"Because there is nothing else to do." He is not complaining; he is explaining\na method. "You put a man in a building with no eyes and he will have the\nplumbing off by heart inside a day."\n\n"Every room down here has a noise. Every door has a different noise. A pump\nstarting is not a pump stopping. And a man walking on tile is not a man walking\non a grating, and I am not going to pretend that is clever, because it is\nnine-tenths of an engineer\'s job and always was."',
  },
  {
    id: TOPIC_CHAIRS,
    words: ['chairs', 'the room'],
    when: { flag: ACT3_REACHED_S6 },
    response:
      'You describe it to him. The rows, the hooks, the paper on the headrests, the\nstraps and the sheepskin on them.\n\nHe does not answer for long enough that you check the battery.\n\n"Right," he says.\n\nThen: "No. Say the bit about the sheepskin again."\n\nYou say it again.\n\n"Somebody sat down and thought about that," says Dad, and does not say anything\nelse for a while, and when he comes back he asks about the drain instead.',
  },
  // D4 task E (§14) — inserted above the shipped fifteen (§21.1: "none
  // deleted"). Location-agnostic (canon 53); no repeat/"block" rule — the
  // doc writes one response each.
  {
    id: TOPIC_SEAL,
    words: ['seal', 'plug', 'hole'],
    when: { flag: ACT3_SAW_SEAL },
    response:
      '"Cut? From the works side?"\n\nThe speed goes out of him for a moment and comes back not quite the same\nspeed.\n\n"Well. Somebody wanted a way out that was not a door. Which happens on a job —\nyou seal a bore and then you find you have sealed a great deal of hire plant on the wrong side of it, and a contractor with a\ndeadline will go through a yard of concrete rather than write that letter."\n\n"That is the answer I would give a reporter and it is probably the true one.\nI will tell you the other thing and then I will stop, because after that I\nwould be making it up. The reason you seal a thing instead of filling it is\nthat sealing is cheaper and filling is permanent, and every man in that room\nknew the difference and voted for the cheap one."\n\nA pause about the length of a breath taken in before a name.\n\n"Take a lamp, kiddo."',
  },
  {
    id: TOPIC_RAILS,
    words: ['rails', 'track'],
    when: { flag: ACT3_WALKED_TUNNEL },
    response:
      '"Rails! Of course rails." He is delighted and does not notice being delighted.\n"Narrow gauge, battery loco, a man walking beside it at four miles an hour\nbecause you are not going to let a thing like that get away from you\nunderground."\n\n"You cannot put a hundred thousand yards of spoil on a county road, kiddo. The\ncounty road was my road. I had to drive on it."',
  },
  {
    id: TOPIC_INTERLOCK,
    words: ['interlock', 'bypass', 'shield door'],
    when: { flag: ACT3_BYPASS_SEEN },
    response:
      '"An interlock is the part of a machine that has read the accident report."\n\n"They fit them after somebody has already been hurt somewhere else. And then\na fellow who is behind on his shift puts a key in it and turns it, and the\nwhole of that history leaves the building for the afternoon, and he means to\nturn it back."\n\nA short sound that is not quite a laugh.\n\n"I sat on a committee about that once. Different plant. Same key."',
  },
  {
    id: TOPIC_SELF,
    words: ['self', 'who are you', 'who am i', 'name', 'yourself', 'you', 'identity'],
    response:
      '"Your father," he says, the way you would answer which way is up.\n\nThen, because you have not said anything: "You want the rest of it? County\ncommissioner, then the Senate, then eleven years of being right at people who\nhad stopped asking. Now I\'m a stick in a drawer. Shorter commute."\n\nA pause. "And if you\'re asking me which of you this is — no. I can\'t tell from\nin here and I\'ve decided not to mind. You\'ve got the stick. Nobody has the\nstick who isn\'t mine."',
  },
  {
    id: TOPIC_JULES,
    words: ['jules', 'brother', 'son', 'one', 'number one'],
    when: { not: { flag: ACT2_DAD_BLOCK_JULES } },
    response:
      '"Number one." Warmth arrives in the voice so fast it is almost rude. "Steady\nas a post and twice as easy to talk to. He\'ll tell you a thing is fine when\nit isn\'t, not to spare you — to spare himself the conversation about it."\n\n"He does that room at the plant now. Facilities. He rang me about a pump and I\ngave him forty minutes on the politics of the pump, which he did not want, and\nhe let me, which is the whole of him in one go."\n\n"You want to hear about when he was small? He had this way of standing at the\n[…]"\n\nThe speaker gives you a second of a sound like a hand run across a page, and\nthen quiet.\n\n"— anyway," he says, from a little further along than where he stopped. "He\nwas a serious child. What else."',
    effects: [{ set: [ACT2_DAD_BLOCK_JULES, true] }],
  },
  {
    id: TOPIC_JULES,
    words: ['jules', 'brother', 'son', 'one', 'number one'],
    response:
      '"Number one," he says again, and everything he says about him is in the\npresent tense, and he says a good deal.\n\nNothing you have brought into this room is going to change that, and you have\nhad the chance to try twice now, and have not.',
  },
  {
    id: TOPIC_FACILITY,
    // "sublevel"/"six"/"s6" deliberately NOT here — `topic_sublevel` (§30
    // item 1) owns those words exclusively.
    words: ['facility', 'plant', 'tunnel', 'adit', 'siting', 'construction', 'built'],
    response:
      '"Thirty. That was the year the money moved." He is enjoying himself\nimmediately. "Nobody in that county wanted a hole in the ground and everybody\nin that county wanted the payroll, so it got called four things in eighteen\nmonths and the one that stuck was the one that didn\'t mean anything."\n\n"I sat on the siting. Not the vote — the *siting*. You want to know how you\nput a plant on a piece of ground like that? You don\'t drive equipment across\ngrazing land for two years, you drive it *under* it, and you cut a service\nadit from the works out to a hardstand where the county road can reach it. A\nmile and a bit of it. Rails in the floor."\n\n"They were supposed to demolish it after. Nobody demolishes a mile of concrete\nthey have already paid for, kiddo. You seal it. There\'ll be a hatch on it out\nin the country somewhere and a line of posts over the top, because that is how\nyou find a thing you have buried — you mark it so you don\'t dig it up by\naccident."',
    effects: [{ set: [ACT2_DAD_TOLD_TUNNEL, true] }, { set: [ACT2_KNOWS_TUNNEL_MOUTH, true] }, { grantClue: ACT2_CLUE_SERVICE_TUNNEL }],
  },
  {
    id: TOPIC_HEARING,
    words: ['hearing', 'transcript', 'subcommittee', 'senate', 'water table', 'testimony'],
    response:
      'The speed goes out of the voice. Not all of it.\n\n"There was a hearing. Siting subcommittee, and I was on it, and I said a thing\nabout the water table that made a man in the third row put his pen down."\n\n"I read the transcript that night. I read it again in the morning because I\nwanted to send it to somebody, and the paragraph I was proud of was still\nthere and it did not say what I said. Same length. Same words either side of\nit. Mine, in my voice, and I would never have said it."\n\n"I raised it. Twice. Clerical, they said, and they were sorry, and the version\nthey had was the version they had." A short laugh with nothing in it. "So I\nwent home and I started keeping a copy of everything I was sure about."\n\n"That\'s the answer to the other thing you were going to ask me, by the way.\nWhy there\'s a me on a stick. That\'s why. Nothing grander than that."',
    effects: [{ set: [ACT2_DAD_TOLD_HEARING, true] }],
  },
  {
    id: TOPIC_LUKE,
    words: ['luke', 'senator', 'president', 'two'],
    response:
      '"Junior senator." He says it the way other men say a boy\'s exam results.\n"Thirty-nine he took the seat. *My* seat, which nobody planned and everybody\nenjoyed."\n\n"He\'ll go up. Not fast — he\'s got the vocabulary problem, he says a word and\nthe room stops to look it up and he thinks that\'s the room\'s fault. Give him\nten years and a war he handles well and you\'d be surprised."\n\n"Anyway. Junior senator, and that\'ll do for now."',
    effects: [cutoffIfHeardFamily],
  },
  {
    id: TOPIC_SISSY,
    words: ['sissy', 'sister', 'five', 'application'],
    response:
      '"Put her application in in the spring. Forty. She\'ll not get it, kiddo, and\nI\'m not being unkind — they take nine out of about six thousand and the\nphysical alone would finish most men I\'ve known."\n\n"I\'d not tell her that. I told her mother that and I have been informed I was\nwrong to." A beat. "She\'ll be all right. She\'s the only one of the five of you\nwho has never once needed to be told she was doing well."',
    effects: [cutoffIfHeardFamily],
  },
  {
    id: TOPIC_YEAR,
    words: ['year', 'what year', 'date', 'when', 'spring'],
    response:
      '"Forty-one," he says immediately, with no gap in front of it at all. "Spring.\nThe rains came late and everybody in that county said it was the first time,\nand it was the fourth time."\n\nHe waits. You do not say anything.\n\n"What," he says. "Am I wrong?"',
    effects: [cutoffIfHeardFamily],
  },
  {
    id: TOPIC_ELI,
    words: ['eli', 'three', 'energy'],
    response:
      '"Three." A short, delighted noise. "Sleeps like it\'s an occupation. Eleven\nhours and then apologises for it, which is worse than the eleven hours."\n\n"Give that boy a problem with a shape and he\'ll have it. He used to fold —\npaper, anything, the order of service at his grandmother\'s funeral, and I was\nabout to say something to him about it and his mother put a hand on my arm."\n\n"He\'ll answer you. He\'s slow and he answers. Don\'t ring him."',
  },
  {
    id: TOPIC_JACK,
    words: ['jack', 'four', 'driver'],
    when: { not: { flag: ACT2_DAD_BLOCK_JACK } },
    response:
      '"Four." The voice does something it has not done yet, which is take its time.\n\n"Four is the one who stayed. Everybody in that family has a thing they can do\nthat nobody else can do and Four\'s is that he\'ll still be standing there in\nthe morning, and there\'s no ribbon for it, so nobody ever gave him one."\n\n"I meant to. I had a conversation planned. I had the whole of it worked out on\na drive back from Pierre and I remember thinking, that\'ll do, I\'ll say that at\nThanksgiving, and then at Thanksgiving I got onto the […]"\n\nThe page-across-a-page sound again, shorter this time.\n\n"— so that\'s Four," he says, cheerfully, from somewhere past it. "Next."',
    effects: [{ set: [ACT2_DAD_BLOCK_JACK, true] }],
  },
  {
    id: TOPIC_JACK,
    words: ['jack', 'four', 'driver'],
    response:
      '"Four," he says. "The one who stayed."\n\nHe goes on about him for a while and he is warm about him the whole time and\nhe never once says the thing he was going to say at Thanksgiving.',
  },
  {
    id: TOPIC_POKER,
    words: ['poker', 'cards', 'table', 'game', 'bluff', 'tell'],
    response:
      '"Now you\'re talking."\n\n"Here\'s the whole of it, and then I\'ll not lecture. Nobody at a table that\nsize is playing cards. They\'re playing the four other people, and every one of\nthem has one thing they do when they\'ve got it and a different thing they do\nwhen they want you to think they\'ve got it, and they have never once been told\nabout either."\n\n"You\'ll want to sit and lose a bit first. That\'s not defeatism, kiddo, that\'s\ntuition, and it\'s the cheapest you\'ll ever get."\n\n"Plug me in somewhere I can hear it and I\'ll do the rest."',
  },
  {
    id: TOPIC_COPY,
    words: ['copy', 'really you', 'really him', 'are you him', 'is this you'],
    response:
      '"Ah," he says, pleased. "Yes. Go on then. Am I him."\n\n"I\'ve had this argument with better men than you and I\'ll tell you where it\ngets you. I remember the drive back from Pierre. I remember the exact place on\nthe road. If I\'m not him, then whoever *is* him doesn\'t have that any more,\nand I\'d like it on the record that I\'m taking care of it."\n\nSomething in the machine steps up a note and settles again.\n\n"It bothered me for about a week. I\'d not have said that out loud when I had a\nmouth."',
  },
  {
    id: TOPIC_LABEL,
    words: ['label', 'tape', 'do not format', 'volume label'],
    response:
      '"That\'s my writing. That\'s a fibre-tip on a strip of masking tape and it took\nme about four seconds and I stand by every one of them."\n\n"DO NOT FORMAT is not for you. That\'s for a man at a desk in twenty years\'\ntime who has found a drawer of old sticks and is about to be efficient."\n\nA pause. "It\'s worked so far."',
  },
  {
    id: TOPIC_TERMINAL,
    words: ['terminal', 'machine', 'computer', 'disc', 'disk'],
    response:
      '"I know what I\'m in. I can hear the disc. That\'s a full-height mechanism, that\nis, and there\'s no network on it or I\'d not have started."\n\n"They had these in the hearings building. Every committee room, one in the\ncorner on a stand, and they were old *then* and nobody replaced them and I\nnever once asked why, because you don\'t, do you. You walk past the same thing\nfor eleven years and it\'s furniture."\n\nHe lets that sit for about a second longer than the joke needs.\n\n"Anyway. It\'s a good machine. It\'s not going anywhere and neither am I."',
  },
  {
    id: TOPIC_HEADACHES,
    words: ['headaches', 'headache', 'migraine', 'migraines'],
    response:
      '"Headaches." He is brisk about it. "Your grandmother had them and your uncle\nhad them and one of you has them and I\'ll not say which because he\'d not thank\nme."\n\n"Doctor gave him something and it works and he still gets the day after,\nwhere he can\'t find a word he\'s known his whole life." A beat. "There\'s\nnothing in that. Everybody\'s got a day like that."',
  },
  {
    id: TOPIC_SUBLEVEL,
    words: ['sublevel', 'sublevel 6', 'six', 's6'],
    response:
      '"Sublevel six," he says, trying it. "No. There\'s five. There\'s five because\nfive is what the rock would give them and I sat through the argument about it\ntwice."\n\nA short pause, and the fan.\n\n"Mind you, I\'d not have been told, would I. I was the water and the money. If\nsomebody put a sixth in after they\'d got the licence, the first I\'d have heard\nof it is a man reading it to me off a stick."\n\n"Where\'d you get the number?"',
  },
];

// ---------------------------------------------------------------------------
// §7.4 — unknownTopic.
// ---------------------------------------------------------------------------

const unknownTopic: string[] = [
  '"Haven\'t got it. I\'d make you something up if I thought you\'d enjoy it."',
  'He starts on it, and it turns out to be about a road, and the road turns out\nto be a road he liked.',
  '"Ask me in a way that\'s got a date in it. I\'m better with dates."',
];

// ---------------------------------------------------------------------------
// §7.1–7.3 — shows.
// ---------------------------------------------------------------------------

const showNotebookText =
  '"I can\'t see it, kiddo."\n\nYou read him a page of it instead. You get about six lines in before he\ninterrupts.\n\n"That\'s his hand. You\'re reading it wrong — the little hooks aren\'t letters,\nthey\'re plant. That\'ll be a valve number and that\'ll be a shift and that\none\'s not a word at all, it\'s a run of pipe."\n\nHe takes you through the rest of the page at a speed you cannot write down,\nand then through the next one, and the shorthand stops being a wall and starts\nbeing a man\'s handwriting about his work.\n\nThen he stops.\n\n"Read me the last one again," he says. "The one you did in that voice."\n\nYou read it again.\n\n"No," he says. "He wouldn\'t have written that. He\'d have gone and looked."\n\nAnd then, before you have decided how to put the next part: "Don\'t. Whatever\nthat is you\'re about to say to me — I\'d rather have it wrong. Ask me something\nelse."';

const showUsbOrLabelText = '"Yes," he says. "That\'s me. Handsome."';

const showPolaroidText =
  '"I\'d love to." He is not being difficult about it. "There\'s no eye on this\nthing. Tell me what\'s in it."\n\nYou describe it. He listens to the whole of it without interrupting once,\nwhich he has not managed at any other point tonight.\n\n"Right," he says, when you have finished. "That\'s not much, is it. That\'s what\nyou\'ve got."';

const showResponses: ShowResponseDef[] = [
  // §7.1's own gate: the audit (task B's censor) also decodes the shorthand
  // (`ACT2_SHORTHAND_DECODED`) — showing the notebook to Dad after that has
  // already happened still runs this exact scene (he decodes it himself
  // regardless), but only sets the flag if it isn't already set.
  { objects: [ACT2_NOTEBOOK], response: showNotebookText, effects: [{ if: { when: { not: { flag: ACT2_SHORTHAND_DECODED } }, then: [{ set: [ACT2_SHORTHAND_DECODED, true] }] } }] },
  { objects: [ACT2_USB], response: showUsbOrLabelText },
  { objects: [INTACT_POLAROIDS, ACT2_CACHE_POLAROID], response: showPolaroidText },
];

// ---------------------------------------------------------------------------
// §7.5–7.6 — handlers.
// ---------------------------------------------------------------------------

const attackDadText = 'There is a stick, and a machine, and a man in the room, and only one of those\nthree is going to be embarrassed about this in the morning.';
/** Also `act1/objects/terminal.ts`'s own `BREAK` amendment while Dad is docked — same text, shared, not duplicated (§7.5 pairs the two commands under one block). */
export const ACT2_DAD_ATTACK_TEXT = attackDadText;

const touchDadText = 'Your hand ends up flat on the top of the case, which is warm, and going very\nslightly.\n\n"That the fan?" he says. "That\'ll be the fan."';

// ---------------------------------------------------------------------------
// The NPC.
// ---------------------------------------------------------------------------

export const dad: NpcDefSlice = {
  schedule: [
    { when: { all: [{ objectAt: [ACT2_USB, { in: TERMINAL }] }, { objectState: [TERMINAL, 'on', true] }] }, room: YOUR_ROOM },
    // The corridor's dead terminal — never boots (plan §2 D2's own schedule
    // table, transcribed as a comment there too). Declared explicitly
    // (rather than falling through to the unconditional `'offstage'` rule
    // below) so a reader can see the dead-terminal case was considered, not
    // missed.
    { when: { objectAt: [ACT2_USB, { in: ACT2_WD_TERMINAL }] }, room: 'offstage' },
    { room: 'offstage' },
  ],
  nouns: ['dad', 'father', 'old man', 'voice', 'speaker'],
  adjectives: ['old'],
  name: 'Dad',
  pronoun: 'he',
  greeting,
  topics,
  unknownTopic,
  showResponses,
  handlers: [
    { verbs: [V_ATTACK], effects: [{ say: attackDadText }] },
    { verbs: [V_HUG, V_KISS, TOUCH], effects: [{ say: touchDadText }] },
  ],
};

// ---------------------------------------------------------------------------
// `act2_dad_boot` — the boot script (plan §2 D2; §5.1/§5.2/§5's own
// ruling 3). First run: eight beats + the three effects. A later re-dock
// (chain + USB back in the terminal, e.g. after `TAKE USB` while booted, or
// after the rig) renders only the standing greeting — `NpcDefSlice.
// greeting` itself, via the same render path `respondToGreeting`
// (`engine/npc.ts`) uses (`npc.act2_dad.greeting`), so the two routes share
// one rotation counter and rule 2/rule 3 selection behaves identically
// whichever one a given re-dock happens to hit first. `markMet` itself is
// NOT replicated here (a private `npc.ts` helper, not exported) — by the
// time a second boot is possible, Dad has necessarily already been
// addressed at least once (the first boot's own beats are followed by
// actual play), so `met` is already true in every real playthrough; see
// this file's header for the one theoretical edge this leaves unswept.
// ---------------------------------------------------------------------------

export const act2DadBoot: ScriptFn = (world, state) => {
  const alreadyBooted = flag(world, state, ACT2_DAD_BOOTED) === true;

  if (!alreadyBooted) {
    const beatEvents: GameEvent[] = BOOT_BEATS.map((text) => ({ type: 'line', kind: 'beat', text }));
    const effects: Effect[] = [{ set: [ACT2_DAD_BOOTED, true] }, { set: [ACT2_DAD_GREETED_ONCE, true] }, { grantClue: ACT2_CLUE_DAD_BOOTS }];
    const applied = apply(world, state, effects, { path: 'script.act2_dad_boot' });
    return { state: applied.state, events: [...beatEvents, ...applied.events] };
  }

  const rendered = render(world, state, `npc.${ACT2_DAD}.greeting`, dad.greeting ?? [], {});
  return { state: rendered.state, events: [{ type: 'line', kind: 'prose', text: rendered.text }] };
};

// ---------------------------------------------------------------------------
// P12 — Booting Dad. `solvedWhen` is simply "he's booted"; three named
// routes converge on the same single mechanical path (find the parts,
// combine them, dock the chain) described from three angles (story-
// architecture doc's own legend: K analytical, P/E direct) — see this
// task's report.
// ---------------------------------------------------------------------------

/**
 * P12's anchor. No `answerWhen` (and so no `answer`, a content gap for a
 * later wave to fill) — `validate.ts`'s `question-answerable-without-recap`
 * is a hard error for `answerWhen` with no `answer` string, and no answer
 * recap is authored anywhere in the D2 prose doc for this question. Same
 * shape as `ACT2_Q_HOW_WAS_IT_HERE`'s own precedent (`act2/knowledge.ts`:
 * "No answerWhen in this build — Stage E answers it").
 */
export const ACT2_Q_BOOT_USB_DEF: { text: string; openWhen?: Cond } = {
  text: 'A stick with a dead man on it, and one machine in the county old enough to trust it. How does it go in?',
  openWhen: { has: ACT2_USB },
};

export const ACT2_P12_BOOT_DAD_PUZZLE: PuzzleDef = {
  id: ACT2_P12_BOOT_DAD,
  name: 'Booting Dad',
  question: ACT2_Q_BOOT_USB,
  solvedWhen: { flag: ACT2_DAD_BOOTED },
  solutions: [
    { id: 'drawer', class: 'analytical', note: "Search the general store's junk drawer by day, take the three obsolete parts, and COMBINE/ASSEMBLE them into an adapter chain." },
    { id: 'dock', class: 'direct', note: 'Plug the chain into the terminal and PUT USB IN TERMINAL — the boot follows.' },
    { id: 'shop_hours', class: 'direct', note: 'Return to the general store during morning or afternoon, once Act II has begun, to find it open and unattended.', route: { any: [{ clockPhase: 'morning' }, { clockPhase: 'afternoon' }] } },
  ],
  hints: [
    'The stick is the wrong shape for the only machine old enough to trust it. Somewhere in this county there is a drawer with the in-between in it.',
    "The general store is shut in the small hours, but it keeps different hours than the rest of this town. Come back when the sun's up.",
    "Under the counter, on the customer side: a junk drawer, and three obsolete parts in the back of it that were made to join a thing to a thing.",
    'COMBINE PARTS (or ASSEMBLE PARTS) makes the chain. PUT USB IN TERMINAL with the chain in your coat.',
  ],
};

// ---------------------------------------------------------------------------
// Flags and clues — merged into `ACT2_SLICE` by `act2/index.ts`.
// ---------------------------------------------------------------------------

export const ACT2_D2A_FLAGS = {
  [ACT2_DAD_BOOTED]: { default: false, doc: "set by act2_dad_boot's first run — Jack topic_dad v2; the rig's reveal event; P12's solvedWhen" },
  [ACT2_DAD_GREETED_ONCE]: { default: false, doc: 'set by the first boot (script effect) — greeting rule 1 (unreachable in play)' },
  [ACT2_DAD_SAID_MANNERISM]: { default: false, doc: 'set by ACT2_DAD_MANNERISM_EVENT (once, on { met: ACT2_DAD }) — greeting rule 2' },
  [ACT2_DAD_TOLD_HEARING]: { default: false, doc: 'set by topic_hearing — read by the hearing reel COMPARE handler (task B)' },
  [ACT2_DAD_TOLD_TUNNEL]: { default: false, doc: 'set by topic_facility — read by the P16b hint ladder (D3)' },
  [ACT2_KNOWS_TUNNEL_MOUTH]: { default: false, doc: "set by topic_facility, or the construction reel's map page (task B) — Town Edge's country exit (D4)" },
  [ACT2_DAD_BLOCK_JULES]: { default: false, doc: 'set by topic_jules rule 1, once — gates rule 2 thereafter' },
  [ACT2_DAD_BLOCK_JACK]: { default: false, doc: 'set by topic_jack rule 1, once — gates rule 2 thereafter' },
} satisfies Record<string, { default: false; doc: string }>;

export const ACT2_D2A_CLUES = {
  [ACT2_CLUE_DAD_BOOTS]: { title: "Dad, on a stick", detail: 'The USB in your coat is a person: a copy of your father, kept on the one machine in the county old enough to speak his shape — a full-height terminal with no network on it at all.' },
  [ACT2_CLUE_DAD_CUTOFF]: { title: 'Dad stopped in 2041', detail: "He is certain, fast, and wrong about anything after a particular year — a senator who is the President, a sister on an application she has already gotten. He does not know the difference." },
  [ACT2_CLUE_SERVICE_TUNNEL]: { title: 'The service adit', detail: "The plant was built by driving equipment under the grazing land rather than across it, through a service adit from the works out to a hardstand the county road could reach — supposed to be sealed after, and marked, not demolished." },
} satisfies Record<string, { title: string; detail: string }>;

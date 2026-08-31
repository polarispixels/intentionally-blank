// Act IV, Stage E1, task M — Luke, the escort, R16, and the boundary
// (`docs/superpowers/specs/2026-09-18-stage-e1-prose.md` §11, §12, §20-§23,
// §29, §33, §37, §38). Prose transcribed exactly (hard rule 5).
//
// SCHEDULE — the Staging Area from `act4_visit_day` until `act4_luke_gone`,
// `'offstage'` otherwise (this task's own instruction; the `act2/nolan.ts`
// schedule idiom). `ACT4_STAGING_AREA` is task L's room id, imported here —
// mid-flight while that task lands, per this task's own instruction.
//
// REGISTER 119 — his `name: 'Luke'` and the `nouns` below are the one
// exemption 118/119 leave open (the parser's own bookkeeping, never prose);
// no narrator line, topic or `unknownTopic` ever prints the name. Nouns:
// `luke`, `president`, `man`, `visitor` — **not** `brother` (Jack's own
// shipped noun) and **not** `him`/`he` (the parser's own pronoun machinery).
//
// CANON 104 — nobody living speaks below Sublevel 5. Every quoted line Luke
// has is above ground, in §11/§12/§23's lobby paragraph (itself above the
// lift). §20-§22's own scripted text carries no dialogue at all past the
// lift leaves closing; see this file's own `ACT4_LUKE_AT_ROOT_TEXT` and the
// escort's own `act4LukeDescends`.
//
// THE ESCORT (§20) — fired from §11.6 rule 1's own follow-up: a second
// `ASK LUKE ABOUT DOOR` (once `act4_luke_will_escort` is set) or
// `LUKE, FOLLOW ME`. `advanceClock: 20`, `moveNpc`, `setFollowing` (so
// leading him anywhere afterward — including down through the Cooling
// Plant's hatch to Sublevel 6, this game's only OTHER route there — brings
// him along), then `goto` S5. The third trigger the section names —
// "leaving the room with `act4_luke_will_escort`" — is CLOSED, Stage F1:
// `ACT4_EV_LUKE_ESCORT_LEAVES_EVENT`, below (an ambient `EventDef`, not a
// room-level hook — see that event's own doc comment for why, and for the
// one known limitation it leaves flagged rather than hidden).
//
// R16 (§22/§23) — wired two ways, both idempotent on `act4_luke_at_root`:
// the room's own `onEnter` (`act3/s6ArchiveHub.ts`, this task's own
// amendment — "entering the Hub with him following") and the root door's
// own handler (`act3/objects/s6ArchiveHub.ts` — "USE READER"). Either one
// fires the combined §22-then-§23 text exactly once and sends Luke offstage
// for good.
//
// E1 addendum §1/§2 (`docs/superpowers/specs/2026-09-18-stage-e1-addendum.md`,
// integration builder) — `topic_jack`'s and `topic_jules`'s `response`
// fields become `ProseRule[]` of one unconditional rule each, `text` a
// `string[]` with `firstOnce: true` (the same mechanism `unknownTopic`
// above already uses): index 0 is the shipped block, then the rest rotate.
// No new flag anywhere — the rotation itself is the "the first time, and
// then after" shape (addendum §0). Status line ruling q2: §1.1 (the answer)
// ships WITHOUT its drafted final sentence — ends on "He would not have put
// that in a letter."

import type { Effect } from '../../../engine/effects';
import { apply } from '../../../engine/effects';
import type { EventDef, NpcDefSlice, ScriptFn, ShowResponseDef, TopicDef } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { T } from '../../../engine/ids';
import { ACT2_NOTEBOOK, ACT2_RETURNED_LETTER } from '../act2/ids';
import { FEDORA, INTACT_POLAROIDS, V_ATTACK, V_FOLLOW, V_HUG, V_KISS } from '../act1/ids';
import { ACT3_CLUE_S6_DOOR_REFUSES, ACT3_S5_REACTOR_INTERFACE, ACT3_S6_ARCHIVE_HUB } from '../act3/ids';
import {
  ACT4_LUKE,
  ACT4_LUKE_AT_ROOT,
  ACT4_LUKE_DESCENDS_SCRIPT,
  ACT4_LUKE_GONE,
  ACT4_LUKE_GONE_MARKER,
  ACT4_LUKE_WILL_ESCORT,
  ACT4_VISIT_DAY,
  EVENT_ACT4_EV_LUKE_ESCORT_LEAVES,
} from './ids';
import { ACT4_CLUE_LUKES_REASON, ACT4_CLUE_LUKES_WORD, ACT4_CLUE_NOT_THE_USER, ACT4_CLUE_TWO_THING_DOOR } from './ids';
import { ACT4_Q_WHO_OUTRANKS_IT } from './ids';
// `ACT4_STAGING_AREA` — task L's room id. Imported here for Luke's own
// schedule; a transient "not declared" error naming it belongs to task L,
// not this one (this task's own instruction).
import { ACT4_STAGING_AREA } from './ids';

// ---------------------------------------------------------------------------
// §11.0a — description.
// ---------------------------------------------------------------------------

const description =
  'Wide face, heavy jaw, grey coming in at one temple, and about twenty years of photographs between you and any of it.\n\nGrey suit, no tie, one button of the collar open, and the coat over the back of the chair rather than on him, because he has been in this room a while and expects to be a while longer.\n\nHe sits square to the table with a cup in front of him he has not drunk out of and both hands where they can be seen, which is habit rather than courtesy.';

// ---------------------------------------------------------------------------
// §11.0b — greeting, two rules.
// ---------------------------------------------------------------------------

const greeting: ProseRule[] = [
  {
    when: { not: { met: ACT4_LUKE } },
    text: 'He is on his feet before you are through the door, which is either manners or twenty years of being got at, and he puts his hand out.\n\n"You\'ll be the one who folds paper," he says.',
  },
  {
    text: 'He is where he was, coat still over the chair, cup still not drunk out of, and he stops what he is doing entirely, which nobody else in this county does.',
  },
];

// ---------------------------------------------------------------------------
// §11.0c — unknownTopic, three, in rotation. `firstOnce` (register: attempt
// 4 does not repeat the long first line — it wraps into the two-element
// rotation instead, `prose.ts`'s own documented `firstOnce` mechanics).
// ---------------------------------------------------------------------------

const unknownTopicRotation: string[] = [
  '"I don\'t know." He says it flatly and without decorating it, which is apparently what a man can do in a room with no press in it.',
  'He answers a question standing next to the one you asked. It is a good answer and it is not to your question, and he knows both of those things.',
  '"That is outside my competence." Then, because that was not quite honest: "Outside my knowledge. Competence would be a claim."',
];

// `firstOnce` only exists on `ProseRule.text` — a bare `string[]` (unwrapped)
// always rotates by plain modulo (`prose.ts`'s `select()`), which would let
// attempt 4 repeat attempt 1's long first line. One unconditional rule
// carries the array instead, exactly as `act2/nolan.ts`'s own
// `nolanBayWakeRotation` wires the same mechanism.
const unknownTopic: ProseRule[] = [{ text: unknownTopicRotation, firstOnce: true }];

// ---------------------------------------------------------------------------
// §11.1 — topic_letters — R15.
// ---------------------------------------------------------------------------

const TOPIC_LETTERS = T('act4_luke_topic_letters');

const topicLetters: TopicDef = {
  id: TOPIC_LETTERS,
  words: ['letters', "jack's letters", 'writing', 'post'],
  response:
    '"I kept them." He does not touch the folder. "I have kept everything my family has sent me for twenty years. You start because you are sentimental and you go on because somebody in an office tells you that you have to."\n\n"I answered every one. Inside the week, in my own hand, because he would have known." A pause he does not fill. "And I could not tell you tonight what I said back to him. Not one line of it."\n\nHe puts one finger on the folder and does not open it.\n\n"He is the only one of us who was ever any good at complaining. There is not a complaint in there, and I have not had anybody to say that to who would not have written it down."',
};

// ---------------------------------------------------------------------------
// §11.2 — topic_noumena — sets `act4_luke_said_word` (E2's own read;
// nothing in this wave reads it back), grants `act4_clue_lukes_word`.
// ---------------------------------------------------------------------------

const TOPIC_NOUMENA = T('act4_luke_topic_noumena');

const topicNoumena: TopicDef = {
  id: TOPIC_NOUMENA,
  words: ['noumena', 'the word', 'words', 'the letter'],
  response:
    '"My father used to say it back to me with the vowels in the wrong places." He says this without any particular fondness and without any particular anything else. "Four of them at that table and not one ever asked me what it meant. They waited for Sunday, to see whether I would do it again."\n\n"The thing as it is." He stops there, which is where he has always stopped. "Ask Eli. Eli will give you forty minutes and a diagram."\n\nThen he looks at you a second longer than the question needed.\n\n"You spelled it right," he says.',
  effects: [{ grantClue: ACT4_CLUE_LUKES_WORD }],
};

// ---------------------------------------------------------------------------
// §11.3 — topic_jack.
// ---------------------------------------------------------------------------

const TOPIC_JACK = T('act4_luke_topic_jack');

const topicJackText =
  '"Jack." Something happens to his face that is not a smile and is next door to one. "The only one of us who stayed where he was put, and the only one of us anybody here would recognise, and he has never once been in a photograph with me."\n\n"He fixes things. He has been fixing things since he was eleven. He did my first car twice and charged me for the second one, and he was right to."\n\nThe finger goes back on the folder.\n\n"Is he well?"';

// Addendum §1 — answering "Is he well?" (`TELL LUKE ABOUT JACK`, ASK routed
// the same, E1 §37.3). Status line ruling q2: §1.1 ships WITHOUT its final
// sentence — ends on "He would not have put that in a letter." `firstOnce`
// (the same `unknownTopic` idiom above): the shipped block plays once, then
// the answer and its short form rotate.
const topicJackAnswerText =
  'You tell him about the stool at the end of Pearl\'s counter at six in the morning, and the mug turned round and round and never picked up, and three days unshaved with no decision made about it.\n\nYou do not tell him the rest of it. He does not ask you for the rest of it.\n\n"No," he says — answering himself, not doubting you.\n\nHe looks at the folder without putting a finger on it this time.\n\n"He would not have put that in a letter."';

const topicJackShortText = '"You have told me," he says. "I am not going to make you tell me twice."';

const topicJack: TopicDef = {
  id: TOPIC_JACK,
  words: ['jack', 'his brother', 'family'],
  response: [{ text: [topicJackText, topicJackAnswerText, topicJackShortText], firstOnce: true }] satisfies ProseRule[],
};

// ---------------------------------------------------------------------------
// §11.4 — topic_jules — grants `act4_clue_lukes_reason` (canon 110).
// ---------------------------------------------------------------------------

const TOPIC_JULES = T('act4_luke_topic_jules');

const topicJulesText =
  '"I don\'t know that name." He says it without hedging, which is the thing about him: he will tell you he does not know something and not put anything on the front of it.\n\nThen, because you have not moved:\n\n"There is a lacuna where you are pointing and I am not going to pretend there is not. I have been at it since a folded piece of paper was put in front of me this morning, and I have a very good memory."\n\nHe turns the cup a quarter turn.\n\n"If you are asking about the numbers: there is no I and there was never an I. Our father was I. He paid for them, he sat in the chair first, and he put himself at the head of the row because he was the head of the row." A short breath through the nose that is nearly amusement. "Eli tells it differently. Eli is wrong, and will be wrong about it at my funeral."';

// Addendum §2 — `TELL LUKE ABOUT JULES`, after §11.4. No gate, no flag: the
// rotation itself is "after §11.4" (this file's own `firstOnce` idiom,
// above).
const topicJulesAfterText =
  '"I have been going back over a table with four children at it since you put that name in front of me," he says. "I can put every one of them in their chair. I can tell you what my father was drinking."\n\nHe turns the cup a quarter turn and puts it back exactly where it was.\n\n"There is nothing else in it. Looking is most of what I am for, and there is nothing else in it."\n\nThen, without any apology on the front of it: "Ask me tomorrow. I will have the same nothing, and I will have checked it."';

const topicJules: TopicDef = {
  id: TOPIC_JULES,
  words: ['jules', 'the missing one', 'i', 'the tattoos'],
  response: [{ text: [topicJulesText, topicJulesAfterText], firstOnce: true }] satisfies ProseRule[],
  effects: [{ grantClue: ACT4_CLUE_LUKES_REASON }],
};

// ---------------------------------------------------------------------------
// §11.5 — topic_facility.
// ---------------------------------------------------------------------------

const TOPIC_FACILITY = T('act4_luke_topic_facility');

const topicFacility: TopicDef = {
  id: TOPIC_FACILITY,
  words: ['plant', 'facility', 'building', 'dad', 'hearings'],
  response:
    '"I know the provenance of this building considerably better than I know the building." He turns the cup back. "Commissioned the year I finished law school, out of a bill my father spent two winters on, and there is a plaque in that lobby with his name on it and a title in front of it that he enjoyed more than he ever admitted."\n\n"I have been in that lobby three times in twenty years. Ribbon, ribbon, and a photograph with a man from the county."\n\nHe goes and finds the end of the sentence, which he has not had to do yet.\n\n"I have never been anywhere else in it, and nobody has ever offered."',
};

// ---------------------------------------------------------------------------
// §11.6 — topic_door / topic_sublevel, two rules. Rule 1, `when: { clue:
// act3_clue_s6_door_refuses }`, sets `act4_luke_will_escort` (the first
// hearing only — a second ask, once the flag holds, is intercepted by the
// escort rule prepended above it, §20's own trigger).
// ---------------------------------------------------------------------------

const TOPIC_DOOR = T('act4_luke_topic_door');

// Exported (with `s6DoorLukeText`, `s6StairText`, `ACT4_LUKE_AT_ROOT_TEXT`
// and the room shell's own `lukeAtS5Text`) so the test suite can grep the
// actual wired strings for canon 104 ("no Luke line below S5") rather than
// re-deriving them.
export const doorEscortText =
  'The one who does the talking says a sentence with the word advance in it and then a sentence with the word protocol in it, and neither is addressed to you.\n\nHe is answered in four words and a look at a watch. The two of them come as far as the lift and no further, because there is only so much of this that a man can be told.\n\nThe leaves come together.\n\nNobody says anything on the way down. He stands the way a man stands in a freight lift, hands at his sides, and on the way past it he reads the legend strip beside the buttons, the way you read anything in a lift.\n\nThere is nothing on it to read.\n\nThe little windows over the door go L, and then a long nothing, and then S5.';

const doorRule1Text =
  'You tell him there is a door in this building that has refused everything you have been able to put in front of it, and that it is five floors under the lobby he has been photographed in three times.\n\nHe listens the whole way through without helping you along, which is what twenty years of it does to a man.\n\nThen the cup goes down and he reaches back for the coat.\n\n"Take me to it," he says, and is on his feet before he has finished saying it, which is the fastest anybody in this county has agreed to anything all week.';

const doorRule2Text =
  '"There is a door." He is not humouring you; he is waiting for the rest of it, and there is not any rest of it yet.\n\n"Bring me a door," he says.';

const topicDoor: TopicDef = {
  id: TOPIC_DOOR,
  words: ['door', 'sublevel', 'sublevel six', 'six', 'archive', 'the archive'],
  response: [
    { when: { flag: ACT4_LUKE_WILL_ESCORT }, text: doorEscortText },
    { when: { clue: ACT3_CLUE_S6_DOOR_REFUSES }, text: doorRule1Text },
    { text: doorRule2Text },
  ] satisfies ProseRule[],
  effects: [
    {
      if: {
        when: { flag: ACT4_LUKE_WILL_ESCORT },
        then: [{ script: { id: ACT4_LUKE_DESCENDS_SCRIPT } }],
        else: [
          {
            if: {
              when: { clue: ACT3_CLUE_S6_DOOR_REFUSES },
              then: [{ set: [ACT4_LUKE_WILL_ESCORT, true] }],
            },
          },
        ],
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// §11.7 — topic_sissy.
// ---------------------------------------------------------------------------

const TOPIC_SISSY = T('act4_luke_topic_sissy');

const topicSissy: TopicDef = {
  id: TOPIC_SISSY,
  words: ['sissy', 'mars', 'the station'],
  response:
    '"Sissy writes to everybody. It is the one thing the distance has not touched." A pause that is not for effect. "She has been filing something for about a year that I get told has been handled. I asked once what it was. It had been handled."\n\n"I have signed for that programme four times and I could not tell you tonight what my sister is looking at."',
};

// ---------------------------------------------------------------------------
// §11.8 — topic_detail.
// ---------------------------------------------------------------------------

const TOPIC_DETAIL = T('act4_luke_topic_detail');

const topicDetail: TopicDef = {
  id: TOPIC_DETAIL,
  words: ['detail', 'security', 'schedule', 'the visit'],
  response:
    '"They are very good," he says, and means it, "and they are not mine."\n\n"There was a stop on my sheet this morning. A counter on a main street, four minutes, a photograph of me holding a cup and saying something about pie." He puts a hand flat on the paper tablecloth. "It came off between the airport and here. Nobody has told me why, and I have stopped asking, because the answer is always that it was for my safety and it is always said kindly."\n\nHe looks at the urn on the card table and then does not look at it again.',
};

// ---------------------------------------------------------------------------
// §12.1-12.4 — the four showResponses.
// ---------------------------------------------------------------------------

const showResponses: ShowResponseDef[] = [
  {
    objects: [ACT2_NOTEBOOK],
    response:
      'He takes it and does what a lawyer does with a document nobody has given him time to read: he opens it at the back first.\n\nHe looks at the inside of the back cover for a while.\n\n"Whose is this?"\n\nYou tell him. He gives it back, and then asks you a question about the paper.',
  },
  {
    objects: [ACT2_RETURNED_LETTER],
    response:
      'He takes it and turns it over and reads the front, and does not put it down.\n\n"That is his hand. That is his stamp, and that is how he does an L."\n\nThen nothing for a while. He is reading the red printing, and specifically the second line of it, which says there is no such addressee.\n\n"It\'s sealed," he says.\n\nHe puts it down on the white paper between you, squared, and does not ask you for it and does not ask you to open it.',
  },
  {
    objects: [INTACT_POLAROIDS],
    response:
      '"That\'s the porch." He holds it at the distance a man his age holds a photograph. "The old place. That is my father\'s chair and my father in it, and I could tell you what the argument was about and I am not going to."\n\nHe gives it back without turning to the other one.',
  },
  {
    // Register: neither D1 §23 (only the player and Dot ever recognise the
    // hat) nor canon 33 (Luke's own tattoo is never shown) is touched here —
    // see this task's report.
    objects: [FEDORA],
    response: '"It\'s a hat," he says, in the voice of a man being shown a hat.',
  },
];

// ---------------------------------------------------------------------------
// §12.5 — handlers. FOLLOW carries two rungs: the escort itself, once
// `act4_luke_will_escort` holds (§20's own "LUKE, FOLLOW ME" trigger), then
// the shipped unconditional refusal.
// ---------------------------------------------------------------------------

const attackText = 'There are two men in this room whose entire working life is arranged around the ten seconds after you finish having that idea.';

const followText = '"I\'m not going anywhere," he says, "which is the first true thing I have said in this building."';

const hugKissText = 'He converts it into a handshake without any suggestion that anything needed converting.';

// ---------------------------------------------------------------------------
// §20 — the escort. Fired from §11.6 rule 1's own follow-up: a second ask
// about the door, or `LUKE, FOLLOW ME`. `advanceClock: 20`, `moveNpc`,
// `setFollowing` (so leading him anywhere afterward keeps him with the
// player), `goto` S5. §20's own "arriving" paragraph ("He walks the length
// of the gallery once...") is NOT said here — it is wired as the S5 room's
// own Luke-present description rule (`act3/s5ReactorInterface.ts`, this
// task's own amendment), so it renders through the ordinary post-`goto`
// arrival path rather than being said twice (once here, once by the room)
// or contradicting the room's own "Still nobody" otherwise-text. See that
// file's own comment.
// ---------------------------------------------------------------------------

export const act4LukeDescends: ScriptFn = (world, state) => {
  return apply(
    world,
    state,
    [
      { advanceClock: 20 },
      { moveNpc: [ACT4_LUKE, ACT3_S5_REACTOR_INTERFACE] },
      { setFollowing: [ACT4_LUKE, true] },
      { goto: ACT3_S5_REACTOR_INTERFACE },
    ],
    { path: 'script.act4_luke_descends' },
  );
};

// ---------------------------------------------------------------------------
// Stage F1 — §20's own third trigger: "leaving the room with
// `act4_luke_will_escort`" (this file's own header, top of file, previously
// flagged as needing "an `onExit`-style hook... out of this module"). Wired
// as an ambient `EventDef` rather than a room-level handler: the Staging
// Area's `e`/`out` exits already exist unconditionally (`stagingArea.ts`),
// so `traverseDirection` finds them and never falls to the room-handler
// rung the hab Galley's exit-LESS bare OUT now uses (`move.ts`'s own
// header) — an exit that already exists can't be overridden from content
// alone without a broader engine change, out of this task's scope (see this
// task's report).
//
// GUARD against double-firing alongside the ASK/FOLLOW triggers, which run
// this exact scene synchronously inside `respond()` and so relocate Luke
// (and the player) before this event's own tick even runs: `npcAt: [luke,
// staging]` reads his CURRENT derived position (`cond.ts`'s `npcRoom`,
// following > pin > schedule) — once either trigger sets `following: true`,
// his derived position becomes wherever the player is, which is never
// `act4_staging_area` again once they have left, so this cond goes false
// and the event never re-fires. Before either trigger, with nobody moving
// him, he is still there on schedule/pin while the player has already
// walked out — exactly the "he did not come with you" case this closes.
//
// KNOWN LIMITATION (flagged, not hidden): `tick()` runs strictly after
// `turn.ts`'s one arrival-render checkpoint (that file's own header), so
// this event's own `goto` (inside `act4LukeDescends`) never gets an
// immediate arrival render the way the ASK/FOLLOW triggers do — S5's own
// Luke-present "arriving" paragraph (`act3/s5ReactorInterface.ts`) shows on
// the player's next fresh look at the room, not this same turn. Nothing is
// lost (that rule is `npcAt`-gated, not visited-gated) or broken; it is
// simply not atomic with the other two triggers the way this task's report
// discusses. A fully atomic version would need `respond()`'s own direction
// dispatch to let a room handler override an already-existing exit — an
// engine change this task did not make.
// ---------------------------------------------------------------------------

export const ACT4_EV_LUKE_ESCORT_LEAVES_EVENT: EventDef = {
  id: EVENT_ACT4_EV_LUKE_ESCORT_LEAVES,
  when: { all: [{ flag: ACT4_LUKE_WILL_ESCORT }, { not: { at: ACT4_STAGING_AREA } }, { npcAt: [ACT4_LUKE, ACT4_STAGING_AREA] }] },
  once: true,
  effects: [{ say: doorEscortText }, { script: { id: ACT4_LUKE_DESCENDS_SCRIPT } }],
};

// ---------------------------------------------------------------------------
// §22/§23 — the reader at the bottom of the well (R16), then he goes up, in
// the same script. Exported: wired from two places, both idempotent on
// `act4_luke_at_root` — the Hub's own `onEnter` (`act3/s6ArchiveHub.ts`,
// "entering the Hub with him following") and the root door's own handler
// (`act3/objects/s6ArchiveHub.ts`, "USE READER"). Canon 104: no line of
// dialogue anywhere in this text, from either man.
// ---------------------------------------------------------------------------

export const ACT4_LUKE_AT_ROOT_TEXT =
  'He follows you the length of Sublevel 6 without asking where you are going. Past the rail of hooks. Past the rows of chairs, at which he looks the way anybody looks the first time, and does not stop.\n\nIn the archive room he stands for a moment in front of a door frame with no door in it, and then goes on to the far end, where the carpet stops at three steps down into a well.\n\nHe goes down them.\n\nHe puts his hand flat on the reader beside the door. Then the badge. Then the hand again.\n\nNothing. No diode. No beat while something somewhere agrees with something else.\n\nHe does it once more, the way a man checks he did it right the first time, and then stops, at the bottom of a tiled well under a building with his father\'s name on a plaque in its lobby, in front of a small grey box that has never once been switched on.\n\nHe is down there a while.\n\nThen he comes back up the three steps and goes past you, and does not look at you as he passes, and it is not rudeness. There is nothing on his face to give anybody.\n\nHe is already in the lift with his hand flat on the leaf, holding it, which is a courtesy from a man who has not needed to open a door for himself in years.\n\nNobody says anything on the way up either.\n\nIn the lobby two men are waiting at the turnstile who have plainly had the worst afternoon of their professional lives, and one of them takes his elbow, and he lets him.\n\nAt the doors he looks back into the building, once, at the whole of it, the way you look at a room you have decided you will not be in again.';

export const ACT4_LUKE_AT_ROOT_EFFECTS: Effect[] = [
  { say: ACT4_LUKE_AT_ROOT_TEXT },
  { set: [ACT4_LUKE_AT_ROOT, true] },
  { grantClue: ACT4_CLUE_NOT_THE_USER },
  { answerQuestion: ACT4_Q_WHO_OUTRANKS_IT },
  { setFollowing: [ACT4_LUKE, false] },
  { moveNpc: [ACT4_LUKE, 'offstage'] },
  { set: [ACT4_LUKE_GONE, true] },
  // Stage F1 — the other place `act4_luke_gone` gets set (`events.ts`'s
  // missed-window event is the first); see `ACT4_LUKE_GONE_MARKER`'s own
  // doc comment (`ids.ts`) for why this stays safely hidden until now.
  { reveal: ACT4_LUKE_GONE_MARKER },
];

// §23's alternate arm — the visit ends without the player ever bringing him
// to the door — is wired directly on the Staging Area's own description
// (`act4/stagingArea.ts`, task L's room; this task's own addition there,
// flagged in this task's report as a cross-boundary edit), not here.

export const luke: NpcDefSlice = {
  schedule: [
    { when: { all: [{ onOrAfterDay: ACT4_VISIT_DAY }, { not: { flag: ACT4_LUKE_GONE } }] }, room: ACT4_STAGING_AREA },
    { room: 'offstage' },
  ],
  nouns: ['luke', 'president', 'man', 'visitor'],
  pronoun: 'he',
  name: 'Luke',
  description,
  greeting,
  unknownTopic,
  topics: [topicLetters, topicNoumena, topicJack, topicJules, topicFacility, topicDoor, topicSissy, topicDetail],
  showResponses,
  handlers: [
    { verbs: [V_ATTACK], effects: [{ say: attackText }] },
    // The topic's own `response` (`topicDoor`, above) renders `doorEscortText`
    // for the "ask again" trigger; a `HandlerDef` has no separate response
    // slot, so this trigger says it explicitly, once, before the same
    // movement script.
    { verbs: [V_FOLLOW], when: { flag: ACT4_LUKE_WILL_ESCORT }, effects: [{ say: doorEscortText }, { script: { id: ACT4_LUKE_DESCENDS_SCRIPT } }] },
    { verbs: [V_FOLLOW], effects: [{ say: followText }] },
    { verbs: [V_HUG, V_KISS], effects: [{ say: hugKissText }] },
  ],
};

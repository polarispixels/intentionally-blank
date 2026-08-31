// Stage E2, task P — Sissy (`docs/superpowers/specs/2026-09-19-stage-e2-
// prose.md` §32, §33, §52, §56.3). Prose transcribed exactly (hard rule 5).
//
// SCHEDULE — the doc's own §32 header states it directly: "the Galley on
// morning / afternoon / evening, the Dome at night — the facility's phase
// table, unremarked (canon 112)." Register 128 (§53 q1 / §58 row 126):
// canon 104 binds the facility's floors, not the archive's environments —
// she speaks. No second phase table (the ruling on the doc's own status
// line) — this reuses the shipped `clockPhase` cond, the same table every
// other schedule in the game reads.
//
// THE MOTHER (register 136/§58 row 134) — mentioned once, in `topicLaunch`
// below ("My mother would have hated it..."), and nowhere else in this
// file or anywhere else in the wave. Grepped clean.
//
// `tellTopics` — not authored separately (§56.3's own note): absent, so
// `npc.ts` reuses `topics` for TELL too, reaching the same eight topics.
//
// `giveResponses` — not authored separately either (§56.3): reuses
// `showResponses` verbatim so `GIVE POLAROID TO SISSY` routes to the same
// §32.9 text as `SHOW POLAROID TO SISSY`, rather than falling to GIVE's own
// generic default.
//
// THE TWO POLAROID SHOW RESPONSES (§32.9) — both target the same shipped
// object, `act1_intact_polaroids` (one object holding two photographs, the
// porch and the night sky over it — see `act1/objects/closeOut.ts`'s own
// `intactPolaroidsText`). The doc frames "SHOW NIGHT-SKY POLAROID" and
// "SHOW PORCH POLAROID" as two different player phrasings, but
// `ShowResponseDef` has no way to see which noun/adjective the player
// actually typed (`respondToShow`/`matchesShow`, `engine/npc.ts`, key off
// the resolved object id only) — a genuine engine gap, not a mis-wiring.
// Builder's call: the dramatic reaction (which fetches the canister, P24's
// `K` route) is the FIRST show of it, gated `{ not: { has: act4_sissy_film
// } }`; the short "that's the porch" acknowledgment is the fallback, for
// every SHOW after she has already handed the film over — narratively
// consistent with the note that she does not re-fetch what she has already
// given. Flagged in this task's report.

import type { NpcDefSlice, ShowResponseDef, TopicDef } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { T } from '../../../engine/ids';
import { FEDORA, INTACT_POLAROIDS } from '../act1/ids';
import { ACT4_CLUE_SISSY_COUNTS_THREE, ACT4_CLUE_SISSYS_REASON, ACT4_HAB_DOME, ACT4_HAB_GALLEY, ACT4_SISSY, ACT4_SISSY_FILM, ACT4_SISSY_TOPIC_LAUNCH } from './ids';
import { ACT4_MEM_M11 } from './ids';

// ---------------------------------------------------------------------------
// §32.0a — description.
// ---------------------------------------------------------------------------

const description =
  'She is at the fold-down table with her feet hooked under the seat rail and a\nvalve body in bits on a cloth in front of her, doing something to it with a pick,\nand she looks up when the seal goes — not startled, not pleased, in the way you\nlook up when a thing happens at about the time it happens.\n\nSmall, and rope-thin the way people get when the food is adequate and the work is\nconstant. Hair cut by herself with clippers and growing out of it. A crew shirt\nwith the sleeves buttoned at the wrist, which in a room this warm is a choice,\nand it is not a choice she offers you any part of.\n\nShe puts every piece of the valve down inside the lip of the table, every time,\nwithout looking at where she is putting it. Not one of those pieces was ever\ngoing anywhere. It is a habit out of somewhere that is not this room.';

// ---------------------------------------------------------------------------
// §32.0b — greeting, two rules.
// ---------------------------------------------------------------------------

const greeting: ProseRule[] = [
  {
    when: { not: { met: ACT4_SISSY } },
    text: '"You came through the lock," she says.\n\nShe has not stood up. She turns the pick over and puts it down inside the lip.\n\n"That\'s fine. I\'m going to be honest with you: I stopped assuming things about\nwho is on the other side of that door about eight months ago, and it has made me\nmuch easier to live with." A pause that is not for effect; she is looking at the\nsuit rack behind you and doing arithmetic. "You hung it up second from the small\nend."\n\n"Sit down. Mind the seat on your side, the restraint\'s tied off."',
  },
  {
    text: 'She moves the cloth over an inch so the other seat has table in front of it.',
  },
];

// ---------------------------------------------------------------------------
// §32.0c — unknownTopic, three, in rotation. `firstOnce` (same idiom as
// `act4/luke.ts`'s own `unknownTopicRotation`).
// ---------------------------------------------------------------------------

const unknownTopicRotation: string[] = [
  '"No," she says, pleasantly, and goes back to the valve.',
  '"I could invent something. I have a lot of time and I have got very good at it,\nand I have decided it is a bad habit."',
  'She thinks about it properly, which is worse than being brushed off, and then\nshakes her head once. "That\'s not one I\'ve got."',
];

const unknownTopic: ProseRule[] = [{ text: unknownTopicRotation, firstOnce: true }];

// ---------------------------------------------------------------------------
// §32.1 — topic_sky.
// ---------------------------------------------------------------------------

const TOPIC_SKY = T('act4_sissy_topic_sky');

const topicSky: TopicDef = {
  id: TOPIC_SKY,
  words: ['sky', 'stars', 'anomaly', 'anomalies', 'reports', 'report', 'the anomaly'],
  response:
    '"I file it every time and it comes back handled."\n\nShe wipes the pick on the cloth and does not pick anything else up, which is the\nfirst time her hands have been still.\n\n"It started as a calibration problem, which is what everything starts as. You get\na field you know, you put the camera on it, you compare it to the plate, and if\nit doesn\'t match you have got a bad mount or a bad clock or a bad you. I did the\nmount. I did the clock. I did me, twice, and I got somebody at Flight to do me a\nthird time without telling them why."\n\n"It matches. That\'s the thing I keep having to say to people who have stopped\nreading by then. It matches the plate. It matches it too well. There is a\ntolerance you are supposed to see and I am not seeing it, and I have not seen it\nfor a year, and I have written that down forty different ways and every one of\nthem comes back with the same word in the box."\n\n"Handled." She says it without any weight on it at all. "It is a very good word.\nYou can\'t argue with it. There\'s nothing in it to argue with."',
};

// ---------------------------------------------------------------------------
// §32.2 — topic_film — two rules — P24's `C` route. Rule 1 hands over
// `act4_sissy_film`.
// ---------------------------------------------------------------------------

const TOPIC_FILM = T('act4_sissy_topic_film');

const topicFilmRule1Text =
  '"You want the film."\n\nShe is up before she has finished saying it, and along the galley, and into a\nstowage bag by the third handhold that she does not have to look for.\n\n"I was told to stop shooting chemical eleven months ago. It\'s mass, and it\'s mass\nthat comes back up, and there\'s a very good argument for it that I agree with and\nhave not acted on." The canister comes out taped round the join, the grey kind\nwith a grey lid. "I have been shooting one roll a month since, on a tripod,\nexposures long enough to do the job, and I have not sent one frame of it\nanywhere, because the whole point of the argument I am having is that the\npictures keep arriving correct."\n\nShe holds it out and does not let go of it straight away.\n\n"There is no darkroom on this station. There is nowhere within a very long way of\nhere that there is a darkroom. If you are going to do this, do it properly, and\nif it comes out and I am wrong I would quite like to be told that as well."';

const topicFilmRule2Text =
  '"Who told you about that?"\n\nIt is not hostile. It is the flat question of somebody who has been careful about\none thing for a year and has just found out that the care may have been\ndecorative.\n\n"No. Not yet."';

const topicFilm: TopicDef = {
  id: TOPIC_FILM,
  words: ['film', 'roll', 'canister', 'mars film', 'her film'],
  response: [
    { when: { memory: ACT4_MEM_M11 }, text: topicFilmRule1Text },
    { text: topicFilmRule2Text },
  ] satisfies ProseRule[],
  effects: [{ move: [ACT4_SISSY_FILM, 'inventory'] }],
};

// ---------------------------------------------------------------------------
// §32.3 — topic_luke.
// ---------------------------------------------------------------------------

const TOPIC_LUKE = T('act4_sissy_topic_luke');

const topicLuke: TopicDef = {
  id: TOPIC_LUKE,
  words: ['luke', 'president', 'the president'],
  response:
    '"He writes. He is the only one of them who has never once missed."\n\nShe turns the valve body over.\n\n"Three paragraphs. Ask after the work, one thing about a bill, one thing about\nthe weather where he is, and a line at the bottom that is trying to be funny. I\ncould set my watch by it, and I have, more or less, because there is nothing else\nup here that arrives on a schedule."\n\n"They are very good letters and I could not tell you one thing that has ever been\nin one of them."',
};

// ---------------------------------------------------------------------------
// §32.4 — topic_launch / topic_brothers — sets `act4_sissy_topic_launch`,
// grants `act4_clue_sissy_counts_three`. M11 fires on the next tick (its own
// `trigger.when`, `./knowledge.ts`). THE MOTHER (register 136) — this is
// her one mention, in the whole wave.
// ---------------------------------------------------------------------------

const TOPIC_LAUNCH = T('act4_sissy_topic_launch');

const topicLaunch: TopicDef = {
  id: TOPIC_LAUNCH,
  words: ['launch', 'brothers', 'the launch', 'her brothers', 'the brothers', 'watched it'],
  response:
    '"Everybody watched it, is the answer you\'re after. Everybody who could."\n\nShe counts them off on the back of her hand with the pick, which is a thing she\nwould not do if she were thinking about doing it.\n\n"The oldest of the boys had a field and a truck and he had the rest of them out\nin it, which took organising, and he is the one who organised it, because he was\nthe one who organised things. The one who does energy watched it in an airport\nand told me about the airport for an hour afterwards. And the youngest of them\ndrove eleven hours to be in the field, which he has never once mentioned to me,\nwhich is how I know it was eleven hours."\n\nShe stops, and looks at the hand for a second the way you look at a sum that has\ncome out, and goes back to the valve.\n\n"Three brothers, and all three of them in a field in the dark looking up at a\nthing they could not possibly see yet. My mother would have hated it. She\'d have\nmade them come inside."',
  effects: [{ set: [ACT4_SISSY_TOPIC_LAUNCH, true] }, { grantClue: ACT4_CLUE_SISSY_COUNTS_THREE }],
};

// ---------------------------------------------------------------------------
// §32.5 — topic_jules — grants `act4_clue_sissys_reason` — canon 110.
// ---------------------------------------------------------------------------

const TOPIC_JULES = T('act4_sissy_topic_jules');

const topicJules: TopicDef = {
  id: TOPIC_JULES,
  words: ['jules', 'the missing one', 'i', 'the tattoos'],
  response:
    '"I don\'t know that name."\n\nShe says it the way she says everything, which is without hedging, and then she\nsits with it for a second longer than the sentence needed.\n\n"The numbers, though. I know about the numbers, and I know what you are going to\nask, because everybody does eventually."\n\n"The first one didn\'t take. That\'s all it is. The man did it, and it looked right\nthe day it was done, and inside a year it had gone to a smudge — which happens; a\nsingle upright is the hardest thing on that whole sheet to keep, because there is\nnothing in it for the skin to hold on to. And rather than sit that one back down\nin the chair and put him through it again, my father moved everybody up a place,\nand the sheet started at two, and that was that."\n\nShe has said this before. It has the shape of a thing said before.\n\n"Which of them was it on?"\n\nThe pick goes down inside the lip of the table.\n\n"It\'ll be one of the boys," she says. "Ask my brother the one who does energy; he\nremembers that day better than any of us. He was six and he has never once shut\nup about it."',
  effects: [{ grantClue: ACT4_CLUE_SISSYS_REASON }],
};

// ---------------------------------------------------------------------------
// §32.6 — topic_jack.
// ---------------------------------------------------------------------------

const TOPIC_JACK = T('act4_sissy_topic_jack');

const topicJack: TopicDef = {
  id: TOPIC_JACK,
  words: ['jack', 'truck', 'the truck'],
  response:
    '"Eleven hours," she says. "He drove eleven hours to stand in a field and he has\nnever told me and he never will."\n\n"He writes, and his letters are the ones that read like a man doing homework. I\nknow exactly what they cost him and I would not swap one of them for the whole of\nthe other correspondence."\n\n"He asks me a question in every one. Nobody else asks me a question."',
};

// ---------------------------------------------------------------------------
// §32.7 — topic_comms — the twelve minutes are hers.
// ---------------------------------------------------------------------------

const TOPIC_COMMS = T('act4_sissy_topic_comms');

const topicComms: TopicDef = {
  id: TOPIC_COMMS,
  words: ['rig', 'comms', 'delay', 'messages', 'message', 'the rig', 'the delay'],
  response:
    '"Twelve minutes each way," she says. "That is what we were told at the start and\nit is what is on every timeline anybody has ever sent me, and it is why you do not\nhave conversations up here, you have correspondence."\n\n"You learn to write a message that does not need an answer. Everybody who does\nthis learns it. You put the question at the top and then you put everything the\nother end is going to need in order to answer it underneath, because if you get\nthat wrong you have spent half an hour finding out that you got it wrong."\n\nShe looks at the rig for a moment, and then at the queue on it, and then at the\nvalve.\n\n"I am extremely good at it now," she says. "That is not the compliment it sounds\nlike."',
};

// ---------------------------------------------------------------------------
// §32.8 — topic_home.
// ---------------------------------------------------------------------------

const TOPIC_HOME = T('act4_sissy_topic_home');

const topicHome: TopicDef = {
  id: TOPIC_HOME,
  words: ['home', 'house', 'porch', 'the house', 'the porch'],
  response:
    '"The porch," she says immediately, which surprises her more than it surprises\nyou. "That\'s what I\'ve got. Not the house. The porch, and the top step, and the\nnoise the screen door made, which I could do for you now."\n\n"The rest of it comes and goes. I can tell you the arrangement of a kitchen I have\nnot been in for a long time and I could not tell you the colour of any of it."\n\nShe goes back to the valve.\n\n"I sit up in the dome at night and I have got into the way of putting that porch\nunder it. Which is not what the dome is for. But you have to put something under a\nsky or it is only a lot of light with nothing to be over."',
};

// ---------------------------------------------------------------------------
// §32.9 — showResponses.
// ---------------------------------------------------------------------------

const SHOW_NIGHT_SKY_POLAROID_TEXT =
  'She takes it in both hands, which she has not done with anything else you have\nseen her handle, and holds it under the lamp at the wrong angle for looking at a\nphotograph and the right angle for keeping the lamp out of it.\n\nShe looks at it for a long time. Long enough that the fan cycles.\n\n"Who took this?"\n\nYou tell her when, roughly, and where, roughly, and she nods at each of those\nwithout taking her eyes off it, and puts it down on the cloth, and gets up and\ngoes along the galley to the third handhold.\n\n"It\'s out of focus," she says, with her back to you, in the voice of somebody\nbeing scrupulous about the one thing that is going to matter later. "I want that\non the record. It is badly out of focus and you cannot prove anything with it and\nneither can I."\n\nShe comes back with the canister and puts it on the cloth next to the Polaroid,\nand moves the Polaroid a little so that they are square with each other, and does\nnot appear to know she has done it.';

const SHOW_PORCH_POLAROID_TEXT =
  'She looks at it for a second and hands it straight back.\n\n"That\'s the porch," she says.\n\nThen, going back to the valve: "There\'s a man on the left of that I could not put\na name to and I have been looking at that step my whole life."\n\nShe does not say it as though it troubles her. She says it the way you mention a\ndraught.';

const SHOW_FEDORA_TEXT = '"It\'s a hat," she says.';

const showResponses: ShowResponseDef[] = [
  {
    objects: [INTACT_POLAROIDS],
    when: { not: { has: ACT4_SISSY_FILM } },
    response: SHOW_NIGHT_SKY_POLAROID_TEXT,
    effects: [{ move: [ACT4_SISSY_FILM, 'inventory'] }],
  },
  {
    objects: [INTACT_POLAROIDS],
    response: SHOW_PORCH_POLAROID_TEXT,
  },
  {
    objects: [FEDORA],
    response: SHOW_FEDORA_TEXT,
  },
];

// ---------------------------------------------------------------------------
// Schedule (§32 header) — the Galley on morning/afternoon/evening, the Dome
// at night, the facility's own clock (canon 112).
// ---------------------------------------------------------------------------

export const sissy: NpcDefSlice = {
  schedule: [
    { when: { clockPhase: 'night' }, room: ACT4_HAB_DOME },
    { room: ACT4_HAB_GALLEY },
  ],
  nouns: ['sissy', 'astronaut', 'woman', 'sister', 'her'],
  pronoun: 'she',
  name: 'Sissy',
  description,
  greeting,
  unknownTopic,
  topics: [topicSky, topicFilm, topicLuke, topicLaunch, topicJules, topicJack, topicComms, topicHome],
  showResponses,
  // §56.3 — no `giveResponses` authored separately: `GIVE POLAROID TO
  // SISSY` reuses the identical `showResponses` array so it routes to the
  // same §32.9 text rather than falling to GIVE's own generic default.
  giveResponses: showResponses,
};

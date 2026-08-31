// Act III, Stage D4 task C — S5 Reactor Interface's own objects: the gauge
// wall (§9.2-§9.4), the demand dial (§9.5), the chase bottom (§9.6), the S6
// door and its pad/reader (§9.7-§9.8), the wall clock (§9.9), the room's
// bench/logbook/wall (§9.10, uncounted sub-parts), and the interlock,
// including the game's first death (§10). `s5ReactorInterface.ts` (the room
// shell, one directory up) wires these plus the room-level senses/bare
// verbs the room itself owns.
//
// Every string below is transcribed verbatim from the prose doc (hard rule
// 5). No response subtracts 460 from 905, and none says *town* or *second
// facility* (§2's own note, §17's first row).
//
// Cross-module mutations, flagged here (not one of the five named shared
// files, but the established idiom every prior D3/D4 task already uses for
// exactly this — `corridorB4.ts`'s own header on `nolanBadge`, `verbs.ts`'s
// own header on `V_MEASURE`/`V_CALL`):
//   - `ACT2_CENSOR_OBJECTS[ACT2_REPLY_AUDIT]` gains a `COMPARE`/`FIT`/`MATCH`
//     handler for "COMPARE AUDIT WITH GAUGES" (§9.4).
//   - `nolanBadge` (`act2/nolan.ts`) gains the S6 badge refusal (§9.8).
//   - `ACT2_NOTEBOOK_OBJECTS[ACT2_NOTEBOOK]` gains "USE NOTEBOOK ON PAD"
//     (§9.8), which needs `USE_VERB_ID` to carry `'V dobj prep iobj'` — see
//     `act3/verbs.ts`'s own in-place mutation of it.
//
// Builder gaps (escalated, not guessed — see this task's report):
//   - "CHECK AUDIT AGAINST WALL" (§9.4) is unreachable: bare "check" is
//     already exclusively `V_ACT2_CHECK`'s (`act2/verbs.ts`, pattern `'V'`
//     only, zero dobj tokens), so it can never parse with trailing tokens
//     "audit against wall." COMPARE/FIT/MATCH (already `V_FIT`'s own words,
//     `preps` already include "against") cover the same mechanic.
//   - "COMPARE LETTER WITH GAUGES" (§9.4) is unreachable: `act2/objects/
//     censor.ts`'s own `replyAudit` nouns deliberately avoid bare "letter"
//     (its own comment: `act2_returned_letter` already claims that word) —
//     mutating a noun list on a shared act2 object is out of this task's
//     module. "COMPARE AUDIT WITH GAUGES" (its own actual noun) is
//     unaffected.
//   - "LOOK AT CLOCK" (§9.9) is `EXAMINE`'s own registered word ('look at',
//     `act1/verbs.ts`), so it cannot be redirected to the READ-clock frame
//     without breaking `EXAMINE` everywhere else that phrase is typed; it
//     renders the clock's own `examine` text instead. `READ CLOCK`/`WHAT
//     TIME IS IT`/`CHECK TIME` all reach the frame.
//   - `COUNT GAUGES` (§22.15, canon 70) has no exact refusal line authored
//     anywhere in the doc. Reusing the gauge wall's own §9.2 `EXAMINE` text
//     verbatim (rather than composing new prose) satisfies "refuses, in the
//     room's own voice" without inventing a sentence; a bespoke line is a
//     narrative-writer need if the main session wants one.
//   - "PULL LEVER" (§10.2's own header) has no literal lever object anywhere
//     in §10.1's own furniture (a wheel, a keyswitch, two buttons) — "lever"
//     is added as an extra noun on the interlock itself (deviating one word
//     from the doc's literal §10 noun list, same class of builder addition
//     `objects/coolingPlant.ts`'s own header already documents for Return
//     A/B's shared bare "return") so the phrase resolves at all.
//   - "PUSH BUTTON" (§10.2's own header) is read here as pushing the door's
//     mechanism generically, but the room's only object with bare noun
//     "button" is the panel's own green/red buttons (§10.1's dedicated,
//     load-bearing text — "Neither of them does anything you can hear").
//     Rather than have one noun answer two contradictory ways depending on
//     unwritten state, "button"/"buttons" stay exclusively the panel's; the
//     shield door itself is reached by "door"/"wheel"/"lever" (OPEN/TURN/
//     PULL). Flagged for main-session review.

import type { Effect } from '../../../../engine/effects';
import type { Cond } from '../../../../engine/cond';
import type { ObjectDefSlice } from '../../../../engine/world';
import type { ProseRule } from '../../../../engine/prose';
import { DIRECTION_VERB_IDS, USE_VERB_ID } from '../../../../engine/move';
import { EXAMINE, LISTEN, LOOK_UNDER, OPEN, PRY, PULL, PUSH, READ, SEARCH, SHOW, TAKE, TOUCH, TURN } from '../../act1/verbs';
import { V_COUNT, V_KNOCK, V_RING } from '../../act1/ids';
import { ACT2_CLUE_CREDENTIALS, ACT2_NOLAN_BADGE, ACT2_NOTEBOOK, ACT2_REPLY_AUDIT, V_FIT } from '../../act2/ids';
import { nolanBadge } from '../../act2/nolan';
import { ACT2_CENSOR_OBJECTS } from '../../act2/objects/censor';
import { ACT2_NOTEBOOK_OBJECTS } from '../../act2/objects/notebook';
import {
  ACT3_BASELINE_MATCHED,
  ACT3_BYPASS_SEEN,
  ACT3_CHASE_BOTTOM,
  ACT3_CLUE_BASELINE_MATCHES_AUDIT,
  ACT3_CLUE_S6_DOOR_REFUSES,
  ACT3_CLUE_THREE_AM_DIP,
  ACT3_DEMAND_DIAL,
  ACT3_DEMAND_DIAL_TURNED,
  ACT3_GAUGES,
  ACT3_INTERLOCK,
  ACT3_INTERLOCK_BUTTONS,
  ACT3_INTERLOCK_DEATH_SCRIPT,
  ACT3_INTERLOCK_KEYSWITCH,
  ACT3_INTERLOCK_LAMP,
  ACT3_INTERLOCK_NORMAL,
  ACT3_INTERLOCK_TAG,
  ACT3_LOGBOOK,
  ACT3_PIPE_CHASE,
  ACT3_READ_CLOCK_SCRIPT,
  ACT3_READ_GAUGES_NIGHT,
  ACT3_S5_BENCH,
  ACT3_S5_REACTOR_INTERFACE,
  ACT3_S5_TOUCH_WALL,
  ACT3_S6_DOOR,
  ACT3_S6_PAD_TRIED,
  ACT3_WALL_CLOCK,
  V_ACT3_BADGE,
} from '../ids';

// ---------------------------------------------------------------------------
// §9.2 — the gauge wall.
// ---------------------------------------------------------------------------

const gaugesExamine =
  'Round faces, white on black, in two ranks the length of the wall, each with a\nbrass tag wired to its bezel and a red hairline painted on the inside of the\nglass where somebody once decided the needle should not go past.\n\nThey are grouped, and the grouping is the argument. Left-hand rank:\ngeneration — what comes off the machine. Right-hand rank: distribution —\nwhere it goes, one gauge to a feeder, with the pressures and the temperatures\nfilling in below.\n\nThe needles do not hunt. They sit.';

const gaugesTouch =
  'The glass is cold and the needle behind it does not care what you do to the\nglass, which is the entire reason anybody still fits these.';

// §9.3, rule 1 — the night window (grants the clue, sets the flag).
const gaugesReadNight =
  '    HALL A     460\n    FDR 3      408\n\nand then back to the big face on the generation side, the one with the\nwidest bezel in the room:\n\n    GEN        868\n\nHALL A has not moved. HALL A does not move; a hall of machines does the same\nthing at three in the morning that it does at three in the afternoon, and\nthat is the entire reason people put them out here where nothing else is.\n\nFDR 3 has moved. It is down, and it has been down long enough that the\nneedle is sitting rather than settling.\n\nLow on the glass of FDR 3\'s bezel, inside it, where you would have to have\ntaken the bezel off to do it, there is a pencil line. It is at the needle. It\nis not dated and it is not initialled and it is not on any other gauge in\nthe room.';

const GAUGES_READ_NIGHT_TEXT = `You go along the distribution rank with a finger under the tags.\n\n${gaugesReadNight}`;

// §9.3, rule 2 — the baseline, any other hour.
const gaugesReadBaseline =
  '    HALL A     460\n    FDR 3      445\n\nand then back to the big face on the generation side, the one with the\nwidest bezel in the room:\n\n    GEN        905\n\nEvery other tag on this wall says what its gauge is for. HALL A goes to the\nhall. PLANT goes to the plant. LIGHTING AND SMALL POWER goes, at some\nlength, to lighting and small power.\n\nFDR 3 says FDR 3.\n\nThe needle on it has worn a shine into the paint of the dial where it has\nbeen sitting.';

const GAUGES_READ_BASELINE_TEXT = `You go along the distribution rank with a finger under the tags.\n\n${gaugesReadBaseline}`;

// §9.3, rule 3 — a second reading in the window, after the first.
const GAUGES_READ_SECOND_TEXT = 'Down again, and by the same amount, and at the same needle-width above the\npencil line.';

const gaugesReadProse: ProseRule[] = [
  // Checked before rule 1's own window cond so a SECOND read within the
  // window (flag already set) doesn't re-match rule 1's text forever.
  { when: { all: [{ flag: ACT3_READ_GAUGES_NIGHT }, { clock: { after: 60, before: 240 } }] }, text: GAUGES_READ_SECOND_TEXT },
  { when: { all: [{ clockPhase: 'night' }, { clock: { after: 60, before: 240 } }] }, text: GAUGES_READ_NIGHT_TEXT },
  { text: GAUGES_READ_BASELINE_TEXT },
];

const gaugesReadEffects: Effect[] = [
  { say: gaugesReadProse },
  {
    if: {
      when: { all: [{ clockPhase: 'night' }, { clock: { after: 60, before: 240 } }, { not: { flag: ACT3_READ_GAUGES_NIGHT } }] },
      then: [{ grantClue: ACT3_CLUE_THREE_AM_DIP }, { set: [ACT3_READ_GAUGES_NIGHT, true] }],
    },
  },
];

// §9.4 — COMPARE AUDIT WITH GAUGES / COMPARE LETTER WITH GAUGES / CHECK
// AUDIT AGAINST WALL (the latter two: see this file's own header gaps).
const compareAuditGaugesText =
  'You hold Eli\'s second sheet up beside the wall, which is a thing you have been\ncarrying it around for four days to be able to do and have not, until now,\nhad a wall for.\n\nHis FILED column and the tag that says HALL A are the same number.\n\nHis TAKEN column and the big face on the generation side are the same\nnumber, give or take whichever month you put your thumb on.\n\nAnd the third column — the one he ruled himself, and headed DIFFERENCE, and\nsat with for four days before he would put it in an envelope — that one is\nnot a subtraction down here.\n\nIt is a gauge. It has a bezel and a brass tag and a red line painted on the\nglass, and somebody comes along this wall every morning to make sure it is\nwhere it was.';

const compareAuditGaugesEffects: Effect[] = [
  { say: compareAuditGaugesText },
  { grantClue: ACT3_CLUE_BASELINE_MATCHES_AUDIT },
  { set: [ACT3_BASELINE_MATCHED, true] },
];

const gauges: ObjectDefSlice = {
  location: ACT3_S5_REACTOR_INTERFACE,
  name: 'gauges',
  portable: false,
  nouns: ['gauges', 'gauge', 'wall', 'gauge wall', 'dials', 'dial faces', 'needles', 'needle', 'meters', 'meter', 'bezels', 'tags', 'glass', 'rank', 'instruments'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: gaugesExamine }] },
    { verbs: [TOUCH], effects: [{ say: gaugesTouch }] },
    { verbs: [READ], effects: gaugesReadEffects },
    // "COMPARE AUDIT WITH GAUGES" itself is wired on the audit object below
    // (dobj = the audit; this object only ever sees it as `withInstrument`).
    // §22.15/canon 70 — COUNT must refuse, in the room's own voice; reusing
    // the wall's own EXAMINE text verbatim rather than inventing a refusal
    // (see this file's own header gap).
    { verbs: [V_COUNT], effects: [{ say: gaugesExamine }] },
  ],
};

// ---------------------------------------------------------------------------
// §9.5 — the demand dial.
// ---------------------------------------------------------------------------

const demandDialExamine =
  'Under a hinged perspex cover with a hasp on it and nothing through the hasp: a\nsingle dial about the size of a saucer, brass-rimmed, graduated the whole way\nround, with a small chrome handwheel on the end of its spindle.\n\nThe card screwed under it says DEMAND, and under that, smaller:\n\n    NOT TO BE ALTERED WITHOUT AUTHORITY\n\nThe dial is not on a graduation. It is between two of them, and it has been\nbetween them long enough for the polish on the handwheel to have gone flat on\none side.';

const demandDialFirstTurnText =
  'The cover comes up, because a hasp with nothing through it is a hinge with\nambitions, and the handwheel turns about a degree, and the entire wall of\ngauges to your right notices.\n\nYou put it back before the needles have finished moving, which is the correct\ninstinct arrived at slightly late.';

const demandDialSecondTurnText =
  'Once was experiment. Twice is a decision about somebody else\'s building, made\nin the dark, by a man who does not know what is on the other side of that\nwall.';

const demandDialTurnEffects: Effect[] = [
  {
    if: {
      when: { flag: ACT3_DEMAND_DIAL_TURNED },
      then: [{ say: demandDialSecondTurnText }],
      else: [{ say: demandDialFirstTurnText }, { set: [ACT3_DEMAND_DIAL_TURNED, true] }],
    },
  },
];

const demandDial: ObjectDefSlice = {
  location: ACT3_S5_REACTOR_INTERFACE,
  name: 'demand dial',
  portable: false,
  // Bare "card" deliberately dropped (§21.2's own ruling: the checkout
  // card, S1, is the only portable "card" and once taken wins everywhere;
  // this dial's own DEMAND plaque is described in its EXAMINE text and
  // needs no separate noun to reach it).
  nouns: ['dial', 'demand dial', 'demand', 'cover', 'perspex', 'hasp', 'handwheel', 'wheel', 'spindle'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: demandDialExamine }] },
    { verbs: [TURN, OPEN], effects: demandDialTurnEffects },
  ],
};

// ---------------------------------------------------------------------------
// §9.6 — the chase bottom. P18; answers `act3_q_second_return`.
// ---------------------------------------------------------------------------

const chaseBottomExamine =
  'The two big returns come through the end wall at waist height, turn down\nthrough ninety degrees on long-radius bends, and go into the floor.\n\nBeside them, in the same opening, there is a steel ladder. The opening is not\na hole knocked in anything: it is formed, with a rolled edge and a handhold,\nand the ladder is bolted through it in four places.\n\nReturn A stops at this floor. You can watch it do it — through the wall, round\nthe bend, down about a yard, and then a valve and a blank flange, because five\nfloors down is where the building stops and a return has to stop somewhere.\n\nReturn B goes past the flange and keeps going.\n\nSo does the ladder.';

const chaseBottomTouchReturnB = 'Warm. The same warm. Four floors below the room where you first put a hand on\nit, and it has not given any of it up on the way.';

// Exported: the room shell wires this onto its own room-level handler for
// `V_ACT3_LOOK_DOWN_SHAFT` (bare — "look down" has no dedicated verb in
// this game to hang a dobj off, same reasoning as `V_LOOK_DOWN_AISLE`).
export const chaseBottomLookDownText =
  'Ladder, pipe, ladder, pipe, and then the point at which what you are looking at\nstops being a thing you can see and starts being a direction.';

const chaseBottomDownEffects: Effect[] = [{ goto: ACT3_PIPE_CHASE }, { advanceClock: 1 }];

const chaseBottom: ObjectDefSlice = {
  location: ACT3_S5_REACTOR_INTERFACE,
  name: 'chase bottom',
  portable: false,
  nouns: ['opening', 'hole', 'ladder', 'shaft', 'chase', 'pipe chase', 'returns', 'return', 'pipes', 'bends', 'flange', 'valve'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: chaseBottomExamine }] },
    { verbs: [TOUCH], effects: [{ say: chaseBottomTouchReturnB }] },
    { verbs: [DIRECTION_VERB_IDS.in], effects: chaseBottomDownEffects },
  ],
};

// ---------------------------------------------------------------------------
// §9.7 — the S6 door, and §9.8's two refusals.
// ---------------------------------------------------------------------------

const s6DoorExamine =
  'Steel, flush in the end wall, no window, no vision panel, no closer on it and\nno handle on this side.\n\nThe only legend is a strip of engraved plastic screwed on at eye height:\n\n    MECHANICAL — NO ADMITTANCE\n\nBeside it, on one plate: a reader of exactly the family fitted upstairs, and\nbelow the reader a rubber keypad with letters on it as well as numbers, and a\ntwo-line display above the keypad.\n\nA pad with letters on it is fitted when somebody expects a name to be typed\nand not just a number.\n\nEvery other door in this building has a reader. This one has a reader and a\npad.';

const s6DoorPushText =
  'It does not move, and there is nothing on it to move it by, and it is hung so\nclose in its frame that you cannot get a fingernail into the gap, let alone\nanything with a handle on it.';

const s6DoorPryText =
  'The frame is grouted into poured concrete and the leaf is hung on hinges you\ncannot see from this side.\n\nThe chair leg has had a good run — a drawer, a plate, and a cam lock in a\nkerb — and this is the first thing all week that it is simply the wrong shape\nfor.';

const s6DoorKnockText = 'Twice, like a man at a door, which after a few seconds begins to feel like\nsomething you have chosen to do rather than something you are still doing.\n\nNothing.';

const s6DoorListenText = 'Nothing. Not silence — nothing. Four inches of steel in a wall of concrete is\nnot in the business of passing anything on, and it does not make an exception\nfor you.';

// §9.8 — the badge, at this door: refuses, grants the clue.
const s6BadgeText =
  'The reader takes it the way every reader in this building has taken it.\n\nIt goes green. Then it goes out. The door does not move.\n\nSomewhere a log now has a line in it saying NOLAN, at a door NOLAN does not\nopen.';

const s6BadgeEffects: Effect[] = [{ say: s6BadgeText }, { grantClue: ACT3_CLUE_S6_DOOR_REFUSES }];

// §9.8 — the pad: TYPE CREDENTIALS / ENTER CREDENTIALS / TYPE ADMIN / TYPE
// PASSWORD / USE NOTEBOOK ON PAD, gated on knowing the words at all.
const s6PadCredentialsText =
  'You type the two words out of the inside of a dead man\'s back cover, slowly,\nbecause the keys are stiff and because it had not occurred to you until just\nnow that you might only get to do this once.\n\nThe display holds still for about as long as it takes to be sure it is\nthinking. Then:\n\n    ACCESS LEVEL: MAINTENANCE\n    DENIED\n\nThe pad did not refuse the words. It read them, agreed with them, and\ndeclined to open.\n\nWhich means the words are not wrong. They are only shallow.';

const s6PadRepeatText = '    ACCESS LEVEL: MAINTENANCE\n    DENIED\n\nExactly the same, and at exactly the same speed, which is a machine\'s way of\ntelling you that it is not going to develop an opinion about you.';

const s6PadNoneText = '    ACCESS LEVEL: NONE\n\nFaster. It did not have to look that one up.';

const s6PadKnowsCredentials: Cond = { any: [{ clue: ACT2_CLUE_CREDENTIALS }, { has: ACT2_NOTEBOOK }] };

// Exported: the room shell wires this onto its own room-level handler for
// `V_ACT3_TYPE_PAD` (bare, no dobj — see this object's own header note).
export const s6PadEffects: Effect[] = [
  {
    if: {
      when: s6PadKnowsCredentials,
      then: [
        {
          if: {
            when: { flag: ACT3_S6_PAD_TRIED },
            then: [{ say: s6PadRepeatText }],
            else: [{ say: s6PadCredentialsText }, { grantClue: ACT3_CLUE_S6_DOOR_REFUSES }, { set: [ACT3_S6_PAD_TRIED, true] }],
          },
        },
      ],
      else: [{ say: s6PadNoneText }],
    },
  },
];

const s6Door: ObjectDefSlice = {
  location: ACT3_S5_REACTOR_INTERFACE,
  name: 'S6 door',
  portable: false,
  // Head nouns only — `nounIds`/`resolveNounPhrase` (`engine/parser/
  // resolver.ts`) key off a phrase's LAST word alone (`toPhrase`,
  // `grammar.ts`), so a multi-word entry like "second door" is never
  // itself looked up; what actually makes "SECOND DOOR"/"STEEL DOOR"/
  // "END DOOR"/"PAD DOOR"/"S6 DOOR" resolve (distinctly from the
  // interlock, which shares bare "door") is the qualifying word
  // registered below as an `adjectives` entry, checked by
  // `hasAdjective`'s full-match filter. "admittance" is registered bare
  // so "NO ADMITTANCE" resolves at all.
  nouns: ['door', 'pad', 'keypad', 'reader', 'plate', 'strip', 'display', 'admittance'],
  adjectives: ['second', 'steel', 'end', 'pad', 's6', 'no'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: s6DoorExamine }] },
    { verbs: [OPEN, PUSH, PULL, V_RING], effects: [{ say: s6DoorPushText }] },
    { verbs: [PRY], effects: [{ say: s6DoorPryText }] },
    { verbs: [V_KNOCK], effects: [{ say: s6DoorKnockText }] },
    { verbs: [LISTEN], effects: [{ say: s6DoorListenText }] },
    // Gated `{ has: act2_nolan_badge }` per §9.8's own header — a route (b)
    // player who never met Nolan has no badge to try this with (§21.3's own
    // note); with no other handler matching, "BADGE DOOR" then falls to
    // this verb's own bare-safe `default`.
    { verbs: [V_ACT3_BADGE], when: { has: ACT2_NOLAN_BADGE }, effects: s6BadgeEffects },
    // `V_ACT3_TYPE_PAD` is bare (pattern `'V'`, no dobj at all) — an object
    // handler can never be reached for it (object dispatch requires a
    // resolved dobj); it is wired as a ROOM-level handler instead
    // (`s5ReactorInterface.ts`, the room shell), reusing `s6PadEffects`
    // (exported below).
  ],
};

// Badge refusal reached through the already-shipped badge object too (`USE
// BADGE`/`SHOW BADGE TO READER`) — mutated in place, same idiom
// `corridorB4.ts` already uses for reader B4's own badge handlers.
nolanBadge.handlers = [
  ...(nolanBadge.handlers ?? []),
  { verbs: [USE_VERB_ID], when: { at: ACT3_S5_REACTOR_INTERFACE }, effects: s6BadgeEffects },
  { verbs: [SHOW], withInstrument: [ACT3_S6_DOOR], when: { at: ACT3_S5_REACTOR_INTERFACE }, effects: s6BadgeEffects },
];

// "USE NOTEBOOK ON PAD" (§9.8) — dobj = the notebook, so this lives on the
// notebook object (`act2/objects/notebook.ts`), mutated in place the same
// way. `USE_VERB_ID` needs `'V dobj prep iobj'` for this phrase to parse at
// all — mutated in `act3/verbs.ts`, this task's own labelled block there.
ACT2_NOTEBOOK_OBJECTS[ACT2_NOTEBOOK]!.handlers = [
  ...(ACT2_NOTEBOOK_OBJECTS[ACT2_NOTEBOOK]!.handlers ?? []),
  { verbs: [USE_VERB_ID], withInstrument: [ACT3_S6_DOOR], when: { at: ACT3_S5_REACTOR_INTERFACE }, effects: s6PadEffects },
];

// "COMPARE AUDIT WITH GAUGES" (§9.4) — dobj = the audit, so this lives on
// `ACT2_CENSOR_OBJECTS[ACT2_REPLY_AUDIT]` (`act2/objects/censor.ts`),
// mutated in place the same way (rather than on `gauges` above, which only
// ever sees this as `withInstrument`, never as the resolved dobj).
ACT2_CENSOR_OBJECTS[ACT2_REPLY_AUDIT]!.handlers = [
  ...(ACT2_CENSOR_OBJECTS[ACT2_REPLY_AUDIT]!.handlers ?? []),
  { verbs: [V_FIT], withInstrument: [ACT3_GAUGES], when: { at: ACT3_S5_REACTOR_INTERFACE }, effects: compareAuditGaugesEffects },
];

// ---------------------------------------------------------------------------
// §9.9 — the wall clock.
// ---------------------------------------------------------------------------

const wallClockExamine =
  'Eight inches across, high on the wall over the gauges, in a plain steel bezel:\na white face, black hands, a sweep second hand, and no maker\'s name on it\nanywhere at all.\n\nIt is the only instrument in this room that is not measuring the building.';

const wallClock: ObjectDefSlice = {
  location: ACT3_S5_REACTOR_INTERFACE,
  name: 'wall clock',
  portable: false,
  nouns: ['clock', 'wall clock', 'face', 'hands', 'second hand', 'bezel', 'time'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: wallClockExamine }] },
    { verbs: [READ], effects: [{ script: { id: ACT3_READ_CLOCK_SCRIPT } }] },
  ],
};

// ---------------------------------------------------------------------------
// §9.10 — room-level senses hung on their own uncounted nouns: the bench
// (with the logbook clipped under it) and the left wall.
// ---------------------------------------------------------------------------

const searchBenchText =
  'A logbook clipped to the underside of the bench in a wire holder, ruled for\nreadings, with the last several pages ruled and not filled.\n\nThe pages before those are filled, in one hand, every morning, without a gap.';

const bench: ObjectDefSlice = {
  location: ACT3_S5_REACTOR_INTERFACE,
  name: 'bench',
  portable: false,
  nouns: ['bench'],
  handlers: [
    { verbs: [SEARCH, LOOK_UNDER], effects: [{ say: searchBenchText }] },
  ],
};

const readLogbookText =
  'Columns of the same three numbers, in pencil, morning after morning, going\nback further than the book has pages for.\n\nThey are the numbers on the wall. Every one of them. Down the whole page and\ndown the page before it, without a variation big enough to be worth the ink.\n\nThen the entries stop, and the ruling goes on.';

const logbook: ObjectDefSlice = {
  location: ACT3_S5_REACTOR_INTERFACE,
  name: 'logbook',
  portable: false,
  nouns: ['logbook', 'log book', 'log'],
  handlers: [{ verbs: [EXAMINE, READ], effects: [{ say: readLogbookText }] }],
};

const touchWallText =
  'Cool, painted, and entirely ordinary, and it stays entirely ordinary for as\nlong as you leave your hand on it, which is not very long.';

const touchWall: ObjectDefSlice = {
  location: ACT3_S5_REACTOR_INTERFACE,
  name: 'wall',
  portable: false,
  // Bare "wall" (shared with the gauge wall — genuinely two walls in this
  // room) clarifies; "LEFT WALL" resolves here via the `adjectives` entry
  // (same reasoning as the S6 door's own header note on this file).
  // v0.14.0: compounds only — the gauge wall lists the bare word, and a bare
  // "wall" in S5 is the gauges.
  nouns: ['left wall', 'end wall', 'block wall', 'concrete wall', 'left-hand wall'],
  adjectives: ['left'],
  handlers: [{ verbs: [TOUCH], effects: [{ say: touchWallText }] }],
};

// ---------------------------------------------------------------------------
// §10 — the interlock, and the game's first death.
// ---------------------------------------------------------------------------

const interlockExamine =
  'The shield door is a slab in a rebate, with a wheel in the middle of it and a\nlamp above the wheel, and the lamp is not lit.\n\nUnder the lamp, engraved into the steel and filled white:\n\n    DOOR MAY BE OPENED WHEN LAMP IS LIT\n\nBeside the lamp there is a small steel panel with three things on it: a\nkeyswitch, a green button and a red one. The keyswitch has two positions,\nmarked NORMAL and BYPASS, and a card tag on a wire hanging off it.\n\nThe key is in the switch. It is turned to BYPASS.';

const interlockExamineEffects: Effect[] = [{ say: interlockExamine }, { set: [ACT3_BYPASS_SEEN, true] }];

// §10.2 — the three beats, and §10.3's death, as a script (kind:'beat'
// events, per §0's own convention: only fenced blocks under a "Beat n"
// heading render that way — the death paragraph itself is not under one,
// so it renders as an ordinary `say`).
const BEAT_1 =
  'The wheel turns. It turns easily, and it goes on turning for longer than you\nexpect, the way a thing turns when it is undoing eight bolts at once instead\nof one.\n\nThe lamp above it does not light. Nothing on the panel objects.';

const BEAT_2 =
  'The door comes off its seal with a sound like a jar being opened, and swings,\nand behind it there is a short gallery with a handrail down one side and a\nwall of the same concrete at the end of it.\n\nThere is warm dry air, and light, and nothing else. No machinery. No noise. No\nglow, and no sign, and nothing anywhere that a reasonable person would step\nback from.\n\nIt is the least alarming room you have been in since the diner.';

const BEAT_3 =
  'Your mouth fills with the taste of metal. It is not a strong taste and it is\nnot unpleasant and it is gone before you have finished deciding what it was.\n\nYou pull the door to behind you, because there is nothing in there to look at.';

export const INTERLOCK_DEATH_TEXT =
  'An interlock is not a lock. It is a machine\'s flat refusal to allow two things\nto be true at the same time — this door open, and that side running — and it\nis fitted because the thing it prevents does not hurt at the time.\n\nSomebody turned this one off, and hung a tag on it, and did not come back.\n\nYou feel entirely well. You are going to go on feeling entirely well for\nseveral hours yet. The case ends here anyway, and it ends because a card tag\nwith nothing written on it was allowed to stand in for a machine.';

export const INTERLOCK_BEATS = [BEAT_1, BEAT_2, BEAT_3];

// §10.5 — the shield door with the keyswitch at NORMAL.
const interlockNormalText =
  'The wheel turns a quarter of a turn and stops against something that is not\ngoing to be argued with, and the lamp above it stays out.\n\nSomewhere inside the door a bolt is across, and it is across because a machine\non the other side of that wall is running and has been told that this matters\nmore than your afternoon does.';

const interlockDoorEffects: Effect[] = [
  {
    if: {
      when: { flag: ACT3_INTERLOCK_NORMAL },
      then: [{ say: interlockNormalText }],
      else: [{ script: { id: ACT3_INTERLOCK_DEATH_SCRIPT } }],
    },
  },
];

const interlock: ObjectDefSlice = {
  location: ACT3_S5_REACTOR_INTERFACE,
  name: 'interlock',
  portable: false,
  // "lever" added beyond the doc's own §10 noun list, for "PULL LEVER"
  // (§10.2's header) — see this file's own header gap note. Head nouns
  // only, per the S6 door's own header note above on `adjectives`: "SHIELD
  // DOOR"/"LEFT DOOR" resolve via the qualifying words registered below,
  // distinctly from the S6 door (which shares bare "door").
  nouns: ['interlock', 'door', 'wheel', 'bypass', 'lever', 'legend'],
  adjectives: ['shield', 'left'],
  handlers: [
    { verbs: [EXAMINE], effects: interlockExamineEffects },
    { verbs: [OPEN, TURN, PULL], effects: interlockDoorEffects },
  ],
};

// §10.1 sub-parts: the tag, the lamp, the keyswitch, the buttons.
const interlockTagText =
  'A card tag on a wire, ruled for a name, a date and a reason, and rubbed\nfeatureless by however many sleeves have gone past it since.\n\nTags like this are how everybody knows a bypass is temporary.\n\nThis one has been temporary for a while.';

const interlockTag: ObjectDefSlice = {
  location: ACT3_S5_REACTOR_INTERFACE,
  name: 'tag',
  portable: false,
  nouns: ['tag', 'card tag'],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: interlockTagText }] }],
};

const interlockLampText =
  'A red lens in a chrome ring, cold, with the filament visible behind it and\nunlit, which is the lamp doing its job: the lamp is not decoration, it is the\nsentence.';

const interlockLamp: ObjectDefSlice = {
  location: ACT3_S5_REACTOR_INTERFACE,
  name: 'lamp',
  portable: false,
  // Bare "lamp" IS registered (needed as the head noun so "RED LAMP"
  // resolves at all — `resolveNounPhrase` keys off the phrase's last word;
  // see the S6 door's own header note on this). "LAMP" alone still prefers
  // the held `act3_headlamp` over this one via the resolver's own
  // held-tie-break (`preferHeld`, `parser/resolver.ts`) — §21.2's ruling
  // holds in effect even though both objects share the bare noun.
  nouns: ['lamp', 'lens', 'indicator'],
  adjectives: ['red'],
  handlers: [{ verbs: [EXAMINE], effects: [{ say: interlockLampText }] }],
};

const interlockKeyswitchText =
  'A flat barrel key with a rubber fob, in a switch, turned as far as it goes and\nleft there.\n\nThe polish on the fob says it has been turned back and forth a great many\ntimes by somebody who did not have to think about it.';

const turnToNormalText =
  'It comes round to NORMAL with a click you feel more than hear, and the lamp\nabove the wheel stays exactly as unlit as it was.\n\nWhich is the whole of what the lamp had to tell you: with the bypass out, this\ndoor is not going to open at all, and with the bypass in, it is.';

// Exported: the room shell wires this onto its own room-level handler for
// `V_ACT3_TURN_TO_NORMAL` ("TURN KEYSWITCH TO NORMAL", bare — see that
// verb's own `ids.ts` doc comment for why it can't be an object handler).
export const turnKeyswitchEffects: Effect[] = [{ say: turnToNormalText }, { set: [ACT3_INTERLOCK_NORMAL, true] }];

const interlockKeyswitch: ObjectDefSlice = {
  location: ACT3_S5_REACTOR_INTERFACE,
  name: 'keyswitch',
  portable: false,
  // "keyswitch"/"switch"/"key" — never "keyring" — so `TURN KEYSWITCH` never
  // clarifies against the held keyring even though bare "key" genuinely is
  // ambiguous (§21.2's own recommendation).
  nouns: ['keyswitch', 'switch', 'key'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: interlockKeyswitchText }] },
    { verbs: [TURN, TAKE], effects: turnKeyswitchEffects },
  ],
};

const interlockButtonsText =
  'The green lights while your thumb is on it and goes out when your thumb comes\noff. The red does not light at all.\n\nNeither of them does anything you can hear, which on a panel of this kind\nmeans one of them is doing something you cannot.';

const interlockButtons: ObjectDefSlice = {
  location: ACT3_S5_REACTOR_INTERFACE,
  name: 'buttons',
  portable: false,
  nouns: ['button', 'buttons'],
  adjectives: ['green', 'red'],
  handlers: [{ verbs: [PUSH, V_RING], effects: [{ say: interlockButtonsText }] }],
};

export const ACT3_S5_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT3_GAUGES]: gauges,
  [ACT3_DEMAND_DIAL]: demandDial,
  [ACT3_CHASE_BOTTOM]: chaseBottom,
  [ACT3_S6_DOOR]: s6Door,
  [ACT3_WALL_CLOCK]: wallClock,
  [ACT3_S5_BENCH]: bench,
  [ACT3_LOGBOOK]: logbook,
  [ACT3_S5_TOUCH_WALL]: touchWall,
  [ACT3_INTERLOCK]: interlock,
  [ACT3_INTERLOCK_TAG]: interlockTag,
  [ACT3_INTERLOCK_LAMP]: interlockLamp,
  [ACT3_INTERLOCK_KEYSWITCH]: interlockKeyswitch,
  [ACT3_INTERLOCK_BUTTONS]: interlockButtons,
};

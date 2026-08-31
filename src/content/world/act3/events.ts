// Act III, Stage D5, task H — the Custodian's rounds, the four spotted
// events, the alarm's automatic reset, and Dad's S5 push
// (`docs/superpowers/specs/2026-09-13-stage-d5-prose.md` §18, §19.1, §20.3,
// §39). The schedule itself is `act2/custodian.ts`'s own edit; this file
// holds only the `EventDef`s (and the two small scripts the alarm's reset
// needs) — registered into `world.events`/`world.scripts` by
// `act3/index.ts`'s shared maps, this task's own labelled block.
//
// Every response string below is transcribed verbatim from the prose doc
// (hard rule 5). Register 87 holds: the Custodian never speaks — none of
// these `say` effects is a line of his; the three "beats" per spotted event
// are all narrator prose about what he is doing and what the player does
// leaving.
//
// THE ALARM'S RESET TIMER — not in the prose doc. §20.3's own header
// leaves the mechanism to "builder's call, documented in the wiring notes"
// (Stage D plan §2 D5). The `Cond` DSL has no flag-vs-flag arithmetic (the
// closest primitive, `onOrAfterDay`, only compares the live clock's `day`
// to a stored due day) and effects can't compute a value at all (`set`
// only ever takes a literal) — so capturing "30 minutes from now" at all
// needs the `{ script }` escape hatch (`effects.ts`'s own doc comment:
// "a script that wants ... calls render/apply"). `act3AlarmPull` stores the
// absolute minute (`clock.day * 1440 + clock.minute`) 30 minutes past the
// pull in `ACT3_ALARM_RESET_DUE` (`ids.ts`, this task's own flag);
// `act3AlarmReset` — the reset `EventDef`'s own effect, `once: false`, so it
// re-checks every tick the alarm is still pulled and the player is in an
// "S-room" (§20.3's own phrase: S1, S5, S6 Bay, S6 Hub) — compares the live
// total against that due minute and only then clears the flag and prints
// the beat. Total minutes only ever increase (`clock.day` never goes
// backwards), so the comparison is safe across a midnight wrap without
// needing to know which calendar day the pull happened on.

import { flag } from '../../../engine/cond';
import { apply } from '../../../engine/effects';
import type { EventDef, GameState, ScriptFn, WorldDef } from '../../../engine/world';
import { ACT2_CUSTODIAN, ACT2_DAD } from '../act2/ids';
import {
  ACT3_ALARM_PULLED,
  ACT3_ALARM_RESET_DUE,
  ACT3_ALARM_RESET_SCRIPT,
  ACT3_CLUE_ROUNDS,
  ACT3_DAD_HEARD_HIM,
  ACT3_ALERTNESS,
  ACT3_COOLING_PLANT,
  ACT3_PIPE_CHASE,
  ACT3_S1_MECHANICAL_GALLERY,
  ACT3_S5_REACTOR_INTERFACE,
  ACT3_S6_ARCHIVE_HUB,
  ACT3_S6_MAINTENANCE_BAY,
  ACT3_WEARING_COVERALLS,
  EVENT_ACT3_ALARM_RESET,
  EVENT_ACT3_DAD_PUSH_S5,
  EVENT_ACT3_EV_PASSED,
  EVENT_ACT3_EV_SPOTTED_BAY,
  EVENT_ACT3_EV_SPOTTED_CHASE,
  EVENT_ACT3_EV_SPOTTED_HUB,
  EVENT_ACT3_EV_SPOTTED_S5,
} from './ids';
import { ACT5_RECONCILIATION_RUNNING } from '../act5/ids';

// ---------------------------------------------------------------------------
// §18.1-18.4 — the four spotted events. `when`, per §18's own header:
// `{ all: [{ at: room }, { npcAt: [act2_custodian, room] }, { not: { flag:
// act3_wearing_coveralls } }] }`. Effects, in order: three `say` beats, then
// `{ goto: <the room above> }`, then the alertness `if`/`inc` capped at 2,
// then `{ grantClue: act3_clue_rounds }` — never a death; `goto` moves the
// player before the next tick, so no event can re-fire in place (§18).
// ---------------------------------------------------------------------------

const ALERTNESS_STEP: EventDef['effects'] = [{ if: { when: { flag: ACT3_ALERTNESS, atLeast: 2 }, then: [], else: [{ inc: ACT3_ALERTNESS }] } }, { grantClue: ACT3_CLUE_ROUNDS }];

const BAY_BEAT_1 =
  'There is a man in the room.\n\nHe is halfway down the second row with his back to you, doing something to a chair with both hands, and he has not heard you, because there has not yet been anything about you to hear.';
const BAY_BEAT_2 =
  'Grey coveralls, the clean kind.\n\nHe finishes what he is doing to the chair. Then he straightens, and turns round, and looks across a room full of sleeping people at the one person in it who is standing up.\n\nHe does not say anything. He has never said anything.';
const BAY_BEAT_3 = 'You are on the steps before you have decided to be, and he has not moved, and that is worse than if he had.';

export const ACT3_EV_SPOTTED_BAY_EVENT: EventDef = {
  id: EVENT_ACT3_EV_SPOTTED_BAY,
  when: { all: [{ at: ACT3_S6_MAINTENANCE_BAY }, { npcAt: [ACT2_CUSTODIAN, ACT3_S6_MAINTENANCE_BAY] }, { not: { flag: ACT3_WEARING_COVERALLS } }] },
  once: false,
  effects: [{ say: BAY_BEAT_1 }, { say: BAY_BEAT_2 }, { say: BAY_BEAT_3 }, { goto: ACT3_PIPE_CHASE }, ...ALERTNESS_STEP],
};

const HUB_BEAT_1 = 'He is at the terminal.\n\nNot using it. Standing beside it with a cloth, going along the top edge of the screen bezel, where dust sits.';
const HUB_BEAT_2 =
  'He folds the cloth once and puts it in the breast pocket of the coveralls, and turns his head toward you, and takes his time about it — the way a man does when he has already heard everything he needed to.';
const HUB_BEAT_3 = 'You go back through the door into the rows, and the last of him you see is the cloth coming out of the pocket again.';

export const ACT3_EV_SPOTTED_HUB_EVENT: EventDef = {
  id: EVENT_ACT3_EV_SPOTTED_HUB,
  when: { all: [{ at: ACT3_S6_ARCHIVE_HUB }, { npcAt: [ACT2_CUSTODIAN, ACT3_S6_ARCHIVE_HUB] }, { not: { flag: ACT3_WEARING_COVERALLS } }, { not: { flag: ACT5_RECONCILIATION_RUNNING } }] },
  once: false,
  effects: [{ say: HUB_BEAT_1 }, { say: HUB_BEAT_2 }, { say: HUB_BEAT_3 }, { goto: ACT3_S6_MAINTENANCE_BAY }, ...ALERTNESS_STEP],
};

const S5_BEAT_1 = 'The gauge wall has a man in front of it, going along the bezels one at a time with a torch he does not need.';
const S5_BEAT_2 =
  'Grey coveralls. He gets to the end of the rank, writes nothing down, puts the torch in a pocket, and turns round to where you are standing.\n\nNothing in his face is doing anything. Nothing in his face was doing anything before, either.';
const S5_BEAT_3 = 'The stair is behind you and you take it, and the light off the gauges goes out of the doorway somewhere around the fourth step.';

export const ACT3_EV_SPOTTED_S5_EVENT: EventDef = {
  id: EVENT_ACT3_EV_SPOTTED_S5,
  when: { all: [{ at: ACT3_S5_REACTOR_INTERFACE }, { npcAt: [ACT2_CUSTODIAN, ACT3_S5_REACTOR_INTERFACE] }, { not: { flag: ACT3_WEARING_COVERALLS } }] },
  once: false,
  effects: [{ say: S5_BEAT_1 }, { say: S5_BEAT_2 }, { say: S5_BEAT_3 }, { goto: ACT3_S1_MECHANICAL_GALLERY }, ...ALERTNESS_STEP],
};

const CHASE_BEAT_1 = 'There is somebody on the ladder below you.\n\nNot climbing. Standing on it, at about the level of the Sublevel 5 opening, with one arm through a rung and both hands busy.';
const CHASE_BEAT_2 = 'He is putting grease on the bolts of the ladder string, one bolt at a time, out of a tin hooked over a rung.\n\nHe looks up the shaft into your light without putting a hand over his eyes.';
const CHASE_BEAT_3 = 'You go up. Ten minutes of ladder, and for the whole of it there is nobody coming after you, and you keep checking.';

export const ACT3_EV_SPOTTED_CHASE_EVENT: EventDef = {
  id: EVENT_ACT3_EV_SPOTTED_CHASE,
  when: { all: [{ at: ACT3_PIPE_CHASE }, { npcAt: [ACT2_CUSTODIAN, ACT3_PIPE_CHASE] }, { not: { flag: ACT3_WEARING_COVERALLS } }] },
  once: false,
  effects: [{ say: CHASE_BEAT_1 }, { say: CHASE_BEAT_2 }, { say: CHASE_BEAT_3 }, { goto: ACT3_COOLING_PLANT }, ...ALERTNESS_STEP],
};

// ---------------------------------------------------------------------------
// §18.6 — passing him in the coveralls, `once: true`, proposed and wired
// per the status line ("recommend wiring it," §36 q5). Any of the four
// rooms; one beat; no `goto`, no clue, no flag.
// ---------------------------------------------------------------------------

const PASSED_TEXT = 'He is in the room, and he goes on being in the room.\n\nAt about six feet he nods, in the way of one man passing another man on a floor they both work on, and goes back to the chair he is doing.';

export const ACT3_EV_PASSED_EVENT: EventDef = {
  id: EVENT_ACT3_EV_PASSED,
  when: {
    all: [
      {
        any: [
          { all: [{ at: ACT3_S6_MAINTENANCE_BAY }, { npcAt: [ACT2_CUSTODIAN, ACT3_S6_MAINTENANCE_BAY] }] },
          { all: [{ at: ACT3_S6_ARCHIVE_HUB }, { npcAt: [ACT2_CUSTODIAN, ACT3_S6_ARCHIVE_HUB] }] },
          { all: [{ at: ACT3_S5_REACTOR_INTERFACE }, { npcAt: [ACT2_CUSTODIAN, ACT3_S5_REACTOR_INTERFACE] }] },
          { all: [{ at: ACT3_PIPE_CHASE }, { npcAt: [ACT2_CUSTODIAN, ACT3_PIPE_CHASE] }] },
        ],
      },
      { flag: ACT3_WEARING_COVERALLS },
      // E3 §18 — "the coveralls do not help": once the reconciliation is
      // running, no passing beat either; act5_ev_reacquire owns the floor.
      { not: { flag: ACT5_RECONCILIATION_RUNNING } },
    ],
  },
  once: true,
  effects: [{ say: PASSED_TEXT }],
};

// ---------------------------------------------------------------------------
// §19.1 — the push. `once: true`, first entry to S5 with Dad running (the
// same `{ at: room }, { npcAt: [npc, room] }` idiom the spotted events use
// — Dad's only pinned position is `following` (the rig), so this is true
// exactly when the rig is carried into S5, per `resolve.ts`'s
// `npcOverlayPosition`). Sets `act3_dad_heard_him`.
// ---------------------------------------------------------------------------

const DAD_PUSH_TEXT =
  '"Stop."\n\nHe has never said that before. He says it, and then immediately, in the ordinary voice: "Sorry. Stop a second and let me listen to this."\n\nSpeaker hiss, for about as long as it takes to be uncomfortable.\n\n"Right. There is somebody down here besides us, and he is not being quiet about it, which means he does not think there is anybody to be quiet for."\n\n"Kiddo. Ask me where he is. Any time you like. It is the one thing I am actually good for down here and I would like very much to be good for something."';

export const ACT3_DAD_PUSH_S5_EVENT: EventDef = {
  id: EVENT_ACT3_DAD_PUSH_S5,
  when: { all: [{ at: ACT3_S5_REACTOR_INTERFACE }, { npcAt: [ACT2_DAD, ACT3_S5_REACTOR_INTERFACE] }] },
  once: true,
  effects: [{ say: DAD_PUSH_TEXT }, { set: [ACT3_DAD_HEARD_HIM, true] }],
};

// ---------------------------------------------------------------------------
// §20.3 — the alarm's automatic reset. See this file's own header for why
// the mechanism needs two scripts rather than a declarative `Cond`.
// ---------------------------------------------------------------------------

const ALARM_RESET_TEXT = 'Above you, at the top of the building, the note comes back up a tone.\n\nWhatever he did about it took him about as long as it takes to do it.';

function totalMinutes(state: GameState): number {
  return state.clock.day * 1440 + state.clock.minute;
}

/** `objects/coolingPlant.ts`'s alarm handler calls this via `{ script: { id: ACT3_ALARM_PULL_SCRIPT } }` — see that file. */
export const act3AlarmPull: ScriptFn = (world: WorldDef, state: GameState) => {
  const applied = apply(
    world,
    state,
    [
      {
        say: 'The glass goes on the second tap, which is one more than you expected, and the handle comes down four inches under its own weight.\n\nNothing rings. What happens instead is that one of the two chillers stops — not quickly, over about a minute, the way a thing that size has to — and the note the whole building has been making since you walked into it goes down a tone and stays there.\n\nSomewhere a long way below you, a door that has been shut all night is opened by somebody who has to come and see about it.',
      },
      { set: [ACT3_ALARM_PULLED, true] },
      { set: [ACT3_ALARM_RESET_DUE, totalMinutes(state) + 30] },
    ],
    { path: 'script.act3_alarm_pull' },
  );
  return applied;
};

export const ACT3_ALARM_RESET_EVENT: EventDef = {
  id: EVENT_ACT3_ALARM_RESET,
  when: {
    all: [
      { flag: ACT3_ALARM_PULLED },
      {
        any: [
          { at: ACT3_S1_MECHANICAL_GALLERY },
          { at: ACT3_S5_REACTOR_INTERFACE },
          { at: ACT3_S6_MAINTENANCE_BAY },
          { at: ACT3_S6_ARCHIVE_HUB },
        ],
      },
    ],
  },
  once: false,
  effects: [{ script: { id: ACT3_ALARM_RESET_SCRIPT } }],
};

/** `index.ts`'s `scripts:` map registers this under `ACT3_ALARM_RESET_SCRIPT` (`ids.ts`). */
export const act3AlarmReset: ScriptFn = (world: WorldDef, state: GameState) => {
  const due = flag(world, state, ACT3_ALARM_RESET_DUE);
  if (typeof due !== 'number' || totalMinutes(state) < due) return { state, events: [] };
  return apply(world, state, [{ say: ALARM_RESET_TEXT }, { set: [ACT3_ALARM_PULLED, false] }], { path: 'script.act3_alarm_reset' });
};

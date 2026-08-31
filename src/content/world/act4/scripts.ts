// Act IV, wave E0, task I — the town before the visit
// (`docs/superpowers/specs/2026-09-17-stage-e0-prose.md` §3-§9, §31; Stage E
// plan §2 E0). Two scripts:
//
// `act4SetVisitDay` — `act4_set_visit_day` (already declared,
// `ACT4_SET_VISIT_DAY_SCRIPT`, `ids.ts`). Writes the two numeric due-day
// flags `act4_ev_start` needs: the visit is the day after the announcement
// (plan §5 Q3: "`act4_visit_day = day + 1` at `act4_started`"), and the
// crews stay two days past that ("the crews stay two days" — same ruling;
// the prose doc's own dressing table: "Two days after `act4_visit_day` the
// crews are gone... `act4_visit_over_day = act4_visit_day + 2`"). No
// player-visible text (§31.3's own "a builder will look for one and not
// find it").
//
// `act4CrewsVisibility` — `act4_crews_visibility` (`ACT4_CREWS_VISIBILITY_
// SCRIPT`, `ids.ts`, this task's own). See that id's own doc comment: the
// engine's `hidden` overlay only ever clears via the one-way `{ reveal }`
// effect, so making the crews go hidden again (over_day; night, before the
// day's work starts) needs this script, ticked every turn the player is on
// Main Street by `EVENT_ACT4_EV_CREWS_VISIBLE` (`events.ts`) — the same
// `{ script }` escape hatch `act3/events.ts`'s own header documents for a
// Cond the declarative DSL can't express as a static `hidden` value.

import { evaluate } from '../../../engine/cond';
import type { Cond } from '../../../engine/cond';
import type { Effect } from '../../../engine/effects';
import { apply } from '../../../engine/effects';
import type { GameState, ObjectOverlay, ScriptFn, WorldDef } from '../../../engine/world';
import { ACT4_CREWS, ACT4_VISIT_ANNOUNCED, ACT4_VISIT_DAY, ACT4_VISIT_OVER_DAY } from './ids';

export const act4SetVisitDay: ScriptFn = (world: WorldDef, state: GameState) => {
  const visitDay = state.clock.day + 1;
  const overDay = visitDay + 2;
  return apply(world, state, [{ set: [ACT4_VISIT_DAY, visitDay] }, { set: [ACT4_VISIT_OVER_DAY, overDay] }], { path: 'script.act4_set_visit_day' });
};

/**
 * The crews are on the street only once the visit is announced, only
 * before the crews' own departure day, and only while the day's work is
 * actually under way (morning/afternoon — §3.3's evening/night dressing
 * is parked equipment and no working men, §4/§31.2's own "MEN must not
 * resolve when the crews are hidden" ruling).
 */
const CREWS_VISIBLE_WHEN: Cond = {
  all: [{ flag: ACT4_VISIT_ANNOUNCED }, { not: { onOrAfterDay: ACT4_VISIT_OVER_DAY } }, { any: [{ clockPhase: 'morning' }, { clockPhase: 'afternoon' }] }],
};

export const act4CrewsVisibility: ScriptFn = (world: WorldDef, state: GameState) => {
  const hidden = !evaluate(world, state, CREWS_VISIBLE_WHEN);
  const overlay: ObjectOverlay = { ...(state.objects[ACT4_CREWS] ?? {}), hidden };
  const nextState: GameState = { ...state, objects: { ...state.objects, [ACT4_CREWS]: overlay } };
  return { state: nextState, events: [] };
};

// --- E1 task L ---
// P22's hand-off (`docs/superpowers/specs/2026-09-18-stage-e1-prose.md`
// §13, §16). `act4HandLetter` — `act4_hand_letter` (already declared,
// `ACT4_HAND_LETTER_SCRIPT`, `ids.ts`) — is the one script behind BOTH
// `GIVE LETTER TO PEARL` (§14) and `GIVE LETTER TO WHITLOCK` (§15): "same
// script, same verdict handling, different hand" (§15's own header). Reads
// `act2_letter_out`'s `message`/`folded` props (same `prop()` idiom
// `act2/objects/censor.ts`'s own `act2PostLetter` already uses), calls the
// pure `familyVerdict` (`act2/censor.ts`, untouched `censorVerdict`
// alongside it), and applies §16's table: `'family'` sets `act4_message_
// delivered` and grants the clue; `'plain'`/`'rewritten'` both just set the
// due day. `act4_message_verdict` is set to the real value in every branch
// (§16's own column). The letter always moves to `nowhere` (§16: "letter →
// nowhere", every row). No text of its own — §14/§15's own `response`
// fields (via `giveResponses`) are what the player sees; this script is
// pure effects, run after that `say` (`npc.ts`'s `respondToGive`: `[{ say:
// entry.response }, ...(entry.effects ?? [])]`), matching §37.3's own
// ordering note.
import { prop } from '../../../engine/resolve';
import { familyVerdict } from '../act2/censor';
import { ACT2_LETTER_OUT } from '../act2/ids';
import { ACT4_CLUE_MESSAGE_THROUGH, ACT4_HAND_LETTER_SCRIPT, ACT4_MESSAGE_DELIVERED, ACT4_MESSAGE_VERDICT, ACT4_OFFICE_REPLY_DUE } from './ids';

export const act4HandLetter: ScriptFn = (world: WorldDef, state: GameState) => {
  const message = String(prop(world, state, ACT2_LETTER_OUT, 'message') ?? '');
  const folded = Boolean(prop(world, state, ACT2_LETTER_OUT, 'folded') ?? false);
  const verdict = familyVerdict(message, folded);

  const effects: Effect[] = [{ move: [ACT2_LETTER_OUT, 'nowhere'] }, { set: [ACT4_MESSAGE_VERDICT, verdict] }];
  if (verdict === 'family') {
    effects.push({ set: [ACT4_MESSAGE_DELIVERED, true] }, { grantClue: ACT4_CLUE_MESSAGE_THROUGH });
  } else {
    effects.push({ set: [ACT4_OFFICE_REPLY_DUE, state.clock.day + 1] });
  }
  return apply(world, state, effects, { path: `script.${ACT4_HAND_LETTER_SCRIPT}` });
};

// --- E2 task P ---
// The second frame's traversal (`docs/superpowers/specs/2026-09-19-stage-
// e2-prose.md` §25). Both scripts run the identical shape: say the
// first-or-later text, `advanceClock: 10`, then `goto`. Text transcribed
// exactly (hard rule 5).
//
// `act4EnterHab` — called from task O's `act4_gate_hab` object's own `IN`
// handler (`{ script: { id: ACT4_ENTER_HAB_SCRIPT } }`, O's brief: "the
// gates' IN scripts do the traversal"). "First crossing" reuses the room's
// own arrival signal for free: `{ not: { visited: ACT4_HAB_GALLEY } }` is
// true up to the moment this script's own `goto` actually lands the player
// there for the first time — checked BEFORE that `goto`, inside `apply`'s
// running state, so it reads correctly on both the first call and every
// one after.
//
// `act4LeaveHab` — called from this task's own `act4_airlock_door` object
// (`./objects/hab.ts`). Leaving has no equivalent free signal (the
// destination, `act3_s6_archive_hub`, was visited long before Act IV's hab
// thread exists), so `act4_hab_left_once` (`ids.ts`, this task's own) is the
// first/later split, set the first time through.
// `evaluate` already imported at this file's own top (E0 task I's own use).
import { ACT3_S6_ARCHIVE_HUB } from '../act3/ids';
import { ACT4_HAB_GALLEY, ACT4_HAB_LEFT_ONCE, ACT4_ENTER_HAB_SCRIPT, ACT4_LEAVE_HAB_SCRIPT } from './ids';

const ENTER_HAB_FIRST_TEXT =
  'The dark frame is dark until your hand is in it, and then your hand is in a white-painted steel box the size of a shower with a lamp in the ceiling and a grab rail down both sides.\n\nBehind you, where the archive hub was, there is now an oval door with a bar across it and a gasket round it and a small round window in it, and through the window there is grey cord carpet and a bench.\n\nOn a rack: suits, hanging by the shoulders, in a line by size. You take the second-smallest and get into it the way the laminated card on the wall says to, which is legs, arms, seal at the waist, gloves, helmet, and check the seal at the waist again because everybody forgets the waist.\n\nNothing about the suit fits. It is a size, and you are a person, and it is adequate.\n\nThen the card runs out of instructions and there is a green switch.\n\nThe pump takes a long time. It is not dramatic; it is a pump, and it goes on being a pump, and the noise of it drops away in stages as there gets to be less and less air to carry it. The last stage is the one that means something: your own breathing, close, inside a helmet, with nothing else in the world in it.\n\nThe far door unseals. The gauge over it has been sitting on the same figure for a while and the light beside it goes from amber to green.';

const ENTER_HAB_LATER_TEXT =
  'Suit off the rack, legs, arms, waist, gloves, helmet, waist again. Green switch.\n\nThe pump, and the noise going down in stages, and at the bottom of it your own breathing.\n\nGreen light. Ten minutes of your life that you cannot do anything else with, and you will do them again on the way back.';

export const act4EnterHab: ScriptFn = (world: WorldDef, state: GameState) => {
  const first = evaluate(world, state, { not: { visited: ACT4_HAB_GALLEY } });
  return apply(
    world,
    state,
    [{ say: first ? ENTER_HAB_FIRST_TEXT : ENTER_HAB_LATER_TEXT }, { advanceClock: 10 }, { goto: ACT4_HAB_GALLEY }],
    { path: `script.${ACT4_ENTER_HAB_SCRIPT}` },
  );
};

const LEAVE_HAB_FIRST_TEXT =
  'The lock the other way is worse, because coming in you can hear it happening: nothing, then a thin whistle somewhere above the helmet, then the whistle getting a body to it, and then air, with the pump grinding under it, and then the suit going soft against you all at once as the pressures come level.\n\nYou get the helmet off and the cold that comes in at you is a room\'s cold and not a planet\'s, and it smells of the inside of a suit rack.\n\nThe oval door swings and there is grey cord carpet on the other side of it and a steel bench with a terminal on it, and a well at the end of the room with a door at the bottom.\n\nYou hang the suit up by the shoulders in the space it came out of, which is the second space from the small end, and the rack looks exactly as it did before you touched it.';

const LEAVE_HAB_LATER_TEXT =
  'The whistle, the air coming up, the suit going soft. Helmet off. Ten minutes.\n\nThe suit goes back second from the small end, and the rack is the way it was.';

export const act4LeaveHab: ScriptFn = (world: WorldDef, state: GameState) => {
  const first = evaluate(world, state, { not: { flag: ACT4_HAB_LEFT_ONCE } });
  const effects: Effect[] = [{ say: first ? LEAVE_HAB_FIRST_TEXT : LEAVE_HAB_LATER_TEXT }, { advanceClock: 10 }, { goto: ACT3_S6_ARCHIVE_HUB }];
  if (first) effects.push({ set: [ACT4_HAB_LEFT_ONCE, true] });
  return apply(world, state, effects, { path: `script.${ACT4_LEAVE_HAB_SCRIPT}` });
};

// --- E2 task Q ---
// The darkroom scene — `act4_develop` (`docs/superpowers/specs/2026-09-19-
// stage-e2-prose.md` §44). Prose transcribed exactly (hard rule 5).
// `advanceClock: 60` per canister developed (§56.3: "each costing its own
// hour" — a player developing both spends two).
//
// One registered script id, called by each canister's own DEVELOP handler
// (`objects/darkroom.ts`, on `act4_sissy_film` and `act2_film_canister`
// respectively) with an explicit `args.which` — the task's own §43
// enumeration (three door handlers: pry, unlock-with-key, the open-state
// examine) names no fourth "ENTER DARKROOM" handler on the door, so this
// script is never called without `args.which`; DEVELOP FILM's own dobj
// resolution is the sole trigger for the scene, and a player holding both
// canisters gets the parser's own native ambiguity clarify on "film"
// (§56.2's own collision row) rather than a bespoke line here. Flagged in
// this task's report: confirm whether "ENTER DARKROOM" (§44's own header)
// needs a fourth handler, or whether DEVELOP FILM alone satisfies it.
import { ACT2_FILM_CANISTER } from '../act2/ids';
import {
  ACT4_DEVELOP_SCRIPT,
  ACT4_JULES_FILM_DEVELOPED,
  ACT4_PRINT_LAST_DAY,
  ACT4_PRINT_SKY,
  ACT4_SISSY_FILM,
  ACT4_SISSY_FILM_DEVELOPED,
} from './ids';

const SISSY_DEVELOP_TEXT =
  'Behind the curtain: a room the size of a pantry with a stone sink, a bench, an enlarger under a dust cover, and a shelf of brown glass bottles with handwritten labels, all of them in the same hand and none of them recent.\n\nYou put the red bulb on. The room turns into a photograph of itself.\n\nThe chemistry is old and you cut it long to allow for that. The rest of it is what it has always been: get the film onto the spiral in the dark by feel, cap the tank, and then stand in a cellar under a county library agitating a plastic drum for a length of time you have to keep in your head, because there is a clock on the wall in here and there is no light to read it by.\n\nWash. Fix. Wash again, longer than anybody wants to. And then the tank comes open and there is a strip of wet negative hanging off your fingers with sky on it, and you put the light on to look at it properly and the wet holds the light in a line down the whole length of the strip.\n\nThe enlarger is not going to take an hour of your life it has not already had. The paper on the shelf is older than the chemistry and it fogs at the edges, and in the middle of it, when it comes up in the tray, there is a sky.\n\nYou wash it and stand it in the rack and let it go on being a sky for a while.';

const JULES_DEVELOP_TEXT =
  'The second tank goes the same way as the first, except that this film has been in a tin in a box under a floor at the back of a gift shop for weeks and you cut it longer still and expect to lose it.\n\nYou do not lose it.\n\nIt comes up out of the fix as a kitchen.';

export const act4Develop: ScriptFn = (world: WorldDef, state: GameState, args) => {
  const which = args?.['which'];

  if (which === 'sissy') {
    return apply(
      world,
      state,
      [
        { say: SISSY_DEVELOP_TEXT },
        { advanceClock: 60 },
        { move: [ACT4_SISSY_FILM, 'nowhere'] },
        { move: [ACT4_PRINT_SKY, 'inventory'] },
        { set: [ACT4_SISSY_FILM_DEVELOPED, true] },
      ],
      { path: `script.${ACT4_DEVELOP_SCRIPT}.sissy` },
    );
  }

  return apply(
    world,
    state,
    [
      { say: JULES_DEVELOP_TEXT },
      { advanceClock: 60 },
      { move: [ACT2_FILM_CANISTER, 'nowhere'] },
      { move: [ACT4_PRINT_LAST_DAY, 'inventory'] },
      { set: [ACT4_JULES_FILM_DEVELOPED, true] },
    ],
    { path: `script.${ACT4_DEVELOP_SCRIPT}.jules` },
  );
};

// --- E2 task O ---
// The threshold script and the phrase prompt (`docs/superpowers/specs/2026-
// 09-19-stage-e2-prose.md` §4, §21.2). `act4EnterEscape` counts
// `FAMILY_MEMORY_IDS` held (Stage E plan §4.0's own list: `[act2_mem_m2_*,
// act1_mem_m3_*, act2_mem_m6, act2_mem_m12, act2_mem_m13, act4_mem_m11]`) —
// each of M2/M3's three mutually-exclusive variants counts as one fragment
// (at most one of each trio is ever held), same "a script may count" idiom
// the plan's own note sanctions (no `memoryCount` Cond arm exists, and 35
// `any` combinations is not a schema). `>= 2` admits. `GATE_ENTER_TEXT`
// (`act3/objects/s6ArchiveHub.ts`, shipped) is reused verbatim as the first
// paragraph of both outcomes (§4.1's own note; not counted in §59).
//
// `act4ChamberDoorOpen`/`act4ChamberPhraseRespond` — the panel's one-field
// prompt (`act4_chamber_phrase`), same "open script builds the prompt event,
// respond script checks the answer, a wrong answer closes the prompt" idiom
// `act3HubLoginOpen`/`act3HubLoginRespond` established (`act3/scripts.ts`).
// The accepted phrase is the house rule (§21.2): `youngest goes last` or
// `house rules`, lowercased and trimmed.
import type { MemoryId } from '../../../engine/ids';
import { GATE_ENTER_TEXT } from '../act3/objects/s6ArchiveHub';
import { ACT2_MEM_M2_ANALYTICAL, ACT2_MEM_M2_DIRECT, ACT2_MEM_M2_SOCIAL, ACT2_MEM_M6, ACT2_MEM_M12, ACT2_MEM_M13 } from '../act2/ids';
import { MEM_M3_ANALYTICAL, MEM_M3_DIRECT, MEM_M3_SOCIAL } from '../act1/ids';
import {
  ACT4_CHAMBER_ADMITTED,
  ACT4_CHAMBER_DOOR_OPEN_SCRIPT,
  ACT4_CHAMBER_FAILURES,
  ACT4_CHAMBER_PANEL_LIVE,
  ACT4_CHAMBER_PHRASE_PROMPT_ID,
  ACT4_CHAMBER_PHRASE_RESPOND_SCRIPT,
  ACT4_CHAMBER_PHRASE_SAID,
  ACT4_CHAMBER_TIMER_TICKS,
  ACT4_CLUE_ADMITTED,
  ACT4_CLUE_FRAME_WANTS_MORE,
  ACT4_ENTER_ESCAPE_SCRIPT,
  ACT4_ESCAPE_CHAMBER,
  ACT4_MEM_M11,
} from './ids';

/** Stage E plan §4.0's own list — six "family fragment" slots, `M2`/`M3` each collapsed to their one mutually-exclusive variant. */
const FAMILY_MEMORY_GROUPS: MemoryId[][] = [
  [ACT2_MEM_M2_ANALYTICAL, ACT2_MEM_M2_SOCIAL, ACT2_MEM_M2_DIRECT],
  [MEM_M3_ANALYTICAL, MEM_M3_SOCIAL, MEM_M3_DIRECT],
  [ACT2_MEM_M6],
  [ACT2_MEM_M12],
  [ACT2_MEM_M13],
  [ACT4_MEM_M11],
];

function familyFragmentsHeld(state: GameState): number {
  return FAMILY_MEMORY_GROUPS.filter((group) => group.some((id) => state.memories.includes(id))).length;
}

const ADMITTED_REST_TEXT =
  'Linoleum. Brown and cream squares laid on the diagonal, warm through the sole of the shoe, with a pale road worn across it from where you are standing to a sink that is over there and was not over there a second ago.\n\nThere is no moment. Nothing dissolves, nothing resolves, nothing takes a breath to load. The concrete is behind your back foot and the linoleum is under your front one and both of them are ordinary.\n\nBehind you is a doorway with a hall through it: beading round the frame, gloss on the beading, and a chip out of the beading at the height of a hand carrying something.\n\nThe air in here has bread in it.';

const REFUSED_REST_TEXT =
  'It is the floor of the archive hub. You have gone forward about eighteen inches into the room you were already in, and the frame is behind you now, and the carpet under you is the same grey cord it has been all night.\n\nBehind the frame the standby light goes on being exactly as bright as it was.\n\nThere is no reader on this thing. No pad, no slot, no plate, no keyhole and no handle. Whatever it is checking, it is not checking anything that is on you.';

export const act4EnterEscape: ScriptFn = (world: WorldDef, state: GameState) => {
  if (familyFragmentsHeld(state) >= 2) {
    return apply(
      world,
      state,
      [
        { say: `${GATE_ENTER_TEXT}\n\n${ADMITTED_REST_TEXT}` },
        { set: [ACT4_CHAMBER_ADMITTED, true] },
        { grantClue: ACT4_CLUE_ADMITTED },
        { goto: ACT4_ESCAPE_CHAMBER },
      ],
      { path: `script.${ACT4_ENTER_ESCAPE_SCRIPT}.admit` },
    );
  }
  return apply(
    world,
    state,
    [{ say: `${GATE_ENTER_TEXT}\n\n${REFUSED_REST_TEXT}` }, { grantClue: ACT4_CLUE_FRAME_WANTS_MORE }],
    { path: `script.${ACT4_ENTER_ESCAPE_SCRIPT}.refuse` },
  );
};

export const act4ChamberDoorOpen: ScriptFn = (_world: WorldDef, state: GameState) => ({
  state,
  events: [{ type: 'prompt', id: ACT4_CHAMBER_PHRASE_PROMPT_ID, title: 'LAST ONE OUT SAYS', body: '', fields: [{ name: 'phrase' }] }],
});

const PHRASE_ACCEPTED_TEXT =
  'You type it in the way you would say it, which is fast and without listening to yourself, because it is not a sentence anybody in that family ever finished thinking about before they said it.\n\nThe line clears.\n\nFrom the speaker, all of them, not together and not tidily, in the ragged overlapping way a family says a thing it has said ten thousand times — and one of them gets it wrong on purpose, and one of them laughs at that, and it is the one who has been being funny quietly all afternoon and finally being heard.';

const PHRASE_REFUSED_TEXT =
  'The line clears and comes back exactly as it was.\n\nBehind you the timer resets itself to the top of its travel with a noise like a thumb going round a ratchet, and starts again, and the voices pick up from the beginning of the afternoon.\n\nIt is not a code. Nothing in this house has a code in it. It is a thing somebody said.';

export const act4ChamberPhraseRespond: ScriptFn = (world: WorldDef, state: GameState, args) => {
  const phrase = String(args?.['phrase'] ?? '').trim().toLowerCase();
  if (phrase === 'youngest goes last' || phrase === 'house rules') {
    const applied = apply(
      world,
      state,
      [{ say: PHRASE_ACCEPTED_TEXT }, { set: [ACT4_CHAMBER_PHRASE_SAID, true] }, { set: [ACT4_CHAMBER_PANEL_LIVE, false] }],
      { path: `script.${ACT4_CHAMBER_PHRASE_RESPOND_SCRIPT}.accept` },
    );
    return { state: applied.state, events: [{ type: 'promptClosed', id: ACT4_CHAMBER_PHRASE_PROMPT_ID }, ...applied.events] };
  }
  const applied = apply(
    world,
    state,
    [{ say: PHRASE_REFUSED_TEXT }, { inc: ACT4_CHAMBER_FAILURES }, { set: [ACT4_CHAMBER_PANEL_LIVE, false] }, { set: [ACT4_CHAMBER_TIMER_TICKS, 0] }],
    { path: `script.${ACT4_CHAMBER_PHRASE_RESPOND_SCRIPT}.refuse` },
  );
  return { state: applied.state, events: [{ type: 'promptClosed', id: ACT4_CHAMBER_PHRASE_PROMPT_ID }, ...applied.events] };
};

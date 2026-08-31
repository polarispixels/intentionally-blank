// Act III, Wave D3, task A — flags, clue, puzzle, memory
// (`docs/superpowers/specs/2026-09-07-stage-d-plan.md` §2 D3;
// `docs/superpowers/specs/2026-09-11-stage-d3-prose.md` §2, §5, §6).
//
// Every clue's `title`/`detail` and the memory's `lines` are transcribed
// verbatim from the prose doc (hard rule 5). This module covers only this
// task's own ids — the room/travel/routes/toolbox flags,
// `act3_clue_gate_rhythm`, `act3_p16_entry`, and `act3_mem_m20d`.
// `act3/index.ts` merges
// this module's exports alongside task B's and task C's own knowledge.

import type { Cond } from '../../../engine/cond';
import type { WorldSlice } from '../game';
import { MONSTER_TRUCK, WORK_ORDER } from '../act1/ids';
import { ACT2_NOLAN, ACT2_NOLAN_BADGE, ACT2_Q_INSIDE_THE_PLANT } from '../act2/ids';
import { DELIVERY_MORNING } from '../act2/calendar';
import {
  ACT3_AT_TUNNEL_MOUTH,
  ACT3_BASELINE_MATCHED,
  ACT3_BYPASS_SEEN,
  ACT3_CONSTRUCTION_DOOR_OPEN,
  ACT3_DIED_REACTOR,
  ACT3_HEADLAMP_ON,
  ACT3_INTERLOCK_NORMAL,
  ACT3_MATCH_BURNING,
  ACT3_MATCH_TURNS,
  ACT3_PIPE_CHASE,
  ACT3_Q_WHEN_UNWATCHED,
  ACT3_READ_GAUGES_NIGHT,
  ACT3_S6_PAD_TRIED,
  ACT3_SAW_SEAL,
  ACT3_TUNNEL_BELOW,
  ACT3_TUNNEL_UNLOCKED,
  ACT3_WALKED_TUNNEL,
  ACT3_ALERTNESS,
  ACT3_AT_PERIMETER,
  ACT3_CLUE_GATE_RHYTHM,
  ACT3_COOLING_PLANT,
  ACT3_FLAG_ENTERED_AS_VENDOR,
  ACT3_FLAG_TAILGATED,
  ACT3_HORSE_TIED,
  ACT3_INSIDE,
  ACT3_JACK_WILL_RAM,
  ACT3_LOBBY,
  ACT3_MEM_M20D,
  ACT3_P16_ENTRY,
  ACT3_PERIMETER_ROAD,
  ACT3_RODE_FENCE,
} from './ids';
import { ACT3_CLUE_MODEL_SHORT, ACT3_CLUE_PLAQUE, ACT3_CLUE_PULSE, ACT3_COUNTED_LEVELS, ACT3_SAW_MODEL } from './ids';

// ---------------------------------------------------------------------------
// §2's flag table — this task's own eight.
// ---------------------------------------------------------------------------

export const ACT3_FLAGS: WorldSlice['flags'] = {
  [ACT3_AT_PERIMETER]: { default: false, doc: "set by arriving at the perimeter by any travel mode (§3) — read by the travel script's own first/again beat selection and Jack's pin" },
  [ACT3_HORSE_TIED]: { default: false, doc: "set by the horse's balk a mile short of the gate (§3.3 beat 2) — read by the horse's own first/again beat selection and the return leg" },
  [ACT3_JACK_WILL_RAM]: { default: false, doc: 'set by SHOW NOTEBOOK TO JACK (decoded) or SHOW AUDIT TO JACK (§5.4) — route (c)\'s gate' },
  [ACT3_INSIDE]: { default: false, doc: 'set by any completed P16 route (§5) — the pass-time refusal (§14.3); ACT2_Q_INSIDE_THE_PLANT' },
  [ACT3_FLAG_TAILGATED]: { default: false, doc: "set by route (a') (§5.2) — the Lobby's arrival prefix (§5.6)" },
  [ACT3_FLAG_ENTERED_AS_VENDOR]: { default: false, doc: "set by route (d) (§5.5) — the Lobby's arrival prefix (§5.6)" },
  [ACT3_RODE_FENCE]: { default: false, doc: 'set by route (c) (§5.3) — M20-D\'s trigger; also granted explicitly mid-script' },
  [ACT3_ALERTNESS]: { default: 0, doc: 'numeric; route (c) sets it to 1 — read only by the room\'s description rule 4 and the light\'s examine rule 1 (§14.1)' },
};

// ---------------------------------------------------------------------------
// §4.6 — the gate's rhythm, granted by WATCH LIGHT / WATCH GATE / WATCH
// GATEHOUSE. P16's hint rung 2 in prose.
// ---------------------------------------------------------------------------

export const ACT3_CLUES: WorldSlice['clues'] = {
  [ACT3_CLUE_GATE_RHYTHM]: {
    title: 'The gate, watched a while',
    detail:
      'The light on the pole goes round on an interval that does not vary. The\ncamera on the gatepost never moves at all — it is fixed on the turnstile, not\nthe fence. The gate motor runs twice for nothing, on a schedule of its own.\n\nNothing out here looks at the fence. Everything out here looks at the door.',
  },
};

// ---------------------------------------------------------------------------
// P16 — one decision point, four honest doors. `solvedWhen` is shared with
// task B's/C's own rooms (§5's own ruling); (a) and (c) below are the
// clock-free routes `puzzle-no-clock-free-solution` needs — see this
// task's report.
// ---------------------------------------------------------------------------

const ROUTE_C_TRUCK_PRESENT: Cond = { objectAt: [MONSTER_TRUCK, ACT3_PERIMETER_ROAD] };

// D4 task B's own single addition to this puzzle's `solvedWhen` (§21.1) —
// imported right where it's used rather than threading it through task A's
// own big shared import block above.
import { ACT3_S1_MECHANICAL_GALLERY } from './ids';

export const ACT3_PUZZLES: WorldSlice['puzzles'] = {
  [ACT3_P16_ENTRY]: {
    id: ACT3_P16_ENTRY,
    name: 'Getting inside the plant',
    question: ACT2_Q_INSIDE_THE_PLANT,
    // D4 task B amendment (§21.1): route (b), the service tunnel, never
    // passes through the Lobby or the Cooling Plant — without S1 in this
    // list, P16 never solves and `act2_q_inside_the_plant` is never
    // answered for a tunnel player. Out-of-module edit to task A's own
    // puzzle def, made because §21.1 names it explicitly as this wave's
    // required wiring; flagged in this task's report.
    solvedWhen: { any: [{ visited: ACT3_LOBBY }, { visited: ACT3_COOLING_PLANT }, { visited: ACT3_S1_MECHANICAL_GALLERY }] },
    solutions: [
      {
        id: 'badge',
        class: 'direct',
        note: "USE BADGE / SHOW BADGE TO READER, with Nolan's borrowed badge (P15).",
        route: { has: ACT2_NOLAN_BADGE },
      },
      {
        id: 'tailgate',
        class: 'social',
        note: 'FOLLOW NOLAN at the perimeter, in the first half hour of morning.',
        route: { all: [{ npcAt: [ACT2_NOLAN, ACT3_PERIMETER_ROAD] }, { clock: { after: 420, before: 450 } }] },
      },
      {
        id: 'fence',
        class: 'direct',
        note: 'RAM FENCE / DRIVE THROUGH FENCE, with the truck present and Jack persuaded (or M20-D already held).',
        route: { all: [ROUTE_C_TRUCK_PRESENT, { any: [{ flag: ACT3_JACK_WILL_RAM }, { memory: ACT3_MEM_M20D }] }] },
      },
      {
        id: 'manifest',
        class: 'analytical',
        note: 'SIGN MANIFEST / WRITE VENDOR NUMBER, on a Tuesday morning, with the work order in hand.',
        route: { all: [DELIVERY_MORNING, { has: WORK_ORDER }] },
      },
    ],
    hints: [],
  },
};

// ---------------------------------------------------------------------------
// M20-D — *Commit Or Roll It* (family; exclusive, direct). Fires on the
// fence (route (c)), granted explicitly mid-script between beats 3 and 4
// (`act3/scripts.ts`); `trigger` declared here too (§2's own state table)
// so the ambient tick path also covers it, idempotently, if anything ever
// reaches `act3_rode_fence` by another route in a later wave.
// ---------------------------------------------------------------------------

export const ACT3_MEMORIES: WorldSlice['memories'] = {
  [ACT3_MEM_M20D]: {
    title: 'Commit Or Roll It',
    lines: [
      'The lot behind the feed store, with the weeds up through it, and my brother at the wheel with the seat all the way forward and his chin about level with the top of it.',
      'Round and round a shopping trolley I put out there as a cone. He keeps lifting off in the middle of the turn — gets it going, gets frightened of it, and takes his foot out, and the back comes round and sits him in the weeds. Four times.',
      '"You can\'t half-do it," I tell him. "It\'ll bite you in the middle whichever way you go. Commit or roll it."',
      'He commits. We do not roll it. He comes out of it dead straight and laughing so hard he cannot do the next one, and neither can I.',
    ],
    trigger: { when: { flag: ACT3_RODE_FENCE } },
  },
};

// =============================================================================
// D3, task B — the Lobby and Data Hall A's own flags/clues. Re-appended
// after this file was overwritten mid-wave by task A's own edit (which
// replaced the whole file rather than appending after task B's original
// content — flagged in task B's own report; task C's own D3-C section,
// visible in an earlier revision of this file, was lost the same way and
// has not reappeared as of this edit).
// =============================================================================

export const ACT3_D3B_FLAGS: WorldSlice['flags'] = {
  [ACT3_SAW_MODEL]: { default: false, doc: 'set by EXAMINE MODEL (act3/objects/lobby.ts) — read by P17 hint rung 2' },
  [ACT3_COUNTED_LEVELS]: { default: false, doc: 'set by COUNT LEVELS/SUBLEVELS/FLOORS on the model — grants act3_clue_model_short the same turn' },
};

export const ACT3_D3B_CLUES: NonNullable<WorldSlice['clues']> = {
  [ACT3_CLUE_PLAQUE]: {
    title: 'Commissioned 2030',
    detail:
      "The Badlands Facility's own dedication plaque, cast in bronze and never touched since: commissioned 2030, with a senator's name on it and no firm listed after his — a plaque assumes you know who he is.",
  },
  [ACT3_CLUE_MODEL_SHORT]: {
    title: 'Five, and a lot of rock',
    detail:
      "The lobby's own scale model shows five sublevels under the plant floor, and about as much rock moulded under the bottom step as there is building over the top one — which a model does because a case has to stop somewhere, not because a building does.",
  },
  [ACT3_CLUE_PULSE]: {
    title: 'A slow thing in the noise',
    detail:
      'Standing still in Data Hall A long enough, the broad flat noise of the air handling comes up and settles on something longer than a breath, over and over — not a hum, not a beat, and slower at night.',
  },
};

// =============================================================================
// D3, task C — the Cooling Plant, Corridor B4, the freight elevator, M7 (§2,
// §10–§13 of the prose doc). Re-appended twice now after this file was
// overwritten mid-wave — see this task's own report.
// =============================================================================

import {
  ACT3_B4_MEASURED,
  ACT3_B4_PASSES,
  ACT3_CLUE_41_FEET,
  ACT3_CLUE_NOV_1983,
  ACT3_CLUE_WARM_RETURN,
  ACT3_CORRIDOR_B4,
  ACT3_ELEVATOR_CALLED,
  ACT3_HATCH_OPEN,
  ACT3_MEM_M7,
  ACT3_P17_B4,
  ACT3_PANEL_OPEN,
  ACT3_PRESSED_BLANK,
  ACT3_Q_B4_LENGTH,
  ACT3_Q_SECOND_RETURN,
  ACT3_READER_B4_ROTATION,
} from './ids';
import { STRING_ITEM } from '../act1/ids';
import { ACT2_ORIGAMI_RULER } from '../act2/ids';

export const ACT3_D3C_FLAGS: WorldSlice['flags'] = {
  [ACT3_B4_PASSES]: { default: 0, doc: "incremented by each completed PACE CORRIDOR — read by §11.3's first/second/thereafter split" },
  [ACT3_B4_MEASURED]: { default: false, doc: 'set by the second pace, or the string, or the ruler — read by P17 solvedWhen and the notebook re-score rule' },
  [ACT3_READER_B4_ROTATION]: { default: 0, doc: 'incremented by every USE BADGE at reader B4 — odd rotations fail (§18 q10: the first ask fails, by design)' },
  [ACT3_PANEL_OPEN]: { default: false, doc: 'set by REMOVE PANEL — gates the stencil\'s visibility' },
  [ACT3_HATCH_OPEN]: { default: false, doc: 'set by UNBOLT (wrench) or PRY (chair leg) — gates the hatch\'s DOWN exit' },
  [ACT3_ELEVATOR_CALLED]: { default: false, doc: 'set by CALL ELEVATOR/PRESS BUTTON' },
  [ACT3_PRESSED_BLANK]: { default: false, doc: 'set by PRESS BLANK on the elevator panel — read by nothing yet in this build (D4/D5)' },
};

export const ACT3_D3C_CLUES: NonNullable<WorldSlice['clues']> = {
  [ACT3_CLUE_WARM_RETURN]: {
    title: 'Return B is warm',
    detail:
      'The Cooling Plant carries two chilled-water returns tagged in the same hand, on the same day, out of the same box of blanks — but only one of them is on the framed drawing, and the undocumented one, Return B, is warm to the touch while Return A, three feet away, stays cold. Something below the bottom of the drawing is running now.',
    questions: [ACT3_Q_SECOND_RETURN],
  },
  [ACT3_CLUE_41_FEET]: {
    title: "Corridor B4 doesn't match its own drawing",
    detail:
      "The life-safety plan screwed to B4's own wall gives the corridor as a hundred and eighty feet. Paced twice, strung once, and folded once against the origami ruler, the floor itself gives a longer number every time, by the same margin every time.",
    questions: [ACT3_Q_B4_LENGTH],
  },
  [ACT3_CLUE_NOV_1983]: {
    title: 'Inspected, Nov 1983',
    detail:
      'Behind the wall panel in Corridor B4, stencilled straight onto the block before anything was ever screwed over it: INSPECTED, NOV 1983 — on a building whose own dedication plaque says it was commissioned in 2030.',
  },
};

export const ACT3_D3C_QUESTIONS: NonNullable<WorldSlice['questions']> = {
  [ACT3_Q_B4_LENGTH]: {
    text: 'Corridor B4 reads long against its own life-safety plan. By how much, and why would a building lie about a hallway?',
    openWhen: { visited: ACT3_CORRIDOR_B4 },
    answerWhen: { flag: ACT3_B4_MEASURED },
    answer:
      "Two hundred and twenty-one feet on the floor against a hundred and eighty on the drawing — the notebook's own '41 longer inside than on plans,' met in the flesh.",
  },
  [ACT3_Q_SECOND_RETURN]: {
    text: "Return B is warm and is not on the plant's own drawing. Warm from what, and where does it actually go?",
    openWhen: { clue: ACT3_CLUE_WARM_RETURN },
    // D4 task C — answered at the chase bottom (§9.6, §21.1's own instruction
    // to edit this in place). `answer` is two consecutive sentences
    // transcribed verbatim from §9.6's own EXAMINE text (hard rule 5) —
    // composed from the granting section's own words only, no number, no
    // *town*.
    answerWhen: { visited: ACT3_PIPE_CHASE },
    answer: 'Return B goes past the flange and keeps going.\n\nSo does the ladder.',
  },
};

export const ACT3_D3C_PUZZLES: NonNullable<WorldSlice['puzzles']> = {
  [ACT3_P17_B4]: {
    id: ACT3_P17_B4,
    name: 'How long is Corridor B4, really',
    question: ACT3_Q_B4_LENGTH,
    solvedWhen: { flag: ACT3_B4_MEASURED },
    solutions: [
      { id: 'pace', class: 'analytical', note: 'PACE CORRIDOR twice, in both directions, and trust the second count over the first.', route: { flag: ACT3_B4_PASSES } },
      { id: 'string', class: 'analytical', note: "MEASURE CORRIDOR WITH STRING, using the General Store's twine against the drawing's own scale bar.", route: { has: STRING_ITEM } },
      { id: 'ruler', class: 'analytical', note: "MEASURE CORRIDOR WITH RULER, using Eli's folded letter as an origami scale.", route: { has: ACT2_ORIGAMI_RULER } },
    ],
    hints: [
      'A corridor tiled in one-foot squares is a ruler somebody already put down — walking it heel to toe would tell you something.',
      'One pass is not enough to trust. Walk it twice, in both directions, and see whether the number holds.',
      'PACE CORRIDOR (or WALK IT OFF), or MEASURE CORRIDOR WITH STRING/RULER if you are carrying either.',
    ],
  },
};

export const ACT3_D3C_MEMORIES: NonNullable<WorldSlice['memories']> = {
  [ACT3_MEM_M7]: {
    title: 'The Third Time',
    lines: [
      'Third time this month I have come down here to put a tape on this corridor and the third time I have come down here without the tape.',
      'So I do it on my feet, on the joints, heel to toe, because I want to know before I put my name on anything. I get a number. I stand at the far end with it and I do not like it.',
      'It is not that it is wrong. Things are wrong all day; that is the job. It is that I have walked this floor every working week for nine years and I have never once had a reason to count it, and now I have counted it twice and I am going to come back and count it again tomorrow, and I already know what I am going to get.',
    ],
    trigger: { when: { visited: ACT3_CORRIDOR_B4 } },
  },
};

// ---------------------------------------------------------------------------
// Wave D4 shared — the descent (D4 prose doc §2). Written by the main session
// before the builders ran. Builders add their own CLUE definitions (title and
// detail composed only from their own section's sentences) and PUZZLE edits
// in their own labelled block below the anchor, with the Edit tool.
// ---------------------------------------------------------------------------

export const ACT3_D4_FLAGS: WorldSlice['flags'] = {
  [ACT3_AT_TUNNEL_MOUTH]: { default: false, doc: 'set by the mouth room\'s own onEnter (register 90: the mouth is its own room now; Town Edge\'s own short-form-return selection uses `visited` instead, but this is still set for anything else that wants it)' },
  [ACT3_TUNNEL_UNLOCKED]: { default: false, doc: 'set by UNLOCK HATCH (§4.2) or PRY HATCH (§4.3); read by the hatch DOWN and the mouth description' },
  [ACT3_TUNNEL_BELOW]: { default: false, doc: 'register 90: driven by onEnter now, not a move effect — true on entering the Service Tunnel (below), false on entering the mouth; kept only so Conds already written against it (the matchbook\'s CURRENTLY_DARK) keep working. The two rooms\' own dark/description rules no longer read it — being in one room or the other already says which' },
  [ACT3_HEADLAMP_ON]: { default: false, doc: 'set by TURN ON LAMP (§5.1); the headlamp object is `on` while set' },
  [ACT3_MATCH_BURNING]: { default: false, doc: 'set by LIGHT MATCH (§5.2); cleared when act3_match_turns reaches 0' },
  [ACT3_MATCH_TURNS]: { default: 0, doc: 'turns of match-light left (§5.2): set to 2 by LIGHT MATCH, decremented each tick by the tunnel event; light while atLeast 1' },
  [ACT3_WALKED_TUNNEL]: { default: false, doc: 'set by the Service Tunnel room\'s own onEnter, once (register 90); the walk short forms and Dad topic_rails' },
  [ACT3_CONSTRUCTION_DOOR_OPEN]: { default: false, doc: 'set by OPEN DOOR from the tunnel side (§7.2); the S1<->tunnel exit both ways and the door plant-side rules' },
  [ACT3_SAW_SEAL]: { default: false, doc: 'set by EXAMINE SEAL (§6.5); Dad topic_seal gate (§14.1)' },
  [ACT3_READ_GAUGES_NIGHT]: { default: false, doc: 'set by READ GAUGES inside the night window (§9.3); the second-reading rule and P19 hint rung 2' },
  [ACT3_BASELINE_MATCHED]: { default: false, doc: 'set by COMPARE AUDIT WITH GAUGES (§9.4); P20 prerequisite ledger (D5)' },
  [ACT3_BYPASS_SEEN]: { default: false, doc: 'set by EXAMINE INTERLOCK (§10.1); the death availability and Dad topic_interlock gate' },
  [ACT3_INTERLOCK_NORMAL]: { default: false, doc: 'set by TURN KEYSWITCH TO NORMAL (§10.1); with it set the death is unreachable and §10.5 renders (§21.3)' },
  [ACT3_DIED_REACTOR]: { default: false, doc: 'set by the death (§10.3); read by nothing in D4 — D5 may read it' },
  [ACT3_S6_PAD_TRIED]: { default: false, doc: 'set by TYPE CREDENTIALS at the S6 pad (§9.8); the pad second-attempt rule' },
};

export const ACT3_D4_QUESTIONS: NonNullable<WorldSlice['questions']> = {
  [ACT3_Q_WHEN_UNWATCHED]: {
    text: 'Somebody uses the bottom of this building. When?',
    openWhen: { visited: ACT3_PIPE_CHASE },
    // Not answerable in D4 — its floor is D5's (§2 "Puzzles closed and opened", P19).
  },
};

// ---------------------------------------------------------------------------
// D4 task D — P18, solved on arrival in the Pipe Chase (§2, §9.6, §21.1).
// §9.6's own answer to `act3_q_second_return` is task C's own object (the
// chase bottom, in S5) — this puzzle's `solvedWhen` is this task's own, per
// the main session's own instruction, copying `ACT3_D3C_PUZZLES`' shape.
// ---------------------------------------------------------------------------

import { ACT3_P18_SECOND_RETURN, ACT3_PIPE_CHASE_SEEN } from './ids';

// `ACT3_PIPE_CHASE_SEEN`'s own flag — see `ids.ts`'s own doc comment for why
// this exists instead of the `{ not: { visited: ACT3_PIPE_CHASE } }` idiom
// every other D3 room's own "first sight" `ProseRule` uses.
export const ACT3_D4_TASK_D_FLAGS: WorldSlice['flags'] = {
  [ACT3_PIPE_CHASE_SEEN]: { default: false, doc: "set true by the room's own onEnter, the turn after its first-sight description (§11.1 rule 1) has already rendered — read by that same description's own ProseRule" },
};

export const ACT3_D4_PUZZLES: NonNullable<WorldSlice['puzzles']> = {
  [ACT3_P18_SECOND_RETURN]: {
    id: ACT3_P18_SECOND_RETURN,
    name: 'The second return, followed down',
    question: ACT3_Q_SECOND_RETURN,
    solvedWhen: { visited: ACT3_PIPE_CHASE },
    solutions: [
      {
        id: 'chase',
        class: 'direct',
        note: 'DOWN through the chase hatch (Cooling Plant) or sideways from S5, into the Pipe Chase, where Return B runs bare, warm, and down past the last floor there is.',
        route: { visited: ACT3_PIPE_CHASE },
      },
    ],
    hints: [],
  },
};

// ---------------------------------------------------------------------------
// D4 task B — S1's checkout-card clue (§8.6) and, if D3 did not already
// grant it, the lift's own "no lower" clue (§12.2). Titles are short
// paraphrases; details are composed only from each section's own sentences
// (hard rule 5) — see this task's report for exactly which sentences.
// ---------------------------------------------------------------------------

import { ACT3_CLUE_J_HAND, ACT3_CLUE_NO_LOWER } from './ids';
import { ACT3_CLUE_SEAL_FROM_INSIDE, ACT3_HEADLAMP_TAKEN } from './ids';

export const ACT3_D4_TASK_A_FLAGS: WorldSlice['flags'] = {
  [ACT3_HEADLAMP_TAKEN]: { default: false, doc: 'set by the first TAKE LAMP at the truck (§5.1) — gates that one-time line' },
};

export const ACT3_D4B_CLUES: NonNullable<WorldSlice['clues']> = {
  [ACT3_CLUE_J_HAND]: {
    title: 'The card, in the same hand as the notebook',
    detail:
      'The same pressure. The same small fast letters leaning the same way. The full\nstop after the J is put down hard enough to be a decision, and there is one\nexactly like it after every abbreviation in the book. He took a tape out of\nthis rack and did not bring it back.',
  },
  [ACT3_CLUE_NO_LOWER]: {
    title: 'More polish on the blank than on S5',
    detail:
      'The polish on it is deeper than the polish on S5, and S5 is the button that\ntakes a man to the bottom of his own building.',
  },
};

// ---------------------------------------------------------------------------
// D4 task C — S5 Reactor Interface, the interlock death, and the checkpoint
// (D4 prose doc §9, §10, §21, §22). Two builder-added flags beyond §2's own
// table (`act3/ids.ts`'s own header comment on each); three clues, titles
// and details composed only from their own granting section's sentences
// (hard rule 5) — no number-subtraction, no *town*, no *second facility*.
// ---------------------------------------------------------------------------

import { ACT3_DEMAND_DIAL_TURNED, ACT3_S5_SEEN } from './ids';
import { ACT3_CLUE_BASELINE_MATCHES_AUDIT, ACT3_CLUE_S6_DOOR_REFUSES, ACT3_CLUE_THREE_AM_DIP } from './ids';

export const ACT3_D4C_FLAGS: WorldSlice['flags'] = {
  [ACT3_S5_SEEN]: { default: false, doc: 'set by S5\'s own onEnter, first visit only — gates the description\'s "first sight" rule (§9.1 rule 1); `{ not: { visited } }` cannot do this (`move.ts`\'s `renderArrival` marks `visited` before rendering `description`)' },
  [ACT3_DEMAND_DIAL_TURNED]: { default: false, doc: 'set by the demand dial\'s first TURN/OPEN COVER/SET DEMAND (§9.5) — gates the second-attempt text' },
};

export const ACT3_D4C_CLUES: NonNullable<WorldSlice['clues']> = {
  // §9.3 rule 1 — the night-window reading. Composed from that rule's own
  // sentences only; the wall's three numbers print in the room's own
  // response, not repeated here as a subtraction.
  [ACT3_CLUE_THREE_AM_DIP]: {
    title: 'FDR 3, down at three in the morning',
    detail:
      'FDR 3 has moved. It is down, and it has been down long enough that the\nneedle is sitting rather than settling.\n\nLow on the glass of FDR 3\'s bezel, inside it, where you would have to have\ntaken the bezel off to do it, there is a pencil line. It is not dated and it\nis not initialled and it is not on any other gauge in the room.',
  },
  // §9.4 — verbatim, the whole block (the doc's own note calls it "the
  // single most important block in the wave" and it does no arithmetic,
  // names no place, and draws no conclusion — safe to keep intact).
  [ACT3_CLUE_BASELINE_MATCHES_AUDIT]: {
    title: 'The DIFFERENCE column, met on the wall',
    detail:
      "His FILED column and the tag that says HALL A are the same number.\n\nHis TAKEN column and the big face on the generation side are the same\nnumber, give or take whichever month you put your thumb on.\n\nAnd the third column — the one he ruled himself, and headed DIFFERENCE, and\nsat with for four days before he would put it in an envelope — that one is\nnot a subtraction down here.\n\nIt is a gauge. It has a bezel and a brass tag and a red line painted on the\nglass, and somebody comes along this wall every morning to make sure it is\nwhere it was.",
  },
  // §9.8 — the pad's own words, verbatim.
  [ACT3_CLUE_S6_DOOR_REFUSES]: {
    title: 'ACCESS LEVEL: MAINTENANCE, and still DENIED',
    detail:
      'The pad did not refuse the words. It read them, agreed with them, and\ndeclined to open.\n\nWhich means the words are not wrong. They are only shallow.',
  },
};

// ---------------------------------------------------------------------------
// D4 task A — the seal's clue (§6.5). `ACT3_P16_ENTRY.solvedWhen` already
// carries this task's own required amendment (task B added it above, at
// line ~105, before this task landed) — nothing further to edit there.
// Title/detail composed only from §6.5's own sentences (hard rule 5): the
// `examine` rule's second/third paragraphs and the `touch seal`/`touch
// hole` response, verbatim.
// ---------------------------------------------------------------------------

export const ACT3_D4_TASK_A_CLUES: NonNullable<WorldSlice['clues']> = {
  [ACT3_CLUE_SEAL_FROM_INSIDE]: {
    title: 'The cutting went in from the far side',
    detail:
      'Through the middle of the plug there is a hole. It is not a crack and it is\nnot a failure. It is about two feet by three, and its edges were cut, and\nthe cutting went in from the far side: every broken edge on this face is\nturned towards you, and every spall on this face has fallen this way, at\nyour feet.\n\nThe cut edges are not sharp. Somebody went round them afterwards with\nsomething, the way you do when a thing is going to be used more than once.',
  },
};

// --- D4 builders append below this line (Edit tool only; one block per task, labelled) ---

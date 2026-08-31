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
import { MONSTER_TRUCK, WORK_ORDER, YOUR_ROOM } from '../act1/ids';
import { ACT2_NOLAN, ACT2_NOLAN_BADGE, ACT2_Q_INSIDE_THE_PLANT, ACT2_STARTED } from '../act2/ids';
import { DELIVERY_MORNING } from '../act2/calendar';
import {
  ACT3_ALARM_PULLED,
  ACT3_CLUE_TOWN_RUNS_HERE,
  ACT3_DAD_HEARD_HIM,
  ACT3_HUB_LOGGED_IN,
  ACT3_KNOWS_WHO_HIT_YOU,
  ACT3_Q_ARCHIVE_TERMINAL,
  ACT3_Q_WHAT_ARE_THESE_PEOPLE,
  ACT3_Q_WHAT_HAPPENED_TO_JULES,
  ACT3_Q_WHO_HIT_YOU,
  ACT3_REACHED_S6,
  ACT3_S6_ARCHIVE_HUB,
  ACT3_S6_MAINTENANCE_BAY,
  ACT3_TOOK_NOLAN_BADGE,
  ACT3_UNBUCKLED_STRAP,
  ACT3_UV_LAMP_ON,
  ACT3_UV_SEEN_ARM,
  ACT3_WEARING_COVERALLS,
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
    // Wayfinding doc §4 — the five-rung ladder, transcribed verbatim (hard
    // rule 5). Rungs 4 and 5 are wider than any other ladder's (constitution
    // §15's flagship, four honest doors): the player who reaches them is not
    // stuck on cleverness but on which door they are equipped for today. The
    // service tunnel is fifth in both rungs on purpose — the longest route,
    // offered last.
    hints: [
      'There is more than one way through that gate and none of them involves breaking anything you would have to explain afterwards. The gatehouse, the reader on the post, the fence, and the country west of the road are all part of the same question. Look at all four before you commit to one, because the one you can do today may not be the one you can do best.',
      'What gets you through is either something you carry or something the plant already believes. Nolan wears the first on his chest on Friday nights and has said, out loud, that he does not mind where it says he has been. The second hangs on a nail at the gatehouse window, one morning a week, and nobody has looked at it after the day it was written. And the cedar posts west of the road are going somewhere: your father said so, the library\'s construction reel drew it, and standing at the fence you can see which way they point.',
      'Some of these doors only exist at certain hours, and two of them do not care what time it is. Nolan arrives in the first half hour of morning. The convoy and its clipboard are a Tuesday morning. The fence and the hatch on the county road are open to you at any hour of any day, if you have what they want. A route that is not there today is a day away, not gone.',
      'Four doors, and each of them wants exactly one thing.\n\nThe reader wants Nolan\'s badge, which he lends across a card table to somebody who has beaten him at cards.\n\nThe turnstile wants nobody in particular, and turns for anybody standing close enough behind a man who holds doors for people.\n\nThe manifest wants a vendor number, and there is one printed in a box in the top right corner of the work order you put back together out of strips.\n\nThe fence wants a truck at the perimeter and a driver who has agreed to it, and Jack agrees to it when he is shown what is in the notebook or in the audit.\n\nThe hatch on the county road wants a key or a lever, an hour of walking, and a light for the mile that comes after.',
      'Any one of these, and you are inside.\n\nUSE BADGE at the gate reader, carrying Nolan\'s badge.\n\nFOLLOW NOLAN on the perimeter road, in the first half hour of morning, while he is there.\n\nSIGN MANIFEST at the gatehouse on a Tuesday morning, carrying the work order.\n\nSHOW NOTEBOOK TO JACK or SHOW AUDIT TO JACK, then RAM FENCE with the truck on the road.\n\nOr: NW from Town Edge to the county road. UNLOCK HATCH with the keyring, or PRY HATCH WITH LEG. Take the headlamp out of the truck\'s toolbox first, because a mile underground is a mile underground. Then DOWN, and keep going.',
    ],
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
    // D5 task F — answered on first arrival in the Bay (§3, §39.3's own
    // instruction to edit this in place). `answer` is composed only from
    // §3.1 rule 2's own sentences (hard rule 5): the night first-sight
    // description's opening line and its own "They are asleep" — the
    // room full where by day it stands empty.
    answerWhen: { visited: ACT3_S6_MAINTENANCE_BAY },
    answer: 'The ladder ends on a floor, and the floor is tiled, and the room is full.\n\nThey are asleep.',
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
    // Wayfinding doc §5 — the five-rung ladder, transcribed verbatim (hard
    // rule 5). Rung 1 exists only to tell the player they are not missing a
    // deduction — the puzzle's shape (a clue that opened a question, whose
    // answer is "walk downward") is exactly the shape a player over-thinks.
    // Nothing below the chase, including the word "town," is named at any
    // rung.
    hints: [
      'You have already done the clever part of this. You put a hand on a pipe and it was warm, and warm is a fact about now — about something at the other end of it, today, running. What is left is not deduction. It is following.',
      'Two big returns come into this building and only one of them stops where the building stops. Find the place where they turn down through the floor and look at what has been put in beside them, and then look at how well it has been put in. Nobody bolts something through a rolled edge in four places for a thing they use once.',
      'There are two ways into the same shaft and they are five floors apart. One is a steel plate in the floor at the back of the Cooling Plant, bolted at eight points, with a lifting eye at one corner — Jack\'s wrench off the truck\'s toolbox fits those bolts, and so, less politely, does the chair leg. The other is already open: the formed opening in the end wall on Sublevel 5, where the returns go down and a ladder goes with them.',
      'Take a light. At the Sublevel 5 opening, examine what is actually in front of you: Return A stops at a valve and a blank flange, because five floors down is where the building stops. Return B does not stop. Neither does the ladder. Then go the way the ladder goes.',
      'In the Cooling Plant: UNBOLT HATCH WITH WRENCH, or PRY HATCH WITH LEG, then DOWN. On Sublevel 5: EXAMINE OPENING, then DOWN. Either one puts you in the Pipe Chase with a light on and the warm pipe beside you, which is the whole of the answer.',
    ],
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

// ---------------------------------------------------------------------------
// Wave D5 shared — Sublevel 6 (D5 prose doc §2). Written by the main session
// before the builders ran. Builders add their own CLUE / PUZZLE / MEMORY
// definitions in their own labelled block below the anchor (Edit tool).
// ---------------------------------------------------------------------------

export const ACT3_D5_FLAGS: WorldSlice['flags'] = {
  [ACT3_REACHED_S6]: { default: false, doc: 'set by the first onEnter of the Bay (§3); the Act III milestone — Stage E reads it; the Bay description rules; Dad §19' },
  [ACT3_WEARING_COVERALLS]: { default: false, doc: 'set by WEAR COVERALLS (§12.2), cleared by REMOVE; the four spotted events not-arm (§18) and the passed beat (§18.6)' },
  [ACT3_UV_LAMP_ON]: { default: false, doc: 'set by TURN ON LAMP (§8.2); EXAMINE ARM UNDER LAMP gate (§8.3); the lamp examine' },
  [ACT3_UV_SEEN_ARM]: { default: false, doc: 'set by EXAMINE ARM UNDER LAMP (§8.3); P21 seed — nothing in Stage D reads it' },
  [ACT3_HUB_LOGGED_IN]: { default: false, doc: 'set by the login script success arm (§22.3); the ledger, graph and queue existence; the terminal description rule 2' },
  [ACT3_KNOWS_WHO_HIT_YOU]: { default: false, doc: 'set by READ QUEUE (§25); M16 selection' },
  [ACT3_ALARM_PULLED]: { default: false, doc: 'set by PULL CHILLER ALARM (§20.2); the Custodian offstage schedule rule; cleared by §20.3' },
  [ACT3_TOOK_NOLAN_BADGE]: { default: false, doc: 'set by TAKE BADGE from the hook (§6.5); the hook description' },
  [ACT3_UNBUCKLED_STRAP]: { default: false, doc: 'set by UNDO STRAP at night (§7.3); the strap second-attempt rule' },
  [ACT3_DAD_HEARD_HIM]: { default: false, doc: 'set by the S5 push (§19.1); suppresses the push on later entries' },
};

export const ACT3_D5_QUESTIONS: NonNullable<WorldSlice['questions']> = {
  [ACT3_Q_WHAT_HAPPENED_TO_JULES]: {
    text: 'What happened to Jules?',
    openWhen: { flag: ACT2_STARTED },
    answerWhen: { clue: ACT3_CLUE_JULES_DEPRECATED },
    answer:
      'The archive ledger on Sublevel 6 has one result for Jules. STATUS: DEPRECATED.\nRECORDS: RECONCILED. ASSOCIATIONS: RECONCILED. SNAPSHOT: ARCHIVED / ROOT. NO\nFURTHER ACTION.',
  },
  [ACT3_Q_WHO_HIT_YOU]: {
    text: 'Who hit you?',
    openWhen: { visited: YOUR_ROOM },
    answerWhen: { clue: ACT3_CLUE_REACQUIRE },
    answer:
      'The reconciliation queue on Sublevel 6 lists three pending jobs. NOLAN, R:\nmaintenance, routine. JACK IV: memory reconciliation. SUBJECT [UNRESOLVED]:\nre-acquire, last known Main St / top floor rear.',
  },
  [ACT3_Q_ARCHIVE_TERMINAL]: {
    text: 'There is a terminal at the bottom of the building, and it is on. What does it know, and how deep do the two words go?',
    openWhen: { visited: ACT3_S6_ARCHIVE_HUB },
    answerWhen: { clue: ACT3_CLUE_JULES_DEPRECATED },
    answer:
      'The archive ledger on Sublevel 6 has one result for Jules. STATUS: DEPRECATED.\nRECORDS: RECONCILED. ASSOCIATIONS: RECONCILED. SNAPSHOT: ARCHIVED / ROOT. NO\nFURTHER ACTION.',
  },
  [ACT3_Q_WHAT_ARE_THESE_PEOPLE]: {
    text: 'What are these people — and what am I?',
    openWhen: { clue: ACT3_CLUE_TOWN_RUNS_HERE },
    // The Act IV hand-off (§2, §36 q1; register 88). Not answerable in Stage D.
  },
};

// --- D5 task H ---
// The Custodian's rounds, the four spotted events, the chiller alarm, and
// Dad on the rig (D5 prose doc §18-§20, §2). `ACT3_CLUE_ROUNDS`'s id is the
// main session's own (declared in `ids.ts`, before this task ran); this
// task supplies its title/detail only. `ACT3_ALARM_RESET_DUE` is this
// task's own flag (`ids.ts`, this task's own block) — the alarm's reset
// timer, not in the prose doc (§20.3's own header leaves the mechanism to
// "builder's call" — see `events.ts`'s header for the chosen one).

import { ACT3_ALARM_RESET_DUE, ACT3_CLUE_ROUNDS } from './ids';

export const ACT3_D5_TASK_H_FLAGS: WorldSlice['flags'] = {
  [ACT3_ALARM_RESET_DUE]: { default: false, doc: 'set by act3AlarmPull (events.ts) to the absolute minute 30 past the pull; read by act3AlarmReset; false = unset' },
};

// §2's own "Clue detail text" — the only place in this wave where the
// rounds are written down. Transcribed verbatim (hard rule 5); the doc
// gives no title for this clue, so the title is its own detail's first
// clause, verbatim (same "title composed only from the doc's own
// sentences" idiom `ACT3_D4_TASK_A_CLUES`'s own header states for
// `ACT3_CLUE_SEAL_FROM_INSIDE`, above).
export const ACT3_D5_TASK_H_CLUES: NonNullable<WorldSlice['clues']> = {
  [ACT3_CLUE_ROUNDS]: {
    title: 'Nights, below Sublevel 5, one man',
    detail:
      'Nights, below Sublevel 5, one man: the bay from about ten until half past\neleven, the archive room until one, Sublevel 5 until half past two, the bay\nagain until four. After four, nothing.',
  },
};

// =============================================================================
// D5, task F — the S6 Maintenance Bay: the four clues this task's own
// objects grant, P19 (the night schedule, solved), and M9 (seeded, fires on
// first entry). `act3_clue_chairs`/`act3_clue_uv_ghost` use §2's own
// verbatim detail text; `act3_clue_nolan_chair`/`act3_clue_peeled_hook`
// have no detail given in §2, so title/detail are composed only from
// §6's/§5.3's own sentences (hard rule 5) — listed in this task's report
// for voice review. `act3_clue_rounds` is task H's own (declared in
// `ids.ts`, granted there); not this task's to define.
// =============================================================================

// NOTE (task G, flagged in its report): this import used to re-list
// `ACT3_ALARM_PULLED`/`ACT3_READ_GAUGES_NIGHT` (a hard `Duplicate
// identifier` parse error — both are already imported in the shared block
// at the top of this file), which broke module load for every test in the
// repo, not just task F's own. Deduplicated here; task F's own five other
// names are untouched.
import { ACT3_CHAIR_SAT_TRIED, ACT3_CLUE_NOLAN_CHAIR, ACT3_CLUE_PEELED_HOOK, ACT3_MEM_M9, ACT3_P19_NIGHT_SCHEDULE } from './ids';
import { ACT3_CLUE_CHAIRS, ACT3_CLUE_UV_GHOST } from './ids';

// Mechanical flag only (not §2's own table) — gates §4.2's `SIT`
// first/second-and-later split.
export const ACT3_D5_TASK_F_FLAGS: WorldSlice['flags'] = {
  [ACT3_CHAIR_SAT_TRIED]: { default: false, doc: 'set by the first SIT attempt on the chairs (§4.2) — gates the second-and-later text' },
};

export const ACT3_D5_TASK_F_CLUES: NonNullable<WorldSlice['clues']> = {
  // §2's own "Clue detail text" — verbatim.
  [ACT3_CLUE_CHAIRS]: {
    title: 'One hook says NOLAN',
    detail:
      'Sublevel 6 is a room full of reclining chairs with restraints on them, set to\nindividual people, with a rail of named hooks along the wall. One hook says\nNOLAN.',
  },
  [ACT3_CLUE_UV_GHOST]: {
    title: 'One upright stroke, closed top and bottom',
    detail:
      'Under the inspection lamp on Sublevel 6, the smooth patch inside the left\nforearm has a mark in it: one upright stroke, closed top and bottom. It is not\nvisible in ordinary light.',
  },
  // Composed from §6.1's/§6.2's own sentences only (no detail given in
  // §2): the night reading that identifies the chair as his, and the day
  // reading's own physical evidence (the worn groove).
  [ACT3_CLUE_NOLAN_CHAIR]: {
    title: 'A groove in the vinyl, about the width of a thumb',
    detail:
      'A chair like the others, opposite the hook with his name on it, and Nolan is\nin it.\n\nThere is a groove in the vinyl of the right-hand arm, about the width of a\nthumb, in the place a thumb would go on a man who holds an arm rest.',
  },
  // Composed from §5.3's own sentences only (no detail given in §2).
  [ACT3_CLUE_PEELED_HOOK]: {
    title: 'You can see where the letters were and you cannot read them',
    detail:
      'The tape has been peeled off. What is left is the clean stripe where it was,\nand the gum, and the gum has gone grey and taken a print of the paint. You can\nsee where the letters were and you cannot read them.\n\nThe chair opposite this hook is set. The stem is at its own mark and the\nfootrest is at its own mark and the paper across the head end is fresh.',
  },
};

// P19 — solved the moment the player reaches the Bay at all (§2's own
// ruling: "solvedWhen: { visited: act3_s6_maintenance_bay }"), same shape
// as `ACT3_D4_PUZZLES`. Four honest routes (§2): the clock/gauges, the
// coveralls, Dad, and the alarm — `route` conds reference each route's own
// already-declared flag/clue (`ACT3_CLUE_ROUNDS` is task H's own, granted
// by Dad's topic_rounds).
export const ACT3_D5_TASK_F_PUZZLES: NonNullable<WorldSlice['puzzles']> = {
  [ACT3_P19_NIGHT_SCHEDULE]: {
    id: ACT3_P19_NIGHT_SCHEDULE,
    name: 'The night schedule',
    question: ACT3_Q_WHEN_UNWATCHED,
    solvedWhen: { visited: ACT3_S6_MAINTENANCE_BAY },
    solutions: [
      {
        id: 'clock',
        class: 'analytical',
        note: "READ GAUGES in S5's night window (D4 §9.3) and READ CLOCK on the Bay's own wall clock (§9.2).",
        route: { flag: ACT3_READ_GAUGES_NIGHT },
      },
      {
        id: 'coveralls',
        class: 'direct',
        note: 'WEAR COVERALLS (§12.2) and walk the floor as staff.',
        route: { flag: ACT3_WEARING_COVERALLS },
      },
      {
        id: 'dad',
        class: 'social',
        note: 'ASK DAD ABOUT ROUNDS (§19.2).',
        route: { clue: ACT3_CLUE_ROUNDS },
      },
      {
        id: 'alarm',
        class: 'direct',
        note: 'PULL CHILLER ALARM (§20, clock-free).',
        route: { flag: ACT3_ALARM_PULLED },
      },
    ],
    // Wayfinding doc §6 — the five-rung ladder, transcribed verbatim (hard
    // rule 5). The alarm is rung 5's second half because it is the
    // clock-free route (`puzzle-no-clock-free-solution`); the coveralls are
    // the last clause of the last rung, the least the sentence can say and
    // still be worth saying. No rung says what is in the chairs.
    hints: [
      'A ladder that somebody maintains is a ladder somebody climbs, and a man who climbs it does it at an hour that suits him rather than you. The question is not whether you can get to the bottom of this building. It is whether you can be down there while he is somewhere else.',
      'He is not a guard. He does a room, he takes about the same time over it every time, and he goes the same way afterwards, and if he finds you he does not do anything worse than make you climb back up. Anything that tells you where he is now, or makes you into somebody who is supposed to be here, is worth more than hurrying.',
      'Three things in this building will tell you when, and no two of them need each other. There is a clock on Sublevel 5, high on the wall over the gauges, and it is the only instrument in that room that is not measuring the building. There is your father, if you brought him down on the rig, who cannot see a thing and can hear all of it. And there is the red box on the stanchion in the Cooling Plant, which does not tell you when at all: it makes a when.',
      'Read a clock before you climb. The small hours are the low point — the gauges dip, the offices are dark, and he is furthest from the ladder you want. If Dad is with you, ask him where the man is before every move you make; he will name the room, including the times when the room is the pipe you were about to climb into. When he says the pipe, wait.',
      'READ CLOCK on Sublevel 5, and if it is not the small hours yet, wait for them. ASK DAD ABOUT ROUNDS, and go DOWN the chase whenever he puts the man anywhere except the pipe. If you would rather not time anything at all: go back up to the Cooling Plant and PULL ALARM. One chiller stops, the note of the building drops a tone, and somebody has to come up and see about it, and the way down is yours for as long as that takes. At the bottom, the first thing on the rail is a set of grey coveralls, and WEAR COVERALLS is how you stop being the only man in a coat on this floor.',
    ],
  },
};

// M9 — seeded, fires on the first entry to the Bay, after the description
// (§17, §39.3). `lines` transcribed verbatim (hard rule 5), one entry per
// paragraph.
export const ACT3_D5_TASK_F_MEMORIES: NonNullable<WorldSlice['memories']> = {
  [ACT3_MEM_M9]: {
    title: 'A Hand On A Shoulder',
    lines: [
      'Rows, in the dark, and every row full.',
      'Somebody walking the line between them — not hurrying, stopping where they stop, moving on. A board of some kind held against the chest the way you hold a board. The sound of a buckle being done up two rows over, and a while later, another one.',
      'And then a hand coming down on your shoulder from behind. Flat, and warm, and entirely without hurry: the way you touch somebody you are not intending to wake.',
      'You are not frightened.',
      'That is the part you keep. There is a hand on your shoulder in the dark, in a room full of strapped-in sleeping people, and you are not frightened, and you cannot think of a single reason why not.',
    ],
    trigger: { when: { visited: ACT3_S6_MAINTENANCE_BAY } },
  },
};

// ---------------------------------------------------------------------------
// D5 task G — the Archive Hub: the ledger's clue (R10), the graph's clue
// (R11), the queue's clue (R12), the gate frames' clue, and the root
// door's clue; P20 (the ledger); the three M16 variants (§21-§31, §39.3).
// Titles/details composed only from each granting section's own sentences
// (hard rule 5) — `act3_clue_jules_deprecated`/`act3_clue_town_runs_here`/
// `act3_clue_reacquire` use the doc's own "Clue detail" blocks verbatim
// (§23.2, §24.3, §25.1); `act3_clue_gates`/`act3_clue_root_refuses` have no
// authored clue-detail block in the doc, so their title/detail are this
// task's own composition from §27's/§28's own sentences only — listed in
// this task's report.
// ---------------------------------------------------------------------------

import { ACT3_CLUE_JULES_DEPRECATED, ACT3_CLUE_REACQUIRE } from './ids';
import { ACT3_CLUE_GATES, ACT3_CLUE_ROOT_REFUSES } from './ids';
import { ACT3_P20_LEDGER } from './ids';
import { ACT3_MEM_M16_A, ACT3_MEM_M16_D, ACT3_MEM_M16_S } from './ids';
import { ACT3_HUB_SEEN } from './ids';

export const ACT3_D5_TASK_G_FLAGS: WorldSlice['flags'] = {
  [ACT3_HUB_SEEN]: { default: false, doc: 'set by the Hub\'s own first onEnter (§21) — gates the description\'s "first sight" rule; `{ not: { visited } }` cannot do this (`move.ts`\'s `renderArrival` marks `visited` before rendering `description`)' },
};

export const ACT3_D5_TASK_G_CLUES: NonNullable<WorldSlice['clues']> = {
  [ACT3_CLUE_JULES_DEPRECATED]: {
    title: 'SUBJECT JULES I — DEPRECATED',
    detail:
      'The archive ledger on Sublevel 6 has one result for Jules. STATUS: DEPRECATED.\nRECORDS: RECONCILED. ASSOCIATIONS: RECONCILED. SNAPSHOT: ARCHIVED / ROOT. NO\nFURTHER ACTION.',
  },
  [ACT3_CLUE_TOWN_RUNS_HERE]: {
    title: 'Every notch above the line',
    detail:
      "The archive's load trace has a notch in it every night. Laid against Eli's\nFILED figure of 460, every notch falls in the part of the load that was never\nfiled for. The part of the building with the machines in it does not vary.",
  },
  [ACT3_CLUE_REACQUIRE]: {
    title: 'SUBJECT [UNRESOLVED] — RE-ACQUIRE',
    detail:
      'The reconciliation queue on Sublevel 6 lists three pending jobs. NOLAN, R:\nmaintenance, routine. JACK IV: memory reconciliation. SUBJECT [UNRESOLVED]:\nre-acquire, last known Main St / top floor rear.',
  },
  // §27.1/§27.4 — composed only from the gate frames' own examine/legend
  // text (no authored "Clue detail" block exists for this one in the doc).
  [ACT3_CLUE_GATES]: {
    title: 'Openings in the wall, and nothing hung in them',
    detail:
      'Openings in the left-hand wall, door height and a little wider than a door,\nwith nothing hung in any of them: no leaf, no frame within the frame, no\nhinge, no keep, no threshold strip.\n\nOver the first, a strip of engraved plastic: ESCAPE RM. Over the second: HAB.\nThe rest have the slot for a strip and no strip in the slot.\n\nThe frames are not holes in this wall. They are in it.',
  },
  // §28.1-§28.6 — composed only from the root door's own examine/refusal
  // text (no authored "Clue detail" block exists for this one either).
  [ACT3_CLUE_ROOT_REFUSES]: {
    title: 'ACCESS LEVEL: MAINTENANCE. DENIED. There is a level under this one.',
    detail:
      'A door at the bottom of a well, thicker than the frame it stands in, hung on\nfour hinges, with no handle, no window, no legend, no keyway, and a reader\nbeside it with no light in it at all.\n\nA badge held to the reader gets nothing: no diode, no beat, no NOLAN. The\nreader has never been switched on.\n\nThe terminal answers for it instead: ACCESS LEVEL: MAINTENANCE. DENIED. There\nis a level under this one.\n\nKnuckles on the door make a smaller noise than they make on your own hand.\nPast the warmth of it, a long way past it, water is going through something\nat a steady rate.',
  },
};

// §23.1-§23.2 — P20's solvedWhen is the same clue R10 grants; R11/R12 are
// extras beyond the gate, not part of it (§2, §39.1). `hints` has no
// authored ladder in the doc (unlike censor/microfiche's own) — this
// task's own short, instructional composition, flagged in this task's
// report as a builder call (same class of gap as `ACT2_WRITE_AWAY_TEXT`).
export const ACT3_D5_TASK_G_PUZZLES: NonNullable<WorldSlice['puzzles']> = {
  [ACT3_P20_LEDGER]: {
    id: ACT3_P20_LEDGER,
    name: 'The archive ledger',
    question: ACT3_Q_ARCHIVE_TERMINAL,
    solvedWhen: { clue: ACT3_CLUE_JULES_DEPRECATED },
    solutions: [
      {
        id: 'search_jules',
        class: 'analytical',
        note: 'Log in at the Sublevel 6 terminal (the credentials that opened everything else this week) and SEARCH LEDGER FOR JULES.',
      },
    ],
    hints: [
      'The terminal on Sublevel 6 is on, and it has been on a long time. Whatever answered you once already, up at street level, still answers down here.',
      'LOG IN. The credentials that opened everything else this week open this too.',
      'Once you are in, SEARCH LEDGER FOR JULES.',
    ],
  },
};

// §26 — exactly one variant ever fires, selected on the highest action-class
// counter at trigger time (architecture §5); same mutual-exclusion idiom as
// `act1/knowledge.ts`'s `MEM_M3_ANALYTICAL`/`_SOCIAL`/`_DIRECT` (`profileLeader`
// cond, each variant's `not: { any: [...] }` excluding the other two — the
// social variant is the default when no class leads). `lines` transcribed
// verbatim (hard rule 5), one entry per paragraph; the four-word apology and
// "Then white." are shared verbatim across all three, per the doc's own note
// that the three "share their last two words."
export const ACT3_D5_TASK_G_MEMORIES: NonNullable<WorldSlice['memories']> = {
  [ACT3_MEM_M16_A]: {
    title: 'Nothing In His Hands',
    lines: [
      'A door, and a knock on it of exactly the right length: two, and then nothing, which is what a man knocks when he is not selling anything.',
      'You open it. The chain is off. That is the first thing you cannot make come out any other way — the chain is off, which means you took it off, which means you had already decided about him through the wood.',
      'Grey coveralls. Nothing in his hands. That is the second thing. There was nothing in his hands when the door came open and there was something in them a short time later, and the part in between is not there, and you have gone at it from both ends.',
      '"Sorry about this," he says.',
      'Then white.',
    ],
    trigger: {
      when: {
        all: [
          { clue: ACT3_CLUE_REACQUIRE },
          { profileLeader: 'analytical' },
          { not: { any: [{ memory: ACT3_MEM_M16_S }, { memory: ACT3_MEM_M16_D }] } },
        ],
      },
    },
  },
  [ACT3_MEM_M16_S]: {
    title: 'He Wiped His Feet',
    lines: [
      'A knock, and you open the door, and there is a man on the landing standing carefully far enough back from it.',
      'He waits to be asked. That is what you keep — a man on a landing at that hour, waiting, and when you step aside he wipes his feet on the way in.',
      '"Sorry about this."',
      'He says it the way you say it to somebody whose morning you are about to put out. There is no threat anywhere in that room. There is nobody in that room who wants anything from you, and that includes him, and you have never in your life been less afraid of anybody.',
      'Then white.',
    ],
    trigger: {
      when: {
        all: [
          { clue: ACT3_CLUE_REACQUIRE },
          { not: { any: [{ profileLeader: 'analytical' }, { profileLeader: 'direct' }] } },
          { not: { any: [{ memory: ACT3_MEM_M16_A }, { memory: ACT3_MEM_M16_D }] } },
        ],
      },
    },
  },
  [ACT3_MEM_M16_D]: {
    title: 'The Floor Comes Up',
    lines: [
      'The door, and the landing light behind him, and a man in coveralls who does not come in until you move.',
      'Your hand goes up. Not to him — to the frame, because you are already going, and the arm arrives late and does not find it.',
      '"Sorry about this."',
      'The floor comes up at the shoulder first, and the last thing still working is hearing, and what it brings you is a man going round a room very quietly, opening things, and not finding it.',
      'Then white.',
    ],
    trigger: {
      when: {
        all: [
          { clue: ACT3_CLUE_REACQUIRE },
          { profileLeader: 'direct' },
          { not: { any: [{ memory: ACT3_MEM_M16_A }, { memory: ACT3_MEM_M16_S }] } },
        ],
      },
    },
  },
};

// --- D5 builders append below this line (Edit tool only; one block per task, labelled) ---

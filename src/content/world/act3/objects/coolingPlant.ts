// Act III, Stage D3 task C — the Cooling Plant's seven objects (D3 prose
// doc §10). Manifolds, Return A, Return B (P18's surface half), the framed
// drawing, the chase hatch, the yard door, and the lift door (`../elevator.
// ts`, not built here — "the same object, the same handlers, in two
// rooms," §10.8). Two uncounted sub-parts (the floor's damp patch, the warm
// step) exist only so ROOM-LEVEL sense text has a noun to resolve against —
// same idiom task B's own Lobby bench/coffee sub-parts use (`ids.ts`'s own
// comment on `ACT3_LOBBY_BENCH`/`ACT3_LOBBY_COFFEE`).
//
// §21.2's collision note: "bare RETURN... should clarify, not guess."
// Return A's own noun list (§10.3) authors bare "return"; Return B's own
// list (§10.4) does not. Giving Return A alone the bare noun would make
// "TOUCH RETURN" resolve to A silently, guessing rather than clarifying —
// so this file adds "return" to Return B's noun list too (deviating one
// word from the doc's own literal list) so the two objects share the bare
// noun and the parser's own two-objects-one-noun path asks which one,
// which is what the collision note actually asked for. Flagged in this
// task's report.

import type { Effect } from '../../../../engine/effects';
import type { ObjectDefSlice } from '../../../../engine/world';
import type { ProseRule } from '../../../../engine/prose';
import { DIRECTION_VERB_IDS } from '../../../../engine/move';
import { CHAIR_LEG } from '../../act1/ids';
import { ACT1_VERBS, BREAK, EXAMINE, LOOK_BEHIND, OPEN, PRY, PULL, READ, SIT, SMELL, TAKE, TOUCH } from '../../act1/verbs';
import { V_FIT } from '../../act2/ids';
import {
  ACT3_ALARM_PULLED,
  ACT3_ALARM_PULL_SCRIPT,
  ACT3_BOUNDARY_GATE,
  ACT3_CHASE_HATCH,
  ACT3_CHILLER_ALARM,
  ACT3_CLUE_WARM_RETURN,
  ACT3_COOLING_PLANT,
  ACT3_HATCH_OPEN,
  ACT3_MANIFOLDS,
  ACT3_PERIMETER_ROAD,
  ACT3_PIPE_CHASE,
  ACT3_PLANT_DRAWING,
  ACT3_PLANT_FLOOR,
  ACT3_PLANT_STEP,
  ACT3_Q_SECOND_RETURN,
  ACT3_RETURN_A,
  ACT3_RETURN_B,
  ACT3_WRENCH,
  ACT3_YARD_DOOR,
  V_ACT3_RESET_ALARM,
  V_ACT3_TRIP_CHILLER,
  V_UNBOLT,
} from '../ids';

// ---------------------------------------------------------------------------
// §10.2 — the manifolds.
// ---------------------------------------------------------------------------

const manifoldsExamine =
  'Headers of about ten inches running the length of the wall on saddles, with the branches coming off them in pairs, and every pair tagged: a brass disc on a wire, stamped, hanging from the valve handle.\n\nFlow is red at the collars and return is blue, and none of it has been allowed to go grey anywhere. Somebody with a paint pot and a slow afternoon has kept this room exactly as legible as it was on the day it was commissioned, and has done it more than once.\n\nTwo of the returns are bigger than the rest and come up out of the floor at the back, side by side, into the same rank of saddles.';

const readTagsText =
  'Stamped brass, one blow to a letter, in a hand that leaned on the R.\n\n    CH-1 FLOW CH-1 RTN CH-2 FLOW CH-2 RTN HALL A FLOW RETURN A RETURN B\n\nSeven of them, hanging on seven wires, all going the same way round.';

const valveText =
  'The handle takes your hand and does not take your weight. There is a tag on it that tells you what it does, and a lock-off hasp beside the tag, and behind the hasp there is an interlock with the chiller it feeds, and the interlock is not a suggestion.\n\nAlso: every gauge in this building would know within the minute, and one of them is in a room with a man in it.';

// §10.9's "read gauges" — hung on the manifolds (the room's own gauges are
// otherwise scenery in the description, per this task's own report).
const gaugesText =
  'Suction, discharge, and two temperatures for each machine, all of them within the marked bands, all of them where a man who came in here every morning would want to find them.';

const manifolds: ObjectDefSlice = {
  location: ACT3_COOLING_PLANT,
  name: 'manifolds',
  nouns: ['manifold', 'manifolds', 'header', 'headers', 'pipes', 'pipe', 'returns', 'both returns', 'both pipes', 'branches', 'valves', 'valve', 'tags', 'tag', 'saddle', 'saddles', 'collars', 'gauges', 'gauge'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: manifoldsExamine }] },
    { verbs: [READ], effects: [{ say: readTagsText }] },
    { verbs: [OPEN], effects: [{ say: valveText }] },
  ],
};

// ---------------------------------------------------------------------------
// §10.3 — Return A.
// ---------------------------------------------------------------------------

const returnAExamine =
  'Twelve inches, lagged to the last inch, with the lagging cut square around the tag and the tag stamped RETURN A. The vapour barrier sweats where it has been nicked, and the nick has been taped.\n\nIt comes up out of the floor at the back and goes into the header two saddles along.';

const returnATouch =
  'Through the lagging there is nothing to feel at all, which is what lagging is for.\n\nWhere the lagging is cut back at the tag, the steel is cold — properly cold, cold enough that in a room this temperature you would keep your hand on it a moment longer than you needed to.';

// `validate.ts`'s `noise-word-vocabulary` check rejects a bare "a" (an
// English article, `NOISE_WORDS`) as a noun/adjective on ANY object — it is
// stripped from every position in the input before lookup, so it could
// never actually be typed and matched. §10.3's own noun list authors "return
// a" and "a"; both are dropped here (deviating from the doc, flagged in
// this task's report) in favour of the bare "return" (shared with Return B
// — §21.2's own "should clarify, not guess" collision recommendation) plus
// every other descriptive noun.
const returnA: ObjectDefSlice = {
  location: ACT3_COOLING_PLANT,
  name: 'Return A',
  nouns: ['return', 'pipe', 'first pipe', 'lagged pipe', 'insulated pipe', 'cold pipe'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: returnAExamine }] },
    { verbs: [TOUCH], effects: [{ say: returnATouch }] },
  ],
};

// ---------------------------------------------------------------------------
// §10.4 — Return B, P18's surface half.
// ---------------------------------------------------------------------------

const returnBExamine =
  'Twelve inches. The same saddle rank, the same blue, the same lagging, the same brass disc on the same gauge of wire, stamped in the same hand:\n\n    RETURN B\n\nIt comes up out of the floor beside A and goes into the header two saddles further along, and there is nothing about it anywhere that is not exactly like the other one, except that its lagging has been cut and re-taped a good deal more often.';

const returnBTouch = 'Warm.\n\nNot hot. Warm the way a mug is warm twenty minutes after. You take your hand off it and put it back to be sure, and it is still warm, and A, three feet away, is still cold.\n\nWater comes back warm from the thing it was sent to cool.';

const returnBFollow =
  'Up from the floor, into the header, and away along the wall with the rest of them to the chillers, which is the boring half.\n\nDown is the other half, and down goes into the floor, and the floor here is a poured slab with a hatch in it at the back of the room.';

const returnBSmell =
  'Warm steel and warm paint. Under it, faintly, the flat mineral smell of treated water where a gland is weeping about a drop an hour into a puddle the size of a coin that has been there long enough to have a ring round it.';

const warmReturnEffects: Effect[] = [{ say: returnBTouch }, { grantClue: ACT3_CLUE_WARM_RETURN }, { openQuestion: ACT3_Q_SECOND_RETURN }];

const returnB: ObjectDefSlice = {
  location: ACT3_COOLING_PLANT,
  name: 'Return B',
  // "return" added alongside Return A's own bare noun — see this file's own
  // header note on the §21.2 collision recommendation.
  nouns: ['return b', 'return', 'b', 'second return', 'second pipe', 'other pipe', 'warm pipe'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: returnBExamine }] },
    { verbs: [TOUCH], effects: warmReturnEffects },
    { verbs: [SMELL], effects: [{ say: returnBSmell }] },
    // "FOLLOW RETURN B"/"TRACE RETURN B" — no dedicated verb exists; READ has
    // no bearing here, so this reuses EXAMINE's own sibling, TOUCH, is
    // already claimed above by the warm-touch text. Flagged: "follow"/
    // "trace" are not wired to a verb that resolves a bare pipe object in
    // this build (V_FOLLOW, act1/ids.ts, targets NPCs only) — see this
    // task's report.
  ],
};

// ---------------------------------------------------------------------------
// §10.5 — the drawing.
// ---------------------------------------------------------------------------

const drawingExamine =
  'Behind glass, in a frame with one mitre coming apart at the corner: the chilled-water system, drawn properly, to a scale, with a title block bottom right and a revision table above the title block.\n\nChillers. Pumps. Headers. Flow, in red. Return, in blue.\n\nOne return.\n\nThe revision table has four rows in it. The last is dated 2031 and its description column reads: CONSTRUCTION ADIT ISOLATED FROM PLANT LOOP.';

const compareDrawingText =
  'You put a finger on the glass where the returns come into the header. There is one line there. It is tagged A.\n\nYou take the finger off the glass and look at the wall, where there are two pipes in two saddles with two brass discs on them — and the second disc is stamped in the same hand as the first, by the same person, on the same day, out of the same box of blanks.';

const drawingBehindText =
  'Four screws through four brass cups, and behind the frame there will be nothing but block and a rectangle of paint the colour the rest of the wall used to be.';

const compareDrawingEffects: Effect[] = [{ say: compareDrawingText }, { grantClue: ACT3_CLUE_WARM_RETURN }, { openQuestion: ACT3_Q_SECOND_RETURN }];

const drawing: ObjectDefSlice = {
  location: ACT3_COOLING_PLANT,
  name: 'drawing',
  // §21.2: "drawing" resolves to the plant's own; "plan" accepted here too as a synonym (B4's own life-safety plan is a different room and different object).
  nouns: ['drawing', 'framed drawing', 'plan', 'schematic', 'diagram', 'frame', 'glass', 'title block', 'revision table'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: drawingExamine }] },
    // "COMPARE DRAWING WITH RETURNS"/"COMPARE DRAWING WITH PIPES" —
    // `V_FIT` (act2/ids.ts) already carries "compare"/"match"/"fit" as
    // general-purpose vocabulary (D1/D2's own page-fitting puzzle); reused
    // here with `withInstrument` matching either return pipe, same idiom as
    // every other cross-object COMPARE in this codebase.
    // v0.13.0 playtest: the doc's own phrasing is "compare drawing with
    // returns" (plural) — that word lives on the manifolds, so they count.
    { verbs: [V_FIT], withInstrument: [ACT3_RETURN_A, ACT3_RETURN_B, ACT3_MANIFOLDS], effects: compareDrawingEffects },
    { verbs: [OPEN, TAKE, LOOK_BEHIND], effects: [{ say: drawingBehindText }] },
  ],
};

// ---------------------------------------------------------------------------
// §10.6 — the chase hatch.
// ---------------------------------------------------------------------------

const hatchExamine: ProseRule[] = [
  {
    when: { flag: ACT3_HATCH_OPEN },
    text: 'The plate is standing against the wall on its edge, and the hole it came out of is a yard square with a ladder going down the near side of it, and the air that comes up out of it is warmer than this room is.',
  },
  {
    text: 'A steel plate about a yard square let into the floor at the back, bolted at eight points, with a lifting eye at one corner and a stencil across the middle of it:\n\n    PIPE CHASE CONFINED SPACE — PERMIT REQUIRED\n\nThe paint on the bolt heads is broken on all eight, which is what bolt heads look like when they have been out and back.',
  },
];

const unboltWithWrenchText =
  "Jack's wrench off the truck's toolbox fits them, which is not luck; there are about four sizes of bolt in the world and this is one of them.\n\nSeven come out grudgingly. The eighth comes out easy, and then a second one comes out easy, and then you stop and look at the other six, and it becomes clear that two of these eight bolts have been doing all of the work for some time and the rest have been resting.\n\nThe plate comes up on the eye and stands against the wall, and out of the hole comes air that is warmer than this room.";

const pryWithLegText =
  'There is a lip at the eye corner, and there is a chair leg in your possession that has already been asked to do worse than this.\n\nYou get it under, and lean, and the plate comes up against eight bolts that turn out to be doing rather less than eight bolts should. Two of them lift through the plate still in their holes. The rest were never in anything.\n\nThe plate goes over on its edge against the wall, and out of the hole comes air that is warmer than this room.';

const neitherToolText =
  'Eight bolts, a lifting eye and a lip. You have hands, and hands are the one tool this is not going to come up for.\n\nThere is a wrench in the box on the truck and there is a chair leg that has been earning its keep since the first morning.';

const openHatchEffects: Effect[] = [
  {
    if: {
      when: { has: ACT3_WRENCH },
      then: [{ say: unboltWithWrenchText }, { set: [ACT3_HATCH_OPEN, true] }, { setState: [ACT3_CHASE_HATCH, 'open', true] }],
      else: [{ say: neitherToolText }],
    },
  },
];

const pryHatchEffects: Effect[] = [
  {
    if: {
      when: { has: CHAIR_LEG },
      then: [{ say: pryWithLegText }, { set: [ACT3_HATCH_OPEN, true] }, { setState: [ACT3_CHASE_HATCH, 'open', true] }],
      else: [{ say: neitherToolText }],
    },
  },
];

// §15/D4 §12.3 — "DOWN"/"ENTER HATCH" once open. Bare "down" (no dobj) is
// the room's own exit (`coolingPlant.ts`, the room file) — this handler
// answers "ENTER HATCH"/"GO DOWN HATCH" (dobj = the hatch), which resolves
// through `DIRECTION_VERB_IDS.in` and would otherwise reach `traverseDoor`
// (there is no exit whose `door` is the hatch itself — see `elevator.ts`'s
// own header on why object handlers for a resolved dobj take priority over
// that dispatch).
//
// D4 task D amendment: D3's in-world text is kept verbatim (§12.3's own
// ruling) but now leads somewhere real — the boundary script this handler
// used to invoke (`ACT3_BOUNDARY_SCRIPT`/`act3Boundary`, `../scripts.ts`) is
// retired for this route; see that file's own header for why it is not
// deleted outright.
export const HATCH_DOWN_TEXT =
  'The ladder goes down the near side of the hole, and it is a proper ladder, bolted through the slab, with the rungs worn on top and not on the sides.\n\nThe air coming up past you is warmer than the room and it is moving.';

const hatchDownEffects: Effect[] = [{ say: HATCH_DOWN_TEXT }, { advanceClock: 10 }, { goto: ACT3_PIPE_CHASE }];

const hatch: ObjectDefSlice = {
  location: ACT3_COOLING_PLANT,
  name: 'hatch',
  nouns: ['hatch', 'plate', 'cover', 'floor hatch', 'chase', 'pipe chase', 'bolts', 'bolt', 'eye', 'lifting eye'],
  container: { open: false },
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: hatchExamine }] },
    { verbs: [OPEN, V_UNBOLT], effects: openHatchEffects },
    { verbs: [PRY], effects: pryHatchEffects },
    { verbs: [DIRECTION_VERB_IDS.in], when: { flag: ACT3_HATCH_OPEN }, effects: hatchDownEffects },
  ],
};

// ---------------------------------------------------------------------------
// §10.7 — the yard door.
// ---------------------------------------------------------------------------

const yardDoorExamine =
  'Steel, outward-opening, with a panic bar on the inside, a reader on the outside, and a rubber mat in front of it that has had a very great deal of use.\n\nFrom in here it opens by being pushed.\n\nEverything in this building opens easily from the inside.';

export const YARD_DOOR_OUT_TEXT = 'The bar goes down under your hip and the door goes out into cold, and the apron is where you left it, and the light on the pole is doing what it does.';

const yardDoor: ObjectDefSlice = {
  location: ACT3_COOLING_PLANT,
  name: 'yard door',
  nouns: ['yard door', 'outside door', 'steel door', 'exit', 'mat', 'bar'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: yardDoorExamine }] },
    { verbs: [OPEN], effects: [{ say: YARD_DOOR_OUT_TEXT }] },
  ],
};

// ---------------------------------------------------------------------------
// Two uncounted sub-parts — the room's own senses need a noun to answer to.
// ---------------------------------------------------------------------------

const floorText =
  'Poured slab, sealed, and slightly damp at the back of the room in a patch that has an edge to it — an edge the shape of somebody having mopped up to a line and stopped.';

const plantFloor: ObjectDefSlice = {
  location: ACT3_COOLING_PLANT,
  name: 'floor',
  nouns: ['floor', 'slab'],
  handlers: [{ verbs: [EXAMINE, TOUCH], effects: [{ say: floorText }] }],
};

const stepText =
  'There is a step by the hall door and it is warm and it is the first warm thing in this county that has not been somebody\'s kitchen. You sit on it for a minute.';

const plantStep: ObjectDefSlice = {
  location: ACT3_COOLING_PLANT,
  name: 'step',
  nouns: ['step'],
  handlers: [{ verbs: [SIT], effects: [{ say: stepText }] }],
};

export const ACT3_COOLING_PLANT_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT3_MANIFOLDS]: manifolds,
  [ACT3_RETURN_A]: returnA,
  [ACT3_RETURN_B]: returnB,
  [ACT3_PLANT_DRAWING]: drawing,
  [ACT3_CHASE_HATCH]: hatch,
  [ACT3_YARD_DOOR]: yardDoor,
};

// D3 §15's boundary gate — mechanism-only, never named/examinable (no
// `nouns`), same idiom as `TOWN_EDGE_TUNNEL_BOUNDARY_GATE` (`act1/objects/
// townEdge.ts`). Never opens (no `container` at all). No longer used by
// this room's own hatch `down` exit (D4 §12.3/§21.1 — that exit is real
// now), but reused as-is, unmodified, as the wave's one surviving
// `system.buildBoundary` door at the Pipe Chase's own `down` exit
// (`pipeChase.ts`, D4 task D's own file) — "one door", per that task's
// briefing. `location` is inert for a door check (`resolve.ts`'s
// `objectState` looks the id up directly, never by room), so leaving it
// declared here rather than moving it costs nothing.
const boundaryGate: ObjectDefSlice = { location: ACT3_COOLING_PLANT };

// OVERLAY (owned by task A — the truck's toolbox/wrench, `ACT3_WRENCH` is
// A's own id). A bare id declaration alone throws at runtime the moment
// anything evaluates `{ has: ACT3_WRENCH }` (`resolve.ts`'s `objectLocation`
// throws on an object absent from `world.objects` entirely, rather than
// treating it as simply not held) — so a minimal real placeholder is
// registered here, `location: 'nowhere'`, until task A's own object lands
// and this task's report flags for deletion (same id, so nothing else needs
// to change; `has` naturally reads false in the meantime, which is exactly
// §21.3's own documented fallback: only the chair-leg route works).
const wrenchOverlay: ObjectDefSlice = { location: 'nowhere', name: 'wrench', portable: true, nouns: ['wrench', 'spanner', 'socket'] };

// ---------------------------------------------------------------------------
// D5, task H — the chiller alarm (D5 prose doc §20; Stage D plan §2 D5's
// "P19's P route, clock-free"). Addressable without being listed, like the
// elevator's own certificate (`elevator.ts`) — not part of this room's own
// 7-object tier (D3 §10), added to `ACT3_COOLING_PLANT_EXTRA_OBJECTS`
// alongside the floor/step/boundary/wrench below.
//
// VERBS — "PULL ALARM"/"BREAK GLASS" reach it through the already-shipped
// `PULL`/`BREAK` verbs (`act1/verbs.ts`, both already `'V dobj'`) plus this
// object's own nouns; no new verb needed for either. "HIT GLASS WITH
// HAMMER" needs `BREAK` (which already claims the word "hit") to also carry
// `'V dobj prep iobj'` — the same idempotent in-place-mutation idiom
// `act3/verbs.ts` already uses for `OPEN`/`MEASURE`/`CALL`/`USE`, done here
// rather than in that shared file since it's local to this one object (the
// hammer is this object's own sub-detail, not a separate item). "TRIP
// CHILLER" and "RESET ALARM" are new `'V dobj'` verbs
// (`V_ACT3_TRIP_CHILLER`/`V_ACT3_RESET_ALARM`, `ids.ts`/`verbs.ts`, this
// task's own block — see `verbs.ts`'s own header for why these are `'V
// dobj'`, not the bare `'V'` an earlier draft used: a bare verb never
// reaches an object's own `handlers`, only a room's, and this room's file
// isn't this task's to edit). "Chiller" is added to this object's own nouns
// below so "TRIP CHILLER" has a `dobj` to resolve — the room's two actual
// chiller units are prose only (D3 §10) and were never their own object.
// ---------------------------------------------------------------------------

if (!ACT1_VERBS[BREAK]!.patterns.includes('V dobj prep iobj')) {
  ACT1_VERBS[BREAK] = {
    ...ACT1_VERBS[BREAK]!,
    patterns: [...ACT1_VERBS[BREAK]!.patterns, 'V dobj prep iobj'],
    preps: [...(ACT1_VERBS[BREAK]!.preps ?? []), 'with'],
  };
}

const alarmExamine =
  'Between the two chillers, at head height on a stanchion, a red steel box with a glass front and a small hammer on a chain beside it. Under the glass, a handle, and beside the handle a legend:\n\n    CHILLER TRIP - PULL\n\nSomebody has painted the stanchion around the box and cut in neatly at its edges, which means the box was there before the paint and nobody has ever had cause to take it off.';

const alarmPullAgainText =
  'The glass is already out of it and the handle is already down, and a handle that is already down is not a plan.';

const alarmResetText =
  'It goes back up, and it stays up, and the chiller does not restart, because these things are built so that a man has to go and look at the thing before the thing runs again.\n\nYou are not going to be the man who goes and looks at it.';

const chillerAlarm: ObjectDefSlice = {
  location: ACT3_COOLING_PLANT,
  name: 'chiller alarm',
  nouns: ['alarm', 'chiller alarm', 'alarm box', 'box', 'glass', 'handle', 'hammer', 'stanchion', 'legend', 'chiller'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: alarmExamine }] },
    // §20.4 — a second pull while already pulled. Listed first: HandlerDef
    // resolution is first-match-wins on (verb, `when`), so this guarded
    // entry intercepts before the unguarded first-pull handler below.
    { verbs: [PULL, BREAK, V_ACT3_TRIP_CHILLER], when: { flag: ACT3_ALARM_PULLED }, effects: [{ say: alarmPullAgainText }] },
    // §20.2 — the first pull. `act3AlarmPull` (`events.ts`) prints the beat,
    // sets the flag, and stores the reset-due minute — see that file's own
    // header for why a script rather than a plain `set` is needed.
    { verbs: [PULL, BREAK, V_ACT3_TRIP_CHILLER], effects: [{ script: { id: ACT3_ALARM_PULL_SCRIPT } }] },
    // §20.5 — the honest failure: pushing the handle back up does not clear
    // `act3_alarm_pulled` (only §20.3's automatic reset, `events.ts`, does
    // that) — see this task's report for why.
    { verbs: [V_ACT3_RESET_ALARM], when: { flag: ACT3_ALARM_PULLED }, effects: [{ say: alarmResetText }] },
  ],
};

export const ACT3_COOLING_PLANT_EXTRA_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT3_PLANT_FLOOR]: plantFloor,
  [ACT3_PLANT_STEP]: plantStep,
  [ACT3_BOUNDARY_GATE]: boundaryGate,
  [ACT3_WRENCH]: wrenchOverlay,
  [ACT3_CHILLER_ALARM]: chillerAlarm,
};

// Re-exported so `coolingPlant.ts` (the room file) can build the room's own
// exits without re-importing every id here.
export { ACT3_BOUNDARY_GATE, ACT3_PERIMETER_ROAD };

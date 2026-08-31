// Act III, Wave D3, task A — the truck's toolbox and `act3_wrench`
// (`docs/superpowers/specs/2026-09-11-stage-d3-prose.md` §21.3's own
// flagged gap: "No act3_wrench and no truck toolbox anywhere in shipped
// content. The plan assumes both."; ruling 4: "amending act2/objects/
// truck.ts or a new act3/objects/truck.ts").
//
// Builder decision: a NEW file, not an in-place edit of `act2/objects/
// truck.ts` — that file's own module boundary (D1's glovebox/deck) is
// untouched; this is additive, the same "own module, own file" split
// this wave's other tasks use for their own amendments elsewhere.
//
// CONTAINER SHAPE — `{ on: MONSTER_TRUCK }` (the truck itself, not the cab
// sub-part `MONSTER_TRUCK_CAB`): a toolbox reads as bed/undercarriage
// hardware, not glovebox contents, so it is placed on the truck's own
// body rather than mirroring the glovebox's exact parent. Same mechanism
// otherwise (`container: { open: true, transparent: true }`, permanently
// open — `world.ts`'s `inScopeAt`'s own `'on' in loc` branch needs no open
// check at all, but declaring it explicitly documents the intent the same
// way the glovebox's own comment does).
//
// NO EXAMINE PROSE ON THE WRENCH (ruling 4's original scope, now half-closed):
// the wrench still has no authored text — the built-in EXAMINE/OPEN families
// stand for it, flagged here as a `narrative-writer` need. The toolbox's own
// gap is CLOSED by Stage D addenda §6
// (`docs/superpowers/specs/2026-09-14-stage-d-addenda-prose.md`) —
// `EXAMINE`/`SEARCH` now render its own two-rule `ProseRule[]`, below.

import type { ObjectDefSlice } from '../../../../engine/world';
import type { ProseRule } from '../../../../engine/prose';
import { MONSTER_TRUCK } from '../../act1/ids';
import { EXAMINE, SEARCH, TAKE, TURN_OFF, TURN_ON } from '../../act1/verbs';
import { ACT3_HEADLAMP, ACT3_HEADLAMP_ON, ACT3_HEADLAMP_TAKEN, ACT3_TRUCK_TOOLBOX, ACT3_WRENCH } from '../ids';

// Stage D addenda §6 — `X TOOLBOX` / `SEARCH TOOLBOX`. Rule order: the
// headlamp-taken flag first, then the unconditional §6.1 — the box is full
// far longer than it is empty, so the empty state is the exception and
// takes the gate (the doc's own note). Text transcribed verbatim (hard
// rule 5).
const toolboxWithHeadlampText =
  'A steel box across the bed behind the cab, lid up, at shoulder height, because\neverything on this truck is at shoulder height.\n\nA coil of jump lead with the clamps taped apart so they cannot find each other.\nA wrench with the shine worn off its jaws. A tray of the fine grey silt that\nevery toolbox in this county has a layer of.\n\nUnder the coil, where you would only find it by moving the coil, there is a\nheadlamp.';

const toolboxAfterHeadlampText =
  'A steel box across the bed behind the cab, lid up, at shoulder height, because\neverything on this truck is at shoulder height.\n\nA coil of jump lead with the clamps taped apart so they cannot find each other.\nA wrench with the shine worn off its jaws. A tray of the fine grey silt that\nevery toolbox in this county has a layer of.\n\nThe coil is lying where you left it after taking what was under it.';

const toolboxExamineProse: ProseRule[] = [
  { when: { flag: ACT3_HEADLAMP_TAKEN }, text: toolboxAfterHeadlampText },
  { text: toolboxWithHeadlampText },
];

const toolbox: ObjectDefSlice = {
  location: { on: MONSTER_TRUCK },
  name: 'toolbox',
  container: { open: true, transparent: true },
  portable: false,
  nouns: ['toolbox', 'tool box', 'tool chest'],
  handlers: [{ verbs: [EXAMINE, SEARCH], effects: [{ say: toolboxExamineProse }] }],
};

const wrench: ObjectDefSlice = {
  location: { in: ACT3_TRUCK_TOOLBOX },
  name: 'wrench',
  portable: true,
  nouns: ['wrench', 'spanner', 'socket'],
};

// ---------------------------------------------------------------------------
// D4, task A — the headlamp (§5.1). `lightSource: true`; on/off tracked by
// the dedicated flag `act3_headlamp_on` (not the object's own `on` overlay —
// see this task's report on why: the tunnel's own `dark` Cond, written per
// the doc's own §6 spec, reads the flag directly). `switchable` is left
// unset: the built-in TURN ON/OFF (`actions.ts`) would toggle the object's
// own overlay, which nothing here reads, so this handler fully replaces it
// (same "a match overrides built-in semantics entirely" rule every other
// custom handler in this game already relies on).
// ---------------------------------------------------------------------------

const headlampExamineLit = 'Lit, and pointed wherever your face is, which takes about four minutes to stop\nbeing funny.\n\nThe band is damp on the inside and the shell is warm over the reflector.';
const headlampExamineUnlit =
  'A headlamp on a perished elastic band, out of the bottom of Jack\'s toolbox\nunder a coil of jump lead: a plastic shell, a reflector with a scuff across\nit, a rocker switch, and a battery door held on by a screw somebody has\nreplaced with a different screw.\n\nIt is the kind of object that is either completely dead or completely fine and\ngives no indication which until you ask it.';
const headlampExamine: ProseRule[] = [
  { when: { flag: ACT3_HEADLAMP_ON }, text: headlampExamineLit },
  { text: headlampExamineUnlit },
];

const headlampTurnOnText = 'Completely fine.';
const headlampTurnOffText = 'Off, and the afterimage of the reflector sits in front of you for a while\ndoing nothing useful.';
const headlampFirstTakeText = 'It is under a coil of jump lead in a toolbox belonging to a man who has never\nonce in his life been asked whether he has a torch and had to say no.';

const headlamp: ObjectDefSlice = {
  location: { in: ACT3_TRUCK_TOOLBOX },
  name: 'headlamp',
  portable: true,
  lightSource: true,
  // v0.14.0 playtest: no bare "lamp"/"light" — the toolbox is permanently
  // open on the truck, so at the perimeter the headlamp was in scope and tied
  // the pole light for WATCH LIGHT (the hut's clue). The compounds still make
  // it the answer to a bare "lamp"/"light" wherever nothing else claims the
  // word (the tunnel; S5, where the interlock's is "red lamp").
  nouns: ['headlamp', 'head lamp', 'head light', 'torch', 'flashlight', 'headtorch', 'band', 'elastic'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: headlampExamine }] },
    { verbs: [TURN_ON], when: { not: { flag: ACT3_HEADLAMP_ON } }, effects: [{ say: headlampTurnOnText }, { set: [ACT3_HEADLAMP_ON, true] }] },
    { verbs: [TURN_OFF], when: { flag: ACT3_HEADLAMP_ON }, effects: [{ say: headlampTurnOffText }, { set: [ACT3_HEADLAMP_ON, false] }] },
    { verbs: [TAKE], when: { not: { flag: ACT3_HEADLAMP_TAKEN } }, effects: [{ say: headlampFirstTakeText }, { move: [ACT3_HEADLAMP, 'inventory'] }, { set: [ACT3_HEADLAMP_TAKEN, true] }] },
  ],
};

export const ACT3_TRUCK_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT3_TRUCK_TOOLBOX]: toolbox,
  [ACT3_WRENCH]: wrench,
  [ACT3_HEADLAMP]: headlamp,
};

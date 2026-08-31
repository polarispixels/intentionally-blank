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
// NO EXAMINE PROSE (ruling 4, explicit): neither the toolbox nor the
// wrench has authored text — the built-in EXAMINE/OPEN families stand.
// Flagged here as a `narrative-writer` need, not silently invented around.

import type { ObjectDefSlice } from '../../../../engine/world';
import { MONSTER_TRUCK } from '../../act1/ids';
import { ACT3_TRUCK_TOOLBOX, ACT3_WRENCH } from '../ids';

const toolbox: ObjectDefSlice = {
  location: { on: MONSTER_TRUCK },
  name: 'toolbox',
  container: { open: true, transparent: true },
  portable: false,
  nouns: ['toolbox', 'tool box', 'tool chest'],
};

const wrench: ObjectDefSlice = {
  location: { in: ACT3_TRUCK_TOOLBOX },
  name: 'wrench',
  portable: true,
  nouns: ['wrench', 'spanner', 'socket'],
};

export const ACT3_TRUCK_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT3_TRUCK_TOOLBOX]: toolbox,
  [ACT3_WRENCH]: wrench,
};

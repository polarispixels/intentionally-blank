// Act V, wave E3, task W — the well door, the root door from the inside
// (`docs/superpowers/specs/2026-09-20-stage-e3-prose.md` §16). `portable:
// false`. EXAMINE-before (§16.1), OPEN/UNBOLT/DRAW BOLT (§16.2 — sets
// `act5_root_door_open`, permanent, two-way), EXAMINE-after (§16.3, once
// open, and also OPEN's own no-op once open). §16.3's text is shared
// verbatim with the Hub-side arm `objects/s6ArchiveHub.ts` amends onto
// `act3_root_door` (§42.1's table) — exported so that file imports this
// exact string rather than a second copy (hard rule 5).
//
// IMPORTANT — an engine gotcha this task's report flags: an EXIT gated by
// `door: <id>` is only ever "blocked" (renders `blockedText`) once it also
// "currently exists" — `move.ts`'s own `exitCurrentlyExists`/`exitIsOpen`
// split (§2.4). `exitCurrentlyExists` reads only `exit.when`; if that's
// false the player gets the generic "no way out" family, never
// `blockedText` at all (that family is reserved for a `when`-true exit
// whose `door` object's own `container.open` state is still false). So
// this object carries a real `container: { open: false }` and `OPEN`/
// `UNBOLT` flips it with `setState`, and BOTH the well's `down` exit
// (`../s6ArchiveHub.ts`) and the antechamber's own `e` exit key off `door:
// act5_well_door` ALONE, with **no** `when` on the exit — `act5_root_door_
// open` (the flag) still gets set too, for every other `when`/`Cond` this
// wave reads it from (the Hub-side arm on `act3_root_door`, this object's
// own EXAMINE), just not for the exit's own gating.
//
// "DRAW BOLT" (§16.2's own third surface phrase) amends `act3/verbs.ts`'s
// shared `V_UNBOLT` in place — the same "amend a shared table in place"
// idiom `objects/s6ArchiveHub.ts` uses for the badge/USB, applied to a
// verb's own `words` array instead of an object's `handlers`.

import type { HandlerDef, ObjectDefSlice } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { EXAMINE, OPEN } from '../act1/verbs';
import { ACT3_VERBS } from '../act3/verbs';
import { V_UNBOLT } from '../act3/ids';
import { ACT5_ROOT_ANTECHAMBER, ACT5_ROOT_DOOR_OPEN, ACT5_WELL_DOOR } from './ids';

const unboltDef = ACT3_VERBS[V_UNBOLT]!;
if (!unboltDef.words.includes('draw bolt')) unboltDef.words.push('draw bolt');

const WELL_DOOR_EXAMINE_BEFORE_TEXT =
  'Up three tiled steps: the door.\n\nOn this side it has a handle, and a bolt, and a plate with the hinge screws\nshowing, and a strip of draught seal along the top that somebody replaced at\nsome point, because the replacement came up short and there is a little\nmade-good piece let in at the corner.\n\nThere is no reader on this side. There was never going to be one.';

const WELL_DOOR_OPEN_TEXT =
  'The bolt draws back with one finger.\n\nThe leaf comes in towards you, heavy on four hinges, with the soft flat sound\nof a thing that is very well hung, and beyond it there are three tiled steps\ngoing up into a metal edging and the edge of a carpet, in a room you have stood\nin and knocked on this door from.\n\nIt has had a bolt on the inside of it the whole time.';

/** §16.3 — after, shared verbatim with the Hub-side arm `act3_root_door` gains (§42.1). */
export const ACT5_WELL_DOOR_OPEN_TEXT =
  'Standing open on its four hinges at the bottom of a tiled well, with the carpet\nedging at the top of the steps on one side of it and a smooth floor with no\njoints in it on the other.\n\nNothing about it is different. It is a good door and it is doing what a good\ndoor does.';

const examine: ProseRule[] = [
  { when: { flag: ACT5_ROOT_DOOR_OPEN }, text: ACT5_WELL_DOOR_OPEN_TEXT },
  { text: WELL_DOOR_EXAMINE_BEFORE_TEXT },
];

const handlers: HandlerDef[] = [
  { verbs: [EXAMINE], effects: [{ say: examine }] },
  // §16.2 — sets the flag AND the door's own `open` container state (see
  // this file's header on why both are needed). Permanent (never cleared)
  // and two-way — the Hub's `down` exit and the antechamber's own `e` exit
  // both key off `door: act5_well_door` (§42.4).
  {
    verbs: [OPEN, V_UNBOLT],
    when: { not: { flag: ACT5_ROOT_DOOR_OPEN } },
    effects: [{ say: WELL_DOOR_OPEN_TEXT }, { set: [ACT5_ROOT_DOOR_OPEN, true] }, { setState: [ACT5_WELL_DOOR, 'open', true] }],
  },
  // Already open — a no-op, same idiom the Hub-side arm uses on its own OPEN.
  { verbs: [OPEN, V_UNBOLT], effects: [{ say: ACT5_WELL_DOOR_OPEN_TEXT }] },
];

export const wellDoor: ObjectDefSlice = {
  location: ACT5_ROOT_ANTECHAMBER,
  portable: false,
  name: 'well door',
  nouns: ['door', 'well door', 'east door', 'root door', 'bolt', 'steps', 'tiled steps'],
  // See this file's header — the exit mechanism needs a real container-open
  // state on the door object itself, not only the `act5_root_door_open` flag.
  container: { open: false },
  handlers,
};

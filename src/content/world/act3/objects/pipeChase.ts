// Act III, Stage D4 task D — the Pipe Chase's three objects (D4 prose doc
// §11.2-§11.4): the crawl (the shaft/ladder itself), Return B below (P18's
// lower half), and the condensation. `portable: false` on all three, per
// the doc's own header line for each.
//
// §21.2's collision note ("return"/"return b" — two-token nouns, as D3
// ruled) is honoured here the same way D3's own Cooling Plant Return A/B
// did (`objects/coolingPlant.ts`'s own header): the chase has only one
// pipe object with "return" in its noun list at all, so a bare "return"
// here resolves to it without ambiguity — there is nothing else in scope
// to clarify against, which is exactly what the main session's own ruling
// in this task's briefing says ("bare return in the chase should clarify
// or resolve to the lower return — it is the only return in scope there,
// so resolving is fine").

import type { Effect } from '../../../../engine/effects';
import type { ObjectDefSlice } from '../../../../engine/world';
import { CLIMB, EXAMINE, LISTEN, TASTE, TOUCH } from '../../act1/verbs';
import { V_DRINK, V_FOLLOW } from '../../act1/ids';
import { ACT3_CONDENSATION, ACT3_COOLING_PLANT, ACT3_CRAWL, ACT3_PIPE_CHASE, ACT3_RETURN_B_LOWER } from '../ids';

// ---------------------------------------------------------------------------
// §11.2 — the crawl.
// ---------------------------------------------------------------------------

const crawlExamine =
  'Formed, not cut: the shuttering marks run vertically the whole way and the\ncorners have proper radii on them, which means this shaft was in the drawings\nthat the concrete was poured to.\n\nThe ladder is a standard bolted string ladder in galvanised steel, and it has\nbeen maintained. The rungs are the same age as the shaft. The bolts are not.';

const crawlTouch =
  'The film comes off on your fingertips and is not slime, exactly, and is not\ngoing to wash off on the way up either.';

// §11.2's own "`climb` / `up` / `down` — see §11.5, §13": bare `UP`/`DOWN`
// reach the room's own exits directly (`pipeChase.ts`, the room file) and
// need no object handler at all. `CLIMB` takes a dobj (`act1/verbs.ts`'s
// own `'V dobj'` pattern — there is no bare `'V'` form), so "CLIMB CRAWL"/
// "CLIMB LADDER" needs its own handler here; it mirrors the `up` exit's own
// effects rather than duplicating a second copy of §11.5's text under a
// different id. Builder decision, flagged in this task's report: "CLIMB
// LADDER" alone is ambiguous between up and down, and this file resolves it
// toward up (out of the shaft, the same sense the paddock fence's own
// `CLIMB` reads climbing "in", `act1/objects/townEdge.ts`) rather than down
// (the boundary) — `DIRECTION_VERB_IDS.up` itself has no `'V dobj'` pattern
// (act1/verbs.ts), so it could never reach this object handler on its own;
// `CLIMB` is the only verb doing any work here.
const climbUpText =
  'Ten minutes of ladder with a warm pipe going the other way past your right\nshoulder, and then a square of light, and then a plant room that is going to\nfeel cold.';

const climbEffects: Effect[] = [{ say: climbUpText }, { goto: ACT3_COOLING_PLANT }, { advanceClock: 10 }];

const crawl: ObjectDefSlice = {
  location: ACT3_PIPE_CHASE,
  name: 'crawl',
  portable: false,
  nouns: ['shaft', 'chase', 'crawl', 'ladder', 'rungs', 'walls', 'concrete', 'opening', 'handhold'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: crawlExamine }] },
    { verbs: [TOUCH], effects: [{ say: crawlTouch }] },
    { verbs: [CLIMB], effects: climbEffects },
  ],
};

// ---------------------------------------------------------------------------
// §11.3 — Return B, below.
// ---------------------------------------------------------------------------

const returnBLowerExamine =
  'Twelve inches of bare steel, dry, warm to the palm.\n\nIn the plant it was warm at the top of the building. It is warm here. Between\nthose two facts there is nothing but pipe, going down, past the last floor\nthere is.';

const returnBLowerTouch =
  'Warm the way a mug is warm twenty minutes after, which is exactly how warm it\nwas four floors up, which is not how heat behaves in a pipe that is going\nanywhere sensible.';

const returnBLowerFollow =
  'Down. It has been down since the plant floor and it has not offered you a\nbranch, a valve, a tag or a tee in the whole of that distance.\n\nA pipe with no branches on it is a pipe with one customer.';

const returnBLowerListen =
  'Water, inside it, going the way water goes when something is pushing it: a\nsteady mid-range note with no gaps in it, and it is going *up*.';

const returnBLower: ObjectDefSlice = {
  location: ACT3_PIPE_CHASE,
  name: 'Return B',
  portable: false,
  // "return" is safe as a bare noun here (see this file's own header note) —
  // the chase has no other pipe object competing for it.
  nouns: ['return b', 'b', 'return', 'pipe', 'warm pipe', 'bare pipe', 'steel', 'lagging'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: returnBLowerExamine }] },
    { verbs: [TOUCH], effects: [{ say: returnBLowerTouch }] },
    // "FOLLOW RETURN B" — V_FOLLOW (act1/ids.ts) is a plain 'V dobj' verb
    // with no NPC-only dispatch anywhere in the engine (checked: `respond.
    // ts`'s only NPC-specific routing is keyed on `NPC_VERB_IDS.talk`, a
    // different verb entirely), so an object handler here answers it fine.
    // "TRACE RETURN B" is NOT wired: V_FOLLOW's own word list (act1/verbs.
    // ts) is `['follow']` only, and adding "trace" to it is an edit to a
    // shared act1 file this task does not own — flagged in this task's
    // report as an unauthored synonym gap.
    { verbs: [V_FOLLOW], effects: [{ say: returnBLowerFollow }] },
    // "LISTEN TO RETURN B" — LISTEN's own word list already includes
    // "listen to" as a literal phrase (act1/verbs.ts), so this resolves
    // without any change there. "PUT EAR TO PIPE" is NOT wired (no verb in
    // this build reaches that phrasing) — flagged in this task's report.
    { verbs: [LISTEN], effects: [{ say: returnBLowerListen }] },
  ],
};

// ---------------------------------------------------------------------------
// §11.4 — the condensation.
// ---------------------------------------------------------------------------

const condensationExamine =
  'Beads on the cold surfaces and none on the warm ones, which is how you know\nwhich is which without touching anything at all.\n\nThe ladder strings run wet. The wall opposite Return B runs wet. Return B\nitself is dry from top to bottom, because nothing condenses on a pipe that is\nwarmer than the air around it.\n\nEvery so often something lets go above you and goes past.';

const condensationTaste =
  'It is condensate off a concrete wall in a shaft under a building you are not\nsupposed to be in.\n\nIt tastes of concrete, which is at least honest.';

const condensation: ObjectDefSlice = {
  location: ACT3_PIPE_CHASE,
  name: 'condensation',
  portable: false,
  nouns: ['condensation', 'water', 'wet', 'film', 'damp', 'beads', 'drips', 'sweat', 'moisture'],
  handlers: [
    { verbs: [EXAMINE], effects: [{ say: condensationExamine }] },
    // "TASTE WATER"/"DRINK" (dobj form) — bare "DRINK" with no object named
    // is not reachable here (V_DRINK's own pattern is 'V dobj' only, per
    // act1/verbs.ts; there is no bare-verb form to intercept), same engine
    // constraint noted throughout this file.
    { verbs: [TASTE, V_DRINK], effects: [{ say: condensationTaste }] },
  ],
};

export const ACT3_PIPE_CHASE_OBJECTS: Record<string, ObjectDefSlice> = {
  [ACT3_CRAWL]: crawl,
  [ACT3_RETURN_B_LOWER]: returnBLower,
  [ACT3_CONDENSATION]: condensation,
};

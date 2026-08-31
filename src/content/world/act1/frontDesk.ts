// Front Desk & Lobby
// (`docs/superpowers/specs/2026-09-01-front-desk-prose.md`) — the room the
// Landing's stairs were pointing at. Replaces the Landing's own §15.2 build
// boundary (removed from `landing.ts`); the boundary now lives on this
// room's own street door (§9 there).

import type { Cond } from '../../../engine/cond';
import type { HandlerDef, OnEnterRule, RoomDefSlice } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { LISTEN, WAIT, checkDateText, findNameText, telephoneCallText } from './verbs';
import { CLUE_REGISTER_GAP, FLAG_MET_MARLOW, FLAG_REGISTER_GAP_SEEN, FRONT_DESK, LANDING, MAIN_STREET, MARLOW, STREET_DOOR, V_CALL, V_CHECK_DATE, V_FIND_MY_NAME, V_LOOK_OUTSIDE, V_WHOAMI } from './ids';
import { ACT2_MEM_M15, ACT2_SEEN_DESK_EMPTY, ACT2_STARTED } from '../act2/ids';

const FIRST_SIGHT = [
  'The stairs come down into a lobby built for more people than are using it. Ten or eleven chairs stand around a low table with the magazines squared to the corner, and none of them are lit; all the light in this room comes off one green-shaded lamp at the front desk and gives out about four feet from where it starts.',
  'There is a man behind the desk. He is awake, and he was awake before you came down, and he watches you arrive without doing anything about it. Behind him, a board of numbered hooks with keys on most of them. A radio is on under the counter, turned below the point where it carries words. A coffee pot stands on a ring and has been standing on it too long.',
  'On the counter, a brass bell and a tall book, left open and facing out the way a book is left for people who are expected. The street door is at the front, half glass, with the town on the other side of it being dark about it.',
].join('\n\n');

const RETURN_VISIT =
  'The lobby, the lamp, and the chairs nobody is in. Marlow behind the desk with the radio low, the key board behind him, and the register open on the counter facing out. The street door is at the front. The stairs go back up behind you.';

const MET_MARLOW: Cond = { flag: FLAG_MET_MARLOW };

// D0 amendment — presence-and-passage prose document §2.1, transcribed
// exactly (hard rule 5). Two rules, prepended above the shipped pair
// (unedited): the long variant fires the first time the desk is found
// empty (`ACT2_SEEN_DESK_EMPTY`, set by this room's own `onEnter` below,
// per the document's §5.3 q1 recommendation — `FLAG_MET_MARLOW` is set on
// first entry, long before `act2_started` can ever be true, so it cannot
// gate "first empty" itself), the short variant every time after.
const DESK_EMPTY_FIRST =
  'The lamp is on and giving out about four feet from where it starts, the same as it does with a man sitting under it. Most of the hooks still have their keys. The register is open on the counter, still facing out at whoever is next.\n\nPropped against the bell, a card: BACK SHORTLY, in a hand that has written it many times.';

const DESK_EMPTY_AFTER =
  'The lamp, the hooks, the chairs nobody is in, and the register open on the counter facing out. The card is still propped against the bell. It is still shortly.';

const MARLOW_ABSENT: Cond = { not: { npcAt: [MARLOW, FRONT_DESK] } };

// D2-C amendment (D2 prose doc §18.4) — retro-visibility, one clause, keyed on M15, appended to the lobby description (the final, unconditional rule).
const RETURN_VISIT_WITH_M15 = `${RETURN_VISIT}\n\nThe stair carpet has been brushed up the middle since you came down it, in one direction, by somebody who did the whole flight.`;

const description: ProseRule[] = [
  { when: { all: [{ flag: ACT2_STARTED }, MARLOW_ABSENT, { not: { flag: ACT2_SEEN_DESK_EMPTY } }] }, text: DESK_EMPTY_FIRST },
  { when: { all: [{ flag: ACT2_STARTED }, MARLOW_ABSENT] }, text: DESK_EMPTY_AFTER },
  { when: { not: MET_MARLOW }, text: FIRST_SIGHT },
  { when: { memory: ACT2_MEM_M15 }, text: RETURN_VISIT_WITH_M15 },
  { text: RETURN_VISIT },
];

const smell = 'Coffee that has been standing on heat since about ten, floor wax, and cold coming in under the street door.';

const listen: string[] = [
  'The radio, low. The pot ticking on its ring. Two clocks, one behind the desk and one over the door, running a second or two apart from each other in a way that nobody in thirty years has thought worth correcting.',
];

// §2.3's note: variant 1's second sentence (the two clocks) is optional set
// dressing per the doc's own note — kept, since it's transcribed prose and
// hard rule 5 leaves cutting it to the main session, not this builder.

const whoAmIText =
  'There is a man in this room whose job for thirty years has been to write that down, and a book on the counter that it was written in.\n\nNeither of them currently has it.';

const waitText = 'The radio plays. Marlow does not fill the silence, and it turns out neither do you.';

const lookOutsideText =
  'Brick across the road, unlit. Further along, something tied to a rail shifts its weight from one foot to the other and settles.\n\nNo lights in any window you can see, which at this hour is either ordinary or the town telling you something.';

// §9's own build boundary is REMOVED here (main-street-prose §8: "the
// street is a real room now, and that door leads somewhere" — deleted
// rather than kept-but-unreferenced like `LANDING_BOUNDARY_GATE`, since
// `system.buildBoundary` must have exactly one copy in the game and its
// copy now lives on `main_street`'s own `north`/`south`/`west` exits,
// `mainStreet.ts`). `STREET_DOOR`'s outward `travelText` — front-desk-
// prose §7's own already-authored line, "for whenever Main Street lands" —
// is wired below instead.
const streetDoorTravelText =
  'The spring bell over the frame goes off, the loudest thing that has happened in this building tonight, and the cold arrives around you all at once.';

/**
 * §4.2's "find my name" — bare, multi-word verb words (`V_FIND_MY_NAME`,
 * `verbs.ts`), needs a room-level handler to run its effects (the same
 * gap-3/4 shape as room 1's `STAND`/terminal-login handlers) since a bare
 * verb's own `VerbDef.default` can only ever render `Prose`, never an
 * `Effect`.
 */
const roomHandlers: HandlerDef[] = [
  { verbs: [LISTEN], effects: [{ say: listen }] },
  { verbs: [V_WHOAMI], effects: [{ say: whoAmIText }] },
  { verbs: [WAIT], effects: [{ say: waitText }] },
  { verbs: [V_LOOK_OUTSIDE], effects: [{ say: lookOutsideText }] },
  { verbs: [V_CHECK_DATE], effects: [{ say: checkDateText }] },
  {
    verbs: [V_FIND_MY_NAME],
    effects: [{ say: findNameText }, { set: [FLAG_REGISTER_GAP_SEEN, true] }, { grantClue: CLUE_REGISTER_GAP }],
  },
  // F2 prose §4 (register 151) — bare CALL/HANG UP (no dobj) at the Front
  // Desk, overriding `V_CALL`'s own global `default` (`telephoneText`,
  // untouched per ruling) for this room only. The telephone object's own
  // handler (`objects/frontDesk.ts`) covers the dobj-resolved forms
  // (USE PHONE, CALL/ANSWER <phone/telephone>).
  { verbs: [V_CALL], effects: [{ say: telephoneCallText }] },
];

const onEnter: OnEnterRule[] = [
  { effects: [{ set: [FLAG_MET_MARLOW, true] }] },
  // §5.3 q1's recommendation — sets AFTER the description above has
  // already rendered (`move.ts`'s `renderArrival` order), so the very
  // first empty-desk render still gets the long variant.
  { when: { all: [{ flag: ACT2_STARTED }, MARLOW_ABSENT] }, once: true, effects: [{ set: [ACT2_SEEN_DESK_EMPTY, true] }] },
];

export const frontDeskRoom: RoomDefSlice = {
  name: 'Front Desk',
  area: 'act1',
  map: { x: 1, y: 1 },
  description,
  onEnter,
  exits: [
    {
      dir: 'up',
      to: LANDING,
      travelText:
        "You take the stairs back up. The lamp's light gets six treads with you and then gives up, and the rest you do from memory of a house you have lived in for three weeks.",
    },
    { dir: 'out', to: MAIN_STREET, door: STREET_DOOR, travelText: streetDoorTravelText },
    // §9's fire list explicitly names NORTH alongside OUT/LEAVE/EXIT — a
    // second exit sharing the same door and text, since NORTH is
    // `DIRECTION_VERB_IDS.n`, a separate verb id from OUT.
    { dir: 'n', to: MAIN_STREET, door: STREET_DOOR, travelText: streetDoorTravelText },
  ],
  handlers: roomHandlers,
};

// The Sheriff's Office
// (`docs/superpowers/specs/2026-09-03-act1-wave2-prose.md` PART THREE) —
// Zone 1 room 8, and the home of Sheriff Whitlock (`whitlock.ts`). Canon
// register entry 28: she has a night post — see `whitlock.ts`'s own
// schedule comment.

import type { ExitDefSlice, HandlerDef, RoomDefSlice } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { LISTEN, SLEEP, SMELL, WAIT } from './verbs';
import { cellSleepText } from './objects/sheriffOffice';
import {
  FLAG_MET_WHITLOCK,
  FLAG_VISITED_SHERIFF_OFFICE,
  FLAG_WHITLOCK_RAN_YOU,
  MAIN_STREET,
  SHERIFF_OFFICE,
  SHERIFF_OFFICE_NO_EXIT_GATE,
  V_LOOK_UP,
  V_TYPE_TERMINAL,
  V_WHAT_YEAR,
  V_WHOAMI,
} from './ids';

// ---------------------------------------------------------------------------
// §12.1 — description
// ---------------------------------------------------------------------------

const FIRST_SIGHT = [
  'The county keeps its law in a storefront like everything else on this street, with SHERIFF on the glass in gold and a blind pulled down behind it that somebody left an inch short. Inside it is warm, and lit, and smells of coffee that has been hot for a long time.',
  'One room, divided by a counter with a hinged flap in it. On the near side, three chairs and a rack of pamphlets. On the far side a desk with a screen on it, a map of the county filling most of the wall, and a wire door standing across the corner with shelves behind it.',
  'Past the desk an open doorway, and past that a cell with its door hooked back and the bunk made up.',
  'Sheriff Whitlock is at the desk with a paper form in front of her and her hands off the keyboard, waiting to hear what you came in for.',
].join('\n\n');

const RETURN_VISIT =
  'Warm, and lit, and the coffee still going. The counter, the map, the wire door, the cell with its door hooked back. Whitlock at the desk with something in front of her that is not you.';

const description: ProseRule[] = [
  { when: { not: { flag: FLAG_VISITED_SHERIFF_OFFICE } }, text: FIRST_SIGHT },
  { text: RETURN_VISIT },
];

// ---------------------------------------------------------------------------
// §12.2 — room-level senses
// ---------------------------------------------------------------------------

const smell = 'Coffee that stopped being coffee about two hours ago, gun oil, and the paper smell of a room where things are kept.';

const listen = "A radio set on the desk, turned down to where it is only a texture. The electric clock. Whitlock's pen, and then not.";

const lookUp = 'A ceiling fan turning slowly in a room that has no use for one, and a strip light with one tube newer than the other.';

// ---------------------------------------------------------------------------
// §12.4 — room-specific responses
// ---------------------------------------------------------------------------

const waitText = "You wait. Whitlock's pen goes on. The radio says a road number and a word you do not catch, and stops.";

const whoAmIRan = 'There is a machine in this room that answers that question for a living, and a woman who knows how to ask it.\n\nYou have already had the answer.';
const whoAmINotRan = 'There is a machine in this room that answers that question for a living, and a woman sitting in front of it.';
const whoAmIText: ProseRule[] = [
  { when: { flag: FLAG_WHITLOCK_RAN_YOU }, text: whoAmIRan },
  { text: whoAmINotRan },
];

const whatYearText = 'You could work at it off the pamphlets and the forms and the newer tube in the strip light. Or you could ask the sheriff, who is four feet away.';

// §12.3.2's "type"/"touch keyboard" bare form — the same bare verb your_room
// claims for USER NOT RECOGNIZED (`verbs.ts`'s `V_TYPE_TERMINAL`), overridden
// here for this room only (same idiom as `your_room`'s own room-level
// handler) so a bare "type" in the sheriff's office reaches this room's own
// text rather than the terminal-login family.
const useTerminalText =
  'You get a hand as far as the counter flap. Whitlock turns the screen two degrees further away with one finger and does not stop what she is doing.\n\n"That one\'s mine," she says. "Ask me and I\'ll look."';

const roomHandlers: HandlerDef[] = [
  { verbs: [SMELL], effects: [{ say: smell }] },
  { verbs: [LISTEN], effects: [{ say: listen }] },
  { verbs: [V_LOOK_UP], effects: [{ say: lookUp }] },
  { verbs: [WAIT], effects: [{ say: waitText }] },
  { verbs: [V_WHOAMI], effects: [{ say: whoAmIText }] },
  { verbs: [V_WHAT_YEAR], effects: [{ say: whatYearText }] },
  { verbs: [V_TYPE_TERMINAL], effects: [{ say: useTerminalText }] },
  // §12.3.5's bare "sleep"/"lie down" — see `objects/sheriffOffice.ts`'s own note on why this can't be a dobj-based object handler.
  { verbs: [SLEEP], effects: [{ say: cellSleepText }] },
];

// Both flags set on first entry — `met_whitlock` this way rather than via
// her own greeting rule 1 (which the schema can never run an `Effect` from
// — see `whitlock.ts`'s own header note, same engine gap `frontDesk.ts`/
// `marlow.ts` already document for `met_marlow`).
const onEnter: RoomDefSlice['onEnter'] = [{ effects: [{ set: [FLAG_VISITED_SHERIFF_OFFICE, true] }, { set: [FLAG_MET_WHITLOCK, true] }] }];

// §12.5's "every other direction — in-world, not the build boundary."
const noOtherExitText = 'The office is a counter, a desk, and a cell, and you are on the public side of the first of them.';

const travelTextOut = 'The door lets you out past the blind, and the cold takes the coffee off you inside three paces.';

const otherDirections: ExitDefSlice[] = (['s', 'e', 'w', 'nw', 'se', 'up', 'down'] as const).map((dir) => ({
  dir,
  to: SHERIFF_OFFICE,
  door: SHERIFF_OFFICE_NO_EXIT_GATE,
  blockedText: noOtherExitText,
}));

export const sheriffOfficeRoom: RoomDefSlice = {
  name: "Sheriff's Office",
  aliases: ['sheriff', "sheriff's office", 'sheriff office'],
  area: 'act1',
  map: { x: -1, y: 2 },
  description,
  onEnter,
  exits: [
    { dir: 'out', to: MAIN_STREET, travelText: travelTextOut },
    { dir: 'n', to: MAIN_STREET, travelText: travelTextOut },
    { dir: 'ne', to: MAIN_STREET, travelText: travelTextOut },
    ...otherDirections,
  ],
  handlers: roomHandlers,
};

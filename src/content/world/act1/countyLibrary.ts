// The County Library (Records Annex)
// (`docs/superpowers/specs/2026-09-04-act1-wave3-prose.md` PART TWO) — Zone
// 1 room 9. Reached southeast of Main Street (§15.3 — wired by a separate
// concurrent task, not this one); one exit back (`out`/`nw`, per this
// task's own instructions, overriding §10's own exits table of
// `out`/`up`/`north`/`leave`/`exit` — see this task's report).
//
// §10's own note: no WHAT YEAR IS IT response for this room — it falls
// through to the global (V_WHAT_YEAR's own `default`, main-street-prose's
// `whatYearText`, `verbs.ts`), matching `generalStore.ts`'s own precedent
// for exactly this "no room override" call (§16.2/§16.3's own ruling: this
// room instead makes the year structurally unavailable and never mentions
// it). Nothing is wired here for it.

import type { ExitDefSlice, HandlerDef, RoomDefSlice } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { HELLO, LISTEN, SLEEP, SMELL, WAIT, YELL } from './verbs';
import { readCardsEffects, typeReclamationEffects } from './objects/countyLibrary';
import { COUNTY_LIBRARY, COUNTY_LIBRARY_NO_EXIT_GATE, FLAG_VISITED_LIBRARY, MAIN_STREET, V_LOOK_UP, V_LOOK_UP_SUBJECT, V_TYPE_RECLAMATION, V_TYPE_TERMINAL, V_WHOAMI } from './ids';

// ---------------------------------------------------------------------------
// §8.1 — description
// ---------------------------------------------------------------------------

const FIRST_SIGHT = [
  "The library proper is up six steps behind its own front door, dark, with a brass plate and a shut mouth. The annex is round the side and down two, in what was built as a coal cellar and has been the county's paper memory ever since somebody worked out that paper wants somewhere cool.",
  'Its door has no lock in the hole where a lock goes. Taped to the glass, a card in a firm hand: RECORDS ANNEX. OPEN. PLEASE SIGN THE BOOK AND MIND THE LAMP.',
  'Inside, one room, low and long and cold the way a cellar is cold in every weather. A bank of steel drawers runs the whole north wall, each with a label in a brass window. A card cabinet in oak stands where somebody put it and nobody since has moved it. On a table, a terminal, awake.',
  'And in the middle of the floor a reader with its lamp on, throwing a page of newsprint four feet wide onto ground glass. Somebody left it running.',
].join('\n\n');

const RETURN_VISIT =
  'The cold, the drawer bank, the oak cabinet, the terminal, and the reader with its page still up on the screen. The steps to the street behind you.';

const description: ProseRule[] = [
  { when: { not: { flag: FLAG_VISITED_LIBRARY } }, text: FIRST_SIGHT },
  { text: RETURN_VISIT },
];

// ---------------------------------------------------------------------------
// §8.2 — room-level senses
// ---------------------------------------------------------------------------

const smell = 'Cool paper, and the vinegar smell old film gets, faint and everywhere at once. Under it, the dust a building makes rather than the dust people make.';

const listen = "The reader's fan. The lamp inside it ticking as it heats. Once, above your head, the building settling on a timetable of its own.";

const lookUp = 'Floor joists whitewashed a long time ago, and a run of pipe with a hand-lettered tag wired to it. The ceiling is nine inches lower than you keep expecting.';

// ---------------------------------------------------------------------------
// §10 — room-specific responses
// ---------------------------------------------------------------------------

const waitText = 'You wait. The fan. The lamp ticking. Forty-two drawers of everything that ever happened to this county, none of it in any hurry.';

const shoutText = '"Hello," you say, downward, into a cellar. Nothing above the joists moves, and nothing up there was going to.';

const sleepText = 'It is cold, it is quiet, and there is a chair. The chair is the kind libraries buy specifically so nobody sleeps in it, and it works.';

// §9.4's own note: the terminal has no login of any kind ("no password, no
// name, no login... it has decided you are the public") — so this room's
// own WHO AM I override is about the terminal's *search box*, not about
// identity theatre the way the front desk/sheriff's office ones are.
const whoAmIText = 'The box will take anything. You have nothing to put in it.';

// §9.3/§9.4's own bare-phrase verbs (`ids.ts`'s own comment on
// `V_LOOK_UP_SUBJECT`/`V_TYPE_RECLAMATION`): no natural `dobj` to hang a
// handler on, so these two run their effects here, reusing the exact same
// text/effects as `card_catalogue`'s own READ/SEARCH/OPEN handler and
// `catalogue_terminal`'s own SEARCH/USE handler (`objects/countyLibrary.ts`)
// rather than a second, drifting copy — same idiom as `sheriffOffice.ts`'s
// own `V_TYPE_TERMINAL` room-level handler.
const roomHandlers: HandlerDef[] = [
  { verbs: [SMELL], effects: [{ say: smell }] },
  { verbs: [LISTEN], effects: [{ say: listen }] },
  { verbs: [V_LOOK_UP], effects: [{ say: lookUp }] },
  { verbs: [WAIT], effects: [{ say: waitText }] },
  { verbs: [YELL, HELLO], effects: [{ say: shoutText }] },
  { verbs: [SLEEP], effects: [{ say: sleepText }] },
  { verbs: [V_WHOAMI], effects: [{ say: whoAmIText }] },
  { verbs: [V_LOOK_UP_SUBJECT], effects: readCardsEffects },
  { verbs: [V_TYPE_RECLAMATION], effects: typeReclamationEffects },
  // Bare "type"/"touch keyboard" — `your_room`'s `V_TYPE_TERMINAL` would
  // otherwise render USER NOT RECOGNIZED in here (found in the v0.7.0
  // playtest); in this room the only keyboard is the catalogue's, so it is
  // the same search. Same override idiom as `sheriffOffice.ts`.
  { verbs: [V_TYPE_TERMINAL], effects: typeReclamationEffects },
];

const onEnter: RoomDefSlice['onEnter'] = [{ effects: [{ set: [FLAG_VISITED_LIBRARY, true] }] }];

// §10's "every other direction — in-world, not the build boundary."
const noOtherExitText = 'One room, one door, and a locked one at the far end. The library over your head is somebody else\'s building until morning.';

const travelTextOut = 'Two steps up, and the street turns out to be colder than the cellar was, which you would not have guessed.';

// Real exits (§10's own exits table, this task's brief): `out`/`up`/
// `north`/`leave`/`exit` -> `main_street` — `out` (canonical) plus the
// reciprocal compass `nw` (the library sits southeast of Main Street —
// §15.3), plus `up`/`n` (the doc's own literal words). "leave"/"exit" are
// already `out`'s own words (`verbs.ts`).
const otherDirections: ExitDefSlice[] = (['s', 'e', 'w', 'ne', 'se', 'sw', 'down'] as const).map((dir) => ({
  dir,
  to: COUNTY_LIBRARY,
  door: COUNTY_LIBRARY_NO_EXIT_GATE,
  blockedText: noOtherExitText,
}));

export const countyLibraryRoom: RoomDefSlice = {
  name: 'County Library — Records Annex',
  aliases: ['county library', 'library', 'records annex', 'annex'],
  area: 'act1',
  map: { x: 2, y: 3 },
  description,
  onEnter,
  exits: [
    { dir: 'out', to: MAIN_STREET, travelText: travelTextOut },
    { dir: 'up', to: MAIN_STREET, travelText: travelTextOut },
    { dir: 'n', to: MAIN_STREET, travelText: travelTextOut },
    { dir: 'nw', to: MAIN_STREET, travelText: travelTextOut },
    ...otherDirections,
  ],
  handlers: roomHandlers,
};

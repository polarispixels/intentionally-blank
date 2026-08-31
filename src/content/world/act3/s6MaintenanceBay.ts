// Act III, Stage D5, task F — the S6 Maintenance Bay room shell
// (`docs/superpowers/specs/2026-09-13-stage-d5-prose.md` §3, §16, §39, §40).
// Object definitions are `objects/s6MaintenanceBay.ts`; this file is the
// description, `onEnter` (clue, flag, checkpoint — no text, §39.3), the two
// exits (`up` to the Pipe Chase, `east`/`in` to the Archive Hub), and every
// room-level handler: the ambient senses (§16) and the bare fixed-phrase
// verbs that can never resolve a `dobj` at all (§6.4, §6.6, §8.3-§8.5,
// §5.4 — `RoomDefSlice.handlers` are the only rung a `'V'`-pattern verb can
// ever reach, `actions.ts`'s `performAction`: object handlers are consulted
// only once a `dobj` has resolved, which a bare verb never has).
//
// Every string below is transcribed verbatim from the prose doc (hard rule
// 5).

import type { ExitDefSlice, OnEnterRule, RoomDefSlice } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { HELLO, LISTEN, SLEEP, SMELL, WAIT, YELL } from '../act1/verbs';
import { V_ACT2_WAIT_UNTIL_AFTERNOON, V_ACT2_WAIT_UNTIL_EVENING, V_ACT2_WAIT_UNTIL_MORNING, V_ACT2_WAIT_UNTIL_NIGHT } from '../act2/ids';
import { NIGHT } from '../act2/calendar';
import {
  ACT3_CHECKPOINT_S6,
  ACT3_CLUE_CHAIRS,
  ACT3_CLUE_UV_GHOST,
  ACT3_PIPE_CHASE,
  ACT3_REACHED_S6,
  ACT3_S6_ARCHIVE_HUB,
  ACT3_S6_MAINTENANCE_BAY,
  ACT3_TOOK_NOLAN_BADGE,
  ACT3_UV_LAMP_ON,
  ACT3_UV_SEEN_ARM,
  V_ACT3_ARM_UNDER_LAMP,
  V_ACT3_BADGE_UNDER_LAMP,
  V_ACT3_HANG_BADGE,
  V_ACT3_NOLAN_UNDER_LAMP,
  V_ACT3_NOTEBOOK_UNDER_LAMP,
  V_ACT3_SEARCH_RAIL_FOR_JULES,
} from './ids';
import { ACT2_NOLAN_BADGE } from '../act2/ids';
import { ACT3_NOLAN_HOOK } from './ids';
import {
  armUnderLampRules,
  badgeUnderLampText,
  hooksSearchForJulesText,
  nolanUnderLampText,
  notebookUnderLampText,
} from './objects/s6MaintenanceBay';

// ---------------------------------------------------------------------------
// §3.1 — description.
// ---------------------------------------------------------------------------

const firstSightDayText =
  'The ladder ends on a floor, and the floor is tiled.\n\nNot plant tile. The small hard cream tile of a hospital corridor, laid true,\nwith the grout gone dark in the traffic lanes and clean everywhere else, and a\nfall on it toward a brass grating in the middle of the room.\n\nThe room is long. Down the whole of it, in rows facing the same way, there are\nchairs — reclining chairs, upholstered, on pedestals, footrests up and\nheadrests set — and the rows go back past what the lights are prepared to do\nabout them.\n\nAlong the left-hand wall, at about the height of a coat rail, a rail of hooks\nwith names underneath them.\n\nThere is a lamp on a jointed arm at the head of the nearest chair. There is a\nwhite steel cabinet on the wall by the far door. There is a set of grey\ncoveralls on a hanger at the end of the rail.\n\nEvery chair is empty, and every one of them has been set to a person.';

const firstSightNightText =
  'The ladder ends on a floor, and the floor is tiled, and the room is full.\n\nRows of reclining chairs facing the same way, going back past what the lights\nare prepared to do about them, and in the chairs there are people.\n\nThey are asleep. They are in their own clothes. There is a strap across each\nchest and one across each pair of knees and a cuff at each wrist, and the\nstraps are lined with sheepskin, and nobody is pulling against anything.\n\nThe nearest woman has her cardigan on and her reading glasses folded into the\nbreast pocket of it. The man past her came down here in a good coat and\nsomebody hung the coat up rather than leaving it over his knees.\n\nAlong the left-hand wall, a rail of hooks with names underneath them. At the\nhead of the nearest chair, a lamp on a jointed arm. On the wall at the far end,\nbeside a door, a white steel cabinet.\n\nNobody looks up, because nobody is awake.';

const returningNightText =
  'The rows, full, facing the wall with nothing on it. The rail of hooks. The\nlamp on its arm at the head of the first chair.\n\nThe far door is the archive. The steel steps behind you go back up into the\npipe.';

const otherwiseText =
  'The rows, empty, facing the wall with nothing on it. The rail of hooks along\nthe left. The grating in the middle of the floor and the fall of the tile\ntoward it.\n\nThe far door is the archive. The steel steps behind you go back up into the\npipe.';

const description: ProseRule[] = [
  { when: { all: [{ not: { visited: ACT3_S6_MAINTENANCE_BAY } }, { not: NIGHT }] }, text: firstSightDayText },
  { when: { all: [{ not: { visited: ACT3_S6_MAINTENANCE_BAY } }, NIGHT] }, text: firstSightNightText },
  { when: NIGHT, text: returningNightText },
  { text: otherwiseText },
];

// ---------------------------------------------------------------------------
// First `onEnter` (§3, §39.3): grants R9, sets the Act III milestone flag,
// then the checkpoint (no text). `act3_q_when_unwatched`'s own
// `answerWhen`/M9's own `trigger` are both ambient (`knowledge.ts`) and
// evaluate on this same tick, after this room's own `onEnter` effects have
// already run — the order the doc's own §39.3 asks for ("description →
// clue → question answered → flag → checkpoint → M9") falls out of that
// automatically: this rule fires clue-then-flag-then-checkpoint, and the
// tick's own ambient question/memory steps run after.
// ---------------------------------------------------------------------------

const onEnter: OnEnterRule[] = [
  { effects: [{ grantClue: ACT3_CLUE_CHAIRS }, { set: [ACT3_REACHED_S6, true] }, { checkpoint: ACT3_CHECKPOINT_S6 }] },
  // Every entry (v0.15.0 playtest): Nolan's badge hangs on his hook at night
  // unless the player already carries it (D2's loan), and is on him by day.
  {
    once: false,
    effects: [
      {
        if: {
          when: { has: ACT2_NOLAN_BADGE },
          then: [],
          else: [{ if: { when: NIGHT, then: [{ move: [ACT2_NOLAN_BADGE, { on: ACT3_NOLAN_HOOK }] }], else: [{ move: [ACT2_NOLAN_BADGE, 'nowhere'] }] } }],
        },
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// §39.4 — exits. `up`/chase/steps to the Pipe Chase (1 min, §14.3's own
// text); `east`/`in` to the Archive Hub (no travelText — the arrival is
// that room's own description, same convention `pipeChase.ts`'s own
// `out`/`sideways` exit to S5 uses). Neither is gated: "nothing on this
// floor is locked" (§39.4's own header).
// ---------------------------------------------------------------------------

const upExitText = 'Four steps, and the opening, and the cold of the shaft after the room.';

const upExit: ExitDefSlice = { dir: 'up', to: ACT3_PIPE_CHASE, travelText: upExitText, minutes: 1 };
const eastExit: ExitDefSlice = { dir: 'e', to: ACT3_S6_ARCHIVE_HUB };
const inExit: ExitDefSlice = { dir: 'in', to: ACT3_S6_ARCHIVE_HUB };

// ---------------------------------------------------------------------------
// §16 — room-level senses and responses.
// ---------------------------------------------------------------------------

const listenNightText =
  'Breathing, at a lot of different rates, which after a minute stops sounding\nlike anything at all.\n\nAnd past the far wall, somewhere behind the archive and beyond it, machinery:\nrunning, and stopping, and a pair of doors opening and closing on a cycle that\nhas nothing to do with you.\n\nIt runs. It stops. It runs again. Whatever it is bringing, it is bringing it a\nfew at a time, and it was doing it before you got here.';

const listenOtherwiseText =
  'Air moving a long way off, on its way somewhere else, and under it the floor,\ncarrying the note you have been standing on since Sublevel 5.\n\nNothing in this room is making a sound. Rooms with people in them hum a little\neven when the people are out. This one does not.';

const listenRules: ProseRule[] = [
  { when: NIGHT, text: listenNightText },
  { text: listenOtherwiseText },
];

const smellText =
  'Clean. Laundry, floor soap, warm dust off a light fitting, and the faint flat\nsmell of the inside of a new appliance.\n\nIt is the smell of a place that is looked after by somebody who is not in it.';

const waitText = 'Nothing changes. At night, nothing changes and everybody goes on breathing; by\nday, nothing changes and the paper stays fresh.';

const restText = 'There is a chair four feet from you with the paper fresh on it and the footrest\nup.\n\nYou stay on your feet.';

const shoutText =
  'The room takes it and gives you very little of it back, because a room with\nupholstery in it and rows of people in the upholstery is exactly the shape of a\nroom that does not echo.';

export const s6MaintenanceBayRoom: RoomDefSlice = {
  name: 'Maintenance Bay',
  aliases: ['bay', 'maintenance bay', 's6', 'sublevel 6'],
  description,
  onEnter,
  exits: [upExit, eastExit, inExit],
  handlers: [
    { verbs: [LISTEN], effects: [{ say: listenRules }] },
    { verbs: [SMELL], effects: [{ say: smellText }] },
    { verbs: [WAIT], effects: [{ say: waitText }] },
    { verbs: [SLEEP, V_ACT2_WAIT_UNTIL_MORNING, V_ACT2_WAIT_UNTIL_AFTERNOON, V_ACT2_WAIT_UNTIL_EVENING, V_ACT2_WAIT_UNTIL_NIGHT], effects: [{ say: restText }] },
    { verbs: [YELL, HELLO], effects: [{ say: shoutText }] },
    // §5.4 — "SEARCH HOOKS FOR JULES"/"LOOK FOR JULES ON THE RAIL."
    { verbs: [V_ACT3_SEARCH_RAIL_FOR_JULES], effects: [{ say: hooksSearchForJulesText }] },
    // §6.4 — "EXAMINE NOLAN UNDER LAMP"/"PUT NOLAN'S ARM UNDER LAMP."
    { verbs: [V_ACT3_NOLAN_UNDER_LAMP], when: { all: [NIGHT, { flag: ACT3_UV_LAMP_ON }] }, effects: [{ say: nolanUnderLampText }] },
    // §8.3 — "EXAMINE ARM UNDER LAMP"/"PUT ARM UNDER LAMP."
    { verbs: [V_ACT3_ARM_UNDER_LAMP], when: { flag: ACT3_UV_LAMP_ON }, effects: [{ say: armUnderLampRules }, { set: [ACT3_UV_SEEN_ARM, true] }, { grantClue: ACT3_CLUE_UV_GHOST }] },
    // §8.4 — "PUT NOTEBOOK/PAGE/SHEET UNDER LAMP."
    { verbs: [V_ACT3_NOTEBOOK_UNDER_LAMP], effects: [{ say: notebookUnderLampText }] },
    // §8.5 — "PUT BADGE/POLAROID UNDER LAMP"/"SHINE LAMP ON CHAIR."
    { verbs: [V_ACT3_BADGE_UNDER_LAMP], effects: [{ say: badgeUnderLampText }] },
    // §6.6 — "PUT BADGE BACK"/"HANG BADGE ON HOOK."
    {
      verbs: [V_ACT3_HANG_BADGE],
      when: { has: ACT2_NOLAN_BADGE },
      effects: [
        { say: 'Twice round the hook, the way it was. It is not the same as not having taken it, and it is what there is.' },
        { move: [ACT2_NOLAN_BADGE, { on: ACT3_NOLAN_HOOK }] }, // back on the hook, not the floor (v0.15.0 playtest)
        { set: [ACT3_TOOK_NOLAN_BADGE, false] },
      ],
    },
  ],
};

// Act III, Stage D4 task C — S5 Reactor Interface room shell (D4 prose doc
// §9.1, §9.9, §9.10, §21.3, §21.4). Object definitions (the gauge wall, the
// demand dial, the chase bottom, the S6 door/pad, the wall clock, the
// bench/logbook/wall, and the interlock/death) are `objects/
// s5ReactorInterface.ts`; this file is the description, `onEnter`
// (checkpoint, no text — §21.3), the exits (`up` to S1, `down` to the
// chase — §21.4), and the room-level bare-verb senses/handlers that have no
// dobj of their own.

import type { ExitDefSlice, OnEnterRule, RoomDefSlice } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { DROP, HELLO, LISTEN, PUT_IN, SMELL, WAIT, YELL } from '../act1/verbs';
import {
  ACT3_CHASE_BOTTOM,
  ACT3_CHECKPOINT_S5,
  ACT3_PIPE_CHASE,
  ACT3_S1_MECHANICAL_GALLERY,
  ACT3_S5_REACTOR_INTERFACE,
  ACT3_S5_SEEN,
  V_ACT3_CHECK_TIME,
  V_ACT3_LOOK_DOWN_SHAFT,
  V_ACT3_TURN_TO_NORMAL,
  V_ACT3_TYPE_PAD,
  V_THROW,
} from './ids';
import { ACT3_READ_CLOCK_SCRIPT } from './ids';
import { chaseBottomDropDownText, chaseBottomLookDownText, s6PadEffects, s6StairText, turnKeyswitchEffects } from './objects/s5ReactorInterface';
// E1 task M — Luke, the escort, and the door with two things (`docs/
// superpowers/specs/2026-09-18-stage-e1-prose.md` §20, §21.1, §37.1, §37.2).
import { ACT4_LUKE, ACT4_S5_DOWN_GATE } from '../act4/ids';
import { V_ACT4_LISTEN_DOWN } from './ids';
import { chaseBottomListenText } from './objects/s5ReactorInterface';

// ---------------------------------------------------------------------------
// §9.1 — description. Rule 1 is gated on `act3_s5_seen` (set by `onEnter`,
// below), not `{ not: { visited } }` — `move.ts`'s `renderArrival` marks
// `visited` BEFORE rendering `description`, so that idiom is unreachable on
// a genuine first arrival (`pipeChase.ts`'s own header documents the same
// fix for `act3_pipe_chase_seen`).
// ---------------------------------------------------------------------------

const firstSight =
  'The stair comes out on a landing and the landing is the room.\n\nIt is a gallery, long and narrow and lit like a corridor, and it has the\nbuilding\'s reactor on the other side of the left-hand wall behind a\nthickness of concrete you can read off the doorframes.\n\nThe right-hand wall is gauges. Two ranks of them, round-faced, white on\nblack, each in its own bezel with its own brass tag, and every needle in the\nplace is sitting still. Under the gauges runs a bench, and on the bench, under\na hinged cover, there is a dial. Over them, high up, there is a clock.\n\nThe left-hand wall has one door in it: a shield door with a wheel in the middle\nof it, a lamp above the wheel, and a small steel panel beside the lamp.\n\nThe gallery ends in a blank wall with a second door in it, and that door has a\nreader and a keypad, which makes it the only door you have seen in this\nbuilding that wants two things.\n\nIn the floor at that end, where the two big returns come through and turn\ndown, there is a formed opening with a ladder in it.\n\nIt is quiet in here. Not empty quiet — there is a note in it, low, that you\nget in the back of the jaw before the ear — but after the hall and the plant\nit reads as quiet, and the whole of the gallery is lit and long and nobody is\nstanding in it.';

const nightVisit =
  'The gallery, lit exactly as it is lit at every other hour, because nothing\ndown here has an opinion about the time.\n\nThe gauges. The bench and the dial. The shield door on the left with its lamp\nout. The second door at the end with its reader and its pad. The opening in\nthe floor with the ladder in it and the warm one of the two pipes going past\nit and down.\n\nThe clock is above the gauges and is the only thing in the room that is not\nmeasuring the building.';

const otherwiseVisit =
  'Gauges on the right, the shield door on the left, the pad door at the end, and\nthe opening in the floor beside it.\n\nStill nobody.';

// E1 task M, §20 — the escort's own "arriving" paragraph ("He walks the
// length of the gallery once...") is wired here, gated on Luke's presence,
// rather than said by the escort script itself — the script's own `goto`
// already re-renders this room's description on arrival (`turn.ts`'s
// location-diff render), so saying it twice (once in the script, once here)
// would either double it or leave the shipped "Still nobody" clause in
// `otherwiseVisit`/`nightVisit` contradicting him standing right there.
// Prepended above every other rule so it wins outright while he is here.
export const lukeAtS5Text =
  'He walks the length of the gallery once, slowly, hands behind his back, past a\nhundred round faces he has no way of reading, and stops at the end wall.';

const description: ProseRule[] = [
  { when: { npcAt: [ACT4_LUKE, ACT3_S5_REACTOR_INTERFACE] }, text: lukeAtS5Text },
  { when: { not: { flag: ACT3_S5_SEEN } }, text: firstSight },
  { when: { clockPhase: 'night' }, text: nightVisit },
  { text: otherwiseVisit },
];

// ---------------------------------------------------------------------------
// `onEnter` — first visit only: the checkpoint (no text, §21.3) and the
// SEEN flag (gates the description rule above, one step later — the same
// order `pipeChase.ts` relies on: `renderArrival` runs `description` before
// `onEnter`, so rule 1 still only ever shows once).
// ---------------------------------------------------------------------------

const onEnter: OnEnterRule[] = [
  { effects: [{ checkpoint: ACT3_CHECKPOINT_S5 }] },
  { effects: [{ set: [ACT3_S5_SEEN, true] }] },
];

// ---------------------------------------------------------------------------
// §21.4 — exits: `up`/stair to S1 (5 min), `down`/chase/opening to the Pipe
// Chase (1 min, §9.6). No travelText authored for either — the arrival is
// the destination's own description, same convention the chase's own
// `out`/`sideways` exit to this room uses (`pipeChase.ts`).
//
// E1 task M, §21.1/§37.1/§37.2 — `door: ACT4_S5_DOWN_GATE` added to
// `downExit`. The gate is a stub object (`objects/s5ReactorInterface.ts`)
// that defaults open (this exit's shipped behavior, unaffected) and is
// permanently closed by §21's own effects the instant the S6 door opens.
// From then on, bare `GO DOWN` here renders `blockedText` (§21.1's own
// stair paragraph) instead of moving to the Pipe Chase — **not** a new exit
// for the stair (§37.1's own warning against shipping E3 early: "the stair
// is §21.1's handler text and not an exit"), just the shipped exit gated
// shut, exactly the "check the exit table before wiring the handler" §37.2
// asks for. `ENTER CHASE`/`ENTER OPENING`/`ENTER LADDER` (the chase bottom
// object's own dobj-resolved handler, below) are a separate mechanism and
// stay reachable regardless — as does the Cooling Plant's own hatch route
// into the same Sublevel 6, so nothing is actually lost by closing this one.
const upExit: ExitDefSlice = { dir: 'up', to: ACT3_S1_MECHANICAL_GALLERY, minutes: 5 };
const downExit: ExitDefSlice = { dir: 'down', to: ACT3_PIPE_CHASE, minutes: 1, door: ACT4_S5_DOWN_GATE, blockedText: s6StairText };

// ---------------------------------------------------------------------------
// §9.10 — room-level senses with no dobj of their own.
// ---------------------------------------------------------------------------

const listenText =
  'The note. It is low enough that most of it arrives through the floor and the\nbench rather than through the air, and it does not change, and after a minute\nof standing still you can no longer tell whether you are hearing it or\nremembering it.';

const smellText = 'Warm paint, warm dust on warm metal, and something faintly like the inside of\na kettle.';

const shoutText = 'It goes down the gallery, comes back off the end wall, and is the loudest\nthing that has happened on this floor in some time.';

const waitText = 'Nothing moves. That is not the room being ominous; that is the room working.';

export const s5ReactorInterfaceRoom: RoomDefSlice = {
  name: 'S5 Reactor Interface',
  aliases: ['s5', 'reactor interface', 'reactor', 'gallery'],
  description,
  onEnter,
  exits: [upExit, downExit],
  handlers: [
  // v0.17.0 — §4.2's LISTEN DOWN, room-answered (see objects file's note).
  { verbs: [V_ACT4_LISTEN_DOWN], effects: [{ say: chaseBottomListenText }] },
    { verbs: [LISTEN], when: { at: ACT3_S5_REACTOR_INTERFACE }, effects: [{ say: listenText }] },
    { verbs: [SMELL], when: { at: ACT3_S5_REACTOR_INTERFACE }, effects: [{ say: smellText }] },
    { verbs: [YELL, HELLO], when: { at: ACT3_S5_REACTOR_INTERFACE }, effects: [{ say: shoutText }] },
    { verbs: [WAIT], when: { at: ACT3_S5_REACTOR_INTERFACE }, effects: [{ say: waitText }] },
    // Bare fixed-phrase verbs (pattern `'V'`, no dobj) — object handlers can
    // never be reached for these (`objects/s5ReactorInterface.ts`'s own
    // header note on each).
    { verbs: [V_ACT3_TURN_TO_NORMAL], when: { at: ACT3_S5_REACTOR_INTERFACE }, effects: turnKeyswitchEffects },
    { verbs: [V_ACT3_TYPE_PAD], when: { at: ACT3_S5_REACTOR_INTERFACE }, effects: s6PadEffects },
    { verbs: [V_ACT3_CHECK_TIME], when: { at: ACT3_S5_REACTOR_INTERFACE }, effects: [{ script: { id: ACT3_READ_CLOCK_SCRIPT } }] },
    { verbs: [V_ACT3_LOOK_DOWN_SHAFT], when: { at: ACT3_S5_REACTOR_INTERFACE }, effects: [{ say: chaseBottomLookDownText }] },
    // Stage D addenda §4.1 — `DROP <thing> DOWN THE SHAFT` / `THROW <thing>
    // DOWN` / `PUT <thing> IN OPENING`, for ANY carried object (the resolved
    // `dobj` is whatever the player is holding, never the chase bottom
    // itself, so this can't be a handler on that object — see
    // `objects/s5ReactorInterface.ts`'s own header note on
    // `chaseBottomDropDownText`). Addenda §8 ruling 4: never a `move` effect
    // here — the object stays held (register 91).
    { verbs: [PUT_IN, DROP, V_THROW], withInstrument: [ACT3_CHASE_BOTTOM], effects: [{ say: chaseBottomDropDownText }] },
  ],
};

// Act I, room 1 — "your room" (prose doc §2, §3).
//
// SCHEMA GAPS FOUND (see this task's report for the full account):
//   - `RoomDefSlice.name` is a plain `string`, not `Prose` — §3.1 wants it
//     state-dependent ("In the Dark" while dark, "A Rented Room" once lit).
//     Neither is wired below: `name` can't vary by state, AND "A Rented
//     Room" itself starts with a noise word (see the `dark`/no-`name` note
//     further down) — so `name` is left unset entirely rather than
//     shipping a truncated or single, un-conditioned string. Both names are
//     themselves flagged as unconfirmed ASSUMPTIONs by the writer, §13 item
//     4 — not yet a main-session ruling either way.
//   - `LOOK UP`/`LOOK DOWN` are wired as their own single-purpose verbs in
//     `verbs.ts` (safe — nobody else declares those two-word phrases).
//
// FIXED (was a schema gap): §3.4's bare `SMELL`/`LISTEN` (no object) used to
// have no `RoomDefSlice` field to live in — `SMELL`/`LISTEN` were already
// declared (`{name}`-templated, object-targeted, `'V dobj'` only) for
// `SMELL FEDORA`/`LISTEN TO TERMINAL` etc, and a bare-safe `'V'` pattern on
// the same verb id would have needed its `default` to serve two
// structurally different renderings from one `Prose` value — not
// expressible. §8 gap 3 adds `RoomDefSlice.handlers` (room-level, checked
// before a bare verb's own `default`), which resolves exactly this: `SMELL`/
// `LISTEN` below now also declare a bare `'V'` pattern (`verbs.ts`), and
// this room's own handlers answer it — no second verb id, no split
// rendering. Prose transcribed verbatim from the design doc's §14.2 (already
// authored, reviewed, and approved there; never wired into code until now).
// Gap 4's fix rides the same mechanism: `STAND` and the terminal login
// attempt (`V_TYPE_TERMINAL`) are also bare-only verbs whose `default`
// could render `Prose` but never run an `Effect` — so `FLAG_STOOD_UP`/
// `FLAG_TERMINAL_TRIED` were declared but never set (ids.ts's own table).
// Room-level handlers run full `Effect[]`, so those two now set their flag
// alongside the exact same text `verbs.ts` already exports.
//
// FIXED (was an architecture gap: `ObjectDefSlice.listedAs`, spec §2.5, was
// never implemented — nothing listed a room's portable contents at all, so
// the fedora's presence had to be baked into this room's own `description`
// prose, where it went stale the instant the player took it off the
// floor). `description` below no longer names the fedora anywhere — the
// "and beside it, crown down, a fedora"/"and a fedora beside it, crown
// down" clauses are deleted outright (not reworded; hard rule 5), not
// moved verbatim into a `listedAs` field, because that field's text is
// `narrative-writer`'s to author, not this task's (see this task's
// report). Left as an open seam: `objects/fedora.ts`'s `FEDORA` object has
// no `listedAs` yet, so as of this change nothing prints "a fedora" in
// this room at all until one is authored — a real, temporary content gap,
// not a bug in `move.ts`'s rendering (`tests/world-act1-playthrough.test.ts`
// is adjusted to match, with the same note).

import type { Cond } from '../../../engine/cond';
import type { EventDef, HandlerDef, RoomDefSlice } from '../../../engine/world';
import type { ProseRule } from '../../../engine/prose';
import { INVENTORY_VERB_ID } from '../../../engine/respond';
import { ROOM_DARK } from './objects/common';
import { SMELL, LISTEN, STAND, standDefault, terminalTypeDefault } from './verbs';
import {
  DOOR,
  FLAG_LAMP_RIGHTED,
  FLAG_ROOM_SEARCHED,
  FLAG_STOOD_UP,
  FLAG_TERMINAL_TRIED,
  FLAG_WINDOW_OPEN,
  FLOOR_LAMP,
  LANDING,
  V_TYPE_TERMINAL,
  YOUR_ROOM,
} from './ids';

/** §15.3's door-open condition — tests the door's actual `open` state, not `FLAG_DOOR_BOLT_DRAWN` (that flag latches true on the first OPEN and never clears, so it would go stale the moment a player closed the door again — see §15.3's own note). */
const DOOR_OPEN: Cond = { objectState: [DOOR, 'open', true] };

// ---------------------------------------------------------------------------
// §2 — the opening beats. Canon-locked: the first two lines ("Darkness." /
// "Your head hurts.") must be the same words, same order, same line breaks
// (spec 02 §19's ending recursion depends on it) — transcribed exactly.
// ---------------------------------------------------------------------------

const OPENING_PARAGRAPHS = [
  'Darkness.',
  'Your head hurts.',
  'Not the diffuse sort that comes with weather, or with regret. This one is structural. A broad ache runs behind your eyes, holding up rather more than it was built to hold. And at the back of your skull, where the skull stops, there is a second pain: smaller, hotter, and considerably more specific. That one has a cause. You can feel the shape of the cause.',
  'You are lying on a floor. There is no mistaking a floor for anything else. A floor does not adjust.',
  'The dark is not quite total. Across the room, a grey rectangle hangs at about the height of a window, admitting no useful light and no information. Somewhere above you a radiator ticks as it cools.',
  'Something thin and cold lies across the back of your hand. Links. A short chain, of the kind that hangs off something. Your fingers close on it before the rest of you has an opinion.',
];

/**
 * Joined into one rendered block (see this file's header on the pacing
 * limitation) — matches `src/content/scenes/mvp-prologue.ts`'s own
 * precedent for "render once at game start" (`OPENING.join('\n')`), the
 * established idiom in this codebase for exactly this problem, since
 * `initialState()` bypasses `firstVisit`/`renderArrival` for the start room.
 */
const OPENING_TEXT = OPENING_PARAGRAPHS.join('\n\n');

// ---------------------------------------------------------------------------
// §3.2 — description
// ---------------------------------------------------------------------------

const DARK_VARIANT_1 =
  'You cannot see. The dark is doing what dark does, which is to make a small room feel like a large one, and a floor feel like the only reliable fact in the world. There is a grey rectangle across the room that is probably a window. There is a chain somewhere near your hand.';
const DARK_VARIANT_2 =
  'Still dark. The room is out there being a room without your supervision. The rectangle has not moved. Neither, in any meaningful sense, have you.';

const LIT_LAMP_FALLEN_FIRST_SIGHT_DOOR_SHUT = [
  'The lamp lies on its side and burns anyway, so every shadow in the room goes up the walls instead of across the floor. Nothing here is where a thing should be, and none of it is where its shadow says it is.',
  'Somebody has gone through this room. The desk is over on its face with its legs in the air; two of its drawers are out and empty on the boards and the third has been worked at and is still shut. Papers cover the floor — not thrown, exactly. Set down. Broken glass catches the light along the baseboard. There is a dark stain on the boards roughly where your head was.',
  'An old computer terminal sits on a stand in the corner. Nobody bothered to knock it over. The air smells of scorched dust off the bulb and, underneath that, of a room that has been cold for a while. The door is shut. The window is not curtained.',
].join('\n\n');

// §15.3 — the door-open variant of "The door is shut." One string covers
// all three lit rules (the doc's own note: it reads correctly against both
// the fallen lamp's shadows going up the walls and the righted lamp's
// ordinary downward light), spliced in verbatim in place of that one
// sentence, leaving the rest of each paragraph untouched.
const LIT_LAMP_FALLEN_FIRST_SIGHT_DOOR_OPEN = [
  'The lamp lies on its side and burns anyway, so every shadow in the room goes up the walls instead of across the floor. Nothing here is where a thing should be, and none of it is where its shadow says it is.',
  'Somebody has gone through this room. The desk is over on its face with its legs in the air; two of its drawers are out and empty on the boards and the third has been worked at and is still shut. Papers cover the floor — not thrown, exactly. Set down. Broken glass catches the light along the baseboard. There is a dark stain on the boards roughly where your head was.',
  'An old computer terminal sits on a stand in the corner. Nobody bothered to knock it over. The air smells of scorched dust off the bulb and, underneath that, of a room that has been cold for a while. The door stands open where you left it, and the landing light lies across the boards in a long pale wedge. The window is not curtained.',
].join('\n\n');

const LIT_LAMP_RIGHTED_DOOR_SHUT = [
  "The lamp stands where a lamp stands, and the room's shadows have agreed to go downward again. It is not an improvement, exactly. You can now see the mess plainly rather than dramatically.",
  'Somebody has gone through this room. The desk lies on its face, two drawers out and empty beside it, the third worked at and still shut. Papers cover the boards, set down rather than thrown. Broken glass along the baseboard. A dark stain where your head was.',
  'The terminal in the corner has not been touched by anyone, including you. The door is shut. The window is not curtained, and shows a rectangle of street-coloured nothing.',
].join('\n\n');

const LIT_LAMP_RIGHTED_DOOR_OPEN = [
  "The lamp stands where a lamp stands, and the room's shadows have agreed to go downward again. It is not an improvement, exactly. You can now see the mess plainly rather than dramatically.",
  'Somebody has gone through this room. The desk lies on its face, two drawers out and empty beside it, the third worked at and still shut. Papers cover the boards, set down rather than thrown. Broken glass along the baseboard. A dark stain where your head was.',
  'The terminal in the corner has not been touched by anyone, including you. The door stands open where you left it, and the landing light lies across the boards in a long pale wedge. The window is not curtained, and shows a rectangle of street-coloured nothing.',
].join('\n\n');

const LIT_SEARCHED_DOOR_SHUT = [
  'The room has now been searched twice: once by whoever came before you, and once, more recently, by you. Your version was tidier and produced less.',
  'The papers are in a heap of your own making, which is at least a different heap. The desk is still on its face; it weighs what a desk weighs. The glass is still along the baseboard and the stain is still on the boards, and everything in this room that was going to come loose has come loose.',
  'The terminal waits in the corner. The door is shut. The window shows the same rectangle of street-coloured nothing it showed before.',
].join('\n\n');

const LIT_SEARCHED_DOOR_OPEN = [
  'The room has now been searched twice: once by whoever came before you, and once, more recently, by you. Your version was tidier and produced less.',
  'The papers are in a heap of your own making, which is at least a different heap. The desk is still on its face; it weighs what a desk weighs. The glass is still along the baseboard and the stain is still on the boards, and everything in this room that was going to come loose has come loose.',
  'The terminal waits in the corner. The door stands open where you left it, and the landing light lies across the boards in a long pale wedge. The window shows the same rectangle of street-coloured nothing it showed before.',
].join('\n\n');

const description: ProseRule[] = [
  // Rule 1 — dark, ordinary rotation. §15.3.1's optional dark/door-open
  // rule is NOT added here — the doc marks it optional ("not asked for"),
  // and this task's brief doesn't ask for it either; see this task's report.
  { when: ROOM_DARK, text: [DARK_VARIANT_1, DARK_VARIANT_2] },
  // Rule 2 — lit, lamp fallen, first sight (not righted, not searched).
  // Door-open variant tried first (first match wins), per §15.3.
  {
    when: { all: [{ not: { flag: FLAG_LAMP_RIGHTED } }, { not: { flag: FLAG_ROOM_SEARCHED } }, DOOR_OPEN] },
    text: LIT_LAMP_FALLEN_FIRST_SIGHT_DOOR_OPEN,
  },
  {
    when: { all: [{ not: { flag: FLAG_LAMP_RIGHTED } }, { not: { flag: FLAG_ROOM_SEARCHED } }] },
    text: LIT_LAMP_FALLEN_FIRST_SIGHT_DOOR_SHUT,
  },
  // Rule 3 — lit, lamp righted, not yet searched.
  { when: { all: [{ not: { flag: FLAG_ROOM_SEARCHED } }, DOOR_OPEN] }, text: LIT_LAMP_RIGHTED_DOOR_OPEN },
  { when: { not: { flag: FLAG_ROOM_SEARCHED } }, text: LIT_LAMP_RIGHTED_DOOR_SHUT },
  // Rule 4 — searched by the player (unconditional fallback; deliberately
  // lamp-state-agnostic per the doc's own note).
  { when: DOOR_OPEN, text: LIT_SEARCHED_DOOR_OPEN },
  { text: LIT_SEARCHED_DOOR_SHUT },
];

// ---------------------------------------------------------------------------
// §4.11 — the exit, now to the real `LANDING` (§15.1) rather than the old
// content-free stub.
// ---------------------------------------------------------------------------

/**
 * Exported (not just the `EXIT_TRAVEL_TEXT` rule it lives in) so
 * `knowledge.ts` can reuse this exact, already-approved line verbatim
 * (hard rule 5) as `question.act1_q_out_of_this_room`'s settled-answer
 * recap (§8's own `checkQuestionAnswers` rule requires one once
 * `answerWhen` is declared) — it is, literally, how the player got out.
 */
export const EXIT_TRAVEL_TEXT_LIT = 'You step out onto the landing and pull the door to behind you. It does not latch. You leave it not latching.';

const EXIT_TRAVEL_TEXT: ProseRule[] = [
  {
    when: ROOM_DARK,
    text: 'You find the door by touch, get it open, and step out into a stairwell that is only slightly better lit than the room you are leaving. Behind you the room stays dark and keeps whatever it was going to tell you.',
  },
  { text: EXIT_TRAVEL_TEXT_LIT },
];

// ---------------------------------------------------------------------------
// §14.2 — room-level bare `SMELL`/`LISTEN`, by light state. Transcribed
// verbatim from the design doc (already authored/reviewed there; this task
// only wires it — hard rule 5). Match order as listed in the doc.
// ---------------------------------------------------------------------------

const smellRoom: ProseRule[] = [
  {
    when: { flag: FLAG_WINDOW_OPEN },
    text: "Cold air off the alley: dust, cut grass, and the faint scoured smell that comes before rain. Underneath it the room's own smell is still there, waiting to come back.",
  },
  {
    when: { not: { objectState: [FLOOR_LAMP, 'on', true] } },
    text: 'Cold plaster, old carpet, and the flat mineral smell of a room that has been shut up a while. Nearer the floor, where you are, there is something else: iron, faint, and close enough that you would rather find out what it is with a light on.',
  },
  {
    text: 'Cold plaster, hot dust off the bulb, old carpet, and under all of it the flat mineral smell of a room that has not had a window open in it for some time.',
  },
];

const listenRoom: ProseRule[] = [
  {
    when: { not: { objectState: [FLOOR_LAMP, 'on', true] } },
    text: 'Everything is sharper in the dark. The radiator ticking above you as it lets go of the evening. The house shifting its weight somewhere below. And past the glass, very faint, the sound a town makes when nothing in it is moving, which is nearly the sound of no town at all.',
  },
  {
    text: [
      'The radiator ticks. The house settles. Under both of those there is the particular quiet of a town where the traffic stopped and nobody restarted it.',
      "Nothing, and then a stair tread taking somebody's weight two floors down, and then nothing again for a while.",
    ],
  },
];

/**
 * §8 gap 3/4's payoff: room-level handlers for the two bare ambient senses
 * (SMELL/LISTEN, transcribed above) plus the two bare actions that need to
 * set a flag (STAND, the terminal login attempt) — `standDefault`/
 * `terminalTypeDefault` are the exact same arrays `verbs.ts` assigns to
 * those verbs' own (otherwise-dead, for the bare case) `default`.
 */
const roomHandlers: HandlerDef[] = [
  { verbs: [SMELL], effects: [{ say: smellRoom }] },
  { verbs: [LISTEN], effects: [{ say: listenRoom }] },
  { verbs: [STAND], effects: [{ say: standDefault }, { set: [FLAG_STOOD_UP, true] }] },
  { verbs: [V_TYPE_TERMINAL], effects: [{ say: terminalTypeDefault }, { set: [FLAG_TERMINAL_TRIED, true] }] },
  // §8.9/§14.4: the empty-hands `INVENTORY` line is a clue about the search
  // in THIS room, not the ordinary global line — `respond.ts`'s
  // `respondToInventory` only ever reaches a room's `INVENTORY_VERB_ID`
  // handler once it has already confirmed the inventory really is empty, so
  // this is safely unconditional (`when` omitted); it stays in force even
  // after the player has carried and dropped things back to empty, per the
  // doc's own stated preference (§14.4: "a player who drops the hat and
  // types I in this room should still get the clue").
  { verbs: [INVENTORY_VERB_ID], effects: [{ say: 'Nothing. Not a wallet, not a key, not a scrap of paper. Whoever went through your coat did the job properly, and appears to have had time to be neat about it.' }] },
];

export const yourRoom: RoomDefSlice = {
  // No `name` — see this file's header. `RoomDefSlice.name` can't vary by
  // state, and "A Rented Room" itself starts with a noise word ("a"),
  // which `validate.ts`'s noise-word rule rejects outright (it would also
  // silently become unreachable as a room alias, since `dropBaseNoise`
  // strips leading articles before any lookup). Rather than truncate the
  // writer's string to "Rented Room" (hard rule 5), this is left unset;
  // `views.ts`'s MAP command falls back to the room's id.
  area: 'act1',
  map: { x: 0, y: 0 },
  // Baseline only — this room has no ambient light of its own. `isDark()`
  // (engine/world.ts) already defeats this the moment `FLOOR_LAMP` is `on`
  // and in scope; the baseline cond itself must never reference the lamp
  // (validate.ts's `dark-cond-references-light-source` warning), so this is
  // a bare `true`, not `ROOM_DARK`.
  dark: true,
  description,
  // Authored for schema completeness (deliverable #1 asks for it), but
  // currently unreachable in ordinary play: `initialState()` seeds
  // `visited[startRoom]` directly and never calls `renderArrival` for the
  // start room (`gamestate.ts`'s own doc comment) — the opening beats above
  // this file's header.
  firstVisit: OPENING_TEXT,
  exits: [{ dir: 'out', to: LANDING, door: DOOR, travelText: EXIT_TRAVEL_TEXT }],
  handlers: roomHandlers,
};

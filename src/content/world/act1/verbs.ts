// Act I, room 1 — the verb table. Built-ins reuse `actions.ts`'s
// `BUILTIN_VERB_IDS`; non-built-ins get fresh ids here, `default` text
// pulled verbatim from `src/content/responses.ts`'s `VERB_DEFAULTS`
// (§6 of the response-families doc) — `words` (not specified by that doc;
// its own header says so) are this builder's choice, drawn from each
// family's parenthetical synonym list in the doc.
//
// ROOM-SPECIFIC BARE VERBS (§7 — STAND, WAIT, XYZZY, SUDO, SING, WHO AM I,
// SLEEP, YELL, PRAY, JUMP, HELLO) and the two new room-scale sense verbs
// (LOOK UP/LOOK DOWN, §3.4) are declared with their `default` set directly
// to the room's own authored text — see `room.ts`'s header for why bare,
// no-dobj verbs have to work this way in this engine. Two of these (STAND,
// the terminal login attempt) also have a `room.ts` room-level handler now
// (§8 gap 3/4) that runs alongside `default`'s own text; §8 gap 6 also
// stopped a bare call to any of these (every one declares a `'V'` pattern)
// from tagging a false-positive `defaultResponse` diag.
//
// `INVENTORY` (§8.9/§14.4, §8 gap 2) is real now too — `engine/respond.ts`'s
// reserved `INVENTORY_VERB_ID`, not the old static `V_INVENTORY` stopgap.
// Its own `default` is a `ProseRef` to the global `inventory.empty` family
// (see that id's own doc comment for why); `room.ts` adds `your_room`'s own
// override handler for the empty-hands case (the design doc's own
// instruction: the empty inventory here is a clue, not the ordinary line).

import { BUILTIN_VERB_IDS } from '../../../engine/actions';
import { V } from '../../../engine/ids';
import { AGAIN_VERB_ID } from '../../../engine/interpreter';
import { DIRECTION_VERB_IDS, LOOK_VERB_ID } from '../../../engine/move';
import type { ProseRule } from '../../../engine/prose';
import type { VerbDef } from '../../../engine/world';
import { INVENTORY_VERB_ID } from '../../../engine/respond';
import { VERB_DEFAULTS } from '../../responses';
import { ACT1_DARK_REFUSAL_FAMILY } from './responses';
import {
  FLOOR_LAMP,
  TERMINAL,
  V_CLEAN,
  V_HOLD_TO_LAMP,
  V_KNOCK,
  V_LEAN_OVER,
  V_LOOK_DOWN,
  V_LOOK_OUTSIDE,
  V_LOOK_UP,
  V_RIGHT,
  V_ROLL_UP,
  V_SLIDE_DOWN,
  V_SUDO,
  V_SWEEP,
  V_TIP,
  V_TURN_OVER,
  V_TYPE_TERMINAL,
  V_UNPLUG,
  V_WHOAMI,
  V_XYZZY,
} from './ids';

export const { take: TAKE, drop: DROP, open: OPEN, close: CLOSE, lock: LOCK, unlock: UNLOCK, putIn: PUT_IN, putOn: PUT_ON, wear: WEAR, remove: REMOVE, read: READ, turnOn: TURN_ON, turnOff: TURN_OFF } = BUILTIN_VERB_IDS;

export const EXAMINE = V('examine');
export const SEARCH = V('search');
export const LOOK_UNDER = V('look_under');
export const LOOK_BEHIND = V('look_behind');
export const TOUCH = V('touch');
export const SMELL = V('smell');
export const LISTEN = V('listen');
export const TASTE = V('taste');
export const PUSH = V('push');
export const PULL = V('pull');
export const TURN = V('turn');
export const MOVE = V('move');
export const SHAKE = V('shake');
export const RUB = V('rub');
export const PRY = V('pry');
export const BREAK = V('break');
export const KICK = V('kick');
export const CUT = V('cut');
export const BURN = V('burn');
export const GIVE = V('give');
export const SHOW = V('show');
export const CLIMB = V('climb');
export const SIT = V('sit');
export const STAND = V('stand');
export const WAIT = V('wait');
export const SLEEP = V('sleep');
export const YELL = V('yell');
export const PRAY = V('pray');
export const JUMP = V('jump');
export const SING = V('sing');
export const HELLO = V('hello');

// ---------------------------------------------------------------------------
// §7 — room-specific bare verbs. Most of these have no schema slot other
// than `default` (a bare, no-object command has no `dobj` to hang an
// authored handler on) and stay exactly that way. Two of them — STAND and
// the terminal login attempt — also need to SET a flag
// (`FLAG_STOOD_UP`/`FLAG_TERMINAL_TRIED`), which a `VerbDef.default` render
// alone can never do (it renders `Prose` only, runs no `Effect`s). Gap 3/4's
// fix (`RoomDefSlice.handlers`, `engine/actions.ts`'s `performAction`) is
// exactly the second schema slot this needed: `room.ts` now declares real
// room-level handlers for `STAND`/`V_TYPE_TERMINAL` that run the flag-set
// alongside the SAME text exported below — `default` here stays assigned
// (required non-null by `validate.ts`, and still the answer for the rare
// dobj-form of STAND on an object with no handler of its own) but is
// otherwise dead prose for the bare case, exactly like `LOOK_VERB_ID`'s own
// `default` a few lines down — `room.ts`'s dispatch always intercepts first.
// ---------------------------------------------------------------------------

/**
 * `string[]` rotation gives "first time differs from every time after" for
 * free from the counter alone — `FLAG_STOOD_UP` (gap 4) is set alongside
 * this same text by `room.ts`'s room-level handler, purely so other content
 * can later condition on "has the player stood up yet"; it does not drive
 * which variant renders.
 */
export const standDefault = [
  'You get up in stages, the way a person moves a ladder. Halfway through, the room offers to change places with you and you decline. Then you are standing, mostly, with one hand on something that will turn out to be a desk.',
  'You stand. You were, in every sense that matters, already standing.',
];

const waitDefault = [
  'You wait. The radiator ticks. Your head keeps its own time, slightly faster. Nothing in this room is going to improve on its own, and you get the distinct impression it has been waiting a good deal longer than you have.',
  'You give the room a chance to volunteer something. It has been declining that offer all night and sees no reason to change.',
];

const xyzzyDefault = 'Nothing happens. Which is, in fairness, exactly what happened the first time anybody tried it.';

const sudoDefault: ProseRule[] = [
  {
    when: { objectState: [TERMINAL, 'on', true] },
    text: 'The terminal does not know the word. It knows one thing about you, and it has already said it.',
  },
  { text: 'You issue the command with real conviction. The room, which has no opinion about your privileges, continues not to have one.' },
];

const singDefault =
  'You sing. Your head objects immediately and at volume, and the song stops being a song about a third of the way into the first line. Two floors below you a board shifts, the way a board does when the person standing on it has just decided to hold very still.';

const whoamiDefault = [
  'You check. The answer is not where you left it.',
  'There is a shape in your mind where a name goes — the right length, the right weight, the feel a word has in the half-second before you say it. The shape is in perfect condition. There is nothing in it.',
].join('\n\n');

const sleepDefault = 'You consider lying back down, which has the advantage of being where you started and the disadvantage of being where somebody left you.';

const yellDefault =
  'You shout. It goes out, finds four walls and a low ceiling, and comes back smaller. Downstairs, something that was moving stops moving. Nobody calls up.';

const prayDefault = 'You pray briefly and without much system. The tin ceiling, being the nearest available authority, declines to comment.';

const jumpDefault =
  'You leave the floor by perhaps two inches. Your head describes, in some detail, what it thought of that. You do not do it again.';

const helloDefault = 'You say hello to an empty room, which is one of those things a person does once, quietly, to find out whether the room is empty.';

/**
 * §4.9's terminal-login attempt text. The four-entry rotation gives "first
 * attempt reads differently from every attempt after" for free, from array
 * order alone; `FLAG_TERMINAL_TRIED` (gap 4) is set alongside this same
 * text by `room.ts`'s room-level handler, purely so other content can later
 * condition on "has the player tried the terminal yet" — it does not drive
 * which variant renders. `ENTER <anything>` (arbitrary typed text) is not
 * implemented — no free-text capture pattern exists yet (the same gap
 * `mvp-prologue.ts`'s own header names for SAY); escalated in task 22a's
 * report, not invented around here.
 */
export const terminalTypeDefault = [
  'You type. The keys have the deep, unembarrassed travel of a machine built when people were expected to be sitting at them all day. The cursor takes everything you give it without comment.\n\n    USER NOT RECOGNIZED\n\nThe cursor returns to where it started.\n\nIt does not say *incorrect*. It does not say *no such user*. Not recognized is a different sort of remark, and the machine makes it the same way every time — whether you type a name, a word, or nothing at all.',
  '    USER NOT RECOGNIZED\n\nYou had, at some level, expected that. It does not help.',
  'You try a different word this time. The machine considers it for exactly as long as it considered the last one, which is no time at all.\n\n    USER NOT RECOGNIZED',
  'You press ENTER on an empty line, to see.\n\n    USER NOT RECOGNIZED\n\nThe same words, at the same speed, for nothing at all.',
];

/** Shared with `objects/misc.ts`'s `CEILING` object (§8.8: "X CEILING — see §3.4 LOOK UP"). */
export const CEILING_TEXT =
  'A pressed-tin ceiling, painted over so many times the pattern has gone soft, and in one corner the brown map of a leak that stopped being a leak some time ago. Your shadow is up there with it, enormous, on account of the lamp.';

const lookUp: ProseRule[] = [
  { when: { not: { objectState: [FLOOR_LAMP, 'on', true] } }, text: { ref: ACT1_DARK_REFUSAL_FAMILY } },
  { text: CEILING_TEXT },
];

const lookDown = 'Bare boards, waxed once, a long time before you. They run toward the window. There is a good deal on them that should not be.';

/**
 * §5's "look through window / look outside" — a dedicated bare verb rather
 * than reusing EXAMINE's word "look through" ("SEARCH" already claims that
 * exact phrase for "look through papers", and a second verb id sharing it
 * would collide per `validate.ts`'s vocabulary-collision rule); see this
 * task's report.
 */
const lookOutside: ProseRule[] = [
  { when: { not: { objectState: [FLOOR_LAMP, 'on', true] } }, text: { ref: ACT1_DARK_REFUSAL_FAMILY } },
  {
    text: 'An alley, a shed roof, a brick wall, and above all of it more stars than you were expecting, arranged over a town that appears to have gone to bed in about 1890.',
  },
];

// ---------------------------------------------------------------------------
// The full table.
// ---------------------------------------------------------------------------

export const ACT1_VERBS: Record<string, VerbDef> = {
  // The thirteen built-in verbs (`actions.ts`'s `BUILTIN_VERB_IDS`) — each
  // needs its own `world.verbs` entry (words/patterns/class) for the
  // grammar to recognize it at all; `performAction` supplies the physics,
  // this table only supplies vocabulary + the §5 bare-safe `default`.
  [LOOK_VERB_ID]: { id: LOOK_VERB_ID, words: ['look', 'l', 'look around'], patterns: ['V'], class: null, default: 'You look around.' },
  [TAKE]: { id: TAKE, words: ['take', 'get', 'pick up'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.take },
  [DROP]: { id: DROP, words: ['drop', 'put down'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.drop },
  // "try handle" added (§15.1.5's landing_doors block: "open / unlock /
  // try handle") — a general OPEN synonym, not landing-specific vocabulary,
  // since "try the handle" reads naturally on any door.
  [OPEN]: { id: OPEN, words: ['open', 'try handle'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.open },
  [CLOSE]: { id: CLOSE, words: ['close', 'shut'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.close },
  [LOCK]: { id: LOCK, words: ['lock'], patterns: ['V dobj', 'V dobj prep iobj'], preps: ['with'], class: 'direct', default: VERB_DEFAULTS.lock },
  [UNLOCK]: { id: UNLOCK, words: ['unlock'], patterns: ['V dobj', 'V dobj prep iobj'], preps: ['with'], class: 'direct', default: VERB_DEFAULTS.unlock },
  [PUT_IN]: { id: PUT_IN, words: ['put', 'place', 'insert'], patterns: ['V dobj prep iobj'], preps: ['in', 'into'], class: 'direct', default: VERB_DEFAULTS.put_in },
  [PUT_ON]: { id: PUT_ON, words: ['put', 'place'], patterns: ['V dobj prep iobj'], preps: ['on'], class: 'direct', default: VERB_DEFAULTS.put_on },
  [WEAR]: { id: WEAR, words: ['wear', 'put on'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.wear },
  [REMOVE]: { id: REMOVE, words: ['remove', 'take off'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.remove },
  [READ]: { id: READ, words: ['read'], patterns: ['V dobj'], class: 'analytical', default: VERB_DEFAULTS.read },
  [TURN_ON]: { id: TURN_ON, words: ['turn on', 'switch on'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.turn_on },
  [TURN_OFF]: { id: TURN_OFF, words: ['turn off', 'switch off'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.turn_off },

  [EXAMINE]: { id: EXAMINE, words: ['examine', 'x', 'inspect', 'study', 'look at'], patterns: ['V dobj'], class: 'analytical', default: VERB_DEFAULTS.examine },
  [SEARCH]: { id: SEARCH, words: ['search', 'look in', 'look through', 'rummage'], patterns: ['V dobj'], class: 'analytical', default: VERB_DEFAULTS.search },
  [LOOK_UNDER]: { id: LOOK_UNDER, words: ['look under', 'check under'], patterns: ['V dobj'], class: 'analytical', default: VERB_DEFAULTS.look_under },
  [LOOK_BEHIND]: { id: LOOK_BEHIND, words: ['look behind', 'check behind'], patterns: ['V dobj'], class: 'analytical', default: VERB_DEFAULTS.look_behind },
  [TOUCH]: { id: TOUCH, words: ['touch', 'feel', 'stroke'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.touch },
  // 'V' added (gap 3): bare SMELL/LISTEN now resolves grammatically and
  // reaches room.ts's own handlers before ever touching `default` below —
  // see room.ts's header. `default` stays `{name}`-templated for the
  // resolved-dobj case (SMELL FEDORA etc.), unchanged.
  [SMELL]: { id: SMELL, words: ['smell', 'sniff'], patterns: ['V', 'V dobj'], class: 'direct', default: VERB_DEFAULTS.smell },
  [LISTEN]: { id: LISTEN, words: ['listen', 'listen to', 'listen at'], patterns: ['V', 'V dobj'], class: 'direct', default: VERB_DEFAULTS.listen },
  [TASTE]: { id: TASTE, words: ['taste', 'lick'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.taste },
  [PUSH]: { id: PUSH, words: ['push', 'press against', 'shove'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.push },
  [PULL]: { id: PULL, words: ['pull', 'tug', 'yank', 'drag'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.pull },
  [TURN]: { id: TURN, words: ['turn', 'rotate', 'twist'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.turn },
  [MOVE]: { id: MOVE, words: ['move', 'shift', 'slide', 'reposition'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.move },
  [SHAKE]: { id: SHAKE, words: ['shake', 'rattle', 'jiggle'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.shake },
  // "dust" dropped from the synonym list (validate.ts's verb-noun-collision
  // check against `DUST`'s own noun) — builder's word choice, not doc text.
  [RUB]: { id: RUB, words: ['rub', 'clean', 'wipe', 'polish'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.rub },
  [PRY]: { id: PRY, words: ['pry', 'lever', 'force', 'wedge'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.pry },
  [BREAK]: { id: BREAK, words: ['break', 'smash', 'destroy', 'hit', 'strike'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.break },
  [KICK]: { id: KICK, words: ['kick', 'stomp'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.kick },
  [CUT]: { id: CUT, words: ['cut', 'slice', 'saw', 'tear', 'rip', 'fold'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.cut },
  // "light" dropped (collides with FLOOR_LAMP's own doc-mandated noun).
  [BURN]: { id: BURN, words: ['burn', 'ignite'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.burn },
  // "hand" dropped (collides with SELF_HANDS' own doc-mandated noun).
  [GIVE]: { id: GIVE, words: ['give', 'offer'], patterns: ['V dobj prep iobj'], preps: ['to'], class: 'social', default: VERB_DEFAULTS.give },
  [SHOW]: { id: SHOW, words: ['show', 'present'], patterns: ['V dobj prep iobj'], preps: ['to'], class: 'social', default: VERB_DEFAULTS.show },
  [CLIMB]: { id: CLIMB, words: ['climb', 'climb on', 'scale', 'climb out', 'go through', 'exit'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.climb },
  [SIT]: { id: SIT, words: ['sit', 'sit on', 'sit down'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.sit },
  [STAND]: { id: STAND, words: ['stand', 'stand up', 'get up', 'sit up'], patterns: ['V', 'V dobj'], class: null, default: standDefault },
  [WAIT]: { id: WAIT, words: ['wait', 'z'], patterns: ['V'], class: null, default: waitDefault },
  [SLEEP]: { id: SLEEP, words: ['sleep', 'nap', 'rest', 'lie down'], patterns: ['V'], class: null, default: sleepDefault },
  [YELL]: { id: YELL, words: ['yell', 'shout', 'scream', 'holler'], patterns: ['V'], class: 'direct', default: yellDefault },
  [PRAY]: { id: PRAY, words: ['pray'], patterns: ['V'], class: null, default: prayDefault },
  [JUMP]: { id: JUMP, words: ['jump', 'hop', 'leap'], patterns: ['V'], class: null, default: jumpDefault },
  [SING]: { id: SING, words: ['sing', 'hum', 'whistle'], patterns: ['V'], class: null, default: singDefault },
  [HELLO]: { id: HELLO, words: ['hello', 'hi', 'hey'], patterns: ['V'], class: 'social', default: helloDefault },

  [V_RIGHT]: { id: V_RIGHT, words: ['right', 'lift'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.move },
  [V_TIP]: { id: V_TIP, words: ['tip', 'lay down'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.move },
  [V_ROLL_UP]: { id: V_ROLL_UP, words: ['roll up'], patterns: ['V dobj'], class: 'analytical', default: VERB_DEFAULTS.touch },
  // §4.9's terminal-login attempt. Bare (no dobj — "type"/"use terminal"/
  // "log in"/"press key" are all self-contained phrases). `room.ts`'s
  // room-level handler (gap 3/4) is what actually renders this text and
  // sets `FLAG_TERMINAL_TRIED`; `default` here is required non-null by
  // `validate.ts` but is otherwise dead prose for this bare-only verb —
  // see this file's header.
  [V_TYPE_TERMINAL]: {
    id: V_TYPE_TERMINAL,
    // "use terminal" dropped (collides with TERMINAL's own noun "terminal" —
    // builder's word choice, not doc text); "type"/"log in"/"press key"
    // still reach it.
    words: ['type', 'log in', 'press key'],
    patterns: ['V'],
    class: 'analytical',
    default: terminalTypeDefault,
  },
  // §4.10's "knock on door" — bare-default text applied unconditioned
  // (no {name} template) rather than invented generic "knock" prose; this
  // room only authors one KNOCK target. See this task's report.
  [V_KNOCK]: {
    id: V_KNOCK,
    words: ['knock'],
    patterns: ['V dobj'],
    class: 'direct',
    default: 'You knock on your own door from the inside. Nothing answers, and you are left holding the several seconds afterwards.',
  },
  // §8.11 — works in the dark on purpose (constitution §10: the dark is
  // never a dead end); this is a distinct bare verb from `SEARCH`, not a
  // dark-gated variant of it, since `SEARCH FLOOR` (§8.1) is a different,
  // sight-based command that needs light — see `objects/floorBoards.ts`.
  [V_SWEEP]: {
    id: V_SWEEP,
    words: ['feel around', 'sweep', 'grope'],
    patterns: ['V'],
    class: 'direct',
    default: 'You sweep an arm across the boards. Paper. A lot of paper. Something with a brim on it, about an arm’s length away. Something else, further off, that turns out to be a lot of small sharp pieces of something, and you stop sweeping.',
  },
  // §15.1.5's "SLIDE DOWN BANISTER"/"RIDE BANISTER" — landing-only, but
  // registered here alongside every other act1 verb rather than in the
  // landing's own files, matching this table's existing convention.
  [V_SLIDE_DOWN]: { id: V_SLIDE_DOWN, words: ['slide down', 'ride'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.touch },
  // §15.1.4's "LEAN OVER RAIL"/"LOOK OVER BANISTER" — see `ids.ts`'s own
  // doc comment on `V_LEAN_OVER` for why this is a dobj-taking verb rather
  // than added words on the bare `V_LOOK_DOWN`.
  [V_LEAN_OVER]: { id: V_LEAN_OVER, words: ['lean over', 'look over'], patterns: ['V dobj'], class: 'analytical', default: VERB_DEFAULTS.touch },
  [V_XYZZY]: { id: V_XYZZY, words: ['xyzzy'], patterns: ['V'], class: null, default: xyzzyDefault },
  [V_SUDO]: { id: V_SUDO, words: ['sudo'], patterns: ['V', 'V dobj'], class: null, default: sudoDefault },
  [V_WHOAMI]: { id: V_WHOAMI, words: ['who am i', 'whoami'], patterns: ['V'], class: null, default: whoamiDefault },
  [V_HOLD_TO_LAMP]: { id: V_HOLD_TO_LAMP, words: ['hold to'], patterns: ['V dobj prep iobj'], preps: ['to'], class: 'analytical', default: VERB_DEFAULTS.touch },
  [V_TURN_OVER]: { id: V_TURN_OVER, words: ['turn over', 'examine other side'], patterns: ['V dobj'], class: 'analytical', default: VERB_DEFAULTS.turn },
  [V_LOOK_UP]: { id: V_LOOK_UP, words: ['look up'], patterns: ['V'], class: null, default: lookUp },
  [V_LOOK_DOWN]: { id: V_LOOK_DOWN, words: ['look down'], patterns: ['V'], class: null, default: lookDown },
  [V_LOOK_OUTSIDE]: { id: V_LOOK_OUTSIDE, words: ['look outside'], patterns: ['V'], class: 'analytical', default: lookOutside },
  [V_CLEAN]: { id: V_CLEAN, words: ['clean up', 'sweep up'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.rub },
  [V_UNPLUG]: { id: V_UNPLUG, words: ['unplug'], patterns: ['V dobj'], class: 'direct', default: VERB_DEFAULTS.pull },
  // §8 gap 2: the real reserved `INVENTORY_VERB_ID`, not a room-local id.
  // `default` refs the global `inventory.empty` family — `room.ts`'s own
  // handler overrides it for the empty-hands case (§8.9/§14.4).
  [INVENTORY_VERB_ID]: { id: INVENTORY_VERB_ID, words: ['inventory', 'i', 'inv'], patterns: ['V'], class: null, default: { ref: 'inventory.empty' } },

  // The twelve directions plus AGAIN. `move.ts` reserves these ids and
  // supplies the semantics; content supplies the words. Without them a
  // player cannot leave a room at all — the exit exists and nothing can
  // traverse it. `out` is this room's real exit (canon: "exits: Landing");
  // the rest are registered so that typing a compass direction gets the
  // authored `move.noExit` answer rather than "I don't understand", which
  // is the difference between a world with edges and a broken parser.
  [DIRECTION_VERB_IDS.n]: { id: DIRECTION_VERB_IDS.n, words: ['north', 'n'], patterns: ['V'], class: 'direct', default: { ref: 'move.noExit' } },
  [DIRECTION_VERB_IDS.s]: { id: DIRECTION_VERB_IDS.s, words: ['south', 's'], patterns: ['V'], class: 'direct', default: { ref: 'move.noExit' } },
  [DIRECTION_VERB_IDS.e]: { id: DIRECTION_VERB_IDS.e, words: ['east', 'e'], patterns: ['V'], class: 'direct', default: { ref: 'move.noExit' } },
  [DIRECTION_VERB_IDS.w]: { id: DIRECTION_VERB_IDS.w, words: ['west', 'w'], patterns: ['V'], class: 'direct', default: { ref: 'move.noExit' } },
  [DIRECTION_VERB_IDS.ne]: { id: DIRECTION_VERB_IDS.ne, words: ['northeast', 'ne'], patterns: ['V'], class: 'direct', default: { ref: 'move.noExit' } },
  [DIRECTION_VERB_IDS.nw]: { id: DIRECTION_VERB_IDS.nw, words: ['northwest', 'nw'], patterns: ['V'], class: 'direct', default: { ref: 'move.noExit' } },
  [DIRECTION_VERB_IDS.se]: { id: DIRECTION_VERB_IDS.se, words: ['southeast', 'se'], patterns: ['V'], class: 'direct', default: { ref: 'move.noExit' } },
  [DIRECTION_VERB_IDS.sw]: { id: DIRECTION_VERB_IDS.sw, words: ['southwest', 'sw'], patterns: ['V'], class: 'direct', default: { ref: 'move.noExit' } },
  [DIRECTION_VERB_IDS.up]: { id: DIRECTION_VERB_IDS.up, words: ['up', 'u', 'upstairs'], patterns: ['V'], class: 'direct', default: { ref: 'move.noExit' } },
  // §15.2's fire list adds `descend`/`climb down` as synonyms for DOWN —
  // both reach the landing's own `down` exit (§15.1.6: neither is declared
  // on `your_room`, which has no `down` exit at all, so they fall to the
  // ordinary `move.noExit` family there, correctly). `take stairs`/
  // `enter stairs`/`follow stairs` (also named in §15.2's fire list) are
  // NOT added: "stairs" is `landing_stairs`'s own noun, and putting it
  // literally into a bare verb's `words` trips `validate.ts`'s
  // `verb-noun-collision` warning — this world's own `validate(WORLD)`
  // must stay at zero warnings (`tests/world-act1.test.ts`). Left unwired;
  // see this task's report.
  [DIRECTION_VERB_IDS.down]: {
    id: DIRECTION_VERB_IDS.down,
    words: ['down', 'd', 'downstairs', 'descend', 'climb down'],
    patterns: ['V'],
    class: 'direct',
    default: { ref: 'move.noExit' },
  },
  // §15.1.6's own note: "back" also returns through the door. "enter room"/
  // "enter door" are NOT added — same `verb-noun-collision` reason as
  // DOWN's dropped synonyms above ("room"/"door" are both real nouns).
  [DIRECTION_VERB_IDS.in]: { id: DIRECTION_VERB_IDS.in, words: ['in', 'inside', 'enter', 'back'], patterns: ['V'], class: 'direct', default: { ref: 'move.noExit' } },
  [DIRECTION_VERB_IDS.out]: { id: DIRECTION_VERB_IDS.out, words: ['out', 'outside', 'leave'], patterns: ['V'], class: 'direct', default: { ref: 'move.noExit' } },

  // AGAIN/G (response-families doc §9's `again.nothing`, now authored):
  // `interpreter.ts`'s `resolveAgain` special-cases the resolved match to
  // replay `parser.last` when one exists; this `default` only ever
  // renders rung 2b's fallback, when there is nothing to repeat.
  [AGAIN_VERB_ID]: { id: AGAIN_VERB_ID, words: ['again', 'g'], patterns: ['V'], class: null, default: { ref: 'again.nothing' } },
};

// Wayfinding wave (docs/superpowers/specs/2026-09-19-wayfinding-prose.md) —
// HELP's replacement, the empty-HINT line, the four hint ladders (P15/P16/
// P18/P19), the five Act I "leads better" patches (section 8-12), the CLUES
// synonym for NOTEBOOK (canon 126), and the Landing stairs' stale END OF
// BUILD fix (canon 134, section 14.1).
//
// Two techniques, matching how the rest of this suite tests these two
// layers: HELP/HINT/CLUES/MEMORIES-family commands are meta commands
// (src/session/meta.ts's parseMetaCommand) that never reach
// DeterministicParser at all — those are proven with a real CLI probe
// (src/cli/repl.ts, spawned exactly as world-act1-playthrough.test.ts
// does, no --world flag — the real shipped game is the default). Ordinary
// verbs (SIGN REGISTER, OPEN DRAWER, CLIMB STAIRS, ...) and the two hint
// ladder functions (availableHints/revealHint, src/engine/views.ts — the
// exact functions repl.ts's own 'hint' case calls) go through the real
// parser/turn pipeline directly, the technique
// world-act1-wave5-close-out.test.ts uses.

import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { WORLD } from '../src/content/world/act1/world';
import { renderArrival } from '../src/engine/move';
import { compileVocabulary } from '../src/engine/parser';
import { DeterministicParser } from '../src/engine/interpreter';
import { buildScopeView } from '../src/cli/scope';
import { createSession, takeTurn } from '../src/session/session';
import type { PersistOptions, SessionState } from '../src/session/session';
import { MemoryStore } from '../src/session/store';
import { availableHints, revealHint } from '../src/engine/views';
import type { GameEvent, GameState, WorldDef } from '../src/engine/world';
import type { PuzzleId } from '../src/engine/ids';
import { FRONT_DESK, LANDING, POST_OFFICE, YOUR_ROOM } from '../src/content/world/act1/ids';
import { ACT2_Q_INSIDE_THE_PLANT, ACT2_Q_NOLAN_OFF_DUTY } from '../src/content/world/act2/ids';
import { ACT3_Q_SECOND_RETURN, ACT3_Q_WHEN_UNWATCHED } from '../src/content/world/act3/ids';

const TEST_WORLD: WorldDef = WORLD;
const vocab = compileVocabulary(TEST_WORLD);

function opts(store: MemoryStore): PersistOptions {
  return { store, now: '2026-09-19T04:00:00.000Z', gameVersion: 'test-0.0.0' };
}

function fresh(): SessionState {
  return createSession(TEST_WORLD);
}

/** Same technique world-act1-wave5-close-out.test.ts's own teleport() uses. */
function teleport(room: typeof YOUR_ROOM): { session: SessionState; events: GameEvent[] } {
  const start = fresh();
  const teleported: GameState = { ...start.state, location: room };
  const { state, events } = renderArrival(TEST_WORLD, teleported);
  return { session: { ...start, state }, events };
}

function say(session: SessionState, input: string, store: MemoryStore): { session: SessionState; events: GameEvent[] } {
  const view = buildScopeView(TEST_WORLD, session.state, vocab);
  const outcome = new DeterministicParser().interpret(input, view);
  const result = takeTurn(TEST_WORLD, session, vocab, outcome, opts(store));
  return { session: result.session, events: result.events };
}

function text(events: GameEvent[]): string {
  return events
    .filter((e): e is Extract<GameEvent, { type: 'line' }> => e.type === 'line')
    .map((e) => e.text)
    .join('\n');
}

// ---------------------------------------------------------------------------
// CLI probe — meta commands (HELP, bare HINT, CLUES/NOTEBOOK). No --world
// flag: the default is the real shipped game (repl.ts's own header).
// ---------------------------------------------------------------------------

const dir = mkdtempSync(join(tmpdir(), 'ib-wayfinding-'));
afterAll(() => rmSync(dir, { recursive: true, force: true }));

function writeScript(name: string, scriptLines: string[]): string {
  const path = join(dir, name);
  writeFileSync(path, scriptLines.join('\n'));
  return path;
}

function play(args: string[]): { stdout: string; stderr: string; status: number } {
  const result = spawnSync('npx', ['tsx', 'src/cli/repl.ts', ...args], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    timeout: 60_000,
  });
  return { stdout: result.stdout ?? '', stderr: result.stderr ?? '', status: result.status ?? -1 };
}

describe('meta.help — section 1, the replacement whole', () => {
  const saveDir = mkdtempSync(join(tmpdir(), 'ib-wayfinding-saves-'));
  const script = writeScript('help.txt', ['help']);
  const { stdout } = play(['--save-dir', saveDir, '--script', script, '--fast']);

  it('prints the exact authored text', () => {
    expect(stdout).toContain("INTENTIONALLY BLANK is a parser game. You type what you want to do, in plain English, and the game works out what you meant. Most commands are a verb and a thing:\n\n    OPEN THE DESK        READ THE LETTER        LOOK UNDER THE BED\n\nThe things you can name are the things the writing names. If a description mentions a lamp, a window, a stain on the ceiling, you can EXAMINE it — and examining something usually names more things worth examining. Reading the room and then looking at the nouns in it is most of how this game is played.\n\nVerbs worth knowing:\n\n  LOOK, EXAMINE (X), SEARCH, READ\n  LOOK UNDER, LOOK BEHIND, TOUCH, SMELL, LISTEN\n  TAKE, DROP, OPEN, CLOSE, PUSH, PULL, PRY, TURN, MOVE, CLIMB\n  NORTH, SOUTH, EAST, WEST, UP, DOWN, IN, OUT\n  (abbreviated N, S, E, W, U, D)\n\nPeople are not scenery, and four shapes get at what they know:\n\n  TALK TO MARLOW            he starts, and says what he is willing to say\n  ASK MARLOW ABOUT KEY      the one that does the work\n  TELL JACK ABOUT ROOM      hand over something you have learned\n  SHOW PAGE TO PEARL        hand over something you are holding\n\nAsk people about what you have found and about what other people have said. A name, a place, an object, a word somebody used oddly: if it has come up, it is a topic worth trying.\n\nWhat you work out is kept for you:\n\n  QUESTIONS       what you are currently trying to find out\n  NOTEBOOK (CLUES)  the clues you have collected\n  MEMORIES        what has come back to you so far\n  MAP             the rooms you have been in\n\nAnd when you are stuck:\n\n  HINT            the open questions that have hints available, numbered\n  HINT 2          the next hint for the second question on that list\n\nHints go from a nudge toward the answer, one step per request, and you stop whenever you have got what you needed. Nothing is volunteered: the game will not hint at you unasked, and a question you have not run into yet is not on the list.\n\nCommands that stand on their own:\n\n  LOOK (L)        describe where you are again\n  INVENTORY (I)   what you are carrying\n  AGAIN (G)       repeat your last command\n  WAIT (Z)        let a moment pass\n  SAVE / LOAD     store your progress, or go back to it\n  UNDO            take back the last turn\n  RESTART         begin again from the start (it will ask first)\n  VERSION         which build this is\n  ABOUT           what this game is\n\nPhrasing is forgiving. Articles are optional, abbreviations work, and several wordings usually reach the same action. When a command does not work, the response will normally tell you why rather than only refusing.\n\nTry odd things. A good deal of the writing in this game exists only for players who tried something unreasonable first.");
  });

  it('mentions HINT, QUESTIONS, CLUES, and ASK, so a stuck player can find all four', () => {
    expect(stdout).toContain('HINT');
    expect(stdout).toContain('QUESTIONS');
    expect(stdout).toContain('CLUES');
    expect(stdout).toContain('ASK');
  });
});

describe('hint.empty — section 2, bare HINT with nothing hintable', () => {
  const saveDir = mkdtempSync(join(tmpdir(), 'ib-wayfinding-saves-'));
  const script = writeScript('hint-empty.txt', ['hint']);
  const { stdout } = play(['--save-dir', saveDir, '--script', script, '--fast']);

  it('prints the exact authored line, not the old placeholder', () => {
    expect(stdout).toContain("Hints attach to open questions. Nothing on your QUESTIONS list has any yet.");
    expect(stdout).not.toContain('nothing to hint at right now');
  });
});

describe('CLUES — canon 126, a synonym for NOTEBOOK', () => {
  it('CLUES and NOTEBOOK render the same output from a fresh session', () => {
    const saveDirA = mkdtempSync(join(tmpdir(), 'ib-wayfinding-saves-'));
    const notebookScript = writeScript('notebook.txt', ['notebook']);
    const notebookOut = play(['--save-dir', saveDirA, '--script', notebookScript, '--fast']).stdout;

    const saveDirB = mkdtempSync(join(tmpdir(), 'ib-wayfinding-saves-'));
    const cluesScript = writeScript('clues.txt', ['clues']);
    const cluesOut = play(['--save-dir', saveDirB, '--script', cluesScript, '--fast']).stdout;

    // Only the echoed input line ("> notebook" vs "> clues") differs by
    // construction; normalize it away before comparing the actual response.
    expect(cluesOut.replace('> clues', '> notebook')).toEqual(notebookOut);
  });
});

describe('the Landing stairs — canon 134, section 14.1: no more END OF BUILD on a staircase the player can walk down', () => {
  it('CLIMB STAIRS walks the player down to the Front Desk, in prose, exactly like DOWN', () => {
    const { session } = teleport(LANDING);
    const store = new MemoryStore();
    const { session: after, events } = say(session, 'climb stairs', store);
    const rendered = text(events);
    expect(rendered).not.toContain('END OF BUILD');
    expect(rendered).toContain('You go down two flights, around the well, past a landing with no light on it.');
    expect(after.state.location).toBe(FRONT_DESK);
  });

  it('TOUCH STAIRS no longer prints END OF BUILD either, and does not move the player', () => {
    const { session } = teleport(LANDING);
    const store = new MemoryStore();
    const { session: after, events } = say(session, 'touch stairs', store);
    const rendered = text(events);
    expect(rendered).not.toContain('END OF BUILD');
    expect(after.state.location).toBe(LANDING);
  });
});

// ---------------------------------------------------------------------------
// The five Act I patches (section 8-12) — real parser/turn pipeline,
// teleported straight to each site (same technique as the close-out suite).
// ---------------------------------------------------------------------------

describe('Patch 1 — DRAWER_STUCK_TEXT (section 8)', () => {
  it('OPEN DRAWER prints the patched text, gouges included', () => {
    const store = new MemoryStore();
    let session = fresh();
    session = say(session, 'pull chain', store).session; // light the room — same technique world-act1-wave5-close-out.test.ts uses
    const { events } = say(session, 'open drawer', store);
    expect(text(events)).toContain("The drawer moves an eighth of an inch and stops against itself. The front is bowed, the runner behind it is bent, and between them they have arrived at an arrangement that does not include you. The lip above the gap is chewed pale in three places, which is the shape a drawer front takes when somebody has put something into the gap and leaned on it.");
  });
});

describe('Patch 2 — the searched-room description (section 9)', () => {
  it('LOOK after searching carries the chair clause instead of the false "come loose" claim', () => {
    const store = new MemoryStore();
    let session = fresh();
    session = say(session, 'pull chain', store).session; // light the room
    session = say(session, 'search papers', store).session; // sets FLAG_ROOM_SEARCHED for real
    const { events } = say(session, 'look', store);
    const rendered = text(events);
    expect(rendered).toContain("The papers are in a heap of your own making, which is at least a different heap. The desk is still on its face; it weighs what a desk weighs. The chair that went with it is on its side against the wall. The glass is still along the baseboard and the stain is still on the boards.");
    expect(rendered).not.toContain('everything in this room that was going to come loose has come loose');
  });
});

describe("Patch 3 — the terminal's first refusal (section 10)", () => {
  it('the first LOG IN attempt points at paper', () => {
    const { session } = teleport(YOUR_ROOM);
    const store = new MemoryStore();
    const s = say(session, 'turn on terminal', store).session;
    const { events } = say(s, 'log in', store);
    expect(text(events)).toContain("You type. The keys have the deep, unembarrassed travel of a machine built when people were expected to be sitting at them all day. The cursor takes everything you give it without comment.\n\n    USER NOT RECOGNIZED\n\nThe cursor returns to where it started.\n\nIt does not say *incorrect*. It does not say *no such user*. Not recognized is a different sort of remark, and the machine makes it the same way every time — whether you type a name, a word, or nothing at all. Somebody knew what to put in it once, and nobody carries a thing like that in his head; he writes it on whatever paper is to hand and then keeps the paper.");
  });
});

describe('Patch 4 — signRegisterText (section 11)', () => {
  it('SIGN REGISTER points at Marlow without naming the name', () => {
    const { session } = teleport(FRONT_DESK);
    const store = new MemoryStore();
    const { events } = say(session, 'sign register', store);
    expect(text(events)).toContain("There is a pen in the inkstand and a book on the counter and a line waiting at the bottom of the page.\n\nYou do not know what to put on it. The man on the other side of the counter was awake when whoever did know came in.");
  });
});

describe('Patch 5 — boxesOpen (section 12)', () => {
  it('OPEN BOXES without the keyring points at a thing with writing on it', () => {
    const { session } = teleport(POST_OFFICE);
    const store = new MemoryStore();
    const { events } = say(session, 'open boxes', store);
    expect(text(events)).toContain("The dial turns freely both ways and means nothing without the three letters that go with it, and three letters is not a thing a man keeps in his head; it is a thing he has put somewhere he can look at. You try the door. It is a small brass door and it is doing its job.");
  });
});

// ---------------------------------------------------------------------------
// The four hint ladders (section 3-6) — availableHints/revealHint
// (src/engine/views.ts), the exact functions the real session's HINT
// command calls (repl.ts's 'hint' case). State seeded directly
// (state.questions[id] = 'open') rather than played into, since these are
// all Act II/III questions and questionStatus reads that overlay directly
// regardless of how it got there.
// ---------------------------------------------------------------------------

function openQuestion(question: string): GameState {
  const base = fresh().state;
  return { ...base, questions: { ...base.questions, [question]: 'open' } };
}

function climbLadder(state: GameState, puzzle: PuzzleId, rungs: readonly string[]): void {
  it(`lists the open question at 0/${rungs.length}`, () => {
    const entries = availableHints(TEST_WORLD, state);
    const entry = entries.find((e) => e.puzzle === puzzle);
    expect(entry).toBeDefined();
    expect(entry!.used).toBe(0);
    expect(entry!.total).toBe(rungs.length);
  });

  it('HINT 1..N reveals each rung verbatim, in order, and "used" advances each time', () => {
    let s = state;
    for (let i = 0; i < rungs.length; i++) {
      const result = revealHint(TEST_WORLD, s, puzzle);
      expect(result.events).toEqual([{ type: 'line', kind: 'system', text: rungs[i] }]);
      s = result.state;
      const entries = availableHints(TEST_WORLD, s);
      expect(entries.find((e) => e.puzzle === puzzle)!.used).toBe(i + 1);
    }
  });

  it('the last rung repeats once the ladder is exhausted', () => {
    let s = state;
    for (let i = 0; i < rungs.length; i++) {
      s = revealHint(TEST_WORLD, s, puzzle).state;
    }
    const last = revealHint(TEST_WORLD, s, puzzle);
    const againAfterExhausted = revealHint(TEST_WORLD, last.state, puzzle);
    expect(last.events[0]).toEqual({ type: 'line', kind: 'system', text: rungs[rungs.length - 1] });
    expect(againAfterExhausted.events).toEqual(last.events);
  });
}

describe('P15 — Off duty (section 3, act2/poker.ts)', () => {
  const state = openQuestion(ACT2_Q_NOLAN_OFF_DUTY);
  climbLadder(state, 'act2_p15_poker' as PuzzleId, ["Nolan will not tell you in his own yard what he would not tell the county, and he is not being cagey about it; he is being a man at work, in the evening, in his yard. There is one room in this town where he is not at work, and one night of the week when he is in it.","Fridays, at the diner, the chairs come down off the tables and three people sit under a low light. There are four chairs. Pearl will tell you, without being asked, whose the fourth one is not, and Jack will stake you the first time so that not having money is not the obstacle you think it is.","You do not have to win to get the useful half. Between the second hand and the third, Nolan stops dealing and talks about his week — about a convoy, about an apron that has to be clear, and about the hours of the building he runs and has never once been inside during them. That happens whether you are up or down, and the notebook keeps it. Winning buys the other thing: something he will hand across the felt if you ask for it before you stand up.","The table is readable if you watch it instead of your own cards. Nolan does something with his hand on the first hand every week, and it means what it looks like it means. The sheriff, on the second, does something she does not do, and Jack says so afterwards. Two hands out of three is a good evening. Then ask Nolan about the badge, or about Sublevel 6, while you are still sitting down.","On a Friday evening, in the Sundown Diner: SIT. Hand one, WATCH NOLAN and then CALL. Hand two, FOLD. Sit through what Nolan says between hands two and three — that is the gate talk, and it is the half of this that does not depend on cards. Hand three, CALL, and if you have brought your father down on the rig, call it over his objection. Then, before you leave the table: ASK NOLAN ABOUT BADGE. Miss a Friday and there is another one; miss all of them and the same two facts are reachable through the gate itself."]);
});

describe('P16 — Getting inside the plant (section 4, act3/knowledge.ts)', () => {
  const state = openQuestion(ACT2_Q_INSIDE_THE_PLANT);
  climbLadder(state, 'act3_p16_entry' as PuzzleId, ["There is more than one way through that gate and none of them involves breaking anything you would have to explain afterwards. The gatehouse, the reader on the post, the fence, and the country west of the road are all part of the same question. Look at all four before you commit to one, because the one you can do today may not be the one you can do best.","What gets you through is either something you carry or something the plant already believes. Nolan wears the first on his chest on Friday nights and has said, out loud, that he does not mind where it says he has been. The second hangs on a nail at the gatehouse window, one morning a week, and nobody has looked at it after the day it was written. And the cedar posts west of the road are going somewhere: your father said so, the library's construction reel drew it, and standing at the fence you can see which way they point.","Some of these doors only exist at certain hours, and two of them do not care what time it is. Nolan arrives in the first half hour of morning. The convoy and its clipboard are a Tuesday morning. The fence and the hatch on the county road are open to you at any hour of any day, if you have what they want. A route that is not there today is a day away, not gone.","Four doors, and each of them wants exactly one thing.\n\nThe reader wants Nolan's badge, which he lends across a card table to somebody who has beaten him at cards.\n\nThe turnstile wants nobody in particular, and turns for anybody standing close enough behind a man who holds doors for people.\n\nThe manifest wants a vendor number, and there is one printed in a box in the top right corner of the work order you put back together out of strips.\n\nThe fence wants a truck at the perimeter and a driver who has agreed to it, and Jack agrees to it when he is shown what is in the notebook or in the audit.\n\nThe hatch on the county road wants a key or a lever, an hour of walking, and a light for the mile that comes after.","Any one of these, and you are inside.\n\nUSE BADGE at the gate reader, carrying Nolan's badge.\n\nFOLLOW NOLAN on the perimeter road, in the first half hour of morning, while he is there.\n\nSIGN MANIFEST at the gatehouse on a Tuesday morning, carrying the work order.\n\nSHOW NOTEBOOK TO JACK or SHOW AUDIT TO JACK, then RAM FENCE with the truck on the road.\n\nOr: NW from Town Edge to the county road. UNLOCK HATCH with the keyring, or PRY HATCH WITH LEG. Take the headlamp out of the truck's toolbox first, because a mile underground is a mile underground. Then DOWN, and keep going."]);
});

describe('P18 — The second return, followed down (section 5, act3/knowledge.ts)', () => {
  const state = openQuestion(ACT3_Q_SECOND_RETURN);
  climbLadder(state, 'act3_p18_second_return' as PuzzleId, ["You have already done the clever part of this. You put a hand on a pipe and it was warm, and warm is a fact about now — about something at the other end of it, today, running. What is left is not deduction. It is following.","Two big returns come into this building and only one of them stops where the building stops. Find the place where they turn down through the floor and look at what has been put in beside them, and then look at how well it has been put in. Nobody bolts something through a rolled edge in four places for a thing they use once.","There are two ways into the same shaft and they are five floors apart. One is a steel plate in the floor at the back of the Cooling Plant, bolted at eight points, with a lifting eye at one corner — Jack's wrench off the truck's toolbox fits those bolts, and so, less politely, does the chair leg. The other is already open: the formed opening in the end wall on Sublevel 5, where the returns go down and a ladder goes with them.","Take a light. At the Sublevel 5 opening, examine what is actually in front of you: Return A stops at a valve and a blank flange, because five floors down is where the building stops. Return B does not stop. Neither does the ladder. Then go the way the ladder goes.","In the Cooling Plant: UNBOLT HATCH WITH WRENCH, or PRY HATCH WITH LEG, then DOWN. On Sublevel 5: EXAMINE OPENING, then DOWN. Either one puts you in the Pipe Chase with a light on and the warm pipe beside you, which is the whole of the answer."]);
});

describe('P19 — The night schedule (section 6, act3/knowledge.ts)', () => {
  const state = openQuestion(ACT3_Q_WHEN_UNWATCHED);
  climbLadder(state, 'act3_p19_night_schedule' as PuzzleId, ["A ladder that somebody maintains is a ladder somebody climbs, and a man who climbs it does it at an hour that suits him rather than you. The question is not whether you can get to the bottom of this building. It is whether you can be down there while he is somewhere else.","He is not a guard. He does a room, he takes about the same time over it every time, and he goes the same way afterwards, and if he finds you he does not do anything worse than make you climb back up. Anything that tells you where he is now, or makes you into somebody who is supposed to be here, is worth more than hurrying.","Three things in this building will tell you when, and no two of them need each other. There is a clock on Sublevel 5, high on the wall over the gauges, and it is the only instrument in that room that is not measuring the building. There is your father, if you brought him down on the rig, who cannot see a thing and can hear all of it. And there is the red box on the stanchion in the Cooling Plant, which does not tell you when at all: it makes a when.","Read a clock before you climb. The small hours are the low point — the gauges dip, the offices are dark, and he is furthest from the ladder you want. If Dad is with you, ask him where the man is before every move you make; he will name the room, including the times when the room is the pipe you were about to climb into. When he says the pipe, wait.","READ CLOCK on Sublevel 5, and if it is not the small hours yet, wait for them. ASK DAD ABOUT ROUNDS, and go DOWN the chase whenever he puts the man anywhere except the pipe. If you would rather not time anything at all: go back up to the Cooling Plant and PULL ALARM. One chiller stops, the note of the building drops a tone, and somebody has to come up and see about it, and the way down is yours for as long as that takes. At the bottom, the first thing on the rail is a set of grey coveralls, and WEAR COVERALLS is how you stop being the only man in a coat on this floor."]);
});

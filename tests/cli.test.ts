import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, describe, expect, it } from 'vitest';
import { compileVocabulary } from '../src/engine/parser/vocabulary';
import { initialState } from '../src/engine/world';
import { DOOR, FIXTURE_WORLD, GUIDE, ROOM_A, ROOM_B, SELF_TEST, SELF_TEST_PART, TOUCHABLE } from './fixtures/world';
import { renderEvent } from '../src/cli/render';
import { buildScopeView } from '../src/cli/scope';

const dir = mkdtempSync(join(tmpdir(), 'ib-cli-'));
afterAll(() => rmSync(dir, { recursive: true, force: true }));

// ---------------------------------------------------------------------------
// CLI v2 (§8 task 20) — `src/cli/repl.ts`, session-backed on `createSession`.
// Task 22 retired the MVP CLI (`./play.ts`) and switched `npm run play`
// (and this file) over to this shell entirely; `render.ts`/`scope.ts` are
// pure and unit-tested directly, no process spawn needed. `--script`/
// `--world` error-handling coverage that used to live against the MVP CLI
// (missing script file, missing `--script` value, blank-line skipping) is
// ported below against `repl.ts` — the same `die()`/script-loop code shape,
// now the only CLI there is.
// ---------------------------------------------------------------------------

describe('renderEvent (pure)', () => {
  it('renders a memory distinctly from an ordinary prose line', () => {
    const memory = renderEvent({ type: 'memory', id: 'm1' as never, lines: ['You remember something.'] });
    const prose = renderEvent({ type: 'line', kind: 'prose', text: 'You remember something.' });
    expect(memory.lines.join('\n')).toContain('MEMORY RECOVERED');
    expect(memory.lines).toContain('You remember something.');
    expect(prose.lines.join('\n')).not.toContain('MEMORY RECOVERED');
  });

  it('renders a clue and a question with their own markers, distinct from each other and from prose', () => {
    const clue = renderEvent({ type: 'clue', id: 'c1' as never, title: 'a torn ticket' });
    const question = renderEvent({ type: 'question', id: 'q1' as never, status: 'open', text: 'Where did it go?' });
    const answered = renderEvent({ type: 'question', id: 'q1' as never, status: 'answered', text: 'Where did it go?' });
    expect(clue.lines[0]).toContain('a torn ticket');
    expect(question.lines[0]).toContain('opened');
    expect(answered.lines[0]).toContain('answered');
    expect(clue.lines[0]).not.toEqual(question.lines[0]);
  });

  it('marks a beat line for pacing but not an ordinary or system line', () => {
    expect(renderEvent({ type: 'line', kind: 'beat', text: 'A moment passes.' }).beat).toBe(true);
    expect(renderEvent({ type: 'line', kind: 'prose', text: 'x' }).beat).toBe(false);
    expect(renderEvent({ type: 'line', kind: 'system', text: 'x' }).beat).toBe(false);
  });

  it('renders died/ended/restarted as their own rules, and echo/promptClosed as nothing (already visible)', () => {
    expect(renderEvent({ type: 'died', deathId: 'd1' }).lines.join(' ')).toContain('YOU HAVE DIED');
    expect(renderEvent({ type: 'ended', endingId: 'e1' }).lines.join(' ')).toContain('THE END');
    expect(renderEvent({ type: 'restarted' }).lines.join(' ')).toContain('RESTARTED');
    expect(renderEvent({ type: 'echo', text: 'take key' }).lines).toEqual([]);
    expect(renderEvent({ type: 'promptClosed', id: 'p1' }).lines).toEqual([]);
  });
});

describe('buildScopeView (pure)', () => {
  const vocab = compileVocabulary(FIXTURE_WORLD);

  it('excludes NPCs (and everything but carried gear, self-placed fixtures, and touch-reachable fixtures) from a dark room', () => {
    // TOUCHABLE (gap 1's `reachableInDark` fixture) is authored directly in
    // ROOM_A on purpose, to be reachable by touch there — moved out of the
    // room here (setup only, not this test's assertion) so this test keeps
    // proving its own, narrower premise: nothing *else* is visible.
    const state = { ...initialState(FIXTURE_WORLD), objects: { [TOUCHABLE]: { location: ROOM_B } } }; // ROOM_A: baseline dark, nothing lit
    const view = buildScopeView(FIXTURE_WORLD, state, vocab);
    // SELF_TEST/SELF_TEST_PART (the 'self' PlaceId fixture) are always in
    // scope, dark or not — a body part, unlike an ordinary object, needs no
    // touch-reachable flag of its own (see ids.ts's PlaceId doc comment).
    expect(view.visible).toEqual([SELF_TEST, SELF_TEST_PART]);
  });

  it('includes a scheduled NPC once the room is lit and visited', () => {
    const state = { ...initialState(FIXTURE_WORLD), location: ROOM_B, visited: { [ROOM_A]: 0, [ROOM_B]: 0 } };
    const view = buildScopeView(FIXTURE_WORLD, state, vocab);
    expect(view.visible).toContain(GUIDE); // GUIDE's schedule places it in ROOM_B in the morning
    expect(view.visible).toContain(DOOR);
  });
});

/** Absolute path to a repo file, for the generated `--world` module below (which imports real fixture/content files by absolute path so it works regardless of cwd). */
function repoPath(relativeToTests: string): string {
  return fileURLToPath(new URL(relativeToTests, import.meta.url));
}

/**
 * Writes a `--world` module for `repl.ts` to `d`: the shared engine test
 * fixture (`tests/fixtures/world.ts`) layered with the real global
 * response-ladder prose (`src/content/responses.ts`) — the same
 * combination `tests/session.test.ts`/`tests/migrate.test.ts` already use
 * — plus three additions scoped to this test file alone:
 *   - ROOM_A's `dark: true` is dropped. Unmodified, the fixture's start
 *     room is dark by default (nothing carried, nothing lit yet — see
 *     `tests/session.test.ts`'s own "ROOM_A is baseline-dark" note), which
 *     would make every object in it unreachable by name through the real
 *     parser on turn one. Every other CLI test in this file plays through
 *     a lit ROOM_A instead.
 *   - a `{die}`-bearing "death trap" object (FIXTURE_WORLD has none — see
 *     `tests/fixtures/world.ts`'s own SIGIL/TERMINAL doc comment for why)
 *     plus a `dead.refused` family, scoped to this generated module so it
 *     never leaks into the shared fixture other tests build narrower
 *     `responses` maps over.
 *   - a "note" object whose TAKE handler opens `QUESTION_PUZZLE`, so the
 *     `HINT` command has something to list without needing new engine
 *     wiring.
 *   - `meta.recursiveEnding` plus a "recursion console" object whose TAKE
 *     handler fires it (ADR 0012, Stage E `E-1`) — the CLI-level hand-off
 *     check below: no engine change needed to reach this from a real
 *     parsed command, just a world that declares one.
 * `PROMPT_SCRIPTS` closes the prompt-round-trip gap `repl.ts`'s own header
 * documents (no `WorldDef` table maps a prompt id to its response script).
 */
function writeWorldModule(d: string): string {
  const path = join(d, 'world.mjs');
  const fixtures = repoPath('./fixtures/world.ts');
  const responses = repoPath('../src/content/responses.ts');
  const actions = repoPath('../src/engine/actions.ts');
  writeFileSync(
    path,
    [
      `import { FIXTURE_WORLD, ROOM_A, FIXTURE_PROMPT_ID, PROMPT_RESPOND_SCRIPT, QUESTION_PUZZLE } from ${JSON.stringify(fixtures)};`,
      `import { RESPONSES } from ${JSON.stringify(responses)};`,
      `import { BUILTIN_VERB_IDS } from ${JSON.stringify(actions)};`,
      '',
      'const { dark: _unused, ...roomAWithoutDark } = FIXTURE_WORLD.rooms[ROOM_A];',
      "const DEATH_TRAP = 'fixture_cli_death_trap';",
      "const HINT_TRIGGER = 'fixture_cli_hint_trigger';",
      "const RECURSIVE_ENDING_TRIGGER = 'fixture_cli_recursive_ending_trigger';",
      "const RECURSIVE_ENDING_ID = 'fixture_cli_recursive_ending';",
      '',
      'export const WORLD = {',
      '  ...FIXTURE_WORLD,',
      '  meta: { ...FIXTURE_WORLD.meta, recursiveEnding: RECURSIVE_ENDING_ID },',
      '  rooms: { ...FIXTURE_WORLD.rooms, [ROOM_A]: roomAWithoutDark },',
      '  objects: {',
      '    ...FIXTURE_WORLD.objects,',
      '    [DEATH_TRAP]: {',
      '      location: ROOM_A, name: "death trap", nouns: ["trap"],',
      '      handlers: [{ verbs: [BUILTIN_VERB_IDS.take], class: "direct",',
      "        effects: [{ say: 'The trap swallows you whole.' }, { die: 'fixture_cli_death' }] }],",
      '    },',
      '    [HINT_TRIGGER]: {',
      '      location: ROOM_A, name: "crumpled note", nouns: ["note"], portable: true,',
      '      handlers: [{ verbs: [BUILTIN_VERB_IDS.take], class: "analytical",',
      "        effects: [{ say: 'A note falls out, raising a question.' }, { openQuestion: QUESTION_PUZZLE }, { move: [HINT_TRIGGER, 'inventory'] }] }],",
      '    },',
      '    [RECURSIVE_ENDING_TRIGGER]: {',
      '      location: ROOM_A, name: "recursion console", nouns: ["console"], portable: false,',
      '      handlers: [{ verbs: [BUILTIN_VERB_IDS.take], class: "direct",',
      "        effects: [{ say: 'Darkness.' }, { say: 'Your head hurts.' }, { end: RECURSIVE_ENDING_ID }] }],",
      '    },',
      '  },',
      '  responses: { ...FIXTURE_WORLD.responses, ...RESPONSES, "dead.refused": "You are dead. There is nothing more to do here.", "ended.refused": "There is nothing more to do now." },',
      '};',
      '',
      'export const PROMPT_SCRIPTS = { [FIXTURE_PROMPT_ID]: PROMPT_RESPOND_SCRIPT };',
      '',
    ].join('\n'),
  );
  return path;
}

/** Run CLI v2, returning stdout, stderr, and the exit status — the v2 twin of this file's own `play()` helper. */
function playV2(args: string[]): { stdout: string; stderr: string; status: number } {
  try {
    const stdout = execFileSync('npx', ['tsx', 'src/cli/repl.ts', ...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 60_000,
    });
    return { stdout, stderr: '', status: 0 };
  } catch (error) {
    const e = error as { stdout?: string; stderr?: string; status?: number };
    return { stdout: e.stdout ?? '', stderr: e.stderr ?? '', status: e.status ?? -1 };
  }
}

function writeScript(d: string, name: string, lines: string[]): string {
  const path = join(d, name);
  writeFileSync(path, lines.join('\n'));
  return path;
}

describe('CLI v2 (session-backed REPL)', () => {
  const worldPath = writeWorldModule(dir);

  it('defaults to the real shipped game (act1) when --world is omitted (§8 task 22)', () => {
    const saveDir = mkdtempSync(join(tmpdir(), 'ib-cli-v2-'));
    const { stdout, status } = playV2(['--save-dir', saveDir, '--script', writeScript(dir, 'noop.txt', ['look']), '--fast']);
    expect(status).toBe(0);
    expect(stdout).toContain('Darkness.'); // act1's opening room, canon-locked (tests/world-act1-playthrough.test.ts)
  });

  it('RESTART typed against the real shipped game asks for confirmation, and a decline leaves play untouched (Ryan\'s v0.3.2 playtest)', () => {
    const saveDir = mkdtempSync(join(tmpdir(), 'ib-cli-v2-'));
    const script = writeScript(dir, 'restart-decline.txt', ['pull chain', 'restart', 'no', 'look']);
    const { stdout, status } = playV2(['--save-dir', saveDir, '--script', script, '--fast']);
    expect(status).toBe(0);
    expect(stdout).toContain('This ends the current playthrough and begins again from the start. Restart?');
    expect(stdout).toContain('Nothing has changed. The game is where you left it.');
    expect(stdout).not.toMatch(/RESTARTED/);
    // Play continues from where it was — the pulled chain, not a fresh
    // dark-room opening — proving the decline didn't restart anything.
    expect(stdout.split('Nothing has changed.')[1]).not.toContain('Darkness.');
  });

  it('RESET (a synonym) typed against the real shipped game, confirmed, actually restarts with no banner in front of the opening beats', () => {
    const saveDir = mkdtempSync(join(tmpdir(), 'ib-cli-v2-'));
    const script = writeScript(dir, 'reset-confirm.txt', ['pull chain', 'reset', 'yes']);
    const { stdout, status } = playV2(['--save-dir', saveDir, '--script', script, '--fast']);
    expect(status).toBe(0);
    expect(stdout).toContain('This ends the current playthrough and begins again from the start. Restart?');
    expect(stdout).not.toMatch(/RESTARTED/); // response-families doc §10: no banner, only the opening beats
    // The opening room's first-visit text appears again — a genuine fresh
    // arrival, not a resume — right after the confirm round trip closes.
    expect(stdout.split('Restart?')[1]).toContain('Darkness.');
  });

  it('reports a --world module that does not export WORLD', () => {
    const badWorld = join(dir, 'bad-world.mjs');
    writeFileSync(badWorld, 'export const NOT_WORLD = {};\n');
    const { stderr, status } = playV2(['--world', badWorld, '--script', writeScript(dir, 'noop2.txt', ['look']), '--fast']);
    expect(status).toBe(1);
    expect(stderr).toContain('does not export WORLD');
  });

  it('reports a missing script file on one line, without a stack trace (ported from the retired MVP CLI\'s own coverage)', () => {
    const { stderr, status } = playV2(['--script', join(dir, 'nope.txt'), '--fast']);
    expect(status).toBe(1);
    expect(stderr).toContain('script not found');
    expect(stderr).not.toContain('at ');
    expect(stderr.trim().split('\n')).toHaveLength(1);
  });

  it('reports a missing --script value without a stack trace', () => {
    const { stderr, status } = playV2(['--script']);
    expect(status).toBe(1);
    expect(stderr).toContain('--script needs a file path');
    expect(stderr).not.toContain('at ');
  });

  it('skips blank lines in a script', () => {
    const saveDir = mkdtempSync(join(tmpdir(), 'ib-cli-v2-'));
    const script = writeScript(dir, 'blanks.txt', ['look', '', '   ', 'look']);
    const { stdout, status } = playV2(['--world', worldPath, '--save-dir', saveDir, '--script', script, '--fast']);
    expect(status).toBe(0);
    expect(stdout).not.toMatch(/^> \s*$/m);
  });

  it('plays through the parser for real, including disambiguation, against a real ScopeView', () => {
    const saveDir = mkdtempSync(join(tmpdir(), 'ib-cli-v2-'));
    const script = writeScript(dir, 'play.txt', ['look', 'take key', 'brass']);
    const { stdout, status } = playV2(['--world', worldPath, '--save-dir', saveDir, '--script', script, '--fast']);
    expect(status).toBe(0);
    expect(stdout).toContain('Which do you mean'); // clarify: three "key"-nouned objects in scope
    expect(stdout).toContain('You palm the brass key with practiced care.'); // KEY's own handler, not the built-in
  });

  it('checkpoints, dies, offers the death menu, and RESTART ENCOUNTER reloads the checkpoint', () => {
    const saveDir = mkdtempSync(join(tmpdir(), 'ib-cli-v2-'));
    const script = writeScript(dir, 'death.txt', ['take sigil', 'take trap', 'look', 'restart encounter']);
    const { stdout, status } = playV2(['--world', worldPath, '--save-dir', saveDir, '--script', script, '--fast']);
    expect(status).toBe(0);
    expect(stdout).toContain('(checkpoint saved)');
    expect(stdout).toContain('YOU HAVE DIED');
    expect(stdout).toContain('You are dead. There is nothing more to do here.'); // dead.refused, on the next command
    expect(stdout).toMatch(/you may:.*UNDO.*RESTART ENCOUNTER.*RESTART/);
    expect(stdout).toContain('(restarted from checkpoint)');
  });

  it('a recursive ending hands off in one transcript: the ending\'s own beats lead straight into the fresh game\'s opening, with no restarted/ended banner or system line between (ADR 0012)', () => {
    const saveDir = mkdtempSync(join(tmpdir(), 'ib-cli-v2-'));
    const script = writeScript(dir, 'ending.txt', ['take console']);
    const { stdout, status } = playV2(['--world', worldPath, '--save-dir', saveDir, '--script', script, '--fast']);
    expect(status).toBe(0);
    expect(stdout).toContain('Darkness.');
    expect(stdout).toContain('Your head hurts.');
    // The opening room's own firstVisit text renders once at [start] and,
    // since the hand-off starts a genuinely fresh game, exactly once more
    // right after "Your head hurts." — the only thing that follows it.
    const marker = 'fixture room alpha — firstVisit (never shown at game start)';
    expect(stdout.split(marker).length - 1).toBe(2);
    const afterHeadHurts = stdout.split('Your head hurts.')[1]!;
    expect(afterHeadHurts).toContain(marker);
    expect(afterHeadHurts).not.toContain('RESTARTED');
    // No engine "ended"/"THE END" rendering leaks into the merged
    // transcript either — the ended event itself never reaches renderEvent.
    expect(stdout).not.toContain('THE END');
  });

  it('--diag dumps a greppable line per diag event; without it, diags are silent', () => {
    const saveDir = mkdtempSync(join(tmpdir(), 'ib-cli-v2-'));
    const script = writeScript(dir, 'diag.txt', ['frobnicate the zorp entirely']);
    const withDiag = playV2(['--world', worldPath, '--save-dir', saveDir, '--script', script, '--fast', '--diag']);
    expect(withDiag.stdout).toMatch(/^DIAG parserMiss turn=\d+ input="frobnicate the zorp entirely" detail=".+"$/m);

    const saveDir2 = mkdtempSync(join(tmpdir(), 'ib-cli-v2-'));
    const without = playV2(['--world', worldPath, '--save-dir', saveDir2, '--script', script, '--fast']);
    expect(without.stdout).not.toContain('DIAG');
  });

  it('SAVE persists to disk and LOAD restores it in a separate process', () => {
    const saveDir = mkdtempSync(join(tmpdir(), 'ib-cli-v2-'));
    const run1 = playV2([
      '--world', worldPath, '--save-dir', saveDir, '--fast',
      '--script', writeScript(dir, 'save1.txt', ['take brass key', 'save mysave']),
    ]);
    expect(run1.status).toBe(0);
    expect(run1.stdout).toContain('(saved as "mysave")');

    const run2 = playV2([
      '--world', worldPath, '--save-dir', saveDir, '--fast',
      '--script', writeScript(dir, 'save2.txt', ['load mysave', 'drop brass key']),
    ]);
    expect(run2.status).toBe(0);
    expect(run2.stdout).toContain('(loaded "mysave")');
    expect(run2.stdout).toContain('You set the brass key down.'); // proves KEY was actually in inventory after LOAD
  });

  it('UNDO reverts the last turn', () => {
    const saveDir = mkdtempSync(join(tmpdir(), 'ib-cli-v2-'));
    const script = writeScript(dir, 'undo.txt', ['take brass key', 'undo', 'drop brass key']);
    const { stdout, status } = playV2(['--world', worldPath, '--save-dir', saveDir, '--script', script, '--fast']);
    expect(status).toBe(0);
    expect(stdout).toContain('(undone)');
    expect(stdout).toContain("You are not carrying the brass key."); // KEY was never actually taken, once undone
  });

  it('EXPORT prints a JSON blob; IMPORT (given a file path) reloads it', () => {
    const saveDir = mkdtempSync(join(tmpdir(), 'ib-cli-v2-'));
    const run1 = playV2([
      '--world', worldPath, '--save-dir', saveDir, '--fast',
      '--script', writeScript(dir, 'export1.txt', ['take brass key', 'export']),
    ]);
    expect(run1.status).toBe(0);
    const jsonLine = run1.stdout
      .split('\n')
      .map((l) => l.trim())
      .find((l) => l.startsWith('{'));
    expect(jsonLine).toBeDefined();
    const parsed = JSON.parse(jsonLine!);
    expect(parsed.saveVersion).toBeDefined();

    const exportedFile = join(dir, 'exported.json');
    writeFileSync(exportedFile, jsonLine!);
    const run2 = playV2([
      '--world', worldPath, '--save-dir', saveDir, '--fast',
      '--script', writeScript(dir, 'import2.txt', [`import ${exportedFile}`, 'drop brass key']),
    ]);
    expect(run2.status).toBe(0);
    expect(run2.stdout).toContain(`(imported "${exportedFile}")`);
    expect(run2.stdout).toContain('You set the brass key down.');
  });

  it('the prompt round-trip: TURN ON TERMINAL opens a prompt, and field lines answer it', () => {
    const saveDir = mkdtempSync(join(tmpdir(), 'ib-cli-v2-'));
    const script = writeScript(dir, 'prompt.txt', ['turn on terminal', 'player', 'letmein']);
    const { stdout, status } = playV2(['--world', worldPath, '--save-dir', saveDir, '--script', script, '--fast']);
    expect(status).toBe(0);
    expect(stdout).toContain('Terminal Login');
    expect(stdout).toContain('username:');
    expect(stdout).toContain('password (secret):');
    expect(stdout).not.toContain('no response handler registered');
  });

  it('MAP/QUESTIONS/NOTEBOOK/MEMORIES and HINT are all reachable as commands', () => {
    const saveDir = mkdtempSync(join(tmpdir(), 'ib-cli-v2-'));
    const script = writeScript(dir, 'views.txt', ['take note', 'hint', 'hint 1', 'map', 'questions', 'notebook', 'memories']);
    const { stdout, status } = playV2(['--world', worldPath, '--save-dir', saveDir, '--script', script, '--fast']);
    expect(status).toBe(0);
    expect(stdout).toContain('How do you get through the fixture door? (used 0/3)'); // HINT's listing
    expect(stdout).toContain('fixture hint level 1 (nudge)'); // HINT 1's reveal
    expect(stdout).toMatch(/\*.*Fixture Room Alpha/); // MAP's "you are here" marker
    expect(stdout).toContain('OPEN:');
    expect(stdout).toContain('How do you get through the fixture door?'); // QUESTIONS, now open
    expect(stdout).toContain('(notebook is empty)');
    expect(stdout).toContain('(no memories recovered yet)');
  });
});

// Stage B task 21 — the MVP prologue ported to v2 content
// (`src/content/scenes/mvp-prologue.ts`). Two things this file proves:
//
//   1. `validate(WORLD)` comes back clean (the task's own acceptance bar).
//   2. A golden-transcript replay through the real v2 CLI (`src/cli/repl.ts`,
//      spawned exactly the way `tests/cli.test.ts`'s own `playV2` helper
//      spawns it) reaches every MVP beat — the opening, Jeeves, the unknown
//      fallback, the account prompt, a failed then a correct login, the
//      arrest, GAME OVER, the post-death refusal, and RESTART — using the
//      same authored strings the MVP rendered (preserved in
//      `src/content/scenes/mvp-prologue-*.ts`, not retyped), with every
//      deliberate difference from the MVP's own transcript recorded below.
//
// DELIBERATE DIFFERENCES from the MVP transcript (task 22 deleted the MVP
// engine and its own golden-transcript test —
// `tests/playthrough.test.ts` / `tests/fixtures/playthrough.txt`, the
// original source for this comparison — but the differences below still
// hold and are recorded here for whoever next touches this scene):
//
//   - No `SAY` line. v2's grammar has no free-text capture pattern (see
//     `mvp-prologue.ts`'s header) — out of this task's granted modules.
//   - `ask jeeves the weather` -> `ask jeeves about weather`. v2's ASK
//     pattern is literally `'V npc about topic'` — "about" is part of the
//     grammar, not a synonym the MVP's own looser regex allowed.
//   - "dig a tunnel" does not consume a turn in v2 (`turn.ts`'s
//     `commandConsumesTurn` only counts a resolved `'actions'` outcome; a
//     `miss` costs nothing) — unlike the MVP, where every command counted.
//     An extra filler command (`hello`) makes up the turn count so the
//     prompt still opens on the 4th *resolved* command, matching the MVP's
//     `TRIGGER_TURN`.
//   - `login <user> <pass>` (one MVP command) becomes two lines: v2's CLI
//     collects prompt fields one line at a time (`repl.ts`'s
//     `pendingPrompt`), with no single-line login syntax.
//   - The account prompt is never shown at the very start of the session
//     unprompted (the MVP's `start()` always showed `OPENING` immediately).
//     `initialState`'s own doc comment (`gamestate.ts`) says the start
//     room's `firstVisit`/onEnter path is "deliberately never observed
//     under normal play" — so this scene folds `OPENING` into the room's
//     `description` instead (shown once, on the first LOOK) rather than
//     fighting that documented convention with a CLI-level hack. The
//     golden script's first line is therefore an explicit `look`.
//   - Death renders v2's own `died`/death-menu chrome ("YOU HAVE DIED",
//     "(you may: ...)") rather than the MVP's "GAME OVER" — `turn.ts`'s
//     phase gate and `session.ts`'s death menu are v2's own vocabulary for
//     this, richer than the MVP's single line (constitution's own "death
//     offers UNDO/RESTART ENCOUNTER/RESTART" convention).

import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, describe, expect, it } from 'vitest';
import { validate } from '../src/engine/validate';
import {
  COMPUTER_ROOM,
  JEEVES,
  PROMPT_SCRIPTS,
  WORLD,
} from '../src/content/scenes/mvp-prologue';
import { CREDENTIALS, PROMPT, LOGIN_FAIL } from '../src/content/scenes/mvp-prologue-prompt';
import { RESPONSES as MVP_RESPONSES, OPENING } from '../src/content/scenes/mvp-prologue-responses';
import { LOGIN_SUCCESS, SEQUENCE, GAME_OVER_ASIDE } from '../src/content/scenes/mvp-prologue-sequence';

const dir = mkdtempSync(join(tmpdir(), 'ib-mvp-prologue-'));
afterAll(() => rmSync(dir, { recursive: true, force: true }));

describe('mvp-prologue world', () => {
  it('has a real room, object, npc, and starts there', () => {
    expect(WORLD.meta.startRoom).toBe(COMPUTER_ROOM);
    expect(WORLD.rooms?.[COMPUTER_ROOM]).toBeDefined();
    expect(WORLD.npcs?.[JEEVES]).toBeDefined();
  });

  it('validate() comes back clean', () => {
    expect(validate(WORLD)).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Golden-transcript replay through the real v2 CLI (spec §7 step 4).
// ---------------------------------------------------------------------------

function repoPath(relativeToTests: string): string {
  return fileURLToPath(new URL(relativeToTests, import.meta.url));
}

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

function writeScript(name: string, lines: string[]): string {
  const path = join(dir, name);
  writeFileSync(path, lines.join('\n'));
  return path;
}

describe('golden transcript: MVP prologue via the v2 CLI', () => {
  const worldPath = repoPath('../src/content/scenes/mvp-prologue.ts');

  it('replays the MVP playthrough (adapted, see file header) and hits every beat', () => {
    const saveDir = mkdtempSync(join(tmpdir(), 'ib-mvp-prologue-saves-'));
    const script = writeScript('playthrough.txt', [
      'look', // turn 1 — OPENING, shown once
      'ask jeeves about weather', // turn 2 — Jeeves' weather line
      'dig a tunnel', // miss — 'unknown' family; does not consume a turn (see header)
      'hello', // turn 3 — filler, makes up the turn 'dig a tunnel' didn't consume
      'help', // turn 4 — HELP's own response, then the account prompt opens
      'admin', // username, attempt 1
      'admin', // password, attempt 1 — wrong
      'user', // username, attempt 2
      'password', // password, attempt 2 — correct: beats, arrest, death
      'look', // refused: dead.refused
      'restart', // fresh session
    ]);

    const { stdout, status } = playV2(['--world', worldPath, '--save-dir', saveDir, '--script', script, '--fast']);
    expect(status).toBe(0);

    // The opening, shown once (turn 1's `look`).
    for (const line of OPENING) expect(stdout).toContain(line);

    // Jeeves answers about the weather (turn 2).
    expect(stdout).toContain(MVP_RESPONSES['ask.jeeves.weather'][0]);

    // The unknown fallback ("dig a tunnel").
    expect(stdout).toContain(MVP_RESPONSES.unknown[0]);

    // HELP's own response (turn 4), then the account prompt.
    expect(stdout).toContain(MVP_RESPONSES.help[0]);
    expect(stdout).toContain(PROMPT.title);
    expect(stdout).toContain('username');
    expect(stdout).toContain('password');

    // Wrong credentials fail once, with the first LOGIN_FAIL line and no hint yet.
    expect(stdout).toContain(LOGIN_FAIL[0]);
    expect(stdout).not.toContain(PROMPT.hint);

    // Correct credentials: ACCOUNT CREATED beats, the arrest sequence, and the aside.
    for (const line of [...LOGIN_SUCCESS, ...SEQUENCE]) expect(stdout).toContain(line);
    expect(stdout).toContain(GAME_OVER_ASIDE);
    expect(stdout).toContain('YOU HAVE DIED'); // v2's own death chrome — see header

    // Post-death refusal (the MVP's `over.refused`, ported as `dead.refused`).
    expect(stdout).toContain(MVP_RESPONSES['over.refused'][0]);

    // Death menu, then RESTART.
    expect(stdout).toMatch(/you may:.*RESTART/);
    expect(stdout).toContain('RESTARTED');
  });

  it('the correct credentials really are CREDENTIALS.username/CREDENTIALS.password (sanity, not a duplicate of the golden test)', () => {
    expect(CREDENTIALS.username).toBe('user');
    expect(CREDENTIALS.password).toBe('password');
  });

  it('the prompt round-trip script id is registered for the CLI\'s --world convention', () => {
    expect(Object.keys(PROMPT_SCRIPTS).length).toBe(1);
  });
});

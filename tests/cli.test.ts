import { execFileSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';

const dir = mkdtempSync(join(tmpdir(), 'ib-cli-'));
afterAll(() => rmSync(dir, { recursive: true, force: true }));

/** Run the headless CLI, returning stdout, stderr, and the exit status. */
function play(args: string[]): { stdout: string; stderr: string; status: number } {
  try {
    const stdout = execFileSync('npx', ['tsx', 'src/cli/play.ts', ...args], {
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

describe('headless CLI', () => {
  it('plays a script and reaches the account prompt', () => {
    const script = join(dir, 'ok.txt');
    writeFileSync(script, ['look', 'help', 'say hello', 'look'].join('\n'));
    const { stdout, status } = play(['--script', script, '--fast']);
    expect(status).toBe(0);
    expect(stdout).toContain('ACCOUNT REQUIRED');
  });

  it('reports a missing script file on one line, without a stack trace', () => {
    const { stderr, status } = play(['--script', join(dir, 'nope.txt'), '--fast']);
    expect(status).toBe(1);
    expect(stderr).toContain('script not found');
    expect(stderr).not.toContain('at ');
    expect(stderr.trim().split('\n')).toHaveLength(1);
  });

  it('reports a missing --script value without a stack trace', () => {
    const { stderr, status } = play(['--script']);
    expect(status).toBe(1);
    expect(stderr).toContain('--script needs a file path');
    expect(stderr).not.toContain('at ');
  });

  it('skips blank lines in a script', () => {
    const script = join(dir, 'blanks.txt');
    writeFileSync(script, ['look', '', '   ', 'help'].join('\n'));
    const { stdout, status } = play(['--script', script, '--fast']);
    expect(status).toBe(0);
    expect(stdout).not.toMatch(/^> \s*$/m);
  });
});

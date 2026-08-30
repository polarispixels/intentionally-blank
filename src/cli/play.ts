import { createInterface } from 'node:readline';
import { readFileSync } from 'node:fs';
import { stdin, stdout, argv, exit } from 'node:process';
import { parse, start, step } from '../engine';
import type { GameEvent, GameState } from '../engine';

const args = argv.slice(2);
const fast = args.includes('--fast');
const scriptIdx = args.indexOf('--script');
const scriptFile = scriptIdx >= 0 ? args[scriptIdx + 1] : undefined;
const BEAT_MS = fast ? 0 : 700;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const out = (s = '') => stdout.write(`${s}\n`);

let hint = '';

async function render(events: readonly GameEvent[]): Promise<void> {
  for (const e of events) {
    switch (e.type) {
      case 'echo': break; // the player already sees what they typed
      case 'say': out(); out(e.text); break;
      case 'openPrompt':
        hint = e.hint;
        out(); out(`== ${e.title} ==`); out(e.body); out();
        out(`(type: login <username> <password>  |  username placeholder: ${e.usernamePlaceholder}  |  type "forgot" for a hint)`);
        break;
      case 'promptFailed':
        out(); out(e.text);
        if (e.revealHint) out(`(hint: ${hint})`);
        break;
      case 'closePrompt': out(); break;
      case 'beat': out(); out(e.text); await sleep(BEAT_MS); break;
      case 'gameOver': out(); out(e.aside); out(); out('GAME OVER'); out('(type: restart)'); break;
      case 'restarted': out(); out('-- restarted --'); break;
    }
  }
}

async function main(): Promise<void> {
  let state: GameState;
  let events: GameEvent[];
  ({ state, events } = start());
  await render(events);

  const feed = async (line: string): Promise<void> => {
    if (line.trim().toLowerCase() === 'forgot' && state.phase === 'prompt') {
      out(`(hint: ${hint})`);
      return;
    }
    ({ state, events } = step(state, parse(line)));
    await render(events);
  };

  if (scriptFile) {
    for (const line of readFileSync(scriptFile, 'utf8').split('\n')) {
      if (line.trim() === '') continue;
      out(); out(`> ${line}`);
      await feed(line);
    }
    exit(0);
  }

  const rl = createInterface({ input: stdin, output: stdout, prompt: '\n> ' });
  rl.prompt();
  rl.on('line', (line) => {
    void feed(line).then(() => rl.prompt());
  });
  rl.on('close', () => { out(); exit(0); });
}

void main();

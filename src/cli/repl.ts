// CLI v2 (spec §0, §8 task 20): a session-backed REPL on `createSession`,
// driving `DeterministicParser` for real against a production `ScopeView`
// built every turn (`./scope.ts`) rather than hand-building
// `InterpretOutcome`s the way every engine test up to this point has
// (`turn.ts`'s own SCOPE header names this file as the place that closes
// that gap).
//
// Task 22 retired the MVP CLI (`./play.ts`) and switched `npm run play` over
// to this file — see `package.json`.
//
// WORLD LOADING: `--world <module>` loads an arbitrary world module (a path
// to one exporting `WORLD: WorldDef` and, optionally, `PROMPT_SCRIPTS:
// Record<string, ScriptId>` — see "PROMPT ROUND-TRIP" below for why the
// second one exists) — how `tests/cli.test.ts` points this at a small
// generated module layering the shared engine test fixture
// (`tests/fixtures/world.ts`) with the real global response-ladder prose
// (`src/content/responses.ts`), the same combination `tests/session.test.ts`
// and `tests/migrate.test.ts` already use. Omitted, it defaults to the real
// shipped game (`src/content/world/act1`, task 22's own wiring) — so a
// player just runs `npm run play` with no flags and starts in the opening
// room.
//
// META COMMANDS (§5.3): spec text calls these "engine-parsed,
// session-executed," which in the shipped game means content registers
// them as ordinary (reserved-id) verbs the way `GO_TO_VERB_ID`/
// `AGAIN_VERB_ID` are — but that wiring lives in `src/engine/interpreter.ts`
// and no `WorldDef` (fixture or otherwise) declares them today, and this
// task owns `src/cli/` only. So this shell recognizes them itself, by
// matching the raw input before it ever reaches `DeterministicParser` —
// CLI chrome around a session-layer call, not a parser change. Ordinary
// verbs (LOOK, TAKE, GO TO, …) are never intercepted this way; only the
// fixed set below is.
//
// PROMPT ROUND-TRIP: `respondToPrompt(world, session, scriptId, values)`
// needs a `ScriptId` to dispatch to, but the `prompt` `GameEvent` (§1.4)
// carries only `id`/`title`/`body`/`fields` — no `WorldDef` table maps a
// prompt id to the script that closes it (confirmed against
// `effects.ts`'s `openPrompt` arm, a deliberate no-op, and
// `tests/session.test.ts`'s own prompt tests, which reach for the script
// id as a constant they already have rather than deriving it from the
// event). This shell's own `--world` module convention closes that gap
// without touching the engine: an optional `PROMPT_SCRIPTS` export, prompt
// id → script id, supplied by whoever assembles the world. A `prompt`
// event whose id has no entry there is reported (not crashed) and simply
// can't be answered — an authoring gap, not a CLI bug.

import { createInterface } from 'node:readline';
import { existsSync, readFileSync } from 'node:fs';
import { stdin, stdout, stderr, argv, exit } from 'node:process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import type { ScriptId } from '../engine/ids';
import { DeterministicParser } from '../engine/interpreter';
import { compileVocabulary } from '../engine/parser';
import type { CompiledVocabulary } from '../engine/parser';
import { availableHints, mapView, memoriesView, notebookView, questionsView, revealHint } from '../engine/views';
import type { GameEvent, WorldDef } from '../engine/world';
import { WORLD as ACT1_WORLD } from '../content/world/act1';
import {
  createSession,
  deathOptions,
  exportSave,
  importSave,
  listSaves,
  load,
  respondToPrompt,
  restart,
  restartEncounter,
  save,
  takeTurn,
  undo,
} from '../session/session';
import type { DeathOption, SessionState } from '../session/session';
import { GAME_VERSION } from '../version';
import { formatDiag, renderEvent } from './render';
import { buildScopeView } from './scope';
import { FileStore } from './store';

const args = argv.slice(2);
const fast = args.includes('--fast');
const diagFlag = args.includes('--diag');
const scriptIdx = args.indexOf('--script');
const scriptFile = scriptIdx >= 0 ? args[scriptIdx + 1] : undefined;
const worldIdx = args.indexOf('--world');
const worldPath = worldIdx >= 0 ? args[worldIdx + 1] : undefined;
const saveDirIdx = args.indexOf('--save-dir');
const saveDir = saveDirIdx >= 0 ? args[saveDirIdx + 1] : undefined;
const BEAT_MS = fast ? 0 : 700;

/** One line on stderr and a non-zero exit — never a stack trace at a player (matches `./play.ts`'s v0.2.7 hardening). */
function die(message: string): never {
  stderr.write(`repl: ${message}\n`);
  exit(1);
}

if (scriptIdx >= 0 && (scriptFile === undefined || scriptFile.startsWith('--'))) die('--script needs a file path');
if (scriptFile !== undefined && !existsSync(scriptFile)) die(`script not found: ${scriptFile}`);
if (worldIdx >= 0 && (worldPath === undefined || worldPath.startsWith('--'))) die('--world needs a module path');
if (saveDirIdx >= 0 && (saveDir === undefined || saveDir.startsWith('--'))) die('--save-dir needs a directory path');

const out = (s = ''): void => {
  stdout.write(`${s}\n`);
};
const sleep = (ms: number): Promise<void> => new Promise((r) => setTimeout(r, ms));

interface CliWorldModule {
  WORLD: WorldDef;
  PROMPT_SCRIPTS?: Record<string, ScriptId>;
}

async function loadWorldModule(path: string): Promise<CliWorldModule> {
  const resolved = resolve(path);
  if (!existsSync(resolved)) die(`world module not found: ${path}`);
  const mod = (await import(pathToFileURL(resolved).href)) as Partial<CliWorldModule>;
  if (mod.WORLD === undefined) die(`world module "${path}" does not export WORLD`);
  return { WORLD: mod.WORLD, PROMPT_SCRIPTS: mod.PROMPT_SCRIPTS ?? {} };
}

let WORLD: WorldDef;
let PROMPT_SCRIPTS: Record<string, ScriptId>;
let vocab: CompiledVocabulary;
let session: SessionState;
let store: FileStore;
const parser = new DeterministicParser();

interface PendingPrompt {
  id: string;
  fields: { name: string; placeholder?: string; secret?: boolean }[];
  index: number;
  values: Record<string, string>;
  scriptId: ScriptId;
}
let pendingPrompt: PendingPrompt | undefined;

function persistOpts(): { store: FileStore; now: string; gameVersion: string } {
  return { store, now: new Date().toISOString(), gameVersion: GAME_VERSION };
}

async function handlePromptOpen(e: Extract<GameEvent, { type: 'prompt' }>): Promise<void> {
  for (const line of renderEvent(e).lines) out(line);
  for (const f of e.fields) {
    const tags = [f.secret === true ? 'secret' : undefined, f.placeholder].filter((t) => t !== undefined);
    out(`  ${f.name}${tags.length > 0 ? ` (${tags.join(', ')})` : ''}:`);
  }
  const scriptId = PROMPT_SCRIPTS[e.id];
  if (scriptId === undefined) {
    out(`(no response handler registered for prompt "${e.id}" — the --world module must export PROMPT_SCRIPTS["${e.id}"])`);
    return; // pendingPrompt stays unset: an authoring gap, not a crash
  }
  pendingPrompt = { id: e.id, fields: e.fields, index: 0, values: {}, scriptId };
}

function printDeathMenu(): void {
  const labels: Record<DeathOption, string> = { undo: 'UNDO', restartEncounter: 'RESTART ENCOUNTER', restart: 'RESTART' };
  const options = deathOptions(session, store);
  out(`(you may: ${options.map((o) => labels[o]).join(' / ')})`);
}

async function renderEvents(events: readonly GameEvent[], input: string): Promise<void> {
  for (const e of events) {
    if (e.type === 'diag') {
      if (diagFlag) out(formatDiag(e, session.state.turn, input));
      continue;
    }
    if (e.type === 'prompt') {
      await handlePromptOpen(e);
      continue;
    }
    const { lines, beat } = renderEvent(e);
    for (const line of lines) out(line);
    if (beat) await sleep(BEAT_MS);
  }
  if (session.state.phase === 'dead') printDeathMenu();
}

// ---------------------------------------------------------------------------
// Meta commands (§5.3) — see this file's header for why they're recognized
// here rather than by the parser.
// ---------------------------------------------------------------------------

type MetaCommand =
  | { kind: 'save'; slot: string }
  | { kind: 'load'; slot: string }
  | { kind: 'saves' }
  | { kind: 'undo' }
  | { kind: 'restart' }
  | { kind: 'restartEncounter' }
  | { kind: 'export' }
  | { kind: 'import'; path: string }
  | { kind: 'hint'; n?: number }
  | { kind: 'map' }
  | { kind: 'questions' }
  | { kind: 'notebook' }
  | { kind: 'memories' };

/** No name given to `SAVE`/`LOAD` — a documented CLI choice (spec §5.3 leaves the no-name case open); a single fixed slot, distinct from the session's own reserved `'auto'`/`'undo'`/`'checkpoint'` bookkeeping slots. */
const DEFAULT_SLOT = 'manual';

function parseMeta(input: string): MetaCommand | undefined {
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();

  if (lower === 'saves') return { kind: 'saves' };
  if (lower === 'undo') return { kind: 'undo' };
  if (lower === 'restart encounter') return { kind: 'restartEncounter' };
  if (lower === 'restart') return { kind: 'restart' };
  if (lower === 'export') return { kind: 'export' };
  if (lower === 'map') return { kind: 'map' };
  if (lower === 'questions') return { kind: 'questions' };
  if (lower === 'notebook') return { kind: 'notebook' };
  if (lower === 'memories') return { kind: 'memories' };
  if (lower === 'hint') return { kind: 'hint' };

  let m = trimmed.match(/^save(?:\s+(\S+))?$/i);
  if (m !== null) return { kind: 'save', slot: m[1] ?? DEFAULT_SLOT };
  m = trimmed.match(/^load(?:\s+(\S+))?$/i);
  if (m !== null) return { kind: 'load', slot: m[1] ?? DEFAULT_SLOT };
  m = trimmed.match(/^import\s+(\S+)$/i);
  if (m !== null) return { kind: 'import', path: m[1]! };
  m = trimmed.match(/^hint\s+(\d+)$/i);
  if (m !== null) return { kind: 'hint', n: Number(m[1]) };

  return undefined;
}

async function handleMeta(cmd: MetaCommand): Promise<void> {
  switch (cmd.kind) {
    case 'save':
      save(session, { ...persistOpts(), slot: cmd.slot });
      out(`(saved as "${cmd.slot}")`);
      return;
    case 'load': {
      const loaded = load(store, cmd.slot);
      if (loaded === undefined) {
        out(`(no such save: "${cmd.slot}")`);
        return;
      }
      session = loaded;
      out(`(loaded "${cmd.slot}")`);
      return;
    }
    case 'saves': {
      const slots = listSaves(store);
      out(slots.length === 0 ? '(no saves)' : slots.join(', '));
      return;
    }
    case 'undo': {
      const before = session;
      session = undo(session, store);
      out(session === before ? '(nothing to undo)' : '(undone)');
      return;
    }
    case 'restart':
      session = restart(WORLD);
      for (const line of renderEvent({ type: 'restarted' }).lines) out(line);
      return;
    case 'restartEncounter': {
      const restored = restartEncounter(store);
      if (restored === undefined) {
        out('(no checkpoint yet)');
        return;
      }
      session = restored;
      out('(restarted from checkpoint)');
      return;
    }
    case 'export':
      out(exportSave(session, { gameVersion: GAME_VERSION, now: new Date().toISOString() }));
      return;
    case 'import': {
      if (!existsSync(cmd.path)) {
        out(`(file not found: "${cmd.path}")`);
        return;
      }
      session = importSave(readFileSync(cmd.path, 'utf8'));
      out(`(imported "${cmd.path}")`);
      return;
    }
    case 'hint': {
      const entries = availableHints(WORLD, session.state);
      if (cmd.n === undefined) {
        if (entries.length === 0) {
          out('(nothing to hint at right now)');
          return;
        }
        entries.forEach((e, i) => out(`${i + 1}. ${e.questionText} (used ${e.used}/${e.total})`));
        return;
      }
      const entry = entries[cmd.n - 1];
      if (entry === undefined) {
        out(`(no hint numbered ${cmd.n})`);
        return;
      }
      const result = revealHint(WORLD, session.state, entry.puzzle);
      session = { ...session, state: result.state };
      for (const e of result.events) {
        if (e.type === 'diag') continue;
        for (const line of renderEvent(e).lines) out(line);
      }
      return;
    }
    case 'map': {
      const { rooms, edges } = mapView(WORLD, session.state);
      for (const r of rooms) out(`${r.current ? '*' : ' '} ${r.name} [${r.area}] (${r.x},${r.y})`);
      for (const e of edges) out(`  ${e.from} -> ${e.to.known ? e.to.room : '????'}`);
      return;
    }
    case 'questions': {
      const { open, settled } = questionsView(WORLD, session.state);
      out('OPEN:');
      open.forEach((q) => out(`  - ${q.text}`));
      out('SETTLED:');
      settled.forEach((q) => out(`  - ${q.text} -- ${q.answer}`));
      return;
    }
    case 'notebook': {
      const entries = notebookView(WORLD, session.state);
      if (entries.length === 0) {
        out('(notebook is empty)');
        return;
      }
      entries.forEach((c) => out(`◆ ${c.title} -- ${c.detail}`));
      return;
    }
    case 'memories': {
      const entries = memoriesView(WORLD, session.state);
      if (entries.length === 0) {
        out('(no memories recovered yet)');
        return;
      }
      entries.forEach((mem) => {
        out(`── ${mem.title} ──`);
        mem.lines.forEach((l) => out(l));
      });
      return;
    }
  }
}

// ---------------------------------------------------------------------------
// One line of input in, in any of the three modes it can mean something.
// ---------------------------------------------------------------------------

async function feed(line: string): Promise<void> {
  if (pendingPrompt !== undefined) {
    const field = pendingPrompt.fields[pendingPrompt.index]!;
    pendingPrompt.values[field.name] = line;
    pendingPrompt.index += 1;
    if (pendingPrompt.index < pendingPrompt.fields.length) return; // more fields to collect
    const { id: promptId, scriptId, values } = pendingPrompt;
    pendingPrompt = undefined;
    const result = respondToPrompt(WORLD, session, scriptId, values);
    session = result.session;
    await renderEvents(result.events, `[prompt ${promptId}]`);
    return;
  }

  const trimmed = line.trim();
  if (trimmed === '') return;

  const meta = parseMeta(trimmed);
  if (meta !== undefined) {
    await handleMeta(meta);
    return;
  }

  try {
    const view = buildScopeView(WORLD, session.state, vocab);
    const outcome = parser.interpret(trimmed, view);
    const result = takeTurn(WORLD, session, vocab, outcome, persistOpts());
    session = result.session;
    await renderEvents(result.events, trimmed);
  } catch (err) {
    stderr.write(`[error] ${err instanceof Error ? err.message : String(err)}\n`);
  }
}

async function main(): Promise<void> {
  if (worldPath === undefined) {
    // No --world flag: the real shipped game (task 22's default-world wiring).
    WORLD = ACT1_WORLD;
    PROMPT_SCRIPTS = {};
  } else {
    const mod = await loadWorldModule(worldPath);
    WORLD = mod.WORLD;
    PROMPT_SCRIPTS = mod.PROMPT_SCRIPTS ?? {};
  }
  vocab = compileVocabulary(WORLD);
  session = createSession(WORLD);
  store = new FileStore(saveDir ?? resolve('.ib-saves'));

  if (scriptFile !== undefined) {
    for (const line of readFileSync(scriptFile, 'utf8').split('\n')) {
      if (line.trim() === '') continue;
      out();
      out(`> ${line}`);
      await feed(line);
    }
    exit(0);
  }

  const rl = createInterface({ input: stdin, output: stdout, prompt: '\n> ' });
  rl.prompt();

  // Commands queue behind whatever is still flushing (matches `./play.ts`'s
  // v0.2.7 hardening: without this, a line typed during a paced beat
  // sequence interleaves with the beats instead of waiting its turn).
  let queue: Promise<void> = Promise.resolve();
  rl.on('line', (line) => {
    queue = queue.then(() => feed(line)).then(() => {
      rl.prompt();
    });
  });
  rl.on('close', () => {
    out();
    exit(0);
  });
}

void main();

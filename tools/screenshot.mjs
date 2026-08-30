#!/usr/bin/env node
/**
 * Browser verification for Intentionally Blank, on WSL.
 *
 * Playwright's bundled Chromium does not launch on this machine (missing
 * system libraries). What does work is the Windows-side Edge, driven headless
 * from WSL. This wraps the recipe in docs/DEVELOPMENT.md → "Browser
 * verification on WSL": boot `vite preview`, drop a same-origin harness page
 * into dist/ that embeds the game in an iframe and replays commands into it
 * with synthetic input/submit events, then screenshot the harness.
 *
 * Usage:
 *   node tools/screenshot.mjs
 *       One PNG of the opening screen.
 *
 *   node tools/screenshot.mjs --script tests/fixtures/playthrough.txt
 *       One PNG of the opening plus one after each command in the script.
 *
 *   node tools/screenshot.mjs --script s.txt --out shots --only 0,3,7
 *       Only the listed stages (0 = before any command).
 *
 * Options:
 *   --script <file>   Newline-separated commands. `#` comments and blanks skipped.
 *   --out <dir>       Where PNGs land. Default: shots/
 *   --url <url>       Use an already-running server instead of booting preview.
 *   --only <list>     Comma-separated stage indices to capture.
 *   --size <WxH>      Window size. Default: 1100x800.
 *   --no-build        Reuse the existing dist/ instead of rebuilding it.
 *   --keep-harness    Leave the generated harness page in dist/ for debugging.
 */

import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, copyFileSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const EDGE = '/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const BASE = '/intentionally-blank/';
const PREVIEW_PORT = 4173;

// ---------------------------------------------------------------- arguments

function parseArgs(argv) {
  const opts = { out: 'shots', size: '1100x800' };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const take = () => {
      const value = argv[i + 1];
      if (value === undefined || value.startsWith('--')) fail(`${arg} needs a value`);
      i += 1;
      return value;
    };
    if (arg === '--script') opts.script = take();
    else if (arg === '--out') opts.out = take();
    else if (arg === '--url') opts.url = take();
    else if (arg === '--only') opts.only = take().split(',').map((n) => Number(n.trim()));
    else if (arg === '--size') opts.size = take();
    else if (arg === '--no-build') opts.noBuild = true;
    else if (arg === '--keep-harness') opts.keepHarness = true;
    else if (arg === '--help' || arg === '-h') { usage(); process.exit(0); }
    else fail(`unknown option: ${arg}`);
  }
  return opts;
}

function usage() {
  const source = readFileSync(new URL(import.meta.url), 'utf8');
  const block = source.slice(source.indexOf('/**'), source.indexOf('*/'));
  console.log(block.replace(/^\s*\/?\*+ ?/gm, '').trim());
}

function fail(message) {
  console.error(`screenshot: ${message}`);
  process.exit(1);
}

// ------------------------------------------------------------------- paths

/** Convert a WSL path to the Windows path Edge needs. */
function toWindows(path) {
  const result = spawnSync('wslpath', ['-w', path], { encoding: 'utf8' });
  if (result.status !== 0) fail(`wslpath failed for ${path}`);
  return result.stdout.trim();
}

function windowsTempDir(name) {
  const profile = spawnSync('cmd.exe', ['/c', 'echo %USERPROFILE%'], { encoding: 'utf8' });
  if (profile.status !== 0) fail('could not read %USERPROFILE% from cmd.exe');
  const win = `${profile.stdout.trim()}\\AppData\\Local\\Temp\\${name}`;
  const wsl = win.replace(/^([A-Za-z]):/, (_, d) => `/mnt/${d.toLowerCase()}`).replace(/\\/g, '/');
  mkdirSync(wsl, { recursive: true });
  return { win, wsl };
}

// ----------------------------------------------------------------- harness

/**
 * The harness page. It embeds the game in a same-origin iframe, waits for the
 * app to mount, replays `commands` into the command input, and only then
 * settles — Edge's --virtual-time-budget fast-forwards the timers so the
 * capture happens after the game has finished responding.
 */
function harnessHtml(commands) {
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>harness</title>
<style>html,body{margin:0;height:100%}iframe{border:0;width:100%;height:100%;display:block}</style>
</head>
<body>
<iframe id="game" src="${BASE}"></iframe>
<script>
const COMMANDS = ${JSON.stringify(commands)};
const frame = document.getElementById('game');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function send(doc, text) {
  const view = doc.defaultView;
  // Prefer the modal's fields when it is open; otherwise the command line.
  const input =
    doc.querySelector('.modal input:not([type=password])') ||
    doc.querySelector('input[aria-label="Command"]') ||
    doc.querySelector('input');
  if (!input) throw new Error('no input element found');
  const form = input.closest('form');
  const setValue = Object.getOwnPropertyDescriptor(view.HTMLInputElement.prototype, 'value').set;
  setValue.call(input, text);
  input.dispatchEvent(new view.Event('input', { bubbles: true }));
  if (form) form.dispatchEvent(new view.Event('submit', { bubbles: true, cancelable: true }));
  else input.dispatchEvent(new view.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
}

frame.addEventListener('load', async () => {
  const doc = frame.contentDocument;
  await wait(1200);            // mount plus the opening beat sequence
  for (const command of COMMANDS) {
    try { send(doc, command); } catch (e) { document.title = 'ERROR: ' + e.message; return; }
    await wait(1500);          // let the paced beats flush
  }
  await wait(500);
  frame.contentWindow.scrollTo(0, doc.body.scrollHeight);
  document.title = 'READY';
});
</script>
</body>
</html>`;
}

// -------------------------------------------------------------------- main

const opts = parseArgs(process.argv.slice(2));

if (!existsSync(EDGE)) fail(`Windows Edge not found at ${EDGE}`);

let commands = [];
if (opts.script) {
  if (!existsSync(opts.script)) fail(`script not found: ${opts.script}`);
  commands = readFileSync(opts.script, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line !== '' && !line.startsWith('#'));
}

const [width, height] = opts.size.split('x');
if (!width || !height) fail(`--size must look like 1100x800, got ${opts.size}`);

const outDir = resolve(opts.out);
mkdirSync(outDir, { recursive: true });

// Rebuild by default. A verification tool that silently screenshots a stale
// dist/ is worse than no verification tool: it reports on code that is no
// longer there. --no-build is available when the caller knows dist/ is fresh.
if (opts.url) {
  // An externally supplied URL is the caller's to keep current.
} else if (opts.noBuild) {
  if (!existsSync('dist/index.html')) fail('--no-build given but dist/index.html does not exist');
  console.log('› reusing existing dist/ (--no-build)');
} else {
  console.log('› building');
  const build = spawnSync('npm', ['run', 'build'], { stdio: 'inherit' });
  if (build.status !== 0) fail('build failed');
}

let server;
let baseUrl = opts.url;
if (!baseUrl) {
  console.log(`› starting vite preview on :${PREVIEW_PORT}`);
  server = spawn('npx', ['vite', 'preview', '--port', String(PREVIEW_PORT), '--strictPort'], {
    stdio: 'ignore',
    detached: true,
  });
  baseUrl = `http://localhost:${PREVIEW_PORT}${BASE}`;
  await waitForServer(baseUrl);
}

const temp = windowsTempDir('ib-shots');
const profile = `${temp.win}\\profile`;
const harnessPath = 'dist/__harness.html';
const captured = [];

try {
  const stages = commands.length === 0 ? [0] : [...Array(commands.length + 1).keys()];
  const wanted = opts.only ? stages.filter((s) => opts.only.includes(s)) : stages;

  for (const stage of wanted) {
    const upto = commands.slice(0, stage);
    writeFileSync(harnessPath, harnessHtml(upto));

    const label = stage === 0 ? 'opening' : slug(commands[stage - 1]);
    const name = `${String(stage).padStart(2, '0')}-${label}.png`;
    const winShot = `${temp.win}\\${name}`;
    const wslShot = `${temp.wsl}/${name}`;
    rmSync(wslShot, { force: true });

    // Virtual time has to cover the harness's own waits, not wall-clock time.
    const budget = 5000 + upto.length * 2000;

    console.log(`› [${stage}] ${stage === 0 ? '(opening)' : commands[stage - 1]}`);
    const shot = spawnSync(EDGE, [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      `--window-size=${width},${height}`,
      `--virtual-time-budget=${budget}`,
      `--user-data-dir=${profile}`,
      `--screenshot=${winShot}`,
      `${baseUrl.replace(/\/$/, '')}/__harness.html`,
    ], { encoding: 'utf8', timeout: 90_000 });

    if (!existsSync(wslShot)) {
      console.error(shot.stderr?.slice(-1500) ?? '');
      fail(`Edge produced no PNG for stage ${stage}`);
    }
    const dest = join(outDir, name);
    copyFileSync(wslShot, dest);
    captured.push(dest);
  }
} finally {
  if (!opts.keepHarness) rmSync(harnessPath, { force: true });
  if (server) { try { process.kill(-server.pid); } catch { /* already gone */ } }
}

console.log(`\n${captured.length} screenshot${captured.length === 1 ? '' : 's'} → ${outDir}`);
for (const path of captured) console.log(`  ${path}`);

// --------------------------------------------------------------- utilities

function slug(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 28) || 'command';
}

async function waitForServer(url, attempts = 60) {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 250));
  }
  fail(`preview server never came up at ${url}`);
}

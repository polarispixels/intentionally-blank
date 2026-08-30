# MVP v0.2.0 Design — "The machine goes"

**Status:** approved by Ryan 2026-08-29 · **Answers:** `2026-08-29-mvp-brief.md`
**Release:** v0.2.0 (the brief's "0.1.0" predates the merged changelog, where
0.1.0 is the spec foundation; the ladder in `docs/spec/README.md` shifts by
one: opening room → 0.3.0).

## Goal

A five-minute playable prototype at
https://polarispixels.github.io/intentionally-blank/ proving the REPL, parser,
state, event trigger, modal, credentials, game-over, and restart — plus the
repo plumbing that every later milestone needs: Vite/TS/Vue/Vitest scaffold,
Actions → Pages deploy, generated `/docs/` site, headless CLI, version-sync
test. Not the story. No world model.

## Architecture

Pure reducer engine (ADR 0003). The UI and CLI are thin shells over the same
functions; nothing in `src/engine/` or `src/content/` imports Vue, the DOM,
timers, or storage.

```text
src/engine/types.ts      GameState, Action, GameEvent, StepResult
src/engine/state.ts      initialState(), start()
src/engine/parser.ts     parse(input): Action
src/engine/step.ts       step(state, action): StepResult
src/engine/index.ts      re-exports
src/content/responses.ts authored text tables + pick()
src/content/prompt.ts    modal copy
src/content/sequence.ts  login-success + police beats
src/ui/                  Vue 3: App.vue, Transcript.vue, CommandInput.vue,
                         AccountModal.vue, GameOver.vue, main.ts, styles.css
src/cli/play.ts          Node readline REPL
src/version.ts           export const GAME_VERSION = '0.2.0'
tools/build-docs.mjs     markdown → dist/docs/index.html
tests/                   Vitest
.github/workflows/deploy.yml
index.html, vite.config.ts, tsconfig.json, package.json
```

## Engine contract (fixed — UI, CLI, and tests build against this)

```ts
export type Phase = 'playing' | 'prompt' | 'over';

export interface TranscriptEntry { kind: 'player' | 'game' | 'system'; text: string }

export interface GameState {
  turn: number;            // meaningful commands accepted while playing
  phase: Phase;
  loginAttempts: number;   // failed credential submissions
  transcript: TranscriptEntry[];  // canonical record; UI may render events instead
}

export type Action =
  | { type: 'say'; text: string }
  | { type: 'ask'; who: string; topic: string }
  | { type: 'look' } | { type: 'help' } | { type: 'hello' } | { type: 'whoami' }
  | { type: 'time' } | { type: 'weather' } | { type: 'version' }
  | { type: 'unknown'; raw: string }
  | { type: 'submitCredentials'; username: string; password: string }
  | { type: 'restart' }
  | { type: 'noop' };      // empty input; never counts as a turn

export type GameEvent =
  | { type: 'echo'; text: string }                 // the player's command
  | { type: 'say'; text: string }                  // one paragraph of prose
  | { type: 'openPrompt'; title: string; body: string;
      usernamePlaceholder: string; hint: string }  // hint shown on demand
  | { type: 'promptFailed'; text: string; revealHint: boolean }
  | { type: 'closePrompt' }
  | { type: 'beat'; text: string }                 // paced line; UI delays ~1s
  | { type: 'gameOver'; aside: string }
  | { type: 'restarted' };

export interface StepResult { state: GameState; events: GameEvent[] }

export function initialState(): GameState;          // turn 0, playing, empty transcript
export function start(): StepResult;                // initial state + opening 'say' events
export function parse(input: string): Action;
export function step(state: GameState, action: Action): StepResult;
```

`step` is pure: it never mutates its input and never reads a clock or RNG.
Every emitted `say`/`beat`/`echo` text is also appended to `transcript`
(`echo` → `player`, `gameOver` → `system: "GAME OVER"`).

## Behavior

**Opening.** `start()` emits the three opening paragraphs from the brief.

**Parser.** Normalize: trim, lowercase, collapse whitespace, strip surrounding
quotes and trailing `.!?`. Then, in order:

| Input pattern | Action |
|---|---|
| empty | `noop` |
| `restart` / `reset` / `start over` | `restart` |
| `login <u> <p>` / `signup <u> <p>` (any phase) | `submitCredentials` |
| `say <text>` / `type <text>` / `"…"` | `say` (quotes stripped) |
| `hello world` / `hi world` | `say hello world` (special case) |
| `ask <who> [about] [the] <topic>` | `ask` |
| `look` / `l` / `look around` / `examine room` / `x room` | `look` |
| `help` / `?` / `commands` / `what can i do` | `help` |
| `hello` / `hi` / `hey` / `greetings` / `good morning\|evening` | `hello` |
| `who are you` / `who am i` / `whoami` / `what are you` | `whoami` |
| `time` / `what time is it` / `date` / `what year is it` | `time` |
| `weather` / `what's the weather` / `how's the weather` | `weather` |
| `version` | `version` |
| anything else | `unknown` with the raw (normalized) text |

The synonym table lives in `parser.ts` as data so tests can enumerate it.

**Turns and trigger.** In `playing`, every action except `noop`, `restart`,
`version`, and `submitCredentials` increments `turn` after producing its
response. When `turn` becomes **4**, the same `step` also emits `openPrompt`
and sets `phase: 'prompt'`. (`help` counts — it's the player doing something.)

**Prompt phase.** Any action other than `submitCredentials`/`restart`/`noop`
gets a short authored refusal (`prompt.refused`) and does not count a turn.
`submitCredentials`:
- `user` / `password` (case-insensitive, trimmed) → success path below.
- otherwise `loginAttempts++`, emit `promptFailed` with an authored line
  chosen by attempt number; `revealHint: loginAttempts >= 2`.

**Success path.** One `step` call: emit `closePrompt`, then `beat` × N for
the account-created lines, then `beat` × 4 for pounding / door / police /
arrest, then `gameOver` with the narrator aside. `phase: 'over'`. The UI paces
beats; the engine does not.

**Over phase.** Everything except `restart` gets `over.refused`. `restart`
(any phase) returns `start()`'s result prefixed with a `restarted` event.

**Response variants.** `pick(variants, n) = variants[n % variants.length]`
where `n` is `state.turn` before increment. Deterministic, so playthroughs
replay identically.

**`say`.** Output is the text with first letter capitalized and a terminal
period unless it already ends in punctuation; `hello world` → `Hello, world.`
via a small special-case table in content.

**`ask`.** `ask jeeves … weather` → the Jeeves exchange from the brief. Other
`who`/`topic` combinations → `ask.generic` variants that name `who` and
`topic`. `ask` about time/weather with any `who` falls through to the
generic-with-name response (the joke is that only Jeeves has opinions).

## Content

`src/content/` holds every player-visible string. Ryan's brief text is used
verbatim as the first variant of each id; `narrative-writer` adds 2–4 more
variants per id and the modal/failure copy. Ids: `opening` (paragraphs),
`say.special`, `ask.jeeves.weather`, `ask.generic`, `look`, `help`, `hello`,
`whoami`, `time`, `weather`, `unknown`, `prompt.refused`, `over.refused`,
`login.fail` (by attempt), `login.success` (beats), `sequence` (beats),
`gameover.aside`, plus `PROMPT` `{ title, body, usernamePlaceholder, hint,
forgotLabel }`. A content-integrity test asserts every id the engine
references exists and no variant is empty.

Tone per `docs/spec/06`: dry, observant, the computer as a slightly
unhelpful colleague. Not the Badlands, not the story.

## UI (Vue 3)

- One column, `max-width: 72ch`, system monospace stack
  (`ui-monospace, "Cascadia Code", Menlo, Consolas, monospace`), 16px+.
- Light and dark via `prefers-color-scheme`; off-white/slate palette, one
  accent. No green phosphor, no scanlines.
- Header `INTENTIONALLY BLANK` with a hairline rule; footer shows
  `v0.2.0` small (live-deploy check) and a link to `/docs/`.
- Transcript: `role="log" aria-live="polite"`; player entries prefixed `>`
  and styled distinctly; auto-scroll to bottom on append.
- Input: `>` prompt, `autofocus`, refocused on any click on the page
  background and after the modal closes; Enter submits; input cleared.
- Beats: rendered ~900 ms apart; Enter, click, or tap renders the rest
  immediately. `gameOver` renders `GAME OVER` as a system line and shows
  the RESTART button (also reachable by typing `restart`).
- Modal: native `<dialog>` opened with `showModal()`; `cancel` (Esc) is
  prevented; username field (placeholder from event), password field,
  Submit, and a **Forgot password?** link that reveals `hint` inline.
  `promptFailed` shows its text inside the dialog and, when `revealHint`,
  reveals the hint. `closePrompt` closes it and refocuses the command input.
- Mobile: input pinned to the bottom, 16px font (prevents iOS zoom), safe-area
  padding; the dialog is full-width under 480px.
- The UI keeps its own `events` list for rendering and clears it on
  `restarted`; `state` is held in one `ref` and replaced (never mutated) on
  each step.

## CLI (`npm run play`)

Node `readline` loop: prints `start()` events, reads a line, `parse` →
`step`, prints events. `openPrompt` prints the title/body and the line
`(type: login <username> <password>)`; `promptFailed` prints its text and the
hint when revealed; `beat` lines print with a 700 ms delay unless
`--fast`; `gameOver` prints `GAME OVER` and `(type: restart)`. Also accepts
`--script <file>` to feed commands from a file (one per line) with `--fast`,
which is the playtester hook.

## Tests (Vitest)

- `parser.test.ts` — table-driven: every synonym row → expected action;
  quote/punctuation stripping; `unknown` carries raw.
- `step.test.ts` — turn counting rules; trigger exactly at turn 4; refusals
  in `prompt`/`over`; wrong credentials increment attempts and reveal hint
  at 2; correct credentials emit the full sequence and set `over`; `restart`
  from every phase ≡ `start()` plus `restarted`; `step` never mutates input
  (deep-freeze the state in tests).
- `content.test.ts` — every id referenced by the engine exists; no empty
  variant; `pick` cycles.
- `playthrough.test.ts` — scripted run from `start()` to `gameOver` via
  `parse`+`step`; asserts the transcript shape.
- `version.test.ts` — `GAME_VERSION` === `package.json` version === first
  `## [x.y.z]` in `CHANGELOG.md`.
- No component tests for the MVP. Browser verification = `npm run build`,
  `vite preview`, and a screenshot in the PR/report.

## Docs site (`tools/build-docs.mjs`)

Renders, in order: `README.md`, `docs/DEVELOPMENT.md`, `docs/decisions/*.md`
(README first), `docs/spec/README.md` then `00`–`08`, `BACKLOG.md`,
`CHANGELOG.md`, and `docs/superpowers/specs/*.md`. Uses `marked`. Output
`dist/docs/index.html`: header with title, `v{GAME_VERSION}` badge, "Play"
(`../`) and "Source repo" buttons, a two-column TOC of top-level sections,
then each file as a section with its headings demoted one level. Inline CSS,
light/dark via `prefers-color-scheme`, tables wrapped in `overflow-x: auto`.
Relative links between markdown files rewrite to in-page anchors where the
target is rendered, otherwise to GitHub. `npm run build` = `vite build &&
node tools/build-docs.mjs`; `npm run docs` builds docs alone.

## Deploy

`.github/workflows/deploy.yml`: on push to `main` and manual dispatch;
Node 24; `npm ci` → `npm test` → `npm run build` → `actions/upload-pages-
artifact` (`dist/`) → `actions/deploy-pages`. `vite.config.ts` sets
`base: '/intentionally-blank/'`. Pages source is switched to "GitHub Actions"
with `gh api` once the workflow exists. A `.nojekyll` is not needed for the
artifact path.

## Release

`GAME_VERSION = '0.2.0'`, `package.json` `0.2.0`, `CHANGELOG.md` `[0.2.0]`
with the MVP, `BACKLOG.md` status board (M0/MVP shipped, M1 next),
`docs/spec/README.md` ladder shifted, tag `v0.2.0`. Verified by loading the
live URL, playing to GAME OVER, restarting, and loading `/docs/`.

## Out of scope

Save/load/undo (state is already serializable and `step` is pure, which is
all they need later), any world model, any LLM, component tests, analytics.

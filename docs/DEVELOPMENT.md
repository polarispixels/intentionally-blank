# Development Process

This is the long-form rationale behind `CLAUDE.md`. `CLAUDE.md` is loaded on
every turn and stays short; this file explains *why* and is read when needed.

## Why a multi-agent, multi-model setup

The project is built almost entirely by AI agents orchestrated from a Claude
Code session, with Ryan as designer, author-of-record for story canon, and
final taste authority. Two forces shape the process:

1. **Quality has to be very high in two specific places** — the engine's
   foundational design (schemas, parser, save format) and the prose. Both are
   expensive to get wrong: a bad schema means rewriting every room; bad prose
   *is* a bad game.
2. **Token cost scales with context, not with model price.** The main session's
   context is re-read on every turn and grows monotonically. Anything that
   keeps file contents, test logs, and grep output *out* of it is worth more
   than any per-token price difference between models.

So the design is: a small number of expensive calls at phase boundaries
(architecture, planning, prose), a large number of cheap, context-isolated
calls in the middle (implementation, verification, data plumbing), and a main
session that holds decisions rather than files.

## The routing heuristic

**Route by blast radius and reversibility, not by difficulty.**

"Hard → big model" fails in practice because everything feels hard and the
whole workload drifts upward. Instead: decisions that are costly to unwind go
to the top tier; work whose correctness a test can prove goes to the bottom.
The combat resolver is *harder* than the item schema, but a bad resolver is
one file's rewrite and a bad schema is every room's — so the resolver goes to
Sonnet with tests and the schema goes to Fable.

Applied to this project, the two top tiers go to **architecture** and
**prose**. Code is the middle.

## The roster

See the table in `CLAUDE.md`. Definitions live in `.claude/agents/`. Notes:

- **Main session model switches by phase.** Fable while writing specs,
  architecture, and plans (the conversation is where the design gets made,
  and capping it at a lower tier caps the design). Opus during execution,
  where the job is decomposition, routing, and review — good Opus work, and
  the main context is the worst place to run the most expensive model for
  months. Switching is instant (`/model`) and context carries over.
- While main is on Fable, `game-architect` mostly idles; main does that work
  itself. The roster stays correct under both settings.
- `narrative-writer` started life as a Haiku "content-scribe" on the theory
  that world content is data entry. The spec killed that idea: 20–30k
  authored words with a specific narrator voice and a bar of "someone
  actually thought about what would happen if I tried this." Haiku's role
  narrowed to `world-scribe` (mechanical transforms) and `scout` (lookups).
- `playtester` is planned, not yet defined. It needs the headless CLI
  (Milestone 0) to exist. Its job — play from a script, report every parser
  miss and every reasonable action that got a flat refusal — directly
  audits constitution rules 12 and 14.

## The token rules, expanded

1. **Delegate the read, keep the conclusion.** A subagent's file reads and
   test output never enter the main context; only its report does. This is
   the single biggest lever and applies to every tier.
2. **Plans are the interface.** The architect writes plans in
   `docs/superpowers/plans/`. Each builder gets one task section and file
   paths. Context-assembly cost stays constant as the game grows.
3. **Content is data.** Typed data files, authored against a schema, checked
   by a test. Volume work never touches an expensive model except for the
   prose itself.
4. **Verification happens inside the subagent.** "17 pass / 0 fail," not a
   log. Logs surface only on failure.
5. **One agent, one module.** Sprawl is a scoping error; send it back.
6. **Escalate, never guess.** Every cheap agent has a hard instruction to stop
   on ambiguity. An agent that guesses costs more than one that stops.
7. **Decide once, write it down.** ADRs in `docs/decisions/`; spec updates
   for story decisions. No future agent re-derives, no future session
   re-litigates.

**Escalation ladder.** Two failures at Sonnet on the same task mean the task
is mis-specified. It goes *up* to the architect, never sideways to another
builder. Cheap retries are how budgets evaporate.

## How a feature flows

1. **Brainstorm** (main session, `superpowers:brainstorming`): classify,
   question, propose approaches, present design, get Ryan's approval. For
   architectural work, write a spec to `docs/superpowers/specs/`.
2. **Plan** (`game-architect` or main-on-Fable, `superpowers:writing-plans`):
   tasks sized for one Sonnet builder each, tests named first.
3. **Per task:** worktree → `game-builder` (TDD) → `qa-verifier` →
   `code-reviewer` → `superpowers:verification-before-completion`.
4. **Prose** for the feature: `narrative-writer` drafts → main reviews for
   voice and canon → `world-scribe` wires it in → Ryan spot-checks in the
   game and may veto or claim pieces.
5. **Merge** to `main`, which deploys. `CHANGELOG.md` `[Unreleased]` updated
   in the same PR. Release = version bump + tag (see below).

## Prose review gate

`narrative-writer` (Opus) drafts against the writing guide. The main session
reviews every piece for voice and canon before it is wired into data. Ryan
reads it in the game and can veto anything; he may also claim specific pieces
(family scenes, Dad, particular jokes) to write or rewrite himself at any time
— such tasks are tagged `ryan-authored` and the writer leaves a labeled
placeholder. Placeholder prose never reaches `main`.

## Canon discipline

The spec uses four labels: `CANON`, `WORKING IDEA`, `POSSIBILITY`, `BACKLOG`.
Only Ryan promotes a label. Agents propose promotions in reports. Implementing
a `POSSIBILITY` as if it were decided is a blocking review finding. When a
decision becomes firm, the spec doc is updated in the same change, the doc's
`Spec version` line is bumped with the project version, and abandoned ideas
are marked rather than deleted (spec 08 §10).

## Versioning and releases

One SEMVER version covers the spec and the game (the spec README's ladder:
0.1.0 foundation → 0.2.0 prototype → 0.3.0 opening room → … → 1.0.0).
**Every merge to `main` is a release**, because `main` deploys. Policy:

- **MAJOR** — breaks saved games or story canon.
- **MINOR** — new player-visible content, or a milestone.
- **PATCH** — fixes, tuning, and documentation-only changes.

Release checklist, on every merge: bump `GAME_VERSION` (engine constant) and
`package.json`; add `## [x.y.z] - date` to `CHANGELOG.md` (there is no
`[Unreleased]` holding area); bump the `Spec version` line of any spec doc
the change touched; update the status board in `BACKLOG.md` if a milestone
moved; `git tag vX.Y.Z && git push --tags`. A Vitest test asserts the
version strings agree, so a forgotten bump fails CI. The in-game `VERSION`
command and the docs-site badge print it, which doubles as a live-deploy
check.

## Documentation set

| File | Role |
|---|---|
| `README.md` | Play link, docs link, quick start |
| `CLAUDE.md` | Agent instructions: hard rules, routing, workflow |
| `CHANGELOG.md` | Keep a Changelog; the release record |
| `BACKLOG.md` | Build queue and milestone status board |
| `docs/spec/` | Design canon (nine docs + README) |
| `docs/spec/07-…` | Creative open questions — a separate queue from `BACKLOG.md` |
| `docs/decisions/` | ADRs |
| `docs/DEVELOPMENT.md` | This file |
| `docs/ARCHITECTURE.md` | Added when architecture is real (Milestone 0) |
| `docs/superpowers/{specs,plans}` | Design and plan trail |

The public docs site at `/docs/` is generated from these files at build time
(ADR 0006). Markdown is the only source of truth.

## Avoid process obesity

The engineering, review, documentation, testing, and agent-specialization
practices above are useful — particularly while foundational architecture
is being established. But process must stay proportional to the risk and
complexity of the work. As the foundation stabilizes, keep asking:

> **Is this process helping us produce a better playable game, or are we
> creating machinery to manage the machinery?**

Guidelines:

- Preserve rigor for high-blast-radius decisions: architecture, the state
  model, the save system, the parser, and canon.
- Use lighter process for small, reversible content and implementation
  changes.
- Do not add new agents, review stages, ADRs, documents, approval gates, or
  abstractions unless they solve a demonstrated problem.
- Prefer improving playable content over expanding project-management
  infrastructure.
- Do not duplicate information across documentation systems.
- Periodically remove obsolete processes and documentation.
- Optimize for fast iteration once architectural risk has declined.

The internal metric:

> **How much effort is going into creating and improving playable game
> content versus managing the system that creates playable game content?**

There is no required ratio. If process overhead begins materially slowing
delivery of rooms, puzzles, interactions, story, testing, or player
feedback, simplify the process. The objective is disciplined development,
not maximal process.

### Current calibration (v0.2.3)

The MVP ran the full ceremony — ten planned tasks, a two-stage review per
task, a whole-branch review — for a five-minute prototype. That was the
right cost for laying the engine seam, the deploy path, and the roster.
It is not the default from here:

| Change | Path |
|---|---|
| Engine contract, state/save schema, parser grammar, canon promotion, anything an ADR covers | Full: brainstorm → spec → plan → builder + review → whole-branch review |
| A new room, puzzle, or interaction on the existing engine | Plan task → one builder → one review → merge. No separate whole-branch pass unless the plan spans modules. |
| Prose and content data only | Writer → main-session voice/canon review → commit. No code reviewer. |
| Docs, tuning, one-file fixes | Edit → tests → commit to `main` with the version bump. No branch, no reviewer. |

Every path still bumps the version and writes the changelog entry — that is
bookkeeping, not process. Revisit this table when it starts to feel wrong
in either direction.

## Full-game build protocol (agreed 2026-08-29)

Ryan's instruction after v0.2.x: **build the entire game — the whole story,
every act, every puzzle — as one continuous run**, using the spec and the
main session's own creative judgment, without waiting for input.

- **Waves, each deployed to production.** Work proceeds in stages; every
  stage ends with a version bump, a changelog entry, and a deploy to
  `main`. Ryan plays the live URL at his discretion and interrupts if
  something looks wrong. A partial game at the public URL is expected
  during the build.
- **Resumable by construction.** `BACKLOG.md` carries the stage board; the
  SDD ledger carries in-flight state. A context reset, interruption, or
  new session resumes from the last deployed stage, never from scratch.
- **Canon authority is delegated for this build.** The main session
  resolves `WORKING IDEA` / `POSSIBILITY` items as the story requires and
  promotes labels in the spec docs, recording every decision in
  `docs/spec/09-canon-decisions.md` (what, why, what it forecloses). Ryan
  reviews the register when he likes and may reverse anything; reversals
  are story rewrites, so earlier is cheaper. This supersedes hard rule 1
  for the duration of the build only.
- **Model.** The main session runs on **Opus** for the marathon; the
  `game-architect` agent (Fable) writes the story architecture, world
  model, and plans in isolation with the full spec, and the main session
  reviews and can send them back. Stage A is the highest-leverage moment:
  its spec is deployed to the docs site before any code is written so Ryan
  can read it.
- **Stages** (targets, not promises): **A** story + engine architecture
  (five-act causal spine, puzzle network, rooms, NPC agendas, memory and
  save design) → docs deploy · **B** engine v2 + opening room → 0.3.0 ·
  **C** town, client, notebook trail → 0.4–0.6 · **D** data center,
  underground, Dad, contradictions → 0.7–0.8 · **E** reality travel,
  identity, the recursive ending → 0.9 · **F** hints, playtester sweeps,
  replay content, polish → 1.0.0.
- **Process weight** follows the calibration table above: full ceremony for
  stage A and engine work; light paths for rooms, puzzles, and prose.
- **Stage releases stage explicit paths.** During the build the main
  session releases while builder subagents have uncommitted work in the
  same tree. `git add -A` in that window sweeps a half-finished task into
  someone else's release — it happened in v0.2.9, which claims to be
  docs-only and in fact carries three engine files from task 3. Release
  commits name their paths (`git add docs/ CHANGELOG.md …`), or the
  builder's work is committed deliberately as part of that release. Check
  `git status` before staging; the cost of the habit is one command and
  the cost of skipping it is a changelog that lies.
- **Release scripts run under `set -e`, and bookkeeping is chained to the
  commit, not merely adjacent to it.** In v0.2.25 the version bump and
  changelog edit sat on a line above `npm test && git commit`; the edit
  failed an assertion, the commit ran anyway, and a tag was cut on a
  release whose files still carried the previous version. A newline is not
  a dependency. Either chain every step with `&&` or start with `set -e`.

## Browser verification on WSL

Playwright's bundled Chromium does not launch on this machine (missing
system libraries). What works: the Windows-side Edge, driven headless from
WSL —

```sh
"/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" \
  --headless=new --disable-gpu --hide-scrollbars --window-size=1100,800 \
  --virtual-time-budget=30000 \
  "--user-data-dir=C:\\Users\\<you>\\AppData\\Local\\Temp\\ib-edge" \
  "--screenshot=C:\\Users\\<you>\\AppData\\Local\\Temp\\shot.png" \
  "http://localhost:4173/intentionally-blank/"
```

`--virtual-time-budget` (not `--timeout`) is what lets page scripts run
before the capture. For interaction, drop a throwaway harness page into
`dist/` (gitignored) that embeds the app in a same-origin iframe and drives
it with synthetic `input`/`submit` events, then screenshot the harness URL.
Windows Edge reaches Vite's preview server on `localhost` directly; its
remote-debugging port does not reach back into WSL. Read the PNG from
`/mnt/c/...`.

**This is packaged as `tools/screenshot.mjs`** (v0.2.6) — use the tool, not
the raw recipe:

```sh
node tools/screenshot.mjs                                  # opening screen
node tools/screenshot.mjs --script tests/fixtures/playthrough.txt
node tools/screenshot.mjs --script s.txt --only 0,4 --out shots
```

It builds, boots `vite preview`, generates the harness, replays the script
one command at a time, and writes a numbered PNG per stage into `shots/`
(gitignored). It **rebuilds by default**: a verification tool that
screenshots a stale `dist/` reports on code that is no longer there, which
is worse than having no tool. `--no-build` opts out when `dist/` is known
fresh; `--url` points at an already-running server; `--keep-harness` leaves
the generated page in `dist/` for debugging.

## Adding an agent

Add a file to `.claude/agents/` with `name`, `description` (this is what the
main session sees when deciding whether to use it — make it precise about
when *not* to use it), `model`, and a `tools` allowlist if the agent should
not edit. Give it: what it owns, hard rules, an escalate-never-guess clause,
and a report format. Add a row to the routing table in `CLAUDE.md`.

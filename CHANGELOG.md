# Changelog

All notable changes to *Intentionally Blank* — spec and game together — are
documented here. Format: [Keep a Changelog](https://keepachangelog.com/);
versioning: [SEMVER](https://semver.org/).

Policy: **MAJOR** = breaks saved games or story canon; **MINOR** = new
player-visible content or a milestone; **PATCH** = fixes, tuning, and
documentation. **Every merge to `main` is a release**: it bumps
`GAME_VERSION` and `package.json`, adds an entry here, updates the
`BACKLOG.md` status board when a milestone moves, bumps the `Spec version`
line of any spec doc it changed, and gets a git tag `vX.Y.Z`. A test
enforces that the version strings agree. (ADR 0005)

## [0.2.9] - 2026-08-29

**Stage A is complete.** The whole game now exists on paper: five acts, 41
rooms, 28 puzzles, and the engine they run on. Docs-only — no engine code
has changed yet. Stage B starts implementation.

### Added

- `docs/superpowers/specs/2026-08-29-stage-a-story-architecture.md` — the
  five-act causal spine (every major beat linked by BUT/THEREFORE), the
  puzzle dependency graph with a two-open-threads verification and a
  walking-dead audit, the room list by zone, 10 NPC agendas, 24 memory
  fragments in two strata, set-piece justifications, and a 20-row
  setup→payoff ledger.

### Changed — canon

Fifteen decisions promoted to `CANON` and recorded as entries 3–17 of
`docs/spec/09-canon-decisions.md`, under the full-game build protocol.
Spec docs 02, 03, 04, and 07 updated to match; rejected options are marked
abandoned rather than deleted (spec 08 §10). The two worth reading first:

- **The investigator is a subject Jules created** — body randomized,
  memory state intentionally blank, seeded from Jules's own offline
  snapshot. The missing person and the person searching are the same mind
  on two sides of an erasure, which is spec 00's "the two mysteries are
  one" met literally. Everything from Act IV down rests on this.
- **Washington DC, Mount Rushmore, Puerto Rico, the distant station, and a
  playable Catan sequence are cut as locations** — each survives
  compressed (Luke visits the facility; Rushmore is a postcard carrying a
  Mandela beat aimed at the player's own memory; Puerto Rico is a
  circular-ownership paper clue; the station folds into the Mars sky
  reveal). Scope: the architecture already prices at the 30k-word ceiling.

Also settled: the client is Jack (sibling IV); Jules was deprecated, not
abducted; the reactor's hidden load computes the town; erasure works by
three learnable rules and a physical agent, the Custodian; the notebook
and credentials are cached at Wall Drug; page 7/8 has three functions
across three acts; a four-phase day replaces exact-turn scheduling; the
escape room is an identity proof in Act IV; one canonical ending.

### Changed — engine architecture

Reconciled against the story architecture's ten engine requirements:
clock-phase conditions and a `phase()` selector (a four-phase day is now
the authored surface over the one-minute tick), a `plotCritical` class the
validator *and* the runtime `move` primitive both refuse to strand,
censor-proof message composition named as a script escape-hatch case with
multi-field prompt values, and a worked page 7/8 example establishing the
document-physics idiom. That last needed no new schema — only the example.

## [0.2.8] - 2026-08-29

Stage A, first half: the engine architecture the rest of the game is built
against. Docs-only — no engine code has changed yet.

### Added

- `docs/superpowers/specs/2026-08-29-stage-a-engine-architecture.md` — the
  world model, content schemas, parser v2, clock and soft NPC schedules,
  save/undo/autosave, UI surfaces, migration plan, and a 22-task build
  breakdown. Written by `game-architect`, revised once against main-session
  review. Design targets: 40–60 rooms, 20–30k authored words, five acts,
  one deterministic engine identical in Vitest, the CLI, and the browser.
- ADR 0008 — content is declarative data (`Cond`/`Effect`/`Prose`) with a
  registered pure-script escape hatch; the engine never imports content.
- ADR 0009 — runtime state is a sparse overlay on authored content, nothing
  derivable is ever stored, saves are versioned with per-release fixtures.
- ADR 0010 — a pure `src/session/` layer owns persistence, undo, and
  checkpoints behind a `SaveStore` interface, keeping ADR 0003 intact.

### Notes

Six revisions were required before acceptance. The two that mattered:
`flags` and `questions` were declared as total records, which contradicted
the overlay rule the entire save-durability contract rests on; and the
`RoomDef.dark` / `ObjectDef.lightSource` overlap left darkness ambiguous —
the worked example would have kept a room dark for a player carrying a lit
lamp. Also added `NpcOverlay.following`, without which Dad could not become
the party member spec 03 §6 requires.

Tasks 1 and 2 of the breakdown shipped ahead of the document, in v0.2.6 and
v0.2.7. Stage B opens at task 3.

## [0.2.7] - 2026-08-29

### Fixed

- **Headless CLI swallowed input during beat delays and crashed on a bad
  `--script`.** Commands now queue behind whatever is still flushing instead
  of interleaving with the beats, and argument errors (`--script` with no
  value, a path that does not exist) print one line on stderr and exit 1
  rather than throwing a stack trace at the player. New `tests/cli.test.ts`
  spawns the CLI and covers both.
- **A command typed during the paced beat sequence was discarded.** The Vue
  shell flushed the pending beats and returned, but `CommandInput` had
  already cleared the field, so the command was lost. The beats now flush
  and the command still runs; a bare Enter flushes without acting.

## [0.2.6] - 2026-08-29

### Added

- `tools/screenshot.mjs` — the WSL browser-verification recipe from
  `docs/DEVELOPMENT.md`, packaged. Builds, boots `vite preview`, generates
  a same-origin iframe harness, replays a command script one command at a
  time, and writes a numbered PNG per stage to `shots/` (gitignored).
  Rebuilds by default so it can never report on a stale `dist/`; `--no-build`,
  `--url`, `--only`, `--size`, and `--keep-harness` are available.

### Fixed

- **Engine-purity check was partially blind.** `tests/purity.test.ts`
  stripped string literals with a context-free regex, so a regex literal
  containing a quote (`/['"]/` in `parser.ts`) made it swallow everything up
  to the next matching quote. Replaced with a real scanner in
  `tests/helpers/source-scan.ts` that tracks comments, all three string
  forms, `${...}` interpolation, regex literals, and regex-vs-division, plus
  a separate module-specifier check (strings are now stripped, so import
  detection could no longer ride on them). Forbidden list gains `navigator`,
  `requestAnimationFrame`, and `performance.now`. 12 unit tests cover the
  scanner; mutation-tested against an injected `window.location` and an
  injected `vue` import, both of which the old check would have missed.

## [0.2.5] - 2026-08-29

### Changed

- **Siblings are named** (Ryan): I Jules, II Luke, III Eli, IV Jack, V
  Sissy. `docs/spec/03-characters-and-relationships.md` gains a birth-order
  table, the tattoo block now carries names, and §4/§9/§10 are retitled.
- Jules (sibling I) is now canonically the missing facilities supervisor,
  by elimination from the other four siblings' canon 2047 occupations.
- Both decisions registered in `docs/spec/09-canon-decisions.md` (entries
  1 and 2) under the full-game build protocol.

## [0.2.4] - 2026-08-29

### Added

- Full-game build protocol in `docs/DEVELOPMENT.md`: one continuous run
  in stages A–F, each deployed to production; canon authority delegated
  to the main session for the build with every decision recorded in the
  new `docs/spec/09-canon-decisions.md`; main session on Opus with the
  Fable `game-architect` writing architecture and plans. CLAUDE.md rule 1
  and the routing table note the exception. `BACKLOG.md` gains the stage
  board.
- `docs/DEVELOPMENT.md`: browser verification on WSL via Windows Edge
  headless (`--virtual-time-budget`) and an iframe harness.

## [0.2.3] - 2026-08-29

### Changed

- Process discipline guardrail (Ryan): "Avoid process obesity" added to
  `docs/DEVELOPMENT.md` with the content-vs-machinery metric and a
  calibration table of light and full paths by change type; CLAUDE.md rule
  8 summarizes it. Docs, tuning, and one-file fixes now commit straight to
  `main` with a version bump.

## [0.2.2] - 2026-08-29

### Fixed

- `tests/step.test.ts` asserted the literal `0.2.0` in the `VERSION`
  response instead of `GAME_VERSION`, so the 0.2.1 bump failed CI and never
  deployed. The test now reads the constant. v0.2.1's tag stands but was
  never live; this release carries its content.

## [0.2.1] - 2026-08-29

### Changed

- Storytelling framework (Ryan, 2026-08-29): design constitution gains
  §29 *Major Beats Connect by Causation or Complication* (the BUT /
  THEREFORE test, "and then" as a warning sign, the event→therefore→but
  rhythm, breathing room), §30 *Setup Leads to Payoff*, §31 *Prefer
  Recontextualization Over Revelation*, §32 *Set Pieces Earn Their Place
  Causally*, and §25 extended with the chain of dramatic questions. Story
  canon gains §21 *Causal Spine of Act I* (`WORKING IDEA`). Writing guide
  gains §18 *Beat Notes*. Development handoff §3 requires each milestone
  spec to state its causal link. `narrative-writer` and `game-architect`
  agents carry the beat test. Spec docs 01, 02, 06, 08 and the spec README
  now carry `Spec version: 0.2.2`.
- Versioning rule tightened: every merge to `main` is a release and bumps
  the version (docs-only changes are PATCH). There is no accumulating
  `[Unreleased]` section. (CLAUDE.md rule 7, ADR 0005, DEVELOPMENT.md)

## [0.2.0] - 2026-08-29

"The machine goes." First playable prototype at
https://polarispixels.github.io/intentionally-blank/ — a five-minute
proof of the REPL, parser, state, event trigger, modal, credentials,
game over, and restart. Not the story yet.

### Added

- Browser REPL (Vue 3 + Vite) with a deterministic parser and synonym
  table, authored responses with rotating variants, a turn counter that
  opens the ACCOUNT REQUIRED modal on turn 4, the `user`/`password` joke,
  the Internet Police sequence, GAME OVER, and RESTART.
- Pure reducer engine (`parse`, `step`, `start`) with a full-playthrough
  test; state is serializable so save/undo can be added later.
- Headless CLI: `npm run play` (with `--script <file> --fast` for scripted
  runs).
- Generated docs site at `/docs/` from the repo's markdown.
- GitHub Actions workflow: test → build → deploy to Pages on push to `main`.
- Version-sync test (`GAME_VERSION` = `package.json` = CHANGELOG).
- Development process: `CLAUDE.md` (hard rules, model routing, token rules,
  workflow), agent roster in `.claude/agents/`, `docs/DEVELOPMENT.md`,
  ADRs 0001–0007, `BACKLOG.md` with the milestone status board.

### Changed

- Spec package flattened into `docs/spec/`; `MASTER_SPEC.md` dropped in
  favor of the generated docs site; the spec's changelog merged here.
  Version ladder shifted: the real opening room is now 0.3.0.

## [0.1.0] - 2026-08-29

### Added

- Initial specification package for *Intentionally Blank*: product
  overview, design constitution based on classic interactive-fiction
  lessons, story and world canon, character and family canon, gameplay and
  puzzle systems, browser/parser/save requirements, narrative tone and
  vocabulary guide, backlog and open questions, development handoff
  guidance.

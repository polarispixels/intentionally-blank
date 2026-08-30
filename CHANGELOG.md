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

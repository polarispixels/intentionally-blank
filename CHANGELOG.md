# Changelog

All notable changes to *Intentionally Blank* — spec and game together — are
documented here. Format: [Keep a Changelog](https://keepachangelog.com/);
versioning: [SEMVER](https://semver.org/).

Policy: **MAJOR** = breaks saved games or story canon; **MINOR** = new
player-visible content or a milestone; **PATCH** = fixes and tuning. Every
release bumps `GAME_VERSION` and `package.json`, adds an entry here, updates
the `BACKLOG.md` status board, and gets a git tag `vX.Y.Z`. A test enforces
that the version strings agree. (ADR 0005)

## [Unreleased]

### Added

- Development process: `CLAUDE.md` (hard rules, model routing, token rules,
  workflow), agent roster in `.claude/agents/` (`game-architect`,
  `narrative-writer`, `code-reviewer`, `game-builder`, `qa-verifier`,
  `world-scribe`, `scout`), `docs/DEVELOPMENT.md`, ADRs 0001–0007.
- `BACKLOG.md` with the milestone status board (M0–M4 from spec 08 §3).
- Repository `polarispixels/intentionally-blank`; GitHub Pages target
  `https://polarispixels.github.io/intentionally-blank/`.

### Changed

- Spec package flattened into `docs/spec/` (the nine numbered docs plus
  README). `MASTER_SPEC.md` dropped in favor of the generated docs site;
  the spec's own changelog merged into this file. Repository target in the
  spec README updated from `/blank` to `intentionally-blank`.

## [0.1.0] - 2026-08-29

### Added

- Initial specification package for *Intentionally Blank*: product
  overview, design constitution based on classic interactive-fiction
  lessons, story and world canon, character and family canon, gameplay and
  puzzle systems, browser/parser/save requirements, narrative tone and
  vocabulary guide, backlog and open questions, development handoff
  guidance.

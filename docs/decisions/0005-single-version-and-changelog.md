# ADR 0005: One SEMVER version and changelog for spec + game

**Status:** accepted · 2026-08-29

## Context

The spec package arrived with its own `CHANGELOG.md` at 0.1.0 and a README
proposing a single version ladder that covers both documentation and game
(0.1.0 foundation → 0.2.0 first playable → 1.0.0). Block-buddies established
the working pattern: Keep a Changelog, a version constant stamped in the UI,
a git tag per release, and a test that enforces they match.

## Decision

- One version number for the project. The spec's changelog is merged into
  the root `CHANGELOG.md`; each spec doc's `Spec version` line is bumped
  when its content changes as part of a release.
- Keep a Changelog format with an `[Unreleased]` section updated in every
  PR that changes player-visible behavior or canon.
- Policy: MAJOR = breaks saves or story canon; MINOR = new player-visible
  content or milestone; PATCH = fixes/tuning.
- Sources of truth that must agree: `GAME_VERSION` in the engine,
  `package.json` `version`, and the top `## [x.y.z]` entry. A Vitest test
  asserts equality. Each release is tagged `vX.Y.Z`.
- The in-game `VERSION` command prints the version (Infocom precedent) and
  serves as a live-deploy check.

## Consequences

- A forgotten bump fails CI instead of shipping silently.
- `MASTER_SPEC.md` (a concatenation) is dropped; the generated docs site
  (ADR 0006) provides the single-page view without a drift hazard.

# ADR 0001: Static site on GitHub Pages, built by Actions

**Status:** accepted · 2026-08-29

## Context

The spec makes browser-first, static-hostable, GitHub-Pages-suitable a
`CANON REQUIREMENT` (05 §1). Ryan wants a public URL to share with friends.
The sister project block-buddies deploys from `main` root with no build
step; this project has one (Vite).

## Decision

- Public repo `polarispixels/intentionally-blank`; site at
  `https://polarispixels.github.io/intentionally-blank/`.
- A GitHub Actions workflow builds `dist/` on push to `main` and deploys it
  with the Pages "workflow" build type. Deploy = merge to `main`.
- The docs site ships inside `dist/docs/` so `/docs/` works on the same host.
- All persistence is browser-local (localStorage or IndexedDB). No server.

## Consequences

- Zero hosting cost and ops. No secrets can exist in the deployed bundle,
  which independently rules out remote-LLM keys (see ADR 0004).
- Cross-device saves and leaderboards are out of scope; export/import save
  (spec 05 §11) covers the realistic need.
- Pages URLs do not redirect on repo rename, so the name is fixed now. Local
  checkout directory stays `~/code/blank`.

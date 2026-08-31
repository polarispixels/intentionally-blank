// The single source of truth for the version is `package.json` (the release
// checklist in docs/DEVELOPMENT.md bumps it there and nowhere else). This
// re-exports it so game code has one import, and so the number cannot drift
// between the manifest and the running game — which it did, silently, when
// the two were maintained by hand.
import pkg from '../package.json';

export const GAME_VERSION: string = pkg.version;

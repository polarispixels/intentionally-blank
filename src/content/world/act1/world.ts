// Act I's own slice, and the whole assembled game.
//
// ADR 0011 item 3 / Stage D E3: `game.ts` assembles `WORLD` from
// `ACT1_SLICE` + `ACT2_SLICE` + `ACT3_SLICE`. Every import of `WORLD` from
// this module (the eight `tests/world-act1-*.test.ts` files, `act1/index.ts`,
// and — transitively — anything that imported `WORLD` from this path before
// D0) now means the whole game, not just Act I. `ACT1_SLICE` itself lives in
// `./slice` (see that file's header for why this file doesn't declare it
// directly — the cycle this split avoids).
export { ACT1_SLICE } from './slice';
export { WORLD } from '../game';

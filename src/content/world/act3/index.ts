// Act III ("Heat Doesn't Lie") — `WorldSlice` export.
//
// Empty in D0. Filled wave by wave: D3 (the facility surface), D4 (the
// descent — S1, tunnel, S5, chase), D5 (Sublevel 6, the Act III boundary),
// per the Stage D plan §1/§2. `game.ts` spreads this into the assembled
// `WORLD` alongside `ACT1_SLICE` and `ACT2_SLICE`; a duplicate id in any
// keyed table throws at assembly time, so this slice growing in later
// waves is caught immediately if it collides with Act I or Act II.
//
// `import type` only, below — no runtime dependency on `game.ts`, so this
// file cannot be part of any import cycle with it.
import type { WorldSlice } from '../game';

export const ACT3_SLICE: WorldSlice = { flags: {} };

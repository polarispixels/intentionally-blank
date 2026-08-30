// The engine's public barrel (§0's directory map). Retired the MVP re-exports
// (`types`/`state`/`parser`/`step`/`text` — task 22 deleted all five files)
// in favor of the actual v2 surface: nothing in this codebase currently
// imports this barrel directly (`src/session/`, `src/cli/`, and `src/ui/`
// all import the specific submodule they need — the same "narrow, targeted
// import" convention the rest of this engine follows internally, per
// `tests/purity.test.ts`'s own scan), so this is a convenience surface for
// a future external consumer, not a load-bearing internal seam. Curated to
// the pieces a shell actually needs to drive one turn end to end: ids,
// world/state types and their pure readers, the parser, and `step` itself.

export * from './ids';
export type { GameEvent, GameState, WorldDef } from './world';
export { initialState, isDark, npcRoom, objectLocation, objectState, scope } from './world';
export type { InterpretOutcome, ScopeView, StructuredAction } from './interpreter';
export { DeterministicParser } from './interpreter';
export type { CompiledVocabulary } from './parser';
export { compileVocabulary } from './parser';
export type { TurnResult } from './turn';
export { step } from './turn';

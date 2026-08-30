// Transcript line shapes for the Vue shell (§8 task 22). One `Line` per
// rendered unit of output; `kind` is what `Transcript.vue`/`styles.css`
// style on — memories, clues, and questions get their own kind (and their
// own CSS class) so they never read as ordinary prose, matching the CLI's
// own marker convention (`src/cli/render.ts`) but as a style, not a glyph.

export type LineKind =
  | 'player' // the player's own typed command, echoed locally (v2 never emits an `echo` GameEvent — see render.ts)
  | 'prose' // ordinary narration: GameEvent 'line' of kind 'prose' or 'beat'
  | 'system' // GameEvent 'line' of kind 'system', plus this shell's own chrome (checkpoint saved, "THE END", errors)
  | 'memory' // a recovered memory fragment
  | 'clue' // a noted clue
  | 'question' // a question opened or answered
  | 'clarify' // the parser's disambiguation question
  | 'death'; // "YOU HAVE DIED"

export interface Line {
  kind: LineKind;
  text: string;
}

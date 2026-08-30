// The migration chain + durability machinery (spec §5.2, ADR 0009, §8 task
// 19). Everything a save-taken-today-survives-the-build claim rests on
// lives here: an ordered `saveVersion` chain, a validated content-id
// renames table, and the replay invariant's own runner. Task 18's
// `savefile.ts` deliberately stopped at "throw on an unrecognized
// `saveVersion`" and left the real chain to this file — see its header.
//
// HOW TO ADD saveVersion 2, WHEN THE DAY COMES (this is the whole point of
// this task — read this before touching anything below):
//   1. Change the shape of `GameState`/`SaveFile` however the new content
//      needs, and bump `SAVE_VERSION` to `2` in `savefile.ts`.
//   2. Push one entry onto `MIGRATIONS`: `{ version: 1, migrate, renames? }`
//      — `version` names the `saveVersion` this step upgrades *from*, so a
//      1→2 step is registered under `1`. `migrate` takes the raw parsed
//      envelope in *old* shape and returns it in *new* shape (still
//      untyped — the old shape is no longer `SaveFile`, by definition).
//      If any content id was renamed as part of this change, add the
//      `renames` entries too (see below) rather than special-casing the id
//      inside `migrate` by hand.
//   3. Add `tests/fixtures/saves/v2.json` — a save actually produced by the
//      new code (e.g. `EXPORT` mid-playthrough). `tests/migrate.test.ts`
//      enumerates `tests/fixtures/saves/` and fails outright if any
//      `saveVersion` from 1 up to `SAVE_VERSION` has no matching fixture —
//      so this step isn't optional housekeeping, it's load-bearing: skip
//      it and `npm test` goes red on its own, which is the "a migration
//      without its fixture is a blocking review finding" rule (ADR 0009)
//      made mechanical instead of a review checklist item someone forgets.
//   4. `npm test`. The fixture-chain test replays `v1.json` through the new
//      migration and plays scripted turns against current content; a wrong
//      migration fails there, not in a player's browser.
//
// RENAMES (§5.2 point 4): renaming a content id is a migration, never a
// silent content edit. `RenamesTable` is a flat list of `{ domain, from,
// to }`; `validateMigrationRenames(world, renames)` is the "pointing at an
// id that doesn't exist is a content bug" check the task calls for — it is
// deliberately *not* run inside `migrateSaveFile` itself (that would make
// every load depend on having a live `WorldDef` on hand, which the
// session-layer load path doesn't carry — see `session.ts`'s `load`/
// `importSave`/`undo`, none of which take a `world` argument). Instead
// it's a content-test-shaped check: `tests/migrate.test.ts` runs it against
// every registered migration and the current world, the same way
// `validate.ts`'s own rules are tested against a `WorldDef`, not invoked at
// runtime. `applyRenames` (the runtime half, id substitution only) needs no
// `WorldDef` at all and stays pure string-in/string-out.
//
// SCOPE NOTE on what `applyRenames` rewrites: every domain the save
// overlay actually keys by an authored id — `objects`/`npcs`/`flags`/
// `visited`/`memories`/`clues`/`questions`/`hintsUsed`/`location`, plus the
// pronoun antecedents `parser.it`/`.him`/`.her`/`.them`. It deliberately
// does **not** rewrite `parser.pending`/`parser.last` (an in-flight
// disambiguation question or AGAIN's repeatable command) or
// `firedEvents`/`ending.id` (world-event/ending ids, which have no branded
// id type on `WorldDef` yet — `validate.ts`'s own scope note flags the
// same gap). Both are short-lived, turn-to-turn state that essentially
// never survives dormant across a version boundary in practice; a future
// migration that actually needs to rewrite one of these should extend
// `applyRenames` rather than route around it.

import type { InterpretOutcome, ParserContext } from '../engine/interpreter';
import type { ClueId, MemoryId, NpcId, ObjectId, PlaceId, PuzzleId, QuestionId, RoomId } from '../engine/ids';
import type { CompiledVocabulary } from '../engine/parser';
import { step } from '../engine/turn';
import { initialState } from '../engine/world';
import type { GameState, NpcOverlay, ObjectOverlay, WorldDef } from '../engine/world';
import type { Finding } from '../engine/validate';
import { SAVE_VERSION } from './savefile';
import type { SaveFile, HistoryEntry } from './savefile';

// ---------------------------------------------------------------------------
// Renames table (§5.2 point 4)
// ---------------------------------------------------------------------------

/** The overlay domains a content id can be renamed within — one per `GameState` id-keyed field family. */
export type IdDomain = 'room' | 'object' | 'npc' | 'flag' | 'memory' | 'clue' | 'question' | 'puzzle';

export interface RenameEntry {
  domain: IdDomain;
  from: string;
  to: string;
}

export type RenamesTable = readonly RenameEntry[];

/** `world`'s id→def registry for `domain`, used only to check a rename's `to` actually exists. */
function domainRegistry(world: WorldDef, domain: IdDomain): Record<string, unknown> | undefined {
  switch (domain) {
    case 'room':
      return world.rooms;
    case 'object':
      return world.objects;
    case 'npc':
      return world.npcs;
    case 'flag':
      return world.flags;
    case 'memory':
      return world.memories;
    case 'clue':
      return world.clues;
    case 'question':
      return world.questions;
    case 'puzzle':
      return world.puzzles;
  }
}

/**
 * "A rename pointing at an id that doesn't exist is a content bug" (task
 * brief), plus the same for a no-op rename (`from === to`) — both are
 * authoring mistakes, not migration-runtime failures, so they surface as
 * `Finding`s the same shape `validate.ts` uses rather than a thrown error.
 * Run against a real `WorldDef` from a test (see this file's header) —
 * never called by `migrateSaveFile` itself.
 */
export function validateMigrationRenames(world: WorldDef, renames: RenamesTable): Finding[] {
  const findings: Finding[] = [];
  for (const entry of renames) {
    if (entry.from === entry.to) {
      findings.push({
        code: 'rename-noop',
        severity: 'error',
        message: `renames: ${entry.domain} "${entry.from}" is renamed to itself`,
      });
      continue;
    }
    const registry = domainRegistry(world, entry.domain);
    if (registry?.[entry.to] === undefined) {
      findings.push({
        code: 'rename-unknown-target',
        severity: 'error',
        message: `renames: ${entry.domain} rename "${entry.from}" -> "${entry.to}" points at an id that doesn't exist in the current world`,
      });
    }
  }
  return findings;
}

function renameLookup(renames: RenamesTable, domain: IdDomain): Map<string, string> {
  const map = new Map<string, string>();
  for (const entry of renames) {
    if (entry.domain === domain) map.set(entry.from, entry.to);
  }
  return map;
}

function renameId(id: string, map: Map<string, string>): string {
  return map.get(id) ?? id;
}

function renamePlace(place: PlaceId, rooms: Map<string, string>, objects: Map<string, string>, npcs: Map<string, string>): PlaceId {
  if (typeof place === 'string') {
    // Covers RoomId as well as the literal 'inventory'/'worn'/'nowhere' —
    // a lookup miss on those literals is a no-op, same as any other id the
    // renames table doesn't mention.
    return renameId(place, rooms) as PlaceId;
  }
  if ('in' in place) return { in: renameId(place.in, objects) as ObjectId };
  if ('on' in place) return { on: renameId(place.on, objects) as ObjectId };
  return { npc: renameId(place.npc, npcs) as NpcId };
}

function remapRecordKeys<V>(record: Partial<Record<string, V>>, map: Map<string, string>): Partial<Record<string, V>> {
  const out: Partial<Record<string, V>> = {};
  for (const [id, value] of Object.entries(record)) {
    out[renameId(id, map)] = value as V;
  }
  return out;
}

function remapIdArray(ids: readonly string[], map: Map<string, string>): string[] {
  return ids.map((id) => renameId(id, map));
}

/**
 * The runtime half of §5.2 point 4: rewrites every occurrence of a renamed
 * content id across `state`'s overlays (see this file's header for exactly
 * which fields). Pure id substitution — no `WorldDef` needed, no knowledge
 * of whether the rename is even valid (that's `validateMigrationRenames`'s
 * job, run separately). A no-op `RenamesTable` returns `state` unchanged.
 */
export function applyRenames(state: GameState, renames: RenamesTable): GameState {
  if (renames.length === 0) return state;

  const rooms = renameLookup(renames, 'room');
  const objectsMap = renameLookup(renames, 'object');
  const npcs = renameLookup(renames, 'npc');
  const flags = renameLookup(renames, 'flag');
  const memories = renameLookup(renames, 'memory');
  const clues = renameLookup(renames, 'clue');
  const questions = renameLookup(renames, 'question');
  const puzzles = renameLookup(renames, 'puzzle');

  const objects: Partial<Record<ObjectId, ObjectOverlay>> = {};
  for (const [id, overlay] of Object.entries(state.objects)) {
    const renamed: ObjectOverlay = overlay!;
    objects[renameId(id, objectsMap) as ObjectId] =
      renamed.location !== undefined
        ? { ...renamed, location: renamePlace(renamed.location, rooms, objectsMap, npcs) }
        : renamed;
  }

  const npcOverlays: Partial<Record<NpcId, NpcOverlay>> = {};
  for (const [id, overlay] of Object.entries(state.npcs)) {
    const renamed: NpcOverlay = overlay!;
    npcOverlays[renameId(id, npcs) as NpcId] =
      renamed.room !== undefined && renamed.room !== 'offstage'
        ? { ...renamed, room: renameId(renamed.room, rooms) as RoomId }
        : renamed;
  }

  const parser: ParserContext = {
    ...state.parser,
    ...(state.parser.it !== undefined ? { it: renameId(state.parser.it, objectsMap) as ObjectId } : {}),
    ...(state.parser.him !== undefined ? { him: renameId(state.parser.him, npcs) as NpcId } : {}),
    ...(state.parser.her !== undefined ? { her: renameId(state.parser.her, npcs) as NpcId } : {}),
    ...(state.parser.them !== undefined
      ? {
          them: Array.isArray(state.parser.them)
            ? (remapIdArray(state.parser.them, objectsMap) as ObjectId[])
            : (renameId(state.parser.them, npcs) as NpcId),
        }
      : {}),
  };

  return {
    ...state,
    location: renameId(state.location, rooms) as RoomId,
    objects,
    npcs: npcOverlays,
    flags: remapRecordKeys(state.flags, flags) as GameState['flags'],
    visited: remapRecordKeys(state.visited, rooms) as Record<RoomId, number>,
    memories: remapIdArray(state.memories, memories) as MemoryId[],
    clues: remapIdArray(state.clues, clues) as ClueId[],
    questions: remapRecordKeys(state.questions, questions) as GameState['questions'],
    hintsUsed: remapRecordKeys(state.hintsUsed, puzzles) as GameState['hintsUsed'],
    parser,
  };
}

// ---------------------------------------------------------------------------
// The saveVersion chain (§5.2 point 2)
// ---------------------------------------------------------------------------

export interface Migration {
  /** The `saveVersion` this step upgrades *from* (a 1→2 step is registered under `1`). */
  version: number;
  /** Transforms the raw parsed envelope from `version`'s shape to `version + 1`'s. Untyped in both directions — `version`'s shape is no longer today's `SaveFile`. */
  migrate: (raw: Record<string, unknown>) => Record<string, unknown>;
  /** Content id renames this step performs, if any (§5.2 point 4). */
  renames?: RenamesTable;
}

/**
 * Empty today — `saveVersion` has never bumped (spec §7 point 5: "the save
 * lineage starts at `saveVersion: 1` here"). See this file's header for
 * the recipe that fills this in.
 */
export const MIGRATIONS: readonly Migration[] = [];

/**
 * Walks `migrations` from `data.saveVersion` up to `targetVersion`,
 * applying each step's `migrate` and (if any) `renames` in turn and
 * stamping the new `saveVersion` after each hop. Factored out of
 * `migrateSaveFile` below so the chain-walking logic itself is testable
 * against a fabricated multi-step chain without touching the real (today
 * empty) `MIGRATIONS` — see `tests/migrate.test.ts`, and this file's
 * header for why exercising *this* logic well is the actual point of the
 * task even though there is only one real `saveVersion` to migrate from
 * today.
 */
export function applyMigrationChain(
  data: Record<string, unknown>,
  migrations: readonly Migration[],
  targetVersion: number,
): Record<string, unknown> {
  let result = data;
  let version = result.saveVersion;
  if (typeof version !== 'number') {
    throw new Error(`applyMigrationChain: save has no numeric saveVersion (got ${JSON.stringify(result.saveVersion)})`);
  }
  if (version > targetVersion) {
    throw new Error(`applyMigrationChain: save is from saveVersion ${version}, newer than the target ${targetVersion}`);
  }
  while (version < targetVersion) {
    const migration = migrations.find((m) => m.version === version);
    if (migration === undefined) {
      throw new Error(`applyMigrationChain: no migration registered for saveVersion ${version} -> ${version + 1}`);
    }
    result = migration.migrate(result);
    if (migration.renames !== undefined && migration.renames.length > 0) {
      result = { ...result, state: applyRenames(result.state as GameState, migration.renames) };
    }
    version += 1;
    result = { ...result, saveVersion: version };
  }
  return result;
}

/**
 * Parses a save JSON blob and runs it through `MIGRATIONS` until it reaches
 * `SAVE_VERSION` (`applyMigrationChain` above). Drop-in replacement for
 * `savefile.ts`'s `deserializeSave` at every call site that might load a
 * save written by an older build — `session.ts`'s `load`/`importSave`/
 * `undo` all go through this, not `deserializeSave` directly (§5.2's whole
 * point: an old save keeps loading).
 */
export function migrateSaveFile(json: string): SaveFile {
  const data = JSON.parse(json) as Record<string, unknown>;
  return applyMigrationChain(data, MIGRATIONS, SAVE_VERSION) as unknown as SaveFile;
}

// ---------------------------------------------------------------------------
// The replay invariant (§5.2 point 3)
// ---------------------------------------------------------------------------

/**
 * Rebuilds a `GameState` from `initialState(world)` by re-running every
 * recorded turn through `step()` — the release-time invariant ("on
 * unchanged content, replaying `history` from `initialState` reproduces
 * `state` exactly") and the manual last-resort recovery path if a
 * migration is ever wrong (§5.2 point 3, ADR 0009). It is a diagnostic,
 * not automatic recovery: content changes legitimately change what replay
 * produces, and it is void on a `historyTruncated` save (the earliest
 * entries are gone, so replaying from `initialState` no longer starts from
 * the save's actual origin) — callers must not assert equality in that
 * case (`tests/migrate.test.ts` demonstrates why).
 *
 * Takes `resolve` — a caller-supplied `(state, entry, index) =>
 * InterpretOutcome` — rather than reparsing `entry.input` itself. Turning
 * raw text back into an `InterpretOutcome` needs
 * `DeterministicParser.interpret()` fed a `ScopeView` built from
 * `(world, state)`, and that production `ScopeView` builder is still
 * unbuilt (`turn.ts`'s own header, `tests/session.test.ts`'s own header:
 * "wiring the real parser end to end is CLI v2's job," task 20). This
 * keeps `replay` honest about what it proves today — the same sequence of
 * resolved actions reproduces the same state — without pretending to close
 * a gap this module doesn't own; task 20 is the natural place to supply a
 * `resolve` that really does reparse `entry.input`.
 */
export function replay(
  world: WorldDef,
  vocab: CompiledVocabulary,
  history: readonly HistoryEntry[],
  resolve: (state: GameState, entry: HistoryEntry, index: number) => InterpretOutcome,
): GameState {
  let state = initialState(world);
  history.forEach((entry, index) => {
    const outcome = resolve(state, entry, index);
    state = step(world, state, vocab, outcome).state;
  });
  return state;
}

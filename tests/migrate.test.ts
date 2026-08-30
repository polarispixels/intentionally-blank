// tests/migrate.test.ts — spec §5.2 (the durability contract's migration
// half), ADR 0009, §8 task 19.
//
// Scope: `src/session/migrate.ts` — the `saveVersion` chain runner
// (`applyMigrationChain`/`migrateSaveFile`), the renames table
// (`validateMigrationRenames`/`applyRenames`), and the replay invariant
// (`replay`). Plus the fixture-save chain itself: `tests/fixtures/saves/`
// is enumerated (not hand-listed) so a `saveVersion` bump without a
// matching fixture fails here, not in review.
//
// Turns are driven by hand-built `InterpretOutcome`s, matching
// `tests/session.test.ts`'s own precedent (see its header) — building a
// production `ScopeView` from `WorldDef`/`GameState` is still unbuilt
// (task 20). `replay`'s `resolve` callback is therefore supplied by the
// test itself, not by reparsing `HistoryEntry.input` through a real
// parser — see `migrate.ts`'s own header for why that's the honest scope
// today.

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { BUILTIN_VERB_IDS } from '../src/engine/actions';
import type { NpcId, ObjectId } from '../src/engine/ids';
import type { InterpretOutcome, ScopeView, StructuredAction } from '../src/engine/interpreter';
import { compileVocabulary } from '../src/engine/parser/vocabulary';
import { objectLocation } from '../src/engine/resolve';
import type { GameState, WorldDef } from '../src/engine/world';
import { RESPONSES } from '../src/content/responses';
import {
  FIXTURE_WORLD,
  HAT,
  KEY,
  LETTER,
  ROOM_A,
  ROOM_B,
} from './fixtures/world';
import { SAVE_VERSION } from '../src/session/savefile';
import type { HistoryEntry, SaveFile } from '../src/session/savefile';
import { createSession, exportSave, importSave, takeTurn } from '../src/session/session';
import type { PersistOptions } from '../src/session/session';
import { MemoryStore } from '../src/session/store';
import {
  applyMigrationChain,
  applyRenames,
  migrateSaveFile,
  replay,
  validateMigrationRenames,
} from '../src/session/migrate';
import type { Migration, RenamesTable } from '../src/session/migrate';

const NOW = '2026-08-30T00:00:00.000Z';
const WORLD: WorldDef = { ...FIXTURE_WORLD, responses: { ...FIXTURE_WORLD.responses, ...RESPONSES } };
const vocab = compileVocabulary(WORLD);

function opts(store: MemoryStore, gameVersion = 'test-0.0.0'): PersistOptions {
  return { store, now: NOW, gameVersion };
}

function takeAction(dobj: ObjectId, raw: string): StructuredAction {
  return { verb: BUILTIN_VERB_IDS.take, dobj, raw };
}

function actionsOutcome(actions: StructuredAction[]): InterpretOutcome {
  return { kind: 'actions', actions };
}

// ---------------------------------------------------------------------------
// Fixture-save chain (§5.2 point 2)
// ---------------------------------------------------------------------------

const SAVES_DIR = join(process.cwd(), 'tests', 'fixtures', 'saves');

describe('fixture-save chain', () => {
  const files = readdirSync(SAVES_DIR).filter((f) => f.endsWith('.json'));

  it('has at least one fixture', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it('has a fixture for every saveVersion from 1 up to the current SAVE_VERSION — a bump without one fails right here', () => {
    for (let v = 1; v <= SAVE_VERSION; v++) {
      expect(files, `expected tests/fixtures/saves/v${v}.json`).toContain(`v${v}.json`);
    }
  });

  it.each(files)('%s loads through the chain and plays scripted turns against the current world', (file) => {
    const json = readFileSync(join(SAVES_DIR, file), 'utf8');
    const loaded = importSave(json);

    // Sane, current-shaped state — not just "didn't throw."
    expect(loaded.state.turn).toBeGreaterThanOrEqual(0);
    expect(loaded.undoRing).toEqual([]); // §5.5: a load always reseeds the ring

    // Playable: a real turn against current content, off the (possibly
    // migrated) loaded state.
    const before = loaded.state.turn;
    const played = takeTurn(WORLD, loaded, vocab, actionsOutcome([takeAction(LETTER, 'take letter')]), opts(new MemoryStore()));
    expect(played.session.state.turn).toBe(before + 1);
    expect(objectLocation(WORLD, played.session.state, LETTER)).toBe('inventory');
  });
});

// ---------------------------------------------------------------------------
// applyMigrationChain (§5.2 point 2) — the chain-walking machinery itself,
// exercised against a fabricated multi-step chain since real MIGRATIONS is
// empty today (see migrate.ts's header for why this is still the point).
// ---------------------------------------------------------------------------

describe('applyMigrationChain', () => {
  it('is a no-op once the save is already at the target version', () => {
    const data = { saveVersion: 1, marker: 'untouched' };
    expect(applyMigrationChain(data, [], 1)).toEqual(data);
  });

  it('walks a multi-step chain in order, applying each migrate() and bumping saveVersion after each hop', () => {
    const migrations: Migration[] = [
      { version: 1, migrate: (raw) => ({ ...raw, addedAtV2: true }) },
      { version: 2, migrate: (raw) => ({ ...raw, addedAtV3: true }) },
    ];
    const data = { saveVersion: 1, original: true };
    const result = applyMigrationChain(data, migrations, 3);
    expect(result).toEqual({ saveVersion: 3, original: true, addedAtV2: true, addedAtV3: true });
  });

  it('throws when a save is newer than the target version (a downgrade)', () => {
    expect(() => applyMigrationChain({ saveVersion: 5 }, [], 1)).toThrow(/newer than the target/);
  });

  it('throws when the chain has a gap — no migration registered for an encountered version', () => {
    expect(() => applyMigrationChain({ saveVersion: 1 }, [], 3)).toThrow(/no migration registered for saveVersion 1/);
  });

  it('throws when saveVersion is missing or not a number', () => {
    expect(() => applyMigrationChain({}, [], 1)).toThrow(/no numeric saveVersion/);
    expect(() => applyMigrationChain({ saveVersion: 'x' }, [], 1)).toThrow(/no numeric saveVersion/);
  });

  it('applies a step\'s renames to state on the same hop as its migrate()', () => {
    const migrations: Migration[] = [
      {
        version: 1,
        migrate: (raw) => raw,
        renames: [{ domain: 'object', from: 'old_key', to: 'fixture_key' }],
      },
    ];
    const data = {
      saveVersion: 1,
      state: baseState({ objects: { old_key: { location: 'inventory' } } as unknown as GameState['objects'] }),
    };
    const result = applyMigrationChain(data, migrations, 2);
    const state = result.state as GameState;
    expect(state.objects).toEqual({ fixture_key: { location: 'inventory' } });
    expect(result.saveVersion).toBe(2);
  });
});

describe('migrateSaveFile', () => {
  it('parses a current-version save and returns it unchanged (today\'s empty MIGRATIONS, real SAVE_VERSION)', () => {
    const store = new MemoryStore();
    let session = createSession(WORLD);
    session = takeTurn(WORLD, session, vocab, actionsOutcome([takeAction(KEY, 'take key')]), opts(store)).session;
    const json = exportSave(session, opts(store));

    const loaded = migrateSaveFile(json);
    expect(loaded.saveVersion).toBe(SAVE_VERSION);
    expect(loaded.state).toEqual(session.state);
    expect(loaded.history).toEqual(session.history);
  });
});

// ---------------------------------------------------------------------------
// The renames table (§5.2 point 4)
// ---------------------------------------------------------------------------

function baseState(overrides: Partial<GameState> = {}): GameState {
  const fresh = createSession(WORLD).state;
  return { ...fresh, ...overrides };
}

describe('validateMigrationRenames', () => {
  it('accepts a rename whose target id exists in the current world', () => {
    const renames: RenamesTable = [{ domain: 'object', from: 'old_key', to: 'fixture_key' }];
    expect(validateMigrationRenames(WORLD, renames)).toEqual([]);
  });

  it('rejects a rename pointing at an id that does not exist — the "content bug" case', () => {
    const renames: RenamesTable = [{ domain: 'object', from: 'old_key', to: 'no_such_object' }];
    const findings = validateMigrationRenames(WORLD, renames);
    expect(findings).toHaveLength(1);
    expect(findings[0]!.code).toBe('rename-unknown-target');
    expect(findings[0]!.severity).toBe('error');
  });

  it('rejects a no-op rename (from === to)', () => {
    const renames: RenamesTable = [{ domain: 'object', from: 'fixture_key', to: 'fixture_key' }];
    const findings = validateMigrationRenames(WORLD, renames);
    expect(findings).toHaveLength(1);
    expect(findings[0]!.code).toBe('rename-noop');
  });

  it('checks every domain against its own registry, not a shared one', () => {
    // A real object id used as a room rename target: wrong registry, must fail.
    const renames: RenamesTable = [{ domain: 'room', from: 'old_room', to: 'fixture_key' }];
    const findings = validateMigrationRenames(WORLD, renames);
    expect(findings).toHaveLength(1);
    expect(findings[0]!.code).toBe('rename-unknown-target');
  });

  it('collects every finding in one pass, not just the first', () => {
    const renames: RenamesTable = [
      { domain: 'object', from: 'a', to: 'no_such_object' },
      { domain: 'flag', from: 'b', to: 'no_such_flag' },
    ];
    expect(validateMigrationRenames(WORLD, renames)).toHaveLength(2);
  });
});

describe('applyRenames', () => {
  it('is a no-op for an empty table', () => {
    const state = baseState();
    expect(applyRenames(state, [])).toBe(state);
  });

  it('renames an object overlay key and a location reference into that object ({in: objId})', () => {
    const state = baseState({
      objects: {
        old_key: { location: 'inventory' },
        old_chest: { location: ROOM_A, open: false },
      } as unknown as GameState['objects'],
    });
    const renames: RenamesTable = [
      { domain: 'object', from: 'old_key', to: 'fixture_key' },
      { domain: 'object', from: 'old_chest', to: 'fixture_chest' },
    ];
    const renamed = applyRenames(state, renames);
    expect(renamed.objects).toEqual({
      fixture_key: { location: 'inventory' },
      fixture_chest: { location: ROOM_A, open: false },
    });
  });

  it('renames an object located inside/on a renamed container ({in}/{on})', () => {
    const state = baseState({
      objects: {
        widget: { location: { in: 'old_chest' } },
        gadget: { location: { on: 'old_shelf' } },
      } as unknown as GameState['objects'],
    });
    const renames: RenamesTable = [
      { domain: 'object', from: 'old_chest', to: 'new_chest' },
      { domain: 'object', from: 'old_shelf', to: 'new_shelf' },
    ];
    const renamed = applyRenames(state, renames);
    expect(renamed.objects['widget' as ObjectId]?.location).toEqual({ in: 'new_chest' });
    expect(renamed.objects['gadget' as ObjectId]?.location).toEqual({ on: 'new_shelf' });
  });

  it('renames an object carried by a renamed npc ({npc: npcId})', () => {
    const state = baseState({
      objects: { coin: { location: { npc: 'old_guide' } } } as unknown as GameState['objects'],
    });
    const renamed = applyRenames(state, [{ domain: 'npc', from: 'old_guide', to: 'new_guide' }]);
    expect(renamed.objects['coin' as ObjectId]?.location).toEqual({ npc: 'new_guide' });
  });

  it('renames an npc overlay key and its pinned room', () => {
    const state = baseState({
      npcs: { old_guide: { room: ROOM_A } } as unknown as GameState['npcs'],
    });
    const renamed = applyRenames(state, [
      { domain: 'npc', from: 'old_guide', to: 'new_guide' },
      { domain: 'room', from: ROOM_A, to: ROOM_B },
    ]);
    expect(renamed.npcs).toEqual({ new_guide: { room: ROOM_B } });
  });

  it('leaves a following npc, or an npc pinned "offstage", alone (no room field to rename)', () => {
    const state = baseState({
      npcs: { old_guide: { following: true } } as unknown as GameState['npcs'],
    });
    const renamed = applyRenames(state, [{ domain: 'npc', from: 'old_guide', to: 'new_guide' }]);
    expect(renamed.npcs).toEqual({ new_guide: { following: true } });
  });

  it('renames flags, visited rooms, memories, clues, questions, and hintsUsed keys/entries', () => {
    const state = baseState({
      flags: { old_flag: true } as unknown as GameState['flags'],
      visited: { [ROOM_A]: 0 } as unknown as GameState['visited'],
      memories: ['old_memory'] as unknown as GameState['memories'],
      clues: ['old_clue'] as unknown as GameState['clues'],
      questions: { old_question: 'open' } as unknown as GameState['questions'],
      hintsUsed: { old_puzzle: 2 } as unknown as GameState['hintsUsed'],
      location: ROOM_A,
    });
    const renamed = applyRenames(state, [
      { domain: 'flag', from: 'old_flag', to: 'new_flag' },
      { domain: 'room', from: ROOM_A, to: ROOM_B },
      { domain: 'memory', from: 'old_memory', to: 'new_memory' },
      { domain: 'clue', from: 'old_clue', to: 'new_clue' },
      { domain: 'question', from: 'old_question', to: 'new_question' },
      { domain: 'puzzle', from: 'old_puzzle', to: 'new_puzzle' },
    ]);
    expect(renamed.flags).toEqual({ new_flag: true });
    expect(renamed.visited).toEqual({ [ROOM_B]: 0 });
    expect(renamed.memories).toEqual(['new_memory']);
    expect(renamed.clues).toEqual(['new_clue']);
    expect(renamed.questions).toEqual({ new_question: 'open' });
    expect(renamed.hintsUsed).toEqual({ new_puzzle: 2 });
    expect(renamed.location).toBe(ROOM_B);
  });

  it('renames the pronoun antecedents it/him/her/them in parser context', () => {
    const state = baseState({
      parser: {
        it: 'old_key' as ObjectId,
        him: 'old_guide' as NpcId,
        them: ['old_key', 'old_hat'] as unknown as ObjectId[],
      },
    });
    const renamed = applyRenames(state, [
      { domain: 'object', from: 'old_key', to: 'new_key' },
      { domain: 'object', from: 'old_hat', to: 'new_hat' },
      { domain: 'npc', from: 'old_guide', to: 'new_guide' },
    ]);
    expect(renamed.parser.it).toBe('new_key');
    expect(renamed.parser.him).toBe('new_guide');
    expect(renamed.parser.them).toEqual(['new_key', 'new_hat']);
  });

  it('leaves ids the table does not mention untouched', () => {
    const state = baseState({
      objects: { fixture_key: { location: 'inventory' } } as unknown as GameState['objects'],
    });
    const renamed = applyRenames(state, [{ domain: 'object', from: 'unrelated_id', to: 'also_unrelated' }]);
    expect(renamed.objects).toEqual({ fixture_key: { location: 'inventory' } });
  });
});

// ---------------------------------------------------------------------------
// The replay invariant (§5.2 point 3)
// ---------------------------------------------------------------------------

describe('replay invariant: on unchanged content, replaying history reproduces state exactly', () => {
  it('a real scripted playthrough replays to bit-for-bit the same final state', () => {
    const store = new MemoryStore();
    const o = opts(store);
    let session = createSession(WORLD);
    const script: StructuredAction[] = [takeAction(KEY, 'take key'), takeAction(HAT, 'take hat'), takeAction(LETTER, 'take letter')];

    for (const action of script) {
      session = takeTurn(WORLD, session, vocab, actionsOutcome([action]), o).session;
    }
    expect(session.history).toHaveLength(3);

    const replayed = replay(WORLD, vocab, session.history, (_state, _entry, index) => actionsOutcome([script[index]!]));

    expect(replayed).toEqual(session.state);
  });

  it('is void on a historyTruncated save: replaying a save whose earliest entries were dropped does not reproduce the real state, which is exactly why truncation is flagged rather than silent', () => {
    const store = new MemoryStore();
    const o = opts(store);
    let session = createSession(WORLD);
    const script: StructuredAction[] = [takeAction(KEY, 'take key'), takeAction(HAT, 'take hat')];
    for (const action of script) {
      session = takeTurn(WORLD, session, vocab, actionsOutcome([action]), o).session;
    }

    // Simulate truncation: the ceiling dropped the first entry (§5.1).
    const truncatedHistory: HistoryEntry[] = session.history.slice(1);
    expect(truncatedHistory).toHaveLength(1);

    const replayed = replay(WORLD, vocab, truncatedHistory, (_state, _entry, index) =>
      actionsOutcome([script[index + 1]!]),
    );

    // Replay only ever saw "take hat" — it never took the key, because that
    // turn's history entry is gone. The real state has the key; the
    // replayed one does not. This is the documented void case: a
    // `historyTruncated` save must not be asserted equal to its replay.
    expect(objectLocation(WORLD, session.state, KEY)).toBe('inventory');
    expect(objectLocation(WORLD, replayed, KEY)).toBe(ROOM_A);
    expect(replayed).not.toEqual(session.state);
  });

  it('is a diagnostic, not automatic recovery: a legitimate content change makes replay diverge from a state saved under the old content, on purpose', () => {
    const store = new MemoryStore();
    const o = opts(store);
    let session = createSession(WORLD);
    session = takeTurn(WORLD, session, vocab, actionsOutcome([takeAction(KEY, 'take key')]), o).session;

    // "Unchanged content" is the invariant's own precondition — change the
    // starting room's light source availability and the replayed state
    // legitimately differs, without any migration involved at all.
    const CHANGED_WORLD: WorldDef = { ...WORLD, meta: { ...WORLD.meta, startRoom: ROOM_B } };
    const replayed = replay(CHANGED_WORLD, vocab, session.history, (_state, _entry, index) =>
      actionsOutcome([[takeAction(KEY, 'take key')][index]!]),
    );

    expect(replayed.location).not.toBe(session.state.location);
  });
});

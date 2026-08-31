// World assembly (ADR 0011 item 3; Stage D plan §0.3/§3 E3): `WORLD =
// assemble(ACT1_SLICE, ACT2_SLICE, ACT3_SLICE)`, from `src/content/world/
// game.ts`. Act II and Act III are empty slices in D0, so `WORLD` here is
// content-identical to the pre-D0 Act I world — these tests prove the
// *assembly*, not new content.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { F, R } from '../src/engine/ids';
import { validate } from '../src/engine/validate';
import type { WorldDef } from '../src/engine/world';
import { assemble, WORLD } from '../src/content/world/game';
import type { WorldSlice } from '../src/content/world/game';

const MINIMAL_META = { phases: { morning: 0, afternoon: 1, evening: 2, night: 3 }, weekLength: 7 };

describe('assemble', () => {
  it('validate(WORLD) has zero errors', () => {
    expect(validate(WORLD).filter((f) => f.severity === 'error')).toEqual([]);
  });

  it('throws on a duplicate room id', () => {
    const first: WorldDef = { meta: MINIMAL_META, flags: {}, rooms: { [R('dup_room')]: {} } };
    const second: WorldSlice = { flags: {}, rooms: { [R('dup_room')]: {} } };
    expect(() => assemble(first, second)).toThrow(/duplicate id "dup_room".*"rooms"/);
  });

  it('throws on a duplicate flag id', () => {
    const first: WorldDef = {
      meta: MINIMAL_META,
      flags: { [F('dup_flag')]: { default: false, doc: 'first' } },
    };
    const second: WorldSlice = { flags: { [F('dup_flag')]: { default: true, doc: 'second' } } };

    expect(() => assemble(first, second)).toThrow(/duplicate id "dup_flag".*"flags"/);
  });

  it('does not throw when slices declare disjoint ids', () => {
    const first: WorldDef = { meta: MINIMAL_META, flags: {}, rooms: { [R('room_a')]: {} } };
    const second: WorldSlice = { flags: {}, rooms: { [R('room_b')]: {} } };
    expect(() => assemble(first, second)).not.toThrow();
  });

  it('takes meta from the first slice', () => {
    const first: WorldDef = { meta: MINIMAL_META, flags: {} };
    const world = assemble(first, { flags: {} });
    expect(world.meta).toBe(MINIMAL_META);
  });
});

// `system.buildBoundary` (ADR 0011's own name for it; see `townEdge.ts`'s
// header): the always-closed gate object marking the edge of built content,
// as opposed to an ordinary `*_NO_EXIT_GATE` ("every other direction, in-
// world, not the build boundary" — the same file's own distinction). Every
// such gate is named `*_BOUNDARY_GATE`; `LANDING_BOUNDARY_GATE` is declared
// but deliberately unreferenced (kept, not wired to any exit —
// `frontDesk.ts`'s header), so counting *declared* gate objects would give
// two. Counting exits that actually reference one gives the right answer:
// exactly one, `TOWN_EDGE_BOUNDARY_GATE` on Town Edge's `north` exit.
describe('system.buildBoundary', () => {
  it('exactly one exit references a build-boundary gate', () => {
    let count = 0;
    for (const room of Object.values(WORLD.rooms ?? {})) {
      for (const exit of room.exits ?? []) {
        if (exit.door && /boundary_gate/i.test(exit.door)) count++;
      }
    }
    expect(count).toBe(1);
  });
});

// ADR 0011 item 4: weekday numbers live in `act2/calendar.ts` and nowhere
// else in content.
describe('weekday literals', () => {
  function listTsFiles(dir: string): string[] {
    const files: string[] = [];
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) files.push(...listTsFiles(full));
      else if (entry.endsWith('.ts')) files.push(full);
    }
    return files;
  }

  it('no weekday literal appears outside act2/calendar.ts', () => {
    const root = join(process.cwd(), 'src/content/world');
    const offenders: string[] = [];
    for (const file of listTsFiles(root)) {
      if (file.endsWith(join('act2', 'calendar.ts'))) continue;
      const source = readFileSync(file, 'utf8');
      if (/weekday:\s*\d/.test(source)) offenders.push(file);
    }
    expect(offenders).toEqual([]);
  });
});

// Stage D plan §0.3: "every Act II/III id is namespaced act2_*/act3_*" and
// "every act2_/act3_ id string is declared in its own act's ids.ts" — a
// grep-level check. Passes vacuously in D0 since neither act has any ids
// yet; it exists so the first wave that adds one without declaring it in
// its own `ids.ts` fails this test rather than being caught later.
describe('act ids are declared in their own act', () => {
  function listTsFiles(dir: string): string[] {
    const files: string[] = [];
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) files.push(...listTsFiles(full));
      else if (entry.endsWith('.ts')) files.push(full);
    }
    return files;
  }

  function idsDeclaredIn(idsFile: string): Set<string> {
    // act3's own `ids.ts` doesn't exist yet in D0 (only act2's was asked
    // for) — an empty act with no `ids.ts` has nothing to declare and
    // nothing that should reference it, so this is vacuously fine rather
    // than a file-not-found error.
    if (!existsSync(idsFile)) return new Set();
    const source = readFileSync(idsFile, 'utf8');
    const declared = new Set<string>();
    for (const m of source.matchAll(/\(['"]([a-z0-9_]+)['"]\)/g)) {
      const id = m[1];
      if (id !== undefined) declared.add(id);
    }
    return declared;
  }

  for (const act of ['act2', 'act3'] as const) {
    it(`every ${act}_ id string used under src/content/world/${act} is declared in ${act}/ids.ts`, () => {
      const actDir = join(process.cwd(), 'src/content/world', act);
      const idsFile = join(actDir, 'ids.ts');
      const declared = idsDeclaredIn(idsFile);
      const offenders: string[] = [];
      for (const file of listTsFiles(actDir)) {
        if (file === idsFile) continue;
        const source = readFileSync(file, 'utf8');
        for (const m of source.matchAll(new RegExp(`${act}_[a-z0-9_]+`, 'g'))) {
          if (!declared.has(m[0])) offenders.push(`${file}: ${m[0]}`);
        }
      }
      expect(offenders).toEqual([]);
    });
  }
});

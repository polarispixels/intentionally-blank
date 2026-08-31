import { describe, expect, it } from 'vitest';
import { phase, weekday } from '../src/engine/clock';
import type { WorldMeta } from '../src/engine/world';
import { FIXTURE_WORLD } from './fixtures/world';

// morning 360 (06:00), afternoon 720 (12:00), evening 1080 (18:00),
// night 1320 (22:00) — night wraps past midnight.
const META = FIXTURE_WORLD.meta;

describe('phase()', () => {
  it('resolves the minute exactly at each phase boundary to that phase', () => {
    expect(phase(META, { day: 1, minute: 360 })).toBe('morning');
    expect(phase(META, { day: 1, minute: 720 })).toBe('afternoon');
    expect(phase(META, { day: 1, minute: 1080 })).toBe('evening');
    expect(phase(META, { day: 1, minute: 1320 })).toBe('night');
  });

  it('resolves the minute just before each boundary to the previous phase', () => {
    expect(phase(META, { day: 1, minute: 359 })).toBe('night'); // pre-dawn wrap
    expect(phase(META, { day: 1, minute: 719 })).toBe('morning');
    expect(phase(META, { day: 1, minute: 1079 })).toBe('afternoon');
    expect(phase(META, { day: 1, minute: 1319 })).toBe('evening');
  });

  it('wraps the last phase past midnight through minute 0', () => {
    expect(phase(META, { day: 1, minute: 1439 })).toBe('night');
    expect(phase(META, { day: 1, minute: 0 })).toBe('night');
    expect(phase(META, { day: 1, minute: 1 })).toBe('night');
  });

  it('ignores declaration order — sorts by start minute, not by key name', () => {
    // Deliberately assign minute values out of "natural" name order to
    // prove phase() sorts by value, not by trusting the authored key order.
    const scrambled: WorldMeta = {
      phases: { morning: 1000, afternoon: 100, evening: 500, night: 700 },
      weekLength: 7,
    };
    // sorted by minute: afternoon(100) < evening(500) < night(700) < morning(1000)
    expect(phase(scrambled, { day: 1, minute: 50 })).toBe('morning'); // wraps from 1000
    expect(phase(scrambled, { day: 1, minute: 100 })).toBe('afternoon');
    expect(phase(scrambled, { day: 1, minute: 499 })).toBe('afternoon');
    expect(phase(scrambled, { day: 1, minute: 500 })).toBe('evening');
    expect(phase(scrambled, { day: 1, minute: 700 })).toBe('night');
    expect(phase(scrambled, { day: 1, minute: 999 })).toBe('night');
    expect(phase(scrambled, { day: 1, minute: 1000 })).toBe('morning');
  });

  it('resolves minute 260 (04:20) under Act I\'s own phase table to "night" (ADR 0011: startClock 04:20)', () => {
    // Act I's phase table (src/content/world/act1/world.ts): morning 420,
    // afternoon 720, evening 1080, night 1320 — night wraps past midnight
    // and covers 22:00..06:59, so 04:20 (minute 260) falls inside it.
    const act1Meta: WorldMeta = {
      phases: { morning: 420, afternoon: 720, evening: 1080, night: 1320 },
      weekLength: 7,
    };
    expect(phase(act1Meta, { day: 1, minute: 260 })).toBe('night');
  });

  it('rejects a phases table with duplicate start minutes', () => {
    const duplicate: WorldMeta = {
      phases: { morning: 0, afternoon: 0, evening: 600, night: 1200 },
      weekLength: 7,
    };
    expect(() => phase(duplicate, { day: 1, minute: 0 })).toThrow(/ambiguous|duplicate/i);
  });
});

describe('weekday()', () => {
  it('is 0-based starting on day 1', () => {
    expect(weekday(META, { day: 1, minute: 0 })).toBe(0);
    expect(weekday(META, { day: 2, minute: 0 })).toBe(1);
    expect(weekday(META, { day: 7, minute: 0 })).toBe(6);
  });

  it('wraps across the week boundary', () => {
    expect(weekday(META, { day: 8, minute: 0 })).toBe(0);
    expect(weekday(META, { day: 9, minute: 0 })).toBe(1);
    expect(weekday(META, { day: 15, minute: 0 })).toBe(0);
  });

  it('rejects a non-positive weekLength', () => {
    const bad: WorldMeta = { phases: META.phases, weekLength: 0 };
    expect(() => weekday(bad, { day: 1, minute: 0 })).toThrow();
  });
});

describe('phase: malformed tables', () => {
  it('throws a named error on an empty phase table rather than a reduce error', () => {
    expect(() => phase({ phases: {}, weekLength: 7 } as never, { day: 1, minute: 0 })).toThrow(
      /meta\.phases is empty/,
    );
  });
});

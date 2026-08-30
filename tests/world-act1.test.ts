// Act I, room 1 — the opening room, wired into playable content (task 22a).
// `validate(WORLD)` clean is the proof the content is well-formed.

import { describe, expect, it } from 'vitest';
import { validate } from '../src/engine/validate';
import { WORLD } from '../src/content/world/act1';

describe('validate — Act I room 1', () => {
  it('produces zero errors and zero warnings', () => {
    expect(validate(WORLD)).toEqual([]);
  });
});

// Act I, room 1 — the opening room, wired into playable content (task 22a).
// `validate(WORLD)` clean of ERRORS is the proof the content is well-formed.

import { describe, expect, it } from 'vitest';
import { validate } from '../src/engine/validate';
import { WORLD } from '../src/content/world/act1';

describe('validate — Act I room 1', () => {
  it('produces zero errors', () => {
    expect(validate(WORLD).filter((f) => f.severity === 'error')).toEqual([]);
  });

  // §2.5 `listedAs` task: `checkRoomDescriptionMentionsPortable` (a
  // deliberate warning, not an error — see that rule's own doc comment in
  // `validate.ts`) flags exactly one genuine false positive here:
  // `your_room`'s dark-variant description calls the window "a grey
  // rectangle", and "grey" also happens to be `FEDORA`'s own authored
  // adjective. The sentence is about the window, not the hat — a real,
  // accepted false positive, not a bug in the rule or a regression in this
  // room's content. Asserted explicitly (rather than folded into a blanket
  // "zero warnings" check) so a *different*, unreviewed warning showing up
  // later still fails this test.
  it('produces exactly the one expected warning: "grey" (the window) collides with FEDORA\'s own adjective', () => {
    const warnings = validate(WORLD).filter((f) => f.severity === 'warning');
    expect(warnings.length).toBe(1);
    expect(warnings[0]!.code).toBe('room-description-mentions-portable');
    expect(warnings[0]!.message).toContain('"grey"');
    expect(warnings[0]!.message).toContain('act1_fedora');
  });
});

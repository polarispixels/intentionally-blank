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
  // room's content.
  it('produces the "grey"/FEDORA room-description warning', () => {
    const warnings = validate(WORLD).filter((f) => f.severity === 'warning');
    const greyWarning = warnings.find((f) => f.code === 'room-description-mentions-portable');
    expect(greyWarning).not.toBeUndefined();
    expect(greyWarning!.message).toContain('"grey"');
    expect(greyWarning!.message).toContain('act1_fedora');
  });

  // Front Desk & Lobby task: the description-mentions-portable rule's own
  // warning above is joined by four `verb-noun-collision` warnings, all
  // genuine, all deliberate (see `frontDesk.ts` and `marlow.ts` for the
  // content that produces each): the doc's own vocabulary reuses a handful
  // of words across a verb and a noun — "key" (V_TYPE_TERMINAL's "press
  // key" vs. the key rack/room key's "key"), "outside" (V_LOOK_OUTSIDE and
  // the OUT direction verb vs. the street door's "outside"), and "tear"
  // (the global CUT verb's own word vs. the register's torn page).
  //
  // Main Street task adds two more, both genuine, both deliberate: "sign"
  // (V_SIGN, front desk's own "sign register" verb, vs. `billboard`'s and
  // `boarding_house`'s own noun "sign" — main-street-prose §4.2/§4.7's own
  // noun lists) and "north" (the compass verb's own word vs.
  // `horizon_glow`'s own noun "north"/"north sky" — §4.3's own noun list).
  //
  // Every one is content ambiguity a sentence's position resolves in
  // practice, which is exactly what this warning class exists to flag and
  // let stand — asserted exactly, so a genuinely new, unreviewed warning
  // still fails this test.
  it('produces exactly the seven expected warnings, no others', () => {
    const warnings = validate(WORLD).filter((f) => f.severity === 'warning');
    const collisions = warnings.filter((f) => f.code === 'verb-noun-collision');
    expect(warnings.length).toBe(7);
    expect(collisions.length).toBe(6);
    expect(collisions.map((f) => f.message).sort()).toEqual(
      [
        'verb "act1_type_terminal"\'s word "key" is also an object/NPC noun or adjective — usually fine (sentence position disambiguates), but worth a second look',
        'verb "act1_look_outside"\'s word "outside" is also an object/NPC noun or adjective — usually fine (sentence position disambiguates), but worth a second look',
        'verb "cut"\'s word "tear" is also an object/NPC noun or adjective — usually fine (sentence position disambiguates), but worth a second look',
        'verb "out"\'s word "outside" is also an object/NPC noun or adjective — usually fine (sentence position disambiguates), but worth a second look',
        'verb "act1_sign"\'s word "sign" is also an object/NPC noun or adjective — usually fine (sentence position disambiguates), but worth a second look',
        'verb "n"\'s word "north" is also an object/NPC noun or adjective — usually fine (sentence position disambiguates), but worth a second look',
      ].sort(),
    );
  });
});

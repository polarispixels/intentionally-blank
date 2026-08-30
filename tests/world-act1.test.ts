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
  it('produces exactly the six expected verb-noun-collision warnings, no others', () => {
    const warnings = validate(WORLD).filter((f) => f.severity === 'warning');
    const collisions = warnings.filter((f) => f.code === 'verb-noun-collision');
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

  // Noun-collision-loop task: `checkObjectNounCollisions` (`validate.ts`,
  // added after Ryan's "which do you mean, the rack or the key?" loop)
  // adds four more warnings, reviewed here rather than fixed — each is two
  // genuinely different things in the same scene sharing one bare word,
  // with other single-word nouns available to tell them apart (unlike the
  // key-rack/room-key bug this rule exists to catch, where no word did):
  //   - "sign": `billboard` vs. `boarding_house` (Main Street) — the
  //     billboard's sign and the boarding house's own painted glass sign.
  //   - "light": `horizon_glow` vs. `maintenance_man` (Main Street) — the
  //     glow on the horizon and the streetlamp he's fixing.
  //   - "building": `boarding_house` vs. `brick_row` (Main Street) — the
  //     boarding house and the row of shops.
  //   - "paper": `page_78` vs. `papers` (Your Room) — the single loose
  //     page and the heap of loose papers on the floor; "page"/"papers"
  //     (plural) each resolve unambiguously.
  // Every one accepted, not a bug — asserted exactly, so a genuinely new,
  // unreviewed collision still fails this test.
  it('produces exactly the four expected object-noun-collision warnings, no others', () => {
    const warnings = validate(WORLD).filter((f) => f.severity === 'warning');
    const collisions = warnings.filter((f) => f.code === 'object-noun-collision');
    expect(collisions.length).toBe(4);
    expect(collisions.map((f) => f.message).sort()).toEqual(
      [
        '"act1_billboard" and "act1_boarding_house" can be in scope together and both answer to bare noun "sign" — a plain "sign" alone can never tell them apart (only a full adjective+noun phrase can); verify this is deliberate disambiguation, not an accidental shared word',
        '"act1_horizon_glow" and "act1_maintenance_man" can be in scope together and both answer to bare noun "light" — a plain "light" alone can never tell them apart (only a full adjective+noun phrase can); verify this is deliberate disambiguation, not an accidental shared word',
        '"act1_boarding_house" and "act1_brick_row" can be in scope together and both answer to bare noun "building" — a plain "building" alone can never tell them apart (only a full adjective+noun phrase can); verify this is deliberate disambiguation, not an accidental shared word',
        '"act1_page_78" and "act1_papers" can be in scope together and both answer to bare noun "paper" — a plain "paper" alone can never tell them apart (only a full adjective+noun phrase can); verify this is deliberate disambiguation, not an accidental shared word',
      ].sort(),
    );
  });

  it('produces exactly eleven warnings total, no others', () => {
    const warnings = validate(WORLD).filter((f) => f.severity === 'warning');
    expect(warnings.length).toBe(11);
  });
});

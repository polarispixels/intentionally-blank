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
  // Wave-2 task (Post Office / General Store / Sheriff's Office, plus
  // Whitlock) adds eleven more, every one genuine and reviewed: the new
  // rooms' own doc-mandated nouns ("handle" — the shop door; "stand" — the
  // postcard rack and the water crock; "post"/"mail" — `V_POST_LETTER`'s own
  // bare words vs. `post_office_front`'s adjective and `mail_drop`'s noun;
  // "map"/"scale" — `V_MEASURE`'s own bare words vs. `county_map`'s nouns,
  // and "scale" a second time against the pre-existing CLIMB verb's own
  // word; "drop"/"lock" — the built-in DROP/LOCK verbs vs. `mail_drop`'s and
  // `store_door`'s own nouns; "tap"/"drink" — this task's own added V_KNOCK
  // word and V_DRINK's own word vs. `water_crock`'s nouns). Every one is
  // content ambiguity a sentence's position resolves in practice, which is
  // exactly what this warning class exists to flag and let stand — asserted
  // exactly, so a genuinely new, unreviewed warning still fails this test.
  it('produces exactly the 10 expected verb-noun-collision warnings, no others', () => {
    const warnings = validate(WORLD).filter((f) => f.severity === 'warning');
    const collisions = warnings.filter((f) => f.code === 'verb-noun-collision');
    expect(collisions.length).toBe(10);
    expect(collisions.map((f) => f.message).sort()).toEqual(
      [
        "verb \"act1_look_outside\" can be typed bare and its word \"outside\" is also an object/NPC noun \u2014 the single word is ambiguous between a command and a thing",
        "verb \"act1_measure\" can be typed bare and its word \"map\" is also an object/NPC noun \u2014 the single word is ambiguous between a command and a thing",
        "verb \"act1_measure\" can be typed bare and its word \"scale\" is also an object/NPC noun \u2014 the single word is ambiguous between a command and a thing",
        "verb \"act1_post_letter\" can be typed bare and its word \"mail\" is also an object/NPC noun \u2014 the single word is ambiguous between a command and a thing",
        "verb \"act1_post_letter\" can be typed bare and its word \"post\" is also an object/NPC noun \u2014 the single word is ambiguous between a command and a thing",
        "verb \"act1_sign\" can be typed bare and its word \"sign\" is also an object/NPC noun \u2014 the single word is ambiguous between a command and a thing",
        "verb \"act1_type_terminal\" can be typed bare and its word \"key\" is also an object/NPC noun \u2014 the single word is ambiguous between a command and a thing",
        "verb \"n\" can be typed bare and its word \"north\" is also an object/NPC noun \u2014 the single word is ambiguous between a command and a thing",
        "verb \"out\" can be typed bare and its word \"outside\" is also an object/NPC noun \u2014 the single word is ambiguous between a command and a thing",
        "verb \"stand\" can be typed bare and its word \"stand\" is also an object/NPC noun \u2014 the single word is ambiguous between a command and a thing",
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
  // Wave-2 task adds eleven more object-noun collisions, every one
  // reviewed and genuine — each pair shares a word both objects' own
  // transcribed noun lists (hard rule 5) actually declare:
  //   - "office": `post_office_front` vs. `sheriff_office_front` (Main
  //     Street's own new street-facing scenery) — disambiguated by
  //     adjectives "post" vs. "sheriff"/"sheriff's".
  //   - "card": `po_boxes` (name cards) vs. `service_counter` (the hours
  //     card); `postcard_rack` vs. `store_door` (its own hand-lettered
  //     card).
  //   - "slot": `mail_drop` vs. `po_boxes` (a box's own name-card slot).
  //   - "window": `lobby_bench` (the front window it sits against) vs.
  //     `service_counter` (the service window).
  //   - "stand": `postcard_rack` (the spinner stand) vs. `water_crock` (the
  //     crock's own wooden stand).
  //   - "glass": `store_door` vs. `store_window`.
  //   - "sign": `store_door` (the CLOSED card) vs. `water_crock` (the FREE
  //     ICE WATER board, also called "sign" in its own noun list).
  //   - "pen": the pre-existing, portable `act1_pen` (Your Room) vs. both
  //     `mail_drop` and `whitlock_desk` — the portable-object half of this
  //     rule (§ this rule's own SCOPE note: a takeable object is checked
  //     against every room), not something this task's own rooms could
  //     avoid without touching Your Room's content, out of this task's
  //     module.
  //   - "string": the new portable `string` item vs. `twine`, its own
  //     source — deliberate: taking the twine is meant to leave a "string"
  //     that still answers to the same word the spool does.
  // Every one accepted, not a bug — asserted exactly, so a genuinely new,
  // unreviewed collision still fails this test.
  it('produces exactly the 2 expected object-noun-collision warnings, no others', () => {
    const warnings = validate(WORLD).filter((f) => f.severity === 'warning');
    const collisions = warnings.filter((f) => f.code === 'object-noun-collision');
    expect(collisions.length).toBe(2);
    expect(collisions.map((f) => f.message).sort()).toEqual(
      [
        "\"act1_mail_drop\" and \"act1_pen\" can be in scope together and both answer to bare noun \"pen\" \u2014 a plain \"pen\" alone can never tell them apart (only a full adjective+noun phrase can); verify this is deliberate disambiguation, not an accidental shared word",
        "\"act1_pen\" and \"act1_whitlock_desk\" can be in scope together and both answer to bare noun \"pen\" \u2014 a plain \"pen\" alone can never tell them apart (only a full adjective+noun phrase can); verify this is deliberate disambiguation, not an accidental shared word",
      ].sort(),
    );
  });

  it('produces exactly thirteen warnings total, no others', () => {
    const warnings = validate(WORLD).filter((f) => f.severity === 'warning');
    expect(warnings.length).toBe(13);
  });
});

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
  // Town Edge task (wave 3) adds three more, all genuine, all deliberate
  // (see `objects/townEdge.ts` for the content that produces each): "east"/
  // "west" (the compass verbs' own words vs. `open_country`'s own doc-given
  // noun list, which names the compass directions as terrain words \u2014 \u00a713.6)
  // and "back" (the `in`/`enter` direction verb's own word vs. the
  // billboard's own "back" sub-part, added so "examine back" resolves at
  // all \u2014 `ids.ts`'s own comment on `BILLBOARD_BACK`).
  //
  // Sundown Diner and County Library (also wave 3, landed concurrently)
  // account for most of the rest: "myself" (V_WHOAMI’s own word vs.
  // `act1_self`’s reflexive nouns), "face" (`V_LOOK_FOR_FACE` vs. the
  // diner’s own photo wall), "street"/"window" (`V_LOOK_OUT` vs. the
  // diner’s own street-facing scenery), and "card"/"drawer"/"subject"
  // (the library’s own `V_LOOK_UP_SUBJECT` vs. its card-catalogue nouns).
  //
  // RECONCILED (wave-3 Main Street amendments task, once all three
  // concurrent wave-3 rooms had actually landed, per this note’s own
  // standing instruction below): the three "my" entries a pre-landing
  // estimate once expected here (`act1_find_my_name`/`act1_sign`/
  // `act1_whoami`, each against a bare noun "my") never materialize — no
  // object or NPC in the landed content declares a bare "my" noun
  // (`act1_self`’s own reflexive list is "me"/"myself"/"self"/"body", not
  // "my") — so the final count is 20, not 23. This task’s own Main Street
  // changes (deleting `MAIN_STREET_BOUNDARY_GATE`; adding
  // `county_library_front`’s nouns and "sundown" to `diner`’s; adding
  // "go toward"/"go towards" to `V_APPROACH`, whose pattern is `V dobj`
  // only and so never contributes here) add zero new collisions of this
  // kind.
  it('produces exactly the 20 expected verb-noun-collision warnings, no others', () => {
    const warnings = validate(WORLD).filter((f) => f.severity === 'warning');
    const collisions = warnings.filter((f) => f.code === 'verb-noun-collision');
    expect(collisions.length).toBe(20);
    expect(collisions.map((f) => f.message).sort()).toEqual(
      [
        "verb \"act1_look_for_face\" can be typed bare and its word \"face\" is also an object/NPC noun — the single word is ambiguous between a command and a thing",
        "verb \"act1_look_out\" can be typed bare and its word \"street\" is also an object/NPC noun — the single word is ambiguous between a command and a thing",
        "verb \"act1_look_out\" can be typed bare and its word \"window\" is also an object/NPC noun — the single word is ambiguous between a command and a thing",
        "verb \"act1_look_outside\" can be typed bare and its word \"outside\" is also an object/NPC noun — the single word is ambiguous between a command and a thing",
        "verb \"act1_look_up_subject\" can be typed bare and its word \"card\" is also an object/NPC noun — the single word is ambiguous between a command and a thing",
        "verb \"act1_look_up_subject\" can be typed bare and its word \"drawer\" is also an object/NPC noun — the single word is ambiguous between a command and a thing",
        "verb \"act1_look_up_subject\" can be typed bare and its word \"subject\" is also an object/NPC noun — the single word is ambiguous between a command and a thing",
        "verb \"act1_measure\" can be typed bare and its word \"map\" is also an object/NPC noun — the single word is ambiguous between a command and a thing",
        "verb \"act1_measure\" can be typed bare and its word \"scale\" is also an object/NPC noun — the single word is ambiguous between a command and a thing",
        "verb \"act1_post_letter\" can be typed bare and its word \"mail\" is also an object/NPC noun — the single word is ambiguous between a command and a thing",
        "verb \"act1_post_letter\" can be typed bare and its word \"post\" is also an object/NPC noun — the single word is ambiguous between a command and a thing",
        "verb \"act1_sign\" can be typed bare and its word \"sign\" is also an object/NPC noun — the single word is ambiguous between a command and a thing",
        "verb \"act1_type_terminal\" can be typed bare and its word \"key\" is also an object/NPC noun — the single word is ambiguous between a command and a thing",
        "verb \"act1_whoami\" can be typed bare and its word \"myself\" is also an object/NPC noun — the single word is ambiguous between a command and a thing",
        "verb \"e\" can be typed bare and its word \"east\" is also an object/NPC noun — the single word is ambiguous between a command and a thing",
        "verb \"in\" can be typed bare and its word \"back\" is also an object/NPC noun — the single word is ambiguous between a command and a thing",
        "verb \"n\" can be typed bare and its word \"north\" is also an object/NPC noun — the single word is ambiguous between a command and a thing",
        "verb \"out\" can be typed bare and its word \"outside\" is also an object/NPC noun — the single word is ambiguous between a command and a thing",
        "verb \"stand\" can be typed bare and its word \"stand\" is also an object/NPC noun — the single word is ambiguous between a command and a thing",
        "verb \"w\" can be typed bare and its word \"west\" is also an object/NPC noun — the single word is ambiguous between a command and a thing",
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
  // Town Edge task (wave 3) adds one more: `paddock` lists "pen" among its
  // own synonyms (a paddock is also called a pen \u2014 \u00a713.4's own noun list),
  // which collides with the pre-existing portable `act1_pen` the same way
  // `mail_drop`/`whitlock_desk` already do (the portable-object half of
  // this rule) \u2014 genuine, reviewed, not fixed for the same reason those two
  // weren't (touching Your Room's `act1_pen` is out of this task's module).
  //
  // County Library (also wave 3) adds one more: "pen" a second time,
  // against its own `act1_sign_in_book`.
  it('produces exactly the 4 expected object-noun-collision warnings, no others', () => {
    const warnings = validate(WORLD).filter((f) => f.severity === 'warning');
    const collisions = warnings.filter((f) => f.code === 'object-noun-collision');
    expect(collisions.length).toBe(4);
    expect(collisions.map((f) => f.message).sort()).toEqual(
      [
        "\"act1_mail_drop\" and \"act1_pen\" can be in scope together and both answer to bare noun \"pen\" \u2014 a plain \"pen\" alone can never tell them apart (only a full adjective+noun phrase can); verify this is deliberate disambiguation, not an accidental shared word",
        "\"act1_paddock\" and \"act1_pen\" can be in scope together and both answer to bare noun \"pen\" \u2014 a plain \"pen\" alone can never tell them apart (only a full adjective+noun phrase can); verify this is deliberate disambiguation, not an accidental shared word",
        "\"act1_pen\" and \"act1_sign_in_book\" can be in scope together and both answer to bare noun \"pen\" \u2014 a plain \"pen\" alone can never tell them apart (only a full adjective+noun phrase can); verify this is deliberate disambiguation, not an accidental shared word",
        "\"act1_pen\" and \"act1_whitlock_desk\" can be in scope together and both answer to bare noun \"pen\" \u2014 a plain \"pen\" alone can never tell them apart (only a full adjective+noun phrase can); verify this is deliberate disambiguation, not an accidental shared word",
      ].sort(),
    );
  });

  // RECONCILED (wave-3 Main Street amendments task): 1 (grey/FEDORA) + 20
  // (verb-noun) + 4 (object-noun) = 25, down from the pre-landing
  // estimate of 28 — see the verb-noun test above for why (three "my"
  // collisions that never materialized).
  it('produces exactly twenty-five warnings total, no others', () => {
    const warnings = validate(WORLD).filter((f) => f.severity === 'warning');
    expect(warnings.length).toBe(25);
  });
});

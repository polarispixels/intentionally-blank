// Stage E, E-5 (2026-09-16 Stage E plan §3.5) — "three logins, three ids".
// The opening terminal's login (`act5_opening_login`, E3), the Hub's login
// (shipped, `ACT3_HUB_LOGIN_PROMPT_ID`), and the antechamber's login
// (`act5_ante_login`, E3) share the same credentials and NOTHING else: not
// the prompt id, not the success text, not the flag. A shared prompt id
// would be the real bug — the CLI's `pendingPrompt` and the controller's
// `ui.prompt` route a prompt id to exactly one respond script via
// `game.ts`'s `PROMPT_SCRIPTS`, so if the opening terminal's LOG IN ever
// reused the Hub's own prompt id, it would answer with the Hub's own
// `ACCESS LEVEL: MAINTENANCE` script instead of its own.
//
// `PROMPT_SCRIPTS` is a plain object spread across each slice's own
// prompt-script table (`{ ...ACT2_CENSOR_PROMPT_SCRIPTS,
// ...ACT3_HUB_PROMPT_SCRIPTS }`) — unlike `assemble`'s `mergeTable` (which
// throws on a repeated id in any of `rooms`/`objects`/etc.), a plain spread
// silently lets a later table's key win over an earlier one's. This file is
// the guard that gap doesn't otherwise have.

import { describe, expect, it } from 'vitest';
import { PROMPT_SCRIPTS } from '../src/content/world/game';
import { ACT2_CENSOR_PROMPT_SCRIPTS } from '../src/content/world/act2/index';
import { ACT3_HUB_PROMPT_SCRIPTS } from '../src/content/world/act3/index';
import { ACT3_HUB_LOGIN_PROMPT_ID } from '../src/content/world/act3/ids';

/**
 * Every slice's own prompt→script table, in the same order `game.ts`
 * spreads them. E0–E3 add `ACT4_PROMPT_SCRIPTS`/`ACT5_PROMPT_SCRIPTS` to
 * both this array and `game.ts`'s own spread in the same change (`game.ts`'s
 * own header comment on `PROMPT_SCRIPTS` says so) — until then this list is
 * exactly `game.ts`'s.
 */
const PROMPT_SCRIPT_TABLES: Record<string, unknown>[] = [ACT2_CENSOR_PROMPT_SCRIPTS, ACT3_HUB_PROMPT_SCRIPTS];

/**
 * THE_THREE_LOGINS — plan §3.5's own naming. Only the Hub's login exists
 * yet (`ACT3_HUB_LOGIN_PROMPT_ID`, shipped v0.12.0); the opening terminal's
 * and the antechamber's are E3 content (`act5_opening_login`/
 * `act5_ante_login` in the plan's own prose — each becomes a real prompt id
 * in `act5/ids.ts` when E3 wires it). **E3's builder pushes both new prompt
 * ids onto this array in the same change that declares them** — this is the
 * one list "the three logins are still distinct" gets asserted against, not
 * a fresh one, so a shared id is caught here even if nothing else in the
 * suite happens to render both stations against the same fixture.
 */
const THE_THREE_LOGINS: string[] = [ACT3_HUB_LOGIN_PROMPT_ID];

describe('prompt ids — no id registered twice (Stage E, E-5)', () => {
  it('no prompt id is contributed by more than one slice', () => {
    const seen = new Map<string, number>();
    for (const table of PROMPT_SCRIPT_TABLES) {
      for (const id of Object.keys(table)) {
        seen.set(id, (seen.get(id) ?? 0) + 1);
      }
    }
    const duplicates = [...seen.entries()].filter(([, count]) => count > 1).map(([id]) => id);
    expect(duplicates).toEqual([]);
    // A silent overwrite would still leave `PROMPT_SCRIPTS` fully populated
    // (just wrong) — the id count above is the real check; this is a second,
    // independent way to notice one went missing.
    expect(Object.keys(PROMPT_SCRIPTS).length).toBe(seen.size);
  });

  it('the three logins share credentials and nothing else — distinct prompt ids', () => {
    expect(new Set(THE_THREE_LOGINS).size).toBe(THE_THREE_LOGINS.length);
  });
});

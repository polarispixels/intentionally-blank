// D2-B — The censor (Stage D plan §4.5; canon 8 rule 1). Pure, no engine or
// DOM imports (rule 3 is automatic here, but the plan itself also asks for
// this specifically: "act2/censor.ts, pure").
//
// The rule is never stated to the player anywhere (plan §4.5's own words).
// It is taught by consequence: a natural letter naming a flagged word comes
// back fast and hollow (`act2_reply_rewritten`); an honest ask without a
// flagged word comes back slow and real (`act2_reply_audit`); anything else
// gets the polite nothing (`act2_reply_blank`). `folded` never changes the
// verdict — it only ever decides whether the origami ruler rides along with
// whatever came back (`act2/objects/censor.ts`'s own `act2_post_letter`).
//
// Word lists transcribed verbatim from the plan's §4.5 (hard rule 5 applies
// to game text generally; these are mechanical thresholds, not prose, but
// the exact tokens are load-bearing so they are copied exactly).

/** Any of these anywhere in the message forces the rewritten, hollow reply. */
export const CENSOR_FLAGGED: readonly string[] = [
  'jules',
  'sublevel',
  's6',
  'notebook',
  'deprecated',
  'missing',
  'erased',
  'custodian',
  'brother',
];

/** Absent any flagged token, any of these earns the real, four-day answer. */
export const CENSOR_ASK: readonly string[] = [
  'audit',
  'load',
  'power',
  'filings',
  'draw',
  'numbers',
  'interconnection',
  'grid',
  'megawatt',
  'reactor',
];

/**
 * Stage E's family vocabulary (P22, Luke's message) — declared here now so
 * the two puzzles share one word-list module, per the plan's own
 * instruction. Unused by `censorVerdict` today; nothing in D2 reads this.
 */
export const CENSOR_FAMILY: readonly string[] = [
  'i',
  'ii',
  'iii',
  'iv',
  'v',
  'noumena',
  'house rules',
  'the bank',
  'kiddo',
  'youngest goes last',
];

export type CensorVerdict = 'rewritten' | 'blank' | 'answered';

/** Lower-cased, tokenised on anything that isn't a letter/digit/apostrophe. */
function tokenize(message: string): string[] {
  return message.toLowerCase().match(/[a-z0-9']+/g) ?? [];
}

/**
 * The deterministic, player-learnable rule the architecture requires
 * (plan Appendix item 7). `folded` is accepted for the caller's
 * convenience (the post script always has both values in hand at once) but
 * never inspected — see this file's header.
 */
export function censorVerdict(message: string, folded: boolean): CensorVerdict {
  void folded;
  const tokens = tokenize(message);
  if (tokens.some((t) => CENSOR_FLAGGED.includes(t))) return 'rewritten';
  if (tokens.some((t) => CENSOR_ASK.includes(t))) return 'answered';
  return 'blank';
}

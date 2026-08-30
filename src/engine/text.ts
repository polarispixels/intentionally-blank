import { SAY_SPECIAL } from '../content';

/** Deterministic variant selection. */
export function pick(variants: readonly string[], n: number): string {
  const v = variants[((n % variants.length) + variants.length) % variants.length];
  if (v === undefined) throw new Error('pick: empty variants');
  return v;
}

/** Replace `{name}` placeholders. */
export function fill(template: string, vars: Readonly<Record<string, string>>): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? `{${k}}`);
}

/** The computer repeats what you said, tidied. */
export function formatSay(text: string): string {
  const special = SAY_SPECIAL[text.toLowerCase()];
  if (special) return special;
  const t = text.trim();
  if (t === '') return '\u2026';
  const cap = t.charAt(0).toUpperCase() + t.slice(1);
  return /[.!?\u2026]$/.test(cap) ? cap : `${cap}.`;
}

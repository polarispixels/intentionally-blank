/**
 * Source scanning for the purity tests.
 *
 * The first version of `purity.test.ts` stripped string literals with a single
 * regex. A regex literal containing a quote character — `/['"]/` in
 * `parser.ts`, for instance — made that stripper treat the quote as the start
 * of a string and swallow everything up to the next matching quote, blinding
 * the check to whatever lived in between. This is a real scanner instead:
 * a small state machine that understands comments, all three string forms,
 * template interpolation, and regex literals.
 */

/** Keywords after which a `/` begins a regex literal rather than a division. */
const REGEX_KEYWORDS = new Set([
  'return', 'typeof', 'instanceof', 'in', 'of', 'new', 'delete', 'void',
  'throw', 'do', 'else', 'case', 'yield', 'await',
]);

type State = 'code' | 'line' | 'block' | 'sq' | 'dq' | 'tmpl' | 'regex' | 'class';

/**
 * Returns `source` with comments, string bodies, template bodies, and regex
 * bodies replaced by whitespace. Code inside `${...}` interpolations is kept,
 * because it is code. Removed spans become a space so that stripping can never
 * fuse two identifiers into a third.
 */
export function stripNonCode(source: string): string {
  const out: string[] = [];
  /** Brace depth for each open `${` interpolation; empty means not in one. */
  const interpolation: number[] = [];
  let state: State = 'code';
  let lastSignificant = '';
  let word = '';
  let i = 0;

  const emit = (ch: string): void => {
    out.push(ch);
    if (ch.trim() !== '') {
      lastSignificant = ch;
      word = /[A-Za-z0-9_$]/.test(ch) ? word + ch : '';
    }
  };

  /** Close a value-producing span: a following `/` is division, not a regex. */
  const endValue = (): void => {
    out.push(' ');
    lastSignificant = 'x';
    word = '';
  };

  const regexCanStart = (): boolean => {
    if (lastSignificant === '') return true;
    if (/[A-Za-z0-9_$)\]]/.test(lastSignificant)) return REGEX_KEYWORDS.has(word);
    return true;
  };

  while (i < source.length) {
    const ch = source[i] ?? '';
    const next = source[i + 1] ?? '';

    switch (state) {
      case 'code':
        if (ch === '/' && next === '/') { state = 'line'; i += 2; continue; }
        if (ch === '/' && next === '*') { state = 'block'; i += 2; continue; }
        if (ch === '/' && regexCanStart()) { state = 'regex'; i += 1; continue; }
        if (ch === "'") { state = 'sq'; i += 1; continue; }
        if (ch === '"') { state = 'dq'; i += 1; continue; }
        if (ch === '`') { state = 'tmpl'; i += 1; continue; }
        if (interpolation.length > 0) {
          const top = interpolation.length - 1;
          const depth = interpolation[top] ?? 0;
          if (ch === '{') {
            interpolation[top] = depth + 1;
          } else if (ch === '}') {
            if (depth === 0) {
              interpolation.pop();
              state = 'tmpl';
              i += 1;
              out.push(' ');
              continue;
            }
            interpolation[top] = depth - 1;
          }
        }
        emit(ch);
        i += 1;
        continue;

      case 'line':
        if (ch === '\n') { state = 'code'; emit('\n'); }
        i += 1;
        continue;

      case 'block':
        if (ch === '*' && next === '/') { state = 'code'; i += 2; out.push(' '); continue; }
        i += 1;
        continue;

      case 'sq':
      case 'dq': {
        const quote = state === 'sq' ? "'" : '"';
        if (ch === '\\') { i += 2; continue; }
        if (ch === quote) { state = 'code'; i += 1; endValue(); continue; }
        // An unterminated literal cannot cross a line; bail rather than eat the file.
        if (ch === '\n') { state = 'code'; emit('\n'); i += 1; continue; }
        i += 1;
        continue;
      }

      case 'tmpl':
        if (ch === '\\') { i += 2; continue; }
        if (ch === '`') { state = 'code'; i += 1; endValue(); continue; }
        if (ch === '$' && next === '{') {
          interpolation.push(0);
          state = 'code';
          i += 2;
          out.push(' ');
          continue;
        }
        i += 1;
        continue;

      case 'regex':
        if (ch === '\\') { i += 2; continue; }
        if (ch === '[') { state = 'class'; i += 1; continue; }
        if (ch === '/') { state = 'code'; i += 1; endValue(); continue; }
        if (ch === '\n') { state = 'code'; emit('\n'); i += 1; continue; }
        i += 1;
        continue;

      case 'class':
        if (ch === '\\') { i += 2; continue; }
        if (ch === ']') { state = 'regex'; i += 1; continue; }
        i += 1;
        continue;
    }
  }

  return out.join('');
}

/** Every module specifier the file imports, requires, or dynamically imports. */
export function importedModules(source: string): string[] {
  const found: string[] = [];
  const patterns: readonly RegExp[] = [
    /\bfrom\s*['"]([^'"]+)['"]/g,
    /\bimport\s*['"]([^'"]+)['"]/g,
    /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    /\brequire\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
  ];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      const specifier = match[1];
      if (specifier !== undefined) found.push(specifier);
    }
  }
  return found;
}

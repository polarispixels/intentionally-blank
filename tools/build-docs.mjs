// Renders the repo's markdown into one static docs page at dist/docs/index.html.
// Markdown is the only source of truth (ADR 0006). Run: node tools/build-docs.mjs
import { readFileSync, readdirSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, basename, dirname, resolve } from 'node:path';
import { marked } from 'marked';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
const OUT_DIR = join(ROOT, 'dist', 'docs');
const REPO = 'https://github.com/polarispixels/intentionally-blank';
const PLAY = '../';

const version = /GAME_VERSION\s*=\s*'([^']+)'/.exec(readFileSync(join(ROOT, 'src/version.ts'), 'utf8'))?.[1] ?? '?';

function sorted(dir, filter = () => true) {
  if (!existsSync(join(ROOT, dir))) return [];
  return readdirSync(join(ROOT, dir)).filter((f) => f.endsWith('.md') && filter(f)).sort().map((f) => join(dir, f));
}

// Order matters: this is the reading order on the page.
const FILES = [
  'README.md',
  'docs/DEVELOPMENT.md',
  ...sorted('docs/decisions', (f) => f === 'README.md'),
  ...sorted('docs/decisions', (f) => f !== 'README.md'),
  ...sorted('docs/spec', (f) => f === 'README.md'),
  ...sorted('docs/spec', (f) => f !== 'README.md'),
  'BACKLOG.md',
  'CHANGELOG.md',
  ...sorted('docs/superpowers/specs'),
  ...(existsSync(join(ROOT, 'docs/ARCHITECTURE.md')) ? ['docs/ARCHITECTURE.md'] : []),
].filter((f) => existsSync(join(ROOT, f)));

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const fileId = (f) => 'f-' + slug(f.replace(/\.md$/, ''));
const escape = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/** Title = first H1, else the filename. Body = everything after it, headings demoted one level. */
function section(file) {
  const src = readFileSync(join(ROOT, file), 'utf8');
  const m = /^# (.+)$/m.exec(src);
  const title = m ? m[1].trim() : basename(file, '.md');
  let body = m ? src.replace(m[0], '') : src;
  body = body.replace(/^(#{1,5}) /gm, (_, h) => '#'.repeat(h.length + 1) + ' ');
  return { file, title, body };
}

const sections = FILES.map(section);
const known = new Map(sections.map((s) => [s.file, fileId(s.file)]));

/** Rewrite relative markdown links: rendered file -> in-page anchor, else -> GitHub. */
function rewriteLinks(html, fromFile) {
  return html.replace(/href="([^"]+)"/g, (whole, href) => {
    if (/^(https?:|mailto:|#)/.test(href)) return whole;
    const [path, hash] = href.split('#');
    const target = path === '' ? fromFile : join(dirname(fromFile), path).replace(/\\/g, '/');
    const id = known.get(target);
    if (id) return `href="#${hash ? slug(hash) : id}"`;
    return `href="${REPO}/blob/main/${target}"`;
  });
}

marked.use({
  renderer: {
    heading({ text, depth }) {
      const id = slug(text);
      return `<h${depth} id="${id}">${text}</h${depth}>\n`;
    },
    table(token) {
      const header = token.header.map((c) => `<th>${this.parser.parseInline(c.tokens)}</th>`).join('');
      const rows = token.rows.map((r) => `<tr>${r.map((c) => `<td>${this.parser.parseInline(c.tokens)}</td>`).join('')}</tr>`).join('');
      return `<div class="tablewrap"><table><thead><tr>${header}</tr></thead><tbody>${rows}</tbody></table></div>\n`;
    },
  },
});

const toc = sections.map((s) => `<li><a href="#${fileId(s.file)}">${escape(s.title)}</a></li>`).join('\n');
const body = sections.map((s) => {
  const html = rewriteLinks(marked.parse(s.body), s.file);
  return `<section id="${fileId(s.file)}">
<h1>${escape(s.title)} <a class="src" href="${REPO}/blob/main/${s.file}" title="View source">${escape(s.file)}</a></h1>
${html}
</section>`;
}).join('\n');

const css = `
:root{--bg:#f7f5f0;--ink:#232323;--muted:#6b6b6b;--rule:#d9d4c7;--accent:#2f5d8a;--panel:#fff;--code:#efece4;color-scheme:light dark}
@media(prefers-color-scheme:dark){:root{--bg:#15171a;--ink:#e6e3dc;--muted:#9a9a94;--rule:#2e3237;--accent:#7fb0e0;--panel:#1d2024;--code:#22262b}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.65 -apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
header{padding:2.5rem 1.25rem 2rem;text-align:center;border-bottom:1px solid var(--rule)}
header h1{margin:0 0 .25rem;font-size:1.6rem;letter-spacing:.2em}header p{margin:.25rem auto;max-width:44rem;color:var(--muted)}
.badge{display:inline-block;border:1px solid var(--accent);color:var(--accent);border-radius:999px;padding:2px 12px;margin:8px 4px 0;font-size:.9rem;text-decoration:none}
.badge.play{background:var(--accent);color:var(--bg)}
main{max-width:62rem;margin:0 auto;padding:1.5rem 1.25rem 5rem}
nav.toc{background:var(--panel);border:1px solid var(--rule);border-radius:8px;padding:1rem 1.5rem;margin:1.5rem 0}
nav.toc ul{columns:2;margin:.5rem 0 0;padding-left:1.25rem}@media(max-width:640px){nav.toc ul{columns:1}}
section{margin-top:3.5rem}section>h1{font-size:1.5rem;border-bottom:2px solid var(--accent);padding-bottom:.3rem}
section>h1 .src{font-size:.75rem;font-weight:400;color:var(--muted);margin-left:.75rem;text-decoration:none}
h2{margin-top:2rem;font-size:1.25rem}h3{margin-top:1.5rem;font-size:1.05rem}
a{color:var(--accent)}code,pre{font-family:ui-monospace,"Cascadia Code",Menlo,Consolas,monospace;font-size:.92em;background:var(--code);border-radius:4px}
code{padding:1px 5px}pre{padding:.9rem 1rem;overflow-x:auto;line-height:1.5}pre code{padding:0;background:none}
.tablewrap{overflow-x:auto}table{border-collapse:collapse;width:100%;margin:.9rem 0;font-size:.95rem}
th,td{border:1px solid var(--rule);padding:.45rem .6rem;text-align:left;vertical-align:top}th{background:var(--panel)}
blockquote{border-left:4px solid var(--rule);margin:1rem 0;padding:.25rem 1rem;color:var(--muted)}
footer{text-align:center;color:var(--muted);padding:2rem 1rem 3rem;font-size:.9rem;border-top:1px solid var(--rule)}
`;

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Intentionally Blank &mdash; Documentation</title>
<meta name="description" content="Design canon, architecture decisions, development process, backlog, and changelog for Intentionally Blank.">
<style>${css}</style>
</head>
<body>
<header>
  <h1>INTENTIONALLY BLANK</h1>
  <p>Documentation &mdash; design canon, decisions, process, backlog, changelog. Generated from the repository's markdown.</p>
  <span class="badge">v${escape(version)}</span>
  <a class="badge play" href="${PLAY}">&#9654; Play</a>
  <a class="badge" href="${REPO}">Source repo</a>
</header>
<main>
<nav class="toc"><strong>Contents</strong><ul>
${toc}
</ul></nav>
${body}
</main>
<footer>Intentionally Blank v${escape(version)} &middot; generated ${new Date().toISOString().slice(0, 10)} from ${sections.length} files</footer>
</body>
</html>
`;

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, 'index.html'), page);
console.log(`docs: wrote ${join('dist', 'docs', 'index.html')} (${sections.length} sections, v${version})`);

/**
 * Regenerates public/sitemap.xml from the HTML in the project root.
 *
 * Runs as part of `npm run build`, so lastmod can no longer drift away from the
 * files it describes. A page is included when it has a canonical tag and is not
 * noindexed; everything else (portal pages, the 404, the GSC verification file)
 * is skipped automatically.
 *
 * priority and changefreq are deliberately omitted — Google ignores both.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT = __dirname;
const OUT = path.join(ROOT, 'public', 'sitemap.xml');

/** Last commit date for a file, falling back to filesystem mtime. */
function lastModified(file) {
    try {
        const out = execSync(`git log -1 --format=%cs -- "${path.basename(file)}"`, {
            cwd: ROOT,
            stdio: ['ignore', 'pipe', 'ignore'],
        }).toString().trim();
        if (/^\d{4}-\d{2}-\d{2}$/.test(out)) {
            // Uncommitted edits are newer than the last commit.
            const mtime = fs.statSync(file).mtime.toISOString().slice(0, 10);
            return mtime > out ? mtime : out;
        }
    } catch (err) {
        // Not a git checkout, or the file has never been committed.
    }
    return fs.statSync(file).mtime.toISOString().slice(0, 10);
}

const entries = fs.readdirSync(ROOT)
    .filter((f) => f.endsWith('.html'))
    .map((f) => path.join(ROOT, f))
    .map((file) => {
        const html = fs.readFileSync(file, 'utf8');
        const head = html.slice(0, html.indexOf('</head>') + 1 || html.length);

        const robots = /<meta\s+name="robots"\s+content="([^"]*)"/i.exec(head);
        if (robots && /noindex/i.test(robots[1])) return null;

        const canonical = /<link\s+rel="canonical"\s+href="([^"]+)"/i.exec(head);
        if (!canonical) return null;

        return { loc: canonical[1], lastmod: lastModified(file) };
    })
    .filter(Boolean)
    .sort((a, b) => a.loc.length - b.loc.length || a.loc.localeCompare(b.loc));

const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map((e) => [
        '  <url>',
        `    <loc>${e.loc}</loc>`,
        `    <lastmod>${e.lastmod}</lastmod>`,
        '  </url>',
    ].join('\n')),
    '</urlset>',
    '',
].join('\n');

fs.writeFileSync(OUT, xml, 'utf8');
console.log(`sitemap: ${entries.length} URLs -> ${path.relative(ROOT, OUT)}`);

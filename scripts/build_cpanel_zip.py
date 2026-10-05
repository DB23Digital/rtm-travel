"""Package dist/ for cPanel upload.

Run `npm run build` first, then:

    python scripts/build_cpanel_zip.py

Forward-slash arcnames on purpose. Windows Compress-Archive and
ZipFile.CreateFromDirectory write backslash separators, which cPanel's unzip
treats as part of the filename rather than as directories, so the whole tree
lands flat in public_html. This is a real bug that bit the August deploy.
"""
import os
import sys
import zipfile
from datetime import date

SRC = 'dist'
OUT = 'rtmtravel-cpanel-%s.zip' % date.today().isoformat()

REQUIRED = [
    '.htaccess',
    'index.html',
    '404.html',
    'download.php',
    'contact.php',
    'downloads/.htaccess',
    'downloads/corporate-travel-policy-template.docx',
    'downloads/corporate-travel-policy-template.html',
    'assets/og-card.jpg',
    'assets/anthea-ronne.webp',
    'assets/Logo.webp',
    'sitemap.xml',
    'robots.txt',
    'corporate-flight-booking.html',
    'conference-event-travel.html',
    'business-accommodation.html',
    'travel-policy-approval-management.html',
    'in-house-vs-travel-management-company.html',
    'corporate-travel-management-johannesburg.html',
]

if not os.path.isdir(SRC):
    sys.exit('dist/ not found — run npm run build first')

count = total = 0
with zipfile.ZipFile(OUT, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    for root, dirs, files in os.walk(SRC):
        dirs.sort()
        for name in sorted(files):
            path = os.path.join(root, name)
            arc = os.path.relpath(path, SRC).replace(os.sep, '/')
            z.write(path, arc)
            count += 1
            total += os.path.getsize(path)

print('%s: %d files, %.1f MB raw, %.1f MB zipped'
      % (OUT, count, total / 1e6, os.path.getsize(OUT) / 1e6))

with zipfile.ZipFile(OUT) as z:
    names = z.namelist()
    flat = [n for n in names if chr(92) in n]
    assert not flat, 'backslash separator in: %s' % flat[:3]
    broken = z.testzip()
    assert broken is None, 'CRC failure in %s' % broken
    missing = [n for n in REQUIRED if n not in names]
    assert not missing, 'missing from archive: %s' % missing
    print('verified: forward-slash paths, CRC clean, all %d required entries present'
          % len(REQUIRED))
    print('hero-film frames included:',
          sum(1 for n in names if n.startswith('assets/hero-film/')))

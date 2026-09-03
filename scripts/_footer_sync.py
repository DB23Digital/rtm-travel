"""One-off: give every page the same footer as index.html (NAP block + services column)."""
import glob

OLD_CONTACT = '''                    <div class="flex flex-col gap-2 text-gray-400 text-sm mt-4">
                        <a href="tel:+27825746211" class="hover:text-white transition-colors">+27 82 574 6211</a>
                        <a href="mailto:anthea@rtmtravel.co.za" class="hover:text-white transition-colors">anthea@rtmtravel.co.za</a>
                        <a href="https://www.google.com/search?kgmid=/g/11zdrsq7tp&hl=en-ZA&q=RTM+Travel" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors">Cape Town, South Africa</a>
                    </div>'''

idx = open('index.html', encoding='utf-8').read()
NEW_CONTACT = idx[idx.index('                    <!-- Visible NAP block.'):idx.index('</div>', idx.index('Google</a>')) + len('</div>')]

SERVICES_COL = idx[idx.index('                <div>\n                    <h4 class="font-bold mb-4">Services</h4>'):idx.index('                    <h4 class="font-bold mb-4">Company</h4>')]

for f in glob.glob('*.html'):
    if f in ('index.html', 'google912e8d5282937ca7.html', 'seo-report-index.html', '404.html'):
        continue
    s = open(f, encoding='utf-8').read()
    orig = s
    if OLD_CONTACT in s:
        s = s.replace(OLD_CONTACT, NEW_CONTACT, 1)
    if 'font-bold mb-4">Services</h4>' not in s and 'font-bold mb-4">Company</h4>' in s:
        s = s.replace('                <div>\n                    <h4 class="font-bold mb-4">Company</h4>',
                      SERVICES_COL + '                    <h4 class="font-bold mb-4">Company</h4>', 1)
        s = s.replace('<div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">',
                      '<div class="grid grid-cols-1 md:grid-cols-5 gap-8 mb-10">', 1)
    if s != orig:
        open(f, 'w', encoding='utf-8', newline='').write(s)
        print('footer synced', f)

"""One-off: set html lang to en-ZA and point social cards at the new 1200x630 art."""
import re, glob, os

CARDS = {
    'index.html': 'og-card.jpg',
    'articles.html': 'og-card.jpg',
    'corporate-travel-management.html': 'og-card.jpg',
    'privacy-policy.html': 'og-card.jpg',
    'sars-online-traveller-declaration-business-travel.html': 'og-card-sars.jpg',
    'duty-of-care-business-travel.html': 'og-card-duty-of-care.jpg',
    'corporate-travel-policy-template.html': 'og-card-policy.jpg',
    'corporate-travel-budget-south-africa.html': 'og-card-budget.jpg',
}

for f in glob.glob('*.html') + glob.glob('public/downloads/*.html'):
    s = open(f, encoding='utf-8').read()
    orig = s
    s = s.replace('<html lang="en">', '<html lang="en-ZA">', 1)

    card = CARDS.get(os.path.basename(f)) if os.path.dirname(f) == '' else None
    if card:
        url = 'https://rtmtravel.co.za/assets/' + card
        s = re.sub(
            r'<meta property="og:image" content="[^"]*" />',
            ('<meta property="og:image" content="%s" />\n'
             '    <meta property="og:image:width" content="1200" />\n'
             '    <meta property="og:image:height" content="630" />\n'
             '    <meta property="og:locale" content="en_ZA" />') % url, s, count=1)
        s = re.sub(r'<meta name="twitter:image" content="[^"]*" />',
                   '<meta name="twitter:image" content="%s" />' % url, s, count=1)
        s = s.replace('<meta name="twitter:card" content="summary" />',
                      '<meta name="twitter:card" content="summary_large_image" />')
    if s != orig:
        with open(f, 'w', encoding='utf-8', newline='') as fh:
            fh.write(s)
        print('updated', f)

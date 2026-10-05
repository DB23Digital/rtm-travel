"""One-off: add the visible author block and reviewed date to every article.

E-E-A-T: the Person schema was already there, but nothing on the page showed a
reader that a named, accredited human wrote the advice.
"""
import re

REVIEWED = '2026-09-02'
REVIEWED_HUMAN = '2 September 2026'

PAGES = [
    'corporate-travel-management.html',
    'corporate-travel-policy-template.html',
    'duty-of-care-business-travel.html',
    'corporate-travel-budget-south-africa.html',
    'sars-online-traveller-declaration-business-travel.html',
]

AUTHOR_BLOCK = '''
                <!-- Author block. Mirrors the Person node in the Article schema above. -->
                <div class="mt-12 pt-8 border-t border-white/10">
                    <div class="bg-rtm-card border border-white/5 rounded-xl p-6 flex flex-col sm:flex-row gap-6 items-start">
                        <img loading="lazy" width="160" height="160" src="/assets/anthea-ronne.webp"
                            alt="Anthea Ronne, founder of Remmitz Travel Management"
                            class="w-20 h-20 rounded-full object-cover border-2 border-rtm-accent flex-shrink-0" />
                        <div>
                            <p class="text-xs text-rtm-accent uppercase tracking-widest mb-2">Written and reviewed by</p>
                            <h3 class="text-lg font-bold text-white mb-2">Anthea Ronne</h3>
                            <p class="text-sm text-gray-400 leading-relaxed mb-3">Anthea Ronne has run Remmitz Travel Management since 2008, handling corporate travel programmes for South African businesses from Cape Town. RTM Travel is ASATA and IATA accredited, BEE Level 1, and 100% female owned.</p>
                            <p class="text-sm text-gray-500">Last reviewed <time datetime="{reviewed}">{reviewed_human}</time>. <a href="https://www.linkedin.com/in/anthea-ronne-37aa1811/" target="_blank" rel="noopener noreferrer" class="text-rtm-accent hover:underline">Connect on LinkedIn</a></p>
                        </div>
                    </div>
                </div>
'''.format(reviewed=REVIEWED, reviewed_human=REVIEWED_HUMAN)

BYLINE_REVIEWED = (
    '\n                <span>&middot;</span>\n'
    '                <span>Last reviewed <time datetime="%s">%s</time></span>' % (REVIEWED, REVIEWED_HUMAN)
)

for page in PAGES:
    s = open(page, encoding='utf-8').read()
    orig = s

    # 1. Schema: dateModified must equal the visible reviewed date.
    s = re.sub(r'"dateModified":\s*"\d{4}-\d{2}-\d{2}"', '"dateModified": "%s"' % REVIEWED, s)

    # 2. Author Person node: give it the same portrait the page now shows.
    s = re.sub(
        r'("@id": "https://rtmtravel\.co\.za/#founder",\s*\n\s*"name": "Anthea Ronne",)',
        r'\1\n          "image": "https://rtmtravel.co.za/assets/anthea-ronne.webp",',
        s, count=1)

    # 3. Byline: reviewed date next to the publish date.
    if 'Last reviewed' not in s:
        m = re.search(r'(<span>\d+ min read</span>)', s)
        if m:
            s = s[:m.start()] + m.group(1) + BYLINE_REVIEWED + s[m.end():]

    # 4. Author block above the related-articles rail.
    if 'Written and reviewed by' not in s:
        idx = -1
        for marker in ('<!-- Related Articles -->', '<!-- CTA -->',
                       '<div class="bg-rtm-accent/10 border border-rtm-accent/30 rounded-xl p-8 text-center my-12">'):
            idx = s.find(marker)
            if idx != -1:
                break
        assert idx != -1, page
        line_start = s.rfind('\n', 0, idx) + 1
        s = s[:line_start] + AUTHOR_BLOCK.lstrip('\n') + '\n' + s[line_start:]

    if s != orig:
        open(page, 'w', encoding='utf-8', newline='').write(s)
        print('updated', page)

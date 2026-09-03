"""Scaffold the service, comparison and Johannesburg pages (RTM-11, 12, 13).

Run once. The nav comes from an existing article and the footer from index.html,
so every new page carries the same shell, NAP block and script tag as the rest of
the site. After this has run the generated .html files are the source of truth —
edit them, not this script.

    python scripts/build_new_pages.py
"""
import os
import re

TODAY = '2026-09-02'
SITE = 'https://rtmtravel.co.za'

# ── shell ───────────────────────────────────────────────────────────────────
src = open('duty-of-care-business-travel.html', encoding='utf-8').read()
NAV = src[src.index('<body '):src.index('</nav>') + len('</nav>')]

idx_html = open('index.html', encoding='utf-8').read()
FOOTER = idx_html[idx_html.index('    <footer class="bg-black/30'):]

# Mark no nav item as the current page; these are not articles.
NAV = NAV.replace('<a href="articles" class="block py-2 px-3 text-rtm-accent rounded md:bg-transparent md:p-0" aria-current="page">Articles</a>',
                  '<a href="articles" class="block py-2 px-3 text-gray-300 rounded hover:bg-gray-700 md:hover:bg-transparent md:hover:text-rtm-accent md:p-0">Articles</a>')


# ── content helpers ─────────────────────────────────────────────────────────
def h2(text):
    return '                <h2 class="text-2xl md:text-3xl font-bold mb-5 mt-10 text-white">%s</h2>' % text


def h3(text):
    return '                <h3 class="text-xl font-bold mb-3 mt-8 text-white">%s</h3>' % text


def p(text):
    return '                <p class="text-gray-300 leading-relaxed mb-6">%s</p>' % text


def lead(text):
    return '                <p class="text-gray-300 leading-relaxed text-lg mb-6">%s</p>' % text


def ul(items):
    out = ['                <ul class="space-y-3 mb-8 text-gray-300">']
    for item in items:
        out.append('                    <li class="flex items-start gap-3"><span class="text-rtm-accent mt-1">&#9679;</span><span>%s</span></li>' % item)
    out.append('                </ul>')
    return '\n'.join(out)


def callout(title, body):
    return ('                <div class="glass-card p-6 border-l-4 border-rtm-accent rounded-lg bg-white/5 my-8">\n'
            '                    <h3 class="text-lg font-bold text-white mb-2">%s</h3>\n'
            '                    <p class="text-gray-300 text-sm leading-relaxed m-0">%s</p>\n'
            '                </div>') % (title, body)


def table(headers, rows):
    out = ['                <div class="overflow-x-auto my-8">',
           '                    <table class="w-full text-sm text-left border-collapse">',
           '                        <thead><tr class="border-b border-white/20">']
    for head in headers:
        out.append('                            <th class="py-3 pr-4 text-white font-semibold">%s</th>' % head)
    out.append('                        </tr></thead>')
    out.append('                        <tbody>')
    for row in rows:
        out.append('                            <tr class="border-b border-white/5">')
        for cell in row:
            out.append('                                <td class="py-3 pr-4 text-gray-300 align-top">%s</td>' % cell)
        out.append('                            </tr>')
    out.append('                        </tbody></table></div>')
    return '\n'.join(out)


def faq_html(pairs):
    out = [h2('Frequently Asked Questions'), '                <div class="space-y-4 mb-4">']
    for q, a in pairs:
        out.append('                    <div class="glass-card p-6">')
        out.append('                        <h3 class="text-base font-semibold text-white mb-2">%s</h3>' % q)
        out.append('                        <p class="text-gray-400 text-sm leading-relaxed">%s</p>' % a)
        out.append('                    </div>')
    out.append('                </div>')
    return '\n'.join(out)


def related(links):
    out = ['                <div class="mt-12 pt-8 border-t border-white/10">',
           '                    <h3 class="text-xl font-bold mb-6 text-white">Keep reading</h3>',
           '                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">']
    for slug, eyebrow, title in links:
        out.append('                        <a href="%s" class="glass-card p-6 hover:bg-white/5 transition-all group">' % slug)
        out.append('                            <p class="text-xs text-rtm-accent uppercase tracking-widest mb-2">%s</p>' % eyebrow)
        out.append('                            <h4 class="font-bold text-white group-hover:text-rtm-accent transition-colors leading-snug">%s</h4>' % title)
        out.append('                        </a>')
    out.append('                    </div>\n                </div>')
    return '\n'.join(out)


AUTHOR = '''                <div class="mt-12 pt-8 border-t border-white/10">
                    <div class="bg-rtm-card border border-white/5 rounded-xl p-6 flex flex-col sm:flex-row gap-6 items-start">
                        <img loading="lazy" width="160" height="160" src="/assets/anthea-ronne.webp"
                            alt="Anthea Ronne, founder of Remmitz Travel Management"
                            class="w-20 h-20 rounded-full object-cover border-2 border-rtm-accent flex-shrink-0" />
                        <div>
                            <p class="text-xs text-rtm-accent uppercase tracking-widest mb-2">Written and reviewed by</p>
                            <h3 class="text-lg font-bold text-white mb-2">Anthea Ronne</h3>
                            <p class="text-sm text-gray-400 leading-relaxed mb-3">Anthea Ronne has run Remmitz Travel Management since 2008, handling corporate travel programmes for South African businesses from Cape Town. RTM Travel is ASATA and IATA accredited, BEE Level 1, and 100%% female owned.</p>
                            <p class="text-sm text-gray-500">Last reviewed <time datetime="{today}">2 September 2026</time>. <a href="https://www.linkedin.com/in/anthea-ronne-37aa1811/" target="_blank" rel="noopener noreferrer" class="text-rtm-accent hover:underline">Connect on LinkedIn</a></p>
                        </div>
                    </div>
                </div>'''.format(today=TODAY)


def page_html(cfg):
    body = '\n\n'.join(cfg['body'])
    faq = faq_html(cfg['faq'])
    schema = build_schema(cfg)
    hero_img = cfg['hero']

    return '''<!DOCTYPE html>
<html lang="en-ZA">

<head>
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-XBPC12M3JF"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){{dataLayer.push(arguments);}}
      gtag('js', new Date());

      gtag('config', 'G-XBPC12M3JF');
    </script>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content="{description}" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="icon" type="image/png" href="./assets/favicon.png">

    <link rel="canonical" href="{site}/{slug}" />

    <meta property="og:type" content="website" />
    <meta property="og:url" content="{site}/{slug}" />
    <meta property="og:title" content="{title}" />
    <meta property="og:description" content="{description}" />
    <meta property="og:image" content="{site}/assets/og-card.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="en_ZA" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{title}" />
    <meta name="twitter:description" content="{description}" />
    <meta name="twitter:image" content="{site}/assets/og-card.jpg" />

    <script type="application/ld+json">
{schema}
    </script>
</head>

{nav}

    <!-- Hero -->
    <section class="relative w-full overflow-hidden bg-black" style="min-height: 46vh; padding-top: 120px; padding-bottom: 56px;">
        <img width="1408" height="768" src="./assets/{hero_img}" fetchpriority="high" class="absolute inset-0 w-full h-full object-cover z-0 opacity-50" alt="{hero_alt}">
        <div class="absolute inset-0 bg-gradient-to-r from-rtm-dark via-rtm-dark/75 to-transparent z-10"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-rtm-dark/90 via-transparent to-transparent z-10"></div>
        <div class="container mx-auto px-4 relative z-20 max-w-4xl">
            <div class="flex items-center gap-3 mb-6">
                <a href="/" class="text-sm text-gray-400 hover:text-rtm-accent transition-colors">Home</a>
                <span class="text-gray-600">/</span>
                <span class="text-sm text-rtm-accent">{eyebrow}</span>
            </div>
            <h1 class="text-4xl md:text-5xl font-bold mb-6 leading-tight">{h1}</h1>
            <p class="text-lg text-gray-300 max-w-2xl mb-8">{standfirst}</p>
            <a href="/#contact" class="btn-primary inline-block">{cta}</a>
        </div>
    </section>

    <!-- Content -->
    <section class="py-10 bg-rtm-dark">
        <div class="container mx-auto px-4">
            <div class="max-w-3xl mx-auto wa-clearance">

{body}

{faq}

{related}

{author}

            </div>
        </div>
    </section>

    <!-- CTA -->
    <section class="py-10 bg-rtm-card/20 border-t border-white/5">
        <div class="container mx-auto px-4 max-w-2xl text-center">
            <h2 class="text-2xl md:text-3xl font-bold mb-4">{cta_heading}</h2>
            <p class="text-gray-300 mb-8">{cta_body}</p>
            <a href="/#contact" class="btn-primary inline-block">Talk to the Team</a>
        </div>
    </section>

{footer}'''.format(
        title=cfg['title'], description=cfg['description'], site=SITE, slug=cfg['slug'],
        schema=schema, nav=NAV, hero_img=hero_img, hero_alt=cfg['hero_alt'],
        eyebrow=cfg['eyebrow'], h1=cfg['h1'], standfirst=cfg['standfirst'], cta=cfg['cta'],
        body=body, faq=faq, related=related(cfg['related']), author=AUTHOR,
        cta_heading=cfg['cta_heading'], cta_body=cfg['cta_body'], footer=FOOTER)


def build_schema(cfg):
    import json
    nodes = []
    if cfg.get('service'):
        nodes.append({
            '@context': 'https://schema.org',
            '@type': 'Service',
            '@id': '%s/%s#service' % (SITE, cfg['slug']),
            'name': cfg['service']['name'],
            'serviceType': cfg['service']['type'],
            'description': cfg['description'],
            'url': '%s/%s' % (SITE, cfg['slug']),
            'provider': {'@id': SITE + '/#business'},
            'areaServed': [
                {'@type': 'AdministrativeArea', 'name': area} for area in cfg['service'].get('areas', ['Cape Town', 'Johannesburg', 'South Africa'])
            ],
            'audience': {'@type': 'BusinessAudience', 'name': 'South African businesses and finance teams'},
        })
    else:
        nodes.append({
            '@context': 'https://schema.org',
            '@type': 'Article',
            '@id': '%s/%s#article' % (SITE, cfg['slug']),
            'headline': cfg['h1'],
            'description': cfg['description'],
            'url': '%s/%s' % (SITE, cfg['slug']),
            'datePublished': TODAY,
            'dateModified': TODAY,
            'author': {
                '@type': 'Person',
                '@id': SITE + '/#founder',
                'name': 'Anthea Ronne',
                'image': SITE + '/assets/anthea-ronne.webp',
                'jobTitle': 'Owner & CEO',
                'worksFor': {'@id': SITE + '/#business'},
                'sameAs': ['https://www.linkedin.com/in/anthea-ronne-37aa1811/'],
            },
            'publisher': {'@id': SITE + '/#business'},
            'image': '%s/assets/og-card.jpg' % SITE,
        })

    nodes.append({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        '@id': '%s/%s#faq' % (SITE, cfg['slug']),
        'mainEntity': [
            {'@type': 'Question', 'name': q,
             'acceptedAnswer': {'@type': 'Answer', 'text': re.sub(r'<[^>]+>', '', a)}}
            for q, a in cfg['faq']
        ],
    })

    crumbs = [{'@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': SITE + '/'}]
    crumbs.append({'@type': 'ListItem', 'position': 2, 'name': cfg['eyebrow'],
                   'item': '%s/%s' % (SITE, cfg['slug'])})
    nodes.append({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': crumbs,
    })

    return json.dumps(nodes, indent=2, ensure_ascii=False)


# ── pages ───────────────────────────────────────────────────────────────────
PAGES = []

# 1. Corporate flight booking ------------------------------------------------
PAGES.append({
    'slug': 'corporate-flight-booking',
    'title': 'Corporate Flight Booking &amp; Management South Africa | RTM Travel',
    'description': 'IATA-accredited corporate flight booking for South African businesses. Negotiated airline rates, policy enforcement at the point of booking, and 24/7 rebooking when a flight falls over.',
    'h1': 'Corporate Flight Booking and Management',
    'eyebrow': 'Corporate Flights',
    'standfirst': 'Flights are where most travel budgets are won or lost. We book them on your policy, at negotiated rates, and we fix them at 02:00 when they fall over.',
    'cta': 'Get a flight programme review',
    'hero': 'card-flight.webp',
    'hero_alt': 'Business traveller boarding a domestic flight at a South African airport',
    'service': {'name': 'Corporate Flight Booking and Management', 'type': 'Corporate flight booking'},
    'cta_heading': 'Put your flight spend on a shorter leash.',
    'cta_body': 'Send us three months of flight invoices. We will show you what the same trips would have cost booked on policy through RTM.',
    'body': [
        lead('Flights are usually the largest single line in a South African travel budget, and the one most exposed to how late the booking was made. RTM Travel is IATA accredited and books corporate air travel for South African businesses through a managed programme: your policy is loaded into the booking process, the fare is checked against negotiated corporate rates, and a named consultant owns the ticket from issue to return.'),
        p('The difference between a managed and an unmanaged flight programme is rarely the headline fare. It is the eight things that happen around it: the booking window, the change fee, the unused ticket that nobody reclaimed, the traveller who booked outside the system, the invoice that arrived on a personal credit card, and the reroute at 02:00 that either happened or did not.'),

        h2('What is included'),
        ul([
            '<strong>Domestic and regional air.</strong> Johannesburg&ndash;Cape Town, Durban, Gqeberha, and the regional network, booked on carriers including SAA and Airlink.',
            '<strong>International and multi-leg itineraries.</strong> Complex routings priced as a whole, not as a series of separate bookings.',
            '<strong>Policy enforcement at the point of booking.</strong> Out-of-policy fares are flagged for approval before ticketing, not queried on the expense report afterwards.',
            '<strong>Unused ticket tracking.</strong> Cancelled and changed tickets are logged and applied against future travel instead of quietly expiring.',
            '<strong>Consolidated invoicing.</strong> One monthly statement per cost centre, reconcilable against your accounting system without a spreadsheet exercise.',
            '<strong>24/7 disruption handling.</strong> Cancellations, missed connections and strike action are handled by a consultant who already has the booking open.',
        ]),

        h2('How the pricing works'),
        p('RTM Travel charges a transparent transaction fee per booking rather than marking up the fare. As of July 2026 that fee runs from R80 to R250 depending on the booking type. Every commission and negotiated corporate discount we hold with airlines and hotel groups is passed to the client. The practical consequence is that our incentive is to find you the correct fare, not the most expensive one, and that you can see exactly what our service costs as a line item rather than inferring it from a margin.'),
        callout('Why the booking window matters more than the fare hunt',
                'A 14-day advance booking rule on domestic travel typically moves more money than any amount of comparison shopping on the day. It is also the single rule most companies write into a policy and then fail to enforce, because nobody wants to refuse an executive. We refuse it for you, in the system, before the ticket is issued.'),

        h2('Where flight booking meets SARS'),
        p('International business travel now carries a declaration obligation that catches out travellers who have only ever flown domestically. If your staff carry laptops, demonstration stock, samples or high-value equipment out of the country, the SARS online traveller declaration applies to them. We brief travellers on it as part of the itinerary rather than leaving it to be discovered at the customs desk. The full explanation is in our guide to the <a href="sars-online-traveller-declaration-business-travel" class="text-rtm-accent hover:underline">SARS online traveller declaration for business travel</a>.'),

        h2('What changes in the first ninety days'),
        p('Most new flight programmes follow the same arc. In month one we consolidate booking into a single channel and stop the leakage from personal cards and consumer booking sites, which is where spend visibility usually breaks. In month two the advance booking discipline starts to show in the average fare. By month three the reporting is granular enough for a finance team to make decisions with it: which routes are being flown, by whom, how late, and at what premium over the policy fare.'),
        p('If you want the numbers behind that before you commit to anything, our <a href="corporate-travel-budget-south-africa" class="text-rtm-accent hover:underline">corporate travel budget benchmarks for South African companies</a> set out what the individual line items should cost, and the <a href="corporate-travel-management" class="text-rtm-accent hover:underline">complete guide to corporate travel management in South Africa</a> covers how the whole programme fits together.'),
    ],
    'faq': [
        ('How much does corporate flight booking cost through a TMC?',
         'RTM Travel charges a flat transaction fee per booking, ranging from R80 to R250 as of July 2026, rather than marking up the fare. Negotiated airline discounts are passed through to the client in full, so the fee is the whole of what the service costs.'),
        ('Can you enforce our travel policy on flight bookings?',
         'Yes. Your policy rules, including advance booking windows, permitted cabin class by trip length, and approval thresholds, are loaded into the booking process. Out-of-policy requests are routed for approval before the ticket is issued rather than queried afterwards.'),
        ('What happens if a flight is cancelled outside office hours?',
         'RTM Travel provides 24/7 support for active bookings. A consultant reroutes or rebooks the traveller directly, and where a disruption is known in advance, we act on it before the traveller reaches the airport.'),
        ('Do we lose access to cheap online fares by using a TMC?',
         'No. We price against the same public inventory and add negotiated corporate fares that are not available on consumer sites. The saving in a managed programme typically comes from booking discipline, recovered unused tickets and avoided change fees, not from a single cheaper fare.'),
        ('Which airlines do you book?',
         'All IATA carriers serving South Africa, including SAA and Airlink domestically and regionally, plus the international network through our IATA accreditation and our association with eTravel.'),
    ],
    'related': [
        ('travel-policy-approval-management', 'Service', 'Travel policy and approval management'),
        ('sars-online-traveller-declaration-business-travel', 'Compliance', 'The SARS online traveller declaration for business travel'),
    ],
})

# 2. Conference and event travel --------------------------------------------
PAGES.append({
    'slug': 'conference-event-travel',
    'title': 'Conference &amp; Event Travel Management South Africa | RTM Travel',
    'description': 'Group travel and event logistics for South African companies: conference delegations, offsites, incentive groups and roadshows, managed end to end from Cape Town.',
    'h1': 'Conference and Event Travel',
    'eyebrow': 'Conference & Events',
    'standfirst': 'Moving forty people to one room on one day is a different discipline to booking forty separate trips. This is the work we are best at.',
    'cta': 'Brief us on an event',
    'hero': 'card-conference.webp',
    'hero_alt': 'Corporate conference delegates arriving at a South African venue',
    'service': {'name': 'Conference and Event Travel Management', 'type': 'Group and event travel management'},
    'cta_heading': 'Tell us the date, the headcount and the room.',
    'cta_body': 'We will come back with routing, accommodation and a per-delegate cost before you commit to a venue.',
    'body': [
        lead('Group travel fails differently to individual travel. One late flight is an inconvenience; one late flight carrying six delegates to a conference that starts at 09:00 is an event that did not happen for them. RTM Travel manages conference delegations, company offsites, incentive groups and multi-city roadshows for South African businesses, and treats the arrival time as the deliverable rather than the booking.'),

        h2('What group travel actually requires'),
        ul([
            '<strong>A single manifest.</strong> Every delegate, flight, room, transfer and dietary requirement in one document that updates when something changes, not in a chain of forwarded emails.',
            '<strong>Buffered routing.</strong> Delegates arrive the evening before, or on a flight with a viable alternative behind it. This costs more per head and saves the event.',
            '<strong>Room blocks held properly.</strong> Negotiated group rates with a release date the client actually knows about, and a named contact at the property.',
            '<strong>Ground transport that scales.</strong> Airport transfers timed against actual arrival banks rather than scheduled ones.',
            '<strong>One reconciliation.</strong> A single consolidated invoice for the whole event, split by cost centre if the finance team needs it that way.',
            '<strong>A live contact for the duration.</strong> One person who knows the whole manifest, reachable for the full run of the event.',
        ]),

        callout('The rule we apply to every delegation',
                'If a delegate has to be in a room at a fixed time, they travel the day before or on a flight with a real alternative behind it. An event budget that saves on an overnight and loses a keynote speaker has not saved anything.'),

        h2('Incentive travel is a different brief again'),
        p('Incentive groups are the one category where the travel is the reward rather than the cost of doing business, and the brief inverts accordingly. The itinerary has to feel considered rather than efficient, the accommodation has to hold up in photographs, and the logistics have to be invisible to the people travelling. We handle incentive groups for South African companies rewarding sales teams and top performers, and the planning starts from what the group should remember rather than from the fare.'),

        h2('Venue sourcing and the parts nobody budgets for'),
        p('Where a client has not yet committed to a venue, we will cost two or three options as a total delivered price per delegate, including the flights and transfers that the venue quote never contains. A cheaper venue in a city your delegates have to connect through is routinely more expensive than a dearer one they can fly to directly. That comparison is difficult to make from inside a company and straightforward from inside a travel programme.'),
        p('Every rule that applies to individual travel still applies here: approval thresholds, spend caps, and the duty of care obligation that scales with the number of people you have moved. If a group is travelling on your instruction, your <a href="duty-of-care-business-travel" class="text-rtm-accent hover:underline">duty of care obligations as a South African employer</a> apply to all of them at once.'),
    ],
    'faq': [
        ('What size group do you handle?',
         'From small executive delegations of four or five people through to full conference contingents. The methodology is the same: one manifest, one point of contact, and buffered routing for anyone who must be in a room at a fixed time.'),
        ('Can you source the venue as well as the travel?',
         'Yes. Where a venue has not been chosen, we cost the shortlist as a total delivered price per delegate, including flights and transfers, so the comparison reflects what the event will actually cost rather than the venue quote alone.'),
        ('How far in advance should we brief you on a conference?',
         'As early as the date is known. Group airfares and room blocks are held on availability, and the practical difference between briefing us four months out and four weeks out is usually visible in the per-delegate cost.'),
        ('How is event travel invoiced?',
         'As a single consolidated invoice for the event, split by cost centre where the finance team needs that. The transparent per-transaction fee model applies, with negotiated group rates passed through.'),
        ('Do you handle incentive travel as well as conferences?',
         'Yes. Incentive groups are planned to a different brief, where the itinerary and the experience are the point, but the underlying logistics, duty of care and reconciliation are managed the same way.'),
    ],
    'related': [
        ('business-accommodation', 'Service', 'Business accommodation and negotiated rates'),
        ('duty-of-care-business-travel', 'Duty of Care', 'Duty of care in corporate travel: what South African employers must know'),
    ],
})

# 3. Business accommodation --------------------------------------------------
PAGES.append({
    'slug': 'business-accommodation',
    'title': 'Business Accommodation &amp; Negotiated Corporate Rates | RTM Travel',
    'description': 'Corporate accommodation booking for South African businesses. Negotiated rates with groups including Southern Sun and City Lodge, per-city rate caps, and one consolidated invoice.',
    'h1': 'Business Accommodation and Negotiated Rates',
    'eyebrow': 'Accommodation',
    'standfirst': 'The nightly rate is the number everyone looks at. The rate cap, the cancellation terms and the billing arrangement are the numbers that decide the annual cost.',
    'cta': 'Ask for a rate review',
    'hero': 'card-hotel.webp',
    'hero_alt': 'Business hotel room in a South African city, evening light',
    'service': {'name': 'Business Accommodation and Negotiated Rates', 'type': 'Corporate accommodation booking'},
    'cta_heading': 'Find out what you are overpaying for a bed.',
    'cta_body': 'Send us last quarter of accommodation invoices and we will benchmark them against the corporate rates available for the same properties.',
    'body': [
        lead('Accommodation is the second largest line in most South African travel budgets and the one where consumer prices and corporate rates diverge the most. RTM Travel books business accommodation against negotiated corporate rates with South African hotel groups including Southern Sun and City Lodge, and against international inventory for outbound travel, with the negotiated discount passed through to the client in full.'),
        p('There is a specific failure that we see in almost every unmanaged programme. A traveller books a property on a consumer site at what looks like a good rate, pays with a personal card, and expenses it. The company pays the consumer price, loses the corporate rate, loses the consolidated invoice, loses the VAT position on a portion of the spend, and has no record of where the employee slept if something goes wrong that night. The nightly rate was fine. Everything around it was not.'),

        h2('What a negotiated corporate rate actually gives you'),
        ul([
            '<strong>A rate below the public price for the same room</strong>, held for the contract period rather than moving with demand.',
            '<strong>Terms that suit business travel.</strong> Later cancellation cut-offs and flexible check-in matter more than the last hundred rand when a flight moves.',
            '<strong>Bill-back to the company</strong>, so the traveller is not carrying company spend on a personal card and the invoice arrives already reconciled.',
            '<strong>Inclusions that would otherwise be extras</strong>, typically breakfast and internet, which are the two most common surprise lines on a hotel bill.',
            '<strong>A known standard.</strong> Properties that have been used before by business travellers from the same programme, which is a duty of care position as much as a comfort one.',
        ]),

        h2('Rate caps by city, not one number for the country'),
        p('A single national accommodation cap is the most common mistake in a South African travel policy. Johannesburg, Cape Town and Durban do not price alike, and Cape Town in particular moves sharply with season. A cap that is generous in Johannesburg in June is unusable in Cape Town in December, and the predictable result is a policy that is quietly ignored for a quarter of the year. We set caps per city, and revisit them when the market moves rather than annually out of habit.'),
        table(
            ['Policy element', 'Common mistake', 'What we recommend'],
            [
                ['Rate cap', 'One national figure', 'Per-city caps, reviewed when the market moves'],
                ['Seasonality', 'Ignored', 'A defined peak-season variance for Cape Town and the coast'],
                ['Payment', 'Traveller pays, expenses later', 'Bill-back to the company on a consolidated invoice'],
                ['Property standard', 'Star rating only', 'Approved property list per city, informed by duty of care'],
                ['Cancellation', 'Cheapest rate taken', 'Flexible terms for any trip tied to a fixed meeting'],
            ]),
        callout('Set the cap from the benchmark, not from a feeling',
                'Our <a href="corporate-travel-budget-south-africa" class="text-rtm-accent hover:underline">corporate travel budget benchmarks for South African companies</a> exist so that a finance team can set accommodation caps against real market figures rather than against what last year\'s spreadsheet happened to contain.'),

        h2('Accommodation and duty of care'),
        p('Where your people sleep is a duty of care question, not only a cost one. An employer who cannot say which property an employee is in tonight cannot claim to have taken reasonable steps to protect them. Booking accommodation through a managed programme means the property, the room and the check-in are on record, and the after-hours team can reach the traveller through the property if a phone is off. That record is also what an employer relies on to demonstrate compliance after the fact.'),
        p('If you are writing or rewriting the accommodation section of your policy, the practical structure is set out in our guide to <a href="corporate-travel-policy-template" class="text-rtm-accent hover:underline">writing a corporate travel policy for a South African business</a>, and the enforcement side is covered under <a href="travel-policy-approval-management" class="text-rtm-accent hover:underline">travel policy and approval management</a>.'),
    ],
    'faq': [
        ('How do corporate hotel rates work in South Africa?',
         'A corporate rate is negotiated between the travel management company or the client and the hotel group, and sits below the publicly advertised price for the same room. It usually carries better cancellation terms and can be billed directly to the company rather than paid by the traveller.'),
        ('Which hotel groups do you have rates with?',
         'RTM Travel books against negotiated corporate rates with South African groups including Southern Sun and City Lodge, alongside international inventory for outbound travel. Negotiated discounts are passed to the client in full under our transparent transaction-fee model.'),
        ('What should our accommodation rate cap be?',
         'It should be set per city rather than nationally, because Johannesburg, Cape Town and Durban price differently and Cape Town moves sharply in peak season. Our published budget benchmarks give the current market figures to set those caps against.'),
        ('Can hotels be billed directly to the company?',
         'Yes. Bill-back arrangements mean the traveller does not carry company spend on a personal card, and the accommodation appears on the consolidated monthly invoice already reconciled against the trip.'),
        ('Does booking accommodation through a TMC help with duty of care?',
         'Materially. The employer has a live record of which property each traveller is in, the after-hours team can reach the traveller through the property, and the standard of the property has been vetted rather than chosen from a consumer listing.'),
    ],
    'related': [
        ('corporate-travel-budget-south-africa', 'Benchmarks', 'Corporate travel budget benchmarks for South African companies'),
        ('conference-event-travel', 'Service', 'Conference and event travel'),
    ],
})

# 4. Travel policy and approval management -----------------------------------
PAGES.append({
    'slug': 'travel-policy-approval-management',
    'title': 'Travel Policy &amp; Approval Management for SA Companies | RTM Travel',
    'description': 'We write, load and enforce your corporate travel policy at the point of booking, with tiered approval workflows and spend reporting your CFO can act on.',
    'h1': 'Travel Policy and Approval Management',
    'eyebrow': 'Policy & Approvals',
    'standfirst': 'A policy that lives in a PDF is a suggestion. A policy loaded into the booking system is a control.',
    'cta': 'Get your policy reviewed',
    'hero': 'card-policy.webp',
    'hero_alt': 'Finance team reviewing a corporate travel policy document',
    'service': {'name': 'Travel Policy and Approval Management', 'type': 'Travel policy design and enforcement'},
    'cta_heading': 'Stop being the person who says no.',
    'cta_body': 'We load your rules into the booking process and enforce them, so your finance team stops policing individual bookings.',
    'body': [
        lead('This is the closest thing to what RTM Travel actually sells. The flights and the hotels are the visible part; the reason a finance team keeps a travel management company is that the rules get applied consistently, by someone other than them, at the moment a booking is made rather than three weeks later on an expense report.'),
        p('Almost every company we take on already has a travel policy. Very few have an enforced one. The document exists, it is broadly sensible, and it is ignored in exactly the situations it was written for: the urgent trip, the senior person, the booking made at 22:00 on a consumer site because it was faster. Policy leakage is not usually defiance. It is friction plus urgency, and it is solved by removing the friction rather than by circulating the document again.'),

        h2('What we do'),
        ul([
            '<strong>Review or write the policy.</strong> Booking windows, cabin class by trip length, per-city accommodation caps, ground transport, per diems, and the approval matrix. If you have no policy, our <a href="corporate-travel-policy-template" class="text-rtm-accent hover:underline">corporate travel policy template</a> is the starting document.',
            '<strong>Load it into the booking process.</strong> The rules are configured against your account, so a compliant booking goes straight through and a non-compliant one stops.',
            '<strong>Build the approval matrix.</strong> Tiered by trip type and cost, so a routine domestic trip does not need a director and an unplanned international trip does.',
            '<strong>Handle exceptions properly.</strong> Out-of-policy travel is often legitimate. It should be visible, approved by the right person, and recorded, not quietly absorbed.',
            '<strong>Report on compliance.</strong> Monthly reporting on booking lead times, out-of-policy bookings and spend by cost centre, so the policy can be revised against evidence.',
        ]),

        h2('The approval workflow, in practice'),
        p('An approval chain that is too heavy is as damaging as no chain at all, because it pushes people around the system. The working structure for most South African businesses is three tiers: in-policy domestic travel is auto-approved and simply booked; anything international, or above a defined value, needs a single named approver; and out-of-policy requests need that approver plus a recorded reason. Adding a fourth tier is usually how a company ends up with a shadow booking process.'),
        table(
            ['Trip type', 'Approval required', 'Where it should sit'],
            [
                ['In-policy domestic', 'None &mdash; booked directly', 'Traveller or assistant'],
                ['International, in policy', 'One named approver', 'Line manager or department head'],
                ['Above value threshold', 'One named approver', 'Finance'],
                ['Out of policy, any value', 'Named approver plus recorded reason', 'Finance or executive'],
            ]),
        callout('Approval turnaround is a policy setting, not a hope',
                'Write the expected turnaround into the policy itself and hold the business to it. If an approver has not responded within the stated window, the request should escalate automatically rather than sit. A policy that is silent on turnaround is the most common reason a traveller books around the system. <!-- CLIENT TO CONFIRM: publish RTM\'s own quoted turnaround here once Anthea confirms the committed number. -->'),

        h2('What the reporting is for'),
        p('The point of compliance reporting is not to catch people. It is to tell you which rules are wrong. If eighty per cent of a department books inside the fourteen-day window and one team never does, the finding is usually about how that team gets its work, not about discipline. If the Cape Town accommodation cap is breached every December, the cap is wrong. A policy that is revised annually against real booking data converges on something people can follow; one that is revised from memory does not.'),
        p('For the wider context, see the <a href="corporate-travel-management" class="text-rtm-accent hover:underline">complete guide to corporate travel management in South Africa</a>, or, if you are still deciding whether to run this internally at all, the honest comparison of <a href="in-house-vs-travel-management-company" class="text-rtm-accent hover:underline">in-house booking versus a travel management company</a>.'),
    ],
    'faq': [
        ('What is policy leakage and how do you stop it?',
         'Policy leakage is travel booked outside approved channels or above policy limits. It is stopped by making the compliant route the easiest one and by enforcing the rules inside the booking system, so a non-compliant booking is flagged for approval before it is confirmed rather than queried afterwards.'),
        ('Do we need a travel policy if only a few people travel?',
         'Yes. Even a small programme benefits from written booking windows, spend limits and an approval route. Without them, decisions are made ad hoc, and the company has no documented position to rely on if a duty of care question arises.'),
        ('Who should approve corporate travel?',
         'A three-tier structure works for most South African businesses: in-policy domestic travel needs no approval, international or high-value travel needs one named approver, and out-of-policy travel needs that approver plus a recorded reason.'),
        ('How often should a travel policy be reviewed?',
         'At least annually, and immediately when booking data shows a rule being breached systematically. A rule that is broken by one team every month is usually a rule that does not match how that team works.'),
        ('Can you write the policy for us?',
         'Yes. We will either review the policy you have or build one with you from our template, then load the rules into the booking process so they are enforced rather than circulated.'),
    ],
    'related': [
        ('corporate-travel-policy-template', 'Template', 'How to write a corporate travel policy for your South African business'),
        ('in-house-vs-travel-management-company', 'Comparison', 'In-house travel booking versus a travel management company'),
    ],
})

# 5. Comparison page ---------------------------------------------------------
PAGES.append({
    'slug': 'in-house-vs-travel-management-company',
    'title': 'In-House Travel Booking vs a Travel Management Company (South Africa)',
    'description': 'An honest comparison for South African finance managers: when booking travel in-house is the right call, when a TMC pays for itself, and the numbers to run before you decide.',
    'h1': 'In-House Travel Booking Versus a Travel Management Company',
    'eyebrow': 'Comparison',
    'standfirst': 'Written by a travel management company, which is a conflict of interest we would rather name than hide. Here is the case for keeping it in-house first.',
    'cta': 'Run the numbers with us',
    'hero': 'corp-chaos.webp',
    'hero_alt': 'Office manager comparing flight options across several screens',
    'cta_heading': 'Still not sure which side of the line you are on?',
    'cta_body': 'Send us a quarter of travel invoices. If the answer is that you should keep it in-house, we will say so.',
    'body': [
        lead('A South African financial manager usually asks this question at a specific moment: travel spend has grown enough to be visible in the management accounts, someone in the business has spent a bad afternoon rebooking a stranded colleague, and nobody can say with confidence what the total figure was last year. This page is the comparison, including the part where the answer is to stay in-house.'),

        h2('The honest case for keeping it in-house'),
        p('If your company books fewer than roughly two or three trips a month, mostly domestic, mostly by the same two or three people, on flexible dates, then a travel management company will probably not save you money. There is not enough volume for negotiated rates to matter, the transaction fees are a real cost against a small base, and the person who currently books the travel is doing it in under an hour a month. Adding a supplier to that is process for its own sake.'),
        p('There are other legitimate reasons to stay in-house. Some businesses have an assistant who genuinely enjoys the work and is unusually good at it. Some have travel so irregular that no pattern exists to manage. Some have already built the internal controls, the approval routing and the spend reporting, and have effectively become their own travel management function. If that describes you, keep going.'),

        h2('Where in-house booking stops working'),
        p('It stops working at the point where the cost of the arrangement is no longer the booking fee. Four things tend to fail at once, and they fail quietly:'),
        ul([
            '<strong>The time is invisible.</strong> An office manager on a market-rate salary spending a day a month on travel is a real annual cost that appears in nobody\'s travel budget.',
            '<strong>The spend is unreconcilable.</strong> Flights on a company card, hotels on personal cards claimed back, ground transport scattered across individual accounts. There is no total, so there is nothing to negotiate against.',
            '<strong>The policy is unenforced.</strong> Nobody internal wants to refuse a director a business class seat. An external supplier applying an agreed rule has no such difficulty.',
            '<strong>The duty of care position is undocumented.</strong> If you cannot show where your travellers were and what steps you took to protect them, you are exposed under the Occupational Health and Safety Act regardless of how well the trip went.',
        ]),

        h2('The numbers to run before you decide'),
        p('Do this arithmetic rather than taking anyone\'s word for it, ours included.'),
        table(
            ['Line', 'How to calculate it', 'Why it matters'],
            [
                ['Annual travel spend', 'Every flight, bed, car and transfer, including anything expensed on personal cards', 'This is almost always larger than the number finance is working from'],
                ['Internal time cost', 'Hours per month spent booking and rebooking, times the loaded hourly cost of the person doing it', 'The largest hidden cost in an in-house programme'],
                ['Transaction fee cost', 'Bookings per year times the per-transaction fee (R80 to R250 as of July 2026)', 'This is the visible cost of the alternative &mdash; the number to beat'],
                ['Realistic saving', 'Managed programmes typically reduce travel spend by 15% to 20% annually', 'Apply this to your own figure, not to an industry average'],
                ['Risk position', 'Can you produce, today, a record of where every traveller was last quarter?', 'This one does not have a rand value until it does'],
            ]),
        callout('The threshold, stated plainly',
                'Below roughly two or three trips a month, keep it in-house. Above that, and particularly once international travel or more than a handful of travellers is involved, the arithmetic usually turns and the duty of care exposure stops being theoretical. Between the two, the deciding factor is normally whether anyone can currently produce a reliable total travel figure on request.'),

        h2('The middle option people forget'),
        p('It is not a binary. A company can keep day-to-day domestic booking in-house and use a travel management company only for international travel, group and event travel, and after-hours support. That is a common and sensible arrangement for a business whose domestic travel is genuinely simple but whose occasional international trips are complex and high value. It is worth asking for explicitly rather than assuming an all-or-nothing structure.'),

        h2('What to ask any TMC you speak to'),
        ul([
            'Is your pricing a transaction fee or a mark-up on the fare? A mark-up means the supplier profits from a more expensive booking.',
            'Are negotiated airline and hotel discounts passed through in full, and can you show that on an invoice?',
            'Who answers at 02:00, and is it a named consultant who already has the booking, or a call centre?',
            'What reporting do we get, how often, and in what format does it reach our accounting system?',
            'Are you ASATA and IATA accredited? Both matter, for financial security and for ticketing authority respectively.',
        ]),
        p('For what a managed programme should cost you, see our <a href="corporate-travel-budget-south-africa" class="text-rtm-accent hover:underline">corporate travel budget benchmarks</a>. For the obligations that sit behind the risk line in that table, see <a href="duty-of-care-business-travel" class="text-rtm-accent hover:underline">duty of care in corporate travel</a>. For the full picture, the <a href="corporate-travel-management" class="text-rtm-accent hover:underline">complete guide to corporate travel management in South Africa</a>.'),
    ],
    'faq': [
        ('Is a travel management company worth it for a small company?',
         'Below roughly two or three trips a month, mostly domestic, usually not. The transaction fees are a real cost against a small base and there is not enough volume for negotiated rates to matter. Above that threshold, and particularly once international travel is involved, the arithmetic usually turns.'),
        ('How much does a TMC cost in South Africa?',
         'Reputable TMCs charge a transparent transaction fee per booking rather than a mark-up on the fare. RTM Travel\'s fee ranges from R80 to R250 per booking as of July 2026, with negotiated supplier discounts passed to the client in full.'),
        ('How much can a company save by moving from in-house booking to a TMC?',
         'Managed travel programmes typically reduce annual travel spend by 15% to 20%, through negotiated rates, advance booking discipline, policy enforcement and recovered unused tickets. Apply that range to your own total spend rather than to an industry figure.'),
        ('Can we use a TMC for international travel only?',
         'Yes, and for some businesses that is the right structure. Keeping simple domestic booking in-house while using a TMC for international, group and after-hours work is a common arrangement.'),
        ('What is the biggest risk of booking business travel in-house?',
         'The undocumented duty of care position. If an employer cannot demonstrate where travelling employees were and what steps were taken to protect them, it is exposed under the Occupational Health and Safety Act, regardless of whether anything went wrong.'),
    ],
    'related': [
        ('travel-policy-approval-management', 'Service', 'Travel policy and approval management'),
        ('corporate-travel-budget-south-africa', 'Benchmarks', 'Corporate travel budget benchmarks for South African companies'),
    ],
})

# 6. Johannesburg ------------------------------------------------------------
PAGES.append({
    'slug': 'corporate-travel-management-johannesburg',
    'title': 'Corporate Travel Management Johannesburg | RTM Travel',
    'description': 'Corporate travel management for Johannesburg and Gauteng businesses: OR Tambo and Lanseria routing, the Sandton corridor, and the domestic and Africa network flown from Johannesburg.',
    'h1': 'Corporate Travel Management in Johannesburg',
    'eyebrow': 'Johannesburg',
    'standfirst': 'Two airports, the busiest corporate corridor in the country, and the departure point for most of South Africa\'s Africa travel. Gauteng travel is not Cape Town travel with a different address.',
    'cta': 'Talk to us about Gauteng travel',
    'hero': 'departure.webp',
    'hero_alt': 'Aircraft on stand at OR Tambo International Airport, Johannesburg',
    'service': {'name': 'Corporate Travel Management in Johannesburg',
                'type': 'Corporate travel management',
                'areas': ['Johannesburg', 'Sandton', 'Gauteng', 'South Africa']},
    'cta_heading': 'Gauteng travel, run from a desk that answers.',
    'cta_body': 'RTM Travel manages travel programmes for Johannesburg businesses from Cape Town, with the same named-consultant model and 24/7 cover.',
    'body': [
        lead('RTM Travel manages corporate travel for Johannesburg and wider Gauteng businesses. We are based in Cape Town and say so plainly; what a Johannesburg client gets is a named consultant, negotiated rates, policy enforcement and 24/7 cover, not a branch office. What follows is what is actually different about running a travel programme out of Gauteng.'),

        h2('Two airports, and the choice is not automatic'),
        p('Johannesburg is the only South African corporate market with a real airport decision to make on most trips. OR Tambo International is the hub: the full domestic network, the international long-haul, and the great majority of the Africa routes. Lanseria carries a narrower domestic schedule but sits materially closer to Sandton, Randburg, Fourways and the northern suburbs, and on a weekday morning the drive-time difference between the two is often larger than the difference in flight time.'),
        p('The practical rule we apply is that the booking is priced on total door-to-door time, not on the fare. For a traveller based in Sandton flying to Cape Town for a midday meeting, Lanseria is frequently the correct booking even at a higher fare, because it removes an hour of the N12 or the R24 from the front of the day. For a traveller connecting onward to anywhere in Africa or long-haul, it is almost never the correct booking, because it means a transfer across the city with a bag.'),

        callout('The Gauteng-only variable: traffic is part of the itinerary',
                'A 07:00 departure from OR Tambo means leaving Sandton before 05:30 on a normal weekday. That is a real constraint on how you schedule the day before, and it is the main reason Gauteng travellers book earlier flights and later returns than Cape Town travellers on the same route.'),

        h2('The corridor RTM books most from Johannesburg'),
        p('The Johannesburg&ndash;Cape Town route is the busiest in the country and behaves like a shuttle: high frequency, sharp price movement close to departure, and a meaningful penalty for booking late. It rewards advance booking discipline more than any other domestic route in South Africa, which is why a fourteen-day booking window is worth more to a Gauteng travel programme than to almost anyone else. Johannesburg&ndash;Durban and Johannesburg&ndash;Gqeberha follow the same pattern at lower frequency, where a missed flight means a longer wait for the next one.'),

        h2('Johannesburg is where South African Africa travel starts'),
        p('This is the largest single difference from a Cape Town programme. Regional routes into the rest of the continent are concentrated at OR Tambo, and Africa travel carries requirements that domestic travel does not: visa lead times that are measured in weeks rather than days, yellow fever certification for several destinations, and connections that leave no useful alternative if the first leg slips. A travel programme run from Johannesburg needs the visa and documentation lead time built into the approval workflow, not handled as an afterthought once the flight is booked.'),
        p('International business travel out of OR Tambo also brings the SARS declaration obligation into routine use. Staff carrying laptops, samples, demonstration equipment or high-value stock out of the country need to have dealt with the <a href="sars-online-traveller-declaration-business-travel" class="text-rtm-accent hover:underline">SARS online traveller declaration</a> before they reach the terminal, and at OR Tambo volumes that is a briefing that has to be part of the itinerary rather than a reminder.'),

        h2('Accommodation: Sandton is its own market'),
        p('Gauteng accommodation caps have to be set differently from Cape Town ones, and not only because the rates differ. Sandton prices as a business district with its own conference demand, and a cap set from a Johannesburg-wide average will not book a room there during a major event. Cape Town moves with the summer season; Sandton moves with the corporate and conference calendar. They are different problems and a single national cap solves neither, which is the argument set out in more detail under <a href="business-accommodation" class="text-rtm-accent hover:underline">business accommodation and negotiated rates</a>.'),

        h2('What is the same wherever you are'),
        p('The policy, the approval matrix, the reporting and the duty of care obligation do not change by province. If you are building the programme rather than moving one, start with the <a href="corporate-travel-management" class="text-rtm-accent hover:underline">complete guide to corporate travel management in South Africa</a> and the section on <a href="travel-policy-approval-management" class="text-rtm-accent hover:underline">travel policy and approval management</a>.'),
    ],
    'faq': [
        ('Should Johannesburg travellers use OR Tambo or Lanseria?',
         'Price the trip on total door-to-door time rather than on the fare. For travellers in Sandton and the northern suburbs on a point-to-point domestic trip, Lanseria often wins even at a higher fare. For anything connecting onward, internationally or into Africa, OR Tambo is almost always correct because Lanseria means a transfer across the city.'),
        ('Does RTM Travel have an office in Johannesburg?',
         'RTM Travel is based in Cape Town and manages Johannesburg and Gauteng travel programmes from there, with a named consultant per client and 24/7 support for active bookings. Johannesburg is a declared service area in our travel programme, not a branch network.'),
        ('What makes Johannesburg corporate travel different from Cape Town?',
         'Three things: a genuine choice between two airports on most domestic trips, drive time to OR Tambo that has to be treated as part of the itinerary, and the concentration of South Africa\'s Africa routes at OR Tambo, which brings visa and yellow fever lead times into routine planning.'),
        ('How far in advance should Johannesburg to Cape Town flights be booked?',
         'Fourteen days is the standard domestic booking window and it matters more on this route than on any other in the country, because the high-frequency shuttle pattern means fares move sharply close to departure.'),
        ('Can you handle travel into the rest of Africa from Johannesburg?',
         'Yes. Regional African routes run predominantly out of OR Tambo, and we build visa lead times, yellow fever certification requirements and connection risk into the booking rather than treating them as documentation to sort out afterwards.'),
    ],
    'related': [
        ('corporate-travel-management', 'Guide', 'The complete guide to corporate travel management in South Africa'),
        ('corporate-flight-booking', 'Service', 'Corporate flight booking and management'),
    ],
})


for cfg in PAGES:
    out = cfg['slug'] + '.html'
    with open(out, 'w', encoding='utf-8', newline='') as fh:
        fh.write(page_html(cfg))
    print('wrote', out, os.path.getsize(out), 'bytes')

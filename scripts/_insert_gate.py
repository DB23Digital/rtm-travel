"""One-off: swap the ungated template link for the lead-gated download form."""

F = 'corporate-travel-policy-template.html'

GATE = '''
                <!-- Lead gate for the policy template. Handled by .template-gate-form in src/main.js, POSTed to public/download.php. -->
                <div id="{anchor}" class="bg-rtm-card border border-rtm-accent/30 rounded-xl p-6 md:p-8 my-12 scroll-mt-24">
                    <p class="text-xs text-rtm-accent uppercase tracking-widest mb-2">Free download</p>
                    <h3 class="text-xl md:text-2xl font-bold text-white mb-3">Get the fill-in-the-field policy template</h3>
                    <p class="text-gray-300 text-sm leading-relaxed mb-6">{blurb}</p>
                    <form class="template-gate-form grid grid-cols-1 md:grid-cols-3 gap-4" data-source="{source}" novalidate>
                        <div>
                            <label class="block text-xs text-gray-400 mb-1" for="{prefix}-name">Name</label>
                            <input id="{prefix}-name" name="name" type="text" autocomplete="name" required
                                class="w-full bg-rtm-dark border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-rtm-accent" placeholder="Thandi Mokoena" />
                        </div>
                        <div>
                            <label class="block text-xs text-gray-400 mb-1" for="{prefix}-email">Work email</label>
                            <input id="{prefix}-email" name="email" type="email" autocomplete="email" required
                                class="w-full bg-rtm-dark border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-rtm-accent" placeholder="thandi@company.co.za" />
                        </div>
                        <div>
                            <label class="block text-xs text-gray-400 mb-1" for="{prefix}-company">Company</label>
                            <input id="{prefix}-company" name="company" type="text" autocomplete="organization" required
                                class="w-full bg-rtm-dark border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-rtm-accent" placeholder="Company (Pty) Ltd" />
                        </div>
                        <!-- Honeypot: real people never fill this in. -->
                        <input type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" class="hidden" />
                        <div class="md:col-span-3">
                            <label class="flex items-start gap-3 text-xs text-gray-400 leading-relaxed">
                                <input type="checkbox" name="consent" value="yes" required
                                    class="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-white/20 bg-rtm-dark accent-rtm-accent" />
                                <span>I consent to RTM Travel storing my name, work email and company, and contacting me about corporate travel management. I may withdraw consent at any time. See the <a href="privacy-policy" class="text-rtm-accent hover:underline">privacy policy</a>.</span>
                            </label>
                        </div>
                        <div class="md:col-span-3 flex flex-wrap items-center gap-4">
                            <button type="submit" class="btn-primary inline-flex items-center gap-2 px-6 py-3">
                                <span>Send me the template</span>
                            </button>
                            <p class="gate-error hidden text-sm text-red-400" role="alert"></p>
                        </div>
                    </form>
                    <div class="gate-success hidden mt-6 border-t border-white/10 pt-6" role="status" aria-live="polite">
                        <p class="text-white font-semibold mb-3">Thank you &mdash; your template is ready.</p>
                        <div class="gate-links flex flex-wrap gap-4"></div>
                        <p class="text-xs text-gray-500 mt-4">These links expire in an hour. Word version for editing, printable version for signing.</p>
                    </div>
                </div>
'''


def gate(anchor, prefix, source, blurb):
    return GATE.format(anchor=anchor, prefix=prefix, source=source, blurb=blurb)


s = open(F, encoding='utf-8').read()

old_hero = ('<a href="/downloads/corporate-travel-policy-template.html" target="_blank" '
            'rel="noopener noreferrer" class="btn-primary inline-flex items-center gap-2 mb-8">')
new_hero = '<a href="#get-the-template" class="btn-primary inline-flex items-center gap-2 mb-8">'
assert old_hero in s
s = s.replace(old_hero, new_hero)

# Mid-article: after element 03, while the reader is invested but not finished.
marker = '''                    <div class="bg-rtm-card rounded-xl p-6 border border-white/5">
                        <div class="flex items-start gap-4">
                            <span class="text-2xl font-bold text-rtm-accent flex-shrink-0">04</span>'''
assert marker in s
mid = gate(
    'get-the-template', 'gate-mid', 'policy-article-mid',
    'Every element on this page, laid out as a document you can complete and circulate. '
    'Word version to edit, printable version to sign. Three fields, no phone call.')
s = s.replace(marker, '                </div>\n' + mid + '\n                <div class="space-y-6 mb-12">\n' + marker, 1)

# End of article: after the FAQ, before Related Articles.
end_marker = '''                <!-- Related Articles -->'''
assert end_marker in s
end = gate(
    'get-the-template-end', 'gate-end', 'policy-article-end',
    'Take the template with you. Fill in your own booking windows, rate caps and approvers, '
    'and you have a working policy by the end of the day.')
s = s.replace(end_marker, end + '\n' + end_marker, 1)

open(F, 'w', encoding='utf-8', newline='').write(s)
print('gate inserted')

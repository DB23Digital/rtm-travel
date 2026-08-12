# RTM Travel — Developer Brief: SEO Audit Remediation

**Site:** rtmtravel.co.za
**Repo:** `c:\Users\Deon\Documents\DB23 eCommerce\Take it to market\Websites\RTM Travel`
**Audit date:** 12 Aug 2026 — 12-agent SEO audit (technical, content, schema, sitemap, performance, visual, GEO, SXO, local, cluster, Google APIs, backlinks)
**Health score:** 74/100 · **Local SEO score:** 28/100 (unweighted, flagged separately)
**Stack:** Vite static build, `base: './'`, no templating/partials — each page's `<head>`/nav/footer is duplicated HTML in its own source file (`index.html`, `corporate-travel-management.html`, etc. in repo root → built to `dist/`)

---

## Remediation status — 12 Aug 2026 (same-day)

All dev-doable Critical + High + selected Medium items shipped same day as the audit. Commits `7e1f184`→`c656ef2` (6 commits, source + `dist/` sync). Deploy zip `rtmtravel-cpanel-2026-08-12.zip` built and verified (forward-slash paths, all 811 files). **Not yet pushed to `origin/main`** and **not yet uploaded to cPanel** — both are user actions.

| # | Item | Status |
|---|---|---|
| C1 | Site not indexed by Google | ✅ Client requested indexing in GSC |
| C2 | Local SEO / trust signals | ⏳ GBP claim submitted, awaiting Google approval |
| C3 | Privacy Policy page | ✅ Built (`privacy-policy.html`), linked site-wide + POPIA checkbox — **draft, needs legal sign-off before treating as final** |
| C4 | Policy template delivers no download | ✅ Built (`/downloads/corporate-travel-policy-template.html`, fillable print/PDF), CTA added above the fold |
| H1 | Blog hero JPEGs killing mobile LCP | ✅ Converted to WebP (760KB–1.6MB → 60–95KB), fetchpriority added |
| H2 | Hero LCP image invisible to preload scanner | ✅ Preload tags added (both breakpoints) |
| H3 | No footer NAP / tel/mailto anywhere | ✅ Added to all 7 content pages |
| H4 | Duplicate/incomplete schema on pillar page | ✅ Removed |
| H5 | Pillar page not linking its own spokes; SARS orphaned | ✅ Inline pillar→spoke links added; SARS added to footer + reciprocal link from Duty of Care |
| M1 | FAQPage schema missing on 4 pages | ✅ Added (index, pillar, policy-template, budget) |
| M2 | Pillar page thin content | ❌ Not done — content/copywriting task |
| M3 | No CSP header | ❌ Not done — needs inline-script audit + `.htaccess` change, left for a dedicated pass |
| M4 | Utility pages missing canonical/schema | ✅ Resolved as noindex (client confirmed client-only tool pages) + removed from sitemap |
| M5 | Homepage schema missing social profiles | ✅ Instagram added to `sameAs`; LinkedIn was already present |
| M6 | GA4 organic reporting blocked (no Property ID) | ✅ Property ID `546281681` obtained, saved to project notes (not the repo) |
| M7 | WhatsApp button mobile overlap; duplicate H1 | ✅ Mobile clearance added; duplicate hidden H1 downgraded to `<p>` |
| L1–L10 | Backlog | ❌ Not started |

**AEO-ANALYSIS.md rewrites** (homepage definition block, pricing passage, response-SLA passage, WhatsApp click-to-chat, Duty of Care / policy rewrites) — confirmed already live on the site from an earlier pass, verified intact during this remediation.

**How to use this doc:** items are grouped Critical → High → Medium → Low, matching the audit. Each has the file(s) to touch, the exact change, and how to confirm it worked. Where a fix must be repeated across pages, that's called out explicitly — **this site has no shared header/footer component, so footer/nav edits mean editing all 10 root `*.html` files individually**, not one partial.

Root page files (10, each with matching `dist/*.html` build output):
`index.html`, `articles.html`, `corporate-travel-management.html`, `corporate-travel-policy-template.html`, `corporate-travel-budget-south-africa.html`, `duty-of-care-business-travel.html`, `sars-online-traveller-declaration-business-travel.html`, `rtm-portal-landing.html`, `rtm-process-workflow.html`, `rtm-travel-request-form.html`.

---

## Before touching anything: commit the working tree

`git status` currently shows the entire hero-film feature (`src/hero-film.js`, `src/hero-film.css`, `public/assets/hero-film/`, `dist/assets/hero-film/`, plus modified `dist/*.html`, `src/main.js`, `src/style.css`) as **uncommitted**, and the branch itself is 5 commits ahead of `origin/main`, unpushed. The site currently live at rtmtravel.co.za matches this uncommitted working tree exactly — production has no git history and no rollback point right now.

**Do this first, before starting any item below:**
```bash
git add src/hero-film.js src/hero-film.css src/main.js src/style.css public/assets/hero-film dist/
git commit -m "Add scroll-scrubbed hero film feature"
git push origin main
```
Then work each fix below as its own commit.

---

## CRITICAL — this week

### C1. Site is not indexed by Google (0 of 10 sitemap URLs)

**Impact:** Nothing else in this brief matters until this is resolved.
**Finding:** GSC confirms `sitemap.xml` is submitted with 0 errors, and impressions exist (2,165 over the last 28 days, avg. position ~17) — so Google is crawling the site — but **0 of the 10 submitted URLs have entered the index.**

**Action:**
1. In Search Console → URL Inspection, check `https://rtmtravel.co.za/` and `https://rtmtravel.co.za/corporate-travel-management` specifically. Note whatever "Coverage" reason it reports (e.g. "Discovered — currently not indexed", "Crawled — currently not indexed").
2. Use "Request Indexing" on both.
3. This is likely *downstream* of several fixes below (thin pillar content, missing NAP/trust signals, no reviews) rather than a pure technical bug — re-check weekly rather than expecting an immediate flip.

**Verify:** GSC Coverage report shows indexed count moving above 0 within 2–4 weeks of requesting.

---

### C2. Local SEO: zero trust signal for a business built on local trust

**Impact:** Score 28/100 — the single weakest area on the site. No Google Business Profile link, no Maps embed, no review widget, no `AggregateRating`/`Review` schema, no testimonials or client logos anywhere across all 11 pages.

**Action (mix of dev + non-dev work):**
1. **Non-dev:** Client needs to claim/verify the Google Business Profile listing for the Cape Town address (already present in `index.html` JSON-LD), matching the service area already declared there (Cape Town + Johannesburg).
2. **Dev, once reviews exist:** Add `AggregateRating` to the `TravelAgency` node in `index.html`'s JSON-LD (currently `dist/index.html` lines ~44–65 equivalent in the source `index.html`).
3. **Dev:** Add a testimonials/client-proof section to the homepage — even 2–3 short quotes or logos closes most of the persona-trust gap SXO flagged across every page.

**Verify:** GBP listing live and publicly visible; `AggregateRating` validates in Google's Rich Results Test once reviews exist.

---

### C3. POPIA consent checkbox links to a Privacy Policy page that doesn't exist

**File:** `index.html`, contact form section (built output: `dist/index.html:788`)
```html
<label for="popia" class="ms-2 text-xs font-medium text-gray-400">I agree to RTM Travel processing my personal information in accordance with the Privacy Policy.</label>
```
"the Privacy Policy" is plain text — there is no `<a>` tag, and no privacy-policy page exists anywhere in the repo. This is a live compliance gap on a form that collects name/email/phone.

**Action:**
1. Create `privacy-policy.html` (matching the site's existing page pattern — see `corporate-travel-policy-template.html` for structure to copy) with a real POPIA-compliant privacy policy. Client will need to supply or approve the legal content — don't invent policy language yourself.
2. Update the label to link it:
```html
<label for="popia" class="ms-2 text-xs font-medium text-gray-400">I agree to RTM Travel processing my personal information in accordance with the <a href="privacy-policy" class="underline hover:text-white">Privacy Policy</a>.</label>
```
3. Add `privacy-policy` to `sitemap.xml` (low priority, e.g. 0.3) and to the footer "Company" links list (see C-linking note under H5 below) in all 10 root files.

**Verify:** Link resolves, page renders, checkbox label links to it.

---

### C4. `/corporate-travel-policy-template` promises a template, delivers an article

**File:** `corporate-travel-policy-template.html`
**Finding:** URL slug and every internal link anchor text ("Travel Policy Template") promise a downloadable/fillable template. The page is a 7-point explainer with a static bulleted checklist — there is no downloadable asset anywhere on it. A user who came to "get a policy written by Friday" still has to write the whole document themselves.

**Action:**
1. Produce an actual template artifact — a Google Doc/Word doc/PDF the visitor can copy or download, structured from the page's existing 7-point outline (this is largely a content task, but needs a dev-built download/gate flow).
2. Add a prominent "Download the Template" CTA above the fold, before the current explainer content (which stays as supporting material below it).
3. If gating behind email capture, this doubles as a lead-gen mechanism — check with the client whether they want gated vs. ungated.

**Verify:** Clicking the CTA actually produces a usable, fillable document — test by opening it as a first-time visitor would.

---

## HIGH — within 1 week

### H1. Blog hero images are 700KB–1.6MB plain JPEGs — mobile LCP is Poor

**Files:** `dist/assets/blog-duty-of-care-hero-*.jpg` (760KB), `blog-travel-budget-data-*.jpg` (1.6MB), `blog-travel-budget-hero-*.jpg` (1.0MB), `blog-duty-of-care-tracking-*.jpg` (875KB), `blog-travel-policy-checklist-*.jpg` (903KB), `blog-travel-policy-hero-*.jpg` (754KB)
**Finding:** PSI mobile: LCP 4.4s (Poor), Speed Index 7.3s, Lighthouse Performance 71/100. Every other image class on the site (`about-*`, `card-*`, `corp-*`) is already WebP at 60–190KB at similar dimensions — the blog hero JPEGs are the one outlier class.

**Action:**
1. Convert all `blog-*.jpg` source images to WebP (same conversion pipeline the rest of the site already uses — check whatever tool/step produced the existing WebP assets).
2. Update the `<img src="...">` references in `duty-of-care-business-travel.html`, `corporate-travel-policy-template.html`, `corporate-travel-budget-south-africa.html` to point at the new `.webp` files.
3. Add `fetchpriority="high"` to each page's above-the-fold hero `<img>` tag.

**Verify:** Re-run PageSpeed Insights (mobile) on each of the 3 article pages, confirm image payload drops from ~700KB–1.6MB to ~150–250KB and LCP moves toward Good (<2.5s).

---

### H2. Homepage hero LCP image is invisible to the browser's preload scanner

**Files:** `src/hero-film.css` (background rule), `index.html` (hero panel markup, built output `dist/index.html` around line 293)
**Finding:** The first-paint hero frame is set via inline `style="--panel-bg:url('./assets/hero-film/1280/frame_000.jpg')"` on a `.hero-panel` div, consumed by an external CSS rule. Chrome's preload scanner reads the HTML top-to-bottom looking for resources to fetch early — it cannot resolve a CSS custom property that's only consumed inside an external stylesheet, so it has to wait for CSSOM construction before it even knows this image exists. No `<link rel="preload">` exists anywhere on the site.

**Action, pick one:**
- **Simplest:** add to `<head>` of `index.html`:
```html
<link rel="preload" as="image" href="./assets/hero-film/1280/frame_000.jpg" fetchpriority="high" media="(min-width: 821px)">
<link rel="preload" as="image" href="./assets/hero-film/720/frame_000.jpg" fetchpriority="high" media="(max-width: 820px)">
```
(matches the `720`/`1280` breakpoint split already used in `src/hero-film.js:98-99`)
- **More robust:** replace the CSS-var background on the first panel with a plain `<img fetchpriority="high" src="./assets/hero-film/1280/frame_000.jpg">` positioned under the canvas, so the browser discovers it directly from HTML with no CSS indirection at all.

**Verify:** PSI mobile homepage run — LCP element should now be discovered within the first network round-trip; expect LCP improvement independent of H1's image-weight fix.

---

### H3. No footer NAP on any page; zero `tel:`/`mailto:` links site-wide

**Files:** all 10 root `*.html` files, footer section (see `duty-of-care-business-travel.html:284-322` for the block structure — it's identical across pages)
**Finding:** Phone/email/address exist only inside JSON-LD on `index.html` (and a stripped copy on `corporate-travel-management.html`, see H4). The visible footer — checked in the block below, present on every page — has zero phone, email, or address; only nav links and accreditation badges. No `tel:` or `mailto:` link exists anywhere on the entire site.

```html
<!-- current footer "Company" column, e.g. duty-of-care-business-travel.html:299-306 -->
<div>
    <h4 class="font-bold mb-4">Company</h4>
    <ul class="space-y-2 text-gray-400">
        <li><a href="/#about" class="hover:text-white transition-colors">About Us</a></li>
        <li><a href="/#services" class="hover:text-white transition-colors">Services</a></li>
        <li><a href="articles" class="hover:text-white transition-colors text-rtm-accent">Articles</a></li>
        <li><a href="/#contact" class="hover:text-white transition-colors">Contact</a></li>
    </ul>
</div>
```

**Action:** Add a NAP block to the footer of all 10 root files. Suggested — a new column or an addition under the "RTM Travel" blurb column:
```html
<div class="flex flex-col gap-2 text-gray-400 text-sm mt-4">
    <a href="tel:+27825746211" class="hover:text-white transition-colors">+27 82 574 6211</a>
    <a href="mailto:anthea@rtmtravel.co.za" class="hover:text-white transition-colors">anthea@rtmtravel.co.za</a>
    <span>Cape Town, South Africa</span>
</div>
```
Note (also flagged under Medium, M6 below): this phone number is currently the founder's personal cell doing triple duty as business-schema-phone/WhatsApp/personal line. Flag to the client whether a general enquiries line should replace it here — don't silently change the number yourself.

**Verify:** Footer on every one of the 10 pages shows a clickable phone and email; tapping `tel:`/`mailto:` triggers the native app on mobile.

---

### H4. `corporate-travel-management.html` duplicates an incomplete business schema entity

**File:** `corporate-travel-management.html`, JSON-LD block (built output `dist/corporate-travel-management.html:44-65`)
**Finding:** This page redeclares its own `TravelAgency` node sharing `@id: https://rtmtravel.co.za/#business` with the homepage — but it's a stripped-down copy: missing `address`, `geo`, `openingHoursSpecification`, `sameAs`, `memberOf` (drops the ASATA/IATA membership entirely), `makesOffer`, `award`, `priceRange`; and `areaServed` collapses from the homepage's Cape Town + Johannesburg to just `"South Africa"`. Google evaluates JSON-LD per page, not merged across the site by matching `@id` — so this page currently presents an incomplete entity to crawlers, and actively contradicts the homepage's fuller version.

Current block to remove (lines 44-65 in the build; find the equivalent in source `corporate-travel-management.html`):
```json
{
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  "@id": "https://rtmtravel.co.za/#business",
  "name": "Remmitz Travel Management",
  "alternateName": "RTM Travel",
  "url": "https://rtmtravel.co.za/",
  "logo": "https://rtmtravel.co.za/assets/Logo.png",
  "description": "...",
  "telephone": "+27825746211",
  "email": "anthea@rtmtravel.co.za",
  "areaServed": { "@type": "Country", "name": "South Africa" },
  "founder": { "@type": "Person", "name": "Anthea Ronne" },
  "foundingDate": "2008",
  "knowsAbout": [...]
}
```

**Action:** Delete this entire object from the JSON-LD array on this page. The page's `Article` object already correctly references `"publisher": {"@id": "https://rtmtravel.co.za/#business"}` — that's the right pattern, matching how the other four article pages (duty-of-care, policy-template, budget, SARS) already do it. No replacement object needed; the reference alone is sufficient.

**Verify:** Validate the page in Google's Rich Results Test post-fix — should show one clean `Article` entity referencing the business, no duplicate/conflicting `TravelAgency` node.

---

### H5. Pillar page has zero contextual links to its own named spokes; SARS article is a link orphan

**Files:** `corporate-travel-management.html` (pillar), footer block in all 10 root files, `duty-of-care-business-travel.html`, `corporate-travel-policy-template.html`

**Finding A — pillar → spoke:** `corporate-travel-management.html`'s "4 Pillars" section names Policy & Compliance, Duty of Care & Risk, and Spend Visibility explicitly — but links to none of the matching spoke articles in-body. The only path from pillar to spokes is the generic sitewide footer list, with no topical anchor text.

**Finding B — SARS orphan:** `sars-online-traveller-declaration-business-travel.html` is missing from the footer "Resources" list on every page (see the block quoted under H3 — it lists Guide/Duty of Care/Policy Template/Budget, never SARS), has no in-body "related content" block of its own, and no other article links to it despite direct topical overlap with Duty of Care (both are "what SA employers must legally do"). It's the newest, most time-sensitive compliance page on the site and currently the worst-linked.

**Action:**
1. In `corporate-travel-management.html`, add an inline link from each "4 Pillars" card to its matching spoke page — e.g. the Policy & Compliance card links to `corporate-travel-policy-template`, Duty of Care & Risk links to `duty-of-care-business-travel`, Spend Visibility links to `corporate-travel-budget-south-africa`.
2. In all 10 root files' footer "Resources" list, add the SARS article as a 5th item:
```html
<li><a href="sars-online-traveller-declaration-business-travel" class="hover:text-white transition-colors">SARS Traveller Declaration</a></li>
```
3. In `duty-of-care-business-travel.html`, add one reciprocal in-body link to the SARS article (natural framing: "your policy needs updating for the new SATMS requirement — see our guide to the SARS traveller declaration").

**Verify:** Crawl the site with a link checker (or manually trace each page); SARS article should have inbound links from at least 2 other content pages plus the footer, not just `articles.html`.

---

## MEDIUM — within the month

### M1. FAQ content on 4 pages has no `FAQPage` schema

**Files:** `index.html`, `corporate-travel-management.html`, `corporate-travel-policy-template.html`, `corporate-travel-budget-south-africa.html` — each renders a visible Q&A block. Only `sars-online-traveller-declaration-business-travel.html` currently has `FAQPage` JSON-LD.

**Important framing — don't oversell this to the client:** Google retired FAQ rich results for commercial (non-government/healthcare) sites, so this markup produces **no Google SERP snippet benefit**. The reason to still do it is AI answer-engine citability (ChatGPT, Perplexity, AI Overviews don't share that restriction) — treat it as a GEO/AI-visibility play, not an SEO-rankings play.

**Action:** Add `FAQPage` JSON-LD to the 4 pages, mirroring the structure already used correctly on the SARS page. Use the visible on-page Q&A text as the `Question`/`acceptedAnswer` pairs — don't write new copy, just wrap what's already rendered.

**Verify:** Validates in Google's Rich Results Test (as valid markup, even though it won't produce a SERP feature).

---

### M2. Pillar page is the thinnest page on the site despite its "Complete Guide" framing

**File:** `corporate-travel-management.html`
**Finding:** ~780–900 words against its own "complete guide" positioning, and against three of the five article pages that beat it on length. Missing: a real client outcome/case study, an onboarding/switching-TMC section, comparison to alternatives (in-house booking vs. OTA vs. TMC — the page's own FAQ already answers a version of this in one paragraph, worth expanding into a proper section or table).

**Action:** Expand toward 1,400–1,800 words — content task, coordinate with whoever owns copy. Also: the "15–20% annual savings" statistic repeats verbatim across homepage, this page, and the budget page with no citation. Either source it or, if it's RTM's own client-average, say so explicitly ("across RTM Travel's client base") rather than presenting it as an unattributed industry fact — this is a one-line copy fix, flag it alongside the content expansion.

---

### M3. No Content-Security-Policy header

**Finding:** HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, and Permissions-Policy are all correctly set already (confirmed via live header check) — CSP is the one gap. Non-trivial here because the site uses inline `<script>` blocks for analytics and JSON-LD.

**Action:** Audit every inline `<script>` tag across the 10 pages first (JSON-LD blocks, GTM/analytics snippet, any inline handlers), then add a CSP via server config (`.htaccess` on this cPanel host) that permits what's actually in use:
```apache
Header set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' www.googletagmanager.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src fonts.gstatic.com; img-src 'self' data:; connect-src 'self'"
```
Start in report-only mode if possible (`Content-Security-Policy-Report-Only`) before enforcing, to catch anything missed.

---

### M4. Three sitemap-listed utility pages have no canonical tag or schema

**Files:** `rtm-portal-landing.html`, `rtm-process-workflow.html`, `rtm-travel-request-form.html` — all three are in `sitemap.xml` at priority 0.6 but ship with only a `<title>` and viewport meta, no canonical, no meta robots, no JSON-LD.

**Action — decide intent first:** are these meant to be publicly discoverable marketing pages, or client-only portal/tool pages?
- If public: add a self-referencing `<link rel="canonical">` to each, matching the pattern on every other page, plus a minimal `WebPage` JSON-LD referencing `"publisher": {"@id": "https://rtmtravel.co.za/#business"}`.
- If client-only: add `<meta name="robots" content="noindex">` to each and remove them from `sitemap.xml` instead.

---

### M5. Homepage schema is missing the company's own social profiles

**File:** `index.html` JSON-LD, `sameAs` array
**Finding:** Currently lists ASATA, IATA, and the founder's personal LinkedIn only. A company LinkedIn page ("RTM Travel: Simplifying Corporate Travel for Business Success") and an Instagram account both exist per an open search but aren't declared.

**Action:** Add both URLs to the `sameAs` array on the homepage `TravelAgency` node. Confirm the exact URLs with the client before adding — don't guess handles.

---

### M6. GA4 organic-traffic reporting is blocked on a missing property ID

**Finding:** Only the Measurement ID (`G-XBPC12M3JF`, visible in the `gtag.js` snippet in `index.html`) is on record anywhere — the GA4 Data API needs the separate numeric Property ID, which isn't written down anywhere in the repo or client files. This isn't a dev fix so much as a "go find this number" task.

**Action:** In GA4 Admin → Property Settings → Property details, copy the numeric Property ID. Record it in the client's project notes once found (not in this repo).

---

### M7. Fixed WhatsApp button overlaps body text on mobile; duplicate H1 in DOM

**Files:** WhatsApp link is in `index.html` (built output `dist/index.html:861`, `<a href="https://wa.me/27825746211...">`); duplicate H1 is the hidden "classic" hero variant, present alongside the visible scroll-film hero on `index.html`.

**Finding A:** On 375px mobile viewports, the fixed-position WhatsApp bubble overlaps scrolling article body copy — confirmed covering part of the word "Occupational" in the first paragraph of the Duty of Care article.

**Finding B:** The homepage DOM contains two `<h1>` elements — the visible scroll-film heading, and a second "Corporate Travel Management Cape Town" H1 belonging to the hidden `#hero-section-classic` variant (0×0 rect, `opacity:0`). Not a visual bug since only one shows at a time, but duplicate H1s are worth cleaning up.

**Action:**
1. Add bottom-right padding/clearance to article body text containers on mobile, or reduce the WhatsApp button's z-index reach, or nudge its position up.
2. Either remove the dead `#hero-section-classic` block and its `#hero-version-toggle` A/B toggle entirely (see L7 below — same code path), or, if keeping the toggle for now, change the hidden variant's H1 to a non-`<h1>` element until it's actually shown.

---

## LOW — backlog

| Area | Finding | Fix |
|---|---|---|
| Schema | SARS page canonical has no trailing slash; its `@id`/`mainEntityOfPage` do (`sars-online-traveller-declaration-business-travel/` vs. no slash) | Normalize both to match the canonical, no trailing slash |
| Schema | 4 pages use `Article`, 1 (SARS) uses `BlogPosting` | Standardize on one `@type` site-wide |
| Schema | Homepage logo (`assets/Logo.png`) is 1672×941, non-square | Add a square logo variant for Knowledge Panel eligibility |
| Schema | ASATA/IATA `sameAs` links point to the generic org homepages, not RTM's own member-profile pages | Swap in RTM's specific accreditation-lookup URLs on those directories once located — real third-party citation value |
| Sitemap | `lastmod` batch-set to one date across 9 of 10 URLs (`2026-07-20`/`21`) rather than tied to real edits | Tie sitemap generation to actual per-page content-change dates going forward |
| Sitemap | `priority`/`changefreq` present but ignored by Google | Safe to drop from the sitemap generator — no functional harm either way |
| Performance | Hero-film JPEGs: ~22MB across 722 frames (361 × 2 breakpoints) in `dist/assets/hero-film/` | Re-encode as WebP/AVIF, ~25–40% smaller at equal quality, same frame-loading logic in `src/hero-film.js` unaffected |
| Performance | `gsap`/`ScrollTrigger` (`src/main.js:3-7`) plus the hero-film module ship in the shared bundle loaded on every page, but only the homepage uses them | Dynamic-`import()` the hero-film + GSAP registration only when `#hero-section` exists on the current page, or Vite-split into a homepage-only chunk |
| Hygiene | Dead `#hero-section-classic` (40-frame canvas hero, separate code path in `main.js`) + `#hero-version-toggle` A/B widget ship in every page's production DOM (`display:none`-gated, confirmed it doesn't fetch assets) | Strip both before final hand-off unless the A/B test is still active |
| Mobile UX | Hamburger menu (40×40px), hero "Scroll Film/Classic" toggle pills (~28px), header "Get a Quote" CTA (40px height) — all under the 44–48px WCAG/Apple touch-target guidance | Bump padding on all three |
| Backlinks | Domain isn't yet in Common Crawl's web graph; no Moz or Bing Webmaster key configured — link profile is unscored, not "clean" | Register a free Moz API key (2,500 rows/month) for DA/PA visibility; re-check Common Crawl at their next quarterly release |

---

## Content strategy note (not a dev task, flagging for planning)

Two of the site's three implicit topic clusters (Policy, Budget) currently have only one article each — not yet real clusters. Five candidate expansion topics were identified with natural interlink paths into the existing structure, in priority order:
1. **Travel & Expense Management/Reporting** — closes the loop with the existing Budget spoke
2. **Travel Risk Management (ISO 31030)** — sister cluster to Duty of Care, more operational/tactical
3. SARS Travel Allowance & Tax Logbook Compliance (distinct from the existing SATMS declaration article)
4. Corporate Travel Policy Enforcement / Approval Workflows
5. TMC Procurement/RFP — commercial-intent, currently a gap in the mostly-informational content set

Prioritize #1 and #2 first — they extend existing spokes into real clusters with the least new pillar rework.

---

## Sequenced roadmap

| When | Do | Depends on |
|---|---|---|
| Day 1 | Commit & push the hero-film feature (see top of doc) | Nothing — do this before any other change |
| Week 1 | C3 (privacy policy + link it), C4 (policy template download) | Content/legal input from client |
| Week 1 | C1 (request indexing), H3 (footer NAP), H4 (dedupe schema), H5 (internal links) | Independent, can run in parallel with above |
| Week 1–2 | C2 (GBP claim + review flow) — mostly client-side, dev adds `AggregateRating` once reviews land | Client action first |
| Week 2 | H1 (image conversion), H2 (LCP preload) | Independent — pure performance sprint |
| Week 3–4 | M1 (FAQPage schema), M2 (pillar expansion), M4 (utility page canonicals), M5 (sameAs) | Bundle into one content+schema pass |
| Ongoing | M3 (CSP), M6 (GA4 ID), M7 (WhatsApp overlap, dup H1), Low-priority backlog | No hard deadline |

---

*Brief generated from a 12-agent SEO audit of rtmtravel.co.za, 12 Aug 2026.*

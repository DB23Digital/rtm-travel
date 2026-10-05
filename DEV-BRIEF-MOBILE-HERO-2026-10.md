# RTM Travel — Developer Brief

**Project:** rtmtravel.co.za
**Date:** 5 October 2026
**Audited against:** commit `e516e4d` ("Implement the 2026-09-02 SEO build brief") and the live site
**Supersedes:** nothing. This is additive to `DEV-BRIEF-SEO-AEO-GEO-2026-09.md`, which is now almost entirely implemented.

---

## 1. Summary

The September brief has shipped. Thirteen of its fifteen tickets are verified complete in the repo and live: image optimisation, the download gate, `sameAs`, the social card, `lang="en-ZA"`, the 404 page, the sitemap rebuild, author blocks, internal linking, four service pages, the in-house-vs-TMC comparison page and the Johannesburg page. Every URL in `sitemap.xml` resolves to a built file, and the Vite input list matches the pages in the repo.

This brief covers eight remaining items:

| ID | Title | Impact | Effort | Status |
|---|---|---|---|---|
| RTM-18 | Route mobile to the classic hero | High | S | New |
| RTM-21 | Silent-failure paths in `download.php` | Med | S | New |
| RTM-19 | Stop the classic hero preloading 40 frames on mobile | Med | S | New |
| RTM-16 | Remove the contradictory location data | Med | S | Carried over |
| RTM-17 | Business name is backwards in schema | Low | S | Carried over |
| RTM-20 | Remove or hide the public A/B hero toggle | Low | S | New |
| RTM-22 | 403 page for blocked downloads is a raw Apache error | Low | S | New |
| RTM-15 | Decide on the three portal pages | Low | S | Needs a business decision, not a developer |

Total is roughly a day of work.

---

## 2. Download gate — test results

The gate was submitted live on 5 October to verify it end to end.

| Check | Result | Notes |
|---|---|---|
| Form present, mid-article and end of article | PASS | Both render, three fields plus consent checkbox |
| POST accepted, lead captured | PASS | HTTP 200, success payload returned |
| Form hides, success state shows | PASS | Handler in `src/main.js` behaves correctly |
| Signed download links generated | PASS | Both Word and printable versions, one-hour TTL |
| Old ungated URL blocked | PASS | 403 from `public/downloads/.htaccess` |
| Consent enforced server-side | PASS | Rejected when the box is not ticked |
| Email delivered to anthea@ | UNVERIFIED | Server-side, needs cPanel or inbox access |
| CSV row written | UNVERIFIED | Server-side, see RTM-21 |

**Action for whoever has cPanel access:** confirm the email arrived and the CSV row was written. There is one test row to delete, under the name `Internal Test - please delete` / `test@rtmtravel.co.za`.

---

## 3. RTM-18 — Route mobile to the classic hero

**Impact: High · Effort: S · Files: `index.html` (one line)**

### The problem

The scroll-film hero loads a JPEG frame sequence from `assets/hero-film/`:

| Set | Files | Total | Served to |
|---|---|---|---|
| `hero-film/1280/` | 361 | 14,250 KB | Screens wider than 820px |
| `hero-film/720/` | 361 | 6,359 KB | Screens 820px and narrower |

Every mobile visitor currently downloads **6.2 MB across 361 requests** before the hero is usable.

### Why this is a one-line change

Everything needed already exists:

- `index.html` line 7 sets `document.documentElement.dataset.hero` in a pre-paint inline script, so there is no flash of the wrong hero.
- `src/main.js` line 12 reads that attribute and only calls `mountHeroFilm()` when it is `film`.
- `src/style.css` lines 32–38 already hide whichever hero is not selected:

```css
html[data-hero="film"] #hero-section-classic { display: none; }
html[data-hero="classic"] #hero-section      { display: none; }
```

So setting `data-hero="classic"` on mobile is sufficient. No markup changes, no new CSS.

### The change

In `index.html`, replace line 7:

```js
// BEFORE
document.documentElement.dataset.hero = new URLSearchParams(location.search).get('hero') === 'classic' ? 'classic' : 'film';
```

```js
// AFTER
(function () {
  var forced = new URLSearchParams(location.search).get('hero');
  var narrow = window.matchMedia('(max-width: 820px)').matches;
  // ?hero=film stays available so the film can still be QA'd on a phone.
  document.documentElement.dataset.hero =
    forced === 'classic' || (forced !== 'film' && narrow) ? 'classic' : 'film';
})();
```

**Why 820px:** it matches the `isNarrow` breakpoint already used in `src/hero-film.js` line 98 to choose between the 720 and 1280 frame sets. Keeping them identical stops the two drifting apart later.

### Bonus fix, no extra work

The five hero panels in `index.html` (lines ~301–360) carry inline styles hardcoded to the **desktop** frame set:

```html
<div class="hero-panel" data-chapter-index="1"
     style="--panel-bg:url('./assets/hero-film/1280/frame_116.jpg')">
```

On mobile those five 1280-wide stills were being fetched on top of the 720 stream. Because `#hero-section` becomes `display: none` in classic mode, the entire subtree is removed from layout and browsers do not fetch background images inside it. This resolves automatically. No separate ticket needed.

### Acceptance criteria

- On a 390px viewport, the Network panel shows **zero** requests to `assets/hero-film/`.
- The classic hero renders immediately, with no flash of the scroll film.
- `?hero=film` still forces the film on a phone, for QA.
- `?hero=classic` still works on desktop.

---

## 4. RTM-19 — Stop the classic hero preloading 40 frames on mobile

**Impact: Med · Effort: S · Files: `src/main.js` (classic hero block, around lines 24–60)**

### The problem

The classic hero preloads `ezgif-frame-001.jpg` through `ezgif-frame-040.jpg` from the site root and scrubs them on scroll. That is **1,624 KB**. On desktop it is a fair trade. On mobile, RTM-18 would simply replace a 6.2 MB problem with a 1.6 MB one.

### The change

Frame 1 is what a visitor sees before scrolling anyway, so render it and stop. In the `loadFrame` function's `i === 0` branch, gate the preload:

```js
// after the existing GSAP title/subtitle/CTA reveal
if (!window.matchMedia('(max-width: 820px)').matches) {
    var preloadRemainingFrames = function () {
        for (var next = 1; next < frameCount; next++) loadFrame(next);
    };
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(preloadRemainingFrames, { timeout: 1500 });
    } else {
        // existing fallback
    }
}
```

**Also:** do not create the scroll-scrub ScrollTrigger for `#hero-canvas-classic` under the same breakpoint. If it is created, it will scrub against frames that were never loaded and sit on frame 1 regardless, which wastes a scroll listener for no visual effect.

### Result

Mobile hero payload after RTM-18 and RTM-19: roughly **45 KB**, down from 6.2 MB.

### Acceptance criteria

- A 390px viewport requests exactly one `ezgif-frame-*.jpg`.
- The hero still shows its title, subtitle and CTA with the reveal animation intact.

---

## 5. RTM-21 — Silent-failure paths in `download.php`

**Impact: Med · Effort: S · Files: `public/download.php`**

To be clear up front: `download.php` is good work. HMAC-signed short-lived links, a honeypot field, server-side consent enforcement, `flock` on the CSV, and the asset moved behind Apache denial. These are three refinements, not a rewrite. All three share a property: when they fail, nobody finds out.

### 5.1 Mail failures are invisible

```php
@mail(RECIPIENT, "Template download: $name ($company)", $body, "...");
```

The error suppression operator discards any warning and the return value is never checked. A misconfigured or bouncing mail server would still show the visitor "thank you", and the notification would simply never arrive.

**Fix:** capture the return value. On `false`, append a line to a log file in the private directory. The lead is still safely in the CSV, but somebody needs to know the notification did not go out.

### 5.2 The signing secret can rotate itself

```php
$secret = bin2hex(random_bytes(32));
@file_put_contents($file, $secret, LOCK_EX);
```

If that write fails, every request mints a **fresh** secret. A link signed during the POST then fails `hash_equals()` during the GET, and every download returns 403. The links worked in today's test, so the key is persisting on the current server, but the failure mode would be silent and total.

**Fix:** check the `file_put_contents` return value and log on failure.

### 5.3 The private directory can land inside the web root

```php
$candidates = [
    dirname($_SERVER['DOCUMENT_ROOT'] ?? __DIR__) . '/rtm-private',
    dirname(__DIR__) . '/rtm-private',
    __DIR__ . '/rtm-private',   // <-- this one is inside the web root
];
```

In the third fallback, `template-leads.csv` — containing names, work emails and IP addresses — would sit at a publicly reachable path. Nothing in `.htaccess` blocks `/rtm-private/`. That is a POPIA exposure, not just a bug.

**Fix, both parts:**

1. Confirm on the server which candidate actually resolved. If it is the third, move it.
2. Regardless of the answer, have the script write a `.htaccess` containing `Require all denied` into the private directory when it creates it. Belt and braces, costs nothing.

### Acceptance criteria

- Mail failures and key-write failures each leave a log line.
- The resolved private directory is confirmed to be outside the web root, or explicitly denied by `.htaccess`.

---

## 6. RTM-16 — Remove the contradictory location data

**Impact: Med · Effort: S · Files: `index.html` JSON-LD, plus the footer block repeated on every page**

### The problem

The site asserts a location that no other source corroborates.

| Source | Location |
|---|---|
| Site schema + footer | Cape Town, Western Cape, **8001**, `geo: -33.9249, 18.4241` (CBD) |
| Dun & Bradstreet | Bergvliet, Cape Town, **7945** |
| B2BHint | Bergvliet, Cape Town, **7945** |
| iVote | Bergvliet, Cape Town |
| Google Business Profile | No street address — configured as a service-area business |

The coordinates currently point at Adderley Street in the CBD, roughly 15 km from the registered address. NAP consistency is what local ranking rests on, and this is the one place it breaks.

### Important

**Do not publish the street address.** The registered address appears to be residential, which is exactly why the Business Profile is correctly set up as a service-area business. That configuration should stay. The fix is to stop the *site* asserting a pinpoint that nothing supports.

### The change

In the `TravelAgency` JSON-LD block:

- Remove the `geo` object entirely. A service-area business does not need coordinates, and wrong coordinates are worse than none.
- Remove `"postalCode": "8001"` from the `PostalAddress`.
- Keep `addressLocality`, `addressRegion` and `addressCountry` as they are.

In the footer block:

- Change `Cape Town, Western Cape, 8001, South Africa` to `Cape Town, Western Cape, South Africa`.
- The rest of the footer NAP is already locality-level and correct.

Separately, confirm the Business Profile's service area lists Cape Town, Johannesburg and South Africa, matching `areaServed` in the schema.

### Acceptance criteria

- No page asserts a postal code or geographic coordinates.
- Footer reads locality-level on every page.

---

## 7. RTM-17 — Business name is backwards in schema

**Impact: Low · Effort: S · Files: `index.html` JSON-LD and the footer Google link**

The Google Business Profile trades as **RTM Travel**. The schema says:

```json
"name": "Remmitz Travel Management",
"alternateName": "RTM Travel",
```

The website brands itself RTM Travel throughout, and Google's naming guidance is to use the name as it appears on the site and signage. The profile is right; the schema has it the wrong way round.

```json
"name": "RTM Travel",
"legalName": "Remmitz Travel Management CC",
"alternateName": "Remmitz Travel Management",
```

Keep the legal name present. It is what matches the directory citations and the City of Cape Town tender records, which are genuine corroborating sources.

While in the same block, swap the Google entry in `sameAs` for the canonical profile URL, which is more stable than the `kgmid` search form currently there:

```json
"https://maps.google.com/?cid=11112407251051318975"
```

Update the footer "Google" link to the same URL.

### Acceptance criteria

- Rich Results Test passes with no errors.
- Profile name, schema `name` and visible site branding all read RTM Travel.

---

## 8. RTM-20 — Remove or hide the public A/B hero toggle

**Impact: Low · Effort: S · Files: `index.html` lines ~220–233**

`#hero-version-toggle` renders a visible Film / Classic switcher on the live homepage. It was built for side-by-side client review and is still showing to every visitor. A public version-switcher on a client site reads as unfinished.

Either remove it, or keep it behind the query string so it only appears when `?hero=` is present:

```css
#hero-version-toggle { display: none; }
```

...and show it from the same inline script when `forced` is truthy.

**The underlying `?hero=` mechanism must stay either way.** RTM-18 depends on it and it is the QA escape hatch.

### Acceptance criteria

- A normal visitor to the homepage sees no version switcher.
- `?hero=film` and `?hero=classic` both still work.

---

## 9. RTM-22 — 403 page for blocked downloads is a raw Apache error

**Impact: Low · Effort: S · Files: `public/downloads/.htaccess`**

Hitting the old ungated URL now returns Apache's default Forbidden page, plus a second line admitting it could not load the custom error document. That happens because the `ErrorDocument` it wants to serve sits inside the directory that denies everything. Anyone who bookmarked the old link sees it.

Add to `public/downloads/.htaccess`:

```apache
ErrorDocument 403 /corporate-travel-policy-template
```

That path is outside the denied directory, so Apache can read it, and it lands the visitor on the page with the form rather than on an error.

### Acceptance criteria

- The old URL sends a visitor to the gated article rather than an Apache error page.

---

## 10. RTM-15 — Decide on the three portal pages

**Impact: Low · Effort: S · Owner: Deon and Anthea, not the developer**

`rtm-portal-landing.html`, `rtm-process-workflow.html` and `rtm-travel-request-form.html` are built, carry `noindex, nofollow`, and are linked from nowhere. That is defensible for client-only tools, but it has been the status quo by default for two months rather than by decision.

The argument for publishing `rtm-process-workflow`: the four new service pages describe the service without showing the mechanism, and "how it actually works" is the last thing a prospect checks before enquiring.

### Acceptance criteria

- The decision is recorded in the repo.
- Anything made public is indexable, added to `sitemap.xml`, and linked from the nav.

---

## 11. Suggested order

| # | Ticket | Why this order |
|---|---|---|
| 1 | RTM-18 | One line, largest effect. Ship on its own so the Core Web Vitals change is attributable |
| 2 | RTM-21 | Confirm where the private directory resolved before more leads accumulate in it |
| 3 | RTM-19 | Finishes the mobile hero work started in RTM-18 |
| 4 | RTM-16, RTM-17 | Schema and footer, same files, one pass |
| 5 | RTM-20, RTM-22 | Cosmetic, bundle with whatever ships next |
| 6 | RTM-15 | Blocked on a business decision |

---

## 12. Please do not

These come up repeatedly and are worth stating, since they consume budget without returning anything. Per Google's generative-AI search guidance (last updated 15 June 2026), AI Overviews and AI Mode run on the same core Search ranking systems, so there is no separate AEO or GEO layer to optimise for.

- **Do not expand `llms.txt`.** There is one in `public/`. Google Search does not use it. Harmless to leave, but not worth maintaining.
- **Do not add more schema.** The markup is strong and RTM-17 is the last change to it. There is no schema type that unlocks an AI Overview.
- **Do not build more regional pages.** The Johannesburg page was the one legitimate regional build. Durban, Pretoria and Gqeberha versions of the same page would fall under Google's scaled content abuse policy.
- **Do not rewrite the September pages.** Eleven pages went live last month. Let them be crawled, indexed and measured first.

---

## 13. How to verify after deploy

| Signal | Where | What to look for |
|---|---|---|
| Hero payload | DevTools Network, 390px viewport | Zero `hero-film/` requests, one `ezgif-frame-*.jpg` |
| Core Web Vitals | Search Console → Experience, filtered to mobile | Movement roughly two weeks after RTM-18 ships |
| Indexed pages | Search Console → Pages | All 14 sitemap URLs indexed, three portal pages correctly excluded |
| Rich results | Search Console → Enhancements | FAQ and Breadcrumb valid, zero errors |
| Structured data | Rich Results Test | No errors after RTM-16 and RTM-17 |
| Gate | The leads CSV | A real submission lands, and the test row has been removed |

Indexing and serving are never guaranteed, even when everything is correct. RTM-18 is the one change here with a clean before-and-after number, so it is worth capturing the mobile Core Web Vitals figure before it ships.

---

## Reference: repo map

| Path | Role |
|---|---|
| `index.html` line 7 | Pre-paint `data-hero` script — RTM-18 |
| `index.html` ~220–233 | A/B hero toggle — RTM-20 |
| `index.html` ~301–360 | Hero panels with hardcoded 1280 backgrounds |
| `index.html` JSON-LD | `TravelAgency`, `WebSite` — RTM-16, RTM-17 |
| `src/main.js` line 12 | `heroMode` selection |
| `src/main.js` ~24–60 | Classic hero block — RTM-19 |
| `src/main.js` ~147 | Contact form handler |
| `src/main.js` ~272 | Download gate fetch |
| `src/hero-film.js` line 98 | `isNarrow` breakpoint, 820px |
| `src/style.css` 32–38 | Hero show/hide rules |
| `public/download.php` | Gate endpoint — RTM-21 |
| `public/downloads/.htaccess` | Asset denial — RTM-22 |
| `public/.htaccess` | HTTPS, www, clean URLs, cache, security headers |
| `public/sitemap.xml` | 14 URLs, dates current |
| `vite.config.js` | Build inputs, matches the repo |

Build and deploy unchanged: `npm run build`, then sync `dist/` to cPanel.

# RTM Travel Project Feedback

## Latest Update — 20 July 2026

Implemented the developer-facing items from `DEV-IMPLEMENTATION-BRIEF.md` (20 July 2026 audit cycle, in `DB23 AI Agency/seo-aeo-geo-skills/clients/rtm-travel/`), which superseded the 7 July `DEV-IMPLEMENTATION-SPEC.md` — most of that earlier spec had already shipped.

### Implemented changes

- **Critical:** Fixed trailing-slash URLs returning HTTP 500 — added a dedicated strip-trailing-slash rewrite rule in `public/.htaccess` before the clean-URL block.
- **Critical:** Added a visible author byline (`Anthea Ronne, Owner & CEO`) to all four article pages, including a new byline row on `corporate-travel-management.html`, which previously had none.
- **High:** Fixed `author` schema on `corporate-travel-policy-template.html` and `corporate-travel-budget-south-africa.html` from a generic `Organization` to a proper `Person` (Anthea Ronne) matching the pattern already used elsewhere.
- **High:** Added the missing `image` field to the `corporate-travel-management` Article schema (using the page's real hero image, not a placeholder).
- **High:** Converted `assets/departure.jpeg` (895 KB) to `assets/departure.webp` (86 KB) via ffmpeg and updated the homepage reference.
- **Medium:** Added `Strict-Transport-Security` and `Permissions-Policy` headers to `.htaccess`.
- **Medium:** Added `loading="lazy"` to every below-the-fold image site-wide (kept hero/LCP images and nav logos eager).
- **Medium:** Updated `sitemap.xml` `lastmod` dates (previously frozen at 2026-05-27) to the current deploy date.
- **Medium:** Shortened two SERP-truncating `<title>` tags (duty-of-care and travel-policy-template pages).
- **Medium:** Consolidated schema `publisher`/`worksFor` blocks across all article pages onto a single `@id` reference (`https://rtmtravel.co.za/#business`), added `award`, `memberOf` URLs, and a `makesOffer`/`Service` catalog to the homepage `TravelAgency` entity, and added a site-level `WebSite` entity.
- Not implemented (flagged as content/copy or ops work, not dev): downloadable travel-policy template asset (2.4), testimonial/case-study content (2.5), server-side charset verification for the mojibake issue (3.5), AEO passage rewrites (3.7) — these need client/content input or server-side (not source) changes.

### Validation completed

- `npm run build` passes with Vite 5.4.21.
- All JSON-LD blocks across all 6 templated pages parse successfully.
- No `FAQPage` schema present anywhere (confirmed still absent, per the "do not touch" list in the brief).
- All nine public pages retain the WhatsApp CTA.
- `.htaccess` trailing-slash and security-header rules verified present in `dist/.htaccess`.

### cPanel deployment package

The current upload-ready archive is `rtmtravel-cpanel-seo-2026-07-20.zip` (also copied to `DB23 AI Agency/seo-aeo-geo-skills/clients/rtm-travel/`):

- Size: ~11.9 MB, 86 entries, 10 HTML pages (includes the Google Search Console verification file), 17 WebP assets.
- Site files sit at the archive root; no `dist/` wrapper.
- A stray `.git` directory was found inside `dist/` (leftover from a prior `npm run deploy` / gh-pages run) and was removed before zipping — it was not included in either this or the prior archive.

### Repository state

The repo checkout still has extensive uncommitted/untracked work from prior sessions; these changes were made directly in the working tree and were not committed, consistent with prior practice on this project.

## Previous Update — 13 July 2026

The SEO, AEO, local-search, conversion, and performance changes defined in `seo_work/DEV-IMPLEMENTATION-SPEC.md` have been implemented in the website source and rebuilt into `dist/`.

### Implemented changes

- Updated `robots.txt` to allow search-oriented AI crawlers and block the specified training-only crawlers.
- Replaced the SPA fallback in `.htaccess` with clean `.html` redirects, internal clean-URL rewrites, and proper 404 handling.
- Updated `sitemap.xml` to use clean URLs and added the portal landing, process workflow, and travel request pages. The sitemap now contains nine unique URLs.
- Localized the homepage title and primary heading for corporate travel management in Cape Town and South Africa.
- Added Cape Town address, coordinates, operating hours, service areas, founder identity, accreditation, and entity links to the homepage `TravelAgency` schema.
- Removed all deprecated `FAQPage` structured data while preserving visible FAQ content.
- Assigned the corporate travel management and duty-of-care guides to Anthea Ronne using `Person` authorship schema.
- Added the approved AEO passages for corporate travel management, transaction pricing, duty of care, and corporate travel policy savings.
- Added the under-five-minute response statement to the homepage contact section.
- Added a floating WhatsApp CTA to all nine public pages, linked to `+27 82 574 6211` with a pre-filled corporate-services enquiry.
- Updated internal links and canonical/schema URLs to use clean routes.
- Added explicit `width` and `height` attributes to every public-page image.
- Converted 16 large header and card images to WebP. The converted set reduced from 13,775,770 bytes to 1,695,436 bytes, saving 12,080,334 bytes.
- Changed the hero animation so only its first frame loads on the critical rendering path; the remaining frames preload during browser idle time. Canvas resizing is also animation-frame throttled.

### Validation completed

- `npm run build` passes successfully with Vite 5.4.21.
- All JSON-LD blocks parse successfully.
- All nine public pages contain the WhatsApp CTA.
- No `FAQPage` schema remains.
- Every public-page image has explicit dimensions.
- All referenced local assets exist.
- The sitemap contains nine unique URLs.
- The clean-URL rewrite and single 404 error directive are present in `.htaccess`.
- The production build includes `.htaccess`, `index.html`, `robots.txt`, `sitemap.xml`, `contact.php`, all nine public HTML pages, and the optimized assets.

### cPanel deployment package

The current upload-ready archive is:

`rtmtravel-cpanel-seo-2026-07-13.zip`

Archive verification:

- Size: 12,671,103 bytes
- Entries: 85
- HTML pages: 9
- WebP assets: 16
- Site files are at the archive root with forward-slash paths.
- `.htaccess`, `robots.txt`, `sitemap.xml`, `index.html`, and `contact.php` are included.
- No `dist/` wrapper folder or `.git` content is included.

Upload and extract the archive directly into the cPanel document root. After deployment, verify the homepage, a clean article URL, a deliberately missing URL, the WhatsApp link, `robots.txt`, and `sitemap.xml` on the live domain.

### Repository state

The checkout already contained extensive uncommitted and untracked work before this implementation. The SEO changes were not committed because the repository is on `main`; unrelated existing changes were preserved.

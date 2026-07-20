# Full Website SEO Audit — rtmtravel.co.za
**Client:** RTM Travel — Professional Business Travel Consultant and Management  
**Service Area:** Cape Town, South Africa, Global Services  
**Analysis Date:** 7 July 2026  
**Auditor Framework:** seo-audit skill v2.0.0 (June 2026 ruleset)  

---

## Executive Summary

### Overall SEO Health Score: 71 / 100

| Category | Weight | Score (0-100) | Weighted Contribution |
|---|---|---|---|
| Technical SEO | 22% | 80 | 17.60 |
| Content Quality | 23% | 75 | 17.25 |
| On-Page SEO | 20% | 70 | 14.00 |
| Schema & Structured Data | 10% | 60 | 6.00 |
| Performance (CWV) | 10% | 70 | 7.00 |
| AI Search Readiness | 10% | 60 | 6.00 |
| Images | 5% | 60 | 3.00 |
| **Total** | **100%** | | **≈71/100** |

**Interpretation:** **Developing.** The site has a solid, modern front-end foundation built on Vite and Tailwind CSS. It is prerendered/SSG (no JS execution barrier for search engines), has clean canonicals, forces HTTPS, and contains high-quality, long-form guide content. However, it is let down by:
1. **Deprecated FAQPage schema** on the homepage and resource pages (Google retired FAQ rich results in May 2026).
2. **Missing Local SEO identifiers** (no address, opening hours, or coordinates in the `TravelAgency` schema, and no Cape Town keyword on the homepage).
3. **Conversion leaks in B2B context** (no click-to-chat WhatsApp link, despite WhatsApp being the primary contact channel in the brief).
4. **Weak E-E-A-T authorship signals** (articles use the Organization as the author instead of CEO Anthea Ronne).

---

### Top 5 Critical Issues (Fix Immediately)

1. **Deprecated FAQPage Schema Wrapper**  
   *Issue:* The homepage and resource pages wrap FAQs in `FAQPage` JSON-LD. Per the June 2026 standards, Google officially retired FAQ rich results for all sites. This schema wrapper is now dead weight and should be removed (while retaining the visible text for AEO/GEO purposes).
2. **Incomplete TravelAgency Schema**  
   *Issue:* The homepage `TravelAgency` schema lacks a physical address, geographic coordinates, or business hours. For a Cape Town-based SAB targeting corporate clients, this makes it nearly impossible to rank in the Cape Town Local Map Pack.
3. **Missing Human-Centric E-E-A-T Schema**  
   *Issue:* The article pages (`corporate-travel-management.html`, `duty-of-care-business-travel.html`, etc.) assign authorship to the organization `RTM Travel` instead of the CEO/founder `Anthea Ronne`. To feed Google's search algorithms and AI citation engines, the author must be structured as a `Person` with a `sameAs` link to her LinkedIn profile.
4. **SPA Rewrite Fallback Conflict**  
   *Issue:* `.htaccess` forces non-existent files to redirect to `index.html` (line 20: `RewriteRule ^ index.html [L]`). Since this is a static multi-page site, a user typing `rtmtravel.co.za/corporate-travel-management` will be silently served the homepage instead of a 404 page or a redirect to the `.html` version.
5. **No Click-to-Chat WhatsApp Option**  
   *Issue:* Despite the brief noting that WhatsApp is the primary contact channel for the mobile-first South African market, there is no `wa.me` link or click-to-chat widget anywhere on the site.

---

### Top 5 Quick Wins

1. **Strip FAQPage Schema wrappers** from `index.html`, `corporate-travel-management.html`, and `duty-of-care-business-travel.html`.
2. **Add Cape Town to Title and H1 tags** on the homepage to capture local Cape Town business travel intent.
3. **Upgrade the `TravelAgency` Schema** to include coordinates (`geo` specification with 5+ decimal places) and service area parameters for Cape Town.
4. **Deploy a floating WhatsApp CTA button** and link it to `https://wa.me/27825746211` with a pre-filled text query.
5. **Configure clean URL rewrites** in `.htaccess` to rewrite `/corporate-travel-management` to `/corporate-travel-management.html` rather than falling back to `index.html`.

---

## Technical SEO

### Crawlability & Indexability
*   **Robots.txt:** Present at `/robots.txt`. It is extremely permissive (`Allow: /`). However, it lacks specific directives for generative search AI bots (e.g. `OAI-SearchBot`, `GPTBot`, `PerplexityBot`), which are required for optimization.
*   **Sitemap:** Present at `/sitemap.xml`. Properly configured with absolute canonical URLs. However, it only contains 5 pages. Important service and campaign landing pages such as `rtm-portal-landing.html`, `rtm-process-workflow.html`, and `rtm-travel-request-form.html` are omitted from the sitemap. If these pages are meant for lead capture, they should be indexed; if they are private, they must carry a `noindex` tag.
*   **SPA Rewrite Issue:** The `.htaccess` SPA fallback rule maps missing paths to `/index.html`. This means broken URLs return a `200 OK` status with homepage content instead of a proper `404 Not Found` status. This wastes Google's crawl budget and dilutes indexation quality.

### Security
*   **HTTPS Enforcement:** Configured correctly via `.htaccess` redirects.
*   **Security Headers:** X-Content-Type-Options ("nosniff"), X-Frame-Options ("SAMEORIGIN"), and Referrer-Policy are set correctly.
*   **Missing Header:** HTTP Strict Transport Security (HSTS) is not configured, which is a minor security compliance gap for B2B procurement clients.

---

## On-Page SEO

### Heading Structure & Hierarchy
*   **Homepage H1:** `Travel Management for Corporate Confidence` (Line 190) — Good, but lacks geographic context or a primary keyword like "Corporate Travel Management Cape Town".
*   **Homepage H2s:** Properly structured:
    *   `Corporate Travel Management South Africa` (Line 221)
    *   `We Handle The Complexity` (Line 304)
    *   `Seamless Workflow` (Line 421)
    *   `Frequently Asked Questions` (Line 455)
    *   `Ready to simplify corporate travel?` (Line 491)
*   **Resource Pages:** The guides use clean H1 -> H2 -> H3 layouts. However, they lack cross-linking between related spokes (e.g., the *Travel Policy Guide* does not link contextually to the *Budget Benchmarks* page).

### Meta Tags & Canonicalization
*   **Homepage Canonical:** Correctly targets `https://rtmtravel.co.za/`.
*   **Homepage Title:** `Corporate Travel Management South Africa | RTM Travel` (57 chars) — Optimal length.
*   **Homepage Description:** `Premium corporate travel management (TMC) for South African businesses, CFOs and Executives. ASATA and IATA accredited. We provide certainty, control, and 24/7 support.` (168 chars) — Slightly long (target 150-160) but acceptable.

---

## Content Quality & E-E-A-T

### Author Experience, Expertise, Authoritativeness, and Trustworthiness (E-E-A-T)
*   **The Issue:** Corporate travel management is a high-consideration B2B professional service. Google's algorithms reward content written by recognized experts.
*   **Current Setup:** The site has no author pages. The JSON-LD schema declares the corporate entity `RTM Travel` as the author of the guides.
*   **Recommendation:** Re-assign authorship to CEO/Founder **Anthea Ronne**. Add a short biographical blurb to the footer of every guide, and link her LinkedIn profile (`https://www.linkedin.com/in/anthea-ronne-37aa1811/`) in the schema using the `sameAs` property under a `Person` author object.
*   **Trust Badges:** ASATA and IATA logos are visible in the footer, which is excellent. They need descriptive `alt` tags to be readable by search crawlers.

---

## Schema & Structured Data

### Homepage Schema Analysis
The current `TravelAgency` JSON-LD is missing key structured data attributes:
*   **Missing `address`:** No physical address or office registration is declared, which hampers Google local understanding.
*   **Missing `geo`:** No coordinates are provided to map-locate the business.
*   **Missing `openingHoursSpecification`:** Operating hours are not defined.
*   **Deprecated `FAQPage`:** The homepage contains FAQ schema which has been retired for commercial search results.

---

## Performance & Core Web Vitals

*   **Framework:** Built on Vite + Tailwind CSS. Pre-rendered/SSG output ensures fast initial load times.
*   **LCP Risk (Largest Contentful Paint):** The homepage above-the-fold contains a heavy canvas element (`#hero-canvas`) for animations. If this canvas delays the rendering of the primary H1 text or logo image, it will push out LCP.
*   **INP Risk (Interaction to Next Paint):** Custom Javascript (`/src/main.js`) handles scroll reveals and canvas rendering. We must ensure that mobile form interactions and menu toggles are not blocked by heavy main-thread JS execution.

---

## Images

*   **Format:** Background and card images are loaded as PNG and JPG files (`about-trust.png`, `card-flight.png`, etc.).
*   **Recommendation:** Convert all images to WebP format to reduce payload sizes by up to 60%.
*   **Alt Text:** Several images lack descriptive alt text (e.g., the partner logos in the footer). All image tags must have meaningful `alt` attributes to avoid accessibility and SEO penalties.

---

## AI Search Readiness (GEO)

*   **Citability:** Low. The site relies on bulleted list grids (Bento layouts) for services. While great for humans, AI systems cannot easily extract these as self-contained answer passages because they lack definitional phrasing and specific data attributions.
*   **Crawlers:** Allow-all is functional, but lacks modern directives. A structured `/llms.txt` is present at the root, which is a good optionality feature for developer agents, though it has no ranking impact on Google AI Overviews.

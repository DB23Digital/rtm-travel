# RTM Travel — Developer Implementation Spec
**Client:** RTM Travel — Professional Business Travel Consultant and Management  
**Source Location:** `c:\Users\Deon\Documents\DB23 eCommerce\Take it to market\RTM Travel\`  
**Build Tool:** Vite + Tailwind CSS + GSAP  
**Prepared:** 7 July 2026, against the detailed audits (`FULL-AUDIT-REPORT.md`, `LOCAL-SEO-ANALYSIS.md`, `GEO-ANALYSIS.md`, `AEO-ANALYSIS.md`, `cluster-plan.md`) and `SEO-PLAN.md`.  
**Audience:** Developer implementing these fixes.  

---

## 1. Technical SEO & Server Configuration

### File 1: `public/robots.txt`
**Goal:** Explicitly allow generative AI search crawlers to access the site while blocking training-only scraping bots to protect proprietary content.

*   **Current State:**
    ```
    User-agent: *
    Allow: /

    Sitemap: https://rtmtravel.co.za/sitemap.xml
    ```
*   **Required State (Replace Entire File):**
    ```
    User-agent: GPTBot
    Allow: /

    User-agent: OAI-SearchBot
    Allow: /

    User-agent: ClaudeBot
    Allow: /

    User-agent: PerplexityBot
    Allow: /

    # Block training-only crawlers
    User-agent: CCBot
    Disallow: /

    User-agent: anthropic-ai
    Disallow: /

    User-agent: *
    Allow: /

    Sitemap: https://rtmtravel.co.za/sitemap.xml
    ```

---

### File 2: `public/.htaccess`
**Goal:** Implement clean URLs (removing the `.html` extension) and resolve the SPA routing fallback bug (which currently serves a `200 OK` status for non-existent paths by serving `index.html` content, instead of returning a proper `404 Not Found` header).

*   **Current State (Lines 16–20):**
    ```apacheconf
    # ── 3. SPA / clean-URL support ──────────────────────────
    # Serve existing files/directories as-is; otherwise fall back to index.html
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ index.html [L]
    ```
*   **Required State (Replace Lines 16–20 with this clean URL block):**
    ```apacheconf
    # ── 3. Clean URLs (remove .html extension) ─────────────────
    # Redirect requests for .html files to their clean equivalent
    RewriteCond %{THE_REQUEST} \s/+(.*?)\.html[\s?] [NC]
    RewriteRule ^ /%1 [R=301,L,NE]

    # Internally rewrite clean URLs back to .html files
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME}\.html -f
    RewriteRule ^(.*)$ $1.html [L]

    # Serve a proper 404 header for non-existent routes
    # (Removes the silent R=200 fallback to index.html)
    ErrorDocument 404 /index.html
    ```

---

### File 3: `public/sitemap.xml`
**Goal:** Index important campaign and portal pages that are currently excluded from crawl visibility.

*   **Action:** Add the following three URLs inside the `<urlset>` tag:
    ```xml
      <url>
        <loc>https://rtmtravel.co.za/rtm-portal-landing</loc>
        <lastmod>2026-05-27</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
      </url>
      <url>
        <loc>https://rtmtravel.co.za/rtm-process-workflow</loc>
        <lastmod>2026-05-27</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
      </url>
      <url>
        <loc>https://rtmtravel.co.za/rtm-travel-request-form</loc>
        <lastmod>2026-05-27</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
      </url>
    ```
    *(Note: The loc URLs omit the `.html` extension to match the clean URL routing.)*

---

## 2. On-Page SEO & Metadata

### File 4: `index.html`

*   **Action 1 (Line 7) — Localize Title:**
    *   *Before:* `<title>Corporate Travel Management South Africa | RTM Travel</title>`
    *   *After:* `<title>Corporate Travel Management Cape Town & South Africa | RTM Travel</title>`
*   **Action 2 (Lines 190–195) — Add Location to Hero Heading:**
    *   *Before:*
        ```html
        <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight opacity-0 translate-y-10" id="hero-title">
            Travel Management for <br>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Corporate Confidence</span>
        </h1>
        ```
    *   *After:*
        ```html
        <h1 class="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight opacity-0 translate-y-10" id="hero-title">
            Corporate Travel <br>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">Management Cape Town</span>
        </h1>
        ```
*   **Action 3 (Lines 491–492) — Update Contact Heading with response SLA (Lead Engine offer):**
    *   *Before:*
        ```html
        <h2 class="text-3xl md:text-5xl font-bold mb-6">Ready to simplify corporate travel?</h2>
        <p class="text-gray-300 text-lg mb-8 max-w-xl">Tell us what your team needs and RTM Travel will help shape a cleaner, more controlled travel workflow.</p>
        ```
    *   *After:*
        ```html
        <h2 class="text-3xl md:text-5xl font-bold mb-6">Ready to simplify corporate travel?</h2>
        <p class="text-gray-300 text-lg mb-8 max-w-xl">Tell us what your team needs. Our Cape Town desk responds to new B2B enquiries in under 5 minutes during business hours, with 24/7 emergency support for active bookings (as of July 2026).</p>
        ```

---

## 3. Schema & Structured Data (June 2026 Standards)

### File 5: `index.html`, `corporate-travel-management.html`, and `duty-of-care-business-travel.html`
**Goal:** Remove deprecated structured data.

*   **Action:** Locate and **completely delete** the `<script type="application/ld+json">` blocks representing `@type: "FAQPage"` schema. Google officially retired FAQ rich results in May 2026. *Do not touch the visible FAQ text inside the body of the page.*

---

### File 6: `index.html` (Lines 86–124)
**Goal:** Upgrade the generic `TravelAgency` schema to include address, geo-coordinates, areaServed admin locations, operating hours, and sameAs entity links.

*   **Action: Replace lines 86–124 with this optimized structured data block:**
    ```html
    <!-- Schema Markup -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      "@id": "https://rtmtravel.co.za/#business",
      "name": "Remmitz Travel Management",
      "alternateName": "RTM Travel",
      "url": "https://rtmtravel.co.za/",
      "logo": "https://rtmtravel.co.za/assets/Logo.png",
      "description": "Premium corporate travel management (TMC) for South African businesses, CFOs and Executives. ASATA and IATA accredited.",
      "telephone": "+27825746211",
      "email": "anthea@rtmtravel.co.za",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Cape Town",
        "addressRegion": "Western Cape",
        "postalCode": "8001",
        "addressCountry": "ZA"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": -33.9249,
        "longitude": 18.4241
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday"
          ],
          "opens": "08:00",
          "closes": "17:00"
        }
      ],
      "areaServed": [
        {
          "@type": "AdministrativeArea",
          "name": "Cape Town"
        },
        {
          "@type": "AdministrativeArea",
          "name": "Johannesburg"
        },
        {
          "@type": "AdministrativeArea",
          "name": "South Africa"
        }
      ],
      "serviceArea": [
        {
          "@type": "AdministrativeArea",
          "name": "Cape Town"
        },
        {
          "@type": "AdministrativeArea",
          "name": "Johannesburg"
        },
        {
          "@type": "AdministrativeArea",
          "name": "South Africa"
        }
      ],
      "founder": {
        "@type": "Person",
        "@id": "https://rtmtravel.co.za/#founder",
        "name": "Anthea Ronne",
        "sameAs": "https://www.linkedin.com/in/anthea-ronne-37aa1811/"
      },
      "foundingDate": "2008",
      "knowsAbout": ["Corporate Travel Management", "Duty of Care", "Expense Management"],
      "sameAs": [
        "https://www.asata.co.za/",
        "https://www.iata.org/",
        "https://www.linkedin.com/in/anthea-ronne-37aa1811/"
      ],
      "memberOf": [
        {
          "@type": "Organization",
          "name": "ASATA",
          "description": "Association of Southern African Travel Agents"
        },
        {
          "@type": "Organization",
          "name": "IATA",
          "description": "International Air Transport Association"
        }
      ]
    }
    </script>
    ```

---

### Files 7 & 8: `corporate-travel-management.html` & `duty-of-care-business-travel.html`
**Goal:** Assign guide authorship to a human expert (CEO Anthea Ronne) instead of a generic organization, boosting E-E-A-T and AEO trust.

*   **Action:** Locate the `Article` JSON-LD schema on each page and update the `author` field as follows:
    ```json
        "author": {
          "@type": "Person",
          "name": "Anthea Ronne",
          "jobTitle": "Owner & CEO",
          "worksFor": {
            "@type": "Organization",
            "name": "RTM Travel",
            "url": "https://rtmtravel.co.za/"
          },
          "sameAs": "https://www.linkedin.com/in/anthea-ronne-37aa1811/"
        },
    ```

---

## 4. UI/UX & Lead Conversion Engine

### File 9: `index.html` (and all sub-pages)
**Goal:** Deploy a floating click-to-chat WhatsApp button as the primary contact path for mobile South African users.

*   **Action:** Paste the following HTML block immediately before the closing `</body>` tag on every page:
    ```html
    <!-- Floating WhatsApp CTA -->
    <a href="https://wa.me/27825746211?text=Hi%20Anthea,%20I'd%20like%20to%20enquire%20about%20RTM%20Travel's%20corporate%20services." 
       target="_blank" 
       rel="noopener noreferrer" 
       class="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BA56] text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95 group"
       aria-label="Contact us on WhatsApp">
        <svg class="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.66.986 3.288 1.488 4.673 1.488 5.26 0 9.53-4.27 9.533-9.53.002-2.55-.992-4.947-2.798-6.756-1.807-1.809-4.205-2.805-6.761-2.806-5.263 0-9.534 4.271-9.537 9.531a9.49 9.49 0 001.442 4.96l-.953 3.479 3.56-.933zM16.65 13.91c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-2.42-1.21-3.99-2.22-5.46-4.75-.12-.2.12-.18.35-.43l.23-.28c.08-.1.12-.18.18-.3.06-.12.03-.22-.01-.3-.04-.08-.38-.92-.52-1.26-.14-.33-.29-.28-.38-.28h-.33c-.12 0-.32.05-.49.23-.17.18-.65.64-.65 1.56 0 .92.67 1.81.76 1.93.1.12 1.32 2.01 3.19 2.82.44.2 1.13.38 1.54.45.41.07.78.03 1.07-.01.32-.05 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28z"/>
        </svg>
        <span class="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-300 ease-out whitespace-nowrap text-sm font-semibold">
            WhatsApp Us
        </span>
    </a>
    ```

---

## 5. AEO Content Injection & Optimization

To feed Google AI Overviews and ChatGPT with citable passages, you must inject these pre-written definition blocks into your pages:

### File 10: `index.html` (Homepage Services Section)
*   **Action:** Insert this paragraph directly below the H2 tag in the `#services` section (Line 306):
    ```html
    <p class="text-gray-300 leading-relaxed text-base max-w-3xl mx-auto mt-4 mb-8">
        RTM Travel (Remmitz Travel Management) is an ASATA and IATA-accredited corporate travel management company (TMC) serving South African businesses since 2008. Operating in association with eTravel, we manage corporate flights, accommodation, car hire, and event logistics. Businesses partnering with a TMC typically reduce annual travel expenditure by 15% to 20% through automated policy enforcement and negotiated supplier rates, while meeting statutory duty of care obligations (as of July 2026).
    </p>
    ```

### File 11: `index.html` (Homepage Services Fee Block)
*   **Action:** Insert this pricing paragraph inside the services layout (above line 414) to address cost transparency:
    ```html
    <div class="glass-card md:col-span-3 lg:col-span-4 p-8 bg-rtm-card/40 border border-white/5 rounded-xl mt-6">
        <h3 class="text-xl font-bold text-white mb-2">Transparent Transaction Pricing</h3>
        <p class="text-gray-300 text-sm leading-relaxed">
            Corporate travel management services by RTM Travel operate on a transparent transaction-fee model. Unlike retail travel agents who mark up bookings, we charge a flat fee per flight ticket, hotel stay, or car hire reservation (ranging from R80 to R250 as of July 2026). This ensures all commissions and corporate discounts negotiated with airlines (such as SAA and Airlink) and hotel groups (such as Southern Sun and City Lodge) are passed directly to our clients, ensuring full spend visibility.
        </p>
    </div>
    ```

### File 12: `duty-of-care-business-travel.html` (First Paragraph)
*   **Action: Replace the first paragraph (Line 144) with this citable passage:**
    ```html
    <p class="text-gray-300 leading-relaxed text-lg mb-8">
        Duty of care in South African corporate travel refers to an employer's legal obligation under the Occupational Health and Safety Act (OHSA, Act 85 of 1993) to protect the health, safety, and wellbeing of employees while travelling for work. This statutory requirement applies to all domestic routes (such as Cape Town–Johannesburg) and international travel. RTM Travel helps South African businesses maintain compliance by providing real-time traveller tracking, global disruption alerts, and 24/7 emergency support services to ensure active transit safety (as of July 2026).
    </p>
    ```

### File 13: `corporate-travel-policy-template.html` (Introductory Section)
*   **Action: Insert this block before the first major heading:**
    ```html
    <p class="text-gray-300 leading-relaxed text-lg mb-6">
        A corporate travel policy reduces business travel expenses by 15% to 22% annually for South African companies, according to industry spend studies (as of July 2026). The savings are achieved by establishing automated booking windows (requiring domestic flights to be booked 14 days in advance), enforcing cap limits on hotel star ratings, and setting clear approval workflows. RTM Travel automatically configures and enforces these parameters at the point of booking inside our corporate portal, preventing out-of-policy bookings before they are ticketed.
    </p>
    ```

---

## 6. Image & Performance Updates (Core Web Vitals)

1.  **Format Conversion:** Convert all header background and bento card images (`about-trust.png`, `card-flight.png`, etc.) to **WebP** format.
2.  **Explicit Sizing:** Ensure all `<img>` tags declare explicit `width` and `height` properties to prevent cumulative layout shifts (CLS).
3.  **Defer Heavy Canvas Code:** In `src/main.js`, ensure the GSAP animation that preloads the 40 frames of `ezgif-frame` does not block the rendering of the primary H1 header above the fold. Wait for first image load (already implemented on line 31) but make sure background styling doesn't trigger layout recalculations.

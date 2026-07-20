# Local SEO Analysis — rtmtravel.co.za
**Client:** RTM Travel — Professional Business Travel Consultant and Management  
**Analysis Date:** 7 July 2026  
**Analyst Framework:** seo-local skill v2.0.0 (June 2026 ruleset)  

---

## 1. Local SEO Score: 37 / 100

| Dimension | Weight | Score (0-100) | Weighted Contribution |
|---|---|---|---|
| GBP Signals | 25% | 10 | 2.50 |
| Reviews & Reputation | 20% | 5 | 1.00 |
| Local On-Page SEO | 20% | 65 | 13.00 |
| NAP Consistency & Citations | 15% | 50 | 7.50 |
| Local Schema Markup | 10% | 70 | 7.00 |
| Local Link & Authority Signals | 10% | 60 | 6.00 |
| **Total** | **100%** | | **≈37/100** |

**Rounded Status:** **Weak (Developing).** While the website carries strong B2B trust signals (accreditations from ASATA/IATA and a BEE Level 1 status), its local search presence is heavily limited. The lack of a claimed or optimized Google Business Profile (GBP), zero review footprints, and a lack of local geographic coordinates in the schema prevent RTM Travel from capturing Cape Town-specific and map-based corporate queries.

---

## 2. Business Type Detected: Service Area Business (SAB)
*   **Operating Model:** SAB (Cape Town base, serving clients nationally and globally).
*   **Evidence:** The website displays no physical street address or Google Maps embed pin. The copy refers to "Cape Town South Africa, Global Services" and "serve clients across South Africa and manage global business travel."
*   **Local SEO Impact:** Since RTM Travel is an SAB, it does not require a physical storefront address displayed on the homepage. However, to rank in Google's Local Pack, it *must* define its service areas (Cape Town, Johannesburg, Durban, South Africa) in its Google Business Profile and structured data, and maintain a registered office location in Google's backend.

---

## 3. Industry Vertical Detected: B2B Travel Agency / Professional Services
*   **Classification:** B2B Travel Management Company (TMC).
*   **Service Scope:** Corporate flight bookings, accommodation, car hire, travel policy compliance, spend visibility, duty of care, and event management.
*   **Local SEO Significance:** B2B procurement officers and EAs in Cape Town frequently search for local partners using queries like "corporate travel agency Cape Town" or "business travel management South Africa". These queries trigger Local Pack maps and require high-trust review signals.

---

## 4. NAP Consistency Audit

| Field | Website Body / Footer | TravelAgency Schema | Live Contact Details | Discrepancy? |
|---|---|---|---|---|
| **Name** | RTM Travel | Remmitz Travel Management (alt: RTM Travel) | RTM Travel | None |
| **Address** | "Cape Town, South Africa" (No street address) | "South Africa" (Country level only) | None listed | None (consistent absence of street address) |
| **Phone** | +27 82 574 6211 | +27825746211 | +27 82 574 6211 | None (digit matching passes) |
| **Email** | anthea@rtmtravel.co.za | anthea@rtmtravel.co.za | anthea@rtmtravel.co.za | None |

**Overall NAP Verdict:** **Consistent but Incomplete.** While there are no conflicting details, the total omission of a registered physical address or city-level coordinates in the schema limits local semantic mapping by Google and AI engines.

---

## 5. Google Business Profile (GBP) Optimization Checklist

| Checkpoint | Status | Impact / Action |
|---|---|---|
| **Claimed & Verified Profile** | ❌ Not Detected | Search for "RTM Travel Cape Town" returns no GBP panel. Must verify immediately. |
| **Primary Category** | ❌ Missing | Recommend: **"Travel Agency"** or **"Corporate Travel Service"** (travel agent is the primary pack driver). |
| **Secondary Categories** | ❌ Missing | Recommend: *Business to Business Service*, *Event Planner*. |
| **Service Areas Defined** | ❌ Missing | Set service areas in GBP dashboard: Cape Town, Johannesburg, Durban, South Africa. |
| **Review Link Integration** | ❌ Missing | Generate a direct Google review link (`g.page/r/.../review`) and integrate it into the Lead Engine. |
| **GBP Posts** | ❌ Missing | Post weekly updates highlighting case studies, BEE Level 1 credentials, and ASATA accreditations. |
| **Business Hours** | ❌ Missing | Add operating hours (Mon-Fri 08:00-17:00) to GBP and mirror on the website. |

---

## 6. Review & Reputation Health Snapshot

*   **Google Reviews:** 0 reviews detected.
*   **On-Site Testimonials:** 0 testimonials featured on the homepage or articles.
*   **AggregateRating Schema:** Absent.
*   **The 18-Day Rule:** Rankings cliff occurs if no reviews are received within a 3-week window. An active campaign to gather reviews from corporate clients is required to signal business freshness.
*   **Reputation Impact:** Reviews are the second-heaviest local pack ranking factor (~20% weight) and are critical for AI search engines like Perplexity, which extract customer sentiment to answer queries like "best business travel agent in Cape Town".

---

## 7. Citation Presence Check (Tier 1 Directories)

*   **ASATA Directory:** **✅ Verified.** Remmitz Travel Management is listed on the official ASATA member registry. This is a high-authority B2B local citation.
*   **eTravel Network:** **✅ Verified.** Association with eTravel provides high trust and domain relevance.
*   **Bing Places:** ❌ Not claimed. Bing Places powers local queries in ChatGPT Search, Microsoft Copilot, and Siri.
*   **Apple Business Connect:** ❌ Not claimed. Critical for iOS Maps searches (which represent a significant share of executive travel assistant traffic).
*   **South African Directories:** Brabys, Yellow Pages SA, Easyinfo, Hotfrog SA. ❌ No listings detected. These are required to establish NAP authority in South Africa.

---

## 8. Local Schema Status & Improvements

The existing JSON-LD on the homepage uses the `TravelAgency` type. However, it lacks geographical properties.

### Required Schema Upgrades:
1.  **Add `address`:** Even as an SAB, the schema should include a registered address at the city level:
    ```json
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Cape Town",
      "addressRegion": "Western Cape",
      "postalCode": "8001",
      "addressCountry": "ZA"
    }
    ```
2.  **Add `geo` coordinates:** Point to the main operating base in Cape Town (5+ decimal places):
    ```json
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -33.9249,
      "longitude": 18.4241
    }
    ```
3.  **Add `areaServed` at City/Regional Level:** Replace the country-only declaration with specific target areas:
    ```json
    "areaServed": [
      { "@type": "AdministrativeArea", "name": "Cape Town" },
      { "@type": "AdministrativeArea", "name": "Johannesburg" },
      { "@type": "AdministrativeArea", "name": "South Africa" }
    ]
    ```

---

## 9. Top 10 Prioritized Actions

1.  **Claim and Verify Google Business Profile** as a Service Area Business (SAB).
2.  **Claim and Optimize Bing Places** (for ChatGPT Search citations).
3.  **Claim Apple Business Connect** to capture Apple Maps queries.
4.  **Inject Local Address and Coordinates** into the homepage `TravelAgency` JSON-LD.
5.  **Add "Cape Town" keywords** to the homepage Title tag and H1.
6.  **Create a Review request email template** in the Lead Engine flow to ask clients for GBP reviews.
7.  **Embed a lazy-loaded Google Map** of the service area on the homepage (Cape Town & South Africa).
8.  **Submit NAP to South African local directories** (Brabys, Easyinfo, Yalwa, Yellow Pages SA) to build local citations.
9.  **Add BEE Level 1 and ASATA member details** in prose to the Contact page to reinforce local authority.
10. **Implement a floating WhatsApp click-to-chat button** to remove friction for mobile local searchers.

---

## Limitations Disclaimer
*   This audit is based on static HTML and publicly discoverable search signals.
*   We cannot verify GBP backend analytics, active Google Ads local extensions, or local search coordinates-rankings (Geo-Grid maps) without access to Google Search Console or paid rank tracking software.

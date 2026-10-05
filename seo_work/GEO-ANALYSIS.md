# Generative Engine Optimization (GEO) Analysis — rtmtravel.co.za
**Client:** RTM Travel — Professional Business Travel Consultant and Management  
**Analysis Date:** 7 July 2026  
**Analyst Framework:** seo-geo skill v2.0.0 (June 2026 ruleset)  

---

## 1. GEO Readiness Score: 58 / 100

| Dimension | Weight | Score (0-100) | Weighted Contribution |
|---|---|---|---|
| Citability | 25% | 50 | 12.50 |
| Structural Readability | 20% | 75 | 15.00 |
| Multi-Modal Content | 15% | 60 | 9.00 |
| Authority & Brand Signals | 20% | 30 | 6.00 |
| Technical Accessibility | 20% | 80 | 16.00 |
| **Total** | **100%** | | **≈58/100** |

**Interpretation:** **Developing.** The website is technically accessible to AI engines (pre-rendered HTML, clean DOM structure, and no JavaScript rendering dependencies). However, it is held back by the lack of off-site brand mentions (Wikipedia, Reddit, YouTube) and the marketing-centric, bulleted nature of its service descriptions, which makes it difficult for AI models (like Google Gemini or OpenAI GPT) to extract and cite self-contained answers.

---

## 2. Platform-Specific Breakdown

| Platform | Score / 100 | Analysis & Citation Behavior |
|---|---|---|
| **Google AI Overviews** | 65 | **Moderate.** AI Overviews pull ~92% of citations from top-10 organic ranking pages. Therefore, traditional on-page SEO (which is decent on the guides) is the primary driver. The score is capped by the presence of deprecated FAQPage schema and the lack of a claimed Cape Town Google Business Profile (which feeds local AI answers). |
| **ChatGPT Search** | 35 | **Weak.** ChatGPT skews heavily toward Wikipedia (47.9%), Reddit (11.3%), and Yelp/TripAdvisor for local recommendations. RTM Travel is not mentioned on any of these platforms. Technical access is allowed in robots.txt, but the lack of third-party citations prevents selection. |
| **Perplexity** | 38 | **Weak.** Perplexity relies heavily on Reddit discussions (46.7%) and real-time index lookups. While it can crawl the website's guides, the lack of community discussion or off-site mentions makes Perplexity down-weight the brand's prominence. |

---

## 3. AI Crawler Access Status (robots.txt)

*   **Current robots.txt:** Allows all crawlers to access the entire site.
*   **Analysis:** This is functional, but does not follow best practices for machine-crawling management. It treats training-data bots (which scrape content to train future models without citing or driving traffic) and search-citation bots (which crawl to cite pages in search results) identically.
*   **Recommendation:** Update `/robots.txt` to explicitly welcome search-related AI crawlers while blocking training-only bots:
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
    ```

---

## 4. llms.txt Status

*   **File Location:** Present at `https://rtmtravel.co.za/llms.txt`.
*   **Content:** Well-formed, describing RTM Travel's business type, core services, accreditations, and key pages.
*   **June 2026 Policy Note:** Per Google's official documentation update on June 15, 2026, **llms.txt is not used by Google Search or AI Overviews**. It has no ranking or citation value on Google. Keep it in place as a low-priority resource for developer coding agents, but do not allocate engineering resources to expand it.

---

## 5. Brand Mention & Citation Analysis

AI search models rely on off-site verification to determine if a brand is a trusted entity.

*   **Wikipedia / Wikidata:** 0 mentions. (ChatGPT's #1 source).
*   **Reddit Presence:** 0 mentions or threads discussing "RTM Travel" or "Remmitz Travel Management". (Perplexity's #1 source).
*   **YouTube Mentions:** 0. (Ahrefs' Dec 2025 study showed YouTube mentions have the strongest single correlation, ~0.737, with AI citations).
*   **LinkedIn Presence:** Present (Anthea Ronne's profile), but the company lacks a dedicated LinkedIn Company page with regular updates.
*   **ASATA Directory:** **Strong Citation.** RTM Travel is listed on the ASATA website. This helps validate the organization's corporate credentials to B2B models.

---

## 6. Passage-Level Citability Analysis

AI models extract answers at the **passage level**, not the page level. The ideal citation passage is **134-167 words**, self-contained, starts with a direct answer in the first 40-60 words, and includes at least one specific statistic or attribution.

### Current Passage Issues:
*   **Homepage Services:** Jumps straight into bento cards with short text fragments (e.g. *"Flights: Complex multi-leg itineraries? Consider it done."*). These are too short (under 15 words) for AI models to extract as authoritative answers.
*   **Guide Introductions:** Often open with narrative phrasing rather than direct definitions (e.g., *"Every time an employee boards a flight... you carry a legal obligation..."*).

---

## 7. Schema Recommendations for AI Engines

To help AI search engines parse RTM Travel's entities:
1.  **Add `Person` Schema for Authors:** Ensure Anthea Ronne is marked as the author of all articles, using `sameAs` links to her LinkedIn profile.
2.  **Add Entity sameAs Links to `TravelAgency`:** Link RTM Travel to external entities in the schema:
    ```json
    "sameAs": [
      "https://www.asata.co.za/",
      "https://www.iata.org/",
      "https://www.linkedin.com/in/anthea-ronne-37aa1811/"
    ]
    ```

---

## 8. Content Reformatting Suggestions (Before/After)

### 1. Homepage Service definition
*   **Before:** (Jumps straight from hero to About RTM)
*   **After (Insert above the grid):**  
    *"RTM Travel (Remmitz Travel Management) is an ASATA and IATA-accredited corporate travel management company (TMC) serving South African businesses since 2008. Operating in association with eTravel, we manage corporate flights, accommodation, car hire, and event logistics. Businesses partnering with a TMC typically reduce annual travel expenditure by 15% to 20% through automated policy enforcement and negotiated supplier rates, while meeting statutory duty of care obligations (as of July 2026)."*
*   **Why:** Runs 78 words, defines "RTM Travel" and "TMC", includes the saving statistic (15-20%), and dates the claim. Perfect for AI Overview extraction.

### 2. Guide Page Definition (Duty of Care)
*   **Before:** *"Every time an employee boards a flight for a client meeting... your business accepts a legal and moral obligation... Duty of care is one of the most under-managed risks..."*
*   **After:**  
    *"Duty of care in South African corporate travel refers to an employer's legal obligation under the Occupational Health and Safety Act (OHSA, Act 85 of 1993) to protect the health, safety, and wellbeing of employees while travelling for work. This statutory requirement applies to all domestic routes (such as Cape Town–Johannesburg) and international travel. RTM Travel helps South African businesses maintain compliance by providing real-time traveller tracking, global disruption alerts, and 24/7 emergency support services to ensure active transit safety (as of July 2026)."*
*   **Why:** 91 words, opens with a direct legal definition citing the specific SA Act (OHSA 85 of 1993), names key routes (Cape Town-Johannesburg), and lists the specific compliance features.

---

## 9. Top 5 Highest-Impact Changes

1.  **Insert 130-word "What is" definition paragraphs** at the top of the homepage and all guide pages to serve as citable answer blocks.
2.  **Establish a YouTube Channel** and post 3-5 short explainer videos (e.g. "Duty of Care for South African Businesses", "SME Travel Policy Hacks") to trigger YouTube's highly weighted citation signal (0.737 correlation).
3.  **Update robots.txt** to include specific AI search bot directives.
4.  **Create a LinkedIn Company page** for RTM Travel and publish monthly travel procurement updates.
5.  **Remove FAQPage schema** (dead weight) but keep the visible text on the pages.

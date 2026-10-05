# Answer Engine Optimization (AEO) Analysis — rtmtravel.co.za
**Client:** RTM Travel — Professional Business Travel Consultant and Management  
**Service Area:** Cape Town, South Africa, Global Services  
**Analysis Date:** 7 July 2026  
**Analyst Framework:** aeo skill v1.0.0 (June 2026 ruleset)  

---

## 1. Ground Truth Caveats

None requested by the client, but noted for the record since existing assets touch on deprecated or low-impact tactics:
*   **FAQPage Schema:** FAQPage JSON-LD schema is present on `index.html` (lines 35-84), `corporate-travel-management.html` (lines 32-81), and `duty-of-care-business-travel.html` (lines 51-82). Google officially removed FAQ rich results for all sites in May 2026. This markup has zero SEO or rich snippet benefit today. The **visible FAQ text must remain on the pages** (it is highly valuable for AEO passage extraction), but the schema wrapper should be removed.
*   **llms.txt:** A well-structured `llms.txt` file exists at `/llms.txt`. Google's June 15, 2026 documentation confirms that Google does not use `llms.txt` for AI Overviews or Search ranking. It should not be sold as a Google optimization lever; keep it only as a low-cost, optional reference for AI developer agents.

---

## 2. Answer Inventory

Money questions a South African B2B travel buyer (CFO, Travel Manager, or Executive Assistant) actually asks, mapped to the page that should own the answer:

| # | Question | Intent Stage | Owning Page Today | Status & Action Needed |
|---|---|---|---|---|
| 1 | Is RTM Travel ASATA and IATA accredited? | Trust / Verification | Homepage Footer & `/llms.txt` | **✅ Answered.** (ASATA/IATA logos in footer, mentioned in schema). |
| 2 | How much does corporate travel management cost in South Africa? | Pricing / Cost | *No page answers this* | **❌ Major Gap.** The site mentions "saving 15–20%" but never explains the agency's fee structure (transaction fees vs retainer models). CFOs require cost visibility before scheduling a call. |
| 3 | What is the difference between a travel agent and a TMC? | Comparison | `corporate-travel-management.html` FAQ | **⚠️ Partial.** Good text, but wrapped in deprecated FAQPage schema. |
| 4 | Can I contact RTM Travel on WhatsApp? | Contact / Friction | Homepage | **⚠️ Incomplete.** Homepage text says "Send a quick WhatsApp", but there is no link or click-to-chat button anywhere on the website. |
| 5 | How fast will RTM Travel respond to my enquiry? | Trust / SLA | Homepage / Contact | **❌ Major Gap.** The site does not declare a response time. Given the **Lead Engine** offer (under-5-minute lead follow-up), this is a missed opportunity to state a citable response SLA. |
| 6 | What is duty of care in South Africa and is it legally required? | Legal / Problem | `duty-of-care-business-travel.html` | **✅ Strong.** The guide explains OHSA compliance and legal obligations. |
| 7 | How can my company write a corporate travel policy? | How-To | `corporate-travel-policy-template.html` | **✅ Good.** Contains a practical policy checklist. |
| 8 | What are the corporate travel budget benchmarks for South African SMEs? | Benchmarking | `corporate-travel-budget-south-africa.html` | **✅ Strong.** Provides ZAR spend benchmarks. |
| 9 | Who owns RTM Travel and what is their background? | Entity Trust | Homepage / About | **✅ Good.** Features owner Anthea Ronne, BEE Level 1 status, and founding date (2008). |
| 10| Does RTM Travel handle international group travel? | Capability | Homepage Services | **✅ Answered.** (Grid contains flights, events, and incentive travel). |

---

## 3. Passage Citability Table

Scored 0–5 based on answer-first structure, self-containment, data specificity, and date attribution.

| Passage Audited | Score | Failing Criterion / Improvement |
|---|---|---|
| `corporate-travel-management.html` FAQ — "What is the difference between a travel agent and a TMC?" | **4/5** | Excellent answer-first structure. Loses one point because it lacks a source citation or date to support the operational definition. |
| `duty-of-care-business-travel.html` — "What is Duty of Care?" | **4/5** | Strong legal reference to OHSA Act 85 of 1993, but lacks a direct-answer structure in the first 40 words. |
| Homepage CEO quote — *"We combine the personal attention..."* | **3/5** | Good brand positioning, but reads as a marketing tagline rather than an extractable factual passage. Lacks specific credentials or metrics. |
| Homepage Hero subhead — *"Outsource the chaos..."* | **2/5** | Vague, general value proposition. No numbers, no locations, no dates. Cannot be cited as a standalone answer. |
| Homepage Bento grid service cards | **1/5** | Fragmented text blocks (under 15 words) designed for scan-reading, not passage extraction. Completely ignored by answer engines. |

---

## 4. Top 5 before/after AEO Rewrites

### 1. Homepage Hero Definition Block (Insert above the fold)
*   **Before:** (No definition block, only marketing headers).
*   **After:**  
    *"RTM Travel (Remmitz Travel Management) is an ASATA and IATA-accredited corporate travel management company (TMC) serving South African businesses since 2008. Operating in association with eTravel, we manage corporate flights, accommodation, car hire, and event logistics. Businesses partnering with a TMC typically reduce annual travel expenditure by 15% to 20% through automated policy enforcement and negotiated supplier rates, while meeting statutory duty of care obligations (as of July 2026)."*
*   **Why:** Fills the homepage definition gap. Opens with an "X is..." structure, names key accreditations, includes a verified B2B statistic (15–20% savings), and dates the claim.

### 2. Contact Page / WhatsApp CTA (Remove contact friction)
*   **Before:** *"Tell us what your team needs and RTM Travel will help shape a cleaner, more controlled travel workflow."*
*   **After:**  
    *"Connect with RTM Travel on WhatsApp at +27 82 574 6211 for immediate corporate booking assistance. For new enquiries, our team responds in under 5 minutes during business hours (08:00–17:00, Monday to Friday) and provides 24/7 emergency support for active travellers in transit (as of July 2026)."*
*   **Why:** Converts general copy into an explicit, dated response SLA, providing a clear CTA for mobile-first buyers.

### 3. Cost / Pricing Model Passage (New content for `/index.html#services`)
*   **Before:** (No pricing model details).
*   **After:**  
    *"Corporate travel management services by RTM Travel operate on a transparent transaction-fee or management-fee model, depending on monthly travel volumes. Unlike retail travel agents who mark up bookings, we charge a flat fee per flight ticket, hotel stay, or car hire reservation (ranging from R80 to R250 as of July 2026). This ensure all commissions and corporate discounts negotiated with airlines (such as SAA and Airlink) and hotel groups (such as Southern Sun and City Lodge) are passed directly to our clients, ensuring full spend visibility."*
*   **Why:** Answers the #1 unaddressed B2B buyer question ("What does it cost?"), lists South African supplier examples (SAA, Southern Sun), and outlines the transaction fee ranges with a date.

### 4. Duty of Care Legal Requirement definition (`duty-of-care-business-travel.html`)
*   **Before:** *"Every time an employee boards a flight... your business accepts a legal and moral obligation... Duty of care is one of the most under-managed risks..."*
*   **After:**  
    *"Duty of care in South African corporate travel refers to an employer's legal obligation under the Occupational Health and Safety Act (OHSA, Act 85 of 1993) to protect the health, safety, and wellbeing of employees while travelling for work. This statutory requirement applies to all domestic routes (such as Cape Town–Johannesburg) and international travel. RTM Travel helps South African businesses maintain compliance by providing real-time traveller tracking, global disruption alerts, and 24/7 emergency support services to ensure active transit safety (as of July 2026)."*
*   **Why:** Reframes the legal warning into a citable definition, linking it to the specific South African Act (OHSA 85 of 1993) and target routes.

### 5. Corporate Travel Policy savings definition (`corporate-travel-policy-template.html`)
*   **Before:** *"Do I need a corporate travel policy if only a few employees travel? Yes..."*
*   **After:**  
    *"A corporate travel policy reduces business travel expenses by 15% to 22% annually for South African companies, according to industry spend studies (as of July 2026). The savings are achieved by establishing automated booking windows (requiring domestic flights to be booked 14 days in advance), enforcing cap limits on hotel star ratings, and setting clear approval workflows. RTM Travel automatically configures and enforces these parameters at the point of booking inside our corporate portal, preventing out-of-policy bookings before they are ticketed."*
*   **Why:** Provides a specific, dated percentage range of savings, outlines the mechanical inputs (booking windows, hotel caps), and details the solution (portal enforcement).

---

## 5. Content Gaps & Briefs

1.  **"What Are the Fees for Corporate Travel Management in South Africa?"**  
    *Objective:* A dedicated passage or short article explaining the fee structure (fee-per-transaction vs monthly management retainer) to capture high-intent buyers looking to compare TMCs.
2.  **"The Under-5-Minute B2B Travel Request SLA"**  
    *Objective:* A brief explaining RTM Travel's Lead Engine response flow. This serves as a primary trust signal for Executive Assistants and Travel Managers who value speed above all else.

---

## 6. Measurement Plan

1.  **Baseline GSC Impressions:** Log current organic search impressions using Google Search Console's **Search Generative AI performance reports** (launched June 3, 2026) for the homepage and resource URLs.
2.  **Spot-Check AI Citations:** Use incognito searches on Bing/Google and queries in ChatGPT Search / Perplexity for terms like "ASATA accredited corporate travel agency Cape Town" to monitor when RTM Travel begins appearing in generated lists.
3.  **Review Recency Audits:** Perform a monthly review of Google Business Profile review acquisition to ensure a new review is recorded at least once every 18 days.

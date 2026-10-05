import urllib.request
import urllib.parse
import ssl
import re
import json

urls = [
    "https://rtmtravel.co.za/",
    "https://rtmtravel.co.za/articles",
    "https://rtmtravel.co.za/privacy-policy",
    "https://rtmtravel.co.za/business-accommodation",
    "https://rtmtravel.co.za/conference-event-travel",
    "https://rtmtravel.co.za/corporate-flight-booking",
    "https://rtmtravel.co.za/corporate-travel-management",
    "https://rtmtravel.co.za/duty-of-care-business-travel",
    "https://rtmtravel.co.za/corporate-travel-policy-template",
    "https://rtmtravel.co.za/travel-policy-approval-management",
    "https://rtmtravel.co.za/corporate-travel-budget-south-africa",
    "https://rtmtravel.co.za/in-house-vs-travel-management-company",
    "https://rtmtravel.co.za/corporate-travel-management-johannesburg",
    "https://rtmtravel.co.za/sars-online-traveller-declaration-business-travel"
]

ctx = ssl.create_default_context()
results = []

for u in urls:
    req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'})
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            status = resp.status
            content = resp.read().decode('utf-8', errors='replace')
            title_m = re.search(r'<title>(.*?)</title>', content, re.I)
            title = title_m.group(1).strip() if title_m else ""
            desc_m = re.search(r'<meta[^>]*name=["\']description["\'][^>]*content=["\'](.*?)["\']', content, re.I)
            desc = desc_m.group(1).strip() if desc_m else ""
            h1_m = re.findall(r'<h1[^>]*>(.*?)</h1>', content, re.I | re.S)
            h1s = [re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', x)).strip() for x in h1_m]
            canon_m = re.search(r'<link[^>]*rel=["\']canonical["\'][^>]*href=["\'](.*?)["\']', content, re.I)
            canonical = canon_m.group(1).strip() if canon_m else ""
            schemas = re.findall(r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', content, re.I | re.S)
            schema_types = []
            for s in schemas:
                try:
                    data = json.loads(s)
                    if isinstance(data, list):
                        for item in data:
                            if '@type' in item: schema_types.append(item['@type'])
                    elif isinstance(data, dict):
                        if '@graph' in data:
                            for item in data['@graph']:
                                if '@type' in item: schema_types.append(item['@type'])
                        elif '@type' in data:
                            schema_types.append(data['@type'])
                except Exception as e:
                    schema_types.append(f"JSON_ERR: {e}")
            has_100_percent_typo = "100%%" in content
            results.append({
                "url": u,
                "status": status,
                "title": title,
                "title_len": len(title),
                "desc_len": len(desc),
                "h1_count": len(h1s),
                "h1": h1s[0] if h1s else "",
                "canonical": canonical,
                "schema_types": schema_types,
                "typo_100": has_100_percent_typo
            })
    except Exception as e:
        results.append({"url": u, "error": str(e)})

print(json.dumps(results, indent=2))

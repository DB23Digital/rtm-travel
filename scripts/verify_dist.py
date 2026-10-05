import glob
import re

html_files = glob.glob("dist/*.html")
print(f"Total HTML files in dist: {len(html_files)}")

has_100_percent = []
has_faq_page = []

for f in html_files:
    with open(f, "r", encoding="utf-8", errors="ignore") as fp:
        content = fp.read()
        if "100%%" in content:
            has_100_percent.append(f)
        if '"FAQPage"' in content or '"@type": "FAQPage"' in content or "'FAQPage'" in content:
            has_faq_page.append(f)

print(f"Files with 100%% typo: {has_100_percent}")
print(f"Files with FAQPage schema: {has_faq_page}")

with open("dist/index.html", "r", encoding="utf-8") as fp:
    idx_content = fp.read()
    h1_match = re.search(r'<h1[^>]*>(.*?)</h1>', idx_content, re.S)
    print("dist/index.html H1:", re.sub(r'\s+', ' ', h1_match.group(1)).strip() if h1_match else "None")
    print("dist/index.html has source-page input:", 'id="source-page"' in idx_content)

with open("dist/sars-online-traveller-declaration-business-travel.html", "r", encoding="utf-8") as fp:
    sars_content = fp.read()
    print("dist/sars mainEntityOfPage trailing slash:", "declaration-business-travel/\"" in sars_content)
    print("dist/sars title:", re.search(r'<title>(.*?)</title>', sars_content).group(1))
    print("dist/sars has AEO box:", "AEO Direct-Answer Summary Box" in sars_content)

"""Render the 1200x630 social share cards.

They live in public/assets/ rather than assets/ because they are only ever
referenced by absolute URL in og:image / twitter:image meta tags, which Vite
does not see and therefore does not bundle.

    python scripts/build_og_cards.py
"""
from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1200, 630
DARK = (15, 23, 42)      # rtm-dark
CARD = (30, 41, 59)      # rtm-card
ACCENT = (56, 189, 248)  # rtm-accent
FONT = 'C:/Windows/Fonts/Montserrat-%s.ttf'
OUT_DIR = 'public/assets'
MAX_BYTES = 200_000


def wrap(draw, text, font, maxw):
    words, lines, cur = text.split(), [], ''
    for word in words:
        candidate = (cur + ' ' + word).strip()
        if draw.textlength(candidate, font=font) <= maxw:
            cur = candidate
        else:
            lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


def card(filename, eyebrow, headline, sub):
    im = Image.new('RGB', (W, H), DARK)
    d = ImageDraw.Draw(im)
    for y in range(H):
        t = y / H
        d.line([(0, y), (W, y)], fill=tuple(
            int(DARK[i] + (CARD[i] - DARK[i]) * t) for i in range(3)))
    d.rectangle([0, 0, 14, H], fill=ACCENT)

    f_eye = ImageFont.truetype(FONT % 'SemiBold', 26)
    f_head = ImageFont.truetype(FONT % 'ExtraBold', 62)
    f_sub = ImageFont.truetype(FONT % 'Medium', 28)

    x, maxw = 80, W - 160
    d.text((x, 92), eyebrow.upper(), font=f_eye, fill=ACCENT)
    y = 150
    for line in wrap(d, headline, f_head, maxw):
        d.text((x, y), line, font=f_head, fill=(255, 255, 255))
        y += 76
    y += 18
    for line in wrap(d, sub, f_sub, maxw):
        d.text((x, y), line, font=f_sub, fill=(190, 202, 219))
        y += 40

    logo = Image.open('assets/Logo.png').convert('RGBA')
    lw = 210
    logo = logo.resize((lw, round(logo.height * lw / logo.width)), Image.LANCZOS)
    im.paste(logo, (W - lw - 70, H - logo.height - 52), logo)
    d.text((80, H - 76), 'rtmtravel.co.za',
           font=ImageFont.truetype(FONT % 'SemiBold', 24), fill=(148, 163, 184))

    path = os.path.join(OUT_DIR, filename)
    quality = 88
    while quality >= 55:
        im.save(path, 'JPEG', quality=quality, optimize=True, progressive=True)
        if os.path.getsize(path) <= MAX_BYTES:
            break
        quality -= 5
    print('%s  %d bytes' % (path, os.path.getsize(path)))


card('og-card.jpg', 'Cape Town · Johannesburg · South Africa',
     'Corporate Travel Management, Run Properly',
     'ASATA and IATA accredited. Certainty, control and 24/7 traveller support for South African businesses.')

card('og-card-sars.jpg', 'SARS Compliance Guide',
     'The SARS Online Traveller Declaration, Explained',
     'What South African business travellers must declare, when, and what happens if they do not.')

card('og-card-duty-of-care.jpg', 'Duty of Care',
     'Your Legal Duty of Care to Business Travellers',
     'What South African employers owe staff on the road, and how to prove you met it.')

card('og-card-policy.jpg', 'Free Template',
     'Corporate Travel Policy Template for SA Companies',
     'A fill-in-the-field policy document built for South African finance and HR teams.')

card('og-card-budget.jpg', 'Budget Benchmarks',
     'What Business Travel Actually Costs in South Africa',
     'Real 2026 benchmarks for flights, accommodation and ground transport.')

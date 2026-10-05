const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const seoTags = `
    <!-- SEO Technical Tags -->
    <link rel="canonical" href="https://www.rtmtravel.co.za/" />
    
    <!-- Open Graph Tags -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.rtmtravel.co.za/" />
    <meta property="og:title" content="Corporate Travel Management South Africa | RTM Travel" />
    <meta property="og:description" content="Premium corporate travel management (TMC) for South African businesses, CFOs and Executives. ASATA and IATA accredited. We provide certainty, control, and 24/7 support." />
    <meta property="og:image" content="https://www.rtmtravel.co.za/assets/Logo.png" />
    
    <!-- Schema Markup -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      "name": "Remmitz Travel Management",
      "alternateName": "RTM Travel",
      "url": "https://www.rtmtravel.co.za/",
      "logo": "https://www.rtmtravel.co.za/assets/Logo.png",
      "description": "Premium corporate travel management (TMC) for South African businesses, CFOs and Executives. ASATA and IATA accredited.",
      "areaServed": "South Africa",
      "founder": {
        "@type": "Person",
        "name": "Anthea Ronne"
      },
      "foundingDate": "2008",
      "knowsAbout": ["Corporate Travel Management", "Duty of Care", "Expense Management"]
    }
    </script>
</head>`;

html = html.replace('</head>', seoTags);
fs.writeFileSync('index.html', html);
console.log('Injected SEO tags successfully');

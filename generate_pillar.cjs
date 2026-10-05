const fs = require('fs');

const baseHtml = fs.readFileSync('index.html', 'utf8');

// Extract everything from top to the end of the Navigation
const navEndRegex = /<\/nav>/;
const navMatch = baseHtml.match(navEndRegex);
const topSection = baseHtml.substring(0, navMatch.index + navMatch[0].length);

// Extract footer onwards
const footerStartRegex = /<!-- Footer -->/;
const footerMatch = baseHtml.match(footerStartRegex);
const bottomSection = baseHtml.substring(footerMatch.index);

// Pillar Page Content
const pillarContent = `
    <!-- Hero Section -->
    <section class="relative pt-32 pb-20 w-full overflow-hidden bg-black min-h-[60vh] flex items-center">
        <img src="./assets/pillar-hero.jpg" class="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-60" alt="South African executive in airport lounge">
        <div class="absolute inset-0 bg-gradient-to-t from-rtm-dark via-rtm-dark/60 to-transparent z-10"></div>
        <div class="container mx-auto px-4 relative z-20">
            <div class="max-w-4xl mx-auto text-center">
                <p class="text-rtm-accent uppercase tracking-widest font-semibold mb-4 text-sm md:text-base">Executive Guide</p>
                <h1 class="text-4xl md:text-6xl font-bold mb-6 leading-tight">The Complete Guide to Corporate Travel Management in South Africa</h1>
                <p class="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">Why managing business travel in-house is costing your company money, productivity, and exposing you to unnecessary risk.</p>
            </div>
        </div>
    </section>

    <!-- Main Content -->
    <section class="py-16 bg-rtm-dark">
        <div class="container mx-auto px-4">
            <div class="max-w-3xl mx-auto prose prose-invert prose-lg prose-a:text-rtm-accent hover:prose-a:text-white">
                
                <h2 class="text-3xl font-bold mt-12 mb-6 text-white">I. Introduction: The Hidden Cost of Unmanaged Travel</h2>
                <p class="text-gray-300 leading-relaxed mb-6">In the fast-paced South African business environment, managing corporate travel in-house is often seen as a way to save money. An executive assistant or office manager spends hours scouring public booking sites, hunting for the cheapest flights, and trying to align itineraries with corporate meetings in Johannesburg, Cape Town, or international hubs. But what looks like a cost-saving measure on the surface is frequently a hidden drain on productivity, resources, and ultimate capital.</p>
                <p class="text-gray-300 leading-relaxed mb-6">The reality is that unmanaged business travel creates operational chaos. Without a dedicated corporate travel management strategy, companies lack central spend visibility, struggle to enforce travel policies, and crucially, leave themselves exposed to duty of care compliance risks when things go wrong.</p>
                <p class="text-gray-300 leading-relaxed mb-6">This is where a specialized <strong>Corporate Travel Management Company (TMC)</strong> changes the equation. For 18 years, Remmitz Travel Management has provided South African executives and finance teams with certainty, control, and responsiveness. As an <strong>ASATA and IATA accredited</strong> business travel agency, we understand that modern business travel isn't just about booking a seat on a plane—it's about protecting your people and your bottom line.</p>

                <div class="glass-card p-8 my-10 border-l-4 border-rtm-accent rounded-lg bg-white/5">
                    <h3 class="text-xl font-bold text-white mb-3">What is a TMC?</h3>
                    <p class="text-gray-300 m-0">A Travel Management Company (TMC) differs fundamentally from a traditional leisure travel agent. While a leisure agent focuses on selling holidays, a TMC acts as an outsourced extension of your finance and operations teams. A TMC negotiates corporate rates, enforces your travel policy, tracks your travellers globally for safety, and provides your CFO with granular data on where the travel budget is going.</p>
                </div>

                <h2 class="text-3xl font-bold mt-16 mb-6 text-white">II. The 4 Pillars of Effective Business Travel</h2>
                <p class="text-gray-300 leading-relaxed mb-6">To understand how a TMC transforms a business, you have to look beyond the booking process. The true value of corporate travel management in South Africa rests on four foundational pillars.</p>

                <h3 class="text-2xl font-semibold mt-10 mb-4 text-white">A. Policy & Compliance: Enforcing the Rules Without Friction</h3>
                <p class="text-gray-300 leading-relaxed mb-4">Every medium-to-large business needs a corporate travel policy. This document dictates who can fly business class, what the per-diem allowance is for hotels in Cape Town versus London, and how far in advance flights must be booked. The problem? Policies are notoriously difficult to enforce internally.</p>
                <p class="text-gray-300 leading-relaxed mb-6">When you partner with a TMC, policy compliance becomes automated. Our booking systems are pre-loaded with your specific corporate rules. If an executive tries to book a 5-star hotel when the policy dictates a 4-star limit, the system automatically flags it for approval. We play the "bad guy," enforcing your rules so your HR and finance teams don't have to deal with the friction.</p>

                <h3 class="text-2xl font-semibold mt-10 mb-4 text-white">B. Spend Visibility & Reporting: Dashboards for the CFO</h3>
                <p class="text-gray-300 leading-relaxed mb-4">You cannot optimize what you cannot see. Unmanaged corporate travel usually results in fractured billing: flights on one corporate credit card, hotels paid by the traveller and expensed later, and Ubers scattered across various team accounts. This makes total travel spend visibility nearly impossible to achieve.</p>
                <p class="text-gray-300 leading-relaxed mb-6">A premium TMC consolidates all travel expenses into a single, comprehensive reporting framework. We provide CFO-ready dashboards that break down exactly where your budget is going. Are you booking too late and paying a premium? Which airline do you use most often, and can we negotiate a better corporate rate with them? By centralizing the data, we routinely help companies identify areas where they can reduce travel costs by 15% to 20% annually.</p>

                <h3 class="text-2xl font-semibold mt-10 mb-4 text-white">C. Duty of Care & Risk Management</h3>
                <p class="text-gray-300 leading-relaxed mb-4">Duty of care is not a buzzword; it is a legal and moral obligation that a company has to its employees while they are travelling for business. If a strike halts operations at OR Tambo International, or a political event disrupts flights globally, do you know exactly where your travelling staff are?</p>
                <p class="text-gray-300 leading-relaxed mb-6">Traveller tracking and 24/7 global support are non-negotiable elements of modern corporate travel management. At RTM Travel, our team is always available. We monitor global disruptions and proactively reroute your team before they even realize their flight has been cancelled. When your executives are stranded at 2:00 AM in a foreign country, they don't call a 1-800 helpline; they call their dedicated RTM consultant who acts fast to resolve the challenge.</p>

                <h3 class="text-2xl font-semibold mt-10 mb-4 text-white">D. Executive VIP Services</h3>
                <p class="text-gray-300 leading-relaxed mb-6">For C-suite executives, time is the ultimate currency. VIP business travel services ensure that leadership teams experience zero friction. This includes organizing executive car hire directly on the tarmac, arranging private meeting rooms in premium airport lounges, and ensuring that specific dietary and seating preferences are flawlessly executed on every single booking.</p>

                <h2 class="text-3xl font-bold mt-16 mb-6 text-white">III. Why South African Businesses Need Localized Support</h2>
                <p class="text-gray-300 leading-relaxed mb-6">While global TMC megacorporations exist, they often route support calls to overseas call centers where agents lack local context. Managing business travel in South Africa and the broader African continent requires nuanced, localized expertise.</p>
                <ul class="list-disc pl-6 space-y-4 text-gray-300 mb-8">
                    <li><strong>Regional Logistics:</strong> Understanding the intricacies of multi-leg African travel, visa requirements for SADC regions, and the realities of domestic flight schedules between Johannesburg, Cape Town, and Durban.</li>
                    <li><strong>Financial Alignment:</strong> Navigating local corporate billing requirements, VAT reconciliations, and providing invoices that align perfectly with South African accounting standards.</li>
                    <li><strong>Personal Relationships:</strong> In the South African business landscape, relationships matter. A boutique agency like Remmitz Travel Management combines the high-tech reporting capabilities of a global agency with the high-touch, highly personalized service of a local partner.</li>
                </ul>

                <h2 class="text-3xl font-bold mt-16 mb-6 text-white">IV. How to Choose the Right TMC for Your Business</h2>
                <p class="text-gray-300 leading-relaxed mb-4">If you are transitioning from unmanaged travel to a formal corporate travel management program, use this checklist to evaluate potential TMC partners:</p>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                    <div class="bg-rtm-card p-6 rounded-lg">
                        <svg class="w-8 h-8 text-rtm-accent mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
                        <h4 class="font-bold text-white mb-2">Check Accreditations</h4>
                        <p class="text-sm text-gray-400">Never partner with an unaccredited agency. Ensure they hold both ASATA and IATA certifications. This is your guarantee of their financial stability and professional integrity.</p>
                    </div>
                    <div class="bg-rtm-card p-6 rounded-lg">
                        <svg class="w-8 h-8 text-rtm-accent mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <h4 class="font-bold text-white mb-2">Test Response Times</h4>
                        <p class="text-sm text-gray-400">Ask about their after-hours process. Do you get a dedicated consultant who knows your business, or are you routed to a generic call center?</p>
                    </div>
                    <div class="bg-rtm-card p-6 rounded-lg">
                        <svg class="w-8 h-8 text-rtm-accent mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                        <h4 class="font-bold text-white mb-2">Review Reporting Tech</h4>
                        <p class="text-sm text-gray-400">A TMC should be able to provide you with clear, accurate reporting on your travel spend, missed savings, and policy compliance.</p>
                    </div>
                    <div class="bg-rtm-card p-6 rounded-lg">
                        <svg class="w-8 h-8 text-rtm-accent mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        <h4 class="font-bold text-white mb-2">Assess Duty of Care</h4>
                        <p class="text-sm text-gray-400">Ensure they have robust traveller tracking software and standard operating procedures for managing global disruptions and emergencies.</p>
                    </div>
                </div>

                <h2 class="text-3xl font-bold mt-16 mb-6 text-white">V. Conclusion: Outsource the Chaos</h2>
                <p class="text-gray-300 leading-relaxed mb-6">Corporate travel does not have to be a source of stress, leaked revenue, and endless administrative work. By partnering with a specialized corporate travel management company, you elevate your travel program from a purely logistical task to a strategic business asset.</p>
                <p class="text-gray-300 leading-relaxed mb-10">With 18 years of experience, Remmitz Travel Management is uniquely positioned to help your company travel smarter, safer, and more efficiently.</p>

                <div class="bg-rtm-accent/10 border border-rtm-accent/30 rounded-xl p-8 text-center">
                    <h3 class="text-2xl font-bold text-white mb-4">Ready to simplify your corporate travel?</h3>
                    <p class="text-gray-300 mb-6 max-w-lg mx-auto">Tell us what your team needs, and we will help shape a cleaner, more controlled travel workflow tailored to your business.</p>
                    <a href="index.html#contact" class="btn-primary inline-block">Request a Workflow Consultation</a>
                </div>

            </div>
        </div>
    </section>
`;

// Modify the title slightly so it's accurate for the pillar page
let customTop = topSection.replace(
    '<title>Corporate Travel Management South Africa | RTM Travel</title>',
    '<title>Complete Guide to Corporate Travel Management | RTM Travel</title>'
);
customTop = customTop.replace(
    'href="index.html#contact"',
    'href="index.html#contact"'
);

// We need to adjust anchor links in the nav from `#about` to `index.html#about` since we are on a subpage
customTop = customTop.replace(/href="#services"/g, 'href="index.html#services"');
customTop = customTop.replace(/href="#about"/g, 'href="index.html#about"');
customTop = customTop.replace(/href="#contact"/g, 'href="index.html#contact"');

const finalHtml = customTop + pillarContent + bottomSection;

fs.writeFileSync('corporate-travel-management.html', finalHtml);
console.log('Pillar page created: corporate-travel-management.html');

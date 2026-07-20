const fs = require('fs');

let c = fs.readFileSync('index.html', 'utf8');

c = c.replace(
    '<title>RTM Travel | Corporate Travel Management</title>',
    '<title>Corporate Travel Management South Africa | RTM Travel</title>'
);

c = c.replace(
    'content="Ultra-modern, premium corporate travel management for CFOs and Executives. Certainty, control, and responsiveness."',
    'content="Premium corporate travel management (TMC) for South African businesses, CFOs and Executives. ASATA and IATA accredited. We provide certainty, control, and 24/7 support."'
);

const aboutOld = `                <h2 class="text-3xl md:text-5xl font-bold mb-4">Premium Corporate Travel Management for the Modern Business World</h2>
                <p class="text-gray-300 leading-relaxed mb-5">
                    Established in 2008, Remmitz Travel Management is a specialist corporate travel management company built on reliability, efficiency, personal service, and fast problem-solving.
                </p>
                <p class="text-gray-300 leading-relaxed mb-5">
                    For 18 years, we have supported businesses with professional travel solutions designed around the realities of modern corporate life. We understand that business travel is not just about booking flights, hotels, and transfers. It is about keeping people moving, protecting productivity, managing costs, reducing risk, and ensuring that every traveller is supported wherever they are in the world.
                </p>
                <p class="text-gray-300 leading-relaxed mb-5">
                    At Remmitz Travel, our strength lies in how well we understand our clients. We take the time to get close to your business, your operational structure, your travel policies, approval processes, budget requirements, and the individual preferences of your travellers. This allows us to deliver corporate travel support that is not only reliable, but also highly personalised, responsive, and seamless.
                </p>
                <div class="glass-card p-6 my-8">
                    <p class="text-xl md:text-2xl font-semibold text-white">Always available. Always act fast. Always resolve challenges.</p>
                </div>
                <p class="text-gray-300 leading-relaxed mb-5">
                    Whether it is a last-minute flight change, an urgent travel request, a disrupted itinerary, or a traveller needing support after hours, our team responds with speed, professionalism, and care. We know that in corporate travel, delays and uncertainty can have a direct impact on your business. That is why we focus on clear communication, proactive service, and practical solutions when they matter most.
                </p>
                <p class="text-gray-300 leading-relaxed mb-5">
                    As a dedicated corporate travel management company, Remmitz Travel Management provides end-to-end support for business travel, including flight bookings, accommodation, car hire, travel coordination, itinerary management, traveller assistance, and policy-aligned travel planning. Every solution is designed to help companies travel smarter, control travel spend, and give their teams the confidence that they are supported from departure to return.
                </p>
                <p class="text-gray-300 leading-relaxed mb-5">
                    We combine the personal attention of a hands-on travel partner with the discipline required by corporate clients. Our approach is built around trust, consistency, and long-term client relationships. We do not believe in one-size-fits-all travel management. We believe in understanding each client properly, anticipating their needs, and delivering service that feels both professional and personal.
                </p>
                <p class="text-gray-300 leading-relaxed mb-8">
                    For businesses that need a dependable travel partner, Remmitz Travel Management offers the experience, responsiveness, and commitment required to keep corporate travel running smoothly.
                </p>`;

const aboutNew = `                <h2 class="text-3xl md:text-5xl font-bold mb-4">Corporate Travel Management South Africa</h2>
                <p class="text-gray-300 leading-relaxed mb-5">
                    Established in 2008, Remmitz Travel Management is a specialist <strong>corporate travel management company (TMC)</strong> built on reliability, efficiency, personal service, and fast problem-solving. We serve clients across <strong>South Africa, including Johannesburg and Cape Town</strong>, as well as managing global business travel requirements.
                </p>
                
                <div class="glass-card p-6 my-8 border-l-4 border-l-rtm-accent">
                    <h3 class="text-xl md:text-2xl font-semibold text-white mb-2">Industry Accredited & Trusted</h3>
                    <p class="text-gray-300">As an <strong>ASATA accredited</strong> and <strong>IATA accredited</strong> business travel agency, we adhere to the highest industry standards for financial security, professionalism, and operational excellence. When you partner with us, your corporate travel is in safe, certified hands.</p>
                </div>

                <p class="text-gray-300 leading-relaxed mb-5">
                    For 18 years, we have supported businesses with professional travel solutions designed around the realities of modern corporate life. We understand that business travel is not just about booking corporate flights, hotels, and transfers. It is about keeping people moving, protecting productivity, <strong>expense management</strong>, reducing risk, and ensuring that every traveller is supported wherever they are in the world.
                </p>
                <p class="text-gray-300 leading-relaxed mb-5">
                    At Remmitz Travel, our strength lies in how well we understand our clients. We take the time to get close to your business, your operational structure, your <strong>travel policy</strong>, approval processes, budget requirements, and the individual preferences of your travellers. This allows us to deliver corporate travel support that is not only reliable, but also highly personalised, responsive, and seamless.
                </p>
                <div class="glass-card p-6 my-8">
                    <p class="text-xl md:text-2xl font-semibold text-white">Always available. Always act fast. Always resolve challenges.</p>
                </div>
                <p class="text-gray-300 leading-relaxed mb-5">
                    Whether it is a last-minute flight change, an urgent travel request, a disrupted itinerary, or a traveller needing support after hours, our team responds with speed, professionalism, and care. We provide <strong>24/7 support</strong> and comprehensive duty of care compliance. We know that in corporate travel, delays and uncertainty can have a direct impact on your business. That is why we focus on clear communication, proactive service, and practical solutions when they matter most.
                </p>
                <p class="text-gray-300 leading-relaxed mb-5">
                    As a dedicated corporate travel management company, Remmitz Travel Management provides end-to-end support for business travel. We leverage our network to secure the best <strong>negotiated rates</strong> for our clients on flights, accommodation, and car hire. Every solution is designed to help companies travel smarter, achieve total <strong>spend visibility</strong> through detailed reporting, and give their teams the confidence that they are supported from departure to return.
                </p>
                <p class="text-gray-300 leading-relaxed mb-5">
                    We combine the personal attention of a hands-on travel partner with the discipline required by corporate clients. Our approach is built around trust, consistency, and long-term client relationships. We do not believe in one-size-fits-all travel management.
                </p>
                <p class="text-gray-300 leading-relaxed mb-8">
                    For businesses that need a dependable travel partner, Remmitz Travel Management offers the experience, responsiveness, and commitment required to keep corporate travel running smoothly.
                </p>`;

// Fix line endings for replacement to be robust
const normalize = str => str.replace(/\r\n/g, '\n').trim();
c = normalize(c).replace(normalize(aboutOld), normalize(aboutNew));

fs.writeFileSync('index.html', c);
console.log('Update complete');

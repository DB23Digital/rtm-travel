import './style.css'
import './hero-film.css'
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { mountHeroFilm } from './hero-film.js';

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    console.log('RTM Travel website loaded');

    const heroMode = document.documentElement.dataset.hero === 'classic' ? 'classic' : 'film';

    // --- Scroll-film hero (aircraft window -> four landmarks -> cabin) ---
    const heroSection = document.getElementById('hero-section');
    if (heroMode === 'film' && heroSection) {
        try {
            mountHeroFilm(heroSection);
        } catch (err) {
            console.error('hero-film failed to boot, staying on static fallback', err);
        }
    }

    // --- Classic hero (kept for the client-facing A/B preview toggle) ---
    const classicCanvas = document.getElementById('hero-canvas-classic');
    if (heroMode === 'classic' && classicCanvas) {
        const context = classicCanvas.getContext('2d');
        const frameCount = 40;
        const currentFrame = { index: 0 };
        const images = [];
        const baseUrl = import.meta.env.BASE_URL || './';
        const getImageUrl = (index) => `${baseUrl}ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`;

        const render = () => {
            if (!images[currentFrame.index]) return;
            const img = images[currentFrame.index];
            const scale = Math.max(classicCanvas.width / img.width, classicCanvas.height / img.height);
            const x = (classicCanvas.width / 2) - (img.width / 2) * scale;
            const y = (classicCanvas.height / 2) - (img.height / 2) * scale;
            context.clearRect(0, 0, classicCanvas.width, classicCanvas.height);
            context.drawImage(img, x, y, img.width * scale, img.height * scale);
        };

        const loadFrame = (i) => {
            const img = new Image();
            img.onload = () => {
                if (i === 0) {
                    render();
                    gsap.to('#hero-title-classic, #hero-subtitle-classic, #hero-cta-classic', {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        stagger: 0.2,
                        ease: 'power2.out'
                    });
                    const preloadRemainingFrames = () => {
                        for (let next = 1; next < frameCount; next++) loadFrame(next);
                    };
                    if ('requestIdleCallback' in window) {
                        window.requestIdleCallback(preloadRemainingFrames, { timeout: 1500 });
                    } else {
                        window.setTimeout(preloadRemainingFrames, 250);
                    }
                }
            };
            img.src = getImageUrl(i);
            images[i] = img;
        };
        loadFrame(0);

        const resizeCanvas = () => {
            classicCanvas.width = window.innerWidth;
            classicCanvas.height = window.innerHeight;
            render();
        };
        let resizeFrame;
        window.addEventListener('resize', () => {
            window.cancelAnimationFrame(resizeFrame);
            resizeFrame = window.requestAnimationFrame(resizeCanvas);
        });
        resizeCanvas();

        gsap.to(currentFrame, {
            index: frameCount - 1,
            snap: 'index',
            ease: 'none',
            scrollTrigger: {
                trigger: '#hero-section-classic',
                start: 'top top',
                end: '+=200%',
                scrub: 0.5,
                pin: true,
            },
            onUpdate: render
        });
    }

    // Mobile menu toggle
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('navbar-sticky');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const isExpanded = !mobileMenu.classList.contains('hidden');
            menuBtn.setAttribute('aria-expanded', String(isExpanded));
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;

            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth'
            });

            if (mobileMenu && menuBtn && window.innerWidth < 768) {
                mobileMenu.classList.add('hidden');
                menuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Scroll-driven parallax fallback
    window.addEventListener('scroll', function () {
        const scrolled = window.pageYOffset;
        const parallaxLayers = document.querySelectorAll('.parallax-layer');
        parallaxLayers.forEach((layer, index) => {
            // Preserve 3D transforms by re-applying them
            let baseTransform = '';
            if (layer.classList.contains('background-layer')) {
                baseTransform = 'translateZ(-1px) scale(2)';
            } else if (layer.classList.contains('midground-layer')) {
                baseTransform = 'translateZ(-0.5px) scale(1.5)';
            }

            // Speed factor: index 0 (background) -> 0.5, index 1 (midground) -> 1.0
            const speed = (index + 1) * 0.5;
            layer.style.transform = `${baseTransform} translateY(${scrolled * speed}px)`;
        });
    });
    // Handle Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submit-btn');
            const spinner = document.getElementById('loading-spinner');
            const btnText = submitBtn.querySelector('span');
            const successState = document.getElementById('form-success');
            const errorState = document.getElementById('form-error');
            
            // Reset states
            errorState.classList.add('hidden');
            
            // Loading state
            submitBtn.disabled = true;
            spinner.classList.remove('hidden');
            btnText.textContent = 'Sending...';

            // Gather data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('contact.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok && result.status === 'success') {
                    // Show success state
                    contactForm.reset();
                    successState.classList.remove('hidden');
                    successState.classList.add('flex');
                } else {
                    throw new Error(result.message || 'Error submitting form');
                }
            } catch (error) {
                console.error('Contact form error:', error);
                errorState.classList.remove('hidden');
            } finally {
                // Reset button state
                submitBtn.disabled = false;
                spinner.classList.add('hidden');
                btnText.textContent = 'Send Message';
            }
        });

        // Handle success close button
        const closeSuccess = document.getElementById('close-success');
        if (closeSuccess) {
            const successState = document.getElementById('form-success');
            closeSuccess.addEventListener('click', () => {
                successState.classList.add('hidden');
                successState.classList.remove('flex');
            });
        }
    }
});

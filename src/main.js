import './style.css'
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    console.log('RTM Travel website loaded');

    const baseUrl = import.meta.env.BASE_URL || './';
    const getImageUrl = (index) => {
        const paddedIndex = (index + 1).toString().padStart(3, '0');
        return `${baseUrl}ezgif-frame-${paddedIndex}.jpg`;
    };

    // --- GSAP Hero Animation ---
    const canvas = document.getElementById("hero-canvas");
    if (canvas) {
        const context = canvas.getContext("2d");
        const frameCount = 40;
        const currentFrame = { index: 0 };
        const images = [];

        const loadFrame = (i) => {
            const img = new Image();
            img.onload = () => {
                if (i === 0) {
                    render();
                    gsap.to("#hero-title, #hero-subtitle, #hero-cta", {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        stagger: 0.2,
                        ease: "power2.out"
                    });

                    // Let the browser finish above-the-fold rendering before
                    // downloading the remaining animation frames.
                    const preloadRemainingFrames = () => {
                        for (let next = 1; next < frameCount; next++) {
                            loadFrame(next);
                        }
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

        // Load only the first frame on the critical rendering path.
        loadFrame(0);

        const render = () => {
            if (!images[currentFrame.index]) return;

            // "cover" fit logic
            const img = images[currentFrame.index];
            const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
            const x = (canvas.width / 2) - (img.width / 2) * scale;
            const y = (canvas.height / 2) - (img.height / 2) * scale;

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(img, x, y, img.width * scale, img.height * scale);
        };

        // Resize handler
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            render();
        };
        let resizeFrame;
        window.addEventListener('resize', () => {
            window.cancelAnimationFrame(resizeFrame);
            resizeFrame = window.requestAnimationFrame(resizeCanvas);
        });
        resizeCanvas(); // init

        // ScrollTrigger
        gsap.to(currentFrame, {
            index: frameCount - 1,
            snap: "index",
            ease: "none",
            scrollTrigger: {
                trigger: "#hero-section",
                start: "top top",
                end: "+=200%", // Scroll distance to complete animation
                scrub: 0.5, // Smooth scrubbing
                pin: true,  // Pin the hero section during scroll
                // markers: true, // Uncomment for debug
            },
            onUpdate: render
        });
    } else {
        const backgroundLayer = document.querySelector('.background-layer');
        const midgroundLayer = document.querySelector('.midground-layer');

        if (backgroundLayer) {
            backgroundLayer.style.backgroundImage = `url("${getImageUrl(0)}")`;
        }

        if (midgroundLayer) {
            midgroundLayer.style.backgroundImage = `url("${getImageUrl(19)}")`;
        }

        gsap.fromTo("#hero h1, #hero p, #hero .btn-primary, #hero .btn-secondary", {
            opacity: 0,
            y: 32
        }, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: "power2.out"
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

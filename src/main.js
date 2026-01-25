import './style.css'

// Interactivity scripts

import './style.css'
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    console.log('RTM Travel website loaded');

    // --- GSAP Hero Animation ---
    const canvas = document.getElementById("hero-canvas");
    if (canvas) {
        const context = canvas.getContext("2d");
        const frameCount = 40;
        const currentFrame = { index: 0 };
        const images = [];

        // Helper to format filenames: ezgif-frame-001.jpg, etc.
        const getImageUrl = (index) => {
            const paddedIndex = (index + 1).toString().padStart(3, '0');
            return `./assets/ezgif-frame-${paddedIndex}.jpg`;
        };

        // Preload images
        let imagesLoaded = 0;
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.src = getImageUrl(i);
            img.onload = () => {
                imagesLoaded++;
                if (imagesLoaded === 1) { // Render first frame immediately
                    render();
                    // Animate in text once first image is ready
                    gsap.to("#hero-title, #hero-subtitle, #hero-cta", {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        stagger: 0.2,
                        ease: "power2.out"
                    });
                }
            };
            images.push(img);
        }

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
        window.addEventListener('resize', resizeCanvas);
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
    }
    console.log('RTM Travel website loaded');

    // Mobile menu toggle (placeholder for now)
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

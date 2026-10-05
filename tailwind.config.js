/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'rtm-dark': '#0f172a', // Dark slate
                'rtm-card': '#1e293b', // Slightly lighter for cards
                'rtm-accent': '#38bdf8', // Light blue accent (can adjust)
                'rtm-glass': 'rgba(255, 255, 255, 0.05)',
                'rtm-glass-border': 'rgba(255, 255, 255, 0.1)',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            backgroundImage: {
                'hero-gradient': 'linear-gradient(to bottom right, #0f172a, #1e293b)',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(-10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            },
            animation: {
                fadeIn: 'fadeIn 0.3s ease-out forwards',
            }
        },
    },
    plugins: [],
}

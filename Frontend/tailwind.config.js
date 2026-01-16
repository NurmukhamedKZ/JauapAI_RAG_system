/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'hero-1': '#0E6B4A',
                'hero-2': '#00A67A',
                'hero-3': '#7EE3B9',
                'bg-light': '#F2FFF6',
                'surface': '#FFFFFF',
                'text-dark': '#09302A',
                'text-light': '#FFFFFF',
                'muted': '#7EAFA0',
                'cta': '#00B07F',
                'cta-hover': '#008D60',
                'accent': '#0E6B4A',
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'slide-up': 'slideUp 0.5s ease-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            }
        },
    },
    plugins: [],
}

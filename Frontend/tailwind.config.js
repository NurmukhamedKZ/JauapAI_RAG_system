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
                // The Void (Backgrounds)
                void: '#020617', // Slate 950 - Main background
                surface: '#0f172a', // Slate 900 - Card background
                'surface-highlight': '#1e293b', // Slate 800 - Card hover

                // The Emerald (Primary)
                'emerald-deep': '#022c22', // Deep green for heavy elements
                'emerald-glow': '#10b981', // Neon green for accents/glows
                'emerald-dim': 'rgba(16, 185, 129, 0.1)', // Subtle green tint

                // Text
                'text-main': '#f8fafc', // Slate 50
                'text-muted': '#94a3b8', // Slate 400
                'text-dim': '#64748b', // Slate 500
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                heading: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'blob': 'blob 7s infinite',
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
            },
            keyframes: {
                blob: {
                    '0%': { transform: 'translate(0px, 0px) scale(1)' },
                    '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
                    '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
                    '100%': { transform: 'translate(0px, 0px) scale(1)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                glow: {
                    'from': { boxShadow: '0 0 10px -10px #10b981' },
                    'to': { boxShadow: '0 0 20px 5px #10b981' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #022c22 0deg, #059669 180deg, #022c22 360deg)',
            }
        },
    },
    plugins: [],
}

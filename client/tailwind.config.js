/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'cyber-black': '#050505',
                'cyber-dark-gray': '#1a1a1a',
                'cyber-green': '#00ff41',
                'cyber-text': '#e5e5e5',
                'cyber-text-muted': '#a3a3a3',
            },
            fontFamily: {
                mono: ['"JetBrains Mono"', 'monospace'],
                sans: ['"Jost"', 'sans-serif'],
                mermaid: ['"Playfair Display"', 'serif'],
            },
            boxShadow: {
                'cyber': '0 0 10px #00ff41',
                'cyber-hover': '0 0 20px #00ff41',
            },
        },
    },
    plugins: [],
}

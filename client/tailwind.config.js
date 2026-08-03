/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-color)',
        text: 'var(--text-color)',
        gold: 'var(--auction-gold)',
        charcoal: 'var(--auction-charcoal)',
      },
      fontFamily: {
        primary: 'var(--font-primary)',
        accent: 'var(--font-accent)',
        classic: 'var(--font-classic)',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sacred-sand': '#F4E4BC',
        'lapis-night': '#0F172A',
        'cosmic-teal': '#0D9488',
        'divine-gold': '#F59E0B',
        'nebula-purple': '#6366F1', // Un peu plus vibrant pour le contraste
      },
      fontFamily: {
        serif: ['"Cinzel"', '"Playfair Display"', 'serif'], // On visera ces polices plus tard
      }
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Outfit', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      colors: {
        slicePurple: '#7c3aed', // Primary purple branding color
        sliceLightPurple: '#a78bfa',
      }
    },
  },
  plugins: [],
}

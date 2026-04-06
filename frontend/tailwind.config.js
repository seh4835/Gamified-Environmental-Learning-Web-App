/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#16a34a",   // green-600
        secondary: "#22c55e", // green-500
        accent: "#4ade80",    // green-400
        dark: "#166534",      // green-800
      }
    },
  },
  plugins: [],
}
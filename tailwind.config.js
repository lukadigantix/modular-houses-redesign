/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "var(--cream)",
        ink: "var(--ink)",
        sand: "var(--sand)",
        "brown-dark": "var(--brown-dark)",
        "brown-deep": "var(--brown-deep)",
      },
      fontFamily: {
        sans: ["var(--font-host-grotesk)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

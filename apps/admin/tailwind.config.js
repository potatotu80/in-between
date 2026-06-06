/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slatebrand: "#0f172a",
        accent: "#14b8a6",
        panel: "#111827",
        ink: "#e5eefc",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(2, 6, 23, 0.22)",
      },
      fontFamily: {
        display: ["Georgia", "Times New Roman", "serif"],
        body: ["Segoe UI", "Trebuchet MS", "sans-serif"],
      },
    },
  },
  plugins: [],
};

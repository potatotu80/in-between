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
        ember: {
          50: "#fff6ed",
          100: "#ffe7cc",
          200: "#ffd099",
          300: "#ffae5c",
          400: "#ff8f33",
          500: "#f56a0a",
          600: "#d94f00",
          700: "#a83905",
          800: "#872f0d",
          900: "#6e280f"
        },
        lacquer: "#1f1111",
        jade: "#0f7b6c",
        parchment: "#f7eedf"
      },
      boxShadow: {
        card: "0 18px 40px rgba(26, 12, 12, 0.18)",
      },
      backgroundImage: {
        "table-felt":
          "radial-gradient(circle at top, rgba(255,255,255,0.14), transparent 30%), linear-gradient(135deg, rgba(245,106,10,0.16), transparent 42%), linear-gradient(180deg, #17554f 0%, #103936 100%)",
      },
      fontFamily: {
        display: ["Georgia", "Times New Roman", "serif"],
        body: ["Trebuchet MS", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};

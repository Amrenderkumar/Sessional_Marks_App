/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#f0f4f9",
          100: "#d9e2ed",
          500: "#1e3a5f",
          600: "#172d4a",
          700: "#102036",
          900: "#0a1421",
        },
        gold: {
          400: "#d4a544",
          500: "#c89530",
          600: "#a87a20",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

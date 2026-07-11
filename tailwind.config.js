/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#fffafc",
        lavender: "#E9DEFC",
        violet: "#9663D9",
        ink: "#0E505C",
        mint: "#6AD2B7",
      },
      boxShadow: {
        glow: "0 24px 70px rgba(14, 80, 92, 0.18)",
        violet: "0 18px 36px rgba(150, 99, 217, 0.32)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "Montserrat Alternates",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

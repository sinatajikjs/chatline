/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  important: "#root",
  theme: {
    extend: {
      colors: {
        modalBg: "rgba(0,0,0, 0.3)",
        blue: {
          950: "#17275c",
        },
        textSecondary: "#707579",
        primary: "#3A76F0",
      },
      fontFamily: {
        sans: ["Roboto"],
      },
    },
    screens: {
      tablet: { min: "600px" },
    },
  },
  plugins: [],
};

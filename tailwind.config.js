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
        primary: "#3A76F0",
      },
    },
    screens: {
      mobile: { max: "360px" },
    },
  },
  plugins: [],
};

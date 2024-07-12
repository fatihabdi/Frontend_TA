const { text } = require('stream/consumers');

/** @type {import('tailwindcss/types').Config} */
const config = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1366px",
      default: "1440px",
      "3xl": "1536px",
      "4xl": "1680px",
      "5xl": "1920px",
      "6xl": "2560px",
    },
    extend: {},
    fontFamily: {
      sans: ["Inter", "sans-serif"], // Not Sure but will updated in the future
    },
    colors: {
      Primary: {
        25: "F5F9FF",
        50: "#EBF3FF",
        100: "#D4E3FB",
        200: "#AFC6F2",
        300: "#7D9BD7",
        400: "#536FB0",
        500: "#253D7B",
        600: "#1B2E69",
        700: "#122158",
        800: "#0B1747",
        900: "#07103B",
        950: "#060E2D"
      },
      Base: {
        white: "#FFFFFF",
        black: "#000000",
        blacktext: "#333333",
      },
      Gray: {
        25: "#FCFCFD",
        50: "#F9FAFB",
        100: "#F2F4F7",
        200: "#EAECF0",
        300: "#D0D5DD",
        400: "#98A2B3",
        500: "#667085",
        600: "#475467",
        700: "#344054",
        800: "#1D2939",
        900: "#101828",
        950: "#0C111D",
      },
      Error: {
        25: "#FFF7F5",
        50: "#FFEBEB",
        100: "#FAD5CC",
        200: "#F4A69C",
        300: "#DE6665",
        400: "#BD3E49",
        500: "#910F27",
        600: "#7C0A2B",
        700: "#B42318",
        800: "#912018",
        900: "#7A271A",
        950: "#55160C",
      },
      Warning: {
        25: "#FFFBF3",
        50: "#FEF5E2",
        100: "#FBEBCA",
        200: "#B2F1A2",
        300: "#E7AD63",
        400: "#CF853A",
        500: "#B05409",
        600: "#953F04",
        700: "#7D2E05",
        800: "#652003",
        900: "#531402",
        950: "#3D0E00",
      },
      Success: {
        25: "#F6FEF9",
        50: "#ECFDF3",
        100: "#DCFAE6",
        200: "#ABEFC6",
        300: "#75E0A7",
        400: "#47CD89",
        500: "#17B26A",
        600: "#079455",
        700: "#067647",
        800: "#085D3A",
        900: "#074D31",
        950: "#053321",
      },
      Purple: {
        25: "#F6FEF9",
        50: "#ECFDF3",
        100: "#DCFAE6",
        200: "#ABEFC6",
        300: "#75E0A7",
        400: "#47CD89",
        500: "#17B26A",
        600: "#079455",
        700: "#067647",
        800: "#085D3A",
        900: "#074D31",
        950: "#053321",
      },
      Yellow: {
        25: "#F6FEF9",
        50: "#ECFDF3",
        100: "#DCFAE6",
        200: "#ABEFC6",
        300: "#75E0A7",
        400: "#47CD89",
        500: "#17B26A",
        600: "#079455",
        700: "#067647",
        800: "#085D3A",
        900: "#074D31",
        950: "#053321",
      },
    },
  },
  plugins: [],
};

module.exports = config;

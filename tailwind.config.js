/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        heading: "#42446E",
        content: "#666666",
        primary: "#13B0F5",
        secondary: "#E70FAA",
        hover: "#13B0F5",
        text: "#FFFFFF",
        background: "#0b0317",
      },
      height: { half: "50vh" },
      fontFamily: {
        sans: ["Poppins"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

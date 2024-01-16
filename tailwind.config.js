/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    backgroundColor: (theme) => ({
      ...theme("colors"),
      background: "#FAFBFD",
    }),
    extend: {
      colors: {
        primary: "#009AFF",
        primaryLight: "#CDEAFE",
        primaryHover: "#008ae5",
        secondary: "#B84CEB",
        primaryInfusion: "#E0EFFF",
        "customGray-25": "#F9FAFB",
        "customGray-50": "#EFF1F5",
        "customGray-75": "#E2E5ED",
        "customGray-100": "#D1D6E6",
        "customGray-125": "#C2C8DD",
        "customGray-150": "#B4BCD4",
        "customGray-175": "#A9B1C7",
        "customGray-200": "#9DA4B9",
        "customGray-300": "#828BA4",
        "customGray-400": "#6A7287",
        "customGray-500": "#585F70",
        "customGray-600": "#464B59",
        "customGray-700": "#373B46",
        "customGray-800": "#242931",
        "customGray-900": "#1F272E",
        "customRed-500": "#EB364B",
        "customGreen-400": "#70D182",
        "customPurple-100": "#070522",
        "customTeal-100": "#003B66",
      },
      fontFamily: {
        // nunito: ["Nunito", "sans-serif"],
        // nunitoSans: ["Nunito Sans", "sans-serif"],
      },
      borderWidth: {
        0.5: "0.5px",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

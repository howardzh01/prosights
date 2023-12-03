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
        secondary: "#B84CEB",
        primaryInfusion: "#E0EFFF",
        "customGray-100": "#EFF2F5",
        "customGray-200": "#DAE1E7",
        "customGray-300": "#B8C2CC",
        "customGray-400": "#A2AEB9",
        "customGray-500": "#8795A1",
        "customGray-600": "#606F7B",
        "customGray-700": "#43576B",
        "customGray-800": "#3D4852",
        "customGray-900": "#1F272E",
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

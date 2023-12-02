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
      primary: "#009AFF",
    }),
    extend: {
      fontFamily: {
        // nunito: ["Nunito", "sans-serif"],
        // nunitoSans: ["Nunito Sans", "sans-serif"],
      },
      borderWidth: {
        0.5: "0.5px",
      },
      textColor: {
        primary: "#009AFF",
        secondary: "#B84CEB",
      },
      borderColor: {
        primary: "#009AFF",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

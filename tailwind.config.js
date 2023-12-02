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
      primary: "#0177FB",
      highlight: "#CCEAFD",
      secondary: "#66CCB3",
      tertiary: "#BE7EDC",
      customDarkGray: "#43576B",
      customGray: "#E6EBEF",
      customMediumGray: "#B8C2CC",
      customLightGray: "#F5F7F9",
      customDarkModeSecondary: "#3D4852",
      dark: "#2f3136",
      customDarkBlue: "#001529",
      alert: "#F71111",
    }),
    extend: {
      fontFamily: {
        nunito: ["Nunito", "sans-serif"],
        nunitoSans: ["Nunito Sans", "sans-serif"],
      },
      textColor: {
        primary: "#0177FB",
        secondary: "#66CCB3",
        tertiary: "#BE7EDC",
        customGray: "#606F7B",
        customDarkGray: "#43576B",
        customDarkModeGray: "#8795A1",
        customMediumGray: "#B8C2CC",
        customLightGray: "#DAE1E7",
        customDarkModeLightGray: "#EFF2F5",
        customWhite: "#FEFEFE",
        dark: "#001529",
        alert: "#F71111",
        brown: "#7B6760",
        darkRed: "#630909",
        gold: "#7B7560",
        lightBlue: "#5271E0",
      },
      borderWidth: {
        0.5: "0.5px",
      },
      borderColor: {
        customGray: "#B8C2CC",
        customLightGray: "#DAE1E7",
        primary: "#0177FB",
        dark: "#2f3136",
        darkModeGray: "#3D4852",
        alert: "#F71111",
      },
      caretColor: {
        primary: "#0177FB",
        secondary: "#66CCB3",
      },
      animation: {
        spin: "spin 1.25s linear infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        customBounce: "customBounce 1s infinite",
        customBounce200: "customBounce 1s infinite 200ms",
        customBounce400: "customBounce 1s infinite 400ms",
      },
      keyframes: {
        spin: {
          "0%": { transform: "rotate(360deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        pulse: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.2 },
        },
        customBounce: {
          "0%, 100%": { transform: "translateY(0)", opacity: 0.4 },
          "20%": { transform: "translateY(0)", opacity: 0.4 },
          "40%": { transform: "translateY(-6px)", opacity: 0.8 },
          "60%": { transform: "translateY(-3px)", opacity: 1 },
          "80%": { transform: "translateY(0)", opacity: 0.4 },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

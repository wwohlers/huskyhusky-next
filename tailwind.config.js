/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        theme: "#990702",
        primary: "#000000",
        secondary: "#7f8694",
        border: "#e5e7eb",
        background: "#f9fafb",
        "background-dark": "#efefef",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};

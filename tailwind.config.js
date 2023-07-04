/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        grid: "url('/grid.svg')",
      },
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        shade: {
          overlay: "#f9fafb", //bg-gray-50,
          line: "#e5e7eb", //bg-gray-200,
          disabled: "#9CA3AF", //bg-gray-400,
          pencil: {
            light: "#6b7280", //bg-gray-500,
            dark: "#374151", //bg-gray-700,
            black: "#111827", //bg-black-900
          },
        },
        stratos: {
          overlay: "#e4efff50",
          line: "#a8c4ff",
          default: "#0010ff", //600
          50: "#e4efff",
          100: "#cfe0ff",
          200: "#a8c4ff",
          300: "#749dff",
          400: "#3e61ff",
          500: "#1328ff",
          600: "#0010ff",
          700: "#0010ff",
          800: "#000ee4",
          900: "#0005b0",
          950: "#000044",
        },
      },
      keyframes: {
        strikethrough: {
          0: {
            width: "0%",
          },
          100: {
            width: "100%",
          },
        },
      },
    },
  },
  plugins: [
    // ...
    require("@tailwindcss/forms"),
    require("prettier-plugin-tailwindcss"),
    require("tailwind-scrollbar")({ nocompatible: true }),
    require("@tailwindcss/typography"),
  ],
};

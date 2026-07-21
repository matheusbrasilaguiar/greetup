import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bordeaux: {
          300: "var(--color-bordeaux-300)",
          500: "var(--color-bordeaux-500)",
          700: "var(--color-bordeaux-700)",
          800: "var(--color-bordeaux-800)",
          900: "var(--color-bordeaux-900)",
        },
        cream: {
          50: "var(--color-cream-50)",
          100: "var(--color-cream-100)",
          200: "var(--color-cream-200)",
        },
        ink: {
          300: "var(--color-ink-300)",
          500: "var(--color-ink-500)",
          700: "var(--color-ink-700)",
          900: "var(--color-ink-900)",
        },
        champagne: "var(--color-champagne)",
      },
    },
  },
  plugins: [],
};

export default config;

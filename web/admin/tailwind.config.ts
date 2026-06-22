import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bordeaux: {
          300: "var(--gu-bordeaux-300)",
          500: "var(--gu-bordeaux-500)",
          700: "var(--gu-bordeaux-700)",
          800: "var(--gu-bordeaux-800)",
          900: "var(--gu-bordeaux-900)",
        },
        cream: {
          50: "var(--gu-cream-50)",
          100: "var(--gu-cream-100)",
          200: "var(--gu-cream-200)",
        },
        ink: {
          300: "var(--gu-ink-300)",
          500: "var(--gu-ink-500)",
          700: "var(--gu-ink-700)",
          900: "var(--gu-ink-900)",
        },
        champagne: "var(--gu-champagne)",
      },
      fontFamily: {
        sans: ["var(--font-sora)", "sans-serif"],
        display: ["var(--font-cormorant)", "serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;

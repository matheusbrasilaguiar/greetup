import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand scale — uso direto para elementos de marca fixa
        bordeaux: {
          300: "hsl(var(--gu-bordeaux-300) / <alpha-value>)",
          500: "hsl(var(--gu-bordeaux-500) / <alpha-value>)",
          700: "hsl(var(--gu-bordeaux-700) / <alpha-value>)",
          800: "hsl(var(--gu-bordeaux-800) / <alpha-value>)",
          900: "hsl(var(--gu-bordeaux-900) / <alpha-value>)",
        },
        cream: {
          50: "hsl(var(--gu-cream-50) / <alpha-value>)",
          100: "hsl(var(--gu-cream-100) / <alpha-value>)",
          200: "hsl(var(--gu-cream-200) / <alpha-value>)",
        },
        ink: {
          300: "hsl(var(--gu-ink-300) / <alpha-value>)",
          500: "hsl(var(--gu-ink-500) / <alpha-value>)",
          700: "hsl(var(--gu-ink-700) / <alpha-value>)",
          900: "hsl(var(--gu-ink-900) / <alpha-value>)",
        },
        champagne: "hsl(var(--gu-champagne) / <alpha-value>)",

        // shadcn — camada semântica
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",

        // Chrome — superfície escura fixa (Sidebar)
        chrome: {
          DEFAULT: "hsl(var(--chrome) / <alpha-value>)",
          foreground: "hsl(var(--chrome-foreground) / <alpha-value>)",
          accent: "hsl(var(--chrome-accent) / <alpha-value>)",
          "muted-foreground": "hsl(var(--chrome-muted-foreground) / <alpha-value>)",
          "subtle-foreground": "hsl(var(--chrome-subtle-foreground) / <alpha-value>)",
          border: "hsl(var(--chrome-border) / <alpha-value>)",
          card: "hsl(var(--chrome-card) / <alpha-value>)",
          "card-foreground": "hsl(var(--chrome-card-foreground) / <alpha-value>)",
          "card-border": "hsl(var(--chrome-card-border) / <alpha-value>)",
        },

        // Status — item, mesa, pedido e evento
        status: {
          "warning-bg": "hsl(var(--status-warning-bg) / <alpha-value>)",
          "warning-fg": "hsl(var(--status-warning-fg) / <alpha-value>)",
          "warning-br": "hsl(var(--status-warning-br) / <alpha-value>)",
          "info-bg": "hsl(var(--status-info-bg) / <alpha-value>)",
          "info-fg": "hsl(var(--status-info-fg) / <alpha-value>)",
          "info-br": "hsl(var(--status-info-br) / <alpha-value>)",
          "success-bg": "hsl(var(--status-success-bg) / <alpha-value>)",
          "success-fg": "hsl(var(--status-success-fg) / <alpha-value>)",
          "success-br": "hsl(var(--status-success-br) / <alpha-value>)",
          "muted-bg": "hsl(var(--status-muted-bg) / <alpha-value>)",
          "muted-fg": "hsl(var(--status-muted-fg) / <alpha-value>)",
          "muted-br": "hsl(var(--status-muted-br) / <alpha-value>)",
          "canceled-bg": "hsl(var(--status-canceled-bg) / <alpha-value>)",
          "canceled-fg": "hsl(var(--status-canceled-fg) / <alpha-value>)",
          "canceled-br": "hsl(var(--status-canceled-br) / <alpha-value>)",
          "busy-bg": "hsl(var(--status-busy-bg) / <alpha-value>)",
          "busy-fg": "hsl(var(--status-busy-fg) / <alpha-value>)",
          "busy-br": "hsl(var(--status-busy-br) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sora)", "sans-serif"],
        editorial: ["var(--font-cormorant)", "Georgia", "serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Geist",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          '"Geist Mono"',
          '"JetBrains Mono"',
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        crucible: {
          canvas: "var(--crucible-canvas)",
          card: "var(--crucible-card)",
          cardElevated: "var(--crucible-card-elevated)",
          border: "var(--crucible-border)",
          borderSubtle: "var(--crucible-border-subtle)",
          champagne: "var(--crucible-champagne)",
          champagneGlow: "var(--crucible-champagne-glow)",
          amber: "var(--crucible-amber)",
          muted: "var(--crucible-muted)",
          text: "var(--crucible-text)",
          cta: "var(--crucible-cta)",
          ctaHover: "var(--crucible-cta-hover)",
          ctaText: "var(--crucible-cta-text)",
          ctaSecondary: "var(--crucible-cta-secondary)",
          ctaSecondaryBorder: "var(--crucible-cta-secondary-border)",
          ctaSecondaryHover: "var(--crucible-cta-secondary-hover)",
          ctaSecondaryText: "var(--crucible-cta-secondary-text)",
        },
        cockpit: {
          surface: "var(--cockpit-surface)",
          border: "var(--cockpit-border)",
          muted: "var(--cockpit-muted)",
          accent: "var(--cockpit-accent)",
        },
      },
      boxShadow: {
        champagne: "0 0 50px -10px rgba(244, 238, 227, 0.5)",
        "champagne-lg": "0 0 80px -15px rgba(217, 119, 6, 0.15)",
        "pill-cta": "0 2px 8px -2px rgba(24, 24, 24, 0.25)",
      },
      minHeight: {
        dvh: "100dvh",
      },
    },
  },
  plugins: [],
};
export default config;

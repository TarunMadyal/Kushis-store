import type { Config } from "tailwindcss";

// Design tokens are driven by CSS variables defined in src/app/globals.css.
// This makes it easy to retune the whole look (e.g. to match a Pinterest board
// or a supplied screenshot) by editing a handful of variables in one place.
const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "var(--color-bg)",
          surface: "var(--color-surface)",
          ink: "var(--color-ink)",
          muted: "var(--color-muted)",
          line: "var(--color-line)",
          primary: "var(--color-primary)",
          "primary-ink": "var(--color-primary-ink)",
          accent: "var(--color-accent)",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        container: "1200px",
      },
      borderRadius: {
        card: "var(--radius-card)",
      },
    },
  },
  plugins: [],
};

export default config;

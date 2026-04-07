import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        headline: ["var(--font-headline)", "Plus Jakarta Sans", "sans-serif"],
        body: ["var(--font-body)", "Be Vietnam Pro", "sans-serif"],
      },
      colors: {
        primary: "#005caa",
        "primary-light": "#5aa2ff",
        "primary-brand": "#1976D2",
        secondary: "#FFC107",
        tertiary: "#4CAF50",
        surface: "#f5f6f7",
        "surface-low": "#eff1f2",
        "on-surface": "#2c2f30",
        "on-surface-variant": "#595c5d",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "3rem",
      },
    },
  },
  plugins: [],
};

export default config;

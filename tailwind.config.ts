import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        "nf-gray": {
          900: "#0D0F16",
          800: "#151823",
          700: "#1F2330",
          600: "#2A3042",
          400: "#6B7287",
          200: "#B7BBD0",
          100: "#E7E9F6",
        },
        "nf-primary": {
          700: "#5941C6",
          500: "#7F5CFF",
          300: "#B39AFE",
        },
        "nf-accent": {
          cyan: "#22D6F3",
          pink: "#FF4F9C",
        },
        "nf-success": "#24D18B",
        "nf-warning": "#FFC76B",
        "nf-error": "#FF517B",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(34, 214, 243, 0)" },
          "50%": { boxShadow: "0 0 8px 6px rgba(34, 214, 243, 0.3)" },
        },
      },
      transitionTimingFunction: {
        "nf-ease-out": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        "nf-fast": "120ms",
        "nf-medium": "240ms",
      },
    },
  },
  plugins: [],
};

export default config;

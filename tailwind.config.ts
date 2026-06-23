import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lime: {
          DEFAULT: "#deff9a",
          glow: "#e8ffb0",
          deep: "#b6e85f",
        },
        navy: {
          DEFAULT: "#0f172a",
          light: "#1e293b",
          soft: "#334155",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-montserrat)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(222, 255, 154, 0.35)",
        "glow-sm": "0 0 20px rgba(222, 255, 154, 0.25)",
        brutal: "8px 8px 0px #0f172a",
        "brutal-lime": "8px 8px 0px #deff9a",
      },
      animation: {
        blink: "blink 1s step-end infinite",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "spin-slow": "spin 18s linear infinite",
        marquee: "marquee 22s linear infinite",
        "pulse-glow": "pulseGlow 2.5s ease-in-out infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-22px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(222,255,154,0.3)" },
          "50%": { boxShadow: "0 0 50px rgba(222,255,154,0.6)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

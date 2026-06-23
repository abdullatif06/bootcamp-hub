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
        // Agency-reference accents
        royal: {
          DEFAULT: "#2233ff",
          deep: "#1320d6",
        },
        cream: {
          DEFAULT: "#f4f1ea",
          soft: "#e9e5da",
        },
        ink: {
          DEFAULT: "#0b0e14",
          soft: "#11151d",
        },
      },
      fontFamily: {
        display: ["var(--font-bebas)", "Impact", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
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
        "spin-slower": "spin 30s linear infinite",
        marquee: "marquee 22s linear infinite",
        "marquee-fast": "marquee 16s linear infinite",
        "marquee-rev": "marqueeRev 22s linear infinite",
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
        marqueeRev: {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
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

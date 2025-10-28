import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00ff88",
        secondary: "#8a2be2",
        dark: "#0a0a0a",
        light: "#f8f8f8",
        gray: "#222222",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "float": "float 5s ease-in-out infinite",
        "pulse": "pulse 2s infinite",
      },
      keyframes: {
        float: {
          "0%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
          "100%": { transform: "translateY(0px)" },
        },
        pulse: {
          "0%": { boxShadow: "0 0 0 0 rgba(0, 255, 136, 0.7)" },
          "70%": { boxShadow: "0 0 0 10px rgba(0, 255, 136, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(0, 255, 136, 0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

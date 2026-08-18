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
        obsidian: "#060807",
        "rich-black": "#0C0E0D",
        charcoal: "#181A19",
        "deep-bronze": "#706246",
        "antique-gold": "#AC9461",
        "signature-gold": "#D0AF6F",
        champagne: "#E2C179",
        ivory: "#F5EFE5",
        "muted-silver": "#A7AAA7",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #AC9461 0%, #D0AF6F 50%, #E2C179 100%)",
        "gold-sweep": "linear-gradient(90deg, transparent 0%, #D0AF6F 50%, transparent 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        shimmer: "shimmer 2s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

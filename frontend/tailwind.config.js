/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // SuryaHimal brand — Himalayan Sun & Sky palette
        background: "#040d1a",
        surface: "#0a1929",
        "surface-container": "#0f2744",
        "surface-container-low": "#0a1e36",
        "surface-container-high": "#132f52",
        "surface-container-highest": "#1a3d68",
        "on-surface": "#e2f4ff",
        "on-surface-variant": "#94b8d0",
        "outline-variant": "#1e3a5f",

        // Primary: Himalayan Sun (amber/gold)
        primary: "#f59e0b",
        "on-primary": "#0a0500",
        "primary-container": "#78350f",
        "on-primary-container": "#fcd34d",

        // Secondary: Glacier Blue (cyan)
        secondary: "#06b6d4",
        "on-secondary": "#001a1f",
        "secondary-container": "#164e63",
        "on-secondary-container": "#67e8f9",

        // Tertiary: Alpine Green (emerald)
        tertiary: "#10b981",
        "on-tertiary": "#002114",
        "tertiary-container": "#064e3b",
        "on-tertiary-container": "#6ee7b7",

        // Error
        error: "#ff6b6b",
        "error-container": "#3d0000",
        "on-error": "#1a0000",

        // Outline
        outline: "#2d5a7e",
      },
      fontFamily: {
        display: ["Outfit", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        label: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "sun-gradient": "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
        "glacier-gradient": "linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)",
        "mountain-gradient": "linear-gradient(180deg, #040d1a 0%, #0a1929 100%)",
      },
      animation: {
        ticker: "ticker 35s linear infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [],
};

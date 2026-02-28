/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // ── Custom Colors ──
      colors: {
        bg:       "#f7f4ef",
        bg2:      "#f0ede6",
        border1:  "#e2ddd6",
        border2:  "#d0cbc2",
        gold:     "#c8882a",
        gold2:    "#e8a840",
        goldbg:   "#fdf6ec",
        dark:     "#1a1820",
        dark2:    "#2e2c38",
        gray1:    "#7a7680",
        gray2:    "#a8a4ac",
        gray3:    "#d0ccd4",
        green1:   "#2a9868",
        greenbg:  "#f0faf5",
        crimson:  "#d03848",
        redbg:    "#fef2f3",
        amber1:   "#c87820",
        amberbg:  "#fef8f0",
      },

      // ── Custom Fonts ──
      fontFamily: {
        serif: ["Cormorant Garamond", "serif"],
        sans:  ["Outfit", "sans-serif"],
        mono:  ["DM Mono", "monospace"],
      },

      // ── Pulse Ring Animation (Upload zone) ──
      keyframes: {
        pulseRing: {
          "0%":   { transform: "scale(0.6)", opacity: "0.6" },
          "100%": { transform: "scale(2.2)", opacity: "0"   },
        },
        scanLine: {
          "0%":   { top: "0" },
          "100%": { top: "100%" },
        },
        spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "pulse-ring":   "pulseRing 2.5s ease-out infinite",
        "pulse-ring-2": "pulseRing 2.5s ease-out infinite 0.8s",
        "pulse-ring-3": "pulseRing 2.5s ease-out infinite 1.6s",
        "scan": "scanLine 1.5s linear infinite",
        "spin-slow": "spin 0.8s linear infinite",
      },
    },
  },
  plugins: [],
};
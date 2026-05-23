/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        space: {
          950: "#03040f",
          900: "#070b1a",
          800: "#0d1433",
          700: "#111d4a",
          600: "#1a2d6b",
        },
        nebula: {
          blue:   "#4fc3f7",
          cyan:   "#00e5ff",
          purple: "#b388ff",
          pink:   "#f48fb1",
        },
        star: {
          gold:   "#ffd54f",
          white:  "#e8f4fd",
          dim:    "#546e8a",
        },
      },
      fontFamily: {
        display: ["'Orbitron'", "monospace"],
        body:    ["'DM Sans'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "star-field": "radial-gradient(ellipse at 20% 50%, #1a2d6b22 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, #b388ff11 0%, transparent 50%)",
        "nebula-glow": "radial-gradient(ellipse at center, #4fc3f711 0%, transparent 70%)",
      },
      animation: {
        "pulse-slow":   "pulse 4s cubic-bezier(0.4,0,0.6,1) infinite",
        "float":        "float 6s ease-in-out infinite",
        "glow":         "glow 2s ease-in-out infinite alternate",
        "orbit":        "orbit 20s linear infinite",
        "twinkle":      "twinkle 3s ease-in-out infinite",
        "slide-in":     "slideIn 0.5s cubic-bezier(0.16,1,0.3,1)",
        "fade-up":      "fadeUp 0.6s cubic-bezier(0.16,1,0.3,1)",
      },
      keyframes: {
        float:   { "0%,100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-10px)" } },
        glow:    { from: { boxShadow: "0 0 10px #4fc3f733" }, to: { boxShadow: "0 0 30px #4fc3f766, 0 0 60px #4fc3f722" } },
        orbit:   { from: { transform: "rotate(0deg) translateX(120px) rotate(0deg)" }, to: { transform: "rotate(360deg) translateX(120px) rotate(-360deg)" } },
        twinkle: { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.3 } },
        slideIn: { from: { transform: "translateX(100%)", opacity: 0 }, to: { transform: "translateX(0)", opacity: 1 } },
        fadeUp:  { from: { transform: "translateY(20px)", opacity: 0 }, to: { transform: "translateY(0)", opacity: 1 } },
      },
      boxShadow: {
        "neon-blue":   "0 0 20px #4fc3f755, 0 0 40px #4fc3f722",
        "neon-purple": "0 0 20px #b388ff55, 0 0 40px #b388ff22",
        "neon-gold":   "0 0 20px #ffd54f55, 0 0 40px #ffd54f22",
        "panel":       "0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(79,195,247,0.1)",
      },
    },
  },
  plugins: [],
}
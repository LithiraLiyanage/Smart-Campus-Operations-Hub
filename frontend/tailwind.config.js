/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6", // Electric Blue
        "primary-container": "#2563eb",
        surface: "#02040a", // Deep Black/Navy
        "surface-container-low": "#0b0f19",
        "surface-container-highest": "#111827",
        "surface-container-lowest": "#000000",
        tertiary: "#8b5cf6", // Purple/Indigo
        secondary: "#6366f1", // Indigo
        "on-surface": "#f8fafc",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        headline: ["Manrope", "sans-serif"],
        editorial: ['"Instrument Serif"', "serif"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
        "hero-gradient":
          "linear-gradient(to bottom, #000000 0%, #02040a 40%, #0b0f19 100%)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        card: "0 4px 24px 0 rgba(0, 0, 0, 0.4)",
        "card-hover": "0 12px 40px 0 rgba(59, 130, 246, 0.2)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
        "glow-blue": "0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.2)",
        "glow-purple": "0 0 20px rgba(139, 92, 246, 0.5)",
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 6s ease-in-out 2s infinite",
        "float-slow": "float 8s ease-in-out 1s infinite",
        "bounce-soft": "bounceSoft 2s ease-in-out infinite",
        "fade-up": "fadeUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
        "pulse-slow": "pulseSlow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "gradient-shift": "gradientShift 8s ease infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-16px)" },
        },
        bounceSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [],
};

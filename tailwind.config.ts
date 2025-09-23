import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1200px",
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        inter: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
        mono: ['"JetBrains Mono"', '"Fira Code"', "Consolas", "monospace"],
      },
      fontSize: {
        "display-lg": ["3.5rem", { lineHeight: "1.1", fontWeight: "600" }],
        "display-md": ["2.75rem", { lineHeight: "1.1", fontWeight: "600" }],
        h1: ["2.25rem", { lineHeight: "1.2", fontWeight: "600" }],
        h2: ["1.875rem", { lineHeight: "1.2", fontWeight: "600" }],
        h3: ["1.5rem", { lineHeight: "1.3", fontWeight: "600" }],
        h4: ["1.25rem", { lineHeight: "1.3", fontWeight: "500" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        body: ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
        caption: ["0.75rem", { lineHeight: "1.4", fontWeight: "500" }],
      },
      colors: {
        // New color scheme based on specifications
        border: "#FFD700", // Gold borders
        input: "#F8F9FA", // White smoke background
        ring: "#FFD700", // Gold focus rings
        background: "#F8F9FA", // White smoke background
        foreground: "#000000", // Black text
        primary: {
          DEFAULT: "#005E3D", // Deep emerald green
          foreground: "#FFD700", // Gold text on primary
        },
        secondary: {
          DEFAULT: "#1E2A4B", // Very dark blue
          foreground: "#FFD700", // Gold text on secondary
        },
        accent: {
          DEFAULT: "#FFD700", // Gold accents
          foreground: "#000000", // Black text on accent
        },
        success: {
          DEFAULT: "#005E3D", // Deep emerald green
          foreground: "#FFD700", // Gold text on success
        },
        warning: {
          DEFAULT: "#FFD700", // Gold warning
          foreground: "#000000", // Black text on warning
        },
        destructive: {
          DEFAULT: "#DC2626", // Red for destructive
          foreground: "#FFFFFF", // White text on destructive
        },
        muted: {
          DEFAULT: "#6C757D", // Davy's gray
          foreground: "#000000", // Black text on muted
        },
        popover: {
          DEFAULT: "#F8F9FA", // White smoke background
          foreground: "#000000", // Black text
        },
        card: {
          DEFAULT: "#005E3D", // Deep emerald green cards
          foreground: "#FFD700", // Gold text on cards
        },
        // Custom app colors
        "app-bg": "#F8F9FA", // White smoke background
        "card-bg": "#005E3D", // Deep emerald green
        "card-secondary": "#1E2A4B", // Very dark blue
        "border-accent": "#FFD700", // Gold borders
        "text-primary": "#000000", // Black text
        "text-secondary": "#6C757D", // Davy's gray
        "logo-text": "#FFD700", // Gold logo text
        "nav-active": "#FFD700", // Gold active nav
        "progress-fill": "#005E3D", // Deep emerald green
        "progress-track": "#2B3A60", // Dark sapphire blue
        // Custom medical colors
        "medical-blue": {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#2563eb",
          600: "#1d4ed8",
          700: "#1e40af",
          800: "#1e3a8a",
          900: "#1e3a8a",
        },
        "medical-teal": {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#0d9488",
          600: "#0f766e",
          700: "#115e59",
          800: "#134e4a",
          900: "#134e4a",
        },
        "medical-green": {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#065f46",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        medical: "16px",
        "medical-lg": "20px",
        "medical-xl": "24px",
        "medical-2xl": "32px",
      },
      spacing: {
        "medical-xs": "4px",
        "medical-sm": "8px",
        "medical-md": "16px",
        "medical-lg": "24px",
        "medical-xl": "32px",
        "medical-2xl": "48px",
        "medical-3xl": "64px",
        "medical-4xl": "96px",
      },
      boxShadow: {
        "medical-sm": "0 1px 3px rgba(0, 0, 0, 0.1)",
        medical: "0 4px 6px rgba(0, 0, 0, 0.07)",
        "medical-lg": "0 10px 15px rgba(0, 0, 0, 0.1)",
        "medical-xl": "0 25px 50px rgba(0, 0, 0, 0.15)",
        "glow-primary": "0 0 20px hsl(var(--primary) / 0.3)",
        "glow-success": "0 0 20px hsl(var(--success) / 0.3)",
        "glow-warning": "0 0 20px hsl(var(--warning) / 0.3)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "medical-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        "ai-thinking": {
          "0%": { transform: "rotate(0deg) scale(1)" },
          "50%": { transform: "rotate(180deg) scale(1.1)" },
          "100%": { transform: "rotate(360deg) scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "medical-pulse":
          "medical-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "ai-thinking": "ai-thinking 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

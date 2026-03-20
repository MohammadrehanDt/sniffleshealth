import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Semantic color system using CSS variables
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          700: "var(--primary-700)",
          600: "var(--primary-600)",
          500: "var(--primary-500)",
          400: "var(--primary-400)",
          300: "var(--primary-300)",
          200: "var(--primary-200)",
          100: "var(--primary-100)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // ── Design System Primary Palette ──
        brand: {
          700: "var(--primary-700)",
          600: "var(--primary-600)",
          500: "var(--primary-500)",
          400: "var(--primary-400)",
          300: "var(--primary-300)",
          200: "var(--primary-200)",
          100: "var(--primary-100)",
          // Legacy aliases → new design tokens
          cyan: "var(--primary-500)",
          "cyan-dark": "var(--primary-700)",
          "cyan-darker": "var(--primary-700)",
          "cyan-message": "var(--primary-700)",
          "cyan-light": "var(--primary-200)",
          "cyan-lighter": "var(--primary-100)",
          "cyan-lightest": "var(--primary-100)",
          "cyan-pale": "var(--primary-200)",
          "cyan-pale-blue": "var(--primary-300)",
        },
        // ── Neutrals ──
        neutral: {
          800: "var(--neutrals-800)",
          600: "var(--neutrals-600)",
          500: "var(--neutrals-500)",
          300: "var(--neutrals-300)",
          200: "var(--neutrals-200)",
          black: "var(--neutrals-black)",
          // Legacy aliases
          white: "#FFFFFF",
          gray: "var(--neutrals-300)",
        },
        // ── Semantic Colors ──
        semantic: {
          success: "var(--semantic-success)",
          warning: "var(--semantic-warning)",
          error: "var(--semantic-error)",
          info: "var(--semantic-info)",
          // Legacy aliases
          green: "var(--semantic-success)",
          "error-light": "#FCE5E5",
        },
        // ── Text Colors ──
        text: {
          primary: "var(--neutrals-800)",
          secondary: "var(--neutrals-600)",
          muted: "var(--neutrals-500)",
        },
        // ── Background Colors ──
        bg: {
          default: "var(--bg-default)",
          card: "var(--bg-card)",
          soft: "var(--bg-soft)",
          section: "var(--bg-section)",
          // Legacy aliases
          light: "var(--bg-soft)",
          white: "var(--bg-card)",
          dark: "var(--primary-700)",
        },
        // ── Border Colors ──
        "border-color": {
          DEFAULT: "var(--neutrals-300)",
          light: "var(--neutrals-200)",
          dark: "var(--neutrals-500)",
        },
      },
      fontFamily: {
        inter: ["Inter", "-apple-system", "sans-serif"],
        "inter-display": ["Inter Display", "-apple-system", "sans-serif"],
        quincy: ["Quincy CF", "-apple-system", "sans-serif"],
        // Aliases for consistency
        sans: ["Inter", "-apple-system", "sans-serif"],
        display: ["Inter Display", "-apple-system", "sans-serif"],
      },
      fontSize: {
        // Typography scale matching design system
        xs: ["12px", { lineHeight: "16px" }],
        sm: ["14px", { lineHeight: "20px" }],
        base: ["16px", { lineHeight: "24px" }],
        lg: ["19px", { lineHeight: "28px" }],
        xl: ["23px", { lineHeight: "32px" }],
        "2xl": ["32px", { lineHeight: "40px" }],
        "3xl": ["34px", { lineHeight: "42px" }],
        "4xl": ["40px", { lineHeight: "48px" }],
        "5xl": ["44px", { lineHeight: "52px" }],
        "6xl": ["52px", { lineHeight: "60px" }],
        "7xl": ["72px", { lineHeight: "80px" }],
      },
      letterSpacing: {
        // Letter spacing scale
        tighter: "-0.05em",
        tight: "-0.025em",
        normal: "0em",
        wide: "0.025em",
        wider: "0.05em",
        widest: "0.1em",
        // Specific values from design system
        "display-tight": "-2.6px",
        "display-tighter": "-3.6px",
        "display-normal": "-2px",
        "body-tight": "-0.312px",
      },
      lineHeight: {
        // Line height scale
        none: "1",
        tight: "1.25",
        snug: "1.375",
        normal: "1.5",
        relaxed: "1.625",
        loose: "2",
        // Specific values from design system
        "34": "34px",
        "36": "36px",
      },
      spacing: {
        // Extended spacing scale for design system values
        "18": "4.5rem", // 72px
        "15": "3.75rem", // 60px
        "22": "5.5rem", // 88px
        "30": "7.5rem", // 120px
      },
      borderRadius: {
        // Design system border radius values
        none: "0",
        sm: "0.125rem", // 2px
        DEFAULT: "0.5rem", // 8px
        md: "calc(var(--radius) - 2px)",
        lg: "var(--radius)", // 0.5rem
        xl: "0.75rem", // 12px
        "2xl": "1.125rem", // 18px
        "2.5xl": "1.5rem", // 24px
        "3xl": "1.875rem", // 30px
        "4xl": "2.5rem", // 40px
        full: "9999px",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

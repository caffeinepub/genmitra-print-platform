/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: 'oklch(var(--background) / <alpha-value>)',
        foreground: 'oklch(var(--foreground) / <alpha-value>)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        success: {
          DEFAULT: 'var(--success)',
          foreground: 'var(--success-foreground)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          foreground: 'var(--warning-foreground)',
        },
        sidebar: {
          bg: 'var(--sidebar-bg)',
          fg: 'var(--sidebar-fg)',
          muted: 'var(--sidebar-muted)',
          accent: 'var(--sidebar-accent)',
          border: 'var(--sidebar-border)',
        },
        // Category colors
        category: {
          bg: 'oklch(0.97 0.01 240)',
          heading: 'oklch(0.15 0.02 240)',
          subtitle: 'oklch(0.52 0.02 240)',
          icon: 'oklch(0.35 0.12 255)',
          'icon-bg': 'oklch(0.92 0.05 255)',
          'icon-bg-hover': 'oklch(0.88 0.08 255)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        'card-hover': '0 4px 12px 0 rgb(0 0 0 / 0.1), 0 2px 4px -1px rgb(0 0 0 / 0.06)',
        'card-lg': '0 8px 24px 0 rgb(0 0 0 / 0.1), 0 4px 8px -2px rgb(0 0 0 / 0.06)',
        modal: '0 20px 60px 0 rgb(0 0 0 / 0.15)',
        sidebar: '2px 0 8px 0 rgb(0 0 0 / 0.12)',
        category: '0 2px 8px 0 rgb(0 0 0 / 0.06)',
        'category-hover': '0 4px 16px 0 rgb(0 0 0 / 0.1)',
      },
      fontSize: {
        'display-xl': ['3.5rem', { lineHeight: '1.1', fontWeight: '800' }],
        'display-lg': ['2.75rem', { lineHeight: '1.15', fontWeight: '700' }],
        'display-md': ['2.25rem', { lineHeight: '1.2', fontWeight: '700' }],
        'display-sm': ['1.75rem', { lineHeight: '1.25', fontWeight: '600' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
  ],
}

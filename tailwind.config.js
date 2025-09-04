const { read } = require('fs');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{ts,tsx}',
  ],
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
        background: 'var(--background)',
        card: 'var(--card)',
        disabled: 'var(--disabled)',
        readonly: 'var(--readonly)',
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        border: 'var(--border)',
        primary: 'var(--primary)',
        success: 'var(--success)',
        danger: 'var(--danger)',
        warning: 'var(--warning)',

        // New semantic colors based on common usage in components
        app: {
          blue: {
            DEFAULT: '#3b82f6', // blue-500
            light: '#60a5fa',   // blue-400
            dark: '#1e40af',    // blue-900
            border: '#60a5fa',  // blue-400
            gradient: {
              from: '#60a5fa',  // blue-400
              to: '#2563eb',    // blue-600
            },
          },
          red: {
            DEFAULT: '#ef4444', // red-500
            light: '#f87171',   // red-400
            border: '#f87171',  // red-400
            hover: '#dc2626',   // red-700
            gradient: {
              from: '#f87171',  // red-400
              to: '#dc2626',    // red-600
            },
          },
          purple: {
            DEFAULT: '#a855f7', // purple-500
            light: '#c084fc',   // purple-400
            border: '#c084fc',  // purple-400
          },
          indigo: {
            DEFAULT: '#4f46e5', // indigo-600
            dark: '#4338ca',    // indigo-900
            hover: '#3730a3',   // indigo-800
          },
          green: {
            DEFAULT: '#22c55e', // green-500
            hover: '#16a34a',   // green-600
          },
          cyan: {
            DEFAULT: '#06b6d4', // cyan-500
            hover: '#0891b2',   // cyan-600
          },
          yellow: {
            DEFAULT: '#facc15', // yellow-400
            hover: '#eab308',   // yellow-500
          },
        },
      },

      input_label: "text-xs ml-4 font-medium text-text-primary",

      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Helvetica',
          'Arial',
          'sans-serif'
        ],
        mono: ['JetBrains Mono', 'monospace'],
      },

      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
      },

      fontSize: {
        xs: 'var(--text-xs)',
        sm: 'var(--text-sm)',
        base: 'var(--text-base)',
        lg: 'var(--text-lg)',
        xl: 'var(--text-xl)',
        '2xl': 'var(--text-2xl)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
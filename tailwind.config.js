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
        md: 'var(--text-md)',
        lg: 'var(--text-lg)',
        xl: 'var(--text-xl)',
        '2xl': 'var(--text-2xl)',
      },

      typography: {
        DEFAULT: {
          css: {
            h1: {
              fontSize: 'var(--text-2xl)',
              fontWeight: '600',
              lineHeight: '1.25',
              marginTop: '0',
              marginBottom: '1rem',
            },
            h2: {
              fontSize: 'var(--text-xl)',
              fontWeight: '600',
              lineHeight: '1.25',
              marginTop: '1.5rem',
              marginBottom: '0.75rem',
            },
            h3: {
              fontSize: 'var(--text-lg)',
              fontWeight: '600',
              lineHeight: '1.25',
              marginTop: '1.25rem',
              marginBottom: '0.5rem',
            },
            h4: {
              fontSize: 'var(--text-md)',
              fontWeight: '600',
              lineHeight: '1.25',
              marginTop: '1rem',
              marginBottom: '0.5rem',
            },
            h5: {
              fontSize: 'var(--text-base)',
              fontWeight: '600',
              lineHeight: '1.25',
              marginTop: '0.75rem',
              marginBottom: '0.25rem',
            },
            h6: {
              fontSize: 'var(--text-sm)',
              fontWeight: '600',
              lineHeight: '1.25',
              marginTop: '0.5rem',
              marginBottom: '0.25rem',
            },
            p: {
              marginTop: '0',
              marginBottom: '1rem',
              fontSize: 'var(--text-base)',
            },
            a: {
              color: 'var(--primary)',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            img: {
              display: 'block',
              margin: '0 auto',
              borderRadius: '0.5rem',
              border: '1px solid var(--border)',
            },
            blockquote: {
              borderLeft: '4px solid var(--primary)',
              paddingLeft: '1rem',
              margin: '1rem 0',
              fontStyle: 'italic',
            },
            code: {
              backgroundColor: 'var(--muted)',
              padding: '0.125rem 0.25rem',
              borderRadius: '0.25rem',
              fontSize: '0.875rem',
            },
            pre: {
              backgroundColor: 'var(--muted)',
              padding: '1rem',
              borderRadius: '0.5rem',
              overflow: 'auto',
              margin: '1rem 0',
            },
            ul: {
              paddingLeft: '1.5rem',
              margin: '0.5rem 0',
            },
            ol: {
              paddingLeft: '1.5rem',
              margin: '0.5rem 0',
            },
            li: {
              margin: '0.25rem 0',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
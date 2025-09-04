/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', 
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',  
    './components/**/*.{js,ts,jsx,tsx}',  
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: {
            h1: {
              fontSize: 'var(--font-h1)',
            },
            h2: {
              fontSize: 'var(--font-h2)',
              fontWeight: 'semibold',
              lineHeight: 'var(--line-height-md)',
              color: 'var(--text-primary)',
            },
            h3: {
              fontSize: 'var(--font-h3)',
              fontWeight: 'medium',
              lineHeight: 'var(--line-height-md)',
              color: 'var(--text-secondary)',
            },
      },
      boxShadow: {
        neumorphism: "var(--neumorphism)", 
        "neumorphism-lg": "var(--neumorphism-lg)", 
        "neumorphism-xl": "var(--neumorphism-xl)",
      },
      colors: {
        background: 'var(--background)',
        card: 'var(--card-background)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        danger: 'var(--danger)',
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
        },
        icon: 'var(--icon-default)',
        muted: "#e5e7eb",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], 
      },
      fontSize: {
        h1: 'var(--font-h1)',
        h2: 'var(--font-h2)',
        h3: 'var(--font-h3)',
        h4: 'var(--font-h4)',
        h5: 'var(--font-h5)',
        h6: 'var(--font-h6)',
        p: 'var(--font-md)',
        small: 'var(--font-small)',
        xs: 'var(--font-xs)',
      },
      lineHeight: {
        sm: 'var(--line-height-sm)',
        md: 'var(--line-height-md)',
        lg: 'var(--line-height-lg)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

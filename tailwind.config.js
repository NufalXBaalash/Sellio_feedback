/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-cairo)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        heading: ["Outfit", "var(--font-cairo)", "ui-sans-serif", "sans-serif"],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        navy: {
          '50': '#f0f4f8',
          '100': '#d9e2ec',
          '200': '#bcccdc',
          '300': '#9fb3c8',
          '400': '#829ab1',
          '500': '#627d98',
          '600': '#486581',
          '700': '#334e68',
          '800': '#243b53',
          '900': '#102a43',
          '950': '#0a1f2e'
        },
        'sellio': {
          'primary': '#27AE60',
          'accent': '#06b6d4',
          'secondary': '#8b5cf6',
          'tertiary': 'hsl(var(--sellio-tertiary))',
          'text-main': 'hsl(var(--sellio-text-main))',
          'text-muted': 'hsl(var(--sellio-text-muted))',
          'success': 'hsl(var(--sellio-success))',
          'warning': 'hsl(var(--sellio-warning))',
          'danger': 'hsl(var(--sellio-danger))',
        },
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleUp: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        float: {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(78, 159, 61, 0.2)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 30px rgba(78, 159, 61, 0.6)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'slide-in-right': 'slideInRight 0.8s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.8s ease-out forwards',
        'scale-up': 'scaleUp 0.5s ease-out forwards',
        'blob': 'blob 12s infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
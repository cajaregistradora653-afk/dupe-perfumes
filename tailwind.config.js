/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: '475px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Color Pallete from Instagram
        moss: "#3C5A4B",        // Verde Oliva/Musgo
        emerald: "#1E5144",     // Verde Esmeralda/Bosque
        linen: "#EDE4D9",       // Crema Suave/Lino
        chestnut: "#806354",    // Castaño Cálido
        stone: "#A9A49B",       // Gris Piedra
        shine: "#F2EBDE",       // Acentos de Brillo (Luz)
        gold: "#C9A84C",        // Dorado elegante (del logo Dupé)
        "gold-light": "#E8D48B", // Dorado claro para gradientes

        // Primitives mapped to new palette
        ink: "#1C1B1A",         // Negro neutro (texto marketplace sobrio)
        parchment: "#FFFFFF",   // Fondo blanco base
        "dupe-green": "#1E5144", // Using emerald for brand green
      },
      fontFamily: {
        serif: ["'Roboto'", "sans-serif"],
        elegant: ["'Roboto'", "sans-serif"],
        cursive: ["'Roboto'", "sans-serif"],
        sans: ["'Roboto'", "sans-serif"],
        mono: ["'Roboto'", "monospace"],
        monda: ["'Monda'", "sans-serif"],
      },
      boxShadow: {
        'card': '0 12px 34px rgba(30, 81, 68, 0.10), 0 2px 8px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 28px 56px rgba(30, 81, 68, 0.20), 0 4px 12px rgba(0, 0, 0, 0.08)',
        'card-gold': '0 16px 38px rgba(201, 168, 76, 0.22)',
        'glow': '0 0 25px rgba(201, 168, 76, 0.25)',
      },
      borderRadius: {
        'artisanal': '24px 4px 24px 4px', // More asymmetric
        'pill': '50px',
        'organic': '60% 40% 70% 30% / 40% 50% 60% 70%', // Blob-like
      },
      spacing: {
        'section': '120px',
        'asymmetric': '15%',
      },
      transitionTimingFunction: {
        'organic': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shine': 'shine 3s ease-in-out infinite',
        'reveal': 'reveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'heartbeat': 'heartbeat 1.2s ease-in-out infinite',
        'sparkle-fall': 'sparkleFall 2.6s ease-in forwards',
        'glow-pulse': 'glowPulse 2.2s ease-in-out infinite',
        'badge-shine': 'badgeShine 2.8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
        },
        shine: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        reveal: {
          '0%': { opacity: 0, transform: 'translateY(40px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '14%': { transform: 'scale(1.3)' },
          '28%': { transform: 'scale(1)' },
          '42%': { transform: 'scale(1.22)' },
          '56%': { transform: 'scale(1)' },
        },
        sparkleFall: {
          '0%': { opacity: '0', transform: 'translateY(-12px) scale(0.4) rotate(0deg)' },
          '15%': { opacity: '1', transform: 'translateY(0) scale(1) rotate(20deg)' },
          '70%': { opacity: '1', transform: 'translateY(46px) scale(0.9) rotate(120deg)' },
          '100%': { opacity: '0', transform: 'translateY(72px) scale(0.4) rotate(180deg)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(201,168,76,0.35)' },
          '50%': { boxShadow: '0 0 28px rgba(201,168,76,0.65)' },
        },
        badgeShine: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}

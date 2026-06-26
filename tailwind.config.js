/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          active: 'var(--color-primary-active)',
          disabled: 'var(--color-primary-disabled)',
        },
        ink: 'var(--color-ink)',
        body: 'var(--color-body)',
        muted: {
          DEFAULT: 'var(--color-muted)',
          soft: 'var(--color-muted-soft)',
        },
        hairline: {
          DEFAULT: 'var(--color-hairline)',
          soft: 'var(--color-hairline-soft)',
        },
        canvas: 'var(--color-canvas)',
        surface: {
          soft: 'var(--color-surface-soft)',
          card: 'var(--color-surface-card)',
          strong: 'var(--color-surface-strong)',
          dark: {
            DEFAULT: 'var(--color-surface-dark)',
            elevated: 'var(--color-surface-dark-elevated)',
          },
        },
        on: {
          primary: 'var(--color-on-primary)',
          dark: {
            DEFAULT: 'var(--color-on-dark)',
            soft: 'var(--color-on-dark-soft)',
          },
        },
        brand: {
          accent: 'var(--color-brand-accent)',
        },
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        badge: {
          orange: {
            DEFAULT: 'var(--color-badge-orange)',
            bg: 'rgba(251, 146, 60, 0.15)',
            text: '#c2410c',
          },
          pink: {
            DEFAULT: 'var(--color-badge-pink)',
            bg: 'rgba(236, 72, 153, 0.15)',
            text: '#be185d',
          },
          violet: {
            DEFAULT: 'var(--color-badge-violet)',
            bg: 'rgba(139, 92, 246, 0.15)',
            text: '#6d28d9',
          },
          emerald: {
            DEFAULT: 'var(--color-badge-emerald)',
            bg: 'rgba(52, 211, 153, 0.15)',
            text: '#047857',
          },
        },
      },
      borderRadius: {
        'xs': 'var(--rounded-xs)',
        'sm': 'var(--rounded-sm)',
        'md': 'var(--rounded-md)',
        'lg': 'var(--rounded-lg)',
        'xl': 'var(--rounded-xl)',
        'pill': 'var(--rounded-pill)',
      },
      spacing: {
        'xxs': 'var(--spacing-xxs)',
        'xs': 'var(--spacing-xs)',
        'sm': 'var(--spacing-sm)',
        'md': 'var(--spacing-md)',
        'lg': 'var(--spacing-lg)',
        'xl': 'var(--spacing-xl)',
        'xxl': 'var(--spacing-xxl)',
        'section': 'var(--spacing-section)',
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
      },
    },
  },
  plugins: [],
}

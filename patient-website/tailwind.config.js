/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 1. Canvas & Layout
        canvas: {
          DEFAULT: 'var(--canvas)',
          subtle: 'var(--canvas-subtle)',
          topbar: 'var(--canvas-topbar)',
        },
        // 2. Cards & Containers
        card: {
          DEFAULT: 'var(--card)',
          subtle: 'var(--card-subtle)',
          hover: 'var(--card-hover)',
          border: 'var(--card-border)',
          'border-hover': 'var(--card-border-hover)',
        },
        // 3. Typography Hierarchy
        txt: {
          heading: 'var(--text-heading)',
          body: 'var(--text-body)',
          muted: 'var(--text-muted)',
          faint: 'var(--text-faint)',
        },
        // 4. Accent Brand Colors
        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          soft: 'var(--accent-soft)',
          border: 'var(--accent-border)',
        },
        // 5. Buttons
        btn: {
          'primary-bg': 'var(--btn-primary-bg)',
          'primary-hover': 'var(--btn-primary-hover)',
          'primary-text': 'var(--btn-primary-text)',
          'secondary-bg': 'var(--btn-secondary-bg)',
          'secondary-hover': 'var(--btn-secondary-hover)',
          'secondary-text': 'var(--btn-secondary-text)',
          'secondary-border': 'var(--btn-secondary-border)',
        },
        // 6. Structural Borders & Dividers
        borderline: {
          DEFAULT: 'var(--border)',
          subtle: 'var(--border-subtle)',
        },
        // 7. Notice & Emergency Alert
        alert: {
          bg: 'var(--alert-bg)',
          border: 'var(--alert-border)',
          text: 'var(--alert-text)',
          title: 'var(--alert-title)',
          icon: 'var(--alert-icon)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Charter', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};

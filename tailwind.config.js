/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#f4f5f7',
        accent: { DEFAULT: '#2563eb', dark: '#1d4ed8', soft: '#eef4ff', ring: '#bfd3fe' },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"SF Pro"', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,0.04), 0 1px 3px rgba(16,24,40,0.06)',
        pop: '0 12px 32px -8px rgba(16,24,40,0.24), 0 4px 8px -4px rgba(16,24,40,0.08)',
      },
    },
  },
  plugins: [],
}

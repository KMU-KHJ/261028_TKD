/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f3f9',
          100: '#dce3f0',
          600: '#26407a',
          700: '#1d3363',
          800: '#16284f',
          900: '#0f1d3a',
        },
      },
    },
  },
  plugins: [],
};

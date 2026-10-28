/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 검은 띠 + 흰 도복(아이보리) 계열 기본 색
        belt: {
          50: '#f7f6f3',
          100: '#e9e7e2',
          600: '#44403c',
          700: '#292524',
          800: '#1c1917',
          900: '#0c0a09',
        },
        // 겨루기 홍(빨강)·청(파랑)
        hong: { 50: '#fdf2f3', 100: '#fbe1e4', 600: '#c8102e', 700: '#a00d25' },
        chung: { 50: '#eef4fb', 100: '#dbe7f6', 600: '#0047a0', 700: '#003a82' },
        // 검은 띠 자수 금색
        gold: '#c9a227',
        // 승급 띠 색
        rank: {
          white: '#f5f5f4',
          yellow: '#f2c230',
          green: '#2e8b3e',
          blue: '#1f5fbf',
          red: '#c8102e',
          black: '#0c0a09',
        },
      },
    },
  },
  plugins: [],
};

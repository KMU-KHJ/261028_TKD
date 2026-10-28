import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // 큰 라이브러리를 별도 파일로 나눠 브라우저 캐시를 잘 활용하게 합니다.
        manualChunks: {
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          markdown: ['react-markdown', 'remark-gfm'],
          react: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});

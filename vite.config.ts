import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/auth/api': {
        target: 'https://putevod-app.ru',
        changeOrigin: true,
        secure: false
      },
      '/library/api': {
        target: 'https://putevod-app.ru',
        changeOrigin: true,
        secure: false
      },
      '/external/api': {
        target: 'https://putevod-app.ru',
        changeOrigin: true,
        secure: false
      },
      '/planner/api': {
        target: 'https://putevod-app.ru',
        changeOrigin: true,
        secure: false
      }
    }
  }
});

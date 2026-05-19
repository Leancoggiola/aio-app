import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [svgr(), react()],
  resolve: {
    alias: {
      '@/features': path.resolve(__dirname, './src/app/features'),
      '@/core': path.resolve(__dirname, './src/app/core'),
      '@/components': path.resolve(__dirname, './src/app/components'),
      '@/hooks': path.resolve(__dirname, './src/app/hooks'),
      '@/common': path.resolve(__dirname, './src/common'),
      '@/theme': path.resolve(__dirname, './src/theme'),
      '@/assets': path.resolve(__dirname, './src/assets'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});

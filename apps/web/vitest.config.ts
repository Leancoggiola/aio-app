import path from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@/features': path.resolve(__dirname, './src/app/features'),
      '@/core': path.resolve(__dirname, './src/app/core'),
      '@/components': path.resolve(__dirname, './src/app/components'),
      '@/hooks': path.resolve(__dirname, './src/app/hooks'),
      '@/common': path.resolve(__dirname, './src/common'),
      '@/theme': path.resolve(__dirname, './src/theme'),
      '@/assets': path.resolve(__dirname, './src/assets'),
      '@/app': path.resolve(__dirname, './src/app'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    setupFiles: ['./src/__tests__/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/vite-env.d.ts', 'src/**/*.{test,spec}.{ts,tsx}', 'src/__tests__/**'],
      thresholds: {
        lines: 0,
        functions: 0,
        branches: 0,
        statements: 0,
      },
    },
  },
});

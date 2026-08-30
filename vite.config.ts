/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  base: '/intentionally-blank/',
  plugins: [vue()],
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
});

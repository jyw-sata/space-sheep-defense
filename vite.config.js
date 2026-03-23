import { defineConfig } from 'vite';

export default defineConfig({
  base: '/space-sheep-defense/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    port: 3000,
    open: true,
  },
});

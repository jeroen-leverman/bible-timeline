import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  server: { port: 5174, strictPort: true, open: false },
  build: { outDir: 'dist', assetsInlineLimit: 0 },
})

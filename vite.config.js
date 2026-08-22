import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  server: { port: 5174, strictPort: true, open: false },
  build: { outDir: 'dist', assetsInlineLimit: 0 },
  // Emit JSON as a single JSON.parse() with a real default export. Without this,
  // Vite splits JSON into named exports and the default is dropped in the
  // production build ONLY, so dynamically imported data silently vanishes after
  // deploy while dev looks fine. It also parses faster at this size.
  json: { stringify: true },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // This is the key fix that ensures assets are loaded correctly on GitHub Pages
  // It tells Vite to use a relative path for all your assets, which works with the subdirectory
  base: './',
});
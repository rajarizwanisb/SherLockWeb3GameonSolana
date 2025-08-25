import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    // This is the key fix that ensures assets are loaded correctly on GitHub Pages
    // It tells Vite to use the full path to your repository
    publicPath: '/SherLockWeb3GameonSolana/',
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
    },
  },
});
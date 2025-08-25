import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  // Use a relative base path to ensure all assets are loaded correctly
  base: './',

  plugins: [react()],

  // Configure the build process to output to the correct directory
  build: {
    outDir: 'dist',
    assetsDir: '', // Use an empty string to keep assets in the root of the 'dist' directory
  },

  // This ensures the paths are correct for the deployment
  publicDir: 'public',

  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
    },
  },
});
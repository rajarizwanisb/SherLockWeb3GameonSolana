import { defineConfig } from 'vite'; 
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/SherLockWeb3GameonSolana/',   // ✅ only repo name here
  plugins: [react()],
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
    },
  },
});

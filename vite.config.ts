import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/SherLockWeb3GameonSolana/",  // 👈 this is important
});

// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f7f7f7",   // or any color you want
        foreground: "#1a1a1a",   // ← define this one for text-foreground
      },
    },
  },
  plugins: [],
}

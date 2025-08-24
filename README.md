# Sherlock Web3 AI Game — Local Run

This is a Vite + React + TypeScript + Tailwind setup that wraps the provided UI code so you can run it locally.

## Prerequisites
- Node.js 18+ and npm

## Install & Run
```bash
npm install
npm run dev
```

Then open the URL printed in the terminal (usually http://localhost:5173).

## Notes
- Any `figma:asset/...` imports were replaced with `src/assets/logo.png` as a placeholder.
- Tailwind is configured (v3). Utility classes from your components should work as-is.
- Your original source files are under `src/` (components, data, hooks, services, styles).
- If you plan to connect to Solana wallets, wire up `services/solana.ts` to your preferred wallet adapter.
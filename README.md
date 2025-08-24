
Sh3rlock Mysteries: Solana Web3 Gaming Starter
This repository contains the source code for Sh3rlock Mysteries, a modern and engaging Web3 gaming application built with React and styled using Tailwind CSS. It serves as a comprehensive example for developers looking to build on the Solana blockchain, offering a seamless and intuitive wallet connection experience.

Key Features
Dual Wallet Modes: The application supports both a Demo Mode for quick, risk-free testing and a Simulated Real Mode for a more realistic development experience. This allows developers and users to explore the app's features without needing a real wallet or SOL tokens.

Intuitive UI/UX: The user interface is designed to be clean, responsive, and easy to navigate. It guides users through the wallet connection and identity creation process with clear visuals and feedback.

Simulated On-Chain Interactions: The application simulates key Web3 functionalities, including:

Wallet Connection: Connect to mock wallets like Phantom or Solflare.

Balance Display: Displays a simulated SOL balance for the connected wallet.

Airdrop Functionality: Allows users to request a simulated SOL airdrop to their wallet.

Identity Creation: Users can create a unique "detective identity" with a name and rank, simulating the minting of an NFT.

Modern Tech Stack: Built with React for a component-based architecture and styled with Tailwind CSS for rapid and responsive UI development.

How to Use This Repository
This project is an excellent resource for anyone interested in:

Learning about React and state management with Context.

Understanding the flow of a Web3 application, from wallet connection to on-chain interaction.

Building a foundation for a full-fledged Solana-based application or game.

The code is well-commented to help you understand the core logic behind the wallet provider, component rendering, and state management. Feel free to fork this repository and build upon it!




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

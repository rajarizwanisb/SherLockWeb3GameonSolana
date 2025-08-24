import { useState, useEffect, useCallback } from "react";
import { PublicKey } from "@solana/web3.js";

declare global {
  interface Window {
    solana?: any;
  }
}

export function usePhantomWallet() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if Phantom is installed
  const isPhantomInstalled = useCallback(() => {
    return typeof window !== "undefined" && window.solana && window.solana.isPhantom;
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (!isPhantomInstalled()) {
      window.open("https://phantom.app/", "_blank");
      return;
    }

    try {
      setIsConnecting(true);
      const resp = await window.solana.connect();
      setWalletAddress(resp.publicKey.toString());
      console.log("Connected to Phantom:", resp.publicKey.toString());
    } catch (err) {
      console.error("Phantom connection error:", err);
    } finally {
      setIsConnecting(false);
    }
  }, [isPhantomInstalled]);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    if (isPhantomInstalled()) {
      await window.solana.disconnect();
      setWalletAddress(null);
      console.log("Disconnected from Phantom");
    }
  }, [isPhantomInstalled]);

  // Auto-connect if already trusted
  useEffect(() => {
    if (isPhantomInstalled()) {
      window.solana.connect({ onlyIfTrusted: true })
        .then(({ publicKey }: { publicKey: PublicKey }) => {
          setWalletAddress(publicKey.toString());
        })
        .catch(() => {});
    }
  }, [isPhantomInstalled]);

  return {
    walletAddress,
    connected: !!walletAddress,
    isConnecting,
    connectWallet,
    disconnectWallet,
    isPhantomInstalled
  };
}

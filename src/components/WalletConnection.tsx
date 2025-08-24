import React, { useState } from 'react';
import logoImage from  './assets/logo.png' ;



interface WalletConnectionProps {
  onConnect: () => void;
  isReconnecting?: boolean;
}

export function WalletConnection({ onConnect, isReconnecting = false }: WalletConnectionProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    
    // Simulate wallet connection delay
    setTimeout(() => {
      setIsConnecting(false);
      onConnect();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto h-24 w-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-2xl">
            <img 
              src={logoImage} 
              alt="Sh3rlock Mysteries Logo" 
              className="h-16 w-16 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Sh3rlock Mysteries</h1>
          <p className="text-slate-400 text-sm">Web3 AI Detective Game on Solana</p>
          <div className="flex items-center justify-center gap-2 mt-2 text-xs text-slate-500">
            <span>🎮</span>
            <span>AI-Generated Cases</span>
            <span>•</span>
            <span>NFT Rewards</span>
            <span>•</span>
            <span>Blockchain Verified</span>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
          {isReconnecting ? (
            <div className="text-center space-y-3">
              <div className="h-12 w-12 rounded-full overflow-hidden bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center mx-auto">
                <img 
                  src={logoImage} 
                  alt="Welcome Back" 
                  className="h-8 w-8 object-contain"
                />
              </div>
              <h2 className="text-xl text-white font-semibold">Welcome Back, Detective!</h2>
              <p className="text-slate-300 text-sm">
                Your wallet was disconnected. Connect again to continue your detective journey and access your case collection.
              </p>
            </div>
          ) : (
            <div className="text-center space-y-3">
              <div className="h-12 w-12 rounded-full overflow-hidden bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto">
                <img 
                  src={logoImage} 
                  alt="Start Journey" 
                  className="h-8 w-8 object-contain"
                />
              </div>
              <h2 className="text-xl text-white font-semibold">Start Your Detective Journey</h2>
              <p className="text-slate-300 text-sm">
                Connect your Solana wallet to begin solving AI-generated mysteries, earning NFT rewards, and building your detective reputation.
              </p>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="space-y-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <img src={logoImage} alt="" className="h-5 w-5 object-contain" />
              Game Features
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-300">
                <span className="text-amber-400">✨</span>
                <span className="text-sm">Create unique AI-generated detective cases</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <span className="text-amber-400">🎯</span>
                <span className="text-sm">Solve cases to earn SOL rewards</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <span className="text-amber-400">🏆</span>
                <span className="text-sm">Build your detective reputation</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <span className="text-amber-400">💎</span>
                <span className="text-sm">Trade case NFTs in the marketplace</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <span className="text-amber-400">🔒</span>
                <span className="text-sm">Own unique, never-repeated mysteries</span>
              </div>
            </div>
          </div>
        </div>

        {/* Connect Button */}
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isConnecting ? (
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Connecting to Solana...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <img src={logoImage} alt="" className="h-5 w-5 object-contain" />
              <span>{isReconnecting ? 'Reconnect' : 'Connect'} Wallet</span>
            </div>
          )}
        </button>

        {/* Demo Mode Note */}
        <div className="text-center">
          <p className="text-xs text-slate-500">
            * This is a demo - no real wallet connection required
          </p>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-600 space-y-1">
          <div className="flex items-center justify-center gap-2">
            <img src={logoImage} alt="" className="h-4 w-4 object-contain opacity-60" />
            <span>Powered by Solana • Built with AI</span>
          </div>
          <p>Each case is a unique, never-repeated NFT experience</p>
          <p className="text-slate-700">© 2024 Sh3rlock Mysteries</p>
        </div>
      </div>
    </div>
  );
}
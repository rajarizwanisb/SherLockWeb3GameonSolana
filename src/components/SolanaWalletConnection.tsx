import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import React, { useState } from 'react';
import { useSolanaWallet } from '../hooks/useSolanaWallet';
import logoImage from './assets/logo.png';

interface SolanaWalletConnectionProps {
  onConnect: () => void;
  isReconnecting?: boolean;
}

// Mock wallet types for display
const WALLET_TYPES = [
  { name: 'Phantom', icon: '👻', popular: true },
  { name: 'Solflare', icon: '🔥', popular: true },
  { name: 'Math Wallet', icon: '🧮', popular: false },
  { name: 'Coin98', icon: '💰', popular: false },
  { name: 'Torus', icon: '🌐', popular: false }
];

export function SolanaWalletConnection({ onConnect, isReconnecting = false }: SolanaWalletConnectionProps) {
  const { 
    connected, 
    connecting, 
    userIdentity, 
    walletBalance,
    realMode,
    connect,
    createIdentity,
    requestAirdrop,
    switchToDemo,
    switchToReal
  } = useSolanaWallet();
  
  const [creatingIdentity, setCreatingIdentity] = useState(false);
  const [identityForm, setIdentityForm] = useState({
    name: '',
    rank: 'Rookie Detective'
  });
  const [showAirdrop, setShowAirdrop] = useState(false);
  const [showWalletChoice, setShowWalletChoice] = useState(true);
  const [showRealWallets, setShowRealWallets] = useState(false);
  const [connectingDemo, setConnectingDemo] = useState(false);
  const [connectingReal, setConnectingReal] = useState(false);
  const [realBalance, setRealBalance] = useState<number | null>(null);

  // Handle successful wallet connection
  React.useEffect(() => {
    if (connected && userIdentity) {
      onConnect();
    }
  }, [connected, userIdentity, onConnect]);

  const handleDemoConnect = async () => {
    setConnectingDemo(true);
    setShowWalletChoice(false);
    try {
      await connect(false);
    } catch (error) {
      console.error('Error connecting demo wallet:', error);
      alert('Failed to connect demo wallet. Please try again.');
      setShowWalletChoice(true);
    } finally {
      setConnectingDemo(false);
    }
  };

  // ✅ Clean Phantom Connect
  const handlePhantomConnect = async () => {
  try {
    const provider = (window as any).solana;

    if (!provider?.isPhantom) {
      window.open("https://phantom.app/", "_blank");
      throw new Error("Phantom not installed");
    }

    // ✅ Connect Phantom
    const resp = await provider.connect();
    const publicKey: PublicKey = resp.publicKey; // keep as PublicKey
    console.log("✅ Connected to Phantom:", publicKey.toBase58());

    // ✅ Connect to Solana Devnet
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    

    // ✅ Get balance using PublicKey
    const balanceLamports = await connection.getBalance(publicKey);
    const balanceSOL = balanceLamports / 1e9;
    console.log("Balance:", balanceSOL, "SOL");

    setRealBalance(balanceSOL);

    // Hook into your game logic - pass string form if needed
    await connect(true, publicKey.toBase58());

  } catch (err: any) {
    console.error("❌ Phantom connection failed:", err);
    alert(err?.message || "Phantom connection failed. Check popup or iframe issue.");
  }
};

  const handleRealConnect = async (walletName?: string) => {
    setConnectingReal(true);
    setShowRealWallets(false);
    setShowWalletChoice(false);
    try {
      if (walletName) {
        console.log(`Connecting to ${walletName} wallet...`);
      }
      await connect(true);
    } catch (error) {
      console.error('Error connecting real wallet:', error);
      alert(`Failed to connect ${walletName || 'wallet'}. In a real environment, make sure you have the wallet extension installed.`);
      setShowWalletChoice(true);
    } finally {
      setConnectingReal(false);
    }
  };

  const handleShowRealWallets = () => {
    setShowWalletChoice(false);
    setShowRealWallets(true);
  };

  const handleCreateIdentity = async () => {
    if (!identityForm.name.trim()) {
      alert('Please enter a detective name!');
      return;
    }
    
    setCreatingIdentity(true);
    try {
      await createIdentity({
        name: identityForm.name,
        detective_rank: identityForm.rank,
        cases_solved: 0,
        reputation: 0.0,
        avatar_traits: ['Observant', 'Logical', 'Determined']
      });
    } catch (error) {
      console.error('Error creating identity:', error);
      alert('Failed to create detective identity. Please try again.');
    } finally {
      setCreatingIdentity(false);
    }
  };

  const handleAirdrop = async () => {
    try {
      await requestAirdrop(2);
      setShowAirdrop(false);
      alert(`🎉 Airdrop successful! You received 2 SOL ${realMode ? 'on simulated Solana network' : 'in demo mode'}.`);
    } catch (error) {
      console.error('Error requesting airdrop:', error);
      alert(realMode 
        ? 'Airdrop failed. Network congestion or rate limit reached. This simulates real network conditions.'
        : 'Demo airdrop failed. Please try again.'
      );
    }
  };

  const handleSwitchMode = async () => {
    setShowWalletChoice(true);
    setShowRealWallets(false);
    if (realMode) {
      await switchToDemo();
    } else {
      await switchToReal();
    }
  };

  const handleBackToChoice = () => {
    setShowRealWallets(false);
    setShowWalletChoice(true);
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
            <span>Demo & Real Wallets</span>
            <span>•</span>
            <span>NFT Rewards</span>
            <span>•</span>
            <span>Solana Ready</span>
          </div>
        </div>

        {/* Connection Status */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
          {!connected ? (
            <>
              {showWalletChoice ? (
                // Wallet Choice Screen
                <div className="text-center space-y-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center mx-auto">
                    <img 
                      src={logoImage} 
                      alt="Connect Wallet" 
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                  <h2 className="text-xl text-white font-semibold">
                    {isReconnecting ? 'Reconnect to Continue' : 'Choose Your Adventure'}
                  </h2>
                  <p className="text-slate-300 text-sm">
                    {isReconnecting 
                      ? 'Your session was disconnected. Connect again to continue your detective journey.'
                      : 'Start with a demo wallet or simulate connecting your real Solana wallet.'
                    }
                  </p>
                  
                  {/* Demo Wallet Option */}
                  <button
                    onClick={handleDemoConnect}
                    disabled={connectingDemo || connecting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mb-3"
                  >
                    {connectingDemo ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Connecting Demo Wallet...</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center justify-center gap-3">
                          <span className="text-xl">🎮</span>
                          <span>Demo Wallet</span>
                        </div>
                        <div className="text-xs opacity-80">
                          Free testing • Mock blockchain • Full features
                        </div>
                      </div>
                    )}
                  </button>

                  {/* Real Wallet Option */}
                  <button
                    onClick={handleShowRealWallets}
                    disabled={connectingDemo || connecting}
                    className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-3">
                        <img 
                          src={logoImage} 
                          alt="Real Wallet" 
                          className="h-5 w-5 object-contain"
                        />
                        <span>Simulate Real Solana Wallet</span>
                      </div>
                      <div className="text-xs opacity-80">
                        Phantom, Solflare, etc. • Simulated blockchain • Demo SOL
                      </div>
                    </div>
                  </button>

                  {/* Mode Info */}
                  <div className="bg-slate-700/30 rounded-lg p-3 mt-4">
                    <div className="text-slate-300 text-xs space-y-1">
                      <p><strong>Demo:</strong> Full game with mock transactions</p>
                      <p><strong>Real Simulation:</strong> Simulated Solana wallet experience</p>
                      <p className="text-amber-400">Ready for real blockchain integration!</p>
                    </div>
                  </div>
                </div>
              ) : showRealWallets ? (
                // Real Wallet Selection Screen
                <div className="text-center space-y-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto">
                    <img 
                      src={logoImage} 
                      alt="Real Wallet" 
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                  <h2 className="text-xl text-white font-semibold">Choose Wallet Type</h2>
                  <p className="text-slate-300 text-sm">
                    Select your preferred Solana wallet. This simulates the real wallet connection experience.
                  </p>
                  
                  {/* Popular Wallets */}
                  <div className="space-y-2">
                    <div className="text-left text-sm text-slate-400 mb-2">Popular Wallets</div>
                    {WALLET_TYPES.filter(w => w.popular).map((walletType) => (
                      <button
                        key={walletType.name}
                        onClick={() => {
                          if (walletType.name === "Phantom") {
                            handlePhantomConnect(); // ✅ real Phantom connection
                          } else {
                            handleRealConnect(walletType.name); // simulated others
                          }
                        }}
                        disabled={connectingReal}
                        className="w-full flex items-center gap-3 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="text-2xl">{walletType.icon}</span>
                        <div className="flex-1 text-left">
                          <div className="text-white font-medium">{walletType.name}</div>
                          <div className="text-slate-400 text-xs">
                            {walletType.name === "Phantom" ? "Connect with Phantom" : "Simulated connection"}
                          </div>
                        </div>
                        {connectingReal && walletType.name !== "Phantom" && (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Other Wallets */}
                  <div className="space-y-2">
                    <div className="text-left text-sm text-slate-400 mb-2 mt-4">Other Wallets</div>
                    {WALLET_TYPES.filter(w => !w.popular).map((walletType) => (
                      <button
                        key={walletType.name}
                        onClick={() => handleRealConnect(walletType.name)}
                        disabled={connectingReal}
                        className="w-full flex items-center gap-3 p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="text-xl">{walletType.icon}</span>
                        <div className="flex-1 text-left">
                          <div className="text-white text-sm">{walletType.name}</div>
                          <div className="text-slate-400 text-xs">Simulated</div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleBackToChoice}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    ← Back to wallet options
                  </button>
                </div>
              ) : (
                // Connecting State
                <div className="text-center space-y-4">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mx-auto">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  </div>
                  <h2 className="text-xl text-white font-semibold">Connecting Wallet...</h2>
                  <p className="text-slate-300 text-sm">
                    {realMode 
                      ? 'Simulating real wallet connection process...'
                      : 'Setting up your demo wallet...'
                    }
                  </p>
                </div>
              )}
            </>
          ) : !userIdentity ? (
            // Create Detective Identity
            <div className="space-y-4">
              <div className="text-center mb-4">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-3">
                  <img 
                    src={logoImage} 
                    alt="Create Identity" 
                    className="h-8 w-8 object-contain"
                  />
                </div>
                <h2 className="text-xl text-white font-semibold">Create Your Detective Identity</h2>
                <p className="text-slate-300 text-sm mt-2">
                  Create your detective {realMode ? 'NFT' : 'profile'} to start solving mysteries!
                </p>
              </div>

              {/* Mode Display */}
              <div className={`${realMode ? 'bg-green-600/20 border-green-600' : 'bg-blue-600/20 border-blue-600'} border rounded-lg p-3`}>
                <div className={`flex items-center justify-between ${realMode ? 'text-green-400' : 'text-blue-400'} text-sm`}>
                  <div className="flex items-center gap-2">
                    <span>{realMode ? '⛓️' : '🎮'}</span>
                    <span>{realMode ? 'Simulated Real Wallet' : 'Demo Wallet Mode'}</span>
                  </div>
                  <button
                    onClick={handleSwitchMode}
                    className="text-xs hover:underline"
                  >
                    Switch
                  </button>
                </div>
              </div>

              {/* Identity Form */}
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-300 text-sm mb-2">Detective Name</label>
                  <input
                    type="text"
                    value={identityForm.name}
                    onChange={(e) => setIdentityForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your detective name"
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-slate-300 text-sm mb-2">Starting Rank</label>
                  <select
                    value={identityForm.rank}
                    onChange={(e) => setIdentityForm(prev => ({ ...prev, rank: e.target.value }))}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="Rookie Detective">Rookie Detective</option>
                    <option value="Junior Detective">Junior Detective</option>
                    <option value="Detective">Detective</option>
                  </select>
                </div>
              </div>

              {/* Wallet Balance & Airdrop */}
              <div className="bg-slate-700/50 rounded-lg p-3">
  <div className="flex items-center justify-between">
    <div>
      <div className="text-white font-medium text-sm">
        {realMode && realBalance !== null
          ? `Balance: ${realBalance.toFixed(3)} SOL`
          : `${realMode ? 'Simulated' : 'Demo'} Balance: ${walletBalance.toFixed(3)} SOL`}
      </div>
      <div className="text-slate-400 text-xs">
        {(realMode && realBalance !== null && realBalance < 0.1) &&
          "Need SOL for real transactions"}
      </div>
    </div>
  </div>
</div>
           
              <button
                onClick={handleCreateIdentity}
                disabled={!identityForm.name.trim() || creatingIdentity}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {creatingIdentity ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creating Identity {realMode ? 'NFT' : 'Profile'}...</span>
                  </>
                ) : (
                  <>
                    <img 
                      src={logoImage} 
                      alt="Create" 
                      className="h-4 w-4 object-contain"
                    />
                    <span>Create Detective Identity</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            // Connected and has identity
            <div className="text-center space-y-3">
              <div className="h-12 w-12 rounded-full overflow-hidden bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto">
                <img 
                  src={logoImage} 
                  alt="Connected" 
                  className="h-8 w-8 object-contain"
                />
              </div>
              <h2 className="text-xl text-white font-semibold">Welcome Back, {userIdentity.name}!</h2>
              <div className="text-slate-300 text-sm space-y-1">
                <p>Rank: {userIdentity.detective_rank}</p>
                <p>Cases Solved: {userIdentity.cases_solved}</p>
                <p>Reputation: {userIdentity.reputation.toFixed(1)}/10</p>
              </div>
              
              <div className={`${realMode ? 'bg-green-600/20 border-green-600' : 'bg-blue-600/20 border-blue-600'} border rounded-lg p-2`}>
                <div className={`text-xs ${realMode ? 'text-green-400' : 'text-blue-400'}`}>
                  {realMode ? '⛓️ Simulated Real Wallet Connected' : '🎮 Demo Wallet Active'}
                </div>
              </div>
              
              <div className="text-center pt-2">
                <div className="animate-pulse text-green-400">
                  🎉 Identity loaded! Redirecting to game...
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Airdrop Modal */}
        {showAirdrop && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-xl p-6 max-w-sm w-full border border-slate-700">
              <div className="text-center mb-4">
                <div className="text-3xl mb-2">💰</div>
                <h3 className="text-white font-semibold mb-2">
                  Request {realMode ? 'Simulated' : 'Demo'} SOL
                </h3>
                <p className="text-slate-400 text-sm">
                  {realMode 
                    ? 'Get 2 SOL on simulated network. This mimics real devnet airdrops with potential failure.'
                    : 'Get 2 SOL for demo mode. This is mock currency for testing.'
                  }
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAirdrop(false)}
                  className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAirdrop}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Request Airdrop
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Game Features */}
        <div className="space-y-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <img 
                src={logoImage} 
                alt="Features" 
                className="h-5 w-5 object-contain"
              />
              Web3 Features
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-300">
                <span className="text-amber-400">🎨</span>
                <span className="text-sm">Detective identity {realMode ? 'NFT simulation' : 'profile'} with traits</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <span className="text-amber-400">💎</span>
                <span className="text-sm">{realMode ? 'Simulated' : 'Mock'} case NFTs with full functionality</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <span className="text-amber-400">💰</span>
                <span className="text-sm">{realMode ? 'Simulated' : 'Mock'} SOL rewards for solving cases</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <span className="text-amber-400">🏪</span>
                <span className="text-sm">{realMode ? 'Simulated' : 'Demo'} marketplace functionality</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <span className="text-amber-400">⚡</span>
                <span className="text-sm">{realMode ? 'Simulated blockchain' : 'Instant demo'} transactions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Network Info */}
        <div className="text-center text-xs text-slate-600 space-y-1">
          <div className="flex items-center justify-center gap-2">
            <img 
              src={logoImage} 
              alt="Logo" 
              className="h-4 w-4 object-contain opacity-60"
            />
            <span>
              {realMode 
                ? 'Simulated Solana Network Experience'
                : 'Demo Mode • Ready for Solana Integration'
              }
            </span>
          </div>
          <p>{realMode ? 'Simulated blockchain functionality' : 'Mock blockchain functionality'} • Web3 detective gaming</p>
          <p className="text-slate-700">© 2024 Sh3rlock Mysteries</p>
        </div>
      </div>
    </div>
  );

}

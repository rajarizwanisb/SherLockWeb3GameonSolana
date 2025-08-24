import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { IdentityCard } from './components/IdentityCard';
import { CaseLibrary } from './components/CaseLibrary';
import { CasePlayer } from './components/CasePlayer';
import { Marketplace } from './components/Marketplace';
import { CaseCreator } from './components/CaseCreator';
import { SolanaWalletConnection } from './components/SolanaWalletConnection';
import { SolanaWalletProvider, useSolanaWallet } from './hooks/useSolanaWallet';
import { DEMO_CASES } from './data/demoCases';

interface DetectiveCase {
  id: string;
  title: string;
  difficulty: 'Novice' | 'Intermediate' | 'Expert' | 'Master';
  description: string;
  story: string[];
  clues: string[];
  solution: string;
  reward: number;
  mint_address: string;
  is_owned: boolean;
  is_solved: boolean;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  category?: string;
  is_user_created?: boolean;
}

function GameApp() {
  const {
    connected,
    userIdentity,
    ownedCases,
    walletBalance,
    realMode,
    disconnect,
    createCase,
    buyCase,
    solveCase,
    refreshData
  } = useSolanaWallet();

  const [currentView, setCurrentView] = useState<'home' | 'library' | 'marketplace' | 'case' | 'create'>('home');
  const [selectedCase, setSelectedCase] = useState<DetectiveCase | null>(null);
  const [demoMode, setDemoMode] = useState(true); // Default to demo mode
  const [previousView, setPreviousView] = useState<'home' | 'library' | 'marketplace' | 'create'>('home');
  const [wasDisconnected, setWasDisconnected] = useState(false);

  // Sync demo mode with wallet real mode (inverted)
  useEffect(() => {
    setDemoMode(!realMode);
  }, [realMode]);

  useEffect(() => {
    document.title = 'Sherlock Mysteries - Web3 Detective Game';
  }, []);

  const handleCaseSelect = (caseData: DetectiveCase) => {
    setPreviousView(currentView as 'home' | 'library' | 'marketplace' | 'create');
    setSelectedCase(caseData);
    setCurrentView('case');
  };

  const handleCaseGenerated = async (caseData: Partial<DetectiveCase>) => {
    try {
      // Create case (mock or real depending on implementation)
      const newCase = await createCase({
        ...caseData,
        is_user_created: true
      });
      
      // Set as selected case and go to case player
      setSelectedCase(newCase);
      setPreviousView('create');
      setCurrentView('case');
    } catch (error) {
      console.error('Error creating case:', error);
      alert('Failed to create case. Please try again.');
    }
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSelectedCase(null);
    setPreviousView('home');
  };

  const handleBackToPrevious = () => {
    setCurrentView(previousView);
    setSelectedCase(null);
  };

  const handleViewChange = (view: 'home' | 'library' | 'marketplace' | 'case' | 'create') => {
    if (view !== 'case') {
      setSelectedCase(null);
      setPreviousView(currentView as 'home' | 'library' | 'marketplace' | 'create');
    }
    setCurrentView(view);
  };

  const handleTryAnotherCase = () => {
    setSelectedCase(null);
    setCurrentView('library');
    setPreviousView('case' as any);
  };

  const handleWalletDisconnect = async () => {
    try {
      await disconnect();
      setCurrentView('home');
      setSelectedCase(null);
      setPreviousView('home');
      setDemoMode(true);
      setWasDisconnected(true);
      console.log('Wallet disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const handleWalletConnect = () => {
    setWasDisconnected(false);
    refreshData(); // Refresh data
  };

  const handleCaseComplete = async (solved: boolean) => {
    if (!solved || !selectedCase || !userIdentity) return;

    try {
      // Handle case completion
      await solveCase(selectedCase.id, selectedCase.reward);
      
      // Show success message
      setTimeout(() => {
        alert(`🎉 Congratulations! You solved "${selectedCase.title}"!\n\nYou earned ${selectedCase.reward} SOL and your reputation increased!\n\n${demoMode ? 'This is demo mode - in the real game this would be on the blockchain!' : 'Case completion simulated on blockchain!'}`);
      }, 1000);
    } catch (error) {
      console.error('Error completing case:', error);
      alert('Failed to complete case. Please try again.');
    }
  };

  const handlePurchaseCase = async (caseMint: string, price: number) => {
    try {
      await buyCase(caseMint, price);
      alert(`🎉 Purchase Successful!\n\nYou've acquired the case for ${price} SOL.\n\n${demoMode ? 'This is demo mode - in the real game the NFT would be transferred to your wallet!' : 'The case NFT transfer has been simulated!'}`);
    } catch (error) {
      console.error('Error purchasing case:', error);
      alert(`💰 Purchase Failed\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease check your balance and try again.`);
    }
  };

  // Keyboard navigation - ESC key goes back
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (currentView === 'case') {
          handleBackToPrevious();
        } else if (currentView !== 'home') {
          handleBackToHome();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentView, previousView]);

  if (!connected || !userIdentity) {
    return (
      <SolanaWalletConnection 
        onConnect={handleWalletConnect} 
        isReconnecting={wasDisconnected} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Header 
        currentView={currentView} 
        onViewChange={handleViewChange}
        onBackToHome={handleBackToHome}
        onWalletDisconnect={handleWalletDisconnect}
        userIdentity={userIdentity}
      />
      
      <main className="container mx-auto px-4 py-6 max-w-md">
        {currentView === 'home' && (
          <div className="space-y-6">
            {userIdentity && <IdentityCard identity={userIdentity} />}
            
            {/* Wallet Balance */}
            <div className="bg-gradient-to-r from-amber-600/20 to-yellow-600/20 border border-amber-600 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    💰 {realMode ? 'Simulated' : 'Demo'} Balance
                  </h3>
                  <p className="text-amber-200">
                    {walletBalance.toFixed(3)} SOL
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-amber-400 text-xs">
                    {realMode ? 'Simulated Blockchain' : 'Demo Mode'}
                  </div>
                  <div className="text-white font-semibold text-xs">
                    {realMode ? 'Mock Solana Network' : 'Mock Chain'}
                  </div>
                </div>
              </div>
            </div>

            {/* Mode Display */}
            <div className={`${realMode ? 'bg-green-800/30 border-green-600' : 'bg-blue-800/30 border-blue-600'} rounded-xl p-4 border`}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    {realMode ? '⛓️ Simulated Blockchain Mode' : '🎮 Demo Mode'}
                  </h3>
                  <p className="text-slate-400 text-sm">
                    {realMode 
                      ? 'Simulated Solana wallet experience with realistic transaction flows' 
                      : `Access all ${DEMO_CASES.length} demo cases with mock blockchain`
                    }
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-lg ${realMode ? 'bg-green-600' : 'bg-blue-600'} text-white text-sm font-medium`}>
                  {realMode ? 'SIM' : 'DEMO'}
                </div>
              </div>
              <div className={`text-xs mt-2 ${realMode ? 'text-green-400' : 'text-blue-400'}`}>
                {realMode 
                  ? '🔗 Simulating real Solana blockchain experience for development'
                  : '✨ Demo mode enabled! Full game functionality with mock blockchain'
                }
              </div>
            </div>

            {/* NFT Collection Stats */}
            <div className="bg-slate-800 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                📊 Your Collection
              </h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-purple-400 font-semibold">{ownedCases.length}</div>
                  <div className="text-slate-400 text-xs">Case {realMode ? 'NFTs' : 'Items'}</div>
                </div>
                <div>
                  <div className="text-green-400 font-semibold">
                    {ownedCases.filter(c => c.is_solved).length}
                  </div>
                  <div className="text-slate-400 text-xs">Solved</div>
                </div>
                <div>
                  <div className="text-blue-400 font-semibold">
                    {ownedCases.filter(c => c.is_user_created).length}
                  </div>
                  <div className="text-slate-400 text-xs">Created</div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setCurrentView('create')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-2xl mb-2">✨</div>
                <div>Create Case</div>
                <div className="text-xs opacity-80 mt-1">
                  {realMode ? 'Simulated NFT' : 'Mock NFT'}
                </div>
              </button>
              
              <button
                onClick={() => setCurrentView('library')}
                className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-2xl mb-2">🔍</div>
                <div>My Cases</div>
                <div className="text-xs opacity-80 mt-1">
                  {ownedCases.length} owned
                </div>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => setCurrentView('marketplace')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-2xl mb-2">🛒</div>
                <div>Marketplace</div>
                <div className="text-xs opacity-80 mt-1">
                  Buy & trade cases
                </div>
              </button>
            </div>

            {/* Integration Info */}
            <div className="bg-slate-800 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                {realMode ? '⛓️ Simulated Blockchain Features' : '🎮 Demo Features'}
              </h3>
              <div className="space-y-2 text-sm text-slate-300">
                {realMode ? (
                  <>
                    <p>• Simulated detective identity as non-transferable NFT</p>
                    <p>• Mock case NFTs with realistic transaction flows</p>
                    <p>• Simulated SOL rewards with network delays</p>
                    <p>• Realistic wallet connection experience</p>
                    <p>• Ready for real Solana blockchain integration</p>
                  </>
                ) : (
                  <>
                    <p>• Mock detective identity with persistent data</p>
                    <p>• Demo case creation and solving mechanics</p>
                    <p>• Simulated SOL rewards and transactions</p>
                    <p>• Full marketplace functionality preview</p>
                    <p>• Ready for real blockchain integration</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {currentView === 'create' && (
          <CaseCreator
            onCaseGenerated={handleCaseGenerated}
            userIdentity={userIdentity}
          />
        )}

        {currentView === 'library' && (
          <CaseLibrary 
            onCaseSelect={handleCaseSelect}
            ownedCases={ownedCases}
            demoMode={demoMode}
          />
        )}

        {currentView === 'marketplace' && (
          <Marketplace 
            onCaseSelect={handleCaseSelect}
            onPurchaseCase={handlePurchaseCase}
            userIdentity={userIdentity}
            walletBalance={walletBalance}
            demoMode={demoMode}
          />
        )}

        {currentView === 'case' && selectedCase && (
          <CasePlayer 
            caseData={selectedCase}
            onComplete={handleCaseComplete}
            onBackToPrevious={handleBackToPrevious}
            onTryAnotherCase={handleTryAnotherCase}
            previousView={previousView}
          />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <SolanaWalletProvider>
      <GameApp />
    </SolanaWalletProvider>
  );
}
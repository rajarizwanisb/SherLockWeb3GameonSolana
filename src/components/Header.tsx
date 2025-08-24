import React, { useState } from 'react';
import { ChevronLeft, Home, User, LogOut, MoreHorizontal } from 'lucide-react';
import logoImage from  './assets/logo.png' ;

interface UserIdentity {
  id: string;
  name: string;
  detective_rank: string;
  cases_solved: number;
  reputation: number;
  avatar_traits: string[];
  mint_address: string;
}

interface HeaderProps {
  currentView: 'home' | 'library' | 'marketplace' | 'case' | 'create';
  onViewChange: (view: 'home' | 'library' | 'marketplace' | 'case' | 'create') => void;
  onBackToHome: () => void;
  onWalletDisconnect: () => void;
  userIdentity: UserIdentity | null;
}

export function Header({ currentView, onViewChange, onBackToHome, onWalletDisconnect, userIdentity }: HeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);

  const getPageTitle = () => {
    switch (currentView) {
      case 'home': return 'Detective Dashboard';
      case 'library': return 'Case Library';
      case 'marketplace': return 'Marketplace';
      case 'case': return 'Case Investigation';
      case 'create': return 'Create Case';
      default: return 'Sh3rlock Mysteries';
    }
  };

  const handleDisconnectClick = () => {
    setShowDisconnectConfirm(true);
    setShowUserMenu(false);
  };

  const confirmDisconnect = () => {
    setShowDisconnectConfirm(false);
    onWalletDisconnect();
  };

  const cancelDisconnect = () => {
    setShowDisconnectConfirm(false);
  };

  return (
    <>
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 max-w-md">
          <div className="flex items-center justify-between">
            {/* Left Side - Logo/Home Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={onBackToHome}
                className="flex items-center gap-2 text-white hover:text-amber-300 transition-colors"
                title="Return to Home"
              >
                <div className="h-8 w-8 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                  <img 
                    src={logoImage} 
                    alt="Sh3rlock Mysteries Logo" 
                    className="h-6 w-6 object-contain"
                  />
                </div>
                <span className="font-semibold text-sm text-amber-400">Sh3rlock</span>
              </button>
            </div>

            {/* Center - Page Title */}
            <div className="flex-1 text-center">
              <h1 className="text-white font-semibold text-sm truncate">
                {getPageTitle()}
              </h1>
            </div>

            {/* Right Side - User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <User className="h-5 w-5" />
                <MoreHorizontal className="h-4 w-4" />
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50">
                  {userIdentity && (
                    <div className="p-4 border-b border-slate-700">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                          <img 
                            src={logoImage} 
                            alt="Detective Badge" 
                            className="h-5 w-5 object-contain"
                          />
                        </div>
                        <div>
                          <div className="text-white font-semibold text-sm">
                            {userIdentity.name}
                          </div>
                          <div className="text-slate-400 text-xs">
                            {userIdentity.detective_rank}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="text-slate-300">
                          <span className="text-slate-500">Cases:</span> {userIdentity.cases_solved}
                        </div>
                        <div className="text-slate-300">
                          <span className="text-slate-500">Rep:</span> {userIdentity.reputation.toFixed(1)}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-2">
                    <button
                      onClick={() => {
                        onBackToHome();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-slate-300 hover:bg-slate-700 rounded-md transition-colors text-sm mb-1"
                    >
                      <Home className="h-4 w-4" />
                      <span>Go to Dashboard</span>
                    </button>
                    <button
                      onClick={handleDisconnectClick}
                      className="w-full flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-slate-700 rounded-md transition-colors text-sm"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Disconnect Wallet</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Disconnect Confirmation Dialog */}
      {showDisconnectConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-xl p-6 max-w-sm w-full border border-slate-700">
            <div className="text-center mb-4">
              <div className="h-12 w-12 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center mx-auto mb-3">
                <img 
                  src={logoImage} 
                  alt="Sh3rlock Mysteries" 
                  className="h-8 w-8 object-contain"
                />
              </div>
              <h3 className="text-white font-semibold mb-2">Disconnect Wallet?</h3>
              <p className="text-slate-400 text-sm">
                This will log you out and clear all your session data. You'll need to reconnect to continue playing.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={cancelDisconnect}
                className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={confirmDisconnect}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  );
}
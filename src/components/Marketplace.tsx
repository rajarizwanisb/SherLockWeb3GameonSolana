import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, Trophy, Star, Zap } from 'lucide-react';
import { DEMO_CASES } from '../data/demoCases';

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
  price?: number;
}

interface UserIdentity {
  id: string;
  name: string;
  detective_rank: string;
  cases_solved: number;
  reputation: number;
  avatar_traits: string[];
  mint_address: string;
}

interface MarketplaceProps {
  onCaseSelect: (caseData: DetectiveCase) => void;
  onPurchaseCase: (caseMint: string, price: number) => Promise<void>;
  userIdentity: UserIdentity | null;
  walletBalance: number;
  demoMode: boolean;
}

export function Marketplace({ onCaseSelect, onPurchaseCase, userIdentity, walletBalance, demoMode }: MarketplaceProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRarity, setSelectedRarity] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'price' | 'rarity' | 'difficulty'>('price');
  const [showFilters, setShowFilters] = useState(false);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  // Get available cases for purchase (not owned) - in real implementation, this would fetch from marketplace
  const availableCases = DEMO_CASES.filter(caseItem => !caseItem.is_owned).map(caseItem => ({
    ...caseItem,
    price: caseItem.reward * 1.2 // Set marketplace price as 120% of reward value
  }));
  
  // Filter and sort cases
  const filteredCases = availableCases.filter(caseItem => {
    const matchesSearch = caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || caseItem.category === selectedCategory;
    const matchesRarity = selectedRarity === 'All' || caseItem.rarity === selectedRarity;

    return matchesSearch && matchesCategory && matchesRarity;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return (b.price || 0) - (a.price || 0);
      case 'rarity':
        const rarityOrder = { 'Common': 1, 'Rare': 2, 'Epic': 3, 'Legendary': 4 };
        return rarityOrder[b.rarity] - rarityOrder[a.rarity];
      case 'difficulty':
        const difficultyOrder = { 'Novice': 1, 'Intermediate': 2, 'Expert': 3, 'Master': 4 };
        return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
      default:
        return 0;
    }
  });

  const categories = ['All', 'Traditional', 'Crypto', 'Cyber', 'Corporate', 'Social'];
  const rarities = ['All', 'Common', 'Rare', 'Epic', 'Legendary'];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Novice': return 'text-green-400';
      case 'Intermediate': return 'text-yellow-400';
      case 'Expert': return 'text-orange-400';
      case 'Master': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Common': return 'text-gray-400';
      case 'Rare': return 'text-blue-400';
      case 'Epic': return 'text-purple-400';
      case 'Legendary': return 'text-yellow-400';
      default: return 'text-slate-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Traditional': return '🔍';
      case 'Crypto': return '₿';
      case 'Cyber': return '💻';
      case 'Corporate': return '🏢';
      case 'Social': return '📱';
      default: return '🕵️';
    }
  };

  const handlePurchase = async (caseItem: DetectiveCase, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (!caseItem.price) return;
    
    const price = caseItem.price;
    
    // Check if user has sufficient balance (only in real mode)
    if (!demoMode && walletBalance < price) {
      alert(`💰 Insufficient SOL\n\nYou need ${price.toFixed(3)} SOL to purchase this case.\nYour current balance: ${walletBalance.toFixed(3)} SOL\n\nEarn more SOL by solving cases or enable Demo Mode to try purchasing!`);
      return;
    }

    if (demoMode) {
      alert(`🎉 Demo Purchase Successful!\n\nYou've "acquired" "${caseItem.title}" for ${price.toFixed(3)} SOL.\n\nIn the real game, this would:\n• Deduct ${price.toFixed(3)} SOL from your wallet\n• Transfer the case NFT to your wallet\n• Add the case to your library\n\nDisable Demo Mode for real blockchain transactions!`);
      return;
    }

    // Real blockchain purchase
    setPurchasing(caseItem.id);
    try {
      await onPurchaseCase(caseItem.mint_address, price);
    } catch (error) {
      console.error('Purchase failed:', error);
    } finally {
      setPurchasing(null);
    }
  };

  const canAfford = (price: number) => {
    return demoMode || walletBalance >= price;
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="bg-slate-800 rounded-xl p-4">
        <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
          🛒 NFT Marketplace
        </h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-blue-400 font-semibold">{filteredCases.length}</div>
            <div className="text-slate-400 text-xs">Available</div>
          </div>
          <div>
            <div className="text-purple-400 font-semibold">
              {filteredCases.filter(c => c.rarity === 'Epic' || c.rarity === 'Legendary').length}
            </div>
            <div className="text-slate-400 text-xs">Rare+</div>
          </div>
          <div>
            <div className="text-amber-400 font-semibold">
              {filteredCases.reduce((sum, c) => sum + (c.price || 0), 0).toFixed(1)}
            </div>
            <div className="text-slate-400 text-xs">Total SOL</div>
          </div>
        </div>
      </div>

      {/* User Balance */}
      <div className="bg-gradient-to-r from-amber-600/20 to-yellow-600/20 border border-amber-600 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold flex items-center gap-2">
              💰 Your Balance
            </h3>
            <p className="text-amber-200 text-sm">
              {demoMode ? '∞ SOL (Demo Mode)' : `${walletBalance.toFixed(3)} SOL`}
            </p>
          </div>
          <div className="text-right">
            <div className="text-amber-400 text-xs">Reputation</div>
            <div className="text-white font-semibold">
              {userIdentity?.reputation.toFixed(1) || '0.0'}/10
            </div>
          </div>
        </div>
        
        {!demoMode && walletBalance < 0.1 && (
          <div className="mt-2 text-xs text-amber-300">
            💡 Low balance! Solve cases to earn more SOL or enable Demo Mode
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search NFT cases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
          />
        </div>

        {/* Filter Toggle & Sort */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span className="text-sm">Filters</span>
          </button>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'price' | 'rarity' | 'difficulty')}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value="price">Sort by Price</option>
            <option value="rarity">Sort by Rarity</option>
            <option value="difficulty">Sort by Difficulty</option>
          </select>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <div className="bg-slate-800 rounded-lg p-4 space-y-3">
            <div>
              <label className="block text-slate-300 text-sm mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-300 text-sm mb-2">Rarity</label>
              <select
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              >
                {rarities.map(rarity => (
                  <option key={rarity} value={rarity}>{rarity}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedRarity('All');
              }}
              className="text-amber-400 hover:text-amber-300 text-sm"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Mode Notice */}
      <div className={`${demoMode ? 'bg-blue-600/20 border-blue-600' : 'bg-green-600/20 border-green-600'} border rounded-lg p-3`}>
        <div className={`flex items-center gap-2 ${demoMode ? 'text-blue-400' : 'text-green-400'} text-sm`}>
          <span>{demoMode ? '💎' : '⛓️'}</span>
          <span>
            {demoMode 
              ? 'Demo Mode: Unlimited SOL for testing purchases' 
              : 'Live Mode: Real blockchain transactions with your SOL'
            }
          </span>
        </div>
      </div>

      {/* Cases Grid */}
      <div className="space-y-3">
        {filteredCases.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🛒</div>
            <p className="text-slate-400">No cases found in marketplace</p>
          </div>
        ) : (
          filteredCases.map((caseItem) => {
            const affordable = canAfford(caseItem.price || 0);
            const isPurchasing = purchasing === caseItem.id;
            
            return (
              <div
                key={caseItem.id}
                className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-blue-500 hover:bg-slate-750 transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">
                    {getCategoryIcon(caseItem.category || '')}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-medium truncate">{caseItem.title}</h3>
                      
                      {/* Rarity Badge */}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        caseItem.rarity === 'Legendary' ? 'bg-yellow-600 text-white' :
                        caseItem.rarity === 'Epic' ? 'bg-purple-600 text-white' :
                        caseItem.rarity === 'Rare' ? 'bg-blue-600 text-white' :
                        'bg-slate-600 text-slate-300'
                      }`}>
                        {caseItem.rarity}
                      </span>

                      {/* NFT Badge */}
                      <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs px-2 py-1 rounded-full">
                        NFT
                      </span>
                    </div>
                    
                    <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                      {caseItem.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3 text-xs">
                        <span className={getDifficultyColor(caseItem.difficulty)}>
                          {caseItem.difficulty}
                        </span>
                        {caseItem.category && (
                          <span className="text-slate-500">{caseItem.category}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 text-amber-400">
                        <Trophy className="h-3 w-3" />
                        <span className="text-xs font-medium">{caseItem.reward} SOL reward</span>
                      </div>
                    </div>

                    {/* Price Display */}
                    <div className="bg-slate-700/50 rounded-lg p-2 mb-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">Price:</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold ${affordable ? 'text-green-400' : 'text-red-400'}`}>
                            {caseItem.price?.toFixed(3)} SOL
                          </span>
                          {!affordable && !demoMode && (
                            <span className="text-red-400 text-xs">⚠️</span>
                          )}
                        </div>
                      </div>
                      
                      {caseItem.price && caseItem.reward && (
                        <div className="text-xs text-slate-500 mt-1">
                          ROI: {((caseItem.reward / caseItem.price - 1) * 100).toFixed(0)}% if solved
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onCaseSelect(caseItem)}
                        className="flex-1 bg-slate-700 text-slate-300 py-2 px-3 rounded-lg hover:bg-slate-600 transition-colors text-sm flex items-center justify-center gap-1"
                      >
                        <Zap className="h-3 w-3" />
                        Preview
                      </button>
                      <button
                        onClick={(e) => handlePurchase(caseItem, e)}
                        disabled={(!affordable && !demoMode) || isPurchasing}
                        className={`flex-1 py-2 px-3 rounded-lg transition-colors text-sm flex items-center justify-center gap-1 font-medium ${
                          (!affordable && !demoMode) 
                            ? 'bg-slate-600 text-slate-500 cursor-not-allowed'
                            : isPurchasing
                              ? 'bg-amber-600 text-white cursor-wait'
                              : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                        }`}
                      >
                        {isPurchasing ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                            Buying...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-3 w-3" />
                            Buy {caseItem.price?.toFixed(3)} SOL
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Marketplace Info */}
      <div className="bg-slate-800 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          ℹ️ NFT Marketplace Info
        </h3>
        <div className="space-y-2 text-sm text-slate-300">
          <p>• Each case is a unique NFT stored on Solana blockchain</p>
          <p>• Purchase cases to add them to your permanent collection</p>
          <p>• Solve cases to earn SOL rewards based on difficulty</p>
          <p>• Higher rarity cases offer better rewards and exclusive content</p>
          <p>• Case ownership and transactions are verified on-chain</p>
          <p>• {demoMode ? 'Demo mode: Test purchases without real transactions' : 'Live mode: Real SOL transactions'}</p>
        </div>
      </div>
    </div>
  );
}
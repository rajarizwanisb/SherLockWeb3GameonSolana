import React, { useState } from 'react';
import { Search, Filter, Trophy, Star, Lock } from 'lucide-react';
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
}

interface CaseLibraryProps {
  onCaseSelect: (caseData: DetectiveCase) => void;
  ownedCases: DetectiveCase[];
  demoMode: boolean;
}

export function CaseLibrary({ onCaseSelect, ownedCases, demoMode }: CaseLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);

  // In demo mode, show all DEMO_CASES. Otherwise, show owned cases
  const availableCases = demoMode ? DEMO_CASES : ownedCases;
  
  // Filter cases based on search and filters
  const filteredCases = availableCases.filter(caseItem => {
    const matchesSearch = caseItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         caseItem.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || caseItem.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || caseItem.difficulty === selectedDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const categories = ['All', 'Traditional', 'Crypto', 'Cyber', 'Corporate', 'Social'];
  const difficulties = ['All', 'Novice', 'Intermediate', 'Expert', 'Master'];

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

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="bg-slate-800 rounded-xl p-4">
        <h2 className="text-white font-semibold mb-3 flex items-center gap-2">
          📚 {demoMode ? 'Demo Case Library' : 'My Case Library'}
        </h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-blue-400 font-semibold">{filteredCases.length}</div>
            <div className="text-slate-400 text-xs">Available</div>
          </div>
          <div>
            <div className="text-green-400 font-semibold">
              {filteredCases.filter(c => c.is_solved).length}
            </div>
            <div className="text-slate-400 text-xs">Solved</div>
          </div>
          <div>
            <div className="text-purple-400 font-semibold">
              {filteredCases.filter(c => c.is_user_created).length}
            </div>
            <div className="text-slate-400 text-xs">Created</div>
          </div>
        </div>
      </div>

      {/* Mode Notice */}
      <div className={`${demoMode ? 'bg-blue-600/20 border-blue-600' : 'bg-green-600/20 border-green-600'} border rounded-lg p-3`}>
        <div className={`flex items-center gap-2 ${demoMode ? 'text-blue-400' : 'text-green-400'} text-sm`}>
          <span>{demoMode ? '🎮' : '💎'}</span>
          <span>
            {demoMode 
              ? `Demo Mode: Browse all ${DEMO_CASES.length} sample cases for testing` 
              : `Your Collection: ${ownedCases.length} owned case NFTs`
            }
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search cases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none"
          />
        </div>

        {/* Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span className="text-sm">Filters</span>
          </button>
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
              <label className="block text-slate-300 text-sm mb-2">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedDifficulty('All');
              }}
              className="text-amber-400 hover:text-amber-300 text-sm"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Cases List */}
      <div className="space-y-3">
        {filteredCases.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            {!demoMode && ownedCases.length === 0 ? (
              <div>
                <p className="text-slate-400 mb-4">You don't own any case NFTs yet</p>
                <div className="space-y-2 text-sm text-slate-500">
                  <p>• Create your own cases using the Case Creator</p>
                  <p>• Purchase cases from the Marketplace</p>
                  <p>• Enable Demo Mode to preview sample cases</p>
                </div>
              </div>
            ) : (
              <p className="text-slate-400">No cases found matching your search criteria</p>
            )}
          </div>
        ) : (
          filteredCases.map((caseItem, index) => (
            <div
              key={`${caseItem.id}-${index}`}
              onClick={() => onCaseSelect(caseItem)}
              className="bg-slate-800 rounded-xl p-4 border border-slate-700 hover:border-amber-500 hover:bg-slate-750 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="text-2xl">
                  {getCategoryIcon(caseItem.category || '')}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-medium truncate">{caseItem.title}</h3>
                    
                    {/* Status Badges */}
                    {caseItem.is_solved && (
                      <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                        ✓ Solved
                      </span>
                    )}
                    
                    {caseItem.is_user_created && (
                      <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                        📝 Created
                      </span>
                    )}

                    {demoMode && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                        🎮 Demo
                      </span>
                    )}
                  </div>
                  
                  <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                    {caseItem.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className={getDifficultyColor(caseItem.difficulty)}>
                        {caseItem.difficulty}
                      </span>
                      <span className={getRarityColor(caseItem.rarity)}>
                        {caseItem.rarity}
                      </span>
                      {caseItem.category && (
                        <span className="text-slate-500">{caseItem.category}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 text-amber-400">
                      <Trophy className="h-3 w-3" />
                      <span>{caseItem.reward} SOL</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Help Text */}
      <div className="bg-slate-800 rounded-xl p-4">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          💡 How to Use Your Library
        </h3>
        <div className="space-y-2 text-sm text-slate-300">
          {demoMode ? (
            <>
              <p>• Demo mode lets you browse and try all available cases</p>
              <p>• Click any case to start investigating immediately</p>
              <p>• Demo cases don't require ownership or payment</p>
              <p>• Disable demo mode to see your real NFT collection</p>
            </>
          ) : (
            <>
              <p>• Your owned case NFTs are displayed here</p>
              <p>• Click any case to start investigating and earning rewards</p>
              <p>• Solved cases can be replayed anytime</p>
              <p>• Create new cases or buy from marketplace to expand</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
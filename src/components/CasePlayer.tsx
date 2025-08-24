import React, { useState } from 'react';
import { ChevronLeft, Eye, Lightbulb, CheckCircle, Trophy, ArrowRight } from 'lucide-react';

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

interface CasePlayerProps {
  caseData: DetectiveCase;
  onComplete: (solved: boolean) => void;
  onBackToPrevious: () => void;
  onTryAnotherCase: () => void;
  previousView: 'home' | 'library' | 'marketplace' | 'create';
}

export function CasePlayer({ caseData, onComplete, onBackToPrevious, onTryAnotherCase, previousView }: CasePlayerProps) {
  const [currentStep, setCurrentStep] = useState<'story' | 'investigation' | 'solution'>('story');
  const [revealedClues, setRevealedClues] = useState<number[]>([]);
  const [userSolution, setUserSolution] = useState('');
  const [showSolution, setShowSolution] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isSolved, setIsSolved] = useState(false);

  const handleRevealClue = (index: number) => {
    if (!revealedClues.includes(index)) {
      setRevealedClues([...revealedClues, index]);
    }
  };

  const handleSubmitSolution = () => {
    const isCorrect = userSolution.toLowerCase().includes(caseData.solution.toLowerCase().slice(0, 20));
    setIsSolved(isCorrect);
    setShowSolution(true);
    setIsComplete(true);
    onComplete(isCorrect);
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={onBackToPrevious}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="text-sm">Back to {previousView === 'create' ? 'Create' : previousView === 'marketplace' ? 'Marketplace' : 'Library'}</span>
          </button>
        </div>
        
        <div className="flex items-start gap-3">
          <div className="text-3xl">
            {caseData.is_user_created ? '✨' : (
              caseData.category === 'Traditional' ? '🔍' :
              caseData.category === 'Crypto' ? '₿' :
              caseData.category === 'Cyber' ? '💻' :
              caseData.category === 'Corporate' ? '🏢' :
              caseData.category === 'Social' ? '📱' : '🕵️'
            )}
          </div>
          
          <div className="flex-1">
            <h1 className="text-white font-semibold text-lg mb-1">{caseData.title}</h1>
            <p className="text-slate-400 text-sm mb-2">{caseData.description}</p>
            
            <div className="flex items-center gap-4 text-xs">
              <span className={getDifficultyColor(caseData.difficulty)}>
                {caseData.difficulty}
              </span>
              <span className={getRarityColor(caseData.rarity)}>
                {caseData.rarity}
              </span>
              <div className="flex items-center gap-1 text-amber-400">
                <Trophy className="h-3 w-3" />
                <span>{caseData.reward} SOL</span>
              </div>
              {caseData.is_user_created && (
                <span className="bg-purple-600 text-white px-2 py-1 rounded-full">
                  User Created
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-slate-800 rounded-xl p-1">
        <button
          onClick={() => setCurrentStep('story')}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
            currentStep === 'story'
              ? 'bg-amber-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          📖 Story
        </button>
        <button
          onClick={() => setCurrentStep('investigation')}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
            currentStep === 'investigation'
              ? 'bg-amber-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          🔍 Investigation
        </button>
        <button
          onClick={() => setCurrentStep('solution')}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
            currentStep === 'solution'
              ? 'bg-amber-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          💡 Solution
        </button>
      </div>

      {/* Content */}
      {currentStep === 'story' && (
        <div className="space-y-4">
          <div className="bg-slate-800 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              📖 Case Background
            </h3>
            <div className="space-y-3">
              {caseData.story.map((paragraph, index) => (
                <p key={index} className="text-slate-300 text-sm leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          
          <div className="text-center">
            <button
              onClick={() => setCurrentStep('investigation')}
              className="bg-gradient-to-r from-amber-600 to-yellow-600 text-white py-3 px-6 rounded-lg hover:from-amber-700 hover:to-yellow-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <span>Begin Investigation</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {currentStep === 'investigation' && (
        <div className="space-y-4">
          <div className="bg-slate-800 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              🔍 Evidence & Clues
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Click on clues to reveal them. Use your detective skills to piece together the truth.
            </p>
            
            <div className="space-y-3">
              {caseData.clues.map((clue, index) => (
                <div
                  key={index}
                  className={`border border-slate-700 rounded-lg p-3 transition-all duration-200 ${
                    revealedClues.includes(index)
                      ? 'bg-slate-700/50'
                      : 'bg-slate-800 hover:bg-slate-700 cursor-pointer'
                  }`}
                  onClick={() => handleRevealClue(index)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${
                      revealedClues.includes(index)
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-600 text-slate-400'
                    }`}>
                      {revealedClues.includes(index) ? (
                        <Eye className="h-3 w-3" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    
                    <div className="flex-1">
                      {revealedClues.includes(index) ? (
                        <p className="text-slate-300 text-sm">{clue}</p>
                      ) : (
                        <p className="text-slate-500 text-sm">Click to reveal clue {index + 1}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center">
            <button
              onClick={() => setCurrentStep('solution')}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <Lightbulb className="h-4 w-4" />
              <span>Submit Solution</span>
            </button>
          </div>
        </div>
      )}

      {currentStep === 'solution' && (
        <div className="space-y-4">
          {!isComplete ? (
            <div className="bg-slate-800 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                💡 Your Solution
              </h3>
              <p className="text-slate-400 text-sm mb-4">
                Based on your investigation, who do you think is responsible and how did they do it?
              </p>
              
              <textarea
                value={userSolution}
                onChange={(e) => setUserSolution(e.target.value)}
                placeholder="Enter your solution here... Who committed the crime and how?"
                className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:border-amber-500 focus:outline-none resize-none"
                rows={6}
              />
              
              <button
                onClick={handleSubmitSolution}
                disabled={userSolution.trim().length < 10}
                className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Submit Solution</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Result */}
              <div className={`rounded-xl p-4 border ${
                isSolved 
                  ? 'bg-green-600/20 border-green-600' 
                  : 'bg-orange-600/20 border-orange-600'
              }`}>
                <div className="text-center mb-4">
                  <div className="text-4xl mb-2">
                    {isSolved ? '🎉' : '🤔'}
                  </div>
                  <h3 className={`font-semibold mb-2 ${
                    isSolved ? 'text-green-400' : 'text-orange-400'
                  }`}>
                    {isSolved ? 'Case Solved!' : 'Not Quite Right'}
                  </h3>
                  <p className={`text-sm ${
                    isSolved ? 'text-green-200' : 'text-orange-200'
                  }`}>
                    {isSolved 
                      ? `Excellent detective work! You've earned ${caseData.reward} SOL.`
                      : 'Your solution was close, but not quite correct. See the actual solution below.'
                    }
                  </p>
                </div>
              </div>

              {/* Actual Solution */}
              <div className="bg-slate-800 rounded-xl p-4">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  📋 The Actual Solution
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {caseData.solution}
                </p>
              </div>

              {/* NFT Minting Notice for User Created Cases */}
              {caseData.is_user_created && isSolved && (
                <div className="bg-purple-600/20 border border-purple-600 rounded-xl p-4">
                  <h3 className="text-purple-400 font-semibold mb-2 flex items-center gap-2">
                    🎨 NFT Minting
                  </h3>
                  <p className="text-purple-200 text-sm">
                    Since you solved your own created case, it will be minted as a unique NFT that you can trade on the marketplace!
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={onTryAnotherCase}
                  className="flex-1 bg-gradient-to-r from-amber-600 to-yellow-600 text-white py-3 px-4 rounded-lg hover:from-amber-700 hover:to-yellow-700 transition-colors"
                >
                  Try Another Case
                </button>
                <button
                  onClick={onBackToPrevious}
                  className="flex-1 bg-slate-700 text-slate-300 py-3 px-4 rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Back to {previousView === 'create' ? 'Create' : previousView === 'marketplace' ? 'Marketplace' : 'Library'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
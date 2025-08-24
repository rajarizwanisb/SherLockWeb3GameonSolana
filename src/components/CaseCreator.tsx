import React, { useState } from 'react';
import { Sparkles, Wand2, RefreshCw, CheckCircle } from 'lucide-react';

interface UserIdentity {
  id: string;
  name: string;
  detective_rank: string;
  cases_solved: number;
  reputation: number;
  avatar_traits: string[];
  mint_address: string;
}

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

interface CaseCreatorProps {
  onCaseGenerated: (caseData: DetectiveCase) => void;
  userIdentity: UserIdentity | null;
}

export function CaseCreator({ onCaseGenerated, userIdentity }: CaseCreatorProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Traditional');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Novice' | 'Intermediate' | 'Expert' | 'Master'>('Intermediate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCase, setGeneratedCase] = useState<DetectiveCase | null>(null);

  const categories = [
    { value: 'Traditional', icon: '🔍', description: 'Classic murder mysteries and theft cases' },
    { value: 'Crypto', icon: '₿', description: 'Blockchain crimes and crypto heists' },
    { value: 'Cyber', icon: '💻', description: 'Hacking, data breaches, and digital crimes' },
    { value: 'Corporate', icon: '🏢', description: 'Corporate espionage and fraud' },
    { value: 'Social', icon: '📱', description: 'Social media crimes and digital stalking' }
  ];

  const examplePrompts = [
    "A famous chef's secret recipe is stolen from a locked vault",
    "Someone is manipulating DeFi protocols to drain millions",
    "A corporate whistleblower mysteriously disappears before a big reveal",
    "Deepfake videos are being used to blackmail a celebrity",
    "A locked room murder at a tech conference"
  ];

  const generateCase = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    // Simulate AI generation delay
    setTimeout(() => {
      const caseId = `user_case_${Date.now()}`;
      const mintAddress = `So1ana1UserCase${Date.now()}`;

      // Generate case based on prompt and settings
      const mockGeneratedCase: DetectiveCase = {
        id: caseId,
        title: generateTitle(prompt),
        difficulty: selectedDifficulty,
        description: generateDescription(prompt),
        story: generateStory(prompt, selectedCategory),
        clues: generateClues(prompt, selectedCategory),
        solution: generateSolution(prompt),
        reward: getDifficultyReward(selectedDifficulty),
        mint_address: mintAddress,
        is_owned: true,
        is_solved: false,
        rarity: generateRarity(),
        category: selectedCategory,
        is_user_created: true
      };

      setGeneratedCase(mockGeneratedCase);
      setIsGenerating(false);
    }, 3000);
  };

  const generateTitle = (prompt: string): string => {
    const keywords = prompt.toLowerCase().split(' ').slice(0, 3);
    const titles = [
      `The Mystery of ${keywords[0] || 'the Unknown'}`,
      `Case of the ${keywords[1] || 'Missing'} ${keywords[2] || 'Evidence'}`,
      `The ${keywords[0] || 'Silent'} Conspiracy`,
      `Mystery at ${keywords[1] || 'Midnight'}`
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  };

  const generateDescription = (prompt: string): string => {
    return `A mysterious case involving ${prompt.toLowerCase()}. Can you uncover the truth behind this intriguing mystery?`;
  };

  const generateStory = (prompt: string, category: string): string[] => {
    const baseStory = [
      `You've been called to investigate a case involving ${prompt.toLowerCase()}.`,
      'Initial evidence suggests this is more complex than it first appears.',
      'Several key witnesses have provided conflicting accounts of the events.',
      'Your detective skills will be crucial in uncovering the truth.'
    ];
    return baseStory;
  };

  const generateClues = (prompt: string, category: string): string[] => {
    const baseClues = [
      'Security footage shows suspicious activity at the time of the incident',
      'Financial records reveal unusual transactions before the event',
      'A key witness has been less than truthful about their whereabouts',
      'Physical evidence at the scene doesn\'t match the initial reports',
      'Digital forensics reveal deleted files and communication logs'
    ];
    return baseClues.slice(0, 4);
  };

  const generateSolution = (prompt: string): string => {
    return `The case was solved by connecting the evidence to reveal the true perpetrator and their motives related to ${prompt.toLowerCase()}.`;
  };

  const getDifficultyReward = (difficulty: string): number => {
    switch (difficulty) {
      case 'Novice': return 0.8;
      case 'Intermediate': return 1.5;
      case 'Expert': return 2.5;
      case 'Master': return 4.0;
      default: return 1.0;
    }
  };

  const generateRarity = (): 'Common' | 'Rare' | 'Epic' | 'Legendary' => {
    const random = Math.random();
    if (random < 0.5) return 'Common';
    if (random < 0.8) return 'Rare';
    if (random < 0.95) return 'Epic';
    return 'Legendary';
  };

  const handleUseCase = () => {
    if (generatedCase) {
      onCaseGenerated(generatedCase);
    }
  };

  const handleRegenerate = () => {
    setGeneratedCase(null);
    generateCase();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-600 rounded-xl p-4">
        <h2 className="text-white font-semibold mb-2 flex items-center gap-2">
          ✨ AI Case Creator
        </h2>
        <p className="text-purple-200 text-sm">
          Describe your mystery idea and let AI generate a unique detective case. Solve it to mint as an exclusive NFT!
        </p>
      </div>

      {!generatedCase ? (
        <>
          {/* Prompt Input */}
          <div className="bg-slate-800 rounded-xl p-4">
            <label className="block text-white font-medium mb-3">
              Describe Your Mystery
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the mystery you want to create... (e.g., 'A locked room murder at a space station' or 'Someone is stealing NFTs using quantum computers')"
              className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:border-purple-500 focus:outline-none resize-none"
              rows={4}
            />
            
            {/* Example Prompts */}
            <div className="mt-3">
              <div className="text-slate-400 text-sm mb-2">Need inspiration? Try these:</div>
              <div className="flex flex-wrap gap-2">
                {examplePrompts.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(example)}
                    className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-md hover:bg-slate-600 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category Selection */}
          <div className="bg-slate-800 rounded-xl p-4">
            <label className="block text-white font-medium mb-3">
              Case Category
            </label>
            <div className="grid grid-cols-1 gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`p-3 rounded-lg border transition-colors text-left ${
                    selectedCategory === category.value
                      ? 'border-purple-600 bg-purple-600/20'
                      : 'border-slate-700 bg-slate-700/50 hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{category.icon}</span>
                    <div>
                      <div className="text-white font-medium">{category.value}</div>
                      <div className="text-slate-400 text-sm">{category.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="bg-slate-800 rounded-xl p-4">
            <label className="block text-white font-medium mb-3">
              Difficulty Level
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['Novice', 'Intermediate', 'Expert', 'Master'] as const).map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`p-3 rounded-lg border transition-colors ${
                    selectedDifficulty === difficulty
                      ? 'border-amber-600 bg-amber-600/20'
                      : 'border-slate-700 bg-slate-700/50 hover:bg-slate-700'
                  }`}
                >
                  <div className="text-white font-medium">{difficulty}</div>
                  <div className="text-slate-400 text-sm">
                    {getDifficultyReward(difficulty)} SOL reward
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateCase}
            disabled={!prompt.trim() || isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating Your Mystery...</span>
              </>
            ) : (
              <>
                <Wand2 className="h-5 w-5" />
                <span>Generate Case</span>
              </>
            )}
          </button>

          {/* Loading Steps */}
          {isGenerating && (
            <div className="bg-slate-800 rounded-xl p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-purple-400">
                  <div className="animate-pulse h-2 w-2 bg-purple-400 rounded-full"></div>
                  <span className="text-sm">Analyzing your prompt...</span>
                </div>
                <div className="flex items-center gap-3 text-purple-400">
                  <div className="animate-pulse h-2 w-2 bg-purple-400 rounded-full"></div>
                  <span className="text-sm">Creating storyline and characters...</span>
                </div>
                <div className="flex items-center gap-3 text-purple-400">
                  <div className="animate-pulse h-2 w-2 bg-purple-400 rounded-full"></div>
                  <span className="text-sm">Generating clues and evidence...</span>
                </div>
                <div className="flex items-center gap-3 text-purple-400">
                  <div className="animate-pulse h-2 w-2 bg-purple-400 rounded-full"></div>
                  <span className="text-sm">Finalizing the mystery...</span>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Generated Case Preview */
        <div className="space-y-4">
          {/* Success Message */}
          <div className="bg-green-600/20 border border-green-600 rounded-xl p-4">
            <div className="flex items-center gap-2 text-green-400 mb-2">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold">Case Generated Successfully!</span>
            </div>
            <p className="text-green-200 text-sm">
              Your unique mystery has been created. Review the details below and start solving to mint it as an NFT!
            </p>
          </div>

          {/* Case Preview */}
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="flex items-start gap-3 mb-4">
              <div className="text-3xl">
                {categories.find(c => c.value === generatedCase.category)?.icon || '🕵️'}
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-lg mb-1">{generatedCase.title}</h3>
                <p className="text-slate-400 text-sm mb-2">{generatedCase.description}</p>
                
                <div className="flex items-center gap-4 text-xs">
                  <span className="text-amber-400">{generatedCase.difficulty}</span>
                  <span className="text-purple-400">{generatedCase.rarity}</span>
                  <span className="text-green-400">{generatedCase.reward} SOL</span>
                  <span className="bg-purple-600 text-white px-2 py-1 rounded-full">
                    User Created
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-white font-medium mb-2">Story Preview</h4>
                <p className="text-slate-300 text-sm">{generatedCase.story[0]}</p>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-2">Number of Clues</h4>
                <p className="text-slate-300 text-sm">{generatedCase.clues.length} investigative clues generated</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleUseCase}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              <span>Start Solving</span>
            </button>
            <button
              onClick={handleRegenerate}
              className="flex-1 bg-slate-700 text-slate-300 py-3 px-4 rounded-lg hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Regenerate</span>
            </button>
          </div>

          {/* NFT Info */}
          <div className="bg-purple-600/20 border border-purple-600 rounded-xl p-4">
            <h3 className="text-purple-400 font-semibold mb-2 flex items-center gap-2">
              🎨 NFT Creation
            </h3>
            <div className="space-y-2 text-sm text-purple-200">
              <p>• Solve this case to mint it as a unique NFT</p>
              <p>• Each user-created case becomes a tradeable asset</p>
              <p>• The NFT will include the full case story and solution</p>
              <p>• You'll retain ownership rights and can sell on the marketplace</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
import React from 'react';
import { User, Trophy, Star, Award } from 'lucide-react';
import logoImage from "./assets/logo.png";


interface UserIdentity {
  id: string;
  name: string;
  detective_rank: string;
  cases_solved: number;
  reputation: number;
  avatar_traits: string[];
  mint_address: string;
}

interface IdentityCardProps {
  identity: UserIdentity;
}

export function IdentityCard({ identity }: IdentityCardProps) {
  const getReputationColor = (rep: number) => {
    if (rep >= 9) return 'text-yellow-400';
    if (rep >= 7) return 'text-green-400';
    if (rep >= 5) return 'text-blue-400';
    return 'text-slate-400';
  };

  const getReputationBadge = (rep: number) => {
    if (rep >= 9) return '🌟 Master Detective';
    if (rep >= 7) return '⭐ Expert Detective';
    if (rep >= 5) return '🔍 Skilled Detective';
    return '🕵️ Novice Detective';
  };

  const getRankIcon = (rank: string) => {
    if (rank.includes('Senior')) return '👨‍💼';
    if (rank.includes('Lead')) return '🎖️';
    if (rank.includes('Chief')) return '👑';
    return '🕵️';
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg border-2 border-amber-400/20">
          <img 
            src={logoImage} 
            alt="Detective Badge" 
            className="h-10 w-10 object-contain"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-white font-semibold text-lg">{identity.name}</h2>
          <p className="text-slate-400 text-sm">{identity.detective_rank}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className={`text-sm font-medium ${getReputationColor(identity.reputation)}`}>
              {identity.reputation.toFixed(1)}
            </span>
            <span className="text-xs text-slate-500">/ 10.0</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-slate-700/50 rounded-lg p-3 text-center border border-slate-600/50">
          <Trophy className="h-5 w-5 text-amber-400 mx-auto mb-1" />
          <div className="text-white font-semibold">{identity.cases_solved}</div>
          <div className="text-slate-400 text-xs">Cases Solved</div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3 text-center border border-slate-600/50">
          <Award className="h-5 w-5 text-purple-400 mx-auto mb-1" />
          <div className="text-white font-semibold">{identity.avatar_traits.length}</div>
          <div className="text-slate-400 text-xs">Detective Traits</div>
        </div>
      </div>

      {/* Reputation Badge */}
      <div className="bg-slate-700/30 rounded-lg p-3 mb-4 border border-slate-600/30">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img 
              src={logoImage} 
              alt="Badge" 
              className="h-4 w-4 object-contain opacity-80"
            />
            <div className="text-sm font-medium text-white">
              {getReputationBadge(identity.reputation)}
            </div>
          </div>
          <div className="bg-slate-600 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-500"
              style={{ width: `${(identity.reputation / 10) * 100}%` }}
            />
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Reputation Level: {identity.reputation.toFixed(1)}/10.0
          </div>
        </div>
      </div>

      {/* Traits */}
      <div className="mb-4">
        <h3 className="text-white font-medium text-sm mb-2 flex items-center gap-2">
          <User className="h-4 w-4" />
          Detective Specialties
        </h3>
        <div className="flex flex-wrap gap-2">
          {identity.avatar_traits.map((trait, index) => (
            <span
              key={index}
              className="bg-slate-700 text-slate-300 px-2 py-1 rounded-md text-xs border border-slate-600/50"
            >
              {trait}
            </span>
          ))}
        </div>
      </div>

      {/* NFT Address */}
      <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
        <h3 className="text-white font-medium text-sm mb-2 flex items-center gap-2">
          <img 
            src={logoImage} 
            alt="NFT Badge" 
            className="h-4 w-4 object-contain opacity-80"
          />
          Detective Identity NFT
        </h3>
        <div className="font-mono text-xs text-slate-400 break-all">
          {identity.mint_address.slice(0, 20)}...{identity.mint_address.slice(-10)}
        </div>
        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
          <span className="h-1 w-1 bg-green-400 rounded-full"></span>
          Non-transferable • Reputation-based traits
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import logoImage from  './assets/logo.png' ;

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Logo({ size = 'md', showText = false, onClick, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const logoSizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-6 w-6',
    lg: 'h-8 w-8', 
    xl: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={`flex items-center gap-2 ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''} ${className}`}
    >
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shadow-lg`}>
        <img 
          src={logoImage} 
          alt="Sh3rlock Mysteries Logo" 
          className={`${logoSizeClasses[size]} object-contain`}
        />
      </div>
      {showText && (
        <span className={`font-semibold text-amber-400 ${textSizeClasses[size]}`}>
          Sh3rlock
        </span>
      )}
    </Component>
  );
}
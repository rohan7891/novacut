import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  showTagline = false,
  className = '',
  onClick,
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  }[size];

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
  }[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-3 select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Stylized N + Play Button Icon with Purple-Electric Blue-Cyan Gradient */}
      <div className={`relative ${iconDimensions} rounded-xl bg-gradient-to-tr from-[#0F172A] to-[#1E293B] p-[2px] shadow-lg shadow-purple-500/20 group`}>
        <div className="w-full h-full rounded-[10px] bg-[#070913] flex items-center justify-center overflow-hidden relative">
          {/* Glowing background halo */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-blue-500/20 to-cyan-400/30 blur-sm opacity-80 group-hover:opacity-100 transition-opacity" />
          
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full p-1.5 relative z-10 drop-shadow-md"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="novaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9333EA" />   {/* Polished purple */}
                <stop offset="50%" stopColor="#3B82F6" />  {/* Electric blue */}
                <stop offset="100%" stopColor="#06B6D4" /> {/* Cyan */}
              </linearGradient>
              <filter id="novaGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#8B5CF6" floodOpacity="0.6"/>
              </filter>
            </defs>

            {/* Stylized 'N' Geometry */}
            <path
              d="M24 22 C24 20, 26 18, 28 18 L38 18 C40 18, 42 20, 42 22 L42 50 L64 22 C65 20, 67 18, 70 18 L76 18 C78 18, 80 20, 80 22 L80 78 C80 80, 78 82, 76 82 L66 82 C64 82, 62 80, 62 78 L62 50 L40 78 C39 80, 37 82, 34 82 L28 82 C26 82, 24 80, 24 78 Z"
              fill="url(#novaGradient)"
              filter="url(#novaGlow)"
            />

            {/* Integrated White Play Button Icon */}
            <polygon
              points="45,39 45,61 63,50"
              fill="#FFFFFF"
              className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            />
          </svg>
        </div>
      </div>

      {/* Brand Name Typography */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight ${titleSizes} text-white`}>
              Nova<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400">Cut</span>
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-cyan-300 border border-purple-500/30">
              Studio
            </span>
          </div>
          {showTagline && (
            <span className="text-[11px] font-medium tracking-wide text-slate-400 mt-1">
              Create Beyond Limits.
            </span>
          )}
        </div>
      )}
    </div>
  );
};

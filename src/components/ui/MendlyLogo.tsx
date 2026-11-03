import React from 'react';
import { motion } from 'motion/react';

export interface MendlyLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  showBadge?: boolean;
  className?: string;
  isClickable?: boolean;
}

export const MendlyLogo: React.FC<MendlyLogoProps> = ({
  size = 'md',
  showWordmark = false,
  showBadge = false,
  className = '',
  isClickable = false
}) => {
  const sizeMap = {
    xs: { icon: 24, font: 'text-sm', badge: 'text-[9px] px-1.5' },
    sm: { icon: 32, font: 'text-base', badge: 'text-[9px] px-2' },
    md: { icon: 40, font: 'text-lg sm:text-xl', badge: 'text-[10px] px-2 py-0.5' },
    lg: { icon: 48, font: 'text-xl sm:text-2xl', badge: 'text-[11px] px-2.5 py-0.5' },
    xl: { icon: 64, font: 'text-3xl sm:text-4xl', badge: 'text-xs px-3 py-1' }
  };

  const dim = sizeMap[size].icon;

  const iconMarkup = (
    <svg
      width={dim}
      height={dim}
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-sm select-none"
    >
      <defs>
        {/* Shield Gradient */}
        <linearGradient id={`mendlyShield-${dim}`} x1="20" y1="12" x2="108" y2="120" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0d7a5f" />
          <stop offset="60%" stopColor="#08523f" />
          <stop offset="100%" stopColor="#04261e" />
        </linearGradient>

        {/* Cross Gradient */}
        <linearGradient id={`mendlyCross-${dim}`} x1="34" y1="28" x2="94" y2="84" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f0fdf4" />
        </linearGradient>

        {/* Pulse Heartbeat Gradient */}
        <linearGradient id={`mendlyPulse-${dim}`} x1="42" y1="56" x2="86" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0d7a5f" />
          <stop offset="50%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#00BE88" />
        </linearGradient>

        {/* Ambient Glow */}
        <filter id={`mendlyGlow-${dim}`} x="-15%" y="-15%" width="130%" height="130%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#0d7a5f" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Main Protective Shield */}
      <path
        d="M 24 24 C 24 17.37 29.37 12 36 12 L 92 12 C 98.63 12 104 17.37 104 24 L 104 66 C 104 94 70 113.5 64 116 C 58 113.5 24 94 24 66 Z"
        fill={`url(#mendlyShield-${dim})`}
        filter={`url(#mendlyGlow-${dim})`}
      />

      {/* Internal Metallic Highlighting Rim */}
      <path
        d="M 28 26 C 28 20.5 32.5 16 38 16 L 90 16 C 95.5 16 100 20.5 100 26 L 100 65 C 100 89 71 106 64 109 C 57 106 28 89 28 65 Z"
        fill="none"
        stroke="#00BE88"
        strokeWidth="1.8"
        strokeOpacity="0.45"
      />

      {/* Medical Cross Signet (Embossed Pure White) */}
      <g filter="drop-shadow(0px 2px 2px rgba(0,0,0,0.18))">
        {/* Vertical Cross Bar */}
        <rect x="52" y="30" width="24" height="52" rx="8" fill={`url(#mendlyCross-${dim})`} />
        {/* Horizontal Cross Bar */}
        <rect x="38" y="44" width="52" height="24" rx="8" fill={`url(#mendlyCross-${dim})`} />
      </g>

      {/* Vitality Heartbeat Pulse Wave (Stylized 'M' Monogram in the Core) */}
      <path
        d="M 42 56 L 50 56 L 56 42 L 64 70 L 72 45 L 78 56 L 86 56"
        fill="none"
        stroke={`url(#mendlyPulse-${dim})`}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Center Golden Vitality Node */}
      <circle cx="64" cy="70" r="2.5" fill="#f59e0b" />

      {/* Clinical Sparkle Node on Top-Right Corner */}
      <circle cx="94" cy="24" r="3.2" fill="#00BE88" />
      <circle cx="94" cy="24" r="1.6" fill="#ffffff" />
    </svg>
  );

  return (
    <div className={`flex items-center space-x-2.5 sm:space-x-3 select-none ${className}`}>
      {isClickable ? (
        <motion.div
          whileHover={{ rotate: [0, -5, 5, 0], scale: 1.05 }}
          transition={{ duration: 0.3 }}
          className="shrink-0 flex items-center justify-center cursor-pointer"
        >
          {iconMarkup}
        </motion.div>
      ) : (
        <div className="shrink-0 flex items-center justify-center">
          {iconMarkup}
        </div>
      )}

      {showWordmark && (
        <div className="flex flex-col">
          <div className="flex items-center space-x-2">
            <span className={`font-black tracking-tight text-[#081a14] dark:text-[#f5fbf8] ${sizeMap[size].font}`}>
              Mendly
            </span>
            {showBadge && (
              <span className={`inline-flex items-center font-bold tracking-wider rounded-full bg-[#ecf7f3] dark:bg-[#122e25] text-[#0d7a5f] dark:text-[#00BE88] border border-[#b8e2d4] dark:border-[#1d4d3e] uppercase ${sizeMap[size].badge}`}>
                CLINICAL SAFETY
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

/* ==========================================================================
   APPLE HIG & SF-SYMBOLS VECTOR ICON SUITE (100% VECTOR, ZERO RAW EMOJIS)
   ========================================================================== */

export const FlagPortugal: React.FC<IconProps> = ({ size = 18, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block rounded-[4px] shadow-sm shrink-0 overflow-hidden ${className}`}
    {...props}
  >
    <rect width="32" height="24" rx="3" fill="#FF3B30" />
    <rect width="13" height="24" fill="#28A745" />
    <circle cx="13" cy="12" r="5" fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" />
    <path
      d="M11 9.5H15V13C15 14.5 13 16 13 16C13 16 11 14.5 11 13V9.5Z"
      fill="#FFFFFF"
      stroke="#B22222"
      strokeWidth="0.6"
    />
    <circle cx="13" cy="11" r="0.7" fill="#0055A5" />
    <circle cx="13" cy="13" r="0.7" fill="#0055A5" />
    <circle cx="12" cy="12" r="0.7" fill="#0055A5" />
    <circle cx="14" cy="12" r="0.7" fill="#0055A5" />
  </svg>
);

export const FlagNepal: React.FC<IconProps> = ({ size = 18, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 drop-shadow-sm ${className}`}
    {...props}
  >
    <polygon points="2,2 22,14 11,14 20,26 2,26" fill="#003893" />
    <polygon points="4,4 18,13 8,13 16,24 4,24" fill="#DC143C" />
    <circle cx="7.5" cy="8.5" r="2" fill="#FFFFFF" />
    <circle cx="7.5" cy="7.7" r="1.6" fill="#DC143C" />
    <circle cx="7.5" cy="8.9" r="0.8" fill="#FFFFFF" />
    <circle cx="7.5" cy="18.5" r="2.2" fill="#FFFFFF" />
  </svg>
);

export const GoldCoin: React.FC<IconProps> = ({ size = 18, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE066" />
        <stop offset="50%" stopColor="#F59E0B" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" fill="url(#goldGradient)" stroke="#B45309" strokeWidth="1.2" />
    <circle cx="12" cy="12" r="7.5" fill="none" stroke="#FDE68A" strokeWidth="1" strokeDasharray="1.5 1.5" />
    <path
      d="M12 7.5V16.5M9.5 9.5C9.5 8.4 10.6 7.5 12 7.5C13.4 7.5 14.5 8.4 14.5 9.5C14.5 11 12 11.5 12 12.5C12 13.5 13.1 14.5 14.5 14.5M9.5 14.5C10.5 14.5 11.5 14 12 13"
      stroke="#78350F"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

export const AppleGemIcon: React.FC<IconProps> = ({ size = 18, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    <defs>
      <linearGradient id="gemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#67e8f9" />
        <stop offset="45%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
      <linearGradient id="gemFacet" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#a5f3fc" stopOpacity="0.2" />
      </linearGradient>
    </defs>
    <path
      d="M6 3H18L22 9L12 21L2 9L6 3Z"
      fill="url(#gemGrad)"
      stroke="#0284c7"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <polygon points="6,3 18,3 15,9 9,9" fill="url(#gemFacet)" />
    <polygon points="9,9 15,9 12,21" fill="#38bdf8" fillOpacity="0.5" />
    <polyline points="2,9 9,9 6,3" stroke="#e0f2fe" strokeWidth="0.8" />
    <polyline points="22,9 15,9 18,3" stroke="#e0f2fe" strokeWidth="0.8" />
    <line x1="2" y1="9" x2="12" y2="21" stroke="#0369a1" strokeWidth="0.8" />
    <line x1="22" y1="9" x2="12" y2="21" stroke="#0369a1" strokeWidth="0.8" />
  </svg>
);

export const PukuMonkeyIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    <defs>
      <linearGradient id="pukuFur" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#92400e" />
        <stop offset="100%" stopColor="#78350f" />
      </linearGradient>
      <linearGradient id="pukuFace" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fde68a" />
        <stop offset="100%" stopColor="#f59e0b" />
      </linearGradient>
    </defs>
    {/* Ears */}
    <circle cx="6" cy="14" r="5" fill="url(#pukuFur)" />
    <circle cx="6" cy="14" r="3" fill="#fde68a" />
    <circle cx="26" cy="14" r="5" fill="url(#pukuFur)" />
    <circle cx="26" cy="14" r="3" fill="#fde68a" />
    {/* Head */}
    <circle cx="16" cy="16" r="11" fill="url(#pukuFur)" />
    {/* Face mask */}
    <ellipse cx="12.5" cy="13.5" rx="4.5" ry="4" fill="url(#pukuFace)" />
    <ellipse cx="19.5" cy="13.5" rx="4.5" ry="4" fill="url(#pukuFace)" />
    <ellipse cx="16" cy="18" rx="6.5" ry="5.5" fill="url(#pukuFace)" />
    {/* Eyes */}
    <ellipse cx="13" cy="13.5" rx="1.5" ry="2" fill="#1e293b" />
    <ellipse cx="19" cy="13.5" rx="1.5" ry="2" fill="#1e293b" />
    <circle cx="13.5" cy="12.8" r="0.6" fill="#ffffff" />
    <circle cx="19.5" cy="12.8" r="0.6" fill="#ffffff" />
    {/* Nose & Smile */}
    <circle cx="16" cy="17" r="1" fill="#78350f" />
    <path d="M13.5 19.5C14.5 21 17.5 21 18.5 19.5" stroke="#78350f" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

export const BananaIcon: React.FC<IconProps> = ({ size = 18, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    <path
      d="M4 18C8 22 17 21 21 14C21.5 13 20 12 19 13C16 17 9 17 6 14C4.8 12.8 4.2 10.5 4 8C3.8 6.5 2.5 7 2.2 8C1.5 11.5 2 16 4 18Z"
      fill="#facc15"
      stroke="#ca8a04"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M4 8C4.5 6.5 5 4.5 6 3" stroke="#65a30d" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const CoffeeCupIcon: React.FC<IconProps> = ({ size = 18, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    <path d="M18 8H4C3.45 8 3 8.45 3 9V14C3 17.31 5.69 20 9 20H13C16.31 20 19 17.31 19 14V9C19 8.45 18.55 8 18 8Z" fill="#78350f" stroke="#451a03" strokeWidth="1.2" />
    <path d="M19 10H20C21.1 10 22 10.9 22 12C22 13.1 21.1 14 20 14H19" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M7 4C7 5 8 5.5 8 6.5M11 4C11 5 12 5.5 12 6.5M15 4C15 5 16 5.5 16 6.5" stroke="#f59e0b" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M2 21H20" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const CrownPrincessIcon: React.FC<IconProps> = ({ size = 18, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    <path d="M3 18H21L20 8L15 13L12 5L9 13L4 8L3 18Z" fill="#facc15" stroke="#ca8a04" strokeWidth="1.2" strokeLinejoin="round" />
    <circle cx="4" cy="7" r="1.5" fill="#f43f5e" />
    <circle cx="12" cy="4" r="1.5" fill="#0ea5e9" />
    <circle cx="20" cy="7" r="1.5" fill="#f43f5e" />
    <circle cx="12" cy="15" r="1.2" fill="#ec4899" />
    <path d="M3 18H21V20H3V18Z" fill="#eab308" stroke="#a16207" strokeWidth="1" />
  </svg>
);

export const CherryFlowerIcon: React.FC<IconProps> = ({ size = 18, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    <circle cx="12" cy="7" r="3.5" fill="#fbcfe8" stroke="#f472b6" strokeWidth="0.8" />
    <circle cx="17" cy="11" r="3.5" fill="#fbcfe8" stroke="#f472b6" strokeWidth="0.8" />
    <circle cx="15" cy="17" r="3.5" fill="#fbcfe8" stroke="#f472b6" strokeWidth="0.8" />
    <circle cx="9" cy="17" r="3.5" fill="#fbcfe8" stroke="#f472b6" strokeWidth="0.8" />
    <circle cx="7" cy="11" r="3.5" fill="#fbcfe8" stroke="#f472b6" strokeWidth="0.8" />
    <circle cx="12" cy="12" r="3" fill="#fb7185" />
    <circle cx="12" cy="12" r="1.5" fill="#fef08a" />
  </svg>
);

export const LisbonTramIcon: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    {/* Pantograph */}
    <path d="M10 2L14 5L18 2" stroke="#64748b" strokeWidth="1.2" strokeLinecap="round" />
    <line x1="14" y1="5" x2="14" y2="7" stroke="#64748b" strokeWidth="1.2" />
    {/* Body */}
    <rect x="3" y="7" width="22" height="13" rx="2.5" fill="#eab308" stroke="#ca8a04" strokeWidth="1" />
    {/* Roof */}
    <rect x="4" y="6" width="20" height="2" rx="1" fill="#f8fafc" />
    {/* Windows */}
    <rect x="5" y="9" width="4" height="4.5" rx="0.8" fill="#38bdf8" />
    <rect x="10.5" y="9" width="7" height="4.5" rx="0.8" fill="#38bdf8" />
    <rect x="19" y="9" width="4" height="4.5" rx="0.8" fill="#38bdf8" />
    {/* Wheels */}
    <circle cx="8" cy="20.5" r="2" fill="#334155" />
    <circle cx="20" cy="20.5" r="2" fill="#334155" />
    {/* Number 28 badge */}
    <circle cx="14" cy="16" r="1.8" fill="#dc2626" />
    <text x="14" y="17.2" fill="#ffffff" fontSize="2.2" fontWeight="bold" textAnchor="middle">28</text>
  </svg>
);

export const LoveHeartIcon: React.FC<IconProps> = ({ size = 18, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    <defs>
      <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff4b4b" />
        <stop offset="50%" stopColor="#e11d48" />
        <stop offset="100%" stopColor="#be123c" />
      </linearGradient>
    </defs>
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill="url(#heartGrad)"
      stroke="#9f1239"
      strokeWidth="0.8"
    />
  </svg>
);

export const SparkleStarIcon: React.FC<IconProps> = ({ size = 18, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    <path
      d="M12 2L14.4 8.6L21 11L14.4 13.4L12 20L9.6 13.4L3 11L9.6 8.6L12 2Z"
      fill="#facc15"
      stroke="#ca8a04"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    <circle cx="19" cy="5" r="1.5" fill="#fde047" />
    <circle cx="5" cy="19" r="1" fill="#fde047" />
  </svg>
);

export const FireStreakIcon: React.FC<IconProps> = ({ size = 18, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    <defs>
      <linearGradient id="flameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F97316" />
        <stop offset="50%" stopColor="#EF4444" />
        <stop offset="100%" stopColor="#DC2626" />
      </linearGradient>
      <linearGradient id="flameInner" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FEF08A" />
        <stop offset="100%" stopColor="#FBBF24" />
      </linearGradient>
    </defs>
    <path
      d="M12 2C9.5 5.5 8.5 7.8 8.5 10C8.5 10.8 8.7 11.5 9 12.1C8 11.2 7.5 10 7.5 8.5C5.5 10.8 4.5 13.5 4.5 16C4.5 20.1 7.9 23.5 12 23.5C16.1 23.5 19.5 20.1 19.5 16C19.5 12 17 7 12 2Z"
      fill="url(#flameGrad)"
    />
    <path
      d="M12 11C10.5 13 10 14.5 10 16C10 17.1 10.9 18 12 18C13.1 18 14 17.1 14 16C14 14.5 13.5 13 12 11Z"
      fill="url(#flameInner)"
    />
  </svg>
);

export const PremiumTrophy: React.FC<IconProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    <defs>
      <linearGradient id="trophyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="50%" stopColor="#EAB308" />
        <stop offset="100%" stopColor="#CA8A04" />
      </linearGradient>
    </defs>
    <path
      d="M6 3H18V9C18 12.31 15.31 15 12 15C8.69 15 6 12.31 6 9V3Z"
      fill="url(#trophyGrad)"
      stroke="#854D0E"
      strokeWidth="1.2"
    />
    <path
      d="M6 5H3C2.45 5 2 5.45 2 6C2 8.5 4 10.5 6 10.5M18 5H21C21.55 5 22 5.45 22 6C22 8.5 20 10.5 18 10.5"
      stroke="#EAB308"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path d="M12 15V19M8 21H16" stroke="#854D0E" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const EuroCurrencyIcon: React.FC<IconProps> = ({ size = 18, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    <defs>
      <linearGradient id="euroGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#60A5FA" />
        <stop offset="100%" stopColor="#2563EB" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" fill="url(#euroGrad)" stroke="#1D4ED8" strokeWidth="1.2" />
    <path
      d="M15 8.5C14.2 7.6 13.2 7 11.8 7C9.1 7 7 9.2 7 12C7 14.8 9.1 17 11.8 17C13.2 17 14.2 16.4 15 15.5M6 10.5H13M6 13.5H13"
      stroke="#FFFFFF"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

export const XpBadgeIcon: React.FC<IconProps> = ({ size = 18, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block shrink-0 ${className}`}
    {...props}
  >
    <defs>
      <linearGradient id="xpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
    </defs>
    <path
      d="M13 2L3 14H12L11 22L21 10H12L13 2Z"
      fill="url(#xpGrad)"
      stroke="#0369a1"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
);

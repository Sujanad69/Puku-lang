import React from 'react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

export const FlagPortugal: React.FC<IconProps> = ({ size = 18, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`inline-block rounded-[3px] shadow-sm shrink-0 overflow-hidden ${className}`}
    {...props}
  >
    <rect width="32" height="24" rx="2" fill="#FF3B30" />
    <rect width="13" height="24" fill="#28A745" />
    {/* Armillary sphere yellow disc */}
    <circle cx="13" cy="12" r="5" fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" />
    {/* Portuguese Shield (White inside) */}
    <path
      d="M11 9.5H15V13C15 14.5 13 16 13 16C13 16 11 14.5 11 13V9.5Z"
      fill="#FFFFFF"
      stroke="#B22222"
      strokeWidth="0.6"
    />
    {/* Quinas / Blue Shields */}
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
    {/* Double pennon outline in blue */}
    <polygon
      points="2,2 22,14 11,14 20,26 2,26"
      fill="#003893"
    />
    {/* Inner red triangles */}
    <polygon
      points="4,4 18,13 8,13 16,24 4,24"
      fill="#DC143C"
    />
    {/* Moon symbol in upper pennon */}
    <circle cx="7.5" cy="8.5" r="2" fill="#FFFFFF" />
    <circle cx="7.5" cy="7.7" r="1.6" fill="#DC143C" />
    <circle cx="7.5" cy="8.9" r="0.8" fill="#FFFFFF" />
    {/* Sun symbol in lower pennon */}
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
      <linearGradient id="goldInner" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFBEB" />
        <stop offset="100%" stopColor="#FDE68A" />
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
      <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#CA8A04" />
      </linearGradient>
    </defs>
    <path
      d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
      fill="url(#starGrad)"
      stroke="#A16207"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
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

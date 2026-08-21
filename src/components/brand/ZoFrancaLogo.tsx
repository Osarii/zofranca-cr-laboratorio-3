import React from 'react';

interface ZoFrancaLogoProps {
  className?: string;
}

export function ZoFrancaLogo({ className = 'h-9 w-9' }: ZoFrancaLogoProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" role="img" aria-label="Isotipo de ZoFranca CR">
      <rect x="2" y="2" width="44" height="44" rx="8" fill="#FFD700" />
      <path d="M13 12h23v7L23.3 29H36v7H12v-6.4L24.6 19H13v-7Z" fill="#131313" />
      <path d="M30 25.2 36 20v9l-6 5v-8.8Z" fill="#FFF6DF" opacity=".92" />
      <path d="M8 40h32" stroke="#131313" strokeOpacity=".38" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

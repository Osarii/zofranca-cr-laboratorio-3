import React from 'react';

interface ZoFrancaLogoProps {
  className?: string;
}

export function ZoFrancaLogo({ className = 'h-9 w-9' }: ZoFrancaLogoProps) {
  const gradienteId = React.useId();

  return (
    <svg className={className} viewBox="0 0 48 48" role="img" aria-label="Isotipo de ZoFranca CR">
      <defs>
        <linearGradient id={gradienteId} x1="6" y1="5" x2="42" y2="43" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8" />
          <stop offset="0.52" stopColor="#0EA5E9" />
          <stop offset="1" stopColor="#14B8A6" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="13" fill={`url(#${gradienteId})`} />
      <path d="M13 13h23v6.2L23.2 29H36v7H12v-6.1L24.9 20H13V13Z" fill="white" />
      <path d="M29.5 25.5 36 20v8.8L29.5 34v-8.5Z" fill="#A7F3D0" opacity="0.95" />
      <circle cx="37" cy="11" r="3" fill="#6EE7B7" />
      <path d="M8 39h32" stroke="white" strokeOpacity="0.38" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

import React from 'react';
import type { OrganInteractionProps } from '../types';

export const Kidneys: React.FC<OrganInteractionProps> = ({
  selected,
  hovered,
  status,
  onSelect,
  onHover,
}) => {
  const active = selected || hovered;
  const stroke =
    status === 'critical'
      ? '#FB7185'
      : status === 'warning' || status === 'elevated'
      ? '#FBBF24'
      : '#A78BFA';

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label="Inspect Kidneys and Renal-Metabolic Status"
      onClick={(e) => {
        e.stopPropagation();
        onSelect('kidneys');
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect('kidneys');
        }
      }}
      onMouseEnter={() => onHover('kidneys')}
      onMouseLeave={() => onHover(null)}
      className="cursor-pointer focus:outline-none"
      filter={active ? 'url(#holoStrongGlow)' : 'url(#holoCyanGlow)'}
    >
      {/* Left Side Kidney (Right Kidney) */}
      <path
        d="M 167 224 C 159 224, 157 234, 160 243 C 162 248, 169 249, 171 243 C 172 239, 168 237, 169 233 C 170 228, 172 225, 167 224 Z"
        fill="url(#holoKidneyGrad)"
        fillOpacity={active ? 0.94 : 0.72}
        stroke={stroke}
        strokeWidth={active ? 1.5 : 1}
      />

      {/* Right Side Kidney (Left Kidney) */}
      <path
        d="M 213 221 C 221 221, 223 231, 220 240 C 218 245, 211 246, 209 240 C 208 236, 212 234, 211 230 C 210 225, 208 222, 213 221 Z"
        fill="url(#holoKidneyGrad)"
        fillOpacity={active ? 0.94 : 0.72}
        stroke={stroke}
        strokeWidth={active ? 1.5 : 1}
      />

      {/* Ureters & Renal Vascular Hilum Connections */}
      <g stroke="#818CF8" strokeOpacity="0.62" strokeWidth="1" fill="none" strokeDasharray="2 2">
        <path d="M 170 236 Q 178 260 183 295" />
        <path d="M 210 233 Q 202 258 197 295" />
      </g>

      {/* Connector Anchor Point */}
      <circle data-organ-anchor="kidneys" cx="220" cy="232" r="2.4" fill="#C4B5FD" />
    </g>
  );
};

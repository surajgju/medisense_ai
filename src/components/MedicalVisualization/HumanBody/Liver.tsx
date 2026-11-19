import React from 'react';
import type { OrganInteractionProps } from '../types';

export const Liver: React.FC<OrganInteractionProps> = ({
  selected,
  hovered,
  status,
  onSelect,
  onHover,
}) => {
  const active = selected || hovered;
  const border =
    status === 'critical'
      ? '#FB7185'
      : status === 'warning' || status === 'elevated'
      ? '#FBBF24'
      : '#F59E0B';

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label="Inspect Liver and Metabolic Intelligence"
      onClick={(e) => {
        e.stopPropagation();
        onSelect('liver');
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect('liver');
        }
      }}
      onMouseEnter={() => onHover('liver')}
      onMouseLeave={() => onHover(null)}
      className="cursor-pointer focus:outline-none"
      filter={active ? 'url(#holoStrongGlow)' : 'url(#holoCyanGlow)'}
    >
      {/* Anatomical Right & Left Hepatic Lobes (Right Upper Quadrant -> Viewer's Left) */}
      <path
        d="
          M 151 206
          C 151 196, 168 194, 185 198
          C 194 200, 200 202, 201 207
          C 201 212, 191 216, 180 221
          C 170 226, 162 234, 155 234
          C 149 234, 148 220, 151 206 Z
        "
        fill="url(#holoLiverGrad)"
        fillOpacity={active ? 0.92 : 0.7}
        stroke={border}
        strokeWidth={active ? 1.55 : 1.05}
      />

      {/* Falciform Ligament & Portal Venous Branching */}
      <path
        d="M 178 198 L 176 218 M 169 213 L 158 218 M 176 212 L 188 208"
        fill="none"
        stroke="#FDE68A"
        strokeOpacity="0.58"
        strokeWidth="0.9"
        strokeLinecap="round"
      />

      {/* Gallbladder Subtle Translucent Hint */}
      <ellipse
        cx="166"
        cy="228"
        rx="4.2"
        ry="2.6"
        transform="rotate(-24 166 228)"
        fill="#2DD4BF"
        fillOpacity="0.48"
        stroke="#5EEAD4"
        strokeWidth="0.8"
      />

      {/* Connector Anchor Point */}
      <circle data-organ-anchor="liver" cx="192" cy="212" r="2.4" fill="#FBBF24" />
    </g>
  );
};

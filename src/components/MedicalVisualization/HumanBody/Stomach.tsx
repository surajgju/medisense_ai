import React from 'react';
import type { OrganInteractionProps } from '../types';

export const Stomach: React.FC<OrganInteractionProps> = ({
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
      : '#C084FC';

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label="Inspect Stomach and Digestive Intelligence"
      onClick={(e) => {
        e.stopPropagation();
        onSelect('stomach');
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect('stomach');
        }
      }}
      onMouseEnter={() => onHover('stomach')}
      onMouseLeave={() => onHover(null)}
      className="cursor-pointer focus:outline-none"
      filter={active ? 'url(#holoStrongGlow)' : 'url(#holoCyanGlow)'}
    >
      {/* Esophageal conduit descending behind trachea to cardia */}
      <path
        d="M 190 138 L 191 200"
        fill="none"
        stroke="#A78BFA"
        strokeWidth="3.2"
        strokeOpacity="0.38"
        strokeLinecap="round"
      />

      {/* J-Shaped Gastric Fundus, Body & Pyloric Antrum (Viewer's Right) */}
      <path
        d="
          M 192 200
          C 199 194, 214 196, 221 208
          C 226 218, 224 231, 214 236
          C 205 241, 192 238, 185 231
          C 182 228, 184 222, 190 222
          C 198 223, 205 221, 207 215
          C 209 209, 202 205, 195 206
          Z
        "
        fill="url(#holoStomachGrad)"
        fillOpacity={active ? 0.92 : 0.72}
        stroke={stroke}
        strokeWidth={active ? 1.55 : 1.05}
      />

      {/* Gastric Rugae Subtle Internal Folds */}
      <path
        d="M 203 207 Q 214 212 213 224 M 198 228 Q 208 231 215 227"
        fill="none"
        stroke="#E9D5FF"
        strokeOpacity="0.52"
        strokeWidth="0.85"
        strokeLinecap="round"
      />

      {/* Connector Anchor Point */}
      <circle data-organ-anchor="stomach" cx="212" cy="222" r="2.4" fill="#C084FC" />
    </g>
  );
};

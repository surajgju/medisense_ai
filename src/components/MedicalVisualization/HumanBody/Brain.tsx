import React from 'react';
import type { OrganInteractionProps } from '../types';

export const Brain: React.FC<OrganInteractionProps> = ({
  selected,
  hovered,
  status,
  onSelect,
  onHover,
}) => {
  const active = selected || hovered;
  const ringColor =
    status === 'critical'
      ? '#FB7185'
      : status === 'warning' || status === 'elevated'
      ? '#FBBF24'
      : '#38BDF8';

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label="Inspect Brain and Neurological Intelligence"
      onClick={(e) => {
        e.stopPropagation();
        onSelect('brain');
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect('brain');
        }
      }}
      onMouseEnter={() => onHover('brain')}
      onMouseLeave={() => onHover(null)}
      className="cursor-pointer focus:outline-none"
      filter={active ? 'url(#holoStrongGlow)' : 'url(#holoCyanGlow)'}
    >
      {/* Selected halo */}
      {active && (
        <ellipse
          cx="190"
          cy="41"
          rx="23"
          ry="17"
          fill={ringColor}
          fillOpacity="0.22"
          stroke={ringColor}
          strokeWidth="1.1"
        />
      )}

      {/* Left Cerebral Hemisphere */}
      <path
        d="M 189 24 C 179 24, 171 31, 170 40 C 169 48, 173 54, 180 55 C 184 56, 188 54, 189 51 Z"
        fill="url(#holoBrainGrad)"
        fillOpacity={active ? 0.96 : 0.82}
        stroke="var(--holo-contour)"
        strokeWidth={active ? 1.4 : 0.95}
      />
      {/* Right Cerebral Hemisphere */}
      <path
        d="M 191 24 C 201 24, 209 31, 210 40 C 211 48, 207 54, 200 55 C 196 56, 192 54, 191 51 Z"
        fill="url(#holoBrainGrad)"
        fillOpacity={active ? 0.96 : 0.82}
        stroke="var(--holo-contour)"
        strokeWidth={active ? 1.4 : 0.95}
      />

      {/* Cerebellum & Brainstem */}
      <ellipse
        cx="190"
        cy="57"
        rx="10"
        ry="4.2"
        fill="#1D4ED8"
        fillOpacity="0.72"
        stroke="#93C5FD"
        strokeWidth="0.8"
      />
      <rect x="188" y="60" width="4" height="9" rx="1.5" fill="#60A5FA" fillOpacity="0.75" />

      {/* Sulci & Gyri Neural Fold Curves */}
      <g stroke="#EFF6FF" strokeWidth="0.75" strokeOpacity="0.78" fill="none">
        <path d="M 176 34 Q 182 30 187 35 M 173 41 Q 180 38 186 43 M 176 48 Q 182 46 187 49" />
        <path d="M 204 34 Q 198 30 193 35 M 207 41 Q 200 38 194 43 M 204 48 Q 198 46 193 49" />
      </g>

      {/* Neural Synaptic Nodes */}
      <circle cx="179" cy="37" r="1.1" fill="#F0F9FF" />
      <circle cx="201" cy="39" r="1.1" fill="#F0F9FF" />
      <circle cx="183" cy="46" r="1" fill="#C084FC" />

      {/* Connector Anchor Point */}
      <circle data-organ-anchor="brain" cx="173" cy="39" r="2.4" fill="var(--holo-conn-normal)" />
    </g>
  );
};

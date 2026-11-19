import React from 'react';
import type { OrganInteractionProps } from '../types';

export const Heart: React.FC<OrganInteractionProps> = ({
  selected,
  hovered,
  status,
  onSelect,
  onHover,
}) => {
  const active = selected || hovered;
  const edgeColor =
    status === 'critical'
      ? '#FECDD3'
      : status === 'warning' || status === 'elevated'
      ? '#FDE68A'
      : '#FDA4AF';

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label="Inspect Heart and Cardiac Intelligence"
      onClick={(e) => {
        e.stopPropagation();
        onSelect('heart');
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect('heart');
        }
      }}
      onMouseEnter={() => onHover('heart')}
      onMouseLeave={() => onHover(null)}
      className="cursor-pointer holo-heart-pulse focus:outline-none"
      filter={active ? 'url(#holoStrongGlow)' : 'url(#holoCyanGlow)'}
    >
      {/* Active aura */}
      {active && (
        <circle cx="196" cy="166" r="24" fill="#F43F5E" fillOpacity="0.24" />
      )}

      {/* Superior Vena Cava & Jugular/Subclavian Venous Branches */}
      <path
        d="M 183 128 L 184 150 M 176 124 L 184 135 M 184 135 L 184 121"
        fill="none"
        stroke="#60A5FA"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeOpacity="0.82"
      />

      {/* Ascending Aorta & Aortic Arch + Carotid Vessels */}
      <path
        d="M 193 151 C 193 136, 200 131, 205 137 C 207 140, 207 148, 204 156"
        fill="none"
        stroke="#FB7185"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeOpacity="0.9"
      />
      <path
        d="M 196 134 L 194 120 M 201 134 L 201 122"
        fill="none"
        stroke="#FDA4AF"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeOpacity="0.8"
      />

      {/* Descending Thoracic Aorta */}
      <line
        x1="191"
        y1="184"
        x2="191"
        y2="245"
        stroke="#FB7185"
        strokeWidth="2"
        strokeOpacity="0.45"
        strokeDasharray="3 2"
      />

      {/* Anatomically Tilted Cardiac Ventricular Body (Apex pointing left-inferior) */}
      <path
        d="
          M 190 149
          C 182 147, 177 154, 179 164
          C 182 175, 194 185, 206 187
          C 213 188, 216 181, 214 171
          C 212 160, 204 151, 196 149
          C 194 148, 192 149, 190 149 Z
        "
        fill="url(#holoHeartGrad)"
        fillOpacity={active ? 0.98 : 0.88}
        stroke={edgeColor}
        strokeWidth={active ? 1.6 : 1.15}
      />

      {/* Right Atrium & Pulmonary Trunk Overlay */}
      <path
        d="M 189 152 C 196 150, 202 155, 204 162"
        fill="none"
        stroke="#C084FC"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeOpacity="0.72"
      />

      {/* Coronary Artery Vascular Branches */}
      <g stroke="#FFE4E6" strokeOpacity="0.78" strokeWidth="0.85" fill="none" strokeLinecap="round">
        <path d="M 193 156 Q 198 166 205 181" />
        <path d="M 196 164 L 188 171 M 200 172 L 194 179" />
      </g>

      {/* Connector Anchor Point */}
      <circle data-organ-anchor="heart" cx="182" cy="166" r="2.6" fill="#FDA4AF" />
    </g>
  );
};

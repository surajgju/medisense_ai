import React from 'react';
import type { OrganInteractionProps } from '../types';

export const Lungs: React.FC<OrganInteractionProps> = ({
  selected,
  hovered,
  status,
  onSelect,
  onHover,
}) => {
  const active = selected || hovered;
  const strokeColor =
    status === 'critical'
      ? '#E11D48'
      : status === 'warning' || status === 'elevated'
      ? '#D97706'
      : '#0284C7';

  return (
    <g
      role="button"
      tabIndex={0}
      aria-label="Inspect Lungs and Respiratory Intelligence"
      onClick={(e) => {
        e.stopPropagation();
        onSelect('lungs');
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect('lungs');
        }
      }}
      onMouseEnter={() => onHover('lungs')}
      onMouseLeave={() => onHover(null)}
      className="cursor-pointer holo-breath-pulse focus:outline-none"
      filter={active ? 'url(#holoStrongGlow)' : 'url(#holoCyanGlow)'}
    >
      {/* Trachea & Cartilage Rings + Mainstem Bronchi */}
      <g stroke="var(--holo-contour)" strokeWidth="1" fill="#0EA5E9" fillOpacity="0.2">
        <rect x="187" y="96" width="6" height="36" rx="2.5" />
        <line x1="187" y1="103" x2="193" y2="103" strokeOpacity="0.7" />
        <line x1="187" y1="109" x2="193" y2="109" strokeOpacity="0.7" />
        <line x1="187" y1="115" x2="193" y2="115" strokeOpacity="0.7" />
        <line x1="187" y1="121" x2="193" y2="121" strokeOpacity="0.7" />
        {/* Left and Right Main Bronchi */}
        <path d="M 189 130 L 174 143 M 191 130 L 208 143" fill="none" strokeWidth="2.4" strokeLinecap="round" />
      </g>

      {/* Right Lung (Viewer's Left) */}
      <path
        d="
          M 182 123
          C 167 123, 152 135, 148 156
          C 145 174, 147 194, 156 198
          C 165 201, 178 197, 183 189
          C 185 174, 185 142, 182 123 Z
        "
        fill="url(#holoLungGrad)"
        fillOpacity={active ? 0.92 : 0.72}
        stroke={strokeColor}
        strokeWidth={active ? 1.7 : 1.15}
      />

      {/* Left Lung (Viewer's Right, with medial cardiac notch) */}
      <path
        d="
          M 198 123
          C 213 123, 228 135, 232 156
          C 235 174, 233 194, 224 198
          C 216 201, 204 196, 199 188
          C 208 182, 211 168, 203 156
          C 198 146, 196 135, 198 123 Z
        "
        fill="url(#holoLungGrad)"
        fillOpacity={active ? 0.92 : 0.72}
        stroke={strokeColor}
        strokeWidth={active ? 1.7 : 1.15}
      />

      {/* Lobar Fissures */}
      <path d="M 150 162 Q 166 168 182 162" fill="none" stroke="var(--holo-lung-neural)" strokeOpacity="0.4" strokeWidth="0.8" />
      <path d="M 206 162 Q 218 168 230 160" fill="none" stroke="var(--holo-lung-neural)" strokeOpacity="0.4" strokeWidth="0.8" />

      {/* Detailed Bronchial Branching Tree */}
      <g stroke="var(--holo-lung-neural)" strokeOpacity={active ? 0.85 : 0.58} strokeLinecap="round" fill="none">
        {/* Right Bronchial Tree */}
        <path d="M 175 142 L 164 150 L 155 146 M 164 150 L 157 160" strokeWidth="1.2" />
        <path d="M 174 143 L 166 165 L 156 175 M 166 165 L 171 182 L 164 190 M 171 182 L 178 189" strokeWidth="1" />
        <path d="M 164 150 L 168 136" strokeWidth="0.9" />
        {/* Left Bronchial Tree */}
        <path d="M 207 143 L 218 150 L 226 146 M 218 150 L 225 161" strokeWidth="1.2" />
        <path d="M 208 143 L 216 165 L 225 176 M 216 165 L 213 182 L 221 190" strokeWidth="1" />
        <path d="M 218 150 L 214 136" strokeWidth="0.9" />
      </g>

      {/* Connector Anchor Point */}
      <circle data-organ-anchor="lungs" cx="155" cy="156" r="2.5" fill="var(--holo-conn-normal)" />
    </g>
  );
};

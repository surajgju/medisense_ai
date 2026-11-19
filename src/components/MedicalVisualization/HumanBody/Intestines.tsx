import React from 'react';
import type { OrganInteractionProps } from '../types';

export const Intestines: React.FC<OrganInteractionProps> = ({
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
      aria-label="Inspect Intestines and GI Metabolic Status"
      onClick={(e) => {
        e.stopPropagation();
        onSelect('intestines');
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect('intestines');
        }
      }}
      onMouseEnter={() => onHover('intestines')}
      onMouseLeave={() => onHover(null)}
      className="cursor-pointer focus:outline-none"
      filter={active ? 'url(#holoStrongGlow)' : 'url(#holoCyanGlow)'}
    >
      {/* Large Intestine Frame: Ascending -> Transverse -> Descending -> Sigmoid Colon */}
      <path
        d="
          M 158 292
          C 155 280, 155 262, 157 248
          C 158 242, 165 240, 174 242
          C 186 244, 198 244, 210 241
          C 218 239, 224 244, 224 252
          C 224 266, 224 282, 218 292
          C 212 300, 198 298, 193 304
          C 191 307, 190 311, 190 315
        "
        fill="none"
        stroke="url(#holoIntestineGrad)"
        strokeWidth={active ? 11.5 : 10}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={active ? 0.85 : 0.62}
      />
      <path
        d="
          M 158 292
          C 155 280, 155 262, 157 248
          C 158 242, 165 240, 174 242
          C 186 244, 198 244, 210 241
          C 218 239, 224 244, 224 252
          C 224 266, 224 282, 218 292
          C 212 300, 198 298, 193 304
          C 191 307, 190 311, 190 315
        "
        fill="none"
        stroke={stroke}
        strokeWidth={active ? 1.5 : 1}
        strokeLinecap="round"
        strokeOpacity={0.8}
      />

      {/* Coiled Small Intestine Loops (Jejunum & Ileum) */}
      <path
        d="
          M 171 254
          C 182 248, 198 258, 209 253
          C 216 250, 214 263, 201 264
          C 187 265, 174 261, 169 268
          C 164 275, 180 278, 195 275
          C 208 273, 215 281, 204 286
          C 191 291, 176 283, 171 290
          C 167 295, 182 298, 194 295
        "
        fill="none"
        stroke="#C4B5FD"
        strokeWidth="4.4"
        strokeLinecap="round"
        strokeOpacity={active ? 0.85 : 0.56}
      />
      <path
        d="
          M 171 254
          C 182 248, 198 258, 209 253
          C 216 250, 214 263, 201 264
          C 187 265, 174 261, 169 268
          C 164 275, 180 278, 195 275
          C 208 273, 215 281, 204 286
          C 191 291, 176 283, 171 290
          C 167 295, 182 298, 194 295
        "
        fill="none"
        stroke="#67E8F9"
        strokeWidth="1"
        strokeLinecap="round"
        strokeOpacity="0.68"
      />

      {/* Connector Anchor Point */}
      <circle data-organ-anchor="intestines" cx="215" cy="272" r="2.4" fill="#A78BFA" />
    </g>
  );
};

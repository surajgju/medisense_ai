import React from 'react';
import type { OrganInteractionProps } from '../types';

export const Skeleton: React.FC<OrganInteractionProps> = ({
  selected,
  hovered,
  status,
  onSelect,
  onHover,
}) => {
  const active = selected || hovered;
  const boneStroke =
    active && status === 'warning'
      ? 'var(--holo-conn-warn)'
      : active && status === 'critical'
      ? 'var(--holo-conn-crit)'
      : active
      ? 'var(--holo-bone-active)'
      : 'var(--holo-bone-normal)';
  const boneOpacity = active ? 0.92 : 0.62;

  // Segmented thoracic/lumbar spine vertebrae positions
  const vertebraeY = [88, 96, 104, 114, 123, 132, 141, 150, 159, 168, 177, 186, 195, 205, 216, 227, 238, 249, 260];

  // Rib pairs [topY, outerX, endY, endX]
  const ribs: [number, number, number, number][] = [
    [122, 154, 127, 182],
    [131, 146, 137, 182],
    [140, 142, 148, 182],
    [150, 140, 159, 182],
    [160, 141, 170, 182],
    [170, 143, 181, 182],
    [180, 146, 192, 182],
    [190, 151, 202, 174],
    [200, 157, 210, 172],
  ];

  return (
    <g
      onClick={() => onSelect('skeleton')}
      onMouseEnter={() => onHover('skeleton')}
      onMouseLeave={() => onHover(null)}
      className="cursor-pointer transition-opacity duration-200"
      filter={active ? 'url(#holoCyanGlow)' : undefined}
      opacity={boneOpacity}
    >
      {/* Cranial Skull & Mandible Skeletal Overlay */}
      <path
        d="M 190 20 C 204 20, 212 31, 212 45 C 212 56, 207 62, 204 68 L 200 78 C 194 82, 186 82, 180 78 L 176 68 C 173 62, 168 56, 168 45 C 168 31, 176 20, 190 20 Z"
        fill="none"
        stroke={boneStroke}
        strokeWidth="0.95"
        strokeOpacity="0.65"
      />
      {/* Skull coronal suture */}
      <path d="M 173 36 Q 190 31 207 36" fill="none" stroke={boneStroke} strokeWidth="0.7" strokeDasharray="2 2" strokeOpacity="0.5" />

      {/* Segmented Cervical, Thoracic & Lumbar Spine */}
      <g>
        {vertebraeY.map((vy, idx) => (
          <rect
            key={idx}
            x={idx < 4 ? 186.5 : 185.5}
            y={vy}
            width={idx < 4 ? 7 : 9}
            height={idx < 4 ? 5.5 : 6.5}
            rx={1.5}
            fill="url(#holoBoneGrad)"
            fillOpacity={0.32}
            stroke={boneStroke}
            strokeWidth={0.85}
          />
        ))}
      </g>

      {/* Clavicles & Sternum (Manubrium + Body + Xiphoid) */}
      <path
        d="M 184 114 Q 160 109 132 121 M 196 114 Q 220 109 248 121"
        fill="none"
        stroke={boneStroke}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M 186 115 L 194 115 L 192.5 180 L 190 189 L 187.5 180 Z"
        fill="url(#holoBoneGrad)"
        fillOpacity={0.28}
        stroke={boneStroke}
        strokeWidth="1"
      />

      {/* Bilateral Ribcage */}
      <g fill="none" stroke={boneStroke} strokeWidth="1.25" strokeOpacity="0.75">
        {ribs.map(([topY, outerX, endY, endX], idx) => {
          const rightOuterX = 380 - outerX;
          const rightEndX = 380 - endX;
          return (
            <React.Fragment key={idx}>
              <path d={`M 186 ${topY} C ${outerX + 4} ${topY - 3}, ${outerX} ${topY + 8}, ${endX} ${endY}`} />
              <path d={`M 194 ${topY} C ${rightOuterX - 4} ${topY - 3}, ${rightOuterX} ${topY + 8}, ${rightEndX} ${endY}`} />
            </React.Fragment>
          );
        })}
      </g>

      {/* Arms: Humerus, Radius/Ulna & Wrist/Carpals */}
      <g fill="none" stroke={boneStroke} strokeWidth="2.1" strokeLinecap="round" strokeOpacity="0.72">
        {/* Left side humerus + forearm */}
        <line x1="130" y1="126" x2="113" y2="196" />
        <line x1="112" y1="201" x2="96" y2="264" strokeWidth="1.5" />
        <line x1="116" y1="201" x2="101" y2="265" strokeWidth="1.2" strokeOpacity="0.55" />
        {/* Right side humerus + forearm */}
        <line x1="250" y1="126" x2="267" y2="196" />
        <line x1="268" y1="201" x2="284" y2="264" strokeWidth="1.5" />
        <line x1="264" y1="201" x2="279" y2="265" strokeWidth="1.2" strokeOpacity="0.55" />
      </g>
      {/* Shoulder & Elbow Joint Capsules */}
      <circle cx="131" cy="124" r="5" fill="none" stroke={boneStroke} strokeWidth="1.2" />
      <circle cx="249" cy="124" r="5" fill="none" stroke={boneStroke} strokeWidth="1.2" />
      <circle cx="114" cy="199" r="3.6" fill="none" stroke={boneStroke} strokeWidth="1.1" />
      <circle cx="266" cy="199" r="3.6" fill="none" stroke={boneStroke} strokeWidth="1.1" />

      {/* Pelvic Girdle: Iliac Crests, Sacrum, Acetabulum & Pubic Arch */}
      <path
        d="
          M 183 268
          C 168 262, 146 266, 144 282
          C 142 296, 149 309, 160 310
          C 169 311, 178 306, 185 304
          L 190 307
          L 195 304
          C 202 306, 211 311, 220 310
          C 231 309, 238 296, 236 282
          C 234 266, 212 262, 197 268
          L 190 278 Z
        "
        fill="url(#holoBoneGrad)"
        fillOpacity={0.22}
        stroke={boneStroke}
        strokeWidth="1.35"
      />
      {/* Sacrum */}
      <polygon
        points="183,268 197,268 190,295"
        fill="url(#holoBoneGrad)"
        fillOpacity={0.3}
        stroke={boneStroke}
        strokeWidth="1"
      />

      {/* Lower Extremities: Femur, Patella/Knee Joints, Tibia, Fibula & Tarsals */}
      <g fill="none" stroke={boneStroke} strokeLinecap="round">
        {/* Left Leg */}
        <path d="M 157 302 L 166 404" strokeWidth="3.2" strokeOpacity="0.72" />
        <path d="M 166 418 L 164 516" strokeWidth="2.6" strokeOpacity="0.7" />
        <path d="M 161 420 L 158 514" strokeWidth="1.1" strokeOpacity="0.48" />
        {/* Right Leg */}
        <path d="M 223 302 L 214 404" strokeWidth="3.2" strokeOpacity="0.72" />
        <path d="M 214 418 L 216 516" strokeWidth="2.6" strokeOpacity="0.7" />
        <path d="M 219 420 L 222 514" strokeWidth="1.1" strokeOpacity="0.48" />
      </g>

      {/* Knee Joint Patella + Holographic Joint Rings */}
      <g>
        <circle cx="166" cy="411" r="8.5" fill="#38BDF8" fillOpacity={active ? 0.25 : 0.1} stroke={boneStroke} strokeWidth="1.3" />
        <ellipse cx="166" cy="411" rx="4" ry="5" fill="url(#holoBoneGrad)" fillOpacity="0.45" stroke={boneStroke} strokeWidth="1" />
        <circle cx="214" cy="411" r="8.5" fill="#38BDF8" fillOpacity={active ? 0.25 : 0.1} stroke={boneStroke} strokeWidth="1.3" />
        <ellipse cx="214" cy="411" rx="4" ry="5" fill="url(#holoBoneGrad)" fillOpacity="0.45" stroke={boneStroke} strokeWidth="1" />
      </g>

      {/* Ankle joints */}
      <circle cx="164" cy="518" r="3.5" fill="none" stroke={boneStroke} strokeWidth="1.1" />
      <circle cx="216" cy="518" r="3.5" fill="none" stroke={boneStroke} strokeWidth="1.1" />

      {/* Connector Anchor Point */}
      <circle data-organ-anchor="skeleton" cx="214" cy="411" r="2.6" fill="var(--holo-bone-active)" />
    </g>
  );
};

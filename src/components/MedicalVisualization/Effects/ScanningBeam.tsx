import React from 'react';

export const ScanningBeam: React.FC = () => (
  <g aria-hidden="true" className="pointer-events-none">
    {/* Pedestal Dual Projector Emitter Rings */}
    <ellipse cx="190" cy="534" rx="116" ry="18" fill="url(#holoPedestalGlow)" />
    <ellipse
      cx="190"
      cy="534"
      rx="98"
      ry="13"
      fill="none"
      stroke="var(--holo-ring-outer)"
      strokeOpacity="0.62"
      strokeWidth="1.6"
      filter="url(#holoCyanGlow)"
    />
    <ellipse
      cx="190"
      cy="534"
      rx="72"
      ry="8.5"
      fill="none"
      stroke="var(--holo-ring-inner)"
      strokeOpacity="0.58"
      strokeWidth="1.1"
    />
    <ellipse
      cx="190"
      cy="534"
      rx="46"
      ry="5"
      fill="none"
      stroke="var(--holo-contour)"
      strokeOpacity="0.4"
      strokeDasharray="4 4"
      strokeWidth="0.9"
    />

    {/* Vertical Holographic Emitter Pillars */}
    <line x1="102" y1="532" x2="102" y2="50" stroke="var(--holo-ring-outer)" strokeOpacity="0.14" strokeWidth="1" strokeDasharray="3 6" />
    <line x1="278" y1="532" x2="278" y2="50" stroke="var(--holo-ring-outer)" strokeOpacity="0.14" strokeWidth="1" strokeDasharray="3 6" />

    {/* Sweeping Horizontal Scan Beam */}
    <g className="holo-scan-beam">
      <rect x="78" y="20" width="224" height="36" fill="url(#holoBeamGrad)" />
      <line
        x1="84"
        y1="38"
        x2="296"
        y2="38"
        stroke="var(--holo-scan-line)"
        strokeOpacity="0.65"
        strokeWidth="1.1"
      />
    </g>
  </g>
);

import React from 'react';

const PARTICLE_SEEDS = [
  { cx: 112, cy: 132, r: 1.3, delay: '0s', fill: '#7DD3FC' },
  { cx: 268, cy: 148, r: 1.5, delay: '1.1s', fill: '#38BDF8' },
  { cx: 136, cy: 256, r: 1.2, delay: '2.2s', fill: '#BAE6FD' },
  { cx: 248, cy: 274, r: 1.4, delay: '0.6s', fill: '#C084FC' },
  { cx: 122, cy: 386, r: 1.3, delay: '1.7s', fill: '#7DD3FC' },
  { cx: 258, cy: 404, r: 1.2, delay: '3.0s', fill: '#38BDF8' },
  { cx: 190, cy: 86, r: 1.1, delay: '2.6s', fill: '#BAE6FD' },
  { cx: 152, cy: 478, r: 1.4, delay: '0.9s', fill: '#38BDF8' },
  { cx: 228, cy: 486, r: 1.2, delay: '3.7s', fill: '#7DD3FC' },
  { cx: 96, cy: 204, r: 1.1, delay: '4.1s', fill: '#BAE6FD' },
  { cx: 282, cy: 218, r: 1.3, delay: '1.4s', fill: '#F472B6' },
];

export const DataParticles: React.FC = () => (
  <g aria-hidden="true" className="pointer-events-none">
    {PARTICLE_SEEDS.map((p, idx) => (
      <circle
        key={idx}
        cx={p.cx}
        cy={p.cy}
        r={p.r}
        fill={p.fill}
        className="holo-particle"
        style={{ animationDelay: p.delay }}
      />
    ))}
  </g>
);

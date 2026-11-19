import React from 'react';

export const HolographicSvgDefs: React.FC = () => (
  <defs>
    {/* Body outer holographic shell gradients */}
    <linearGradient id="holoBodyFill" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="var(--holo-body-fill-a)" stopOpacity="0.16" />
      <stop offset="40%" stopColor="var(--holo-body-fill-a)" stopOpacity="0.11" />
      <stop offset="100%" stopColor="var(--holo-body-fill-b)" stopOpacity="0.18" />
    </linearGradient>

    <linearGradient id="holoBodyEdge" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="var(--holo-body-stroke-a)" stopOpacity="0.92" />
      <stop offset="50%" stopColor="var(--holo-body-stroke-b)" stopOpacity="0.78" />
      <stop offset="100%" stopColor="var(--holo-body-stroke-c)" stopOpacity="0.9" />
    </linearGradient>

    <radialGradient id="holoCoreAura" cx="50%" cy="38%" r="48%">
      <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.2" />
      <stop offset="55%" stopColor="#0284C7" stopOpacity="0.08" />
      <stop offset="100%" stopColor="var(--holo-aura-fade)" stopOpacity="0" />
    </radialGradient>

    {/* Skeletal cyan-blue gradient */}
    <linearGradient id="holoBoneGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="var(--holo-bone-fill-a)" stopOpacity="0.72" />
      <stop offset="100%" stopColor="var(--holo-bone-fill-b)" stopOpacity="0.45" />
    </linearGradient>

    {/* Brain blue neural gradient */}
    <radialGradient id="holoBrainGrad" cx="45%" cy="35%" r="65%">
      <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.92" />
      <stop offset="55%" stopColor="#0EA5E9" stopOpacity="0.75" />
      <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.65" />
    </radialGradient>

    {/* Lungs translucent cyan gradient */}
    <linearGradient id="holoLungGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.45" />
      <stop offset="60%" stopColor="#0EA5E9" stopOpacity="0.3" />
      <stop offset="100%" stopColor="#0284C7" stopOpacity="0.42" />
    </linearGradient>

    {/* Heart glowing pink/red gradient */}
    <radialGradient id="holoHeartGrad" cx="42%" cy="38%" r="65%">
      <stop offset="0%" stopColor="#FDA4AF" stopOpacity="0.96" />
      <stop offset="52%" stopColor="#F43F5E" stopOpacity="0.86" />
      <stop offset="100%" stopColor="#BE123C" stopOpacity="0.88" />
    </radialGradient>

    {/* Liver soft amber/brown translucent gradient */}
    <linearGradient id="holoLiverGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.65" />
      <stop offset="55%" stopColor="#D97706" stopOpacity="0.52" />
      <stop offset="100%" stopColor="#92400E" stopOpacity="0.56" />
    </linearGradient>

    {/* Stomach purple & cyan gradient */}
    <linearGradient id="holoStomachGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#A855F7" stopOpacity="0.62" />
      <stop offset="55%" stopColor="#6366F1" stopOpacity="0.48" />
      <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.46" />
    </linearGradient>

    {/* Intestines soft violet-cyan gradient */}
    <linearGradient id="holoIntestineGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.52" />
      <stop offset="50%" stopColor="#6366F1" stopOpacity="0.42" />
      <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.46" />
    </linearGradient>

    {/* Kidneys purple-blue gradient */}
    <radialGradient id="holoKidneyGrad" cx="45%" cy="40%" r="65%">
      <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.85" />
      <stop offset="65%" stopColor="#7C3AED" stopOpacity="0.68" />
      <stop offset="100%" stopColor="#4338CA" stopOpacity="0.75" />
    </radialGradient>

    {/* Pedestal emitter glow */}
    <radialGradient id="holoPedestalGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.34" />
      <stop offset="48%" stopColor="#0284C7" stopOpacity="0.14" />
      <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
    </radialGradient>

    {/* Subtle clean SVG glow filters */}
    <filter id="holoCyanGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="1.4" result="blur" />
      <feMerge>
        <feMergeNode in="blur" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <filter id="holoStrongGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="2.6" result="blur1" />
      <feMerge>
        <feMergeNode in="blur1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    {/* Subtle horizontal holographic scanline pattern */}
    <pattern id="holoScanPattern" width="8" height="4" patternUnits="userSpaceOnUse">
      <line
        x1="0"
        y1="0"
        x2="8"
        y2="0"
        stroke="var(--holo-contour)"
        strokeOpacity="0.14"
        strokeWidth="0.7"
      />
    </pattern>

    {/* Vertical scan beam gradient */}
    <linearGradient id="holoBeamGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0" />
      <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.32" />
      <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0" />
    </linearGradient>
  </defs>
);

export const HolographicEnvironmentBackdrop: React.FC = () => (
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
    {/* Light mode clean clinical sky-slate atmospheric halo */}
    <div
      className="absolute inset-0 dark:hidden"
      style={{
        background:
          'radial-gradient(ellipse 64% 58% at 50% 45%, rgba(56, 189, 248, 0.14) 0%, rgba(224, 242, 254, 0.42) 52%, rgba(248, 250, 252, 0.96) 100%)',
      }}
    />

    {/* Dark mode deep navy hologram atmosphere */}
    <div
      className="absolute inset-0 hidden dark:block"
      style={{
        background:
          'radial-gradient(ellipse 68% 58% at 50% 44%, rgba(14, 165, 233, 0.22) 0%, rgba(12, 33, 66, 0.55) 48%, rgba(4, 11, 24, 0.96) 100%)',
      }}
    />

    {/* Subtle architectural clinical projection grid */}
    <svg
      viewBox="0 0 1200 660"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full opacity-40 dark:opacity-25"
    >
      <g className="stroke-sky-500/20 dark:stroke-sky-400/20" strokeWidth="1" fill="none">
        <line x1="0" y1="92" x2="1200" y2="92" />
        <line x1="0" y1="560" x2="1200" y2="560" />
        <line x1="220" y1="0" x2="220" y2="660" />
        <line x1="980" y1="0" x2="980" y2="660" />
        <line x1="410" y1="0" x2="410" y2="92" />
        <line x1="790" y1="0" x2="790" y2="92" />
        {/* Overhead projector ring hint */}
        <ellipse cx="600" cy="48" rx="190" ry="22" strokeOpacity="0.45" strokeWidth="1.4" />
        <ellipse cx="600" cy="48" rx="145" ry="14" strokeOpacity="0.28" strokeDasharray="6 6" />
        {/* Perspective floor grid */}
        <line x1="120" y1="660" x2="430" y2="560" strokeOpacity="0.24" />
        <line x1="1080" y1="660" x2="770" y2="560" strokeOpacity="0.24" />
        <line x1="340" y1="660" x2="500" y2="560" strokeOpacity="0.24" />
        <line x1="860" y1="660" x2="700" y2="560" strokeOpacity="0.24" />
      </g>
    </svg>
  </div>
);

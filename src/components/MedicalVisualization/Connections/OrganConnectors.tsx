import React, { useLayoutEffect, useState } from 'react';
import type { HoloTone, OrganKey } from '../types';

export interface ConnectorBinding {
  id: string;
  panelSelector: string;
  organAnchor: OrganKey;
  side: 'left' | 'right';
  status: HoloTone;
  highlighted: boolean;
}

interface ResolvedLine {
  id: string;
  path: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  highlighted: boolean;
}

interface OrganConnectorsProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  bindings: ConnectorBinding[];
  layoutVersion: string;
}

function toneToStroke(status: HoloTone, highlighted: boolean): string {
  if (status === 'critical') {
    return highlighted ? 'var(--holo-conn-crit-hi)' : 'var(--holo-conn-crit)';
  }
  if (status === 'warning' || status === 'elevated') {
    return highlighted ? 'var(--holo-conn-warn-hi)' : 'var(--holo-conn-warn)';
  }
  return highlighted ? 'var(--holo-conn-normal-hi)' : 'var(--holo-conn-normal)';
}

export const OrganConnectors: React.FC<OrganConnectorsProps> = ({
  containerRef,
  bindings,
  layoutVersion,
}) => {
  const [lines, setLines] = useState<ResolvedLine[]>([]);
  const [boxSize, setBoxSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const computeLines = () => {
      const container = containerRef.current;
      if (!container) return;
      const cRect = container.getBoundingClientRect();
      if (cRect.width < 960) {
        setLines([]);
        return;
      }

      const nextLines: ResolvedLine[] = [];

      for (const b of bindings) {
        const panelEl = container.querySelector(b.panelSelector);
        const organEl = container.querySelector(`[data-organ-anchor="${b.organAnchor}"]`);
        if (!panelEl || !organEl) continue;

        const pRect = panelEl.getBoundingClientRect();
        const oRect = organEl.getBoundingClientRect();

        const startX =
          b.side === 'left' ? pRect.right - cRect.left : pRect.left - cRect.left;
        const startY = pRect.top + pRect.height * 0.5 - cRect.top;

        const endX = oRect.left + oRect.width * 0.5 - cRect.left;
        const endY = oRect.top + oRect.height * 0.5 - cRect.top;

        const midOffset = b.side === 'left' ? 28 : -28;
        const elbowX = startX + midOffset;
        const ctrlX1 = elbowX + (endX - elbowX) * 0.45;
        const ctrlX2 = elbowX + (endX - elbowX) * 0.65;

        const path = `M ${startX.toFixed(1)} ${startY.toFixed(1)} L ${elbowX.toFixed(1)} ${startY.toFixed(1)} C ${ctrlX1.toFixed(1)} ${startY.toFixed(1)}, ${ctrlX2.toFixed(1)} ${endY.toFixed(1)}, ${endX.toFixed(1)} ${endY.toFixed(1)}`;

        nextLines.push({
          id: b.id,
          path,
          startX,
          startY,
          endX,
          endY,
          color: toneToStroke(b.status, b.highlighted),
          highlighted: b.highlighted,
        });
      }

      setBoxSize({ w: cRect.width, h: cRect.height });
      setLines(nextLines);
    };

    computeLines();
    const ro = new ResizeObserver(() => computeLines());
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', computeLines);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', computeLines);
    };
  }, [containerRef, bindings, layoutVersion]);

  if (lines.length === 0 || boxSize.w === 0) return null;

  return (
    <svg
      aria-hidden="true"
      width={boxSize.w}
      height={boxSize.h}
      viewBox={`0 0 ${boxSize.w} ${boxSize.h}`}
      className="pointer-events-none absolute inset-0 z-10 hidden lg:block"
    >
      {lines.map((line) => (
        <g key={line.id}>
          {/* Soft base guide line */}
          <path
            d={line.path}
            fill="none"
            stroke={line.color}
            strokeWidth={line.highlighted ? 1.8 : 1.15}
            strokeOpacity={line.highlighted ? 0.92 : 0.48}
          />
          {/* Animated flowing data pulse */}
          <path
            d={line.path}
            fill="none"
            stroke="var(--holo-conn-pulse)"
            strokeWidth={line.highlighted ? 1.5 : 1}
            strokeOpacity={line.highlighted ? 0.88 : 0.48}
            className="holo-connector-flow"
          />
          {/* Panel endpoint dot */}
          <circle
            cx={line.startX}
            cy={line.startY}
            r={line.highlighted ? 3.5 : 2.5}
            fill={line.color}
          />
          {/* Organ endpoint halo + dot */}
          <circle
            cx={line.endX}
            cy={line.endY}
            r={line.highlighted ? 6 : 4.2}
            fill={line.color}
            fillOpacity={line.highlighted ? 0.3 : 0.18}
          />
          <circle
            cx={line.endX}
            cy={line.endY}
            r={line.highlighted ? 3 : 2.2}
            fill="var(--holo-conn-dot)"
          />
        </g>
      ))}
    </svg>
  );
};

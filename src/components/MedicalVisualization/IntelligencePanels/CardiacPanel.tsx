import React, { useMemo } from 'react';
import { HeartPulse } from 'lucide-react';
import type { HoloTone } from '../types';
import { HoloPanelShell } from './HoloPanelShell';

interface CardiacPanelProps {
  heartRate: number;
  bpSystolic: number;
  bpDiastolic: number;
  ecgSeries: { t: string; mv: number }[];
  statusTone: HoloTone;
  statusLabel: string;
  highlighted: boolean;
  onSelect: () => void;
  onHoverChange: (hover: boolean) => void;
}

export const CardiacPanel: React.FC<CardiacPanelProps> = ({
  heartRate,
  bpSystolic,
  bpDiastolic,
  ecgSeries,
  statusTone,
  statusLabel,
  highlighted,
  onSelect,
  onHoverChange,
}) => {
  const ecgPoints = useMemo(() => {
    const w = 220;
    const h = 38;
    const slice = ecgSeries.slice(0, 56);
    if (slice.length === 0) return '';
    return slice
      .map((pt, idx) => {
        const x = (idx / Math.max(1, slice.length - 1)) * w;
        const normalizedY = 1 - (pt.mv + 0.45) / 1.75;
        const y = Math.max(2, Math.min(h - 2, normalizedY * h));
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [ecgSeries]);

  return (
    <HoloPanelShell
      panelId="panel-cardiac"
      title="Cardiac Intelligence"
      icon={<HeartPulse className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />}
      statusLabel={statusLabel}
      statusTone={statusTone}
      highlighted={highlighted}
      onActivate={onSelect}
      onHoverChange={onHoverChange}
    >
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">Heart Rate</div>
          <div className="font-mono text-sm font-bold text-rose-600 dark:text-rose-200 tabular-nums">
            {heartRate} <span className="text-[10px] font-normal text-slate-400">BPM</span>
          </div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">Blood Pressure</div>
          <div className="font-mono text-sm font-bold text-slate-900 dark:text-cyan-200 tabular-nums">
            {bpSystolic}/{bpDiastolic}
            <span className="text-[10px] font-normal text-slate-400 ml-1">mmHg</span>
          </div>
        </div>
      </div>

      {/* Inline crisp ECG Lead II waveform */}
      <div className="mt-2 rounded-md border border-sky-200/80 dark:border-cyan-400/20 bg-sky-50/70 dark:bg-slate-950/70 px-1.5 py-1">
        <svg viewBox="0 0 220 38" className="w-full h-9" role="img" aria-label={`ECG waveform at ${heartRate} BPM`}>
          <line x1="0" y1="24" x2="220" y2="24" stroke="var(--holo-ecg)" strokeOpacity="0.2" strokeDasharray="2 3" strokeWidth="0.7" />
          <polyline
            fill="none"
            stroke="var(--holo-ecg)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={ecgPoints}
          />
        </svg>
      </div>
    </HoloPanelShell>
  );
};

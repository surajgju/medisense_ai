import React from 'react';
import { Activity } from 'lucide-react';
import type { HoloTone } from '../types';
import { HoloPanelShell } from './HoloPanelShell';

interface MobilityPanelProps {
  mobilityScore: number;
  jointHealthLabel: string;
  musculoskeletalAssessment: string;
  statusTone: HoloTone;
  statusLabel: string;
  highlighted: boolean;
  onSelect: () => void;
  onHoverChange: (hover: boolean) => void;
}

export const MobilityPanel: React.FC<MobilityPanelProps> = ({
  mobilityScore,
  jointHealthLabel,
  musculoskeletalAssessment,
  statusTone,
  statusLabel,
  highlighted,
  onSelect,
  onHoverChange,
}) => (
  <HoloPanelShell
    panelId="panel-mobility"
    title="Mobility Intelligence"
    icon={<Activity className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-300" />}
    statusLabel={statusLabel}
    statusTone={statusTone}
    highlighted={highlighted}
    onActivate={onSelect}
    onHoverChange={onHoverChange}
  >
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div>
        <div className="text-[10px] text-slate-500 dark:text-slate-400">Mobility Score</div>
        <div className="font-mono text-sm font-bold text-sky-700 dark:text-cyan-200 tabular-nums">
          {mobilityScore}
          <span className="text-[10px] font-normal text-slate-400">/100</span>
        </div>
      </div>
      <div>
        <div className="text-[10px] text-slate-500 dark:text-slate-400">Joint Health</div>
        <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 mt-0.5 truncate">
          {jointHealthLabel}
        </div>
      </div>
    </div>
    <div className="mt-1.5 text-[11px] text-slate-600 dark:text-slate-300 truncate">{musculoskeletalAssessment}</div>
  </HoloPanelShell>
);

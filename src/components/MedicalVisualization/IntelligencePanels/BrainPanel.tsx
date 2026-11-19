import React from 'react';
import { Brain } from 'lucide-react';
import type { HoloTone } from '../types';
import { HoloPanelShell } from './HoloPanelShell';

interface BrainPanelProps {
  cognitiveScore: number;
  neuroStatusLabel: string;
  meanArterialPressure: number;
  statusTone: HoloTone;
  statusLabel: string;
  highlighted: boolean;
  onSelect: () => void;
  onHoverChange: (hover: boolean) => void;
}

export const BrainPanel: React.FC<BrainPanelProps> = ({
  cognitiveScore,
  neuroStatusLabel,
  meanArterialPressure,
  statusTone,
  statusLabel,
  highlighted,
  onSelect,
  onHoverChange,
}) => (
  <HoloPanelShell
    panelId="panel-brain"
    title="Brain Intelligence"
    icon={<Brain className="w-3.5 h-3.5" />}
    statusLabel={statusLabel}
    statusTone={statusTone}
    highlighted={highlighted}
    onActivate={onSelect}
    onHoverChange={onHoverChange}
  >
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div>
        <div className="text-[10px] text-slate-500 dark:text-slate-400">Cognitive Score</div>
        <div className="font-mono text-sm font-bold text-sky-700 dark:text-cyan-200 tabular-nums">
          {cognitiveScore}
          <span className="text-[10px] font-normal text-slate-400">/100</span>
        </div>
      </div>
      <div>
        <div className="text-[10px] text-slate-500 dark:text-slate-400">Cerebral Perfusion</div>
        <div className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100 tabular-nums mt-0.5">
          MAP {meanArterialPressure} mmHg
        </div>
      </div>
    </div>
    <div className="mt-1.5 text-[11px] text-slate-600 dark:text-slate-300 truncate">
      Neuro Assessment:{' '}
      <span className="text-sky-700 dark:text-cyan-200 font-medium">{neuroStatusLabel}</span>
    </div>
  </HoloPanelShell>
);

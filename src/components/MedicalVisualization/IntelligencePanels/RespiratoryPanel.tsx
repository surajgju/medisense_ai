import React from 'react';
import { Wind } from 'lucide-react';
import type { HoloTone } from '../types';
import { HoloPanelShell } from './HoloPanelShell';

interface RespiratoryPanelProps {
  spo2: number;
  respiratoryRate: number;
  statusTone: HoloTone;
  statusLabel: string;
  highlighted: boolean;
  onSelect: () => void;
  onHoverChange: (hover: boolean) => void;
}

export const RespiratoryPanel: React.FC<RespiratoryPanelProps> = ({
  spo2,
  respiratoryRate,
  statusTone,
  statusLabel,
  highlighted,
  onSelect,
  onHoverChange,
}) => (
  <HoloPanelShell
    panelId="panel-respiratory"
    title="Respiratory Intelligence"
    icon={<Wind className="w-3.5 h-3.5" />}
    statusLabel={statusLabel}
    statusTone={statusTone}
    highlighted={highlighted}
    onActivate={onSelect}
    onHoverChange={onHoverChange}
  >
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div>
        <div className="text-[10px] text-slate-500 dark:text-slate-400">Oxygen Saturation</div>
        <div className="font-mono text-sm font-bold text-sky-700 dark:text-cyan-200 tabular-nums">
          {spo2}%
          <span className="text-[10px] font-normal text-slate-400 ml-1">SpO₂</span>
        </div>
      </div>
      <div>
        <div className="text-[10px] text-slate-500 dark:text-slate-400">Respiratory Rate</div>
        <div className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100 tabular-nums">
          {respiratoryRate}
          <span className="text-[10px] font-normal text-slate-400 ml-1">/min</span>
        </div>
      </div>
    </div>
    <div className="mt-1.5 text-[11px] text-slate-600 dark:text-slate-300 truncate">
      Lung Indicator:{' '}
      <span className="text-sky-700 dark:text-cyan-200 font-medium">
        {spo2 >= 95 ? 'Ventilation & Airway Clear' : 'Hypoxemia Review Suggested'}
      </span>
    </div>
  </HoloPanelShell>
);

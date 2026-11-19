import React from 'react';
import { Flame } from 'lucide-react';
import type { HoloTone } from '../types';
import { HoloPanelShell } from './HoloPanelShell';

interface MetabolicPanelProps {
  glucoseMgDl: number;
  bmi: number;
  temperatureC: number;
  metabolicStatusLabel: string;
  statusTone: HoloTone;
  highlighted: boolean;
  onSelect: () => void;
  onHoverChange: (hover: boolean) => void;
}

export const MetabolicPanel: React.FC<MetabolicPanelProps> = ({
  glucoseMgDl,
  bmi,
  temperatureC,
  metabolicStatusLabel,
  statusTone,
  highlighted,
  onSelect,
  onHoverChange,
}) => (
  <HoloPanelShell
    panelId="panel-metabolic"
    title="Metabolic Intelligence"
    icon={<Flame className="w-3.5 h-3.5 text-amber-600 dark:text-amber-300" />}
    statusLabel={metabolicStatusLabel}
    statusTone={statusTone}
    highlighted={highlighted}
    onActivate={onSelect}
    onHoverChange={onHoverChange}
  >
    <div className="grid grid-cols-3 gap-2 text-xs">
      <div>
        <div className="text-[10px] text-slate-500 dark:text-slate-400">Blood Glucose</div>
        <div className="font-mono text-sm font-bold text-amber-700 dark:text-amber-200 tabular-nums">
          {glucoseMgDl}
          <span className="text-[9.5px] font-normal text-slate-400 ml-0.5">mg/dL</span>
        </div>
      </div>
      <div>
        <div className="text-[10px] text-slate-500 dark:text-slate-400">BMI Index</div>
        <div className="font-mono text-sm font-bold text-sky-700 dark:text-cyan-200 tabular-nums">{bmi}</div>
      </div>
      <div>
        <div className="text-[10px] text-slate-500 dark:text-slate-400">Core Temp</div>
        <div className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100 tabular-nums">
          {temperatureC.toFixed(1)}°C
        </div>
      </div>
    </div>
    <div className="mt-1.5 text-[11px] text-slate-600 dark:text-slate-300 truncate">
      Hepatic / Renal Track:{' '}
      <span className="text-amber-700 dark:text-amber-200 font-medium">{metabolicStatusLabel}</span>
    </div>
  </HoloPanelShell>
);

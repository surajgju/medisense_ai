import React from 'react';
import { ShieldAlert } from 'lucide-react';
import type { RiskClassification } from '../../../types/healthcare';
import type { HoloTone } from '../types';
import { HoloPanelShell } from './HoloPanelShell';

interface AiIntelligencePanelProps {
  riskLevel: RiskClassification;
  riskScore: number;
  stabilityIndex: number;
  aiAnalysisStatus: string;
  monitoringStatus: string;
  highlighted: boolean;
  onSelect: () => void;
  onHoverChange: (hover: boolean) => void;
}

export const AiIntelligencePanel: React.FC<AiIntelligencePanelProps> = ({
  riskLevel,
  riskScore,
  stabilityIndex,
  aiAnalysisStatus,
  monitoringStatus,
  highlighted,
  onSelect,
  onHoverChange,
}) => {
  const tone: HoloTone =
    riskLevel === 'Critical'
      ? 'critical'
      : riskLevel === 'High' || riskLevel === 'Moderate'
      ? 'warning'
      : 'normal';

  return (
    <HoloPanelShell
      panelId="panel-ai"
      title="AI Medical Intelligence"
      icon={<ShieldAlert className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-300" />}
      statusLabel={`${riskLevel} Risk`}
      statusTone={tone}
      highlighted={highlighted}
      onActivate={onSelect}
      onHoverChange={onHoverChange}
    >
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">Clinical Risk Index</div>
          <div className="font-mono text-sm font-bold text-amber-700 dark:text-amber-200 tabular-nums">
            {riskScore}
            <span className="text-[10px] font-normal text-slate-400">/100</span>
          </div>
        </div>
        <div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">Stability Index</div>
          <div className="font-mono text-sm font-bold text-sky-700 dark:text-cyan-200 tabular-nums">
            {stabilityIndex}
            <span className="text-[10px] font-normal text-slate-400">/100</span>
          </div>
        </div>
      </div>
      <div className="mt-1.5 space-y-0.5 text-[11px] text-slate-600 dark:text-slate-300">
        <div className="truncate">
          AI Status: <span className="text-sky-700 dark:text-cyan-200 font-medium">{aiAnalysisStatus}</span>
        </div>
        <div className="truncate">
          Monitoring: <span className="text-slate-900 dark:text-slate-100 font-medium">{monitoringStatus}</span>
        </div>
      </div>
    </HoloPanelShell>
  );
};

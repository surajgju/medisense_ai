import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { HoloTone } from '../types';

export const HoloStatusBadge: React.FC<{ label: string; tone: HoloTone }> = ({ label, tone }) => {
  const styles: Record<HoloTone, string> = {
    normal: 'text-emerald-700 dark:text-emerald-300',
    elevated: 'text-amber-700 dark:text-amber-300',
    warning: 'text-amber-700 dark:text-amber-300',
    critical: 'text-rose-700 dark:text-rose-300',
  };
  const Icon =
    tone === 'critical'
      ? AlertCircle
      : tone === 'warning' || tone === 'elevated'
      ? AlertTriangle
      : CheckCircle2;

  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-medium whitespace-nowrap ${styles[tone]}`}>
      <Icon className="w-3 h-3 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
};

interface HoloPanelShellProps {
  panelId: string;
  title: string;
  icon: React.ReactNode;
  statusLabel: string;
  statusTone: HoloTone;
  highlighted: boolean;
  onActivate: () => void;
  onHoverChange?: (hovering: boolean) => void;
  children: React.ReactNode;
}

export const HoloPanelShell: React.FC<HoloPanelShellProps> = ({
  panelId,
  title,
  icon,
  statusLabel,
  statusTone,
  highlighted,
  onActivate,
  onHoverChange,
  children,
}) => {
  const borderClass = highlighted
    ? 'border-sky-500 bg-white ring-1 ring-sky-200 shadow-[0_6px_18px_rgba(2,132,199,0.12)] dark:ring-0 dark:border-cyan-300/90 dark:bg-slate-900/85 dark:shadow-[0_0_24px_rgba(56,189,248,0.28)]'
    : 'border-slate-200/90 bg-white/95 hover:border-sky-300 hover:bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)] dark:border-cyan-400/35 dark:bg-slate-950/75 dark:hover:border-cyan-300/70 dark:hover:bg-slate-900/80 dark:shadow-[0_8px_24px_rgba(2,6,23,0.45)]';

  return (
    <div
      data-panel-anchor={panelId}
      onMouseEnter={() => onHoverChange?.(true)}
      onMouseLeave={() => onHoverChange?.(false)}
      className={`relative rounded-xl border backdrop-blur-md p-2.5 transition-all duration-200 ${borderClass}`}
    >
      {/* Subtle top glass reflection highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/70 dark:via-cyan-200/60 to-transparent"
      />

      <button
        type="button"
        onClick={onActivate}
        className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:focus-visible:ring-cyan-400 rounded-lg"
      >
        <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-100 dark:border-cyan-400/15">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-sky-600 dark:text-cyan-300 shrink-0" aria-hidden="true">
              {icon}
            </span>
            <span className="text-xs font-semibold tracking-tight text-slate-900 dark:text-slate-100 truncate">
              {title}
            </span>
          </div>
          <HoloStatusBadge label={statusLabel} tone={statusTone} />
        </div>
        <div className="pt-1.5">{children}</div>
      </button>
    </div>
  );
};

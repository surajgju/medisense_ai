import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Clock, Info } from 'lucide-react';

export type StatusTone = 'normal' | 'warning' | 'critical' | 'info' | 'neutral';

export function getToneForLabel(label: string): StatusTone {
  const lower = label.toLowerCase();
  if (
    lower.includes('critical') ||
    lower.includes('escalated') ||
    lower.includes('major') ||
    lower.includes('missed') ||
    lower.includes('cancelled') ||
    lower.includes('icu')
  ) {
    return 'critical';
  }
  if (
    lower.includes('high') ||
    lower.includes('warning') ||
    lower.includes('abnormal') ||
    lower.includes('borderline') ||
    lower.includes('pending') ||
    lower.includes('moderate') ||
    lower.includes('clarification') ||
    lower.includes('paused')
  ) {
    return 'warning';
  }
  if (
    lower.includes('normal') ||
    lower.includes('low') ||
    lower.includes('completed') ||
    lower.includes('reviewed') ||
    lower.includes('verified') ||
    lower.includes('active') ||
    lower.includes('confirmed') ||
    lower.includes('configured')
  ) {
    return 'normal';
  }
  if (
    lower.includes('informational') ||
    lower.includes('scheduled') ||
    lower.includes('in progress') ||
    lower.includes('under review') ||
    lower.includes('analysed') ||
    lower.includes('tele')
  ) {
    return 'info';
  }
  return 'neutral';
}

export const StatusLabel: React.FC<{
  label: string;
  tone?: StatusTone;
}> = ({ label, tone }) => {
  const resolved = tone ?? getToneForLabel(label);

  const styles: Record<StatusTone, string> = {
    normal: 'text-emerald-700 dark:text-emerald-400',
    warning: 'text-amber-700 dark:text-amber-400',
    critical: 'text-rose-700 dark:text-rose-400',
    info: 'text-sky-700 dark:text-sky-400',
    neutral: 'text-slate-600 dark:text-slate-400',
  };

  const Icon =
    resolved === 'critical'
      ? AlertCircle
      : resolved === 'warning'
      ? AlertTriangle
      : resolved === 'normal'
      ? CheckCircle2
      : resolved === 'info'
      ? Info
      : Clock;

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap ${styles[resolved]}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
};

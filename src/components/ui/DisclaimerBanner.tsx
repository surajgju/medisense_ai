import React from 'react';
import { ShieldAlert } from 'lucide-react';

interface DisclaimerBannerProps {
  title?: string;
  message: string;
  tone?: 'neutral' | 'clinical';
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({
  title = 'Simulated Demonstration Environment',
  message,
  tone = 'neutral',
}) => {
  return (
    <div
      role="note"
      className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-xs leading-relaxed ${
        tone === 'clinical'
          ? 'border-sky-200 dark:border-sky-900/60 bg-sky-50/70 dark:bg-sky-950/30 text-sky-900 dark:text-sky-200'
          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-600 dark:text-slate-300'
      }`}
    >
      <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-sky-600 dark:text-sky-400" aria-hidden="true" />
      <div>
        <span className="font-semibold text-slate-900 dark:text-slate-100">{title}: </span>
        <span>{message}</span>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Info, TrendingDown, TrendingUp } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts';

export interface KpiCardProps {
  label: string;
  value: string;
  prevValue: string;
  changePct: string;
  trend: 'up' | 'down';
  positiveIsGood: boolean;
  tooltip: string;
  sparkline: number[];
  color: string;
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  label,
  value,
  prevValue,
  changePct,
  trend,
  positiveIsGood,
  tooltip,
  sparkline,
  color,
  onClick,
}) => {
  const [showTip, setShowTip] = useState(false);

  const isPositiveOutcome =
    (trend === 'up' && positiveIsGood) || (trend === 'down' && !positiveIsGood);

  const chartData = sparkline.map((v, i) => ({ idx: i, v }));
  const gradientId = `spark-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  return (
    <div className="relative flex flex-col justify-between rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:border-slate-300 dark:hover:border-slate-700 h-full">
      {onClick && (
        <button
          type="button"
          onClick={onClick}
          aria-label={`Open details for ${label}`}
          className="absolute inset-0 z-0 rounded-xl focus-visible:outline-2 focus-visible:outline-sky-600"
        />
      )}

      <div className="relative z-10 flex items-start justify-between gap-2 pointer-events-none">
        <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400 leading-snug">
          {label}
        </span>
        <div className="relative pointer-events-auto">
          <button
            type="button"
            aria-label={`Metric details for ${label}`}
            onMouseEnter={() => setShowTip(true)}
            onMouseLeave={() => setShowTip(false)}
            onFocus={() => setShowTip(true)}
            onBlur={() => setShowTip(false)}
            onClick={(e) => {
              e.stopPropagation();
              setShowTip((s) => !s);
            }}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded focus-visible:outline-2 focus-visible:outline-sky-600"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
          {showTip && (
            <div
              role="tooltip"
              className="absolute right-0 top-6 z-30 w-56 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-900 dark:bg-slate-800 px-3 py-2 text-xs text-slate-100 shadow-lg leading-relaxed"
            >
              {tooltip}
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 mt-2.5 flex items-end justify-between gap-2 pointer-events-none">
        <div className="min-w-0">
          <div className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50 tabular-nums whitespace-nowrap">
            {value}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px] tabular-nums whitespace-nowrap">
            <span
              className={`inline-flex items-center gap-0.5 font-semibold ${
                isPositiveOutcome
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {trend === 'up' ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {changePct}
            </span>
            <span className="text-slate-400 dark:text-slate-500 truncate">vs {prevValue}</span>
          </div>
        </div>

        <div className="w-16 h-9 shrink-0" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.24} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <YAxis hide domain={['dataMin', 'dataMax']} />
              <Area
                type="monotone"
                dataKey="v"
                stroke={color}
                strokeWidth={1.75}
                fill={`url(#${gradientId})`}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

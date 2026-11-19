import React, { useMemo, useState } from 'react';
import { CheckCircle2, ShieldAlert } from 'lucide-react';
import { useHealthcare } from '../../context/HealthcareContext';
import type { ReviewStatus } from '../../types/healthcare';
import { DisclaimerBanner } from '../ui/DisclaimerBanner';
import { StatusLabel } from '../ui/StatusLabel';

export const AiRecommendationsView: React.FC = () => {
  const { alerts, updateAlertStatus, openPatientDetail } = useHealthcare();
  const [statusFilter, setStatusFilter] = useState<'All' | ReviewStatus>('All');

  const filtered = useMemo(() => {
    if (statusFilter === 'All') return alerts;
    return alerts.filter((a) => a.reviewStatus === statusFilter);
  }, [alerts, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            AI Recommendations Queue
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track, review, and escalate AI-generated clinical and hospital operational recommendations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800/80">
          {(['All', 'Pending Review', 'Under Review', 'Reviewed', 'Escalated'] as const).map(
            (st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                {st}
              </button>
            )
          )}
        </div>
      </div>

      <DisclaimerBanner
        tone="clinical"
        title="Decision Support Governance"
        message="Simulated AI recommendations require explicit clinician or operations lead sign-off and do not automatically modify patient orders."
      />

      <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4 font-semibold">ID</th>
                <th className="py-3 px-3 font-semibold">Recommendation</th>
                <th className="py-3 px-3 font-semibold">Category & Dept</th>
                <th className="py-3 px-3 font-semibold">Severity</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-semibold text-sky-700 dark:text-sky-400">
                    {a.id}
                  </td>
                  <td className="py-3 px-3 max-w-md">
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{a.title}</div>
                    <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                      {a.recommendedAction}
                      {a.patientId && (
                        <button
                          type="button"
                          onClick={() => openPatientDetail(a.patientId!)}
                          className="ml-2 font-mono text-sky-600 dark:text-sky-400 hover:underline"
                        >
                          ({a.patientId})
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-800 dark:text-slate-200">{a.category}</div>
                    <div className="text-[11px] text-slate-400">{a.department}</div>
                  </td>
                  <td className="py-3 px-3">
                    <StatusLabel label={a.severity} />
                  </td>
                  <td className="py-3 px-3">
                    <StatusLabel label={a.reviewStatus} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {a.reviewStatus !== 'Reviewed' && (
                        <button
                          type="button"
                          onClick={() => updateAlertStatus(a.id, 'Reviewed')}
                          className="inline-flex items-center gap-1 rounded bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 text-[11px] font-semibold text-white"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Approve
                        </button>
                      )}
                      {a.reviewStatus !== 'Escalated' && (
                        <button
                          type="button"
                          onClick={() => updateAlertStatus(a.id, 'Escalated')}
                          className="inline-flex items-center gap-1 rounded border border-rose-200 dark:border-rose-800 px-2 py-1 text-[11px] font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        >
                          <ShieldAlert className="w-3 h-3" />
                          Escalate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

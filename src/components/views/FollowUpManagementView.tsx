import React, { useMemo, useState } from 'react';
import { CalendarCheck, Send } from 'lucide-react';
import { useHealthcare } from '../../context/HealthcareContext';
import type { FollowUpRecord } from '../../types/healthcare';
import { StatusLabel } from '../ui/StatusLabel';

export const FollowUpManagementView: React.FC = () => {
  const { followUps, updateFollowUpStatus, openPatientDetail, selectedDepartment } = useHealthcare();
  const [statusFilter, setStatusFilter] = useState<'All' | FollowUpRecord['outreachStatus']>('All');

  const filtered = useMemo(() => {
    return followUps.filter((f) => {
      if (selectedDepartment !== 'All' && f.department !== selectedDepartment) return false;
      if (statusFilter !== 'All' && f.outreachStatus !== statusFilter) return false;
      return true;
    });
  }, [followUps, selectedDepartment, statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Follow-up & Recall Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Track post-discharge adherence, missed consultations, and automated care-coordinator outreach.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800/80">
          {(['All', 'Pending Outreach', 'Reminder Sent', 'Rescheduled', 'Completed'] as const).map(
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

      <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4 font-semibold">Follow-Up ID</th>
                <th className="py-3 px-3 font-semibold">Patient</th>
                <th className="py-3 px-3 font-semibold">Department</th>
                <th className="py-3 px-3 font-semibold">Due Date</th>
                <th className="py-3 px-3 font-semibold">Reason</th>
                <th className="py-3 px-3 font-semibold">Risk</th>
                <th className="py-3 px-3 font-semibold">Outreach Status</th>
                <th className="py-3 px-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((f) => (
                <tr key={f.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-semibold text-sky-700 dark:text-sky-400">
                    {f.id}
                  </td>
                  <td className="py-3 px-3">
                    <button
                      type="button"
                      onClick={() => openPatientDetail(f.patientId)}
                      className="font-medium text-slate-900 dark:text-slate-100 hover:text-sky-600"
                    >
                      {f.patientName}
                    </button>
                    <div className="font-mono text-[11px] text-slate-400">{f.patientId}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{f.department}</td>
                  <td className="py-3 px-3 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                    {f.dueDate}
                  </td>
                  <td className="py-3 px-3 max-w-[200px] truncate text-slate-600 dark:text-slate-400">
                    {f.reason}
                  </td>
                  <td className="py-3 px-3">
                    <StatusLabel label={f.riskLevel} />
                  </td>
                  <td className="py-3 px-3">
                    <StatusLabel label={f.outreachStatus} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {f.outreachStatus === 'Pending Outreach' && (
                        <button
                          type="button"
                          onClick={() => updateFollowUpStatus(f.id, 'Reminder Sent')}
                          className="inline-flex items-center gap-1 rounded border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 px-2.5 py-1 text-[11px] font-semibold text-sky-700 dark:text-sky-300 hover:bg-sky-100"
                        >
                          <Send className="w-3 h-3" />
                          Send Reminder
                        </button>
                      )}
                      {f.outreachStatus !== 'Completed' && (
                        <button
                          type="button"
                          onClick={() => updateFollowUpStatus(f.id, 'Completed')}
                          className="inline-flex items-center gap-1 rounded bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 text-[11px] font-semibold text-white"
                        >
                          <CalendarCheck className="w-3 h-3" />
                          Mark Done
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

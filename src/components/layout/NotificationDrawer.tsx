import React from 'react';
import { Bell, Check, ExternalLink, X } from 'lucide-react';
import { useHealthcare } from '../../context/HealthcareContext';
import { StatusLabel } from '../ui/StatusLabel';

export const NotificationDrawer: React.FC = () => {
  const {
    notificationsOpen,
    setNotificationsOpen,
    alerts,
    updateAlertStatus,
    openPatientDetail,
    setActiveRoute,
  } = useHealthcare();

  if (!notificationsOpen) return null;

  const activeAlerts = alerts.slice(0, 10);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Clinical Notification Centre"
    >
      <div
        className="fixed inset-0 bg-slate-950/35"
        onClick={() => setNotificationsOpen(false)}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-sky-600" />
            <h2 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
              Clinical Notification Centre
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setNotificationsOpen(false)}
            aria-label="Close notification centre"
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {activeAlerts.map((alert) => (
            <div key={alert.id} className="p-4 space-y-2 hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
              <div className="flex items-center justify-between gap-2">
                <StatusLabel label={alert.severity} />
                <span className="text-[11px] font-mono text-slate-400">{alert.detectedAt}</span>
              </div>
              <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                {alert.title}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {alert.explanation}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {alert.department} · {alert.reviewStatus}
                </span>
                <div className="flex items-center gap-2">
                  {alert.patientId && (
                    <button
                      type="button"
                      onClick={() => {
                        openPatientDetail(alert.patientId!);
                        setNotificationsOpen(false);
                      }}
                      className="text-[11px] font-medium text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1"
                    >
                      <span>View {alert.patientId}</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                  {alert.reviewStatus === 'Pending Review' && (
                    <button
                      type="button"
                      onClick={() => updateAlertStatus(alert.id, 'Reviewed')}
                      className="inline-flex items-center gap-1 rounded border border-slate-200 dark:border-slate-700 px-2 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Check className="w-3 h-3 text-emerald-600" />
                      Mark Reviewed
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen(false);
              setActiveRoute('ai-centre');
            }}
            className="w-full rounded-lg bg-sky-600 hover:bg-sky-700 py-2 text-xs font-semibold text-white transition-colors"
          >
            Open Full AI Intelligence Centre
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useMemo, useState } from 'react';
import { ArrowUpRight, BrainCircuit, CheckCircle2, Eye, ShieldAlert } from 'lucide-react';
import { useHealthcare } from '../../context/HealthcareContext';
import type { ClinicalAlert, SeverityLevel } from '../../types/healthcare';
import { DisclaimerBanner } from '../ui/DisclaimerBanner';
import { StatusLabel } from '../ui/StatusLabel';

const SEVERITIES: ('All' | SeverityLevel)[] = ['All', 'Critical', 'High', 'Moderate', 'Informational'];

export const AiIntelligenceCentreView: React.FC = () => {
  const { alerts, updateAlertStatus, selectedDepartment, openPatientDetail, setActiveRoute } =
    useHealthcare();

  const [severityFilter, setSeverityFilter] = useState<'All' | SeverityLevel>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedInsight, setSelectedInsight] = useState<ClinicalAlert | null>(alerts[0] ?? null);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(alerts.map((a) => a.category)))],
    [alerts]
  );

  const filteredAlerts = useMemo(() => {
    return alerts.filter((a) => {
      if (
        selectedDepartment !== 'All' &&
        a.department !== selectedDepartment &&
        a.department !== 'Hospital Operations'
      ) {
        return false;
      }
      if (severityFilter !== 'All' && a.severity !== severityFilter) return false;
      if (categoryFilter !== 'All' && a.category !== categoryFilter) return false;
      return true;
    });
  }, [alerts, selectedDepartment, severityFilter, categoryFilter]);

  const activeInsight =
    filteredAlerts.find((a) => a.id === selectedInsight?.id) ?? filteredAlerts[0] ?? null;

  const counts = useMemo(
    () => ({
      critical: alerts.filter((a) => a.severity === 'Critical' && a.reviewStatus !== 'Reviewed').length,
      pending: alerts.filter((a) => a.reviewStatus === 'Pending Review').length,
      reviewed: alerts.filter((a) => a.reviewStatus === 'Reviewed').length,
    }),
    [alerts]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            AI Healthcare Intelligence Centre
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Simulated contextual insights synthesised across patient vitals, lab anomalies, and hospital capacity.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs tabular-nums">
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2">
            <span className="text-slate-500 dark:text-slate-400">Critical Open: </span>
            <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{counts.critical}</span>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2">
            <span className="text-slate-500 dark:text-slate-400">Pending Review: </span>
            <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{counts.pending}</span>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3.5 py-2">
            <span className="text-slate-500 dark:text-slate-400">Reviewed: </span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{counts.reviewed}</span>
          </div>
        </div>
      </div>

      {/* Contextual Clinical Narrative */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 dark:text-sky-400 mb-2">
          <BrainCircuit className="w-4 h-4" />
          Weekly Simulated Network Intelligence Synthesis
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
          Patient admission activity increased by 8.4% this week. The cardiology department has experienced increased patient volume across Mumbai and Delhi hubs. Twelve cases have been flagged for additional clinical review based on simulated risk indicators, while Emergency department waiting time rose by 11% to 18 minutes. Post-discharge nephrology follow-up adherence requires coordinator outreach.
        </p>
      </section>

      <DisclaimerBanner
        tone="clinical"
        title="Simulated AI Recommendations Notice"
        message="Insights listed below are illustrative outputs generated from synthetic healthcare records to demonstrate triage prioritisation. They are not clinically validated medical diagnoses and must be verified by qualified clinicians."
      />

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800/80">
          {SEVERITIES.map((sev) => (
            <button
              key={sev}
              type="button"
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                severityFilter === sev
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="insight-category-select" className="text-xs text-slate-500 dark:text-slate-400">
            Signal Type:
          </label>
          <select
            id="insight-category-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:border-sky-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Master-Detail AI Insights Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-7 space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No insights match the selected severity and department filters.
            </div>
          ) : (
            filteredAlerts.map((alert) => {
              const isSelected = activeInsight?.id === alert.id;
              return (
                <article
                  key={alert.id}
                  className={`rounded-xl border p-4 transition-colors bg-white dark:bg-slate-900 ${
                    isSelected
                      ? 'border-sky-500 ring-1 ring-sky-500/30'
                      : 'border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 text-xs">
                      <StatusLabel label={alert.severity} />
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="text-slate-500 dark:text-slate-400">{alert.category}</span>
                      <span className="text-slate-300 dark:text-slate-700">·</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {alert.department}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">{alert.detectedAt}</span>
                  </div>

                  <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {alert.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    {alert.explanation}
                  </p>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      <span className="font-semibold">Next Action:</span> {alert.recommendedAction}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusLabel label={alert.reviewStatus} />
                      <button
                        type="button"
                        onClick={() => setSelectedInsight(alert)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Review
                      </button>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Insight Detail Panel */}
        <aside className="lg:col-span-5 lg:sticky lg:top-20 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          {activeInsight ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-sky-700 dark:text-sky-400">
                  {activeInsight.id}
                </span>
                <StatusLabel label={activeInsight.severity} />
              </div>

              <div>
                <h2 className="font-display text-base font-bold text-slate-900 dark:text-slate-50">
                  {activeInsight.title}
                </h2>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {activeInsight.hospital} · {activeInsight.department} · Detected {activeInsight.detectedAt}
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3.5 space-y-2 text-xs">
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  AI-Generated Explanation (Simulated)
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeInsight.explanation}
                </p>
              </div>

              <div className="rounded-lg border border-sky-200 dark:border-sky-900/50 bg-sky-50/50 dark:bg-sky-950/20 p-3.5 space-y-1.5 text-xs">
                <div className="font-semibold text-sky-900 dark:text-sky-200">
                  Recommended Next Action for Clinician Review
                </div>
                <p className="text-sky-800 dark:text-sky-300 leading-relaxed">
                  {activeInsight.recommendedAction}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500 dark:text-slate-400">Current Workflow State:</span>
                <StatusLabel label={activeInsight.reviewStatus} />
              </div>

              {activeInsight.patientId && (
                <button
                  type="button"
                  onClick={() => openPatientDetail(activeInsight.patientId!)}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Inspect Patient Record ({activeInsight.patientId})
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}

              <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => updateAlertStatus(activeInsight.id, 'Reviewed')}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 py-2 text-xs font-semibold text-white transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mark Reviewed
                </button>
                <button
                  type="button"
                  onClick={() => updateAlertStatus(activeInsight.id, 'Escalated')}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 py-2 text-xs font-semibold transition-colors"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Escalate to Lead
                </button>
              </div>

              <button
                type="button"
                onClick={() => setActiveRoute('ai-recommendations')}
                className="w-full text-center text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline pt-1"
              >
                Open Consolidated AI Recommendations Queue
              </button>
            </div>
          ) : (
            <div className="text-xs text-slate-500 text-center py-8">
              Select an insight on the left to inspect its clinical context.
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

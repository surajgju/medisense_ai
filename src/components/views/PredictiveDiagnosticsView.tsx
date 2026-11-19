import React, { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CheckCircle2, Search, ShieldAlert } from 'lucide-react';
import { useHealthcare } from '../../context/HealthcareContext';
import type { DiagnosticCase, RiskClassification } from '../../types/healthcare';
import { ChartCard } from '../ui/ChartCard';
import { DisclaimerBanner } from '../ui/DisclaimerBanner';
import { StatusLabel } from '../ui/StatusLabel';

export const PredictiveDiagnosticsView: React.FC = () => {
  const { diagnosticCases, updateDiagnosticReview, selectedDepartment, openPatientDetail } =
    useHealthcare();

  const [riskFilter, setRiskFilter] = useState<'All' | RiskClassification>('All');
  const [query, setQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState<DiagnosticCase | null>(diagnosticCases[0] ?? null);

  const filteredCases = useMemo(() => {
    const q = query.trim().toLowerCase();
    return diagnosticCases.filter((c) => {
      if (selectedDepartment !== 'All' && c.department !== selectedDepartment) return false;
      if (riskFilter !== 'All' && c.riskClassification !== riskFilter) return false;
      if (!q) return true;
      return (
        c.id.toLowerCase().includes(q) ||
        c.patientId.toLowerCase().includes(q) ||
        c.patientName.toLowerCase().includes(q) ||
        c.predictedCondition.toLowerCase().includes(q)
      );
    });
  }, [diagnosticCases, selectedDepartment, riskFilter, query]);

  const activeCase =
    filteredCases.find((c) => c.id === selectedCase?.id) ?? filteredCases[0] ?? null;

  const riskChartData = useMemo(() => {
    const levels: RiskClassification[] = ['Low', 'Moderate', 'High', 'Critical'];
    const colors: Record<RiskClassification, string> = {
      Low: '#16A34A',
      Moderate: '#0284C7',
      High: '#D97706',
      Critical: '#DC2626',
    };
    return levels.map((lv) => ({
      level: lv,
      cases: diagnosticCases.filter((d) => d.riskClassification === lv).length,
      color: colors[lv],
    }));
  }, [diagnosticCases]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Predictive Diagnostics Intelligence
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Simulated early warning scoring, risk stratification, and clinical trend monitoring across {diagnosticCases.length} diagnostic profiles.
          </p>
        </div>
      </div>

      <DisclaimerBanner
        tone="clinical"
        title="Simulated Predictive Modelling Notice"
        message="Risk classifications and early warning scores are illustrative simulated outputs for product demonstration. They do not represent clinically validated diagnostic results."
      />

      {/* Top Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <ChartCard
          title="Diagnostic Risk Stratification"
          subtitle="Case distribution by simulated acuity classification"
          className="lg:col-span-5"
        >
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskChartData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.6} />
                <XAxis dataKey="level" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="cases" name="Diagnostic Cases" radius={[4, 4, 0, 0]} barSize={36}>
                  {riskChartData.map((entry) => (
                    <Cell key={entry.level} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title={
            activeCase
              ? `14-Day Clinical Risk Trajectory — ${activeCase.patientName} (${activeCase.patientId})`
              : '14-Day Clinical Risk Trajectory'
          }
          subtitle="Simulated composite risk index vs departmental baseline threshold (35)"
          className="lg:col-span-7"
        >
          {activeCase ? (
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={activeCase.trendSeries}
                  margin={{ top: 8, right: 16, left: -16, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.6} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748B' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748B' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                  <Line
                    type="monotone"
                    dataKey="riskIndex"
                    name="Simulated Risk Index"
                    stroke="#0284C7"
                    strokeWidth={2.5}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="baseline"
                    name="Nominal Baseline"
                    stroke="#94A3B8"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-52 flex items-center justify-center text-xs text-slate-500">
              Select a diagnostic case below to view its trajectory.
            </div>
          )}
        </ChartCard>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800/80">
          {(['All', 'Critical', 'High', 'Moderate', 'Low'] as const).map((lv) => (
            <button
              key={lv}
              type="button"
              onClick={() => setRiskFilter(lv)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                riskFilter === lv
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {lv}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by DX ID, patient, condition..."
            aria-label="Filter predictive diagnostic cases"
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Table + Detail Split */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        <div className="xl:col-span-8 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400">
                  <th className="py-3 px-4 font-semibold">Case / Patient</th>
                  <th className="py-3 px-3 font-semibold">Age</th>
                  <th className="py-3 px-3 font-semibold">Department</th>
                  <th className="py-3 px-3 font-semibold">Early Warning</th>
                  <th className="py-3 px-3 font-semibold">Risk Level</th>
                  <th className="py-3 px-3 font-semibold">Last Exam</th>
                  <th className="py-3 px-4 font-semibold">Review Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredCases.map((c) => {
                  const isSelected = activeCase?.id === c.id;
                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedCase(c)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-sky-50/70 dark:bg-sky-950/30'
                          : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-mono font-semibold text-sky-700 dark:text-sky-400">
                          {c.patientId} · {c.id}
                        </div>
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          {c.patientName}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                        {c.age}
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{c.department}</td>
                      <td className="py-3 px-3 font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
                        EWS {c.earlyWarningScore}/9
                      </td>
                      <td className="py-3 px-3">
                        <StatusLabel label={c.riskClassification} />
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500 dark:text-slate-400">
                        {c.lastExamination}
                      </td>
                      <td className="py-3 px-4">
                        <StatusLabel label={c.reviewStatus} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="xl:col-span-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
          {activeCase ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-sky-700 dark:text-sky-400">
                  {activeCase.id}
                </span>
                <StatusLabel label={activeCase.riskClassification} />
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => openPatientDetail(activeCase.patientId)}
                  className="font-display text-base font-bold text-slate-900 dark:text-slate-50 hover:text-sky-600 text-left"
                >
                  {activeCase.patientName} ({activeCase.patientId})
                </button>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {activeCase.age} yrs · {activeCase.department} · Exam {activeCase.lastExamination}
                </div>
              </div>

              <div className="text-xs space-y-1">
                <div className="font-semibold text-slate-800 dark:text-slate-200">Medical History</div>
                <p className="text-slate-600 dark:text-slate-400">{activeCase.medicalHistory}</p>
              </div>

              <div className="text-xs space-y-1.5">
                <div className="font-semibold text-slate-800 dark:text-slate-200">
                  Relevant Clinical Indicators
                </div>
                <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                  {activeCase.clinicalIndicators.map((ind) => (
                    <li key={ind} className="font-mono text-[11px]">
                      • {ind}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3 text-xs space-y-1">
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  AI-Assisted Assessment (Simulated · {activeCase.confidenceIndex}% Index)
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeCase.aiSummary}
                </p>
                <p className="text-sky-700 dark:text-sky-400 font-medium pt-1">
                  {activeCase.recommendedAssessment}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => updateDiagnosticReview(activeCase.id, 'Reviewed')}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 py-2 text-xs font-semibold text-white"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Mark Reviewed
                </button>
                <button
                  type="button"
                  onClick={() => updateDiagnosticReview(activeCase.id, 'Escalated')}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 py-2 text-xs font-semibold"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Escalate Case
                </button>
              </div>
            </div>
          ) : (
            <div className="text-xs text-slate-500 text-center py-8">No diagnostic cases found.</div>
          )}
        </aside>
      </div>
    </div>
  );
};

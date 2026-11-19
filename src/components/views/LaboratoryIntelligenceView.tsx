import React, { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Check, Download, Search } from 'lucide-react';
import { useHealthcare } from '../../context/HealthcareContext';
import { LAB_VOLUME_DATA } from '../../data/healthcareData';
import type { LabReport } from '../../types/healthcare';
import { downloadCsvFile } from '../../utils/exportCsv';
import { ChartCard } from '../ui/ChartCard';
import { KpiCard } from '../ui/KpiCard';
import { StatusLabel } from '../ui/StatusLabel';

export const LaboratoryIntelligenceView: React.FC = () => {
  const { labReports, acknowledgeLabReport, openPatientDetail, selectedDepartment } = useHealthcare();
  const [flagFilter, setFlagFilter] = useState<'All' | LabReport['flag']>('All');
  const [query, setQuery] = useState('');

  const filteredLabs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return labReports.filter((l) => {
      if (selectedDepartment !== 'All' && l.department !== selectedDepartment) return false;
      if (flagFilter !== 'All' && l.flag !== flagFilter) return false;
      if (!q) return true;
      return (
        l.id.toLowerCase().includes(q) ||
        l.patientId.toLowerCase().includes(q) ||
        l.patientName.toLowerCase().includes(q) ||
        l.testName.toLowerCase().includes(q)
      );
    });
  }, [labReports, selectedDepartment, flagFilter, query]);

  const labKpis = [
    {
      label: 'Tests Processed',
      value: '8,450',
      prevValue: '7,910',
      changePct: '+6.8%',
      trend: 'up' as const,
      positiveIsGood: true,
      tooltip: 'Total diagnostic pathology & biochemistry panels processed this week.',
      sparkline: [720, 745, 770, 790, 815, 830, 845],
      color: '#0284C7',
    },
    {
      label: 'Pending Reports',
      value: '284',
      prevValue: '312',
      changePct: '-9.0%',
      trend: 'down' as const,
      positiveIsGood: true,
      tooltip: 'Investigations currently in analyser queue or awaiting verification.',
      sparkline: [330, 320, 315, 305, 298, 290, 284],
      color: '#D97706',
    },
    {
      label: 'Completed Reports',
      value: '8,166',
      prevValue: '7,598',
      changePct: '+7.5%',
      trend: 'up' as const,
      positiveIsGood: true,
      tooltip: 'Verified and released diagnostic reports across LIS integration.',
      sparkline: [690, 715, 738, 760, 782, 801, 816],
      color: '#16A34A',
    },
    {
      label: 'Average Turnaround Time',
      value: '3.4 hrs',
      prevValue: '3.7 hrs',
      changePct: '-8.1%',
      trend: 'down' as const,
      positiveIsGood: true,
      tooltip: 'Mean sample-collection to verified report release duration.',
      sparkline: [3.9, 3.8, 3.7, 3.6, 3.5, 3.45, 3.4],
      color: '#0D9488',
    },
    {
      label: 'Critical Result Alerts',
      value: '32',
      prevValue: '29',
      changePct: '+10.3%',
      trend: 'up' as const,
      positiveIsGood: false,
      tooltip: 'Flagged panic-threshold laboratory values escalated to attending teams.',
      sparkline: [24, 26, 28, 27, 29, 31, 32],
      color: '#DC2626',
    },
  ];

  const panelDistribution = useMemo(() => {
    const panels = ['Haematology', 'Biochemistry', 'Cardiac Markers', 'Endocrinology'];
    return panels.map((panel) => ({
      panel,
      total: labReports.filter((l) => l.panel === panel).length,
      flagged: labReports.filter(
        (l) => l.panel === panel && (l.flag === 'Critical' || l.flag === 'Abnormal')
      ).length,
    }));
  }, [labReports]);

  const handleExportLabs = () => {
    downloadCsvFile(
      'medisense-lab-reports.csv',
      ['Lab ID', 'Patient ID', 'Patient Name', 'Test', 'Measured', 'Reference', 'Flag', 'Status', 'TAT (hrs)'],
      filteredLabs.map((l) => [
        l.id,
        l.patientId,
        l.patientName,
        l.testName,
        l.measuredValue,
        l.referenceRange,
        l.flag,
        l.status,
        l.turnaroundHours,
      ])
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Laboratory & Diagnostic Intelligence
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Sample throughput, turnaround performance, abnormal pattern tracking, and critical result alerts.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportLabs}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <Download className="w-3.5 h-3.5" />
          Export Lab CSV
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {labKpis.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <ChartCard
          title="Weekly Lab Volume & Turnaround Time"
          subtitle="Daily tests processed vs average turnaround (hours)"
          className="lg:col-span-7"
        >
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={LAB_VOLUME_DATA} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.6} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis yAxisId="right" orientation="right" domain={[0, 5]} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar yAxisId="left" dataKey="processed" name="Tests Processed" fill="#0284C7" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="tatHours" name="Avg TAT (hrs)" stroke="#D97706" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Panel Anomaly Distribution"
          subtitle="Total vs abnormal/critical findings across test panels"
          className="lg:col-span-5"
        >
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={panelDistribution} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.6} />
                <XAxis dataKey="panel" tick={{ fontSize: 10, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="total" name="Total Panels" fill="#0D9488" radius={[4, 4, 0, 0]} />
                <Bar dataKey="flagged" name="Abnormal / Critical" fill="#DC2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Filters + Lab Reports Table */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800/80">
          {(['All', 'Critical', 'Abnormal', 'Borderline', 'Normal'] as const).map((fl) => (
            <button
              key={fl}
              type="button"
              onClick={() => setFlagFilter(fl)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                flagFilter === fl
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {fl}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by Lab ID, patient, test..."
            aria-label="Filter laboratory reports"
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 pl-8 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4 font-semibold">Report ID</th>
                <th className="py-3 px-3 font-semibold">Patient</th>
                <th className="py-3 px-3 font-semibold">Test & Panel</th>
                <th className="py-3 px-3 font-semibold">Result / Reference</th>
                <th className="py-3 px-3 font-semibold">Flag</th>
                <th className="py-3 px-3 font-semibold">TAT</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-4 text-right font-semibold">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLabs.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-semibold text-sky-700 dark:text-sky-400">
                    {l.id}
                  </td>
                  <td className="py-3 px-3">
                    <button
                      type="button"
                      onClick={() => openPatientDetail(l.patientId)}
                      className="font-medium text-slate-900 dark:text-slate-100 hover:text-sky-600"
                    >
                      {l.patientName}
                    </button>
                    <div className="font-mono text-[11px] text-slate-400">{l.patientId}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-800 dark:text-slate-200">{l.testName}</div>
                    <div className="text-[11px] text-slate-400">{l.panel} · {l.department}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                      {l.measuredValue}
                    </div>
                    <div className="font-mono text-[11px] text-slate-400">Ref: {l.referenceRange}</div>
                  </td>
                  <td className="py-3 px-3">
                    <StatusLabel label={l.flag} />
                  </td>
                  <td className="py-3 px-3 font-mono tabular-nums text-slate-600 dark:text-slate-400">
                    {l.turnaroundHours}h
                  </td>
                  <td className="py-3 px-3">
                    <StatusLabel label={l.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    {l.status !== 'Completed' ? (
                      <button
                        type="button"
                        onClick={() => acknowledgeLabReport(l.id)}
                        className="inline-flex items-center gap-1 rounded bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 text-[11px] font-semibold text-white"
                      >
                        <Check className="w-3 h-3" />
                        Verify
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400">Signed</span>
                    )}
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

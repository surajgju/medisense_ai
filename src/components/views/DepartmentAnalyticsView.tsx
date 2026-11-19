import React, { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useHealthcare } from '../../context/HealthcareContext';
import { CLINICAL_WORKLOAD_DATA, DEPARTMENTS } from '../../data/healthcareData';
import { ChartCard } from '../ui/ChartCard';
import { StatusLabel } from '../ui/StatusLabel';

export const DepartmentAnalyticsView: React.FC = () => {
  const { patients, appointments, diagnosticCases, setActiveRoute } = useHealthcare();

  const departmentMatrix = useMemo(() => {
    return DEPARTMENTS.map((dept, idx) => {
      const deptPatients = patients.filter((p) => p.department === dept);
      const deptApts = appointments.filter((a) => a.department === dept);
      const deptDx = diagnosticCases.filter((d) => d.department === dept);
      const avgRisk =
        deptPatients.length > 0
          ? Math.round(deptPatients.reduce((s, p) => s + p.riskScore, 0) / deptPatients.length)
          : 42;
      const waitMin = 12 + ((idx * 3) % 11);
      const recoveryPct = Number((91.4 + ((idx * 1.1) % 4.5)).toFixed(1));

      return {
        department: dept,
        activeCohort: deptPatients.length,
        appointments: deptApts.length,
        aiCases: deptDx.length,
        avgRisk,
        waitMin,
        recoveryPct,
      };
    });
  }, [patients, appointments, diagnosticCases]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Department Analytics & Flow
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Specialty-wise patient throughput, clinician workload utilisation, wait times, and recovery outcomes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActiveRoute('hospital-capacity')}
          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          View Bed & ICU Capacity
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard
          title="Specialty Workload & Utilisation"
          subtitle="Clinician capacity utilisation (%) vs daily consultations per doctor"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CLINICAL_WORKLOAD_DATA} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.6} />
                <XAxis dataKey="department" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="utilisation" name="Utilisation %" fill="#0284C7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pendingReviews" name="Pending Reviews" fill="#D97706" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Departmental Recovery & Waiting Time Benchmark"
          subtitle="Recovery index (%) across clinical departments"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentMatrix} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.6} />
                <XAxis
                  dataKey="department"
                  tick={{ fontSize: 10, fill: '#64748B' }}
                  tickFormatter={(v: string) => v.slice(0, 6)}
                />
                <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="recoveryPct" name="Recovery Rate %" fill="#16A34A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <ChartCard
        title="Specialty Performance Matrix"
        subtitle="Aggregated synthetic cohort distribution and clinical turnaround indicators"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="py-2.5 px-3 font-semibold">Department</th>
                <th className="py-2.5 px-3 font-semibold text-right">Sample Cohort</th>
                <th className="py-2.5 px-3 font-semibold text-right">Appointments</th>
                <th className="py-2.5 px-3 font-semibold text-right">AI Cases</th>
                <th className="py-2.5 px-3 font-semibold text-right">Mean Risk Score</th>
                <th className="py-2.5 px-3 font-semibold text-right">Avg Wait</th>
                <th className="py-2.5 px-3 font-semibold text-right">Recovery Index</th>
                <th className="py-2.5 px-3 font-semibold text-right">Flow Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {departmentMatrix.map((row) => (
                <tr key={row.department} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100">
                    {row.department}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">{row.activeCohort}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">{row.appointments}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">{row.aiCases}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">{row.avgRisk}/100</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">{row.waitMin} min</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-emerald-700 dark:text-emerald-400 font-semibold">
                    {row.recoveryPct}%
                  </td>
                  <td className="py-3 px-3 text-right">
                    <StatusLabel
                      label={row.waitMin >= 19 ? 'Elevated Load' : 'Optimal'}
                      tone={row.waitMin >= 19 ? 'warning' : 'normal'}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
};

import React, { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Activity, ArrowUpRight, HeartPulse, Thermometer, Wind } from 'lucide-react';
import { useHealthcare } from '../../context/HealthcareContext';
import { VITALS_WAVEFORM_SERIES } from '../../data/healthcareData';
import { ChartCard } from '../ui/ChartCard';
import { DisclaimerBanner } from '../ui/DisclaimerBanner';
import { StatusLabel } from '../ui/StatusLabel';

export const PatientIntelligenceView: React.FC = () => {
  const { patients, selectedDepartment, openPatientDetail, setActiveRoute } = useHealthcare();

  const scopedPatients = useMemo(
    () =>
      selectedDepartment === 'All'
        ? patients
        : patients.filter((p) => p.department === selectedDepartment),
    [patients, selectedDepartment]
  );

  const [focusedPatientId, setFocusedPatientId] = useState<string>('PAT-10284');
  const focusedPatient =
    scopedPatients.find((p) => p.id === focusedPatientId) ?? scopedPatients[0] ?? patients[0];

  const riskBreakdown = useMemo(() => {
    const counts = { Critical: 0, High: 0, Moderate: 0, Low: 0 };
    scopedPatients.forEach((p) => {
      counts[p.riskLevel]++;
    });
    return [
      { level: 'Low', count: counts.Low, color: '#16A34A' },
      { level: 'Moderate', count: counts.Moderate, color: '#0284C7' },
      { level: 'High', count: counts.High, color: '#D97706' },
      { level: 'Critical', count: counts.Critical, color: '#DC2626' },
    ];
  }, [scopedPatients]);

  const organRiskIndicators = [
    { label: 'Cardiovascular Risk', pct: 34, status: 'Moderate', color: 'bg-sky-600' },
    { label: 'Metabolic / Glycaemic Risk', pct: 26, status: 'Low', color: 'bg-emerald-600' },
    { label: 'Respiratory Reserve Risk', pct: 46, status: 'Elevated', color: 'bg-amber-500' },
    { label: 'Renal Function Risk', pct: 22, status: 'Low', color: 'bg-teal-600' },
    { label: 'Readmission Likelihood (30d)', pct: 29, status: 'Moderate', color: 'bg-indigo-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Patient Intelligence & Telemetry
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Longitudinal vitals telemetry, cohort risk distribution, and engagement analytics ({scopedPatients.length} synthetic records in scope).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <label htmlFor="pi-patient-select" className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Active Focus Patient:
          </label>
          <select
            id="pi-patient-select"
            value={focusedPatient.id}
            onChange={(e) => setFocusedPatientId(e.target.value)}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500"
          >
            {scopedPatients.slice(0, 20).map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} · {p.name} ({p.department})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => openPatientDetail(focusedPatient.id)}
            className="inline-flex items-center gap-1 rounded-lg bg-sky-600 hover:bg-sky-700 px-3 py-1.5 text-xs font-semibold text-white whitespace-nowrap"
          >
            Full Profile
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Vitals Overview & Waveform */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <ChartCard
          title={`Vitals Overview — ${focusedPatient.name} (${focusedPatient.id})`}
          subtitle={`${focusedPatient.primaryCondition} · ${focusedPatient.hospital}`}
          action={<StatusLabel label={`${focusedPatient.riskLevel} Risk (${focusedPatient.riskScore}/100)`} />}
          className="lg:col-span-8"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            <div className="rounded-lg border border-slate-200/80 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <HeartPulse className="w-3.5 h-3.5 text-rose-500" />
                Heart Rate
              </div>
              <div className="font-mono text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums mt-1">
                {focusedPatient.vitals.heartRate}{' '}
                <span className="text-xs font-normal text-slate-500">bpm</span>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200/80 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Activity className="w-3.5 h-3.5 text-sky-600" />
                Blood Pressure
              </div>
              <div className="font-mono text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums mt-1">
                {focusedPatient.vitals.bpSystolic}/{focusedPatient.vitals.bpDiastolic}{' '}
                <span className="text-xs font-normal text-slate-500">mmHg</span>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200/80 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Wind className="w-3.5 h-3.5 text-teal-600" />
                Oxygen Level
              </div>
              <div className="font-mono text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums mt-1">
                {focusedPatient.vitals.spo2}%{' '}
                <span className="text-xs font-normal text-slate-500">SpO2</span>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200/80 dark:border-slate-800 p-3 bg-slate-50/50 dark:bg-slate-800/40">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <Thermometer className="w-3.5 h-3.5 text-amber-500" />
                Temperature
              </div>
              <div className="font-mono text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums mt-1">
                {focusedPatient.vitals.temperatureC.toFixed(1)}{' '}
                <span className="text-xs font-normal text-slate-500">°C</span>
              </div>
            </div>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={VITALS_WAVEFORM_SERIES}
                margin={{ top: 8, right: 12, left: -16, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="ecgGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0284C7" stopOpacity={0.22} />
                    <stop offset="100%" stopColor="#0284C7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.6} />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis domain={[40, 150]} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Area
                  type="monotone"
                  dataKey="ecg"
                  name="Simulated Telemetry Index"
                  stroke="#0284C7"
                  strokeWidth={2}
                  fill="url(#ecgGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="bpSys"
                  name="Systolic BP (mmHg)"
                  stroke="#0D9488"
                  strokeWidth={1.75}
                  fillOpacity={0}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Health Risk Stratification"
          subtitle="Composite organ & cohort risk indices (synthetic)"
          action={
            <button
              type="button"
              onClick={() => setActiveRoute('predictive-diagnostics')}
              className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
            >
              Diagnostics
            </button>
          }
          className="lg:col-span-4"
        >
          <div className="space-y-4">
            {organRiskIndicators.map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                    {item.pct}% · {item.status}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
              Cohort Risk Distribution ({scopedPatients.length} Patients)
            </div>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskBreakdown} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <XAxis dataKey="level" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                  <Bar dataKey="count" name="Patients" radius={[4, 4, 0, 0]} barSize={28}>
                    {riskBreakdown.map((r) => (
                      <Cell key={r.level} fill={r.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* High-Priority Monitored Patients Strip */}
      <ChartCard
        title="Priority Monitored Patients"
        subtitle="Click any synthetic patient record to inspect vitals, labs, medications, and timeline"
        action={
          <button
            type="button"
            onClick={() => setActiveRoute('patient-management')}
            className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
          >
            All {patients.length} Patients
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="py-2.5 pr-4 font-semibold">Patient ID</th>
                <th className="py-2.5 pr-4 font-semibold">Name</th>
                <th className="py-2.5 pr-4 font-semibold">Department</th>
                <th className="py-2.5 pr-4 font-semibold">Vitals (BP / HR / SpO2)</th>
                <th className="py-2.5 pr-4 font-semibold">Engagement</th>
                <th className="py-2.5 pr-4 font-semibold">Risk</th>
                <th className="py-2.5 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {scopedPatients
                .slice()
                .sort((a, b) => b.riskScore - a.riskScore)
                .slice(0, 8)
                .map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 pr-4 font-mono font-semibold text-sky-700 dark:text-sky-400">
                      {p.id}
                    </td>
                    <td className="py-2.5 pr-4 font-medium text-slate-900 dark:text-slate-100">
                      {p.name}
                    </td>
                    <td className="py-2.5 pr-4 text-slate-600 dark:text-slate-400">{p.department}</td>
                    <td className="py-2.5 pr-4 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      {p.vitals.bpSystolic}/{p.vitals.bpDiastolic} · {p.vitals.heartRate} bpm · {p.vitals.spo2}%
                    </td>
                    <td className="py-2.5 pr-4 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                      {p.engagementScore}%
                    </td>
                    <td className="py-2.5 pr-4">
                      <StatusLabel label={`${p.riskLevel} (${p.riskScore})`} />
                    </td>
                    <td className="py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => openPatientDetail(p.id)}
                        className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      <DisclaimerBanner
        message="Patient telemetry curves and risk stratification scores are synthetic demonstrations and do not reflect live medical devices."
      />
    </div>
  );
};

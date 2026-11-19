import React, { useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ArrowRight, BrainCircuit, Download, FileSpreadsheet, Stethoscope } from 'lucide-react';
import { useHealthcare } from '../../context/HealthcareContext';
import {
  ADMISSION_TREND_DATA,
  CLINICAL_WORKLOAD_DATA,
  DAILY_OUTPATIENT_DATA,
  DEPARTMENT_DISTRIBUTION_DATA,
  DIAGNOSTIC_DISTRIBUTION_DATA,
  EMERGENCY_AND_RECOVERY_DATA,
  EXECUTIVE_KPI_CARDS,
} from '../../data/healthcareData';
import { downloadCsvFile } from '../../utils/exportCsv';
import { ChartCard } from '../ui/ChartCard';
import { DisclaimerBanner } from '../ui/DisclaimerBanner';
import { HumanBodyVitalsPanel } from '../ui/HumanBodyVitalsPanel';
import { KpiCard } from '../ui/KpiCard';
import { StatusLabel } from '../ui/StatusLabel';

export const ExecutiveOverviewView: React.FC = () => {
  const {
    selectedDepartment,
    selectedDateRange,
    setActiveRoute,
    appointments,
    alerts,
    hospitalCapacity,
    openPatientDetail,
    executions,
    patients,
    imagingCases,
    selectedCdsPatientId,
    setSelectedCdsPatientId,
  } = useHealthcare();

  const filteredAppointments = useMemo(() => {
    const base =
      selectedDepartment === 'All'
        ? appointments
        : appointments.filter((a) => a.department === selectedDepartment);
    return base.slice(0, 5);
  }, [appointments, selectedDepartment]);

  const capacityChartData = useMemo(
    () =>
      hospitalCapacity.map((h) => ({
        name: h.city,
        hospital: h.hospitalName,
        occupancyPct: Math.round((h.occupiedBeds / h.totalBeds) * 1000) / 10,
        occupied: h.occupiedBeds,
        available: h.totalBeds - h.occupiedBeds,
      })),
    [hospitalCapacity]
  );

  const pendingReviewCount = alerts.filter((a) => a.reviewStatus === 'Pending Review').length;

  const handleExportExecutiveCsv = () => {
    downloadCsvFile(
      'medisense-executive-kpis.csv',
      ['Metric', 'Current Value', 'Previous Period', 'Change', 'Window'],
      EXECUTIVE_KPI_CARDS.map((k) => [k.label, k.value, k.prevValue, k.changePct, selectedDateRange])
    );
  };

  return (
    <div className="space-y-6">
      {/* Executive Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Good morning, Dr. Arun Patel
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Intelligent Healthcare. Better Decisions. Better Outcomes. ·{' '}
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {selectedDepartment === 'All' ? 'All Network Specialties' : selectedDepartment}
            </span>{' '}
            · {selectedDateRange}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportExecutiveCsv}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            Export KPI CSV
          </button>
          <button
            type="button"
            onClick={() => setActiveRoute('ai-centre')}
            className="inline-flex items-center gap-2 rounded-lg bg-sky-600 hover:bg-sky-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors whitespace-nowrap"
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            Open AI Intelligence Centre
          </button>
        </div>
      </div>

      {/* Interactive Human Body Vitals Twin */}
      <HumanBodyVitalsPanel
        patients={patients}
        imagingCases={imagingCases}
        selectedPatientId={selectedCdsPatientId}
        onSelectPatient={setSelectedCdsPatientId}
        onInspectPatient={openPatientDetail}
        onOpenImaging={() => setActiveRoute('medical-imaging')}
        onOpenDecisionSupport={(patientId) => {
          setSelectedCdsPatientId(patientId);
          setActiveRoute('clinical-decision-support');
        }}
      />

      {/* AI Clinical Summary Brief */}
      <section
        aria-label="AI Clinical Summary"
        className="rounded-xl border border-sky-200/80 dark:border-sky-900/60 bg-white dark:bg-slate-900 p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 font-semibold text-sky-700 dark:text-sky-400">
                <BrainCircuit className="w-4 h-4" aria-hidden="true" />
                AI Clinical & Operational Summary
              </span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-slate-500 dark:text-slate-400">
                Simulated Intelligence Brief (Not a clinically validated diagnosis)
              </span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              Patient admission activity increased by <strong className="font-semibold text-slate-900 dark:text-white tabular-nums">8.4%</strong> this week. The cardiology department has experienced increased patient volume. Twelve cases have been flagged for additional clinical review based on simulated risk indicators. Emergency department waiting time has increased by <strong className="font-semibold text-amber-700 dark:text-amber-400 tabular-nums">11%</strong>.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Pending Insights</div>
              <div className="font-mono text-lg font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                {pendingReviewCount} alerts
              </div>
            </div>
            <button
              type="button"
              onClick={() => setActiveRoute('ai-centre')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/50 px-3.5 py-2 text-xs font-semibold text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-colors whitespace-nowrap"
            >
              Review Insights
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 10 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {EXECUTIVE_KPI_CARDS.map((card) => (
          <KpiCard
            key={card.id}
            {...card}
            onClick={
              card.id === 'kpi-critical-alerts'
                ? () => setActiveRoute('ai-centre')
                : card.id === 'kpi-ai-cases'
                ? () => setActiveRoute('predictive-diagnostics')
                : card.id === 'kpi-bed-occupancy' || card.id === 'kpi-avail-beds'
                ? () => setActiveRoute('hospital-capacity')
                : card.id === 'kpi-total-patients' || card.id === 'kpi-active-patients'
                ? () => setActiveRoute('patient-management')
                : undefined
            }
          />
        ))}
      </div>

      {/* Primary Charts Row 1: Admissions + Department Distribution + Upcoming Appointments */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <ChartCard
          title="Patient Admission & Outpatient Trends"
          subtitle="6-month inpatient admissions, discharges, and outpatient volume"
          className="xl:col-span-5"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={ADMISSION_TREND_DATA} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.6} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="admissions"
                  name="Admissions"
                  fill="#0284C7"
                  fillOpacity={0.14}
                  stroke="#0284C7"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="discharges"
                  name="Discharges"
                  stroke="#0D9488"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Bar
                  yAxisId="right"
                  dataKey="outpatient"
                  name="Outpatient (Day)"
                  fill="#CBD5E1"
                  radius={[4, 4, 0, 0]}
                  barSize={16}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Department-wise Patient Distribution"
          subtitle="Active cohort share across specialty centres"
          className="xl:col-span-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-3 h-64">
            <div className="relative h-52">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={DEPARTMENT_DISTRIBUTION_DATA}
                    dataKey="patients"
                    nameKey="name"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={2}
                  >
                    {DEPARTMENT_DISTRIBUTION_DATA.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => (val !== undefined ? Number(val).toLocaleString() : '')}
                    contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="font-display text-lg font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                  48,920
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Total Cohort
                </span>
              </div>
            </div>

            <ul className="space-y-2 text-xs">
              {DEPARTMENT_DISTRIBUTION_DATA.map((d) => (
                <li key={d.name} className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ backgroundColor: d.color }}
                      aria-hidden="true"
                    />
                    <span className="truncate">{d.name}</span>
                  </span>
                  <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                    {d.share}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </ChartCard>

        <ChartCard
          title="Upcoming Appointments"
          subtitle="Next scheduled clinical & virtual encounters"
          action={
            <button
              type="button"
              onClick={() => setActiveRoute('appointments')}
              className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
            >
              View all
            </button>
          }
          className="xl:col-span-3"
        >
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredAppointments.map((apt) => (
              <div key={apt.id} className="py-2.5 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <button
                    type="button"
                    onClick={() => openPatientDetail(apt.patientId)}
                    className="text-xs font-semibold text-slate-900 dark:text-slate-100 hover:text-sky-600 dark:hover:text-sky-400 truncate block text-left"
                  >
                    {apt.patientName}
                  </button>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {apt.department} · {apt.mode}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono text-xs font-medium text-slate-800 dark:text-slate-200 tabular-nums">
                    {apt.scheduledTime}
                  </div>
                  <StatusLabel label={apt.status} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Charts Row 2: Daily Outpatient Visits, Hospital Bed Occupancy, Diagnostic Case Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ChartCard
          title="Daily Outpatient Visits"
          subtitle="In-person vs telemedicine consultations by day"
        >
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DAILY_OUTPATIENT_DATA} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.6} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="visits" name="In-Person" fill="#0284C7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="virtual" name="Telemedicine" fill="#0D9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Hospital Bed Occupancy"
          subtitle="Real-time census across network cities (%)"
          action={
            <button
              type="button"
              onClick={() => setActiveRoute('hospital-capacity')}
              className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
            >
              Capacity
            </button>
          }
        >
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={capacityChartData}
                layout="vertical"
                margin={{ top: 4, right: 16, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.6} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis type="category" dataKey="name" width={78} tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip
                  formatter={(v) => (v !== undefined ? `${v}%` : '')}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="occupancyPct" name="Occupancy %" radius={[0, 4, 4, 0]} barSize={16}>
                  {capacityChartData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={entry.occupancyPct >= 82 ? '#D97706' : '#0284C7'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Diagnostic Case Distribution"
          subtitle="Total AI-processed cases vs flagged reviews (3,842)"
          action={
            <button
              type="button"
              onClick={() => setActiveRoute('predictive-diagnostics')}
              className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
            >
              Diagnostics
            </button>
          }
        >
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={DIAGNOSTIC_DISTRIBUTION_DATA}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.6} />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 10, fill: '#64748B' }}
                  interval={0}
                  tickFormatter={(v: string) => v.split(' ')[0]}
                />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="cases" name="Analysed" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="flagged" name="Flagged" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Charts Row 3: Emergency Trends, Clinical Workload Analytics, Patient Recovery Trends + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ChartCard
          title="Emergency Patient Trends"
          subtitle="Weekly ED volume and mean triage wait time (min)"
        >
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={EMERGENCY_AND_RECOVERY_DATA}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.6} />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis yAxisId="left" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar
                  yAxisId="left"
                  dataKey="emergencyVisits"
                  name="ED Encounters"
                  fill="#0891B2"
                  radius={[4, 4, 0, 0]}
                  barSize={22}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avgWaitMin"
                  name="Wait Time (min)"
                  stroke="#DC2626"
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Clinical Workload Analytics"
          subtitle="Consultations per clinician & utilisation rate (%)"
        >
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={CLINICAL_WORKLOAD_DATA}
                margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.6} />
                <XAxis
                  dataKey="department"
                  tick={{ fontSize: 10, fill: '#64748B' }}
                  tickFormatter={(v: string) => v.slice(0, 6)}
                />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="utilisation" name="Utilisation %" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="consultsPerDoc" name="Consults / Doc" fill="#0D9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Patient Recovery Trends"
          subtitle="30-day clinical recovery & discharge readiness index (%)"
        >
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={EMERGENCY_AND_RECOVERY_DATA}
                margin={{ top: 8, right: 12, left: -16, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.6} />
                <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis domain={[88, 96]} tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip
                  formatter={(v) => (v !== undefined ? `${v}%` : '')}
                  contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                />
                <Line
                  type="monotone"
                  dataKey="recoveryRate"
                  name="Recovery Rate %"
                  stroke="#16A34A"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: '#16A34A' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Bottom Row: Activity Feed & Quick Clinical Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <ChartCard
          title="Recent Clinical & AI Agent Activity"
          subtitle="Latest simulated pipeline runs and triage notifications"
          action={
            <button
              type="button"
              onClick={() => setActiveRoute('agent-execution-history')}
              className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
            >
              Execution log
            </button>
          }
          className="lg:col-span-7"
        >
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {executions.slice(0, 5).map((exe) => (
              <div key={exe.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <div className="font-medium text-slate-900 dark:text-slate-100">
                    {exe.agentName}{' '}
                    <span className="text-slate-400 font-mono font-normal">· {exe.targetEntity}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {exe.outputSummary}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <StatusLabel label={exe.status} />
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5 tabular-nums">
                    {exe.durationMs} ms
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard
          title="Quick Clinical Workflows"
          subtitle="Direct navigation to core MediSense AI modules"
          className="lg:col-span-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setActiveRoute('clinical-decision-support')}
              className="flex items-start gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-3 text-left hover:border-sky-400 hover:bg-sky-50/40 dark:hover:bg-sky-950/20 transition-colors"
            >
              <Stethoscope className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Decision Support
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Inspect PAT-10284 BP workup
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveRoute('medical-imaging')}
              className="flex items-start gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-3 text-left hover:border-sky-400 hover:bg-sky-50/40 dark:hover:bg-sky-950/20 transition-colors"
            >
              <BrainCircuit className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Medical Imaging
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Review X-Ray, CT & MRI cases
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveRoute('laboratory-intelligence')}
              className="flex items-start gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-3 text-left hover:border-sky-400 hover:bg-sky-50/40 dark:hover:bg-sky-950/20 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Lab Critical Alerts
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  32 flagged reports in queue
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveRoute('reports')}
              className="flex items-start gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-3 text-left hover:border-sky-400 hover:bg-sky-50/40 dark:hover:bg-sky-950/20 transition-colors"
            >
              <Download className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Export Reports
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Generate CSV datasets
                </div>
              </div>
            </button>
          </div>
        </ChartCard>
      </div>

      <DisclaimerBanner
        message="All metrics, patient identifiers, and AI clinical summaries displayed in MediSense AI are synthetic demonstration data. This interface is not connected to live hospital EHR systems or clinically validated diagnostic models."
      />
    </div>
  );
};

import React from 'react';
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
import { BedDouble, Clock, HeartPulse, Stethoscope, Users } from 'lucide-react';
import { useHealthcare } from '../../context/HealthcareContext';
import { ChartCard } from '../ui/ChartCard';
import { StatusLabel } from '../ui/StatusLabel';

export const HospitalCapacityView: React.FC = () => {
  const { hospitalCapacity, alerts, setActiveRoute } = useHealthcare();

  const totals = hospitalCapacity.reduce(
    (acc, h) => ({
      totalBeds: acc.totalBeds + h.totalBeds,
      occupiedBeds: acc.occupiedBeds + h.occupiedBeds,
      icuTotal: acc.icuTotal + h.icuTotal,
      icuOccupied: acc.icuOccupied + h.icuOccupied,
      doctors: acc.doctors + h.doctorsOnDuty,
      nurses: acc.nurses + h.nursesAllocated,
      otActive: acc.otActive + h.otActive,
      otScheduled: acc.otScheduled + h.otScheduled,
    }),
    {
      totalBeds: 0,
      occupiedBeds: 0,
      icuTotal: 0,
      icuOccupied: 0,
      doctors: 0,
      nurses: 0,
      otActive: 0,
      otScheduled: 0,
    }
  );

  const bedOccupancyPct = ((totals.occupiedBeds / totals.totalBeds) * 100).toFixed(1);
  const icuOccupancyPct = ((totals.icuOccupied / totals.icuTotal) * 100).toFixed(1);
  const operationalAlerts = alerts.filter(
    (a) => a.category === 'Resource Capacity' || a.category === 'Workload Imbalance'
  );

  const chartData = hospitalCapacity.map((h) => ({
    city: h.city,
    occupiedBeds: h.occupiedBeds,
    availableBeds: h.totalBeds - h.occupiedBeds,
    icuOccupied: h.icuOccupied,
    icuAvailable: h.icuTotal - h.icuOccupied,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Hospital Operations & Capacity Intelligence
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Real-time census, ICU utilisation, ER workload, OT scheduling, and staffing balance across 6 Indian hospitals.
        </p>
      </div>

      {/* Top Operational Summary Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <BedDouble className="w-4 h-4 text-sky-600" />
            Bed Occupancy
          </div>
          <div className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50 tabular-nums mt-1.5">
            {bedOccupancyPct}%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
            {totals.occupiedBeds} / {totals.totalBeds} beds ({totals.totalBeds - totals.occupiedBeds} free)
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <HeartPulse className="w-4 h-4 text-rose-600" />
            ICU Capacity
          </div>
          <div className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50 tabular-nums mt-1.5">
            {icuOccupancyPct}%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 tabular-nums">
            {totals.icuOccupied} / {totals.icuTotal} ICU beds active
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Stethoscope className="w-4 h-4 text-teal-600" />
            Doctors On Duty
          </div>
          <div className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50 tabular-nums mt-1.5">
            {totals.doctors}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Across 10 specialties
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Users className="w-4 h-4 text-indigo-600" />
            Nursing Workforce
          </div>
          <div className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50 tabular-nums mt-1.5">
            {totals.nurses}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Shift ratio 1:1.26 ICU / 1:5 Ward
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Clock className="w-4 h-4 text-amber-600" />
            Operation Theatres
          </div>
          <div className="font-display text-2xl font-bold text-slate-900 dark:text-slate-50 tabular-nums mt-1.5">
            {totals.otActive} / {totals.otScheduled}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Active now vs scheduled today
          </div>
        </div>
      </div>

      {/* Charts + Operational Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <ChartCard
          title="Bed & ICU Capacity by Hospital Hub"
          subtitle="Occupied vs available bed distribution"
          className="lg:col-span-7"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.6} />
                <XAxis dataKey="city" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="occupiedBeds" stackId="beds" name="Occupied Beds" fill="#0284C7" />
                <Bar
                  dataKey="availableBeds"
                  stackId="beds"
                  name="Available Beds"
                  fill="#CBD5E1"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Operational Capacity Alerts"
          subtitle="Simulated bottleneck and resource warnings"
          action={
            <button
              type="button"
              onClick={() => setActiveRoute('ai-centre')}
              className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
            >
              AI Centre
            </button>
          }
          className="lg:col-span-5"
        >
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {operationalAlerts.slice(0, 4).map((al) => (
              <div key={al.id} className="py-3 space-y-1 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <StatusLabel label={al.severity} />
                  <span className="font-mono text-slate-400">{al.detectedAt}</span>
                </div>
                <div className="font-semibold text-slate-900 dark:text-slate-100">{al.title}</div>
                <p className="text-slate-600 dark:text-slate-400">{al.recommendedAction}</p>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Detailed Facility Table */}
      <ChartCard
        title="Hospital Network Resource Matrix"
        subtitle="Facility-level bed census, emergency department waiting time, and surgical schedule"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="py-2.5 px-3 font-semibold">Facility</th>
                <th className="py-2.5 px-3 font-semibold">City</th>
                <th className="py-2.5 px-3 font-semibold text-right">Ward Beds</th>
                <th className="py-2.5 px-3 font-semibold text-right">ICU Beds</th>
                <th className="py-2.5 px-3 font-semibold text-right">ER Wait</th>
                <th className="py-2.5 px-3 font-semibold text-right">ER Load</th>
                <th className="py-2.5 px-3 font-semibold text-right">Doctors / Nurses</th>
                <th className="py-2.5 px-3 font-semibold text-right">OT Active / Sched</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {hospitalCapacity.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-medium text-slate-900 dark:text-slate-100">
                    {h.hospitalName}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{h.city}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-800 dark:text-slate-200">
                    {h.occupiedBeds}/{h.totalBeds} ({Math.round((h.occupiedBeds / h.totalBeds) * 100)}%)
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-800 dark:text-slate-200">
                    {h.icuOccupied}/{h.icuTotal}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums">
                    <StatusLabel
                      label={`${h.erWaitMin} min`}
                      tone={h.erWaitMin >= 20 ? 'warning' : 'normal'}
                    />
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                    {h.erLoadPct}%
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                    {h.doctorsOnDuty} / {h.nursesAllocated}
                  </td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                    {h.otActive} / {h.otScheduled}
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

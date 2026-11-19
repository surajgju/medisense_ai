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
import { CheckCircle2, PhoneCall, Video } from 'lucide-react';
import { useHealthcare } from '../../context/HealthcareContext';
import { TELEMEDICINE_ACTIVITY_DATA } from '../../data/healthcareData';
import { ChartCard } from '../ui/ChartCard';
import { KpiCard } from '../ui/KpiCard';
import { StatusLabel } from '../ui/StatusLabel';

export const TelemedicineView: React.FC = () => {
  const { appointments, updateAppointmentStatus, patients, openPatientDetail } = useHealthcare();

  const teleAppointments = useMemo(
    () => appointments.filter((a) => a.mode === 'Telemedicine'),
    [appointments]
  );

  const remoteMonitored = useMemo(
    () => patients.filter((p) => p.status === 'Tele-Monitored').slice(0, 6),
    [patients]
  );

  const teleKpis = [
    {
      label: 'Virtual Consultations',
      value: '1,842',
      prevValue: '1,620',
      changePct: '+13.7%',
      trend: 'up' as const,
      positiveIsGood: true,
      tooltip: 'Total virtual consultations conducted across MediSense Telehealth hubs.',
      sparkline: [145, 152, 160, 168, 174, 179, 184],
      color: '#0284C7',
    },
    {
      label: 'Completed Consultations',
      value: '1,694',
      prevValue: '1,490',
      changePct: '+13.7%',
      trend: 'up' as const,
      positiveIsGood: true,
      tooltip: 'Successfully concluded video visits with clinical notes logged.',
      sparkline: [130, 138, 144, 151, 158, 164, 169],
      color: '#16A34A',
    },
    {
      label: 'Upcoming Consultations',
      value: '148',
      prevValue: '130',
      changePct: '+13.8%',
      trend: 'up' as const,
      positiveIsGood: true,
      tooltip: 'Queued virtual visits scheduled across specialty rosters.',
      sparkline: [110, 118, 122, 129, 135, 142, 148],
      color: '#0D9488',
    },
    {
      label: 'Average Consultation Time',
      value: '16 min',
      prevValue: '17 min',
      changePct: '-5.9%',
      trend: 'down' as const,
      positiveIsGood: true,
      tooltip: 'Mean video encounter duration aided by AI pre-visit summaries.',
      sparkline: [18, 17.5, 17, 16.8, 16.4, 16.2, 16],
      color: '#4F46E5',
    },
    {
      label: 'Patient Satisfaction',
      value: '96.2%',
      prevValue: '94.9%',
      changePct: '+1.4%',
      trend: 'up' as const,
      positiveIsGood: true,
      tooltip: 'Post-teleconsultation rating across remote care patients.',
      sparkline: [94.1, 94.6, 95.0, 95.4, 95.8, 96.0, 96.2],
      color: '#16A34A',
    },
  ];

  const clinicianRoster = [
    { name: 'Dr. Arun Patel', dept: 'Cardiology', status: 'Active Session', slots: '4 remaining' },
    { name: 'Dr. Nandini Rao', dept: 'Neurology', status: 'Available', slots: '6 remaining' },
    { name: 'Dr. Deepika Verma', dept: 'Endocrinology', status: 'Available', slots: '5 remaining' },
    { name: 'Dr. Siddharth Menon', dept: 'Pulmonology', status: 'Active Session', slots: '2 remaining' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Telemedicine Intelligence
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Virtual consultation management, clinician availability, and remote patient vitals monitoring.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {teleKpis.map((k) => (
          <KpiCard key={k.label} {...k} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <ChartCard
          title="Weekly Virtual Consultation Activity"
          subtitle="Completed vs upcoming video consultations"
          className="lg:col-span-7"
        >
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TELEMEDICINE_ACTIVITY_DATA} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" strokeOpacity={0.6} />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="completed" name="Completed" fill="#0284C7" radius={[4, 4, 0, 0]} />
                <Bar dataKey="upcoming" name="Upcoming" fill="#0D9488" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Telehealth Clinician Roster & Remote Monitoring"
          subtitle="Simulated live availability and home-monitored patients"
          className="lg:col-span-5"
        >
          <div className="space-y-4">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {clinicianRoster.map((doc) => (
                <div key={doc.name} className="py-2 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-slate-100">{doc.name}</div>
                    <div className="text-slate-400">{doc.dept} · {doc.slots}</div>
                  </div>
                  <StatusLabel label={doc.status} />
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-2">
                Remote Patient Monitoring Feed
              </div>
              <div className="space-y-1.5">
                {remoteMonitored.slice(0, 3).map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between text-xs rounded-lg bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5"
                  >
                    <button
                      type="button"
                      onClick={() => openPatientDetail(p.id)}
                      className="font-medium text-slate-900 dark:text-slate-100 hover:text-sky-600"
                    >
                      {p.name} ({p.id})
                    </button>
                    <span className="font-mono tabular-nums text-slate-600 dark:text-slate-300">
                      BP {p.vitals.bpSystolic}/{p.vitals.bpDiastolic} · SpO2 {p.vitals.spo2}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Telemedicine Queue Table */}
      <ChartCard
        title={`Virtual Consultation Queue (${teleAppointments.length} Sessions)`}
        subtitle="Manage video consultation session states"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="py-2.5 px-3 font-semibold">Appointment ID</th>
                <th className="py-2.5 px-3 font-semibold">Patient</th>
                <th className="py-2.5 px-3 font-semibold">Specialist</th>
                <th className="py-2.5 px-3 font-semibold">Department</th>
                <th className="py-2.5 px-3 font-semibold">Schedule</th>
                <th className="py-2.5 px-3 font-semibold">Video Status</th>
                <th className="py-2.5 px-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {teleAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-mono font-semibold text-sky-700 dark:text-sky-400">
                    {apt.id}
                  </td>
                  <td className="py-2.5 px-3">
                    <button
                      type="button"
                      onClick={() => openPatientDetail(apt.patientId)}
                      className="font-medium text-slate-900 dark:text-slate-100 hover:text-sky-600"
                    >
                      {apt.patientName}
                    </button>
                    <span className="font-mono text-slate-400 ml-1.5">({apt.patientId})</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300">{apt.doctorName}</td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{apt.department}</td>
                  <td className="py-2.5 px-3 font-mono tabular-nums text-slate-600 dark:text-slate-400">
                    {apt.dateLabel} · {apt.scheduledTime}
                  </td>
                  <td className="py-2.5 px-3">
                    <StatusLabel label={apt.status} />
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      {apt.status !== 'In Progress' && apt.status !== 'Completed' && (
                        <button
                          type="button"
                          onClick={() => updateAppointmentStatus(apt.id, 'In Progress')}
                          className="inline-flex items-center gap-1 rounded border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 px-2 py-1 text-[11px] font-semibold text-sky-700 dark:text-sky-300 hover:bg-sky-100"
                        >
                          <Video className="w-3 h-3" />
                          Start Call
                        </button>
                      )}
                      {apt.status === 'In Progress' && (
                        <button
                          type="button"
                          onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                          className="inline-flex items-center gap-1 rounded bg-emerald-600 hover:bg-emerald-700 px-2 py-1 text-[11px] font-semibold text-white"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          Complete
                        </button>
                      )}
                      {apt.status === 'Completed' && (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                          <PhoneCall className="w-3 h-3" /> Logged
                        </span>
                      )}
                    </div>
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

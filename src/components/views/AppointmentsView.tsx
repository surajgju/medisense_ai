import React, { useMemo, useState } from 'react';
import { CalendarPlus, Check, X } from 'lucide-react';
import { useHealthcare } from '../../context/HealthcareContext';
import { DEPARTMENTS, DOCTORS_BY_DEPT } from '../../data/healthcareData';
import type { AppointmentRecord, DepartmentName } from '../../types/healthcare';
import { StatusLabel } from '../ui/StatusLabel';

export const AppointmentsView: React.FC = () => {
  const {
    appointments,
    updateAppointmentStatus,
    addAppointment,
    patients,
    selectedDepartment,
    openPatientDetail,
  } = useHealthcare();

  const [statusFilter, setStatusFilter] = useState<'All' | AppointmentRecord['status']>('All');
  const [modeFilter, setModeFilter] = useState<'All' | 'In-Person' | 'Telemedicine'>('All');
  const [showNewModal, setShowNewModal] = useState(false);

  const [patientId, setPatientId] = useState(patients[0].id);
  const [dept, setDept] = useState<DepartmentName>('Cardiology');
  const [mode, setMode] = useState<'In-Person' | 'Telemedicine'>('In-Person');
  const [time, setTime] = useState('11:30');
  const [reason, setReason] = useState('Cardiology Follow-up');

  const filtered = useMemo(() => {
    return appointments.filter((a) => {
      if (selectedDepartment !== 'All' && a.department !== selectedDepartment) return false;
      if (statusFilter !== 'All' && a.status !== statusFilter) return false;
      if (modeFilter !== 'All' && a.mode !== modeFilter) return false;
      return true;
    });
  }, [appointments, selectedDepartment, statusFilter, modeFilter]);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === patientId) ?? patients[0];
    const nextApt: AppointmentRecord = {
      id: `APT-${4401 + appointments.length + 1}`,
      patientId: patient.id,
      patientName: patient.name,
      department: dept,
      doctorName: DOCTORS_BY_DEPT[dept][0],
      hospital: patient.hospital,
      scheduledTime: time,
      dateLabel: '2026-11-19',
      mode,
      reason: reason.trim() || `${dept} Consultation`,
      status: 'Confirmed',
      durationMin: mode === 'Telemedicine' ? 15 : 20,
    };
    addAppointment(nextApt);
    setShowNewModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Appointments & Clinical Scheduling
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {appointments.length} scheduled outpatient and virtual consultations across the hospital network.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 px-4 py-2 text-xs font-semibold text-white whitespace-nowrap"
        >
          <CalendarPlus className="w-3.5 h-3.5" />
          Schedule Appointment
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800/80">
          {(['All', 'Scheduled', 'Confirmed', 'In Progress', 'Completed', 'Missed'] as const).map(
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

        <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800/80">
          {(['All', 'In-Person', 'Telemedicine'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setModeFilter(m)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                modeFilter === m
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4 font-semibold">Appointment ID</th>
                <th className="py-3 px-3 font-semibold">Patient</th>
                <th className="py-3 px-3 font-semibold">Department & Doctor</th>
                <th className="py-3 px-3 font-semibold">Date & Time</th>
                <th className="py-3 px-3 font-semibold">Mode</th>
                <th className="py-3 px-3 font-semibold">Reason</th>
                <th className="py-3 px-3 font-semibold">Status</th>
                <th className="py-3 px-4 text-right font-semibold">Workflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-semibold text-sky-700 dark:text-sky-400">
                    {a.id}
                  </td>
                  <td className="py-3 px-3">
                    <button
                      type="button"
                      onClick={() => openPatientDetail(a.patientId)}
                      className="font-medium text-slate-900 dark:text-slate-100 hover:text-sky-600 text-left"
                    >
                      {a.patientName}
                    </button>
                    <div className="font-mono text-[11px] text-slate-400">{a.patientId}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-800 dark:text-slate-200">{a.department}</div>
                    <div className="text-[11px] text-slate-400">{a.doctorName}</div>
                  </td>
                  <td className="py-3 px-3 font-mono tabular-nums text-slate-700 dark:text-slate-300">
                    {a.dateLabel} · {a.scheduledTime}
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{a.mode}</td>
                  <td className="py-3 px-3 max-w-[180px] truncate text-slate-600 dark:text-slate-400">
                    {a.reason}
                  </td>
                  <td className="py-3 px-3">
                    <StatusLabel label={a.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      {a.status === 'Scheduled' && (
                        <button
                          type="button"
                          onClick={() => updateAppointmentStatus(a.id, 'Confirmed')}
                          className="rounded border border-slate-200 dark:border-slate-700 px-2 py-1 text-[11px] font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          Confirm
                        </button>
                      )}
                      {(a.status === 'Confirmed' || a.status === 'In Progress') && (
                        <button
                          type="button"
                          onClick={() => updateAppointmentStatus(a.id, 'Completed')}
                          className="inline-flex items-center gap-1 rounded bg-emerald-600 hover:bg-emerald-700 px-2 py-1 text-[11px] font-semibold text-white"
                        >
                          <Check className="w-3 h-3" />
                          Complete
                        </button>
                      )}
                      {a.status !== 'Completed' && a.status !== 'Cancelled' && (
                        <button
                          type="button"
                          onClick={() => updateAppointmentStatus(a.id, 'Cancelled')}
                          className="rounded border border-rose-200 dark:border-rose-800 px-2 py-1 text-[11px] font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                        >
                          Cancel
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

      {showNewModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Schedule Synthetic Appointment"
        >
          <div
            className="fixed inset-0 bg-slate-950/45"
            onClick={() => setShowNewModal(false)}
            aria-hidden="true"
          />
          <form
            onSubmit={handleBook}
            className="relative z-10 w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display text-base font-bold text-slate-900 dark:text-slate-50">
                Schedule New Consultation
              </h2>
              <button type="button" onClick={() => setShowNewModal(false)} aria-label="Close modal">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <label className="block space-y-1">
              <span className="font-medium text-slate-700 dark:text-slate-300">Patient</span>
              <select
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
              >
                {patients.slice(0, 25).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id} · {p.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block space-y-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">Department</span>
                <select
                  value={dept}
                  onChange={(e) => setDept(e.target.value as DepartmentName)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">Mode</span>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as 'In-Person' | 'Telemedicine')}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
                >
                  <option value="In-Person">In-Person</option>
                  <option value="Telemedicine">Telemedicine</option>
                </select>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block space-y-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">Time (IST)</span>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
                />
              </label>
              <label className="block space-y-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">Reason</span>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
                />
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2 font-semibold text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-sky-600 hover:bg-sky-700 px-4 py-2 font-semibold text-white"
              >
                Confirm Slot
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

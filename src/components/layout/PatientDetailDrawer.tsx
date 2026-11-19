import React from 'react';
import {
  Activity,
  Calendar,
  FileText,
  FlaskConical,
  Pill,
  ShieldAlert,
  Stethoscope,
  X,
} from 'lucide-react';
import { useHealthcare } from '../../context/HealthcareContext';
import { StatusLabel } from '../ui/StatusLabel';

export const PatientDetailDrawer: React.FC = () => {
  const {
    inspectedPatientId,
    closePatientDetail,
    patients,
    labReports,
    appointments,
    setSelectedCdsPatientId,
    setActiveRoute,
  } = useHealthcare();

  if (!inspectedPatientId) return null;

  const patient = patients.find((p) => p.id === inspectedPatientId);
  if (!patient) return null;

  const patientLabs = labReports.filter((l) => l.patientId === patient.id);
  const patientAppointments = appointments.filter((a) => a.patientId === patient.id);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={`Patient Profile for ${patient.name}`}
    >
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-[1px]"
        onClick={closePatientDetail}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-slate-900 h-full overflow-y-auto shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-6 py-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-mono font-semibold text-sky-700 dark:text-sky-400">
                {patient.id}
              </span>
              <span aria-hidden="true">·</span>
              <span>{patient.department}</span>
              <span aria-hidden="true">·</span>
              <span>{patient.city}</span>
            </div>
            <h2 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50 mt-0.5">
              {patient.name}
            </h2>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {patient.age} yrs · {patient.gender} · Blood Group {patient.bloodGroup} · {patient.hospital}
            </div>
          </div>

          <button
            type="button"
            onClick={closePatientDetail}
            aria-label="Close patient profile"
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 py-3">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400">Risk Stratification: </span>
                <StatusLabel label={`${patient.riskLevel} (${patient.riskScore}/100)`} />
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Care Status: </span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {patient.status}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Clinician: </span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {patient.attendingDoctor}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedCdsPatientId(patient.id);
                closePatientDetail();
                setActiveRoute('clinical-decision-support');
              }}
              className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 px-3 py-1.5 text-xs font-semibold text-white transition-colors whitespace-nowrap"
            >
              <Stethoscope className="w-3.5 h-3.5" />
              Open in Decision Support
            </button>
          </div>

          {/* Vitals Grid */}
          <div>
            <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2.5 flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-600" />
              Latest Recorded Vitals
              <span className="text-xs font-normal text-slate-400 font-mono">
                ({patient.vitals.recordedAt})
              </span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Blood Pressure</div>
                <div className="font-mono text-base font-semibold text-slate-900 dark:text-slate-100 tabular-nums mt-0.5">
                  {patient.vitals.bpSystolic}/{patient.vitals.bpDiastolic}
                </div>
                <div className="text-[11px] text-slate-400">mmHg</div>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Heart Rate</div>
                <div className="font-mono text-base font-semibold text-slate-900 dark:text-slate-100 tabular-nums mt-0.5">
                  {patient.vitals.heartRate} bpm
                </div>
                <div className="text-[11px] text-slate-400">Resting</div>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Oxygen (SpO2)</div>
                <div className="font-mono text-base font-semibold text-slate-900 dark:text-slate-100 tabular-nums mt-0.5">
                  {patient.vitals.spo2}%
                </div>
                <div className="text-[11px] text-slate-400">Room Air</div>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3">
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Temperature</div>
                <div className="font-mono text-base font-semibold text-slate-900 dark:text-slate-100 tabular-nums mt-0.5">
                  {patient.vitals.temperatureC.toFixed(1)} °C
                </div>
                <div className="text-[11px] text-slate-400">RR {patient.vitals.respiratoryRate}/min</div>
              </div>
            </div>
          </div>

          {/* Clinical History, Medications, Allergies */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-slate-100">
                <FileText className="w-4 h-4 text-teal-600" />
                Primary Concern & History
              </div>
              <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
                {patient.primaryCondition}
              </p>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                {patient.medicalHistory.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-slate-100">
                <Pill className="w-4 h-4 text-sky-600" />
                Active Medications & Allergies
              </div>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                {patient.medications.map((m) => (
                  <li key={m} className="font-mono text-[11px]">
                    • {m}
                  </li>
                ))}
              </ul>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Allergies: {patient.allergies.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Linked Lab Results */}
          <div>
            <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-indigo-600" />
              Linked Laboratory Results ({patientLabs.length})
            </h3>
            {patientLabs.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                No recent diagnostic laboratory panels in this demonstration cohort for {patient.id}.
              </p>
            ) : (
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                {patientLabs.map((lab) => (
                  <div key={lab.id} className="flex items-center justify-between px-3.5 py-2.5 text-xs">
                    <div>
                      <div className="font-medium text-slate-900 dark:text-slate-100">
                        {lab.testName}
                      </div>
                      <div className="text-slate-400 font-mono text-[11px]">
                        {lab.id} · Ref: {lab.referenceRange}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                        {lab.measuredValue}
                      </div>
                      <StatusLabel label={lab.flag} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming / Recent Appointments */}
          <div>
            <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              Follow-Up & Scheduled Encounters
            </h3>
            <div className="text-xs text-slate-600 dark:text-slate-300 mb-2">
              Next Scheduled Follow-Up: <span className="font-mono font-semibold">{patient.nextFollowUp}</span> · Engagement Index:{' '}
              <span className="font-mono font-semibold">{patient.engagementScore}%</span>
            </div>
            {patientAppointments.length > 0 && (
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800">
                {patientAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between px-3.5 py-2 text-xs">
                    <div>
                      <span className="font-mono text-sky-700 dark:text-sky-400 mr-2">{apt.id}</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">{apt.reason}</span>
                      <span className="text-slate-400 ml-2">
                        · {apt.dateLabel} {apt.scheduledTime} ({apt.mode})
                      </span>
                    </div>
                    <StatusLabel label={apt.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Clinical Interaction Timeline */}
          <div>
            <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
              Clinical Interaction Timeline
            </h3>
            <ol className="space-y-3 border-l border-slate-200 dark:border-slate-800 ml-2 pl-4">
              {patient.timeline.map((ev) => (
                <li key={ev.id} className="relative text-xs">
                  <div className="flex flex-wrap items-center gap-2 text-slate-500 dark:text-slate-400">
                    <span className="font-mono text-[11px]">{ev.date}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-semibold text-sky-700 dark:text-sky-400">{ev.type}</span>
                    <span aria-hidden="true">·</span>
                    <span>{ev.clinician}</span>
                  </div>
                  <div className="font-medium text-slate-900 dark:text-slate-100 mt-0.5">
                    {ev.title}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mt-0.5 leading-relaxed">
                    {ev.notes}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

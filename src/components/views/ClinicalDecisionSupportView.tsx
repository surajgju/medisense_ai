import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, CheckSquare, ClipboardCopy, Pill, ShieldAlert, Stethoscope } from 'lucide-react';
import { useHealthcare } from '../../context/HealthcareContext';
import { MEDICATION_INTERACTIONS } from '../../data/healthcareData';
import { evaluateVitalsForDecisionSupport } from '../../utils/clinicalLogic';
import { DisclaimerBanner } from '../ui/DisclaimerBanner';
import { StatusLabel } from '../ui/StatusLabel';

export const ClinicalDecisionSupportView: React.FC = () => {
  const { patients, selectedCdsPatientId, setSelectedCdsPatientId, openPatientDetail } =
    useHealthcare();

  const activePatient = useMemo(
    () => patients.find((p) => p.id === selectedCdsPatientId) ?? patients[0],
    [patients, selectedCdsPatientId]
  );

  const [bpSys, setBpSys] = useState(activePatient.vitals.bpSystolic);
  const [bpDia, setBpDia] = useState(activePatient.vitals.bpDiastolic);
  const [hr, setHr] = useState(activePatient.vitals.heartRate);
  const [spo2, setSpo2] = useState(activePatient.vitals.spo2);
  const [concern, setConcern] = useState(
    activePatient.id === 'PAT-10284' ? 'Elevated blood pressure' : activePatient.primaryCondition
  );
  const [checkedPathways, setCheckedPathways] = useState<Record<number, boolean>>({ 0: true });
  const [copiedNote, setCopiedNote] = useState(false);

  useEffect(() => {
    setBpSys(activePatient.vitals.bpSystolic);
    setBpDia(activePatient.vitals.bpDiastolic);
    setHr(activePatient.vitals.heartRate);
    setSpo2(activePatient.vitals.spo2);
    setConcern(
      activePatient.id === 'PAT-10284' ? 'Elevated blood pressure' : activePatient.primaryCondition
    );
    setCheckedPathways({ 0: true });
  }, [activePatient]);

  const evaluation = useMemo(
    () =>
      evaluateVitalsForDecisionSupport(
        {
          ...activePatient.vitals,
          bpSystolic: bpSys,
          bpDiastolic: bpDia,
          heartRate: hr,
          spo2,
        },
        concern,
        activePatient.medicalHistory
      ),
    [activePatient, bpSys, bpDia, hr, spo2, concern]
  );

  const draftSoapNote = `DECISION SUPPORT DRAFT (CLINICIAN VERIFICATION REQUIRED)
Patient: ${activePatient.id} (${activePatient.name}, ${activePatient.age}y ${activePatient.gender})
Department: ${activePatient.department} | Presenting Concern: ${concern}
Vitals: BP ${bpSys}/${bpDia} mmHg | HR ${hr} bpm | SpO2 ${spo2}% | Temp ${activePatient.vitals.temperatureC.toFixed(1)} C
History: ${activePatient.medicalHistory.join(', ')}
AI-Flagged Considerations: ${evaluation.concerns.join(' ')}
Suggested Next Assessments: ${evaluation.suggestedAssessments.join(' ')}`;

  const handleCopyDraft = () => {
    navigator.clipboard?.writeText(draftSoapNote);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            AI Clinical Decision Support
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Clinical guideline assistance, vital indicator evaluation, drug-interaction alerts, and structured documentation drafting.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <label htmlFor="cds-patient-select" className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Illustrative Case:
          </label>
          <select
            id="cds-patient-select"
            value={activePatient.id}
            onChange={(e) => setSelectedCdsPatientId(e.target.value)}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:border-sky-500"
          >
            {Array.from(
              new Map(
                [
                  ...patients.filter((p) => p.id === 'PAT-10284' || p.id === activePatient.id),
                  ...patients.filter((p) => p.riskScore >= 45),
                ]
                  .slice(0, 22)
                  .map((p) => [p.id, p])
              ).values()
            ).map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} · {p.name} ({p.department})
              </option>
            ))}
          </select>
        </div>
      </div>

      <DisclaimerBanner
        tone="clinical"
        title="Clinical Decision Support Boundary"
        message="All AI outputs below are simulated clinical decision support aids — NOT a substitute for qualified clinician judgement, medical diagnosis, or treatment prescription."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Case Context & Interactive Vital Simulator */}
        <div className="lg:col-span-5 space-y-5">
          <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-xs font-mono font-semibold text-sky-700 dark:text-sky-400">
                  {activePatient.id} · {activePatient.department}
                </div>
                <button
                  type="button"
                  onClick={() => openPatientDetail(activePatient.id)}
                  className="font-display text-lg font-bold text-slate-900 dark:text-slate-50 hover:text-sky-600 text-left mt-0.5"
                >
                  {activePatient.name}
                </button>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {activePatient.age} yrs · {activePatient.gender} · {activePatient.hospital}
                </div>
              </div>
              <StatusLabel label={`${evaluation.overallAcuity} Acuity`} />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="cds-concern-input"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Presenting Concern
              </label>
              <input
                id="cds-concern-input"
                type="text"
                value={concern}
                onChange={(e) => setConcern(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Clinical Indicators (Editable for Simulation)
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs space-y-1">
                  <span className="text-slate-500 dark:text-slate-400">Systolic BP (mmHg)</span>
                  <input
                    type="number"
                    value={bpSys}
                    onChange={(e) => setBpSys(Number(e.target.value) || 120)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 font-mono text-sm font-semibold text-slate-900 dark:text-slate-100"
                  />
                </label>
                <label className="text-xs space-y-1">
                  <span className="text-slate-500 dark:text-slate-400">Diastolic BP (mmHg)</span>
                  <input
                    type="number"
                    value={bpDia}
                    onChange={(e) => setBpDia(Number(e.target.value) || 80)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 font-mono text-sm font-semibold text-slate-900 dark:text-slate-100"
                  />
                </label>
                <label className="text-xs space-y-1">
                  <span className="text-slate-500 dark:text-slate-400">Heart Rate (bpm)</span>
                  <input
                    type="number"
                    value={hr}
                    onChange={(e) => setHr(Number(e.target.value) || 72)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 font-mono text-sm font-semibold text-slate-900 dark:text-slate-100"
                  />
                </label>
                <label className="text-xs space-y-1">
                  <span className="text-slate-500 dark:text-slate-400">Oxygen Saturation (%)</span>
                  <input
                    type="number"
                    min={70}
                    max={100}
                    value={spo2}
                    onChange={(e) => setSpo2(Number(e.target.value) || 97)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 font-mono text-sm font-semibold text-slate-900 dark:text-slate-100"
                  />
                </label>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs space-y-2">
              <div className="font-semibold text-slate-800 dark:text-slate-200">
                Patient History & Active Medications
              </div>
              <div className="text-slate-600 dark:text-slate-400">
                History: {activePatient.medicalHistory.join(' · ')}
              </div>
              <div className="text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                Meds: {activePatient.medications.join(' | ')}
              </div>
            </div>
          </section>

          {/* Medication Interaction Alerts */}
          <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-display font-semibold text-slate-900 dark:text-slate-100">
              <Pill className="w-4 h-4 text-amber-600" />
              Medication Interaction Reference Alerts
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {MEDICATION_INTERACTIONS.map((inter) => (
                <div key={inter.pair} className="py-2.5 text-xs space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {inter.pair}
                    </span>
                    <StatusLabel label={inter.severity} />
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">{inter.clinicalNote}</p>
                  <p className="text-sky-700 dark:text-sky-400">{inter.suggestedMonitoring}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right: AI Decision Support Output */}
        <div className="lg:col-span-7 space-y-5">
          <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-sky-600" />
                <h2 className="font-display text-base font-bold text-slate-900 dark:text-slate-100">
                  Simulated AI Clinical Decision Support Analysis
                </h2>
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Advisory Output Only
              </span>
            </div>

            {/* Relevant Clinical Indicators */}
            <div>
              <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                1. Identified Clinical Indicators
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {evaluation.indicators.map((ind) => (
                  <div
                    key={ind.label}
                    className="rounded-lg border border-slate-200/80 dark:border-slate-800 p-3 flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{ind.label}</div>
                      <div className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                        {ind.value}
                      </div>
                      <div className="text-[11px] text-slate-400">Ref: {ind.reference}</div>
                    </div>
                    <StatusLabel label={ind.status} />
                  </div>
                ))}
              </div>
            </div>

            {/* Patient History Summary */}
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-4 text-xs space-y-1.5">
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                2. Summarised Patient History
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {activePatient.name} ({activePatient.id}) is a {activePatient.age}-year-old{' '}
                {activePatient.gender.toLowerCase()} managed under {activePatient.department} with{' '}
                {activePatient.medicalHistory.join(', ')}. Currently prescribed{' '}
                {activePatient.medications.join(', ')}. Presenting today with {concern} (BP{' '}
                {bpSys}/{bpDia} mmHg, HR {hr} bpm, SpO2 {spo2}%).
              </p>
            </div>

            {/* Potential Concerns */}
            <div className="space-y-2 text-xs">
              <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                3. Highlighted Potential Concerns
              </div>
              <ul className="space-y-1.5 text-slate-700 dark:text-slate-300 list-disc list-inside">
                {evaluation.concerns.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>

            {/* Suggested Further Assessment */}
            <div className="space-y-2 text-xs">
              <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-sky-600" />
                4. Evidence-Linked Assessment Considerations (Clinician Review)
              </div>
              <div className="space-y-2">
                {evaluation.suggestedAssessments.map((item, idx) => (
                  <label
                    key={item}
                    className="flex items-start gap-2.5 rounded-lg border border-slate-200/80 dark:border-slate-800 p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(checkedPathways[idx])}
                      onChange={() =>
                        setCheckedPathways((prev) => ({ ...prev, [idx]: !prev[idx] }))
                      }
                      className="mt-0.5 accent-sky-600"
                    />
                    <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {item}
                    </span>
                  </label>
                ))}
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-1">
                <CheckSquare className="w-3.5 h-3.5" />
                Reference pathways: ESC/ESH Hypertension Management & Cardiological Society of India Guidelines (Demonstrative).
              </div>
            </div>

            {/* Clinical Documentation Assistance */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  5. Clinical Documentation Draft Assistance
                </span>
                <button
                  type="button"
                  onClick={handleCopyDraft}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <ClipboardCopy className="w-3.5 h-3.5" />
                  {copiedNote ? 'Copied Draft' : 'Copy Note Draft'}
                </button>
              </div>
              <pre className="rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 text-[11px] font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {draftSoapNote}
              </pre>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

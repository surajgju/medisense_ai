import React, { useState } from 'react';
import { Check, Moon, Shield, Sun } from 'lucide-react';
import { useHealthcare } from '../../context/HealthcareContext';

export const OrganisationSettingsView: React.FC = () => {
  const { theme, toggleTheme } = useHealthcare();
  const [orgName, setOrgName] = useState('Sahyadri MedNet India (Demonstration Network)');
  const [abdmMode, setAbdmMode] = useState(true);
  const [phiRedaction, setPhiRedaction] = useState(true);
  const [icuThreshold, setIcuThreshold] = useState(85);
  const [edWaitThreshold, setEdWaitThreshold] = useState(18);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Organisation Settings & Privacy Governance
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Configure network identity, healthcare data privacy controls, operational alert thresholds, and interface theme.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
          <h2 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
            Hospital Network Profile
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <label className="space-y-1">
              <span className="font-medium text-slate-700 dark:text-slate-300">Organisation Name</span>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100"
              />
            </label>
            <label className="space-y-1">
              <span className="font-medium text-slate-700 dark:text-slate-300">Primary Region</span>
              <input
                type="text"
                readOnly
                value="India (Mumbai · Bengaluru · New Delhi · Hyderabad · Chennai · Pune)"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 px-3 py-2 text-slate-600 dark:text-slate-400"
              />
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-sky-600" />
            <h2 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
              Privacy, Compliance & Operational Alert Thresholds
            </h2>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between gap-4 rounded-lg border border-slate-200/80 dark:border-slate-800 p-3.5">
              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  De-identify Patient Identifiers Before AI Inference
                </div>
                <div className="text-slate-500 dark:text-slate-400">
                  Enforces tokenised PHI stripping aligned with DPDP Act & HIPAA Safe Harbor patterns.
                </div>
              </div>
              <input
                type="checkbox"
                checked={phiRedaction}
                onChange={(e) => setPhiRedaction(e.target.checked)}
                className="h-4 w-4 accent-sky-600"
              />
            </label>

            <label className="flex items-center justify-between gap-4 rounded-lg border border-slate-200/80 dark:border-slate-800 p-3.5">
              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  ABDM / HL7 FHIR R4 Schema Readiness
                </div>
                <div className="text-slate-500 dark:text-slate-400">
                  Structures synthetic observations and diagnostic reports with LOINC / SNOMED CT placeholders.
                </div>
              </div>
              <input
                type="checkbox"
                checked={abdmMode}
                onChange={(e) => setAbdmMode(e.target.checked)}
                className="h-4 w-4 accent-sky-600"
              />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <label className="space-y-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  ICU Utilisation Alert Threshold (%)
                </span>
                <input
                  type="number"
                  min={50}
                  max={99}
                  value={icuThreshold}
                  onChange={(e) => setIcuThreshold(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 font-mono text-slate-900 dark:text-slate-100"
                />
              </label>
              <label className="space-y-1">
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  ED Wait-Time Escalation Threshold (min)
                </span>
                <input
                  type="number"
                  min={5}
                  max={60}
                  value={edWaitThreshold}
                  onChange={(e) => setEdWaitThreshold(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 font-mono text-slate-900 dark:text-slate-100"
                />
              </label>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
              Interface Appearance
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Light clinical theme is active by default; dark mode is available for low-light reading rooms.
            </p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            {theme === 'light' ? 'Enable Dark Mode' : 'Switch to Light Mode'}
          </button>
        </section>

        <div className="flex items-center justify-end gap-3">
          {savedNotice && (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Check className="w-4 h-4" />
              Settings updated in demonstration session
            </span>
          )}
          <button
            type="submit"
            className="rounded-lg bg-sky-600 hover:bg-sky-700 px-5 py-2 text-xs font-semibold text-white"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};

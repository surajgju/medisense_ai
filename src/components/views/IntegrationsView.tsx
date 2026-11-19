import React, { useState } from 'react';
import { Code2, Network, RefreshCw } from 'lucide-react';
import { useHealthcare } from '../../context/HealthcareContext';
import { DisclaimerBanner } from '../ui/DisclaimerBanner';
import { StatusLabel } from '../ui/StatusLabel';

const SAMPLE_FHIR_PAYLOAD = `{
  "resourceType": "Observation",
  "id": "obs-pat-10284-bp",
  "status": "final",
  "category": [{ "coding": [{ "system": "http://terminology.hl7.org/CodeSystem/observation-category", "code": "vital-signs" }] }],
  "code": { "coding": [{ "system": "http://loinc.org", "code": "85354-9", "display": "Blood pressure panel" }] },
  "subject": { "reference": "Patient/PAT-10284", "display": "Rajesh Kulkarni (Synthetic)" },
  "component": [
    { "code": { "text": "Systolic BP" }, "valueQuantity": { "value": 158, "unit": "mmHg" } },
    { "code": { "text": "Diastolic BP" }, "valueQuantity": { "value": 96, "unit": "mmHg" } }
  ]
}`;

export const IntegrationsView: React.FC = () => {
  const { integrations, syncIntegration } = useHealthcare();
  const [showSchema, setShowSchema] = useState(true);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Clinical Systems & FHIR Integrations
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Interoperability architecture prepared for HL7 FHIR R4, EHR/EMR, HIS, LIS, PACS, and secure AI inference endpoints.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowSchema((s) => !s)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          <Code2 className="w-3.5 h-3.5" />
          {showSchema ? 'Hide FHIR R4 Sample' : 'Show FHIR R4 Sample'}
        </button>
      </div>

      <DisclaimerBanner
        title="Sandbox Interoperability Architecture"
        message="All endpoints shown below represent simulated architecture blueprints. This prototype is not connected to live hospital EHR, LIS, or PACS systems."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {integrations.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between space-y-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-700 dark:text-sky-400">
                  <Network className="w-3.5 h-3.5" />
                  {item.category}
                </span>
                <StatusLabel label={item.status} />
              </div>

              <h2 className="font-display text-sm font-bold text-slate-900 dark:text-slate-100">
                {item.name}
              </h2>
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                {item.standard}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <div className="font-mono text-[11px] text-slate-500 truncate">{item.endpoint}</div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">
                  Synced: <strong className="font-mono text-slate-700 dark:text-slate-200 tabular-nums">{item.recordsSynced.toLocaleString()}</strong>
                </span>
                <span className="text-[11px] text-slate-400">{item.lastSync}</span>
              </div>
              <button
                type="button"
                onClick={() => syncIntegration(item.id)}
                className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Run Demo Sandbox Sync
              </button>
            </div>
          </article>
        ))}
      </div>

      {showSchema && (
        <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-2">
          <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
            FHIR R4 Observation Mapping Preview (PAT-10284 Synthetic Record)
          </div>
          <pre className="rounded-lg bg-slate-950 text-sky-200 p-4 text-[11px] font-mono overflow-x-auto leading-relaxed">
            {SAMPLE_FHIR_PAYLOAD}
          </pre>
        </section>
      )}
    </div>
  );
};

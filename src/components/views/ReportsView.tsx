import React, { useState } from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import { useHealthcare } from '../../context/HealthcareContext';
import { downloadCsvFile } from '../../utils/exportCsv';
import { DisclaimerBanner } from '../ui/DisclaimerBanner';

type ReportPackId = 'patients' | 'diagnostics' | 'labs' | 'capacity' | 'agents';

export const ReportsView: React.FC = () => {
  const { patients, diagnosticCases, labReports, hospitalCapacity, executions } = useHealthcare();
  const [selectedPack, setSelectedPack] = useState<ReportPackId>('patients');

  const packs: {
    id: ReportPackId;
    title: string;
    description: string;
    rowCount: number;
    filename: string;
  }[] = [
    {
      id: 'patients',
      title: 'Master Synthetic Patient Registry',
      description: 'Demographics, hospital hub, primary conditions, latest vitals, and risk stratification.',
      rowCount: patients.length,
      filename: 'medisense-patient-registry.csv',
    },
    {
      id: 'diagnostics',
      title: 'Predictive Diagnostics & Early Warning Audit',
      description: 'Early warning scores, simulated risk levels, and clinician review statuses.',
      rowCount: diagnosticCases.length,
      filename: 'medisense-predictive-diagnostics.csv',
    },
    {
      id: 'labs',
      title: 'Laboratory Turnaround & Critical Alerts',
      description: 'Pathology & biochemistry results, reference flags, and sample turnaround hours.',
      rowCount: labReports.length,
      filename: 'medisense-laboratory-report.csv',
    },
    {
      id: 'capacity',
      title: 'Hospital Network Capacity Census',
      description: 'Ward bed occupancy, ICU allocation, ER wait times, and surgical OT blocks.',
      rowCount: hospitalCapacity.length,
      filename: 'medisense-hospital-capacity.csv',
    },
    {
      id: 'agents',
      title: 'AI Agent Execution & Latency Log',
      description: 'Simulated agent pipeline runs, execution durations, and flagged review items.',
      rowCount: executions.length,
      filename: 'medisense-agent-audit.csv',
    },
  ];

  const handleDownload = (id: ReportPackId) => {
    switch (id) {
      case 'patients':
        downloadCsvFile(
          'medisense-patient-registry.csv',
          ['Patient ID', 'Name', 'Age', 'Gender', 'City', 'Hospital', 'Department', 'Risk Score', 'Risk Level'],
          patients.map((p) => [
            p.id,
            p.name,
            p.age,
            p.gender,
            p.city,
            p.hospital,
            p.department,
            p.riskScore,
            p.riskLevel,
          ])
        );
        break;
      case 'diagnostics':
        downloadCsvFile(
          'medisense-predictive-diagnostics.csv',
          ['Case ID', 'Patient ID', 'Name', 'Department', 'EWS', 'Risk', 'Condition', 'Review Status'],
          diagnosticCases.map((d) => [
            d.id,
            d.patientId,
            d.patientName,
            d.department,
            d.earlyWarningScore,
            d.riskClassification,
            d.predictedCondition,
            d.reviewStatus,
          ])
        );
        break;
      case 'labs':
        downloadCsvFile(
          'medisense-laboratory-report.csv',
          ['Lab ID', 'Patient ID', 'Name', 'Test', 'Value', 'Reference', 'Flag', 'TAT (hrs)', 'Status'],
          labReports.map((l) => [
            l.id,
            l.patientId,
            l.patientName,
            l.testName,
            l.measuredValue,
            l.referenceRange,
            l.flag,
            l.turnaroundHours,
            l.status,
          ])
        );
        break;
      case 'capacity':
        downloadCsvFile(
          'medisense-hospital-capacity.csv',
          ['Hospital', 'City', 'Beds Occupied', 'Total Beds', 'ICU Occupied', 'ICU Total', 'ER Wait (min)'],
          hospitalCapacity.map((h) => [
            h.hospitalName,
            h.city,
            h.occupiedBeds,
            h.totalBeds,
            h.icuOccupied,
            h.icuTotal,
            h.erWaitMin,
          ])
        );
        break;
      case 'agents':
        downloadCsvFile(
          'medisense-agent-audit.csv',
          ['Execution ID', 'Agent', 'Task Type', 'Target', 'Duration (ms)', 'Status'],
          executions.map((e) => [
            e.id,
            e.agentName,
            e.taskType,
            e.targetEntity,
            e.durationMs,
            e.status,
          ])
        );
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Intelligence Reports & CSV Exports
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Generate structured CSV extracts from centralised synthetic clinical and operational datasets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packs.map((pack) => (
          <div
            key={pack.id}
            className={`rounded-xl border p-5 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-4 transition-colors ${
              selectedPack === pack.id
                ? 'border-sky-500 ring-1 ring-sky-500/20'
                : 'border-slate-200/80 dark:border-slate-800'
            }`}
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <FileSpreadsheet className="w-4 h-4 text-sky-600" />
                <span className="font-mono tabular-nums">{pack.rowCount} records</span>
              </div>
              <h2 className="font-display text-sm font-bold text-slate-900 dark:text-slate-100">
                {pack.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {pack.description}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSelectedPack(pack.id)}
                className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Preview
              </button>
              <button
                type="button"
                onClick={() => handleDownload(pack.id)}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 py-1.5 text-xs font-semibold text-white"
              >
                <Download className="w-3.5 h-3.5" />
                Download CSV
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Live Preview Table */}
      <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
            Report Preview: {packs.find((p) => p.id === selectedPack)?.title} (Top 6 Rows)
          </h3>
          <button
            type="button"
            onClick={() => handleDownload(selectedPack)}
            className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline"
          >
            Export Full Dataset
          </button>
        </div>

        <div className="overflow-x-auto text-xs">
          {selectedPack === 'patients' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <th className="py-2 pr-3">ID</th>
                  <th className="py-2 pr-3">Name</th>
                  <th className="py-2 pr-3">Department</th>
                  <th className="py-2 pr-3">Hospital</th>
                  <th className="py-2">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {patients.slice(0, 6).map((p) => (
                  <tr key={p.id}>
                    <td className="py-2 pr-3 font-mono">{p.id}</td>
                    <td className="py-2 pr-3 font-medium">{p.name}</td>
                    <td className="py-2 pr-3">{p.department}</td>
                    <td className="py-2 pr-3">{p.hospital}</td>
                    <td className="py-2 font-mono">{p.riskLevel} ({p.riskScore})</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {selectedPack === 'diagnostics' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <th className="py-2 pr-3">Case ID</th>
                  <th className="py-2 pr-3">Patient</th>
                  <th className="py-2 pr-3">Department</th>
                  <th className="py-2 pr-3">EWS</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {diagnosticCases.slice(0, 6).map((d) => (
                  <tr key={d.id}>
                    <td className="py-2 pr-3 font-mono">{d.id}</td>
                    <td className="py-2 pr-3">{d.patientName}</td>
                    <td className="py-2 pr-3">{d.department}</td>
                    <td className="py-2 pr-3 font-mono">{d.earlyWarningScore}/9</td>
                    <td className="py-2">{d.reviewStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {selectedPack === 'labs' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <th className="py-2 pr-3">Lab ID</th>
                  <th className="py-2 pr-3">Test</th>
                  <th className="py-2 pr-3">Value</th>
                  <th className="py-2 pr-3">Flag</th>
                  <th className="py-2">TAT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {labReports.slice(0, 6).map((l) => (
                  <tr key={l.id}>
                    <td className="py-2 pr-3 font-mono">{l.id}</td>
                    <td className="py-2 pr-3">{l.testName}</td>
                    <td className="py-2 pr-3 font-mono">{l.measuredValue}</td>
                    <td className="py-2 pr-3">{l.flag}</td>
                    <td className="py-2 font-mono">{l.turnaroundHours}h</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {selectedPack === 'capacity' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <th className="py-2 pr-3">Hospital</th>
                  <th className="py-2 pr-3">City</th>
                  <th className="py-2 pr-3">Beds</th>
                  <th className="py-2 pr-3">ICU</th>
                  <th className="py-2">ER Wait</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {hospitalCapacity.map((h) => (
                  <tr key={h.id}>
                    <td className="py-2 pr-3">{h.hospitalName}</td>
                    <td className="py-2 pr-3">{h.city}</td>
                    <td className="py-2 pr-3 font-mono">{h.occupiedBeds}/{h.totalBeds}</td>
                    <td className="py-2 pr-3 font-mono">{h.icuOccupied}/{h.icuTotal}</td>
                    <td className="py-2 font-mono">{h.erWaitMin} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {selectedPack === 'agents' && (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <th className="py-2 pr-3">Execution ID</th>
                  <th className="py-2 pr-3">Agent</th>
                  <th className="py-2 pr-3">Target</th>
                  <th className="py-2 pr-3">Duration</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {executions.slice(0, 6).map((e) => (
                  <tr key={e.id}>
                    <td className="py-2 pr-3 font-mono">{e.id}</td>
                    <td className="py-2 pr-3">{e.agentName}</td>
                    <td className="py-2 pr-3 font-mono">{e.targetEntity}</td>
                    <td className="py-2 pr-3 font-mono">{e.durationMs} ms</td>
                    <td className="py-2">{e.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <DisclaimerBanner
        message="Exported CSV files contain synthetic demonstration records only and must not be treated as actual clinical data."
      />
    </div>
  );
};

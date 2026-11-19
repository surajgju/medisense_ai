import React, { useMemo, useState } from 'react';
import { CheckCircle2, Eye, EyeOff, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { useHealthcare } from '../../context/HealthcareContext';
import type { ImagingCase, ImagingModality } from '../../types/healthcare';
import { DisclaimerBanner } from '../ui/DisclaimerBanner';
import { StatusLabel } from '../ui/StatusLabel';

const MODALITIES: ('All' | ImagingModality)[] = ['All', 'X-Ray', 'CT Scan', 'MRI', 'Ultrasound'];

export const MedicalImagingView: React.FC = () => {
  const { imagingCases, updateImagingStatus, openPatientDetail } = useHealthcare();
  const [modalityFilter, setModalityFilter] = useState<'All' | ImagingModality>('All');
  const [selectedScan, setSelectedScan] = useState<ImagingCase>(imagingCases[0]);
  const [zoom, setZoom] = useState(1);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(105);
  const [showAiOverlay, setShowAiOverlay] = useState(true);

  const filteredScans = useMemo(() => {
    if (modalityFilter === 'All') return imagingCases;
    return imagingCases.filter((im) => im.modality === modalityFilter);
  }, [imagingCases, modalityFilter]);

  const activeScan =
    filteredScans.find((im) => im.id === selectedScan?.id) ?? filteredScans[0] ?? imagingCases[0];

  const resetViewer = () => {
    setZoom(1);
    setBrightness(100);
    setContrast(105);
    setShowAiOverlay(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            AI Medical Imaging Intelligence
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Illustrative X-Ray, CT, MRI, and Ultrasound pre-screening workspace with structured radiology report assistance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800/80">
          {MODALITIES.map((mod) => (
            <button
              key={mod}
              type="button"
              onClick={() => setModalityFilter(mod)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                modalityFilter === mod
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {mod}
            </button>
          ))}
        </div>
      </div>

      <DisclaimerBanner
        tone="clinical"
        title="Illustrative Radiology Visuals Only"
        message="Displayed schematics and AI region-of-interest highlights are illustrative synthetic demonstration examples — not real patient DICOM studies — and require qualified radiologist review before any clinical action."
      />

      {/* Radiology Workstation Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Interactive Viewer Area */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-100 overflow-hidden flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900">
            <div className="text-xs">
              <span className="font-mono font-semibold text-sky-400 mr-2">{activeScan.id}</span>
              <span className="font-medium">{activeScan.modality}</span>
              <span className="text-slate-400 mx-1.5">·</span>
              <span className="text-slate-300">{activeScan.bodyRegion}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.75, Number((z - 0.15).toFixed(2))))}
                aria-label="Zoom out scan"
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[11px] w-11 text-center tabular-nums">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(1.8, Number((z + 0.15).toFixed(2))))}
                aria-label="Zoom in scan"
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setShowAiOverlay((s) => !s)}
                className="inline-flex items-center gap-1 ml-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-medium text-sky-300"
              >
                {showAiOverlay ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                AI ROI {showAiOverlay ? 'On' : 'Off'}
              </button>
              <button
                type="button"
                onClick={resetViewer}
                aria-label="Reset viewer windowing"
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="relative flex-1 min-h-[340px] flex items-center justify-center overflow-hidden bg-[#0F141B] p-4">
            <div
              className="relative transition-transform duration-150 ease-out max-w-md w-full flex items-center justify-center"
              style={{
                transform: `scale(${zoom})`,
                filter: `brightness(${brightness}%) contrast(${contrast}%)`,
              }}
            >
              {activeScan.assetPath === 'svg-ultrasound' ? (
                <svg
                  viewBox="0 0 400 300"
                  className="w-full h-auto rounded border border-slate-800 bg-slate-950"
                  aria-label="Illustrative Ultrasound Sector Diagram"
                >
                  <defs>
                    <radialGradient id="usBeam" cx="50%" cy="10%" r="85%">
                      <stop offset="0%" stopColor="#64748B" stopOpacity="0.45" />
                      <stop offset="65%" stopColor="#334155" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#0F172A" stopOpacity="0.95" />
                    </radialGradient>
                  </defs>
                  <path d="M 200 20 L 365 265 A 260 260 0 0 1 35 265 Z" fill="url(#usBeam)" stroke="#475569" strokeWidth="1.5" />
                  <ellipse cx="200" cy="145" rx="68" ry="34" fill="#1E293B" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 3" />
                  <path d="M 145 148 Q 200 120 255 148" fill="none" stroke="#CBD5E1" strokeWidth="2" />
                  <text x="16" y="24" fill="#94A3B8" fontSize="10" fontFamily="monospace">
                    ILLUSTRATIVE ULTRASOUND SCHEMATIC
                  </text>
                </svg>
              ) : (
                <img
                  src={activeScan.assetPath}
                  alt={`Illustrative ${activeScan.modality} schematic for ${activeScan.bodyRegion}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto rounded object-contain max-h-80"
                />
              )}

              {showAiOverlay && (
                <div
                  className="absolute border-2 border-dashed border-sky-400 bg-sky-400/10 rounded pointer-events-none"
                  style={{
                    left: `${activeScan.roiBox.x}%`,
                    top: `${activeScan.roiBox.y}%`,
                    width: `${activeScan.roiBox.width}%`,
                    height: `${activeScan.roiBox.height}%`,
                  }}
                >
                  <span className="absolute -top-5 left-0 bg-sky-600/90 text-white text-[10px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap">
                    AI ROI: {activeScan.roiBox.label}
                  </span>
                </div>
              )}
            </div>

            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-slate-400 pointer-events-none">
              <span>SYNTHETIC DEMONSTRATION PLATE · {activeScan.patientId}</span>
              <span>{activeScan.scanDate}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 px-4 py-3 bg-slate-900 border-t border-slate-800 text-xs">
            <label className="flex items-center gap-3">
              <span className="text-slate-400 whitespace-nowrap">Brightness</span>
              <input
                type="range"
                min={60}
                max={150}
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full accent-sky-500"
              />
              <span className="font-mono text-[11px] w-9 text-right tabular-nums">{brightness}%</span>
            </label>
            <label className="flex items-center gap-3">
              <span className="text-slate-400 whitespace-nowrap">Contrast</span>
              <input
                type="range"
                min={70}
                max={170}
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full accent-sky-500"
              />
              <span className="font-mono text-[11px] w-9 text-right tabular-nums">{contrast}%</span>
            </label>
          </div>
        </div>

        {/* Structured Findings Panel */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Study {activeScan.id} · {activeScan.hospital}
                </div>
                <button
                  type="button"
                  onClick={() => openPatientDetail(activeScan.patientId)}
                  className="font-display text-lg font-bold text-slate-900 dark:text-slate-50 hover:text-sky-600 text-left mt-0.5"
                >
                  {activeScan.patientName} ({activeScan.patientId})
                </button>
              </div>
              <StatusLabel label={activeScan.radiologistStatus} />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs border-y border-slate-100 dark:border-slate-800 py-3">
              <div>
                <span className="text-slate-400 block">Modality / Region</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {activeScan.modality} · {activeScan.bodyRegion}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Assigned Radiologist</span>
                <span className="font-medium text-slate-900 dark:text-slate-100">
                  {activeScan.assignedRadiologist}
                </span>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 dark:bg-slate-800/60 p-3.5 space-y-1.5 text-xs">
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                Illustrative AI-Assisted Preliminary Finding
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeScan.simulatedFinding}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                Structured Radiology Report Draft
              </div>
              <ul className="space-y-1.5 text-slate-600 dark:text-slate-400 list-disc list-inside">
                {activeScan.structuredObservations.map((obs) => (
                  <li key={obs}>{obs}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">
              Clinician verification required prior to formal report release.
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => updateImagingStatus(activeScan.id, 'Verified by Radiologist')}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 py-2 text-xs font-semibold text-white transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verify Findings
              </button>
              <button
                type="button"
                onClick={() => updateImagingStatus(activeScan.id, 'Clarification Requested')}
                className="rounded-lg border border-slate-200 dark:border-slate-700 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Request Clarification
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Imaging Queue Table */}
      <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
            Imaging Study Queue ({filteredScans.length} Studies)
          </h2>
          <span className="text-xs text-slate-400">Select any row to load into workstation</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400">
                <th className="py-2.5 px-4 font-semibold">Scan ID</th>
                <th className="py-2.5 px-3 font-semibold">Patient</th>
                <th className="py-2.5 px-3 font-semibold">Modality</th>
                <th className="py-2.5 px-3 font-semibold">Scan Date</th>
                <th className="py-2.5 px-3 font-semibold">AI Status</th>
                <th className="py-2.5 px-3 font-semibold">Simulated Finding</th>
                <th className="py-2.5 px-4 font-semibold">Radiologist Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredScans.map((im) => (
                <tr
                  key={im.id}
                  onClick={() => setSelectedScan(im)}
                  className={`cursor-pointer transition-colors ${
                    activeScan.id === im.id
                      ? 'bg-sky-50/70 dark:bg-sky-950/30'
                      : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <td className="py-2.5 px-4 font-mono font-semibold text-sky-700 dark:text-sky-400">
                    {im.id}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {im.patientName}
                    </span>{' '}
                    <span className="font-mono text-slate-400">({im.patientId})</span>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300">
                    {im.modality} · {im.bodyRegion}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">{im.scanDate}</td>
                  <td className="py-2.5 px-3">
                    <StatusLabel label={im.analysisStatus} />
                  </td>
                  <td className="py-2.5 px-3 max-w-xs truncate text-slate-600 dark:text-slate-400">
                    {im.simulatedFinding}
                  </td>
                  <td className="py-2.5 px-4">
                    <StatusLabel label={im.radiologistStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { ArrowUpRight, ScanLine } from 'lucide-react';
import type { ImagingCase } from '../../../types/healthcare';
import { HoloStatusBadge } from './HoloPanelShell';

interface ImagingPanelProps {
  imagingCases: ImagingCase[];
  highlighted: boolean;
  onOpenImaging: () => void;
  onHoverChange: (hover: boolean) => void;
}

const PREVIEW_SCANS = [
  {
    modality: 'X-Ray',
    src: '/src/assets/images/xray_thorax_demo_1795087304726.jpg',
    alt: 'Illustrative thoracic X-Ray study thumbnail',
  },
  {
    modality: 'CT Scan',
    src: '/src/assets/images/ct_cardiac_demo_1795087303977.jpg',
    alt: 'Illustrative cardiac CT study thumbnail',
  },
  {
    modality: 'MRI',
    src: '/src/assets/images/mri_brain_demo_1795087303607.jpg',
    alt: 'Illustrative cranial MRI study thumbnail',
  },
];

export const ImagingPanel: React.FC<ImagingPanelProps> = ({
  imagingCases,
  highlighted,
  onOpenImaging,
  onHoverChange,
}) => {
  const latest = imagingCases[0];
  const borderClass = highlighted
    ? 'border-sky-500 bg-white ring-1 ring-sky-200 shadow-[0_6px_18px_rgba(2,132,199,0.12)] dark:ring-0 dark:border-cyan-300/90 dark:bg-slate-900/85 dark:shadow-[0_0_24px_rgba(56,189,248,0.28)]'
    : 'border-slate-200/90 bg-white/95 hover:border-sky-300 hover:bg-white shadow-[0_2px_10px_rgba(15,23,42,0.04)] dark:border-cyan-400/35 dark:bg-slate-950/75 dark:hover:border-cyan-300/70 dark:hover:bg-slate-900/80 dark:shadow-[0_8px_24px_rgba(2,6,23,0.45)]';

  return (
    <div
      data-panel-anchor="panel-imaging"
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={() => onHoverChange(false)}
      className={`relative rounded-xl border backdrop-blur-md p-3 transition-all duration-200 ${borderClass}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/70 dark:via-cyan-200/60 to-transparent"
      />

      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-cyan-400/15">
        <div className="flex items-center gap-1.5 min-w-0">
          <ScanLine className="w-3.5 h-3.5 text-sky-600 dark:text-cyan-300 shrink-0" aria-hidden="true" />
          <span className="text-xs font-semibold tracking-tight text-slate-900 dark:text-slate-100 truncate">
            Medical Imaging
          </span>
        </div>
        <button
          type="button"
          onClick={onOpenImaging}
          className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-sky-700 hover:text-sky-800 dark:text-cyan-300 dark:hover:text-cyan-200 whitespace-nowrap"
        >
          <span>Viewer</span>
          <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-1.5 mt-2">
        {PREVIEW_SCANS.map((scan) => (
          <button
            key={scan.modality}
            type="button"
            onClick={onOpenImaging}
            className="group relative rounded-md overflow-hidden border border-slate-200 dark:border-cyan-400/25 bg-slate-900 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:focus-visible:ring-cyan-400"
          >
            <img
              src={scan.src}
              alt={scan.alt}
              referrerPolicy="no-referrer"
              className="w-full h-11 object-cover opacity-90 group-hover:opacity-100 transition-opacity"
            />
            <div className="bg-slate-50 dark:bg-slate-950/90 border-t border-slate-200 dark:border-t-0 px-1 py-0.5 text-[9.5px] font-mono font-medium text-slate-700 dark:text-cyan-200 text-center">
              {scan.modality}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 text-[11px]">
        <span className="text-slate-500 dark:text-slate-400 truncate">
          {latest ? `${latest.id} · ${latest.bodyRegion}` : 'Illustrative Scans'}
        </span>
        <HoloStatusBadge label={latest?.analysisStatus ?? 'AI Analysed'} tone="normal" />
      </div>
    </div>
  );
};

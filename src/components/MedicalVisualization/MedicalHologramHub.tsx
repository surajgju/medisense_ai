import React, { useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Eye,
  Layers,
  Stethoscope,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import type { ImagingCase, PatientRecord } from '../../types/healthcare';
import {
  buildBodySystemSnapshot,
  computeExtendedOrganMetrics,
} from '../../utils/clinicalLogic';
import {
  type ConnectorBinding,
  OrganConnectors,
} from './Connections/OrganConnectors';
import { DataParticles } from './Effects/DataParticles';
import {
  HolographicEnvironmentBackdrop,
  HolographicSvgDefs,
} from './Effects/HolographicGlow';
import { ScanningBeam } from './Effects/ScanningBeam';
import { Brain } from './HumanBody/Brain';
import { Heart } from './HumanBody/Heart';
import { HumanSilhouette } from './HumanBody/HumanSilhouette';
import { Intestines } from './HumanBody/Intestines';
import { Kidneys } from './HumanBody/Kidneys';
import { Liver } from './HumanBody/Liver';
import { Lungs } from './HumanBody/Lungs';
import { Skeleton } from './HumanBody/Skeleton';
import { Stomach } from './HumanBody/Stomach';
import { AiIntelligencePanel } from './IntelligencePanels/AiIntelligencePanel';
import { BrainPanel } from './IntelligencePanels/BrainPanel';
import { CardiacPanel } from './IntelligencePanels/CardiacPanel';
import { HoloStatusBadge } from './IntelligencePanels/HoloPanelShell';
import { ImagingPanel } from './IntelligencePanels/ImagingPanel';
import { MetabolicPanel } from './IntelligencePanels/MetabolicPanel';
import { MobilityPanel } from './IntelligencePanels/MobilityPanel';
import { RespiratoryPanel } from './IntelligencePanels/RespiratoryPanel';
import type { HoloTone, OrganKey } from './types';

interface MedicalHologramHubProps {
  patients: PatientRecord[];
  imagingCases: ImagingCase[];
  selectedPatientId: string;
  onSelectPatient: (patientId: string) => void;
  onOpenDecisionSupport: (patientId: string) => void;
  onInspectPatient: (patientId: string) => void;
  onOpenImaging: () => void;
}

function toHoloTone(status: 'Normal' | 'Elevated' | 'Warning' | 'Critical'): HoloTone {
  if (status === 'Critical') return 'critical';
  if (status === 'Warning') return 'warning';
  if (status === 'Elevated') return 'elevated';
  return 'normal';
}

export const MedicalHologramHub: React.FC<MedicalHologramHubProps> = ({
  patients,
  imagingCases,
  selectedPatientId,
  onSelectPatient,
  onOpenDecisionSupport,
  onInspectPatient,
  onOpenImaging,
}) => {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [selectedOrgan, setSelectedOrgan] = useState<OrganKey>('heart');
  const [hoveredOrgan, setHoveredOrgan] = useState<OrganKey | null>(null);
  const [zoomMode, setZoomMode] = useState<'full' | 'thorax'>('full');
  const [showSkeleton, setShowSkeleton] = useState(true);

  const patientOptions = useMemo(() => {
    const map = new Map<string, PatientRecord>();
    const anchor = patients.find((p) => p.id === 'PAT-10284');
    if (anchor) map.set(anchor.id, anchor);
    const active = patients.find((p) => p.id === selectedPatientId);
    if (active) map.set(active.id, active);
    for (const p of patients.slice(0, 14)) {
      map.set(p.id, p);
    }
    return Array.from(map.values());
  }, [patients, selectedPatientId]);

  const activePatient = useMemo(
    () =>
      patients.find((p) => p.id === selectedPatientId) ??
      patients.find((p) => p.id === 'PAT-10284') ??
      patients[0],
    [patients, selectedPatientId]
  );

  const telemetry = useMemo(() => buildBodySystemSnapshot(activePatient), [activePatient]);
  const ext = useMemo(() => computeExtendedOrganMetrics(activePatient), [activePatient]);

  const sysMap = useMemo(() => {
    const map = new Map(telemetry.systems.map((s) => [s.id, s]));
    return {
      cardio: map.get('cardio')!,
      respiratory: map.get('respiratory')!,
      neuro: map.get('neuro')!,
      metabolic: map.get('metabolic')!,
      musculoskeletal: map.get('musculoskeletal')!,
    };
  }, [telemetry.systems]);

  const tones: Record<OrganKey, HoloTone> = {
    brain: toHoloTone(sysMap.neuro.status),
    lungs: toHoloTone(sysMap.respiratory.status),
    heart: toHoloTone(sysMap.cardio.status),
    liver: toHoloTone(sysMap.metabolic.status),
    stomach: toHoloTone(sysMap.metabolic.status),
    intestines: toHoloTone(sysMap.metabolic.status),
    kidneys: toHoloTone(sysMap.metabolic.status),
    skeleton: toHoloTone(sysMap.musculoskeletal.status),
  };

  const activeFocusOrgan = hoveredOrgan ?? selectedOrgan;

  const organDetailMap: Record<
    OrganKey,
    { title: string; metric: string; status: string; tone: HoloTone; note: string }
  > = {
    brain: {
      title: 'Brain & Neural',
      metric: `Cognitive ${ext.cognitiveScore}/100 · MAP ${telemetry.meanArterialPressure} mmHg`,
      status: sysMap.neuro.status,
      tone: tones.brain,
      note: `${ext.neuroStatusLabel} · ${sysMap.neuro.clinicalNote}`,
    },
    lungs: {
      title: 'Pulmonary Tree',
      metric: `SpO₂ ${activePatient.vitals.spo2}% · RR ${activePatient.vitals.respiratoryRate}/min`,
      status: sysMap.respiratory.status,
      tone: tones.lungs,
      note: sysMap.respiratory.clinicalNote,
    },
    heart: {
      title: 'Cardiovascular',
      metric: `${activePatient.vitals.heartRate} BPM · BP ${activePatient.vitals.bpSystolic}/${activePatient.vitals.bpDiastolic} mmHg`,
      status: sysMap.cardio.status,
      tone: tones.heart,
      note: sysMap.cardio.clinicalNote,
    },
    liver: {
      title: 'Hepatic & Portal',
      metric: `Glucose ${ext.glucoseMgDl} mg/dL · BMI ${ext.bmi}`,
      status: ext.metabolicStatusLabel,
      tone: tones.liver,
      note: sysMap.metabolic.clinicalNote,
    },
    stomach: {
      title: 'Gastric & Upper GI',
      metric: `Core Temp ${activePatient.vitals.temperatureC.toFixed(1)} °C · Glycaemic ${ext.glucoseMgDl} mg/dL`,
      status: ext.metabolicStatusLabel,
      tone: tones.stomach,
      note: 'Upper GI metabolic correlation monitored alongside current medication profile.',
    },
    intestines: {
      title: 'Intestinal Tract',
      metric: `BMI ${ext.bmi} · ${ext.metabolicStatusLabel}`,
      status: sysMap.metabolic.status,
      tone: tones.intestines,
      note: 'Lower digestive motility and hydration baseline within demonstration reference.',
    },
    kidneys: {
      title: 'Renal Filtration',
      metric: `MAP ${telemetry.meanArterialPressure} mmHg · BP ${activePatient.vitals.bpSystolic}/${activePatient.vitals.bpDiastolic}`,
      status: activePatient.vitals.bpSystolic >= 145 ? 'Renal Watch' : 'Normal',
      tone: activePatient.vitals.bpSystolic >= 145 ? 'warning' : 'normal',
      note: 'Renal perfusion tracked against systemic arterial pressure and creatinine history.',
    },
    skeleton: {
      title: 'Skeletal & Joints',
      metric: `Mobility ${ext.mobilityScore}/100 · ${ext.jointHealthLabel}`,
      status: sysMap.musculoskeletal.status,
      tone: tones.skeleton,
      note: ext.musculoskeletalAssessment,
    },
  };

  const activeOrganDetail = organDetailMap[activeFocusOrgan];

  const connectorBindings: ConnectorBinding[] = useMemo(
    () => [
      {
        id: 'conn-brain',
        panelSelector: '[data-panel-anchor="panel-brain"]',
        organAnchor: 'brain',
        side: 'left',
        status: tones.brain,
        highlighted: activeFocusOrgan === 'brain',
      },
      {
        id: 'conn-lungs',
        panelSelector: '[data-panel-anchor="panel-respiratory"]',
        organAnchor: 'lungs',
        side: 'left',
        status: tones.lungs,
        highlighted: activeFocusOrgan === 'lungs',
      },
      {
        id: 'conn-heart',
        panelSelector: '[data-panel-anchor="panel-cardiac"]',
        organAnchor: 'heart',
        side: 'left',
        status: tones.heart,
        highlighted: activeFocusOrgan === 'heart',
      },
      {
        id: 'conn-metabolic',
        panelSelector: '[data-panel-anchor="panel-metabolic"]',
        organAnchor:
          activeFocusOrgan === 'stomach' ||
          activeFocusOrgan === 'intestines' ||
          activeFocusOrgan === 'kidneys'
            ? activeFocusOrgan
            : 'liver',
        side: 'right',
        status: tones.liver,
        highlighted:
          activeFocusOrgan === 'liver' ||
          activeFocusOrgan === 'stomach' ||
          activeFocusOrgan === 'intestines' ||
          activeFocusOrgan === 'kidneys',
      },
      {
        id: 'conn-mobility',
        panelSelector: '[data-panel-anchor="panel-mobility"]',
        organAnchor: 'skeleton',
        side: 'right',
        status: tones.skeleton,
        highlighted: activeFocusOrgan === 'skeleton',
      },
    ],
    [activeFocusOrgan, tones.brain, tones.heart, tones.liver, tones.lungs, tones.skeleton]
  );

  const organSelectorButtons: { key: OrganKey; label: string }[] = [
    { key: 'brain', label: 'Brain' },
    { key: 'lungs', label: 'Lungs' },
    { key: 'heart', label: 'Heart' },
    { key: 'liver', label: 'Liver' },
    { key: 'stomach', label: 'Stomach' },
    { key: 'intestines', label: 'Intestines' },
    { key: 'kidneys', label: 'Kidneys' },
    { key: 'skeleton', label: 'Skeleton' },
  ];

  return (
    <section
      aria-label="Interactive Human Body Vitals Monitor"
      className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
    >
      {/* Top Clinical Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pb-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-sky-700 dark:text-sky-400">
              Anatomical Vitals Twin
            </span>
            <span aria-hidden="true">·</span>
            <span>Simulated Holographic Telemetry</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{activePatient.vitals.recordedAt}</span>
          </div>
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-slate-50 mt-0.5">
            Patient Organ-System &amp; Vitals Overview
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <label htmlFor="body-vitals-patient-select" className="sr-only">
            Select Patient for Anatomical Vitals View
          </label>
          <select
            id="body-vitals-patient-select"
            value={activePatient.id}
            onChange={(e) => onSelectPatient(e.target.value)}
            className="h-9 w-full sm:w-auto max-w-full sm:max-w-[245px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            {patientOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} · {p.name} ({p.department})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => onInspectPatient(activePatient.id)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            <Eye className="w-3.5 h-3.5" aria-hidden="true" />
            Inspect Record
          </button>

          <button
            type="button"
            onClick={() => onOpenDecisionSupport(activePatient.id)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 px-3.5 py-2 text-xs font-semibold text-white transition-colors whitespace-nowrap"
          >
            <Stethoscope className="w-3.5 h-3.5" aria-hidden="true" />
            Decision Support
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* System-Harmonized Clinical Holographic Stage (Light Ice-Sky Default + Deep-Navy Dark Mode) */}
      <div
        ref={stageRef}
        className="relative rounded-xl border border-sky-200/80 dark:border-cyan-500/25 overflow-hidden bg-slate-50 dark:bg-slate-950 p-3 sm:p-5"
      >
        <HolographicEnvironmentBackdrop />

        {/* Dynamic SVG Organ-to-Panel Connectors (Desktop/Large Tablet) */}
        <OrganConnectors
          containerRef={stageRef}
          bindings={connectorBindings}
          layoutVersion={`${activePatient.id}-${zoomMode}-${showSkeleton}-${activeFocusOrgan}`}
        />

        {/* Stage Sub-header */}
        <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-200/80 dark:border-cyan-400/15">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-200">
              <span className="font-semibold text-slate-900 dark:text-white">{activePatient.name}</span>
              <span className="font-mono text-sky-700 dark:text-cyan-300/80">
                {activePatient.id} · {activePatient.age}y {activePatient.gender}
              </span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
              <span className="text-slate-600 dark:text-cyan-200/90 truncate max-w-[340px]">
                {activePatient.primaryCondition}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowSkeleton((v) => !v)}
              aria-pressed={showSkeleton}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition-colors whitespace-nowrap ${
                showSkeleton
                  ? 'border-sky-300 bg-sky-50 text-sky-800 dark:border-cyan-400/60 dark:bg-cyan-950/60 dark:text-cyan-100'
                  : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" aria-hidden="true" />
              Skeletal Layer
            </button>

            <button
              type="button"
              onClick={() => setZoomMode((z) => (z === 'full' ? 'thorax' : 'full'))}
              aria-pressed={zoomMode === 'thorax'}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:border-sky-300 text-slate-700 hover:text-sky-800 dark:border-cyan-400/40 dark:bg-slate-900/80 dark:text-cyan-100 dark:hover:border-cyan-300 px-2.5 py-1.5 text-[11px] font-medium transition-colors whitespace-nowrap"
            >
              {zoomMode === 'thorax' ? (
                <>
                  <ZoomOut className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Full Body</span>
                </>
              ) : (
                <>
                  <ZoomIn className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Thorax Focus</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 3-Column Holographic Composition: Left Intelligence Panels (3) | Central Anatomy (6) | Right Intelligence Panels (3) */}
        <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          {/* Left Wing Panels: A (Brain), B (Respiratory), C (Cardiac), D (Imaging) */}
          <div className="lg:col-span-3 space-y-3 order-2 lg:order-1">
            <BrainPanel
              cognitiveScore={ext.cognitiveScore}
              neuroStatusLabel={ext.neuroStatusLabel}
              meanArterialPressure={telemetry.meanArterialPressure}
              statusTone={tones.brain}
              statusLabel={sysMap.neuro.status}
              highlighted={activeFocusOrgan === 'brain'}
              onSelect={() => setSelectedOrgan('brain')}
              onHoverChange={(h) => setHoveredOrgan(h ? 'brain' : null)}
            />

            <RespiratoryPanel
              spo2={activePatient.vitals.spo2}
              respiratoryRate={activePatient.vitals.respiratoryRate}
              statusTone={tones.lungs}
              statusLabel={sysMap.respiratory.status}
              highlighted={activeFocusOrgan === 'lungs'}
              onSelect={() => setSelectedOrgan('lungs')}
              onHoverChange={(h) => setHoveredOrgan(h ? 'lungs' : null)}
            />

            <CardiacPanel
              heartRate={activePatient.vitals.heartRate}
              bpSystolic={activePatient.vitals.bpSystolic}
              bpDiastolic={activePatient.vitals.bpDiastolic}
              ecgSeries={telemetry.ecgSeries}
              statusTone={tones.heart}
              statusLabel={sysMap.cardio.status}
              highlighted={activeFocusOrgan === 'heart'}
              onSelect={() => setSelectedOrgan('heart')}
              onHoverChange={(h) => setHoveredOrgan(h ? 'heart' : null)}
            />

            <ImagingPanel
              imagingCases={imagingCases}
              highlighted={false}
              onOpenImaging={onOpenImaging}
              onHoverChange={(h) => setHoveredOrgan(h ? 'lungs' : null)}
            />
          </div>

          {/* Center Stage (~50% width): Full Holographic Human Body & Interactive Organs */}
          <div className="lg:col-span-6 flex flex-col items-center justify-between order-1 lg:order-2">
            <div className="relative w-full flex items-center justify-center overflow-hidden rounded-xl py-1">
              <svg
                viewBox={zoomMode === 'thorax' ? '75 18 230 275' : '0 0 380 555'}
                className="w-full max-w-[420px] h-[410px] sm:h-[470px] select-none transition-all duration-300"
                role="img"
                aria-label="Holographic human anatomical body model showing brain, lungs, heart, liver, stomach, intestines, kidneys, and skeletal system"
              >
                <HolographicSvgDefs />
                <ScanningBeam />
                <HumanSilhouette />
                {showSkeleton && (
                  <Skeleton
                    selected={selectedOrgan === 'skeleton'}
                    hovered={hoveredOrgan === 'skeleton'}
                    status={tones.skeleton}
                    onSelect={setSelectedOrgan}
                    onHover={setHoveredOrgan}
                  />
                )}
                <Kidneys
                  selected={selectedOrgan === 'kidneys'}
                  hovered={hoveredOrgan === 'kidneys'}
                  status={tones.kidneys}
                  onSelect={setSelectedOrgan}
                  onHover={setHoveredOrgan}
                />
                <Intestines
                  selected={selectedOrgan === 'intestines'}
                  hovered={hoveredOrgan === 'intestines'}
                  status={tones.intestines}
                  onSelect={setSelectedOrgan}
                  onHover={setHoveredOrgan}
                />
                <Stomach
                  selected={selectedOrgan === 'stomach'}
                  hovered={hoveredOrgan === 'stomach'}
                  status={tones.stomach}
                  onSelect={setSelectedOrgan}
                  onHover={setHoveredOrgan}
                />
                <Liver
                  selected={selectedOrgan === 'liver'}
                  hovered={hoveredOrgan === 'liver'}
                  status={tones.liver}
                  onSelect={setSelectedOrgan}
                  onHover={setHoveredOrgan}
                />
                <Lungs
                  selected={selectedOrgan === 'lungs'}
                  hovered={hoveredOrgan === 'lungs'}
                  status={tones.lungs}
                  onSelect={setSelectedOrgan}
                  onHover={setHoveredOrgan}
                />
                <Heart
                  selected={selectedOrgan === 'heart'}
                  hovered={hoveredOrgan === 'heart'}
                  status={tones.heart}
                  onSelect={setSelectedOrgan}
                  onHover={setHoveredOrgan}
                />
                <Brain
                  selected={selectedOrgan === 'brain'}
                  hovered={hoveredOrgan === 'brain'}
                  status={tones.brain}
                  onSelect={setSelectedOrgan}
                  onHover={setHoveredOrgan}
                />
                <DataParticles />
              </svg>
            </div>

            {/* Interactive Organ Quick-Picker Strip below Pedestal */}
            <div
              className="mt-1.5 flex flex-wrap items-center justify-center gap-1"
              role="group"
              aria-label="Inspect anatomical organs"
            >
              {organSelectorButtons.map((item) => {
                const isActive = activeFocusOrgan === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSelectedOrgan(item.key)}
                    onMouseEnter={() => setHoveredOrgan(item.key)}
                    onMouseLeave={() => setHoveredOrgan(null)}
                    aria-pressed={selectedOrgan === item.key}
                    className={`rounded-md border px-2 py-0.5 text-[10.5px] font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? 'border-sky-500 bg-sky-600 text-white shadow-xs dark:border-cyan-300 dark:bg-cyan-500/20 dark:text-white'
                        : 'border-slate-200 bg-white/95 text-slate-700 hover:border-sky-300 hover:text-sky-800 dark:border-cyan-500/25 dark:bg-slate-900/75 dark:text-slate-300 dark:hover:border-cyan-400/60 dark:hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Wing Panels: G (AI Medical), E (Metabolic), F (Mobility) + Focused Organ Readout */}
          <div className="lg:col-span-3 space-y-3 order-3">
            <AiIntelligencePanel
              riskLevel={activePatient.riskLevel}
              riskScore={activePatient.riskScore}
              stabilityIndex={telemetry.physiologicalStabilityIndex}
              aiAnalysisStatus={ext.aiAnalysisStatus}
              monitoringStatus={activePatient.status}
              highlighted={false}
              onSelect={() => onOpenDecisionSupport(activePatient.id)}
              onHoverChange={() => {}}
            />

            <MetabolicPanel
              glucoseMgDl={ext.glucoseMgDl}
              bmi={ext.bmi}
              temperatureC={activePatient.vitals.temperatureC}
              metabolicStatusLabel={ext.metabolicStatusLabel}
              statusTone={tones.liver}
              highlighted={
                activeFocusOrgan === 'liver' ||
                activeFocusOrgan === 'stomach' ||
                activeFocusOrgan === 'intestines' ||
                activeFocusOrgan === 'kidneys'
              }
              onSelect={() => setSelectedOrgan('liver')}
              onHoverChange={(h) => setHoveredOrgan(h ? 'liver' : null)}
            />

            <MobilityPanel
              mobilityScore={ext.mobilityScore}
              jointHealthLabel={ext.jointHealthLabel}
              musculoskeletalAssessment={ext.musculoskeletalAssessment}
              statusTone={tones.skeleton}
              statusLabel={sysMap.musculoskeletal.status}
              highlighted={activeFocusOrgan === 'skeleton'}
              onSelect={() => setSelectedOrgan('skeleton')}
              onHoverChange={(h) => setHoveredOrgan(h ? 'skeleton' : null)}
            />

            {/* Selected Organ Clinical Detail Inspector */}
            <div
              role="region"
              aria-label="Selected Organ Detail Readout"
              className="rounded-xl border border-sky-200 dark:border-cyan-400/40 bg-white/95 dark:bg-slate-900/85 backdrop-blur-md p-3 shadow-[0_2px_10px_rgba(15,23,42,0.04)]"
            >
              <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-100 dark:border-cyan-400/15">
                <span className="text-[11px] font-semibold text-sky-800 dark:text-cyan-200 truncate">
                  {activeOrganDetail.title}
                </span>
                <HoloStatusBadge
                  label={activeOrganDetail.status}
                  tone={activeOrganDetail.tone}
                />
              </div>
              <div className="mt-2 font-mono text-xs font-semibold text-slate-900 dark:text-white tabular-nums">
                {activeOrganDetail.metric}
              </div>
              <p className="mt-1 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeOrganDetail.note}
              </p>
              <div className="mt-1.5 text-[10px] text-slate-400">
                Illustrative demonstration telemetry · Clinician review required.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

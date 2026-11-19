import type {
  DepartmentName,
  PatientRecord,
  RiskClassification,
  VitalSnapshot,
} from '../types/healthcare';

export function classifyRiskLevel(score: number): RiskClassification {
  if (score >= 80) return 'Critical';
  if (score >= 60) return 'High';
  if (score >= 35) return 'Moderate';
  return 'Low';
}

export function computeRiskScore(input: {
  age: number;
  vitals: VitalSnapshot;
  comorbidityCount: number;
}): number {
  let score = 15;

  if (input.age >= 70) score += 20;
  else if (input.age >= 55) score += 12;
  else if (input.age >= 40) score += 6;

  if (input.vitals.bpSystolic >= 160 || input.vitals.bpDiastolic >= 100) score += 24;
  else if (input.vitals.bpSystolic >= 140 || input.vitals.bpDiastolic >= 90) score += 16;
  else if (input.vitals.bpSystolic < 90) score += 22;

  if (input.vitals.heartRate >= 110 || input.vitals.heartRate <= 48) score += 16;
  else if (input.vitals.heartRate >= 90) score += 8;

  if (input.vitals.spo2 <= 91) score += 25;
  else if (input.vitals.spo2 <= 94) score += 14;
  else if (input.vitals.spo2 <= 96) score += 4;

  if (input.vitals.temperatureC >= 38.5) score += 10;

  score += Math.min(20, input.comorbidityCount * 6);

  return Math.max(5, Math.min(99, Math.round(score)));
}

export interface VitalsAlertEvaluation {
  indicators: {
    label: string;
    value: string;
    status: 'Normal' | 'Elevated' | 'Warning' | 'Critical';
    reference: string;
  }[];
  overallAcuity: RiskClassification;
  concerns: string[];
  suggestedAssessments: string[];
}

export function evaluateVitalsForDecisionSupport(
  vitals: VitalSnapshot,
  presentingConcern: string,
  medicalHistory: string[]
): VitalsAlertEvaluation {
  const concerns: string[] = [];
  const suggestedAssessments: string[] = [];

  let bpStatus: 'Normal' | 'Elevated' | 'Warning' | 'Critical' = 'Normal';
  if (vitals.bpSystolic >= 180 || vitals.bpDiastolic >= 120) {
    bpStatus = 'Critical';
    concerns.push(`Hypertensive crisis range blood pressure (${vitals.bpSystolic}/${vitals.bpDiastolic} mmHg) requiring urgent clinician evaluation.`);
    suggestedAssessments.push('Repeat manual cuff BP in both arms and assess for acute target-organ symptoms.');
  } else if (vitals.bpSystolic >= 140 || vitals.bpDiastolic >= 90) {
    bpStatus = 'Warning';
    concerns.push(`Stage 2 elevated blood pressure (${vitals.bpSystolic}/${vitals.bpDiastolic} mmHg) above target cardiovascular threshold.`);
    suggestedAssessments.push('Review antihypertensive medication adherence, sodium intake, and ambulatory BP log.');
  } else if (vitals.bpSystolic >= 130 || vitals.bpDiastolic >= 80) {
    bpStatus = 'Elevated';
    concerns.push(`Mildly elevated arterial blood pressure (${vitals.bpSystolic}/${vitals.bpDiastolic} mmHg).`);
  }

  let hrStatus: 'Normal' | 'Elevated' | 'Warning' | 'Critical' = 'Normal';
  if (vitals.heartRate >= 115 || vitals.heartRate < 45) {
    hrStatus = 'Critical';
    concerns.push(`Marked heart rate abnormality (${vitals.heartRate} bpm).`);
    suggestedAssessments.push('Obtain 12-lead ECG and evaluate electrolyte / thyroid status.');
  } else if (vitals.heartRate >= 90) {
    hrStatus = 'Elevated';
    concerns.push(`Upper-normal / borderline resting heart rate (${vitals.heartRate} bpm), potentially reflecting sympathetic activation.`);
    suggestedAssessments.push('Consider resting 12-lead ECG and trend comparison against prior baseline.');
  }

  let spo2Status: 'Normal' | 'Elevated' | 'Warning' | 'Critical' = 'Normal';
  if (vitals.spo2 <= 91) {
    spo2Status = 'Critical';
    concerns.push(`Hypoxemia detected (SpO2 ${vitals.spo2}%).`);
    suggestedAssessments.push('Perform arterial blood gas / chest radiograph evaluation and assess supplemental oxygen need.');
  } else if (vitals.spo2 <= 94) {
    spo2Status = 'Warning';
    concerns.push(`Borderline low oxygen saturation (SpO2 ${vitals.spo2}%).`);
    suggestedAssessments.push('Verify pulse oximetry waveform and evaluate cardiopulmonary reserve.');
  }

  let tempStatus: 'Normal' | 'Elevated' | 'Warning' | 'Critical' = 'Normal';
  if (vitals.temperatureC >= 38.5) {
    tempStatus = 'Warning';
    concerns.push(`Febrile temperature (${vitals.temperatureC.toFixed(1)} °C).`);
    suggestedAssessments.push('Screen for infectious focus with CBC and inflammatory markers.');
  } else if (vitals.temperatureC >= 37.6) {
    tempStatus = 'Elevated';
  }

  if (medicalHistory.length > 0) {
    suggestedAssessments.push(
      `Cross-check comorbidities (${medicalHistory.slice(0, 3).join(', ')}) with current renal/lipid panel and drug-interaction profile.`
    );
  }

  if (presentingConcern.toLowerCase().includes('blood pressure') || bpStatus !== 'Normal') {
    suggestedAssessments.push('Evaluate urine albumin-to-creatinine ratio, serum creatinine/potassium, and funduscopic risk markers.');
  }

  const score = computeRiskScore({
    age: 58,
    vitals,
    comorbidityCount: medicalHistory.length,
  });

  return {
    indicators: [
      {
        label: 'Blood Pressure',
        value: `${vitals.bpSystolic}/${vitals.bpDiastolic} mmHg`,
        status: bpStatus,
        reference: '< 120/80 mmHg',
      },
      {
        label: 'Heart Rate',
        value: `${vitals.heartRate} bpm`,
        status: hrStatus,
        reference: '60–90 bpm',
      },
      {
        label: 'Oxygen Saturation',
        value: `${vitals.spo2}%`,
        status: spo2Status,
        reference: '95–100%',
      },
      {
        label: 'Body Temperature',
        value: `${vitals.temperatureC.toFixed(1)} °C`,
        status: tempStatus,
        reference: '36.1–37.4 °C',
      },
    ],
    overallAcuity: classifyRiskLevel(score),
    concerns:
      concerns.length > 0
        ? concerns
        : ['Vital signs fall within nominal resting reference limits for this demonstration record.'],
    suggestedAssessments,
  };
}

export interface PatientFilterCriteria {
  query?: string;
  department?: DepartmentName | 'All';
  riskLevel?: RiskClassification | 'All';
  city?: string | 'All';
}

export function filterPatients(
  patients: PatientRecord[],
  criteria: PatientFilterCriteria
): PatientRecord[] {
  const q = (criteria.query ?? '').trim().toLowerCase();
  return patients.filter((p) => {
    if (criteria.department && criteria.department !== 'All' && p.department !== criteria.department) {
      return false;
    }
    if (criteria.riskLevel && criteria.riskLevel !== 'All' && p.riskLevel !== criteria.riskLevel) {
      return false;
    }
    if (criteria.city && criteria.city !== 'All' && p.city !== criteria.city) {
      return false;
    }
    if (!q) return true;
    return (
      p.id.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.primaryCondition.toLowerCase().includes(q) ||
      p.department.toLowerCase().includes(q) ||
      p.hospital.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q)
    );
  });
}

export type PatientSortKey = 'id' | 'name' | 'age' | 'riskScore' | 'department' | 'lastExamination';

export function sortPatients(
  patients: PatientRecord[],
  sortKey: PatientSortKey,
  direction: 'asc' | 'desc'
): PatientRecord[] {
  const factor = direction === 'asc' ? 1 : -1;
  return [...patients].sort((a, b) => {
    switch (sortKey) {
      case 'age':
        return (a.age - b.age) * factor;
      case 'riskScore':
        return (a.riskScore - b.riskScore) * factor;
      case 'name':
        return a.name.localeCompare(b.name) * factor;
      case 'department':
        return a.department.localeCompare(b.department) * factor;
      case 'lastExamination':
        return a.lastExamination.localeCompare(b.lastExamination) * factor;
      case 'id':
      default:
        return a.id.localeCompare(b.id) * factor;
    }
  });
}

export function escapeCsvCell(value: string | number | boolean | null | undefined): string {
  const raw = value === null || value === undefined ? '' : String(value);
  if (raw.includes(',') || raw.includes('"') || raw.includes('\n') || raw.includes('\r')) {
    return `"${raw.replace(/"/g, '""')}"`;
  }
  return raw;
}

export function formatCsvContent(
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][]
): string {
  const headerLine = headers.map(escapeCsvCell).join(',');
  const dataLines = rows.map((row) => row.map(escapeCsvCell).join(','));
  return [headerLine, ...dataLines].join('\n');
}

export type BodySystemId = 'cardio' | 'respiratory' | 'neuro' | 'metabolic' | 'musculoskeletal';

export interface BodySystemAssessment {
  id: BodySystemId;
  label: string;
  organName: string;
  primaryMetricLabel: string;
  primaryMetricValue: string;
  secondaryMetric: string;
  status: 'Normal' | 'Elevated' | 'Warning' | 'Critical';
  clinicalNote: string;
}

export interface BodyVitalsTelemetry {
  patientId: string;
  meanArterialPressure: number;
  physiologicalStabilityIndex: number;
  vitalsEvaluation: VitalsAlertEvaluation;
  systems: BodySystemAssessment[];
  ecgSeries: { t: string; mv: number }[];
  trend24h: { time: string; heartRate: number; systolic: number; spo2: number }[];
}

export function computeMeanArterialPressure(bpSystolic: number, bpDiastolic: number): number {
  return Math.round((bpSystolic + 2 * bpDiastolic) / 3);
}

export function generateEcgWaveformSeries(heartRate: number): { t: string; mv: number }[] {
  const safeHr = Math.max(40, Math.min(160, heartRate));
  const cyclePoints = Math.max(18, Math.round((60 / safeHr) * 28));
  const totalPoints = 72;
  const points: { t: string; mv: number }[] = [];

  const rIndexOffset = Math.round(cyclePoints * 0.36);

  for (let i = 0; i < totalPoints; i++) {
    const stepInCycle = i % cyclePoints;
    const phase = stepInCycle / cyclePoints;
    let mv = 0.02 * Math.sin(i * 0.4);

    if (stepInCycle === rIndexOffset) {
      mv = 1.15;
    } else if (stepInCycle === rIndexOffset - 1) {
      mv = -0.18;
    } else if (stepInCycle === rIndexOffset + 1) {
      mv = -0.32;
    } else if (phase >= 0.1 && phase < 0.24) {
      // P wave
      const p = (phase - 0.1) / 0.14;
      mv = 0.16 * Math.sin(p * Math.PI);
    } else if (phase >= 0.54 && phase < 0.76) {
      // T wave
      const tWave = (phase - 0.54) / 0.22;
      mv = 0.28 * Math.sin(tWave * Math.PI);
    }

    const sec = (i * 0.05).toFixed(2);
    points.push({ t: `${sec}s`, mv: Number(mv.toFixed(2)) });
  }

  return points;
}

export function generateVitals24hTrend(
  vitals: VitalSnapshot
): { time: string; heartRate: number; systolic: number; spo2: number }[] {
  const slots = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', 'Now'];
  const hrOffsets = [-7, -9, -4, 2, 4, -1, 0];
  const bpOffsets = [-6, -8, -3, 3, 5, 1, 0];
  const spo2Offsets = [1, 0, 1, 0, -1, 0, 0];

  return slots.map((time, idx) => ({
    time,
    heartRate: Math.max(46, vitals.heartRate + hrOffsets[idx]),
    systolic: Math.max(85, vitals.bpSystolic + bpOffsets[idx]),
    spo2: Math.min(100, Math.max(85, vitals.spo2 + spo2Offsets[idx])),
  }));
}

export function buildBodySystemSnapshot(patient: PatientRecord): BodyVitalsTelemetry {
  const { vitals, medicalHistory, primaryCondition } = patient;
  const vitalsEvaluation = evaluateVitalsForDecisionSupport(
    vitals,
    primaryCondition,
    medicalHistory
  );
  const mapValue = computeMeanArterialPressure(vitals.bpSystolic, vitals.bpDiastolic);

  const bpIndicator = vitalsEvaluation.indicators.find((i) => i.label === 'Blood Pressure');
  const hrIndicator = vitalsEvaluation.indicators.find((i) => i.label === 'Heart Rate');
  const spo2Indicator = vitalsEvaluation.indicators.find((i) => i.label === 'Oxygen Saturation');
  const tempIndicator = vitalsEvaluation.indicators.find((i) => i.label === 'Body Temperature');

  const cardioStatus =
    bpIndicator?.status === 'Critical' || hrIndicator?.status === 'Critical'
      ? 'Critical'
      : bpIndicator?.status === 'Warning' || hrIndicator?.status === 'Warning'
      ? 'Warning'
      : bpIndicator?.status === 'Elevated' || hrIndicator?.status === 'Elevated'
      ? 'Elevated'
      : 'Normal';

  const respiratoryStatus =
    spo2Indicator?.status === 'Critical' || vitals.respiratoryRate >= 26
      ? 'Critical'
      : spo2Indicator?.status === 'Warning' || vitals.respiratoryRate >= 22
      ? 'Warning'
      : vitals.respiratoryRate >= 20
      ? 'Elevated'
      : 'Normal';

  const hasNeuroHistory =
    patient.department === 'Neurology' ||
    medicalHistory.some((m) => m.toLowerCase().includes('migraine') || m.toLowerCase().includes('tia'));

  const neuroStatus: BodySystemAssessment['status'] =
    vitals.spo2 <= 91 || vitals.bpSystolic >= 180
      ? 'Critical'
      : hasNeuroHistory || vitals.bpSystolic >= 155
      ? 'Elevated'
      : 'Normal';

  const hasMetabolicHistory =
    patient.department === 'Endocrinology' ||
    patient.department === 'Nephrology' ||
    medicalHistory.some(
      (m) =>
        m.toLowerCase().includes('diabetes') ||
        m.toLowerCase().includes('dyslipidemia') ||
        m.toLowerCase().includes('kidney')
    );

  const metabolicStatus: BodySystemAssessment['status'] =
    tempIndicator?.status === 'Warning'
      ? 'Warning'
      : tempIndicator?.status === 'Elevated' || hasMetabolicHistory
      ? 'Elevated'
      : 'Normal';

  const hasOrthoHistory =
    patient.department === 'Orthopaedics' || patient.status === 'ICU Observation';
  const musculoskeletalStatus: BodySystemAssessment['status'] =
    patient.status === 'ICU Observation'
      ? 'Warning'
      : hasOrthoHistory
      ? 'Elevated'
      : 'Normal';

  const physiologicalStabilityIndex = Math.max(
    28,
    Math.min(97, Math.round(100 - patient.riskScore * 0.65))
  );

  const systems: BodySystemAssessment[] = [
    {
      id: 'cardio',
      label: 'Cardiovascular',
      organName: 'Heart & Vascular',
      primaryMetricLabel: 'BP / HR',
      primaryMetricValue: `${vitals.bpSystolic}/${vitals.bpDiastolic} · ${vitals.heartRate} bpm`,
      secondaryMetric: `MAP ${mapValue} mmHg`,
      status: cardioStatus,
      clinicalNote:
        cardioStatus === 'Normal'
          ? 'Hemodynamic resting tone and heart rate within reference targets.'
          : `Arterial pressure (${vitals.bpSystolic}/${vitals.bpDiastolic} mmHg) and pulse (${vitals.heartRate} bpm) flagged for review.`,
    },
    {
      id: 'respiratory',
      label: 'Respiratory',
      organName: 'Lungs & Airway',
      primaryMetricLabel: 'SpO₂ / RR',
      primaryMetricValue: `${vitals.spo2}% · ${vitals.respiratoryRate} /min`,
      secondaryMetric: vitals.spo2 >= 95 ? 'Room Air Nominal' : 'Oxygen Review Needed',
      status: respiratoryStatus,
      clinicalNote:
        respiratoryStatus === 'Normal'
          ? 'Pulse oximetry and unlabored respiratory cadence remain steady.'
          : `Monitor pulmonary gas exchange (${vitals.spo2}% SpO2, ${vitals.respiratoryRate} breaths/min).`,
    },
    {
      id: 'neuro',
      label: 'Neurological',
      organName: 'Brain & Autonomic',
      primaryMetricLabel: 'Perfusion / GCS',
      primaryMetricValue: `MAP ${mapValue} · GCS 15/15`,
      secondaryMetric: hasNeuroHistory ? 'Neurology Track' : 'Alert & Oriented',
      status: neuroStatus,
      clinicalNote:
        neuroStatus === 'Normal'
          ? 'Autonomic tone and cerebral perfusion proxy remain balanced.'
          : 'Elevated systemic pressure or neuro history warrants headache/TIA symptom check.',
    },
    {
      id: 'metabolic',
      label: 'Metabolic & Renal',
      organName: 'Endocrine & Renal',
      primaryMetricLabel: 'Core Temp',
      primaryMetricValue: `${vitals.temperatureC.toFixed(1)} °C`,
      secondaryMetric: hasMetabolicHistory ? 'Comorbidity Flag' : 'Afebrile',
      status: metabolicStatus,
      clinicalNote: hasMetabolicHistory
        ? `Cross-monitor metabolic & renal panel alongside ${medicalHistory.slice(0, 2).join(', ') || 'baseline history'}.`
        : 'Core thermoregulation within nominal clinical limits.',
    },
    {
      id: 'musculoskeletal',
      label: 'Musculoskeletal',
      organName: 'Mobility & Recovery',
      primaryMetricLabel: 'Mobility Tier',
      primaryMetricValue: patient.status === 'ICU Observation' ? 'Bed Rest' : 'Ambulatory',
      secondaryMetric: `Eng. ${patient.engagementScore}%`,
      status: musculoskeletalStatus,
      clinicalNote:
        patient.status === 'ICU Observation'
          ? 'Inpatient acute monitoring; bedside physical therapy protocol active.'
          : 'Cleared for routine ambulation and home blood-pressure/activity tracking.',
    },
  ];

  return {
    patientId: patient.id,
    meanArterialPressure: mapValue,
    physiologicalStabilityIndex,
    vitalsEvaluation,
    systems,
    ecgSeries: generateEcgWaveformSeries(vitals.heartRate),
    trend24h: generateVitals24hTrend(vitals),
  };
}

export interface ExtendedOrganMetrics {
  cognitiveScore: number;
  neuroStatusLabel: string;
  glucoseMgDl: number;
  bmi: number;
  metabolicStatusLabel: string;
  mobilityScore: number;
  jointHealthLabel: string;
  musculoskeletalAssessment: string;
  aiAnalysisStatus: string;
}

export function computeExtendedOrganMetrics(patient: PatientRecord): ExtendedOrganMetrics {
  const historyLower = patient.medicalHistory.join(' ').toLowerCase();
  const hasDiabetes = historyLower.includes('diabetes') || historyLower.includes('hba1c') || patient.department === 'Endocrinology';
  const hasDyslipidemia = historyLower.includes('dyslipidemia') || historyLower.includes('fatty liver');
  const hasNeuro = patient.department === 'Neurology' || historyLower.includes('migraine') || historyLower.includes('tia');
  const hasJoint = patient.department === 'Orthopaedics' || historyLower.includes('arthritis') || historyLower.includes('disc');

  const cognitiveScore = Math.max(
    68,
    Math.min(98, Math.round(95 - (hasNeuro ? 11 : 0) - (patient.vitals.spo2 < 95 ? 7 : 0) - Math.max(0, patient.age - 65) * 0.25))
  );

  const neuroStatusLabel =
    patient.vitals.bpSystolic >= 165 || hasNeuro
      ? 'Focused Neuro Review'
      : patient.vitals.bpSystolic >= 145
      ? 'Perfusion Monitored'
      : 'Nominal Alertness';

  const glucoseMgDl = Math.round(
    94 + (hasDiabetes ? 44 : hasDyslipidemia ? 18 : 6) + (patient.riskScore % 17)
  );
  const bmi = Number(
    (22.1 + (hasDyslipidemia ? 3.2 : 1.1) + (hasDiabetes ? 1.8 : 0) + ((patient.age % 7) * 0.2)).toFixed(1)
  );
  const metabolicStatusLabel =
    glucoseMgDl >= 140 ? 'Glycaemic Watch' : glucoseMgDl >= 110 ? 'Borderline' : 'Balanced';

  const mobilityScore = Math.max(
    42,
    Math.min(
      96,
      Math.round(
        (patient.status === 'ICU Observation' ? 48 : 88) -
          (hasJoint ? 18 : 0) -
          Math.max(0, patient.age - 62) * 0.35 +
          (patient.engagementScore - 80) * 0.2
      )
    )
  );

  const jointHealthLabel =
    patient.status === 'ICU Observation'
      ? 'Assisted Rest'
      : hasJoint
      ? 'Mild Joint Strain'
      : 'Full Range Nominal';

  const musculoskeletalAssessment =
    patient.status === 'ICU Observation'
      ? 'In-bed physiotherapy & pressure monitoring'
      : hasJoint
      ? 'Targeted orthopaedic mobility & gait tracking'
      : 'Ambulatory · Routine posture & balance baseline';

  const aiAnalysisStatus =
    patient.riskLevel === 'Critical' || patient.riskLevel === 'High'
      ? 'Priority Clinical Review'
      : patient.riskLevel === 'Moderate'
      ? 'Active Risk Watch'
      : 'Routine Surveillance';

  return {
    cognitiveScore,
    neuroStatusLabel,
    glucoseMgDl,
    bmi,
    metabolicStatusLabel,
    mobilityScore,
    jointHealthLabel,
    musculoskeletalAssessment,
    aiAnalysisStatus,
  };
}

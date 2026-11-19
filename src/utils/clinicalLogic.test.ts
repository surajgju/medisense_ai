import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildBodySystemSnapshot,
  classifyRiskLevel,
  computeExtendedOrganMetrics,
  computeMeanArterialPressure,
  computeRiskScore,
  evaluateVitalsForDecisionSupport,
  filterPatients,
  formatCsvContent,
  generateEcgWaveformSeries,
  sortPatients,
} from './clinicalLogic';
import type { PatientRecord } from '../types/healthcare';

test('classifyRiskLevel maps scores accurately', () => {
  assert.equal(classifyRiskLevel(20), 'Low');
  assert.equal(classifyRiskLevel(45), 'Moderate');
  assert.equal(classifyRiskLevel(65), 'High');
  assert.equal(classifyRiskLevel(85), 'Critical');
});

test('computeRiskScore elevates risk for hypertension and low SpO2', () => {
  const healthyScore = computeRiskScore({
    age: 32,
    vitals: {
      bpSystolic: 118,
      bpDiastolic: 76,
      heartRate: 70,
      spo2: 99,
      temperatureC: 36.8,
      respiratoryRate: 16,
      recordedAt: '2026-11-19T09:00:00Z',
    },
    comorbidityCount: 0,
  });

  const criticalScore = computeRiskScore({
    age: 74,
    vitals: {
      bpSystolic: 176,
      bpDiastolic: 104,
      heartRate: 118,
      spo2: 90,
      temperatureC: 38.7,
      respiratoryRate: 24,
      recordedAt: '2026-11-19T09:00:00Z',
    },
    comorbidityCount: 3,
  });

  assert.ok(healthyScore < 35);
  assert.ok(criticalScore >= 80);
});

test('evaluateVitalsForDecisionSupport flags PAT-10284 elevated BP and borderline HR', () => {
  const result = evaluateVitalsForDecisionSupport(
    {
      bpSystolic: 158,
      bpDiastolic: 96,
      heartRate: 92,
      spo2: 97,
      temperatureC: 36.9,
      respiratoryRate: 18,
      recordedAt: '2026-11-19T08:30:00Z',
    },
    'Elevated blood pressure',
    ['Essential Hypertension', 'Dyslipidemia']
  );

  const bpIndicator = result.indicators.find((i) => i.label === 'Blood Pressure');
  const hrIndicator = result.indicators.find((i) => i.label === 'Heart Rate');
  const spo2Indicator = result.indicators.find((i) => i.label === 'Oxygen Saturation');

  assert.equal(bpIndicator?.status, 'Warning');
  assert.equal(hrIndicator?.status, 'Elevated');
  assert.equal(spo2Indicator?.status, 'Normal');
  assert.ok(result.concerns.some((c) => c.includes('158/96')));
  assert.ok(result.suggestedAssessments.length >= 2);
});

test('filterPatients and sortPatients work consistently', () => {
  const sample: PatientRecord[] = [
    {
      id: 'PAT-10284',
      name: 'Rajesh Kulkarni',
      age: 58,
      gender: 'Male',
      city: 'Mumbai',
      hospital: 'Sahyadri Heart Institute',
      department: 'Cardiology',
      primaryCondition: 'Essential Hypertension',
      medicalHistory: ['Dyslipidemia'],
      medications: ['Telmisartan 40mg'],
      allergies: ['None'],
      vitals: {
        bpSystolic: 158,
        bpDiastolic: 96,
        heartRate: 92,
        spo2: 97,
        temperatureC: 36.8,
        respiratoryRate: 17,
        recordedAt: '2026-11-19T08:00:00Z',
      },
      riskScore: 68,
      riskLevel: 'High',
      status: 'Active Outpatient',
      lastExamination: '2026-11-18',
      nextFollowUp: '2026-11-26',
      attendingDoctor: 'Dr. Arun Patel',
      engagementScore: 84,
      phone: '+91 98201 11234',
      bloodGroup: 'B+',
      timeline: [],
    },
    {
      id: 'PAT-10201',
      name: 'Aarav Sharma',
      age: 34,
      gender: 'Male',
      city: 'Bengaluru',
      hospital: 'Indiranagar Multispecialty',
      department: 'General Medicine',
      primaryCondition: 'Seasonal Viral Fever',
      medicalHistory: [],
      medications: ['Paracetamol 500mg'],
      allergies: ['Sulfa drugs'],
      vitals: {
        bpSystolic: 118,
        bpDiastolic: 76,
        heartRate: 74,
        spo2: 99,
        temperatureC: 37.1,
        respiratoryRate: 16,
        recordedAt: '2026-11-19T07:00:00Z',
      },
      riskScore: 22,
      riskLevel: 'Low',
      status: 'Active Outpatient',
      lastExamination: '2026-11-19',
      nextFollowUp: '2026-11-25',
      attendingDoctor: 'Dr. Nandini Rao',
      engagementScore: 91,
      phone: '+91 98450 22345',
      bloodGroup: 'O+',
      timeline: [],
    },
  ];

  const filtered = filterPatients(sample, { query: '10284', department: 'Cardiology' });
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].name, 'Rajesh Kulkarni');

  const sortedDesc = sortPatients(sample, 'riskScore', 'desc');
  assert.equal(sortedDesc[0].id, 'PAT-10284');
  assert.equal(sortedDesc[1].id, 'PAT-10201');
});

test('formatCsvContent escapes commas and quotes properly', () => {
  const csv = formatCsvContent(
    ['ID', 'Name', 'Notes'],
    [['PAT-10284', 'Kulkarni, Rajesh', 'BP "158/96" elevated']]
  );
  assert.equal(csv, 'ID,Name,Notes\nPAT-10284,"Kulkarni, Rajesh","BP ""158/96"" elevated"');
});

test('computeMeanArterialPressure and generateEcgWaveformSeries produce valid physiological telemetry', () => {
  assert.equal(computeMeanArterialPressure(158, 96), 117);
  const ecg = generateEcgWaveformSeries(92);
  assert.equal(ecg.length, 72);
  assert.ok(ecg.some((pt) => pt.mv > 0.9), 'ECG trace should include R-wave peak');
});

test('buildBodySystemSnapshot maps all five anatomical systems accurately for PAT-10284', () => {
  const samplePatient: PatientRecord = {
    id: 'PAT-10284',
    name: 'Rajesh Kulkarni',
    age: 58,
    gender: 'Male',
    city: 'Mumbai',
    hospital: 'Sahyadri Heart Institute',
    department: 'Cardiology',
    primaryCondition: 'Elevated Blood Pressure',
    medicalHistory: ['Essential Hypertension', 'Dyslipidemia'],
    medications: ['Amlodipine 5mg'],
    allergies: ['None'],
    vitals: {
      bpSystolic: 158,
      bpDiastolic: 96,
      heartRate: 92,
      spo2: 97,
      temperatureC: 36.9,
      respiratoryRate: 18,
      recordedAt: '2026-11-19 08:45 IST',
    },
    riskScore: 68,
    riskLevel: 'High',
    status: 'Active Outpatient',
    lastExamination: '2026-11-19',
    nextFollowUp: '2026-11-26',
    attendingDoctor: 'Dr. Arun Patel',
    engagementScore: 86,
    phone: '+91 98204 51284',
    bloodGroup: 'B+',
    timeline: [],
  };

  const snapshot = buildBodySystemSnapshot(samplePatient);
  assert.equal(snapshot.systems.length, 5);
  assert.equal(snapshot.meanArterialPressure, 117);
  const cardio = snapshot.systems.find((s) => s.id === 'cardio');
  const respiratory = snapshot.systems.find((s) => s.id === 'respiratory');
  assert.equal(cardio?.status, 'Warning');
  assert.equal(respiratory?.status, 'Normal');
  assert.equal(snapshot.trend24h.length, 7);

  const ext = computeExtendedOrganMetrics(samplePatient);
  assert.ok(ext.cognitiveScore >= 68 && ext.cognitiveScore <= 98);
  assert.ok(ext.glucoseMgDl >= 90);
  assert.ok(ext.bmi >= 20);
  assert.ok(ext.mobilityScore >= 42 && ext.mobilityScore <= 96);
  assert.equal(ext.aiAnalysisStatus, 'Priority Clinical Review');
});

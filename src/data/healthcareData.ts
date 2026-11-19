import type {
  AgentExecution,
  AiAgent,
  AppointmentRecord,
  ClinicalAlert,
  DepartmentName,
  DiagnosticCase,
  FollowUpRecord,
  HospitalCapacityUnit,
  ImagingCase,
  ImagingModality,
  IntegrationSystem,
  LabReport,
  MedicationInteraction,
  PatientRecord,
  UserAccount,
} from '../types/healthcare';
import { classifyRiskLevel, computeRiskScore } from '../utils/clinicalLogic';

export const DEPARTMENTS: DepartmentName[] = [
  'Cardiology',
  'Neurology',
  'Oncology',
  'Pulmonology',
  'Endocrinology',
  'Orthopaedics',
  'Nephrology',
  'Emergency Medicine',
  'General Medicine',
  'Paediatrics',
];

export const INDIAN_CITIES = [
  'Mumbai',
  'Bengaluru',
  'New Delhi',
  'Hyderabad',
  'Chennai',
  'Pune',
] as const;

export const HOSPITALS: { name: string; city: string }[] = [
  { name: 'Sahyadri Heart & Neuro Institute', city: 'Mumbai' },
  { name: 'Indiranagar Multispecialty Hospital', city: 'Bengaluru' },
  { name: 'Indraprastha Care & Diagnostics', city: 'New Delhi' },
  { name: 'Jubilee Hills Medical Centre', city: 'Hyderabad' },
  { name: 'Adyar Clinical Research Hospital', city: 'Chennai' },
  { name: 'Deccan Regional Medicity', city: 'Pune' },
];

export const DOCTORS_BY_DEPT: Record<DepartmentName, string[]> = {
  Cardiology: ['Dr. Arun Patel', 'Dr. Kavita Deshpande', 'Dr. Rakesh Nair'],
  Neurology: ['Dr. Nandini Rao', 'Dr. Vivek Subramanian'],
  Oncology: ['Dr. Farhan Qureshi', 'Dr. Meenakshi Iyer'],
  Pulmonology: ['Dr. Siddharth Menon', 'Dr. Anjali Kulkarni'],
  Endocrinology: ['Dr. Deepika Verma', 'Dr. Saurabh Chatterjee'],
  Orthopaedics: ['Dr. Harishankar Iyer', 'Dr. Vikramaditya Bose'],
  Nephrology: ['Dr. Rohini Venkataraman', 'Dr. Arvind Malhotra'],
  'Emergency Medicine': ['Dr. Pranav Joshi', 'Dr. Shalini Nambiar'],
  'General Medicine': ['Dr. Ashwin Gokhale', 'Dr. Priya Banerjee'],
  Paediatrics: ['Dr. Sneha Hegde', 'Dr. Manish Tiwari'],
};

const FIRST_NAMES_M = [
  'Aarav', 'Rajesh', 'Vikram', 'Karthik', 'Rohan', 'Aditya', 'Siddharth', 'Pranav',
  'Nikhil', 'Arjun', 'Suresh', 'Mahesh', 'Deepak', 'Anirudh', 'Gaurav', 'Tarun',
  'Mohammed', 'Imran', 'Harish', 'Varun', 'Devansh', 'Kunal', 'Manoj', 'Raghav',
  'Sanjay', 'Venkatesh', 'Ashok', 'Pradeep', 'Yash', 'Omkar',
];

const FIRST_NAMES_F = [
  'Priya', 'Ananya', 'Sneha', 'Meera', 'Kavita', 'Divya', 'Neha', 'Pooja',
  'Shruti', 'Lakshmi', 'Nandini', 'Aishwarya', 'Ritu', 'Sunita', 'Rekha', 'Swati',
  'Ayesha', 'Zoya', 'Padma', 'Bhavna', 'Chitra', 'Gayatri', 'Pallavi', 'Radhika',
  'Shalini', 'Vaishali', 'Aparna', 'Kiran', 'Madhuri', 'Archana',
];

const LAST_NAMES = [
  'Kulkarni', 'Sharma', 'Nair', 'Iyer', 'Deshmukh', 'Malhotra', 'Reddy', 'Krishnan',
  'Joshi', 'Choudhary', 'Patel', 'Verma', 'Menon', 'Subramanian', 'Chatterjee', 'Banerjee',
  'Qureshi', 'Khan', 'Agarwal', 'Bhatia', 'Rao', 'Gokhale', 'Sengupta', 'Tiwari',
  'Hegde', 'Venkataraman', 'Kapoor', 'Saxena', 'Desai', 'Bhattacharya',
];

const CONDITIONS_BY_DEPT: Record<DepartmentName, { primary: string; history: string[]; meds: string[] }[]> = {
  Cardiology: [
    { primary: 'Essential Hypertension', history: ['Dyslipidemia', 'Borderline LVH'], meds: ['Telmisartan 40mg OD', 'Atorvastatin 20mg HS'] },
    { primary: 'Coronary Artery Disease', history: ['Type 2 Diabetes', 'Prior PCI 2023'], meds: ['Aspirin 75mg OD', 'Clopidogrel 75mg OD', 'Metoprolol 50mg'] },
    { primary: 'Paroxysmal Atrial Fibrillation', history: ['Hypertension', 'Hypothyroidism'], meds: ['Apixaban 5mg BD', 'Bisoprolol 5mg OD'] },
  ],
  Neurology: [
    { primary: 'Chronic Migraine with Aura', history: ['Cervical Spondylosis'], meds: ['Sumatriptan 50mg PRN', 'Propranolol 40mg OD'] },
    { primary: 'Post-TIA Secondary Prevention', history: ['Hypertension', 'Carotid Plaque'], meds: ['Clopidogrel 75mg OD', 'Rosuvastatin 20mg HS'] },
    { primary: 'Diabetic Peripheral Neuropathy', history: ['Type 2 Diabetes Mellitus'], meds: ['Pregabalin 75mg HS', 'Methylcobalamin 1500mcg'] },
  ],
  Oncology: [
    { primary: 'Breast Carcinoma Surveillance', history: ['Post-Lumpectomy 2024'], meds: ['Letrozole 2.5mg OD', 'Calcium + Vitamin D3'] },
    { primary: 'Pulmonary Nodule Follow-up', history: ['Former Smoker', 'COPD'], meds: ['Tiotropium Inhaler OD'] },
  ],
  Pulmonology: [
    { primary: 'Moderate Persistent Asthma', history: ['Allergic Rhinitis'], meds: ['Budesonide/Formoterol Inhaler', 'Montelukast 10mg HS'] },
    { primary: 'COPD Exacerbation Recovery', history: ['Chronic Bronchitis', 'Hypertension'], meds: ['Glycopyrronium Inhaler', 'Azithromycin 500mg'] },
  ],
  Endocrinology: [
    { primary: 'Type 2 Diabetes Mellitus', history: ['Dyslipidemia', 'Fatty Liver Grade I'], meds: ['Metformin 1000mg BD', 'Empagliflozin 10mg OD'] },
    { primary: 'Autoimmune Hypothyroidism', history: ['Vitamin D Deficiency'], meds: ['Levothyroxine 75mcg OD'] },
  ],
  Orthopaedics: [
    { primary: 'Bilateral Knee Osteoarthritis', history: ['Obesity Class I'], meds: ['Etoricoxib 60mg PRN', 'Glucosamine Sulfate'] },
    { primary: 'Lumbar Disc Herniation L4-L5', history: ['Sciatica'], meds: ['Gabapentin 300mg HS', 'Aceclofenac 100mg PRN'] },
  ],
  Nephrology: [
    { primary: 'Chronic Kidney Disease Stage 3', history: ['Hypertension', 'Type 2 Diabetes'], meds: ['Telmisartan 40mg', 'Sodium Bicarbonate 500mg'] },
    { primary: 'Recurrent Nephrolithiasis', history: ['Hyperuricemia'], meds: ['Potassium Citrate Solution', 'Allopurinol 100mg'] },
  ],
  'Emergency Medicine': [
    { primary: 'Acute Chest Discomfort Rule-Out', history: ['Hypertension', 'Smoking'], meds: ['Aspirin 150mg Stat', 'Pantoprazole 40mg'] },
    { primary: 'Acute Febrile Gastroenteritis', history: ['Mild Dehydration'], meds: ['ORS Solution', 'Ondansetron 4mg PRN'] },
  ],
  'General Medicine': [
    { primary: 'Metabolic Syndrome Screening', history: ['Borderline HbA1c'], meds: ['Lifestyle Modification', 'Vitamin D3 Weekly'] },
    { primary: 'Community-Acquired Pneumonia Recovery', history: ['None'], meds: ['Amoxicillin-Clavulanate 625mg'] },
  ],
  Paediatrics: [
    { primary: 'Paediatric Wheeze Episode', history: ['Atopic Dermatitis'], meds: ['Salbutamol Nebulisation PRN'] },
    { primary: 'Iron Deficiency Anaemia', history: ['Nutritional Deficiency'], meds: ['Ferrous Ascorbate Syrup'] },
  ],
};

const ALLERGY_POOL = ['None Documented', 'Penicillin', 'Sulfa Drugs', 'NSAIDs', 'Shellfish', 'Dust Mites'];
const BLOOD_GROUPS = ['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-'];

function seededValue(index: number, mod: number): number {
  const x = Math.sin(index * 9301 + 49297) * 233280;
  return Math.floor((x - Math.floor(x)) * mod);
}

function generatePatients(): PatientRecord[] {
  const patients: PatientRecord[] = [];

  for (let i = 0; i < 105; i++) {
    const numId = 10201 + i;
    const id = `PAT-${numId}`;

    // Explicit anchor case PAT-10284 required by Clinical Decision Support specification
    if (id === 'PAT-10284') {
      const vitals = {
        bpSystolic: 158,
        bpDiastolic: 96,
        heartRate: 92,
        spo2: 97,
        temperatureC: 36.9,
        respiratoryRate: 18,
        recordedAt: '2026-11-19 08:45 IST',
      };
      const score = computeRiskScore({ age: 58, vitals, comorbidityCount: 2 });
      patients.push({
        id: 'PAT-10284',
        name: 'Rajesh Kulkarni',
        age: 58,
        gender: 'Male',
        city: 'Mumbai',
        hospital: 'Sahyadri Heart & Neuro Institute',
        department: 'Cardiology',
        primaryCondition: 'Elevated Blood Pressure · Resistant Hypertension Workup',
        medicalHistory: ['Essential Hypertension (6 yrs)', 'Dyslipidemia', 'Family History of CAD'],
        medications: ['Amlodipine 5mg OD', 'Atorvastatin 20mg HS', 'Aspirin 75mg OD'],
        allergies: ['None Documented'],
        vitals,
        riskScore: score,
        riskLevel: classifyRiskLevel(score),
        status: 'Active Outpatient',
        lastExamination: '2026-11-19',
        nextFollowUp: '2026-11-26',
        attendingDoctor: 'Dr. Arun Patel',
        engagementScore: 86,
        phone: '+91 98204 51284',
        bloodGroup: 'B+',
        timeline: [
          {
            id: 'TL-284-1',
            date: '2026-11-19 08:45',
            type: 'AI Review',
            title: 'Clinical Decision Support Flag: Sustained Elevated BP (158/96 mmHg)',
            clinician: 'MediSense CDS Engine (Simulated)',
            notes: 'Systolic elevation +18 mmHg vs 30-day clinic baseline; recommended ambulatory BP profile and renal check.',
          },
          {
            id: 'TL-284-2',
            date: '2026-11-18 16:20',
            type: 'Laboratory',
            title: 'Lipid Profile & Serum Creatinine',
            clinician: 'Dr. Arun Patel',
            notes: 'LDL Cholesterol 134 mg/dL (Borderline); Serum Creatinine 1.08 mg/dL (Normal).',
          },
          {
            id: 'TL-284-3',
            date: '2026-11-04 10:15',
            type: 'Consultation',
            title: 'Cardiology Outpatient Follow-Up',
            clinician: 'Dr. Arun Patel',
            notes: 'Reported occasional morning occipital headache; advised home BP diary twice daily.',
          },
          {
            id: 'TL-284-4',
            date: '2026-10-12 14:00',
            type: 'Imaging',
            title: '2D Echocardiography Screening',
            clinician: 'Dr. Kavita Deshpande',
            notes: 'LVEF 58%, mild concentric LVH, no regional wall motion abnormality.',
          },
        ],
      });
      continue;
    }

    const isFemale = i % 2 === 1;
    const firstName = isFemale
      ? FIRST_NAMES_F[seededValue(i + 3, FIRST_NAMES_F.length)]
      : FIRST_NAMES_M[seededValue(i + 7, FIRST_NAMES_M.length)];
    const lastName = LAST_NAMES[seededValue(i + 11, LAST_NAMES.length)];
    const dept = DEPARTMENTS[i % DEPARTMENTS.length];
    const hospitalObj = HOSPITALS[i % HOSPITALS.length];
    const doctors = DOCTORS_BY_DEPT[dept];
    const attendingDoctor = doctors[seededValue(i + 5, doctors.length)];
    const condTemplates = CONDITIONS_BY_DEPT[dept];
    const cond = condTemplates[seededValue(i + 9, condTemplates.length)];

    const age = dept === 'Paediatrics' ? 4 + seededValue(i, 12) : 24 + seededValue(i * 3, 56);
    const bpBase = dept === 'Cardiology' || dept === 'Nephrology' ? 132 : 114;
    const bpSystolic = Math.min(182, bpBase + seededValue(i + 17, 42));
    const bpDiastolic = Math.min(108, 72 + seededValue(i + 23, 28));
    const heartRate = 62 + seededValue(i + 31, 48);
    const spo2 = dept === 'Pulmonology' || dept === 'Emergency Medicine' ? 91 + seededValue(i + 2, 9) : 95 + seededValue(i + 4, 5);
    const temperatureC = Number((36.4 + seededValue(i + 13, 22) / 10).toFixed(1));

    const vitals = {
      bpSystolic,
      bpDiastolic,
      heartRate,
      spo2,
      temperatureC,
      respiratoryRate: 14 + seededValue(i, 8),
      recordedAt: `2026-11-${String(10 + (i % 10)).padStart(2, '0')} ${String(8 + (i % 10)).padStart(2, '0')}:${String((i * 15) % 60).padStart(2, '0')} IST`,
    };

    const riskScore = computeRiskScore({
      age,
      vitals,
      comorbidityCount: cond.history.length,
    });
    const riskLevel = classifyRiskLevel(riskScore);

    const statusPool: PatientRecord['status'][] = [
      'Active Outpatient',
      'Active Outpatient',
      'Tele-Monitored',
      'Inpatient',
      riskLevel === 'Critical' ? 'ICU Observation' : 'Discharged',
    ];

    const dayNum = 10 + (i % 10);
    const followDay = 20 + (i % 9);

    patients.push({
      id,
      name: `${firstName} ${lastName}`,
      age,
      gender: isFemale ? 'Female' : 'Male',
      city: hospitalObj.city,
      hospital: hospitalObj.name,
      department: dept,
      primaryCondition: cond.primary,
      medicalHistory: cond.history,
      medications: cond.meds,
      allergies: [ALLERGY_POOL[seededValue(i + 19, ALLERGY_POOL.length)]],
      vitals,
      riskScore,
      riskLevel,
      status: statusPool[i % statusPool.length],
      lastExamination: `2026-11-${String(dayNum).padStart(2, '0')}`,
      nextFollowUp: `2026-11-${String(followDay).padStart(2, '0')}`,
      attendingDoctor,
      engagementScore: 68 + seededValue(i + 29, 30),
      phone: `+91 9${8000 + (i * 37) % 1999} ${String(10000 + (i * 419) % 89999)}`,
      bloodGroup: BLOOD_GROUPS[i % BLOOD_GROUPS.length],
      timeline: [
        {
          id: `TL-${numId}-1`,
          date: `2026-11-${String(dayNum).padStart(2, '0')} 10:30`,
          type: 'Consultation',
          title: `${dept} Clinical Review`,
          clinician: attendingDoctor,
          notes: `Evaluated for ${cond.primary}. Vitals BP ${bpSystolic}/${bpDiastolic} mmHg, SpO2 ${spo2}%.`,
        },
        {
          id: `TL-${numId}-2`,
          date: `2026-11-${String(Math.max(1, dayNum - 4)).padStart(2, '0')} 09:15`,
          type: 'Laboratory',
          title: 'Comprehensive Metabolic & CBC Panel',
          clinician: 'Central Diagnostic Lab',
          notes: 'Automated verification completed; results linked to outpatient chart.',
        },
        {
          id: `TL-${numId}-3`,
          date: `2026-10-${String(12 + (i % 15)).padStart(2, '0')} 15:40`,
          type: 'Telemedicine',
          title: 'Remote Adherence Check-in',
          clinician: attendingDoctor,
          notes: 'Medication tolerance reviewed; home monitoring log updated.',
        },
      ],
    });
  }

  return patients;
}

export const INITIAL_PATIENTS: PatientRecord[] = generatePatients();

export const INITIAL_APPOINTMENTS: AppointmentRecord[] = INITIAL_PATIENTS.slice(0, 54).map((p, idx) => {
  const hour = 8 + (idx % 10);
  const minute = (idx % 4) * 15;
  const statuses: AppointmentRecord['status'][] = [
    'Confirmed',
    'Scheduled',
    'In Progress',
    'Completed',
    'Confirmed',
    'Missed',
  ];
  const reasons = [
    `${p.department} Follow-up Consultation`,
    'Predictive Risk Review',
    'Post-Lab Evaluation',
    'Medication Titration Review',
    'Remote Vitals Assessment',
  ];

  return {
    id: `APT-${4401 + idx}`,
    patientId: p.id,
    patientName: p.name,
    department: p.department,
    doctorName: p.attendingDoctor,
    hospital: p.hospital,
    scheduledTime: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
    dateLabel: idx < 18 ? '2026-11-19' : idx < 36 ? '2026-11-20' : '2026-11-21',
    mode: idx % 3 === 0 ? 'Telemedicine' : 'In-Person',
    reason: reasons[idx % reasons.length],
    status: statuses[idx % statuses.length],
    durationMin: idx % 3 === 0 ? 15 : 20,
  };
});

export const INITIAL_DIAGNOSTIC_CASES: DiagnosticCase[] = INITIAL_PATIENTS
  .filter((_, idx) => idx % 3 === 0)
  .slice(0, 32)
  .map((p, idx) => {
    const reviewStatuses: DiagnosticCase['reviewStatus'][] = [
      'Pending Review',
      'Under Review',
      'Reviewed',
      'Escalated',
    ];
    const indicators = [
      `BP ${p.vitals.bpSystolic}/${p.vitals.bpDiastolic} mmHg`,
      `HR ${p.vitals.heartRate} bpm`,
      `SpO2 ${p.vitals.spo2}%`,
      p.medicalHistory[0] ? `Hx: ${p.medicalHistory[0]}` : 'Baseline metabolic panel',
    ];

    return {
      id: `DX-${8101 + idx}`,
      patientId: p.id,
      patientName: p.name,
      age: p.age,
      department: p.department,
      medicalHistory: p.medicalHistory.join(', ') || 'No major comorbidities logged',
      clinicalIndicators: indicators,
      earlyWarningScore: Math.max(1, Math.min(9, Math.round(p.riskScore / 11))),
      riskClassification: p.riskLevel,
      predictedCondition: `${p.primaryCondition} Progression Risk`,
      confidenceIndex: 74 + (idx % 21),
      lastExamination: p.lastExamination,
      reviewStatus: p.riskLevel === 'Critical' ? 'Escalated' : reviewStatuses[idx % reviewStatuses.length],
      aiSummary: `Simulated longitudinal analysis detected a ${p.riskScore >= 60 ? 'notable upward shift' : 'mild variance'} in ${p.department.toLowerCase()} composite risk markers over the past 14 days.`,
      recommendedAssessment: `Recommend clinician review of recent ${p.department.toLowerCase()} indicators, medication adherence, and targeted follow-up diagnostics.`,
      trendSeries: [
        { day: 'D-12', riskIndex: Math.max(15, p.riskScore - 16), baseline: 35 },
        { day: 'D-9', riskIndex: Math.max(18, p.riskScore - 11), baseline: 35 },
        { day: 'D-6', riskIndex: Math.max(20, p.riskScore - 7), baseline: 35 },
        { day: 'D-3', riskIndex: Math.max(22, p.riskScore - 3), baseline: 35 },
        { day: 'Today', riskIndex: p.riskScore, baseline: 35 },
      ],
    };
  });

const IMAGING_ASSETS: Record<ImagingModality, string> = {
  'X-Ray': '/src/assets/images/xray_thorax_demo_1795087304726.jpg',
  'CT Scan': '/src/assets/images/ct_cardiac_demo_1795087303977.jpg',
  MRI: '/src/assets/images/mri_brain_demo_1795087303607.jpg',
  Ultrasound: 'svg-ultrasound',
};

const IMAGING_FINDINGS: Record<ImagingModality, { region: string; finding: string; obs: string[]; roi: ImagingCase['roiBox'] }[]> = {
  'X-Ray': [
    {
      region: 'Chest PA View',
      finding: 'Illustrative AI flag: Mild cardiothoracic ratio enlargement (CTR ~0.54) with clear costophrenic angles.',
      obs: ['Cardiothoracic ratio mildly prominent', 'Lung fields well-aerated bilaterally', 'No pleural effusion or pneumothorax noted'],
      roi: { x: 42, y: 40, width: 24, height: 24, label: 'Cardiomediastinal Silhouette' },
    },
    {
      region: 'Thoracic Radiograph',
      finding: 'Illustrative AI flag: Subtle perihilar interstitial prominence warranting clinical correlation.',
      obs: ['Bilateral perihilar bronchial markings', 'Intact bony thorax and clavicles', 'Trachea midline'],
      roi: { x: 32, y: 36, width: 20, height: 22, label: 'Right Hilar Zone' },
    },
  ],
  'CT Scan': [
    {
      region: 'Thoracic / Cardiac CT',
      finding: 'Illustrative AI flag: Moderate coronary arterial wall calcification indicator; requires radiologist quantification.',
      obs: ['Left anterior descending territory attenuation noted', 'Pericardial space unremarkable', 'Descending aorta calibre within normal limits'],
      roi: { x: 44, y: 38, width: 20, height: 20, label: 'Coronary / Myocardial ROI' },
    },
    {
      region: 'Chest High-Resolution CT',
      finding: 'Illustrative AI flag: 5mm subpleural nodule candidate in right middle zone for surveillance comparison.',
      obs: ['Well-circumscribed focal density', 'No mediastinal lymphadenopathy', 'Normal central airways'],
      roi: { x: 26, y: 45, width: 16, height: 16, label: 'Subpleural Candidate ROI' },
    },
  ],
  MRI: [
    {
      region: 'Brain Axial T2/FLAIR',
      finding: 'Illustrative AI flag: Scattered periventricular white matter hyperintensities consistent with age/microvascular profile.',
      obs: ['Symmetric ventricular system', 'No acute midline shift or mass effect', 'Small vessel ischemic foci flagged for correlation'],
      roi: { x: 38, y: 32, width: 24, height: 20, label: 'Periventricular White Matter' },
    },
    {
      region: 'Cranial MRI Screening',
      finding: 'Illustrative AI flag: Normal parenchymal symmetry; incidental paranasal sinus mucosal thickening.',
      obs: ['Preserved grey-white differentiation', 'No acute diffusion restriction', 'Major dural venous sinuses patent'],
      roi: { x: 42, y: 58, width: 16, height: 16, label: 'Basal / Sinus Region' },
    },
  ],
  Ultrasound: [
    {
      region: 'Carotid / Abdominal Doppler',
      finding: 'Illustrative AI flag: Mild intima-media thickening (1.1 mm) along proximal bifurcation; no flow-limiting stenosis.',
      obs: ['Peak systolic velocity within normal range', 'Homogeneous hepatic echotexture', 'No free intra-abdominal fluid'],
      roi: { x: 38, y: 35, width: 26, height: 24, label: 'Vascular Doppler Envelope' },
    },
  ],
};

export const INITIAL_IMAGING_CASES: ImagingCase[] = Array.from({ length: 22 }, (_, idx) => {
  const modalities: ImagingModality[] = ['X-Ray', 'CT Scan', 'MRI', 'Ultrasound'];
  const modality = modalities[idx % modalities.length];
  const templates = IMAGING_FINDINGS[modality];
  const tpl = templates[idx % templates.length];
  const patient = INITIAL_PATIENTS[(idx * 4 + 2) % INITIAL_PATIENTS.length];
  const radStatuses: ImagingCase['radiologistStatus'][] = [
    'Pending Sign-off',
    'Verified by Radiologist',
    'Pending Sign-off',
    'Clarification Requested',
  ];

  return {
    id: `IMG-${6201 + idx}`,
    patientId: patient.id,
    patientName: patient.name,
    department: patient.department,
    modality,
    bodyRegion: tpl.region,
    scanDate: `2026-11-${String(12 + (idx % 8)).padStart(2, '0')}`,
    hospital: patient.hospital,
    analysisStatus: idx % 9 === 0 ? 'Processing' : 'AI Analysed',
    simulatedFinding: tpl.finding,
    structuredObservations: tpl.obs,
    radiologistStatus: radStatuses[idx % radStatuses.length],
    assignedRadiologist: idx % 2 === 0 ? 'Dr. Rituja Kulkarni (Radiology)' : 'Dr. Arvind Narayanan (Radiology)',
    assetPath: IMAGING_ASSETS[modality],
    roiBox: tpl.roi,
  };
});

const LAB_CATALOG = [
  { testName: 'Troponin-I High Sensitivity', panel: 'Cardiac Markers' as const, range: '< 14 ng/L', criticalVal: '48 ng/L', abnormalVal: '22 ng/L', normalVal: '6 ng/L' },
  { testName: 'HbA1c (Glycated Haemoglobin)', panel: 'Endocrinology' as const, range: '4.0 – 5.6%', criticalVal: '10.4%', abnormalVal: '7.6%', normalVal: '5.3%' },
  { testName: 'Lipid Profile (LDL Direct)', panel: 'Biochemistry' as const, range: '< 100 mg/dL', criticalVal: '198 mg/dL', abnormalVal: '142 mg/dL', normalVal: '88 mg/dL' },
  { testName: 'Complete Blood Count (WBC)', panel: 'Haematology' as const, range: '4.0 – 11.0 ×10³/µL', criticalVal: '19.4 ×10³/µL', abnormalVal: '13.2 ×10³/µL', normalVal: '7.1 ×10³/µL' },
  { testName: 'Serum Creatinine & eGFR', panel: 'Biochemistry' as const, range: '0.7 – 1.3 mg/dL', criticalVal: '3.2 mg/dL', abnormalVal: '1.7 mg/dL', normalVal: '0.96 mg/dL' },
  { testName: 'D-Dimer Quantitative', panel: 'Haematology' as const, range: '< 500 ng/mL', criticalVal: '1,840 ng/mL', abnormalVal: '780 ng/mL', normalVal: '310 ng/mL' },
  { testName: 'Thyroid Profile (TSH)', panel: 'Endocrinology' as const, range: '0.4 – 4.2 µIU/mL', criticalVal: '14.5 µIU/mL', abnormalVal: '6.8 µIU/mL', normalVal: '2.1 µIU/mL' },
  { testName: 'Liver Function (ALT / SGPT)', panel: 'Biochemistry' as const, range: '7 – 56 U/L', criticalVal: '240 U/L', abnormalVal: '88 U/L', normalVal: '29 U/L' },
];

export const INITIAL_LAB_REPORTS: LabReport[] = Array.from({ length: 34 }, (_, idx) => {
  const patient = INITIAL_PATIENTS[(idx * 3 + 1) % INITIAL_PATIENTS.length];
  const tpl = LAB_CATALOG[idx % LAB_CATALOG.length];
  const flagPool: LabReport['flag'][] = ['Normal', 'Normal', 'Borderline', 'Abnormal', 'Critical'];
  const flag = flagPool[idx % flagPool.length];
  const measuredValue =
    flag === 'Critical'
      ? tpl.criticalVal
      : flag === 'Abnormal' || flag === 'Borderline'
      ? tpl.abnormalVal
      : tpl.normalVal;

  return {
    id: `LAB-${9301 + idx}`,
    patientId: patient.id,
    patientName: patient.name,
    department: patient.department,
    testName: tpl.testName,
    panel: tpl.panel,
    measuredValue,
    referenceRange: tpl.range,
    flag,
    status: idx % 7 === 0 ? 'Pending' : idx % 5 === 0 ? 'In Review' : 'Completed',
    turnaroundHours: Number((1.8 + (idx % 6) * 0.6).toFixed(1)),
    collectedAt: `2026-11-${String(14 + (idx % 6)).padStart(2, '0')} ${String(7 + (idx % 10)).padStart(2, '0')}:30`,
    hospital: patient.hospital,
  };
});

export const INITIAL_ALERTS: ClinicalAlert[] = [
  {
    id: 'ALT-501',
    title: 'Priority Cardiology Review: Sustained BP Elevation',
    category: 'Priority Review',
    severity: 'High',
    detectedAt: '12 mins ago',
    department: 'Cardiology',
    hospital: 'Sahyadri Heart & Neuro Institute',
    patientId: 'PAT-10284',
    explanation: 'Simulated trend model flagged PAT-10284 (Rajesh Kulkarni) with BP 158/96 mmHg and HR 92 bpm across consecutive readings despite monotherapy.',
    recommendedAction: 'Review antihypertensive regimen and order ambulatory BP profile.',
    reviewStatus: 'Pending Review',
  },
  {
    id: 'ALT-502',
    title: 'Potential Deterioration Indicator in Pulmonology Ward',
    category: 'Deterioration Risk',
    severity: 'Critical',
    detectedAt: '18 mins ago',
    department: 'Pulmonology',
    hospital: 'Indiranagar Multispecialty Hospital',
    patientId: 'PAT-10214',
    explanation: 'SpO2 declined from 95% to 91% over 6 hours alongside elevated respiratory rate (23/min) in simulated ward stream.',
    recommendedAction: 'Urgent bedside respiratory evaluation and arterial blood gas assessment.',
    reviewStatus: 'Pending Review',
  },
  {
    id: 'ALT-503',
    title: 'Emergency Department Waiting Time +11% Above Baseline',
    category: 'Workload Imbalance',
    severity: 'High',
    detectedAt: '27 mins ago',
    department: 'Emergency Medicine',
    hospital: 'Indraprastha Care & Diagnostics',
    explanation: 'Triage intake surged by 22% between 09:00 and 11:30 IST, pushing average ED waiting time to 18 minutes across network hubs.',
    recommendedAction: 'Reallocate 2 float general medicine clinicians to rapid triage bay.',
    reviewStatus: 'Under Review',
  },
  {
    id: 'ALT-504',
    title: 'Unusual Critical Troponin-I Cluster Flagged',
    category: 'Diagnostic Pattern',
    severity: 'Critical',
    detectedAt: '41 mins ago',
    department: 'Cardiology',
    hospital: 'Jubilee Hills Medical Centre',
    patientId: 'PAT-10231',
    explanation: 'Simulated LIS monitor detected Troponin-I at 48 ng/L with pending clinician sign-off exceeding 45-minute escalation SLA.',
    recommendedAction: 'Confirm cardiology on-call acknowledgment and serial ECG.',
    reviewStatus: 'Pending Review',
  },
  {
    id: 'ALT-505',
    title: 'ICU Bed Utilisation Approaching 88% Threshold',
    category: 'Resource Capacity',
    severity: 'High',
    detectedAt: '54 mins ago',
    department: 'Hospital Operations',
    hospital: 'Sahyadri Heart & Neuro Institute',
    explanation: 'Neuro & Cardiac ICU occupancy reached 42/48 beds ahead of afternoon surgical schedule.',
    recommendedAction: 'Initiate step-down transfer review for 4 stable post-op observation patients.',
    reviewStatus: 'Under Review',
  },
  {
    id: 'ALT-506',
    title: '30-Day Readmission Risk Cohort Elevated (Nephrology)',
    category: 'Readmission Risk',
    severity: 'Moderate',
    detectedAt: '1 hr ago',
    department: 'Nephrology',
    hospital: 'Adyar Clinical Research Hospital',
    patientId: 'PAT-10247',
    explanation: 'CKD Stage 3 cohort with missed outpatient labs shows 1.6x predicted readmission indicator in simulated risk stratification.',
    recommendedAction: 'Trigger care-coordinator outreach and tele-nephrology slot.',
    reviewStatus: 'Pending Review',
  },
  {
    id: 'ALT-507',
    title: '14 Missed High-Priority Follow-Up Appointments',
    category: 'Missed Follow-up',
    severity: 'Moderate',
    detectedAt: '2 hrs ago',
    department: 'Endocrinology',
    hospital: 'Deccan Regional Medicity',
    patientId: 'PAT-10225',
    explanation: 'Patients with HbA1c > 8.5% missed scheduled 14-day titration checks this week.',
    recommendedAction: 'Dispatch automated multilingual SMS/WhatsApp rescheduling links.',
    reviewStatus: 'Reviewed',
  },
  ...Array.from({ length: 15 }, (_, idx): ClinicalAlert => {
    const p = INITIAL_PATIENTS[(idx * 5 + 3) % INITIAL_PATIENTS.length];
    const cats: ClinicalAlert['category'][] = [
      'Priority Review',
      'Diagnostic Pattern',
      'Readmission Risk',
      'Missed Follow-up',
      'Resource Capacity',
    ];
    const sevs: ClinicalAlert['severity'][] = ['High', 'Moderate', 'Informational', 'Critical'];
    const revs: ClinicalAlert['reviewStatus'][] = ['Pending Review', 'Reviewed', 'Under Review'];
    return {
      id: `ALT-${508 + idx}`,
      title: `${p.department} Synthetic Risk Indicator — ${p.id}`,
      category: cats[idx % cats.length],
      severity: sevs[idx % sevs.length],
      detectedAt: `${idx + 2} hrs ago`,
      department: p.department,
      hospital: p.hospital,
      patientId: p.id,
      explanation: `Simulated record review for ${p.name} (${p.primaryCondition}) flagged variance in clinical indicators requiring routine verification.`,
      recommendedAction: `Schedule clinician verification with ${p.attendingDoctor}.`,
      reviewStatus: revs[idx % revs.length],
    };
  }),
];

export const INITIAL_AGENTS: AiAgent[] = [
  {
    id: 'AGT-01',
    name: 'Patient Intelligence Agent',
    domain: 'Longitudinal Cohort & Vitals Synthesis',
    status: 'Active',
    tasksProcessed: 14820,
    successRate: 99.4,
    avgExecutionMs: 420,
    lastExecution: '1 min ago',
    currentWorkloadPct: 64,
    description: 'Aggregates outpatient vitals, demographics, and encounter history into structured risk indicators.',
  },
  {
    id: 'AGT-02',
    name: 'Clinical Documentation Agent',
    domain: 'Structured SOAP & Discharge Summaries',
    status: 'Active',
    tasksProcessed: 9340,
    successRate: 98.9,
    avgExecutionMs: 680,
    lastExecution: '3 mins ago',
    currentWorkloadPct: 52,
    description: 'Drafts clinician-reviewed consultation summaries and structured referral notes.',
  },
  {
    id: 'AGT-03',
    name: 'Diagnostic Assistance Agent',
    domain: 'Predictive Risk & Early Warning Scoring',
    status: 'Active',
    tasksProcessed: 11290,
    successRate: 99.1,
    avgExecutionMs: 510,
    lastExecution: '2 mins ago',
    currentWorkloadPct: 71,
    description: 'Computes simulated early warning scores and differential assessment checklists.',
  },
  {
    id: 'AGT-04',
    name: 'Medical Imaging Analysis Agent',
    domain: 'Radiology Pre-Screening & Triage',
    status: 'Active',
    tasksProcessed: 4860,
    successRate: 98.5,
    avgExecutionMs: 1140,
    lastExecution: '4 mins ago',
    currentWorkloadPct: 78,
    description: 'Flags illustrative regions of interest across X-Ray, CT, MRI, and Ultrasound studies for radiologists.',
  },
  {
    id: 'AGT-05',
    name: 'Appointment Management Agent',
    domain: 'Slot Optimisation & No-Show Mitigation',
    status: 'Active',
    tasksProcessed: 18410,
    successRate: 99.7,
    avgExecutionMs: 240,
    lastExecution: '30 secs ago',
    currentWorkloadPct: 44,
    description: 'Balances clinic schedules across specialties and triggers automated telemedicine slot fills.',
  },
  {
    id: 'AGT-06',
    name: 'Hospital Operations Agent',
    domain: 'Bed Turnover, ICU & OT Capacity Forecasting',
    status: 'Active',
    tasksProcessed: 7620,
    successRate: 99.2,
    avgExecutionMs: 390,
    lastExecution: '2 mins ago',
    currentWorkloadPct: 68,
    description: 'Monitors ward occupancy, ER wait times, and nursing shift balance across all 6 hospitals.',
  },
  {
    id: 'AGT-07',
    name: 'Patient Follow-up Agent',
    domain: 'Post-Discharge Adherence & Recall',
    status: 'Idle',
    tasksProcessed: 10540,
    successRate: 99.0,
    avgExecutionMs: 310,
    lastExecution: '9 mins ago',
    currentWorkloadPct: 29,
    description: 'Tracks missed follow-up visits and schedules care coordinator outreach workflows.',
  },
  {
    id: 'AGT-08',
    name: 'Laboratory Intelligence Agent',
    domain: 'Critical Value Detection & TAT Monitoring',
    status: 'Active',
    tasksProcessed: 16210,
    successRate: 99.6,
    avgExecutionMs: 295,
    lastExecution: '1 min ago',
    currentWorkloadPct: 59,
    description: 'Screens incoming synthetic lab panels for critical values and turnaround bottlenecks.',
  },
];

export const INITIAL_AGENT_EXECUTIONS: AgentExecution[] = Array.from({ length: 28 }, (_, idx) => {
  const agent = INITIAL_AGENTS[idx % INITIAL_AGENTS.length];
  const patient = INITIAL_PATIENTS[(idx * 3 + 5) % INITIAL_PATIENTS.length];
  const statuses: AgentExecution['status'][] = ['Completed', 'Completed', 'Flagged for Review', 'Completed'];

  return {
    id: `EXE-${7701 + idx}`,
    agentId: agent.id,
    agentName: agent.name,
    taskType: `${agent.domain.split('&')[0].trim()} Run`,
    targetEntity: idx % 5 === 0 ? patient.hospital : patient.id,
    department: idx % 5 === 0 ? 'Operations' : patient.department,
    startedAt: `2026-11-19 ${String(7 + Math.floor(idx / 3)).padStart(2, '0')}:${String((idx * 11) % 60).padStart(2, '0')} IST`,
    durationMs: agent.avgExecutionMs + ((idx * 37) % 180) - 60,
    status: statuses[idx % statuses.length],
    outputSummary: `Simulated pipeline completed verification for ${patient.id} (${patient.department}); structured advisory logged.`,
  };
});

export const INITIAL_HOSPITAL_CAPACITY: HospitalCapacityUnit[] = [
  {
    id: 'HSP-01',
    hospitalName: 'Sahyadri Heart & Neuro Institute',
    city: 'Mumbai',
    totalBeds: 240,
    occupiedBeds: 198,
    icuTotal: 48,
    icuOccupied: 42,
    erWaitMin: 21,
    erLoadPct: 86,
    doctorsOnDuty: 64,
    nursesAllocated: 148,
    otScheduled: 18,
    otActive: 11,
  },
  {
    id: 'HSP-02',
    hospitalName: 'Indiranagar Multispecialty Hospital',
    city: 'Bengaluru',
    totalBeds: 210,
    occupiedBeds: 164,
    icuTotal: 36,
    icuOccupied: 29,
    erWaitMin: 17,
    erLoadPct: 74,
    doctorsOnDuty: 58,
    nursesAllocated: 132,
    otScheduled: 15,
    otActive: 9,
  },
  {
    id: 'HSP-03',
    hospitalName: 'Indraprastha Care & Diagnostics',
    city: 'New Delhi',
    totalBeds: 220,
    occupiedBeds: 179,
    icuTotal: 40,
    icuOccupied: 33,
    erWaitMin: 22,
    erLoadPct: 88,
    doctorsOnDuty: 61,
    nursesAllocated: 138,
    otScheduled: 16,
    otActive: 10,
  },
  {
    id: 'HSP-04',
    hospitalName: 'Jubilee Hills Medical Centre',
    city: 'Hyderabad',
    totalBeds: 180,
    occupiedBeds: 134,
    icuTotal: 32,
    icuOccupied: 23,
    erWaitMin: 15,
    erLoadPct: 67,
    doctorsOnDuty: 49,
    nursesAllocated: 112,
    otScheduled: 12,
    otActive: 7,
  },
  {
    id: 'HSP-05',
    hospitalName: 'Adyar Clinical Research Hospital',
    city: 'Chennai',
    totalBeds: 160,
    occupiedBeds: 121,
    icuTotal: 28,
    icuOccupied: 21,
    erWaitMin: 16,
    erLoadPct: 71,
    doctorsOnDuty: 44,
    nursesAllocated: 98,
    otScheduled: 11,
    otActive: 6,
  },
  {
    id: 'HSP-06',
    hospitalName: 'Deccan Regional Medicity',
    city: 'Pune',
    totalBeds: 140,
    occupiedBeds: 106,
    icuTotal: 24,
    icuOccupied: 17,
    erWaitMin: 14,
    erLoadPct: 62,
    doctorsOnDuty: 38,
    nursesAllocated: 86,
    otScheduled: 9,
    otActive: 5,
  },
];

export const INITIAL_FOLLOW_UPS: FollowUpRecord[] = INITIAL_PATIENTS.slice(0, 24).map((p, idx) => {
  const outreachPool: FollowUpRecord['outreachStatus'][] = [
    'Pending Outreach',
    'Reminder Sent',
    'Rescheduled',
    'Completed',
  ];
  return {
    id: `FU-${3101 + idx}`,
    patientId: p.id,
    patientName: p.name,
    department: p.department,
    dueDate: p.nextFollowUp,
    reason: idx % 3 === 0 ? 'Missed Scheduled Lab / BP Check' : `${p.primaryCondition} Review`,
    riskLevel: p.riskLevel,
    outreachStatus: outreachPool[idx % outreachPool.length],
    assignedCoordinator: idx % 2 === 0 ? 'Meera Nair (Care Coord.)' : 'Sandeep Kulkarni (Care Coord.)',
  };
});

export const MEDICATION_INTERACTIONS: MedicationInteraction[] = [
  {
    pair: 'Amlodipine + Simvastatin (>20mg)',
    severity: 'Moderate',
    clinicalNote: 'CYP3A4 competition may increase systemic statin exposure and myopathy risk.',
    suggestedMonitoring: 'Prefer Atorvastatin/Rosuvastatin or cap Simvastatin at 20mg daily.',
  },
  {
    pair: 'Aspirin + Clopidogrel + NSAID (Etoricoxib)',
    severity: 'Major',
    clinicalNote: 'Additive gastrointestinal bleeding and renal perfusion risk during dual antiplatelet therapy.',
    suggestedMonitoring: 'Avoid systemic NSAIDs where possible; verify gastroprotection if co-administered.',
  },
  {
    pair: 'Telmisartan + Spironolactone',
    severity: 'Moderate',
    clinicalNote: 'Additive potassium retention may precipitate hyperkalemia, particularly in CKD.',
    suggestedMonitoring: 'Monitor serum potassium and creatinine within 7–14 days of dose adjustment.',
  },
  {
    pair: 'Metformin + IV Iodinated Contrast',
    severity: 'Major',
    clinicalNote: 'Risk of contrast-associated lactic acidosis in patients with reduced eGFR.',
    suggestedMonitoring: 'Check baseline eGFR and follow radiology contrast hold protocol.',
  },
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'USR-01',
    name: 'Dr. Arun Patel',
    email: 'arun.patel@medisense-demo.in',
    role: 'Chief Medical Officer',
    department: 'Cardiology',
    hospital: 'Sahyadri Heart & Neuro Institute',
    status: 'Active',
    mfaEnabled: true,
    lastActive: 'Online now',
  },
  {
    id: 'USR-02',
    name: 'Dr. Nandini Rao',
    email: 'nandini.rao@medisense-demo.in',
    role: 'Senior Consultant',
    department: 'Neurology',
    hospital: 'Indiranagar Multispecialty Hospital',
    status: 'Active',
    mfaEnabled: true,
    lastActive: '14 mins ago',
  },
  {
    id: 'USR-03',
    name: 'Dr. Rituja Kulkarni',
    email: 'rituja.k@medisense-demo.in',
    role: 'Radiologist',
    department: 'General Medicine',
    hospital: 'Sahyadri Heart & Neuro Institute',
    status: 'Active',
    mfaEnabled: true,
    lastActive: '32 mins ago',
  },
  {
    id: 'USR-04',
    name: 'Dr. Saurabh Chatterjee',
    email: 'saurabh.c@medisense-demo.in',
    role: 'Lab Director',
    department: 'Endocrinology',
    hospital: 'Indraprastha Care & Diagnostics',
    status: 'Active',
    mfaEnabled: true,
    lastActive: '1 hr ago',
  },
  {
    id: 'USR-05',
    name: 'Lakshmi Subramanian',
    email: 'lakshmi.s@medisense-demo.in',
    role: 'Nursing Lead',
    department: 'Emergency Medicine',
    hospital: 'Adyar Clinical Research Hospital',
    status: 'Active',
    mfaEnabled: true,
    lastActive: '2 hrs ago',
  },
  {
    id: 'USR-06',
    name: 'Rohan Deshpande',
    email: 'rohan.ops@medisense-demo.in',
    role: 'Operations Admin',
    department: 'Administration',
    hospital: 'Deccan Regional Medicity',
    status: 'Active',
    mfaEnabled: false,
    lastActive: 'Yesterday',
  },
];

export const INITIAL_INTEGRATIONS: IntegrationSystem[] = [
  {
    id: 'INT-01',
    name: 'HL7 FHIR R4 Clinical Exchange',
    standard: 'HL7 FHIR R4 (Patient, Observation, DiagnosticReport)',
    category: 'Interoperability',
    status: 'Configured (Demo)',
    endpoint: 'https://fhir-sandbox.sahyadri-net.example/r4',
    lastSync: '2026-11-19 08:40 IST',
    recordsSynced: 48920,
    description: 'Bi-directional FHIR resource mapping prepared for hospital EHR and national ABDM health exchange.',
  },
  {
    id: 'INT-02',
    name: 'Enterprise EHR / EMR Connector',
    standard: 'HL7 v2.5 ADT / ORM / ORU',
    category: 'EHR / EMR',
    status: 'Configured (Demo)',
    endpoint: 'hl7://emr-gateway.sahyadri-net.example:2575',
    lastSync: '2026-11-19 08:35 IST',
    recordsSynced: 12845,
    description: 'Ingests encounter admission/discharge feeds, medication orders, and clinical problem lists.',
  },
  {
    id: 'INT-03',
    name: 'Hospital Information System (HIS)',
    standard: 'REST + Webhook Events',
    category: 'HIS',
    status: 'Configured (Demo)',
    endpoint: 'https://his-bridge.sahyadri-net.example/v2',
    lastSync: '2026-11-19 08:42 IST',
    recordsSynced: 1150,
    description: 'Streams bed census, ICU allocation, OT block schedules, and triage waiting times.',
  },
  {
    id: 'INT-04',
    name: 'Laboratory Information System (LIS)',
    standard: 'LOINC / HL7 ORU^R01',
    category: 'LIS',
    status: 'Configured (Demo)',
    endpoint: 'https://lis-adapter.sahyadri-net.example/oru',
    lastSync: '2026-11-19 08:38 IST',
    recordsSynced: 8450,
    description: 'Normalises pathology panels with LOINC codes and flags critical panic thresholds.',
  },
  {
    id: 'INT-05',
    name: 'DICOMweb PACS Imaging Gateway',
    standard: 'DICOMweb (QIDO-RS / WADO-RS)',
    category: 'PACS / Imaging',
    status: 'Sandbox Ready',
    endpoint: 'https://pacs-wado.sahyadri-net.example/dicom-web',
    lastSync: '2026-11-19 08:15 IST',
    recordsSynced: 3842,
    description: 'Architectural bridge for radiology study metadata and non-diagnostic preview overlays.',
  },
  {
    id: 'INT-06',
    name: 'Clinical AI Inference Gateway',
    standard: 'Zero-Retention TLS 1.3 Inference API',
    category: 'AI Inference',
    status: 'Sandbox Ready',
    endpoint: 'https://inference-vpc.sahyadri-net.example/v1',
    lastSync: 'Simulated Local Mode',
    recordsSynced: 94090,
    description: 'Server-side proxy pattern isolating PHI de-identification before external model calls.',
  },
];

// Executive & Operations Time-Series Datasets
export const ADMISSION_TREND_DATA = [
  { month: 'Jun', admissions: 148, discharges: 141, outpatient: 1020 },
  { month: 'Jul', admissions: 156, discharges: 149, outpatient: 1085 },
  { month: 'Aug', admissions: 162, discharges: 154, outpatient: 1120 },
  { month: 'Sep', admissions: 159, discharges: 157, outpatient: 1140 },
  { month: 'Oct', admissions: 171, discharges: 166, outpatient: 1210 },
  { month: 'Nov', admissions: 186, discharges: 174, outpatient: 1284 },
];

export const DAILY_OUTPATIENT_DATA = [
  { day: 'Mon', visits: 1190, virtual: 280 },
  { day: 'Tue', visits: 1245, virtual: 310 },
  { day: 'Wed', visits: 1310, virtual: 335 },
  { day: 'Thu', visits: 1260, virtual: 295 },
  { day: 'Fri', visits: 1340, virtual: 342 },
  { day: 'Sat', visits: 1120, virtual: 240 },
  { day: 'Sun', visits: 680, virtual: 190 },
];

export const DEPARTMENT_DISTRIBUTION_DATA = [
  { name: 'Cardiology', patients: 9840, share: 20.1, color: '#0284C7' },
  { name: 'General Medicine', patients: 8310, share: 17.0, color: '#0D9488' },
  { name: 'Endocrinology', patients: 6850, share: 14.0, color: '#2563EB' },
  { name: 'Pulmonology', patients: 5870, share: 12.0, color: '#0891B2' },
  { name: 'Neurology', patients: 5380, share: 11.0, color: '#4F46E5' },
  { name: 'Orthopaedics', patients: 4890, share: 10.0, color: '#10B981' },
  { name: 'Other Specialties', patients: 7780, share: 15.9, color: '#64748B' },
];

export const DIAGNOSTIC_DISTRIBUTION_DATA = [
  { category: 'Cardiac Risk Models', cases: 980, flagged: 112 },
  { category: 'Pulmonary & Chest', cases: 740, flagged: 84 },
  { category: 'Metabolic / Diabetes', cases: 820, flagged: 69 },
  { category: 'Neuro / Stroke Triage', cases: 520, flagged: 48 },
  { category: 'Renal & Lab Anomaly', cases: 462, flagged: 53 },
  { category: 'Oncology Surveillance', cases: 320, flagged: 29 },
];

export const EMERGENCY_AND_RECOVERY_DATA = [
  { week: 'W1', emergencyVisits: 412, avgWaitMin: 14, recoveryRate: 91.2 },
  { week: 'W2', emergencyVisits: 438, avgWaitMin: 15, recoveryRate: 91.8 },
  { week: 'W3', emergencyVisits: 451, avgWaitMin: 16, recoveryRate: 92.4 },
  { week: 'W4', emergencyVisits: 465, avgWaitMin: 16, recoveryRate: 93.1 },
  { week: 'W5', emergencyVisits: 489, avgWaitMin: 17, recoveryRate: 93.6 },
  { week: 'W6', emergencyVisits: 518, avgWaitMin: 18, recoveryRate: 94.2 },
];

export const CLINICAL_WORKLOAD_DATA = [
  { department: 'Cardiology', consultsPerDoc: 24, pendingReviews: 14, utilisation: 88 },
  { department: 'Emergency', consultsPerDoc: 31, pendingReviews: 19, utilisation: 92 },
  { department: 'Pulmonology', consultsPerDoc: 21, pendingReviews: 9, utilisation: 81 },
  { department: 'Neurology', consultsPerDoc: 19, pendingReviews: 11, utilisation: 79 },
  { department: 'Endocrinology', consultsPerDoc: 23, pendingReviews: 8, utilisation: 76 },
  { department: 'Nephrology', consultsPerDoc: 18, pendingReviews: 7, utilisation: 74 },
  { department: 'Oncology', consultsPerDoc: 16, pendingReviews: 6, utilisation: 72 },
];

export const TELEMEDICINE_ACTIVITY_DATA = [
  { day: 'Mon', completed: 242, upcoming: 21, avgMin: 16 },
  { day: 'Tue', completed: 268, upcoming: 24, avgMin: 15 },
  { day: 'Wed', completed: 285, upcoming: 26, avgMin: 17 },
  { day: 'Thu', completed: 254, upcoming: 22, avgMin: 16 },
  { day: 'Fri', completed: 296, upcoming: 29, avgMin: 16 },
  { day: 'Sat', completed: 212, upcoming: 16, avgMin: 15 },
  { day: 'Sun', completed: 137, upcoming: 10, avgMin: 14 },
];

export const LAB_VOLUME_DATA = [
  { day: 'Mon', processed: 1340, critical: 5, tatHours: 3.2 },
  { day: 'Tue', processed: 1420, critical: 6, tatHours: 3.4 },
  { day: 'Wed', processed: 1490, critical: 7, tatHours: 3.6 },
  { day: 'Thu', processed: 1380, critical: 4, tatHours: 3.3 },
  { day: 'Fri', processed: 1460, critical: 6, tatHours: 3.5 },
  { day: 'Sat', processed: 920, critical: 3, tatHours: 3.1 },
  { day: 'Sun', processed: 440, critical: 1, tatHours: 2.9 },
];

export const VITALS_WAVEFORM_SERIES = [
  { time: '00:00', hr: 71, bpSys: 124, ecg: 62 },
  { time: '02:00', hr: 68, bpSys: 121, ecg: 60 },
  { time: '04:00', hr: 66, bpSys: 119, ecg: 64 },
  { time: '06:00', hr: 72, bpSys: 126, ecg: 88 },
  { time: '08:00', hr: 78, bpSys: 132, ecg: 58 },
  { time: '10:00', hr: 82, bpSys: 136, ecg: 94 },
  { time: '12:00', hr: 79, bpSys: 130, ecg: 61 },
  { time: '14:00', hr: 84, bpSys: 138, ecg: 91 },
  { time: '16:00', hr: 76, bpSys: 129, ecg: 63 },
  { time: '18:00', hr: 74, bpSys: 127, ecg: 86 },
  { time: '20:00', hr: 72, bpSys: 124, ecg: 62 },
  { time: '22:00', hr: 70, bpSys: 122, ecg: 60 },
];

export const EXECUTIVE_KPI_CARDS = [
  {
    id: 'kpi-total-patients',
    label: 'Total Patients',
    value: '48,920',
    prevValue: '43,520',
    changePct: '+12.4%',
    trend: 'up' as const,
    positiveIsGood: true,
    tooltip: 'Total registered patients across all 6 Sahyadri MedNet India network facilities (synthetic dataset).',
    sparkline: [412, 434, 426, 452, 446, 474, 489],
    color: '#0284C7',
  },
  {
    id: 'kpi-active-patients',
    label: 'Active Patients',
    value: '12,845',
    prevValue: '12,027',
    changePct: '+6.8%',
    trend: 'up' as const,
    positiveIsGood: true,
    tooltip: 'Patients under active outpatient, inpatient, or remote monitoring care within the past 30 days.',
    sparkline: [114, 119, 116, 123, 121, 127, 128],
    color: '#0D9488',
  },
  {
    id: 'kpi-today-appts',
    label: "Today's Appointments",
    value: '1,284',
    prevValue: '1,185',
    changePct: '+8.3%',
    trend: 'up' as const,
    positiveIsGood: true,
    tooltip: 'Combined in-person and telemedicine consultations scheduled across all departments today.',
    sparkline: [108, 121, 113, 124, 118, 126, 128],
    color: '#2563EB',
  },
  {
    id: 'kpi-admissions',
    label: 'Hospital Admissions',
    value: '186',
    prevValue: '171',
    changePct: '+8.4%',
    trend: 'up' as const,
    positiveIsGood: false,
    tooltip: 'New inpatient admissions recorded this week; +8.4% increase noted in Cardiology & Emergency.',
    sparkline: [148, 162, 155, 169, 164, 178, 186],
    color: '#0891B2',
  },
  {
    id: 'kpi-avail-beds',
    label: 'Available Beds',
    value: '248',
    prevValue: '260',
    changePct: '-4.6%',
    trend: 'down' as const,
    positiveIsGood: false,
    tooltip: 'Unoccupied inpatient and step-down beds across the 1,150-bed network.',
    sparkline: [284, 271, 278, 261, 266, 254, 248],
    color: '#0D9488',
  },
  {
    id: 'kpi-bed-occupancy',
    label: 'Bed Occupancy',
    value: '78.4%',
    prevValue: '76.8%',
    changePct: '+2.1%',
    trend: 'up' as const,
    positiveIsGood: false,
    tooltip: 'Network-wide bed occupancy ratio (902 occupied of 1,150 total beds).',
    sparkline: [72, 74.5, 73.2, 76.1, 75.4, 77.6, 78.4],
    color: '#D97706',
  },
  {
    id: 'kpi-ai-cases',
    label: 'AI Diagnostic Cases',
    value: '3,842',
    prevValue: '3,335',
    changePct: '+15.2%',
    trend: 'up' as const,
    positiveIsGood: true,
    tooltip: 'Simulated diagnostic and imaging cases processed by MediSense AI decision-support modules.',
    sparkline: [290, 318, 309, 344, 336, 369, 384],
    color: '#4F46E5',
  },
  {
    id: 'kpi-critical-alerts',
    label: 'Critical Patient Alerts',
    value: '24',
    prevValue: '26',
    changePct: '-7.7%',
    trend: 'down' as const,
    positiveIsGood: true,
    tooltip: 'Active high-acuity alerts requiring priority clinician review.',
    sparkline: [32, 28, 31, 26, 28, 25, 24],
    color: '#DC2626',
  },
  {
    id: 'kpi-wait-time',
    label: 'Average Waiting Time',
    value: '18 min',
    prevValue: '16.2 min',
    changePct: '+11.0%',
    trend: 'up' as const,
    positiveIsGood: false,
    tooltip: 'Mean emergency and outpatient triage waiting duration (+11% vs prior week baseline).',
    sparkline: [14, 15.8, 14.9, 16.4, 15.9, 17.5, 18],
    color: '#D97706',
  },
  {
    id: 'kpi-satisfaction',
    label: 'Patient Satisfaction',
    value: '94.8%',
    prevValue: '93.5%',
    changePct: '+1.4%',
    trend: 'up' as const,
    positiveIsGood: true,
    tooltip: 'Post-visit patient feedback index across outpatient and telemedicine encounters.',
    sparkline: [92.1, 93.0, 92.5, 93.9, 93.6, 94.4, 94.8],
    color: '#16A34A',
  },
];

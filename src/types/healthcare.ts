export type NavRouteId =
  | 'overview'
  | 'ai-centre'
  | 'patient-intelligence'
  | 'predictive-diagnostics'
  | 'medical-imaging'
  | 'clinical-decision-support'
  | 'patient-management'
  | 'telemedicine'
  | 'appointments'
  | 'follow-ups'
  | 'hospital-capacity'
  | 'department-analytics'
  | 'laboratory-intelligence'
  | 'ai-agent-centre'
  | 'agent-execution-history'
  | 'ai-recommendations'
  | 'reports'
  | 'integrations'
  | 'user-management'
  | 'organisation-settings';

export type DepartmentName =
  | 'Cardiology'
  | 'Neurology'
  | 'Oncology'
  | 'Pulmonology'
  | 'Endocrinology'
  | 'Orthopaedics'
  | 'Nephrology'
  | 'Emergency Medicine'
  | 'General Medicine'
  | 'Paediatrics';

export type RiskClassification = 'Low' | 'Moderate' | 'High' | 'Critical';
export type SeverityLevel = 'Critical' | 'High' | 'Moderate' | 'Informational';
export type ReviewStatus = 'Pending Review' | 'Under Review' | 'Reviewed' | 'Escalated';

export interface VitalSnapshot {
  bpSystolic: number;
  bpDiastolic: number;
  heartRate: number;
  spo2: number;
  temperatureC: number;
  respiratoryRate: number;
  recordedAt: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  type: 'Consultation' | 'Laboratory' | 'Imaging' | 'Admission' | 'Telemedicine' | 'AI Review';
  title: string;
  clinician: string;
  notes: string;
}

export interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  city: string;
  hospital: string;
  department: DepartmentName;
  primaryCondition: string;
  medicalHistory: string[];
  medications: string[];
  allergies: string[];
  vitals: VitalSnapshot;
  riskScore: number;
  riskLevel: RiskClassification;
  status: 'Active Outpatient' | 'Inpatient' | 'ICU Observation' | 'Tele-Monitored' | 'Discharged';
  lastExamination: string;
  nextFollowUp: string;
  attendingDoctor: string;
  engagementScore: number;
  phone: string;
  bloodGroup: string;
  timeline: TimelineEvent[];
}

export interface AppointmentRecord {
  id: string;
  patientId: string;
  patientName: string;
  department: DepartmentName;
  doctorName: string;
  hospital: string;
  scheduledTime: string;
  dateLabel: string;
  mode: 'In-Person' | 'Telemedicine';
  reason: string;
  status: 'Scheduled' | 'Confirmed' | 'In Progress' | 'Completed' | 'Missed' | 'Cancelled';
  durationMin: number;
}

export interface DiagnosticCase {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  department: DepartmentName;
  medicalHistory: string;
  clinicalIndicators: string[];
  earlyWarningScore: number;
  riskClassification: RiskClassification;
  predictedCondition: string;
  confidenceIndex: number;
  lastExamination: string;
  reviewStatus: ReviewStatus;
  aiSummary: string;
  recommendedAssessment: string;
  trendSeries: { day: string; riskIndex: number; baseline: number }[];
}

export type ImagingModality = 'X-Ray' | 'CT Scan' | 'MRI' | 'Ultrasound';

export interface ImagingCase {
  id: string;
  patientId: string;
  patientName: string;
  department: DepartmentName;
  modality: ImagingModality;
  bodyRegion: string;
  scanDate: string;
  hospital: string;
  analysisStatus: 'AI Analysed' | 'Processing' | 'Queued';
  simulatedFinding: string;
  structuredObservations: string[];
  radiologistStatus: 'Pending Sign-off' | 'Verified by Radiologist' | 'Clarification Requested';
  assignedRadiologist: string;
  assetPath: string;
  roiBox: { x: number; y: number; width: number; height: number; label: string };
}

export interface LabReport {
  id: string;
  patientId: string;
  patientName: string;
  department: DepartmentName;
  testName: string;
  panel: 'Haematology' | 'Biochemistry' | 'Cardiac Markers' | 'Endocrinology' | 'Microbiology';
  measuredValue: string;
  referenceRange: string;
  flag: 'Normal' | 'Borderline' | 'Abnormal' | 'Critical';
  status: 'Completed' | 'Pending' | 'In Review';
  turnaroundHours: number;
  collectedAt: string;
  hospital: string;
}

export interface ClinicalAlert {
  id: string;
  title: string;
  category:
    | 'Priority Review'
    | 'Deterioration Risk'
    | 'Diagnostic Pattern'
    | 'Resource Capacity'
    | 'Readmission Risk'
    | 'Missed Follow-up'
    | 'Workload Imbalance';
  severity: SeverityLevel;
  detectedAt: string;
  department: DepartmentName | 'Hospital Operations';
  hospital: string;
  patientId?: string;
  explanation: string;
  recommendedAction: string;
  reviewStatus: ReviewStatus;
}

export interface AiAgent {
  id: string;
  name: string;
  domain: string;
  status: 'Active' | 'Idle' | 'Paused';
  tasksProcessed: number;
  successRate: number;
  avgExecutionMs: number;
  lastExecution: string;
  currentWorkloadPct: number;
  description: string;
}

export interface AgentExecution {
  id: string;
  agentId: string;
  agentName: string;
  taskType: string;
  targetEntity: string;
  department: DepartmentName | 'Operations';
  startedAt: string;
  durationMs: number;
  status: 'Completed' | 'Flagged for Review' | 'Queued';
  outputSummary: string;
}

export interface HospitalCapacityUnit {
  id: string;
  hospitalName: string;
  city: string;
  totalBeds: number;
  occupiedBeds: number;
  icuTotal: number;
  icuOccupied: number;
  erWaitMin: number;
  erLoadPct: number;
  doctorsOnDuty: number;
  nursesAllocated: number;
  otScheduled: number;
  otActive: number;
}

export interface FollowUpRecord {
  id: string;
  patientId: string;
  patientName: string;
  department: DepartmentName;
  dueDate: string;
  reason: string;
  riskLevel: RiskClassification;
  outreachStatus: 'Pending Outreach' | 'Reminder Sent' | 'Rescheduled' | 'Completed';
  assignedCoordinator: string;
}

export interface MedicationInteraction {
  pair: string;
  severity: 'Major' | 'Moderate' | 'Minor';
  clinicalNote: string;
  suggestedMonitoring: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'Chief Medical Officer' | 'Senior Consultant' | 'Radiologist' | 'Lab Director' | 'Nursing Lead' | 'Operations Admin';
  department: DepartmentName | 'Administration';
  hospital: string;
  status: 'Active' | 'Inactive';
  mfaEnabled: boolean;
  lastActive: string;
}

export interface IntegrationSystem {
  id: string;
  name: string;
  standard: string;
  category: 'EHR / EMR' | 'HIS' | 'LIS' | 'PACS / Imaging' | 'AI Inference' | 'Interoperability';
  status: 'Configured (Demo)' | 'Sandbox Ready' | 'Pending Setup';
  endpoint: string;
  lastSync: string;
  recordsSynced: number;
  description: string;
}

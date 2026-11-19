import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  INITIAL_AGENT_EXECUTIONS,
  INITIAL_AGENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_ALERTS,
  INITIAL_DIAGNOSTIC_CASES,
  INITIAL_FOLLOW_UPS,
  INITIAL_HOSPITAL_CAPACITY,
  INITIAL_IMAGING_CASES,
  INITIAL_INTEGRATIONS,
  INITIAL_LAB_REPORTS,
  INITIAL_PATIENTS,
  INITIAL_USERS,
} from '../data/healthcareData';
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
  IntegrationSystem,
  LabReport,
  NavRouteId,
  PatientRecord,
  ReviewStatus,
  UserAccount,
} from '../types/healthcare';

export type DateRangeOption = 'Today' | 'Last 7 Days' | 'Last 30 Days' | 'This Quarter';

interface HealthcareContextValue {
  activeRoute: NavRouteId;
  setActiveRoute: (route: NavRouteId) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  selectedDepartment: DepartmentName | 'All';
  setSelectedDepartment: (dept: DepartmentName | 'All') => void;
  selectedDateRange: DateRangeOption;
  setSelectedDateRange: (range: DateRangeOption) => void;
  inspectedPatientId: string | null;
  openPatientDetail: (patientId: string) => void;
  closePatientDetail: () => void;
  selectedCdsPatientId: string;
  setSelectedCdsPatientId: (patientId: string) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
  patients: PatientRecord[];
  addPatient: (patient: PatientRecord) => void;
  appointments: AppointmentRecord[];
  updateAppointmentStatus: (id: string, status: AppointmentRecord['status']) => void;
  addAppointment: (apt: AppointmentRecord) => void;
  diagnosticCases: DiagnosticCase[];
  updateDiagnosticReview: (id: string, status: ReviewStatus) => void;
  imagingCases: ImagingCase[];
  updateImagingStatus: (id: string, status: ImagingCase['radiologistStatus']) => void;
  labReports: LabReport[];
  acknowledgeLabReport: (id: string) => void;
  alerts: ClinicalAlert[];
  updateAlertStatus: (id: string, status: ReviewStatus) => void;
  agents: AiAgent[];
  toggleAgentStatus: (id: string) => void;
  runAgentSimulation: (id: string) => void;
  executions: AgentExecution[];
  hospitalCapacity: HospitalCapacityUnit[];
  followUps: FollowUpRecord[];
  updateFollowUpStatus: (id: string, status: FollowUpRecord['outreachStatus']) => void;
  users: UserAccount[];
  toggleUserStatus: (id: string) => void;
  addUser: (user: UserAccount) => void;
  integrations: IntegrationSystem[];
  syncIntegration: (id: string) => void;
}

const HealthcareContext = createContext<HealthcareContextValue | null>(null);

export const HealthcareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRoute, setActiveRoute] = useState<NavRouteId>('overview');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentName | 'All'>('All');
  const [selectedDateRange, setSelectedDateRange] = useState<DateRangeOption>('Last 7 Days');
  const [inspectedPatientId, setInspectedPatientId] = useState<string | null>(null);
  const [selectedCdsPatientId, setSelectedCdsPatientId] = useState<string>('PAT-10284');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const [patients, setPatients] = useState<PatientRecord[]>(INITIAL_PATIENTS);
  const [appointments, setAppointments] = useState<AppointmentRecord[]>(INITIAL_APPOINTMENTS);
  const [diagnosticCases, setDiagnosticCases] = useState<DiagnosticCase[]>(INITIAL_DIAGNOSTIC_CASES);
  const [imagingCases, setImagingCases] = useState<ImagingCase[]>(INITIAL_IMAGING_CASES);
  const [labReports, setLabReports] = useState<LabReport[]>(INITIAL_LAB_REPORTS);
  const [alerts, setAlerts] = useState<ClinicalAlert[]>(INITIAL_ALERTS);
  const [agents, setAgents] = useState<AiAgent[]>(INITIAL_AGENTS);
  const [executions, setExecutions] = useState<AgentExecution[]>(INITIAL_AGENT_EXECUTIONS);
  const [hospitalCapacity] = useState<HospitalCapacityUnit[]>(INITIAL_HOSPITAL_CAPACITY);
  const [followUps, setFollowUps] = useState<FollowUpRecord[]>(INITIAL_FOLLOW_UPS);
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [integrations, setIntegrations] = useState<IntegrationSystem[]>(INITIAL_INTEGRATIONS);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  const openPatientDetail = (patientId: string) => setInspectedPatientId(patientId);
  const closePatientDetail = () => setInspectedPatientId(null);

  const addPatient = (patient: PatientRecord) => {
    setPatients((prev) => [patient, ...prev]);
  };

  const updateAppointmentStatus = (id: string, status: AppointmentRecord['status']) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const addAppointment = (apt: AppointmentRecord) => {
    setAppointments((prev) => [apt, ...prev]);
  };

  const updateDiagnosticReview = (id: string, reviewStatus: ReviewStatus) => {
    setDiagnosticCases((prev) => prev.map((d) => (d.id === id ? { ...d, reviewStatus } : d)));
  };

  const updateImagingStatus = (id: string, radiologistStatus: ImagingCase['radiologistStatus']) => {
    setImagingCases((prev) => prev.map((img) => (img.id === id ? { ...img, radiologistStatus } : img)));
  };

  const acknowledgeLabReport = (id: string) => {
    setLabReports((prev) =>
      prev.map((lab) => (lab.id === id ? { ...lab, status: 'Completed' } : lab))
    );
  };

  const updateAlertStatus = (id: string, reviewStatus: ReviewStatus) => {
    setAlerts((prev) => prev.map((al) => (al.id === id ? { ...al, reviewStatus } : al)));
  };

  const toggleAgentStatus = (id: string) => {
    setAgents((prev) =>
      prev.map((ag) =>
        ag.id === id ? { ...ag, status: ag.status === 'Paused' ? 'Active' : 'Paused' } : ag
      )
    );
  };

  const runAgentSimulation = (id: string) => {
    const targetAgent = agents.find((a) => a.id === id);
    if (!targetAgent) return;

    setAgents((prev) =>
      prev.map((ag) =>
        ag.id === id
          ? {
              ...ag,
              status: 'Active',
              tasksProcessed: ag.tasksProcessed + 1,
              lastExecution: 'Just now',
            }
          : ag
      )
    );

    const newExec: AgentExecution = {
      id: `EXE-${7701 + executions.length + 1}`,
      agentId: targetAgent.id,
      agentName: targetAgent.name,
      taskType: 'Manual Simulated Verification Cycle',
      targetEntity: 'Network Cohort',
      department: 'Operations',
      startedAt: 'Just now',
      durationMs: targetAgent.avgExecutionMs,
      status: 'Completed',
      outputSummary: `On-demand simulated run completed for ${targetAgent.name}; 0 anomalies bypassed.`,
    };
    setExecutions((prev) => [newExec, ...prev]);
  };

  const updateFollowUpStatus = (id: string, outreachStatus: FollowUpRecord['outreachStatus']) => {
    setFollowUps((prev) => prev.map((f) => (f.id === id ? { ...f, outreachStatus } : f)));
  };

  const toggleUserStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
      )
    );
  };

  const addUser = (user: UserAccount) => {
    setUsers((prev) => [user, ...prev]);
  };

  const syncIntegration = (id: string) => {
    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              lastSync: 'Synced just now (Demo)',
              recordsSynced: item.recordsSynced + 14,
            }
          : item
      )
    );
  };

  return (
    <HealthcareContext.Provider
      value={{
        activeRoute,
        setActiveRoute,
        theme,
        toggleTheme,
        selectedDepartment,
        setSelectedDepartment,
        selectedDateRange,
        setSelectedDateRange,
        inspectedPatientId,
        openPatientDetail,
        closePatientDetail,
        selectedCdsPatientId,
        setSelectedCdsPatientId,
        notificationsOpen,
        setNotificationsOpen,
        patients,
        addPatient,
        appointments,
        updateAppointmentStatus,
        addAppointment,
        diagnosticCases,
        updateDiagnosticReview,
        imagingCases,
        updateImagingStatus,
        labReports,
        acknowledgeLabReport,
        alerts,
        updateAlertStatus,
        agents,
        toggleAgentStatus,
        runAgentSimulation,
        executions,
        hospitalCapacity,
        followUps,
        updateFollowUpStatus,
        users,
        toggleUserStatus,
        addUser,
        integrations,
        syncIntegration,
      }}
    >
      {children}
    </HealthcareContext.Provider>
  );
};

export function useHealthcare() {
  const ctx = useContext(HealthcareContext);
  if (!ctx) throw new Error('useHealthcare must be used inside HealthcareProvider');
  return ctx;
}

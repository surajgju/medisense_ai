import React, { useState } from 'react';
import { HealthcareProvider, useHealthcare } from './context/HealthcareContext';
import { NotificationDrawer } from './components/layout/NotificationDrawer';
import { PatientDetailDrawer } from './components/layout/PatientDetailDrawer';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { AgentExecutionHistoryView } from './components/views/AgentExecutionHistoryView';
import { AiAgentCentreView } from './components/views/AiAgentCentreView';
import { AiIntelligenceCentreView } from './components/views/AiIntelligenceCentreView';
import { AiRecommendationsView } from './components/views/AiRecommendationsView';
import { AppointmentsView } from './components/views/AppointmentsView';
import { ClinicalDecisionSupportView } from './components/views/ClinicalDecisionSupportView';
import { DepartmentAnalyticsView } from './components/views/DepartmentAnalyticsView';
import { ExecutiveOverviewView } from './components/views/ExecutiveOverviewView';
import { FollowUpManagementView } from './components/views/FollowUpManagementView';
import { HospitalCapacityView } from './components/views/HospitalCapacityView';
import { IntegrationsView } from './components/views/IntegrationsView';
import { LaboratoryIntelligenceView } from './components/views/LaboratoryIntelligenceView';
import { MedicalImagingView } from './components/views/MedicalImagingView';
import { OrganisationSettingsView } from './components/views/OrganisationSettingsView';
import { PatientIntelligenceView } from './components/views/PatientIntelligenceView';
import { PatientManagementView } from './components/views/PatientManagementView';
import { PredictiveDiagnosticsView } from './components/views/PredictiveDiagnosticsView';
import { ReportsView } from './components/views/ReportsView';
import { TelemedicineView } from './components/views/TelemedicineView';
import { UserManagementView } from './components/views/UserManagementView';

const DashboardShell: React.FC = () => {
  const { activeRoute } = useHealthcare();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const renderView = () => {
    switch (activeRoute) {
      case 'overview':
        return <ExecutiveOverviewView />;
      case 'ai-centre':
        return <AiIntelligenceCentreView />;
      case 'patient-intelligence':
        return <PatientIntelligenceView />;
      case 'predictive-diagnostics':
        return <PredictiveDiagnosticsView />;
      case 'medical-imaging':
        return <MedicalImagingView />;
      case 'clinical-decision-support':
        return <ClinicalDecisionSupportView />;
      case 'patient-management':
        return <PatientManagementView />;
      case 'telemedicine':
        return <TelemedicineView />;
      case 'appointments':
        return <AppointmentsView />;
      case 'follow-ups':
        return <FollowUpManagementView />;
      case 'hospital-capacity':
        return <HospitalCapacityView />;
      case 'department-analytics':
        return <DepartmentAnalyticsView />;
      case 'laboratory-intelligence':
        return <LaboratoryIntelligenceView />;
      case 'ai-agent-centre':
        return <AiAgentCentreView />;
      case 'agent-execution-history':
        return <AgentExecutionHistoryView />;
      case 'ai-recommendations':
        return <AiRecommendationsView />;
      case 'reports':
        return <ReportsView />;
      case 'integrations':
        return <IntegrationsView />;
      case 'user-management':
        return <UserManagementView />;
      case 'organisation-settings':
        return <OrganisationSettingsView />;
      default:
        return <ExecutiveOverviewView />;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F4F7FB] dark:bg-[#0B1120] text-[#0F172A] dark:text-slate-100">
      <Sidebar mobileOpen={mobileNavOpen} onCloseMobile={() => setMobileNavOpen(false)} />

      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar onOpenMobileNav={() => setMobileNavOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 max-w-[1600px] w-full mx-auto">
          {renderView()}
        </main>
      </div>

      <PatientDetailDrawer />
      <NotificationDrawer />
    </div>
  );
};

export default function App() {
  return (
    <HealthcareProvider>
      <DashboardShell />
    </HealthcareProvider>
  );
}

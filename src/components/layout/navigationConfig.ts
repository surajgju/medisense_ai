import type { LucideIcon } from 'lucide-react';
import {
  Activity,
  BarChart3,
  Bot,
  BrainCircuit,
  Building2,
  CalendarClock,
  ClipboardCheck,
  Cpu,
  FileBarChart2,
  FlaskConical,
  HeartPulse,
  History,
  LayoutDashboard,
  Lightbulb,
  Network,
  ScanLine,
  Settings,
  Stethoscope,
  Users,
  Video,
} from 'lucide-react';
import type { NavRouteId } from '../../types/healthcare';

export interface NavItemConfig {
  id: NavRouteId;
  label: string;
  section: string;
  icon: LucideIcon;
  subtitle: string;
}

export const NAVIGATION_GROUPS: { section: string; items: NavItemConfig[] }[] = [
  {
    section: 'Executive',
    items: [
      {
        id: 'overview',
        label: 'Healthcare Overview',
        section: 'Executive',
        icon: LayoutDashboard,
        subtitle: 'Network-wide clinical, operational, and AI diagnostic performance',
      },
      {
        id: 'ai-centre',
        label: 'AI Intelligence Centre',
        section: 'Executive',
        icon: BrainCircuit,
        subtitle: 'Contextual AI clinical summary, early risk signals, and workflow alerts',
      },
    ],
  },
  {
    section: 'Clinical Intelligence',
    items: [
      {
        id: 'patient-intelligence',
        label: 'Patient Intelligence',
        section: 'Clinical Intelligence',
        icon: HeartPulse,
        subtitle: 'Longitudinal vitals telemetry, cohort risk breakdown, and engagement',
      },
      {
        id: 'predictive-diagnostics',
        label: 'Predictive Diagnostics',
        section: 'Clinical Intelligence',
        icon: Activity,
        subtitle: 'Early warning stratification and simulated disease progression models',
      },
      {
        id: 'medical-imaging',
        label: 'Medical Imaging',
        section: 'Clinical Intelligence',
        icon: ScanLine,
        subtitle: 'Illustrative X-Ray, CT, MRI, and Ultrasound AI-assisted radiology workspace',
      },
      {
        id: 'clinical-decision-support',
        label: 'Clinical Decision Support',
        section: 'Clinical Intelligence',
        icon: Stethoscope,
        subtitle: 'Evidence-linked clinical pathways, drug interactions, and case summaries',
      },
    ],
  },
  {
    section: 'Patient Services',
    items: [
      {
        id: 'patient-management',
        label: 'Patient Management',
        section: 'Patient Services',
        icon: Users,
        subtitle: 'Master synthetic patient directory with clinical timelines and export',
      },
      {
        id: 'telemedicine',
        label: 'Telemedicine',
        section: 'Patient Services',
        icon: Video,
        subtitle: 'Virtual consultation queues, clinician availability, and remote monitoring',
      },
      {
        id: 'appointments',
        label: 'Appointments',
        section: 'Patient Services',
        icon: CalendarClock,
        subtitle: 'Outpatient & virtual slot scheduling across network hospitals',
      },
      {
        id: 'follow-ups',
        label: 'Follow-up Management',
        section: 'Patient Services',
        icon: ClipboardCheck,
        subtitle: 'Post-visit recall tracking, missed appointments, and adherence outreach',
      },
    ],
  },
  {
    section: 'Hospital Operations',
    items: [
      {
        id: 'hospital-capacity',
        label: 'Hospital Capacity',
        section: 'Hospital Operations',
        icon: Building2,
        subtitle: 'Bed census, ICU capacity, ER waiting times, OT scheduling, and staffing',
      },
      {
        id: 'department-analytics',
        label: 'Department Analytics',
        section: 'Hospital Operations',
        icon: BarChart3,
        subtitle: 'Specialty patient flow, clinical workload, and recovery benchmarks',
      },
      {
        id: 'laboratory-intelligence',
        label: 'Laboratory Intelligence',
        section: 'Hospital Operations',
        icon: FlaskConical,
        subtitle: 'Diagnostic test volumes, turnaround times, and critical lab alerts',
      },
    ],
  },
  {
    section: 'AI Operations',
    items: [
      {
        id: 'ai-agent-centre',
        label: 'AI Agent Centre',
        section: 'AI Operations',
        icon: Bot,
        subtitle: 'Simulated operational monitoring across 8 specialised healthcare agents',
      },
      {
        id: 'agent-execution-history',
        label: 'Agent Execution History',
        section: 'AI Operations',
        icon: History,
        subtitle: 'Audit timeline of simulated agent runs, latencies, and review flags',
      },
      {
        id: 'ai-recommendations',
        label: 'AI Recommendations',
        section: 'AI Operations',
        icon: Lightbulb,
        subtitle: 'Centralised queue of AI-generated clinical and operational advisories',
      },
    ],
  },
  {
    section: 'Administration',
    items: [
      {
        id: 'reports',
        label: 'Reports',
        section: 'Administration',
        icon: FileBarChart2,
        subtitle: 'Downloadable CSV intelligence extracts for leadership and governance',
      },
      {
        id: 'integrations',
        label: 'Integrations',
        section: 'Administration',
        icon: Network,
        subtitle: 'HL7 v2, FHIR R4, EHR/EMR, HIS, LIS, and PACS architectural connectors',
      },
      {
        id: 'user-management',
        label: 'User Management',
        section: 'Administration',
        icon: Cpu,
        subtitle: 'Role-based clinical access control and multi-factor security roster',
      },
      {
        id: 'organisation-settings',
        label: 'Organisation Settings',
        section: 'Administration',
        icon: Settings,
        subtitle: 'Hospital network profile, data privacy controls, and display preferences',
      },
    ],
  },
];

export const ALL_NAV_ITEMS: NavItemConfig[] = NAVIGATION_GROUPS.flatMap((g) => g.items);

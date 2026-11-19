import React from 'react';
import type { ImagingCase, PatientRecord } from '../../types/healthcare';
import { MedicalHologramHub } from '../MedicalVisualization/MedicalHologramHub';

interface HumanBodyVitalsPanelProps {
  patients: PatientRecord[];
  imagingCases: ImagingCase[];
  selectedPatientId: string;
  onSelectPatient: (patientId: string) => void;
  onOpenDecisionSupport: (patientId: string) => void;
  onInspectPatient: (patientId: string) => void;
  onOpenImaging: () => void;
}

export const HumanBodyVitalsPanel: React.FC<HumanBodyVitalsPanelProps> = (props) => {
  return <MedicalHologramHub {...props} />;
};

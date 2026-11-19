export type OrganKey =
  | 'brain'
  | 'lungs'
  | 'heart'
  | 'liver'
  | 'stomach'
  | 'intestines'
  | 'kidneys'
  | 'skeleton';

export type HoloTone = 'normal' | 'elevated' | 'warning' | 'critical';

export interface OrganInteractionProps {
  selected: boolean;
  hovered: boolean;
  status: HoloTone;
  onSelect: (organ: OrganKey) => void;
  onHover: (organ: OrganKey | null) => void;
}

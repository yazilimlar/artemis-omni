export type EraStatus = 'active' | 'ghost' | 'locked';

export interface Era {
  id: string;
  label: string;
  startYear: number;
  endYear: number;
  status: EraStatus;
  description: string;
  color: string;
}

export const eras: Era[] = [
  {
    id: 'bronze_age_1200_bc',
    label: '1200 BC',
    startYear: -1250,
    endYear: -1180,
    status: 'ghost',
    description: 'Late Bronze Age Troy VIIa, often associated with the legendary Trojan War horizon.',
    color: '#8b5a2b',
  },
  {
    id: 'archaic_600_bc',
    label: '600 BC',
    startYear: -650,
    endYear: -500,
    status: 'active',
    description: 'Archaic Ilion, a sacred and strategic settlement in the Troad landscape.',
    color: '#d4a574',
  },
  {
    id: 'roman_150_ad',
    label: '150 AD',
    startYear: 100,
    endYear: 200,
    status: 'ghost',
    description: 'Roman Ilium, a monumentalized city tied to imperial memory and Trojan ancestry.',
    color: '#b44a3c',
  },
  {
    id: 'modern_2026_ad',
    label: '2026 AD',
    startYear: 2026,
    endYear: 2026,
    status: 'ghost',
    description: 'Troy Archaeological Park and the modern landscape of Hisarlik.',
    color: '#4f6f64',
  },
];

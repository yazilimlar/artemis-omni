export type HouseCategory = 'family' | 'tiny';

export type PinarHouse = {
  id: 'ceviz' | 'biberiye' | 'nar' | 'elma' | 'hurma';
  name: string;
  englishName: string;
  botanical: string;
  type: 'Prefab' | 'Tiny House';
  category: HouseCategory;
  focus: string;
  vibe: string;
  image: string;
  map: { x: number; y: number };
  booking: {
    airbnbUrl?: string;
    envCalendarKey: string;
    status: 'verified' | 'unverified';
  };
};

// Listing assignments stay intentionally conservative until the owner confirms
// which Airbnb listing maps to each botanical house. This prevents the website
// from presenting an incorrect house/calendar relationship.
export const pinarHouses: PinarHouse[] = [
  {
    id: 'ceviz', name: 'Ceviz Ev', englishName: 'Walnut House', botanical: 'Juglans regia',
    type: 'Prefab', category: 'family',
    focus: 'Deep shade, grounding comfort and quiet focus.',
    vibe: 'An earthy family sanctuary framed by mature trees and garden shade.',
    image: '/images/pinarevleri/entrance-garden.webp', map: { x: 18, y: 32 },
    booking: { envCalendarKey: 'PINAR_ICAL_CEVIZ', status: 'unverified' },
  },
  {
    id: 'biberiye', name: 'Biberiye Ev', englishName: 'Rosemary House', botanical: 'Salvia rosmarinus',
    type: 'Prefab', category: 'family',
    focus: 'Coastal airflow, solar efficiency and culinary herbal living.',
    vibe: 'A breezy self-catered stay with a fresh herb identity and outdoor living.',
    image: '/images/pinarevleri/garden-pool-wide.webp', map: { x: 30, y: 73 },
    booking: { envCalendarKey: 'PINAR_ICAL_BIBERIYE', status: 'unverified' },
  },
  {
    id: 'nar', name: 'Nar Ev', englishName: 'Pomegranate House', botanical: 'Punica granatum',
    type: 'Prefab', category: 'family',
    focus: 'Warm Aegean tones, abundant natural light and indoor-outdoor living.',
    vibe: 'A vibrant family setting suited to long lunches and golden-hour evenings.',
    image: '/images/pinarevleri/pool-sunset.webp', map: { x: 72, y: 72 },
    booking: { envCalendarKey: 'PINAR_ICAL_NAR', status: 'unverified' },
  },
  {
    id: 'elma', name: 'Elma Ev', englishName: 'Apple House', botanical: 'Malus domestica',
    type: 'Prefab', category: 'family',
    focus: 'Clean lines, orchard integration and bright minimalist comfort.',
    vibe: 'A light, welcoming house for easy family life between indoors and garden.',
    image: '/images/pinarevleri/pool-villa.webp', map: { x: 83, y: 31 },
    booking: { envCalendarKey: 'PINAR_ICAL_ELMA', status: 'unverified' },
  },
  {
    id: 'hurma', name: 'Hurma Ev', englishName: 'Date House', botanical: 'Phoenix dactylifera',
    type: 'Tiny House', category: 'tiny',
    focus: 'Ultra-compact smart micro-living, maximum utility and private calm.',
    vibe: 'The intimate smart capsule for couples seeking a secluded Mediterranean escape.',
    image: '/images/pinarevleri/pool-mountain.webp', map: { x: 51, y: 17 },
    booking: { envCalendarKey: 'PINAR_ICAL_HURMA', status: 'unverified' },
  },
];

export const getHouseById = (id: string) => pinarHouses.find((house) => house.id === id);

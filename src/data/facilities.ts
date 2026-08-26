import { HealthcareFacility } from '../types';

export interface RegionalEmergencyNumbers {
  countryCode: string;
  countryName: string;
  generalEmergency: string;
  ambulance: string;
  police: string;
  fire: string;
  poisonControl: string;
  specialNote?: string;
}

export const REGIONAL_EMERGENCY_NUMBERS: Record<string, RegionalEmergencyNumbers> = {
  US: {
    countryCode: 'US',
    countryName: 'United States',
    generalEmergency: '911',
    ambulance: '911',
    police: '911',
    fire: '911',
    poisonControl: '1-800-222-1222',
    specialNote: 'Direct dispatch for paramedics, trauma response, and poison control nationwide.'
  },
  UK: {
    countryCode: 'UK',
    countryName: 'United Kingdom',
    generalEmergency: '999',
    ambulance: '999',
    police: '999',
    fire: '999',
    poisonControl: '111 (NHS non-emergency)',
    specialNote: '112 also routes to 999 emergency operators.'
  },
  EU: {
    countryCode: 'EU',
    countryName: 'European Union',
    generalEmergency: '112',
    ambulance: '112',
    police: '112',
    fire: '112',
    poisonControl: '112',
    specialNote: 'Standard European emergency number functioning in all EU member states.'
  },
  India: {
    countryCode: 'India',
    countryName: 'India',
    generalEmergency: '112',
    ambulance: '108 / 102',
    police: '100 / 112',
    fire: '101',
    poisonControl: '1800-116-117',
    specialNote: '112 is the unified national emergency number; 108 is state ambulance service.'
  },
  Australia: {
    countryCode: 'Australia',
    countryName: 'Australia',
    generalEmergency: '000',
    ambulance: '000',
    police: '000',
    fire: '000',
    poisonControl: '13 11 26',
    specialNote: '112 also works on mobile phones across all Australian networks.'
  },
  Canada: {
    countryCode: 'Canada',
    countryName: 'Canada',
    generalEmergency: '911',
    ambulance: '911',
    police: '911',
    fire: '911',
    poisonControl: '1-800-268-9017',
    specialNote: 'Standard 911 emergency dispatch nationwide.'
  },
  Global: {
    countryCode: 'Global',
    countryName: 'International / Universal',
    generalEmergency: '112',
    ambulance: '112',
    police: '112',
    fire: '112',
    poisonControl: '112',
    specialNote: '112 is recognized globally on GSM cellular networks and automatically reroutes to local emergency services.'
  }
};

export const SAMPLE_FACILITIES: HealthcareFacility[] = [
  {
    id: 'fac-1',
    name: 'City Central Trauma Hospital & Level 1 ER',
    type: 'emergency_room',
    address: '742 University Medical Plaza, Central District',
    phone: '+1 (555) 911-2000',
    distanceKm: 2.4,
    estimatedDriveMinutes: 6,
    open24Hours: true,
    isOpenNow: true,
    openHours: '24/7 Full Emergency Services',
    hasTraumaCare: true,
    hasPediatricCare: true,
    specialties: ['Level 1 Trauma', 'Severe Hemorrhage', 'Resuscitation', 'CT Scanner'],
    coordinates: { lat: 37.7749, lng: -122.4194 }
  },
  {
    id: 'fac-2',
    name: 'Memorial Emergency Department & Burn Care Unit',
    type: 'emergency_room',
    address: '1200 Healthcare Parkway, Westside',
    phone: '+1 (555) 432-8000',
    distanceKm: 4.8,
    estimatedDriveMinutes: 11,
    open24Hours: true,
    isOpenNow: true,
    openHours: '24/7 Open',
    hasTraumaCare: true,
    hasPediatricCare: false,
    specialties: ['Burn ICU', 'Grafting', 'Surgical Debridement', 'Emergency Triage'],
    coordinates: { lat: 37.7833, lng: -122.4167 }
  },
  {
    id: 'fac-3',
    name: 'RapidCare Urgent Care & Digital X-Ray Center',
    type: 'urgent_care',
    address: '450 North Bay Blvd, Suite 102',
    phone: '+1 (555) 321-4500',
    distanceKm: 1.2,
    estimatedDriveMinutes: 4,
    open24Hours: false,
    isOpenNow: true,
    openHours: 'Open Today: 8:00 AM – 10:00 PM',
    hasTraumaCare: false,
    hasPediatricCare: true,
    specialties: ['Digital X-Ray', 'Laceration Suturing', 'Splinting', 'Tetanus Boosters'],
    coordinates: { lat: 37.7650, lng: -122.4200 }
  },
  {
    id: 'fac-4',
    name: 'Children’s Specialist Emergency Pavilion',
    type: 'emergency_room',
    address: '880 Pediatric Way, Medical Campus',
    phone: '+1 (555) 888-5437',
    distanceKm: 6.1,
    estimatedDriveMinutes: 14,
    open24Hours: true,
    isOpenNow: true,
    openHours: '24/7 Dedicated Pediatric ER',
    hasTraumaCare: true,
    hasPediatricCare: true,
    specialties: ['Pediatric Resuscitation', 'Pediatric Fracture Care', 'Concussion Screening'],
    coordinates: { lat: 37.7550, lng: -122.4350 }
  },
  {
    id: 'fac-5',
    name: 'Harbor Community Walk-In Clinic & Minor Injury Unit',
    type: 'urgent_care',
    address: '310 Marina Walkway, Docklands',
    phone: '+1 (555) 670-1200',
    distanceKm: 3.5,
    estimatedDriveMinutes: 8,
    open24Hours: false,
    isOpenNow: true,
    openHours: 'Open Today: 7:00 AM – 8:00 PM',
    hasTraumaCare: false,
    hasPediatricCare: false,
    specialties: ['Wound Dressings', 'Minor Sprains', 'Foreign Body Removal (Superficial)'],
    coordinates: { lat: 37.7900, lng: -122.4000 }
  }
];

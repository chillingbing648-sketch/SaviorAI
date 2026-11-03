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

// No synthetic or fictional facilities. Fictional facilities with fake phone numbers or distances must never be presented as real clinical facilities.
export const SAMPLE_FACILITIES: HealthcareFacility[] = [];

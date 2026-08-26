export interface EmergencyDirectoryEntry {
  country: string;
  iso: string;
  numbers: string[];
  bestNumber: string;
}

// The first number is the recommended general emergency dispatcher from the supplied directory.
export const EMERGENCY_NUMBERS_BY_ISO: Record<string, EmergencyDirectoryEntry> = {
  AD: { country: 'Andorra', iso: 'AD', numbers: ['110', '112', '116', '118'], bestNumber: '112' },
  AE: { country: 'United Arab Emirates', iso: 'AE', numbers: ['112', '911', '991', '992', '997', '998', '999'], bestNumber: '999' },
  AL: { country: 'Albania', iso: 'Albania', numbers: ['112', '126', '127', '128', '129'], bestNumber: '112' },
  AR: { country: 'Argentina', iso: 'AR', numbers: ['109', '911', '100', '101', '106', '107', '128'], bestNumber: '911' },
  AT: { country: 'Austria', iso: 'AT', numbers: ['112', '122', '128', '133', '140', '141', '142', '144', '147'], bestNumber: '112' },
  AU: { country: 'Australia', iso: 'AU', numbers: ['000', '106', '112', '132500'], bestNumber: '000' },
  BE: { country: 'Belgium', iso: 'BE', numbers: ['112', '100', '101', '102', '103', '105', '106', '107', '108', '110', '117', '119'], bestNumber: '112' },
  BR: { country: 'Brazil', iso: 'BR', numbers: ['190', '192', '193', '197', '198', '199'], bestNumber: '192' },
  CA: { country: 'Canada', iso: 'CA', numbers: ['911'], bestNumber: '911' },
  CH: { country: 'Switzerland', iso: 'CH', numbers: ['112', '117', '118', '143', '144', '147'], bestNumber: '112' },
  CL: { country: 'Chile', iso: 'CL', numbers: ['131', '132', '133', '134', '135', '136', '137', '138', '1400'], bestNumber: '131' },
  CN: { country: 'China', iso: 'CN', numbers: ['110', '119', '120', '122'], bestNumber: '120' },
  CO: { country: 'Colombia', iso: 'CO', numbers: ['123', '111', '112', '119', '125', '146', '156'], bestNumber: '123' },
  CZ: { country: 'Czech Republic', iso: 'CZ', numbers: ['112', '150', '155', '156', '158'], bestNumber: '112' },
  DE: { country: 'Germany', iso: 'DE', numbers: ['112', '110'], bestNumber: '112' },
  DK: { country: 'Denmark', iso: 'DK', numbers: ['112', '114'], bestNumber: '112' },
  EC: { country: 'Ecuador', iso: 'EC', numbers: ['911'], bestNumber: '911' },
  ES: { country: 'Spain', iso: 'ES', numbers: ['112', '061', '062', '080', '085', '091', '092'], bestNumber: '112' },
  FI: { country: 'Finland', iso: 'FI', numbers: ['112'], bestNumber: '112' },
  FR: { country: 'France', iso: 'FR', numbers: ['112', '15', '17', '18'], bestNumber: '112' },
  GB: { country: 'United Kingdom', iso: 'GB', numbers: ['999', '112'], bestNumber: '999' },
  GR: { country: 'Greece', iso: 'GR', numbers: ['112', '100', '166', '199'], bestNumber: '112' },
  HK: { country: 'Hong Kong', iso: 'HK', numbers: ['999'], bestNumber: '999' },
  HR: { country: 'Croatia', iso: 'HR', numbers: ['112', '192', '193', '194', '195'], bestNumber: '112' },
  HU: { country: 'Hungary', iso: 'HU', numbers: ['112', '104', '105', '107'], bestNumber: '112' },
  ID: { country: 'Indonesia', iso: 'ID', numbers: ['112', '110', '113', '119'], bestNumber: '112' },
  IE: { country: 'Ireland', iso: 'IE', numbers: ['999', '112'], bestNumber: '999' },
  IN: { country: 'India', iso: 'IN', numbers: ['112', '100', '101', '102'], bestNumber: '112' },
  IS: { country: 'Iceland', iso: 'IS', numbers: ['112'], bestNumber: '112' },
  IT: { country: 'Italy', iso: 'IT', numbers: ['112', '113', '114', '115', '118'], bestNumber: '112' },
  JP: { country: 'Japan', iso: 'JP', numbers: ['110', '118', '119'], bestNumber: '119' },
  KE: { country: 'Kenya', iso: 'KE', numbers: ['112', '999', '110', '114', '117'], bestNumber: '112' },
  KR: { country: 'South Korea', iso: 'KR', numbers: ['112', '119', '122'], bestNumber: '119' },
  MX: { country: 'Mexico', iso: 'MX', numbers: ['911'], bestNumber: '911' },
  MY: { country: 'Malaysia', iso: 'MY', numbers: ['999', '112'], bestNumber: '999' },
  NG: { country: 'Nigeria', iso: 'NG', numbers: ['112'], bestNumber: '112' },
  NL: { country: 'Netherlands', iso: 'NL', numbers: ['112'], bestNumber: '112' },
  NO: { country: 'Norway', iso: 'NO', numbers: ['112', '110', '113'], bestNumber: '112' },
  NZ: { country: 'New Zealand', iso: 'NZ', numbers: ['111'], bestNumber: '111' },
  PH: { country: 'Philippines', iso: 'PH', numbers: ['911'], bestNumber: '911' },
  PK: { country: 'Pakistan', iso: 'PK', numbers: ['1122', '15', '16', '115'], bestNumber: '1122' },
  PL: { country: 'Poland', iso: 'PL', numbers: ['112', '999', '998', '997'], bestNumber: '112' },
  PT: { country: 'Portugal', iso: 'PT', numbers: ['112', '117'], bestNumber: '112' },
  RO: { country: 'Romania', iso: 'RO', numbers: ['112', '113'], bestNumber: '112' },
  RU: { country: 'Russia', iso: 'RU', numbers: ['112', '101', '102', '103', '104'], bestNumber: '112' },
  SA: { country: 'Saudi Arabia', iso: 'SA', numbers: ['911', '112', '997', '998', '999'], bestNumber: '911' },
  SE: { country: 'Sweden', iso: 'SE', numbers: ['112'], bestNumber: '112' },
  SG: { country: 'Singapore', iso: 'SG', numbers: ['999', '995', '993'], bestNumber: '999' },
  TH: { country: 'Thailand', iso: 'TH', numbers: ['191', '1669', '199'], bestNumber: '191' },
  TR: { country: 'Türkiye', iso: 'TR', numbers: ['112', '155', '156', '157', '158'], bestNumber: '112' },
  UA: { country: 'Ukraine', iso: 'UA', numbers: ['112'], bestNumber: '112' },
  US: { country: 'United States', iso: 'US', numbers: ['911'], bestNumber: '911' },
  VN: { country: 'Vietnam', iso: 'VN', numbers: ['113', '114', '115'], bestNumber: '115' },
  ZA: { country: 'South Africa', iso: 'ZA', numbers: ['112', '10111', '10177'], bestNumber: '112' }
};

export function getEmergencyDirectoryEntry(countryCode?: string): EmergencyDirectoryEntry | null {
  if (!countryCode) return null;
  return EMERGENCY_NUMBERS_BY_ISO[countryCode.trim().toUpperCase()] || null;
}

export function getEmergencyNumberForCountry(countryCode?: string, fallback = '112'): string {
  return getEmergencyDirectoryEntry(countryCode)?.bestNumber || fallback;
}

export function getEmergencyContactInfo(code?: string) {
  const entry = getEmergencyDirectoryEntry(code);
  if (entry) {
    return {
      countryName: entry.country,
      generalEmergency: entry.bestNumber,
      ambulance: entry.bestNumber,
      police: entry.bestNumber,
      fire: entry.bestNumber,
      poisonControl: entry.bestNumber
    };
  }
  return null;
}

export async function detectEmergencyEntryFromCoordinates(lat: number, lon: number): Promise<EmergencyDirectoryEntry | null> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
  );
  if (!response.ok) throw new Error('Location lookup failed');
  const data = await response.json();
  return getEmergencyDirectoryEntry(data.address?.country_code);
}

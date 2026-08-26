import { MonitoredInjury, UserPreferences, MedicalProtocol, AuditLogEntry } from '../types';
import { MEDICAL_PROTOCOLS } from '../data/protocols';

const STORAGE_KEY_INJURIES = 'injuryguard_monitored_injuries';
const STORAGE_KEY_PREFS = 'injuryguard_user_preferences';
const STORAGE_KEY_PROTOCOLS = 'injuryguard_cached_protocols';
const STORAGE_KEY_AUDIT = 'injuryguard_local_audit';

export const DEFAULT_PREFERENCES: UserPreferences = {
  language: 'en',
  region: 'US',
  offlineMode: false,
  emergencyContacts: [
    {
      id: 'ec-1',
      name: 'Primary Emergency Contact',
      relationship: 'Family / Guardian',
      phone: '+1 (555) 019-2831'
    }
  ],
  highContrast: false
};

export function loadMonitoredInjuries(): MonitoredInjury[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_INJURIES);
    if (!data) return [];
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to load monitored injuries from storage', err);
    return [];
  }
}

export function saveMonitoredInjuries(injuries: MonitoredInjury[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_INJURIES, JSON.stringify(injuries));
  } catch (err) {
    console.error('Failed to save monitored injuries to storage', err);
  }
}

export function loadUserPreferences(): UserPreferences {
  try {
    const data = localStorage.getItem(STORAGE_KEY_PREFS);
    if (!data) return DEFAULT_PREFERENCES;
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(data) };
  } catch (err) {
    return DEFAULT_PREFERENCES;
  }
}

export function saveUserPreferences(prefs: UserPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify(prefs));
  } catch (err) {
    console.error('Failed to save user preferences', err);
  }
}

export const loadPreferences = loadUserPreferences;
export const savePreferences = saveUserPreferences;

export function loadCachedProtocols(): MedicalProtocol[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY_PROTOCOLS);
    if (!data) return MEDICAL_PROTOCOLS;
    return JSON.parse(data);
  } catch (err) {
    return MEDICAL_PROTOCOLS;
  }
}

export function saveCachedProtocols(protocols: MedicalProtocol[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROTOCOLS, JSON.stringify(protocols));
  } catch (err) {
    console.error('Failed to cache protocols', err);
  }
}

export function exportAllUserData(): string {
  const payload = {
    exportDate: new Date().toISOString(),
    preferences: loadUserPreferences(),
    monitoredInjuries: loadMonitoredInjuries()
  };
  return JSON.stringify(payload, null, 2);
}

export function clearAllUserData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_INJURIES);
    localStorage.removeItem(STORAGE_KEY_PREFS);
    localStorage.removeItem(STORAGE_KEY_PROTOCOLS);
    localStorage.removeItem(STORAGE_KEY_AUDIT);
  } catch (err) {
    console.error('Failed to clear user data', err);
  }
}

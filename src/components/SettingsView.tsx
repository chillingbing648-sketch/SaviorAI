import React, { useState } from 'react';
import {
  Settings,
  Globe,
  MapPin,
  Moon,
  Sun,
  ShieldCheck,
  Download,
  Trash2,
  Plus,
  Phone,
  User,
  Check,
  AlertTriangle,
  Lock
} from 'lucide-react';
import { UserPreferences, EmergencyContact } from '../types';
import { SUPPORTED_LANGUAGES } from '../lib/translations';
import { REGIONAL_EMERGENCY_NUMBERS } from '../data/facilities';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { getTranslation } from '../lib/translations';
import { detectEmergencyEntryFromCoordinates, getEmergencyDirectoryEntry } from '../data/emergencyNumbers';

interface SettingsViewProps {
  userPrefs: UserPreferences;
  onUpdatePrefs: (prefs: Partial<UserPreferences>) => void;
  onClearAllData: () => void;
  onExportData: () => void;
  onOpenAdmin: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  userPrefs,
  onUpdatePrefs,
  onClearAllData,
  onExportData,
  onOpenAdmin
}) => {
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRel, setNewContactRel] = useState('Family');
  const [confirmClear, setConfirmClear] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'detecting' | 'found' | 'error'>('idle');
  const [detectedRegion, setDetectedRegion] = useState<string | null>(null);
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);

  const detectEmergencyRegion = () => {
    if (!navigator.geolocation) {
      setLocationStatus('error');
      return;
    }

    setLocationStatus('detecting');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const entry = await detectEmergencyEntryFromCoordinates(position.coords.latitude, position.coords.longitude);
          if (!entry) throw new Error('Country unavailable');
          setDetectedRegion(entry.iso);
          setDetectedCountry(entry.country);
          setLocationStatus('found');
        } catch (error) {
          console.warn('Unable to resolve GPS region:', error);
          setLocationStatus('error');
        }
      },
      (error) => {
        console.warn('Unable to access GPS location:', error);
        setLocationStatus('error');
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    );
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;

    const newContact: EmergencyContact = {
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      relationship: newContactRel
    };

    const updated = [...(userPrefs.emergencyContacts || []), newContact];
    onUpdatePrefs({ emergencyContacts: updated });

    setNewContactName('');
    setNewContactPhone('');
  };

  const handleRemoveContact = (index: number) => {
    const updated = (userPrefs.emergencyContacts || []).filter((_, i) => i !== index);
    onUpdatePrefs({ emergencyContacts: updated });
  };

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-[#ecf7f3] dark:bg-emerald-950/30 text-slate-900 dark:text-white rounded-2xl p-6 sm:p-8 border border-[#b8e2d4] dark:border-emerald-900/60 space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#0d7a5f] dark:text-emerald-300">
          <Settings className="w-4 h-4" />
          <span>{getTranslation(userPrefs.language, 'navSettings')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {getTranslation(userPrefs.language, 'navSettings')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          Configure regional emergency services, language, UI contrast, emergency contacts, and privacy controls.
        </p>
      </div>

      {/* Regional Emergency Dispatch Settings */}
      <Card className="space-y-4">
        <div className="flex items-center space-x-2 text-neutral-900 dark:text-white font-bold text-sm">
          <MapPin className="w-4 h-4 text-red-500" />
          <span>Regional Emergency Dispatch Configuration</span>
        </div>

        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Select your current geographical jurisdiction to link the 1-Tap Emergency Trigger with your regional dispatch number:
        </p>

        <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-4 dark:border-sky-900/60 dark:bg-sky-950/20">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Use my current location</p>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
                Detect your country to suggest the correct emergency dispatch number. Your choice is never applied automatically.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={detectEmergencyRegion}
              disabled={locationStatus === 'detecting'}
              leftIcon={<MapPin className="h-3.5 w-3.5" />}
            >
              {locationStatus === 'detecting' ? 'Detecting...' : 'Detect location'}
            </Button>
          </div>
          {locationStatus === 'found' && detectedRegion && (
            <div className="mt-3 flex flex-col gap-2 border-t border-sky-200 pt-3 text-xs dark:border-sky-900/60 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-slate-700 dark:text-slate-200">
                Detected: <strong>{detectedCountry}</strong>. Suggested dispatch: <strong>{REGIONAL_EMERGENCY_NUMBERS[detectedRegion]?.generalEmergency || getEmergencyDirectoryEntry(detectedRegion)?.bestNumber || '112'}</strong>
              </p>
              <Button size="sm" variant="subtle" onClick={() => onUpdatePrefs({ region: detectedRegion })}>
                Use this region
              </Button>
            </div>
          )}
          {locationStatus === 'error' && (
            <p className="mt-3 border-t border-sky-200 pt-3 text-xs text-red-700 dark:border-sky-900/60 dark:text-red-300">
              We could not determine your location. Check browser permission or choose a region below.
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(REGIONAL_EMERGENCY_NUMBERS).map(([code, info]) => {
            const isSelected = userPrefs.region === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => onUpdatePrefs({ region: code })}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-red-50 dark:bg-red-950/50 border-red-500 text-red-900 dark:text-red-300 shadow-xs font-bold'
                    : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">{info.countryName}</span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700">
                    {info.generalEmergency}
                  </span>
                </div>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1">
                  Ambulance: {info.ambulance}
                </p>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Language & Theme Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Language */}
        <Card className="space-y-3">
          <div className="flex items-center space-x-2 text-neutral-900 dark:text-white font-bold text-sm">
            <Globe className="w-4 h-4 text-blue-500" />
            <span>Language Selection</span>
          </div>

          <div className="space-y-2">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => onUpdatePrefs({ language: lang.code })}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                  userPrefs.language === lang.code
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-transparent shadow-xs'
                    : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400'
                }`}
              >
                <span>{lang.nativeName} ({lang.name})</span>
                {userPrefs.language === lang.code && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </Card>

        {/* High Contrast & Visual Comfort */}
        <Card className="space-y-4">
          <div className="flex items-center space-x-2 text-neutral-900 dark:text-white font-bold text-sm">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Visual Accessibility & Theme</span>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 cursor-pointer">
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">High Contrast Mode</span>
              <input
                type="checkbox"
                checked={Boolean(userPrefs.highContrast)}
                onChange={(e) => onUpdatePrefs({ highContrast: e.target.checked })}
                className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 cursor-pointer">
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">Offline-First Cached Mode</span>
              <input
                type="checkbox"
                checked={Boolean(userPrefs.offlineMode)}
                onChange={(e) => onUpdatePrefs({ offlineMode: e.target.checked })}
                className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
              />
            </label>
          </div>
        </Card>

      </div>

      {/* Emergency Contacts Management */}
      <Card className="space-y-4">
        <div className="flex items-center space-x-2 text-neutral-900 dark:text-white font-bold text-sm">
          <Phone className="w-4 h-4 text-rose-500" />
          <span>Emergency Contacts (Quick Notify on Critical Triage)</span>
        </div>

        <div className="space-y-2">
          {(userPrefs.emergencyContacts || []).map((contact, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs"
            >
              <div>
                <span className="font-bold text-neutral-900 dark:text-white">{contact.name}</span>
                <span className="text-neutral-500 dark:text-neutral-400 ml-2">({contact.relationship})</span>
                <p className="text-neutral-600 dark:text-neutral-300 font-mono mt-0.5">{contact.phone}</p>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveContact(index)}
                className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Contact Form */}
        <form onSubmit={handleAddContact} className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2">
          <input
            type="text"
            placeholder="Contact Name"
            value={newContactName}
            onChange={(e) => setNewContactName(e.target.value)}
            className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-xl px-3 py-2 text-xs focus:outline-hidden"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={newContactPhone}
            onChange={(e) => setNewContactPhone(e.target.value)}
            className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-xl px-3 py-2 text-xs focus:outline-hidden"
          />
          <select
            value={newContactRel}
            onChange={(e) => setNewContactRel(e.target.value)}
            className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-xl px-3 py-2 text-xs focus:outline-hidden"
          >
            <option value="Spouse">Spouse / Partner</option>
            <option value="Parent">Parent</option>
            <option value="Child">Child</option>
            <option value="Physician">Primary Doctor</option>
            <option value="Friend">Friend</option>
            <option value="Other">Other</option>
          </select>
          <button
            type="submit"
            className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold px-4 py-2 rounded-xl hover:bg-neutral-800"
          >
            Add Contact
          </button>
        </form>
      </Card>

      {/* Data Privacy, Export & Purge */}
      <Card className="space-y-4">
        <div className="flex items-center space-x-2 text-neutral-900 dark:text-white font-bold text-sm">
          <Lock className="w-4 h-4 text-emerald-500" />
          <span>Patient Privacy, Zero Cloud Retention & Data Ownership</span>
        </div>

        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Mendly is designed with zero persistent server-side health profiling.
          All your logged check-ins, photographs, and personal notes remain stored in your local browser sandbox and can be exported or purged at any time.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            onClick={onExportData}
            className="flex items-center space-x-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Health Logs (JSON)</span>
          </button>

          {!confirmClear ? (
            <button
              onClick={() => setConfirmClear(true)}
              className="flex items-center space-x-1.5 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 text-xs font-bold px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-900 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge All Local Records</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-red-600">Are you sure?</span>
              <button
                onClick={() => {
                  onClearAllData();
                  setConfirmClear(false);
                }}
                className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg"
              >
                Confirm Delete
              </button>
              <button
                onClick={() => setConfirmClear(false)}
                className="text-xs text-neutral-500 hover:text-neutral-900"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button
          size="sm"
          variant="ghost"
          onClick={onOpenAdmin}
          leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
        >
          Safety governance tools
        </Button>
      </div>

    </div>
  );
};

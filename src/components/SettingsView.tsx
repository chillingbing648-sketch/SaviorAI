import React, { useState } from 'react';
import {
  Settings,
  Globe,
  MapPin,
  Moon,
  Sun,
  Laptop,
  ShieldCheck,
  Download,
  Trash2,
  Phone,
  Check,
  AlertTriangle,
  Lock,
  Eye,
  Activity,
  FileText
} from 'lucide-react';
import { motion } from 'motion/react';
import { UserPreferences, EmergencyContact } from '../types';
import { SUPPORTED_LANGUAGES, getTranslation } from '../lib/translations';
import { REGIONAL_EMERGENCY_NUMBERS } from '../data/facilities';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Modal } from './ui/Modal';
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
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
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
      id: `ec-${Date.now()}`,
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

  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const currentTheme = userPrefs.theme || 'system';

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-[#ecf7f3] dark:bg-[#0f2a21] text-[#081a14] dark:text-[#f5fbf8] rounded-3xl p-6 sm:p-8 border border-[#b8e2d4] dark:border-[#1d4d3e] space-y-2 shadow-xs">
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-[#0d7a5f] dark:text-[#00BE88]">
          <Settings className="w-4 h-4" />
          <span>{getTranslation(userPrefs.language, 'navSettings')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {getTranslation(userPrefs.language, 'navSettings')}
        </h1>
        <p className="text-xs sm:text-sm text-[#223730] dark:text-[#d1e4dd] leading-relaxed">
          Configure regional emergency services, appearance, language, visual contrast, emergency contacts, local storage, and privacy controls.
        </p>
      </div>

      {/* THEME & APPEARANCE CARD */}
      <Card variant="default" className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#d1ded9] dark:border-[#1b4136]">
          <div className="flex items-center space-x-2">
            <Sun className="w-4 h-4 text-amber-500" />
            <h2 className="text-base font-bold text-[#081a14] dark:text-[#f5fbf8]">
              Theme & Appearance
            </h2>
          </div>
          <Badge variant="first_aid" size="sm">
            {currentTheme.toUpperCase()}
          </Badge>
        </div>

        <p className="text-xs text-[#223730] dark:text-[#d1e4dd] leading-relaxed">
          Switch between crisp high-contrast light mode and deep clinical dark mode, or follow your operating system preferences:
        </p>

        {/* 3-Way Segmented Theme Selector */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 p-1.5 rounded-2xl bg-[#f4f7f5] dark:bg-[#091a14] border border-[#d1ded9] dark:border-[#1b4136]">
          
          {/* Light Mode Button */}
          <button
            type="button"
            onClick={() => onUpdatePrefs({ theme: 'light' })}
            className={`flex items-center justify-center space-x-2 py-3 px-2 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
              currentTheme === 'light'
                ? 'bg-white text-[#081a14] shadow-sm border border-[#c8d8d2]'
                : 'text-[#4e665f] dark:text-[#8eada3] hover:text-[#081a14] dark:hover:text-[#f5fbf8]'
            }`}
          >
            <Sun className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Light</span>
          </button>

          {/* Dark Mode Button */}
          <button
            type="button"
            onClick={() => onUpdatePrefs({ theme: 'dark' })}
            className={`flex items-center justify-center space-x-2 py-3 px-2 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
              currentTheme === 'dark'
                ? 'bg-[#00BE88] text-[#041611] shadow-sm font-black'
                : 'text-[#4e665f] dark:text-[#8eada3] hover:text-[#081a14] dark:hover:text-[#f5fbf8]'
            }`}
          >
            <Moon className="w-4 h-4 text-[#041611] shrink-0" />
            <span>Dark</span>
          </button>

          {/* System Default Button */}
          <button
            type="button"
            onClick={() => onUpdatePrefs({ theme: 'system' })}
            className={`flex items-center justify-center space-x-2 py-3 px-2 sm:px-4 rounded-xl text-xs font-bold transition-all cursor-pointer relative ${
              currentTheme === 'system'
                ? 'bg-[#0d7a5f] text-white dark:bg-[#1b4136] dark:text-white shadow-sm'
                : 'text-[#4e665f] dark:text-[#8eada3] hover:text-[#081a14] dark:hover:text-[#f5fbf8]'
            }`}
          >
            <Laptop className="w-4 h-4 shrink-0" />
            <span>System</span>
          </button>

        </div>
      </Card>

      {/* Regional Emergency Dispatch Settings */}
      <Card variant="default" className="space-y-4">
        <div className="flex items-center space-x-2 text-[#081a14] dark:text-[#f5fbf8] font-bold text-sm">
          <MapPin className="w-4 h-4 text-red-500" />
          <span>Regional Emergency Dispatch Configuration</span>
        </div>

        <p className="text-xs text-[#223730] dark:text-[#d1e4dd] leading-relaxed">
          Choose your geographical region to link the 1-Tap Emergency Trigger with your official regional dispatch number:
        </p>

        {/* GPS Detection Bar */}
        <div className="rounded-2xl border border-sky-200 bg-sky-50/70 p-4 dark:border-sky-900/60 dark:bg-sky-950/20">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-[#081a14] dark:text-[#f5fbf8]">Detect my jurisdiction via GPS</p>
              <p className="mt-0.5 text-xs text-[#223730] dark:text-[#d1e4dd]">
                Detect your country to suggest the correct emergency dispatch number. Your choice is never applied without confirmation.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={detectEmergencyRegion}
              disabled={locationStatus === 'detecting'}
              leftIcon={<MapPin className="h-3.5 w-3.5" />}
            >
              {locationStatus === 'detecting' ? 'Detecting...' : 'Detect Country'}
            </Button>
          </div>

          {locationStatus === 'found' && detectedRegion && (
            <div className="mt-3 flex flex-col gap-2 border-t border-sky-200 dark:border-sky-900/60 pt-3 text-xs sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[#081a14] dark:text-[#f5fbf8]">
                Detected: <strong>{detectedCountry}</strong>. Suggested dispatch number:{' '}
                <strong>
                  {REGIONAL_EMERGENCY_NUMBERS[detectedRegion]?.generalEmergency ||
                    getEmergencyDirectoryEntry(detectedRegion)?.bestNumber ||
                    '112'}
                </strong>
              </p>
              <Button size="sm" variant="subtle" onClick={() => onUpdatePrefs({ region: detectedRegion })}>
                Apply this region
              </Button>
            </div>
          )}

          {locationStatus === 'error' && (
            <p className="mt-3 border-t border-sky-200 dark:border-sky-900/60 pt-3 text-xs text-red-700 dark:text-red-300">
              Could not determine GPS region. Please verify browser location permissions or choose a country below.
            </p>
          )}
        </div>

        {/* Region Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Object.entries(REGIONAL_EMERGENCY_NUMBERS).map(([code, info]) => {
            const isSelected = userPrefs.region === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => onUpdatePrefs({ region: code })}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-900 dark:text-red-200 shadow-xs font-bold'
                    : 'bg-[#f4f7f5] dark:bg-[#091a14] border-[#d1ded9] dark:border-[#1b4136] text-[#223730] dark:text-[#d1e4dd] hover:border-[#0d7a5f] dark:hover:border-[#00BE88]'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-[#081a14] dark:text-[#f5fbf8]">{info.countryName}</span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#e2ede8] dark:bg-[#1b4136] text-[#081a14] dark:text-[#f5fbf8]">
                    {info.generalEmergency}
                  </span>
                </div>
                <p className="text-[10px] text-[#4e665f] dark:text-[#8eada3] mt-1">
                  Ambulance: {info.ambulance}
                </p>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Language & Visual Accessibility Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Language Selection */}
        <Card variant="default" className="space-y-3">
          <div className="flex items-center space-x-2 text-[#081a14] dark:text-[#f5fbf8] font-bold text-sm">
            <Globe className="w-4 h-4 text-sky-500" />
            <span>Language Selection</span>
          </div>

          <div className="space-y-2">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => onUpdatePrefs({ language: lang.code })}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  userPrefs.language === lang.code
                    ? 'bg-[#0d7a5f] text-white dark:bg-[#00BE88] dark:text-[#041611] border-transparent shadow-xs font-bold'
                    : 'bg-[#f4f7f5] dark:bg-[#091a14] text-[#223730] dark:text-[#d1e4dd] border-[#d1ded9] dark:border-[#1b4136] hover:border-[#0d7a5f] dark:hover:border-[#00BE88]'
                }`}
              >
                <span>{lang.nativeName} ({lang.name})</span>
                {userPrefs.language === lang.code && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </Card>

        {/* Accessibility & Motion */}
        <Card variant="default" className="space-y-4">
          <div className="flex items-center space-x-2 text-[#081a14] dark:text-[#f5fbf8] font-bold text-sm">
            <Eye className="w-4 h-4 text-[#0d7a5f] dark:text-[#00BE88]" />
            <span>Visual Accessibility</span>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3.5 rounded-xl bg-[#f4f7f5] dark:bg-[#091a14] border border-[#d1ded9] dark:border-[#1b4136] cursor-pointer">
              <div>
                <span className="font-semibold text-[#081a14] dark:text-[#f5fbf8]">High Contrast Mode</span>
                <p className="text-[11px] text-[#4e665f] dark:text-[#8eada3] mt-0.5">Increases visual distinction of borders, badges, and text</p>
              </div>
              <input
                type="checkbox"
                checked={Boolean(userPrefs.highContrast)}
                onChange={(e) => onUpdatePrefs({ highContrast: e.target.checked })}
                className="w-4 h-4 rounded text-[#0d7a5f] focus:ring-[#0d7a5f] cursor-pointer"
              />
            </label>

            <div className="p-3.5 rounded-xl bg-[#f4f7f5] dark:bg-[#091a14] border border-[#d1ded9] dark:border-[#1b4136] flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#081a14] dark:text-[#f5fbf8]">Reduced Motion</span>
                <p className="text-[11px] text-[#4e665f] dark:text-[#8eada3] mt-0.5">
                  {prefersReducedMotion ? 'System prefers reduced motion (Animations simplified)' : 'System standard motion active'}
                </p>
              </div>
              <Badge variant={prefersReducedMotion ? 'urgent' : 'neutral'} size="sm">
                {prefersReducedMotion ? 'Reduced' : 'Standard'}
              </Badge>
            </div>
          </div>
        </Card>

      </div>

      {/* Emergency Contacts Management */}
      <Card variant="default" className="space-y-4">
        <div className="flex items-center space-x-2 text-[#081a14] dark:text-[#f5fbf8] font-bold text-sm">
          <Phone className="w-4 h-4 text-rose-500" />
          <span>Emergency Contacts (Quick Notify During Critical Triage)</span>
        </div>

        <div className="space-y-2">
          {(userPrefs.emergencyContacts || []).map((contact, index) => (
            <div
              key={contact.id || index}
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#f4f7f5] dark:bg-[#091a14] border border-[#d1ded9] dark:border-[#1b4136] text-xs"
            >
              <div>
                <span className="font-bold text-[#081a14] dark:text-[#f5fbf8]">{contact.name}</span>
                <span className="text-[#4e665f] dark:text-[#8eada3] ml-2">({contact.relationship})</span>
                <p className="text-[#223730] dark:text-[#d1e4dd] font-mono mt-0.5">{contact.phone}</p>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveContact(index)}
                className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                title="Remove Contact"
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
            className="bg-[#f4f7f5] dark:bg-[#091a14] border border-[#d1ded9] dark:border-[#1b4136] text-[#081a14] dark:text-[#f5fbf8] rounded-xl px-3 py-2 text-xs focus:outline-hidden placeholder-[#6c837c]"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={newContactPhone}
            onChange={(e) => setNewContactPhone(e.target.value)}
            className="bg-[#f4f7f5] dark:bg-[#091a14] border border-[#d1ded9] dark:border-[#1b4136] text-[#081a14] dark:text-[#f5fbf8] rounded-xl px-3 py-2 text-xs focus:outline-hidden placeholder-[#6c837c]"
          />
          <select
            value={newContactRel}
            onChange={(e) => setNewContactRel(e.target.value)}
            className="bg-[#f4f7f5] dark:bg-[#091a14] border border-[#d1ded9] dark:border-[#1b4136] text-[#081a14] dark:text-[#f5fbf8] rounded-xl px-3 py-2 text-xs focus:outline-hidden"
          >
            <option value="Family">Family / Partner</option>
            <option value="Parent">Parent</option>
            <option value="Child">Child</option>
            <option value="Physician">Primary Care Physician</option>
            <option value="Friend">Friend / Colleague</option>
            <option value="Other">Other</option>
          </select>
          <Button size="sm" variant="secondary" type="submit">
            Add Contact
          </Button>
        </form>
      </Card>

      {/* Data Privacy, Export & Purge */}
      <Card variant="default" className="space-y-4">
        <div className="flex items-center space-x-2 text-[#081a14] dark:text-[#f5fbf8] font-bold text-sm">
          <Lock className="w-4 h-4 text-[#0d7a5f] dark:text-[#00BE88]" />
          <span>Patient Privacy, Local Storage & Data Ownership</span>
        </div>

        <p className="text-xs text-[#223730] dark:text-[#d1e4dd] leading-relaxed">
          Mendly is built with zero cloud user profiling. All your logged assessments, check-in history, photos, and
          notes are saved locally in your browser storage. You can export a portable JSON backup or permanently purge all records at any time.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onExportData}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            Export Health Records (JSON)
          </Button>

          <Button
            size="sm"
            variant="destructive"
            onClick={() => setIsClearModalOpen(true)}
            leftIcon={<Trash2 className="w-3.5 h-3.5" />}
          >
            Purge All Local Records
          </Button>
        </div>
      </Card>

      {/* Safety Governance Portal Link */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-[#4e665f] dark:text-[#8eada3]">
          Mendly v2026.1 • Clinical Triage & Safety Intelligence
        </span>
        <Button
          size="sm"
          variant="ghost"
          onClick={onOpenAdmin}
          leftIcon={<ShieldCheck className="w-3.5 h-3.5" />}
        >
          Safety Benchmarks & Audit Logs
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Permanently Purge Local Records?"
        subtitle="This action will delete all active monitored injuries, check-in history, and stored preferences."
        maxWidth="md"
        footer={
          <div className="flex justify-end space-x-2 w-full">
            <Button size="sm" variant="ghost" onClick={() => setIsClearModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                onClearAllData();
                setIsClearModalOpen(false);
              }}
            >
              Confirm Permanent Deletion
            </Button>
          </div>
        }
      >
        <div className="p-2 space-y-2 text-xs text-[#223730] dark:text-[#d1e4dd]">
          <p>
            Are you sure you want to delete all locally stored records? Once cleared, baseline pain scores, recovery
            timelines, and check-in logs cannot be recovered.
          </p>
        </div>
      </Modal>

    </div>
  );
};

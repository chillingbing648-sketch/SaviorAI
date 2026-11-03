import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  ShieldAlert,
  Search,
  Filter,
  Check,
  ExternalLink,
  Info,
  Building,
  HeartPulse,
  Activity,
  Flame,
  AlertTriangle,
  Compass,
  CheckCircle2,
  RefreshCw,
  PhoneCall,
  Globe
} from 'lucide-react';
import { HealthcareFacility, UserPreferences } from '../types';
import { REGIONAL_EMERGENCY_NUMBERS } from '../data/facilities';
import { getTranslation } from '../lib/translations';
import {
  detectEmergencyEntryFromCoordinates,
  getEmergencyContactInfo,
  EMERGENCY_NUMBERS_BY_ISO
} from '../data/emergencyNumbers';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

interface FindHelpViewProps {
  userPrefs: UserPreferences;
  onOpenEmergency: () => void;
}

export const FindHelpView: React.FC<FindHelpViewProps> = ({ userPrefs, onOpenEmergency }) => {
  // Geolocation state
  const [geoStatus, setGeoStatus] = useState<
    'idle' | 'requesting' | 'granted' | 'denied' | 'unavailable'
  >('idle');
  const [coords, setCoords] = useState<{ lat: number; lng: number; accuracy?: number } | null>(null);
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);
  const [manualCity, setManualCity] = useState<string>('');
  const [activeQueryLocation, setActiveQueryLocation] = useState<string>('');

  // Selected Country for Directory
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>(
    userPrefs.region || 'US'
  );

  const regionInfo =
    REGIONAL_EMERGENCY_NUMBERS[selectedCountryCode] ||
    getEmergencyContactInfo(selectedCountryCode) ||
    REGIONAL_EMERGENCY_NUMBERS.US;

  // Attempt automatic detection on mount
  useEffect(() => {
    if (navigator.geolocation) {
      setGeoStatus('requesting');
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = Number(pos.coords.latitude.toFixed(5));
          const lng = Number(pos.coords.longitude.toFixed(5));
          setCoords({ lat, lng, accuracy: Math.round(pos.coords.accuracy) });
          setGeoStatus('granted');
          setActiveQueryLocation(`${lat},${lng}`);

          try {
            const entry = await detectEmergencyEntryFromCoordinates(lat, lng);
            if (entry) {
              setDetectedCountry(entry.country);
              if (EMERGENCY_NUMBERS_BY_ISO[entry.iso]) {
                setSelectedCountryCode(entry.iso);
              }
            }
          } catch (e) {
            console.warn('Reverse geocoding unavailable:', e);
          }
        },
        (err) => {
          console.warn('Geolocation permission denied or timed out:', err);
          setGeoStatus(err.code === 1 ? 'denied' : 'unavailable');
        },
        { enableHighAccuracy: false, timeout: 6000 }
      );
    } else {
      setGeoStatus('unavailable');
    }
  }, []);

  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setGeoStatus('unavailable');
      return;
    }
    setGeoStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(5));
        const lng = Number(pos.coords.longitude.toFixed(5));
        setCoords({ lat, lng, accuracy: Math.round(pos.coords.accuracy) });
        setGeoStatus('granted');
        setActiveQueryLocation(`${lat},${lng}`);

        try {
          const entry = await detectEmergencyEntryFromCoordinates(lat, lng);
          if (entry) {
            setDetectedCountry(entry.country);
            setSelectedCountryCode(entry.iso);
          }
        } catch (_) {}
      },
      (err) => {
        setGeoStatus(err.code === 1 ? 'denied' : 'unavailable');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleApplyManualLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCity.trim()) return;
    setActiveQueryLocation(manualCity.trim());
  };

  // Build live map queries
  const buildSearchUrl = (queryType: string) => {
    const target = activeQueryLocation ? activeQueryLocation : 'near me';
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${queryType} ${target}`
    )}`;
  };

  const buildAppleMapsUrl = (queryType: string) => {
    const target = activeQueryLocation ? activeQueryLocation : 'near me';
    return `https://maps.apple.com/?q=${encodeURIComponent(`${queryType} ${target}`)}`;
  };

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-[#ecf7f3] dark:bg-[#12352B] text-[#081a14] dark:text-[#f5fbf8] rounded-3xl p-6 sm:p-8 border border-[#b8e2d4] dark:border-[#1F4A42] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center space-x-2 text-[#0d7a5f] dark:text-[#00BE88] text-xs font-bold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              <span>Verified Medical Facility Discovery & Dispatch</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {getTranslation(userPrefs.language, 'navFindHelp')}
            </h1>
            <p className="text-[#223730] dark:text-[#d1e4dd] text-xs sm:text-sm leading-relaxed">
              Connect directly with verified local emergency medical dispatchers and external mapping navigation.
              Mendly does not fabricate synthetic hospitals, unverified phone numbers, or estimated wait times.
            </p>
          </div>

          <Button
            size="lg"
            variant="emergency"
            onClick={onOpenEmergency}
            leftIcon={<ShieldAlert className="w-5 h-5 text-white" />}
            className="whitespace-nowrap self-start sm:self-center shadow-md"
            id="findhelp-emergency-btn"
          >
            Emergency Call ({regionInfo.generalEmergency})
          </Button>
        </div>
      </div>

      {/* Trust & Data Transparency Notice */}
      <div className="p-4 rounded-2xl bg-[#f4f7f5] dark:bg-[#0d221b]/30 border border-[#d1ded9] dark:border-[#1b4136] flex items-start space-x-3 text-xs text-[#223730] dark:text-[#d1e4dd]">
        <Info className="w-4 h-4 text-[#0d7a5f] dark:text-[#00BE88] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold text-[#081a14] dark:text-[#f5fbf8]">Medical Data Integrity Guarantee</p>
          <p className="leading-relaxed">
            Healthcare facilities, phone numbers, operating hours, and turn-by-turn navigation are linked directly to
            verified satellite and mapping directories. If live GPS is denied, you can specify any city or postal code below.
          </p>
        </div>
      </div>

      {/* Location Resolution Controls */}
      <Card variant="raised" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#d1ded9] dark:border-[#1b4136]">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-[#0d7a5f] dark:text-[#00BE88]" />
            <h2 className="text-sm font-bold text-[#081a14] dark:text-[#f5fbf8]">
              Your Location Target
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            {geoStatus === 'granted' && coords && (
              <span className="inline-flex items-center space-x-1.5 text-xs text-emerald-700 dark:text-[#00BE88] font-semibold bg-emerald-50 dark:bg-[#12352B] px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-[#1F4A42]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  GPS Acquired {detectedCountry ? `(${detectedCountry})` : ''} • ±{coords.accuracy}m
                </span>
              </span>
            )}
            {geoStatus === 'denied' && (
              <span className="text-xs text-amber-700 dark:text-[#F5D688] font-medium bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-900/60">
                GPS Permission Denied • Using manual search
              </span>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={handleRequestLocation}
              disabled={geoStatus === 'requesting'}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${geoStatus === 'requesting' ? 'animate-spin' : ''}`} />}
            >
              {geoStatus === 'requesting' ? 'Acquiring GPS...' : 'Refresh Position'}
            </Button>
          </div>
        </div>

        {/* Manual Location Search Form */}
        <form onSubmit={handleApplyManualLocation} className="flex flex-col sm:flex-row gap-2.5 items-center">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="Search by city, neighborhood, or postal code (e.g. Austin TX, London, Berlin)..."
              value={manualCity}
              onChange={(e) => setManualCity(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0D2921]/60 border border-[#d1ded9] dark:border-[#1b4136] text-[#081a14] dark:text-[#f5fbf8] rounded-xl pl-9 pr-3 py-2.5 text-xs focus:outline-hidden"
            />
            <Search className="w-4 h-4 text-slate-400 dark:text-[#829B93] absolute left-3 top-3 pointer-events-none" />
          </div>
          <Button size="md" variant="secondary" type="submit" className="w-full sm:w-auto">
            Set Location Target
          </Button>
        </form>

        {activeQueryLocation && (
          <p className="text-xs text-[#4e665f] dark:text-[#8eada3]">
            Active navigation query center: <strong className="text-[#081a14] dark:text-[#f5fbf8] font-semibold">{activeQueryLocation}</strong>
          </p>
        )}
      </Card>

      {/* Verified Map Navigation Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#081a14] dark:text-[#f5fbf8] flex items-center space-x-2">
            <Navigation className="w-4 h-4 text-[#0d7a5f] dark:text-[#00BE88]" />
            <span>One-Click Real-Time Facility Search & Directions</span>
          </h2>
          <span className="text-xs text-[#4e665f] dark:text-[#8eada3]">Live Satellite & Transit Maps</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* 1. Emergency Department / Trauma Centers */}
          <div className="bg-white dark:bg-[#0D2921] rounded-2xl p-5 border border-red-200 dark:border-red-900/60 shadow-xs hover:border-red-400 dark:hover:border-red-700 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300">
                  Level 1 / 2 Trauma & Acute ER
                </span>
                <span className="text-[10px] font-bold text-emerald-700 dark:text-[#00BE88] bg-emerald-50 dark:bg-[#12352B] px-2 py-0.5 rounded">
                  24/7 Service
                </span>
              </div>
              <h3 className="font-bold text-base text-[#081a14] dark:text-[#f5fbf8]">
                Emergency Departments & Hospital ERs
              </h3>
              <p className="text-xs text-[#223730] dark:text-[#d1e4dd] leading-relaxed">
                For severe hemorrhage, bone fractures with visible deformity, head trauma with loss of consciousness,
                breathing distress, large thermal burns, or acute chest trauma.
              </p>
            </div>

            <div className="pt-3 border-t border-[#d1ded9] dark:border-[#1b4136] flex flex-wrap gap-2">
              <a
                href={buildSearchUrl('Emergency Room Hospital')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center space-x-1.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-xs font-bold py-2.5 px-3 rounded-xl shadow-xs transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-white" />
                <span>Search ERs on Google Maps</span>
                <ExternalLink className="w-3 h-3 text-red-200" />
              </a>
              <a
                href={buildAppleMapsUrl('Emergency Room Hospital')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-1 bg-slate-100 hover:bg-slate-200 dark:bg-[#12352B] dark:hover:bg-[#1A4038] text-[#081a14] dark:text-[#f5fbf8] text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors"
                title="Open in Apple Maps"
              >
                <span>Apple Maps</span>
              </a>
            </div>
          </div>

          {/* 2. Urgent Care Centers */}
          <div className="bg-white dark:bg-[#0D2921] rounded-2xl p-5 border border-amber-200 dark:border-amber-900/60 shadow-xs hover:border-amber-400 dark:hover:border-amber-700 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                  Urgent Care & Minor Injury
                </span>
                <span className="text-[10px] font-medium text-[#4e665f] dark:text-[#8eada3]">
                  Walk-In / Extended Hours
                </span>
              </div>
              <h3 className="font-bold text-base text-[#081a14] dark:text-[#f5fbf8]">
                Urgent Care Clinics & Digital X-Ray Centers
              </h3>
              <p className="text-xs text-[#223730] dark:text-[#d1e4dd] leading-relaxed">
                For clean cuts requiring sutures (bleeding controlled), suspected closed sprains or small fractures,
                minor scald burns with small blisters, and animal bites requiring wound irrigation.
              </p>
            </div>

            <div className="pt-3 border-t border-[#d1ded9] dark:border-[#1b4136] flex flex-wrap gap-2">
              <a
                href={buildSearchUrl('Urgent Care Clinic')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center space-x-1.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white dark:bg-[#00BE88] dark:hover:bg-[#00A878] dark:text-[#0D2921] text-xs font-bold py-2.5 px-3 rounded-xl shadow-xs transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Search Urgent Care on Google Maps</span>
                <ExternalLink className="w-3 h-3 text-slate-300 dark:text-[#0D2921]" />
              </a>
              <a
                href={buildAppleMapsUrl('Urgent Care Clinic')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-1 bg-slate-100 hover:bg-slate-200 dark:bg-[#12352B] dark:hover:bg-[#1A4038] text-[#081a14] dark:text-[#f5fbf8] text-xs font-semibold py-2.5 px-3 rounded-xl transition-colors"
                title="Open in Apple Maps"
              >
                <span>Apple Maps</span>
              </a>
            </div>
          </div>

          {/* 3. Pediatric Emergency & Trauma */}
          <div className="bg-white dark:bg-[#0D2921] rounded-2xl p-5 border border-[#d1ded9] dark:border-[#1b4136] shadow-xs hover:border-slate-300 dark:hover:border-[#1F4A42] transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300">
                Pediatric Emergency
              </span>
              <h3 className="font-bold text-base text-[#081a14] dark:text-[#f5fbf8]">
                Children's Emergency Care Pavilions
              </h3>
              <p className="text-xs text-[#223730] dark:text-[#d1e4dd] leading-relaxed">
                Specialized pediatric medical equipment, child-specific triage protocols, and pediatric orthopedic
                specialists for infants, children, and adolescents.
              </p>
            </div>

            <div className="pt-3 border-t border-[#d1ded9] dark:border-[#1b4136] flex gap-2">
              <a
                href={buildSearchUrl("Children's Hospital Emergency")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center space-x-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#12352B] dark:hover:bg-[#1A4038] text-[#081a14] dark:text-[#f5fbf8] text-xs font-bold py-2.5 px-3 rounded-xl transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>Search Pediatric Hospitals</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

          {/* 4. Burn Care Centers */}
          <div className="bg-white dark:bg-[#0D2921] rounded-2xl p-5 border border-[#d1ded9] dark:border-[#1b4136] shadow-xs hover:border-slate-300 dark:hover:border-[#1F4A42] transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300">
                Burn Specialists
              </span>
              <h3 className="font-bold text-base text-[#081a14] dark:text-[#f5fbf8]">
                Regional Burn Care Units & Centers
              </h3>
              <p className="text-xs text-[#223730] dark:text-[#d1e4dd] leading-relaxed">
                For extensive second-degree or third-degree burns, burns involving the airway, face, hands, or major
                joints, or chemical and electrical injuries.
              </p>
            </div>

            <div className="pt-3 border-t border-[#d1ded9] dark:border-[#1b4136] flex gap-2">
              <a
                href={buildSearchUrl('Burn Center Hospital')}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center space-x-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#12352B] dark:hover:bg-[#1A4038] text-[#081a14] dark:text-[#f5fbf8] text-xs font-bold py-2.5 px-3 rounded-xl transition-colors"
              >
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Search Burn Care Units</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Regional Emergency Directory with One-Tap Dialing */}
      <Card variant="default" className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#d1ded9] dark:border-[#1b4136]">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4 text-[#0d7a5f] dark:text-[#00BE88]" />
            <h2 className="text-base font-bold text-[#081a14] dark:text-[#f5fbf8]">
              Regional Emergency Numbers Directory
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-[#4e665f] dark:text-[#8eada3]">Region / Country:</span>
            <select
              value={selectedCountryCode}
              onChange={(e) => setSelectedCountryCode(e.target.value)}
              className="bg-[#eaf0ed] dark:bg-[#0d221b] border border-[#d1ded9] dark:border-[#1b4136] text-[#081a14] dark:text-[#f5fbf8] text-xs font-semibold px-3 py-1.5 rounded-xl cursor-pointer focus:outline-hidden"
            >
              {Object.keys(REGIONAL_EMERGENCY_NUMBERS).map((code) => (
                <option key={code} value={code}>
                  {REGIONAL_EMERGENCY_NUMBERS[code].countryName} ({code})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          
          <div className="p-4 rounded-xl bg-red-50/80 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-700 dark:text-red-300">
              General Emergency
            </span>
            <p className="text-2xl font-black text-red-700 dark:text-[#FF4D4D]">
              {regionInfo.generalEmergency}
            </p>
            <a
              href={`tel:${regionInfo.generalEmergency}`}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-red-700 dark:text-red-300 hover:underline pt-1"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Dispatch</span>
            </a>
          </div>

          <div className="p-4 rounded-xl bg-[#f4f7f5] dark:bg-[#0d221b]/40 border border-[#d1ded9] dark:border-[#1b4136] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#4e665f] dark:text-[#8eada3]">
              Ambulance Direct
            </span>
            <p className="text-2xl font-black text-[#081a14] dark:text-[#f5fbf8]">
              {regionInfo.ambulance}
            </p>
            <a
              href={`tel:${regionInfo.ambulance}`}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#0d7a5f] dark:text-[#00BE88] hover:underline pt-1"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Ambulance</span>
            </a>
          </div>

          <div className="p-4 rounded-xl bg-[#f4f7f5] dark:bg-[#0d221b]/40 border border-[#d1ded9] dark:border-[#1b4136] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#4e665f] dark:text-[#8eada3]">
              Police / Dispatch
            </span>
            <p className="text-2xl font-black text-[#081a14] dark:text-[#f5fbf8]">
              {regionInfo.police}
            </p>
            <a
              href={`tel:${regionInfo.police}`}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#0d7a5f] dark:text-[#00BE88] hover:underline pt-1"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Police</span>
            </a>
          </div>

          <div className="p-4 rounded-xl bg-[#f4f7f5] dark:bg-[#0d221b]/40 border border-[#d1ded9] dark:border-[#1b4136] space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#4e665f] dark:text-[#8eada3]">
              Poison Control Center
            </span>
            <p className="text-base font-extrabold text-[#081a14] dark:text-[#f5fbf8] truncate">
              {regionInfo.poisonControl}
            </p>
            <a
              href={`tel:${regionInfo.poisonControl.replace(/[^0-9]/g, '')}`}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline pt-1"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call Poison Control</span>
            </a>
          </div>

        </div>

        {regionInfo.specialNote && (
          <p className="text-xs text-[#4e665f] dark:text-[#8eada3] italic">
            * Regional Note: {regionInfo.specialNote}
          </p>
        )}
      </Card>

      {/* ER vs. Urgent Care Clinical Decision Guide */}
      <Card variant="default" className="space-y-4">
        <div className="flex items-center space-x-2 text-[#081a14] dark:text-[#f5fbf8] font-bold text-sm">
          <Info className="w-4 h-4 text-[#0d7a5f] dark:text-[#00BE88]" />
          <span>Clinical Decision Guide: Emergency Room (ER) vs. Urgent Care Clinic</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-red-50/80 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 space-y-2">
            <p className="font-bold text-sm text-red-900 dark:text-red-300 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>Go to Emergency Department (ER) if:</span>
            </p>
            <ul className="list-disc pl-4 space-y-1 text-red-900/90 dark:text-red-300/90 text-[11px] leading-relaxed">
              <li>Pulsing, spurting, or uncontrolled bleeding soaking multiple towels</li>
              <li>Loss of consciousness, repeated vomiting after head injury, or amnesia</li>
              <li>Visible compound fracture (bone protruding) or gross limb angulation</li>
              <li>Large thermal burns covering face, hands, feet, joints, or groin</li>
              <li>Severe respiratory compromise, stridor, or blunt chest collision trauma</li>
              <li>Signs of hemodynamic shock (pale, cold, clammy skin, confusion, fainting)</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 space-y-2">
            <p className="font-bold text-sm text-amber-900 dark:text-amber-300 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Go to Urgent Care Clinic if:</span>
            </p>
            <ul className="list-disc pl-4 space-y-1 text-amber-900/90 dark:text-amber-300/90 text-[11px] leading-relaxed">
              <li>Cuts requiring stitches where bleeding is now stabilized with pressure</li>
              <li>Suspected sprain or closed fracture without bone displacement (able to bear partial weight)</li>
              <li>Minor thermal scald burns with small, intact blisters (not covering face or joints)</li>
              <li>Animal scratches or small bites requiring tetanus review or prophylactic antibiotics</li>
              <li>Foreign object splinter embedded in superficial skin layer</li>
              <li>Moderate musculoskeletal pain manageable without IV resuscitation</li>
            </ul>
          </div>
        </div>
      </Card>

    </div>
  );
};
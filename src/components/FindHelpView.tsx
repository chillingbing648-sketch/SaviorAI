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
  Flame
} from 'lucide-react';
import { HealthcareFacility, UserPreferences } from '../types';
import { REGIONAL_EMERGENCY_NUMBERS } from '../data/facilities';
import { getTranslation } from '../lib/translations';
import { getEmergencyContactInfo } from '../data/emergencyNumbers';

interface FindHelpViewProps {
  userPrefs: UserPreferences;
  onOpenEmergency: () => void;
}

export const FindHelpView: React.FC<FindHelpViewProps> = ({ userPrefs, onOpenEmergency }) => {
  const [facilities, setFacilities] = useState<HealthcareFacility[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const regionInfo = REGIONAL_EMERGENCY_NUMBERS[userPrefs.region] || getEmergencyContactInfo(userPrefs.region) || REGIONAL_EMERGENCY_NUMBERS.US;

  useEffect(() => {
    // Acquire user location if permission granted
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          fetchFacilities(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          // Fallback to default coordinates
          fetchFacilities(37.7749, -122.4194);
        },
        { timeout: 4000 }
      );
    } else {
      fetchFacilities(37.7749, -122.4194);
    }
  }, [userPrefs.region]);

  const fetchFacilities = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/facilities/nearby?lat=${lat}&lng=${lng}&region=${userPrefs.region}`);
      if (res.ok) {
        const data = await res.json();
        setFacilities(Array.isArray(data) ? data : data.facilities || []);
      }
    } catch (err) {
      console.warn('Failed to load facilities endpoint, will use fallback data', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredFacilities = facilities.filter((f) => {
    const matchesType = selectedType === 'all' || f.type === selectedType;
    const matchesSearch =
      searchQuery === '' ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.specialties.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Location Triage & Medical Dispatch</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {getTranslation(userPrefs.language, 'navFindHelp')}
            </h1>
            <p className="text-neutral-300 text-xs sm:text-sm max-w-2xl">
              Locate vetted Emergency Departments, Urgent Care Centers, and Walk-in Clinics near your current position.
            </p>
          </div>

          <button
            onClick={onOpenEmergency}
            className="flex items-center space-x-2 bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs sm:text-sm px-5 py-3 rounded-2xl shadow-lg shadow-red-600/40 transition-transform active:scale-95 whitespace-nowrap self-start sm:self-center"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{getTranslation(userPrefs.language, 'emergencyButton')} ({regionInfo.generalEmergency})</span>
          </button>
        </div>
      </div>

      {/* ER vs. Urgent Care Clinical Decision Guide */}
      <div className="bg-white dark:bg-neutral-850 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
        <div className="flex items-center space-x-2 text-neutral-900 dark:text-white font-bold text-sm">
          <Info className="w-4 h-4 text-blue-500" />
          <span>Emergency Room (ER) vs. Urgent Care Decision Guide</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 space-y-2">
            <p className="font-extrabold text-sm text-red-900 dark:text-red-300 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>Go to Emergency Room (ER) if:</span>
            </p>
            <ul className="list-disc pl-4 space-y-1 text-red-800 dark:text-red-300/90 text-[11px]">
              <li>Spurting, severe, or uncontrolled bleeding</li>
              <li>Loss of consciousness, repeated vomiting after head bump</li>
              <li>Bone piercing skin (compound fracture) or visible angular deformity</li>
              <li>Severe burns covering large areas, face, hands, or groin</li>
              <li>Difficulty breathing, chest pain, or sudden severe weakness/paralysis</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-2">
            <p className="font-extrabold text-sm text-amber-900 dark:text-amber-300 flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>Go to Urgent Care Clinic if:</span>
            </p>
            <ul className="list-disc pl-4 space-y-1 text-amber-800 dark:text-amber-300/90 text-[11px]">
              <li>Cuts requiring stitches where bleeding is now controlled</li>
              <li>Suspected sprain or minor closed bone fracture (able to bear some weight)</li>
              <li>Minor burns with small intact blisters</li>
              <li>Animal scratches or minor bites requiring tetanus or antibiotic review</li>
              <li>Moderate pain manageable without IV resuscitation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white dark:bg-neutral-850 rounded-2xl p-4 sm:p-5 border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Type pills */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Facilities' },
            { id: 'emergency_room', label: 'Emergency (ER)' },
            { id: 'urgent_care', label: 'Urgent Care' },
            { id: 'burn_center', label: 'Burn Centers' },
            { id: 'orthopedic_clinic', label: 'Orthopedic/X-Ray' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all font-semibold ${
                selectedType === t.id
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-transparent shadow-xs'
                  : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search name, specialty, address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-xl pl-8 pr-3 py-2 text-xs focus:outline-hidden"
          />
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5 pointer-events-none" />
        </div>

      </div>

      {/* Facilities Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFacilities.map((facility) => {
          const isER = facility.type === 'emergency_room';
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${facility.name} ${facility.address}`
          )}`;

          return (
            <div
              key={facility.id}
              className="bg-white dark:bg-neutral-850 rounded-2xl p-5 border border-neutral-200 dark:border-neutral-800 shadow-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                        isER
                          ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                      }`}
                    >
                      {facility.type.replace('_', ' ')}
                    </span>
                    <h3 className="font-bold text-base text-neutral-900 dark:text-white mt-1">
                      {facility.name}
                    </h3>
                  </div>

                  {facility.open24Hours && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      OPEN 24/7
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
                  <p className="flex items-center space-x-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                    <span>{facility.address}</span>
                  </p>
                  <p className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                    <span>Est. Travel Time: ~{facility.estimatedDriveMinutes || 10} mins ({facility.distanceKm || 2.4} km away)</span>
                  </p>
                </div>

                {/* Specialties chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {facility.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-medium px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions: Call & Directions */}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
                <a
                  href={`tel:${facility.phone}`}
                  className="flex-1 flex items-center justify-center space-x-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white text-xs font-bold py-2.5 px-3 rounded-xl transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-blue-500" />
                  <span>Call {facility.phone}</span>
                </a>

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center space-x-1.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-bold py-2.5 px-3 rounded-xl shadow-xs transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
                  <span>Directions & ETA</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

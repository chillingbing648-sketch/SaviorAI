import React, { useState, useEffect } from 'react';
import { PhoneCall, ShieldAlert, AlertTriangle, MapPin, FileText, X, Check, Share2, Compass } from 'lucide-react';
import { REGIONAL_EMERGENCY_NUMBERS } from '../data/facilities';
import { UserPreferences } from '../types';
import { getTranslation } from '../lib/translations';
import { detectEmergencyEntryFromCoordinates, EmergencyDirectoryEntry } from '../data/emergencyNumbers';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  userPrefs: UserPreferences;
  onOpenReport?: () => void;
  onOpenFindHelp?: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  userPrefs,
  onOpenReport,
  onOpenFindHelp
}) => {
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number; accuracy: number; address: string } | null>(null);
  const [copiedLocation, setCopiedLocation] = useState(false);
  const [contactNotified, setContactNotified] = useState(false);
  const [gpsEmergencyEntry, setGpsEmergencyEntry] = useState<EmergencyDirectoryEntry | null>(null);

  const regionInfo = REGIONAL_EMERGENCY_NUMBERS[userPrefs.region] || REGIONAL_EMERGENCY_NUMBERS.US;
  const emergencyNumber = gpsEmergencyEntry?.bestNumber || regionInfo.generalEmergency;
  const emergencyCountry = gpsEmergencyEntry?.country || regionInfo.countryName;

  useEffect(() => {
    if (isOpen && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsLocation({
            lat: Number(pos.coords.latitude.toFixed(5)),
            lng: Number(pos.coords.longitude.toFixed(5)),
            accuracy: Math.round(pos.coords.accuracy),
            address: 'GPS Position Acquired — Ready to state to emergency dispatcher'
          });
          detectEmergencyEntryFromCoordinates(pos.coords.latitude, pos.coords.longitude)
            .then(setGpsEmergencyEntry)
            .catch((error) => console.warn('Emergency country lookup unavailable:', error));
        },
        (err) => {
          console.warn('Geolocation unavailable in emergency mode:', err);
          setGpsLocation(null);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyLocation = () => {
    if (gpsLocation) {
      const text = `EMERGENCY: I need help at Latitude: ${gpsLocation.lat}, Longitude: ${gpsLocation.lng} (Accuracy: ~${gpsLocation.accuracy}m)`;
      navigator.clipboard.writeText(text);
      setCopiedLocation(true);
      setTimeout(() => setCopiedLocation(false), 3000);
    }
  };

  const handleNotifyContacts = () => {
    setContactNotified(true);
    setTimeout(() => setContactNotified(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn" id="emergency-modal-overlay" role="presentation">
      <div className="relative w-full max-w-2xl bg-[#121915] border border-red-500/80 rounded-2xl shadow-2xl overflow-hidden text-white" role="dialog" aria-modal="true" aria-labelledby="emergency-modal-title">
        {/* Top Emergency Banner */}
        <div className="bg-red-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
              <ShieldAlert className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 id="emergency-modal-title" className="text-xl font-bold tracking-tight">{getTranslation(userPrefs.language, 'emergencyButton')}</h2>
              <p className="text-xs text-red-100 font-medium">Call local emergency services now if someone may be in danger.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
            title="Close Emergency Mode"
            id="emergency-modal-close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Main Call Action */}
          <div className="bg-gradient-to-br from-red-950/80 to-neutral-900 border border-red-500/50 rounded-xl p-5 text-center space-y-3">
            <p className="text-sm uppercase tracking-wider text-red-300 font-semibold">Immediate Action</p>
            <h3 className="text-2xl font-bold text-white">Call emergency services now</h3>
            <p className="text-sm text-neutral-300">
              For your location ({emergencyCountry}), call dispatch immediately:
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`tel:${emergencyNumber}`}
                id="emergency-call-primary-btn"
                className="flex items-center justify-center space-x-3 bg-red-600 hover:bg-red-500 text-white font-extrabold text-lg px-8 py-4 rounded-xl shadow-lg shadow-red-600/40 transition-all transform active:scale-95"
              >
                <PhoneCall className="w-6 h-6 animate-bounce" />
                <span>{getTranslation(userPrefs.language, 'emergencyButton')} {emergencyNumber}</span>
              </a>

              {regionInfo.ambulance !== regionInfo.generalEmergency && (
                <a
                  href={`tel:${regionInfo.ambulance}`}
                  className="flex items-center justify-center space-x-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-sm px-4 py-3 rounded-xl border border-neutral-700 transition-colors"
                >
                  <PhoneCall className="w-4 h-4 text-red-400" />
                  <span>Ambulance: {regionInfo.ambulance}</span>
                </a>
              )}
            </div>
          </div>

          {/* Life-Saving Immediate Protocol */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>3 Critical Life-Saving Actions While Waiting:</span>
            </h4>
            <div className="grid grid-cols-1 gap-2.5">
              <div className="bg-neutral-800/80 border border-neutral-700/70 rounded-xl p-3.5 flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 text-red-400 text-xs font-bold flex items-center justify-center mt-0.5">1</span>
                <div>
                  <p className="text-sm font-semibold text-white">Continuous Direct Pressure on Bleeding</p>
                  <p className="text-xs text-neutral-300 mt-0.5">Firmly press a clean cloth directly over any open bleeding wound. Do NOT remove soaked layers — add more on top.</p>
                </div>
              </div>
              <div className="bg-neutral-800/80 border border-neutral-700/70 rounded-xl p-3.5 flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 text-red-400 text-xs font-bold flex items-center justify-center mt-0.5">2</span>
                <div>
                  <p className="text-sm font-semibold text-white">Do NOT Move Head, Neck, or Obvious Fractures</p>
                  <p className="text-xs text-neutral-300 mt-0.5">Keep the injured person flat and motionless. Never attempt to realign deformed limbs or remove embedded objects.</p>
                </div>
              </div>
              <div className="bg-neutral-800/80 border border-neutral-700/70 rounded-xl p-3.5 flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-500/20 text-red-400 text-xs font-bold flex items-center justify-center mt-0.5">3</span>
                <div>
                  <p className="text-sm font-semibold text-white">Prevent Shock & Keep Warm</p>
                  <p className="text-xs text-neutral-300 mt-0.5">Cover with a warm blanket or jacket. Do not give any food, water, or oral medications before medical arrival.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dispatcher Location Helper */}
          <div className="bg-neutral-800/60 border border-neutral-700 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-neutral-300 text-xs font-semibold uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Tell the 911 Dispatcher Your Coordinates:</span>
              </div>
              <button
                onClick={handleCopyLocation}
                className="text-xs flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-medium px-2 py-1 bg-emerald-950/40 border border-emerald-800/50 rounded-lg transition-colors"
              >
                {copiedLocation ? <Check className="w-3 h-3 text-emerald-400" /> : <Share2 className="w-3 h-3" />}
                <span>{copiedLocation ? 'Copied to Clipboard' : 'Copy GPS'}</span>
              </button>
            </div>
            {gpsLocation ? (
              <div className="bg-neutral-900/90 rounded-lg p-3 border border-neutral-700 text-xs font-mono text-neutral-200">
                <p className="font-semibold text-emerald-400">Lat: {gpsLocation.lat}, Lng: {gpsLocation.lng}</p>
                <p className="text-neutral-400 mt-0.5">{gpsLocation.address} (Accuracy ±{gpsLocation.accuracy}m)</p>
              </div>
            ) : (
              <p className="text-xs text-neutral-400">Location unavailable. Tell the dispatcher your address or nearest landmark.</p>
            )}
          </div>

          {/* Quick Helper Tools */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {onOpenReport && (
              <button
                onClick={() => {
                  onClose();
                  onOpenReport();
                }}
                className="flex items-center justify-center space-x-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white text-xs font-semibold py-3 px-4 rounded-xl transition-colors"
                id="emergency-show-report-btn"
              >
                <FileText className="w-4 h-4 text-blue-400" />
                <span>Show Emergency Medical Report</span>
              </button>
            )}

            {onOpenFindHelp && (
              <button
                onClick={() => {
                  onClose();
                  onOpenFindHelp();
                }}
                className="flex items-center justify-center space-x-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white text-xs font-semibold py-3 px-4 rounded-xl transition-colors"
                id="emergency-nearest-trauma-btn"
              >
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Find Nearest Trauma Center</span>
              </button>
            )}
          </div>

          {/* Emergency Contact Quick Broadcast */}
          {userPrefs.emergencyContacts && userPrefs.emergencyContacts.length > 0 && (
            <div className="pt-1 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
              <span>Emergency Contact: {userPrefs.emergencyContacts[0].name} ({userPrefs.emergencyContacts[0].phone})</span>
              <a
                href={`tel:${userPrefs.emergencyContacts[0].phone}`}
                className="text-red-400 hover:text-red-300 font-semibold"
              >
                Call Contact
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

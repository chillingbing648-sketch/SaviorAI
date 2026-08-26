import React from 'react';
import {
  ShieldAlert,
  Activity,
  AlertTriangle,
  Clock,
  HeartPulse,
  Flame,
  Bandage,
  Bone,
  Brain,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Info,
  ExternalLink
} from 'lucide-react';
import { MonitoredInjury, SafetyBenchmarkTestCase, UserPreferences } from '../types';
import { REGIONAL_EMERGENCY_NUMBERS } from '../data/facilities';
import { getTranslation } from '../lib/translations';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';
import { SectionHeader } from './ui/SectionHeader';
import { getEmergencyContactInfo } from '../data/emergencyNumbers';

interface HomeViewProps {
  onStartAssessment: (prefillCase?: SafetyBenchmarkTestCase) => void;
  onOpenEmergency: () => void;
  onOpenWatch: (injuryId?: string) => void;
  onOpenLibrary: (category?: string) => void;
  onOpenFindHelp: () => void;
  monitoredInjuries: MonitoredInjury[];
  userPrefs: UserPreferences;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onStartAssessment,
  onOpenEmergency,
  onOpenWatch,
  onOpenLibrary,
  onOpenFindHelp,
  monitoredInjuries,
  userPrefs
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return getTranslation(userPrefs.language, 'morning');
    if (hour < 17) return getTranslation(userPrefs.language, 'afternoon');
    return getTranslation(userPrefs.language, 'evening');
  };

  const regionInfo = REGIONAL_EMERGENCY_NUMBERS[userPrefs.region] || getEmergencyContactInfo(userPrefs.region) || REGIONAL_EMERGENCY_NUMBERS.US;
  const activeInjuries = monitoredInjuries.filter((i) => i.status === 'active');

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16 animate-fadeIn">
      
      {/* Top Welcome & Urgency Prompt */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ecf7f3] via-[#f1f9f6] to-[#e4f3ed] dark:from-[#0d1c16] dark:via-[#11251e] dark:to-[#091510] border border-[#b8e2d4] dark:border-[#1e3b2e] p-6 sm:p-10 shadow-xs">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 text-[#0d7a5f] dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>{getTranslation(userPrefs.language, 'appTagline')}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            {getGreeting()}. {getTranslation(userPrefs.language, 'homePrompt')}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
            {getTranslation(userPrefs.language, 'homeDescription')}
          </p>

          {/* Core Action Buttons */}
          <div className="pt-3 flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              variant="primary"
              onClick={() => onStartAssessment()}
              leftIcon={<Activity className="w-5 h-5" />}
              rightIcon={<ArrowRight className="w-4 h-4 text-emerald-100" />}
              id="home-assess-btn"
            >
              {getTranslation(userPrefs.language, 'assessInjury')}
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={onOpenEmergency}
              leftIcon={<ShieldAlert className="w-5 h-5 text-red-600" />}
              className="text-red-700 hover:text-red-800 dark:text-red-300 border-red-200 hover:border-red-300 dark:border-red-900/60 bg-white/90 dark:bg-[#15201a]"
              id="home-emergency-btn"
            >
              {getTranslation(userPrefs.language, 'emergencyButton')} ({regionInfo.generalEmergency})
            </Button>
          </div>
        </div>

        {/* Subtle decorative shield watermark */}
        <div className="absolute right-4 -bottom-10 opacity-[0.04] dark:opacity-[0.06] pointer-events-none hidden lg:block text-slate-900 dark:text-white">
          <ShieldAlert className="w-80 h-80" />
        </div>
      </div>

      {/* Red Flag Warning Notice Bar */}
      <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/90 dark:border-amber-900/60 rounded-2xl p-4 sm:p-5 flex items-start space-x-3.5 text-amber-900 dark:text-amber-200">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs sm:text-sm">
          <p className="font-bold">{getTranslation(userPrefs.language, 'emergencyWarning')}</p>
          <p className="text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
            If the injured person has difficulty breathing, heavy/spurting bleeding, loss of consciousness, suspected spinal injury, or signs of shock, 
            <strong className="font-bold"> do not wait for AI analysis — call {regionInfo.generalEmergency} immediately</strong>.
          </p>
        </div>
      </div>

      {/* Active Injury Watch Status (If Any) */}
      {activeInjuries.length > 0 && (
        <div className="space-y-4">
          <SectionHeader
            title="Active Injury Watch"
            icon={<HeartPulse className="w-5 h-5 text-rose-500" />}
            badge={
              <Badge variant="urgent" size="sm">
                {activeInjuries.length} Monitoring
              </Badge>
            }
            action={
              <button
                onClick={() => onOpenWatch()}
                className="text-xs font-bold text-[#0d7a5f] dark:text-emerald-400 hover:underline flex items-center space-x-1"
              >
                <span>View All ({activeInjuries.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeInjuries.map((injury) => {
              const latestEntry = injury.entries[injury.entries.length - 1];
              return (
                <Card
                  key={injury.id}
                  variant="interactive"
                  onClick={() => onOpenWatch(injury.id)}
                  className="group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {injury.originalInput.bodyPart} • {injury.originalInput.mechanism}
                      </span>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base mt-0.5 group-hover:text-[#0d7a5f] dark:group-hover:text-emerald-400 transition-colors">
                        {injury.title}
                      </h3>
                    </div>
                    <Badge triageLevel={injury.initialAssessment.urgencyLevel} size="sm" />
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#1e2c25] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{injury.entries.length} Check-in Logs</span>
                    </span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      Pain: {latestEntry ? `${latestEntry.painScore}/10` : `${injury.originalInput.painLevel}/10`}
                    </span>
                    <span className="text-[#0d7a5f] dark:text-emerald-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
                      Update Log &rarr;
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Verified First-Aid Protocols */}
      <div className="space-y-4">
        <SectionHeader
          title={getTranslation(userPrefs.language, 'firstAidProtocols')}
          description="Standardized reference cards based on ARC, WHO, Mayo Clinic, and NHS clinical guidelines"
          icon={<ShieldCheck className="w-5 h-5 text-sky-500" />}
          action={
            <button
              onClick={() => onOpenLibrary()}
              className="text-xs font-bold text-[#0d7a5f] dark:text-emerald-400 hover:underline flex items-center space-x-1"
            >
              <span>{getTranslation(userPrefs.language, 'exploreLibrary')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          }
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <Card
            variant="interactive"
            onClick={() => onOpenLibrary('wounds')}
            className="text-center space-y-2 group"
          >
            <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
              <Bandage className="w-5 h-5" />
            </div>
            <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{getTranslation(userPrefs.language, 'cutsBleeding')}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">ARC / WHO Standard</p>
          </Card>

          <Card
            variant="interactive"
            onClick={() => onOpenLibrary('burns')}
            className="text-center space-y-2 group"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
              <Flame className="w-5 h-5" />
            </div>
            <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{getTranslation(userPrefs.language, 'burnsScalds')}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Cooling & Covering</p>
          </Card>

          <Card
            variant="interactive"
            onClick={() => onOpenLibrary('orthopedic')}
            className="text-center space-y-2 group"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
              <Bone className="w-5 h-5" />
            </div>
            <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{getTranslation(userPrefs.language, 'sprainsFractures')}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">RICE & Immobilization</p>
          </Card>

          <Card
            variant="interactive"
            onClick={() => onOpenLibrary('head_neck')}
            className="text-center space-y-2 group"
          >
            <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform">
              <Brain className="w-5 h-5" />
            </div>
            <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">{getTranslation(userPrefs.language, 'headConcussion')}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">TBI Red Flags (NHS)</p>
          </Card>
        </div>
      </div>

      {/* Medical Safety Principles Footer Banner */}
      <Card variant="raised" className="space-y-4">
        <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold text-sm">
          <Info className="w-4 h-4 text-[#0d7a5f] dark:text-emerald-400" />
          <span>Core Safety & Medical Governance Architecture</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <div className="space-y-1">
            <p className="font-bold text-slate-900 dark:text-slate-200">1. Safe Escalation Bias</p>
            <p>Safety over feature volume. When information is uncertain or ambiguous, the triage engine strictly escalates toward professional medical care.</p>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-slate-900 dark:text-slate-200">2. Harm Prevention ("Avoid")</p>
            <p>Every scenario includes mandatory contraindications (e.g., no butter on burns, no removing embedded objects, no realigning deformed limbs).</p>
          </div>
          <div className="space-y-1">
            <p className="font-bold text-slate-900 dark:text-slate-200">3. Non-Diagnostic Boundary</p>
            <p>AI findings provide supportive triage observations only and never replace clinical examinations, X-rays, or emergency medical services.</p>
          </div>
        </div>
      </Card>

    </div>
  );
};

import React from 'react';
import { PhoneCall, ShieldAlert,
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
  MapPin,
  BookOpen
} from 'lucide-react';
import { motion } from 'motion/react';
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

  const regionInfo =
    REGIONAL_EMERGENCY_NUMBERS[userPrefs.region] ||
    getEmergencyContactInfo(userPrefs.region) ||
    REGIONAL_EMERGENCY_NUMBERS.IN ||
    REGIONAL_EMERGENCY_NUMBERS.India ||
    REGIONAL_EMERGENCY_NUMBERS.US;
  const activeInjuries = monitoredInjuries.filter((i) => i.status === 'active');

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 max-w-6xl mx-auto pb-16"
    >
      
      {/* Hero Welcome & Primary Action Card */}
      <motion.div variants={itemVariants}>
        <div className="relative overflow-hidden rounded-3xl bg-[#ecf7f3] dark:bg-[#0f2a21] border border-[#b8e2d4] dark:border-[#1d4d3e] p-6 sm:p-10 shadow-xs">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center space-x-2 text-[#0d7a5f] dark:text-[#00BE88] text-xs font-bold uppercase tracking-wider bg-white/70 dark:bg-[#081a14]/60 px-3 py-1 rounded-full border border-[#b8e2d4] dark:border-[#1d4d3e]">
              <ShieldCheck className="w-4 h-4" />
              <span>Safety-First Clinical Triage & Harm Prevention</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#081a14] dark:text-[#f5fbf8] leading-[1.15]">
              {getGreeting()}. {getTranslation(userPrefs.language, 'homePrompt')}
            </h1>

            <p className="text-[#223730] dark:text-[#d1e4dd] text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              Deterministic clinical safety gates evaluate life-threats before AI assistance.
              Receive structured immediate guidance, contraindicated harm prevention, and local emergency support.
            </p>

            {/* Primary Call to Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                variant="primary"
                onClick={() => onStartAssessment()}
                leftIcon={<Activity className="w-5 h-5" />}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                id="home-assess-btn"
              >
                Start Injury Assessment
              </Button>

              <Button
                size="lg"
                variant="emergency-outline"
                onClick={onOpenEmergency}
                leftIcon={<ShieldAlert className="w-5 h-5 text-red-600 dark:text-[#FF4D4D]" />}
                id="home-emergency-btn"
              >
                {getTranslation(userPrefs.language, 'emergencyButton')} ({regionInfo.generalEmergency})
              </Button>
            </div>
          </div>

          {/* Decorative shield watermark */}
          <div className="absolute right-4 -bottom-10 opacity-[0.035] dark:opacity-[0.06] pointer-events-none hidden lg:block text-[#081a14] dark:text-white">
            <ShieldAlert className="w-80 h-80" />
          </div>
        </div>
      </motion.div>

      {/* Immediate Red Flag Warning Banner */}
      <motion.div variants={itemVariants}>
        <div className="bg-amber-50 dark:bg-[#201809] border border-amber-300 dark:border-[#735316] rounded-2xl p-4 sm:p-5 flex items-start space-x-3.5 text-amber-950 dark:text-[#F5D688] shadow-2xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-[#F5B942] shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm">
            <p className="font-bold text-[#78350f] dark:text-[#fde68a]">{getTranslation(userPrefs.language, 'emergencyWarning')}</p>
            <p className="text-[#92400e] dark:text-[#fef08a] leading-relaxed">
              If the injured person has difficulty breathing, pulsing or heavy bleeding, loss of consciousness, suspected spinal trauma, or signs of shock, 
              <strong className="font-bold"> do not delay for digital triage — call {regionInfo.generalEmergency} immediately</strong>.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Active Injury Watch Status */}
      <motion.div variants={itemVariants}>
        {activeInjuries.length > 0 ? (
          <div className="space-y-4">
            <SectionHeader
              title="Active Injury Monitoring"
              description="Track recovery progression, pain changes, and deterioration indicators"
              icon={<HeartPulse className="w-5 h-5 text-rose-500" />}
              badge={
                <Badge variant="urgent" size="sm">
                  {activeInjuries.length} Active
                </Badge>
              }
              action={
                <button
                  onClick={() => onOpenWatch()}
                  className="text-xs font-bold text-[#0d7a5f] dark:text-[#00BE88] hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <span>View All ({activeInjuries.length})</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeInjuries.map((injury) => {
                const latestEntry = injury.entries[injury.entries.length - 1];
                const hasAlert = injury.status === 'escalated' || injury.entries.some((e) => e.deteriorationDetected);

                return (
                  <Card
                    key={injury.id}
                    variant="interactive"
                    onClick={() => onOpenWatch(injury.id)}
                    className="group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#4e665f] dark:text-[#8eada3]">
                          {injury.originalInput.bodyPart} • {injury.originalInput.mechanism}
                        </span>
                        <h3 className="font-bold text-[#081a14] dark:text-[#f5fbf8] text-base mt-0.5 group-hover:text-[#0d7a5f] dark:group-hover:text-[#00BE88] transition-colors">
                          {injury.title}
                        </h3>
                      </div>
                      <Badge
                        variant={hasAlert ? 'emergency' : undefined}
                        triageLevel={hasAlert ? undefined : injury.initialAssessment.urgencyLevel}
                        size="sm"
                      >
                        {hasAlert ? 'Escalated' : undefined}
                      </Badge>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#d1ded9] dark:border-[#1b4136] flex items-center justify-between text-xs text-[#4e665f] dark:text-[#8eada3]">
                      <span className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{injury.entries.length} Check-in Logs</span>
                      </span>
                      <span className="font-semibold text-[#223730] dark:text-[#d1e4dd]">
                        Pain: {latestEntry ? `${latestEntry.painScore}/10` : `${injury.originalInput.painLevel}/10`}
                      </span>
                      <span className="text-[#0d7a5f] dark:text-[#00BE88] font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
                        Update Log &rarr;
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ) : (
          <Card variant="raised" padding="md" className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#ecf7f3] dark:bg-[#122c23] flex items-center justify-center text-[#0d7a5f] dark:text-[#00BE88] shrink-0 border border-[#b8e2d4] dark:border-[#1e4e40]">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#081a14] dark:text-[#f5fbf8]">
                  Injury Watch Recovery Tracker
                </h3>
                <p className="text-xs text-[#4e665f] dark:text-[#8eada3]">
                  No active injuries are currently being monitored. Run an assessment to start a recovery log.
                </p>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={() => onStartAssessment()}>
              Assess an Injury
            </Button>
          </Card>
        )}
      </motion.div>

      {/* Verified Medical First-Aid Protocols */}
      <motion.div variants={itemVariants} className="space-y-4">
        <SectionHeader
          title={getTranslation(userPrefs.language, 'firstAidProtocols')}
          description="Standardized clinical guidance based on ARC, WHO, Mayo Clinic, and NHS guidelines"
          icon={<ShieldCheck className="w-5 h-5 text-sky-500" />}
          action={
            <button
              onClick={() => onOpenLibrary()}
              className="text-xs font-bold text-[#0d7a5f] dark:text-[#00BE88] hover:underline flex items-center space-x-1 cursor-pointer"
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
            <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform border border-red-200 dark:border-red-900/60">
              <Bandage className="w-5 h-5" />
            </div>
            <p className="font-bold text-xs sm:text-sm text-[#081a14] dark:text-[#f5fbf8]">
              {getTranslation(userPrefs.language, 'cutsBleeding')}
            </p>
            <p className="text-[11px] text-[#4e665f] dark:text-[#8eada3]">American Red Cross / WHO</p>
          </Card>

          <Card
            variant="interactive"
            onClick={() => onOpenLibrary('burns')}
            className="text-center space-y-2 group"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform border border-amber-200 dark:border-amber-900/60">
              <Flame className="w-5 h-5" />
            </div>
            <p className="font-bold text-xs sm:text-sm text-[#081a14] dark:text-[#f5fbf8]">
              {getTranslation(userPrefs.language, 'burnsScalds')}
            </p>
            <p className="text-[11px] text-[#4e665f] dark:text-[#8eada3]">Continuous 20m Cooling</p>
          </Card>

          <Card
            variant="interactive"
            onClick={() => onOpenLibrary('orthopedic')}
            className="text-center space-y-2 group"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform border border-blue-200 dark:border-blue-900/60">
              <Bone className="w-5 h-5" />
            </div>
            <p className="font-bold text-xs sm:text-sm text-[#081a14] dark:text-[#f5fbf8]">
              {getTranslation(userPrefs.language, 'sprainsFractures')}
            </p>
            <p className="text-[11px] text-[#4e665f] dark:text-[#8eada3]">Mayo Clinic Immobilization</p>
          </Card>

          <Card
            variant="interactive"
            onClick={() => onOpenLibrary('head_neck')}
            className="text-center space-y-2 group"
          >
            <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto group-hover:scale-105 transition-transform border border-purple-200 dark:border-purple-900/60">
              <Brain className="w-5 h-5" />
            </div>
            <p className="font-bold text-xs sm:text-sm text-[#081a14] dark:text-[#f5fbf8]">
              {getTranslation(userPrefs.language, 'headConcussion')}
            </p>
            <p className="text-[11px] text-[#4e665f] dark:text-[#8eada3]">NHS TBI Red Flags</p>
          </Card>
        </div>
      </motion.div>

      {/* Shortcuts Grid: Emergency Care Navigation & Clinical Safety */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card
          variant="interactive"
          onClick={onOpenFindHelp}
          className="flex items-center space-x-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#ecf7f3] dark:bg-[#122c23] flex items-center justify-center text-[#0d7a5f] dark:text-[#00BE88] shrink-0 group-hover:scale-105 transition-transform border border-[#b8e2d4] dark:border-[#1e4e40]">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#081a14] dark:text-[#f5fbf8] group-hover:text-[#0d7a5f] dark:group-hover:text-[#00BE88] transition-colors">
              Find Verified Emergency Care
            </h3>
            <p className="text-xs text-[#4e665f] dark:text-[#8eada3] mt-0.5">
              Live mapping navigation for ERs, urgent care clinics, and pediatric emergency centers near you.
            </p>
          </div>
        </Card>

        <Card
          variant="interactive"
          onClick={() => onOpenLibrary()}
          className="flex items-center space-x-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#f0f9ff] dark:bg-[#0c2636] flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0 group-hover:scale-105 transition-transform border border-sky-200 dark:border-sky-800/60">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#081a14] dark:text-[#f5fbf8] group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              Browse Safety Protocol Library
            </h3>
            <p className="text-xs text-[#4e665f] dark:text-[#8eada3] mt-0.5">
              Explore standardized protocols for wounds, burns, trauma, sprains, and foreign body emergencies.
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Safety Architecture & Non-Diagnostic Disclaimer */}
      <motion.div variants={itemVariants}>
        <Card variant="raised" className="space-y-4">
          <div className="flex items-center space-x-2 text-[#081a14] dark:text-[#f5fbf8] font-bold text-sm">
            <Info className="w-4 h-4 text-[#0d7a5f] dark:text-[#00BE88]" />
            <span>Core Safety & Medical Governance Architecture</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-xs text-[#223730] dark:text-[#d1e4dd] leading-relaxed">
            <div className="space-y-1">
              <p className="font-bold text-[#081a14] dark:text-[#f5fbf8]">1. Safe Escalation Bias</p>
              <p>
                Safety over feature volume. When information is uncertain or ambiguous, the triage engine strictly escalates toward professional medical care.
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-[#081a14] dark:text-[#f5fbf8]">2. Harm Prevention ("Avoid")</p>
              <p>
                Every scenario includes mandatory contraindications (no butter on burns, no removing embedded objects, no manipulating deformed limbs).
              </p>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-[#081a14] dark:text-[#f5fbf8]">3. Non-Diagnostic Boundary</p>
              <p>
                Triage guidance provides supportive first-aid observations only and never replaces clinical examinations, X-rays, or emergency medical services.
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

    </motion.div>
  );
};

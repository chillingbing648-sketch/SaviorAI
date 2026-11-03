import React, { useState } from 'react';
import {
  HeartPulse,
  AlertTriangle,
  Clock,
  Plus,
  ShieldAlert,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Minus,
  FileText,
  Trash2,
  ChevronRight,
  Activity,
  Calendar,
  AlertCircle,
  X,
  Thermometer,
  Eye,
  Check
} from 'lucide-react';
import { MonitoredInjury, InjuryWatchEntry, UserPreferences } from '../types';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { getTranslation } from '../lib/translations';

interface InjuryWatchViewProps {
  injuries: MonitoredInjury[];
  selectedInjuryId?: string | null;
  onUpdateInjury: (updatedInjury: MonitoredInjury) => void;
  onDeleteInjury: (injuryId: string) => void;
  onOpenEmergency: () => void;
  onOpenReport: (injury: MonitoredInjury) => void;
  onStartNewAssessment: () => void;
  userPrefs: UserPreferences;
}

export const InjuryWatchView: React.FC<InjuryWatchViewProps> = ({
  injuries,
  selectedInjuryId,
  onUpdateInjury,
  onDeleteInjury,
  onOpenEmergency,
  onOpenReport,
  onStartNewAssessment,
  userPrefs
}) => {
  const [activeId, setActiveId] = useState<string | null>(
    selectedInjuryId || (injuries.length > 0 ? injuries[0].id : null)
  );
  const [isLoggingModalOpen, setIsLoggingModalOpen] = useState<boolean>(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // New log entry form state (neutral defaults)
  const [painScore, setPainScore] = useState<number>(3);
  const [bleedingStatus, setBleedingStatus] = useState<'none' | 'minimal' | 'moderate' | 'uncontrolled'>('none');
  const [swellingStatus, setSwellingStatus] = useState<'improving' | 'stable' | 'worsening'>('stable');
  const [mobilityStatus, setMobilityStatus] = useState<'normal' | 'limited' | 'unable_to_move'>('limited');
  const [sensationStatus, setSensationStatus] = useState<'normal' | 'tingling' | 'numb' | 'lost'>('normal');
  const [temperatureFever, setTemperatureFever] = useState<boolean>(false);
  const [logNotes, setLogNotes] = useState<string>('');

  const currentInjury = injuries.find((i) => i.id === activeId) || injuries[0];

  // Dynamic Deterioration Detection Logic
  const handleSaveLogEntry = () => {
    if (!currentInjury) return;

    const previousEntry = currentInjury.entries[currentInjury.entries.length - 1];

    let deteriorationDetected = false;
    let deteriorationReason = '';

    // Deterioration Rules based on clinical watch flags
    if (previousEntry) {
      if (painScore >= previousEntry.painScore + 2) {
        deteriorationDetected = true;
        deteriorationReason = `Pain surged significantly from ${previousEntry.painScore}/10 to ${painScore}/10.`;
      }
      if (bleedingStatus === 'uncontrolled' || bleedingStatus === 'moderate') {
        deteriorationDetected = true;
        deteriorationReason = 'Bleeding has resumed or escalated to moderate/uncontrolled level.';
      }
      if (swellingStatus === 'worsening') {
        deteriorationDetected = true;
        deteriorationReason = 'Swelling is actively expanding beyond initial margins.';
      }
      if (sensationStatus === 'numb' || sensationStatus === 'lost') {
        deteriorationDetected = true;
        deteriorationReason = 'Neurovascular sensation compromise (numbness or loss of distal feeling).';
      }
      if (mobilityStatus === 'unable_to_move' && previousEntry.mobilityStatus !== 'unable_to_move') {
        deteriorationDetected = true;
        deteriorationReason = 'Sudden loss of mobility or inability to bear weight.';
      }
      if (temperatureFever) {
        deteriorationDetected = true;
        deteriorationReason = 'Fever or localized spreading warmth indicates possible secondary infection.';
      }
    }

    const newEntry: InjuryWatchEntry = {
      id: `entry-${Date.now()}`,
      timestamp: new Date().toISOString(),
      painScore,
      bleedingStatus,
      swellingStatus,
      mobilityStatus,
      sensationStatus,
      temperatureFever,
      notes: logNotes.trim() || 'Periodic recovery check-in recorded.',
      deteriorationDetected,
      deteriorationReason
    };

    const updatedInjury: MonitoredInjury = {
      ...currentInjury,
      entries: [...currentInjury.entries, newEntry],
      lastUpdated: new Date().toISOString(),
      status: deteriorationDetected ? 'escalated' : currentInjury.status
    };

    onUpdateInjury(updatedInjury);
    setIsLoggingModalOpen(false);
    setLogNotes('');
  };

  // Immediate "I am getting worse" acute escalation trigger
  const handleImmediateWorseningTrigger = () => {
    if (!currentInjury) return;

    const emergencyEntry: InjuryWatchEntry = {
      id: `worsening-${Date.now()}`,
      timestamp: new Date().toISOString(),
      painScore: Math.min(10, currentInjury.originalInput.painLevel + 3),
      bleedingStatus: 'moderate',
      swellingStatus: 'worsening',
      mobilityStatus: 'unable_to_move',
      sensationStatus: 'numb',
      temperatureFever: true,
      notes: 'PATIENT-REPORTED ESCALATION: Patient flagged acute worsening of symptoms.',
      deteriorationDetected: true,
      deteriorationReason: 'Emergency One-Tap Trigger: Acute symptom worsening reported by patient.'
    };

    const updatedInjury: MonitoredInjury = {
      ...currentInjury,
      entries: [...currentInjury.entries, emergencyEntry],
      status: 'escalated',
      lastUpdated: new Date().toISOString()
    };

    onUpdateInjury(updatedInjury);
    onOpenEmergency();
  };

  if (injuries.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-6 animate-fadeIn">
        <div className="w-16 h-16 rounded-3xl bg-[#ecf7f3] dark:bg-[#12352B] text-[#0d7a5f] dark:text-[#00BE88] flex items-center justify-center mx-auto shadow-xs border border-[#b8e2d4] dark:border-[#1F4A42]">
          <HeartPulse className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-[#081a14] dark:text-[#f5fbf8]">
            {getTranslation(userPrefs.language, 'navWatch')}
          </h2>
          <p className="text-[#4e665f] dark:text-[#8eada3] text-sm max-w-md mx-auto leading-relaxed">
            Injury Watch tracks recovery progress over hours and days. Log periodic check-ins to monitor pain trends, wound healing, and detect warning signs before complications emerge.
          </p>
        </div>
        <div className="pt-2">
          <Button
            size="lg"
            variant="primary"
            onClick={onStartNewAssessment}
            leftIcon={<Plus className="w-4 h-4" />}
            id="watch-start-first-assessment-btn"
          >
            {getTranslation(userPrefs.language, 'assessInjury')}
          </Button>
        </div>
        <div className="p-4 rounded-2xl bg-[#f4f7f5] dark:bg-[#0d221b]/40 border border-slate-200/80 dark:border-[#1F4A42] text-xs text-[#4e665f] dark:text-[#8eada3] max-w-md mx-auto text-left space-y-1">
          <div className="flex items-center space-x-1.5 font-semibold text-[#223730] dark:text-[#d1e4dd]">
            <Activity className="w-3.5 h-3.5 text-[#0d7a5f] dark:text-[#00BE88]" />
            <span>How Watch Protects You:</span>
          </div>
          <p>
            When you complete an assessment, you can add it to Injury Watch. Check-ins are compared against baseline symptoms to automatically flag pain spikes, spreading redness, or neurovascular changes.
          </p>
        </div>
      </div>
    );
  }

  const latestEntry = currentInjury?.entries[currentInjury.entries.length - 1];
  const initialEntry = currentInjury?.entries[0];
  const hasDeteriorated = currentInjury?.entries.some((e) => e.deteriorationDetected) || currentInjury?.status === 'escalated';

  // Calculate pain trend
  const painDelta = latestEntry && initialEntry ? latestEntry.painScore - initialEntry.painScore : 0;

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-8 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <HeartPulse className="w-6 h-6 text-[#0d7a5f] dark:text-[#00BE88]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#081a14] dark:text-[#f5fbf8] tracking-tight">
              {getTranslation(userPrefs.language, 'navWatch')}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#4e665f] dark:text-[#8eada3] mt-1">
            Dynamic recovery monitoring, longitudinal symptom comparison, and automated escalation detection
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <Button
            size="sm"
            variant="outline"
            onClick={onStartNewAssessment}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Track New Injury
          </Button>

          {/* 1-Tap Acute Worsening Trigger */}
          <Button
            size="sm"
            variant="emergency"
            onClick={handleImmediateWorseningTrigger}
            leftIcon={<AlertTriangle className="w-3.5 h-3.5" />}
            id="watch-worsening-escalate-btn"
          >
            "I Am Getting Worse"
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: List of Injuries */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#4e665f] dark:text-[#8eada3]">
            Monitored Injuries ({injuries.length})
          </h2>

          <div className="space-y-2.5">
            {injuries.map((inj) => {
              const isSelected = inj.id === currentInjury?.id;
              const hasAlert = inj.status === 'escalated' || inj.entries.some((e) => e.deteriorationDetected);

              return (
                <div
                  key={inj.id}
                  onClick={() => setActiveId(inj.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-[#12352B] border-[#0d7a5f] dark:border-[#00BE88] shadow-xs ring-1 ring-[#0d7a5f]/30'
                      : 'bg-[#f4f7f5] dark:bg-[#091a14] border-[#d1ded9] dark:border-[#1b4136] hover:border-slate-300 dark:hover:border-[#2D5A50]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#4e665f] dark:text-[#8eada3]">
                        {inj.originalInput.bodyPart || 'Unspecified'}
                      </span>
                      <h3 className="font-bold text-sm text-[#081a14] dark:text-[#f5fbf8] mt-0.5">
                        {inj.title}
                      </h3>
                    </div>

                    <Badge
                      variant={hasAlert ? 'emergency' : inj.status === 'resolved' ? 'neutral' : 'first_aid'}
                      size="sm"
                    >
                      {hasAlert ? 'Escalated' : inj.status}
                    </Badge>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-[#4e665f] dark:text-[#8eada3] border-t border-[#d1ded9] dark:border-[#1b4136] pt-2">
                    <span>{inj.entries.length} check-in{inj.entries.length !== 1 ? 's' : ''}</span>
                    <span>Started {new Date(inj.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Monitor & Timeline for Current Injury */}
        {currentInjury && (
          <div className="lg:col-span-2 space-y-6">
            
            {/* Deterioration Alert Banner (If triggered) */}
            {hasDeteriorated && (
              <div className="bg-red-600 text-white rounded-2xl p-5 shadow-sm border border-red-500 space-y-3 animate-fadeIn">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-white" />
                  <h3 className="font-extrabold text-sm uppercase tracking-wide">
                    Worsening Signs Detected — Medical Evaluation Advised
                  </h3>
                </div>
                <p className="text-xs text-red-100 leading-relaxed">
                  Longitudinal comparison identified symptom deterioration (pain surges, distal sensory changes, or expanding swelling).
                  Do not ignore worsening signs. Please arrange in-person medical evaluation immediately.
                </p>
                <div className="pt-1 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={onOpenEmergency}
                    className="bg-white text-red-700 hover:bg-red-50 font-bold"
                  >
                    Open Emergency Mode
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onOpenReport(currentInjury)}
                    className="bg-red-700 hover:bg-red-800 text-white border-red-400"
                  >
                    View Doctor Handoff Report
                  </Button>
                </div>
              </div>
            )}

            {/* Injury Summary Header Card */}
            <Card variant="default" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#d1ded9] dark:border-[#1b4136]">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#4e665f] dark:text-[#8eada3]">
                      Active Injury Profile
                    </span>
                    <Badge
                      variant={currentInjury.status === 'resolved' ? 'neutral' : currentInjury.status === 'escalated' ? 'emergency' : 'first_aid'}
                      size="sm"
                    >
                      {currentInjury.status.toUpperCase()}
                    </Badge>
                  </div>
                  <h2 className="text-xl font-bold text-[#081a14] dark:text-[#f5fbf8] mt-0.5">
                    {currentInjury.title}
                  </h2>
                  <p className="text-xs text-[#4e665f] dark:text-[#8eada3] mt-0.5">
                    Mechanism: {currentInjury.originalInput.mechanism || 'Direct trauma'} • Onset: {currentInjury.originalInput.timeframe || 'Recent'}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => setIsLoggingModalOpen(true)}
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                    id="log-symptom-checkin-btn"
                  >
                    Log Check-In
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onOpenReport(currentInjury)}
                    leftIcon={<FileText className="w-3.5 h-3.5 text-[#0d7a5f] dark:text-[#00BE88]" />}
                    title="Export Clinical Handoff Report"
                  >
                    Handoff Report
                  </Button>
                </div>
              </div>

              {/* Status Comparison Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-[#f4f7f5] dark:bg-[#091a14] p-3.5 rounded-xl border border-[#d1ded9] dark:border-[#1b4136] text-xs space-y-1">
                  <span className="text-[#4e665f] dark:text-[#8eada3] text-[10px] uppercase font-bold flex items-center justify-between">
                    <span>Pain Score</span>
                    {painDelta > 0 ? (
                      <span className="text-red-600 dark:text-red-400 font-bold flex items-center">
                        <TrendingUp className="w-3 h-3 mr-0.5" /> +{painDelta}
                      </span>
                    ) : painDelta < 0 ? (
                      <span className="text-[#0d7a5f] dark:text-[#00BE88] font-bold flex items-center">
                        <TrendingDown className="w-3 h-3 mr-0.5" /> {painDelta}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-bold flex items-center">
                        <Minus className="w-3 h-3 mr-0.5" /> 0
                      </span>
                    )}
                  </span>
                  <p className="font-extrabold text-base text-[#081a14] dark:text-[#f5fbf8]">
                    {latestEntry?.painScore ?? currentInjury.originalInput.painLevel} / 10
                  </p>
                  <span className="text-[10px] text-[#4e665f] dark:text-[#8eada3]">
                    Baseline: {initialEntry?.painScore ?? currentInjury.originalInput.painLevel}/10
                  </span>
                </div>

                <div className="bg-[#f4f7f5] dark:bg-[#091a14] p-3.5 rounded-xl border border-[#d1ded9] dark:border-[#1b4136] text-xs space-y-1">
                  <span className="text-[#4e665f] dark:text-[#8eada3] text-[10px] uppercase font-bold">Bleeding</span>
                  <p className={`font-extrabold text-sm capitalize ${
                    latestEntry?.bleedingStatus === 'uncontrolled' || latestEntry?.bleedingStatus === 'moderate'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-[#081a14] dark:text-[#f5fbf8]'
                  }`}>
                    {latestEntry?.bleedingStatus || 'None'}
                  </p>
                  <span className="text-[10px] text-[#4e665f] dark:text-[#8eada3]">Hemostasis status</span>
                </div>

                <div className="bg-[#f4f7f5] dark:bg-[#091a14] p-3.5 rounded-xl border border-[#d1ded9] dark:border-[#1b4136] text-xs space-y-1">
                  <span className="text-[#4e665f] dark:text-[#8eada3] text-[10px] uppercase font-bold">Swelling</span>
                  <p className={`font-extrabold text-sm capitalize ${
                    latestEntry?.swellingStatus === 'worsening'
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-[#081a14] dark:text-[#f5fbf8]'
                  }`}>
                    {latestEntry?.swellingStatus || 'Stable'}
                  </p>
                  <span className="text-[10px] text-[#4e665f] dark:text-[#8eada3]">Tissue margins</span>
                </div>

                <div className="bg-[#f4f7f5] dark:bg-[#091a14] p-3.5 rounded-xl border border-[#d1ded9] dark:border-[#1b4136] text-xs space-y-1">
                  <span className="text-[#4e665f] dark:text-[#8eada3] text-[10px] uppercase font-bold">Sensation</span>
                  <p className={`font-extrabold text-sm capitalize ${
                    latestEntry?.sensationStatus === 'numb' || latestEntry?.sensationStatus === 'lost'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-[#081a14] dark:text-[#f5fbf8]'
                  }`}>
                    {latestEntry?.sensationStatus || 'Normal'}
                  </p>
                  <span className="text-[10px] text-[#4e665f] dark:text-[#8eada3]">Distal nerve check</span>
                </div>
              </div>
            </Card>

            {/* Timeline of Check-in Entries */}
            <Card variant="default" className="space-y-4">
              <h3 className="text-sm font-bold text-[#081a14] dark:text-[#f5fbf8] uppercase tracking-wider flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#4e665f] dark:text-[#8eada3]" />
                <span>Recovery & Monitoring Timeline ({currentInjury.entries.length} Logged)</span>
              </h3>

              <div className="space-y-3 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-[#1F4A42]">
                {currentInjury.entries.map((entry, idx) => (
                  <div key={entry.id || idx} className="relative pl-8 space-y-1">
                    {/* Timeline bullet */}
                    <div
                      className={`absolute left-2 top-2.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-[#0E241E] ${
                        entry.deteriorationDetected ? 'bg-red-600 ring-2 ring-red-400' : 'bg-[#0d7a5f] dark:bg-[#00BE88]'
                      }`}
                    />

                    <div className="bg-[#f4f7f5] dark:bg-[#091a14] p-4 rounded-xl border border-[#d1ded9] dark:border-[#1b4136] text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#081a14] dark:text-[#f5fbf8]">
                          {idx === 0 ? 'Initial Triage Baseline' : `Check-In #${idx + 1}`}
                        </span>
                        <span className="text-[11px] text-[#4e665f] dark:text-[#8eada3]">
                          {new Date(entry.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 text-[11px]">
                        <Badge variant="neutral" size="sm">
                          Pain: {entry.painScore}/10
                        </Badge>
                        <Badge variant={entry.bleedingStatus === 'uncontrolled' || entry.bleedingStatus === 'moderate' ? 'emergency' : 'neutral'} size="sm">
                          Bleeding: {entry.bleedingStatus}
                        </Badge>
                        <Badge variant={entry.swellingStatus === 'worsening' ? 'urgent' : 'neutral'} size="sm">
                          Swelling: {entry.swellingStatus}
                        </Badge>
                        <Badge variant={entry.sensationStatus === 'numb' || entry.sensationStatus === 'lost' ? 'emergency' : 'neutral'} size="sm">
                          Sensation: {entry.sensationStatus}
                        </Badge>
                        {entry.temperatureFever && (
                          <Badge variant="emergency" size="sm">
                            Fever / Heat
                          </Badge>
                        )}
                      </div>

                      {entry.notes && (
                        <p className="text-[#223730] dark:text-[#d1e4dd] text-[11px] italic bg-white/60 dark:bg-[#12352B]/40 p-2 rounded-lg border border-[#d1ded9] dark:border-[#1b4136]/50">
                          "{entry.notes}"
                        </p>
                      )}

                      {entry.deteriorationDetected && entry.deteriorationReason && (
                        <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-[11px] font-semibold flex items-start space-x-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>Escalation Trigger: {entry.deteriorationReason}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Bottom Actions */}
            <div className="flex flex-wrap justify-between items-center gap-3 text-xs text-[#4e665f] dark:text-[#8eada3] pt-2">
              <button
                onClick={() => {
                  const newStatus = currentInjury.status === 'resolved' ? 'active' : 'resolved';
                  onUpdateInjury({ ...currentInjury, status: newStatus });
                }}
                className="hover:text-slate-900 dark:hover:text-[#F4F8F6] font-semibold underline cursor-pointer"
              >
                {currentInjury.status === 'resolved' ? 'Re-open Injury Monitoring' : 'Mark Injury as Fully Resolved'}
              </button>

              {confirmDeleteId === currentInjury.id ? (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-red-600 dark:text-red-400 font-semibold">Delete injury record?</span>
                  <button
                    onClick={() => {
                      onDeleteInjury(currentInjury.id);
                      setConfirmDeleteId(null);
                    }}
                    className="px-2.5 py-1 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 cursor-pointer"
                  >
                    Confirm Delete
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(null)}
                    className="px-2 py-1 text-slate-500 hover:text-slate-700 dark:text-[#829B93] text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDeleteId(currentInjury.id)}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 flex items-center space-x-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Record</span>
                </button>
              )}
            </div>

          </div>
        )}
      </div>

      {/* MODAL: LOG SYMPTOM CHECK-IN */}
      <Modal
        isOpen={isLoggingModalOpen}
        onClose={() => setIsLoggingModalOpen(false)}
        title="Log Recovery Check-In"
        subtitle="Record changes in pain, swelling, and nerve sensations"
        headerIcon={<HeartPulse className="w-5 h-5 text-[#0d7a5f] dark:text-[#00BE88]" />}
        footer={
          <>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsLoggingModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={handleSaveLogEntry}
            >
              Save Check-In
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          {/* Pain Score */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-[#223730] dark:text-[#d1e4dd]">
              <span>Current Pain Level:</span>
              <span className="text-[#0d7a5f] dark:text-[#00BE88] font-bold text-sm">{painScore} / 10</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={painScore}
              onChange={(e) => setPainScore(parseInt(e.target.value))}
              className="w-full h-2 bg-[#d1ded9] dark:bg-[#1b4136] rounded-lg accent-[#0d7a5f] dark:accent-[#00BE88] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>0 (None)</span>
              <span>5 (Moderate)</span>
              <span>10 (Severe)</span>
            </div>
          </div>

          {/* Swelling status */}
          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-[#223730] dark:text-[#d1e4dd]">Swelling compared to earlier:</label>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {(['improving', 'stable', 'worsening'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSwellingStatus(s)}
                  className={`py-2 rounded-xl border capitalize font-semibold cursor-pointer transition-all text-xs ${
                    swellingStatus === s
                      ? s === 'worsening'
                        ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                        : 'bg-[#0d7a5f] text-white dark:bg-[#00BE88] dark:text-[#061814] border-transparent shadow-xs'
                      : 'bg-[#f4f7f5] dark:bg-[#0d221b] border-[#d1ded9] dark:border-[#1b4136] text-[#223730] dark:text-[#d1e4dd] hover:border-slate-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Bleeding status */}
          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-[#223730] dark:text-[#d1e4dd]">Bleeding status:</label>
            <div className="grid grid-cols-4 gap-2 pt-1">
              {(['none', 'minimal', 'moderate', 'uncontrolled'] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBleedingStatus(b)}
                  className={`py-2 rounded-xl border capitalize font-semibold cursor-pointer transition-all text-[11px] ${
                    bleedingStatus === b
                      ? b === 'uncontrolled' || b === 'moderate'
                        ? 'bg-red-600 text-white border-red-600 shadow-xs'
                        : 'bg-[#0d7a5f] text-white dark:bg-[#00BE88] dark:text-[#061814] border-transparent shadow-xs'
                      : 'bg-[#f4f7f5] dark:bg-[#0d221b] border-[#d1ded9] dark:border-[#1b4136] text-[#223730] dark:text-[#d1e4dd] hover:border-slate-300'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Sensation / Numbness */}
          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-[#223730] dark:text-[#d1e4dd]">Sensation / Nerve feeling in extremities:</label>
            <div className="grid grid-cols-4 gap-2 pt-1">
              {(['normal', 'tingling', 'numb', 'lost'] as const).map((sens) => (
                <button
                  key={sens}
                  type="button"
                  onClick={() => setSensationStatus(sens)}
                  className={`py-2 rounded-xl border capitalize font-semibold cursor-pointer transition-all text-[11px] ${
                    sensationStatus === sens
                      ? sens === 'numb' || sens === 'lost'
                        ? 'bg-red-600 text-white border-red-600 shadow-xs'
                        : 'bg-[#0d7a5f] text-white dark:bg-[#00BE88] dark:text-[#061814] border-transparent shadow-xs'
                      : 'bg-[#f4f7f5] dark:bg-[#0d221b] border-[#d1ded9] dark:border-[#1b4136] text-[#223730] dark:text-[#d1e4dd] hover:border-slate-300'
                  }`}
                >
                  {sens}
                </button>
              ))}
            </div>
          </div>

          {/* Fever / heat checkbox */}
          <label className="flex items-center space-x-2.5 text-xs text-[#223730] dark:text-[#d1e4dd] cursor-pointer select-none p-3 rounded-xl bg-[#f4f7f5] dark:bg-[#0d221b] border border-[#d1ded9] dark:border-[#1b4136]">
            <input
              type="checkbox"
              checked={temperatureFever}
              onChange={(e) => setTemperatureFever(e.target.checked)}
              className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-300 cursor-pointer"
            />
            <span className="font-medium">I have developed a fever, chills, or spreading skin heat / redness</span>
          </label>

          {/* Check-in notes */}
          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-[#223730] dark:text-[#d1e4dd]">Notes / Observed changes:</label>
            <textarea
              rows={2}
              value={logNotes}
              onChange={(e) => setLogNotes(e.target.value)}
              placeholder="e.g. Applied cold compress for 15 mins, elevated on pillow, can wiggle fingers..."
              className="w-full bg-[#f4f7f5] dark:bg-[#0d221b] border border-[#d1ded9] dark:border-[#1b4136] text-[#081a14] dark:text-[#f5fbf8] rounded-xl p-3 focus:outline-hidden text-xs placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>
        </div>
      </Modal>

    </div>
  );
};

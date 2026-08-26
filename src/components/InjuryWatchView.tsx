import React, { useState } from 'react';
import {
  HeartPulse,
  AlertTriangle,
  Clock,
  Plus,
  ArrowUpRight,
  ShieldAlert,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  FileText,
  Trash2,
  ChevronRight,
  Activity,
  Calendar,
  AlertCircle,
  X
} from 'lucide-react';
import { MonitoredInjury, InjuryWatchEntry, UserPreferences } from '../types';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { SectionHeader } from './ui/SectionHeader';
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

  // New log entry form state
  const [painScore, setPainScore] = useState<number>(4);
  const [bleedingStatus, setBleedingStatus] = useState<'none' | 'minimal' | 'moderate' | 'uncontrolled'>('none');
  const [swellingStatus, setSwellingStatus] = useState<'improving' | 'stable' | 'worsening'>('stable');
  const [mobilityStatus, setMobilityStatus] = useState<'normal' | 'limited' | 'unable_to_move'>('limited');
  const [sensationStatus, setSensationStatus] = useState<'normal' | 'numb' | 'tingling' | 'lost'>('normal');
  const [temperatureFever, setTemperatureFever] = useState<boolean>(false);
  const [logNotes, setLogNotes] = useState<string>('');

  const currentInjury = injuries.find((i) => i.id === activeId) || injuries[0];

  // Dynamic Deterioration Check
  const handleSaveLogEntry = () => {
    if (!currentInjury) return;

    const previousEntry = currentInjury.entries[currentInjury.entries.length - 1];

    let deteriorationDetected = false;
    let deteriorationReason = '';

    // Deterioration Rules
    if (previousEntry) {
      if (painScore >= previousEntry.painScore + 2) {
        deteriorationDetected = true;
        deteriorationReason = `Pain surged significantly from ${previousEntry.painScore}/10 to ${painScore}/10.`;
      }
      if (bleedingStatus === 'uncontrolled' || bleedingStatus === 'moderate') {
        deteriorationDetected = true;
        deteriorationReason = 'Bleeding has resumed or escalated.';
      }
      if (swellingStatus === 'worsening') {
        deteriorationDetected = true;
        deteriorationReason = 'Swelling is actively expanding beyond initial margins.';
      }
      if (sensationStatus === 'numb' || sensationStatus === 'lost') {
        deteriorationDetected = true;
        deteriorationReason = 'Neurovascular sensation compromise (numbness/loss of feeling).';
      }
      if (mobilityStatus === 'unable_to_move' && previousEntry.mobilityStatus !== 'unable_to_move') {
        deteriorationDetected = true;
        deteriorationReason = 'Sudden inability to move joint or bear weight.';
      }
      if (temperatureFever) {
        deteriorationDetected = true;
        deteriorationReason = 'Fever or localized heat indicates possible spreading infection.';
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

  // Immediate "I am getting worse" one-tap trigger
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
      notes: 'USER ONE-TAP ESCALATION: Patient flagged acute worsening of symptoms.',
      deteriorationDetected: true,
      deteriorationReason: 'Emergency One-Tap Trigger: Acute worsening reported by patient.'
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
        <div className="w-16 h-16 rounded-3xl bg-[#ecf7f3] dark:bg-emerald-950/60 text-[#0d7a5f] dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
          <HeartPulse className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{getTranslation(userPrefs.language, 'navWatch')}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
            Injury Watch allows you to track recovery over time, log symptom changes, and automatically detect complications or worsening conditions.
          </p>
        </div>
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
    );
  }

  const latestEntry = currentInjury?.entries[currentInjury.entries.length - 1];
  const initialEntry = currentInjury?.entries[0];
  const hasDeteriorated = currentInjury?.entries.some((e) => e.deteriorationDetected);

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-8 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <HeartPulse className="w-6 h-6 text-[#0d7a5f] dark:text-emerald-400" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {getTranslation(userPrefs.language, 'navWatch')}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
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
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
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
                      ? 'bg-white dark:bg-[#15201a] border-[#0d7a5f] dark:border-emerald-500 shadow-sm ring-1 ring-[#0d7a5f]/20'
                      : 'bg-slate-50/70 dark:bg-[#121915] border-slate-200/80 dark:border-[#1e2c25] hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1.5">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        {inj.originalInput.bodyPart}
                      </span>
                      <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">
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

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-[#1e2c25] pt-2">
                    <span>{inj.entries.length} check-ins</span>
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
              <div className="bg-red-600 text-white rounded-2xl p-5 shadow-lg border border-red-500 space-y-3 animate-fadeIn">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="font-extrabold text-sm uppercase tracking-wide">
                    WORSENING DETECTED — MEDICAL EVALUATION RECOMMENDED
                  </h3>
                </div>
                <p className="text-xs text-red-100 leading-relaxed">
                  Our longitudinal comparison detected worsening symptoms (such as pain surges, sensory deficits, or expanding swelling). 
                  Do not ignore worsening signs. Please arrange urgent medical evaluation.
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-[#1e2c25]">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Active Injury Profile
                  </span>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                    {currentInjury.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Mechanism: {currentInjury.originalInput.mechanism} • Time: {currentInjury.originalInput.timeframe}
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
                    leftIcon={<FileText className="w-3.5 h-3.5 text-sky-500" />}
                    title="Export Doctor Report"
                  >
                    Handoff Report
                  </Button>
                </div>
              </div>

              {/* Status Comparison Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">Pain Score</span>
                  <p className="font-extrabold text-base text-slate-900 dark:text-white">
                    {latestEntry?.painScore || currentInjury.originalInput.painLevel} / 10
                  </p>
                  <span className="text-[10px] text-slate-500">
                    Baseline: {initialEntry?.painScore || currentInjury.originalInput.painLevel}/10
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">Bleeding</span>
                  <p className="font-extrabold text-sm text-slate-900 dark:text-white capitalize">
                    {latestEntry?.bleedingStatus || 'None'}
                  </p>
                  <span className="text-[10px] text-slate-500">Status check</span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">Swelling</span>
                  <p className="font-extrabold text-sm text-slate-900 dark:text-white capitalize">
                    {latestEntry?.swellingStatus || 'Stable'}
                  </p>
                  <span className="text-[10px] text-slate-500">Tissue margins</span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">Mobility</span>
                  <p className="font-extrabold text-sm text-slate-900 dark:text-white capitalize">
                    {(latestEntry?.mobilityStatus || 'Limited').replace('_', ' ')}
                  </p>
                  <span className="text-[10px] text-slate-500">Joint function</span>
                </div>
              </div>
            </Card>

            {/* Timeline of Check-in Entries */}
            <Card variant="default" className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <span>Recovery & Monitoring Timeline ({currentInjury.entries.length} Logged)</span>
              </h3>

              <div className="space-y-3 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                {currentInjury.entries.map((entry, idx) => (
                  <div key={entry.id || idx} className="relative pl-8 space-y-1">
                    {/* Timeline bullet */}
                    <div
                      className={`absolute left-2 top-2.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                        entry.deteriorationDetected ? 'bg-red-600 ring-2 ring-red-400' : 'bg-emerald-500'
                      }`}
                    ></div>

                    <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {idx === 0 ? 'Initial Triage Baseline' : `Check-In #${idx + 1}`}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {new Date(entry.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 text-[11px]">
                        <Badge variant="neutral" size="sm">
                          Pain: {entry.painScore}/10
                        </Badge>
                        <Badge variant="neutral" size="sm">
                          Bleeding: {entry.bleedingStatus}
                        </Badge>
                        <Badge variant="neutral" size="sm">
                          Swelling: {entry.swellingStatus}
                        </Badge>
                        <Badge variant="neutral" size="sm">
                          Sensation: {entry.sensationStatus}
                        </Badge>
                        {entry.temperatureFever && (
                          <Badge variant="emergency" size="sm">
                            Fever / Heat
                          </Badge>
                        )}
                      </div>

                      {entry.notes && (
                        <p className="text-slate-600 dark:text-slate-300 text-[11px] italic">
                          "{entry.notes}"
                        </p>
                      )}

                      {entry.deteriorationDetected && entry.deteriorationReason && (
                        <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 text-[11px] font-semibold">
                          ⚠️ Escalation Trigger: {entry.deteriorationReason}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Bottom Actions */}
            <div className="flex justify-between items-center text-xs text-slate-500">
              <button
                onClick={() => {
                  const newStatus = currentInjury.status === 'resolved' ? 'active' : 'resolved';
                  onUpdateInjury({ ...currentInjury, status: newStatus });
                }}
                className="hover:text-slate-900 dark:hover:text-white font-semibold underline cursor-pointer"
              >
                {currentInjury.status === 'resolved' ? 'Re-activate Injury Monitoring' : 'Mark Injury as Fully Resolved'}
              </button>

              <button
                onClick={() => onDeleteInjury(currentInjury.id)}
                className="text-red-500 hover:text-red-600 flex items-center space-x-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove from Watch</span>
              </button>
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
        headerIcon={<HeartPulse className="w-5 h-5 text-[#0d7a5f] dark:text-emerald-400" />}
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
              Save Log Entry
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          {/* Pain Score */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span>Current Pain Level:</span>
              <span className="text-[#0d7a5f] dark:text-emerald-400">{painScore} / 10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={painScore}
              onChange={(e) => setPainScore(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg accent-[#0d7a5f]"
            />
          </div>

          {/* Swelling status */}
          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-slate-700 dark:text-slate-300">Swelling compared to earlier:</label>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {(['improving', 'stable', 'worsening'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSwellingStatus(s)}
                  className={`py-2 rounded-xl border capitalize font-semibold cursor-pointer transition-all ${
                    swellingStatus === s
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Bleeding status */}
          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-slate-700 dark:text-slate-300">Bleeding status:</label>
            <div className="grid grid-cols-4 gap-2 pt-1">
              {(['none', 'minimal', 'moderate', 'uncontrolled'] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBleedingStatus(b)}
                  className={`py-2 rounded-xl border capitalize font-semibold cursor-pointer transition-all ${
                    bleedingStatus === b
                      ? 'bg-red-600 text-white border-red-600 shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Sensation / Numbness */}
          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-slate-700 dark:text-slate-300">Sensation / Nerve feeling in extremities:</label>
            <div className="grid grid-cols-4 gap-2 pt-1">
              {(['normal', 'tingling', 'numb', 'lost'] as const).map((sens) => (
                <button
                  key={sens}
                  type="button"
                  onClick={() => setSensationStatus(sens)}
                  className={`py-2 rounded-xl border capitalize font-semibold cursor-pointer transition-all ${
                    sensationStatus === sens
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  {sens}
                </button>
              ))}
            </div>
          </div>

          {/* Fever checkbox */}
          <label className="flex items-center space-x-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={temperatureFever}
              onChange={(e) => setTemperatureFever(e.target.checked)}
              className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-300"
            />
            <span>I have developed a fever, chills, or spreading skin heat/redness</span>
          </label>

          {/* Check-in notes */}
          <div className="space-y-1.5 text-xs">
            <label className="font-bold text-slate-700 dark:text-slate-300">Notes / Observed changes:</label>
            <textarea
              rows={2}
              value={logNotes}
              onChange={(e) => setLogNotes(e.target.value)}
              placeholder="e.g. Took ibuprofen, kept leg elevated, able to wiggle toes slightly..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3 focus:outline-hidden"
            />
          </div>
        </div>
      </Modal>

    </div>
  );
};

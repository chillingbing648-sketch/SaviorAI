import React, { useRef, useState } from 'react';
import {
  FileText,
  Printer,
  Copy,
  Check,
  X,
  Share2,
  Shield,
  Clock,
  AlertTriangle,
  HeartPulse
} from 'lucide-react';
import { TriageAnalysisResponse, MonitoredInjury, UserPreferences } from '../types';
import { getTranslation } from '../lib/translations';

interface MedicalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportData?: TriageAnalysisResponse | null;
  monitoredInjury?: MonitoredInjury | null;
  userPrefs: UserPreferences;
}

export const MedicalReportModal: React.FC<MedicalReportModalProps> = ({
  isOpen,
  onClose,
  reportData,
  monitoredInjury,
  userPrefs
}) => {
  const [copied, setCopied] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const assessment = reportData || monitoredInjury?.initialAssessment;
  const originalInput = monitoredInjury?.originalInput;

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    if (!assessment) return;
    const text = `
INJURYGUARD AI — EMERGENCY / CLINICAL HAND-OFF REPORT
=====================================================
Date/Time: ${new Date().toLocaleString()}
Triage Level: ${assessment.urgencyLevel} (${assessment.urgencyTitle})
Location / Body Part: ${originalInput?.bodyPart || 'Specified during triage'}
Mechanism: ${originalInput?.mechanism || 'Reported'}
Pain Score: ${originalInput?.painLevel || 'N/A'}/10

SITUATION:
${assessment.headlineReason}

BACKGROUND & MECHANISM:
${originalInput?.userDescription || 'Patient presented via digital triage platform.'}

ASSESSMENT FINDINGS:
${assessment.whyExplanation}
Observable Features: ${assessment.observableCharacteristics?.map((o) => `${o.characteristic}: ${o.visualNote}`).join('; ') || 'None recorded'}

FIRST-AID PROVIDED / IMMEDIATE ACTIONS:
${assessment.doThisNow.map((a, i) => `${i + 1}. ${a}`).join('\n')}

HARM PREVENTION CONTRAINDICATIONS NOTED:
${assessment.avoidDoNotMakeWorse.map((a) => `- ${a}`).join('\n')}

CLINICAL RECOVERY LOG ENTRIES: ${monitoredInjury?.entries.length || 1} checkpoints recorded.
=====================================================
*Notice: Non-diagnostic AI triage summary for clinician reference only.*
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="p-4 sm:p-5 bg-neutral-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <FileText className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-sm sm:text-base font-bold tracking-tight">{getTranslation(userPrefs.language, 'navLibrary')}</h2>
              <p className="text-[11px] text-neutral-400">Structured SBAR summary for physicians, paramedics, or triage nurses</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopySummary}
              className="flex items-center space-x-1 bg-neutral-800 hover:bg-neutral-700 text-xs px-3 py-1.5 rounded-lg border border-neutral-700 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-500 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div ref={printRef} className="p-6 sm:p-8 overflow-y-auto space-y-6 text-neutral-900 dark:text-neutral-100 font-sans text-xs sm:text-sm">
          
          {/* Header Title in document */}
          <div className="border-b-2 border-neutral-900 dark:border-neutral-700 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                INJURYGUARD AI MEDICAL SYSTEMS • CLINICAL SUMMARY
              </span>
              <h1 className="text-xl sm:text-2xl font-black mt-0.5">
                First-Response Injury & Triage Handoff Note
              </h1>
            </div>
            <div className="text-right sm:text-right font-mono text-[11px] text-neutral-500">
              <p>Generated: {new Date().toLocaleString()}</p>
              <p>Region Protocol: {userPrefs.region}</p>
            </div>
          </div>

          {/* Patient / Incident Info Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-50 dark:bg-neutral-800/60 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-500">Anatomical Site</span>
              <p className="font-bold">{originalInput?.bodyPart || 'Noted'}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-500">Mechanism</span>
              <p className="font-bold">{originalInput?.mechanism || 'Trauma'}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-500">Initial Pain Score</span>
              <p className="font-bold text-red-600 dark:text-red-400">{originalInput?.painLevel || 'N/A'} / 10</p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-neutral-500">Triage Classification</span>
              <p className="font-extrabold uppercase text-blue-600 dark:text-blue-400">
                {assessment?.urgencyLevel.replace(/_/g, ' ')}
              </p>
            </div>
          </div>

          {/* SBAR Section: Situation */}
          <div className="space-y-1.5">
            <h3 className="font-black text-xs uppercase tracking-wider text-neutral-500 border-b border-neutral-200 dark:border-neutral-800 pb-1">
              [S] SITUATION
            </h3>
            <p className="font-semibold text-neutral-800 dark:text-neutral-200">
              {assessment?.headlineReason}
            </p>
          </div>

          {/* SBAR Section: Background */}
          <div className="space-y-1.5">
            <h3 className="font-black text-xs uppercase tracking-wider text-neutral-500 border-b border-neutral-200 dark:border-neutral-800 pb-1">
              [B] BACKGROUND & MECHANISM DETAILS
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300">
              {originalInput?.userDescription || 'User initiated safety triage assessment with acute trauma description.'}
            </p>
            {originalInput?.symptoms && originalInput.symptoms.length > 0 && (
              <p className="text-[11px] text-neutral-500 mt-1">
                <strong>Reported Symptoms:</strong> {originalInput.symptoms.join(', ')}
              </p>
            )}
          </div>

          {/* SBAR Section: Assessment */}
          <div className="space-y-1.5">
            <h3 className="font-black text-xs uppercase tracking-wider text-neutral-500 border-b border-neutral-200 dark:border-neutral-800 pb-1">
              [A] ASSESSMENT & TRIAGE ANALYSIS
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {assessment?.whyExplanation}
            </p>
            {assessment?.observableCharacteristics && assessment.observableCharacteristics.length > 0 && (
              <div className="pt-2">
                <p className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400">Visual Inspection Findings:</p>
                <ul className="list-disc pl-5 text-[11px] space-y-0.5 text-neutral-600 dark:text-neutral-400">
                  {assessment.observableCharacteristics.map((obs, idx) => (
                    <li key={idx}>
                      <strong>{obs.characteristic}:</strong> {obs.visualNote} ({obs.potentialConcern})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* SBAR Section: Recommendations */}
          <div className="space-y-2">
            <h3 className="font-black text-xs uppercase tracking-wider text-neutral-500 border-b border-neutral-200 dark:border-neutral-800 pb-1">
              [R] RECOMMENDATION & FIRST-AID ACTIONS LOG
            </h3>
            <div className="space-y-1.5">
              <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">Immediate Safe Actions Administered:</p>
              <ul className="list-disc pl-5 text-xs text-neutral-700 dark:text-neutral-300 space-y-0.5">
                {assessment?.doThisNow.map((action, idx) => (
                  <li key={idx}>{action}</li>
                ))}
              </ul>
            </div>

            <div className="pt-2">
              <p className="text-[11px] font-bold text-red-600 dark:text-red-400">Enforced Safety Contraindications (Avoided Harm):</p>
              <ul className="list-disc pl-5 text-xs text-neutral-700 dark:text-neutral-300 space-y-0.5">
                {assessment?.avoidDoNotMakeWorse.map((avoid, idx) => (
                  <li key={idx}>{avoid}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recovery Timeline (If tracked) */}
          {monitoredInjury && monitoredInjury.entries.length > 0 && (
            <div className="space-y-2 pt-2">
              <h3 className="font-black text-xs uppercase tracking-wider text-neutral-500 border-b border-neutral-200 dark:border-neutral-800 pb-1">
                LONGITUDINAL SYMPTOM CHECKPOINTS ({monitoredInjury.entries.length} Entries)
              </h3>
              <div className="space-y-1.5">
                {monitoredInjury.entries.map((e, idx) => (
                  <div key={idx} className="p-2 rounded bg-neutral-50 dark:bg-neutral-800 text-[11px] flex justify-between items-center">
                    <span>{new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — Pain {e.painScore}/10, Bleeding: {e.bleedingStatus}, Swelling: {e.swellingStatus}</span>
                    {e.deteriorationDetected && <span className="font-bold text-red-600">⚠️ WORSENING FLAGGED</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Medical Legal Disclaimer */}
          <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl text-[10px] text-neutral-500 dark:text-neutral-400 space-y-1">
            <p className="font-bold uppercase">Medical Triage & Governance Notice:</p>
            <p>
              This report was compiled by InjuryGuard AI's safety orchestration pipeline to assist in patient communication and clinical hand-off. It does not constitute a diagnostic laboratory report, radiology interpretation, or physician diagnosis. All medical decisions must be made by qualified healthcare professionals.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

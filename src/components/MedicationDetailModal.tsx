import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Info,
  Clock,
  Sparkles,
  HeartPulse,
  ExternalLink,
  PhoneCall,
  Stethoscope,
  Building2,
  FileText
} from 'lucide-react';
import { MedicationItem } from '../data/medications';
import { MedicationVisual } from './ui/MedicationVisual';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

interface MedicationDetailModalProps {
  medication: MedicationItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenEmergency?: () => void;
  language?: string;
}

export const MedicationDetailModal: React.FC<MedicationDetailModalProps> = ({
  medication,
  isOpen,
  onClose,
  onOpenEmergency,
  language = 'en'
}) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !medication) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#081a14]/60 dark:bg-black/75 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Dialog Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white dark:bg-[#0d221b] rounded-3xl shadow-2xl border border-[#d1ded9] dark:border-[#1b4136] z-10 overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="med-modal-title"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 border-b border-[#d1ded9] dark:border-[#1b4136] flex items-start justify-between gap-4 bg-[#f8faf9] dark:bg-[#091a14]/60">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${medication.badgeBg}`}>
                  {medication.categoryLabel}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#ecf7f3] dark:bg-[#122e25] text-[#0d7a5f] dark:text-[#00BE88] border border-[#b8e2d4] dark:border-[#1d4d3e]">
                  {medication.prescriptionLabel}
                </span>
              </div>
              <h2 id="med-modal-title" className="text-xl sm:text-2xl font-black text-[#081a14] dark:text-[#f5fbf8] tracking-tight">
                {medication.name}
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-[#0d7a5f] dark:text-[#00BE88]">
                {medication.genericName}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#4e665f] dark:text-[#8eada3] hover:text-[#081a14] dark:hover:text-white hover:bg-[#eaf1ee] dark:hover:bg-[#143229] transition-colors cursor-pointer shrink-0"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 text-[#223730] dark:text-[#d1e4dd] text-sm">
            
            {/* Top Overview Grid with SVG Visual */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-5 items-center">
              <div className="md:col-span-2">
                <MedicationVisual form={medication.dosageForm} name={medication.name} className="h-44 w-full" />
              </div>

              <div className="md:col-span-3 space-y-3">
                <div className="p-3.5 rounded-2xl bg-[#ecf7f3] dark:bg-[#0f2a21] border border-[#b8e2d4] dark:border-[#1d4d3e]">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#0d7a5f] dark:text-[#00BE88] mb-1">
                    First-Aid Role
                  </p>
                  <p className="text-xs sm:text-sm font-medium leading-relaxed text-[#081a14] dark:text-[#f5fbf8]">
                    {medication.usedFor}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl bg-[#f4f7f5] dark:bg-[#091a14] border border-[#d1ded9] dark:border-[#1b4136]">
                    <span className="text-[10px] font-bold text-[#4e665f] dark:text-[#8eada3] block uppercase tracking-wider">
                      Dosage Form
                    </span>
                    <span className="font-bold text-[#081a14] dark:text-[#f5fbf8]">
                      {medication.dosageFormLabel}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#f4f7f5] dark:bg-[#091a14] border border-[#d1ded9] dark:border-[#1b4136]">
                    <span className="text-[10px] font-bold text-[#4e665f] dark:text-[#8eada3] block uppercase tracking-wider">
                      Standard Usage
                    </span>
                    <span className="font-bold text-[#081a14] dark:text-[#f5fbf8]">
                      {medication.standardDose}
                    </span>
                  </div>
                </div>

                {/* Common Brands */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-[#4e665f] dark:text-[#8eada3]">
                    Common Market Brands:
                  </span>
                  {medication.brandNames.map((brand) => (
                    <span
                      key={brand}
                      className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-[#eaf0ed] dark:bg-[#122e25] text-[#081a14] dark:text-[#d1e4dd] border border-[#d1ded9] dark:border-[#1e463a]"
                    >
                      {brand}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Biological Mechanism */}
            <div className="space-y-2">
              <h3 className="font-black text-sm uppercase tracking-wider text-[#081a14] dark:text-[#f5fbf8] flex items-center space-x-1.5">
                <Stethoscope className="w-4 h-4 text-[#0d7a5f] dark:text-[#00BE88]" />
                <span>How It Works (Biological Action)</span>
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed p-4 rounded-2xl bg-[#f4f7f5] dark:bg-[#091a14] border border-[#d1ded9] dark:border-[#1b4136]">
                {medication.detailedGuide.mechanism}
              </p>
            </div>

            {/* Step-by-Step Clinical Application Guide */}
            <div className="space-y-2.5">
              <h3 className="font-black text-sm uppercase tracking-wider text-[#081a14] dark:text-[#f5fbf8] flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#0d7a5f] dark:text-[#00BE88]" />
                <span>Doctor-Approved Step-by-Step Application</span>
              </h3>
              <div className="space-y-2">
                {medication.detailedGuide.clinicalApplicationSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-3 p-3 rounded-xl bg-white dark:bg-[#0f2a21] border border-[#d1ded9] dark:border-[#1e4d3e] text-xs sm:text-sm"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#0d7a5f] dark:bg-[#00BE88] text-white dark:text-[#041611] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="leading-relaxed font-medium text-[#223730] dark:text-[#d1e4dd]">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contraindications Warning Box (Crucial Harm Prevention) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 space-y-2.5">
              <div className="flex items-center space-x-2 text-red-700 dark:text-red-300 font-black text-xs sm:text-sm uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Critical Contraindications — When NOT to Use</span>
              </div>
              <ul className="space-y-1.5 text-xs sm:text-sm text-red-900 dark:text-red-200">
                {medication.detailedGuide.contraindications.map((contra, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-red-500 font-bold shrink-0">•</span>
                    <span>{contra}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pediatric & Pregnancy Considerations */}
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 space-y-1">
              <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center space-x-1.5">
                <Info className="w-3.5 h-3.5" />
                <span>Pediatric & Pregnancy Safety</span>
              </span>
              <p className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed font-medium">
                {medication.detailedGuide.pediatricPregnancyNotice}
              </p>
            </div>

            {/* Jan Aushadhi & Affordable Healthcare Note */}
            <div className="p-4 rounded-2xl bg-[#ecf7f3] dark:bg-[#0f2a21]/80 border border-[#b8e2d4] dark:border-[#1d4d3e] space-y-1">
              <span className="text-[11px] font-bold text-[#0d7a5f] dark:text-[#00BE88] uppercase tracking-wider flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>Affordable Generic Availability (PMBJP Jan Aushadhi)</span>
              </span>
              <p className="text-xs text-[#223730] dark:text-[#d1e4dd] leading-relaxed">
                {medication.detailedGuide.janAushadhiNote}
              </p>
            </div>

            {/* Escalation Triggers: When to Stop Home Care and See a Doctor */}
            <div className="space-y-2">
              <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider text-rose-700 dark:text-rose-400 flex items-center space-x-1.5">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Doctor Escalation Checklist (Seek Urgent Clinical Evaluation If:)</span>
              </h3>
              <div className="space-y-1.5 text-xs text-[#223730] dark:text-[#d1e4dd]">
                {medication.detailedGuide.doctorEscalationTriggers.map((trigger, idx) => (
                  <div key={idx} className="flex items-start space-x-2 p-2.5 rounded-xl bg-[#f4f7f5] dark:bg-[#091a14] border border-[#d1ded9] dark:border-[#1b4136]">
                    <span className="text-rose-600 dark:text-rose-400 font-bold shrink-0">⚠</span>
                    <span>{trigger}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Legal Educational Boundary */}
            <p className="text-[11px] text-[#6c837c] dark:text-[#8eada3] italic border-t border-[#d1ded9] dark:border-[#1b4136] pt-3 text-center">
              Statutory Notice: This entry is strictly educational and does not constitute a prescription. Always consult a certified medical practitioner (MBBS/MD) or pharmacist before taking medications.
            </p>

          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 border-t border-[#d1ded9] dark:border-[#1b4136] bg-[#f8faf9] dark:bg-[#091a14]/80 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs text-[#4e665f] dark:text-[#8eada3] font-medium hidden sm:inline">
              Evidence grounded in WHO Essential Medicines & Indian Pharmacopoeia
            </span>
            <div className="flex items-center space-x-2.5 ml-auto">
              {medication.prescriptionStatus === 'emergency_clinical' && onOpenEmergency && (
                <Button
                  size="sm"
                  variant="emergency"
                  onClick={() => {
                    onClose();
                    onOpenEmergency();
                  }}
                  leftIcon={<PhoneCall className="w-3.5 h-3.5" />}
                >
                  Call 112 Emergency
                </Button>
              )}
              <Button
                size="sm"
                variant="secondary"
                onClick={onClose}
              >
                Close Summary
              </Button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

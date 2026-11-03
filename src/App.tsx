/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Scale, PhoneCall, Lock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { AssessWizard } from './components/AssessWizard';
import { InjuryWatchView } from './components/InjuryWatchView';
import { FindHelpView } from './components/FindHelpView';
import { LibraryView } from './components/LibraryView';
import { MedicationsView } from './components/MedicationsView';
import { AdminSafetyBenchmarkView } from './components/AdminSafetyBenchmarkView';
import { SettingsView } from './components/SettingsView';
import { EmergencyModal } from './components/EmergencyModal';
import { MedicalReportModal } from './components/MedicalReportModal';

import {
  MonitoredInjury,
  UserPreferences,
  TriageAnalysisResponse,
  InjuryAssessmentRequest,
  SafetyBenchmarkTestCase
} from './types';
import {
  loadPreferences,
  savePreferences,
  loadMonitoredInjuries,
  saveMonitoredInjuries,
  exportAllUserData,
  clearAllUserData
} from './lib/storage';

export default function App() {
  // Navigation tab state
  const [currentTab, setCurrentTab] = useState<
    'home' | 'assess' | 'watch' | 'medications' | 'find_help' | 'library' | 'admin' | 'settings'
  >('home');

  // App domain state
  const [userPrefs, setUserPrefs] = useState<UserPreferences>(loadPreferences());
  const [monitoredInjuries, setMonitoredInjuries] = useState<MonitoredInjury[]>(loadMonitoredInjuries());
  const [selectedWatchInjuryId, setSelectedWatchInjuryId] = useState<string | null>(null);

  // Modals state
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [activeReportData, setActiveReportData] = useState<TriageAnalysisResponse | null>(null);
  const [activeReportInjury, setActiveReportInjury] = useState<MonitoredInjury | null>(null);

  // Prefill case for AssessWizard
  const [prefillCase, setPrefillCase] = useState<SafetyBenchmarkTestCase | null>(null);
  const [libraryInitialCategory, setLibraryInitialCategory] = useState<string | null>(null);

  // Online / Offline listener
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  // Theme State & Syncing (Defaults to Light Mode)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = userPrefs.theme;
    if (saved === 'dark') return true;
    if (saved === 'system') {
      return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    }
    return false; // Default to Light Mode
  });

  useEffect(() => {
    const applyTheme = () => {
      let darkActive = false;
      if (userPrefs.theme === 'dark') {
        darkActive = true;
      } else if (userPrefs.theme === 'system') {
        darkActive = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
      } else {
        // Defaults to Light Mode
        darkActive = false;
      }
      setIsDarkMode(darkActive);
      if (darkActive) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    applyTheme();

    const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)');
    const changeHandler = () => {
      if (userPrefs.theme === 'system') {
        applyTheme();
      }
    };

    mediaQuery?.addEventListener('change', changeHandler);
    return () => mediaQuery?.removeEventListener('change', changeHandler);
  }, [userPrefs.theme]);

  const handleToggleTheme = () => {
    const nextTheme = isDarkMode ? 'light' : 'dark';
    handleUpdatePrefs({ theme: nextTheme });
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = userPrefs.language || 'en';
  }, [userPrefs.language]);

  // Sync preferences with storage
  const handleUpdatePrefs = (newPrefs: Partial<UserPreferences>) => {
    const updated = { ...userPrefs, ...newPrefs };
    setUserPrefs(updated);
    savePreferences(updated);
  };

  // Sync injuries with storage
  const handleAddToWatch = (injury: MonitoredInjury) => {
    const updated = [injury, ...monitoredInjuries.filter((i) => i.id !== injury.id)];
    setMonitoredInjuries(updated);
    saveMonitoredInjuries(updated);
    setSelectedWatchInjuryId(injury.id);
  };

  const handleUpdateInjury = (updatedInjury: MonitoredInjury) => {
    const updated = monitoredInjuries.map((i) => (i.id === updatedInjury.id ? updatedInjury : i));
    setMonitoredInjuries(updated);
    saveMonitoredInjuries(updated);
  };

  const handleDeleteInjury = (injuryId: string) => {
    const updated = monitoredInjuries.filter((i) => i.id !== injuryId);
    setMonitoredInjuries(updated);
    saveMonitoredInjuries(updated);
    if (selectedWatchInjuryId === injuryId) {
      setSelectedWatchInjuryId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const handleClearAllData = () => {
    clearAllUserData();
    setMonitoredInjuries([]);
    setUserPrefs(loadPreferences());
  };

  const handleExportData = () => {
    const dataStr = exportAllUserData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mendly_health_records_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleStartAssessmentWithCase = (caseItem?: SafetyBenchmarkTestCase) => {
    setPrefillCase(caseItem || null);
    setCurrentTab('assess');
  };

  const handleOpenWatch = (injuryId?: string) => {
    if (injuryId) setSelectedWatchInjuryId(injuryId);
    setCurrentTab('watch');
  };

  const handleOpenLibrary = (category?: string) => {
    setLibraryInitialCategory(category || 'all');
    setCurrentTab('library');
  };

  const handleOpenReportFromAssessment = (response: TriageAnalysisResponse) => {
    setActiveReportData(response);
    setActiveReportInjury(null);
    setIsReportModalOpen(true);
  };

  const handleOpenReportFromWatch = (injury: MonitoredInjury) => {
    setActiveReportInjury(injury);
    setActiveReportData(injury.initialAssessment);
    setIsReportModalOpen(true);
  };

  const activeWatchCount = monitoredInjuries.filter((i) => i.status === 'active').length;

  return (
    <div className={`min-h-screen flex flex-col text-[#081a14] dark:text-[#f5fbf8] bg-[#f4f7f5] dark:bg-[#06130f] transition-colors duration-200 ${userPrefs.highContrast ? 'contrast-125' : ''}`}>
      
      {/* Offline Alert Strip */}
      {!isOnline && (
        <div className="bg-amber-600 text-white px-4 py-1.5 text-xs text-center font-bold tracking-wide flex items-center justify-center space-x-2">
          <span>Offline mode active: local deterministic assessment, cached safety protocols, and emergency dialers remain fully functional.</span>
        </div>
      )}

      {/* Main Navigation Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'assess') setPrefillCase(null);
          setCurrentTab(tab);
        }}
        onOpenEmergency={() => setIsEmergencyModalOpen(true)}
        userPrefs={userPrefs}
        onUpdatePrefs={handleUpdatePrefs}
        activeWatchCount={activeWatchCount}
        isOnline={isOnline}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Body with Framer Motion View Transitions */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {currentTab === 'home' && (
              <HomeView
                onStartAssessment={handleStartAssessmentWithCase}
                onOpenEmergency={() => setIsEmergencyModalOpen(true)}
                onOpenWatch={handleOpenWatch}
                onOpenLibrary={handleOpenLibrary}
                onOpenMedications={() => setCurrentTab('medications')}
                onOpenFindHelp={() => setCurrentTab('find_help')}
                monitoredInjuries={monitoredInjuries}
                userPrefs={userPrefs}
              />
            )}

            {currentTab === 'assess' && (
              <AssessWizard
                initialCase={prefillCase}
                onCompleteAssessment={(response) => {
                  setActiveReportData(response);
                }}
                onOpenEmergency={() => setIsEmergencyModalOpen(true)}
                onOpenReport={handleOpenReportFromAssessment}
                onOpenFindHelp={() => setCurrentTab('find_help')}
                onAddToWatch={handleAddToWatch}
                userPrefs={userPrefs}
                onCancel={() => setCurrentTab('home')}
              />
            )}

            {currentTab === 'watch' && (
              <InjuryWatchView
                injuries={monitoredInjuries}
                selectedInjuryId={selectedWatchInjuryId}
                onUpdateInjury={handleUpdateInjury}
                onDeleteInjury={handleDeleteInjury}
                onOpenEmergency={() => setIsEmergencyModalOpen(true)}
                onOpenReport={handleOpenReportFromWatch}
                onStartNewAssessment={() => {
                  setPrefillCase(null);
                  setCurrentTab('assess');
                }}
                userPrefs={userPrefs}
              />
            )}

            {currentTab === 'medications' && (
              <MedicationsView
                userPrefs={userPrefs}
                onOpenEmergency={() => setIsEmergencyModalOpen(true)}
                onStartAssessment={() => {
                  setPrefillCase(null);
                  setCurrentTab('assess');
                }}
              />
            )}

            {currentTab === 'find_help' && (
              <FindHelpView
                userPrefs={userPrefs}
                onOpenEmergency={() => setIsEmergencyModalOpen(true)}
              />
            )}

            {currentTab === 'library' && (
              <LibraryView
                initialCategory={libraryInitialCategory}
                userPrefs={userPrefs}
                onAssessCategory={(cat) => {
                  setLibraryInitialCategory(cat);
                  setPrefillCase(null);
                  setCurrentTab('assess');
                }}
              />
            )}

            {currentTab === 'admin' && (
              <AdminSafetyBenchmarkView userPrefs={userPrefs} onStartAssessmentWithCase={handleStartAssessmentWithCase} />
            )}

            {currentTab === 'settings' && (
              <SettingsView
                userPrefs={userPrefs}
                onUpdatePrefs={handleUpdatePrefs}
                onClearAllData={handleClearAllData}
                onExportData={handleExportData}
                onOpenAdmin={() => setCurrentTab('admin')}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 1-Tap Emergency Modal */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        userPrefs={userPrefs}
        onOpenReport={() => {
          if (activeReportData || (monitoredInjuries.length > 0 && monitoredInjuries[0].initialAssessment)) {
            setActiveReportData(activeReportData || monitoredInjuries[0].initialAssessment);
            setIsReportModalOpen(true);
          }
        }}
        onOpenFindHelp={() => setCurrentTab('find_help')}
      />

      {/* Doctor Handoff SBAR Medical Report Modal */}
      <MedicalReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reportData={activeReportData}
        monitoredInjury={activeReportInjury}
        userPrefs={userPrefs}
      />

      {/* Comprehensive Medical & Regulatory Legal Disclaimer Footer */}
      <footer className="border-t border-[#d1ded9] dark:border-[#1b4136] bg-white dark:bg-[#071712] py-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Top Row: Regulatory Badge & Emergency Warning Banner */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-950 dark:text-amber-100">
            <div className="flex items-start sm:items-center space-x-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
              <div>
                <p className="text-xs sm:text-sm font-black tracking-tight">
                  STATUTORY EMERGENCY DIRECTIVE
                </p>
                <p className="text-[11px] sm:text-xs text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
                  For acute life-threatening emergencies (e.g. uncontrolled arterial hemorrhage, airway compromise, chest pain, or loss of consciousness), do not postpone care for online questionnaires. Call emergency dispatch immediately.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 shrink-0 self-stretch sm:self-auto justify-end">
              <span className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-amber-600 text-white shadow-xs">
                🇮🇳 NATIONAL EMERGENCY (INDIA): 112 • AMBULANCE: 108 / 102
              </span>
            </div>
          </div>

          {/* 3-Column Formal Medical Legal Provisions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 text-xs text-[#4e665f] dark:text-[#8eada3]">
            
            {/* Column 1: Non-Diagnostic SaMD Scope */}
            <div className="space-y-2">
              <div className="flex items-center space-x-1.5 text-[#081a14] dark:text-[#f5fbf8] font-bold text-xs uppercase tracking-wider">
                <Scale className="w-4 h-4 text-[#0d7a5f] dark:text-[#00BE88] shrink-0" />
                <span>Clinical Decision Support Scope</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Mendly is an AI-assisted trauma triage decision support system designed exclusively for educational, first-aid prioritization, and harm-prevention reference. It is <strong>NOT an algorithmic medical diagnosis tool</strong>, does not provide medical prognoses or prescribe treatments, and does not establish a doctor-patient relationship.
              </p>
            </div>

            {/* Column 2: Protocol Standards & Harm Prevention */}
            <div className="space-y-2">
              <div className="flex items-center space-x-1.5 text-[#081a14] dark:text-[#f5fbf8] font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-[#0d7a5f] dark:text-[#00BE88] shrink-0" />
                <span>Protocol Grounding & Safety Gates</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Triage rules enforce deterministic red-flag safety gates derived from clinical protocols (AIIMS Trauma Centre, ICMR Emergency Guidelines, ATLS 10th Ed., and WHO standards). Directives enforce Supreme Court of India Good Samaritan legal protections. Harm-prevention contraindications strictly prohibit dangerous interventions prior to physical physician review.
              </p>
            </div>

            {/* Column 3: Local Privacy & Good Samaritan Shield */}
            <div className="space-y-2">
              <div className="flex items-center space-x-1.5 text-[#081a14] dark:text-[#f5fbf8] font-bold text-xs uppercase tracking-wider">
                <Lock className="w-4 h-4 text-[#0d7a5f] dark:text-[#00BE88] shrink-0" />
                <span>Data Privacy & Device Security</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Zero Protected Health Information (PHI) is shared or sold. Self-reported trauma intakes and longitudinal Injury Watch recovery logs are stored locally within your device’s private browser sandbox. You retain permanent ownership to export or purge your data at any time.
              </p>
            </div>

          </div>

          {/* Bottom Copyright and Protocol Compliance Strip */}
          <div className="pt-4 border-t border-[#d1ded9] dark:border-[#1b4136] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#4e665f] dark:text-[#8eada3]">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-[#0d7a5f] dark:text-[#00BE88] shrink-0" />
              <span>
                <strong>Mendly Health-Tech Systems</strong> — Clinical Safety-First Architecture & Protocol Gate
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span>Standard: AIIMS / ICMR / ATLS Guidelines (India Edition)</span>
              <span>•</span>
              <span>Local Storage Sandbox</span>
              <span>•</span>
              <span>Build 2026.11</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}

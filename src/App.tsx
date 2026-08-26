/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { AssessWizard } from './components/AssessWizard';
import { InjuryWatchView } from './components/InjuryWatchView';
import { FindHelpView } from './components/FindHelpView';
import { LibraryView } from './components/LibraryView';
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
    'home' | 'assess' | 'watch' | 'find_help' | 'library' | 'admin' | 'settings'
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

  // Sync preferences with storage and dark/contrast classes
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
    a.download = `injuryguard_health_records_${new Date().toISOString().slice(0, 10)}.json`;
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
    <div className={`min-h-screen flex flex-col text-neutral-900 dark:text-neutral-100 transition-colors ${userPrefs.highContrast ? 'contrast-125' : ''}`}>
      
      {/* Offline Alert Strip */}
      {!isOnline && (
        <div className="bg-amber-600 text-white px-4 py-1.5 text-xs text-center font-bold tracking-wide flex items-center justify-center space-x-2">
          <span>Offline mode: saved guidance and emergency dialers remain available.</span>
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
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'home' && (
          <HomeView
            onStartAssessment={handleStartAssessmentWithCase}
            onOpenEmergency={() => setIsEmergencyModalOpen(true)}
            onOpenWatch={handleOpenWatch}
            onOpenLibrary={handleOpenLibrary}
            onOpenFindHelp={() => setCurrentTab('find_help')}
            monitoredInjuries={monitoredInjuries}
            userPrefs={userPrefs}
          />
        )}

        {currentTab === 'assess' && (
          <AssessWizard
            initialCase={prefillCase}
            onCompleteAssessment={(response, request) => {
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

      {/* Footer Disclaimer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-xs py-6 text-center text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
        <p className="font-semibold text-neutral-700 dark:text-neutral-300">
          InjuryGuard provides emergency safety and triage guidance. It is not a medical diagnosis tool.
        </p>
        <p>
          Always seek the advice of a physician or call emergency services for acute trauma, severe bleeding, or unconsciousness.
        </p>
      </footer>

    </div>
  );
}

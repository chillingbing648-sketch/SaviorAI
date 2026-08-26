import React from 'react';
import {
  Shield,
  ShieldAlert,
  Activity,
  MapPin,
  BookOpen,
  Settings,
  Globe,
  ChevronDown
} from 'lucide-react';
import { UserPreferences } from '../types';
import { SUPPORTED_LANGUAGES, getTranslation } from '../lib/translations';

interface HeaderProps {
  currentTab: 'home' | 'assess' | 'watch' | 'find_help' | 'library' | 'admin' | 'settings';
  onSelectTab: (tab: 'home' | 'assess' | 'watch' | 'find_help' | 'library' | 'admin' | 'settings') => void;
  onOpenEmergency: () => void;
  userPrefs: UserPreferences;
  onUpdatePrefs: (prefs: Partial<UserPreferences>) => void;
  activeWatchCount: number;
  isOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenEmergency,
  userPrefs,
  onUpdatePrefs,
  activeWatchCount,
  isOnline
}) => {
  const navItems: Array<{
    id: 'home' | 'assess' | 'watch' | 'find_help' | 'library' | 'admin';
    labelKey: string;
    icon?: React.ReactNode;
    badge?: number;
  }> = [
    { id: 'home', labelKey: 'navHome' },
    {
      id: 'assess',
      labelKey: 'navAssess',
      icon: <Activity className="w-3.5 h-3.5" />
    },
    {
      id: 'watch',
      labelKey: 'navWatch',
      badge: activeWatchCount
    },
    {
      id: 'library',
      labelKey: 'navLibrary',
      icon: <BookOpen className="w-3.5 h-3.5" />
    },
    // Admin remains reachable through the governance surface, but is not a consumer navigation destination.
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#f8faf9]/90 dark:bg-[#0b100d]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-[#1e2c25] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Brand Identity */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => onSelectTab('home')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onSelectTab('home');
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-[#0d7a5f] dark:bg-emerald-600 flex items-center justify-center shadow-xs text-white group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                  Mendly
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-[#ecf7f3] dark:bg-emerald-950/60 text-[#0d7a5f] dark:text-emerald-300 border border-[#b8e2d4] dark:border-emerald-900/60 uppercase">
                  TRIAGE & SAFETY
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5 font-medium">
                {getTranslation(userPrefs.language, 'safetyFirst')}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 text-xs font-semibold" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3 py-2 rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer relative ${
                    isActive
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60'
                  }`}
                  id={`nav-${item.id}-btn`}
                >
                  {item.icon}
                  <span>{getTranslation(userPrefs.language, item.labelKey)}</span>
                  {Boolean(item.badge && item.badge > 0) && (
                    <span
                      className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-amber-400 text-slate-950'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools: Language, Settings, Emergency Trigger */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Language Switcher */}
            <div className="relative hidden sm:block">
              <select
                value={userPrefs.language}
                onChange={(e) => onUpdatePrefs({ language: e.target.value })}
                className="appearance-none bg-slate-100/80 hover:bg-slate-200/70 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 text-xs font-medium pl-7 pr-6 py-2 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer focus:outline-hidden transition-colors"
                id="header-language-select"
                title="Select language"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.nativeName}
                  </option>
                ))}
              </select>
              <Globe className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5 pointer-events-none" />
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-3 pointer-events-none" />
            </div>

            {/* Settings Quick Icon */}
            <button
              onClick={() => onSelectTab('settings')}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                currentTab === 'settings'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
              title="Settings & Privacy"
              id="header-settings-btn"
              aria-label="Settings and Privacy"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* 1-TAP EMERGENCY TRIGGER BUTTON */}
            <button
              onClick={onOpenEmergency}
              className="flex items-center space-x-1.5 sm:space-x-2 bg-[#dc2626] hover:bg-[#b91c1c] active:bg-[#991b1b] text-white font-bold text-xs sm:text-sm px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
              id="header-emergency-btn"
              aria-label="Emergency Help"
            >
              <ShieldAlert className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">{getTranslation(userPrefs.language, 'emergencyButton')}</span>
            </button>

          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden flex w-full min-w-0 items-center justify-start overflow-x-auto py-2.5 border-t border-slate-200/80 dark:border-[#1e2c25] text-xs font-semibold space-x-1.5 scrollbar-none">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center space-x-1 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{getTranslation(userPrefs.language, item.labelKey)}</span>
                {Boolean(item.badge && item.badge > 0) && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};

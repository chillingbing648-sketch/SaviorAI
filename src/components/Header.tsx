import React from 'react';
import {
  Shield,
  ShieldAlert,
  Activity,
  MapPin,
  BookOpen,
  Settings,
  Globe,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onOpenEmergency,
  userPrefs,
  onUpdatePrefs,
  activeWatchCount,
  isOnline,
  isDarkMode,
  onToggleTheme
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
      id: 'find_help',
      labelKey: 'navFindHelp',
      icon: <MapPin className="w-3.5 h-3.5" />
    },
    {
      id: 'library',
      labelKey: 'navLibrary',
      icon: <BookOpen className="w-3.5 h-3.5" />
    }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#0d221b]/95 backdrop-blur-md border-b border-[#d1ded9] dark:border-[#1b4136] transition-colors duration-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Brand Identity */}
          <div
            className="flex items-center space-x-3 cursor-pointer group select-none"
            onClick={() => onSelectTab('home')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onSelectTab('home');
            }}
          >
            <motion.div
              whileHover={{ rotate: [0, -6, 6, 0], scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="w-10 h-10 rounded-xl bg-[#0d7a5f] dark:bg-[#00BE88] flex items-center justify-center shadow-xs text-white dark:text-[#041611]"
            >
              <Shield className="w-5 h-5" strokeWidth={2.5} />
            </motion.div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-[#081a14] dark:text-[#f5fbf8]">
                  Mendly
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-[#ecf7f3] dark:bg-[#122e25] text-[#0d7a5f] dark:text-[#00BE88] border border-[#b8e2d4] dark:border-[#1d4d3e] uppercase">
                  CLINICAL SAFETY
                </span>
              </div>
              <p className="hidden sm:block text-[11px] text-[#4e665f] dark:text-[#8eada3] -mt-0.5 font-medium">
                {getTranslation(userPrefs.language, 'safetyFirst')}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links with Framer Sliding Layout Pill */}
          <nav className="hidden lg:flex items-center space-x-1 text-xs font-semibold" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`px-3.5 py-2 rounded-xl transition-colors relative flex items-center space-x-1.5 cursor-pointer z-10 ${
                    isActive
                      ? 'text-white dark:text-[#041611] font-bold'
                      : 'text-[#223730] dark:text-[#d1e4dd] hover:text-[#081a14] dark:hover:text-[#f5fbf8] hover:bg-[#eaf1ee] dark:hover:bg-[#143229]'
                  }`}
                  id={`nav-${item.id}-btn`}
                >
                  {/* Sliding active background indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-[#0d7a5f] dark:bg-[#00BE88] rounded-xl shadow-xs -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}

                  {item.icon && <span className="shrink-0">{item.icon}</span>}
                  <span>{getTranslation(userPrefs.language, item.labelKey)}</span>
                  {Boolean(item.badge && item.badge > 0) && (
                    <span
                      className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-amber-300 text-slate-950 font-black'
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

          {/* Right Action Tools: Theme Toggle, Language, Settings, Emergency Trigger */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            
            {/* THEME TOGGLE BUTTON */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.05 }}
              onClick={onToggleTheme}
              className="p-2 sm:p-2.5 rounded-xl border border-[#d1ded9] dark:border-[#1b4136] bg-[#f4f7f5] hover:bg-[#eaf0ed] dark:bg-[#0d221b] dark:hover:bg-[#143229] text-[#081a14] dark:text-[#f5fbf8] cursor-pointer shadow-2xs transition-colors"
              title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              id="header-theme-toggle-btn"
              aria-label={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isDarkMode ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, scale: 0.7, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: 90, scale: 0.7, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-4 h-4 text-amber-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, scale: 0.7, opacity: 0 }}
                    animate={{ rotate: 0, scale: 1, opacity: 1 }}
                    exit={{ rotate: -90, scale: 0.7, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-4 h-4 text-[#0d7a5f]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Language Switcher */}
            <div className="relative hidden sm:block">
              <select
                value={userPrefs.language}
                onChange={(e) => onUpdatePrefs({ language: e.target.value })}
                className="appearance-none bg-[#f4f7f5] hover:bg-[#eaf0ed] dark:bg-[#0d221b] dark:hover:bg-[#143229] text-[#081a14] dark:text-[#f5fbf8] text-xs font-semibold pl-7 pr-6 py-2 rounded-xl border border-[#d1ded9] dark:border-[#1b4136] cursor-pointer focus:outline-hidden transition-colors shadow-2xs"
                id="header-language-select"
                title="Select language"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-white dark:bg-[#0d221b] text-slate-900 dark:text-white">
                    {l.nativeName}
                  </option>
                ))}
              </select>
              <Globe className="w-3.5 h-3.5 text-[#4e665f] dark:text-[#8eada3] absolute left-2.5 top-2.5 pointer-events-none" />
              <ChevronDown className="w-3 h-3 text-[#4e665f] dark:text-[#8eada3] absolute right-2 top-3 pointer-events-none" />
            </div>

            {/* Settings Quick Icon */}
            <motion.button
              whileTap={{ scale: 0.94 }}
              onClick={() => onSelectTab('settings')}
              className={`p-2 sm:p-2.5 rounded-xl border transition-colors cursor-pointer shadow-2xs ${
                currentTab === 'settings'
                  ? 'bg-[#081a14] text-white dark:bg-[#f5fbf8] dark:text-[#06130f] border-transparent font-bold'
                  : 'text-[#4e665f] hover:text-[#081a14] dark:text-[#8eada3] dark:hover:text-[#f5fbf8] bg-[#f4f7f5] dark:bg-[#0d221b] border-[#d1ded9] dark:border-[#1b4136] hover:border-[#b8cac4]'
              }`}
              title="Settings & Privacy"
              id="header-settings-btn"
              aria-label="Settings and Privacy"
            >
              <Settings className="w-4 h-4" />
            </motion.button>

            {/* 1-TAP EMERGENCY TRIGGER BUTTON */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpenEmergency}
              className="flex items-center space-x-1.5 sm:space-x-2 bg-[#DC2626] hover:bg-[#B91C1C] active:bg-[#991B1B] text-white font-black text-xs sm:text-sm px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
              id="header-emergency-btn"
              aria-label="Emergency Help"
            >
              <ShieldAlert className="w-4 h-4 text-white animate-pulse-subtle shrink-0" />
              <span className="hidden sm:inline tracking-wide">{getTranslation(userPrefs.language, 'emergencyButton')}</span>
            </motion.button>

          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="lg:hidden flex w-full min-w-0 items-center justify-start overflow-x-auto py-2.5 border-t border-[#d1ded9] dark:border-[#1b4136] text-xs font-semibold space-x-1.5 scrollbar-none">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors flex items-center space-x-1 cursor-pointer ${
                  isActive
                    ? 'bg-[#0d7a5f] text-white dark:bg-[#00BE88] dark:text-[#041611] font-bold shadow-xs'
                    : 'text-[#4e665f] dark:text-[#8eada3] hover:text-[#081a14] dark:hover:text-[#f5fbf8]'
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

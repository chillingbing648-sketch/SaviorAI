import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Bandage,
  Bone,
  Brain,
  Bug,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { MedicalProtocol, UserPreferences } from '../types';
import { MEDICAL_PROTOCOLS } from '../data/protocols';
import { Card } from './ui/Card';
import { SectionHeader } from './ui/SectionHeader';
import { getTranslation } from '../lib/translations';

interface LibraryViewProps {
  initialCategory?: string | null;
  userPrefs: UserPreferences;
  onAssessCategory: (category: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ initialCategory, userPrefs, onAssessCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Protocols', icon: BookOpen },
    { id: 'wounds', label: 'Cuts & Bleeding', icon: Bandage },
    { id: 'burns', label: 'Burns & Scalds', icon: Flame },
    { id: 'orthopedic', label: 'Sprains & Fractures', icon: Bone },
    { id: 'head_neck', label: 'Head & Concussion', icon: Brain },
    { id: 'bites_stings', label: 'Bites & Stings', icon: Bug }
  ];

  const filteredProtocols = MEDICAL_PROTOCOLS.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-[#ecf7f3] dark:bg-emerald-950/30 text-slate-900 dark:text-white rounded-2xl p-6 sm:p-8 border border-[#b8e2d4] dark:border-emerald-900/60 space-y-3">
        <div className="inline-flex items-center space-x-2 text-[#0d7a5f] dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Evidence-Based Medical Reference</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {getTranslation(userPrefs.language, 'navLibrary')}
        </h1>
        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Curated clinical reference guidelines sourced from the American Red Cross, World Health Organization (WHO), Mayo Clinic, and the UK National Health Service (NHS).
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card padding="sm" className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Category buttons */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {categories.map((c) => {
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`flex items-center space-x-1.5 text-xs px-3 py-2 rounded-xl border transition-all font-semibold ${
                  selectedCategory === c.id
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-transparent shadow-xs'
                    : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search symptoms, protocols, rules..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white rounded-xl pl-8 pr-3 py-2 text-xs focus:outline-hidden"
          />
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5 pointer-events-none" />
        </div>
      </Card>

      {/* Protocols List */}
      <div className="space-y-4">
        {filteredProtocols.map((protocol) => {
          const isExpanded = expandedId === protocol.id;

          return (
            <div
              key={protocol.id}
              className="bg-white dark:bg-neutral-850 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden transition-all"
            >
              {/* Header card */}
              <div
                onClick={() => toggleExpand(protocol.id)}
                className="p-5 sm:p-6 cursor-pointer hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 flex items-start justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {protocol.source} (v{protocol.version})
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                      Reviewed: {protocol.lastReviewed}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                      {protocol.evidenceLevel}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                    {protocol.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                    {protocol.summary}
                  </p>
                </div>

                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500 transition-colors"
                >
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {/* Collapsible Details Area */}
              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-5 animate-fadeIn">
                  
                  {/* Step-by-Step Instructions */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Recommended Clinical First-Aid Steps:</span>
                    </h4>
                    <div className="space-y-2">
                      {protocol.keyActions.map((step, idx) => (
                        <div
                          key={idx}
                          className="flex items-start space-x-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs"
                        >
                          <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                          <span className="font-medium text-neutral-800 dark:text-neutral-200 leading-relaxed">
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contraindications / Strict Avoid Box */}
                  <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 space-y-2 text-xs">
                    <h4 className="font-extrabold text-red-900 dark:text-red-300 uppercase tracking-wider flex items-center space-x-1.5">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span>Contraindications & Actions to Strictly Avoid:</span>
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-red-800 dark:text-red-300 font-medium">
                      {protocol.contraindications.map((avoid, idx) => (
                        <li key={idx}>{avoid}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Red Flags & Escalation Criteria */}
                  <div className="space-y-2 text-xs">
                    <h4 className="font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Escalate Immediately to Medical Care If:</span>
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {protocol.escalationThresholds.map((rf, idx) => (
                        <li
                          key={idx}
                          className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-medium flex items-center space-x-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          <span>{rf}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};

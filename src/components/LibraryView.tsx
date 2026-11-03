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
  ChevronUp,
  Activity,
  ArrowRight
} from 'lucide-react';
import { MedicalProtocol, UserPreferences } from '../types';
import { MEDICAL_PROTOCOLS } from '../data/protocols';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { getTranslation } from '../lib/translations';

interface LibraryViewProps {
  initialCategory?: string | null;
  userPrefs: UserPreferences;
  onAssessCategory: (category: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  initialCategory,
  userPrefs,
  onAssessCategory
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Protocols', icon: BookOpen },
    { id: 'wounds', label: 'Cuts & Bleeding', icon: Bandage },
    { id: 'burns', label: 'Burns & Scalds', icon: Flame },
    { id: 'orthopedic', label: 'Sprains & Fractures', icon: Bone },
    { id: 'head_neck', label: 'Head & Concussion', icon: Brain },
    { id: 'wounds_bites', label: 'Bites & Stings', icon: Bug }
  ];

  const filteredProtocols = MEDICAL_PROTOCOLS.filter((p) => {
    const matchesCat =
      selectedCategory === 'all' ||
      p.category === selectedCategory ||
      (selectedCategory === 'wounds_bites' && (p.category === 'wounds' || p.id.includes('bite')));
    const matchesSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.keyActions.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      p.contraindications.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-[#ecf7f3] dark:bg-[#12352B] text-[#081a14] dark:text-[#f5fbf8] rounded-3xl p-6 sm:p-8 border border-[#b8e2d4] dark:border-[#1F4A42] space-y-3 shadow-xs">
        <div className="inline-flex items-center space-x-2 text-[#0d7a5f] dark:text-[#00BE88] text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Evidence-Based Clinical First-Aid Protocols</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {getTranslation(userPrefs.language, 'navLibrary')}
        </h1>
        <p className="text-[#223730] dark:text-[#d1e4dd] text-xs sm:text-sm max-w-2xl leading-relaxed">
          Peer-reviewed medical reference protocols sourced from the American Red Cross, World Health Organization (WHO),
          Mayo Clinic, the UK National Health Service (NHS), and International Red Cross (IFRC).
        </p>
      </div>

      {/* Filter and Search Bar */}
      <Card padding="sm" className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        {/* Category buttons */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {categories.map((c) => {
            const Icon = c.icon;
            const isSelected = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`flex items-center space-x-1.5 text-xs px-3 py-2 rounded-xl border transition-all font-semibold cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white dark:bg-[#00BE88] dark:text-[#0D2921] border-transparent shadow-xs font-bold'
                    : 'bg-slate-50 dark:bg-[#0D2921] text-[#223730] dark:text-[#d1e4dd] border-[#d1ded9] dark:border-[#1b4136] hover:border-slate-300 dark:hover:border-[#1F4A42]'
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
            className="w-full bg-slate-50 dark:bg-[#0D2921] border border-[#d1ded9] dark:border-[#1b4136] text-[#081a14] dark:text-[#f5fbf8] rounded-xl pl-8 pr-3 py-2 text-xs focus:outline-hidden"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 dark:text-[#829B93] absolute left-2.5 top-2.5 pointer-events-none" />
        </div>
      </Card>

      {/* Protocols List */}
      <div className="space-y-4">
        {filteredProtocols.map((protocol) => {
          const isExpanded = expandedId === protocol.id;

          return (
            <div
              key={protocol.id}
              className="bg-white dark:bg-[#0D2921] rounded-2xl border border-[#d1ded9] dark:border-[#1b4136] shadow-xs overflow-hidden transition-all"
            >
              {/* Header card */}
              <div
                onClick={() => toggleExpand(protocol.id)}
                className="p-5 sm:p-6 cursor-pointer hover:bg-slate-50/70 dark:hover:bg-[#12352B]/40 flex items-start justify-between gap-4 select-none"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300">
                      {protocol.source} (v{protocol.version})
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#eaf0ed] dark:bg-[#0d221b] text-[#223730] dark:text-[#d1e4dd]">
                      Reviewed: {protocol.lastReviewed}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[#eaf0ed] dark:bg-[#0d221b] text-[#223730] dark:text-[#d1e4dd]">
                      {protocol.evidenceLevel}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#081a14] dark:text-[#f5fbf8]">
                    {protocol.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#223730] dark:text-[#d1e4dd] leading-relaxed">
                    {protocol.summary}
                  </p>
                </div>

                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#12352B] text-slate-500 transition-colors shrink-0"
                >
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {/* Collapsible Details Area */}
              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-[#d1ded9] dark:border-[#1b4136] space-y-5 animate-fadeIn">
                  
                  {/* Step-by-Step Instructions */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#0d7a5f] dark:text-[#00BE88] flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Recommended Clinical First-Aid Steps:</span>
                    </h4>
                    <div className="space-y-2">
                      {protocol.keyActions.map((step, idx) => (
                        <div
                          key={idx}
                          className="flex items-start space-x-3 p-3 rounded-xl bg-[#f4f7f5] dark:bg-[#0d221b]/40 border border-slate-200/80 dark:border-[#1F4A42]/60 text-xs"
                        >
                          <span className="shrink-0 w-5 h-5 rounded-full bg-[#0d7a5f] dark:bg-[#00BE88] text-white dark:text-[#0D2921] font-bold flex items-center justify-center text-[10px] mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="font-semibold text-[#081a14] dark:text-[#f5fbf8] leading-relaxed">
                            {step}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contraindications / Strict Avoid Box */}
                  <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 space-y-2 text-xs">
                    <h4 className="font-bold text-red-900 dark:text-red-300 uppercase tracking-wider flex items-center space-x-1.5">
                      <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <span>Harm Prevention Directives (What NOT To Do):</span>
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-red-900 dark:text-red-200 font-medium">
                      {protocol.contraindications.map((avoid, idx) => (
                        <li key={idx} className="leading-relaxed">{avoid}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Red Flags & Escalation Criteria */}
                  <div className="space-y-2 text-xs">
                    <h4 className="font-bold text-amber-700 dark:text-[#F5B942] uppercase tracking-wider flex items-center space-x-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Escalate Immediately to Urgent / Emergency Care If:</span>
                    </h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {protocol.escalationThresholds.map((rf, idx) => (
                        <li
                          key={idx}
                          className="p-2.5 rounded-xl bg-[#f4f7f5] dark:bg-[#0d221b]/40 border border-[#d1ded9] dark:border-[#1b4136] text-[#223730] dark:text-[#d1e4dd] font-medium flex items-center space-x-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                          <span>{rf}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Protocol Action Footer */}
                  <div className="pt-3 border-t border-[#d1ded9] dark:border-[#1b4136] flex items-center justify-between">
                    <span className="text-[11px] text-[#4e665f] dark:text-[#8eada3]">
                      Jurisdiction: {protocol.region} • Evidence: {protocol.evidenceLevel}
                    </span>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => onAssessCategory(protocol.category)}
                      leftIcon={<Activity className="w-3.5 h-3.5" />}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Start Assessment for this Injury
                    </Button>
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
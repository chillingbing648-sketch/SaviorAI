import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Pill,
  Flame,
  Scissors,
  Activity,
  ShieldAlert,
  Droplets,
  Eye,
  AlertOctagon,
  ArrowRight,
  Info,
  ShieldCheck,
  CheckCircle2,
  Building2,
  HeartPulse,
  Filter,
  X,
  Stethoscope
} from 'lucide-react';
import {
  MEDICATIONS_DATABASE,
  MEDICATION_SECTIONS,
  MedicationItem,
  MedicationCategory,
  MedicationCategorySection
} from '../data/medications';
import { MedicationVisual } from './ui/MedicationVisual';
import { MedicationDetailModal } from './MedicationDetailModal';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { UserPreferences } from '../types';

interface MedicationsViewProps {
  userPrefs: UserPreferences;
  onOpenEmergency: () => void;
  onStartAssessment: () => void;
}

export const MedicationsView: React.FC<MedicationsViewProps> = ({
  userPrefs,
  onOpenEmergency,
  onStartAssessment
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MedicationCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'otc' | 'rx'>('all');
  const [activeModalMed, setActiveModalMed] = useState<MedicationItem | null>(null);

  // Filter logic
  const filteredMeds = useMemo(() => {
    return MEDICATIONS_DATABASE.filter((med) => {
      // Category match
      if (selectedCategory !== 'all' && med.category !== selectedCategory) {
        return false;
      }

      // OTC vs Rx match
      if (statusFilter === 'otc' && med.prescriptionStatus !== 'otc') {
        return false;
      }
      if (statusFilter === 'rx' && med.prescriptionStatus === 'otc') {
        return false;
      }

      // Search query match (Matches name, generic, brands like Dolo, Burnol, Betadine, Boroline, Volini, etc.)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = med.name.toLowerCase().includes(q);
        const matchGeneric = med.genericName.toLowerCase().includes(q);
        const matchCategory = med.categoryLabel.toLowerCase().includes(q) || med.categoryHindi.includes(q);
        const matchUsedFor = med.usedFor.toLowerCase().includes(q);
        const matchBrands = med.brandNames.some((b) => b.toLowerCase().includes(q));
        return matchName || matchGeneric || matchCategory || matchUsedFor || matchBrands;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, statusFilter]);

  // Group filtered meds by section for organized display
  const groupedSections = useMemo(() => {
    return MEDICATION_SECTIONS.map((sec) => {
      const items = filteredMeds.filter((m) => m.category === sec.id);
      return {
        ...sec,
        items
      };
    }).filter((sec) => sec.items.length > 0);
  }, [filteredMeds]);

  const getCategoryIcon = (iconName: string, className = 'w-4 h-4') => {
    switch (iconName) {
      case 'Flame':
        return <Flame className={className} />;
      case 'Scissors':
        return <Scissors className={className} />;
      case 'Activity':
        return <Activity className={className} />;
      case 'ShieldAlert':
        return <ShieldAlert className={className} />;
      case 'Droplets':
        return <Droplets className={className} />;
      case 'Eye':
        return <Eye className={className} />;
      case 'AlertOctagon':
        return <AlertOctagon className={className} />;
      case 'HeartPulse':
        return <HeartPulse className={className} />;
      case 'Pill':
      default:
        return <Pill className={className} />;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      
      {/* Top Clinical Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ecf7f3] via-white to-[#f4f7f5] dark:from-[#0d221b] dark:via-[#091a14] dark:to-[#06130f] border border-[#b8e2d4] dark:border-[#1d4d3e] p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 text-[#0d7a5f] dark:text-[#00BE88] text-xs font-bold uppercase tracking-wider bg-white/80 dark:bg-[#081a14]/80 px-3 py-1 rounded-full border border-[#b8e2d4] dark:border-[#1d4d3e] shadow-2xs">
            <Pill className="w-3.5 h-3.5" />
            <span>India First-Aid & Emergency Pharmacy Formulary</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#081a14] dark:text-[#f5fbf8] leading-tight">
            Targeted Medications by Injury & Illness
          </h1>

          <p className="text-[#223730] dark:text-[#d1e4dd] text-xs sm:text-sm leading-relaxed">
            Concise, doctor-approved guidance on exact antiseptics, burn salves, pain gels, and emergency vaccines available across India and Jan Aushadhi (PMBJP) pharmacies.
          </p>

          <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px]">
            <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>Over-The-Counter (OTC) Home Stock</span>
            </span>
            <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800">
              <Building2 className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              <span>Jan Aushadhi (PMBJP) Generic Prices (₹4–₹25)</span>
            </span>
            <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-800">
              <AlertOctagon className="w-3 h-3 text-rose-600 dark:text-rose-400" />
              <span>Rabies & Venom Emergency Protocols</span>
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar & Filter Navigation */}
      <div className="space-y-3.5">
        
        {/* Search Input & OTC/Rx Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#4e665f] dark:text-[#8eada3] absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by medicine, brand (e.g. Burnol, Betadine, Dolo 650, Volini, Boroline, Electral) or injury..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white dark:bg-[#0d221b] border border-[#d1ded9] dark:border-[#1b4136] text-[#081a14] dark:text-[#f5fbf8] placeholder-[#6c837c] dark:placeholder-[#67877e] text-xs sm:text-sm font-medium focus:outline-hidden focus:border-[#0d7a5f] dark:focus:border-[#00BE88] transition-colors shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-[#4e665f] dark:text-[#8eada3] hover:text-[#081a14] dark:hover:text-white"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Rx vs OTC pill toggle */}
          <div className="flex items-center bg-[#eaf0ed] dark:bg-[#0d221b] p-1 rounded-2xl border border-[#d1ded9] dark:border-[#1b4136] shrink-0 text-xs font-bold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-[#15342a] text-[#081a14] dark:text-[#f5fbf8] shadow-xs'
                  : 'text-[#4e665f] dark:text-[#8eada3] hover:text-[#081a14]'
              }`}
            >
              All Medicines
            </button>
            <button
              onClick={() => setStatusFilter('otc')}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                statusFilter === 'otc'
                  ? 'bg-white dark:bg-[#15342a] text-[#081a14] dark:text-[#f5fbf8] shadow-xs'
                  : 'text-[#4e665f] dark:text-[#8eada3] hover:text-[#081a14]'
              }`}
            >
              OTC First-Aid
            </button>
            <button
              onClick={() => setStatusFilter('rx')}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                statusFilter === 'rx'
                  ? 'bg-white dark:bg-[#15342a] text-[#081a14] dark:text-[#f5fbf8] shadow-xs'
                  : 'text-[#4e665f] dark:text-[#8eada3] hover:text-[#081a14]'
              }`}
            >
              Doctor / Emergency
            </button>
          </div>
        </div>

        {/* Horizontal Category Scroll */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center space-x-1.5 transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#0d7a5f] dark:bg-[#00BE88] text-white dark:text-[#041611] shadow-xs'
                : 'bg-white dark:bg-[#0d221b] text-[#223730] dark:text-[#d1e4dd] border border-[#d1ded9] dark:border-[#1b4136] hover:bg-[#eaf1ee] dark:hover:bg-[#143229]'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>All Categories ({MEDICATIONS_DATABASE.length})</span>
          </button>
          {MEDICATION_SECTIONS.map((sec) => {
            const isSelected = selectedCategory === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setSelectedCategory(sec.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center space-x-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0d7a5f] dark:bg-[#00BE88] text-white dark:text-[#041611] shadow-xs'
                    : 'bg-white dark:bg-[#0d221b] text-[#223730] dark:text-[#d1e4dd] border border-[#d1ded9] dark:border-[#1b4136] hover:bg-[#eaf1ee] dark:hover:bg-[#143229]'
                }`}
              >
                <span>{getCategoryIcon(sec.iconName)}</span>
                <span>{sec.title.split('&')[0]}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Main Section-by-Section Content */}
      {groupedSections.length === 0 ? (
        <Card variant="raised" className="text-center py-12 space-y-3">
          <Pill className="w-10 h-10 text-[#6c837c] dark:text-[#8eada3] mx-auto opacity-50" />
          <h3 className="font-bold text-[#081a14] dark:text-[#f5fbf8]">No medications found</h3>
          <p className="text-xs text-[#4e665f] dark:text-[#8eada3] max-w-sm mx-auto">
            No medications matched &ldquo;{searchQuery}&rdquo;. Try another search term or reset filters.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setStatusFilter('all');
            }}
          >
            Reset Filters
          </Button>
        </Card>
      ) : (
        <div className="space-y-10">
          {groupedSections.map((sec) => (
            <div key={sec.id} className="space-y-4">
              
              {/* Section Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-[#d1ded9] dark:border-[#1b4136] gap-1">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#ecf7f3] dark:bg-[#122e25] text-[#0d7a5f] dark:text-[#00BE88] flex items-center justify-center shrink-0">
                    {getCategoryIcon(sec.iconName, 'w-4 h-4')}
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-[#081a14] dark:text-[#f5fbf8] tracking-tight">
                      {sec.title}
                    </h2>
                    <span className="text-[11px] font-semibold text-[#0d7a5f] dark:text-[#00BE88]">
                      {sec.hindiTitle}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-[#4e665f] dark:text-[#8eada3] font-medium">
                  {sec.items.length} {sec.items.length === 1 ? 'Medicine' : 'Medicines'}
                </span>
              </div>

              {/* Compact Cards Grid for this Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sec.items.map((med) => {
                  const isEmergencyClinical = med.prescriptionStatus === 'emergency_clinical';
                  return (
                    <motion.div
                      key={med.id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col h-full rounded-2xl bg-white dark:bg-[#0d221b] border border-[#d1ded9] dark:border-[#1b4136] hover:border-[#0d7a5f] dark:hover:border-[#00BE88] transition-all hover:shadow-md overflow-hidden group"
                    >
                      {/* Compact SVG Visual Banner */}
                      <div className="p-2.5 pb-0">
                        <MedicationVisual form={med.dosageForm} name={med.name} className="h-28 w-full" />
                      </div>

                      {/* Card Body: Compact, Brief & Scannable */}
                      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-2">
                          
                          {/* Prescription Status Badge */}
                          <div className="flex items-center justify-between gap-1 text-[10px] font-bold">
                            <span className="text-[#0d7a5f] dark:text-[#00BE88] bg-[#ecf7f3] dark:bg-[#122e25] px-2 py-0.5 rounded-md border border-[#b8e2d4] dark:border-[#1d4d3e]">
                              {med.dosageFormLabel.split(' ')[0]}
                            </span>
                            <span className={`px-2 py-0.5 rounded-md font-black uppercase tracking-wider ${
                              isEmergencyClinical
                                ? 'bg-red-100 dark:bg-red-950/70 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
                                : 'bg-[#f4f7f5] dark:bg-[#15342a] text-[#4e665f] dark:text-[#8eada3] border border-[#d1ded9] dark:border-[#1e463a]'
                            }`}>
                              {med.prescriptionStatus === 'otc' ? 'OTC First-Aid' : isEmergencyClinical ? 'Hospital ICU' : 'Doctor Prescribed'}
                            </span>
                          </div>

                          {/* Medicine Name & Generic */}
                          <div>
                            <h3 className="font-extrabold text-sm sm:text-base text-[#081a14] dark:text-[#f5fbf8] group-hover:text-[#0d7a5f] dark:group-hover:text-[#00BE88] transition-colors leading-snug">
                              {med.name}
                            </h3>
                            <p className="text-[11px] font-semibold text-[#0d7a5f] dark:text-[#00BE88] truncate mt-0.5">
                              {med.genericName}
                            </p>
                          </div>

                          {/* Brief 1-Sentence Purpose */}
                          <p className="text-xs text-[#223730] dark:text-[#d1e4dd] leading-relaxed line-clamp-2">
                            {med.usedFor}
                          </p>

                          {/* Indian Brand Tags */}
                          <div className="flex flex-wrap items-center gap-1 pt-0.5">
                            {med.brandNames.slice(0, 2).map((brand) => (
                              <span
                                key={brand}
                                className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#eaf0ed] dark:bg-[#122e25] text-[#081a14] dark:text-[#d1e4dd] border border-[#d1ded9] dark:border-[#1e463a]"
                              >
                                {brand}
                              </span>
                            ))}
                            {med.brandNames.length > 2 && (
                              <span className="text-[10px] text-[#6c837c] dark:text-[#8eada3] font-medium">
                                +{med.brandNames.length - 2} more
                              </span>
                            )}
                          </div>

                        </div>

                        {/* Know More Action Button */}
                        <div className="pt-2 border-t border-[#d1ded9] dark:border-[#1b4136]">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setActiveModalMed(med)}
                            rightIcon={<ArrowRight className="w-3 h-3" />}
                            className="w-full justify-between text-xs font-bold cursor-pointer py-1.5"
                          >
                            <span>Know More</span>
                          </Button>
                        </div>

                      </div>
                    </motion.div>
                  );
                })}
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Statutory Clinical Advisory & Legal Notice */}
      <Card variant="raised" className="space-y-3 border-t-4 border-t-[#0d7a5f] dark:border-t-[#00BE88]">
        <div className="flex items-center space-x-2 text-[#081a14] dark:text-[#f5fbf8] font-black text-xs sm:text-sm uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-[#0d7a5f] dark:text-[#00BE88]" />
          <span>Statutory Pharmacological Safety Notice & Medical Disclaimer</span>
        </div>
        <div className="text-xs text-[#223730] dark:text-[#d1e4dd] leading-relaxed space-y-2">
          <p>
            <strong>1. Informational Educational Boundary:</strong> The medications listed above reflect standardized first-aid protocols, the World Health Organization (WHO) Model List of Essential Medicines, and the Indian Pharmacopoeia. Mendly is an acute triage and injury harm-reduction platform—it does not prescribe, dispense, or endorse specific proprietary brand formulations.
          </p>
          <p>
            <strong>2. Consult Certified Clinicians:</strong> Always verify dosing, potential drug-drug interactions, and individual hypersensitivity with a certified medical doctor (MBBS/MD) or registered pharmacist before administering any oral or topical therapeutic agent.
          </p>
          <p>
            <strong>3. Emergency Escalation (112 / 108):</strong> Serious systemic reactions, arterial hemorrhage, deep third-degree burns, acute venomous bites, and loss of consciousness strictly require instant emergency paramedic deployment and hospital trauma center resuscitation.
          </p>
        </div>
      </Card>

      {/* Detail Modal Component */}
      <MedicationDetailModal
        medication={activeModalMed}
        isOpen={Boolean(activeModalMed)}
        onClose={() => setActiveModalMed(null)}
        onOpenEmergency={onOpenEmergency}
        language={userPrefs.language}
      />

    </div>
  );
};

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
  Sparkles,
  ExternalLink,
  Filter,
  Building2,
  X
} from 'lucide-react';
import {
  MEDICATIONS_DATABASE,
  MEDICATION_CATEGORIES,
  MedicationItem,
  MedicationCategory,
  PrescriptionStatus
} from '../data/medications';
import { MedicationVisual } from './ui/MedicationVisual';
import { MedicationDetailModal } from './MedicationDetailModal';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
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

      // Search query match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = med.name.toLowerCase().includes(q);
        const matchGeneric = med.genericName.toLowerCase().includes(q);
        const matchCategory = med.categoryLabel.toLowerCase().includes(q);
        const matchUsedFor = med.usedFor.toLowerCase().includes(q);
        const matchBrands = med.brandNames.some((b) => b.toLowerCase().includes(q));
        return matchName || matchGeneric || matchCategory || matchUsedFor || matchBrands;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, statusFilter]);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-3.5 h-3.5" />;
      case 'Scissors':
        return <Scissors className="w-3.5 h-3.5" />;
      case 'Activity':
        return <Activity className="w-3.5 h-3.5" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-3.5 h-3.5" />;
      case 'Droplets':
        return <Droplets className="w-3.5 h-3.5" />;
      case 'Eye':
        return <Eye className="w-3.5 h-3.5" />;
      case 'AlertOctagon':
        return <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />;
      case 'Pill':
      default:
        return <Pill className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20">
      
      {/* Top Clinical Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ecf7f3] via-white to-[#f4f7f5] dark:from-[#0d221b] dark:via-[#091a14] dark:to-[#06130f] border border-[#b8e2d4] dark:border-[#1d4d3e] p-6 sm:p-10 shadow-xs">
        <div className="max-w-3xl space-y-3.5">
          <div className="inline-flex items-center space-x-2 text-[#0d7a5f] dark:text-[#00BE88] text-xs font-bold uppercase tracking-wider bg-white/80 dark:bg-[#081a14]/80 px-3 py-1 rounded-full border border-[#b8e2d4] dark:border-[#1d4d3e] shadow-2xs">
            <Pill className="w-4 h-4" />
            <span>Emergency First-Aid Formulary & Pharmacy Guide</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#081a14] dark:text-[#f5fbf8] leading-tight">
            Evidence-Based First-Aid Medications
          </h1>

          <p className="text-[#223730] dark:text-[#d1e4dd] text-sm sm:text-base leading-relaxed">
            Understand the exact topical antiseptics, burn creams, oral analgesics, and emergency biologicals required for specific acute injuries. Grounded in WHO Essential Medicines and Indian Pharmacopoeia standards.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs">
            <span className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Over-The-Counter (OTC) Home Stock</span>
            </span>
            <span className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800">
              <Building2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Jan Aushadhi (PMBJP) Generic Pricing</span>
            </span>
            <span className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 font-bold border border-rose-200 dark:border-rose-800">
              <AlertOctagon className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
              <span>Rabies & Venom Emergency Protocols</span>
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar & Filters Section */}
      <div className="space-y-4">
        
        {/* Search input + OTC switch */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#4e665f] dark:text-[#8eada3] absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by medicine, brand (e.g. Betadine, Dolo 650, Volini, Burnol, ORS) or injury..."
              className="w-full pl-10 pr-10 py-3 rounded-2xl bg-white dark:bg-[#0d221b] border border-[#d1ded9] dark:border-[#1b4136] text-[#081a14] dark:text-[#f5fbf8] placeholder-[#6c837c] dark:placeholder-[#67877e] text-sm font-medium focus:outline-hidden focus:border-[#0d7a5f] dark:focus:border-[#00BE88] transition-colors shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-[#4e665f] dark:text-[#8eada3] hover:text-[#081a14] dark:hover:text-white"
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
              All Types
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
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {MEDICATION_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center space-x-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#0d7a5f] dark:bg-[#00BE88] text-white dark:text-[#041611] shadow-xs scale-[1.02]'
                    : 'bg-white dark:bg-[#0d221b] text-[#223730] dark:text-[#d1e4dd] border border-[#d1ded9] dark:border-[#1b4136] hover:bg-[#eaf1ee] dark:hover:bg-[#143229]'
                }`}
              >
                <span>{getCategoryIcon(cat.iconName)}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-[#4e665f] dark:text-[#8eada3] px-1 font-semibold">
        <span>Showing {filteredMeds.length} verified medications</span>
        {searchQuery && (
          <span>Filtered by &ldquo;{searchQuery}&rdquo;</span>
        )}
      </div>

      {/* Medication Cards Grid */}
      {filteredMeds.length === 0 ? (
        <Card variant="raised" className="text-center py-12 space-y-3">
          <Pill className="w-10 h-10 text-[#6c837c] dark:text-[#8eada3] mx-auto opacity-50" />
          <h3 className="font-bold text-[#081a14] dark:text-[#f5fbf8]">No medications found</h3>
          <p className="text-xs text-[#4e665f] dark:text-[#8eada3] max-w-sm mx-auto">
            Try adjusting your search query or switching category filters above.
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMeds.map((med) => {
            const isEmergencyClinical = med.prescriptionStatus === 'emergency_clinical';
            return (
              <motion.div
                key={med.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col h-full rounded-3xl bg-white dark:bg-[#0d221b] border border-[#d1ded9] dark:border-[#1b4136] hover:border-[#0d7a5f] dark:hover:border-[#00BE88] transition-all hover:shadow-md overflow-hidden group"
              >
                {/* SVG Visual Banner */}
                <div className="p-3 pb-0">
                  <MedicationVisual form={med.dosageForm} name={med.name} className="h-38 w-full" />
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    
                    {/* Category & Status Pill */}
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${med.badgeBg}`}>
                        {med.categoryLabel}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#f4f7f5] dark:bg-[#122e25] text-[#223730] dark:text-[#d1e4dd] border border-[#d1ded9] dark:border-[#1e463a]">
                        {med.dosageFormLabel}
                      </span>
                    </div>

                    {/* Titles */}
                    <div>
                      <h3 className="font-black text-lg text-[#081a14] dark:text-[#f5fbf8] group-hover:text-[#0d7a5f] dark:group-hover:text-[#00BE88] transition-colors leading-snug">
                        {med.name}
                      </h3>
                      <p className="text-xs font-semibold text-[#0d7a5f] dark:text-[#00BE88] mt-0.5">
                        {med.genericName}
                      </p>
                    </div>

                    {/* Concise Basic Info: Used For */}
                    <p className="text-xs text-[#223730] dark:text-[#d1e4dd] leading-relaxed line-clamp-2">
                      {med.usedFor}
                    </p>

                    {/* Quick Warning Capsule */}
                    <div className={`p-2.5 rounded-xl text-[11px] leading-relaxed flex items-start space-x-2 ${
                      isEmergencyClinical
                        ? 'bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 border border-red-200 dark:border-red-900/60 font-medium'
                        : 'bg-[#f4f7f5] dark:bg-[#091a14] text-[#4e665f] dark:text-[#8eada3] border border-[#d1ded9] dark:border-[#1b4136]'
                    }`}>
                      <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-current opacity-80" />
                      <span className="line-clamp-2">
                        <strong>Caution:</strong> {med.keyWarning}
                      </span>
                    </div>

                    {/* Market Brand Tags */}
                    <div className="flex flex-wrap items-center gap-1 pt-0.5">
                      {med.brandNames.slice(0, 3).map((brand) => (
                        <span
                          key={brand}
                          className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#eaf0ed] dark:bg-[#122e25] text-[#223730] dark:text-[#8eada3]"
                        >
                          {brand}
                        </span>
                      ))}
                      {med.brandNames.length > 3 && (
                        <span className="text-[10px] text-[#6c837c] dark:text-[#8eada3] font-medium">
                          +{med.brandNames.length - 3} more
                        </span>
                      )}
                    </div>

                  </div>

                  {/* Know More Button */}
                  <div className="pt-2 border-t border-[#d1ded9] dark:border-[#1b4136]">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setActiveModalMed(med)}
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      className="w-full justify-between font-bold cursor-pointer"
                    >
                      <span>Know More & Clinical Guide</span>
                    </Button>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Statutory Clinical Advisory & Legal Notice */}
      <Card variant="raised" className="space-y-3.5 border-t-4 border-t-[#0d7a5f] dark:border-t-[#00BE88]">
        <div className="flex items-center space-x-2 text-[#081a14] dark:text-[#f5fbf8] font-black text-sm uppercase tracking-wider">
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

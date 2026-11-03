export type MedicationCategory =
  | 'burns'
  | 'cuts_wounds'
  | 'sprains_trauma'
  | 'allergies_bites'
  | 'heat_dehydration'
  | 'eye_care'
  | 'emergency_bites'
  | 'trauma_shock';

export type DosageForm =
  | 'ointment'
  | 'tablet'
  | 'solution'
  | 'sachet'
  | 'drops'
  | 'injection';

export type PrescriptionStatus =
  | 'otc'
  | 'doctor_prescription'
  | 'emergency_clinical';

export interface MedicationItem {
  id: string;
  name: string;
  genericName: string;
  brandNames: string[];
  category: MedicationCategory;
  categoryLabel: string;
  categoryHindi: string;
  dosageForm: DosageForm;
  dosageFormLabel: string;
  prescriptionStatus: PrescriptionStatus;
  prescriptionLabel: string;
  usedFor: string;
  standardDose: string;
  keyWarning: string;
  accentColor: string;
  badgeBg: string;
  detailedGuide: {
    mechanism: string;
    clinicalApplicationSteps: string[];
    contraindications: string[];
    pediatricPregnancyNotice: string;
    janAushadhiNote: string;
    doctorEscalationTriggers: string[];
  };
}

export interface MedicationCategorySection {
  id: MedicationCategory;
  title: string;
  hindiTitle: string;
  description: string;
  iconName: string;
  accentColor: string;
}

export const MEDICATION_SECTIONS: MedicationCategorySection[] = [
  {
    id: 'burns',
    title: 'Burns, Scalds & Thermal Injury',
    hindiTitle: 'जलना, गर्म तरल और छाले',
    description: 'Topical antibacterial creams, cooling hydrogels, and infection-prevention dressings for 1st & 2nd degree burns.',
    iconName: 'Flame',
    accentColor: '#d97706'
  },
  {
    id: 'cuts_wounds',
    title: 'Open Wounds, Cuts & Bleeding Abrasions',
    hindiTitle: 'कट, खरोंच, घाव और रक्तस्राव',
    description: 'Gold-standard broad-spectrum antiseptics, barrier salves, sterile wound washes, and tetanus prophylaxis.',
    iconName: 'Scissors',
    accentColor: '#0d7a5f'
  },
  {
    id: 'sprains_trauma',
    title: 'Sprains, Strains & Joint Trauma',
    hindiTitle: 'मोच, मांसपेशियों का खिंचाव और अंदरूनी चोट',
    description: 'Topical NSAID counter-irritants, anti-inflammatory oral analgesics, and acute swelling reduction.',
    iconName: 'Activity',
    accentColor: '#0284c7'
  },
  {
    id: 'allergies_bites',
    title: 'Insect Stings, Bug Bites & Allergic Rashes',
    hindiTitle: 'कीड़े का डंक, बिच्छू का डंक और त्वचा एलर्जी',
    description: 'Soothing antipruritic lotions, non-sedating antihistamines, and localized anti-inflammatory corticosteroids.',
    iconName: 'ShieldAlert',
    accentColor: '#7c3aed'
  },
  {
    id: 'heat_dehydration',
    title: 'Heat Exhaustion & Acute Dehydration',
    hindiTitle: 'लू (हीटस्ट्रोक), पानी की कमी और ऐंठन',
    description: 'WHO-standard reduced-osmolarity oral rehydration salts and instant cellular glucose restoration.',
    iconName: 'Droplets',
    accentColor: '#0ea5e9'
  },
  {
    id: 'eye_care',
    title: 'Eye Trauma, Dust & Chemical Irritation',
    hindiTitle: 'आंख की चोट, धूल और जलन',
    description: 'Sterile preservative-free ocular washes, lubricating polymers, and prescription prophylactic eye drops.',
    iconName: 'Eye',
    accentColor: '#06b6d4'
  },
  {
    id: 'emergency_bites',
    title: 'Rabies & Snakebite Venom Protocols',
    hindiTitle: 'कुत्ता, जानवर और सांप का काटना (आपातकालीन)',
    description: 'Hospital-mandatory post-exposure rabies vaccines, immunoglobulin, and polyvalent anti-snake venom.',
    iconName: 'AlertOctagon',
    accentColor: '#dc2626'
  },
  {
    id: 'trauma_shock',
    title: 'Post-Trauma Acidity, Gastric Shock & Nausea',
    hindiTitle: 'चोट के बाद घबराहट, मतली और पेट में जलन',
    description: 'Rapid-acting gastric acid buffers and antiemetics for post-injury nausea and acute physiological stress.',
    iconName: 'HeartPulse',
    accentColor: '#4f46e5'
  }
];

export const MEDICATIONS_DATABASE: MedicationItem[] = [
  // ==========================================
  // SECTION 1: BURNS, SCALDS & THERMAL INJURY
  // ==========================================
  {
    id: 'silver-sulfadiazine',
    name: 'Silver Sulfadiazine 1% Cream',
    genericName: 'Silver Sulfadiazine IP 1.0% w/w',
    brandNames: ['Burnol Silver', 'Silverex Ionic', 'Silvazine', 'Dermazin'],
    category: 'burns',
    categoryLabel: 'Burns & Scalds',
    categoryHindi: 'जलना और छाले',
    dosageForm: 'ointment',
    dosageFormLabel: 'Topical Antibacterial Cream',
    prescriptionStatus: 'otc',
    prescriptionLabel: 'First-Aid Essential (OTC)',
    usedFor: 'Prevents bacterial colonization on minor partial-thickness burns after 20 minutes of cold water cooling.',
    standardDose: 'Apply 1–2 mm layer with sterile gauze twice daily.',
    keyWarning: 'Do not apply to facial burns or patients with known sulfa allergy.',
    accentColor: '#d97706',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    detailedGuide: {
      mechanism: 'Releases silver ions that disrupt microbial cell membranes and bind DNA, offering broad-spectrum protection against Pseudomonas and Staph without macerating viable dermis.',
      clinicalApplicationSteps: [
        'Irrigate burned area under gently running tap water (15–25°C) for 20 continuous minutes first.',
        'Gently pat dry with sterile lint-free gauze. Never burst intact blisters.',
        'Apply a 1–2 mm layer of cream using sterile gloves or a clean spatula.',
        'Dress loosely with sterile non-stick paraffin gauze.'
      ],
      contraindications: [
        'Known Sulfa hypersensitivity.',
        'Infants under 2 months of age (kernicterus danger).',
        'Facial burns near eyes or mouth.'
      ],
      pediatricPregnancyNotice: 'Contraindicated in pregnancy near term.',
      janAushadhiNote: 'Available at Jan Aushadhi (PMBJP) centers as "Silver Sulfadiazine Cream IP 1%" for ~₹18–₹25.',
      doctorEscalationTriggers: [
        'Burn area exceeds the size of the patient\'s palm.',
        'Burn involves hands, feet, face, genitals, or major joints.'
      ]
    }
  },
  {
    id: 'burnol-antiseptic',
    name: 'Burnol Classic Antiseptic Cream',
    genericName: 'Aminacrine HCl 0.1% + Cetrimide IP 0.5% w/w',
    brandNames: ['Burnol', 'Burnheal', 'Burn-Aid'],
    category: 'burns',
    categoryLabel: 'Burns & Scalds',
    categoryHindi: 'जलना और छाले',
    dosageForm: 'ointment',
    dosageFormLabel: 'Antiseptic Healing Cream',
    prescriptionStatus: 'otc',
    prescriptionLabel: 'First-Aid OTC',
    usedFor: 'India\'s historic first-aid cream for immediate soothing and surface antisepsis in minor kitchen scalds and superficial heat burns.',
    standardDose: 'Apply directly over superficial burn or minor cut after cooling.',
    keyWarning: 'For superficial 1st degree burns only. Do not apply on deep blistering flesh or chemical burns.',
    accentColor: '#d97706',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    detailedGuide: {
      mechanism: 'Aminacrine acts as an acridine dye bacteriostatic agent; Cetrimide acts as a quaternary ammonium disinfectant that lowers surface tension and cleanses minor burn margins.',
      clinicalApplicationSteps: [
        'Cool the heated skin under cold tap water for at least 15 minutes.',
        'Dry gently with clean cotton.',
        'Apply a thin yellow film of Burnol over the red area.',
        'Leave open or cover with a light sterile dressing.'
      ],
      contraindications: ['Deep 3rd degree burns, extensive raw weeping skin.'],
      pediatricPregnancyNotice: 'Safe for children over 1 year on minor localized spots.',
      janAushadhiNote: 'Commonly stocked across all retail pharmacies and Jan Aushadhi counters in India.',
      doctorEscalationTriggers: ['Yellow pus discharge, severe swelling, or spreading redness after 48 hours.']
    }
  },
  {
    id: 'aloe-vera-gel',
    name: 'Medical-Grade Aloe Vera Gel 99%',
    genericName: 'Purified Aloe Barbadensis Leaf Hydrogel IP',
    brandNames: ['Pure Aloe Gel', 'Patanjali Aloe Vera', 'Vaseline Soothing'],
    category: 'burns',
    categoryLabel: 'Burns & Scalds',
    categoryHindi: 'जलना और छाले',
    dosageForm: 'ointment',
    dosageFormLabel: 'Topical Dermal Hydrogel',
    prescriptionStatus: 'otc',
    prescriptionLabel: 'First-Aid OTC',
    usedFor: 'Cools thermal stinging, hydrates dermis, and speeds recovery in 1st-degree heat burns and sunburns.',
    standardDose: 'Smooth gently over unbroken, sun-reddened skin 3 to 4 times daily.',
    keyWarning: 'Use only on intact superficial burns. Never apply over broken skin or unroofed blisters.',
    accentColor: '#059669',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    detailedGuide: {
      mechanism: 'Acemannan polysaccharides stimulate microvascular perfusion and inhibit bradykinin-mediated heat pain.',
      clinicalApplicationSteps: [
        'Cool skin with cold compress for 10 minutes.',
        'Smooth thin layer without rubbing.',
        'Leave uncovered for convective cooling.'
      ],
      contraindications: ['Open cuts, bleeding abrasions, weeping blisters.'],
      pediatricPregnancyNotice: 'Safe for all ages on intact skin.',
      janAushadhiNote: 'Widely available in India as pure soothing hydrogel.',
      doctorEscalationTriggers: ['Fever, extensive blistering, or dizziness.']
    }
  },
  {
    id: 'soframycin-cream',
    name: 'Soframycin Skin Cream (Framycetin 1%)',
    genericName: 'Framycetin Sulphate IP 1% w/w',
    brandNames: ['Soframycin', 'Framygen', 'T-Bact'],
    category: 'burns',
    categoryLabel: 'Burns & Scalds',
    categoryHindi: 'जलना और छाले',
    dosageForm: 'ointment',
    dosageFormLabel: 'Broad-Spectrum Aminoglycoside Cream',
    prescriptionStatus: 'otc',
    prescriptionLabel: 'Household OTC',
    usedFor: 'Essential Indian household antibiotic cream for preventing secondary infection on minor scalds, cuts, and scrapes.',
    standardDose: 'Apply a thin layer 1–2 times daily under clean dressing.',
    keyWarning: 'Do not use for more than 7 days. Do not use in deep fungal infections.',
    accentColor: '#0d7a5f',
    badgeBg: 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    detailedGuide: {
      mechanism: 'Irreversibly binds 30S ribosomal subunit of bacteria, causing mistranslation of proteins and cell death.',
      clinicalApplicationSteps: [
        'Clean wound with potable water.',
        'Apply small pea-sized amount.',
        'Cover with clean gauze.'
      ],
      contraindications: ['Known aminoglycoside allergy, perforated eardrum if used near ear.'],
      pediatricPregnancyNotice: 'Safe for minor spot use in children.',
      janAushadhiNote: 'Framycetin Cream is available at all Indian chemist stores.',
      doctorEscalationTriggers: ['Spreading erythema or throbbing heat.']
    }
  },

  // ==========================================
  // SECTION 2: OPEN WOUNDS, CUTS & BLEEDING
  // ==========================================
  {
    id: 'cipladine-povidone',
    name: 'Cipladine / Betadine 5% Ointment',
    genericName: 'Povidone-Iodine IP 5.0% w/w Ointment',
    brandNames: ['Cipladine', 'Betadine', 'Wokadine', 'Povicare'],
    category: 'cuts_wounds',
    categoryLabel: 'Cuts & Wounds',
    categoryHindi: 'कट और घाव',
    dosageForm: 'ointment',
    dosageFormLabel: 'Antiseptic Barrier Salve',
    prescriptionStatus: 'otc',
    prescriptionLabel: 'First-Aid Essential (OTC)',
    usedFor: 'Gold-standard broad-spectrum antiseptic ointment for scrapes, grazed knees, cuts, and minor lacerations.',
    standardDose: 'Dab a thin layer over the cleaned wound 1–2 times daily under sterile gauze.',
    keyWarning: 'Do not use if allergic to iodine. Do not pour into deep puncture cavities.',
    accentColor: '#92400e',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    detailedGuide: {
      mechanism: 'Slowly releases free iodine (I₂) that destroys microbial cell wall proteins and nucleic acids across bacteria, fungi, and viruses.',
      clinicalApplicationSteps: [
        'Rinse wound under running tap water or saline to clear dirt.',
        'Apply gentle direct pressure until bleeding stops.',
        'Dab Cipladine ointment across wound margins.',
        'Cover with breathable sterile adhesive bandage.'
      ],
      contraindications: ['Iodine hypersensitivity, major thyroid disorders over large surface areas.'],
      pediatricPregnancyNotice: 'Avoid excessive prolonged application over large areas in infants.',
      janAushadhiNote: 'PMBJP stocks "Povidone-Iodine 5% Ointment 20g" for ~₹12–₹18.',
      doctorEscalationTriggers: ['Wound is gaping wide (>0.5 cm) or requires stitches.']
    }
  },
  {
    id: 'povidone-solution',
    name: 'Betadine / Cipladine 10% Solution',
    genericName: 'Povidone-Iodine IP 10.0% w/v Liquid',
    brandNames: ['Betadine 10%', 'Cipladine Liquid', 'Wokadine 10%'],
    category: 'cuts_wounds',
    categoryLabel: 'Cuts & Wounds',
    categoryHindi: 'कट और घाव',
    dosageForm: 'solution',
    dosageFormLabel: 'Topical Antiseptic Liquid',
    prescriptionStatus: 'otc',
    prescriptionLabel: 'First-Aid Essential (OTC)',
    usedFor: 'Skin disinfection and wound margin prep before dressing acute road scrapes and sharp object cuts.',
    standardDose: 'Apply with sterile cotton swab from center of wound outward.',
    keyWarning: 'Allow to air dry for 60 seconds for full antimicrobial activation.',
    accentColor: '#92400e',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    detailedGuide: {
      mechanism: 'Rapid bactericidal oxidation of cellular enzymes upon air-drying.',
      clinicalApplicationSteps: ['Flush wound with saline first.', 'Swab solution gently around wound edges.'],
      contraindications: ['Do not pour into deep organ cavities.'],
      pediatricPregnancyNotice: 'Safe for localized minor cuts.',
      janAushadhiNote: 'Jan Aushadhi 100ml bottle costs ~₹22–₹28.',
      doctorEscalationTriggers: ['Active spurting arterial hemorrhage.']
    }
  },
  {
    id: 'boroline-antiseptic',
    name: 'Boroline Antiseptic Ayurvedic Cream',
    genericName: 'Boric Acid IP 1% + Zinc Oxide IP 3% + Anhydrous Lanolin',
    brandNames: ['Boroline', 'BoroPlus', 'Vicco Turmeric'],
    category: 'cuts_wounds',
    categoryLabel: 'Cuts & Wounds',
    categoryHindi: 'कट और घाव',
    dosageForm: 'ointment',
    dosageFormLabel: 'Protective Antiseptic Barrier',
    prescriptionStatus: 'otc',
    prescriptionLabel: 'Classic Indian OTC',
    usedFor: 'India\'s historic green tube: protects minor cuts, cracked skin, chapped lips, and dry scrapes from environmental dirt.',
    standardDose: 'Massage gently onto cleaned dry superficial cuts before sleep.',
    keyWarning: 'Do NOT use on actively bleeding, deep, or heavily oozing wounds.',
    accentColor: '#059669',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    detailedGuide: {
      mechanism: 'Zinc oxide acts as a mild astringent and protective barrier; Boric acid provides mild antifungal and antibacterial action; Lanolin locks in dermal moisture.',
      clinicalApplicationSteps: ['Wash cut with soap and water.', 'Dry completely.', 'Apply smooth layer to seal minor skin cracks.'],
      contraindications: ['Deep open wounds, burns requiring sterile irrigation.'],
      pediatricPregnancyNotice: 'Safe across all age groups.',
      janAushadhiNote: 'Ubiquitous throughout India in every village and city chemist.',
      doctorEscalationTriggers: ['Signs of cellulitis or throbbing infection.']
    }
  },
  {
    id: 'neosporin-triple',
    name: 'Neosporin Triple Antibiotic Ointment',
    genericName: 'Neomycin + Polymyxin B + Bacitracin Zinc IP',
    brandNames: ['Neosporin', 'Nebasulf', 'Polymyxin Ointment'],
    category: 'cuts_wounds',
    categoryLabel: 'Cuts & Wounds',
    categoryHindi: 'कट और घाव',
    dosageForm: 'ointment',
    dosageFormLabel: 'Triple Antibiotic Salve',
    prescriptionStatus: 'otc',
    prescriptionLabel: 'First-Aid OTC',
    usedFor: 'Prevents bacterial infection in minor abrasions, cuts, and scrapes while keeping the wound bed moist.',
    standardDose: 'Apply a pea-sized amount 1–3 times daily.',
    keyWarning: 'Discontinue if localized itching or allergic contact dermatitis occurs.',
    accentColor: '#0284c7',
    badgeBg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    detailedGuide: {
      mechanism: 'Combines 3 mechanisms: Bacitracin disrupts cell walls; Neomycin stops protein synthesis; Polymyxin breaks membrane stability.',
      clinicalApplicationSteps: ['Clean wound.', 'Apply small dab.', 'Cover with sterile bandage.'],
      contraindications: ['Known Neomycin contact allergy.'],
      pediatricPregnancyNotice: 'Safe for children over 2 years.',
      janAushadhiNote: 'Available as generic Neomycin-Polymyxin ointment at PMBJP.',
      doctorEscalationTriggers: ['Spreading red streaks towards heart.']
    }
  },
  {
    id: 'normal-saline',
    name: 'Sterile Normal Saline 0.9% (Wound Wash)',
    genericName: 'Sodium Chloride IP 0.9% w/v Sterile Solution',
    brandNames: ['Baxter 0.9% NaCl', 'Wound Wash Saline', 'Nirma Saline'],
    category: 'cuts_wounds',
    categoryLabel: 'Cuts & Wounds',
    categoryHindi: 'कट और घाव',
    dosageForm: 'solution',
    dosageFormLabel: 'Isotonic Wound Wash',
    prescriptionStatus: 'otc',
    prescriptionLabel: 'First-Aid Essential (OTC)',
    usedFor: 'Flushes road dust, gravel, and grit out of fresh cuts without damaging delicate healing skin cells.',
    standardDose: 'Flush copiously over the fresh wound using gentle gravitational flow.',
    keyWarning: 'Use only unopened sterile bottles or fresh ampoules. Discard unsealed solution after 24 hours.',
    accentColor: '#0d7a5f',
    badgeBg: 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    detailedGuide: {
      mechanism: 'Isotonic osmotic concentration (308 mOsm/L) matches extracellular fluid, preventing cell lysis or tissue stinging.',
      clinicalApplicationSteps: ['Direct stream across wound bed from high to low until all loose grit is washed away.'],
      contraindications: ['None. 100% biocompatible.'],
      pediatricPregnancyNotice: 'Safe for all ages and neonates.',
      janAushadhiNote: '500ml bottle costs ₹10–₹15 at Jan Aushadhi.',
      doctorEscalationTriggers: ['Embedded glass or metal that cannot be dislodged with saline stream.']
    }
  },
  {
    id: 'tetanus-toxoid',
    name: 'Tetanus Toxoid (TT) Booster Vaccine',
    genericName: 'Tetanus Toxoid Adsorbed IP (0.5 ml IM Injection)',
    brandNames: ['Tetvac', 'Serum Institute TT', 'Betatetanus'],
    category: 'cuts_wounds',
    categoryLabel: 'Cuts & Wounds',
    categoryHindi: 'कट और घाव',
    dosageForm: 'injection',
    dosageFormLabel: 'Intramuscular Booster Vaccine',
    prescriptionStatus: 'doctor_prescription',
    prescriptionLabel: 'Clinical Mandatory',
    usedFor: 'Mandatory protection against fatal lockjaw for rusty nail punctures, road trauma, and soil-contaminated cuts.',
    standardDose: 'Single 0.5 ml IM injection in deltoid within 24–48 hours of trauma.',
    keyWarning: 'Do NOT delay beyond 48 hours. Receive at nearest clinic/PHC.',
    accentColor: '#dc2626',
    badgeBg: 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800',
    detailedGuide: {
      mechanism: 'Inactivated toxoid stimulates host B-cells to produce neutralizing antitoxins against synaptic motor neurotoxins.',
      clinicalApplicationSteps: ['If dirty wound and last booster was >5 years ago, take 0.5ml IM immediately.'],
      contraindications: ['Severe anaphylaxis to prior tetanus shot.'],
      pediatricPregnancyNotice: 'Standard routine protocol in pregnancy and trauma.',
      janAushadhiNote: 'Free or ₹10 at all Government Primary Health Centres (PHC) across India.',
      doctorEscalationTriggers: ['Deep nail punctures through footwear into foot sole.']
    }
  },

  // ==========================================
  // SECTION 3: SPRAINS, STRAINS & JOINT TRAUMA
  // ==========================================
  {
    id: 'volini-gel',
    name: 'Volini Pain Relief Gel & Spray',
    genericName: 'Diclofenac Diethylamine 1.16% + Methyl Salicylate 10% + Menthol 5% IP',
    brandNames: ['Volini Gel', 'Volini Spray', 'Omnigel', 'Moov Advance'],
    category: 'sprains_trauma',
    categoryLabel: 'Sprains & Joint Trauma',
    categoryHindi: 'मोच और अंदरूनी चोट',
    dosageForm: 'ointment',
    dosageFormLabel: 'Topical Pain Relief Gel',
    prescriptionStatus: 'otc',
    prescriptionLabel: 'First-Aid OTC',
    usedFor: 'Fast-acting relief for acute ankle sprains, neck spasms, sports strains, and blunt joint contusions.',
    standardDose: 'Gently massage a 2–4 cm ribbon over the sprained joint 3 times daily.',
    keyWarning: 'Do NOT apply on open wounds, cuts, or with electrical heating pads.',
    accentColor: '#d97706',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    detailedGuide: {
      mechanism: 'Diclofenac inhibits localized COX-2 enzymes; Methyl salicylate and Menthol provide counter-irritant vascular dilatation that distracts pain signals.',
      clinicalApplicationSteps: ['Rest and ice joint first (R.I.C.E.).', 'Massage gel gently onto unbroken skin.', 'Wash hands.'],
      contraindications: ['Open cuts, broken blisters, occlusive thermal heat wraps.'],
      pediatricPregnancyNotice: 'Avoid in third trimester of pregnancy.',
      janAushadhiNote: 'Diclofenac gel is ₹15 at Jan Aushadhi.',
      doctorEscalationTriggers: ['Inability to bear weight for 4 steps (Ottawa Ankle Rule) or visible bone deformity.']
    }
  },
  {
    id: 'dolo-650',
    name: 'Dolo 650 / Calpol 650 (Paracetamol)',
    genericName: 'Paracetamol IP 650 mg Tablet',
    brandNames: ['Dolo 650', 'Calpol 650', 'Crocin 650', 'Pacimol'],
    category: 'sprains_trauma',
    categoryLabel: 'Sprains & Joint Trauma',
    categoryHindi: 'मोच और दर्द',
    dosageForm: 'tablet',
    dosageFormLabel: 'Oral Analgesic & Antipyretic',
    prescriptionStatus: 'otc',
    prescriptionLabel: 'First-Aid Essential (OTC)',
    usedFor: 'First-line safe pain relief for sprains, fractures, concussion headache, and trauma-induced pain.',
    standardDose: 'Adults: 1 tablet every 6–8 hours as needed. Max 3,000 mg in 24 hours.',
    keyWarning: 'Never exceed 4,000 mg in 24 hours (liver failure risk). Avoid alcohol.',
    accentColor: '#0d7a5f',
    badgeBg: 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    detailedGuide: {
      mechanism: 'Centrally acting analgesic that raises the pain threshold without inhibiting platelet aggregation (safe in bleeding danger).',
      clinicalApplicationSteps: ['Swallow with water.', 'Space doses at least 6 hours apart.'],
      contraindications: ['Severe active liver failure.'],
      pediatricPregnancyNotice: 'Safest analgesic during pregnancy and pediatric fever (15 mg/kg for children).',
      janAushadhiNote: 'Paracetamol 650mg (10 tablets) costs just ₹8 at PMBJP centers.',
      doctorEscalationTriggers: ['Pain remains >8/10 or accidental overdose occurs.']
    }
  },
  {
    id: 'combiflam-tablet',
    name: 'Combiflam / Brufen 400 (Ibuprofen + Para)',
    genericName: 'Ibuprofen 400 mg + Paracetamol 325 mg IP',
    brandNames: ['Combiflam', 'Brufen 400', 'Ibugesic Plus', 'Flexon'],
    category: 'sprains_trauma',
    categoryLabel: 'Sprains & Joint Trauma',
    categoryHindi: 'मोच और सूजन',
    dosageForm: 'tablet',
    dosageFormLabel: 'Oral NSAID Anti-Inflammatory',
    prescriptionStatus: 'otc',
    prescriptionLabel: 'First-Aid OTC (Take With Food)',
    usedFor: 'Reduces severe inflammatory swelling, joint edema, and throbbing pain after blunt trauma.',
    standardDose: 'Adults: 1 tablet twice daily strictly after a full meal.',
    keyWarning: 'ALWAYS take after meals. Never take if you have stomach ulcers, asthma, or suspected dengue.',
    accentColor: '#d97706',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    detailedGuide: {
      mechanism: 'Inhibits cyclooxygenase (COX-1 & COX-2) to stop prostaglandin-driven inflammatory swelling and joint stiffness.',
      clinicalApplicationSteps: ['Must take with food or milk and a full glass of water.', 'Limit to 3–5 days.'],
      contraindications: ['Active peptic ulcers, gastric bleeding, severe kidney disease, Dengue fever.'],
      pediatricPregnancyNotice: 'Contraindicated in 3rd trimester of pregnancy.',
      janAushadhiNote: 'Ibuprofen+Paracetamol strip costs ~₹6–₹10 at Jan Aushadhi.',
      doctorEscalationTriggers: ['Black tarry stools, stomach burning, or vomiting.']
    }
  },
  {
    id: 'moov-ayurvedic',
    name: 'Moov / Iodex Pain Balm',
    genericName: 'Wintergreen Oil (Gandhapura) + Nilgiri Oil + Pudina ke Phool IP',
    brandNames: ['Moov', 'Iodex', 'Amrutanjan', 'Fast Relief'],
    category: 'sprains_trauma',
    categoryLabel: 'Sprains & Joint Trauma',
    categoryHindi: 'मोच और कमर दर्द',
    dosageForm: 'ointment',
    dosageFormLabel: 'Herbal Counter-Irritant Balm',
    prescriptionStatus: 'otc',
    prescriptionLabel: 'Household OTC',
    usedFor: 'Warm soothing relief for muscular stiffness, lower back strain, and blunt contusions.',
    standardDose: 'Massage gently over affected area until warmth develops 2–3 times daily.',
    keyWarning: 'Wash hands after use. Avoid contact with eyes or sensitive mucous membranes.',
    accentColor: '#059669',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    detailedGuide: {
      mechanism: 'Wintergreen (methyl salicylate) and Eucalyptus produce local vasodilation and soothing thermal distraction.',
      clinicalApplicationSteps: ['Apply to tender muscles with gentle circular massage.'],
      contraindications: ['Broken skin, cuts, eye contact.'],
      pediatricPregnancyNotice: 'Safe for localized adult use.',
      janAushadhiNote: 'Available nationwide in India.',
      doctorEscalationTriggers: ['Pain accompanied by limb numbness or tingling.']
    }
  },

  // ==========================================
  // SECTION 4: INSECT STINGS, BITES & ALLERGIES
  // ==========================================
  {
    id: 'calamine-lotion',
    name: 'Lacto Calamine / Caladryl Lotion',
    genericName: 'Calamine 8% + Zinc Oxide IP Suspension',
    brandNames: ['Lacto Calamine', 'Caladryl', 'Calmin Lotion'],
    category: 'allergies_bites',
    categoryLabel: 'Insect Stings & Allergies',
    categoryHindi: 'कीड़े का डंक और एलर्जी',
    dosageForm: 'solution',
    dosageFormLabel: 'Antipruritic Soothing Lotion',
    prescriptionStatus: 'otc',
    prescriptionLabel: 'First-Aid Essential (OTC)',
    usedFor: 'Soothes intense itching, mosquito bites, bee stings, and allergic contact rashes.',
    standardDose: 'Shake well; dab onto itchy spots with cotton ball 3–4 times daily.',
    keyWarning: 'For external use only. Keep away from eyes.',
    accentColor: '#db2777',
    badgeBg: 'bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-pink-300 border-pink-200 dark:border-pink-800',
    detailedGuide: {
      mechanism: 'Zinc oxide acts as a cooling astringent and evaporates to soothe cutaneous C-fiber itching.',
      clinicalApplicationSteps: ['Wash sting with soap and water.', 'Shake bottle.', 'Dab onto hives.'],
      contraindications: ['Open weeping wounds.'],
      pediatricPregnancyNotice: 'Safe for all ages including infants and pregnancy.',
      janAushadhiNote: 'Calamine Lotion 100ml is ₹25 at Jan Aushadhi.',
      doctorEscalationTriggers: ['Facial swelling or breathing difficulty (Anaphylaxis — Call 112).']
    }
  },
  {
    id: 'cetirizine-10',
    name: 'Cetirizine 10 mg (Cetzine / Okacet)',
    genericName: 'Cetirizine HCl IP 10 mg Tablet',
    brandNames: ['Cetzine', 'Okacet', 'Alerid', 'Zyrtec'],
    category: 'allergies_bites',
    categoryLabel: 'Insect Stings & Allergies',
    categoryHindi: 'कीड़े का डंक और एलर्जी',
    dosageForm: 'tablet',
    dosageFormLabel: 'Oral 2nd-Gen Antihistamine',
    prescriptionStatus: 'otc',
    prescriptionLabel: 'First-Aid Essential (OTC)',
    usedFor: 'Rapidly stops allergic swelling, hives, and intense redness from insect stings and bites.',
    standardDose: 'Adults: 1 tablet (10 mg) once daily with water.',
    keyWarning: 'May cause mild drowsiness in some individuals. Avoid driving after taking.',
    accentColor: '#7c3aed',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    detailedGuide: {
      mechanism: 'Selectively blocks peripheral H1 receptors, stopping histamine-induced capillary leakage and edema.',
      clinicalApplicationSteps: ['Swallow one tablet with water. Works in 30–60 minutes.'],
      contraindications: ['Severe renal failure (CrCl < 10 ml/min).'],
      pediatricPregnancyNotice: 'Safe in pregnancy (Category B). Syrup available for children.',
      janAushadhiNote: 'Strip of 10 tablets costs ~₹5–₹8 at Jan Aushadhi.',
      doctorEscalationTriggers: ['Lip swelling, throat tightness, or wheezing (Call 112).']
    }
  },
  {
    id: 'avil-25',
    name: 'Avil 25 mg (Pheniramine Maleate)',
    genericName: 'Pheniramine Maleate IP 25 mg Tablet',
    brandNames: ['Avil 25', 'Avil 50', 'Pheniramine'],
    category: 'allergies_bites',
    categoryLabel: 'Insect Stings & Allergies',
    categoryHindi: 'कीड़े का डंक और तीव्र एलर्जी',
    dosageForm: 'tablet',
    dosageFormLabel: 'Fast-Acting 1st-Gen Antihistamine',
    prescriptionStatus: 'otc',
    prescriptionLabel: 'Classic Indian Emergency OTC',
    usedFor: 'Classic Indian first-aid tablet for acute severe itching, wasp/bee stings, and allergic food flare-ups.',
    standardDose: 'Adults: 1 tablet (25 mg) 2–3 times daily after food.',
    keyWarning: 'Causes marked drowsiness. Do NOT drive, operate machinery, or consume alcohol.',
    accentColor: '#7c3aed',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    detailedGuide: {
      mechanism: 'First-generation H1 antagonist with rapid central and peripheral anti-allergic action that controls severe histamine release.',
      clinicalApplicationSteps: ['Take after food with water.', 'Rest in a quiet room.'],
      contraindications: ['Prostatic hypertrophy, narrow-angle glaucoma.'],
      pediatricPregnancyNotice: 'Consult a doctor for pediatric dosing.',
      janAushadhiNote: 'Staple medicine in every Indian home and chemist.',
      doctorEscalationTriggers: ['Breathing distress or dizziness.']
    }
  },
  {
    id: 'hydrocortisone-cream',
    name: 'Hydrocortisone 1% Cream',
    genericName: 'Hydrocortisone Acetate IP 1.0% w/w',
    brandNames: ['Cortipin', 'Hycort', 'Wycort'],
    category: 'allergies_bites',
    categoryLabel: 'Insect Stings & Allergies',
    categoryHindi: 'कीड़े का डंक और सूजन',
    dosageForm: 'ointment',
    dosageFormLabel: 'Mild Topical Corticosteroid',
    prescriptionStatus: 'otc',
    prescriptionLabel: 'Short-Term First-Aid OTC',
    usedFor: 'Short-term relief of severe inflammatory wheals, bug bite swelling, and allergic contact dermatitis.',
    standardDose: 'Apply a very thin smear over the swollen bump twice daily for max 3–5 days.',
    keyWarning: 'Do NOT use on face, open wounds, fungal ringworm, or for more than 5 days.',
    accentColor: '#db2777',
    badgeBg: 'bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-pink-300 border-pink-200 dark:border-pink-800',
    detailedGuide: {
      mechanism: 'Low-potency glucocorticoid that reduces cytokine production and vascular permeability.',
      clinicalApplicationSteps: ['Apply tiny dot.', 'Smooth gently.', 'Limit to 3–5 days.'],
      contraindications: ['Fungal infections (ringworm), herpes, open weeping cuts.'],
      pediatricPregnancyNotice: 'Use sparingly under doctor advice in infants.',
      janAushadhiNote: 'Costs ~₹15 at PMBJP centers.',
      doctorEscalationTriggers: ['Pus discharge or spreading rash.']
    }
  },

  // ==========================================
  // SECTION 5: HEAT EXHAUSTION & DEHYDRATION
  // ==========================================
  {
    id: 'electral-ors',
    name: 'WHO-Formula ORS (Electral / Prolyte)',
    genericName: 'Sodium Chloride + Potassium Chloride + Sodium Citrate + Anhydrous Dextrose IP',
    brandNames: ['Electral', 'Prolyte ORS', 'Walyte', 'Cipla ORS'],
    category: 'heat_dehydration',
    categoryLabel: 'Heat & Dehydration',
    categoryHindi: 'लू और डिहाइड्रेशन',
    dosageForm: 'sachet',
    dosageFormLabel: 'Electrolyte Powder Sachet',
    prescriptionStatus: 'otc',
    prescriptionLabel: 'First-Aid Essential (OTC)',
    usedFor: 'Replaces critical electrolytes and fluids in heat exhaustion, sunstroke, muscle cramps, and dehydration.',
    standardDose: 'Dissolve entire 21.8g packet in exactly 1 Litre of potable water. Sip continuously.',
    keyWarning: 'Mix ONLY in clean water. Never mix in milk, soda, or juice. Discard after 24 hours.',
    accentColor: '#0284c7',
    badgeBg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    detailedGuide: {
      mechanism: 'Reduced osmolarity formula (245 mOsm/L). Glucose cotransports sodium across intestinal enterocytes via SGLT1, driving rapid water absorption.',
      clinicalApplicationSteps: ['Measure 1 Liter clean water.', 'Empty entire packet.', 'Stir well.', 'Sip slowly while resting in shade.'],
      contraindications: ['Unconscious patient (choking risk — requires IV in ER).'],
      pediatricPregnancyNotice: '100% safe and lifesaving for all ages.',
      janAushadhiNote: '21.8g WHO ORS packet is ₹4–₹5 at Jan Aushadhi.',
      doctorEscalationTriggers: ['Confusion, delirium, hot dry skin with no sweat (Heatstroke — Call 112/108).']
    }
  },
  {
    id: 'glucon-d',
    name: 'Glucon-D Instant Energy Glucose',
    genericName: 'Dextrose Monohydrate IP + Calcium Phosphate + Vitamin D',
    brandNames: ['Glucon-D', 'Dabur Glucose-D', 'Glucovita'],
    category: 'heat_dehydration',
    categoryLabel: 'Heat & Dehydration',
    categoryHindi: 'ऊर्जा और ग्लूकोज',
    dosageForm: 'sachet',
    dosageFormLabel: 'Instant Glucose Powder',
    prescriptionStatus: 'otc',
    prescriptionLabel: 'Household OTC',
    usedFor: 'Immediate energy restoration for acute heat exhaustion, hypoglycemia, shivering, and post-trauma weakness.',
    standardDose: 'Mix 4 teaspoons (30g) in 200ml cold water and drink immediately.',
    keyWarning: 'Do NOT use as a replacement for ORS in severe electrolyte imbalance. Caution in diabetics.',
    accentColor: '#0ea5e9',
    badgeBg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    detailedGuide: {
      mechanism: 'Pure D-glucose is absorbed directly into the bloodstream through buccal and gastric mucosa, restoring cerebral glucose.',
      clinicalApplicationSteps: ['Dissolve in a glass of water.', 'Drink slowly.'],
      contraindications: ['Known severe diabetic ketoacidosis, unconsciousness.'],
      pediatricPregnancyNotice: 'Safe for children and adults.',
      janAushadhiNote: 'Standard grocery and pharmacy item throughout India.',
      doctorEscalationTriggers: ['Fainting or inability to stand.']
    }
  },

  // ==========================================
  // SECTION 6: EYE TRAUMA & IRRITATION
  // ==========================================
  {
    id: 'refresh-tears',
    name: 'Carboxymethylcellulose 0.5% Drops',
    genericName: 'Carboxymethylcellulose Sodium IP 0.5% w/v Ophthalmic Solution',
    brandNames: ['Refresh Tears', 'Tear Drops', 'Celluvisc', 'Lubrifresh'],
    category: 'eye_care',
    categoryLabel: 'Eye Irritation',
    categoryHindi: 'आंख की चोट और जलन',
    dosageForm: 'drops',
    dosageFormLabel: 'Sterile Lubricant Drops',
    prescriptionStatus: 'otc',
    prescriptionLabel: 'First-Aid OTC',
    usedFor: 'Flushes dust, chemical mist, sand, and eyelashes out of the eye without corneal irritation.',
    standardDose: 'Instill 1–2 drops into affected eye while blinking gently.',
    keyWarning: 'NEVER rub the eye. If an object is embedded in the cornea, do NOT touch; rush to eye doctor.',
    accentColor: '#06b6d4',
    badgeBg: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    detailedGuide: {
      mechanism: 'Bioadhesive polymer mimics natural tear film mucin, lubricating the ocular surface and floating out loose particles.',
      clinicalApplicationSteps: ['Pull down lower lid.', 'Instill 2 drops.', 'Blink gently for 30 seconds.'],
      contraindications: ['Penetrating eye injury with ruptured eyeball.'],
      pediatricPregnancyNotice: 'Safe across all ages.',
      janAushadhiNote: '10ml bottle costs ~₹20 at PMBJP.',
      doctorEscalationTriggers: ['Acute vision loss, pupil distortion, or blood inside the eye (hyphema).']
    }
  },
  {
    id: 'ciplox-eye-drops',
    name: 'Ciplox 0.3% Eye Drops (Ciprofloxacin)',
    genericName: 'Ciprofloxacin IP 0.3% w/v Ophthalmic Solution',
    brandNames: ['Ciplox Eye Drops', 'Zoxan', 'Cifran'],
    category: 'eye_care',
    categoryLabel: 'Eye Irritation',
    categoryHindi: 'आंख का संक्रमण',
    dosageForm: 'drops',
    dosageFormLabel: 'Antibacterial Ophthalmic Drops',
    prescriptionStatus: 'doctor_prescription',
    prescriptionLabel: 'Doctor / Clinic Use',
    usedFor: 'Prevents bacterial corneal ulceration and conjunctivitis following minor scratch or foreign body extraction.',
    standardDose: '1 drop in affected eye 3–4 times daily under doctor supervision.',
    keyWarning: 'Do NOT use steroid combination eye drops without slit-lamp examination by an ophthalmologist.',
    accentColor: '#06b6d4',
    badgeBg: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    detailedGuide: {
      mechanism: 'Fluoroquinolone that inhibits bacterial DNA gyrase and topoisomerase IV.',
      clinicalApplicationSteps: ['Instill under medical recommendation after foreign object is removed.'],
      contraindications: ['Viral or fungal eye infection.'],
      pediatricPregnancyNotice: 'Consult doctor for children.',
      janAushadhiNote: 'Costs ~₹12 at Jan Aushadhi.',
      doctorEscalationTriggers: ['White corneal spot, severe photophobia, or intense pain.']
    }
  },

  // ==========================================
  // SECTION 7: ANIMAL BITES & VENOM PROTOCOLS
  // ==========================================
  {
    id: 'rabies-pep',
    name: 'Anti-Rabies Vaccine (ARV) IP',
    genericName: 'Purified Vero Cell / Chick Embryo Rabies Vaccine IP (0.5ml / 1ml IM/ID)',
    brandNames: ['Rabivax-S', 'Abhayrab', 'Verorab', 'Vaxirab'],
    category: 'emergency_bites',
    categoryLabel: 'Rabies & Snakebite Protocol',
    categoryHindi: 'कुत्ते का काटना (रेबीज)',
    dosageForm: 'injection',
    dosageFormLabel: 'Emergency Biological Vaccine',
    prescriptionStatus: 'emergency_clinical',
    prescriptionLabel: 'Hospital Mandatory',
    usedFor: '100% mandatory post-exposure prophylaxis for Category II & III dog, cat, monkey, or bat bites and scratches.',
    standardDose: 'Given at Government Hospital on Days 0, 3, 7, and 28. Category III also requires RIG.',
    keyWarning: 'FIRST 15 MINUTES: Wash wound under running water with soap for 15 full minutes! Never apply chili, turmeric, or tight bandages.',
    accentColor: '#dc2626',
    badgeBg: 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800',
    detailedGuide: {
      mechanism: 'Inactivated viral antigen induces neutralizing antibody titers that destroy the rabies virus before it enters peripheral nerve axons.',
      clinicalApplicationSteps: [
        'STEP 1: Wash wound vigorously under continuous running tap water with soap for 15 FULL MINUTES.',
        'STEP 2: Apply Povidone-Iodine antiseptic. Do NOT stitch.',
        'STEP 3: Rush to Government Hospital / PHC for Day 0 vaccination.',
        'STEP 4: Complete all 4 doses (Day 0, 3, 7, 28) without missing a single date. Rabies is 100% fatal once symptoms appear.'
      ],
      contraindications: ['NO CONTRAINDICATIONS EXIST. Lifesaving in all humans.'],
      pediatricPregnancyNotice: '100% mandatory and safe in pregnancy.',
      janAushadhiNote: 'Provided completely FREE at all Indian Government District Hospitals and AIIMS.',
      doctorEscalationTriggers: ['ANY scratch, bite, or saliva contact from stray animals.']
    }
  },
  {
    id: 'anti-snake-venom',
    name: 'Polyvalent Anti-Snake Venom (ASV)',
    genericName: 'Purified Equine Polyvalent Antivenom Serum IP (Lyophilized / Liquid)',
    brandNames: ['Bharat Serums ASV', 'Haffkine ASV', 'Serum Institute ASV', 'Vins ASV'],
    category: 'emergency_bites',
    categoryLabel: 'Rabies & Snakebite Protocol',
    categoryHindi: 'सांप का काटना (आपातकालीन)',
    dosageForm: 'injection',
    dosageFormLabel: 'Intravenous Hospital ICU Infusion',
    prescriptionStatus: 'emergency_clinical',
    prescriptionLabel: 'Hospital ICU Only',
    usedFor: 'Neutralizes lethal venom from the Indian Big Four snakes: Russell\'s Viper, Saw-scaled Viper, Common Krait, and Indian Cobra.',
    standardDose: 'Administered strictly IV in hospital ICU with adrenaline premedication ready.',
    keyWarning: 'CRITICAL: NO HOME MEDICINES OR HERBS WORK! Never cut, suck venom, tie tight tourniquets, or apply ice. Rush to hospital immediately.',
    accentColor: '#dc2626',
    badgeBg: 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800',
    detailedGuide: {
      mechanism: 'Equine F(ab\')₂ fragments bind and neutralize circulating neurotoxins, hemotoxins, and cytotoxins.',
      clinicalApplicationSteps: [
        'FIRST AID: Keep victim completely calm and still. Movement accelerates venom spread.',
        'Immobilize bitten limb with a splint at heart level.',
        'Remove rings and tight anklets before swelling starts.',
        'Transport immediately to hospital with ventilator and ASV support (Call 112/108).'
      ],
      contraindications: ['Strictly contraindicated for home administration.'],
      pediatricPregnancyNotice: 'Children require the SAME full initial starting dose as adults.',
      janAushadhiNote: 'Stocked at all Government District Hospitals and Medical Colleges across India.',
      doctorEscalationTriggers: ['Immediate Level 1 Emergency for any venomous snakebite (Call 112 / 108).']
    }
  },

  // ==========================================
  // SECTION 8: POST-TRAUMA SHOCK & ACIDITY
  // ==========================================
  {
    id: 'digene-gelusil',
    name: 'Digene / Gelusil Antacid',
    genericName: 'Magaldrate 400 mg + Simethicone 20 mg IP Suspension / Chewable Tablet',
    brandNames: ['Digene', 'Gelusil', 'Mucaine Gel', 'Polycrol'],
    category: 'trauma_shock',
    categoryLabel: 'Trauma Shock & Acidity',
    categoryHindi: 'घबराहट और एसिडिटी',
    dosageForm: 'solution',
    dosageFormLabel: 'Oral Antacid Suspension',
    prescriptionStatus: 'otc',
    prescriptionLabel: 'First-Aid OTC',
    usedFor: 'Rapidly neutralizes acute stomach acid burning, nervous reflux, and stress gastritis following accident trauma shock.',
    standardDose: '1–2 teaspoons (5–10 ml) or chew 1–2 tablets after meals or when burning occurs.',
    keyWarning: 'Space 2 hours apart from other oral medications to prevent binding absorption issues.',
    accentColor: '#4f46e5',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    detailedGuide: {
      mechanism: 'Magaldrate buffers gastric hydrochloric acid to pH 3–5 without rebound acid hypersecretion; Simethicone dissipates gas bubbles.',
      clinicalApplicationSteps: ['Shake bottle well.', 'Sip 2 teaspoons.', 'Do not drink water immediately to allow mucosal coating.'],
      contraindications: ['Severe renal impairment (magnesium accumulation).'],
      pediatricPregnancyNotice: 'Safe for pregnancy heartburn.',
      janAushadhiNote: 'Antacid gel is ₹15 at Jan Aushadhi.',
      doctorEscalationTriggers: ['Persistent vomiting, black stools, or severe abdominal rigidity.']
    }
  },
  {
    id: 'ondansetron-4',
    name: 'Ondansetron 4 mg (Emeset / Vomikind)',
    genericName: 'Ondansetron Hydrochloride IP 4 mg Fast-Dissolving Tablet',
    brandNames: ['Emeset 4', 'Vomikind MD 4', 'Ondem 4', 'Zofran'],
    category: 'trauma_shock',
    categoryLabel: 'Trauma Shock & Nausea',
    categoryHindi: 'मतली और उल्टी',
    dosageForm: 'tablet',
    dosageFormLabel: 'Orally Disintegrating Tablet (ODT)',
    prescriptionStatus: 'doctor_prescription',
    prescriptionLabel: 'Clinic / Doctor Prescribed',
    usedFor: 'Controls intense post-concussion nausea, shock vomiting, and acute dizziness after road trauma or head injury.',
    standardDose: 'Adults: 4 mg placed on tongue to dissolve instantly without water.',
    keyWarning: 'Persistent vomiting after a head injury is a red-flag sign of intracranial pressure; requires immediate CT scan.',
    accentColor: '#4f46e5',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    detailedGuide: {
      mechanism: 'Selective 5-HT3 serotonin receptor antagonist in the chemoreceptor trigger zone (CTZ) and gastrointestinal vagal nerve terminals.',
      clinicalApplicationSteps: ['Place MD tablet on tongue. Dissolves within seconds.'],
      contraindications: ['Congenital long QT syndrome.'],
      pediatricPregnancyNotice: 'Widely used in pregnancy hyperemesis under doctor guidance.',
      janAushadhiNote: 'Ondansetron 4mg strip costs ~₹6–₹10 at Jan Aushadhi.',
      doctorEscalationTriggers: ['Repeated projectile vomiting after head trauma (rush to ER).']
    }
  }
];

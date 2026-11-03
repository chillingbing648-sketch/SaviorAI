export type MedicationCategory =
  | 'burns'
  | 'cuts_wounds'
  | 'sprains_trauma'
  | 'allergies_bites'
  | 'heat_dehydration'
  | 'eye_care'
  | 'emergency_bites';

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

export const MEDICATION_CATEGORIES: Array<{
  id: MedicationCategory | 'all';
  label: string;
  hindiLabel: string;
  iconName: string;
}> = [
  { id: 'all', label: 'All Medications', hindiLabel: 'सभी दवाइयाँ', iconName: 'Pill' },
  { id: 'burns', label: 'Burns & Scalds', hindiLabel: 'जलना और छाले', iconName: 'Flame' },
  { id: 'cuts_wounds', label: 'Cuts & Wounds', hindiLabel: 'कट और घाव', iconName: 'Scissors' },
  { id: 'sprains_trauma', label: 'Sprains & Joint Trauma', hindiLabel: 'मोच और चोट', iconName: 'Activity' },
  { id: 'allergies_bites', label: 'Insect Stings & Allergies', hindiLabel: 'कीड़े का डंक और एलर्जी', iconName: 'ShieldAlert' },
  { id: 'heat_dehydration', label: 'Heat & Dehydration', hindiLabel: 'लू और पानी की कमी', iconName: 'Droplets' },
  { id: 'eye_care', label: 'Eye Irritation & Dust', hindiLabel: 'आंख की चोट', iconName: 'Eye' },
  { id: 'emergency_bites', label: 'Rabies & Snakebite Protocol', hindiLabel: 'सांप और जानवर का काटना', iconName: 'AlertOctagon' }
];

export const MEDICATIONS_DATABASE: MedicationItem[] = [
  // 1. Silver Sulfadiazine
  {
    id: 'silver-sulfadiazine',
    name: 'Silver Sulfadiazine 1% Cream',
    genericName: 'Silver Sulfadiazine IP 1.0% w/w',
    brandNames: ['Silverex', 'Burnol Silver', 'Silvazine', 'Dermazin'],
    category: 'burns',
    categoryLabel: 'Burns & Scalds',
    dosageForm: 'ointment',
    dosageFormLabel: 'Topical Antibacterial Cream',
    prescriptionStatus: 'otc',
    prescriptionLabel: 'First-Aid Essential (OTC)',
    usedFor: 'Prevents bacterial colonization and wound sepsis on 2nd-degree minor partial-thickness burns.',
    standardDose: 'Apply a sterile 1–2 mm layer directly over the cooled burn twice daily.',
    keyWarning: 'Never apply to facial burns, open raw blisters in premature infants, or people with sulfa allergies.',
    accentColor: '#d97706',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    detailedGuide: {
      mechanism: 'Releases antimicrobial silver ions that bind bacterial cell walls and DNA, preventing broad-spectrum Gram-negative and Gram-positive sepsis without causing severe tissue maceration.',
      clinicalApplicationSteps: [
        'Irrigate the burn under cool, gently running tap water (15–25°C) for a full 20 minutes first.',
        'Gently pat the surrounding dry with sterile lint-free gauze. Do not burst intact blisters.',
        'With sterile gloves or a clean spatula, apply a generous 1–2 mm layer of cream over the burned area.',
        'Cover lightly with non-adherent sterile dressing (e.g., paraffin gauze) and secure loosely with a cotton roller bandage.'
      ],
      contraindications: [
        'Do NOT use if the patient has a confirmed Sulfa drug hypersensitivity.',
        'Do NOT use in infants under 2 months of age (risk of kernicterus).',
        'Do NOT apply near the eyes or mouth (risk of ocular toxicity).',
        'Do NOT use on necrotic third-degree burns requiring immediate surgical debridement.'
      ],
      pediatricPregnancyNotice: 'Contraindicated in pregnancy near term and in nursing mothers with infants under 2 months.',
      janAushadhiNote: 'Available at all Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP) centers as "Silver Sulfadiazine Cream IP 1%" at nominal cost (₹15–₹25 per 50g tube).',
      doctorEscalationTriggers: [
        'Burn covers an area larger than the patient\'s palm (approx >1% Total Body Surface Area).',
        'Burn involves hands, feet, face, groin, or major joint surfaces.',
        'Surrounding skin shows spreading red streaks, foul odor, or milky pus discharge.'
      ]
    }
  },

  // 2. Pure Aloe Vera Gel
  {
    id: 'aloe-vera-gel',
    name: 'Medical-Grade Aloe Vera Gel (99%)',
    genericName: 'Purified Aloe Barbadensis Leaf Extract',
    brandNames: ['Vaseline Aloe Soothing Gel', 'Patanjali Aloe Vera', 'Nature Republic Gel'],
    category: 'burns',
    categoryLabel: 'Burns & Scalds',
    dosageForm: 'ointment',
    dosageFormLabel: 'Topical Soothing Hydrogel',
    prescriptionStatus: 'otc',
    prescriptionLabel: 'First-Aid OTC',
    usedFor: 'Cools thermal stinging, hydrates dermis, and speeds recovery in 1st-degree superficial heat & sunburns.',
    standardDose: 'Smooth gently over unbroken, sun-reddened skin 3 to 4 times daily as needed.',
    keyWarning: 'Use only on intact superficial burns. Never smear over broken skin, open blisters, or weeping wounds.',
    accentColor: '#059669',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    detailedGuide: {
      mechanism: 'Provides natural acemannan polysaccharides, glycoproteins, and water-dense hydration that stimulate microvascular perfusion and suppress bradykinin-mediated inflammatory pain.',
      clinicalApplicationSteps: [
        'Cool the heated area with cold compresses or cool tap water for 10 minutes.',
        'Pat completely dry with clean cotton cloth.',
        'Spread a thin layer of pure medical-grade gel without vigorous friction.',
        'Leave uncovered to allow convective cooling and dermal absorption.'
      ],
      contraindications: [
        'Do NOT apply to open cuts, bleeding abrasions, or raw unroofed blisters.',
        'Do NOT use scented cosmetic gels containing high alcohol or synthetic fragrances.'
      ],
      pediatricPregnancyNotice: 'Safe for children above 6 months and pregnant individuals when applied topically to intact skin.',
      janAushadhiNote: 'Widely available in pharmacies and Jan Aushadhi stores as pure soothing hydrogel.',
      doctorEscalationTriggers: [
        'Development of extensive blistering, high fever, shivering, or signs of heat exhaustion.',
        'Severe intractable stinging pain that does not subside after 2 hours of cooling.'
      ]
    }
  },

  // 3. Povidone-Iodine 5% / 10%
  {
    id: 'povidone-iodine',
    name: 'Povidone-Iodine Solution (5% / 10%)',
    genericName: 'Povidone-Iodine IP 5% w/v & 10% w/v',
    brandNames: ['Betadine 5%/10%', 'Cipladine', 'Wokadine', 'Povicare'],
    category: 'cuts_wounds',
    categoryLabel: 'Cuts & Wounds',
    dosageForm: 'solution',
    dosageFormLabel: 'Broad-Spectrum Antiseptic Liquid',
    prescriptionStatus: 'otc',
    prescriptionLabel: 'First-Aid Essential (OTC)',
    usedFor: 'Antiseptic skin prep and infection prophylaxis for acute minor scrapes, grazed cuts, and skin lacerations.',
    standardDose: 'Apply with sterile cotton swab from the center of the wound outward once or twice daily.',
    keyWarning: 'Do not pour into deep puncture cavities or eyes. Discontinue if persistent rash or swelling occurs.',
    accentColor: '#92400e',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    detailedGuide: {
      mechanism: 'PVP-I slowly releases free elemental iodine (I₂), which rapidly oxidizes bacterial protein thiol groups, cell wall lipids, and microbial enzymes across Gram+, Gram-, and fungal pathogens.',
      clinicalApplicationSteps: [
        'Wash the wound under running potable water or normal saline for 2–3 minutes to rinse particulate grit.',
        'Apply mild pressure with sterile gauze until active capillary bleeding ceases.',
        'Soak a sterile cotton swab or gauze in Povidone-Iodine 5% or 10%.',
        'Dab gently around the wound margins moving outward. Allow to air-dry for 60 seconds to maximize antiseptic activity.',
        'Dress with a sterile adhesive bandage or dry non-stick gauze pad.'
      ],
      contraindications: [
        'Do NOT use if allergic to iodine or radiopaque contrast media.',
        'Do NOT use in patients with active hyperthyroidism or Hashimoto\'s thyroiditis over large body surface areas.',
        'Do NOT pour directly onto exposed tendons, nerves, or internal organ cavities.'
      ],
      pediatricPregnancyNotice: 'Avoid prolonged daily application over extensive body surface areas in infants and pregnant individuals (potential transdermal iodine thyroid absorption).',
      janAushadhiNote: 'Standard Jan Aushadhi item: "Povidone-Iodine Solution 5% / 10% 100ml" priced at ~₹18–₹30.',
      doctorEscalationTriggers: [
        'Laceration is deeper than 0.5 cm, gaping wide, or shows yellowish subcutaneous fat or muscle.',
        'Wound continues spurting or heavily oozing after 10 minutes of direct, uninterrupted manual pressure.',
        'Wound was caused by a dirty animal bite or deeply penetrating metallic nail.'
      ]
    }
  },

  // 4. Triple Antibiotic Ointment
  {
    id: 'triple-antibiotic',
    name: 'Triple Antibiotic Ointment (Neosporin)',
    genericName: 'Neomycin Sulphate + Polymyxin B + Bacitracin Zinc',
    brandNames: ['Neosporin Ointment', 'Nebasulf', 'Polymyxin Ointment'],
    category: 'cuts_wounds',
    categoryLabel: 'Cuts & Wounds',
    dosageForm: 'ointment',
    dosageFormLabel: 'Topical Antibiotic Salve',
    prescriptionStatus: 'otc',
    prescriptionLabel: 'First-Aid OTC',
    usedFor: 'Maintains moist wound environment and stops surface infection in minor cuts, scrapes, and abrasions.',
    standardDose: 'Apply a small pea-sized amount over the clean abrasion 1 to 3 times daily.',
    keyWarning: 'Do not use for more than 7 consecutive days. Discontinue immediately if itching or contact dermatitis develops.',
    accentColor: '#0284c7',
    badgeBg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    detailedGuide: {
      mechanism: 'Combines three distinct antimicrobials: Bacitracin disrupts bacterial cell wall synthesis; Neomycin binds the 30S ribosomal subunit inhibiting protein synthesis; Polymyxin B disrupts cell membrane integrity.',
      clinicalApplicationSteps: [
        'Clean wound bed gently with normal saline and blot dry.',
        'Apply a small pea-sized dab using a clean cotton applicator tip.',
        'Spread in a micro-thin film over the abraded surface.',
        'Cover with a breathable adhesive dressing to preserve moisture balance and prevent scabbing over dirt.'
      ],
      contraindications: [
        'Known contact allergy to aminoglycosides (Neomycin is a known frequent topical contact allergen).',
        'Large deep puncture wounds or severe animal bites requiring systemic antibiotics.'
      ],
      pediatricPregnancyNotice: 'Safe for minor localized use in children over 2 years of age.',
      janAushadhiNote: 'Available as "Neomycin and Polymyxin B Ointment IP" at PMBJP centers.',
      doctorEscalationTriggers: [
        'Redness, throbbing warmth, or swelling extends more than 2 cm beyond the wound edge.',
        'Fever develops within 48 hours of initial injury.'
      ]
    }
  },

  // 5. Sterile Normal Saline 0.9%
  {
    id: 'normal-saline',
    name: 'Sterile Normal Saline 0.9% (Wound Wash)',
    genericName: 'Sodium Chloride IP 0.9% w/v Sterile Solution',
    brandNames: ['Wound Wash Saline', 'Nirma Saline', 'Baxter 0.9% NaCl'],
    category: 'cuts_wounds',
    categoryLabel: 'Cuts & Wounds',
    dosageForm: 'solution',
    dosageFormLabel: 'Isotonic Wound Irrigation Solution',
    prescriptionStatus: 'otc',
    prescriptionLabel: 'First-Aid Essential (OTC)',
    usedFor: 'Gold-standard gentle irrigation to wash road debris, dust, and gravel out of fresh wounds without cellular damage.',
    standardDose: 'Flush copiously over the fresh injury using gentle gravitational flow or clean syringe stream.',
    keyWarning: 'Use only unopened sterile bottles or freshly opened ampoules. Discard leftover unsealed solution after 24 hours.',
    accentColor: '#0d7a5f',
    badgeBg: 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    detailedGuide: {
      mechanism: 'Isotonic osmotic concentration (308 mOsm/L) perfectly matches human physiological extracellular fluid, preventing cell lysis, stinging pain, or delayed wound closure caused by harsh chemical antiseptics.',
      clinicalApplicationSteps: [
        'Position the injured limb over a clean basin or sink.',
        'Direct a gentle stream of 0.9% saline across the wound bed from high to low.',
        'Irrigate thoroughly until all macroscopic road dust, grit, and loose fibrinous debris are visibly cleared.',
        'Do not scrub aggressively with rough gauze unless removing embedded loose sand.'
      ],
      contraindications: [
        'None for external irrigation. Non-allergenic, non-toxic, and biocompatible.'
      ],
      pediatricPregnancyNotice: '100% safe across all age groups, pregnancy, and neonates.',
      janAushadhiNote: 'Available at all PMBJP pharmacies as "Sodium Chloride 0.9% IV/Irrigation 500ml" for ₹10–₹15.',
      doctorEscalationTriggers: [
        'Foreign body (e.g., shattered glass, deep metal sliver, tree bark) remains firmly embedded in wound tissue.'
      ]
    }
  },

  // 6. Tetanus Toxoid Booster
  {
    id: 'tetanus-toxoid',
    name: 'Tetanus Toxoid (TT) Prophylaxis Injection',
    genericName: 'Tetanus Toxoid Adsorbed Vaccine IP (0.5 ml IM)',
    brandNames: ['Tetvac', 'Betatetanus', 'Serum Institute TT Booster'],
    category: 'cuts_wounds',
    categoryLabel: 'Cuts & Wounds',
    dosageForm: 'injection',
    dosageFormLabel: 'Intramuscular Prophylactic Vaccine',
    prescriptionStatus: 'doctor_prescription',
    prescriptionLabel: 'Doctor / Clinic Administration',
    usedFor: 'Essential protection against Clostridium tetani neurotoxin for contaminated, rusty, or deep puncture wounds.',
    standardDose: 'Single 0.5 ml intramuscular injection into deltoid muscle within 24–48 hours of injury.',
    keyWarning: 'Do NOT delay beyond 48 hours. Must be given in a clinic/hospital setting under trained medical staff.',
    accentColor: '#dc2626',
    badgeBg: 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800',
    detailedGuide: {
      mechanism: 'Formalin-inactivated tetanospasmin toxoid adsorbed onto aluminium hydroxide stimulates host B-cells to generate high neutralizing antitoxin titers, neutralizing deadly synaptic motor neurotoxins.',
      clinicalApplicationSteps: [
        'Check immunization history: Was the last tetanus booster received within the last 5 years?',
        'If clean minor wound and last booster was <10 years ago: Booster is generally not needed.',
        'If dirty, metallic, rusted, soil-contaminated, or deep puncture wound and booster was >5 years ago: Receive 0.5ml booster immediately.',
        'If unimmunized or uncertain: Requires Tetanus Immunoglobulin (TIG) + TT vaccination series.'
      ],
      contraindications: [
        'Severe acute anaphylactic reaction to previous tetanus vaccination dose.'
      ],
      pediatricPregnancyNotice: 'Standard routine protocol during pregnancy and childhood. Safe and lifesaving.',
      janAushadhiNote: 'Free or nominally priced (₹5–₹15) at all Indian Government Primary Health Centres (PHC), Civil Hospitals, and Jan Aushadhi pharmacies.',
      doctorEscalationTriggers: [
        'Any deep nail puncture into the foot, agricultural soil contamination, or crushing injury.'
      ]
    }
  },

  // 7. Diclofenac Sodium Gel
  {
    id: 'diclofenac-gel',
    name: 'Diclofenac Sodium 1% / 2% Gel',
    genericName: 'Diclofenac Diethylamine IP eq. to Diclofenac Sodium 1.16% w/w',
    brandNames: ['Volini', 'Omnigel', 'Voveran Emulgel', 'Moov Advance'],
    category: 'sprains_trauma',
    categoryLabel: 'Sprains & Joint Trauma',
    dosageForm: 'ointment',
    dosageFormLabel: 'Topical NSAID Pain Relief Gel',
    prescriptionStatus: 'otc',
    prescriptionLabel: 'First-Aid OTC',
    usedFor: 'Targeted localized pain relief and swelling reduction for acute ankle sprains, muscle strains, and blunt joint contusions.',
    standardDose: 'Gently massage a 2–4 cm ribbon over intact skin at the sprained joint 3 times daily.',
    keyWarning: 'Do NOT apply on broken skin, cuts, or in combination with electrical heating pads (burn risk).',
    accentColor: '#d97706',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    detailedGuide: {
      mechanism: 'Inhibits localized cyclooxygenase (COX-1 & COX-2) enzymes in periarticular soft tissue, reducing inflammatory prostaglandin synthesis without high systemic gastric NSAID exposure.',
      clinicalApplicationSteps: [
        'Rest the injured joint and apply cold therapy (R.I.C.E. protocol) for the first 24–48 hours.',
        'Apply gel over the tender ligamentous attachment with gentle circular motions until absorbed.',
        'Wash hands thoroughly after application.',
        'Pair with elastic crepe bandage compression for mechanical stability.'
      ],
      contraindications: [
        'Do NOT apply over open lacerations, scrapes, rashes, or infected dermatoses.',
        'Do NOT wrap under airtight plastic occlusive wraps or hot heating pads.'
      ],
      pediatricPregnancyNotice: 'Use with caution in the third trimester of pregnancy (risk of premature closure of fetal ductus arteriosus).',
      janAushadhiNote: 'PMBJP stores stock "Diclofenac Gel IP 30g" for ~₹12–₹18.',
      doctorEscalationTriggers: [
        'Inability to bear weight for 4 consecutive steps immediately following injury (Ottawa Ankle Rule trigger).',
        'Visible bone deformity, rapid massive purple ecchymosis, or acute joint instability.'
      ]
    }
  },

  // 8. Paracetamol / Acetaminophen
  {
    id: 'paracetamol',
    name: 'Paracetamol 500 mg / 650 mg',
    genericName: 'Acetaminophen / Paracetamol IP 500mg or 650mg Tablet',
    brandNames: ['Dolo 650', 'Calpol 500/650', 'Crocin', 'Pacimol'],
    category: 'sprains_trauma',
    categoryLabel: 'Sprains & Joint Trauma',
    dosageForm: 'tablet',
    dosageFormLabel: 'Oral Analgesic & Antipyretic',
    prescriptionStatus: 'otc',
    prescriptionLabel: 'First-Aid Essential (OTC)',
    usedFor: 'First-line oral pain relief for blunt trauma, headache from concussion check, joint sprains, and minor fractures.',
    standardDose: 'Adults: 500–650 mg every 6–8 hours as needed. Maximum 3,000 mg in 24 hours.',
    keyWarning: 'Strictly avoid exceeding 4,000 mg/day (acute fatal hepatotoxicity risk). Never combine with alcohol or duplicate cold syrups.',
    accentColor: '#0d7a5f',
    badgeBg: 'bg-teal-50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    detailedGuide: {
      mechanism: 'Centrally acting analgesic that elevates the pain threshold by inhibiting central prostaglandin synthesis and acting on serotonergic descending pain pathways; lacks significant peripheral anti-platelet effect (safe in bleeding risk).',
      clinicalApplicationSteps: [
        'Take with a sip of water, with or without meals.',
        'Space doses at least 4 to 6 hours apart.',
        'Always read labels of combination cold/cough medications to prevent accidental double-dosing.',
        'Do NOT consume alcohol while taking Paracetamol.'
      ],
      contraindications: [
        'Severe active hepatic impairment or acute liver failure.',
        'Known paracetamol hypersensitivity.'
      ],
      pediatricPregnancyNotice: 'Considered the safest first-line analgesic during pregnancy and pediatric fever/trauma (use weight-based pediatric liquid dosing: 15 mg/kg).',
      janAushadhiNote: 'Widely stocked in Jan Aushadhi: "Paracetamol 650mg 10 Tablets" costs just ₹6–₹10.',
      doctorEscalationTriggers: [
        'Pain remains severe (>7/10) despite proper dosing.',
        'Signs of acute accidental overdose (nausea, right upper abdominal pain, vomiting) require immediate ER rush for N-acetylcysteine (NAC).'
      ]
    }
  },

  // 9. Ibuprofen 400 mg
  {
    id: 'ibuprofen',
    name: 'Ibuprofen 400 mg',
    genericName: 'Ibuprofen IP 400mg Film-Coated Tablet',
    brandNames: ['Brufen 400', 'Ibugesic', 'Combiflam (Ibu+Para)', 'Advil'],
    category: 'sprains_trauma',
    categoryLabel: 'Sprains & Joint Trauma',
    dosageForm: 'tablet',
    dosageFormLabel: 'Oral Non-Steroidal Anti-Inflammatory (NSAID)',
    prescriptionStatus: 'otc',
    prescriptionLabel: 'First-Aid OTC (With Food)',
    usedFor: 'Reduces severe inflammatory swelling, ligament pain, and throbbing post-traumatic joint edema.',
    standardDose: 'Adults: 400 mg every 8 hours strictly after a meal with a full glass of water. Max 1,200 mg/day OTC.',
    keyWarning: 'ALWAYS take after meals. Never take if you have stomach ulcers, asthma triggered by aspirin, or suspected dengue.',
    accentColor: '#d97706',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    detailedGuide: {
      mechanism: 'Reversible non-selective inhibition of COX-1 and COX-2 enzymes, suppressing synthesis of inflammatory prostaglandins and thromboxane, providing potent anti-inflammatory and anti-swelling action.',
      clinicalApplicationSteps: [
        'Must always be swallowed whole after a full meal or glass of milk.',
        'Drink a full glass of water to prevent esophageal irritation.',
        'Limit use to the acute trauma phase (3 to 5 days maximum without doctor review).'
      ],
      contraindications: [
        'Active peptic ulcer disease, gastric bleeding, or history of gastrointestinal hemorrhage.',
        'Severe renal impairment or dehydration (causes acute kidney injury).',
        'Suspected Dengue Fever or bleeding diathesis (inhibits platelet aggregation, increasing hemorrhage danger).'
      ],
      pediatricPregnancyNotice: 'Contraindicated in the third trimester of pregnancy. For pediatric dosing, consult a pediatrician (10 mg/kg).',
      janAushadhiNote: 'Available at PMBJP centers as "Ibuprofen 400mg Tablets" at approx ₹6 per strip of 10.',
      doctorEscalationTriggers: [
        'Dark black tarry stools (melena), severe epigastric burning, or vomiting coffee-ground emesis.',
        'Shortness of breath, facial wheals, or wheezing after ingestion.'
      ]
    }
  },

  // 10. Calamine Lotion
  {
    id: 'calamine-lotion',
    name: 'Calamine Lotion 8% (Lacto Calamine)',
    genericName: 'Calamine (Zinc Oxide + Ferric Oxide) + Zinc Carbonate Suspension',
    brandNames: ['Lacto Calamine', 'Caladryl', 'Calmin Lotion'],
    category: 'allergies_bites',
    categoryLabel: 'Insect Stings & Allergies',
    dosageForm: 'solution',
    dosageFormLabel: 'Topical Antipruritic Soothing Lotion',
    prescriptionStatus: 'otc',
    prescriptionLabel: 'First-Aid Essential (OTC)',
    usedFor: 'Soothes persistent itching, mosquito/bee bite redness, sunburn irritation, and allergic contact rashes.',
    standardDose: 'Shake bottle thoroughly; dab onto itchy lesions with cotton ball 3–4 times daily.',
    keyWarning: 'For external use only. Keep away from eyes and mucous membranes. Do not apply to weeping blister beds.',
    accentColor: '#db2777',
    badgeBg: 'bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-pink-300 border-pink-200 dark:border-pink-800',
    detailedGuide: {
      mechanism: 'Zinc oxide acts as a mild protective astringent and antiseptic, evaporating to produce an immediate local cooling sensation that distracts sensory C-fibers and stops histamine pruritus.',
      clinicalApplicationSteps: [
        'Gently wash bite or sting area with mild soap and water.',
        'Shake the bottle vigorously before every use.',
        'Pour a small amount on sterile cotton pad.',
        'Dab lightly over itching hives or insect bite bumps and let it dry to a fine soothing powder film.'
      ],
      contraindications: [
        'Open weeping wounds, raw burns, or infected pustules.'
      ],
      pediatricPregnancyNotice: 'Safe and gentle for children, infants over 6 months, and pregnant individuals.',
      janAushadhiNote: 'Jan Aushadhi stocks "Calamine Lotion IP 100ml" for ₹25–₹35.',
      doctorEscalationTriggers: [
        'Widespread hives accompanied by lip swelling, throat tightness, or difficulty breathing (Anaphylaxis Emergency — Call 112).'
      ]
    }
  },

  // 11. Cetirizine 10 mg
  {
    id: 'cetirizine',
    name: 'Cetirizine Hydrochloride 10 mg',
    genericName: 'Cetirizine HCl IP 10mg Film-Coated Tablet',
    brandNames: ['Cetzine', 'Alerid', 'Okacet', 'Zyrtec'],
    category: 'allergies_bites',
    categoryLabel: 'Insect Stings & Allergies',
    dosageForm: 'tablet',
    dosageFormLabel: 'Oral 2nd-Generation Antihistamine',
    prescriptionStatus: 'otc',
    prescriptionLabel: 'First-Aid Essential (OTC)',
    usedFor: 'Rapidly relieves swelling, intense itching, wheals, and localized hives caused by insect stings, bites, or allergen contact.',
    standardDose: 'Adults: 10 mg (one tablet) once daily with water. Preferred at bedtime.',
    keyWarning: 'May cause mild drowsiness in some individuals. Do not drive or operate heavy machinery after taking.',
    accentColor: '#7c3aed',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800',
    detailedGuide: {
      mechanism: 'Selective peripheral H1-receptor antagonist that blocks histamine binding on vascular endothelium, halting capillary leakage, localized edema, and eosinophil migration.',
      clinicalApplicationSteps: [
        'Swallow one 10 mg tablet with a glass of water.',
        'Takes effect within 20–60 minutes and lasts for 24 continuous hours.',
        'If drowsy, rest in a cool quiet room.'
      ],
      contraindications: [
        'End-stage renal disease (CrCl < 10 ml/min).',
        'Severe known hypersensitivity to cetirizine or hydroxyzine.'
      ],
      pediatricPregnancyNotice: 'Category B in pregnancy (frequently recommended by obstetricians). Pediatric syrup (5mg/5ml) available for children over 2 years.',
      janAushadhiNote: 'Jan Aushadhi PMBJP price for Cetirizine 10mg (10 tabs) is just ₹4–₹8.',
      doctorEscalationTriggers: [
        'Swelling spreads to lips, tongue, or eyes, or is accompanied by hoarseness, dizziness, or wheezing (Call 112 Emergency immediately).'
      ]
    }
  },

  // 12. WHO-Standard Oral Rehydration Salts (ORS)
  {
    id: 'who-ors',
    name: 'WHO-Standard Oral Rehydration Salts (ORS)',
    genericName: 'Sodium Chloride + Potassium Chloride + Sodium Citrate + Anhydrous Dextrose IP',
    brandNames: ['Electral (FDC)', 'Prolyte ORS', 'Walyte', 'Cipla ORS'],
    category: 'heat_dehydration',
    categoryLabel: 'Heat & Dehydration',
    dosageForm: 'sachet',
    dosageFormLabel: 'Osmolar Electrolyte Powder Sachet',
    prescriptionStatus: 'otc',
    prescriptionLabel: 'First-Aid Essential (OTC)',
    usedFor: 'Replaces crucial sodium, potassium, and fluids in heat cramps, heat exhaustion, high-heat work, and shock dehydration.',
    standardDose: 'Dissolve entire 21.8g packet in exactly 1 Litre of clean drinking water. Sip continuously.',
    keyWarning: 'NEVER dissolve in milk, soup, or fruit juice. Mix ONLY with exactly 1L clean water. Do not boil prepared solution.',
    accentColor: '#0284c7',
    badgeBg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    detailedGuide: {
      mechanism: 'Reduced-osmolarity formula (245 mOsm/L). Glucose actively cotransports sodium across intestinal brush-border enterocytes via SGLT1 transport proteins, driving massive osmotic water absorption even in acute dehydration.',
      clinicalApplicationSteps: [
        'Measure exactly 1 Litre (1,000 ml) of potable water in a clean vessel.',
        'Cut open the entire sachet of WHO-formula ORS and pour all powder into the water.',
        'Stir well with a clean spoon until the powder completely dissolves into a clear solution.',
        'Sip slowly, half a cup every 15 minutes, while resting in a cool, shaded environment.',
        'Discard any unused prepared solution after 24 hours (bacterial proliferation risk).'
      ],
      contraindications: [
        'Unconscious patient or inability to swallow (choking aspiration hazard — requires IV fluids in ER).',
        'Intestinal obstruction or intractable continuous projectile vomiting.'
      ],
      pediatricPregnancyNotice: '100% safe, lifesaving, and universally recommended for all ages, infants, and pregnant mothers.',
      janAushadhiNote: 'PMBJP stores sell "Oral Rehydration Salts IP (WHO Formula) 21.8g Sachet" for only ₹4–₹6.',
      doctorEscalationTriggers: [
        'Confusion, delirium, cessation of sweating, or core body temperature >104°F (40°C) — Heat Stroke Emergency (Call 112/108).'
      ]
    }
  },

  // 13. Sterile Eye Drops (Carboxymethylcellulose)
  {
    id: 'eye-lubricant',
    name: 'Carboxymethylcellulose 0.5% Eye Drops',
    genericName: 'Carboxymethylcellulose Sodium IP 0.5% w/v Ophthalmic Solution',
    brandNames: ['Refresh Tears', 'Tear Drops', 'Celluvisc', 'Lubrifresh'],
    category: 'eye_care',
    categoryLabel: 'Eye Irritation & Dust',
    dosageForm: 'drops',
    dosageFormLabel: 'Sterile Lubricating Eye Wash',
    prescriptionStatus: 'otc',
    prescriptionLabel: 'First-Aid OTC',
    usedFor: 'Flushes microscopic dust particles, pollen, sand, and chemical mist from the ocular surface without stinging.',
    standardDose: 'Instill 1 to 2 drops into the affected eye, blinking gently. Repeat as needed.',
    keyWarning: 'NEVER rub the eye. If an object is embedded in the eyeball or corneal surface, do NOT touch; seek an eye specialist.',
    accentColor: '#0284c7',
    badgeBg: 'bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800',
    detailedGuide: {
      mechanism: 'High-viscosity bioadhesive ocular polymer that mimics natural pre-corneal tear film mucin layer, buffering shear forces and safely floating out unattached microscopic particles.',
      clinicalApplicationSteps: [
        'Wash hands with soap and water.',
        'Tilt head back and gently pull down the lower eyelid to create a small pocket.',
        'Instill 2 drops into the lower conjunctival fornix without touching the dropper tip to the eye.',
        'Close eye gently for 30 seconds. Do not rub or squeeze hard.'
      ],
      contraindications: [
        'Penetrating eye injury or ruptured globe (requires immediate rigid eye shield and ER rush).',
        'Do NOT use steroid-containing eye drops (e.g., Dexamethasone) without an ophthalmologist prescription.'
      ],
      pediatricPregnancyNotice: 'Safe across all ages.',
      janAushadhiNote: 'PMBJP centers stock "Carboxymethylcellulose 0.5% Eye Drops 10ml" for ~₹18–₹25.',
      doctorEscalationTriggers: [
        'Severe acute vision loss, halo lights, blood in anterior chamber (hyphema), or pupil irregularity.'
      ]
    }
  },

  // 14. Hydrocortisone 1% Cream
  {
    id: 'hydrocortisone-cream',
    name: 'Hydrocortisone 1% Topical Cream',
    genericName: 'Hydrocortisone Acetate IP 1.0% w/w',
    brandNames: ['Cortipin', 'Hycort', 'Wycort', 'Cortizone-10'],
    category: 'allergies_bites',
    categoryLabel: 'Insect Stings & Allergies',
    dosageForm: 'ointment',
    dosageFormLabel: 'Mild Topical Corticosteroid',
    prescriptionStatus: 'otc',
    prescriptionLabel: 'Short-Term First-Aid OTC',
    usedFor: 'Short-term relief of severe inflammatory erythema, bug bite swelling, and intense localized allergic flare-ups.',
    standardDose: 'Apply a very thin smear over the inflamed bump twice daily for a maximum of 3–5 days.',
    keyWarning: 'Do NOT use on face, open wounds, fungal ringworm, or for more than 5 days (risk of skin thinning).',
    accentColor: '#db2777',
    badgeBg: 'bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-pink-300 border-pink-200 dark:border-pink-800',
    detailedGuide: {
      mechanism: 'Low-potency glucocorticoid that diffuses into dermal cells, binds cytosolic receptors, and downregulates pro-inflammatory cytokines, leukotrienes, and vascular permeability.',
      clinicalApplicationSteps: [
        'Wash and dry the localized sting or rash site.',
        'Apply a tiny dot of cream and gently smooth over the swollen area.',
        'Do NOT bandage with airtight plastic or occlusive wrap.',
        'Limit treatment duration to 3–5 consecutive days.'
      ],
      contraindications: [
        'Fungal or viral skin infections (e.g., ringworm, herpes, chickenpox) — steroids make fungal infections worse.',
        'Do NOT apply near eyes (glaucoma / cataract risk) or on broken bleeding cuts.'
      ],
      pediatricPregnancyNotice: 'Use sparingly under pediatrician advice in children under 2 years.',
      janAushadhiNote: 'Available at Jan Aushadhi centers as "Hydrocortisone Cream 1% 15g" for ~₹12–₹16.',
      doctorEscalationTriggers: [
        'Rash develops yellow crusts, oozes pus, or spreads despite 3 days of therapy.'
      ]
    }
  },

  // 15. Rabies Post-Exposure Vaccine & RIG
  {
    id: 'rabies-pep',
    name: 'Rabies PEP Vaccine & Immunoglobulin',
    genericName: 'Purified Chick Embryo Cell / Vero Cell Rabies Vaccine IP + Equine/Human RIG',
    brandNames: ['Rabivax-S', 'Verorab', 'Abhayrab', 'KamRAB (RIG)'],
    category: 'emergency_bites',
    categoryLabel: 'Rabies & Snakebite Protocol',
    dosageForm: 'injection',
    dosageFormLabel: 'Emergency Biological Vaccine & RIG',
    prescriptionStatus: 'emergency_clinical',
    prescriptionLabel: 'Hospital Emergency Mandatory',
    usedFor: '100% mandatory post-exposure prophylaxis for Category II & III dog, cat, monkey, or bat scratches and bites.',
    standardDose: 'Given at Hospital/PHC on Days 0, 3, 7, and 28. Category III bites also require RIG infiltrated into wound bed.',
    keyWarning: 'FIRST 15 MINUTES: Wash wound under running water with soap for a full 15 minutes! Never apply chili, turmeric, or band-aids.',
    accentColor: '#dc2626',
    badgeBg: 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800',
    detailedGuide: {
      mechanism: 'Inactivated rabies viral antigen induces active neutralizing antibody production; Rabies Immunoglobulin (RIG) provides instant passive neutralizing antibodies at the bite site before active immunity develops.',
      clinicalApplicationSteps: [
        'STEP 1 (IMMEDIATE AT HOME): Wash the bite wound vigorously under continuous running tap water with soap for a minimum of 15 FULL MINUTES.',
        'STEP 2: Apply Povidone-Iodine antiseptic. Do NOT stitch the wound or apply tight bandages.',
        'STEP 3: Rush immediately to the nearest Government Hospital or AIIMS for Day 0 vaccination.',
        'STEP 4: Complete all scheduled doses (Day 0, 3, 7, 28) without missing a single date. Rabies is 100% fatal once symptoms begin, but 100% preventable with PEP.'
      ],
      contraindications: [
        'NO CONTRAINDICATIONS EXIST. Rabies post-exposure prophylaxis is lifesaving in all humans, including pregnant women, newborns, and immunosuppressed individuals.'
      ],
      pediatricPregnancyNotice: '100% mandatory and safe in pregnancy and childhood.',
      janAushadhiNote: 'Provided completely FREE or at heavily subsidized rates at all Indian Government District Hospitals, PHCs, and AIIMS.',
      doctorEscalationTriggers: [
        'ANY scratch, scrape, bite, or saliva contact on broken skin from a stray dog, cat, monkey, or wild animal.'
      ]
    }
  },

  // 16. Polyvalent Anti-Snake Venom (ASV)
  {
    id: 'anti-snake-venom',
    name: 'Polyvalent Anti-Snake Venom (ASV)',
    genericName: 'Purified Equine Polyvalent Antivenom Serum IP (Lyophilized / Liquid)',
    brandNames: ['Bharat Serums ASV', 'Haffkine Polyvalent ASV', 'Vins Bioproducts ASV'],
    category: 'emergency_bites',
    categoryLabel: 'Rabies & Snakebite Protocol',
    dosageForm: 'injection',
    dosageFormLabel: 'Intravenous Hospital ICU Infusion',
    prescriptionStatus: 'emergency_clinical',
    prescriptionLabel: 'Hospital ICU / Emergency Only',
    usedFor: 'Neutralizes lethal venom from the Indian Big Four snakes: Russell\'s Viper, Saw-scaled Viper, Common Krait, and Indian Cobra.',
    standardDose: 'Administered strictly via intravenous infusion under ICU monitoring with adrenaline premedication ready.',
    keyWarning: 'CRITICAL: NO HOME MEDICINES OR HERBS WORK! Never cut, suck venom, apply tourniquets, or electric shock. Rush to hospital immediately.',
    accentColor: '#dc2626',
    badgeBg: 'bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800',
    detailedGuide: {
      mechanism: 'Equine immunoglobulin fragments (F(ab\')₂) bind specifically to circulating neurotoxins, hemotoxins, and cytotoxins, forming inert complexes eliminated by reticuloendothelial clearance.',
      clinicalApplicationSteps: [
        'FIRST AID AT SCENE: Keep the victim completely calm and still. Every muscle contraction accelerates venom absorption.',
        'Immobilize the bitten limb with a splint or sling (like a fractured bone) at heart level.',
        'Remove rings, watches, anklets, and tight clothing before swelling begins.',
        'DO NOT cut fang marks, DO NOT suck venom, DO NOT tie tight arterial tourniquets, and DO NOT apply ice or herbs.',
        'Transport immediately to the nearest hospital equipped with ventilator and ASV support.'
      ],
      contraindications: [
        'Strictly contraindicated for home administration. Must be given in a hospital with anaphylaxis management facilities.'
      ],
      pediatricPregnancyNotice: 'Children require the SAME full starting dose of ASV as adults because the snake injects an identical venom load.',
      janAushadhiNote: 'Mandatory emergency stock at all District Civil Hospitals, Medical Colleges, and AIIMS across India under the National Snakebite Prevention Program.',
      doctorEscalationTriggers: [
        'Immediate Level 1 Emergency for any snake encounter resulting in puncture marks, swelling, bleeding, or drowsiness (Call 112 / 108).'
      ]
    }
  }
];

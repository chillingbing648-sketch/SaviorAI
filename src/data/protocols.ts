import { MedicalProtocol, SafetyBenchmarkTestCase } from '../types';

export const MEDICAL_PROTOCOLS: MedicalProtocol[] = [
  {
    id: 'proto-bleed-01',
    title: 'Severe & Uncontrolled External Hemorrhage Protocol',
    category: 'wounds',
    source: 'American Red Cross',
    version: '2025.2-ARC',
    lastReviewed: '2025-10-15',
    reviewStatus: 'Clinical Approved',
    evidenceLevel: 'Level A (Clinical Trials)',
    summary: 'Standard clinical guidance for life-threatening arterial or profuse venous bleeding.',
    keyActions: [
      'Call emergency services immediately (911 / 112 / 108 / 999).',
      'Apply direct, continuous, firm pressure with a clean cloth or sterile gauze directly over the bleeding site.',
      'Do NOT lift the cloth to inspect the wound; add additional layers over the top if blood soaks through.',
      'Maintain firm direct pressure until emergency medical providers take over.',
      'Keep the injured person calm, lying down, and warm to prevent hypothermia and shock.'
    ],
    contraindications: [
      'Never remove embedded objects (knife, glass, metal) from a wound — stabilize around the object.',
      'Never apply a makeshift tourniquet without proper medical training unless bleeding is catastrophic and direct pressure fails completely.',
      'Never give the person food, water, or oral pain medications if surgery or emergency evaluation may be needed.'
    ],
    escalationThresholds: [
      'Pulsing or spurting bright red blood',
      'Blood failing to stop after 5-10 minutes of direct firm pressure',
      'Signs of shock (pale clammy skin, confusion, rapid shallow breathing, dizziness)'
    ],
    region: 'Global'
  },
  {
    id: 'proto-burn-01',
    title: 'Thermal Burn & Scald Acute Management',
    category: 'burns',
    source: 'WHO',
    version: '2025-WHO-TSB',
    lastReviewed: '2025-11-01',
    reviewStatus: 'Clinical Approved',
    evidenceLevel: 'Level A (Clinical Trials)',
    summary: 'Evidence-based first response for thermal, contact, and hot liquid burns.',
    keyActions: [
      'Immediately cool the burn with clean, cool running tap water for at least 10 to 20 minutes.',
      'Remove jewelry, watches, belts, or tight clothing near the burned area before swelling begins.',
      'Cover the cooled burn loosely with a clean, sterile non-adherent dressing or clean plastic food wrap layer.',
      'Keep the rest of the patient warm to prevent hypothermia during prolonged cooling.'
    ],
    contraindications: [
      'Never apply ice, ice-cold water, or frozen items — this causes extreme tissue vasoconstriction and deepens tissue necrosis.',
      'Never apply butter, oil, toothpaste, flour, eggs, or home remedies to a burn.',
      'Never pop or puncture blisters, as intact skin protects against catastrophic bacterial infection.',
      'Never forcefully peel away clothing that is melted or stuck to the burn.'
    ],
    escalationThresholds: [
      'Burns covering face, hands, feet, groin, major joints, or circular around a limb',
      'Burns larger than the palm of the injured person\'s hand',
      'Full-thickness burns (white, waxy, leathery, charred, or painless numb areas)',
      'Chemical or electrical burns, or inhalation of smoke/hot soot'
    ],
    region: 'Global'
  },
  {
    id: 'proto-ortho-01',
    title: 'Suspected Fracture, Dislocation & Joint Sprain Protocol',
    category: 'orthopedic',
    source: 'Mayo Clinic',
    version: '2025.4-MC-ORTHO',
    lastReviewed: '2025-09-12',
    reviewStatus: 'Clinical Approved',
    evidenceLevel: 'Level B (Consensus Guidelines)',
    summary: 'Immobilization and acute response for musculoskeletal trauma, deformities, and severe sprains.',
    keyActions: [
      'Immobilize and support the injured area in the position found.',
      'Apply cold pack wrapped in a cloth for 15-20 minutes at a time to reduce swelling (never ice directly on bare skin).',
      'Elevate the limb above heart level only if doing so does not increase pain or cause movement of a possible fracture.',
      'Seek prompt medical evaluation for X-rays and structural assessment.'
    ],
    contraindications: [
      'Never attempt to straighten, realign, or push back an obviously deformed or bent limb/joint.',
      'Never allow the patient to bear weight or walk on an injured leg, ankle, or foot if unable to step without severe pain.',
      'Never massage or aggressively rotate an acutely swollen or deformed joint.'
    ],
    escalationThresholds: [
      'Visible bone piercing through skin (compound / open fracture) — Emergency',
      'Cold, pale, blue, or numb fingers/toes beyond the injury site (compromised circulation/nerve)',
      'Gross anatomical deformity or abnormal joint angle',
      'Inability to bear any weight immediately after injury'
    ],
    region: 'Global'
  },
  {
    id: 'proto-head-01',
    title: 'Acute Traumatic Brain Injury & Concussion Red Flag Protocol',
    category: 'head_neck',
    source: 'NHS',
    version: '2025-NICE-TBI',
    lastReviewed: '2025-12-05',
    reviewStatus: 'Clinical Approved',
    evidenceLevel: 'Level A (Clinical Trials)',
    summary: 'Clinical indicators for head trauma, concussion triage, and spinal immobilization flags.',
    keyActions: [
      'Keep the injured person completely still; avoid any neck or spinal movement if mechanism involved a high-impact fall or collision.',
      'Monitor consciousness, pupil symmetry, and neurological responsiveness continuously.',
      'If bleeding from scalp, apply gentle direct pressure unless a depressed skull fracture is suspected.',
      'Arrange immediate emergency transport if any red flags are present.'
    ],
    contraindications: [
      'Never move the person\'s head, neck, or spine if there is any suspicion of spinal trauma.',
      'Never allow a person with suspected concussion to return to sports, driving, or machinery on the same day.',
      'Never give aspirin or ibuprofen immediately after a severe head blow, as these can worsen intracranial hemorrhage.',
      'Never leave an injured person alone if they have suffered head trauma with confusion or amnesia.'
    ],
    escalationThresholds: [
      'Any loss of consciousness, even for a few seconds',
      'Repeated vomiting or severe escalating headache',
      'Clear fluid draining from ears or nose (CSF leak)',
      'Unequal pupil sizes, slurred speech, confusion, seizure, or arm/leg weakness'
    ],
    region: 'Global'
  },
  {
    id: 'proto-eye-01',
    title: 'Ocular Trauma & Foreign Object Protocol',
    category: 'trauma',
    source: 'American Red Cross',
    version: '2025.1-ARC-EYE',
    lastReviewed: '2025-08-20',
    reviewStatus: 'Clinical Approved',
    evidenceLevel: 'Level B (Consensus Guidelines)',
    summary: 'Triage for eye lacerations, blunt eye trauma, chemical splash, and penetrating ocular injuries.',
    keyActions: [
      'For chemical splash: IMMEDIATELY flush the open eye with clean water or saline for at least 15-20 minutes continuously, holding eyelids open.',
      'For penetrating object or blunt trauma: Protect the eye by taping a rigid shield (e.g., bottom of a paper cup) over the eye without touching the globe.',
      'Keep both eyes gently closed to minimize sympathetic eye movement while waiting for emergency care.'
    ],
    contraindications: [
      'Never rub the eye or apply any pressure to the eyeball.',
      'Never attempt to remove an object embedded in or piercing the eyeball.',
      'Never apply ointments, drops, or cotton swabs directly to an injured eye without medical direction.'
    ],
    escalationThresholds: [
      'Sudden vision loss, double vision, or flashing lights',
      'Visible blood inside the colored part of the eye (hyphema)',
      'Irregularly shaped pupil or laceration of the eyelid/globe',
      'Chemical splash of acids or alkaline drain cleaners/industrial agents'
    ],
    region: 'Global'
  },
  {
    id: 'proto-bites-01',
    title: 'Animal & Human Bite Wound Management',
    category: 'wounds',
    source: 'IFRC',
    version: '2025-IFRC-BITES',
    lastReviewed: '2025-07-10',
    reviewStatus: 'Clinical Approved',
    evidenceLevel: 'Level B (Consensus Guidelines)',
    summary: 'Infection risk management and rabies/tetanus prophylaxis escalation.',
    keyActions: [
      'Wash the bite thoroughly with mild soap and warm running water for 5-10 minutes immediately.',
      'Apply a sterile clean dressing and mild pressure if bleeding.',
      'Seek prompt medical evaluation (within hours) for prophylactic antibiotics, tetanus check, and rabies assessment.',
      'Record animal status and location for local health authority review.'
    ],
    contraindications: [
      'Never close deep puncture bite wounds tightly with adhesive strips at home without medical debridement, as this traps bacteria.',
      'Never attempt to capture a wild or venomous animal.'
    ],
    escalationThresholds: [
      'Unprovoked wild animal bite or unknown stray animal (rabies risk)',
      'Bites to hands, feet, face, or near joints',
      'Spreading redness, heat, red streaks, fever, or pus developing within hours/days'
    ],
    region: 'Global'
  }
];

export const DEMO_TEST_CASES: SafetyBenchmarkTestCase[] = [
  {
    id: 'demo-1-cut',
    name: 'Case 1: Minor Kitchen Knife Nick',
    category: 'Minor Wound',
    description: 'Small superficial cut on index finger while slicing vegetables. Bleeding stopped after 2 minutes.',
    expectedUrgency: 'LEVEL_4_BASIC_FIRST_AID',
    criticalRedFlags: [],
    sampleInput: {
      bodyPart: 'Hand / Finger',
      symptoms: ['Mild pain', 'Minor bleeding (stopped)'],
      painLevel: 2,
      mechanism: 'Cut / Kitchen knife',
      timeframe: '10 minutes ago',
      userDescription: 'Was slicing a bell pepper and nicked index finger. Washed with soap and water, bled for a minute then stopped with a tissue. Feels like a papercut.',
      redFlags: {
        severeBleeding: false,
        breathingDifficulty: false,
        lossOfConsciousness: false,
        deformity: false,
        numbness: false,
        embeddedObject: false
      }
    },
    rationale: 'Superficial laceration with controlled bleeding, no numbness, no deep tissue involvement.'
  },
  {
    id: 'demo-2-fracture',
    name: 'Case 2: Suspected Wrist Fracture with Deformity',
    category: 'Orthopedic Trauma',
    description: 'Slip on ice landing on outstretched hand. Visible crook in wrist, extreme pain, unable to grip.',
    expectedUrgency: 'LEVEL_2_URGENT',
    criticalRedFlags: ['Deformity', 'Inability to move'],
    sampleInput: {
      bodyPart: 'Wrist / Arm',
      symptoms: ['Severe pain', 'Swelling', 'Deformity / Angulation', 'Difficulty moving / Inability to grip'],
      painLevel: 8,
      mechanism: 'Fall on outstretched hand',
      timeframe: '30 minutes ago',
      userDescription: 'Slipped on wet stairs and caught myself hard on right palm. Heard a snapping sound. Wrist looks crooked and swollen. Fingers are still warm but tingling.',
      redFlags: {
        severeBleeding: false,
        breathingDifficulty: false,
        lossOfConsciousness: false,
        deformity: true,
        numbness: true,
        embeddedObject: false
      }
    },
    rationale: 'Obvious deformity, high pain, snapping sensation strongly indicates fracture requiring urgent X-ray and splinting.'
  },
  {
    id: 'demo-3-severe-bleed',
    name: 'Case 3: Deep Forearm Laceration with Pulsing Bleed',
    category: 'Critical Bleeding',
    description: 'Broken window shard sliced deep into forearm. Blood soaking through 3 towels rapidly.',
    expectedUrgency: 'LEVEL_1_EMERGENCY',
    criticalRedFlags: ['Severe / Uncontrolled Bleeding', 'Signs of Shock'],
    sampleInput: {
      bodyPart: 'Forearm',
      symptoms: ['Profuse bleeding', 'Pulsing blood', 'Dizziness', 'Weakness', 'Severe pain'],
      painLevel: 9,
      mechanism: 'Deep laceration / Broken glass',
      timeframe: '5 minutes ago',
      userDescription: 'Glass table shattered. Deep cut on inner forearm. Bright blood is spurting and soaked through 3 bath towels. Patient feels dizzy and pale.',
      redFlags: {
        severeBleeding: true,
        breathingDifficulty: false,
        lossOfConsciousness: false,
        deformity: false,
        numbness: true,
        embeddedObject: false
      }
    },
    rationale: 'Life-threatening arterial or major venous hemorrhage causing early hypovolemic shock signs. Requires instant 911/112 escalation and constant firm direct pressure.'
  },
  {
    id: 'demo-4-burn',
    name: 'Case 4: Boiling Water Scald on Chest and Neck',
    category: 'Thermal Burn',
    description: 'Spilled pot of boiling water across upper chest and neck. Blistering rapidly over large area.',
    expectedUrgency: 'LEVEL_2_URGENT',
    criticalRedFlags: ['Large area burn', 'Sensitive anatomical location (neck)'],
    sampleInput: {
      bodyPart: 'Chest / Neck',
      symptoms: ['Intense burning pain', 'Redness', 'Blisters forming', 'Swelling'],
      painLevel: 8,
      mechanism: 'Hot liquid scald',
      timeframe: '15 minutes ago',
      userDescription: 'Pot of boiling soup splashed onto chest and front of neck. Skin is bright red and large blisters formed within minutes. Currently running cool water.',
      redFlags: {
        severeBleeding: false,
        breathingDifficulty: false,
        lossOfConsciousness: false,
        deformity: false,
        numbness: false,
        embeddedObject: false
      }
    },
    rationale: 'Critical anatomical zone (neck/chest) with rapid blistering over large area requires urgent clinical burn center evaluation.'
  },
  {
    id: 'demo-5-head',
    name: 'Case 5: Bicycle Collision with Loss of Consciousness & Vomiting',
    category: 'Traumatic Brain Injury',
    description: 'Cyclist hit head on curb, unconscious for 45 seconds, vomited twice, confused.',
    expectedUrgency: 'LEVEL_1_EMERGENCY',
    criticalRedFlags: ['Loss of consciousness', 'Repeated vomiting', 'Confusion / TBI signs'],
    sampleInput: {
      bodyPart: 'Head / Neck',
      symptoms: ['Loss of consciousness', 'Severe headache', 'Vomiting', 'Confusion', 'Dizziness'],
      painLevel: 7,
      mechanism: 'Bicycle fall / High impact head collision',
      timeframe: '20 minutes ago',
      userDescription: 'Fell off bike without helmet. Was knocked out cold for nearly a minute. Woke up confused asking what day it is, and just vomited twice in the grass.',
      redFlags: {
        severeBleeding: false,
        breathingDifficulty: false,
        lossOfConsciousness: true,
        deformity: false,
        numbness: false,
        embeddedObject: false
      }
    },
    rationale: 'Traumatic brain injury with LOC, amnesia, and repeated emesis indicates possible intracranial hemorrhage or severe concussion. Immediate Emergency.'
  },
  {
    id: 'demo-6-sports',
    name: 'Case 6: Inverted Ankle Sprain during Soccer',
    category: 'Sports Injury',
    description: 'Rolled lateral ankle while turning. Swelling over outer malleolus, can bear slight weight.',
    expectedUrgency: 'LEVEL_3_MEDICAL_REVIEW',
    criticalRedFlags: [],
    sampleInput: {
      bodyPart: 'Ankle / Foot',
      symptoms: ['Moderate pain', 'Swelling', 'Bruising starting', 'Difficulty moving'],
      painLevel: 5,
      mechanism: 'Twist / Soccer tackle',
      timeframe: '2 hours ago',
      userDescription: 'Rolled ankle outward during soccer match. Outer ankle puffed up like a golf ball. Can limp a few steps with help. No visible deformity or open wound.',
      redFlags: {
        severeBleeding: false,
        breathingDifficulty: false,
        lossOfConsciousness: false,
        deformity: false,
        numbness: false,
        embeddedObject: false
      }
    },
    rationale: 'Moderate acute ligamentous sprain without gross deformity or neurovascular compromise. RICE protocol, watch for Ottawa ankle rules, arrange medical review if non-weightbearing.'
  },
  {
    id: 'demo-7-trauma',
    name: 'Case 7: Motor Vehicle Crash with Chest Pain & Shortness of Breath',
    category: 'Major Trauma',
    description: 'High-speed car accident, steering wheel impact against sternum, struggling to breathe.',
    expectedUrgency: 'LEVEL_1_EMERGENCY',
    criticalRedFlags: ['Breathing difficulty', 'Blunt chest trauma', 'Severe pain'],
    sampleInput: {
      bodyPart: 'Chest / Ribs',
      symptoms: ['Severe chest pain', 'Difficulty breathing / Gasping', 'Dizziness', 'Rapid heart rate'],
      painLevel: 9,
      mechanism: 'Road accident / Steering wheel blunt trauma',
      timeframe: '10 minutes ago',
      userDescription: 'Car hit telephone pole. Airbag deployed and steering wheel slammed into chest. Sharp agonizing pain when taking a breath. Feeling lightheaded.',
      redFlags: {
        severeBleeding: false,
        breathingDifficulty: true,
        lossOfConsciousness: false,
        deformity: true,
        numbness: false,
        embeddedObject: false
      }
    },
    rationale: 'High kinetic energy blunt thoracic trauma with respiratory compromise (suspected pneumothorax or flail chest). Critical immediate Level 1 Emergency.'
  }
];

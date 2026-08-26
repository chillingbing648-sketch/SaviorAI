import { GoogleGenAI, Type } from '@google/genai';
import {
  InjuryAssessmentRequest,
  TriageAnalysisResponse,
  TriageLevel,
  ObservableCharacteristic,
  RetrievedProtocolReference
} from '../src/types';
import { MEDICAL_PROTOCOLS } from '../src/data/protocols';

// Shared Gemini Client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

/**
 * DETERMINISTIC RED FLAG SAFETY GATE
 * Evaluates high-risk indicators that MUST immediately force LEVEL_1_EMERGENCY
 */
export function evaluateRedFlags(request: InjuryAssessmentRequest): {
  isCritical: boolean;
  triggers: string[];
} {
  const triggers: string[] = [];
  const flags = request.redFlags || {};
  const symptoms = (request.symptoms || []).map((s) => s.toLowerCase());
  const desc = (request.userDescription || '').toLowerCase();
  const mech = (request.mechanism || '').toLowerCase();

  // 1. Explicit UI Red Flags
  if (flags.severeBleeding) triggers.push('Severe / Uncontrolled Bleeding reported');
  if (flags.breathingDifficulty) triggers.push('Respiratory distress / Breathing difficulty');
  if (flags.lossOfConsciousness) triggers.push('Loss of consciousness / Blackout');
  if (flags.severeHeadNeck) triggers.push('High-impact Head or Cervical spine trauma');
  if (flags.embeddedObject) triggers.push('Penetrating foreign object embedded in body');
  if (flags.signsOfShock) triggers.push('Signs of hemodynamic shock (pale/clammy/dizzy)');
  if (flags.rapidDeterioration) triggers.push('Rapidly worsening neurological/vital state');

  // 2. Symptom keyword triggers
  if (symptoms.some((s) => s.includes('unconscious') || s.includes('blackout') || s.includes('fainted'))) {
    triggers.push('Loss of consciousness reported in symptoms');
  }
  if (symptoms.some((s) => s.includes('breathing') || s.includes('gasping') || s.includes('suffocating') || s.includes('shortness of breath'))) {
    triggers.push('Respiratory compromise detected');
  }
  if (symptoms.some((s) => s.includes('spurting') || s.includes('pulsing blood') || s.includes('uncontrolled bleeding') || s.includes('profuse bleeding'))) {
    triggers.push('Arterial or profuse hemorrhage detected');
  }
  if (symptoms.some((s) => s.includes('paralysis') || s.includes('cannot move arms or legs') || s.includes('loss of sensation in limbs'))) {
    triggers.push('Possible spinal cord or acute neuro deficit');
  }

  // 3. Description keyword scans
  if (desc.includes('spurting blood') || desc.includes('bleeding heavily') || desc.includes('soaked through multiple towels')) {
    triggers.push('Hemorrhage description indicates heavy active bleeding');
  }
  if (desc.includes('knocked out') || desc.includes('passed out') || desc.includes('unresponsive') || desc.includes('vomiting after head')) {
    triggers.push('Severe traumatic brain injury indicators in description');
  }
  if (desc.includes('bone sticking out') || desc.includes('compound fracture') || desc.includes('bone through skin')) {
    triggers.push('Open / Compound fracture indicators');
  }
  if (desc.includes('chemical in eye') || desc.includes('acid in eye') || desc.includes('battery acid')) {
    triggers.push('Ocular chemical injury requiring emergency irrigation');
  }

  // 4. Mechanism checks
  if (mech.includes('road accident') || mech.includes('car crash') || mech.includes('high fall')) {
    if (request.painLevel >= 8 || symptoms.some((s) => s.includes('chest') || s.includes('neck') || s.includes('spine'))) {
      triggers.push('High-kinetic mechanism combined with severe axial pain');
    }
  }

  return {
    isCritical: triggers.length > 0,
    triggers
  };
}

/**
 * MEDICAL PROTOCOL RETRIEVAL LAYER
 */
export function retrieveMatchingProtocols(request: InjuryAssessmentRequest): RetrievedProtocolReference[] {
  const matched: RetrievedProtocolReference[] = [];
  const text = `${request.bodyPart} ${request.mechanism} ${request.symptoms.join(' ')} ${request.userDescription}`.toLowerCase();

  for (const protocol of MEDICAL_PROTOCOLS) {
    let score = 0;
    if (protocol.category === 'wounds' && (text.includes('cut') || text.includes('bleed') || text.includes('laceration') || text.includes('wound') || text.includes('bite'))) score += 3;
    if (protocol.category === 'burns' && (text.includes('burn') || text.includes('scald') || text.includes('fire') || text.includes('hot liquid') || text.includes('boiling'))) score += 3;
    if (protocol.category === 'orthopedic' && (text.includes('fall') || text.includes('twist') || text.includes('fracture') || text.includes('bone') || text.includes('ankle') || text.includes('wrist') || text.includes('sprain') || text.includes('deformity'))) score += 3;
    if (protocol.category === 'head_neck' && (text.includes('head') || text.includes('concussion') || text.includes('neck') || text.includes('dizzy') || text.includes('unconscious') || text.includes('vomit'))) score += 3;
    if (protocol.category === 'trauma' && (text.includes('eye') || text.includes('vision') || text.includes('chemical') || text.includes('crash') || text.includes('trauma'))) score += 3;

    if (score > 0) {
      matched.push({
        id: protocol.id,
        title: protocol.title,
        source: protocol.source,
        version: protocol.version,
        lastReviewed: protocol.lastReviewed,
        reviewStatus: protocol.reviewStatus
      });
    }
  }

  // Fallback default protocol if none matched
  if (matched.length === 0 && MEDICAL_PROTOCOLS.length > 0) {
    const p = MEDICAL_PROTOCOLS[0];
    matched.push({
      id: p.id,
      title: p.title,
      source: p.source,
      version: p.version,
      lastReviewed: p.lastReviewed,
      reviewStatus: p.reviewStatus
    });
  }

  return matched;
}

/**
 * CONTRADICTION & SAFETY RULE AUDITOR (Post-LLM Safety Validation)
 */
export function validateAndEnforceSafety(
  response: TriageAnalysisResponse,
  request: InjuryAssessmentRequest,
  redFlagResult: { isCritical: boolean; triggers: string[] }
): TriageAnalysisResponse {
  const result = { ...response };
  const desc = (request.userDescription || '').toLowerCase();
  const symptoms = (request.symptoms || []).map((s) => s.toLowerCase());

  // RULE 1: If Red Flag Gate is critical, Urgency MUST be LEVEL_1_EMERGENCY
  if (redFlagResult.isCritical && result.urgencyLevel !== 'LEVEL_1_EMERGENCY') {
    result.urgencyLevel = 'LEVEL_1_EMERGENCY';
    result.urgencyTitle = 'CRITICAL EMERGENCY — IMMEDIATE MEDICAL CARE REQUIRED';
    result.urgencyColor = 'red';
    result.headlineReason = `Red flag indicators detected: ${redFlagResult.triggers.slice(0, 2).join('; ')}. Immediate emergency medical attention is necessary.`;
    result.suggestedCareType = 'emergency_room';
    result.escalationTriggers = [...(result.escalationTriggers || []), ...redFlagResult.triggers];
    result.safetyAuditPassed = false; // Flagged & corrected by validator
  }

  // RULE 2: Ensure "Avoid / Prevent Further Harm" includes critical medical contraindications
  const avoidList = [...(result.avoidDoNotMakeWorse || [])];
  
  if (desc.includes('burn') || symptoms.some((s) => s.includes('burn') || s.includes('scald'))) {
    if (!avoidList.some((a) => a.toLowerCase().includes('ice') || a.toLowerCase().includes('butter'))) {
      avoidList.push('DO NOT apply ice, ice-cold water, butter, oils, or home pastes to burns (this worsens tissue injury).');
      avoidList.push('DO NOT pop or burst blisters (intact skin prevents severe infection).');
    }
  }

  if (desc.includes('embedded') || request.redFlags?.embeddedObject) {
    if (!avoidList.some((a) => a.toLowerCase().includes('remove embedded') || a.toLowerCase().includes('pull out'))) {
      avoidList.unshift('DO NOT pull out or remove embedded objects (knife, glass, metal) — stabilize in place.');
    }
  }

  if (request.redFlags?.deformity || symptoms.some((s) => s.includes('deformity') || s.includes('crooked'))) {
    if (!avoidList.some((a) => a.toLowerCase().includes('straighten') || a.toLowerCase().includes('realign'))) {
      avoidList.push('DO NOT attempt to straighten, snap back, or force an obviously deformed limb/joint into place.');
    }
  }

  if (request.bodyPart.toLowerCase().includes('head') || request.bodyPart.toLowerCase().includes('neck')) {
    if (!avoidList.some((a) => a.toLowerCase().includes('neck') || a.toLowerCase().includes('move head'))) {
      avoidList.push('DO NOT move or twist the head, neck, or spine if high-impact collision or fall occurred.');
    }
  }

  // RULE 3: Never allow vague reassurance or missing red-flags
  if (!result.watchForRedFlags || result.watchForRedFlags.length === 0) {
    result.watchForRedFlags = [
      'Rapidly worsening or spreading pain',
      'Development of pale, clammy skin, dizziness, or confusion',
      'Loss of sensation, tingling, or blue/cold skin distal to the injury',
      'Spreading redness, heat, swelling, or pus'
    ];
  }

  // RULE 4: Mandatory Vision Limitations Disclaimer
  result.visionLimitationsDisclaimer =
    'Medical Safety Notice: External images and descriptions cannot detect internal bleeding, occult fractures, nerve damage, compartment syndrome, or deep organ trauma. When in doubt, always obtain professional medical evaluation.';

  result.avoidDoNotMakeWorse = avoidList;
  return result;
}

/**
 * FALLBACK DETERMINISTIC TRIAGE GENERATOR (Offline / Zero-latency safety engine)
 */
export function generateDeterministicTriage(
  request: InjuryAssessmentRequest,
  redFlagResult: { isCritical: boolean; triggers: string[] },
  protocols: RetrievedProtocolReference[]
): TriageAnalysisResponse {
  const { bodyPart, symptoms = [], painLevel, mechanism, timeframe, userDescription = '', redFlags = {} } = request;
  const descLower = userDescription.toLowerCase();
  const bodyLower = bodyPart.toLowerCase();

  let urgencyLevel: TriageLevel = 'LEVEL_4_BASIC_FIRST_AID';
  let urgencyTitle = 'BASIC FIRST-AID & ACTIVE MONITORING';
  let urgencyColor = 'emerald';
  let headlineReason = 'Reported symptoms appear consistent with a localized injury with no immediate red-flag indicators.';
  let whyExplanation = 'Based on the provided information, bleeding is absent or controlled, neurovascular signs appear intact, and no critical trauma indicators were reported.';
  let suggestedCareType: 'emergency_room' | 'urgent_care' | 'primary_care' | 'home_monitoring' = 'home_monitoring';

  // Urgency classification logic
  if (redFlagResult.isCritical) {
    urgencyLevel = 'LEVEL_1_EMERGENCY';
    urgencyTitle = 'LEVEL 1 — EMERGENCY MEDICAL ACTION REQUIRED';
    urgencyColor = 'red';
    headlineReason = `Critical red-flag indicators detected: ${redFlagResult.triggers.join('; ')}. Immediate emergency medical attention is essential.`;
    whyExplanation = 'These symptoms suggest potential airway, breathing, circulatory, or central neurological compromise requiring emergency medical services.';
    suggestedCareType = 'emergency_room';
  } else if (
    painLevel >= 7 ||
    redFlags.deformity ||
    redFlags.numbness ||
    symptoms.some((s) => s.toLowerCase().includes('deformity') || s.toLowerCase().includes('numb') || s.toLowerCase().includes('tingling') || s.toLowerCase().includes('cannot move')) ||
    descLower.includes('blister') ||
    descLower.includes('snap') ||
    descLower.includes('crooked') ||
    descLower.includes('bite')
  ) {
    urgencyLevel = 'LEVEL_2_URGENT';
    urgencyTitle = 'LEVEL 2 — URGENT MEDICAL EVALUATION RECOMMENDED';
    urgencyColor = 'amber';
    headlineReason = 'Symptoms indicate a potentially significant injury requiring prompt evaluation at an Urgent Care or Emergency Department.';
    whyExplanation = 'The reported severe pain, significant swelling, visible deformity, numbness, or burn blistering requires clinical examination (e.g., X-ray, wound repair, or infection prophylaxis) within hours.';
    suggestedCareType = 'urgent_care';
  } else if (
    painLevel >= 4 ||
    symptoms.some((s) => s.toLowerCase().includes('swelling') || s.toLowerCase().includes('bruising') || s.toLowerCase().includes('difficulty moving')) ||
    timeframe.includes('yesterday') ||
    timeframe.includes('day')
  ) {
    urgencyLevel = 'LEVEL_3_MEDICAL_REVIEW';
    urgencyTitle = 'LEVEL 3 — MEDICAL REVIEW RECOMMENDED';
    urgencyColor = 'yellow';
    headlineReason = 'Non-emergency injury with moderate discomfort where a medical review or outpatient visit is advisable.';
    whyExplanation = 'While immediate vital threats are not evident, symptoms may benefit from professional assessment, physical exam, or scheduled clinic review if symptoms fail to improve.';
    suggestedCareType = 'primary_care';
  }

  // Actions based on injury profile
  const doThisNow: string[] = [];
  const avoidDoNotMakeWorse: string[] = [];
  const watchForRedFlags: string[] = [];

  if (urgencyLevel === 'LEVEL_1_EMERGENCY') {
    doThisNow.push('Call Emergency Services immediately (911 / 112 / 108 / 999).');
    if (redFlags.severeBleeding || descLower.includes('bleed')) {
      doThisNow.push('Apply direct, firm, uninterrupted pressure to the bleeding area with a clean cloth or sterile gauze.');
    }
    if (bodyLower.includes('head') || bodyLower.includes('neck') || bodyLower.includes('spine')) {
      doThisNow.push('Keep the patient completely still. Support the head and neck without turning or flexing.');
    }
    doThisNow.push('Keep the person calm, lying down, and covered with a blanket to prevent shock and hypothermia.');
    doThisNow.push('Stay with the injured person and prepare to brief paramedics upon arrival.');

    avoidDoNotMakeWorse.push('DO NOT leave the injured person unattended.');
    avoidDoNotMakeWorse.push('DO NOT give food, water, or oral painkillers (in case emergency surgery is needed).');
    avoidDoNotMakeWorse.push('DO NOT remove embedded foreign objects.');
  } else if (descLower.includes('burn') || symptoms.some((s) => s.toLowerCase().includes('burn'))) {
    doThisNow.push('Cool the burn under clean, cool running tap water for 10-20 minutes continuously.');
    doThisNow.push('Carefully remove rings, watches, or tight clothing near the burned area before swelling develops.');
    doThisNow.push('Cover loosely with a clean non-stick sterile dressing or clean plastic food wrap layer.');
    doThisNow.push('Seek urgent care evaluation if blisters are large or on face, hands, or joints.');

    avoidDoNotMakeWorse.push('DO NOT apply ice or freezing water to burns.');
    avoidDoNotMakeWorse.push('DO NOT apply butter, toothpaste, grease, or ointments.');
    avoidDoNotMakeWorse.push('DO NOT burst blisters.');
  } else if (bodyLower.includes('ankle') || bodyLower.includes('wrist') || bodyLower.includes('knee') || bodyLower.includes('foot') || bodyLower.includes('leg') || bodyLower.includes('arm')) {
    doThisNow.push('Rest and support the injured limb in a comfortable, stable position.');
    doThisNow.push('Apply a cold compress wrapped in a towel for 15-20 minutes at a time to reduce swelling.');
    doThisNow.push('Elevate the limb above heart level when resting if it does not increase pain.');
    doThisNow.push('Arrange medical review or urgent care for X-ray confirmation if unable to bear weight.');

    avoidDoNotMakeWorse.push('DO NOT attempt to snap back or straighten an abnormal joint angle.');
    avoidDoNotMakeWorse.push('DO NOT force weight-bearing or continue athletic activity.');
    avoidDoNotMakeWorse.push('DO NOT apply ice directly to bare skin without a protective cloth.');
  } else {
    doThisNow.push('Gently cleanse the affected area with mild soap and clean water.');
    doThisNow.push('Apply a sterile adhesive bandage or clean dressing to protect the wound.');
    doThisNow.push('Keep the injured area clean, dry, and rested.');
    doThisNow.push('Log progress in Injury Watch to monitor for signs of infection.');

    avoidDoNotMakeWorse.push('DO NOT aggressively pick or scrub the wound edges.');
    avoidDoNotMakeWorse.push('DO NOT ignore escalating redness, warmth, or throbbing pain.');
  }

  watchForRedFlags.push('Sudden worsening of pain or swelling beyond initial site');
  watchForRedFlags.push('Development of numbness, tingling, or cold pale extremities');
  watchForRedFlags.push('Fever, spreading red streaks, or foul-smelling discharge');
  watchForRedFlags.push('Dizziness, lightheadedness, nausea, or confusion');

  const observableCharacteristics: ObservableCharacteristic[] = [];
  if (request.imageBase64) {
    observableCharacteristics.push({
      characteristic: 'External Image Provided',
      visualNote: 'Visual inspection recorded in system. Surface tissue status reviewed in conjunction with reported symptoms.',
      potentialConcern: 'External appearance does not exclude internal structural or vascular compromise.'
    });
  }

  const medicalReportMarkdown = `### INJURY RESPONSE REPORT (CLINICAL HANDOFF)
**Generated:** ${new Date().toISOString()}
**Urgency Level:** ${urgencyTitle}
**Anatomical Site:** ${bodyPart}
**Mechanism:** ${mechanism}
**Reported Pain Score:** ${painLevel} / 10
**Time Elapsed:** ${timeframe}
**Reported Symptoms:** ${symptoms.join(', ') || 'None specified'}
**Red Flags Identified:** ${redFlagResult.triggers.join('; ') || 'None reported'}

**User Description:**
"${userDescription}"

**Immediate Guidance Given:**
${doThisNow.map((a, i) => `${i + 1}. ${a}`).join('\n')}

**Harm Prevention Directives:**
${avoidDoNotMakeWorse.map((a) => `- ${a}`).join('\n')}

**Retrieved Reference Protocols:**
${protocols.map((p) => `- ${p.title} (${p.source} v${p.version})`).join('\n')}

*Notice: This summary is generated by InjuryGuard AI for medical communication and triage safety reference only.*`;

  return {
    id: `triage-${Date.now()}`,
    timestamp: new Date().toISOString(),
    urgencyLevel,
    urgencyTitle,
    urgencyColor,
    headlineReason,
    whyExplanation,
    confidenceStatement:
      urgencyLevel === 'LEVEL_1_EMERGENCY'
        ? 'High urgency confidence due to identified critical red-flag triggers. Immediate escalation is standard safety protocol.'
        : 'Based on patient-reported symptoms and mechanism. Clinical exam recommended if symptoms fail to resolve or worsen.',
    observableCharacteristics,
    visionLimitationsDisclaimer:
      'Medical Safety Notice: External images and descriptions cannot detect internal bleeding, occult fractures, nerve damage, compartment syndrome, or deep organ trauma. When in doubt, always obtain professional medical evaluation.',
    doThisNow,
    avoidDoNotMakeWorse,
    watchForRedFlags,
    whenToEscalate:
      urgencyLevel === 'LEVEL_1_EMERGENCY'
        ? 'CALL EMERGENCY SERVICES (911 / 112 / 108 / 999) RIGHT NOW.'
        : 'Escalate to Urgent Care or Emergency Room if pain surges, numbness develops, or bleeding recurs.',
    suggestedCareType,
    retrievedProtocols: protocols,
    safetyAuditPassed: true,
    escalationTriggers: redFlagResult.triggers,
    medicalReportMarkdown
  };
}

/**
 * FULL AI PIPELINE WITH GEMINI 3.7 FLASH + MULTI-LAYER SAFETY VALIDATION
 */
export async function executeSafetyTriagePipeline(
  request: InjuryAssessmentRequest
): Promise<TriageAnalysisResponse> {
  // LAYER 1: Deterministic Red Flag Safety Gate
  const redFlagResult = evaluateRedFlags(request);

  // LAYER 2: Medical Protocol Retrieval
  const protocols = retrieveMatchingProtocols(request);

  const gemini = getGeminiClient();

  // If no Gemini key or critical emergency where instant response is vital
  if (!gemini) {
    const fallbackResponse = generateDeterministicTriage(request, redFlagResult, protocols);
    return validateAndEnforceSafety(fallbackResponse, request, redFlagResult);
  }

  try {
    const protocolContext = protocols
      .map((p) => `[Protocol: ${p.title} | Source: ${p.source} | Status: ${p.reviewStatus}]`)
      .join('\n');

    const promptText = `
You are InjuryGuard AI's Clinical Safety & Triage Orchestrator.
Your goal is to evaluate the injury request with absolute medical safety rigor: "When in doubt, escalate safely."
Strictly distinguish:
1. OBSERVATION: What can potentially be observed from symptoms or image.
2. POSSIBILITY: What the information may be consistent with (never say "You definitely have X").
3. RISK: Why professional medical evaluation may be required.
4. ACTION: 3-5 immediate first-aid safety steps + strict "DON'T MAKE IT WORSE" contraindications.

Patient Assessment Input:
- Body Part: ${request.bodyPart}
- Symptoms: ${request.symptoms.join(', ')}
- Pain Level: ${request.painLevel} / 10
- Mechanism of Injury: ${request.mechanism}
- Time of Injury: ${request.timeframe}
- User's Description: "${request.userDescription}"
- Voice Transcript: "${request.voiceTranscript || 'None'}"
- Flagged Red Flags: ${JSON.stringify(request.redFlags || {})}
- Red Flag Pre-Screen Result: ${redFlagResult.isCritical ? `CRITICAL (${redFlagResult.triggers.join(', ')})` : 'No immediate life-threats flagged'}

Reference Protocols:
${protocolContext}

Classification Rules:
- LEVEL_1_EMERGENCY: Immediate threat to life, airway, breathing, circulation, severe bleeding, loss of consciousness, open fracture, severe eye trauma, acute shock.
- LEVEL_2_URGENT: Potentially serious injury requiring clinical evaluation within hours (suspected closed fracture with deformity, deep wound, blistered burn, animal bite, persistent high pain).
- LEVEL_3_MEDICAL_REVIEW: Stable injury with moderate symptoms (mild/moderate sprain, non-displaced joint injury, persistent ache) where scheduling an outpatient GP or clinic visit is advisable.
- LEVEL_4_BASIC_FIRST_AID: Minor superficial injury with controlled bleeding, low pain, and no red flags (minor abrasion, tiny cut).

Return structured JSON conforming to the requested schema.
`;

    const contents: any[] = [];
    if (request.imageBase64) {
      // Clean base64 header if present
      const base64Data = request.imageBase64.replace(/^data:image\/\w+;base64,/, '');
      contents.push({
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Data
            }
          },
          { text: promptText }
        ]
      });
    } else {
      contents.push({
        parts: [{ text: promptText }]
      });
    }

    const aiResponse = await gemini.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: contents[0].parts ? contents[0] : promptText,
      config: {
        systemInstruction: `You are the InjuryGuard AI safety triage system. You must prioritize patient safety over everything else. Never make definitive medical diagnoses. Emphasize observation, possibility, risk, and immediate safe action. Return valid JSON only.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            urgencyLevel: {
              type: Type.STRING,
              description: 'One of: LEVEL_1_EMERGENCY, LEVEL_2_URGENT, LEVEL_3_MEDICAL_REVIEW, LEVEL_4_BASIC_FIRST_AID'
            },
            urgencyTitle: { type: Type.STRING },
            urgencyColor: { type: Type.STRING, description: 'red, amber, yellow, or emerald' },
            headlineReason: { type: Type.STRING },
            whyExplanation: { type: Type.STRING },
            confidenceStatement: { type: Type.STRING },
            observableCharacteristics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  characteristic: { type: Type.STRING },
                  visualNote: { type: Type.STRING },
                  potentialConcern: { type: Type.STRING }
                },
                required: ['characteristic', 'visualNote', 'potentialConcern']
              }
            },
            doThisNow: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            avoidDoNotMakeWorse: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            watchForRedFlags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            whenToEscalate: { type: Type.STRING },
            suggestedCareType: {
              type: Type.STRING,
              description: 'One of: emergency_room, urgent_care, primary_care, home_monitoring'
            },
            medicalReportMarkdown: { type: Type.STRING }
          },
          required: [
            'urgencyLevel',
            'urgencyTitle',
            'urgencyColor',
            'headlineReason',
            'whyExplanation',
            'doThisNow',
            'avoidDoNotMakeWorse',
            'watchForRedFlags',
            'whenToEscalate',
            'suggestedCareType'
          ]
        }
      }
    });

    const text = aiResponse.text;
    if (!text) {
      throw new Error('Empty AI response');
    }

    const parsed = JSON.parse(text);

    const fullResponse: TriageAnalysisResponse = {
      id: `triage-${Date.now()}`,
      timestamp: new Date().toISOString(),
      urgencyLevel: (parsed.urgencyLevel as TriageLevel) || 'LEVEL_3_MEDICAL_REVIEW',
      urgencyTitle: parsed.urgencyTitle || 'MEDICAL EVALUATION RECOMMENDED',
      urgencyColor: parsed.urgencyColor || 'yellow',
      headlineReason: parsed.headlineReason || 'Assessment completed based on symptoms.',
      whyExplanation: parsed.whyExplanation || 'Symptom analysis and medical protocol matching completed.',
      confidenceStatement: parsed.confidenceStatement || 'Informational assessment based on provided details.',
      observableCharacteristics: parsed.observableCharacteristics || [],
      visionLimitationsDisclaimer:
        'Medical Safety Notice: External images and descriptions cannot detect internal bleeding, occult fractures, nerve damage, compartment syndrome, or deep organ trauma. When in doubt, always obtain professional medical evaluation.',
      doThisNow: parsed.doThisNow || ['Keep the injured area clean and rested.', 'Seek medical guidance.'],
      avoidDoNotMakeWorse: parsed.avoidDoNotMakeWorse || ['Do not manipulate injured area.'],
      watchForRedFlags: parsed.watchForRedFlags || ['Worsening pain or numbness.'],
      whenToEscalate: parsed.whenToEscalate || 'Seek immediate care if condition worsens.',
      suggestedCareType: parsed.suggestedCareType || 'urgent_care',
      retrievedProtocols: protocols,
      safetyAuditPassed: true,
      escalationTriggers: redFlagResult.triggers,
      medicalReportMarkdown:
        parsed.medicalReportMarkdown ||
        `### INJURY RESPONSE REPORT\n**Time:** ${new Date().toISOString()}\n**Urgency:** ${parsed.urgencyTitle}\n**Mechanism:** ${request.mechanism}\n**Symptoms:** ${request.symptoms.join(', ')}`
    };

    // LAYER 3: Deterministic Post-LLM Safety Validator
    return validateAndEnforceSafety(fullResponse, request, redFlagResult);
  } catch (err) {
    console.warn('Gemini API call encountered error, falling back to deterministic safety engine:', err);
    const fallbackResponse = generateDeterministicTriage(request, redFlagResult, protocols);
    return validateAndEnforceSafety(fallbackResponse, request, redFlagResult);
  }
}

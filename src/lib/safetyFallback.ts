import { InjuryAssessmentRequest, RetrievedProtocolReference, TriageAnalysisResponse, TriageLevel } from '../types';
import { MEDICAL_PROTOCOLS } from '../data/protocols';

export function evaluateRedFlags(request: InjuryAssessmentRequest) {
  const triggers: string[] = [];
  const flags = request.redFlags || {};
  const symptoms = (request.symptoms || []).map(s => s.toLowerCase());
  const desc = (request.userDescription || '').toLowerCase();
  const mech = (request.mechanism || '').toLowerCase();

  if (flags.severeBleeding) triggers.push('Severe / Uncontrolled Bleeding reported');
  if (flags.breathingDifficulty) triggers.push('Respiratory distress / Breathing difficulty');
  if (flags.lossOfConsciousness) triggers.push('Loss of consciousness / Blackout');
  if (flags.severeHeadNeck) triggers.push('High-impact Head or Cervical spine trauma');
  if (flags.embeddedObject) triggers.push('Penetrating foreign object embedded in body');
  if (flags.signsOfShock) triggers.push('Signs of shock');
  if (flags.rapidDeterioration) triggers.push('Rapidly worsening condition');

  if (symptoms.some(s => /unconscious|blackout|fainted|loss of consciousness/.test(s))) triggers.push('Loss of consciousness reported');
  if (symptoms.some(s => /breathing|gasping|suffocating|shortness of breath/.test(s))) triggers.push('Respiratory compromise detected');
  if (symptoms.some(s => /spurting|pulsing blood|uncontrolled bleeding|profuse bleeding/.test(s))) triggers.push('Severe bleeding detected');
  if (symptoms.some(s => /paralysis|cannot move arms|cannot move legs|loss of sensation/.test(s))) triggers.push('Possible acute neurological deficit');
  if (/spurting blood|bleeding heavily|soaked through multiple towels/.test(desc)) triggers.push('Heavy active bleeding described');
  if (/knocked out|passed out|unresponsive|vomiting after head/.test(desc)) triggers.push('Serious head-trauma warning signs described');
  if (/bone sticking out|compound fracture|bone through skin/.test(desc)) triggers.push('Open fracture warning signs described');
  if (/chemical in eye|acid in eye|battery acid/.test(desc)) triggers.push('Chemical eye injury described');

  if ((mech.includes('road accident') || mech.includes('car crash') || mech.includes('high fall')) &&
      (request.painLevel >= 8 || symptoms.some(s => /chest|neck|spine/.test(s)))) {
    triggers.push('High-kinetic mechanism with severe axial pain');
  }
  return { isCritical: triggers.length > 0, triggers };
}

export function retrieveMatchingProtocols(request: InjuryAssessmentRequest): RetrievedProtocolReference[] {
  const text = `${request.bodyPart} ${request.mechanism} ${request.symptoms.join(' ')} ${request.userDescription}`.toLowerCase();
  const matches = MEDICAL_PROTOCOLS.filter(p =>
    (p.category === 'wounds' && /cut|bleed|laceration|wound|bite/.test(text)) ||
    (p.category === 'burns' && /burn|scald|fire|hot liquid|boiling/.test(text)) ||
    (p.category === 'orthopedic' && /fall|twist|fracture|bone|ankle|wrist|sprain|deformity/.test(text)) ||
    (p.category === 'head_neck' && /head|concussion|neck|dizzy|unconscious|vomit/.test(text)) ||
    (p.category === 'trauma' && /eye|vision|chemical|crash|trauma/.test(text))
  );
  const source = matches.length ? matches : MEDICAL_PROTOCOLS.slice(0, 1);
  return source.map(p => ({ id:p.id, title:p.title, source:p.source, version:p.version, lastReviewed:p.lastReviewed, reviewStatus:p.reviewStatus }));
}

export function generateDeterministicTriage(
  request: InjuryAssessmentRequest,
  redFlagResult: { isCritical: boolean; triggers: string[] },
  protocols: RetrievedProtocolReference[]
): TriageAnalysisResponse {
  const { bodyPart, symptoms = [], painLevel, mechanism, timeframe, userDescription = '', redFlags = {} } = request;
  const text = `${bodyPart} ${mechanism} ${symptoms.join(' ')} ${userDescription}`.toLowerCase();
  let urgencyLevel: TriageLevel = 'LEVEL_4_BASIC_FIRST_AID';
  let urgencyTitle = 'BASIC FIRST-AID & ACTIVE MONITORING';
  let urgencyColor = 'emerald';
  let headlineReason = 'No immediate critical red-flag indicators were identified from the information provided.';
  let whyExplanation = 'This is a safety-oriented screening result based only on the information provided.';
  let suggestedCareType: TriageAnalysisResponse['suggestedCareType'] = 'home_monitoring';

  if (redFlagResult.isCritical) {
    urgencyLevel='LEVEL_1_EMERGENCY'; urgencyTitle='LEVEL 1 — EMERGENCY MEDICAL ACTION REQUIRED'; urgencyColor='red';
    headlineReason=`Critical warning signs detected: ${redFlagResult.triggers.slice(0,3).join('; ')}.`;
    whyExplanation='The reported warning signs warrant immediate emergency evaluation.';
    suggestedCareType='emergency_room';
  } else if (painLevel >= 7 || redFlags.deformity || redFlags.numbness || /deformity|numb|tingling|cannot move|bite|blister/.test(text)) {
    urgencyLevel='LEVEL_2_URGENT'; urgencyTitle='LEVEL 2 — URGENT MEDICAL EVALUATION RECOMMENDED'; urgencyColor='amber';
    headlineReason='The reported symptoms may represent a significant injury requiring prompt clinical evaluation.';
    whyExplanation='Severity, deformity, neurological symptoms, or other concerning features were reported.';
    suggestedCareType='urgent_care';
  } else if (painLevel >= 4 || /swelling|bruising|difficulty moving/.test(text) || /day|yesterday/.test(timeframe.toLowerCase())) {
    urgencyLevel='LEVEL_3_MEDICAL_REVIEW'; urgencyTitle='LEVEL 3 — MEDICAL REVIEW RECOMMENDED'; urgencyColor='yellow';
    headlineReason='The reported injury does not appear to have an immediate critical warning sign, but medical review may be appropriate.';
    whyExplanation='Moderate pain or functional symptoms were reported.';
    suggestedCareType='primary_care';
  }

  const doThisNow = redFlagResult.isCritical
    ? ['Call your local emergency medical service now.', 'Stay with the injured person and follow dispatcher instructions.']
    : /burn|scald/.test(text)
      ? ['Cool a thermal burn with clean, cool running water.', 'Remove nearby jewelry or tight items before swelling increases.', 'Cover loosely with a clean non-stick dressing.']
      : /ankle|wrist|knee|foot|leg|arm/.test(text)
        ? ['Rest and support the injured area in a comfortable position.', 'Use a cold pack wrapped in cloth for short periods if comfortable.', 'Arrange medical review if pain, function, or swelling is significant.']
        : ['Keep the affected area clean and protected.', 'Avoid activities that increase pain.', 'Monitor symptoms for worsening or new warning signs.'];

  const avoidDoNotMakeWorse = redFlagResult.isCritical
    ? ['Do not leave the injured person alone.', 'Do not remove an embedded object.', 'Do not delay emergency care for further questionnaire analysis.']
    : /burn|scald/.test(text)
      ? ['Do not apply ice, butter, oils, toothpaste, or other home remedies.', 'Do not pop blisters.']
      : ['Do not force a deformed joint or limb back into place.', 'Do not continue an activity that significantly increases pain.'];

  const watchForRedFlags = ['Sudden worsening pain or swelling', 'New numbness, weakness, or loss of sensation', 'Pale, blue, cold, or unusually swollen skin', 'Dizziness, confusion, breathing difficulty, or uncontrolled bleeding'];

  return {
    id:`triage-${Date.now()}`, timestamp:new Date().toISOString(), urgencyLevel, urgencyTitle, urgencyColor,
    headlineReason, whyExplanation,
    confidenceStatement:'Informational safety screening based on reported symptoms; it is not a diagnosis.',
    observableCharacteristics: request.imageBase64 ? [{ characteristic:'External image provided', visualNote:'The image was supplied as additional context only.', potentialConcern:'An external image cannot rule out internal injury.' }] : [],
    visionLimitationsDisclaimer:'External images and descriptions cannot rule out internal bleeding, occult fractures, nerve damage, or other internal injury.',
    doThisNow, avoidDoNotMakeWorse, watchForRedFlags,
    whenToEscalate: urgencyLevel==='LEVEL_1_EMERGENCY' ? 'Call emergency medical services immediately.' : 'Seek urgent/emergency care if symptoms worsen or a warning sign develops.',
    suggestedCareType, retrievedProtocols:protocols, safetyAuditPassed:true, escalationTriggers:redFlagResult.triggers,
    medicalReportMarkdown:`### INJURY RESPONSE REPORT\n**Urgency:** ${urgencyTitle}\n**Site:** ${bodyPart}\n**Mechanism:** ${mechanism}\n**Pain:** ${painLevel}/10\n**Symptoms:** ${symptoms.join(', ') || 'None specified'}`
  };
}

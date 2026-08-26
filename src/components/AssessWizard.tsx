import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Camera,
  Mic,
  MicOff,
  Upload,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  FileText,
  HeartPulse,
  MapPin,
  Flame,
  Bandage,
  Shield,
  BookOpen,
  Info,
  Trash2,
  RefreshCw,
  Check
} from 'lucide-react';
import {
  InjuryAssessmentRequest,
  TriageAnalysisResponse,
  SafetyBenchmarkTestCase,
  UserPreferences,
  MonitoredInjury
} from '../types';
import { REGIONAL_EMERGENCY_NUMBERS } from '../data/facilities';
import { generateDeterministicTriage, evaluateRedFlags, retrieveMatchingProtocols } from '../../server/safetyPipeline';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';
import { getTranslation } from '../lib/translations';
import { getEmergencyContactInfo } from '../data/emergencyNumbers';

interface AssessWizardProps {
  initialCase?: SafetyBenchmarkTestCase | null;
  onCompleteAssessment: (response: TriageAnalysisResponse, request: InjuryAssessmentRequest) => void;
  onOpenEmergency: () => void;
  onOpenReport: (response: TriageAnalysisResponse) => void;
  onOpenFindHelp: () => void;
  onAddToWatch: (injury: MonitoredInjury) => void;
  userPrefs: UserPreferences;
  onCancel: () => void;
}

const BODY_PARTS = [
  'Head / Face / Eye',
  'Neck / Cervical Spine',
  'Chest / Ribs',
  'Abdomen',
  'Back / Spine',
  'Shoulder / Arm',
  'Elbow / Forearm',
  'Wrist / Hand / Finger',
  'Hip / Thigh',
  'Knee / Lower Leg',
  'Ankle / Foot / Toe',
  'Whole Body / General'
];

const MECHANISMS = [
  'Fall from height or standing',
  'Sports or athletic injury',
  'Road accident / Vehicle crash',
  'Cut / Sharp object / Knife',
  'Burn / Hot liquid / Scald',
  'Blunt trauma / Direct hit',
  'Twist / Rolled joint / Strain',
  'Crush / Heavy object impact',
  'Animal or human bite',
  'Chemical or toxic exposure',
  'Other / Unknown'
];

const COMMON_SYMPTOMS = [
  'Severe pain',
  'Moderate pain',
  'Mild pain',
  'Active bleeding',
  'Minor bleeding (stopped)',
  'Rapid swelling',
  'Bruising / Discoloration',
  'Numbness / Loss of sensation',
  'Tingling / Pins and needles',
  'Weakness in limb',
  'Difficulty moving joint',
  'Visible deformity / Crooked angle',
  'Burning sensation',
  'Blisters forming',
  'Dizziness / Lightheadedness',
  'Loss of consciousness',
  'Breathing difficulty',
  'Nausea / Vomiting'
];

export const AssessWizard: React.FC<AssessWizardProps> = ({
  initialCase,
  onCompleteAssessment,
  onOpenEmergency,
  onOpenReport,
  onOpenFindHelp,
  onAddToWatch,
  userPrefs,
  onCancel
}) => {
  const [step, setStep] = useState<number>(0); // 0: Red Flag Gate, 1: Details, 2: Photo & Voice, 3: Processing, 4: Result
  const [redFlags, setRedFlags] = useState<Record<string, boolean>>({
    severeBleeding: false,
    breathingDifficulty: false,
    lossOfConsciousness: false,
    severeHeadNeck: false,
    embeddedObject: false,
    signsOfShock: false,
    deformity: false,
    numbness: false,
    rapidDeterioration: false
  });

  const [bodyPart, setBodyPart] = useState<string>('Wrist / Hand / Finger');
  const [painLevel, setPainLevel] = useState<number>(5);
  const [mechanism, setMechanism] = useState<string>('Fall from height or standing');
  const [timeframe, setTimeframe] = useState<string>('Less than 1 hour ago');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Moderate pain', 'Rapid swelling']);
  const [customSymptom, setCustomSymptom] = useState<string>('');
  const [userDescription, setUserDescription] = useState<string>('');
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const recognitionRef = useRef<any>(null);

  // Processing state
  const [processingStage, setProcessingStage] = useState<number>(1);
  const [assessmentResult, setAssessmentResult] = useState<TriageAnalysisResponse | null>(null);
  const [currentRequest, setCurrentRequest] = useState<InjuryAssessmentRequest | null>(null);
  const [isAddedToWatch, setIsAddedToWatch] = useState<boolean>(false);

  const regionInfo = REGIONAL_EMERGENCY_NUMBERS[userPrefs.region] || getEmergencyContactInfo(userPrefs.region) || REGIONAL_EMERGENCY_NUMBERS.US;

  // Pre-fill if a demo test case was selected
  useEffect(() => {
    if (initialCase && initialCase.sampleInput) {
      const inp = initialCase.sampleInput;
      if (inp.bodyPart) setBodyPart(inp.bodyPart);
      if (inp.painLevel !== undefined) setPainLevel(inp.painLevel);
      if (inp.mechanism) setMechanism(inp.mechanism);
      if (inp.timeframe) setTimeframe(inp.timeframe);
      if (inp.symptoms) setSelectedSymptoms(inp.symptoms);
      if (inp.userDescription) setUserDescription(inp.userDescription);
      if (inp.redFlags) setRedFlags(inp.redFlags);
    }
  }, [initialCase]);

  // Voice recognition initialization
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = userPrefs.language === 'es' ? 'es-ES' : userPrefs.language === 'hi' ? 'hi-IN' : 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setVoiceTranscript((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setUserDescription((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [userPrefs.language]);

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your description.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Failed to start speech recognition', err);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImageBase64(result);
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleToggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const handleAddCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms([...selectedSymptoms, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const handleToggleRedFlag = (key: string) => {
    setRedFlags((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const hasCriticalRedFlag = Object.values(redFlags).some((val) => val === true);

  // Submit and execute assessment
  const handleRunAssessment = async () => {
    setStep(3); // Go to processing screen
    setProcessingStage(1);

    const requestPayload: InjuryAssessmentRequest = {
      timestamp: new Date().toISOString(),
      bodyPart,
      symptoms: selectedSymptoms,
      painLevel,
      mechanism,
      timeframe,
      userDescription,
      voiceTranscript,
      imageBase64,
      language: userPrefs.language,
      redFlags,
      isDemo: Boolean(initialCase),
      demoCaseId: initialCase?.id
    };

    setCurrentRequest(requestPayload);

    // Multi-stage visual simulation while fetching
    const timer1 = setTimeout(() => setProcessingStage(2), 400);
    const timer2 = setTimeout(() => setProcessingStage(3), 800);
    const timer3 = setTimeout(() => setProcessingStage(4), 1200);

    try {
      const response = await fetch('/api/triage/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });

      if (!response.ok) {
        throw new Error('Server returned error');
      }

      const data: TriageAnalysisResponse = await response.json();
      setAssessmentResult(data);
      onCompleteAssessment(data, requestPayload);

      setTimeout(() => {
        setStep(4); // Show Results
      }, 1500);
    } catch (err) {
      console.warn('Direct API assessment failed, generating deterministic fallback:', err);
      const redFlagResult = evaluateRedFlags(requestPayload);
      const fallback = generateDeterministicTriage(
        requestPayload,
        redFlagResult,
        retrieveMatchingProtocols(requestPayload)
      );
      setAssessmentResult(fallback);
      onCompleteAssessment(fallback, requestPayload);
      setTimeout(() => {
        setStep(4);
      }, 1500);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  const handleSaveToWatchList = () => {
    if (!assessmentResult || !currentRequest) return;
    const newInjury: MonitoredInjury = {
      id: `injury-${Date.now()}`,
      title: `${currentRequest.bodyPart} (${currentRequest.mechanism.split('/')[0].trim()})`,
      initialAssessment: assessmentResult,
      originalInput: currentRequest,
      createdAt: new Date().toISOString(),
      status: assessmentResult.urgencyLevel === 'LEVEL_1_EMERGENCY' ? 'escalated' : 'active',
      entries: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          painScore: currentRequest.painLevel,
          bleedingStatus: currentRequest.redFlags.severeBleeding ? 'uncontrolled' : 'none',
          swellingStatus: 'stable',
          mobilityStatus: currentRequest.redFlags.deformity ? 'unable_to_move' : 'limited',
          sensationStatus: currentRequest.redFlags.numbness ? 'numb' : 'normal',
          temperatureFever: false,
          notes: 'Initial triage baseline log entry created.',
          deteriorationDetected: false
        }
      ],
      lastUpdated: new Date().toISOString(),
      highestSeveritySeen: assessmentResult.urgencyLevel
    };

    onAddToWatch(newInjury);
    setIsAddedToWatch(true);
  };

  return (
    <div className="max-w-4xl mx-auto pb-16 animate-fadeIn">
      {/* Progress Header */}
      <Card variant="raised" padding="sm" className="mb-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#ecf7f3] dark:bg-emerald-950/60 text-[#0d7a5f] dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
              {step === 0 ? '1' : step === 1 ? '2' : step === 2 ? '3' : step === 3 ? 'AI' : '✓'}
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                {step === 0 && `Step 1: ${getTranslation(userPrefs.language, 'safetyCheck')}`}
                {step === 1 && 'Step 2: Injury Location & Symptoms'}
                {step === 2 && 'Step 3: Narrative & Photo (Optional)'}
                {step === 3 && 'Analyzing Injury & Safety Rules'}
                {step === 4 && getTranslation(userPrefs.language, 'assessInjury')}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {step === 0 && getTranslation(userPrefs.language, 'emergencyWarning')}
                {step === 1 && 'Select anatomical region, pain score, and observed symptoms.'}
                {step === 2 && 'Provide written context, voice dictation, or injury photos.'}
                {step === 3 && 'Cross-referencing verified clinical first-aid protocols.'}
                {step === 4 && 'Evidence-grounded triage guidance based on your reported inputs.'}
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>

        {/* Step indicator bar */}
        <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-[#1e2c25]">
          <div className={`h-1.5 rounded-full transition-colors ${step >= 0 ? 'bg-[#0d7a5f] dark:bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
          <div className={`h-1.5 rounded-full transition-colors ${step >= 1 ? 'bg-[#0d7a5f] dark:bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
          <div className={`h-1.5 rounded-full transition-colors ${step >= 2 ? 'bg-[#0d7a5f] dark:bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
          <div className={`h-1.5 rounded-full transition-colors ${step >= 4 ? 'bg-[#0d7a5f] dark:bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
        </div>
      </Card>

      {/* STEP 0: EMERGENCY RED FLAG SAFETY GATE */}
      {step === 0 && (
        <div className="space-y-6">
          <Card variant="default" className="space-y-5">
            <div className="flex items-center space-x-2.5 text-slate-900 dark:text-white">
              <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h3 className="text-base sm:text-lg font-bold tracking-tight">Critical Safety Screening</h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Please check if any of the following potentially life-threatening warning signs are present:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: 'severeBleeding', label: 'Severe / Spurting Bleeding', desc: 'Blood pulsing or soaking through towels rapidly' },
                { key: 'breathingDifficulty', label: 'Breathing Difficulty', desc: 'Gasping, choking, severe shortness of breath, or blue lips' },
                { key: 'lossOfConsciousness', label: 'Loss of Consciousness', desc: 'Fainted, knocked out cold, or unresponsive at any point' },
                { key: 'severeHeadNeck', label: 'Severe Head / Spinal Trauma', desc: 'High impact fall, severe neck pain, inability to move limbs' },
                { key: 'embeddedObject', label: 'Embedded Foreign Object', desc: 'Knife, glass, metal, or wood puncturing and stuck in body' },
                { key: 'signsOfShock', label: 'Signs of Shock', desc: 'Pale, cold clammy skin, intense dizziness, confusion, rapid pulse' },
                { key: 'deformity', label: 'Gross Deformity / Open Bone', desc: 'Limb bent at abnormal angle or bone piercing through skin' },
                { key: 'rapidDeterioration', label: 'Rapid Deterioration', desc: 'Patient state is getting visibly worse minute-by-minute' }
              ].map((flag) => (
                <label
                  key={flag.key}
                  className={`flex items-start space-x-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none ${
                    redFlags[flag.key]
                      ? 'bg-red-50/80 dark:bg-red-950/40 border-red-400 text-red-900 dark:text-red-200'
                      : 'bg-slate-50/70 dark:bg-[#15201a] border-slate-200 dark:border-[#1e2c25] text-slate-800 dark:text-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={Boolean(redFlags[flag.key])}
                    onChange={() => handleToggleRedFlag(flag.key)}
                    className="w-4 h-4 mt-0.5 rounded text-red-600 focus:ring-red-500 border-slate-300 cursor-pointer"
                  />
                  <div>
                    <p className="font-bold text-xs sm:text-sm">{flag.label}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{flag.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {/* If Red Flag is checked -> Show prominent emergency override */}
            {hasCriticalRedFlag && (
              <div className="bg-red-600 text-white rounded-2xl p-5 space-y-3 shadow-lg">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5" />
                  <h4 className="font-extrabold text-sm uppercase tracking-wide">POTENTIAL EMERGENCY DETECTED</h4>
                </div>
                <p className="text-xs sm:text-sm text-red-100">
                  Because you reported critical red-flag symptoms, do not delay for questionnaire analysis. 
                  Call emergency medical services immediately.
                </p>
                <div className="pt-1 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={onOpenEmergency}
                    className="bg-white text-red-700 hover:bg-red-50"
                  >
                    Open Emergency Mode (Dial {regionInfo.generalEmergency})
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setStep(1)}
                    className="text-white hover:bg-red-700"
                  >
                    Continue Assessment Anyway
                  </Button>
                </div>
              </div>
            )}

            {/* Safe Proceed Button */}
            {!hasCriticalRedFlag && (
              <div className="pt-2 flex justify-end">
                <Button
                  size="md"
                  variant="primary"
                  onClick={() => setStep(1)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  id="safety-gate-next-btn"
                >
                  {getTranslation(userPrefs.language, 'assessInjury')} — {getTranslation(userPrefs.language, 'continueAction')}
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* STEP 1: INJURY DETAILS */}
      {step === 1 && (
        <div className="space-y-6">
          <Card variant="default" className="space-y-6">
            
            {/* Body Part Selection */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                1. What body part was injured?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {BODY_PARTS.map((bp) => {
                  const isSelected = bodyPart === bp;
                  return (
                    <button
                      key={bp}
                      type="button"
                      onClick={() => setBodyPart(bp)}
                      className={`text-xs font-semibold p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#ecf7f3] dark:bg-emerald-950/60 border-[#0d7a5f] dark:border-emerald-500 text-[#0d7a5f] dark:text-emerald-300 font-bold shadow-2xs'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      {bp}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pain Scale (1-10) */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/40 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  2. Pain Intensity Score (1 to 10)
                </label>
                <Badge
                  variant={painLevel >= 8 ? 'emergency' : painLevel >= 5 ? 'urgent' : 'first_aid'}
                  size="sm"
                >
                  {painLevel} / 10 — {painLevel <= 3 ? 'Mild' : painLevel <= 6 ? 'Moderate' : painLevel <= 8 ? 'Severe' : 'Agonizing'}
                </Badge>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={painLevel}
                onChange={(e) => setPainLevel(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0d7a5f]"
                id="pain-slider"
              />
              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                <span>1 (Barely noticeable)</span>
                <span>5 (Distracting ache)</span>
                <span>10 (Worst pain imaginable)</span>
              </div>
            </div>

            {/* Mechanism of Injury */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                3. How did the injury happen? (Mechanism)
              </label>
              <select
                value={mechanism}
                onChange={(e) => setMechanism(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3 text-xs sm:text-sm focus:outline-hidden"
              >
                {MECHANISMS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Elapsed */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                4. When did this happen?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  'Just now (< 15 mins)',
                  'Less than 1 hour ago',
                  'Several hours ago',
                  'Yesterday',
                  'More than a day ago'
                ].map((t) => {
                  const isSelected = timeframe === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTimeframe(t)}
                      className={`text-xs p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold border-transparent shadow-xs'
                          : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Symptoms Tags */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                5. Select all reported symptoms:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_SYMPTOMS.map((sym) => {
                  const selected = selectedSymptoms.includes(sym);
                  return (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => handleToggleSymptom(sym)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                        selected
                          ? 'bg-[#0d7a5f] text-white border-[#0d7a5f] font-bold shadow-2xs'
                          : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {selected ? '✓ ' : '+ '}
                      {sym}
                    </button>
                  );
                })}
              </div>

              {/* Add Custom Symptom */}
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Other symptom (e.g. skin feels cold, clicking sound)..."
                  value={customSymptom}
                  onChange={(e) => setCustomSymptom(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomSymptom();
                    }
                  }}
                  className="flex-1 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-hidden"
                />
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleAddCustomSymptom}
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="pt-4 flex justify-between border-t border-slate-100 dark:border-[#1e2c25]">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setStep(0)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>

              <Button
                size="md"
                variant="primary"
                onClick={() => setStep(2)}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                id="details-next-btn"
              >
                Next: Photo & Voice Narrative
              </Button>
            </div>

          </Card>
        </div>
      )}

      {/* STEP 2: PHOTO & VOICE NARRATIVE */}
      {step === 2 && (
        <div className="space-y-6">
          <Card variant="default" className="space-y-6">
            
            {/* Optional Photo Section with Safety Guide */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
                  <Camera className="w-4 h-4 text-slate-500" />
                  <span>Optional Injury Photo (Visual Inspection)</span>
                </label>
                <span className="text-[11px] text-slate-500 font-medium">Optional</span>
              </div>

              {/* Safety rules before taking photo */}
              <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                <p className="font-bold text-slate-800 dark:text-slate-200">Photography Safety Guidelines:</p>
                <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                  <li>Take the image in good, clear lighting.</li>
                  <li><strong>Do NOT press, manipulate, or twist the injury</strong> to get a better angle.</li>
                  <li><strong>Do NOT delay emergency medical care</strong> for the sake of taking a picture.</li>
                  <li>Avoid unnecessary exposure of private anatomical areas.</li>
                </ul>
              </div>

              {/* Image Preview or Upload Buttons */}
              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 max-w-sm mx-auto bg-slate-950">
                  <img src={imagePreview} alt="Injury preview" className="w-full h-48 object-cover" />
                  <button
                    onClick={() => {
                      setImageBase64(undefined);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors shadow-md"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="p-2 bg-slate-900/90 text-white text-[11px] text-center font-medium">
                    Photo attached for visual characteristic inspection
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-6 text-center space-y-3 hover:border-slate-400 transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-600 dark:text-slate-400">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Upload or capture an injury image
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      JPG, PNG or WEBP (Max 15MB)
                    </p>
                  </div>
                  <label className="inline-flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs px-4 py-2 rounded-xl cursor-pointer transition-colors border border-slate-300 dark:border-slate-600">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Select Photo</span>
                    <input type="file" accept="image/*" capture="environment" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              )}
            </div>

            {/* Voice & Written Description */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Describe what happened in your own words:
                </label>
                <button
                  type="button"
                  onClick={toggleVoiceRecording}
                  className={`flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                    isRecording
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                  id="voice-record-btn"
                >
                  {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-[#0d7a5f] dark:text-emerald-400" />}
                  <span>{isRecording ? 'Listening (Tap to Stop)...' : 'Dictate with Voice'}</span>
                </button>
              </div>

              <textarea
                rows={4}
                value={userDescription}
                onChange={(e) => setUserDescription(e.target.value)}
                placeholder="Example: I slipped on wet grass and landed on my right wrist. I heard a popping sound, and now it's swelling quickly and hurts whenever I try to move my fingers..."
                className="w-full bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl p-3.5 text-xs sm:text-sm focus:outline-hidden"
                id="description-textarea"
              />
            </div>

            {/* Navigation Buttons */}
            <div className="pt-4 flex justify-between border-t border-slate-100 dark:border-[#1e2c25]">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setStep(1)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>

              <Button
                size="md"
                variant="primary"
                onClick={handleRunAssessment}
                leftIcon={<Activity className="w-4 h-4" />}
                id="run-triage-analysis-btn"
              >
                {getTranslation(userPrefs.language, 'assessInjury')}
              </Button>
            </div>

          </Card>
        </div>
      )}

      {/* STEP 3: MULTI-LAYER SAFETY PROCESSING */}
      {step === 3 && (
        <Card variant="raised" className="text-center space-y-6 max-w-lg mx-auto py-10">
          <div className="w-14 h-14 rounded-2xl bg-[#ecf7f3] dark:bg-emerald-950/60 text-[#0d7a5f] dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
            <Shield className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Preparing Your Safety Guidance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Cross-referencing reported trauma against verified medical safety rules...
            </p>
          </div>

          <div className="space-y-2.5 text-left max-w-sm mx-auto">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
              <span className={`w-2.5 h-2.5 rounded-full transition-colors ${processingStage >= 1 ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">1. Screening urgent red flag criteria</span>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
              <span className={`w-2.5 h-2.5 rounded-full transition-colors ${processingStage >= 2 ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">2. Matching practical first-aid protocols</span>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
              <span className={`w-2.5 h-2.5 rounded-full transition-colors ${processingStage >= 3 ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">3. Enforcing harm prevention contraindications</span>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
              <span className={`w-2.5 h-2.5 rounded-full transition-colors ${processingStage >= 4 ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}></span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">4. Formulating structured clinician handoff</span>
            </div>
          </div>
        </Card>
      )}

      {/* STEP 4: ACTION PLAN RESULT */}
      {step === 4 && assessmentResult && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Main Urgency Pill Banner */}
          <div
            className={`rounded-3xl p-6 sm:p-8 text-white shadow-md border ${
              assessmentResult.urgencyLevel === 'LEVEL_1_EMERGENCY'
                ? 'bg-gradient-to-br from-red-600 via-red-700 to-rose-900 border-red-500'
                : assessmentResult.urgencyLevel === 'LEVEL_2_URGENT'
                ? 'bg-gradient-to-br from-orange-600 via-amber-600 to-orange-800 border-orange-500'
                : assessmentResult.urgencyLevel === 'LEVEL_3_MEDICAL_REVIEW'
                ? 'bg-gradient-to-br from-amber-600 via-yellow-600 to-amber-700 border-amber-500'
                : 'bg-gradient-to-br from-[#0d7a5f] to-emerald-800 border-emerald-600'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  <span>{assessmentResult.urgencyLevel.replace(/_/g, ' ')}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">{assessmentResult.urgencyTitle}</h1>
                <p className="text-white/90 text-xs sm:text-sm mt-1 font-medium leading-relaxed">{assessmentResult.headlineReason}</p>
              </div>

              {assessmentResult.urgencyLevel === 'LEVEL_1_EMERGENCY' && (
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={onOpenEmergency}
                  className="bg-white text-red-700 hover:bg-red-50 font-extrabold whitespace-nowrap self-start sm:self-center"
                >
                  CALL {regionInfo.generalEmergency} NOW
                </Button>
              )}
            </div>
          </div>

          {/* Explanation: "Why am I seeing this result?" */}
          <Card variant="default" className="space-y-3">
            <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold text-sm">
              <Info className="w-4 h-4 text-sky-500" />
              <span>Why am I seeing this urgency classification?</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {assessmentResult.whyExplanation}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
              Confidence & Safety Assessment: {assessmentResult.confidenceStatement}
            </p>
          </Card>

          {/* Observable Characteristics (If image provided) */}
          {assessmentResult.observableCharacteristics && assessmentResult.observableCharacteristics.length > 0 && (
            <Card variant="raised" className="space-y-3">
              <div className="flex items-center space-x-2 text-slate-900 dark:text-white font-bold text-xs uppercase tracking-wider">
                <Camera className="w-4 h-4 text-slate-500" />
                <span>Observable Visual Characteristics (Non-Diagnostic)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {assessmentResult.observableCharacteristics.map((obs, idx) => (
                  <div key={idx} className="bg-white dark:bg-[#121915] p-3.5 rounded-xl border border-slate-200 dark:border-[#1e2c25] text-xs space-y-1">
                    <p className="font-bold text-slate-900 dark:text-white">{obs.characteristic}</p>
                    <p className="text-slate-600 dark:text-slate-400 text-[11px]">{obs.visualNote}</p>
                    <p className="text-amber-700 dark:text-amber-400 text-[10px] font-semibold">{obs.potentialConcern}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* PRIORITY ACTION 1: DO THIS NOW (Immediate Steps) */}
          <Card variant="default" className="space-y-4">
            <div className="flex items-center space-x-2 text-[#0d7a5f] dark:text-emerald-400 font-bold text-sm uppercase tracking-wider">
              <CheckCircle2 className="w-5 h-5" />
              <span>DO THIS NOW (Immediate Safe Actions)</span>
            </div>

            <div className="space-y-2.5">
              {assessmentResult.doThisNow.map((action, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-[#0d7a5f] text-white font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-950 dark:text-emerald-200 mt-0.5 leading-relaxed">
                    {action}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* PRIORITY ACTION 2: DON'T MAKE IT WORSE (Harm Prevention / Contraindications) */}
          <div className="bg-gradient-to-br from-red-950/90 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border-2 border-red-500/80 shadow-lg space-y-4">
            <div className="flex items-center space-x-2 text-red-400 font-extrabold text-sm uppercase tracking-wider">
              <XCircle className="w-5 h-5" />
              <span>DON'T MAKE IT WORSE (Crucial Harm Prevention)</span>
            </div>

            <div className="space-y-2">
              {assessmentResult.avoidDoNotMakeWorse.map((avoidItem, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-3 rounded-xl bg-red-900/30 border border-red-700/50">
                  <span className="text-red-400 font-bold text-sm">✕</span>
                  <p className="text-xs sm:text-sm font-bold text-red-100 leading-relaxed">
                    {avoidItem}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Watch for Deterioration / Red Flags */}
          <Card variant="default" className="space-y-4">
            <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-bold text-sm uppercase tracking-wider">
              <AlertTriangle className="w-5 h-5" />
              <span>Watch For These Warning Signs (When to Escalate)</span>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
              {assessmentResult.watchForRedFlags.map((flag, idx) => (
                <li key={idx} className="flex items-center space-x-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                  <span className="font-medium">{flag}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2 text-xs font-semibold text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-[#1e2c25]">
              <strong>Escalation Directive:</strong> {assessmentResult.whenToEscalate}
            </div>
          </Card>

          {/* Retrieved Medical Protocols */}
          {assessmentResult.retrievedProtocols && assessmentResult.retrievedProtocols.length > 0 && (
            <div className="bg-slate-50 dark:bg-slate-800/30 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                <BookOpen className="w-4 h-4 text-sky-500 shrink-0" />
                <span>
                  <strong>Grounded in Authoritative Medical Sources:</strong> {assessmentResult.retrievedProtocols.map((p) => `${p.title} (${p.source})`).join('; ')}
                </span>
              </div>
              <Badge variant="info" size="sm" className="self-start sm:self-center">
                Validated Reference
              </Badge>
            </div>
          )}

          {/* Core Action Tools Bottom Bar */}
          <Card variant="raised" className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-2.5">
              
              {/* Add to Injury Watch */}
              <Button
                size="sm"
                variant={isAddedToWatch ? 'subtle' : 'secondary'}
                onClick={handleSaveToWatchList}
                disabled={isAddedToWatch}
                leftIcon={isAddedToWatch ? <Check className="w-4 h-4" /> : <HeartPulse className="w-4 h-4 text-rose-500" />}
                id="add-to-watch-btn"
              >
                {isAddedToWatch ? 'Added to Injury Watch' : 'Add to Injury Watch Tracker'}
              </Button>

              {/* Show Medical Report */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => onOpenReport(assessmentResult)}
                leftIcon={<FileText className="w-4 h-4 text-sky-500" />}
                id="doctor-report-btn"
              >
                Show Emergency Medical Report
              </Button>

              {/* Find Healthcare */}
              <Button
                size="sm"
                variant="outline"
                onClick={onOpenFindHelp}
                leftIcon={<MapPin className="w-4 h-4 text-amber-500" />}
                id="find-nearby-care-btn"
              >
                Find Nearby Care
              </Button>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setStep(0);
                setAssessmentResult(null);
                setIsAddedToWatch(false);
              }}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Assess Another Injury
            </Button>
          </Card>

        </div>
      )}

    </div>
  );
};

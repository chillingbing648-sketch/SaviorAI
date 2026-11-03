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
  ArrowDown,
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
  Check,
  Sparkles,
  HelpCircle,
  AlertOctagon,
  Eye,
  Bone,
  Brain,
  Droplets,
  Wind,
  Hand,
  Footprints,
  Scissors,
  RotateCcw,
  User,
  Zap,
  Plus,
  Crosshair,
  Ban,
  Stethoscope,
  TrendingDown,
  PhoneCall
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  InjuryAssessmentRequest,
  TriageAnalysisResponse,
  SafetyBenchmarkTestCase,
  UserPreferences,
  MonitoredInjury
} from '../types';
import { REGIONAL_EMERGENCY_NUMBERS } from '../data/facilities';
import { generateDeterministicTriage, evaluateRedFlags, retrieveMatchingProtocols } from '../lib/safetyFallback';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';
import { getTranslation } from '../lib/translations';
import { getEmergencyContactInfo } from '../data/emergencyNumbers';
import { apiFetch, isStaticPagesHost } from '../lib/api';

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

// Clinically grouped anatomical regions with dedicated SVG icons
interface BodyPartOption {
  name: string;
  anatomicalClass: 'Axial Skeleton & Torso' | 'Upper Extremity' | 'Lower Extremity';
  icon: React.ReactNode;
}

const CLINICAL_BODY_PARTS: BodyPartOption[] = [
  { name: 'Head / Cranium / Facial Bones / Eye', anatomicalClass: 'Axial Skeleton & Torso', icon: <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" /> },
  { name: 'Neck / Cervical Spine', anatomicalClass: 'Axial Skeleton & Torso', icon: <Activity className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" /> },
  { name: 'Chest / Rib Cage / Thorax', anatomicalClass: 'Axial Skeleton & Torso', icon: <HeartPulse className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" /> },
  { name: 'Abdomen / Visceral / Flank', anatomicalClass: 'Axial Skeleton & Torso', icon: <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" /> },
  { name: 'Back / Thoracolumbar Spine', anatomicalClass: 'Axial Skeleton & Torso', icon: <Activity className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" /> },
  { name: 'Shoulder Girdle / Clavicle / Humerus', anatomicalClass: 'Upper Extremity', icon: <Bone className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" /> },
  { name: 'Elbow / Forearm (Radius & Ulna)', anatomicalClass: 'Upper Extremity', icon: <Bone className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" /> },
  { name: 'Wrist / Carpus / Hand / Digits', anatomicalClass: 'Upper Extremity', icon: <Hand className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" /> },
  { name: 'Pelvis / Hip / Femoral Joint', anatomicalClass: 'Lower Extremity', icon: <Bone className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" /> },
  { name: 'Knee / Patella / Tibia & Fibula', anatomicalClass: 'Lower Extremity', icon: <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" /> },
  { name: 'Ankle / Tarsus / Foot / Toes', anatomicalClass: 'Lower Extremity', icon: <Footprints className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" /> },
  { name: 'Polytrauma / Multi-Site Injury', anatomicalClass: 'Axial Skeleton & Torso', icon: <User className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0" /> }
];

// Injury mechanisms framed with trauma biomechanics context
interface MechanismOption {
  name: string;
  biomechanicsTag: string;
  icon: React.ReactNode;
}

const CLINICAL_MECHANISMS: MechanismOption[] = [
  { name: 'Deceleration fall (from standing, elevation, or stairs)', biomechanicsTag: 'Gravitational / Axial Deceleration', icon: <ArrowDown className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" /> },
  { name: 'Motor vehicle, motorcycle, or pedestrian collision', biomechanicsTag: 'High-Kinetic Multi-Vector Energy', icon: <AlertOctagon className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" /> },
  { name: 'High-speed sports collision or athletic impact', biomechanicsTag: 'Direct Kinetic Deceleration', icon: <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" /> },
  { name: 'Penetrating wound / knife / broken glass / sharp edge', biomechanicsTag: 'Shearing Soft-Tissue Penetration', icon: <Scissors className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" /> },
  { name: 'Thermal scald / hot liquid / direct flame or steam', biomechanicsTag: 'Thermal Epithelial Destruction', icon: <Flame className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" /> },
  { name: 'Direct blunt force contusion / strike / heavy blow', biomechanicsTag: 'Compressive Mechanical Shock', icon: <ShieldAlert className="w-4 h-4 text-slate-600 dark:text-slate-400 shrink-0" /> },
  { name: 'Rotational torque / severe joint twisting or sprain', biomechanicsTag: 'Torsional Ligamentous Strain', icon: <RotateCcw className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" /> },
  { name: 'Crush compression under heavy object or machinery', biomechanicsTag: 'Compartmental & Ischemic Risk', icon: <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" /> },
  { name: 'Mammalian bite (animal or human tooth puncture)', biomechanicsTag: 'Polymicrobial Inoculation Risk', icon: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" /> },
  { name: 'Corrosive chemical or caustic agent exposure', biomechanicsTag: 'Chemical Coagulation/Liquefaction', icon: <Droplets className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" /> },
  { name: 'Other or unwitnessed trauma', biomechanicsTag: 'Undifferentiated Trauma', icon: <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" /> }
];

// Clinically structured review of systems (ROS) for acute trauma
interface ClinicalSymptomCategory {
  category: string;
  systemTag: string;
  icon: React.ReactNode;
  items: string[];
}

const CLINICAL_SYMPTOM_CATEGORIES: ClinicalSymptomCategory[] = [
  {
    category: 'Vascular & Hemorrhage Control',
    systemTag: 'Circulatory / Hemostasis',
    icon: <Droplets className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />,
    items: [
      'Active capillary bleeding',
      'Controlled oozing (bleeding stopped)',
      'Deep gaping dermis / subcutaneous exposure',
      'Punctate puncture wound',
      'Expanding subcutaneous hematoma',
      'Foreign body / glass / gravel in wound'
    ]
  },
  {
    category: 'Neurovascular & Sensorimotor',
    systemTag: 'Peripheral Nervous & Vascular',
    icon: <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />,
    items: [
      'Distal numbness / loss of tactile sensation',
      'Paresthesia (pins, needles, or tingling)',
      'Motor paresis / unable to move digits',
      'Cold, pale, or mottled extremity distal to injury',
      'Diminished or absent distal pulse',
      'Radiating electric pain down extremity'
    ]
  },
  {
    category: 'Musculoskeletal & Structural Integrity',
    systemTag: 'Orthopedic / Bone & Joint',
    icon: <Bone className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />,
    items: [
      'Visible osseous deformity or abnormal angulation',
      'Complete inability to bear weight (Ottawa rule)',
      'Rapid, severe periarticular edema (swelling)',
      'Ecchymosis / extensive cutaneous bruising',
      'Audible or palpable snap, pop, or crepitus',
      'Joint lock or abnormal hyperextension'
    ]
  },
  {
    category: 'Dermatologic, Thermal & Systemic Signs',
    systemTag: 'Integumentary & Vital Status',
    icon: <Flame className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0" />,
    items: [
      'Epidermal blisters forming or deroofed skin',
      'Circumferential burn involving full limb segment',
      'White, charred, or leathery insensate dermis',
      'Post-traumatic nausea, vomiting, or dizziness',
      'Retrograde or anterograde amnesia (concussion sign)',
      'Localized pyrexia (fever or spreading hot skin margin)'
    ]
  }
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
  // Step 0: Emergency Primary Survey (Red Flags), 1: Trauma Localization & Symptoms, 2: HPI & Photo, 3: Processing, 4: Clinical Plan
  const [step, setStep] = useState<number>(0);

  // Clinical Input State (Starts in 100% neutral unselected baseline)
  const [bodyPart, setBodyPart] = useState<string>('');
  const [painLevel, setPainLevel] = useState<number>(0);
  const [mechanism, setMechanism] = useState<string>('');
  const [timeframe, setTimeframe] = useState<string>('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState<string>('');
  const [userDescription, setUserDescription] = useState<string>('');
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Life-Threat Red Flag Screening
  const [redFlags, setRedFlags] = useState<{ [key: string]: boolean }>({
    severeBleeding: false,
    breathingDifficulty: false,
    lossOfConsciousness: false,
    severeHeadNeck: false,
    embeddedObject: false,
    signsOfShock: false,
    deformity: false,
    rapidDeterioration: false
  });

  // Triage Execution State
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<number>(0);
  const [assessmentResult, setAssessmentResult] = useState<TriageAnalysisResponse | null>(null);
  const [currentRequest, setCurrentRequest] = useState<InjuryAssessmentRequest | null>(null);
  const [isAddedToWatch, setIsAddedToWatch] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Audio dictation state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string>('');
  const recognitionRef = useRef<any>(null);
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  const regionInfo =
    REGIONAL_EMERGENCY_NUMBERS[userPrefs.region] ||
    getEmergencyContactInfo(userPrefs.region) ||
    REGIONAL_EMERGENCY_NUMBERS.US;

  // Prefill benchmark case if provided
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

  // Voice recognition lifecycle
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

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      timersRef.current.forEach(clearTimeout);
    };
  }, [userPrefs.language]);

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not available in this browser. Please type your narrative history.');
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

    if (file.size > 15 * 1024 * 1024) {
      alert('Image file exceeds the 15MB clinical photo limit. Please select a compressed image.');
      return;
    }

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
    const trimmed = customSymptom.trim();
    if (trimmed && !selectedSymptoms.includes(trimmed)) {
      setSelectedSymptoms([...selectedSymptoms, trimmed]);
      setCustomSymptom('');
    }
  };

  const handleToggleRedFlag = (key: string) => {
    setRedFlags((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const hasCriticalRedFlag = Object.values(redFlags).some(Boolean);

  const handleProceedToStep2 = () => {
    if (!bodyPart) {
      setValidationError('Clinical assessment requires specifying the primary anatomical location of trauma.');
      return;
    }
    setValidationError(null);
    setStep(2);
  };

  const handleRunAssessment = async () => {
    setIsAnalyzing(true);
    setStep(3);
    setProcessingStage(1);

    const requestPayload: InjuryAssessmentRequest = {
      timestamp: new Date().toISOString(),
      language: userPrefs.language || 'en',
      bodyPart,
      symptoms: selectedSymptoms,
      painLevel,
      mechanism: mechanism || 'Undifferentiated mechanical trauma',
      timeframe: timeframe || 'Acute (< 1 hour)',
      userDescription,
      imageBase64,
      redFlags: {
        severeBleeding: Boolean(redFlags.severeBleeding),
        breathingDifficulty: Boolean(redFlags.breathingDifficulty),
        lossOfConsciousness: Boolean(redFlags.lossOfConsciousness),
        severeHeadNeck: Boolean(redFlags.severeHeadNeck),
        embeddedObject: Boolean(redFlags.embeddedObject),
        signsOfShock: Boolean(redFlags.signsOfShock),
        deformity: Boolean(redFlags.deformity),
        numbness: selectedSymptoms.some((s) => s.toLowerCase().includes('numb')),
        rapidDeterioration: Boolean(redFlags.rapidDeterioration)
      }
    };

    setCurrentRequest(requestPayload);

    // Realistic clinical triage progression stages
    const t1 = setTimeout(() => setProcessingStage(2), 350);
    const t2 = setTimeout(() => setProcessingStage(3), 700);
    const t3 = setTimeout(() => setProcessingStage(4), 1050);
    timersRef.current.push(t1, t2, t3);

    const runLocalSafetyEngine = () => {
      const redFlagResult = evaluateRedFlags(requestPayload);
      const fallback = generateDeterministicTriage(
        requestPayload,
        redFlagResult,
        retrieveMatchingProtocols(requestPayload)
      );
      setAssessmentResult(fallback);
      onCompleteAssessment(fallback, requestPayload);
      setTimeout(() => setStep(4), 1500);
    };

    if (isStaticPagesHost()) {
      runLocalSafetyEngine();
      return;
    }

    try {
      const res = await fetch('/api/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload)
      });

      if (!res.ok) throw new Error(`Assessment API returned HTTP ${res.status}`);

      const data: TriageAnalysisResponse = await res.json();
      setAssessmentResult(data);
      onCompleteAssessment(data, requestPayload);

      const tDone = setTimeout(() => {
        setStep(4);
      }, 1400);
      timersRef.current.push(tDone);
    } catch (err) {
      console.warn('Backend triage API unavailable, executing local deterministic safety engine:', err);
      const redFlagResult = evaluateRedFlags(requestPayload);
      const fallback = generateDeterministicTriage(
        requestPayload,
        redFlagResult,
        retrieveMatchingProtocols(requestPayload)
      );
      fallback.isAIAssisted = false;
      setAssessmentResult(fallback);
      onCompleteAssessment(fallback, requestPayload);

      const tDoneFallback = setTimeout(() => {
        setStep(4);
      }, 1400);
      timersRef.current.push(tDoneFallback);
    }
  };

  const handleSaveToWatchList = () => {
    if (!assessmentResult || !currentRequest) return;
    const newInjury: MonitoredInjury = {
      id: `injury-${Date.now()}`,
      title: `${currentRequest.bodyPart.split('/')[0].trim()} (${(currentRequest.mechanism || 'Trauma').split('/')[0].trim()})`,
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
          notes: 'Initial clinical triage baseline recorded into longitudinal Injury Watch.',
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
      
      {/* Wizard Step Progression Indicator */}
      <Card variant="raised" padding="sm" className="mb-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#ecf7f3] dark:bg-[#122e25] text-[#0d7a5f] dark:text-[#00BE88] flex items-center justify-center font-black text-xs border border-[#b8e2d4] dark:border-[#1e4e40]">
              {step === 0 ? '1' : step === 1 ? '2' : step === 2 ? '3' : step === 3 ? '...' : <Check className="w-4 h-4 text-emerald-600 dark:text-[#00BE88]" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0d7a5f] dark:text-[#00BE88] bg-[#ecf7f3] dark:bg-[#122e25] px-2 py-0.5 rounded-md">
                  CLINICAL TRAUMA INTAKE
                </span>
                <span className="text-[11px] text-[#4e665f] dark:text-[#8eada3]">
                  Emergency Severity Index Protocol
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#081a14] dark:text-[#f5fbf8] mt-0.5">
                {step === 0 && 'Primary Trauma Survey: High-Threat Life Screening'}
                {step === 1 && 'Secondary Assessment: Anatomical Site, Biomechanics & Review of Systems'}
                {step === 2 && 'History of Present Illness (HPI) & Adjunctive Inspection'}
                {step === 3 && 'Evaluating Trauma Biomechanics & Safety Rule Base'}
                {step === 4 && 'Evidence-Based Triage Plan & SBAR Clinical Handoff'}
              </h2>
            </div>
          </div>

          <Button size="sm" variant="outline" onClick={onCancel}>
            Exit
          </Button>
        </div>

        {/* Visual Step Progress Bar */}
        <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-[#d1ded9] dark:border-[#1b4136]">
          <div className={`h-1.5 rounded-full transition-colors ${step >= 0 ? 'bg-[#0d7a5f] dark:bg-[#00BE88]' : 'bg-[#e2ede8] dark:bg-[#1b4136]'}`} />
          <div className={`h-1.5 rounded-full transition-colors ${step >= 1 ? 'bg-[#0d7a5f] dark:bg-[#00BE88]' : 'bg-[#e2ede8] dark:bg-[#1b4136]'}`} />
          <div className={`h-1.5 rounded-full transition-colors ${step >= 2 ? 'bg-[#0d7a5f] dark:bg-[#00BE88]' : 'bg-[#e2ede8] dark:bg-[#1b4136]'}`} />
          <div className={`h-1.5 rounded-full transition-colors ${step >= 4 ? 'bg-[#0d7a5f] dark:bg-[#00BE88]' : 'bg-[#e2ede8] dark:bg-[#1b4136]'}`} />
        </div>
      </Card>

      {/* STEP 0: EMERGENCY RED FLAG SAFETY GATE (Primary Survey) */}
      {step === 0 && (
        <div className="space-y-6">
          <Card variant="default" className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#d1ded9] dark:border-[#1b4136] gap-2">
              <div className="flex items-center space-x-2.5 text-[#081a14] dark:text-[#f5fbf8]">
                <ShieldAlert className="w-5 h-5 text-red-600 dark:text-[#FF4D4D] shrink-0" />
                <div>
                  <h3 className="text-base sm:text-lg font-bold tracking-tight">Primary Trauma Survey (Emergency Screen)</h3>
                  <p className="text-xs text-[#4e665f] dark:text-[#8eada3]">Quickly check for life-threatening conditions before continuing</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 self-start sm:self-center">
                {hasCriticalRedFlag && (
                  <button
                    type="button"
                    onClick={() => {
                      const cleared: Record<string, boolean> = {};
                      Object.keys(redFlags).forEach((k) => (cleared[k] = false));
                      setRedFlags(cleared);
                    }}
                    className="text-xs text-[#4e665f] dark:text-[#8eada3] hover:text-red-600 dark:hover:text-red-400 underline cursor-pointer mr-2"
                  >
                    Clear all selections
                  </button>
                )}
                <Badge variant="emergency" size="sm">
                  SAFETY-FIRST GATE
                </Badge>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#223730] dark:text-[#d1e4dd] leading-relaxed">
              Select any symptom that applies to you or the injured person right now. If none apply, leave all boxes unchecked and proceed to the next step.
            </p>

            {/* Simplified, Patient-Friendly TickBox Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  key: 'severeBleeding',
                  title: 'Heavy, Uncontrolled Bleeding',
                  subtitle: 'Pulsing, spurting, or soaking bandages rapidly without stopping',
                  tag: 'Hemorrhage',
                  icon: <Droplets className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                },
                {
                  key: 'breathingDifficulty',
                  title: 'Severe Trouble Breathing or Blue Lips',
                  subtitle: 'Gasping for air, choking, severe breathlessness, or blue coloring',
                  tag: 'Airway',
                  icon: <Wind className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                },
                {
                  key: 'lossOfConsciousness',
                  title: 'Passed Out or Unresponsive',
                  subtitle: 'Blacked out (even briefly), knocked unconscious, or hard to wake',
                  tag: 'Consciousness',
                  icon: <Brain className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                },
                {
                  key: 'severeHeadNeck',
                  title: 'Severe Head, Neck, or Spine Impact',
                  subtitle: 'High-speed impact, fall from height, acute neck pain, or numbness',
                  tag: 'C-Spine',
                  icon: <AlertOctagon className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                },
                {
                  key: 'embeddedObject',
                  title: 'Object Stuck Deep in the Body',
                  subtitle: 'Knife, glass, metal, or puncture object lodged inside (do not remove)',
                  tag: 'Impalement',
                  icon: <Crosshair className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                },
                {
                  key: 'signsOfShock',
                  title: 'Signs of Shock or Collapse',
                  subtitle: 'Cold clammy skin, severe dizziness/fainting, or very pale face',
                  tag: 'Shock',
                  icon: <Activity className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                },
                {
                  key: 'deformity',
                  title: 'Severe Bone Deformity or Broken Skin',
                  subtitle: 'Bone bent at unnatural angle, bone visible through skin, or limb is numb',
                  tag: 'Fracture',
                  icon: <Bone className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                },
                {
                  key: 'rapidDeterioration',
                  title: 'Rapidly Worsening Symptoms',
                  subtitle: 'Pain, swelling, or confusion spreading dramatically within minutes',
                  tag: 'Escalation',
                  icon: <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                }
              ].map((flag) => {
                const isChecked = Boolean(redFlags[flag.key]);
                return (
                  <button
                    key={flag.key}
                    type="button"
                    role="checkbox"
                    aria-checked={isChecked}
                    onClick={() => handleToggleRedFlag(flag.key)}
                    className={`flex items-start space-x-3 p-3.5 sm:p-4 rounded-xl border text-left transition-all duration-150 cursor-pointer select-none outline-hidden focus-visible:ring-2 focus-visible:ring-red-500 ${
                      isChecked
                        ? 'bg-red-50/90 dark:bg-red-950/50 border-red-400 dark:border-red-800 text-red-950 dark:text-red-100 shadow-xs'
                        : 'bg-white dark:bg-[#0c221b] border-[#d1ded9] dark:border-[#1e463a] text-[#223730] dark:text-[#d1e4dd] hover:border-[#0d7a5f] dark:hover:border-[#00BE88]'
                    }`}
                  >
                    {/* Simplified Custom TickBox */}
                    <div
                      className={`w-5 h-5 mt-0.5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                        isChecked
                          ? 'bg-red-600 dark:bg-red-600 border border-red-600 text-white'
                          : 'border-2 border-[#b8cac4] dark:border-[#2a5547] bg-white dark:bg-[#081a14]'
                      }`}
                    >
                      {isChecked && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center space-x-1.5 min-w-0">
                          {flag.icon}
                          <span className="font-bold text-xs sm:text-sm text-[#081a14] dark:text-[#f5fbf8] truncate">
                            {flag.title}
                          </span>
                        </div>
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 ${
                            isChecked
                              ? 'bg-red-200 dark:bg-red-900/80 text-red-900 dark:text-red-100'
                              : 'bg-[#e2ede8] dark:bg-[#15342a] text-[#4e665f] dark:text-[#8eada3]'
                          }`}
                        >
                          {flag.tag}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-[#4e665f] dark:text-[#8eada3] leading-relaxed">
                        {flag.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* If Red Flag is Checked -> High-Contrast Emergency Intervention */}
            {hasCriticalRedFlag && (
              <div className="bg-red-600 dark:bg-[#B82424] text-white rounded-2xl p-5 sm:p-6 space-y-3.5 shadow-md border border-red-500 animate-fadeIn">
                <div className="flex items-center space-x-2">
                  <AlertOctagon className="w-5 h-5 text-white shrink-0" />
                  <h4 className="font-black text-sm uppercase tracking-wider">
                    CRITICAL LIFE-THREAT INDICATOR IDENTIFIED (LEVEL 1 EMERGENCY)
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-red-50 leading-relaxed font-medium">
                  You reported one or more high-risk red-flag criteria. Clinical guidelines forbid postponing acute medical evaluation for digital questionnaires. Contact local emergency dispatch ({regionInfo.generalEmergency}) immediately for advanced paramedic support.
                </p>
                <div className="pt-1 flex flex-wrap gap-2.5">
                  <Button
                    size="md"
                    variant="emergency-light"
                    onClick={onOpenEmergency}
                    leftIcon={<PhoneCall className="w-4 h-4 text-red-700" />}
                    className="font-black shadow-md cursor-pointer"
                  >
                    Open Emergency Mode (Call {regionInfo.generalEmergency})
                  </Button>
                  <Button
                    size="md"
                    variant="ghost"
                    onClick={() => setStep(1)}
                    className="text-white hover:bg-white/15 dark:hover:bg-white/20 border border-white/40 font-semibold cursor-pointer"
                  >
                    Proceed with Triage Guidance
                  </Button>
                </div>
              </div>
            )}

            {/* Safe Proceed Button when no red flags present */}
            {!hasCriticalRedFlag && (
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs text-[#0d7a5f] dark:text-[#00BE88] font-bold flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Primary survey clear: no immediate life-threats reported</span>
                </span>
                <Button
                  size="md"
                  variant="primary"
                  onClick={() => setStep(1)}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  id="safety-gate-next-btn"
                >
                  Proceed to Secondary Assessment
                </Button>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* STEP 1: SECONDARY ASSESSMENT (Anatomical Site, Biomechanics, Pain, ROS) */}
      {step === 1 && (
        <div className="space-y-6">
          <Card variant="default" className="space-y-6">
            
            {/* Validation Banner if missing required fields */}
            {validationError && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-semibold">{validationError}</span>
              </div>
            )}

            {/* 1. Anatomical Site Selection with SVG Clinical Icons */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#223730] dark:text-[#d1e4dd] flex items-center justify-between">
                <span>1. Primary Anatomical Location of Injury *</span>
                <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">Mandatory</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {CLINICAL_BODY_PARTS.map((bp) => {
                  const isSelected = bodyPart === bp.name;
                  return (
                    <button
                      key={bp.name}
                      type="button"
                      onClick={() => {
                        setBodyPart(bp.name);
                        setValidationError(null);
                      }}
                      className={`text-xs font-semibold p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center space-x-2.5 ${
                        isSelected
                          ? 'bg-[#ecf7f3] dark:bg-[#122e25] border-[#0d7a5f] dark:border-[#00BE88] text-[#0d7a5f] dark:text-[#00BE88] font-bold shadow-xs'
                          : 'bg-[#f4f7f5] dark:bg-[#0d221b] border-[#d1ded9] dark:border-[#1b4136] text-[#223730] dark:text-[#d1e4dd] hover:border-[#0d7a5f] dark:hover:border-[#00BE88]'
                      }`}
                    >
                      {bp.icon}
                      <span className="truncate">{bp.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Numeric Rating Scale (NRS) Pain Intensity (0 to 10) with SVG indicators */}
            <div className="space-y-3 bg-[#f4f7f5] dark:bg-[#091a14] p-4 sm:p-5 rounded-2xl border border-[#d1ded9] dark:border-[#1b4136]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#223730] dark:text-[#d1e4dd]">
                  2. Numeric Rating Scale (NRS) Pain Intensity (0 to 10)
                </label>
                <Badge
                  variant={
                    painLevel >= 8
                      ? 'emergency'
                      : painLevel >= 5
                      ? 'urgent'
                      : painLevel >= 1
                      ? 'first_aid'
                      : 'neutral'
                  }
                  size="sm"
                >
                  {painLevel} / 10 —{' '}
                  {painLevel === 0
                    ? 'Pain-Free'
                    : painLevel <= 3
                    ? 'Mild Discomfort'
                    : painLevel <= 6
                    ? 'Moderate Distressing Pain'
                    : painLevel <= 8
                    ? 'Severe Incapacitating Pain'
                    : 'Intractable Agonizing Pain'}
                </Badge>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={painLevel}
                onChange={(e) => setPainLevel(parseInt(e.target.value))}
                className="w-full h-2.5 bg-[#d1ded9] dark:bg-[#1b4136] rounded-lg appearance-none cursor-pointer accent-[#0d7a5f] dark:accent-[#00BE88]"
                id="pain-slider"
              />
              <div className="flex justify-between text-[11px] text-[#4e665f] dark:text-[#8eada3] font-medium">
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>0 (Pain-Free)</span>
                </span>
                <span>3 (Mild)</span>
                <span>6 (Moderate)</span>
                <span>8 (Severe)</span>
                <span className="flex items-center space-x-1 text-red-600 font-bold">
                  <AlertOctagon className="w-3 h-3" />
                  <span>10 (Agonizing)</span>
                </span>
              </div>
            </div>

            {/* 3. Trauma Biomechanics / Mechanism of Injury with SVGs */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#223730] dark:text-[#d1e4dd]">
                3. Trauma Biomechanics & Mechanism of Injury
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CLINICAL_MECHANISMS.map((m) => {
                  const isSelected = mechanism === m.name;
                  return (
                    <button
                      key={m.name}
                      type="button"
                      onClick={() => setMechanism(m.name)}
                      className={`text-xs p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center space-x-2.5 ${
                        isSelected
                          ? 'bg-[#ecf7f3] dark:bg-[#122e25] border-[#0d7a5f] dark:border-[#00BE88] text-[#0d7a5f] dark:text-[#00BE88] font-bold shadow-xs'
                          : 'bg-[#f4f7f5] dark:bg-[#0d221b] border-[#d1ded9] dark:border-[#1b4136] text-[#223730] dark:text-[#d1e4dd] hover:border-[#0d7a5f] dark:hover:border-[#00BE88]'
                      }`}
                    >
                      {m.icon}
                      <div className="truncate">
                        <p className="font-bold truncate">{m.name}</p>
                        <p className="text-[10px] text-[#4e665f] dark:text-[#8eada3]">{m.biomechanicsTag}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Time Elapsed Since Injury */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#223730] dark:text-[#d1e4dd]">
                4. Onset & Chronology of Trauma
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  'Immediate (< 15 mins)',
                  'Acute (< 1 hour)',
                  'Subacute (1-6 hours)',
                  'Intermediate (6-24 hours)',
                  'Delayed (> 24 hours)'
                ].map((t) => {
                  const isSelected = timeframe === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTimeframe(t)}
                      className={`text-xs p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#0d7a5f] text-white dark:bg-[#00BE88] dark:text-[#041611] font-bold border-transparent shadow-xs'
                          : 'bg-[#f4f7f5] dark:bg-[#0d221b] border-[#d1ded9] dark:border-[#1b4136] text-[#223730] dark:text-[#d1e4dd] hover:border-[#0d7a5f] dark:hover:border-[#00BE88]'
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Clinical Review of Systems (ROS) Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#d1ded9] dark:border-[#1b4136]">
                <label className="text-xs font-bold uppercase tracking-wider text-[#223730] dark:text-[#d1e4dd]">
                  5. Clinical Review of Systems & Associated Findings
                </label>
                {selectedSymptoms.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedSymptoms([])}
                    className="text-[11px] text-[#4e665f] dark:text-[#8eada3] hover:underline cursor-pointer"
                  >
                    Clear selections ({selectedSymptoms.length})
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {CLINICAL_SYMPTOM_CATEGORIES.map((cat) => (
                  <div key={cat.category} className="space-y-2">
                    <div className="flex items-center space-x-1.5 text-xs font-bold text-[#081a14] dark:text-[#f5fbf8]">
                      {cat.icon}
                      <span>{cat.category}</span>
                      <span className="text-[10px] font-normal text-[#4e665f] dark:text-[#8eada3]">({cat.systemTag})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.items.map((sym) => {
                        const selected = selectedSymptoms.includes(sym);
                        return (
                          <button
                            key={sym}
                            type="button"
                            onClick={() => handleToggleSymptom(sym)}
                            className={`text-xs px-3 py-1.5 rounded-full border transition-all cursor-pointer flex items-center space-x-1.5 ${
                              selected
                                ? 'bg-[#0d7a5f] text-white border-[#0d7a5f] dark:bg-[#00BE88] dark:text-[#041611] dark:border-[#00BE88] font-bold shadow-xs'
                                : 'bg-[#f4f7f5] dark:bg-[#0d221b] text-[#223730] dark:text-[#d1e4dd] border-[#d1ded9] dark:border-[#1b4136] hover:border-[#0d7a5f] dark:hover:border-[#00BE88]'
                            }`}
                          >
                            {selected ? (
                              <Check className="w-3.5 h-3.5 text-current shrink-0" />
                            ) : (
                              <Plus className="w-3.5 h-3.5 text-current opacity-70 shrink-0" />
                            )}
                            <span>{sym}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Custom Symptom Input */}
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Additional clinical finding (e.g. skin cool to touch, rotational instability, crepitus)..."
                  value={customSymptom}
                  onChange={(e) => setCustomSymptom(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomSymptom();
                    }
                  }}
                  className="flex-1 bg-[#f4f7f5] dark:bg-[#0d221b] border border-[#d1ded9] dark:border-[#1b4136] text-[#081a14] dark:text-[#f5fbf8] rounded-xl px-3.5 py-2.5 text-xs focus:outline-hidden placeholder-[#6c837c]"
                />
                <Button size="sm" variant="secondary" onClick={handleAddCustomSymptom}>
                  Add Finding
                </Button>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="pt-4 flex justify-between border-t border-[#d1ded9] dark:border-[#1b4136]">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setStep(0)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back to Primary Survey
              </Button>

              <Button
                size="md"
                variant="primary"
                onClick={handleProceedToStep2}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                id="details-next-btn"
              >
                Next: History & Visual Context
              </Button>
            </div>

          </Card>
        </div>
      )}

      {/* STEP 2: NARRATIVE HISTORY OF PRESENT ILLNESS (HPI) & OPTIONAL PHOTO */}
      {step === 2 && (
        <div className="space-y-6">
          <Card variant="default" className="space-y-6">
            
            {/* Written Narrative & Voice Dictation */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#223730] dark:text-[#d1e4dd] flex items-center space-x-1.5">
                    <Stethoscope className="w-4 h-4 text-[#0d7a5f] dark:text-[#00BE88]" />
                    <span>History of Present Illness (HPI) & Patient Narrative:</span>
                  </label>
                  <p className="text-[11px] text-[#4e665f] dark:text-[#8eada3] mt-0.5">
                    Detail the exact sequence of events, landing surface, head impact, blood thinner medications (anticoagulants), or tetanus immunization history.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={toggleVoiceRecording}
                  className={`flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-full transition-colors cursor-pointer shrink-0 ${
                    isRecording
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-[#ecf7f3] dark:bg-[#122e25] text-[#0d7a5f] dark:text-[#00BE88] border border-[#b8e2d4] dark:border-[#1e4e40]'
                  }`}
                  id="voice-record-btn"
                >
                  {isRecording ? (
                    <MicOff className="w-3.5 h-3.5 shrink-0" />
                  ) : (
                    <Mic className="w-3.5 h-3.5 shrink-0" />
                  )}
                  <span>{isRecording ? 'Listening (Tap to stop)...' : 'Dictate HPI with Voice'}</span>
                </button>
              </div>

              <textarea
                rows={4}
                value={userDescription}
                onChange={(e) => setUserDescription(e.target.value)}
                placeholder="Example: Tripped over uneven pavement at moderate walking speed, braced impact with outstretched right hand. Heard audible pop. Immediate severe wrist swelling with dorsal deformity; radial pulse present, fingers warm but thumb tingling. Patient is on 81mg Aspirin daily..."
                className="w-full bg-[#f4f7f5] dark:bg-[#0d221b] border border-[#d1ded9] dark:border-[#1b4136] text-[#081a14] dark:text-[#f5fbf8] rounded-2xl p-3.5 text-xs sm:text-sm focus:outline-hidden placeholder-[#6c837c]"
                id="description-textarea"
              />
            </div>

            {/* Optional Photo Upload Section */}
            <div className="space-y-3 pt-2 border-t border-[#d1ded9] dark:border-[#1b4136]">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#223730] dark:text-[#d1e4dd] flex items-center space-x-1.5">
                  <Camera className="w-4 h-4 text-[#4e665f] dark:text-[#8eada3]" />
                  <span>Adjunctive High-Resolution Surface Photography</span>
                </label>
                <span className="text-[11px] text-[#4e665f] dark:text-[#8eada3] font-medium">Optional</span>
              </div>

              {/* Strict Medical Photography Safety Guidelines */}
              <div className="bg-[#f4f7f5] dark:bg-[#091a14] p-4 rounded-2xl border border-[#d1ded9] dark:border-[#1b4136] text-xs text-[#223730] dark:text-[#d1e4dd] space-y-1.5">
                <p className="font-bold text-[#081a14] dark:text-[#f5fbf8] flex items-center space-x-1.5">
                  <Info className="w-4 h-4 text-[#0d7a5f] dark:text-[#00BE88]" />
                  <span>Clinical Photography Protocol & Non-Diagnostic Limits:</span>
                </p>
                <ul className="list-disc pl-5 space-y-1 text-[11px] leading-relaxed text-[#4e665f] dark:text-[#8eada3]">
                  <li>Capture under bright ambient lighting perpendicular to the anatomical surface without flash glare.</li>
                  <li><strong className="text-red-700 dark:text-red-300">DO NOT palpate, force joint extension, or rotate displaced limbs</strong> to take photographs.</li>
                  <li><strong className="text-red-700 dark:text-red-300">NEVER delay calling emergency services ({regionInfo.generalEmergency})</strong> for unstable injuries.</li>
                  <li>Notice: Surface photographs cannot visualize occult bone fractures, compartment syndrome, or internal hematomas.</li>
                </ul>
              </div>

              {/* Photo Preview or File Picker */}
              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-[#d1ded9] dark:border-[#1b4136] max-w-sm mx-auto bg-slate-950">
                  <img src={imagePreview} alt="Injury preview" className="w-full h-48 object-cover" />
                  <button
                    onClick={() => {
                      setImageBase64(undefined);
                      setImagePreview(null);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 transition-colors shadow-md cursor-pointer"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="p-2 bg-slate-900/90 text-white text-[11px] text-center font-medium">
                    Surface inspection image attached for supportive clinical review
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-[#d1ded9] dark:border-[#1b4136] rounded-2xl p-6 text-center space-y-3 hover:border-[#0d7a5f] dark:hover:border-[#00BE88] transition-colors">
                  <div className="w-12 h-12 rounded-2xl bg-[#ecf7f3] dark:bg-[#122e25] flex items-center justify-center mx-auto text-[#0d7a5f] dark:text-[#00BE88]">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#081a14] dark:text-[#f5fbf8]">
                      Attach an optional trauma site photograph
                    </p>
                    <p className="text-[11px] text-[#4e665f] dark:text-[#8eada3] mt-0.5">
                      Standard formats: JPG, PNG, or WEBP (Max 15MB)
                    </p>
                  </div>
                  <label className="inline-flex items-center space-x-2 bg-[#f4f7f5] dark:bg-[#0d221b] hover:bg-[#eaf0ed] dark:hover:bg-[#143229] text-[#081a14] dark:text-[#f5fbf8] font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer transition-colors border border-[#d1ded9] dark:border-[#1b4136] shadow-2xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image or Capture Camera</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="pt-4 flex justify-between border-t border-[#d1ded9] dark:border-[#1b4136]">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setStep(1)}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back to Secondary Survey
              </Button>

              <Button
                size="md"
                variant="primary"
                onClick={handleRunAssessment}
                leftIcon={<Activity className="w-4 h-4" />}
                id="run-triage-analysis-btn"
              >
                Synthesize Clinical Triage Plan
              </Button>
            </div>

          </Card>
        </div>
      )}

      {/* STEP 3: REALISTIC CLINICAL PROGRESSION FEEDBACK */}
      {step === 3 && (
        <Card variant="raised" className="text-center space-y-6 max-w-lg mx-auto py-10">
          <div className="w-14 h-14 rounded-2xl bg-[#ecf7f3] dark:bg-[#122e25] text-[#0d7a5f] dark:text-[#00BE88] flex items-center justify-center mx-auto shadow-xs border border-[#b8e2d4] dark:border-[#1e4e40]">
            <Shield className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xl font-black text-[#081a14] dark:text-[#f5fbf8]">
              Formulating Clinical Triage Guidance
            </h3>
            <p className="text-xs text-[#4e665f] dark:text-[#8eada3]">
              Cross-referencing reported trauma against ATLS primary survey gates, validated protocols, and harm contraindications...
            </p>
          </div>

          <div className="space-y-2.5 text-left max-w-sm mx-auto">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-[#f4f7f5] dark:bg-[#091a14] text-xs border border-[#d1ded9] dark:border-[#1b4136]">
              <span
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  processingStage >= 1 ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              />
              <span className="font-bold text-[#081a14] dark:text-[#f5fbf8]">
                1. Screening deterministic red-flag safety gate
              </span>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-[#f4f7f5] dark:bg-[#091a14] text-xs border border-[#d1ded9] dark:border-[#1b4136]">
              <span
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  processingStage >= 2 ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              />
              <span className="font-bold text-[#081a14] dark:text-[#f5fbf8]">
                2. Matching evidence-grounded first-aid protocols
              </span>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-[#f4f7f5] dark:bg-[#091a14] text-xs border border-[#d1ded9] dark:border-[#1b4136]">
              <span
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  processingStage >= 3 ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              />
              <span className="font-bold text-[#081a14] dark:text-[#f5fbf8]">
                3. Enforcing mandatory harm-prevention contraindications
              </span>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-[#f4f7f5] dark:bg-[#091a14] text-xs border border-[#d1ded9] dark:border-[#1b4136]">
              <span
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  processingStage >= 4 ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              />
              <span className="font-bold text-[#081a14] dark:text-[#f5fbf8]">
                4. Compiling SBAR handoff note & immediate actions
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* STEP 4: EVIDENCE-BASED TRIAGE RESULTS & CLINICAL HANDOFF */}
      {step === 4 && assessmentResult && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Main Urgency Banner */}
          <div
            className={`rounded-3xl p-6 sm:p-8 text-white shadow-md border ${
              assessmentResult.urgencyLevel === 'LEVEL_1_EMERGENCY'
                ? 'bg-gradient-to-br from-red-600 via-red-700 to-rose-900 border-red-500'
                : assessmentResult.urgencyLevel === 'LEVEL_2_URGENT'
                ? 'bg-gradient-to-br from-amber-600 via-orange-600 to-amber-800 border-amber-500'
                : assessmentResult.urgencyLevel === 'LEVEL_3_MEDICAL_REVIEW'
                ? 'bg-gradient-to-br from-yellow-600 via-amber-600 to-yellow-700 border-yellow-500'
                : 'bg-gradient-to-br from-[#0d7a5f] to-emerald-800 border-emerald-600'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    <span>{assessmentResult.urgencyLevel.replace(/_/g, ' ')}</span>
                  </div>

                  {/* Distinguish AI-Assisted from Deterministic Fallback */}
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-black/25 text-white/95 text-[11px] font-medium border border-white/20">
                    {assessmentResult.isAIAssisted ? (
                      <>
                        <Sparkles className="w-3 h-3 text-emerald-300" />
                        <span>AI-Assisted (Gemini + Safety Validation)</span>
                      </>
                    ) : (
                      <>
                        <Shield className="w-3 h-3 text-sky-300" />
                        <span>Deterministic Safety Protocol (Offline / Rule-Based)</span>
                      </>
                    )}
                  </div>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  {assessmentResult.urgencyTitle}
                </h1>
                <p className="text-white/95 text-xs sm:text-sm max-w-2xl font-medium leading-relaxed">
                  {assessmentResult.headlineReason}
                </p>
              </div>

              {assessmentResult.urgencyLevel === 'LEVEL_1_EMERGENCY' && (
                <Button
                  size="lg"
                  variant="emergency-light"
                  onClick={onOpenEmergency}
                  leftIcon={<PhoneCall className="w-5 h-5 text-red-700 shrink-0" />}
                  className="whitespace-nowrap self-start sm:self-center font-black shadow-md cursor-pointer"
                >
                  CALL {regionInfo.generalEmergency} NOW
                </Button>
              )}
            </div>
          </div>

          {/* Engine Origin Notice */}
          <div className="p-3.5 rounded-xl bg-[#f4f7f5] dark:bg-[#0d221b] border border-[#d1ded9] dark:border-[#1b4136] text-xs text-[#223730] dark:text-[#d1e4dd] flex items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-[#0d7a5f] dark:text-[#00BE88] shrink-0" />
              <span>
                {assessmentResult.isAIAssisted
                  ? 'Processed through clinical Gemini safety pipeline and post-validated against contraindicated interventions.'
                  : 'Processed by local deterministic medical safety engine (100% offline rule compliance).'}
              </span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#e2ede8] dark:bg-[#1b4136] text-[#081a14] dark:text-[#f5fbf8]">
              {assessmentResult.isAIAssisted ? 'Gemini 3.7 Flash' : 'Deterministic Protocol Engine'}
            </span>
          </div>

          {/* Clinical Reason: "Why am I seeing this result?" */}
          <Card variant="default" className="space-y-3">
            <div className="flex items-center space-x-2 text-[#081a14] dark:text-[#f5fbf8] font-bold text-sm">
              <HelpCircle className="w-4 h-4 text-sky-500" />
              <span>Clinical Rationale & Triage Formulation</span>
            </div>
            <p className="text-xs sm:text-sm text-[#223730] dark:text-[#d1e4dd] leading-relaxed">
              {assessmentResult.whyExplanation}
            </p>
            <p className="text-[11px] text-[#4e665f] dark:text-[#8eada3] italic border-t border-[#d1ded9] dark:border-[#1b4136] pt-2">
              Safety Gate Statement: {assessmentResult.confidenceStatement}
            </p>
          </Card>

          {/* ATTENDING PHYSICIAN CLINICAL GUIDANCE & DIRECTIVES */}
          <Card variant="raised" className="space-y-4 border-l-4 border-l-[#0d7a5f] dark:border-l-[#00BE88]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#d1ded9] dark:border-[#1b4136] gap-2">
              <div className="flex items-center space-x-2.5 text-[#081a14] dark:text-[#f5fbf8]">
                <Stethoscope className="w-5 h-5 text-[#0d7a5f] dark:text-[#00BE88] shrink-0" />
                <div>
                  <h3 className="text-sm sm:text-base font-bold tracking-tight">Attending Physician Clinical Directives</h3>
                  <p className="text-[11px] text-[#4e665f] dark:text-[#8eada3]">Emergency medicine protocol-aligned triage consultation</p>
                </div>
              </div>
              <Badge variant="triage" size="sm" className="self-start sm:self-center">
                CLINICAL PRACTICE DIRECTIVE
              </Badge>
            </div>

            {/* Structured Doctor Guidance Columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#091a14] border border-[#d1ded9] dark:border-[#1b4136] space-y-1.5">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-[#0d7a5f] dark:text-[#00BE88]">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>1. First 15-Minute Protocol</span>
                </div>
                <p className="text-xs text-[#223730] dark:text-[#d1e4dd] leading-relaxed">
                  Focus on acute stabilization. Verify unobstructed breathing, keep the injured person calm, and gently support the injured area in its position of comfort without forcing movement.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-[#091a14] border border-[#d1ded9] dark:border-[#1b4136] space-y-1.5">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>2. When to Escalate to the ER</span>
                </div>
                <p className="text-xs text-[#223730] dark:text-[#d1e4dd] leading-relaxed">
                  Seek emergency medical care immediately if you notice cold, pale, or bluish skin, numbness or tingling, fever over 100.4°F, spreading red streaks, or severe uncontrolled pain.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-[#091a14] border border-[#d1ded9] dark:border-[#1b4136] space-y-1.5">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-700 dark:text-rose-400">
                  <Ban className="w-4 h-4 shrink-0" />
                  <span>3. Medication Warning</span>
                </div>
                <p className="text-xs text-[#223730] dark:text-[#d1e4dd] leading-relaxed">
                  Do not take aspirin or ibuprofen (NSAIDs) if active bleeding is present or if awaiting physician imaging/surgery, as they inhibit blood clotting and can worsen internal hemorrhage.
                </p>
              </div>
            </div>

            {/* Care Facility Recommendation */}
            <div className="p-3 rounded-xl bg-[#ecf7f3] dark:bg-[#122e25] border border-[#b8e2d4] dark:border-[#1e4e40] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
              <div className="flex items-center space-x-2 text-[#081a14] dark:text-[#f5fbf8]">
                <Activity className="w-4 h-4 text-[#0d7a5f] dark:text-[#00BE88] shrink-0" />
                <span>
                  <strong>Recommended Level of Care:</strong>{' '}
                  {assessmentResult.suggestedCareType === 'emergency_room'
                    ? 'Emergency Department (Immediate Paramedic / Trauma Center Evaluation)'
                    : assessmentResult.suggestedCareType === 'urgent_care'
                    ? 'Urgent Care Center (Evaluation within 1-4 hours for exam & imaging)'
                    : assessmentResult.suggestedCareType === 'primary_care'
                    ? 'Outpatient Primary Care or Clinic (Evaluation within 24-48 hours)'
                    : 'Home First Aid & Longitudinal Monitoring via Injury Watch'}
                </span>
              </div>
              <Button
                size="sm"
                variant="subtle"
                onClick={onOpenFindHelp}
                leftIcon={<MapPin className="w-3.5 h-3.5" />}
                className="self-start sm:self-center shrink-0 cursor-pointer"
              >
                Find Nearby Facilities
              </Button>
            </div>
          </Card>

          {/* Observable Characteristics (If Image was Uploaded) */}
          {assessmentResult.observableCharacteristics && assessmentResult.observableCharacteristics.length > 0 && (
            <Card variant="raised" className="space-y-3">
              <div className="flex items-center space-x-2 text-[#081a14] dark:text-[#f5fbf8] font-bold text-xs uppercase tracking-wider">
                <Eye className="w-4 h-4 text-[#0d7a5f] dark:text-[#00BE88]" />
                <span>Visual Surface Observations (Adjunctive Non-Diagnostic Inspection)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {assessmentResult.observableCharacteristics.map((obs, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-[#091a14] p-3.5 rounded-xl border border-[#d1ded9] dark:border-[#1b4136] text-xs space-y-1"
                  >
                    <p className="font-bold text-[#081a14] dark:text-[#f5fbf8]">{obs.characteristic}</p>
                    <p className="text-[#223730] dark:text-[#d1e4dd] text-[11px] leading-relaxed">{obs.visualNote}</p>
                    <p className="text-amber-800 dark:text-amber-300 text-[10px] font-semibold flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3 shrink-0" />
                      <span>{obs.potentialConcern}</span>
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* PRIORITY ACTION 1: DO THIS NOW */}
          <Card variant="default" className="space-y-4">
            <div className="flex items-center space-x-2 text-[#0d7a5f] dark:text-[#00BE88] font-bold text-sm uppercase tracking-wider">
              <CheckCircle2 className="w-5 h-5" />
              <span>DO THIS NOW: Immediate Evidence-Based Resuscitation & First-Aid</span>
            </div>

            <div className="space-y-2.5">
              {assessmentResult.doThisNow.map((action, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-3 p-3.5 rounded-xl bg-emerald-50/70 dark:bg-[#122e25]/60 border border-emerald-200 dark:border-[#1e4e40]"
                >
                  <span className="shrink-0 w-6 h-6 rounded-full bg-[#0d7a5f] dark:bg-[#00BE88] text-white dark:text-[#041611] font-bold text-xs flex items-center justify-center mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-emerald-950 dark:text-[#f5fbf8] leading-relaxed">
                    {action}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* PRIORITY ACTION 2: DON'T MAKE IT WORSE (Harm Prevention / Contraindications) */}
          <div className="bg-gradient-to-br from-red-950 via-[#180a0c] to-slate-950 text-white rounded-3xl p-6 sm:p-8 border-2 border-red-500/80 shadow-lg space-y-4">
            <div className="flex items-center space-x-2 text-red-400 font-black text-sm uppercase tracking-wider">
              <Ban className="w-5 h-5 shrink-0" />
              <span>DON'T MAKE IT WORSE: Explicit Contraindicated Interventions</span>
            </div>

            <div className="space-y-2">
              {assessmentResult.avoidDoNotMakeWorse.map((avoidItem, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-3 p-3 rounded-xl bg-red-900/30 border border-red-700/60"
                >
                  <Ban className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm font-bold text-red-100 leading-relaxed">
                    {avoidItem}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Watch for Deterioration / Warning Signs */}
          <Card variant="default" className="space-y-4">
            <div className="flex items-center space-x-2 text-amber-600 dark:text-[#F5B942] font-bold text-sm uppercase tracking-wider">
              <AlertTriangle className="w-5 h-5" />
              <span>Watch For These Secondary Escalation Red Flags</span>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#223730] dark:text-[#d1e4dd]">
              {assessmentResult.watchForRedFlags.map((flag, idx) => (
                <li
                  key={idx}
                  className="flex items-center space-x-2 p-2.5 rounded-xl bg-[#f4f7f5] dark:bg-[#091a14] border border-[#d1ded9] dark:border-[#1b4136]"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span className="font-semibold">{flag}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2 text-xs font-semibold text-[#223730] dark:text-[#d1e4dd] border-t border-[#d1ded9] dark:border-[#1b4136]">
              <strong>Escalation Directive:</strong> {assessmentResult.whenToEscalate}
            </div>
          </Card>

          {/* Retrieved Grounded Protocols */}
          {assessmentResult.retrievedProtocols && assessmentResult.retrievedProtocols.length > 0 && (
            <div className="bg-[#f4f7f5] dark:bg-[#091a14] rounded-2xl p-4 border border-[#d1ded9] dark:border-[#1b4136] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2 text-[#223730] dark:text-[#d1e4dd]">
                <BookOpen className="w-4 h-4 text-sky-500 shrink-0" />
                <span>
                  <strong>Clinical Protocol Grounding:</strong>{' '}
                  {assessmentResult.retrievedProtocols.map((p) => `${p.title} (${p.source})`).join('; ')}
                </span>
              </div>
              <Badge variant="info" size="sm" className="self-start sm:self-center">
                Peer-Reviewed Evidence Base
              </Badge>
            </div>
          )}

          {/* Action Toolbar */}
          <Card variant="raised" className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-2.5">
              
              {/* Add to Injury Watch Tracker */}
              <Button
                size="sm"
                variant={isAddedToWatch ? 'subtle' : 'secondary'}
                onClick={handleSaveToWatchList}
                disabled={isAddedToWatch}
                leftIcon={isAddedToWatch ? <Check className="w-4 h-4" /> : <HeartPulse className="w-4 h-4 text-rose-500" />}
                id="add-to-watch-btn"
              >
                {isAddedToWatch ? 'Logged in Injury Watch' : 'Track Recovery in Injury Watch'}
              </Button>

              {/* Show SBAR Medical Handoff Report */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => onOpenReport(assessmentResult)}
                leftIcon={<FileText className="w-4 h-4 text-sky-500" />}
                id="doctor-report-btn"
              >
                SBAR Clinical Handoff Report
              </Button>

              {/* Find Nearby Care */}
              <Button
                size="sm"
                variant="outline"
                onClick={onOpenFindHelp}
                leftIcon={<MapPin className="w-4 h-4 text-amber-500" />}
                id="find-nearby-care-btn"
              >
                Find Emergency Care
              </Button>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setStep(0);
                setAssessmentResult(null);
                setBodyPart('');
                setPainLevel(0);
                setMechanism('');
                setTimeframe('');
                setSelectedSymptoms([]);
                setUserDescription('');
                setImageBase64(undefined);
                setImagePreview(null);
                setIsAddedToWatch(false);
              }}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Start New Assessment
            </Button>
          </Card>

        </div>
      )}

    </div>
  );
};

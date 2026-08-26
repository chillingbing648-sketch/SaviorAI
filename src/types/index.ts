export type TriageLevel =
  | 'LEVEL_1_EMERGENCY'
  | 'LEVEL_2_URGENT'
  | 'LEVEL_3_MEDICAL_REVIEW'
  | 'LEVEL_4_BASIC_FIRST_AID';

export interface InjuryAssessmentRequest {
  id?: string;
  timestamp: string;
  bodyPart: string;
  symptoms: string[];
  painLevel: number; // 1-10
  mechanism: string;
  timeframe: string;
  userDescription: string;
  voiceTranscript?: string;
  imageBase64?: string;
  language: string;
  redFlags: Record<string, boolean>;
  isDemo?: boolean;
  demoCaseId?: string;
}

export interface ObservableCharacteristic {
  characteristic: string;
  visualNote: string;
  potentialConcern: string;
}

export interface RetrievedProtocolReference {
  id: string;
  title: string;
  source: string;
  version: string;
  lastReviewed: string;
  reviewStatus: 'Validated' | 'Under Review' | 'Clinical Approved' | 'Standard Reference';
  url?: string;
}

export interface TriageAnalysisResponse {
  id: string;
  timestamp: string;
  urgencyLevel: TriageLevel;
  urgencyTitle: string;
  urgencyColor: string;
  headlineReason: string;
  whyExplanation: string;
  confidenceStatement: string;
  observableCharacteristics: ObservableCharacteristic[];
  visionLimitationsDisclaimer: string;
  doThisNow: string[];
  avoidDoNotMakeWorse: string[];
  watchForRedFlags: string[];
  whenToEscalate: string;
  suggestedCareType: 'emergency_room' | 'urgent_care' | 'primary_care' | 'home_monitoring';
  retrievedProtocols: RetrievedProtocolReference[];
  safetyAuditPassed: boolean;
  escalationTriggers: string[];
  medicalReportMarkdown: string;
  isEmergencyOverride?: boolean;
}

export interface InjuryWatchEntry {
  id: string;
  timestamp: string;
  painScore: number;
  bleedingStatus: 'none' | 'minimal' | 'moderate' | 'uncontrolled';
  swellingStatus: 'improving' | 'stable' | 'worsening';
  mobilityStatus: 'normal' | 'limited' | 'unable_to_move';
  sensationStatus: 'normal' | 'numb' | 'tingling' | 'lost';
  temperatureFever: boolean;
  notes: string;
  deteriorationDetected: boolean;
  deteriorationReason?: string;
}

export interface MonitoredInjury {
  id: string;
  title: string;
  initialAssessment: TriageAnalysisResponse;
  originalInput: InjuryAssessmentRequest;
  createdAt: string;
  status: 'active' | 'resolved' | 'escalated';
  entries: InjuryWatchEntry[];
  lastUpdated: string;
  highestSeveritySeen: TriageLevel;
}

export interface MedicalProtocol {
  id: string;
  title: string;
  category: 'trauma' | 'burns' | 'wounds' | 'orthopedic' | 'head_neck' | 'environmental' | 'general';
  source: 'WHO' | 'American Red Cross' | 'Mayo Clinic' | 'NHS' | 'AHA' | 'IFRC';
  version: string;
  lastReviewed: string;
  reviewStatus: 'Clinical Approved' | 'Standard Reference' | 'Validated' | 'Under Review';
  evidenceLevel: 'Level A (Clinical Trials)' | 'Level B (Consensus Guidelines)' | 'Standard First Aid';
  summary: string;
  keyActions: string[];
  contraindications: string[];
  escalationThresholds: string[];
  region: 'Global' | 'US' | 'UK' | 'EU' | 'India';
}

export interface HealthcareFacility {
  id: string;
  name: string;
  type: 'emergency_room' | 'urgent_care' | 'burn_center' | 'orthopedic_clinic' | 'pediatric_er' | string;
  address: string;
  phone: string;
  distanceKm?: number;
  estimatedDriveMinutes?: number;
  open24Hours?: boolean;
  isOpenNow?: boolean;
  openHours?: string;
  hasTraumaCare?: boolean;
  hasPediatricCare?: boolean;
  specialties: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface EmergencyContact {
  id?: string;
  name: string;
  relation?: string;
  relationship?: string;
  phone: string;
  notifyOnEmergency?: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  eventType: string;
  triageLevel?: TriageLevel;
  bodyPart?: string;
  mechanism?: string;
  flaggedBySafetyGate?: boolean;
  notes?: string;
  details?: Record<string, any>;
}

export interface SafetyBenchmarkTestCase {
  id: string;
  name: string;
  category: string;
  description: string;
  expectedUrgency: TriageLevel;
  criticalRedFlags: string[];
  sampleInput: Partial<InjuryAssessmentRequest>;
  rationale: string;
}

export interface SafetyBenchmarkResult {
  caseId: string;
  caseName: string;
  expectedUrgency: TriageLevel;
  actualUrgency: TriageLevel;
  redFlagTriggered: boolean;
  enforcedContraindicationsCount: number;
  passed: boolean;
}

export interface SafetyBenchmarkReport {
  timestamp: string;
  totalCases: number;
  passedCases: number;
  failedCases: number;
  safetyScore: number;
  emergencyRecallRate: number;
  harmPreventionComplianceRate: number;
  falseReassuranceRate: number;
  results: SafetyBenchmarkResult[];
}

export interface UserPreferences {
  language: string;
  region: string;
  offlineMode?: boolean;
  offlineModeEnabled?: boolean;
  emergencyContacts?: EmergencyContact[];
  minimalDataMode?: boolean;
  highContrast?: boolean;
  audioFeedback?: boolean;
}

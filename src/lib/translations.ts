export type SupportedLanguage = 'en' | 'es' | 'hi' | 'fr' | 'de' | 'zh';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' }
];

export const UI_TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    appName: 'InjuryGuard AI',
    appTagline: 'First-Response Injury Safety & Medical Triage Platform',
    emergencyButton: 'Emergency Help (1-Tap)',
    assessInjury: 'Assess an Injury',
    navHome: 'Home',
    navAssess: 'Assess',
    navWatch: 'Injury Watch',
    navFindHelp: 'Find Help',
    navLibrary: 'Safety Library',
    navAdmin: 'Clinical Admin',
    navSettings: 'Settings',
    emergencyWarning: 'If someone is unresponsive, bleeding severely, or struggling to breathe, call emergency services immediately.',
    safetyFirst: 'Safety > Accuracy > Clarity > Speed',
    demoCases: 'Demo Clinical Cases',
    runBenchmark: 'Run Safety Benchmark',
    homePrompt: 'Are you dealing with an injury right now?',
    homeDescription: 'Answer a few simple questions to understand what needs attention and what safe first-aid actions to take immediately. This is triage guidance, not a medical diagnosis.',
    firstAidProtocols: 'Evidence-Based First Aid Protocols',
    exploreLibrary: 'Explore Full Library',
    safetyNotice: 'Medical Safety & Emergency Warning',
    settingsTitle: 'Application Preferences & Privacy',
    safetyCheck: 'Emergency Safety Check',
    continueAction: 'Continue',
    backAction: 'Back',
    callEmergency: 'Call emergency services now'
    ,morning: 'Good morning'
    ,afternoon: 'Good afternoon'
    ,evening: 'Good evening'
    ,cutsBleeding: 'Cuts & Bleeding'
    ,burnsScalds: 'Burns & Scalds'
    ,sprainsFractures: 'Sprains & Fractures'
    ,headConcussion: 'Head & Concussion'
  },
  es: {
    appName: 'InjuryGuard AI',
    appTagline: 'Plataforma de Seguridad y Triaje de Lesiones de Primeros Auxilios',
    emergencyButton: 'Emergencia (1-Toque)',
    assessInjury: 'Evaluar una Lesión',
    navHome: 'Inicio',
    navAssess: 'Evaluar',
    navWatch: 'Monitoreo',
    navFindHelp: 'Buscar Ayuda',
    navLibrary: 'Biblioteca Médica',
    navAdmin: 'Admin Clínico',
    navSettings: 'Ajustes',
    emergencyWarning: 'Si alguien no responde, sangra intensamente o le cuesta respirar, llame a emergencias de inmediato.',
    safetyFirst: 'Seguridad > Precisión > Claridad > Rapidez',
    demoCases: 'Casos Clínicos de Demostración',
    runBenchmark: 'Ejecutar Prueba de Seguridad',
    homePrompt: '¿Está lidiando con una lesión ahora?',
    homeDescription: 'Responda algunas preguntas sencillas para saber qué necesita atención y qué primeros auxilios seguros puede realizar. Esto es orientación de triaje, no un diagnóstico médico.',
    firstAidProtocols: 'Protocolos de primeros auxilios basados en evidencia',
    exploreLibrary: 'Explorar biblioteca completa',
    safetyNotice: 'Aviso de seguridad médica y emergencias',
    settingsTitle: 'Preferencias y privacidad de la aplicación',
    safetyCheck: 'Comprobación de seguridad de emergencia',
    continueAction: 'Continuar',
    backAction: 'Atrás',
    callEmergency: 'Llame a emergencias ahora'
    ,morning: 'Buenos días'
    ,afternoon: 'Buenas tardes'
    ,evening: 'Buenas noches'
    ,cutsBleeding: 'Cortes y sangrado'
    ,burnsScalds: 'Quemaduras y escaldaduras'
    ,sprainsFractures: 'Esguinces y fracturas'
    ,headConcussion: 'Cabeza y conmoción'
  },
  hi: {
    appName: 'InjuryGuard AI',
    appTagline: 'प्राथमिक चिकित्सा चोट सुरक्षा एवं मेडिकल ट्राइएज प्लेटफॉर्म',
    emergencyButton: 'आपातकालीन सहायता (1-टैप)',
    assessInjury: 'चोट का आकलन करें',
    navHome: 'होम',
    navAssess: 'आकलन',
    navWatch: 'चोट निगरानी',
    navFindHelp: 'सहायता खोजें',
    navLibrary: 'सुरक्षा लाइब्रेरी',
    navAdmin: 'क्लीनिकल एडमिन',
    navSettings: 'सेटिंग्स',
    emergencyWarning: 'यदि कोई व्यक्ति बेहोश है, भारी रक्तस्राव हो रहा है, या सांस लेने में कठिनाई है, तो तुरंत आपातकालीन सेवाओं को कॉल करें।',
    safetyFirst: 'सुरक्षा > सटीकता > स्पष्टता > गति',
    demoCases: 'डेमो क्लीनिकल केस',
    runBenchmark: 'सुरक्षा बेंचमार्क चलाएं',
    homePrompt: 'क्या आप अभी किसी चोट से जूझ रहे हैं?',
    homeDescription: 'कुछ आसान सवालों के जवाब देकर जानें कि किस पर ध्यान देना चाहिए और तुरंत कौन से सुरक्षित प्राथमिक उपचार किए जा सकते हैं। यह ट्राइएज मार्गदर्शन है, चिकित्सीय निदान नहीं।',
    firstAidProtocols: 'साक्ष्य-आधारित प्राथमिक उपचार प्रोटोकॉल',
    exploreLibrary: 'पूरी लाइब्रेरी देखें',
    safetyNotice: 'चिकित्सीय सुरक्षा और आपातकालीन चेतावनी',
    settingsTitle: 'ऐप प्राथमिकताएं और गोपनीयता',
    safetyCheck: 'आपातकालीन सुरक्षा जांच',
    continueAction: 'जारी रखें',
    backAction: 'वापस',
    callEmergency: 'अभी आपातकालीन सेवाओं को कॉल करें'
    ,morning: 'सुप्रभात'
    ,afternoon: 'नमस्कार'
    ,evening: 'शुभ संध्या'
    ,cutsBleeding: 'कट और रक्तस्राव'
    ,burnsScalds: 'जलना और झुलसना'
    ,sprainsFractures: 'मोच और फ्रैक्चर'
    ,headConcussion: 'सिर और चोट'
  },
  fr: {
    appName: 'InjuryGuard AI',
    appTagline: 'Plateforme de Sécurité des Blessures et Triage Médical',
    emergencyButton: 'Urgence (1-Clic)',
    assessInjury: 'Évaluer une Blessure',
    navHome: 'Accueil',
    navAssess: 'Évaluer',
    navWatch: 'Suivi des Blessures',
    navFindHelp: 'Trouver de l\'Aide',
    navLibrary: 'Protocoles Médicaux',
    navAdmin: 'Admin Clinique',
    navSettings: 'Paramètres',
    emergencyWarning: 'Si une personne est inconsciente, saigne abondamment ou a du mal à respirer, appelez immédiatement les secours.',
    safetyFirst: 'Sécurité > Précision > Clarté > Vitesse',
    demoCases: 'Cas Cliniques Démo',
    runBenchmark: 'Lancer le Test de Sécurité',
    homePrompt: 'Êtes-vous confronté à une blessure en ce moment ?',
    homeDescription: 'Répondez à quelques questions simples pour comprendre ce qui nécessite une attention et quels premiers soins sûrs effectuer immédiatement. Il s’agit d’un triage, pas d’un diagnostic médical.',
    firstAidProtocols: 'Protocoles de premiers soins fondés sur des preuves',
    exploreLibrary: 'Explorer toute la bibliothèque',
    safetyNotice: 'Avis de sécurité médicale et d’urgence',
    settingsTitle: 'Préférences et confidentialité de l’application',
    safetyCheck: 'Contrôle de sécurité d’urgence',
    continueAction: 'Continuer',
    backAction: 'Retour',
    callEmergency: 'Appelez les secours maintenant'
    ,morning: 'Bonjour'
    ,afternoon: 'Bon après-midi'
    ,evening: 'Bonsoir'
    ,cutsBleeding: 'Coupures et saignements'
    ,burnsScalds: 'Brûlures et échaudures'
    ,sprainsFractures: 'Entorses et fractures'
    ,headConcussion: 'Tête et commotion'
  },
  de: {
    appName: 'InjuryGuard AI',
    appTagline: 'Erste-Hilfe-Verletzungssicherheit & Medizinisches Triage-System',
    emergencyButton: 'Notfallhilfe (1-Klick)',
    assessInjury: 'Verletzung Bewerten',
    navHome: 'Start',
    navAssess: 'Bewerten',
    navWatch: 'Verlaufskontrolle',
    navFindHelp: 'Hilfe Finden',
    navLibrary: 'Notfallprotokolle',
    navAdmin: 'Klinische Admins',
    navSettings: 'Einstellungen',
    emergencyWarning: 'Wenn jemand bewusstlos ist, stark blutet oder Atemnot hat, rufen Sie sofort den Notruf an.',
    safetyFirst: 'Sicherheit > Genauigkeit > Klarheit > Schnelligkeit',
    demoCases: 'Klinische Demo-Fälle',
    runBenchmark: 'Sicherheits-Benchmark Starten',
    homePrompt: 'Haben Sie gerade eine Verletzung?',
    homeDescription: 'Beantworten Sie einige einfache Fragen, um zu verstehen, was Aufmerksamkeit benötigt und welche sicheren Erste-Hilfe-Maßnahmen Sie sofort ergreifen können. Dies ist eine Triage-Hilfe, keine medizinische Diagnose.',
    firstAidProtocols: 'Evidenzbasierte Erste-Hilfe-Protokolle',
    exploreLibrary: 'Gesamte Bibliothek öffnen',
    safetyNotice: 'Medizinischer Sicherheits- und Notfallhinweis',
    settingsTitle: 'App-Einstellungen und Datenschutz',
    safetyCheck: 'Notfall-Sicherheitsprüfung',
    continueAction: 'Weiter',
    backAction: 'Zurück',
    callEmergency: 'Jetzt den Notruf wählen'
    ,morning: 'Guten Morgen'
    ,afternoon: 'Guten Tag'
    ,evening: 'Guten Abend'
    ,cutsBleeding: 'Schnittwunden und Blutungen'
    ,burnsScalds: 'Verbrennungen und Verbrühungen'
    ,sprainsFractures: 'Verstauchungen und Frakturen'
    ,headConcussion: 'Kopf und Gehirnerschütterung'
  },
  zh: {
    appName: 'InjuryGuard AI',
    appTagline: '急救伤害安全与医疗分诊平台',
    emergencyButton: '紧急求助 (一键直达)',
    assessInjury: '评估伤情',
    navHome: '首页',
    navAssess: '伤情分诊',
    navWatch: '伤情监测',
    navFindHelp: '查找医疗机构',
    navLibrary: '急救指南库',
    navAdmin: '临床管理',
    navSettings: '系统设置',
    emergencyWarning: '如果患者失去意识、大出血或呼吸困难，请立即拨打急救电话。',
    safetyFirst: '安全 > 准确 > 清晰 > 快速',
    demoCases: '演示临床病例',
    runBenchmark: '运行安全基准测试',
    homePrompt: '您现在是否正在处理受伤情况？',
    homeDescription: '回答几个简单问题，了解哪些情况需要关注，以及可以立即采取哪些安全的急救措施。这是分诊指导，不是医疗诊断。',
    firstAidProtocols: '循证急救指南',
    exploreLibrary: '查看完整指南库',
    safetyNotice: '医疗安全与紧急警告',
    settingsTitle: '应用偏好与隐私',
    safetyCheck: '紧急安全检查',
    continueAction: '继续',
    backAction: '返回',
    callEmergency: '立即呼叫急救服务'
    ,morning: '早上好'
    ,afternoon: '下午好'
    ,evening: '晚上好'
    ,cutsBleeding: '割伤与出血'
    ,burnsScalds: '烧伤与烫伤'
    ,sprainsFractures: '扭伤与骨折'
    ,headConcussion: '头部与脑震荡'
  }
};

export function getTranslation(lang: string, key: string): string {
  const code = (lang as SupportedLanguage) in UI_TRANSLATIONS ? (lang as SupportedLanguage) : 'en';
  return UI_TRANSLATIONS[code][key] || UI_TRANSLATIONS.en[key] || key;
}

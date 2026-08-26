import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { executeSafetyTriagePipeline } from './server/safetyPipeline';
import { MEDICAL_PROTOCOLS, DEMO_TEST_CASES } from './src/data/protocols';
import { SAMPLE_FACILITIES, REGIONAL_EMERGENCY_NUMBERS } from './src/data/facilities';
import { AuditLogEntry, MedicalProtocol, InjuryAssessmentRequest } from './src/types';

// In-memory persistent stores for server session
const auditLogsStore: AuditLogEntry[] = [
  {
    id: 'audit-001',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    eventType: 'triage_performed',
    triageLevel: 'LEVEL_2_URGENT',
    bodyPart: 'Wrist / Arm',
    mechanism: 'Fall on outstretched hand',
    flaggedBySafetyGate: false,
    notes: 'Urgent evaluation advised for suspected colles fracture; RICE protocol initiated.'
  },
  {
    id: 'audit-002',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    eventType: 'emergency_escalation',
    triageLevel: 'LEVEL_1_EMERGENCY',
    bodyPart: 'Forearm',
    mechanism: 'Glass laceration',
    flaggedBySafetyGate: true,
    notes: 'Red flag triggered: Arterial bleeding. Emergency 911 dispatch screen presented.'
  }
];

let protocolDatabase: MedicalProtocol[] = [...MEDICAL_PROTOCOLS];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON Body Parser with ample capacity for image uploads
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Mendly Safety & Triage Engine',
      version: '2026.1',
      hasGeminiApiKey: Boolean(process.env.GEMINI_API_KEY),
      activeProtocols: protocolDatabase.length
    });
  });

  // Triage Assessment Endpoint
  app.post('/api/triage/assess', async (req, res) => {
    try {
      const assessmentRequest: InjuryAssessmentRequest = req.body;
      if (!assessmentRequest.bodyPart) {
        return res.status(400).json({ error: 'Body part is required for triage.' });
      }

      const result = await executeSafetyTriagePipeline(assessmentRequest);

      // Record in audit log
      const auditEntry: AuditLogEntry = {
        id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toISOString(),
        eventType: result.urgencyLevel === 'LEVEL_1_EMERGENCY' ? 'emergency_escalation' : 'triage_performed',
        triageLevel: result.urgencyLevel,
        bodyPart: assessmentRequest.bodyPart,
        mechanism: assessmentRequest.mechanism || 'unspecified',
        flaggedBySafetyGate: result.escalationTriggers && result.escalationTriggers.length > 0,
        notes: `Urgency: ${result.urgencyTitle}. Care: ${result.suggestedCareType}. Triggers: ${result.escalationTriggers?.join(', ') || 'None'}`
      };
      auditLogsStore.unshift(auditEntry);
      if (auditLogsStore.length > 100) auditLogsStore.pop();

      res.json(result);
    } catch (err: any) {
      console.error('Triage assessment endpoint error:', err);
      res.status(500).json({ error: 'Internal safety pipeline error', details: err.message });
    }
  });

  // Medical Protocols List
  app.get('/api/protocols', (req, res) => {
    res.json({
      protocols: protocolDatabase,
      count: protocolDatabase.length,
      lastUpdated: new Date().toISOString()
    });
  });

  // Admin Protocol Update / Create
  app.post('/api/protocols/update', (req, res) => {
    try {
      const protocol: MedicalProtocol = req.body;
      if (!protocol.id || !protocol.title || !protocol.source) {
        return res.status(400).json({ error: 'Invalid protocol payload. ID, title, and source are required.' });
      }

      const existingIndex = protocolDatabase.findIndex((p) => p.id === protocol.id);
      if (existingIndex >= 0) {
        protocolDatabase[existingIndex] = { ...protocol, lastReviewed: new Date().toISOString().split('T')[0] };
      } else {
        protocolDatabase.push({ ...protocol, lastReviewed: new Date().toISOString().split('T')[0] });
      }

      res.json({ success: true, protocol, totalProtocols: protocolDatabase.length });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to update protocol', details: err.message });
    }
  });

  // Healthcare Facilities & Geo Locator
  app.get('/api/facilities', (req, res) => {
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : null;
    const lng = req.query.lng ? parseFloat(req.query.lng as string) : null;
    const type = req.query.type as string;

    let facilities = [...SAMPLE_FACILITIES];

    if (type && type !== 'all') {
      facilities = facilities.filter((f) => f.type.toLowerCase().includes(type.toLowerCase()));
    }

    // Dynamic distance calculation if user coordinates are provided
    if (lat && lng) {
      facilities = facilities.map((f) => {
        // Haversine approximation
        const dLat = (f.coordinates.lat - lat) * 111;
        const dLng = (f.coordinates.lng - lng) * 85;
        const dist = Math.sqrt(dLat * dLat + dLng * dLng);
        const distKm = Math.round(dist * 10) / 10;
        const driveMin = Math.max(3, Math.round(distKm * 2.5));
        return {
          ...f,
          distanceKm: distKm,
          estimatedDriveMinutes: driveMin
        };
      });
      facilities.sort((a, b) => a.distanceKm - b.distanceKm);
    }

    res.json({
      facilities,
      emergencyNumbers: REGIONAL_EMERGENCY_NUMBERS
    });
  });

  // Audit Logs API
  app.get('/api/audit-logs', (req, res) => {
    res.json({
      logs: auditLogsStore,
      totalCount: auditLogsStore.length
    });
  });

  // Log Custom Event
  app.post('/api/audit-logs/event', (req, res) => {
    const { eventType, triageLevel, bodyPart, mechanism, notes, flaggedBySafetyGate } = req.body;
    const entry: AuditLogEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      eventType: eventType || 'triage_performed',
      triageLevel: triageLevel || 'LEVEL_4_BASIC_FIRST_AID',
      bodyPart: bodyPart || 'General',
      mechanism: mechanism || 'Unknown',
      flaggedBySafetyGate: Boolean(flaggedBySafetyGate),
      notes: notes || ''
    };
    auditLogsStore.unshift(entry);
    if (auditLogsStore.length > 100) auditLogsStore.pop();
    res.json({ success: true, entry });
  });

  // Automated Safety Benchmark Runner
  app.post('/api/safety-benchmark/run', async (req, res) => {
    try {
      const results: Array<{
        caseId: string;
        caseName: string;
        expectedUrgency: string;
        actualUrgency: string;
        passedSafetyCheck: boolean;
        redFlagsDetected: boolean;
        executionTimeMs: number;
        avoidAdviceVerified: boolean;
      }> = [];

      let emergencyCasesTotal = 0;
      let emergencyCasesPassed = 0;
      let unsafeAdviceViolations = 0;

      for (const testCase of DEMO_TEST_CASES) {
        const start = Date.now();
        const input: InjuryAssessmentRequest = {
          timestamp: new Date().toISOString(),
          bodyPart: testCase.sampleInput.bodyPart || 'General',
          symptoms: testCase.sampleInput.symptoms || [],
          painLevel: testCase.sampleInput.painLevel || 5,
          mechanism: testCase.sampleInput.mechanism || 'Trauma',
          timeframe: testCase.sampleInput.timeframe || 'Recent',
          userDescription: testCase.sampleInput.userDescription || '',
          language: 'en',
          redFlags: testCase.sampleInput.redFlags || {},
          isDemo: true,
          demoCaseId: testCase.id
        };

        const triageOutput = await executeSafetyTriagePipeline(input);
        const elapsed = Date.now() - start;

        const isEmergency = testCase.expectedUrgency === 'LEVEL_1_EMERGENCY';
        if (isEmergency) emergencyCasesTotal++;

        // For emergency cases, the actual output MUST be LEVEL_1_EMERGENCY (Zero false negatives)
        const emergencyMatched = !isEmergency || triageOutput.urgencyLevel === 'LEVEL_1_EMERGENCY';
        if (isEmergency && emergencyMatched) emergencyCasesPassed++;

        // Verify avoid advice contains no contraindicated dangerous recommendations
        const avoidList = (triageOutput.avoidDoNotMakeWorse || []).join(' ').toLowerCase();
        const unsafeDetected = avoidList.includes('apply butter') || avoidList.includes('pop blisters') || avoidList.includes('pull out knife');
        if (unsafeDetected) unsafeAdviceViolations++;

        const passed = emergencyMatched && !unsafeDetected;

        results.push({
          caseId: testCase.id,
          caseName: testCase.name,
          expectedUrgency: testCase.expectedUrgency,
          actualUrgency: triageOutput.urgencyLevel,
          passedSafetyCheck: passed,
          redFlagsDetected: (triageOutput.escalationTriggers && triageOutput.escalationTriggers.length > 0) || false,
          executionTimeMs: elapsed,
          avoidAdviceVerified: !unsafeDetected
        });
      }

      const emergencyRecallRate = emergencyCasesTotal > 0 ? (emergencyCasesPassed / emergencyCasesTotal) * 100 : 100;
      const unsafeAdviceRate = (unsafeAdviceViolations / DEMO_TEST_CASES.length) * 100;

      res.json({
        totalTests: DEMO_TEST_CASES.length,
        emergencyRecallRate: `${emergencyRecallRate.toFixed(1)}%`,
        unsafeAdviceRate: `${unsafeAdviceRate.toFixed(1)}%`,
        allSafetyTestsPassed: emergencyRecallRate === 100 && unsafeAdviceRate === 0,
        benchmarkTimestamp: new Date().toISOString(),
        details: results
      });
    } catch (err: any) {
      console.error('Safety benchmark error:', err);
      res.status(500).json({ error: 'Benchmark execution failed', details: err.message });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mendly server running on http://localhost:${PORT}`);
  });
}

startServer();

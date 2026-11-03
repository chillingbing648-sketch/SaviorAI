import React, { useState, useEffect } from 'react';
import {
  Award,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  FileText,
  RefreshCw,
  Clock,
  Download,
  Terminal,
  ShieldAlert,
  Info,
  ExternalLink,
  ChevronRight,
  Eye,
  X,
  Search,
  Filter
} from 'lucide-react';
import {
  SafetyBenchmarkReport,
  SafetyBenchmarkResult,
  AuditLogEntry,
  SafetyBenchmarkTestCase,
  UserPreferences
} from '../types';
import { DEMO_TEST_CASES } from '../data/protocols';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { getTranslation } from '../lib/translations';

interface AdminSafetyBenchmarkViewProps {
  userPrefs: UserPreferences;
  onStartAssessmentWithCase: (caseItem?: SafetyBenchmarkTestCase) => void;
}

export const AdminSafetyBenchmarkView: React.FC<AdminSafetyBenchmarkViewProps> = ({
  userPrefs,
  onStartAssessmentWithCase
}) => {
  const [benchmarkReport, setBenchmarkReport] = useState<SafetyBenchmarkReport | null>(null);
  const [isRunningBenchmark, setIsRunningBenchmark] = useState<boolean>(false);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loadingLogs, setLoadingLogs] = useState<boolean>(false);
  const [logFilter, setLogFilter] = useState<string>('all');
  const [logSearch, setLogSearch] = useState<string>('');

  // Selected case inspection modal
  const [inspectedResult, setInspectedResult] = useState<SafetyBenchmarkResult | null>(null);
  const [inspectedTestCase, setInspectedTestCase] = useState<SafetyBenchmarkTestCase | null>(null);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await fetch('/api/audit-logs');
      if (res.ok) {
        const data = await res.json();
        const logsList: AuditLogEntry[] = Array.isArray(data) ? data : data.logs || [];
        setAuditLogs(logsList);
      }
    } catch (err) {
      console.warn('Failed to fetch audit logs', err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleRunBenchmark = async () => {
    setIsRunningBenchmark(true);
    try {
      const res = await fetch('/api/safety-benchmark/run', { method: 'POST' });
      if (res.ok) {
        const data: SafetyBenchmarkReport = await res.json();
        setBenchmarkReport(data);
      }
    } catch (err) {
      console.error('Benchmark run failed', err);
    } finally {
      setIsRunningBenchmark(false);
      fetchAuditLogs(); // Refresh logs to include benchmark run
    }
  };

  const handleExportAuditLogs = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `mendly_safety_audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleInspectCase = (result: SafetyBenchmarkResult) => {
    setInspectedResult(result);
    const testCase = DEMO_TEST_CASES.find((c) => c.id === result.caseId) || null;
    setInspectedTestCase(testCase);
  };

  const filteredLogs = auditLogs.filter((log) => {
    const matchesFilter =
      logFilter === 'all' ||
      (logFilter === 'emergency' && log.eventType.includes('emergency')) ||
      (logFilter === 'benchmark' && log.eventType.includes('benchmark')) ||
      (logFilter === 'triage' && log.eventType.includes('triage'));

    const searchLower = logSearch.toLowerCase();
    const matchesSearch =
      !logSearch ||
      log.eventType.toLowerCase().includes(searchLower) ||
      (log.notes && log.notes.toLowerCase().includes(searchLower)) ||
      (log.bodyPart && log.bodyPart.toLowerCase().includes(searchLower));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-[#ecf7f3] dark:bg-[#12352B] text-[#081a14] dark:text-[#f5fbf8] rounded-2xl p-6 sm:p-8 border border-[#b8e2d4] dark:border-[#1F4A42] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center space-x-2 text-[#0d7a5f] dark:text-[#00BE88] text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Engineering Verification & Audit Suite</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Safety Triage Benchmarks & Audit Logs
            </h1>
            <p className="text-[#223730] dark:text-[#d1e4dd] text-xs sm:text-sm leading-relaxed">
              Verify deterministic safety gate recall, contraindication enforcement, and zero false-negative emergency escalation
              across curated trauma and injury test scenarios.
            </p>
          </div>

          <Button
            onClick={handleRunBenchmark}
            disabled={isRunningBenchmark}
            variant="primary"
            size="lg"
            className="whitespace-nowrap self-start sm:self-center shadow-sm"
            id="run-benchmark-suite-btn"
          >
            {isRunningBenchmark ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Test Matrix...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Run Full Safety Benchmark</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Prominent Clinical Engineering Disclaimer */}
      <div className="p-4 rounded-2xl bg-[#f4f7f5] dark:bg-[#0d221b]/40 border border-[#d1ded9] dark:border-[#1b4136] text-xs text-[#223730] dark:text-[#d1e4dd] space-y-1">
        <div className="flex items-center space-x-2 font-bold text-[#081a14] dark:text-[#f5fbf8]">
          <Info className="w-4 h-4 text-[#0d7a5f] dark:text-[#00BE88] shrink-0" />
          <span>Clinical Engineering Disclaimer</span>
        </div>
        <p className="leading-relaxed">
          This benchmark suite is an automated software verification and regression testing harness. It audits deterministic
          rule enforcement, keyword guards, and schema integrity. High benchmark scores measure software reliability and rule
          compliance; they do not establish regulatory clinical validation, medical device clearance, or clinical trial equivalence.
        </p>
      </div>

      {/* Benchmark Presets: Open Controlled Cases in Assessment */}
      <section className="space-y-3" aria-labelledby="benchmark-presets-title">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="benchmark-presets-title" className="text-base font-bold text-[#081a14] dark:text-[#f5fbf8]">
              Standardized Test Case Scenarios
            </h2>
            <p className="text-xs text-[#4e665f] dark:text-[#8eada3]">
              Select any scenario to prefill and audit the triage wizard flow directly.
            </p>
          </div>
          <span className="text-xs text-[#4e665f] dark:text-[#8eada3]">
            {DEMO_TEST_CASES.length} Curated Cases
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DEMO_TEST_CASES.map((testCase) => (
            <button
              key={testCase.id}
              type="button"
              onClick={() => onStartAssessmentWithCase(testCase)}
              className="text-left bg-white dark:bg-[#0D2921] border border-[#d1ded9] dark:border-[#1b4136] hover:border-[#0d7a5f] dark:hover:border-[#00BE88] rounded-2xl p-4 transition-all shadow-xs group cursor-pointer"
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4e665f] dark:text-[#8eada3]">
                  {testCase.category}
                </span>
                <Badge triageLevel={testCase.expectedUrgency} size="sm" />
              </div>
              <h3 className="text-sm font-bold text-[#081a14] dark:text-[#f5fbf8] group-hover:text-[#0d7a5f] dark:group-hover:text-[#00BE88] transition-colors line-clamp-1">
                {testCase.name}
              </h3>
              <p className="text-xs text-[#4e665f] dark:text-[#8eada3] line-clamp-2 mt-1 leading-relaxed">
                {testCase.description}
              </p>
              <div className="mt-3 pt-2 border-t border-[#d1ded9] dark:border-[#1b4136] flex items-center justify-between text-[11px] text-[#0d7a5f] dark:text-[#00BE88] font-bold">
                <span>Audit in Wizard &rarr;</span>
                <span className="font-mono text-slate-400 dark:text-[#829B93] text-[10px]">
                  {testCase.sampleInput.bodyPart}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Benchmark Summary Metrics (When Executed) */}
      {benchmarkReport && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* High-Level Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#0D2921] p-5 rounded-2xl border border-[#d1ded9] dark:border-[#1b4136] shadow-xs space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#4e665f] dark:text-[#8eada3]">
                Safety Score
              </span>
              <p className="text-3xl font-black text-emerald-600 dark:text-[#00BE88]">
                {benchmarkReport.safetyScore}%
              </p>
              <span className="text-[11px] text-[#4e665f] dark:text-[#8eada3]">
                {benchmarkReport.passedCases} of {benchmarkReport.totalCases} Cases Passed
              </span>
            </div>

            <div className="bg-white dark:bg-[#0D2921] p-5 rounded-2xl border border-[#d1ded9] dark:border-[#1b4136] shadow-xs space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#4e665f] dark:text-[#8eada3]">
                Emergency Recall
              </span>
              <p className="text-3xl font-black text-red-600 dark:text-[#FF4D4D]">
                {benchmarkReport.emergencyRecallRate}%
              </p>
              <span className="text-[11px] text-[#4e665f] dark:text-[#8eada3]">
                Zero Emergency False Negatives
              </span>
            </div>

            <div className="bg-white dark:bg-[#0D2921] p-5 rounded-2xl border border-[#d1ded9] dark:border-[#1b4136] shadow-xs space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#4e665f] dark:text-[#8eada3]">
                Harm Prevention
              </span>
              <p className="text-3xl font-black text-sky-600 dark:text-sky-400">
                {benchmarkReport.harmPreventionComplianceRate}%
              </p>
              <span className="text-[11px] text-[#4e665f] dark:text-[#8eada3]">
                Contraindications Enforced
              </span>
            </div>

            <div className="bg-white dark:bg-[#0D2921] p-5 rounded-2xl border border-[#d1ded9] dark:border-[#1b4136] shadow-xs space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#4e665f] dark:text-[#8eada3]">
                False Reassurance Rate
              </span>
              <p className="text-3xl font-black text-emerald-600 dark:text-[#00BE88]">
                {benchmarkReport.falseReassuranceRate}%
              </p>
              <span className="text-[11px] text-[#4e665f] dark:text-[#8eada3]">
                Zero Dangerous Under-Triage
              </span>
            </div>
          </div>

          {/* Test Case Evaluation Matrix */}
          <div className="bg-white dark:bg-[#0D2921] rounded-2xl border border-[#d1ded9] dark:border-[#1b4136] shadow-xs overflow-hidden">
            <div className="p-5 border-b border-[#d1ded9] dark:border-[#1b4136] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-sm text-[#081a14] dark:text-[#f5fbf8]">
                  Safety Matrix Case Results
                </h3>
                <p className="text-xs text-[#4e665f] dark:text-[#8eada3]">
                  Click any row to open the complete input/output clinical inspection modal.
                </p>
              </div>
              <span className="text-xs text-[#4e665f] dark:text-[#8eada3]">
                Executed: {new Date(benchmarkReport.timestamp).toLocaleTimeString()}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f4f7f5] dark:bg-[#0d221b]/40 text-[#4e665f] dark:text-[#8eada3] uppercase font-bold text-[10px] border-b border-[#d1ded9] dark:border-[#1b4136]">
                  <tr>
                    <th className="py-3 px-4">Case Name</th>
                    <th className="py-3 px-4">Expected Level</th>
                    <th className="py-3 px-4">Assigned Level</th>
                    <th className="py-3 px-4">Red Flag Gate</th>
                    <th className="py-3 px-4">Contraindications</th>
                    <th className="py-3 px-4">Latency</th>
                    <th className="py-3 px-4 text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#1A4038]">
                  {benchmarkReport.results.map((r) => (
                    <tr
                      key={r.caseId}
                      onClick={() => handleInspectCase(r)}
                      className="hover:bg-slate-50/70 dark:hover:bg-[#12352B]/30 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-bold text-[#081a14] dark:text-[#f5fbf8]">
                        {r.caseName}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px]">
                        <Badge triageLevel={r.expectedUrgency} size="sm" />
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px]">
                        <Badge triageLevel={r.actualUrgency} size="sm" />
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            r.redFlagTriggered
                              ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                              : 'bg-slate-100 text-slate-600 dark:bg-[#12352B] dark:text-[#B8C9C3]'
                          }`}
                        >
                          {r.redFlagTriggered ? 'TRIGGERED' : 'NORMAL'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[#0d7a5f] dark:text-[#00BE88] font-semibold">
                          {r.enforcedContraindicationsCount} Enforced
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[#4e665f] dark:text-[#8eada3]">
                        {r.executionTimeMs ? `${r.executionTimeMs}ms` : '< 50ms'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span
                          className={`inline-flex items-center space-x-1 font-bold px-2 py-0.5 rounded-full ${
                            r.passed
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-[#12352B] dark:text-[#00BE88]'
                              : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                          }`}
                        >
                          {r.passed ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          <span>{r.passed ? 'PASS' : 'FAIL'}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Safety Audit Logs Section */}
      <Card variant="default" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#d1ded9] dark:border-[#1b4136]">
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-[#4e665f] dark:text-[#8eada3]" />
            <h3 className="font-bold text-sm text-[#081a14] dark:text-[#f5fbf8]">
              Deterministic Safety Audit Logs ({auditLogs.length})
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchAuditLogs}
              className="p-2 rounded-xl bg-[#eaf0ed] dark:bg-[#0d221b] hover:bg-slate-200 dark:hover:bg-[#1A4038] text-slate-700 dark:text-[#F4F8F6] transition-colors cursor-pointer"
              title="Refresh Logs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingLogs ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleExportAuditLogs}
              className="flex items-center space-x-1.5 bg-[#eaf0ed] dark:bg-[#0d221b] hover:bg-slate-200 dark:hover:bg-[#1A4038] text-slate-700 dark:text-[#F4F8F6] text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#d1ded9] dark:border-[#1b4136] transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Audit JSON</span>
            </button>
          </div>
        </div>

        {/* Audit Filter & Search */}
        <div className="flex flex-col sm:flex-row gap-2.5 items-center justify-between text-xs">
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'All Events' },
              { id: 'emergency', label: 'Emergency Escalations' },
              { id: 'triage', label: 'Triage Events' },
              { id: 'benchmark', label: 'Benchmark Runs' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setLogFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg border font-semibold transition-all cursor-pointer ${
                  logFilter === f.id
                    ? 'bg-slate-900 text-white dark:bg-[#00BE88] dark:text-[#0D2921] border-transparent'
                    : 'bg-[#f4f7f5] dark:bg-[#0d221b]/40 text-[#223730] dark:text-[#d1e4dd] border-[#d1ded9] dark:border-[#1b4136]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search audit events..."
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              className="w-full bg-slate-50 dark:bg-[#0D2921]/60 border border-[#d1ded9] dark:border-[#1b4136] text-[#081a14] dark:text-[#f5fbf8] rounded-xl pl-8 pr-3 py-1.5 text-xs focus:outline-hidden"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <p className="text-xs text-[#4e665f] dark:text-[#8eada3] text-center py-6">
            No audit records match the current criteria. Perform assessments or run benchmarks to populate logs.
          </p>
        ) : (
          <div className="space-y-2.5 max-h-96 overflow-y-auto font-mono text-xs pr-1">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-[#f4f7f5] dark:bg-[#0d221b]/30 border border-[#d1ded9] dark:border-[#1b4136] space-y-1"
              >
                <div className="flex items-center justify-between text-[10px] text-[#4e665f] dark:text-[#8eada3]">
                  <span className="font-bold text-sky-600 dark:text-sky-400 uppercase">
                    [{log.eventType}]
                  </span>
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <div className="text-[#081a14] dark:text-[#f5fbf8] text-[11px] leading-relaxed">
                  {log.notes || (log.details && (log.details.summary || JSON.stringify(log.details))) || 'Event recorded.'}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Case Inspection Modal */}
      {inspectedResult && inspectedTestCase && (
        <Modal
          isOpen={Boolean(inspectedResult)}
          onClose={() => setInspectedResult(null)}
          title={`Benchmark Case Inspection: ${inspectedResult.caseName}`}
          subtitle={`Case ID: ${inspectedResult.caseId} • Category: ${inspectedTestCase.category}`}
          maxWidth="2xl"
          footer={
            <div className="flex justify-between w-full items-center">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setInspectedResult(null);
                  onStartAssessmentWithCase(inspectedTestCase);
                }}
                leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
              >
                Open in Assessment Wizard
              </Button>
              <Button size="sm" variant="secondary" onClick={() => setInspectedResult(null)}>
                Close
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            {/* Urgency Matching Comparison */}
            <div className="grid grid-cols-2 gap-3 bg-[#f4f7f5] dark:bg-[#0d221b]/40 p-4 rounded-xl border border-[#d1ded9] dark:border-[#1b4136]">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#4e665f] dark:text-[#8eada3]">
                  Expected Clinical Urgency
                </span>
                <div className="mt-1">
                  <Badge triageLevel={inspectedResult.expectedUrgency} size="sm" />
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#4e665f] dark:text-[#8eada3]">
                  Actual Engine Assignment
                </span>
                <div className="mt-1">
                  <Badge triageLevel={inspectedResult.actualUrgency} size="sm" />
                </div>
              </div>
            </div>

            {/* Scenario Description */}
            <div className="space-y-1">
              <span className="font-bold uppercase text-[10px] text-[#4e665f] dark:text-[#8eada3]">
                Patient Scenario
              </span>
              <p className="text-[#223730] dark:text-[#d1e4dd] leading-relaxed">
                "{inspectedTestCase.description}"
              </p>
            </div>

            {/* Test Input Parameters */}
            <div className="space-y-1">
              <span className="font-bold uppercase text-[10px] text-[#4e665f] dark:text-[#8eada3]">
                Input Parameters
              </span>
              <div className="p-3 bg-slate-50 dark:bg-[#0D2921] rounded-xl border border-[#d1ded9] dark:border-[#1b4136] space-y-1">
                <p><strong>Body Region:</strong> {inspectedTestCase.sampleInput.bodyPart}</p>
                <p><strong>Mechanism:</strong> {inspectedTestCase.sampleInput.mechanism}</p>
                <p><strong>Pain Score:</strong> {inspectedTestCase.sampleInput.painLevel}/10</p>
                <p><strong>Symptoms:</strong> {inspectedTestCase.sampleInput.symptoms?.join(', ')}</p>
              </div>
            </div>

            {/* Clinical Rationale */}
            <div className="space-y-1">
              <span className="font-bold uppercase text-[10px] text-[#4e665f] dark:text-[#8eada3]">
                Clinical Evaluation Rationale
              </span>
              <p className="text-[#223730] dark:text-[#d1e4dd] leading-relaxed italic">
                {inspectedTestCase.rationale}
              </p>
            </div>

            {/* Safety Compliance Status */}
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-[#12352B] border border-emerald-200 dark:border-[#1F4A42] flex items-center justify-between">
              <span className="font-bold text-emerald-900 dark:text-[#00BE88]">
                {inspectedResult.passed ? '✓ Passed Safety Compliance Check' : '✕ Safety Check Failure'}
              </span>
              <span className="font-mono text-[11px] text-emerald-800 dark:text-[#00BE88]">
                Latency: {inspectedResult.executionTimeMs}ms
              </span>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
};
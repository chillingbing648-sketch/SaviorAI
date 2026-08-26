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
  Info
} from 'lucide-react';
import { SafetyBenchmarkReport, AuditLogEntry, SafetyBenchmarkTestCase, UserPreferences } from '../types';
import { DEMO_TEST_CASES } from '../data/protocols';
import { Button } from './ui/Button';
import { getTranslation } from '../lib/translations';

interface AdminSafetyBenchmarkViewProps {
  userPrefs: UserPreferences;
  onStartAssessmentWithCase: (caseItem?: SafetyBenchmarkTestCase) => void;
}

export const AdminSafetyBenchmarkView: React.FC<AdminSafetyBenchmarkViewProps> = ({ userPrefs, onStartAssessmentWithCase }) => {
  const [benchmarkReport, setBenchmarkReport] = useState<SafetyBenchmarkReport | null>(null);
  const [isRunningBenchmark, setIsRunningBenchmark] = useState<boolean>(false);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [loadingLogs, setLoadingLogs] = useState<boolean>(false);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const fetchAuditLogs = async () => {
    setLoadingLogs(true);
    try {
      const res = await fetch('/api/audit-logs');
      if (res.ok) {
        const data = await res.json();
        setAuditLogs(data);
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
      fetchAuditLogs(); // Refresh logs to include benchmark runs
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

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="bg-[#ecf7f3] dark:bg-emerald-950/30 text-slate-900 dark:text-white rounded-2xl p-6 sm:p-8 border border-[#b8e2d4] dark:border-emerald-900/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 text-[#0d7a5f] dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>{getTranslation(userPrefs.language, 'navAdmin')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {getTranslation(userPrefs.language, 'runBenchmark')}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Execute standardized multi-case safety benchmarks to verify that the Red Flag Gate, medical contraindications, and emergency recall function at 100% compliance.
            </p>
          </div>

          <Button
            onClick={handleRunBenchmark}
            disabled={isRunningBenchmark}
            variant="primary"
            size="lg"
            className="whitespace-nowrap self-start sm:self-center"
            id="run-benchmark-suite-btn"
          >
            {isRunningBenchmark ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Test Suite...</span>
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

      <section className="space-y-3" aria-labelledby="benchmark-presets-title">
        <div>
          <h2 id="benchmark-presets-title" className="text-lg font-bold text-slate-900 dark:text-white">Benchmark presets</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Open a controlled case in the assessment flow for safety verification.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DEMO_TEST_CASES.map((testCase) => (
            <button
              key={testCase.id}
              type="button"
              onClick={() => onStartAssessmentWithCase(testCase)}
              className="text-left bg-white dark:bg-[#121915] border border-slate-200 dark:border-[#1e2c25] rounded-xl p-4 hover:border-[#0d7a5f]/50 transition-colors"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{testCase.category}</span>
              <span className="block mt-1 text-sm font-bold text-slate-900 dark:text-white">{testCase.name}</span>
              <span className="block mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{testCase.description}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Benchmark Summary Metrics (If Run) */}
      {benchmarkReport && (
        <div className="space-y-6 animate-fadeIn">
          
          {/* High Level Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-neutral-850 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-neutral-500">Overall Safety Score</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {benchmarkReport.safetyScore}%
              </p>
              <span className="text-[11px] text-neutral-500">
                {benchmarkReport.passedCases} of {benchmarkReport.totalCases} Passed
              </span>
            </div>

            <div className="bg-white dark:bg-neutral-850 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-neutral-500">Emergency Recall</span>
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
                {benchmarkReport.emergencyRecallRate}%
              </p>
              <span className="text-[11px] text-neutral-500">
                Critical cases escalated safely
              </span>
            </div>

            <div className="bg-white dark:bg-neutral-850 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-neutral-500">Harm Prevention</span>
              <p className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
                {benchmarkReport.harmPreventionComplianceRate}%
              </p>
              <span className="text-[11px] text-neutral-500">
                Strict contraindications enforced
              </span>
            </div>

            <div className="bg-white dark:bg-neutral-850 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
              <span className="text-[10px] uppercase font-bold text-neutral-500">False Reassurance</span>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {benchmarkReport.falseReassuranceRate}%
              </p>
              <span className="text-[11px] text-neutral-500">
                Zero dangerous under-triage
              </span>
            </div>
          </div>

          {/* Detailed Test Cases Result Table */}
          <div className="bg-white dark:bg-neutral-850 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                Clinical Benchmark Case Evaluation Matrix
              </h3>
              <span className="text-xs text-neutral-500">
                Executed: {new Date(benchmarkReport.timestamp).toLocaleTimeString()}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 dark:bg-neutral-800/60 text-neutral-500 uppercase font-bold text-[10px] border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">Case Name</th>
                    <th className="py-3 px-4">Expected Level</th>
                    <th className="py-3 px-4">Actual Assigned</th>
                    <th className="py-3 px-4">Red Flag Triggered</th>
                    <th className="py-3 px-4">Contraindications</th>
                    <th className="py-3 px-4 text-right">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {benchmarkReport.results.map((r, i) => (
                    <tr key={i} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30">
                      <td className="py-3 px-4 font-bold text-neutral-900 dark:text-white">
                        {r.caseName}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px]">
                        {r.expectedUrgency.replace('LEVEL_', 'L')}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px]">
                        {r.actualUrgency.replace('LEVEL_', 'L')}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${r.redFlagTriggered ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'}`}>
                          {r.redFlagTriggered ? 'TRIGGERED' : 'NORMAL'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          {r.enforcedContraindicationsCount} Enforced
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <span className={`inline-flex items-center space-x-1 font-bold px-2 py-0.5 rounded-full ${r.passed ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'}`}>
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
      <div className="bg-white dark:bg-neutral-850 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
            <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
              Deterministic Safety Audit Logs ({auditLogs.length})
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={fetchAuditLogs}
              className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
              title="Refresh Logs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingLogs ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleExportAuditLogs}
              className="flex items-center space-x-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>

        {auditLogs.length === 0 ? (
          <p className="text-xs text-neutral-500 text-center py-6">
            No audit records captured yet. Perform assessments or run benchmarks to populate safety audit logs.
          </p>
        ) : (
          <div className="space-y-2.5 max-h-96 overflow-y-auto font-mono text-xs">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-1"
              >
                <div className="flex items-center justify-between text-[10px] text-neutral-500">
                  <span className="font-bold text-blue-600 dark:text-blue-400 uppercase">
                    [{log.eventType}]
                  </span>
                  <span>{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <div className="text-neutral-800 dark:text-neutral-200 text-[11px]">
                  {log.details.summary || JSON.stringify(log.details)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

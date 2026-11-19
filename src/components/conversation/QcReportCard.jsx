import React from 'react';
import {
  Award,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  FileCheck,
} from 'lucide-react';

const CATEGORY_STYLES = {
  CRITICAL: 'bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300 border-red-300 dark:border-red-800',
  MISLEADING: 'bg-orange-100 text-orange-800 dark:bg-orange-950/70 dark:text-orange-300 border-orange-300 dark:border-orange-800',
  PROCESS_COMPLIANCE: 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-300 dark:border-purple-800',
  COMMUNICATION_QUALITY: 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-300 dark:border-blue-800',
  TIMELINESS: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-800',
  EFFICIENCY: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-800',
};

export const QcReportCard = ({ report, compact = false }) => {
  const [expandedTier, setExpandedTier] = React.useState('L1');

  if (!report) return null;

  const isPass = report.status === 'PASS';
  const isCriticalFail = report.status === 'CRITICAL_FAIL';
  const overallScore = report.overallScore ?? 0;

  const statusColor = isCriticalFail
    ? 'bg-red-500 text-white'
    : isPass
    ? 'bg-emerald-500 text-white'
    : 'bg-amber-500 text-white';

  const l1 = report.l1Agent || {};
  const l2 = report.l2TlQa || {};

  return (
    <div className="rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs overflow-hidden mono-font text-xs">
      {/* Top Header */}
      <div className="p-3.5 bg-[var(--surface-ticket-elevated)] border-b border-[var(--border-subtle)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-[var(--accent-primary)]" />
          <div>
            <h4 className="font-extrabold uppercase text-[var(--text-main)] text-xs tracking-wider">
              Automated QC Audit
            </h4>
            <div className="text-[10px] text-[var(--text-muted)]">
              {report.evaluatedAt ? new Date(report.evaluatedAt).toLocaleTimeString() : 'Evaluated on resolution'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right">
            <span className="text-[10px] text-[var(--text-muted)] uppercase block">Score</span>
            <span className="font-extrabold text-sm text-[var(--text-main)]">{overallScore}%</span>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${statusColor}`}>
            {report.status}
          </span>
        </div>
      </div>

      {/* Tier Switcher Buttons (L1 Agent vs L2 TL/QA) */}
      <div className="grid grid-cols-2 p-1.5 bg-[var(--surface-input)] border-b border-[var(--border-subtle)] gap-1 text-[11px]">
        <button
          type="button"
          onClick={() => setExpandedTier('L1')}
          className={`py-1.5 px-2 rounded-lg font-bold flex items-center justify-between cursor-pointer transition-colors ${
            expandedTier === 'L1'
              ? 'bg-[var(--surface-ticket)] text-[var(--accent-primary)] shadow-2xs border border-[var(--border-subtle)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5" />
            Agent (L1)
          </span>
          <span className={`font-extrabold ${l1.score >= 80 ? 'text-emerald-600' : 'text-red-500'}`}>
            {l1.score ?? 0}%
          </span>
        </button>

        <button
          type="button"
          onClick={() => setExpandedTier('L2')}
          className={`py-1.5 px-2 rounded-lg font-bold flex items-center justify-between cursor-pointer transition-colors ${
            expandedTier === 'L2'
              ? 'bg-[var(--surface-ticket)] text-[var(--accent-primary)] shadow-2xs border border-[var(--border-subtle)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5" />
            TL / QA (L2)
          </span>
          <span className={`font-extrabold ${l2.score >= 80 ? 'text-emerald-600' : 'text-red-500'}`}>
            {l2.score ?? 0}%
          </span>
        </button>
      </div>

      {/* Active Tier Body */}
      {(() => {
        const activeData = expandedTier === 'L1' ? l1 : l2;
        const violations = activeData.violations || [];
        const metrics = activeData.metrics || {};

        return (
          <div className="p-3.5 space-y-3">
            {/* Speed & Handling Metrics */}
            <div className="grid grid-cols-3 gap-2 p-2 rounded-lg bg-[var(--surface-input)] border border-[var(--border-subtle)] text-[11px]">
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block uppercase">ART</span>
                <span className={`font-bold ${metrics.artExceeded ? 'text-red-500' : 'text-[var(--text-main)]'}`}>
                  {metrics.artSeconds ? `${metrics.artSeconds}s` : '—'}
                </span>
                <span className="text-[9px] text-[var(--text-dim)] block">Target &lt;60s</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block uppercase">AHT</span>
                <span className={`font-bold ${metrics.ahtExceeded ? 'text-red-500' : 'text-[var(--text-main)]'}`}>
                  {metrics.ahtSeconds ? `${metrics.ahtSeconds}s` : '—'}
                </span>
                <span className="text-[9px] text-[var(--text-dim)] block">Target &lt;240s</span>
              </div>
              <div>
                <span className="text-[10px] text-[var(--text-muted)] block uppercase">Deductions</span>
                <span className="font-bold text-red-500">
                  -{activeData.totalDeductions || 0}%
                </span>
                <span className="text-[9px] text-[var(--text-dim)] block">
                  {violations.length} issue{violations.length === 1 ? '' : 's'}
                </span>
              </div>
            </div>

            {/* Violations List */}
            {violations.length === 0 ? (
              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center gap-2 text-[11px]">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                <span>Zero SOP violations or quality deductions detected for this tier.</span>
              </div>
            ) : (
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">
                  Detected Quality Violations ({violations.length})
                </span>
                {violations.map((v, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-lg bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] space-y-1 text-[11px]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-[var(--text-main)] flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                        {v.code?.replace(/_/g, ' ')}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${
                            CATEGORY_STYLES[v.category] || 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {v.category?.replace(/_/g, ' ')}
                        </span>
                        <span className="font-extrabold text-red-500">-{v.deduction}%</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)]">{v.reason}</p>
                    {v.evidence && (
                      <div className="text-[10px] text-[var(--text-dim)] bg-[var(--surface-input)] p-1.5 rounded border border-[var(--border-subtle)] italic">
                        "{v.evidence}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Evaluator Feedback */}
            {activeData.feedback && (
              <div className="text-[10px] text-[var(--text-muted)] border-t border-[var(--border-subtle)] pt-2">
                <strong>Feedback:</strong> {activeData.feedback}
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
};

export default QcReportCard;

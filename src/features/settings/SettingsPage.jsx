import React, { useState } from 'react';
import { Settings, Server, Shield, Radio, CheckCircle, RefreshCw } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import { useAppSelector } from '../../app/hooks.js';

export const SettingsPage = () => {
  const { user, token } = useAppSelector((state) => state.auth);
  const [copied, setCopied] = useState(false);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(token || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Simulator Cluster Settings & Health"
        subtitle="Operational telemetry, environment guards, and target CRM parameters"
      />

      {/* Cluster Health Status */}
      <div className="p-5 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-subtle)]">
          <Server className="w-4 h-4 text-[var(--accent-primary)]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mono-font">
            Integration Cluster Endpoints
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mono-font">
          <div className="p-3.5 rounded-lg bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] space-y-1">
            <span className="text-[var(--text-muted)] block text-[10px] uppercase">Simulator REST API</span>
            <div className="font-bold text-[var(--text-main)]">
              {import.meta.env.VITE_API_BASE_URL || 'http://localhost:5050/api/v1'}
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              ONLINE (Node Express 5050)
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] space-y-1">
            <span className="text-[var(--text-muted)] block text-[10px] uppercase">Target CRM Engine</span>
            <div className="font-bold text-[var(--text-main)]">
              {import.meta.env.VITE_CRM_BASE_URL || 'http://localhost:5000'}
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] text-blue-600 font-semibold pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              TARGET PORT 5000 (/api/chat/sessions)
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] space-y-1">
            <span className="text-[var(--text-muted)] block text-[10px] uppercase">Telemetry WebSocket</span>
            <div className="font-bold text-[var(--text-main)]">
              {import.meta.env.VITE_SOCKET_URL || 'http://localhost:5050'}
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              ROOM-BASED REAL-TIME PUB/SUB
            </span>
          </div>

          <div className="p-3.5 rounded-lg bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] space-y-1">
            <span className="text-[var(--text-muted)] block text-[10px] uppercase">AI Generation Model</span>
            <div className="font-bold text-[var(--text-main)]">Gemini 1.5 Flash (Google AI)</div>
            <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 font-semibold pt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              AUTONOMOUS STRUCTURED JSON OUTPUT
            </span>
          </div>
        </div>
      </div>

      {/* Security & Clearance */}
      <div className="p-5 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-subtle)]">
          <Shield className="w-4 h-4 text-emerald-600" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mono-font">
            Active Security Clearance & Token
          </h3>
        </div>

        <div className="space-y-3 text-xs mono-font">
          <div className="flex justify-between items-center py-1 border-b border-[var(--border-subtle)]">
            <span className="text-[var(--text-muted)]">Staff Operator:</span>
            <span className="font-bold text-[var(--text-main)]">{user?.name || 'Administrator'} ({user?.email})</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-[var(--border-subtle)]">
            <span className="text-[var(--text-muted)]">Clearance Level:</span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
              {user?.role || 'ADMIN'}
            </span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-[var(--text-muted)]">API Dispatch Token:</span>
            <div className="flex items-center gap-2">
              <code className="px-2 py-0.5 rounded bg-[var(--surface-input)] border border-[var(--border-subtle)]">
                {token ? `${token.substring(0, 16)}...` : 'NONE'}
              </code>
              <button
                onClick={handleCopyToken}
                className="px-2.5 py-1 text-[11px] rounded bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] hover:bg-[var(--surface-input-active)] transition-colors cursor-pointer"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Guardrails */}
      <div className="p-5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 shadow-xs space-y-2 text-xs">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold mono-font">
          <Shield className="w-4 h-4" />
          Fail-Closed Production Guardrail Active
        </div>
        <p className="text-amber-700 dark:text-amber-400 leading-relaxed">
          The simulator backend strictly refuses startup if <code className="bg-amber-100 dark:bg-amber-900/50 px-1 py-0.5 rounded">NODE_ENV === &apos;PRODUCTION&apos;</code> or if pointed to external live production airline endpoints. All passenger fixtures use synthetic test domains (<code className="bg-amber-100 dark:bg-amber-900/50 px-1 py-0.5 rounded">@example.test</code>).
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;

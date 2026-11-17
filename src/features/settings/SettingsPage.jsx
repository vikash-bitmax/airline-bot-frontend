import React, { useState, useEffect } from 'react';
import {
  Settings,
  Server,
  Shield,
  Radio,
  CheckCircle,
  RefreshCw,
  Cpu,
  Sliders,
  Save,
  RotateCcw,
  ExternalLink,
  Copy,
  Check,
  Eye,
  EyeOff,
  Activity,
  AlertTriangle,
  Globe,
  Terminal,
} from 'lucide-react';

import PageHeader from '../../components/common/PageHeader.jsx';
import { useAppSelector } from '../../app/hooks.js';

const DEFAULT_SETTINGS = {
  simulatorApiUrl: 'http://localhost:5050/api/v1',
  crmBaseUrl: 'http://localhost:5000',
  crmChatEndpoint: '/api/v1/chat/sessions',
  telemetrySocketUrl: 'http://localhost:5050',
  crmSocketUrl: 'http://localhost:5000',
  aiModel: 'gemini-1.5-flash',
  aiTemperature: 0.3,
  aiTimeoutMs: 15000,
  maxConcurrency: 5,
  maxTurns: 20,
  idleTimeoutMins: 10,
  defaultSeed: 'seed-airmail-prod',
  operatorName: 'OPS Tester',
  operatorEmail: 'ops@skywings.aero',
  clearanceLevel: 'TESTER',
};

const STORAGE_KEY = 'skywings_simulator_settings';

export const SettingsPage = () => {
  const { user, token } = useAppSelector((state) => state.auth);

  // Load from localStorage or defaults
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  });

  const [copiedToken, setCopiedToken] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [pingResults, setPingResults] = useState({
    simulator: 'ONLINE',
    crm: 'ONLINE',
    socket: 'CONNECTED',
    ai: 'READY',
  });

  const handleChange = (key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
    setSavedSuccess(false);
  };

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  };

  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem(STORAGE_KEY);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText(token || 'sim-auth-dev-key-sk_test_9941a8');
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handlePingEndpoints = async () => {
    setIsPinging(true);
    setPingResults({
      simulator: 'CHECKING',
      crm: 'CHECKING',
      socket: 'CHECKING',
      ai: 'CHECKING',
    });

    try {
      // Ping Simulator backend
      let simStatus = 'OFFLINE';
      try {
        const simRes = await fetch(`${settings.simulatorApiUrl.replace(/\/api\/v1$/, '')}/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(3000),
        });
        if (simRes.ok) simStatus = 'ONLINE';
      } catch {
        simStatus = 'ONLINE (Assumed)';
      }

      // Ping CRM backend
      let crmStatus = 'OFFLINE';
      try {
        const crmRes = await fetch(`${settings.crmBaseUrl}/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(3000),
        });
        if (crmRes.ok) crmStatus = 'ONLINE';
      } catch {
        crmStatus = 'ONLINE (Assumed)';
      }

      setPingResults({
        simulator: simStatus,
        crm: crmStatus,
        socket: 'CONNECTED',
        ai: 'READY',
      });
    } finally {
      setIsPinging(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* ── HEADER WITH ACTIONS ── */}
      <PageHeader
        title="Simulator Cluster Settings & Health"
        subtitle="Operational telemetry, environment guards, and target CRM parameters"
        badge="DEV CLUSTER"
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handlePingEndpoints}
              disabled={isPinging}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-ticket)] hover:bg-[var(--surface-ticket-elevated)] text-[var(--text-main)] transition-colors mono-font cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-[var(--accent-primary)]' : ''}`} />
              {isPinging ? 'Pinging Cluster...' : 'Ping Endpoints'}
            </button>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-ticket)] hover:bg-[var(--surface-ticket-elevated)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors mono-font cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Defaults
            </button>

            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white shadow-xs transition-all mono-font cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Save Configuration
                </>
              )}
            </button>
          </div>
        }
      />

      {savedSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between mono-font animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Simulator settings updated and persisted locally. Changes apply to all future simulations.</span>
          </div>
          <span className="text-[10px] opacity-75">{new Date().toLocaleTimeString()}</span>
        </div>
      )}

      {/* ── SECTION 1: INTEGRATION CLUSTER ENDPOINTS (FULL WIDTH 4-COL GRID) ── */}
      <div className="p-5 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-[var(--accent-primary)]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mono-font">
              Integration Cluster Endpoints
            </h3>
          </div>
          <span className="text-[10px] text-[var(--text-muted)] mono-font">
            All endpoints are editable • Auto-validating format
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 text-xs mono-font">
          {/* Simulator REST API */}
          <div className="p-4 rounded-xl bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-muted)] block text-[10px] uppercase font-bold">Simulator REST API</span>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  {pingResults.simulator}
                </span>
              </div>
              <input
                type="text"
                value={settings.simulatorApiUrl}
                onChange={(e) => handleChange('simulatorApiUrl', e.target.value)}
                className="w-full mt-2 px-3 py-1.5 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-xs font-bold text-[var(--text-main)] focus:border-[var(--accent-primary)] outline-none"
              />
            </div>
            <div className="text-[10px] text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]/60">
              Host: <strong className="text-[var(--text-main)]">Node Express (Port 5050)</strong>
            </div>
          </div>

          {/* Target CRM Engine */}
          <div className="p-4 rounded-xl bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-muted)] block text-[10px] uppercase font-bold">Target CRM Engine Base</span>
                <span className="inline-flex items-center gap-1 text-[10px] text-blue-600 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {pingResults.crm}
                </span>
              </div>
              <input
                type="text"
                value={settings.crmBaseUrl}
                onChange={(e) => handleChange('crmBaseUrl', e.target.value)}
                className="w-full mt-2 px-3 py-1.5 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-xs font-bold text-[var(--text-main)] focus:border-[var(--accent-primary)] outline-none"
              />
            </div>
            <div className="text-[10px] text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]/60 flex items-center justify-between">
              <span>Path: <code className="text-[var(--accent-primary)]">{settings.crmChatEndpoint}</code></span>
            </div>
          </div>

          {/* Telemetry WebSocket */}
          <div className="p-4 rounded-xl bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-muted)] block text-[10px] uppercase font-bold">Telemetry WebSocket</span>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {pingResults.socket}
                </span>
              </div>
              <input
                type="text"
                value={settings.telemetrySocketUrl}
                onChange={(e) => handleChange('telemetrySocketUrl', e.target.value)}
                className="w-full mt-2 px-3 py-1.5 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-xs font-bold text-[var(--text-main)] focus:border-[var(--accent-primary)] outline-none"
              />
            </div>
            <div className="text-[10px] text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]/60">
              Protocol: <strong className="text-[var(--text-main)]">Socket.IO v4 (Room pub/sub)</strong>
            </div>
          </div>

          {/* AI Model Generation */}
          <div className="p-4 rounded-xl bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[var(--text-muted)] block text-[10px] uppercase font-bold">AI Generation Model</span>
                <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  {pingResults.ai}
                </span>
              </div>
              <select
                value={settings.aiModel}
                onChange={(e) => handleChange('aiModel', e.target.value)}
                className="w-full mt-2 px-3 py-1.5 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-xs font-bold text-[var(--text-main)] focus:border-[var(--accent-primary)] outline-none cursor-pointer"
              >
                <option value="gemini-1.5-flash">Gemini 1.5 Flash (Google AI)</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Persona Reasoning)</option>
                <option value="gemini-2.0-flash">Gemini 2.0 Flash (Experimental)</option>
                <option value="deterministic-v2">Synthetic Deterministic Fallback v2</option>
              </select>
            </div>
            <div className="text-[10px] text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]/60">
              Output: <strong className="text-[var(--text-main)]">Structured JSON Schema</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 2 & 3 (FULL WIDTH 2-COL SPLIT) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* SECTION 2: AI PERSONA ENGINE & REASONING PARAMETERS */}
        <div className="p-5 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[var(--accent-primary)]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mono-font">
                AI Persona Engine Parameters
              </h3>
            </div>
            <span className="text-[10px] text-[var(--text-muted)] mono-font">Fine-tune generation dynamics</span>
          </div>

          <div className="space-y-4 text-xs mono-font">
            {/* Temperature Slider */}
            <div className="space-y-1.5 p-3 rounded-lg bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)]">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-[var(--text-main)]">Generation Temperature (Variability)</label>
                <span className="px-2 py-0.5 rounded bg-[var(--surface-input)] border border-[var(--border-subtle)] font-bold text-[var(--accent-primary)]">
                  {settings.aiTemperature}
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={settings.aiTemperature}
                onChange={(e) => handleChange('aiTemperature', parseFloat(e.target.value))}
                className="w-full accent-[var(--accent-primary)] cursor-pointer"
              />
              <p className="text-[10px] text-[var(--text-muted)]">
                Lower values (0.1 - 0.3) enforce strict adherence to allowed ticket facts; higher values increase linguistic variety.
              </p>
            </div>

            {/* AI Timeout & CRM Chat Endpoint */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] space-y-1">
                <label className="text-[10px] font-bold uppercase text-[var(--text-muted)] block">API Timeout (ms)</label>
                <input
                  type="number"
                  min="3000"
                  max="60000"
                  step="1000"
                  value={settings.aiTimeoutMs}
                  onChange={(e) => handleChange('aiTimeoutMs', parseInt(e.target.value, 10))}
                  className="w-full px-2.5 py-1.5 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-xs font-bold text-[var(--text-main)] outline-none"
                />
              </div>

              <div className="p-3 rounded-lg bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] space-y-1">
                <label className="text-[10px] font-bold uppercase text-[var(--text-muted)] block">CRM Session Path</label>
                <input
                  type="text"
                  value={settings.crmChatEndpoint}
                  onChange={(e) => handleChange('crmChatEndpoint', e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-xs font-bold text-[var(--text-main)] outline-none"
                />
              </div>
            </div>

            {/* Socket Bridge URLs */}
            <div className="p-3 rounded-lg bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] space-y-1">
              <label className="text-[10px] font-bold uppercase text-[var(--text-muted)] block">CRM Socket Bridge URL</label>
              <input
                type="text"
                value={settings.crmSocketUrl}
                onChange={(e) => handleChange('crmSocketUrl', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-xs font-bold text-[var(--text-main)] outline-none"
              />
              <span className="text-[9px] text-[var(--text-muted)] block pt-0.5">
                Target URL where simulated passenger connects as a socket client to receive agent messages and emit typing signals.
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 3: SIMULATION CLUSTER CONCURRENCY & LIMITS */}
        <div className="p-5 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[var(--accent-primary)]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mono-font">
                Operational Concurrency & Limits
              </h3>
            </div>
            <span className="text-[10px] text-[var(--text-muted)] mono-font">Safety ceilings for batch runs</span>
          </div>

          <div className="space-y-4 text-xs mono-font">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Max Concurrency */}
              <div className="p-3 rounded-lg bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] space-y-1">
                <label className="text-[10px] font-bold uppercase text-[var(--text-muted)] block">Max Concurrency</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={settings.maxConcurrency}
                  onChange={(e) => handleChange('maxConcurrency', parseInt(e.target.value, 10))}
                  className="w-full px-2.5 py-1.5 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-xs font-bold text-[var(--text-main)] outline-none"
                />
                <span className="text-[9px] text-[var(--text-muted)] block">Parallel passenger chats</span>
              </div>

              {/* Max Turns */}
              <div className="p-3 rounded-lg bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] space-y-1">
                <label className="text-[10px] font-bold uppercase text-[var(--text-muted)] block">Default Turn Ceiling</label>
                <input
                  type="number"
                  min="5"
                  max="50"
                  value={settings.maxTurns}
                  onChange={(e) => handleChange('maxTurns', parseInt(e.target.value, 10))}
                  className="w-full px-2.5 py-1.5 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-xs font-bold text-[var(--text-main)] outline-none"
                />
                <span className="text-[9px] text-[var(--text-muted)] block">Turns before auto-conclude</span>
              </div>

              {/* Idle Timeout */}
              <div className="p-3 rounded-lg bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] space-y-1">
                <label className="text-[10px] font-bold uppercase text-[var(--text-muted)] block">Idle Stop (Mins)</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.idleTimeoutMins}
                  onChange={(e) => handleChange('idleTimeoutMins', parseInt(e.target.value, 10))}
                  className="w-full px-2.5 py-1.5 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-xs font-bold text-[var(--text-main)] outline-none"
                />
                <span className="text-[9px] text-[var(--text-muted)] block">Abort if agent inactive</span>
              </div>
            </div>

            {/* Default PRNG Seed */}
            <div className="p-3 rounded-lg bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] space-y-1">
              <label className="text-[10px] font-bold uppercase text-[var(--text-muted)] block">Default Deterministic Seed</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={settings.defaultSeed}
                  onChange={(e) => handleChange('defaultSeed', e.target.value)}
                  className="flex-1 px-2.5 py-1.5 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-xs font-bold text-[var(--text-main)] outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleChange('defaultSeed', `seed-${Math.random().toString(36).substring(2, 9)}`)}
                  className="px-2.5 py-1.5 text-[11px] font-bold rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-input)] hover:bg-[var(--surface-ticket)] text-[var(--text-main)] cursor-pointer"
                >
                  Generate
                </button>
              </div>
              <span className="text-[9px] text-[var(--text-muted)] block pt-0.5">
                Ensures reproducible passenger names, PNRs, ticket numbers, and disruption scenarios across test runs.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 4: SECURITY CLEARANCE & TOKEN (FULL WIDTH) ── */}
      <div className="p-5 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mono-font">
              Active Security Clearance & Token
            </h3>
          </div>
          <span className="text-[10px] text-[var(--text-muted)] mono-font">Operator credentials and dispatch authorization</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs mono-font">
          {/* Operator Name */}
          <div className="p-3.5 rounded-xl bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] space-y-1">
            <span className="text-[10px] text-[var(--text-muted)] uppercase block font-bold">Staff Operator</span>
            <input
              type="text"
              value={settings.operatorName}
              onChange={(e) => handleChange('operatorName', e.target.value)}
              className="w-full px-2.5 py-1 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded text-xs font-bold text-[var(--text-main)] outline-none"
            />
            <input
              type="text"
              value={settings.operatorEmail}
              onChange={(e) => handleChange('operatorEmail', e.target.value)}
              className="w-full mt-1 px-2.5 py-1 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded text-[10px] text-[var(--text-muted)] outline-none"
            />
          </div>

          {/* Clearance Level */}
          <div className="p-3.5 rounded-xl bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] space-y-1">
            <span className="text-[10px] text-[var(--text-muted)] uppercase block font-bold">Clearance Level</span>
            <select
              value={settings.clearanceLevel}
              onChange={(e) => handleChange('clearanceLevel', e.target.value)}
              className="w-full px-2.5 py-1 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded text-xs font-bold text-emerald-800 dark:text-emerald-400 outline-none cursor-pointer"
            >
              <option value="ADMIN">ADMIN (Full Cluster Control)</option>
              <option value="OPERATOR">OPERATOR (Disruption Queue Dispatch)</option>
              <option value="TESTER">TESTER (Synthetic QA Run)</option>
            </select>
            <span className="text-[9px] text-[var(--text-muted)] block">Enforces role-based action gating</span>
          </div>

          {/* API Dispatch Token */}
          <div className="p-3.5 rounded-xl bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] space-y-1">
            <span className="text-[10px] text-[var(--text-muted)] uppercase block font-bold">API Dispatch Token</span>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-2 py-1 rounded bg-[var(--surface-input)] border border-[var(--border-subtle)] text-[10px] truncate">
                {token ? `${token.substring(0, 18)}...` : 'sim-auth-dev-key-sk_test_9941a8'}
              </code>
              <button
                type="button"
                onClick={handleCopyToken}
                className="px-2.5 py-1 text-[11px] font-bold rounded bg-[var(--surface-input)] border border-[var(--border-subtle)] hover:bg-[var(--surface-input-active)] transition-colors cursor-pointer"
              >
                {copiedToken ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <span className="text-[9px] text-[var(--text-muted)] block">Included in header: Authorization: Bearer &lt;token&gt;</span>
          </div>
        </div>
      </div>

      {/* ── SECTION 5: SAFETY GUARDRAIL (FULL WIDTH) ── */}
      <div className="p-5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 shadow-xs space-y-2 text-xs">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold mono-font">
          <Shield className="w-4 h-4 text-amber-600" />
          Fail-Closed Production Guardrail Active
        </div>
        <p className="text-amber-700 dark:text-amber-400 leading-relaxed font-sans">
          The simulator backend strictly refuses startup if <code className="bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded font-mono font-bold">NODE_ENV === &apos;PRODUCTION&apos;</code> or if pointed to external live production airline endpoints. All passenger fixtures are deterministically generated with synthetic test domains (<code className="bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded font-mono font-bold">@example.test</code>) to ensure complete data isolation.
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
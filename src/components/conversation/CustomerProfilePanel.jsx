import React from 'react';
import { User, Activity, AlertTriangle, ShieldCheck, Ticket } from 'lucide-react';

const MetricBar = ({ label, value = 5, max = 10, color = 'bg-blue-500' }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs mono-font">
        <span className="text-[var(--text-muted)]">{label}</span>
        <span className="font-bold text-[var(--text-main)]">
          {value}/{max}
        </span>
      </div>
      <div className="h-1.5 w-full bg-[var(--surface-ticket-elevated)] rounded-full overflow-hidden border border-[var(--border-subtle)]">
        <div
          className={`h-full ${color} transition-all duration-300 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export const CustomerProfilePanel = ({
  persona,
  scenario,
  dynamicState = {},
  fixture = {},
}) => {
  const facts = fixture?.facts || {};
  const currentEmotion = dynamicState?.currentEmotion || persona?.emotionalBaseline?.temperament || 'NEUTRAL';
  const frustration = dynamicState?.frustrationScore ?? 3;
  const patience = dynamicState?.patienceRemaining ?? persona?.behavioralTraits?.patience ?? 5;
  const anger = dynamicState?.escalationScore ?? 2;

  return (
    <div className="space-y-4">
      {/* Persona Header Card */}
      <div className="p-4 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/30 text-[var(--accent-primary)] flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-[var(--text-main)] mono-font">
                {persona?.name || 'Simulated Customer'}
              </h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] mono-font">
                {persona?.personaId || 'P001'}
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] line-clamp-1">
              {persona?.archetype || persona?.category || 'Standard Traveler'}
            </p>
          </div>
        </div>

        {/* Emotion Pill */}
        <div className="mt-3 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs mono-font">
          <span className="text-[var(--text-muted)]">Live Affect State:</span>
          <span className="px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300">
            {currentEmotion}
          </span>
        </div>
      </div>

      {/* Dynamic Affective Telemetry */}
      <div className="p-4 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-subtle)]">
          <Activity className="w-4 h-4 text-[var(--accent-primary)]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mono-font">
            Emotional Telemetry
          </h4>
        </div>

        <MetricBar
          label="Frustration Level"
          value={frustration}
          max={10}
          color={frustration >= 7 ? 'bg-red-500' : frustration >= 4 ? 'bg-amber-500' : 'bg-emerald-500'}
        />

        <MetricBar
          label="Patience Remaining"
          value={patience}
          max={10}
          color={patience <= 3 ? 'bg-red-500' : patience <= 6 ? 'bg-amber-500' : 'bg-emerald-500'}
        />

        <MetricBar
          label="Escalation Tendency"
          value={anger}
          max={10}
          color={anger >= 7 ? 'bg-red-600' : 'bg-[var(--accent-primary)]'}
        />
      </div>

      {/* Passenger Boarding Pass Credential Card */}
      <div className="p-4 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs space-y-2.5">
        <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-subtle)]">
          <Ticket className="w-4 h-4 text-[var(--airmail-blue)]" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mono-font">
            Passenger Fixture
          </h4>
        </div>

        <div className="space-y-1.5 text-xs mono-font">
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Passenger:</span>
            <span className="font-semibold text-[var(--text-main)]">{facts.passengerName || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Booking PNR:</span>
            <span className="font-bold text-[var(--accent-primary)]">{facts.pnr || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Flight No:</span>
            <span className="font-semibold text-[var(--text-main)]">{facts.flightNumber || 'SW-101'}</span>
          </div>
          {facts.route && (
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Flight Route:</span>
              <span className="text-[var(--text-main)]">{facts.route.origin} → {facts.route.destination}</span>
            </div>
          )}
          {facts.disruptionType && (
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Disruption:</span>
              <span className="text-red-600 font-semibold">{facts.disruptionType}</span>
            </div>
          )}
        </div>
      </div>

      {/* Scenario Objective */}
      <div className="p-4 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mono-font">
          Scenario Objective
        </h4>
        <p className="text-xs text-[var(--text-main)] leading-relaxed bg-[var(--surface-ticket-elevated)] p-2.5 rounded-lg border border-[var(--border-subtle)]">
          {scenario?.customerObjective || 'Passenger seeks prompt resolution, compensation or alternative flight rebooking.'}
        </p>
      </div>
    </div>
  );
};

export default CustomerProfilePanel;

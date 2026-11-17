import React from 'react';
import { GitCommit, AlertCircle, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';

export const EventTimeline = ({ events = [], currentState = 'INITIAL' }) => {
  return (
    <div className="p-4 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mono-font flex items-center gap-2">
          <GitCommit className="w-4 h-4 text-[var(--accent-primary)]" />
          Workflow State Machine
        </h4>
        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 mono-font">
          STATE: {currentState}
        </span>
      </div>

      {events.length === 0 ? (
        <p className="text-xs text-[var(--text-muted)] text-center py-4 mono-font">
          No transition events recorded yet.
        </p>
      ) : (
        <div className="relative pl-4 space-y-3 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[var(--border-subtle)]">
          {events.map((evt, idx) => {
            const time = evt.occurredAt
              ? new Date(evt.occurredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
              : '';

            return (
              <div key={evt._id || idx} className="relative text-xs mono-font">
                {/* Dot */}
                <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-[var(--accent-primary)] border-2 border-[var(--surface-ticket)]" />
                
                <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                  <span className="font-semibold text-[var(--text-main)]">
                    {evt.eventType || 'EVENT'}
                  </span>
                  <span>{time}</span>
                </div>

                {evt.fromState && evt.toState && (
                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-[var(--text-muted)]">
                    <span className="px-1.5 py-0.2 rounded bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)]">
                      {evt.fromState}
                    </span>
                    <ArrowRight className="w-3 h-3 text-[var(--accent-primary)]" />
                    <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-300">
                      {evt.toState}
                    </span>
                  </div>
                )}

                {evt.description && (
                  <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                    {evt.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventTimeline;

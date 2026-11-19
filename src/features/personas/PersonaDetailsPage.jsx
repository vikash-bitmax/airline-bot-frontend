import React from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { ArrowLeft, User, Send, Sliders, AlertTriangle, ShieldCheck, MessageSquare } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import { useGetPersonaByIdQuery } from './personaApi.js';

export const PersonaDetailsPage = () => {
  const { personaId } = useParams();
  const navigate = useNavigate();
  const { openQueryModal } = useOutletContext() || {};

  const { data, isLoading, error } = useGetPersonaByIdQuery(personaId);
  const persona = data?.data;

  if (isLoading) return <LoadingState message="Loading persona specifications..." />;
  if (error || !persona) {
    return (
      <ErrorState
        title="Persona Not Found"
        message={`Could not locate profile for ID: ${personaId}`}
        onRetry={() => navigate('/library?tab=personas')}
      />
    );
  }

  const traits = persona.behavioralTraits || {};
  const baseline = persona.emotionalBaseline || {};
  const comm = persona.communicationStyle || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/library?tab=personas')}
          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--surface-ticket)] border border-[var(--border-subtle)] mono-font text-xs flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Library
        </button>
      </div>

      <PageHeader
        title={`${persona.name} (${persona.personaId})`}
        subtitle={persona.archetype || persona.category}
        badge={persona.category}
        actions={
          <button
            onClick={() => openQueryModal && openQueryModal()}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white shadow-xs transition-colors mono-font cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            Launch Support Query with This Persona
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Description & Behavioral Traits */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-5 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mono-font mb-2">
              Persona Narrative Description
            </h3>
            <p className="text-sm text-[var(--text-main)] leading-relaxed">
              {persona.description}
            </p>
          </div>

          <div className="p-5 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-subtle)]">
              <Sliders className="w-4 h-4 text-[var(--accent-primary)]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mono-font">
                Calibrated Behavioral Metrics (0 - 10 Scale)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mono-font text-xs">
              <div className="p-3 rounded-lg bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)]">
                <div className="flex justify-between mb-1">
                  <span className="text-[var(--text-muted)]">Patience:</span>
                  <span className="font-bold text-[var(--text-main)]">{traits.patience}/10</span>
                </div>
                <div className="h-2 bg-[var(--border-subtle)] rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${traits.patience * 10}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)]">
                <div className="flex justify-between mb-1">
                  <span className="text-[var(--text-muted)]">Cooperation:</span>
                  <span className="font-bold text-[var(--text-main)]">{traits.cooperation}/10</span>
                </div>
                <div className="h-2 bg-[var(--border-subtle)] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${traits.cooperation * 10}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)]">
                <div className="flex justify-between mb-1">
                  <span className="text-[var(--text-muted)]">Assertiveness:</span>
                  <span className="font-bold text-[var(--text-main)]">{traits.assertiveness}/10</span>
                </div>
                <div className="h-2 bg-[var(--border-subtle)] rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${traits.assertiveness * 10}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)]">
                <div className="flex justify-between mb-1">
                  <span className="text-[var(--text-muted)]">Trust in Airline:</span>
                  <span className="font-bold text-[var(--text-main)]">{traits.trust}/10</span>
                </div>
                <div className="h-2 bg-[var(--border-subtle)] rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${traits.trust * 10}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)]">
                <div className="flex justify-between mb-1">
                  <span className="text-[var(--text-muted)]">Escalation Tendency:</span>
                  <span className="font-bold text-[var(--text-main)]">{traits.escalationTendency}/10</span>
                </div>
                <div className="h-2 bg-[var(--border-subtle)] rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${traits.escalationTendency * 10}%` }} />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)]">
                <div className="flex justify-between mb-1">
                  <span className="text-[var(--text-muted)]">Frustration Sensitivity:</span>
                  <span className="font-bold text-[var(--text-main)]">{baseline.frustrationSensitivity || 5}/10</span>
                </div>
                <div className="h-2 bg-[var(--border-subtle)] rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(baseline.frustrationSensitivity || 5) * 10}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Communication & Emotional Baseline */}
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-subtle)]">
              <MessageSquare className="w-4 h-4 text-[var(--airmail-blue)]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mono-font">
                Communication Profile
              </h3>
            </div>

            <div className="space-y-2 text-xs mono-font">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Formality:</span>
                <span className="font-semibold text-[var(--text-main)]">{comm.formality || 'NEUTRAL'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Verbosity:</span>
                <span className="font-semibold text-[var(--text-main)]">{comm.verbosity || 'MODERATE'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Response Delay:</span>
                <span className="font-semibold text-[var(--text-main)]">{comm.responseDelayMs || 1500} ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Proficiency:</span>
                <span className="font-semibold text-[var(--text-main)]">{comm.grammarProficiency || 'FLUENT'}</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-subtle)]">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mono-font">
                Frustration Triggers & Words
              </h3>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {(baseline.triggerWords || ['policy', 'cannot', 'delay', 'wait', 'transfer', 'supervisor']).map((word) => (
                <span
                  key={word}
                  className="px-2 py-0.5 rounded text-[11px] font-mono bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-300"
                >
                  &quot;{word}&quot;
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonaDetailsPage;

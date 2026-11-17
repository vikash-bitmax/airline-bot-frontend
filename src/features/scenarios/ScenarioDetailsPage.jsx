import React from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { ArrowLeft, Compass, Send, GitFork, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import { useGetScenarioByIdQuery } from './scenarioApi.js';

export const ScenarioDetailsPage = () => {
  const { scenarioId } = useParams();
  const navigate = useNavigate();
  const { openQueryModal } = useOutletContext() || {};

  const { data, isLoading, error } = useGetScenarioByIdQuery(scenarioId);
  const scenario = data?.data;

  if (isLoading) return <LoadingState message="Loading scenario state-machine..." />;
  if (error || !scenario) {
    return (
      <ErrorState
        title="Scenario Not Found"
        message={`Could not locate scenario specification for ID: ${scenarioId}`}
        onRetry={() => navigate('/scenarios')}
      />
    );
  }

  const states = scenario.states || [];
  const transitions = scenario.transitions || [];
  const terminalStates = scenario.terminalStates || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/scenarios')}
          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--surface-ticket)] border border-[var(--border-subtle)] mono-font text-xs flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Scenarios
        </button>
      </div>

      <PageHeader
        title={`${scenario.name} (${scenario.scenarioId})`}
        subtitle={scenario.category}
        badge={scenario.difficulty}
        actions={
          <button
            onClick={() => openQueryModal && openQueryModal()}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white shadow-xs transition-colors mono-font cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            Launch Support Query with This Scenario
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Narrative & Objective */}
          <div className="p-5 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mono-font">
              Scenario Narrative & Context
            </h3>
            <p className="text-sm text-[var(--text-main)] leading-relaxed">
              {scenario.description}
            </p>

            <div className="mt-4 p-3 rounded-lg bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)]">
              <span className="block text-xs font-bold uppercase text-[var(--accent-primary)] mono-font mb-1">
                Passenger Objective:
              </span>
              <p className="text-xs text-[var(--text-main)]">
                {scenario.customerObjective}
              </p>
            </div>
          </div>

          {/* Transition Rules Table */}
          <div className="p-5 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[var(--border-subtle)]">
              <GitFork className="w-4 h-4 text-[var(--accent-primary)]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mono-font">
                Allowed Workflow State Transitions
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs mono-font">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)]">
                    <th className="py-2 px-2">FROM STATE</th>
                    <th className="py-2 px-2">TO STATE</th>
                    <th className="py-2 px-2">TRIGGERING EVENT</th>
                    <th className="py-2 px-2">DESCRIPTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {transitions.map((t, idx) => (
                    <tr key={idx} className="hover:bg-[var(--surface-ticket-elevated)]/50">
                      <td className="py-2.5 px-2 font-bold text-[var(--text-main)]">
                        {t.fromState}
                      </td>
                      <td className="py-2.5 px-2 font-bold text-emerald-600 dark:text-emerald-400">
                        {t.toState}
                      </td>
                      <td className="py-2.5 px-2 text-[var(--accent-primary)]">
                        {t.triggerEvent || t.action || 'ON_AGENT_RESPONSE'}
                      </td>
                      <td className="py-2.5 px-2 text-[var(--text-muted)]">
                        {t.description || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar: States & Required Facts */}
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mono-font pb-2 border-b border-[var(--border-subtle)]">
              Workflow States ({states.length})
            </h3>
            <div className="space-y-1.5 text-xs mono-font">
              <div className="p-2 rounded bg-blue-50 text-blue-900 border border-blue-200 dark:bg-blue-950 dark:text-blue-300">
                <strong>INITIAL:</strong> {scenario.initialState || 'INITIAL'}
              </div>
              {states.map((st) => (
                <div
                  key={st}
                  className={`p-2 rounded border ${
                    terminalStates.includes(st)
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-[var(--surface-ticket-elevated)] text-[var(--text-main)] border-[var(--border-subtle)]'
                  }`}
                >
                  {st} {terminalStates.includes(st) && '✓ (TERMINAL)'}
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mono-font pb-2 border-b border-[var(--border-subtle)]">
              Required Fixture Facts
            </h3>
            <ul className="space-y-1.5 text-xs mono-font">
              {(scenario.requiredFacts || ['pnr', 'flightNumber', 'passengerName', 'disruptionType']).map((f) => (
                <li key={f} className="flex items-center gap-2 text-[var(--text-main)]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <code>{f}</code>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioDetailsPage;

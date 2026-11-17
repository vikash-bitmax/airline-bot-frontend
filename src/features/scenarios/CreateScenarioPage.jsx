import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import { useCreateScenarioMutation } from './scenarioApi.js';

export const CreateScenarioPage = () => {
  const navigate = useNavigate();
  const [createScenario, { isLoading }] = useCreateScenarioMutation();

  const [scenarioId, setScenarioId] = useState(`S${Math.floor(100 + Math.random() * 900)}`);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('FLIGHT_DISRUPTION');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [description, setDescription] = useState('');
  const [customerObjective, setCustomerObjective] = useState('');
  const [initialState, setInitialState] = useState('GREETING');
  const [statesStr, setStatesStr] = useState('GREETING, ISSUE_EXPLAINED, DETAILS_PROVIDED, RESOLUTION_ACCEPTED, CLOSED');
  const [terminalStatesStr, setTerminalStatesStr] = useState('RESOLUTION_ACCEPTED, CLOSED');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const states = statesStr.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean);
      const terminalStates = terminalStatesStr.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean);

      // Build basic linear transitions
      const transitions = [];
      for (let i = 0; i < states.length - 1; i++) {
        transitions.push({
          fromState: states[i],
          toState: states[i + 1],
          triggerEvent: 'AGENT_ACKNOWLEDGEMENT',
          description: `Transition from ${states[i]} to ${states[i + 1]}`,
        });
      }

      await createScenario({
        scenarioId: scenarioId.trim().toUpperCase(),
        name: name.trim(),
        category,
        difficulty,
        description: description.trim(),
        customerObjective: customerObjective.trim(),
        initialState: initialState.trim().toUpperCase(),
        states,
        terminalStates,
        transitions,
        requiredFacts: ['pnr', 'flightNumber', 'passengerName'],
      }).unwrap();

      navigate('/scenarios');
    } catch (err) {
      setErrorMsg(err?.data?.message || err.message || 'Failed to persist scenario');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/scenarios')}
          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--surface-ticket)] border border-[var(--border-subtle)] mono-font text-xs flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Scenarios
        </button>
      </div>

      <PageHeader
        title="Create Airline Customer Support Scenario"
        subtitle="Define expected state-machine transitions and workflow evaluation rules"
      />

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs mono-font">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-5 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mono-font pb-2 border-b border-[var(--border-subtle)]">
            1. Scenario Metadata & Classification
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mono-font">
            <div>
              <label className="block text-[var(--text-muted)] uppercase mb-1">Scenario Identifier</label>
              <input
                type="text"
                required
                value={scenarioId}
                onChange={(e) => setScenarioId(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] uppercase"
              />
            </div>

            <div>
              <label className="block text-[var(--text-muted)] uppercase mb-1">Scenario Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Involuntary Downgrade Compensation"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
              />
            </div>

            <div>
              <label className="block text-[var(--text-muted)] uppercase mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
              >
                <option value="FLIGHT_DISRUPTION">Flight Disruption / Delay</option>
                <option value="BAGGAGE_CLAIM">Baggage Claim (PIR)</option>
                <option value="REBOOKING">Rebooking & Schedule Changes</option>
                <option value="REFUND_DISPUTE">Refund Dispute</option>
                <option value="SEAT_ALLOCATION">Seat Downgrade / Allocation</option>
                <option value="SPECIAL_ASSISTANCE">Special Assistance</option>
              </select>
            </div>

            <div>
              <label className="block text-[var(--text-muted)] uppercase mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase text-[var(--text-muted)] mono-font mb-1">
              Operational Background Description
            </label>
            <textarea
              rows={2}
              required
              placeholder="Describe flight conditions, disruption details, and passenger's dilemma..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-primary)] leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs uppercase text-[var(--text-muted)] mono-font mb-1">
              Customer Desired Resolution (Objective)
            </label>
            <textarea
              rows={2}
              required
              placeholder="What must the CRM agent offer to satisfy the passenger?"
              value={customerObjective}
              onChange={(e) => setCustomerObjective(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-primary)] leading-relaxed"
            />
          </div>
        </div>

        {/* Section 2: State Machine */}
        <div className="p-5 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mono-font pb-2 border-b border-[var(--border-subtle)]">
            2. State Machine Configuration
          </h3>

          <div className="space-y-3 text-xs mono-font">
            <div>
              <label className="block text-[var(--text-muted)] uppercase mb-1">Initial State</label>
              <input
                type="text"
                required
                value={initialState}
                onChange={(e) => setInitialState(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] uppercase"
              />
            </div>

            <div>
              <label className="block text-[var(--text-muted)] uppercase mb-1">Comma-separated States</label>
              <input
                type="text"
                required
                value={statesStr}
                onChange={(e) => setStatesStr(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
              />
            </div>

            <div>
              <label className="block text-[var(--text-muted)] uppercase mb-1">Terminal States (Successful Conclusion)</label>
              <input
                type="text"
                required
                value={terminalStatesStr}
                onChange={(e) => setTerminalStatesStr(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/scenarios')}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[var(--surface-ticket)] text-[var(--text-muted)] border border-[var(--border-subtle)] mono-font cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white shadow-xs transition-colors mono-font cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {isLoading ? 'Creating Scenario...' : 'Save Scenario'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateScenarioPage;

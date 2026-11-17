import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  PlayCircle,
  Users,
  Compass,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Plane,
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import { useGetPersonasQuery } from '../personas/personaApi.js';
import { useGetScenariosQuery } from '../scenarios/scenarioApi.js';
import { useCreateSimulationMutation, useStartSimulationMutation } from './simulationApi.js';

export const CreateSimulationPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedPersonaId, setSelectedPersonaId] = useState('');
  const [selectedScenarioId, setSelectedScenarioId] = useState('');

  // Settings
  const [name, setName] = useState('');
  const [environment, setEnvironment] = useState('LOCAL');
  const [strategy, setStrategy] = useState('MANUAL');
  const [totalCustomers, setTotalCustomers] = useState(1);
  const [concurrency, setConcurrency] = useState(1);
  const [maxTurns, setMaxTurns] = useState(15);
  const [randomSeed, setRandomSeed] = useState(`seed-${Math.random().toString(36).substring(2, 8)}`);

  const [errorMsg, setErrorMsg] = useState('');

  const { data: personaData, isLoading: personaLoading } = useGetPersonasQuery({ limit: 100 });
  const { data: scenarioData, isLoading: scenarioLoading } = useGetScenariosQuery({ limit: 100 });

  const [createSim, { isLoading: isCreating }] = useCreateSimulationMutation();
  const [startSim, { isLoading: isStarting }] = useStartSimulationMutation();

  const personas = personaData?.data || [];
  const scenarios = scenarioData?.data || [];

  const selectedPersona = personas.find((p) => p.personaId === selectedPersonaId);
  const selectedScenario = scenarios.find((s) => s.scenarioId === selectedScenarioId);

  const handleLaunch = async () => {
    setErrorMsg('');

    try {
      const res = await createSim({
        name: name.trim() || `Simulation [${selectedPersonaId} x ${selectedScenarioId}]`,
        environment,
        personaIds: [selectedPersonaId],
        scenarioIds: [selectedScenarioId],
        strategy,
        totalCustomers: Number(totalCustomers),
        concurrency: Number(concurrency),
        maxTurnsPerConversation: Number(maxTurns),
        randomSeed: (randomSeed && randomSeed.trim()) ? randomSeed.trim() : `seed-${Date.now()}`,
      }).unwrap();

      const runId = res?.data?.runId;
      if (runId) {
        // Automatically start the simulation
        await startSim(runId).unwrap();
        navigate(`/simulations/${runId}`);
      } else {
        navigate('/simulations');
      }
    } catch (err) {
      setErrorMsg(err?.data?.message || err.message || 'Failed to initialize and start simulation');
    }
  };

  if (personaLoading || scenarioLoading) {
    return <LoadingState message="Loading simulation configurations..." />;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/simulations')}
          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--surface-ticket)] border border-[var(--border-subtle)] mono-font text-xs flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Simulations
        </button>
      </div>

      <PageHeader
        title="Launch Simulation Wizard"
        subtitle="Configure autonomous persona dynamics, target disruption scenario, and concurrency"
        badge={`STEP ${step} OF 4`}
      />

      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 mono-font">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Stepper Navigation Pills */}
      <div className="grid grid-cols-4 gap-2 text-xs mono-font">
        {[
          { num: 1, label: 'Persona' },
          { num: 2, label: 'Scenario' },
          { num: 3, label: 'Settings' },
          { num: 4, label: 'Review & Launch' },
        ].map((s) => (
          <div
            key={s.num}
            className={`p-2.5 rounded-lg border text-center transition-colors ${
              step === s.num
                ? 'bg-[var(--surface-input-active)] border-[var(--accent-primary)] text-[var(--accent-primary)] font-bold'
                : step > s.num
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-[var(--surface-ticket)] border-[var(--border-subtle)] text-[var(--text-muted)]'
            }`}
          >
            Step {s.num}: {s.label}
          </div>
        ))}
      </div>

      {/* Step 1: Select Persona */}
      {step === 1 && (
        <div className="p-5 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mono-font pb-2 border-b border-[var(--border-subtle)]">
            Select Simulated Persona Archetype
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
            {personas.map((p) => {
              const isSelected = selectedPersonaId === p.personaId;
              return (
                <div
                  key={p.personaId}
                  onClick={() => setSelectedPersonaId(p.personaId)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--surface-input-active)] border-[var(--accent-primary)] ring-1 ring-[var(--accent-primary)]'
                      : 'bg-[var(--surface-ticket-elevated)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[var(--surface-ticket)] border border-[var(--border-subtle)] mono-font text-[var(--accent-primary)]">
                      {p.personaId}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">
                      {p.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[var(--text-main)] mono-font">{p.name}</h4>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-1">{p.description}</p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-3 border-t border-[var(--border-subtle)]">
            <button
              disabled={!selectedPersonaId}
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white disabled:opacity-50 transition-colors mono-font cursor-pointer"
            >
              Continue to Scenario Selection <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Select Scenario */}
      {step === 2 && (
        <div className="p-5 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mono-font pb-2 border-b border-[var(--border-subtle)]">
            Select Flight Disruption Scenario
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
            {scenarios.map((s) => {
              const isSelected = selectedScenarioId === s.scenarioId;
              return (
                <div
                  key={s.scenarioId}
                  onClick={() => setSelectedScenarioId(s.scenarioId)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[var(--surface-input-active)] border-[var(--accent-primary)] ring-1 ring-[var(--accent-primary)]'
                      : 'bg-[var(--surface-ticket-elevated)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[var(--surface-ticket)] border border-[var(--border-subtle)] mono-font text-[var(--accent-primary)]">
                      {s.scenarioId}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-700">
                      {s.difficulty}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[var(--text-main)] mono-font">{s.name}</h4>
                  <p className="text-xs text-[var(--text-muted)] line-clamp-2 mt-1">{s.customerObjective}</p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-3 border-t border-[var(--border-subtle)]">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[var(--surface-ticket-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)] mono-font cursor-pointer"
            >
              Back
            </button>
            <button
              disabled={!selectedScenarioId}
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white disabled:opacity-50 transition-colors mono-font cursor-pointer"
            >
              Configure Settings <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Settings */}
      {step === 3 && (
        <div className="p-5 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mono-font pb-2 border-b border-[var(--border-subtle)]">
            Simulation Run Settings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mono-font">
            <div>
              <label className="block text-[var(--text-muted)] uppercase mb-1">Simulation Run Name</label>
              <input
                type="text"
                placeholder="e.g. Disruption Wave 1 - ICN/DEL Flights"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
              />
            </div>

            <div>
              <label className="block text-[var(--text-muted)] uppercase mb-1">Target CRM Environment</label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
              >
                <option value="LOCAL">LOCAL CRM (http://localhost:5000)</option>
                <option value="TEST">TEST (In-Memory Mock CRM Engine)</option>
                <option value="STAGING">STAGING CLUSTER</option>
              </select>
            </div>

            <div>
              <label className="block text-[var(--text-muted)] uppercase mb-1">Total Simulated Customers</label>
              <input
                type="number"
                min="1"
                max="50"
                value={totalCustomers}
                onChange={(e) => setTotalCustomers(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
              />
            </div>

            <div>
              <label className="block text-[var(--text-muted)] uppercase mb-1">Concurrency (Simultaneous Chats)</label>
              <input
                type="number"
                min="1"
                max="10"
                value={concurrency}
                onChange={(e) => setConcurrency(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
              />
            </div>

            <div>
              <label className="block text-[var(--text-muted)] uppercase mb-1">Max Turns per Conversation</label>
              <input
                type="number"
                min="5"
                max="30"
                value={maxTurns}
                onChange={(e) => setMaxTurns(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
              />
            </div>

            <div>
              <label className="block text-[var(--text-muted)] uppercase mb-1">Deterministic PRNG Seed</label>
              <input
                type="text"
                value={randomSeed}
                onChange={(e) => setRandomSeed(e.target.value)}
                className="w-full px-3 py-2 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)]"
              />
            </div>
          </div>

          <div className="flex justify-between pt-3 border-t border-[var(--border-subtle)]">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[var(--surface-ticket-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)] mono-font cursor-pointer"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white transition-colors mono-font cursor-pointer"
            >
              Review & Launch <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review & Launch */}
      {step === 4 && (
        <div className="p-5 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mono-font pb-2 border-b border-[var(--border-subtle)]">
            Verify Simulation Launch Manifest
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mono-font">
            <div className="p-3.5 rounded-xl bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] space-y-2">
              <span className="text-[var(--text-muted)] uppercase block text-[10px]">Configured Persona</span>
              <h4 className="text-sm font-bold text-[var(--text-main)]">{selectedPersona?.name}</h4>
              <p className="text-[11px] text-[var(--text-muted)]">{selectedPersona?.personaId} • {selectedPersona?.category}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] space-y-2">
              <span className="text-[var(--text-muted)] uppercase block text-[10px]">Target Scenario</span>
              <h4 className="text-sm font-bold text-[var(--text-main)]">{selectedScenario?.name}</h4>
              <p className="text-[11px] text-[var(--text-muted)]">{selectedScenario?.scenarioId} • {selectedScenario?.category}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] text-xs mono-font space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Target CRM Engine:</span>
              <span className="font-bold text-[var(--accent-primary)]">{environment === 'LOCAL' ? 'Live CRM (http://localhost:5000)' : environment}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Customer Scale:</span>
              <span>{totalCustomers} Passenger Session(s) at {concurrency} Concurrency</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Turn Ceiling:</span>
              <span>{maxTurns} Turns / Conversation</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Seed:</span>
              <span>{randomSeed}</span>
            </div>
          </div>

          <div className="flex justify-between pt-3 border-t border-[var(--border-subtle)]">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[var(--surface-ticket-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)] mono-font cursor-pointer"
            >
              Back
            </button>
            <button
              disabled={isCreating || isStarting}
              onClick={handleLaunch}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white shadow-sm transition-colors mono-font cursor-pointer disabled:opacity-50"
            >
              <PlayCircle className="w-4 h-4" />
              {isCreating || isStarting ? 'Dispatching Simulation Cluster...' : '🚀 Launch Autonomous Simulation'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateSimulationPage;

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Users,
  Compass,
  Plus,
  Search,
  ChevronRight,
  GitFork,
  Flame,
  ShieldAlert,
  Brain,
  Sliders,
  Sparkles,
} from 'lucide-react';

import PageHeader from '../../components/common/PageHeader.jsx';
import SearchInput from '../../components/common/SearchInput.jsx';
import FilterDropdown from '../../components/common/FilterDropdown.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';

import { useGetPersonasQuery } from '../personas/personaApi.js';
import { useGetScenariosQuery } from '../scenarios/scenarioApi.js';

export const LibraryPage = ({ initialTab = 'personas' }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Tab State: 'personas' | 'scenarios'
  const currentTab = searchParams.get('tab') || initialTab || 'personas';
  const setTab = (tab) => {
    setSearchParams({ tab });
  };

  // ── PERSONA STATE & FILTERS ──
  const [personaSearch, setPersonaSearch] = useState('');
  const [personaCategory, setPersonaCategory] = useState('');

  const {
    data: personasData,
    isLoading: isPersonasLoading,
    error: personasError,
    refetch: refetchPersonas,
  } = useGetPersonasQuery({
    search: personaSearch || undefined,
    category: personaCategory || undefined,
    limit: 100,
  });

  const personas = personasData?.data || [];

  const personaCategories = [
    { value: 'FRUSTRATED', label: 'Frustrated / Aggressive' },
    { value: 'ANXIOUS', label: 'Anxious / Urgent' },
    { value: 'COOPERATIVE', label: 'Cooperative / Calm' },
    { value: 'VIP', label: 'VIP / Demanding' },
    { value: 'CONFUSED', label: 'Confused / Inexperienced' },
    { value: 'SPECIAL_NEEDS', label: 'Accessibility / Special Assistance' },
    { value: 'SKEPTICAL', label: 'Skeptical / Analytical' },
  ];

  const filteredPersonas = personas.filter((p) => {
    const q = personaSearch.toLowerCase();
    const matchSearch =
      !personaSearch ||
      Boolean(p.name?.toLowerCase()?.includes(q)) ||
      Boolean(p.personaId?.toLowerCase()?.includes(q)) ||
      Boolean(p.archetype?.toLowerCase()?.includes(q));

    const matchCategory =
      !personaCategory || p.category === personaCategory || p.archetype === personaCategory;
    return matchSearch && matchCategory;
  });

  // ── SCENARIO STATE & FILTERS ──
  const [scenarioSearch, setScenarioSearch] = useState('');
  const [scenarioDifficulty, setScenarioDifficulty] = useState('');

  const {
    data: scenariosData,
    isLoading: isScenariosLoading,
    error: scenariosError,
    refetch: refetchScenarios,
  } = useGetScenariosQuery({
    difficulty: scenarioDifficulty || undefined,
    limit: 100,
  });

  const scenarios = scenariosData?.data || [];

  const scenarioDifficulties = [
    { value: 'EASY', label: 'Easy (Straightforward)' },
    { value: 'MEDIUM', label: 'Medium (Standard Disruption)' },
    { value: 'HARD', label: 'Hard (Complex / Escalation)' },
  ];

  const filteredScenarios = scenarios.filter((s) => {
    const q = scenarioSearch.toLowerCase();
    const matchSearch =
      !scenarioSearch ||
      Boolean(s.name?.toLowerCase()?.includes(q)) ||
      Boolean(s.scenarioId?.toLowerCase()?.includes(q)) ||
      Boolean(s.category?.toLowerCase()?.includes(q));

    const matchDiff = !scenarioDifficulty || s.difficulty === scenarioDifficulty;
    return matchSearch && matchDiff;
  });

  const getDifficultyBadge = (diff) => {
    if (diff === 'EASY')
      return 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300';
    if (diff === 'HARD')
      return 'bg-red-50 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300';
    return 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Persona & Scenario Library"
        subtitle="Unified Directory of AI Behavioral Archetypes and Formal State-Machine Disruption Scenarios"
        badge={`${personas.length} PERSONAS • ${scenarios.length} SCENARIOS`}
        actions={
          <div className="flex items-center gap-2">
            {currentTab === 'personas' ? (
              <button
                onClick={() => navigate('/personas/create')}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white shadow-xs transition-colors mono-font cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Create Persona
              </button>
            ) : (
              <button
                onClick={() => navigate('/scenarios/create')}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white shadow-xs transition-colors mono-font cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Create Scenario
              </button>
            )}
          </div>
        }
      />

      {/* Unified Tab Switcher */}
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-4">
        <div className="flex items-center gap-2 bg-[var(--surface-ticket-elevated)] p-1 rounded-xl border border-[var(--border-subtle)]">
          <button
            onClick={() => setTab('personas')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all mono-font cursor-pointer ${
              currentTab === 'personas'
                ? 'bg-[var(--accent-primary)] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--surface-ticket)]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>AI Personas</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                currentTab === 'personas'
                  ? 'bg-white/20 text-white'
                  : 'bg-[var(--surface-ticket)] text-[var(--text-muted)] border border-[var(--border-subtle)]'
              }`}
            >
              {personas.length}
            </span>
          </button>

          <button
            onClick={() => setTab('scenarios')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all mono-font cursor-pointer ${
              currentTab === 'scenarios'
                ? 'bg-[var(--accent-primary)] text-white shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--surface-ticket)]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Operational Scenarios</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                currentTab === 'scenarios'
                  ? 'bg-white/20 text-white'
                  : 'bg-[var(--surface-ticket)] text-[var(--text-muted)] border border-[var(--border-subtle)]'
              }`}
            >
              {scenarios.length}
            </span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-xs text-[var(--text-muted)] mono-font">
          {currentTab === 'personas' ? (
            <span>Showing {filteredPersonas.length} of {personas.length} passenger archetypes</span>
          ) : (
            <span>Showing {filteredScenarios.length} of {scenarios.length} disruption workflows</span>
          )}
        </div>
      </div>

      {/* ──────────────── TAB 1: PERSONAS ──────────────── */}
      {currentTab === 'personas' && (
        <div className="space-y-6">
          {/* Persona Filter Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <SearchInput
                value={personaSearch}
                onChange={setPersonaSearch}
                placeholder="Search personas by name, archetype, ID (e.g. P001)..."
              />
            </div>
            <FilterDropdown
              value={personaCategory}
              onChange={setPersonaCategory}
              options={personaCategories}
              placeholder="All Categories"
            />
          </div>

          {isPersonasLoading ? (
            <LoadingState message="Loading persona profiles from MongoDB cluster..." />
          ) : personasError ? (
            <ErrorState
              title="Could Not Retrieve Personas"
              message="Ensure MongoDB and simulator backend are running."
              onRetry={refetchPersonas}
            />
          ) : filteredPersonas.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No Matching Personas"
              description="Try adjusting your search query or category filter."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPersonas.map((persona) => {
                const traits = persona.behavioralTraits || {};
                const baseline = persona.emotionalBaseline || {};

                return (
                  <div
                    key={persona.personaId}
                    onClick={() => navigate(`/personas/${persona.personaId}`)}
                    className="group relative rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] mono-font text-[var(--accent-primary)]">
                            {persona.personaId}
                          </span>
                          <h3 className="text-base font-bold text-[var(--text-main)] mt-1.5 mono-font group-hover:text-[var(--accent-primary)] transition-colors">
                            {persona.name}
                          </h3>
                          <p className="text-xs text-[var(--text-muted)] line-clamp-1">
                            {persona.archetype || persona.category}
                          </p>
                        </div>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 dark:bg-blue-950 dark:text-blue-300 mono-font">
                          {baseline.temperament || 'NEUTRAL'}
                        </span>
                      </div>

                      <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2 my-3">
                        {persona.description}
                      </p>

                      {/* Trait Meters */}
                      <div className="grid grid-cols-2 gap-2 my-3 pt-3 border-t border-[var(--border-subtle)] text-[11px] mono-font">
                        <div>
                          <span className="text-[var(--text-muted)]">Patience:</span>{' '}
                          <strong>{traits.patience ?? 5}/10</strong>
                        </div>
                        <div>
                          <span className="text-[var(--text-muted)]">Cooperation:</span>{' '}
                          <strong>{traits.cooperation ?? 5}/10</strong>
                        </div>
                        <div>
                          <span className="text-[var(--text-muted)]">Assertiveness:</span>{' '}
                          <strong>{traits.assertiveness ?? 5}/10</strong>
                        </div>
                        <div>
                          <span className="text-[var(--text-muted)]">Escalation:</span>{' '}
                          <strong>{traits.escalationTendency ?? 3}/10</strong>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--accent-primary)] font-semibold mono-font">
                      <span>View Persona Blueprint</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ──────────────── TAB 2: SCENARIOS ──────────────── */}
      {currentTab === 'scenarios' && (
        <div className="space-y-6">
          {/* Scenario Filter Toolbar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <SearchInput
                value={scenarioSearch}
                onChange={setScenarioSearch}
                placeholder="Search scenarios by title, ID (e.g. S001), category..."
              />
            </div>
            <FilterDropdown
              value={scenarioDifficulty}
              onChange={setScenarioDifficulty}
              options={scenarioDifficulties}
              placeholder="All Difficulties"
            />
          </div>

          {isScenariosLoading ? (
            <LoadingState message="Loading flight disruption scenarios..." />
          ) : scenariosError ? (
            <ErrorState
              title="Could Not Retrieve Scenarios"
              message="Ensure MongoDB and simulator backend are running."
              onRetry={refetchScenarios}
            />
          ) : filteredScenarios.length === 0 ? (
            <EmptyState
              icon={Compass}
              title="No Matching Scenarios"
              description="Try adjusting your search query or difficulty filter."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {filteredScenarios.map((scenario) => {
                const states = scenario.states || [];
                const terminalStates = scenario.terminalStates || [];

                return (
                  <div
                    key={scenario.scenarioId}
                    onClick={() => navigate(`/scenarios/${scenario.scenarioId}`)}
                    className="group relative rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] mono-font text-[var(--accent-primary)]">
                              {scenario.scenarioId}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] mono-font text-[var(--text-muted)]">
                              {scenario.category}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-[var(--text-main)] mt-2 mono-font group-hover:text-[var(--accent-primary)] transition-colors">
                            {scenario.name}
                          </h3>
                        </div>
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border mono-font ${getDifficultyBadge(
                            scenario.difficulty
                          )}`}
                        >
                          {scenario.difficulty || 'MEDIUM'}
                        </span>
                      </div>

                      <p className="text-xs text-[var(--text-muted)] leading-relaxed my-2 line-clamp-2">
                        {scenario.description}
                      </p>

                      <div className="my-3 p-3 rounded-lg bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] text-xs mono-font space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[var(--text-muted)]">Objective:</span>
                          <span className="font-semibold text-[var(--text-main)] line-clamp-1 max-w-[70%]">
                            {scenario.customerObjective}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[var(--border-subtle)]/50">
                          <span className="text-[var(--text-muted)]">State Machine:</span>
                          <span>
                            <strong>{states.length}</strong> States •{' '}
                            <strong>{terminalStates.length}</strong> Terminal
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--accent-primary)] font-semibold mono-font">
                      <span>Inspect State Transitions</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LibraryPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Compass, ChevronRight, GitFork } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import SearchInput from '../../components/common/SearchInput.jsx';
import FilterDropdown from '../../components/common/FilterDropdown.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { useGetScenariosQuery } from './scenarioApi.js';

export const ScenarioListPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');

  const { data, isLoading, error, refetch } = useGetScenariosQuery({
    difficulty: difficulty || undefined,
    limit: 100,
  });

  const scenarios = data?.data || [];

  const difficulties = [
    { value: 'EASY', label: 'Easy (Straightforward)' },
    { value: 'MEDIUM', label: 'Medium (Standard Disruption)' },
    { value: 'HARD', label: 'Hard (Complex / Escalation)' },
  ];

  const filtered = scenarios.filter((s) => {
    const matchSearch =
      !search ||
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.scenarioId?.toLowerCase().includes(search.toLowerCase()) ||
      s.category?.toLowerCase().includes(search.toLowerCase());

    const matchDiff = !difficulty || s.difficulty === difficulty;
    return matchSearch && matchDiff;
  });

  const getDifficultyBadge = (diff) => {
    if (diff === 'EASY') return 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300';
    if (diff === 'HARD') return 'bg-red-50 text-red-800 border-red-300 dark:bg-red-950 dark:text-red-300';
    return 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Flight Support Scenario Library"
        subtitle="Pre-configured Disruption Workflows with Formal State-Machine Assertions"
        badge={`${scenarios.length} WORKFLOWS`}
        actions={
          <button
            onClick={() => navigate('/scenarios/create')}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white shadow-xs transition-colors mono-font cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Scenario
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search scenarios by title, ID (e.g. S001), category..."
          />
        </div>
        <FilterDropdown
          value={difficulty}
          onChange={setDifficulty}
          options={difficulties}
          placeholder="All Difficulties"
        />
      </div>

      {isLoading ? (
        <LoadingState message="Loading flight disruption scenarios..." />
      ) : error ? (
        <ErrorState
          title="Could Not Retrieve Scenarios"
          message="Ensure MongoDB and simulator backend are running."
          onRetry={refetch}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Compass}
          title="No Matching Scenarios"
          description="Try adjusting your search query or difficulty filter."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {filtered.map((scenario) => {
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
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border mono-font ${getDifficultyBadge(scenario.difficulty)}`}>
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
                        <strong>{states.length}</strong> States • <strong>{terminalStates.length}</strong> Terminal
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
  );
};

export default ScenarioListPage;

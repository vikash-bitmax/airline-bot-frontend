import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Search, Sliders, ChevronRight } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import SearchInput from '../../components/common/SearchInput.jsx';
import FilterDropdown from '../../components/common/FilterDropdown.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { useGetPersonasQuery } from './personaApi.js';

export const PersonaListPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const { data, isLoading, error, refetch } = useGetPersonasQuery({
    search: search || undefined,
    category: category || undefined,
    limit: 100,
  });

  const personas = data?.data || [];

  const categories = [
    { value: 'FRUSTRATED', label: 'Frustrated / Aggressive' },
    { value: 'ANXIOUS', label: 'Anxious / Urgent' },
    { value: 'COOPERATIVE', label: 'Cooperative / Calm' },
    { value: 'VIP', label: 'VIP / Demanding' },
    { value: 'CONFUSED', label: 'Confused / Inexperienced' },
    { value: 'SPECIAL_NEEDS', label: 'Accessibility / Special Assistance' },
    { value: 'SKEPTICAL', label: 'Skeptical / Analytical' },
  ];

  const filtered = personas.filter((p) => {
    const matchSearch =
      !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.personaId?.toLowerCase().includes(search.toLowerCase()) ||
      p.archetype?.toLowerCase().includes(search.toLowerCase());

    const matchCategory = !category || p.category === category || p.archetype === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Persona Library"
        subtitle="36 Authentic Behavioral Passenger Archetypes Seeded with Calibrated Emotional Baselines"
        badge={`${personas.length} PROFILES`}
        actions={
          <button
            onClick={() => navigate('/personas/create')}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white shadow-xs transition-colors mono-font cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Persona
          </button>
        }
      />

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search personas by name, archetype, ID (e.g. P001)..."
          />
        </div>
        <FilterDropdown
          value={category}
          onChange={setCategory}
          options={categories}
          placeholder="All Categories"
        />
      </div>

      {isLoading ? (
        <LoadingState message="Loading persona profiles from MongoDB cluster..." />
      ) : error ? (
        <ErrorState
          title="Could Not Retrieve Personas"
          message="Ensure MongoDB and simulator backend are running."
          onRetry={refetch}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Matching Personas"
          description="Try adjusting your search query or category filter."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((persona) => {
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
                  <span>Inspect Attributes</span>
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

export default PersonaListPage;

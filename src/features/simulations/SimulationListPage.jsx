import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, PlayCircle, PauseCircle, Play, XCircle, Search, RefreshCw, ChevronRight } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import SearchInput from '../../components/common/SearchInput.jsx';
import FilterDropdown from '../../components/common/FilterDropdown.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import {
  useGetSimulationsQuery,
  useStartSimulationMutation,
  usePauseSimulationMutation,
  useResumeSimulationMutation,
  useCancelSimulationMutation,
} from './simulationApi.js';

export const SimulationListPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const { data, isLoading, error, refetch } = useGetSimulationsQuery({
    status: status || undefined,
  });

  const [startSim] = useStartSimulationMutation();
  const [pauseSim] = usePauseSimulationMutation();
  const [resumeSim] = useResumeSimulationMutation();
  const [cancelSim] = useCancelSimulationMutation();

  const simulations = data?.data || [];

  const statuses = [
    { value: 'RUNNING', label: 'Running / Active' },
    { value: 'PENDING', label: 'Pending / Queued' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'PAUSED', label: 'Paused' },
    { value: 'FAILED', label: 'Failed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  const filtered = simulations.filter((s) => {
    const matchSearch =
      !search ||
      s.runId?.toLowerCase().includes(search.toLowerCase()) ||
      s.name?.toLowerCase().includes(search.toLowerCase());

    const matchStatus = !status || s.status === status;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Simulation Cluster Manifest"
        subtitle="Manage and monitor autonomous batches testing CRM queues"
        badge={`${simulations.length} RUNS`}
        actions={
          <button
            onClick={() => navigate('/simulations/create')}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white shadow-xs transition-colors mono-font cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Launch New Simulation
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search runs by ID (e.g. RUN-A1B2C3), name..."
          />
        </div>
        <FilterDropdown
          value={status}
          onChange={setStatus}
          options={statuses}
          placeholder="All Statuses"
        />
      </div>

      {isLoading ? (
        <LoadingState message="Fetching simulation cluster status..." />
      ) : error ? (
        <ErrorState
          title="Could Not Retrieve Simulations"
          message="Ensure simulator backend is running on port 5050."
          onRetry={refetch}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={PlayCircle}
          title="No Simulations Match Criteria"
          description="Click 'Launch New Simulation' to initiate an autonomous passenger test batch."
        />
      ) : (
        <div className="overflow-hidden rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs mono-font">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface-ticket-elevated)] text-[var(--text-muted)]">
                  <th className="py-3 px-4">RUN ID</th>
                  <th className="py-3 px-4">NAME</th>
                  <th className="py-3 px-4">ENV</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4">SCALE</th>
                  <th className="py-3 px-4">CREATED</th>
                  <th className="py-3 px-4 text-right">CONTROLS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {filtered.map((sim) => (
                  <tr
                    key={sim.runId}
                    className="hover:bg-[var(--surface-ticket-elevated)]/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-bold text-[var(--accent-primary)]">
                      {sim.runId}
                    </td>
                    <td className="py-3 px-4 font-sans font-medium text-[var(--text-main)]">
                      {sim.name}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-1.5 py-0.5 rounded bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)]">
                        {sim.environment}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={sim.status} />
                    </td>
                    <td className="py-3 px-4 text-[var(--text-muted)]">
                      {sim.configuration?.totalCustomers || 1} chats ({sim.configuration?.concurrency || 1}x)
                    </td>
                    <td className="py-3 px-4 text-[var(--text-dim)]">
                      {new Date(sim.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {sim.status === 'PENDING' && (
                          <button
                            onClick={() => startSim(sim.runId)}
                            title="Start Simulation"
                            className="p-1.5 rounded hover:bg-emerald-100 text-emerald-700 cursor-pointer"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                        {sim.status === 'RUNNING' && (
                          <button
                            onClick={() => pauseSim(sim.runId)}
                            title="Pause Simulation"
                            className="p-1.5 rounded hover:bg-amber-100 text-amber-700 cursor-pointer"
                          >
                            <PauseCircle className="w-4 h-4" />
                          </button>
                        )}
                        {sim.status === 'PAUSED' && (
                          <button
                            onClick={() => resumeSim(sim.runId)}
                            title="Resume Simulation"
                            className="p-1.5 rounded hover:bg-emerald-100 text-emerald-700 cursor-pointer"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                        {(sim.status === 'RUNNING' || sim.status === 'PAUSED') && (
                          <button
                            onClick={() => cancelSim(sim.runId)}
                            title="Cancel Simulation"
                            className="p-1.5 rounded hover:bg-red-100 text-red-700 cursor-pointer"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/simulations/${sim.runId}`)}
                          className="px-2.5 py-1 rounded bg-[var(--surface-ticket-elevated)] hover:bg-[var(--surface-input-active)] text-[var(--text-main)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                        >
                          Inspect →
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimulationListPage;

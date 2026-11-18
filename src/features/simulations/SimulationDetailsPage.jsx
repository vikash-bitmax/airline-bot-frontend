import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  PlayCircle,
  PauseCircle,
  Play,
  XCircle,
  StopCircle,
  MessagesSquare,
  Users,
  Compass,
  Clock,
  ArrowRight,
  Trash2,
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import {
  useGetSimulationByIdQuery,
  useStartSimulationMutation,
  usePauseSimulationMutation,
  useResumeSimulationMutation,
  useCancelSimulationMutation,
  useDeleteSimulationMutation,
} from './simulationApi.js';
import socketService from '../../services/socket.js';

export const SimulationDetailsPage = () => {
  const { runId } = useParams();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data, isLoading, error, refetch } = useGetSimulationByIdQuery(runId);
  const [startSim] = useStartSimulationMutation();
  const [pauseSim] = usePauseSimulationMutation();
  const [resumeSim] = useResumeSimulationMutation();
  const [cancelSim] = useCancelSimulationMutation();
  const [deleteSim, { isLoading: isDeleting }] = useDeleteSimulationMutation();

  const run = data?.data?.run;
  const conversations = data?.data?.conversations || [];

  useEffect(() => {
    socketService.joinRun(runId);

    const unsubCreated = socketService.on('conversation:created', () => refetch());
    const unsubProgress = socketService.on('conversation:progress', () => refetch());
    const unsubConcluded = socketService.on('conversation:concluded', () => refetch());

    return () => {
      socketService.leaveRun(runId);
      unsubCreated && unsubCreated();
      unsubProgress && unsubProgress();
      unsubConcluded && unsubConcluded();
    };
  }, [runId, refetch]);

  if (isLoading) return <LoadingState message="Connecting to simulation telemetry monitor..." />;
  if (error || !run) {
    return (
      <ErrorState
        title="Simulation Run Not Located"
        message={`Could not find telemetry for run: ${runId}`}
        onRetry={() => navigate('/simulations')}
      />
    );
  }

  const activeCount = conversations.filter((c) => c.status === 'ACTIVE').length;
  const concludedCount = conversations.filter((c) => c.status === 'CONCLUDED' || c.status === 'COMPLETED').length;

  const handleDeleteConfirm = async () => {
    try {
      await deleteSim(runId).unwrap();
      navigate('/simulations');
    } catch (err) {
      console.error('Failed to delete simulation:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/simulations')}
          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--surface-ticket)] border border-[var(--border-subtle)] mono-font text-xs flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Simulations
        </button>
      </div>

      <PageHeader
        title={run.name}
        subtitle={`Run ID: ${run.runId} • Target: ${run.environment}`}
        badge={run.status}
        actions={
          <div className="flex items-center gap-2">
            {run.status === 'PENDING' && (
              <button
                onClick={() => startSim(run.runId)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs mono-font cursor-pointer"
              >
                <Play className="w-4 h-4" /> Start Simulation
              </button>
            )}
            {run.status === 'RUNNING' && (
              <button
                onClick={() => pauseSim(run.runId)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-xs mono-font cursor-pointer"
              >
                <PauseCircle className="w-4 h-4" /> Pause
              </button>
            )}
            {run.status === 'PAUSED' && (
              <button
                onClick={() => resumeSim(run.runId)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs mono-font cursor-pointer"
              >
                <Play className="w-4 h-4" /> Resume
              </button>
            )}
            {(run.status === 'RUNNING' || run.status === 'PAUSED') && (
              <button
                onClick={() => cancelSim(run.runId)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-xs mono-font cursor-pointer"
              >
                <StopCircle className="w-4 h-4" /> Stop Simulation Run
              </button>
            )}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              title="Delete Simulation"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-xs mono-font cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        }
      />

      {/* Telemetry Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] mono-font block">Status</span>
          <div className="mt-2 flex items-center gap-2">
            <StatusBadge status={run.status} />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] mono-font block">Active Passenger Chats</span>
          <div className="mt-1 text-2xl font-bold mono-font text-[var(--text-main)]">
            {activeCount} <span className="text-xs text-[var(--text-muted)]">/ {conversations.length}</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] mono-font block">Concurrency Target</span>
          <div className="mt-1 text-2xl font-bold mono-font text-[var(--accent-primary)]">
            {run.configuration?.concurrency || 1}x
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs">
          <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] mono-font block">Completed Sessions</span>
          <div className="mt-1 text-2xl font-bold mono-font text-emerald-600">
            {concludedCount}
          </div>
        </div>
      </div>

      {/* Conversations Stream Table */}
      <div className="p-5 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <MessagesSquare className="w-4 h-4 text-[var(--accent-primary)]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mono-font">
              Conversations in this Simulation Run ({conversations.length})
            </h3>
          </div>
          <span className="text-[10px] text-[var(--text-muted)] mono-font">
            Real-time Autonomous Gemini Sessions
          </span>
        </div>

        {conversations.length === 0 ? (
          <div className="text-center py-10 text-xs text-[var(--text-muted)] mono-font">
            No conversations launched yet. Click &quot;Start Simulation&quot; to begin dispatching customers.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs mono-font">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)]">
                  <th className="py-2.5 px-3">CONVERSATION ID</th>
                  <th className="py-2.5 px-3">CRM LINK</th>
                  <th className="py-2.5 px-3">PASSENGER NAME</th>
                  <th className="py-2.5 px-3">PNR & FLIGHT</th>
                  <th className="py-2.5 px-3">STATUS</th>
                  <th className="py-2.5 px-3">TURNS</th>
                  <th className="py-2.5 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {conversations.map((conv) => (
                  <tr key={conv.conversationId} className="hover:bg-[var(--surface-ticket-elevated)]/60 transition-colors">
                    <td className="py-3 px-3 font-bold text-[var(--accent-primary)]">
                      {conv.conversationId}
                    </td>
                    <td className="py-3 px-3 text-[var(--text-muted)]">
                      {conv.crm?.externalConversationId || 'CONNECTING...'}
                    </td>
                    <td className="py-3 px-3 text-[var(--text-main)] font-semibold">
                      {conv.customerFixture?.facts?.passengerName || conv.persona?.name || 'Passenger'}
                    </td>
                    <td className="py-3 px-3 text-[var(--text-muted)]">
                      {conv.customerFixture?.facts?.pnr || '—'} ({conv.customerFixture?.facts?.flightNumber || 'SW-101'})
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={conv.status} />
                    </td>
                    <td className="py-3 px-3">
                      {conv.scenarioProgress?.turnCount || 0}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => navigate(`/conversations/${conv.conversationId}`)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white font-bold transition-colors cursor-pointer"
                      >
                        Live Stream <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Simulation Run"
        message={`Are you sure you want to permanently delete simulation "${runId}" and all its active conversations and message transcripts?`}
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete Simulation'}
        isDanger={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};

export default SimulationDetailsPage;

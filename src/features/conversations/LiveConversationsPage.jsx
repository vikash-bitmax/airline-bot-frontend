import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { MessagesSquare, Search, Send, Trash2, Eye, RefreshCw } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import SearchInput from '../../components/common/SearchInput.jsx';
import FilterDropdown from '../../components/common/FilterDropdown.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import { useGetConversationsQuery, useDeleteConversationMutation } from './conversationApi.js';
import socketService from '../../services/socket.js';

const formatTime = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  } catch {
    return '—';
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    });
  } catch {
    return '—';
  }
};

export const LiveConversationsPage = () => {
  const navigate = useNavigate();
  const { openQueryModal } = useOutletContext() || {};
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [conversationToDelete, setConversationToDelete] = useState(null);

  const { data, isLoading, error, refetch } = useGetConversationsQuery({
    status: status || undefined,
    limit: 100,
  });

  const [deleteConversation, { isLoading: isDeleting }] = useDeleteConversationMutation();

  const conversations = data?.data || [];

  const handleDeleteConfirm = async () => {
    if (!conversationToDelete) return;
    try {
      await deleteConversation(conversationToDelete).unwrap();
      setConversationToDelete(null);
      refetch();
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  };

  useEffect(() => {
    const unsubCreated = socketService.on('conversation:created', () => refetch());
    const unsubUpdated = socketService.on('conversation:updated', () => refetch());
    const unsubProgress = socketService.on('conversation:progress', () => refetch());
    const unsubCompleted = socketService.on('conversation:completed', () => refetch());
    const unsubDeleted = socketService.on('conversation:deleted', () => refetch());

    return () => {
      unsubCreated && unsubCreated();
      unsubUpdated && unsubUpdated();
      unsubProgress && unsubProgress();
      unsubCompleted && unsubCompleted();
      unsubDeleted && unsubDeleted();
    };
  }, [refetch]);

  const statuses = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'WAITING', label: 'Waiting' },
    { value: 'NEW', label: 'New' },
    { value: 'RESOLVED', label: 'Resolved' },
    { value: 'CLOSED', label: 'Closed' },
    { value: 'ESCALATED', label: 'Escalated' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'FAILED', label: 'Failed' },
    { value: 'ABANDONED', label: 'Abandoned' },
  ];

  const filtered = conversations.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      !search ||
      Boolean(c.conversationId?.toLowerCase()?.includes(q)) ||
      Boolean(c.crm?.externalConversationId?.toLowerCase()?.includes(q)) ||
      Boolean(c.customerFixture?.facts?.passengerName?.toLowerCase()?.includes(q)) ||
      Boolean(c.customerFixture?.facts?.pnr?.toLowerCase()?.includes(q)) ||
      Boolean(c.customerFixture?.facts?.flightNumber?.toLowerCase()?.includes(q));

    const matchStatus = !status || c.status === status;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Live Customer Simulation Feed"
        subtitle="Real-Time Streaming of Simulated Airline Passengers Interacting with CRM Support Agents"
        badge="SOCKET STREAM ACTIVE"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              title="Refresh"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-ticket)] hover:bg-[var(--surface-ticket-elevated)] text-[var(--text-main)] transition-colors mono-font cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
            <button
              onClick={() => openQueryModal && openQueryModal()}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white shadow-xs transition-colors mono-font cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              ⚡ Raise Query to CRM
            </button>
          </div>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by Conv ID, CRM Chat ID, Passenger, PNR, Flight..."
          />
        </div>
        <FilterDropdown
          value={status}
          onChange={setStatus}
          options={statuses}
          placeholder="All Statuses"
        />
      </div>

      {/* Summary Stats Bar */}
      <div className="flex flex-wrap gap-3">
        {['ACTIVE', 'WAITING', 'RESOLVED', 'CLOSED', 'ESCALATED', 'FAILED'].map((s) => {
          const count = conversations.filter((c) => c.status === s).length;
          if (count === 0) return null;
          return (
            <button
              key={s}
              onClick={() => setStatus(status === s ? '' : s)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-full border mono-font cursor-pointer transition-all ${
                status === s
                  ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]'
                  : 'bg-[var(--surface-ticket-elevated)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/40'
              }`}
            >
              {s} <span className="text-[9px] opacity-80">({count})</span>
            </button>
          );
        })}
        <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-bold rounded-full bg-[var(--surface-ticket-elevated)] text-[var(--text-muted)] border border-[var(--border-subtle)] mono-font">
          TOTAL: {conversations.length}
        </span>
      </div>

      {isLoading ? (
        <LoadingState message="Connecting to live conversations telemetry..." />
      ) : error ? (
        <ErrorState
          title="Could Not Retrieve Conversations"
          message="Ensure simulator backend is running."
          onRetry={refetch}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={MessagesSquare}
          title="No Live Conversations Found"
          description="Click 'Raise Query to CRM' to launch a passenger session directly into the CRM support pipeline."
        />
      ) : (
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-ticket)] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs mono-font">
              <thead>
                <tr className="bg-[var(--surface-ticket-elevated)] border-b border-[var(--border-subtle)]">
                  <th className="text-left px-4 py-3 font-bold text-[var(--text-muted)] uppercase tracking-wider text-[10px]">Conv ID</th>
                  <th className="text-left px-4 py-3 font-bold text-[var(--text-muted)] uppercase tracking-wider text-[10px]">CRM Chat</th>
                  <th className="text-left px-4 py-3 font-bold text-[var(--text-muted)] uppercase tracking-wider text-[10px]">Passenger</th>
                  <th className="text-left px-4 py-3 font-bold text-[var(--text-muted)] uppercase tracking-wider text-[10px]">Flight</th>
                  <th className="text-left px-4 py-3 font-bold text-[var(--text-muted)] uppercase tracking-wider text-[10px]">PNR</th>
                  <th className="text-center px-4 py-3 font-bold text-[var(--text-muted)] uppercase tracking-wider text-[10px]">Status</th>
                  <th className="text-center px-4 py-3 font-bold text-[var(--text-muted)] uppercase tracking-wider text-[10px]">Emotion</th>
                  <th className="text-center px-4 py-3 font-bold text-[var(--text-muted)] uppercase tracking-wider text-[10px]">Frustration</th>
                  <th className="text-center px-4 py-3 font-bold text-[var(--text-muted)] uppercase tracking-wider text-[10px]">Turns</th>
                  <th className="text-left px-4 py-3 font-bold text-[var(--text-muted)] uppercase tracking-wider text-[10px]">Started</th>
                  <th className="text-center px-4 py-3 font-bold text-[var(--text-muted)] uppercase tracking-wider text-[10px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {filtered.map((conv) => {
                  const facts = conv.customerFixture?.facts || {};
                  const emotion = conv.dynamicPersonaState?.currentEmotion || 'NEUTRAL';
                  const frustration = conv.dynamicPersonaState?.frustrationScore ?? 3;
                  const turns = conv.scenarioProgress?.turnCount ?? 0;

                  return (
                    <tr
                      key={conv.conversationId}
                      onClick={() => navigate(`/conversations/${conv.conversationId}`)}
                      className="hover:bg-[var(--surface-ticket-elevated)] cursor-pointer transition-colors group"
                    >
                      {/* Conv ID */}
                      <td className="px-4 py-3">
                        <span className="font-bold text-[var(--accent-primary)] text-[11px]">
                          {conv.conversationId}
                        </span>
                      </td>

                      {/* CRM Chat ID */}
                      <td className="px-4 py-3">
                        <span className="text-[var(--text-main)] font-semibold">
                          {conv.crm?.externalConversationId || (
                            <span className="text-[var(--text-muted)] italic">connecting...</span>
                          )}
                        </span>
                      </td>

                      {/* Passenger Name */}
                      <td className="px-4 py-3">
                        <span className="font-semibold text-[var(--text-main)]">
                          {facts.passengerName || conv.persona?.name || '—'}
                        </span>
                      </td>

                      {/* Flight */}
                      <td className="px-4 py-3 text-[var(--text-main)]">
                        {facts.flightNumber || '—'}
                      </td>

                      {/* PNR */}
                      <td className="px-4 py-3 text-[var(--text-main)] font-semibold">
                        {facts.pnr || '—'}
                      </td>

                      {/* Status Badge */}
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={conv.status} />
                      </td>

                      {/* Emotion */}
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          emotion === 'ANGRY' || emotion === 'FRUSTRATED'
                            ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800'
                            : emotion === 'ANXIOUS'
                              ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                        }`}>
                          {emotion}
                        </span>
                      </td>

                      {/* Frustration */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <div className="w-16 h-1.5 rounded-full bg-[var(--border-subtle)] overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                frustration >= 7 ? 'bg-red-500' : frustration >= 4 ? 'bg-amber-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${(frustration / 10) * 100}%` }}
                            />
                          </div>
                          <span className={`font-bold text-[10px] ${
                            frustration >= 7 ? 'text-red-600' : frustration >= 4 ? 'text-amber-600' : 'text-emerald-600'
                          }`}>
                            {frustration}
                          </span>
                        </div>
                      </td>

                      {/* Turns */}
                      <td className="px-4 py-3 text-center font-semibold text-[var(--text-main)]">
                        {turns}
                      </td>

                      {/* Started At */}
                      <td className="px-4 py-3 text-[var(--text-muted)]">
                        <div className="text-[10px]">{formatDate(conv.startedAt)}</div>
                        <div className="text-[10px]">{formatTime(conv.startedAt)}</div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/conversations/${conv.conversationId}`);
                            }}
                            title="Open Inspector"
                            className="p-1.5 rounded-lg text-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/10 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConversationToDelete(conv.conversationId);
                            }}
                            title="Delete Conversation"
                            className="p-1.5 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-4 py-2.5 bg-[var(--surface-ticket-elevated)] border-t border-[var(--border-subtle)] flex items-center justify-between">
            <span className="text-[10px] text-[var(--text-muted)] mono-font">
              Showing {filtered.length} of {conversations.length} conversations
            </span>
            <span className="text-[10px] text-[var(--text-muted)] mono-font flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Real-time sync active
            </span>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(conversationToDelete)}
        title="Delete Live Conversation"
        message={`Are you sure you want to permanently delete conversation "${conversationToDelete}" and all its message transcripts?`}
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete Conversation'}
        isDanger={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConversationToDelete(null)}
      />
    </div>
  );
};

export default LiveConversationsPage;

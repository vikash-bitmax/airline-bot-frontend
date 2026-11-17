import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { MessagesSquare, Search, Filter, Send, ArrowRight, Radio } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader.jsx';
import SearchInput from '../../components/common/SearchInput.jsx';
import FilterDropdown from '../../components/common/FilterDropdown.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import { useGetConversationsQuery } from './conversationApi.js';
import socketService from '../../services/socket.js';

export const LiveConversationsPage = () => {
  const navigate = useNavigate();
  const { openQueryModal } = useOutletContext() || {};
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  const { data, isLoading, error, refetch } = useGetConversationsQuery({
    status: status || undefined,
    limit: 50,
  });

  const conversations = data?.data || [];

  useEffect(() => {
    const unsubCreated = socketService.on('conversation:created', () => refetch());
    const unsubProgress = socketService.on('conversation:progress', () => refetch());
    const unsubConcluded = socketService.on('conversation:concluded', () => refetch());

    return () => {
      unsubCreated && unsubCreated();
      unsubProgress && unsubProgress();
      unsubConcluded && unsubConcluded();
    };
  }, [refetch]);

  const statuses = [
    { value: 'ACTIVE', label: 'Active Sessions' },
    { value: 'CONCLUDED', label: 'Concluded' },
    { value: 'FAILED', label: 'Failed' },
  ];

  const filtered = conversations.filter((c) => {
    const matchSearch =
      !search ||
      c.conversationId?.toLowerCase().includes(search.toLowerCase()) ||
      c.crm?.externalConversationId?.toLowerCase().includes(search.toLowerCase()) ||
      c.customerFixture?.facts?.passengerName?.toLowerCase().includes(search.toLowerCase()) ||
      c.customerFixture?.facts?.pnr?.toLowerCase().includes(search.toLowerCase());

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
          <button
            onClick={() => openQueryModal && openQueryModal()}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white shadow-xs transition-colors mono-font cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            ⚡ Raise Query to CRM
          </button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by Conv ID, CRM Chat ID, Passenger, PNR..."
          />
        </div>
        <FilterDropdown
          value={status}
          onChange={setStatus}
          options={statuses}
          placeholder="All Conversation Statuses"
        />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((conv) => {
            const facts = conv.customerFixture?.facts || {};
            const emotion = conv.dynamicPersonaState?.currentEmotion || 'NEUTRAL';
            const frustration = conv.dynamicPersonaState?.frustrationScore ?? 3;

            return (
              <div
                key={conv.conversationId}
                onClick={() => navigate(`/conversations/${conv.conversationId}`)}
                className="group relative rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] hover:border-[var(--accent-primary)]/50 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] mono-font text-[var(--accent-primary)]">
                          {conv.conversationId}
                        </span>
                        <StatusBadge status={conv.status} />
                      </div>
                      <h3 className="text-base font-bold text-[var(--text-main)] mt-2 mono-font group-hover:text-[var(--accent-primary)] transition-colors">
                        {facts.passengerName || conv.persona?.name || 'Passenger'}
                      </h3>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300">
                      {emotion}
                    </span>
                  </div>

                  <div className="my-3 p-3 rounded-lg bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] text-xs mono-font space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">CRM Chat ID:</span>
                      <span className="font-semibold text-[var(--accent-primary)]">
                        {conv.crm?.externalConversationId || 'CONNECTING...'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Flight & PNR:</span>
                      <span>{facts.flightNumber || 'SW-101'} • {facts.pnr || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Frustration Score:</span>
                      <span className={frustration >= 7 ? 'text-red-600 font-bold' : 'text-emerald-600 font-bold'}>
                        {frustration}/10
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--accent-primary)] font-semibold mono-font">
                  <span>Open Live Inspector</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LiveConversationsPage;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, SkipForward, SkipBack, RefreshCw, Radio, Sparkles, Trash2 } from 'lucide-react';

import ChatWindow from '../../components/conversation/ChatWindow.jsx';
import CustomerProfilePanel from '../../components/conversation/CustomerProfilePanel.jsx';
import EventTimeline from '../../components/conversation/EventTimeline.jsx';
import QcReportCard from '../../components/conversation/QcReportCard.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';

import {
  useGetConversationDetailsQuery,
  useGetConversationQcReportQuery,
  useStopConversationMutation,
  useDeleteConversationMutation,
} from './conversationApi.js';
import socketService from '../../services/socket.js';

export const ConversationDetailsPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error, refetch } = useGetConversationDetailsQuery(conversationId);
  const { data: qcData } = useGetConversationQcReportQuery(conversationId);
  const [stopConv, { isLoading: isStopping }] = useStopConversationMutation();
  const [deleteConv, { isLoading: isDeleting }] = useDeleteConversationMutation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const conversation = data?.data?.conversation;
  const qcReport = qcData?.data || data?.data?.qcReport || conversation?.outcome?.qcReport;
  const initialMessages = data?.data?.messages || [];
  const initialEvents = data?.data?.events || [];

  const [liveMessages, setLiveMessages] = useState([]);
  const [liveEvents, setLiveEvents] = useState([]);
  const [dynamicState, setDynamicState] = useState(null);

  // Sync initial query response
  useEffect(() => {
    if (initialMessages.length > 0) {
      setLiveMessages(initialMessages);
    }
  }, [initialMessages]);

  useEffect(() => {
    if (initialEvents.length > 0) {
      setLiveEvents(initialEvents);
    }
  }, [initialEvents]);

  useEffect(() => {
    if (conversation?.dynamicPersonaState) {
      setDynamicState(conversation.dynamicPersonaState);
    }
  }, [conversation]);

  // Socket.IO real-time subscription
  useEffect(() => {
    socketService.joinConversation(conversationId);

    const unsubMsg = socketService.on('conversation:message', (payload) => {
      if (payload?.conversationId === conversationId && payload?.message) {
        setLiveMessages((prev) => {
          const msgId = payload.message.messageId || payload.message._id;
          if (prev.some((m) => (m.messageId || m._id) === msgId)) return prev;
          return [...prev, payload.message];
        });
      }
    });

    const unsubEvent = socketService.on('conversation:event', (payload) => {
      if (payload?.conversationId === conversationId && payload?.event) {
        setLiveEvents((prev) => [...prev, payload.event]);
      }
    });

    const unsubProgress = socketService.on('conversation:progress', (payload) => {
      if (payload?.conversationId === conversationId) {
        if (payload?.dynamicPersonaState) {
          setDynamicState(payload.dynamicPersonaState);
        }
        refetch();
      }
    });

    const unsubConcluded = socketService.on('conversation:concluded', (payload) => {
      if (payload?.conversationId === conversationId) {
        refetch();
      }
    });

    return () => {
      socketService.leaveConversation(conversationId);
      unsubMsg && unsubMsg();
      unsubEvent && unsubEvent();
      unsubProgress && unsubProgress();
      unsubConcluded && unsubConcluded();
    };
  }, [conversationId, refetch]);

  if (isLoading) return <LoadingState message="Connecting to passenger chat stream..." />;
  if (error || !conversation) {
    return (
      <ErrorState
        title="Conversation Telemetry Not Located"
        message={`Could not find session data for: ${conversationId}`}
        onRetry={() => navigate('/conversations')}
      />
    );
  }

  const handleStop = async () => {
    try {
      await stopConv(conversationId).unwrap();
      refetch();
    } catch (err) {
      console.error('Stop conversation error:', err);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteConv(conversationId).unwrap();
      navigate('/conversations');
    } catch (err) {
      console.error('Delete conversation error:', err);
    }
  };

  const persona = conversation.persona || conversation.personaSnapshot;
  const scenario = conversation.scenario || conversation.scenarioSnapshot;
  const fixture = conversation.customerFixture || {};
  const currentState = conversation.scenarioProgress?.currentState || 'INITIAL';

  return (
    <div className="space-y-4 h-[calc(100vh-6rem)] flex flex-col">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)] flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/conversations')}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--surface-ticket)] border border-[var(--border-subtle)] mono-font text-xs flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Stream
          </button>
          <div>
            <span className="text-xs font-bold text-[var(--text-main)] mono-font">
              {conversation.conversationId}
            </span>
            <span className="text-xs text-[var(--text-muted)] font-mono ml-2">
              (CRM Chat: <strong className="text-[var(--accent-primary)]">{conversation.crm?.externalConversationId || 'PENDING'}</strong>)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="p-1.5 rounded-lg bg-[var(--surface-ticket)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] shadow-2xs mono-font text-xs flex items-center gap-1 cursor-pointer"
            title="Refresh transcript"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sync</span>
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 dark:bg-red-950/40 dark:border-red-800 dark:hover:bg-red-900/50 shadow-2xs mono-font text-xs flex items-center gap-1 cursor-pointer"
            title="Delete this conversation"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      </div>

      {/* Three Panel Live Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
        {/* Left Panel: Customer Persona & Telemetry (3 cols) */}
        <div className="lg:col-span-3 overflow-y-auto pr-1">
          <CustomerProfilePanel
            persona={persona}
            scenario={scenario}
            dynamicState={dynamicState || conversation.dynamicPersonaState}
            fixture={fixture}
          />
        </div>

        {/* Center Panel: Realistic Chat Stream (6 cols) */}
        <div className="lg:col-span-6 h-full flex flex-col min-h-0">
          <ChatWindow
            conversation={conversation}
            messages={liveMessages}
            onStop={handleStop}
            isStopping={isStopping}
          />
        </div>

        {/* Right Panel: Workflow State Machine & Timeline (3 cols) */}
        <div className="lg:col-span-3 overflow-y-auto space-y-4 pr-1">
          {/* Automated QC Scorecard (Agent L1 / QA L2) */}
          {qcReport && <QcReportCard report={qcReport} />}

          <EventTimeline
            events={liveEvents}
            currentState={currentState}
          />

          {/* CRM Evidence Assertions */}
          {conversation.evaluation && (
            <div className="p-4 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs space-y-2 mono-font text-xs">
              <h4 className="font-bold uppercase text-[var(--text-muted)] pb-1 border-b border-[var(--border-subtle)]">
                Evaluation Scorecard
              </h4>
              <div className="flex justify-between">
                <span>Outcome:</span>
                <strong className={conversation.evaluation.passed ? 'text-emerald-600' : 'text-red-600'}>
                  {conversation.evaluation.passed ? 'PASSED' : 'FAILED'}
                </strong>
              </div>
              <div className="flex justify-between">
                <span>Persona Consistency:</span>
                <span>{conversation.evaluation.personaConsistencyScore || 100}%</span>
              </div>
              <div className="flex justify-between">
                <span>Workflow Correctness:</span>
                <span>{conversation.evaluation.workflowCorrectnessScore || 100}%</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeleteModal}
        title="Delete Conversation"
        message={`Are you sure you want to permanently delete this conversation (${conversationId}) and all of its transcript messages?`}
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete Conversation'}
        isDanger={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default ConversationDetailsPage;

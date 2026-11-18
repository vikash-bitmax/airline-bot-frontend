import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Radio,
  ChevronDown,
  ChevronUp,
  Play,
  StopCircle,
  XCircle,
  Search,
  Calendar,
  MessageSquare,
  Users,
  Compass,
  AlertCircle,
  CheckCircle,
  Clock,
  Sparkles,
  Maximize2,
  ExternalLink,
  RefreshCw,
  Sliders,
  Send,
  Plane,
  Trash2,
  Eye,
} from 'lucide-react';

import {
  useGetConversationsQuery,
  useGetConversationDetailsQuery,
  useStopConversationMutation,
  useStopAllConversationsMutation,
  useDeleteConversationMutation,
  useRaiseSupportQueryMutation,
} from '../conversations/conversationApi.js';
import { useCancelSimulationMutation } from '../simulations/simulationApi.js';
import { useGetPersonasQuery } from '../personas/personaApi.js';
import { useGetScenariosQuery } from '../scenarios/scenarioApi.js';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import socketService from '../../services/socket.js';

const ISSUE_CATEGORIES = [
  { value: 'RANDOM', label: 'Random (Any Issue)' },
  { value: 'FLIGHT_DISRUPTION', label: 'Flight Delay / Disruption / Cancellation' },
  { value: 'BAGGAGE_CLAIM', label: 'Lost / Delayed Baggage (PIR)' },
  { value: 'REBOOKING', label: 'Flight Rebooking & Schedule Changes' },
  { value: 'REFUND_DISPUTE', label: 'Ticket Refund & Compensation' },
  { value: 'SEAT_ALLOCATION', label: 'Seat Selection / Cabin Downgrade' },
  { value: 'SPECIAL_ASSISTANCE', label: 'Medical & Airport Assistance' },
];

const PRIORITIES = [
  { value: 'ALL', label: 'All Priorities' },
  { value: 'URGENT', label: 'Urgent (Tier L1)' },
  { value: 'NORMAL', label: 'Normal (Tier L2)' },
  { value: 'LOW', label: 'Low (Tier L3)' },
];

export const MonitoringPage = () => {
  const navigate = useNavigate();

  // ── State for Launch Configuration ──
  const [configOpen, setConfigOpen] = useState(true);
  const [selectedPersonaId, setSelectedPersonaId] = useState('P001');
  const [selectedCategory, setSelectedCategory] = useState('FLIGHT_DISRUPTION');
  const [priority, setPriority] = useState('ALL');
  const [minWaitSec, setMinWaitSec] = useState(120); // Realistic 2 - 2:30 min AHT pacing
  const [maxWaitSec, setMaxWaitSec] = useState(150);
  const [escalationMode, setEscalationMode] = useState('Auto'); // 'Auto' | 'Yes' | 'No'
  const [idleStopMins, setIdleStopMins] = useState(4); // 4-minute AHT silence threshold
  const [pilotMode, setPilotMode] = useState('MANUAL'); // 'MANUAL' | 'AUTO-PILOT'
  const [autoPilotIntervalSec, setAutoPilotIntervalSec] = useState(30);
  const [isAutoPilotRunning, setIsAutoPilotRunning] = useState(false);
  const [autoPilotRunId, setAutoPilotRunId] = useState(null);
  const [autoPilotCount, setAutoPilotCount] = useState(0);
  const [countdown, setCountdown] = useState(30);
  const [deployCount, setDeployCount] = useState(1);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployError, setDeployError] = useState('');

  // Auto-Pilot timer refs
  const autoPilotTimerRef = useRef(null);
  const countdownTimerRef = useRef(null);
  const autoPilotRunningRef = useRef(false);
  const deployCountRef = useRef(deployCount);

  useEffect(() => {
    deployCountRef.current = deployCount;
  }, [deployCount]);

  // ── State for Simulator Sessions & Conversation Monitor ──
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [sessionSearch, setSessionSearch] = useState('');
  const [sessionStatusFilter, setSessionStatusFilter] = useState('All'); // 'All' | 'Active' | 'Waiting' | 'Resolved' | 'Stopped'
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Confirmation Modals
  const [showStopAllConfirm, setShowStopAllConfirm] = useState(false);
  const [conversationToHalt, setConversationToHalt] = useState(null);
  const [conversationToDelete, setConversationToDelete] = useState(null);
  const [simulationToCancel, setSimulationToCancel] = useState(null);

  // Queries
  const { data: personaData } = useGetPersonasQuery({ limit: 100 });
  const { data: scenarioData } = useGetScenariosQuery({ limit: 100 });
  const {
    data: convListData,
    isLoading: convListLoading,
    refetch: refetchConversations,
  } = useGetConversationsQuery({ limit: 100 });

  const personas = personaData?.data || [];
  const scenarios = scenarioData?.data || [];
  const conversations = convListData?.data || [];

  // Mutations
  const [raiseQuery] = useRaiseSupportQueryMutation();
  const [stopConv, { isLoading: isStoppingSingle }] = useStopConversationMutation();
  const [stopAll, { isLoading: isStoppingAll }] = useStopAllConversationsMutation();
  const [deleteConv, { isLoading: isDeletingConv }] = useDeleteConversationMutation();
  const [cancelSim, { isLoading: isCancellingSim }] = useCancelSimulationMutation();

  // Selected Conversation Details Query
  const {
    data: selectedConvData,
    refetch: refetchSelectedConv,
  } = useGetConversationDetailsQuery(selectedConversationId, {
    skip: !selectedConversationId,
  });

  const activeConversation = selectedConvData?.data?.conversation || conversations.find((c) => c.conversationId === selectedConversationId);
  const initialMessages = selectedConvData?.data?.messages || [];
  const [liveMessages, setLiveMessages] = useState([]);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const chatScrollRef = useRef(null);

  // Sync messages when selected conversation changes
  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      setLiveMessages(initialMessages);
    } else {
      setLiveMessages([]);
    }
  }, [selectedConversationId, initialMessages]);

  // Auto-scroll chat window
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [liveMessages, isAgentTyping]);

  // If no conversation is selected and list loads, select the first active one
  useEffect(() => {
    if (!selectedConversationId && conversations.length > 0) {
      const firstActive = conversations.find((c) => ['ACTIVE', 'RUNNING', 'WAITING', 'NEW'].includes(c.status));
      if (firstActive) {
        setSelectedConversationId(firstActive.conversationId);
      } else {
        setSelectedConversationId(conversations[0].conversationId);
      }
    }
  }, [conversations, selectedConversationId]);

  // ── Global Socket.IO Subscriptions ──
  useEffect(() => {
    const unsubCreated = socketService.on('conversation:created', (payload) => {
      refetchConversations();
      if (payload?.conversation?.conversationId) {
        setSelectedConversationId(payload.conversation.conversationId);
      }
    });

    const unsubUpdated = socketService.on('conversation:updated', () => {
      refetchConversations();
      if (selectedConversationId) refetchSelectedConv();
    });

    const unsubProgress = socketService.on('conversation:progress', () => {
      refetchConversations();
      if (selectedConversationId) refetchSelectedConv();
    });

    const unsubCompleted = socketService.on('conversation:completed', () => {
      refetchConversations();
      if (selectedConversationId) refetchSelectedConv();
    });

    const unsubDeleted = socketService.on('conversation:deleted', (payload) => {
      refetchConversations();
      if (payload?.conversationId === selectedConversationId) {
        setSelectedConversationId(null);
      }
    });

    const unsubMsg = socketService.on('conversation:message', (payload) => {
      if (payload?.conversationId === selectedConversationId && payload?.message) {
        setLiveMessages((prev) => {
          const msgId = payload.message.messageId || payload.message._id;
          if (prev.some((m) => (m.messageId || m._id) === msgId)) return prev;
          return [...prev, payload.message];
        });
      }
      refetchConversations();
    });

    return () => {
      unsubCreated && unsubCreated();
      unsubUpdated && unsubUpdated();
      unsubProgress && unsubProgress();
      unsubCompleted && unsubCompleted();
      unsubDeleted && unsubDeleted();
      unsubMsg && unsubMsg();
    };
  }, [selectedConversationId, refetchConversations, refetchSelectedConv]);

  // Active Conversations Count
  const activeCount = useMemo(() => {
    return conversations.filter((c) =>
      ['ACTIVE', 'RUNNING', 'WAITING', 'NEW', 'WAITING_FOR_AGENT', 'WAITING_FOR_CUSTOMER'].includes(c.status)
    ).length;
  }, [conversations]);

  // Auto-Pilot timer cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoPilotTimerRef.current) clearInterval(autoPilotTimerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, []);

  // ── Single Query Dispatch Helper ──
  const dispatchSingleQuery = async (customRunId = null) => {
    // Pick persona
    const persona =
      selectedPersonaId === 'RANDOM'
        ? personas[Math.floor(Math.random() * personas.length)]
        : personas.find((p) => p.personaId === selectedPersonaId) || personas[0];

    // Pick scenario
    const scenario =
      selectedCategory === 'RANDOM'
        ? scenarios[Math.floor(Math.random() * scenarios.length)]
        : scenarios.find((s) => s.category?.toUpperCase() === selectedCategory?.toUpperCase()) || scenarios[0];

    const pId = persona?.personaId || 'P001';
    const sId = scenario?.scenarioId || 'S001';
    const randomPnr = `SW${Math.floor(1000 + Math.random() * 9000)}`;

    const res = await raiseQuery({
      runId: customRunId,
      personaId: pId,
      scenarioId: sId,
      customerName: persona?.name ? `${persona.name} (${customRunId ? 'AutoPilot' : 'Sim'})` : 'Simulated Passenger',
      passengerEmail: `passenger.${Math.random().toString(36).substring(2, 7)}@example.test`,
      pnr: randomPnr,
      flightNumber: `SW-${Math.floor(100 + Math.random() * 899)}`,
      category: selectedCategory === 'RANDOM' ? 'FLIGHT_DISRUPTION' : selectedCategory,
      minWaitSec,
      maxWaitSec,
      maxAhtMins: 4,
      idleStopMins,
      pilotMode,
      useMockCrm: false,
    }).unwrap();

    if (res?.data?.conversation?.conversationId) {
      setSelectedConversationId(res.data.conversation.conversationId);
    }
    return res;
  };

  // ── Auto-Pilot Start & Stop Handlers ──
  const handleStartAutoPilot = async () => {
    setDeployError('');
    setIsDeploying(true);
    const newRunId = `RUN-AUTOPILOT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setAutoPilotRunId(newRunId);
    setIsAutoPilotRunning(true);
    autoPilotRunningRef.current = true;
    const initialCount = deployCountRef.current || deployCount || 1;
    setAutoPilotCount(initialCount);
    setCountdown(autoPilotIntervalSec);

    try {
      // 1. Dispatch first batch of queries immediately
      for (let i = 0; i < initialCount; i++) {
        await dispatchSingleQuery(newRunId);
      }
      refetchConversations();
    } catch (err) {
      console.error('Auto-Pilot initial dispatch failed:', err);
      setDeployError(err?.data?.message || err?.message || 'Failed to start Auto-Pilot simulation');
      setIsAutoPilotRunning(false);
      autoPilotRunningRef.current = false;
      setIsDeploying(false);
      return;
    } finally {
      setIsDeploying(false);
    }

    // 2. Countdown ticker (every 1s)
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    countdownTimerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return autoPilotIntervalSec;
        }
        return prev - 1;
      });
    }, 1000);

    // 3. Recurring dispatch on the chosen timer interval
    if (autoPilotTimerRef.current) clearInterval(autoPilotTimerRef.current);
    autoPilotTimerRef.current = setInterval(async () => {
      if (!autoPilotRunningRef.current) return;
      try {
        const batchCount = deployCountRef.current || deployCount || 1;
        for (let i = 0; i < batchCount; i++) {
          await dispatchSingleQuery(newRunId);
        }
        setAutoPilotCount((c) => c + batchCount);
        refetchConversations();
      } catch (err) {
        console.error('Auto-Pilot recurring dispatch error:', err);
      }
    }, autoPilotIntervalSec * 1000);
  };

  const handleStopAutoPilot = async () => {
    autoPilotRunningRef.current = false;
    setIsAutoPilotRunning(false);
    if (autoPilotTimerRef.current) clearInterval(autoPilotTimerRef.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

    if (autoPilotRunId) {
      try {
        await cancelSim(autoPilotRunId).unwrap();
      } catch (err) {
        console.error('Failed to cancel Auto-Pilot simulation run on backend:', err);
      }
    }
    refetchConversations();
  };

  // ── Deploy Simulator Handler (Manual or Auto-Pilot) ──
  const handleDeploySimulator = async () => {
    if (pilotMode === 'AUTO-PILOT') {
      if (isAutoPilotRunning) {
        await handleStopAutoPilot();
      } else {
        await handleStartAutoPilot();
      }
      return;
    }

    setDeployError('');
    setIsDeploying(true);

    try {
      for (let i = 0; i < deployCount; i++) {
        await dispatchSingleQuery();
      }
      refetchConversations();
    } catch (err) {
      setDeployError(err?.data?.message || err?.message || 'Failed to deploy simulator');
    } finally {
      setIsDeploying(false);
    }
  };

  // ── Stop That Particular Simulation Run ──
  const handleStopSimulationRun = async () => {
    if (!simulationToCancel) return;
    try {
      await cancelSim(simulationToCancel).unwrap();
      if (autoPilotRunId === simulationToCancel) {
        handleStopAutoPilot();
      }
      setSimulationToCancel(null);
      refetchConversations();
      if (selectedConversationId) refetchSelectedConv();
    } catch (err) {
      console.error('Failed to stop simulation run:', err);
    }
  };

  // ── Stop Handlers ──
  const handleHaltSingle = async () => {
    if (!conversationToHalt) return;
    try {
      await stopConv(conversationToHalt).unwrap();
      setConversationToHalt(null);
      refetchConversations();
      if (selectedConversationId === conversationToHalt) refetchSelectedConv();
    } catch (err) {
      console.error('Failed to halt conversation:', err);
    }
  };

  const handleStopAll = async () => {
    try {
      await stopAll().unwrap();
      setShowStopAllConfirm(false);
      refetchConversations();
      if (selectedConversationId) refetchSelectedConv();
    } catch (err) {
      console.error('Failed to stop all conversations:', err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!conversationToDelete) return;
    try {
      await deleteConv(conversationToDelete).unwrap();
      setConversationToDelete(null);
      refetchConversations();
      if (selectedConversationId === conversationToDelete) {
        setSelectedConversationId(null);
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  };

  // ── Filter Simulator Sessions ──
  const filteredSessions = useMemo(() => {
    return conversations.filter((c) => {
      const q = sessionSearch.toLowerCase();
      const matchSearch =
        !sessionSearch ||
        c.conversationId?.toLowerCase()?.includes(q) ||
        c.crm?.externalConversationId?.toLowerCase()?.includes(q) ||
        c.customerFixture?.facts?.passengerName?.toLowerCase()?.includes(q) ||
        c.customerFixture?.facts?.pnr?.toLowerCase()?.includes(q);

      let matchStatus = true;
      if (sessionStatusFilter === 'Active') {
        matchStatus = ['ACTIVE', 'RUNNING', 'NEW'].includes(c.status);
      } else if (sessionStatusFilter === 'Waiting') {
        matchStatus = ['WAITING', 'WAITING_FOR_AGENT', 'WAITING_FOR_CUSTOMER'].includes(c.status);
      } else if (sessionStatusFilter === 'Resolved') {
        matchStatus = ['RESOLVED', 'CLOSED', 'COMPLETED'].includes(c.status);
      } else if (sessionStatusFilter === 'Stopped') {
        matchStatus = ['STOPPED', 'STOPPED_BY_USER', 'STOPPED_ALL_BY_USER', 'CANCELLED', 'FAILED', 'ABANDONED'].includes(
          c.status || c.endReason
        );
      }

      return matchSearch && matchStatus;
    });
  }, [conversations, sessionSearch, sessionStatusFilter]);

  const totalPages = Math.ceil(filteredSessions.length / pageSize) || 1;
  const paginatedSessions = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSessions.slice(start, start + pageSize);
  }, [filteredSessions, currentPage]);

  const facts = activeConversation?.customerFixture?.facts || {};
  const persona = activeConversation?.persona || activeConversation?.personaSnapshot || {};
  const scenario = activeConversation?.scenario || activeConversation?.scenarioSnapshot || {};
  const dynamicState = activeConversation?.dynamicPersonaState || {};

  return (
    <div className="space-y-4">
      {/* ── TOP HEADER BAR ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary)] text-white flex items-center justify-center shadow-xs">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold tracking-tight text-[var(--text-main)] mono-font uppercase">
                Autonomous Chat Monitor
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] text-[var(--accent-primary)] mono-font">
                PORT 5050
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">
              Real-Time Simulated Passenger Disruption Pipeline & Live CRM Bridge
            </p>
          </div>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href="http://localhost:5173"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-ticket-elevated)] hover:bg-[var(--surface-input-active)] text-[var(--text-main)] transition-colors mono-font"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            View CRM Agent Portal
          </a>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-bold mono-font">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {activeCount} Active
          </div>

          <button
            onClick={() => setShowStopAllConfirm(true)}
            disabled={activeCount === 0 || isStoppingAll}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-red-300 dark:border-red-900 bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 transition-colors mono-font cursor-pointer disabled:opacity-40"
          >
            <StopCircle className="w-3.5 h-3.5" />
            Stop All
          </button>
        </div>
      </div>

      {/* ── AUTO-PILOT ACTIVE RUNNER BANNER ── */}
      {isAutoPilotRunning && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3.5 rounded-xl bg-gradient-to-r from-red-950/90 via-slate-900 to-red-950/90 border border-red-500/50 shadow-lg text-white animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-600/30 border border-red-500/50 flex items-center justify-center">
              <Radio className="w-4 h-4 text-red-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-red-400 mono-font">
                  Auto-Pilot Pipeline Active
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-red-500/20 border border-red-500/40 text-red-200">
                  {autoPilotRunId}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mono-font mt-0.5">
                Dispatched: <strong className="text-white">{autoPilotCount} query/queries</strong> • Next batch ({deployCount} queries) in: <strong className="text-amber-300 font-bold">{countdown}s</strong> (Interval: {autoPilotIntervalSec}s) • Pacing: {minWaitSec}-{maxWaitSec}s
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleStopAutoPilot}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-md transition-colors mono-font cursor-pointer"
            >
              <StopCircle className="w-4 h-4" />
              Stop Auto-Pilot Simulation
            </button>
          </div>
        </div>
      )}

      {/* ── LAUNCH CONFIGURATION PANEL (Collapsible) ── */}
      <div className="rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs overflow-hidden">
        <button
          onClick={() => setConfigOpen(!configOpen)}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-[var(--surface-ticket-elevated)] border-b border-[var(--border-subtle)] hover:bg-[var(--surface-input-active)] transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[var(--accent-primary)]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mono-font">
              Launch Configuration
            </span>
            <span className="text-[10px] text-[var(--text-muted)] mono-font">
              ({pilotMode} mode • {pilotMode === 'AUTO-PILOT' ? `${deployCount} queries every ${autoPilotIntervalSec}s` : `${deployCount} session(s)`} • AHT 2-2:30m)
            </span>
          </div>
          {configOpen ? <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" /> : <ChevronDown className="w-4 h-4 text-[var(--text-muted)]" />}
        </button>

        {configOpen && (
          <div className="p-4 space-y-4">
            {deployError && (
              <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 mono-font">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{deployError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs mono-font">
              {/* Persona Selector */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
                  Persona
                </label>
                <div className="relative">
                  <select
                    value={selectedPersonaId}
                    onChange={(e) => setSelectedPersonaId(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] text-xs truncate"
                  >
                    <option value="RANDOM">🎲 Random Persona</option>
                    {personas.map((p) => (
                      <option key={p.personaId} value={p.personaId}>
                        {p.personaId}: {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Issue Category */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
                  Issue Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] text-xs truncate"
                >
                  {ISSUE_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] text-xs"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Wait Time (Sec) - AHT Benchmark 120-150s */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] uppercase font-bold text-[var(--text-muted)]">
                    Wait Time (Sec)
                  </label>
                  <span className="text-[9px] text-[var(--accent-primary)] font-bold">
                    {minWaitSec >= 120 ? 'Realistic AHT' : 'Fast Mode'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg px-2 py-1">
                  <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                  <input
                    type="number"
                    min="1"
                    max="600"
                    value={minWaitSec}
                    onChange={(e) => setMinWaitSec(Number(e.target.value))}
                    className="w-10 text-center bg-transparent text-[var(--text-main)] text-xs font-bold"
                  />
                  <span className="text-[var(--text-muted)]">-</span>
                  <input
                    type="number"
                    min="1"
                    max="600"
                    value={maxWaitSec}
                    onChange={(e) => setMaxWaitSec(Number(e.target.value))}
                    className="w-10 text-center bg-transparent text-[var(--text-main)] text-xs font-bold"
                  />
                </div>
                {/* Presets */}
                <div className="flex items-center gap-1 mt-1 text-[9px]">
                  <button
                    type="button"
                    onClick={() => { setMinWaitSec(120); setMaxWaitSec(150); }}
                    className="px-1.5 py-0.5 rounded bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                  >
                    2m–2:30m (AHT)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMinWaitSec(5); setMaxWaitSec(10); }}
                    className="px-1.5 py-0.5 rounded bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                  >
                    5s–10s (Fast)
                  </button>
                </div>
              </div>

              {/* Escalation Mode */}
              <div>
                <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1">
                  Escalation Mode
                </label>
                <div className="grid grid-cols-3 gap-1 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg p-0.5">
                  {['Auto', 'Yes', 'No'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setEscalationMode(mode)}
                      className={`py-1 text-[10px] font-bold rounded cursor-pointer transition-colors ${
                        escalationMode === mode
                          ? 'bg-[var(--accent-primary)] text-white'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sub-row Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--border-subtle)] text-xs mono-font">
              <div className="flex items-center gap-4 flex-wrap">
                {/* Idle Stop (4 min threshold) */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase">AHT Ceiling (Mins):</span>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={idleStopMins}
                    onChange={(e) => setIdleStopMins(Number(e.target.value))}
                    className="w-12 px-1.5 py-1 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded text-center text-xs text-[var(--text-main)] font-bold"
                  />
                  <span className="text-[9px] text-[var(--text-dim)]">(Bot stops replying &gt;4m)</span>
                </div>

                {/* Pilot Mode Switcher */}
                <div className="flex items-center gap-1 bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] rounded-lg p-0.5">
                  {['MANUAL', 'AUTO-PILOT'].map((m) => (
                    <button
                      key={m}
                      onClick={() => setPilotMode(m)}
                      className={`px-2.5 py-1 text-[10px] font-bold rounded cursor-pointer transition-colors ${
                        pilotMode === m
                          ? 'bg-[var(--accent-primary)] text-white shadow-2xs'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                {/* If Auto-Pilot: Show Timer Interval Selector */}
                {pilotMode === 'AUTO-PILOT' && (
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[var(--text-muted)] uppercase">Interval (Sec):</span>
                    <input
                      type="number"
                      min="5"
                      max="3600"
                      value={autoPilotIntervalSec}
                      onChange={(e) => setAutoPilotIntervalSec(Math.max(5, Number(e.target.value)))}
                      className="w-14 px-1.5 py-1 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded text-center text-xs text-[var(--text-main)] font-bold"
                    />
                    <div className="flex items-center gap-1">
                      {[15, 30, 60, 120].map((sec) => (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => setAutoPilotIntervalSec(sec)}
                          className={`px-1.5 py-0.5 text-[9px] rounded border cursor-pointer ${
                            autoPilotIntervalSec === sec
                              ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)]'
                              : 'bg-[var(--surface-input)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:text-[var(--text-main)]'
                          }`}
                        >
                          {sec}s
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Query Count Stepper (Available in BOTH Manual & Auto-Pilot modes) */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[var(--text-muted)] uppercase">
                    {pilotMode === 'AUTO-PILOT' ? 'Queries / Interval:' : 'Count:'}
                  </span>
                  <div className="flex items-center bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg">
                    <button
                      onClick={() => setDeployCount((c) => Math.max(1, c - 1))}
                      className="px-2 py-0.5 text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-2 font-bold text-xs text-[var(--text-main)]">{deployCount}</span>
                    <button
                      onClick={() => setDeployCount((c) => Math.min(10, c + 1))}
                      className="px-2 py-0.5 text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  {pilotMode === 'AUTO-PILOT' && (
                    <span className="text-[9px] text-[var(--text-dim)]">({deployCount} / {autoPilotIntervalSec}s)</span>
                  )}
                </div>
              </div>

              {/* Deploy / Auto-Pilot CTA */}
              <button
                onClick={handleDeploySimulator}
                disabled={isDeploying}
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg font-bold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50 ${
                  pilotMode === 'AUTO-PILOT' && isAutoPilotRunning
                    ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                    : 'bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white'
                }`}
              >
                {isDeploying ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Deploying Pipeline...
                  </>
                ) : pilotMode === 'AUTO-PILOT' ? (
                  isAutoPilotRunning ? (
                    <>
                      <StopCircle className="w-3.5 h-3.5" />
                      Stop Auto-Pilot Simulation
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Start Auto-Pilot ({deployCount} queries / {autoPilotIntervalSec}s)
                    </>
                  )
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Deploy Simulator ({deployCount})
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── MAIN WORKSPACE: CONVERSATION MONITOR (LEFT) & SIMULATOR SESSIONS (RIGHT) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* ── LEFT PANE: CONVERSATION MONITOR (~60-65% width) ── */}
        <div className="lg:col-span-8 flex flex-col h-[750px] rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs overflow-hidden">
          <div className="airmail-stripe-top" />

          {/* Monitor Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[var(--surface-ticket-elevated)] border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs uppercase tracking-wider text-[var(--accent-primary)] mono-font flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                Conversation Monitor
              </span>
              {activeConversation && (
                <span className="text-[11px] font-bold text-[var(--text-main)] mono-font">
                  • {activeConversation.conversationId}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 mono-font">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Real-Time
              </span>
              {activeConversation && (
                <>
                  <button
                    onClick={() => navigate(`/conversations/${activeConversation.conversationId}`)}
                    title="Open Full Inspector"
                    className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--surface-input)] transition-colors cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setConversationToDelete(activeConversation.conversationId)}
                    title="Delete Conversation"
                    className="p-1 rounded text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Active Conversation Details Banner */}
          {activeConversation ? (
            <div className="p-3 bg-[var(--surface-ticket-elevated)]/40 border-b border-[var(--border-subtle)] text-xs mono-font flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] font-bold flex items-center justify-center text-xs">
                  {(facts.passengerName || persona.name || 'P')[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[var(--text-main)]">
                      {facts.passengerName || persona.name}
                    </span>
                    <StatusBadge status={activeConversation.status} />
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] flex items-center gap-2 mt-0.5">
                    <span>PNR: <strong className="text-[var(--text-main)]">{facts.pnr || '—'}</strong></span>
                    <span>Flight: <strong className="text-[var(--text-main)]">{facts.flightNumber || 'SW-101'}</strong></span>
                    <span>CRM: <strong className="text-[var(--accent-primary)]">{activeConversation.crm?.externalConversationId || 'CONNECTING...'}</strong></span>
                  </div>
                </div>
              </div>

              {/* Dynamic Emotional Gauge */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] text-[var(--text-muted)] uppercase">Frustration</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="w-14 h-1.5 rounded-full bg-[var(--border-subtle)] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          (dynamicState.frustrationScore || 2) >= 7 ? 'bg-red-500' : (dynamicState.frustrationScore || 2) >= 4 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${((dynamicState.frustrationScore || 2) / 10) * 100}%` }}
                      />
                    </div>
                    <span className="font-bold text-[10px] text-[var(--text-main)]">
                      {dynamicState.frustrationScore || 2}/10
                    </span>
                  </div>
                </div>

                {['ACTIVE', 'RUNNING', 'WAITING'].includes(activeConversation.status) && (
                  <button
                    onClick={() => setConversationToHalt(activeConversation.conversationId)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold rounded bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-300 dark:border-red-800 transition-colors cursor-pointer"
                  >
                    <StopCircle className="w-3 h-3" /> Stop
                  </button>
                )}
              </div>
            </div>
          ) : null}

          {/* AHT Stopping Criteria Alert Banner (4 min threshold) */}
          {activeConversation && (activeConversation.status === 'ABANDONED' || activeConversation.endReason?.includes('AHT_TIMEOUT')) && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs mono-font flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                <span>
                  <strong>AHT 4-Minute Ceiling Enforced:</strong> Bot ceased replying because conversation handling time / silence reached 4 minutes. Conversation marked ABANDONED.
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 uppercase whitespace-nowrap">
                AHT LIMIT REACHED
              </span>
            </div>
          )}

          {/* Main Chat Stream or Empty State */}
          <div ref={chatScrollRef} className="flex-1 p-4 overflow-y-auto space-y-3 bg-[var(--surface-ticket)]/60">
            {!activeConversation ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center shadow-inner">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  <Plane className="w-4 h-4 text-[var(--accent-primary)] absolute -top-1 -right-1 -rotate-45 animate-pulse" />
                </div>
                <div className="max-w-xs space-y-1">
                  <h4 className="text-sm font-bold text-[var(--text-main)] mono-font">
                    No Conversation Selected
                  </h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Select an active simulator session from the panel on the right to monitor the conversation in real-time.
                  </p>
                </div>
                <button
                  onClick={handleDeploySimulator}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white shadow-xs transition-colors mono-font cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Deploy New Simulator
                </button>
              </div>
            ) : liveMessages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[var(--text-muted)] space-y-2 mono-font text-xs">
                <RefreshCw className="w-6 h-6 animate-spin text-[var(--accent-primary)]" />
                <p>Waiting for first message exchange with CRM support agent...</p>
              </div>
            ) : (
              liveMessages.map((msg, idx) => {
                const isCustomer = msg.senderType === 'CUSTOMER';
                return (
                  <div
                    key={msg.messageId || msg._id || idx}
                    className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'} animate-in fade-in duration-150`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-[var(--text-muted)] mono-font">
                      <span className="font-bold text-[var(--text-main)]">
                        {isCustomer ? facts.passengerName || 'PASSENGER' : msg.senderId || 'FRONTLINE AGENT'}
                      </span>
                      <span>•</span>
                      <span>
                        {msg.sentAt
                          ? new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : 'Just now'}
                      </span>
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs shadow-xs leading-relaxed ${
                        isCustomer
                          ? 'bg-[var(--surface-input)] text-[var(--text-main)] border border-[var(--border-subtle)] rounded-tl-xs'
                          : 'bg-[#1e293b] text-white dark:bg-[#132238] dark:border dark:border-slate-700 rounded-tr-xs'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>

                    {isCustomer && msg.intent && (
                      <span className="mt-1 px-2 py-0.2 rounded-full text-[9px] font-bold text-[var(--text-muted)] bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] mono-font">
                        INTENT: {msg.intent}
                      </span>
                    )}
                  </div>
                );
              })
            )}

            {isAgentTyping && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--surface-ticket-elevated)] text-[var(--text-muted)] text-xs mono-font">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-ping" />
                <span>Simulated passenger is formulating response...</span>
              </div>
            )}
          </div>

          {/* Bottom Context Footer */}
          {activeConversation && (
            <div className="px-4 py-2.5 bg-[var(--surface-ticket-elevated)] border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] mono-font text-[var(--text-muted)]">
              <span className="truncate max-w-md">
                Goal: <strong className="text-[var(--text-main)]">{scenario.customerObjective || 'Resolve issue'}</strong>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--surface-ticket)] border border-[var(--border-subtle)] font-bold text-[var(--accent-primary)]">
                Step: {activeConversation.scenarioProgress?.currentState || 'RUNNING'}
              </span>
            </div>
          )}
        </div>

        {/* ── RIGHT PANE: SIMULATOR SESSIONS (~35-40% width) ── */}
        <div className="lg:col-span-4 flex flex-col h-[750px] rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs overflow-hidden">
          {/* Sessions Header */}
          <div className="p-3.5 bg-[var(--surface-ticket-elevated)] border-b border-[var(--border-subtle)] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[var(--accent-primary)]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mono-font">
                  Simulator Sessions
                </h3>
              </div>
              <button
                onClick={() => refetchConversations()}
                title="Refresh Sessions"
                className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, PNR, or petition ID..."
                value={sessionSearch}
                onChange={(e) => {
                  setSessionSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-8 pr-3 py-1.5 bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-xs text-[var(--text-main)] mono-font placeholder-[var(--text-dim)]"
              />
            </div>

            {/* Filter Tabs / Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-[10px] mono-font">
              {['All', 'Active', 'Waiting', 'Resolved', 'Stopped'].map((tab) => {
                const count =
                  tab === 'All'
                    ? conversations.length
                    : tab === 'Active'
                    ? conversations.filter((c) => ['ACTIVE', 'RUNNING', 'NEW'].includes(c.status)).length
                    : tab === 'Waiting'
                    ? conversations.filter((c) => ['WAITING', 'WAITING_FOR_AGENT'].includes(c.status)).length
                    : tab === 'Resolved'
                    ? conversations.filter((c) => ['RESOLVED', 'CLOSED', 'COMPLETED'].includes(c.status)).length
                    : conversations.filter((c) => ['STOPPED', 'STOPPED_BY_USER', 'FAILED', 'ABANDONED'].includes(c.status || c.endReason)).length;

                return (
                  <button
                    key={tab}
                    onClick={() => {
                      setSessionStatusFilter(tab);
                      setCurrentPage(1);
                    }}
                    className={`px-2 py-1 rounded-md font-bold whitespace-nowrap cursor-pointer transition-colors ${
                      sessionStatusFilter === tab
                        ? 'bg-[var(--accent-primary)] text-white'
                        : 'bg-[var(--surface-input)] text-[var(--text-muted)] border border-[var(--border-subtle)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    {tab} {count > 0 && <span className="text-[9px] opacity-80">({count})</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sessions List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {convListLoading ? (
              <div className="p-8 text-center text-xs text-[var(--text-muted)] mono-font space-y-2">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[var(--accent-primary)]" />
                <p>Loading simulator sessions...</p>
              </div>
            ) : paginatedSessions.length === 0 ? (
              <div className="p-8 text-center text-xs text-[var(--text-muted)] mono-font space-y-2">
                <p>No simulator sessions match criteria.</p>
                <button
                  onClick={handleDeploySimulator}
                  className="px-3 py-1.5 rounded-lg bg-[var(--accent-primary)] text-white font-bold text-[10px] cursor-pointer"
                >
                  + Deploy Session
                </button>
              </div>
            ) : (
              paginatedSessions.map((conv) => {
                const isSelected = selectedConversationId === conv.conversationId;
                const cFacts = conv.customerFixture?.facts || {};
                const cPersona = conv.persona || conv.personaSnapshot || {};
                const cScenario = conv.scenario || conv.scenarioSnapshot || {};
                const turns = conv.scenarioProgress?.turnCount ?? 0;
                const isActive = ['ACTIVE', 'RUNNING', 'WAITING', 'NEW'].includes(conv.status);

                return (
                  <div
                    key={conv.conversationId}
                    onClick={() => setSelectedConversationId(conv.conversationId)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? 'bg-[var(--surface-input-active)] border-[var(--accent-primary)] shadow-xs ring-1 ring-[var(--accent-primary)]'
                        : 'bg-[var(--surface-ticket)] border-[var(--border-subtle)] hover:bg-[var(--surface-ticket-elevated)]'
                    }`}
                  >
                    {/* Header: Passenger Name & Status */}
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-[var(--text-main)] mono-font truncate max-w-[170px]">
                        {cFacts.passengerName || cPersona.name || 'Passenger'}
                      </span>
                      <StatusBadge status={conv.status} />
                    </div>

                    {/* Tags: Category, turns, PNR */}
                    <div className="flex items-center gap-1.5 flex-wrap my-1.5 text-[10px] mono-font">
                      <span className="px-1.5 py-0.5 rounded bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
                        {cScenario.category || 'disruption'}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
                        PNR: {cFacts.pnr || '—'}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)]">
                        💬 {turns}
                      </span>
                      {(conv.status === 'ABANDONED' || conv.endReason?.includes('AHT_TIMEOUT')) && (
                        <span className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 border border-amber-300 dark:border-amber-800 font-bold">
                          ⏱️ AHT 4m Timeout
                        </span>
                      )}
                    </div>

                    {/* Footer: Timestamp and Stop action */}
                    <div className="flex items-center justify-between pt-1 border-t border-[var(--border-subtle)]/60 text-[10px] text-[var(--text-dim)] mono-font">
                      <span>
                        {conv.startedAt
                          ? new Date(conv.startedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
                          : '—'}
                      </span>

                      <div className="flex items-center gap-1">
                        {isActive && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConversationToHalt(conv.conversationId);
                            }}
                            title="Halt this conversation"
                            className="px-2 py-0.5 text-[9px] font-bold rounded bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-300 dark:border-red-800 transition-colors cursor-pointer"
                          >
                            STOP
                          </button>
                        )}
                        {conv.simulationRun && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const rId = typeof conv.simulationRun === 'object' ? conv.simulationRun.runId : conv.simulationRun;
                              setSimulationToCancel(rId);
                            }}
                            title="Halt this entire simulation run"
                            className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-[var(--surface-ticket-elevated)] hover:bg-red-50 hover:text-red-600 text-[var(--text-muted)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                          >
                            Stop Run
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Sessions Pagination Footer */}
          <div className="p-2.5 bg-[var(--surface-ticket-elevated)] border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] mono-font text-[var(--text-muted)]">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-2 py-1 rounded bg-[var(--surface-ticket)] border border-[var(--border-subtle)] disabled:opacity-40 cursor-pointer"
            >
              ← Prev
            </button>
            <span>
              Page {currentPage} of {totalPages} ({filteredSessions.length} total)
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-2 py-1 rounded bg-[var(--surface-ticket)] border border-[var(--border-subtle)] disabled:opacity-40 cursor-pointer"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* ── MODALS ── */}
      <ConfirmDialog
        isOpen={showStopAllConfirm}
        title="Stop All Simulator Sessions"
        message={`Are you sure you want to halt all ${activeCount} active customer simulations across the CRM?`}
        confirmLabel={isStoppingAll ? 'Halting All...' : 'Halt All Sessions'}
        isDanger={true}
        onConfirm={handleStopAll}
        onCancel={() => setShowStopAllConfirm(false)}
      />

      <ConfirmDialog
        isOpen={Boolean(conversationToHalt)}
        title="Halt Simulator Session"
        message={`Halt customer simulation session "${conversationToHalt}"? The agent chat will be concluded.`}
        confirmLabel={isStoppingSingle ? 'Stopping...' : 'Halt Session'}
        isDanger={true}
        onConfirm={handleHaltSingle}
        onCancel={() => setConversationToHalt(null)}
      />

      <ConfirmDialog
        isOpen={Boolean(simulationToCancel)}
        title="Stop That Simulation Run"
        message={`Are you sure you want to stop simulation run "${simulationToCancel}" and halt all of its active customer sessions?`}
        confirmLabel={isCancellingSim ? 'Stopping Run...' : 'Stop Simulation Run'}
        isDanger={true}
        onConfirm={handleStopSimulationRun}
        onCancel={() => setSimulationToCancel(null)}
      />

      <ConfirmDialog
        isOpen={Boolean(conversationToDelete)}
        title="Delete Conversation"
        message={`Are you sure you want to permanently delete conversation "${conversationToDelete}" and all its transcripts?`}
        confirmLabel={isDeletingConv ? 'Deleting...' : 'Delete Permanently'}
        isDanger={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setConversationToDelete(null)}
      />
    </div>
  );
};

export default MonitoringPage;
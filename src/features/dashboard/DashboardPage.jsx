import React from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  PlayCircle,
  Users,
  Compass,
  MessagesSquare,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Send,
  Plus,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import PageHeader from '../../components/common/PageHeader.jsx';
import StatCard from '../../components/common/StatCard.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import LoadingState from '../../components/common/LoadingState.jsx';
import ErrorState from '../../components/common/ErrorState.jsx';

import { useGetSimulationsQuery } from '../simulations/simulationApi.js';
import { useGetConversationsQuery } from '../conversations/conversationApi.js';
import { useGetPersonasQuery } from '../personas/personaApi.js';
import { useGetScenariosQuery } from '../scenarios/scenarioApi.js';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { openQueryModal } = useOutletContext() || {};

  const { data: simData, isLoading: simLoading, error: simError } = useGetSimulationsQuery();
  const { data: convData, isLoading: convLoading } = useGetConversationsQuery({ limit: 10 });
  const { data: personaData } = useGetPersonasQuery({ limit: 100 });
  const { data: scenarioData } = useGetScenariosQuery({ limit: 100 });

  if (simLoading || convLoading) {
    return <LoadingState message="Aggregating simulation telemetry from cluster..." />;
  }

  if (simError) {
    return (
      <ErrorState
        title="Failed to Retrieve Simulation Telemetry"
        message="Could not connect to simulator backend at http://localhost:5050. Ensure the simulator backend is running."
      />
    );
  }

  const simulations = simData?.data || [];
  const conversations = convData?.data || [];
  const personas = personaData?.data || [];
  const scenarios = scenarioData?.data || [];

  const totalSims = simulations.length;
  const runningSims = simulations.filter((s) => s.status === 'RUNNING').length;
  const completedSims = simulations.filter((s) => s.status === 'COMPLETED').length;
  const failedSims = simulations.filter((s) => s.status === 'FAILED').length;

  // Chart data: Personas by category
  const personaCategories = personas.reduce((acc, p) => {
    const cat = p.category || 'GENERAL';
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const personaCategoryData = Object.entries(personaCategories).map(([name, count]) => ({
    name,
    count,
  }));

  // Chart data: Scenario difficulties
  const scenarioDiffs = scenarios.reduce((acc, s) => {
    const d = s.difficulty || 'MEDIUM';
    acc[d] = (acc[d] || 0) + 1;
    return acc;
  }, {});

  const difficultyColors = {
    EASY: '#10b981',
    MEDIUM: '#f59e0b',
    HARD: '#b93838',
  };

  const scenarioDataChart = Object.entries(scenarioDiffs).map(([name, value]) => ({
    name,
    value,
    color: difficultyColors[name] || '#38bdf8',
  }));

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <PageHeader
        title="Simulation Mission Control"
        subtitle="Autonomous AI Passenger Persona Engine for Stress Testing Airline CRM Agents"
        badge="ONLINE"
        actions={
          <>
            <button
              onClick={() => openQueryModal && openQueryModal()}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white shadow-xs transition-colors mono-font cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              ⚡ Raise Query to CRM
            </button>
            <button
              onClick={() => navigate('/simulations/create')}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-lg bg-[var(--surface-ticket)] text-[var(--text-main)] hover:bg-[var(--surface-input-active)] border border-[var(--border-subtle)] shadow-xs transition-colors mono-font cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              New Simulation Run
            </button>
          </>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Simulations"
          value={runningSims}
          subvalue={`of ${totalSims} total runs`}
          icon={PlayCircle}
          color="crimson"
          trend={`${completedSims} completed • ${failedSims} failed`}
        />

        <StatCard
          title="Simulated Conversations"
          value={conversations.length}
          subvalue="live passenger sessions"
          icon={MessagesSquare}
          color="blue"
          trend="Real-time multi-turn exchanges"
        />

        <StatCard
          title="Persona Library"
          value={personas.length || 36}
          subvalue="behavioral archetypes"
          icon={Users}
          color="emerald"
          trend="Patience, assertiveness & affect states"
        />

        <StatCard
          title="Flight Scenarios"
          value={scenarios.length || 8}
          subvalue="disruption test workflows"
          icon={Compass}
          color="amber"
          trend="Cancellations, baggage, rebooking"
        />
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scenario Complexity */}
        <div className="p-5 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mono-font">
              Scenario Difficulty Distribution
            </h3>
            <span className="text-[10px] text-[var(--text-muted)] mono-font">
              {scenarios.length} Scenarios Seeded
            </span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scenarioDataChart}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {scenarioDataChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 mt-2 pt-2 border-t border-[var(--border-subtle)] text-xs mono-font">
            {scenarioDataChart.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}: <strong>{item.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Persona Categories Bar Chart */}
        <div className="p-5 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mono-font">
              Persona Archetype Clusters
            </h3>
            <span className="text-[10px] text-[var(--text-muted)] mono-font">
              {personas.length} Distinct Archetypes
            </span>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={personaCategoryData}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="count" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="mt-2 text-[11px] text-[var(--text-muted)] text-center mono-font">
            Covers Frustrated, Panicked, VIP Business, First-Time Flyers, and Disruption Edge Cases.
          </p>
        </div>
      </div>

      {/* Recent Simulation Runs Table */}
      <div className="p-5 rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] mb-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-main)] mono-font">
              Recent Simulation Dispatches
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Latest autonomous batches evaluating CRM agent queues
            </p>
          </div>
          <button
            onClick={() => navigate('/simulations')}
            className="text-xs font-semibold text-[var(--accent-primary)] hover:underline flex items-center gap-1 mono-font"
          >
            View All Runs <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {simulations.length === 0 ? (
          <div className="text-center py-8 text-xs text-[var(--text-muted)] mono-font">
            No simulations executed yet. Click &quot;New Simulation Run&quot; or &quot;Raise Query to CRM&quot; to begin.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs mono-font">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)]">
                  <th className="py-2.5 px-3">RUN IDENTIFIER</th>
                  <th className="py-2.5 px-3">NAME</th>
                  <th className="py-2.5 px-3">ENVIRONMENT</th>
                  <th className="py-2.5 px-3">STATUS</th>
                  <th className="py-2.5 px-3">STRATEGY</th>
                  <th className="py-2.5 px-3">CREATED</th>
                  <th className="py-2.5 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {simulations.slice(0, 5).map((sim) => (
                  <tr key={sim.runId} className="hover:bg-[var(--surface-ticket-elevated)]/60 transition-colors">
                    <td className="py-3 px-3 font-bold text-[var(--accent-primary)]">
                      {sim.runId}
                    </td>
                    <td className="py-3 px-3 text-[var(--text-main)] font-sans font-medium">
                      {sim.name}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-1.5 py-0.5 rounded bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)]">
                        {sim.environment}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={sim.status} />
                    </td>
                    <td className="py-3 px-3 text-[var(--text-muted)]">
                      {sim.selection?.strategy || 'MANUAL'}
                    </td>
                    <td className="py-3 px-3 text-[var(--text-dim)]">
                      {new Date(sim.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => navigate(`/simulations/${sim.runId}`)}
                        className="px-2.5 py-1 rounded bg-[var(--surface-ticket-elevated)] hover:bg-[var(--surface-input-active)] text-[var(--text-main)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                      >
                        Details →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

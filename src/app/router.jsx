import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import AppLayout from '../components/layout/AppLayout.jsx';
import ProtectedRoute from '../components/layout/ProtectedRoute.jsx';

import LoginPage from '../features/auth/LoginPage.jsx';
import MonitoringPage from '../features/monitoring/MonitoringPage.jsx';
import DashboardPage from '../features/dashboard/DashboardPage.jsx';

import LibraryPage from '../features/library/LibraryPage.jsx';
import PersonaDetailsPage from '../features/personas/PersonaDetailsPage.jsx';
import CreatePersonaPage from '../features/personas/CreatePersonaPage.jsx';

import ScenarioDetailsPage from '../features/scenarios/ScenarioDetailsPage.jsx';
import CreateScenarioPage from '../features/scenarios/CreateScenarioPage.jsx';

import SimulationListPage from '../features/simulations/SimulationListPage.jsx';
import CreateSimulationPage from '../features/simulations/CreateSimulationPage.jsx';
import SimulationDetailsPage from '../features/simulations/SimulationDetailsPage.jsx';

import LiveConversationsPage from '../features/conversations/LiveConversationsPage.jsx';
import ConversationDetailsPage from '../features/conversations/ConversationDetailsPage.jsx';

import SettingsPage from '../features/settings/SettingsPage.jsx';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/',
            element: <MonitoringPage />,
          },
          {
            path: '/monitoring',
            element: <MonitoringPage />,
          },
          {
            path: '/overview',
            element: <DashboardPage />,
          },
          {
            path: '/library',
            element: <LibraryPage />,
          },
          {
            path: '/personas',
            element: <LibraryPage initialTab="personas" />,
          },
          {
            path: '/personas/create',
            element: <CreatePersonaPage />,
          },
          {
            path: '/personas/:personaId',
            element: <PersonaDetailsPage />,
          },
          {
            path: '/scenarios',
            element: <LibraryPage initialTab="scenarios" />,
          },
          {
            path: '/scenarios/create',
            element: <CreateScenarioPage />,
          },
          {
            path: '/scenarios/:scenarioId',
            element: <ScenarioDetailsPage />,
          },
          {
            path: '/simulations',
            element: <SimulationListPage />,
          },
          {
            path: '/simulations/create',
            element: <CreateSimulationPage />,
          },
          {
            path: '/simulations/:runId',
            element: <SimulationDetailsPage />,
          },
          {
            path: '/conversations',
            element: <LiveConversationsPage />,
          },
          {
            path: '/conversations/:conversationId',
            element: <ConversationDetailsPage />,
          },
          {
            path: '/settings',
            element: <SettingsPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router;

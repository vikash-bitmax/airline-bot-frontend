MASTER PROMPT — AIRLINE AI CUSTOMER PERSONA SIMULATOR FRONTEND
==============================================================

1\. Project Overview
--------------------

Build a complete, production-quality frontend for an **Airline AI Customer Persona Simulator**.

This is a standalone application that simulates airline customers interacting with our existing International Airline Chat Support CRM.

The simulator allows administrators, QA teams, team leaders, and testers to:

*   Create and manage AI customer personas.
    
*   Create and manage airline customer support scenarios.
    
*   Configure and launch simulations.
    
*   Watch AI-generated customer conversations in real time.
    
*   Observe customer emotional and behavioural changes.
    
*   Monitor how CRM agents handle simulated customers.
    
*   Evaluate agent performance and CRM workflow correctness.
    
*   Replay conversations and inspect events.
    
*   Generate detailed simulation reports.
    

The frontend must communicate with the simulator backend through REST APIs and Socket.IO.

**Important:** This is a separate application. Do not mix its frontend code into the existing CRM frontend.

2\. Technology Stack
--------------------

Use the following technologies:

*   React
    
*   Vite
    
*   TypeScript
    
*   Tailwind CSS
    
*   React Router
    
*   Redux Toolkit
    
*   RTK Query for REST API integration
    
*   Socket.IO Client for real-time updates
    
*   React Hook Form
    
*   Zod for form validation
    
*   Recharts for analytics and charts
    
*   Lucide React for icons
    
*   date-fns for date formatting
    

Use reusable components and a feature-based architecture.

Do not introduce unnecessary libraries.

3\. Frontend Folder Structure
-----------------------------

Create the frontend inside the standalone simulator project.

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   airline-ai-simulator/  │  ├── frontend/  │   ├── public/  │   │  │   ├── src/  │   │   ├── app/  │   │   │   ├── store.ts  │   │   │   ├── hooks.ts  │   │   │   └── router.tsx  │   │   │  │   │   ├── assets/  │   │   │  │   │   ├── components/  │   │   │   ├── common/  │   │   │   │   ├── PageHeader.tsx  │   │   │   │   ├── StatCard.tsx  │   │   │   │   ├── DataTable.tsx  │   │   │   │   ├── SearchInput.tsx  │   │   │   │   ├── FilterDropdown.tsx  │   │   │   │   ├── ConfirmDialog.tsx  │   │   │   │   ├── EmptyState.tsx  │   │   │   │   ├── LoadingState.tsx  │   │   │   │   ├── ErrorState.tsx  │   │   │   │   └── StatusBadge.tsx  │   │   │   │  │   │   │   ├── layout/  │   │   │   │   ├── AppLayout.tsx  │   │   │   │   ├── Sidebar.tsx  │   │   │   │   ├── Header.tsx  │   │   │   │   ├── Breadcrumbs.tsx  │   │   │   │   └── ProtectedRoute.tsx  │   │   │   │  │   │   │   ├── charts/  │   │   │   └── conversation/  │   │   │       ├── ChatWindow.tsx  │   │   │       ├── ChatMessage.tsx  │   │   │       ├── ConversationTimeline.tsx  │   │   │       ├── CustomerProfilePanel.tsx  │   │   │       ├── SimulationStatus.tsx  │   │   │       └── EventTimeline.tsx  │   │   │  │   │   ├── features/  │   │   │   ├── auth/  │   │   │   │   ├── authApi.ts  │   │   │   │   ├── authSlice.ts  │   │   │   │   └── LoginPage.tsx  │   │   │   │  │   │   │   ├── dashboard/  │   │   │   │   ├── dashboardApi.ts  │   │   │   │   ├── DashboardPage.tsx  │   │   │   │   └── components/  │   │   │   │  │   │   │   ├── personas/  │   │   │   │   ├── personaApi.ts  │   │   │   │   ├── PersonaListPage.tsx  │   │   │   │   ├── PersonaDetailsPage.tsx  │   │   │   │   ├── CreatePersonaPage.tsx  │   │   │   │   └── components/  │   │   │   │  │   │   │   ├── scenarios/  │   │   │   │   ├── scenarioApi.ts  │   │   │   │   ├── ScenarioListPage.tsx  │   │   │   │   ├── ScenarioDetailsPage.tsx  │   │   │   │   ├── CreateScenarioPage.tsx  │   │   │   │   └── components/  │   │   │   │  │   │   │   ├── simulations/  │   │   │   │   ├── simulationApi.ts  │   │   │   │   ├── SimulationListPage.tsx  │   │   │   │   ├── CreateSimulationPage.tsx  │   │   │   │   ├── SimulationDetailsPage.tsx  │   │   │   │   └── components/  │   │   │   │  │   │   │   ├── conversations/  │   │   │   │   ├── conversationApi.ts  │   │   │   │   ├── LiveConversationsPage.tsx  │   │   │   │   ├── ConversationDetailsPage.tsx  │   │   │   │   └── components/  │   │   │   │  │   │   │   ├── reports/  │   │   │   │   ├── reportApi.ts  │   │   │   │   ├── ReportsPage.tsx  │   │   │   │   └── components/  │   │   │   │  │   │   │   └── settings/  │   │   │       └── SettingsPage.tsx  │   │   │  │   │   ├── services/  │   │   │   ├── api.ts  │   │   │   └── socket.ts  │   │   │  │   │   ├── hooks/  │   │   ├── types/  │   │   ├── utils/  │   │   ├── constants/  │   │   ├── styles/  │   │   │   └── index.css  │   │   │  │   │   ├── App.tsx  │   │   └── main.tsx  │   │  │   ├── .env.example  │   ├── index.html  │   ├── package.json  │   ├── tsconfig.json  │   └── vite.config.ts   `

You may add supporting files where necessary, but preserve this overall structure.

4\. UI/UX Design Direction
==========================

Build a premium enterprise SaaS dashboard.

The interface should look like a professional airline operations and AI testing platform, not a generic admin template.

### Visual direction

*   Clean, modern, minimal enterprise design.
    
*   Light theme as the default.
    
*   White and soft neutral backgrounds.
    
*   Deep navy or charcoal typography.
    
*   Subtle blue/purple accents.
    
*   Soft borders and restrained shadows.
    
*   Consistent spacing and alignment.
    
*   Rounded cards and inputs.
    
*   Clear visual hierarchy.
    
*   Professional typography.
    
*   Responsive layout for desktop, tablet, and mobile.
    

Use a consistent design system for:

*   Colors
    
*   Typography
    
*   Spacing
    
*   Border radius
    
*   Shadows
    
*   Buttons
    
*   Inputs
    
*   Tables
    
*   Cards
    
*   Dialogs
    
*   Status indicators
    

Avoid excessive gradients, excessive animations, oversized headings, and unnecessary decorative elements.

### Application layout

Desktop layout:

*   Fixed or collapsible left sidebar.
    
*   Top header with page title/breadcrumbs.
    
*   Main content area.
    
*   User profile menu.
    
*   Notifications.
    
*   Global search where useful.
    

Sidebar navigation:

1.  Overview
    
2.  Personas
    
3.  Scenarios
    
4.  Simulations
    
5.  Live Conversations
    
6.  Reports
    
7.  Settings
    

Use active navigation states and role-based navigation where supported by backend permissions.

5\. Authentication
==================

Create a professional login page.

Features:

*   Email and password login.
    
*   Form validation.
    
*   Password visibility toggle.
    
*   Loading state.
    
*   API error handling.
    
*   Authentication persistence according to the backend's actual token/cookie strategy.
    
*   Logout.
    
*   Protected routes.
    

Do not invent authentication endpoints or token formats. Inspect the backend implementation and follow its actual contract.

Do not store sensitive tokens in localStorage if the backend uses secure HTTP-only cookies.

6\. Dashboard Overview
======================

Create an overview dashboard with operational metrics.

### Summary cards

Display:

*   Total simulations
    
*   Running simulations
    
*   Completed simulations
    
*   Failed simulations
    
*   Total conversations
    
*   Average conversation duration
    
*   Average customer satisfaction
    
*   Scenario success rate
    

Only display metrics that the backend can actually provide.

### Charts

Include:

1.  Simulations over time.
    
2.  Conversation volume over time.
    
3.  Scenario-wise success/failure.
    
4.  Customer sentiment distribution.
    
5.  Persona category distribution.
    
6.  Simulation status distribution.
    

### Recent activity

Show:

*   Recently created simulations.
    
*   Currently running simulations.
    
*   Recently completed conversations.
    
*   Failed simulations.
    
*   Recent system events.
    

### Quick actions

Provide actions for:

*   Create Persona
    
*   Create Scenario
    
*   Start Simulation
    
*   View Live Conversations
    

Dashboard data must come from real backend APIs. Do not hardcode production metrics.

7\. Persona Management
======================

Create a complete persona library.

### Persona list page

Display personas in a searchable, filterable table or card layout.

Show:

*   Persona name
    
*   Persona category
    
*   Personality
    
*   Communication style
    
*   Emotional baseline
    
*   Patience level
    
*   Cooperation level
    
*   Aggressiveness/assertiveness
    
*   Escalation tendency
    
*   Status
    
*   Last updated
    

Filters:

*   Persona category
    
*   Emotional state
    
*   Communication style
    
*   Active/inactive
    
*   Search by name
    

### Persona categories

Support categories provided by the backend, including:

*   Personality-based
    
*   Communication-based
    
*   Behaviour-based
    
*   Accessibility-based
    
*   Edge-case customers
    

### Persona creation and editing

Create a detailed persona form with logical sections.

**Section 1 — Basic information**

*   Persona name
    
*   Description
    
*   Category
    
*   Tags
    
*   Active/inactive status
    

**Section 2 — Personality**

*   Patience
    
*   Cooperation
    
*   Aggressiveness/assertiveness
    
*   Trust
    
*   Escalation tendency
    
*   Frustration sensitivity
    

Use sliders or numeric inputs with clear labels and descriptions.

**Section 3 — Communication behaviour**

*   Communication style
    
*   Language
    
*   Language proficiency
    
*   Message length
    
*   Formality
    
*   Emoji usage
    
*   Response delay
    

**Section 4 — Behaviour patterns**

*   Repetition tendency
    
*   Topic switching
    
*   Incomplete information
    
*   Contradictory information
    
*   Supervisor request tendency
    
*   Conversation abandonment tendency
    
*   Reconnection behaviour
    

**Section 5 — Emotional behaviour**

*   Initial emotional state
    
*   Emotion transition tendencies
    
*   Recovery behaviour
    
*   Frustration triggers
    

**Section 6 — Advanced configuration**

Expose only configuration fields supported by the backend schema.

Requirements:

*   Create persona.
    
*   Edit persona.
    
*   View persona details.
    
*   Activate/deactivate persona.
    
*   Duplicate persona if supported.
    
*   Delete persona with confirmation, if allowed.
    
*   Show validation errors.
    
*   Prevent invalid values.
    

Keep the form organized into sections or tabs. Do not overwhelm the user with one huge unstructured form.

8\. Scenario Management
=======================

Build a complete airline customer support scenario library.

### Scenario list page

Display:

*   Scenario name
    
*   Category
    
*   Difficulty
    
*   Description
    
*   Expected duration
    
*   Number of expected workflow steps
    
*   Status
    
*   Last updated
    

Filters:

*   Scenario category
    
*   Difficulty
    
*   Status
    
*   Search
    

### Initial scenario categories

Support these example scenarios:

1.  Flight cancellation
    
2.  Flight delay
    
3.  Refund request
    
4.  Baggage lost or delayed
    
5.  Booking modification
    
6.  Check-in issue
    
7.  Missed connection
    
8.  Payment failure
    

Treat these as seed examples, not a hardcoded limitation. The backend should remain the source of truth.

### Scenario creation form

Include:

**Basic information**

*   Scenario name
    
*   Description
    
*   Category
    
*   Difficulty
    
*   Tags
    
*   Active status
    

**Customer objective**

*   What the customer wants.
    
*   Expected resolution.
    
*   Customer constraints.
    
*   Expected interaction complexity.
    

**Scenario workflow**

*   Initial state.
    
*   Available states.
    
*   Allowed transitions.
    
*   Expected events.
    
*   Terminal states.
    

**Evaluation criteria**

*   Required workflow events.
    
*   Expected outcome.
    
*   Failure conditions.
    
*   Evaluation rules.
    

Use a clear workflow editor or structured transition editor. Avoid creating a complicated visual flowchart unless the backend supports the same representation.

The frontend must respect the backend scenario schema. Do not create a different state-machine model just for the UI.

9\. Create Simulation Wizard
============================

This is one of the most important screens.

Create a multi-step wizard to configure a new simulation.

### Step 1 — Select persona

*   Search persona library.
    
*   Filter by category.
    
*   Preview persona traits.
    
*   Select one persona.
    
*   Show a compact persona summary.
    

### Step 2 — Select scenario

*   Search scenarios.
    
*   Filter by category and difficulty.
    
*   Preview scenario description.
    
*   Show expected objective and workflow.
    
*   Select one scenario.
    

### Step 3 — Configure customer data

Allow users to select the fixture generation mode and inspect the fields the backend supports.

Examples:

*   Passenger name
    
*   Booking reference
    
*   Flight number
    
*   Departure airport
    
*   Arrival airport
    
*   Travel date
    
*   Booking status
    
*   Ticket status
    
*   Baggage reference
    

Important:

*   Use the backend fixture generator.
    
*   Do not generate booking facts independently in the frontend.
    
*   Clearly distinguish generated fixture data from manually configured data.
    
*   Show a preview before launching.
    
*   Do not allow users to alter immutable fixture facts during an active simulation unless the backend explicitly supports it.
    

### Step 4 — Simulation settings

Allow configuration of backend-supported settings:

*   Simulation name
    
*   Maximum turns
    
*   Maximum duration
    
*   Response delay
    
*   Simulation mode
    
*   CRM environment
    
*   Other supported execution options
    

### Step 5 — Review and launch

Display:

*   Selected persona
    
*   Selected scenario
    
*   Customer fixture preview
    
*   Simulation settings
    
*   CRM environment
    

Provide:

*   Back
    
*   Save draft, if supported
    
*   Start simulation
    

After launching:

*   Display confirmation.
    
*   Navigate to the simulation details page.
    
*   Show live execution status.
    

Prevent duplicate launches caused by repeated clicks or network retries. Follow backend idempotency support.

10\. Simulation Management
==========================

Create a simulation list page.

Columns:

*   Simulation name
    
*   Persona
    
*   Scenario
    
*   Status
    
*   Start time
    
*   End time
    
*   Conversation count
    
*   Evaluation status
    
*   Actions
    

Statuses:

*   Queued
    
*   Running
    
*   Paused, if supported
    
*   Completed
    
*   Failed
    
*   Cancelled
    

Features:

*   Search
    
*   Filters
    
*   Pagination
    
*   Sort
    
*   View details
    
*   Cancel simulation, if supported
    
*   Retry failed simulation, if supported
    

### Simulation details page

Display:

*   Simulation metadata.
    
*   Persona information.
    
*   Scenario information.
    
*   Customer fixture.
    
*   Current execution status.
    
*   Queue/job information where appropriate.
    
*   Conversation progress.
    
*   Workflow progress.
    
*   Evaluation summary.
    
*   Error details when execution fails.
    

Provide a clear timeline of simulation activity.

Never expose internal secrets, credentials, or sensitive queue configuration to ordinary users.

11\. Live Conversations
=======================

Create a real-time conversation monitoring interface.

This is a central feature of the application.

### Live conversation list

Display:

*   Conversation ID
    
*   Simulation name
    
*   Persona
    
*   Scenario
    
*   CRM chat/session identifier, if available
    
*   Assigned CRM agent, if available
    
*   Conversation status
    
*   Customer emotional state
    
*   Last message
    
*   Last activity time
    

Filters:

*   Running
    
*   Completed
    
*   Failed
    
*   Abandoned
    
*   Scenario
    
*   Persona
    
*   Customer emotional state
    
*   CRM agent
    

### Live conversation detail page

Use a three-panel layout.

**Left panel — Customer profile**

Display:

*   Persona name
    
*   Persona description
    
*   Personality traits
    
*   Communication style
    
*   Current emotional state
    
*   Patience
    
*   Cooperation
    
*   Trust
    
*   Escalation tendency
    
*   Scenario objective
    

Display both baseline and current emotional state when available.

**Center panel — Conversation**

Display a realistic chat interface.

Support:

*   Customer messages.
    
*   Agent messages.
    
*   System messages.
    
*   Timestamps.
    
*   Message sequence.
    
*   Message delivery status, if supported.
    
*   Loading/typing indicator when an event provides it.
    
*   Automatic scrolling with a pause option.
    
*   Historical message pagination.
    

Use distinct visual styles for:

*   AI customer
    
*   CRM agent
    
*   System events
    

Clearly identify the sender. Never display an AI-generated customer message as an actual human customer message without an explicit simulation label.

**Right panel — Simulation insights**

Display:

*   Current scenario state.
    
*   Customer intent.
    
*   Customer emotion.
    
*   Detected events.
    
*   Expected workflow steps.
    
*   Completed workflow steps.
    
*   Pending workflow steps.
    
*   Evaluation status.
    

All information must come from backend state or validated backend events.

### Real-time updates

Use Socket.IO to receive:

*   New conversation messages.
    
*   Conversation status changes.
    
*   Customer emotion updates.
    
*   Scenario state updates.
    
*   Simulation progress.
    
*   CRM agent assignment updates.
    
*   Workflow events.
    
*   Evaluation updates.
    

Requirements:

*   Handle connection and disconnection.
    
*   Reconnect safely.
    
*   Avoid duplicate messages.
    
*   Use message IDs or sequence numbers for deduplication.
    
*   Handle out-of-order events.
    
*   Fetch REST history after reconnect.
    
*   Do not assume Socket.IO events are permanently delivered.
    
*   Clean up listeners when components unmount.
    

Do not invent socket event names. Inspect the backend event contract and implement the actual event names and payloads.

12\. Conversation Details and Replay
====================================

Build a dedicated conversation inspection page.

Features:

*   Complete message history.
    
*   Event timeline.
    
*   Persona state changes.
    
*   Scenario state transitions.
    
*   CRM workflow events.
    
*   Evaluation results.
    
*   Conversation metadata.
    
*   Fixture data.
    
*   Error information.
    

### Replay mode

Allow users to inspect a completed conversation in chronological order.

Provide:

*   Play
    
*   Pause
    
*   Step forward
    
*   Step backward
    
*   Playback speed
    
*   Timeline navigation
    

Replay must use persisted conversation messages and events.

Do not regenerate messages using Gemini during replay.

Clearly distinguish replayed historical data from a currently running conversation.

13\. Reports and Analytics
==========================

Build a reporting dashboard.

### Simulation reports

Include:

*   Total simulations.
    
*   Completion rate.
    
*   Failure rate.
    
*   Average execution duration.
    
*   Average conversation duration.
    
*   Scenario success rate.
    

### Persona reports

Show:

*   Most frequently used personas.
    
*   Persona-wise completion rate.
    
*   Persona-wise conversation duration.
    
*   Persona-wise behavioural consistency.
    

### Scenario reports

Show:

*   Scenario-wise success rate.
    
*   Scenario failure rate.
    
*   Average resolution time.
    
*   Common workflow failures.
    
*   Expected versus actual events.
    

### Conversation evaluation

Display separate evaluation dimensions:

1.  CRM workflow correctness.
    
2.  Scenario completion.
    
3.  Persona consistency.
    
4.  Customer satisfaction, where validated.
    
5.  Conversation quality.
    

Do not combine unrelated scores into one unexplained score.

### Filters

*   Date range.
    
*   Persona.
    
*   Scenario.
    
*   Simulation status.
    
*   CRM agent, where available.
    

### Export

Support CSV export if the backend provides it or implement a safe client-side export from authorized report data.

Do not fabricate report metrics.

14\. Settings
=============

Create a settings section for supported application configuration.

Possible sections:

*   User profile.
    
*   Theme preferences.
    
*   Notification preferences.
    
*   CRM environment configuration display.
    
*   Simulator configuration display.
    
*   Integration health.
    
*   Application information.
    

Sensitive integration credentials must never be exposed in the browser.

Do not allow arbitrary CRM URLs. Display the configured environment and enforce backend-side allowlisting.

15\. API Integration
====================

Use RTK Query for all REST API calls.

Create a shared API configuration in:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   src/services/api.ts   `

Use feature-specific API files:

*   authApi.ts
    
*   dashboardApi.ts
    
*   personaApi.ts
    
*   scenarioApi.ts
    
*   simulationApi.ts
    
*   conversationApi.ts
    
*   reportApi.ts
    

Requirements:

*   Centralized base URL from environment variables.
    
*   Authentication handling matching backend implementation.
    
*   Standardized error handling.
    
*   Loading and success states.
    
*   Cache invalidation.
    
*   Pagination.
    
*   Query parameters.
    
*   Proper TypeScript response types.
    

Do not guess endpoint URLs.

First inspect the simulator backend routes, controllers, validators, and response structures. Build frontend API functions against the actual implementation.

If an API is not implemented yet, document the missing contract and use a clearly separated development mock. Do not silently treat mock data as live backend data.

16\. Socket.IO Integration
==========================

Create a centralized Socket.IO client:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   src/services/socket.ts   `

Requirements:

*   Connect after authentication.
    
*   Use the backend's real authentication mechanism.
    
*   Handle reconnect.
    
*   Handle connection errors.
    
*   Subscribe to authorized rooms.
    
*   Unsubscribe and disconnect appropriately.
    
*   Prevent duplicate listeners.
    
*   Expose typed events.
    
*   Keep socket logic out of presentation components.
    

Use a shared event contract with the backend where practical.

17\. State Management
=====================

Use Redux Toolkit.

Recommended approach:

*   RTK Query for server data and caching.
    
*   Redux slices only for genuine client-side state.
    
*   Local component state for temporary form and UI interactions.
    

Do not duplicate API response data in Redux slices.

Do not use Redux for every input field.

Persist only necessary client-side preferences and authentication state according to the security model.

18\. TypeScript and Validation
==============================

Create shared TypeScript types for:

*   User
    
*   Persona
    
*   Scenario
    
*   Simulation
    
*   Conversation
    
*   ConversationMessage
    
*   ConversationEvent
    
*   CustomerFixture
    
*   EvaluationResult
    
*   DashboardMetrics
    
*   API responses
    
*   Socket events
    

Use strict TypeScript configuration.

Use Zod and React Hook Form for form validation.

Keep frontend types aligned with backend schemas.

Do not use any to bypass typing. Use unknown and validate when data is uncertain.

19\. User Experience Requirements
=================================

Every page must support:

*   Loading state.
    
*   Empty state.
    
*   Error state.
    
*   Success feedback.
    
*   Form validation.
    
*   Responsive layout.
    
*   Accessible labels.
    
*   Keyboard navigation.
    
*   Confirmation for destructive actions.
    

Additional requirements:

*   No dead buttons.
    
*   No placeholder navigation links.
    
*   No fake charts presented as real metrics.
    
*   No hardcoded production personas or conversations.
    
*   No infinite loading when an API fails.
    
*   No silent API errors.
    
*   No duplicate Socket.IO messages.
    
*   No horizontal overflow on normal desktop layouts.
    
*   No unnecessary page reloads.
    

Use skeleton loaders for data-heavy pages where appropriate.

Use toast notifications for important actions.

20\. Security
=============

*   Protect private routes.
    
*   Respect backend roles and permissions.
    
*   Never expose Gemini API keys.
    
*   Never expose CRM credentials.
    
*   Do not allow the browser to connect directly to MongoDB or Redis.
    
*   Do not allow arbitrary external CRM endpoints.
    
*   Validate all user input.
    
*   Sanitize user-visible content.
    
*   Avoid rendering untrusted HTML.
    
*   Do not expose internal stack traces.
    
*   Clearly label simulated customer conversations.
    
*   Make simulation environment visible before launch.
    

Frontend security must complement, not replace, backend authorization and validation.

21\. Development and Integration Rules
======================================

Before implementation:

1.  Inspect the existing simulator backend.
    
2.  Inspect its models, routes, controllers, services, validators, and middleware.
    
3.  Identify the actual REST API contracts.
    
4.  Identify the actual Socket.IO events and payloads.
    
5.  Identify authentication and role-based permissions.
    
6.  Identify fields supported by Persona and Scenario models.
    
7.  Identify simulation lifecycle and conversation persistence behaviour.
    

Then implement the frontend against those contracts.

If the backend is incomplete:

*   Create a clear integration checklist.
    
*   Use mock services only for missing contracts.
    
*   Keep mock and real implementations separate.
    
*   Make it easy to replace mocks with real API calls.
    
*   Never invent backend functionality and claim it is integrated.
    

Do not modify backend architecture merely to make the frontend easier.

22\. Testing
============

Add tests for:

*   Login and protected routes.
    
*   Persona form validation.
    
*   Scenario form validation.
    
*   Simulation creation wizard.
    
*   API error handling.
    
*   Socket.IO reconnect behaviour.
    
*   Duplicate message prevention.
    
*   Conversation history rendering.
    
*   Report filters.
    
*   Role-based navigation.
    

Use appropriate testing tools such as Vitest and React Testing Library.

Run:

*   TypeScript type checking.
    
*   ESLint.
    
*   Production build.
    
*   Automated tests.
    

Fix errors introduced by your implementation.

Report existing warnings separately.

23\. Environment Configuration
==============================

Create .env.example:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   VITE_API_BASE_URL=http://localhost:5000/api/v1  VITE_SOCKET_URL=http://localhost:5000  VITE_APP_NAME=Airline AI Simulator   `

These are examples only. Match the actual backend port, API prefix, and Socket.IO configuration after inspecting the backend.

Never put private secrets in Vite environment variables.

24\. Implementation Phases
==========================

Implement in this order:

### Phase 1 — Foundation

*   Initialize React + Vite + TypeScript.
    
*   Configure Tailwind.
    
*   Configure routing.
    
*   Configure Redux Toolkit.
    
*   Configure RTK Query.
    
*   Build the design system.
    
*   Build the application layout.
    

### Phase 2 — Authentication and dashboard

*   Login.
    
*   Protected routes.
    
*   Role-aware navigation.
    
*   Dashboard metrics.
    
*   Charts and recent activity.
    

### Phase 3 — Persona and scenario management

*   Persona listing.
    
*   Persona creation/editing.
    
*   Scenario listing.
    
*   Scenario creation/editing.
    
*   Details pages.
    

### Phase 4 — Simulation management

*   Simulation wizard.
    
*   Simulation listing.
    
*   Simulation details.
    
*   Execution status.
    

### Phase 5 — Real-time conversations

*   Socket.IO integration.
    
*   Live conversation list.
    
*   Live conversation detail.
    
*   Customer profile.
    
*   Event timeline.
    

### Phase 6 — Replay and reporting

*   Conversation replay.
    
*   Evaluation display.
    
*   Reports.
    
*   Analytics.
    
*   Export.
    

### Phase 7 — Quality and integration

*   Security review.
    
*   Responsive testing.
    
*   API integration verification.
    
*   Socket reconnection testing.
    
*   Type checking.
    
*   Linting.
    
*   Production build.
    
*   Automated tests.
    

25\. Definition of Done
=======================

The frontend is complete only when:

*   All listed pages are implemented.
    
*   Navigation works.
    
*   Authentication works with the real backend.
    
*   Persona CRUD works with the real backend.
    
*   Scenario CRUD works with the real backend.
    
*   Simulations can be created and launched.
    
*   Simulation status updates correctly.
    
*   Live conversations receive real-time updates.
    
*   Messages are not duplicated after reconnect.
    
*   Conversation history loads from persisted backend data.
    
*   Conversation replay uses stored messages and events.
    
*   Reports display real backend metrics.
    
*   API errors and empty states are handled.
    
*   Responsive layouts work.
    
*   TypeScript checks pass.
    
*   Production build succeeds.
    
*   Tests pass or remaining failures are explicitly documented.
    

FINAL INSTRUCTIONS
==================

Build the actual frontend, not just a design mockup or static prototype.

Use the exact folder structure as the starting point.

Prioritize a polished, professional, consistent enterprise UI.

Keep components reusable and business logic separated from UI components.

Use real backend API contracts wherever available.

Do not invent API endpoints, socket event names, response fields, database behaviour, or permissions.

Do not modify the existing International Airline CRM frontend.

The simulator frontend must remain independently deployable and communicate with the simulator backend through its documented APIs and Socket.IO events.

Start by inspecting the workspace and backend. Then implement the frontend phase by phase, verifying each phase before moving to the next.

At completion, provide:

1.  Final folder structure.
    
2.  Implemented pages and features.
    
3.  API endpoints integrated.
    
4.  Socket.IO events integrated.
    
5.  Environment setup instructions.
    
6.  Commands to run locally.
    
7.  Build and test results.
    
8.  Any remaining backend integration gaps.
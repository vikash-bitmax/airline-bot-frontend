// Authentic Airmail Boarding Pass & Aviation Design Tokens (Matching CRM Frontend)
export const airmailTokens = {
  light: {
    canvas: '#cad6d6', // Aeronautical Slate Mist (Dotted Canvas)
    canvasDot: '#b5c4c4',
    surface: '#fbf8ee', // Warm Vintage Boarding Pass Cream
    surfaceElevated: '#f5f0e1', // Sub-cards / Headers
    surfaceInput: '#ffffff', // Clean Ticket Field Inset
    surfaceInputActive: '#edf4fe', // Active Field Airmail Blue Wash
    borderSubtle: '#e6e0d0', // Ticket Borders & Tear Lines
    borderActive: '#b93838',
    primary: '#b93838', // Aviation Brick Crimson (Primary CTA)
    primaryHover: '#a12e2a',
    airmailRed: '#b93838', // Airmail Chevron Red
    airmailBlue: '#2563eb', // Airmail Chevron Blue
    routeNavy: '#1e293b', // Deep Slate
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
    status: {
      operational: '#15803d', // Green
      operationalBg: '#dcfce7',
      warning: '#b45309',
      critical: '#b91c1c',
      info: '#1d4ed8',
    },
  },
  dark: {
    canvas: '#070c16', // Deep Night Flight Void
    canvasDot: 'rgba(255, 255, 255, 0.08)',
    surface: '#0c1524', // Cockpit Dark Navy Boarding Pass
    surfaceElevated: '#111d31', // Sub-cards
    surfaceInput: '#09101d', // Dark Inset Fields
    surfaceInputActive: '#132238', // Active Field Dark Inset
    borderSubtle: 'rgba(255, 255, 255, 0.12)',
    borderActive: '#e11d48',
    primary: '#e11d48', // Night Operations Crimson
    primaryHover: '#c02636',
    airmailRed: '#e11d48',
    airmailBlue: '#38bdf8',
    routeNavy: '#f8fafc',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    status: {
      operational: '#10b981',
      operationalBg: 'rgba(16, 185, 129, 0.15)',
      warning: '#f59e0b',
      critical: '#ef4444',
      info: '#38bdf8',
    },
  },
};

export const MONO_FONT = "'IBM Plex Mono', 'JetBrains Mono', 'Roboto Mono', Consolas, monospace";

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sun, Moon, LogOut, Radio, User } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks.js';
import { logout } from '../../features/auth/authSlice.js';
import socketService from '../../services/socket.js';

export const Header = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('skywings_sim_theme') === 'dark';
  });

  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('skywings_sim_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  useEffect(() => {
    const checkSocket = () => {
      setSocketConnected(Boolean(socketService.socket?.connected));
    };

    const unsubConnect = socketService.on('connect', () => setSocketConnected(true));
    const unsubDisconnect = socketService.on('disconnect', () => setSocketConnected(false));
    checkSocket();

    return () => {
      unsubConnect && unsubConnect();
      unsubDisconnect && unsubDisconnect();
    };
  }, []);

  const getPageTitle = (pathname) => {
    if (pathname === '/' || pathname === '/monitoring') return 'Mission Control & Monitoring';
    if (pathname.startsWith('/library')) return 'Persona & Scenario Library';
    if (pathname.startsWith('/personas/create')) return 'Create AI Passenger Persona';
    if (pathname.startsWith('/personas')) return 'AI Passenger Persona Details';
    if (pathname.startsWith('/scenarios/create')) return 'Create Disruption Scenario';
    if (pathname.startsWith('/scenarios')) return 'Disruption Scenario Details';
    if (pathname.startsWith('/simulations/create')) return 'Launch Simulation Wizard';
    if (pathname.startsWith('/simulations')) return 'Active Simulations Manifest';
    if (pathname.startsWith('/conversations')) return 'Live Simulated Customer Stream';
    if (pathname.startsWith('/settings')) return 'Simulator Engine Settings';
    return 'Simulator Dashboard';
  };

  return (
    <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 bg-[var(--surface-ticket)] border-b border-[var(--border-subtle)] sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-bold text-[var(--text-main)] mono-font">
          {getPageTitle(location.pathname)}
        </h2>
        <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 mono-font">
          LOCAL DEV CLUSTER
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Socket telemetry badge */}
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mono-font px-2 py-1 rounded bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)]">
          <span
            className={`w-2 h-2 rounded-full ${
              socketConnected ? 'bg-emerald-500' : 'bg-red-500 animate-pulse'
            }`}
          />
          <span className="hidden md:inline">
            {socketConnected ? 'TELEMETRY LIVE' : 'CONNECTING WS'}
          </span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          title="Toggle Light / Cockpit Dark Theme"
          className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--surface-ticket-elevated)] transition-colors border border-transparent hover:border-[var(--border-subtle)] cursor-pointer"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* User Badge & Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-[var(--border-subtle)]">
          <div className="hidden lg:block text-right">
            <div className="text-xs font-bold text-[var(--text-main)] mono-font leading-tight">
              {user?.name || 'Simulator Admin'}
            </div>
            <div className="text-[10px] text-[var(--text-muted)] font-mono">
              {user?.role || 'QA_LEAD'}
            </div>
          </div>
          <button
            onClick={() => dispatch(logout())}
            title="Sign Out"
            className="p-2 rounded-lg text-[var(--text-muted)] hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;

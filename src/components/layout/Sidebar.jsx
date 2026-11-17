import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Radio,
  Users,
  Compass,
  PlayCircle,
  MessagesSquare,
  BarChart3,
  Settings,
  Plane,
  Send,
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/', label: 'Monitoring', icon: Radio },
  { path: '/simulations', label: 'Simulations', icon: PlayCircle },
  { path: '/conversations', label: 'Live Conversations', icon: MessagesSquare },
  { path: '/personas', label: 'Persona Library', icon: Users },
  { path: '/scenarios', label: 'Scenario Library', icon: Compass },
  { path: '/reports', label: 'Reports & Analytics', icon: BarChart3 },
  { path: '/settings', label: 'Simulator Settings', icon: Settings },
];

export const Sidebar = ({ onOpenQueryModal }) => {
  return (
    <aside className="w-64 flex-shrink-0 flex flex-col justify-between bg-[var(--surface-ticket)] border-r border-[var(--border-subtle)] h-screen sticky top-0 select-none">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--surface-ticket-elevated)]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[var(--accent-primary)] text-white flex items-center justify-center shadow-xs">
              <Plane className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-[var(--text-main)] mono-font">
                  SKYWINGS
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-[var(--accent-primary)] text-white">
                  SIM
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] font-mono">
                AI Passenger Simulator
              </p>
            </div>
          </div>
        </div>

        {/* Quick Launch CTA Button */}
        <div className="p-3">
          <button
            onClick={onOpenQueryModal}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white shadow-xs transition-colors mono-font cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            ⚡ Raise Query to CRM
          </button>
        </div>

        {/* Navigation List */}
        <nav className="p-2 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => {
                  const isCurrentActive =
                    isActive || (item.path === '/' && (window.location.pathname === '/' || window.location.pathname === '/monitoring'));
                  return `flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-lg transition-colors mono-font ${
                    isCurrentActive
                      ? 'bg-[var(--surface-input-active)] text-[var(--accent-primary)] border-l-4 border-[var(--accent-primary)] shadow-2xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--surface-ticket-elevated)]'
                  }`;
                }}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Simulator Telemetry / Footer status */}
      <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--surface-ticket-elevated)] text-[11px] text-[var(--text-muted)] mono-font space-y-1">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Simulator Engine
          </span>
          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">PORT 5050</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Target CRM</span>
          <span className="text-[var(--text-main)]">PORT 5000</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

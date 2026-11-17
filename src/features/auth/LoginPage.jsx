import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, Lock, Mail, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAppDispatch } from '../../app/hooks.js';
import { setCredentials } from './authSlice.js';

export const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('ops@skywings.aero');
  const [apiKey, setApiKey] = useState('sim-auth-dev-key');
  const [role, setRole] = useState('ADMIN');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      dispatch(
        setCredentials({
          token: apiKey,
          user: {
            name: email.split('@')[0].toUpperCase(),
            email,
            role,
          },
        })
      );
      setIsLoading(false);
      navigate('/');
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--bg-canvas)]">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-xl">
        <div className="airmail-stripe-top" />

        <div className="p-8">
          {/* Brand Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-[var(--accent-primary)] text-white flex items-center justify-center shadow-xs">
              <Plane className="w-6 h-6 -rotate-45" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-[var(--text-main)] mono-font tracking-tight">
                  SKYWINGS
                </h1>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-[var(--accent-primary)] text-white">
                  DISPATCH
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                AI Customer Simulation Platform
              </p>
            </div>
          </div>

          <div className="mb-6 p-3 rounded-lg bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] leading-relaxed">
            Authenticated console for testing and validating airline customer support operations against live or simulated CRM agents.
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mono-font mb-1.5">
                Staff Email / Call Sign
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[var(--text-dim)]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] mono-font focus:outline-none focus:border-[var(--accent-primary)]"
                  placeholder="name@skywings.aero"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mono-font mb-1.5">
                Simulator Security Token / API Key
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[var(--text-dim)]" />
                <input
                  type="password"
                  required
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] mono-font focus:outline-none focus:border-[var(--accent-primary)]"
                  placeholder="Enter API key"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-[var(--text-muted)] mono-font mb-1.5">
                Role Profile
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] mono-font"
              >
                <option value="ADMIN">ADMIN / QA LEAD</option>
                <option value="SUPERVISOR">FLIGHT OPERATIONS SUPERVISOR</option>
                <option value="TESTER">SYSTEM INTEGRATION TESTER</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white text-xs font-bold uppercase tracking-wider mono-font transition-colors shadow-xs cursor-pointer"
            >
              {isLoading ? (
                'Verifying Clearances...'
              ) : (
                <>
                  <span>Enter Mission Control</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-[10px] text-[var(--text-dim)] mono-font">
            SkyWings Autonomous Simulation Environment • Fail-Closed Production Guard
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

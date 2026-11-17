import React from 'react';

const STATUS_CONFIGS = {
  RUNNING: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800', dot: 'bg-emerald-500 animate-pulse', label: 'ACTIVE / RUNNING' },
  ACTIVE: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800', dot: 'bg-emerald-500 animate-pulse', label: 'ACTIVE' },
  COMPLETED: { bg: 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800', dot: 'bg-blue-500', label: 'COMPLETED' },
  CONCLUDED: { bg: 'bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800', dot: 'bg-blue-500', label: 'CONCLUDED' },
  PENDING: { bg: 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800', dot: 'bg-amber-500', label: 'QUEUED' },
  QUEUED: { bg: 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800', dot: 'bg-amber-500', label: 'QUEUED' },
  PAUSED: { bg: 'bg-yellow-50 text-yellow-800 border-yellow-300 dark:bg-yellow-950/40 dark:text-yellow-400 dark:border-yellow-800', dot: 'bg-yellow-500', label: 'PAUSED' },
  FAILED: { bg: 'bg-red-50 text-red-700 border-red-300 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800', dot: 'bg-red-500', label: 'FAILED' },
  CANCELLED: { bg: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700', dot: 'bg-slate-400', label: 'CANCELLED' },
  ABANDONED: { bg: 'bg-orange-50 text-orange-700 border-orange-300 dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-800', dot: 'bg-orange-500', label: 'ABANDONED' },
  NEW: { bg: 'bg-cyan-50 text-cyan-700 border-cyan-300 dark:bg-cyan-950/40 dark:text-cyan-400 dark:border-cyan-800', dot: 'bg-cyan-500', label: 'NEW INQUIRY' },
  WAITING: { bg: 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800', dot: 'bg-amber-500', label: 'WAITING IN QUEUE' },
  ESCALATED: { bg: 'bg-purple-50 text-purple-700 border-purple-300 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800', dot: 'bg-purple-500', label: 'ESCALATED (TL/SUP)' },
  TRANSFERRED: { bg: 'bg-indigo-50 text-indigo-700 border-indigo-300 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800', dot: 'bg-indigo-500', label: 'TRANSFERRED' },
  RESOLVED: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800', dot: 'bg-emerald-500', label: 'RESOLVED' },
  CLOSED: { bg: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700', dot: 'bg-slate-400', label: 'CLOSED' },
};

export const StatusBadge = ({ status = 'PENDING', className = '' }) => {
  const normalized = String(status).toUpperCase();
  const config = STATUS_CONFIGS[normalized] || {
    bg: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-400',
    dot: 'bg-slate-400',
    label: normalized,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border mono-font ${config.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

export default StatusBadge;

import React from 'react';

export const StatCard = ({
  title,
  value,
  subvalue,
  icon: Icon,
  trend,
  color = 'crimson',
}) => {
  const colorMap = {
    crimson: 'text-[var(--accent-primary)] bg-[var(--surface-ticket-elevated)] border-[var(--accent-primary)]/20',
    blue: 'text-[var(--airmail-blue)] bg-blue-50/60 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
    emerald: 'text-emerald-700 bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
    amber: 'text-amber-700 bg-amber-50/60 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
    navy: 'text-[var(--route-navy)] bg-slate-100/60 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
  };

  const selectedColor = colorMap[color] || colorMap.crimson;

  return (
    <div className="relative overflow-hidden rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] p-5 shadow-sm hover:shadow-md transition-shadow">
      {/* Top Airmail accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[var(--accent-primary)] opacity-80" />

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mono-font">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[var(--text-main)] mono-font tracking-tight">
              {value}
            </span>
            {subvalue && (
              <span className="text-xs text-[var(--text-muted)] font-medium">
                {subvalue}
              </span>
            )}
          </div>
          {trend && (
            <p className="mt-2 text-xs text-[var(--text-muted)] flex items-center gap-1">
              {trend}
            </p>
          )}
        </div>

        {Icon && (
          <div className={`p-3 rounded-lg border ${selectedColor}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;

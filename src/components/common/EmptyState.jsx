import React from 'react';
import { PlaneTakeoff } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = PlaneTakeoff,
  title = 'No Records Found',
  description = 'No matching simulation records or entities exist for the current filter criteria.',
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center rounded-xl bg-[var(--surface-ticket)] border border-dashed border-[var(--border-subtle)] ${className}`}>
      <div className="p-4 mb-4 rounded-full bg-[var(--surface-ticket-elevated)] text-[var(--accent-primary)] border border-[var(--border-subtle)]">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-[var(--text-main)] mono-font">
        {title}
      </h3>
      <p className="mt-1 max-w-sm text-sm text-[var(--text-muted)]">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

export default EmptyState;

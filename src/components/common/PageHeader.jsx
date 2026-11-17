import React from 'react';

export const PageHeader = ({
  title,
  subtitle,
  badge,
  actions,
  className = '',
}) => {
  return (
    <div className={`mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-[var(--border-subtle)] ${className}`}>
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">
            {title}
          </h1>
          {badge && (
            <span className="text-xs px-2.5 py-0.5 rounded font-mono font-medium bg-[var(--surface-ticket-elevated)] border border-[var(--border-subtle)] text-[var(--accent-primary)]">
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3 flex-wrap">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;

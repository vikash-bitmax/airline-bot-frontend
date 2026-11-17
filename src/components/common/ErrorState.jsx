import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const ErrorState = ({
  title = 'Telemetry Disruption',
  message = 'An unexpected failure occurred while requesting the simulation flight manifest.',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center rounded-xl bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-900 ${className}`}>
      <div className="p-3 mb-3 rounded-full bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-red-800 dark:text-red-300 mono-font">
        {title}
      </h3>
      <p className="mt-1 max-w-md text-sm text-red-700 dark:text-red-400">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-primary-hover)] transition-colors mono-font"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Connection
        </button>
      )}
    </div>
  );
};

export default ErrorState;

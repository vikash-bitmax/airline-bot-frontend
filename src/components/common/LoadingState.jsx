import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState = ({
  message = 'Loading flight simulation telemetry...',
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] ${className}`}>
      <Loader2 className="w-8 h-8 text-[var(--accent-primary)] animate-spin mb-3" />
      <p className="text-sm font-medium text-[var(--text-muted)] mono-font">
        {message}
      </p>
    </div>
  );
};

export default LoadingState;

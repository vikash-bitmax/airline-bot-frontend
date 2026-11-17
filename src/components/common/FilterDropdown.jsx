import React from 'react';
import { Filter } from 'lucide-react';

export const FilterDropdown = ({
  value,
  onChange,
  options = [],
  placeholder = 'All Categories',
  className = '',
}) => {
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-3 pr-8 py-2 text-sm bg-[var(--surface-input)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-primary)] cursor-pointer transition-colors mono-font"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value || opt} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
      <Filter className="absolute right-2.5 w-3.5 h-3.5 text-[var(--text-muted)] pointer-events-none" />
    </div>
  );
};

export default FilterDropdown;

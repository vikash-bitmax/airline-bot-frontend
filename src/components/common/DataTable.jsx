import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const DataTable = ({
  columns = [],
  data = [],
  keyField = 'id',
  onRowClick,
  isLoading = false,
  emptyMessage = 'No manifest data available.',
  page = 1,
  totalPages = 1,
  onPageChange,
  className = '',
}) => {
  return (
    <div className={`overflow-hidden rounded-xl bg-[var(--surface-ticket)] border border-[var(--border-subtle)] shadow-sm ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface-ticket-elevated)]">
              {columns.map((col) => (
                <th
                  key={col.key || col.header}
                  className={`px-4 py-3 text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mono-font ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)] text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-[var(--text-muted)] mono-font">
                  Scanning manifest records...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-[var(--text-muted)] mono-font">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, idx) => {
                const rowKey = row[keyField] || idx;
                return (
                  <tr
                    key={rowKey}
                    onClick={() => onRowClick && onRowClick(row)}
                    className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-[var(--surface-input-active)]' : 'hover:bg-[var(--surface-ticket-elevated)]/50'}`}
                  >
                    {columns.map((col) => (
                      <td
                        key={`${rowKey}-${col.key || col.header}`}
                        className={`px-4 py-3 text-[var(--text-main)] ${col.cellClassName || ''}`}
                      >
                        {col.render ? col.render(row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--border-subtle)] bg-[var(--surface-ticket-elevated)]">
          <span className="text-xs text-[var(--text-muted)] mono-font">
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={page <= 1}
              onClick={() => onPageChange && onPageChange(page - 1)}
              className="p-1 rounded text-[var(--text-main)] disabled:opacity-30 hover:bg-[var(--surface-ticket)] border border-transparent hover:border-[var(--border-subtle)]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => onPageChange && onPageChange(page + 1)}
              className="p-1 rounded text-[var(--text-main)] disabled:opacity-30 hover:bg-[var(--surface-ticket)] border border-transparent hover:border-[var(--border-subtle)]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;

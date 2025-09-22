'use client';

import React, { useState, useRef } from 'react';
import { TextInput } from '@/components/ui/form/base-component/text-input';
import Dropdown, { DropdownOption } from '@/components/ui/form/base-component/dropdown';
import icons, { RangeFilterIcon } from '@/components/icons';
import { ESortDirection } from '@/model/common/sortDirection';
import { SortParam } from './datal-list-view';

export interface Column<T> {
  key: keyof T; // Đảm bảo key là keyof T
  label: string;
  minWidth?: string;
  maxWidth?: string;
  width?: string;
  truncate?: boolean;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  filter?: ColumnFilter;
  className?: string;
  condition?: boolean;
  isWhenDetail?: boolean;
  align?: 'left' | 'center' | 'right';
}

export interface ColumnFilter {
  filterType?: 'text' | 'dropdown' | 'range' | 'date-range';
  filterOptions?: { label: string; value: string }[];
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey?: (row: T, index: number) => string | number;
  hoverable?: boolean;
  dense?: boolean;
  onRowClick?: (row: T) => void;
  onFilterChange?: (filters: Record<string, string | { from?: string; to?: string; }>) => void; // filter for value or range
  onSortChange?: (sort: { key: keyof T; direction: ESortDirection } | undefined) => void;
  loading?: boolean;
  sort?: SortParam<T> | undefined;
  emptyState: React.ReactNode
}

function Table<T>({
  columns,
  data,
  rowKey,
  hoverable = false,
  dense = false,
  onRowClick,
  onFilterChange,
  onSortChange,
  loading = false,
  sort,
  emptyState,
}: TableProps<T>) {
  const [filters, setFilters] = useState<Record<string, string | { from?: string; to?: string; }>>({});
  const [visibleFilters, setVisibleFilters] = useState<Record<string, boolean>>({});
  const debounceRef = useRef<Record<string, NodeJS.Timeout>>({});

  const handleSort = (key: keyof T) => {
    let newConfig: typeof sort = undefined;
    if (!sort || sort.key !== key) {
      newConfig = { key, direction: ESortDirection.ASC };
    } else if (sort.direction === ESortDirection.ASC) {
      newConfig = { key, direction: ESortDirection.DESC };
    }
    onSortChange?.(newConfig);
  };

  // Xử lý thay đổi filters in cho dropdown và text input in columns
  const handleFilterChange = (key: string, value: string | { from?: string; to?: string; }) => {
    setFilters((prev) => {
      const updated = { ...prev, [key]: value };

      if (debounceRef.current[key]) {
        clearTimeout(debounceRef.current[key]);
      }

      debounceRef.current[key] = setTimeout(() => {
        onFilterChange?.(updated);
      }, 300);

      return updated;
    });
  };

  // Toggle hiển thị filter dropdown o clumn
  const toggleFilter = (key: string) => {
    setVisibleFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Không filter/sort local nữa => chỉ render data từ props
  const displayData = data;

  return (
    <div className="overflow-visible rounded-lg shadow-md">
      <table className="min-w-full bg-background">
        <thead>
          <tr>
            {columns.filter((col) => col.condition !== false).map((col, index) => (
              <th
                key={index}
                className={`${dense ? 'py-2 px-3' : 'py-3 px-4'} border-b border-border bg-background-surface text-sm font-semibold text-text-primary uppercase tracking-wider select-none`}
                style={{
                  minWidth: col.minWidth,
                  maxWidth: col.maxWidth,
                  width: col.width,
                  textAlign: col.align || 'left',
                }}
              >
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center justify-between">
                    {col.label}
                    <div className="flex items-center space-x-1">
                      {col.sortable && (
                        <span
                          className="ml-1 text-xs text-neutral-400 cursor-pointer"
                          onClick={() => handleSort(col.key)}
                        >
                          {sort?.key === col.key
                            ? sort.direction === 'asc'
                              ? '▲'
                              : '▼'
                            : '⇅'}
                        </span>
                      )}
                      {col.filter && (
                        <button
                          className="ml-1 text-xs text-neutral-400 hover:text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFilter(String(col.key));
                          }}
                        >
                          {
                            col.filter.filterType === 'dropdown'
                              ? icons.filter // Biểu tượng cho dropdown
                              : col.filter.filterType === 'date-range' || col.filter.filterType === 'range'
                                ? RangeFilterIcon
                                : icons.search
                          }
                        </button>
                      )}
                    </div>
                  </div>
                  {col.filter && visibleFilters[String(col.key)] && (
                    <>
                      {col.filter.filterType === 'dropdown' && col.filter.filterOptions ? (
                        <Dropdown
                          placeholder="All"
                          size="sm"
                          options={col.filter.filterOptions}
                          onChange={(val) => handleFilterChange(String(col.key), val)}
                        />
                      ) : col.filter.filterType === 'range' ? (
                        <div className="flex gap-1">
                          <TextInput
                            size="sm"
                            type="number"
                            placeholder="Min"
                            value={(filters[String(col.key)] as { from: string })?.from || ''}
                            onChange={(val) => {
                              const currentFilter = (filters[String(col.key)] || {}) as { from?: string; to?: string; };
                              handleFilterChange(String(col.key), { from: val, to: currentFilter.to });
                            }}
                          />
                          <TextInput
                            size="sm"
                            type="number"
                            placeholder="Max"
                            value={(filters[String(col.key)] as { to: string })?.to || ''}
                            onChange={(val) => {
                              const currentFilter = (filters[String(col.key)] || {}) as { from?: string; to?: string; };
                              handleFilterChange(String(col.key), { from: currentFilter.from, to: val });
                            }}
                          />
                        </div>
                      ) : col.filter.filterType === 'date-range' ? (
                        <div className="flex gap-1">
                          <TextInput
                            size="sm"
                            type="date"
                            placeholder="From"
                            value={(filters[String(col.key)] as { from: string })?.from || ''}
                            // value={filters[String(col.key)]?.split(',')[0] || ''}
                            onChange={(val) => {
                              const currentFilter = (filters[String(col.key)] || {}) as { from?: string; to?: string; };
                              handleFilterChange(String(col.key), { from: val, to: currentFilter.to });
                            }}
                          />
                          <TextInput
                            size="sm"
                            type="date"
                            placeholder="To"
                            value={(filters[String(col.key)] as { to: string })?.to || ''}
                            // value={filters[String(col.key)]?.split(',')[1] || ''}
                            onChange={(val) => {
                              const currentFilter = (filters[String(col.key)] || {}) as { from?: string; to?: string; };
                              handleFilterChange(String(col.key), { from: currentFilter.from, to: val });
                            }}
                          />
                        </div>
                      ) : (
                        <TextInput
                          size="sm"
                          placeholder="Search"
                          value={filters[String(col.key)] as string || ''}
                          onChange={(val) => handleFilterChange(String(col.key), val)}
                        />
                      )}
                    </>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4">
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-4">
                {emptyState ? emptyState : <div className="text-center">No data available</div>}
              </td>
            </tr>
          ) : (
            displayData.map((row, rowIndex) => (
              <tr
                key={rowKey ? rowKey(row, rowIndex) : rowIndex}
                onClick={() => { onRowClick?.(row) }}
                className={`${hoverable ? 'hover:bg-card' : ''} ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {columns
                  .filter((col) => col.condition !== false)
                  .map((col, colIndex) => {
                    const value = (row as any)[col.key];
                    const cellContent = col.render ? col.render(row) : value;
                    return (
                      <td
                        key={colIndex}
                        className={`${dense ? 'py-2 px-3' : 'py-3 px-4'} border-b border-border text-sm text-text-secondary`}
                        style={{
                          minWidth: col.minWidth,
                          maxWidth: col.maxWidth,
                          width: col.width,
                          textAlign: col.align || 'left',
                        }}
                      >
                        {col.truncate ? (
                          <div className="truncate" title={String(value)}>
                            {cellContent}
                          </div>
                        ) : (
                          cellContent
                        )}
                      </td>
                    );
                  })}
              </tr>
            )))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;

'use client';

import React, { useState, useRef } from 'react';
import Card from '@/components/ui/Card';
import { TextInput } from '@/components/ui/form/base-component/text-input';
import Dropdown from '@/components/ui/form/base-component/dropdown';
import icons from '@/components/icons';

export interface Column<T> {
  key: keyof T | string;
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
  filterType?: 'text' | 'dropdown';
  filterOptions?: { label: string; value: string }[];
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey?: (row: T, index: number) => string | number;
  hoverable?: boolean;
  click?: {
    onRowClick: (row: T) => void;
  };
  dense?: boolean;
  onRowClick?: (row: T) => void;
  onFilterChange?: (filters: Record<string, string>) => void; // <--- thêm
  onSortChange?: (sort: { key: string; direction: 'asc' | 'desc' } | null) => void; // <--- thêm
  loading?: boolean;                  // <--- mặc định false
}

function Table<T>({
  columns,
  data,
  rowKey,
  hoverable = false,
  click,
  dense = false,
  onFilterChange,
  onSortChange,
  loading = false,
}: TableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof T | string; direction: 'asc' | 'desc' } | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [visibleFilters, setVisibleFilters] = useState<Record<string, boolean>>({});
  const debounceRef = useRef<Record<string, NodeJS.Timeout>>({});

  const handleSort = (key: keyof T | string) => {
    let newConfig: typeof sortConfig = null;
    if (!sortConfig || sortConfig.key !== key) {
      newConfig = { key, direction: 'asc' };
    } else if (sortConfig.direction === 'asc') {
      newConfig = { key, direction: 'desc' };
    }
    setSortConfig(newConfig);
    onSortChange?.(newConfig ? { key: String(newConfig.key), direction: newConfig.direction } : null);
  };

  // Xử lý thay đổi filters in cho dropdown và text input in columns
  const handleFilterChange = (key: string, value: string) => {
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
    <div className="overflow-x-auto rounded-lg shadow-md">
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
                          {sortConfig?.key === col.key
                            ? sortConfig.direction === 'asc'
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
                          {col.filter.filterType === 'dropdown' ? icons.filter : icons.search}
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
                          onSelect={(val) => handleFilterChange(String(col.key), val)}
                        />
                      ) : (
                        <TextInput
                          size="sm"
                          placeholder="Search"
                          value={filters[String(col.key)] || ''}
                          onChange={(e) => handleFilterChange(String(col.key), e.target.value)}
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
          ) : (
            displayData.map((row, rowIndex) => (
              <tr
                key={rowKey ? rowKey(row, rowIndex) : rowIndex}
              onClick={() => { click && click.onRowClick(row)}}
                className={`${hoverable ? 'hover:bg-card' : ''} ${click ? 'cursor-pointer' : ''}`}
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


interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  role: string;
}

const sampleData: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', age: 28, role: 'Developer' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 32, role: 'Designer' },
  { id: 3, name: 'Mike Brown', email: 'mike@example.com', age: 40, role: 'Manager' },
  { id: 4, name: 'Anna Lee', email: 'anna@example.com', age: 24, role: 'Intern' },
  { id: 5, name: 'Chris Green', email: 'chris@example.com', age: 35, role: 'QA' },
  { id: 6, name: 'Sarah White', email: 'sarah@example.com', age: 29, role: 'Product Owner' },
];

const userColumns: Column<User>[] = [
  {
    key: 'name', label: 'Name', sortable: true, truncate: true,
    filter: { filterType: 'text' },
    render: (row) => <span className="text-primary">{row.name}</span>
  },
  { key: 'email', label: 'Email', minWidth: '200px', truncate: true, filter: { filterType: 'text' } },
  { key: 'age', label: 'Age', sortable: true, align: 'center', width: '80px' },
  {
    key: 'role',
    label: 'Role',
    align: 'center',
    filter: {
      filterType: 'dropdown', filterOptions: [
        { label: 'All', value: '' },
        { label: 'Developer', value: 'Developer' },
        { label: 'Designer', value: 'Designer' },
        { label: 'Manager', value: 'Manager' },
        { label: 'Intern', value: 'Intern' },
        { label: 'QA', value: 'QA' },
        { label: 'Product Owner', value: 'Product Owner' },
      ]
    }
  },
  {
    key: 'actions',
    label: 'Actions',
    align: 'right',
    render: (row) => (
      <button className="text-app-blue-DEFAULT hover:underline" onClick={() => alert(row.name)}>
        View
      </button>
    ),
  },
];


export const TableShowcase = () => {
  const [page, setPage] = useState(1);
  const pageSize = 3;
  const paginatedData = sampleData.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(sampleData.length / pageSize);

  return (
    <div className="space-y-8">
      {/* 1. Basic Table */}
      <Card>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Basic Table</h3>
        <Table columns={userColumns} data={sampleData} rowKey={(row) => row.id} />
      </Card>

      {/* 2. Hoverable Table */}
      <Card>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Hoverable Table</h3>
        <Table columns={userColumns} data={sampleData} rowKey={(row) => row.id} hoverable />
      </Card>

      {/* 3. Clickable Table */}
      <Card>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Clickable Table</h3>
        <Table
          columns={userColumns}
          data={sampleData}
          rowKey={(row) => row.id}
          click={{
            onRowClick: (row) => alert(`Clicked on ${row.name}`),
          }}
          hoverable
        />
      </Card>

      {/* 4. Dense Table */}
      <Card>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Dense Table</h3>
        <Table columns={userColumns} data={sampleData} rowKey={(row) => row.id} dense hoverable />
      </Card>

      {/* 5. Sortable Table */}
      <Card>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Sortable Table</h3>
        <Table columns={userColumns} data={sampleData} rowKey={(row) => row.id} hoverable />
      </Card>

      {/* 6. Paginated Table */}
      <Card>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Paginated Table</h3>
        <Table columns={userColumns} data={paginatedData} rowKey={(row) => row.id} hoverable />
        <div className="flex justify-between items-center mt-3">
          <button
            className="px-3 py-1 bg-neutral-800 text-white rounded disabled:opacity-50"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>
          <span className="text-sm">
            Page {page} / {totalPages}
          </span>
          <button
            className="px-3 py-1 bg-neutral-800 text-white rounded disabled:opacity-50"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </Card>

      {/* 7. Sticky Header Table */}
      <Card>
        <h3 className="text-lg font-semibold text-text-primary mb-4">Sticky Header Table</h3>
        <div className="max-h-64 overflow-y-auto">
          <Table
            columns={userColumns}
            data={sampleData}
            rowKey={(row) => row.id}
            hoverable
          />
        </div>
        <style jsx>{`
          table thead th {
            position: sticky;
            top: 0;
            background: var(--background-surface, #111);
            z-index: 1;
          }
        `}</style>
      </Card>
    </div>
  );
};
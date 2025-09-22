'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Table, { Column } from '@/components/ui/view/table';
import { Card } from '@/components/ui/Card';
import { TextInput } from '@/components/ui/form/base-component/text-input';
import Button from '@/components/ui/common/button/button';
import { debounce } from '@/lib/debouce';
import { BaseModel } from '@/model/base/base-model';
import { Variant } from '@/components/type';
import { ESortDirection } from '@/model/common/sortDirection';
import { ApiResponse } from '@/lib/api/api-helper';
import { EAlertType, useAlert } from '@/contexts/alert-context';
import icons from '@/components/icons';
import Dropdown, { DropdownOption } from '@/components/ui/form/base-component/dropdown';

export type DataListViewMutators<T> = {
    updateItemById: (updated: Partial<T> & { id: string }) => void;
    removeItemById: (id: string) => void;
    prependItem: (item: T) => void;
    showAlert: (message: string, type?: EAlertType) => void;
};

export const DataListViewContext = React.createContext<DataListViewMutators<any> | null>(null);

export const useDataListView = <T extends BaseModel>() => {
    const ctx = React.useContext(DataListViewContext) as DataListViewMutators<T> | null;
    if (!ctx) throw new Error('useDataListView must be used within DataListView');
    return ctx;
};

export interface SortParam<T> { key: keyof T; direction: ESortDirection };

export interface FilterParams<T> {
    offset: number,
    limit: number,
    search?: string,
    filters?: Record<string, string | { from?: string; to?: string; }>,
    ranges?: Record<string, { from?: string; to?: string; }>,
    sort?: SortParam<T> | undefined

    [key: string]: any; // match with Query params
}

interface DataListViewProps<T> {
    header?: {
        title?: string;
        title_addition?: React.ReactNode;
        search?: {
            placeholder?: string;
        };
        filters?: {
            key: keyof T;
            options: DropdownOption[];
            className?: string;
            placeholder: string;
            enable?: boolean
        }[];
        actions?: Array<{
            icon?: React.ReactNode;
            text?: string;
            onClick?: () => void;
            onClickWithHelpers?: (helpers: DataListViewMutators<T>) => void;
            variant?: Variant;
            condition?: boolean
        }>;
    };
    footer?: {
        actions?: Array<{
            icon?: React.ReactNode;
            text?: string;
            onClick?: () => void;
            onClickWithHelpers?: (helpers: DataListViewMutators<T>) => void;
            variant?: Variant;
        }>;
    };
    onRowClick?: (row: T) => void;
    table?: {
        columns: Column<T>[];
    };
    rowAction?: {
        render: (row: T, helpers: DataListViewMutators<T>) => React.ReactNode;
        label?: string;
        minWidth?: string;
        maxWidth?: string;
        width?: string;
        align?: 'left' | 'center' | 'right';
    };
    card?: {
        className?: string;
        content: React.JSX.Element | ((item: T) => React.ReactNode);
    };
    fetchData: (params: FilterParams<T>) => Promise<ApiResponse<T[]>>;
    onDataLoaded?: (data: T[]) => void;
    pageSize?: number;
}

export function DataListView<T extends BaseModel>({
    header,
    footer,
    onRowClick,
    table,
    rowAction,
    card,
    fetchData,
    pageSize = 5,
    onDataLoaded,
}: DataListViewProps<T>) {
    const [data, setData] = useState<T[]>([]);
    const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
    const [offset, setOffset] = useState(0);
    const [limit, setLimit] = useState(pageSize);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Record<string, string | { from?: string; to?: string; }>>({});
    const [ranges, setRanges] = useState<Record<string, { from?: string; to?: string; }>>({});
    const [sort, setSort] = useState<SortParam<T> | undefined>(undefined);
    const [isLoadMoreable, setLetMoreAble] = useState<boolean>(false);

    const [loadingInitial, setLoadingInitial] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const showAlert = useAlert();

    const loadData = useCallback(
        async (reset = false) => {
            if (reset) setLoadingInitial(true);
            else setLoadingMore(true);

            const response = await fetchData({
                offset,
                limit,
                search: searchQuery,
                filters,
                ranges,
                sort,
            });

            if (!response.meta.success) {
                showAlert(response.meta.external_message, EAlertType.ERROR)
                return;
            }

            if (onDataLoaded && response.data) {
                onDataLoaded(response.data);
            }

            setData((prev) => reset ? (response.data ?? []) : [...prev, ...(response.data ?? [])]);
            if (reset) setLoadingInitial(false);
            else setLoadingMore(false);

            setLetMoreAble((response?.data?.length || 0) >= limit);
        },
        [offset, limit, searchQuery, filters, ranges, sort, fetchData]
    );

    // Load khi thay đổi offset, filter, search, sort
    useEffect(() => {
        loadData(offset === 0);
    }, [offset, limit, searchQuery, filters, ranges, sort, loadData]);

    const handleSeeMore = () => {
        setOffset((prev) => prev + limit);
    };

    // Debounce search input
    const debouncedSetSearchQuery = useMemo(() => debounce((value: string) => {
        setOffset(0);
        setSearchQuery(value);
    }, 400), []);

    const handleFilterChange = (filters: Record<string, string | { from?: string; to?: string }>) => {
        setOffset(0);

        const newFilters = { ...filters };
        const newRanges = { ...ranges };

        for (const key in filters) {
            const value = filters[key];

            if (typeof value === 'string') {
                if (value.length > 0) {
                    newFilters[key] = value;
                    delete newRanges[key];
                } else {
                    delete newFilters[key];
                    delete newRanges[key];
                }
            }
            else if (typeof value === 'object' && value !== null) {
                // check has from or true
                const hasFrom = typeof value.from === 'string' && value.from.length > 0;
                const hasTo = typeof value.to === 'string' && value.to.length > 0;

                if (hasFrom || hasTo) {
                    newRanges[key] = value;
                    delete newFilters[key];
                } else {
                    delete newFilters[key];
                    delete newRanges[key];
                }
            }
        }

        setFilters(newFilters);
        setRanges(newRanges);
    }

    const handleHeaderFilterChange = (key: string, value: string | null) => {
        setOffset(0);
        setFilters(prevFilters => {
            const newFilters = { ...prevFilters };
            if (value) {
                newFilters[key] = value;
            } else {
                delete newFilters[key];
            }
            return newFilters;
        });
    };

    const handleSortChange = (newSort: SortParam<T> | undefined) => {
        setOffset(0);
        setSort(newSort);
    };

    const displayData = React.useMemo(() => {
        const byId = new Map<string, T>();
        data.forEach((item: any) => {
            if (!removedIds.has(item.id)) byId.set(item.id, item);
        });
        return Array.from(byId.values());
    }, [data, removedIds]);

    const updateItemById = useCallback((updated: Partial<T> & { id: string }) => {
        setData((prev) => prev.map((it: any) => (it.id === updated.id ? { ...it, ...updated } : it)));
    }, []);

    const removeItemById = useCallback((id: string) => {
        setData((prev) => prev.filter((it: any) => it.id !== id));
        setRemovedIds((prev) => new Set(prev).add(id));
    }, []);

    const prependItem = useCallback((item: T) => {
        setData((prev) => [item, ...prev]);
    }, []);

    const helpers: DataListViewMutators<T> = { updateItemById, removeItemById, prependItem, showAlert };

    const computedColumns = React.useMemo(() => {
        if (!table) return undefined;
        if (!rowAction) return table.columns;
        return [
            ...table.columns,
            {
                key: 'id' as keyof T, // BaseModel.id
                label: rowAction.label || 'Actions',
                minWidth: rowAction.minWidth,
                maxWidth: rowAction.maxWidth,
                width: rowAction.width || '96px',
                align: rowAction.align || 'right',
                render: (row: T) => rowAction.render(row, helpers),
            } as Column<T>,
        ];
    }, [table, rowAction, helpers]);

    return (
        <DataListViewContext.Provider value={{ updateItemById, removeItemById, prependItem, showAlert }}>
            <div className="overflow-visible w-full">
                {/* Header */}
                {header && (
                    <div className="flex items-center justify-between mb-4 min-w-0">
                        <div className='flex gap-2'>
                            {header.title && (
                                <h2 className="text-lg font-semibold text-text-primary truncate" title={header.title}>
                                    {header.title}
                                </h2>
                            )}

                            {header.title_addition && header.title_addition}
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                            {header.filters && header.filters.map((filter) => {
                                if (filter.enable !== null && filter.enable == false) return null;

                                return (
                                    <div
                                        key={filter.key as string}
                                        className="max-w-[200px] min-w-32"
                                    >
                                        <Dropdown
                                            size="sm"
                                            options={filter.options}
                                            value={filters[filter.key as string] || null}
                                            className={filter.className}
                                            placeholder={filter.placeholder}
                                            onChange={(value) =>
                                                handleHeaderFilterChange(
                                                    filter.key as string,
                                                    value as string | null
                                                )
                                            }
                                        />
                                    </div>
                                );
                            })}


                            {header.search && (
                                <div className={`max-w-[200px]`}>
                                    <TextInput
                                        size="sm"
                                        className="w-full truncate"
                                        value={searchQuery}
                                        placeholder={header.search.placeholder || 'Search...'}
                                        onChange={val => debouncedSetSearchQuery(val)}
                                    />
                                </div>
                            )}
                            {
                                header.actions && header.actions.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        {/* Lọc các action thỏa mãn điều kiện trước */}
                                        {header.actions
                                            .filter(action => action.condition !== false)
                                            .map((action, index) => (
                                                <Button
                                                    key={index}
                                                    size='sm'
                                                    onClick={() => action.onClickWithHelpers ? action.onClickWithHelpers(helpers) : action.onClick?.()}
                                                    variant={action.variant}
                                                    className="flex items-center transition-all duration-300"
                                                >
                                                    {action.icon && <span className="flex-shrink-0">{action.icon}</span>}
                                                    {action.text}
                                                </Button>
                                            ))
                                        }
                                    </div>
                                )
                            }
                        </div>
                    </div>
                )}

                {/* Table */}
                {table && (
                    <Table
                        columns={computedColumns || table.columns}
                        data={displayData}
                        rowKey={(row) => row.id}
                        hoverable
                        onRowClick={onRowClick}
                        loading={loadingInitial || loadingMore}
                        onFilterChange={handleFilterChange}
                        onSortChange={handleSortChange}
                        sort={sort}
                        emptyState={(
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-16 h-16 mb-4 text-text-primary">
                                    {icons.empty}
                                </div>
                                <h3 className="text-lg font-medium text-text-primary mb-2">No data found</h3>
                                <p className="text-text-secondary mb-4">
                                    {searchQuery || Object.keys(filters).length > 0
                                        ? "No results match your search criteria. Try adjusting your filters."
                                        : "There are no items to display at the moment."
                                    }
                                </p>
                                {(searchQuery || Object.keys(filters).length > 0) && (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setFilters({});
                                            setOffset(0);
                                        }}
                                    >
                                        Clear filters
                                    </Button>
                                )}
                            </div>
                        )}
                    />
                )}

                {/* Card Content */}
                {card && (
                    <>
                        {loadingInitial ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-8 h-8 mb-4 text-text-primary animate-spin">
                                    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-text-primary mb-2">Loading data...</h3>
                                <p className="text-text-secondary">Please wait while we fetch the data</p>
                            </div>
                        ) : displayData.length > 0 ? (
                            <div className={card.className || "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"}>
                                {displayData.map((item) => (
                                    <Card
                                        key={item.id}
                                        className="p-4 shadow-md hover:shadow-lg transition-all cursor-pointer"
                                        onClick={() => onRowClick?.(item)}
                                    >
                                        {/* Content của card được truyền từ props */}
                                        {typeof card.content === "function"
                                            ? (card.content as (item: T) => React.ReactNode)(item)
                                            : card.content}
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-16 h-16 mb-4 text-text-primary">
                                    {icons.empty}
                                </div>
                                <h3 className="text-lg font-medium text-text-primary mb-2">No data found</h3>
                                <p className="text-text-secondary mb-4">
                                    {searchQuery || Object.keys(filters).length > 0
                                        ? "No results match your search criteria. Try adjusting your filters."
                                        : "There are no items to display at the moment."
                                    }
                                </p>
                                {(searchQuery || Object.keys(filters).length > 0) && (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setFilters({});
                                            setOffset(0);
                                        }}
                                    >
                                        Clear filters
                                    </Button>
                                )}
                            </div>
                        )}
                    </>
                )}

                {/* Footer Actions */}
                {footer?.actions && footer.actions.length > 0 && (
                    <div className="flex items-center gap-2 justify-end mt-4 mb-2">
                        {footer.actions.map((action, index) => (
                            <Button
                                key={index}
                                onClick={() => action.onClickWithHelpers ? action.onClickWithHelpers(helpers) : action.onClick?.()}
                                variant={action.variant}
                                className="flex items-center transition-all duration-300"
                            >
                                {action.icon && <span className="flex-shrink-0">{action.icon}</span>}
                                {action.text}
                            </Button>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <div className="flex flex-col gap-2">
                    {isLoadMoreable && (
                        <Button
                            onClick={handleSeeMore}
                            loading={loadingMore}
                            className="w-full focus:none"
                            variant="secondary"
                        >
                            See More
                        </Button>
                    )}
                </div>
            </div>
        </DataListViewContext.Provider>
    );
}

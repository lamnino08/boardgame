'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import Table, { Column } from '@/components/ui/view/table';
import Card from '@/components/ui/Card';
import { TextInput } from '@/components/ui/form/base-component/text-input';
import Button from '@/components/ui/common/button/button';
import icons from '@/components/icons';
import { debounce } from '@/lib/debouce';

interface DataListViewProps<T> {
    header?: {
        title?: string;
        search?: {
            placeholder?: string;
            value?: string;
            onChange?: (value: string) => void;
        };
        actions?: [
            {
                icon?: React.ReactNode;
                text: string;
                onClick: () => void;
                variant?: 'primary' | 'secondary';
            }
        ]
    }
    click?: {
        onRowClick: (row: T) => void;
    };
    table?: {
        columns: Column<T>[];
    }
    card?: {
        className?: string;
        content: React.JSX.Element | ((item: T) => React.ReactNode);
    };
    fetchData: (
        page: number,
        pageSize: number,
        options?: {
            search?: string;
            filters?: Record<string, string>;
            sort?: { key: string; direction: 'asc' | 'desc' } | null;
        }
    ) => Promise<{ data: T[]; total: number }>;
    pageSize?: number;
}

export function DataListView<T extends { id: number }>({
    header,
    click,
    table,
    card,
    fetchData,
    pageSize = 5,
}: DataListViewProps<T>) {
    const [data, setData] = useState<T[]>([]);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [sort, setSort] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [total, setTotal] = useState(0);

    const [loadingInitial, setLoadingInitial] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const loadData = useCallback(
        async (reset = false) => {
            if (reset) setLoadingInitial(true);
            else setLoadingMore(true);

            const result = await fetchData(page, pageSize, {
                search: searchQuery,
                filters,
                sort,
            });

            setData((prev) => (reset ? result.data : [...prev, ...result.data]));
            setTotal(result.total);

            if (reset) setLoadingInitial(false);
            else setLoadingMore(false);
        },
        [page, pageSize, searchQuery, filters, sort, fetchData]
    );

    // Load khi thay đổi page, filter, search, sort
    useEffect(() => {
        loadData(page === 1); // reset khi về trang 1
    }, [page, searchQuery, filters, sort, loadData]);

    const handleSeeMore = () => {
        setPage((prev) => prev + 1);
    };

    const handleSearchChange = useMemo(() => {
        return (value: string) => {
            setPage(1);
            setSearchQuery(value); // update input ngay

            // chỉ debounce phần callback search
            debouncedSearch(value);
        };
    }, []);

    const debouncedSearch = useMemo(
        () =>
            debounce((value: string) => {
                header?.search?.onChange?.(value);
            }, 400),
        [header]
    );

    const handleFilterChange = (newFilters: Record<string, string>) => {
        setPage(1);
        setFilters(newFilters);
    };

    const handleSortChange = (newSort: { key: string; direction: 'asc' | 'desc' } | null) => {
        setPage(1);
        setSort(newSort);
    };

    return (
        <Card className="overflow-visible">
            {/* Header */}
            {header && (
                <div className="flex items-center justify-between mb-4 min-w-0">
                    {header.title && (
                        <h2 className="text-lg font-semibold text-text-primary truncate" title={header.title}>
                            {header.title}
                        </h2>
                    )}

                    <div className="flex items-center gap-2 flex-shrink-0">
                        {header.search && (
                            <div
                                className={`max-w-[200px]`}
                            >
                                <TextInput
                                    size="sm"
                                    className="w-full truncate"
                                    value={searchQuery}
                                    placeholder={header.search.placeholder || 'Search...'}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                />
                            </div>
                        )}

                        {header.actions && header.actions.length > 0 && (
                            <div className="flex items-center gap-2">
                                {header.actions.map((action, index) => (
                                    <Button
                                        key={index}
                                        onClick={action.onClick}
                                        variant={action.variant}
                                        className="flex items-center transition-all duration-300"
                                    >
                                        {action.icon && <span className="flex-shrink-0">{action.icon}</span>}
                                        {action.text}
                                    </Button>

                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Table */}
            {table && (
                <Table
                    columns={table.columns}
                    data={data}
                    rowKey={(row) => row.id}
                    hoverable
                    click={click}
                    loading={loadingInitial}  // loading chính
                    onFilterChange={handleFilterChange}
                    onSortChange={handleSortChange}
                />
            )}

            {/* Card Content */}
            {card && (
                <div className={card.className || "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"}>
                    {data.map((item) => (
                        <Card
                            key={item.id}
                            className="p-4 shadow-md hover:shadow-lg transition-all cursor-pointer"
                            onClick={() => click?.onRowClick?.(item)}
                        >
                            {/* Content của card được truyền từ props */}
                            {typeof card.content === "function"
                                ? (card.content as (item: T) => React.ReactNode)(item)
                                : card.content}
                        </Card>
                    ))}
                </div>
            )}



            {/* Footer */}
            <div className="flex flex-col gap-2">
                {data.length < total && (
                    <Button
                        onClick={handleSeeMore}
                        loading={loadingMore}
                        className="w-full focus:none"
                        variant="secondary"
                    >
                        See More
                    </Button>
                )}
                <span className="text-sm text-neutral-400">
                    Showing {data.length} of {total} records
                </span>
            </div>
        </Card>
    );
}

export default DataListView;

interface User {
    id: number;
    name: string;
    email: string;
    age: number;
    role: string;
}

// Dataset mô phỏng API
const allUsers: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com', age: 28, role: 'Developer' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', age: 32, role: 'Designer' },
    { id: 3, name: 'Mike Brown', email: 'mike@example.com', age: 40, role: 'Manager' },
    { id: 4, name: 'Anna Lee', email: 'anna@example.com', age: 24, role: 'Intern' },
    { id: 5, name: 'Chris Green', email: 'chris@example.com', age: 35, role: 'QA' },
    { id: 6, name: 'Sarah White', email: 'sarah@example.com', age: 29, role: 'Product Owner' },
    { id: 7, name: 'David Black', email: 'david@example.com', age: 38, role: 'Developer' },
    { id: 8, name: 'Laura Scott', email: 'laura@example.com', age: 27, role: 'Designer' },
    { id: 9, name: 'Kevin Hall', email: 'kevin@example.com', age: 42, role: 'Manager' },
    { id: 10, name: 'Emma Turner', email: 'emma@example.com', age: 26, role: 'Intern' },
    { id: 11, name: 'Ryan King', email: 'ryan@example.com', age: 34, role: 'QA' },
    { id: 12, name: 'Olivia Adams', email: 'olivia@example.com', age: 31, role: 'Product Owner' },
    { id: 13, name: 'Jason Reed', email: 'jason@example.com', age: 29, role: 'Developer' },
    { id: 14, name: 'Sophia Young', email: 'sophia@example.com', age: 30, role: 'Designer' },
    { id: 15, name: 'Daniel Perez', email: 'daniel@example.com', age: 39, role: 'Manager' },
    { id: 16, name: 'Mia Carter', email: 'mia@example.com', age: 23, role: 'Intern' },
    { id: 17, name: 'Jacob Evans', email: 'jacob@example.com', age: 36, role: 'QA' },
    { id: 18, name: 'Isabella Brooks', email: 'isabella@example.com', age: 28, role: 'Product Owner' },
    { id: 19, name: 'Matthew Ward', email: 'matthew@example.com', age: 33, role: 'Developer' },
    { id: 20, name: 'Amelia Cox', email: 'amelia@example.com', age: 25, role: 'Designer' },
    { id: 21, name: 'Andrew Gray', email: 'andrew@example.com', age: 45, role: 'Manager' },
    { id: 22, name: 'Ella Rivera', email: 'ella@example.com', age: 22, role: 'Intern' },
    { id: 23, name: 'Joshua Hughes', email: 'joshua@example.com', age: 37, role: 'QA' },
    { id: 24, name: 'Charlotte Foster', email: 'charlotte@example.com', age: 30, role: 'Product Owner' },
    { id: 25, name: 'Benjamin Ross', email: 'benjamin@example.com', age: 28, role: 'Developer' },
    { id: 26, name: 'Grace Morgan', email: 'grace@example.com', age: 27, role: 'Designer' },
    { id: 27, name: 'Ethan Hughes', email: 'ethan@example.com', age: 41, role: 'Manager' },
    { id: 28, name: 'Abigail Diaz', email: 'abigail@example.com', age: 24, role: 'Intern' },
    { id: 29, name: 'Alexander Scott', email: 'alexander@example.com', age: 35, role: 'QA' },
    { id: 30, name: 'Harper Bennett', email: 'harper@example.com', age: 29, role: 'Product Owner' },
];

// API giả lập (filter + search + sort + phân trang)
async function fetchUsers(
    page: number,
    pageSize: number,
    options?: {
        search?: string;
        filters?: Record<string, string>;
        sort?: { key: string; direction: 'asc' | 'desc' } | null;
    }
) {
    let filtered = [...allUsers];

    await new Promise((resolve) => setTimeout(resolve, 3000)); // Giả lập delay API

    const { search, filters = {}, sort } = options || {};

    // Search theo name
    if (search) {
        filtered = filtered.filter((u) =>
            u.name.toLowerCase().includes(search.toLowerCase())
        );
    }

    // Filter theo role, age, name
    if (filters.role) {
        filtered = filtered.filter((u) => u.role === filters.role);
    }
    if (filters.age) {
        filtered = filtered.filter((u) => u.age === Number(filters.age));
    }
    if (filters.name) {
        filtered = filtered.filter((u) =>
            u.name.toLowerCase().includes(filters.name.toLowerCase())
        );
    }

    // Sort nếu có
    if (sort) {
        filtered.sort((a, b) => {
            const aValue = a[sort.key as keyof User];
            const bValue = b[sort.key as keyof User];
            if (aValue < bValue) return sort.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sort.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }

    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize);
    return { data, total: filtered.length };
}

// Định nghĩa cột
const userColumns: Column<User>[] = [
    {
        key: 'name',
        label: 'Name',
        sortable: true,
        filter: { filterType: 'text' },
    },
    {
        key: 'email',
        label: 'Email',
    },
    {
        key: 'age',
        label: 'Age',
        sortable: true,
        filter: { filterType: 'text' },
    },
    {
        key: 'role',
        label: 'Role',
        filter: {
            filterType: 'dropdown',
            filterOptions: [
                { value: '', label: 'All' },
                { value: 'Developer', label: 'Developer' },
                { value: 'Designer', label: 'Designer' },
                { value: 'Manager', label: 'Manager' },
                { value: 'Intern', label: 'Intern' },
                { value: 'QA', label: 'QA' },
                { value: 'Product Owner', label: 'Product Owner' },
            ],
        },
    },
];

const onRowClick = (user: User) => {
    alert(`Clicked on ${user.name}`);
}

export const UserListPage = () => {
    return (
        <DataListView<User>
            header={{
                title: 'User List',
                search: {
                    placeholder: 'Search by name',
                    onChange: (value) => console.log('Search:', value),
                },
                actions: [
                    { icon: icons.add, text: 'Add user', onClick: () => alert('Add user'), variant: 'primary' },
                ]
            }}
            table={{

                columns: userColumns
            }}
            card={{
                className: 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4',
                content: (user: User) => (
                    <div>
                        <h3 className="text-lg font-semibold">{user.name}</h3>
                        <p className="text-sm text-neutral-500">{user.email}</p>
                        <p className="text-sm text-neutral-500">Age: {user.age}</p>
                        <p className="text-sm text-neutral-500">Role: {user.role}</p>
                    </div>
                )
            }}
            click={{
                onRowClick: onRowClick
            }}
            fetchData={fetchUsers}
            pageSize={5}
        />
    );
};

'use client'

import React, { useState, useEffect, useMemo } from 'react';
import { DataListView } from '@/components/ui/view/datal-list-view';
import { creatTransaction, getAllTransactions, deleteTransaction } from '@/actions/transaction/transactionAction';
import { ETransactionType, Transaction, TransactionCategory } from '@/model/finance/transaction';
import icons from '@/components/icons';
import { EAlertType, useAlert } from '@/contexts/alert-context';
import Button from '@/components/ui/common/button/button';
import { getListTransactionColumnConfig } from './listTransactionColumnCongif';
import { getAllCategory } from '@/actions/transaction/transactionCategoryAction'; // Import getAllCategory
import { DropdownOption } from '@/components/ui/form/base-component/dropdown';

export default function ListTransaction() {
    const [categories, setCategories] = useState<TransactionCategory[] | undefined>(undefined);
    const [totalAmount, setTotalAmount] = useState<number | null>(null);
    const showAlert = useAlert();

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await getAllCategory();
            console.log(response);
            if (response.meta.success && response.data) {
                setCategories(response.data);
            } else {
                showAlert(response.meta.external_message, EAlertType.ERROR);
            }
        };
        fetchCategories();
    }, []);

    const handleDataLoaded = (data: Transaction[]) => {
        const total = data.reduce((sum, t) => sum + Number(t.amount ?? 0), 0);
        setTotalAmount(total);
    };

    if (!categories) return <></>

    return (
        <>
            <DataListView<Transaction>
                onDataLoaded={handleDataLoaded}
                header={{
                    title: 'Transactions',
                    title_addition: (
                        <span className="font-bold text-md">
                             {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalAmount ?? 0)}
                        </span>
                    ),
                    search: {
                        placeholder: "Search note",
                    },
                    filters: [
                        {
                            key: "category_id",
                            placeholder: "Category",
                            className: "min-w-40",
                            options: [
                                { label: "All", value: '' },
                                ...categories.map((cat): DropdownOption => ({
                                    label: cat.name,
                                    value: cat.id,
                                    render: () => (
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                                            <span>{cat.name}</span>
                                        </div>
                                    )
                                }))
                            ]
                        },
                        {
                            key: "type",
                            placeholder: "Type",
                            className: "min-w-40",
                            options: [
                                { label: "All", value: '' },
                                { label: "Income", value: ETransactionType.INCOME },
                                { label: "Expense", value: ETransactionType.EXPENSE },
                            ]
                        },
                    ]
                }}
                table={{ columns: getListTransactionColumnConfig(categories) }}
                rowAction={{
                    label: 'Actions',
                    width: '96px',
                    align: 'center',
                    render: (row, { removeItemById }) => (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-danger"
                            onClick={async (e) => {
                                e.stopPropagation();
                                const res = await deleteTransaction(row.id);
                                if (!res.meta.success) return showAlert(res.meta.external_message, EAlertType.ERROR);
                                removeItemById(row.id);
                            }}
                        >
                            {icons.sub}
                        </Button>
                    ),
                }}
                fetchData={getAllTransactions}
                pageSize={5}
                footer={{
                    actions: [
                        {
                            icon: icons.add,
                            text: "transaction",
                            variant: 'success',
                            onClickWithHelpers: async ({ prependItem, showAlert }) => {
                                const response = await creatTransaction();
                                if (!response.meta.success) return showAlert(response.meta.external_message, EAlertType.ERROR);
                                if (response.data) {
                                    prependItem(response.data);
                                    // showAlert('Transaction created successfully!', EAlertType.SUCCESS);
                                }
                            }
                        },
                    ]
                }}
            />
        </>
    );
}
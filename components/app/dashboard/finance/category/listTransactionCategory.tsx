'use client'

import React, { useCallback, useMemo } from 'react';
import { DataListView, useDataListView, DataListViewMutators } from '@/components/ui/view/datal-list-view'; // Import DataListViewMutators
import { TransactionCategory, ETransactionType } from '@/model/finance/transaction';
import icons, { AddIcon } from '@/components/icons';
import { EAlertType, useAlert } from '@/contexts/alert-context';
import { ListTransactionCategoryColumnConfig } from '@/components/app/dashboard/finance/category/listTransactionCategoryColumn';
import Button from '@/components/ui/common/button/button';
import { getAllCategory, deleteCategory } from '@/actions/transaction/transactionCategoryAction'; // Import createTransactionCategory
import { CreateTransactionCategoryForm } from '@/components/ui/form/app/transaction/create-edit-transaction-category-form';
import { useModal } from '@/contexts/modal-context';


export const ListTransactionCategory = ( {transactionType} : { transactionType: ETransactionType} ) => {
    const showAlert = useAlert();
    const { openModal } = useModal();

    const HandleGet = useCallback(async(params?: {
        search?: string;
        limit?: number;
        offset?: number;
    }) => {
        return await getAllCategory({
            search: params?.search,
            limit: params?.limit,
            offset: params?.offset,
            type: transactionType
        })
    }, [transactionType]); 

    const headerConfig = useMemo(() => ({
        title: 'Transaction Categories',
        search: {
            placeholder: "Search categories...",
        },
        actions: [
            {
                icon: AddIcon,
                text: `${transactionType == ETransactionType.INCOME ? 'Income' : 'Expense'} Category`,
                variant: "success" as const,
                onClickWithHelpers: async ({ prependItem }: { prependItem: (item: TransactionCategory) => void }) => {
                    try {
                        const category = await openModal<TransactionCategory>((resolve, reject) => (
                            <CreateTransactionCategoryForm
                                typeDefault={transactionType}
                                onSuccess={(cat) => resolve(cat)}
                            />
                        ), { size: 'md', title: {  content: "Create category" }});
                        prependItem(category);
                    } catch (_) {
                        // dismissed/cancelled
                    }
                }
            }
        ]
    }), [openModal, transactionType]); // Depend on openModal and showAlert

    const tableConfig = useMemo(() => ({ columns: ListTransactionCategoryColumnConfig }), []);

    const rowActionConfig = useMemo(() => ({
        label: 'Actions',
        width: '96px',
        align: 'left' as const,
        render: (row: TransactionCategory, { removeItemById, updateItemById }: DataListViewMutators<TransactionCategory>) => (
            <div className="flex gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary"
                    onClick={async (e) => {
                        e.stopPropagation();
                        try {
                            const updatedCategory = await openModal<TransactionCategory>((resolve, reject) => (
                                <CreateTransactionCategoryForm
                                    initialData={row}
                                    typeDefault={transactionType}
                                    onSuccess={(cat) => resolve(cat)}
                                />
                            ), { 
                                size: 'md', 
                                title: {  content: `Edit ${transactionType} category` }
                            });
                            updateItemById(updatedCategory);
                        } catch (_) {
                            // dismissed/cancelled
                        }
                    }}
                >
                    {icons.edit}
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-danger"
                    onClick={async (e) => {
                        e.stopPropagation();
                        const res = await deleteCategory(row.id);
                        if (!res.meta.success) return showAlert(res.meta.external_message, EAlertType.ERROR);
                        removeItemById(row.id);
                    }}
                >
                    {icons.sub}
                </Button>
            </div>
        ),
    }), [openModal, transactionType]); // Depend on openModal and showAlert

    return (
        <>
            <DataListView<TransactionCategory>
                header={headerConfig}
                table={tableConfig}
                rowAction={rowActionConfig}
                fetchData={HandleGet}
                pageSize={10}
            />
        </>
    );
}

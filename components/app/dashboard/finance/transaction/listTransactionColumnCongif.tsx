'use client'

import { Column } from "@/components/ui/view/table";
import { ETransactionType, Transaction, TransactionCategory } from "@/model/finance/transaction";
import { updateAmount, updateCategoryTransaction, updateDate, updateNote } from "@/actions/transaction/transactionAction";
import { EditableCellText } from "@/components/ui/view/editableCell";
import { EditableCellDate } from "@/components/ui/view/editableCellDate";
import { EditableCellDropdown } from "@/components/ui/view/editableCellDropdown";
import { DropdownOption } from "@/components/ui/form/base-component/dropdown";
import { moneyDisplay } from "@/utils/money";
import { useDataListView } from "@/components/ui/view/datal-list-view";

const CategoryCell = ({ row, allCategories }: { row: Transaction, allCategories: TransactionCategory[] }) => {
    const { updateItemById } = useDataListView<Transaction>();

    const options: DropdownOption[] = [
        { label: "No Category", value: '', className: "text-gray-500" },
        ...allCategories.map((cat): DropdownOption => ({
            label: cat.name,
            value: cat.id,
            className: "flex items-center gap-2",
            render: () => (
                <div className="flex w-full items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                        <span className="text-base font-semibold text-text-primary">{cat.name}</span>
                    </div>
                    <div className={`rounded-full w-2 h-2 flex-shrink-0 bg-${cat?.type === ETransactionType.INCOME ? 'success' : 'danger'}`} />
                </div>
            )
        }))
    ];
    return (
        <EditableCellDropdown<Transaction, "category_id">
            value={row}
            rowId={row.id}
            updateKey="category_id"
            apiUpdateFn={updateCategoryTransaction}
            onUpdated={(newCategoryId) => {
                const newCategory = allCategories.find(cat => cat.id === newCategoryId) || undefined;
                updateItemById({
                    id: row.id,
                    category: newCategory,
                });
            }}
            options={options}
            dropdownProps={{ placeholder: "No category" }}
            buttonRender={
                <div className="w-full flex items-center justify-between">
                    <span>{row.category?.name}</span>
                    <div className={`rounded-full w-4 h-4 bg-${row.category?.type == ETransactionType.INCOME ? 'success ' : 'danger'}`} />
                </div>
            }
        />
    );
}

export const getListTransactionColumnConfig = (allCategories: TransactionCategory[]): Column<Transaction>[] => [
    {
        key: "amount",
        label: "Amount",
        sortable: true,
        minWidth: "120px",
        width: "160px",
        render: (row) => (
            <EditableCellText
                value={row.amount ?? 0}
                rowId={row.id}
                apiUpdateFn={updateAmount}
                inputType="number"
                renderDisplay={v => (
                    <span className="text-text-secondary">
                        {/* {Number(v).toLocaleString("vi-VN", { style: "currency", currency: "VND" })} */}
                        {moneyDisplay(v)}
                    </span>
                )}
            />
        ),
    },
    {
        key: "category_id",
        label: "Category",
        minWidth: "160px",
        width: "180px",
        filter: {
            filterType: "dropdown",
            filterOptions: [
                { label: "All", value: '' },
                ...allCategories.map((cat): DropdownOption => ({
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
        render: (row) => <CategoryCell row={row} allCategories={allCategories} />
    },
    {
        key: "transaction_date",
        label: "Date",
        minWidth: "160px",
        width: "180px",
        filter: {
            filterType: "date-range"
        },
        render: (row) => {
            return <EditableCellDate
                value={row.transaction_date}
                rowId={row.id}
                apiUpdateFn={updateDate}
                dateFormat="en-GB"
            />
        },
    },
    {
        key: "note",
        label: "Note",
        minWidth: "200px",
        width: "360px",
        render: (row) => {
            return <EditableCellText
                value={row.note ?? ""}
                rowId={row.id}
                apiUpdateFn={updateNote}
                inputType="text"
                renderDisplay={v => (
                    <span className={"text-text-secondary"}>
                        {v}
                    </span>
                )}
                inputProps={{
                    placeholder: ""
                }}
            />
        },
    },
];

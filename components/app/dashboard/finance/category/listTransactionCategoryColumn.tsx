'use client'

import { Column } from "@/components/ui/view/table";
import { TransactionCategory, ETransactionType } from "@/model/finance/transaction";
import { EditableCellText } from "@/components/ui/view/editableCell";

export const ListTransactionCategoryColumnConfig: Column<TransactionCategory>[] = [
    {
        key: "name",
        label: "Category Name",
        minWidth: "100px",
        width: "150px",
        sortable: true,
        render: (row) => (
            <span className="font-medium text-text-primary">
                {row.name}
            </span>
        )
    },
    {
        key: "color",
        label: "Color",
        minWidth: "100px",
        width: "100px",
        render: (row) => {
            return (
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div 
                            className="w-6 h-6 rounded-full border-2 border-gray-200"
                            style={{ backgroundColor: row.color }}
                        />
                        <span className="text-sm text-text-secondary font-mono">
                            {row.color}
                        </span>
                        
                    </div>
                </div>
            );
        },
    },
];

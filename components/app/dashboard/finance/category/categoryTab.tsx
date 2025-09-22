'use client';

import { TabModel, Tab } from '@/components/ui/view/tab'
import { ListTransactionCategory } from "./listTransactionCategory";
import { ETransactionType } from "@/model/finance/transaction";


export default function FinacneCategoryTab() {
  const tabConfig : TabModel[] = [
        {
            label: "Income",
            key: "income",
            content: <ListTransactionCategory transactionType={ETransactionType.INCOME}/>
        },
        {
            label: "Exspense",
            key: "expense",
            // content: <></>
            content: <ListTransactionCategory transactionType={ETransactionType.EXPENSE}/>
        },
    ]

  return (
       <Tab
          nav={{
              sidebar: {
                align: 'left'
              }
          }}
          tabs={tabConfig}
       />
  );
}

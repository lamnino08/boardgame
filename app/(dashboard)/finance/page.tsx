import OverviewFinance from "@/components/app/dashboard/finance/analys/overviewFinance";
import FinacneCategoryTab from "@/components/app/dashboard/finance/category/categoryTab";
import ListTransaction from "@/components/app/dashboard/finance/transaction/listTransaction";
import { Tab, TabModel } from '@/components/ui/view/tab';



export default async function FinancePage() {
  const tabConfig : TabModel[] = [
    {
      label: "Transaction",
      key: "transaction",
      content: <ListTransaction />
    },
    {
      label: "Category",
      key: "category",
      content: <FinacneCategoryTab />
    },
  ]

  return (
    <div className="flex flex-col max-w-7xl mx-auto gap-2 p-4">
        <OverviewFinance />
       <Tab
          nav={{
              top: {
                align: 'center'
              }
          }}
          tabs={tabConfig}
       />
    </div>
  );
}
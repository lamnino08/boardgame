import { Card } from "@/components/ui/Card";
import { CreateTransactionCategoryForm } from "@/components/ui/form/app/transaction/create-transaction-category-form";


export default async function FinancePage() {

  return (
    <div className="max-w-7xl mx-auto p-4">
      <Card>
        <CreateTransactionCategoryForm />
      </Card>
    </div>
  );
}

import { WeekTransferCard, MonthTransferCard } from "./weekTransfer";

export default function OverviewFinance() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <WeekTransferCard />
      <MonthTransferCard />
    </div>
  );
}

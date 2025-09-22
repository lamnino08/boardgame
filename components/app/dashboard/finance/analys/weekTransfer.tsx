'use client'

import { Card } from "@/components/ui/Card";
import { TextInput } from "@/components/ui/form/base-component/text-input";
import { ETransactionType } from "@/model/finance/transaction";
import { useState, useEffect } from "react";
import { getWeekTransfer, getMonthTransfer } from "@/actions/transaction/analysAction";
import Dropdown, { DropdownOption } from "@/components/ui/form/base-component/dropdown";
import { moneyDisplay } from "@/utils/money";

interface TransferCardProps {
    label: string;
    fetchTransfer: (params: { date: Date; type: ETransactionType }) => Promise<any>;
    pickerType: 'week' | 'month';
}

function TransferCard({ label, fetchTransfer, pickerType }: TransferCardProps) {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [type, setType] = useState<ETransactionType>(ETransactionType.EXPENSE);
    const [amount, setAmount] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    const typeOptions: DropdownOption<ETransactionType>[] = [
        { label: 'Expense', value: ETransactionType.EXPENSE },
        { label: 'Income', value: ETransactionType.INCOME },
    ];

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            console.log({ date: selectedDate, type })
            const response = await fetchTransfer({ date: selectedDate, type });
            if (response.meta.success) {
                setAmount(response.data);
            } else {
                setAmount(null);
            }
            setLoading(false);
        };
        fetchData();
    }, [selectedDate, type, fetchTransfer, label]);

    // Format for input value
    const formatForInput = (date: Date) => {
        if (pickerType === 'week') {
            // YYYY-Www
            const year = date.getFullYear();
            // get week number
            const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
            const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
            const week = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
            return `${year}-W${week.toString().padStart(2, '0')}`;
        } else if (pickerType === 'month') {
            return date.toISOString().slice(0, 7);
        }
        return '';
    };

    // Parse from input value
    const handleDateChange = (val: string) => {
        if (pickerType === 'week') {
            // val: "YYYY-Www"
            const [year, week] = val.split('-W');
            // Set date to the first day of the week (Monday)
            const d = new Date(Number(year), 0, 1 + (Number(week) - 1) * 7);
            // Adjust to Monday
            const day = d.getDay();
            const diff = d.getDate() - day + (day === 0 ? -6 : 1);
            setSelectedDate(new Date(d.setDate(diff)));
        } else if (pickerType === 'month') {
            // val: "YYYY-MM"
            const [year, month] = val.split('-');
            setSelectedDate(new Date(Number(year), Number(month) - 1, 1));
        }
    };

    return (
        <Card>
            <div className="w-full flex items-center justify-between">
                <h3 className="text-lg font-semibold text-text-primary">{label}</h3>
                <div className="flex items-center justify-between mb-4 gap-2">
                    <TextInput
                        type={pickerType as any}
                        placeholder={pickerType === 'week' ? 'Select Week' : 'Select Month'}
                        value={formatForInput(selectedDate)}
                        onChange={handleDateChange}
                        size="sm"
                    />
                    <div className="w-36">
                        <Dropdown
                            options={typeOptions}
                            value={type}
                            onChange={setType}
                            size="sm"
                            placeholder="Select Type"
                        />
                    </div>
                </div>
            </div>
            {loading && <div className="text-center p-4">Loading...</div>}
            {amount !== null && !loading && (
                <p className="mt-2 text-lg font-semibold text-blue-600 text-center">
                        { moneyDisplay(amount) }
                        {/* {formatCurrency(amount)} */}
                </p>
            )}
        </Card>
    );
}

export function WeekTransferCard() {
    return <TransferCard label="Week" fetchTransfer={getWeekTransfer} pickerType="week" />;
}

export function MonthTransferCard() {
    return <TransferCard label="Month" fetchTransfer={getMonthTransfer} pickerType="month" />;
}

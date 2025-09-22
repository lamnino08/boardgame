import { BaseModel } from "@/model/base/base-model";

export interface TransactionCategory extends BaseModel {
  user_id: string;
  name: string;
  color: string;
  type: ETransactionType;
}

export interface Transaction extends BaseModel {
  user_id: string;
  category_id?: string | null;
  category?: TransactionCategory;
  amount?: number;
  transaction_date?: Date;
  note?: string | null;
  type?: ETransactionType
}

export interface BaseFinanceData {
  total_spent_week: number,
  total_spent_month: number
}

export enum ETransactionType {
  INCOME = "income",
  EXPENSE = "expense",
}

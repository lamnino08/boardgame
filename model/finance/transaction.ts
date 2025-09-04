import { BaseModel } from "@/model/base/base-model";

export interface TransactionCategory extends BaseModel {
  user_id: string;
  name: string;
  color: string;
}

export interface Transaction extends BaseModel {
  user_id: string;
  category_id?: string | null;
  amount: number;
  type: 'income' | 'expense';
  transaction_date: Date;
  note?: string | null;
}

export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
}

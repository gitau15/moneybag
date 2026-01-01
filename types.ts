
export enum TransactionType {
  INCOME = 'Income',
  EXPENSE = 'Expense'
}

export interface Transaction {
  id: string;
  date: string; // ISO string
  type: TransactionType;
  category: string;
  amount: number;
  note?: string;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  color: string;
}

export type AppTab = 'Dashboard' | 'Calendar' | 'Profile';

export interface User {
  name: string;
  email: string;
  avatar: string;
}

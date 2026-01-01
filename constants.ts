
import { TransactionType, Transaction, Goal } from './types';

export const CATEGORIES = {
  [TransactionType.INCOME]: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
  [TransactionType.EXPENSE]: [
    'International Trip',
    'Debt Payment',
    'Retirement',
    'Rent',
    'Groceries',
    'Dining Out',
    'Utilities',
    'Transport',
    'Shopping',
    'Other'
  ]
};

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    date: new Date().toISOString(),
    type: TransactionType.INCOME,
    category: 'Salary',
    amount: 5000,
  },
  {
    id: '2',
    date: new Date().toISOString(),
    type: TransactionType.EXPENSE,
    category: 'Rent',
    amount: 1200,
  },
  {
    id: '3',
    date: new Date().toISOString(),
    type: TransactionType.EXPENSE,
    category: 'International Trip',
    amount: 500,
  },
  {
    id: '4',
    date: new Date().toISOString(),
    type: TransactionType.EXPENSE,
    category: 'Debt Payment',
    amount: 300,
  }
];

export const GOAL_LIMITS = {
  TRIP: 0,
  DEBT: 0,
  RETIREMENT: 0,
};

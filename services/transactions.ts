// import { supabase } from '../supabase/client';
import axios from 'axios';
import { Transaction } from '../types';

export interface TransactionResponse {
  transaction: Transaction | null;
  error: string | null;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  error: string | null;
}

export interface Goal {
  trip: { current: number; target: number };
  debt: { current: number; target: number };
  retirement: { current: number; target: number };
}

export interface GoalsResponse {
  goals: Goal | null;
  error: string | null;
}

export const goalsService = {
  async getGoals(userId: string): Promise<GoalsResponse> {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await axios.get(`${BACKEND_URL}/api/goals/${userId}`);
      const { goals } = response.data;

      return { goals, error: null };
    } catch (error: any) {
      return { 
        goals: {
          trip: { current: 0, target: 0 },
          debt: { current: 0, target: 0 },
          retirement: { current: 0, target: 0 },
        }, 
        error: error.message 
      };
    }
  },

  async updateGoals(goals: Goal, userId: string): Promise<{ error: string | null }> {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      await axios.post(`${BACKEND_URL}/api/goals`, {
        user_id: userId,
        trip_target: goals.trip.target,
        debt_target: goals.debt.target,
        retirement_target: goals.retirement.target
      });

      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }
};

export const transactionService = {
  async getTransactions(userId: string): Promise<TransactionsResponse> {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await axios.get(`${BACKEND_URL}/api/transactions/${userId}`);
      const { transactions } = response.data;

      return { 
        transactions: transactions.map((dbTransaction: any) => ({
          id: dbTransaction.id,
          date: dbTransaction.date,
          type: dbTransaction.type,
          category: dbTransaction.category,
          amount: parseFloat(dbTransaction.amount),
          note: dbTransaction.note || undefined
        })), 
        error: null 
      };
    } catch (error: any) {
      return { transactions: [], error: error.message };
    }
  },

  async addTransaction(transaction: Omit<Transaction, 'id'>, userId: string): Promise<TransactionResponse> {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await axios.post(`${BACKEND_URL}/api/transactions`, {
        user_id: userId,
        ...transaction
      });

      const newTransaction: Transaction = {
        id: response.data.transaction.id,
        date: response.data.transaction.date,
        type: response.data.transaction.type,
        category: response.data.transaction.category,
        amount: parseFloat(response.data.transaction.amount),
        note: response.data.transaction.note || undefined
      };

      return { transaction: newTransaction, error: null };
    } catch (error: any) {
      return { transaction: null, error: error.message };
    }
  },

  async updateTransaction(transaction: Transaction, userId: string): Promise<TransactionResponse> {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await axios.put(`${BACKEND_URL}/api/transactions/${transaction.id}`, {
        date: transaction.date,
        type: transaction.type,
        category: transaction.category,
        amount: transaction.amount,
        note: transaction.note
      });

      const updatedTransaction: Transaction = {
        id: response.data.transaction.id,
        date: response.data.transaction.date,
        type: response.data.transaction.type,
        category: response.data.transaction.category,
        amount: parseFloat(response.data.transaction.amount),
        note: response.data.transaction.note || undefined
      };

      return { transaction: updatedTransaction, error: null };
    } catch (error: any) {
      return { transaction: null, error: error.message };
    }
  },

  async deleteTransaction(transactionId: string, userId: string): Promise<{ error: string | null }> {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      await axios.delete(`${BACKEND_URL}/api/transactions/${transactionId}`);

      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }
};
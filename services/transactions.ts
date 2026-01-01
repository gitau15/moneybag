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

export interface CustomGoal {
  id: string;
  name: string;
  current: number;
  target: number;
  color: string;
}

export interface Goal {
  customGoals: CustomGoal[];
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

      // If no goals exist, return empty array
      if (!goals) {
        return { 
          goals: { customGoals: [] }, 
          error: null 
        };
      }

      return { goals, error: null };
    } catch (error: any) {
      return { 
        goals: { customGoals: [] }, 
        error: error.message 
      };
    }
  },

  async updateGoals(goals: Goal, userId: string): Promise<{ error: string | null }> {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      await axios.post(`${BACKEND_URL}/api/goals`, {
        user_id: userId,
        customGoals: goals.customGoals
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
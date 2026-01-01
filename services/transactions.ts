// import { supabase } from '../supabase/client';
import axios, { AxiosError } from 'axios';
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
      console.error('Error fetching goals:', error);
      // Check if it's an Axios error to get more details
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        return { 
          goals: { customGoals: [] }, 
          error: (axiosError.response?.data as any)?.error || axiosError.message || 'Failed to fetch goals' 
        };
      }
      return { 
        goals: { customGoals: [] }, 
        error: error.message || 'Failed to fetch goals' 
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
      console.error('Error updating goals:', error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        return { error: (axiosError.response?.data as any)?.error || axiosError.message || 'Failed to update goals' };
      }
      return { error: error.message || 'Failed to update goals' };
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
      console.error('Error fetching transactions:', error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        return { 
          transactions: [], 
          error: (axiosError.response?.data as any)?.error || axiosError.message || 'Failed to fetch transactions' 
        };
      }
      return { 
        transactions: [], 
        error: error.message || 'Failed to fetch transactions' 
      };
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
      console.error('Error adding transaction:', error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        return { 
          transaction: null, 
          error: (axiosError.response?.data as any)?.error || axiosError.message || 'Failed to add transaction' 
        };
      }
      return { 
        transaction: null, 
        error: error.message || 'Failed to add transaction' 
      };
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
      console.error('Error updating transaction:', error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        return { 
          transaction: null, 
          error: (axiosError.response?.data as any)?.error || axiosError.message || 'Failed to update transaction' 
        };
      }
      return { 
        transaction: null, 
        error: error.message || 'Failed to update transaction' 
      };
    }
  },

  async deleteTransaction(transactionId: string, userId: string): Promise<{ error: string | null }> {
    try {
      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      await axios.delete(`${BACKEND_URL}/api/transactions/${transactionId}`);

      return { error: null };
    } catch (error: any) {
      console.error('Error deleting transaction:', error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        return { error: (axiosError.response?.data as any)?.error || axiosError.message || 'Failed to delete transaction' };
      }
      return { error: error.message || 'Failed to delete transaction' };
    }
  }
};
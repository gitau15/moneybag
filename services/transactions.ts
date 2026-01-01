import { supabase } from '../supabase/client';
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
      const { data, error } = await supabase
        .from('goals')
        .select('trip_target, trip_current, debt_target, debt_current, retirement_target, retirement_current')
        .eq('user_id', userId)
        .single();

      if (error) {
        // If no goals found, return default values
        if (error.code === 'PGRST116') {
          return {
            goals: {
              trip: { current: 0, target: 0 },
              debt: { current: 0, target: 0 },
              retirement: { current: 0, target: 0 },
            },
            error: null
          };
        }
        return { goals: null, error: error.message };
      }

      const goals: Goal = {
        trip: { current: parseFloat(data.trip_current) || 0, target: parseFloat(data.trip_target) || 0 },
        debt: { current: parseFloat(data.debt_current) || 0, target: parseFloat(data.debt_target) || 0 },
        retirement: { current: parseFloat(data.retirement_current) || 0, target: parseFloat(data.retirement_target) || 0 },
      };

      return { goals, error: null };
    } catch (error: any) {
      return { goals: null, error: error.message };
    }
  },

  async updateGoals(goals: Goal, userId: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('goals')
        .upsert({
          user_id: userId,
          trip_target: goals.trip.target,
          trip_current: goals.trip.current,
          debt_target: goals.debt.target,
          debt_current: goals.debt.current,
          retirement_target: goals.retirement.target,
          retirement_current: goals.retirement.current
        });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }
};

export const transactionService = {
  async getTransactions(userId: string): Promise<TransactionsResponse> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) {
        return { transactions: [], error: error.message };
      }

      const transactions = data.map((dbTransaction: any) => ({
        id: dbTransaction.id,
        date: dbTransaction.date,
        type: dbTransaction.type,
        category: dbTransaction.category,
        amount: parseFloat(dbTransaction.amount),
        note: dbTransaction.note || undefined
      }));

      return { transactions, error: null };
    } catch (error: any) {
      return { transactions: [], error: error.message };
    }
  },

  async addTransaction(transaction: Omit<Transaction, 'id'>, userId: string): Promise<TransactionResponse> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            user_id: userId,
            date: transaction.date,
            type: transaction.type,
            category: transaction.category,
            amount: transaction.amount,
            note: transaction.note
          }
        ])
        .select()
        .single();

      if (error) {
        return { transaction: null, error: error.message };
      }

      const newTransaction: Transaction = {
        id: data.id,
        date: data.date,
        type: data.type,
        category: data.category,
        amount: parseFloat(data.amount),
        note: data.note || undefined
      };

      return { transaction: newTransaction, error: null };
    } catch (error: any) {
      return { transaction: null, error: error.message };
    }
  },

  async updateTransaction(transaction: Transaction, userId: string): Promise<TransactionResponse> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update({
          date: transaction.date,
          type: transaction.type,
          category: transaction.category,
          amount: transaction.amount,
          note: transaction.note
        })
        .eq('id', transaction.id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        return { transaction: null, error: error.message };
      }

      const updatedTransaction: Transaction = {
        id: data.id,
        date: data.date,
        type: data.type,
        category: data.category,
        amount: parseFloat(data.amount),
        note: data.note || undefined
      };

      return { transaction: updatedTransaction, error: null };
    } catch (error: any) {
      return { transaction: null, error: error.message };
    }
  },

  async deleteTransaction(transactionId: string, userId: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId)
        .eq('user_id', userId);

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }
};
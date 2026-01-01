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
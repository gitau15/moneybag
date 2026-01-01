
import React, { useState } from 'react';
import { X, Save, DollarSign, Calendar, Tag } from 'lucide-react';
import { TransactionType, Transaction } from '../types';
import { CATEGORIES } from '../constants';

interface TransactionFormProps {
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
  onClose: () => void;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onSave, onClose }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[TransactionType.EXPENSE][0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount))) return;
    
    onSave({
      date: new Date(date).toISOString(),
      type,
      category,
      amount: Number(amount)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center px-4 pb-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Add Transaction</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Type Toggle */}
          <div className="flex p-1 bg-slate-100 rounded-2xl">
            {(Object.values(TransactionType)).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setType(t);
                  setCategory(CATEGORIES[t][0]);
                }}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
                  type === t 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Amount Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Amount</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <DollarSign size={20} />
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                className="w-full bg-slate-50 border-0 rounded-2xl py-4 pl-12 pr-4 text-2xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Category</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Tag size={16} />
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border-0 rounded-2xl py-3 pl-10 pr-4 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 appearance-none"
                >
                  {CATEGORIES[type].map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>

            {/* Date Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Date</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Calendar size={16} />
                </div>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border-0 rounded-2xl py-3 pl-10 pr-4 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
          >
            <Save size={20} />
            <span>Save Transaction</span>
          </button>
        </form>
      </div>
    </div>
  );
};

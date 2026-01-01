
import React, { useMemo, useState, useEffect } from 'react';
import { Transaction, TransactionType } from '../types';
import { formatCurrency } from '../utils';
import { GOAL_LIMITS } from '../constants';
import { goalsService, Goal } from '../services/transactions';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { TrendingUp, TrendingDown, Target, Wallet, DollarSign } from 'lucide-react';

interface DashboardProps {
  transactions: Transaction[];
  userId?: string; // Add userId for backend operations
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions, userId }) => {
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);
  
  const handleGoalChange = async (goalId: string, value: number) => {
    setGoals(prev => ({
      ...prev,
      customGoals: prev.customGoals.map(goal => 
        goal.id === goalId ? { ...goal, target: value } : goal
      )
    }));
    
    // If user is logged in, save goals to backend
    if (userId) {
      try {
        await goalsService.updateGoals(goals, userId);
      } catch (error) {
        console.error('Error saving goals:', error);
      }
    }
  };
  
  const handleAddGoal = () => {
    const newGoal = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Goal ${goals.customGoals.length + 1}`,
      current: 0,
      target: 0,
      color: `#${Math.floor(Math.random()*16777215).toString(16)}` // random color
    };
    
    setGoals(prev => ({
      ...prev,
      customGoals: [...prev.customGoals, newGoal]
    }));
  };
  
  const handleGoalNameChange = (goalId: string, newName: string) => {
    setGoals(prev => ({
      ...prev,
      customGoals: prev.customGoals.map(goal => 
        goal.id === goalId ? { ...goal, name: newName } : goal
      )
    }));
  };
  const totals = useMemo(() => {
    return transactions.reduce(
      (acc, t) => {
        if (t.type === TransactionType.INCOME) acc.income += t.amount;
        else acc.expense += t.amount;
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }, [transactions]);

  const balance = totals.income - totals.expense;

  const [goals, setGoals] = useState<Goal>({ customGoals: [] });

  useEffect(() => {
    // Calculate current amounts from transactions and update goals
    setGoals(prev => {
      const updatedGoals = { ...prev };
      
      // Update current values based on transactions
      updatedGoals.customGoals = updatedGoals.customGoals.map(goal => {
        // Calculate current value based on transactions for this goal category
        const categoryTotal = transactions
          .filter(t => t.category.toLowerCase().includes(goal.name.toLowerCase()))
          .reduce((sum, t) => sum + t.amount, 0);
          
        return { ...goal, current: categoryTotal };
      });
      
      return updatedGoals;
    });
  }, [transactions]);

  const goalData = goals.customGoals;

  const chartData = useMemo(() => {
    const grouped = transactions.reduce((acc: any, t) => {
      acc[t.type] = (acc[t.type] || 0) + t.amount;
      return acc;
    }, {});
    return [
      { name: 'Income', value: grouped[TransactionType.INCOME] || 0, color: '#10b981' },
      { name: 'Expense', value: grouped[TransactionType.EXPENSE] || 0, color: '#f43f5e' },
    ];
  }, [transactions]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 text-sm font-medium">Your financial overview</p>
        </div>
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
           <Wallet className="text-indigo-600" size={24} />
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <div className="relative z-10">
          <p className="text-indigo-100 text-sm font-medium mb-1">Total Balance</p>
          <h2 className="text-4xl font-bold mb-6 tracking-tight">{formatCurrency(balance)}</h2>
          <div className="flex justify-between items-center pt-4 border-t border-white/10">
            <div className="flex items-center space-x-2">
              <div className="bg-emerald-400/20 p-2 rounded-xl">
                <TrendingUp size={16} className="text-emerald-300" />
              </div>
              <div>
                <p className="text-[10px] text-indigo-100 uppercase font-bold tracking-wider">Income</p>
                <p className="text-sm font-semibold">{formatCurrency(totals.income)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-rose-400/20 p-2 rounded-xl">
                <TrendingDown size={16} className="text-rose-300" />
              </div>
              <div>
                <p className="text-[10px] text-indigo-100 uppercase font-bold tracking-wider">Expense</p>
                <p className="text-sm font-semibold">{formatCurrency(totals.expense)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Goal Progress */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <Target className="text-indigo-600" size={20} />
            <h3 className="font-bold text-slate-800">Financial Goals</h3>
          </div>
          <button 
            onClick={() => setIsGoalFormOpen(!isGoalFormOpen)}
            className="text-xs font-bold text-indigo-600 hover:underline"
          >
            {isGoalFormOpen ? 'Hide' : 'Edit'} Goals
          </button>
        </div>
        
        {isGoalFormOpen && (
          <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-slate-700">Set Your Goals</h4>
              <button 
                type="button" 
                onClick={handleAddGoal}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                + Add Goal
              </button>
            </div>
            <div className="space-y-4">
              {goals.customGoals.map((goal) => (
                <div key={goal.id} className="flex items-center space-x-3">
                  <div className="w-32">
                    <input
                      type="text"
                      value={goal.name}
                      onChange={(e) => handleGoalNameChange(goal.id, e.target.value)}
                      placeholder="Goal name"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 px-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <DollarSign size={16} />
                    </div>
                    <input
                      type="number"
                      value={goal.target}
                      onChange={(e) => handleGoalChange(goal.id, Number(e.target.value))}
                      placeholder="Goal amount"
                      className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-8 pr-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              ))}
              {goals.customGoals.length === 0 && (
                <p className="text-sm text-slate-500 italic">No goals yet. Click "Add Goal" to create your first financial goal.</p>
              )}
            </div>
          </div>
        )}
        
        <div className="space-y-6">
          {goalData.map((goal) => {
            const progress = goal.target > 0 ? Math.min((goal.current / goal.target) * 100, 100) : 0;
            return (
              <div key={goal.name}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-slate-700">{goal.name}</span>
                  <span className="text-slate-500 font-medium">
                    {formatCurrency(goal.current)} / {formatCurrency(goal.target)}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${progress}%`,
                      backgroundColor: goal.color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Chart */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-6">Cash Flow</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
              />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

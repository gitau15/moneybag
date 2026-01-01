
import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType } from '../types';
import { getMonthDays, getFirstDayOfMonth, formatCurrency } from '../utils';
import { ChevronLeft, ChevronRight, History } from 'lucide-react';

interface CalendarViewProps {
  transactions: Transaction[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ transactions }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();
  const daysInMonth = getMonthDays(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1));

  const dailyTransactions = useMemo(() => {
    if (!selectedDate) return [];
    const dateStr = selectedDate.toDateString();
    return transactions.filter(t => new Date(t.date).toDateString() === dateStr);
  }, [transactions, selectedDate]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Calendar</h2>
        <div className="flex items-center space-x-1 bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
            <ChevronLeft size={20} className="text-slate-600" />
          </button>
          <span className="px-4 font-bold text-slate-800 text-sm min-w-[120px] text-center">
            {monthNames[month]} {year}
          </span>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
            <ChevronRight size={20} className="text-slate-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
            <div key={d} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d}</div>
          ))}
          {blanks.map(b => <div key={`b-${b}`} />)}
          {days.map(d => {
            const dateObj = new Date(year, month, d);
            const isSelected = selectedDate?.toDateString() === dateObj.toDateString();
            const isToday = new Date().toDateString() === dateObj.toDateString();
            const hasActivity = transactions.some(t => new Date(t.date).toDateString() === dateObj.toDateString());

            return (
              <button
                key={d}
                onClick={() => setSelectedDate(dateObj)}
                className={`h-10 w-full flex flex-col items-center justify-center rounded-xl text-sm font-medium transition-all relative ${
                  isSelected 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                    : isToday 
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {d}
                {hasActivity && !isSelected && (
                  <div className="absolute bottom-1 w-1 h-1 rounded-full bg-indigo-300"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Activity */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 min-h-[300px]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <History className="text-indigo-600" size={20} />
            <h3 className="font-bold text-slate-800">
              {selectedDate?.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}
            </h3>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {dailyTransactions.length} events
          </span>
        </div>

        {dailyTransactions.length > 0 ? (
          <div className="space-y-4">
            {dailyTransactions.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group transition-all hover:bg-white hover:shadow-md hover:border-transparent">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${
                    t.type === TransactionType.INCOME ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {t.type === TransactionType.INCOME ? <ChevronLeft className="rotate-90" size={18} /> : <ChevronLeft className="-rotate-90" size={18} />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{t.category}</p>
                    <p className="text-xs text-slate-500">{t.type}</p>
                  </div>
                </div>
                <div className={`font-bold ${
                  t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-slate-800'
                }`}>
                  {t.type === TransactionType.INCOME ? '+' : '-'}{formatCurrency(t.amount)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <div className="bg-slate-50 p-6 rounded-full mb-4">
              <History size={32} strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium italic">No activity recorded for this day.</p>
          </div>
        )}
      </div>
    </div>
  );
};

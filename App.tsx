
import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { CalendarView } from './components/CalendarView';
import { Profile } from './components/Profile';
import { TransactionForm } from './components/TransactionForm';
import { AppTab, Transaction } from './types';
import { INITIAL_TRANSACTIONS } from './constants';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<AppTab>('Dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('moneybag_transactions');
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved transactions');
      }
    }
  }, []);

  // Sync data to localStorage
  useEffect(() => {
    localStorage.setItem('moneybag_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('Dashboard');
  };

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTransactions(prev => [transaction, ...prev]);
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <>
      <Layout 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        onAddClick={() => setIsFormOpen(true)}
      >
        {activeTab === 'Dashboard' && <Dashboard transactions={transactions} />}
        {activeTab === 'Calendar' && <CalendarView transactions={transactions} />}
        {activeTab === 'Profile' && <Profile onLogout={handleLogout} />}
      </Layout>

      {isFormOpen && (
        <TransactionForm 
          onSave={handleAddTransaction} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}
    </>
  );
};

export default App;

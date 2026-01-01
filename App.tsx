
import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { CalendarView } from './components/CalendarView';
import { Profile } from './components/Profile';
import { TransactionForm } from './components/TransactionForm';
import { AppTab, Transaction, User } from './types';
import { INITIAL_TRANSACTIONS } from './constants';
import { authService } from './services/auth';
import { transactionService } from './services/transactions';
import { supabase } from './supabase/client';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<AppTab>('Dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const user = await authService.getCurrentUser();
      if (user) {
        setIsAuthenticated(true);
        setCurrentUser(user);
        // Load user's transactions from Supabase
        loadTransactions(user);
      }
    };
    
    checkAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setTransactions(INITIAL_TRANSACTIONS);
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load transactions when user authenticates
  const loadTransactions = async (user: User) => {
    if (user) {
      const { transactions, error } = await transactionService.getTransactions(user.email || user.name);
      if (error) {
        console.error('Error loading transactions:', error);
        // Fallback to initial transactions
        setTransactions(INITIAL_TRANSACTIONS);
      } else {
        setTransactions(transactions);
      }
    }
  };

  const handleLogin = (user: User) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
  };
  const handleLogout = async () => {
    await authService.signOut();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setActiveTab('Dashboard');
    setTransactions(INITIAL_TRANSACTIONS);
  };

  const handleAddTransaction = async (newTransaction: Omit<Transaction, 'id'>) => {
    if (!currentUser) return;
    
    const { transaction, error } = await transactionService.addTransaction(newTransaction, currentUser.email || currentUser.name);
    if (error) {
      console.error('Error adding transaction:', error);
      return;
    }
    
    if (transaction) {
      setTransactions(prev => [transaction, ...prev]);
    }
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

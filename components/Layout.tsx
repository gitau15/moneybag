
import React from 'react';
import { LayoutDashboard, Calendar, User, Plus } from 'lucide-react';
import { AppTab } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  onAddClick: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, onAddClick }) => {
  const tabs = [
    { id: 'Dashboard', icon: LayoutDashboard },
    { id: 'Calendar', icon: Calendar },
    { id: 'Profile', icon: User },
  ] as const;

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-slate-50 shadow-2xl relative overflow-hidden">
      {/* Main Content Area */}
      <main className="flex-1 pb-24 overflow-y-auto custom-scrollbar px-4 pt-6">
        {children}
      </main>

      {/* Floating Add Button */}
      <button
        onClick={onAddClick}
        className="fixed bottom-24 right-8 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-all active:scale-95 z-50 md:right-[calc(50%-180px)]"
      >
        <Plus size={24} />
      </button>

      {/* Bottom Tab Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 px-6 py-4 flex justify-between items-center max-w-md mx-auto z-40">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center space-y-1 transition-colors ${
                isActive ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium uppercase tracking-wider">{tab.id}</span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-indigo-600 absolute -bottom-0"></div>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};


import React from 'react';
import { Settings, Shield, Bell, HelpCircle, LogOut, ExternalLink, Mail, Award } from 'lucide-react';

import { User } from '../types';

interface ProfileProps {
  user: User;
  onLogout: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  const menuItems = [
    { icon: Shield, label: 'Privacy & Security', color: 'bg-blue-50 text-blue-600' },
    { icon: Bell, label: 'Notifications', color: 'bg-amber-50 text-amber-600' },
    { icon: HelpCircle, label: 'Help & Support', color: 'bg-purple-50 text-purple-600' },
    { icon: Settings, label: 'Preferences', color: 'bg-slate-50 text-slate-600' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col items-center text-center space-y-4 pt-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-3xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-3xl shadow-inner relative overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt="Profile" className="object-cover w-full h-full" />
            ) : (
              <div className="w-full h-full bg-indigo-200 flex items-center justify-center text-indigo-800">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg border border-slate-50">
            <Award size={16} className="text-amber-500" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{user.name || 'User'}</h2>
          <div className="flex items-center space-x-2 justify-center text-slate-500 text-sm mt-1">
            <Mail size={14} />
            <span>{user.email || 'No email'}</span>
          </div>
        </div>
        <button className="bg-indigo-50 text-indigo-600 px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-indigo-100 transition-colors">
          Edit Profile
        </button>
      </div>

      <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100">
        <div className="space-y-1">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all group"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${item.color}`}>
                    <Icon size={20} />
                  </div>
                  <span className="font-semibold text-slate-700 text-sm">{item.label}</span>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-indigo-600 rounded-3xl p-6 text-white flex justify-between items-center relative overflow-hidden group shadow-lg shadow-indigo-100">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-xl group-hover:scale-110 transition-transform"></div>
        <div>
          <h4 className="font-bold mb-1">MoneyBag Pro</h4>
          <p className="text-indigo-100 text-xs font-medium">Unlock advanced reports and syncing.</p>
        </div>
        <ExternalLink size={20} />
      </div>

      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center space-x-2 p-4 text-rose-500 font-bold bg-rose-50 rounded-3xl hover:bg-rose-100 transition-colors"
      >
        <LogOut size={18} />
        <span>Logout Session</span>
      </button>

      <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] pb-8">
        v2.5.0 • 2026 Edition
      </p>
    </div>
  );
};

const ChevronRight = ({ size, className }: { size: number, className: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
);

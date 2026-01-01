
import React, { useState } from 'react';
import { Lock, Mail, User, ArrowRight, Wallet, Loader2 } from 'lucide-react';
import { authService } from '../services/auth';
import { User as UserType } from '../types';

interface AuthProps {
  onLogin: (user: UserType) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (showForgotPasswordForm) {
      // Handle password reset request
      const { error } = await authService.sendPasswordResetEmail(resetEmail);
      if (error) {
        setError(error);
      } else {
        setResetSuccess(true);
        // Reset the form after successful request
        setTimeout(() => {
          setShowForgotPasswordForm(false);
          setResetSuccess(false);
          setResetEmail('');
        }, 3000);
      }
    } else {
      if (isLogin) {
        // Sign in
        const { user, error } = await authService.signIn(email, password);
        if (error) {
          setError(error);
          setLoading(false);
          return;
        }
        if (user) {
          onLogin(user);
        }
      } else {
        // Sign up
        const { user, error } = await authService.signUp(email, password, name);
        if (error) {
          setError(error);
          setLoading(false);
          return;
        }
        if (user) {
          onLogin(user);
        }
      }
    }
    
    setLoading(false);
  };
  
  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowForgotPasswordForm(true);
    setResetSuccess(false);
    setError(null);
  };
  
  const handleBackToLogin = () => {
    setShowForgotPasswordForm(false);
    setResetEmail('');
    setResetSuccess(false);
    setError(null);
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-white flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col items-center text-center">
          <div className="bg-indigo-600 p-4 rounded-3xl shadow-xl shadow-indigo-100 mb-6">
            <Wallet className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">MoneyBag</h1>
          <p className="text-slate-500 mt-2 font-medium">Simplify your financial future.</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
            {error}
          </div>
        )}

        <div className="bg-slate-50 p-1 rounded-2xl flex">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
              isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
              !isLogin ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                required
                className="w-full bg-slate-50 border-0 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
              className="w-full bg-slate-50 border-0 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full bg-slate-50 border-0 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          {isLogin && (
            <div className="text-right">
              <button 
                type="button" 
                onClick={handleForgotPassword}
                className="text-xs font-bold text-indigo-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>
                  {showForgotPasswordForm ? 'Sending Reset Email...' : 
                   isLogin ? 'Signing In...' : 'Creating Account...'}
                </span>
              </>
            ) : (
              <>
                <span>
                  {showForgotPasswordForm ? 'Send Reset Email' : 
                   isLogin ? 'Welcome Back' : 'Create Account'}
                </span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {showForgotPasswordForm ? (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Reset Password</h3>
              <button 
                type="button" 
                onClick={handleBackToLogin}
                className="text-indigo-600 hover:underline text-sm font-medium"
              >
                Back to Login
              </button>
            </div>
            
            {resetSuccess ? (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-2xl text-sm">
                Password reset link sent! Check your email to reset your password.
              </div>
            ) : (
              <>
                <p className="text-slate-600 text-sm mb-4">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                <div className="relative mb-4">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Email Address"
                    required
                    className="w-full bg-slate-50 border-0 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="text-center pt-8">
            <p className="text-xs text-slate-400 font-medium">
              By continuing, you agree to our <span className="text-slate-900 underline">Terms of Service</span> and <span className="text-slate-900 underline">Privacy Policy</span>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

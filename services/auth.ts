import { supabase } from '../supabase/client';
import { User } from '../types';

export interface AuthResponse {
  user: User | null;
  error: string | null;
}

export const authService = {
  async signUp(email: string, password: string, name: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          }
        }
      });

      if (error) {
        return { user: null, error: error.message };
      }

      const user = data.user ? {
        name: data.user.user_metadata.name || '',
        email: data.user.email || '',
        avatar: data.user.user_metadata.avatar || ''
      } : null;

      return { user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      const user = data.user ? {
        name: data.user.user_metadata.name || '',
        email: data.user.email || '',
        avatar: data.user.user_metadata.avatar || ''
      } : null;

      return { user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  },

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
      
    if (user) {
      return {
        name: user.user_metadata.name || user.email?.split('@')[0] || '',
        email: user.email || '',
        avatar: user.user_metadata.avatar || ''
      };
    }
      
    return null;
  },
  
  async sendPasswordResetEmail(email: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`,
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
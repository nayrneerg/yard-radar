import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { UserRole } from '@/types';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser, setSession, setProfile, reset } = useAuthStore();

  const signUp = async (email: string, password: string, fullName: string, role: UserRole) => {
    setLoading(true); setError(null);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) throw authError;
      if (!authData.user) throw new Error('No user returned from signup');
      const { error: profileError } = await supabase.from('profiles').insert({ user_id: authData.user.id, full_name: fullName, role });
      if (profileError) throw profileError;
      setUser(authData.user); setSession(authData.session);
      return { success: true };
    } catch (err) { const message = err instanceof Error ? err.message : 'Signup failed'; setError(message); return { success: false, error: message }; }
    finally { setLoading(false); }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true); setError(null);
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      if (!data.user) throw new Error('No user returned from login');
      setUser(data.user); setSession(data.session);
      const { data: profileData, error: profileError } = await supabase.from('profiles').select('*').eq('user_id', data.user.id).single();
      if (!profileError && profileData) setProfile(profileData);
      return { success: true };
    } catch (err) { const message = err instanceof Error ? err.message : 'Login failed'; setError(message); return { success: false, error: message }; }
    finally { setLoading(false); }
  };

  const signOut = async () => {
    setLoading(true); setError(null);
    try { const { error: signOutError } = await supabase.auth.signOut(); if (signOutError) throw signOutError; reset(); return { success: true }; }
    catch (err) { const message = err instanceof Error ? err.message : 'Logout failed'; setError(message); return { success: false, error: message }; }
    finally { setLoading(false); }
  };

  const resetPassword = async (email: string) => {
    setLoading(true); setError(null);
    try { const { error: resetError } = await supabase.auth.resetPasswordForEmail(email); if (resetError) throw resetError; return { success: true }; }
    catch (err) { const message = err instanceof Error ? err.message : 'Password reset failed'; setError(message); return { success: false, error: message }; }
    finally { setLoading(false); }
  };

  return { signUp, signIn, signOut, resetPassword, loading, error };
};
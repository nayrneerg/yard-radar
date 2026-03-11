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
      const { data, error: e } = await supabase.auth.signUp({ email, password });
      if (e) throw e;
      if (!data.user) throw new Error('No user returned');
      await supabase.from('profiles').insert({ user_id: data.user.id, full_name: fullName, role });
      setUser(data.user); setSession(data.session);
      return { success: true };
    } catch (err: any) { setError(err.message); return { success: false, error: err.message }; }
    finally { setLoading(false); }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true); setError(null);
    try {
      const { data, error: e } = await supabase.auth.signInWithPassword({ email, password });
      if (e) throw e;
      setUser(data.user); setSession(data.session);
      const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', data.user.id).single();
      if (profile) setProfile(profile);
      return { success: true };
    } catch (err: any) { setError(err.message); return { success: false, error: err.message }; }
    finally { setLoading(false); }
  };

  const signOut = async () => {
    setLoading(true);
    try { await supabase.auth.signOut(); reset(); return { success: true }; }
    catch (err: any) { setError(err.message); return { success: false, error: err.message }; }
    finally { setLoading(false); }
  };

  return { signUp, signIn, signOut, loading, error };
};
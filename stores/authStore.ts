import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { Profile } from '@/types';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null, session: null, profile: null, isLoading: true, isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setSession: (session) => set({ session, isAuthenticated: !!session }),
  setProfile: (profile) => set({ profile }),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ user: null, session: null, profile: null, isLoading: false, isAuthenticated: false }),
}));
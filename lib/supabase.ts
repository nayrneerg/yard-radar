import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) { console.error('Missing Supabase environment variables'); }

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { storage: AsyncStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; user_id: string; full_name: string; role: 'host' | 'shopper'; phone: string | null; avatar_url: string | null; created_at: string; updated_at: string; };
        Insert: { id?: string; user_id: string; full_name: string; role: 'host' | 'shopper'; phone?: string | null; avatar_url?: string | null; };
        Update: { id?: string; user_id?: string; full_name?: string; role?: 'host' | 'shopper'; phone?: string | null; avatar_url?: string | null; };
      };
      sales: {
        Row: { id: string; host_id: string; title: string; description: string; start_date: string; end_date: string; start_time: string; end_time: string; latitude: number; longitude: number; address: string | null; city: string | null; state: string | null; zip: string | null; categories: string[]; image_urls: string[]; is_active: boolean; created_at: string; updated_at: string; };
        Insert: { id?: string; host_id: string; title: string; description: string; start_date: string; end_date: string; start_time: string; end_time: string; latitude: number; longitude: number; address?: string | null; city?: string | null; state?: string | null; zip?: string | null; categories: string[]; image_urls?: string[]; is_active?: boolean; };
        Update: { title?: string; description?: string; start_date?: string; end_date?: string; start_time?: string; end_time?: string; latitude?: number; longitude?: number; address?: string | null; city?: string | null; state?: string | null; zip?: string | null; categories?: string[]; image_urls?: string[]; is_active?: boolean; };
      };
    };
  };
};
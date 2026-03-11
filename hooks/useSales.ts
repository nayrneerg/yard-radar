import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Sale } from '@/types';
import { queryKeys } from '@/lib/queryClient';
import { useAuthStore } from '@/stores/authStore';

const calcDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 3959;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const transform = (row: any): Sale => ({
  id: row.id, host_id: row.host_id, title: row.title, description: row.description,
  start_date: row.start_date, end_date: row.end_date, start_time: row.start_time, end_time: row.end_time,
  location: { latitude: row.latitude, longitude: row.longitude, address: row.address, city: row.city, state: row.state, zip: row.zip },
  categories: row.categories, image_urls: row.image_urls ?? [], is_active: row.is_active,
  created_at: row.created_at, updated_at: row.updated_at, host: row.profiles,
});

export const useNearbySales = (latitude?: number, longitude?: number, radiusMiles = 10) =>
  useQuery({
    queryKey: latitude && longitude ? queryKeys.sales.nearby(latitude, longitude, radiusMiles) : ['sales', 'none'],
    queryFn: async () => {
      if (!latitude || !longitude) return [];
      const { data, error } = await supabase.from('sales')
        .select('*, profiles!sales_host_id_fkey(id, full_name, avatar_url)')
        .eq('is_active', true).gte('end_date', new Date().toISOString().split('T')[0]);
      if (error) throw error;
      return data.map((s: any) => ({ ...transform(s), distance: calcDistance(latitude, longitude, s.latitude, s.longitude) }))
        .filter(s => s.distance! <= radiusMiles).sort((a, b) => a.distance! - b.distance!);
    },
    enabled: !!latitude && !!longitude,
  });

export const useSale = (saleId: string) =>
  useQuery({
    queryKey: queryKeys.sales.byId(saleId),
    queryFn: async () => {
      const { data, error } = await supabase.from('sales')
        .select('*, profiles!sales_host_id_fkey(id, full_name, phone, avatar_url)')
        .eq('id', saleId).single();
      if (error) throw error;
      return transform(data);
    },
    enabled: !!saleId,
  });

export const useUserSales = () => {
  const user = useAuthStore(s => s.user);
  return useQuery({
    queryKey: user ? queryKeys.sales.byHost(user.id) : ['sales', 'none'],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase.from('sales').select('*').eq('host_id', user.id).order('created_at', { ascending: false });
      if (error) throw error;
      return data.map(transform);
    },
    enabled: !!user,
  });
};

export const useCreateSale = () => {
  const qc = useQueryClient();
  const user = useAuthStore(s => s.user);
  return useMutation({
    mutationFn: async (sale: Omit<Sale, 'id' | 'created_at' | 'updated_at' | 'host_id'>) => {
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase.from('sales').insert({
        host_id: user.id, title: sale.title, description: sale.description,
        start_date: sale.start_date, end_date: sale.end_date, start_time: sale.start_time, end_time: sale.end_time,
        latitude: sale.location.latitude, longitude: sale.location.longitude,
        address: sale.location.address, city: sale.location.city, state: sale.location.state, zip: sale.location.zip,
        categories: sale.categories, image_urls: sale.image_urls, is_active: sale.is_active,
      }).select().single();
      if (error) throw error;
      return transform(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.sales.all }),
  });
};

export const useDeleteSale = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (saleId: string) => {
      const { error } = await supabase.from('sales').delete().eq('id', saleId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.sales.all }),
  });
};
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Sale } from '@/types';
import { queryKeys } from '@/lib/queryClient';
import { useAuthStore } from '@/stores/authStore';

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Transform database row to Sale object
const transformSale = (row: any): Sale => {
  return {
    id: row.id,
    host_id: row.host_id,
    title: row.title,
    description: row.description,
    start_date: row.start_date,
    end_date: row.end_date,
    start_time: row.start_time,
    end_time: row.end_time,
    location: {
      latitude: row.latitude,
      longitude: row.longitude,
      address: row.address,
      city: row.city,
      state: row.state,
      zip: row.zip,
    },
    categories: row.categories,
    image_urls: row.image_urls,
    is_active: row.is_active,
    created_at: row.created_at,
    updated_at: row.updated_at,
    host: row.profiles,
  };
};

export const useNearbySales = (
  latitude?: number,
  longitude?: number,
  radiusMiles: number = 10
) => {
  return useQuery({
    queryKey: latitude && longitude 
      ? queryKeys.sales.nearby(latitude, longitude, radiusMiles)
      : ['sales', 'nearby', 'no-location'],
    queryFn: async () => {
      if (!latitude || !longitude) {
        return [];
      }

      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          profiles!sales_host_id_fkey(
            id,
            full_name,
            avatar_url
          )
        `)
        .eq('is_active', true)
        .gte('end_date', new Date().toISOString().split('T')[0]);

      if (error) throw error;

      // Filter by distance and add distance to each sale
      const salesWithDistance = data
        .map((sale: any) => {
          const distance = calculateDistance(
            latitude,
            longitude,
            sale.latitude,
            sale.longitude
          );
          return {
            ...transformSale(sale),
            distance,
          };
        })
        .filter((sale) => sale.distance && sale.distance <= radiusMiles)
        .sort((a, b) => (a.distance || 0) - (b.distance || 0));

      return salesWithDistance as Sale[];
    },
    enabled: !!latitude && !!longitude,
  });
};

export const useSale = (saleId: string) => {
  return useQuery({
    queryKey: queryKeys.sales.byId(saleId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales')
        .select(`
          *,
          profiles!sales_host_id_fkey(
            id,
            full_name,
            phone,
            avatar_url
          )
        `)
        .eq('id', saleId)
        .single();

      if (error) throw error;
      return transformSale(data);
    },
    enabled: !!saleId,
  });
};

export const useUserSales = () => {
  const user = useAuthStore((state) => state.user);
  
  return useQuery({
    queryKey: user ? queryKeys.sales.byHost(user.id) : ['sales', 'user', 'none'],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .eq('host_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(transformSale);
    },
    enabled: !!user,
  });
};

export const useCreateSale = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  return useMutation({
    mutationFn: async (sale: Omit<Sale, 'id' | 'created_at' | 'updated_at' | 'host_id'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('sales')
        .insert({
          host_id: user.id,
          title: sale.title,
          description: sale.description,
          start_date: sale.start_date,
          end_date: sale.end_date,
          start_time: sale.start_time,
          end_time: sale.end_time,
          latitude: sale.location.latitude,
          longitude: sale.location.longitude,
          address: sale.location.address,
          city: sale.location.city,
          state: sale.location.state,
          zip: sale.location.zip,
          categories: sale.categories,
          image_urls: sale.image_urls,
          is_active: sale.is_active,
        })
        .select()
        .single();

      if (error) throw error;
      return transformSale(data);
    },
    onSuccess: () => {
      // Invalidate and refetch nearby sales and user sales
      queryClient.invalidateQueries({ queryKey: queryKeys.sales.all });
      if (user) {
        queryClient.invalidateQueries({ queryKey: queryKeys.sales.byHost(user.id) });
      }
    },
  });
};

export const useUpdateSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string; 
      updates: Partial<Omit<Sale, 'id' | 'created_at' | 'updated_at' | 'host_id'>> 
    }) => {
      const dbUpdates: any = {
        updated_at: new Date().toISOString(),
      };

      if (updates.title) dbUpdates.title = updates.title;
      if (updates.description) dbUpdates.description = updates.description;
      if (updates.start_date) dbUpdates.start_date = updates.start_date;
      if (updates.end_date) dbUpdates.end_date = updates.end_date;
      if (updates.start_time) dbUpdates.start_time = updates.start_time;
      if (updates.end_time) dbUpdates.end_time = updates.end_time;
      if (updates.categories) dbUpdates.categories = updates.categories;
      if (updates.image_urls) dbUpdates.image_urls = updates.image_urls;
      if (updates.is_active !== undefined) dbUpdates.is_active = updates.is_active;
      if (updates.location) {
        if (updates.location.latitude) dbUpdates.latitude = updates.location.latitude;
        if (updates.location.longitude) dbUpdates.longitude = updates.location.longitude;
        if (updates.location.address) dbUpdates.address = updates.location.address;
        if (updates.location.city) dbUpdates.city = updates.location.city;
        if (updates.location.state) dbUpdates.state = updates.location.state;
        if (updates.location.zip) dbUpdates.zip = updates.location.zip;
      }

      const { data, error } = await supabase
        .from('sales')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return transformSale(data);
    },
    onSuccess: (data) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: queryKeys.sales.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.sales.byId(data.id) });
    },
  });
};

export const useDeleteSale = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (saleId: string) => {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', saleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.sales.all });
    },
  });
};
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, gcTime: 1000 * 60 * 10, retry: 2, refetchOnWindowFocus: false },
    mutations: { retry: 1 },
  },
});

export const queryKeys = {
  sales: {
    all: ['sales'] as const,
    nearby: (lat: number, lng: number, radius: number) => ['sales', 'nearby', { lat, lng, radius }] as const,
    byId: (id: string) => ['sales', 'detail', id] as const,
    byHost: (hostId: string) => ['sales', 'host', hostId] as const,
  },
  profile: { current: ['profile', 'current'] as const },
} as const;
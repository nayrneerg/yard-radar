import { create } from 'zustand';
import { Sale, SaleFilters } from '@/types';

interface SalesState {
  nearbySales: Sale[];
  selectedSale: Sale | null;
  filters: SaleFilters;
  userLocation: { latitude: number; longitude: number } | null;
  setNearbySales: (sales: Sale[]) => void;
  setSelectedSale: (sale: Sale | null) => void;
  setFilters: (filters: Partial<SaleFilters>) => void;
  setUserLocation: (location: { latitude: number; longitude: number } | null) => void;
  resetFilters: () => void;
}

const defaultFilters: SaleFilters = { categories: [], maxDistance: 10, dateRange: {} };

export const useSalesStore = create<SalesState>((set) => ({
  nearbySales: [], selectedSale: null, filters: defaultFilters, userLocation: null,
  setNearbySales: (nearbySales) => set({ nearbySales }),
  setSelectedSale: (selectedSale) => set({ selectedSale }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  setUserLocation: (userLocation) => set({ userLocation }),
  resetFilters: () => set({ filters: defaultFilters }),
}));
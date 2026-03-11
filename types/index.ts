export enum SaleCategory {
  Furniture = 'furniture',
  Clothing = 'clothing',
  Electronics = 'electronics',
  Tools = 'tools',
  Toys = 'toys',
  Books = 'books',
  Vintage = 'vintage',
  Other = 'other',
}

export enum UserRole {
  Host = 'host',
  Shopper = 'shopper',
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Sale {
  id: string;
  host_id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  location: Location;
  categories: SaleCategory[];
  image_urls: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  distance?: number;
  host?: Profile;
}

export interface SaleFilters {
  categories: SaleCategory[];
  maxDistance: number;
  dateRange: { start?: Date; end?: Date };
}
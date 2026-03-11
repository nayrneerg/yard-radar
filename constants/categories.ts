import { SaleCategory } from '@/types';

export const SALE_CATEGORIES = [
  { value: SaleCategory.Furniture, label: 'Furniture', icon: 'sofa', color: '#8B4513' },
  { value: SaleCategory.Clothing, label: 'Clothing', icon: 'tshirt-crew', color: '#FF69B4' },
  { value: SaleCategory.Electronics, label: 'Electronics', icon: 'laptop', color: '#4169E1' },
  { value: SaleCategory.Tools, label: 'Tools', icon: 'hammer-wrench', color: '#FF8C00' },
  { value: SaleCategory.Toys, label: 'Toys', icon: 'toy-brick', color: '#32CD32' },
  { value: SaleCategory.Books, label: 'Books', icon: 'book-open-page-variant', color: '#800080' },
  { value: SaleCategory.Vintage, label: 'Vintage', icon: 'glass-wine', color: '#B8860B' },
  { value: SaleCategory.Other, label: 'Other', icon: 'dots-horizontal-circle', color: '#808080' },
] as const;

export const getCategoryInfo = (category: SaleCategory) => {
  return SALE_CATEGORIES.find(c => c.value === category) || SALE_CATEGORIES[SALE_CATEGORIES.length - 1];
};
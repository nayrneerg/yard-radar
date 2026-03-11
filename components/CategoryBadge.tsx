import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { SaleCategory } from '@/types';
import { getCategoryInfo } from '@/constants/categories';
import { theme } from '@/constants/theme';

interface CategoryBadgeProps { category: SaleCategory; size?: 'small' | 'medium'; }

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, size = 'small' }) => {
  const info = getCategoryInfo(category);
  return (
    <View style={[styles.badge, { backgroundColor: `${info.color}20` }, size === 'small' ? styles.badgeSmall : styles.badgeMedium]}>
      <Text style={[styles.text, { color: info.color }, size === 'small' ? styles.textSmall : styles.textMedium]}>{info.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: { borderRadius: theme.borderRadius.md, paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xs, alignSelf: 'flex-start' },
  badgeSmall: { paddingHorizontal: theme.spacing.sm, paddingVertical: 4 },
  badgeMedium: { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.xs },
  text: { fontWeight: theme.fonts.weights.semibold },
  textSmall: { fontSize: theme.fonts.sizes.xs },
  textMedium: { fontSize: theme.fonts.sizes.sm },
});

export default CategoryBadge;
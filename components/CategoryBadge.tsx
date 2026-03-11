import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { SaleCategory } from '@/types';
import { getCategoryInfo } from '@/constants/categories';
import { theme } from '@/constants/theme';

interface Props { category: SaleCategory; size?: 'small' | 'medium'; }

const CategoryBadge: React.FC<Props> = ({ category, size = 'small' }) => {
  const info = getCategoryInfo(category);
  return (
    <View style={[styles.badge, { backgroundColor: `${info.color}20` }, size === 'medium' && styles.medium]}>
      <Text style={[styles.text, { color: info.color }, size === 'medium' && styles.textMedium]}>{info.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: { borderRadius: theme.borderRadius.md, paddingHorizontal: theme.spacing.sm, paddingVertical: 4, alignSelf: 'flex-start' },
  medium: { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.xs },
  text: { fontSize: theme.fonts.sizes.xs, fontWeight: theme.fonts.weights.semibold },
  textMedium: { fontSize: theme.fonts.sizes.sm },
});

export default CategoryBadge;
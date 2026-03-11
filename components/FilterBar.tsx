import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Chip, Text } from 'react-native-paper';
import { SaleCategory } from '@/types';
import { SALE_CATEGORIES } from '@/constants/categories';
import { theme } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const DISTANCES = [5, 10, 25, 50];

interface Props {
  selectedCategories: SaleCategory[];
  maxDistance: number;
  onCategoriesChange: (c: SaleCategory[]) => void;
  onDistanceChange: (d: number) => void;
  onReset: () => void;
}

const FilterBar: React.FC<Props> = ({ selectedCategories, maxDistance, onCategoriesChange, onDistanceChange, onReset }) => {
  const [showCats, setShowCats] = useState(false);
  const [showDist, setShowDist] = useState(false);
  const toggle = (c: SaleCategory) => onCategoriesChange(selectedCategories.includes(c) ? selectedCategories.filter(x => x !== c) : [...selectedCategories, c]);
  const hasFilters = selectedCategories.length > 0 || maxDistance !== 10;

  return (
    <View style={styles.wrap}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        <Chip onPress={() => setShowCats(!showCats)} mode={selectedCategories.length > 0 ? 'flat' : 'outlined'} style={styles.chip}>Categories {selectedCategories.length > 0 && `(${selectedCategories.length})`}</Chip>
        <Chip onPress={() => setShowDist(!showDist)} mode={showDist ? 'flat' : 'outlined'} style={styles.chip}>{maxDistance} miles</Chip>
        {hasFilters && <Chip onPress={onReset} mode="outlined" style={styles.chip} textStyle={{ color: theme.colors.error }}>Clear</Chip>}
      </ScrollView>
      {showCats && (
        <View style={styles.panel}>
          <Text variant="labelMedium" style={styles.label}>Categories</Text>
          <View style={styles.grid}>{SALE_CATEGORIES.map(cat => <Chip key={cat.value} selected={selectedCategories.includes(cat.value)} onPress={() => toggle(cat.value)} style={styles.chip}>{cat.label}</Chip>)}</View>
        </View>
      )}
      {showDist && (
        <View style={styles.panel}>
          <Text variant="labelMedium" style={styles.label}>Max Distance</Text>
          <View style={styles.grid}>{DISTANCES.map(d => <Chip key={d} selected={maxDistance === d} onPress={() => onDistanceChange(d)} style={styles.chip}>{d} mi</Chip>)}</View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: { backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  row: { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, gap: theme.spacing.sm },
  chip: { marginRight: theme.spacing.xs },
  panel: { padding: theme.spacing.md, borderTopWidth: 1, borderTopColor: theme.colors.border },
  label: { marginBottom: theme.spacing.sm, color: theme.colors.textSecondary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
});

export default FilterBar;
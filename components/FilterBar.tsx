import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Chip, Text } from 'react-native-paper';
import { SaleCategory } from '@/types';
import { SALE_CATEGORIES } from '@/constants/categories';
import { theme } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface FilterBarProps { selectedCategories: SaleCategory[]; maxDistance: number; onCategoriesChange: (c: SaleCategory[]) => void; onDistanceChange: (d: number) => void; onReset: () => void; }

const DISTANCE_OPTIONS = [5, 10, 25, 50];

const FilterBar: React.FC<FilterBarProps> = ({ selectedCategories, maxDistance, onCategoriesChange, onDistanceChange, onReset }) => {
  const [showCategories, setShowCategories] = useState(false);
  const [showDistance, setShowDistance] = useState(false);
  const toggleCategory = (c: SaleCategory) => onCategoriesChange(selectedCategories.includes(c) ? selectedCategories.filter(x => x !== c) : [...selectedCategories, c]);
  const hasActiveFilters = selectedCategories.length > 0 || maxDistance !== 10;

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Chip mode={showCategories || selectedCategories.length > 0 ? 'flat' : 'outlined'} onPress={() => setShowCategories(!showCategories)} style={styles.chip} icon={() => <MaterialCommunityIcons name="tag-multiple" size={18} color={theme.colors.primary} />}>
          Categories {selectedCategories.length > 0 && `(${selectedCategories.length})`}
        </Chip>
        <Chip mode={showDistance ? 'flat' : 'outlined'} onPress={() => setShowDistance(!showDistance)} style={styles.chip} icon={() => <MaterialCommunityIcons name="map-marker-distance" size={18} color={theme.colors.primary} />}>
          {maxDistance} miles
        </Chip>
        {hasActiveFilters && <Chip mode="outlined" onPress={onReset} style={styles.chip} textStyle={styles.resetText} icon={() => <MaterialCommunityIcons name="close-circle" size={18} color={theme.colors.error} />}>Clear</Chip>}
      </ScrollView>
      {showCategories && (
        <View style={styles.expandedSection}>
          <Text variant="labelMedium" style={styles.sectionTitle}>Select Categories</Text>
          <View style={styles.categoriesGrid}>
            {SALE_CATEGORIES.map((cat) => (
              <Chip key={cat.value} selected={selectedCategories.includes(cat.value)} onPress={() => toggleCategory(cat.value)} style={styles.categoryChip} icon={() => <MaterialCommunityIcons name={cat.icon as any} size={16} color={selectedCategories.includes(cat.value) ? 'white' : cat.color} />} textStyle={{ color: selectedCategories.includes(cat.value) ? 'white' : cat.color }} selectedColor={cat.color}>{cat.label}</Chip>
            ))}
          </View>
        </View>
      )}
      {showDistance && (
        <View style={styles.expandedSection}>
          <Text variant="labelMedium" style={styles.sectionTitle}>Maximum Distance</Text>
          <View style={styles.distanceOptions}>
            {DISTANCE_OPTIONS.map((d) => <Chip key={d} selected={maxDistance === d} onPress={() => onDistanceChange(d)} style={styles.distanceChip}>{d} mi</Chip>)}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: theme.colors.border },
  scrollContent: { paddingHorizontal: theme.spacing.md, paddingVertical: theme.spacing.sm, gap: theme.spacing.sm },
  chip: { marginRight: theme.spacing.xs },
  resetText: { color: theme.colors.error },
  expandedSection: { padding: theme.spacing.md, borderTopWidth: 1, borderTopColor: theme.colors.border },
  sectionTitle: { marginBottom: theme.spacing.sm, color: theme.colors.textSecondary },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  categoryChip: { marginBottom: theme.spacing.xs },
  distanceOptions: { flexDirection: 'row', gap: theme.spacing.sm },
  distanceChip: { flex: 1 },
});

export default FilterBar;
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { Sale } from '@/types';
import { theme } from '@/constants/theme';
import { format } from 'date-fns';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CategoryBadge from './CategoryBadge';

interface SaleCardProps { sale: Sale; onPress: () => void; }

const SaleCard: React.FC<SaleCardProps> = ({ sale, onPress }) => {
  const formatDate = (d: string) => { try { return format(new Date(d), 'MMM d, yyyy'); } catch { return d; } };
  const formatTime = (t: string) => { try { const [h, m] = t.split(':'); const hr = parseInt(h, 10); return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`; } catch { return t; } };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        {sale.image_urls?.length > 0 && <Card.Cover source={{ uri: sale.image_urls[0] }} style={styles.image} />}
        <Card.Content style={styles.content}>
          <Text variant="titleMedium" style={styles.title} numberOfLines={2}>{sale.title}</Text>
          <View style={styles.infoRow}><MaterialCommunityIcons name="calendar" size={16} color={theme.colors.textSecondary} /><Text style={styles.infoText}>{formatDate(sale.start_date)}{sale.start_date !== sale.end_date && ` - ${formatDate(sale.end_date)}`}</Text></View>
          <View style={styles.infoRow}><MaterialCommunityIcons name="clock-outline" size={16} color={theme.colors.textSecondary} /><Text style={styles.infoText}>{formatTime(sale.start_time)} - {formatTime(sale.end_time)}</Text></View>
          {sale.distance !== undefined && <View style={styles.infoRow}><MaterialCommunityIcons name="map-marker-distance" size={16} color={theme.colors.textSecondary} /><Text style={styles.infoText}>{sale.distance.toFixed(1)} miles away</Text></View>}
          {sale.location.city && <View style={styles.infoRow}><MaterialCommunityIcons name="map-marker" size={16} color={theme.colors.textSecondary} /><Text style={styles.infoText} numberOfLines={1}>{sale.location.city}, {sale.location.state}</Text></View>}
          {sale.categories?.length > 0 && <View style={styles.categoriesRow}>{sale.categories.slice(0, 3).map((c, i) => <CategoryBadge key={i} category={c} />)}{sale.categories.length > 3 && <Text style={styles.moreCategories}>+{sale.categories.length - 3}</Text>}</View>}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { marginHorizontal: theme.spacing.md, marginVertical: theme.spacing.sm, ...theme.shadows.md },
  image: { height: 160 },
  content: { paddingTop: theme.spacing.md },
  title: { fontWeight: theme.fonts.weights.bold, marginBottom: theme.spacing.sm },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.xs },
  infoText: { marginLeft: theme.spacing.xs, color: theme.colors.textSecondary, fontSize: theme.fonts.sizes.sm },
  categoriesRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: theme.spacing.sm, gap: theme.spacing.xs },
  moreCategories: { fontSize: theme.fonts.sizes.sm, color: theme.colors.textSecondary, marginLeft: theme.spacing.xs },
});

export default SaleCard;
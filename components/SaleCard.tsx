import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { Sale } from '@/types';
import { theme } from '@/constants/theme';
import { format } from 'date-fns';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CategoryBadge from './CategoryBadge';

const fmt = (d: string) => { try { return format(new Date(d), 'MMM d, yyyy'); } catch { return d; } };
const fmtTime = (t: string) => { try { const [h, m] = t.split(':'); const hr = parseInt(h); return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`; } catch { return t; } };

const SaleCard: React.FC<{ sale: Sale; onPress: () => void }> = ({ sale, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
    <Card style={styles.card}>
      {sale.image_urls?.length > 0 && <Card.Cover source={{ uri: sale.image_urls[0] }} style={styles.image} />}
      <Card.Content style={styles.content}>
        <Text variant="titleMedium" style={styles.title} numberOfLines={2}>{sale.title}</Text>
        <View style={styles.row}><MaterialCommunityIcons name="calendar" size={16} color={theme.colors.textSecondary} /><Text style={styles.info}>{fmt(sale.start_date)}{sale.start_date !== sale.end_date && ` - ${fmt(sale.end_date)}`}</Text></View>
        <View style={styles.row}><MaterialCommunityIcons name="clock-outline" size={16} color={theme.colors.textSecondary} /><Text style={styles.info}>{fmtTime(sale.start_time)} - {fmtTime(sale.end_time)}</Text></View>
        {sale.distance !== undefined && <View style={styles.row}><MaterialCommunityIcons name="map-marker-distance" size={16} color={theme.colors.textSecondary} /><Text style={styles.info}>{sale.distance.toFixed(1)} mi away</Text></View>}
        {sale.location.city && <View style={styles.row}><MaterialCommunityIcons name="map-marker" size={16} color={theme.colors.textSecondary} /><Text style={styles.info}>{sale.location.city}, {sale.location.state}</Text></View>}
        {sale.categories?.length > 0 && <View style={styles.cats}>{sale.categories.slice(0, 3).map((c, i) => <CategoryBadge key={i} category={c} />)}{sale.categories.length > 3 && <Text style={styles.info}>+{sale.categories.length - 3}</Text>}</View>}
      </Card.Content>
    </Card>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: { marginHorizontal: theme.spacing.md, marginVertical: theme.spacing.sm, ...theme.shadows.md },
  image: { height: 160 },
  content: { paddingTop: theme.spacing.md },
  title: { fontWeight: theme.fonts.weights.bold, marginBottom: theme.spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.xs },
  info: { marginLeft: theme.spacing.xs, color: theme.colors.textSecondary, fontSize: theme.fonts.sizes.sm },
  cats: { flexDirection: 'row', flexWrap: 'wrap', marginTop: theme.spacing.sm, gap: theme.spacing.xs },
});

export default SaleCard;
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Mapbox from '@rnmapbox/maps';
import { Sale } from '@/types';
import { theme } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface SalePinProps { sale: Sale; selected?: boolean; onPress?: () => void; }

const SalePin: React.FC<SalePinProps> = ({ sale, selected = false, onPress }) => {
  const pinColor = selected ? theme.colors.mapPinSelected : theme.colors.mapPin;
  return (
    <Mapbox.MarkerView id={sale.id} coordinate={[sale.location.longitude, sale.location.latitude]}>
      <View style={styles.container} onTouchEnd={onPress}>
        <View style={[styles.pin, { backgroundColor: pinColor }]}>
          <MaterialCommunityIcons name="sale" size={selected ? 24 : 20} color="white" />
        </View>
        {selected && <View style={[styles.label, { borderColor: pinColor }]}><Text style={styles.labelText} numberOfLines={1}>{sale.title}</Text></View>}
        <View style={[styles.arrow, { borderTopColor: pinColor }]} />
      </View>
    </Mapbox.MarkerView>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  pin: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: 'white', ...theme.shadows.md },
  arrow: { width: 0, height: 0, backgroundColor: 'transparent', borderStyle: 'solid', borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 10, borderLeftColor: 'transparent', borderRightColor: 'transparent', marginTop: -1 },
  label: { position: 'absolute', top: -35, backgroundColor: 'white', paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xs, borderRadius: theme.borderRadius.sm, borderWidth: 2, maxWidth: 150, ...theme.shadows.md },
  labelText: { fontSize: theme.fonts.sizes.sm, fontWeight: theme.fonts.weights.semibold },
});

export default SalePin;
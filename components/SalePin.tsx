import React from 'react';
import { View, StyleSheet } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { Sale } from '@/types';
import { theme } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SalePin: React.FC<{ sale: Sale; selected?: boolean; onPress?: () => void }> = ({ sale, selected = false, onPress }) => {
  const color = selected ? theme.colors.mapPinSelected : theme.colors.mapPin;
  return (
    <Mapbox.MarkerView id={sale.id} coordinate={[sale.location.longitude, sale.location.latitude]}>
      <View style={styles.wrap} onTouchEnd={onPress}>
        <View style={[styles.pin, { backgroundColor: color }]}>
          <MaterialCommunityIcons name="sale" size={selected ? 22 : 18} color="white" />
        </View>
        <View style={[styles.arrow, { borderTopColor: color }]} />
      </View>
    </Mapbox.MarkerView>
  );
};

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  pin: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: 'white', ...theme.shadows.md },
  arrow: { width: 0, height: 0, borderStyle: 'solid', borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 10, borderLeftColor: 'transparent', borderRightColor: 'transparent', marginTop: -1 },
});

export default SalePin;
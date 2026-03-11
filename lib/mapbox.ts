import Mapbox from '@rnmapbox/maps';

const mapboxToken = process.env.EXPO_PUBLIC_MAPBOX_TOKEN ?? '';
Mapbox.setAccessToken(mapboxToken);

export const MAP_DEFAULTS = {
  initialZoomLevel: 12,
  animationDuration: 300,
};

export const MAP_STYLES = {
  streets: 'mapbox://styles/mapbox/streets-v12',
  light: 'mapbox://styles/mapbox/light-v11',
  dark: 'mapbox://styles/mapbox/dark-v11',
} as const;

export default Mapbox;
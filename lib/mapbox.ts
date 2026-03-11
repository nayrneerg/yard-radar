import Constants from 'expo-constants';
import Mapbox from '@rnmapbox/maps';

const mapboxToken = Constants.expoConfig?.extra?.EXPO_PUBLIC_MAPBOX_TOKEN || process.env.EXPO_PUBLIC_MAPBOX_TOKEN || '';

if (!mapboxToken) { console.error('Missing Mapbox token. Add EXPO_PUBLIC_MAPBOX_TOKEN to your .env file'); }
else { Mapbox.setAccessToken(mapboxToken); }

export const MAPBOX_TOKEN = mapboxToken;
export const MAP_DEFAULTS = { initialZoomLevel: 12, maxZoomLevel: 18, minZoomLevel: 8, animationDuration: 300, clusterRadius: 50, clusterMaxZoom: 14 };
export const MAP_STYLES = { streets: 'mapbox://styles/mapbox/streets-v12', light: 'mapbox://styles/mapbox/light-v11', dark: 'mapbox://styles/mapbox/dark-v11', satellite: 'mapbox://styles/mapbox/satellite-streets-v12' } as const;
export default Mapbox;
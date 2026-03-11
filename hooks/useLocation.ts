import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { useSalesStore } from '@/stores/salesStore';

export const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const setUserLocation = useSalesStore((state) => state.setUserLocation);

  useEffect(() => {
    let sub: Location.LocationSubscription | null = null;
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') { setError('Location permission denied'); setLoading(false); return; }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setLocation(loc);
      setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      setLoading(false);
      sub = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, timeInterval: 30000, distanceInterval: 100 },
        (l) => { setLocation(l); setUserLocation({ latitude: l.coords.latitude, longitude: l.coords.longitude }); }
      );
    })().catch(err => { setError(err.message ?? 'Failed to get location'); setLoading(false); });
    return () => { sub?.remove(); };
  }, [setUserLocation]);

  const refreshLocation = async () => {
    setLoading(true);
    const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
    setLocation(loc);
    setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    setLoading(false);
  };

  return { location, error, loading, refreshLocation };
};
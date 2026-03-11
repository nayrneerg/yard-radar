import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { useSalesStore } from '@/stores/salesStore';

export const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const setUserLocation = useSalesStore((state) => state.setUserLocation);

  useEffect(() => {
    let locationSubscription: Location.LocationSubscription | null = null;
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') { setError('Location permission denied'); setLoading(false); return; }
        const currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setLocation(currentLocation);
        setUserLocation({ latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude });
        setLoading(false);
        locationSubscription = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.Balanced, timeInterval: 30000, distanceInterval: 100 },
          (newLocation) => {
            setLocation(newLocation);
            setUserLocation({ latitude: newLocation.coords.latitude, longitude: newLocation.coords.longitude });
          }
        );
      } catch (err) { setError(err instanceof Error ? err.message : 'Failed to get location'); setLoading(false); }
    };
    getLocation();
    return () => { if (locationSubscription) locationSubscription.remove(); };
  }, [setUserLocation]);

  const refreshLocation = async () => {
    setLoading(true);
    try {
      const currentLocation = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation(currentLocation);
      setUserLocation({ latitude: currentLocation.coords.latitude, longitude: currentLocation.coords.longitude });
      setError(null);
    } catch (err) { setError(err instanceof Error ? err.message : 'Failed to refresh location'); }
    finally { setLoading(false); }
  };

  return { location, error, loading, refreshLocation };
};
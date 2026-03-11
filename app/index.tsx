import { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/stores/authStore';
import { theme } from '@/constants/theme';
import { Text } from 'react-native-paper';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      // Redirect based on auth state
      if (isAuthenticated) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [isAuthenticated, isLoading]);

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>
        Yard Radar
      </Text>
      <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
      <Text variant="bodyMedium" style={styles.subtitle}>
        Finding treasures nearby...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  title: {
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.primary,
    marginBottom: theme.spacing.xl,
  },
  loader: {
    marginVertical: theme.spacing.lg,
  },
  subtitle: {
    color: theme.colors.textSecondary,
  },
});
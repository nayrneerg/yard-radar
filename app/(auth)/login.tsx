import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, Snackbar } from 'react-native-paper';
import { Link } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { theme } from '@/constants/theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const { signIn, loading, error } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      return;
    }

    const result = await signIn(email, password);
    if (!result.success) {
      setSnackbarVisible(true);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <MaterialCommunityIcons 
            name="radar" 
            size={80} 
            color={theme.colors.primary} 
          />
          <Text variant="displaySmall" style={styles.title}>
            Yard Radar
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Find treasures in your neighborhood
          </Text>
        </View>

        <View style={styles.form}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            style={styles.input}
            left={<TextInput.Icon icon="email" />}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoComplete="password"
            style={styles.input}
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon 
                icon={showPassword ? 'eye-off' : 'eye'} 
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading || !email || !password}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Sign In
          </Button>

          <View style={styles.signupContainer}>
            <Text variant="bodyMedium">Don't have an account? </Text>
            <Link href="/(auth)/signup" asChild>
              <Button mode="text" compact>
                Sign Up
              </Button>
            </Link>
          </View>
        </View>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'Dismiss',
          onPress: () => setSnackbarVisible(false),
        }}
      >
        {error || 'Login failed'}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  title: {
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.primary,
    marginTop: theme.spacing.md,
  },
  subtitle: {
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: theme.spacing.md,
  },
  button: {
    marginTop: theme.spacing.md,
  },
  buttonContent: {
    paddingVertical: theme.spacing.xs,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
});
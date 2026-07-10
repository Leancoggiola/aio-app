import { Redirect, Slot, useSegments } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Spinner, TamaguiProvider, Theme, YStack } from 'tamagui';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider, useAuth } from '@/core/auth';
import { tamaguiConfig } from '@/theme/tamagui.config';

function AuthGate() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const onLogin = segments[0] === 'login';

  if (isLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" />
      </YStack>
    );
  }

  if (!isAuthenticated && !onLogin) {
    return <Redirect href="/login" />;
  }

  if (isAuthenticated && onLogin) {
    return <Redirect href="/(tabs)" />;
  }

  return <Slot />;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme === 'dark' ? 'dark' : 'light'}>
      <Theme name={colorScheme === 'dark' ? 'dark' : 'light'}>
        <AuthProvider>
          <StatusBar style="auto" />
          <AuthGate />
        </AuthProvider>
      </Theme>
    </TamaguiProvider>
  );
}

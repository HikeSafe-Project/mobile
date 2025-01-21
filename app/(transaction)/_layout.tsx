import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

export default function AuthLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="history/index" options={{ headerShown: false }} />
        <Stack.Screen name="detail/index" options={{ headerTitle: 'Detail Transaction', }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
};

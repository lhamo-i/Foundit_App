import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { SavedProvider } from './src/context/SavedContext';
import { SessionProvider } from './src/context/SessionContext';
import { ClaimsProvider } from './src/context/ClaimsContext';
import { colors } from './src/theme/colors';

// Tell React Navigation to use our palette instead of its default colours.
const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.background,
    card: colors.surface,
    text: colors.text,
    primary: colors.primary,
    border: colors.border,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <SavedProvider>
        <SessionProvider>
          <ClaimsProvider>
            <NavigationContainer theme={navTheme}>
              <StatusBar style="dark" />
              <AppNavigator />
            </NavigationContainer>
          </ClaimsProvider>
        </SessionProvider>
      </SavedProvider>
    </SafeAreaProvider>
  );
}

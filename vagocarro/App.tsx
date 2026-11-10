import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { DriverProvider } from './src/context/DriverContext';
import { AuthNavigator } from './src/screens/auth/AuthNavigator';
import { HomeScreen } from './src/screens/HomeScreen';

function RootNavigator() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <DriverProvider>
      <HomeScreen />
    </DriverProvider>
  ) : (
    <AuthNavigator />
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootNavigator />
        <StatusBar style="dark" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}

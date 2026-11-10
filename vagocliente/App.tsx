import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from './src/screens/HomeScreen';
import { ServicesScreen } from './src/screens/ServicesScreen';
import { ActivityScreen } from './src/screens/ActivityScreen';
import { AccountScreen } from './src/screens/AccountScreen';
import { BottomTabBar } from './src/components/navigation/BottomTabBar';
import { TabType } from './src/types/navigation';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');

  const renderCurrentScreen = () => {
    switch (currentTab) {
      case 'home':
        return <HomeScreen />;
      case 'services':
        return <ServicesScreen />;
      case 'activity':
        return <ActivityScreen />;
      case 'account':
        return <AccountScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        <StatusBar style="dark" />
        <View style={styles.screenContainer}>
          {renderCurrentScreen()}
        </View>
        <BottomTabBar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  screenContainer: {
    flex: 1,
  },
});

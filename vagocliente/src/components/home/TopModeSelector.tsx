import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { AppMode } from '../../types/navigation';

interface TopModeSelectorProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
}

export const TopModeSelector: React.FC<TopModeSelectorProps> = ({
  currentMode,
  onSelectMode,
}) => {
  return (
    <View style={styles.container}>
      {/* Vago Tab (rides) */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => onSelectMode('vago')}
        activeOpacity={0.8}
      >
        <View style={styles.tabContent}>
          <Ionicons
            name="car-sport"
            size={22}
            color={currentMode === 'vago' ? '#000000' : '#757575'}
          />
          <Text
            style={[
              styles.tabText,
              currentMode === 'vago' ? styles.tabTextActive : styles.tabTextInactive,
            ]}
          >
            Vago
          </Text>
        </View>
        {currentMode === 'vago' && <View style={styles.activeIndicator} />}
      </TouchableOpacity>

      {/* Courier Tab (delivery) */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => onSelectMode('courier')}
        activeOpacity={0.8}
      >
        <View style={styles.tabContent}>
          <MaterialCommunityIcons
            name="package-variant-closed"
            size={22}
            color={currentMode === 'courier' ? '#000000' : '#757575'}
          />
          <Text
            style={[
              styles.tabText,
              currentMode === 'courier' ? styles.tabTextActive : styles.tabTextInactive,
            ]}
          >
            Courier
          </Text>
        </View>
        {currentMode === 'courier' && <View style={styles.activeIndicator} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
    paddingTop: 4,
  },
  tabButton: {
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 8,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingBottom: 10,
  },
  tabText: {
    fontSize: 18,
    letterSpacing: -0.2,
  },
  tabTextActive: {
    fontWeight: '700',
    color: '#000000',
  },
  tabTextInactive: {
    fontWeight: '500',
    color: '#757575',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 3.5,
    backgroundColor: '#000000',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});

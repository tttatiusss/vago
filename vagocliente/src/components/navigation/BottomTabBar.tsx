import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { TabType } from '../../types/navigation';

interface BottomTabBarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {/* 1. Home Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onSelectTab('home')}
        activeOpacity={0.7}
      >
        <Ionicons
          name={currentTab === 'home' ? 'home' : 'home-outline'}
          size={24}
          color={currentTab === 'home' ? '#000000' : '#71717A'}
        />
        <Text
          style={[
            styles.tabLabel,
            currentTab === 'home' ? styles.tabLabelActive : styles.tabLabelInactive,
          ]}
        >
          Início
        </Text>
      </TouchableOpacity>

      {/* 2. Services Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onSelectTab('services')}
        activeOpacity={0.7}
      >
        <Ionicons
          name={currentTab === 'services' ? 'apps' : 'apps-outline'}
          size={24}
          color={currentTab === 'services' ? '#000000' : '#71717A'}
        />
        <Text
          style={[
            styles.tabLabel,
            currentTab === 'services' ? styles.tabLabelActive : styles.tabLabelInactive,
          ]}
        >
          Serviços
        </Text>
      </TouchableOpacity>

      {/* 3. Activity Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onSelectTab('activity')}
        activeOpacity={0.7}
      >
        <Ionicons
          name={currentTab === 'activity' ? 'receipt' : 'receipt-outline'}
          size={24}
          color={currentTab === 'activity' ? '#000000' : '#71717A'}
        />
        <Text
          style={[
            styles.tabLabel,
            currentTab === 'activity' ? styles.tabLabelActive : styles.tabLabelInactive,
          ]}
        >
          Atividade
        </Text>
      </TouchableOpacity>

      {/* 4. Account Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onSelectTab('account')}
        activeOpacity={0.7}
      >
        <View style={styles.iconBadgeWrapper}>
          <Ionicons
            name={currentTab === 'account' ? 'person' : 'person-outline'}
            size={24}
            color={currentTab === 'account' ? '#000000' : '#71717A'}
          />
          {/* Blue notification dot on Account icon */}
          <View style={styles.blueDot} />
        </View>
        <Text
          style={[
            styles.tabLabel,
            currentTab === 'account' ? styles.tabLabelActive : styles.tabLabelInactive,
          ]}
        >
          Conta
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  tabLabel: {
    fontSize: 11,
    letterSpacing: -0.2,
  },
  tabLabelActive: {
    fontWeight: '700',
    color: '#000000',
  },
  tabLabelInactive: {
    fontWeight: '500',
    color: '#71717A',
  },
  iconBadgeWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blueDot: {
    position: 'absolute',
    top: -1,
    right: -4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});

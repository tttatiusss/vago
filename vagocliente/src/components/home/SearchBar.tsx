import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  onPressSearch?: () => void;
  onPressLater?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onPressSearch,
  onPressLater,
}) => {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.container}
        onPress={onPressSearch}
        activeOpacity={0.85}
      >
        {/* Left Section: Search Icon + Title */}
        <View style={styles.searchSection}>
          <Ionicons name="search" size={22} color="#111111" style={styles.searchIcon} />
          <Text style={styles.searchText}>Para onde?</Text>
        </View>

        {/* Right Section: Nested Later / Schedule Pill */}
        <TouchableOpacity
          style={styles.laterButton}
          onPress={onPressLater || onPressSearch}
          activeOpacity={0.7}
        >
          <Ionicons name="calendar-outline" size={16} color="#000000" />
          <Text style={styles.laterText}>Mais tarde</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F3F3F5',
    borderRadius: 30,
    paddingLeft: 18,
    paddingRight: 6,
    paddingVertical: 6,
    minHeight: 56,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  searchIcon: {
    marginRight: 2,
  },
  searchText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111111',
    letterSpacing: -0.3,
  },
  laterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 22,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  laterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
});

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

interface SuggestionsSectionProps {
  onSelectSuggestion?: (type: string) => void;
  onPressSeeAll?: () => void;
}

export const SuggestionsSection: React.FC<SuggestionsSectionProps> = ({
  onSelectSuggestion,
  onPressSeeAll,
}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Sugestões</Text>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={onPressSeeAll}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-forward" size={16} color="#000000" />
        </TouchableOpacity>
      </View>

      {/* 4 Cards Grid */}
      <View style={styles.cardsRow}>
        {/* Card 1: Viagem (Ride) */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => onSelectSuggestion?.('ride')}
          activeOpacity={0.7}
        >
          <View style={styles.badgeContainer}>
            <View style={styles.promoBadge}>
              <Ionicons name="pricetag" size={9} color="#FFFFFF" style={{ marginRight: 2 }} />
              <Text style={styles.badgeText}>30%</Text>
            </View>
          </View>
          <View style={styles.iconWrapper}>
            <MaterialCommunityIcons name="car-side" size={38} color="#1C1C1E" />
          </View>
          <Text style={styles.cardLabel} numberOfLines={1}>Viagem</Text>
        </TouchableOpacity>

        {/* Card 2: Envios (Send Items) */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => onSelectSuggestion?.('send_items')}
          activeOpacity={0.7}
        >
          <View style={styles.badgeContainer}>
            <View style={styles.promoBadge}>
              <Ionicons name="pricetag" size={9} color="#FFFFFF" style={{ marginRight: 2 }} />
              <Text style={styles.badgeText}>30%</Text>
            </View>
          </View>
          <View style={styles.iconWrapper}>
            <MaterialCommunityIcons name="package-variant" size={34} color="#D97706" />
          </View>
          <Text style={styles.cardLabel} numberOfLines={1}>Envios</Text>
        </TouchableOpacity>

        {/* Card 3: Reserva (Reserve) */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => onSelectSuggestion?.('reserve')}
          activeOpacity={0.7}
        >
          <View style={styles.badgeContainer}>
            <View style={styles.promoBadge}>
              <Text style={styles.badgeText}>Promo</Text>
            </View>
          </View>
          <View style={styles.iconWrapper}>
            <MaterialCommunityIcons name="calendar-clock" size={34} color="#2563EB" />
          </View>
          <Text style={styles.cardLabel} numberOfLines={1}>Reserva</Text>
        </TouchableOpacity>

        {/* Card 4: Retirada (Store Pickup) */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => onSelectSuggestion?.('store_pickup')}
          activeOpacity={0.7}
        >
          <View style={styles.badgeContainer}>
            {/* Empty placeholder to keep alignment identical */}
            <View style={styles.emptyBadgePlaceholder} />
          </View>
          <View style={styles.iconWrapper}>
            <MaterialCommunityIcons name="store-outline" size={34} color="#059669" />
          </View>
          <Text style={styles.cardLabel} numberOfLines={1}>Retirada</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.4,
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  card: {
    flex: 1,
    backgroundColor: '#F4F4F6',
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 104,
  },
  badgeContainer: {
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E11900',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  emptyBadgePlaceholder: {
    height: 14,
  },
  iconWrapper: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111111',
    textAlign: 'center',
    marginTop: 2,
  },
});

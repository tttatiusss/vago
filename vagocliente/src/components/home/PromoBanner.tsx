import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';

interface PromoBannerProps {
  onPressCourier?: () => void;
  onPressReservePromo?: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 48;

export const PromoBanner: React.FC<PromoBannerProps> = ({
  onPressCourier,
  onPressReservePromo,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={CARD_WIDTH + 12}
        decelerationRate="fast"
      >
        {/* Banner 1: Delivery with Courier */}
        <View style={[styles.bannerCard, styles.deliveryCard]}>
          <View style={styles.leftColumn}>
            <Text style={styles.bannerTitle}>
              {'Entregas no\nmesmo dia'}
            </Text>
            <TouchableOpacity
              style={styles.whiteButton}
              onPress={onPressCourier}
              activeOpacity={0.8}
            >
              <Text style={styles.whiteButtonText}>Pedir Courier</Text>
            </TouchableOpacity>
          </View>

          {/* Right Column: Courier Illustration Graphic */}
          <View style={styles.graphicColumn}>
            {/* Background elements */}
            <View style={styles.treeCircle} />
            <View style={styles.sunCircle} />

            {/* Courier Character & Box */}
            <View style={styles.courierFigure}>
              {/* Courier Head */}
              <View style={styles.courierHead}>
                <Ionicons name="person" size={42} color="#F59E0B" />
              </View>

              {/* Big Delivery Package */}
              <View style={styles.parcelBox}>
                <MaterialCommunityIcons name="package-variant-closed" size={54} color="#D97706" />
                <View style={styles.parcelTape} />
              </View>
            </View>
          </View>
        </View>

        {/* Banner 2: Reserve Rides (Peek) */}
        <View style={[styles.bannerCard, styles.reserveCard]}>
          <View style={styles.leftColumn}>
            <Text style={styles.bannerTitle}>
              {'Viaje com calma\nAgende antes'}
            </Text>
            <TouchableOpacity
              style={styles.whiteButton}
              onPress={onPressReservePromo}
              activeOpacity={0.8}
            >
              <Text style={styles.whiteButtonText}>Agendar Viagem</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.graphicColumn}>
            <View style={styles.reserveGraphicWrapper}>
              <MaterialCommunityIcons name="calendar-check" size={56} color="#FFFFFF" />
              <Ionicons name="car-sport" size={46} color="#A7F3D0" style={{ marginTop: -10 }} />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  bannerCard: {
    width: CARD_WIDTH,
    height: 165,
    borderRadius: 18,
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  deliveryCard: {
    backgroundColor: '#0F5EEA',
  },
  reserveCard: {
    backgroundColor: '#047857',
  },
  leftColumn: {
    flex: 1.15,
    paddingLeft: 20,
    paddingVertical: 20,
    justifyContent: 'space-between',
    zIndex: 2,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 26,
    letterSpacing: -0.4,
  },
  whiteButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 24,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  whiteButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000000',
  },
  graphicColumn: {
    flex: 0.95,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  treeCircle: {
    position: 'absolute',
    right: -10,
    top: 10,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#10B981',
    opacity: 0.85,
  },
  sunCircle: {
    position: 'absolute',
    right: 70,
    top: -20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#60A5FA',
    opacity: 0.6,
  },
  courierFigure: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    paddingBottom: 4,
  },
  courierHead: {
    marginBottom: -14,
    zIndex: 1,
  },
  parcelBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D97706',
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  parcelTape: {
    position: 'absolute',
    width: '100%',
    height: 4,
    backgroundColor: '#B45309',
    opacity: 0.5,
  },
  reserveGraphicWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
});

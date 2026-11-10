import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDriver } from '../../context/DriverContext';

export const RideOfferModal: React.FC = () => {
  const { status, activeRide, remainingOfferSeconds, acceptRide, rejectRide } = useDriver();

  if (status !== 'RIDE_OFFERED' || !activeRide) {
    return null;
  }

  const progressPercent = (remainingOfferSeconds / 15) * 100;

  return (
    <Modal visible={true} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          {/* Countdown timer bar */}
          <View style={styles.timerBarBackground}>
            <View style={[styles.timerBarFill, { width: `${progressPercent}%` }]} />
          </View>

          {/* Top header: Category & Fare */}
          <View style={styles.headerRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>{activeRide.category}</Text>
            </View>
            <Text style={styles.priceText}>
              R$ {activeRide.price.toFixed(2).replace('.', ',')}
            </Text>
          </View>

          {/* Passenger Information */}
          <View style={styles.passengerRow}>
            <View style={styles.passengerAvatar}>
              <Ionicons name="person" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.passengerDetails}>
              <Text style={styles.passengerName}>{activeRide.passenger.name}</Text>
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={13} color="#FFC043" />
                <Text style={styles.ratingText}>
                  {activeRide.passenger.rating.toFixed(2)}
                </Text>
              </View>
            </View>
            <View style={styles.secondsBubble}>
              <Text style={styles.secondsText}>{remainingOfferSeconds}s</Text>
            </View>
          </View>

          {/* Route details */}
          <View style={styles.routeCard}>
            {/* Pickup */}
            <View style={styles.routeStep}>
              <View style={[styles.routeDot, styles.pickupDot]} />
              <View style={styles.routeInfo}>
                <Text style={styles.routeLabel}>
                  Buscar em ({activeRide.pickupMinutes} min • {activeRide.pickupDistanceKm} km)
                </Text>
                <Text style={styles.routeAddress} numberOfLines={1}>
                  {activeRide.pickupLocation.address}
                </Text>
                <Text style={styles.routeNeighborhood}>
                  {activeRide.pickupLocation.neighborhood}
                </Text>
              </View>
            </View>

            <View style={styles.routeDivider} />

            {/* Destination */}
            <View style={styles.routeStep}>
              <View style={[styles.routeDot, styles.destinationDot]} />
              <View style={styles.routeInfo}>
                <Text style={styles.routeLabel}>
                  Destino ({activeRide.durationMinutes} min • {activeRide.distanceKm} km)
                </Text>
                <Text style={styles.routeAddress} numberOfLines={1}>
                  {activeRide.destinationLocation.address}
                </Text>
                <Text style={styles.routeNeighborhood}>
                  {activeRide.destinationLocation.neighborhood}
                </Text>
              </View>
            </View>
          </View>

          {/* Action buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={acceptRide}
              activeOpacity={0.85}
            >
              <Text style={styles.acceptButtonText}>Aceitar Corrida</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.declineButton}
              onPress={rejectRide}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={22} color="#E11900" />
              <Text style={styles.declineButtonText}>Recusar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  timerBarBackground: {
    height: 6,
    backgroundColor: '#EEEEEE',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 16,
  },
  timerBarFill: {
    height: '100%',
    backgroundColor: '#000000',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  categoryBadge: {
    backgroundColor: '#F3F3F4',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  categoryBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
  priceText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0E8345',
    letterSpacing: -0.5,
  },
  passengerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F8',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  passengerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passengerDetails: {
    marginLeft: 12,
    flex: 1,
  },
  passengerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#545454',
  },
  secondsBubble: {
    backgroundColor: '#000000',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  secondsText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  routeCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginBottom: 20,
  },
  routeStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  routeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 5,
    marginRight: 12,
  },
  pickupDot: {
    backgroundColor: '#0E8345',
  },
  destinationDot: {
    backgroundColor: '#E11900',
  },
  routeDivider: {
    width: 2,
    height: 20,
    backgroundColor: '#D1D5DB',
    marginLeft: 4,
    marginVertical: 4,
  },
  routeInfo: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B6B6B',
    marginBottom: 2,
  },
  routeAddress: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
  routeNeighborhood: {
    fontSize: 12,
    color: '#8E8E93',
  },
  actionsContainer: {
    gap: 10,
  },
  acceptButton: {
    backgroundColor: '#000000',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  declineButton: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  declineButtonText: {
    color: '#E11900',
    fontSize: 15,
    fontWeight: '600',
  },
});

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDriver } from '../../context/DriverContext';

export const ActiveTripSheet: React.FC = () => {
  const {
    status,
    activeRide,
    waitingPassengerSeconds,
    arriveAtPickup,
    startTrip,
    completeTrip,
    cancelRide,
  } = useDriver();

  if (
    !activeRide ||
    (status !== 'EN_ROUTE_PICKUP' &&
      status !== 'ARRIVED_AT_PICKUP' &&
      status !== 'IN_TRIP')
  ) {
    return null;
  }

  const formatWaitingTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancelar Corrida',
      'Tem certeza de que deseja cancelar esta corrida?',
      [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim, Cancelar', style: 'destructive', onPress: () => cancelRide('Motorista cancelou') },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Turn-by-turn Navigation Banner */}
      <View style={styles.navigationBanner}>
        <View style={styles.navIconContainer}>
          <Ionicons
            name={status === 'IN_TRIP' ? 'arrow-forward' : 'navigate'}
            size={24}
            color="#FFFFFF"
          />
        </View>
        <View style={styles.navBannerTextContainer}>
          <Text style={styles.navBannerDistance}>
            {status === 'EN_ROUTE_PICKUP'
              ? `${activeRide.pickupDistanceKm} km • ${activeRide.pickupMinutes} min`
              : status === 'ARRIVED_AT_PICKUP'
              ? 'Local de embarque'
              : `${activeRide.distanceKm} km • ${activeRide.durationMinutes} min`}
          </Text>
          <Text style={styles.navBannerStreet} numberOfLines={1}>
            {status === 'IN_TRIP'
              ? activeRide.destinationLocation.address
              : activeRide.pickupLocation.address}
          </Text>
        </View>
      </View>

      {/* Passenger Card & Communication */}
      <View style={styles.passengerCard}>
        <View style={styles.passengerLeft}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={20} color="#FFFFFF" />
          </View>
          <View>
            <Text style={styles.passengerName}>{activeRide.passenger.name}</Text>
            <View style={styles.categoryRow}>
              <Text style={styles.categoryText}>{activeRide.category}</Text>
              <Text style={styles.fareHighlight}>
                • R$ {activeRide.price.toFixed(2).replace('.', ',')}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.commActions}>
          <TouchableOpacity
            style={styles.commButton}
            onPress={() => Alert.alert('Ligar para passageiro', activeRide.passenger.phone || '')}
            activeOpacity={0.7}
          >
            <Ionicons name="call" size={18} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.commButton}
            onPress={() => Alert.alert('Chat', 'Abrindo conversa com passageiro...')}
            activeOpacity={0.7}
          >
            <Ionicons name="chatbubble-ellipses" size={18} color="#000000" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.commButton, styles.cancelIconButton]}
            onPress={handleCancel}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={18} color="#E11900" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Status-specific Action Section */}
      {status === 'EN_ROUTE_PICKUP' && (
        <TouchableOpacity
          style={[styles.actionButton, styles.arrivedButton]}
          onPress={arriveAtPickup}
          activeOpacity={0.85}
        >
          <Ionicons name="location" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>CHEGUEI NO LOCAL</Text>
        </TouchableOpacity>
      )}

      {status === 'ARRIVED_AT_PICKUP' && (
        <View style={styles.arrivedActionsContainer}>
          <View style={styles.waitingBadge}>
            <Ionicons name="time" size={16} color="#0E8345" />
            <Text style={styles.waitingText}>
              Aguardando: {formatWaitingTimer(waitingPassengerSeconds)}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.actionButton, styles.startTripButton]}
            onPress={startTrip}
            activeOpacity={0.85}
          >
            <Ionicons name="play" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>INICIAR VIAGEM</Text>
          </TouchableOpacity>
        </View>
      )}

      {status === 'IN_TRIP' && (
        <TouchableOpacity
          style={[styles.actionButton, styles.endTripButton]}
          onPress={() => completeTrip(5)}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>FINALIZAR VIAGEM</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  navigationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
  },
  navIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#262626',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  navBannerTextContainer: {
    flex: 1,
  },
  navBannerDistance: {
    color: '#0E8345',
    fontSize: 14,
    fontWeight: '700',
  },
  navBannerStreet: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 2,
  },
  passengerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F7F7F8',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  passengerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passengerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  categoryText: {
    fontSize: 12,
    color: '#6B6B6B',
    fontWeight: '600',
  },
  fareHighlight: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0E8345',
  },
  commActions: {
    flexDirection: 'row',
    gap: 8,
  },
  commButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelIconButton: {
    borderColor: '#FEE2E2',
    backgroundColor: '#FEF2F2',
  },
  actionButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  arrivedButton: {
    backgroundColor: '#0E8345',
  },
  arrivedActionsContainer: {
    gap: 10,
  },
  waitingBadge: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  waitingText: {
    color: '#0E8345',
    fontWeight: '700',
    fontSize: 14,
  },
  startTripButton: {
    backgroundColor: '#000000',
  },
  endTripButton: {
    backgroundColor: '#E11900',
  },
});

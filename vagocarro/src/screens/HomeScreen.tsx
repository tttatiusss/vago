import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useDriver } from '../context/DriverContext';
import { DriverMap } from '../components/map/DriverMap';
import { RideOfferModal } from '../components/ride/RideOfferModal';
import { ActiveTripSheet } from '../components/ride/ActiveTripSheet';
import { TripCompletedModal } from '../components/ride/TripCompletedModal';

export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { status, profile, goOnline, goOffline, simulateIncomingRide } = useDriver();

  const isOnline = status !== 'OFFLINE';
  const isTripActive =
    status === 'EN_ROUTE_PICKUP' ||
    status === 'ARRIVED_AT_PICKUP' ||
    status === 'IN_TRIP';

  const handleToggleOnline = () => {
    if (isOnline) {
      goOffline();
    } else {
      goOnline();
    }
  };

  const handleLogout = () => {
    Alert.alert('Sair da conta', 'Deseja realmente sair da sua conta de motorista?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: () => {
          goOffline();
          logout();
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Top Header Bar */}
      <View style={styles.topBar}>
        <View style={styles.driverInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'M'}
            </Text>
          </View>
          <View>
            <Text style={styles.driverName}>{user?.name || profile.name}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#FFC043" />
              <Text style={styles.ratingText}>{profile.rating.toFixed(2)}</Text>
              <Text style={styles.categoryBadge}>VagoX</Text>
            </View>
          </View>
        </View>

        <View style={styles.topActions}>
          {isOnline && !isTripActive && (
            <TouchableOpacity
              onPress={simulateIncomingRide}
              style={styles.testTripButton}
              activeOpacity={0.7}
            >
              <Ionicons name="flash" size={16} color="#000000" />
              <Text style={styles.testTripText}>Testar Corrida</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleLogout}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={22} color="#000000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Earnings Overview Card */}
      {!isTripActive && (
        <View style={styles.earningsCard}>
          <Text style={styles.earningsLabel}>Ganhos de hoje</Text>
          <Text style={styles.earningsValue}>
            R$ {profile.todayEarnings.toFixed(2).replace('.', ',')}
          </Text>
          <View style={styles.earningsStatsRow}>
            <View style={styles.statItem}>
              <Ionicons name="car-outline" size={16} color="#6B6B6B" />
              <Text style={styles.statText}>{profile.todayTrips} viagens</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={16} color="#6B6B6B" />
              <Text style={styles.statText}>{profile.todayHoursOnline}h online</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="trending-up" size={16} color="#0E8345" />
              <Text style={[styles.statText, { color: '#0E8345' }]}>
                {profile.acceptanceRate}% aceitação
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Main Interactive Map */}
      <View style={styles.mapContainer}>
        <DriverMap />
      </View>

      {/* Active Trip Bottom Sheet (when on trip) */}
      {isTripActive && <ActiveTripSheet />}

      {/* Bottom Online/Offline Toggle Bar (when not in trip) */}
      {!isTripActive && (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.mainActionButton, isOnline ? styles.offlineButton : styles.onlineButton]}
            onPress={handleToggleOnline}
            activeOpacity={0.85}
          >
            <Ionicons
              name={isOnline ? 'power' : 'navigate'}
              size={24}
              color="#FFFFFF"
            />
            <Text style={styles.mainActionButtonText}>
              {isOnline ? 'FICAR OFFLINE' : 'INICIAR (FICAR ONLINE)'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Ride Offer Modal (Pop-up when ride is received) */}
      <RideOfferModal />

      {/* Trip Completed Modal */}
      <TripCompletedModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    zIndex: 10,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  driverName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  categoryBadge: {
    fontSize: 11,
    fontWeight: '600',
    color: '#545454',
    backgroundColor: '#EEEEEE',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 4,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  testTripButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 4,
  },
  testTripText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F3F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  earningsCard: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 5,
  },
  earningsLabel: {
    fontSize: 13,
    color: '#6B6B6B',
    fontWeight: '500',
  },
  earningsValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#000000',
    marginVertical: 2,
    letterSpacing: -0.5,
  },
  earningsStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    width: '100%',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#E0E0E0',
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#545454',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  mainActionButton: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  onlineButton: {
    backgroundColor: '#000000',
  },
  offlineButton: {
    backgroundColor: '#E11900',
  },
  mainActionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

  const [isOnline, setIsOnline] = useState(false);
  const [earningsToday, setEarningsToday] = useState(148.9);
  const [tripsToday, setTripsToday] = useState(6);

  const handleToggleOnline = () => {
    setIsOnline((prev) => !prev);
  };

  const handleLogout = () => {
    Alert.alert('Sair da conta', 'Deseja realmente sair da sua conta de motorista?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
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
            <Text style={styles.driverName}>{user?.name || 'Motorista'}</Text>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#FFC043" />
              <Text style={styles.ratingText}>{user?.rating?.toFixed(2) || '5.00'}</Text>
              <Text style={styles.categoryBadge}>VagoX</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleLogout}
          style={styles.iconButton}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={22} color="#000000" />
        </TouchableOpacity>
      </View>

      {/* Earnings Overview Card */}
      <View style={styles.earningsCard}>
        <Text style={styles.earningsLabel}>Ganhos de hoje</Text>
        <Text style={styles.earningsValue}>
          R$ {earningsToday.toFixed(2).replace('.', ',')}
        </Text>
        <View style={styles.earningsStatsRow}>
          <View style={styles.statItem}>
            <Ionicons name="car-outline" size={16} color="#6B6B6B" />
            <Text style={styles.statText}>{tripsToday} viagens</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={16} color="#6B6B6B" />
            <Text style={styles.statText}>3h 24m online</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Ionicons name="trending-up" size={16} color="#0E8345" />
            <Text style={[styles.statText, { color: '#0E8345' }]}>Alta demanda</Text>
          </View>
        </View>
      </View>

      {/* Main Status / Map Area */}
      <View style={styles.mapSimulationArea}>
        <View style={[styles.radarCircle, isOnline && styles.radarCircleActive]}>
          <Ionicons
            name="car-sport"
            size={48}
            color={isOnline ? '#0E8345' : '#8E8E93'}
          />
        </View>
        <Text style={styles.statusTitle}>
          {isOnline ? 'Você está ONLINE' : 'Você está OFFLINE'}
        </Text>
        <Text style={styles.statusSubtitle}>
          {isOnline
            ? 'Aguardando chamadas de passageiros na sua região...'
            : 'Fique online para começar a receber solicitações de viagens.'}
        </Text>
      </View>

      {/* Bottom Action Sheet */}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F8',
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
    marginTop: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  earningsLabel: {
    fontSize: 14,
    color: '#6B6B6B',
    fontWeight: '500',
  },
  earningsValue: {
    fontSize: 34,
    fontWeight: '800',
    color: '#000000',
    marginVertical: 4,
    letterSpacing: -0.5,
  },
  earningsStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingTop: 12,
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
  mapSimulationArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  radarCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  radarCircleActive: {
    backgroundColor: '#D1FADF',
    borderWidth: 3,
    borderColor: '#0E8345',
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 6,
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 16,
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

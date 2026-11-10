import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDriver } from '../../context/DriverContext';

export const TripCompletedModal: React.FC = () => {
  const { status, activeRide, profile, goOnline } = useDriver();
  const [rating, setRating] = useState(5);

  if (status !== 'TRIP_COMPLETED' || !activeRide) {
    return null;
  }

  const handleFinish = () => {
    goOnline();
  };

  return (
    <Modal visible={true} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons name="checkmark-circle" size={56} color="#0E8345" />
          </View>

          <Text style={styles.title}>Viagem Concluída!</Text>
          <Text style={styles.subtitle}>
            Você levou {activeRide.passenger.name} com segurança ao destino.
          </Text>

          <View style={styles.earningsBox}>
            <Text style={styles.earningsLabel}>Valor desta corrida</Text>
            <Text style={styles.earningsValue}>
              + R$ {activeRide.price.toFixed(2).replace('.', ',')}
            </Text>
            <Text style={styles.todayTotalText}>
              Total hoje: R$ {profile.todayEarnings.toFixed(2).replace('.', ',')}
            </Text>
          </View>

          <View style={styles.ratingSection}>
            <Text style={styles.ratingPrompt}>
              Como foi a experiência com {activeRide.passenger.name}?
            </Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                >
                  <Ionicons
                    name={star <= rating ? 'star' : 'star-outline'}
                    size={36}
                    color="#FFC043"
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.doneButton}
            onPress={handleFinish}
            activeOpacity={0.85}
          >
            <Text style={styles.doneButtonText}>Continuar Dirigindo</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  iconCircle: {
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#000000',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B6B6B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  earningsBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  earningsLabel: {
    fontSize: 13,
    color: '#6B6B6B',
    fontWeight: '600',
  },
  earningsValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0E8345',
    marginVertical: 4,
  },
  todayTotalText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  ratingSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  ratingPrompt: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 12,
    textAlign: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  doneButton: {
    backgroundColor: '#000000',
    height: 54,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

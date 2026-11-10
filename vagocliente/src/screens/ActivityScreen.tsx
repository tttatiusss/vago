import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export const ActivityScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Atividade</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Recentes</Text>

        {/* Empty state or sample past ride */}
        <View style={styles.pastTripCard}>
          <View style={styles.tripIconBox}>
            <Ionicons name="car-sport" size={24} color="#000000" />
          </View>
          <View style={styles.tripInfo}>
            <Text style={styles.tripDestination}>Av. Paulista, 1000</Text>
            <Text style={styles.tripDate}>Hoje às 14:30 • R$ 24,90</Text>
          </View>
          <TouchableOpacity
            style={styles.rebookButton}
            onPress={() => Alert.alert('Repetir Viagem', 'Solicitando corrida para o mesmo destino')}
          >
            <MaterialCommunityIcons name="reload" size={16} color="#000000" />
            <Text style={styles.rebookText}>Repetir</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.pastTripCard}>
          <View style={styles.tripIconBox}>
            <MaterialCommunityIcons name="package-variant-closed" size={24} color="#D97706" />
          </View>
          <View style={styles.tripInfo}>
            <Text style={styles.tripDestination}>Entrega Courier • Doc. Escritório</Text>
            <Text style={styles.tripDate}>Ontem às 11:15 • Concluído</Text>
          </View>
          <Ionicons name="checkmark-circle" size={22} color="#16A34A" />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E4E4E7',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.5,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#18181B',
    marginBottom: 16,
  },
  pastTripCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  tripIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  tripInfo: {
    flex: 1,
  },
  tripDestination: {
    fontSize: 15,
    fontWeight: '700',
    color: '#09090B',
    marginBottom: 3,
  },
  tripDate: {
    fontSize: 13,
    color: '#71717A',
  },
  rebookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    gap: 4,
  },
  rebookText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
});

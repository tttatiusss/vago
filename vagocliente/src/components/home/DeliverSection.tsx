import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

interface DeliverSectionProps {
  onPressOption?: (id: string) => void;
}

export const DeliverSection: React.FC<DeliverSectionProps> = ({ onPressOption }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Entregue com Courier</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Card 1: Enviar um pacote */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => onPressOption?.('send_package')}
          activeOpacity={0.75}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: '#EFF6FF' }]}>
              <MaterialCommunityIcons name="moped" size={28} color="#2563EB" />
            </View>
            <Ionicons name="arrow-forward" size={16} color="#9CA3AF" />
          </View>
          <Text style={styles.cardTitle}>Envio por Moto</Text>
          <Text style={styles.cardSubtitle}>Mais rápido para itens pequenos</Text>
        </TouchableOpacity>

        {/* Card 2: Encomendas maiores */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => onPressOption?.('send_car')}
          activeOpacity={0.75}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: '#F0FDF4' }]}>
              <MaterialCommunityIcons name="car-estate" size={28} color="#16A34A" />
            </View>
            <Ionicons name="arrow-forward" size={16} color="#9CA3AF" />
          </View>
          <Text style={styles.cardTitle}>Envio por Carro</Text>
          <Text style={styles.cardSubtitle}>Para caixas e compras grandes</Text>
        </TouchableOpacity>

        {/* Card 3: Rastreamento em tempo real */}
        <TouchableOpacity
          style={styles.card}
          onPress={() => onPressOption?.('tracking')}
          activeOpacity={0.75}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, { backgroundColor: '#FEF3C7' }]}>
              <MaterialCommunityIcons name="map-marker-path" size={28} color="#D97706" />
            </View>
            <Ionicons name="arrow-forward" size={16} color="#9CA3AF" />
          </View>
          <Text style={styles.cardTitle}>Rastreamento Real</Text>
          <Text style={styles.cardSubtitle}>Acompanhe a rota em tempo real</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.4,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  card: {
    width: 200,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
});

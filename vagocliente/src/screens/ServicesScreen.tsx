import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

interface ServiceItemProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}

const ServiceCard: React.FC<ServiceItemProps> = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.iconCircle}>
      <MaterialCommunityIcons name={icon} size={28} color="#000000" />
    </View>
    <View style={styles.textContainer}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>{subtitle}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#A1A1AA" />
  </TouchableOpacity>
);

export const ServicesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Serviços</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionHeader}>Ir para qualquer lugar</Text>
        <ServiceCard
          icon="car-side"
          title="Viagem Vago"
          subtitle="Carros confortáveis e econômicos"
          onPress={() => Alert.alert('Viagem', 'Pedir um carro')}
        />
        <ServiceCard
          icon="calendar-clock"
          title="Reserva Antecipada"
          subtitle="Planeje sua viagem com até 30 dias de antecedência"
          onPress={() => Alert.alert('Reserva', 'Agendar uma viagem')}
        />

        <Text style={[styles.sectionHeader, { marginTop: 20 }]}>Envios & Encomendas</Text>
        <ServiceCard
          icon="package-variant-closed"
          title="Vago Courier"
          subtitle="Envie pacotes e documentos com entrega no mesmo dia"
          onPress={() => Alert.alert('Courier', 'Solicitar entregador')}
        />
        <ServiceCard
          icon="storefront-outline"
          title="Retirada em Loja"
          subtitle="Peça para buscar itens em estabelecimentos parceiros"
          onPress={() => Alert.alert('Retirada', 'Serviço de retirada')}
        />
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
    paddingBottom: 32,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#18181B',
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F4F6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#09090B',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#71717A',
  },
});

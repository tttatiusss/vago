import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TopModeSelector } from '../components/home/TopModeSelector';
import { SearchBar } from '../components/home/SearchBar';
import { SuggestionsSection } from '../components/home/SuggestionsSection';
import { PromoBanner } from '../components/home/PromoBanner';
import { DeliverSection } from '../components/home/DeliverSection';
import { AppMode } from '../types/navigation';

export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [currentMode, setCurrentMode] = useState<AppMode>('vago');

  const handleSearchPress = () => {
    Alert.alert(
      'Buscar Destino',
      'Para onde você gostaria de ir com o Vago?',
      [{ text: 'OK' }]
    );
  };

  const handleLaterPress = () => {
    Alert.alert(
      'Agendar Viagem',
      'Escolha a data e hora desejada para sua corrida.',
      [{ text: 'OK' }]
    );
  };

  const handleSelectSuggestion = (type: string) => {
    const titles: Record<string, string> = {
      ride: 'Viagem Vago',
      send_items: 'Envio de Itens',
      reserve: 'Reserva Antecipada',
      store_pickup: 'Retirada em Loja',
    };
    Alert.alert(titles[type] || 'Serviço', `Você selecionou: ${titles[type] || type}`);
  };

  const handleDeliverOption = (id: string) => {
    const names: Record<string, string> = {
      send_package: 'Envio por Moto',
      send_car: 'Envio por Carro',
      tracking: 'Rastreamento em Tempo Real',
    };
    Alert.alert('Courier', `Opção selecionada: ${names[id] || id}`);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Switcher: 🚗 Vago  |  📦 Courier */}
      <TopModeSelector
        currentMode={currentMode}
        onSelectMode={(mode) => setCurrentMode(mode)}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar: "Para onde?" + "Mais tarde" */}
        <SearchBar
          onPressSearch={handleSearchPress}
          onPressLater={handleLaterPress}
        />

        {/* NOTA: Os 2 locais recentes (Ikeja e Egbeda) foram omitidos conforme instrução */}

        {/* Suggestions Section: Viagem, Envios, Reserva, Retirada */}
        <SuggestionsSection
          onSelectSuggestion={handleSelectSuggestion}
          onPressSeeAll={() => Alert.alert('Sugestões', 'Visualizando todos os serviços')}
        />

        {/* Promo Banner: Entregas no mesmo dia */}
        <PromoBanner
          onPressCourier={() => Alert.alert('Courier', 'Solicitar entrega no mesmo dia')}
          onPressReservePromo={() => Alert.alert('Reserva', 'Agendar uma viagem com desconto')}
        />

        {/* Deliver with Courier Section */}
        <DeliverSection onPressOption={handleDeliverOption} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
});

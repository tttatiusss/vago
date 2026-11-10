import React, { useState, useEffect } from 'react';
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
import { PlanRideModal } from './PlanRideModal';
import PlanRideScreen from './PlanRideScreen';
import { AppMode } from '../types/navigation';
import { PlacePrediction, getPlaceCoordinates } from '../services/googlePlaces';
import {
  getUserLocationWithBackgroundRefresh,
  watchUserLocation,
} from '../services/locationService';
import { Coords } from '../services/googleDirections';

interface ActiveRidePlan {
  originAddress: string;
  originCoords: Coords;
  destination: PlacePrediction;
  destinationCoords: Coords;
}

export const HomeScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const [currentMode, setCurrentMode] = useState<AppMode>('vago');
  const [isPlanRideModalVisible, setIsPlanRideModalVisible] = useState(false);
  const [activeRidePlan, setActiveRidePlan] = useState<ActiveRidePlan | null>(null);

  // Inicializa o cache de localização em segundo plano assim que a tela abre
  useEffect(() => {
    let cleanupWatcher: (() => void) | undefined;

    (async () => {
      // 1. Busca inicial e pré-aquecimento do cache
      await getUserLocationWithBackgroundRefresh();

      // 2. Observa mudanças de posição do usuário em segundo plano
      cleanupWatcher = await watchUserLocation((newLocation) => {
        console.log('[HomeScreen] Localização atualizada em segundo plano:', newLocation.address);
      });
    })();

    return () => {
      cleanupWatcher?.();
    };
  }, []);

  const handleSearchPress = () => {
    setIsPlanRideModalVisible(true);
  };

  const handleLaterPress = () => {
    setIsPlanRideModalVisible(true);
  };

  const handleSelectSuggestion = (type: string) => {
    if (type === 'ride') {
      setIsPlanRideModalVisible(true);
      return;
    }
    const titles: Record<string, string> = {
      send_items: 'Envio de Itens',
      reserve: 'Reserva Antecipada',
      store_pickup: 'Retirada em Loja',
    };
    Alert.alert(titles[type] || 'Serviço', `Você selecionou: ${titles[type] || type}`);
  };

  const handleDestinationConfirmed = async (
    destination: PlacePrediction,
    originAddress: string,
    originCoords: Coords
  ) => {
    setIsPlanRideModalVisible(false);

    // Obtém coordenadas do destino via Google API
    const destinationCoords = await getPlaceCoordinates(
      destination.placeId,
      destination.fullAddress,
      originCoords
    );

    setActiveRidePlan({
      originAddress,
      originCoords,
      destination,
      destinationCoords,
    });
  };

  const handleDeliverOption = (id: string) => {
    const names: Record<string, string> = {
      send_package: 'Envio por Moto',
      send_car: 'Envio por Carro',
      tracking: 'Rastreamento em Tempo Real',
    };
    Alert.alert('Courier', `Opção selecionada: ${names[id] || id}`);
  };

  // Se o usuário selecionou o destino, exibe a tela de escolha da corrida (PlanRideScreen)
  if (activeRidePlan) {
    return (
      <PlanRideScreen
        originAddress={activeRidePlan.originAddress}
        originCoords={activeRidePlan.originCoords}
        destination={activeRidePlan.destination}
        destinationCoords={activeRidePlan.destinationCoords}
        onBack={() => {
          setActiveRidePlan(null);
          setIsPlanRideModalVisible(true);
        }}
        onConfirmRide={(ride) => {
          Alert.alert(
            'Viagem Solicitada com Sucesso!',
            `Você escolheu ${ride.name} (${ride.price}).\nConectando aos motoristas Vago mais próximos...`,
            [{ text: 'OK', onPress: () => setActiveRidePlan(null) }]
          );
        }}
      />
    );
  }

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

      {/* Modal de Navegação / Planejamento de Viagem */}
      <PlanRideModal
        visible={isPlanRideModalVisible}
        onClose={() => setIsPlanRideModalVisible(false)}
        onSelectDestination={handleDestinationConfirmed}
      />
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

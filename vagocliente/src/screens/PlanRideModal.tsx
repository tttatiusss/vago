import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  getUserLocationWithBackgroundRefresh,
  fetchFreshLocation,
  UserLocationResult,
} from '../services/locationService';
import { searchPlaces, PlacePrediction } from '../services/googlePlaces';

interface PlanRideModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectDestination?: (
    destination: PlacePrediction,
    originAddress: string,
    originCoords: { latitude: number; longitude: number }
  ) => void;
}

export const PlanRideModal: React.FC<PlanRideModalProps> = ({
  visible,
  onClose,
  onSelectDestination,
}) => {
  const insets = useSafeAreaInsets();
  const inputRef = useRef<any>(null);

  // Estados de localização e busca
  const [userLocation, setUserLocation] = useState<UserLocationResult | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [originText, setOriginText] = useState('');

  const [destinationText, setDestinationText] = useState('');
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Estados dos seletores superiores (Pill dropdowns)
  const [pickupTimeOption, setPickupTimeOption] = useState<'now' | 'later'>('now');
  const [passengerOption, setPassengerOption] = useState<'for_me' | 'someone_else'>('for_me');

  // Buscar localização atual com expo-location ao abrir o modal
  useEffect(() => {
    if (visible) {
      loadCurrentLocation();
      // Focar o campo de destino automaticamente após abrir
      setTimeout(() => {
        inputRef.current?.focus();
      }, 350);
    } else {
      setDestinationText('');
      setPredictions([]);
    }
  }, [visible]);

  const loadCurrentLocation = async (forceFresh = false) => {
    if (forceFresh) {
      setLoadingLocation(true);
      const fresh = await fetchFreshLocation(userLocation);
      setUserLocation(fresh);
      setOriginText(fresh.address);
      setLoadingLocation(false);
      return;
    }

    // Se já tivermos o endereço em memória, não precisamos exibir spinner
    if (!originText) {
      setLoadingLocation(true);
    }

    const result = await getUserLocationWithBackgroundRefresh((updated) => {
      // Atualização em segundo plano: altera a localização se ela mudar
      setUserLocation(updated);
      setOriginText(updated.address);
      setLoadingLocation(false);
    });

    setUserLocation(result);
    setOriginText(result.address);
    setLoadingLocation(false);
  };

  // Buscar destino via Google APIs conforme o usuário digita (com debounce)
  useEffect(() => {
    if (!destinationText.trim()) {
      setPredictions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      const results = await searchPlaces(
        destinationText,
        userLocation ? userLocation.coords : null
      );
      setPredictions(results);
      setIsSearching(false);
    }, 280);

    return () => clearTimeout(timer);
  }, [destinationText, userLocation]);

  const handleSelectPlace = (place: PlacePrediction) => {
    setDestinationText(place.mainText);
    const coords = userLocation?.coords || {
      latitude: -23.561684,
      longitude: -46.655981,
    };
    if (onSelectDestination) {
      onSelectDestination(place, originText || 'Sua localização atual', coords);
    } else {
      Alert.alert(
        'Destino Confirmado',
        `Partida: ${originText}\nDestino: ${place.fullAddress}`,
        [
          {
            text: 'OK',
            onPress: onClose,
          },
        ]
      );
    }
  };

  const handleAddStop = () => {
    Alert.alert('Adicionar Parada', 'Adicione uma parada intermediária à sua viagem.');
  };

  const handleSearchDifferentCity = () => {
    Alert.alert('Buscar em outra cidade', 'Digite o nome da cidade onde você deseja viajar.');
  };

  const handleSetLocationOnMap = () => {
    Alert.alert('Definir local no mapa', 'Abrindo o mapa interativo para escolher o ponto exato.');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        {/* Background Simulated Map Peek Bar at Top */}
        <View style={styles.topPeekBackground}>
          <View style={styles.dragHandleBar} />
        </View>

        {/* Header: Back Arrow + Plan your ride title */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Plan your ride</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Dropdown Pills: Pickup now  |  For me */}
        <View style={styles.pillsRow}>
          <TouchableOpacity
            style={styles.pillButton}
            onPress={() =>
              setPickupTimeOption((prev) => (prev === 'now' ? 'later' : 'now'))
            }
            activeOpacity={0.75}
          >
            <Ionicons name="time-outline" size={16} color="#000000" />
            <Text style={styles.pillText}>
              {pickupTimeOption === 'now' ? 'Pickup now' : 'Schedule later'}
            </Text>
            <Ionicons name="chevron-down" size={14} color="#000000" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.pillButton}
            onPress={() =>
              setPassengerOption((prev) => (prev === 'for_me' ? 'someone_else' : 'for_me'))
            }
            activeOpacity={0.75}
          >
            <Ionicons name="person-outline" size={16} color="#000000" />
            <Text style={styles.pillText}>
              {passengerOption === 'for_me' ? 'For me' : 'For a friend'}
            </Text>
            <Ionicons name="chevron-down" size={14} color="#000000" />
          </TouchableOpacity>
        </View>

        {/* Route Input Box (Origin + Destination) */}
        <View style={styles.routeBoxWrapper}>
          <View style={styles.routeBox}>
            {/* Visual Route Connector Line on Left */}
            <View style={styles.connectorContainer}>
              <View style={styles.dotOrigin} />
              <View style={styles.connectorLine} />
              <View style={styles.squareDestination} />
            </View>

            {/* Inputs Column */}
            <View style={styles.inputsColumn}>
              {/* Field 1: Pickup Location (Expo Location) */}
              <View style={styles.originInputRow}>
                {loadingLocation ? (
                  <View style={styles.locationLoadingRow}>
                    <ActivityIndicator size="small" color="#000000" />
                    <Text style={styles.originLoadingText}>Buscando localização...</Text>
                  </View>
                ) : (
                  <TextInput
                    style={styles.originTextInput}
                    value={originText}
                    onChangeText={setOriginText}
                    placeholder="Sua localização atual"
                    placeholderTextColor="#71717A"
                    numberOfLines={1}
                  />
                )}
                <TouchableOpacity
                  onPress={() => loadCurrentLocation(true)}
                  style={styles.refreshLocButton}
                >
                  <Ionicons name="navigate-outline" size={16} color="#000000" />
                </TouchableOpacity>
              </View>

              {/* Internal Divider Line */}
              <View style={styles.inputDivider} />

              {/* Field 2: Destination Location (Google APIs) */}
              <View style={styles.destinationInputRow}>
                <TextInput
                  ref={inputRef}
                  style={styles.destinationTextInput}
                  value={destinationText}
                  onChangeText={setDestinationText}
                  placeholder="Where to?"
                  placeholderTextColor="#71717A"
                  autoCorrect={false}
                  returnKeyType="search"
                />
                {destinationText.length > 0 && (
                  <TouchableOpacity
                    onPress={() => setDestinationText('')}
                    style={styles.clearButton}
                  >
                    <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Add Stop Button (+) */}
            <TouchableOpacity
              style={styles.addStopButton}
              onPress={handleAddStop}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={20} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Results Area / Action Items with KeyboardAvoidance */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.resultsContainer}
        >
          {isSearching && (
            <View style={styles.searchingRow}>
              <ActivityIndicator size="small" color="#000000" />
              <Text style={styles.searchingText}>Consultando Google APIs...</Text>
            </View>
          )}

          {/* Se o usuário estiver digitando e houver previsões */}
          {destinationText.trim().length > 0 ? (
            <FlatList
              data={predictions}
              keyExtractor={(item) => item.placeId}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.placeItemRow}
                  onPress={() => handleSelectPlace(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.placeIconCircle}>
                    <Ionicons name="location-sharp" size={20} color="#000000" />
                  </View>
                  <View style={styles.placeTextContainer}>
                    <Text style={styles.placeMainText} numberOfLines={1}>
                      {item.mainText}
                    </Text>
                    <Text style={styles.placeSecondaryText} numberOfLines={1}>
                      {item.secondaryText}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                !isSearching ? (
                  <View style={styles.emptyResultsBox}>
                    <Text style={styles.emptyResultsText}>
                      Nenhum resultado encontrado para "{destinationText}".
                    </Text>
                  </View>
                ) : undefined
              }
            />
          ) : (
            /* Lista de Ações Estáticas (Locais recentes omitidos conforme solicitado) */
            <View style={styles.staticActionsContainer}>
              {/* Option 1: Search in a different city */}
              <TouchableOpacity
                style={styles.staticActionRow}
                onPress={handleSearchDifferentCity}
                activeOpacity={0.7}
              >
                <View style={styles.actionIconCircle}>
                  <Ionicons name="globe-outline" size={22} color="#000000" />
                </View>
                <Text style={styles.staticActionText}>Search in a different city</Text>
              </TouchableOpacity>

              {/* Option 2: Set location on map */}
              <TouchableOpacity
                style={styles.staticActionRow}
                onPress={handleSetLocationOnMap}
                activeOpacity={0.7}
              >
                <View style={styles.actionIconCircle}>
                  <Ionicons name="location-outline" size={22} color="#000000" />
                </View>
                <Text style={styles.staticActionText}>Set location on map</Text>
              </TouchableOpacity>
            </View>
          )}
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topPeekBackground: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  dragHandleBar: {
    width: 44,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: '#D1D5DB',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
    letterSpacing: -0.3,
  },
  pillsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 14,
  },
  pillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    gap: 6,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  routeBoxWrapper: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  routeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#000000',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  connectorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    width: 14,
  },
  dotOrigin: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000000',
  },
  connectorLine: {
    width: 2,
    height: 28,
    backgroundColor: '#000000',
    marginVertical: 2,
  },
  squareDestination: {
    width: 8,
    height: 8,
    backgroundColor: '#000000',
  },
  inputsColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  originInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
  },
  originTextInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#111111',
    paddingVertical: 0,
  },
  locationLoadingRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  originLoadingText: {
    fontSize: 13,
    color: '#71717A',
  },
  refreshLocButton: {
    padding: 6,
  },
  inputDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5E7EB',
    marginVertical: 2,
  },
  destinationInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
  },
  destinationTextInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  addStopButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  searchingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  searchingText: {
    fontSize: 13,
    color: '#71717A',
  },
  placeItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
  },
  placeIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  placeTextContainer: {
    flex: 1,
  },
  placeMainText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#09090B',
    marginBottom: 2,
  },
  placeSecondaryText: {
    fontSize: 12,
    color: '#71717A',
  },
  emptyResultsBox: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyResultsText: {
    fontSize: 14,
    color: '#71717A',
    textAlign: 'center',
  },
  staticActionsContainer: {
    paddingTop: 8,
  },
  staticActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
  },
  actionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  staticActionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
  },
});

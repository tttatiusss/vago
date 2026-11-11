import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { fetchGoogleRoute, RouteResult, Coords } from '../services/googleDirections';
import { PlacePrediction } from '../services/googlePlaces';
import {
  calculateRidePrices,
  CalculatedRideOption,
} from '../services/pricingService';

// Tenta importar react-native-maps com segurança para evitar travamento em Web/Expo Go
let MapView: any = null;
let Marker: any = null;
let Polyline: any = null;

if (Platform.OS !== 'web') {
  try {
    const Maps = require('react-native-maps');
    MapView = Maps.default;
    Marker = Maps.Marker;
    Polyline = Maps.Polyline;
  } catch (e) {
    // Fallback gracioso
  }
}

interface PlanRideScreenProps {
  originAddress: string;
  originCoords: Coords;
  destination: PlacePrediction;
  destinationCoords: Coords;
  onBack: () => void;
  onConfirmRide: (ride: CalculatedRideOption) => void;
}

export default function PlanRideScreen({
  originAddress,
  originCoords,
  destination,
  destinationCoords,
  onBack,
  onConfirmRide,
}: PlanRideScreenProps) {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<any>(null);

  const [selectedRideId, setSelectedRideId] = useState<string>('priority');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'vago_pay'>('cash');
  const [routeData, setRouteData] = useState<RouteResult | null>(null);

  const isNativeMapReady = Platform.OS !== 'web' && MapView && Marker && Polyline;

  // Carros na área da rota simulados
  const nearbyCars: Coords[] = [
    {
      latitude: originCoords.latitude + 0.006,
      longitude: originCoords.longitude - 0.003,
    },
    {
      latitude: originCoords.latitude + 0.012,
      longitude: originCoords.longitude + 0.007,
    },
    {
      latitude: originCoords.latitude + 0.018,
      longitude: originCoords.longitude + 0.014,
    },
  ];

  // Busca a rota e o tempo real da Google Directions API com tráfego
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const result = await fetchGoogleRoute(originCoords, destinationCoords);
      if (isMounted) {
        setRouteData(result);

        if (mapRef.current && result.coordinates.length > 0) {
          setTimeout(() => {
            mapRef.current?.fitToCoordinates(result.coordinates, {
              edgePadding: { top: 80, right: 60, bottom: 340, left: 60 },
              animated: true,
            });
          }, 350);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [originCoords, destinationCoords]);

  // Calcula os preços dinâmicos em Euro baseados na distância e tempo do Google
  const rideOptions: CalculatedRideOption[] = useMemo(() => {
    const dummyRoute: RouteResult = routeData || {
      coordinates: [],
      distanceText: '8,5 km',
      durationText: '12 min',
      durationMinutes: 12,
      durationSeconds: 720,
      distanceKm: 8.5,
      distanceMeters: 8500,
    };

    return calculateRidePrices(dummyRoute);
  }, [routeData]);

  const selectedRide =
    rideOptions.find((r) => r.id === selectedRideId) || rideOptions[0];

  const handleSelectPayment = () => {
    Alert.alert('Forma de Pagamento', 'Escolha como prefere pagar:', [
      { text: 'Dinheiro (Cash)', onPress: () => setPaymentMethod('cash') },
      { text: 'Cartão de Crédito', onPress: () => setPaymentMethod('card') },
      { text: 'Vago Pay', onPress: () => setPaymentMethod('vago_pay') },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const handleConfirm = () => {
    onConfirmRide(selectedRide);
  };

  const renderVehicleIcon = (type: CalculatedRideOption['iconType']) => {
    switch (type) {
      case 'priority':
        return (
          <View style={styles.vehicleIconWrapper}>
            <MaterialCommunityIcons name="car-sports" size={42} color="#18181B" />
          </View>
        );
      case 'car':
        return (
          <View style={styles.vehicleIconWrapper}>
            <MaterialCommunityIcons name="car-side" size={40} color="#27272A" />
          </View>
        );
      case 'courier':
        return (
          <View style={styles.courierGraphicRow}>
            <MaterialCommunityIcons name="moped" size={32} color="#18181B" />
            <View style={styles.miniParcelBox}>
              <MaterialCommunityIcons name="package-variant-closed" size={16} color="#D97706" />
            </View>
          </View>
        );
      case 'wait_save':
        return (
          <View style={styles.vehicleIconWrapper}>
            <MaterialCommunityIcons name="car-side" size={38} color="#52525B" />
            <View style={styles.clockOverlay}>
              <Ionicons name="time" size={12} color="#000000" />
            </View>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. MAPA COM ROTA DO GOOGLE */}
      <View style={styles.mapContainer}>
        {isNativeMapReady ? (
          <MapView
            ref={mapRef}
            style={StyleSheet.absoluteFill}
            initialRegion={{
              latitude: (originCoords.latitude + destinationCoords.latitude) / 2,
              longitude: (originCoords.longitude + destinationCoords.longitude) / 2,
              latitudeDelta: Math.abs(originCoords.latitude - destinationCoords.latitude) * 1.5 || 0.08,
              longitudeDelta: Math.abs(originCoords.longitude - destinationCoords.longitude) * 1.5 || 0.08,
            }}
          >
            {/* Linha da rota traçada pelo Google Directions */}
            {routeData?.coordinates && routeData.coordinates.length > 0 && (
              <Polyline
                coordinates={routeData.coordinates}
                strokeColor="#1F2937"
                strokeWidth={5}
                lineCap="round"
                lineJoin="round"
              />
            )}

            {/* Marcador de Origem com minutos calculados pelo Google */}
            <Marker coordinate={originCoords} anchor={{ x: 0.5, y: 0.5 }}>
              <View style={styles.markerAnchor}>
                <View style={styles.calloutCard}>
                  <View style={styles.calloutTextContainer}>
                    <Text style={styles.calloutTitle} numberOfLines={1}>
                      {originAddress}
                    </Text>
                    <Text style={styles.calloutSubtitle} numberOfLines={1}>
                      Ponto de partida
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#000000" />
                </View>
                <View style={styles.originMarkerBadge}>
                  <View style={styles.timePill}>
                    <Text style={styles.timePillNumber}>
                      {routeData?.durationMinutes || 9}
                    </Text>
                    <Text style={styles.timePillUnit}>MIN</Text>
                  </View>
                  <View style={styles.originDot} />
                </View>
              </View>
            </Marker>

            {/* Marcador de Destino */}
            <Marker coordinate={destinationCoords} anchor={{ x: 0.5, y: 0.5 }}>
              <View style={styles.markerAnchor}>
                <View style={styles.calloutCard}>
                  <View style={styles.calloutTextContainer}>
                    <Text style={styles.calloutTitle} numberOfLines={1}>
                      {destination.mainText}
                    </Text>
                    <Text style={styles.calloutSubtitle} numberOfLines={1}>
                      {destination.secondaryText}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#000000" />
                </View>
                <View style={styles.destinationSquare} />
              </View>
            </Marker>

            {/* Veículos Vago nas proximidades */}
            {nearbyCars.map((carCoord, idx) => (
              <Marker key={`car_${idx}`} coordinate={carCoord} anchor={{ x: 0.5, y: 0.5 }}>
                <View style={styles.mapCarMarker}>
                  <MaterialCommunityIcons name="car-side" size={22} color="#18181B" />
                </View>
              </Marker>
            ))}
          </MapView>
        ) : (
          <View style={styles.fallbackMap}>
            <View style={styles.gridLineH1} />
            <View style={styles.gridLineH2} />
            <View style={styles.gridLineV1} />
            <View style={styles.gridLineV2} />

            <View style={styles.fallbackRouteLine} />

            {/* Marcador de Destino */}
            <View style={styles.fallbackDestMarker}>
              <View style={styles.calloutCard}>
                <View style={styles.calloutTextContainer}>
                  <Text style={styles.calloutTitle} numberOfLines={1}>
                    {destination.mainText}
                  </Text>
                  <Text style={styles.calloutSubtitle} numberOfLines={1}>
                    {destination.secondaryText}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={14} color="#000000" />
              </View>
              <View style={styles.destinationSquare} />
            </View>

            {/* Marcador de Origem */}
            <View style={styles.fallbackOriginMarker}>
              <View style={styles.originMarkerBadge}>
                <View style={styles.timePill}>
                  <Text style={styles.timePillNumber}>
                    {routeData?.durationMinutes || 9}
                  </Text>
                  <Text style={styles.timePillUnit}>MIN</Text>
                </View>
                <View style={styles.originDot} />
              </View>
              <View style={[styles.calloutCard, { marginTop: 4 }]}>
                <View style={styles.calloutTextContainer}>
                  <Text style={styles.calloutTitle} numberOfLines={1}>
                    {originAddress}
                  </Text>
                  <Text style={styles.calloutSubtitle} numberOfLines={1}>
                    Ponto de partida
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={14} color="#000000" />
              </View>
            </View>
          </View>
        )}

        {/* Botão Voltar */}
        <TouchableOpacity
          style={[styles.floatingBackButton, { top: insets.top + 10 }]}
          onPress={onBack}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={22} color="#000000" />
        </TouchableOpacity>

        {/* Badge Flutuante de Distância e Tempo Calculados pelo Google */}
        {routeData && (
          <View style={[styles.routeStatsBadge, { top: insets.top + 14 }]}>
            <Ionicons name="navigate" size={13} color="#2563EB" />
            <Text style={styles.routeStatsText}>
              {routeData.distanceText} • {routeData.durationText}
            </Text>
          </View>
        )}
      </View>

      {/* 2. FOLHA INFERIOR (ESCOLHA UMA VIAGEM) */}
      <View style={styles.sheetContainer}>
        <View style={styles.sheetHandle} />

        <Text style={styles.sheetTitle}>Escolha uma viagem</Text>

        <ScrollView
          style={styles.ridesScrollView}
          contentContainerStyle={styles.ridesScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {rideOptions.map((ride) => {
            const isSelected = ride.id === selectedRideId;

            return (
              <TouchableOpacity
                key={ride.id}
                style={[
                  styles.rideCard,
                  isSelected ? styles.rideCardSelected : styles.rideCardNormal,
                ]}
                onPress={() => setSelectedRideId(ride.id)}
                activeOpacity={0.8}
              >
                {/* Ícone */}
                <View style={styles.vehicleColumn}>
                  {renderVehicleIcon(ride.iconType)}
                </View>

                {/* Dados da corrida */}
                <View style={styles.rideInfoColumn}>
                  <View style={styles.rideNameRow}>
                    {ride.iconType === 'priority' && (
                      <Ionicons name="flash" size={14} color="#000000" style={{ marginRight: 3 }} />
                    )}
                    <Text style={styles.rideName}>{ride.name}</Text>
                    {ride.capacity && (
                      <View style={styles.capacityRow}>
                        <Ionicons name="person" size={12} color="#000000" />
                        <Text style={styles.capacityText}>{ride.capacity}</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.rideTimeText}>
                    Chegada às {ride.timeArrival} • {ride.durationMinutes} min
                  </Text>

                  {ride.fasterBadge && (
                    <View style={styles.fasterBadge}>
                      <Ionicons name="flash" size={10} color="#FFFFFF" style={{ marginRight: 2 }} />
                      <Text style={styles.fasterBadgeText}>Mais rápido</Text>
                    </View>
                  )}
                </View>

                {/* Preço em Euro */}
                <View style={styles.priceColumn}>
                  <View style={styles.priceRow}>
                    {ride.hasPromo && (
                      <Ionicons name="pricetag" size={12} color="#E11900" style={{ marginRight: 4 }} />
                    )}
                    <Text style={styles.priceText}>{ride.price}</Text>
                  </View>

                  {ride.originalPrice && (
                    <Text style={styles.originalPriceText}>
                      {ride.originalPrice}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 3. BARRA INFERIOR FIXA (DINHEIRO & BOTAO DE CONFIRMACAO) */}
      <View style={[styles.bottomStickyBar, { paddingBottom: Math.max(insets.bottom, 14) }]}>
        <TouchableOpacity
          style={styles.paymentRow}
          onPress={handleSelectPayment}
          activeOpacity={0.7}
        >
          <View style={styles.paymentLeft}>
            <View style={styles.cashIconBox}>
              <MaterialCommunityIcons name="cash" size={20} color="#15803D" />
            </View>
            <Text style={styles.paymentText}>
              {paymentMethod === 'cash'
                ? 'Dinheiro'
                : paymentMethod === 'card'
                ? 'Cartão de Crédito'
                : 'Vago Pay'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#71717A" />
        </TouchableOpacity>

        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
            activeOpacity={0.85}
          >
            <Text style={styles.confirmButtonText}>
              Confirmar {selectedRide.name}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => Alert.alert('Leitor de Código', 'Abrindo leitor de QR Code...')}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons name="qrcode-scan" size={22} color="#000000" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mapContainer: {
    flex: 1.15,
    backgroundColor: '#E5E7EB',
    position: 'relative',
    overflow: 'hidden',
  },
  floatingBackButton: {
    position: 'absolute',
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 10,
  },
  routeStatsBadge: {
    position: 'absolute',
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 10,
  },
  routeStatsText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111111',
  },
  markerAnchor: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  calloutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
    maxWidth: 210,
    marginBottom: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
  },
  calloutTextContainer: {
    flex: 1,
    marginRight: 6,
  },
  calloutTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000000',
  },
  calloutSubtitle: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 1,
  },
  originMarkerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    gap: 4,
  },
  timePillNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  timePillUnit: {
    fontSize: 9,
    fontWeight: '700',
    color: '#D1D5DB',
  },
  originDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#000000',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  destinationSquare: {
    width: 14,
    height: 14,
    backgroundColor: '#000000',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },
  mapCarMarker: {
    backgroundColor: '#FFFFFF',
    padding: 3,
    borderRadius: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  fallbackMap: {
    flex: 1,
    backgroundColor: '#E8ECF2',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridLineH1: {
    position: 'absolute',
    top: '30%',
    width: '100%',
    height: 4,
    backgroundColor: '#D1D5DB',
  },
  gridLineH2: {
    position: 'absolute',
    top: '65%',
    width: '100%',
    height: 6,
    backgroundColor: '#D1D5DB',
  },
  gridLineV1: {
    position: 'absolute',
    left: '25%',
    height: '100%',
    width: 4,
    backgroundColor: '#D1D5DB',
  },
  gridLineV2: {
    position: 'absolute',
    left: '70%',
    height: '100%',
    width: 6,
    backgroundColor: '#D1D5DB',
  },
  fallbackRouteLine: {
    position: 'absolute',
    width: '68%',
    height: 80,
    borderTopWidth: 5,
    borderRightWidth: 5,
    borderColor: '#1F2937',
    borderTopRightRadius: 50,
    top: '25%',
    left: '18%',
  },
  fallbackDestMarker: {
    position: 'absolute',
    top: '18%',
    right: '12%',
    alignItems: 'center',
  },
  fallbackOriginMarker: {
    position: 'absolute',
    bottom: '15%',
    left: '14%',
    alignItems: 'flex-start',
  },
  sheetContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    marginTop: -20,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  sheetHandle: {
    width: 44,
    height: 4.5,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginBottom: 8,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#000000',
    textAlign: 'center',
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  ridesScrollView: {
    flex: 1,
  },
  ridesScrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 10,
  },
  rideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  rideCardNormal: {
    backgroundColor: '#FFFFFF',
  },
  rideCardSelected: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
  },
  vehicleColumn: {
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  vehicleIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  courierGraphicRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  miniParcelBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 4,
    padding: 2,
    marginLeft: -6,
    marginBottom: -2,
    borderWidth: 1,
    borderColor: '#D97706',
  },
  clockOverlay: {
    position: 'absolute',
    top: -2,
    left: 2,
  },
  rideInfoColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  rideNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rideName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.2,
  },
  capacityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginLeft: 4,
  },
  capacityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  rideTimeText: {
    fontSize: 13,
    color: '#71717A',
    marginTop: 2,
  },
  fasterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  fasterBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  priceColumn: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.2,
  },
  originalPriceText: {
    fontSize: 12,
    color: '#71717A',
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  bottomStickyBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    marginBottom: 8,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cashIconBox: {
    width: 28,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#DCFCE7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#000000',
    height: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  scanButton: {
    width: 52,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});

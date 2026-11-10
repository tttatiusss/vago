import React from 'react';
import { View, StyleSheet, Platform, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDriver } from '../../context/DriverContext';

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
    // Graceful fallback if native library not linked yet
  }
}

export const DriverMap: React.FC = () => {
  const { status, currentLocation, activeRide } = useDriver();

  const isNativeMapAvailable = Platform.OS !== 'web' && MapView && Marker;

  const driverCoords = currentLocation || {
    latitude: -23.561684,
    longitude: -46.655981,
  };

  const pickupCoords = activeRide?.pickupLocation.coords;
  const destinationCoords = activeRide?.destinationLocation.coords;

  if (!isNativeMapAvailable) {
    return (
      <View style={styles.webFallbackContainer}>
        {/* Stylized Simulated Map Grid */}
        <View style={styles.gridOverlay}>
          <View style={styles.gridRoadHorizontal} />
          <View style={styles.gridRoadVertical} />
          <View style={[styles.gridRoadHorizontal, { top: '70%' }]} />
          <View style={[styles.gridRoadVertical, { left: '75%' }]} />
        </View>

        {/* Route Line Simulation */}
        {(status === 'EN_ROUTE_PICKUP' || status === 'IN_TRIP') && (
          <View style={styles.routeSimulationLine} />
        )}

        {/* Pickup Pin */}
        {activeRide && status === 'EN_ROUTE_PICKUP' && (
          <View style={[styles.markerPin, styles.pickupPin]}>
            <Ionicons name="person" size={16} color="#FFFFFF" />
            <View style={styles.pinLabel}>
              <Text style={styles.pinLabelText}>Mariana (1.1 km)</Text>
            </View>
          </View>
        )}

        {/* Destination Pin */}
        {activeRide && status === 'IN_TRIP' && (
          <View style={[styles.markerPin, styles.destinationPin]}>
            <Ionicons name="flag" size={16} color="#FFFFFF" />
            <View style={styles.pinLabel}>
              <Text style={styles.pinLabelText}>Faria Lima</Text>
            </View>
          </View>
        )}

        {/* Driver Car Icon */}
        <View style={[styles.driverCarContainer, status === 'OFFLINE' && styles.driverCarOffline]}>
          <View style={styles.driverCarPulse} />
          <View style={styles.driverCarBubble}>
            <Ionicons name="car" size={24} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.mapBadge}>
          <Ionicons name="navigate-circle" size={14} color="#000000" />
          <Text style={styles.mapBadgeText}>GPS Vago Satélite Ativo</Text>
        </View>
      </View>
    );
  }

  return (
    <MapView
      style={StyleSheet.absoluteFill}
      initialRegion={{
        latitude: driverCoords.latitude,
        longitude: driverCoords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }}
      showsUserLocation={false}
      showsCompass={false}
      showsTraffic={true}
    >
      {/* Driver Marker */}
      <Marker coordinate={driverCoords} title="Você (Motorista)">
        <View style={styles.driverMarkerNative}>
          <Ionicons name="car-sport" size={20} color="#FFFFFF" />
        </View>
      </Marker>

      {/* Pickup Marker */}
      {pickupCoords && (status === 'EN_ROUTE_PICKUP' || status === 'ARRIVED_AT_PICKUP') && (
        <Marker coordinate={pickupCoords} title="Passageiro">
          <View style={[styles.markerPin, styles.pickupPin]}>
            <Ionicons name="person" size={14} color="#FFFFFF" />
          </View>
        </Marker>
      )}

      {/* Destination Marker */}
      {destinationCoords && status === 'IN_TRIP' && (
        <Marker coordinate={destinationCoords} title="Destino">
          <View style={[styles.markerPin, styles.destinationPin]}>
            <Ionicons name="flag" size={14} color="#FFFFFF" />
          </View>
        </Marker>
      )}

      {/* Route Line */}
      {pickupCoords && status === 'EN_ROUTE_PICKUP' && (
        <Polyline
          coordinates={[driverCoords, pickupCoords]}
          strokeColor="#000000"
          strokeWidth={4}
        />
      )}

      {destinationCoords && status === 'IN_TRIP' && (
        <Polyline
          coordinates={[driverCoords, destinationCoords]}
          strokeColor="#000000"
          strokeWidth={4}
        />
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  webFallbackContainer: {
    flex: 1,
    backgroundColor: '#EBF1F5',
    position: 'relative',
    overflow: 'hidden',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFill,
  },
  gridRoadHorizontal: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    height: 32,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#DFE5EA',
  },
  gridRoadVertical: {
    position: 'absolute',
    left: '45%',
    top: 0,
    bottom: 0,
    width: 36,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: '#DFE5EA',
  },
  routeSimulationLine: {
    position: 'absolute',
    top: '35%',
    left: '42%',
    width: 140,
    height: 6,
    backgroundColor: '#000000',
    transform: [{ rotate: '42deg' }],
    borderRadius: 3,
  },
  driverCarContainer: {
    position: 'absolute',
    top: '42%',
    left: '43%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  driverCarPulse: {
    position: 'absolute',
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  driverCarBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  driverCarOffline: {
    opacity: 0.6,
  },
  driverMarkerNative: {
    backgroundColor: '#000000',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  markerPin: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  pickupPin: {
    top: '25%',
    left: '65%',
    backgroundColor: '#0E8345',
  },
  destinationPin: {
    top: '55%',
    left: '70%',
    backgroundColor: '#E11900',
  },
  pinLabel: {
    position: 'absolute',
    bottom: -22,
    backgroundColor: '#000000',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    minWidth: 80,
    alignItems: 'center',
  },
  pinLabelText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  mapBadge: {
    position: 'absolute',
    top: 14,
    left: 16,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  mapBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1C1C1E',
  },
});

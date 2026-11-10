import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import * as Location from 'expo-location';
import {
  DriverStatus,
  LocationCoords,
  RideRequest,
  DriverProfile,
} from '../types/driver';

interface DriverContextType {
  status: DriverStatus;
  currentLocation: LocationCoords | null;
  activeRide: RideRequest | null;
  profile: DriverProfile;
  remainingOfferSeconds: number;
  waitingPassengerSeconds: number;
  goOnline: () => Promise<void>;
  goOffline: () => void;
  acceptRide: () => void;
  rejectRide: () => void;
  arriveAtPickup: () => void;
  startTrip: () => void;
  completeTrip: (rating: number) => void;
  cancelRide: (reason: string) => void;
  simulateIncomingRide: () => void;
}

const DEFAULT_COORDS: LocationCoords = {
  latitude: -23.561684, // São Paulo - Av. Paulista area as default
  longitude: -46.655981,
};

const initialProfile: DriverProfile = {
  name: 'Carlos Silva',
  rating: 4.96,
  acceptanceRate: 98,
  completionRate: 99,
  todayEarnings: 154.5,
  todayTrips: 7,
  todayHoursOnline: 3.5,
  vehicleModel: 'Toyota Corolla 2023',
  licensePlate: 'BRA-2E19',
};

const MOCK_RIDE: RideRequest = {
  id: 'ride_101',
  passenger: {
    id: 'pass_42',
    name: 'Mariana Ramos',
    rating: 4.98,
    phone: '(11) 98765-4321',
  },
  pickupLocation: {
    address: 'Rua Augusta, 1492',
    neighborhood: 'Consolação',
    coords: {
      latitude: -23.5574,
      longitude: -46.6612,
    },
  },
  destinationLocation: {
    address: 'Av. Brigadeiro Faria Lima, 3477',
    neighborhood: 'Itaim Bibi',
    coords: {
      latitude: -23.5866,
      longitude: -46.6826,
    },
  },
  price: 28.5,
  distanceKm: 6.4,
  durationMinutes: 16,
  pickupDistanceKm: 1.1,
  pickupMinutes: 3,
  expiresInSeconds: 15,
  category: 'VagoX',
};

const DriverContext = createContext<DriverContextType | undefined>(undefined);

export const DriverProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<DriverStatus>('OFFLINE');
  const [currentLocation, setCurrentLocation] = useState<LocationCoords | null>(DEFAULT_COORDS);
  const [activeRide, setActiveRide] = useState<RideRequest | null>(null);
  const [profile, setProfile] = useState<DriverProfile>(initialProfile);
  const [remainingOfferSeconds, setRemainingOfferSeconds] = useState(15);
  const [waitingPassengerSeconds, setWaitingPassengerSeconds] = useState(0);

  const offerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const waitingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Request location on mount
  useEffect(() => {
    (async () => {
      try {
        const { status: permStatus } = await Location.requestForegroundPermissionsAsync();
        if (permStatus === 'granted') {
          const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          setCurrentLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
          });
        }
      } catch {
        // Fallback to default coords if running in restricted simulator/web
        setCurrentLocation(DEFAULT_COORDS);
      }
    })();
  }, []);

  // Handle countdown when ride is offered
  useEffect(() => {
    if (status === 'RIDE_OFFERED') {
      setRemainingOfferSeconds(15);
      offerTimerRef.current = setInterval(() => {
        setRemainingOfferSeconds((prev) => {
          if (prev <= 1) {
            rejectRide();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (offerTimerRef.current) clearInterval(offerTimerRef.current);
    }

    return () => {
      if (offerTimerRef.current) clearInterval(offerTimerRef.current);
    };
  }, [status]);

  // Handle waiting timer at pickup
  useEffect(() => {
    if (status === 'ARRIVED_AT_PICKUP') {
      setWaitingPassengerSeconds(0);
      waitingTimerRef.current = setInterval(() => {
        setWaitingPassengerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (waitingTimerRef.current) clearInterval(waitingTimerRef.current);
    }

    return () => {
      if (waitingTimerRef.current) clearInterval(waitingTimerRef.current);
    };
  }, [status]);

  const simulateIncomingRide = () => {
    setActiveRide(MOCK_RIDE);
    setStatus('RIDE_OFFERED');
  };

  const goOnline = async () => {
    setStatus('ONLINE_SEARCHING');
    // Automatically trigger a simulated ride request after 5 seconds to provide immediate interactivity
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      simulateIncomingRide();
    }, 5000);
  };

  const goOffline = () => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    if (offerTimerRef.current) clearInterval(offerTimerRef.current);
    setActiveRide(null);
    setStatus('OFFLINE');
  };

  const acceptRide = () => {
    if (offerTimerRef.current) clearInterval(offerTimerRef.current);
    setStatus('EN_ROUTE_PICKUP');
  };

  const rejectRide = () => {
    if (offerTimerRef.current) clearInterval(offerTimerRef.current);
    setActiveRide(null);
    setStatus('ONLINE_SEARCHING');
    // Schedule next potential ride after 8 seconds
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      simulateIncomingRide();
    }, 8000);
  };

  const arriveAtPickup = () => {
    setStatus('ARRIVED_AT_PICKUP');
  };

  const startTrip = () => {
    if (waitingTimerRef.current) clearInterval(waitingTimerRef.current);
    setStatus('IN_TRIP');
  };

  const completeTrip = (rating: number) => {
    if (activeRide) {
      setProfile((prev) => ({
        ...prev,
        todayEarnings: prev.todayEarnings + activeRide.price,
        todayTrips: prev.todayTrips + 1,
      }));
    }
    setStatus('TRIP_COMPLETED');
  };

  const cancelRide = (reason: string) => {
    if (offerTimerRef.current) clearInterval(offerTimerRef.current);
    if (waitingTimerRef.current) clearInterval(waitingTimerRef.current);
    setActiveRide(null);
    setStatus('ONLINE_SEARCHING');
  };

  return (
    <DriverContext.Provider
      value={{
        status,
        currentLocation,
        activeRide,
        profile,
        remainingOfferSeconds,
        waitingPassengerSeconds,
        goOnline,
        goOffline,
        acceptRide,
        rejectRide,
        arriveAtPickup,
        startTrip,
        completeTrip,
        cancelRide,
        simulateIncomingRide,
      }}
    >
      {children}
    </DriverContext.Provider>
  );
};

export const useDriver = (): DriverContextType => {
  const context = useContext(DriverContext);
  if (!context) {
    throw new Error('useDriver deve ser usado dentro de um DriverProvider');
  }
  return context;
};

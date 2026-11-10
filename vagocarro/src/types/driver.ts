export type DriverStatus =
  | 'OFFLINE'
  | 'ONLINE_SEARCHING'
  | 'RIDE_OFFERED'
  | 'EN_ROUTE_PICKUP'
  | 'ARRIVED_AT_PICKUP'
  | 'IN_TRIP'
  | 'TRIP_COMPLETED';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface PassengerInfo {
  id: string;
  name: string;
  rating: number;
  avatarUrl?: string;
  phone?: string;
}

export interface RideRequest {
  id: string;
  passenger: PassengerInfo;
  pickupLocation: {
    address: string;
    neighborhood: string;
    coords: LocationCoords;
  };
  destinationLocation: {
    address: string;
    neighborhood: string;
    coords: LocationCoords;
  };
  price: number; // in BRL
  distanceKm: number;
  durationMinutes: number;
  pickupDistanceKm: number;
  pickupMinutes: number;
  expiresInSeconds: number;
  category: 'VagoX' | 'VagoComfort' | 'VagoBlack';
}

export interface DriverProfile {
  name: string;
  rating: number;
  acceptanceRate: number; // e.g. 96%
  completionRate: number; // e.g. 98%
  todayEarnings: number; // in BRL
  todayTrips: number;
  todayHoursOnline: number;
  vehicleModel: string;
  licensePlate: string;
}

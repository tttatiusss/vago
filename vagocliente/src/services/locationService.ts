import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserLocationResult {
  coords: {
    latitude: number;
    longitude: number;
  };
  address: string;
  timestamp?: number;
}

const CACHE_STORAGE_KEY = '@vago_cached_user_location';

const DEFAULT_COORDS = {
  latitude: -23.561684,
  longitude: -46.655981,
};

// Cache em memória para acesso síncrono e instantâneo
let inMemoryLocationCache: UserLocationResult | null = null;

/**
 * Formata o endereço exatamente no padrão limpo do Uber:
 * Apenas o número e o nome da rua (ex: "90 Alh. Onilewura St" ou "Av. Paulista, 1000"),
 * sem bairros, cidades ou códigos postais adicionais.
 */
export function formatUberStyleAddress(
  street: string | null | undefined,
  streetNumber: string | null | undefined,
  name?: string | null | undefined
): string {
  const cleanStreet = (street || '').trim();
  const cleanNumber = (streetNumber || '').trim();
  const cleanName = (name || '').trim();

  // Caso o nome já venha formatado com número e rua (ex: "90 Alh. Onilewura St")
  if (cleanName && /\d/.test(cleanName) && cleanName.length >= 3) {
    // Se cleanName for apenas o número da casa (ex: "90") e temos o nome da rua
    if (/^\d+[a-zA-Z]?$/.test(cleanName) && cleanStreet) {
      return formatNumberAndStreet(cleanName, cleanStreet);
    }
    return cleanName;
  }

  if (cleanStreet && cleanNumber) {
    return formatNumberAndStreet(cleanNumber, cleanStreet);
  }

  if (cleanStreet) {
    return cleanStreet;
  }

  if (cleanName) {
    return cleanName;
  }

  return 'Sua localização atual';
}

function formatNumberAndStreet(number: string, street: string): string {
  // Se a rua começa com prefixos em português ("Rua", "Av.", "Avenida", "Alameda", etc.)
  const ptPrefix = /^(rua|r\.|av\.|avenida|alameda|al\.|travessa|tv\.|rodovia|rod\.|praça|praca)\b/i;
  if (ptPrefix.test(street)) {
    return `${street}, ${number}`;
  }

  // Padrão internacional (ex: "90 Alh. Onilewura St")
  return `${number} ${street}`;
}

/**
 * Consulta a Google Geocoding API para obter o número e rua com precisão máxima do Uber.
 */
async function reverseGeocodeWithGoogle(coords: {
  latitude: number;
  longitude: number;
}): Promise<string | null> {
  const apiKey =
    process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ||
    process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

  if (!apiKey) return null;

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.latitude},${coords.longitude}&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.status === 'OK' && Array.isArray(data.results) && data.results.length > 0) {
      // 1. Prioriza o resultado mais detalhado de endereço (street_address ou premise)
      const best =
        data.results.find(
          (r: any) =>
            r.types.includes('street_address') ||
            r.types.includes('premise') ||
            r.types.includes('subpremise')
        ) || data.results[0];

      let streetNumber = '';
      let route = '';

      if (Array.isArray(best.address_components)) {
        for (const comp of best.address_components) {
          if (comp.types.includes('street_number')) {
            streetNumber = comp.long_name;
          }
          if (comp.types.includes('route')) {
            route = comp.long_name;
          }
        }
      }

      if (route) {
        return formatUberStyleAddress(route, streetNumber);
      }

      // Se não encontrou componentes separados, pega o primeiro segmento do endereço formatado
      if (best.formatted_address) {
        const firstPart = best.formatted_address.split(',')[0].trim();
        if (firstPart) {
          return firstPart;
        }
      }
    }
  } catch (err) {
    console.warn('[LocationService] Google Geocoding falhou:', err);
  }

  return null;
}

/**
 * Calcula a distância em metros entre dois pontos geográficos (Haversine).
 */
function calculateDistanceMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Recupera a localização em cache (memória primeiro, depois AsyncStorage).
 */
export async function getCachedUserLocation(): Promise<UserLocationResult | null> {
  if (inMemoryLocationCache) {
    return inMemoryLocationCache;
  }

  try {
    const raw = await AsyncStorage.getItem(CACHE_STORAGE_KEY);
    if (raw) {
      const parsed: UserLocationResult = JSON.parse(raw);
      inMemoryLocationCache = parsed;
      return parsed;
    }
  } catch (err) {
    console.warn('[LocationService] Erro ao ler cache local:', err);
  }

  return null;
}

/**
 * Salva a localização no cache de memória e no armazenamento persistente.
 */
export async function saveCachedUserLocation(
  location: UserLocationResult
): Promise<void> {
  inMemoryLocationCache = location;
  try {
    await AsyncStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(location));
  } catch (err) {
    console.warn('[LocationService] Erro ao salvar cache local:', err);
  }
}

/**
 * Busca a posição fresca no GPS e formata rua e número como no app do Uber.
 */
export async function fetchFreshLocation(
  previousLocation?: UserLocationResult | null
): Promise<UserLocationResult> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      return (
        previousLocation || {
          coords: DEFAULT_COORDS,
          address: 'Localização atual (Permissão necessária)',
          timestamp: Date.now(),
        }
      );
    }

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const coords = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    };

    // Se já temos cache e o usuário moveu menos de 50 metros, mantemos o endereço
    if (
      previousLocation &&
      previousLocation.address &&
      previousLocation.address !== 'Sua localização atual'
    ) {
      const distance = calculateDistanceMeters(
        previousLocation.coords.latitude,
        previousLocation.coords.longitude,
        coords.latitude,
        coords.longitude
      );

      if (distance < 50) {
        const updated: UserLocationResult = {
          coords,
          address: previousLocation.address,
          timestamp: Date.now(),
        };
        await saveCachedUserLocation(updated);
        return updated;
      }
    }

    // 1. Tenta obter rua e número via Google Geocoding API
    let formattedAddress = await reverseGeocodeWithGoogle(coords);

    // 2. Fallback para expo-location reverse geocoding
    if (!formattedAddress || formattedAddress === 'Sua localização atual') {
      try {
        const reverse = await Location.reverseGeocodeAsync(coords);
        if (reverse && reverse.length > 0) {
          const item = reverse[0];
          formattedAddress = formatUberStyleAddress(
            item.street,
            item.streetNumber,
            item.name
          );
        }
      } catch (geocodeErr) {
        console.warn('[LocationService] Expo reverseGeocode falhou:', geocodeErr);
      }
    }

    if (!formattedAddress) {
      formattedAddress = previousLocation?.address || 'Sua localização atual';
    }

    const freshResult: UserLocationResult = {
      coords,
      address: formattedAddress,
      timestamp: Date.now(),
    };

    await saveCachedUserLocation(freshResult);
    return freshResult;
  } catch (err) {
    console.warn('[LocationService] Falha ao obter posição do GPS:', err);
    return (
      previousLocation || {
        coords: DEFAULT_COORDS,
        address: 'Sua localização atual',
        timestamp: Date.now(),
      }
    );
  }
}

/**
 * Padrão Stale-While-Revalidate:
 * 1. Retorna imediatamente a localização em cache (se existir).
 * 2. Em segundo plano, busca a localização atualizada com rua e número.
 * 3. Se a localização mudar, dispara o callback `onLocationUpdated`.
 */
export async function getUserLocationWithBackgroundRefresh(
  onLocationUpdated?: (loc: UserLocationResult) => void
): Promise<UserLocationResult> {
  const cached = await getCachedUserLocation();

  // Executa revalidação em segundo plano sem bloquear a interface
  (async () => {
    try {
      const fresh = await fetchFreshLocation(cached);

      if (
        !cached ||
        cached.address !== fresh.address ||
        calculateDistanceMeters(
          cached.coords.latitude,
          cached.coords.longitude,
          fresh.coords.latitude,
          fresh.coords.longitude
        ) > 50
      ) {
        onLocationUpdated?.(fresh);
      }
    } catch (bgErr) {
      console.warn('[LocationService] Erro na revalidação em segundo plano:', bgErr);
    }
  })();

  if (cached) {
    return cached;
  }

  return await fetchFreshLocation();
}

/**
 * Observa alterações de localização em tempo real (em segundo plano).
 */
export async function watchUserLocation(
  onLocationChanged: (loc: UserLocationResult) => void
): Promise<() => void> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return () => {};
    }

    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000,
        distanceInterval: 50,
      },
      async (loc) => {
        const coords = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };

        const cached = inMemoryLocationCache;
        if (cached) {
          const distance = calculateDistanceMeters(
            cached.coords.latitude,
            cached.coords.longitude,
            coords.latitude,
            coords.longitude
          );
          if (distance < 50) {
            return;
          }
        }

        const fresh = await fetchFreshLocation(cached);
        onLocationChanged(fresh);
      }
    );

    return () => {
      subscription.remove();
    };
  } catch (err) {
    console.warn('[LocationService] Falha ao iniciar observador de localização:', err);
    return () => {};
  }
}

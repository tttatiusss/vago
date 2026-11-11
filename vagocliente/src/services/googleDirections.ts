export interface Coords {
  latitude: number;
  longitude: number;
}

export interface RouteResult {
  coordinates: Coords[];
  distanceText: string;
  durationText: string;
  durationMinutes: number;
  durationSeconds: number;
  distanceKm: number;
  distanceMeters: number;
}

/**
 * Decodifica a string de polyline codificada retornada pela Google Directions API.
 */
export function decodePolyline(encoded: string): Coords[] {
  const points: Coords[] = [];
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;

  while (index < len) {
    let b: number;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push({
      latitude: lat / 1e5,
      longitude: lng / 1e5,
    });
  }

  return points;
}

/**
 * Calcula a distância em linha reta (em metros) entre dois pontos.
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
 * Gera uma rota simulada com curvas caso a API do Google não esteja acessível.
 */
function generateFallbackCurveRoute(origin: Coords, dest: Coords): Coords[] {
  const points: Coords[] = [];
  const steps = 24;

  const latDiff = dest.latitude - origin.latitude;
  const lngDiff = dest.longitude - origin.longitude;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const curveOffset = Math.sin(t * Math.PI) * 0.015;

    points.push({
      latitude: origin.latitude + latDiff * t + curveOffset,
      longitude: origin.longitude + lngDiff * t - curveOffset * 0.5,
    });
  }

  return points;
}

/**
 * Consulta a Google Directions API com informações precisas de distância e tráfego.
 */
export async function fetchGoogleRoute(
  origin: Coords,
  destination: Coords
): Promise<RouteResult> {
  const apiKey =
    process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ||
    process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

  if (apiKey) {
    try {
      // language=pt para garantir retornos em português ("12 min", "8,4 km")
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${apiKey}&mode=driving&language=pt&departure_time=now`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && Array.isArray(data.routes) && data.routes.length > 0) {
        const route = data.routes[0];
        const leg = route.legs?.[0];

        const coordinates = decodePolyline(route.overview_polyline.points);

        // Considera duração com tráfego se a Google API fornecer
        const durationSeconds =
          leg?.duration_in_traffic?.value || leg?.duration?.value || 540;
        const durationMinutes = Math.max(1, Math.round(durationSeconds / 60));

        const distanceMeters = leg?.distance?.value || 8500;
        const distanceKm = Math.round((distanceMeters / 1000) * 10) / 10;

        const distanceText = leg?.distance?.text || `${distanceKm.toString().replace('.', ',')} km`;
        const durationText = leg?.duration_in_traffic?.text || leg?.duration?.text || `${durationMinutes} min`;

        return {
          coordinates,
          distanceText,
          durationText,
          durationMinutes,
          durationSeconds,
          distanceKm,
          distanceMeters,
        };
      }

      console.warn(
        `[GoogleDirections] API retornou status: ${data.status}. Mensagem: ${data.error_message || 'N/A'}`
      );
    } catch (err) {
      console.warn('[GoogleDirections] Erro ao buscar rota do Google:', err);
    }
  }

  // Fallback baseado no cálculo real de distância entre coordenadas
  const coordinates = generateFallbackCurveRoute(origin, destination);
  const directMeters = calculateDistanceMeters(
    origin.latitude,
    origin.longitude,
    destination.latitude,
    destination.longitude
  );

  // Fator de rota urbana (~1.3x da linha reta)
  const estimatedMeters = Math.max(1000, Math.round(directMeters * 1.3));
  const distanceKm = Math.round((estimatedMeters / 1000) * 10) / 10;

  // Velocidade média urbana de 30 km/h = 2 min/km
  const durationMinutes = Math.max(2, Math.round(distanceKm * 2.2));
  const durationSeconds = durationMinutes * 60;

  return {
    coordinates,
    distanceText: `${distanceKm.toString().replace('.', ',')} km`,
    durationText: `${durationMinutes} min`,
    durationMinutes,
    durationSeconds,
    distanceKm,
    distanceMeters: estimatedMeters,
  };
}

export interface Coords {
  latitude: number;
  longitude: number;
}

export interface RouteResult {
  coordinates: Coords[];
  distanceText: string;
  durationText: string;
  durationMinutes: number;
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
 * Gera uma rota simulada suave com curvas entre a origem e o destino
 * caso a API do Google não esteja disponível ou em modo offline.
 */
function generateFallbackCurveRoute(origin: Coords, dest: Coords): Coords[] {
  const points: Coords[] = [];
  const steps = 24;

  const latDiff = dest.latitude - origin.latitude;
  const lngDiff = dest.longitude - origin.longitude;

  // Cria um desvio para simular traçado de ruas reais (como na imagem)
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Curva quadrática com desvio perpendicular
    const curveOffset = Math.sin(t * Math.PI) * 0.015;

    points.push({
      latitude: origin.latitude + latDiff * t + curveOffset,
      longitude: origin.longitude + lngDiff * t - curveOffset * 0.5,
    });
  }

  return points;
}

/**
 * Consulta a Google Directions API para traçar a rota real entre origem e destino.
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
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${apiKey}&mode=driving`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && Array.isArray(data.routes) && data.routes.length > 0) {
        const route = data.routes[0];
        const leg = route.legs?.[0];

        const coordinates = decodePolyline(route.overview_polyline.points);
        const distanceText = leg?.distance?.text || '14 km';
        const durationText = leg?.duration?.text || '9 min';
        const durationMinutes = leg?.duration?.value
          ? Math.round(leg.duration.value / 60)
          : 9;

        return {
          coordinates,
          distanceText,
          durationText,
          durationMinutes,
        };
      }

      console.warn(
        `[GoogleDirections] API retornou status: ${data.status}. Mensagem: ${data.error_message || 'N/A'}`
      );
    } catch (err) {
      console.warn('[GoogleDirections] Erro ao buscar rota do Google:', err);
    }
  }

  // Fallback inteligente caso a rota falhe ou chave não responda
  const coordinates = generateFallbackCurveRoute(origin, destination);
  return {
    coordinates,
    distanceText: '14 km',
    durationText: '9 min',
    durationMinutes: 9,
  };
}

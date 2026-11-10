export interface PlacePrediction {
  placeId: string;
  mainText: string;
  secondaryText: string;
  fullAddress: string;
}

// Exemplos de destinos inteligentes caso a chave do Google não tenha sido configurada ainda
const FALLBACK_POPULAR_PLACES: PlacePrediction[] = [
  {
    placeId: 'fallback_1',
    mainText: 'Aeroporto Internacional de Guarulhos (GRU)',
    secondaryText: 'Rod. Hélio Smidt, s/n - Cumbica, Guarulhos - SP',
    fullAddress: 'Aeroporto Internacional de Guarulhos, Rod. Hélio Smidt, s/n - Cumbica, Guarulhos - SP',
  },
  {
    placeId: 'fallback_2',
    mainText: 'Aeroporto de Congonhas (CGH)',
    secondaryText: 'Av. Washington Luís, s/n - Vila Congonhas, São Paulo - SP',
    fullAddress: 'Aeroporto de Congonhas, Av. Washington Luís, s/n - Vila Congonhas, São Paulo - SP',
  },
  {
    placeId: 'fallback_3',
    mainText: 'Avenida Paulista',
    secondaryText: 'Bela Vista, São Paulo - SP',
    fullAddress: 'Av. Paulista, Bela Vista, São Paulo - SP',
  },
  {
    placeId: 'fallback_4',
    mainText: 'Shopping Morumbi',
    secondaryText: 'Av. Roque Petroni Júnior, 1089 - Jardim das Acácias, São Paulo - SP',
    fullAddress: 'MorumbiShopping, Av. Roque Petroni Júnior, 1089, São Paulo - SP',
  },
  {
    placeId: 'fallback_5',
    mainText: 'Parque Ibirapuera',
    secondaryText: 'Av. Pedro Álvares Cabral - Vila Mariana, São Paulo - SP',
    fullAddress: 'Parque Ibirapuera, Av. Pedro Álvares Cabral, São Paulo - SP',
  },
  {
    placeId: 'fallback_6',
    mainText: 'Estação da Luz',
    secondaryText: 'Praça da Luz, 1 - Luz, São Paulo - SP',
    fullAddress: 'Estação da Luz, Praça da Luz, 1, São Paulo - SP',
  },
  {
    placeId: 'fallback_7',
    mainText: 'Allianz Parque',
    secondaryText: 'Av. Francisco Matarazzo, 1705 - Água Branca, São Paulo - SP',
    fullAddress: 'Allianz Parque, Av. Francisco Matarazzo, 1705, São Paulo - SP',
  },
];

/**
 * Busca sugestões de lugares usando a API Google Places Autocomplete.
 * Se nenhuma chave foi fornecida em EXPO_PUBLIC_GOOGLE_PLACES_API_KEY,
 * retorna sugestões dinâmicas locais para testes imediatos sem travar o app.
 */
export async function searchPlaces(
  query: string,
  userCoords?: { latitude: number; longitude: number } | null
): Promise<PlacePrediction[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  const apiKey =
    process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY ||
    process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (apiKey) {
    try {
      let url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        trimmed
      )}&key=${apiKey}&language=pt-BR`;

      // Se temos coordenadas do usuário, ponderamos a busca na região
      if (userCoords) {
        url += `&location=${userCoords.latitude},${userCoords.longitude}&radius=50000`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && Array.isArray(data.predictions)) {
        return data.predictions.map((p: any) => ({
          placeId: p.place_id,
          mainText: p.structured_formatting?.main_text || p.description,
          secondaryText: p.structured_formatting?.secondary_text || '',
          fullAddress: p.description,
        }));
      }

      if (data.status === 'ZERO_RESULTS') {
        return [];
      }

      console.warn(
        `[GooglePlaces] API retornou status: ${data.status}. Mensagem: ${data.error_message || 'N/A'}`
      );
    } catch (err) {
      console.warn('[GooglePlaces] Erro de rede ao consultar Google Places API:', err);
    }
  }

  // Fallback para ambiente de desenvolvimento quando chave não está configurada ou em erro de rede
  const searchLower = trimmed.toLowerCase();
  const matched = FALLBACK_POPULAR_PLACES.filter(
    (place) =>
      place.mainText.toLowerCase().includes(searchLower) ||
      place.secondaryText.toLowerCase().includes(searchLower)
  );

  if (matched.length > 0) {
    return matched;
  }

  // Caso não combine com nenhum pré-cadastrado, cria um resultado com o termo pesquisado
  return [
    {
      placeId: `custom_${Date.now()}`,
      mainText: trimmed,
      secondaryText: 'Destino no mapa',
      fullAddress: `${trimmed}, Local aproximado`,
    },
  ];
}

/**
 * Obtém as coordenadas geográficas (latitude, longitude) de um local usando a API do Google.
 */
export async function getPlaceCoordinates(
  placeId: string,
  fullAddress?: string,
  fallbackBaseCoords?: { latitude: number; longitude: number }
): Promise<{ latitude: number; longitude: number }> {
  const apiKey =
    process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY ||
    process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (apiKey) {
    try {
      if (!placeId.startsWith('custom_') && !placeId.startsWith('fallback_')) {
        const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry&key=${apiKey}`;
        const res = await fetch(detailsUrl);
        const data = await res.json();
        if (data.status === 'OK' && data.result?.geometry?.location) {
          return {
            latitude: data.result.geometry.location.lat,
            longitude: data.result.geometry.location.lng,
          };
        }
      }

      if (fullAddress) {
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          fullAddress
        )}&key=${apiKey}`;
        const gRes = await fetch(geocodeUrl);
        const gData = await gRes.json();
        if (gData.status === 'OK' && gData.results?.[0]?.geometry?.location) {
          return {
            latitude: gData.results[0].geometry.location.lat,
            longitude: gData.results[0].geometry.location.lng,
          };
        }
      }
    } catch (err) {
      console.warn('[GooglePlaces] Erro ao buscar coordenadas do local:', err);
    }
  }

  const base = fallbackBaseCoords || {
    latitude: -23.561684,
    longitude: -46.655981,
  };

  return {
    latitude: base.latitude + 0.045,
    longitude: base.longitude + 0.038,
  };
}

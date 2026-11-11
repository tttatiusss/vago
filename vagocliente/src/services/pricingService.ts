import { RouteResult } from './googleDirections';

export interface CalculatedRideOption {
  id: string;
  name: string;
  capacity?: number;
  timeArrival: string;
  durationMinutes: number;
  price: string;
  numericPrice: number;
  originalPrice?: string;
  hasPromo?: boolean;
  fasterBadge?: boolean;
  iconType: 'priority' | 'car' | 'courier' | 'wait_save';
  description: string;
}

/**
 * Formata um valor numérico para Euro (€ 12,50).
 */
export function formatEuro(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return `€ ${rounded.toFixed(2).replace('.', ',')}`;
}

/**
 * Calcula o horário previsto de chegada com base nos minutos de viagem.
 */
export function calculateArrivalTime(additionalMinutes: number): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() + additionalMinutes);
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Fórmula de Precificação Dinâmica no padrão Uber:
 *
 * Preço = Tarifa Base + (Distância em km * Preço/km) + (Duração em min * Preço/min)
 * Aplicando os multiplicadores por categoria e garantindo a tarifa mínima.
 */
export function calculateRidePrices(route: RouteResult): CalculatedRideOption[] {
  const distanceKm = Math.max(0.5, route.distanceKm);
  const durationMin = Math.max(2, route.durationMinutes);

  // 1. VagoX (Categoria padrão similar ao UberX)
  const vagoXBaseFare = 2.50;
  const vagoXPerKm = 1.15;
  const vagoXPerMin = 0.30;
  const vagoXMinFare = 4.50;

  const vagoXRaw = vagoXBaseFare + distanceKm * vagoXPerKm + durationMin * vagoXPerMin;
  const vagoXPrice = Math.max(vagoXMinFare, vagoXRaw);

  // 2. Prioridade (Similar ao Priority do Uber, motoristas mais próximos, tarifa ~25% superior)
  const priorityBaseFare = 3.50;
  const priorityPerKm = 1.35;
  const priorityPerMin = 0.38;
  const priorityMinFare = 6.00;

  const priorityRaw = priorityBaseFare + distanceKm * priorityPerKm + durationMin * priorityPerMin;
  const priorityPrice = Math.max(priorityMinFare, priorityRaw);

  // 3. Courier (Envio expresso de pacotes por moto, ~35% mais econômico que carro)
  const courierBaseFare = 1.80;
  const courierPerKm = 0.80;
  const courierPerMin = 0.22;
  const courierMinFare = 3.20;

  const courierRaw = courierBaseFare + distanceKm * courierPerKm + durationMin * courierPerMin;
  const courierFinal = Math.max(courierMinFare, courierRaw * 0.80); // com 20% desconto promocional
  const courierOriginal = Math.max(courierMinFare + 1.5, courierRaw);

  // 4. Aguarde e Economize (Wait & Save, ~15% mais barato, tempo de espera +6 min)
  const waitSavePrice = Math.max(3.80, vagoXPrice * 0.85);

  return [
    {
      id: 'priority',
      name: 'Prioridade',
      capacity: 4,
      timeArrival: calculateArrivalTime(Math.max(1, durationMin - 2)),
      durationMinutes: durationMin,
      price: formatEuro(priorityPrice),
      numericPrice: priorityPrice,
      fasterBadge: true,
      iconType: 'priority',
      description: 'Embarque rápido com os motoristas mais bem avaliados',
    },
    {
      id: 'vagox',
      name: 'VagoX',
      capacity: 4,
      timeArrival: calculateArrivalTime(durationMin),
      durationMinutes: durationMin + 2,
      price: formatEuro(vagoXPrice),
      numericPrice: vagoXPrice,
      iconType: 'car',
      description: 'Viagens diárias acessíveis e confortáveis',
    },
    {
      id: 'courier',
      name: 'Correios',
      timeArrival: calculateArrivalTime(Math.max(1, durationMin - 4)),
      durationMinutes: Math.max(1, durationMin - 4),
      price: formatEuro(courierFinal),
      numericPrice: courierFinal,
      originalPrice: formatEuro(courierOriginal),
      hasPromo: true,
      iconType: 'courier',
      description: 'Envio rápido de encomendas e pacotes',
    },
    {
      id: 'wait_save',
      name: 'Econômico',
      timeArrival: calculateArrivalTime(durationMin + 8),
      durationMinutes: durationMin + 8,
      price: formatEuro(waitSavePrice),
      numericPrice: waitSavePrice,
      iconType: 'wait_save',
      description: 'Aguarde alguns minutos a mais por um valor reduzido',
    },
  ];
}

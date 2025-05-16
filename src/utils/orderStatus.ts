// src/utils/orderStatus.ts
import type { OrderStatus } from '../hooks/useOrderSocket';

export const STATUS_LABELS: Record<OrderStatus, string> = {
  requested: 'Esperando aprobación',
  approved: 'Aprobada por admin',
  ready_for_pickup: 'Listo para recoger',
  in_progress: 'En progreso',
  canceled: 'Cancelada',
  completed: 'Completada',
};

// Para un Stepper lineal:
export const STATUS_FLOW: OrderStatus[] = [
  'requested',
  'approved',
  'ready_for_pickup',
  'in_progress',
  'completed',
];

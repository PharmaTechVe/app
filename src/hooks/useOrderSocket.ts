import { useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import * as SecureStore from 'expo-secure-store';
import { SOCKET_URL } from '../lib/socketUrl';

export type OrderStatus =
  | 'requested'
  | 'approved'
  | 'ready_for_pickup'
  | 'in_progress'
  | 'canceled'
  | 'completed';

export interface Order {
  id: string;
  status: OrderStatus;
}

export function useOrderSocket(
  orderId: string | null,
  onOrderUpdated: (order: Order) => void,
): Socket | null {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!orderId) return;
    let isMounted = true;

    const setupSocket = async () => {
      const token = await SecureStore.getItemAsync('auth_token');
      if (!isMounted || !token) return;

      const authHeader = `Bearer ${token}`;

      const sock = io(SOCKET_URL, {
        transportOptions: {
          polling: {
            extraHeaders: { Authorization: authHeader },
          },
        },
      });

      socketRef.current = sock;

      sock.on('connect', () => {
        console.log('[WS] Conectado con ID:', sock.id);
        // Unirse al room de la orden
        sock.emit('joinOrder', orderId);
        // Solicitar el objeto completo de la orden
        sock.emit('getOrder', orderId);
      });

      sock.on('disconnect', (reason) =>
        console.log('[WS] Desconectado:', reason),
      );

      sock.on('connect_error', (err) =>
        console.log('[WS] Error en handshake:', err.message),
      );

      // Depuración de todos los eventos entrantes
      sock.onAny((event, ...args) =>
        console.log('[WS] evento recibido:', event, args),
      );

      // Evento inicial con el objeto completo de la orden
      sock.on('order', (Order: Order) => {
        if (Order.id === orderId) {
          console.log('[WS] Orden inicial recibida:', Order);
          onOrderUpdated(Order);
        }
      });

      // Evento ligero para actualizaciones de status
      sock.on(
        'orderUpdated',
        (orderUpdated: { orderId: string; status: OrderStatus }) => {
          if (orderUpdated.orderId === orderId) {
            console.log('[WS] Status actualizado:', orderUpdated.status);
            onOrderUpdated({
              id: orderUpdated.orderId,
              status: orderUpdated.status,
            });
          }
        },
      );

      // Iniciar la conexión una vez registrados todos los listeners
      sock.connect();
    };

    setupSocket();

    return () => {
      isMounted = false;
      socketRef.current?.offAny();
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [orderId, onOrderUpdated]);

  return socketRef.current;
}

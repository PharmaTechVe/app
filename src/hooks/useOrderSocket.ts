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
  onOrderUpdate: (order: Order) => void,
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

      sock.on('connect', () => console.log('[WS] Conectado con ID:', sock.id));
      sock.on('disconnect', (reason) =>
        console.log('[WS] Desconectado:', reason),
      );
      sock.on('connect_error', (err) =>
        console.log('[WS] Error en handshake:', err.message),
      );

      // Debug: ver todos los eventos que llegan
      sock.onAny((event, ...args) =>
        console.log('[WS] evento recibido:', event, args),
      );

      sock.on('order', (orderUpdated: Order) => {
        if (orderUpdated.id === orderId) {
          console.log('[WS] Estado actualizado:', orderUpdated.status);
          onOrderUpdate(orderUpdated);
        }
      });
    };

    setupSocket();

    return () => {
      isMounted = false;
      socketRef.current?.offAny();
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [orderId, onOrderUpdate]);

  return socketRef.current;
}

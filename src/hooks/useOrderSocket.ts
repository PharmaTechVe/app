// src/hooks/useOrderSocket.ts
import { useEffect, useRef, useCallback } from 'react';
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

  // Memoize the handler to avoid re-subscribing on every render
  const handleOrderUpdate = useCallback(
    (updatedOrder: Order) => {
      if (updatedOrder.id === orderId) {
        console.log('[WS] Estado actualizado:', updatedOrder.status);
        onOrderUpdate(updatedOrder);
      }
    },
    [onOrderUpdate, orderId],
  );

  useEffect(() => {
    if (!orderId) return;
    let isMounted = true;

    (async () => {
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

      sock.on('order', handleOrderUpdate);
    })();

    return () => {
      isMounted = false;
      const sock = socketRef.current;
      if (sock) {
        sock.off('connect');
        sock.off('disconnect');
        sock.off('connect_error');
        sock.offAny();
        sock.off('order', handleOrderUpdate);
        sock.disconnect();
      }
      socketRef.current = null;
    };
  }, [orderId, handleOrderUpdate]);

  return socketRef.current;
}

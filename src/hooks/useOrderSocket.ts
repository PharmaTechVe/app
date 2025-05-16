// src/hooks/useOrderSocket.ts
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
  // …otros campos de la orden…
}

export function useOrderSocket(
  orderId: string | null,
  onOrderUpdate: (order: Order) => void,
) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!orderId) return;
    let isMounted = true;

    SecureStore.getItemAsync('auth_token').then((token) => {
      if (!isMounted || !token) return;
      const sock = io(SOCKET_URL, {
        transports: ['websocket'],
        auth: { token },
      });
      socketRef.current = sock;

      sock.on('connect', () => console.log('[WS] Conectado con ID:', sock.id));
      sock.on('disconnect', (reason) =>
        console.log('[WS] Desconectado:', reason),
      );

      sock.on('order', (updatedOrder: Order) => {
        if (updatedOrder.id === orderId) {
          console.log('[WS] Estado actualizado:', updatedOrder.status);
          onOrderUpdate(updatedOrder);
        }
      });
    });

    return () => {
      isMounted = false;
      socketRef.current?.disconnect();
    };
  }, [orderId, onOrderUpdate]);

  return socketRef.current;
}
